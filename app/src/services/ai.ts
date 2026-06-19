/* AI service — memory search, the Family Chat assistant, and photo captioning.
 *
 * Phase 3: when a backend is configured these call the `ai` Supabase Edge
 * Function, which runs Claude server-side (the Anthropic key never reaches the
 * app). With no backend — tests, offline preview — they fall back to the
 * deterministic mock so the UI is fully explorable. Signatures are unchanged,
 * so no screen/overlay code changes when the backend is switched on. */
import { supabase } from '../lib/supabase';
import { G } from '../data/content';

export type AssistantReply = {
  text: string;
  /** Indices into the G palette for the preview thumbnails. */
  photoIdx: number[];
  /** A deep-link action the UI can offer ('book' | 'reel' | 'shop' | 'search'). */
  actionKey: 'book' | 'reel' | 'shop' | 'search' | null;
};

async function invoke<T>(body: Record<string, unknown>): Promise<T | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.functions.invoke('ai', { body });
  if (error || !data || (data as { error?: string }).error) return null;
  return data as T;
}

/** Natural-language reply for the Family Chat assistant. */
export async function askAssistant(text: string): Promise<AssistantReply> {
  const live = await invoke<AssistantReply>({ action: 'assistant', text });
  return live ?? mockAssistant(text);
}

export type SearchResult = { id: string; bg: string };

/** Natural-language photo search. */
export async function searchMemories(query: string): Promise<{ answer: string; sub: string; results: SearchResult[] }> {
  const idx = [0, 3, 8, 5, 1, 6, 9, 2, 10];
  const results = idx.map((i, k) => ({ id: 'sr' + k, bg: G[i % G.length] }));
  const live = await invoke<{ answer: string; sub: string }>({ action: 'search', query });
  if (live) return { answer: live.answer, sub: live.sub, results };
  return { answer: query ? `Found 23 moments for “${query}”` : '', sub: 'Roan · Oct 2025 — newest first', results };
}

/** Vision: caption + tag a photo (best-effort; used by the upload pipeline). */
export async function captionPhoto(mediaType: string, dataBase64: string): Promise<{ caption: string; tags: string[] } | null> {
  return invoke<{ caption: string; tags: string[] }>({ action: 'caption', mediaType, dataBase64 });
}

/* ---- Offline mock (mirrors the prototype's canned replies) ---- */
function mockAssistant(text: string): AssistantReply {
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
