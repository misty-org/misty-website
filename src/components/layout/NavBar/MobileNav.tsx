
import { Button } from "@/components/ui/button";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { navItems, resourceLinks, type NavLinkEntry } from "./navLinks";
import { SiteLink } from "@/components/SiteLink";

const mobileLinkClass =
  "-mx-3 rounded-md px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-control-hover hover:text-foreground focus-visible:bg-control-hover focus-visible:text-foreground focus-visible:outline-none";

function MobileNavLink({
  link,
  onNavigate,
}: {
  link: NavLinkEntry;
  onNavigate: () => void;
}) {
  if (link.external) {
    return (
      <a
        href={link.to}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={mobileLinkClass}
      >
        {link.label}
      </a>
    );
  }

  return (
    <SiteLink
      to={link.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(mobileLinkClass, isActive && "bg-control-active text-cream-bright")
      }
    >
      {link.label}
    </SiteLink>
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
              onNavigate={onClose}
            />
          ))}

          <span className="pt-5 text-sm text-foreground">Resources</span>
          {resourceLinks.map((link) => (
            <MobileNavLink
              key={link.to}
              link={link}
              onNavigate={onClose}
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
