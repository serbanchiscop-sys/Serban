/* On-device face recognition (face-api.js / TensorFlow.js).
 *
 * How auto-tagging works:
 *  1. When you tag a photo with a child, we compute a 128-float face descriptor
 *     and store it as a reference for that child (face_refs table).
 *  2. When a new photo is uploaded with no child, we compute its descriptor and
 *     match it against the family's reference faces — the nearest match within a
 *     distance threshold gets auto-assigned.
 *
 * Everything runs in the app (web + Capacitor WebView). Models load lazily from
 * a CDN. If models can't load or no face is found, we fall back silently to
 * manual tagging. */
import { supabase } from '../lib/supabase';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model';
const MATCH_THRESHOLD = 0.5; // lower = stricter (euclidean distance)

type FaceApi = typeof import('@vladmandic/face-api');
let faceapi: FaceApi | null = null;
let modelsReady: Promise<boolean> | null = null;

/** Lazy-load face-api + the detection/landmark/recognition models (once). */
async function ensureModels(): Promise<boolean> {
  if (!modelsReady) {
    modelsReady = (async () => {
      try {
        faceapi = await import('@vladmandic/face-api');
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        return true;
      } catch {
        return false;
      }
    })();
  }
  return modelsReady;
}

/** Compute a face descriptor for the largest face in an image URL/blob URL. */
export async function describeFace(url: string): Promise<number[] | null> {
  if (!(await ensureModels()) || !faceapi) return null;
  try {
    const img = await faceapi.fetchImage(url);
    const det = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    return det ? Array.from(det.descriptor) : null;
  } catch {
    return null;
  }
}

function distance(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; s += d * d; }
  return Math.sqrt(s);
}

type Ref = { childId: string; descriptor: number[] };

async function listFaceRefs(familyId: string): Promise<Ref[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('face_refs').select('child_id, descriptor').eq('family_id', familyId);
  return (data ?? []).map((r) => ({ childId: String(r.child_id), descriptor: r.descriptor as number[] }));
}

/** Store a reference face for a child (called when the user tags a photo). */
export async function rememberFace(familyId: string, childId: string, photoUrl: string): Promise<void> {
  if (!supabase) return;
  const descriptor = await describeFace(photoUrl);
  if (!descriptor) return;
  await supabase.from('face_refs').insert({ family_id: familyId, child_id: childId, descriptor });
}

/** Best-effort: which child (if any) does this image match? */
export async function recognizeChild(familyId: string, photoUrl: string): Promise<string | null> {
  const refs = await listFaceRefs(familyId);
  if (refs.length === 0) return null;
  const descriptor = await describeFace(photoUrl);
  if (!descriptor) return null;
  let best: { childId: string; d: number } | null = null;
  for (const ref of refs) {
    const d = distance(descriptor, ref.descriptor);
    if (!best || d < best.d) best = { childId: ref.childId, d };
  }
  return best && best.d <= MATCH_THRESHOLD ? best.childId : null;
}
