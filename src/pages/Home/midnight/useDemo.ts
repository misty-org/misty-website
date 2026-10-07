import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { matchScenario, SCENARIOS, START_WORLD, UNFINISHED, type Scenario, type TabId, type World } from "./demoScript";

/**
 * Runs the hero demo. `typing` is the opening autoplay filling the composer; `working` and
 * `sending` advance on a timer; `approval` waits for the visitor; the rest are at rest.
 */
export type Phase = "idle" | "typing" | "working" | "approval" | "sending" | "done" | "declined" | "stopped" | "unknown";

export type DemoState = {
  phase: Phase;
  scenario: Scenario | null;
  /** What the visitor (or the autoplay) asked. */
  asked: string;
  step: number;
  draft: string;
  tab: TabId;
  world: World;
  /** The visitor has interacted, so the demo is theirs and the autoplay is off. */
  touched: boolean;
};

const STEP_MS = 1400;
const SEND_MS = 700;
const TYPE_MS = 22;
const [AUTOPLAY] = SCENARIOS;

/** Moves to step `index`: opens its tab and applies its start, or ends the run. */
function enter(state: DemoState, index: number): DemoState {
  const step = state.scenario?.steps[index];
  if (!step) return { ...state, step: index, phase: "done" };
  return { ...state, step: index, tab: step.tab, phase: step.approve ? "approval" : "working", world: { ...state.world, ...step.start } };
}

function finish(state: DemoState): DemoState {
  const step = state.scenario?.steps[state.step];
  return enter({ ...state, world: { ...state.world, ...step?.finish } }, state.step + 1);
}

function begin(state: DemoState, asked: string): DemoState {
  const scenario = matchScenario(asked);
  const base = { ...state, asked, draft: "", scenario, step: 0, world: { ...state.world, ...UNFINISHED } };
  if (!scenario) return { ...base, phase: "unknown" };
  return enter({ ...base, world: { ...base.world, ...scenario.reset } }, 0);
}

const IDLE: DemoState = { phase: "idle", scenario: null, asked: "", step: 0, draft: "", tab: "doc", world: START_WORLD, touched: false };

/** Reduced motion opens on the moment the agent asks to post, with the work before it done. */
function waitingForApproval(): DemoState {
  let state = begin(IDLE, AUTOPLAY.prompt);
  while (state.phase === "working") state = finish(state);
  return state;
}

export const isBusy = (phase: Phase) => phase === "working" || phase === "approval" || phase === "sending";

export function useDemo(root: RefObject<HTMLElement | null>) {
  const [reduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [state, setState] = useState<DemoState>(() => (reduced ? waitingForApproval() : IDLE));
  /** Once the visitor touches anything, the autoplay never starts or resumes. */
  const touched = useRef(reduced);

  // Autoplay: once the window is on screen, type the first task and send it.
  useEffect(() => {
    const element = root.current;
    if (!element || touched.current) return;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || touched.current) return;
      observer.disconnect();
      timer = window.setTimeout(() => {
        if (!touched.current) setState(current => (current.phase === "idle" ? { ...current, phase: "typing" } : current));
      }, 1600);
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [root]);

  useEffect(() => {
    const { phase, draft } = state;
    if (phase === "typing") {
      const done = draft.length >= AUTOPLAY.prompt.length;
      const timer = window.setTimeout(() => setState(current => {
        if (current.phase !== "typing") return current;
        return done ? begin(current, AUTOPLAY.prompt) : { ...current, draft: AUTOPLAY.prompt.slice(0, current.draft.length + 2) };
      }), done ? 450 : TYPE_MS * 2);
      return () => clearTimeout(timer);
    }
    if (phase === "working" || phase === "sending") {
      const timer = window.setTimeout(() => setState(current => (current.phase === phase ? finish(current) : current)), phase === "sending" ? SEND_MS : STEP_MS);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const touch = useCallback(() => {
    if (touched.current) return;
    touched.current = true;
    setState(current => ({ ...current, touched: true }));
  }, []);

  const actions = {
    touch,
    ask(text: string) {
      touch();
      if (!text.trim()) return;
      // A new request replaces whatever was running or waiting for approval.
      setState(current => begin(current, text.trim()));
    },
    setDraft(draft: string) {
      touch();
      // Typing over the autoplay takes the composer back.
      setState(current => ({ ...current, draft, phase: current.phase === "typing" ? "idle" : current.phase }));
    },
    openTab(tab: TabId) {
      touch();
      setState(current => ({ ...current, tab }));
    },
    approve() {
      touch();
      setState(current => (current.phase === "approval" ? { ...current, phase: "sending" } : current));
    },
    decline() {
      touch();
      setState(current => {
        const approval = current.scenario?.steps[current.step]?.approve;
        if (current.phase !== "approval" || !approval) return current;
        return { ...current, phase: "declined", world: { ...current.world, ...UNFINISHED, ...approval.decline } };
      });
    },
    stop() {
      touch();
      setState(current => (isBusy(current.phase) ? { ...current, phase: "stopped", world: { ...current.world, ...UNFINISHED } } : current));
    },
  };

  return [state, actions] as const;
}
