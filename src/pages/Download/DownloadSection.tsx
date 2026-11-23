import { DownloadCtaButton } from "@/pages/Home/components/HomeCtaButtons";

export function DownloadSection() {
  return (
    <section id="download" className="mist-closing" aria-labelledby="download-title" data-mist-scene>
      <div className="mist-container mist-close-content" data-reveal-stagger>
        <h2 id="download-title">Ready to build together with AI?</h2>
        <div className="mist-closing-actions flex flex-wrap items-center justify-center gap-3">
          <DownloadCtaButton />
        </div>
      </div>
    </section>
  );
}
