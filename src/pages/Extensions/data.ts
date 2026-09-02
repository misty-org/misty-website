import extensionsCatalog from "@/content/extensions.generated.json";
import {
  extensionIdFromSlug,
  extensionPlatformFamilies,
  extensionSlug,
  filterExtensionCatalog as filterSharedExtensionCatalog,
  type ExtensionPresentation,
} from "@/generated/extensions/catalog";

export type ExtensionCatalogEntry = ExtensionPresentation & {
  readonly logoUrl: string;
  readonly status: string;
  readonly featuredRank: number | null;
  readonly platforms: readonly string[];
};

export const extensionCatalog: readonly ExtensionCatalogEntry[] =
  extensionsCatalog;

export { extensionPlatformFamilies, extensionSlug };

export function extensionFromSlug(slug: string | undefined) {
  if (!slug) return undefined;
  const extensionId = extensionIdFromSlug(slug);
  return extensionCatalog.find((extension) => extension.id === extensionId);
}

export function filterExtensionCatalog(query: string) {
  return filterSharedExtensionCatalog(extensionCatalog, query);
}
