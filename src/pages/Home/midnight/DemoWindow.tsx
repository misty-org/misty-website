import { useEffect, useLayoutEffect, useRef, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { ArrowUp, Check, CornerDownRight, Square } from "lucide-react";
import { SCENARIOS, TABS, UNKNOWN_REPLY, type TabId } from "./demoScript";
import { DocPage, GmailPage, PageFrame, SlackPage } from "./demoPages";
import { PanelHead, Rail, ScaledFrame, StepList, WindowBar, type StepState } from "./MistyWindow";
import { isBusy, useDemo } from "./useDemo";

/**
 * The hero's Misty window, which visitors can use. It plays the launch task once on its own and
 * stops where the agent asks for approval; from there the visitor can approve, switch tabs or ask
 * something else. Everything runs against the sample world in demoScript, never a real account.
 */

/** Below this scale the text is too small to type into, so the composer is read-only. */
const TYPEABLE_SCALE = 0.6;

function DemoWindow({ typeable }: { typeable: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const [state, act] = useDemo(root);
  const { phase, scenario, step, world, tab, draft } = state;
  const busy = isBusy(phase);
  const current = scenario?.steps[step];
  const finalApproval = scenario?.steps.find(item => item.approve)?.approve;
  const resting = phase === "done" || phase === "declined" || phase === "stopped" || phase === "unknown" || (phase === "idle" && state.touched);
  const suggestions = SCENARIOS.filter(item => !(phase === "done" && item === scenario));

  const stateOf = (index: number): StepState => {
    if (index < step) return "done";
    if (index === step) return busy ? "active" : "skipped";
    return phase === "declined" || phase === "stopped" ? "skipped" : "next";
  };

  // Keep the newest message in view.
  useEffect(() => {
    const element = thread.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [phase, step, state.asked]);

  // The composer grows with what's typed.
  useLayoutEffect(() => {
    const element = input.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [draft]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    act.ask(draft);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) submit(event);
  };

  const page: Record<TabId, ReactNode> = {
    doc: <DocPage writing={world.docWriting} written={world.docWritten} />,
    slack: <SlackPage world={world} />,
    gmail: <GmailPage world={world} />,
  };

  return (
    <div ref={root} className="mw" data-interactive role="group" aria-label="Try Misty: a demo with sample Google Docs, Slack and Gmail tabs">
      <WindowBar active={tab} onOpen={act.openTab} />
      <div className="mw-body">
        <Rail />
        <PageFrame url={TABS.find(item => item.id === tab)!.url} agent={busy && current?.tab === tab}>{page[tab]}</PageFrame>
        <aside className="mw-panel">
          <PanelHead />
          <div ref={thread} className="mw-thread" aria-live="polite">
            {state.asked && <p key={state.asked + scenario?.id} className="mw-you">{state.asked}</p>}
            {scenario && <StepList steps={scenario.steps} stateOf={stateOf} />}
            {(phase === "approval" || phase === "sending") && current?.approve && (
              <div className="mw-approve">
                <span className="mw-mono">Needs your approval</span>
                <p>{current.approve.ask} <b>{current.approve.target}</b>{current.approve.after}</p>
                <div className="mw-actions">
                  <button type="button" className="mw-primary" onClick={act.approve} disabled={phase === "sending"}>Approve</button>
                  <button type="button" onClick={act.decline} disabled={phase === "sending"}>Not now</button>
                </div>
              </div>
            )}
            {phase === "done" && scenario?.answer && (
              <div className="mw-answer"><p>{scenario.answer.lead}</p><ul>{scenario.answer.items.map(item => <li key={item}>{item}</li>)}</ul></div>
            )}
            {phase === "done" && !scenario?.answer && finalApproval && <p className="mw-done"><Check size={13} strokeWidth={2.5} /> {finalApproval.done}</p>}
            {phase === "declined" && current?.approve && <p className="mw-note">{current.approve.declined}</p>}
            {phase === "stopped" && <p className="mw-note">Stopped. Your tabs are yours again.</p>}
            {phase === "unknown" && <p className="mw-note">{UNKNOWN_REPLY}</p>}
            {resting && (
              <div className="mw-suggest">
                {phase !== "unknown" && <span className="mw-mono">Try asking</span>}
                {suggestions.map(item => (
                  <button key={item.id} type="button" onClick={() => act.ask(item.prompt)}><CornerDownRight size={13} />{item.suggestion}</button>
                ))}
              </div>
            )}
          </div>
          <form className="mw-composer" data-typing={phase === "typing"} onSubmit={submit}>
            <textarea
              ref={input} rows={1} value={draft} aria-label="Ask Misty" placeholder="Ask Misty to do something…"
              readOnly={!typeable} tabIndex={typeable ? undefined : -1}
              onFocus={act.touch} onChange={event => act.setDraft(event.target.value)} onKeyDown={onKeyDown}
            />
            {busy && !draft.trim()
              ? <button type="button" className="mw-send" aria-label="Stop" onClick={act.stop}><Square size={10} fill="currentColor" /></button>
              : <button type="submit" className="mw-send" aria-label="Send" disabled={!draft.trim()}><ArrowUp size={15} strokeWidth={2.5} /></button>}
          </form>
        </aside>
      </div>
    </div>
  );
}

export function ScaledDemoWindow() {
  return <ScaledFrame>{scale => <DemoWindow typeable={scale >= TYPEABLE_SCALE} />}</ScaledFrame>;
}
