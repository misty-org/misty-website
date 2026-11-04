import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import type { DocHeading } from "./docHeadings";

/** Where a section counts as being read: just under the header, past where a jump to it lands. */
const READING_LINE = 100;

function useCurrentHeading(headings: DocHeading[]): string | undefined {
  const [current, setCurrent] = useState<string>();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = headings.flatMap(({ id }) => {
        const section = document.getElementById(id);
        return section ? [section] : [];
      });
      const last = sections[sections.length - 1];
      if (!last) return;
      // A short last section can't scroll up to the line, so over the final stretch the line comes
      // down to meet it, and it is marked exactly at the page's end.
      const remaining = Math.max(
        0,
        document.documentElement.scrollHeight -
          window.innerHeight -
          window.scrollY,
      );
      const shortfall =
        last.getBoundingClientRect().top - remaining - READING_LINE;
      const line = READING_LINE + Math.max(0, shortfall - remaining);
      const reached = sections.filter(
        (section) => section.getBoundingClientRect().top <= line + 1,
      );
      setCurrent((reached[reached.length - 1] ?? sections[0]).id);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  return current;
}

function ContentsList({
  headings,
  current,
}: {
  headings: DocHeading[];
  current?: string;
}) {
  return (
    <ul className="border-l border-border">
      {headings.map(({ id, title }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            aria-current={id === current ? "location" : undefined}
            className="-ml-px block border-l border-transparent py-1.5 pl-4 pr-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current]:border-foreground aria-[current]:text-foreground"
          >
            {title}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** The right-hand panel from 1000px up: every section of the page, with the current one marked. */
export function DocContents({ headings }: { headings: DocHeading[] }) {
  const current = useCurrentHeading(headings);
  if (!headings.length) return null;

  return (
    <nav
      aria-label="On this page"
      className="hidden pt-2.5 min-[1000px]:sticky min-[1000px]:top-[var(--site-nav-height)] min-[1000px]:block min-[1000px]:max-h-[calc(100svh-var(--site-nav-height))] min-[1000px]:self-start min-[1000px]:overflow-y-auto min-[1000px]:[scrollbar-width:thin]"
    >
      <p className="pb-2 text-sm text-muted-foreground">On this page</p>
      <ContentsList headings={headings} current={current} />
    </nav>
  );
}

/** The same list under 1000px, folded under the page's title. Choosing a section closes it. */
export function DocContentsDisclosure({ headings }: { headings: DocHeading[] }) {
  if (!headings.length) return null;

  return (
    <details
      className="group mt-6 rounded-lg border border-border min-[1000px]:hidden"
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) {
          event.currentTarget.open = false;
        }
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm text-foreground [&::-webkit-details-marker]:hidden">
        On this page
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-border p-4">
        <ContentsList headings={headings} />
      </div>
    </details>
  );
}
