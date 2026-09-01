import { type CSSProperties } from "react";

import {
  MistyAppMockup,
  type MockupView,
} from "@/components/marketing/appchrome";
import { ScreenshotSlot, VideoSlot } from "@/components/marketing/previews";
import type { ProductScreenshotSlotId } from "@/content/productScreenshotSlots";
import type { ProductVideoSlotId } from "@/content/productVideoSlots";
import { usePinnedStoryProgress } from "@/hooks/usePinnedStoryProgress";
import { beatPosition } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/utils";

type Beat = {
  title: string;
  description: string;
  view: MockupView;
  fallbackSlot: ProductScreenshotSlotId;
  videoSlot: ProductVideoSlotId;
};

const beats: Beat[] = [
  {
    title: "Choose your favorite apps",
    description:
      "Add Notes, Planner, Browser, Files, Code, and more from one menu. Keep the apps you use close and leave the rest out of the way.",
    view: "space",
    fallbackSlot: "space-overview",
    videoSlot: "choose-apps",
  },
  {
    title: "Build layouts for flexible workspaces",
    description:
      "Arrange apps into tabs, windows, and panels that fit the task. Move between focused and multi-app layouts without losing your place.",
    view: "space",
    fallbackSlot: "space-overview",
    videoSlot: "workspace-layouts",
  },
  {
    title: "Talk to Agents to manage automations and workflows",
    description:
      "Tell Misty what you want to happen in plain language. Agents can help coordinate automations, manage recurring work, and keep workflows moving.",
    view: "agent",
    fallbackSlot: "agent-workspace",
    videoSlot: "agent-workflows",
  },
  {
    title: "Share your Space with others",
    description:
      "Invite people into a Space with the apps, files, conversations, and context already in place. Everyone can start contributing without rebuilding the setup.",
    view: "library",
    fallbackSlot: "space-library",
    videoSlot: "share-space",
  },
];

/* Beats stack in a single grid cell so the container sizes to the tallest one
   and nothing gets clipped when copy lengths differ. */
const STACKED = "[grid-area:1/1]";
const FADE_START = 0.8;
const FADE_END = 1;
const INTRO_UNITS = 2.6;
const INTRO_ENTER_END = 0.36;
const INTRO_EXIT_START = 0.58;
const STORY_UNITS = INTRO_UNITS + beats.length;

function smoothstep(start: number, end: number, value: number) {
  const progress = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return progress * progress * (3 - 2 * progress);
}

function beatMotion(
  index: number,
  outgoing: number,
  incoming: number,
  transition: number,
  media = false,
): CSSProperties {
  const isOutgoing = index === outgoing;
  const isIncoming = index === incoming;
  const isSettled = outgoing === incoming;
  const opacity = isSettled
    ? isIncoming
      ? 1
      : 0
    : isOutgoing
      ? 1 - transition
      : isIncoming
        ? transition
        : 0;
  const scale = media ? 0.992 + opacity * 0.008 : 1;

  return {
    opacity,
    filter: `blur(${(1 - opacity) * 1.5}px)`,
    pointerEvents: opacity < 0.5 ? "none" : undefined,
    transform: `translate3d(0, 0, 0) scale(${scale})`,
  };
}

function BeatCopy({
  beat,
  centered = false,
}: {
  beat: Beat;
  centered?: boolean;
}) {
  return (
    <>
      <h3 className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.03em] text-[var(--marketing-foreground)]">
        {beat.title}
      </h3>
      <p
        className={cn(
          "mt-5 max-w-md text-base leading-relaxed text-[var(--marketing-muted)]",
          centered && "mx-auto",
        )}
      >
        {beat.description}
      </p>
    </>
  );
}

