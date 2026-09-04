export const SCROLL_PHASE_HEIGHT_SVH = 130;

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** A long ease-out that enters promptly but takes most of its phase to settle. */
export function slowSlideProgress(progress: number) {
  const clamped = clamp(progress);
  return 1 - Math.pow(1 - clamped, 2);
}

/**
 * Reserve one full scroll phase for a section entrance, then hand the
 * remaining progress to the section's own beats.
 */
export function splitEntranceProgress(
  progress: number,
  contentPhaseCount: number,
) {
  const safeContentPhaseCount = Math.max(1, contentPhaseCount);
  const position = clamp(progress) * (safeContentPhaseCount + 1);

  return {
    entranceProgress: slowSlideProgress(position),
    contentProgress: clamp((position - 1) / safeContentPhaseCount),
  };
}

/** Include one entrance phase and one viewport for the final sticky hold. */
export function scrollTrackHeight(contentPhaseCount: number) {
  return (Math.max(0, contentPhaseCount) + 1) * SCROLL_PHASE_HEIGHT_SVH + 100;
}
