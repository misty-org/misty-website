import { DOCS_URL } from "@/lib/site";

export interface NavLinkEntry {
  to: string;
  label: string;
  external?: boolean;
}

export const navItems: NavLinkEntry[] = [
  { to: "/download", label: "Download" },
  { to: "/pricing", label: "Pricing" },
];

export const resourceLinks: NavLinkEntry[] = [
  ...(import.meta.env.DEV ? [{ to: DOCS_URL, label: "Docs", external: true }] : []),
  { to: "/blog", label: "Blog" },
  { to: "/changelog", label: "Changelog" },
  { to: "/roadmap", label: "Roadmap" },
];
