/* Cloud photo/video storage service.
 *
 * Phase 2: uploads to a Supabase Storage bucket and reports real usage. Falls
 * back to the design's static quota (4.8 / 5 GB) in demo mode so the Family
 * screen renders identically offline. Premium lifts the cap to unlimited. */
import { supabase } from '../lib/supabase';

export type Quota = { usedGb: number; totalGb: number | 'unlimited' };

const BUCKET = 'family-media';
const FREE_GB = 5;

export async function getQuota(premium: boolean): Promise<Quota> {
  if (!supabase) {
    return premium ? { usedGb: 4.8, totalGb: 'unlimited' } : { usedGb: 4.8, totalGb: FREE_GB };
  }
  // Real usage is summed server-side (see supabase/schema.sql media.size_bytes).
  const { data } = await supabase.from('media').select('size_bytes');
  const bytes = (data ?? []).reduce((a, r) => a + (r.size_bytes ?? 0), 0);
  const usedGb = +(bytes / 1e9).toFixed(1);
  return premium ? { usedGb, totalGb: 'unlimited' } : { usedGb, totalGb: FREE_GB };
}

/** Upload a captured/imported file and record it for the signed-in user. */
export async function uploadMedia(
  familyId: string,
  childId: string | null,
  file: Blob,
  filename: string,
): Promise<{ ok: boolean; path?: string; error?: string }> {
  if (!supabase) return { ok: false, error: 'No backend configured' };
  const path = `${familyId}/${crypto.randomUUID()}-${filename}`;
  const up = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (up.error) return { ok: false, error: up.error.message };
  const { error } = await supabase.from('media').insert({
    family_id: familyId, child_id: childId, storage_path: path, size_bytes: file.size,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, path };
}
