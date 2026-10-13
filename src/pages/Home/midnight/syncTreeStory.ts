import type { Glyph, Span, TreeNode, Variant } from "./syncTreeModel";

/**
 * Ordinary use on three devices. Every change is something the sync code in misty carries:
 * workspace records (websites, tabs and their groups, splits, page state, windows), the
 * account's collections (bookmarks and folders, saved tab groups, history, extension settings)
 * and sign-ins. Changes go up their device's tree to the vault; collection changes then go
 * down to the other devices. Trips take uneven times, so a later change can land first.
 */

const SITES: Record<string, string> = {
  figma: "Figma", github: "GitHub", gmail: "Gmail", "google-docs": "Docs", "google-sheets": "Sheets", jira: "Jira",
  linear: "Linear", notion: "Notion", slack: "Slack", spotify: "Spotify", todoist: "Todoist", youtube: "YouTube",
};
const icon = (label: string, glyph: Glyph): Variant[] => [{ label, glyph }];

type Tree = { name: string; icon: "monitor" | "laptop"; split: "split" | "stacked"; pages: [string, string][] };
/** Each website alternates between two sites; it changes an even number of times, so the loop ends where it began. */
const trees: Tree[] = [
  { name: "Desktop", icon: "monitor", split: "split", pages: [["github", "jira"], ["google-docs", "google-sheets"], ["youtube", "spotify"]] },
  { name: "Laptop", icon: "laptop", split: "split", pages: [["figma", "google-sheets"], ["notion", "todoist"], ["spotify", "youtube"]] },
  { name: "Work PC", icon: "monitor", split: "stacked", pages: [["linear", "github"], ["slack", "jira"], ["gmail", "todoist"]] },
];
const deviceIds = ["desktop", "laptop", "workpc"] as const;
type DeviceId = (typeof deviceIds)[number];

/** Window → two tabs. The first tab is split across two websites; the second shows one. */
const structure = deviceIds.flatMap(device => [
  { id: device, parent: "vault", kind: "device" as const, dx: 0 },
  { id: `${device}.window`, parent: device, kind: "window" as const, dx: 0 },
  { id: `${device}.tab0`, parent: `${device}.window`, kind: "tab" as const, dx: -36 },
  { id: `${device}.tab1`, parent: `${device}.window`, kind: "tab" as const, dx: 36 },
  { id: `${device}.pane0`, parent: `${device}.tab0`, kind: "pane" as const, dx: -36 },
  { id: `${device}.pane1`, parent: `${device}.tab1`, kind: "pane" as const, dx: 36 },
  { id: `${device}.page0`, parent: `${device}.pane0`, kind: "page" as const, dx: -60 },
  { id: `${device}.page1`, parent: `${device}.pane0`, kind: "page" as const, dx: -12 },
  { id: `${device}.page2`, parent: `${device}.pane1`, kind: "page" as const, dx: 36 },
]);
const parentOf = new Map(structure.map(node => [node.id, node.parent]));

/** Seeded randomness, so every visitor sees the same sequence. */
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const next = random(11);
const between = (min: number, max: number) => min + next() * (max - min);
const pick = <T,>(items: readonly T[]) => items[Math.floor(next() * items.length)];
const anyPage = (device: DeviceId) => `${device}.page${Math.floor(next() * 3)}`;
const anyTab = (device: DeviceId) => `${device}.tab${Math.floor(next() * 2)}`;

/** Pacing, in seconds. Trips are uneven, so a change sent later often lands first. */
const PACE = {
  up: [3.2, 8] as [number, number],
  down: [2.3, 5.2] as [number, number],
  pause: [0.6, 1.6] as [number, number],
  maxInFlight: 4,
  length: 58,
};

/** What can happen, and where it starts. Shared kinds go on to the other devices.
 * Website changes are scheduled separately so every website visibly switches sites. */
