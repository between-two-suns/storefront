# BETWEEN TWO SUNS — V12 OPUS M0/M1 FOUNDATION GATE
Reviewer: Claude Opus (design lead) · 2026-09-30 · Branch: `build/vertical-slice`
Scope: the **minimal** M0/M1 recovery described in `V12_CODEX_M0_M1_REPORT.md`. This is a foundation gate. It does **not** give visual approval to any storefront, and nothing here may be shown to the founder as "v12".

Files reviewed: `layout/theme.liquid`, `assets/bts-base.css`, `assets/bts-components.css`, `assets/bts-core.js`, `sections/bts-header.liquid`, `sections/bts-footer.liquid`, `sections/bts-foundation-home.liquid`, `sections/bts-product.liquid`, `snippets/bts-drawer.liquid`, `snippets/bts-menu-sheet.liquid`, `snippets/bts-price.liquid`, `snippets/bts-quick-view.liquid`, `snippets/bts-internal-marker.liquid`, `locales/en.default.json`, `locales/ar.json`, `data/prototype/config.json`, `data/content/products/*.json`.

---

## Verdict: **PASS WITH CONDITIONS** to proceed to M2

The recovery did the most important thing: it **stopped the bleeding**. v5–v11 are unwired. There is one header, one footer, one bag and one cart adapter. Direction is server-rendered. Prices come from one source. No v11 wrong-label renders (Reset, Clarity, Defense) are referenced. There are no Google Fonts, no climate vocabulary, no fake trust UI and no checkout path. Nothing in the foundation **blocks** FRONT/BACK.

It also **establishes nothing** of FRONT/BACK. There is no product-face component, no back-face data contract and no design token system. The styling that exists is default browser and utility chrome, which is fine as scaffolding and fatal if it survives into M2. M2 may start only on the conditions in §6. Condition C1 (the data contract) is a hard prerequisite for any M2 visual work.

Theme Check, a rendered Shopify preview, browser EN/AR, axe and Lighthouse were **not run** (see the Codex report). This gate therefore certifies structure and intent, not runtime.

---

## 1. Does it preserve the FRONT/BACK route cleanly for M2?

**Yes, by absence, which is the right shape for a recovery.** Specifically:

| Requirement for FRONT/BACK | Foundation state | Assessment |
|---|---|---|
| One chrome, one cart, Add never moves | One header/footer/drawer; one adapter behind `window.BTS.adapter` | ✅ Correct seam. The fixed-Add rule can be built on it. |
| No gesture, scroll or animation infrastructure to fight the turn | None present | ✅ |
| No page-wide recolour (v11 `data-active` root tint) | None | ✅ |
| Native `<dialog>` for INCI sheet / quick view / drawer | Present, with return focus | ✅ Right primitive. |
| Server-rendered AR (turn follows reading direction via one variable) | `lang`/`dir` on `<html>` from `request.locale` | ✅ Foundation is right, but see A2. |
| **Product-face component** (front + back, `inert` hidden face, `aria-pressed` control) | **Absent** | ⚠️ Expected at M2. Must be built once (§5). |
| **Back-face data**: claim pills, 3 key ingredients + one-line why, feels like, use/step, INCI | `data/content/products/*.json` has `inci`, `promise`, `back_description`, `step`, `usage_times`. **`claims: []` on every SKU. No `key_ingredients[{name, why}]`. No `feels_like`. No `media_front` / `media_back`. AR `promise` is `null`.** | ❌ **The back face cannot be built from this data.** Blocking for M2 (C1). |
| Front photography (H1) | Only `bts-barrier-clean-v11.png/.webp` present | ⚠️ Expected. See C7. |

