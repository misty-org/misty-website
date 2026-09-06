import { type CSSProperties, useLayoutEffect, useRef } from "react";
import { productScreenshotSlots, type ProductScreenshotSlotId } from "@/content/productScreenshotSlots";

// Swap these slots to reuse the composition with other approved captures.
const screenshots: { slot: ProductScreenshotSlotId; zoom?: number; focus?: string }[] = [
  { slot: "home-dashboard" },
  { slot: "space-library" },
  { slot: "space-overview" },
  { slot: "home-dashboard", zoom: 1.8, focus: "80% 35%" },
  { slot: "space-library", zoom: 1.6, focus: "15% 35%" },
  { slot: "space-overview", zoom: 1.6, focus: "85% 75%" },
  { slot: "home-dashboard", zoom: 1.8, focus: "80% 80%" },
  { slot: "space-library", zoom: 1.6, focus: "80% 35%" },
];

// Stable jitter keeps resize and reverse scrolling from reshuffling the rain.
function random(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function WordRain() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const rain = ref.current!;
    const elements = Array.from(rain.querySelectorAll<HTMLElement>("[data-rain-item]"));
    let disposed = false;
    const layout = () => {
      if (disposed || !rain.clientWidth || !rain.clientHeight) return;
      // Measure rotated bounds independently of the current animation position.
      const bounds = elements.map(element => {
        const angle = parseFloat(element.style.getPropertyValue('--word-angle')) * Math.PI / 180;
        const c = Math.abs(Math.cos(angle)), s = Math.abs(Math.sin(angle));
        return {width: element.offsetWidth * c + element.offsetHeight * s,
          height: element.offsetWidth * s + element.offsetHeight * c};
      });
      const gap = rain.clientWidth < 768 ? 24 : 32;
      const tallest = Math.max(...bounds.map(rect => rect.height));
      const anchors = [0.08, 0.78, 0.46, 0.94, 0.22, 0.58, 0.02, 0.84];
      const positions: { x: number; y: number; width: number; height: number }[] = [];
      bounds.forEach(({ width, height }, index) => {
        const xRoom = Math.max(0, rain.clientWidth - width - 2 * gap);
        const fraction = Math.max(0, Math.min(1, anchors[index] + (random(index + 1) - 0.5) * 0.1));
        const x = index % 3 === 2 ? rain.clientWidth / 2 : gap + width / 2 + fraction * xRoom;
        let y = height / 2 + gap + index * 105 + random(index + 40) * 85;
        // Alternate across the entire canvas, including the center. Only push
        // a card down when its rotated bounds would overlap an earlier card.
        for (const previous of positions) {
          if (Math.abs(x - previous.x) < (width + previous.width) / 2 + gap) {
            y = Math.max(y, previous.y + (height + previous.height) / 2 + gap);
          }
        }
        positions.push({ x, y, width, height });
      });
      const travel = Math.max(
        ...positions.map(({ y, height }) => y + height / 2 + gap),
        rain.clientHeight + 2 * tallest + 2 * gap,
      );
      const speed = 26 * 1.15 * 0.65;
      // Start a central card behind the headline, rather than leaving visitors
      // waiting for the middle of the rainfall to become populated.
      const initialShift = rain.clientHeight / 2 + tallest + gap - positions[2].y;
      elements.forEach((element, index) => {
        const { x, y } = positions[index];
        const offset = ((y + initialShift) % travel + travel) % travel;
        element.style.setProperty("--word-x", `${x}px`);
        element.style.setProperty("--word-top", `${-tallest - gap}px`);
        element.style.setProperty("--word-travel", `${travel}px`);
        element.style.setProperty("--word-duration", `${travel / speed}s`);
        element.style.setProperty("--word-delay", `${-offset / speed}s`);
      });
      // A shared fall speed preserves the randomized spacing through the loop.
      rain.dataset.layoutReady = "true";
    };
    const observer = new ResizeObserver(layout);
    observer.observe(rain);
    elements.forEach(element => observer.observe(element));
    document.fonts.addEventListener("loadingdone", layout);
    void document.fonts.ready.then(layout);
    window.addEventListener("resize", layout);
    layout();
    return () => {
      disposed = true;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", layout);
      window.removeEventListener("resize", layout);
    };
  }, []);

  return <div ref={ref} className="foundation-word-rain" aria-hidden="true">
    {screenshots.map(({ slot, zoom = 1, focus = "center" }, index) => {
      const screenshot = productScreenshotSlots[slot];
      return <figure key={`${slot}-${index}`} data-rain-item="screenshot" className="foundation-rain-screenshot" style={{
        "--word-angle": `${(random(index + 120) - 0.5) * 16}deg`,
        "--screenshot-size": 0.92 + random(index + 160) * 0.16,
        aspectRatio: `${screenshot.width} / ${screenshot.height}`,
      } as CSSProperties}>
        <img src={screenshot.src} width={screenshot.width} height={screenshot.height} alt="" decoding="async"
          style={{ transform: `scale(calc(${zoom} * var(--rain-crop, 1)))`, transformOrigin: focus }} />
      </figure>;
    })}
  </div>;
}
