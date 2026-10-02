# BETWEEN TWO SUNS — V12 Codex E1/E2 report

Date: 2026-09-30. Scope: `V12_OPUS_M2_FINAL_GATE.md`, E1/E2, preservation of D1–D9/B1–B5/C1–C6, and founder-authorized physical geometry and H1 finish metadata. Local work only; no Admin, publish, push or commit.

## Result

E1 and E2 are repaired in production CSS and verified in the local LiquidJS/Chrome harness. Content now determines the minimum space it needs; excess content grows the composition instead of clipping or hiding Turn. The approved copy, INCI, pills, ingredient attribution, prices, translation approvals and media approvals are unchanged.

This closes the local implementation defects. It does not establish founder-readiness, photographic proportions, final typography, Arabic product-copy approval, full WCAG conformance or a rendered Shopify preview.

## E1 — intermediate widths and complete backs

- Home uses two equal columns at **990–1279 px**, and retains four equal columns at **1280 px and above**. Both rows share their own product floor and buy-row baseline; the second row follows in document flow. The first row retains the normal-size conditional fold-commerce rule. All four buy rows remain above the fold at the existing wide desktop matrix geometries.
- `.pf__back` participates in the card's intrinsic grid sizing. The stage has a minimum photograph budget, rather than a maximum content height. A longer back grows its stage and row. The back no longer has `overflow: hidden`; its paragraphs and pills cannot be flex-shrunk into a clipped fixed box. Body copy stays `.875rem` (14 px at the default root size), with no type reduction.
- The overflow observer remains a diagnostic. It no longer hides Turn when its assertion trips. Production fit comes from intrinsic CSS sizing, independent of `bts_debug` and the observer.
- Desktop subgrids align stages, info and commerce across each actual row. The measured width formula uses the current column count, deducts only the inter-column gaps, and continues to count container padding once.

## E2 — enlarged text without overlapping commerce

- Shelf info uses **`min-block-size: 8.5rem`**, replacing `block-size: 136px`. Padding is `.5rem`, shelf text spacing is `.25rem`, and back padding/gaps/pill spacing use `rem`. The minimum info budget becomes 272 px at the tested 200% root size and expands further when needed.
- Back copy grows its stage; buy controls can wrap. Commerce remains outside the turn stage. Text enlargement can move commerce below the fold, as required to preserve content and functionality; default-size fold assertions remain in force.
- Subgrids preserve each row's common buy baseline even when one info block grows. Tests inspect actual child bounds against the buy row, as well as `data-info-overflow`.
- The former deliberately overflowing Arabic-name probe now proves **production growth** with debug mode absent: the info block expands, its children remain above commerce, and restoring the approved name leaves the overflow diagnostic clear. No production copy is modified by this fixture.

## Exact requested tests and regression coverage

`tests/browser.mjs` retains the original 80-cell matrix and adds:

| Added geometry | Text size | Locales | Surfaces | Motion |
|---|---|---|---|---|
| 1024×768 | default | EN, AR | Home, PDP | normal, reduced |
| 1024×600 | default | EN, AR | Home, PDP | normal, reduced |
| 1100×768 | default | EN, AR | Home, PDP | normal, reduced |
| 1152×864 | default | EN, AR | Home, PDP | normal, reduced |
| 1440×900 | **200% root font-size** | EN, AR | Home, PDP | normal, reduced |
| 390×844 | **200% root font-size** | EN, AR | Home, PDP | normal, reduced |

The complete matrix is **128 cells**. The new E1/E2 cells run with debug assertions disabled. Assertions cover stage floors, every reachable back and Turn, complete sentence/pill/link containment, info overflow, child-to-commerce non-overlap, conditional normal-size fold commerce, per-row shared floors/baselines, yielding band containment and Home/footer wordmark hierarchy. All English SKUs are actually turned and their back bounds checked; commerce geometry and text are unchanged across the turn. Fold/full snapshots preserve the tested root font size and identify `text-200` in their filenames.

**Arabic approval rule remains intact:** product Arabic descriptions/claims are still unapproved/null. AR therefore has proper-name pack alt text and no back markup, no Turn and no English product fallback. AR cells assert that deliberate gating; no translation or artificial approval was created just to make an Arabic Turn assertion pass. The same intrinsic CSS is ready for approved AR content, which still requires a new C9 review when it exists.

An additional production-mode live-resize sweep covers **every integer width from 990 through 1280**, at heights **600, 768 and 864**, in both locales: **1,746 geometries**. English faces stay turned during resizing; tests require usable Turn controls, no clipped backs, the stage floor and no info/commerce overlap. AR preserves its approval-gated static face.

The existing absent/stale-media, ratio/crop, routine math and fallback, SSR search, money parity, ingredient attribution, no-JS, focus/inert/aria-pressed, RTL non-mirroring, reduced motion, turn persistence, sticky add, sheet/cart, width-bound measured-scale and baseline checks remain exercised.

## Founder physical geometry and production finish

| Product | `pack_height_mm` |
|---|---:|
| Daily Reset Cleanser | **180** |
| Clarity Serum | **96** |
| Daily Barrier Moisturizing Cream | **116** |
| Daily Defense Sunscreen SPF 50 | **116** |

