import { FeedPost, MOCK_FEED } from "@/data/mock-feed";

/**
 * Computes the Jaccard similarity between two sets represented as arrays.
 * Returns a value between 0 (no overlap) and 1 (identical sets).
 */
function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Builds a term-frequency map and its squared magnitude in one pass. */
function buildTFVector(words: string[]): { freq: Map<string, number>; magSq: number } {
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  let magSq = 0;
  for (const count of freq.values()) magSq += count * count;
  return { freq, magSq };
}

/**
 * Computes cosine similarity between two pre-built TF vectors.
 * Only iterates over the smaller map for the dot product, which avoids
 * constructing a union set of all terms.
 */
function cosineSimilarityTF(
  a: { freq: Map<string, number>; magSq: number },
  b: { freq: Map<string, number>; magSq: number }
): number {
  if (a.magSq === 0 || b.magSq === 0) return 0;

  // Iterate over the smaller map for dot product
  const [smaller, larger] = a.freq.size <= b.freq.size ? [a.freq, b.freq] : [b.freq, a.freq];

  let dotProduct = 0;
  for (const [term, count] of smaller) {
    const otherCount = larger.get(term);
    if (otherCount !== undefined) {
      dotProduct += count * otherCount;
    }
  }

  return dotProduct === 0 ? 0 : dotProduct / (Math.sqrt(a.magSq) * Math.sqrt(b.magSq));
}

/**
 * Stop words set — hoisted to module scope so it's constructed once
 * instead of on every tokenize() call.
 */
const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "to", "of", "in", "for",
  "on", "with", "at", "by", "from", "as", "into", "through", "during",
  "before", "after", "above", "below", "between", "out", "off", "over",
  "under", "again", "further", "then", "once", "and", "but", "or", "nor",
  "not", "so", "yet", "both", "either", "neither", "each", "every", "all",
  "any", "few", "more", "most", "other", "some", "such", "no", "only",
  "own", "same", "than", "too", "very", "just", "because", "if", "when",
  "where", "how", "what", "which", "who", "whom", "this", "that", "these",
  "those", "i", "me", "my", "we", "our", "you", "your", "he", "him",
  "his", "she", "her", "it", "its", "they", "them", "their", "about",
]);

/**
 * Tokenizes a text string into lowercase words, stripping punctuation
 * and filtering out common stop words.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Collects all text content from a post's comment tree (recursively)
 * to build a "topic fingerprint" for the discussion.
 */
function collectCommentWords(post: FeedPost): string[] {
  const words: string[] = [];
  const stack = [...post.comments];
  while (stack.length > 0) {
    const comment = stack.pop()!;
    words.push(...tokenize(comment.text));
    if (comment.replies) {
      stack.push(...comment.replies);
    }
  }
  return words;
}

/**
 * Computes the Haversine distance in km between two lat/lng coordinates.
 */
function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface RelatedPostResult {
  post: FeedPost;
  score: number;
  reasons: string[];
}

/** Cached per-candidate data that only needs to be computed once. */
interface CandidateCache {
  tags: string[];
  tagSet: Set<string>;
  captionTF: { freq: Map<string, number>; magSq: number };
  commentTF: { freq: Map<string, number>; magSq: number };
}

let candidateCache: Map<string, CandidateCache> | null = null;

function getCandidateCache(): Map<string, CandidateCache> {
  if (candidateCache) return candidateCache;
  candidateCache = new Map();
  for (const post of MOCK_FEED) {
    const tags = post.tags.map(t => t.toLowerCase());
    candidateCache.set(post.id, {
      tags,
      tagSet: new Set(tags),
      captionTF: buildTFVector(tokenize(post.caption)),
      commentTF: buildTFVector(collectCommentWords(post)),
    });
  }
  return candidateCache;
}

/**
 * Finds posts related to the given post by scoring every other post in
 * MOCK_FEED across multiple similarity dimensions:
 *
 * 1. Tag overlap (Jaccard similarity)
 * 2. Caption text similarity (cosine similarity of TF vectors)
 * 3. Comment topic similarity (cosine similarity of all comment text)
 * 4. Geographic proximity (Haversine distance)
 * 5. Engagement similarity (normalized difference in likes/comments)
 * 6. Same author boost
 *
 * Optimized: pre-builds and caches TF vectors per candidate, hoists
 * stop words to module scope, and iterates only the smaller vector
 * in cosine similarity.
 */
export function findRelatedPosts(
  currentPost: FeedPost,
  limit: number = 6
): RelatedPostResult[] {
  console.log("Computing related posts for", currentPost.id);
  const cache = getCandidateCache();

  const currentTags = currentPost.tags.map(t => t.toLowerCase());
  const currentTagSet = new Set(currentTags);
  const currentCaptionTF = buildTFVector(tokenize(currentPost.caption));
  const currentCommentTF = buildTFVector(collectCommentWords(currentPost));

  const results: RelatedPostResult[] = [];

  for (const candidate of MOCK_FEED) {
    if (candidate.id === currentPost.id) continue;

    const cached = cache.get(candidate.id)!;
    let score = 0;
    const reasons: string[] = [];

    // 1. Tag overlap — Jaccard similarity (weight: 30)
    const tagSimilarity = jaccardSimilarity(currentTags, cached.tags);
    if (tagSimilarity > 0) {
      score += tagSimilarity * 30;
      // Find first shared tag using the pre-built set
      for (const t of currentTags) {
        if (cached.tagSet.has(t)) {
          reasons.push(`#${t}`);
          break;
        }
      }
    }

    // 2. Caption similarity — cosine similarity of TF vectors (weight: 25)
    const captionSim = cosineSimilarityTF(currentCaptionTF, cached.captionTF);
    if (captionSim > 0.05) {
      score += captionSim * 25;
      reasons.push("similar caption");
    }

    // 3. Comment topic similarity (weight: 20)
    const commentSim = cosineSimilarityTF(currentCommentTF, cached.commentTF);
    if (commentSim > 0.05) {
      score += commentSim * 20;
    }

    // 4. Geographic proximity (weight: 15, max at same location)
    if (currentPost.location?.coordinates && candidate.location?.coordinates) {
      const dist = haversineDistance(
        currentPost.location.coordinates.latitude,
        currentPost.location.coordinates.longitude,
        candidate.location.coordinates.latitude,
        candidate.location.coordinates.longitude
      );
      const proxScore = Math.max(0, 1 - dist / 500); // decay over 500km
      if (proxScore > 0.1) {
        score += proxScore * 15;
        reasons.push("nearby");
      }
    }

    // 5. Engagement similarity (weight: 5)
    const engagementDiff = Math.abs(currentPost.likes - candidate.likes) /
      Math.max(currentPost.likes, candidate.likes, 1);
    score += (1 - engagementDiff) * 5;

    // 6. Same author boost (weight: 10)
    if (candidate.user.username === currentPost.user.username) {
      score += 10;
      reasons.push("same author");
    }

    if (score > 0) {
      results.push({ post: candidate, score, reasons });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
