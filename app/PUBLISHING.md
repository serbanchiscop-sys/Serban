# Publishing Family Moments AI

This is the click-by-click path from this repo to **live on the App Store and
Google Play**. Steps a coding agent cannot do for you (they need your identity,
your paid accounts, and a Mac) are marked **[YOU]**.

> Before submitting, finish the functionality phases in `../ROADMAP.md`. Apple
> rejects apps that are just a UI with placeholder data (Guideline 4.2). The
> steps below are the mechanical submission process once the app is real.

---

## 0. Accounts & machines  **[YOU]**

- **Apple Developer Program** — enrol at <https://developer.apple.com/programs/>
  (~€99/year). Needs a Mac with **Xcode** to build/submit iOS.
- **Google Play Console** — register at <https://play.google.com/console>
  (~€25 one-time). Android builds work from macOS, Windows or Linux with
  **Android Studio**.
- A hosted **privacy policy URL** (both stores require one). Draft is in
  `../store-assets/privacy-policy.md` — host it (e.g. GitHub Pages) and keep the URL.

---

## 1. Generate the native projects (one-time)

```bash
cd app
npm install
npm run build
npx cap add ios
npx cap add android
```

This creates `ios/` and `android/` native projects (git-ignored by default).
Re-run `npx cap sync` after every web change — or use `npm run cap:ios` /
`npm run cap:android`, which build + sync + open the IDE.

Set the app identity in `capacitor.config.ts` (already set):
`appId: com.familymomentsai.app`, `appName: Family Moments AI`. **[YOU]** change
`appId` to a domain you control before first submission — it is permanent.

## 2. Icons & splash

```bash
npm run icons                              # writes ../store-assets/icon-1024.png + foreground
npx @capacitor/assets generate \
  --iconBackgroundColor '#1B4794' --iconBackgroundColorDark '#0E2A5C'
```

`@capacitor/assets` reads `assets/icon-only.png` / `assets/icon-foreground.png`
(copy them from `../store-assets/`) and writes every iOS/Android icon + splash
size into the native projects.

---

## 3. iOS → App Store  **[YOU]**

1. `npm run cap:ios` (opens Xcode).
2. **Signing & Capabilities** → select your Team; let Xcode manage signing.
3. Set **Version** (e.g. 1.0.0) and **Build** (1).
4. In <https://appstoreconnect.apple.com> → **Apps → +** → create the app
   (bundle ID `com.familymomentsai.app`, name *Family Moments AI*).
5. Xcode → **Product → Archive** → **Distribute App → App Store Connect → Upload**.
6. In App Store Connect, fill the listing from `../store-assets/listing.md`,
   upload screenshots (6.7" + 5.5" iPhone required), set the privacy policy URL,
   and complete **App Privacy** (data collected — see the privacy policy).
7. If you ship subscriptions: create them under **In-App Purchases**, wire
   `services/purchases.ts` to RevenueCat, and add a sandbox tester.
8. **Submit for Review.**

## 4. Android → Google Play  **[YOU]**

1. `npm run cap:android` (opens Android Studio).
2. **Build → Generate Signed Bundle / APK → Android App Bundle (.aab)**. Create
   an upload keystore the first time and **back it up** — losing it blocks future
   updates.
3. In <https://play.google.com/console> → **Create app**.
4. **Set up your app**: store listing (from `../store-assets/listing.md`),
   screenshots, the 512×512 icon and a 1024×500 feature graphic, content rating,
   target audience, and the **Data safety** form (see the privacy policy).
5. Upload the `.aab` to **Internal testing** first; add testers; verify.
6. Subscriptions: create them under **Monetize → Products → Subscriptions** and
   wire via RevenueCat.
7. Promote the release to **Production** and submit for review.

---

## 5. After approval

- Bump `version` in `package.json`, the iOS Build number, and the Android
  `versionCode` for every update.
- `npm run build && npx cap sync` before each archive/bundle.
- Watch crash/ANR and review feedback in both consoles.

## Reference

- Capacitor deployment: <https://capacitorjs.com/docs/ios> · <https://capacitorjs.com/docs/android>
- App Store review guidelines: <https://developer.apple.com/app-store/review/guidelines/>
- Play policies: <https://play.google.com/about/developer-content-policy/>
