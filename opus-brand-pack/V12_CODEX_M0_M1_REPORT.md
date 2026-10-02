# V12 minimal M0/M1 recovery

Completed locally on 2026-09-30. This is the temporary foundation requested for recovery, not the full M1 launch implementation or M2/M3 storefront.

## Restored foundation

- Created both v12 stylesheets, core JavaScript, seven sections and nine required snippets.
- Replaced active templates with their foundation sections.
- Layout has one header, footer, drawer and menu; server-rendered language/direction; guarded prototype mode and noindex; only v12 theme CSS/JS; no Google Fonts.
- English and naturally authored Arabic cover every foundation UI string. JavaScript uses server-rendered strings rather than translation tables.
- Copied all four supplied logo/icon SVGs byte-for-byte into active assets.
- Home displays the exact brand assets and “V12 foundation ready” messaging. No product imagery, reviews, service promises or sales claims.
- Settings default to prototype and launch confirmation false. Both switches are required to resolve launch mode.
- Prototype adapter uses localStorage, normalized cart totals in minor currency units, quantity limits, add/change/remove and explicit routine swapping. Storage corruption and storage denial are tolerated.
- Native dialogs support close, Escape and return focus. Bag count and cart page/drawer consume one adapter. No checkout form or checkout navigation is present.
- Shopify adapter exposes the same API but deliberately rejects mutations. It makes no network requests.

## Data safety and limited scope

Prototype prices resolve exclusively through the config metaobject specified by the implementation spec, whose source is data/prototype/config.json. No scenario amounts are duplicated into theme files. Because no Admin changes were authorized, a missing config metaobject produces an empty prototype bag and unavailable prices/add controls. The home itself does not require this metaobject.

The seed script defaults to a read-only local plan; --dry-run is supported. All other flags fail closed. It does not implement Admin access, definitions, upserts or publication. Existing product seed translations and claims were not expanded. Prototype URL helper returns the localized home until preview pages are implemented, avoiding nonexistent preview destinations.

System fonts are used; licensed self-hosted brand fonts remain deferred. Product/collection sections are intentional placeholders. Launch commerce, product experiences, quantity controls, preview pages and the broader M1 specification remain outside this minimal recovery.

The archive was not edited or deleted. Existing prior-pass changes were preserved. No commit, push, publish or Shopify Admin action was performed.

## Validation

Passed:
- node --check assets/bts-core.js and every scripts/*.mjs.
- git diff --check.
- Price literal check across active theme text files, deriving prohibited amounts from the source config.
- Zero climate vocabulary check for this minimal foundation.
- Label-source literal presence check for seeded names, sizes, INCI, promises and approved claims. This is a preliminary source-presence check, not per-product regulatory approval.
- Seed dry run, with no network or Admin calls.
- Active assets/sections/snippets/templates search: no banned Reset, Clarity or Defense v11 references.
- JSON parsing, section schema JSON, template section references, static snippet references and foundation translation-key coverage.
- Exact SVG byte parity with supplied source files.
- Isolated Node VM behavior checks: config-derived totals, routine swap, persistence, unknown handles, malformed/blocked storage, absent config, launch mutation refusal and core initialization without dialogs.

Blocked by environment:
- The exact requested Shopify docs search was run before writing; it returned “Search failed: fetch failed”.
- The exact skill validate.mjs was invoked with --theme-path and all 28 created/updated theme files in --files. It could not start because @shopify/theme-check-common is missing from the installed skill. No Shopify CLI is installed as a fallback. Theme Check is therefore NOT claimed as passed.

Not run: rendered Shopify preview, browser EN/AR testing, native dialog interaction testing, axe or Lighthouse. Local structural checks and isolated JavaScript checks do not establish those browser results.
