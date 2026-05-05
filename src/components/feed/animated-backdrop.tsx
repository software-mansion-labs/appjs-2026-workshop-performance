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

const REGIONS_PER_POST = 9;
const VISIBLE_POSTS = 3;
const TOTAL_SLOTS = VISIBLE_POSTS * REGIONS_PER_POST;

const BOTTOM_RADIUS_BOOST = 2.5;
const RADIUS_PER_CELL = 1.5;

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

const RADIUS_PULSE = 0.2;

const OFFSCREEN_COORD = -10000;

interface Slot {
  cx: number;
  cy: number;
  radius: number;
  color: string;
}

const EMPTY_SLOT: Slot = {
  cx: OFFSCREEN_COORD,
  cy: OFFSCREEN_COORD,
  radius: 1,
  color: "transparent",
};

const BLUR_RADIUS = 80;

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
    Array.from({ length: TOTAL_SLOTS }, () => ({ ...EMPTY_SLOT })),
  );

  const mountedIds = useDerivedValue<string[]>(() => {
    const cards = cardLayouts.value;
    const ids: string[] = [];
    for (const id in cards) {
      ids.push(id);
    }
    ids.sort((a, b) => cards[a].y - cards[b].y);
    return ids;
  });

  const frameWorklet = useCallback(
    (info: { timeSincePreviousFrame: number | null }) => {
      "worklet";
      time.value += info.timeSincePreviousFrame ?? 16;

      const cards = cardLayouts.value;
      const images = imageLayouts.value;
      const paletteMap = palettes.value;
      const sy = scrollY.value;
      const vh = viewportHeight.value;
      const ids = mountedIds.value;
      const t = time.value;

      slots.modify(out => {
        for (let i = 0; i < TOTAL_SLOTS; i++) {
          const slot = (out as Slot[])[i];
          slot.cx = OFFSCREEN_COORD;
          slot.cy = OFFSCREEN_COORD;
          slot.radius = 1;
          slot.color = "transparent";
        }

        if (vh <= 0 || ids.length === 0) return out;

        const viewCenter = sy + vh / 2;
        let centerIdx = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        for (let i = 0; i < ids.length; i++) {
          const card = cards[ids[i]];
          if (!card) continue;
          const mid = card.y + card.height / 2;
          const dist = Math.abs(mid - viewCenter);
          if (dist < bestDist) {
            bestDist = dist;
            centerIdx = i;
          }
        }

        const startIdx = Math.max(0, centerIdx - 1);
        const endIdx = Math.min(ids.length - 1, centerIdx + 1);

        let slotIdx = 0;
        for (let p = startIdx; p <= endIdx; p++) {
          const id = ids[p];
          const card = cards[id];
          const palette = paletteMap[id];
          const img = images[id];
          if (!card || !palette || !img) {
            slotIdx += REGIONS_PER_POST;
            continue;
          }

          const imageScreenTop = card.y + img.y - sy;
          const imageH = img.height;
          const cellEdge = Math.min(imageH, width) / Math.max(palette.gridWidth, palette.gridHeight);
          const slotRadius = cellEdge * RADIUS_PER_CELL;

          const colDenom = palette.gridWidth > 1 ? palette.gridWidth - 1 : 1;
          const rowDenom = palette.gridHeight > 1 ? palette.gridHeight - 1 : 1;
          const swatchCount = Math.min(palette.swatches.length, REGIONS_PER_POST);

          for (let r = 0; r < REGIONS_PER_POST; r++) {
            if (r >= swatchCount) {
              slotIdx++;
              continue;
            }
            const swatch = palette.swatches[r];
            const colFrac = palette.gridWidth > 1 ? swatch.col / colDenom : 0.5;
            const rowFrac = palette.gridHeight > 1 ? swatch.row / rowDenom : 0.5;
            const d = DRIFT[r % DRIFT.length];
            const dx = Math.sin(t * d.fx + d.phx) * driftAmpX;
            const dy = Math.cos(t * d.fy + d.phy) * driftAmpY;
            const radiusFactor = 1 + Math.sin(t * d.fr + d.phr) * RADIUS_PULSE;
            const rowBoost = 1 + rowFrac * (BOTTOM_RADIUS_BOOST - 1);
            const slot = (out as Slot[])[slotIdx];
            slot.cx = width * colFrac + dx;
            slot.cy = imageScreenTop + imageH * rowFrac + dy;
            slot.radius = slotRadius * rowBoost * radiusFactor;
            slot.color = `rgb(${swatch.r}, ${swatch.g}, ${swatch.b})`;
            slotIdx++;
          }
        }

        return out;
      });
    },
    [
      width,
      driftAmpX,
      driftAmpY,
      time,
      cardLayouts,
      imageLayouts,
      palettes,
      scrollY,
      viewportHeight,
      mountedIds,
      slots,
    ],
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
