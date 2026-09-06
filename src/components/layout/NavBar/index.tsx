import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router";
import { Menu, Search, X } from "lucide-react";

import { useAuth } from "@/AuthContext";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toInitials } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { resourceLinks } from "./navLinks";

const COMPACT_WIDTH_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
const EXPAND_WIDTH_EASING = "cubic-bezier(0.8, 0, 0.6, 1)";

function useScrolledNav(threshold = 60) {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > threshold,
  );

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > threshold);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

export default function Navbar({
  onOpenSettings,
  docs,
}: {
  onOpenSettings: () => void;
  docs?: {
    menuOpen: boolean;
    onOpenMenu: () => void;
    onOpenSearch: () => void;
  };
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, sessionReady, logout } = useAuth();
  const me = useUserStore((state) => state.me);
  const scrolled = useScrolledNav(60);

  const displayName = me?.name ?? user?.name ?? "";
  const initials = displayName
    ? toInitials(displayName)
    : (user?.email?.[0]?.toUpperCase() ?? "?");
  const resourcesActive = resourceLinks.some(({ to }) =>
    location.pathname.startsWith(to),
  );

  const navigation = (
    <Collapsible open={mobileOpen} onOpenChange={setMobileOpen} asChild>
      <nav
        aria-label="Primary navigation"
        className={cn(
          "site-pinned-navbar pointer-events-none fixed inset-x-0 z-50 flex justify-center px-[var(--site-gutter)]",
          docs && "docs-navbar",
        )}
      >
        {sessionReady || docs ? (
          <div
            className="pointer-events-auto w-full will-change-[max-width]"
            style={{
              // Normal mode is the smaller width (820px), while scrolled mode expands to full container width.
              maxWidth: docs || scrolled ? "var(--site-content-max)" : "820px",
              transition: docs
                ? undefined
                : `max-width 0.45s ${
                    scrolled ? EXPAND_WIDTH_EASING : COMPACT_WIDTH_EASING
                  }`,
            }}
          >
            <div
              className="rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-surface)] backdrop-blur-xl"
            >
              <div
                className="flex h-12 items-center justify-between px-5"
              >
                <div className="flex items-center gap-2.5">
                  {docs ? (
                    <a
                      href={SITE_URL}
                      aria-label="Misty home"
                      className="flex items-center gap-3 rounded-md text-base font-semibold tracking-[-0.02em] text-[var(--marketing-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--marketing-border-strong)]"
                    >
                      <BrandLogo />
                      <span>Misty</span>
                    </a>
                  ) : (
                    <NavLink
                      to="/"
                      onClick={() => setMobileOpen(false)}
                      aria-label="Misty home"
                      className="flex items-center gap-3 rounded-md text-base font-semibold tracking-[-0.02em] text-[var(--marketing-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--marketing-border-strong)]"
                    >
                      <BrandLogo />
                      <span>Misty</span>
                    </NavLink>
                  )}
                  {docs && (
                    <>
                      <span
                        className="h-[18px] w-px bg-border"
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium text-muted-foreground">
                        Docs
                      </span>
                    </>
                  )}
                </div>

                <DesktopNav
                  currentPath={docs ? "/" : location.pathname}
                  displayName={displayName}
                  email={user?.email ?? ""}
                  initials={initials}
                  resourcesActive={docs ? false : resourcesActive}
                  signedIn={docs ? false : Boolean(user)}
                  onOpenSettings={onOpenSettings}
                  onSignOut={() => logout()}
                  siteOrigin={docs ? SITE_URL : undefined}
                />

                <div className="flex items-center gap-1 md:hidden">
                  {docs && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={docs.onOpenSearch}
                      aria-label="Search documentation"
                    >
                      <Search aria-hidden="true" />
                    </Button>
                  )}
                  <ModeToggle />
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={
                        mobileOpen
                          ? "Close navigation menu"
                          : "Open navigation menu"
                      }
                      aria-controls="mobile-navigation"
                    >
                      {mobileOpen ? (
                        <X aria-hidden="true" />
                      ) : (
                        <Menu aria-hidden="true" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>

              <MobileNav
                currentPath={docs ? "/" : location.pathname}
                signedIn={docs ? false : Boolean(user)}
                onClose={() => setMobileOpen(false)}
                onOpenSettings={onOpenSettings}
                onSignOut={() => logout()}
                siteOrigin={docs ? SITE_URL : undefined}
                docsMenuOpen={docs?.menuOpen}
                onOpenDocsMenu={docs?.onOpenMenu}
              />
            </div>
          </div>
        ) : null}
      </nav>
    </Collapsible>
  );

  return (
    <>
      <div aria-hidden="true" className="h-[calc(var(--site-nav-height)+env(safe-area-inset-top,0px))] shrink-0" />
      {createPortal(navigation, document.body)}
    </>
  );
}
