# BETWEEN TWO SUNS — V12 Codex M2 final fix report

2026-09-30 · Follow-up to [Opus M2 rereview](V12_OPUS_M2_REREVIEW.md) · Local working tree only

## Result and scope

D1–D9 are repaired and the final local verification passes. Opus's **PASS WITH CONDITIONS** remains the creative verdict; this report does not approve founder readiness or release. The signed-off C1–C6 and repaired B1–B5 remain intact.

No Shopify Admin operations, uploads, publishing, pushes, staging, or commits were performed. Existing uncommitted V12 work was preserved. No production photography, pack measurements, fonts/licenses, Arabic product copy/address decision, claims, prices, reviews, or service promises were invented. Product/config/label seeds, locales, approved logo files, launch lock, and commerce adapter were not changed in this pass.

## D1–D9 implementation

### D1 — product floor and yielding composition

- Base/PDP cap is exactly `clamp(200px, 100svh - 360px, 420px)`. Desktop shelf cap is exactly `clamp(220px, 100svh - 600px, 360px)`.
- Desktop band is `clamp(120px, 100svh - 620px, 280px)`. Its brand wrapper occupies the band height and the image uses `block-size: 100%`. On short screens, the band margin can yield to zero; the existing tagline's size/spacing and offer padding yield too, so the offer stays inside the band instead of overlapping the header.
- The D6 mobile mark adds about 113 px at 375 px width compared with the former 64 px stamp. Using the base cap unchanged would put commerce below 667 px. Home therefore has a **shelf-only mobile budget** of `clamp(200px, 100svh - 480px, 420px)`; the product never falls below 200 px in the tested neutral layouts. Below 667 px height, the brand mark yields using its approved SVG aspect ratio. This refinement reconciles the larger identity with the commerce requirement; the base/PDP formula remains unchanged.
- The stage host uses the track width for readable proof. Front images remain centered with `object-fit: contain`: their visible width follows their approved ratio at the calculated height, without stretching or cropping. In measured desktop mode, the common unit still constrains both height and width.
- Commerce must end inside the initial viewport at heights **≥620 px**. Below that boundary, scrolling to commerce is accepted while stage height, back fit, and EN turn visibility remain mandatory. No product-stage sliver is used to force a fit.

### D2 — short viewport and landscape regression coverage

The matrix now covers Home and PDP, EN and AR, normal and reduced motion at **375×667, 390×844, 430×932, 1440×900, 1440×768, 1366×640, 667×375, 375×620, 1366×620, and 1280×720**: 80 main cells.

Every main cell asserts stage height ≥200 px, no horizontal overflow, and the conditional commerce rule. EN asserts every back's `data-back-overflow="false"` and every turn control visible; AR asserts pack imagery and absent unapproved backs/turns. Shelf cells assert `data-info-overflow="false"`, including AR at 375. Desktop shelves also assert a common floor and buy-row baseline. Brand and offer must stay inside the yielding band, and the Home mark must dominate the footer.

### D3 — legible synthetic fixtures and honest exports

- The fixture is a **#b9b9b4 silhouette on a transparent field**, with “Contract fixture only” and “SYNTHETIC” captions and no brand wordmark in the image. It is a geometry fixture, not a bottle/tube/jar rendering or H1 substitute.
- Generated SVG geometry and intrinsic dimensions match the requested fixture ratio, including 2:3 and the wide cqw case. Ratio QA now exercises the image itself, rather than changing metadata alone.
- Every main cell has both a **fold capture (`fullPage: false`) and full-page capture (`fullPage: true`)**, including reduced motion. Filenames include width **and height**, locale, surface, and motion mode.
- All four EN SKU backs are captured individually at 375×667 and 1440×900, with additional short-screen captures. Measured mode at `?scale=1&media=1` has fold/full captures at 1440×900; the width-bound synthetic variant has its own pair.
- Final total: **286 PNGs**, with all 80 main fold/full pairs and dimensions verified. The screenshot directory contains only the final rerun's captures. [Screenshot index](../test-results/screenshot-index.html), [manifest/dimension verification](../test-results/screenshot-verification.json), and [browser report](../test-results/browser-report.json) provide the complete inventory.
- On this Chrome build, native full-page export can briefly expose a 1×1 viewport to page JavaScript. Exports therefore run in separate tabs at the same URL/viewport/motion, with the chosen face and shelf position reproduced. Only the debug query is removed from export tabs. The interaction tabs keep development assertions active and never undergo screenshot export; export tabs independently verify fit before/after capture and restoration of the requested viewport. Production guards were not weakened or bypassed.

