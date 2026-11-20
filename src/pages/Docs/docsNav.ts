import { integrationDocs } from "./integrations";

export interface DocsNavItem {
  to: string;
  label: string;
}

interface DocsNavGroup {
  label: string;
  items: DocsNavItem[];
}

/**
 * Every docs page, in reading order. The sidebar and next/previous links read this. The first
 * groups are for using Misty; Self-hosting is for running a server; Reference holds the tables
 * and fixes people look up.
 */
export const docsNav: DocsNavGroup[] = [
  {
    label: "Introduction",
    items: [{ to: "/docs", label: "What Misty is" }],
  },
  {
    label: "Getting started",
    items: [
      { to: "/docs/quickstart", label: "Quickstart" },
      { to: "/docs/connect", label: "Connect to a server" },
      { to: "/docs/choose-agent", label: "Choose your engine" },
    ],
  },
  {
    label: "Features",
    items: [
      { to: "/docs/chats", label: "Agent chats" },
      { to: "/docs/spaces", label: "Spaces" },
      { to: "/docs/agents", label: "Agents page" },
      { to: "/docs/studio", label: "Studio" },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/docs/plans", label: "Plans and Boosts" },
      { to: "/docs/privacy", label: "Your data" },
    ],
  },
  {
    label: "Self-hosting",
    items: [
      { to: "/docs/self-hosting", label: "Set up a server" },
      { to: "/docs/maintenance", label: "Updates and backups" },
    ],
  },
  {
    label: "Server env files",
    items: integrationDocs.map((doc) => ({
      to: `/docs/self-hosting/${doc.slug}`,
      label: doc.file,
    })),
  },
  {
    label: "Reference",
    items: [
      { to: "/docs/limits", label: "Space levels" },
      { to: "/docs/where-things-run", label: "Where things run" },
      { to: "/docs/troubleshooting", label: "Troubleshooting" },
    ],
  },
];

export const docsPages: DocsNavItem[] = docsNav.flatMap((group) => group.items);

export function docsGroupFor(path: string): string | undefined {
  return docsNav.find((group) => group.items.some((item) => item.to === path))
    ?.label;
}
