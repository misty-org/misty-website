/**
 * The setup link a server emails: `https://mistysys.com/setup#server=<host>&key=<key>`.
 * Both values ride in the fragment, which browsers never send, so this page reads them
 * in the browser and nothing else ever sees them.
 */
export interface SetupLink {
  /** The server's `MISTY_HOSTNAME`, such as `api.mistysys.com`. */
  server: string;
  key: string;
}

/** `misty_setup_` and 32 base32 characters, as the server makes them. */
const setupKeyPattern = /^misty_setup_[a-z2-7]{32}$/i;

/** A hostname or IPv4 address with an optional port, or a bracketed IPv6 address. */
const hostPattern =
  /^(?:(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?))*|\[[0-9a-f:.]+\])(?::\d{1,5})?$/i;

/** The server's host, from a bare host or an http(s) address. Null when it isn't one. */
export function parseServerHost(value: string): string | null {
  const text = value.trim();
  if (!text) return null;
  if (/^https?:\/\//i.test(text)) {
    try {
      const url = new URL(text);
      if (url.username || url.password || url.search || url.hash) return null;
      if (url.pathname !== "/" && url.pathname !== "") return null;
      return url.host.toLowerCase();
    } catch {
      return null;
    }
  }
  return hostPattern.test(text) && text.length <= 260 ? text.toLowerCase() : null;
}

/** The server and key in a setup link's fragment, or null when either is missing or wrong. */
export function parseSetupFragment(hash: string): SetupLink | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const server = parseServerHost(params.get("server") ?? "");
  const key = (params.get("key") ?? "").trim();
  if (!server || !setupKeyPattern.test(key)) return null;
  return { server, key };
}

/** The deep link the app handles: it opens the setup wizard filled in. */
export function mistySetupUrl({ server, key }: SetupLink): string {
  const query = new URLSearchParams({ server, key });
  return `misty://setup?${query.toString()}`;
}
