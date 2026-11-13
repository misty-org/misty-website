import Footer from "@/components/layout/Footer";
import { DownloadSection } from "@/pages/Download/DownloadSection";
import { HomeCtaButtons } from "../components/HomeCtaButtons";
import { ResourcePreview } from "../sections/ResourcePreview";
import { AgentsChapter, MoreChapter } from "./Chapters";
import { SpacesChapter } from "./SpacesChapter";
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

/** The hero screenshot: web pages side by side, with an agent chat and a Space's group chat. */
function HeroDemo() {
  return (
    <div className="mist-container mist-hero-demo">
      <img
        className="mist-hero-screenshot"
        src="/screenshots/home/hero-layout.png"
        alt="Misty with web pages side by side, an agent chat and a Space's group chat."
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
          <h1 id="mist-hero-title" data-write>Build together with AI</h1>
          <p className="mist-hero-lede">
            Misty is one shared workspace where people and agents collaborate. Pick any AI you like, invite your people,
            and see what everyone's agents are doing as it happens.
          </p>
          <HomeCtaButtons className="mist-hero-actions justify-center" />
        </div>
        <HeroDemo />
      </section>
      {/* The story has two parts, work and space, each opened by a one-line interlude, then the rest of the app. */}
      <div id="features">
        <Interlude term="work" before="It does your" after="for you" />
        <AgentsChapter />
        <Interlude term="space" before="Build together in a" />
        <SpacesChapter />
        <MoreChapter />
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
