import type { SpaceBoostsState } from "./api";

/** Where a space stands, in one line: its level, its Boosts, and what the next level needs. */
export function levelLine(state: SpaceBoostsState | undefined): string {
  const level = state?.level;
  if (!level) return "";
  const name = level.level === 0 ? "Base level" : `Level ${level.level}`;
  const boosts = `${level.boosts} ${level.boosts === 1 ? "Boost" : "Boosts"}`;
  if (!level.next_level_boosts) return `${name} · ${boosts}`;
  return `${name} · ${boosts} · ${level.next_level_boosts - level.boosts} more for Level ${level.level + 1}`;
}
