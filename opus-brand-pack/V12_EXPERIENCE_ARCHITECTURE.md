# BETWEEN TWO SUNS — V12 EXPERIENCE ARCHITECTURE
Lead: Claude Opus (creative / experience) · Date: 2026-09-29 · Branch: `build/vertical-slice`
Route: **B — FRONT / BACK** (selected, approved with conditions by `V12_CHATGPT_REVIEW_GATE.md`)
Status: ARCHITECTURE. No theme code changed in this pass.

Inputs: `V12_CREATIVE_DIRECTIONS.md`, `V12_CHATGPT_REVIEW_GATE.md`, `CURRENT_STORE_AUDIT_2026-09-29.md`, `CRO_PLAYBOOK.md`, `ARABIC_RTL_BRIEF.md`, `FINAL_LABEL_SOURCE_OF_TRUTH.md`, `INGREDIENT_EDUCATION_BRIEF.md`, `PRICING_SOURCE_OF_TRUTH.md`.

This document defines the whole store, not a homepage. Where it conflicts with `V12_CREATIVE_DIRECTIONS.md`, **this document wins**, because it incorporates the review-gate conditions. Every conflict is listed in §0.2.

Wording convention: **MUST** = gate requirement. **SHOULD** = default, deviations need a written reason. **LATER** = not in launch scope.

---

## 0. Ground rules

### 0.1 Non-negotiables (apply to every page)
1. **No fake commerce.** No fabricated prices, inventory, scarcity, reviews, ratings, review counts, testing claims, dermatologist endorsements, COD/delivery/return promises, or "bestseller" badges. If a fact does not exist, the UI that would display it does not render (§17).
2. **Label is law.** Every product claim, pill, ingredient and INCI renders from the product data model (§3), which is populated only from `FINAL_LABEL_SOURCE_OF_TRUTH.md` plus documented substantiation. No claim strings in templates or JS.
3. **One commerce source at a time.** Prototype mode uses the prototype data and preview bag. Production mode uses Shopify products and the Shopify cart. The two never render together (fixes v11 double-cart defect).
4. **Desire first, climate underneath.** Climate vocabulary is budgeted (§13). No environment selectors, weather tabs or climate tools anywhere.
5. **Add never moves.** On any product face, turning over, swiping, or opening the back never displaces or hides price and Add.
6. **Turn Over is optional.** Nothing required to buy lives only on the back.
7. **Arabic is server-rendered and authored**, not a client-side swap (§15).
8. **Zero console errors, no JS required to see product, price and Add.** JS enhances; it does not reveal.
9. **Singles are first-class; the routine is a first-class offer.** Neither is hidden to promote the other.
10. **No media holes.** Missing assets hide their module (§17). "Pending" labels never render in founder or production mode.

### 0.2 Deltas from `V12_CREATIVE_DIRECTIONS.md` (review-gate conditions applied)
| # | Directions said | Now | Gate condition |
|---|---|---|---|
| D1 | Turn 320 ms; reduced motion 120 ms crossfade | Turn **300 ms** (allowed 280–340), `cubic-bezier(.2,.7,.2,1)`, no overshoot; contact shadow compresses/re-expands during turn; no gloss/specular. Reduced motion = **immediate** swap with ≤80 ms opacity crossfade | #1 |
| D2 | Routine strip must fit 375×667 above fold | Priority order fixed: visual → identity/promise → price+Add → routine. At 375×667 the routine strip **may start just below the fold**; product visual is never shrunk below 300 px tall to make room | #2 |
| D3 | Desktop: four faces in one row at identical scale | Desktop hero is a **family portrait** (§5.3): one art-directed composition, staggered scale and overlap, shared surface and shadow. Not four cards in a row | #3 |
| D4 | Back face: three ingredients + feels-like + usage + INCI link | Back is capped: pills (exact) · one "why this formula" sentence · max 3 ingredients with one-line why · "Full INCI & details →". Usage and texture move to the sheet/PDP | #4 |
| D5 | Gate item 9: "sample reviews are labelled" | **No sample reviews in any build.** Review UI does not render until real verified reviews exist | #10 |
| D6 | Arabic claim pills localised where approved | Also: **English product names stay** (Reset / Clarity / Barrier / Defense and full label names) unless an Arabic naming system is formally approved. Only role/benefit/how-to/service copy is authored in Arabic | #6 |
| D7 | Back uses matte pack colour | Back may use pack colour **only** where informative text meets WCAG AA (4.5:1 body, 3:1 ≥24 px). Default: ink text on pack colour; white only for wordmark/decorative | #7 |
| D8 | "Prices are marked prototype" | Prototype marking is **structural, not per-card** (§4.2): one persistent preview ribbon + closed checkout. Cards stay clean | #8 |
| D9 | Routine swap "save EGP 185" | Saving copy renders **only** when `routine.offer_verified = true` (real bundle product priced at 1,661 in Shopify, or prototype mode with Scenario B marked prototype) | #9 |
| D10 | Home emotional layer via media later | Home reserves exactly one **Moment** slot (§5.2) for skin/application/culture media; until real media exists, it renders a composition-only frame (scale, surface, crop, type) and never a stock or AI lifestyle stand-in | #5 |

---

## 1. Sitemap

Locale prefix: English at root, Arabic at `/ar` (Egypt). GCC markets add prefixes later (§14). All paths below exist in both locales.

```
/                                   Home
/collections/all                    Shop (all products)          → canonical "Shop"
/collections/{category}             Category (LATER, activates at ≥8 SKUs; §6.3)
/products/{handle}                  PDP (production)
/pages/preview/{handle}             PDP (prototype only; metaobject page; noindex)
/pages/routine                      Routines (AM / PM / Full Routine)
/products/the-full-routine          Full Routine bundle product (production, when real)
/pages/build-your-routine           Build-a-bundle (step picker)
/pages/find-your-routine            Product Finder
/pages/our-approach                 Climate Approach (the one climate page)
/pages/ingredients                  Ingredients & Formulation index
/pages/ingredients/{slug}           Ingredient detail (metaobject page)
/blogs/learn                        Learn (editorial)
/blogs/learn/{article}              Article
/pages/about                        About
/search                             Search results (+ predictive overlay everywhere)
/cart                               Cart page (fallback; drawer is primary)
/account (Shopify customer accounts) Account
/pages/help                         Help centre / FAQ
/pages/shipping                     Shipping & delivery
/pages/returns                      Returns & exchanges
/pages/contact                      Contact
/policies/privacy-policy            Privacy (Shopify policy)
/policies/terms-of-service          Terms (Shopify policy)
/policies/refund-policy             → mirrors /pages/returns content
/policies/shipping-policy           → mirrors /pages/shipping content
/pages/cookies                      Cookie notice
/pages/accessibility                Accessibility statement
/404                                Not found
```

Redirects to create: `/pages/shop → /collections/all`, `/pages/finder → /pages/find-your-routine`, `/pages/climate → /pages/our-approach`, old v5–v11 test paths → `/`.

Templates to retire: generic `collection.json`, `product.json`, `search.json`, `page.json` fallbacks once BTS templates ship (audit REMOVE list). v5–v11 homepage sections and `bts-experience.liquid` are deleted from the theme, not just unlinked.

