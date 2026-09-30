# BETWEEN TWO SUNS V12 — post-Opus live-site fixes

2026-09-30. Local prototype only. Governing creative review: substantive findings in `/tmp/bts_opus_live_site.log`, which explicitly disclosed that its author could not access the running site. Opus was not called. Read with Route B, the V12 implementation/experience specifications, ChatGPT Route B conditions, signed M2 final gate and E1/E2 repairs, FINAL-v5 label truth, centralized prototype pricing, and the founder-sourced H1 geometry addendum. The founder’s current placeholder-first instruction supersedes the older “hide missing media” rule for composition preview; it does not approve any media, claim, font or production release.

## C1 — one composition before and after H1

- Removed the alternate `.bts-home--editorial`/landscape product branch and its PDP overrides. Shelf, PDP and Shop use the same `bts-face` stage, perspective host, portrait front footprint, responsive caps, intrinsic back fit, subgrid information/buy rows and contact floor for placeholders and approved H1.
- Added `pack_ratio_nominal` (0.62) and its explicit composition-only provenance to four local product seeds and the offline product contract. This reserves a portrait crop, not a bottle design or measured silhouette. No render, fake label, raster or packaging asset was created.
- Founder heights remain 180/96/116/116 mm. On desktop, a separately named `data-composition-scale="physical-preview"` uses the same millimetre/unit/width/floor equations as the measured branch. All four sourced dimensions are required. Production `data-pack-scale="measured"` still requires all four approved, current-label, valid-ratio H1 crops; placeholders leave it `neutral`. No media approval or crop receipt was seeded.
- Replaced clipped short landscape color blocks and stray rules with bottom-aligned, outlined portrait frames: step, explicit image-placeholder annotation, contained short-name graphic and restrained product-color contact edge. All marks share a shelf baseline; graphic annotations fit the media footprint, while functional text and controls resize with rem units.
- Added source-swap tests for all four one-at-a-time replacements, across Home/PDP/Shop, six widths and EN/AR at 100%/200% text. The isolated synthetic rectangles are mechanical fixtures only; the live 8787 server never exposes them.

## C2 — reviewable FRONT/BACK without media approval

- Shelf/PDP emit the same interaction host with a placeholder front when approved H1 is missing or rejected. Both the visible front annotation and the back’s “Layout preview · not packaging” line identify the prototype. Placeholder aria labels refer to a layout preview, not a pack.
- EN backs use only the existing approved label content and pills. Arabic preview backs contain interface annotation and the approved Latin INCI access path; no translated product promise, description, pill or ingredient attribution was added. A front with approved H1 still needs approved localized back copy to enable the actual media-backed turn.
- Add/price stay outside the rotating host. Hidden/inert states and `aria-pressed` track the selected face; the outgoing face is hidden after the restrained 320 ms turn or 120 ms reduced-motion crossfade. Reduced motion has no rotation. INCI opens through the shared sheet controller, and focus returns to its opener.
- An invisible, noninteractive turn footprint keeps commerce geometry stable when Arabic front media arrives before approved Arabic back copy. It adds no false control or claim.
- Added an explicit Tab/Shift+Tab boundary trap to the shared dialog controller, preserving Escape, one-sheet ownership, scroll lock and opener focus return.

## C3 — representative prototype typography

- Retained unfilled `BTS Display`, `BTS UI`, `BTS Arabic Display` and `BTS Arabic UI` slots for later licensed self-hosted fonts. No font download, binary copy, invented licence, missing-file font-face/preload or guessed metric override.
- Display fallback: Avenir Next Condensed → DIN Condensed → Roboto Condensed → Arial Narrow → sans-serif. Latin UI uses the system UI stack. Arabic uses Geeza Pro → Noto Sans Arabic → Tahoma → sans-serif. Latin proper-name spans explicitly keep the Latin display family in RTL.
- Updated `data/fonts.md` and `data/production/typography-spec.json` to document the active prototype fallback and preserve the IBM Plex procurement/licensing requirements. The exact supplied wordmark/icon SVGs remain unchanged.
- Chrome’s platform-font API confirmed **AvenirNextCondensed-DemiBold** for product names in EN and AR, **SF NS** for EN UI, and **Geeza Pro/Tahoma** for AR UI/numerals. This verifies rendered fonts, not merely computed CSS family strings. Evidence: `test-results/v12-post-opus-live/platform-fonts.txt`. Final C8 approval remains open.

## Remaining live-review corrections implemented

