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
