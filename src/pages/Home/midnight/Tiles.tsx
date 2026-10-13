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
export function Tile({ id, span, label, title, children }: { id?: string; label: string; span: 3 | 4 | 5 | 6 | 7 | 8 | 12; title: ReactNode; children: ReactNode }) {
  return (
    <article id={id} className="mist-tile" data-span={span} data-spotlight>
      <span className="mist-feature-label mist-tile-label">{label}</span>
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

/** Where the panels pin and follow scroll. Keep in sync with tiles.css. */
const PIN = "(min-width: 1000px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

/** Tiles grouped into rows: tiles that share a top edge, as indices, top to bottom. */
function groupRows(tiles: readonly Box[]): number[][] {
  const rows: number[][] = [];
  [...tiles.keys()].sort((a, b) => tiles[a].y - tiles[b].y).forEach(index => {
    const row = rows[rows.length - 1];
    if (row && Math.abs(tiles[row[0]].y - tiles[index].y) < 12) row.push(index); else rows.push([index]);
  });
  return rows;
}

/**
 * The pinned scene as a timeline of scroll, in screens (one screen is the window's height): every row is held
 * while the rope grows through its panels, and the grid glides to the next row only after that. The last row is held
 * a little longer. TileRoute moves the grid by it and RibbonCanvas pays the rope out by it, so the two always agree.
 */
const HOLD = .5, GLIDE = .35, LAST_EXTRA = .2;
/** How much of a hold the rope takes to grow through its row; it rests, fully drawn, for the remainder. */
const GROWN = .7;
type Part = { kind: "hold" | "glide"; row: number; start: number; end: number };
function scenePlan(rows: number): { parts: Part[]; total: number } {
  const parts: Part[] = [];
  let at = 0;
  for (let r = 0; r < rows; r++) {
    const hold = HOLD + (r === rows - 1 ? LAST_EXTRA : 0);
    parts.push({ kind: "hold", row: r, start: at, end: at + hold });
    at += hold;
    if (r < rows - 1) { parts.push({ kind: "glide", row: r, start: at, end: at + GLIDE }); at += GLIDE; }
  }
  return { parts, total: at };
}

const smoothstep = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };

/**
 * A rope snaking through every tile inside it, drawn on one canvas behind them. It stays inside the
 * tiles, turning within them and crossing only the gaps between neighbors.
 *
 * Where there is room, the panels are a pinned scene: the screen holds still on one row at a time, and
 * scrolling pays the rope out and slides the next row into the middle. Elsewhere the page scrolls normally
 * and the rope follows it.
 */
export function TileRoute({ route, children }: { route: readonly RouteStop[]; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{ w: number; h: number; tiles: Box[] } | null>(null);
  const [pinned, setPinned] = useState(false);
  // How far through the pinned scene the scroll is (0–1); the rope is paid out by it.
  const progress = useRef(0);
  useEffect(() => {
    const media = matchMedia(PIN);
    const sync = () => setPinned(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
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
  // Pinned: the rows (tiles sharing a top edge) take turns, following scenePlan: each is held while the rope grows
  // through it, then the grid glides to the next.
  useEffect(() => {
    const outer = track.current, scope = ref.current;
    if (!outer || !scope || !layout) return;
    if (!pinned) { scope.style.transform = ""; outer.style.removeProperty("--scene"); return; }
    const rows = groupRows(layout.tiles).map(row => row.map(index => layout.tiles[index]));
    const plan = scenePlan(rows.length);
    outer.style.setProperty("--scene", String(plan.total));
    let frame = 0;
    const update = () => {
      frame = 0;
      // The pin is the screen below the navbar, so the navbar never covers a panel and the first row starts right
      // at the top, with no gap under the interlude. The first row rests flush with the top; the others rest in the middle.
      const height = (outer.firstElementChild as HTMLElement).clientHeight;
      const rests = rows.map((row, r) => {
        const top = Math.min(...row.map(b => b.y)), bottom = Math.max(...row.map(b => b.y + b.h));
        return Math.min(Math.max(0, layout.h - height), r === 0 ? top : Math.max(0, (top + bottom) / 2 - height / 2));
      });
      const travel = Math.max(1, outer.offsetHeight - height);
      progress.current = Math.min(1, Math.max(0, -outer.getBoundingClientRect().top / travel));
      const time = progress.current * plan.total;
      const part = plan.parts.find(p => time <= p.end) ?? plan.parts[plan.parts.length - 1];
      const offset = part.kind === "hold" ? rests[part.row]
        : rests[part.row] + (rests[part.row + 1] - rests[part.row]) * smoothstep((time - part.start) / (part.end - part.start));
      scope.style.transform = `translate3d(0, ${-offset}px, 0)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [layout, pinned]);
  return (
    <div ref={track} className="mist-route-track" data-pinned={pinned || undefined}>
      <div className="mist-route-pin">
        <div ref={ref} className="mist-route-scope">
          {layout && layout.tiles.length > Math.max(...route.map(stop => stop.tile)) && <RibbonCanvas route={route} pinned={pinned} progress={progress} {...layout} />}
          {children}
        </div>
      </div>
    </div>
  );
}

/** "#rrggbb" or "#rgb" as numbers. */
function hexChannels(hex: string): [number, number, number] {
  let digits = hex.trim().replace("#", "");
  if (digits.length === 3) digits = [...digits].map(d => d + d).join("");
  return [0, 2, 4].map(i => parseInt(digits.slice(i, i + 2), 16) || 0) as [number, number, number];
}

function RibbonCanvas({ route, pinned, progress, w, h, tiles }: { route: readonly RouteStop[]; pinned: boolean; progress: { current: number }; w: number; h: number; tiles: Box[] }) {
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
    // The ribbon is clipped to the tiles and the gaps between neighbors, so no line can ever leave them.
    const room = new Path2D();
    for (const t of tiles) room.roundRect(t.x, t.y, t.w, t.h, 16);
    for (const a of tiles) for (const b of tiles) {
      const side = b.x - (a.x + a.w), top = Math.max(a.y, b.y), shared = Math.min(a.y + a.h, b.y + b.h) - top;
      if (side > 0 && side < 40 && shared > 0) room.rect(a.x + a.w, top, side, shared);
      const below = b.y - (a.y + a.h), left = Math.max(a.x, b.x), overlap = Math.min(a.x + a.w, b.x + b.w) - left;
      if (below > 0 && below < 40 && overlap > 0) room.rect(left, a.y + a.h, overlap, below);
    }
    // While the rope is in use (wide screens, motion allowed) the scope is marked, and panels the rope hasn't
    // reached yet are dimmed. Stacked layouts and reduced motion leave every panel lit.
    const scope = canvas.parentElement;
    const live = window.matchMedia("(min-width: 1001px) and (prefers-reduced-motion: no-preference)");
    const mark = () => { if (scope) { if (live.matches) scope.dataset.routed = ""; else delete scope.dataset.routed; } };
    mark();
    live.addEventListener("change", mark);
    // Each panel brightens as far as the rope goes: not at all before the rope reaches it, in step with the rope while
    // it runs through it, fully once the rope has passed; and it dims again as the rope is hauled back. --reach (0 to 1)
    // is what tiles.css turns into brightness.
    const panels = [...(canvas.parentElement?.querySelectorAll<HTMLElement>(".mist-tile") ?? [])];
    const through = tiles.map(box => {
      const hits = samples.flatMap((p, i) => (p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h ? [i] : []));
      return hits.length ? { from: hits[0], to: hits[hits.length - 1] } : null;
    });
    const shown: number[] = panels.map(() => -1);
    const light = (extent: number) => {
      const head = extent * (samples.length - 1);
      panels.forEach((panel, i) => {
        const span = through[i];
        const reach = span ? smoothstep((head - span.from) / Math.max(1, span.to - span.from)) : 0;
        if (Math.abs(reach - shown[i]) > .004 || (reach === 0) !== (shown[i] === 0)) { shown[i] = reach; panel.style.setProperty("--reach", reach.toFixed(3)); }
        // [data-lit] marks a panel the rope has reached at all; useTileActive reads it to wake the panel's animations and video.
        const lit = !!span && head >= span.from && !(pinned && progress.current <= 0.002);
        if (lit !== (panel.dataset.lit === "")) { if (lit) panel.dataset.lit = ""; else delete panel.dataset.lit; }
      });
    };
    const draw = (time: number, extent: number, turn: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.clip(room);
      drawRibbon(ctx, samples, palette(), time, extent, hexChannels(getComputedStyle(canvas).getPropertyValue("--ribbon-edge")), turn);
      ctx.restore();
      light(extent);
    };
    // Time only runs while the ribbon is on screen in a visible tab, so it resumes where it left off.
    let frame = 0, clock = 0, last = 0, onScreen = false;
    // The rope winds and unwinds with the page: its twists follow the scroll position, easing toward it.
    const target = () => window.scrollY * RIBBON.windPerPixel;
    let turn = target();
    // The rope is paid out as the page scrolls down and hauled back in as it scrolls up: it reaches as far
    // along the route as the middle of the screen has reached down the page. Above the first panel it is nothing at all.
    // Pinned, the rope is paid out by the same timeline as the grid (scenePlan): nothing at the start, growing through
    // each row's panels while that row is held, crossing to the next row only while the grid glides there (so a panel
    // lights as it arrives, not before), and all out at the end.
    const rows = groupRows(tiles);
    const inside = (p: { x: number; y: number }, box: Box) => p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h;
    const span = rows.map(row => {
      const hits = samples.flatMap((p, i) => (row.some(t => inside(p, tiles[t])) ? [i] : []));
      const last = samples.length - 1;
      return hits.length ? { enter: Math.min(last, hits[0] + 10) / last, exit: hits[hits.length - 1] / last } : { enter: 0, exit: 0 };
    });
    const keys: [number, number][] = [];
    if (rows.length > 1) {
      const plan = scenePlan(rows.length);
      for (const part of plan.parts) {
        const from = part.start / plan.total, to = part.end / plan.total;
        if (part.kind === "glide") {
          // Crossing to the next row only while the grid glides there.
          keys.push([from, span[part.row].exit], [to, span[part.row + 1].enter]);
        } else {
          // The rope grows through the row in the first part of its hold, and has fully ended before the grid moves on
          // (or the scene lets go of the page, after the last row), so the page never moves with the rope still drawing.
          const grown = from + (to - from) * GROWN;
          keys.push([from, part.row === 0 ? 0 : span[part.row].enter], [grown, part.row === rows.length - 1 ? 1 : span[part.row].exit], [to, part.row === rows.length - 1 ? 1 : span[part.row].exit]);
        }
      }
      keys.sort((a, b) => a[0] - b[0]);
      for (let k = keys.length - 1; k > 0; k--) if (keys[k][0] - keys[k - 1][0] < 1e-9) keys.splice(k, 1);
    }
    const scrolled = () => {
      const p = progress.current;
      for (let k = 1; k < keys.length; k++) {
        if (p <= keys[k][0]) return keys[k - 1][1] + (keys[k][1] - keys[k - 1][1]) * ((p - keys[k - 1][0]) / (keys[k][0] - keys[k - 1][0]));
      }
      return 1;
    };
    const reach = () => {
      if (pinned && keys.length) return scrolled();
      const edge = window.innerHeight * .6 - canvas.getBoundingClientRect().top;
      const index = samples.findIndex(sample => sample.y > edge);
      return index < 0 ? 1 : index / (samples.length - 1);
    };
    let out = reach();
    const tick = (now: number) => {
      if (last) {
        const dt = Math.min(.1, (now - last) / 1000);
        clock += dt;
        out += (reach() - out) * Math.min(1, dt * 5);
        turn += (target() - turn) * Math.min(1, dt * 7);
      }
      last = now;
      draw(clock, out, turn);
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (media.matches) draw(0, reach(), target());
      else if (onScreen && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const visibility = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); });
    visibility.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    // Redraw a still frame on theme switches while paused.
    const theme = new MutationObserver(() => { if (!frame) draw(clock, out, turn); });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    draw(clock, out, turn);
    return () => {
      visibility.disconnect();
      theme.disconnect();
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync);
      cancelAnimationFrame(frame);
      panels.forEach(panel => { panel.style.removeProperty("--reach"); delete panel.dataset.lit; });
      live.removeEventListener("change", mark);
      if (scope) delete scope.dataset.routed;
    };
  }, [route, pinned, progress, w, h, tiles]);
  return <canvas ref={ref} className="mist-tile-route" aria-hidden="true" style={{ width: w, height: h }} />;
}
