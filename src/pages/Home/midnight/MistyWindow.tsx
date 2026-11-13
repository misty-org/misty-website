import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Armchair, Check, FlaskConical, Orbit, Search, Settings, UsersRound, Waypoints,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { brand, LAUNCH, TABS, type Step } from "./demoScript";
import { DocPage, PageFrame } from "./demoPages";
import type { Stage } from "./useStageLoop";

/**
 * A rebuilt Misty window, drawn in HTML so it stays sharp at any size: the agent's own browser
 * beside its chat. One agent task plays out in stages: asked, working through connected apps,
 * then waiting for approval before it posts anything.
 */

/** The sidebar's places: agents, the Space, the Studio, the Lab and integrations. */
const RAIL = [UsersRound, Orbit, Armchair, FlaskConical, Waypoints];

function Rail() {
  return (
    <nav className="mw-rail" aria-hidden="true">
      <span className="mw-logo"><BrandLogo className="size-5" /></span>
      {RAIL.map((Icon, index) => <span key={index} data-active={Icon === UsersRound}><Icon size={16} strokeWidth={1.75} /></span>)}
      <span className="mw-rail-end"><Search size={16} strokeWidth={1.75} /><Settings size={16} strokeWidth={1.75} /></span>
    </nav>
  );
}

function PanelHead() {
  return <header className="mw-panel-head"><BrandLogo className="size-4" />Misty</header>;
}

type StepState = "done" | "active" | "next" | "skipped";

function StepList({ steps, stateOf }: { steps: readonly Step[]; stateOf: (index: number) => StepState }) {
  return (
    <ol className="mw-steps">
      {steps.map((step, index) => {
        const state = stateOf(index);
        return (
          <li key={step.text} data-state={state}>
            <span className="mw-step-mark">{state === "done" ? <Check size={11} strokeWidth={3} /> : null}</span>
            <img src={brand(step.icon)} alt="" />{step.text}
          </li>
        );
      })}
    </ol>
  );
}

const LOOP = LAUNCH;

function AgentPanel({ stage }: { stage: Stage }) {
  return (
    <aside className="mw-panel">
      <PanelHead />
      <div className="mw-thread">
        {stage >= 1 && <p className="mw-you">{LOOP.prompt}</p>}
        {stage === 1 && (
          <div className="mw-plan">
            <span className="mw-mono">Plan · nothing changes until you approve</span>
            <ol>{LOOP.steps.map(step => <li key={step.text}><img src={brand(step.icon)} alt="" />{step.text}</li>)}</ol>
            <div className="mw-actions"><b>Approve plan</b><em>Edit</em></div>
          </div>
        )}
        {stage >= 2 && (
          <StepList steps={LOOP.steps} stateOf={index => (stage === 6 || index < stage - 2 ? "done" : index === stage - 2 ? "active" : "next")} />
        )}
        {stage === 5 && (
          <div className="mw-approve">
            <span className="mw-mono">Needs your approval</span>
            <p>Post a 4-line summary to <b>#launch</b> in Slack?</p>
            <div className="mw-actions"><b>Approve</b><em>Not now</em></div>
          </div>
        )}
        {stage === 6 && <p className="mw-done"><Check size={13} strokeWidth={2.5} /> Posted to #launch</p>}
      </div>
      <div className="mw-composer" data-typing={stage === 0}>
        <p>{stage === 0 ? LOOP.prompt : "Ask Misty to do something…"}</p>
        <span className="mw-send" />
      </div>
    </aside>
  );
}

/** The looping, non-interactive window the Agents chapter steps through. */
function MistyWindow({ stage }: { stage: Stage }) {
  return (
    <div className="mw" role="img" aria-label="Misty agent catching up on a launch from Slack and Gmail, updating a Google Doc in its own browser, and asking before it posts">
      <div className="mw-body">
        <Rail />
        <PageFrame tabs={TABS} active="doc" url={TABS[0].url}><DocPage writing={stage === 4} written={stage >= 5} /></PageFrame>
        <AgentPanel stage={stage} />
      </div>
    </div>
  );
}

/** Draws a window at one desktop size and scales it to fit, so phones see the same layout. */
function ScaledFrame({ width = 1180, height = 720, children }: { width?: number; height?: number; children: (scale: number) => ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);
  return (
    <div ref={frame} className="mw-frame" style={{ height: height * scale }}>
      <div className="mw-scaler" style={{ width, height, transform: `scale(${scale})` }}>
        {children(scale)}
      </div>
    </div>
  );
}

/** Memoized: a step change elsewhere in the scene shouldn't re-render the whole window mid-scroll. */
export const ScaledWindow = memo(function ScaledWindow({ stage, width, height }: { stage: Stage; width?: number; height?: number }) {
  return <ScaledFrame width={width} height={height}>{() => <MistyWindow stage={stage} />}</ScaledFrame>;
});
