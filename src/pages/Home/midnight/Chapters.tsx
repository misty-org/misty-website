import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { CircleCheck, FolderOpen, ListTodo, MessagesSquare, NotebookPen, type LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Chapter, ChapterHead } from "./Chapter";
import { ScaledWindow, type Aftermath } from "./MistyWindow";
import { useStageLoop, type Stage } from "./useStageLoop";
import { DeviceMesh } from "./DeviceMesh";
import { ProductImage } from "./ProductImage";
import { SyncTree } from "./SyncTree";

/**
 * The Work and Space parts of the homepage story (the Browser part is in BrowserChapters.tsx):
 * agents in your tabs, the apps they connect, files across devices, then Spaces. Each chapter uses
 * a different layout (a pinned stepper, an orbit, a bento grid, a product tour) so the page keeps
 * changing pace. Claims follow SELLING-POINTS.md and its checklist.
 */

type Size = "narrow" | "wide" | "full";

function Card({ size, id, label, children, visual }: { size: Size; id?: string; label: string; children: ReactNode; visual: ReactNode }) {
  return (
    <article id={id} className="mist-feature-card" data-size={size} data-spotlight>
      <div className="mist-feature-copy"><span className="mist-feature-label">{label}</span>{children}</div>
      {visual}
    </article>
  );
}


const transfers = [
  { name: "Q3 report.pdf", route: "MacBook → Desktop PC", status: "Done", done: 1, moving: false },
  { name: "Photos, 214 items", route: "Desktop PC → Office drive", status: "62% · 48 MB/s", done: .62, moving: true },
  { name: "Project archive.zip", route: "Office drive → MacBook", status: "Paused", done: .3, moving: false },
];
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

/**
 * One beat per capability, each with its own window state. The working beat loops stages 2–4.
 * Claims follow SELLING-POINTS.md: only connected-app workflows run on a schedule, and memory
 * holds only what you ask it to remember.
 */
const AGENT_STEPS: { title: string; text: string; stage: Stage; loop?: boolean; after?: Aftermath }[] = [
  { title: "Ask in one sentence.", text: "Open your agent over any page. It can use the tab you're on, your files, your spaces and your connected apps.", stage: 0 },
  { title: "Approve the plan before anything changes.", text: "It looks around first, then lists every step it will take. Edit the plan or approve it.", stage: 1 },
  { title: "It works across your tabs and apps.", text: "It reads Slack and Gmail and writes into the Launch plan in real tabs. Take over at any point.", stage: 2, loop: true },
  { title: "It asks before it acts for you.", text: "Sending, sharing, deleting and paying always wait for your approval.", stage: 5 },
  { title: "Save what worked as a workflow.", text: "Run it again in one click. Workflows that use your connected apps can also run on a schedule.", stage: 6, after: "workflow" },
  { title: "Pick it up on any device.", text: "Conversations, goals and plans are saved to your account. It remembers only what you ask it to, and goals keep going within your plan's limits.", stage: 6, after: "handoff" },
];
/** Where the stepper pins and follows scroll; elsewhere the steps are tabs. Keep in sync with midnight.css. */
const PINNED = "(min-width: 1000px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

/**
 * A pinned scene: the viewport holds still while scrolling moves through the steps. One step's
 * text shows on the left at a time, the window on the right plays it, and a pill under the window
 * fills segment by segment with the scroll. Elsewhere the segments are buttons that switch steps.
 */
const agentsTitle = <>Agents that work{" "}<span>across your whole browser.</span></>;

