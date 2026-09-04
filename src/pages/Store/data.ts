import storageReport from "../../../vendor/misty-store/catalog/storage_report.json";
import imageOptimizer from "../../../vendor/misty-store/catalog/image_optimizer.json";
import backups from "../../../vendor/misty-store/catalog/backups.json";
import quickConvert from "../../../vendor/misty-store/catalog/quick_convert.json";
import themes from "../../../vendor/misty-store/catalog/themes.json";
import ytdlp from "../../../vendor/misty-store/catalog/ytdlp.json";
import {
  extensionIdFromSlug,
  extensionPlatformFamilies,
  extensionSlug,
  filterExtensionCatalog as filterSharedExtensionCatalog,
  type ExtensionPresentation,
} from "@misty/store/catalog";

export type StoreCatalogApp = ExtensionPresentation & {
  readonly logoUrl: string;
  readonly status: string;
  readonly featuredRank: number | null;
  readonly platforms: readonly string[];
};

type RawCatalogEntry = {
  readonly overview: string;
  readonly version: string;
  readonly status: string;
  readonly featured_rank?: number;
  readonly capabilities: string[];
  readonly where_it_appears: string[];
  readonly permissions: string[];
  readonly getting_started: string[];
  readonly included_tools?: string[];
  readonly links?: Array<{ label: string; url: string }>;
  readonly verified: boolean;
  readonly logo_path?: string;
  readonly install?: {
    artifacts?: Array<{ platform: string; url: string }>;
  };
};

function normalizeApp(id: string, name: string, raw: RawCatalogEntry): StoreCatalogApp {
  return {
    id,
    name,
    version: raw.version,
    overview: raw.overview,
    status: raw.status,
    featuredRank: raw.featured_rank ?? null,
    capabilities: raw.capabilities ?? [],
    whereItAppears: raw.where_it_appears ?? [],
    permissions: raw.permissions ?? [],
    gettingStarted: raw.getting_started ?? [],
    includedTools: raw.included_tools ?? [],
    links: raw.links ?? [],
    verified: raw.verified ?? true,
    logoUrl: raw.logo_path ?? "",
    platforms: raw.install?.artifacts?.map((artifact) => artifact.platform) ?? [
      "macos-aarch64",
      "macos-x86_64",
      "windows-x86_64",
      "linux-x86_64",
    ],
  };
}

export const storeApps: readonly StoreCatalogApp[] = [
  normalizeApp("storage_report", "Storage Report", storageReport),
  normalizeApp("image_optimizer", "Image Optimizer", imageOptimizer),
  normalizeApp("quick_convert", "Quick Convert", quickConvert),
  normalizeApp("backups", "Backups", backups),
  normalizeApp("themes", "Themes", themes),
  normalizeApp("ytdlp", "Ytdlp", ytdlp),
];

export {
  extensionPlatformFamilies as storeAppPlatformFamilies,
  extensionSlug as storeAppSlug,
};

export function storeAppFromSlug(slug: string | undefined) {
  if (!slug) return undefined;
  const extensionId = extensionIdFromSlug(slug);
  return storeApps.find((app) => app.id === extensionId);
}

export function filterStoreApps(query: string) {
  return filterSharedExtensionCatalog(storeApps, query);
}
