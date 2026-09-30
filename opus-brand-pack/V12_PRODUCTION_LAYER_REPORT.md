# BETWEEN TWO SUNS V12 — Production layer report

Date: 2026-09-30. Scope: C7/C8/C9, authentic review integration and the local unpublished Shopify theme. No concept/architecture redo. No commit, push, upload, publish, app installation, Shopify Admin call or product edit.

## Result

The production integration foundation is complete within the available facts. The theme has a real Shopify/Liquid review reader and honest EN/AR empty state; the H1 delivery manifest, source/license audit, receipt checker, typography decision and Arabic worksheet are concrete and reviewable. **C7 photography/crop approval, C8 licensed final typography, C9 customer-facing copy approval and rendered Shopify QA remain open.** These are not closed by local fixtures or documentation.

Read against: latest `V12_OPUS_M2_FINAL_GATE.md` and `V12_CODEX_E1_E2_REPORT.md`, preceding Opus/Codex gates and independent commercial reviews, `BRAND_MANIFEST.md`, `FINAL_LABEL_SOURCE_OF_TRUTH.md`, `ARABIC_RTL_BRIEF.md`, `INGREDIENT_EDUCATION_BRIEF.md`, `PRICING_SOURCE_OF_TRUTH.md`, V11 media requirements and V12 H1 physical-finish addendum. Latest FINAL-v5/gate requirements override historic claim territories, padded H1 masters and sample review plans. The user’s empty/new-product review instruction supersedes the older no-empty-state rule; real-only social proof remains gated.

## Completed C7 foundation

- `data/production/h1-manifest.json`: four per-SKU source/height/finish/artwork/delivery/approval records. **180 / 96 / 116 / 116 mm**, with existing founder measurement provenance retained. Moisturizer/SPF are the same physical bottle with **MATTE pump/actuator**. Physical widths remain unknown rather than estimated.
- H1 exports have a **2400 px silhouette height**, actual measurement-derived integer width, tight edges, contact at row 2399, matched capture setup, sRGB genuine WebP, and no padding/long cast-shadow. Width formula and receipt requirements are explicit; supplying an arbitrary fixed width would invent proportions. Editorial **2400×3000** and social **1800×3200** crops remain separate from runtime H1.
- `data/production/asset-audit.json`: actual formats/dimensions, SHA256s, identity byte parity, reuse/rejection decisions and all workspace font binaries including ignored tooling.
- Four exact supplied identity SVGs and the FINAL label text are reusable source files. **No final label artwork JPG/PDF/vector master or approved final H1 exists in this repo.** All four temporary “WebP” product files are actually 1024×1536 PNGs. Reset/Clarity/Defense carry old label content; Barrier lacks crop/current-file approval and depicts gloss inconsistent with the matte pump instruction. The hash-pinned Barrier interim stays unwired. No old photographed Cleanser/Serum label, screenshot or archived render is artwork truth.
- `data/production/h1-approval-receipt-template.json`: null hashes/extents, false independent artwork/physical/material/crop signoffs and reviewer/date slots.
- `scripts/prepare-h1-integration.mjs`: read-only delivery/receipt validation and later integration plan. It checks real WebP headers/dimensions, hashes, retained artwork source, sourced height, edge/contact metadata and signoff records; **0 writes / 0 uploads / 0 Admin calls**. It cannot certify pixels, label fidelity, image quality or a reviewer’s authority; signed visual/physical review remains necessary. A legacy PNG renamed to the exact future filename is explicitly rejected.
- Existing product `media_front` and all other media references remain **null**. No synthetic fallback was introduced. Existing current-label approval/image CDN/crop/scale contracts consume real approved references later without code changes; all four signed H1s are required to activate measured scale.

## Completed C8 foundation

`data/fonts.md` and `data/production/typography-spec.json` now make a decisive selection: **IBM Plex Sans Condensed 600** for Latin names/PDP titles, **IBM Plex Sans 400/500** for Latin UI/body/claims/INCI, **IBM Plex Sans Arabic 600/400** for Arabic display/UI. The exact wordmark stays SVG. This is the selected procurement/fit specification, not a claim that the missing label font is known or that delivered files are locally licensed.

No complete licensed bilingual system is present in repo. Tooling includes a Source Code Pro Regular WOFF2 with adjacent Adobe/SIL OFL evidence; it is a monospace developer font and is not substituted for the requested display/UI/Arabic system. Inter/JetBrains Mono/codicon tooling binaries have no established matching font-specific licence evidence here. An official upstream IBM reference is documented, but no binary/licence was imported or fabricated. **Current fallback tokens are unchanged**, with no remote requests, fake font URLs, `@font-face` or preload. Exact five future filenames, role/weight mapping, licence/copyright/provenance delivery, shaping/coverage, fallback behavior and E1/E2/font-metric/CLS review are specified.

