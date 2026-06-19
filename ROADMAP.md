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

### Phase 2 — Accounts & backend  ✅ (Supabase)
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

- **Family invites**: `invitations` table + `create_invite`/`accept_invite`
  RPCs (RLS-guarded), a `profiles` table for member names, the Invite overlay
  wired to "Invite family member", and a live family circle (`listMembers`).
- **Background upload queue** (`services/uploadQueue.ts`): durable
  (Preferences-backed), retrying, auto-flushes on reconnect; on-device
  thumbnailing helper; a "Uploading N photos…" status on the Timeline.

What's left for you to switch it all on: create the Supabase project, run
`supabase/schema.sql`, add the `family-media` bucket + policies, and set the
two env keys. Then the invite-accept entry point (a deep link carrying the
code) can be wired to your chosen URL scheme.

### Phase 3 — The actual AI  🚧 (in progress — Claude)
Done in code (activates once you deploy the function + set the key):
- **`supabase/functions/ai/`** — a Supabase Edge Function that runs **Claude
  (`claude-opus-4-8`)** server-side. The Anthropic API key lives **only** here as
  a secret — it never ships in the app and is never pasted in chat. Actions:
  - `assistant` — the Family Chat reply + best follow-up (structured output).
  - `search` — interprets a natural-language memory query.
  - `caption` — **vision**: captions/tags an uploaded photo.
- **`services/ai.ts`** calls the function when a backend is configured, with the
  offline mock as fallback (so the app and tests still run with no key).
- The **upload pipeline auto-captions** new photos (`media.caption` / `tags`).
- **Generation + detection** (edge function actions `story` / `reel` / `book` /
  `milestones`) → `generateStory` / `generateReel` / `generateBook` /
  `detectMilestones` in `services/ai.ts`. The **AI story overlay** renders real
  Claude text when a backend is configured (static demo otherwise).
- **Per-child grouping / face-clustering** layer (`services/clustering.ts`):
  groups media per child by `child_id` and AI name tags, with the real
  face-embedding pipeline documented and stubbed behind the same API.

Your steps to switch it on:
1. `cd app && supabase functions deploy ai`
2. `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...` (get a key at
   console.anthropic.com — keep it **out** of `.env` and the app).

Remaining in this phase (needs a native ML model + real photos):
- On-device **face detection + embeddings** to replace the tag-based grouping in
  `clustering.ts` (the grouping/match layer above is already in place).
- Rendering generated **reels** into actual video (the reel *plan* is generated;
  turning clips into an encoded MP4 is a media-pipeline task).

### Phase 4 — Monetisation
**Subscriptions — done in code (RevenueCat, env-gated):**
- `lib/revenuecat.ts` configures the RevenueCat Capacitor SDK from a **public**
  SDK key (safe in the client); native-only and lazy-loaded.
- `services/purchases.ts` drives real purchases / restore / entitlement checks,
  with the mock fallback when unconfigured. The store reconciles the `premium`
  entitlement on launch; the paywall has a **Restore purchases** button (Apple
  requires one).

Your steps to switch it on:
1. Create the subscription products (`fm_premium_yearly` / `fm_premium_monthly`)
   in App Store Connect + Play Console; add a `premium` entitlement in
   RevenueCat mapping to them.
2. Put the public SDK keys in `app/.env`
   (`VITE_REVENUECAT_IOS_KEY` / `VITE_REVENUECAT_ANDROID_KEY`).

**Still to do — print-shop (physical goods, separate path):**
- Physical orders can't use IAP — wire a card processor (Stripe) + a
  print-on-demand fulfilment API for the cart → checkout flow.

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
