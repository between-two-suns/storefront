# BETWEEN TWO SUNS — V12 OPUS M2 FINAL GATE
Reviewer: Claude Opus (creative director) · 2026-09-30 · Branch: `build/vertical-slice`
Scope: final re-gate of the corrected M2 vertical slice against `V12_OPUS_M2_REREVIEW.md` (D1–D9), `V12_OPUS_M2_GATE.md` (B1–B5, P1–P14) and the signed-off C1–C6, plus `V12_CODEX_M2_FINAL_FIX_REPORT.md`. No new concept direction. No code was modified.

Runtime I executed myself for this gate:
- `npm run check` — **19/19 tests**, plus structure/JSON/reference, money, label/INCI/claim/attribution/excerpt parity, price-literal, climate, logo, contrast and gzip gates. All pass.
- `shopify theme check` — **48 files, 0 offenses**.
- `npm run test:browser` — the full 80-cell matrix, re-run on my machine, 0 failures.
- Read-only Playwright probes of my own, at viewport geometries and text sizes the 80-cell matrix does **not** cover, written to `/tmp` and deleted afterwards. Nothing in the repo was changed.
- Visual inspection of the fold, full-page, back-face, short-laptop, landscape, measured-mode and Arabic captures in `test-results/screenshots/`.

---

## Verdict: **PASS WITH CONDITIONS**

D1 through D9 are genuinely fixed. I checked each one in the source and then again in the captures, and none of them was papered over. B1–B5 hold, C1–C6 are unregressed, and the page has materially improved: the fixture is now legible, the fold is now photographable, the product no longer collapses on short screens, the back face carries the complete approved sentence instead of a machine-split fragment, and the wordmark hierarchy is the right way up. Re-review item 8 — *with the turn disabled, is this still recognisably BETWEEN TWO SUNS?* — is now **yes at every viewport in the tested matrix**, including 1440×768 and 1366×640 where it was previously no.

The conditions are two new implementation defects, E1 and E2. Neither is a stylistic note and neither depends on C7–C9. They are the same failure family as D1: a composition that budgets **fixed pixel heights** against **content whose height depends on column width and text metrics**, with no production fallback when the budget is exceeded — only a development-mode assertion and a control that silently removes itself. D1 closed the *height* axis of that problem. The *width* axis and the *type-size* axis are still open, and the matrix does not look at either.

E1 is blocking before any founder-facing link, on the same standard D1 was held to.

I am explicitly **not** approving founder-readiness. C7 photography and pack measurements, C8 typography, C9 Arabic product copy and address, and a rendered Shopify preview remain hard external gates. Section 4 below converts those from "waiting on" into "create this".

---

## 1. D1–D9 verification

**D1 — stage floor and yielding composition · FIXED.** `assets/bts-face.css:6` is `clamp(200px, 100svh - 360px, 420px)`; the desktop shelf is `clamp(220px, 100svh - 600px, 360px)`; the band is `block-size: clamp(120px, 100svh - 620px, 280px)` with `.bts-home__brand img { block-size: 100% }`. The shortfall now comes out of the band, not the product, exactly as specified. In `home-en-1440x768-*-fold.png` the wordmark has yielded to roughly 178 px wide and all four packs stand at 220 px with every Turn over visible and all four buy rows above the fold — the capture that was a four-column text grid last pass. At 1366×640 the same holds at 614.8 px. At 667×375 landscape the product holds 200 px and commerce is correctly allowed below the fold. The 40 px sliver is gone and it was not bought by moving the buy row off-screen.

The shelf-only mobile budget of `clamp(200px, 100svh - 480px, 420px)` is a defensible refinement: it reconciles the larger D6 mobile mark with the 667 px commerce requirement without ever putting the product below 200 px. I accept it.

