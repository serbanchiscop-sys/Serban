/* Cloud photo/video storage service.
 *
 * Phase 2: uploads to a Supabase Storage bucket and reports real usage. Falls
 * back to the design's static quota (4.8 / 5 GB) in demo mode so the Family
 * screen renders identically offline. Premium lifts the cap to unlimited. */
import { supabase } from '../lib/supabase';

export type Quota = { usedGb: number; totalGb: number | 'unlimited' };

const BUCKET = 'family-media';

export async function getQuota(): Promise<Quota> {
  // Storage is unlimited and free for everyone — the product's anchor.
  if (!supabase) return { usedGb: 4.8, totalGb: 'unlimited' };
  const { data } = await supabase.from('media').select('size_bytes');
  const bytes = (data ?? []).reduce((a, r) => a + (r.size_bytes ?? 0), 0);
  return { usedGb: +(bytes / 1e9).toFixed(1), totalGb: 'unlimited' };
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

/** Attach an AI caption/tags to an uploaded item (best-effort, by path). */
export async function setMediaCaption(path: string, caption: string, tags: string[]): Promise<void> {
  if (!supabase) return;
  await supabase.from('media').update({ caption, tags }).eq('storage_path', path);
}

/** Assign a photo to a child (the label that seeds face recognition). */
export async function assignMediaChild(mediaId: string, childId: string | null): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: true };
  const { error } = await supabase.from('media').update({ child_id: childId }).eq('id', mediaId);
  return error ? { ok: false, error: error.message } : { ok: true };
}

/** Count of media items in the family's library. */
export async function getMediaCount(familyId: string): Promise<number> {
  if (!supabase) return 0;
  const { count } = await supabase.from('media').select('id', { count: 'exact', head: true }).eq('family_id', familyId);
  return count ?? 0;
}

export type MediaRow = { id: string; url: string; childId: string | null; caption: string | null };

/** Recent media with short-lived signed URLs (the bucket is private). */
export async function listMedia(familyId: string, limit = 60): Promise<MediaRow[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('media')
    .select('id, storage_path, child_id, caption')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (!data?.length) return [];
  const paths = data.map((r) => r.storage_path as string);
  const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 3600);
  const urlByPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl] as const));
  return data.map((r) => ({
    id: String(r.id),
    url: urlByPath.get(r.storage_path as string) ?? '',
    childId: r.child_id ? String(r.child_id) : null,
    caption: (r.caption as string | null) ?? null,
  }));
}
