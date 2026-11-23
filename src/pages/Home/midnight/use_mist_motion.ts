import { useEffect, useRef } from "react";

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function useMistMotion() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-mist-scene]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      if (document.hidden) return;
      const viewport = window.innerHeight;
      const measurements = sections.map(section => ({ section, rect: section.getBoundingClientRect() }));
      for (const { section, rect } of measurements) {
        const progress = media.matches ? 0.5 : clamp((viewport - rect.top) / (viewport + rect.height));
        const entry = media.matches ? 1 : clamp((viewport - rect.top) / (viewport * 0.8));
        const easedEntry = 1 - (1 - entry) ** 3;
        for (const [name, value] of [["--mist-progress", progress], ["--mist-entry", easedEntry]] as const) {
          const next = value.toFixed(4);
          if (section.style.getPropertyValue(name) !== next) section.style.setProperty(name, next);
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onVisibilityChange = () => {
      root.dataset.tabHidden = String(document.hidden);
      schedule();
    };
    const resize = new ResizeObserver(schedule);
    const visibility = new IntersectionObserver(entries => {
      for (const entry of entries) {
        (entry.target as HTMLElement).dataset.mistVisible = String(entry.isIntersecting);
      }
    }, { rootMargin: "100px" });
    sections.forEach(section => resize.observe(section));
    visibility.observe(root);
    sections.forEach(section => visibility.observe(section));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", onVisibilityChange);
    root.dataset.tabHidden = String(document.hidden);
    update();

    return () => {
      resize.disconnect();
      visibility.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return ref;
}
