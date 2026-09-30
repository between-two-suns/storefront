# BETWEEN TWO SUNS V12 — Opus live fix brief

**Scope:** implementation fixes only, inside approved Route B FRONT / BACK.
- Do not add a new concept, claim, discount, service promise or fabricated media.
- Keep the exact wordmark and )( SVGs, the English packaging names, climate restraint and the review-mode disabled commerce.
- Deploy only to unpublished theme 166903251202, and only after GitHub verification.
- After each fix, re-run the hosted capture and re-measure. Don't carry these numbers forward.

## P1 — Make the routine visibly AM 4 / PM 3 (Home and PDP)

**Where:**
- `snippets/bts-routine-editorial.liquid`
- `assets/bts-editorial.css:13–26, 49–51, 101–103`
- the `.bts-pdp__routine` strip at `bts-editorial.css:35–36`

**Fix:**
- Render two rows from the existing `usage_times` data (`bts-usage-time.liquid`):
  - **Morning:** 01 → 02 → 03 → 04
  - **Evening:** 01 → 02 → 03
- Each step is the existing product-colour chip plus the short name. Use connecting rules, not arrows or a progress bar.
- On mobile, show the two rows stacked, with chips about 40 px and names underneath.
- Give the section one action: the existing routine-sheet opener (`bts-routine-link`), using existing locale strings.
- Show the price/saving line only where the prototype config already validates it.
- On the PDP, replace the thin strip with the same mini sequence, with the current product's chip outlined in ink. That tells the shopper where the product sits in the routine without new copy.
- Don't add gamification.

**Accept when:** at 390×844 both rows are readable in one screen, and "Defense = morning only" is obvious without reading the fine print.

## P2 — Desktop shelf: all four at 990 px and up, at a larger scale

**Where:**
- `assets/bts-home.css:38–41` (the 2-column override between 990 and 1279 px)
- `bts-home.css:20, 24` (`--pf-cap: clamp(220px, 100svh - 600px, 360px)`)
- the band heights at `bts-home.css:15, 58–59`

**Fix:**
- Remove the 2-column breakpoint so the shelf is 4 columns from 990 px.
- Let `.pf__name` scale down: `clamp(1.25rem, 1.8vw, 1.625rem)`.
- Reduce the hero band: `min-block-size: clamp(120px, 100svh - 680px, 220px)`.
- Raise the cap: `clamp(240px, 100svh - 520px, 440px)`.
- Move the tagline and entry links closer to the wordmark, so the band has no empty middle.

**Accept when:**
- At 1024×600, all four `.pf__name` elements are in the fold.
- At 1440×900 the tallest frame is at least 380 px and the Add row is within the fold.
- The Clarity annotation never breaks mid-word.
- For the placeholder label, set `.bts-editorial-product__number { overflow-wrap: normal; }` at `bts-editorial.css:58`. Remove the `anywhere` value there, or scope it to longer strings only.

## P3 — Mobile: four products in view without guessing

**Where:**
- `bts-editorial.css:8` (`.bts-shelf-nav__name { display:none }`)
- `bts-editorial.css:66` (the pager links are hidden when the shelf is enhanced)
- `snippets/bts-shelf-nav.liquid`

**Fix:**
- Bring back the enhanced pager as four named tabs: RESET / CLARITY / BARRIER / DEFENSE. Each should be a 44 px target, with a product-colour underline on `aria-current`.
- Keep the previous/next arrows, or drop them if the tabs make them redundant.
- This is the existing no-JS anchor structure made visible. It isn't a new selector concept.

**Accept when:** at 375×667 the order in the first screen stays frame → identity → price/Add. The tabs sit directly under the Add row, and some of them may fall just below the fold.

## P4 — Shop page consistency

**Where:**
- `bts-editorial.css:116` (the 3-up grid at 1280 px and up)
- `bts-editorial.css:31` (`.bts-collection h1`)

**Fix:**
- Use `repeat(4, minmax(0,1fr))` at 1280 px and up, and keep 2-up between 990 and 1279 px, so Defense is never orphaned.
- Give the Shop heading `font-family: var(--font-display); font-weight: 600;`. Do the same for the 404 heading.
- Add the existing routine link below the grid.
- Consider using the Home physical-preview baseline alignment here, so Shop doesn't look like a generic card grid.

## P5 — Menu search and valid sheet evidence

**Where:**
- `assets/bts-components.css:45–46, 69`
- `tests/hosted-design-review.mjs:47–48`

**Fix:**
- Add `.bts-menu-search button { flex: none; white-space: nowrap; min-block-size: 52px; padding-inline: 1rem; }`.
- In the test script, wait for the sheet animation to finish before capturing: `await page.locator('#'+id).evaluate(n => Promise.all(n.getAnimations().map(a => a.finished)))`.
- Add PDP captures scrolled past the primary Add, so the sticky Add is shown with the host toolbar out of the way (use "Hide bar", which is read-only).
- Then submit settled menu, routine and bag captures for visual approval.

## P6 — Remove the duplicated brand line on Home

**Where:** `snippets/bts-home-story.liquid`, `.bts-story__campaign p` (`bts-editorial.css:86`)

**Fix:**
- Keep "fresh skin. always." in the hero.
- In the campaign band, keep only the placeholder annotation and the )( mark until an approved campaign line and image exist. Don't write a substitute line.

## P7 — Mobile pacing

**Where:**
- `.bts-proof-grid` (`bts-editorial.css:94–100`)
- `.bts-neighbour-grid` (`:78, 112`)

**Fix:**
- Below 990 px, lay the formula band out as a 2×2 grid, or as compact rows (name · actives · Full INCI →). Target: under 60% of its current height.
- Make the PDP neighbours a horizontal snap rail that reuses the shelf pattern (about 60vw cards), not three stacked cards.
- Re-measure the Home and PDP document heights at 390×844.

## P8 — Desktop PDP composition

**Where:** `assets/bts-pdp.css:20` (`grid-template-columns: 1fr 1fr; column-gap: 8vw; align-items:center`)

**Fix:**
- Use an asymmetric 7/5 split, with the media frame aligned to the start of its column rather than centred in it.
- Top-align the info column with the frame (`align-items: start`, with an offset that matches the frame).
- Keep price/Add fixed while the face turns.
- The aim is the editorial crop and scale described in Route B, not two centred islands.

## Out of scope (tracked, not implementation fixes)

- product publication, H1/texture/campaign photography, and checkout enablement
- licensed fonts: once delivered, validate cap-height and line breaks for product names at 390 and 1024, shelf-mark baselines, and CLS
- colour sign-off
- policies
- the real bundle behind "Save EGP 185"
- the Arabic hosted locale, which returns 404. Hosted Arabic review has to wait until Shopify serves a real `/ar` route.

## Next five implementation moves

1. P5 first: the button fix and the test-script wait. Then re-run the hosted script so the sheets can be judged.
2. P2 and P3 together: one shelf pass covering desktop scale and mobile tabs, re-measured at all four viewports.
3. P1: the AM/PM routine on Home and PDP.
4. P4 and P6: Shop grid and heading, and the duplicate brand line.
5. P7 and P8: mobile pacing and the desktop PDP composition. Then deploy after GitHub verification and send for a founder walkthrough.

## Coordinator scope note

This brief is the reviewer’s recommendation for `2b8a189`, not authorization to apply a new design. A later independent recovery commit `111141e` changed the wordmark and routine hierarchy; re-check the relevant recommendations against that source before implementation. The evidence harness now waits for dialog animations and hides Shopify preview chrome through its actual control. The Search-button defect remains. Sticky Add is intentionally hidden with disabled review commerce, as required by the existing runtime gate.

## Superseding supplemental review instructions

Opus subsequently inspected the settled menu, routine, bag, INCI, scrolled PDP and enlarged-text captures. Keep the Search-button fix in P5; animation waiting and hiding preview chrome are completed in the evidence harness. Remove the instruction to expose sticky Add in this commerce-disabled review configuration: its hidden/inert state is intentional.

Extend P1's AM/PM sequence to the routine sheet. Add consistent branded Close and disabled-checkout button styling, an empty-bag Shop/routine next step with no zero subtotal, consistent disabled Add styling, and removal of the duplicate Search navigation link when the search form is present. These are review recommendations, not changes implemented by this pass. See the independent supplement in `V12_OPUS_LIVE_SITE_GATE.md`.
