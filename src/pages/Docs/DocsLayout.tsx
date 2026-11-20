import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Button, Disclosure } from "@misty/ui";

import { docsPagePath } from "@/lib/site";
import { docsGroupFor, docsNav, docsPages } from "./docsNav";
import { SiteLink } from "@/components/SiteLink";

function DocsNavList({
  path,
  open,
  onOpenChange,
}: {
  path: string;
  open: string[];
  onOpenChange: (groups: string[]) => void;
}) {
  return (
    <div className="flex flex-col">
      {docsNav.map((group) => (
        <Disclosure
          key={group.label}
          kind="row"
          title={group.label}
          open={open.includes(group.label)}
          onOpenChange={(next) =>
            onOpenChange(
              next ? [...open, group.label] : open.filter((label) => label !== group.label),
            )
          }
        >
          <ul className="ml-3 grid gap-0.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <Button
                  asChild
                  variant="quiet"
                  justify="start"
                  data-active={item.to === path}
                  className="w-full"
                >
                  <SiteLink to={item.to} end>
                    {item.label}
                  </SiteLink>
                </Button>
              </li>
            ))}
          </ul>
        </Disclosure>
      ))}
    </div>
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
        <div className="rounded-lg border border-border px-2 py-1 min-[1100px]:hidden">
          <Disclosure
            key={pathname}
            kind="row"
            title={current ? `Docs / ${current.label}` : "Docs"}
          >
            <div className="border-t border-border pt-2">
              <DocsNavList path={path} open={open} onOpenChange={setOpen} />
            </div>
          </Disclosure>
        </div>
        <div className="hidden min-[1100px]:block">
          <DocsNavList path={path} open={open} onOpenChange={setOpen} />
        </div>
      </nav>
      <div key={pathname} className="page-transition min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