---

## 2. Navigation

### 2.1 Mobile header (≤ 767 px), 52 px, sticky, hides on scroll-down after 200 px, returns on scroll-up
Inline order (LTR shown; RTL mirrors order, not icons):
```
[≡ Menu]  [)( logo → /]  [Shop] [Routine]  ……  [⌕] [ع | EN] [Bag 2]
```
- 44×44 minimum tap targets. `Shop` and `Routine` are text links (one tap, gate CRO #7).
- `⌕` opens the predictive search sheet with input focused (one tap).
- Language toggle shows the *other* language: `ع` on EN pages, `EN` on AR pages. It is a link to the equivalent localized URL, not a JS swap.
- `Bag n` shows count from the single active commerce source. Count `0` shows "Bag" with no number.
- At < 360 px, `Routine` moves into the menu sheet (Shop, Search, Bag, language stay).
- Logo is the exact )( SVG; never rendered from a font; never mirrored.

### 2.2 Menu sheet (from inline-start edge; RTL from right)
```
[Search field]                                  (first item, not focused automatically)
Shop                → /collections/all
   Reset · Clarity · Barrier · Defense         (40 px cap chips, direct PDP links)
The Routine         → /pages/routine
Find your routine   → /pages/find-your-routine
Ingredients         → /pages/ingredients
Learn               → /blogs/learn
About               → /pages/about
Our approach        → /pages/our-approach
────────────
Help · Shipping · Returns · Contact · Account
العربية / English
```
Focus trap, `Esc` closes, focus returns to trigger, `inert` on page behind. No mega menu at launch.

### 2.3 Desktop header (≥ 1024 px), 64 px
```
)( BETWEEN TWO SUNS     Shop ▾  Routine  Find yours  Ingredients  Learn  About       ⌕ Search   Help   ع   Account   Bag 2
```
`Shop ▾` opens a 1-row flyout: four cap chips with name, role, price + "Shop all" + "The Routine". No images beyond cap chips.

### 2.4 Footer
Four columns desktop, accordions mobile: **Shop** (four products, Routine, Build your routine, Finder) · **Learn** (Ingredients, Our approach, Learn, About) · **Help** (Help, Shipping, Returns, Contact, Account) · **Legal** (Privacy, Terms, Cookies, Accessibility). Wordmark SVG at the foot (one of the three permitted wordmark placements). Email/WhatsApp capture here only (§12.7). Payment icons render **only** for methods enabled in the active market's Shopify Payments / gateway settings.

---

## 3. Data model (single source for every surface)

All product-face content comes from one normalized **Face** object. Two adapters produce it; components never read Shopify products or prototype JSON directly.

### 3.1 Metaobject `bts_product` (one per SKU; content, both modes)
| Field | Type | Notes |
|---|---|---|
| `handle` | single line | `reset`, `clarity`, `barrier`, `defense` |
| `product` | product reference | Shopify product (production adapter) |
| `step` | integer | 1–4; drives routine order |
| `role` | single line, translatable | "Cleanse" / "Treat" / "Moisturize" / "Protect" (US spelling) |
| `display_name` | single line | "Reset", "Clarity"… (short, not translated) |
| `label_name` | single line | exact front-label name, e.g. "Daily Reset Cleanser" (not translated) |
| `promise` | single line, translatable | verbatim front-label benefit line |
| `suitability` | single line, translatable | label only, e.g. "For Oily to Combination Skin"; empty if label has none (Clarity) |
| `size` | single line | "200 mL", "30 mL", "50 g", "50 g" (web uses SI "g") |
| `hero_pair` | single line | label hero line, e.g. "Zinc PCA + Centella" |
| `claim_pills` | list, translatable, each with `approved_ar` boolean | exact back-label pills; Clarity has none on label → renders none |
| `why_formula` | multi-line, translatable | ONE sentence, consumer voice |
| `key_ingredients` | list of `bts_ingredient` refs (max 3 on back) | with per-product `why_here` text + optional `concentration` (only if confirmed + usable) |
| `back_description` | multi-line, translatable | verbatim back-label description (PDP "The Back") |
| `inci` | multi-line | exact final INCI, LTR Latin, never translated |
| `usage` | rich text, translatable | how to use; AM/PM flags |
| `am` / `pm` | boolean | Defense `pm=false` |
| `texture_label` | single line, translatable | "Clear gel" / "Fluid serum" / "Soft cream" / "Light SPF"; shown only if T2 still exists |
| `color_token` | single line | `mint` / `powder` / `lilac` / `peach` → CSS tokens (Pantone 345 U / 304 U / 2562 U / 163 U matched) |
| `media` | metaobject `bts_media_set` ref | §17 slot list |
| `faq` | list of `bts_faq` refs | product-specific |
| `substantiation` | JSON | per-claim status: `label_approved` / `tested` / `pending`; UI renders only `label_approved`/`tested` |
| `climate_line` | single line, translatable | the single back-face climate sentence (§13) |

### 3.2 Metaobject `bts_ingredient`
`name` (Latin, not translated), `plain_name` (translatable), `what_it_does` (translatable, one line), `glossary_body` (rich text), `slug`. Ingredient-level copy is generic; the product-specific "why it's here" lives on the product reference.

**Launch key-ingredient sets (from final label + education brief; ≤3):**
- Reset: Zinc PCA · Centella · Panthenol (why_formula centres the blended, sulfate-free cleansing system; no "repairs barrier").
- Clarity: Niacinamide 5% · Tranexamic Acid 3% · Hyaluronic Acid (percentages render only once confirmed against final production formula; until then names only).
- Barrier: Ceramides (NP/AP/EOP) · Niacinamide · Zinc PCA. Concentrations not shown (not supplied).
- Defense: UVA + UVB filters · Niacinamide · Panthenol. No filter-chemistry education until SPF/UVA test data is supplied.

### 3.3 Pricing config (`bts_pricing` metaobject, single entry)
`scenario` (`A`|`B`), per-SKU prices for both scenarios, `routine_price_{A,B}`, `routine_list_{A,B}`, `routine_saving_{A,B}`, `free_shipping_threshold` (**empty = never displayed**; EGP 1,200 is modelled but not approved), `currency`. Used **only** by the prototype adapter. In production, price comes only from Shopify variants; the production adapter must never read `bts_pricing` (enforced in the adapter, verified in Codex review).

### 3.4 Face object (what components consume)
```ts
Face {
  handle, step, role, displayName, labelName, promise, suitability, size,
  heroPair, pills[], whyFormula, keyIngredients[≤3], inciUrl,
  color, media { front, back, texture, hand, application, skin },
  price { amount, currency, formatted, source: 'shopify'|'prototype' },
  availability: 'available'|'sold_out'|'unavailable'|'preview',
  variantId | null, url, am, pm
}
```
Rendered server-side in Liquid via a single snippet `bts-face-data` that emits the object as attributes + inline JSON for enhancement. No product data in JS files.

---

## 4. Prototype vs production

Current reality: four Shopify products, **DRAFT, EGP 0, inventory 0**. Store on trial. Products must not be published, inventory not fabricated, checkout not implied live.

### 4.1 Mode switch
Theme setting `commerce_mode`: `prototype` | `production`. Single Liquid variable `bts_mode` available everywhere; emitted as `<html data-bts-mode>`.

| Concern | Prototype | Production |
|---|---|---|
| Product source | `bts_product` metaobjects (DRAFT products invisible to storefront) | Shopify product via `bts_product.product`; hidden if product unpublished |
| PDP URL | `/pages/preview/{handle}` (metaobject web page), `noindex` | `/products/{handle}` |
| Price | `bts_pricing` Scenario B, centralized | Shopify variant price (market-aware) |
| Availability | `preview` (no stock claims) | from variant `available` |
| Add | adds to **Preview bag** (sessionStorage, key `bts.previewBag.v1`) | Shopify Cart AJAX `/cart/add.js` |
| Bag UI | same drawer component, data from preview bag | Shopify cart |
| Checkout | button reads "Checkout opens at launch", disabled, `aria-disabled`, explains in one line | Shopify checkout |
| Routine offer | shows Scenario B routine 1,661 / save 185 (prototype data) | only if real bundle product exists (§9.3) |
| Search | client index from metaobjects (4 items) | Shopify Predictive Search API |
| Analytics | events carry `mode:"prototype"`; pixels **not** fired to ad platforms | full |
| SEO | whole storefront password-protected or `noindex`; no Product JSON-LD offers | full structured data |
| Reviews / delivery / COD / returns reassurance | not rendered | rendered only when facts configured (§17) |

### 4.2 Making prototype impossible to mistake (without polluting cards)
- One persistent **preview ribbon** at the very top of every page, 28 px, ink on off-white: "Preview store · prices are working prices · checkout not open". Not dismissible in prototype mode. Not repeated on cards.
- Drawer and cart page: checkout button replaced as above; subtotal labelled "Preview total".
- PDP price row has no extra label (ribbon covers it); the Add button reads "Add to preview bag" only in the drawer confirmation text, not on the button (button stays "Add").
- Order confirmation / account order history: not reachable in prototype.

### 4.3 Switching to production (checklist, founder-approved only)
Real prices set in Shopify → inventory tracked with real counts → products published to Online Store + Markets → bundle product created (if used) → shipping/returns/COD policies written → `commerce_mode=production` → remove password. Nothing in the theme changes except the setting.

---

## 5. Home

Content mix target (founder): ~30% brand/desire, 25% product/texture, 20% efficacy/proof, 15% routine/education, 10% climate.

### 5.1 Mobile (designed at 375×667, verified at 390×844 and 430×932)
Order (gate #2, fixed priority):
1. Header 52 (+ 28 preview ribbon in prototype).
2. **The Shelf**: native scroll-snap row of four front faces (§7). Active face 82vw, next peeks ~10vw. Face height `clamp(300px, 100svh − 367px, 420px)`. No dots; the peek communicates four.
3. Identity block, fixed height 96 px (no CLS on swipe), `aria-live="polite"`: `01 · Cleanse · 200 mL` / product name (condensed display) / verbatim promise.
4. Buy row 52 px: **[Add · EGP 399]** primary (≈70% width) + **[↻ Turn over]** secondary icon+label (≈30%, collapses to icon after first use per session). Turn over sits beside Add, visually subordinate (outline, ink).
5. Routine strip 56 px: `The Routine · all four · EGP 1,661 · save EGP 185 →` (saving only per D9). Opens routine sheet with one "Add all four". At 375×667 this may begin just below the fold (gate #2).
6. Below fold, in order: **Moment** slot (§5.2) → **The Back, explained** (one short module: "Every pack has two sides" + one live back face) → **AM / PM** routine module (AM 4 steps, PM 3 steps; toggle is a segmented control, not tabs of content) → **Ingredients** teaser (3 ingredient links) → **Our approach** one-liner + link (the only climate mention on Home) → Help/Delivery strip (renders only facts that exist) → Footer.
No autoplay video, no scroll-triggered animation, no pinned sections, no intro/preloader.

### 5.2 Moment slot (emotional layer, gate #5)
One full-width frame between shelf and education. Content priority: S1 real skin / A1 application still (tap to play video) / campaign frame. **Until real media exists:** composition-only frame — H1 packshot cropped large and off-centre on its surface, one line of display type ("fresh skin. always." or approved line), generous negative space. Never stock, never AI people, never "media pending".

### 5.3 Desktop (1440×900) — family portrait (gate #3)
- Left third: exact wordmark SVG as editorial object (~300 px tall, placement 1 of 3), tagline, routine offer with **Add all four**.
- Right two-thirds: the four packs photographed **together** as one H1 group shot (or composited from matched H1s on one continuous surface), staggered heights reflecting real pack proportions, shared light and contact shadows, slight overlap. Each pack is a hit region with a caption rail beneath the composition: `01 Reset · EGP 399 · Add` ×4 aligned under its pack.
- Hover/focus on a pack: caption rail item highlights; `↻` appears in the rail item to turn that product's face (opens its face in an anchored popover card, not in the photograph).
- Three-second test: wordmark, four products, four prices, Add each, Add all four — all visible without scroll or hover.
- Fallback before the group shot exists: four H1 singles on one continuous surface band, staggered vertical offsets (0 / 24 / 8 / 32 px) and scale by true pack height — still one composition, not cards.

### 5.4 Home acceptance
Brand + product + benefit + price + Add understood without interaction; routine ≤2 taps; zero console errors; LCP element = first H1 image (preloaded, `fetchpriority=high`, AVIF/WebP, ≤ 90 KB at 390 w).

---

## 6. Shop and collection scaling

### 6.1 Launch Shop (`/collections/all`), 4 SKUs
- Title "Shop" + one line. No filters, no sort (theatre at 4 SKUs).
- Routine row first: the Full Routine as a wide card (4 cap chips in step order, price, saving per D9, Add all four, "See the routine").
- Then four product faces (§7), **step order**, 1 column mobile (full face, turnable), 2 columns tablet, 4 desktop.
- Below: "Not sure where to start?" → Finder; "Build your own" → §9.4.

### 6.2 Collections at 5–7 SKUs
Same page; add a single horizontal **step filter** chip row: All · Cleanse · Treat · Moisturize · Protect. Chips are links (`?filter.p.m.bts.role=`) using Shopify Search & Discovery filters so the page works without JS.

### 6.3 Categories at ≥ 8 SKUs
- Collections by **role** (`/collections/cleanse`, …) are the primary taxonomy; by **concern** (oil/shine, uneven tone, hydration/comfort, daily SPF) secondary via metafield filter; never by climate.
- Collection header: role name, one line, count. Grid of faces; filters in a bottom sheet on mobile (role, concern, skin type as labelled, size), sort (featured, price ↑↓, new).
- Pagination: "Load more" (progressive, updates URL `?page=`), 12 per page.
- Multiple routines become `bts_routine` metaobjects (§9.1) and render as a routine rail at collection top.
- The face component does not change. Each future SKU needs a metaobject entry + H1 + P1 back photo to appear (omission rule §17).

---

## 7. Reusable product-face system

One component, `bts-face`, used in: Home shelf, desktop portrait popover, Shop/collection, PDP first frame, quick view sheet, search results (compact), Finder result, 404/empty-state suggestions. Cart/drawer uses the **cap chip** variant.

### 7.1 Variants
| Variant | Where | Turnable | Buy row |
|---|---|---|---|
| `shelf` | Home mobile | yes | Add + Turn over, outside the card |
| `card` | Shop, Finder result | yes | Add + Turn over under card |
| `pdp` | PDP gallery frame 1 | yes | PDP buy box separate |
| `compact` | Search, 404, empty cart | no (links to PDP) | Add (icon+price) |
| `chip` | drawer, cart, menu, routine lists | no | none |

### 7.2 Front face
- H1 photo on colour-matched surface with true contact shadow; `aspect-ratio: 4/5`; never a cutout on contrasting ground.
- Swatch chip (T2 still, 56 px square, inline-end bottom corner) with `texture_label`. **Omitted if no T2.**
- Tap on photo → PDP (or preview PDP). Photo is a link with accessible name "{labelName}, view details".

### 7.3 Back face (ruthless density, gate #4)
Matte pack colour ground (D7 contrast rule), content top→bottom:
1. Exact wordmark SVG as on pack (small, white or ink per contrast).
2. Claim pills — exact label pills only (0–3). Arabic pill text only where `approved_ar`; else pill stays English inside `<bdi>`.
3. `why_formula` — one sentence.
4. Up to 3 key ingredients: name (+ confirmed %) and one-line why.
5. `Full INCI & details →` opens the **detail sheet** (INCI, usage, texture, suitability, climate line, FAQ link). On PDP it scrolls to "The Back" section instead.
Nothing else. If content overflows at 375 px in either language, copy is edited, not the font size reduced below 14 px.

### 7.4 Turn interaction (gate #1)
- Trigger: explicit button only (`button[aria-pressed]`, label "Show the back of the pack" / "Show the front"). No swipe-to-turn, no tap-to-turn on image.
- Motion: `rotateY(180deg)`, 300 ms, `cubic-bezier(.2,.7,.2,1)`, `perspective: 1200px`, `backface-visibility:hidden`; contact shadow (separate element under card) scales X to 0.6 at midpoint and back, opacity 0.35→0.2→0.35 — reads as the object lifting slightly and settling. No bounce, no gloss, no card float/elevation change.
- RTL: rotation sign flips via `--bts-turn-dir`. Photos never mirror.
- `prefers-reduced-motion`: no rotation; faces swap with ≤80 ms opacity.
- Both faces in DOM; hidden face `inert` + `aria-hidden`; focus moves to back heading on turn, and stays on the button when turning back.
- Card height is fixed by the front aspect ratio; back never changes layout height (no CLS, Add never moves).
- State persists per card for the page view; a "Turn all" control does **not** exist.
- First visit: active shelf face shows "Turn over" label; after first use (sessionStorage) collapses to `↻` with tooltip/`aria-label`.

### 7.5 Buy row states
`Add · {price}` → pressed: spinner inside button (≤ 400 ms typical) → "Added ✓" 1.2 s → drawer opens (mobile: drawer opens immediately, button resets behind it). Error: button returns, inline message under row ("Couldn't add. Try again."). Sold out / unavailable: §20.

---

## 8. PDP

### 8.1 Desktop layout
Two columns (gallery 7/12, buy box 5/12, buy box sticky within its column).
**Gallery** frames in order; each renders only if the asset exists: 1 front face (`pdp` variant, turnable) → 2 P1 back photograph → 3 T2 texture still → 4 P2 pack in hand (scale) → 5 A1 application (poster + tap to play, muted, captions if voiced) → 6 S1 on skin (multiple skin tones when available). Thumbnails vertical left.

**Buy box (first decision zone, CRO playbook):**
```
01 · Cleanse · 200 mL
Daily Reset Cleanser                    (condensed display — the one display element)
Removes oil. Maintains hydration. Feels fresh.
For Oily to Combination Skin            (label suitability; omitted if none)
EGP 399                                  (+ "VAT included" in markets where required)
[ Add to bag ]                           [↻ Turn over] lives on gallery frame 1, not here
Part of The Routine · all four EGP 1,661 · save EGP 185 →   (D9 rule)
Delivery by {date range}                 (only if configured)
Cash on delivery available              (only if enabled)
Returns: {one-line policy}              (only if policy published)
Questions? WhatsApp us                  (only if channel staffed)
[★ 4.6 · 38 reviews]                     (only if ≥ N verified reviews; N set in settings, default 5)
```
### 8.2 Below the fold (both breakpoints)
1. **The Back** (full section): claim pills → `back_description` (verbatim) → key ingredients with Layer 2 "why it's here" expanders → Layer 3 "formula logic" (one paragraph) → full INCI (collapsed `<details>`, LTR, copy button).
2. **How to use**: amount, order, AM/PM, SPF reapplication guidance for Defense only once approved text exists.
3. **Where it sits**: previous and next routine step as chips ("Before: Reset · After: Barrier") + Add routine.
4. **Our approach**: one paragraph, link to `/pages/our-approach` (climate budget §13).
5. **Reviews**: only when real (§12.6). Otherwise section absent — no "Be the first" block in prototype; in production a "Write a review" link may appear inside the account order page only.
6. **FAQ**: product FAQ (`bts_faq`), `<details>` list.
7. **Complete the routine**: the other three faces as `compact` + routine card.

### 8.3 Mobile PDP (375–430)
- Gallery: full-width horizontal scroll-snap, 4:5, counter "1 / 5" (only real frames counted), Turn over button overlaid inline-end bottom of frame 1 only.
- Immediately under gallery: buy box stack as §8.1. At 375×667, **price and Add are visible without scroll** (gallery height `min(100vw*1.25, 100svh − 300px)`).
- **Sticky Add bar** appears when the primary Add leaves viewport (IntersectionObserver): 64 px + safe-area inset, contains cap chip · name · price · Add. Hidden while any sheet, drawer, or on-screen keyboard is open; hidden when primary Add is back in view. Page gets bottom padding equal to bar height so it never covers content. One sticky CTA only; no sticky routine bar.
- Sections of §8.2 as accordions except "The Back" (open by default, its first screen visible).

### 8.4 Quick view
From Shop/Home "details" (not photo tap — photo goes to PDP): bottom sheet (mobile) / side sheet (desktop) with `card` face, buy box subset (name, promise, price, Add), "Full details →". No gallery beyond frame 1.

---

## 9. Routines and bundles

### 9.1 Routine model (`bts_routine` metaobject)
`handle`, `name` (translatable), `steps` (ordered product refs), `time` (`am`|`pm`|`full`), `bundle_product` (product ref, optional), `offer_verified` (boolean), `description`.
Launch entries:
- **The Routine (AM)** — Reset → Clarity → Barrier → Defense (4 steps). This is the Full Routine offer.
- **PM** — Reset → Clarity → Barrier (3 steps). No bundle price in the pricing source → **no saving shown**; "Add all three" adds singles at single prices.

### 9.2 `/pages/routine`
- Header: "The Routine" + "Four steps in the morning. Three at night." (AM = 4, PM = 3 obvious, gate #9).
- Segmented control AM | PM (buttons, `aria-pressed`). Switching recomposes the step row (PM removes Defense and re-flows; RTL re-flows right→left, not reused coordinates).
- Step row: numbered chips `01 → 04` with role, name, one-line purpose, price, individual Add.
- Offer card: list value EGP 1,846 · Routine EGP 1,661 · you save EGP 185 (10%) — **only** with D9 true. Otherwise shows sum and "Add all four".
- One-tap **Add all four** / **Add all three**.
- "How to layer" short education (15% routine/education budget), then FAQ ("Can I use Clarity in the morning?" etc., only with approved answers).
- No unlock language, progress bars, trays, or gamification.

### 9.3 Bundle implementation (production)
Recommended: **Shopify Bundles** fixed bundle product "The Full Routine" (4 components, price 1,661 in Scenario B, market-specific prices later). Components deduct inventory correctly; the price is the guarantee of the saving, so the UI can show it truthfully.
- Add routine in production = add the bundle variant (one line in cart, expandable components).
- If a cart contains all four singles separately, the drawer offers **one** swap: "Switch to The Routine · save EGP 185" → replaces the four lines with the bundle (single cart update request). Not automatic; not a native discount claim (native discounts can't reliably express "all four distinct SKUs").
- If bundle product not yet created: `offer_verified=false`, no saving copy anywhere; "Add all four" adds four singles.
- Max stacked discount must not exceed 15% total (pricing source); promo codes on bundle configured accordingly in Shopify, not in theme.

### 9.4 Build-a-bundle (`/pages/build-your-routine`)
At 4 SKUs this is a **step picker**, not a configurator:
- Four step rows with checkbox toggles (all preselected **off**), each with cap chip, name, price.
- Live summary: "3 products · EGP 1,347". If all four selected and D9 true → summary changes to the Routine offer and adds the bundle.
- No mix-and-match discount unless an approved discount exists (then shown as real Shopify automatic discount and verified in cart before display).
- One Add button for the selection.
- LATER (≥ 8 SKUs): choose one per role, with the same component.

---

## 10. Product Finder (short, non-diagnostic)

`/pages/find-your-routine`. 3 questions, one per screen, ≤ 60 s. Progress "1 of 3". Back always available. Answers stored only in URL params/sessionStorage; not tied to the customer record; no health data collected.

1. **How does your skin usually feel by midday?** Shiny all over · Shiny in the T-zone · Comfortable · Tight or dry · Not sure
2. **What would you most like to improve first?** Shine / oil · Uneven-looking tone or dark spots · Daily sun protection · Keeping it simple
3. **How much routine do you want?** Just one product · Morning only · Morning and night

**Result screen:** one recommended starting product (`card` face, turnable, Add) + the matching routine (AM/PM/Full) with Add all. One sentence of reasoning built from answers ("You told us shine is your first priority, so start with…"). Mapping table lives in a `bts_finder` metaobject (JSON), not code.
- "Tight or dry" → honest line: "Our cleanser and moisturizer are formulated for oily to combination skin. Daily Defense is for all skin types." Recommend Defense; still show routine but not as primary.
- Always include: "This is a product guide, not a skin diagnosis. For persistent breakouts, pigmentation concerns or sensitivity, speak to a dermatologist."
- Never use condition words (acne, melasma, rosacea, eczema) as options or outputs.
- Result URL shareable (`?q1=…&q2=…&q3=…`).

---

## 11. Content pages

### 11.1 Our approach (`/pages/our-approach`) — the one climate page
Structure: what "climate-adapted" means for BTS in 3 short parts (oil balance through the day, hydration without heaviness, daily protection) → how each product carries that (one line per product, links) → how we formulate (label transparency, no ingredient fear-marketing) → CTA to Routine. Editorial photography when available. No environment selectors, weather imagery UI, or maps.

### 11.2 Ingredients (`/pages/ingredients`, `/pages/ingredients/{slug}`)
Index: A–Z list grouped by "Hero ingredients" (the ≤3 per product) then "Full formula glossary" (every INCI line across the four products, plain-name explanation). Each ingredient page: plain-name headline → what it does → which BTS products contain it and why there (product-specific why_here) → linked faces. Three-layer rule from the education brief. No fear language, no "free-from" lists except label-approved (Soap-free, Fragrance-free) and "sulfate-free" for Reset only if final production INCI unchanged.

### 11.3 Learn (`/blogs/learn`)
Shopify blog. Launch with 3–5 articles only when written and claim-reviewed (e.g. "How to layer a four-step routine", "How much sunscreen is enough", "Niacinamide and Tranexamic Acid, in plain words"). Article template: title, reading time, hero image (optional; omitted if none), body, "Products in this article" faces, related articles. **If fewer than 3 approved articles exist, Learn is removed from nav and footer.**

### 11.4 About (`/pages/about`)
Founder/brand story, why the pack looks the way it does (front/back), where it's made (only verified facts), contact line. Portrait/studio media when real; else typographic.

### 11.5 Help centre / FAQ (`/pages/help`)
Search-within-help field (filters FAQ client-side; works without JS as plain list), categories: Orders · Delivery · Returns · Products & routine · Payments · Account. Every answer from `bts_faq` with `status=approved`. Questions whose answers depend on unapproved operations are absent, not "coming soon".

### 11.6 Shipping (`/pages/shipping`), Returns (`/pages/returns`)
Rendered from structured policy metaobject (`bts_policy`: zones, lead times, fees, COD, threshold, return window, conditions). **Not published in production until founder-approved policy exists.** In prototype mode, pages render a single neutral line "Our delivery and returns policy will be published before launch." These pages are the only source for any delivery/return/COD reassurance elsewhere (PDP, drawer, help).

### 11.7 Contact (`/pages/contact`)
Shopify contact form (name, email, order number optional, message), WhatsApp link (only if staffed; hours shown), email. Response-time promise only if operationally real. Success state inline; error state preserves input.

### 11.8 Legal
Privacy, Terms, Refund, Shipping via Shopify policies (Arabic versions authored/legal-reviewed, not machine-translated). Cookie notice + consent banner using Shopify Customer Privacy API (required for GCC/EU visitors; configure for Egypt PDPL Law 151/2020). Accessibility statement. Footer links only to policies that exist.

---

## 12. Commerce surfaces

### 12.1 Predictive search
- Opens from `⌕` (sheet on mobile, dropdown panel on desktop). Input focused, 150 ms debounce, min 2 chars.
- Production: Shopify Predictive Search API (`/search/suggest?resources[type]=product,page,article,query`), locale-aware (`/ar/search/suggest`).
- Prototype: static index of the four `bts_product` entries + pages rendered inline at build.
- Results order: Products (`compact` faces with price + Add) → The Routine (if query matches routine terms) → Ingredients → Articles/Help.
- Synonyms (Search & Discovery app, EN+AR): sunscreen/spf/sunblock/واقي شمس/صن بلوك → Defense; cleanser/face wash/غسول → Reset; serum/سيروم → Clarity; moisturizer/moisturiser/cream/مرطب/كريم → Barrier; niacinamide/نياسيناميد → Clarity, Barrier, Defense; routine/روتين → Routine.
- Empty query: shows the four products (chips) + "Find your routine".
- No results: "Nothing for '{q}'." + four chips + Help link. Never blank.
- `Enter` → `/search?q=` full results page (same ordering, faces in grid).
- Keyboard: arrow keys through results, `Esc` closes, ARIA combobox pattern.

### 12.2 Cart drawer (primary) and `/cart` (fallback)
Drawer from inline-end, 240 ms translate, width 100% mobile / 440 px desktop, focus-trapped.
```
Your bag (3)                                      ✕
[chip] Daily Reset Cleanser  200 mL   − 1 +   EGP 399   Remove
[chip] Clarity Serum         30 mL    − 1 +   EGP 499   Remove
[chip] Daily Barrier Cream   50 g     − 1 +   EGP 449   Remove
────────────────────────────────
Suggestion (max ONE, see rules)
────────────────────────────────
Subtotal                                          EGP 1,347
Delivery calculated at checkout   (or real threshold/status if configured)
Estimated delivery {date range}   (only if configured)
Cash on delivery available        (only if enabled)
[ Checkout ]                       (prototype: disabled "Checkout opens at launch")
```
**Suggestion rules (exactly one or none):**
1. All four singles in cart and D9 true → "Switch to The Routine · save EGP 185" (one tap swap).
2. Else, 1–3 routine steps in cart → next missing step in routine order, labelled why: "Step 04 · after Barrier — Daily Defense SPF 50 · EGP 499 · Add".
3. Full routine present → no suggestion.
Never an interstitial; never blocks Checkout; no progress bars. Free-shipping line only if an approved threshold exists, phrased neutrally ("EGP 180 from free delivery"), no bar.
Quantity max per line 5 (setting). Quantity changes and removal update in place with `aria-live` subtotal. Errors (e.g. insufficient stock) inline on the line.
`/cart` page: same content full-page, works without JS (form posts).

### 12.3 Checkout
Shopify checkout, conventional. Guest checkout default; accounts optional. Express payments where enabled. COD visible when enabled. No theme customisation beyond branding (logo, colours, fonts) and Arabic locale. Checkout experiments are separate from brand-site releases.

### 12.4 Account
Shopify **new customer accounts** (passwordless email code). Pages: Orders (with **Reorder** → re-adds line items / bundle), Addresses, Profile, language preference. Account header link: "Account" / "Sign in". Order status page branded. Review invitation link appears on delivered orders only when a review app is live.

### 12.5 Subscription
LATER. Not in launch scope (CRO playbook). No subscribe toggles anywhere.

### 12.6 Reviews
Review app (e.g. Judge.me / Okendo / Shopify Product Reviews) installed but **all review UI gated** by setting `reviews_min_count` (default 5) per product: below threshold, no stars, no count, no empty state. Only verified-buyer reviews. Filters by skin type once ≥ 20 reviews. Aggregate rating in structured data only when rendered.

### 12.7 First-order capture
No entry popup. Capture in footer and after first Add (inline line in drawer: "Get routine tips and early access · email/WhatsApp") — only if a real sequence exists. Incentive only if economics approved.

---

## 13. Climate vocabulary budget

Terms counted: climate, heat, sun (outside "SPF"/"sunscreen"/"Defense"), humidity, humid, dust, pollution, AC, weather, environment(al).
| Surface | Max climate mentions |
|---|---|
| Home (entire page, excluding footer) | 1 sentence (Our approach line) |
| Product face front | 0 (label line "Climate-adapted skincare" appears only as part of pack photo) |
| Product face back | 1 sentence (`climate_line`) — shown only in detail sheet, not the capped back (D4) |
| PDP | back_description verbatim (may contain "environmental") + 1 approach paragraph |
| Shop, Routine, Finder, Cart, Search, Help | 0 (except Help answers that directly ask) |
| Our approach | unlimited, it is the page |
| Learn | per article, editorial judgement |
Codex/QA check: grep rendered HTML of each template against the term list; fail over budget.

---

## 14. Markets: Egypt now, UAE/KSA later

### 14.1 Egypt (launch)
Primary market, EGP, languages `en` (default) + `ar` (`/ar`). Prices VAT-inclusive as in pricing source. Payment: cards / wallets / COD as operationally enabled. Delivery by governorate (Cairo/Giza/Alexandria vs rest) only once logistics contract exists.

### 14.2 UAE and KSA (LATER, via Shopify Markets)
- Separate markets with **fixed local prices** set in Markets (not auto FX rounding), AED/SAR, VAT-inclusive display.
- URL: subfolders `/en-ae`, `/ar-ae`, `/en-sa`, `/ar-sa`. For KSA, Arabic SHOULD be default language.
- Market-specific: shipping/returns policies, payment methods (Apple Pay, Mada for KSA, BNPL if approved), delivery promises, regulatory copy (SFDA for KSA, UAE municipality/MOIAT listing as applicable), SPF claim wording as registered.
- Bundle pricing per market; D9 evaluates per market (`offer_verified` per market in `bts_routine` → JSON map keyed by market handle).
- Geolocation: Shopify Geolocation app suggests market via non-blocking banner; never auto-redirects.
- Theme must not hard-code "EGP" or "ج.م" anywhere — use `money` filters and a locale-aware formatter.
- Arabic copy: Egyptian Arabic for Egypt; GCC markets get a reviewed pass for Gulf readability (contemporary, neutral-leaning Arabic where Egyptian idioms would jar). Translations stored per locale; market-specific overrides via Translate & Adapt market customisations.

---

## 15. Arabic / RTL

- **Server-rendered** locale routing (`/ar`), `<html lang="ar" dir="rtl">`, Shopify Translate & Adapt for all strings and metaobject translations. Zero client-side language swapping; language choice persisted by Shopify locale cookie + `localization` form.
- **Product names stay English** (display name and label name) inside `<bdi dir="ltr">` — unless a formal Arabic naming system is approved (gate #6). Role, promise, why, usage, finder, service, legal: authored natural contemporary Arabic (Egyptian for Egypt), claim-reviewed.
- INCI remains Latin LTR block under an Arabic heading.
- Mixed data (SPF 50, 5% Niacinamide, 200 mL, prices, step numbers) always inside `<bdi>`.
- Price format: `1,661 ج.م` (Western digits, approved convention; confirm Eastern Arabic numerals decision with founder and apply consistently).
- Layout: logical CSS properties only (`margin-inline-start`, `inset-inline-end`); no `left/right` in component CSS. Directional icons (chevrons, arrows) mirror; ↻ turn icon and non-directional icons do not.
- Shelf starts at inline-start (step 01 on the right). Routine steps progress right→left. PM recomposition re-flows.
- Turn rotation sign flips; pack photography never mirrored; wordmark never mirrored or transliterated.
- Typography: authored Arabic display + UI pair, self-hosted, subsetted (candidate shortlist for founder: display — e.g. a condensed Arabic display such as "Alexandria" only as fallback pending a stronger licensed display face; UI — e.g. IBM Plex Sans Arabic / Readex Pro). Separate line-height (≈1.6 body), no letter-spacing on Arabic.
- Separate QA at 375 / 390 / 430 for every template: line breaks, button labels, sticky bar, sheets, drawer, routine reflow, price placement, back-face overflow.
- Gendered address (feminine vs neutral) is a **founder decision** before Arabic copywriting starts; default recommendation: neutral/plural address for SPF and cleanser surfaces.

---

## 16. Customer journeys

Each journey lists steps and the success metric. "Tap" counts from landing.

### 16.1 Social ad → product (most common paid path)
Ad (e.g. Clarity) → lands on **PDP** `/products/clarity-serum?utm…` (production) or preview PDP → first viewport shows name, promise, price, Add (no interaction) → optional Turn over on frame 1 → **Add (tap 1)** → drawer opens with next-step suggestion → **Checkout (tap 2)**.
Rules: ads never land on Home; ad creative's product must match PDP frame 1; Arabic ads land on `/ar/…`. Metric: ad-landing → add rate; PDP LCP.

### 16.2 Social ad → routine
Routine ad → `/pages/routine` → offer card visible in first viewport → **Add all four (tap 1)** → drawer → checkout (tap 2).

### 16.3 Product-led (knows what they want)
Home or search → type "sunscreen"/"واقي" → predictive result with Add (tap 2) or → PDP → Add. Or Shop → face → Add. Metric: search → add rate.

### 16.4 Concern-led (knows the problem, not the product)
Home → "Find your routine" (menu or home module) → 3 questions → result face + routine → Add. Alternative: Ingredients page ("dark spots" → Tranexamic Acid → Clarity). Metric: finder completion rate, finder → add.

### 16.5 Routine-led (wants the system)
Home → routine strip (tap 1) → routine sheet → **Add all four (tap 2)**. Or Build your routine → choose steps → Add. Metric: routine attach rate, AOV.

### 16.6 Returning customer
Header Account → Orders → **Reorder** (1 tap re-adds); or recognised via Shop Pay. Home shows no personalisation at launch; LATER: "Running low?" reminder email based on measured replenishment intervals. Language preference remembered. Metric: repeat purchase rate, time-to-reorder.

---

## 17. Content and media dependencies — graceful omission

### 17.1 Media slots
| Slot | Asset | Used in | If missing |
|---|---|---|---|
| H1 | packshot on matched surface ×4 | every front face, portrait | **Blocking.** Face falls back to corrected final-artwork render. Wrong-label v11 renders (Reset/Clarity/Defense) banned. No product displays without an approved image → product hidden |
| H1-G | four-pack group shot | desktop portrait | fallback composition §5.3 |
| P1-back | back-of-pack photo ×4 | PDP frame 2 | frame omitted; typographic back still works |
| T2 | texture still ×4 | swatch chip, PDP frame 3 | chip + frame omitted |
| P2 | pack in hand ×4 | PDP frame 4 | omitted |
| A1 | application clip | PDP frame 5, Moment | omitted |
| S1 | real skin (range of tones) | PDP frame 6, Moment | omitted; Moment uses composition frame |
| Editorial | about/approach/learn images | content pages | typographic layout |

### 17.2 Facts
| Fact | Unlocks | If missing |
|---|---|---|
| Real Shopify price + inventory + published | production Add, Product JSON-LD offers | prototype mode only |
| Bundle product live | routine saving copy | "Add all four" at single prices |
| Shipping policy | delivery lines, shipping page | lines absent; neutral prototype line on page |
| COD enabled | COD reassurance | absent |
| Returns policy | returns line, page | absent |
| Delivery SLA | date-range estimate | "calculated at checkout" |
| Verified reviews ≥ N | stars, count, review section, aggregateRating | absent entirely |
| Confirmed concentrations | % in pills/ingredients | names only |
| SPF/UVA test data | SPF education, filter explanations | label claims only |
| Arabic claim approval per pill | Arabic pill text | English pill in `<bdi>` |
| WhatsApp staffing | WhatsApp links | absent |
| ≥3 approved articles | Learn in nav | Learn hidden |
| Free-shipping threshold approved | threshold line | absent |

Implementation: every module takes a `requires` list; a shared Liquid snippet `bts-can-render` evaluates it. Founder/production modes never render placeholders. A `?bts_debug=media` param (prototype only, staff only) shows outlines where modules were omitted, for QA.

---

## 18. States

| State | Behaviour |
|---|---|
| Loading (page) | Server-rendered; no preloader, no skeleton for above-fold content. Images have `aspect-ratio` + surface colour placeholder (dominant colour of H1) |
| Loading (drawer/search/add) | Inline spinner in the control; drawer opens immediately with previous contents and updates |
| Add error | Inline message under buy row; retry keeps quantity |
| Network offline | Toast "You're offline. Your bag is saved." Add disabled until online |
| Out of stock (production) | Front face shows `Sold out` in buy row, Add replaced by "Notify me" (email, only if back-in-stock app active; else just "Sold out", disabled). Face stays in Shop (not hidden) at end of grid. Routine: if any component sold out, bundle Add disabled with "Reset is sold out — add the others"; drawer suggestions skip sold-out items |
| Unavailable in market | Product hidden from that market's catalogue; direct URL shows PDP with "Not available in {country}" and Shop link |
| Prototype | `preview` availability; ribbon; closed checkout (§4) |
| Empty bag | Branded line (keep v11 language as base) + four `compact` faces + "Shop the routine" |
| Empty search | §12.1 |
| No results in Help search | "No answer for that yet" + Contact |
| 404 | Branded line + search field + four `compact` faces + Home. Status 404, noindex |
| Form errors | Inline, field-level, `aria-describedby`, preserve input |
| JS disabled | Product, price, Add (form post), nav, search page, cart page all work. Turn over hidden; back content rendered as PDP section |
| Reduced motion / Save-Data | No rotation; no video autoload; lower-res images via `srcset` hints |

---

## 19. Analytics

Implementation: Shopify **Customer Events** (Web Pixels API) as the single bus; GA4 and Meta/TikTok via custom pixels subscribing to it; consent-gated through Customer Privacy API. Theme publishes custom events with `Shopify.analytics.publish('bts:…', payload)`.

Every event includes: `mode` (prototype|production), `locale`, `market`, `page_type`, `surface` (home_shelf, shop_grid, pdp, quick_view, search, finder, drawer, routine_page, build, 404, empty_cart).

| Event | When | Extra properties |
|---|---|---|
| `page_viewed`, `product_viewed`, `collection_viewed`, `search_submitted`, `product_added_to_cart`, `cart_viewed`, `checkout_started`, `checkout_completed` | Shopify standard | — |
| `bts:face_turned` | Turn over pressed | `handle`, `to` (back|front), `first_use` |
| `bts:inci_opened` | detail sheet / INCI expanded | `handle` |
| `bts:ingredient_expanded` | Layer 2/3 expanded | `handle`, `ingredient` |
| `bts:shelf_swiped` | active face changes | `from`, `to`, `index` |
| `bts:quick_add` | Add from any non-PDP surface | `handle`, `price`, `surface` |
| `bts:routine_add` | Add all (4 or 3) | `routine`, `value`, `bundle` (bool) |
| `bts:routine_toggle` | AM/PM switch | `to` |
| `bts:routine_swap_shown` / `_accepted` | drawer swap | `saving` |
| `bts:next_step_shown` / `_added` | drawer suggestion | `handle`, `step` |
| `bts:build_changed` / `bts:build_add` | build-a-bundle | `steps[]`, `value` |
| `bts:finder_started` / `_answered` / `_completed` / `_result_add` | Finder | `q`, `answer`, `result_handle`, `routine` |
| `bts:search_opened` / `bts:predictive_click` / `bts:search_no_results` | search | `query_length`, `result_type`, `position` |
| `bts:sticky_add_shown` / `_used` | PDP sticky | `handle` |
| `bts:locale_switched` | language link | `from`, `to` |
| `bts:help_opened` / `bts:whatsapp_clicked` | service | `topic` |
| `bts:media_played` | A1 tap-to-play | `handle`, `slot` |
| `bts:checkout_blocked_prototype` | preview checkout pressed | — |

No PII in custom events; Finder answers are not sent to ad platforms. Prototype mode: events go to a GA4 debug/staging property only; ad pixels disabled.

KPIs dashboard: CVR by landing surface, add rate per face, turn rate and turn→add, routine attach %, AOV, finder completion, search no-result rate, CWV (LCP/INP/CLS p75 by template), locale split.

---

## 20. SEO and structured data

- Prototype: storefront password on, or `noindex,nofollow` on every page + robots.txt disallow. Preview PDP pages always `noindex`.
- Production:
  - Titles: `{Label name} — {role}, {size} | Between Two Suns`; AR titles authored.
  - Meta descriptions from promise + suitability.
  - Canonicals: one per product (`/products/{handle}`), collection-scoped product URLs canonicalise to it.
  - `hreflang` for en/ar and later market variants + `x-default` (Shopify Markets generates; verify).
  - **JSON-LD:** `Organization` (logo, sameAs socials), `WebSite` + `SearchAction`, `BreadcrumbList` (PDP, collection, article, ingredient), `Product` (name, description, image, brand, sku, gtin if exists, `offers` with real price/currency/availability — **never in prototype**), `aggregateRating`/`review` **only when rendered reviews exist**, `ItemList` on Shop, `Article` on Learn, `FAQPage` on Help/product FAQ (content must be visible on page), `ProductGroup`/bundle: the Full Routine as its own `Product` with its real price.
  - Image alt: authored per locale ("Daily Reset Cleanser, 200 mL, mint pack, front").
  - Ingredient pages are indexable content (long-tail: "niacinamide and tranexamic acid serum Egypt").
  - No indexing of `/search`, `/cart`, `/account`, filter permutations (`?filter`), Finder result params.
  - Sitemap: Shopify default; metaobject pages included when published.

---

## 21. Performance and accessibility budgets

- LCP ≤ 2.0 s target / 2.5 s gate (mid-tier Android, 4G, lab); INP ≤ 200 ms; CLS ≤ 0.05.
- JS: ≤ 30 KB gz for global (nav, drawer, search, face turn), page scripts deferred, no framework, no animation library. Zero third-party scripts before interaction except consent + analytics.
- Fonts: self-hosted, subsetted, `font-display: swap`, preload only the display face used above fold. Remove both Google Fonts includes.
- Images: AVIF/WebP `srcset`, explicit dimensions, lazy below fold.
- WCAG 2.2 AA: contrast (D7), focus visible, 44 px targets, keyboard for turn/sheets/drawer/search combobox, `inert` for hidden faces and background under modals, captions for voiced video, `lang` attributes on mixed content.

---

## 22. Engineering structure (reference)

- Snippets: `bts-face` (variants), `bts-face-data`, `bts-chip`, `bts-price`, `bts-buy-row`, `bts-can-render`, `bts-routine-card`, `bts-bdi`.
- Sections: `bts-header`, `bts-footer`, `bts-preview-ribbon`, `bts-home-shelf`, `bts-home-portrait`, `bts-moment`, `bts-back-explained`, `bts-routine-module`, `bts-pdp-main`, `bts-pdp-back`, `bts-pdp-sections`, `bts-shop-grid`, `bts-routine-page`, `bts-build`, `bts-finder`, `bts-search`, `bts-help`, `bts-policy`, `bts-ingredient`, `bts-404`.
- JS modules: `bts-core.js` (mode, formatter, analytics publish), `bts-cart.js` (adapter: `ShopifyCart` | `PreviewBag`, same interface `add/update/remove/swapToRoutine/get`), `bts-face.js`, `bts-search.js`, `bts-drawer.js`, `bts-finder.js`.
- CI checks: INCI/claim parity test (metaobject vs `FINAL_LABEL_SOURCE_OF_TRUTH.md`), climate-term budget grep, no hard-coded price/currency grep, no `left|right` in component CSS, Lighthouse CI budgets, axe run, zero console errors via Playwright at 375/390/430/1440 in EN and AR.

---

## 23. Milestones

1. **M0 — Hygiene (P0):** unwire v11 from `index.json`; fix/remove JS error; retire wrong-label renders; delete v5–v11 sections; single header/footer; correct `BRAND_MANIFEST.md`; book Tier 2 studio day (H1, P1-back, T2, P2).
2. **M1 — Data + mode:** metaobjects (`bts_product`, `bts_ingredient`, `bts_pricing`, `bts_routine`, `bts_faq`, `bts_policy`, `bts_finder`) populated from final label; `commerce_mode`; cart adapter (PreviewBag); preview ribbon; `/ar` locale enabled.
3. **M2 — Global shell:** header, menu sheet, footer, predictive search, cart drawer + `/cart`, 404/empty states — EN + AR.
4. **M3 — Product face + PDP:** `bts-face` all variants with turn; PDP desktop + mobile with sticky Add; quick view; preview PDP routes.
5. **M4 — Home + Shop:** mobile shelf, desktop family portrait, Moment slot (composition frame), Shop grid.
6. **M5 — Routine system:** routine page, AM/PM, build-your-routine, drawer suggestion/swap logic.
7. **M6 — Finder + content:** Finder; Our approach; Ingredients; About; Help; Shipping/Returns/Contact/legal shells with omission rules; Learn only if ≥3 articles.
8. **M7 — Media integration:** Tier 2 assets into H1/P1/T2/P2 slots; desktop group shot; re-QA.
9. **M8 — Gates:** 375/390/430/1440 × EN/AR QA; CWV + axe + parity + climate-budget CI; Opus design gate → Codex engineering gate → ChatGPT CRO/UX gate → founder review.
10. **M9 — Production switch (founder-approved):** real prices/inventory, publish, bundle product, policies, reviews app, pixels live, `commerce_mode=production`, remove password.
11. **M10 — Markets (LATER):** UAE then KSA via Shopify Markets: local prices, payments, policies, regulatory copy, Gulf Arabic pass.
