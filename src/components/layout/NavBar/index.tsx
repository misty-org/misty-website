import { useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";
import { Menu, X } from "lucide-react";

import { useAuth } from "@/AuthContext";
import { BrandLogo } from "@/components/brand/BrandLogo";
import NavbarSocials from "./NavbarSocials";
import { Collapsible, CollapsibleTrigger, DocsCrumb, IconButton } from "@misty/ui";
import { toInitials } from "@/lib/format";
import { useUserStore } from "@/store/user_store";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { resourceLinks } from "./nav_links";
import { SiteLink } from "@/components/SiteLink";
import { DocsNavbarControls } from "@/pages/Docs";
import { isDocsHost } from "@/lib/site";
import { avatarOutline } from "@/lib/avatar_decoration";
import { avatarUrl } from "@/pages/AccountSettings/api";

export default function Navbar({
  onOpenSettings,
}: {
  onOpenSettings: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, sessionReady, logout } = useAuth();
  const me = useUserStore((state) => state.me);

  const displayName = me?.username ?? user?.name ?? "";
  const initials = displayName
    ? toInitials(displayName)
    : (user?.email?.[0]?.toUpperCase() ?? "?");
  const picture = me?.avatar_version ? avatarUrl(me.avatar_version) : undefined;
  const outline = avatarOutline(me?.avatar_decoration);
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
            className="pointer-events-auto w-full"
            style={{ maxWidth: "var(--site-content-max)" }}
          >
            <div
              className="rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-surface)]"
            >
              <div
                className="flex h-12 items-center justify-between px-5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex min-w-0 items-center gap-0.5">
                    <DocsCrumb asChild flush>
                      <SiteLink to="/" trail onClick={() => setMobileOpen(false)} aria-label="Misty home">
                        <BrandLogo />
                        <span>Misty</span>
                      </SiteLink>
                    </DocsCrumb>
                    {isDocsHost() ? (
                      <>
                        <span aria-hidden="true" className="text-page text-muted-foreground">
                          /
                        </span>
                        <DocsCrumb asChild>
                          <SiteLink to="/docs" trail onClick={() => setMobileOpen(false)}>
                            Docs
                          </SiteLink>
                        </DocsCrumb>
                        <span aria-hidden="true" className="text-page text-muted-foreground">
                          /
                        </span>
                        <DocsNavbarControls />
                      </>
                    ) : null}
                  </div>
                  <span aria-hidden="true" className="ml-1 hidden h-5 w-px bg-border md:block" />
                  <NavbarSocials />
                </div>

                <DesktopNav
                  currentPath={location.pathname}
                  displayName={displayName}
                  email={user?.email ?? ""}
                  initials={initials}
                  picture={picture}
                  outline={outline}
                  resourcesActive={resourcesActive}
                  signedIn={Boolean(user)}
                  onOpenSettings={onOpenSettings}
                  onSignOut={() => logout()}
                />

                <div className="flex items-center gap-1 md:hidden">
                  <CollapsibleTrigger asChild>
                    <IconButton
                      label={
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
                    </IconButton>
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
