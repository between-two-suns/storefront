# BETWEEN TWO SUNS — V12 CREATIVE DIRECTIONS
Lead: Claude Opus (creative direction) · Date: 2026-09-29 · Branch: `build/vertical-slice`
Status: DESIGN / ARCHITECTURE PASS. No theme code changed in this pass.

Companion documents:
- `V12_EXPERIENCE_ARCHITECTURE.md`: sitemap, journeys, navigation, states, analytics, SEO, Markets
- `V12_IMPLEMENTATION_SPEC.md`: the build spec for engineering

---

## 0. Where we actually are

Before choosing a direction, here is the current state without softening it. v11 is not a candidate to keep polishing. It is evidence of a failure pattern that has now repeated four times.

### 0.1 Verified defects in the current build

| # | Finding | Evidence | Severity |
|---|---|---|---|
| 1 | **3 of 4 hero pack renders contradict the final label.** Reset reads "Zinc PCA + **Green Tea**" and "Cleansing gel. Lightweight. Non-stripping." Clarity reads "**Niacinimide** + **Zinc PCA**" and "**Prevents breakouts**" (an unapproved claim with a misspelling). Defense reads "Daily **Face** Sunscreen SPF 50". Only Barrier matches. | `assets/bts-*-clean-v11.webp` vs `FINAL_LABEL_SOURCE_OF_TRUTH.md` | **P0.** The homepage currently shows claims the product does not make. |
| 2 | Pack render colours are saturated kelly green and cyan, not Pantone 345 U mint and 304 U powder blue. | Same files | P0 for any founder-facing or paid use |
| 3 | **Homepage JS throws on load.** `setActive()` queries `[data-b11-swatch]`, but the markup only uses `data-b11-sheet`, so `null.tabIndex` throws inside `applyLang()`. The routine note, cart render and capture channel never initialise. | `assets/bts-home-v11.js:206`, `sections/bts-home-v11.liquid:47` | P0 |
| 4 | **The signature interaction does not exist.** Drag-to-Swatch binds to `[data-b11-swatch]`, which matches zero elements. Tapping a pack opens a quick sheet instead. v11's "extraordinary, ownable interaction" never ran. | `assets/bts-home-v11.js:242` | P0 (concept) |
| 5 | **Double chrome.** `bts-home-v11` renders its own nav, footer, drawer and bag. `layout/theme.liquid` also renders `bts-header` and `bts-footer`. The page shows two headers, two footers and **two bag counts from two different carts**: the Shopify cart (0) and a localStorage cart. | `layout/theme.liquid:24-29`, `sections/bts-home-v11.liquid:22-33` | P0 |
| 6 | The section comment says "LOCAL ONLY — not wired", but `templates/index.json` points to `bts-home-v11` (Shopify commit `8a4cfc4`). The documentation lies about what is live on the dev theme. | `templates/index.json` | P1 |
| 7 | Prices are duplicated in Liquid (`prices` array) and JS (`PRICING`), which violates the "centralised prototype data" rule. INCI and product names are hard-coded in JS, which will not scale past 4 SKUs. | `sections/bts-home-v11.liquid:14`, `assets/bts-home-v11.js:12-39` | P1 |
| 8 | **Arabic is a client-side string swap on the same URL.** The page renders English first, then swaps. Search engines never see Arabic, hreflang is impossible, and without JS there is no Arabic. | `assets/bts-home-v11.js:44-143` | P1 (architecture) |
| 9 | Non-active slides get `aria-hidden="true"` while their buttons stay focusable, which is a WCAG failure. | `assets/bts-home-v11.js:206` | P1 |
| 10 | The copy promises things we cannot deliver: "The routine price applies automatically when all four are in your bag" (native Shopify discounts cannot express "all four distinct SKUs"), "Swatch it before you buy it" (the interaction is dead), "Pay when your order arrives" and "Delivery across Egypt" (operations not approved). | `sections/bts-home-v11.liquid:109`, JS copy table | P1 |
| 11 | `BRAND_MANIFEST.md` still lists Green Tea for the cleanser and "Niacinamide + Zinc PCA" for the serum. Anyone writing copy from it will reproduce defect #1. | `BRAND_MANIFEST.md` product architecture | P1 |
| 12 | `README.md` still names "Environmental States — sun, dust, pollution, dry AC and humidity" as a core creative primitive, and `bts.css` has 117 environment/dust/humid references. The repo's own documentation contradicts the founder's direction. | `README.md`, `assets/bts.css` | P2 |
| 13 | Seven dead homepage generations (v5–v11 sections plus assets) and `bts-experience.liquid` bloat the theme editor. | `sections/`, `assets/` | P2 |
| 14 | Google Fonts load from two places (layout plus an in-body `<link>` for Alexandria). Third-party, render-blocking, no subsetting. | `layout/theme.liquid:17-18`, `sections/bts-home-v11.liquid:17` | P2 |
| 15 | Naming drift: role "Moisturise" (UK) vs "Moisturizing" (pack, US) vs "Hydrate" (manifest). Sizes: "50 g" (web) vs "50 gm" (pack). | Various | P2. Decision: US spelling to match the pack; SI units "50 g" / "200 mL" on web |

