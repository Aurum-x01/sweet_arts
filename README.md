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
