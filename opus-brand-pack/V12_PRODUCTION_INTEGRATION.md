# V12 production integration handoff

This is local preparation of the actual Online Store 2.0 theme, not a hosted Shopify preview. No theme upload, app installation, Files upload, product edit, Admin call or publication has happened. FRONT/BACK and all E1/E2 production layout behavior remain in place.

The governing read order is `V12_OPUS_M2_FINAL_GATE.md`, `V12_CODEX_E1_E2_REPORT.md`, `V12_H1_PRODUCTION_BRIEF.md` and `FINAL_LABEL_SOURCE_OF_TRUTH.md`. Earlier M2 gates/rereviews and Codex reports establish C1–C6/D1–D9; final-gate §4 overrides V11 padded H1 framing and older synthetic/sample review plans. The current user authorizes an honest empty reviews state. FINAL-v5 controls every label word and INCI; physical evidence controls geometry/finish only.

## C7 delivery

The exact specifications and per-SKU delivery filenames are in `data/production/h1-manifest.json`. Required runtime exports in `opus-brand-pack/production/media/`:

- `daily-reset-cleanser-H1-FINAL-v5.webp` — 180 mm pack.
- `clarity-serum-H1-FINAL-v5.webp` — 96 mm pack.
- `daily-barrier-moisturizing-cream-H1-FINAL-v5.webp` — 116 mm pack, matte pump/actuator.
- `daily-defense-sunscreen-spf-50-H1-FINAL-v5.webp` — same 116 mm bottle, matte pump/actuator.

Each H1 is a genuine sRGB WebP, **2400 px high**, with width calculated from the actual tight silhouette aspect ratio and recorded in the receipt. Physical pack width is not sourced; inventing a fixed 4:5 H1 canvas would introduce padding and falsify measured mode. All four silhouette edges must meet the frame, contact at row 2399; no clipped cap/pump, no cast-shadow/transparent padding. Keep one lens/camera/distance/lighting setup and matte finish. Separate editorial exports are exactly **2400×3000** and **1800×3200**; never feed these padded crops into measured H1. A layered 2400×3000 composition master and 2400-high tight P1_BACK capture are separately named per SKU in the manifest.

The missing original source files, cited in FINAL label documentation, must be obtained and retained under `opus-brand-pack/production/artwork/`:

- `v5 - FINAL - Cleanser - Clor.jpg` and `Reset Cleanser .pdf`; final Figma selection `v5 - FINAL - Cleanser - Clor` is cited but no local Figma master exists.
- `v5 - FINAL - Serum.jpg`.
- `Between Two Suns - FINAL - Moisturizer Artwork.pdf`.
- `v5 - FINAL - Sunscreen.jpg`.

Use approved native/vector masters where available; retain original hashes and raster exports, not reconstructed typography. The repo contains none of these files. Four exact logo/icon SVGs are safe existing identity sources and already byte-identical in `assets/`. FINAL label text is reusable for parity checks. Temporary product images are 1024×1536 PNG data misnamed `.webp`, not source artwork; their label/closure problems and hashes are recorded in `data/production/asset-audit.json`. The Barrier interim remains hash-pinned and unwired. Archive/reference screenshots and old photographed Cleanser/Serum labels are never label truth.

Photography of actual FINAL-v5 packs is preferred. For a generated/composited delivery, the exact approved label must be a separate locked source layer, correctly wrapped over verified physical geometry, and all generated text removed. Approval must independently confirm FINAL-v5 currency, physical geometry, print colour, matte pump/actuator and crop. Existing temporary renders cannot substitute for this step. No unverified digital Pantone conversion or reconstructed artwork is authorized by the delivery spec.

Copy `data/production/h1-approval-receipt-template.json` to a working receipt, fill actual output/source hashes and silhouette measurements, and get separate reviewer/date/signoff records. Run:

```sh
node scripts/prepare-h1-integration.mjs --dry-run
node scripts/prepare-h1-integration.mjs --dry-run --delivery opus-brand-pack/production/media --receipt /absolute/path/to/signed-h1-receipts.json
```

The script only reads files and reports a plan. It validates genuine WebP dimensions, source retention/hash, output hash, current label, sourced height, tight extents/contact and human signoff fields. It cannot establish visual truth, decode image quality or independently verify a reviewer's authority; these are human production signoffs, not boolean substitutes for them. It never writes references, uploads or calls Admin. The default missing-asset run is expected to report all four blocked.

