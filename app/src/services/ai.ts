/* AI service interface — memory search, milestone detection, and generation.
 *
 * Today this is a deterministic mock that reproduces the prototype's canned
 * responses, so the assistant and search work offline. Phase 3 replaces the
 * body of each function with calls to the real pipeline (face clustering,
 * natural-language search, reel/book/story generation) behind the SAME
 * signatures, so no UI changes are needed.
 *
 * Keep these functions async — the real implementations are network calls. */
import { G } from '../data/content';

export type AssistantReply = {
  text: string;
  /** Indices into the G palette for the preview thumbnails. */
  photoIdx: number[];
  /** A deep-link action the UI can offer ('book' | 'reel' | 'shop' | 'search'). */
  actionKey: 'book' | 'reel' | 'shop' | 'search' | null;
};

/** Natural-language reply for the Family Chat assistant. */
export async function askAssistant(text: string): Promise<AssistantReply> {
  const q = (text || '').toLowerCase();
  if (q.includes('birthday'))
    return { text: 'Found 23 photos and 4 clips from Roan’s 1st birthday — 14 Oct 2025. Want me to make a memory book?', photoIdx: [0, 3, 8, 5], actionKey: 'book' };
  if (q.includes('reel') || q.includes('video') || q.includes('month'))
    return { text: 'I built an April reel — 0:48, 32 clips set to music. Have a look.', photoIdx: [1, 6, 9], actionKey: 'reel' };
  if (q.includes('step') || q.includes('mila'))
    return { text: 'Mila’s first steps were detected on 3 Mar 2026 and added to her timeline.', photoIdx: [4, 7, 11], actionKey: null };
  if (q.includes('print') || q.includes('canvas') || q.includes('book'))
    return { text: 'These would look beautiful as prints. Shall I open the Print Shop?', photoIdx: [3, 0], actionKey: 'shop' };
  return { text: 'I found 18 moments that match. Here’s a quick preview — open Search to see them all.', photoIdx: [2, 10, 5, 8], actionKey: 'search' };
}

export type SearchResult = { id: string; bg: string };

/** Natural-language photo search. */
export async function searchMemories(query: string): Promise<{ answer: string; sub: string; results: SearchResult[] }> {
  const idx = [0, 3, 8, 5, 1, 6, 9, 2, 10];
  return {
    answer: query ? `Found 23 moments for “${query}”` : '',
    sub: 'Roan · Oct 2025 — newest first',
    results: idx.map((i, k) => ({ id: 'sr' + k, bg: G[i % G.length] })),
  };
}
