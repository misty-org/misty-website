export const SITE_URL = "https://mistysys.com";

export const DOCS_URL = "https://docs.mistysys.com";
export const REPO_URL = "https://github.com/misty-org/misty";
export const RELEASES_URL = `${REPO_URL}/releases`;
export const DISCORD_URL = "https://discord.gg/B5WgSw6uX";

export const CLOUD_HOST = import.meta.env.DEV ? "dev-api.mistysys.com" : "api.mistysys.com";

export const BILLING_URL = import.meta.env.DEV ? "http://127.0.0.1:8091" : "https://billing.mistysys.com";

export const CLOUD_CHECKOUT_URL = `${BILLING_URL}/checkout`;

export const ACCOUNT_SUBSCRIPTION_URL = `${BILLING_URL}/account/subscription`;

export const ACCOUNT_BOOSTS_URL = `${BILLING_URL}/account/boosts`;

export const BOOSTS_SETTINGS_PATH = "/settings/boosts";

export const ACCOUNT_PORTAL_URL = `${BILLING_URL}/account/portal`;

export const SUBSCRIPTION_SETTINGS_PATH = "/settings/subscription";

export const SUPPORT_EMAIL = "support@mistysys.com";

const DOCS_PREFIX = "/docs";

function currentHostname(): string {
  return typeof window === "undefined" ? "" : window.location.hostname;
}

export function isDocsHost(hostname = currentHostname()): boolean {
  return hostname.startsWith("docs.");
}

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

export function siteLink(
  to: string,
  location?: Pick<Location, "protocol" | "hostname" | "port">,
): { path: string } | { href: string } {
  const docs = isDocsPath(to);
  const path = docs ? to.slice(DOCS_PREFIX.length).replace(/^(?!\/)/, "/") : to;
  if (docs === isDocsHost(location?.hostname ?? currentHostname())) return { path };
  return { href: hostOrigin(docs, location) + path };
}

export function docsPagePath(pathname: string, hostname = currentHostname()): string {
  if (!isDocsHost(hostname)) return pathname;
  return pathname === "/" ? DOCS_PREFIX : DOCS_PREFIX + pathname;
}
