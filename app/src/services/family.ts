/* Family service — create/manage the family + children.
 * Uses the create_family RPC (atomic family + admin membership). Demo mode
 * pretends success so onboarding is explorable offline. */
import { supabase } from '../lib/supabase';

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
