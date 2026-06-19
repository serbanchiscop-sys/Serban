# Family Moments AI — app

A cross-platform (iOS + Android) app built from the *Family Moments AI* design,
using **React + TypeScript + Vite**, wrapped with **Capacitor** for the stores.

This is Phase 1 of `../ROADMAP.md`: the full UI is real and runnable, with
working client-side flows (navigation, print-shop cart → checkout → order,
premium unlock, search, Family Chat) and **service interfaces** scaffolded for
the parts that need external accounts (AI, auth, storage, payments).

## Develop

```bash
npm install
npm run dev        # web preview at http://localhost:5173 (shows the phone frame)
npm test           # run the flow tests (navigation, purchase, premium unlock)
npm run lint
npm run build      # type-check + production web build → dist/
```

On the web the app renders inside a device frame with an iOS/Android toggle. In
the native shell that frame is dropped and the app fills the screen, using the
real device platform.

## Project layout

```
src/
  App.tsx              phone surface: status bar → screen → nav → overlays
  main.tsx             entry; mounts AppProvider + native chrome init
  state/
    store.tsx          app state (reducer + context), persisted via Preferences
    selectors.ts       derived values (cart totals)
  screens/             Timeline, Moments, Search, Shop, Family
  overlays/            Product, Cart, Checkout, Confirm, MemoryBook,
                       Story, Reel, Paywall, Assistant, + Overlays container
  components/          PhoneFrame, StatusBar, BottomNav, Badge, Input, Icon
  data/content.ts      sample data (mirrors the prototype's datasets)
  services/            ai · auth · storage · purchases · photos · persistence
                       (mocks today; real impls land in Phase 2–4)
  lib/                 platform detection, native chrome init
  test/                vitest + Testing Library smoke/flow tests
scripts/make-icons.mjs rasterize the brand icon for the stores
```

## Where the real work plugs in

Every external dependency is isolated behind a service with a working mock, so
the app runs today and the UI never changes when the real implementation lands:

| Service | Today (mock) | Production (phase) |
|---|---|---|
| `services/ai.ts` | canned search/assistant replies | real memory pipeline (3) |
| `services/auth.ts` | fixed demo household | Supabase/Firebase Auth (2) |
| `services/storage.ts` | static quota | object storage + sync (2) |
| `services/purchases.ts` | flips local premium flag | RevenueCat IAP (4) |
| `services/photos.ts` | **real** picker on device, gradients on web | full library scan (2) |

## Ship to the stores

See **[PUBLISHING.md](./PUBLISHING.md)** for the click-by-click guide. In short:

```bash
npm run build
npx cap add ios          # one-time (needs macOS + Xcode)
npx cap add android      # one-time (needs Android Studio)
npm run cap:ios          # build + sync + open Xcode
npm run cap:android      # build + sync + open Android Studio
```