type Kind = { label: string; at: (device: DeviceId) => string; shared?: boolean; weight: number };
const kinds: Kind[] = [
  { label: "website changed", at: anyPage, weight: 0 },
  { label: "tab moved", at: anyTab, weight: 1 },
  { label: "tab grouped", at: device => `${device}.tab0`, weight: 1 },
  { label: "split changed", at: device => `${device}.pane0`, weight: 1 },
  { label: "moved to pane", at: device => `${device}.page1`, weight: 1 },
  { label: "page state", at: anyPage, weight: 1 },
  { label: "window renamed", at: device => `${device}.window`, weight: 1 },
  { label: "sign-ins", at: device => device, weight: 1 },
  { label: "bookmark", at: anyPage, shared: true, weight: 1 },
  { label: "bookmark pinned", at: anyPage, shared: true, weight: 1 },
  { label: "bookmark folder", at: device => device, shared: true, weight: 1 },
  { label: "saved tab group", at: anyTab, shared: true, weight: 1 },
  { label: "history", at: device => device, shared: true, weight: 1 },
  { label: "extension settings", at: device => device, shared: true, weight: 1 },
];
const pickKind = () => {
  let roll = next() * kinds.reduce((sum, kind) => sum + kind.weight, 0);
  return kinds.find(kind => (roll -= kind.weight) < 0) ?? kinds[0];
};

type Trip = { route: string[]; label: string; start: number; end: number };
const routeUp = (start: string) => {
  const route = [start];
  while (route[route.length - 1] !== "vault") route.push(parentOf.get(route[route.length - 1])!);
  return route;
};

