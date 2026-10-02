# BETWEEN TWO SUNS — V12 Codex M2 engineering report

Date: 2026-09-30. Workspace: `/tmp/bts-opus-review-repo`. Branch: `build/vertical-slice`.

**Result:** C1–C6 are implemented and checked locally. The selective FRONT/BACK foundation, Home/PDP integration and static collection presentation are built. This is an engineering slice, not founder visual approval or a completed launch storefront. C7–C10 remain release gates as described below.

No commit, staging, push, tag, publish, Shopify Admin call, product activation, pricing/inventory change, media upload or Page creation was performed. The substantial pre-existing dirty working tree was preserved; earlier v5–v11 deletions are not claimed as new M2 work.

## C1–C6 implementation

| Condition | Exact local change | Evidence / boundary |
| --- | --- | --- |
| C1 — approved back contract | Extended all four `bts_product_content` SKU seeds with per-locale approved `does`, `feels_like`, claim pills, exactly three `{inci_name, display_name, why}` ingredients, formula logic, label version and nullable front/back/swatch/application/emotional media. Every Arabic product translation is null and unapproved. | `data/content/products/*.json`, `data/labels.json`, `data/content/product-contract.json`, `data/content/media-contract.json`; per-product parity and negative regression tests pass. No CMS definitions/entries were written. |
| C2 — branding/header | Exact supplied `)(` SVG in a fixed 52px header; native `bts-language` localization form in header; desktop Shop/Routine slots, with Routine omitted when its Page does not exist. Mobile keeps these routes in the menu. Footer uses the exact wordmark SVG. SVG dimensions preserve source proportions. | `sections/bts-header.liquid`, `sections/bts-footer.liquid`, `snippets/bts-language.liquid`; local 375/390/430/1440 EN/AR checks confirm 52px and no wrapping/overflow. Actual Shopify section wrapper gets the sticky header class. |
| C3 — money | One shared locale pattern/currency-label contract, consumed by both `bts-money` and `BTS.money`. Minor units, Western grouping, integer rounding, no decimal suffix; EN `EGP 1,661`, AR `1,661 ج.م`, isolated in `bdi`. Missing/invalid currency returns a dash. Removed raw prototype formatting and the old `Intl` currency mismatch. | `snippets/bts-money.liquid`, `snippets/bts-price.liquid`, layout money config, `assets/bts-core.js`, locales. Liquid/JS grouping, rounding and browser parity pass. Prices remain exclusively config/metaobject derived; no scenario amounts were added to theme code. |
| C4 — prototype marker | Exactly one quiet, persistent server-rendered status line in the chrome, in every prototype page. Removed the per-price marker and all founder suppression code. `?founder=1` cannot hide the status. Checkout remains disabled with its existing launch-state label. | `snippets/bts-internal-marker.liquid`, header/components/core/price/locales. Static and browser counts/visibility pass, including founder URLs and no-JS. Existing EN/AR marker copy was shortened using its exact first two clauses. |
| C5 — tokens/cleanup | Removed global image `contain`; added pack colour/AA ink, display/UI/Arabic font, type, radii, shadow, duration/ease, z-layer and reading-direction tokens. Deleted broken quick view, unused foundation section and both unused section-group files; kept one layout-owned section path. Also removed orphaned, obsolete `bts-content`/`bts-icon` snippets. | `assets/bts-tokens.css`, base/components/face CSS, layout. Exact Arabic/base-language matching replaces substring detection. `--bts-turn` is the single signed direction source. Logo byte parity, logical CSS, references, contracts and gzip checks pass. |
| C6 — side sheets/cart | Native dialogs share inline-end drawer/INCI and inline-start menu positions, 240ms opening motion, reduced-motion fade, background/body scroll lock, contained overscroll, one active sheet, Escape/close/backdrop handling and focus return. Cart/page share one line template and one adapter; lines use catalog label names, cap colour chips, step/role/size and editable quantities, never handles as titles. | `snippets/bts-{drawer,menu-sheet,inci-sheet,cart-body,catalog-json}.liquid`, core/components and cart section. Local EN/RTL edge, quantity, single-sheet, focus and axe checks pass. Real iOS scroll/keyboard behaviour remains device QA. |