### 0.2 The failure pattern (why v8 → v11 all read as "prototype")
Every version put its desire engine in media that did not exist yet: texture loops, on-skin, UGC, finish proof. So every build shipped with labelled holes ("T1/T2 · media pending", "S1 · sample / media pending") and CSS stand-in surfaces. The founder is right that it feels incomplete, because it is. A v12 route that needs 30 unproduced assets to look finished will fail the same way.

**Selection criterion #0 for v12:** the route has to look finished with the assets we can realistically have in 2–3 weeks, and get better, not different, as more media arrives.

### 0.3 Asset reality
| Tier | Assets | Realistic timing |
|---|---|---|
| **Exists today** | Exact wordmark and )( SVGs; final label copy and INCI for all four SKUs; final label artwork in Figma/PDF; one correct pack render (Barrier) | Now |
| **One studio day** | H1 packshot on colour-matched surface ×4; P1 front/back/¾ ×4; T2 texture stills ×4; P2 pack-in-hand ×4 | 1–2 weeks |
| **Production + casting** | A1 application clips, S1 real skin, S2 SPF finish proof, R1/R2 layering films, U1 UGC | 3–6 weeks |
| **Requires real operations** | Reviews, COD, delivery promises, returns policy, testing claims | Launch-dependent |

Whatever route wins, **Tier 2 is mandatory**. No route can be desirable with wrong-label renders.

---

## 1. Route A — SWATCH II (evolve v11)

**Concept.** Texture first. "Before anyone buys skincare, they swatch it." Colour tells you which product it is. Texture is what we sell emotionally. The site is a sequence of tactile moments.

**Hero.** One product at a time on its matched-colour surface. The exact wordmark sits cropped behind it. A horizontal snap changes the SKU, and the whole hero field recolours. A press-and-hold on the pack (replacing v11's drag-down, which fights vertical page scroll) reveals a texture loop under the finger. Add-with-price CTA plus a routine link.

**Nav.** Minimal: )( · Routine · Formulas · عربي · Bag. Everything else lives in the footer.

**Product representation.** A pack on a colour field plus texture macro video. Each SKU "owns" a full-bleed colour surface.

**Motion.** Texture video scrubbed by touch; colour-field crossfades between SKUs; 200–300 ms UI transitions.

**Type.** Condensed display for product names and prices; Inter for UI; Alexandria / Plex Arabic.

**PDP.** Texture-first gallery: the loop is frame 1 and the pack is frame 2. Accordions below.

**Cart.** Standard drawer with a colour cue per line.

**Mobile.** Swipe hero, texture wall grid, finish panels, UGC strip.

**Arabic.** The gesture is direction-neutral (hold). Copy is re-authored.

**Interaction philosophy.** "Touch it to feel it."

**Risks.** Press-and-hold is undiscoverable and collides with iOS long-press/context menus. The route needs T1 video ×4 (≈600 KB each) to have any concept at all. Colour-field chapters drift back toward v7's pastel chapters.

**Ruthless critique**
- *Distinctiveness 2/5.* Texture macros are the category default: Rhode, Summer Fridays, Glossier and Topicals all do it. The only ownable part was the gesture, and in v11 that never ran.
- *Desire 5/5 with media, 1/5 without.* Today it sits at 1: CSS gradients pretending to be texture. That is exactly the "prototype" verdict.
- *Clarity 3/5.* The hero changes colour, copy and price on every swipe, so there is a lot of state to parse in three seconds.
- *Conversion 3/5.* The active CTA is good. The texture wall adds a click without adding information until real media exists.
- *Mobile 2/5.* Any vertical or hold gesture on a pack that fills most of the viewport competes with page scroll. `touch-action` trade-offs create scroll traps.
- *Speed 2/5.* The signature depends on video. It can be lazy-loaded, but the concept is heavy by nature.
- *Scale 2/5.* 20 SKUs cannot each own a colour field, so the system collapses into a candy wall.
- *RTL 4/5.* The hold gesture is neutral.

**Verdict:** highest ceiling, lowest floor. It has failed once already for the reason in §0.2. **Not selected.**

---

## 2. Route B — FRONT / BACK  ✅ SELECTED

**Concept.** *Every product has two sides. The front is why you want it. The back is why you can trust it.*
Offline, you pick up a skincare product and turn it over. Online, beauty sites bury the back in accordions. BTS makes the back a designed, first-class face, and borrows its whole graphic language from the real pack: white type on matte colour, the stacked condensed wordmark, rounded claim pills, the )( mark and the size line. The site looks like the product because it is built from the product. It invents no new aesthetic, blobs or apertures.

This also answers the founder's content mix structurally. The **front** carries desire, product and texture (≈55%). The **back** carries efficacy, ingredients and routine (≈35%). Climate appears as one sentence on the back and one page in the site (≈10%).

**Hero (mobile, 390 × 844).**
- Header, 52 px.
- **The Shelf:** a native CSS scroll-snap row of four **front faces**. The active card is 82 vw wide and the next card peeks by about 10 vw, which says "there are four" without dots. Each face is an H1 photograph: the real pack on its colour-matched surface with a true contact shadow. A small square **swatch chip** (T2 texture still, 1:1, labelled "Clear gel" / "Fluid serum" / "Soft cream" / "Light SPF") sits in the lower inline-end corner.
- Below the card, in a fixed-height block (no CLS on swipe): `01 · Cleanse · 200 mL`, the product name in condensed display, and one promise line taken verbatim from the front label.
- Buy row: **[Add · EGP 399]** as primary, plus **[↻ Turn over]**, a 52 px secondary control.
- Routine strip at the bottom of the first viewport: `All four · EGP 1,661 · save EGP 185 →`. It opens the routine sheet, which has one Add. That makes the routine 2 taps from landing.
- The height budget (header 52 + card ≤ `min(420px, 100svh − 360px)` + info 96 + buy 52 + strip 56 + gaps) fits 375 × 667 without scrolling to price.

**Hero (desktop, 1440 × 900).** Top band: the exact wordmark SVG as a large editorial object on the inline-start side, about 300 px tall, with "fresh skin. always." and the routine offer (price, save, **Add all four**) on the inline-end side. Below it, the four front faces sit in one row at identical scale. That row is the shelf: all four prices are visible at once and each card can be turned over. This passes the three-second test: brand, products, prices, buy one, buy all four and save.

**Signature interaction: Turn it over.**
- Tapping **↻ Turn over** rotates the card 180° (320 ms, perspective 1200 px, `backface-visibility: hidden`).
- The back is live HTML in the pack's graphic system on the matte pack colour. From top to bottom: the exact wordmark SVG as it sits on the pack; claim pills (label pills only, such as *Non-stripping · Soap-free · Non-comedogenic*); the label's "does" line; **three key ingredients, each with a one-line "why it's here"**; *Feels like*; *Use: AM + PM · step 01*; *Full INCI →* (opens a sheet).
- **The Add button does not move and does not change between faces.** Turning over is a way of reading, never a detour away from buying.
- Tapping the photo goes to the PDP. Only the explicit control turns the card, so there is no ambiguous "did I flip or navigate?" moment.
- Both faces are always in the DOM. The hidden face is `inert`. The control is `aria-pressed` with the label "Show the back of the pack".
- In RTL, the turn follows the reading direction (one CSS variable). Pack photography never mirrors.
- Reduced motion: a 120 ms crossfade and no rotation.
- The same component appears on the home shelf, Shop cards, PDP first frame, quick view, search results and the Finder result. **One component, everywhere.** That is what makes it a system rather than a trick.

**Nav.** Text-first, native-app restraint. Mobile: `≡ · )( · Shop · Routine · ع · Bag 2`. The Menu sheet opens with the search field at the top, followed by Shop / Routine / Find your routine / Ingredients / Learn / About / Help. Full detail is in the architecture doc.

**Product representation.**
- Front: H1 photography on matched surfaces. Never a transparent cutout on a contrasting ground.
- Back: typographic HTML plus a P1 back-of-pack photograph in the PDP gallery.
- Lists (drawer, search, cart): a 40 px **cap chip**, meaning a pack thumbnail on its colour square. Colour encodes the product and nothing more.
- The page ground stays off-white. Colour only appears on product faces. There are no pastel section chapters.

**Motion.** There is one signature motion (the turn). Shelf movement is native scroll-snap with zero JS animation. Drawer and sheets use a 240 ms translate. The Add button morphs to "Added ✓" for 1.2 s. Nothing animates on scroll. There is no parallax, no pinned sections and no intro. Video plays only on tap, and only inside the PDP gallery.

**Type.**
- The exact wordmark SVG appears only where the pack has it (desktop hero band, back faces, footer). It is never set in a font.
- The condensed display face is used only for product names and the PDP title, with at most one display element per viewport.
- UI and body text use a neutral grotesk at 16 px on mobile.
- Back-face body copy uses the label's secondary typeface (confirm the family from the Figma file and its web licence). The fallback is the UI grotesk.
- Arabic uses an authored display and UI pair (see Arabic below).

**PDP.** The first viewport is a gallery whose first frame is the front face with **Turn over**, followed by: P1 back photograph → T2 texture → P2 in hand → A1 application (tap to play) → S1 skin. Frames only render if the real asset exists. Beside or below the gallery: step · role · size, name, promise, "For oily to combination skin" (label), price, Add, and the routine line "Part of the Routine · all four EGP 1,661". Below that, **The Back** expands as a full page section (claims → three ingredients with why → formula logic → full INCI), then How to use, Where it sits (previous and next step), one approach paragraph, reviews (real only), and product FAQ. A sticky Add appears once the primary button leaves the viewport.

**Cart.** An inline-end drawer with cap-chip lines and editable quantities. It suggests at most **one** thing: the Routine swap when it genuinely saves money. There is no tray or progress bar.

**Mobile.** Everything above is specified mobile-first. Desktop is the extrapolation.

**Arabic.**
- The back is re-composed for Arabic rather than mirrored. Arabic benefit headline first. Latin ingredient names sit in `<bdi dir="ltr">` beside Arabic explanations. The INCI stays a Latin LTR block under an Arabic heading.
- Claim pills are localised only where the Arabic claim wording has been approved.
- The turn follows reading direction. The shelf starts at the inline-start edge in RTL (step 01 on the right).
- Prices render as `1,661 ج.م` in `<bdi>`.
- The copy addresses the reader in the feminine, as v11 does. **This is a founder decision to make explicitly**, because SPF and cleanser have a unisex market and feminine address excludes it.

**Interaction philosophy.** Nothing moves unless you touch it, and everything you touch tells you something that helps you buy.

**Risks, and how we contain them.**
1. *"Card flip" reads as a 2012 gimmick.* Contained by making the back genuinely useful and pack-authentic (real pills, real INCI, real ingredient logic), keeping the motion physical rather than bouncy, and using it for exactly one job.
2. *"Every SKU inside a huge pastel rectangle"* (explicitly banned). The front face is a **photograph** of a real surface, not a CSS fill. Flat colour appears only on the back, which is a reading surface the user chooses to open. Section backgrounds stay off-white.
3. *Desire depends on H1 photography quality.* If the packshots are mediocre, the route is mediocre. H1 is therefore P0 and gets a real studio day, not AI.
4. *The back drifts into clinical or Typology territory.* Contained by the rules of three ingredients maximum, one-line "why" statements, a consumer voice ("Clean, not squeaky."), and the full INCI one tap deeper.
5. *White-on-pastel text fails WCAG contrast* (pack typography is white on 345 U / 304 U / 2562 U / 163 U, roughly 1.5–2 : 1). All informative text on backs is **ink**. White is reserved for the wordmark and non-essential display.
6. *Discoverability of the turn.* It is an explicit labelled control, not a hidden gesture. On first visit, the shelf's active card shows the label "Turn over" in full; after the first use it collapses to the icon.

**Ruthless critique**
- *Distinctiveness 4/5.* No benchmark uses the back of the pack as its core information architecture. It is ownable because it is literally our label. It loses a point because card-turn as a pattern has prior art.
- *Desire 3/5 today, 4/5 with Tier 2 media.* It is honest about its ceiling: it sells the object, not a fantasy. Its floor is far higher than A's because it needs 16 studio stills, not 30 films.
- *Clarity 5/5.* The front answers what, how much and buy. The back answers what's in it and why. No hunting.
- *Conversion 4/5.* The CTA is fixed in place across both faces. Objection-handling (INCI, pills, suitability) sits one tap from the price without leaving the page. The routine is 2 taps from landing.
- *Mobile 4/5.* Native scroll-snap and one explicit button, with no gesture conflicts.
- *Speed 5/5.* Static images, a CSS class toggle, and no video on any critical path.
- *Scale 5/5.* Every future SKU has a front and a back. The component is data-driven from one metaobject. Twenty SKUs are twenty cards in a grid, all turnable.
- *RTL 4/5.* Faces re-compose, and the photograph and turn logic are direction-neutral.

---

## 3. Route C — THE SET (routine as the product)

**Concept.** "Your routine is the product." The site is organised around a persistent 4-slot routine tray, like a mini-player docked above the bottom edge on mobile. Every product action is "put it in slot 02". The tray shows the running total and a savings state, and fills with colour as steps are added.

**Hero.** An empty four-slot routine drawn at full width: `01 Cleanse · 02 Treat · 03 Moisturize · 04 Protect`. One tap on "Fill it" drops all four packs into their slots and shows EGP 1,661. Singles are reached by tapping an individual slot.

**Nav.** App-like: bottom tab bar (Home / Shop / Routine / Bag) plus a top search bar.

**Product representation.** Compact product thumbnails with dense commerce data (price, step, size, pills) in list rows.

**Motion.** Packs animate into tray slots and the tray counter ticks.

**Type.** A single UI grotesk throughout. Condensed display only on the wordmark.

**PDP.** "Slot 02 · Treat". The primary CTA is "Put in routine". The single add is secondary.

**Cart.** The tray is the cart. Checkout sits on the tray.

**Mobile.** Tray, bottom tabs, sheets. It feels like a delivery app.

**Arabic.** Slots reflow right to left. The tray progress runs RTL.

**Interaction philosophy.** "Every tap builds your routine."

**Risks.** Gamified savings language, forced-bundle psychology, stacked fixed UI.

**Ruthless critique**
- *Distinctiveness 2/5.* Routine and bundle builders are common (Naturium, Fenty "start'r" sets). The tray reads like a food-delivery app.
- *Desire 1/5.* The brand becomes a checkout mechanic. It fails the founder's first instruction: lead with desire, product and texture.
- *Clarity 4/5.* It is extremely clear about what to buy.
- *Conversion 4/5 short-term, but at brand risk.* It makes singles feel second-class, which the CRO playbook forbids ("don't force bundles, don't hide singles"). "Unlock / you're 2 away" reads as promotional and discount-led.
- *Mobile 3/5.* Header, tray, bottom tabs and sticky ATC together make four fixed layers on a 667 px phone.
- *Speed 4/5.* It is light.
- *Scale 2/5.* Once a step has two products (two SPFs, a PM-only treatment), the tray becomes a configurator.
- *RTL 3/5.* It works, but progress bars and counters need careful bidi handling.

**Verdict:** the best mechanics and the worst brand. Its mechanics belong in the cart drawer and nowhere else. **Not selected.**

---

## 4. Scorecard

| Criterion | A · SWATCH II | **B · FRONT / BACK** | C · THE SET |
|---|---|---|---|
| Distinctiveness | 2 | **4** | 2 |
| Desire (today → with Tier 2) | 1 → 5 | **3 → 4** | 1 → 2 |
| Clarity | 3 | **5** | 4 |
| Conversion | 3 | **4** | 4 |
| Mobile | 2 | **4** | 3 |
| Speed | 2 | **5** | 4 |
| Scale (20+ SKUs) | 2 | **5** | 2 |
| RTL | 4 | **4** | 3 |
| Works with assets we will have | ✗ | **✓** | ✓ |

---

## 5. Decision: Route B, FRONT / BACK

### Why it is better
1. **It breaks the failure pattern.** Its desire comes from the one asset that is already excellent: the physical pack family, whose bold stacked wordmark on matte pastel is genuinely strong design. It needs one studio day to be finished, not a film production.
2. **The signature does a commercial job.** In-store, turning the pack over is the moment of trust. Here it removes the #1 skincare purchase objection ("what's actually in it?") without navigation, and the Add button never moves.
3. **It is a system, not a homepage.** One product-face component powers the home shelf, Shop, PDP, quick view, search, Finder and the drawer (as the cap chip). Engineering builds it once and it scales to 20+ SKUs from data.
4. **It enforces claim discipline by design.** The back can only render what exists in the label and substantiation data. Fabricated claims have nowhere to go.
5. **It is the fastest route**, with no video, WebGL or scroll logic on any critical path.
6. **It keeps climate where the founder wants it:** one line on the back and one page, never the headline.

### What the founder should know is weaker
- Route B's peak emotion is lower than a fully produced Route A. We are trading the highest possible ceiling for a floor that cannot collapse. The emotional ceiling rises again as Tier 3 media (application, skin, UGC) lands in the gallery, the campaign frame and Learn. It never has to land in the hero.

### Contamination rules: what must not leak into Route B

**From Route A (SWATCH):**
- ✗ No drag, hold or scrub gestures on packs.
- ✗ No full-bleed colour-field section chapters, and no page-wide recolouring based on the active SKU (v11's `data-active` root tint).
- ✗ No autoplay texture video anywhere above the fold, and never in the hero.
- ✗ No "Swatch it before you buy it" copy or any promise of an interaction we do not ship.
- ✗ No "texture wall" grid of media-pending tiles.
- ✓ Allowed: T2 texture **stills** as the swatch chip and gallery frame 3; T1 loops **inside the PDP gallery, tap-to-play**.

**From Route C (THE SET):**
- ✗ No persistent tray, bottom tab bar, progress bar, or "unlock / you're X away" language.
- ✗ No slot metaphors on cards or PDPs. Singles are first-class.
- ✗ No upsell interstitials on add.
- ✓ Allowed: in the drawer only, the one-line "Switch to the Routine · save EGP 185" swap and a step-labelled missing-step suggestion. The routine price appears as a secondary line on PDPs.

**From v7–v11 generally:**
- ✗ No environment or climate tabs, weather vocabulary in UI, aperture or bracket shapes, wordmark-as-background texture, giant all-caps poster headings, scroll reveals, or "media pending" tiles in any founder-facing build.
- ✗ No client-side language swapping.

---

## 6. v12 founder presentation gate (Route B)
A build is not shown to the founder until all of these are true:
1. **Zero label contradictions.** Every pack image matches `FINAL_LABEL_SOURCE_OF_TRUTH.md`, and an automated INCI parity check passes.
2. Within the first 3 seconds on a 390 px phone: brand, products, prices, Add one, and Add all four with the saving.
3. Turn over works on every product face, in EN and AR, with reduced motion, keyboard and screen reader.
4. Home → Add routine takes 2 taps. Ad → PDP → checkout-handoff state takes 2 taps.
5. No module renders "pending" in founder mode. Missing media hides the module; it never shows a hole.
6. Arabic is server-rendered at `/ar` and reviewed as its own composition at 375, 390 and 430 px.
7. The console shows zero errors. LCP ≤ 2.5 s (lab, mid-tier Android, 4G). CLS ≤ 0.05.
8. Climate vocabulary appears within the budget defined in the architecture doc (§13).
9. The prototype state is unmistakable wherever it matters: checkout is closed, prices are marked "prototype", sample reviews are labelled. Nothing pretends to be live.

## 7. P0 prerequisites (before any v12 visual work is reviewed)
1. Re-export all four pack renders from the **final Figma artwork**, or shoot H1. Retire `bts-reset/clarity/defense-clean-v11.*` from every template today. Barrier may stay until H1 exists.
2. Correct `BRAND_MANIFEST.md` product territories (Centella, not Green Tea; Niacinamide + Tranexamic Acid, not Zinc PCA), or mark that section as superseded.
3. Hotfix or unwire v11 on the dev theme. Its homepage is currently live in preview with wrong claims and a runtime error.
4. Book the Tier 2 studio day against the shot list in `V11_MEDIA_REQUIREMENTS.md` H1 / P1 (including **back** views) / P2 / T2. Back-of-pack photography is now mandatory for the signature.
