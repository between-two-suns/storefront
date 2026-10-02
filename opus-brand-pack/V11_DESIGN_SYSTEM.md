# BETWEEN TWO SUNS — V11 DESIGN SYSTEM
Lead: Claude Opus
Direction: SWATCH

## Master idea
Before anyone buys skincare, they swatch it on the back of their hand. The entire site works like that moment: what does it feel like, and what will it do for my skin?

Colour tells you which product you are looking at.
Texture is what the brand sells emotionally.
The exact BTS wordmark is the signature.
Climate-adapted is formulation proof, never the whole story.

Core line: fresh skin. always.

## Homepage — 7-screen rhythm
1. HERO / THE SWATCH RAIL
- Four packs, each on a real matched-colour surface: mint / powder blue / lilac / peach.
- Real contact shadow, no floating transparent cutout treatment.
- Exact wordmark runs full-width behind/cropped by product.
- Mobile horizontal snap changes active product, colour field, one-line promise and sticky product CTA.
- Active CTA includes product + price.
- Drag-to-Swatch signature interaction lives here.
- Full routine is reachable immediately.

2. ROUTINE OFFER
- Full Routine · 4 steps.
- EGP 1,661 from EGP 1,846.
- Save EGP 185 / 10%.
- AM/PM toggle: AM all 4; PM Defense leaves/dims clearly.
- One Add Routine CTA.
- This is the primary AOV module.

3. TEXTURE WALL
- Asymmetric macro grid.
- Reset gel / Clarity serum / Barrier cream / Defense SPF.
- 4–6 sec muted loops, only when in view.
- Tap tile opens quick-add / detail.

4. ON-SKIN / FINISH PROOF
- Real skin, multiple Egyptian/GCC skin tones.
- Application/finish proof.
- No clinical numbers unless substantiated.
- SPF white-cast/finish can be shown if represented honestly.

5. WHY IT WORKS
- The ONE homepage climate education moment.
- Climate is not repeated elsewhere.
- Formula-first, product-specific proof.
- No weather-app language.

6. REVIEWS / SOCIAL PROOF
- Internal prototype may contain SAMPLE / PLACEHOLDER cards only with a visible sample marker.
- No fake verified buyer, aggregate rating, dermatologist badge, or clinical data.
- Production module swaps in real reviews.

7. COMMUNITY + FOOTER
- Horizontal UGC-style media strip linked to SKUs.
- Full footer: WhatsApp/service, delivery/returns/payment links, EN/AR, social, newsletter, legal.

## Signature interaction — DRAG TO SWATCH
- Press/drag down on active pack.
- Product texture reveals/scrubs 1:1 with finger movement.
- Release settles into a swatch card: name / texture word / price / Add.
- Side swipe changes SKU and clears texture.
- First use: subtle 1.2s nudge + tiny Drag ↓ hint.
- Tap fallback.
- Reduced motion: static texture still.
- Hero LCP stays a static image.
- Texture sprite/video lazy loads after first paint.
- Target ≤600KB per texture interaction asset.

## Shop / Collection
Only 4 SKUs; no filter theatre.
- Routine bundle first as full-width offer.
- 2×2 product grid mobile, 4-up desktop.
- Strong colour field per SKU.
- Product role, concise benefit, price, quick add.
- Texture preview on long press / hover where appropriate.
- Two simple discovery modes only if useful: step / concern.

## PDP
Above fold:
- media gallery: pack / texture / on-skin / application
- role / name / one-line value prop
- price / size
- real rating/count only when available
- skin suitability
- obvious Add to Bag
- Complete Routine / save EGP 185
- delivery / COD / payment reassurance once operationally approved

Content:
- Feels like
- Does
- How to use
- AM/PM step
- Why this formula
- key ingredients (max 3 primary in main path)
- full INCI
- one short climate-adapted explanation
- reviews
- adjacent routine step only
- product FAQ

## Routine page
Builder, not article.
- AM = 4, PM = 3.
- Each step: pack + one-line reason.
- Optional concern switch can alter usage notes, never the core product set.
- Live price.
- Routine discount only when all four selected.
- One-tap add.
- 30s layering media once available.

## About
Brand philosophy first; founder material only if real and strategically useful.
- what climate-adapted means
- why the )( icon / between concept
- formulation principles
- real lab/team imagery only if available
- concise; end in routine CTA

## Help / Trust
- shipping
- COD / payment
- returns
- ingredient glossary
- patch-test guidance
- WhatsApp support
- bilingual
- no fake assurance badges

## Cart
- inline-end drawer; RTL flips side
- line item colour cue
- subtotal
- routine completion logic when 2–3 SKUs in bag
- once all 4 present, automatic routine price if implemented
- only one contextual upsell
- clear checkout
- COD/payment reassurance
- shipping threshold only if approved

## Arabic / RTL
- written natively in Egyptian Arabic
- exact Latin BTS wordmark stays unchanged
- Arabic headlines get their own hierarchy / line breaks
- INCI stays Latin
- Western digits for prices/SPF/percentages unless later deliberately localized
- CSS logical properties
- directional arrows/drawer/progress mirror semantically
- product photography never flips
- no mechanical pixel-for-pixel mirror requirement

## Visual system
TYPE
- exact wordmark SVG as brand object, used rarely
- condensed display typography only for large display/product words/prices
- neutral grotesk for functional UI/body
- dedicated Arabic display + UI hierarchy
- body target ~16px mobile for normal content

COLOUR
- off-white ground, near-black ink
- product colours used as confident full fields/media surfaces
- no beige luxury
- no glossy gradients
- do not tint the entire page endlessly in pastel

IMAGE
- real skin
- real texture
- real contact shadows
- pack media should use clean source with no matte fringe
- no stock
- no fake floating cutout over contrasting background

MOTION
- 200–300ms direct transitions
- texture is the only spectacle
- no parallax
- no pinned scroll
- no character reveal
- no mandatory intro

SPACING
- 4px base
- 24 / 48 / 96 rhythm
- colour/media can go edge-to-edge
- text stays rigorously aligned

BUTTONS
- mobile primary 52px min
- price can live inside Add CTA
- one primary action per screen
- outline secondary
- no floating pile of CTAs

## Anti-generic rules
1. No centered headline over lifestyle-photo hero.
2. No white-box product cards with soft shadows.
3. No generic clean-beauty icon rows.
4. Climate is primary on max one homepage module and one PDP paragraph.
5. No stock photography.
6. No beige/gold/serif luxury shorthand.
7. No passive scroll theatre.
8. Every section has a useful product path.
9. No black rectangle CTA bolted onto an unrelated composition.
10. No section that could be dropped into any generic skincare Shopify theme unchanged.

## Founder presentation gate
1. First 3 seconds create desire to touch the product.
2. Drag-to-Swatch feels physical and useful.
3. Routine is understandable and addable within 2 screens.
4. Mobile LCP target <2.5s; CLS <0.05.
5. Arabic feels authored.
6. No page feels like weather/dashboard.
7. Hero/media show physicality, not cutout artefacts.
8. Homepage → purchase path is 3 taps or fewer.
