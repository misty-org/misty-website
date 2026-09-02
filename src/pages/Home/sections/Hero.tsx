import { type CSSProperties, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import { MistyAppMockup } from "@/components/marketing/appchrome";
import { ScreenshotSlot } from "@/components/marketing/previews";
import { Button } from "@/components/ui/button";
import type { MarketingCopy } from "@/content/marketingCopy";
import { easeOut, useScrollProgress } from "@/hooks/useScrollProgress";
import { WEB_APP_URL } from "@/lib/site";
import { HomeCtaButtons } from "../components/HomeCtaButtons";

const TYPE_DELAY_MS = 110;
const DELETE_DELAY_MS = 70;
const WORD_HOLD_MS = 2_200;
const WORD_SWAP_MS = 320;

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

type TypingPhase = "typing" | "holding" | "deleting";

function useEnhancedHeroMotion() {
  const query = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
  const [enabled, setEnabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => setEnabled(event.matches);

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return enabled;
}

function useTypingRotation(words: readonly string[]) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState(words[0] ?? "");
  const [phase, setPhase] = useState<TypingPhase>("holding");
  const [isInView, setIsInView] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "120px" },
    );

    observer.observe(heading);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => setIsPageVisible(!document.hidden);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (
      prefersReducedMotion ||
      !isInView ||
      !isPageVisible ||
      words.length < 2
    ) {
      return;
    }

    const word = words[wordIndex] ?? "";
    let delay = TYPE_DELAY_MS;
    let advance = () => setTypedWord(word.slice(0, typedWord.length + 1));

    if (phase === "holding") {
      delay = WORD_HOLD_MS;
      advance = () => setPhase("deleting");
    } else if (phase === "deleting" && typedWord.length > 0) {
      delay = DELETE_DELAY_MS;
      advance = () => setTypedWord(word.slice(0, typedWord.length - 1));
    } else if (phase === "deleting") {
      delay = WORD_SWAP_MS;
      advance = () => {
        setWordIndex((index) => (index + 1) % words.length);
        setPhase("typing");
      };
    } else if (typedWord.length >= word.length) {
      advance = () => setPhase("holding");
    }

    const timeout = window.setTimeout(advance, delay);
    return () => window.clearTimeout(timeout);
  }, [
    isInView,
    isPageVisible,
    phase,
    prefersReducedMotion,
    typedWord,
    wordIndex,
    words,
  ]);

  return {
    headingRef,
    isWordComplete: prefersReducedMotion || phase === "holding",
    typedWord: prefersReducedMotion ? (words[0] ?? "") : typedWord,
  };
}

export function Hero({ copy }: { copy: MarketingCopy["home"] }) {
  const { ref: scrollRef, progress } = useScrollProgress<HTMLDivElement>();
  const enhancedMotion = useEnhancedHeroMotion();
  const { headingRef, isWordComplete, typedWord } = useTypingRotation(
    copy.heroTitleWords,
  );
  const longestWord = copy.heroTitleWords.reduce(
    (longest, word) => (word.length > longest.length ? word : longest),
    "",
  );
  const copyProgress = easeOut(clamp((progress - 0.02) / 0.42));
  const copyOpacityProgress = easeOut(clamp((progress - 0.08) / 0.36));
  // Keep the product hidden on arrival, then crossfade it in as the headline
  // fades so the opening viewport belongs entirely to the hero copy.
  const expansionProgress = easeOut(clamp((progress - 0.08) / 0.74));
  const productRevealProgress = copyOpacityProgress;
  const copyOpacity = 1 - copyOpacityProgress;
  const copyHidden = enhancedMotion && copyOpacity < 0.05;
  const productHidden = enhancedMotion && productRevealProgress < 0.05;
  const scrollStyle = {
    "--hero-copy-opacity": copyOpacity,
    "--hero-copy-scale": 1 + 2.4 * copyProgress,
    "--hero-copy-shift": `${-8 - 6 * copyProgress}svh`,
    "--hero-shot-top": `${64 - 58.5 * expansionProgress}svh`,
    "--hero-shot-height": `${44 + 28 * expansionProgress}svh`,
    "--hero-shot-radius": `${18 - 8 * expansionProgress}px`,
    "--hero-product-opacity": productRevealProgress,
    "--hero-shot-scale": 0.72 + 0.24 * expansionProgress,
  } as CSSProperties;

  return (
    <section className="home-content-rail relative overflow-x-clip">
      <div ref={scrollRef} className="hero-scroll-track">
        <div className="hero-scroll-stage">
          <div className="hero-scroll-layout site-container" style={scrollStyle}>
            <div
              className="hero-scroll-copy relative z-10 flex min-w-0 flex-col items-center text-center"
              aria-hidden={copyHidden}
              inert={copyHidden ? true : undefined}
            >
              <div className="hero-scroll-zoom-group flex flex-col items-center">
                <h1
                  ref={headingRef}
                  aria-label={copy.heroTitle}
                  className="hero-animate w-fit max-w-full text-[clamp(2.65rem,6vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[var(--marketing-foreground)]"
                >
                  <span aria-hidden="true">
                    <span className="block text-center text-[var(--marketing-muted)]">
                      {copy.heroTitleLead}
                    </span>
                    <span className="mt-2 inline-grid max-w-full text-center text-[var(--marketing-foreground)] [grid-template-areas:'word']">
                      <span
                        className="invisible [grid-area:word]"
                        aria-hidden="true"
                      >
                        {longestWord}
                      </span>
                      <span className="whitespace-nowrap [grid-area:word]">
                        {typedWord}
                        <span
                          className={`typing-cursor${isWordComplete ? " typing-cursor-blinking" : ""}`}
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </span>
                </h1>

                <HomeCtaButtons className="hero-animate hero-animate-delay-2 mt-8 justify-center" />
              </div>
            </div>

            <div className="hero-scroll-shot pointer-events-none min-w-0">
              <ScreenshotSlot slot="home-dashboard" eager>
                <MistyAppMockup
                  view="space"
                  bodyClass="h-[300px] sm:h-[380px] lg:h-[440px]"
                />
              </ScreenshotSlot>
            </div>

            <div
              className="hero-scroll-final-cta relative z-20"
              aria-hidden={productHidden}
              inert={productHidden ? true : undefined}
            >
              <Button
                asChild
                size="lg"
                className="h-11 rounded-full bg-[var(--marketing-foreground)] px-6 text-sm text-[var(--marketing-surface)] shadow-lg shadow-black/10 hover:opacity-85"
              >
                <a href={WEB_APP_URL}>
                  Try the web app
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
