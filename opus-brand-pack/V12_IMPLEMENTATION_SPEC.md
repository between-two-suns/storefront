# BETWEEN TWO SUNS — V12 IMPLEMENTATION SPEC
Lead: Claude Opus (creative systems) · Implementer: Codex · Date: 2026-09-29 · Branch: `build/vertical-slice`
Route: **B — FRONT / BACK**, approved with conditions by `V12_CHATGPT_REVIEW_GATE.md`.
Status: engineering contract. No theme code has been changed in this pass.

Read with:
- `V12_CREATIVE_DIRECTIONS.md`: route, signature interaction, contamination rules, founder gate (§6)
- `V12_EXPERIENCE_ARCHITECTURE.md` (**"Arch"** below): sitemap, modules, journeys, states matrix, analytics, SEO, Markets
- `FINAL_LABEL_SOURCE_OF_TRUTH.md`: the only source for names, front lines, pills, back descriptions and INCI
- `PRICING_SOURCE_OF_TRUTH.md`: Scenario A/B values (prototype only)
- `ARABIC_RTL_BRIEF.md`, `INGREDIENT_EDUCATION_BRIEF.md`, `CRO_PLAYBOOK.md`, `CURRENT_STORE_AUDIT_2026-09-29.md`

**How to read this document.** "MUST" is a merge-blocking requirement with an automated or scripted check. "SHOULD" is expected unless a written reason is recorded in the PR. Every file path is relative to the repo root. Where Shopify platform behaviour needs confirming on this store, the item is marked **[verify]** and must be confirmed in the PR that depends on it.

---

## 0. Non-negotiables (summary)

1. **One shell.** `layout/theme.liquid` owns header, menu, search, drawer, footer and the cart count. No section renders chrome. (§3)
2. **One product face.** `snippets/bts-face.liquid` + `assets/bts-face.js` is the only way a product appears as a card, anywhere. (§4)
3. **One cart interface, two adapters.** `prototype` (localStorage) and `launch` (Shopify Ajax Cart). One drawer UI. One count. (§7, §10)
4. **Prices exist in exactly one place per mode.** Prototype: the `bts_prototype_config` metaobject (seeded from `data/prototype-config.seed.json`). Launch: Shopify variant prices via market price lists. No price literal in Liquid, JS, CSS or locale files. (§7.3, §12)
5. **Nothing is published to make the prototype work.** No DRAFT product is activated, priced, stocked or made available. (§7.5)
6. **Arabic is server-rendered at `/ar`.** No client-side string swapping. CSS uses logical properties only. (§8)
7. **Zero runtime errors, zero console errors, on every template, in both locales, with and without reduced motion.** Enforced by Playwright. (§11, §17)
8. **Missing media hides modules.** Nothing renders "pending", "TBD" or an empty frame in founder mode. (§6.4)
9. **Claims come only from label data.** INCI parity, pill allowlists, banned-term lint and climate-vocabulary budget are CI gates. (§12)

---

## 1. Current state (inspected 2026-09-29 at commit `e5e49c2`)

> **Note (2026-09-30):** while this spec was being written, uncommitted work appeared in the working tree (v5–v11 deletions, new `bts-base.css`, `bts-components.css`, `bts-core.js`, `bts-foundation*.liquid`, `header-group.json`, `footer-group.json`). This section describes committed `HEAD`. Codex must reconcile that in-progress work against this spec: keep what matches the file architecture in §2, and rename or restructure what does not. For example, `bts-foundation*` becomes the named sections in §2.1, and `bts-components.css` is split per §2.1 budgets. The §1.1 hotfix is moot if v11 is already deleted *and* `templates/index.json` no longer references it.

```
layout/theme.liquid        renders bts-header + bts-footer + bts.js; Google Fonts (3 families) render-blocking
sections/                  bts-home-v5 … v11 (7 generations), bts-experience, bts-header, bts-footer,
                           bts-product, bts-collection, bts-cart, bts-404
templates/                 index.json → bts-home-v11 · product/collection/cart/404 .json
snippets/                  (none)
locales/                   en.default.json only (6 keys)
assets/                    bts.css (77 KB, 3,451 lines, 117 environment refs), bts.js,
                           bts-home-v5…v11 .css/.js (≈ 380 KB total dead weight),
                           bts-{reset,clarity,defense,barrier}-clean-v11.{png,webp} (3 of 4 WRONG LABEL)
config/                    settings_schema.json (brand colours), settings_data.json
non-theme dirs in repo     opus-brand-pack/, review-assets/, final-review-v8/, live-review-v8/ (no .shopifyignore)
Shopify                    4 products, DRAFT, EGP 0, inventory 0 · storefront password ON
```

### 1.1 The v11 `null.tabIndex` error: root cause and fix

**Root cause.** `assets/bts-home-v11.js:206`, inside `setActive()`:

```js
slides.forEach((s, j) => { const b = s.querySelector('[data-b11-swatch]'); b.tabIndex = j === i ? 0 : -1; s.setAttribute('aria-hidden', String(j !== i)); });
```

The markup (`sections/bts-home-v11.liquid:47`) renders `data-b11-sheet`, not `data-b11-swatch`, so `b` is `null`. `applyLang()` calls `setActive(active, true)` during init (line 449), the throw aborts the IIFE, and everything registered after it (routine note, cart render, capture channel) never initialises. The same stale selector makes the Drag-to-Swatch block (line 242) bind to zero elements. Line 206 also sets `aria-hidden="true"` on slides whose buttons stay focusable (WCAG 4.1.2 failure).

**This is a contract failure, not a typo.** Liquid and JS each hard-coded a selector string, nothing checked they matched, nothing typed `querySelector` as nullable, one init threw and took down the whole page, and no test failed on a console error.

**Interim hotfix (P0-0, only while v11 remains on the dev theme; v11 is deleted in §18):**

