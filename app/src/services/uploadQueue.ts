/* Durable upload queue — survives app restarts (Capacitor Preferences) and
 * retries failed uploads, flushing automatically when connectivity returns.
 * The actual upload is injected so the queue stays testable and decoupled. */
import { loadJSON, saveJSON } from './persistence';

export type QueuedUpload = {
  id: string;
  familyId: string;
  childId: string | null;
  name: string;
  srcUri: string;            // device file URI (persists) — re-fetched at upload time
  status: 'pending' | 'uploading' | 'error';
  attempts: number;
};

export type Uploader = (item: QueuedUpload) => Promise<{ ok: boolean; error?: string }>;

const KEY = 'fm.uploadQueue';
const MAX_ATTEMPTS = 3;

export const getQueue = () => loadJSON<QueuedUpload[]>(KEY, []);
const setQueue = (q: QueuedUpload[]) => saveJSON(KEY, q);

/** Number of items still waiting to upload (pending or retryable error). */
export async function pendingCount(): Promise<number> {
  return (await getQueue()).length;
}

export async function enqueue(item: Omit<QueuedUpload, 'id' | 'status' | 'attempts'>): Promise<QueuedUpload> {
  const q = await getQueue();
  const entry: QueuedUpload = { ...item, id: crypto.randomUUID(), status: 'pending', attempts: 0 };
  q.push(entry);
  await setQueue(q);
  return entry;
}

const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false;

/**
 * Process the queue sequentially. Successful items are removed; failures are
 * retried up to MAX_ATTEMPTS (then left as 'error' for a later manual retry).
 * No-op while offline.
 */
export async function processQueue(upload: Uploader): Promise<{ done: number; failed: number }> {
  if (isOffline()) return { done: 0, failed: 0 };
  const q = await getQueue();
  let done = 0, failed = 0;

  for (const item of q) {
    if (item.attempts >= MAX_ATTEMPTS) continue;
    item.status = 'uploading';
    await setQueue(q);
    const res = await upload(item);
    if (res.ok) {
      item.status = 'pending'; // mark done by removal below
      item.attempts = -1;      // sentinel: completed
      done++;
    } else {
      item.attempts += 1;
      item.status = 'error';
      failed++;
    }
    await setQueue(q);
  }

  // Drop completed items (attempts === -1).
  await setQueue((await getQueue()).filter((x) => x.attempts !== -1));
  return { done, failed };
}

/** Wire automatic flushing when the device comes back online. */
export function startAutoFlush(upload: Uploader): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => { void processQueue(upload); };
  window.addEventListener('online', handler);
  return () => window.removeEventListener('online', handler);
}
