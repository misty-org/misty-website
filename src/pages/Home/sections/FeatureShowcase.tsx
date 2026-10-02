import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { ScreenshotSlot, VideoSlot } from "@/components/marketing/previews";
import { MistyAppMockup } from "@/components/marketing/appchrome";
import { FitPreview } from "../components/FitPreview";
import { workspaceShowcase } from "@/content/workspaceShowcase";
import { useReveal } from "@/hooks/useReveal";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/utils";
import { ScrollSceneIntro } from "../components/ScrollSceneIntro";
import { SHOWCASE_PANEL_ENDS, showcaseCameraFrame, sampleShowcaseRail, showcasePanelMotion, showcaseTravelDistance, type RailSample } from "../scrollMotion";

type ShowcaseMoment = (typeof workspaceShowcase)[number];
type ShowcaseCard = ShowcaseMoment;

type Point = { x: number; y: number };


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

function ShowcaseVisual({ moment }: { moment: ShowcaseMoment }) {
  return (
    <div className="feature-bento-preview h-full min-h-0 overflow-hidden rounded-lg">
      <VideoSlot slot={moment.videoSlot} fill>
        <ScreenshotSlot slot={moment.fallbackSlot} fill imageClassName="object-contain object-center">
          <FitPreview><MistyAppMockup view={moment.view} fill shadow={false} /></FitPreview>
        </ScreenshotSlot>
      </VideoSlot>
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
            {cards.indexOf(card) + 1}. {card.title}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-[var(--marketing-muted)]">{card.description}</p>
        </div>
        <div className="feature-bento-card-media mt-4 flex min-h-0 flex-1 flex-col px-4 pb-4 sm:px-5 sm:pb-5">
          <ShowcaseVisual moment={card} />
        </div>
      </div>
    </article>
  );
}

