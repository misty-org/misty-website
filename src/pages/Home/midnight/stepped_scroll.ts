export const STEP = 140;
const GESTURE_GAP = 160;
const STEP_LOCK_MS = 400;
const JITTER = 6;
const RUSH_GESTURES = 4, RUSH_MS = 1200, RUSH_RELEASE_MS = 350;
const RUSH_PX = 1600, RUSH_RATE_MS = 300;
const HYSTERESIS = .6;

export function settleStep(raw: number, previous: number, last: number): number {
  if (previous >= 0 && Math.abs(raw - previous) <= HYSTERESIS) return previous;
  return Math.min(last, Math.max(0, Math.round(raw)));
}

export function holdWheelToSteps(origin: () => number, last: number): () => void {
  let lastAt = -Infinity, direction = 0, peak = 0, low = 0, previous = 0, rising = 0, steppedAt = -Infinity;
  let held = false, rushing = false, starts: number[] = [];
  let recent: { at: number; size: number }[] = [], recentSum = 0;
  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const size = Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    const dir = Math.sign(event.deltaY);
    const now = event.timeStamp, gap = now - lastAt;
    if (gap > RUSH_RELEASE_MS) { rushing = false; starts = []; recent = []; recentSum = 0; }
    recent.push({ at: now, size });
    recentSum += size;
    while (recent.length && now - recent[0]!.at > RUSH_RATE_MS) recentSum -= recent.shift()!.size;
    if (recentSum >= RUSH_PX) rushing = true;
    if (held && dir !== direction && gap <= GESTURE_GAP && size < JITTER) {
      lastAt = now;
      if (!rushing) event.preventDefault();
      return;
    }
    const locked = now - steppedAt < STEP_LOCK_MS;
    rising = dir === direction && size > previous ? rising + 1 : 0;
    previous = size;
    const resumed = !locked && low < peak / 3 && rising >= 2 && size > Math.max(low * 2.5, 12);
    if (gap > GESTURE_GAP || dir !== direction || resumed) {
      held = locked;
      peak = low = size;
      rising = 0;
      starts = [...starts.filter(start => now - start < RUSH_MS), now];
      if (starts.length >= RUSH_GESTURES) rushing = true;
    } else if (size > peak) peak = low = size;
    else low = Math.min(low, size);
    lastAt = now;
    direction = dir;
    if (rushing) return;
    if (held) { event.preventDefault(); return; }

    const start = origin();
    const at = (scrollY - start) / STEP, ahead = at + (dir * size) / STEP;
    const go = (step: number) => {
      event.preventDefault();
      held = true;
      steppedAt = now;
      scrollTo({ top: start + step * STEP, behavior: "instant" });
    };
    if (at < -.01) { if (dir > 0 && ahead > 0) go(0); return; }
    if (at > last + .01) { if (dir < 0 && ahead < last) go(last); return; }
    if ((dir > 0 && at >= last - .01) || (dir < 0 && at <= .01)) return;
    go(Math.min(last, Math.max(0, Math.round(at) + dir)));
  };
  addEventListener("wheel", onWheel, { passive: false });
  return () => removeEventListener("wheel", onWheel);
}
