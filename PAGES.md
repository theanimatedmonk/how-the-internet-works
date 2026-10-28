# Reading online (GitHub Pages)

The repo includes a small [Docsify](https://docsify.js.org/) shell (`index.html`) that renders the same markdown files in your browser.

**Live URL (after Pages is enabled):**  
[https://theanimatedmonk.github.io/how-the-internet-works/](https://theanimatedmonk.github.io/how-the-internet-works/)

## One-time setup

If the site 404s, turn on Pages:

1. Open [repo Settings → Pages](https://github.com/theanimatedmonk/how-the-internet-works/settings/pages).
2. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
3. Re-run the [Deploy to GitHub Pages](https://github.com/theanimatedmonk/how-the-internet-works/actions/workflows/pages.yml) workflow if needed, or push any commit to `main`.

The workflow uploads the repo root (markdown + `index.html`) on every push to `main`.

## Local preview

```bash
npx serve .
# open http://localhost:3000
```

On localhost, Docsify uses `/` as the base path; on GitHub Pages it uses `/how-the-internet-works/`.
