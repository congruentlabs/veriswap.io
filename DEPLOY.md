# Deploying to Cloudflare Pages

This repo deploys as a Cloudflare **Pages** project named `veriswap-web`
via Git integration.

## How it works

- [`wrangler.toml`](wrangler.toml) declares `pages_build_output_dir = "./build"`
  so wrangler knows where the static output lives.
- [`public/_redirects`](public/_redirects) provides the SPA fallback —
  any unmatched route returns `index.html` so deep links like
  `/#/swap/0x…` work on refresh.
- [`public/_headers`](public/_headers) sets long-cache for hashed assets
  and sensible security headers.

## Dashboard config

- **Framework preset**: None (or Vite — both work)
- **Build command**: `npm run build`
- **Build output directory**: `build`
- **Deploy command**: `npx wrangler pages deploy` *(only needed if the
  dashboard auto-set it; Pages can deploy without an explicit command
  too)*
- **Env**: `NODE_VERSION=20`

Every push to `main` triggers a production build; PRs get preview
deployments at unique `*.veriswap-web.pages.dev` URLs.

## Custom domain

Project → **Custom domains** → add `veriswap.io` and `www.veriswap.io`.
Cloudflare handles DNS automatically when the domain is on Cloudflare.

## Manual deploy (optional)

```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy build --project-name=veriswap-web
```
