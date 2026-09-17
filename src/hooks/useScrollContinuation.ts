import { useEffect, type RefObject } from "react";
import { isEmbeddedBrowser } from "@/lib/browser";

/** Complete a scene or one debounced panel per gesture, starting immediately. */
export function useScrollContinuation(
  ref: RefObject<HTMLElement | null>,
  stops: readonly number[],
  query: string,
  oneStageFrom = Infinity,
  durationScale = 1,
  sceneRange?: readonly [number, number],
) {
  useEffect(() => {
    // In embedded browsers (such as Misty's in-app WKWebView, Tauri, WebView2, or in-app webviews),
    // programmatic scroll hijacking fights the host application's asynchronous compositor
    // momentum scrolling, causing rapid back-and-forth scroll jitters. Let native scrolling handle it.
    if (isEmbeddedBrowser()) return;

    const media = window.matchMedia(`${query} and (prefers-reduced-motion: no-preference)`);
    let frame = 0;
    let previousTime = 0;
    let position = window.scrollY;
    let destination: number | null = null;
    let lastWrittenY: number | null = null;
    let lastY = window.scrollY;
    let direction = 1;
    let inputEnabled = false;
    let pointerDown = false;
    let dragged = false;
    let stageReadyAt = 0;
    let stageStartedAt: number | null = null;
    let stageStartY = 0;
    let isStageAnimation = false;
    let sceneDistance = 0;

    const cancel = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      destination = null;
      previousTime = 0;
      lastWrittenY = null;
      lastY = window.scrollY;
      inputEnabled = false;
      stageReadyAt = 0;
      stageStartedAt = null;
      isStageAnimation = false;
    };

    const tick = (now: number) => {
      const element = ref.current;
      if (!element || !media.matches || destination === null || pointerDown) {
        cancel();
        return;
      }
      const rect = element.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const targetY = window.scrollY + rect.top + destination * travel;
      // Native scrolling may cross the endpoint before its scroll event is
      // delivered (notably with Firefox momentum). Never pull the user back.
      if (!isStageAnimation &&
          ((direction > 0 && window.scrollY > targetY + 1.5) ||
          (direction < 0 && window.scrollY < targetY - 1.5))) {
        cancel();
        return;
      }
      if (!previousTime) position = window.scrollY;
      const distance = targetY - position;
      const dt = previousTime ? Math.min(32, now - previousTime) : 1000 / 60;
      previousTime = now;
      // Immediate motion at a bounded speed, followed by a gentle landing.
      // New input updates this journey without restarting an easing curve.
      // Chapter tracks have different heights; normalize their zoom distance
      // to the hero's 80svh travel so the camera moves at the same pace.
      const timeScale = sceneRange && sceneDistance > 0
        ? durationScale * (window.innerHeight * 0.8) / sceneDistance
        : durationScale;
      const step = Math.sign(distance) * Math.min(
        Math.abs(distance) * (1 - Math.exp(-dt / (160 * timeScale))),
        900 * dt / (1000 * timeScale),
      );
      let finished = Math.abs(distance) < 1.5;
      if (isStageAnimation) {
        // Every accepted panel gesture gets the same complete animation.
        // Wheel distance and speed never affect its destination or duration.
        stageStartedAt ??= now;
        const phase = Math.min(1, (now - stageStartedAt) / 650);
        const eased = phase * phase * (3 - 2 * phase);
        finished = phase === 1;
        position = stageStartY + (targetY - stageStartY) * eased;
      } else {
        position = finished ? targetY : position + step;
      }
      window.scrollTo({ top: position, behavior: "instant" });
      lastWrittenY = window.scrollY;
      lastY = window.scrollY;
      if (finished) {
        frame = 0;
        destination = null;
        previousTime = 0;
        stageStartedAt = null;
        // The final scroll event belongs to this animation, not a new gesture.
        inputEnabled = false;
        // A short, fixed cooldown absorbs the immediate tail. New wheel
        // events never extend it, so continuous scrolling cannot lock here.
        if (isStageAnimation) stageReadyAt = now + 100;
      } else {
        frame = requestAnimationFrame(tick);
      }
    };

    const continueScene = () => {
      // Only the optional chapter range continues automatically. Panel
      // changes keep their own gesture handling after the chapter finishes.
      if (Number.isFinite(oneStageFrom) && !sceneRange) return;
      const element = ref.current;
      if (!inputEnabled || !media.matches || pointerDown || !element) return;
      const rect = element.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0 || (!sceneRange && rect.top >= 0) || rect.bottom <= window.innerHeight) {
        cancel();
        return;
      }
      const progress = -rect.top / travel;
      const approachStart = -window.innerHeight * 0.8125 / travel;
      const arriving = sceneRange && progress < 0 && progress > approachStart;
      if (sceneRange && !arriving && (progress < sceneRange[0] || progress >= sceneRange[1])) {
        if (frame && !isStageAnimation) cancel();
        return;
      }
      const sceneStops = arriving ? [approachStart, 0] : sceneRange ?? stops;
      const next = direction > 0
        ? sceneStops.find(stop => (stop - progress) * travel > 1.5)
        : [...sceneStops].reverse().find(stop => (progress - stop) * travel > 1.5);
      if (next === undefined) return;
      destination = next;
      sceneDistance = (sceneStops[sceneStops.length - 1] - sceneStops[0]) * travel;
      isStageAnimation = false;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (lastWrittenY !== null && Math.abs(y - lastWrittenY) < 1) return;
      if (y === lastY) return;
      if (pointerDown) direction = Math.sign(y - lastY);
      lastY = y;
      position = y;
      if (pointerDown) { dragged = true; return; }
      continueScene();
    };
    const consumeStage = (event: WheelEvent | KeyboardEvent, nextDirection: number) => {
      const element = ref.current;
      if (!media.matches || !element || pointerDown) return false;
      const rect = element.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = -rect.top / travel;
      if (travel <= 0 || progress < oneStageFrom - 0.01 || progress > 1 + 1.5 / travel) return false;
      // Same-direction input shares the current transition. Reversing owns
      // the direction immediately, including during a running transition.
      const reversing = Boolean(frame) && nextDirection !== direction;
      if (frame && !reversing) {
        event.preventDefault();
        return true;
      }
      if (reversing) cancel();
      // Fonts and media can shift a settled boundary by a few pixels. Treat
      // that as the same panel, rather than consuming a gesture to finish it.
      const boundaryTolerance = reversing ? 1.5 : Math.max(1.5, Math.min(24, travel * 0.01));
      const next = nextDirection > 0
        ? stops.find(stop => stop > oneStageFrom && (stop - progress) * travel > boundaryTolerance)
        : [...stops].reverse().find(stop => stop >= oneStageFrom && (progress - stop) * travel > boundaryTolerance);
      // A fresh gesture at the outer boundary resumes normal page scrolling.
      if (next === undefined) return false;
      if (nextDirection === direction && performance.now() < stageReadyAt) {
        event.preventDefault();
        return true;
      }
      event.preventDefault();
      if (direction !== nextDirection) cancel();
      direction = nextDirection;
      destination = next;
      isStageAnimation = true;
      stageStartY = window.scrollY;
      stageStartedAt = performance.now();
      inputEnabled = false;
      if (!frame) frame = requestAnimationFrame(tick);
      return true;
    };

    const onWheel = (event: WheelEvent) => {
      if (!event.deltaY || event.ctrlKey) return;
      const nextDirection = Math.sign(event.deltaY);
      if (consumeStage(event, nextDirection)) return;
      // A reverse gesture owns the direction immediately. Never infer it
      // from a scroll event that may also contain our last animated frame.
      if (nextDirection !== direction) cancel();
      direction = nextDirection;
      inputEnabled = true;
      lastWrittenY = null;
      // Some browsers apply a wheel delta before delivering its scroll
      // event. Retarget now as well, so an equal-position event cannot leave
      // a reverse gesture cancelled halfway through its scene.
      if ((ref.current?.getBoundingClientRect().top ?? 0) < 0) continueScene();
    };
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === "Escape") { cancel(); return; }
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " "].includes(event.key)) {
        const nextDirection = event.key === "ArrowUp" || event.key === "PageUp" ||
          (event.key === " " && event.shiftKey) ? -1 : 1;
        if (consumeStage(event, nextDirection)) return;
        if (nextDirection !== direction) cancel();
        direction = nextDirection;
        inputEnabled = true;
        lastWrittenY = null;
        if ((ref.current?.getBoundingClientRect().top ?? 0) < 0) continueScene();
      }
    };
    const down = () => { cancel(); pointerDown = true; dragged = false; };
    const up = () => {
      pointerDown = false;
      if (dragged) { inputEnabled = true; continueScene(); }
    };

    document.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: !Number.isFinite(oneStageFrom) });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("resize", cancel);
    media.addEventListener("change", cancel);
    return () => {
      cancel();
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", cancel);
      media.removeEventListener("change", cancel);
    };
  }, [ref, stops, query, oneStageFrom, durationScale, sceneRange]);
}
