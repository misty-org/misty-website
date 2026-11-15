import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { docsPagePath } from "@/lib/site";
import { docsGroupFor, docsNav, docsPages } from "./docsNav";
import { SiteLink } from "@/components/SiteLink";

function DocsNavList({
  open,
  onOpenChange,
}: {
  open: string[];
  onOpenChange: (groups: string[]) => void;
}) {
  return (
    <Accordion type="multiple" value={open} onValueChange={onOpenChange}>
      {docsNav.map((group) => (
        <AccordionItem
          key={group.label}
          value={group.label}
          className="not-last:border-b-0"
        >
          <AccordionTrigger className="h-9 items-center px-2.5 py-0 font-normal text-muted-foreground transition-colors hover:text-foreground hover:no-underline aria-expanded:text-foreground [&>[data-slot=accordion-trigger-icon]]:hidden">
            {group.label}
            <ChevronRight
              aria-hidden="true"
              className="ml-auto size-4 shrink-0 transition-transform group-aria-expanded/accordion-trigger:rotate-90"
            />
          </AccordionTrigger>
          {/* The list may first measure inside a closed disclosure, so its height stays automatic. */}
          <AccordionContent className="h-auto pb-2 [&_a]:no-underline">
            <ul className="ml-3">
              {group.items.map((item) => (
                <li key={item.to}>
                  <SiteLink
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      cn(
                        "flex h-8 items-center truncate rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive && "text-foreground",
                      )
                    }
                  >
                    {item.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/**
 * The docs section, spanning the window under the site's navbar: accordion page sections on the
 * left, then the page and its contents (DocPage). Under 1000px the sections fold into a
 * disclosure above the page. The section holding the current page opens itself, and stays as
 * the reader left it otherwise.
 */
export default function DocsLayout() {
  const { pathname } = useLocation();
  const path = docsPagePath(pathname);
  const current = docsPages.find((page) => page.to === path);
  const group = docsGroupFor(path);
  const [open, setOpen] = useState(group ? [group] : []);
  const [openedGroup, setOpenedGroup] = useState(group);

  if (group !== openedGroup) {
    setOpenedGroup(group);
    if (group && !open.includes(group)) setOpen([...open, group]);
  }

  return (
    <div className="docs-shell site-container grid grid-cols-[minmax(0,1fr)] gap-x-8 pb-24 min-[1100px]:grid-cols-[clamp(12.5rem,18.3vw,16.5rem)_minmax(0,1fr)]">
      <nav
        aria-label="Docs"
        className="pt-2.5 min-[1100px]:sticky min-[1100px]:top-[var(--site-nav-height)] min-[1100px]:max-h-[calc(100svh-var(--site-nav-height))] min-[1100px]:self-start min-[1100px]:overflow-y-auto min-[1100px]:pb-6 min-[1100px]:[scrollbar-width:thin]"
      >
        <details
          key={pathname}
          className="group rounded-lg border border-border min-[1100px]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm text-foreground [&::-webkit-details-marker]:hidden">
            <span>
              <span className="text-muted-foreground">Docs</span>
              {current ? <span> / {current.label}</span> : null}
            </span>
            <ChevronDown
              aria-hidden="true"
              className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="border-t border-border px-2 py-3">
            <DocsNavList open={open} onOpenChange={setOpen} />
          </div>
        </details>
        <div className="hidden min-[1100px]:block">
          <DocsNavList open={open} onOpenChange={setOpen} />
        </div>
      </nav>
      <div key={pathname} className="page-transition min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
