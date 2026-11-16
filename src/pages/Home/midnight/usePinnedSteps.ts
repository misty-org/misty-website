import { useEffect, useState, type RefObject } from "react";

import { holdWheelToSteps, settleStep, STEP } from "./steppedScroll";

/** Where a stepper pins and follows scroll; elsewhere the steps are buttons. Keep in sync with steps.css. */
const PINNED = "(min-width: 1000px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

/**
 * A pinned scene that moves in steps, with the bento's feel (steppedScroll): the section's `.mist-steps-pin`
 * sticks, each scroll gesture moves one step of STEP pixels, and the scroll position, settled, picks the current
 * step. steps.css makes the track one STEP per step taller than the pin, plus one so the last step rests a moment
 * before the page moves on. Elsewhere `choose` switches straight to a step; pinned, it scrolls to that step's place.
 */
export function usePinnedSteps(section: RefObject<HTMLElement | null>, count: number) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const media = matchMedia(PINNED);
    const pin = element.querySelector<HTMLElement>(".mist-steps-pin");
    const last = count - 1;
    let frame = 0;
    // Read once per resize, not every scroll frame: style and layout reads in a scroll handler cost frames.
    let top = 0;
    const measure = () => {
      if (pin) top = parseFloat(getComputedStyle(pin).top) || 0;
    };
    /** Where step 0 sits on the page: the scroll at which the pin first sticks. */
    const origin = () => element.getBoundingClientRect().top + scrollY - top;

    let wanted = -1;
    const update = () => {
      frame = 0;
      if (!media.matches || !pin) return;
      wanted = settleStep((scrollY - origin()) / STEP, wanted, last);
      setActive(wanted);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

    // The wheel steps only while the scene pins.
    let releaseWheel: (() => void) | null = null;
    const syncWheel = () => {
      if (media.matches && !releaseWheel) releaseWheel = holdWheelToSteps(origin, last);
      else if (!media.matches && releaseWheel) { releaseWheel(); releaseWheel = null; }
      schedule();
    };

    // The pin's height feeds its centering offset and the track's height in CSS.
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

  /** Pinned, a step is a place in the scroll; otherwise its button switches straight to it. */
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
