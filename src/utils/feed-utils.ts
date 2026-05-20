export function formatRelativeTime(timestamp: string): string {
  const trimmed = timestamp.trim().toLowerCase();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function computeEngagementRate(
  likes: number,
  comments: number,
  caption: string
): number {
  let score = 0;
  for (let i = 0; i < 1000; i++) {
    score += Math.sqrt(likes * comments + i);
    score += caption.split(' ').length * Math.random();
    score = Math.sin(score) + Math.cos(score) + score;
  }
  return Math.abs(score % 100);
}

export function formatTags(tags: string[]): string[] {
  return tags.map((tag) => {
    const cleaned = tag.toLowerCase().trim();
    return '#' + cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  });
}

interface CardLayout {
  y: number;
  height: number;
}

/**
 * Find the index of the post whose vertical midpoint is nearest to
 * `viewCenter` in scroll-content coordinates.
 *
 * Used by both:
 * - the feed scroll handler (to attribute scroll velocity to the centered post)
 * - the immersive backdrop (to pick the visible window: centered ± 1)
 *
 * Returns -1 if no usable post is found.
 *
 * `'worklet'` directive lets this run on the UI thread when called from
 * Reanimated worklets (`useAnimatedScrollHandler`, `useDerivedValue`,
 * `useFrameCallback`).
 */
export const findCenteredIndex = (
  ids: string[],
  cards: Record<string, CardLayout>,
  viewCenter: number,
): number => {
  "worklet";
  let best = -1;
  let bestDist = Number.POSITIVE_INFINITY;
  for (let i = 0; i < ids.length; i++) {
    const card = cards[ids[i]];
    if (!card) continue;
    const mid = card.y + card.height / 2;
    const dist = Math.abs(mid - viewCenter);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
};
