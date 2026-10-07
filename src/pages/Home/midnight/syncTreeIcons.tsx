import {
  AppWindow, Laptop, Lock, Monitor, SquareCenterlineDashedHorizontal, SquareCenterlineDashedVertical, SquareDashed, type LucideIcon,
} from "lucide-react";
import type { Glyph } from "./syncTreeModel";

/** Official logos, copied from the Misty app's brand icons (see src/assets/brand-icons/README.md). */
const brands = import.meta.glob<string>("../../../assets/brand-icons/*.svg", { eager: true, query: "?url", import: "default" });
const brandUrl = (name: string) => brands[`../../../assets/brand-icons/${name}.svg`];

const icons: Record<string, LucideIcon> = {
  monitor: Monitor,
  laptop: Laptop,
  window: AppWindow,
  split: SquareCenterlineDashedVertical,
  stacked: SquareCenterlineDashedHorizontal,
  single: SquareDashed,
};

/** A logo or interface icon centered on (x, y). */
export function GlyphMark({ glyph, x, y, size }: { glyph: Glyph; x: number; y: number; size: number }) {
  if ("brand" in glyph) {
    return <image data-brand={glyph.brand} href={brandUrl(glyph.brand)} x={x - size / 2} y={y - size / 2} width={size} height={size} preserveAspectRatio="xMidYMid meet" />;
  }
  const Icon = icons[glyph.icon];
  return <Icon className="mist-tree-icon" x={x - size / 2} y={y - size / 2} size={size} strokeWidth={1.75} aria-hidden />;
}

export function LockIcon({ x, y, size = 13 }: { x: number; y: number; size?: number }) {
  return <Lock className="mist-tree-icon" x={x - size / 2} y={y - size / 2} size={size} strokeWidth={1.75} aria-hidden />;
}
