import { describe, expect, it } from "vitest";

import {
  isSettingsPathname,
  settingsPathForTab,
  settingsTabFromPathname,
} from "@/pages/AccountSettings/settings_route";
import { safeInternalPath } from "@/lib/navigation";

describe("settings route", () => {
  it("maps settings paths to tabs", () => {
    expect(settingsTabFromPathname("/settings")).toBe("account");
    expect(settingsTabFromPathname("/settings/")).toBe("account");
    expect(settingsTabFromPathname("/settings/account")).toBe("account");
    expect(settingsTabFromPathname("/settings/privacy")).toBe("privacy");
  });

  it("reports an unknown tab as null so the caller can redirect", () => {
    expect(settingsTabFromPathname("/settings/not-a-tab")).toBeNull();
    expect(settingsTabFromPathname("/settings/billing")).toBeNull();
    expect(isSettingsPathname("/settings/not-a-tab")).toBe(true);
  });

  it("does not claim unrelated paths", () => {
    expect(settingsTabFromPathname("/")).toBeNull();
    expect(settingsTabFromPathname("/download")).toBeNull();
    expect(isSettingsPathname("/download")).toBe(false);
    expect(isSettingsPathname("/settingsomething")).toBe(false);
  });

  it("round-trips a tab through its path", () => {
    expect(settingsTabFromPathname(settingsPathForTab("privacy"))).toBe(
      "privacy",
    );
  });
});

describe("safeInternalPath", () => {
  it("accepts same-site absolute paths", () => {
    expect(safeInternalPath("/settings/privacy")).toBe("/settings/privacy");
  });

  it("rejects anything that could leave the site", () => {
    expect(safeInternalPath("https://evil.example.com")).toBeNull();
    expect(safeInternalPath("//evil.example.com")).toBeNull();
    expect(safeInternalPath("settings")).toBeNull();
    expect(safeInternalPath("")).toBeNull();
    expect(safeInternalPath(null)).toBeNull();
    expect(safeInternalPath(undefined)).toBeNull();
  });

  it("ignores a non-string, so `onClick={logout}` cannot throw", () => {
    expect(safeInternalPath(new MouseEvent("click"))).toBeNull();
    expect(safeInternalPath(42)).toBeNull();
    expect(safeInternalPath({})).toBeNull();
  });
});