For a later explicitly authorized Shopify integration: first establish `bts_media`/`bts_product_content` definitions from the offline contracts; then upload the four signed files to Shopify Files; upsert matching `bts_media` entries with real file GIDs, role H1, FINAL-v5, signed approval/crop approval and null/unapproved alt (proper-name fallback is safe); link real media GIDs into each product-content `media_front`; finally retrieve/render the entries on an unpublished preview. No product publication or product record edit is needed for the existing metaobject preview path. Image `file_reference.value` flows through real `image_url`/`image_tag` responsive transforms. Do not replace this with a local JSON/filename fallback. All four approved crops plus the already sourced heights enable measured mode automatically, without code changes.

## C8 typography

`data/fonts.md` and `data/production/typography-spec.json` select exact roles, five future WOFF2 filenames, licence-evidence delivery, fallback and metric/locale QA. No complete licensed bilingual font system is available in repo. The tooling's licensed Source Code Pro is intentionally not selected as skincare display/UI/Arabic typography. Existing fallback tokens stay active. The selected IBM fonts require local version-specific licence/provenance and fit review before integration; an upstream link is not a delivered-file licence record.

## C9 translation

`V12_ARABIC_TRANSLATION_WORKSHEET.md` and `data/translation-drafts/ar-final-v5.json` contain the complete four-SKU label-derived draft, neutral address, unchanged Latin names/actives/INCI and exact artwork units. Native and regulatory reviewer slots are empty, all customer-facing approvals false, and production import disabled. Clarity suitability/claim pills remain absent. Roles have no verbatim field in FINAL label truth and remain an explicit review gap; texture/how-to/formula logic remain null. `does` uses the same eventual approved promise and must not acquire another claim.

Do not seed the worksheet. After both reviews, copy only signed rows into corresponding `translations.*.ar`/claim-label envelopes and flip their per-locale approval deliberately. Keep any unsigned production field null. Product names and INCI stay Latin/bidi-isolated; paragraph ingredient names also remain Latin and require mixed-direction visual review. Arabic back/turn, line breaks and 200% fit must be reviewed once real approved content exists.

## Review feed

`data/content/reviews/review-contract.json` proposes a merchant-owned `bts_review_feed` metaobject with `product_handle` and JSON `feed`; `feed.schema.json` specifies its envelope and records. This is a theme contract, not a scaffolded app. No definition or entry has been created. `seed.json` and the offline seed plan contain **zero review entries**.

A real provider integration must establish definitions first, validate purchase provenance/publication consent/moderation and locale text, then write only authentic signed snapshots, then retrieve via `shop.metaobjects.bts_review_feed[product_handle].feed.value`. Private purchase evidence stays with the provider. Do not write examples or pretend flags alone prove authenticity. The theme requires matching product, provider, version, approvals, non-fixture verified-customer records, unique IDs, integer ratings and locale-approved nonempty name/body. Malformed/unapproved feeds or fewer than five / more than fifty records show the neutral empty message, with no stars, rating, count, review-shaped placeholder or aggregateRating. The bounded snapshot's count/average are computed from all records actually displayed; no lifetime totals are invented. More than fifty requires a future paginated provider adapter.

`snippets/bts-reviews.liquid` is rendered below PDP proof on actual product and existing preview-Page templates. EN/AR empty strings are server-rendered through locales. Valid data is escaped and uses document flow/logical CSS. There is no write-review CTA until a real provider endpoint exists. Structured ratings remain absent because the theme is still locked to prototype commerce. The old no-empty-state gate is superseded by this user's explicit request; the real-only proof threshold remains five.

The sole mock feed is under `tests/fixtures/reviews.json`, with an internal-only wrapper and conspicuously marked names/bodies. Its payload simulates provider flags solely to test acceptance/escaping in the local LiquidJS harness; that is not genuine verification. Runtime fixture flags are rejected. No theme path or seed loader reads this file, and `.shopifyignore` excludes all tests/drafts/contracts from upload.

## Real rendering gate

The local OS2.0 theme still uses one shell with `content_for_header`/`content_for_layout`, JSON templates, real resource drops/routes, localization form, content/media approvals and responsive Shopify image filters. Theme Check validates this source locally. Until definitions/entries/files exist, omitted media and the honest empty review state render correctly without fabricated fallbacks. Prototype checkout/noindex locks remain intentional.

A local fixture is not Shopify proof: real metaobject public-read/publishable status, image CDN, `routes`, Markets language routing, Shopify scripts, native iOS/Android text size and final-font metrics remain to verify on a later unpublished rendered preview. No upload/publish/Admin action is included here.
