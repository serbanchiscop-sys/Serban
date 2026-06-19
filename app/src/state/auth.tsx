/* Auth context — session state + the sign-in gate.
 * In demo mode (no Supabase env) it resolves immediately to the demo household,
 * so the app and tests run with no backend and no gate. */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  authEnabled, getCurrentAccount, onAuthChange, signInWithEmail, signOut, type Account,
} from '../services/auth';

type AuthValue = {
  ready: boolean;
  enabled: boolean;
  account: Account | null;
  signedIn: boolean;
  signIn: (email: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    let alive = true;
    getCurrentAccount().then((a) => {
      if (!alive) return;
      setAccount(a);
      setReady(true);
    });
    const unsub = onAuthChange((a) => {
      if (alive) setAccount(a);
    });
    return () => { alive = false; unsub(); };
  }, []);

  const value = useMemo<AuthValue>(() => ({
    ready,
    enabled: authEnabled,
    account,
    signedIn: !!account,
    signIn: signInWithEmail,
    signOut: async () => { await signOut(); setAccount(null); },
  }), [ready, account]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
