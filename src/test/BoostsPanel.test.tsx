import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it, vi } from "vitest";

import { levelLine } from "@/pages/AccountSettings/boost_text";
import { BoostsPanel } from "@/pages/AccountSettings/panels/BoostsPanel";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

const spaces = {
  spaces: [
    { id: "space_team", name: "Team", is_default: false },
    { id: "space_home", name: "Home", is_default: true },
  ],
};

const levels: Record<string, unknown> = {
  space_team: { space_id: "space_team", enabled: true, boosters: [], level: { level: 1, boosts: 3, next_level_boosts: 7, thresholds: [2, 7, 14] } },
  space_home: { space_id: "space_home", enabled: true, boosters: [], level: { level: 0, boosts: 0, next_level_boosts: 2, thresholds: [2, 7, 14] } },
};

function plus(boosts: Record<string, unknown>) {
  return { subscribed: true, plan: "plus", interval: "month", status: "active", cancel_at_period_end: false, boosts };
}

function stub(...billing: Response[]) {
  const calls: { url: string; body: string }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith("/me/account-proof")) return Promise.resolve(json({ proof: "proof" }));
      if (url.endsWith("/spaces")) return Promise.resolve(json(spaces));
      const level = url.match(/\/spaces\/([^/]+)\/boosts$/);
      if (level) return Promise.resolve(json(levels[level[1]!]));
      calls.push({ url, body: String(init?.body ?? "") });
      return Promise.resolve(billing.shift() ?? json({}, 500));
    }),
  );
  return calls;
}

function renderPanel(path = "/settings/boosts") {
  render(
    <MemoryRouter initialEntries={[path]}>
      <BoostsPanel onClose={() => {}} />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("says where a space stands and what the next level needs", () => {
  expect(levelLine(levels.space_team as never)).toBe("Level 1 with 3 Boosts, 4 more for Level 2");
  expect(levelLine(levels.space_home as never)).toBe("Base level with 0 Boosts, 2 more for Level 1");
  expect(
    levelLine({ space_id: "x", enabled: true, boosters: [], level: { level: 3, boosts: 15, next_level_boosts: 0, thresholds: [2, 7, 14] } }),
  ).toBe("Level 3 with 15 Boosts");
});

it("gives Misty+'s included Boosts to a space", async () => {
  const state = plus({ included: 3, assigned: [], bought: [] });
  const calls = stub(json(state), json(plus({ included: 3, assigned: [{ space_id: "space_team", boosts: 2 }], bought: [] })));
  renderPanel();
  expect(await screen.findByText("0 of 3 given")).toBeInTheDocument();
  expect(await screen.findByText("Level 1 with 3 Boosts, 4 more for Level 2")).toBeInTheDocument();
  fireEvent.click(screen.getAllByRole("button", { name: "Boost" })[0]!);
  const dialog = await screen.findByRole("dialog");
  const more = within(dialog).getByRole("button", { name: "More included boosts" });
  fireEvent.click(more);
  fireEvent.click(more);
  fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));
  expect(await screen.findByText("2 of 3 given")).toBeInTheDocument();
  const assign = calls.find((call) => call.url.endsWith("/account/boosts/assign"))!;
  const form = new URLSearchParams(assign.body);
  expect(form.get("space_id")).toBe("space_team");
  expect(form.get("boosts")).toBe("2");
});

it("sends someone buying a space's first Boosts to checkout with the space and how many", async () => {
  stub(json({ subscribed: false, plan: "free", cancel_at_period_end: false, boosts: { included: 0, assigned: [], bought: [] } }));
  const submit = vi.spyOn(HTMLFormElement.prototype, "submit").mockImplementation(() => {});
  renderPanel("/settings/boosts?space=space_home");
  const dialog = await screen.findByRole("dialog");
  expect(within(dialog).getByText("Boost Home")).toBeInTheDocument();
  expect(within(dialog).queryByText("Included Boosts")).toBeNull();
  const more = within(dialog).getByRole("button", { name: "More bought boosts" });
  fireEvent.click(more);
  fireEvent.click(more);
  expect(within(dialog).getByText("$2 a month each, $4 a month in all")).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole("button", { name: "Continue to payment" }));
  await vi.waitFor(() => expect(submit).toHaveBeenCalled());
  const form = document.querySelector("form")!;
  expect(form.action).toMatch(/\/checkout$/);
  const fields = Object.fromEntries(new FormData(form).entries());
  expect(fields).toMatchObject({ plan: "boost", space_id: "space_home", quantity: "2", proof: "proof" });
  submit.mockRestore();
  form.remove();
});

it("changes Boosts already bought for a space, and says when the card declines", async () => {
  const bought = { space_id: "space_team", quantity: 2, status: "active", cancel_at_period_end: false, current_period_end: "2026-12-15T00:00:00Z" };
  const calls = stub(json(plus({ included: 3, assigned: [], bought: [bought] })), json({ code: "payment_needed" }, 402));
  renderPanel("/settings/boosts?space=space_team");
  const dialog = await screen.findByRole("dialog");
  fireEvent.click(within(dialog).getByRole("button", { name: "More bought boosts" }));
  expect(within(dialog).getByText("Your card is charged for the rest of this month today.")).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));
  expect(await within(dialog).findByRole("alert")).toHaveTextContent("card didn't go through");
  const quantity = calls.find((call) => call.url.endsWith("/account/boosts/quantity"))!;
  expect(new URLSearchParams(quantity.body).get("quantity")).toBe("3");
});
