---
name: verify
description: Build, launch and visually verify the novusolv-site marketing site (Vite SPA) after changes.
---

# Verify novusolv-site

## Build + serve
```powershell
npm run build      # tsc -b && vite build; check dist/assets chunk sizes in output
npm run preview    # serves dist on http://localhost:4173 (run in background)
```

## Quick asset checks
`Invoke-WebRequest -Method Head http://localhost:4173/<path>` for og-image.png, sitemap.xml, *.webp.
Note: SPA rewrite means unknown paths return 200 (index.html) — status codes can't prove a 404 page.

## Rendered-page screenshots (headless Edge)
Edge lives at `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`.
**Must** pass an isolated `--user-data-dir` or the screenshot silently fails (profile lock):
```powershell
& $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$tmp\edgeprofile" `
  --window-size=1440,900 --virtual-time-budget=8000 --screenshot="$tmp\shot.png" 'http://localhost:4173/'
```
- Sections below the hero use framer-motion `whileInView` — they render empty in static
  screenshots without scrolling; that's normal, not a bug.
- `--dump-dom` fires before React lazy chunks resolve → misses lazy-route content. Use
  `--screenshot` instead for anything on a lazy route (404 page, /analiza-gratuita).
- RO language: append `?lng=ro` (i18next querystring detector).

## Driving interactions (modal, network evidence)
No Playwright in this repo. Use CDP from PowerShell — working script pattern saved at the
session that created this skill; the recipe:
1. Launch Edge with `--remote-debugging-port=9223` + isolated user-data-dir.
2. `Invoke-RestMethod -Method Put 'http://localhost:9223/json/new?<url>'` → `webSocketDebuggerUrl`.
3. `System.Net.WebSockets.ClientWebSocket`: send `Runtime.evaluate` to click buttons
   (find by `textContent`), read `performance.getEntriesByType('resource')` for chunk-loading
   evidence, `Page.captureScreenshot` for the modal.

## Flows worth driving
- Hero CTA "Explore Your Transformation Roadmap" → BookCallForm modal (lazy chunk: BookCallForm + vendor-supabase load on demand from Navbar/Hero; Footer's inline form also pulls them post-hydration).
- `/valami-nemletezo` → 404 page (EN + `?lng=ro`).
- dist check: `vendor-supabase` must NOT appear in index.html `<link rel="modulepreload">`.