import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  MistyAppMockup,
  type MockupView,
} from "@/components/marketing/appchrome";
import {
  ChatPreview,
  ConnectionsPreview,
  ScreenshotSlot,
  TasksPreview,
} from "@/components/marketing/previews";
import type { ProductScreenshotSlotId } from "@/content/productScreenshotSlots";
import { usePinnedStoryProgress } from "@/hooks/usePinnedStoryProgress";
import { cn } from "@/lib/utils";

type PreviewKind = "mockup" | "tasks" | "connections" | "chat";

type ShowcaseMoment = {
  id: string;
  title: string;
  description: string;
  view: MockupView;
  slot: ProductScreenshotSlotId;
  preview: PreviewKind;
};

type ShowcaseCard = {
  sceneClassName: string;
} & ShowcaseMoment;

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
const LAST_PANEL_BOTTOM = 905;
const ROUTE_START = { x: PANEL_LEFT, y: FIRST_PANEL_MIDDLE };
const ROUTE_END = { x: PANEL_LEFT, y: LAST_PANEL_BOTTOM };
const ROW_TURNS = [267.5, 487.5, 707.5] as const;

const CAMERA_STOPS = [
  { progress: 0, shift: 5 },
  { progress: 0.18, shift: 5 },
  { progress: 0.25, shift: -17 },
  { progress: 0.44, shift: -17 },
  { progress: 0.5, shift: -39 },
  { progress: 0.69, shift: -39 },
  { progress: 0.75, shift: -55 },
  { progress: 1, shift: -55 },
] as const;

/* The SVG stretches to a tall scene, so x/y radii are calculated separately
 * to keep every rendered bend circular instead of vertically distorted. */
function buildBentoRoute(radiusX: number, radiusY: number) {
  const topRail = FIRST_PANEL_TOP - radiusY;
  const leftRail = PANEL_LEFT - radiusX;
  const rightRail = PANEL_RIGHT + radiusX;
  const [firstTurn, secondTurn, thirdTurn] = ROW_TURNS;

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
    `L ${rightRail} ${thirdTurn - radiusY}`,
    `Q ${rightRail} ${thirdTurn} ${PANEL_RIGHT} ${thirdTurn}`,
    `L ${PANEL_LEFT} ${thirdTurn}`,
    `Q ${leftRail} ${thirdTurn} ${leftRail} ${thirdTurn + radiusY}`,
    `L ${leftRail} ${LAST_PANEL_BOTTOM - radiusY}`,
    `Q ${leftRail} ${LAST_PANEL_BOTTOM} ${ROUTE_END.x} ${ROUTE_END.y}`,
  ].join(" ");
}

function cameraShiftAt(progress: number) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const nextIndex = CAMERA_STOPS.findIndex(
    (stop) => clampedProgress <= stop.progress,
  );

  if (nextIndex <= 0) return CAMERA_STOPS[0].shift;
  if (nextIndex === -1) {
    return CAMERA_STOPS[CAMERA_STOPS.length - 1].shift;
  }

  const previous = CAMERA_STOPS[nextIndex - 1];
  const next = CAMERA_STOPS[nextIndex];
  const interval = next.progress - previous.progress;
  const position = interval
    ? (clampedProgress - previous.progress) / interval
    : 1;
  const eased = position * position * (3 - 2 * position);

  return previous.shift + (next.shift - previous.shift) * eased;
}

/*
 * Every card resolves through the shared screenshot inventory. Missing
 * captures stay as responsive DOM previews until the matching file is added.
 */
