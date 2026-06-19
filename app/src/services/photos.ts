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
 * The recent grid the Timeline shows. On device, Phase 2 replaces this with the
 * real on-device library scan; for now both platforms use the design's
 * placeholders so layout/behaviour are identical and reviewable.
 */
export function placeholderGrid(indices: number[]): LocalPhoto[] {
  return indices.map((i, k) => ({ id: 'g' + k, src: G[i % G.length], isGradient: true }));
}
