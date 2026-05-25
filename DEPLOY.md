# Deploying to Cloudflare Workers (static assets)

This repo deploys as a Cloudflare **Worker with static assets** (not Pages),
via Git integration in the Cloudflare dashboard.

## How it works

[`wrangler.toml`](wrangler.toml) tells Cloudflare to serve `./build/` as a
static site:

```toml
name = "veriswap-web"
compatibility_date = "2025-01-01"

[assets]
directory = "./build"
not_found_handling = "single-page-application"
```

`not_found_handling = "single-page-application"` is the SPA fallback —
any 404 returns `index.html` with a 200 so deep links like `/#/swap/0x…`
work on refresh. (Replaces the Pages `_redirects` file.)

## Dashboard build config

- **Build command**: `npm run build`
- **Deploy command**: `npx wrangler deploy` (Cloudflare's default for
  Workers — leave it as-is)
- **Root directory**: blank
- **Env**: `NODE_VERSION=20`

Every push to `main` triggers a production deploy. PRs get preview
deployments.

## Custom domain

Add `veriswap.io` (and `www.`) under **Workers → veriswap-web → Settings
→ Domains & Routes**.

## Manual deploy (optional)

```bash
npm install -g wrangler
wrangler login
npm run build
wrangler deploy
```

## Adding security headers later

Workers static assets don't read a `_headers` file. If you need custom
headers (CSP, X-Frame-Options, long-cache for `/assets/*`), add a
minimal Worker fetch handler that wraps `env.ASSETS.fetch()` and
mutates the response headers.
