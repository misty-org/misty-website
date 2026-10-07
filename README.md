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

The website starts at `http://127.0.0.1:5176`. If that port is occupied, Vite
tries the next available port; use the URL printed in the terminal.

The ignored `.env` is the real local configuration. Browser API requests use
the `/v1` path locally; the Vite development server can proxy that path to a
local server through `VITE_API_PROXY_TARGET`. Keep this file limited to public
browser configuration because `MISTY_PUBLIC_API_URL` is bundled into the site.

## Checks

There is no GitHub CI. Git hooks run the checks locally: every commit scans
the staged changes for secrets and, when site code changes, runs the type-check,
lint and unit tests; every push requires a clean tree, scans the new commits,
and also builds the production bundle. Turn them on once per clone with
`git config core.hooksPath .githooks`; run them by hand with
`.githooks/checks.sh web|build|secrets|all`; skip once with `--no-verify`.

## Cloudflare Workers

The Worker is declared in `wrangler.jsonc` as `misty-website`. It serves the
`dist/` build as static assets and falls back to `index.html` for SPA routes.
Configure Cloudflare Workers Builds with:

- Production branch: your default branch.
- Root directory: the repository root.
- Build command: `npm run build`.
- Deploy command: `npx wrangler deploy`.
- Build environment variable: `MISTY_PUBLIC_API_URL=https://api.mistysys.com/v1`.
- Custom domain: `mistysys.com`.
