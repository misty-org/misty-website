# Misty website

The site at https://mistysys.com: the marketing pages, the docs, the Misty Pro
pricing page, sign-in and account settings, and the legal pages. It's a Vite +
React app served by a Cloudflare Worker.

Misty itself is free and open source under the GNU AGPL-3.0, at
https://github.com/misty-org/misty.

## Development

```sh
npm install
npm run dev        # http://127.0.0.1:5176
npm test           # unit tests (Vitest)
npm run test:e2e   # Playwright
npm run lint
npm run typecheck
npm run build
```

If port 5176 is taken, Vite picks the next free one and prints it.

Locally, browser API requests go to `/v1`, which the dev server proxies to
`http://127.0.0.1:8081` or to `VITE_API_PROXY_TARGET` if set. `MISTY_PUBLIC_API_URL`
sets the API address for a build. It is bundled into the site, so the git-ignored
`.env` should only hold public browser settings.

## Docs

The docs (`src/pages/Docs/`) are served at https://docs.mistysys.com from the
same build and Worker:

- On a host starting with `docs.` the router serves the docs at the root. In
  development, open `docs.localhost:5176`.
- Links name docs pages `/docs/...`. `siteLink` in `src/lib/site.ts` turns them
  into the right address on either host.
- The Worker (`worker/index.ts`) only sees `/docs` requests (`run_worker_first`
  in `wrangler.jsonc`) and answers them with a 301 to the docs host.

Each env file under `~/.misty/.env/server/` has a data file in
`src/pages/Docs/integrations/`, so a renamed or added variable is a one-line
change there.

## Setup links and checkout

- `/setup` is where a server's setup email points:
  `https://mistysys.com/setup#server=<host>&key=<key>`. The page reads the
  fragment in the browser, keeps it only in memory, clears it from the address
  bar and offers `misty://setup?server=<host>&key=<key>`. The fragment never
  reaches the website, and nothing on the page sends or logs it.
- "Get Misty Pro" posts the signed-in account's proof to
  `https://billing.mistysys.com/checkout`, which redirects to Stripe Checkout.
  Stripe returns to `/cloud/welcome`.
- Hosts and links live in `src/lib/site.ts`. The plan numbers in
  `src/pages/Pricing/plans.ts` must match the Cloud server's account limits.

## Checks

There is no GitHub CI. Git hooks run the checks locally: each commit scans the
staged changes for secrets and, when site code changes, runs the type-check,
lint and unit tests; each push needs a clean tree, scans the new commits and
builds the production bundle. The checks live in
[misty-cli](https://github.com/misty-org/misty-cli): turn the hooks on once with
`misty hook install`, run them by hand with `misty hook run web|build|secrets|all`,
and skip once with `--no-verify`.

## Deploying

`wrangler.jsonc` declares the `misty-website` Worker. It serves `dist/` as static
assets and falls back to `index.html` for app routes. `npm run deploy:website`
builds and deploys it. With Cloudflare Workers Builds, use `npm run build` as the
build command and `npx wrangler deploy` as the deploy command. `mistysys.com` and
`docs.mistysys.com` are both custom domains on the Worker.
