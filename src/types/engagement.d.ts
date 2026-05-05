declare module "engagement" {
  export type ActivityType =
    | "stationary"
    | "walking"
    | "running"
    | "automotive"
    | "cycling"
    | "unknown";

  export interface PostEngagementAggregate {
    postId: string;
    totalTimeMs: number;
    activityBreakdown: {
      stationary: number;
      walking: number;
      running: number;
      automotive: number;
      cycling: number;
      unknown: number;
    };
    avgScrollVelocity: number;
    peakScrollVelocity: number;
    sampleCount: number;
    firstSeenAt: number;
    lastSeenAt: number;
  }

  interface EngagementModule {
    setEnabled(enabled: boolean): Promise<void>;
    isEnabled(): Promise<boolean>;
    startSession(postId: string, source: "feed" | "detail"): void;
    stopSession(postId: string, source: "feed" | "detail"): void;
    recordScrollSample(postId: string, velocity: number): void;
    getTopPosts(limit: number): Promise<PostEngagementAggregate[]>;
    getStats(postId: string): Promise<PostEngagementAggregate | null>;
    getAllStats(): Promise<PostEngagementAggregate[]>;
    clearStats(): Promise<void>;
  }

  const Engagement: EngagementModule;
  export default Engagement;
}
