import { beforeEach, expect, it, vi } from "vitest";
vi.mock("../lib/api_base", () => ({ apiBase: "/api" }));

beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

it("refreshes an expired account cookie and retries the request", async () => {
  const fetch = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(new Response(null, { status: 401 }))
    .mockResolvedValueOnce(new Response(null, { status: 204 }))
    .mockResolvedValueOnce(new Response("{}", { status: 200 }));
  const { sessionFetch } = await import("../lib/session_fetch");
  expect((await sessionFetch("/api/me")).status).toBe(200);
  expect(fetch.mock.calls.map(([url]) => url)).toEqual([
    "/api/me",
    "/api/auth/refresh",
    "/api/me",
  ]);
  expect(new Headers(fetch.mock.calls[1][1]?.headers).get("X-Misty-CSRF")).toBe(
    "1",
  );
});

it("never attempts refresh for a rejected password", async () => {
  const fetch = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(null, { status: 401 }));
  const { sessionFetch } = await import("../lib/session_fetch");
  expect((await sessionFetch("/api/login", { method: "POST" })).status).toBe(
    401,
  );
  expect(fetch).toHaveBeenCalledOnce();
});
