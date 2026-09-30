# BETWEEN TWO SUNS — V12 OPUS M2 RE-REVIEW (post-Codex correction)
Reviewer: Claude Opus (creative director) · 2026-09-30 · Branch: `build/vertical-slice`
Scope: strict visual/creative re-gate of the corrected M2 vertical slice against `V12_OPUS_M2_GATE.md` (B1–B5, P1–P14) and `V12_CODEX_M2_FIX_REPORT.md`. Not a new concept exercise. C1–C6 remain signed off and were checked only for regression.

Runtime I executed myself for this re-review (no code or content was modified):
- `npm run check` — 17/17 tests, plus structure/JSON/reference, money, label/INCI/claim/**attribution**, price-literal, climate, logo, contrast and gzip gates. All pass.
- `shopify theme check` — 48 files, 0 offenses.
- `npm run test:browser` — 44/44 cells, 0 failures, on my machine, not just from the report.
- Read-only Playwright probes of my own over the repo fixture at viewport geometries the suite does **not** cover (1440×768, 1366×640, 1280×720, 667×375, 844×390) and in measured (`?scale=1`) mode.
- Visual inspection of all 24 captures in `test-results/screenshots/`.

---

## Verdict: **PASS WITH CONDITIONS**

B1–B5 and the actionable polish were genuinely fixed — not papered over — and I found no regression in C1–C6. The three things that made the first gate a FAIL are gone: desktop commerce is above the fold on one shared baseline, Arabic renders the packshot, and the back face no longer prints the front's sentence or a single unsubstantiated ingredient attribution. The routine and search surfaces exist and lead somewhere. That is real progress and the substrate remains the best work on this project.

The conditions are not stylistic. One of them (D1) is a regression introduced by this fix pass that must be closed before any founder-facing link, because on a mainstream laptop viewport the product photograph shrinks to a thumbnail and the FRONT/BACK signature disappears entirely. The rest are craft and verification-honesty defects that are each a small, exact change.

I am explicitly **not** approving founder-readiness. C7 photography, C8 typography, C9 Arabic product copy and address, and a rendered Shopify preview remain hard external gates, and every visual judgement below is bounded by a fixture image that is, by design, not a product.

---

## 1. B1–B5 verification

### B1 — Desktop composition and pack scale · **FIXED at the specified geometry**
Verified at 1440×900 from my own run, not the report's table:

| | Reset | Clarity | Barrier | Defense |
|---|---|---|---|---|
| stage | 236.8 × 300 | 236.8 × 300 | 236.8 × 300 | 236.8 × 300 |
| stage floor | 690.8 | 690.8 | 690.8 | 690.8 |
| buy-row top / bottom | 826.8 / 878.8 | 826.8 / 878.8 | 826.8 / 878.8 | 826.8 / 878.8 |

All four prices and Adds are inside a 900 px viewport; all four buy rows share one baseline to within 1 px; all four packs stand on one floor. The arbitrary `1.15fr .75fr 1.1fr 1fr` tracks and the 84/32/60 px card stagger are gone, replaced by four equal tracks, a shared floor and a fixed 136 px info block. The Clarity-renders-35 %-smaller-than-Reset defect is gone.

The band I asked for is built and is the single biggest change in the page's character: a 280 px editorial wordmark inline-start, "fresh skin. always." and a config-sourced `All four · EGP 1,661 · Save EGP 185 →` with an Add all four inline-end. With the turn disabled, the desktop Home is now a wordmark, a promise, a routine offer and four packs on a shelf line — recognisably this brand, not Dawn. **Re-review item 8: yes on desktop at 1440×900.** See D1 for where that answer flips back to no.

Physical scale is handled correctly and honestly. `pack_height_mm` and `pack_height_source` exist on the contract, are **null** on all four seeds, and the shelf therefore runs in `data-pack-scale="neutral"` with equal capped tracks and no estimated dimensions. Measured mode is real: I ran `?scale=1` and confirmed one shared `--pf-unit` across all four stages (spread < 0.001 px/mm), the tallest pack at the cap, and a common floor. I could not and did not verify true relative proportion of the actual packs — that is C7.

### B2 — Arabic product photography · **FIXED**
`snippets/bts-media.liquid:10-12` now gates the `<img>` on file approval + role + image type + current label version only, and resolves alt as approved locale text → otherwise the Latin proper name, never an English descriptive sentence. The AR assertion at `tests/browser.mjs:56` was inverted correctly: AR Home now asserts 4 `.pf__stage img` (EN asserts 8 — four packshots plus four back-face wordmarks). The AR captures at 375/390/430/1440 show a full card, not the collapsed text row I measured last time. AR still correctly has no turn control, because `back_description.ar` is unapproved.

### B3 — Back-face truthfulness · **FIXED, and fixed the right way**
`promise === does` no longer matters, because `does` is rendered nowhere. The back now leads with the approved `suitability` line, then the first sentence of the approved `back_description`, then label pills, then Full INCI. Verified per SKU that no back sentence appears on the front:

| SKU | front promise | back opening |
|---|---|---|
| Reset | Removes oil. Maintains hydration. Feels fresh. | For Oily to Combination Skin / A daily gel cleanser with Zinc PCA, Panthenol and Centella. |
| Clarity | Controls oil. Evens skin tone. Hydrates. | *(no suitability)* / A daily serum with Niacinamide, Tranexamic Acid and Hyaluronic Acid. |
| Barrier | Strengthens skin barrier. Controls oil. Lightweight. | For Oily to Combination Skin / A daily moisturizer with Ceramides, Niacinamide and Zinc PCA. |
| Defense | Invisible. Lightweight. Fast-absorbing. | For All Skin Types / A daily SPF 50 sunscreen with Niacinamide, Panthenol and Bisabolol. |

All twelve `key_ingredients[].why` values are null with `approved.en: false` and `attribution_approved: false` — including Clarity's, which were the plausible ones. `feels_like` and `formula_logic` are null on all four. "Niacinamide → lightweight", "Bisabolol → no white cast" are gone.

The attribution rule is implemented as specified at `scripts/check-label-parity.mjs:30-36`: a non-null `why` must be approved, be an exact ≤80-char excerpt of the label block, **and** appear in a label sentence that names that ingredient, or carry explicit `attribution_approved: true`. There is a regression test that rejects a genuine formula sentence attached to a single ingredient. Provenance is now attribution. This is the finding I cared most about and it is closed properly. `50 gm` matches the artwork (P11).

### B4 — Mobile commerce line · **FIXED at the tested geometries, with a new hole (D1)**
`.pf__buy` bottom is inside the initial viewport in every cell of the suite: 653.2/667 EN and 656.4/667 AR at 375; 751.3/844 and 754.5/844 at 390; and the 2:3 adverse-crop cell is asserted separately. The prototype marker is now static and outside the sticky wrapper; the header measures exactly 52 px. The clamp exists.

It is achieved by a formula with no lower bound, which is D1.

### B5 — Routine and Search · **FIXED**
`templates/page.json`, `page.routine.json`, `search.json`, `search.routine.json` and their sections exist. `snippets/bts-routine-url.liquid` resolves to a real routine Page when one exists and otherwise to the native `/search?view=routine` alternate template, so nothing depends on an Admin-created Page. The Home routine strip renders at every viewport in both locales (I can see it in all 24 captures), opens a sheet with exactly one bundle Add, and keeps a real href for no-JS. The offer is fully derived and self-verifying — `snippets/bts-routine-offer.liquid:13-25` recomputes the list from component prices and hides the whole offer unless `list = Σ components` and `save = list − bundle`. The approved `save: 185` now reaches five screens. Search posts `q` to `routes.search_url` and filters approved proper names server-side, so it works with draft products and without JS. No price literal anywhere.

### Polish
P1, P2, P3, P4, P5, P6, P7, P9, P11, P12, P13, P14 are all done as specified and I verified each in the source. P8 is done in the letter but not the spirit — see D6. P10 was correctly recorded as a deliberate decision rather than changed. The ten Arabic chrome strings are authored in neutral interface nouns with no address decision taken, which is exactly right.

### C1–C6 regression check · **clean**
Turn gating still `variant == 'shelf' or 'pdp'`; collection and routine pages use `variant: 'grid'`; compact surfaces have no stage. Commerce still lives outside `.pf__stage` and the suite still asserts the Add bounding box and price string are byte-identical across a turn. One money pattern from locales, asserted equal between Liquid and JS. Media still fails closed on absent and stale labels. Header is 52 px. Contrast, gzip and price-literal gates all pass.

---

## 2. Genuine remaining implementation defects

These are Codex's to fix. None depend on C7–C9.

### D1 — **Blocking.** The stage cap has no floor: on common short viewports the pack collapses to a sliver and the FRONT/BACK signature is removed
`assets/bts-face.css:6` sets `--pf-cap: min(420px, 100svh - 360px)` and `assets/bts-home.css` overrides it to `min(360px, 100svh - 600px)` on desktop. Both are linear in viewport height with no lower bound, and the suite only tests 667/844/932/900 — the four heights where the formula happens to be benign. Measured by me on the repo's own fixture:

| viewport | stage | back overflows | Turn control |
|---|---|---|---|
| 1440×900 | 236.8 × 300 | no | visible |
| 1440×768 | 132.6 × 168 | yes (354 in 168) | **hidden on all four** |
| 1280×720 | 94.7 × 120 | yes | **hidden on all four** |
| 1366×640 | 31.6 × **40** | yes (497 in 40) | **hidden on all four** |
| 667×375 (phone landscape) | 11.8 × **15** | yes (490 in 24) | **hidden on all four** |

On a 1366×768 laptop — after browser chrome, roughly a 640 px viewport — the flagship product photograph renders 40 px tall and every Turn over button is suppressed by the P1 overflow guard. The page degrades to exactly the four-card text grid the independent review predicted, involuntarily, on hardware a large share of Egyptian desktop traffic uses. Phone landscape is worse.

The buy-row assertion still passes in all of these, which is the tell: the fit was bought by shrinking the product toward zero rather than by budgeting the composition. My own B4 wording gave the formula without a floor; that is on me, but it has to be closed now.

**Fix.**
1. Floor both caps and make the shortfall come out of the band, not the product. Base: `--pf-cap: clamp(200px, 100svh - 360px, 420px)`. Desktop `.bts-shelf`: `--pf-cap: clamp(220px, 100svh - 600px, 360px)`.
2. Give the desktop band a viewport-relative height so it yields first: `block-size: clamp(120px, 100svh - 620px, 280px)` on `.bts-home__band`, with `.bts-home__brand img { block-size: 100% }`. The wordmark should shrink before the pack does.
3. Accept that at very short viewports the buy row moves below the fold rather than the product vanishing. Change the suite's assertion accordingly: assert `.pf__buy` bottom ≤ viewport height **only where `100svh ≥ 620px`**, and at shorter heights assert instead that the stage is ≥ 200 px and the Turn control is visible.

### D2 — The browser matrix codifies only the safe geometries
Four portrait viewports × 2 locales × 2 motion modes is 32 cells that all avoid D1. A composition guard that only holds at the heights it was tuned for is not a guard.

**Fix.** Add cells at **1440×768**, **1366×640** and **667×375** (landscape), EN and AR, asserting: `.pf__stage` height ≥ 200 px; `[data-part="turn"]` visible in EN; `data-back-overflow === "false"`; and no horizontal overflow. These four assertions fail today and will keep D1 from returning.

### D3 — The 24 screenshots cannot show the composition they were added to prove
`tests/browser.mjs:20` serves the fixture as a `#f7f7f5` rectangle on a `#f7f7f5` ground. In every capture the pack area is indistinguishable from the page — four blank columns with an 8 px "Contract fixture only" caption. The artefact I asked for in §4 of the gate exists but is blind exactly where B1 lives. Three further gaps: captures are `fullPage: true`, so the 900 px fold the whole B1 argument turns on is not visible in any image; there is no capture of measured mode (`?scale=1`), which is the one place the proportion mechanic could be shown even synthetically; and only Reset's back is captured, so Clarity's back — the thinnest of the four — has never been looked at.

**Fix.** Keep the fixture explicitly synthetic but make it legible: a mid-grey (`#b9b9b4`) silhouette on a transparent field, with the wordmark-free caption retained so it can never be mistaken for product. Capture each cell twice — `fullPage: false` (the fold) and `fullPage: true`. Add one `?scale=1&media=1` capture at 1440×900. Capture the back of all four SKUs at 375 and 1440, not just the first.

### D4 — `100cqw` double-subtracts the shelf padding
`assets/bts-home.css` computes the track width as `(100cqw - 3 * var(--pf-gap) - 2 * var(--gutter)) / 4`. `container-type: inline-size` on `.bts-shelf` makes `cqw` resolve against the container's **content box**, which already excludes the element's own `padding-inline: var(--gutter)`. I verified this directly: a 1440 px container with 40 px inline padding gives `100cqw = 1360`. The gutter is therefore subtracted twice, shrinking every column by `var(--gutter) / 2` — 20 px at 1440. The height cap currently binds first, so it does not show at the tested geometries, but it will silently under-scale `--pf-unit` in measured mode on any wider-than-tall pack, which is the one place the number has to be right.

**Fix.** Drop `- 2 * var(--gutter)` from both the neutral `block-size` and the `--pf-unit` expressions.

### D5 — The 136 px info block is applied to the PDP, where it only makes a void
`assets/bts-face.css:26` scopes the fixed info height to `shelf` **and** `pdp`. The PDP has one card and nothing to align against, so on desktop the block opens a ~180 px gap between the promise and the price — clearly visible in `pdp-en-1440.png`, where "Removes oil. Maintains hydration. Feels fresh." ends at y≈247 and `EGP 399` starts at y≈435. Separately, the fixed block has no overflow guard: a name and promise that exceed 136 px will overlap the buy row rather than push it, and nothing tests for it.

**Fix.** Scope the rule to `.pf[data-variant="shelf"] .pf__info` only. On the shelf, add a dev assertion mirroring the `.pf__back` ResizeObserver (`data-info-overflow` + `console.assert` under `?bts_debug=1`) and assert `data-info-overflow === "false"` in the suite, measured in AR at 375 where the budget is tightest.

### D6 — The wordmark hierarchy is inverted: the footer sign-off outranks the brand moment
`.bts-footer__wordmark` is `inline-size: min(360px, 80vw)`. On desktop Home that renders ~360 px wide against the band's ~324 px, and on mobile Home it renders ~300 px against a **64 px** band mark. The page's largest, most confident instance of the identity is in the footer, under the nav links, on every template. P8 asked for a controlled wordmark moment on mobile Home; a 64 px stamp under a 300 px footer mark is not control, it is the inverse of it — and the standing direction on this brand is to control where the tall wordmark appears, not to demote it.

**Fix.** Make the Home band the dominant instance and the footer a sign-off. `.bts-home__brand img { inline-size: min(200px, 52vw) }` below 990 px (unchanged 280 px block-size above it), and `.bts-footer__wordmark { inline-size: min(160px, 44vw) }`. One large wordmark per page, at the top.

### D7 — The back-face excerpt is generated by a naive Liquid split with no parity guard
`snippets/bts-product-back.liquid:11` renders `description | split: '.' | first` + `'.'` on the face. It is verbatim for all four current descriptions, but nothing validates that: any approved description containing a non-terminal period (`pH 5.5`, `SPF 50+ / UVA.`, an abbreviation) would render a truncated, altered sentence on a regulated claims surface, and `check-label-parity.mjs` would not notice — it validates the full field, not the rendered excerpt. Related, and visible in the captures: the sentence the face shows is the *ingredient-naming* one, so the back's payoff is a list of three ingredients plus pills, with substantial empty space below it (see `home-en-375-back.png`). Clarity is the acid test — no `suitability` (empty and unapproved) and `claims: []` — so turning Clarity over reveals one sentence and a Full INCI link.

**Fix.** Two parts, both small.
1. Add a parity assertion: the rendered excerpt (`back_description.en.split('.')[0] + '.'`) must be a verbatim prefix of the approved description and the description must contain no non-terminal `.`; fail the build otherwise. Better still, store an explicit approved `back_excerpt` field and require exact-substring parity against the label.
2. There is room on the face for both approved sentences at 14 px — render the full `back_description` on the shelf face, not just the first sentence, and let the D2/P1 overflow assertion prove the fit. That closes the payoff problem without authoring a word of new copy. Clarity's missing suitability line is a content question for the founder (§3), not an implementation defect.

### D8 — Header search and menu are bare text glyphs
`sections/bts-header.liquid:3,10` render `≡` and `⌕` as literal characters. `⌕` (U+2315) is absent from most system font stacks; in this repo's own captures it renders as an unrecognisable fallback glyph next to the `ع` language switch. With C8 unresolved the substitution is unpredictable per device, and it sits in the 52 px row that carries the whole brand on mobile.

**Fix.** Replace both with inline SVG (or the existing asset pipeline), keeping the `aria-label`s exactly as they are.

### D9 — The Routine and Search pages are unstyled engineering stubs
`sections/bts-routine.liquid` and `sections/bts-search.liquid` render an `<h1>`, a bare form or list, and `variant: 'grid'` faces inside a 760 px `.bts-foundation` column. Turn gating is correct, and as a no-JS fallback this is fine. But `snippets/bts-routine-link.liquid` points the header and footer "Routine" nav at this page for **all** users, so the founder's AOV surface — reached from global nav on every template — is currently a raw list. The routine *sheet* is the specified M2 deliverable and it works; the page it backs is not designed.

**Fix.** Either art-direct the routine page against the shelf's language (band, four faces on one floor, one bundle Add — it can reuse `bts-home.css`), or point the header/footer nav at the Home routine strip anchor and reserve the page URL for the no-JS/route fallback it was built to be. Do not leave global nav pointing at `.bts-foundation`.

---

## 3. External asset and release dependencies — not implementation defects

Nothing below is Codex's to fix, and none of it can be closed by more engineering.

1. **C7 — real H1 photography and real pack measurements.** All four `media_front` are null; `pack_height_mm` and `pack_height_source` are null with an explicit note that no estimate was seeded, which is the correct call. Until the studio day lands: true relative proportion is unverifiable (I verified the *mechanism*, not the packs); crop, contact point and how the pack sits on the shelf floor are unverifiable; the FRONT/BACK interaction does not render in the real theme at all, because `can_turn && image != blank` is false without H1; and LCP is an SVG rectangle, so the Lighthouse 100s must not be quoted as release evidence. `pack_crop_approved` is a good addition and is correctly unseeded.
2. **C8 — licensed typography.** No `@font-face`. `--font-display` is still Arial Narrow and Arabic is Arial. Every typographic judgement in this document, mine included, is provisional. The tall condensed wordmark survives only as an SVG asset; the product names that are supposed to carry it are a system fallback.
3. **C9 — founder-approved Arabic product copy and address.** The ten chrome strings are authored and neutral, which unblocks navigation. But the Arabic storefront still carries **no product copy at all**: `promise`, `suitability`, `back_description`, `role` are null in AR, so the AR cards show a name, a size, a price and an Add and nothing else, and there is no Arabic back face. That is the correct fail-closed behaviour and it is also not a shippable Arabic storefront. The feminine-vs-neutral address decision is still open.
4. **A rendered Shopify preview in EN and AR.** Everything above — mine and Codex's — is LiquidJS with Shopify stand-ins. `content_for_header`, real `routes.*`, real image CDN transforms, real metaobject resolution and real locale routing have never executed. No claim in this document survives contact with a real preview untested.
5. **Content questions for the founder, not for code.** Clarity has no approved `suitability` line and no approved back pills, which is why its back face is the thinnest of the four. Confirm whether the Clarity artwork genuinely carries no suitability statement; if it does, seed it. Likewise the four `feels_like` texture lines remain unauthored by choice — that is the right restraint, but the back face will read better once one approved texture line exists per SKU.

---

## 4. What can and cannot be approved on synthetic fixtures

**Can pass now, and did:** claim provenance and ingredient attribution; the money contract; fail-closed media on absent and stale labels; turn gating by surface; commerce immobility across a turn; `aria-pressed`/`inert`/focus-return behaviour; reduced-motion crossfade; RTL non-mirroring of photography; AR image presence and proper-name alt; buy-row position at the tested geometries; shared baseline and shared floor; the measured-scale *algorithm*; routine offer arithmetic and its fail-closed hiding; server-rendered search; no-JS degradation; axe WCAG 2.2 AA on main and bag; gzip budgets; theme-check.

**Cannot be approved until C7/C8/C9 and a rendered preview:** whether the four packs read as one family at true relative scale; whether the crop, floor and contact shadow read as photography rather than as cards; whether the turn is beautiful rather than merely correct; whether the back face's colour fields hold against a real packshot; every type judgement; the entire Arabic product experience; LCP, CLS and real performance; and whether the desktop PDP composition works, which I am still deferring to C7 as agreed at P13.

---

## 5. What I will check on the next pass

1. D1 closed: at 1440×768, 1366×640 and 667×375, the stage is ≥ 200 px, the back does not overflow, and the Turn control is visible — asserted in the suite (D2).
2. D3 closed: a legible fixture, fold-height captures, a measured-mode capture, and backs captured for all four SKUs.
3. D4–D9 closed.
4. C7 landed: real H1 for four SKUs, sourced dieline heights with `pack_height_source`, `pack_crop_approved` true, shelf in `measured` mode — and then the real answer to B1's proportion question.
5. C8 landed: self-hosted display, UI and Arabic faces.
6. C9 landed: founder's address decision and approved Arabic product fields, with a real Arabic back face.
7. A rendered Shopify preview in EN and AR, re-measured at all of the above viewports.
8. With the turn disabled, the Home page is still recognisably BETWEEN TWO SUNS — **at every viewport**, not only at 1440×900.

Item 8 is again the one that decides it. Today the answer is yes at 1440×900 and 375/390/430, and no at 1440×768 and below. Fix D1 and it is yes everywhere.

---

**Gate result: PASS WITH CONDITIONS.** B1–B5 and the polish are genuinely repaired; C1–C6 stand; the substrate is unregressed. D1 must be fixed before any founder-facing link, and D2–D9 before the next visual review. C7, C8, C9 and a rendered Shopify preview remain outside engineering's control and outside this pass's authority to approve.
