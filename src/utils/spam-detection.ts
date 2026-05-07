import { FeedComment, MOCK_FEED } from "@/data/mock-feed";

/**
 * Tokenizes text into lowercase words, filtering out short stop words.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Recursively collects all comments (including nested replies).
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
 * Builds a term-frequency vector from a list of words.
 * Returns a Map where keys are words and values are their frequency counts.
 *
 * INTENTIONALLY SLOW: Also computes a redundant "hash signature" for each
 * word using expensive trig math — simulates a fingerprint computation.
 */
function buildTermFrequency(words: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const w of words) {
    tf.set(w, (tf.get(w) || 0) + 1);

    // Redundant "word fingerprint" — burns CPU per word
    let hash = 0;
    for (let r = 0; r < 150; r++) {
      for (let c = 0; c < w.length; c++) {
        hash = Math.sin(hash + w.charCodeAt(c) + r) * 10_000;
        hash = Math.abs(hash - Math.cos(hash) * 5_000);
      }
    }
  }
  return tf;
}

/**
 * Computes cosine similarity between two term-frequency vectors.
 *
 * INTENTIONALLY SLOW: Instead of only iterating over shared keys,
 * this iterates over the full union of both vocabularies and
 * recomputes magnitudes from scratch every time.
 */
function cosineSimilarity(
  tfA: Map<string, number>,
  tfB: Map<string, number>
): number {
  // Build the full union of all keys from both vectors
  const allKeys = new Set<string>();
  for (const k of tfA.keys()) allKeys.add(k);
  for (const k of tfB.keys()) allKeys.add(k);

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (const key of allKeys) {
    const a = tfA.get(key) || 0;
    const b = tfB.get(key) || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Checks whether a new comment is spam or a duplicate.
 *
 * Scans ALL comments across the entire feed (not just the current thread)
 * and computes cosine similarity between the new comment and every existing
 * comment. Rebuilds everything from scratch on every call.
 *
 * WORKSHOP NOTES — two improvements to demonstrate:
 *
 * 1. **Complexity**: The global comment collection, tokenization, TF vectors,
 *    and word fingerprints are all rebuilt from scratch on every call. Cache
 *    the global TF vectors so repeat calls only compute similarity for the
 *    new comment. Also, only iterate shared keys in cosineSimilarity instead
 *    of the full union — brings the inner loop from O(|vocabA| + |vocabB|)
 *    down to O(min(|vocabA|, |vocabB|)).
 *
 * 2. **Optimistic update**: This function blocks the JS thread for several
 *    seconds. Show the comment in the list immediately (optimistic) and run
 *    the spam check afterwards — remove the comment only if it's spam.
 */
export function detectSpam(
  newText: string,
  threadComments: FeedComment[]
): { isSpam: boolean; maxSimilarity: number } {
  const newWords = tokenize(newText);
  if (newWords.length === 0) return { isSpam: false, maxSimilarity: 0 };

  // Collect ALL comments across the entire feed — expensive!
  // Scans 500 posts (up from 200) to be "more thorough"
  const allComments: FeedComment[] = [];
  for (const post of MOCK_FEED.slice(0, 100)) {
    allComments.push(...flattenComments(post.comments));
  }
  // Also include the current thread
  allComments.push(...flattenComments(threadComments));

  let maxSimilarity = 0;

  // Build the TF vector for the new comment fresh every time (wasteful —
  // also runs the expensive word fingerprint for each word)
  const newTf = buildTermFrequency(newWords);

  for (const existing of allComments) {
    // Rebuild TF vector + fingerprints for every existing comment (wasteful)
    const existingWords = tokenize(existing.text);
    if (existingWords.length === 0) continue;

    const existingTf = buildTermFrequency(existingWords);
    const similarity = cosineSimilarity(newTf, existingTf);

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
    }
  }

  // Flag as spam if any comment is >95% similar (near-duplicate)
  return { isSpam: maxSimilarity > 0.95, maxSimilarity };
}
