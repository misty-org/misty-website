export interface SetupLink {
  server: string;
  key: string;
}

const setupKeyPattern = /^misty_setup_[a-z2-7]{32}$/i;

const hostPattern =
  /^(?:(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?))*|\[[0-9a-f:.]+\])(?::\d{1,5})?$/i;

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

export function parseSetupFragment(hash: string): SetupLink | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const server = parseServerHost(params.get("server") ?? "");
  const key = (params.get("key") ?? "").trim();
  if (!server || !setupKeyPattern.test(key)) return null;
  return { server, key };
}

export function mistySetupUrl({ server, key }: SetupLink): string {
  const query = new URLSearchParams({ server, key });
  return `misty://setup?${query.toString()}`;
}
