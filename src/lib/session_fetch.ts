import { apiBase } from "./api_base";

let refreshing: Promise<boolean> | undefined;
let refreshedAt = 0;

async function refreshSession(started: number): Promise<boolean> {
  if (refreshing) return refreshing;
  const run = async () => {
    if (refreshedAt > started) return true;
    const response = await fetch(`${apiBase}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "X-Misty-CSRF": "1" },
    });
    if (response.status === 401 || response.status === 403) return false;
    if (!response.ok)
      throw new Error("Session refresh is temporarily unavailable.");
    refreshedAt = Date.now();
    return true;
  };
  refreshing = (async () =>
    await (typeof navigator !== "undefined" && navigator.locks
      ? navigator.locks.request(`misty-refresh:${apiBase}`, run)
      : run()))().finally(() => {
    refreshing = undefined;
  });
  return refreshing;
}

export async function sessionFetch(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("X-Misty-CSRF", "1");
  const options = { ...init, credentials: "include" as const, headers };
  const started = Date.now();
  const response = await fetch(url, options);
  if (
    response.status !== 401 ||
    ["/login", "/register", "/logout", "/auth/refresh"].some(
      (path) => url === `${apiBase}${path}`,
    )
  )
    return response;
  if (!(await refreshSession(started))) return response;
  return fetch(url, options);
}
