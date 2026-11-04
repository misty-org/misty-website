import { useEffect, useRef, useState } from "react";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import AccountMenu from "./AccountMenu";
import NavbarSocials from "./NavbarSocials";
import { navItems, resourceLinks, type NavLinkEntry } from "./navLinks";
import { SiteLink } from "@/components/SiteLink";

const desktopLinkClass =
  "rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

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
          isActive && "text-foreground",
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
              "h-auto rounded-md bg-transparent px-2 py-1 text-sm font-normal text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
              resourcesActive && "text-foreground",
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
        <NavbarSocials />

        {/* The theme toggle sits in its own group between the socials and the account. */}
        <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
        <ModeToggle />

        {signedIn ? (
          <AccountMenu
            displayName={displayName}
            email={email}
            initials={initials}
            onOpenSettings={onOpenSettings}
            onSignOut={onSignOut}
          />
        ) : (
          <Button asChild size="sm" className="rounded-full px-4">
            <SiteLink to="/signin" state={{ from: currentPath }}>Sign in</SiteLink>
          </Button>
        )}
      </div>
    </div>
  );
}
