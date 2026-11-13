import { useEffect, useRef, type CSSProperties } from "react";
import { Chapter, ChapterHead } from "./Chapter";
import { ScaledWindow } from "./MistyWindow";
import { useStageLoop, type Stage } from "./useStageLoop";
import { usePinnedSteps } from "./usePinnedSteps";

/**
 * The Work part of the homepage story: any AI, the apps it connects to and the browser it works
 * in, plus the closing chapter on the Lab, the Studio and where things run. Spaces is in
 * SpacesChapter.tsx. Each chapter uses a different layout so the page keeps changing pace.
 */

/**
 * The Work part as one pinned scene: one task, start to finish, with the connected apps in the
 * middle. Most steps show a window state (the working step loops stages 2–4); the apps step swaps
 * the window for the Integrations screenshot. Claims follow misty/src/features/agents.
 */
type WorkStep = { title: string; note: string; link?: { text: string; href: string }; stage?: Stage; loop?: boolean; apps?: boolean };
const WORK_STEPS: WorkStep[] = [
  { title: "Pick any AI you like.", note: "Claude Code, Codex, Antigravity, OpenCode and more, side by side. Misty installs it, helps you sign in and keeps your past chats.", stage: 0 },
  // The screenshot fades the window back, so it keeps the opening prompt underneath.
  { title: "Connect your apps once.", note: "Agents use the apps you sign in to, through the app's own sign-in or your own key from ", link: { text: "Composio", href: "https://composio.dev" }, stage: 0, apps: true },
  { title: "Ask in one sentence.", note: "Describe the task in plain words.", stage: 0 },
  { title: "Watch it work live.", note: "It works on web pages in its own browser. Take over whenever you want.", stage: 2, loop: true },
  { title: "Approve what matters.", note: "Choose how much it does on its own. In Manual mode it asks before every change.", stage: 5 },
];
const agentsTitle = <>Agents that work across{" "}<span>your apps, while you watch.</span></>;

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
  // The apps step keeps the window on the prompt underneath the screenshot.
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
              <div className="mist-steps-window"><ScaledWindow stage={stage} width={900} height={620} /></div>
              <div className="mist-steps-apps" aria-hidden={!step.apps}><IntegrationsShot /></div>
            </div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

/** The rest of the app in three short points: the Lab, the Studio, and what runs where. */
const MORE_POINTS: { title: string; text: string }[] = [
  { title: "The Lab", text: "Make notebooks from your sources, with summaries, mind maps, flashcards, quizzes and audio overviews." },
  { title: "The Studio", text: "A 3D room where you see your agents, and your teammates' agents, at work." },
  { title: "Your computer, your keys", text: "Agents, their model calls and their chats run on your computer, with your own keys. A Space lives on a Misty server: Misty Pro, or one you run yourself." },
];

export function MoreChapter() {
  return (
    <Chapter id="more" title={<>More in Misty:{" "}<span>the Lab, the Studio, and what runs where.</span></>}>
      <div className="mist-points" data-reveal-stagger>
        {MORE_POINTS.map(point => (
          <div key={point.title}>
            <h3>{point.title}</h3>
            <p>{point.text}</p>
          </div>
        ))}
      </div>
    </Chapter>
  );
}
