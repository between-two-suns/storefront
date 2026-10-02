# BETWEEN TWO SUNS V12 — Visible storefront build report

Date: 2026-09-30. Local theme and local browser execution only. **The user-authorized no-H1 editorial fallback is built and reviewable. The named creative-pass input was never received, so implementation against that document cannot be claimed.** No Admin call, upload, publish, push, commit or external message occurred. The substantial pre-existing worktree changes were retained.

The first action was a periodic wait for `opus-brand-pack/V12_VISIBLE_STOREFRONT_CREATIVE_PASS.md`, beginning at 08:52:38 UTC. The final wait check was at approximately 09:07:50 UTC, after 912 seconds. The file was absent throughout the requested 15-minute window and remained absent at final verification. A clarification was requested while independent work continued; no alternate path or supplied brief arrived. No substitute creative-pass document was invented.

The implemented scope follows the user's explicit instructions to improve founder-visible Home/PDP/mobile, use safe existing assets, create an intentional editorial/product-color composition when final H1s are missing, preserve signed-off behavior, and keep commerce/Arabic/content gates intact. A later delivery of the named brief still requires a delta review against this result.

**Governing material read:** latest `V12_OPUS_M2_FINAL_GATE.md`, `V12_CODEX_E1_E2_REPORT.md`, `V12_PRODUCTION_LAYER_REPORT.md`, production integration material, prior review conditions, `FINAL_LABEL_SOURCE_OF_TRUTH.md`, `PRICING_SOURCE_OF_TRUTH.md`, `BRAND_MANIFEST.md`, `ARABIC_RTL_BRIEF.md`, H1 physical-finish addendum, content/media contracts, production asset/font evidence and existing implementation/tests. Latest FINAL-v5 and production gates take precedence over historical renders and claims.

