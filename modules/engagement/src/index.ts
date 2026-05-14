import { requireNativeModule } from "expo-modules-core";

export type ActivityType =
  | "stationary"
  | "walking"
  | "running"
  | "automotive"
  | "cycling"
  | "unknown";

export type Confidence = "low" | "medium" | "high";

export type EngagementSource = "feed" | "detail";

export interface ActivityBreakdown {
  stationary: number;
  walking: number;
  running: number;
  automotive: number;
  cycling: number;
  unknown: number;
}

export interface PostEngagementAggregate {
  postId: string;
  totalTimeMs: number;
  activityBreakdown: ActivityBreakdown;
  avgScrollVelocity: number;
  peakScrollVelocity: number;
  sampleCount: number;
  firstSeenAt: number;
  lastSeenAt: number;
}

export interface EngagementModule {
  setEnabled(enabled: boolean): Promise<void>;
  isEnabled(): Promise<boolean>;
  startSession(postId: string, source: EngagementSource): void;
  stopSession(postId: string, source: EngagementSource): void;
  recordScrollSample(postId: string, velocity: number): void;
  getTopPosts(limit: number): Promise<PostEngagementAggregate[]>;
  getStats(postId: string): Promise<PostEngagementAggregate | null>;
  getAllStats(): Promise<PostEngagementAggregate[]>;
  clearStats(): Promise<void>;
}

const Engagement = requireNativeModule<EngagementModule>("Engagement");

export default Engagement;
