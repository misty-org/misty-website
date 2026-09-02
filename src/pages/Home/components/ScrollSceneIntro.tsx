import type { CSSProperties } from "react";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/utils";

function smoothstep(start: number, end: number, value: number) {
  const progress = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return progress * progress * (3 - 2 * progress);
}

type ScrollSceneIntroProps = {
  title: string;
  description?: string;
  id?: string;
  direction?: "left" | "right";
  entrance?: "fade-slide" | "slide";
  className?: string;
};

/**
 * A viewport-height chapter card between the homepage's pinned stories.
 *
 * Keeping the entrance in its own scroll track prevents changes to the hero's
 * track length from consuming the progress used by later chapters.
 */
export function ScrollSceneIntro({
  title,
  description,
  id,
  direction = "right",
  entrance = "fade-slide",
  className,
}: ScrollSceneIntroProps) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const entranceWindow = Math.min(1, Math.max(0, progress / 0.8));
  const slideOnlyProgress = 1 - Math.pow(1 - entranceWindow, 3);
  const enters =
    entrance === "slide"
      ? slideOnlyProgress
      : smoothstep(0.04, 0.42, progress);
  const exits = smoothstep(0.82, 1, progress);
  const directionSign = direction === "right" ? 1 : -1;
  const entranceDistance = entrance === "slide" ? 100 : 34;
  const style = {
    "--story-intro-opacity":
      entrance === "slide" ? 1 - exits : enters * (1 - exits),
    "--story-intro-x": `${directionSign * ((1 - enters) * entranceDistance + exits * -14)}vw`,
    "--story-intro-scale": 0.94 + enters * 0.06 + exits * 0.025,
    "--story-intro-blur": `${entrance === "slide" ? exits * 3 : (1 - enters) * 8 + exits * 3}px`,
  } as CSSProperties;

  return (
    <div ref={ref} className={cn("story-intro-track", className)}>
      <div className="story-intro-stage">
        <div className="site-container">
          <div className="story-intro-copy" style={style}>
            <h2
              id={id}
              className="text-balance text-[clamp(2.75rem,7vw,6.75rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[var(--marketing-foreground)]"
            >
              {title}
            </h2>
            {description ? (
              <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-[var(--marketing-muted)] sm:text-xl">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
