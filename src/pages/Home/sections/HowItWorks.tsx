import { type CSSProperties, useRef, useState } from "react";

import {
  MistyAppMockup,
  type MockupView,
} from "@/components/marketing/appchrome";
import { ScreenshotSlot, VideoSlot } from "@/components/marketing/previews";
import type { ProductScreenshotSlotId } from "@/content/productScreenshotSlots";
import type { ProductVideoSlotId } from "@/content/productVideoSlots";
import { beatPosition, useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/utils";
import { MobileScreenshotPreview } from "../components/MobileScreenshotPreview";
import { FitPreview } from "../components/FitPreview";
import { ScrollSceneIntro } from "../components/ScrollSceneIntro";


type Beat = {
  title: string;
  description: string;
  caption: string;
  view: MockupView;
  fallbackSlot: ProductScreenshotSlotId;
  videoSlot: ProductVideoSlotId;
};

const beats: Beat[] = [
  {
    title: "Create a Space",
    description: "Start with something you want to do: plan a trip, study a subject, or build something new. Give it a Space to keep the work together.",
    caption: "Give whatever you’re working on a Space of its own.",
    view: "space",
    fallbackSlot: "space-overview",
    videoSlot: "create-space",
  },
  {
    title: "Add your apps",
    description: "Choose the apps you need, from Notes and Planner to Browser and Files. Start with a few and add more as your work grows.",
    caption: "Choose the apps you need. Add more as you go.",
    view: "space",
    fallbackSlot: "space-overview",
    videoSlot: "choose-apps",
  },
  {
    title: "Choose your integrations",
    description: "Bring familiar services into your apps. Open supported websites inside Misty or connect supported storage, keeping the tools you already use close.",
    caption: "Bring supported websites and services into your apps.",
    view: "space",
    fallbackSlot: "connections",
    videoSlot: "choose-integrations",
  },
  {
    title: "Make the layout yours",
    description: "Arrange apps into tabs, panels, and virtual windows. Keep useful tools side by side and switch layouts as your task changes.",
    caption: "Arrange tabs, panels, and virtual windows around your work.",
    view: "space",
    fallbackSlot: "home-dashboard",
    videoSlot: "workspace-layouts",
  },
  {
    title: "Bring in AI collaborators",
    description: "Add an Agent when you want a hand. Give it access to the context and tools it needs, then ask for help with the work.",
    caption: "Bring in an Agent and choose what it can work with.",
    view: "agent",
    fallbackSlot: "agent-workspace",
    videoSlot: "agent-workflows",
  },
  {
    title: "Invite your friends",
    description: "Work on your own or invite friends into your Space when you’re ready. Collaborate on shared work while personal accounts and files stay private unless you choose to share.",
    caption: "Invite friends when you’re ready. Personal accounts and files stay private unless shared.",
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
      ? media ? 1 - transition : 1 - smoothstep(0, 0.5, transition)
      : isIncoming
        ? media ? transition : smoothstep(0.5, 1, transition)
        : 0;
  const scale = media ? 0.992 + opacity * 0.008 : 1;

  return {
    opacity,
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

function BeatMedia({ beat, active, screenshotOnly = false }: { beat: Beat; active?: boolean; screenshotOnly?: boolean }) {
  const preview = (
      <ScreenshotSlot
        slot={beat.fallbackSlot}
        fill
        imageClassName="object-contain object-center"
      >
        <FitPreview><MistyAppMockup
          view={beat.view}
          fill
          shadow={false}
          className="ring-1 ring-white/[0.07]"
        /></FitPreview>
      </ScreenshotSlot>
  );
  return <VideoSlot slot={beat.videoSlot} active={active} fill>{screenshotOnly ? <MobileScreenshotPreview slot={beat.fallbackSlot}>{preview}</MobileScreenshotPreview> : preview}</VideoSlot>;
}

function MobileWalkthrough() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const goTo = (index: number) => {
    const gallery = galleryRef.current!;
    const card = gallery.children[index] as HTMLElement;
    gallery.scrollTo({
      left: card.offsetLeft - (gallery.children[0] as HTMLElement).offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <div className="mobile-walkthrough" role="region" aria-roledescription="carousel" aria-label="Explore Misty">
      <div ref={galleryRef} className="mobile-walkthrough-track" onScroll={() => {
        const gallery = galleryRef.current!;
        const first = gallery.children[0] as HTMLElement;
        const second = gallery.children[1] as HTMLElement;
        setActive(Math.max(0, Math.min(beats.length - 1, Math.round(gallery.scrollLeft / (second.offsetLeft - first.offsetLeft)))));
      }}>
        {beats.map((beat, index) => (
          <article key={beat.title} id={`mobile-walkthrough-${index}`} className="mobile-walkthrough-card"
            role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${beats.length}: ${beat.title}`}>
            <div className="mobile-walkthrough-media"><BeatMedia beat={beat} active={index === active} screenshotOnly /></div>
            <h3>{beat.title}</h3>
            <p>{beat.caption}</p>
          </article>
        ))}
      </div>
      <div className="mobile-walkthrough-controls site-container">
        <p aria-live="polite">{active + 1} / {beats.length}<span aria-hidden="true"> · Swipe to explore</span></p>
        <div className="flex" role="group" aria-label="Choose a walkthrough slide">
          {beats.map((beat, index) => <button key={beat.title} type="button"
            aria-label={`Show ${beat.title}`} aria-controls={`mobile-walkthrough-${index}`}
            aria-current={active === index ? "true" : undefined} onClick={() => goTo(index)}><span /></button>)}
        </div>
      </div>
    </div>
  );
}

/**
 * A scroll-pinned walk through the product.
 *
 * The window pins to the viewport while roughly one screen of scroll is spent
 * on each beat, so scrolling drives a demo rather than paging past cards.
 *
 * The pinned track starts at the same medium-screen breakpoint as the hero.
 * Desktop reduced motion uses a stacked list; phones use native horizontal
 * scrolling with explicit slide buttons, also available without animation.
 */

export function HowItWorks() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    start: "top",
  });
  // Restore the committed scroll-position crossfade. The shared scroll hook
  // already smooths progress, so no second follower or wheel interception is needed.
  const { index: active, within } = beatPosition(progress, beats.length);
  const incoming = Math.min(beats.length - 1, active + 1);
  const transition = active === beats.length - 1 ? 0 : smoothstep(FADE_START, FADE_END, within);
  const visibleBeat = transition >= 0.5 ? incoming : active;
  // Fill the first segment before its crossfade, then hand progress to the
  // incoming panel. The same scroll follower drives both fills and content.
  const position = active + within;
  const indicatorPosition = position <= FADE_START
    ? position / FADE_START
    : 1 + position - FADE_START;
  const fill = (index: number) => Math.max(0, Math.min(1, indicatorPosition - index));

  return (
    <section
      id="how-it-works"
      aria-label="How Misty works"
      className="bg-background text-[var(--marketing-foreground)] overflow-x-clip scroll-mt-24"
    >
      <span id="spaces" className="block scroll-mt-24" />
      <ScrollSceneIntro
        title="Make a Space your own."
        description="Start with what you want to do. Add the tools you need, arrange them your way, and bring in AI or friends whenever it helps."
      />
      <div
        ref={ref}
        className="pin-track relative hidden md:block"
        style={{
          height: `calc(100svh + ${40.6 * beats.length}svh * var(--home-scroll-travel-scale, 1))`,
        }}
      >
        <div className="pin-stage">
          <div

            className="pin-scene site-container grid grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] items-center gap-x-10 xl:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] xl:gap-x-12"
          >
            <div className="col-start-1 row-start-1 flex h-full items-center justify-center">
              <div className="grid w-full max-w-lg overflow-hidden text-center">
                {beats.map((beat, index) => (
                  <div
                    key={beat.title}
                    aria-hidden={index !== visibleBeat}
                    className={cn("pin-beat", STACKED)}
                    style={beatMotion(index, active, incoming, transition)}
                  >
                    <BeatCopy beat={beat} centered />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative col-start-2 row-start-1 w-full place-self-center">
              <div className="grid aspect-[8/5] min-h-0 overflow-hidden rounded-xl">
                {beats.map((beat, index) => (
                  <div
                    key={beat.title}
                    aria-hidden={index !== visibleBeat}
                    className={cn("pin-beat h-full min-h-0", STACKED)}
                    style={beatMotion(
                      index,
                      active,
                      incoming,
                      transition,
                      true,
                    )}
                  >
                    <BeatMedia beat={beat} active={index === visibleBeat} />
                  </div>
                ))}
              </div>

              {/* Keep the indicator visually attached without letting it
                  shift the media frame away from the viewport center. */}
              <div className="absolute inset-x-0 top-full mt-8 flex gap-2.5" data-walkthrough-progress>
                {beats.map((beat, index) => (
                  <span
                    key={beat.title}
                    className="h-[3px] flex-1 overflow-hidden rounded-full bg-[var(--marketing-border-strong)]"
                  >
                    <span
                      className="block h-full rounded-full bg-[var(--marketing-foreground)]"
                      style={{ width: `${fill(index) * 100}%` }}
                      data-segment-fill={index}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Touch screens get a native swipe gallery; desktop retains its static fallback. */}
      <MobileWalkthrough />
      <div className="site-container pin-stacked walkthrough-static space-y-14 py-16 hidden">
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
