/* Auth / family-account interface.
 *
 * MOCK today: returns a fixed "Sofia" household so the app is fully usable
 * offline. Phase 2 swaps the body for a real provider (e.g. Supabase/Firebase
 * Auth) behind these signatures, then wires family invites to the backend. */

export type Account = { id: string; name: string; household: string };

const DEMO: Account = { id: 'demo-sofia', name: 'Sofia', household: 'Sofia’s family' };

export async function getCurrentAccount(): Promise<Account> {
  // TODO(phase2): read the real session.
  return DEMO;
}

export async function signOut(): Promise<void> {
  // TODO(phase2): clear the real session.
}