### Source discipline

- Read the M0/M1 report, Opus gate, independent review, implementation spec, final label source and ingredient education brief. Also consulted the approved pricing source, Arabic brief and relevant creative/brand constraints.
- `data/labels.json` mirrors each individual final-label section. The parity checker compares names, front line, complete ordered INCI, descriptions, pill sets, ingredient membership, consumer names and excerpts against that product's section, rather than searching the whole document for a matching word.
- Reset has only its three label pills, Centella and its final INCI. Barrier and Defense have only their three label pills. Clarity has **zero** pills: none are approved in the final source.
- The Hyaluronic Acid consumer alias is explicitly approved against the source's Sodium Hyaluronate explanation. No percentages, new testing assertions or ingredient-specific sunscreen efficacy were authored.
- Ingredient `why` values are concise, exact final-label excerpts with `why_scope: formula_label_excerpt`. The visible grouping is **In this formula**. These describe the labeled formula; they are not new substantiation for an isolated ingredient. Formula logic is the exact approved back description, not an invented scientific story.
- `feels_like` uses only approved label wording: Reset “fresh and comfortable”; Clarity “Hydrates.”; Barrier “Lightweight.”; Defense “Lightweight. Fast-absorbing.” Clarity has no approved sensory texture description, so the field uses its hydration line rather than inventing “fluid”, “silky” or a finish. Richer sensory/ingredient education requires approved authoring.
- Preserved the artwork's raw size as `size_label` (including “50 gm”), with web `size_display` normalized to the spec-approved “50 g”; numerical size/unit fields are also explicit.
- Added a concrete offline seed field mapping. Local translations, claims and ingredient envelopes become JSON fields with per-locale approval. Media references resolve approved `bts_media` image records. This avoids creating a separate CMS entry for every pill/use in this four-SKU foundation. The dry run serializes every mapped field and fails on unknown mappings; it has no write/API client.
- `data/media-safety.json` records the SHA-256 of the sole retained interim `assets/bts-barrier-interim.webp`. Removed the duplicate PNG and versioned WebP name. The interim is **not referenced by the theme** and is never a missing-H1 fallback. All four supplied logo/icon SVGs remain byte-identical.
- Deleted the unused empty prototype review seed. No sample/review-shaped UI, ratings, invented reviews, service promises or checkout path were added.

## Selective FRONT/BACK foundation

New shared files: `snippets/bts-face.liquid`, `snippets/bts-product-back.liquid`, `snippets/bts-localized.liquid`, `snippets/bts-media.liquid`, `assets/bts-face.js`, `assets/bts-face.css`.

The full component is emitted only for **Home shelf or PDP**, and only with approved current-label H1, approved locale alt and approved locale back content. Search, grid, cart, predictive, compact, flyout and Finder variants cannot receive a turn host/back. Static presentations emit no stage/card/3D markup and load no face JS. Routine turning was left optional and unimplemented.

The two faces occupy the same media-derived box. The front is a real image link; only the labeled secondary control turns. The back starts hidden/inert in SSR; upgrade toggles `inert` synchronously, keeps focus on the control and maintains `aria-pressed`. Motion is 320ms, 1200px perspective and one signed root direction; reduced motion is a 120ms crossfade. Browsers without `inert` use hidden-face swapping. Component part assertions isolate failures and report a runtime event. Shelf reset uses IntersectionObserver; no gesture/scroll listener was added. Overflow becomes keyboard-scrollable only when needed for enlarged text; normal local SKU backs fit without scrolling.

Price, identity/promise and Add remain outside rotation. The shared approved back rendering is reused for the unfolded PDP section and INCI sheet. There is no per-SKU inline copy in Liquid or JS.

