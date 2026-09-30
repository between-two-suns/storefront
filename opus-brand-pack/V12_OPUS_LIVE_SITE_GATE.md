# BETWEEN TWO SUNS V12 — Opus live-site design gate (hosted)

**Design verdict (placeholder-first Route B FRONT / BACK): PASS WITH CONDITIONS.**
**Launch acceptance: NOT READY. This is a separate matter and not a design finding.**
**Arabic hosted visual acceptance: BLOCKED.**

Reviewer: Claude Opus, acting as independent ECD and ecommerce UX reviewer · 2026-09-30
Target: unpublished theme 166903251202 on qfj1gi-c9.myshopify.com. Source is `build/vertical-slice` @ 2b8a189. Nothing was modified.

## Evidence

- **What I ran:** `node tests/hosted-design-review.mjs https://3ll4dkhi55qvhmjwsdr3yzhw21hj1-84281229570.shopifypreview.com`. It finished with `passed: true`, `errors: []` and `commerceRequests: []`. The index at `test-results/v12-shopify-native/design-review/index.json` records `checkedAt 2026-09-30T19:00:27Z` and `sourceCommit 2b8a189…`.
- **URLs I inspected** (all on the share-preview host): `/`, `/collections/all`, `/search?view=product&q=daily-reset-cleanser`, `…q=clarity-serum`, `…q=daily-barrier-moisturizing-cream`, `…q=daily-defense-sunscreen-spf-50`, `/ar`, `/ar/collections/all`.
- **The 21 captures I viewed as images:**
  - Home: `home-en-375x667-fold`, `home-en-390x844-fold`, `home-en-1024x600-fold`, `home-en-1440x900-fold`, `home-en-390x844-full`, `home-en-1024x600-full`, `home-en-1440x900-full`
  - PDPs: `clarity-serum-en-390x844-fold`, `clarity-serum-en-1440x900-fold`, `daily-barrier-moisturizing-cream-en-390x844-full`, `daily-reset-cleanser-en-1440x900-full`, `daily-defense-sunscreen-spf-50-en-375x667-fold`
  - Collection: `collection-en-390x844-fold`, `collection-en-1440x900-full`
  - Interactions and other states: `mobile-back`, `bts-menu`, `bts-routine`, `bts-drawer`, `mobile-inci`, `mobile-text-200`, `arabic-route`
- **What the script checked automatically:**
  - theme id and role are `unpublished`
  - the front/back turn sets `data-side="back"`
  - the menu, routine and bag dialogs open, close on Escape and return focus to the button that opened them
  - the INCI `<details>` opens
  - there is no horizontal overflow at 200% root text size
  - there are zero commerce requests
  - `/ar` and `/ar/collections/all` return **404 with `lang=en`, `dir=ltr`**
- **What the script does not check:** everything below about hierarchy, pacing, crop and brand fit is my visual judgement from the captures.
- **Not used:** WebFetch. I did no physical-device testing.
- **Host chrome:** Shopify's black Draft / password-protected toolbar is not part of the site layout. In the full-page captures it gets stamped mid-page (at y≈535 in the 1024 capture, and mid-page in the 390 Barrier PDP and the 200%-text capture). I have not counted it as a site finding.
- **Evidence gap:** `bts-menu.png`, `bts-routine.png` and `bts-drawer.png` were captured straight after the click (`tests/hosted-design-review.mjs:47–48`). The sheets have a 240 ms entry animation (`bts-components.css:18`, `--dur-sheet`), so each capture is mid-animation: translucent and partly off-screen. **I cannot visually approve the open states of the menu, routine or bag sheets.** Their scripted open/close/focus behaviour did pass. The fixed sticky Add bar on the mobile PDP sits under the host toolbar in every capture, so it can't be judged visually either.

## Five strengths

