# BETWEEN TWO SUNS — V12 M2 engineering fix report

2026-09-30 · M2 gate follow-up · local working tree only

## Scope and verdict

C1–C6 and the engineering substrate signed off in `V12_OPUS_M2_GATE.md` have been retained. This pass repairs B1–B5 and the engineering polish. It does **not** declare M2 founder-ready or claim that synthetic fixtures prove photography, physical product proportions, fonts, or Shopify rendering.

No Shopify Admin calls, uploads, publishing, product status changes, commits, or pushes were made. Products remain draft; the runtime remains locked to prototype, with noindex, one server-rendered prototype marker, and no enabled checkout. Existing scenario prices are unchanged and remain config-only. No photography, measurements, reviews, service promises, licensed fonts, Arabic product copy, or founder address decision were invented.

## Exact fixes

### B1 — shelf architecture and desktop commerce

- Extended `data/content/product-contract.json` with nullable `pack_height_mm` (`number_integer`) and `pack_height_source`. All four product seeds explicitly contain **null** for both: the repository supplies no exact dieline heights. The offline seed planner omits null scalar fields; it still makes zero Admin calls.
- Home validates the complete four-product measurement set, positive integer heights with sources, valid image ratios, approved current-label H1 files, and `bts_media.pack_crop_approved`. Crop approval means the photograph matches the pack silhouette extents and floor; padded crops cannot quietly substitute for physical dimensions. This approval is not seeded.
- The measured desktop shelf exposes one `--pf-unit` in px/mm. Every stage receives its product's `--pf-mm`; block size is `calc(var(--pf-unit) * var(--pf-mm))`, and width follows the approved image ratio. The common unit is constrained by the tallest pack and widest pack (`height_mm × aspect_ratio`), so individual tracks cannot independently rescale packs.
- Incomplete/invalid measurement sets use `data-pack-scale="neutral"`: equal tracks and capped presentation geometry, with no estimated physical dimensions or claim of real relative scale. There is no partial measured/estimated mixture.
- Replaced unequal fractions and whole-card stagger margins with four equal tracks. Packs align to one floor; the stage slot and 136 px info block place commerce on one shared baseline. The desktop stage cap is `min(360px, 100svh - 600px)` to leave room for the actual brand band and buy rows at 1440×900.
- Built a 280 px-tall approved SVG wordmark moment inline-start (approximately the requested 300 px), with the approved English “fresh skin. always.” phrase and config-sourced routine price/saving/Add all four inline-end. No Arabic translation of the brand phrase was fabricated.
- Renamed `sections/bts-foundation-home.liquid` to `sections/bts-home.liquid`; updated index and fixture references.

### B2 — Arabic H1 rendering

- Split image approval from alt approval in `snippets/bts-media.liquid`. File approval, role, image type, and current label version remain required. Alt uses approved locale text, otherwise the product's Latin proper name. It never borrows an English descriptive alt sentence; if neither safe alt source exists, nothing renders.
- Arabic Home/PDP use the same ratio-preserving stage for approved packshots. Unapproved Arabic back descriptions do not enable a turn, and English product promises/claims never fall through into Arabic.
- Blank, zero, or negative front-image ratios suppress the stage/media instead of creating a collapsed LCP frame. CSS also has a ratio fallback.
- Updated browser/SSR assertions to require AR imagery, proper-name alt and absence of unapproved turns; retained RTL non-mirroring assertions.

### B3 — meaningful, approved back and attribution checks

- Removed `does`, duplicated front promise, feel, and routine-use scaffolding from the finite back. It now leads with approved suitability, the **verbatim first sentence** of the approved back description, approved label pills, and the full-INCI control. The unfolded PDP carries the full approved label description and INCI.
- Nullified all twelve ingredient `why` values, with locale approvals false and `attribution_approved: false`. The current approved source names ingredients together, then describes the formula; it does not contain explicit ingredient-specific efficacy sentences. This includes Clarity rather than preserving plausible but unsubstantiated attributions.
- Nullified `feels_like` and duplicate `formula_logic` on all four products, with approvals false. No replacement textures or longer formula explanations were authored. Empty ingredient blocks and pill rows are hidden.
- Extended parity validation: a non-null `why` must be approved, be an exact source excerpt within the length limit, and appear in a label sentence naming that ingredient, or carry explicit `attribution_approved: true`. Regression tests reject a genuine formula sentence attached to a single ingredient and exercise the explicit-approval path. Existing per-SKU INCI, ingredient identity, alias, claim pill and null-AR/media checks remain.
- Barrier and Defense now render exact artwork `50 gm` in `size_display`, `size_label`, and the size unit. No silent normalization or source-document deviation was introduced.

