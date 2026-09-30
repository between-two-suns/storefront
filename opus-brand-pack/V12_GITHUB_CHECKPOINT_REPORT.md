# V12 GitHub checkpoint report

Status: **PASS — stable V12 source checkpoint validated. Product release gates remain open.**

Recorded 2026-09-30 UTC. Workspace: `/tmp/bts-opus-review-repo` (physical path `/private/tmp/bts-opus-review-repo`). Branch: `build/vertical-slice`. Origin: `https://github.com/between-two-suns/storefront.git`.

## Stable tree and reconciliation

The starting source was hashed and compared again after inspection and targeted browser validation. No independent editing was observed. Staged and unstaged V12 work was reconciled without resetting or discarding intentional changes. Before the checkpoint, local HEAD and the remote branch both resolved to `e5e49c27de90f78b1695c489daed8ee8ae59189b`.

The checkpoint preserves the active V12 theme, content/contracts, production metadata, unapproved translation drafts, brand/review documents, package manifest/lockfile, development tools, regression tests and legacy source archive. Review fallbacks use Shopify's top-level `metaobjects` drop, remain scoped to missing content/config in unpublished theme `166903251202`, and normalize captured scalar values and product-handle lists before blank checks and lookups. Display amounts remain config-derived; draft-safe Add controls and launch checkout gates are retained.

The earlier Arabic enlarged-text and EN/AR no-JS failures occurred during a changing-tree validation attempt. The reconciled source passed the isolated three-check retry. Final full validation separately confirms `home-ar-390x844-text-200-reduce`, `no-JS en` and `no-JS ar`: all four product reservations render, navigation works without JavaScript and native INCI disclosures remain usable. No Arabic product-copy approval was inferred.

The prior 21 Theme Check warnings were resolved by preserved snippet argument/doc corrections, optional price-helper parameters, unused-value cleanup and generated per-product field snippets replacing one overly complex fallback. The recommended check configuration was retained without new suppressions. Final result: **63 files, zero warnings, zero errors**.

Two test-harness repairs were added: LiquidJS caches parsed immutable snippets within each fixture render, without caching content/drop values; visible-suite navigation and screenshot capture allow 30 seconds while interaction assertions retain seven seconds. Failed diagnostic screenshots no longer abort unrelated workers or hide the original assertion failure. README screenshot paths and the nonexistent native-review report reference were corrected.

## One unchanged final validation tree

The final tree was frozen at **2026-09-30T17:11:21.485556+00:00**. Final commands ran sequentially and finished at **2026-09-30T17:40:47.775046+00:00**. Before/after SHA-256 manifests were identical for all **210 tracked files**. Index/worktree parity passed. Only this report was finalized afterward; validated source, tests, assets, configuration and other docs were unchanged.

The content-manifest SHA-256 for the **209 files excluding this report** is:

`e909677873cbb89580b63490359d3fede444049c4528ac2b8800a8aee8845c4f`

Reproduce the fingerprint from the checkpoint working tree:

```sh
python3 - <<'PY'
import hashlib, json, pathlib, subprocess
paths = subprocess.check_output(['git', 'ls-files', '-z']).decode().split('\0')
state = {p: hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()
         for p in paths if p and p != 'opus-brand-pack/V12_GITHUB_CHECKPOINT_REPORT.md'}
print(hashlib.sha256(json.dumps(state, sort_keys=True, separators=(',', ':')).encode()).hexdigest())
PY
```

Environment: Node v24.14.0, npm 11.9.0, Chrome 154.0.8037.58. `npm ci` installed 168 packages with zero reported vulnerabilities before the final freeze.

