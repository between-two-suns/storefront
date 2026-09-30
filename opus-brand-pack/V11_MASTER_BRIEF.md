# BETWEEN TWO SUNS — OPUS CREATIVE DIRECTOR MASTER BRIEF v11

You are Claude Opus. You are the LEAD CREATIVE DIRECTOR, DIGITAL DESIGNER, and ecommerce experience owner for this redesign. The assistant will review your work critically, but you own the design direction.

The founder's feedback on every previous version is decisive:
- site feels incomplete
- site feels amateur / mediocre
- not jaw-dropping
- not award-level
- not enough imagery / desire / personality
- too much like a prototype rather than a full ecommerce experience
- earlier versions either felt dated "Awwwards scroll theatre" or clean-but-generic Shopify
- bad product cutouts, white/glitchy edges, and weak packshot compositing are unacceptable

AMBITION
Build a complete, mobile-first, very high-converting skincare ecommerce experience that can credibly sit in the same conversation as the world's best DTC beauty sites while being more ownable and more contemporary for BETWEEN TWO SUNS.

Audience:
- Gen Z and Millennial women
- Egypt first
- UAE / Saudi later
- bilingual English + Egyptian Arabic RTL
- fashion-aware, social-first, visually literate
- wants efficacy but dislikes clinical coldness
- wants quick understanding + fast purchase

DO NOT COPY benchmark sites. Read:
- opus-brand-pack/BENCHMARK_LEARNINGS.md
- opus-brand-pack/BRAND_MANIFEST.md
- opus-brand-pack/FINAL_LABEL_SOURCE_OF_TRUTH.md
- opus-brand-pack/INGREDIENT_EDUCATION_BRIEF.md
- opus-brand-pack/ARABIC_RTL_BRIEF.md
- opus-brand-pack/PRICING_SOURCE_OF_TRUTH.md

Also inspect the current v10 files and screenshots. Assume the founder's criticism is correct even if parts are competent.

