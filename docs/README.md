# Misty Docs

Documentation for the Misty CLI, extension platform, and server contract.

## Development

From the repository root:

```sh
npm install
npm run dev:docs
```

The local site runs at `http://127.0.0.1:5175`. Production builds use
`https://docs.mistysys.com` for canonical metadata; development builds use
`https://dev-docs.mistysys.com`.

## Validate

```sh
npm run build:docs
```

Deploy the docs Worker independently with `npm run deploy:docs`. The website
and documentation share the root dependencies, theme, navigation, footer, and
public assets while retaining separate Vite and Wrangler entry points.

## Content sources

- CLI pages follow `misty-cli/src/cli.rs` and its command implementations.
- Extension pages follow the manifests, catalog, and typed host bridge in
  `misty-store`.
- Server pages follow the public route mounts, instance descriptor, and
  self-host feature gate in `misty-server`.

When a source contract changes, update the corresponding page in
`docs/src/content.ts` in the same change.
