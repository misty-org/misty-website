import type { AnchorHTMLAttributes, ReactNode, Ref } from "react";
import { Link, NavLink } from "react-router";

import { siteLink } from "@/lib/site";

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & {
  to: string;
  end?: boolean;
  trail?: boolean;
  state?: unknown;
  className?: string | ((state: { isActive: boolean }) => string);
  children?: ReactNode;
  ref?: Ref<HTMLAnchorElement>;
};

export function SiteLink({ to, end, trail = false, state, className, ...rest }: SiteLinkProps) {
  const target = siteLink(to);
  if ("path" in target && trail) {
    return (
      <Link
        to={target.path}
        state={state}
        className={typeof className === "function" ? className({ isActive: false }) : className}
        {...rest}
      />
    );
  }
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
