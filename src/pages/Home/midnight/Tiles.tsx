import { useEffect, useRef, useState, type ReactNode } from "react";
import { drawRibbon, RIBBON, sampleCenterline } from "./ribbon";
import "./tiles.css";

/**
 * Bento tiles for the Browser part of the story: a visual fills the top of each tile, cropped
 * wherever the tile ends, and one short sentence names the feature underneath.
 */
export function Tiles({ children }: { children: ReactNode }) {
  return <div className="mist-tiles" data-reveal-stagger>{children}</div>;
}

/** `span` is out of 12 columns on wide screens; tiles fall back to halves, then full width. */
export function Tile({ id, span, title, children }: { id?: string; span: 3 | 4 | 5 | 6 | 7 | 8 | 12; title: ReactNode; children: ReactNode }) {
  return (
    <article id={id} className="mist-tile" data-span={span} data-spotlight>
      <div className="mist-tile-visual">{children}</div>
      <h3>{title}</h3>
    </article>
  );
}

/**
 * One stop on a route through the tiles. `tile` counts every tile inside the route in page order,
 * `x`/`y` are fractions of that tile, and `dir` is the way the lines head as they pass.
 */
export type RouteStop = { tile: number; x: number; y: number; dir?: keyof typeof DIRS };

type Box = { x: number; y: number; w: number; h: number };
const DIRS = { right: [1, 0], down: [0, 1], left: [-1, 0], up: [0, -1] } as const;

/** Layout box of `el` relative to `scope`: offsets, not client rects, so reveal motion doesn't skew them. */
function boxWithin(el: HTMLElement, scope: HTMLElement): Box {
  let x = 0, y = 0;
  for (let node: HTMLElement | null = el; node && node !== scope; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft; y += node.offsetTop;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/**
 * A ribbon of fine lines snaking through every tile inside it, drawn on one canvas behind them.
 * It stays inside the tiles, turning within them and crossing only the gaps between neighbors.
 */
export function TileRoute({ route, children }: { route: readonly RouteStop[]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{ w: number; h: number; tiles: Box[] } | null>(null);
  useEffect(() => {
    const scope = ref.current;
    if (!scope) return;
    const measure = () => setLayout({
      w: scope.offsetWidth, h: scope.offsetHeight,
      tiles: [...scope.querySelectorAll<HTMLElement>(".mist-tile")].map(tile => boxWithin(tile, scope)),
    });
    const observer = new ResizeObserver(measure);
    observer.observe(scope);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="mist-route-scope">
      {layout && layout.tiles.length > Math.max(...route.map(stop => stop.tile)) && <RibbonCanvas route={route} {...layout} />}
      {children}
    </div>
  );
}

/** "#rrggbb" or "#rgb" as numbers. */
function hexChannels(hex: string): [number, number, number] {
  let digits = hex.trim().replace("#", "");
  if (digits.length === 3) digits = [...digits].map(d => d + d).join("");
  return [0, 2, 4].map(i => parseInt(digits.slice(i, i + 2), 16) || 0) as [number, number, number];
}

function RibbonCanvas({ route, w, h, tiles }: { route: readonly RouteStop[]; w: number; h: number; tiles: Box[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const samples = sampleCenterline(route.map(({ tile, x, y, dir = "right" }) => {
      const box = tiles[tile];
      const [dx, dy] = DIRS[dir];
      return { x: box.x + x * box.w, y: box.y + y * box.h, dx, dy };
    }));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    // The pastels come from the canvas's --ribbon-* colors, so they follow the theme.
    const palette = () => {
      const style = getComputedStyle(canvas);
      return ["--ribbon-1", "--ribbon-2", "--ribbon-3"].map(name => hexChannels(style.getPropertyValue(name)));
    };
    const draw = (time: number, reveal: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      drawRibbon(ctx, samples, palette(), time, reveal);
    };
    // Time only runs while the ribbon is on screen in a visible tab, so it resumes where it left off.
    let frame = 0, clock = 0, last = 0, revealed = 0, onScreen = false;
    const tick = (now: number) => {
      if (last) {
        const dt = Math.min(.1, (now - last) / 1000);
        clock += dt;
        revealed = Math.min(1, revealed + dt / RIBBON.drawIn);
      }
      last = now;
      draw(clock, revealed);
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (media.matches) draw(0, 1);
      else if (onScreen && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const visibility = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); });
    visibility.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    // Redraw a still frame on theme switches while paused.
    const theme = new MutationObserver(() => { if (!frame) draw(clock, media.matches ? 1 : revealed); });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    draw(clock, media.matches ? 1 : 0);
    return () => {
      visibility.disconnect();
      theme.disconnect();
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync);
      cancelAnimationFrame(frame);
    };
  }, [route, w, h, tiles]);
  return <canvas ref={ref} className="mist-tile-route" aria-hidden="true" style={{ width: w, height: h }} />;
}
