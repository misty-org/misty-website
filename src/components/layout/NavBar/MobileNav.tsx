
import { Button, CollapsibleContent, Text } from "@misty/ui";

import { navItems, resourceLinks, type NavLinkEntry } from "./navLinks";
import { SiteLink } from "@/components/SiteLink";

/** A quiet, full-width button for each page, pressed on the page you're on. */
function MobileNavLink({
  link,
  currentPath,
  onNavigate,
}: {
  link: NavLinkEntry;
  currentPath: string;
  onNavigate: () => void;
}) {
  return (
    <Button
      asChild
      variant="quiet"
      justify="start"
      data-active={!link.external && currentPath.startsWith(link.to)}
    >
      {link.external ? (
        <a href={link.to} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
          {link.label}
        </a>
      ) : (
        <SiteLink to={link.to} onClick={onNavigate}>
          {link.label}
        </SiteLink>
      )}
    </Button>
  );
}

export default function MobileNav({
  currentPath,
  signedIn,
  onClose,
  onOpenSettings,
  onSignOut,
}: {
  currentPath: string;
  signedIn: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
}) {
  return (
    <CollapsibleContent
      id="mobile-navigation"
      className="md:hidden"
    >
      <div className="bg-background px-6 py-5 sm:px-10">
        <div className="flex flex-col gap-1">
          {navItems.map((link) => (
            <MobileNavLink
              key={link.to}
              link={link}
              currentPath={currentPath}
              onNavigate={onClose}
            />
          ))}

          <Text size="control" className="px-3 pt-5">
            Resources
          </Text>
          {resourceLinks.map((link) => (
            <MobileNavLink
              key={link.to}
              link={link}
              currentPath={currentPath}
              onNavigate={onClose}
            />
          ))}

          {signedIn ? (
            <>
              <Button
                variant="quiet"
                justify="start"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="mt-4"
              >
                Settings
              </Button>
              <Button
                variant="quiet"
                justify="start"
                onClick={() => {
                  onClose();
                  onSignOut();
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <div className="mt-5">
              <Button asChild variant="primary" className="w-full">
                <SiteLink to="/signin" state={{ from: currentPath }} onClick={onClose}>
                  Sign in
                </SiteLink>
              </Button>
            </div>
          )}

        </div>
      </div>
    </CollapsibleContent>
  );
}
