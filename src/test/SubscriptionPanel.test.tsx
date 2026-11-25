import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it, vi } from "vitest";

import { SubscriptionPanel } from "@/pages/AccountSettings/panels/SubscriptionPanel";

vi.mock("@misty/ui", async (original) => {
  const ui = await original<typeof import("@misty/ui")>();
  return {
    ...ui,
    OptionSelect: ({
      options,
      value,
      onValueChange,
      disabled,
      "aria-label": label,
    }: {
      options: readonly { value: string; label: string }[];
      value: string;
      onValueChange: (value: string) => void;
      disabled?: boolean;
      "aria-label"?: string;
    }) => (
      <div role="group" aria-label={label}>
        {options.map((option) => (
          <ui.Button
            key={option.value}
            aria-pressed={option.value === value}
            disabled={disabled}
            onClick={() => onValueChange(option.value)}
          >
            {option.label}
          </ui.Button>
        ))}
      </div>
    ),
  };
});

const active = {
  subscribed: true,
  plan: "pro",
  interval: "month",
  status: "active",
  current_period_end: "2026-12-03T12:00:00Z",
  cancel_at_period_end: false,
};

const onClose = vi.fn();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

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

it("moves Pro to Max yearly after confirming, posting the plan", async () => {
  const bodies: string[] = [];
  const calls: string[] = [];
  const answers = [json(active), json({ ...active, plan: "max", interval: "year" })];
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
  expect(await screen.findByText("Pro, monthly")).toBeInTheDocument();
  expect(screen.getByText("$10 a month")).toBeInTheDocument();
  expect(screen.getByText("250 GB of storage")).toBeInTheDocument();
  const choices = screen.getByRole("group", { name: "Change plan" });
  fireEvent.click(within(choices).getByRole("button", { name: "Max, $200 a year" }));
  const dialog = await screen.findByRole("alertdialog");
  expect(calls).toHaveLength(1);
  expect(dialog).toHaveTextContent("1 TB of storage");
  fireEvent.click(within(dialog).getByRole("button", { name: "Switch plan" }));
  expect(await screen.findByText("Max, yearly")).toBeInTheDocument();
  expect(screen.getByText("$200 a year")).toBeInTheDocument();
  expect(calls[1]).toMatch(/\/account\/subscription\/plan$/);
  expect(new URLSearchParams(bodies[1]).get("plan")).toBe("max_yearly");
});

it("does nothing when the current plan is picked again", async () => {
  const calls = stubBilling(json(active));
  const choices = await screen.findByRole("group", { name: "Change plan" });
  fireEvent.click(within(choices).getByRole("button", { name: "Pro, $10 a month" }));
  expect(screen.queryByRole("alertdialog")).toBeNull();
  expect(calls).toHaveLength(1);
});

it("keeps the plan and says why when the card declines a switch", async () => {
  stubBilling(json(active), json({ code: "payment_needed" }, 402));
  const choices = await screen.findByRole("group", { name: "Change plan" });
  fireEvent.click(within(choices).getByRole("button", { name: "Pro, $100 a year" }));
  fireEvent.click(within(await screen.findByRole("alertdialog")).getByRole("button", { name: "Switch plan" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("card didn't go through");
  expect(screen.getByText("$10 a month")).toBeInTheDocument();
});

it("says a cancelled Pro goes back to Free, not deleted", async () => {
  stubBilling(json(active));
  fireEvent.click(await screen.findByRole("button", { name: "Cancel" }));
  const dialog = await screen.findByRole("alertdialog");
  expect(dialog).toHaveTextContent("You keep Pro until");
  expect(dialog).toHaveTextContent("moves to Free");
  expect(dialog).toHaveTextContent("Nothing is deleted");
});
