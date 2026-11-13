import { useEffect, useRef, useState, type RefObject } from "react";

/** 0 asking · 1 plan proposed · 2–4 working · 5 waiting for approval · 6 done. */
export type Stage = 0 | 1 | 2 | 3 | 4 | 5 | 6;
const LAST_STAGE: Stage = 6;

/** Plays stages `from`..`to` in a loop while visible; holds the finished state for reduced motion. */
export function useStageLoop(ref: RefObject<HTMLElement | null>, from: Stage, enabled = true, stepMs = 1700, to: Stage = LAST_STAGE) {
  // Reduced motion holds the moment the agent asks for approval.
  const [reduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [stage, setStage] = useState<Stage>(reduced ? 5 : from);
  const visible = useRef(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled || reduced) return;
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; });
    observer.observe(element);
    const timer = window.setInterval(() => {
      if (!visible.current || document.hidden) return;
      // Linger on the finished state, then start over.
      setStage(current => (current >= to ? from : ((current + 1) as Stage)));
    }, stepMs);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [ref, from, enabled, reduced, stepMs, to]);
  return [stage, setStage] as const;
}
