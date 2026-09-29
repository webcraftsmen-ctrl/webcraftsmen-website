# WebCraftsmen — source

`../index.html` is the finished site, built from these files (minified). Edit the files here, then run:

```
python3 build.py            # minified production build (uses esbuild; falls back to unminified if missing)
python3 build.py --pretty   # readable build, for debugging
```

| File | What's inside |
|---|---|
| `js/data.js` | **Edit here most of the time:** email/phone/hours, portfolio list, all RO/EN texts, the live-demo code |
| `head.html` | meta tags, icons, fonts, pre-paint theme/language script |
| `body.html` | page markup (hero → services → process → demo → pricing → contact, plus overlays) |
| `css/style.css` | all styles, with a table of contents at the top |
| `js/core.js` | utilities, i18n, preloader, cursor, nav, hero sphere, clock |
| `js/features.js` | live code demo, portfolio viewer, Matrix, nerd stats, disco/terminal modes, barrel roll |
| `js/ui.js` | Ctrl+K palette, terminal, dialogs, one-section-per-scroll, keyboard, init |
| `portfolio/*.html` | the 9 concept sites, bundled into the page and parsed only when the viewer opens |
