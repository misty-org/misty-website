import { DownloadSection } from "@/pages/Download/DownloadSection";
import { HomeCtaButtons } from "../components/HomeCtaButtons";
import { ResourcePreview } from "../sections/ResourcePreview";
import { EngineChapter } from "./BrowserChapters";
import { AgentsChapter, IntegrationsChapter, SpacesChapter, SyncChapter, ToolsChapter } from "./Chapters";
import { ScaledDemoWindow } from "./DemoWindow";
import { Equation, Interlude } from "./Interludes";
import { useReveal } from "./useReveal";
import { useMistMotion } from "./useMistMotion";
import "@fontsource-variable/geist-mono";
import "@fontsource/instrument-serif/400-italic.css";
import "./midnight.css";

function Mist() {
  return (
    <div className="mist-atmosphere" aria-hidden="true">
      <div className="mist-cloud mist-cloud-back" />
    </div>
  );
}

/** The hero's window plays one agent task, then hands the demo to the visitor. */
function HeroDemo() {
  return <div className="mist-container mist-hero-demo"><ScaledDemoWindow /></div>;
}

export function MidnightHome() {
  const ref = useMistMotion();
  useReveal(ref);
  return (
    <div ref={ref} className="mist-home">
      <Mist />
      <section id="overview" className="mist-hero" aria-labelledby="mist-hero-title" data-mist-scene>
        <div className="mist-container mist-hero-copy">
          <h1 id="mist-hero-title"><span>The <mark className="mist-marker" data-tone="yellow">agentic</mark> browser</span>{" "}<span>for building your <mark className="mist-marker" data-tone="blue">workspace</mark></span></h1>
          <HomeCtaButtons className="mist-hero-actions justify-center" />
        </div>
        <HeroDemo />
      </section>
      {/* The story is an equation: browser + work + space. Each part opens with a one-line
          interlude, each leads into the next, and the finale lines the terms up. */}
      <div id="features">
        <Interlude term="browser" before="It starts as a" />
        <EngineChapter />
        <SyncChapter />
        <Interlude term="work" lead="Browsing is only half the job." before="Then come the tools for your" />
        <AgentsChapter />
        <IntegrationsChapter />
        <ToolsChapter />
        <Interlude term="space" lead="Work can get messy sometimes." before="Bring it all together in a" />
        <SpacesChapter />
      </div>
      <div className="mist-resources mist-section" data-mist-scene data-reveal>
        <ResourcePreview />
      </div>
      {/* The equation sums up the story right before the call to download, which always closes the page. */}
      <Equation />
      <DownloadSection />
    </div>
  );
}
