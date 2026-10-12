import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Chapter, ChapterHead } from "./Chapter";
import { ScaledWindow, type Aftermath } from "./MistyWindow";
import { useStageLoop, type Stage } from "./useStageLoop";
import { usePinnedSteps } from "./usePinnedSteps";
import { DeviceLayouts } from "./DeviceLayouts";
import { SyncTree } from "./SyncTree";
import { AddressBar, ImportSheet } from "./BrowserChapters";
import { Tile, Tiles } from "./Tiles";

/**
 * The Work part of the homepage story, agents in your tabs and the apps they connect, plus
 * the Browser part's Sync chapter (the rest is in BrowserChapters.tsx; Spaces is in SpacesChapter.tsx).
 * Each chapter uses a different layout so the page keeps changing pace. The comparison
 * with other AI browsers is in CompareChapter.tsx. Claims follow SELLING-POINTS.md and its checklist.
 */

/** Official logos, copied from the Misty app's brand icons (see src/assets/brand-icons/README.md). */
const brands = import.meta.glob<string>("../../../assets/brand-icons/*.svg", { eager: true, query: "?url", import: "default" });
/**
 * Popular apps the orbit rotates through, all reachable through account connections (Composio).
 * Icons come from the Misty app's brand set (src/assets/brand-icons/sources.json). Use square
 * marks only; a wordmark (Stripe's, for one) is unreadable at tile size.
 */
const apps: [string, string][] = [
  ["gmail", "Gmail"], ["google-docs", "Google Docs"], ["google-sheets", "Google Sheets"], ["slack", "Slack"],
  ["notion", "Notion"], ["linear", "Linear"], ["github", "GitHub"], ["jira", "Jira"],
  ["figma", "Figma"], ["todoist", "Todoist"], ["youtube", "YouTube"], ["spotify", "Spotify"],
  ["google-calendar", "Google Calendar"], ["google-drive", "Google Drive"], ["airtable", "Airtable"], ["asana", "Asana"],
  ["trello", "Trello"], ["hubspot", "HubSpot"], ["discord", "Discord"], ["dropbox", "Dropbox"],
  ["outlook", "Outlook"], ["microsoft-teams", "Microsoft Teams"], ["onedrive", "OneDrive"],
  ["reddit", "Reddit"], ["x", "X"], ["linkedin", "LinkedIn"],
];

export function SyncChapter() {
  return (
    <Chapter id="sync" title={<>Give each computer its own setup{" "}<span>and keep them all in sync.</span></>}>
      <Tiles>
        {/* Each row takes a different shape (small-large here, then wide-narrow) so the grid
            never repeats; the engine row above is large-small. */}
        <Tile span={4} title="Import from Chrome, Safari, Firefox or Zen."><ImportSheet /></Tile>
        <Tile span={8} title="Encrypted on your device before it syncs."><SyncTree /></Tile>
        <Tile id="foundation" span={7} title="Each computer keeps its own layout."><DeviceLayouts /></Tile>
        <Tile span={5} title="Bookmarks, history and your search engine."><AddressBar /></Tile>
      </Tiles>
    </Chapter>
  );
}

/** Connected apps orbit Misty: an inner and an outer ring turning in opposite directions. */
const RING_SIZES = [5, 7];
const SLOTS = RING_SIZES[0] + RING_SIZES[1];
/** How often one slot swaps to the next app, while the orbit is on screen. */
const SWAP_MS = 1800;

/**
 * The orbit's twelve slots start on the first twelve apps, then swap one at a time, round the
 * rings, to the next app nobody can see yet. Paused off screen and for reduced motion.
 */
