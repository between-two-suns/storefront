# V12 recovered Shopify — Opus fidelity / polish gate

**Fidelity verdict: PASS WITH CONDITIONS.** The recovered source and the hosted build keep the approved Route B, as corrected by the independent review and the M2 final gate. Both documented deviations have been restored. Two objective craft defects need fixing before a founder-facing link. This is not a production greenlight: the recovered history only ever held conditional approval, and I have not created a new one.

## Evidence basis

- **Source:** `between-two-suns/storefront`, `build/vertical-slice`, `78dd385b705a7cad9cb086909e99c103b88b8199`. The deploy receipt (`deploy-before-opus.log`) records that exact SHA as matching the remote, 217 files verified, deployed to unpublished theme `166903251202` on `qfj1gi-c9.myshopify.com`. Live Horizon `166832668930` was not touched.
- **Hosted URL:** https://3ll4dkhi55qvhmjwsdr3yzhw21hj1-84281229570.shopifypreview.com
- **Command I ran:** `node tests/hosted-v12-fidelity.mjs https://3ll4dkhi55qvhmjwsdr3yzhw21hj1-84281229570.shopifypreview.com`. Result: `{"passed":true,"cells":16,"sourceCommit":"78dd385…","errors":[],"commerceRequests":[]}`, with `previewToolbarHidden: true`.
- **Design index:** `design-review/index.json` has the same `sourceCommit` and `passed: true`, with zero errors and zero commerce requests.
- **Images I inspected directly (21):**
  - Fidelity captures:
    - `home-375x667-text-100-no-preference-front.png`
    - `home-390x844-text-100-no-preference-front.png`
    - `home-1024x600-text-100-no-preference-front.png`
    - `home-1440x900-text-100-no-preference-front.png`
    - `home-1440x900-text-100-no-preference-back.png` (the capture with all four desktop backs turned)
    - `home-1024x600-text-100-no-preference-back.png`
    - `home-390x844-text-200-no-preference-front.png`
    - `home-1440x900-text-200-no-preference-back.png`
  - Design-review captures:
    - `mobile-back.png`
    - `home-en-390x844-full.png`
    - `home-en-1440x900-full.png`
    - `clarity-serum-en-390x844-fold.png`
    - `daily-reset-cleanser-en-1440x900-fold.png`
    - `collection-en-1440x900-fold.png`
    - `collection-en-375x667-fold.png`
    - `bts-menu.png`, `bts-routine.png`, `bts-drawer.png`
    - `mobile-inci.png`, `mobile-text-200.png`
    - `arabic-route.png`

The automated source/theme results (31/31 tests, Theme Check 63 files, 0 offenses) are taken from the brief; I did not re-run them. The visual judgements below are my own and are kept separate from those assertions.

## Measurements the fidelity index establishes

| Cell | Wordmark | Stage / info / buy | Offer shown |
|---|---|---|---|
| 375×667, 100% | 195 × 168.6 (= 52vw) | stage 224, info 136, buy 600.6–652.6 (above the fold) | strip only |
| 390×844, 100% | 200 × 172.9 (200px cap) | stage 364, info 136 | strip only |
| 375×667, 200% | yields to 143 × 123.6 | stage 754.5, info 272 | strip only |
| 1024×600, 100% | 138.8 × 120 (short-height yield) | two 469px tracks at x 32.8 / 522.2; buy 595–647 | band only |
| 1440×900, 100% | 323.8 × 280 | four ~318px tracks, buy 796–848 | band only |
| 1440×900, 200%, reduced motion | 323.8 × 280 | info 329.5, buy grows to 116 | band only |

In all 16 cells, every face reports `turnVisible: true`, `backOverflow: "false"`, `infoOverflow: "false"` and `disabled: true`. Commerce boxes are identical before and after the turn.

## Route B preservation

**Restored as documented**
- **Mobile wordmark (D6):** min(200px, 52vw), shrinking at short heights and enlarged text. Confirmed by the 195 / 200 / 143px values above.
- **Priced desktop band:** "All four · EGP 1,661 · Save EGP 185 →" sits on the inline-end side next to "fresh skin. always.", with the wordmark about 280px tall on the inline-start side. This matches the Route B desktop hero.
- **One visible offer per viewport:** the index flags are mutually exclusive in every cell. On phones, the strip appears below the shelf controls, which the independent review's correction #4 explicitly allows.

