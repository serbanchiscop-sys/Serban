/* Print-shop checkout (Phase 4 — physical goods via Stripe + print-on-demand).
 *
 * Orchestrates: create a PaymentIntent (server) → present the native Stripe
 * PaymentSheet → record + fulfil the order (server). When Stripe/the backend
 * aren't configured (web preview, tests) it falls back to a mock that returns a
 * realistic order number, so the cart → checkout → confirmation flow always
 * works. Physical orders deliberately bypass in-app purchase. */
import { supabase } from '../lib/supabase';
import { getStripe, isCheckoutConfigured } from '../lib/stripe';
import type { CartItem } from '../state/store';

export type Shipping = { name: string; address: string; postcode: string; city: string };

export const checkoutEnabled = isCheckoutConfigured;

const mockOrderNo = () => 'FM-' + Math.floor(100000 + Math.random() * 899999);

async function invoke<T>(body: Record<string, unknown>): Promise<T | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.functions.invoke('checkout', { body });
  if (error || !data || (data as { error?: string }).error) return null;
  return data as T;
}

/**
 * Run the full checkout. Returns the order number on success.
 * Mock path (no Stripe/backend): returns a generated order number immediately.
 */
export async function runCheckout(
  familyId: string | null,
  items: CartItem[],
  amountCents: number,
  shipping: Shipping,
): Promise<{ ok: boolean; orderNo?: string; error?: string }> {
  const Stripe = await getStripe();
  if (!Stripe || !supabase) {
    await new Promise((r) => setTimeout(r, 150)); // mock latency
    return { ok: true, orderNo: mockOrderNo() };
  }
  try {
    // 1. Create the PaymentIntent server-side.
    const intent = await invoke<{ clientSecret: string; paymentIntentId: string }>({
      action: 'intent', amountCents, currency: 'eur',
    });
    if (!intent) return { ok: false, error: 'Could not start payment' };

    // 2. Present the native Stripe PaymentSheet.
    await Stripe.createPaymentSheet({
      paymentIntentClientSecret: intent.clientSecret,
      merchantDisplayName: 'Family Moments AI',
    });
    const { paymentResult } = await Stripe.presentPaymentSheet();
    if (paymentResult !== 'paymentSheetCompleted') return { ok: false }; // cancelled / failed

    // 3. Record + fulfil the order server-side.
    const order = await invoke<{ orderNo: string }>({
      action: 'order', familyId, paymentIntentId: intent.paymentIntentId, items, shipping,
    });
    if (!order) return { ok: false, error: 'Payment took, but the order could not be recorded' };
    return { ok: true, orderNo: order.orderNo };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Checkout failed' };
  }
}
