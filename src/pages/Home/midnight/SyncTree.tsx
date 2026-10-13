import { useEffect, useMemo, useRef, useState } from "react";
import { SyncTreeDiagram } from "./SyncTreeDiagram";
import { estimate, type Kind, type Measure } from "./syncTreeModel";
import { useTileActive } from "./useTileActive";
import "./syncTree.css";

/** Measures chip text with the page font so labels sit exactly centered. */
function useMeasure(): Measure {
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let live = true;
    document.fonts?.ready.then(() => live && setFontsReady(true));
    return () => { live = false; };
  }, []);
  return useMemo<Measure>(() => {
    const context = fontsReady ? document.createElement("canvas").getContext("2d") : null;
    if (!context) return estimate;
    const family = getComputedStyle(document.body).fontFamily;
    return (text, size) => {
      context.font = `500 ${size}px ${family}`;
      return context.measureText(text).width;
    };
  }, [fontsReady]);
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  return reduced;
}

export function SyncTree() {
  const measure = useMeasure();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  // The tree stays idle until the rope has reached its panel.
  const active = useTileActive(root);
  const wide = useRef<SVGSVGElement>(null);
  const stacked = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<Kind>("vault");
  const diagram = { measure, still: reduced, active, selected, onSelect: setSelected };

  return (
    <div ref={root} id="sync-tree" className="mist-tree" data-idle={!active || undefined} data-mist-scene aria-label="Each device's tree, synced through your encrypted vault">
      <div className="mist-tree-canvas">
        <SyncTreeDiagram layout="wide" svgRef={wide} {...diagram} />
        <SyncTreeDiagram layout="stacked" svgRef={stacked} {...diagram} />
      </div>
    </div>
  );
}