**Earlier repairs retained**
- **E1:** two columns at 1024 and four at 1440. All four backs render complete, with approved pills and full descriptions and no clipping.
- **E2:** info blocks scale with text size (rem budgets). At 200% they grow and push commerce down instead of overlapping it.
- Price, Add and Turn over stay outside the rotating face, and their geometry doesn't change across a turn.
- Clarity's back is short (no suitability line, no pills). That is truthful and should stay as it is.

**Selective turn**
- Home and PDP both carry Turn over.
- Shop cards at 375 and 1440 have no turn. I did not visually inspect search result cards.

**Other checks**
- Portrait placeholder roles are clearly labelled and sit on a shared contact floor, using the sourced 180 / 96 / 116 / 116 mm heights at 1440.
- The disabled Add button and the empty bag ("Checkout opens at launch") are intentional.
- The wordmark and icon match the supplied geometry visually. Byte-exactness is asserted by the automated logo check, not by me.

## Remaining objective defects (required before a founder-facing link)

1. **Sheet controls fall back to browser-default styling, and one label breaks mid-word.**
   - Affected: the Close buttons in the menu, routine and bag sheets; the menu Search submit; the routine sheet's per-item Add buttons; the bag's checkout button.
   - All of these show the grey bevelled default button look (`bts-menu.png`, `bts-routine.png`, `bts-drawer.png`).
   - Cause: there is no rule for `[data-bts-close]` or `.bts-menu-search button` (`snippets/bts-menu-sheet.liquid:2,4`).
   - The same sheet's `.bts-sheet { overflow-wrap: anywhere }` (`assets/bts-components.css:69`) makes the Search button render as "Sear / ch".
   - Fix: give these controls the shelf's existing button and link treatments. Remove `anywhere` from the sheet level and apply it only to name and INCI text.

2. **The restored priced offer reads as five separate links.**
   - `.bts-home__routine a { display: inline-flex; flex-wrap: wrap; gap: .25rem }` (`assets/bts-home.css:67`) breaks the underline into segments under "All four ·", "EGP 1,661", "· Save", "EGP 185" and "→". Visible at 1024, 1440 and 200%.
   - This is the element the recovery restored, so it should read as a single call to action.
   - Fix: switch the anchor back to inline or inline-block with one continuous underline. Keep the 44px target by adding padding.

## Optional polish (preserves the direction)

3. **The Shop H1 uses the wrong font.** `.bts-collection h1` (`assets/bts-editorial.css:31`) sets no family, so it renders in the UI grotesk. Every other section heading uses the display face. Add `font-family: var(--font-display)`.
4. **Big empty gap on mobile at 200% text.** At 390×844, about 370px of blank ground sits between the band and the front frame (`home-390x844-text-200-no-preference-front.png`). The stage is sized to fit the enlarged back, and the front sits at its floor. This is the correct trade-off, because commerce must not move and the back must not clip. However, in neutral or placeholder mode the portrait frame could grow to fill the stage height. Re-check this once H1 photography arrives.
5. **Repetition on desktop.** At ≥990px, the header's Shop/Routine links repeat directly below as the band's "Shop↓ / Routine". "fresh skin. always." also appears twice on the same page (band and campaign reservation).
   - Recommendation: keep the band entries, since the band is the art-directed entry point.
   - Let the campaign slot carry the line only once approved media replaces the icon.

Minor notes, not ranked:
- At 1024, the narrow Clarity frame breaks its annotation as "placehol / der". This comes from `overflow-wrap: anywhere` in `.bts-editorial-product__number` and only affects the placeholder.
- The 1440 collection shows three cards with the fourth alone on a second row, as documented in C10.
- Backs fill the full track while fronts are narrow portrait frames. Revisit this with real H1 silhouettes rather than changing it now.

## Arabic and launch limits (separate from this verdict)

**Arabic hosted acceptance is blocked.** `/ar` and `/ar/collections/all` return **404** with `lang="en"` and `dir="ltr"` (`arabic-route.png`, `localeProbes`). Arabic is not accepted here, and I am not recommending activating the locale or treating a forced DOM locale as evidence.

These M2 gate conditions remain open and are not closed by this review:
- **C7:** approved H1 photography and crops; the shelf still runs in neutral mode.
- **C8:** licensed, self-hosted fonts, with every fit budget re-derived against their real metrics.
- **C9:** the Arabic address decision and approved Arabic product copy.
- Provisional colours with no Pantone conversion.
- Real LCP/CLS measurements.
- A rendered Arabic Shopify preview.

Missing final media was not judged as a defect. With defects 1 and 2 fixed, this recovered build is a faithful, founder-reviewable Route B placeholder composition. It is not production-approved.