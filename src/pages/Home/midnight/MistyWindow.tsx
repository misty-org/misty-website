import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeftRight, Bell, Bot, Check, FolderOpen, Globe, House,
  LayoutPanelLeft, Plus, Puzzle, Search, Settings, X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { brand, SCENARIOS, TABS, type Step, type TabId } from "./demoScript";
import { DocPage, PageFrame } from "./demoPages";
import type { Stage } from "./useStageLoop";

/**
 * A rebuilt Misty window, drawn in HTML so it stays sharp at any size. One agent task plays
 * out in stages: asked, planned, working through connected apps, then waiting for approval
 * before it posts anything. Agents ask before sending, sharing, deleting or paying.
 * The hero's interactive version lives in DemoWindow and shares this chrome.
 */

const RAIL = [House, Globe, FolderOpen, ArrowLeftRight, Bot, LayoutPanelLeft, Puzzle];

/** The tab strip. Given `onOpen`, the tabs are buttons. */
export function WindowBar({ active, onOpen }: { active: TabId; onOpen?: (tab: TabId) => void }) {
  return (
    <div className="mw-bar">
      <span className="mw-lights"><i /><i /><i /></span>
      {TABS.map(tab => {
        const content = <><img src={brand(tab.icon)} alt="" />{tab.label}<X size={12} /></>;
        return onOpen
          ? <button key={tab.id} type="button" className="mw-tab" data-active={tab.id === active} aria-pressed={tab.id === active} onClick={() => onOpen(tab.id)}>{content}</button>
          : <span key={tab.id} className="mw-tab" data-active={tab.id === active}>{content}</span>;
      })}
      <Plus size={14} className="mw-new-tab" />
    </div>
  );
}

export function Rail() {
  return (
    <nav className="mw-rail" aria-hidden="true">
      <span className="mw-logo"><BrandLogo className="size-5" /></span>
      {RAIL.map((Icon, index) => <span key={index} data-active={Icon === Bot}><Icon size={16} strokeWidth={1.75} /></span>)}
      <span className="mw-rail-end"><Search size={16} strokeWidth={1.75} /><Bell size={16} strokeWidth={1.75} /><Settings size={16} strokeWidth={1.75} /></span>
    </nav>
  );
}

export function PanelHead() {
  return <header className="mw-panel-head"><BrandLogo className="size-4" />Misty</header>;
}

export type StepState = "done" | "active" | "next" | "skipped";

export function StepList({ steps, stateOf }: { steps: readonly Step[]; stateOf: (index: number) => StepState }) {
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

const [LOOP] = SCENARIOS;

/** What the finished task leads to: saved as a workflow, or picked up again on another computer. */
export type Aftermath = "workflow" | "handoff";

function AgentPanel({ stage, after }: { stage: Stage; after?: Aftermath }) {
  return (
    <aside className="mw-panel">
      <PanelHead />
      <div className="mw-thread">
        {after === "handoff" && <p className="mw-handoff"><span className="mw-mono">Continued on Studio desktop</span>Started on This Mac · synced to your account</p>}
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
        {stage === 6 && after === "workflow" && (
          <div className="mw-plan mw-saved">
            <span className="mw-mono">Saved as a workflow</span>
            <p><b>Launch catch-up</b>Slack and Gmail into the Launch plan, then #launch</p>
            <div className="mw-actions"><b>Run now</b><em>Schedule</em></div>
          </div>
        )}
      </div>
      <div className="mw-composer" data-typing={stage === 0}>
        <p>{stage === 0 ? LOOP.prompt : "Ask Misty to do something…"}</p>
        <span className="mw-send" />
      </div>
    </aside>
  );
}

/** The looping, non-interactive window the Agents chapter steps through. */
export function MistyWindow({ stage, after }: { stage: Stage; after?: Aftermath }) {
  return (
    <div className="mw" role="img" aria-label="Misty agent catching up on a launch from Slack and Gmail, updating a Google Doc, and asking before it posts">
      <WindowBar active="doc" />
      <div className="mw-body">
        <Rail />
        <PageFrame url={TABS[0].url}><DocPage writing={stage === 4} written={stage >= 5} /></PageFrame>
        <AgentPanel stage={stage} after={after} />
      </div>
    </div>
  );
}

/** Draws a window at one desktop size and scales it to fit, so phones see the same layout. */
export function ScaledFrame({ width = 1180, height = 720, children }: { width?: number; height?: number; children: (scale: number) => ReactNode }) {
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
export const ScaledWindow = memo(function ScaledWindow({ stage, after, width, height }: { stage: Stage; after?: Aftermath; width?: number; height?: number }) {
  return <ScaledFrame width={width} height={height}>{() => <MistyWindow stage={stage} after={after} />}</ScaledFrame>;
});
