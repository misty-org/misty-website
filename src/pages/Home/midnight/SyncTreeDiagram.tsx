import { useLayoutEffect, type CSSProperties, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { GlyphMark, LockIcon } from "./syncTreeIcons";
import { parts } from "./syncTreeInfo";
import {
  CHIP, bands, edgePath, labeled, place, routePath, vaultBox, viewBox,
  type Kind, type Layout, type Measure, type Placed, type Span,
} from "./syncTreeModel";
import { LOOP_SECONDS, flows, nodes, pulses, visibleDuring, type Flow } from "./syncTreeStory";

const dur = `${LOOP_SECONDS}s`;
const revealAt = (depth: number) => ({ "--at": depth * 0.1 }) as CSSProperties;

type Select = { selected: Kind; onSelect: (kind: Kind) => void };

/** Clickable parts of the tree: a button for each chip and band, so keyboards can reach them too. */
function selectable(kind: Kind, { selected, onSelect }: Select, label: string) {
  return {
    role: "button",
    tabIndex: 0,
    "aria-label": label,
    "aria-pressed": selected === kind,
    "data-active": selected === kind,
    onClick: () => onSelect(kind),
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onSelect(kind);
    },
  };
}
const nameOf = (kind: Kind) => parts.find(part => part.kind === kind)!.name;

/** Shows its children only during `spans`; always shown without them. */
function Timed({ spans, fade, children }: { spans?: readonly Span[]; fade?: number; children: ReactNode }) {
  if (!spans) return <>{children}</>;
  const { keyTimes, values } = visibleDuring(spans, fade);
  return (
    <g opacity={values.startsWith("1") ? 1 : 0}>
      <animate attributeName="opacity" dur={dur} repeatCount="indefinite" keyTimes={keyTimes} values={values} />
      {children}
    </g>
  );
}

function Pulse({ id, x, y, w, h }: { id: string; x: number; y: number; w: number; h: number }) {
  const spans = pulses.filter(pulse => pulse.id === id).map(pulse => pulse.span);
  return spans.length ? (
    <Timed spans={spans}>
      <rect className="mist-tree-pulse" x={x} y={y} width={w} height={h} rx={h / 2} />
    </Timed>
  ) : null;
}

/** Devices show an icon and name; tabs, panes and pages show their logo or icon, crossfading when the site changes. */
function Chip({ node, select }: { node: Placed; select: Select }) {
  const top = node.y - node.h / 2;
  const cx = node.x + node.w / 2;
  return (
    <g className="mist-tree-reveal" style={revealAt(node.depth)}>
      <g className="mist-tree-chip" data-kind={node.kind} {...selectable(node.kind, select, `${nameOf(node.kind)}: ${node.variants[0].label}`)}>
        <rect x={node.x} y={top} width={node.w} height={node.h} rx={node.h / 2} />
        <Pulse id={node.id} x={node.x} y={top} w={node.w} h={node.h} />
        {node.variants.map(variant => {
          if (!labeled(node.kind)) {
            return (
              <Timed key={variant.label} spans={variant.spans}>
                <GlyphMark glyph={variant.glyph} x={cx} y={node.y} size={CHIP.glyph} />
              </Timed>
            );
          }
          const left = node.x + CHIP.pad;
          return (
            <g key={variant.label}>
              <GlyphMark glyph={variant.glyph} x={left + CHIP.glyph / 2} y={node.y} size={CHIP.glyph - 2} />
              <text x={left + CHIP.glyph + CHIP.gap} y={node.y} dominantBaseline="central">{variant.label}</text>
            </g>
          );
        })}
      </g>
    </g>
  );
}

/** The vault breathes while it waits, and lights up as each change reaches it. */
function Vault({ box, select }: { box: ReturnType<typeof vaultBox>; select: Select }) {
  const top = box.y - box.h / 2;
  return (
    <g className="mist-tree-reveal" style={revealAt(0)}>
      <rect className="mist-tree-breath" x={box.x} y={top} width={box.w} height={box.h} rx={box.h / 2} />
      <g className="mist-tree-chip" data-kind="vault" {...selectable("vault", select, "Vault")}>
        <rect x={box.x} y={top} width={box.w} height={box.h} rx={box.h / 2} />
        <Pulse id="vault" x={box.x} y={top} w={box.w} h={box.h} />
        <LockIcon x={box.x + CHIP.pad + CHIP.glyph / 2} y={box.y} size={15} />
        <text x={box.x + CHIP.pad + CHIP.glyph + CHIP.gap} y={box.y} dominantBaseline="central">Vault</text>
      </g>
    </g>
  );
}

/** When a flow is visible; one that lands after the loop ends finishes at the start of the next. */
function visibleSpans(flow: Flow): Span[] {
  const to = flow.from + flow.duration;
  return to <= 1 ? [[flow.from, to]] : [[0, +(to - 1).toFixed(4)], [flow.from, 1]];
}

/** cubic-bezier(.4, 0, .2, 1): solve for the curve's x by bisection, then return its y. */
function ease(x: number) {
  let [low, high, t] = [0, 1, x];
  for (let i = 0; i < 14; i++) {
    t = (low + high) / 2;
    if (3 * (1 - t) ** 2 * t * 0.4 + 3 * (1 - t) * t * t * 0.2 + t ** 3 < x) low = t;
    else high = t;
  }
  return 3 * (1 - t) * t * t + t ** 3;
}

/** How far along its route a flow is at loop fraction `at`; while hidden it rests at the nearer end. */
function progress(flow: Flow, at: number) {
  const since = (at - flow.from + 1) % 1;
  if (since <= flow.duration) return ease(since / flow.duration);
  return since - flow.duration < 1 - since ? 1 : 0;
}