### B4 — mobile fit and marker

- Shelf/PDP stage height is capped at `min(420px, 100svh - 360px)`; width follows ratio and stays centered. The 136 px info budget stabilizes price/Add positions across SKUs and locales.
- Moved the sole prototype marker outside the sticky header wrapper and made it static. The header remains 52 px; the marker remains server-rendered, visible on first arrival, and present on founder/no-JS URLs.
- Restored a restrained 64 px-wide approved SVG wordmark on mobile Home.
- Browser assertions require every shelf buy row and the primary PDP row to end inside the initial viewport at 375×667, 390×844, 430×932 and 1440×900, in EN/AR and both motion modes. Separate 2:3 crop checks exercise the clamp.

### B5 — real routine and search surfaces

- Added `page.json`, `page.routine.json`, `search.json`, `search.routine.json` and their sections. A generic Page now has a renderer; routine Pages can use the dedicated template when content is later set up.
- Routine links use an existing routine Page when available, otherwise the native `/search?view=routine` alternate template route. This avoids inventing a `/pages/routine` resource under the no-Admin constraint. Header, footer, menu and PDP links use this helper.
- Home routine strip renders independently of Page existence. It opens a shared native routine sheet with approved component identities and **one** bundle Add; its href remains a real route for no-JS use. The desktop band also has a direct Add all four.
- Offer amounts come only from the existing prototype config. Rendering requires four known components with positive prices, a positive bundle price/currency, and exact `list = sum(component prices)` and `save = list - bundle price`. Missing/invalid config hides the offer and saving. No literal storefront prices or invented savings were added.
- The real prototype search form posts `q` to `routes.search_url`; Liquid filters approved product proper names server-side, so draft products need no publication and no-JS search works. No Arabic search keywords, ingredient education, claims, or service content were synthesized. Unknown terms show the localized no-results UI.
- The shared bag now displays the adapter's existing config-derived `routineSaving` only when positive and a routine line is present. Existing bundle cart behavior and swap regression tests remain intact.

### Remaining polish

- **P1/P2:** back overflow is hidden, body type is 14 px and pills 12 px. ResizeObserver records `data-back-overflow`, emits a development assertion with `?bts_debug=1`, and suppresses new turns when the front geometry cannot fit the back. It does not reset an already chosen side; the turn-back control stays available. The PDP retains unfolded proof. The browser suite still fails on overflow in review geometries. Inert faces have an explicit pointer-events guard, verified through the INCI click flow.
- **P3:** deleted the synthetic stage contact-shadow pseudo-element and its animation. A real pack contact shadow belongs in approved photography.
- **P4/P5:** invalid-ratio suppression/fallback and fixed info blocks implemented as described above.
- **P6:** shelf Add updates the common bag/count, announces the product and “Added ✓”, and restores the button label after 1.2 seconds without opening a drawer. PDP and routine Add retain the shared drawer flow.
- **P7:** removed the shelf IntersectionObserver/600 ms viewport-exit reset. A selected back remains selected when the customer scrolls away and returns; the browser suite asserts persistence.
- **P8/P9:** mobile wordmark restored; misleading `bts_mode` and `bts_launch_confirmed` settings removed. The quantity setting remains. Existing locked prototype and dormant launch adapter contracts were preserved.
- **P10:** deliberately retained the no-JS front-only signature. Prototype buying remains disabled without JS; unfolded PDP proof and INCI remain accessible. No essential product/commerce information depends on turning.
- **P11/P12/P13/P14:** exact `50 gm`, null formula logic, flagship rename, and mobile-only sticky Add completed. Both CSS and JS gate sticky Add below 990 px and react to breakpoint changes. Further desktop photography composition belongs to C7, not an invented H1 set.
- Added the ten missing Arabic chrome strings using neutral interface nouns/action labels, plus neutral routine/search/confirmation UI. No new feminine/masculine address choice or Arabic product translation was introduced.

