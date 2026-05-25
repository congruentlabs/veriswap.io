# Deploying to Cloudflare Pages

This repo is set up for automatic deployment via Cloudflare Pages with Git
integration. Push to the configured branch and Cloudflare rebuilds.

## One-time setup

1. Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com).
2. **Workers & Pages → Create → Pages → Connect to Git**.
3. Authorize the GitHub app on your account/org if you haven't already, then
   pick the `veriswap.io` repo.
4. On the build configuration screen, use:
   - **Project name**: `veriswap` (or whatever you like — becomes
     `veriswap.pages.dev`)
   - **Production branch**: `main`
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `build`
   - **Root directory**: leave blank
5. **Environment variables → Production** (and Preview if you want):
   - `NODE_VERSION` = `20`
6. Save and deploy.

That's it. Every push to `main` triggers a production build; every PR gets a
preview deployment at a unique `*.veriswap.pages.dev` URL.

## Custom domain

In the project's **Custom domains** tab, add `veriswap.io` (and `www.` if you
want). Cloudflare handles DNS automatically if the domain is on Cloudflare;
otherwise it'll give you a CNAME to set.

## Files in this repo that Cloudflare uses

- `wrangler.toml` — tells Wrangler the output dir if you ever deploy from CLI.
- `public/_redirects` — SPA fallback so deep links like `/#/swap/0x…` work
  on refresh.
- `public/_headers` — long-cache for hashed assets, sane security headers.
- `.nvmrc` — Node version hint (Cloudflare reads `NODE_VERSION` env first).

## Manual deploy (optional)

```bash
npm install -g wrangler
npm run build
wrangler pages deploy build --project-name=veriswap
```
