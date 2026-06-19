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

### Phase 2 — Accounts & backend  🚧 (in progress — Supabase)
Done in code (activates when you add Supabase env keys; offline demo otherwise):
- **Supabase client** (`lib/supabase.ts`), env-gated via `.env` (see `.env.example`).
- **Passwordless email magic-link auth** (`services/auth.ts`) + an auth context
  and a brand **sign-in gate** (`screens/SignIn.tsx`).
- **Database schema + row-level security** (`supabase/schema.sql`): families,
  members, children, media — each scoped to the user's own family.
- **Storage service** (`services/storage.ts`): real upload to a `family-media`
  bucket + usage/quota, with demo fallback.

Your steps to switch it on:
1. Create a Supabase project; run `supabase/schema.sql`; create a private
   `family-media` bucket with policies mirroring `my_family_ids()`.
2. Put the URL + anon key in `app/.env`.

Also done:
- **Atomic family creation** via `create_family` RPC + a **CreateFamily**
  onboarding screen (shown after first sign-in when the user has no family).
- **Photo import + upload** (`services/photos.ts → importAndUpload`) wired to
  Supabase Storage; surfaced as an "Add photos" action on the Timeline (only
  when a backend is configured).
- The Family **storage meter is live** (`getQuota`), unlimited under Premium.

Remaining in this phase:
- Background/queued photo-library upload, on-device thumbnailing, offline cache.
- Family invites (membership management) + a real "Invite family member" flow.

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
