# News Dieppe · Daily Scripture & Quotes in Glass Neon

> *"Come to me, all you who are weary and burdened, and I will give you rest."*  
> — **Matthew 11:28**

A pure SVG, CSS, and vanilla JavaScript animated neon typography Progressive Web App (PWA). Amber, blue, white, and rose glass neon tubing with metal clips, ceramic electrode sleeves, and looping return wires mounted on a black fabric backdrop.

- **Production Live**: [https://news.dieppe.app/](https://news.dieppe.app/)
- **GitHub Pages**: [https://1st3.github.io/neon-rest-matthew-1128/](https://1st3.github.io/neon-rest-matthew-1128/)

## Highlights

- **Flexible Single-Stroke Vector Lettering**: Complete custom centerline glyph geometry (`A–Z`, `0–9`, and punctuation in `neon.js`) tracing the true centerline of bent glass neon tubes. No fonts, bitmap canvases, or photos are used for the letters.
- **Per-Refresh Quote Rotation (`localStorage`)**: Stores all verses in `localStorage` (`neon_verses_catalog`) and rotates to a new quote/verse on every page refresh (or when clicking the verse reference / using the `#shuffle` app shortcut).
- **Weekly Service Worker Sync (`sw.js`)**: Precaches the entire app shell for instant offline access and updates the verse catalog from the backend (`./verses.json`) only once a week (`7 days`).
- **Build-Stamped Cache (`sw.js`)**: The cache name carries the deploying commit SHA, so every release replaces the precached shell instead of leaving returning visitors and installed-app users on a stale build.
- **Lightweight Backdrop**: The hero photograph ships as a 77 KB WebP (with a 143 KB JPEG fallback), not a 1.9 MB PNG. The source image lives in `art/blank-shirt.png` and is never deployed.
- **Standards-Compliant PWA (`site.webmanifest`)**: Complete vector-first icon suite (`favicon.svg`, multi-frame `favicon.ico`, 16/32/48/180/192/512 PNGs, 80%-safe-zone maskable icons, and wide/narrow install screenshots).
- **Generative Engine Optimization (GEO) & Accessibility**: Machine-readable `/llms.txt` and `/llms-full.txt` standards, full Schema.org JSON-LD `@graph` (`WebApplication`, `Organization`, `FAQPage`), explicit AI crawler permissions in `robots.txt`, screen reader live regions (`aria-live`), skip link, and keyboard navigation (`Space`/`N`/`Esc`).
- **Zero Dependencies**: Vanilla HTML5, CSS3, and JavaScript with zero runtime or test dependencies.

## Generative Engine Optimization (GEO) & AI Discovery

News Dieppe provides first-class machine-readable documentation and discovery endpoints for LLM search engines (ChatGPT Search, Perplexity, Claude, Gemini, Copilot):

- **Summary Context**: [`/llms.txt`](https://news.dieppe.app/llms.txt) — High-level product summary, feature breakdown, audience, and official links.
- **Deep Reference**: [`/llms-full.txt`](https://news.dieppe.app/llms-full.txt) — Comprehensive typography engine specs, spectroscopy palette, offline architecture, and FAQ.
- **AI Crawler Directives**: Explicit `robots.txt` access rules for `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, and `Applebot-Extended`.
- **Crawlable Semantic HTML**: Pre-rendered FAQ sections and Schema.org JSON-LD graph answering natural user questions without client-side hydration.

## Local Development & Verification

```bash
# Run unit & manifest verification tests
npm test

# Regenerate the neon.js verse seed from verses.json after editing the catalog
npm run sync:catalog

# Regenerate icons from the vector mark (requires rsvg-convert)
npm run icons

# Capture wide (1280x800) & narrow (780x1688) screenshots via Chrome CDP
npm run screenshots

# Audit manifest via Chrome DevTools Protocol (Page.getAppManifest)
npm run verify-manifest
```

## Verse Catalog: One Source of Truth

`verses.json` is the canonical catalog — it is what the Service Worker syncs weekly and what the admin tooling edits. `neon.js` carries a synchronous copy (`DEFAULT_VERSES`) so the very first paint can render a verse without waiting on the network.

Edit `verses.json`, then run `npm run sync:catalog` to regenerate the seed. `test/catalog.test.js` fails the build if the two ever drift apart, which previously left the same verse reading one way on the first visit and another way after the weekly sync.

## License

MIT

## UTM & AI Referral Traffic Capture (rv415)

Email-signature links carry `?utm_source=sig&utm_medium=email`, and incoming visitors from AI search engines (ChatGPT, Perplexity, Claude, Brave Search) carry organic referrers. nginx on rv415 writes one JSON line per tagged or AI-referred page hit to `/var/log/nginx/utm-traffic.json` (no IP addresses). The config is `ops/rv415-utm-traffic.conf`, installed as `/etc/nginx/conf.d/00-utm-traffic.conf`. This site has no `access_log` of its own, so it inherits the shared one. `ops/` is not deployed to the web root.

### Cached visits (`/_t` report)

`sw.js` serves pages cache-first with `ignoreSearch`, so a repeat visitor or an installed-app user opens the page from the cache and nginx never sees it. To count those visits, the service worker sends one small request when it answers a page navigation from the cache and the URL has a `utm_source`:

- `GET /_t?utm_source=...&utm_medium=...` with `cache: 'no-store'`, no cookies, no referrer. Only the `utm_*` tags already in the URL are sent.
- Network-served visits are not reported, because nginx already logged them. Visits without `utm_source` send nothing. Offline, or any error, is ignored.
- nginx answers `/_t` with `204`. The block is in `ops/rv415-news-dieppe-beacon.snippet` and goes inside the `news.dieppe.app` server block of `/etc/nginx/conf.d/sites.conf` (manual, `ops/` is not deployed). It is needed because a plain 404 loses the query string and would not be logged.
- In the admin Traffic panel, `/_t` counts as a visit to the home page.
- Test: `node --test` (`test/sw-beacon.test.js`).
