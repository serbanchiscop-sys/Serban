/* Supabase client — the Phase 2 backend (auth + Postgres + storage).
 *
 * Configured via env (.env / store secrets):
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
 * When those are absent (e.g. tests, the offline web preview), the client is
 * null and the services fall back to their demo behaviour — so the app always
 * runs without a backend. */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        // The Capacitor web view exposes localStorage, so the default storage
        // adapter persists the session across launches on device and web.
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
