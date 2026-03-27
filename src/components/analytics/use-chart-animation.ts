import { useEffect, useRef } from "react";
import { useSharedValue, withTiming, useDerivedValue, type SharedValue } from "react-native-reanimated";

import { FeedPost } from "@/data/mock-feed";
import { lerpArrays, findPeakIndex, getPointX } from "./chart-utils";

const ANIM_DURATION = 500;

export interface AnimatedSeriesData {
  data: SharedValue<number[]>;
  max: SharedValue<number>;
}

export interface ChartAnimationResult {
  progress: SharedValue<number>;
  likes: AnimatedSeriesData;
  comments: AnimatedSeriesData;
  shares: AnimatedSeriesData;
  rawLikes: number[];
  rawComments: number[];
  rawShares: number[];
  maxLikes: number;
  maxComments: number;
  maxShares: number;
  prevPeakX: SharedValue<number>;
  targetPeakX: SharedValue<number>;
}

export function useChartAnimation(post: FeedPost, days: number): ChartAnimationResult {
  const likesData = post.chartData.likes[days] ?? post.chartData.likes[30];
  const commentsData = post.chartData.comments[days] ?? post.chartData.comments[30];
  const sharesData = post.chartData.shares[days] ?? post.chartData.shares[30];
  const maxLikes = Math.max(...likesData, 1);
  const maxComments = Math.max(...commentsData, 1);
  const maxShares = Math.max(...sharesData, 1);
  const currentPeakX = getPointX(findPeakIndex(likesData), likesData.length);

  const progress = useSharedValue(1);

  const prevLikesRef = useRef(likesData);
  const prevCommentsRef = useRef(commentsData);
  const prevSharesRef = useRef(sharesData);
  const prevMaxLikesRef = useRef(maxLikes);
  const prevMaxCommentsRef = useRef(maxComments);
  const prevMaxSharesRef = useRef(maxShares);
  const prevPeakXRef = useRef(currentPeakX);

  const targetLikes = useSharedValue(likesData);
  const targetComments = useSharedValue(commentsData);
  const targetShares = useSharedValue(sharesData);
  const prevLikes = useSharedValue(likesData);
  const prevComments = useSharedValue(commentsData);
  const prevShares = useSharedValue(sharesData);
  const targetMaxLikes = useSharedValue(maxLikes);
  const targetMaxComments = useSharedValue(maxComments);
  const targetMaxShares = useSharedValue(maxShares);
  const prevMaxLikes = useSharedValue(maxLikes);
  const prevMaxComments = useSharedValue(maxComments);
  const prevMaxShares = useSharedValue(maxShares);

  const prevPeakX = useSharedValue(currentPeakX);
  const targetPeakX = useSharedValue(currentPeakX);

  useEffect(() => {
    prevLikes.value = prevLikesRef.current;
    prevComments.value = prevCommentsRef.current;
    prevShares.value = prevSharesRef.current;
    prevMaxLikes.value = prevMaxLikesRef.current;
    prevMaxComments.value = prevMaxCommentsRef.current;
    prevMaxShares.value = prevMaxSharesRef.current;
    prevPeakX.value = prevPeakXRef.current;

    targetLikes.value = likesData;
    targetComments.value = commentsData;
    targetShares.value = sharesData;
    targetMaxLikes.value = maxLikes;
    targetMaxComments.value = maxComments;
    targetMaxShares.value = maxShares;
    targetPeakX.value = currentPeakX;

    progress.value = 0;
    progress.value = withTiming(1, { duration: ANIM_DURATION });

    prevLikesRef.current = likesData;
    prevCommentsRef.current = commentsData;
    prevSharesRef.current = sharesData;
    prevMaxLikesRef.current = maxLikes;
    prevMaxCommentsRef.current = maxComments;
    prevMaxSharesRef.current = maxShares;
    prevPeakXRef.current = currentPeakX;
  }, [post.id, days]);

  function useInterpolatedSeries(
    prev: SharedValue<number[]>,
    target: SharedValue<number[]>,
    prevMax: SharedValue<number>,
    targetMax: SharedValue<number>
  ): AnimatedSeriesData {
    const data = useDerivedValue(() => {
      "worklet";
      return lerpArrays(prev.value, target.value, progress.value);
    });
    const max = useDerivedValue(() => {
      "worklet";
      return prevMax.value + (targetMax.value - prevMax.value) * progress.value;
    });
    return { data, max };
  }

  return {
    progress,
    likes: useInterpolatedSeries(prevLikes, targetLikes, prevMaxLikes, targetMaxLikes),
    comments: useInterpolatedSeries(prevComments, targetComments, prevMaxComments, targetMaxComments),
    shares: useInterpolatedSeries(prevShares, targetShares, prevMaxShares, targetMaxShares),
    rawLikes: likesData,
    rawComments: commentsData,
    rawShares: sharesData,
    maxLikes,
    maxComments,
    maxShares,
    prevPeakX,
    targetPeakX,
  };
}
