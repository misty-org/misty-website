import Footer from "@/components/layout/Footer";
import { DownloadSection } from "@/pages/Download/DownloadSection";
import { HomeCtaButtons } from "../components/HomeCtaButtons";
import { ResourcePreview } from "../sections/ResourcePreview";
import { EngineChapter } from "./BrowserChapters";
import { AgentsChapter, SyncChapter } from "./Chapters";
import { SpacesChapter } from "./SpacesChapter";
import { TileRoute } from "./Tiles";
import { BROWSER_ROUTE } from "./browserRoute";
import { CompareChapter } from "./CompareChapter";
import { HomeFaq } from "./HomeFaq";
import { Interlude } from "./Interludes";
import { useReveal } from "./useReveal";
import { useMistMotion } from "./useMistMotion";
import "@fontsource-variable/geist-mono";
import "@fontsource/instrument-serif/400-italic.css";
import "./midnight.css";

/** The drifting clouds behind the page. Switched off for now, to see the page without them. */
const SHOW_MIST = false;

function Mist() {
  return (
    <div className="mist-atmosphere" aria-hidden="true">
      <div className="mist-cloud mist-cloud-back" />
      {/* Light theme: tints the clouds a smoky gray and clears the texture's thin haze, so pure white shows between them. */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="mist-light-clouds" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="-.7 0 0 0 1  0 -.7 0 0 1  0 0 -.7 0 1  0 0 0 1 0" />
          <feComponentTransfer><feFuncA type="linear" slope="1.5" intercept="-0.3" /></feComponentTransfer>
        </filter>
      </svg>
    </div>
  );
}

/** The hero screenshot shows Misty's split workspace and assistant together. */
function HeroDemo() {
  return (
    <div className="mist-container mist-hero-demo">
      <img
        className="mist-hero-screenshot"
        src="/screenshots/home/hero-layout.png"
        alt="Misty showing a split browser workspace with Space.com, YouTube, Gmail, and its assistant and shared chat panels."
        width={1919}
        height={1029}
        fetchPriority="high"
      />
    </div>
  );
}

export function MidnightHome() {
  const ref = useMistMotion();
  useReveal(ref);
  return (
    <div ref={ref} className="mist-home">
      {SHOW_MIST && <Mist />}
      <section id="overview" className="mist-hero" aria-labelledby="mist-hero-title" data-mist-scene>
        <div className="mist-container mist-hero-copy">
          <h1 id="mist-hero-title" data-write>The agentic browser workspace</h1>
          <HomeCtaButtons className="mist-hero-actions justify-center" />
        </div>
        <HeroDemo />
      </section>
      {/* The story has three parts: browser, work and space. Work and space open with a one-line interlude. */}
      <div id="features">
        {/* One bundle of lines snakes through every Browser tile. */}
        <TileRoute route={BROWSER_ROUTE}>
          <EngineChapter />
          <SyncChapter />
        </TileRoute>
        <Interlude term="work" before="It does your" after="for you" />
        <AgentsChapter />
        {/* Right after the agents, when a visitor is weighing Misty against other AI browsers. */}
        <CompareChapter />
        <Interlude term="space" before="It organizes everything in a" />
        <SpacesChapter />
      </div>
      <HomeFaq />
      <div className="mist-resources mist-section" data-mist-scene data-reveal>
        <ResourcePreview />
      </div>
      {/* The call to download always closes the page. */}
      <DownloadSection />
      {/* Transparent, so the mist keeps drifting behind the footer instead of ending at a white band. */}
      <Footer className="bg-transparent" />
    </div>
  );
}
