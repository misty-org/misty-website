import { useEffect, useRef, useState, type RefObject } from "react";
import { useTileActive } from "./useTileActive";
import "./deviceLayouts.css";

/**
 * One Misty window, shuffling through the layout controls: tabs on top or down the side, tab groups
 * and split panes. A placeholder sketch until real captures exist.
 */
const LAYOUTS = [
  { key: "panes", name: "Split panes" },
  { key: "top", name: "Tabs on top" },
  { key: "groups", name: "Tab groups" },
  { key: "side", name: "Tabs on the side" },
] as const;
type LayoutKey = (typeof LAYOUTS)[number]["key"];

const STEP_MS = 1800;

function useLayoutStep(root: RefObject<Element | null>) {
  const [step, setStep] = useState(0);
  // The layouts only start stepping once the rope has reached this panel.
  const active = useTileActive(root);
  useEffect(() => {
    if (!active || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setStep(current => current + 1), STEP_MS);
    return () => clearInterval(timer);
  }, [active]);
  return step;
}

/** A Misty window drawn in blocks: the toolbar, the tab strip and up to three panes. */
function ScreenSketch({ layout }: { layout: LayoutKey }) {
  return (
    <div className="mist-screen" data-layout={layout} aria-hidden="true">
      <i data-part="bar" />
      <div data-part="tabs"><span data-part="group"><i /><i /><i /></span><i /><i /></div>
      <i data-part="pane" data-pane="1" />
      <i data-part="pane" data-pane="2" />
      <i data-part="pane" data-pane="3" />
    </div>
  );
}

export function DeviceLayouts() {
  const root = useRef<HTMLDivElement>(null);
  const step = useLayoutStep(root);
  const layout = LAYOUTS[step % LAYOUTS.length];
  return (
    <div className="mist-device-layouts" role="img" aria-label="A Misty window shuffling between tabs on top, tabs on the side, tab groups and split panes">
      <ScreenSketch layout={layout.key} />
    </div>
  );
}
