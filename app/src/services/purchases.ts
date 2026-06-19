/* In-app purchases / subscriptions interface.
 *
 * MOCK today: "buying" premium just flips local state so the paywall unlock is
 * demonstrable. Phase 4 replaces this with RevenueCat (App Store + Play
 * Billing) — same `purchase()` / `restore()` signatures, real entitlements.
 *
 * NOTE: Apple & Google require digital subscriptions to go through their
 * billing. Physical print-shop orders are the exception and use a normal card
 * processor (Stripe) — see services/storage.ts notes / Phase 4. */

export type Plan = 'year' | 'month';

export const PLAN_PRICES: Record<Plan, { price: string; per: string; note: string }> = {
  year: { price: '€39.99', per: '/ year', note: 'Billed yearly · just €3.33 / month' },
  month: { price: '€4.99', per: '/ month', note: 'Billed monthly · cancel anytime' },
};

export async function purchaseSubscription(_plan: Plan): Promise<{ success: boolean }> {
  // TODO(phase4): Purchases.purchasePackage(...) via RevenueCat.
  await new Promise((r) => setTimeout(r, 150));
  return { success: true };
}

export async function restorePurchases(): Promise<{ premium: boolean }> {
  // TODO(phase4): Purchases.restorePurchases() and read entitlements.
  return { premium: false };
}
