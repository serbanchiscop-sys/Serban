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
  const { data } = await supabase
    .from('family_members')
    .select('user_id, role, profiles(display_name)')
    .eq('family_id', familyId);
  if (!data?.length) return MEMBERS;
  return data.map((row, i): Member => {
    const prof = row.profiles as { display_name?: string } | { display_name?: string }[] | undefined;
    const name = (Array.isArray(prof) ? prof[0]?.display_name : prof?.display_name) || 'Member';
    const role = String(row.role);
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
