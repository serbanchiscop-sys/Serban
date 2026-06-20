/* Auth / family-account service.
 *
 * Phase 2: real passwordless email magic-link auth via Supabase. When Supabase
 * is not configured the service runs in DEMO mode (a fixed "Sofia" household) so
 * the app is fully usable offline and in tests. */
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type Account = { id: string; name: string; household: string; email?: string; familyId: string | null };

/** Whether a real auth backend is wired up. False → demo mode. */
export const authEnabled = isSupabaseConfigured;

const DEMO: Account = { id: 'demo-sofia', name: 'Sofia', household: 'Sofia’s family', familyId: 'demo-family' };

/** Send a magic link / OTP to the given email. */
export async function signInWithEmail(email: string): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: true }; // demo: pretend a link was sent
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

/** The signed-in account, or null when signed out. In demo mode, always DEMO. */
export async function getCurrentAccount(): Promise<Account | null> {
  if (!supabase) return DEMO;
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;
  return mapAccount(user.id, user.email ?? undefined);
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/** Subscribe to sign-in/sign-out. Returns an unsubscribe fn. */
export function onAuthChange(cb: (account: Account | null) => void): () => void {
  if (!supabase) {
    cb(DEMO);
    return () => {};
  }
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user;
    if (!user) { cb(null); return; }
    void mapAccount(user.id, user.email ?? undefined).then(cb);
  });
  return () => data.subscription.unsubscribe();
}

/** Map an auth user to an Account, resolving their family from the DB.
 * `familyId` is null when the user hasn't created/joined a family yet. */
async function mapAccount(id: string, email?: string): Promise<Account> {
  const name = email ? email.split('@')[0] : 'You';
  let household = 'My family';
  let familyId: string | null = null;
  if (supabase) {
    const { data } = await supabase
      .from('family_members')
      .select('family_id, families(name)')
      .eq('user_id', id)
      .limit(1)
      .maybeSingle();
    if (data?.family_id) {
      familyId = data.family_id as string;
      const fam = data.families as { name?: string } | { name?: string }[] | undefined;
      const famName = Array.isArray(fam) ? fam[0]?.name : fam?.name;
      if (famName) household = famName;
    }
    // Ensure a profile row exists so the family circle can show a name.
    await supabase.from('profiles').upsert({ id, display_name: name }, { onConflict: 'id' });
  }
  return { id, name, household, email, familyId };
}
