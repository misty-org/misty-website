import { useEffect, useState, type RefObject } from "react";

/** Where a stepper pins and follows scroll; elsewhere the steps are buttons. Keep in sync with midnight.css. */
const PINNED = "(min-width: 1000px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

/**
 * A pinned scene: the viewport holds still while scrolling moves through `count` steps. The
 * section's `.mist-steps-pin` sticks, and how far the track has scrolled picks the current step.
 * Elsewhere `choose` switches straight to a step; pinned, it scrolls to that step's place.
 */
export function usePinnedSteps(section: RefObject<HTMLElement | null>, count: number) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const media = matchMedia(PINNED);
    let frame = 0;
    const pin = element.querySelector<HTMLElement>(".mist-steps-pin");
    // Read once per resize, not every scroll frame: style and layout reads in a scroll handler cost frames.
    let top = 0;
    let travel = 1;
    const measure = () => {
      if (!pin) return;
      top = parseFloat(getComputedStyle(pin).top) || 0;
      travel = Math.max(1, element.offsetHeight - pin.offsetHeight);
    };
    const update = () => {
      frame = 0;
      if (!media.matches || !pin) return;
      // The pin sticks at its `top` (which centers it) and holds until the track runs out.
      const rect = element.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (top - rect.top) / travel));
      setActive(Math.min(count - 1, Math.floor(progress * count)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    // The pin's height feeds its centering offset in CSS.
    const resize = new ResizeObserver(() => {
      if (pin) element.style.setProperty("--pin-h", `${pin.offsetHeight}px`);
      measure();
      schedule();
    });
    if (pin) resize.observe(pin);
    addEventListener("scroll", schedule, { passive: true });
    media.addEventListener("change", schedule);
    measure();
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      removeEventListener("scroll", schedule);
      media.removeEventListener("change", schedule);
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
    const travel = element.offsetHeight - (pin?.offsetHeight ?? innerHeight);
    const top = element.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top - pinTop + travel * (index + 0.5) / count, behavior: "smooth" });
  };

  return [active, choose] as const;
}