```diff
- slides.forEach((s, j) => { const b = s.querySelector('[data-b11-swatch]'); b.tabIndex = j === i ? 0 : -1; s.setAttribute('aria-hidden', String(j !== i)); });
+ slides.forEach((s, j) => {
+   const b = s.querySelector('[data-b11-sheet]');
+   if (b) b.tabIndex = j === i ? 0 : -1;
+   s.inert = j !== i;            // replaces aria-hidden on a focusable subtree
+ });
```
…and delete the dead `$$('[data-b11-swatch]').forEach(…)` listener binding inside the Drag-to-Swatch block (block starts at line 230, ends before the "Routine AM/PM" block at line 283). **Keep `closeSwatch()`** (it is called from the rail scroll handler and the language switch; deleting it turns a TypeError into a ReferenceError). Also remove the "Swatch it before you buy it" copy. In the same commit, remove `bts-reset/clarity/defense-clean-v11.*` from the v11 section (wrong labels, Creative Directions §0.1 #1). Acceptance: dev-theme home loads with zero console errors at 390 px EN and AR.

**How v12 makes this class of bug impossible (not just this instance):**

| Failure in v11 | v12 mechanism | Check |
|---|---|---|
| Selector string drift between Liquid and JS | Each component's parts use `data-part="…"` names declared once in JS (`static parts = [...]`). The snippet that renders the component is the only markup source. | `scripts/check-contracts.mjs` (§12.7): every `data-part` a component declares must appear in its snippet, and vice versa. |
| `querySelector` result used without a null check | All JS is `// @ts-check` and type-checked with `tsc --noEmit --checkJs --strict` (JSDoc types). `Element \| null` cannot be dereferenced. | `npm run typecheck` in CI |
| One throw kills the page | Every component initialises inside the `define()` error boundary (§11.2). A failed component leaves its SSR markup working and reports `bts_runtime_error`. | Playwright `pageerror` + console listener fails the run |
| `aria-hidden` on focusable content | `aria-hidden` is banned on any element with focusable descendants. Hidden interactive content uses `inert` (or `hidden`). | axe `aria-hidden-focus` rule + ESLint `no-restricted-syntax` on `setAttribute('aria-hidden'` |
| Nobody noticed | CI runs every template × locale × viewport and fails on any console error or warning prefixed `[bts]`. | §17 |

---

## 2. Target repository and theme file architecture

### 2.1 Tree

```
layout/
  theme.liquid                      single shell (§3)
  password.liquid                   pre-launch shell (§9.14)
config/
  settings_schema.json              §7.1 settings added; old v5–v11 settings removed
  settings_data.json
locales/
  en.default.json                   storefront strings
  ar.json                           storefront strings (authored Egyptian Arabic)
  en.default.schema.json            theme-editor labels
  ar.schema.json                    (optional; editor only)
sections/
  header-group.json                 section group: bts-announcement (optional), bts-header
  footer-group.json                 section group: bts-capture, bts-footer
  overlay-group.json                section group: bts-drawer, bts-menu, bts-search-overlay
  bts-header.liquid
  bts-footer.liquid
  bts-announcement.liquid           renders nothing unless text is set (no marketing by default)
  bts-menu.liquid                   <dialog> menu sheet (§3.3)
  bts-search-overlay.liquid         <dialog> search (desktop) — mobile search lives in bts-menu
  bts-drawer.liquid                 <dialog> cart drawer (§10)
  bts-capture.liquid                email / WhatsApp opt-in (§9.15)
  # Home
  bts-shelf.liquid                  Home module 1
  bts-routine-offer.liquid          Home module 2 (also used on Shop top and Routine page head)
  bts-texture-row.liquid            Home module 3 (hidden without 4 approved T2)
  bts-campaign.liquid               Home module 4 (hidden without approved campaign image)
  bts-back-explained.liquid         Home module 5
  bts-on-skin.liquid                Home module 6 (hidden without approved S1/S2)
  bts-approach-teaser.liquid        Home module 7 (the only climate moment on Home)
  bts-reviews.liquid                Home / PDP (real or SAMPLE)
  bts-service-strip.liquid          Home module 9 + PDP service line source
  # Commerce
  bts-shop.liquid                   /collections/shop
  bts-pdp.liquid                    single PDP + preview PDP (§9.3)
  bts-pdp-back.liquid               "The Back" expanded section
  bts-pdp-use.liquid                How to use
  bts-pdp-neighbours.liquid         Where it sits
  bts-pdp-faq.liquid
  bts-bundle.liquid                 Routine bundle PDP
  bts-routine.liquid                /pages/routine
  bts-cart-page.liquid              /cart (no-JS + deep link)
  bts-search.liquid                 /search
  # Content
  bts-finder.liquid
  bts-approach.liquid
  bts-ingredients-index.liquid
  bts-ingredient.liquid             metaobject webpage template body
  bts-about.liquid
  bts-help.liquid
  bts-service-page.liquid           delivery / payment / returns (setting: policy type)
  bts-contact.liquid
  bts-rich-text.liquid              generic page body (patch test, legal-adjacent)
  bts-blog.liquid, bts-article.liquid   (P2)
  bts-404.liquid
  bts-password.liquid
snippets/
  bts-face.liquid                   THE product face (§4)
  bts-cap-chip.liquid               40 px pack chip for lists (§5.1)
  bts-price.liquid                  price adapter (§7.2)
  bts-money.liquid                  locale-aware money formatter (§8.5)
  bts-add.liquid                    add control adapter (§7.2)
  bts-product-url.liquid            URL adapter (§7.4)
  bts-face-list.liquid              iterates products for a surface in the correct order/source (§7.2)
  bts-media.liquid                  responsive image/video from bts_media (§13.3)
  bts-bdi.liquid                    wraps Latin tokens for RTL (§8.4)
  bts-icon.liquid                   inline SVG icons (≤ 12 icons; directional flag)
  bts-wordmark.liquid               exact wordmark SVG inline (ink/white)
  bts-mode.liquid                   emits the runtime config <script type="application/json"> (§7.1)
  bts-service-line.liquid           approved-only service line for current market
  bts-jsonld-organization.liquid, bts-jsonld-website.liquid, bts-jsonld-product.liquid,
  bts-jsonld-breadcrumbs.liquid, bts-jsonld-itemlist.liquid, bts-jsonld-faq.liquid (§16)
  bts-meta.liquid                   title/description/OG/robots (§16)
  bts-fonts.liquid                  @font-face + preload per locale (§13.4)
templates/
  index.json
  product.json                      single SKU → bts-pdp …
  product.routine.json              bundle → bts-bundle …
  collection.json                   → bts-shop
  list-collections.json             → bts-shop (same section; there is one shop)
  page.json                         → bts-rich-text
  page.routine.json, page.finder.json, page.approach.json, page.ingredients.json,
  page.about.json, page.help.json, page.service.json, page.contact.json
  page.preview-product.json         prototype PDP alias (§7.4)
  metaobject/bts_ingredient.json    ingredient detail webpage
  search.json
  search.bts-index.liquid           {% layout none %} JSON search index (§9.10)
  cart.json
  404.json
  password.json
  blog.json, article.json           (P2)
  gift_card.liquid                  minimal branded (P2) [verify theme-check requirement]
assets/
  bts-tokens.css      design tokens only (custom properties)          ≤ 3 KB gz
  bts-base.css        reset, type, shell, header, dialogs, buttons    ≤ 14 KB gz  (render-blocking)
  bts-face.css        product face + cap chip                         ≤ 5 KB gz
  bts-home.css / bts-pdp.css / bts-shop.css / bts-routine.css /
  bts-finder.css / bts-content.css / bts-search.css / bts-drawer.css  ≤ 6 KB gz each
  bts-core.js         module: config, define(), track(), money, cart adapter factory   ≤ 9 KB gz
  bts-face.js         <bts-product-face>, <bts-shelf>                  ≤ 4 KB gz
  bts-drawer.js       <bts-drawer>, <bts-sheet>                         ≤ 6 KB gz
  bts-search.js       <bts-search> combobox + synonym/normalise layer   ≤ 6 KB gz
  bts-pdp.js          <bts-gallery>, <bts-sticky-atc>                   ≤ 4 KB gz
  bts-routine.js      <bts-ampm>                                        ≤ 2 KB gz
  bts-finder.js       <bts-finder>                                      ≤ 4 KB gz
  bts-analytics.js    track() transport (prototype: dataLayer; launch: Shopify.analytics.publish) ≤ 2 KB gz
  fonts/ → NOT a folder; font files live flat in assets/: bts-display-latin.woff2, bts-ui-latin.woff2, bts-ar-ui.woff2, bts-ar-display.woff2
  bts-wordmark-ink.svg, bts-wordmark-white.svg, bts-icon-ink.svg, bts-icon-white.svg
  (NO product photography, NO PNG/WebP packshots — media lives in Shopify Files via bts_media, §6.4)
# Not uploaded to Shopify (listed in .shopifyignore):
data/
  labels.json                       machine-readable mirror of FINAL_LABEL_SOURCE_OF_TRUTH.md
  prototype-config.seed.json        Scenario A + B (the ONLY price literals in the repo)
  banned-terms.json, climate-terms.json, synonyms.json, wrong-assets.sha256
scripts/
  seed-content.mjs, export-content.mjs, check-*.mjs (§12)
tests/
  e2e/*.spec.ts, a11y/*.spec.ts, perf/lighthouserc.json, fixtures/
opus-brand-pack/, review-assets/ (archived), docs/
package.json, eslint.config.mjs, .stylelintrc.json, tsconfig.json, .theme-check.yml, .shopifyignore
.github/workflows/ci.yml
```

### 2.2 Naming and ownership rules
- Prefix everything `bts-`. No version suffixes (`-v12`) in file names, class names or data attributes. Versions live in git tags.
- One section = one job. A section may render snippets; a snippet never renders a section.
- A section MUST NOT contain `<header>`, `<footer>`, `<nav aria-label="Primary">`, a skip link, a cart count, a `<link>` to a third-party origin, or an inline `<style>`/`<script>` block larger than 300 bytes. Only `bts-header`, `bts-footer`, `bts-menu` may contain nav landmarks.
- CSS class convention: block `.pf`, element `.pf__back`, state via attributes (`[data-side="back"]`, `[aria-pressed="true"]`) not modifier classes.
- JS hooks: `data-part="…"` inside a component, `data-bts-*` for page-level hooks. Never style on `data-part` / `data-bts-*`; never script on classes.

---

## 3. Global shell (removes double chrome)

### 3.1 `layout/theme.liquid` (complete structure)

```liquid
<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}"
      dir="{% if settings.rtl_locales contains request.locale.iso_code %}rtl{% else %}ltr{% endif %}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  {% render 'bts-meta' %}                       {# title, description, canonical, robots guard, OG #}
  {% render 'bts-fonts' %}                      {# self-hosted @font-face + ≤ 2 preloads for this locale #}
  {{ 'bts-tokens.css' | asset_url | stylesheet_tag }}
  {{ 'bts-base.css'   | asset_url | stylesheet_tag }}
  <script>/* ≤ 300 B */document.documentElement.classList.replace('no-js','js');
    try{if(/[?&]founder=1\b/.test(location.search))sessionStorage.setItem('bts:founder','1');
    if(sessionStorage.getItem('bts:founder'))document.documentElement.classList.add('is-founder')}catch(e){}</script>
  {% render 'bts-mode' %}                       {# <script type="application/json" id="bts-config"> #}
  <script type="module" src="{{ 'bts-core.js' | asset_url }}"></script>
  {{ content_for_header }}
  {% render 'bts-jsonld-organization' %}{% if template.name == 'index' %}{% render 'bts-jsonld-website' %}{% endif %}
</head>
<body class="t-{{ template.name }}{% if template.suffix %} t-{{ template.name }}--{{ template.suffix }}{% endif %}">
  <a class="skip-link" href="#MainContent">{{ 'a11y.skip' | t }}</a>
  {% sections 'header-group' %}
  <main id="MainContent" tabindex="-1">{{ content_for_layout }}</main>
  {% sections 'footer-group' %}
  {% sections 'overlay-group' %}              {# menu, search, drawer dialogs — rendered once #}
  <div class="visually-hidden" aria-live="polite" data-bts-live></div>
  <div class="visually-hidden" aria-live="assertive" data-bts-alert></div>
</body>
</html>
```

Removed from today's layout: the Google Fonts `preconnect`/`<link>` (third-party, render-blocking), `bts.css`, `bts.js`, the hard-coded `ar` check.

### 3.2 Header (`bts-header.liquid`) — Arch §3
- Mobile (≤ 989 px): 52 px, sticky, compacts to 44 px after 64 px scroll (class toggled by one `IntersectionObserver` on a 64 px sentinel; **no scroll listener**). Order in DOM = order in reading direction: Menu button · )( home link · Shop · Routine · locale switch · Bag.
- Desktop (≥ 990 px): 64 px. `Shop  Routine  Find your routine  Ingredients  [)(]  Search  About  Help  العربية  Account  Bag n`. Shop flyout: a single row of five **front-only** faces (`bts-face` with `variant: 'flyout'`), opened on hover-intent (150 ms) **and** focus/click of the Shop disclosure button (`aria-expanded`). Esc closes and returns focus.
- The Bag control is `<a href="{{ routes.cart_url }}" data-bts-bag>` (works without JS → `/cart`). JS upgrades it to open the drawer. The count is `<span data-bts-cart-count>`; this attribute MUST appear exactly once per document (§12.8).
  - Launch: SSR `{{ cart.item_count }}`.
  - Prototype: SSR renders an empty reserved-width span (`min-inline-size: 2ch`, no CLS); JS fills it from the prototype adapter. It never shows the Shopify cart count in prototype.
- Locale switch: `{% form 'localization' %}` with `<input type="hidden" name="language_code">` and a submit button `ع` / `EN` (44 × 44, `lang` attribute on the label, `aria-label` in the target language). It works without JS and preserves the path. JS only adds `bts_lang_switch` tracking and stores `bts:lang` for UI memory. Market selector appears only if `localization.available_countries` spans > 1 market with `settings.show_market_selector`.
- Account link: rendered only when `settings.bts_mode == 'launch'` and `shop.customer_accounts_enabled`.
- Logged-in reorder hook: header exposes nothing; the Shelf and drawer read `customer.orders.first` server-side (launch only).

### 3.3 Menu sheet (`bts-menu.liquid`)
`<dialog id="bts-menu" aria-labelledby="bts-menu-title">`, opened with `showModal()` (native inert background, focus trap, Esc). Slides from inline-start (`translate: calc(-100% * var(--dir))`, `--dir: 1` LTR / `-1` RTL). Content order per Arch §3.2: search field (`<bts-search>` combobox; no autofocus on mobile), 4 product rows (`bts-cap-chip` + name + role + price) + Routine row, secondary links, help links, WhatsApp (only if `settings.whatsapp_approved`), language/market, Account (launch only).
No-JS: the menu button is `<a href="#bts-menu-nojs">` that jumps to a `<nav id="bts-menu-nojs">` list rendered in the footer. The `<dialog>` stays unrendered-by-default and is never needed without JS.

### 3.4 Footer (`bts-footer.liquid`) — Arch §3.4
Wordmark SVG (inline, via `bts-wordmark`), "fresh skin. always.", four columns from **Shopify menus** (`footer-shop`, `footer-help`, `footer-brand`, `footer-social` link_list settings; links authored per locale via Translate & Adapt), capture (from `bts-capture` in the same group), base row: locale form, market selector (conditional), payment icons **only** in launch mode and only for gateways configured (`shop.enabled_payment_types`), policy links, `© {{ 'now' | date: '%Y' }}`.

### 3.5 Shell acceptance
- Exactly one `header`, one `main`, one `footer`, one `[data-bts-cart-count]`, one skip link, one `#bts-drawer` per page (Playwright, every template).
- Header does not overlap focused elements (WCAG 2.4.11): `scroll-padding-block-start: var(--header-h)` on `html`; sticky ATC adds `scroll-padding-block-end`.

---

## 4. The product face component (FRONT / BACK)

### 4.1 Snippet API

```liquid
{% render 'bts-face',
   content: content,            {# bts_product_content metaobject (required) #}
   variant: 'shelf',            {# shelf | grid | pdp | quick | search | finder | flyout #}
   heading_level: 2,            {# 2 | 3 — face name heading; flyout/search use none (0) #}
   source: 'home_shelf',        {# analytics source id (§15) #}
   eager: false,                {# true only for the LCP face #}
   turnable: true,              {# false for flyout/search #}
   show_add: true %}
```
`bts-face` reads everything else through adapters: `bts-price`, `bts-add`, `bts-product-url`, `bts-media`. It MUST NOT read `settings.bts_mode`, `product.price` or `bts_prototype_config` directly.

### 4.2 Markup contract (exact)

```html
<bts-product-face class="pf pf--{variant}" data-key="{content.key}" data-side="front"
                  data-source="{source}" style="--pf-surface:{content.surface_color};--pf-ink:{content.ink_color}">
  <article class="pf__inner" aria-labelledby="pf-{uid}-name">
    <div class="pf__stage" data-part="stage">                       <!-- aspect-ratio: 4 / 5; perspective -->
      <div class="pf__card" data-part="card" id="pf-{uid}-card">
        <div class="pf__front" data-part="front">
          <a class="pf__media" href="{url}" tabindex="-1" aria-hidden="true">   <!-- duplicate link; name link is the focusable one -->
            {% render 'bts-media', media: content.h1_media, … %}
          </a>
          {% if content.t2_media approved %}<span class="pf__swatch">{texture word}</span>{% endif %}
        </div>
        <div class="pf__back" data-part="back" hidden>              <!-- SSR hidden; JS swaps hidden→inert -->
          {% render 'bts-wordmark', tone: content.back_wordmark_tone %}
          <ul class="pf__pills" role="list">{approved label pills ≤ 3}</ul>
          <p class="pf__does">{content.front_line}</p>
          <ul class="pf__ingredients" role="list">{≤ 3: name + one-line why}</ul>
          <p class="pf__feels"><span>{{ 'face.feels_like' | t }}</span> {texture word}</p>
          <p class="pf__use">{AM/PM · step}</p>
          <a class="pf__inci" href="{url}#inci" data-part="inci">{{ 'face.full_inci' | t }}</a>
          <template data-part="inci-template">{Latin INCI in <p lang="en" dir="ltr">}</template>
        </div>
      </div>
    </div>
    <div class="pf__info">                                           <!-- fixed block-size per variant: no CLS -->
      <p class="pf__meta">{step} · {role} · {% render 'bts-bdi', text: size %}</p>
      <h{n} class="pf__name" id="pf-{uid}-name"><a href="{url}">{name}</a></h{n}>
      <p class="pf__promise">{content.front_line}</p>
    </div>
    <div class="pf__buy">
      {% render 'bts-add', content: content, source: source %}      <!-- never moves, never changes between faces -->
      <button type="button" class="pf__turn" data-part="turn" aria-pressed="false"
              aria-controls="pf-{uid}-card" hidden>                  <!-- SSR hidden: no-JS = front only -->
        {% render 'bts-icon', name: 'turn' %}<span class="pf__turn-label">{{ 'face.turn' | t }}</span>
      </button>
    </div>
  </article>
</bts-product-face>
```
- `{uid}` = `content.key | append: '-' | append: section.id | append: '-' | append: forloop.index` (unique per page; the same product can appear twice).
- `aria-label` on the turn button: `face.turn_to_back` = "Show the back of the pack" / `face.turn_to_front` = "Show the front of the pack". Visible label: "Turn over". **Label text is constant**; state is `aria-pressed`. (The `aria-label` names the action; `aria-pressed` reports state. Do not change `aria-label` on toggle.)
- First-visit discoverability: the active shelf card shows the full "Turn over" label; after the first turn (`localStorage bts:turned=1`) CSS collapses the label to the icon on shelf cards (the accessible name is unchanged).

### 4.3 Behaviour (`assets/bts-face.js`)

```js
// @ts-check
class ProductFace extends BTSElement {
  static parts = ['stage', 'card', 'front', 'back', 'turn', 'inci', 'inci-template'];
  static optional = ['inci', 'inci-template'];
  connected() {
    const { back, front, turn } = this.parts;          // typed, non-null (BTSElement asserts required parts)
    back.hidden = false; back.inert = true;             // upgrade: both faces in DOM, hidden face inert
    turn.hidden = false;
    turn.addEventListener('click', () => this.turn());
    this.parts.inci?.addEventListener('click', e => { e.preventDefault(); BTS.sheet.open('inci', this.parts['inci-template']); });
  }
  turn(to = this.dataset.side === 'front' ? 'back' : 'front') {
    const { front, back, turn } = this.parts;
    this.dataset.side = to;                             // CSS drives the rotation
    front.inert = to === 'back';
    back.inert  = to === 'front';
    turn.setAttribute('aria-pressed', String(to === 'back'));
    BTS.track('bts_product_turn', { side_to: to, surface: this.dataset.source, sku_handle: this.dataset.key });
  }
}
define('bts-product-face', ProductFace);
```
Rules:
1. Focus **stays on the turn button** after turning (it is outside the card). No focus jump, no scroll.
2. `inert` is toggled synchronously at the start of the turn (not at `transitionend`), so there is never a moment where the invisible face is focusable.
3. If `'inert' in HTMLElement.prototype` is false, fall back to `hidden` on the non-visible face and skip the rotation (crossfade only). Supported targets (§17.1) all support `inert`; the fallback exists for robustness.
4. Turning a face never changes the Add control, price, focus order of the buy row, or layout size.
5. Shelf/grid: turning one card does not turn others. Scrolling a turned card out of the shelf viewport resets it to front after 600 ms out of view (IntersectionObserver), so users don't return to a mysterious back.
6. Tapping the photo navigates to the PDP. Only the turn button turns. No gesture turns the card.

### 4.4 Motion (CSS, `bts-face.css`)
```css
.pf__stage { perspective: 1200px; aspect-ratio: 4 / 5; contain: layout paint; }
.pf__card  { position: relative; block-size: 100%; transform-style: preserve-3d;
             transition: transform 320ms cubic-bezier(.33, 0, .15, 1); }
.pf__front, .pf__back { position: absolute; inset: 0; backface-visibility: hidden; }
.pf__back  { transform: rotateY(calc(180deg * var(--dir))); background: var(--pf-surface); color: var(--ink); }
.pf[data-side="back"] .pf__card { transform: rotateY(calc(-180deg * var(--dir))); }
.pf__stage::after { /* contact shadow: narrows to 40% width at 50% of the turn, then returns */ }
@media (prefers-reduced-motion: reduce) {
  .pf__card { transition: none; transform: none !important; }
  .pf__front, .pf__back { transition: opacity 120ms linear; backface-visibility: visible; transform: none; }
  .pf[data-side="back"] .pf__front, .pf[data-side="front"] .pf__back { opacity: 0; }
}
```
- Duration 320 ms (gate range 280–340). Easing has no overshoot. No gloss, no lift/scale, no floating shadow.
- `--dir` is `1` in LTR and `-1` in RTL (set on `:root`), so the turn follows reading direction. **Photography never mirrors** (no `scaleX(-1)` on media, ever — lint in §12.6).
- The back uses `var(--ink)` for all informative text. White only for the wordmark on the back (decorative duplicate of brand; text alternative lives in the header).

### 4.5 Back-face content limits (enforced by metaobject validations + CI)
| Field | Limit |
|---|---|
| Pills | ≤ 3, only from `bts_claim` entries linked to that product and `approved = true` |
| Key ingredients | exactly 1–3 (`list.metaobject_reference`, max 3) |
| "Why it's here" per ingredient | ≤ 80 chars EN, ≤ 90 chars AR |
| "Does" line | the label front line, verbatim |
| Formula logic | not on the face. PDP only. |
| INCI | not visible on the face. Sheet / PDP only. |

Overflow test: at 375 px the back must fit inside the 4:5 stage in EN and AR with 200% text zoom *not* required to fit (text zoom allowed to scroll inside `.pf__back` with `overflow-y: auto` and a visible focus ring on the scroll container — `tabindex="0"` only when overflowing, set by ResizeObserver).

### 4.6 Surfaces using the face
| Surface | variant | turnable | heading | notes |
|---|---|---|---|---|
| Home shelf | `shelf` | yes | h2 | first card `eager` |
| Shop grid | `grid` | yes | h2 | |
| PDP gallery frame 1 | `pdp` | yes | none (page h1 is the name) | `eager`; info/buy blocks suppressed, PDP renders its own |
| Quick view sheet | `quick` | yes | h2 inside dialog | |
| Search suggestions/results | `search` | no | none | compact horizontal |
| Finder result | `finder` | yes | h3 | |
| Header flyout | `flyout` | no | none | front only |
| Drawer / lists | — | — | — | use `bts-cap-chip`, not the face |

---

## 5. Other shared components

### 5.1 Cap chip — `snippets/bts-cap-chip.liquid`
40 × 40 (32 in dense lists) square: `bts_media` role `P1_FRONT` cropped on `--pf-surface`. Falls back to the surface colour + step number (`01`) if media not approved (a designed state, not a hole). `alt=""` because the product name is always adjacent.

### 5.2 Add control — `snippets/bts-add.liquid`
Outputs, by mode (see §7.2):
- **Launch, available:** `<form method="post" action="{{ routes.cart_add_url }}" data-bts-add>` + hidden `id` + `quantity=1` + `<button type="submit">` "Add · {price}". Works without JS (posts to cart, lands on `/cart`).
- **Launch, unavailable / price 0 / not published:** Notify form (§9.3) — never "EGP 0", never "Sold out" for "not launched".
- **Prototype:** `<button type="button" data-bts-add data-key="…" disabled>` "Add · {price}". JS enables it after the prototype adapter is ready. No-JS stays disabled with `aria-describedby` → "Prototype: adding to bag needs JavaScript".
- Button morph: label → "Added ✓" for 1200 ms, width locked with `min-inline-size` measured at render (no layout shift). The live region announces "{name} added to bag".
- Height 52 px primary / 44 px minimum anywhere.

### 5.3 Dialogs — `<bts-sheet>` (in `bts-drawer.js`)
One implementation for menu, search, drawer, routine sheet, quick view, INCI sheet. Native `<dialog>` + `showModal()`. Opening: stores `document.activeElement`, moves focus to the dialog heading (`tabindex="-1"`). Closing: Esc, close button, backdrop click (not on drag), `history.back` support for mobile (push a state on open; `popstate` closes). Restores focus. Scroll lock via `html { overflow: hidden }` + `scrollbar-gutter: stable`. Only one dialog open at a time (opening a new one closes the current one first).

### 5.4 Sticky add bar — `<bts-sticky-atc>` (PDP only)
Shown when the primary Add is out of the viewport **and** none of: dialog open, `visualViewport.height < 0.75 × innerHeight` (keyboard up), footer intersecting. Contains name + price + one Add (same `bts-add` markup, `source: pdp_sticky`). `position: fixed; inset-block-end: 0` with `padding-block-end: env(safe-area-inset-bottom)`. When shown, sets `--sticky-h` on `:root` for `scroll-padding-block-end` (WCAG 2.4.11). Hidden with `inert` + `hidden` when not visible.

### 5.5 Routine offer — `sections/bts-routine-offer.liquid`
Reusable block: "All four" + list total (struck only because it is a real sum of real list prices — not a fake compare-at) + routine price + "save {amount}" + **Add all four** (`bts-add` with `content: routine`). Renders the saving line only if the price adapter returns `saving > 0` (§7.3, §10.3). Used on Home (module 2), Shop (top card), Routine page head, PDP routine line (compact variant), Finder result.

---

## 6. Content model (metaobjects & metafields)

All definitions: **Storefront access: on** (required for Liquid), **Translations: on** for every text field marked T, "Publishable" capability on for entry `status` (active/draft) so unfinished entries never render. Definitions are created by `scripts/seed-content.mjs` from `data/*.json` (idempotent upserts, §19.2). Field keys are snake_case and stable; renaming a key is a breaking change.

### 6.1 `bts_product_content` (one per SKU; also used for the routine bundle)
| key | type | T | validation / notes |
|---|---|---|---|
| `key` | single_line_text | | `reset` \| `clarity` \| `barrier` \| `defense` \| `routine` (regex `^[a-z0-9-]+$`, unique) |
| `step` | number_integer | | 1–99; ordering source everywhere |
| `kind` | single_line_text (choices) | | `single` \| `bundle` |
| `name` | single_line_text | | label name verbatim; **not translated** (gate #6) |
| `role` | single_line_text | T | "Cleanse" / "Treat" / "Moisturize" / "Protect" (US spelling) |
| `front_line` | single_line_text | T | label front line verbatim in EN; AR authored |
| `hero_actives` | single_line_text | | label actives line verbatim, e.g. "Zinc PCA + Centella" |
| `suitability` | single_line_text | T | label; blank for Clarity (label has none) |
| `size_value` / `size_unit` | number_decimal / choices `mL`,`g` | | web shows "50 g" (Creative §0.1 #15) |
| `back_description` | multi_line_text | T | label back description verbatim EN |
| `claims` | list.metaobject_reference → `bts_claim` | | ≤ 3 |
| `key_ingredients` | list.metaobject_reference → `bts_ingredient_use` | | 1–3 |
| `formula_logic` | multi_line_text | T | ≤ 320 chars |
| `texture_word` | single_line_text | T | "Clear gel" / "Fluid serum" / "Soft cream" / "Light SPF" |
| `feels_like` | multi_line_text | T | ≤ 160 chars |
| `how_to_use` | rich_text | T | |
| `am` / `pm` | boolean | | Defense: am=true, pm=false |
| `inci` | multi_line_text | | Latin, comma-separated, **must equal `data/labels.json`** (§12.2) |
| `inci_version` | single_line_text | | e.g. `FINAL-v5`; must equal labels.json |
| `approach_note` | multi_line_text | T | the one climate paragraph on PDP (budget §12.4) |
| `surface_color` / `ink_color` | color | | pack colour (Pantone-matched hex, founder-approved) / ink for AA text |
| `media` | list.metaobject_reference → `bts_media` | | ordered; roles resolve frames (§6.4) |
| `faqs` | list.metaobject_reference → `bts_faq` | | ≤ 6 |
| `concerns` | list.metaobject_reference → `bts_concern` | | |
| `components` | list.metaobject_reference → `bts_product_content` | | bundle only, ordered |
| `shopify_product` | product_reference | | launch link (see §6.3) |
| `search_keywords` | multi_line_text | T | synonyms incl. normalised AR (§9.10) |
| `seo_title` / `seo_description` | single_line / multi_line | T | per-locale (Arch §10) |

### 6.2 Supporting types
| Type | Fields (T = translatable) |
|---|---|
| `bts_claim` | `label` (T), `products` (list product_content), `source` choices `label_pill` \| `substantiated`, `substantiation_ref` (text, required if `substantiated`), `approved` bool, `ar_approved` bool. Pills render only when `approved`; AR renders the AR label only if `ar_approved`, otherwise EN label inside `<span lang="en" dir="ltr">`. |
| `bts_ingredient` | `name` (Latin, not T), `inci_names` (list text), `plain_name` (T), `what_it_is` (T), `what_it_does` (T), `hero` bool, `glossary_letter`, `webpage` capability **on** (URL handle `ingredients` → `/pages/ingredients/{handle}` [verify coexistence with page handle `ingredients`; fallback URL handle `ingredient`]) |
| `bts_ingredient_use` | `ingredient` ref, `product` ref, `why_here` (T, ≤ 80), `percent` (decimal), `percent_approved` bool (percent renders only if true) |
| `bts_media` | `file` (file_reference: image or video), `role` choices `H1` `P1_FRONT` `P1_BACK` `P1_34` `T2` `P2` `A1` `S1` `S2` `R1` `R2` `CAMPAIGN`, `product_key`, `alt` (T, required), `label_version` (text; must equal content `inci_version` for pack-bearing roles), `approved` bool, `poster` (file, video only), `focal` (text `x%,y%`) |
| `bts_faq` | `question` (T), `answer` (rich_text, T), `category` choices (Arch §4.13), `markets` (list text), `products` (list ref), `approved` bool, `source` (formulation \| ops) |
| `bts_concern` | `label` (T), `products` (list ref), `order` int |
| `bts_service_policy` | `market` (text: `eg`/`ae`/`sa`), `type` choices `delivery` `payment` `cod` `returns` `whatsapp` `free_delivery`, `headline` (T), `body` (rich_text, T), `fee_amount`, `days_min`, `days_max`, `threshold_amount` (decimals, optional), `approved` bool, `reviewed_on` date |
| `bts_routine` | `content` ref (the bundle's product_content), `am_steps`/`pm_steps` (list ref), `why_points` (list text, T, ≤ 3), `layering_media` (list bts_media) |
| `bts_prototype_config` | single entry, handle `default`: `scenario` choices `A`\|`B`, `currency` text `EGP`, `prices` (json), `notes` text. Schema in §7.3. |
| `bts_prototype_review` | `product` ref, `author_label` (always "Sample reviewer"), `body` (T), `rating` int — **rendered only in prototype mode, always with the SAMPLE marker, never aggregated** |

### 6.3 Metafields
| Owner | namespace.key | type | purpose |
|---|---|---|---|
| Product | `bts.content` | metaobject_reference → `bts_product_content` | launch link product → content |
| Product | `bts.bundle_verified` | boolean | founder/ops sign-off that `the-full-routine` is a real Shopify Bundles fixed bundle with 4 components; saving only renders if true |
| Page | `bts.content` | metaobject_reference → `bts_product_content` | prototype preview pages (§7.4) |
| Page | `bts.policy_type` | single_line_text | service page type |
| Shop | — | — | none; shop-wide data lives in `bts_prototype_config` / settings |
| Product (review app) | `reviews.rating`, `reviews.rating_count` | standard | launch only (§16) |

**Why content is not in product metafields:** DRAFT products are not accessible to storefront Liquid [known platform behaviour]. Content must render in prototype without the product object. Therefore content lives in metaobjects and the product is only linked in launch.

### 6.4 Media resolution rules (`bts-media.liquid`)
- A media entry renders only if `approved == true` **and** (for roles H1, P1_*, P2, CAMPAIGN) `label_version == content.inci_version`.
- Missing role → the frame/module is omitted. Modules with required roles (texture row: T2 ×4; on-skin: S1 or S2; campaign: CAMPAIGN) render **nothing** (not even their heading) unless every required entry resolves.
- In prototype mode, a non-approved entry renders only for internal reviewers with a visible `.bts-internal` "UNAPPROVED MEDIA" frame, hidden in founder mode — and then the module is treated as missing.

---

## 7. Modes: prototype vs launch

### 7.1 The switch
`config/settings_schema.json` → new group "Commerce mode":
```json
{ "type": "select", "id": "bts_mode", "label": "Commerce mode",
  "options": [{ "value": "prototype", "label": "Prototype (unpublished products, display prices)" },
              { "value": "launch",    "label": "Launch (Shopify products and prices)" }],
  "default": "prototype" }
```
Also: `rtl_locales` (text, default `ar`), `whatsapp_number`, `whatsapp_approved` (checkbox), `show_market_selector`, `show_routine_saving` (checkbox, default true), `concern_filter_threshold` (range 4–20, default 8), `max_qty_per_line` (range 1–10, default 6), `enable_finder`, `enable_learn_nav` (still requires ≥ 6 articles), social handles.

`snippets/bts-mode.liquid` emits the **only** runtime config:
```liquid
<script type="application/json" id="bts-config">{
  "mode": {{ settings.bts_mode | json }},
  "locale": {{ request.locale.iso_code | json }},
  "market": {{ localization.market.handle | json }},
  "currency": {{ cart.currency.iso_code | json }},
  "routes": { "cart": {{ routes.cart_url | json }}, "cartAdd": {{ routes.cart_add_url | json }},
              "cartChange": {{ routes.cart_change_url | json }}, "cartUpdate": {{ routes.cart_update_url | json }},
              "search": {{ routes.search_url | json }}, "predictive": {{ routes.predictive_search_url | json }} },
  "money": { "pattern": {{ 'money.pattern' | t | json }}, "label": {{ 'money.currency_label' | t: code: cart.currency.iso_code | json }} },
  "maxQty": {{ settings.max_qty_per_line }},
  "catalog": {% render 'bts-catalog-json' %},
  "prototype": {% if settings.bts_mode == 'prototype' %}{% render 'bts-prototype-json' %}{% else %}null{% endif %}
}</script>
```
- `catalog` = per-key non-price data needed by JS (name, role, step, size, url, cap-chip URL, launch `variant_id` when mode=launch, AM/PM, components). Rendered from metaobjects, same order as `step`.
- `prototype` = `{ scenario, currency, prices: {key: amount}, routine: {list, price, saving} }` read from `shop.metaobjects.bts_prototype_config.default`. In launch mode this key is literally `null`; `bts-prototype-json` is never rendered.

### 7.2 Adapters (the only places mode is read)
| Concern | Liquid adapter | JS adapter | Prototype | Launch |
|---|---|---|---|---|
| Price | `bts-price` → outputs formatted price + `data-amount` | `BTS.price(key)` | `config.prototype.prices[key]` + marker | `product.selected_or_first_available_variant.price` (market price list) |
| Availability | `bts-add` | `BTS.catalog[key].state` | always `preview` | `available` \| `coming_soon` \| `unavailable_market` \| `out_of_stock` (Arch §8) |
| URL | `bts-product-url` | `catalog[key].url` | `/pages/preview-{content.shopify_handle}` | `product.url` (locale-aware) |
| Product list | `bts-face-list` | — | `shop.metaobjects.bts_product_content.values` where `kind == 'single'`, sorted by `step` | `collection.products` → `product.metafields.bts.content.value` (falls back to metaobject order at ≤ 8 SKUs for identical ordering) |
| Cart | — | `BTS.cart` (§10.1) | `PrototypeCart` (localStorage) | `ShopifyCart` (Ajax API) |
| Search | `bts-search` section | `<bts-search>` source | local index (`/search?view=bts-index`) | Predictive Search API + synonym layer |
| Reviews | `bts-reviews` | — | `bts_prototype_review`, SAMPLE-marked, no aggregate | review-app metafields, render only if `rating_count ≥ 5` |
| Checkout | drawer / cart page | `BTS.cart.checkout()` | disabled button "Checkout opens at launch" + `bts_prototype_checkout_blocked` | `routes.cart_url` form `name="checkout"` |
| Analytics transport | — | `bts-analytics.js` | `dataLayer` + `console.debug` when `?debug=1` | `Shopify.analytics.publish` (consent-aware) |
| SEO | `bts-meta`, `bts-jsonld-product` | — | `noindex,nofollow`; no `offers` | indexed; `offers` guarded (§16) |

Lint (§12.8): `settings.bts_mode` may appear only in `snippets/bts-{mode,price,add,product-url,face-list,meta,jsonld-product,reviews}.liquid`, `sections/bts-{drawer,cart-page,header,footer,search}.liquid`. `bts_prototype_config` may appear only in `snippets/bts-prototype-json.liquid` and `snippets/bts-price.liquid`, both inside `{% if settings.bts_mode == 'prototype' %}`.

### 7.3 Centralised prototype pricing
**Seed file** `data/prototype-config.seed.json` (the only price literals in git):
```json
{
  "currency": "EGP",
  "active_scenario": "B",
  "scenarios": {
    "A": { "prices": { "reset": 349, "clarity": 449, "barrier": 399, "defense": 449 },
           "routine": { "list": 1646, "price": 1481, "saving": 165 } },
    "B": { "prices": { "reset": 399, "clarity": 499, "barrier": 449, "defense": 499 },
           "routine": { "list": 1846, "price": 1661, "saving": 185 } }
  },
  "source": "PRICING_SOURCE_OF_TRUTH.md (sheet v1, 2026-09-28)"
}
```
- `seed-content.mjs` writes the **active scenario only** into `bts_prototype_config.default` (`scenario`, `prices` json = `{ prices, routine }`). Switching to A = change `active_scenario` and re-run, or edit the metaobject in admin. No theme deploy needed.
- The routine price is **authored**, never computed at runtime (it is a pricing decision). `scripts/check-prices.mjs` verifies: `list == Σ prices`, `saving == list − price`, `0.095 ≤ saving/list ≤ 0.105`. It also asserts neither 1,615.25 nor "12.5%" appears anywhere (pricing doc nuance).
- Display: every prototype price carries `<span class="bts-internal">Prototype price</span>` (hidden in founder mode). The drawer always shows "Prototype: prices are not final" (not hidden in founder mode). Cards do **not** get extra warning copy beyond the internal marker (gate #8).

### 7.4 Prototype routes (no DRAFT publication)
- For each content entry, `seed-content.mjs` creates a **Page** (not a product) `preview-{shopify_handle}` with template suffix `preview-product` and page metafield `bts.content`. E.g. `/pages/preview-clarity-serum`, `/pages/preview-the-full-routine`.
- `templates/page.preview-product.json` renders `bts-pdp` (or `bts-bundle` when `content.kind == 'bundle'`) **with the same section file** used by `product.json`. The section resolves `content` as `product.metafields.bts.content.value` on product templates or `page.metafields.bts.content.value` on preview pages.
- Preview pages always output `noindex,nofollow` and canonical to themselves.
- In launch mode, a preview page renders a single line "This page has moved" + link to `product.url` and `<meta name="robots" content="noindex">`; §19 deletes preview pages and adds URL redirects `/pages/preview-{h}` → `/products/{h}`.

### 7.5 No-DRAFT-publication guarantees
1. Nothing in the theme requires a product to be ACTIVE, priced, stocked or available in prototype mode (content comes from metaobjects; §6.3 rationale).
2. `scripts/seed-content.mjs` uses an **allowlist** of Admin GraphQL mutations: `metaobjectDefinitionCreate`, `metaobjectDefinitionUpdate`, `metaobjectUpsert`, `pageCreate`, `pageUpdate`, `metafieldsSet` (owner type PAGE only), `fileCreate`. Any other mutation name throws. Specifically forbidden (asserted by a unit test on the script): `productUpdate`, `productSet`, `publishablePublish`, `productVariantsBulkUpdate`, `inventorySetQuantities`, `inventoryActivate`, `priceListFixedPricesAdd`.
3. The product link `bts.content` metafield is set on products only in the launch runbook (§19.3), by a human, after founder approval.
4. CI greps the repo for those forbidden mutation names outside the test file.

### 7.6 Founder mode
`?founder=1` (sticky for the session) adds `html.is-founder` before first paint (layout inline script). CSS: `.is-founder .bts-internal { display: none }`. It never hides: "Checkout opens at launch", "Prototype: prices are not final", "SAMPLE" on reviews. Playwright asserts these remain visible with `?founder=1`.

---

## 8. Localization and RTL

### 8.1 Languages and URLs
- Shopify Settings → Languages: publish **Arabic** (`ar`). URLs `/ar/...` generated by Shopify. Markets per Arch §12 (`eg` now; `ae`, `sa` later with `/en-ae` etc.).
- Handles stay Latin across locales (Arch §10).
- Automatic locale redirection: **off** for ad landings; keep Shopify's geolocation app / banner as a suggestion only [verify store setting].

### 8.2 Where strings live
| String type | Location | Translation |
|---|---|---|
| UI (buttons, labels, states, a11y, errors, money pattern) | `locales/en.default.json`, `locales/ar.json` | authored in repo; `MatchingTranslations` check |
| Product, claim, ingredient, FAQ, service, routine copy | metaobjects (T fields) | Translate & Adapt, **human Egyptian Arabic writer**; machine translation banned for claims |
| Menus, page titles, SEO | Shopify menus / pages | Translate & Adapt |
| Section settings text (headlines on Home etc.) | section settings of type `text`/`richtext` | Translate & Adapt ("Theme" content) |

No section may contain user-visible literal English in Liquid (lint §12.9: text nodes in `sections/`/`snippets/` must be `{{ '…' | t }}`, a setting, or metaobject data; allowlist: brand name, `)(`, SVG).

Locale key namespaces: `a11y.*`, `header.*`, `menu.*`, `face.*`, `add.*`, `price.*`, `money.*`, `routine.*`, `drawer.*`, `cart.*`, `pdp.*`, `shop.*`, `finder.*`, `search.*`, `help.*`, `service.*`, `capture.*`, `prototype.*`, `errors.*`, `404.*`, `password.*`. Pluralisation via Shopify `one/other` (+ Arabic `zero/two/few/many` categories supplied in `ar.json` for counts: bag count, results count).

### 8.3 RTL rules
- `dir` on `<html>` from `settings.rtl_locales`. `:root { --dir: 1 } [dir="rtl"] { --dir: -1 }`.
- **CSS logical properties only**: `margin-inline-*`, `padding-inline-*`, `inset-inline-*`, `border-inline-*`, `text-align: start|end`, `float: inline-start`. Physical `left/right` properties/values are banned by stylelint (`liberty/use-logical-spec: always`), except inside `@supports not (inset-inline-start: 0)` (none expected).
- Transforms that express direction multiply by `var(--dir)` (drawer, menu, turn, chevrons). Icons with `data-directional` flip with `scale: var(--dir) 1`; non-directional icons never flip. Photography and the logo never flip.
- Scroll-snap shelf: `scroll-snap-type: x mandatory` works in RTL natively; JS never reads `scrollLeft` (sign differs by engine) — active card detection uses `IntersectionObserver` only.
- Step order: DOM order is 01→04; RTL reading makes 01 appear on the right. AM→PM removes Defense from the DOM order (not visually hidden) and reflows (ARABIC brief §AM/PM).
- AR is a separate composition where specified: back face in AR puts the Arabic benefit headline first; Latin ingredient names in `<bdi dir="ltr" lang="en">`; INCI block `dir="ltr" lang="en"` under an Arabic heading. Line-break overrides: display fields may contain `\n` → rendered via `newline_to_br` only for fields flagged display.

### 8.4 Bidi isolation (`bts-bdi.liquid`)
Wrap in `<bdi>` (with `lang="en"` when locale is ar): product names, SPF 50, percentages, sizes, prices, INCI, step numbers adjacent to Arabic text, SKUs, phone numbers.

### 8.5 Money (`bts-money.liquid` + `BTS.money()`)
- Pattern from locale: EN `"money.pattern": "{{ currency }} {{ amount }}"` → "EGP 1,661"; AR `"{{ amount }} {{ currency }}"` → "1,661 ج.م"; `money.currency_label.EGP` = "EGP" / "ج.م".
- Amount: prototype = integer from config, formatted with `Intl.NumberFormat('en', {maximumFractionDigits:0})` (Western digits both locales; Arch §11). Launch = `price | money_without_currency` with the shop's EGP "without currency" format set to `{{amount_no_decimals}}` [admin step §19.3; AED/SAR keep 2 decimals].
- Whole output wrapped in `<bdi>`.

### 8.6 Fonts
See §13.4. Arabic display/UI pair: **founder decision pending**; the implementation uses font tokens (`--font-display`, `--font-ui`, `--font-ar-display`, `--font-ar-ui`) so the family is a one-file swap. Default proposal until decided: League Gothic (Latin display, existing identity), Inter (Latin UI), IBM Plex Sans Arabic (AR UI), Alexandria (AR display) — all OFL, self-hosted, subset.

### 8.7 Feminine vs neutral address in Arabic
Creative Directions flags this as a founder decision. Implementation: author `ar.json` in **gender-neutral imperative/plural** forms by default; if the founder chooses feminine address, it is a copy change only.

---

## 9. Templates and pages

Each entry: template → sections (in order) → data → primary action → no-JS behaviour → specific acceptance.

### 9.1 Home — `templates/index.json`
Sections: `bts-shelf`, `bts-routine-offer`, `bts-texture-row`, `bts-campaign`, `bts-back-explained`, `bts-on-skin`, `bts-approach-teaser`, `bts-reviews`, `bts-service-strip` (footer group supplies capture + footer).
- **Shelf (`<bts-shelf>`)**: mobile = scroll-snap row, card inline-size `82vw` (max 420 px), peek ≈ 10 vw, `scroll-padding-inline`. Card stage block-size `min(420px, 100svh − 360px)` → at 375 × 667 price + Add visible without scrolling (gate #2). The routine strip ("All four · {routine} · save {saving} →", opens routine sheet with one Add) sits at the bottom of the first viewport if it fits, otherwise immediately below the fold (gate #2 explicitly allows).
  - Non-active shelf cards are **fully interactive** (no `aria-hidden`, no `inert`): they are real content. Tapping a *non-snapped* card's photo first scrolls it into place (single-pointer alternative to swipe, WCAG 2.5.1/2.5.7); tapping the snapped card's photo navigates.
  - Container: `<section aria-labelledby>` with visually-hidden h2 "The four", list semantics `<ul role="list">` of faces. No `aria-roledescription="carousel"`.
  - Desktop ≥ 990: top band = inline `bts-wordmark` (~300 px tall, inline-start) + "fresh skin. always." + routine offer (inline-end). Below: four faces in one row at identical scale, art-directed with asymmetric crop/scale per gate #3 (design detail owned by Opus comps; the grid is `grid-template-columns: repeat(4, 1fr)` with per-card `--pf-offset-block` tokens, not four ecommerce cards with a header).
  - Reorder (launch, logged-in, ≥ 1 order): routine strip label becomes "Reorder your routine" / "Reorder {name}" and posts the last order's variant IDs.
- **LCP**: the first shelf card's H1 image (`fetchpriority="high"`, `loading="eager"`). Cards 2–4: `loading="lazy"` on mobile widths via `sizes`; desktop they're in-viewport and load naturally.
- Module gates per Arch §4.1. The only climate language on Home is `bts-approach-teaser` (≤ 2 sentences, setting `maxlength` enforced in schema description + CI budget).
- No-JS: faces front only, Add disabled (prototype) / posts (launch), routine strip links to `/pages/routine`.

### 9.2 Shop — `templates/collection.json` (`/collections/shop`; also `list-collections.json`)
Sections: `bts-shop` (+ `bts-service-strip` compact).
- H1 "Shop" + one line. Routine card (face of `routine` content, full width). Concern chips row (`bts_concern`): at SKU count < `concern_filter_threshold`, chips are anchor buttons that scroll to and highlight matching faces (`data-highlight` for 1.6 s + live-region announcement "2 products match"); at ≥ threshold, chips become `<a href="?filter.p.m.bts.concern=…">` Shopify filters [P2; verify filter setup]. Grid 2 cols mobile / 4 desktop, `bts-face variant:grid`. Help strip.
- Prototype: works on the draft-product store because the list comes from metaobjects; the collection object must exist and be published (a collection, not products) [admin step]. If the collection is missing, `/collections/all` also uses this template.
- States: empty market → "Coming to {market} soon" + capture; unavailable SKU → "Coming soon" + Notify; never "EGP 0".
- JSON-LD `ItemList` + breadcrumbs.

### 9.3 PDP — `templates/product.json` and `templates/page.preview-product.json`
Sections: `bts-pdp`, `bts-pdp-back` (anchor `#the-back`, contains `#inci`), `bts-pdp-use`, `bts-pdp-neighbours`, `bts-approach-teaser` (variant `pdp`, reads `content.approach_note`), `bts-reviews`, `bts-pdp-faq`.
- First decision zone at 390 × 844 **and** 375 × 667 (price and Add visible without scroll): gallery frame 1 = `bts-face variant:pdp` (turnable), then approved frames in order P1_BACK → T2 → P2 → A1 (poster, tap to play, `preload="none"`) → S1/S2. Info column: `{step} · {role} · {size}`, `<h1>` name, front line, suitability, rating (launch, ≥ 5 only), price, Add (52 px), routine line (compact routine offer), approved service line (`bts-service-line`).
- `<bts-gallery>`: scroll-snap row + thumbnail rail on desktop (buttons with `aria-current`), keyboard ←/→ (reversed meaning in RTL), frames are `<li>` in `<ul>`. No autoplay. `bts_gallery_frame` fires after 1 s ≥ 60 % visible.
- Sticky ATC (§5.4).
- The Back section: pills → ≤ 3 key ingredients (name, `percent` only if `percent_approved`, why) → formula logic → full INCI (`<p lang="en" dir="ltr" id="inci">` + "Copy" button using Clipboard API, hidden without JS).
- Unavailable/coming soon (launch): Notify form (`{% form 'contact' %}` with `contact[tags]=notify,{handle}` — or back-in-stock app later) replaces Add; sticky bar hidden.
- No-JS: gallery shows all approved frames stacked (first frame only above the fold via CSS scroll-snap still works without JS); turn hidden; The Back section server-rendered in full, so nothing is lost.

### 9.4 Bundle PDP — `templates/product.routine.json` (+ preview page)
Sections: `bts-bundle` (frame 1 = routine face; what's inside: 4 rows with cap chip, role, individual price; list total vs routine price + saving (only per §10.3); AM/PM usage; one Add), `bts-pdp-faq`. No borrowed review aggregate. JSON-LD `Product` + `isRelatedTo` components.

### 9.5 Routine — `templates/page.routine.json` (`/pages/routine`)
Sections: `bts-routine` (+ `bts-pdp-faq` variant routine). First viewport: H1 "The Full Routine", one sentence, routine price, saving, **Add all four**. `<bts-ampm>` segmented control (`role="radiogroup"` with two `role="radio"` buttons, arrow keys; not tabs): AM 4 steps, PM 3 steps with Defense row showing "Mornings only" (stays visible in PM as a muted row, per Arch §4.4). Step rows: cap chip, step no., name, why-this-step, price, **Add single**. Layering order (R1/R2 approved or 4-frame stills, else hidden). "Why these four work together" (≤ 3 points). Optional concern note from `?concern=` (JS) changes usage notes only.
No-JS: AM and PM lists both rendered (the toggle is JS-only; `hidden` removed under `.no-js`).

### 9.6 Finder — `templates/page.finder.json` (`/pages/find-your-routine`, P1)
`<bts-finder>`: 3 questions, one per screen, "1 of 3" text, `<fieldset>` + `<legend>` + radio cards (native radios, styled), Back/Next buttons, focus moves to the new legend on step change. Result: routine face + "start here" face mapped from Q1 + usage notes from Q2/Q3 + dry-skin honesty rule (Arch §4.5) + disclaimer line. State in `sessionStorage` (`bts:finder`), shareable `?q1=&q2=&q3=`. Optional "Send me my routine" after result.
Mapping table lives in section settings as blocks (`answer` → `content` ref, `note` T) — no logic hard-coded in JS beyond reading blocks.
No-JS: Q1 rendered as four links to pre-rendered result anchors `#result-{answer}` (each a full result block with the general Q2/Q3 notes and the dry-skin note always visible). Honest degrade; no fake server logic (Liquid cannot read query params).
Climate vocabulary in questions/results: 0.

### 9.7 Our approach — `templates/page.approach.json` (P1)
`bts-approach`: statement (2 sentences), three principles (blocks), per-product line from `approach_note`, "How we test" block rendered only if a block with `approved` checkbox is on and has text, CTA Routine. The only page with unlimited climate vocabulary (still formulation-first). No weather icons, location APIs, selectors.

### 9.8 Ingredients — `templates/page.ingredients.json` + `templates/metaobject/bts_ingredient.json` (P1)
Index: hero ingredients grouped by product (from `key_ingredients` of each content), then A–Z glossary of every INCI term in `data/labels.json` that has a `bts_ingredient` entry (terms without entries are listed without links, never invented descriptions). Detail: what it is → what it does → why it's in our formula (per product, from `bts_ingredient_use.why_here`) → faces of products containing it → confirmed concentration only if `percent_approved`. JSON-LD `WebPage` + `about` `DefinedTerm`.

### 9.9 About — `templates/page.about.json` (P1)
`bts-about`: philosophy → )( meaning → formulation principles (link to approach) → team/lab block only if approved photography → Routine CTA. Climate budget: 1 section.

### 9.10 Search — `templates/search.json` + `templates/search.bts-index.liquid`
- `/search` (`bts-search`): results order products (search face) → routine → ingredients → help → articles. Launch: `search.results`. Prototype: server-side match of `search.terms | downcase` against each content entry's `search_keywords` (Liquid `contains`), plus page/ingredient matches — so no-JS search works in prototype too. Zero results: "Nothing for '{q}'" + four faces + routine + WhatsApp; `bts_search_zero`.
- `/search?view=bts-index` (`{% layout none %}`, `Content-Type` is HTML but body is JSON; JS parses text): `{ items: [{type, key, title, subtitle, url, chip, keywords, price_display}] }` built from metaobjects + help FAQs + ingredient entries. Fetched on first search focus; cached in `sessionStorage` keyed by locale + theme asset version.
- `<bts-search>`: ARIA 1.2 combobox (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`) + `role="listbox"` grouped with `role="group"` + labels; 120 ms debounce; min 2 chars (1 for Arabic); ↑↓ Enter Esc; live region "{n} results". Local layer: synonyms from `data/synonyms.json` (compiled into the index), Arabic normalisation (ا/أ/إ/آ → ا, ة → ه, ى → ي, strip tatweel and harakat). Launch: merges `/search/suggest.json?q=&resources[type]=product,page,article,query&section_id=` results with the local synonym layer (local intent → pins the matching product first). Inline Add in product suggestions uses `bts-add` data.

### 9.11 Cart page — `templates/cart.json`
`bts-cart-page` mirrors the drawer model (§10). Launch: full Liquid cart (`{% form 'cart' %}`, quantity inputs, update, remove links `line_item.url_to_remove`, checkout button). Prototype: renders from JS adapter; no-JS shows "The prototype bag lives in your browser. Turn on JavaScript to view it." + shop links. Routine swap offered on the page as in the drawer.

### 9.12 Help, Delivery, Payment, Returns, Patch test, Contact (P1)
- Help `page.help.json` → `bts-help`: search field (filters FAQs client-side; no-JS: all `<details>` open-able), categories (anchor list), top 8 FAQs (`bts_faq` where market matches and `approved`), WhatsApp/contact. JSON-LD `FAQPage`.
- Service pages `page.service.json` → `bts-service-page` with setting `policy_type` (or page metafield `bts.policy_type`): renders the approved `bts_service_policy` for `localization.market.handle`; absent → "Details confirmed at checkout" + link to `/policies/*`. Every number comes from the record.
- Patch test → `page.json` / `bts-rich-text`.
- Contact `page.contact.json` → `bts-contact`: WhatsApp deep link (`https://wa.me/{number}?text={{ 'contact.whatsapp_prefill' | t | url_encode }}`) only if approved, email, hours, `{% form 'contact' %}`.
- Legal `/policies/*`: styled via `.shopify-policy__container` rules in `bts-content.css`; no marketing modules.

### 9.13 404 — `templates/404.json`
`bts-404`: one branded line, search form (`/search`), four faces (`variant: grid`, not turnable to keep it light) + routine card. Status stays 404 (Shopify).

### 9.14 Password — `templates/password.json` + `layout/password.liquid`
Today's public face (Arch §4.17). `layout/password.liquid`: same `bts-meta`, `bts-fonts`, `bts-tokens.css`, `bts-base.css`; **no** header/footer groups, no drawer, no `bts-core.js` except a ≤ 2 KB inline enhancement for the form. `bts-password`: exact wordmark, one approved H1 image (hidden if none — then typographic only), "Coming soon" (localised), `{% form 'customer' %}` email capture with `contact[tags]=prelaunch,{locale}`, the storefront-password form behind a discreet "Enter store" disclosure (`{% form 'storefront_password' %}`), locale switch. Must pass the full a11y and perf gates; LCP ≤ 1.8 s.

### 9.15 Capture (footer group)
`bts-capture`: `{% form 'customer' %}` email; WhatsApp opt-in field rendered only if `settings.whatsapp_approved` and a consent checkbox (unchecked by default). Prototype copy vs launch copy by mode. No popups, no timers, no discount unless a real code is configured in the section setting.

### 9.16 Learn (P2)
`blog.json`/`article.json`. Nav link only if `blogs.learn.articles_count >= 6` and `settings.enable_learn_nav`. Articles end with one face or routine card (article metafield `bts.content`).

---

## 10. Cart, drawer and bundle architecture

### 10.1 JS interface (`BTS.cart`, in `bts-core.js`)
```ts
type CartLine = { key: string; contentKey: string; kind: 'single'|'bundle'; qty: number;
                  unit: number /* minor or major per adapter, normalised to integer display units */;
                  components?: string[] };
type Cart = { lines: CartLine[]; count: number; subtotal: number; currency: string;
              routineSaving: number /* 0 unless a bundle line exists and saving verified */ };
interface CartAdapter {
  get(): Promise<Cart>;
  add(items: {contentKey: string; qty: number}[], meta: {source: string}): Promise<Cart>;
  setQty(lineKey: string, qty: number): Promise<Cart>;
  remove(lineKey: string): Promise<Cart>;
  swapToRoutine(): Promise<Cart>;   // replaces the singles that are routine components with 1 routine line
  checkout(): void;                 // prototype: blocked + event; launch: navigate to /checkout via cart form
  subscribe(fn: (c: Cart) => void): () => void;
}
```
- `BTS.cart = config.mode === 'launch' ? new ShopifyCart(config) : new PrototypeCart(config)`. One instance. The header count, drawer, cart page, sticky bar and Add buttons all subscribe to it. **No other code touches `localStorage` cart keys or `/cart/*.js`.**
- **PrototypeCart**: storage key `bts:proto-cart:v1` (`{lines:[{contentKey, qty}]}` — prices are **not** stored; they are re-read from `config.prototype` on every render so a scenario switch updates old carts). Routine line price = `config.prototype.routine.price`. Quantity cap `config.maxQty`. Cross-tab sync via `storage` event.
- **ShopifyCart**: `fetch(routes.cartAdd + '.js', {method:'POST', body: JSON {items:[{id, quantity}]}})`, `/cart/change.js` by line `key`, `/cart.js` for get. Locale-aware routes from config. Request queue (serialised), 8 s timeout, one retry on network error, error → inline message + restore button (Arch §7 errors). After mutation, count and drawer re-render from the normalised model (client renderer shared with prototype — **one renderer**, §10.2).
- `swapToRoutine()` launch: POST `/cart/update.js` `{updates:{[singleVariantId]:0 …}}` for the component singles (decrement by 1 each if qty > 1), then `/cart/add.js` routine variant. If the add fails, re-add the removed singles and show the error. Prototype: same logic locally.

### 10.2 Drawer (`sections/bts-drawer.liquid` + `bts-drawer.js`)
- SSR: dialog shell, heading, empty-state markup, `<template>`s for line, suggestion, totals, service lines (service lines SSR'd from approved `bts_service_policy` for the market so no data is in JS).
- Client renderer builds lines from `Cart` + `config.catalog` (names, chips, components). Bundle line lists four components indented without per-component price, "Routine price" beneath.
- **One suggestion max** (Arch §7): singles subset of routine components, 1–3 present → "Complete the Routine: adds {missing step labels} · + {routine − current singles total} · saves {saving} vs separately" → Switch; all four singles → "Switch to the Routine and save {saving}"; routine present → nothing. The "+ amount" and saving come from adapter data; if `routineSaving` would be ≤ 0 or unverified (§10.3), the suggestion shows the step labels only, no money claim.
- Totals: subtotal, routine saving (only with a bundle line), "Delivery and payment confirmed at checkout"; free-delivery row only if an approved `free_delivery` policy with `threshold_amount` exists for the market.
- Checkout: launch → `<form action="{{ routes.cart_url }}" method="post"><button name="checkout">`; prototype → `<button disabled aria-describedby>` "Checkout opens at launch" + "Prototype: prices are not final" (visible in founder mode). Clicking the disabled-looking control: it is `aria-disabled="true"` (not `disabled`) so it remains focusable and fires `bts_prototype_checkout_blocked`, announcing "Checkout opens at launch".
- Opens on every add (single, routine, reorder, finder). Focus to heading; live region "{name} added". Skeleton lines ≤ 300 ms max (launch only).
- Never: interstitials, auto-added items, countdowns, scarcity.

### 10.3 Bundle (launch)
- **Shopify Bundles app, fixed bundle** product `the-full-routine` with 4 components, priced per market price list (EG: routine price when approved). [verify app availability on plan]
- The theme computes displayed saving = Σ component variant prices (current market) − bundle variant price, **only if** `product.metafields.bts.bundle_verified == true` and `settings.show_routine_saving`; otherwise no saving line anywhere (gate #9: no automatic saving claim unless implementation guarantees it).
- Never claim "applies automatically when all four are in your bag" (Creative §0.1 #10). The swap is explicit.
- `/collections/sets` is not built (Arch §2); if requested, 301 → `/pages/routine` via admin URL redirect.

### 10.4 Prototype routine
Line priced from `config.prototype.routine.price`; saving from config. Marked "Prototype price" (internal) in the drawer line.

---

## 11. JavaScript architecture, no-JS and error handling

### 11.1 Principles
- Zero frameworks, zero third-party scripts in the theme. ES2020 modules, no build step, no transpile. `bts-core.js` is `type="module"` (deferred by default). Feature files are loaded by the section that needs them: `<script type="module" src="{{ 'bts-pdp.js' | asset_url }}"></script>` (module scripts with the same URL execute once).
- Everything SSR-first: every component's markup works (or degrades honestly) before JS.
- No scroll listeners. Use `IntersectionObserver`, `ResizeObserver`, CSS scroll-snap, `scroll-timeline` not used.
- No `innerHTML` with interpolated data (`no-restricted-syntax`); use `<template>` cloning + `textContent`.

### 11.2 `define()` and `BTSElement` (in `bts-core.js`)
```js
// @ts-check
export class BTSElement extends HTMLElement {
  /** @type {string[]} */ static parts = [];
  /** @type {string[]} */ static optional = [];
  connectedCallback() {
    if (this.dataset.ready) return;
    const C = /** @type {typeof BTSElement} */ (this.constructor);
    /** @type {Record<string, HTMLElement>} */ const parts = {};
    for (const p of C.parts) {
      const el = this.querySelector(`[data-part="${p}"]`);
      if (!el && !C.optional.includes(p)) throw new MissingPartError(this.localName, p);
      if (el) parts[p] = /** @type {HTMLElement} */ (el);
    }
    this.parts = parts;
    this.connected();
    this.dataset.ready = '1';
  }
  connected() {}
}
export function define(name, Ctor) {
  if (customElements.get(name)) return;
  const orig = Ctor.prototype.connectedCallback;
  Ctor.prototype.connectedCallback = function () {
    try { orig.call(this); }
    catch (err) { report(err, name); /* SSR markup remains usable */ }
  };
  customElements.define(name, Ctor);
}
function report(err, component) {
  console.warn('[bts]', component, err);                  // CI fails on any "[bts]" warning
  track('bts_runtime_error', { component, message: String(err && err.message).slice(0, 120) });
}
```
Plus `window.addEventListener('error'|'unhandledrejection')` → `report`.

### 11.3 No-JS fallback summary
| Feature | Without JS |
|---|---|
| Menu | anchor to footer nav list |
| Locale switch | localization form (works) |
| Face | front only; turn hidden; back content available on PDP The Back section |
| Add | launch: form POST to cart; prototype: disabled + explanation |
| Drawer | Bag links to `/cart` |
| Search | `/search` GET form (works in both modes, §9.10) |
| Routine AM/PM | both lists visible |
| Finder | Q1 links → pre-rendered result anchors |
| Gallery | stacked frames with scroll-snap |
| Sticky ATC | not rendered |
| Help FAQ filter | all `<details>` present |
| Capture | form POST |

Test: Playwright project `no-js` (`javaScriptEnabled: false`) runs the P0 flows (§17).

---

## 12. CI and content lint

All checks run in `.github/workflows/ci.yml` on every PR to `build/*` and `main`; all MUST pass to merge. `npm run check` runs them locally.

| # | Check | Tool / script | Fails when |
|---|---|---|---|
| 12.1 | Theme check | `shopify theme check --fail-level error` with `.theme-check.yml` | any error; enabled: `MatchingTranslations`, `TranslationKeyExists`, `ValidSchema`, `ValidJSON`, `MissingTemplate`, `UnusedAssign`, `UnusedSnippet`, `UndefinedObject`, `ImgWidthAndHeight`, `ParserBlockingScript`, `RemoteAsset` (bans Google Fonts/any CDN), `AssetSizeCSS` (≤ 20 KB), `AssetSizeJavaScript` (≤ 20 KB), `DeprecatedFilter`, `LiquidHTMLSyntaxError`, `ContentForHeaderModification` |
| 12.2 | **INCI parity** | `scripts/check-inci.mjs` | `data/labels.json` INCI ≠ INCI parsed from `FINAL_LABEL_SOURCE_OF_TRUTH.md` (exact token list, order-sensitive, normalised whitespace/case of separators only); and, in the content job (§12.11), any `bts_product_content.inci` ≠ labels.json, or `inci_version` mismatch |
| 12.3 | **Claims** | `scripts/check-claims.mjs` | (a) any pill text not in the label pill allowlist for that product (`labels.json.pills`) unless a `bts_claim` has `source: substantiated` + ref; (b) any banned term in locales, sections, snippets, templates, content export: `Green Tea`, `Niacinimide`, `Prevents breakouts`, `Daily Face Sunscreen`, `toxin-free`, `chemical-free`, `clean beauty`, `dermatologist` (unless substantiated), `clinically`, `ultra-gentle`, `repairs the barrier`, `erase`, `cure`, `melasma`, `only \d+ left`, `hurry`, `ends in`, `Swatch it before you buy`, `applies automatically`, `Pay when your order arrives`/`Delivery across Egypt` (outside approved service records), `Moisturise`, `50 gm`, `12.5%`, `1,615` |
| 12.4 | **Climate budget** | `scripts/climate-budget.mjs` over **rendered HTML** from the Playwright crawl (EN + AR term lists in `data/climate-terms.json`) | per-surface counts exceed Arch §13 (nav/hero/cards/drawer/search/finder: 0; Home: 1 module ≤ 2 sentences; PDP: approach paragraph + verbatim label text; About: 1 section) |
| 12.5 | **Prices** | `scripts/check-prices.mjs` | any of `349 399 449 499 1646 1846 1481 1661 165 185` (with/without thousands comma, word-bounded) in `sections/ snippets/ templates/ assets/ locales/ layout/ config/settings_data.json`; seed arithmetic (§7.3) fails |
| 12.6 | **Wrong pack assets** | `scripts/check-assets.mjs` | any file in `assets/` whose SHA-256 is in `data/wrong-assets.sha256` (seeded with the four `*-clean-v11.*` files) or name matches `/-v\d+\.|clean-v11/`; any raster image in `assets/` > 30 KB (photography belongs in Files); any `scaleX(-1)` / `scale: -1` applied to `img`, `picture`, `video`, `.pf__media`, wordmark |
| 12.7 | **Component contracts** | `scripts/check-contracts.mjs` | a component's `static parts` name missing in its snippet or a `data-part` in the snippet not declared; any `data-bts-*` hook queried in JS with no Liquid producer |
| 12.8 | **Single shell & mode isolation** | `scripts/check-shell.mjs` | `<header`/`<footer`/skip-link/`data-bts-cart-count` in a non-shell section; `settings.bts_mode` or `bts_prototype_config` outside the allowlist (§7.2); `localStorage` cart key or `/cart/` fetch outside `bts-core.js` |
| 12.9 | **Locales** | `scripts/check-locales.mjs` | key sets differ between `en.default.json` and `ar.json`; empty values; an `ar.json` value with no Arabic character (allowlist for brand tokens); literal English text nodes in `sections/`/`snippets/` |
| 12.10 | JS | `eslint` (flat config: `recommended`, `no-console` except `warn` via `report`, `no-restricted-syntax` for `innerHTML`, `setAttribute('aria-hidden'`, `scrollLeft`, `addEventListener('scroll'`), `tsc --noEmit -p tsconfig.json` (`allowJs`, `checkJs`, `strict`) | any error |
| 12.11 | CSS | `stylelint` (`stylelint-config-standard`, `stylelint-use-logical-spec` always, `selector-max-id: 0`, `declaration-no-important` except `.visually-hidden`/reduced-motion, disallow `transition: all`, disallow `@import` of remote URLs) | any error |
| 12.12 | Budgets | `scripts/check-budgets.mjs` (gzip -9 sizes of each asset vs §13.2 table) | any over budget |
| 12.13 | Content audit (separate job, protected secret `SHOPIFY_ADMIN_TOKEN`, runs nightly + manual + before any founder review) | `scripts/export-content.mjs` → `data/content-export/*.json` (gitignored) then 12.2/12.3/12.5 against the export; plus `bts_media` rules (§6.4): approved pack-bearing media with stale `label_version` = fail | any failure |
| 12.14 | Forbidden mutations | grep | §7.5 mutation names anywhere outside `scripts/__tests__` |

`data/labels.json` shape: `{ "reset": { "name", "front_line", "hero_actives", "suitability", "size": "200 mL", "pills": [], "back_description", "inci": [..], "inci_version": "FINAL-v5" }, … }`. `check-inci.mjs` also verifies `name`, `front_line`, `pills`, `back_description` against the MD.

---

## 13. Performance

### 13.1 Targets (lab: Lighthouse mobile, Moto G Power emulation, Slow 4G; field: CrUX/Shopify Web Performance p75 after launch)
| Metric | Hard gate (fail CI) | Target |
|---|---|---|
| LCP | ≤ 2.5 s all templates; ≤ 2.0 s Home, PDP, Shop | ≤ 1.8 s |
| CLS | ≤ 0.05 | ≤ 0.01 |
| INP (field) / TBT (lab) | TBT ≤ 150 ms | INP ≤ 150 ms |
| Lighthouse Performance | ≥ 90 | ≥ 95 |
| Lighthouse Accessibility / Best Practices / SEO | 100 / ≥ 95 / 100 (SEO measured with `noindex` override in CI) | |
| Requests before LCP | ≤ 12 | |
| Console errors | 0 | |

### 13.2 Byte budgets (compressed, per page view, excluding `content_for_header` Shopify scripts)
| Resource | Budget |
|---|---|
| HTML document | ≤ 45 KB gz (Home/PDP) |
| Render-blocking CSS (`bts-tokens` + `bts-base`) | ≤ 16 KB gz |
| Total CSS | ≤ 30 KB gz |
| JS total on page | Home ≤ 22 KB gz · PDP ≤ 26 KB gz · others ≤ 20 KB gz |
| Fonts | EN ≤ 80 KB total · AR ≤ 120 KB total; ≤ 2 preloaded |
| Images above the fold (390 px, DPR 2) | ≤ 300 KB; LCP image ≤ 110 KB |
| Third-party (theme-initiated) | 0 KB prototype; launch: review app only, lazy on intersection, ≤ 40 KB |
| Video | 0 bytes before user tap |

### 13.3 Media loading
- All images through `image_url` + `image_tag` with explicit `width`/`height`, `widths` (`240,360,480,640,800,960,1200,1600`) and `sizes` per variant (shelf mobile `82vw`, desktop `(min-width: 990px) 22vw`; grid `(min-width: 990px) 23vw, 46vw`; pdp `(min-width: 990px) 50vw, 100vw`). Shopify CDN negotiates AVIF/WebP.
- LCP image: `loading="eager" fetchpriority="high"`, never inside a hidden/inert container, never CSS background. Exactly one `fetchpriority="high"` per page.
- Below-fold: `loading="lazy" decoding="async"`.
- `aspect-ratio` on every media container; faces fixed 4:5; gallery 4:5.
- Video (A1/R1): `<video preload="none" playsinline muted poster>` inserted on tap only; `Save-Data` → never auto-inserted poster sets beyond first.
- Respect `navigator.connection.saveData` and `prefers-reduced-data` (where supported): skip gallery prefetch.

### 13.4 Font plan
- Self-hosted WOFF2 in `assets/`, subset with `pyftsubset`: Latin (U+0000-00FF, U+2013-2014, U+2018-201D, U+2022, U+2026, U+20AC, U+2192, U+21BB) and Arabic (U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF) + the Latin digits.
- Faces: Latin display (1 weight, ≈ 18 KB), Latin UI variable 400–600 (≈ 45 KB) or 2 static weights; AR UI 400/600 (≈ 2 × 35 KB); AR display 1 weight (≈ 40 KB).
- `bts-fonts.liquid` loads only the current locale's families plus Latin UI (Arabic pages still show Latin names/INCI). Preload: EN → Latin UI regular; AR → AR UI regular. Display faces are not preloaded (they are not LCP).
- `font-display: swap` + fallback `@font-face` with `size-adjust`/`ascent-override` metrics for Arial/Tahoma so swap causes no CLS (measured).
- The wordmark is SVG, never a font.
- Licence check for any label secondary typeface before use (Creative §2 Type).

### 13.5 Runtime
- No layout reads after writes in loops; turn uses transform only; drawer/menu use `translate` + `opacity`; `will-change` only during transition.
- Long tasks: no task > 50 ms on init on the Moto G profile (measured in CI trace).

---

## 14. Accessibility — WCAG 2.2 AA test items

Automated: `@axe-core/playwright` on every template × locale × {375, 1440} × {default, reduced motion}, zero violations (`wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa` tags). Manual items are scripted as Playwright keyboard tests where possible; the rest are a signed checklist in the PR (VoiceOver iOS, TalkBack Android, NVDA/Firefox).

| SC | Test item |
|---|---|
| 1.1.1 | Every approved image has authored per-locale `alt`; decorative duplicates `alt=""`; wordmark in header has name "Between Two Suns" |
| 1.3.1 | Faces are `<article>` with heading; lists are lists; AM/PM is a radiogroup; finder uses fieldset/legend; tables none for layout |
| 1.3.2 | DOM order = visual order in LTR and RTL at all breakpoints (no `order:` reversing) |
| 1.3.4 | No orientation lock |
| 1.3.5 | Capture/contact inputs have `autocomplete` |
| 1.4.1 | Product colour never the only identifier (name + step always present) |
| 1.4.3 | All informative text ≥ 4.5:1, including ink on each pack surface colour (tested per `surface_color`); large display ≥ 3:1 |
| 1.4.4 / 1.4.10 | 200 % zoom and 320 CSS px reflow without loss (faces, drawer, sticky bar) |
| 1.4.11 | Pills borders, focus rings, inputs, turn button ≥ 3:1 |
| 1.4.12 | Text-spacing bookmarklet: no clipping in faces (back scrolls), buttons, pills |
| 1.4.13 | Shop flyout on hover: dismissible (Esc), hoverable, persistent |
| 2.1.1 / 2.1.2 | Every action by keyboard; no traps; dialogs trap and release correctly |
| 2.2.2 | No auto-moving content (no autoplay, no auto-advance) |
| 2.3.1 | No flashing |
| 2.4.1 | Skip link works, one `main` |
| 2.4.2 | Unique localised titles |
| 2.4.3 | Focus order logical; after turn, focus remains on turn button; after dialog close, focus returns to invoker |
| 2.4.4 | Link purpose clear ("Turn over" has full accessible name; duplicate photo links removed from tab order) |
| 2.4.6 | Headings describe; one `h1` per page |
| 2.4.7 | Visible focus on all controls (2 px ink outline + 2 px offset; on coloured surfaces, ink + white double ring) |
| **2.4.11** | Focused elements never fully hidden by sticky header or sticky ATC (scroll-padding) |
| 2.5.1 / **2.5.7** | Shelf/gallery swipe has single-pointer alternatives (tap non-active card, thumbnail rail, keyboard) |
| 2.5.3 | Visible label text included in accessible names ("Add · EGP 399" button name starts with "Add") |
| **2.5.8** | Targets ≥ 24 × 24 (we use ≥ 44 × 44 on touch) |
| 3.1.1 / 3.1.2 | `lang` on html; Latin fragments in AR pages carry `lang="en"` |
| 3.2.1 / 3.2.2 | No context change on focus; locale switch only on explicit submit |
| **3.2.6** | Help/WhatsApp in the same relative place on every page (footer + menu) |
| 3.3.1 / 3.3.3 | Form errors inline, described, suggested fix |
| **3.3.7** | Finder answers persist when going back; checkout-adjacent forms don't re-ask |
| **3.3.8** | No cognitive-test auth (Shopify accounts: email code) |
| 4.1.2 | Turn button `aria-pressed`; hidden face `inert`; no `aria-hidden` on focusable content; combobox/listbox states correct |
| 4.1.3 | Add, remove, qty change, swap, search counts, errors announced via live regions without focus move |
| Motion | `prefers-reduced-motion`: turn = 120 ms crossfade, drawer = fade, no smooth scroll |
| Screen reader script | VO iOS: land on Home → find Clarity → turn over → hear pills and ingredients → add → drawer announces → checkout-blocked message. Same in AR with TalkBack. |

---

## 15. Analytics hooks

- `BTS.track(name, payload)` in `bts-core.js` merges the common payload (Arch §9): `mode, locale, market, currency, template, source, sku_handle, step, display_price` and forwards to the transport in `bts-analytics.js`.
- `source` = explicit argument or `closest('[data-source]')` value. Source ids: `home_shelf`, `home_routine`, `home_texture`, `shop_grid`, `shop_routine`, `shop_chip`, `pdp_primary`, `pdp_sticky`, `pdp_routine_line`, `pdp_neighbours`, `bundle_pdp`, `routine_page`, `routine_step`, `drawer_suggestion`, `drawer_empty`, `finder_result`, `search_suggest`, `search_results`, `flyout`, `menu`, `404`, `reorder`.
- Events and firing points exactly as Arch §9 table, plus `bts_runtime_error` (§11.2). Each event fires from one place (the owning component) — listed in `docs/analytics-events.md` generated from a `EVENTS` const in `bts-core.js` (single registry; `track()` rejects unknown names with a `[bts]` warning → CI fails).
- Transport: prototype → `window.dataLayer.push({event, ...payload})` only; `?debug=1` also `console.debug`. Launch → `Shopify.analytics.publish(name, payload)` if defined; a single custom pixel (Customer Events) forwards to GA4/Meta/TikTok **after consent** via Customer Privacy API. No ad pixels are installed while `bts_mode = prototype`.
- No PII in payloads (lint: payload keys allowlist).
- Playwright asserts the event trail for journeys 5.1 and 5.4 in prototype mode (`dataLayer` contents).

---

## 16. SEO and JSON-LD guards

- `bts-meta.liquid`: `<title>` per Arch §10 pattern (from content `seo_title` when present), meta description from content/page SEO, `canonical_url`, OG/Twitter (image = approved H1 for PDP, wordmark PNG for others). **Robots guard:** `noindex,nofollow` when `settings.bts_mode == 'prototype'` OR template suffix `preview-product` OR `template.name == 'search'` with no terms. Do not hand-roll hreflang (Shopify outputs it).
- `bts-jsonld-product.liquid` emits `Product` with name, image[], description, sku (launch), brand, `additionalProperty` size. **`offers` only if** `settings.bts_mode == 'launch'` and `product.published_at` present and `variant.price > 0` and variant not `requires_selling_plan`-only; `availability` from `variant.available`. **`aggregateRating`/`review` only if** `product.metafields.reviews.rating_count.value >= 5`. Never in prototype. Bundle: `isRelatedTo` components.
- Home: `Organization` (logo PNG export of wordmark, `sameAs` from social settings) + `WebSite` + `SearchAction` (`{{ routes.search_url }}?q={search_term_string}`). Shop: `ItemList`. Everywhere: `BreadcrumbList`. Help: `FAQPage` (approved FAQs only). Ingredient: `WebPage` + `about` `DefinedTerm`. Article: `Article`.
- All JSON-LD built with `| json` filters (no string concatenation of user content). Playwright parses every `application/ld+json` block (`JSON.parse` must succeed) and asserts: no `offers`/`aggregateRating` in prototype; required keys present.
- Alt text per locale (§6.2 `bts_media.alt`), never filenames.

---

## 17. Automated test matrix

### 17.1 Environments
- Target: an unpublished CI theme (`BTS-CI`, fixed ID) on the dev store, pushed with `shopify theme push --theme $CI_THEME_ID --nodelete` using a Theme Access password secret. Playwright logs past the storefront password via POST `/password` (secret `STORE_PASSWORD`) and uses `?preview_theme_id=$CI_THEME_ID`.
- Local: `shopify theme dev` (http://127.0.0.1:9292) with the same specs.
- Browsers: Chromium, WebKit, Firefox (desktop); WebKit (iOS Safari proxy) and Chromium (Android proxy) mobile emulation. Real-device pass (iPhone 13/15 Safari, mid-tier Android Chrome, Samsung Internet) before founder review — manual, recorded.

### 17.2 Matrix
| Dimension | Values |
|---|---|
| Viewports | 375×667, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1440×900 |
| Locales | EN (`/`), AR (`/ar`) |
| Motion | default, `reducedMotion: 'reduce'` |
| JS | on, off (P0 flows only) |
| Mode | prototype (always); launch (staging theme with a test market + test products in a separate dev store, P1) |
| Founder | `?founder=1` on/off (Home, PDP, drawer) |

Templates crawled per cell: `/`, `/collections/shop`, 4 × PDP (preview routes in prototype), bundle PDP, `/pages/routine`, `/pages/find-your-routine`, `/pages/our-approach`, `/pages/ingredients`, one ingredient detail, `/pages/about`, `/pages/help`, `/pages/delivery`, `/search?q=spf`, `/search?q=واقي`, `/search?q=zzzz`, `/cart`, `/404-test`, `/password` (logged-out context).

### 17.3 Assertions per page (every cell)
1. No `pageerror`, no `console.error`, no console message containing `[bts]`.
2. Shell counts (§3.5).
3. axe: zero violations.
4. No horizontal overflow (`document.scrollingElement.scrollWidth <= innerWidth`).
5. All `ld+json` parse; prototype guards (§16).
6. No text matching banned terms or "pending"/"TBD"/"lorem" in visible text; in founder mode no `.bts-internal` visible.
7. Every `<img>` has `width`/`height`/`alt`; exactly one `fetchpriority=high` on templates with an LCP image.
8. Screenshots saved as artifacts (visual review; pixel-diff gating from P1 with 0.2 % threshold on stable templates).

### 17.4 Flow tests
| Flow | Steps | Asserts |
|---|---|---|
| Home → add single | 375×667: price + Add visible without scroll; tap Add | drawer opens, focus on heading, live region text, count = 1 |
| Home → routine in 2 taps | tap routine strip → tap Add | drawer shows one routine line with 4 components, saving line (prototype) |
| Turn over (every face surface) | keyboard: Tab to turn → Enter | `aria-pressed=true`, back not inert, front inert, focus still on turn button, Add unchanged (bounding box identical before/after), Tab order goes into back content only when back shown |
| Turn in RTL | AR | computed transform sign reversed; photo not mirrored |
| Reduced motion turn | | no transform transition; opacity transition ≤ 120 ms |
| Drawer swap | add Reset + Clarity → suggestion shows "adds 03 Barrier + 04 Defense" → Switch | lines = routine only; no suggestion |
| Prototype checkout | press checkout | not navigated; `bts_prototype_checkout_blocked` in dataLayer; message announced; visible with `?founder=1` |
| PDP sticky ATC | scroll past Add | sticky visible; hidden when drawer open; hidden when footer visible; focused elements not obscured |
| Search | type "niac" / "نياسيناميد" / "صن بلوك" | Clarity (and Defense/Barrier for niacinamide) first; keyboard ↓ Enter navigates; zero-results path |
| Finder | 3 answers; back/forward | persistence; result shareable URL; Tight/dry honesty note |
| Locale switch | on PDP preview | lands on `/ar/pages/preview-…` same page; `dir=rtl` |
| No-JS | Home, PDP, Routine, Search, Cart | content present; Add disabled with explanation (prototype); search results render |
| Keyboard-only full journey | Home → Shop → PDP → turn → Add → drawer qty +/− → close → menu → search → Esc | never loses focus; Esc behaviour; focus return |
| Budget | Lighthouse CI on `/`, Shop, Clarity PDP, Routine, `/ar` Home (3 runs, median) | §13.1 gates |

---

## 18. Migration and cleanup (v5–v11 dead files)

Order matters: a JSON template must stop referencing a section before the section can be deleted, or `theme push` fails.

1. **Tag** current state: `git tag archive/v11-2026-09-29` (history keeps every generation; no archive folders in the theme).
2. **P0-0 hotfix** (§1.1) on `build/vertical-slice` so the dev theme is error-free while v12 builds.
3. Add `.shopifyignore`: `opus-brand-pack/`, `review-assets/`, `final-review-v8/`, `live-review-v8/`, `data/`, `scripts/`, `tests/`, `docs/`, `node_modules/`, `package*.json`, `*.config.*`, `tsconfig.json`, `.github/`. Move `final-review-v8/`, `live-review-v8/`, `review-assets/` under `docs/archive/` (or out of the repo) — they are not theme code.
4. Build v12 shell + home (P0). Switch `templates/index.json` from `bts-home-v11` to the v12 sections **in the same commit** that adds them.
5. **Delete** (single commit "chore: remove v5–v11 homepage generations"):
   - `sections/bts-home-v5.liquid` … `bts-home-v11.liquid`, `sections/bts-experience.liquid`
   - `assets/bts-home-v5…v11.{css,js}`
   - `assets/bts-{reset,clarity,defense,barrier}-clean-v11.{png,webp}` (Barrier too: product media moves to Files as `bts_media`; the Barrier render may be re-uploaded as an approved `H1` interim entry only if its label matches — founder/ops confirm)
   - `assets/bts.css`, `assets/bts.js` (replaced by `bts-tokens/base/*` and `bts-core.js`; do not port the 117 environment rules)
   - `sections/bts-product.liquid`, `bts-collection.liquid`, `bts-cart.liquid` (replaced by `bts-pdp`, `bts-shop`, `bts-cart-page`); `bts-404.liquid` rewritten in place
   - old `settings_schema.json` groups used only by v5–v11 (grep each setting id; remove unused)
6. Grep gates after deletion: no reference to `bts-home-v`, `b11`, `bts-experience`, `clean-v11`, `bts.css`, `bts.js`, `data-t=` anywhere in theme dirs.
7. Docs: update `README.md` (remove "Environmental States" as a creative primitive; describe v12 architecture and `npm run check`); mark `BRAND_MANIFEST.md` product-territory section superseded by `FINAL_LABEL_SOURCE_OF_TRUTH.md` (Creative §7 P0-2).
8. Shopify GitHub sync hazard: the dev theme is connected to this branch and commits editor changes back ("Update from Shopify"). Before each push/PR: `git pull --rebase`; template JSON edits made in the editor are respected, never force-overwritten.

---

## 19. Safe rollout and rollback

### 19.1 Themes
| Theme | Branch | Mode | Purpose |
|---|---|---|---|
| `BTS-Development` | `build/vertical-slice` | prototype | daily build; founder preview link |
| `BTS-CI` | pushed by CI | prototype | automated tests only |
| `BTS-v12-Staging` | `release/v12` | prototype → launch rehearsal | pre-publish QA |
| Live (published) | `main` | password page only until launch | the public face today |
| `BTS-Rollback-{date}` | duplicate of live before each publish | — | one-click rollback |

### 19.2 Content seeding (prototype, now)
`node scripts/seed-content.mjs --store $STORE --dry-run` then without `--dry-run`: creates definitions, upserts content from `data/labels.json` + authored copy files (`data/content/*.{en,ar}.json`), prototype config from the seed, preview pages. Idempotent; prints a diff; allowlisted mutations only (§7.5). Arabic content is uploaded via Translate & Adapt import/export or `translationsRegister` **only for fields a human writer has approved** (`data/content/*.ar.json` has `"approved_by"` per entry; unapproved entries are skipped, and the storefront falls back to EN for that field with `lang="en"`).

### 19.3 Launch runbook (requires explicit founder approval at each ★)
1. ★ Pricing locked (Scenario A or B); ★ label/claims/INCI signed off; ★ service policies approved per market.
2. On `BTS-v12-Staging`, set `bts_mode = launch` **while products are still DRAFT** → every product surface must show "Coming soon" + Notify, no prices, no `offers` JSON-LD. This proves the launch guards. (Playwright launch-mode suite.)
3. Admin (human, not scripts): set EGP money format "without currency" to `{{amount_no_decimals}}`; set variant prices / price list; create Shopify Bundles fixed bundle `the-full-routine`; set `bts.content` on each product; set `bts.bundle_verified` ★; configure payments/COD ★; inventory ★.
4. ★ Publish products to Online Store sales channel. Staging now shows real prices; run full matrix + Lighthouse + manual device pass + founder review.
5. Duplicate live theme → `BTS-Rollback-{date}`. Publish `BTS-v12-Staging` (still behind storefront password). Smoke test 15 minutes.
6. Delete preview pages; add URL redirects `/pages/preview-{h}` → `/products/{h}`; remove `bts_prototype_config` entry (keep definition + git seed).
7. ★ Remove storefront password. Install consent-gated pixels. Monitor.

### 19.4 Monitoring after each publish (first 48 h)
Shopify Web Performance (LCP/INP/CLS p75), `bts_runtime_error` count (must be 0), add-to-cart rate by `source`, checkout starts, `bts_search_zero` terms, 404 hits.

### 19.5 Rollback
| Trigger | Action | Time |
|---|---|---|
| Any `bts_runtime_error` spike, checkout break, wrong price/claim visible | Publish `BTS-Rollback-{date}` (admin → Themes → Publish) | < 2 min |
| Price issue only | Revert price list / set products back to DRAFT (★ founder) — theme shows "Coming soon" automatically | < 5 min |
| Bundle issue | Set `bts.bundle_verified = false` → saving lines disappear; or unpublish bundle product → routine offer hides (Arch §8: routine hides if any component unavailable) | < 2 min |
| Section-level issue | Remove the section from the JSON template in the editor (modules are independent) | < 5 min |
| Code | `git revert` the merge on `main`, CI, push | < 30 min |
Content model changes are **additive only** during rollout (new fields/types; never rename/delete fields in use), so the rollback theme always reads valid data.

---

## 20. Build checklist

### P0 — required before founder review (Creative §6 gate)
- [ ] **P0-0** v11 hotfix: `null.tabIndex` fixed, `aria-hidden` → `inert`, dead swatch block removed, 3 wrong-label renders removed from the dev theme (§1.1)
- [ ] Tag `archive/v11-2026-09-29`; `.shopifyignore`; move review folders out of theme root (§18)
- [ ] Tooling: `package.json`, eslint + `tsc --checkJs --strict`, stylelint logical, `.theme-check.yml`, all `scripts/check-*.mjs`, CI workflow, `data/labels.json` + INCI parity passing (§12)
- [ ] Metaobject definitions + seed script with mutation allowlist; content seeded EN; prototype config seeded Scenario B; preview pages created; **no product touched** (§6, §7)
- [ ] `layout/theme.liquid` single shell; header/footer/overlay section groups; one cart count; self-hosted subset fonts; Google Fonts removed (§3, §13.4)
- [ ] `bts-core.js` (`define`, `BTSElement` parts contract, `track`, money, config) + error boundary (§11)
- [ ] `bts-face` snippet + `bts-face.js` + CSS: turn, `inert`, `aria-pressed`, RTL `--dir`, reduced-motion crossfade, fixed Add (§4)
- [ ] Adapters: `bts-price`, `bts-add`, `bts-product-url`, `bts-face-list`, `bts-mode` (§7.2)
- [ ] Prototype cart adapter + drawer (one suggestion, swap, checkout blocked, founder-safe markers) + `/cart` page (§10)
- [ ] Home: shelf (375×667 price+Add in view), routine offer, back explained, approach teaser; media-gated modules hidden (§9.1)
- [ ] Shop, PDP (singles, via preview pages), bundle PDP, Routine page (§9.2–9.5)
- [ ] Search (local index + `/search` server fallback), 404, password page (§9.10, 9.13, 9.14)
- [ ] `ar.json` complete for all P0 UI strings; `/ar` renders every P0 page; logical-properties lint clean (§8)
- [ ] Menu sheet, locale switch form, header count (§3)
- [ ] JSON-LD + robots guards (prototype noindex, no offers) (§16)
- [ ] Analytics registry + dataLayer transport; journey trails 5.1 / 5.4 asserted (§15)
- [ ] Test matrix §17 green: 0 console errors, axe 0, no overflow, Lighthouse gates on 5 URLs
- [ ] v5–v11 deletion commit; grep gates clean; README/BRAND_MANIFEST corrected (§18)
- [ ] Approved H1 ×4 uploaded as `bts_media` with `label_version = FINAL-v5` (media dependency; without it the founder gate cannot pass)

### P1 — required for launch
- [ ] Finder (+ no-JS anchors) (§9.6)
- [ ] Our approach, Ingredients index + metaobject detail, About (§9.7–9.9)
- [ ] Help hub, Delivery/Payment/Returns (approved-only service records), Patch test, Contact/WhatsApp (§9.12)
- [ ] Capture (email; WhatsApp only if approved) (§9.15)
- [ ] Authored Arabic content for all metaobjects (human, approved), AR composition review at 375/390/430 (§8)
- [ ] ShopifyCart adapter + launch `bts-add` forms + launch drawer/cart page; bundle via Shopify Bundles; `bundle_verified` gating (§10.1, §10.3)
- [ ] Launch-mode suite on staging with DRAFT products (Coming soon everywhere), then with test-published products on a separate dev store (§17.2, §19.3)
- [ ] Predictive Search API integration + synonym layer; Arabic tokenisation verified (§9.10)
- [ ] Reviews: review app integration, ≥ 5 threshold, `aggregateRating` guard (§16)
- [ ] Consent-gated custom pixel; Customer Privacy API (§15)
- [ ] Sticky ATC edge cases on real devices (keyboard, safe-area) (§5.4)
- [ ] Pixel-diff visual regression on stable templates (§17.3)
- [ ] Content audit job (Admin token) green before every founder review and at launch (§12.13)
- [ ] Rollback theme duplicated; runbook rehearsed on staging (§19)
- [ ] Real-device pass (iOS Safari, Android Chrome, Samsung Internet) EN + AR

### P2 — post-launch / content-gated
- [ ] Learn blog + articles (nav only at ≥ 6 articles) (§9.16)
- [ ] Concern chips → real filters at ≥ `concern_filter_threshold` SKUs (§9.2)
- [ ] Reorder entry points (header/shelf/drawer) for logged-in customers (§3.2, §9.1)
- [ ] Markets UAE/KSA: price lists, service records, `/en-ae` `/ar-sa` QA, market selector, soft market banner
- [ ] `/collections/sets` only when a second real set exists
- [ ] Texture row, campaign frame, on-skin, layering film modules as approved media lands (no code change, content only)
- [ ] Back-in-stock / Notify app replacing contact-form Notify
- [ ] `gift_card.liquid` branded; account reorder polish
- [ ] Revisit Arabic-default for Egypt after 30 days of data; revisit Western vs Arabic-Indic digits with market testing