## Completed C9 foundation

`data/translation-drafts/ar-final-v5.json` and `opus-brand-pack/V12_ARABIC_TRANSLATION_WORKSHEET.md` contain **57 sourced rows** covering all four products: positioning, front promises, existing suitability, full back paragraphs, all nine label pills, Latin proper names/actives/INCI, exact label units and explicit null source gaps. Neutral interface register follows this user’s instruction. Clarity retains no suitability or pills. “Helps”, appearance qualifiers, SPF 50 and every sentence’s claim strength are preserved for review; no concentration, timeframe, testing, new efficacy or ingredient-specific benefit is added.

Every row has **customer_facing_approved: false**, empty native/regulatory reviewer slots and source provenance. The worksheet has **production_import_allowed: false** and is not read by the storefront or offline seed plan. All production Arabic product values remain null/unapproved. Functional roles are not verbatim FINAL-label fields and remain an explicit review gap rather than borrowing earlier copy; unsupported how-to, feel and formula logic also stay null. Product names, INCI and ingredient names remain Latin. Mixed-direction paragraph composition and the Arabic back/turn require review after genuine approval.

## Completed reviews and theme integration

- `data/content/reviews/review-contract.json` and `feed.schema.json`: proposed `bts_review_feed` metaobject definition with product handle and JSON snapshot, real-provider provenance/consent/moderation requirements, per-locale copy approvals and public-data limits. Definitions/entries have not been created.
- `data/content/reviews/seed.json` and dry-run `proposed_reviews`: **zero entries**. No fabricated customer review is in production data.
- `snippets/bts-reviews.liquid`, PDP integration, logical document-flow CSS and EN/AR locale strings: neutral empty state when unavailable; proof only with 5–50 complete approved authentic verified-customer records for the matching product. Reject fixture flags, wrong product, duplicate IDs, malformed/integer-out-of-range ratings, missing provider/approval/published/purchase flags and unapproved locale body/name. Derive count and average from the complete displayed snapshot; do not assert a lifetime provider count. Escape all public text, with no English body fallback in Arabic.
- No placeholder stars/counts, fake author/customer, provider CTA, or review/aggregateRating structured data is emitted without the relevant real integration. Prototype locks remain in place. More than fifty records needs later pagination/provider work.
- The sole feed fixture is `tests/fixtures/reviews.json`, with an internal-only wrapper and conspicuous **INTERNAL FIXTURE — NOT A CUSTOMER REVIEW** text. Its approval/purchase fields simulate the contract only in the local harness. No production loader/seed reads it; tests and drafts are excluded by `.shopifyignore`. Runtime fixture flags are rejected.
- `scripts/seed-metaobjects.mjs --dry-run` now proposes the review definition and an empty review plan; it remains offline and refuses write flags.
- Actual OS2.0 product/preview Page templates share the new reader. Existing shell, `content_for_header`/`content_for_layout`, localization/routes, resource drops, approved-media references and real Shopify image filters are retained. Nothing depends on serving local JSON as a production fallback. `V12_PRODUCTION_INTEGRATION.md` documents definition → real values → retrieval/render steps for a later authorized content operation.

## Executed validation

| Validation | Result / evidence |
|---|---|
| `npm run check` | **25/25 tests**, structure/JSON/references, exact label/INCI/claim/attribution/excerpt parity, price/climate, contrast, exact logo bytes and gzip gates passed. Original 19 tests retained; six production safety tests added. |
| `npm run theme-check` | **49 files, 0 offenses**, local installed Shopify CLI; no store access. |
| `npm run test:browser` | **145/145 checks, 0 failures**: original 128 EN/AR/motion/viewport/text-size cells and 17 supplemental checks, including E1’s 1,746 continuous width geometries and measured-mode stage floor. `test-results/browser-report.json` and existing fold/full captures. |
| `npm run test:production-browser` | **16/16, 0 failures**: empty/internal-only fixture review UI, EN/AR, 375×667 and 1024×768, normal and **200%** text, containment/horizontal overflow/escaping and scoped automated axe scans. `test-results/production-layer/browser-report.json` and viewport captures. |
| H1/seed dry runs | Four absent H1s reported blocked with exact filenames; no fabricated ready entries. Review definition plan, **zero review entries**, **zero Admin calls**. |
| Preservation | SHA256 comparison with pre-task snapshots: E1/E2 `bts-face.css`, `bts-face.js`, `bts-home.css`, original browser/content tests and all five production product JSON files **byte-identical**. Existing RTL, commerce, source/approval and crop/scale behavior remains exercised. |
| `git diff --check` | Passed. |

The Shopify skill `validate.mjs` was attempted and could not load its missing `@shopify/theme-check-common` dependency. It was not counted as a pass; the installed CLI successfully validated the theme. No dependencies or lockfile were changed to mask that helper failure.

