# Misty website

The public website contains Misty's marketing pages, authentication flows,
account settings, pricing, and Stripe Checkout handoff.

## Development

From the repository root:

```sh
npm install
npm run dev
npm test
npm run build
```

## Store catalog

The public `/store` catalog is generated from the canonical manifests in
`misty-store/catalog`. Its product-neutral TypeScript contract, artwork,
verification treatment, filtering, slugs, and platform labels are synchronized
from `misty-store/interface`; the website does not maintain a second
hand-written Store interface. `npm run dev` and `npm run build` refresh the
generated sources automatically. To refresh or verify them directly:

```sh
npm run sync:store
npm run check:store
```

When the repositories are not adjacent, set `MISTY_STORE_DIR` to a local
`misty-store` checkout. Otherwise the sync script reads the published
catalog from GitHub.

Updates merged to the published catalog repository's `main` branch dispatch the website sync workflow.
That workflow validates and commits the refreshed generated catalog and shared
interface, causing the usual website deployment to rebuild from the new source.

The ignored `.env` is the real local configuration. Browser API requests use
the `/v1` path locally; the Vite development server can proxy that path to a
local server through `VITE_API_PROXY_TARGET`. Keep this file limited to public
browser configuration because every `VITE_*` value is bundled into the site.

## Cloudflare Workers

The Worker is declared in `wrangler.jsonc` as `misty-website`. It serves the
`dist/` build as static assets and falls back to `index.html` for SPA routes.
Configure Cloudflare Workers Builds with:

- Production branch: your default branch.
- Root directory: the repository root.
- Build command: `npm run build`.
- Deploy command: `npx wrangler deploy`.
- Build environment variable: `VITE_API_BASE=https://api.mistysys.com/v1`.
- Custom domain: `mistysys.com`.
