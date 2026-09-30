# V12 typography selection and integration specification

Decision: IBM Plex Sans Condensed 600 for Latin product names/PDP titles; IBM Plex Sans 400/500 for Latin UI/body/claims/INCI; IBM Plex Sans Arabic 600 for Arabic display and 400 for Arabic UI/body. These are selected for procurement and metric review, **not licensed or activated in this repo**. The exact BTS wordmark and )( stay the supplied SVGs.

The [official IBM Plex repository](https://github.com/IBM/plex) identifies the Sans, Sans Condensed and Arabic families and publishes an OFL licence. That upstream reference is not a local licence/provenance record for delivered webfont files. No IBM font binary or licence was imported in this task. Selection reflects one coherent condensed/grotesk/bilingual system alongside the exact wordmark; it does not claim to be the unknown label typeface.

The full workspace audit is `data/production/asset-audit.json`, including hashes. No fonts exist in theme assets or brand-pack sources. Ignored tooling contains Inter/JetBrains Mono and codicon binaries without established font-specific licence evidence in this workspace. Shopify CLI's Source Code Pro Regular WOFF2 has an adjacent full Adobe/SIL OFL licence. It is a licensed monospace developer font, not the requested condensed Latin + neutral UI + Arabic system; it remains in tooling and is not used as brand typography. Software package licences are not substitutes for font rights.

| Token / role | Required future file in `assets/` | Weight | Original fallback (superseded for prototype) |
|---|---|---:|---|
| `--font-display`: Latin proper product names and PDP title only | `bts-display-latin-600.woff2` | 600 | `Arial Narrow`, Arial, sans-serif |
| `--font-ui`: UI, copy, price, claims, back and INCI | `bts-ui-latin-400.woff2`, `bts-ui-latin-500.woff2` | 400 / 500 | Arial, sans-serif |
| `--font-ar-display`: authored Arabic headings | `bts-arabic-600.woff2` | 600 | Arial, sans-serif |
| `--font-ar-ui`: Arabic UI/body and reviewed label copy | `bts-arabic-400.woff2` | 400 | Arial, sans-serif |

`data/production/typography-spec.json` is the machine-readable decision. Prototype token stacks use safe local/system fallbacks; no invented `@font-face`, missing font URL, remote font request or preload is emitted. Arabic is not compressed to imitate Latin; use no tracking, Arabic UI leading 1.7, Latin UI leading 1.45 at 16 px and back text at least 14 px. Latin proper names/INCI remain isolated and use Latin faces in Arabic pages.

Delivery requires the exact upstream release/version, font binary hashes, font-specific copyright and complete licence text under `data/production/licenses/`; preserve licence/copyright with the fonts in the distributable theme as required. Subsetting or conversion must retain shaping tables, used Latin glyphs/punctuation, Arabic contextual forms/marks, both numeral sets and licence-required notices/naming. Do not assert blanket traffic rights from a marketing page or create a fake licence file.

Only once that evidence is established in repo: place the five real WOFF2 files flat in assets, define the actual face names through the existing BTS tokens with `font-display: swap`, and preload at most two appropriate fonts per locale. Measure real x-height/ascent/descent and fallback metrics before any `size-adjust` or metric override. Then run E1's 990–1280 width sweeps, E2's 200% EN/AR cells, claims containment, commerce/floor alignment, font coverage/shaping, INCI, Arabic line-break and CLS checks on real Shopify/device rendering. The E1/E2 CSS remains intrinsic and must not be returned to fixed heights to accommodate fonts.

## Post-live-review prototype fallback

The future licensed BTS slots remain unfilled. Display now prefers locally installed Avenir Next Condensed, DIN Condensed, Roboto Condensed, then Arial Narrow and generic sans-serif; UI uses the system UI stack. Arabic prefers Geeza Pro, Noto Sans Arabic, Tahoma and sans-serif. Avenir Next Condensed and Geeza Pro are present in this review machine’s system font directory; CSS uses them locally without copying or distributing their binaries. Latin name spans explicitly retain the display family in AR. No downloaded font, invented licence, font-face, guessed metrics or preload. This is representative prototype typography, not final C8 approval; appearance depends on installed fonts.
