import Footer from "@/components/layout/Footer";
import { DownloadSection } from "@/pages/Download/DownloadSection";
import { HomeCtaButtons } from "../components/HomeCtaButtons";
import { UseCasesChapter } from "./UseCases";
import { EngineCarousel } from "./EngineCarousel";
import { FeaturesChapter } from "./FeatureTiles";
import { HomeFaq } from "./HomeFaq";
import { HomeGoals } from "./HomeGoals";
import { useReveal } from "./use_reveal";
import { useMistMotion } from "./use_mist_motion";
import "./midnight.css";

const SHOW_MIST = false;

function Mist() {
  return (
    <div className="mist-atmosphere" aria-hidden="true">
      <div className="mist-cloud mist-cloud-back" />
    </div>
  );
}

function HeroDemo() {
  return (
    <div className="mist-container mist-hero-demo">
      <img
        className="mist-hero-screenshot"
        src="/screenshots/home/hero-layout.png"
        alt="Misty with web pages side by side, an agent chat and a space's group chat."
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
          <h1 id="mist-hero-title">Build together with AI</h1>
          <p className="mist-hero-lede">
            A collaborative environment where people and their agents learn, work and create together. Bring any engine,
            build in spaces you share, and explore what others have made.
          </p>
          <HomeCtaButtons className="mist-hero-actions justify-center" />
        </div>
        <HeroDemo />
        <EngineCarousel />
      </section>
      <div id="features">
        <FeaturesChapter />
      </div>
      <UseCasesChapter />
      <HomeGoals />
      <HomeFaq />
      <DownloadSection />
      <Footer className="bg-transparent" />
    </div>
  );
}
