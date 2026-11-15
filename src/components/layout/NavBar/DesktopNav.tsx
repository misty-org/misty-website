import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import AccountMenu from "./AccountMenu";
import { navItems, resourceLinks, type NavLinkEntry } from "./navLinks";
import { SiteLink } from "@/components/SiteLink";

/** The app's row states: a light wash on hover, a stronger one on the page you're on or a menu that's open. */
const desktopLinkClass =
  "rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-control-hover hover:text-foreground focus-visible:bg-control-hover focus-visible:text-foreground focus-visible:outline-none";
const desktopLinkActiveClass = "bg-control-active text-cream-bright hover:bg-control-active hover:text-cream-bright";

function DesktopNavLink({ to, label, external }: NavLinkEntry) {
  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={desktopLinkClass}>
        {label}
      </a>
    );
  }
  return (
    <SiteLink
      to={to}
      className={({ isActive }) =>
        cn(
          desktopLinkClass,
          isActive && desktopLinkActiveClass,
        )
      }
    >
      {label}
    </SiteLink>
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
        <DesktopNavLink key={item.to} {...item} />
      ))}

      <DropdownMenu open={resourcesOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            onPointerEnter={openResources}
            onPointerLeave={scheduleClose}
            onPointerDown={(event) => event.preventDefault()}
            onClick={(event) => event.preventDefault()}
            className={cn(
              "h-auto rounded-md bg-transparent px-2 py-1 text-sm font-normal text-muted-foreground hover:bg-control-hover hover:text-foreground aria-expanded:bg-control-active aria-expanded:text-cream-bright",
              resourcesActive && desktopLinkActiveClass,
            )}
          >
            Resources
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          sideOffset={8}
          onPointerEnter={openResources}
          onPointerLeave={scheduleClose}
          onCloseAutoFocus={(event) => event.preventDefault()}
          className="w-40"
        >
          {resourceLinks.map(({ to, label, external }) => (
            <DropdownMenuItem
              key={to}
              asChild
              onSelect={() => setResourcesOpen(false)}
              className="py-1"
            >
              {external ? (
                <a href={to} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              ) : (
                <SiteLink to={to}>{label}</SiteLink>
              )}
            </DropdownMenuItem>
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
          <Button asChild size="sm">
            <SiteLink to="/signin" state={{ from: currentPath }}>Sign in</SiteLink>
          </Button>
        )}
      </div>
    </div>
  );
}
