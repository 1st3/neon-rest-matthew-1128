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
- **Standards-Compliant PWA (`site.webmanifest`)**: Complete vector-first icon suite (`favicon.svg`, multi-frame `favicon.ico`, 16/32/48/180/192/512 PNGs, 80%-safe-zone maskable icons, and wide/narrow install screenshots).
- **Zero Dependencies**: Vanilla HTML5, CSS3, and JavaScript with zero runtime or test dependencies.

## Local Development & Verification

```bash
# Run unit & manifest verification tests
npm test

# Regenerate icons from the vector mark (requires rsvg-convert)
npm run icons

# Capture wide (1280x800) & narrow (780x1688) screenshots via Chrome CDP
npm run screenshots

# Audit manifest via Chrome DevTools Protocol (Page.getAppManifest)
npm run verify-manifest
```

## License

MIT

## UTM traffic capture (rv415)

Email-signature links carry `?utm_source=sig&utm_medium=email`. nginx on rv415 writes one JSON line per tagged page hit to `/var/log/nginx/utm-traffic.json` (no IP addresses). The config is `ops/rv415-utm-traffic.conf`, installed as `/etc/nginx/conf.d/00-utm-traffic.conf`. This site has no `access_log` of its own, so it inherits the shared one. `ops/` is not deployed to the web root.

### Cached visits (`/_t` report)

`sw.js` serves pages cache-first with `ignoreSearch`, so a repeat visitor or an installed-app user opens the page from the cache and nginx never sees it. To count those visits, the service worker sends one small request when it answers a page navigation from the cache and the URL has a `utm_source`:

- `GET /_t?utm_source=...&utm_medium=...` with `cache: 'no-store'`, no cookies, no referrer. Only the `utm_*` tags already in the URL are sent.
- Network-served visits are not reported, because nginx already logged them. Visits without `utm_source` send nothing. Offline, or any error, is ignored.
- nginx answers `/_t` with `204`. The block is in `ops/rv415-news-dieppe-beacon.snippet` and goes inside the `news.dieppe.app` server block of `/etc/nginx/conf.d/sites.conf` (manual, `ops/` is not deployed). It is needed because a plain 404 loses the query string and would not be logged.
- In the admin Traffic panel, `/_t` counts as a visit to the home page.
- Test: `node --test` (`test/sw-beacon.test.js`).
