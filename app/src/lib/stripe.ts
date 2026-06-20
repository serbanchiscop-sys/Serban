/* Stripe configuration (Phase 4 — print-shop physical goods).
 *
 * Physical orders must NOT go through App Store / Play billing — they use a card
 * processor (Stripe) + a print-on-demand fulfilment API. Stripe's *publishable*
 * key (pk_…) is client-safe; the secret key lives only in the `checkout` edge
 * function. The native PaymentSheet runs only inside Capacitor, so this is gated
 * on isNative() and lazy-loaded — web/tests fall back to the mock. */
import { isNative } from './platform';
import { isSupabaseConfigured } from './supabase';

const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

/** True when a real card flow can run (native + publishable key + backend). */
export const isCheckoutConfigured = (): boolean =>
  isNative() && Boolean(PUBLISHABLE_KEY) && isSupabaseConfigured;

let initialized = false;

/** Lazily load + initialise the Stripe plugin, or null if unavailable. */
export async function getStripe() {
  if (!isCheckoutConfigured()) return null;
  try {
    const { Stripe } = await import('@capacitor-community/stripe');
    if (!initialized) {
      await Stripe.initialize({ publishableKey: PUBLISHABLE_KEY! });
      initialized = true;
    }
    return Stripe;
  } catch {
    return null;
  }
}
