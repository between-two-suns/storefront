# BETWEEN TWO SUNS — V12 OPUS M2 IMPLEMENTATION GATE
Reviewer: Claude Opus (creative director) · 2026-09-30 · Branch: `build/vertical-slice`
Scope: the M2 vertical slice — product-face component, Home flagship shelf, PDP, and the C1–C6 conditions from `V12_OPUS_M0_M1_GATE.md`, judged against the corrected Route B in `V12_INDEPENDENT_REVIEW.md`.

Reviewed: `assets/bts-tokens.css`, `bts-base.css`, `bts-components.css`, `bts-face.css`, `bts-home.css`, `bts-pdp.css`, `bts-core.js`, `bts-face.js`, `bts-pdp.js`; `sections/bts-foundation-home.liquid`, `bts-product.liquid`, `bts-collection.liquid`, `bts-header.liquid`, `bts-footer.liquid`; all `snippets/*.liquid`; `templates/*.json`; `locales/en.default.json`, `locales/ar.json`; `data/content/**`, `data/prototype/config.json`, `data/media-safety.json`, `data/fonts.md`; `scripts/check-*.mjs`, `tests/*`, `test-results/*`.

Runtime actually executed by me for this gate: `npm run check` (all pass), `shopify theme check` (37 files, 0 offenses), and a read-only Playwright measurement pass over the repo's own fixture at 375×667, 390×844 and 1440×900 in EN and AR. Measurements are quoted below. No code was modified.

---

## Verdict: **FAIL**

This is a FAIL of the M2 **deliverable**, not of the foundation. To be explicit, so nothing gets thrown away:

- **C1–C6 are met.** Sign them off. The data contract, money contract, header, marker discipline, token layer and sheet behaviour are correct and should not be revisited.
- **The engineering substrate is the strongest work on this project so far.** Theme Check is clean, 41 browser cells pass with axe at WCAG 2.2 AA, label parity is enforced per SKU, AR never falls back to English, media fails closed, gzip budgets are enforced, launch is fail-closed, and there are no price literals. Keep all of it.
- **The design fails at the centre of the concept.** On desktop, not one price or Add button is above the fold, and the four packs render at four unrelated sizes. In Arabic, no product photography renders at all and there is no back face. The back face prints the front's promise verbatim on all four SKUs, and half its ingredient lines attribute whole-formula properties to single ingredients — the exact defect class this gate exists to stop.

Route B has been *implemented* but not *art-directed*. The turn works; the composition does not. Removing the turn animation today leaves a four-card grid under a small logo, which is the precise failure the independent review predicted in its weakness #2. I am not approving that a second time after v8–v11.

Nothing here is founder-facing: C7 (H1 photography), C8 (type), C9 (Arabic address) remain unmet, and every visual verification to date is against a grey 600×760 rectangle.

---

## 1. What is genuinely good, and must survive the next pass

1. **Selective turn, correctly enforced.** `bts-face.liquid` gates `can_turn` on `variant == 'shelf' or 'pdp'` only; collection uses `variant: 'grid'`; drawer and cart lines use cap chips. `check-v12.mjs` asserts the gate expression, and the browser suite asserts zero `.pf__stage` on collection and compact surfaces. Independent-review correction #1 is executed exactly as written. This is the single most important thing you got right.
2. **The turn mechanics match the spec.** 320 ms, `perspective: 1200px`, one ease with no overshoot, rotation about the vertical axis in reading direction via `--bts-turn`, no glare, no lift, no scale, no WebGL. `assert`s confirm `.pf__media img` never carries a transform, so photography never mirrors in RTL. Reduced motion is a 120 ms crossfade. Correct.
3. **Commerce does not move.** Price and Add sit in `.pf__buy`, outside `.pf__stage`. The browser test asserts the Add bounding box and the price string are byte-identical before and after the turn. `aria-pressed`, `inert` on the hidden face, photo→PDP and turn-only-on-the-control are all as specified.
4. **Claim provenance is machine-enforced.** `check-label-parity.mjs` rejects foreign claims, reordered INCI, foreign ingredients and unapproved aliases. Clarity's `claims: []` is *correct* — the label has no back pills — and `.pf__pills:empty { display: none }` handles it. That is the right instinct.
5. **Money contract closed.** One pattern from locales, shared by Liquid and JS, no decimals, `1,661 ج.م` in AR inside `<bdi>`, asserted equal between the two renderers.
6. **Fail-closed media.** `bts-media.liquid` emits nothing unless the file is approved, the role matches and `label_version == inci_version`. Stale-label media is asserted to produce no frame. No placeholder frames anywhere.

