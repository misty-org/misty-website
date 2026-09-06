import { useEffect, useRef, useState } from "react";
import { stepScrollSpring } from "./scrollSpring";

/**
 * How far the viewport has travelled through a tall element, as 0…1.
 *
 * Pair with a `position: sticky` child: the child pins while the parent
 * scrolls past, and the returned progress says which beat of the story should
 * be showing. `useReveal` answers "is it on screen yet"; this answers "how far
 * in are we", which is the difference between a fade-in and a demo.
 *
 * Returns 0 under `prefers-reduced-motion`, where the section renders as a
 * plain stacked list and progress has nothing to drive.
 */
type ScrollProgressOptions = {
  /**
   * `top` starts when the track reaches the top of the viewport. `enter`
   * starts while the track's sticky stage is first coming into view, which
   * avoids an empty viewport before slide-in scenes begin moving.
   */
  start?: "top" | "enter" | "center";
  motion?: "damped" | "spring";
};

export function useScrollProgress<T extends HTMLElement = HTMLElement>({
  start = "top",
  motion: motionModel = "damped",
}: ScrollProgressOptions = {}) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const [approachProgress, setApproachProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    let frame = 0;
    let previousTime = 0;
    let current = 0;
    let approach = 0;
    let target = 0;
    let approachTarget = 0;
    let velocity = 0;

    // A single, time-based follower keeps wheel and trackpad input continuous.
    // New input changes the target without restarting the animation's clock.
    const animate = (now: number) => {
      measure();
      const elapsed = previousTime ? Math.min(64, now - previousTime) : 1000 / 60;
      previousTime = now;
      const blend = 1 - Math.exp(-elapsed / 65);
      if (motionModel === "spring") {
        const next = stepScrollSpring(current, velocity, target, elapsed / 1000);
        current = next.position;
        velocity = next.velocity;
      } else {
        current += (target - current) * blend;
      }
      approach += (approachTarget - approach) * blend;
      if (Math.abs(target - current) < 0.00005 && Math.abs(velocity) < 0.001) {
        current = target;
        velocity = 0;
      }
      if (Math.abs(approachTarget - approach) < 0.00005) approach = approachTarget;
      setProgress(current);
      setApproachProgress(approach);
      frame = current !== target || approach !== approachTarget
        ? window.requestAnimationFrame(animate)
        : 0;
      if (!frame) previousTime = 0;
    };

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Let headings enter during the approach without advancing pinned content.
      approachTarget = Math.min(1, Math.max(0,
        (viewportHeight * 0.8125 - rect.top) / (viewportHeight * 0.8125),
      ));
      // A top-starting sticky track travels for its height minus the pinned
      // viewport. An entering track includes the approach from the bottom of
      // the viewport, so its complete visible journey is the track's height.
      const travel =
        start !== "top" ? rect.height : rect.height - viewportHeight;
      const travelled =
        start === "center" ? viewportHeight * 0.5 - rect.top :
        start === "enter" ? viewportHeight - rect.top : -rect.top;
      target = travel <= 0 ? 0 : Math.min(1, Math.max(0, travelled / travel));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    measure();
    current = target;
    approach = approachTarget;
    setProgress(current);
    setApproachProgress(approach);
    // Capture scroll events from nested page scrollers as well as the window.
    // This keeps the pinned story responsive if its surrounding layout changes
    // which element owns vertical scrolling.
    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", onScroll);
    // Fonts and media above a track can move it without a scroll event.
    // Refresh the target so the next small gesture cannot cause a jump.
    const observer = new ResizeObserver(onScroll);
    observer.observe(el);
    observer.observe(document.body);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
    };
  }, [start, motionModel]);

  return { ref, progress, approachProgress };
}

/**
 * Where a 0…1 progress value lands across `count` beats.
 *
 * `index` is the active beat; `within` is how far through that beat we are,
 * which is what lets a progress bar fill continuously instead of stepping.
 */
export function beatPosition(progress: number, count: number) {
  const raw = progress * count;
  const index = Math.min(count - 1, Math.floor(raw));
  return { index, within: Math.min(1, Math.max(0, raw - index)) };
}

/** Cubic ease-out, for scroll-driven transforms that should settle rather than ramp. */
export function easeOut(t: number) {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
}
