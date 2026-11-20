import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";
import { useLocation } from "react-router";

import { docsPagePath } from "@/lib/site";
import { cn } from "@/lib/utils";
import { docsGroupFor, docsPages, type DocsNavItem } from "../docsNav";
import { DocContents, DocContentsDisclosure } from "./DocContents";
import { readDocHeadings, type DocHeading } from "./docHeadings";
import { SiteLink } from "@/components/SiteLink";

function PagerLink({
  item,
  direction,
  fromGroup,
}: {
  item: DocsNavItem;
  direction: "previous" | "next";
  fromGroup?: string;
}) {
  const next = direction === "next";
  const group = docsGroupFor(item.to);
  const Chevron = next ? ChevronRight : ChevronLeft;
  return (
    <SiteLink
      to={item.to}
      className={cn(
        "group flex min-w-0 max-w-[48%] items-end gap-2 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        next && "ml-auto flex-row-reverse text-right",
      )}
    >
      <Chevron
        aria-hidden="true"
        className="mb-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
      />
      <span className="grid min-w-0 gap-2">
        <span className="text-caption text-muted-foreground">
          {next ? "Next" : "Previous"}
        </span>
        <span className="truncate text-page leading-6 text-foreground">
          {group !== fromGroup ? (
            <span className="hidden text-muted-foreground sm:inline">
              {group} /{" "}
            </span>
          ) : null}
          {item.label}
        </span>
      </span>
    </SiteLink>
  );
}

/**
 * One docs page: its title and sections, links to the pages either side that stay on screen,
 * and the page's contents beside it. Under 1000px the contents fold under the title.
 */
export function DocPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const pathname = docsPagePath(useLocation().pathname);
  const pages = docsPages;
  const index = pages.findIndex((page) => page.to === pathname);
  const previous = index > 0 ? pages[index - 1] : undefined;
  const next =
    index >= 0 && index < pages.length - 1 ? pages[index + 1] : undefined;
  const group = docsGroupFor(pathname);

  const [headings, setHeadings] = useState<DocHeading[]>([]);
  const articleRef = useCallback((article: HTMLElement | null) => {
    if (article) setHeadings(readDocHeadings(article));
  }, []);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-x-8 min-[1100px]:grid-cols-[minmax(0,1fr)_clamp(10.625rem,16.7vw,15rem)]">
      <article
        ref={articleRef}
        className="mx-auto w-full min-w-0 max-w-[48rem] pt-8 min-[1100px]:pt-[3.625rem]"
      >
        <h1 className="text-[2rem] font-medium leading-10 tracking-[-0.04em] text-foreground sm:text-[2.5rem] sm:leading-12">
          {title}
        </h1>
        <DocContentsDisclosure headings={headings} />

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-12 text-page leading-[1.6875rem] text-foreground/90">
          {children}
        </div>

        {previous || next ? (
          <nav
            aria-label="Docs pages"
            className="sticky bottom-0 z-10 -mx-4 mt-16 flex gap-4 bg-background px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-4 sm:mx-0 sm:px-0 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-8 before:bg-gradient-to-t before:from-background before:to-transparent"
          >
            {previous ? (
              <PagerLink item={previous} direction="previous" fromGroup={group} />
            ) : null}
            {next ? (
              <PagerLink item={next} direction="next" fromGroup={group} />
            ) : null}
          </nav>
        ) : null}
      </article>
      <DocContents headings={headings} />
    </div>
  );
}
