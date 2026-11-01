import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router";

import { cn } from "@/lib/utils";
import { docsGroupFor, docsPages, type DocsNavItem } from "../docsNav";

function PagerLink({
  item,
  direction,
}: {
  item: DocsNavItem;
  direction: "previous" | "next";
}) {
  const next = direction === "next";
  return (
    <NavLink
      to={item.to}
      className={cn(
        "group flex flex-col gap-1 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        next && "items-end text-right sm:col-start-2",
      )}
    >
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {next ? null : <ArrowLeft aria-hidden="true" className="size-3.5" />}
        {next ? "Next" : "Previous"}
        {next ? <ArrowRight aria-hidden="true" className="size-3.5" /> : null}
      </span>
      <span
        className={cn(
          "text-sm text-foreground",
          item.mono && "font-mono text-[0.8125rem]",
        )}
      >
        {item.label}
      </span>
    </NavLink>
  );
}

/** One docs page: its header, its sections, and links to the pages either side. */
export function DocPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const index = docsPages.findIndex((page) => page.to === pathname);
  const previous = index > 0 ? docsPages[index - 1] : undefined;
  const next =
    index >= 0 && index < docsPages.length - 1
      ? docsPages[index + 1]
      : undefined;

  return (
    <article>
      <header className="border-b border-border pb-8">
        <p className="mb-3 text-sm text-muted-foreground">
          {docsGroupFor(pathname) ?? "Docs"}
        </p>
        <h1 className="text-3xl font-medium tracking-[-0.03em] text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {description}
        </p>
      </header>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-12">
        {children}
      </div>

      {previous || next ? (
        <nav
          aria-label="Docs pages"
          className="mt-16 grid gap-3 border-t border-border pt-8 sm:grid-cols-2"
        >
          {previous ? <PagerLink item={previous} direction="previous" /> : null}
          {next ? <PagerLink item={next} direction="next" /> : null}
        </nav>
      ) : null}
    </article>
  );
}