These are local LiquidJS/Chrome checks and automated accessibility checks with explicit text-resize assertions, not Shopify/device/WCAG-conformance or final-asset visual/performance approval. No real media/font performance result is claimed. Real public-read/publishable metaobjects, image CDN transforms, Markets routing and Shopify scripts still need a rendered unpublished EN/AR preview.

## Exact files still needed

Obtain the cited actual FINAL-v5 source files under `opus-brand-pack/production/artwork/`: `v5 - FINAL - Cleanser - Clor.jpg`, `Reset Cleanser .pdf`, `v5 - FINAL - Serum.jpg`, `Between Two Suns - FINAL - Moisturizer Artwork.pdf`, `v5 - FINAL - Sunscreen.jpg`. Obtain native/vector counterparts from the approved final selections where available; their names/dimensions are not invented here.

Create the four required runtime files under `opus-brand-pack/production/media/`:

| Runtime H1 filename | Pack height | Required export dimensions / finish |
|---|---:|---|
| `daily-reset-cleanser-H1-FINAL-v5.webp` | 180 mm | measured silhouette width × 2400 px |
| `clarity-serum-H1-FINAL-v5.webp` | 96 mm | measured silhouette width × 2400 px |
| `daily-barrier-moisturizing-cream-H1-FINAL-v5.webp` | 116 mm | measured silhouette width × 2400 px / MATTE pump-actuator |
| `daily-defense-sunscreen-spf-50-H1-FINAL-v5.webp` | 116 mm | measured silhouette width × 2400 px / MATTE pump-actuator |

No fixed H1 width is asserted without physical/crop evidence. All exports need current artwork, family light, approved extents/contact and signed hash receipts. Optional separately named compositing/editorial/back deliveries are:

- `daily-reset-cleanser-composite-FINAL-v5.psd` and `daily-reset-cleanser-editorial-4x5-FINAL-v5.webp` — 2400×3000. `daily-reset-cleanser-social-9x16-FINAL-v5.webp` — 1800×3200. `daily-reset-cleanser-P1_BACK-FINAL-v5.webp` — measured silhouette width × 2400 px.
- `clarity-serum-composite-FINAL-v5.psd` and `clarity-serum-editorial-4x5-FINAL-v5.webp` — 2400×3000. `clarity-serum-social-9x16-FINAL-v5.webp` — 1800×3200. `clarity-serum-P1_BACK-FINAL-v5.webp` — measured silhouette width × 2400 px.
- `daily-barrier-moisturizing-cream-composite-FINAL-v5.psd` and `daily-barrier-moisturizing-cream-editorial-4x5-FINAL-v5.webp` — 2400×3000. `daily-barrier-moisturizing-cream-social-9x16-FINAL-v5.webp` — 1800×3200. `daily-barrier-moisturizing-cream-P1_BACK-FINAL-v5.webp` — measured silhouette width × 2400 px.
- `daily-defense-sunscreen-spf-50-composite-FINAL-v5.psd` and `daily-defense-sunscreen-spf-50-editorial-4x5-FINAL-v5.webp` — 2400×3000. `daily-defense-sunscreen-spf-50-social-9x16-FINAL-v5.webp` — 1800×3200. `daily-defense-sunscreen-spf-50-P1_BACK-FINAL-v5.webp` — measured silhouette width × 2400 px.

After repo licence/provenance is established, the selected typography requires flat theme files: `bts-display-latin-600.woff2`, `bts-ui-latin-400.woff2`, `bts-ui-latin-500.woff2`, `bts-arabic-600.woff2`, `bts-arabic-400.woff2`. Licence text, copyright, release/version and binary hashes must accompany them; exact evidence deliverables are specified in `data/fonts.md`. No blank licence file was created.

Arabic still needs native and regulatory signoff of the worksheet, explicit role normalization if authorized, and approved-content composition review. Reviews still need an actual verified-purchase provider adapter/data; there is no fabricated review file to “replace.”

## Next executable action

**Obtain the five cited FINAL-v5 masters, then produce the four tightly cropped H1 exports against the manifest**—with the physical packs/geometry evidence and matte shared pump finish, never old photographed labels. Fill and sign a copy of `data/production/h1-approval-receipt-template.json`, then run:

```sh
node scripts/prepare-h1-integration.mjs --dry-run --delivery opus-brand-pack/production/media --receipt /absolute/path/to/signed-h1-receipts.json
```

That yields the actual per-file integration plan without writing/uploading anything. In parallel, review the already-authored Arabic worksheet and obtain version-specific licence/binary deliveries for the selected fonts. Only after real signed assets/content exist should a separately authorized unpublished Shopify content integration/rendered preview follow. No new code architecture or synthetic concept pass is needed to start that production work.
