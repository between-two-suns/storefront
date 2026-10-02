# V12 recovered Shopify — Opus closure gate

**Verdict: PASS WITH CONDITIONS.** Both of the fixes I required at `78dd385` are closed on the hosted build. Route B is preserved, and I found no objective blocker for the founder reviewing the placeholders. The only conditions left are the external gates (C7/C8/C9, Arabic, launch). This is not a production approval.

## Evidence

- **Source:** `build/vertical-slice` at `92492be768d68231f7e41230885d4058caa5af96`. `polish-deploy.log` shows the remote matched this SHA and 221 files were verified. It was deployed to unpublished theme `166903251202` on `qfj1gi-c9.myshopify.com`; live Horizon `166832668930` is listed as `role: live` and was not targeted.
- **Command I ran:** `node tests/hosted-v12-polish.mjs https://3ll4dkhi55qvhmjwsdr3yzhw21hj1-84281229570.shopifypreview.com`. Result: `{"passed":true,"cells":6,"sourceCommit":"92492be…","errors":[],"commerceRequests":[]}`.
- **Other indexes:**
  - `fidelity/index.json` and `design-review-supplement/index.json` both record `92492be`, `passed: true`, no errors, no commerce requests, and the toolbar hidden.
  - The supplement confirms the sheets were settled when captured (opacity 1, no active animations).
- I did not run the source checks or Theme Check myself.
- **Images I inspected (15):**
  - From `polish/`:
    - `bts-menu-375x667-text-100.png`
    - `bts-menu-390x844-text-200.png`
    - `bts-routine-390x844-text-100.png`
    - `bts-routine-390x844-text-200.png`
    - `bts-routine-1440x900-text-100.png`
    - `bts-drawer-375x667-text-100.png`
    - `bts-drawer-390x844-text-200.png`
    - `desktop-offer-text-100.png`
    - `desktop-offer-text-200.png`
    - `shop-1440x900-text-100.png`
    - `shop-375x667-text-200.png`
  - From `fidelity/`:
    - `home-375x667-text-100-no-preference-front.png`
    - `home-1440x900-text-100-no-preference-back.png`
  - The 78dd385 images were used only for before/after comparison.

## Required fix 1: sheet controls and the Search label — CLOSED

- The browser-default bevelled buttons are gone from the menu, routine and bag sheets.
- Close now uses the underlined link treatment; the index records `border: none` and 44px height at 100%.
- The Search submit is an ink-filled button that keeps its whole label at both 100% and 200%. The input shrinks instead: "Sear / ch" is gone.
- Routine-sheet Add, "Add all four" and checkout are all `disabled: true`, with the subdued look the brief describes.
- The index records `width === scroll` for every sheet in all six cells, so nothing overflows sideways.
- At 200%, labels wrap between words ("Add to / bag", "Checkout opens at / launch"), never inside a word. That is acceptable reflow.

## Required fix 2: the priced desktop offer — CLOSED

- In `desktop-offer-text-100.png` and `desktop-offer-text-200.png`, "All four · EGP 1,661 · Save EGP 185" now has one continuous underline and reads as a single call to action.
- The amounts are unchanged and sit in the same band position.
- The fidelity index still shows exactly one visible offer per viewport.

## Optional Shop heading fix — CLOSED

"Shop" now uses the display face at 1440 and at 375/200%, matching the other section headings.

## Route B is preserved

The current captures match the version I passed at 78dd385:
- The mobile wordmark still fills 52vw at 375.
- The desktop band is unchanged.
- The four complete backs still show their approved pills and full descriptions.
- Price, Add and Turn over stay outside the turning face and don't move when a product is turned.
- Shop cards have no turn.
- Placeholders keep the physical-preview proportions.

No new direction, media, font or copy was introduced.

## Optional notes (not conditions)

- At 200% text, a large empty band still sits between the header band and the first placeholder at both 390 and 1440. It was there before this change. Revisit it when H1 photography arrives.
- The routine sheet shows disabled Add as an outlined button, while the shelf shows it as a filled grey button. Both are clearly disabled, but the treatments could be unified later.
- The 3+1 Shop grid at 1440 and the placeholder annotation breaking as "placehol / der" at 1024 are both unchanged.

## Separate limits

**Arabic hosted acceptance is still blocked:** `/ar` and `/ar/collections/all` return 404 with `lang="en"` and `dir="ltr"`. C7 photography and crops, C8 licensed fonts (with fit budgets re-measured), C9 Arabic copy, colour sign-off, real performance, and enabling commerce all remain open. None of them affects this placeholder design acceptance, and none of them is closed by it.
