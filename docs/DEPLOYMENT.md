# Deployment

## Deployment Model

Bastione is a static website: HTML, CSS, and vanilla JavaScript ES modules.

There is no build step. The production server only needs to serve the project files over HTTPS.

## Repository

```text
https://github.com/DAAART-STUDIO/bastione
```

Branch: `main` is deployed as-is.

## Hosting — GitHub Pages

The site is hosted on GitHub Pages, served directly from the `main` branch.

1. Repository **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. **Branch:** `main`, folder **`/ (root)`** → **Save**.
4. GitHub Pages requires the repository to stay **public** on the Free plan — Pages is disabled the moment a repo goes private, unless upgraded to GitHub Pro/Team/Enterprise.
5. Live URL:

   ```text
   https://daaart-studio.github.io/bastione/
   ```

6. A fresh push to `main` triggers an automatic rebuild (usually live within 1–2 minutes).

### Custom domain (later)

When `bastione.eu` is ready to point here:

1. Add a `CNAME` file at the repo root containing `bastione.eu`.
2. At the DNS provider, add either an `A` record set to GitHub Pages' IPs or a `CNAME` record pointing to `daaart-studio.github.io`.
3. Repository **Settings → Pages → Custom domain** → enter `bastione.eu` → enable **Enforce HTTPS**.
4. Update `robots.txt` and `sitemap.xml` to the new domain, and `site.webmanifest`'s `start_url`/`scope` can stay relative (`./`).

## Project-subpath constraint

Because the site is served from `https://daaart-studio.github.io/bastione/` (a subpath, not a domain root), every asset reference must stay **relative** — no leading `/`. This already holds throughout `index.html`, `css/`, and `js/`. Keep it that way; a leading-slash path will 404 under the project subpath (though it would resolve once/if a custom domain at the root is attached).

## Privacy note

GitHub Pages output is plain static HTML/CSS/JS. Anyone visiting the live site can view it via "View Page Source" regardless of the repository's visibility — making the repo private only hides the Git history and source browsing on GitHub, not the deployed markup itself.
