# Family Moments AI — Path to the App Store & Google Play

This document tracks the work to take the *Family Moments AI* design from a
design-tool prototype to a real app published on both stores.

The design source (the prototype this is built from) lives in
`project/Family Moments AI.dc.html`. The runnable app lives in `app/`.

---

## What "published" actually requires

Publishing is gated on things only the app's owner can provide:

| Requirement | Who | Cost | Notes |
|---|---|---|---|
| Apple Developer Program | You | ~€99 / year | Needed to sign & submit iOS builds |
| Google Play Console | You | ~€25 once | Needed to submit Android builds |
| Legal entity / identity | You | — | Apple verifies a real person/company |
| Code signing certs | You | — | Generated under your account |
| Privacy policy URL | You | — | Both stores require a hosted policy |
| A Mac (for iOS) | You | — | Xcode only runs on macOS |

A coding agent cannot create these accounts or submit on your behalf. The
plan below builds **everything up to the submit button** and gives you a
click-by-click guide (`app/PUBLISHING.md`).

Apple also rejects "empty shell" apps (Guideline 4.2). A store-approved
*Family Moments AI* therefore needs **real functionality**, not just the UI.
That is the bulk of the work and is phased below.

---

## Phases

### Phase 1 — Real app foundation  ✅ (this pass)
- Vite + React + TypeScript app, wrapped with **Capacitor** → native iOS &
  Android projects from one codebase.
- The full design ported **pixel-perfectly** to React components: 5 tabs
  (Timeline, Moments, Search, Print Shop, Family) + all overlays (product,
  cart, checkout, confirmation, memory book, AI story, reel, paywall, Family
  Chat assistant), iOS/Android chrome, the BHS deep-blue + coral system.
- Real client-side functionality with no backend required:
  - Persistent app state via Capacitor Preferences (premium, cart, settings).
  - Native **photo-library access** via Capacitor Camera/photos plugin.
  - Working cart → checkout → order flow, premium unlock, search, chat.
- **Service interfaces** scaffolded for everything that needs an external
  account, each with a working mock so the app runs today:
  - `services/ai.ts` — memory search, milestone detection, story/reel/book gen.
  - `services/auth.ts` — sign-in / family accounts.
  - `services/storage.ts` — cloud photo/video sync.
  - `services/purchases.ts` — subscriptions & print-shop payments.
- Store assets: app icon, listing copy, privacy policy, publishing guide.

### Phase 2 — Accounts & backend  (needs your services)
- Stand up a backend (auth, family accounts, photo/video upload + storage).
- Replace `services/auth.ts` and `services/storage.ts` mocks with real impls
  (e.g. Supabase/Firebase + object storage + CDN).
- Background upload, on-device thumbnailing, offline cache.

### Phase 3 — The actual AI  (the product's core)
- Real on-device + server AI: face clustering per child, date/EXIF grouping,
  milestone detection, natural-language search, reel & memory-book generation.
- Replace `services/ai.ts` mock with the real pipeline.

### Phase 4 — Monetisation
- Subscriptions via **RevenueCat** (App Store + Play Billing) → replaces the
  `purchases.ts` mock; wire the paywall to real entitlements.
- Print-shop fulfilment via a print-on-demand API + a real card processor
  (Stripe) for physical goods.

### Phase 5 — Submit
- Generate signed builds, fill store listings, complete privacy/data-safety
  forms, submit for review under **your** developer accounts.
- Follow `app/PUBLISHING.md`.

---

## Quick start

```bash
cd app
npm install
npm run dev          # web preview (shows the phone frame)
npm run build        # production web build
npx cap add ios      # generate the native iOS project (needs macOS/Xcode)
npx cap add android  # generate the native Android project (needs Android Studio)
npx cap sync         # copy the web build into the native projects
```
