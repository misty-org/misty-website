import { marketingCopy } from "@/content/marketingCopy";
import { AnchorDrawer } from "./components/AnchorDrawer";
import { ClosingCta } from "./sections/ClosingCta";
import { EcosystemStrip } from "./sections/EcosystemStrip";
import { FeatureShowcase } from "./sections/FeatureShowcase";
import { Foundation } from "./sections/Foundation";
import { Hero } from "./sections/Hero";
import { ResourcePreview } from "./sections/ResourcePreview";

export default function Home() {
  const copy = marketingCopy.home;

  return (
    <div className="home-page">
      <AnchorDrawer />
      <div className="home-scroll-edge-fade" aria-hidden="true" />
      <Hero copy={copy} />
      <div className="home-content-rail">
        <EcosystemStrip />
        <FeatureShowcase />
        <Foundation />
        <ResourcePreview />
        <ClosingCta copy={copy} />
      </div>
    </div>
  );
}