### D4 — cqw padding counted once

Both the neutral stage-height constraint and measured `--pf-unit` use `(100cqw - 3 * var(--pf-gap)) / 4`; the second gutter subtraction is removed. The dedicated wide synthetic test makes the width constraint bind and checks the resulting unit against the shelf's actual content box.

Final width-bound mechanics: content box **1360 px**, track **318.4 px**, expected common unit **1.01079365 px per synthetic mm**. Every measured unit differs by <0.001, and the widest calculated image width reaches the track within 0.1 px. These are test dimensions, not measurements of BETWEEN TWO SUNS packs.

### D5 — shelf-only info budget and overflow assertion

- The fixed 136 px info height applies only to `variant="shelf"`. PDP info is natural height; desktop grid alignment keeps info and commerce together, with an asserted gap ≤16 px between their boxes.
- A ResizeObserver covers **all shelf faces, including AR's ordinary divs**. It records `data-info-overflow`, checks scroll height and child bounds against the content floor, and emits `console.assert` under `?bts_debug=1`.
- Shelf padding/margins fit the approved name/promise combinations into the budget. Proper-name links inherit the name line height so Arabic chrome does not enlarge Latin names through an ancestor's line spacing.
- A separate AR 375 test inserts unmistakably synthetic excess text, verifies the overflow flag and debug assertion, restores the approved name, and verifies the flag clears. This changes no content seed.

### D6 — Home identity dominates the footer

Normal mobile Home uses `inline-size: min(200px, 52vw)`; desktop keeps the 280 px band maximum and yields by viewport height. Footer is a sign-off at `min(160px, 44vw)`, with a further height-relative maximum when the band yields, so it cannot outrank the top mark at 1366×640 or in landscape. The hierarchy is asserted in every Home matrix cell. All logo bytes remain unchanged.

### D7 — full approved description, no generated excerpt

The period split and appended punctuation are removed entirely. The face renders the **complete approved localized `back_description`**, through the existing approval gate and escaping mechanism. There is no excerpt field, sentence inference, or punctuation transformation to validate; decimal periods and abbreviations cannot be truncated by this path.

A rendering regression compares all four complete shelf descriptions against the approved label strings. Existing per-product source/INCI/pill/ingredient-attribution checks still run. Suitability remains approval-gated; Clarity receives no invented suitability or pills. Ingredient `why`, texture, formula logic, and Arabic product fields remain unapproved/null as before.

To fit this complete copy at the floor, the decorative wordmark and 44 px Full INCI control share a header; suitability, full description, and approved pills follow. Body type remains **14 px**, pills **12 px**. Back spacing and pill padding are tighter; backs never become scrolling proof panels. The overflow guard and all-SKU fit tests remain active.

### D8 — accessible header SVGs

Menu and search text glyphs are replaced by 24 px inline stroke SVGs using `currentColor`. The original localized link `aria-label`s are unchanged; SVGs are `aria-hidden="true"` and `focusable="false"`. Existing 44 px targets and the 52 px header remain intact. Main/menu/bag flows pass axe.

### D9 — global Routine links reach the approved Home strip

The shared global Routine link now uses `routes.root_url + '#bts-home-routine'`; Home has that stable strip anchor. Header, footer, menu, and the PDP link therefore reach the existing brand surface rather than the engineering list.

The strip still opens the established routine sheet with one bundle Add. Its own href retains the existing real Page or native `/search?view=routine` fallback for no-JS/route use. Existing routine/search templates and server-rendered search remain functional. No new marketing or product content was authored to style a fallback page.

## Preservation and validation

C1–C6 remain covered: approved data/attribution and money contracts; selective Home/PDP turn; commerce outside the stage and immobile across turns; inert/aria-pressed/focus return; reduced motion; RTL non-mirroring and safe proper-name alt; fail-closed absent/stale media; single 52 px header, marker and bag count; token contrast and gzip budgets; locked prototype/noindex/disabled checkout; shared sheets/cart and no-JS degradation.

B1–B5 remain covered: equal desktop tracks and shared floor/baseline; four visible desktop commerce rows; AR images without English product fallback; truthful back content without ingredient misattribution; conditional initial-fold commerce; config-derived routine prices/savings, one bundle Add and working native fallback/search routes. Production measurement fields remain null and default shelves remain neutral.

