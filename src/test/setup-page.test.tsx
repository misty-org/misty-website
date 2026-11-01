import { act, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import Setup from "@/pages/Setup";
import {
  mistySetupUrl,
  parseServerHost,
  parseSetupFragment,
} from "@/pages/Setup/setupLink";

const key = "misty_setup_ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

describe("setup link", () => {
  it("reads the server and key from the fragment", () => {
    expect(parseSetupFragment(`#server=api.mistysys.com&key=${key}`)).toEqual({
      server: "api.mistysys.com",
      key,
    });
    expect(parseSetupFragment(`#key=${key}&server=Misty.Example.com:8443`)).toEqual({
      server: "misty.example.com:8443",
      key,
    });
  });

  it("refuses a missing or malformed server or key", () => {
    expect(parseSetupFragment("")).toBeNull();
    expect(parseSetupFragment(`#key=${key}`)).toBeNull();
    expect(parseSetupFragment("#server=api.mistysys.com")).toBeNull();
    expect(parseSetupFragment("#server=api.mistysys.com&key=misty_setup_short")).toBeNull();
    expect(parseSetupFragment(`#server=evil.example/path&key=${key}`)).toBeNull();
    expect(parseSetupFragment(`#server=javascript:alert(1)&key=${key}`)).toBeNull();
  });

  it("accepts an https address as the server and keeps only its host", () => {
    expect(parseServerHost("https://api.mistysys.com")).toBe("api.mistysys.com");
    expect(parseServerHost("https://api.mistysys.com/v1")).toBeNull();
    expect(parseServerHost("https://user:pass@api.mistysys.com")).toBeNull();
  });

  it("builds the app's deep link", () => {
    expect(mistySetupUrl({ server: "api.mistysys.com", key })).toBe(
      `misty://setup?server=api.mistysys.com&key=${key}`,
    );
  });
});

function renderAt(entry: string) {
  const router = createMemoryRouter([{ path: "/setup", element: <Setup /> }], {
    initialEntries: [entry],
  });
  render(<RouterProvider router={router} />);
  return router;
}

describe("setup page", () => {
  afterEach(() => vi.restoreAllMocks());

  it("offers Open in Misty and the values to copy, then clears the fragment", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    const log = vi.spyOn(console, "log");
    const router = renderAt(`/setup#server=api.mistysys.com&key=${key}`);

    expect(screen.getByRole("link", { name: "Open in Misty" })).toHaveAttribute(
      "href",
      `misty://setup?server=api.mistysys.com&key=${key}`,
    );
    expect(screen.getByText(key)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy setup key" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy server address" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Download Misty" })).toHaveAttribute(
      "href",
      "/download",
    );
    expect(router.state.location.hash).toBe("");
    expect(fetch).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
  });

  it("says plainly when the link is empty", () => {
    renderAt("/setup");
    expect(screen.getByText("There's no setup link here.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Open in Misty" })).toBeNull();
  });

  it("says plainly when the link is invalid", () => {
    const router = renderAt("/setup#server=api.mistysys.com&key=misty_setup_cut");
    expect(screen.getByText(/This setup link isn't complete/)).toBeInTheDocument();
    expect(screen.queryByText(/misty_setup_cut/)).toBeNull();
    expect(router.state.location.hash).toBe("");
  });
});

describe("a second setup link in the same tab", () => {
  it("replaces what the page shows", async () => {
    const other = "misty_setup_234567ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const router = renderAt(`/setup#server=api.mistysys.com&key=${key}`);
    await act(() => router.navigate(`/setup#server=misty.example.com&key=${other}`));
    expect(screen.getByText(other)).toBeInTheDocument();
    expect(screen.queryByText(key)).toBeNull();
    expect(router.state.location.hash).toBe("");
    await act(() => router.navigate("/setup#key=misty_setup_cut"));
    expect(screen.getByText(/This setup link isn't complete/)).toBeInTheDocument();
  });
});
