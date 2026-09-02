import { NavLink } from "react-router";

import { Button } from "@/components/ui/button";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { navItems, resourceLinks, type NavLinkEntry } from "./navLinks";

const mobileLinkClass =
  "border-b border-border px-0 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function websiteHref(to: string, siteOrigin?: string) {
  if (!siteOrigin || /^https?:\/\//.test(to)) return to;
  return new URL(to, siteOrigin).toString();
}

function MobileNavLink({
  link,
  onNavigate,
  siteOrigin,
}: {
  link: NavLinkEntry;
  onNavigate: () => void;
  siteOrigin?: string;
}) {
  if (link.external || siteOrigin) {
    return (
      <a
        href={websiteHref(link.to, siteOrigin)}
        target={link.external ? "_blank" : undefined}
        rel={link.external ? "noopener noreferrer" : undefined}
        onClick={onNavigate}
        className={mobileLinkClass}
      >
        {link.label}
      </a>
    );
  }

  return (
    <NavLink
      to={link.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(mobileLinkClass, isActive && "text-foreground")
      }
    >
      {link.label}
    </NavLink>
  );
}

export default function MobileNav({
  currentPath,
  signedIn,
  onClose,
  onOpenSettings,
  onSignOut,
  siteOrigin,
  docsMenuOpen,
  onOpenDocsMenu,
}: {
  currentPath: string;
  signedIn: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
  siteOrigin?: string;
  docsMenuOpen?: boolean;
  onOpenDocsMenu?: () => void;
}) {
  return (
    <CollapsibleContent
      id="mobile-navigation"
      className="border-t border-border md:hidden"
    >
      <div className="bg-background px-6 py-5 sm:px-10">
        <div className="flex flex-col gap-1">
          {navItems.map((link) => (
            <MobileNavLink
              key={link.to}
              link={link}
              onNavigate={onClose}
              siteOrigin={siteOrigin}
            />
          ))}

          <span className="pt-5 text-sm text-foreground">Resources</span>
          {resourceLinks.map((link) => (
            <MobileNavLink
              key={link.to}
              link={link}
              onNavigate={onClose}
              siteOrigin={siteOrigin}
            />
          ))}

          {signedIn ? (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="mt-4 justify-start px-0 text-muted-foreground"
              >
                Settings
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  onClose();
                  onSignOut();
                }}
                className="justify-start px-0 text-muted-foreground"
              >
                Sign out
              </Button>
            </>
          ) : (
            <div className="mt-5">
              <Button asChild className="w-full">
                {siteOrigin ? (
                  <a
                    href={websiteHref("/signin", siteOrigin)}
                    onClick={onClose}
                  >
                    Sign in
                  </a>
                ) : (
                  <NavLink
                    to="/signin"
                    state={{ from: currentPath }}
                    onClick={onClose}
                  >
                    Sign in
                  </NavLink>
                )}
              </Button>
            </div>
          )}

          {onOpenDocsMenu && (
            <Button
              type="button"
              variant="ghost"
              className="mt-2 justify-start"
              onClick={() => {
                onClose();
                onOpenDocsMenu();
              }}
            >
              {docsMenuOpen ? "Close docs navigation" : "Browse documentation"}
            </Button>
          )}
        </div>
      </div>
    </CollapsibleContent>
  );
}
