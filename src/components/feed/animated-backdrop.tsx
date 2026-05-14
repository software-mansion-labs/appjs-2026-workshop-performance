import { useCallback } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Blur, Canvas, Circle, Fill, Group } from "@shopify/react-native-skia";
import {
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { useActivePost } from "@/context/active-post-context";
import { useImmersive } from "@/context/immersive-context";
import { findCenteredIndex } from "@/utils/feed-utils";

/**
 * Animated immersive backdrop.
 *
 * Renders a Skia Canvas with up to 27 blurred colored circles ("blobs") that
 * derive position and color from the currently visible posts' image palettes.
 * Each visible post contributes 9 swatches × up to 3 simultaneously visible
 * posts = 27 fixed slots.
 *
 * Architecture:
 *
 * - **Slot buffer pattern.** `slots` is a fixed-size SharedValue<Slot[]>
 *   reused across frames — zero per-frame allocations. Each frame: clear
 *   the buffer, then fill the active subset (up to 27).
 *
 * - **Three layers of computation:**
 *   1. `centeredIdx` (derived value) — index of the post nearest viewport
 *      center; recomputes only when scroll / layout changes.
 *   2. `visiblePostsData` (derived value) — pre-computed static data for
 *      centered post ± 1: image position, palette swatches, slot radius.
 *      Recomputes only when the visible set / layouts / palettes change.
 *   3. `frameWorklet` (60 fps) — clears the buffer, then writes 27 slots
 *      using time-based drift on top of the precomputed positions.
 *
 * - **Drift animation.** `DRIFT[r]` provides hand-tuned frequencies and
 *   phase offsets per swatch index — each blob oscillates with its own
 *   pattern, giving organic visual variety.
 *
 * - **Frame callback gating.** `useAnimatedReaction` toggles the frame
 *   callback active/inactive when immersive mode flips, so we don't run
 *   per-frame work when the backdrop isn't visible.
 */

const REGIONS_PER_POST = 9;
const VISIBLE_POSTS = 3;
const TOTAL_SLOTS = VISIBLE_POSTS * REGIONS_PER_POST;

const BOTTOM_RADIUS_BOOST = 2.5;
const RADIUS_PER_CELL = 1.5;
const RADIUS_PULSE = 0.2;
const BLUR_RADIUS = 80;
const OFFSCREEN_COORD = -10000;

// Hand-tuned per-blob oscillation parameters — frequencies (fx/fy/fr) and
// phase offsets (phx/phy/phr) for x, y, and radius drift via sin/cos.
// Each row is consumed by one swatch index (mod DRIFT.length); having 9
// distinct entries gives every blob within a post a unique motion pattern.
const DRIFT = [
  { fx: 0.0011, fy: 0.0015, phx: 0.2, phy: 1.7, fr: 0.0013, phr: 3.4 },
  { fx: 0.0016, fy: 0.0010, phx: 2.4, phy: 0.5, fr: 0.0009, phr: 1.1 },
  { fx: 0.0013, fy: 0.0014, phx: 4.6, phy: 3.1, fr: 0.0015, phr: 5.7 },
  { fx: 0.0014, fy: 0.0011, phx: 1.1, phy: 4.2, fr: 0.0011, phr: 2.0 },
  { fx: 0.0010, fy: 0.0016, phx: 5.3, phy: 1.8, fr: 0.0017, phr: 4.5 },
  { fx: 0.0015, fy: 0.0011, phx: 3.7, phy: 5.4, fr: 0.0012, phr: 0.8 },
  { fx: 0.0011, fy: 0.0015, phx: 0.9, phy: 2.8, fr: 0.0014, phr: 3.9 },
  { fx: 0.0017, fy: 0.0009, phx: 4.1, phy: 0.3, fr: 0.0010, phr: 5.2 },
  { fx: 0.0009, fy: 0.0013, phx: 2.6, phy: 5.9, fr: 0.0016, phr: 1.5 },
];

interface Slot {
  cx: number;
  cy: number;
  radius: number;
  color: string;
}

interface VisiblePost {
  imageScreenTopBase: number;
  imageH: number;
  slotRadius: number;
  swatches: { row: number; col: number; r: number; g: number; b: number }[];
  gridWidth: number;
  gridHeight: number;
}

const clearSlots = (out: Slot[]) => {
  "worklet";
  for (let i = 0; i < TOTAL_SLOTS; i++) {
    out[i].cx = OFFSCREEN_COORD;
    out[i].cy = OFFSCREEN_COORD;
    out[i].radius = 1;
    out[i].color = "transparent";
  }
};

const Blob = ({ index, slots }: { index: number; slots: SharedValue<Slot[]> }) => {
  const cx = useDerivedValue(() => slots.value[index]?.cx ?? OFFSCREEN_COORD);
  const cy = useDerivedValue(() => slots.value[index]?.cy ?? OFFSCREEN_COORD);
  const radius = useDerivedValue(() => slots.value[index]?.radius ?? 1);
  const color = useDerivedValue(() => slots.value[index]?.color ?? "transparent");

  return <Circle cx={cx} cy={cy} r={radius} color={color} />;
};

export const AnimatedBackdrop = () => {
  const { width, height } = useWindowDimensions();
  const { scrollY, viewportHeight, cardLayouts, imageLayouts, palettes } = useActivePost();
  const { immersive } = useImmersive();

  const driftAmpX = width * 0.12;
  const driftAmpY = height * 0.08;

  const time = useSharedValue(0);

  const slots = useSharedValue<Slot[]>(
    Array.from({ length: TOTAL_SLOTS }, () => ({
      cx: OFFSCREEN_COORD,
      cy: OFFSCREEN_COORD,
      radius: 1,
      color: "transparent",
    })),
  );

  // Sorted post ids by absolute Y in scroll content. Recomputes only when
  // cardLayouts changes (post mount / unmount / resize).
  const mountedIds = useDerivedValue<string[]>(() => {
    const cards = cardLayouts.value;
    const ids: string[] = [];
    for (const id in cards) {
      ids.push(id);
    }
    ids.sort((a, b) => cards[a].y - cards[b].y);
    return ids;
  });

  // Index in `mountedIds` of the post nearest viewport center.
  // -1 if no posts are mounted or viewport not measured.
  const centeredIdx = useDerivedValue(() => {
    const ids = mountedIds.value;
    const vh = viewportHeight.value;
    if (vh <= 0 || ids.length === 0) return -1;
    return findCenteredIndex(ids, cardLayouts.value, scrollY.value + vh / 2);
  });

  // Pre-computed static data for the up-to-3 visible posts (centered ± 1).
  // Recomputes when posts / layouts / palettes change — NOT every frame.
  // `imageScreenTopBase` is the absolute Y in scroll content; the frame
  // worklet subtracts current scrollY to get screen-space top.
  const visiblePostsData = useDerivedValue<VisiblePost[]>(() => {
    const idx = centeredIdx.value;
    if (idx < 0) return [];
    const ids = mountedIds.value;
    const cards = cardLayouts.value;
    const imgs = imageLayouts.value;
    const paletteMap = palettes.value;

    const start = Math.max(0, idx - 1);
    const end = Math.min(ids.length - 1, idx + 1);
    const result: VisiblePost[] = [];

    for (let p = start; p <= end; p++) {
      const id = ids[p];
      const card = cards[id];
      const palette = paletteMap[id];
      const img = imgs[id];
      if (!card || !palette || !img) continue;

      const cellEdge =
        Math.min(img.height, width) / Math.max(palette.gridWidth, palette.gridHeight);
      result.push({
        imageScreenTopBase: card.y + img.y,
        imageH: img.height,
        slotRadius: cellEdge * RADIUS_PER_CELL,
        swatches: palette.swatches,
        gridWidth: palette.gridWidth,
        gridHeight: palette.gridHeight,
      });
    }
    return result;
  });

  const frameWorklet = useCallback(
    (info: { timeSincePreviousFrame: number | null }) => {
      "worklet";
      time.value += info.timeSincePreviousFrame ?? 16;

      const t = time.value;
      const sy = scrollY.value;
      const visible = visiblePostsData.value;

      slots.modify(value => {
        // Reanimated's modify() callback is generic over T extends Slot[];
        // cast once at the boundary so helpers and indexing work with the
        // concrete Slot type below.
        const out = value as Slot[];

        // Phase 1: clear reused buffer (offscreen + transparent)
        clearSlots(out);

        // Phase 2: write 9 swatches × up-to-3 visible posts → 27 slots
        // with time-based drift on top of precomputed positions.
        let slotIdx = 0;
        for (let p = 0; p < visible.length; p++) {
          const post = visible[p];
          const colDenom = post.gridWidth > 1 ? post.gridWidth - 1 : 1;
          const rowDenom = post.gridHeight > 1 ? post.gridHeight - 1 : 1;
          const swatchCount = Math.min(post.swatches.length, REGIONS_PER_POST);
          const imageScreenTop = post.imageScreenTopBase - sy;

          for (let r = 0; r < REGIONS_PER_POST; r++) {
            if (r >= swatchCount) {
              slotIdx++;
              continue;
            }
            const swatch = post.swatches[r];
            const colFrac = post.gridWidth > 1 ? swatch.col / colDenom : 0.5;
            const rowFrac = post.gridHeight > 1 ? swatch.row / rowDenom : 0.5;
            const d = DRIFT[r % DRIFT.length];
            const dx = Math.sin(t * d.fx + d.phx) * driftAmpX;
            const dy = Math.cos(t * d.fy + d.phy) * driftAmpY;
            const radiusFactor = 1 + Math.sin(t * d.fr + d.phr) * RADIUS_PULSE;
            const rowBoost = 1 + rowFrac * (BOTTOM_RADIUS_BOOST - 1);
            const slot = out[slotIdx];
            slot.cx = width * colFrac + dx;
            slot.cy = imageScreenTop + post.imageH * rowFrac + dy;
            slot.radius = post.slotRadius * rowBoost * radiusFactor;
            slot.color = `rgb(${swatch.r}, ${swatch.g}, ${swatch.b})`;
            slotIdx++;
          }
        }

        return value;
      });
    },
    [width, driftAmpX, driftAmpY, time, scrollY, slots, visiblePostsData],
  );

  const frameCallback = useFrameCallback(frameWorklet, false);

  const setFrameActive = useCallback(
    (active: boolean) => frameCallback.setActive(active),
    [frameCallback],
  );

  useAnimatedReaction(
    () => immersive.value,
    curr => scheduleOnRN(setFrameActive, curr),
  );

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Fill color="rgb(245, 240, 235)" />
      <Group>
        <Blur blur={BLUR_RADIUS} />
        {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
          <Blob key={i} index={i} slots={slots} />
        ))}
      </Group>
    </Canvas>
  );
};
