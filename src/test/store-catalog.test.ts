import { describe, expect, it } from "vitest";

import {
  filterStoreApps,
  storeAppFromSlug,
  storeAppPlatformFamilies,
  storeAppSlug,
  storeApps,
} from "@/pages/Store/data";

describe("website Store catalog", () => {
  it("contains the published canonical Store catalog", () => {
    expect(storeApps.map((app) => app.id)).toEqual([
      "storage_report",
      "image_optimizer",
      "quick_convert",
      "backups",
      "themes",
      "ytdlp",
    ]);
    expect(
      storeApps.every((app) => app.version === "0.3.0"),
    ).toBe(true);
  });

  it("provides stable public detail routes", () => {
    expect(storeAppSlug("storage_report")).toBe("storage-report");
    expect(storeAppFromSlug("storage-report")?.id).toBe("storage_report");
    expect(storeAppFromSlug("storage_report")?.id).toBe("storage_report");
    expect(storeAppFromSlug("missing-app")).toBeUndefined();
  });

  it("searches names, capabilities, and included tools", () => {
    expect(
      filterStoreApps("backup").map((app) => app.id),
    ).toEqual(["backups"]);
    expect(
      filterStoreApps("FFmpeg").map((app) => app.id),
    ).toEqual(["image_optimizer", "quick_convert"]);
  });

  it("collapses architecture variants into readable platform families", () => {
    expect(storeAppPlatformFamilies(storeApps[0])).toEqual([
      "macOS",
      "Windows",
      "Linux",
    ]);
  });
});
