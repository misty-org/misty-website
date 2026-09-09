import { useScrollContinuation } from "@/hooks/useScrollContinuation";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import { MistyAppMockup } from "@/components/marketing/appchrome";
import { ScreenshotSlot } from "@/components/marketing/previews";
import { Button } from "@/components/ui/button";
import type { MarketingCopy } from "@/content/marketingCopy";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { WEB_APP_URL } from "@/lib/site";
import { MobileScreenshotPreview } from "../components/MobileScreenshotPreview";
import { HomeCtaButtons } from "../components/HomeCtaButtons";
import { heroZoomMotion, HERO_ZOOM_DURATION_SCALE } from "../scrollMotion";

const TYPE_DELAY_MS = 110;
const DELETE_DELAY_MS = 70;
const WORD_HOLD_MS = 2_200;
const WORD_SWAP_MS = 320;
const PRODUCT_CTA_REVEAL_MS = 1_000;
const PRODUCT_CTA_IDLE_MS = 3_000;

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

const HERO_STOPS = [0, 1] as const;

export function Hero({ copy }: { copy: MarketingCopy["home"] }) {
  const [productCtaVisible, setProductCtaVisible] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const [productInView, setProductInView] = useState(false);

  const mobileHeadingRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const heading = mobileHeadingRef.current!;
    const copy = heading.closest<HTMLElement>(".hero-scroll-copy")!;
    const media = window.matchMedia("(max-width: 767px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    const measure = () => {
      frame = 0;
      const navBottom = document.querySelector(".site-pinned-navbar")?.getBoundingClientRect().bottom ?? 72;
      // Measure the unscaled parent so the exit motion cannot feed back into itself.
      const top = copy.getBoundingClientRect().top + heading.offsetTop;
      const exit = media.matches ? clamp((navBottom - top) / Math.max(1, heading.offsetHeight * 0.9)) : 0;
      heading.style.setProperty("--mobile-hero-exit", String(exit));
    };
    const update = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    media.addEventListener("change", update);
    const observer = new ResizeObserver(update);
    observer.observe(copy);
    observer.observe(heading);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      media.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setProductInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    if (productRef.current) observer.observe(productRef.current);
    return () => observer.disconnect();
  }, []);
  const productCtaTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const productCtaRevealTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const productCtaHasRevealed = useRef(false);

  function showProductCta() {
    if (!productCtaHasRevealed.current) {
      // Movement during the first hover must not restart the preview delay.
      if (productCtaRevealTimer.current === undefined) {
        productCtaRevealTimer.current = setTimeout(() => {
          productCtaRevealTimer.current = undefined;
          productCtaHasRevealed.current = true;
          showProductCta();
        }, PRODUCT_CTA_REVEAL_MS);
      }
      return;
    }
    clearTimeout(productCtaTimer.current);
    setProductCtaVisible(true);
    productCtaTimer.current = setTimeout(() => setProductCtaVisible(false), PRODUCT_CTA_IDLE_MS);
  }

  function hideProductCta() {
    clearTimeout(productCtaRevealTimer.current);
    productCtaRevealTimer.current = undefined;
    productCtaHasRevealed.current = false;
    clearTimeout(productCtaTimer.current);
    setProductCtaVisible(false);
  }

  useEffect(() => () => {
    clearTimeout(productCtaTimer.current);
    clearTimeout(productCtaRevealTimer.current);
  }, []);

  const { ref: scrollRef, progress: scrollProgress } = useScrollProgress<HTMLDivElement>();
  useScrollContinuation(scrollRef, HERO_STOPS, "(min-width: 768px)", Infinity, HERO_ZOOM_DURATION_SCALE);
  // End the sticky track at the completed expansion, without a final hold.
  const progress = scrollProgress * 0.8;
  const enhancedMotion = useEnhancedHeroMotion();
  const { headingRef, isWordComplete, typedWord } = useTypingRotation(
    copy.heroTitleWords,
  );
  const longestWord = copy.heroTitleWords.reduce(
    (longest, word) => (word.length > longest.length ? word : longest),
    "",
  );
  // The shared scroll follower supplies easing in time; distance stays
  // responsive throughout the zoom instead of accelerating in a burst.
  const motion = heroZoomMotion(progress);
  const copyOpacity = motion.copyOpacity;
  const productRevealProgress = motion.contentOpacity;
  const buttonsOpacity = enhancedMotion ? 1 - clamp(progress / 0.02) : 1;
  const copyHidden = enhancedMotion && copyOpacity < 0.05;
  const productHidden = enhancedMotion && productRevealProgress < 0.05;
  const scrollStyle = {
    "--hero-copy-opacity": copyOpacity,
    "--hero-copy-scale": motion.copyScale,
    "--hero-copy-shift": `${motion.copyShift}svh`,
    "--hero-product-opacity": productRevealProgress,
    "--hero-product-scale": motion.contentScale,
    "--hero-product-shift": `${motion.contentShift}svh`,
    "--hero-shot-radius": `${motion.radius}px`,
  } as CSSProperties;

  return (
    <section
      id="overview"
      className="home-content-rail relative scroll-mt-24 overflow-x-clip"
    >
      <div ref={scrollRef} className="hero-scroll-track">
        <div className="hero-scroll-stage">
          <div className="hero-scroll-layout site-container" style={scrollStyle}>
            <div
              className="hero-scroll-copy relative z-10 flex min-w-0 flex-col items-center text-center"
              aria-hidden={copyHidden}
              inert={copyHidden ? true : undefined}
            >
              <div ref={mobileHeadingRef} className="hero-scroll-zoom-group flex flex-col items-center">
                <h1
                  ref={headingRef}
                  aria-label={copy.heroTitle}
                  className="hero-animate w-fit max-w-full text-[clamp(2.65rem,7.5vw,7.25rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[var(--marketing-foreground)]"
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

              </div>
              <div className="hero-scroll-buttons" style={{ opacity: buttonsOpacity }}
                aria-hidden={buttonsOpacity === 0} inert={buttonsOpacity < 1 ? true : undefined}>
                <p className="hero-animate hero-animate-delay-2 mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--marketing-muted)] sm:text-lg">
                  {copy.heroDescription}
                </p>
                <HomeCtaButtons className="hero-animate hero-animate-delay-2 mt-8 justify-center" />
              </div>
            </div>

            <div
              ref={productRef}
              data-in-view={productInView}
              className="hero-scroll-product relative z-20 min-w-0"
              aria-hidden={productHidden}
              inert={productHidden ? true : undefined}
              onPointerEnter={showProductCta}
              onPointerMove={showProductCta}
              onPointerLeave={hideProductCta}
            >
              <div className="hero-scroll-shot pointer-events-none min-w-0">
                <MobileScreenshotPreview slot="home-dashboard">
                <ScreenshotSlot slot="home-dashboard" eager>
                  <MistyAppMockup
                    view="space"
                    bodyClass="h-[300px] sm:h-[380px] lg:h-[440px]"
                  />
                </ScreenshotSlot>
                </MobileScreenshotPreview>
              </div>

              <div className="hero-scroll-product-cta" data-visible={productCtaVisible}>
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
      </div>
    </section>
  );
}
