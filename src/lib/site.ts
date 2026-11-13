export const SITE_URL = "https://mistysys.com";

/**
 * The docs live on their own host, served by the same Worker and build. Links anywhere in
 * the site name them `/docs/...`; `siteLink` turns that into the right place on either host.
 */
export const DOCS_URL = "https://docs.mistysys.com";
export const REPO_URL = "https://github.com/misty-org/misty";
export const RELEASES_URL = `${REPO_URL}/releases`;

/** Misty Pro's server, its `MISTY_HOSTNAME`; in development, the dev server. */
export const CLOUD_HOST = import.meta.env.DEV ? "dev-api.mistysys.com" : "api.mistysys.com";

/** misty-cloud, which answers checkout with a redirect to Stripe Checkout; in development, the one on this computer. */
export const BILLING_URL = import.meta.env.DEV ? "http://127.0.0.1:8091" : "https://billing.mistysys.com";

/** Where a signed-in person's checkout is posted, with the server's proof of their account. */
export const CLOUD_CHECKOUT_URL = `${BILLING_URL}/checkout`;

/** Reads a signed-in person's subscription; `/cancel` and `/resume` change it. Each takes their proof. */
export const ACCOUNT_SUBSCRIPTION_URL = `${BILLING_URL}/account/subscription`;

/** Answers a signed-in person's proof with a Stripe page for their card and invoices, already signed in. */
export const ACCOUNT_PORTAL_URL = `${BILLING_URL}/account/portal`;

/** Where subscribers manage and cancel their plan. */
export const SUBSCRIPTION_SETTINGS_PATH = "/settings/subscription";

/** The one support address, for help, privacy requests and takedowns. */
export const SUPPORT_EMAIL = "support@mistysys.com";

const DOCS_PREFIX = "/docs";

function currentHostname(): string {
  return typeof window === "undefined" ? "" : window.location.hostname;
}

/** Whether this page is on the docs host. In development that is `docs.localhost`. */
export function isDocsHost(hostname = currentHostname()): boolean {
  return hostname.startsWith("docs.");
}

/** The docs (or the main site's) origin; in development, `docs.localhost` beside `localhost`. */
function hostOrigin(docs: boolean, location?: Pick<Location, "protocol" | "hostname" | "port">) {
  const local = location ?? (typeof window === "undefined" ? undefined : window.location);
  if (local && (local.hostname === "localhost" || local.hostname.endsWith(".localhost"))) {
    const port = local.port ? `:${local.port}` : "";
    return `${local.protocol}//${docs ? "docs." : ""}localhost${port}`;
  }
  return docs ? DOCS_URL : SITE_URL;
}

export function isDocsPath(to: string): boolean {
  return to === DOCS_PREFIX || /^\/docs[/#?]/.test(to);
}

/**
 * Where an in-site link goes from this page: a router path when it stays on this host, or
 * a full address on the other one. `/docs/models` is `/models` on the docs host.
 */
export function siteLink(
  to: string,
  location?: Pick<Location, "protocol" | "hostname" | "port">,
): { path: string } | { href: string } {
  const docs = isDocsPath(to);
  const path = docs ? to.slice(DOCS_PREFIX.length).replace(/^(?!\/)/, "/") : to;
  if (docs === isDocsHost(location?.hostname ?? currentHostname())) return { path };
  return { href: hostOrigin(docs, location) + path };
}

/** The docs page a docs-host path shows, named as links name it: `/models` is `/docs/models`. */
export function docsPagePath(pathname: string, hostname = currentHostname()): string {
  if (!isDocsHost(hostname)) return pathname;
  return pathname === "/" ? DOCS_PREFIX : DOCS_PREFIX + pathname;
}