---

## 2. Release blockers

### B1 — Desktop Home has no commerce above the fold, and the four packs are at four unrelated scales
`bts-home.css:11` sets `grid-template-columns: 1.15fr .75fr 1.1fr 1fr` with staggered `margin-block-start` of 84/32/60 px. Measured at 1440×900 with four **identical** source images:

| | Reset | Clarity | Barrier | Defense |
|---|---|---|---|---|
| stage width | 354 px | 231 px | 338 px | 308 px |
| stage height | 448 px | 292 px | 429 px | 390 px |
| buy-row top | 896 px | 824 px | 943 px | 932 px |

First buy row bottom: **948 px in a 900 px viewport.** No price and no Add button is visible without scrolling.

Three failures at once. It fails the creative gate ("within three seconds: brand, product, core benefit, price and Add are clear"). It fails the Route B desktop spec ("all four prices are visible at once"). And it fails M0/M1 §5.1 #2 ("all four sit at identical physical scale… at their real relative heights"): Clarity renders 35 % smaller than Reset for no reason other than an `fr` value, so a 30 mL serum and a 200 mL cleanser are sized by CSS whim rather than by the products. Asymmetry was asked for as *art direction*; this is asymmetry by arbitrary scaling, which is the one form of it that misrepresents the goods.

**Fix.** Scale must come from the products, not the grid.
1. Add a real-height field to `bts_product_content` (`pack_height_mm`, integer, from the artwork dielines) and seed all four.
2. Give the shelf one scale unit: `--pf-unit` on `.bts-shelf` (px per mm), and set each face's height as `block-size: calc(var(--pf-unit) * var(--pf-mm))` with `--pf-mm` written per item from the metaobject. Width follows from `--pf-ratio`. Then the tube, bottle, jar and tube are in true relative proportion and *cannot* drift.
3. Get composition from **vertical offset, gutter rhythm and crop**, not from width. Keep the stagger; delete the unequal `fr` values (use equal tracks or tracks sized by the faces' natural widths).
4. Land the commerce line. At 1440×900 the band + four faces + four buy rows must fit 900 px: cap the tallest face at `min(420px, 100svh - 420px)` and put the four buy rows on **one shared baseline** (make `.pf__info` a fixed-height block, §B4, and align the faces to a common floor rather than a common ceiling, so the packs stand on a shelf line — which is also the idea).
5. Build the band that was specified and is missing: wordmark as a ~300 px-tall editorial object inline-start, "fresh skin. always." and the routine offer (price, save, Add all four) inline-end. Right now the band is a 220 px-wide logo in a 56 %-width div and nothing else, which is why the page reads as Dawn with better typography.

### B2 — The Arabic storefront renders no product photography
`bts-media.liquid:10` requires `media.alt.value.approved[language] == true` before the `<img>` is emitted. There is no approved Arabic alt for any asset, so **in Arabic the product image is deleted, not just its alt text.** Measured at 375×667 AR: zero `.pf__stage`, and the first buy row bottom is 253 px — the entire card has collapsed to a text row.

Fail-closed is right for regulated *claims*. A packshot's alt is a product name, not a claim, and dropping the hero image to avoid an untranslated alt is a worse outcome on every axis: commercial, accessibility and brand.

**Fix.** Split the two gates in `bts-media.liquid`. Render the image whenever `media.approved`, `role` and `label_version` are satisfied. For alt: approved locale alt → use it; otherwise fall back to `content.name` (a Latin proper noun, already rendered on the page inside `<bdi lang="en">`), never to an approved English *sentence*, and never to empty. Then update the AR assertion in `tests/browser.mjs:67` — it currently asserts `bts-product-face` count is 0 in AR, which codifies the broken state as expected behaviour. It should assert the image renders and the turn is absent.

### B3 — The back face repeats the front, and three of four SKUs misattribute formula properties to single ingredients
`promise === does` for **all four** SKUs. Turning the pack over currently reveals the same sentence the customer just read above the price. That is the concept's payoff, and it is empty.

Worse, `key_ingredients[].why` splits whole-formula properties into per-ingredient claims. Against `FINAL_LABEL_SOURCE_OF_TRUTH.md`, Defense's label says the *formula* is "lightweight, fast-absorbing… with no white cast"; the data renders "Niacinamide → lightweight", "Panthenol → fast-absorbing", "Bisabolol → no white cast". All three are unsupported attributions, and Bisabolol is simply not why there is no white cast. Reset has two of three ("Panthenol → hydrating" is fine; "Centella → fresh and comfortable" is a feel, not a reason). Barrier has one ("Niacinamide → Hydrates without heaviness"). `check-label-parity.mjs` passes because it validates that the *string exists in the document* — it validates provenance, not attribution. That is the same shape as Green Tea and "Prevents breakouts": a plausible sentence, sourced from the right file, attached to the wrong thing.

`feels_like` is also degenerate: "Hydrates.", "Lightweight.", "Lightweight. Fast-absorbing." are slices of the promise, not textures. The label has no *feels like* line, so it was synthesised.

And `suitability` — "For Oily to Combination Skin", "For All Skin Types" — is approved, on-label, genuinely differentiating, and **rendered nowhere**. Neither is `back_description`, except as `formula_logic` on the PDP.

**Fix.**
1. Remove `does` from the back face. The front already carries the promise; printing it twice is what makes the turn feel like a component demo. On the back, lead with the label's `suitability` line and a short form of `back_description` — real, approved, and new to the reader.
2. Null every `why` that is a whole-formula property and hide the row rather than filling it. Defense has no defensible per-ingredient lines from the current label: ship Defense's back with pills + suitability + description + INCI and **no** ingredient block until substantiation exists. An honest three-line back beats a padded six-line one.
3. Null `feels_like` on all four until a texture line is authored and approved. `.pf__feels` already hides when blank.
4. Extend `check-label-parity.mjs` with an attribution rule: a `why` string may only be used if it appears in the label sentence **that names that ingredient**, or carries an explicit `attribution_approved: true`. Fail the build otherwise. Provenance without attribution is not parity.

### B4 — The 375×667 commerce line has 26 px of margin and no guard
Measured at 375×667 EN: header 52 + sticky marker 27 + stage 390 → price bottom 627, buy-row bottom **641** in a 667 px viewport. It fits only because the fixture happens to be 4:5.07. `.pf__stage` has `aspect-ratio: var(--pf-ratio)` and **no `max-block-size`**, so the ratio is whatever the photographer delivers: a 2:3 crop puts Add at ~745 px and the price below the fold. Route B budgeted `card ≤ min(420px, 100svh − 360px)`; that clamp was not built, and no test asserts price or Add is inside the first viewport.

**Fix.** `max-block-size: min(420px, 100svh - 360px)` on `.pf__stage` (with `inline-size` following from the ratio so the pack stays centred, not stretched). Add a browser assertion at 375×667 and 390×844, EN and AR: `.pf__buy` bottom ≤ viewport height. Also reconsider the sticky marker — `.bts-marker` is `position: sticky` under the header and costs 27–30 px of the tightest viewport we have, permanently. Make it static, or fold it into the 52 px header row.

### B5 — Search and Routine are dead ends
`templates/` contains only `404`, `cart`, `collection`, `index`, `page.preview-product` and `product`. There is no `search.json` and no `page.json`. The header renders a search control (`bts-header.liquid:10`) pointing at a surface that cannot render. `pages.routine` is referenced in the header, footer, menu sheet, PDP and the home routine strip — all five are `{% if pages.routine != blank %}` guarded, and a routine page cannot exist without `templates/page.json`. Measured: `.bts-routine-line` does not render at any viewport (`routineTop: null`).

So the routine — the founder's AOV logic, "2 taps from landing", and the only cross-sell in the plan — **does not exist on the site**, and `routineSaving` and `swapToRoutine` are computed in the adapter and consumed by nothing. The approved `save: 185` never reaches a screen.

**Fix.** Add `templates/page.json` and build the routine strip for real: `All four · EGP 1,661 · save EGP 185 →` rendered from `bts_prototype_config` only (never a literal), opening a sheet with one Add. Either add `templates/search.json` or remove the search control until it exists; a control that leads nowhere is worse than an absent one.

### B6 — Nothing is founder-facing: C7, C8, C9 still open
- **C7.** `media_front` is `null` on all four SKUs and `data/media-safety.json` records that no media entries are seeded. With no H1, `image` is blank, `can_turn && image != blank` is false, and **the FRONT/BACK interaction does not render in the real theme at all.** Every visual claim in this slice rests on a grey 600×760 rectangle in a LiquidJS fixture. That includes the scale question in B1, which is untestable while all four fixtures share one ratio.
- **C8.** No `@font-face` anywhere. `--font-display` resolves to Arial Narrow, `--font-ar-ui` to Arial. The one typographic signature we have — condensed product names — is currently Arial Narrow, and Arabic is Arial. `data/fonts.md` is honest about this.
- **C9.** Arabic address (feminine vs neutral) is still undecided, and the AR UI vocabulary for the whole signature is empty: `turn`, `turn_label`, `back`, `ingredients`, `feels_like`, `use`, `full_inci`, `shop`, `routine`, `search`. These are chrome strings, not regulated product claims — there is no reason to hold them. Note the consequence in `bts-header.liquid:10`: because `bts.search` is empty, the search control is removed for Arabic readers entirely.

**Fix.** C7 and C8 are scheduling, not engineering — book the studio day and clear the licence. Author the ten AR UI strings now; they are not gated on C9. Keep AR *product* fields null until approved.

---

## 3. Polish — fix before the founder link, not before code review

| # | Finding | Exact fix |
|---|---|---|
| P1 | `.pf__back` is `overflow: auto` (`bts-face.css:12`) and `bts-face.js:26` sets `tabIndex` when it overflows. M0/M1 §5.1 #5 forbids a scrolling back. The guard rails are right; the affordance shouldn't exist. | Keep the ResizeObserver as a **dev assertion** (it already backs the test at `browser.mjs:54`). Once B3 cuts the back content, set `overflow: hidden` and let the test fail loudly if it ever overflows — especially in AR, where the fit is currently untested because AR has no back. |
| P2 | Back-face type is 12 px body and 11 px pills. On the brand's proof surface that reads as fine print, and it is only that small because the back is overfull. | After B3's cut, target 14 px body / 12 px pills minimum, and re-measure the fit. |
| P3 | `.pf__stage::after` is a 1 px line with `box-shadow` at the stage's bottom edge, spanning `inset-inline: 20%`. The pack's contact point in a cropped photograph is almost never at the photo's bottom edge, so the shadow will float free of the object — and it reads as a card shadow, which §5.1 #1 forbids. | Drive the shadow's position from a per-media focal field (`contact_y`, 0–1) so it sits under the pack. If that is not worth the field, delete the pseudo-element: the contact shadow belongs in the photograph. |
| P4 | `style="--pf-ratio:{{ ...aspect_ratio }}"` is unguarded. An empty value makes `aspect-ratio` invalid, the stage collapses to 0 px, and both absolutely positioned faces vanish — a silent blank LCP element. | `aspect-ratio: var(--pf-ratio, 4 / 5)` and skip the stage entirely when the ratio is blank. |
| P5 | `.pf__info` has no fixed height, so the buy row sits at a different vertical position on every card. Measured on desktop: 824–943 px; in AR at 375: 201 vs 238 px. Route B specified a fixed-height info block explicitly, to stop the price jumping on swipe. | Fixed `block-size` on `.pf__info` (meta 1 line, name up to 2, promise up to 2), measured in AR at 375. This also delivers B1's shared baseline. |
| P6 | Adding to bag auto-opens the modal drawer every time (`bts-core.js:172`), interrupting shelf browsing. Route B specified an inline "Added ✓" for 1.2 s. | Morph the button, update the bag count, do not open the drawer from the shelf. Keep the drawer-on-add for the PDP if you want it. |
| P7 | The shelf auto-turns cards back to front 600 ms after they leave the viewport (`bts-face.js:30-36`). Not specified, and it discards a state the customer chose. | Drop it, or only reset on page navigation. |
| P8 | The mobile home has no wordmark at all — `.bts-home__brand { display: none }` below 990 px and the `h1` is visually hidden, leaving a 28 px header icon as the only identity on the brand's primary surface. Standing direction is to *control* where the tall wordmark appears, not to remove it. | Give mobile home one restrained wordmark moment. It does not have to be the hero; it must exist. |
| P9 | `config/settings_schema.json` exposes `bts_mode` and `bts_launch_confirmed`, but `layout/theme.liquid:1` and `bts-core.js:2` hard-code prototype. A merchant switching to "Launch" changes nothing. | Remove the settings until they are wired. Fail-closed is right; a lying control is not. |
| P10 | `bts-face.liquid:29` renders the back with `hidden`, so no-JS readers get no back content on the shelf (the PDP's unfolded section covers SEO). | Acceptable as-is — the turn is explicitly non-essential to buying. Record the decision rather than fixing it. |
| P11 | `data/content/**` records `50 g` where the artwork says `50 gm` (Barrier, Defense). | Either match the artwork or record the normalisation as an approved deviation in `FINAL_LABEL_SOURCE_OF_TRUTH.md`. Silent drift from the pack is how we got here. |
| P12 | `formula_logic === back_description` on all four, so the PDP's "The Back" section repeats the paragraph the back face will carry after B3. | Once B3 puts `back_description` on the face, `formula_logic` must be authored as the longer *why this formula* paragraph, or nulled. |
| P13 | Desktop PDP is a 1fr/1fr image-left, text-right grid (`bts-pdp.css:13`) with stacked full-width frames below — competent and completely generic. `.bts-sticky-add` is also a full-width fixed bar on a 1440 desktop. | Art-direct the PDP desktop against the H1 set once it exists, and scope the sticky bar to `< 990px` or dock it inline-end on desktop. |
| P14 | `sections/bts-foundation-home.liquid` is now the flagship. | Rename to `bts-home.liquid`. |

---

## 4. Verification honesty

Credit where it is due: `tests/browser.mjs` labels itself "LiquidJS with explicit Shopify stand-ins; synthetic geometry image only" and the Lighthouse summary says "LOCAL FIXTURE WITHOUT H1 MEDIA/SHOPIFY SCRIPTS/FONTS". That is the right way to report. Do not let anyone quote the 100/100 performance scores as evidence: they were measured with no photography, no fonts and no `content_for_header`. LCP is currently an SVG rectangle; it will be a 1600 px hero.

Still outstanding from C10: a **rendered Shopify preview** in EN and AR (everything so far is LiquidJS), and **screenshots** — there is not a single captured image in `test-results/`, which is why B1 had to be found by measuring rather than by looking. Add screenshot capture at 375/390/430/1440 × EN/AR to `tests/browser.mjs`; a composition failure this large should have been visible on the first artefact.

---

## 5. What I will check on re-review

Binary, in order:

1. At 1440×900, all four prices and Adds are above the fold, on one baseline, and the four packs are in true relative proportion driven by `pack_height_mm`.
2. At 375×667 and 390×844, EN **and** AR, `.pf__buy` bottom ≤ viewport height, asserted in the suite, with a real H1 crop.
3. In Arabic, the product photograph renders.
4. The back face contains no sentence that appears on the front, and no per-ingredient line that the label does not attribute to that ingredient.
5. The routine strip renders with its approved saving, from config, and leads somewhere.
6. Real H1 photography for all four SKUs, self-hosted display/UI/Arabic faces, and the founder's Arabic address decision.
7. Screenshots in `test-results/`, and a rendered Shopify preview in both locales.
8. With the turn disabled, the Home page is still recognisably BETWEEN TWO SUNS.

Item 8 is the one that decides this. Today the answer is no.

---

**Gate result: FAIL.** C1–C6 are signed off and the engineering substrate is approved — do not rebuild it. The Home composition, the Arabic render path, and the back-face content must be redone before any further visual review, and C7–C9 must land before the founder sees anything.