- **C4:** mirrored routine/onward arrows with a shared logical arrow class; composed AR brand band with the exact icon and entry links; kept product-copy gates intact; scaled the icon at short desktop heights so the first commerce row remains accessible.
- **C5:** replaced the bare routine-sheet list with four product-color portrait chips, step, name, exact size, individual config-derived price and Add. Shared routine verification supplies individual total, routine price, saving and Add all four; invalid/missing config hides the offer/panel. Long AR/EN names wrap at 200%; the sheet scrolls to its final action and traps focus.
- **C6:** added a campaign reservation at 4:5 mobile/16:9 desktop using the exact icon and existing EN brand line; four square T2 reservations; and a dark formula-transparency module containing existing label actives and direct INCI paths. Approved campaign/T2 media enters those slots with the same crop containers. No skin, texture, efficacy, testing, ingredient why-line or founder narrative was invented.
- **C7:** centered expanded PDP formula content at a 760 px measure; added the other three products with portrait media roles, prices and Add plus a routine-sheet offer. Replaced engineering AM/PM notation with interface descriptions derived from `usage_times`. Styled the INCI disclosure with a 52 px target, plus/minus state and product-color open rule. Ineligible/empty review modules now render nothing; review authenticity and approval checks remain intact.
- **C8:** native shelf snap and the product peek remain. Enhanced mobile shelf hides the numeric pager; previous/next controls remain, while no-JS keeps functional numeric anchors. Front frames get the same restrained hover/focus lift and contact shadow, suppressed under reduced motion.
- **C9:** moved the single prototype/prices marker to the footer; removed the redundant desktop hamburger; unified visible Shop naming; removed the duplicated homepage routine offer; designed the menu with search and existing working destinations; restored product colors to bag chips. Retained exact approved label promises because no approved replacement shelf copy exists.
- **C10:** Shop now shows portrait product frames; one column below 990, two at 990–1279, three at 1280+. Routine route uses the same composed grid. Shop is included in every live viewport/locale/text/motion capture.
- **C11:** reduced pastel coverage to product accents/controlled backs, preserving off-white/ink ground. Swatches remain explicitly provisional. No measured Pantone conversion or color approval was fabricated; all review captures are **not color-accurate**.

## Implementation map

- Composition/interaction: `snippets/bts-face.liquid`, `snippets/bts-editorial-product.liquid`, `assets/bts-face.css`, `assets/bts-face.js`, `assets/bts-home.css`, `assets/bts-editorial.css`, `sections/bts-home.liquid`, `sections/bts-product.liquid`.
- Typography/data: `assets/bts-tokens.css`, `assets/bts-base.css`, `data/fonts.md`, `data/production/typography-spec.json`, `data/content/product-contract.json`, four single-product JSON seeds, and both locale files.
- Navigation/commerce: `assets/bts-components.css`, `assets/bts-core.js`, `assets/bts-shelf.js`, `layout/theme.liquid`, header/footer/collection/routine sections, menu/routine-offer/routine-sheet/routine-editorial/review snippets. New `bts-usage-time.liquid` and `bts-home-story.liquid` share usage descriptions and editorial slots.
- Local preview/QA: `scripts/preview-visible.mjs` now supplies the sourced geometry to the live fixture. Updated existing content/production/routing/browser/render-fixture/visible tests; added `tests/placeholder-geometry.mjs`, `tests/live-touch-journeys.mjs`, `tests/live-review-captures.mjs`. No SVG identity files or final media manifests were altered.

## Validation

**Zero unresolved failures in the accepted results.** Corrective reruns are explicit; initial failing attempts are retained rather than represented as clean runs.

| Check | Result / evidence |
|---|---|
| `npm run check` | **27/27 pass**, including structure/gzip budgets, exact logo/label/INCI parity, null AR/media gates, price centralization/arithmetic, climate budget, content/seed/cart/production/routing tests. |
| `npm run theme-check` | **55 files, zero offenses**. |
| Core browser matrix | **128 accepted matrix cells + 17 additional checks = 145**. The initial full run passed 126 matrix cells and failed two AR 1366×620 cells; both pass after the short-band fix. The additional-check timeout was a fixture query that included new decorative `.pf` nodes without component observer data. It now selects instrumented shelf instances; all 17 additional checks pass. `BTS_BROWSER_CAPTURE=0 BTS_BROWSER_CELLS='home ar 1366x620 no-preference;home ar 1366x620 reduce' npm run test:browser` finished **19 checks / 0 failures**. No full-matrix rerun is falsely claimed. |
| E1 width sweeps | **1,746** live turned-resize geometries: every integer width 990–1280, heights 600/768/864, EN/AR. Bounds reads force layout directly; assertions retain stage floors, full back containment, visible eligible turns and nonoverlapping commerce. |
| LIVE 8787 matrix | **192 accepted cells + 2 no-JS flows = 194**: Home, Shop and all four PDPs × 375×667 / 390×844 / 1024×600 / 1440×900 × EN/AR × normal/reduced motion × 100%/200% text. The initial full sweep passed 190 cells and both no-JS flows; two AR 1024×600/200% Home cells exposed Latin formula-heading overflow and were corrected. |
| Final Home rereview | **32/32 combinations + 2 no-JS flows pass** on the final implementation. Also checks that placeholder marks remain visibly sized; the final visual inspection corrected inherited `cqw` resolution inside a nested graphic container by using a common shelf mark size. |
| H1 source-only swaps | **72/72 cases**, **288 comparisons**, maximum **0 px** stage/info/buy delta while replacing zero → one → two → three → four H1 fixtures at the declared 0.62 ratio. Includes 768/1280 widths in addition to requested sizes. Production measured mode remains closed until the fourth eligible H1. |
| Live touch / keyboard journeys | **4/4 pass**: EN/AR × normal/reduced motion. CDP touch swipe advances the shelf with mirrored direction; touchscreen tap and keyboard Space turn the chosen face; menu search reaches the correct PDP; quantity edits persist; locale round-trips preserve PDP and bag. Touch is emulated, not a physical-device claim. |
| Review adapter browser checks | `npm run test:production-browser`: **16/16 pass**, including empty-module removal and isolated internal-fixture authenticity/escaping checks. No fixtures are served as customer reviews on 8787. |
| Final overview exports | **96 fold/full captures** after lazy SVG identity assets decode: Home, Shop, four PDPs × four sizes × EN/AR. Home exports were refreshed after the graphic-mark correction. The full text/motion matrix and interaction captures remain alongside these. |

