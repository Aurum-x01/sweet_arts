# Sweet Arts — art portfolio (static site for GitHub Pages)

Pure HTML / CSS / JS. No Node, no build step.

## Publish on GitHub Pages
1. Create a repository and upload **everything** from this folder (including the hidden `.github` folder).
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)`.
3. Site opens at `https://<username>.github.io/<repo>/`.

## Adding artworks
Put images (jpg, png, webp, gif, avif, svg) into the **`photos/`** folder and commit/upload.
- The GitHub Action in `.github/workflows` rebuilds `photos.json` automatically (takes ~20 s), and the gallery shows the new works.
- Until the Action finishes, the site also reads the folder directly through the GitHub API.
- Nice captions: file name `dragon-queen.png` → "dragon queen".
- Newest uploads are shown first (there is a "newest / oldest" switch).
- The `photos` folder ships empty (the `.gitkeep` file only keeps the folder in git).
- If Actions can't push: repo → Settings → Actions → General → Workflow permissions → *Read and write*.

## Local preview
Opening the file by double-click will not load the gallery (browsers block it). Instead run in this folder:

    python -m http.server 8000

and open http://localhost:8000 — the gallery reads the `photos/` folder directly.

## Things to edit
- Email / socials: bottom of `index.html` (search `TODO`).
- Prices: `prices.html` (search `TODO`).
- Texts in both languages: `js/i18n.js`.
- Name / brand: `SWEET ARTS` in the header of each page and in `js/i18n.js`.
- Custom domain: put `owner/repo` into `js/config.js`.

## Search engines / social previews (SEO)
- Every page has title, description, canonical link, Open Graph + Twitter tags (link previews in Telegram / Discord / Facebook use `og-image.png`) and JSON-LD.
- `sitemap.xml` (pages + all pictures from `photos/`) and `robots.txt` are generated automatically by `build-seo.py`.
- The real site address is set automatically by the GitHub Action on the first push (from the `CNAME` file for your own domain, otherwise `https://<owner>.github.io/<repo>/`). To set it by hand: `python build-seo.py https://your-address/`
- The repository must be **public**. After the site is online add it to Google Search Console (https://search.google.com/search-console) and Bing Webmaster Tools and submit `<your address>/sitemap.xml` — this is what makes the site show up in search faster.
- When the prices page is ready: rename `prices1.html` to `prices.html`, delete the `noindex` line in it and add `'prices.html'` to `PAGES` in `build-seo.py`.
- Replace `og-image.png` with your own 1200x630 picture any time.
