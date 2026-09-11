# Brian Kiboi — Portfolio (deployed build)

This folder is the complete, deployment-ready build of **Brian Kiboi | Portfolio**
(a React + Vite single-page app). Serve it as static files from any host.

## Run locally

```bash
node /tmp/serve_portfolio.js
# → http://localhost:8899/
```

Or with any static server:

```bash
npx serve .
python3 -m http.server 8899
```

## What's inside

| File | Purpose |
| --- | --- |
| `index.html` | App shell + full SEO (meta, Open Graph, Twitter cards, JSON-LD Person/WebSite/Organization, PWA metas, service-worker registration) |
| `assets/` | Bundled JS/CSS (Vite build), portfolio imagery, tech icons |
| `desktop_pc/`, `planet/` | 3D models used in the hero |
| `sw.js` | Service worker — PWA install + offline shell (network-first navigation, cache-first hashed assets) |
| `manifest.json` | PWA manifest (icons, theme `#050816`) |
| `robots.txt` | Search-engine allow rules + sitemap reference |
| `sitemap.xml` | Sitemap for Google (single-page app) |
| `og-card-new.jpg` | 1200×630 social-share card (Open Graph / Twitter) |
| `og-card-favicon.png`, `apple-touch-icon.png`, `icon-192/512.png`, `icon-maskable-512.png` | Brand icons |
| `google8ccc378ecb46c2ec.html` | Google Search Console ownership verification |
| `CNAME` | Custom domain for GitHub Pages (`briankiboi.is-a.dev`) |
| `vercel.json` | Vercel config: cache headers, security headers, clean URLs |

## Deploy

- **Vercel**: point it at this folder (`vercel.json` is already configured).
- **GitHub Pages**: keep `CNAME`, push contents.
- **Any host**: just upload the folder and serve `/` → `index.html`.

## SEO / Search Console

1. Confirm the production URL — `https://briankiboi.is-a.dev/` is used in
   `index.html` (canonical/OG) and `sitemap.xml`. Swap if the domain changes.
2. In [Google Search Console](https://search.google.com/search-console) add the
   domain and verify (the `google8ccc…html` file proves ownership on that domain).
3. Submit `sitemap.xml`, then URL-Inspect the homepage to force indexing.

## Notes

- `assets/*.js` are hand-patched production bundles — keep `.bak*` copies when editing.