function MistyProgressScene({ progress: contentProgress }: { progress: number }) {
  const { ref: sceneRef, progress: mobileProgress } = useScrollProgress<HTMLDivElement>({ start: "center" });
  const pathRef = useRef<SVGPathElement>(null);
  const [route, setRoute] = useState(() => buildBentoRoute(30, 30));
  const [panelDistances, setPanelDistances] = useState<readonly number[]>(SHOWCASE_PANEL_ENDS);
  const [railGeometry, setRailGeometry] = useState<{ length: number; samples: RailSample[] }>({
    length: 1,
    samples: [{ ...ROUTE_START, rail: 0, distance: 0 }, { ...ROUTE_START, rail: 1, distance: 1 }],
  });
  const marker = sampleShowcaseRail(contentProgress, railGeometry.samples);
  const { active: activeCard, progress } = showcasePanelMotion(marker.rail, panelDistances);
  const routeFrame = {
    dashLength: railGeometry.length,
    dashOffset: railGeometry.length * (1 - progress),
    marker,
  };
  const [cameraSize, setCameraSize] = useState({ scene: 0, viewport: 0 });
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
  }, [mobileProgress, sceneRef]);
  // The cloud, painted line, and camera all use this frame's same rail sample.
  // Camera easing is measured along the route, not delayed behind the cloud.
  const cameraY = showcaseCameraFrame(contentProgress, railGeometry.samples, cameraSize.scene, cameraSize.viewport);
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
      // Layout dimensions stay stable while the camera is transformed.
      // Ignore tiny rounding changes in transformed bounds so the route
      // and marker stay steady while the camera moves.
      const width = scene.clientWidth;
      const height = scene.clientHeight;
      if (!width || !height) return;
      setCameraSize({
        scene: height,
        viewport: scene.closest(".feature-bento-stage")?.clientHeight ?? window.innerHeight,
      });

      const radius = 32;
      const radiusX = radius / (width / SCENE_WIDTH);
      const radiusY = radius / (height / SCENE_HEIGHT);
      setRoute(buildBentoRoute(radiusX, radiusY));
    };

    updateRoute();
    const observer = new ResizeObserver(updateRoute);
    observer.observe(scene);
    const stage = scene.closest(".feature-bento-stage");
    if (stage) observer.observe(stage);
    return () => observer.disconnect();
  }, [sceneRef]);

  useLayoutEffect(() => {
    const path = pathRef.current;
    const scene = sceneRef.current;
    if (!path || !scene) return;
    const radiusX = 32 / (scene.clientWidth / SCENE_WIDTH);
    const radiusY = 32 / (scene.clientHeight / SCENE_HEIGHT);
    const targets = [
      { x: 759, y: FIRST_PANEL_TOP - radiusY },
      { x: PANEL_RIGHT + radiusX, y: ROW_TURNS[0] - radiusY },
      { x: 441, y: ROW_TURNS[0] },
      { x: PANEL_LEFT - radiusX, y: ROW_TURNS[1] - radiusY },
      { x: 759, y: ROW_TURNS[1] },
    ];
    const length = path.getTotalLength();
    const samples: RailSample[] = [];
    let distance = 0;
    let previous = path.getPointAtLength(0);
    for (let i = 0; i <= 1024; i++) {
      const point = path.getPointAtLength(length * i / 1024);
      distance += showcaseTravelDistance(
        (point.x - previous.x) * scene.clientWidth / SCENE_WIDTH,
        (point.y - previous.y) * scene.clientHeight / SCENE_HEIGHT,
      );
      samples.push({ x: point.x, y: point.y, rail: i / 1024, distance });
      previous = point;
    }
    setRailGeometry({ length, samples });
    // Match each panel's edge to the actual rounded rail after resizing.
    const distanceTo = (fraction: number, target: Point) => {
      const point = path.getPointAtLength(length * fraction);
      return Math.hypot(point.x - target.x, point.y - target.y);
    };
    const measureTarget = (target: Point) => {
      let closest = 0;
      for (let i = 1; i <= 256; i++) {
        if (distanceTo(i / 256, target) < distanceTo(closest, target)) closest = i / 256;
      }
      let low = Math.max(0, closest - 1 / 256);
      let high = Math.min(1, closest + 1 / 256);
      for (let i = 0; i < 18; i++) {
        const a = low + (high - low) / 3;
        const b = high - (high - low) / 3;
        if (distanceTo(a, target) < distanceTo(b, target)) high = b;
        else low = a;
      }
      return (low + high) / 2;
    };
    setPanelDistances([...targets.map(measureTarget), 1]);
  }, [route, sceneRef]);

  return (
    <div ref={sceneRef} className="feature-logo-scene" style={sceneStyle}>
      <svg className="mobile-path-rail" aria-hidden="true">
        <path d={mobileRoute} fill="none" stroke="var(--marketing-border-strong)" strokeWidth="1" />
        <path data-mobile-trail d={mobileRoute} fill="none" stroke="var(--marketing-foreground)" strokeWidth="2"
          pathLength="1" strokeDasharray="1" strokeDashoffset={1 - mobileProgress} strokeLinecap="round" />
      </svg>
      <div className="mobile-path-marker" aria-hidden="true"><img src="/misty-icon.png" alt="" width="32" height="32" /></div>
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
          src="/misty-icon.png"
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
  const { ref: storyRef, progress } = useScrollProgress<HTMLDivElement>({
    start: "top",
    motion: "spring",
  });

  return (
    <section
      id="features"
      aria-labelledby="feature-bento-title"
      className="relative z-10 bg-background"
    >
      <span id="how-it-works" className="block scroll-mt-24" />
      <span id="spaces" className="block scroll-mt-24" />
      <ScrollSceneIntro
        id="feature-bento-title"
        title="Your browser. Your workspace."
        description="Browse, organize, and work with native tools. Bring your tabs and website sign-ins along when you switch computers."
      />
      <div
        ref={storyRef}
        className="feature-bento-story relative"
        style={
          {
            "--feature-bento-story-height": "620svh",
          } as CSSProperties
        }
      >
        <div className="feature-bento-stage">
          <div

            className="site-container feature-bento-stage-inner"
          >
            <div className="feature-logo-scene-window">
              <MistyProgressScene progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
