import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";

import { isDocsHost } from "@/lib/site";

/** Paths that are the homepage scrolled to one of its sections; none today, /download is its own page. */
const SECTION_BY_PATH: Record<string, string> = {};
/** On the docs host `/` is the docs' own first page, never the homepage. */
export const isHomePath = (pathname: string) =>
  !isDocsHost() && (pathname === "/" || pathname in SECTION_BY_PATH);

/** How long a direct visit keeps its section aligned while images and fonts change the page height. */
const SETTLE_MS = 2000;

/**
 * A section path renders the homepage, then scrolls to its section: instantly on
 * first load, smoothly when the navbar or footer links there. Following a link back to /
 * returns to the top. Back and forward keep the position the browser restores.
 */
export function useSectionRoute() {
  const location = useLocation();
  const navigationType = useNavigationType();
  // Set only once a scroll has actually run, so a cancelled first effect still counts as the first.
  const settled = useRef(false);

  useEffect(() => {
    const first = !settled.current;
    // App scrolls to #anchors itself, and history navigation restores its own position.
    if (location.hash || (navigationType === "POP" && !first)) {
      settled.current = true;
      return;
    }
    const id = SECTION_BY_PATH[location.pathname];
    if (!id && first) {
      settled.current = true;
      return;
    }
    const align = (behavior: ScrollBehavior) => {
      if (id) document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
      else window.scrollTo({ top: 0, behavior });
    };
    const frame = requestAnimationFrame(() => {
      settled.current = true;
      const smooth = !first && !matchMedia("(prefers-reduced-motion: reduce)").matches;
      align(smooth ? "smooth" : "instant");
    });
    if (!first) return () => cancelAnimationFrame(frame);

    // On a direct visit, content above the section is still loading. Keep the section in
    // place as the page grows, until the visitor scrolls for themselves.
    const resize = new ResizeObserver(() => align("instant"));
    const stop = () => {
      resize.disconnect();
      for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) window.removeEventListener(type, stop);
    };
    resize.observe(document.body);
    for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) window.addEventListener(type, stop, { passive: true });
    const timer = window.setTimeout(stop, SETTLE_MS);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      stop();
    };
    // Every navigation gets a new key, so following the same link twice scrolls again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);
}
