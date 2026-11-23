import { useEffect, useRef, useState, type ReactNode } from "react";
import { holdWheelToSteps, settleStep, STEP } from "./stepped_scroll";
import "./tiles.css";
import { Pressable } from "@misty/ui";

export type Shot = { src: string; alt: string; name: string; icon: ReactNode; sketch?: ReactNode };
export type Feature = { span: 3 | 4 | 5 | 6 | 7 | 8 | 12; title: string; sketch: ReactNode; shots: readonly Shot[] };

const PIN = "(min-width: 1000px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";

const ZOOM_MS = 700, SHOT_MS = 480;
const RADIUS = 16;

const clamp = (t: number) => Math.min(1, Math.max(0, t));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const ease = (t: number) => (t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function plan(features: readonly Feature[]) {
  const rests: number[] = [];
  let at = 0;
  for (const feature of features) {
    rests.push(at);
    at += feature.shots.length + 1;
  }
  return { rests, last: at };
}

type Place = { tile: number; shot: number };
function placeOf(step: number, rests: readonly number[], features: readonly Feature[]): Place {
  for (let tile = 0; tile < features.length; tile++) {
    const shot = step - rests[tile] - 1;
    if (shot >= 0 && shot < features[tile].shots.length) return { tile, shot };
  }
  return { tile: -1, shot: 0 };
}

type Zoom = { kind: "zoom"; tile: number; shot: number; from: number; to: number; start: number; duration: number };
type Slide = { kind: "shot"; tile: number; from: number; to: number; start: number; duration: number };
type Move = Zoom | Slide;

const progress = (move: Move, now: number) => clamp((now - move.start) / move.duration);
const openOf = (move: Zoom, now: number) => mix(move.from, move.to, progress(move, now));

function nextMove(at: Place, goal: Place, now: number): Move | null {
  if (at.tile < 0) {
    return goal.tile < 0 ? null : { kind: "zoom", tile: goal.tile, shot: goal.shot, from: 0, to: 1, start: now, duration: ZOOM_MS };
  }
  if (goal.tile !== at.tile) return { kind: "zoom", tile: at.tile, shot: at.shot, from: 1, to: 0, start: now, duration: ZOOM_MS };
  if (goal.shot !== at.shot) return { kind: "shot", tile: at.tile, from: at.shot, to: goal.shot, start: now, duration: SHOT_MS };
  return null;
}

function Tile({ feature }: { feature: Feature }) {
  return (
    <article className="mist-tile" data-span={feature.span}>
      <div className="mist-tile-visual">{feature.sketch}</div>
      <h3>{feature.title}</h3>
    </article>
  );
}

function Viewport({ feature, viewRef, onPick }: {
  feature: Feature; viewRef: (element: HTMLDivElement | null) => void; onPick: (shot: number) => void;
}) {
  const [failed, setFailed] = useState<ReadonlySet<string>>(new Set());
  return (
    <div ref={viewRef} className="mist-zoom-view">
      <div className="mist-zoom-head">
        <p className="mist-zoom-title" aria-hidden="true">{feature.title}</p>
        <div className="mist-zoom-tabs" role="group" aria-label="Screenshots">
          {feature.shots.map((shot, index) => (
            <Pressable key={shot.src} onClick={() => onPick(index)}>{shot.icon}{shot.name}</Pressable>
          ))}
        </div>
      </div>
      <div className="mist-zoom-media">
        {feature.shots.map(shot => (
          <figure key={shot.src} className="mist-zoom-shot">
            {failed.has(shot.src)
              ? shot.sketch
                ? <div className="mist-zoom-mock" aria-hidden="true">{shot.sketch}</div>
                : <div className="mist-zoom-sketch" aria-hidden="true">{feature.sketch}</div>
              : <img src={shot.src} alt={shot.alt} decoding="async" onError={() => setFailed(old => new Set(old).add(shot.src))} />}
          </figure>
        ))}
      </div>
    </div>
  );
}

type Box = { x: number; y: number; w: number; h: number };
const boxOf = (el: HTMLElement): Box => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });

export function BentoTiles({ features }: { features: readonly Feature[] }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const outline = useRef<HTMLDivElement>(null);
  const views = useRef<(HTMLDivElement | null)[]>([]);
  const jump = useRef<(tile: number, shot: number) => void>(() => {});
  const [pinned, setPinned] = useState(() => typeof matchMedia === "function" && matchMedia(PIN).matches);

  useEffect(() => {
    const media = matchMedia(PIN);
    const sync = () => setPinned(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const outer = track.current, room = stage.current, area = frame.current, bento = grid.current, edge = outline.current;
    if (!pinned || !outer || !room || !area || !bento || !edge) return;
    const { rests, last } = plan(features);
    outer.style.setProperty("--scene-px", `${(last + 1) * STEP}px`);
    const tiles = [...bento.querySelectorAll<HTMLElement>(":scope > .mist-tile")];

    let geometry: { grid: Box; tiles: Box[]; target: Box; pinTop: number } | null = null;
    const measure = () => ({
      grid: boxOf(bento), tiles: tiles.map(boxOf), target: { x: 0, y: 0, w: area.clientWidth, h: area.clientHeight },
      pinTop: parseFloat(getComputedStyle(room).top) || 0,
    });

    let wantedStep = -1;
    const wanted = () => {
      geometry ??= measure();
      const raw = (geometry.pinTop - outer.getBoundingClientRect().top) / STEP;
      wantedStep = settleStep(raw, wantedStep, last);
      return placeOf(wantedStep, rests, features);
    };

    let at: Place = { tile: -1, shot: 0 }, move: Move | null = null;
    let raf = 0, clip = "", outlined = "", shownTile = -2, shownState = "", picked = "";

    const render = (now: number) => {
      geometry ??= measure();
      const tile = move ? move.tile : at.tile;
      const open = move?.kind === "zoom" ? openOf(move, now) : tile >= 0 ? 1 : 0;
      const zoom = ease(open);

      let edges: { top: number; right: number; bottom: number; left: number } | null = null;
      if (tile >= 0) {
        const box = geometry.tiles[tile], target = geometry.target, origin = geometry.grid;
        const x0 = mix(origin.x + box.x, 0, zoom), y0 = mix(origin.y + box.y, 0, zoom);
        const w = mix(box.w, target.w, zoom), h = mix(box.h, target.h, zoom);
        edges = { top: y0, left: x0, right: target.w - x0 - w, bottom: target.h - y0 - h };
      }
      const busy = tile >= 0;
      if (busy !== bento.hasAttribute("data-busy")) bento.toggleAttribute("data-busy", busy);

      const surface = smooth(clamp(open / .3)), content = smooth(clamp((open - .6) / .4));
      const shown = tile >= 0 && open > 0;

      let nextOutline = "";
      if (edges && shown) {
        const { w, h } = geometry.target;
        nextOutline = [edges.left, edges.top, w - edges.left - edges.right, h - edges.top - edges.bottom].map(n => n.toFixed(2)).join(",");
      }
      if (nextOutline !== outlined) {
        outlined = nextOutline;
        edge.toggleAttribute("data-shown", !!nextOutline);
        if (nextOutline) {
          const [x, y, w, h] = nextOutline.split(",");
          edge.style.transform = `translate(${x}px, ${y}px)`;
          edge.style.width = `${w}px`;
          edge.style.height = `${h}px`;
        } else edge.style.opacity = "";
      }
      if (nextOutline) edge.style.opacity = String(surface);

      const state = `${shown}:${!move}`;
      if (tile !== shownTile || state !== shownState) {
        views.current.forEach((view, index) => {
          view?.toggleAttribute("data-shown", shown && index === tile);
          view?.toggleAttribute("data-expanded", shown && !move && index === tile);
          if (view && !(shown && index === tile)) {
            view.style.opacity = "";
            view.style.clipPath = "";
            view.style.removeProperty("--content");
          }
        });
        shownTile = tile;
        shownState = state;
        clip = "?";
      }
      const view = shown ? views.current[tile] : null;
      if (!view || !edges) return;
      const px = (n: number) => `${n.toFixed(2)}px`;
      const nextClip = zoom >= 1 ? ""
        : `inset(${px(edges.top)} ${px(edges.right)} ${px(edges.bottom)} ${px(edges.left)} round ${RADIUS}px)`;
      if (nextClip !== clip) view.style.clipPath = clip = nextClip;
      view.style.opacity = String(surface);
      view.style.setProperty("--content", content.toFixed(4));

      const sliding = move?.kind === "shot" ? move : null;
      const current = sliding ? sliding.to : move?.kind === "zoom" ? move.shot : at.shot;
      const top = sliding ? Math.max(sliding.from, sliding.to) : -1, under = sliding ? Math.min(sliding.from, sliding.to) : -1;
      const p = sliding ? ease(progress(sliding, now)) : 1;
      const covered = !sliding || sliding.to > sliding.from ? p : 1 - p;
      view.querySelectorAll<HTMLElement>(".mist-zoom-shot").forEach((shot, index) => {
        if (index === top) {
          shot.style.opacity = "1";
          shot.style.transform = `translateY(${((1 - covered) * 100).toFixed(2)}%)`;
        } else if (index === under) {
          shot.style.opacity = "1";
          shot.style.transform = `scale(${(1 - covered * .04).toFixed(4)})`;
        } else {
          shot.style.opacity = !sliding && index === current ? "1" : "0";
          shot.style.transform = "";
        }
      });
      const tab = `${tile}:${current}`;
      if (tab !== picked) {
        picked = tab;
        view.querySelectorAll<HTMLButtonElement>(".mist-zoom-tabs button").forEach((button, index) => {
          button.toggleAttribute("data-active", index === current);
          button.setAttribute("aria-pressed", String(index === current));
        });
      }
    };

    const tick = (now: number) => {
      raf = 0;
      const goal = wanted();
      if (move?.kind === "zoom" && (move.to === 1) !== (goal.tile === move.tile)) {
        const open = openOf(move, now), to = goal.tile === move.tile ? 1 : 0;
        move = { ...move, from: open, to, start: now, duration: Math.max(1, ZOOM_MS * Math.abs(to - open)) };
      }
      if (move && progress(move, now) >= 1) {
        at = move.kind === "shot" ? { tile: move.tile, shot: move.to }
          : move.to === 1 ? { tile: move.tile, shot: move.shot } : { tile: -1, shot: move.shot };
        move = null;
      }
      move ??= nextMove(at, goal, now);
      render(now);
      if (move) raf = requestAnimationFrame(tick);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const resized = () => { geometry = null; schedule(); };

    jump.current = (tile, shot) => {
      geometry ??= measure();
      const top = outer.getBoundingClientRect().top + scrollY - geometry.pinTop + (rests[tile] + 1 + shot) * STEP;
      scrollTo({ top, behavior: "smooth" });
    };

    at = wanted();
    render(performance.now());

    const releaseWheel = holdWheelToSteps(() => {
      geometry ??= measure();
      return outer.getBoundingClientRect().top + scrollY - geometry.pinTop;
    }, last);

    const observer = new ResizeObserver(resized);
    observer.observe(room);
    addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      removeEventListener("scroll", schedule);
      releaseWheel();
      outer.style.removeProperty("--scene-px");
      edge.removeAttribute("data-shown");
      bento.removeAttribute("data-busy");
      jump.current = () => {};
    };
  }, [pinned, features]);

  return (
    <div ref={track} className="mist-zoom-track" data-pinned={pinned || undefined} data-step={STEP}>
      <div ref={stage} className="mist-zoom-stage">
        <div ref={frame} className="mist-zoom-frame">
          <div ref={grid} className="mist-tiles" data-reveal-stagger>
            {features.map(feature => <Tile key={feature.title} feature={feature} />)}
          </div>
          {pinned && features.map((feature, index) => (
            <Viewport key={feature.title} feature={feature} viewRef={element => { views.current[index] = element; }}
              onPick={shot => jump.current(index, shot)} />
          ))}
          <div ref={outline} className="mist-zoom-outline" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