## Home/PDP integration and commerce guards

- Replaced “V12 foundation ready” milestone messaging with a source-driven Home shelf. Desktop has one restrained supplied wordmark and an asymmetrical, staggered family composition scaffold; mobile uses a native horizontal shelf. This composition still needs actual H1 art direction and physical-scale approval.
- Added one approved emotional-image setting/slot; it emits nothing without a valid image/locale alt. No skin, application, texture, campaign or empty frame was simulated.
- Replaced placeholder PDP with the same component, including its h1, identity, promise, suitability data contract and fixed buy row; the unfolded back and exact Latin INCI are server-rendered. Back/T2/application image frames render in that order only when approved, correctly typed/role-matched and current-label assets exist.
- Added `templates/page.preview-product.json`. Product/Page content resolves through `bts.content` or the content handle, so the foundation does not require DRAFT products to be published. URL helper links only to an **existing** preview Page, otherwise to the real collection route; no nonexistent preview URLs are fabricated.
- Collection now uses the shared static presentation instead of its foundation placeholder. No search/Finder/quick-view feature was created as an excuse to repeat the turn.
- Added PDP sticky Add using the same adapter: primary must have passed above the viewport; footer, open sheet, disabled availability or keyboard suppress it. Focus returns correctly after adding from sticky; a hidden sticky control transfers focus to the visible Bag control without scrolling.
- **Launch is locked in code**, even if the dormant settings switches are changed. ShopifyCartAdapter remains a no-network mutation refusal. Prototype localStorage, central pricing, noindex and disabled checkout remain intact.
- Added `.shopifyignore`, `.theme-check.yml`, `.gitignore`, locked local tooling/dependencies, regression/render/browser/performance harnesses and reproducible npm commands. Updated README and font integration instructions. Existing archive/review folders were retained and excluded from upload/active Theme Check.

## Local validation

Commands actually run:

- `npm run check`: structure/schema/JSON/section/snippet/locale/hook checks; exact logo/interim byte/hash checks; logical CSS and prohibited active references; gzip limits; central scenario arithmetic; per-SKU parity; price literal and climate checks; **13 Node regression tests, all passed**.
- `npm run theme-check`: installed local Shopify CLI; **37 active theme files, zero offences**. Archive/review/tooling paths are explicitly ignored. The M0/M1 missing Theme Check dependency is resolved.
- `npm run test:browser`: system Google Chrome **154.0.8037.58**, local LiquidJS render server, Shopify drop/filter stand-ins and an explicitly synthetic geometry image served only by the test server. **41 cells/flows passed, zero failures**: 32 Home/PDP cells (375×667, 390×844, 430×932, 1440×900 × EN/AR × default/reduced motion); four absent/stale-media cells; four EN/AR no-JS cells; one sticky cart/sheet/footer/focus flow.
- Browser assertions cover all four EN shelf backs, fixed Add coordinates, inert/pressed state, focus return, money parity, header height, single chrome/count/marker, founder visibility, horizontal overflow, logical sheet edges, one open sheet, quantity changes, direction token and unmirrored photography. **Axe WCAG-tag audits returned zero violations** on the matrix's main page and open drawer. Page/console error assertions passed. Arabic product backs were correctly absent, not authored or visually approved.
- `npm run test:perf`: local Lighthouse mobile smoke on EN Home, EN PDP and AR Home **without H1, brand fonts or Shopify scripts**. Detailed final scores are recorded below. These are fixture measurements, not the release Lighthouse gate.
- `node --check` on every active JS and script/test module; `node scripts/seed-metaobjects.mjs --dry-run`; seed write-flag refusal regression; `npm audit --omit=optional`; `git diff --check`: passed. Seed reports **0 Admin calls**; audit reports **0 vulnerabilities**.