**D2 — short-viewport and landscape coverage · FIXED as specified, and still insufficient. See E1.** `tests/browser.mjs:59` now runs 375×667, 390×844, 430×932, 1440×900, 1440×768, 1366×640, 667×375, 375×620, 1366×620 and 1280×720 across two locales, two motion modes and two surfaces — 80 cells. The assertions are real, not decorative: `stage.height >= 200` on every cell, the conditional `height >= 620` commerce rule, `data-back-overflow === 'false'` and every Turn control visible in EN, `data-info-overflow === 'false'` on every shelf face including AR at 375, shared floor and shared baseline on desktop, band containment, and Home-mark-dominates-footer. Every cell I asked for is there and every assertion I asked for is there.

**D3 — legible, honest captures · FIXED.** The fixture is now a `#b9b9b4` silhouette captioned "Contract fixture only / SYNTHETIC", carrying no wordmark, so it can neither be mistaken for product nor disappear into the ground. Every main cell has a `fold` and a `full` capture with width *and* height in the filename. All four EN SKU backs are captured at 375×667 and 1440×900 and at the short desktop heights. `home-en-1440x900-synthetic-measured-fold.png` shows the proportion mechanic working — four different stage heights on one common floor — which is the first time that argument has been visible rather than asserted. 286 PNGs, verified.

**D4 — `cqw` padding counted once · FIXED.** Both the neutral `block-size` and the measured `--pf-unit` are now `(100cqw - 3 * var(--pf-gap)) / 4`. The dedicated wide synthetic test makes the width constraint bind, which is the only way this number could have been proved.

**D5 — the 136 px info block · FIXED.** `assets/bts-face.css:26` is scoped to `.pf[data-variant="shelf"]` only. `pdp-en-1440x900-no-preference-fold.png` shows the promise ending at y≈310 and the price at y≈370 — the ~180 px void is gone. The `observeShelfInfo` ResizeObserver in `assets/bts-face.js:53-67` covers all shelf faces including Arabic's plain `div`s and checks both scroll height and child bounds against the content floor. The assertion runs in every Home cell. The guard exists; what it does when it trips is E2.

**D6 — wordmark hierarchy · FIXED.** Home mobile is `min(200px, 52vw)`; the footer sign-off is `min(160px, 44vw)` with a further height-relative cap tied to the band so it cannot overtake the top mark when the band yields. I checked the arithmetic across the desktop, short-desktop, mobile and short-mobile branches and the Home mark is larger in every one; the suite asserts it per cell. There is now one large wordmark per page, at the top, which is what the standing direction on this brand asks for.

**D7 — no generated excerpt · FIXED, and fixed the right way.** `snippets/bts-product-back.liquid:11` renders the complete approved localized `back_description` through the existing approval gate. The `split: '.'` and the appended period are gone, so there is no rendered string that can diverge from the approved string and no way for `pH 5.5` or `SPF 50+` to be truncated by this path. A rendering regression compares all four complete shelf descriptions against the approved label strings. The payoff problem is closed too: `home-en-1366x640-no-preference-daily-defense-sunscreen-spf-50-back-fold.png` shows suitability, the full two-sentence description and three approved pills inside a 220 px face. No word of new copy was authored to achieve it.

**D8 — header glyphs · FIXED.** `sections/bts-header.liquid:3,15` render 24 px inline stroke SVGs on `currentColor`, `aria-hidden="true"` and `focusable="false"`, with the localized link `aria-label`s unchanged and the 44 px targets and 52 px header intact. The unrecognisable `⌕` fallback is gone from the captures.

**D9 — global Routine nav · FIXED via the option I offered.** `snippets/bts-routine-link.liquid` is `routes.root_url + '#bts-home-routine'` and `sections/bts-home.liquid:45` carries that stable anchor, so header, footer, menu and PDP now land on the art-directed strip. `snippets/bts-routine-url.liquid` still resolves the real Page or the native `/search?view=routine` alternate for the offer's own no-JS href, which is the fallback role I said to reserve it for. Global nav no longer points at `.bts-foundation`.

