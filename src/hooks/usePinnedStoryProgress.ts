import { useEffect, useRef, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

export function usePinnedStoryProgress<
  T extends HTMLElement = HTMLDivElement,
>() {
  const ref = useRef<T>(null);
  const [motion, setMotion] = useState(() =>
    prefersReducedMotion()
      ? { approach: 1, progress: 0 }
      : { approach: 0, progress: 0 },
  );

  useEffect(() => {
    const track = ref.current;
    if (!track) return;

    if (prefersReducedMotion()) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const next = {
        approach: Math.min(
          1,
          Math.max(0, 1 - rect.top / window.innerHeight),
        ),
        progress:
          travel > 0
            ? Math.min(1, Math.max(0, -rect.top / travel))
            : 0,
      };

      setMotion((current) =>
        Math.abs(current.approach - next.approach) < 0.0001 &&
        Math.abs(current.progress - next.progress) < 0.0001
          ? current
          : next,
      );
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, ...motion };
}
