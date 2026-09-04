import {
  Bot,
  FolderOpen,
  Inbox,
  MessagesSquare,
  Notebook,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router";

import { ExtensionArtwork } from "@misty/store/react";
import {
  StoreSurface,
  type StoreSection,
  type StoreSurfaceEntry,
} from "@misty/store/store";
import { WEB_APP_URL } from "@/lib/site";
import { storeAppSlug, storeApps } from "./data";

type WebsiteStoreEntry = StoreSurfaceEntry & {
  readonly Icon?: LucideIcon;
};

const installedAppIds = new Set(["quick_convert", "themes", "ytdlp"]);

const builtInApps: WebsiteStoreEntry[] = [
  builtIn("inbox", "Inbox", "Messages and updates", Inbox),
  builtIn("social", "Social", "Connected conversations and communities", MessagesSquare),
  builtIn("journal", "Journal", "Notes and drawings for the current Space", Notebook),
  builtIn("files", "Files", "Browse local and connected files", FolderOpen),
  builtIn("agents", "Agents", "Create and run AI collaborators", Bot),
];

export function StoreCatalogPage() {
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawSection = searchParams.get("section") ?? searchParams.get("tab");
  const validSections: readonly StoreSection[] = [
    "featured",
    "apps",
    "extensions",
    "installed",
  ];
  const initialSection: StoreSection = validSections.includes(
    rawSection as StoreSection,
  )
    ? (rawSection as StoreSection)
    : "apps";

  const entries = useMemo<WebsiteStoreEntry[]>(
    () => [
      ...storeApps.map((app) => ({
        ...app,
        kind: "app" as const,
        installed: installedAppIds.has(app.id),
        enabled: installedAppIds.has(app.id),
      })),
      ...builtInApps,
    ],
    [],
  );
  const installedEntries = useMemo(
    () => entries.filter((entry) => entry.installed),
    [entries],
  );

  return (
    <div className="site-container pb-24 pt-4 sm:pt-6">
      <StoreSurface
        className="min-h-[800px] rounded-2xl border border-[var(--store-border)] shadow-2xl shadow-black/15 md:min-h-[900px]"
        entries={entries}
        initialSection={initialSection}
        installedEntries={installedEntries}
        loading={refreshing}
        onQueryChange={setQuery}
        onRefresh={() => {
          setRefreshing(true);
          window.setTimeout(() => setRefreshing(false), 450);
        }}
        onSectionChange={(nextSection) => {
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev);
              if (nextSection === "apps") {
                next.delete("section");
                next.delete("tab");
              } else {
                next.set("section", nextSection);
              }
              return next;
            },
            { replace: true },
          );
        }}
        onSelect={(entry) => {
          if (entry.kind === "builtin") {
            window.location.assign(WEB_APP_URL);
          } else {
            navigate(`/store/${storeAppSlug(entry.id)}`);
          }
        }}
        query={query}
        renderIcon={(entry, { className, size }) => {
          if (entry.Icon) {
            const Icon = entry.Icon;
            return (
              <span
                className={`misty-extension-artwork ${className}`}
                data-app-icon={entry.id.replace("builtin:", "")}
                data-size={size}
              >
                <Icon aria-hidden="true" />
              </span>
            );
          }
          return (
            <ExtensionArtwork
              className={className}
              extensionId={entry.id}
              imageClassName="h-[72%] w-[72%] object-contain"
              name={entry.name}
              size={size}
              src={entry.logoUrl}
            />
          );
        }}
        renderPrimaryAction={(entry, { className }) =>
          entry.kind === "builtin" || entry.installed ? (
            <a className={className} href={WEB_APP_URL}>Open</a>
          ) : (
            <NavLink className={className} to="/download">Install</NavLink>
          )
        }
      />
    </div>
  );
}

function builtIn(
  id: string,
  name: string,
  overview: string,
  Icon: LucideIcon,
): WebsiteStoreEntry {
  return {
    id: `builtin:${id}`,
    name,
    version: "1.0.0",
    author: "Misty",
    overview,
    capabilities: [overview],
    whereItAppears: ["Misty workspace"],
    permissions: [],
    gettingStarted: [],
    includedTools: [],
    links: [],
    verified: true,
    kind: "builtin",
    installed: true,
    enabled: true,
    Icon,
  };
}