### B1–B5 and C1–C6 regression check · clean
Equal desktop tracks, shared floor and shared buy-row baseline within 1 px; four visible desktop commerce rows; AR renders the packshot with proper-name alt and no English product fallback (`home-ar-375x667-no-preference-fold.png`); no back sentence duplicates a front promise and all twelve ingredient `why` values remain null and unapproved; conditional initial-fold commerce; config-derived routine arithmetic that hides itself unless `list = Σ components` and `save = list − bundle`; server-rendered search; turn gating still `shelf`/`pdp` only; commerce outside `.pf__stage` and byte-identical across a turn; media fails closed on absent and stale labels; 52 px header; contrast, gzip, price-literal and climate gates pass. `pack_height_mm`, `pack_height_source`, `media_front` and `pack_crop_approved` are all still null and the shelf still runs `neutral`, which remains the correct refusal to estimate.

---

## 2. Remaining implementation defects

Two, both new, both found outside the matrix. These are Codex's to fix and neither depends on C7–C9.

### E1 — **Blocking.** The FRONT/BACK signature disappears on narrow desktop widths, at full zoom, with no viewport-height involvement

D1 was a height problem and it is closed. The identical failure survives along the **width** axis, because the back face's content height depends on how narrowly the text wraps in a 4-up grid, and the desktop cells in the matrix start at 1280 px — above the entire failure band.

Measured by me on the repo's own fixture at browser default text size, no zoom, no accessibility setting, with all four faces turned:

| viewport | Reset | Clarity | Barrier | Defense |
|---|---|---|---|---|
| 1024 × 768 | **overflows 42 px, Turn hidden** | fits | **overflows 23 px, Turn hidden** | **overflows 23 px, Turn hidden** |
| 1024 × 600 | **overflows 42 px, Turn hidden** | fits | **overflows 23 px, Turn hidden** | **overflows 23 px, Turn hidden** |
| 1100 × 768 | **overflows 23 px, Turn hidden** | fits | **overflows 23 px, Turn hidden** | fits |
| 1152 × 768 | **overflows 4 px, Turn hidden** | fits | **overflows 23 px, Turn hidden** | fits |
| 1200 × 768 | **overflows 4 px, Turn hidden** | fits | **overflows 4 px, Turn hidden** | fits |
| 1230 × 768 | fits | fits | **overflows 4 px, Turn hidden** | fits |
| 1280 × 768 | fits | fits | fits | fits |

The failure band is **desktop width 990–≈1255 px with viewport height below ≈860 px**, and it fails hardest at 1024 — a classic desktop resolution, the iPad landscape viewport, and a common Windows browser window that is not maximised. `assets/bts-face.js:29` responds by setting `parts.turn.hidden = true`, so on three of four packs the Turn over control is simply absent and the back face is unreachable. The page degrades to the four-card text grid, involuntarily, exactly as at 1366×640 last pass.

I captured the state at 1024×768 with the faces turned programmatically. The result is worse than a missing control: the approved label pills are **sliced through horizontally** — "Non-stripping" and "Soap-free" cut in half on Reset, Barrier's and Defense's pills cut off mid-row — because `.pf__back` is `overflow: hidden` with no fallback. A regulated claims surface that clips approved claim text mid-glyph is not acceptable at any viewport, whether or not the control that reaches it is hidden.

The commerce assertion passes at every one of these geometries, which is the same tell as last time: the suite is measuring the thing that was fixed rather than the thing that broke.

Why the matrix misses it: D2 added *short* viewports, all of them wide (1280, 1366, 1440). It added no desktop cell between 990 and 1280 px — the exact range where the tracks are narrowest, the copy wraps most and the cap is lowest.

