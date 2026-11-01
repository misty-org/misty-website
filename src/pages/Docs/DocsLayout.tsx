import { ChevronDown } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router";

import { PublicPage } from "@/components/marketing";
import { cn } from "@/lib/utils";
import { docsNav, docsPages } from "./docsNav";

function DocsNavList() {
  return (
    <div className="grid gap-7">
      {docsNav.map((group) => (
        <div key={group.label}>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {group.label}
          </p>
          <ul className="grid gap-0.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    cn(
                      "block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      item.mono && "font-mono text-[0.8125rem]",
                      isActive && "bg-muted font-medium text-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * The docs section: a page list on the left and the page on the right. On a
 * phone the list folds into a disclosure above the page.
 */
export default function DocsLayout() {
  const { pathname } = useLocation();
  const current = docsPages.find((page) => page.to === pathname);

  return (
    <PublicPage>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Docs" className="lg:sticky lg:top-28 lg:self-start">
          <details
            key={pathname}
            className="group rounded-lg border border-border lg:hidden"
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
            <div className="border-t border-border px-2 py-4">
              <DocsNavList />
            </div>
          </details>
          <div className="hidden lg:block">
            <DocsNavList />
          </div>
        </nav>
        <div className="min-w-0 max-w-3xl">
          <Outlet />
        </div>
      </div>
    </PublicPage>
  );
}
