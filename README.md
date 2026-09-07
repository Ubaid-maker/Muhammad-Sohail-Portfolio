# Muhammad Sohail — Portfolio

Static portfolio site. No build step, no dependencies, no server code.
Open `index.html` locally or drop the whole folder onto any static host.

## Deploy

**Netlify** — go to app.netlify.com/drop and drag this folder in. Done.

**Vercel** — `npx vercel --prod` from inside this folder, or import it in the dashboard.

**GitHub Pages** — push the contents to a repo, then Settings → Pages → deploy from `main` / root.

**cPanel / shared hosting** — upload everything into `public_html`.

## Local preview

    python3 -m http.server 8000

Then open http://localhost:8000

## Structure

    index.html                  page markup
    assets/css/style.css        all styles
    assets/js/data.js           the work catalogue — brands, captions, order
    assets/js/app.js            rendering, filtering, viewer
    assets/img/work/            full-size creatives (1400px)
    assets/img/thumb/           grid thumbnails (620px)
    assets/img/sohail.png       portrait
    assets/favicon.svg          icon

## Editing the work

Everything in the gallery comes from `assets/js/data.js`. To add a piece:

1. Save the image twice — full size into `assets/img/work/`, a smaller copy
   into `assets/img/thumb/` — using the same filename in both.
2. Add an entry to the right brand's `items` array:

       { "id": "shyft-mats-07", "caption": "New headline test", "w": 1080, "h": 1350, "shape": "tall" }

To add a whole new client, copy an existing brand block in `data.js` and change
`slug`, `name`, `sector`, `market`, `site`, `note` and `items`. The filter chips
and the hero wall pick it up automatically.

To change contact details, experience or the About copy, edit `index.html`.
The accent colour is the `--signal` variable at the top of `style.css`.
