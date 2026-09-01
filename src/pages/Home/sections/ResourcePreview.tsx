import { useEffect, useRef } from "react";
import { NavLink } from "react-router";

import { posts } from "@/pages/Blog/data";
import { changelog } from "@/pages/Changelog/data";
import { phases, type PhaseStatus } from "@/pages/Roadmap/data";

const roadmapOrder: PhaseStatus[] = ["development", "pilot", "available"];

const roadmapLabels: Record<PhaseStatus, string> = {
  development: "Planned",
  pilot: "In progress",
  available: "Shipped",
};

const previewLinkClass =
  "text-xs font-medium text-[var(--marketing-muted)] transition-colors hover:text-[var(--marketing-foreground)] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function phase(progress: number, start: number, end: number) {
  const position = Math.min(1, Math.max(0, (progress - start) / (end - start)));
  return position * position * (3 - 2 * position);
}

function setResourceProgress(section: HTMLElement, progress: number) {
  const header = phase(progress, 0, 0.24);
  const shell = phase(progress, 0.08, 0.5);
  const parts = [
    phase(progress, 0.22, 0.55),
    phase(progress, 0.3, 0.63),
    phase(progress, 0.38, 0.71),
  ];
  const style = section.style;

  style.setProperty("--resource-header-opacity", `${header}`);
  style.setProperty("--resource-header-y", `${(1 - header) * 12}px`);
  style.setProperty("--resource-shell-opacity", `${shell}`);
  style.setProperty("--resource-shell-y", `${(1 - shell) * 24}px`);
  style.setProperty("--resource-shell-scale", `${0.985 + shell * 0.015}`);
  style.setProperty("--resource-shell-clip", `${(1 - shell) * 8}%`);

  parts.forEach((part, index) => {
    const key = index + 1;
    style.setProperty(`--resource-part-${key}-opacity`, `${part}`);
    style.setProperty(`--resource-part-${key}-y`, `${(1 - part) * 12}px`);
  });
}

function useResourceScrub() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-resource-preview]"),
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (reducedMotion.matches) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.92;
      const distance = viewportHeight * 0.57;

      sections.forEach((section) => {
        const progress = Math.min(
          1,
          Math.max(0, (start - section.getBoundingClientRect().top) / distance),
        );
        setResourceProgress(section, progress);
      });
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return ref;
}

function PreviewHeader({
  id,
  label,
  to,
}: {
  id: string;
  label: string;
  to: string;
}) {
  return (
    <div
      className="mb-3 flex items-center justify-between gap-6 px-1 sm:mb-4"
      data-resource-header
    >
      <h2
        id={id}
        className="text-base font-medium tracking-[-0.02em] text-[var(--marketing-foreground)] sm:text-lg"
      >
        {label}
      </h2>
      <NavLink to={to} className={previewLinkClass}>
        View all
      </NavLink>
    </div>
  );
}

function BlogPreview() {
  const post = posts[0];

  if (!post) return null;

  return (
    <section
      aria-labelledby="blog-preview-title"
      className="resource-scrub"
      data-resource-preview="blog"
    >
      <div className="site-container">
        <PreviewHeader id="blog-preview-title" label="Blog" to="/blog" />
        <div
          className="overflow-hidden rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-surface)]"
          data-resource-shell
        >
          <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(17rem,0.55fr)]">
            <article className="p-5 sm:p-6" data-resource-part="1">
              <h3 className="max-w-3xl text-balance text-xl font-medium tracking-[-0.03em] text-[var(--marketing-foreground)] sm:text-2xl lg:text-3xl">
                {post.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--marketing-muted)]">
                {post.summary}
              </p>
            </article>
            <aside
              className="border-t border-[var(--marketing-border)] p-5 sm:p-6 lg:border-l lg:border-t-0"
              data-resource-part="2"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-[var(--marketing-border-strong)] px-2.5 py-1 text-xs text-[var(--marketing-foreground)]">
                  {post.tag}
                </span>
                <p className="text-sm text-[var(--marketing-muted)]">
                  {post.date}
                </p>
              </div>
              {post.historicalContext ? (
                <p className="mt-5 border-t border-[var(--marketing-border)] pt-4 text-xs leading-5 text-[var(--marketing-muted)]">
                  Archived: {post.historicalContext}
                </p>
              ) : null}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChangelogPreview() {
  const entry = changelog[0];

  if (!entry) return null;

  return (
    <section
      aria-labelledby="changelog-preview-title"
      className="resource-scrub"
      data-resource-preview="changelog"
    >
      <div className="site-container">
        <PreviewHeader
          id="changelog-preview-title"
          label="Changelog"
          to="/changelog"
        />
        <div
          className="overflow-hidden rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-surface)]"
          data-resource-shell
        >
          <div className="grid lg:grid-cols-[0.55fr_1.25fr_1.2fr]">
            <div
              className="border-b border-[var(--marketing-border)] p-5 sm:p-6 lg:border-b-0 lg:border-r"
              data-resource-part="1"
            >
              <span className="inline-flex rounded-full border border-[var(--marketing-border-strong)] px-2.5 py-1 text-xs text-[var(--marketing-foreground)]">
                {entry.version}
              </span>
              <p className="mt-3 max-w-40 text-sm leading-5 text-[var(--marketing-muted)]">
                {entry.date}
              </p>
            </div>
            <article
              className="border-b border-[var(--marketing-border)] p-5 sm:p-6 lg:border-b-0 lg:border-r"
              data-resource-part="2"
            >
              <h3 className="text-balance text-xl font-medium tracking-[-0.03em] text-[var(--marketing-foreground)] sm:text-2xl">
                {entry.summary}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--marketing-muted)]">
                {entry.groups[0]?.changes[0]}
              </p>
            </article>
            <div
              className="divide-y divide-[var(--marketing-border)]"
              data-resource-part="3"
            >
              {entry.groups.slice(1, 3).map((group) => (
                <div key={group.heading} className="p-5 sm:p-6">
                  <h3 className="text-xs font-medium text-[var(--marketing-foreground)]">
                    {group.heading}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-[var(--marketing-muted)]">
                    {group.changes[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoadmapPreview() {
  return (
    <section
      aria-labelledby="roadmap-preview-title"
      className="resource-scrub"
      data-resource-preview="roadmap"
    >
      <div className="site-container">
        <PreviewHeader
          id="roadmap-preview-title"
          label="Roadmap"
          to="/roadmap"
        />
        <div
          className="overflow-hidden rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-surface)]"
          data-resource-shell
        >
          <div className="grid gap-px bg-[var(--marketing-border)] md:grid-cols-3">
            {roadmapOrder.map((status, index) => {
              const phase = phases.find((item) => item.status === status);

              return (
                <article
                  key={status}
                  className="bg-[var(--marketing-surface)] p-5 sm:p-6"
                  data-resource-part={index + 1}
                >
                  <p className="text-xs text-[var(--marketing-muted)]">
                    {roadmapLabels[status]}
                  </p>
                  <div className="mt-5 space-y-4">
                    {phase?.items.slice(0, 2).map((item) => (
                      <div key={item.title}>
                        <h3 className="text-base font-medium tracking-[-0.02em] text-[var(--marketing-foreground)]">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-5 text-[var(--marketing-muted)]">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ResourcePreview() {
  const ref = useResourceScrub();

  return (
    <section
      ref={ref}
      id="updates"
      aria-label="Updates and resources"
      className="grid scroll-mt-24 gap-10 py-8 sm:gap-12"
    >
      <BlogPreview />
      <ChangelogPreview />
      <RoadmapPreview />
    </section>
  );
}
