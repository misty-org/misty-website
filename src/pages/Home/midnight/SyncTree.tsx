import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { SyncTreeDiagram } from "./SyncTreeDiagram";
import { estimate, type Kind, type Measure } from "./syncTreeModel";
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

type Slide = { key: string; label: string; title: string; visual: ReactNode };

/** Placeholder sketches for each layout control; swap in real diagrams later. */
const LAYOUT_SLIDES: Slide[] = [
  {
    key: "orientation", label: "orientation", title: "Put the navbar and tabs on any edge.",
    visual: (
      <div className="mist-layout-demo" data-demo="orientation">
        <div className="mist-layout-frame" data-edge="top"><i data-part="bar" /><i data-part="tabs" /><i data-part="page" /></div>
        <div className="mist-layout-frame" data-edge="side"><i data-part="bar" /><i data-part="tabs" /><i data-part="page" /></div>
      </div>
    ),
  },
  {
    key: "windows", label: "virtual windows", title: "Switch whole sets of tabs with virtual windows.",
    visual: (
      <div className="mist-layout-demo" data-demo="windows">
        {["Launch", "Research", "Personal"].map((name, index) => (
          <div key={name} className="mist-layout-frame" style={{ "--depth": index } as CSSProperties}><span>{name}</span><i data-part="page" /></div>
        ))}
      </div>
    ),
  },
  {
    key: "tabs", label: "tabs", title: "Group tabs and keep them in order.",
    visual: (
      <div className="mist-layout-demo" data-demo="tabs">
        <div className="mist-layout-group"><i /><i /><i /></div>
        <i /><i />
      </div>
    ),
  },
  {
    key: "panes", label: "panes", title: "Split a tab into panes.",
    visual: (
      <div className="mist-layout-demo" data-demo="panes">
        <div className="mist-layout-frame"><i /><i /><i /></div>
      </div>
    ),
  },
];

/**
 * Steps through the layout controls on a sliding track. The arrows move one slide; the dots
 * jump straight to one.
 */
function LayoutSlider() {
  const [index, setIndex] = useState(0);
  const count = LAYOUT_SLIDES.length;
  const step = (by: number) => setIndex(current => (current + by + count) % count);
  const nameAt = (offset: number) => LAYOUT_SLIDES[(index + offset + count) % count].label;
  return (
    <article className="mist-tree-card mist-tree-explain" aria-roledescription="carousel" aria-label="Layouts">
      <div className="mist-tree-viewport">
        <div className="mist-tree-track" style={{ "--slide": index } as CSSProperties}>
          {LAYOUT_SLIDES.map((slide, position) => {
            const current = position === index;
            return (
              <div key={slide.key} className="mist-tree-slide" aria-roledescription="slide" aria-label={`${position + 1} of ${count}: ${slide.label}`}
                aria-hidden={!current} inert={!current}>
                <span className="mist-feature-label">{slide.label}</span>
                <h3>{slide.title}</h3>
                <div className="mist-layout-visual" aria-hidden="true">{slide.visual}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mist-tree-pager">
        <button type="button" className="mist-tree-arrow" aria-label={`Previous: ${nameAt(-1)}`} onClick={() => step(-1)}>
          <ChevronLeft size={20} strokeWidth={1.75} aria-hidden />
        </button>
        {/* The current slide stretches into a capsule; its neighbours shrink back to dots. */}
        <div className="mist-tree-dots">
          {LAYOUT_SLIDES.map((slide, position) => (
            <button key={slide.key} type="button" className="mist-tree-dot-button" data-active={position === index}
              aria-label={`${position + 1} of ${count}: ${slide.label}`} aria-current={position === index ? "step" : undefined}
              onClick={() => setIndex(position)} />
          ))}
        </div>
        <button type="button" className="mist-tree-arrow" aria-label={`Next: ${nameAt(1)}`} onClick={() => step(1)}>
          <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
        </button>
        <span className="sr-only" aria-live="polite">{index + 1} of {count}: {LAYOUT_SLIDES[index].label}</span>
      </div>
    </article>
  );
}

export function SyncTree() {
  const measure = useMeasure();
  const reduced = useReducedMotion();
  const wide = useRef<SVGSVGElement>(null);
  const stacked = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<Kind>("vault");
  const diagram = { measure, still: reduced, selected, onSelect: setSelected };

  return (
    <div id="sync-tree" className="mist-tree" data-mist-scene>
      <div className="mist-tree-grid" data-reveal-stagger>
        <article className="mist-tree-card mist-tree-diagram" aria-label="Each device's tree, synced through your encrypted vault">
          <span className="mist-feature-label">sync</span>
          <h3>Everything is encrypted on your device before it syncs, so only your devices can read it.</h3>
          <div className="mist-tree-canvas">
            <SyncTreeDiagram layout="wide" svgRef={wide} {...diagram} />
            <SyncTreeDiagram layout="stacked" svgRef={stacked} {...diagram} />
          </div>
          <p className="mist-fine-print">Misty never tracks, shares, or reads any of your data.</p>
        </article>
        <LayoutSlider />
      </div>
    </div>
  );
}
