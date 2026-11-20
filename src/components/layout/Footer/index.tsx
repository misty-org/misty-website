import { useLocation } from "react-router";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";
import { columns, legalLinks, socialLinks } from "./footerLinks";
import { SiteLink } from "@/components/SiteLink";
import { isHomePath } from "@/pages/Home/useSectionRoute";

const linkClass =
  "w-fit text-control leading-6 text-foreground transition-opacity hover:opacity-75 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function FooterColumns() {
  return (
    <>
      {columns.map((column) => (
        <nav
          key={column.label}
          aria-label={`${column.label} footer links`}
          className="flex flex-col gap-1.5"
        >
          <h2 className="mb-1 text-control font-medium text-muted-foreground">
            {column.label}
          </h2>
          {column.links.map((link) =>
            link.external ? (
              <a
                key={link.text}
                href={link.to}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {link.text}
              </a>
            ) : (
              <SiteLink key={link.text} to={link.to} className={linkClass}>
                {link.text}
              </SiteLink>
            ),
          )}
        </nav>
      ))}
    </>
  );
}

function FooterSocials() {
  return (
    <div className="mt-5 grid max-w-xs auto-rows-6 grid-cols-2 gap-x-5 gap-y-1">
      {socialLinks.map(({ label, href, icon: Icon, placeholder }) => (
        <a
          key={label}
          href={href}
          target={placeholder ? undefined : "_blank"}
          rel={placeholder ? undefined : "noopener noreferrer"}
          aria-label={placeholder ? `${label} link placeholder` : label}
          className="group grid h-6 w-fit grid-cols-[1.25rem_auto] items-center gap-2 text-control leading-none text-foreground transition-opacity hover:opacity-75 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon aria-hidden="true" className="size-4 justify-self-center" />
          <span className="leading-none">{label}</span>
        </a>
      ))}
    </div>
  );
}

export default function Footer({ className }: { className?: string } = {}) {
  const location = useLocation();

  return (
    <footer
      className={cn(
        "relative z-10",
        isHomePath(location.pathname) && "home-content-rail",
        className,
      )}
    >
      <div className="site-container py-6">
        <div className="px-1.5">
          <div className="grid gap-y-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-x-12 lg:gap-x-20">
            <div>
              <SiteLink
                to="/"
                aria-label="Misty footer"
                className="flex w-fit items-center gap-2 text-title font-semibold tracking-[-0.035em] text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <BrandLogo />
                <span>Misty</span>
              </SiteLink>
              <FooterSocials />
            </div>

            <div className="grid grid-cols-2 gap-x-12 sm:gap-x-20 lg:gap-x-24">
              <FooterColumns />
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 pt-3 text-center text-control text-muted-foreground sm:flex-row sm:justify-center sm:gap-x-8">
            <span>
              &copy; {new Date().getFullYear()} Misty. All rights reserved.
            </span>
            <nav
              aria-label="Legal"
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1"
            >
              {legalLinks.map((link) => (
                <SiteLink
                  key={link.to}
                  to={link.to}
                  className="text-foreground transition-opacity hover:opacity-75 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.text}
                </SiteLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