1. **The identity is exact and placed with control.** The supplied wordmark is the hero object on Home, and appears again only in the footer. The )( mark is the header logo and the campaign band. It isn't used as wallpaper.
2. **The desktop shelf is a real family portrait.** At 1440×900 the four frames stand on one baseline, scaled to the founder's pack heights (180/96/116/116 mm). Each has a product-colour contact edge and a portrait reservation. The effect comes from the packaging itself, not from card chrome. The placeholders are honestly labelled (`0N · Image placeholder`) and stay stable when real images are swapped in.
3. **The commerce path is honest and visible in the first screen.** At 375×667 the Add row sits at y=558 and at 390×844 at y=702. The order is correct: frame → identity → benefit → price/Add → "Turn over" as a secondary action. There is one prototype marker, in the footer. There are no fake reviews, service claims or trust badges.
4. **Ingredient transparency is layered well.** The actives go from the shelf, to the approved back-face pills, to the PDP "In this formula" section, to a full, readable INCI disclosure (`mobile-inci.png`). The dark formula band gives this a strong moment on Home.
5. **Copy discipline and climate restraint hold.** English packaging names are used, and benefits are short triplets. Climate vocabulary appears only inside approved label descriptions. At 200% text the layout reflows without overflow (checked by script), and the Add and Turn-over controls wrap cleanly.

## Verdicts by area

| Area | Verdict | Grounding |
|---|---|---|
| Hero | **Pass with conditions** | The wordmark plus "fresh skin. always." works at every size. At 1024 and 1440 there is a dead zone between the wordmark and the tagline. The same line is repeated in the campaign band. |
| Four-product discovery | **Conditional; weakest at 1024 and on mobile** | At 1440 all four are in view with Add (y=796). At 1024×600 the shelf drops to 2×2, so Barrier and Defense start at y=843, below the fold. The frames are small (≈72 px wide for Clarity at 1024), and the placeholder label breaks as "placehol/der". On mobile you see one product plus a peek, with arrow-only navigation. |
| Routine | **Fail as "first-class"** | On Home the routine is a flat list, with "Morning and evening" repeated three times and "Morning only" once. The approved Route B condition "AM = 4, PM = 3 must be obvious" isn't met, and the section has no call to action. The PDP routine line is a thin rule labelled "Routine … Morning and evening". |
| PDP | **Pass with conditions** | The mobile fold is correct. On desktop the media and info sit in two centred islands, which looks template-like. The mobile "Routine" list of other products stacks three full cards (≈505 px each, from the index y-deltas). |
| Ingredient education | **Pass** | Approved actives, pills and full INCI are all present. On mobile the dark formula band stacks four sparse panels and takes up roughly a quarter of the 4,001 px page. |
| Navigation / footer | **Pass with conditions** | The header is clean and Shop/Routine/Search/Bag are each one tap away. The footer is minimal, which is acceptable in review because policies are gated. The Shop page `<h1>` renders in the system UI face, not the display face. At 1440 the Shop grid is 3-up, which leaves Defense alone on a second row (y=1158 vs 594). |
| Mobile menu | **Defect found; open state not approvable** | The search button wraps to "Sear/ch". The captures are mid-animation (see Evidence gap). |
| Originality | **Home pass; Shop/PDP at risk** | Home reads as BTS. Shop and the PDP neighbour list are close to "Shopify beauty theme plus a flip": equal cards, grey buttons, orphaned grid rows. |

Typography uses system fallbacks: Avenir Next Condensed for display, and the system UI face. I am not approving fonts. The licensed faces still need metric validation.

## Ranked blockers (details in the fix brief)

1. The routine doesn't show AM/PM as first-class.
2. At 1024 the shelf is 2×2 and the desktop product scale is too small, so the family portrait loses to the wordmark.
3. On mobile, four-product discovery is arrows-only.
4. Shop page: 3-up orphan row and off-system `<h1>`.
5. Menu search button wraps; the sheet capture evidence is invalid.
6. "fresh skin. always." appears twice on Home.
7. Mobile pacing: formula band and PDP neighbours are too long.
8. The PDP routine strip and the desktop PDP composition are weak.

## Separate gates

- **Launch: NOT READY.** Products are Draft. There is no H1 photography. Licensed fonts are not delivered. Policies are absent. The "Save EGP 185" display is Scenario B prototype pricing, and it needs a real bundle implementation before launch (condition 9 of the review gate). None of these are implementation defects in this theme.
- **Arabic: BLOCKED.** The hosted `/ar` routes return 404 in English/LTR (`arabic-route.png`). Local bilingual fixtures and forced DOM locale don't count as hosted proof.

## Coordinator evidence correction and revision scope

This independent review assessed deployment `2b8a189` and its captures at 2026-09-30T19:00:27Z. A separate authorized recovery session subsequently pushed and deployed `111141e`, restoring wordmark and desktop routine hierarchy. Findings above remain an assessment of the named earlier revision; they are not a design acceptance for `111141e`.

The coordinator subsequently captured the menu, routine and bag after their entry animations finished, using the actual Shopify Hide bar control. These settled images are in `test-results/v12-shopify-native/design-review-supplement/`; the Search button still wraps. Source inspection also corrects the initial sticky-bar assumption: `assets/bts-pdp.js` intentionally hides the sticky Add when the primary Add is disabled. This review theme therefore cannot receive launch sticky-Add visual acceptance. No commerce control was enabled or DOM-forced for the review.
