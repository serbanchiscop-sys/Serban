# App Store Listing — Family Moments AI

Copy/paste these into App Store Connect. Fields marked **[CHECK]** need a
decision or your own URL.

---

## App Name (30 char max)
`Family Moments AI`  _(17 chars ✓)_

## Subtitle (30 char max)
`Your family's AI memory keeper`  _(30 chars ✓)_

## Promotional Text (170 char max — editable any time without review)
> Keep every photo, video and milestone safe in one private family album — and
> let AI find any moment, write the stories, and make beautiful reels for you.

## Keywords (100 char max, comma-separated, no spaces)
`family,baby,kids,photos,album,memories,AI,milestones,video,reel,story,private,timeline,photobook`

## Description
> **Your whole family's story, beautifully kept — and quietly organised by AI.**
>
> Family Moments AI is the private home for everything that matters: first
> steps, birthdays, lazy Sundays, the faces you never want to forget. Upload
> once and your memories are safe forever — with unlimited storage, always free.
>
> **An assistant that actually understands your album**
> Just ask. "Show me Mia's first birthday." "Make a reel of last summer."
> "When did the baby start walking?" Your AI assistant finds the moments,
> writes warm captions and stories, and turns months of photos into a
> share-worthy reel — in seconds.
>
> **What you'll love**
> • 📸 Unlimited photo & video storage — free, forever
> • 🤖 AI search across your whole library, in plain language
> • ✨ Auto-captions, tags, and milestone detection
> • 🎬 One-tap memory reels set to music
> • 📖 AI-written stories & printed memory books
> • 👨‍👩‍👧 Private family circle — invite grandparents & partners
> • 🔒 Your album is yours: private by default, never used for ads
>
> **Premium** unlocks original-quality photos, longer videos, 4K reels, and 15%
> off prints. Unlimited storage stays free for everyone.
>
> Start preserving the moments that matter — today.

## Support URL  **[CHECK]**
`https://[your-site-or-github-page]/support`

## Marketing URL (optional)
`https://[your-site]`

## Privacy Policy URL  **[CHECK — required]**
`https://[your-hosted-privacy-policy]`

## Category
- Primary: **Photo & Video**
- Secondary: **Lifestyle**

## Age Rating
Expected **4+** (no objectionable content). Answer Apple's questionnaire honestly.

## Price
Free to download (with In-App Purchases for Premium + physical prints).

---

## In-App Purchases to create in App Store Connect  **[CHECK]**
| Product | Type | Price | RevenueCat product ID |
|---|---|---|---|
| Premium (Yearly) | Auto-renewable subscription | €29.99/yr | `fm_premium_yearly` |
| Premium (Monthly) | Auto-renewable subscription | €3.99/mo | `fm_premium_monthly` |
| Premium intro (first year) | Introductory offer | €14.99 | (intro offer on `fm_premium_yearly`) |

- RevenueCat **entitlement** must be named: `premium`
- Product IDs above are taken directly from `src/lib/revenuecat.ts` — create
  them with these exact identifiers in App Store Connect, then map them in
  RevenueCat.
