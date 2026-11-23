import { render, screen, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";

import { CLOUD_HOST } from "@/lib/site";
import ConfirmEmail from "@/pages/ConfirmEmail";

function renderAt(entry: string) {
  const router = createMemoryRouter(
    [
      { path: "/", element: <p>Home</p> },
      { path: "/confirm-email", element: <ConfirmEmail /> },
    ],
    { initialEntries: [entry] },
  );
  render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
  return router;
}

describe("confirm email page", () => {
  let submit: MockInstance<HTMLFormElement["submit"]>;

  beforeEach(() => {
    submit = vi.spyOn(HTMLFormElement.prototype, "submit").mockImplementation(() => {});
  });

  afterEach(() => {
    delete (navigator as { webdriver?: boolean }).webdriver;
    vi.unstubAllGlobals();
  });

  it("confirms and signs in on this site's own server, with no form post", async () => {
    const fetch = vi.fn(() => Promise.resolve(new Response(JSON.stringify({ user_id: "1" }), {
      headers: { "Content-Type": "application/json" },
    })));
    vi.stubGlobal("fetch", fetch);

    const router = renderAt(`/confirm-email#server=${CLOUD_HOST}&token=abc`);

    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
    expect(submit).not.toHaveBeenCalled();
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/auth\/confirm-email\/sign-in$/);
    expect(init.body).toBe(JSON.stringify({ token: "abc" }));
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("says what the server refused on this site's own server", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ code: "expired" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ),
    );

    renderAt(`/confirm-email#server=${CLOUD_HOST}&token=abc`);

    expect(await screen.findByRole("status")).toHaveTextContent("This link has expired");
  });

  it("posts the token to the server in the link once, then clears the fragment", async () => {
    const router = renderAt("/confirm-email#server=api.mistysys.com&token=abc");

    const form = document.querySelector("form")!;
    expect(form).toHaveAttribute("action", "https://api.mistysys.com/v1/auth/confirm-email");
    expect(form).toHaveAttribute("method", "post");
    expect(form.querySelector('input[name="token"]')).toHaveValue("abc");
    expect(submit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: "Confirm email" })).not.toBeInTheDocument();
    await waitFor(() => expect(router.state.location.hash).toBe(""));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("asks an automated browser to press a button", () => {
    Object.defineProperty(navigator, "webdriver", { value: true, configurable: true });
    renderAt("/confirm-email#server=api.mistysys.com&token=abc");

    expect(screen.getByRole("button", { name: "Confirm email" })).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
  });

  it("uses plain http only for a server on this computer", () => {
    renderAt("/confirm-email#server=127.0.0.1:8081&token=abc");
    expect(document.querySelector("form")).toHaveAttribute(
      "action",
      "http://127.0.0.1:8081/v1/auth/confirm-email",
    );
  });

  it("shows what the server said, without posting again", () => {
    renderAt("/confirm-email?result=confirmed");
    expect(screen.getByRole("status")).toHaveTextContent("Your email is confirmed.");
    expect(submit).not.toHaveBeenCalled();
  });

  it("says when the link is incomplete", () => {
    renderAt("/confirm-email#server=api.mistysys.com");
    expect(screen.getByText(/This link isn't complete/)).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
  });
});