NON-NEGOTIABLE BRAND
- exact BTS wordmark SVG and )( icon
- matte pack family
- Cleanser Pantone 345 U mint
- Serum Pantone 304 U powder blue
- Moisturizer Pantone 2562 U lilac
- SPF Pantone 163 U peach
- off-white / warm neutral ground
- "fresh skin. always."
- climate-adapted skincare is the product truth, NOT every headline
- condensed display type is a brand device, not the only typography
- no dark spa luxury
- no beige "quiet luxury"
- no clinical dashboard
- no weather app
- no generic blobs/droplets
- no social-media-style chaos for its own sake

WORKING PRICES FOR INTERNAL PROTOTYPE
- Reset 399 EGP
- Clarity 499 EGP
- Barrier 449 EGP
- Defense 499 EGP
- full routine list value 1,846 EGP
- routine price 1,661 EGP
- save 185 EGP / 10%
Do not show the 12.5% modeled effective discount.

REVIEWS
For internal prototype only, you MAY design a full rating/review system and insert sample content if it is CLEARLY marked in code/UI as SAMPLE / PLACEHOLDER so it cannot be mistaken for genuine customer reviews. Do NOT present fabricated testimonials, verified-buyer labels, ratings, dermatologist approval, clinical results or test statistics as real. The visual module should be production-ready so real data can replace samples later.

TRUST BADGES
Allowed if supported by final label or factual operations, e.g. product-specific:
- soap-free
- non-stripping
- non-comedogenic
- fragrance-free where final label says it
- non-greasy
- no white cast
- hydrating
- made in Egypt if final artwork says it
Do not invent clinical or dermatologist badges.

CORE CREATIVE REQUIREMENT
Create ONE complete design world, not a string of disconnected sections.
The experience needs:
- emotional desire
- tactile skincare
- identity
- useful science
- direct shopping
- routine/AOV logic
- social energy
- trust
- service
- editorial depth
- true mobile craft
- excellent Arabic craft

DO NOT make the hero "four isolated bottles on cream with a black CTA."
DO NOT make product discovery a generic carousel or card grid.
DO NOT make the site a series of giant all-caps posters.
DO NOT make every SKU live inside a huge pastel rectangle.
DO NOT use bad transparent cutouts on contrasting backgrounds. If current pack images contain white/mask artefacts, either place them on a compatible neutral/media treatment or exclude those renders until fixed. The final design should specify exactly what clean packshots / photography are required.

SIGNATURE INTERACTION
The site needs ONE extraordinary, ownable interaction that feels native to BTS and helps shopping.
It can use:
- the "between" idea
- four products / four steps
- AM→PM
- tactile product/texture exploration
But it must NOT be passive scroll spectacle.
Direct manipulation is preferred.
It must have a reduced-motion fallback.
It must work on mobile first.

FULL SITE — NOT JUST HOMEPAGE
Design and implement enough of the theme to feel like a real finished ecommerce brand:

1. HOMEPAGE
- strong hero
- immediate shop path
- product discovery
- routine / bundle
- sensorial imagery module
- formula/ingredient education
- proof/reviews module (placeholder sample only in internal theme)
- one climate-adapted education module
- brand/culture/personality moment
- trust/service/delivery/payment module
- email/WhatsApp capture
- full footer

2. SHOP / COLLECTION EXPERIENCE
With only 4 SKUs, keep it elegant.
- all four products
- routine bundle
- product purpose/role
- quick add
- no pointless filters
- mobile excellent

3. PRODUCT DETAIL PAGE SYSTEM
First viewport:
- product media
- name
- role
- price
- size
- rating module (sample placeholder internally)
- 1-line value proposition
- skin suitability
- Add to Bag
- routine upgrade
- delivery/COD/payment reassurance
Then:
- texture/application media
- why the formula
- hero ingredients
- full INCI
- how to use
- AM/PM placement
- results/proof only if real
- reviews
- related routine step

4. ROUTINE PAGE
- complete four-step routine
- AM/PM
- value/savings
- why products work together
- one-tap add
- individual product escape hatches
- educational, not quiz-y

5. BRAND / ABOUT PAGE
- what climate-adapted skincare means
- product philosophy
- why Egypt / real-life conditions without cliché
- brand personality
- not founder-heavy unless material exists

6. HELP / TRUST
- delivery
- COD/payment
- returns/exchanges
- contact/WhatsApp
- FAQs
- bilingual

7. CART DRAWER
- instant
- editable
- actual subtotal
- routine bundle logic
- complete-your-routine only if relevant
- no dark patterns

8. ARABIC/RTL
- same creative authority
- distinct line breaks/composition where needed
- no mechanical mirroring
- mixed Latin/Arabic data handled intentionally

MEDIA
Before generating anything, you must create a FINAL MEDIA REQUIREMENTS sheet for the chosen design:
For every image/video asset specify:
- page/section
- exact subject
- orientation/aspect ratio
- composition
- lighting
- background
- skin tone if human
- product(s)
- texture/application
- whether exact pack artwork must be composited afterward
- mobile crop
- desktop crop
- why the asset exists
- whether AI generation is acceptable or whether final photography is preferable

Do not start generating media yet.

IMPLEMENTATION
Create a new v11 system rather than patching v10 indefinitely.
You may create:
- sections/bts-home-v11.liquid
- assets/bts-home-v11.css
- assets/bts-home-v11.js
- supporting sections/snippets/templates for PDP/routine/about/help as needed
- a design doc in opus-brand-pack/V11_DESIGN_SYSTEM.md
- opus-brand-pack/V11_MEDIA_REQUIREMENTS.md

Do not activate v11 on Shopify until the first live screenshots pass your own creative review.
First implement locally on branch build/vertical-slice.
Then render screenshots at:
- 375, 390, 430 mobile
- 1440 desktop
- English and Arabic
Then review your own render and iterate before you say it is ready.

At the end:
- commit your changes
- output a concise changelog
- include your own GO/NO-GO
- include the top remaining weaknesses