**Review it locally.** The server is running at [http://127.0.0.1:8787](http://127.0.0.1:8787); Arabic is [http://127.0.0.1:8787/ar](http://127.0.0.1:8787/ar). Restart with `npm run preview:local` if necessary. The preview renders the actual Liquid/theme assets with local Shopify-drop stand-ins and sourced local content. It is not an uploaded Shopify preview: public-read metaobjects, Shopify CDN transforms, Markets routing, platform scripts and actual devices remain unverified. Product photography and synthetic geometry imagery are absent from this review preview. The visible prototype marker, disabled live checkout and config-derived prices remain intact.

## Visible changes

- **Home:** exact supplied wordmark and existing “fresh skin. always.” line; a deliberate four-part type/color composition on the off-white site ground; named product panels, step numbers, exact label promises, sizes, prices and direct Add actions. The flat color fields depict no bottle, pump, label layout, texture or package proportions. The existing provisional screen swatches remain provisional. When approved H1s exist, the approved-media shelf/turn branch retains its original composition logic.
- **Mobile shelf:** partial next-product visibility, native snap scrolling, numbered product anchors and enhanced Previous/Next controls with localized names and current-product state. RTL changes directional arrows and reading order while logos/product identity stay unmirrored. Controls are hidden without JavaScript; ordinary anchors and PDP links remain usable. Reduced motion uses immediate navigation.
- **Routine:** an ordered four-step overview and established AM 01–04 / PM 01–03 usage architecture, with product destinations and the existing verified, config-derived offer/sheet. This module requires all four singles. No new use instruction, saving calculation, discount, efficacy or operational reassurance was invented.
- **PDP:** collection breadcrumb, large editorial product-name/color field, stronger product identity hierarchy, existing approved English front-label actives, price/Add grouped together, and a considered routine row. Formula copy remains complete and exact; “In this formula” reuses an existing UI translation. Full INCI is a native disclosure with complete, escaped, Latin/LTR text; an INCI hash opens it when JavaScript is available, and the summary remains usable without JavaScript. Review emptiness and the real-only feed gate are unchanged.
- **Commerce interaction:** sticky Add is styled consistently, wraps at enlarged text size, and still hides for sheets, the footer, the keyboard, unavailable commerce and desktop. A newly exposed jump-scroll defect was fixed: observing only the buy row could miss a jump from below the viewport to above it. The observer now also watches the product article, and visibility reads current bounds. The cart adapter, quantities, money, analytics/turn behavior and launch lock remain unchanged.
- **Navigation:** Search is explicitly available in the menu. Product URLs prefer existing preview Pages and otherwise use the new theme-native `/search?view=product&q=<handle>` route, via localized `routes.search_url`. `search.product.json` renders the shared product section; unknown handles reveal no product. This needs no new Page and no draft-product publication. The collection destination has a clearer grid and existing product-color accents.

New UI copy is limited to neutral Previous/Next product labels. Approved product copy/data was not rewritten. Arabic product role/promise/description/claims remain null/unapproved and hidden; English product marketing does not fall back into Arabic. Branded Latin names, numbers, approved sizes and INCI remain isolated. The preview's native locale form was exercised in both directions while retaining the PDP query/destination. Arabic content approval remains open.

## Safety and preservation

No product raster, reconstructed packaging, pseudo-bottle SVG, geometry photo, AI image, fake review, star rating, testing claim, shipping/payment policy or unsupported ingredient-to-benefit claim was added. The hash-pinned Barrier interim stays unwired. H1/back/swatch/application/campaign modules continue to require approved current-label media. The new editorial composition is a separate text/CSS presentation, never a `pf__stage`, media approval or turn host. Missing content/config still fails closed.

`test-results/v12-visible/preservation-report.json` confirms **11/11 pre-task snapshots remain byte-identical**: `bts-face.css`, `bts-face.js`, `bts-home.css`, `bts-core.js`, original `tests/browser.mjs` and `tests/content.test.mjs`, and all five product JSON files. E1's two-column 990–1279 px shelf and four-column wider shelf, intrinsic back sizing, shared floors/baselines, E2's growing type-relative info budgets and measured-scale/source/crop gates were retained. Exact identity SVGs, label/INCI/pill/attribution parity, scenario prices, translation approvals and media nulls pass existing checks.

## Executed validation

| Check | Result and evidence |
|---|---|
| `npm run check` | **26/26 passed**; structure/schema/reference checks, label/INCI/claim/ingredient parity, prices, climate budget, exact logos, contrast/gzip, original cart/content/production tests, and native product-route/unknown-handle tests. `test-results/v12-visible/core-check.log`. |
| `npm run theme-check` | **53 files, zero offenses**. `test-results/v12-visible/theme-check.log`. |
| Original browser matrix | **128/128 cells passed** in EN/AR, normal/reduced motion, original mobile/desktop/intermediate widths, and 200% text. `e1-e2-primary-report.json`. |
| Original supplemental checks | **17/17 passed in final follow-up**; the targeted existing matrix cell also passed (**18/18** run). Includes 1,746 continuous E1 width geometries, measured/source/crop mechanics, RTL information growth, sticky cart/sheet/footer/focus and no-JS checks. `e1-e2-followup-report.json`; combined **145 distinct passing checks** in `e1-e2-combined-report.json`. |
| `npm run test:visible-storefront` | **82/82 passed**, zero failures. Actual no-photo Home and all four PDPs, EN/AR, 375×667, 390×844, 1024×600, 1440×900, normal/200% text; scoped main axe scans, overflow/commerce containment, shelf navigation, INCI, prototype cart/sheets, sticky eligibility/footer suppression and no-JS native product routing. **440 captures**. `test-results/v12-visible/browser-report.json`. |
| `npm run test:production-browser` | **16/16 passed**; authentic-review empty/internal-fixture contracts at normal/200% text in EN/AR. `production-browser.log`. Internal review fixtures remain excluded from production and the founder preview. |
| Running localhost preview | **4/4 navigation flows passed**: EN/AR × mobile/desktop Home → native PDP → locale form retaining the PDP. Eight key screenshots; `preview-route-report.json`. |
| Performance smoke | Three local Lighthouse diagnostics completed for Home EN/AR and PDP EN. `performance.log` and `test-results/lighthouse-summary.json`. These omit final media/fonts and Shopify scripts and are not release-performance evidence. |
| Offline handoff | H1 and seed dry runs: **0 Admin calls / uploads / content writes**, no H1 ready, no real-review seed invented. `h1-status.json` and `seed-plan.json`. |
| Syntax / whitespace | New/changed JS syntax checks and `git diff --check` passed. |

The initial supplemental run found a new routine list item sharing `.pf`, which made a protected selector expect a nonexistent pack stage. The routine now has its own class/color rules; all supplemental checks were rerun successfully without editing the original tests. Enlarged-text overflow and sticky jump cases found during development were corrected and the complete final no-photo matrix rerun successfully.

The Shopify Liquid skill's search helper was used. Its `validate.mjs` was attempted and failed to load the missing `@shopify/theme-check-common` dependency, matching the prior documented environment limitation. That helper failure is not counted as a pass; the installed Shopify CLI provided successful full Theme Check validation. No dependency or lockfile change was used to hide it.

These are local Chrome/LiquidJS and automated axe/text-containment checks, not a WCAG conformance certificate or rendered Shopify/device approval. Existing synthetic-media captures are geometry regression evidence only; the dedicated visible captures and running founder preview contain no synthetic product imagery.

## Key screenshots

| State | Capture |
|---|---|
| Home EN mobile, 375×667 | [Home mobile](../test-results/v12-visible/preview-home-en-mobile.png) |
| PDP EN mobile, 375×667 | [PDP mobile](../test-results/v12-visible/preview-pdp-en-mobile.png) |
| Home EN desktop, 1440×900 | [Home desktop](../test-results/v12-visible/preview-home-en-desktop.png) |
| PDP EN desktop, 1440×900 | [PDP desktop](../test-results/v12-visible/preview-pdp-en-desktop.png) |
| Home AR mobile | [Arabic Home mobile](../test-results/v12-visible/preview-home-ar-mobile.png) |
| PDP AR mobile | [Arabic PDP mobile](../test-results/v12-visible/preview-pdp-ar-mobile.png) |
| Home AR desktop | [Arabic Home desktop](../test-results/v12-visible/preview-home-ar-desktop.png) |
| PDP AR desktop | [Arabic PDP desktop](../test-results/v12-visible/preview-pdp-ar-desktop.png) |

The same directory contains full-page, remaining-SKU, enlarged-text, Defense shelf, INCI, sticky Add, bag, menu and routine captures, indexed by the final browser report. Screenshots are local artifacts in ignored `test-results/`, excluded from Shopify upload.

## Files and open gates

Implementation touches `layout/theme.liquid`, Home/Product/Collection sections, face/back/URL/menu snippets, and matching locale JSON. New assets/snippets are `bts-editorial.css`, `bts-shelf.js`, `bts-editorial-product.liquid`, `bts-shelf-nav.liquid`, `bts-routine-editorial.liquid`; PDP observer/hash handling is in `bts-pdp.js`. `templates/search.product.json` provides the native route. Development helpers/tests are `scripts/preview-visible.mjs`, `tests/visible-storefront.mjs`, `tests/visible-routing.test.mjs`, two npm commands and README documentation. Existing dependencies/lockfile were not changed.

Still open: the named creative-pass document and its delta review; four actual FINAL-v5 H1 exports and independently signed artwork/material/crop receipts; locally licensed bilingual font deliveries and renewed metrics/fit review; native/regulatory Arabic product-copy approval; genuine review-provider content; and an authorized rendered unpublished Shopify/device preview. The H1 dry run explicitly reports all four absent files. No C7/C8/C9, packaging proportion, launch readiness or visual approval gate was closed through this fallback. The local result is concrete and founder-reviewable while those approvals remain intact.
