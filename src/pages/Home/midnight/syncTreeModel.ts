/**
 * Geometry for the sync tree. Each device keeps its own workspace tree, as the browser-sync
 * crate in misty does: window → tab → pane (how the tab is split) → page. Each level's chips
 * sit together in a labeled band; the vault sits above every device.
 */
export type Layout = "wide" | "stacked";
type Point = readonly [number, number];
export type Level = "window" | "tab" | "pane" | "page";
export type Kind = "vault" | "device" | Level;
export type Glyph = { brand: string } | { icon: "monitor" | "laptop" | "window" | "split" | "stacked" | "single" };
export type Span = readonly [number, number];
export type Variant = { label: string; glyph: Glyph; spans?: Span[] };
export type TreeNode = { id: string; parent: string; kind: "device" | Level; device: number; dx: number; variants: Variant[] };

const LEVELS: { id: Level; label: string }[] = [
  { id: "window", label: "Windows" },
  { id: "tab", label: "Tabs" },
  { id: "pane", label: "Panes" },
  { id: "page", label: "Websites" },
];
export const CHIP = { h: 32, font: 13, pad: 12, glyph: 18, gap: 7, icon: 42 } as const;

const GEOMETRY = {
  wide: {
    width: 800, height: 600, vault: [445, 30] as Point, spread: 1.3,
    deviceX: (device: number) => 224 + device * 221, deviceY: () => 130,
    bandTop: (_device: number, level: number) => 186 + level * 106, band: { x: 8, w: 784, h: 62 }, rows: [0],
  },
  stacked: {
    width: 380, height: 962, vault: [190, 30] as Point, spread: 1,
    deviceX: () => 228, deviceY: (device: number) => 104 + device * 296,
    bandTop: (device: number, level: number) => 136 + device * 296 + level * 60, band: { x: 14, w: 354, h: 44 }, rows: [0, 1, 2],
  },
} as const;

export const viewBox = (layout: Layout) => `0 0 ${GEOMETRY[layout].width} ${GEOMETRY[layout].height}`;

/** Labeled containers holding each level's chips: one set shared by every device when wide, one per device when stacked. */
export function bands(layout: Layout) {
  const g = GEOMETRY[layout];
  return g.rows.flatMap(device => LEVELS.map((level, index) => ({
    key: `${device}-${level.id}`, level: level.id, label: level.label,
    x: g.band.x, y: g.bandTop(device, index), w: g.band.w, h: g.band.h,
  })));
}

/** Text width in px. Measured with the page font once it loads; estimated before that. */
export type Measure = (text: string, size: number) => number;
export const estimate: Measure = (text, size) => text.length * size * 0.56;

type Box = { x: number; y: number; w: number; h: number };
export type Placed = TreeNode & Box & { depth: number };

/** Tabs, panes and pages show only their logo or icon; devices and the vault carry a name. */
export const labeled = (kind: Kind) => kind === "device" || kind === "vault";
const labeledWidth = (label: string, measure: Measure) => CHIP.glyph + CHIP.gap + measure(label, CHIP.font) + CHIP.pad * 2;

export function place(layout: Layout, nodes: TreeNode[], measure: Measure): Map<string, Placed> {
  const g = GEOMETRY[layout];
  return new Map(nodes.map(node => {
    const level = LEVELS.findIndex(item => item.id === node.kind);
    const y = level < 0 ? g.deviceY(node.device) : g.bandTop(node.device, level) + g.band.h / 2;
    const w = labeled(node.kind) ? Math.max(...node.variants.map(variant => labeledWidth(variant.label, measure))) : CHIP.icon;
    return [node.id, { ...node, x: g.deviceX(node.device) + node.dx * g.spread - w / 2, y, w, h: CHIP.h, depth: level + 2 }];
  }));
}

/** The vault chip; `y` is its center, like every chip. */
export function vaultBox(layout: Layout, measure: Measure): Box {
  const [cx, cy] = GEOMETRY[layout].vault;
  const w = labeledWidth("Vault", measure);
  return { x: cx - w / 2, y: cy, w, h: CHIP.h };
}

type Segment = { start: Point; body: string };

/** Parent-to-child connector, forward or reversed for changes travelling up toward the vault. */
function segment(layout: Layout, parent: Box, child: Box, fromVault: boolean, reverse: boolean): Segment {
  if (layout === "stacked" && fromVault) {
    // Stacked devices hang off a rail down the left edge.
    const [rail, top, y, end, startX] = [6, parent.y, child.y, child.x, parent.x];
    return reverse
      ? { start: [end, y], body: `H ${rail + 9} Q ${rail} ${y} ${rail} ${y - 9} V ${top + 9} Q ${rail} ${top} ${rail + 9} ${top} H ${startX}` }
      : { start: [startX, top], body: `H ${rail + 9} Q ${rail} ${top} ${rail} ${top + 9} V ${y - 9} Q ${rail} ${y} ${rail + 9} ${y} H ${end}` };
  }
  const [px, py, cx, cy] = [parent.x + parent.w / 2, parent.y + parent.h / 2, child.x + child.w / 2, child.y - child.h / 2];
  const mid = (py + cy) / 2;
  return reverse
    ? { start: [cx, cy], body: `C ${cx} ${mid} ${px} ${mid} ${px} ${py}` }
    : { start: [px, py], body: `C ${px} ${mid} ${cx} ${mid} ${cx} ${cy}` };
}

export function edgePath(layout: Layout, parent: Box, child: Box, fromVault = false) {
  const { start, body } = segment(layout, parent, child, fromVault, false);
  return `M ${start[0]} ${start[1]} ${body}`;
}

/** Joins connectors along a route of node ids ("vault" included), passing through each chip on the way. */
export function routePath(layout: Layout, placed: Map<string, Placed>, vault: Box, route: readonly string[]) {
  const box = (id: string) => (id === "vault" ? vault : placed.get(id)!);
  const parentOf = (id: string) => (id === "vault" ? undefined : placed.get(id)!.parent);
  return route.slice(1).map((id, index) => {
    const from = route[index];
    const up = parentOf(from) === id;
    const [parent, child] = up ? [id, from] : [from, id];
    const { start, body } = segment(layout, box(parent), box(child), parent === "vault", up);
    return `${index === 0 ? "M" : "L"} ${start[0]} ${start[1]} ${body}`;
  }).join(" ");
}