const cards: ShowcaseCard[] = [
  {
    id: "apps",
    title: "Start with the apps you need",
    description:
      "Keep Misty focused with Notes or Planner, or open a complete set of apps around the work.",
    view: "space",
    slot: "space-overview",
    preview: "mockup",
    sceneClassName: "feature-logo-card-0",
  },
  {
    id: "planner",
    title: "Plan shared work",
    description:
      "Track owners, priorities, due dates, and completed work without leaving the Space.",
    view: "space",
    slot: "tasks-board",
    preview: "tasks",
    sceneClassName: "feature-logo-card-1",
  },
  {
    id: "files",
    title: "Browser and Files, built in",
    description:
      "Browse local and connected files while private work stays beside the apps that need it.",
    view: "files",
    slot: "private-files",
    preview: "mockup",
    sceneClassName: "feature-logo-card-2",
  },
  {
    id: "connections",
    title: "Connect the right services",
    description:
      "Add a connection when it earns a place in the workspace, with availability kept clear.",
    view: "files",
    slot: "connections",
    preview: "connections",
    sceneClassName: "feature-logo-card-3",
  },
  {
    id: "library",
    title: "Share context when you want to",
    description:
      "Spaces and Libraries bring selected resources into the same working context.",
    view: "library",
    slot: "space-library",
    preview: "mockup",
    sceneClassName: "feature-logo-card-4",
  },
  {
    id: "chat",
    title: "Keep conversation beside the work",
    description:
      "Talk through decisions with the people, Agent, and context that move them forward.",
    view: "space",
    slot: "space-chat",
    preview: "chat",
    sceneClassName: "feature-logo-card-5",
  },
  {
    id: "agents",
    title: "Agents work beside you",
    description:
      "Add an Agent for help planning, researching, or executing across the workspace.",
    view: "agent",
    slot: "agent-workspace",
    preview: "mockup",
    sceneClassName: "feature-logo-card-6",
  },
  {
    id: "home",
    title: "Return to a clear view of the day",
    description:
      "Come back to your apps, agenda, work rhythm, and Spaces without losing the thread.",
    view: "space",
    slot: "home-dashboard",
    preview: "mockup",
    sceneClassName: "feature-logo-card-7",
  },
];

const FEATURE_INTRO_UNITS = 2.6;
const FEATURE_INTRO_ENTER_END = 0.36;
const FEATURE_INTRO_EXIT_START = 0.58;

function smoothstep(start: number, end: number, value: number) {
  const progress = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return progress * progress * (3 - 2 * progress);
}

function FeatureIntro() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-balance text-3xl font-medium tracking-[-0.03em] text-[var(--marketing-foreground)] sm:text-5xl">
        A closer look at Misty.
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--marketing-muted)] sm:text-xl">
        Follow Misty through the workspace.
      </p>
    </div>
  );
}

function activeCardAt(progress: number) {
  const checkpoints = [0.12, 0.24, 0.37, 0.51, 0.64, 0.76, 0.88];
  const nextCheckpoint = checkpoints.findIndex(
    (checkpoint) => progress < checkpoint,
  );
  return nextCheckpoint === -1 ? 7 : nextCheckpoint;
}

function ShowcaseVisual({ moment }: { moment: ShowcaseMoment }) {
  let fallback: ReactNode;

  if (moment.preview === "tasks") {
    fallback = <TasksPreview />;
  } else if (moment.preview === "connections") {
    fallback = <ConnectionsPreview />;
  } else if (moment.preview === "chat") {
    fallback = <ChatPreview />;
  } else {
    fallback = <MistyAppMockup view={moment.view} fill shadow={false} />;
  }

  return (
    <ScreenshotSlot
      slot={moment.slot}
      fill
      className="feature-bento-preview min-h-0 overflow-hidden"
      imageClassName="object-contain object-top"
    >
      {fallback}
    </ScreenshotSlot>
  );
}

