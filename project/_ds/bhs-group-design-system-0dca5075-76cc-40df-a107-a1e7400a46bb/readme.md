# BHS Group — Design System

**Business Hybrid Solutions** · `bhsgroup.es` · partners@bhsgroup.es

BHS Group is a B2B technology services firm whose proposition is in the name:
**Business Hybrid Solutions** — combining on-prem and cloud, systems and
processes, into one operating model. The brand promise is *"Connecting
technology with opportunity."* Positioning is **modern · capable · practical**:
it speaks to business outcomes and leads with evidence (uptime, cost reduction,
time-to-value), confident without being boastful.

This design system turns the BHS brand into reusable foundations, components,
a marketing-website UI kit, and a presentation template.

---

## Sources

Everything here derives from the supplied brand package (no public product
codebase exists). Stored for reference — do not assume the reader has access:

- **`Brand_Reference.txt`** — primary source: palette (sampled from the logo),
  type spec, logo usage, tone of voice, file index.
- **Logo artwork** — `01–07_Logo_*` PNG/SVG (PNG used; the supplied SVGs ship
  an empty `<image>` tag and don't render — see Caveats).
- **`BHS_Brand_Template*.pptx`** — 10-slide presentation template; the source
  for the slide layouts and much of the sample copy.
- **`Brand_Guidelines.pdf`** — 6-page brand book.
- **Editable Figma source** (not accessed here):
  `https://www.figma.com/design/9hJwdfT4TuWpJkpCpSh56E`

---

## CONTENT FUNDAMENTALS

How BHS writes.

- **Voice:** modern, capable, practical. Confident, never boastful. The reader
  is a busy business/IT decision-maker — respect their time.
- **Person:** addresses the customer as **"you"**; BHS is **"we"**. Outcomes
  are framed around the customer's business, not BHS's cleverness.
- **Lead with outcomes, prove with numbers.** Every claim is backed by
  evidence: `99.95% uptime`, `38% cost reduction`, `<90 days to first value`,
  `12 wk to live`. Numbers persuade — restraint reads as confidence.
- **Casing:** Sentence case for headlines and body. **UPPERCASE, tracked
  (+0.16em)** for eyebrow labels and metadata (`WHAT WE DELIVER`, `BY THE
  NUMBERS`, `PARTNERS`). Title Case only for the wordmark "BHS GROUP".
- **Sentence length:** short. One idea per sentence; one point per slide. "Keep
  one point per slide and use this column for body copy that builds the case."
- **Vocabulary:** plain business English — *hybrid, operating model, single
  pane of glass, end-to-end, predictable cost, consistent SLAs, roadmap,
  phases, owners, timing*. Avoid hype and acronym soup ("avoid jargon").
- **No emoji.** Not part of the brand. Use icons instead (see ICONOGRAPHY).
- **Tagline is fixed:** "Business Hybrid Solutions" — never reworded or
  re-set in a different font.
- **Example phrases:** "Connecting technology with opportunity." · "That's the
  hybrid in Business Hybrid Solutions." · "We'll come back with a practical
  first step." · "Let's get to work."

---

## VISUAL FOUNDATIONS

- **Color.** Deep Blue `#1B4794` dominates (the BHS tile fill). Sky Blue
  `#4CA8E4` is the highlight/hover/accent (top of the tile). Signal Cyan
  `#2196F3` is reserved for links and key data callouts — used sparingly.
  Neutrals come straight off the logo: Charcoal `#1F2937` (body), Slate
  `#6B7280` (the wordmark gray, secondary copy), Mist `#B5B5B5` (captions,
  disabled), Off-White `#F5F7FA` (default canvas). **60 / 30 / 10**: Deep Blue
  60%, white/off-white 30%, Sky Blue + Cyan 10%.
- **Type.** Montserrat throughout. Bold/Extrabold (700–800) for headlines with
  tight tracking (`-0.02em`); Regular (400) for body at relaxed line-height
  (1.6). Data uses **tabular figures**. Eyebrow labels are 12px, weight 700,
  uppercase, tracked +0.16em, Sky Blue.
- **Backgrounds.** Three canvases: Off-White (default content), **Black** (cover
  / hero / closing — premium), and **Deep-Blue gradient** (`160deg`, Deep Blue →
  900 for hero panels; Sky → Deep Blue for the tile motif). No photography was
  supplied; navy gradient panels + the logo tile stand in for imagery (this
  mirrors the slide template's navy "image placeholder" convention). Subtle
  radial Sky-Blue glows accent dark sections. No noise/grain.
- **Shape & radii.** Soft, app-icon-like — echoes the rounded BHS tile.
  `sm 6 · md 10 · lg 16 · xl 22` (xl matches the logo tile corner). Buttons and
  badges are **fully pill-shaped** (`999px`).
- **Cards.** White surface, 1px `#E5E7EB` border, `lg` (16px) radius, subtle
  **cool blue-tinted** shadow (`rgba(16,42,92,…)`, never neutral-gray, never
  heavy). A 3px Sky-Blue **top rule** marks accented/feature cards.
- **Elevation.** Five soft steps, all blue-tinted; `--shadow-brand` is a Deep-
  Blue glow for hero artwork. Elevation is gentle — this is a corporate, not
  playful, brand.
- **Borders.** Hairline neutrals (`gray-200/300`). Brand outline (Deep Blue) on
  secondary buttons. Accent rules are 3–4px Sky-Blue, ~40–56px wide, below
  eyebrows and titles.
- **Motion.** Restrained and quick. `--dur-fast 120ms` for hover, `--dur-base
  200ms` for cards. Standard ease `cubic-bezier(.4,0,.2,1)`. No bounce, no
  infinite loops. Slide content appears instantly (print/PDF-safe).
- **Hover / press.** Buttons darken on hover (Deep Blue → `blue-600`); ghost/
  secondary fill with `blue-50`. Cards lift `-3px` + deepen shadow. Inputs show
  a Sky-Blue ring (`0 0 0 3px rgba(76,168,228,.25)`). No shrink on press.
- **Transparency / blur.** Sticky header is `rgba(255,255,255,.86)` +
  `blur(12px)`. Dark-surface secondary text is white at 0.6–0.72 alpha. Used
  sparingly, never decoratively.
- **Layout.** 1200px max content width, 32px gutters. Generous vertical rhythm
  (80–110px section padding). Slides are a fixed 1280×720 (16:9).

---

## ICONOGRAPHY

- **No brand icon font, sprite, or SVG set was supplied.** The brand package is
  logo + palette + type + slide template only.
- **Substitution (flagged):** the website UI kit uses a small, hand-inlined
  **Lucide-style** line-icon set — 24×24, **2px stroke**, round caps/joins,
  `currentColor`. This clean, modern, single-weight outline style suits the
  brand's "modern · capable · practical" tone. Defined in
  `ui_kits/website/site.jsx` as `BHSIcon` (`cloud, server, shield, merge,
  gauge, arrow, check, menu, clock, layers, headset, spark`). Swap in the
  official set when available, or `npm i lucide-react` in production.
- Icons sit in **tinted tiles** (`blue-50` background, Deep-Blue glyph,
  `md`-radius) on cards, or inline in Sky Blue on dark trust bands.
- **Emoji are never used.** Unicode glyphs are used only for quote marks
  (`“ ”`) and nav chevrons (`‹ ›`).
- **The logo tile** (`assets/logos/icon*.png`) doubles as a brand motif/favicon
  /avatar at small sizes (40px minimum).

---

## Logo usage

Files in `assets/logos/` (PNG). Pick the variant by background contrast:

| Background | Variant |
|---|---|
| Light / white / off-white | `logo-primary-light`, `logo-vertical-light` |
| Black / dark | `logo-primary-dark`, `logo-vertical-dark` |
| Deep Blue (brand) | `logo-primary-navy`, `icon-navy` |
| Small sizes / favicon / avatar | `icon` (40px min) |

Clear space = the height of the BHS tile on all sides. Min full-lockup width
~160px. Never stretch, skew, recolor, add shadows/glows, or reword the tagline.

---

## Index / manifest

**Root**
- `styles.css` — global entry point (consumers link this). `@import`s only.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`.
- `readme.md` — this guide. `SKILL.md` — portable Agent-Skill wrapper.

**Foundations** (`guidelines/`, shown in the Design System tab)
- Colors: primary, blue ramp, neutrals, semantic, gradients.
- Type: scale, eyebrow label, data figures.
- Spacing: scale, radii, elevation/shadows.
- Brand: logo lockups, on-backgrounds, app icon.

**Components** (`components/`, namespace `window.BHSGroupDesignSystem_0dca50`)
- `forms/` — `Button`, `Input`
- `data/` — `Badge`, `Card`
- `navigation/` — `Tabs`
- `brand/` — `Eyebrow`, `StatBlock`, `Logo`

**UI kits** (`ui_kits/`)
- `website/` — interactive BHS Group marketing site (`index.html` + `site.jsx`).
- `slides/` — 7-slide presentation template (`index.html` deck viewer + per-
  slide HTML), recreated from `BHS_Brand_Template.pptx`.

**Assets** (`assets/logos/`) — all logo lockups + icon variants (PNG).

---

## Caveats

- The supplied **SVG logos are broken** (empty `<image>` element, no `href`);
  only the PNGs render, so the system uses PNGs throughout. Ask for fixed
  vector logos for crisp scaling.
- **Fonts:** Montserrat is loaded from Google Fonts (it is the brand's own
  recommended family, so not a true substitution) — supply self-hosted
  `.woff2` if offline use is required.
- **No icon set** and **no photography** were supplied — see ICONOGRAPHY and
  VISUAL FOUNDATIONS for the substitutions made.
