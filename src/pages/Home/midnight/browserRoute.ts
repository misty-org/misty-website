import type { RouteStop } from "./Tiles";

/**
 * The ribbon through the Browser part's five tiles, in long gentle sweeps with no tight turns:
 * system → engine, down into the full-width sync tile, one long diagonal across it behind the tree,
 * down into the layouts and across them to the right, through the address bar and out of its right
 * edge. Tiles count in page order: 0 system, 1 engine, 2 sync, 3 layouts, 4 address bar.
 */
export const BROWSER_ROUTE: RouteStop[] = [
  { tile: 0, x: -.03, y: .45 },
  { tile: 1, x: .5, y: .5 },
  { tile: 2, x: .88, y: .15, dir: "down" },
  { tile: 2, x: .12, y: .7, dir: "down" },
  { tile: 3, x: .55, y: .5 },
  { tile: 4, x: .4, y: .4 },
  { tile: 4, x: 1.03, y: .32 },
];
