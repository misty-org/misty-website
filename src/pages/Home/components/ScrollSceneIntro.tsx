import type { CSSProperties } from "react";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/utils";
import { slowSlideProgress } from "../scrollMotion";

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
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
 * Pure horizontal slide motion with zero opacity fading or blur.
 */
export function ScrollSceneIntro({
  title,
  description,
  id,
  direction = "right",
  className,
}: ScrollSceneIntroProps) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    start: "enter",
  });

  // Pure horizontal slide:
  // 0.00 -> 0.35: slides into the center
  // 0.35 -> 0.65: rests comfortably in the center
  // 0.65 -> 1.00: slides out across
  const inProgress = clamp(progress / 0.35);
  const inEase = slowSlideProgress(inProgress);
  const outProgress = clamp((progress - 0.65) / 0.35);
  const outEase = slowSlideProgress(outProgress);

  const directionSign = direction === "right" ? 1 : -1;
  const x = directionSign * ((1 - inEase) * 100 - outEase * 100);

  const style = {
    "--story-intro-x": `${x}vw`,
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
