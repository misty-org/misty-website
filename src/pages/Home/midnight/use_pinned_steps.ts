import { useEffect, useState, type RefObject } from "react";

import { holdWheelToSteps, settleStep, STEP } from "./stepped_scroll";

const PINNED = "(min-width: 1000px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

export function usePinnedSteps(section: RefObject<HTMLElement | null>, count: number) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const media = matchMedia(PINNED);
    const pin = element.querySelector<HTMLElement>(".mist-steps-pin");
    const last = count - 1;
    let frame = 0;
    let top = 0;
    const measure = () => {
      if (pin) top = parseFloat(getComputedStyle(pin).top) || 0;
    };
    const origin = () => element.getBoundingClientRect().top + scrollY - top;

    let wanted = -1;
    const update = () => {
      frame = 0;
      if (!media.matches || !pin) return;
      wanted = settleStep((scrollY - origin()) / STEP, wanted, last);
      setActive(wanted);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

    let releaseWheel: (() => void) | null = null;
    const syncWheel = () => {
      if (media.matches && !releaseWheel) releaseWheel = holdWheelToSteps(origin, last);
      else if (!media.matches && releaseWheel) { releaseWheel(); releaseWheel = null; }
      schedule();
    };

    const resize = new ResizeObserver(() => {
      if (pin) element.style.setProperty("--pin-h", `${pin.offsetHeight}px`);
      measure();
      schedule();
    });
    if (pin) resize.observe(pin);
    addEventListener("scroll", schedule, { passive: true });
    media.addEventListener("change", syncWheel);
    measure();
    syncWheel();
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      releaseWheel?.();
      removeEventListener("scroll", schedule);
      media.removeEventListener("change", syncWheel);
    };
  }, [section, count]);

  const choose = (index: number) => {
    const element = section.current;
    if (!element) return;
    if (!matchMedia(PINNED).matches) {
      setActive(index);
      return;
    }
    const pin = element.querySelector<HTMLElement>(".mist-steps-pin");
    const pinTop = pin ? parseFloat(getComputedStyle(pin).top) || 0 : 0;
    const top = element.getBoundingClientRect().top + scrollY - pinTop;
    scrollTo({ top: top + index * STEP, behavior: "smooth" });
  };

  return [active, choose] as const;
}
