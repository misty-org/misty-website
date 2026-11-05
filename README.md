# Misty website

The public website contains Misty's marketing pages, the docs, the Misty Pro
pricing page and the legal pages. The sign-in, registration and account
settings pages are still in the code but no longer linked from the site.

Misty itself is free and open source under the GNU AGPL-3.0, at
https://github.com/misty-org/misty. Free means every feature, with the server
set up by whoever runs it; Misty Pro is a configured server for about $10 a
month. AI always runs on people's own models.

## Docs

The docs live at https://docs.mistysys.com (`src/pages/Docs/`) and replace the
GitHub wiki. It's the same build and Worker as the site, on a second custom
domain:

- On a host starting with `docs.` the router serves the docs at the root, under
  the site's own header and footer. In development, open `docs.localhost:5173`.
- Links everywhere still name docs pages `/docs/...`. `SiteLink`
  (`src/components/SiteLink.tsx`) turns them into `/...` on the docs host and
  into `https://docs.mistysys.com/...` on the site, and sends the site's own
  links from the docs back to `https://mistysys.com`.
- `mistysys.com/docs/*` answers a 301 to the docs host from the Worker
  (`worker/index.ts`), which only sees `/docs` requests (`run_worker_first`).
- `docs.mistysys.com` is a custom domain on the `misty-website` Worker, added
  in the Cloudflare dashboard (Workers & Pages → misty-website → Settings →
  Domains & Routes), which also makes its DNS record and certificate.

Each env file under the server's `server/.env/` has one data file in
`src/pages/Docs/integrations/`; its variable tables, steps and example are
plain data, so a renamed or added variable is a one-line change there.

## Setup links and checkout

- `/setup` is where every server's setup key email points:
  `https://mistysys.com/setup#server=<host>&key=<key>`. The page reads the
  fragment in the browser, keeps it only in memory, clears it from the address
  bar and offers `misty://setup?server=<host>&key=<key>`. The fragment never
  reaches the website, and nothing on the page sends or logs it.
- "Get Misty Pro" links to misty-billing at
  `https://billing.mistysys.com/checkout?plan=cloud` (`&storage=1` adds the
  storage add-on), which redirects to Stripe Checkout. Its success URL is
  `/cloud/welcome`.
- The hosts and links live in `src/lib/site.ts`. The Cloud server is
  `api.mistysys.com`.

## Placeholders before launch

- `CUSTOMER_PORTAL_URL` in `src/lib/site.ts`: Stripe's customer-portal login
  link.
- `src/pages/Pricing/plans.ts`: the plan numbers, which must match the Cloud
  server's account limits.

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
- Custom domain: `mistysys.com`.
