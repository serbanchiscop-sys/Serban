/* In-app subscriptions (Phase 4 — RevenueCat).
 *
 * When RevenueCat is configured (native build + a public SDK key) these drive
 * real App Store / Play Billing purchases and entitlements. Otherwise they fall
 * back to a mock that flips local premium state, so the paywall is demonstrable
 * offline and the tests stay green.
 *
 * Physical print-shop orders are NOT subscriptions and must NOT go through IAP —
 * they use a card processor + fulfilment API (Phase 4, separate path). */
import { getPurchases, isBillingConfigured, PREMIUM_ENTITLEMENT, PRODUCT_IDS } from '../lib/revenuecat';

export type Plan = 'year' | 'month';

export const PLAN_PRICES: Record<Plan, { price: string; per: string; note: string }> = {
  year: { price: '€39.99', per: '/ year', note: 'Billed yearly · just €3.33 / month' },
  month: { price: '€4.99', per: '/ month', note: 'Billed monthly · cancel anytime' },
};

export const billingEnabled = isBillingConfigured;

/** Initialise billing and report whether Premium is currently active. */
export async function initBilling(appUserId?: string): Promise<{ premium: boolean }> {
  const Purchases = await getPurchases(appUserId);
  if (!Purchases) return { premium: false };
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return { premium: PREMIUM_ENTITLEMENT in customerInfo.entitlements.active };
  } catch {
    return { premium: false };
  }
}

/** Find the RevenueCat package matching a plan, by product identifier. */
async function packageForPlan(plan: Plan) {
  const Purchases = await getPurchases();
  if (!Purchases) return null;
  const { current } = await Purchases.getOfferings();
  const pkgs = current?.availablePackages ?? [];
  return pkgs.find((p) => p.product.identifier === PRODUCT_IDS[plan]) ?? pkgs[0] ?? null;
}

export async function purchaseSubscription(plan: Plan): Promise<{ success: boolean; error?: string }> {
  const Purchases = await getPurchases();
  if (!Purchases) {
    // Mock: pretend the purchase succeeded so the unlock is demonstrable.
    await new Promise((r) => setTimeout(r, 150));
    return { success: true };
  }
  try {
    const pkg = await packageForPlan(plan);
    if (!pkg) return { success: false, error: 'No subscription product available' };
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    return { success: PREMIUM_ENTITLEMENT in customerInfo.entitlements.active };
  } catch (e) {
    const err = e as { code?: string; message?: string };
    if (err.code === 'PURCHASE_CANCELLED') return { success: false }; // user backed out
    return { success: false, error: err.message ?? 'Purchase failed' };
  }
}

export async function restorePurchases(): Promise<{ premium: boolean }> {
  const Purchases = await getPurchases();
  if (!Purchases) return { premium: false };
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return { premium: PREMIUM_ENTITLEMENT in customerInfo.entitlements.active };
  } catch {
    return { premium: false };
  }
}
