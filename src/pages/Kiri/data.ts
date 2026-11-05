

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
