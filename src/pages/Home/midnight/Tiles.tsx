import { useEffect, useRef, useState, type ReactNode } from "react";
import "./tiles.css";

/**
 * Bento tiles for Misty's main features: a sketch fills the top of each tile and one short sentence
 * names the feature underneath.
 *
 * Where there is room, the bento is a pinned scroll scene that moves in steps. It holds still under the navbar
 * while the page scrolls on, and each scroll moves it one step, one tile at a time:
 *   1. Zoom in: the tile's card expands, in one motion, from the tile's own place out to the bento's own area (the
 *      outer edges of all its tiles), and becomes the tile's viewport there. The empty card fades in over the tile
 *      as it starts to grow, and its content fades and rises in once it is nearly full size, so the two never
 *      shimmer over each other. Nothing else moves: the tiles stay where they are and the growing card covers them,
 *      and the card keeps one full border with rounded corners the whole way (an outline that follows it).
 *   2. Screenshots: each further step brings in the next screenshot, sliding up from the bottom edge over the last
 *      like a stack of cards.
 *   3. Zoom out: the next step shrinks the card back into the tile's place, exactly the zoom in reversed, and the one
 *      after expands the next tile.
 *
 * One scroll gesture moves one step. A wheel spin or a trackpad swipe, momentum and all, counts as one gesture:
 * inside the scene its first event moves the page exactly one step (STEP pixels) and the rest of it is swallowed,
 * so a big swipe can't run past several steps. Scrolling into the scene stops at its first step (or its last,
 * coming back up), and at either end the next gesture scrolls the page on as usual. Everything else (the
 * scrollbar, the keyboard) scrolls natively.
 * What counts is how often gestures come, not how fast each one is. Gestures at about the pace of the animations
 * step as above. Gestures coming much faster than that (RUSH_GESTURES within RUSH_MS) mean you want to get
 * somewhere: the scene stops holding the scroll, the page scrolls freely either way, and the scene shows wherever
 * you are as you pass. Once the scrolling pauses (RUSH_RELEASE_MS), stepping picks up again from there.
 * The scroll position then says which step you want. What you see
 * never follows the scroll's speed: every move is a timed animation of a fixed length (ZOOM_MS, SHOT_MS), played
 * one at a time. So a slow scroll, a fast flick and a jerky trackpad all look the same:
 *   - A jump past several screenshots of one tile (the scrollbar, a tab) goes straight there in one move.
 *   - A jump into another tile is always exactly one zoom out and one zoom in; tiles in between are skipped.
 *   - Scrolling back mid-zoom reverses the zoom from where it is, at the same speed.
 *   - A step only changes once the scroll is well into the next one (HYSTERESIS), so a wheel resting on a
 *     boundary never flickers between two.
 * The card is a full-size panel clipped to its box (nothing is resized or re-laid out), and layout is measured only on resize, never
 * while scrolling. The tabs in an open tile scroll the page to the screenshot they name.
 * Elsewhere (narrow or short screens, reduced motion) the tiles stay put.
 */

/**
 * A screenshot shown while a tile is open, with a named tab and its own icon. `sketch` is drawn in its place until
 * the image file exists (or if it fails to load); without one, the tile's own sketch stands in.
 */
export type Shot = { src: string; alt: string; name: string; icon: ReactNode; sketch?: ReactNode };
export type Feature = { span: 3 | 4 | 5 | 6 | 7 | 8 | 12; title: string; sketch: ReactNode; shots: readonly Shot[] };

/** Where the scene pins. Keep in sync with tiles.css. */
const PIN = "(min-width: 1000px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";

/**
 * Pixels of scroll per step, about one wheel notch. The scene's steps are: the whole bento, then for each tile one
 * step per screenshot (the first one zooms in), then the whole bento again (zooming out). Four tiles with 14
 * screenshots make 19 steps, under three screens of scroll.
 */
const STEP = 140;
/**
 * Wheel events closer together than this (ms) belong to one gesture, unless they turn around or a fresh swipe
 * starts during the last one's momentum (its deltas grow again after dying down).
 */
const GESTURE_GAP = 160;
/**
 * Rushing: this many gestures starting within RUSH_MS lets the page scroll freely, until no wheel event has come
 * for RUSH_RELEASE_MS. A zoom takes ZOOM_MS, so three gestures in 1.1s is well ahead of what the scene can show.
 */
const RUSH_GESTURES = 3, RUSH_MS = 1100, RUSH_RELEASE_MS = 350;
/** How far into the next step (in steps) the scroll must be before the wanted step changes, either way. */
const HYSTERESIS = .6;
/** How long a full zoom in or out takes, and how long one screenshot takes to slide over another, in ms. */
const ZOOM_MS = 700, SHOT_MS = 480;
/** The tiles' corner radius, in px (tiles.css), which the viewport's edges keep in step with as it zooms. */
const RADIUS = 16;

