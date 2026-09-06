import { useReveal } from "@/hooks/useReveal";
import type { MarketingCopy } from "@/content/marketingCopy";
import { HomeCtaButtons } from "../components/HomeCtaButtons";

export function ClosingCta({ copy }: { copy: MarketingCopy["home"] }) {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="get-started"
      ref={ref}
      aria-labelledby="closing-cta-title"
      className="reveal flex scroll-mt-24 flex-col justify-center bg-background py-20 sm:py-24"
    >
      <div className="site-container">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="closing-cta-title"
            className="text-balance text-3xl font-semibold tracking-[-0.03em] text-[var(--marketing-foreground)] sm:text-4xl"
          >
            {copy.ctaTitle}
          </h2>
          <HomeCtaButtons className="mt-8 justify-center" />
        </div>
      </div>
    </section>
  );
}