Token ink contrast ratios: Reset **12.25:1**, Clarity **11.90:1**, Barrier **10.52:1**, Defense **10.74:1**. They exceed AA for informative text. The palette/ground are provisional screen values, not certified Pantone conversions or an H1 surface decision. Pill/contact-shadow placement and typography also need real-pack design review.

Local evidence: `test-results/browser-report.json`, `test-results/lighthouse-*.json`, `test-results/lighthouse-summary.json` (ignored generated artifacts). The test server's geometry image is not a production asset or an H1 substitute. LiquidJS does not certify Shopify's real drop behaviour, localization submission or live routing. Playwright's Chromium download refused this macOS 13 environment; the installed system Chrome was used successfully. WebKit/Firefox and physical devices were not run.

### Final local Lighthouse smoke

| Fixture | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EN home | 100 | 100 | 100 | 61 | 1.40s | 0 | 0ms |
| EN pdp | 100 | 100 | 100 | 61 | 1.22s | 0 | 0ms |
| AR home | 100 | 100 | 100 | 61 | 1.37s | 0 | 0ms |

SEO **61 is not a pass** of the spec’s SEO gate. Its failures are intentional prototype noindex and missing meta descriptions; no noindex override was used. The local harness serves a valid robots file. Release metadata/SEO must be verified on the real Shopify pages. Performance 100 and CLS 0 here exclude the actual H1/font/Shopify cost and cannot establish release performance.


## Remaining blockers / required real work

1. **C7 — real H1 ×4:** approved Tier 2 surface photographs, correct final pack labels, per-locale approved alt, current `FINAL-v5` metadata and a composed family portrait. Front references remain null. Approve the ground, pack-relative physical scale, crop, face proportions, pill geometry and contact-shadow placement against these assets. The local synthetic rectangle is not visual evidence. Optional emotional/application/texture/back modules stay omitted until their real assets exist.
2. **C8 — fonts:** no approved/licensed subset WOFF2 files or measured metrics were supplied. Tokens use Arial fallbacks; there are no remote font requests or invented font files. Install/approve self-hosted display/UI/Arabic faces, then retest composition and CLS.
3. **C9 — Arabic:** founder decision on address; human-author/approve product role, promise/does, pills, three ingredient explanations, feel/formula/use content, media alt and the new UI labels. AR product envelopes are null/unapproved. New EN-only interface keys have deliberately empty AR counterparts to preserve locale schema parity and are not emitted in AR; they are not completed translations. AR Search label/access remains withheld pending authored copy. Latin label names, sizes and INCI remain isolated as permitted by the spec.
4. **CMS/preview dependency under the no-Admin constraint:** storefront-readable definitions/entries, prototype config and preview Pages have not been created or changed. The offline plan is concrete, but a real Shopify demo will remain empty/Coming soon wherever these approved records are absent. A later explicitly authorized content operation is needed; publishing DRAFT products is not a workaround.
5. **C10 — real browser/device/release QA:** rendered unpublished Shopify preview in EN/AR at 375/390/430, with actual H1 and fonts; verify route/localization forms, founder persistence, 375×667/390×844 desirability and price/Add visibility, Arabic line/pill fit, 200% zoom/text spacing, no-JS, reduced motion, keyboard/screen readers, iOS sheet/scroll lock, safe areas and keyboard/sticky edge cases. Run real WebKit/Firefox/Android/Samsung/VoiceOver/TalkBack passes, screenshots/design sign-off, axe and release Lighthouse budgets on the required real URLs. Local fixture scores do not satisfy this gate.
6. **Beyond this M2 foundation:** finish approved ingredient/sensory education where the label alone cannot provide it, the wider P0 IA/search/routine/help surfaces, strict JS/CSS/CI tooling and deployed-content audits. Before any launch enablement, implement/test the real Shopify cart/bundle adapter and obtain approved real prices, policies, stock/payments and product/channel decisions. Service/review modules remain absent until real approved records exist.

Do not send this as a founder-ready V12 link and do not enable launch from this report. Engineering work remains local and reviewable; no deployment approval is requested in this pass.
