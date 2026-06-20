/* Family service — create/manage the family, children, members and invites.
 * Uses SECURITY DEFINER RPCs (see supabase/schema.sql). Demo mode returns
 * plausible values so the flows are explorable offline. */
import { supabase } from '../lib/supabase';
import { MEMBERS, G, type Member } from '../data/content';

export type InviteRole = 'parent' | 'grandparent';

export async function createFamily(name: string): Promise<{ ok: boolean; familyId?: string; error?: string }> {
  if (!supabase) return { ok: true, familyId: 'demo-family' };
  const { data, error } = await supabase.rpc('create_family', { p_name: name });
  if (error) return { ok: false, error: error.message };
  return { ok: true, familyId: data as string };
}

export async function addChild(familyId: string, name: string, birthDate?: string): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: true };
  const { error } = await supabase.from('children').insert({ family_id: familyId, name, birth_date: birthDate ?? null });
  return error ? { ok: false, error: error.message } : { ok: true };
}

/** Create an invite; returns a shareable code (admins only). */
export async function createInvite(familyId: string, email: string, role: InviteRole): Promise<{ ok: boolean; code?: string; error?: string }> {
  if (!supabase) return { ok: true, code: 'DEMO' + Math.random().toString(36).slice(2, 8).toUpperCase() };
  const { data, error } = await supabase.rpc('create_invite', { p_family_id: familyId, p_email: email, p_role: role });
  if (error) return { ok: false, error: error.message };
  return { ok: true, code: data as string };
}

/** Redeem an invite code → join that family. */
export async function acceptInvite(code: string): Promise<{ ok: boolean; familyId?: string; error?: string }> {
  if (!supabase) return { ok: true, familyId: 'demo-family' };
  const { data, error } = await supabase.rpc('accept_invite', { p_code: code });
  if (error) return { ok: false, error: error.message };
  return { ok: true, familyId: data as string };
}

/** Members of a family for the Family circle. Demo → the sample MEMBERS. */
export async function listMembers(familyId: string): Promise<Member[]> {
  if (!supabase) return MEMBERS;
  const { data: members } = await supabase
    .from('family_members').select('user_id, role').eq('family_id', familyId);
  if (!members?.length) return MEMBERS;
  // Names live in `profiles`; fetch them separately (no FK path to embed).
  const ids = members.map((m) => m.user_id as string);
  const { data: profs } = await supabase.from('profiles').select('id, display_name').in('id', ids);
  const nameById = new Map((profs ?? []).map((p) => [p.id as string, p.display_name as string | null]));
  return members.map((row, i): Member => {
    const role = String(row.role);
    const name = nameById.get(row.user_id as string) || 'Member';
    return {
      id: String(row.user_id),
      name,
      role: role === 'admin' ? 'You · Admin' : role.charAt(0).toUpperCase() + role.slice(1),
      initials: name.charAt(0).toUpperCase(),
      bg: G[i % G.length],
      you: role === 'admin',
    };
  });
}

/** Children of a family (real). Demo → empty (caller falls back to samples). */
export async function listChildren(familyId: string): Promise<{ id: string; name: string }[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('children').select('id, name').eq('family_id', familyId).order('name');
  return (data ?? []).map((c) => ({ id: String(c.id), name: String(c.name) }));
}
