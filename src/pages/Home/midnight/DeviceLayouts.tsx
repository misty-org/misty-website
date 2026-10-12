import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import "./deviceLayouts.css";

/**
 * Two computers, each holding its own layout. Their screens step through the layout controls
 * (tabs on top or down the side, tab groups, split panes) out of step with each other, so the two
 * never match. Placeholder sketches until real captures exist.
 */
const LAYOUTS = [
  { key: "panes", name: "Split panes" },
  { key: "top", name: "Tabs on top" },
  { key: "groups", name: "Tab groups" },
  { key: "side", name: "Tabs on the side" },
] as const;
type LayoutKey = (typeof LAYOUTS)[number]["key"];

const STEP_MS = 2800;

function useLayoutStep() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setStep(current => current + 1), STEP_MS);
    return () => clearInterval(timer);
  }, []);
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
  const step = useLayoutStep();
  const desktop = LAYOUTS[step % LAYOUTS.length];
  const laptop = LAYOUTS[(step + 1) % LAYOUTS.length];
  return (
    <div className="mist-device-layouts">
      <div className="mist-devices" role="img" aria-label="Two computers, each with its own Misty layout">
        <div className="mist-desktop-device">
          <div className="mist-device-screen"><ScreenSketch layout={desktop.key} /></div>
          <div className="mist-monitor-chin"><BrandLogo /></div>
          <div className="mist-monitor-stand" />
        </div>
        <div className="mist-laptop-device">
          <div className="mist-device-screen"><ScreenSketch layout={laptop.key} /></div>
          <div className="mist-laptop-base" />
        </div>
      </div>
      <p className="mist-device-names" aria-hidden="true">
        <span>Desktop · <b key={desktop.key}>{desktop.name}</b></span>
        <span>Laptop · <b key={laptop.key}>{laptop.name}</b></span>
      </p>
    </div>
  );
}
