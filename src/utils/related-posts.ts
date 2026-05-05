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

/**
 * Computes cosine similarity between two term-frequency vectors.
 * Builds a shared vocabulary, counts term occurrences, then computes
 * the cosine of the angle between the two vectors.
 */
function cosineSimilarity(wordsA: string[], wordsB: string[]): number {
  const freqA = new Map<string, number>();
  const freqB = new Map<string, number>();

  for (const w of wordsA) freqA.set(w, (freqA.get(w) || 0) + 1);
  for (const w of wordsB) freqB.set(w, (freqB.get(w) || 0) + 1);

  const allTerms = new Set([...freqA.keys(), ...freqB.keys()]);

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (const term of allTerms) {
    const a = freqA.get(term) || 0;
    const b = freqB.get(term) || 0;
    dotProduct += a * b;
    magA += a * a;
    magB += b * b;
  }

  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

/**
 * Tokenizes a text string into lowercase words, stripping punctuation
 * and filtering out common stop words.
 */
function tokenize(text: string): string[] {
  const stopWords = new Set([
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

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
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
 * This is intentionally expensive — it iterates over the entire feed,
 * tokenizes all captions and comments, and computes pairwise similarity
 * vectors. A perfect candidate for useMemo.
 */
export function findRelatedPosts(
  currentPost: FeedPost,
  limit: number = 6
): RelatedPostResult[] {
  console.log("Computing related posts for", currentPost.id); // Debug log to see when this runs
  const currentCaptionWords = tokenize(currentPost.caption);
  const currentCommentWords = collectCommentWords(currentPost);
  const currentTags = currentPost.tags.map(t => t.toLowerCase());

  const results: RelatedPostResult[] = [];

  for (const candidate of MOCK_FEED) {
    if (candidate.id === currentPost.id) continue;

    let score = 0;
    const reasons: string[] = [];

    // 1. Tag overlap — Jaccard similarity (weight: 30)
    const candidateTags = candidate.tags.map(t => t.toLowerCase());
    const tagSimilarity = jaccardSimilarity(currentTags, candidateTags);
    if (tagSimilarity > 0) {
      score += tagSimilarity * 30;
      const shared = currentTags.filter(t => candidateTags.includes(t));
      reasons.push(`#${shared[0]}`);
    }

    // 2. Caption similarity — cosine similarity of TF vectors (weight: 25)
    const candidateCaptionWords = tokenize(candidate.caption);
    const captionSim = cosineSimilarity(currentCaptionWords, candidateCaptionWords);
    if (captionSim > 0.05) {
      score += captionSim * 25;
      reasons.push("similar caption");
    }

    // 3. Comment topic similarity (weight: 20)
    const candidateCommentWords = collectCommentWords(candidate);
    const commentSim = cosineSimilarity(currentCommentWords, candidateCommentWords);
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