/** The most trips in flight at any moment. */
function busiest(trips: Trip[]) {
  const edges = trips.flatMap(trip => [[trip.start, 1], [trip.end, -1]] as [number, number][]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let count = 0;
  let most = 0;
  for (const [, change] of edges) most = Math.max(most, (count += change));
  return most;
}

/** One change: up to the vault and, for shared records, on to the other devices. */
function plan(kind: Kind, device: DeviceId, start: string, at: number): Trip[] {
  const up: Trip = { route: routeUp(start), label: kind.label, start: at, end: at + between(...PACE.up) };
  if (!kind.shared) return [up];
  return [up, ...deviceIds.filter(other => other !== device).map(other => {
    const leave = up.end + 0.3;
    return { route: ["vault", other], label: kind.label, start: leave, end: leave + between(...PACE.down) };
  })];
}

const shuffle = <T,>(items: readonly T[]) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/** Places changes one after another with short pauses, never more than four trips in flight. */
function schedule() {
  const trips: Trip[] = [];
  const siteChanges: { page: string; at: number }[] = [];
  let clock = 1;
  const place = (kind: Kind, device: DeviceId, start: string) => {
    let candidate = plan(kind, device, start, clock);
    while (busiest([...trips, ...candidate]) > PACE.maxInFlight) {
      clock = Math.min(...trips.map(trip => trip.end).filter(end => end > clock)) + between(0.2, 0.8);
      candidate = plan(kind, device, start, clock);
    }
    trips.push(...candidate);
    if (kind.label === "website changed") siteChanges.push({ page: start, at: clock });
    clock += between(...PACE.pause);
  };
  // Every website switches to its other site and back once per loop, so each icon visibly
  // changes and the loop ends where it began. Two shuffled passes keep a website's two
  // changes apart, mixed in among the other kinds of change.
  const pages = structure.filter(node => node.kind === "page").map(node => node.id);
  const siteQueue = [...shuffle(pages), ...shuffle(pages)];
  while (clock < PACE.length || siteQueue.length) {
    if (siteQueue.length && (clock >= PACE.length || next() < 0.55)) {
      const page = siteQueue.shift()!;
      place(kinds[0], page.split(".")[0] as DeviceId, page);
      continue;
    }
    const kind = pickKind();
    const device = pick(deviceIds);
    place(kind, device, kind.at(device));
  }
  const length = Math.max(...trips.map(trip => trip.end)) + between(...PACE.pause);
  return { trips, siteChanges, length };
}
const story = schedule();

export const LOOP_SECONDS = +story.length.toFixed(2);
const fraction = (seconds: number) => +(seconds / LOOP_SECONDS).toFixed(4);

/** A website's two sites over the loop, switching at each change. */
function siteVariants(page: string, sites: [string, string]): Variant[] {
  const times = story.siteChanges.filter(change => change.page === page).map(change => fraction(change.at));
  const spans: [Span[], Span[]] = [[], []];
  [0, ...times].forEach((from, index) => spans[index % 2].push([from, times[index] ?? 1]));
  return sites.map((name, index) => ({ label: SITES[name], glyph: { brand: name }, spans: spans[index] }));
}

const paneIcon = (kind: "split" | "stacked" | "single") =>
  icon(kind === "split" ? "Split side by side" : kind === "stacked" ? "Split top and bottom" : "Single pane", { icon: kind });

/** A tab shows its first website's site, so it changes along with it. */
export const nodes: TreeNode[] = structure.map(node => {
  const device = deviceIds.indexOf(node.id.split(".")[0] as DeviceId);
  const tree = trees[device];
  const part = node.id.split(".")[1];
  const page = (index: number) => siteVariants(`${deviceIds[device]}.page${index}`, tree.pages[index] as [string, string]);
  const variants =
    node.kind === "device" ? icon(tree.name, { icon: tree.icon })
    : node.kind === "window" ? icon("Window", { icon: "window" })
    : node.kind === "pane" ? paneIcon(part === "pane0" ? tree.split : "single")
    : node.kind === "tab" ? page(part === "tab0" ? 0 : 2)
    : page(Number(part.slice(4)));
  return { ...node, device, variants };
});

/** A change in flight, as fractions of the loop. */
export type Flow = { route: string[]; label: string; from: number; duration: number };
export const flows: Flow[] = story.trips.map(trip => ({
  route: trip.route, label: trip.label, from: fraction(trip.start), duration: fraction(trip.end - trip.start),
}));
const arrival = (flow: Flow) => (flow.from + flow.duration) % 1;

/** A short highlight starting at `at`, split if it runs past the loop's end. */
const flash = (at: number, length = 1 / LOOP_SECONDS): Span[] =>
  at + length <= 1 ? [[at, at + length]] : [[at, 1], [0, at + length - 1]];

/** Chips light up when a change leaves them and when one lands on them. */
export const pulses: { id: string; span: Span }[] = flows.flatMap(flow => [
  ...flash(flow.from).map(span => ({ id: flow.route[0], span })),
  ...flash(arrival(flow)).map(span => ({ id: flow.route[flow.route.length - 1], span })),
]);

/** SMIL keyTimes/values that show something during any of `spans`, with gentle fades. */
export function visibleDuring(spans: readonly Span[], fade = 0.6 / LOOP_SECONDS) {
  const merged: [number, number][] = [];
  for (const [from, to] of [...spans].sort((a, b) => a[0] - b[0])) {
    const last = merged[merged.length - 1] as [number, number] | undefined;
    if (last && from - fade <= last[1] + fade) last[1] = Math.max(last[1], to);
    else merged.push([from, to]);
  }
  const points: [number, number][] = [];
  if (!merged.length || merged[0][0] > 0) points.push([0, 0]);
  for (const [from, to] of merged) {
    points.push(...(from <= 0 ? [[0, 1]] : [[from - fade, 0], [from, 1]]) as [number, number][]);
    points.push(...(to >= 1 ? [[1, 1]] : [[to, 1], [to + fade, 0]]) as [number, number][]);
  }
  if (merged.length && merged[merged.length - 1][1] < 1) points.push([1, 0]);
  let previous = 0;
  const times = points.map(([time]) => (previous = Math.min(1, Math.max(previous, time))));
  return { keyTimes: times.map(time => +time.toFixed(4)).join(";"), values: points.map(([, value]) => value).join(";") };
}