| Final check | Result | Evidence |
|---|---|---|
| `npm run check` | **19/19 tests pass**, all structural/source/price/climate/contrast/logo/gzip gates pass | [Output](../test-results/check-output.txt) |
| `npm run theme-check` | **48 files, 0 offenses** | [Output](../test-results/theme-check-output.txt) |
| Liquid skill validator | **All 10 changed theme files valid** | [Output](../test-results/skill-validation-output.txt) |
| `npm run test:browser` | **94 checks pass, 0 failures**, including 80 matrix cells and axe WCAG 2.2 AA tags | [Output](../test-results/browser-output.txt), [report](../test-results/browser-report.json) |
| Screenshot completeness/dimensions | **286 unique PNGs verified**; fold/full pairs, all four baseline SKU backs and measured pairs present | [Verification](../test-results/screenshot-verification.json) |
| `npm run test:perf` | Local Home EN, PDP EN, Home AR smoke completed | [Summary](../test-results/lighthouse-summary.json) |
| `git diff --check` and changed-file whitespace scan | Clean | Local verification |

The skill's validator was run as an unchanged copy using the existing temporary dependency installation, because the plugin's own entrypoint lacks its runtime dependencies. Repository package files were not changed for this workaround.

Lighthouse scope is **LOCAL FIXTURE WITHOUT H1 MEDIA/SHOPIFY SCRIPTS/FONTS**. The three runs report performance/accessibility/best practices 100, SEO 61, CLS 0 and TBT 0; LCP is approximately 1.47 s / 1.24 s / 1.39 s respectively. Noindexed prototype SEO and fixture scores are not release evidence or real-photography performance claims.

### Final neutral Home geometry

Values are measured before scrolling, in px. All four desktop rows share a baseline within 1 px; all four desktop stages share a floor within 1 px. Mobile rows refer to the shelf's cards; the shelf intentionally scrolls horizontally inside the page.

| Viewport | Locale | Minimum stage height | Maximum buy-row bottom | Within initial fold |
|---|---|---:|---:|---|
| 375×667 | EN | 200.00 | 655.44 | Yes |
| 375×667 | AR | 200.00 | 658.69 | Yes |
| 390×844 | EN | 364.00 | 823.77 | Yes |
| 390×844 | AR | 364.00 | 827.02 | Yes |
| 430×932 | EN | 420.00 | 879.77 | Yes |
| 430×932 | AR | 420.00 | 883.02 | Yes |
| 1440×900 | EN | 300.00 | 874.84 | Yes |
| 1440×900 | AR | 300.00 | 878.09 | Yes |
| 1440×768 | EN | 220.00 | 662.84 | Yes |
| 1440×768 | AR | 220.00 | 666.09 | Yes |
| 1366×640 | EN | 220.00 | 614.84 | Yes |
| 1366×640 | AR | 220.00 | 618.09 | Yes |
| 667×375 | EN | 200.00 | 586.83 | Below fold, allowed below 620 px |
| 667×375 | AR | 200.00 | 590.08 | Below fold, allowed below 620 px |
| 375×620 | EN | 200.00 | 614.83 | Yes |
| 375×620 | AR | 200.00 | 618.08 | Yes |
| 1366×620 | EN | 220.00 | 614.84 | Yes |
| 1366×620 | AR | 220.00 | 618.09 | Yes |
| 1280×720 | EN | 220.00 | 634.84 | Yes |
| 1280×720 | AR | 220.00 | 638.09 | Yes |

Measured-mode mechanics at 1440×900 retain a common unit of approximately **1.42857 px per synthetic mm**, a 300 px tallest stage, and one common floor at **686.84 px**. This proves the algorithm only. Representative final front, back, AR, short-desktop, landscape, and measured captures were inspected; file completeness and dimensions were checked for every PNG.

## Still external — no engineering substitute supplied

1. **C7:** real approved/current-label H1 images, sourced exact pack heights, and pack-crop/floor approval. All production H1 references and measurement seeds remain null. Synthetic fixtures cannot certify real family proportion, crop, contact shadow, or photography.
2. **C8:** licensed/self-hosted display, UI, and Arabic typography. Existing system fallbacks remain provisional; no font files, licenses, or substitute typography were fabricated.
3. **C9:** founder-approved Arabic product fields and address decision. Arabic product copy remains absent and its back unavailable. Clarity's missing suitability and any texture lines remain content decisions, not inferred engineering fixes.
4. **Rendered Shopify preview in EN and AR:** real metaobjects/config, image CDN, `content_for_header`, locale routing and approved fonts/media still need preview validation. This local LiquidJS pass does not claim Shopify rendering or founder readiness. No Admin/publish/upload action was used to obtain a preview.
