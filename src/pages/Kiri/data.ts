/** Where an extension API comes from in Misty. */
export type ApiSource = "webkit" | "kiri" | "partial" | "unavailable";

export interface ApiRow {
  api: string;
  /** The names extensions use, Chrome first then Firefox where they differ. */
  names: string;
  browsers: "Chrome and Firefox" | "Chrome" | "Firefox";
  source: ApiSource;
  note: string;
}

export const sourceLabels: Record<ApiSource, string> = {
  webkit: "WebKit",
  kiri: "Kiri",
  partial: "Kiri, with limits",
  unavailable: "Not available",
};

export const layers = [
  {
    name: "Your extension",
    detail: "Built for Chrome or Firefox, Manifest V2 or V3, from either store.",
  },
  {
    name: "Kiri",
    detail:
      "Fills in the APIs the engine lacks, answers both chrome.* callbacks and browser.* promises, and checks every call against the access you granted.",
  },
  {
    name: "WebKit's extension runtime",
    detail: "Runs the extension and provides the APIs every browser shares.",
  },
  {
    name: "Misty",
    detail: "Your tabs, bookmarks, history, downloads and settings, which Kiri reads and changes on the extension's behalf.",
  },
] as const;

export const installSteps = [
  "Open an extension's page on the Chrome Web Store or Firefox Add-ons and choose Add to Misty.",
  "Misty reads which extension it is from the page's address, so the page can't swap in another one.",
  "Misty downloads the package from the store and checks it: Mozilla's checksum for Firefox add-ons, and both the developer's and the Chrome Web Store's signatures for Chrome extensions.",
  "You review the access it asks for in Misty's own window, and it starts.",
] as const;

export const apiRows: ApiRow[] = [
  {
    api: "Tabs, windows and storage",
    names: "tabs, windows, storage",
    browsers: "Chrome and Firefox",
    source: "webkit",
    note: "The engine provides them as in any browser.",
  },
  {
    api: "Scripts and styles in pages",
    names: "scripting, content scripts",
    browsers: "Chrome and Firefox",
    source: "webkit",
    note: "Limited to the sites you allow.",
  },
  {
    api: "Ad and tracker blocking rules",
    names: "declarativeNetRequest",
    browsers: "Chrome and Firefox",
    source: "webkit",
    note: "The engine enforces the rules, so blockers such as uBlock Origin Lite work fully.",
  },
  {
    api: "Toolbar button, menus, shortcuts and alarms",
    names: "action, contextMenus / menus, commands, alarms",
    browsers: "Chrome and Firefox",
    source: "webkit",
    note: "Firefox's page actions and sidebar entries become the toolbar button.",
  },
  {
    api: "Cookies, navigation events and permissions",
    names: "cookies, webNavigation, permissions, i18n",
    browsers: "Chrome and Firefox",
    source: "webkit",
    note: "Optional access is asked for in Misty when the extension requests it.",
  },
  {
    api: "Notifications, downloads and history",
    names: "notifications, downloads, history, topSites",
    browsers: "Chrome and Firefox",
    source: "kiri",
    note: "Backed by Misty's own notifications, downloads list and history.",
  },
  {
    api: "Bookmarks",
    names: "bookmarks",
    browsers: "Chrome and Firefox",
    source: "kiri",
    note: "Your Misty bookmarks, including synced ones, with Chrome's and Firefox's folder names.",
  },
  {
    api: "Recently closed tabs, search and clearing data",
    names: "sessions, search, browsingData, find, idle, tts",
    browsers: "Chrome and Firefox",
    source: "kiri",
    note: "Answered by Misty's closed tabs, search engines and site data.",
  },
  {
    api: "New tab page",
    names: "chrome_url_overrides.newtab",
    browsers: "Chrome and Firefox",
    source: "kiri",
    note: "New tabs open the extension's page while it's on. Private tabs keep your homepage.",
  },
  {
    api: "Popup windows",
    names: "windows.create({ type: \"popup\" })",
    browsers: "Chrome and Firefox",
    source: "kiri",
    note: "Open as small native windows for the extension's own pages, as in Chrome and Firefox.",
  },
  {
    api: "User scripts",
    names: "userScripts",
    browsers: "Chrome and Firefox",
    source: "kiri",
    note: "Script managers such as Tampermonkey and Violentmonkey register scripts that run on the sites you allow.",
  },
  {
    api: "Side panels and sidebars",
    names: "sidePanel / sidebarAction",
    browsers: "Chrome and Firefox",
    source: "partial",
    note: "They open in a tab or as the toolbar popup.",
  },
  {
    api: "Tab groups",
    names: "tabGroups, tabs.group",
    browsers: "Chrome",
    source: "partial",
    note: "Misty's tab groups, in the current window.",
  },
  {
    api: "Background pages for work without a window",
    names: "offscreen",
    browsers: "Chrome",
    source: "partial",
    note: "Run as a hidden page in the extension's own origin.",
  },
  {
    api: "Page rules",
    names: "declarativeContent",
    browsers: "Chrome",
    source: "partial",
    note: "Rules match on page addresses; rules about a page's contents count as met.",
  },
  {
    api: "Tab and screen capture",
    names: "tabCapture, desktopCapture",
    browsers: "Chrome",
    source: "partial",
    note: "Uses macOS screen sharing, which asks you what to share every time.",
  },
  {
    api: "Blocking requests one at a time",
    names: "webRequest with blocking",
    browsers: "Chrome and Firefox",
    source: "partial",
    note: "Kiri turns each decision into a rule the engine enforces, so the first matching request can get through.",
  },
  {
    api: "Rewriting responses, proxies and the debugger",
    names: "filterResponseData, proxy, debugger",
    browsers: "Chrome and Firefox",
    source: "unavailable",
    note: "The engine gives extensions no hook for these. Extensions that require a proxy or the debugger can't be added.",
  },
];

export const safeguards = [
  "Every call Kiri answers is checked against the permissions you approved for that extension.",
  "Each device keeps its own approvals. An extension synced from another computer can't get more access than you gave it here.",
  "If a store takes an extension down, Misty stops running it at the next update check.",
  "User scripts and page rules reach only the sites the extension is allowed on.",
  "Capture always goes through macOS screen sharing; an extension can't record without asking you.",
] as const;

/** The three web engines: Chromium (Chrome), Gecko (Firefox) and Kiri on WebKit (Misty). */
export const engines = ["Chromium", "Gecko", "Kiri"] as const;
export type Support = boolean | string;

/** Extension capabilities per engine, in the order of `engines`. Kiri's cells follow apiRows above. */
export const engineRows: { label: string; cells: [Support, Support, Support] }[] = [
  { label: "Chrome Web Store extensions", cells: [true, false, true] },
  { label: "Firefox Add-ons", cells: [false, true, true] },
  { label: "Manifest V2", cells: [false, true, true] },
  { label: "Manifest V3", cells: [true, true, true] },
  { label: "Rule-based content blocking", cells: [true, true, true] },
  { label: "User scripts", cells: [true, true, true] },
  { label: "Blocking requests one at a time", cells: [false, true, "Limited"] },
  { label: "Side panels and sidebars", cells: [true, true, "Limited"] },
  { label: "Tab and screen capture", cells: [true, false, "Limited"] },
  { label: "Rewriting responses", cells: [false, true, false] },
  { label: "Proxy control", cells: [true, true, false] },
  { label: "Debugger", cells: [true, false, false] },
];
