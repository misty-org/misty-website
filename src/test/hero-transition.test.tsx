import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { marketingCopy } from "@/content/marketingCopy";
import { Hero } from "@/pages/Home/sections/Hero";

const scroll = vi.hoisted(() => ({ progress: 0 }));

vi.mock("@/hooks/useScrollProgress", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/hooks/useScrollProgress")>()),
  useScrollProgress: () => ({ ref: { current: null }, progress: scroll.progress }),
}));
vi.mock("@/components/marketing/appchrome", () => ({ MistyAppMockup: () => null }));
vi.mock("@/components/marketing/previews", () => ({ ScreenshotSlot: () => null }));
vi.mock("@/pages/Home/components/HomeCtaButtons", () => ({ HomeCtaButtons: () => null }));

beforeEach(() => {
  scroll.progress = 0;
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
  });
  vi.stubGlobal("IntersectionObserver", class {
    observe() {}
    disconnect() {}
  });
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("min-width"),
    addEventListener() {},
    removeEventListener() {},
  }));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it("delays the first hover reveal, then restores the idle action immediately on movement", () => {
  vi.useFakeTimers();
  scroll.progress = 1;
  const view = render(<Hero copy={marketingCopy.home} />);
  const product = view.container.querySelector(".hero-scroll-product")!;
  const action = view.container.querySelector(".hero-scroll-product-cta")!;
  expect(action).toHaveAttribute("data-visible", "false");
  fireEvent.pointerEnter(product);
  act(() => vi.advanceTimersByTime(500));
  fireEvent.pointerMove(product);
  act(() => vi.advanceTimersByTime(499));
  expect(action).toHaveAttribute("data-visible", "false");
  act(() => vi.advanceTimersByTime(1));
  expect(action).toHaveAttribute("data-visible", "true");
  act(() => vi.advanceTimersByTime(2_500));
  fireEvent.pointerMove(product);
  act(() => vi.advanceTimersByTime(2_500));
  expect(action).toHaveAttribute("data-visible", "true");
  act(() => vi.advanceTimersByTime(500));
  expect(action).toHaveAttribute("data-visible", "false");
  fireEvent.pointerMove(product);
  expect(action).toHaveAttribute("data-visible", "true");
  fireEvent.pointerLeave(product);
  expect(action).toHaveAttribute("data-visible", "false");
  fireEvent.pointerEnter(product);
  act(() => vi.advanceTimersByTime(500));
  fireEvent.pointerLeave(product);
  act(() => vi.advanceTimersByTime(1_000));
  expect(action).toHaveAttribute("data-visible", "false");
  view.unmount();
});

it("never blends the headline with the screenshot when scrolling forward or backward", () => {
  const view = render(<Hero copy={marketingCopy.home} />);
  const steps = Array.from({ length: 101 }, (_, i) => i / 100);
  for (const progress of [...steps, ...steps.slice().reverse()]) {
    scroll.progress = progress;
    view.rerender(<Hero copy={marketingCopy.home} />);
    const layout = view.container.querySelector<HTMLElement>(".hero-scroll-layout")!;
    const text = Number(layout.style.getPropertyValue("--hero-copy-opacity"));
    const screenshot = Number(layout.style.getPropertyValue("--hero-product-opacity"));
    expect(text * screenshot, `overlap at ${progress}`).toBe(0);
  }
});

it("completes the text zoom before revealing the screenshot and its link", () => {
  scroll.progress = 0.525;
  const view = render(<Hero copy={marketingCopy.home} />);
  const layout = view.container.querySelector<HTMLElement>(".hero-scroll-layout")!;
  expect(Number(layout.style.getPropertyValue("--hero-copy-scale"))).toBeCloseTo(4.8);
  expect(layout.style.getPropertyValue("--hero-copy-opacity")).toBe("0");
  expect(view.container.querySelector(".hero-scroll-product")).toHaveAttribute("inert");

  scroll.progress = 0.75;
  view.rerender(<Hero copy={marketingCopy.home} />);
  expect(layout.style.getPropertyValue("--hero-product-opacity")).toBe("1");
  expect(view.container.querySelector(".hero-scroll-copy")).toHaveAttribute("inert");
  expect(view.container.querySelector(".hero-scroll-product")).not.toHaveAttribute("inert");
});

it("hides hero actions before the heading starts zooming", () => {
  scroll.progress = 0.025;
  const view = render(<Hero copy={marketingCopy.home} />);
  const buttons = view.container.querySelector<HTMLElement>(".hero-scroll-buttons")!;
  expect(buttons.style.opacity).toBe("0");
  expect(buttons).toHaveAttribute("inert");
  scroll.progress = 0;
  view.rerender(<Hero copy={marketingCopy.home} />);
  expect(buttons.style.opacity).toBe("1");
  expect(buttons).not.toHaveAttribute("inert");
});
