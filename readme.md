# Longbow — offline clone

A fully self-contained static copy of <https://db-longbow.webflow.io/>.
No network connection is required: every stylesheet, script, font, image and video is local.

## Run it

```bash
cd site
python3 serve.py          # http://localhost:8000
```

Use the included `serve.py` rather than `python3 -m http.server` — the plain
module doesn't answer HTTP **Range** requests, and the ~20 background videos
need them to play.

Any other static server works too (`npx serve`, nginx, Caddy…).
Opening `index.html` straight from disk (`file://`) will **not** work,
because the animation bundle loads its widgets as ES modules.

## Pages

| File | Original route |
|---|---|
| `index.html` | `/` |
| `roadster.html` | `/roadster` |
| `speedster.html` | `/speedster` |
| `climate-statement.html` | `/climate-statement` |
| `terms-conditions.html` | `/terms-conditions` |
| `privacy-policy.html` | `/privacy-policy` |

Internal links, including the `#gallery` / `#team` / `#reserve` anchors, are rewritten to the local files.

## Layout

```
assets/css/    Webflow stylesheet + self-hosted Google Fonts
assets/js/     Webflow runtime, jQuery, and the Digital Butlers animation bundle
assets/img/    66 images (photos, partner logos, signatures, favicons)
assets/video/  16 background videos (~50 MB)
assets/fonts/  28 woff2 files (Bebas Neue, EB Garamond, Geist Mono)
```

## What was changed from the original

* All absolute CDN URLs (`cdn.prod.website-files.com`, `s3.amazonaws.com`,
  `d3e54v103j8qbb.cloudfront.net`, `cdn.digitalbutlers.me`) rewritten to relative paths.
* `url(...)` references inside the Webflow CSS repointed at `../img/…`.
* The `WebFont.load()` Google-Fonts loader replaced with a local
  `google-fonts.css` plus self-hosted `woff2` files.
* Subresource-Integrity hashes and `crossorigin` attributes stripped —
  the hashes no longer match once URLs are rewritten.
* The custom bundle's loader (`assets/js/index.js`) originally resolved widget
  modules from `cdn.digitalbutlers.me` or `/src/<widget>/index.ts`. It's patched to
  load `./assets/js/<widget>.js`, and the 8 widget modules
  (header, marquee, text-reveal, text-split, card-animation, image-parallax,
  content-reveal, gallery-sticky) plus `features.js` are vendored locally.

## Fidelity

Verified against the live site in headless Chromium at 1440×900. Screenshots at
matching scroll positions are pixel-identical apart from regions containing
playing video or a scrolling marquee (timing-dependent); one full-viewport
section matched at RMS 0.00. The preloader, smooth scrolling, sticky gallery,
marquees, hover states, stat counters and the mobile layout all behave as on the original.

## Note

Content, branding and media belong to Longbow Motorcar Company Limited; the
template is by Digital Butlers. This copy is for local/offline reference only.
