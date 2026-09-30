# V12 recovery — source and hosted verification

2026-09-30 UTC. Branch `build/vertical-slice`, repository `between-two-suns/storefront`. Recovery work used an isolated checkout at `/private/tmp/bts-v12-recovery` to preserve another session's concurrent documentation changes. All remote advances were retained with fast-forward updates; no merge commit or PR merge was created.

## Source truth and recovery

`V12_RECOVERY_PROVENANCE.md` records the recovered approval chain and the exact differences. The first Git V12 checkpoint is `7fd118d`; its preceding commit is V11. The signed M2 gate approves the corrected Route B with conditions, not an unconditional production release. Later placeholder-first changes were bundled into that same Git checkpoint. The starting hosted build matched the later Git composition; the approved mobile wordmark and priced desktop routine band had already diverged within that source.

Restoration commits recover the wordmark up to 200px / 52vw and the desktop priced routine offer. They retain selective Home/PDP turn, complete approved label copy, shared shelf floors and commerce baselines, the narrow-desktop two-column repair, intrinsic backs, enlarged-text behavior, sourced portrait placeholders, exact identity assets and gated locale content. No old wrong-label render, artificial approved image, new typography direction, new claim or new commerce adapter was introduced.

Opus independently reviewed the actual hosted `78dd385b705a7cad9cb086909e99c103b88b8199` build, ran the hosted fidelity command, viewed 21 actual screenshots, and returned **PASS WITH CONDITIONS**. Its full output is preserved in `V12_OPUS_RECOVERY_GATE.md`. It confirmed both restorations and requested two craft repairs: consistent sheet controls with a whole Search label, and one continuous underline for the desktop routine offer.

`92492be768d68231f7e41230885d4058caa5af96` implements those repairs and the optional Shop heading display role. Only three theme stylesheets change in that polish pass. The required evidence comes from actual Shopify hosting; no localhost or fixture server was used in this recovery. Source checks render Liquid offline and inspect CSS on a blank browser page without opening a local HTTP listener.

## GitHub-first deployment

Every intended source deployment was preceded by commit, push, remote-SHA equality and an exact Git archive export. `scripts/deploy-v12-review.mjs` now verifies the branch/repository, clean tracked tree, remote SHA, all exported bytes, required theme files, explicit unpublished target and unchanged live-role identity before uploading. It rechecks GitHub immediately before the upload. All uploads target only `166903251202` on `qfj1gi-c9.myshopify.com`, with `--strict` and without live/publish flags.

Deployment receipts are retained under ignored `test-results/v12-recovery/`, keyed by exact SHA. The `92492be` receipt verifies 221 exported files, local/remote equality and successful upload to **Between Two Suns V12 Review**, role **unpublished**, at 2026-09-30T19:49:07.525Z. Horizon `166832668930` remains the live theme.

One early failed archive extraction exceeded a command buffer. I mistakenly continued with that empty export directory; Shopify attempted to clean files from the review theme. Its protected layout/config files could not be deleted. The complete GitHub-verified `111141e` export was immediately restored, followed by successful native acceptance. The guarded deployment script prevents an empty or incomplete export reaching the upload command. A later read-only pull confirmed all 77 tracked theme files against the deployed `78dd385` source (JSON compared after Shopify's generated comment header). Subsequent native CDN validation verifies the changed polish assets. No live theme, products, metaobjects, languages or commerce settings were mutated in the incident or recovery.

## Accepted validation

| Check | Result |
|---|---|
| Source/content/label/price/climate/budget and regression checks | `npm run check`: 31/31 tests pass on the polish source. |
| Shopify Theme Check | 63 files, zero offenses on the polish source. |
| Actual hosted source/CDN verification | 11 surfaces, 14 assets, zero Liquid errors, page errors and commerce requests after `92492be`. Equivalent Shopify CSS minification and JS source-map originals are verified; SVG bytes are exact. |
| Actual hosted FRONT/BACK fidelity | 16/16 cases at 375×667, 390×844, 1024×600, 1440×900; 100%/200% text; normal/reduced motion. All four complete approved backs fit, turn remains available, info stays above commerce, and price/Add geometry is identical before/after each turn. |
| Actual hosted polish acceptance | 6/6 cases at 375×667, 390×844, 1440×900; 100%/200% text. Whole Search labels, usable input space, 44px controls without default bevels, no sheet overflow, disabled Add/checkout and existing display heading role. |
| Hosted capture coverage | 24 Home/Shop/four-PDP surface captures before the polish pass; refreshed fidelity and polish captures and settled interaction supplement after it. Shopify's own Hide bar action removes host toolbar obstruction. |
| Interaction supplement | Menu/routine/bag settle at opacity 1, open/close and return focus; native INCI opens; review sticky Add remains hidden/inert when its primary Add is disabled. |

Accepted logs are `polish-source.log`, `polish-theme.log`, `polish-native.log`, `polish-fidelity.log`, `polish-acceptance.log` and `polish-interactions.log`. Machine-readable evidence is in `test-results/v12-recovery/fidelity/index.json`, `polish/index.json`, `test-results/v12-shopify-native/remote-verification.json` and `design-review-supplement/index.json`. Original failed attempts remain distinguishable; this report does not represent those attempts as passes. The preceding Opus run and its closure run retain their raw model/tool records in ignored JSONL files.

Visual inspection covered actual mobile/desktop Home fronts/backs, all PDP identities, Shop, menu, routine, bag, enlarged text and reduced-motion states. The code/content remains review-only: Add and checkout are disabled, stale bag state is ignored, and no real commerce requests occurred.

## Opus closure

The second independent Opus invocation reviewed the actual `92492be` Shopify build, ran the hosted polish command and inspected the current captures. `V12_OPUS_RECOVERY_CLOSURE.md` preserves its full output. Verdict: **PASS WITH CONDITIONS**; both required fixes and the optional Shop heading fix are closed, Route B is preserved, and there is **no objective blocker for founder review of the placeholders**. The remaining conditions are the separate external gates below.

The final documentation commit contains the same theme source as the Opus-reviewed `92492be`. Its own exact SHA is pushed and verified before the final archive deployment; the guarded upload receipt is keyed by that final SHA.

## Separate conditions

Actual `/ar` and `/ar/collections/all` remain 404, English/LTR. Arabic hosted visual acceptance is blocked; no locale was activated and no forced-DOM locale was substituted. Approved media/crops, licensed final fonts, final color approval, authored Arabic product copy, real performance and launch configuration remain the external conditions of the signed V12 gates. The recovery does not close those production gates.
