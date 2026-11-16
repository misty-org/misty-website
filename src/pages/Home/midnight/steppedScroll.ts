/**
 * The homepage's pinned scenes (the bento and the use cases) move in steps, with the same feel in each.
 *
 * One scroll gesture moves one step. A wheel spin or a trackpad swipe, momentum and all, counts as one gesture:
 * inside a scene its first event moves the page exactly one step (STEP pixels) and the rest of it is swallowed,
 * so a big swipe can't run past several steps. A trackpad's wobbly deltas never split one swipe into several:
 * small turnarounds are ignored, a fresh swipe during momentum must clearly build up again, and nothing steps
 * again within STEP_LOCK_MS of a step. Scrolling into a scene stops at its first step (or its last, coming back
 * up), and at either end the next gesture scrolls the page on as usual. Everything else (the scrollbar, the
 * keyboard) scrolls natively.
 * What counts is how often gestures come, not how fast each one is. Gestures at about the pace of the animations
 * step as above. Gestures coming much faster than that (RUSH_GESTURES within RUSH_MS), or scroll input arriving
 * very fast (RUSH_PX of wheel deltas within RUSH_RATE_MS, a hard spin or flick, even as one gesture), mean you want
 * to get somewhere: the scene stops holding the scroll, the page scrolls freely either way, and the scene shows
 * wherever you are as you pass. Once the scrolling pauses (RUSH_RELEASE_MS), stepping picks up again from there.
 * The scroll position then says which step you want (`settleStep`), and what you see is always a timed animation,
 * never the scroll's speed.
 */

/** Pixels of scroll per step, about one wheel notch. */
export const STEP = 140;
/**
 * Wheel events closer together than this (ms) belong to one gesture, unless they turn around or a fresh swipe
 * starts during the last one's momentum (its deltas grow again, steadily, after dying down).
 */
const GESTURE_GAP = 160;
/**
 * After a step, no new gesture can move another for this long (ms). A trackpad's deltas wobble while the finger is
 * down, which can look like a fresh swipe; this keeps one swipe to one step whatever its deltas do.
 */
const STEP_LOCK_MS = 400;
/** A turnaround smaller than this (px) inside a gesture is trackpad jitter, not a swipe the other way. */
const JITTER = 6;
/**
 * Rushing: this many gestures starting within RUSH_MS lets the page scroll freely, until no wheel event has come
 * for RUSH_RELEASE_MS. A zoom takes 700ms, so four gestures in 1.2s is well ahead of what a scene can show.
 */
const RUSH_GESTURES = 4, RUSH_MS = 1200, RUSH_RELEASE_MS = 350;
/**
 * Rushing also starts when the wheel's deltas add up to RUSH_PX within RUSH_RATE_MS, whether or not the scene let
 * them scroll. It counts distance, not events: a trackpad sends 60 to 120 events a second on any swipe, so only
 * their size tells a hard flick from a gentle one. A mouse wheel notch is about 100px, so this is ten or more
 * notches in under a third of a second, or a trackpad flick well past an ordinary swipe.
 */
const RUSH_PX = 1600, RUSH_RATE_MS = 300;
/** How far into the next step (in steps) the scroll must be before the wanted step changes, either way. */
const HYSTERESIS = .6;

/**
 * The step the scroll asks for, `raw` steps into the scene. It moves on from `previous` only once the scroll is
 * HYSTERESIS into another step, so a wheel resting on a boundary never flickers between two. -1 means none yet.
 */
export function settleStep(raw: number, previous: number, last: number): number {
  if (previous >= 0 && Math.abs(raw - previous) <= HYSTERESIS) return previous;
  return Math.min(last, Math.max(0, Math.round(raw)));
}

/**
 * Holds the wheel to one step per gesture inside a scene whose step 0 sits at `origin()` on the page (scrollY)
 * and whose steps run to `last`. Returns the cleanup.
 */
export function holdWheelToSteps(origin: () => number, last: number): () => void {
  // `held` marks a gesture that already moved a step: the rest of it, momentum included, is swallowed. A gesture
  // is the run of wheel events less than GESTURE_GAP apart in one direction; a new swipe during momentum shows as
  // deltas growing again, two events in a row, after they had died down to a third. Tiny turnarounds are jitter and
  // change nothing, and for STEP_LOCK_MS after a step a new gesture is swallowed whole instead of stepping again.
  // While `rushing`, the wheel is left alone entirely; `starts` holds when recent gestures began.
  let lastAt = -Infinity, direction = 0, peak = 0, low = 0, previous = 0, rising = 0, steppedAt = -Infinity;
  let held = false, rushing = false, starts: number[] = [];
  // The wheel's recent deltas, for how fast scrolling is coming in (RUSH_PX within RUSH_RATE_MS).
  let recent: { at: number; size: number }[] = [], recentSum = 0;
  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const size = Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    const dir = Math.sign(event.deltaY);
    const now = event.timeStamp, gap = now - lastAt;
    // A pause ends rushing and forgets the gestures before it.
    if (gap > RUSH_RELEASE_MS) { rushing = false; starts = []; recent = []; recentSum = 0; }
    // Scroll coming in very fast is a rush on its own, even inside one gesture.
    recent.push({ at: now, size });
    recentSum += size;
    while (recent.length && now - recent[0]!.at > RUSH_RATE_MS) recentSum -= recent.shift()!.size;
    if (recentSum >= RUSH_PX) rushing = true;
    // A small turnaround mid-gesture is the finger wobbling: swallow it and keep the gesture as it was.
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
      // A gesture that starts too soon after a step is swallowed whole.
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

    // Where step 0 sits on the page, and how many steps into the scene the page is now (fractional).
    const start = origin();
    const at = (scrollY - start) / STEP, ahead = at + (dir * size) / STEP;
    const go = (step: number) => {
      event.preventDefault();
      held = true;
      steppedAt = now;
      scrollTo({ top: start + step * STEP, behavior: "instant" });
    };
    if (at < -.01) { if (dir > 0 && ahead > 0) go(0); return; } // above the scene: stop on its first step
    if (at > last + .01) { if (dir < 0 && ahead < last) go(last); return; } // below it: stop on its last
    if ((dir > 0 && at >= last - .01) || (dir < 0 && at <= .01)) return; // at an end, heading out: let it go
    go(Math.min(last, Math.max(0, Math.round(at) + dir)));
  };
  addEventListener("wheel", onWheel, { passive: false });
  return () => removeEventListener("wheel", onWheel);
}
