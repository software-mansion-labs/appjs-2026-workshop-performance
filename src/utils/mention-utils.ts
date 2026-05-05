import { FeedComment, MOCK_FEED } from "@/data/mock-feed";

/**
 * Computes the Levenshtein edit distance between two strings.
 * Used to find fuzzy matches for @mention suggestions.
 */
function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Recursively collects all comments (including nested replies) from the tree.
 */
function flattenComments(comments: FeedComment[]): FeedComment[] {
  const result: FeedComment[] = [];
  for (const comment of comments) {
    result.push(comment);
    if (comment.replies && comment.replies.length > 0) {
      result.push(...flattenComments(comment.replies));
    }
  }
  return result;
}

/**
 * Collects comments from recent posts in the feed to build a comprehensive
 * user profile for mention suggestions. This ensures we suggest users
 * even if they haven't commented on the current post but are active nearby.
 */
function collectRecentComments(): FeedComment[] {
  const allComments: FeedComment[] = [];
  // Scan the last 200 posts to get a good sample of active users
  const recentPosts = MOCK_FEED.slice(0, 200);
  for (const post of recentPosts) {
    allComments.push(...flattenComments(post.comments));
  }
  return allComments;
}

/**
 * Builds a ranked list of @mention suggestions based on the comment thread context.
 * Analyzes the new comment text against all existing commenters and their messages
 * to suggest the most contextually relevant users to mention.
 *
 * Uses a global scan of the feed to provide better suggestions — users who are
 * active in similar topics across different posts get a relevance boost.
 */
export function buildMentionSuggestions(
  comments: FeedComment[],
  newCommentText: string
): { username: string; relevance: number }[] {
  // Collect comments from the current thread AND from the global feed
  // so we can suggest users who discuss similar topics elsewhere
  const threadComments = flattenComments(comments);
  const globalComments = collectRecentComments();

  // Build a profile of each commenter's vocabulary
  const userProfiles = new Map<
    string,
    {
      texts: string[];
      replyCount: number;
      totalLikes: number;
      avatar: string;
      isInThread: boolean;
    }
  >();

  // First pass: index users from the global feed
  for (const comment of globalComments) {
    if (!userProfiles.has(comment.username)) {
      userProfiles.set(comment.username, {
        texts: [],
        replyCount: 0,
        totalLikes: 0,
        avatar: comment.avatar,
        isInThread: false,
      });
    }
    const profile = userProfiles.get(comment.username)!;
    profile.texts.push(comment.text);
    profile.totalLikes += comment.likes;
    if (comment.replyingTo) {
      profile.replyCount++;
    }
  }

  // Second pass: mark users who are in the current thread
  const threadUsernames = new Set(threadComments.map((c) => c.username));
  for (const username of threadUsernames) {
    const profile = userProfiles.get(username);
    if (profile) {
      profile.isInThread = true;
    }
  }

  const newWords = newCommentText
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const suggestions: { username: string; relevance: number }[] = [];

  for (const [username, profile] of userProfiles) {
    let relevance = 0;

    // Score based on username similarity to words in the new comment
    for (const word of newWords) {
      const dist = editDistance(word.replace(/^@/, ""), username.toLowerCase());
      if (dist <= 2) {
        relevance += (10 - dist) * 3;
      }
    }

    // Score based on topical overlap — check how many words in the user's past
    // comments are close matches to words in the new comment
    for (const pastText of profile.texts) {
      const pastWords = pastText
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 0);

      for (const newWord of newWords) {
        for (const pastWord of pastWords) {
          const dist = editDistance(newWord, pastWord);
          if (dist <= 2) {
            relevance += Math.max(0, 5 - dist);
          }
        }
      }
    }

    // Boost active participants
    relevance += profile.replyCount * 2;
    relevance += Math.min(profile.totalLikes, 50);

    // Strong boost for users already in this thread
    if (profile.isInThread) {
      relevance *= 2;
    }

    suggestions.push({ username, relevance });
  }

  // Sort by relevance descending
  suggestions.sort((a, b) => b.relevance - a.relevance);

  return suggestions;
}