**Fix.**
1. Add matrix cells at **1024×768**, **1024×600**, **1100×768** and **1152×864**, EN and AR, with the existing stage-floor, back-overflow, turn-visible, info-overflow and commerce assertions. All four fail today.
2. Close the defect itself rather than the assertion. The back face must not be a fixed-height box that clips approved copy. Either give `.pf__back` a minimum height derived from its own content at the narrowest supported track, and let the *stage* — and therefore the front photograph — take that height too so the floor and the turn geometry stay coherent; or drop to a two-column shelf below ~1200 px so the tracks never get narrow enough to force the wrap. I would take the two-column route: it preserves the pack scale, it keeps the shared floor within each row, and it reads as a deliberate composition rather than four squeezed columns. Do not solve it by shrinking body type below 14 px.
3. Whatever the layout answer, `.pf__back` must never clip an approved claim pill or sentence. If the content genuinely cannot fit, the correct failure is to render the face without the turn **and** without the clipped back in the DOM, not to leave a visually truncated claims panel one resize away from being shown.

### E2 — **Blocking for the accessibility claim.** At increased text size the product name overlaps the price, approved copy clips, and the turn vanishes on all four packs

The project asserts axe WCAG 2.2 AA across main, menu and bag. Axe does not test SC 1.4.4 *Resize Text*, which is a AA criterion and requires text to scale to **200 %** without loss of content or functionality. The composition fails it well before 200 %.

Measured by me, Home, all four faces, root font-size scaled:

| viewport | 125 % | 150 % | 200 % |
|---|---|---|---|
| 1440 × 900 | info overflows 21 px | 3 of 4 Turns hidden; info overflows 49 px; commerce leaves the fold | **4 of 4 Turns hidden; backs clip up to 301 px; info overflows 162 px** |
| 390 × 844 | — | info overflows 35 px; commerce leaves the fold | **4 of 4 Turns hidden; backs clip up to 237 px; info overflows 133 px** |
| 375 × 667 | 3 of 4 Turns hidden; commerce leaves the fold | — | — |
| 1366 × 640 | 3 of 4 Turns hidden; info overflows 21 px | — | — |

The 200 % capture is unambiguous: "Daily Reset Cleanser" runs straight through "EGP 399" and the Add to bag button on all four cards, because `.pf[data-variant="shelf"] .pf__info { block-size: 136px }` has no overflow behaviour — the name simply escapes the box and lands on the commerce row. This is the exact hazard I raised at D5 ("a name and promise that exceed 136 px will overlap the buy row rather than push it"). Codex added the ResizeObserver and the test assertion I asked for, which correctly *detect* it, but detection is gated behind `?bts_debug=1` and nothing changes in production. The guard reports the fire; it does not put it out.

This is not an edge case for this market. Increased system text size is common on Android in Egypt, and 125 % display scaling is the Windows default on many 1080p laptops — which also lands inside E1's width band once the window is not maximised.

**Fix.**
1. Give `.pf__info` a production behaviour when it exceeds its budget: `min-block-size: 136px` rather than `block-size`, so the box grows and pushes the buy row down instead of the name overlapping it. The shared desktop baseline is worth protecting, but not at the cost of overlapping text; where the budget is exceeded, let the row grow and let the baseline assertion apply only while every card is within budget.
2. Make the fixed budgets relative to type, not to pixels — express the info budget and the back padding in `rem`/`em` so they scale with the user's text size instead of against it.
3. Add two matrix cells at 200 % root font-size (1440×900 and 390×844, EN and AR) asserting no overlap between `.pf__info` children and `.pf__buy`, no back clipping, and the Turn control present. Until those pass, the WCAG 2.2 AA claim in the reports should be stated as "axe automated checks, AA tags" rather than as AA conformance.

### Craft notes — not defects, not blocking, record only
- Clarity's back is still the thinnest face by a wide margin: two sentences, no suitability line, no pills, and roughly 170 px of empty colour field below the text at 1440×900. That is truthful and I would not change it in code. It is a content question (§4).
- On the PDP the "Routine" link sits alone and unstyled beneath the centred stage, left-aligned to the page gutter. It reads as a stray rather than a considered step.
- In phone landscape the mobile shelf still allocates a ~420 px-wide card to a 200 px-tall pack, leaving a lot of dead horizontal field per card and showing barely one product. Acceptable for a minority orientation; worth revisiting after C7 when the real silhouette will show how bad it looks.
- At exactly 640 px viewport height the band's bottom margin yields to zero and the wordmark sits directly on the shelf. It does not overlap, but it is tight.

