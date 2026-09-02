import { NavLink } from "react-router";

import { resourceLinks } from "@/components/layout/NavBar/navLinks";
import { cn } from "@/lib/utils";

export function ResourceNav() {
  return (
    <nav aria-label="Resources" className="flex gap-6 border-b border-border">
      {resourceLinks.map((link) => (
        link.external ? (
          <a
            key={link.to}
            href={link.to}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-transparent py-4 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {link.label}
          </a>
        ) : (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "border-b py-4 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "border-foreground text-foreground"
                  : "border-transparent",
              )
            }
          >
            {link.label}
          </NavLink>
        )
      ))}
    </nav>
  );
}
