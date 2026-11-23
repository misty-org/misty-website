import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";

import { isDocsHost } from "@/lib/site";

const SECTION_BY_PATH: Record<string, string> = {};
export const isHomePath = (pathname: string) =>
  !isDocsHost() && (pathname === "/" || pathname in SECTION_BY_PATH);

const SETTLE_MS = 2000;

export function useSectionRoute() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const settled = useRef(false);

  useEffect(() => {
    const first = !settled.current;
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