---

## 3. What can and cannot be approved on synthetic fixtures

Unchanged from the re-review, and I restate it because the fixture is now legible enough to be mistaken for evidence that it is not.

**Approved now:** claim provenance and ingredient attribution; the excerpt-free full-description contract; the money contract; fail-closed media on absent and stale labels; turn gating by surface; commerce immobility across a turn; `aria-pressed`/`inert`/focus-return; reduced-motion crossfade; RTL non-mirroring; AR image presence and proper-name alt; buy-row position, shared baseline and shared floor at the tested geometries; the measured-scale *algorithm*; routine offer arithmetic and its fail-closed hiding; server-rendered search; no-JS degradation; axe automated checks; gzip budgets; theme-check.

**Not approvable until C7/C8/C9 and a rendered preview:** whether the four packs read as one family at true relative scale; whether crop, floor and contact shadow read as photography rather than as cards; whether the turn is beautiful rather than merely correct; whether the back's colour fields hold against a real packshot; every type judgement, including every measurement in E1 and E2, which will change the moment real font metrics land; the entire Arabic product experience; LCP, CLS and real performance — the current Lighthouse 100s are an SVG rectangle and must not be quoted as release evidence; and the desktop PDP composition, still deferred to C7 as agreed at P13.

---

## 4. Production-creation brief

C7, C8 and C9 are not things to wait for. They are things to make. Below is what the team must now create, in the form the contract already expects, so that the day the assets exist they drop into null fields and nothing has to be re-engineered.

**Governing rules for everything in this section.** Every word that reaches a customer must trace to `opus-brand-pack/FINAL_LABEL_SOURCE_OF_TRUTH.md` or to the founder's explicit written approval. Do not write a new efficacy claim, a new benefit, a new timeframe, a new percentage, a new "clinically proven", or a new ingredient-to-benefit link. The build already refuses unapproved content and `scripts/check-label-parity.mjs` already rejects an ingredient `why` that is not an exact ≤80-character excerpt of a label sentence naming that ingredient — treat that as the standard for all new copy, not as a hurdle to route around. If a line cannot be sourced, it stays null and the surface stays smaller. A thinner true page beats a fuller invented one.

### 4.1 Photography — C7

**Create: four H1 packshots, one per SKU.** These are the LCP image, the front of the turn, and the entire basis of the shelf composition. Nothing renders without them — `can_turn && image != blank` is false today, so the FRONT/BACK signature has never run in the real theme.

- One pack per frame, shot as a family in a single setup: same camera height, same lens, same lighting, same distance, same day. The four must be interchangeable in a row.
- Crop tight to the pack silhouette on all four sides, with the pack's contact point at the **bottom edge of the frame**. The shelf floors all four stages on that edge, and `--pf-unit` derives relative scale from image height × `pack_height_mm`. Padding inside the crop silently falsifies the scale, which is why `pack_crop_approved` exists as a separate boolean.
- Transparent or `#f7f7f5` ground, no cast shadow baked into a padded area. A contact shadow that sits within the silhouette extents is fine and desirable.
- Deliver at ≥1600 px on the long edge; the theme requests `widths: '240…1600'`.
- Shoot the four label backs as P1_BACK at the same time. They are not wired into M2, but the studio day is the cheap moment.
- Artwork currency: shoot the packs whose artwork matches `inci_version: FINAL-v5`. Barrier and Defense carry `50 gm` on current artwork — the site must keep saying `50 gm`, not `50 g` or `50 ml`.

Seed per SKU: `media_front.file`, `role: 'H1'`, `label_version: 'FINAL-v5'`, `approved: true`, `pack_crop_approved: true`, and `alt` as `{en: <approved text or null>, ar: <approved text or null>, approved: {...}}`. Leave `alt` null rather than describing the product — the contract already falls back to the Latin proper name, which is correct and safe.