function useRotatingApps(root: RefObject<HTMLElement | null>) {
  const [shown, setShown] = useState(() => apps.slice(0, SLOTS).map((_, index) => index));
  useEffect(() => {
    const element = root.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let next = SLOTS;
    let slot = 0;
    // Visit slots in a spread-out order so neighbours don't change back to back.
    const order = Array.from({ length: SLOTS }, (_, index) => (index * 5) % SLOTS);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(element);
    const timer = window.setInterval(() => {
      if (!visible || document.hidden) return;
      const target = order[slot % SLOTS];
      slot += 1;
      setShown(current => {
        const updated = [...current];
        while (updated.includes(next % apps.length)) next += 1;
        updated[target] = next % apps.length;
        next += 1;
        return updated;
      });
    }, SWAP_MS);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [root]);
  return shown;
}

/**
 * The Work part as one pinned scene: one task, start to finish, with the connected apps in the
 * middle. Most steps show a window state (the working step loops stages 2–4); the apps step swaps
 * the window for the orbit. Claims follow SELLING-POINTS.md and misty/src/features/agents/PRODUCT.md.
 */
type WorkStep = { title: string; stage?: Stage; loop?: boolean; after?: Aftermath; apps?: boolean };
const WORK_STEPS: WorkStep[] = [
  { title: "Ask in one sentence.", stage: 0 },
  { title: "Approve the plan before anything changes.", stage: 1 },
  { title: "Connect your apps once.", apps: true },
  { title: "It works across them, following the skills you add.", stage: 2, loop: true },
  { title: "Save it as a workflow and put it on a schedule.", stage: 6, after: "workflow" },
];
const agentsTitle = <>Agents that work across{" "}<span>your browser and your apps.</span></>;

/** Connected apps orbiting Misty. */
function AppOrbit({ hub, shown }: { hub: RefObject<HTMLDivElement | null>; shown: number[] }) {
  return (
    <div ref={hub} className="mist-hub">
      {RING_SIZES.map((size, depth) => (
        <ul key={depth} className="mist-hub-ring" data-ring={depth === 0 ? "inner" : "outer"} aria-label={depth === 0 ? "Apps you can connect" : undefined}>
          {Array.from({ length: size }, (_, index) => {
            const [icon, name] = apps[shown[depth * RING_SIZES[0] + index]];
            return (
              <li key={index} style={{ "--a": `${(index / size) * 360 - 90}deg` } as CSSProperties} title={name}>
                {/* Keyed by app, so each swap remounts the logo and plays its entrance. */}
                <span><img key={icon} src={brands[`../../../assets/brand-icons/${icon}.svg`]} alt={name} data-brand={icon}
                  data-swapped={shown[depth * RING_SIZES[0] + index] !== depth * RING_SIZES[0] + index || undefined} /></span>
              </li>
            );
          })}
        </ul>
      ))}
      <div className="mist-hub-core" aria-hidden="true"><BrandLogo /></div>
    </div>
  );
}

export function AgentsChapter() {
  const section = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const shown = useRotatingApps(hub);
  const [active, choose] = usePinnedSteps(section, WORK_STEPS.length);
  const step = WORK_STEPS[active];
  const looping = step.loop === true;
  const [loopStage, setLoopStage] = useStageLoop(section, 2, looping, 1700, 4);
  useEffect(() => { if (looping) setLoopStage(2); }, [looping, setLoopStage]);
  // The apps step keeps the window on the plan underneath the orbit.
  const stage = looping ? loopStage : step.stage ?? 1;

  return (
    <Chapter id="agents" title={agentsTitle} side="end" ownHead>
      <div ref={section} className="mist-steps" style={{ "--steps-count": WORK_STEPS.length } as CSSProperties}>
        {/* Pinned, the heading holds with the steps, and the whole scene centers in the viewport. */}
        <div className="mist-steps-pin">
          <ChapterHead id="agents" title={agentsTitle} />
          <div className="mist-steps-stage" data-reveal-stagger>
            <ol className="mist-steps-list" aria-label="Agent steps">
              {WORK_STEPS.map((item, index) => (
                <li key={item.title}>
                  <button type="button" aria-current={index === active ? "step" : undefined} onClick={() => choose(index)}>
                    {item.title}
                  </button>
                </li>
              ))}
            </ol>
            <div className="mist-steps-media" data-apps={step.apps === true}>
              <div className="mist-steps-window"><ScaledWindow stage={stage} after={step.after} width={900} height={620} /></div>
              <div className="mist-steps-apps" aria-hidden={!step.apps}><AppOrbit hub={hub} shown={shown} /></div>
            </div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
