import type { RouteStop } from "./Tiles";

/**
 * The ribbon through the Browser part's six tiles, never leaving them: engine → extensions, down
 * into sync, left across the sync tree into import, then down and across the layouts into the
 * address bar. Tiles count in page order: 0 engine, 1 extensions, 2 import, 3 sync, 4 layouts,
 * 5 address bar. It drops only where the tiles above and below overlap, and its turns are wide so
 * the swinging lines never fold over.
 */
export const BROWSER_ROUTE: RouteStop[] = [
  { tile: 0, x: 0, y: .45 },
  { tile: 1, x: .15, y: .45 },
  { tile: 1, x: .8, y: 1, dir: "down" },
  { tile: 3, x: 0, y: .3, dir: "left" },
  { tile: 2, x: 1, y: .3, dir: "left" },
  { tile: 2, x: .45, y: 1, dir: "down" },
  { tile: 4, x: .5, y: .55 },
  { tile: 5, x: 1, y: .42 },
];