function BeatMedia({ beat, active }: { beat: Beat; active?: boolean }) {
  return (
    <VideoSlot slot={beat.videoSlot} active={active} fill>
      <ScreenshotSlot
        slot={beat.fallbackSlot}
        fill
        imageClassName="object-contain object-center"
      >
        <MistyAppMockup
          view={beat.view}
          fill
          shadow={false}
          className="ring-1 ring-white/[0.07]"
        />
      </ScreenshotSlot>
    </VideoSlot>
  );
}

function SpaceIntro() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-balance text-3xl font-medium leading-tight tracking-[-0.035em] text-[var(--marketing-foreground)] sm:text-5xl">
        What is a Space?
      </h2>
      <p className="mx-auto mt-6 max-w-3xl text-pretty text-base leading-relaxed text-[var(--marketing-muted)] sm:text-xl">
        A Space is your own configurable place to work, containing whichever
        apps and tools you want. It begins as yours, and becomes collaborative
        when you invite others.
      </p>
    </div>
  );
}

/**
 * A scroll-pinned walk through the product.
 *
 * The window pins to the viewport while roughly one screen of scroll is spent
 * on each beat, so scrolling drives a demo rather than paging past cards.
 *
 * The pinned track is desktop-only, and `prefers-reduced-motion` swaps it for
 * the stacked list (see `.pin-track` / `.pin-stacked` in index.css). Every
 * beat is therefore reachable without animating anything — no content lives
 * only inside the animation.
 */
