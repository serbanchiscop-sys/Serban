# Publishing Family Moments AI — submission runbook

The end-to-end path from this repo to **live on the App Store and Google Play**.
Steps marked **[YOU]** need your accounts/identity/Mac and can't be automated.

> Build order: get the **backend live** (§2) → set **app env** (§3) → generate
> **native projects + assets** (§4) → **submit** (§5–6). Run `npm test` and
> `npm run build` green before you start (currently: 18 tests pass).

---

## 0. Accounts & machines  [YOU]
- **Apple Developer Program** — ~€99/yr, needs a **Mac + Xcode**.
- **Google Play Console** — ~€25 once; Android builds run on any OS with **Android Studio**.
- **Supabase** project (free tier fine) — backend for auth/db/storage + the two edge functions.
- **Anthropic** API key (console.anthropic.com) — for the AI features.
- **RevenueCat** account — for subscriptions.
- **Stripe** account (+ a print-on-demand provider, e.g. Prodigi/Gelato) — for print orders.
- A hosted **privacy-policy URL** — host `store-assets/privacy-policy.md` (e.g. GitHub Pages).

---

## 1. Build & test
```bash
cd app
npm install
npm test          # 18 tests
npm run build     # type-check + web build → dist/
```

## 2. Stand up the backend  [YOU]
1. **Database:** open the Supabase SQL editor and run `supabase/schema.sql`
   (families, members, children, media, invitations, profiles, orders + RLS).
2. **Storage:** create a **private** bucket named `family-media`; add storage
   policies mirroring `my_family_ids()` (template in `schema.sql`).
3. **Edge functions:**
   ```bash
   supabase functions deploy ai
   supabase functions deploy checkout
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
   supabase secrets set PRINT_PROVIDER_KEY=...        # optional, for real fulfilment
   ```
4. **RevenueCat:** create products `fm_premium_yearly` / `fm_premium_monthly`
   (also created in App Store Connect + Play, §5–6), add a `premium`
   **entitlement** mapping to them, and note the **public** SDK keys.
5. **Stripe / fulfilment:** map cart items to your provider's SKUs in the
   `fulfil()` stub in `supabase/functions/checkout/index.ts`, and recompute the
   charge from a server-side catalog (both marked `TODO` there).

## 3. App environment
Copy `.env.example` → `.env` and fill in (all **client-safe** keys):
```
VITE_SUPABASE_URL=…        VITE_SUPABASE_ANON_KEY=…
VITE_REVENUECAT_IOS_KEY=appl_…    VITE_REVENUECAT_ANDROID_KEY=goog_…
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_…
```
> Secret keys (Anthropic, Stripe **secret**, print provider) are Supabase
> secrets from §2 — they must **never** appear in `.env` or the app bundle.

## 4. Native projects & assets (one-time)
```bash
npm run build
npx cap add ios
npx cap add android
npm run icons                              # writes assets/* and store-assets/*
npx @capacitor/assets generate \
  --iconBackgroundColor '#1B4794' --iconBackgroundColorDark '#0E2A5C' \
  --splashBackgroundColor '#1B4794'
npx cap sync
```
- Set the bundle id in `capacitor.config.ts` to a domain you own **before**
  the first upload (`com.familymomentsai.app` is a placeholder; it's permanent).
- **iOS permission strings** [YOU] — in Xcode, add to Info.plist:
  - `NSPhotoLibraryUsageDescription` — "Family Moments AI uses your photos to
    organize them by child and create your timeline, reels and books."
  - `NSCameraUsageDescription` — "…to add photos directly from the camera."
- **Android** — the Camera plugin adds the needed permissions on `cap sync`.

## 5. iOS → App Store  [YOU]
1. `npm run cap:ios` (build + sync + open Xcode).
2. **Signing & Capabilities** → select your Team; enable In-App Purchase.
3. Set **Version** 1.0.0 and **Build** 1.
4. In **appstoreconnect.apple.com** → create the app + the two auto-renewable
   subscriptions (`fm_premium_yearly` / `fm_premium_monthly`); add a sandbox tester.
5. Xcode → **Product ▸ Archive ▸ Distribute App ▸ App Store Connect ▸ Upload**.
6. Fill the listing from `../store-assets/listing.md`, upload screenshots
   (6.7" iPhone required) + the 1024 icon, set the **privacy-policy URL**, and
   complete **App Privacy** (use the mapping in `privacy-policy.md`).
7. **Submit for Review.**

## 6. Android → Google Play  [YOU]
1. `npm run cap:android` (opens Android Studio).
2. **Build ▸ Generate Signed Bundle (.aab)** — create the upload keystore once
   and **back it up** (losing it blocks all future updates).
3. **play.google.com/console** → Create app → create the two subscriptions.
4. Store listing from `../store-assets/listing.md`; upload screenshots, the
   512 icon, and `../store-assets/feature-graphic.png` (1024×500); complete the
   **Data safety** form (mapping in `privacy-policy.md`) + content rating.
5. Upload the `.aab` to **Internal testing** → verify install + a sandbox purchase.
6. Promote to **Production** → submit.

---

## Pre-submission checklist
- [ ] `npm test` and `npm run build` green
- [ ] `schema.sql` run; `family-media` bucket + policies created
- [ ] `ai` + `checkout` functions deployed; all secrets set
- [ ] RevenueCat products + `premium` entitlement; public keys in `.env`
- [ ] Stripe publishable key in `.env`; `fulfil()` mapped to real SKUs
- [ ] `.env` has Supabase + RevenueCat + Stripe **publishable** keys only
- [ ] Bundle id changed to a domain you own
- [ ] iOS Info.plist usage strings added; subscriptions created both stores
- [ ] Privacy policy hosted; App Privacy / Data safety forms completed
- [ ] Real functionality verified on a device (Apple rejects placeholder shells)

## After approval
Bump `package.json` version, the iOS Build number, and the Android `versionCode`
each release; `npm run build && npx cap sync` before every archive/bundle.

## Reference
- Capacitor: <https://capacitorjs.com/docs/ios> · <https://capacitorjs.com/docs/android>
- RevenueCat: <https://www.revenuecat.com/docs/getting-started> · Apple review: <https://developer.apple.com/app-store/review/guidelines/> · Play: <https://play.google.com/about/developer-content-policy/>
