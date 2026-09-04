const SAME_ORIGIN_API_BASE = "/api";

export function resolveApiBase(
  rawApiBase = import.meta.env.MISTY_PUBLIC_API_URL,
) {
  const configuredApiBase = rawApiBase?.trim().replace(/\/+$/, "");
  return configuredApiBase || SAME_ORIGIN_API_BASE;
}

export const apiBase = resolveApiBase();
