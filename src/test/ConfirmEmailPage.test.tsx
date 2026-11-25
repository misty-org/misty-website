import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
    vi.unstubAllGlobals();
  });

  function confirmWith(password: string) {
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
    fireEvent.click(screen.getByRole("button", { name: "Confirm email" }));
  }

  function answer(status: number, body: object) {
    return vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify(body), {
          status,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
  }

  it("asks for the sign-up password and sends nothing until it is given", () => {
    const fetch = answer(200, { user_id: "1" });
    vi.stubGlobal("fetch", fetch);
    renderAt(`/confirm-email#server=${CLOUD_HOST}&token=abc`);

    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm email" })).toBeDisabled();
    expect(fetch).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
  });

  it("confirms with the password and signs in on this site's own server", async () => {
    const fetch = answer(200, { user_id: "1" });
    vi.stubGlobal("fetch", fetch);
    const router = renderAt(`/confirm-email#server=${CLOUD_HOST}&token=abc`);

    confirmWith("the password");

    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
    expect(submit).not.toHaveBeenCalled();
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/auth\/confirm-email\/sign-in$/);
    expect(init.body).toBe(JSON.stringify({ token: "abc", password: "the password" }));
  });

  it("says a wrong password under the field and lets the person try again", async () => {
    vi.stubGlobal("fetch", answer(403, { code: "wrong_password" }));
    renderAt(`/confirm-email#server=${CLOUD_HOST}&token=abc`);

    confirmWith("not it");

    expect(await screen.findByText(/isn't the password you chose/)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("says what the server refused on this site's own server", async () => {
    vi.stubGlobal("fetch", answer(400, { code: "expired" }));
    renderAt(`/confirm-email#server=${CLOUD_HOST}&token=abc`);

    confirmWith("the password");

    expect(await screen.findByRole("status")).toHaveTextContent("This link has expired");
  });

  it("posts the token and password to the server in the link, then clears the fragment", async () => {
    const router = renderAt("/confirm-email#server=api.mistysys.com&token=abc");

    const form = document.querySelector("form")!;
    expect(form).toHaveAttribute("action", "https://api.mistysys.com/v1/auth/confirm-email");
    expect(form).toHaveAttribute("method", "post");
    expect(form.querySelector('input[name="token"]')).toHaveValue("abc");
    await waitFor(() => expect(router.state.location.hash).toBe(""));
    expect(submit).not.toHaveBeenCalled();

    confirmWith("the password");

    expect(form.querySelector('input[name="password"]')).toHaveValue("the password");
    expect(submit).toHaveBeenCalledTimes(1);
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
