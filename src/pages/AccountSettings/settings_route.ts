import { TABS, type Tab } from "./tabs";

const SETTINGS_PATH = "/settings";

export function settingsTabFromPathname(pathname: string): Tab | null {
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  if (trimmed === SETTINGS_PATH) return TABS[0].id;
  if (!trimmed.startsWith(`${SETTINGS_PATH}/`)) return null;

  const segment = trimmed.slice(SETTINGS_PATH.length + 1);
  return TABS.find((tab) => tab.id === segment)?.id ?? null;
}

export function settingsPathForTab(tab: Tab): string {
  return `${SETTINGS_PATH}/${tab}`;
}

export function isSettingsPathname(pathname: string): boolean {
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  return trimmed === SETTINGS_PATH || trimmed.startsWith(`${SETTINGS_PATH}/`);
}