function ShowcaseCard({
  card,
  active,
}: {
  card: ShowcaseCard;
  active: boolean;
}) {
  return (
    <article
      data-bento-card
      data-active={active}
      className={cn(
        "feature-bento-card feature-logo-card z-10 flex min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-surface)]",
        card.sceneClassName,
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="feature-bento-card-copy px-5 pt-5 sm:px-6 sm:pt-6">
          <h3 className="text-lg font-medium tracking-[-0.025em] text-[var(--marketing-foreground)] sm:text-xl">
            {card.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[var(--marketing-muted)] sm:text-sm">
            {card.description}
          </p>
        </div>
        <div className="feature-bento-card-media mt-4 flex min-h-0 flex-1 flex-col px-4 pb-4 sm:px-5 sm:pb-5">
          <ShowcaseVisual moment={card} />
        </div>
      </div>
    </article>
  );
}

function MistyProgressScene({ progress }: { progress: number }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [route, setRoute] = useState(() => buildBentoRoute(30, 30));
  const [routeFrame, setRouteFrame] = useState<RouteFrame>({
    dashLength: 1,
    dashOffset: 1,
    marker: ROUTE_START,
  });
  const activeCard = activeCardAt(progress);
  const sceneStyle = {
    "--feature-bento-camera-shift": `${cameraShiftAt(progress)}%`,
  } as CSSProperties;

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const updateRoute = () => {
      const rect = scene.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const radius = 32;
      const radiusX = radius / (rect.width / SCENE_WIDTH);
      const radiusY = radius / (rect.height / SCENE_HEIGHT);
      setRoute(buildBentoRoute(radiusX, radiusY));
    };

    updateRoute();
    const observer = new ResizeObserver(updateRoute);
    observer.observe(scene);
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
        <ShowcaseCard
          key={card.id}
          card={card}
          active={index === activeCard}
        />
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
  const {
    ref: storyRef,
    approach: approachProgress,
    progress,
  } = usePinnedStoryProgress();
  const storyUnits = FEATURE_INTRO_UNITS + cards.length;
  const storyPosition = progress * storyUnits;
  const isIntroScene = storyPosition < FEATURE_INTRO_UNITS;
  const introWithin = isIntroScene
    ? storyPosition / FEATURE_INTRO_UNITS
    : 1;
  const showcaseProgress = Math.min(
    1,
    Math.max(0, (storyPosition - FEATURE_INTRO_UNITS) / cards.length),
  );
  const handoff = smoothstep(
    FEATURE_INTRO_EXIT_START,
    1,
    introWithin,
  );
  const pinnedEntrance = isIntroScene
    ? smoothstep(0, FEATURE_INTRO_ENTER_END, introWithin)
    : 1;
  const introEntrance =
    approachProgress < 1
      ? approachProgress * 0.45
      : 0.45 + pinnedEntrance * 0.55;
  const introStyle = {
    opacity: isIntroScene ? 1 : 0,
    pointerEvents: isIntroScene ? undefined : "none",
    transform: `translate3d(${-100 * (1 - introEntrance) + 100 * handoff}vw, 0, 0)`,
  } as CSSProperties;
  const panelsStyle = {
    transform: `translate3d(${isIntroScene ? -100 * (1 - handoff) : 0}vw, 0, 0)`,
    willChange: "transform",
  } as CSSProperties;

  return (
    <section
      id="features"
      aria-label="A closer look at Misty"
      className="relative z-10 scroll-mt-24 bg-background"
    >
      <div className="site-container feature-bento-intro">
        <FeatureIntro />
      </div>

      <div
        ref={storyRef}
        className="feature-bento-story"
        style={
          {
            "--feature-bento-story-height": `${(storyUnits + 1) * 100}svh`,
          } as CSSProperties
        }
      >
        <div className="feature-bento-stage">
          <div className="site-container feature-bento-stage-inner">
            <div
              aria-hidden={!isIntroScene || handoff >= 0.5}
              className="feature-bento-pinned-intro"
              style={introStyle}
            >
              <FeatureIntro />
            </div>
            <div
              aria-hidden={isIntroScene && handoff < 0.5}
              className="feature-logo-scene-window"
              style={panelsStyle}
            >
              <MistyProgressScene progress={showcaseProgress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