**Do not** retouch the label into legibility, recolour a pack to match a swatch token, or substitute a render. The one permitted interim render (`bts-barrier-interim.webp`, hash-pinned in `data/media-safety.json`) must stay unwired.

### 4.2 Pack measurements — C7

**Create: four sourced pack heights, in whole millimetres, from the dieline or the physical pack.**

- Measure the finished pack as a customer sees it standing: cap on, from the contact surface to the highest point.
- Whole integers only — the build rejects non-integers, and `scripts/check-v12.mjs` refuses the whole measured mode unless all four are present, sourced and paired with an approved crop.
- Record provenance in `pack_height_source` naming the actual artefact ("Moisturizer dieline, Between Two Suns — FINAL — Moisturizer Artwork.pdf, carton height") — not "estimated", not "from render", not "approx".
- All four or none. A partial set keeps the shelf in `neutral`, which is the correct behaviour and must not be worked around.

This is the one input that turns the proportion mechanic from a verified algorithm into a verified truth. Until it lands, no one may say the shelf shows the packs at true relative scale.

### 4.3 Typography — C8

**Create: a licensed, self-hosted type system.** `data/fonts.md` is right that the current Arial fallbacks are scaffolding, not a decision.

- Choose and licence a **display** face, a **UI/text** face, and an **Arabic display + UI** pair, with a web licence covering the storefront's traffic. The tall condensed wordmark stays the supplied exact SVG in every case — the display face has to sit beside it without competing with it.
- Subset to the glyphs actually used, per locale; supply flat WOFF2 in `assets`; `font-display: swap`; preload at most two per locale.
- Measure real ascent/descent/x-height before touching `size-adjust` or `ascent-override`, and only then set them.
- **Then re-run every composition measurement in this document.** E1 and E2 were measured in Arial and Arial Narrow. Real metrics will move every wrap point in the back face and every line count in the 136 px info budget, in both directions. The 200 px stage floor, the `--pf-cap` formulas, the info budget and the back overflow guard all need re-derivation against the real faces, at the E1 widths and the E2 text sizes, before anyone calls the fit solved.
- The Arabic pair is not optional and not a fallback: it carries the entire Arabic storefront, and Arabic line height and glyph height differ enough from Latin that the shared 136 px and 200 px budgets must be re-checked in AR specifically.

### 4.4 Arabic — C9

The ten chrome strings in `locales/ar.json` are authored in neutral interface nouns and are good. The product layer is entirely null, correctly, and the Arabic storefront currently shows a Latin name, a size, a price and an Add button. That is honest and it is not shippable.

**First, the founder makes one decision that gates everything else: the address.** Feminine, neutral, or plural-polite. Everything below is written to it, and it cannot be retrofitted cheaply. My recommendation is the neutral interface register the chrome already uses, extended to product copy — it is the one choice that does not have to be revisited if the audience widens, and it matches how the brand reads in English.

**Then create, per SKU, translated from the approved English in `FINAL_LABEL_SOURCE_OF_TRUTH.md` and nothing else:**

- `role` — one word: Cleanse / Treat / Moisturize / Protect.
- `promise` — the front-label sentence, translated. Reset: "Removes oil. Maintains hydration. Feels fresh." Clarity: "Controls oil. Evens skin tone. Hydrates." Barrier: "Strengthens skin barrier. Controls oil. Lightweight." Defense: "Invisible. Lightweight. Fast-absorbing."
- `suitability` — Reset and Barrier: "For Oily to Combination Skin". Defense: "For All Skin Types". **Clarity has none** — see below.
- `back_description` — the full approved paragraph, translated complete. It renders whole now; there is no excerpt to maintain.
- Claim pills — translated one-for-one from the label pills. No pill that is not on the artwork.

