# Reading online (GitHub Pages)

The repo includes a [Docsify](https://docsify.js.org/) shell (`index.html`) that renders the markdown chapters in your browser — sidebar, search, prev/next.

**Live URL:**  
[https://theanimatedmonk.github.io/how-the-internet-works/](https://theanimatedmonk.github.io/how-the-internet-works/)

## One-time setup (about 30 seconds)

GitHub does not turn Pages on automatically. Do this once:

1. Open **[Settings → Pages](https://github.com/theanimatedmonk/how-the-internet-works/settings/pages)** for the repo.
2. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
3. **Branch:** `main` · **Folder:** `/ (root)` · Save.
4. Wait 1–2 minutes. Refresh the live URL above.

You should see a green deployment note on the Pages settings screen when it’s ready.

## What gets published

Everything at the repo root: `index.html`, `_sidebar.md`, `assets/`, and all `*.md` chapter files. `.nojekyll` tells GitHub not to run Jekyll so Docsify can load raw markdown.

## Local preview

```bash
cd "/Users/sajal.k/Documents/Code files/how-internet-works"
npx serve .
```

Open `http://localhost:3000` — Docsify detects localhost and uses `/` as the base path. On GitHub Pages it uses `/how-the-internet-works/`.

## Read aloud

**Listen** panel (bottom-right): voice picker, read / pause / stop, speed. Uses your browser’s speech voices (★ = recommended).

## Optional: GitHub Actions deploy

If you prefer **Source: GitHub Actions** later, add a Pages workflow and re-run deploy from the Actions tab. Branch deploy above is enough for this site.
