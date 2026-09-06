import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { workspaceShowcase } from "@/content/workspaceShowcase";
import { useReveal } from "@/hooks/useReveal";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/utils";
import { ScrollSceneIntro } from "../components/ScrollSceneIntro";
import { chapterSequence } from "../scrollMotion";

type ShowcaseMoment = (typeof workspaceShowcase)[number];
type ShowcaseCard = ShowcaseMoment;

type Point = { x: number; y: number };
type RouteFrame = {
  dashLength: number;
  dashOffset: number;
  marker: Point;
};

const SCENE_WIDTH = 1200;
const SCENE_HEIGHT = 1000;
const PANEL_LEFT = 42;
const PANEL_RIGHT = 1158;
const FIRST_PANEL_TOP = 70;
const FIRST_PANEL_MIDDLE = 157.5;
const LAST_PANEL_BOTTOM = 685;
const ROUTE_START = { x: PANEL_LEFT, y: FIRST_PANEL_MIDDLE };
const ROW_TURNS = [267.5, 487.5] as const;

/* The SVG stretches to a tall scene, so x/y radii are calculated separately
 * to keep every rendered bend circular instead of vertically distorted. */
function buildBentoRoute(radiusX: number, radiusY: number) {
  const topRail = FIRST_PANEL_TOP - radiusY;
  const leftRail = PANEL_LEFT - radiusX;
  const rightRail = PANEL_RIGHT + radiusX;
  const [firstTurn, secondTurn] = ROW_TURNS;
  // Cross the straight side of the panel, above its rounded bottom corner.
  const finishY = LAST_PANEL_BOTTOM - radiusY * (24 / 32);

  return [
    `M ${ROUTE_START.x} ${ROUTE_START.y}`,
    `Q ${leftRail} ${ROUTE_START.y} ${leftRail} ${ROUTE_START.y - radiusY}`,
    `L ${leftRail} ${topRail + radiusY}`,
    `Q ${leftRail} ${topRail} ${PANEL_LEFT} ${topRail}`,
    `L ${PANEL_RIGHT} ${topRail}`,
    `Q ${rightRail} ${topRail} ${rightRail} ${FIRST_PANEL_TOP}`,
    `L ${rightRail} ${firstTurn - radiusY}`,
    `Q ${rightRail} ${firstTurn} ${PANEL_RIGHT} ${firstTurn}`,
    `L ${PANEL_LEFT} ${firstTurn}`,
    `Q ${leftRail} ${firstTurn} ${leftRail} ${firstTurn + radiusY}`,
    `L ${leftRail} ${secondTurn - radiusY}`,
    `Q ${leftRail} ${secondTurn} ${PANEL_LEFT} ${secondTurn}`,
    `L ${PANEL_RIGHT} ${secondTurn}`,
    `Q ${rightRail} ${secondTurn} ${rightRail} ${secondTurn + radiusY}`,
    `L ${rightRail} ${finishY - radiusY}`,
    `Q ${rightRail} ${finishY} ${PANEL_RIGHT} ${finishY}`,

  ].join(" ");
}

/*
 * Every card resolves through the shared screenshot inventory. Missing
 * captures stay as responsive DOM previews until the matching file is added.
 */
const cards = workspaceShowcase;

function activeCardAt(progress: number) {
  const checkpoints = [0.16, 0.32, 0.5, 0.66, 0.84];
  const nextCheckpoint = checkpoints.findIndex(
    (checkpoint) => progress < checkpoint,
  );
  return nextCheckpoint === -1 ? cards.length - 1 : nextCheckpoint;
}

function ShowcaseVisual({ moment }: { moment: ShowcaseMoment }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="feature-bento-preview relative h-full min-h-0 overflow-hidden rounded-lg border border-dashed border-[var(--marketing-border-strong)]" data-screenshot-filename={moment.screenshot}>
      <img src={moment.screenshot} alt={moment.captureBrief} loading="lazy"
        onLoad={() => setLoaded(true)} onError={() => setLoaded(false)}
        className={cn("absolute inset-0 h-full w-full object-contain", !loaded && "invisible")} />
      {!loaded && <div className="flex h-full items-center justify-center p-6 text-center">
        <span className="text-sm text-[var(--marketing-muted)]">{moment.title}</span>
      </div>}
    </div>
  );
}

