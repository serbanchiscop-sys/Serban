/* Upload-queue behaviour: persistence, success removal, retry, and offline. */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { enqueue, getQueue, processQueue, pendingCount, type QueuedUpload } from '../services/uploadQueue';

const item = (name: string) => ({ familyId: 'f1', childId: null, name, srcUri: 'file:///' + name });

beforeEach(() => localStorage.clear());

describe('uploadQueue', () => {
  it('persists enqueued items', async () => {
    await enqueue(item('a.jpg'));
    await enqueue(item('b.jpg'));
    expect(await pendingCount()).toBe(2);
    expect((await getQueue()).map((q) => q.name)).toEqual(['a.jpg', 'b.jpg']);
  });

  it('removes successfully uploaded items', async () => {
    await enqueue(item('a.jpg'));
    const upload = vi.fn(async () => ({ ok: true }));
    const res = await processQueue(upload);
    expect(res).toEqual({ done: 1, failed: 0 });
    expect(await pendingCount()).toBe(0);
  });

  it('retries failures and keeps them queued (capped)', async () => {
    await enqueue(item('a.jpg'));
    const upload = vi.fn(async () => ({ ok: false, error: 'boom' }));

    await processQueue(upload);                 // attempt 1
    expect((await getQueue())[0].attempts).toBe(1);
    await processQueue(upload);                 // attempt 2
    await processQueue(upload);                 // attempt 3 → reaches cap
    expect((await getQueue())[0].attempts).toBe(3);

    // At the cap it is skipped, not retried further.
    const before = upload.mock.calls.length;
    await processQueue(upload);
    expect(upload.mock.calls.length).toBe(before);
    expect(await pendingCount()).toBe(1);       // still present for manual retry
  });

  it('does nothing while offline', async () => {
    await enqueue(item('a.jpg'));
    const spy = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    const upload = vi.fn(async () => ({ ok: true }));
    const res = await processQueue(upload);
    expect(res).toEqual({ done: 0, failed: 0 });
    expect(upload).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('upload receives the queued item shape', async () => {
    await enqueue(item('a.jpg'));
    const upload = vi.fn(async (q: QueuedUpload) => { expect(q.srcUri).toBe('file:///a.jpg'); return { ok: true }; });
    await processQueue(upload);
    expect(upload).toHaveBeenCalledOnce();
  });
});
