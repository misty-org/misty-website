import { REPO_URL } from "@/lib/site";

export interface NavLinkEntry {
  to: string;
  label: string;
  external?: boolean;
}

export const navItems: NavLinkEntry[] = [
  { to: "/download", label: "Download" },
  { to: "/docs", label: "Docs" },
  { to: "/pricing", label: "Pricing" },
  { to: REPO_URL, label: "GitHub", external: true },
];

export const resourceLinks: NavLinkEntry[] = [
  { to: "/blog", label: "Blog" },
  { to: "/changelog", label: "Changelog" },
  { to: "/roadmap", label: "Roadmap" },
];
