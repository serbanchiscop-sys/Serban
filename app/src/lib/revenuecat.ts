/* RevenueCat configuration (Phase 4 — subscriptions).
 *
 * RevenueCat *public SDK keys* are client-side by design (appl_… / goog_…), so
 * they're safe in the app bundle. The native SDK only runs inside the Capacitor
 * shell, so everything here is gated on isNative() and lazy-loaded — the web
 * preview and tests never import the native module, and the app falls back to
 * the mock in services/purchases.ts. */
import { detectPlatform, isNative } from './platform';

const IOS_KEY = import.meta.env.VITE_REVENUECAT_IOS_KEY as string | undefined;
const ANDROID_KEY = import.meta.env.VITE_REVENUECAT_ANDROID_KEY as string | undefined;

/** The entitlement id configured in the RevenueCat dashboard. */
export const PREMIUM_ENTITLEMENT = 'premium';
/** Product identifiers (create these in App Store Connect / Play Console). */
export const PRODUCT_IDS = { year: 'fm_premium_yearly', month: 'fm_premium_monthly' } as const;

function apiKey(): string | undefined {
  return detectPlatform() === 'android' ? ANDROID_KEY : IOS_KEY;
}

/** True when RevenueCat can run (native shell + a key for this platform). */
export const isBillingConfigured = (): boolean => isNative() && Boolean(apiKey());

let configured = false;

/** Configure the SDK once. Returns the Purchases module, or null if unavailable. */
export async function getPurchases(appUserId?: string) {
  if (!isBillingConfigured()) return null;
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    if (!configured) {
      await Purchases.configure({ apiKey: apiKey()!, appUserID: appUserId });
      configured = true;
    }
    return Purchases;
  } catch {
    return null;
  }
}
