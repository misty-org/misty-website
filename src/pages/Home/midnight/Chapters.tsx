import { useEffect, useRef, type CSSProperties } from "react";
import { Chapter, ChapterHead } from "./Chapter";
import { ScaledWindow, type Aftermath } from "./MistyWindow";
import { useStageLoop, type Stage } from "./useStageLoop";
import { usePinnedSteps } from "./usePinnedSteps";
import { DeviceLayouts } from "./DeviceLayouts";
import { SyncTree } from "./SyncTree";
import { AddressBar } from "./BrowserChapters";
import { Tile, Tiles } from "./Tiles";

/**
 * The Work part of the homepage story, agents in your tabs and the apps they connect, plus
 * the Browser part's Sync chapter (the rest is in BrowserChapters.tsx; Spaces is in SpacesChapter.tsx).
 * Each chapter uses a different layout so the page keeps changing pace. The comparison
 * with other AI browsers is in CompareChapter.tsx. Claims follow SELLING-POINTS.md and its checklist.
 */

export function SyncChapter() {
  return (
    <Chapter id="sync" title={<>Give each computer its own setup{" "}<span>and keep them all in sync.</span></>}>
      <Tiles>
        {/* The sync tree takes a full row so the diagram has room; then a wide-narrow pair. */}
        <Tile span={12} label="sync" title={<>Switch computers and keep going. Your tabs, panes and sign-ins<sup className="mist-tile-ref">1</sup> sync, end-to-end encrypted<sup className="mist-tile-ref">2</sup>.<small className="mist-tile-note">1. Some sites still ask you to sign in again.</small><small className="mist-tile-note">2. Misty will never track or share your synced data. All encryption keys stay local to your device.</small></>}><SyncTree /></Tile>
        <Tile id="foundation" span={7} label="layout" title="Tabs on top, tabs on the side, or split panes. Set up each computer its own way."><DeviceLayouts /></Tile>
        <Tile span={5} label="search" title="Bookmarks, history and your search engine, in one address bar."><AddressBar /></Tile>
      </Tiles>
    </Chapter>
  );
}

/**
 * The Work part as one pinned scene: one task, start to finish, with the connected apps in the
 * middle. Most steps show a window state (the working step loops stages 2–4); the apps step swaps
 * the window for the Integrations screenshot. Claims follow SELLING-POINTS.md and misty/src/features/agents/PRODUCT.md.
 */
type WorkStep = { title: string; note: string; link?: { text: string; href: string }; stage?: Stage; loop?: boolean; after?: Aftermath; apps?: boolean };
const WORK_STEPS: WorkStep[] = [
  // The screenshot fades the window back, so it keeps the opening prompt underneath until the plan is shown.
  { title: "Connect your apps once.", note: "Connect any of 1,500+ apps through ", link: { text: "Composio", href: "https://composio.dev" }, stage: 0, apps: true },
  { title: "Ask in one sentence.", note: "Describe the task in plain words.", stage: 0 },
  { title: "Watch it work live in tabs and windows.", note: "Take over whenever you want.", stage: 2, loop: true },
  { title: "Save it as a workflow.", note: "Run it again any time, or on a schedule with your connected apps.", stage: 6, after: "workflow" },
];
const agentsTitle = <>Agents that work across{" "}<span>your browser and your apps.</span></>;

/** Misty's integrations page, shown for the apps step in place of the window. */
function IntegrationsShot() {
  return (
    <img className="mist-steps-shot" src="/screenshots/misty-integrations.webp" width={2000} height={1258} loading="lazy"
      alt="Misty's Integrations page listing apps to connect, including Gmail, Slack, Notion, GitHub and Google Docs" />
  );
}

export function AgentsChapter() {
  const section = useRef<HTMLDivElement>(null);
  const [active, choose] = usePinnedSteps(section, WORK_STEPS.length);
  const step = WORK_STEPS[active];
  const list = useRef<HTMLOListElement>(null);
  // The box is placed from the steps' closed heights plus the current note, not from the layout mid-transition,
  // so it can start moving at once and the note opens after it.
  useEffect(() => {
    const element = list.current;
    if (!element) return;
    const place = () => {
      const items = [...element.children] as HTMLElement[];
      const gap = parseFloat(getComputedStyle(element).rowGap) || 0;
      const closed = items.map(item => (item.firstElementChild as HTMLElement).offsetHeight);
      // scrollHeight still counts the text while the note is clipped shut; drop the padding that is mid-transition.
      const text = items[active].querySelector<HTMLElement>(".mist-step-note p");
      const note = text ? text.scrollHeight - (parseFloat(getComputedStyle(text).paddingBottom) || 0) : 0;
      element.style.setProperty("--ind-y", `${closed.slice(0, active).reduce((sum, h) => sum + h + gap, 0)}px`);
      element.style.setProperty("--ind-h", `${closed[active] + note + 14}px`);
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(element);
    return () => observer.disconnect();
  }, [active]);
  const looping = step.loop === true;
  const [loopStage, setLoopStage] = useStageLoop(section, 2, looping, 1700, 4);
  useEffect(() => { if (looping) setLoopStage(2); }, [looping, setLoopStage]);
  // The apps step keeps the window on the plan underneath the screenshot.
  const stage = looping ? loopStage : step.stage ?? 1;

  return (
    <Chapter id="agents" title={agentsTitle} side="end" ownHead>
      <div ref={section} className="mist-steps" style={{ "--steps-count": WORK_STEPS.length } as CSSProperties}>
        {/* Pinned, the heading holds with the steps, and the whole scene centers in the viewport. */}
        <div className="mist-steps-pin">
          <ChapterHead id="agents" title={agentsTitle} />
          <div className="mist-steps-stage" data-reveal-stagger>
            <ol ref={list} className="mist-steps-list" aria-label="Agent steps">
              {WORK_STEPS.map((item, index) => (
                <li key={item.title}>
                  <button type="button" aria-current={index === active ? "step" : undefined} onClick={() => choose(index)}>
                    {item.title}
                  </button>
                  <div className="mist-step-note" aria-hidden={index !== active}><p>{item.note}{item.link && <><a className="mist-note-link" href={item.link.href} target="_blank" rel="noreferrer" tabIndex={index === active ? 0 : -1}>{item.link.text}</a>.</>}</p></div>
                </li>
              ))}
            </ol>
            <div className="mist-steps-media" data-apps={step.apps === true}>
              <div className="mist-steps-window"><ScaledWindow stage={stage} after={step.after} width={900} height={620} /></div>
              <div className="mist-steps-apps" aria-hidden={!step.apps}><IntegrationsShot /></div>
            </div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
