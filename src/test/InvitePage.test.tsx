import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, expect, it, vi } from "vitest";

import Invite from "@/pages/Invite";

function open(answer: Response | Error) {
  const fetchMock = vi.fn(() =>
    answer instanceof Error ? Promise.reject(answer) : Promise.resolve(answer),
  );
  vi.stubGlobal("fetch", fetchMock);
  render(
    <MemoryRouter initialEntries={["/r/abcdefghij"]}>
      <Routes>
        <Route path="/r/:code" element={<Invite />} />
      </Routes>
    </MemoryRouter>,
  );
  return fetchMock;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("shows who the invite is from", async () => {
  const fetchMock = open(new Response(JSON.stringify({ name: "matt" }), { status: 200 }));
  expect(
    await screen.findByRole("heading", { name: "matt invited you to Misty" }),
  ).toBeInTheDocument();
  expect(String(fetchMock.mock.calls[0]?.[0 as never])).toContain("/invites/abcdefghij");
  expect(screen.getByRole("link", { name: "Create account" })).toHaveAttribute("href", "/register");
});

it("still welcomes someone when the code names nobody", async () => {
  open(new Response("{}", { status: 404 }));
  expect(await screen.findByRole("heading", { name: "You're invited to Misty" })).toBeInTheDocument();
});

it("still welcomes someone when the server can't be reached", async () => {
  open(new Error("offline"));
  expect(await screen.findByRole("heading", { name: "You're invited to Misty" })).toBeInTheDocument();
});