**Risk that M2 improvises the back.** With `claims: []` and no ingredient "why" fields, an M2 engineer will either hard-code copy in Liquid/JS (defect #7 again) or pull sentences out of `back_description`. That is exactly how Green Tea and "Prevents breakouts" reached v11. The back is our claim-discipline mechanism, and it only works if it renders **only** from an approved data contract.

---

## 2. Brand integrity

| # | Finding | Evidence | Severity |
|---|---|---|---|
| B1 | **The wordmark is in the header.** The direction says the exact wordmark SVG appears *only where the pack has it*: desktop hero band, back faces and footer. The header is the `)(` mark plus text nav (`≡ · )( · Shop · Routine · ع · Bag`). A 210 px wordmark on every page, every scroll position, spends the core identity cheaply and will collide with the desktop hero wordmark (two wordmarks in one viewport). | `sections/bts-header.liquid:3` | **P1.** Swap to `bts-icon-ink.svg` before M2 composes a single hero. |
| B2 | **The footer sets the brand name as live text** (`BETWEEN TWO SUNS` in system-ui), which is the one place the wordmark SVG *is* sanctioned. This is the "never set in a font" rule broken in reverse. | `sections/bts-footer.liquid:1` | P2 |
| B3 | The foundation home shows **"V12 foundation ready"** and "M2/M3" milestone language as an `<h1>` on the brand's homepage. Acceptable only while the theme is unpublished and noindex. It must never be the state of a founder link. | `locales/*.json` `ready`, `intro` | P2 (P0 if shared) |
| B4 | The `?founder=1` flag **hides the prototype markers**. Gate §6.9 requires the prototype state to be *unmistakable* in founder builds. The flag does the opposite, only client-side after paint (visible flash), and does not persist across navigation. | `assets/bts-core.js:119-121` | **P1.** Invert it: founder mode consolidates markers into **one** quiet persistent line (header or drawer). It never removes them. |
| B5 | `bts-price` renders an internal "Prototype price" marker **after every price**. On a four-card shelf that is four warning strips, which directly breaks ChatGPT condition 8 ("without visually polluting every product card"). | `snippets/bts-price.liquid:19` | **P1.** One marker per page in the chrome, plus one in the drawer next to the disabled checkout. |
| B6 | `bts-barrier-clean-v11.png` **and** `.webp` both remain. Barrier was allowed to stay until H1 exists. Keep one format, name it without `v11`, and log it as the only permitted pack render. | `assets/` | P3 |
| B7 | Brand ground `#f4f0e8` is a warm cream, chosen without a decision record. Against Pantone 345/304/2562/163 pack photography, a yellowed ground will muddy the mint and powder blue. | `assets/bts-base.css:1` | P2. Decide the ground **against the H1 surfaces** in M2, not before. |

Positive: no climate words, no aperture/bracket shapes, no wordmark wallpaper, no poster headings, no scroll reveals, no reviews, no delivery or COD promises. The foundation is clean of the v7–v11 contamination list.

---

## 3. Mobile and Arabic foundations

### Mobile
- ✅ 44 px minimum controls, `touch-action: manipulation`, `:focus-visible`, skip link, `dvh` on dialogs.
- ❌ **M1. The drawer is a centred modal**, not an inline-end sheet. `dialog` is globally `max-inline-size: min(92vw,480px)` and uses UA centring. The spec says drawer and sheets translate over 240 ms from the inline-end edge, with the menu from the inline-start edge. There is no body scroll-lock and no `overscroll-behavior: contain`, so iOS will scroll the page behind the dialog.
- ❌ **M2. The header wraps** (`flex-wrap: wrap`, 16 px padding, a 120–210 px wordmark, and two text controls). At 375 px with an Arabic label ("القائمة", "الشنطة (0)") it will be close to wrapping to two rows. The direction budgets a **fixed 52 px** header. Fix the height now, because the 375 × 667 shelf budget is computed from it.
- ⚠️ `main { min-block-size: 60vh }` uses `vh`. Use `svh` in anything that participates in the first-viewport budget.

### Arabic
- ✅ Server-rendered `lang` and `dir`. Strings come from locale files, not JS tables. `<bdi>` is used on money and titles. Logical properties are used throughout the CSS. This is the right architecture and fixes v11 defect #8 at the root.
- ❌ **A1. Money formatting is inconsistent between systems and wrong for AR.** Liquid prototype prices render `399 EGP` (raw number + code, `bts-price.liquid:18`). JS renders `Intl.NumberFormat(..., {style:'currency'})`, which gives `EGP 399.00` in EN and `ج.م.‏ 399.00` in AR. **Two formats, trailing `.00`, and the AR currency placement does not match** the spec's `1,661 ج.م`. One formatter, with explicit `minimumFractionDigits: 0`, must be shared by Liquid and JS before any price is composed on a card.
- ⚠️ **A2.** `dir` is derived with `iso_code contains 'ar'`. Use an exact `ar` / `ar-*` match, and expose the turn direction as one CSS custom property on `:root` now (`--bts-turn: 1 | -1`), so M2 does not invent it per component.
- ⚠️ **A3.** Arabic falls back to **Tahoma**, which reads as Windows-dialog Arabic and is the single most "generic" signal on the AR page. It is acceptable as a stub only. The authored display/UI pair (Alexandria / IBM Plex Sans Arabic, self-hosted and subset) must land **with** the first M2 face, because AR line-length and pill wrapping cannot be QA'd in Tahoma.
- ⚠️ **A4.** Voice: "الشنطة" is colloquial Egyptian. I support it, since it is warm and local, but it is a brand decision, and it must be applied consistently (not "الحقيبة" on the PDP). Imperatives are currently masculine/neutral ("حاول", "فعّل"). The feminine-address question (§2 Arabic in the directions) is **still open** and must be decided by the founder before M2 writes any AR product copy.
- ❌ **A5.** The language switch is a `<select>` + "Apply" button in the footer. The direction puts `ع` **in the header**. The correct snippet (`bts-language.liquid`, `ع` / `EN` submit buttons) already exists and is unused.

---

## 4. Generic styling and dead code to remove before M2

None of this is "wrong for a recovery". All of it becomes the look if M2 builds on top instead of replacing it.

1. **`img { object-fit: contain }` globally** (`bts-base.css:11`). H1 front faces are **cropped photographs on a surface** (`cover`, art-directed focal point). A global `contain` will letterbox every pack photo into a floating cut-out on a contrasting ground, which the direction explicitly bans. Delete it.
2. **`border-block-end: 1px solid` on header *and* footer** (`bts-components.css:1`). The footer gets a bottom border, which is meaningless. Default Shopify hairline chrome.
3. **`system-ui` as the entire type system.** No display face, no type scale, no tokens. Acceptable in M0. In M2 the condensed display face (product names only, one per viewport) and the UI grotesk must be defined as tokens **before** the face is styled.
4. **No tokens for the four pack colours, radii, shadow, motion or z-layers.** Add `--c-reset / --c-clarity / --c-barrier / --c-defense` (with an AA-verified `--on-*` ink), `--dur-turn: 320ms`, `--ease-turn`, `--dur-sheet: 240ms`, `--contact-shadow`, and `--pill-radius` matched to the pack pill. The back face must be built from tokens, not per-SKU literals.
5. **`.bts-marker { background:#ece7dd }`**: a literal colour outside the token set, and a full-width strip under the header (the "staging banner" look).
6. **Bulleted drawer lines** (`padding-inline-start: 20px` on `<ul>`), `Title · qty · total Remove` text rows, and a **raw handle as the line title** (`bts-core.js:33`, `title: handle`, so the customer sees `daily-reset-cleanser`). The drawer must render name, cap chip, role and size from product data, with editable quantity.
7. **`snippets/bts-quick-view.liquid` is broken dead code.** It references translation keys that do not exist (`price.coming_soon`, `general.close`, `foundation.body`) and calls `bts-icon` with `name: 'close'`, which renders the brand `)(` mark as a close icon. It is not rendered anywhere. Delete it, or rebuild it in M2 as the quick-view host for the product face.
8. **`sections/bts-foundation.liquid`, `header-group.json` and `footer-group.json` are unused.** The groups invite a second header or footer through the editor, which is the v11 double-chrome defect by another route. Either render the groups via `{% sections %}` or delete them. Do not keep both paths.
9. **Placeholder PDP/collection** ("Product · Shopping is not available") is fine for M0, but M2 must replace it, not decorate it.

---

## 5. What must be true in M2 so the product face is world-class, not a card flip

The ChatGPT gate's rejection test stands: *"If the build looks like a Shopify beauty theme plus a flip animation, REJECT."* These are my acceptance criteria for the face and PDP. Each is binary.

### 5.1 It is an object, not a card
1. **The front is a photograph of a surface, edge to edge.** No card border, no card radius that the pack does not have, no white card on off-white, no drop shadow under the *card*. The only shadow is the **contact shadow under the pack inside the photo**. If the front face has a `box-shadow`, it has failed.
2. **The face has the pack's proportion.** The aspect ratio is derived from the carton/tube (one ratio token), not a 1:1 or 4:5 e-com tile. All four sit at **identical physical scale** so the family reads as a set: tube, bottle, jar and tube at their real relative heights on desktop.
3. **The turn is a turn.** 320 ms, perspective ≈1200 px, a single ease with no overshoot, rotating about the vertical axis **in reading direction**. During the turn the contact shadow narrows and returns, sold with one pseudo-element and no WebGL. No glare, no gloss, no lift, no scale-up. Reduced motion: 120 ms crossfade. If it can be described as "springy" or "3D", it has failed.
4. **The back is the pack's back, recomposed for reading.** It uses the matte pack colour, the exact wordmark SVG positioned as on the carton, **claim pills cut to the pack's pill geometry**, the label's "does" line, **exactly three ingredients, each with one line of why**, *Feels like*, *Use · AM + PM · step 01*, and *Full INCI →*. All informative text is **ink** (AA ≥ 4.5:1 on each pack colour, verified per token). White is used for the wordmark only.
5. **Both faces occupy the same box.** No height jump on turn and no CLS. The back fits the front's box at 375 px **in Arabic**. If it does not fit, cut content; do not make the box grow or the back scroll.

### 5.2 Commerce never moves
6. **Price and Add sit outside the rotating element.** They do not rotate, reflow or change label between faces. The turn control is secondary (52 px, beside or under Add, never the same weight).
7. **Photo tap → PDP. Only the labelled control turns.** Using `aria-pressed` with "Show the back of the pack". The hidden face is `inert` and both faces are in the DOM (SEO and no-JS both get the back content).
8. **One component, data-driven, everywhere:** home shelf, Shop, PDP frame 1, quick view, search result and Finder result. A 20-SKU grid must work with zero new code. **If M2 ships a home-only face, it fails.**

### 5.3 Data and claims discipline (C1)
9. **The back renders only from `bts_product_content`**, extended with `claims[]` (approved label pills, en/ar, per-locale approval flag), `key_ingredients[3]{inci_name, display_name, why{en,ar}}`, `feels_like{en,ar}`, `does{en,ar}` (label line verbatim), `media_front`, `media_back`, `media_swatch`. A null AR field hides that element in AR. It never falls back to English inside an Arabic composition.
10. An **automated parity check** fails the build if any rendered claim, ingredient or INCI string is not present in `FINAL_LABEL_SOURCE_OF_TRUTH.md`. Note: Clarity's `back_description` says "Hyaluronic Acid" while the INCI says *Sodium Hyaluronate*. That is fine as consumer language, but it must be explicitly approved, not drift.

### 5.4 PDP
11. **Frame 1 is the same face component**, at gallery scale, turnable. The frames that follow (P1 back photo → T2 → P2) render **only when the asset exists**. No placeholder frames, no "media pending", ever.
12. The first mobile viewport at 375 × 667 contains the face, step · role · size, name (the one display element), the label promise, price, Add, and the routine line. The sticky Add appears only after the primary Add leaves the viewport and uses the same adapter.
13. **"The Back" section** below the fold is the long form of the back face (claims → three ingredients → formula logic → INCI), visually continuous with the face's back, so the PDP reads as *the pack, unfolded*. It is not an accordion stack.
14. Launch mode must not be enabled until `ShopifyCartAdapter` is real. It currently returns an empty cart and throws on add, which is correct as a guard and a dead end for any PDP demo.

### 5.5 What makes it BTS, not a theme
15. **Asymmetric editorial crop and scale on desktop.** The four faces are one family portrait with the wordmark as a single restrained object. They are not a 4-up product grid under a banner. Review this with the flip disabled: if the page is indistinguishable from Dawn with nice photos, it fails.
16. **Colour only on product faces and cap chips.** The ground stays neutral and sections are never tinted.

---

## 6. Conditions for proceeding to M2

**Must be done before any M2 visual review (blocking):**
- **C1.** Extend and fill the `bts_product_content` data contract per §5.3 for all four SKUs in EN, with the parity check. AR fields stay null until authored and approved.
- **C2.** Header: `)(` icon instead of wordmark, fixed 52 px, `ع` in the header via `bts-language.liquid`, and slots for Shop and Routine. Footer: wordmark SVG.
- **C3.** One money formatter shared by Liquid and JS, with no decimals and the AR pattern `1,661 ج.م` inside `<bdi>`.
- **C4.** Prototype markers: one per page, persistent. `?founder=1` must never hide the prototype state. Remove the per-price marker.
- **C5.** Remove the global `img { object-fit: contain }`. Add the token layer (§4.4). Delete `bts-quick-view.liquid` (or rebuild it), unused `bts-foundation.liquid`, and resolve the section-group vs `{% section %}` duplication.
- **C6.** Drawer as an inline-end sheet and menu as an inline-start sheet, with scroll lock. Drawer lines show product name and cap chip, never handles.

**Must be done before the founder sees anything:**
- **C7.** Tier 2 H1 photography for all four SKUs (Barrier render at most as the interim for Barrier only). Without it, the front face is a CSS stand-in, and that is the v8–v11 failure pattern, which I will not approve a second time.
- **C8.** Self-hosted display, UI and Arabic faces.
- **C9.** The founder's decision on Arabic address (feminine vs neutral).
- **C10.** Theme Check, a rendered preview in EN and AR at 375/390/430, axe, and Lighthouse on mid-tier Android, all actually run and reported. "Blocked by environment" is not a pass.

**Not conditions, but recorded:** the foundation's strongest decisions are the single adapter seam, native dialogs, server-rendered locale, the fail-closed launch toggle, and the zero-literal price check. Keep them. Do not let M2 "improve" them away.

---

**Gate result: PASS WITH CONDITIONS.** M2 may begin engineering the product-face component and data contract now. No M2 visual output is reviewable until C1–C6 are met, and nothing is founder-facing until C7–C10 are met.
