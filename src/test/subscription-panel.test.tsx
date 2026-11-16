import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it, vi } from "vitest";

import { SubscriptionPanel } from "@/pages/AccountSettings/panels/SubscriptionPanel";

const active = {
  subscribed: true,
  plan: "plus",
  interval: "month",
  status: "active",
  current_period_end: "2026-12-03T12:00:00Z",
  cancel_at_period_end: false,
};

const onClose = vi.fn();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

/** Answers the proof itself; each billing call takes the next answer. */
function stubBilling(...answers: Response[]) {
  const calls: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/me/account-proof")) return Promise.resolve(json({ proof: "proof" }));
      calls.push(url);
      return Promise.resolve(answers.shift() ?? json({}, 500));
    }),
  );
  render(
    <MemoryRouter>
      <SubscriptionPanel onClose={onClose} />
    </MemoryRouter>,
  );
  return calls;
}

afterEach(() => {
  cleanup();
  onClose.mockClear();
  vi.unstubAllGlobals();
});

it("shows Free to someone without a subscription, with plans to choose and nothing to cancel", async () => {
  stubBilling(json({ subscribed: false, plan: "free", cancel_at_period_end: false }));
  const link = await screen.findByRole("link", { name: "See plans" });
  expect(link).toHaveAttribute("href", "/pricing");
  expect(screen.getByText("Free")).toBeInTheDocument();
  expect(screen.getByText("5 GB of storage")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();

  fireEvent.click(link);
  expect(onClose).toHaveBeenCalledOnce();
});

it("cancels only after confirming, then offers to keep it", async () => {
  const calls = stubBilling(json(active), json({ ...active, cancel_at_period_end: true }), json(active));
  expect(await screen.findByText("Renews on")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  const dialog = await screen.findByRole("alertdialog");
  expect(calls).toHaveLength(1);
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel subscription" }));

  expect(await screen.findByText("Ends on")).toBeInTheDocument();
  expect(calls[1]).toMatch(/\/account\/subscription\/cancel$/);

  fireEvent.click(screen.getByRole("button", { name: "Keep subscription" }));
  expect(await screen.findByText("Renews on")).toBeInTheDocument();
  expect(calls[2]).toMatch(/\/account\/subscription\/resume$/);
});

it("says so when a change fails and keeps the current state", async () => {
  stubBilling(json(active), json({}, 503));
  fireEvent.click(await screen.findByRole("button", { name: "Cancel" }));
  fireEvent.click(
    within(await screen.findByRole("alertdialog")).getByRole("button", { name: "Cancel subscription" }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent("didn't work");
  expect(screen.getByText("Renews on")).toBeInTheDocument();
});

it("offers a retry when billing can't be reached", async () => {
  stubBilling(json({}, 503), json(active));
  fireEvent.click(await screen.findByRole("button", { name: /try again|retry/i }));
  expect(await screen.findByText("Renews on")).toBeInTheDocument();
});

it("switches Misty+ to yearly after confirming, posting the plan", async () => {
  const bodies: string[] = [];
  const calls: string[] = [];
  const answers = [json(active), json({ ...active, interval: "year" })];
  vi.stubGlobal(
    "fetch",
    vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith("/me/account-proof")) return Promise.resolve(json({ proof: "proof" }));
      calls.push(url);
      bodies.push(String(init?.body ?? ""));
      return Promise.resolve(answers.shift() ?? json({}, 500));
    }),
  );
  render(
    <MemoryRouter>
      <SubscriptionPanel onClose={onClose} />
    </MemoryRouter>,
  );
  expect(await screen.findByText("Misty+")).toBeInTheDocument();
  expect(screen.getByText("$8 a month")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Switch to yearly" }));
  const dialog = await screen.findByRole("alertdialog");
  expect(calls).toHaveLength(1);
  fireEvent.click(within(dialog).getByRole("button", { name: "Switch to yearly" }));
  expect(await screen.findByText("$72 a year")).toBeInTheDocument();
  expect(calls[1]).toMatch(/\/account\/subscription\/plan$/);
  expect(new URLSearchParams(bodies[1]).get("plan")).toBe("plus_yearly");
  expect(screen.getByRole("button", { name: "Switch to monthly" })).toBeInTheDocument();
});

it("keeps the plan and says why when the card declines a switch", async () => {
  stubBilling(json(active), json({ code: "payment_needed" }, 402));
  fireEvent.click(await screen.findByRole("button", { name: "Switch to yearly" }));
  fireEvent.click(within(await screen.findByRole("alertdialog")).getByRole("button", { name: "Switch to yearly" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("card didn't go through");
  expect(screen.getByText("$8 a month")).toBeInTheDocument();
});

it("says a cancelled Misty+ goes back to Free and takes its Boosts back, not deleted", async () => {
  stubBilling(json(active));
  fireEvent.click(await screen.findByRole("button", { name: "Cancel" }));
  const dialog = await screen.findByRole("alertdialog");
  expect(dialog).toHaveTextContent("moves to Free");
  expect(dialog).toHaveTextContent("included Boosts leave their spaces");
  expect(dialog).toHaveTextContent("Nothing is deleted");
});
