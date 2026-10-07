import type { PlatformName } from "./data";

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: { platform?: string };
};

/** The visitor's desktop platform, or undefined on phones, tablets and anything else. */
export function detectDownloadPlatform(): PlatformName | undefined {
  if (typeof navigator === "undefined") return undefined;

  try {
    const detectedNavigator = navigator as NavigatorWithUserAgentData;
    const userAgent = detectedNavigator.userAgent;
    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(userAgent) ||
      (detectedNavigator.platform === "MacIntel" &&
        detectedNavigator.maxTouchPoints > 1);

    if (isMobile) return undefined;

    const platform = [
      detectedNavigator.userAgentData?.platform,
      detectedNavigator.platform,
      userAgent,
    ]
      .filter(Boolean)
      .join(" ");

    if (/Mac/i.test(platform)) return "macOS";
    if (/Win/i.test(platform)) return "Windows";
  } catch {
    return undefined;
  }

  return undefined;
}
