import type { AnchorHTMLAttributes, ReactNode, Ref } from "react";
import { NavLink } from "react-router";

import { siteLink } from "@/lib/site";

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & {
  to: string;
  end?: boolean;
  /** Router state for a link on this host. */
  state?: unknown;
  className?: string | ((state: { isActive: boolean }) => string);
  children?: ReactNode;
  ref?: Ref<HTMLAnchorElement>;
};

/**
 * NavLink for any page of the site or the docs. A link to the other host (the docs from
 * mistysys.com, or the site from docs.mistysys.com) becomes a plain link there.
 */
export function SiteLink({ to, end, state, className, ...rest }: SiteLinkProps) {
  const target = siteLink(to);
  if ("path" in target) {
    return <NavLink to={target.path} end={end} state={state} className={className} {...rest} />;
  }
  return (
    <a
      href={target.href}
      className={typeof className === "function" ? className({ isActive: false }) : className}
      {...rest}
    />
  );
}
