# BETWEEN TWO SUNS — V12 INDEPENDENT CRO / UX / COMMERCIAL REVIEW GATE
Reviewer: ChatGPT · 2026-09-29
Reviewed: V12_CREATIVE_DIRECTIONS.md

## Decision
APPROVE ROUTE B — FRONT / BACK — WITH CONDITIONS.

The route is strategically stronger than SWATCH II and THE SET because it is directly derived from BTS's physical packaging, survives missing video media, keeps purchase action visible, scales to future SKUs, and can be fast. It also creates a useful bridge between desire (front) and proof (back), rather than adding interaction as decoration.

It is NOT approved as a generic 3D “flip card” pattern. The physicality, information architecture, typography and photography must make the interaction unmistakably BTS.

## Mandatory adjustments before implementation
1. **The front/back motion must feel like handling an object, not a UI demo.**
   - One restrained 280–340ms physical turn.
   - Real perspective/contact-shadow response.
   - No bouncy easing, glossy 3D, floating card, or novelty animation.
   - Reduced motion = immediate crossfade.
   - Motion never displaces Add / price.

2. **Do not overload the first 667px mobile viewport.**
   - Essential order: product visual → product identity/outcome → price/Add → routine escape hatch.
   - “Turn over” can sit beside or beneath Add, but must not compete with the primary CTA.
   - Test 375×667, not just 390×844. If the routine strip creates crowding, allow it to begin immediately below the fold rather than shrinking the product.

3. **Desktop needs a flagship composition, not four ecommerce cards in a row.**
   - The four-product shelf must read as one art-directed family portrait.
   - Exact wordmark may act as a restrained editorial object, but cannot become background wallpaper.
   - All four products and direct shopping remain legible within three seconds.
   - Avoid “product grid wearing a fancy header.”

4. **The back face must be ruthless about information density.**
   - Max 3 key ingredients in the primary back.
   - Exact approved claim pills only.
   - One “why this formula” sentence.
   - Full INCI, cautions and depth go into the sheet / PDP.
   - The turn should reduce uncertainty, not create a textbook.

5. **Keep the emotional layer alive.**
   - FRONT / BACK solves clarity and trust but risks becoming packaging-system design rather than beauty desire.
   - Home still needs one strong skin/application/culture moment once real media exists.
   - Until that media exists, use composition, scale, surface, shadow, crop and typography—not fake lifestyle placeholders—to create desire.
6. **Arabic must be authored, but branded product names should not be casually translated.**
   - Keep approved English product names where they function as packaging names unless an Arabic naming system is formally approved.
   - Translate/rewrite role, benefit, how-to, support, finder and service copy in natural contemporary Arabic.
   - Do not invent Arabic product names solely to make the interface look localized.
   - Use server-rendered locale routing, bidi isolation and separate line-break QA.

7. **Do not turn product color into four pastel website chapters.**
   - Color is product identity, state and micro-navigation.
   - Site ground remains off-white/ink.
   - Pack/surface photography owns the color.
   - Back faces can use controlled product color only if text contrast remains AA.

8. **Prototype commerce must be impossible to mistake for live commerce.**
   - Scenario B display prices can be centralized in prototype mode.
   - Shopify product price/inventory remains source of truth in production mode.
   - Do not publish DRAFT products or fabricate inventory.
   - Checkout is disabled/clearly unavailable in prototype mode without visually polluting every product card with warning copy.

9. **The routine is a first-class offer but singles stay first-class.**
   - One-tap add-all in production when variants/pricing are real.
   - AM = 4, PM = 3 must be obvious.
   - No unlock/progress gamification.
   - No automatic “bundle saving” claim unless the real bundle/discount implementation guarantees it.

10. **Trust UI must wait for facts.**
   - No zero-review placeholder that looks real.
   - No fake testing, dermatologist, COD, delivery or return reassurance.
   - Ingredient transparency and final-label claims are the launch trust layer until operational proof exists.

## Commercial / CRO gate
The winning system must satisfy these on a real phone:
- Brand + product + primary benefit + price + Add are understood without interaction.
- Turn Over is optional enrichment, never required to purchase.
- Full routine is reachable within 2 taps.
- PDP Add remains accessible after the primary CTA leaves view.
- Cart recommends only the genuinely relevant missing step / routine conversion.
- No interaction blocks checkout.
- Search / Shop / Routine are one gesture or one tap from navigation.

## Distinctiveness gate
If the card-turn interaction is removed, the remaining visual system still has to look recognizably BTS because of:
- exact wordmark and )( mark,
- packaging proportions and matte material,
- four pack colors,
- front/back information architecture,
- asymmetric editorial crop/scale,
- routine sequence,
- concise formula language.

If the build looks like a Shopify beauty theme plus a flip animation, REJECT.

## Implementation approval
Opus may proceed to architecture/build only after incorporating these conditions. Codex must then review the resulting implementation for runtime errors, hard-coded commerce data, semantic/inert behavior, keyboard/focus order, locale routing, performance, and maintainability.
