# BETWEEN TWO SUNS — V12 INDEPENDENT REVIEW
Reviewer: ChatGPT · CRO / UX / commercial gate · 2026-09-30

## Decision
**CONDITIONALLY APPROVED: Route B — FRONT / BACK.**
It is materially stronger than SWATCH II and THE SET because it is rooted in an owned brand object (the real pack), works with static assets, keeps commerce visible, scales to more SKUs, and does not require heavy motion or fake media to feel intentional.

It is **not yet approved for blind implementation exactly as written**. The central risk is that engineering treats front/back as a literal flip-card component repeated everywhere. The interaction is the grammar, not the whole art direction.

## What is exceptional
1. The concept comes from the product rather than web-design fashion. Front = desire / Back = proof is understandable, ownable and commercially useful.
2. It solves the current asset problem: excellent still photography can carry launch rather than waiting for texture films, UGC and application footage.
3. Commerce remains primary. Price and Add stay outside the turn; product information does not require interaction; routine is reachable quickly.
4. The system has a credible scale path beyond four SKUs.
5. Prototype/launch separation is disciplined: draft products, EGP 0, prototype pricing, no fake inventory and no fake checkout are correctly separated.
6. Arabic/RTL is architectural rather than a JS string swap.
7. Performance discipline is strong: static LCP media, no scroll theatre, tight budgets and reduced-motion behavior.

## What is weak or too generic
1. Card flip itself is not award-worthy. Repeating the same turn component on Home, Shop, PDP, quick view, search and Finder would make the site a component demo.
2. The desktop hero is under-resolved creatively. Large wordmark + four products in a row can still become a premium Shopify grid with better typography. It needs a stronger art-directed family composition.
3. The mobile first viewport is over-engineered around fitting everything above 667px. Forcing image, identity, price/Add, turn and routine strip into one viewport risks making the pack too small.
4. The route lacks a strong emotional beauty moment. Formula transparency builds trust but not aspiration by itself.
5. The proposed mobile nav is too busy. Shop and Routine do not both need persistent header positions.
6. The architecture risks launch bloat. Learn, Ingredients, Climate, About, Finder, Routine and Bundles are valid, but not all deserve equal launch priority.

## What can hurt conversion
- All purchase-critical facts must remain visible without turning.
- Turn Over on every listing card adds decision noise. Home flagship/shelf and PDP get the signature; standard Shop grid gets restrained proof/quick facts.
- Routine pricing/savings must never appear unless the centralized source guarantees it.
- Cart routine conversion must not replace a simpler missing-step cross-sell when the economics do not favor the bundle.
- Product Finder stays short and recommendation-oriented, never diagnostic.
- Prototype status should be discreet; noindex + disabled checkout + a small status treatment is enough.

## What can hurt performance / maintainability
- Do not instantiate 3D transform/backface behavior on compact cards across search, recommendations and Finder.
- The metaobject plan is good but close to CMS over-modeling for four SKUs. Seed only fields needed for first release while preserving extensibility.
- Cart/menu/INCI/routine/search overlays need one shared overlay/focus-management contract.
- Delete the proposed prototype-review architecture. Even SAMPLE-labelled fake review-shaped content has no customer value and creates trust risk.

## Required corrections before engineering sign-off
1. **Use FRONT/BACK selectively.** Full turn: Home flagship product shelf + PDP. Optional on Routine. No turn on search, cart, predictive search, compact recommendations or Finder result cards.
2. **Re-art-direct desktop Home.** It must be a single composed family portrait/editorial commerce canvas, not four equal cards. All four SKUs remain identifiable and shoppable within three seconds.
3. **Simplify mobile header.** Persistent: menu, mark/wordmark, search, bag, language access. Shop/Routine live in menu or contextual navigation.
4. **Protect product scale on 375×667.** Do not shrink the hero to force Routine above fold. Product + promise + price/Add win; Routine may start immediately below.
5. **Define one emotional media slot.** Once real media exists, Home gets one high-impact skin/application/culture moment; PDP gets application/finish proof. Until then, omit rather than simulate.
6. **Delete sample-review architecture.** Reviews are absent/hidden until real review data exists.
7. **Prioritize launch IA.** P0: Home, Shop, PDP, Routine, Cart, Search, Help/Shipping/Returns/Contact, About/Approach, Arabic. P1: Finder, Ingredients depth, Bundles merchandising. P2: Learn/editorial expansion and account enhancements.
8. **No unverified service claims.** COD, delivery windows, returns, free-shipping threshold and BNPL render only from approved service-policy data.
9. **Exact pack fidelity is release-blocking.** Wrong Green Tea / Niacinimide / Face Sunscreen renders cannot appear anywhere, including founder prototype.
10. **Do not inherit v11 chrome or cart.** One global header, one footer, one cart adapter, one bag count.

## Creative gate for the first implemented slice
The first founder-facing V12 slice is approved only if:
- At 390×844 and 375×667, the pack is large enough to feel desirable, not merely legible.
- Within three seconds: brand, product, core benefit, price and Add are clear.
- Turning adds proof but is never required to understand or buy.
- Desktop reads as an art-directed BTS composition, not a four-card collection grid.
- Removing the turn animation still leaves a recognizably BTS page.
- No wrong labels, placeholder media, fake reviews, invented operations or EGP 0 commerce.
- Arabic is server-rendered RTL and visually QA'd, not merely translated.
- No console errors, duplicate chrome, duplicate cart state or focus traps.
- LCP/CLS/interaction budgets remain inside the V12 spec.

## Final commercial judgment
Route B is the right foundation **with these corrections**. Route A is too dependent on media and too category-familiar; Route C over-prioritizes routine mechanics and would make a beauty brand feel like a utility app. FRONT / BACK has the best balance of distinctiveness, trust, conversion, feasibility and scale, but only if implementation avoids turning every surface into a flip-card gimmick.

**Engineering may proceed only against the corrected Route B, not the unmodified Opus draft.**
