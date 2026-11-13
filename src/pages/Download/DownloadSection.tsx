import { DownloadCtaButton } from "@/pages/Home/components/HomeCtaButtons";

/** The closing section: one last call to download, with the hero's button. /download scrolls here. */
export function DownloadSection() {
  return (
    <section id="download" className="mist-closing" aria-labelledby="download-title" data-mist-scene>
      {/* One staggered reveal: the heading rises first and the button follows, never the other way round. */}
      <div className="mist-container mist-close-content" data-reveal-stagger>
        <h2 id="download-title">Ready to build together with AI?</h2>
        <div className="mist-closing-actions flex flex-wrap items-center justify-center gap-3">
          <DownloadCtaButton />
        </div>
      </div>
    </section>
  );
}