Interactive assertions cover menu search, native shelf/peek/controls, every eligible turn, hidden/inert/pressed state, optional INCI sheets, motionless Add, approved copy retention, RTL arrows/order, PDP neighbours and disclosure, sticky Add thresholds/sheets/footer/focus, routine-sheet totals/scroll/focus, bag mutation/disabled checkout, locale persistence, document overflow and automated axe checks. No runtime or console errors remained in accepted cells. Automated axe checks are not a WCAG conformance certification.

At 390×844 / 100%, Home document height is **4,001 px EN / 3,995 px AR**, within the review’s 3,200–4,500 px narrative target. Exact brand/product/proof pixel-share targets are not claimed with incomplete approved copy/media.

Artifacts under `test-results/v12-post-opus-live/`:

- `core-browser-acceptance-report.json`: full-matrix results combined with corrected reruns, with original failures explicitly retained as resolved history.
- `live-acceptance-report.json`: accepted 194 live cases; original `browser-report.json` and final `browser-home-rereview-report.json` preserve the full attempt/rerun record.
- `geometry-swap-report.json`, `touch-journey-report.json`, `platform-fonts.txt` and command logs.
- `final-review/index.json`: 96 canonical overview paths. Parent-folder PNGs include 200% text, normal/reduced motion, back faces, menu, bag, routine and sticky states.

Performance is limited here to existing gzip budgets and no-change geometry evidence. Old placeholder Lighthouse 100 scores are not quoted as release evidence; final H1/font/Shopify LCP and CLS remain open.

## Remaining limitations

1. No approved H1 photography or measured crop receipts exist. The 0.62 portrait reservation is nominal, not an actual pack-width measurement. Zero-change swap evidence applies to the declared geometry; real silhouette ratios, material/light/contact shadow and crop evidence must be revalidated with delivered H1 before closing C7 or claiming photographic accuracy. Preview proportions use sourced heights but are not approved media.
2. Licensed self-hosted IBM Plex files, local licence provenance, Arabic shaping/metric review and final font performance remain required. System fallbacks vary across machines; C8 is not closed.
3. Arabic claims/descriptions/ingredient education remain unapproved and hidden. The AR preview interaction is composition-only. C9 product-copy approval is not closed.
4. Color tokens have no measured Pantone-to-screen conversion or certified profile. Color sign-off remains open.
5. Feels-like copy, ingredient why-lines and founder/editorial narrative are null. The texture/proof reservations demonstrate composition and label transparency, not texture or efficacy evidence. Precise content-mix/creative awards approval is not claimed. No unsupported climate sentence was added; the existing climate-copy gate remains unchanged.
6. Local LiquidJS simulates Shopify drops, filters and routes. This is a live local browser test, not a native Shopify/Markets/device release test. No physical-phone, actual touch hardware, final media LCP/CLS, live checkout or shipping/payment/service verification is claimed.
7. The working tree already contained extensive V12 work and archival deletions. It was preserved. No Opus invocation, publish, upload, Admin mutation, push or commit occurred.

## Review URLs

- Home EN: http://127.0.0.1:8787/
- Home AR: http://127.0.0.1:8787/ar
- Shop: http://127.0.0.1:8787/collections/all and http://127.0.0.1:8787/ar/collections/all
- PDPs: http://127.0.0.1:8787/search?view=product&q=daily-reset-cleanser ; substitute `clarity-serum`, `daily-barrier-moisturizing-cream` or `daily-defense-sunscreen-spf-50`. AR uses `/ar/search` with the same query.
- Routine: http://127.0.0.1:8787/search?view=routine and http://127.0.0.1:8787/ar/search?view=routine
- Bag: http://127.0.0.1:8787/cart and http://127.0.0.1:8787/ar/cart
- Search: http://127.0.0.1:8787/search?q=clarity and http://127.0.0.1:8787/ar/search?q=clarity

The preview server remains running on 127.0.0.1:8787 (`npm run preview:local`).
