/* Native photo-library access.
 *
 * This is REAL functionality on a device: it asks for permission and reads the
 * user's photos via the Capacitor Camera plugin. On the web preview (no native
 * library) it falls back to the design's placeholder gradients so the UI is
 * still fully explorable.
 *
 * Phase 2 will extend this to background-scan the full library, thumbnail
 * on-device, and feed the AI pipeline (services/ai.ts). */
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { isNative } from '../lib/platform';
import { G } from '../data/content';
import { uploadMedia, setMediaCaption } from './storage';
import { enqueue, type Uploader } from './uploadQueue';
import { captionPhoto } from './ai';
import { recognizeChild } from './faces';

export type LocalPhoto = {
  id: string;
  /** A renderable source: a real `file://`/`data:` URI on device, or a CSS gradient on web. */
  src: string;
  isGradient: boolean;
};

/** Ask the OS for photo-library permission (no-op on web). */
export async function ensurePhotoPermission(): Promise<boolean> {
  if (!isNative()) return true;
  try {
    const status = await Camera.checkPermissions();
    if (status.photos === 'granted' || status.photos === 'limited') return true;
    const req = await Camera.requestPermissions({ permissions: ['photos'] });
    return req.photos === 'granted' || req.photos === 'limited';
  } catch {
    return false;
  }
}

/** Let the user pick a photo from their library (real picker on device). */
export async function pickFromLibrary(): Promise<LocalPhoto | null> {
  if (!isNative()) {
    // Web preview: simulate a pick with a placeholder.
    const i = Math.floor(Math.random() * G.length);
    return { id: 'web-' + i, src: G[i], isGradient: true };
  }
  try {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri,
      quality: 90,
    });
    if (!photo.webPath) return null;
    return { id: photo.path ?? photo.webPath, src: photo.webPath, isGradient: false };
  } catch {
    return null; // user cancelled or denied
  }
}

/**
 * Pick a photo and queue it for (background, retrying) upload. Returns whether
 * something was enqueued. No-op success in demo/web mode (nothing real to send).
 */
export async function pickAndQueueUpload(
  familyId: string,
  childId: string | null,
): Promise<{ ok: boolean; queued: boolean; error?: string }> {
  const picked = await pickFromLibrary();
  if (!picked) return { ok: false, queued: false, error: 'cancelled' };
  if (picked.isGradient) return { ok: true, queued: false }; // demo/web: nothing to upload
  await enqueue({
    familyId,
    childId,
    name: picked.id.split('/').pop() || 'photo.jpg',
    srcUri: picked.src,
  });
  return { ok: true, queued: true };
}

/**
 * Queue already-imported photos (from any import source) for upload.
 * Skips demo gradients; returns how many were enqueued.
 */
export async function queueImported(
  familyId: string,
  childId: string | null,
  items: { name: string; src: string; isGradient: boolean }[],
): Promise<number> {
  let n = 0;
  for (const it of items) {
    if (it.isGradient) continue; // demo placeholder, nothing real to upload
    await enqueue({ familyId, childId, name: it.name, srcUri: it.src });
    n++;
  }
  return n;
}

/** The uploader the queue runs: fetch the file by URI, store it, then (best
 * effort) ask the AI service to caption/tag it. */
export const runUpload: Uploader = async (item) => {
  try {
    const blob = await (await fetch(item.srcUri)).blob();
    // If no child was chosen, try to recognize one from the family's tagged faces.
    let childId = item.childId;
    if (!childId) {
      try { childId = await recognizeChild(item.familyId, item.srcUri); } catch { /* fall back to none */ }
    }
    const res = await uploadMedia(item.familyId, childId, blob, item.name);
    if (res.ok && res.path) void captionInBackground(res.path, blob);
    return res;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'upload failed' };
  }
};

/** Caption a freshly-uploaded image via the AI service; failures are ignored. */
async function captionInBackground(path: string, blob: Blob): Promise<void> {
  try {
    if (!blob.type.startsWith('image/') || blob.size > 4_000_000) return; // skip video / huge files
    const b64 = await blobToBase64(blob);
    const cap = await captionPhoto(blob.type, b64);
    if (cap) await setMediaCaption(path, cap.caption, cap.tags);
  } catch {
    /* captioning is non-critical */
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '');
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

/** Downscale an image Blob to a small JPEG thumbnail (on-device, for fast grids). */
export async function makeThumbnail(blob: Blob, max = 240): Promise<string | null> {
  if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') return null;
  try {
    const bmp = await createImageBitmap(blob);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d')?.drawImage(bmp, 0, 0, w, h);
    return canvas.toDataURL('image/jpeg', 0.7);
  } catch {
    return null;
  }
}

/**
 * The recent grid the Timeline shows. On device, Phase 2 replaces this with the
 * real on-device library scan; for now both platforms use the design's
 * placeholders so layout/behaviour are identical and reviewable.
 */
export function placeholderGrid(indices: number[]): LocalPhoto[] {
  return indices.map((i, k) => ({ id: 'g' + k, src: G[i % G.length], isGradient: true }));
}
