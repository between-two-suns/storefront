# BETWEEN TWO SUNS — Egyptian Arabic / RTL Design Brief

Arabic is a first-class design system, not a translated mode.

## Core rule
The English and Arabic experiences must feel like the same brand, but they do NOT have to be pixel-for-pixel mirrors.

Design every major composition in both:
- English / LTR
- Egyptian Arabic / RTL

before it is considered approved.

## Language strategy
- Consumer-facing marketing copy: natural contemporary Egyptian Arabic.
- Avoid stiff literal MSA translations for headlines, buttons and product education.
- Avoid slang that feels unserious or too local to scale.
- Regulatory / legal / INCI / required warnings: use the formally appropriate Arabic language where needed.
- Ingredient scientific names may remain in Latin where clearer, with Arabic explanation beside/below.
- Product names may remain in English when they function as branded names, with Arabic role/supporting copy around them.

## Tone
Arabic should feel:
- modern
- concise
- confident
- beauty-editorial
- intelligent
- warm
- not overly clinical
- not gimmicky
- not "translated"

## Typography
- Do not use an automatic browser fallback as the final Arabic type system.
- Choose a high-quality Arabic display face that can carry the same fashion/editorial authority as the English condensed display system without imitating Latin letterforms unnaturally.
- Pair it with a highly legible Arabic UI/body face.
- Arabic needs different line lengths, line-height, tracking behavior and scale from English.
- Do not force Arabic into the exact same line breaks or container widths as English.
- The exact BTS Latin wordmark remains the brand logo; do not transliterate or recreate it in Arabic unless a separate approved Arabic wordmark is commissioned.

## Layout / mirroring
Mirror reading logic, not physical assets.
- Text alignment: RTL.
- Navigation order: RTL.
- Step progression: visually right-to-left in Arabic when it represents reading order.
- Directional arrows / chevrons: mirror where semantic.
- Product photography: never flip.
- Logo: never flip.
- Non-directional icons: do not mirror unnecessarily.
- Signature interactions should be direction-neutral whenever possible so the experience does not feel like an English interaction reversed in software.

## AM / PM routine
Arabic routine state should read naturally from right to left.
- 01 RESET → 02 CLARITY → 03 BARRIER → 04 DEFENSE should progress in the visual direction of Arabic reading.
- Keep step numbering semantically stable.
- Switching AM→PM should remove SPF and recompose the remaining three in RTL, not reuse LTR coordinates.
- Test bidi behavior when Latin product names, Arabic copy and numerals appear in the same line.

## Ecommerce UI
Arabic purchase UI must be designed separately:
- Add to Bag / Quick Add
- Complete Routine
- Reviews
- price / currency
- delivery date
- COD
- cart drawer
- quantity controls
- promo / savings
- checkout handoff

Do not rely on a CSS direction flip alone.

## Currency / numbers
Test both readability and local convention.
- English: EGP 1,250
- Arabic: e.g. 1,250 ج.م or the approved localized equivalent
- Preserve numerals consistently across product prices, percentages, SPF, ingredient concentrations and steps.
- Use bidi-isolation for mixed Arabic/Latin data such as SPF 50, 5% Niacinamide, product names and SKUs.

## Ingredient education
Arabic ingredient education must be rewritten, not literally translated.
Structure:
1. short benefit headline in Egyptian Arabic
2. ingredient / technology name
3. why it is in THIS formula
4. deeper science only on expansion

Avoid awkward Arabic transliterations when a clear Arabic concept is better.
Keep scientific accuracy.

Example tone:
English: "Oil balance, without over-cleansing."
Arabic direction: natural Egyptian phrasing with the same confidence, not a word-for-word translation.

## Mobile
Arabic mobile is a separate QA track at:
- 375 px
- 390 px
- 430 px

Check:
- line breaks
- mixed-direction text
- button labels
- tap targets
- sticky add-to-bag
- bottom sheets
- cart drawer
- routine reflow
- typography overflow
- product-name wrapping
- price/currency placement

## Motion
Motion should respect reading direction only where the meaning is directional.
Avoid making every transition reverse simply because the page is RTL.
The signature BTS gesture should work equally well with either hand and in either language.

## Navigation
Language switch must be visible and lightweight.
Do not bury Arabic inside a menu if market testing shows it is a primary language.
Preserve user language choice across sessions.

## SEO / technical
- Separate localized URLs / Shopify Markets language routing as appropriate.
- hreflang / canonical logic must be correct.
- Arabic metadata, product titles, alt text and structured data must be localized.
- Do not machine-translate product claims without review.

## Presentation gate
No BTS page is considered finished until English and Arabic are both visually approved.
Arabic cannot be postponed to the end as a translation pass.