| Final check | Result |
|---|---|
| `npm run check` | PASS: all source gates and **29/29 Node tests**. |
| `npm run theme-check` | PASS: **63 files, zero offenses**. |
| `BTS_BROWSER_CAPTURE=0 npm run test:browser` | PASS: **145 checks**, including 128 primary cells, 1,746 live resize geometries and supplementary checks. Only optional screenshots were disabled. |
| `npm run test:visible-storefront` | PASS: **194 checks** (192 matrix cells plus EN/AR no-JS), zero failures; screenshots enabled. |
| `npm run test:production-browser` | PASS: **16 checks**, zero failures. |
| `node tests/placeholder-geometry.mjs` | PASS: **72 checks**, zero failures; maximum source-swap geometry delta **0 px**. |
| `node tests/live-touch-journeys.mjs` | PASS: **4 checks**, zero failures. |
| `npm run test:perf` | Completed all **3 local Lighthouse smokes**; measurements below. |
| `node scripts/seed-metaobjects.mjs --dry-run` | PASS: offline plan, zero Admin calls. |
| `node scripts/prepare-h1-integration.mjs --dry-run` | PASS: offline blocker/integration plan; missing deliveries remain blocked, zero uploads/writes/Admin calls. |
| `node scripts/build-review-fallback.mjs --check` | PASS: generated runtime source matches seeds/config. |
| Final index checks | PASS: whitespace, source parity, generated/credential path exclusions and secret-pattern scan. |

Total: **29 Node tests and 431 browser checks passed**. Earlier parallel/short-timeout attempts were interrupted. After the harness repairs, every relevant command was rerun on the final unchanged tree; earlier attempts are not checkpoint acceptance evidence.

The visible and touch suites used `npm run preview:local` at `http://127.0.0.1:8787`. Browser tests use local LiquidJS Shopify stand-ins. Synthetic media/geometry and internal reviews remain test-only. `tests/shopify-native-review.mjs` is retained as source but was not executed; native Shopify review requires a later authorized step.

| Local Lighthouse surface | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home EN | 99 | 100 | 100 | 61 | 1.77 s | 0 | 0 ms |
| PDP EN | 100 | 100 | 100 | 61 | 1.38 s | 0 | 0 ms |
| Home AR | 99 | 100 | 100 | 61 | 1.74 s | 0 | 58 ms |

These are fixture measurements without approved H1 media, production fonts or Shopify scripts. The smoke script has no production performance/SEO threshold gate; no production acceptance is claimed.

## Included and excluded material

Legacy v5–v11 source and the archived v11 selector fix remain under `archive/v5-v11/`. Intentional active old-label raster deletions are preserved; original tracked binaries remain recoverable from pre-V12 history. Local quarantined copies were not deleted. The hash-pinned, unwired Barrier interim and four historical brand-pack product references remain source/test inputs. The cleanser reference is required by the H1 rejection regression. None is approved H1 or a missing-media fallback. No newly added file exceeds 1 MB.

Generated theme-local fallback snippets are reproducible runtime source paired with their generator/parity gate. Generated test output is excluded. `.gitignore` excludes dependencies, all test results/screenshots/reports/coverage, local historical captures, quarantined archive PNG/WebP files, credentials, Shopify CLI state, private-key formats, logs and temporary/editor files. `.shopifyignore` retains development/brand/credential exclusions for any future separately authorized upload. No generated test output or credentials are staged.

Local evidence remains in ignored `test-results/v12-checkpoint-*.log`, `test-results/v12-checkpoint-final-suites.json`, `test-results/v12-checkpoint-validation-tree.json`, `test-results/browser-report.json`, `test-results/production-layer/`, `test-results/v12-post-opus-live/` and `test-results/lighthouse-*.json`.

## GitHub identity and publication receipt

The checkpoint identity is the commit containing this report. Its exact SHA and post-push remote equality receipt are recorded in the completion message and local Git output, rather than embedded self-referentially in the commit. The validated content fingerprint above independently identifies its reproducible source.

Publish only this branch and verify exact local/remote equality and a clean tracked tree:

```sh
git push origin HEAD:refs/heads/build/vertical-slice
git rev-parse HEAD
git ls-remote --heads origin refs/heads/build/vertical-slice
git status --porcelain
```

No branch merge, Shopify upload, publish, Admin mutation or live-theme change was performed. Shopify CLI was used only for local Theme Check.

Approved H1 photography/crops, licensed bilingual fonts, approved Arabic product copy, color approval and native Shopify/device/commerce/performance QA remain release gates. This GitHub source checkpoint does not close them.