/** Points evenly spaced along a route, measured once instead of every frame. */
function sample(d: string, count = 48) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  const length = path.getTotalLength();
  return Array.from({ length: count + 1 }, (_, i) => path.getPointAtLength((length * i) / count));
}

function pointAt(points: DOMPoint[], amount: number) {
  const scaled = amount * (points.length - 1);
  const i = Math.min(points.length - 2, Math.floor(scaled));
  const [a, b, t] = [points[i], points[i + 1], scaled - i];
  return `translate(${(a.x + (b.x - a.x) * t).toFixed(1)}px, ${(a.y + (b.y - a.y) * t).toFixed(1)}px)`;
}

/** One loop of a flow as keyframes: it rests at its start, eases along the route, then rests at its end. */
function flight(flow: Flow, route: string) {
  const points = sample(route);
  // Rests last a little longer than the fades, so the dot only travels while it is visible.
  const rest = 1 / LOOP_SECONDS;
  const times = new Set([0, 1]);
  for (const time of [flow.from - rest, flow.from + flow.duration + rest]) times.add((time + 1) % 1);
  for (let step = 0; step <= 24; step++) times.add((flow.from + (flow.duration * step) / 24) % 1);
  const motion = [...times].sort((a, b) => a - b).map(offset => ({ offset, transform: pointAt(points, progress(flow, offset)) }));
  const { keyTimes, values } = visibleDuring(visibleSpans(flow));
  const opacities = values.split(";");
  const fades = keyTimes.split(";").map((time, i) => ({ offset: +time, opacity: +opacities[i] }));
  return { motion, fades };
}

/** A change in flight, with a label naming it. */
function FlowDot({ path, flow }: { path: string; flow: Flow }) {
  return (
    <div className="mist-tree-flight" data-route={path}>
      <span className="mist-tree-label">{flow.label}</span>
    </div>
  );
}

/** SMIL keeps running off screen; pause it when hidden. Reduced motion holds one moment still.
    Changes in flight are compositor animations on the SVG's clock, so moving them never repaints the tree. */
function useClock(ref: RefObject<SVGSVGElement | null>, still: boolean, routes: string) {
  useLayoutEffect(() => {
    const svg = ref.current;
    const overlay = svg?.nextElementSibling as HTMLElement | null;
    if (!svg || !overlay) return;
    const loop = LOOP_SECONDS * 1000;
    let animations: Animation[] = [];
    // Measured on first sight: forty routes are too many to sample for a tree nobody has scrolled to.
    const start = () => {
      if (!animations.length) {
        animations = Array.from(overlay.querySelectorAll<HTMLElement>("[data-route]"), (element, i) => {
          const { motion, fades } = flight(flows[i], element.dataset.route!);
          return [motion, fades].map(keyframes => element.animate(keyframes, { duration: loop, iterations: Infinity }));
        }).flat();
      }
      for (const animation of animations) animation.currentTime = (svg.getCurrentTime() * 1000) % loop;
    };
    // The overlay is laid out in the tree's own units and scaled to match it.
    const resize = new ResizeObserver(([entry]) => {
      overlay.style.setProperty("--mist-tree-scale", String(entry.contentRect.width / svg.viewBox.baseVal.width));
    });
    resize.observe(svg);
    svg.pauseAnimations();
    if (still) {
      svg.setCurrentTime(LOOP_SECONDS * 0.2);
      start();
      animations.forEach(animation => animation.pause());
      return () => resize.disconnect();
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        svg.unpauseAnimations();
        start();
        animations.forEach(animation => animation.play());
      } else {
        svg.pauseAnimations();
        animations.forEach(animation => animation.pause());
      }
    });
    observer.observe(svg);
    return () => {
      observer.disconnect();
      resize.disconnect();
      animations.forEach(animation => animation.cancel());
    };
  }, [ref, still, routes]);
}

export function SyncTreeDiagram({ layout, measure, svgRef, still, selected, onSelect }: Select & {
  layout: Layout; measure: Measure; svgRef: RefObject<SVGSVGElement | null>; still: boolean;
}) {
  const select = { selected, onSelect };
  const placed = place(layout, nodes, measure);
  const vault = vaultBox(layout, measure);
  const list = [...placed.values()];
  const routes = flows.map(flow => routePath(layout, placed, vault, flow.route));
  useClock(svgRef, still, routes.join("|"));
  return (
    <div className="mist-tree-stage" data-layout={layout}>
      <svg ref={svgRef} className="mist-tree-svg" viewBox={viewBox(layout)} role="group" aria-label="Sync tree">
        {bands(layout).map((band, index) => (
          <g key={band.key} className="mist-tree-reveal" style={revealAt(2 + (index % 4))}>
            <g className="mist-tree-band" {...selectable(band.level, select, band.label)}>
              <rect x={band.x} y={band.y} width={band.w} height={band.h} rx={12} />
              <text x={band.x + 12} y={band.y + band.h / 2} dominantBaseline="central">{band.label}</text>
            </g>
          </g>
        ))}
        {list.map(node => {
          const fromVault = node.parent === "vault";
          const d = edgePath(layout, fromVault ? vault : placed.get(node.parent)!, node, fromVault);
          return (
            <g key={node.id} className="mist-tree-reveal" style={revealAt(node.depth)} aria-hidden="true">
              <path className="mist-tree-edge" d={d} />
              <path className="mist-tree-current" d={d} />
            </g>
          );
        })}
        {list.map(node => <Chip key={node.id} node={node} select={select} />)}
        <Vault box={vault} select={select} />
      </svg>
      <div className="mist-tree-flows" aria-hidden="true">
        {flows.map((flow, i) => <FlowDot key={`${flow.route.join()}-${flow.from}`} path={routes[i]} flow={flow} />)}
      </div>
    </div>
  );
}