**Translation rules.** Translate meaning, not marketing: an Arabic sentence must claim exactly what the English label claims, no more. Do not intensify ("يزيل تمامًا" for "removes"). Do not add a timeframe, a percentage, or a dermatological register the label does not carry. Keep **ingredient names and INCI in Latin script** — the build already isolates them with `<bdi lang="en">` and the INCI block stays `lang="en" dir="ltr"`. Keep product names in Latin. Route every string through a native Egyptian-Arabic reviewer *and* whoever signs off regulatory claims; mark `approved.ar: true` only after both. Leave any field that does not clear both null — the build will hide it, which is the right outcome.

Once `back_description.ar` is approved, the Arabic turn switches on automatically and the Arabic back face appears for the first time. Re-review the AR composition at that point; it has never been seen with content in it.

### 4.5 Content decisions for the founder

- **Clarity's suitability line.** Clarity is the only SKU with no `suitability` and no claim pills, which is why its back face is two sentences and a lot of empty colour. Confirm whether the Clarity artwork genuinely carries no suitability statement. If it does carry one, seed it from the artwork. If it does not, leave it null — do not write one to balance the composition.
- **Four `feels_like` texture lines, one per SKU.** Still unauthored, correctly. These are the single highest-value piece of new copy available: they are texture, not efficacy, so they carry no regulatory load, and they are exactly the "desire, product, texture and results" register the brand is meant to lead with. Write them from the actual formulas — how it applies, how it absorbs, what it leaves — and have the founder approve them. Nothing about performance, nothing about results.
- **The "The Back" heading** on the PDP is an engineering label doing brand work. Replace it with a founder-approved line.
- **The four `key_ingredients[].why` values** stay null unless the founder can supply wording that survives the attribution rule: an exact ≤80-character excerpt of a label sentence that names that specific ingredient. "Niacinamide → lightweight" did not survive it and must not come back.

### 4.6 Preview

A rendered Shopify preview in EN and AR remains the last gate before anything is shown outside the team. Everything measured in this document — mine and Codex's — is LiquidJS with stand-ins. `content_for_header`, real `routes.*`, real image CDN transforms, real metaobject resolution and real locale routing have never executed. Re-measure E1's width band and E2's text sizes in that preview before treating either as closed.

---

## 5. Conditions on this gate

1. **E1 closed** — no approved claim pill or sentence is ever clipped, and the Turn control is present on all four packs across the full 990–1280 px desktop width range at heights from 600 px up, asserted at 1024×768, 1024×600, 1100×768 and 1152×864 in both locales.
2. **E2 closed** — `.pf__info` grows rather than overlapping the buy row, budgets are expressed in type-relative units, and 200 % text-resize cells pass in both locales. Until then, report the accessibility result as automated axe checks, not as WCAG 2.2 AA conformance.
3. D1–D9 stay closed, C1–C6 and B1–B5 stay unregressed.
4. C7 photography and sourced pack measurements created and seeded, shelf running in `measured`, and the real answer to B1's proportion question measured for the first time.
5. C8 typography licensed and self-hosted — **and every fit budget in this document re-derived against the real metrics**, at E1's widths and E2's text sizes, in both scripts.
6. C9 address decision taken and Arabic product fields approved, with the Arabic back face reviewed once it has content in it.
7. A rendered Shopify preview in EN and AR, re-measured at all of the above.
8. With the turn disabled, the Home page is still recognisably BETWEEN TWO SUNS at every viewport — which is now true across the tested matrix and is what E1 puts back at risk between 990 and 1255 px.

---

**Gate result: PASS WITH CONDITIONS.** D1–D9 are genuinely repaired; B1–B5 and C1–C6 stand; the substrate is unregressed and is the best work on this project. E1 must be fixed before any founder-facing link. E2 must be fixed before the accessibility claim is repeated. C7, C8, C9 and a rendered Shopify preview are now creation tasks with owners and specifications, not dependencies to wait on, and none of them may be closed by inventing a claim the label does not make.
