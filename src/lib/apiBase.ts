const MISTY_API_BASE = "https://api.mistysys.com/v1";

export function resolveApiBase(
  rawApiBase = import.meta.env.MISTY_PUBLIC_API_URL,
) {
  const configuredApiBase = rawApiBase?.trim().replace(/\/+$/, "");
  return configuredApiBase || MISTY_API_BASE;
}

export const apiBase = resolveApiBase();