export function HowItWorks() {
  const { ref, approach: approachProgress, progress } =
    usePinnedStoryProgress();
  const sceneCount = beats.length + 1;
  const storyPosition = progress * STORY_UNITS;
  const isIntroScene = storyPosition < INTRO_UNITS;
  const walkthroughPosition = Math.min(
    1,
    Math.max(0, (storyPosition - INTRO_UNITS) / beats.length),
  );
  const walkthroughBeat = beatPosition(walkthroughPosition, beats.length);
  const activeScene = isIntroScene ? 0 : walkthroughBeat.index + 1;
  const within = isIntroScene
    ? storyPosition / INTRO_UNITS
    : walkthroughBeat.within;
  const incomingScene = Math.min(sceneCount - 1, activeScene + 1);
  const transition =
    activeScene === sceneCount - 1
      ? 0
      : smoothstep(
          activeScene === 0 ? INTRO_EXIT_START : FADE_START,
          FADE_END,
          within,
        );
  const visibleScene = transition >= 0.5 ? incomingScene : activeScene;

  // Scene zero introduces Spaces. The four-step walkthrough — and its
  // indicator — begin only after that introductory scene has completed.
  const walkthroughActive = Math.max(0, activeScene - 1);
  const walkthroughWithin = activeScene === 0 ? 0 : within;

  // Hand the indicator to the incoming beat as soon as its crossfade starts.
  // The first beat uses the shorter pre-transition interval; every following
  // beat then owns one full segment, so the fill remains continuous across
  // the underlying `within` reset at each beat boundary.
  const narrativePosition = walkthroughActive + walkthroughWithin;
  const indicatorPosition =
    narrativePosition <= FADE_START
      ? narrativePosition / FADE_START
      : 1 + narrativePosition - FADE_START;
  const indicatorActive = Math.min(
    beats.length - 1,
    Math.floor(indicatorPosition),
  );
  const indicatorWithin = Math.min(
    1,
    Math.max(0, indicatorPosition - indicatorActive),
  );

  // The bar follows the same damped progress and transition boundary as the
  // content, rather than letting one bar visually own two different beats.
  const fill = (index: number) =>
    index < indicatorActive
      ? 1
      : index === indicatorActive
        ? indicatorWithin
        : 0;
  const pinnedEntrance =
    activeScene === 0 ? smoothstep(0, INTRO_ENTER_END, within) : 1;
  const introEntrance =
    approachProgress < 1
      ? approachProgress * 0.45
      : 0.45 + pinnedEntrance * 0.55;
  const introStyle = {
    opacity: activeScene === 0 ? 1 : 0,
    pointerEvents: activeScene === 0 ? undefined : "none",
    transform: `translate3d(${100 * (1 - introEntrance) - 100 * transition}vw, 0, 0)`,
  } as CSSProperties;
  const walkthroughStyle = {
    transform: `translate3d(${activeScene === 0 ? 100 * (1 - transition) : 0}vw, 0, 0)`,
    willChange: "transform",
  } as CSSProperties;
  const walkthroughBeatMotion = (index: number, media = false) =>
    activeScene === 0 && index === 1
      ? ({
          opacity: 1,
          filter: "none",
          pointerEvents: transition < 0.5 ? "none" : undefined,
          transform: "translate3d(0, 0, 0) scale(1)",
        } as CSSProperties)
      : beatMotion(
          index,
          activeScene,
          incomingScene,
          transition,
          media,
        );

  return (
    <section
      id="spaces"
      aria-label="How Misty works"
      className="marketing-dark relative mb-3 scroll-mt-24 overflow-x-clip before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-24 before:bg-gradient-to-b before:from-background before:to-transparent sm:mb-4 lg:-mb-[8svh]"
    >
      {/* The Space introduction gets extra scroll distance for its slow entry,
          hold, and exit. Each walkthrough step then gets one viewport, plus
          one final viewport to hold the last step before release. */}
      <div
        ref={ref}
        className="pin-track relative hidden lg:block"
        style={{ height: `${(STORY_UNITS + 1) * 100}svh` }}
      >
        <div className="pin-stage">
          <div className="site-container grid grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] items-center gap-x-10 xl:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] xl:gap-x-12">
            <div
              aria-hidden={visibleScene !== 0}
              className="pin-beat col-start-1 col-end-3 row-start-1"
              style={introStyle}
            >
              <SpaceIntro />
            </div>

            <div
              className="col-start-1 row-start-1 flex h-full items-center justify-center"
              style={walkthroughStyle}
            >
              <div className="grid w-full max-w-lg text-left">
                {beats.map((beat, index) => (
                  <div
                    key={beat.title}
                    aria-hidden={index + 1 !== visibleScene}
                    className={cn("pin-beat", STACKED)}
                    style={walkthroughBeatMotion(index + 1)}
                  >
                    <BeatCopy beat={beat} />
                  </div>
                ))}
              </div>
            </div>

            <div
              className="relative col-start-2 row-start-1 w-full place-self-center"
              style={walkthroughStyle}
            >
              <div className="grid aspect-[8/5] min-h-0 overflow-hidden rounded-xl">
                {beats.map((beat, index) => (
                  <div
                    key={beat.title}
                    aria-hidden={index + 1 !== visibleScene}
                    className={cn("pin-beat h-full min-h-0", STACKED)}
                    style={walkthroughBeatMotion(index + 1, true)}
                  >
                    <BeatMedia
                      beat={beat}
                      active={index + 1 === visibleScene}
                    />
                  </div>
                ))}
              </div>

              {/* Keep the indicator in normal flow so the left-hand copy is
                  centered against the preview and progress bar together. */}
              <div
                aria-hidden={visibleScene === 0}
                className="mt-8 flex gap-2.5"
              >
                {beats.map((beat, index) => (
                  <span
                    key={beat.title}
                    className="h-[3px] flex-1 overflow-hidden rounded-full bg-[var(--marketing-border-strong)]"
                  >
                    <span
                      className="block h-full rounded-full bg-[var(--marketing-foreground)]"
                      style={{ width: `${fill(index) * 100}%` }}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Small screens — and reduced motion at any width — get the same beats
          as an ordinary stacked list. */}
      <div className="site-container pin-stacked space-y-14 py-16 lg:hidden">
        <SpaceIntro />
        {beats.map((beat) => (
          <div key={beat.title}>
            <BeatCopy beat={beat} />
            <div className="mt-7 aspect-[8/5] overflow-hidden rounded-xl">
              <BeatMedia beat={beat} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
