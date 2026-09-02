import { DOCS_URL } from "@/lib/site";

export interface NavLinkEntry {
  to: string;
  label: string;
  external?: boolean;
}

export const navItems: NavLinkEntry[] = [
  { to: "/download", label: "Download" },
  { to: "/extensions", label: "Extensions" },
  { to: "/pricing", label: "Pricing" },
];

export const resourceLinks: NavLinkEntry[] = [
  { to: DOCS_URL, label: "Docs", external: true },
  { to: "/blog", label: "Blog" },
  { to: "/changelog", label: "Changelog" },
  { to: "/roadmap", label: "Roadmap" },
];