export function AgentsChapter() {
  const section = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const looping = AGENT_STEPS[active].loop === true;
  const [loopStage, setLoopStage] = useStageLoop(section, 2, looping, 1700, 4);
  useEffect(() => { if (looping) setLoopStage(2); }, [looping, setLoopStage]);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const media = matchMedia(PINNED);
    let frame = 0;
    const pin = element.querySelector<HTMLElement>(".mist-steps-pin");
    const update = () => {
      frame = 0;
      if (!media.matches || !pin) return;
      // The pin sticks at its `top` (which centers it) and holds until the track runs out.
      const rect = element.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(pin).top) || 0;
      const travel = Math.max(1, rect.height - pin.offsetHeight);
      const progress = Math.min(1, Math.max(0, (top - rect.top) / travel));
      // The fill follows every frame through a CSS variable; only the step change re-renders.
      element.style.setProperty("--steps-progress", progress.toFixed(4));
      setActive(Math.min(AGENT_STEPS.length - 1, Math.floor(progress * AGENT_STEPS.length)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    // The pin's height feeds its centering offset in CSS.
    const resize = new ResizeObserver(() => {
      if (pin) element.style.setProperty("--pin-h", `${pin.offsetHeight}px`);
      schedule();
    });
    if (pin) resize.observe(pin);
    addEventListener("scroll", schedule, { passive: true });
    media.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      removeEventListener("scroll", schedule);
      media.removeEventListener("change", schedule);
    };
  }, []);

  /** Pinned, a step is a place in the scroll; otherwise its segment switches straight to it. */
  const choose = (index: number) => {
    const element = section.current;
    if (!element) return;
    if (!matchMedia(PINNED).matches) {
      element.style.setProperty("--steps-progress", String((index + 1) / AGENT_STEPS.length));
      setActive(index);
      return;
    }
    const pin = element.querySelector<HTMLElement>(".mist-steps-pin");
    const pinTop = pin ? parseFloat(getComputedStyle(pin).top) || 0 : 0;
    const travel = element.offsetHeight - (pin?.offsetHeight ?? innerHeight);
    const top = element.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top - pinTop + travel * (index + 0.5) / AGENT_STEPS.length, behavior: "smooth" });
  };
  const stage = looping ? loopStage : AGENT_STEPS[active].stage;

  return (
    <Chapter id="agents" title={agentsTitle} side="end" ownHead>
      <div ref={section} className="mist-steps" style={{ "--steps-count": AGENT_STEPS.length, "--steps-progress": 1 / AGENT_STEPS.length } as CSSProperties}>
        {/* Pinned, the heading holds with the steps, and the whole scene centers in the viewport. */}
        <div className="mist-steps-pin">
          <ChapterHead id="agents" title={agentsTitle} />
          <div className="mist-steps-stage" data-reveal-stagger>
            <div className="mist-steps-copy" aria-live="polite">
              {AGENT_STEPS.map((step, index) => (
                <div key={step.title} className="mist-steps-beat" data-active={index === active} aria-hidden={index !== active}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
            <div className="mist-steps-media">
              <ScaledWindow stage={stage} after={AGENT_STEPS[active].after} width={900} height={620} />
              <div className="mist-steps-progress" role="group" aria-label="Agent steps">
                {AGENT_STEPS.map((step, index) => (
                  <button key={step.title} type="button" style={{ "--i": index } as CSSProperties}
                    aria-label={`Step ${index + 1}: ${step.title}`} aria-current={index === active ? "step" : undefined}
                    onClick={() => choose(index)}>
                    <i />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

export function SyncChapter() {
  return (
    <Chapter id="sync" title={<>Give each computer its own setup{" "}<span>and keep them all in sync.</span></>}>
      <SyncTree />
      <div className="mist-feature-grid" data-reveal-stagger>
        <Card id="foundation" size="full" label="devices" visual={
          <div className="mist-devices" aria-label="The same Misty workspace on two computers">
            <div className="mist-desktop-device">
              <div className="mist-device-screen"><ProductImage slot="continuity" /></div>
              <div className="mist-monitor-chin"><BrandLogo /></div>
              <div className="mist-monitor-stand" />
            </div>
            <div className="mist-laptop-device">
              <div className="mist-device-screen"><ProductImage slot="continuity" /></div>
              <div className="mist-laptop-base" />
            </div>
          </div>
        }>
          <h3>Each computer keeps its own windows, tabs and layout, and your sign-ins come along.</h3>
          <p className="mist-fine-print">Some sites ask you to sign in again.</p>
        </Card>
      </div>
    </Chapter>
  );
}

/** Why Files is built in. Keep true to SELLING-POINTS.md (point 1). */
const WHY_FILES = [
  ["No context switching.", "Files opens in a tab next to the page you're on."],
  ["No friction.", "Find a file and send it where it needs to go."],
  ["One less app.", "Files from all your computers, in the browser you already use."],
] as const;


/**
 * Files first: the built-in file manager, with the reasons it exists in the same panel. Then the devices it
 * connects, which move files directly, then transfers and the shared clipboard.
 */
export function ToolsChapter() {
  return (
    <Chapter id="tools" side="end" title={<>Open any file{" "}<span>from any of your computers.</span></>}>
      <div className="mist-bento mist-tools-bento" data-reveal-stagger>
        {/* One panel: the file manager, with why it's built in as three short lines beside the screenshot. */}
        <article className="mist-bento-tile mist-files-panel" data-spotlight>
          <div className="mist-files-copy">
            <span className="mist-feature-label">files</span>
            <h3>A file manager for all your devices, built in.</h3>
            <ul className="mist-files-benefits">
              {WHY_FILES.map(([title, text]) => <li key={title}><b>{title}</b> {text}</li>)}
            </ul>
          </div>
          <div className="mist-bento-shot">
            <img src="/screenshots/home/files.webp" alt="Misty's file manager, with quick access, local drives and a home folder" width={2000} height={1258} loading="lazy" decoding="async" />
          </div>
        </article>
      </div>
      {/* Devices, transfers and the shared clipboard side by side, one diagram each. */}
      <div className="mist-bento mist-trio" data-reveal-stagger>
        <article className="mist-bento-tile" data-spotlight>
          <span className="mist-feature-label">operations</span>
          <h3>Data moves peer to peer or through the cloud.</h3>
          <div className="mist-mesh-stage"><DeviceMesh /></div>
          <p className="mist-fine-print">Devices need a shared network or a public tunnel.</p>
        </article>
        <article className="mist-bento-tile" data-spotlight>
          <span className="mist-feature-label">transfers</span>
          <h3>Every transfer in one list. Pause, resume or retry.</h3>
          <div className="mist-sketch-transfers mist-bento-panel" aria-hidden="true">
            {transfers.map(({ name, route, status, done, moving }) => (
              <div key={name}>
                <b>{name}</b>
                <span>{status}</span>
                <small>{route}</small>
                <i style={{ "--done": done } as CSSProperties} data-moving={moving} />
              </div>
            ))}
          </div>
        </article>
        <article className="mist-bento-tile" data-spotlight>
          <span className="mist-feature-label">clipboard</span>
          <h3>Copy on one computer, paste on another.</h3>
          <div className="mist-sketch-clipboard mist-bento-panel" aria-hidden="true">
            <div><span>Copied on MacBook</span><b>Q3 report.pdf, Budget.xlsx</b></div>
            <i>↓</i>
            <div><span>Pasted on Desktop PC</span><b>Documents / Finance</b></div>
          </div>
        </article>
      </div>
    </Chapter>
  );
}

/** The four building blocks of a Space. Each caption ties back to agents or Files. */
const SPACE_APPS: { id: string; name: string; icon: LucideIcon; caption: string }[] = [
  { id: "chat", name: "Chat", icon: MessagesSquare, caption: "People and agents, one thread." },
  { id: "journal", name: "Journal", icon: NotebookPen, caption: "Notes you edit together, live." },
  { id: "planner", name: "Planner", icon: ListTodo, caption: "Tasks, agendas and roadmaps." },
  { id: "library", name: "Library", icon: FolderOpen, caption: "Shared files, also in Files." },
];
const board = [
  ["To do", ["Pick venue", "Book flights"]],
  ["In progress", ["Agenda draft", "Budget"]],
  ["Done", ["Guest list"]],
] as const;
/** How long each app stays up before the tour moves on, until the visitor picks one. */
const TOUR_MS = 6000;

function SpacePane({ id }: { id: string }) {
  switch (id) {
    case "journal":
      return (
        <div className="mist-tour-doc">
          <strong>Offsite plan</strong>
          <p>Arrive Thursday evening and meet in the lobby at 7.<span className="mist-sketch-caret" data-name="Ana" /></p>
          <p>Workshops run Friday morning, with lunch on the terrace.</p>
          <p>Dinner<span className="mist-sketch-caret" data-name="Sam" /></p>
          <ul className="mist-tour-checks">
            <li data-done="true">Book the venue</li>
            <li data-done="true">Send the calendar invite</li>
            <li>Confirm the dinner reservation</li>
            <li>Share the packing list</li>
          </ul>
        </div>
      );
    case "planner":
      return (
        <div className="mist-sketch-board">
          {board.map(([column, items]) => (
            <div key={column}><span>{column}</span>{items.map(item => <p key={item}>{item}</p>)}</div>
          ))}
        </div>
      );
    case "library":
      return <div className="mist-tour-shot"><ProductImage slot="shared" /></div>;
    default:
      return (
        <div className="mist-tour-chat">
          <p><b>Ana</b>Can someone pull flight options for Thursday?</p>
          <p data-agent="true"><b>Ana's agent</b>Found three under $300 and added them to Planner.</p>
          <p><b>Sam</b>Booking the 6 pm one.</p>
          <div className="mist-tour-composer">Message Offsite<i /></div>
        </div>
      );
  }
}

/**
 * A Space, drawn as a window whose sidebar is the tour: each app in the sidebar is a tab. The
 * tour moves on by itself while it's on screen, and stops once the visitor picks an app.
 */
function SpaceTour() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !visible || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setActive(index => (index + 1) % SPACE_APPS.length), TOUR_MS);
    return () => clearTimeout(timer);
  }, [auto, visible, active]);

  // On phones the sidebar becomes a scrolling row; keep the current app in view without moving the page.
  useEffect(() => {
    const tab = root.current?.querySelector<HTMLElement>(".mist-tour-tab[aria-selected=true]");
    const nav = tab?.parentElement;
    if (tab && nav && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: tab.offsetLeft - nav.offsetLeft - 8, behavior: "smooth" });
  }, [active]);

  const pick = (index: number) => {
    setAuto(false);
    setActive(index);
  };
  return (
    <div ref={root} className="mist-tour" data-auto={auto && visible} style={{ "--tour-ms": `${TOUR_MS}ms` } as CSSProperties}>
      <div className="mist-tour-window">
        <div className="mist-tour-bar" aria-hidden="true"><i /><i /><i /><span>Offsite</span></div>
        <div className="mist-tour-body">
          <div className="mist-tour-nav" role="tablist" aria-label="Apps in a space">
            <div className="mist-tour-space" aria-hidden="true"><b>OF</b>Offsite</div>
            {SPACE_APPS.map(({ id, name, icon: Icon }, index) => (
              <button key={id} type="button" role="tab" id={`mist-tour-tab-${id}`} aria-controls={`mist-tour-pane-${id}`}
                aria-selected={index === active} className="mist-tour-tab" onClick={() => pick(index)}>
                <Icon size={16} strokeWidth={1.75} aria-hidden /><span>{name}</span><i key={`${active}-${auto}`} />
              </button>
            ))}
            <div className="mist-tour-people" aria-hidden="true"><i>A</i><i>S</i><i data-agent="true" /><span>3 here</span></div>
          </div>
          <div className="mist-tour-stage">
            {SPACE_APPS.map(({ id, name, caption }, index) => (
              <section key={id} id={`mist-tour-pane-${id}`} role="tabpanel" aria-labelledby={`mist-tour-tab-${id}`}
                className="mist-tour-pane" data-app={id} data-active={index === active} hidden={index !== active}>
                <header><strong>{name}</strong><span>{caption}</span></header>
                <SpacePane id={id} />
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Spaces: what one is, its four apps in a tour, then how agents and the browser use it, and the
 * people in it.
 */
export function SpacesChapter() {
  return (
    <Chapter id="spaces" title={<>A space for{" "}<span>every project.</span></>}>
      <div data-reveal-stagger>
        <article className="mist-bento-tile mist-space-tile" data-spotlight>
          <span className="mist-feature-label">space</span>
          <h3>Invite people in, and everyone works alongside their agents in the same tabs, notes, tasks and files.</h3>
          <SpaceTour />
          <p className="mist-fine-print">Agents can ask each other for help, and each owner decides whether that needs approval. Personal Spaces stay private.</p>
        </article>
      </div>
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

/** What agents can use and how they behave. Keep claims true to misty/src/features/agents/PRODUCT.md. */
const INTEGRATION_CHECKS = [
  "Connect your integrations once.",
  "Add skills your agents follow.",
  "Save what worked as a workflow.",
  "Put workflows on a schedule.",
];

export function IntegrationsChapter() {
  const hub = useRef<HTMLDivElement>(null);
  const shown = useRotatingApps(hub);
  return (
    <Chapter id="integrations" title={<>Connect your apps once{" "}<span>and let agents use them.</span></>}>
      <div className="mist-hub-layout">
        <div className="mist-panel" data-reveal>
          <span className="mist-feature-label">integrations</span>
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
        </div>
        {/* A checklist diagram, like the Engine chapter's: each item checked off along one rail. */}
        <ul className="mist-checklist" data-reveal-stagger>
          {INTEGRATION_CHECKS.map(item => (
            <li key={item}><CircleCheck size={18} strokeWidth={1.75} aria-hidden /><h3>{item}</h3></li>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}