## Validation and artifacts

- `npm run check`: **17/17 tests pass**, plus structure/JSON/reference, localized money, label/INCI/claim/attribution, price-literal, climate-copy, logo identity, contrast and gzip gates. Captured in `test-results/check-output.txt`.
- `npm run theme-check`: **48 files, zero offenses**. Captured in `test-results/theme-check-output.txt`.
- Shopify Liquid skill validator: **33 changed theme files pass**; `test-results/skill-validation.json`. The bundled helper initially lacked its installed checker dependencies; the same unmodified helper was run with dependencies in a temporary directory. Repository package files were not changed for this workaround.
- `npm run test:browser`: **44/44 checks pass, zero failures**, system Chrome 154.0.8037.58. Includes 32 Home/PDP viewport/locale/motion cells, axe WCAG 2.2 AA checks on the main page and bag, four absent/stale-media cells, two routine/search/adverse-crop flows, physical-scale/floor/state-persistence/desktop-sticky checks, mobile sticky flow and four no-JS cells. Exact geometry and results are in `test-results/browser-report.json` and `browser-output.txt`.
- **24 captured screenshots** include Home/PDP at **375/390/430/1440 × EN/AR**, plus EN back captures, in `test-results/screenshots/`. They use the explicitly synthetic contract image and are not H1 visual approval. The report stores the exact screenshot list.
- Lighthouse: completed local Home EN, PDP EN and Home AR runs. Scope is explicitly **LOCAL FIXTURE WITHOUT H1 MEDIA/SHOPIFY SCRIPTS/FONTS**; these are smoke results, not release performance proof. All three latest runs report performance/accessibility/best-practices 100, SEO 61, CLS 0 and TBT 0; SEO reflects the deliberately noindexed prototype and absent release metadata. Exact LCP values and full reports are in `test-results/lighthouse-summary.json` and `lighthouse-*.json`.
- `git diff --check`: clean. Artifacts are local and ignored by Git/theme upload rules.

### Final fixture geometry

All four desktop buy rows share the same top and bottom within each locale. Mobile figures below apply to every shelf item; only the current item is horizontally in view.

| Home viewport | Locale | Buy-row top | Buy-row bottom | Within initial viewport |
|---|---|---:|---:|---|
| 375×667 | EN | 601.17 px | 653.17 px | Yes |
| 375×667 | AR | 604.42 px | 656.42 px | Yes |
| 390×844 | EN | 699.25 px | 751.25 px | Yes |
| 390×844 | AR | 702.50 px | 754.50 px | Yes |
| 1440×900 | EN | 826.84 px | 878.84 px | Yes |
| 1440×900 | AR | 830.09 px | 882.09 px | Yes |

Synthetic measured-mode test: one shared unit approximately **1.42857 px/mm**, tallest test stage 300 px, and all four stage floors at **690.84 px**. This verifies the algorithm only; it is not a measurement of any BETWEEN TWO SUNS pack. No real measured-mode screenshot or physical-scale signoff is claimed.

## Only remaining release dependencies

1. **C7 — approved H1 production assets:** all four seeded H1 references remain null. Exact sourced dieline pack heights and crop extent/floor approval are also absent; they stay null/unapproved. True physical proportion and actual-photography crop/back fit cannot be signed off until these production inputs land. Synthetic test heights exist only inside the fixture and never enter content seeds.
2. **C8 — licensed typography:** display/UI/Arabic files and licensing decisions are still unavailable. No substitute font assets, license claims, or `@font-face` inventions were added.
3. **C9 — founder Arabic address and approved product copy:** the neutral chrome is usable, but the address decision and human-approved Arabic product fields remain open. Those fields stay null and the Arabic back stays unavailable rather than showing English claims.
4. **Rendered Shopify preview in EN and AR:** this pass has no rendered Shopify preview and makes no claim otherwise. Storefront-readable content/config records and preview resources must exist in the authorized unpublished environment, followed by real route/localization/media/font and viewport checks. Local LiquidJS, axe, screenshots and Lighthouse do not substitute for that rendering. No Admin changes or theme uploads were made to obtain it.

No additional founder asset, pricing, review, or service decisions were manufactured as prerequisites for this engineering pass.
