import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * Whether the tile holding `ref` is active. While the rope is in use a tile is active only once the rope has
 * reached it (it is lit), so animations and videos in the panels still to come stay idle until their turn.
 * Without the rope (stacked layouts, reduced motion) every tile is active and each animation keeps its own rules.
 */
export function useTileActive(ref: RefObject<Element | null>): boolean {
  const [active, setActive] = useState(true);
  useLayoutEffect(() => {
    const tile = ref.current?.closest<HTMLElement>(".mist-tile");
    const scope = tile?.closest<HTMLElement>(".mist-route-scope");
    if (!tile || !scope) return;
    const update = () => setActive(scope.dataset.routed === undefined || tile.dataset.lit === "");
    update();
    const watcher = new MutationObserver(update);
    watcher.observe(tile, { attributes: true, attributeFilter: ["data-lit"] });
    watcher.observe(scope, { attributes: true, attributeFilter: ["data-routed"] });
    return () => watcher.disconnect();
  }, [ref]);
  return active;
}