const clamp = (t: number) => Math.min(1, Math.max(0, t));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** A soft ease for fades: starts and ends gently. */
const smooth = (t: number) => t * t * (3 - 2 * t);
/** The ease every move uses: starts gently, moves steadily, settles gently. */
const ease = (t: number) => (t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** The step at which each tile's run begins (the whole bento, just before it zooms in), and the last step. */
function plan(features: readonly Feature[]) {
  const rests: number[] = [];
  let at = 0;
  for (const feature of features) {
    rests.push(at);
    at += feature.shots.length + 1;
  }
  return { rests, last: at };
}

/** What a step shows: a tile open on one of its screenshots, or the whole bento (tile −1). */
type Place = { tile: number; shot: number };
function placeOf(step: number, rests: readonly number[], features: readonly Feature[]): Place {
  for (let tile = 0; tile < features.length; tile++) {
    const shot = step - rests[tile] - 1;
    if (shot >= 0 && shot < features[tile].shots.length) return { tile, shot };
  }
  return { tile: -1, shot: 0 };
}

/**
 * A move in progress: a zoom into or out of a tile (`to` 1 or 0; `from` and `to` measure how far in it is, linearly
 * in time, before easing), or one screenshot sliding over another.
 */
type Zoom = { kind: "zoom"; tile: number; shot: number; from: number; to: number; start: number; duration: number };
type Slide = { kind: "shot"; tile: number; from: number; to: number; start: number; duration: number };
type Move = Zoom | Slide;

const progress = (move: Move, now: number) => clamp((now - move.start) / move.duration);
const openOf = (move: Zoom, now: number) => mix(move.from, move.to, progress(move, now));

/** The next move from where the scene has settled toward the wanted place, or null once it is there. */
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

/**
 * A tile as its own viewport: its sentence and tabs on top, its screenshots below, bleeding off the bottom edge.
 * BentoTiles shows it over the zoomed-in tile and steps through its screenshots. A screenshot that fails to load
 * shows the tile's sketch in its place.
 */
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
            <button key={shot.src} type="button" onClick={() => onPick(index)}>{shot.icon}{shot.name}</button>
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
/** `el`'s layout box inside its offset parent. Transforms don't move it, so the zoom never skews the numbers. */
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
    // Room for every step, plus one more so the whole bento rests a moment before the page moves on.
    outer.style.setProperty("--scene-px", `${(last + 1) * STEP}px`);
    const tiles = [...bento.querySelectorAll<HTMLElement>(":scope > .mist-tile")];

    // Layout, read once and again after any resize: the grid in its frame, each tile in the grid, the area an open
    // tile fills (the frame itself: exactly the bento's size, clipping anything the zoom pushes past), and where the
    // stage sticks, since the scene starts once the stage pins there.
    let geometry: { grid: Box; tiles: Box[]; target: Box; pinTop: number } | null = null;
    const measure = () => ({
      grid: boxOf(bento), tiles: tiles.map(boxOf), target: { x: 0, y: 0, w: area.clientWidth, h: area.clientHeight },
      pinTop: parseFloat(getComputedStyle(room).top) || 0,
    });

    // The step the scroll asks for. It moves on only once the scroll is HYSTERESIS into another step.
    let wantedStep = -1;
    const wanted = () => {
      geometry ??= measure();
      const raw = (geometry.pinTop - outer.getBoundingClientRect().top) / STEP;
      if (wantedStep < 0 || Math.abs(raw - wantedStep) > HYSTERESIS) wantedStep = Math.min(last, Math.max(0, Math.round(raw)));
      return placeOf(wantedStep, rests, features);
    };

    let at: Place = { tile: -1, shot: 0 }, move: Move | null = null;
    let raf = 0, clip = "", outlined = "", shownTile = -2, shownState = "", picked = "";

    /** Draws the scene as it stands at `now`: the card's box, which viewport shows, and its screenshots. */
    const render = (now: number) => {
      geometry ??= measure();
      const tile = move ? move.tile : at.tile;
      const open = move?.kind === "zoom" ? openOf(move, now) : tile >= 0 ? 1 : 0;
      const zoom = ease(open);

      // The card's box: from the tile's own place in the frame to the whole frame. Only the box moves; every tile
      // stays exactly where it is.
      let edges: { top: number; right: number; bottom: number; left: number } | null = null;
      if (tile >= 0) {
        const box = geometry.tiles[tile], target = geometry.target, origin = geometry.grid;
        const x0 = mix(origin.x + box.x, 0, zoom), y0 = mix(origin.y + box.y, 0, zoom);
        const w = mix(box.w, target.w, zoom), h = mix(box.h, target.h, zoom);
        edges = { top: y0, left: x0, right: target.w - x0 - w, bottom: target.h - y0 - h };
      }
      // While any tile is expanding or open the tiles ignore the pointer, so nothing hovers under the card.
      const busy = tile >= 0;
      if (busy !== bento.hasAttribute("data-busy")) bento.toggleAttribute("data-busy", busy);

      // Two fades on the move's own clock (linear time, each smoothed), so the card and its content never shimmer
      // over each other. Opening: the empty card fades in over the tile in the first 30% as it starts to grow, and
      // its content fades and rises in over the last 40%, once the card is nearly full size. Closing runs it all
      // backwards: content out first, then the empty card shrinks onto the tile and fades.
      const surface = smooth(clamp(open / .3)), content = smooth(clamp((open - .6) / .4));
      const shown = tile >= 0 && open > 0;

      // The outline is the card's one border, with the tiles' corners, on the card's box the whole time the card is
      // up, fading with it. (The card's own border stays transparent, so no two borders ever stack or hand over.)
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

      // The viewport is the card: cut to its box with the tiles' corners, so it grows from the tile and lands exactly
      // on the frame. It takes clicks once all is still.
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
        clip = "?"; // unknown, so the next clip is always written
      }
      const view = shown ? views.current[tile] : null;
      if (!view || !edges) return;
      const px = (n: number) => `${n.toFixed(2)}px`;
      const nextClip = zoom >= 1 ? ""
        : `inset(${px(edges.top)} ${px(edges.right)} ${px(edges.bottom)} ${px(edges.left)} round ${RADIUS}px)`;
      if (nextClip !== clip) view.style.clipPath = clip = nextClip;
      view.style.opacity = String(surface);
      view.style.setProperty("--content", content.toFixed(4));

      // Screenshots: settled, only the current one shows. Moving, the later of the two sits on top and slides (up
      // from the bottom edge going forward, back down going back) while the earlier one eases back a little beneath
      // it. Both are opaque, so the two never show through each other. Every other screenshot is hidden.
      const sliding = move?.kind === "shot" ? move : null;
      const current = sliding ? sliding.to : move?.kind === "zoom" ? move.shot : at.shot;
      const top = sliding ? Math.max(sliding.from, sliding.to) : -1, under = sliding ? Math.min(sliding.from, sliding.to) : -1;
      const p = sliding ? ease(progress(sliding, now)) : 1;
      // How far the top screenshot covers the one under it: rising going forward, falling going back.
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
      // The tab names where the move is headed, right away.
      const tab = `${tile}:${current}`;
      if (tab !== picked) {
        picked = tab;
        view.querySelectorAll<HTMLButtonElement>(".mist-zoom-tabs button").forEach((button, index) => {
          button.toggleAttribute("data-active", index === current);
          button.setAttribute("aria-pressed", String(index === current));
        });
      }
    };

    // Each frame: turn a zoom around if the wanted place no longer lies that way, finish a move whose time is up,
    // start the next one toward the wanted place, and draw. Runs only while something is moving.
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

    // A tab scrolls the page to its screenshot's step, smoothly; the scene goes there in one move.
    jump.current = (tile, shot) => {
      geometry ??= measure();
      const top = outer.getBoundingClientRect().top + scrollY - geometry.pinTop + (rests[tile] + 1 + shot) * STEP;
      scrollTo({ top, behavior: "smooth" });
    };

    // Arriving mid-scene (a reload, a link), start settled where the scroll is, without playing anything.
    at = wanted();
    render(performance.now());

    // One step per gesture (see the top of this file). `held` marks a gesture that already moved a step: the rest
    // of it, momentum included, is swallowed. A gesture is the run of wheel events less than GESTURE_GAP apart in
    // one direction; a new swipe during momentum shows as deltas growing again after they had died down to half.
    // While `rushing`, the wheel is left alone entirely; `starts` holds when recent gestures began.
    let lastAt = -Infinity, direction = 0, peak = 0, low = 0, held = false, rushing = false, starts: number[] = [];
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      geometry ??= measure();
      const size = Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      const dir = Math.sign(event.deltaY);
      const now = event.timeStamp, gap = now - lastAt;
      // A pause ends rushing and forgets the gestures before it.
      if (gap > RUSH_RELEASE_MS) { rushing = false; starts = []; }
      const resumed = low < peak * .5 && size > low * 2 && size > 8;
      if (gap > GESTURE_GAP || dir !== direction || resumed) {
        held = false;
        peak = low = size;
        starts = [...starts.filter(start => now - start < RUSH_MS), now];
        if (starts.length >= RUSH_GESTURES) rushing = true;
      } else if (size > peak) peak = low = size;
      else low = Math.min(low, size);
      lastAt = now;
      direction = dir;
      if (rushing) return;
      if (held) { event.preventDefault(); return; }

      // Where step 0 sits on the page, and how many steps into the scene the page is now (fractional).
      const origin = outer.getBoundingClientRect().top + scrollY - geometry.pinTop;
      const at = (scrollY - origin) / STEP, ahead = at + (dir * size) / STEP;
      const go = (step: number) => {
        event.preventDefault();
        held = true;
        scrollTo({ top: origin + step * STEP, behavior: "instant" });
      };
      if (at < -.01) { if (dir > 0 && ahead > 0) go(0); return; } // above the scene: stop on its first step
      if (at > last + .01) { if (dir < 0 && ahead < last) go(last); return; } // below it: stop on its last
      if ((dir > 0 && at >= last - .01) || (dir < 0 && at <= .01)) return; // at an end, heading out: let it go
      go(Math.min(last, Math.max(0, Math.round(at) + dir)));
    };

    const observer = new ResizeObserver(resized);
    observer.observe(room);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("wheel", onWheel);
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
