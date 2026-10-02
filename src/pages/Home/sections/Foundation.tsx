import { type CSSProperties, useEffect, useRef, useState } from "react";
import { WordRain } from "../components/WordRain";

const motionQuery = "(max-width: 1023px) and (min-height: 480px) and (prefers-reduced-motion: no-preference), (min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const slideProgress = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const READING_TRAVEL_SVH = 180;
const HANDOFF_SPAN = 0.42;
const GOAL_HOLD_SPAN = 0.28;
const TOTAL_TRAVEL_SVH = (1 + HANDOFF_SPAN + GOAL_HOLD_SPAN) * READING_TRAVEL_SVH;

export function Foundation() {
  const storyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [rainRunning, setRainRunning] = useState(false);
  useEffect(() => {
    let inView = false;
    const update = () => setRainRunning(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(storyRef.current!.querySelector(".foundation-arrival")!);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  useEffect(() => {
    const story = storyRef.current!;
    const stage = story.querySelector<HTMLElement>(".foundation-stage")!;
    const media = window.matchMedia(motionQuery);
    const compactMedia = window.matchMedia("(max-width: 1023px)");
    const rail = story.closest<HTMLElement>(".home-content-rail")!;
    let frame = 0;
    let previousTime = 0;
    let current = 0;
    let release = 0;
    let releaseTarget = 0;
    const measure = () => {
      const top = Number.parseFloat(getComputedStyle(stage).top) || 0;
      const travelled = top - story.getBoundingClientRect().top;
      const travel = Math.max(1, story.offsetHeight - stage.offsetHeight);
      releaseTarget = media.matches ? clamp((travelled - travel) / (window.innerHeight * 0.3)) : 0;
      const goal = stage.querySelector<HTMLElement>(".foundation-goal")!;
      rail.style.setProperty("--foundation-tail-space", `${Math.max(0, (stage.offsetHeight - goal.offsetHeight) / 2)}px`);
      return clamp(travelled / travel);
    };
    const animate = (now: number) => {
      const target = measure();
      const elapsed = previousTime ? Math.min(64, now - previousTime) : 16;
      previousTime = now;
      current += (target - current) * (1 - Math.exp(-elapsed / 65));
      release += (releaseTarget - release) * (1 - Math.exp(-elapsed / 65));
      if (Math.abs(target - current) < 0.00005) current = target;
      if (Math.abs(releaseTarget - release) < 0.00005) release = releaseTarget;
      rail.style.setProperty("--foundation-release", String(release));
      setProgress(current);
      frame = current !== target || release !== releaseTarget ? requestAnimationFrame(animate) : 0;
      if (!frame) previousTime = 0;
    };
    const update = () => {
      if (media.matches && !frame) frame = requestAnimationFrame(animate);
    };
    const changeMode = () => {
      setScrollEnabled(media.matches);
      setCompact(compactMedia.matches);
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      current = measure();
      release = releaseTarget;
      rail.style.setProperty("--foundation-release", String(release));
      setProgress(current);
    };
    changeMode();
    media.addEventListener("change", changeMode);
    compactMedia.addEventListener("change", changeMode);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = new ResizeObserver(update);
    observer.observe(story);
    observer.observe(stage);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", changeMode);
      compactMedia.removeEventListener("change", changeMode);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
      rail.style.removeProperty("--foundation-release");
      rail.style.removeProperty("--foundation-tail-space");
    };
  }, []);
  // Both horizontal handoffs use the original entrance distance and easing.
  // Move the outgoing and incoming headlines together to avoid an empty beat.
  // Phones use three equal, short beats while retaining the desktop timing.
  const sceneProgress = progress * (compact ? 3 : TOTAL_TRAVEL_SVH / READING_TRAVEL_SVH);
  const handoff = compact ? 0.45 : HANDOFF_SPAN;
  const slide = scrollEnabled ? slideProgress((sceneProgress - (compact ? 0.55 : 0.06)) / handoff) : 0;
  const readingProgress = clamp((sceneProgress - (compact ? 1 : 0.48)) / (compact ? 0.55 : 0.52));
  const exitSlide = scrollEnabled ? slideProgress((sceneProgress - (compact ? 1.55 : 1)) / handoff) : 0;
  const goalSlide = scrollEnabled ? exitSlide : 1;
  const contentHidden = scrollEnabled && (slide < 0.02 || exitSlide > 0.98);
  const goalHidden = scrollEnabled && goalSlide < 0.02;
  useEffect(() => {
    const rail = storyRef.current?.closest<HTMLElement>(".home-content-rail");
    rail?.style.setProperty("--foundation-previous-shift", `${-100 * slide}vw`);
    return () => { rail?.style.removeProperty("--foundation-previous-shift"); };
  }, [slide]);
  const lightStyle = {
    "--foundation-light-position": `${-20 + 140 * readingProgress}%`,
    "--foundation-slide": slide,
    "--foundation-exit-slide": exitSlide,
    "--foundation-goal-slide": goalSlide,
    "--foundation-scroll-height": `${TOTAL_TRAVEL_SVH}svh`,
    "--foundation-rain-state": rainRunning ? "running" : "paused",
  } as CSSProperties;

  return (
    <section id="foundation" aria-labelledby="foundation-title" className="foundation-section">
      <div ref={storyRef} className="foundation-story" style={lightStyle}>
        <div className="foundation-stage">
          <div className="foundation-intro site-container" aria-hidden={scrollEnabled && slide > 0.98}>
            <p className="marketing-heading scroll-heading-flow">Keep your place.</p>
          </div>
          <div className="foundation-arrival" aria-hidden={contentHidden} inert={contentHidden ? true : undefined}>
            <WordRain />
          <div className="site-container foundation-content" data-scroll-enabled={scrollEnabled}>
            <h2 id="foundation-title" className="marketing-heading foundation-title">
              <span className="foundation-title-light">
                Switch computers.<br />Keep going.
              </span>
            </h2>

          </div>
          </div>
          <div className="foundation-outro site-container" aria-hidden={goalHidden} inert={goalHidden ? true : undefined}>
            <p className="marketing-heading foundation-goal scroll-heading-flow">That’s the <em>goal</em>.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
