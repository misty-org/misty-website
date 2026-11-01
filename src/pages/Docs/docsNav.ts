import { integrationDocs } from "./integrations";

export interface DocsNavItem {
  to: string;
  label: string;
  /** File names read better in the mono face. */
  mono?: boolean;
}

export interface DocsNavGroup {
  label: string;
  items: DocsNavItem[];
}

/** Every docs page, in reading order. The sidebar and next/previous links read this. */
export const docsNav: DocsNavGroup[] = [
  {
    label: "Start",
    items: [
      { to: "/docs", label: "What Misty is" },
      { to: "/docs/connect", label: "Connect the app" },
      { to: "/docs/models", label: "Models" },
    ],
  },
  {
    label: "Self-hosting",
    items: [
      { to: "/docs/self-hosting", label: "Run a server" },
      ...integrationDocs.map((doc) => ({
        to: `/docs/self-hosting/${doc.slug}`,
        label: doc.file,
        mono: true,
      })),
      { to: "/docs/maintenance", label: "Updates and backups" },
    ],
  },
];

export const docsPages: DocsNavItem[] = docsNav.flatMap((group) => group.items);

export function docsGroupFor(path: string): string | undefined {
  return docsNav.find((group) => group.items.some((item) => item.to === path))
    ?.label;
}