function ShowcaseCard({
  card,
  active,
  mobileActive,
}: {
  card: ShowcaseCard;
  active: boolean;
  mobileActive: boolean;
}) {
  const revealRef = useReveal<HTMLElement>(0.15);
  return (
    <article
      ref={revealRef}
      data-bento-card
      data-active={active}
      data-mobile-active={mobileActive}
      className={cn(
        "feature-bento-card feature-logo-card mobile-card-reveal z-10 flex min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-surface)]",
        card.sceneClassName,
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="feature-bento-card-copy px-5 pt-5 sm:px-6 sm:pt-6">
          <h3 className="text-lg font-medium tracking-[-0.025em] text-[var(--marketing-foreground)] sm:text-xl">
            {card.title}
          </h3>

        </div>
        <div className="feature-bento-card-media mt-4 flex min-h-0 flex-1 flex-col px-4 pb-4 sm:px-5 sm:pb-5">
          <ShowcaseVisual moment={card} />
        </div>
      </div>
    </article>
  );
}

function MistyProgressScene({ progress }: { progress: number }) {
  const { ref: sceneRef, progress: mobileProgress } = useScrollProgress<HTMLDivElement>({ start: "center" });
  const pathRef = useRef<SVGPathElement>(null);
  const [route, setRoute] = useState(() => buildBentoRoute(30, 30));
  const [routeFrame, setRouteFrame] = useState<RouteFrame>({
    dashLength: 1,
    dashOffset: 1,
    marker: ROUTE_START,
  });
  const [cameraSize, setCameraSize] = useState({ scene: 0, viewport: 0 });
  const activeCard = activeCardAt(progress);
  const [mobileActiveCard, setMobileActiveCard] = useState(0);
  useLayoutEffect(() => {
    const panels = sceneRef.current?.querySelectorAll<HTMLElement>("[data-bento-card]");
    if (!panels?.length) return;
    let closest = 0;
    let distance = Infinity;
    panels.forEach((panel, index) => {
      const rect = panel.getBoundingClientRect();
      const nextDistance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
      if (nextDistance < distance) { closest = index; distance = nextDistance; }
    });
    setMobileActiveCard(closest);
  }, [mobileProgress]);
  // Frame each pair, rather than centering the cloud on the rail above it.
  const rowCenters = [0.1575, 0.3775, 0.5975];
  const rowTransitions = [[245, ROW_TURNS[0]], [465, ROW_TURNS[1]]];
  const offsets = rowCenters.map((center, row) => row === 0 ? 0 :
    Math.min(0, cameraSize.viewport * 0.5 + 36 - cameraSize.scene * center));
  let cameraY = 0;
  // Complete each pan when the cloud reaches the next horizontal rail.
  // Keep the incoming row centered throughout the horizontal crossing.
  rowTransitions.forEach(([start, end], row) => {
    const t = Math.min(1, Math.max(0, (routeFrame.marker.y - start) / (end - start)));
    const eased = t * t * (3 - 2 * t);
    cameraY += (offsets[row + 1] - offsets[row]) * eased;
  });
  // Use the same circular bends for the rail and the marker's travel.
  const mobileHeight = Math.max(96, cameraSize.scene);
  const bendLength = 24 * Math.PI / 2;
  const straightLength = mobileHeight - 96;
  const distance = mobileProgress * (2 * bendLength + straightLength);
  let mobileX = 0;
  let mobileY = 48 + distance - bendLength;
  if (distance < bendLength) {
    const angle = -Math.PI / 2 - distance / 24;
    mobileX = 24 + 24 * Math.cos(angle);
    mobileY = 48 + 24 * Math.sin(angle);
  } else if (distance > bendLength + straightLength) {
    const angle = Math.PI - (distance - bendLength - straightLength) / 24;
    mobileX = 24 + 24 * Math.cos(angle);
    mobileY = mobileHeight - 48 + 24 * Math.sin(angle);
  }
  const mobileRoute = `M 24 24 A 24 24 0 0 0 0 48 L 0 ${mobileHeight - 48} A 24 24 0 0 0 24 ${mobileHeight - 24}`;
  const sceneStyle = {
    "--feature-camera-y": `${cameraY}px`,
    "--mobile-marker-x": `${mobileX}px`,
    "--mobile-marker-y": `${mobileY}px`,
  } as CSSProperties;

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const updateRoute = () => {
      const rect = scene.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      setCameraSize({ scene: rect.height, viewport: scene.closest(".feature-bento-stage")?.clientHeight ?? window.innerHeight });

      const radius = 32;
      const radiusX = radius / (rect.width / SCENE_WIDTH);
      const radiusY = radius / (rect.height / SCENE_HEIGHT);
      setRoute(buildBentoRoute(radiusX, radiusY));
    };

    updateRoute();
    const observer = new ResizeObserver(updateRoute);
    observer.observe(scene);
    const stage = scene.closest(".feature-bento-stage");
    if (stage) observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    const clampedProgress = Math.min(1, Math.max(0, progress));
    const point = path.getPointAtLength(length * clampedProgress);

    // Measure the route once in its own coordinate space, then use that same
    // distance for both the painted stroke and Misty's position. Normalizing
    // the dash to pathLength="1" can drift after this SVG is stretched to the
    // tall scene because its x and y scales are intentionally different.
    setRouteFrame({
      dashLength: length,
      dashOffset: length * (1 - clampedProgress),
      marker: { x: point.x, y: point.y },
    });
  }, [progress, route]);

  return (
    <div ref={sceneRef} className="feature-logo-scene" style={sceneStyle}>
      <svg className="mobile-path-rail" aria-hidden="true"><path d={mobileRoute} fill="none" stroke="var(--marketing-border-strong)" strokeWidth="1" /></svg>
      <div className="mobile-path-marker" aria-hidden="true"><img src="/misty-cloud-expression-cycle.webp" alt="" width="32" height="32" /></div>
      <svg
        aria-hidden="true"
        className="feature-logo-route pointer-events-none absolute inset-0 size-full overflow-visible"
        viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
        preserveAspectRatio="none"
      >
        <defs>
          <mask
            id="feature-bento-progress-mask"
            maskUnits="userSpaceOnUse"
            x="-20"
            y="-20"
            width={SCENE_WIDTH + 40}
            height={SCENE_HEIGHT + 40}
          >
            <path
              ref={pathRef}
              d={route}
              fill="none"
              stroke="white"
              strokeDasharray={`${routeFrame.dashLength} ${routeFrame.dashLength}`}
              strokeDashoffset={routeFrame.dashOffset}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="12"
            />
          </mask>
        </defs>
        <path
          d={route}
          fill="none"
          stroke="var(--marketing-border-strong)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="feature-bento-route-progress"
          d={route}
          fill="none"
          mask="url(#feature-bento-progress-mask)"
          stroke="var(--marketing-foreground)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.75"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {cards.map((card, index) => (
        <ShowcaseCard key={card.id} card={card} active={index === activeCard} mobileActive={index === mobileActiveCard} />
      ))}

      <div
        data-misty-sprite-slot
        aria-hidden="true"
        className="feature-bento-sprite pointer-events-none absolute left-0 top-0 z-20"
        style={{
          left: `${(routeFrame.marker.x / SCENE_WIDTH) * 100}%`,
          opacity: 1,
          top: `${(routeFrame.marker.y / SCENE_HEIGHT) * 100}%`,
        }}
      >
        <img
          src="/misty-cloud-expression-cycle.webp"
          alt=""
          width="512"
          height="512"
          className="feature-bento-sprite-core"
          decoding="async"
        />
      </div>
    </div>
  );
}

export function FeatureShowcase() {
  const { ref: storyRef, progress, approachProgress } = useScrollProgress<HTMLDivElement>({
    start: "top",
  });
  const { titleProgress, entranceProgress, contentProgress } = chapterSequence(progress, approachProgress);
  const sceneEntranceStyle = {
    "--feature-bento-entry-x": `${100 * (1 - entranceProgress)}vw`,
  } as CSSProperties;

  return (
    <section
      id="features"
      aria-labelledby="feature-bento-title"
      className="relative z-10 bg-background"
    >
      <div
        ref={storyRef}
        className="feature-bento-story relative"
        style={
          {
            "--feature-bento-story-height": "366svh",
          } as CSSProperties
        }
      >
        <div className="feature-bento-stage" style={{ "--chapter-expansion": entranceProgress } as CSSProperties}>
      <ScrollSceneIntro
        progress={titleProgress}
        id="feature-bento-title"
        title="A closer look at Misty."
        description="A few ways to make a space your own."
        direction="right"
      />


          <div
            className="site-container feature-bento-stage-inner"
            style={sceneEntranceStyle}
          >
            <div className="feature-logo-scene-window">
              <MistyProgressScene progress={contentProgress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
