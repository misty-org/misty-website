import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";
import { Menu, X } from "lucide-react";

import { useAuth } from "@/AuthContext";
import { BrandLogo } from "@/components/brand/BrandLogo";
import NavbarSocials from "./NavbarSocials";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toInitials } from "@/lib/format";
import { useUserStore } from "@/store/userStore";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { resourceLinks } from "./navLinks";
import { SiteLink } from "@/components/SiteLink";

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
}: {
  onOpenSettings: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, sessionReady, logout } = useAuth();
  const me = useUserStore((state) => state.me);
  const scrolled = useScrolledNav(60);

  const displayName = me?.username ?? user?.name ?? "";
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
        className="site-pinned-navbar pointer-events-none fixed inset-x-0 z-50 flex justify-center px-[var(--site-gutter)]"
      >
        {sessionReady ? (
          <div
            className="pointer-events-auto w-full will-change-[max-width]"
            style={{
              // Start at full container width and compact the bar after scrolling.
              maxWidth: scrolled ? "51.25rem" : "var(--site-content-max)",
              transition: `max-width 0.45s ${
                scrolled ? COMPACT_WIDTH_EASING : EXPAND_WIDTH_EASING
              }`,
            }}
          >
            <div
              // Solid, so links stay readable over any content.
              className="rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-surface)]"
            >
              <div
                className="flex h-12 items-center justify-between px-5"
              >
                <div className="flex items-center gap-2.5">
                  <SiteLink
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Misty home"
                    className="flex items-center gap-3 rounded-md text-base font-semibold tracking-[-0.02em] text-[var(--marketing-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--marketing-border-strong)]"
                  >
                    <BrandLogo />
                    <span>Misty</span>
                  </SiteLink>
                  {/* The socials sit beside the logo, split from it by a hairline; NavbarSocials hides them on phones. */}
                  <span aria-hidden="true" className="ml-1 hidden h-5 w-px bg-border md:block" />
                  <NavbarSocials />
                </div>

                <DesktopNav
                  currentPath={location.pathname}
                  displayName={displayName}
                  email={user?.email ?? ""}
                  initials={initials}
                  resourcesActive={resourcesActive}
                  signedIn={Boolean(user)}
                  onOpenSettings={onOpenSettings}
                  onSignOut={() => logout()}
                />

                <div className="flex items-center gap-1 md:hidden">
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
                currentPath={location.pathname}
                signedIn={Boolean(user)}
                onClose={() => setMobileOpen(false)}
                onOpenSettings={onOpenSettings}
                onSignOut={() => logout()}
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
