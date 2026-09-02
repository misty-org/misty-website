import { describe, expect, it } from "vitest";

import {
  extensionCatalog,
  extensionFromSlug,
  extensionPlatformFamilies,
  extensionSlug,
  filterExtensionCatalog,
} from "@/pages/Extensions/data";

describe("website extension catalog", () => {
  it("contains the published canonical extension catalog", () => {
    expect(extensionCatalog.map((extension) => extension.id)).toEqual([
      "storage_report",
      "image_optimizer",
      "quick_convert",
      "backups",
      "themes",
      "ytdlp",
    ]);
    expect(
      extensionCatalog.every((extension) => extension.version === "0.3.0"),
    ).toBe(true);
  });

  it("provides stable public detail routes", () => {
    expect(extensionSlug("storage_report")).toBe("storage-report");
    expect(extensionFromSlug("storage-report")?.id).toBe("storage_report");
    expect(extensionFromSlug("storage_report")?.id).toBe("storage_report");
    expect(extensionFromSlug("missing-extension")).toBeUndefined();
  });

  it("searches names, capabilities, and included tools", () => {
    expect(
      filterExtensionCatalog("backup").map((extension) => extension.id),
    ).toEqual(["backups"]);
    expect(
      filterExtensionCatalog("FFmpeg").map((extension) => extension.id),
    ).toEqual(["image_optimizer", "quick_convert"]);
  });

  it("collapses architecture variants into readable platform families", () => {
    expect(extensionPlatformFamilies(extensionCatalog[0])).toEqual([
      "macOS",
      "Windows",
      "Linux",
    ]);
  });
});
