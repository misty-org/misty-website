import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Button, DropdownMenu, DropdownMenuContent, MenuItem, MenuTrigger } from "@misty/ui";

import { siteLink } from "@/lib/site";
import AccountMenu from "./AccountMenu";
import { navItems, resourceLinks, type NavLinkEntry } from "./navLinks";
import { SiteLink } from "@/components/SiteLink";

/** A quiet button for each page: it washes on hover and stays pressed on the page you're on. */
function DesktopNavLink({ to, label, currentPath }: NavLinkEntry & { currentPath: string }) {
  return (
    <Button asChild variant="quiet" data-active={currentPath.startsWith(to)}>
      <SiteLink to={to}>{label}</SiteLink>
    </Button>
  );
}

export default function DesktopNav({
  currentPath,
  displayName,
  email,
  initials,
  resourcesActive,
  signedIn,
  onOpenSettings,
  onSignOut,
}: {
  currentPath: string;
  displayName: string;
  email: string;
  initials: string;
  resourcesActive: boolean;
  signedIn: boolean;
  onOpenSettings: () => void;
  onSignOut: () => void;
}) {
  const navigate = useNavigate();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openResources = () => {
    cancelClose();
    setResourcesOpen(true);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setResourcesOpen(false), 100);
  };

  useEffect(
    () => () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    },
    [],
  );

  return (
    <div className="hidden items-center gap-1 md:flex">
      {navItems.filter(({ external }) => !external).map((item) => (
        <DesktopNavLink key={item.to} {...item} currentPath={currentPath} />
      ))}

      <DropdownMenu open={resourcesOpen} modal={false}>
        <MenuTrigger
          label="Resources"
          chevron={false}
          data-active={resourcesActive}
          onPointerEnter={openResources}
          onPointerLeave={scheduleClose}
          onPointerDown={(event) => event.preventDefault()}
          onClick={(event) => event.preventDefault()}
        />
        <DropdownMenuContent
          align="center"
          sideOffset={8}
          width="sm"
          onPointerEnter={openResources}
          onPointerLeave={scheduleClose}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          {resourceLinks.map(({ to, label, external }) => (
            <MenuItem
              key={to}
              label={label}
              onSelect={() => {
                setResourcesOpen(false);
                if (external) {
                  window.open(to, "_blank", "noopener,noreferrer");
                  return;
                }
                const target = siteLink(to);
                if ("path" in target) navigate(target.path);
                else window.location.assign(target.href);
              }}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="ml-3 flex items-center gap-2 border-l border-border pl-4">
        {signedIn ? (
          <AccountMenu
            displayName={displayName}
            email={email}
            initials={initials}
            onOpenSettings={onOpenSettings}
            onSignOut={onSignOut}
          />
        ) : (
          <Button asChild variant="primary">
            <SiteLink to="/signin" state={{ from: currentPath }}>Sign in</SiteLink>
          </Button>
        )}
      </div>
    </div>
  );
}