Each single-product seed's `pack_height_source` records **founder physical-pack tape measurements supplied 2026-09-30**, the product and its value. Both 116 mm sources record that **Moisturizer and SPF are confirmed the same physical bottle**. The product contract now admits sourced founder physical-pack measurements as well as dielines. The offline seed plan emits the exact values/provenance and reports `admin_calls: 0`.

`data/media-safety.json` → `h1_production_metadata`, and `V12_H1_PRODUCTION_BRIEF.md`, record:

- Actual Moisturizer and SPF pump/actuator finish is **MATTE**, not shiny/glossy; preserve in H1 asset production.
- The founder photos are **geometry/measurement evidence only, NOT label/artwork sources**. Cleanser/Serum photographed labels are old and must never replace **FINAL-v5** source truth.
- No H1 file, crop approval or media approval has been invented or seeded. The permitted Barrier interim remains hash-pinned and unwired.

The new founder-measurement fixture uses synthetic geometry media solely to exercise the contract. It verifies 180/96/116/116 and one common photograph px/mm unit, while intrinsically longer backs can take extra stage height. In measured mode, each stage reserves at least **200 px** even for the smaller serum, while the front photograph keeps its mm-derived height and bottom contact point instead of being enlarged to fill a longer claims panel. Synthetic measured and width-bound tests continue to verify the existing scale algorithm.

**Real production still runs neutral:** approved current-label H1 files/crops remain absent. Measurements alone cannot enable measured mode. C7's source-measurement input is now supplied; photography/crop/family-proportion review remains open.

## Executed validation

- `npm run check` — **19/19 tests passed**, including structure/JSON/references, shell/locales, money, label/INCI/claim/ingredient/excerpt parity, price literals, climate, exact logo bytes, contrast and gzip gates.
- `npm run theme-check` — **48 files, zero offenses**.
- `npm run test:browser` — **145 checks passed, zero failures**: the complete **128-cell matrix** plus **17 supplemental checks**, including both continuous width sweeps (**1,746 geometries**). Chrome **154.0.8037.58**; **462 fold/full screenshots** produced by this run. Evidence: `test-results/browser-report.json` and `test-results/screenshots/`.
- Final measured-only stage-floor safeguard — a targeted browser rerun passed **18/18 checks**, including the representative desktop Home cell, both full continuous width sweeps and all measured/source/width-bound/no-JS supplemental checks. Both founder and wide-crop fixtures now explicitly assert a **200 px minimum stage**, while width/scale assertions measure the photograph itself. The neutral 128-cell matrix branch was unchanged by this safeguard. Evidence: `test-results/browser-measured-followup-report.json`, also linked from the primary browser report.
- Supplementary read-only 200% axe probes — **14 scans, zero violations**, including main, English back, menu and bag; `test-results/text-resize-axe-report.json`.
- Supplementary founder-mm/200% geometry probe — all four backs fit, the stages grow beyond the photographs where needed, shared floor remains within 1 px, and every photograph retains the same px/mm scale; `test-results/founder-measured-text-resize.json`.
- `npm run test:perf` — all three local Lighthouse diagnostic runs completed (Home EN/AR, PDP EN). `test-results/lighthouse-summary.json` explicitly identifies the local fixture without H1 media, Shopify scripts or licensed fonts. These are **not release-performance evidence**.
- `node scripts/seed-metaobjects.mjs --dry-run` — exact measurement envelopes, **zero Admin calls**. `git diff --check` — clean.
- Visual inspection — intermediate-width two-row composition, 200% desktop full/back captures, and 200% mobile full/back captures; complete claims and usable commerce controls remain visible in document flow.

Accessibility wording: **automated axe checks, AA tags, plus explicit local text-resize and containment assertions**. This is not a WCAG 2.2 AA conformance claim. The supplementary 200% probe covers main, the English back, menu and bag at both requested text-resize geometries and both locales: **14 scans, zero violations**, in `test-results/text-resize-axe-report.json`.

The Shopify skill's `validate.mjs` could not load its missing `@shopify/theme-check-common` dependency. The installed Shopify CLI performed the full theme check successfully; the helper failure was not treated as a passing validation.

## Preservation and remaining gates

D1–D6: normal-size stage floors, conditional commerce, honest synthetic captures, width-bound padding arithmetic, info growth and mark hierarchy pass. D7–D9: unchanged full approved back descriptions, header SVGs/52 px shell and localized Home Routine anchor pass. B1–B5 and C1–C6 contracts remain exercised: equal tracks and per-row floors/baselines, AR gating/alt text, complete truthful copy, config-derived offer math, server-rendered fallbacks, fail-closed media, motion/focus and immobile commerce across turns.

A deep comparison against the pre-task product snapshots confirms that product data changed only in the authorized height/provenance fields and internal geometry notes; the routine product is identical. Label/claim/INCI/ingredient/excerpt parity also passes. Prices, approved artwork source truth, typography assets and Arabic approvals were not changed.

Before founder-readiness, create and approve C7 H1 photography/crops, license/self-host C8 fonts and repeat fit checks with their actual metrics, complete C9 address/product-copy approval, and run the same width/text-size checks in a rendered Shopify EN/AR preview. None of those external gates was marked complete by this local repair. No Admin, theme upload, publish, push or commit occurred.
