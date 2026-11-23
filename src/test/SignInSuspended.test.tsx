import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import SignIn from "@/pages/SignIn";

const postProofForm = vi.hoisted(() => vi.fn());

vi.mock("@/AuthContext", () => ({
  useAuth: () => ({ refreshSession: vi.fn(), user: null, sessionReady: true }),
}));
vi.mock("@/lib/account_proof", async (original) => ({
  ...(await original<typeof import("@/lib/account_proof")>()),
  postProofForm,
}));

const message = "This account is suspended. Its data is kept; contact the server's operator.";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function signInAs(login: Response, subscription?: Response) {
  vi.stubGlobal(
    "fetch",
    vi.fn((input: RequestInfo | URL) =>
      Promise.resolve(String(input).includes("/account/subscription") ? subscription ?? json({}, 503) : login),
    ),
  );
  render(
    <MemoryRouter>
      <SignIn />
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@example.com" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "a long password" } });
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
}

const suspended = () => json({ code: "account_suspended", message, proof: "the-proof" }, 403);

beforeEach(() => postProofForm.mockClear());
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("offers the card page when a failed payment suspended the account", async () => {
  signInAs(suspended(), json({ subscribed: true, status: "past_due", cancel_at_period_end: false }));
  fireEvent.click(await screen.findByRole("button", { name: "Update card" }));
  expect(postProofForm).toHaveBeenCalledWith(expect.stringMatching(/\/account\/portal$/), "the-proof");
});

it("goes back to the form from the card page", async () => {
  signInAs(suspended(), json({ subscribed: true, status: "unpaid", cancel_at_period_end: false }));
  fireEvent.click(await screen.findByRole("button", { name: "Back to sign in" }));
  expect(await screen.findByRole("button", { name: "Sign in" })).toBeInTheDocument();
});

it("shows the usual message when something else suspended the account", async () => {
  signInAs(suspended(), json({ subscribed: false, cancel_at_period_end: false }));
  expect(await screen.findByText(message)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Update card" })).toBeNull();
});

it("shows the usual message when billing can't be reached", async () => {
  signInAs(suspended(), json({}, 503));
  expect(await screen.findByText(message)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Update card" })).toBeNull();
});

it("never asks billing about a wrong password", async () => {
  signInAs(json({ message: "Invalid email or password" }, 401));
  expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
  const calls = vi.mocked(fetch).mock.calls.map(([url]) => String(url));
  expect(calls.some((url) => url.includes("/account/"))).toBe(false);
});
