

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export const HERO_ZOOM_DURATION_SCALE = 1.8;

/** Camera motion for the hero. */
export function heroZoomMotion(progress: number) {
  const zoom = clamp((progress - 0.02) / 0.34);
  const expansion = clamp((progress - 0.42) / 0.38);
  return {
    copyScale: 1 + 3.8 * zoom,
    copyOpacity: progress >= 0.42 ? 0 : 1 - clamp((progress - 0.32) / 0.1),
    copyShift: -6 * zoom,
    contentOpacity: clamp((progress - 0.42) / 0.14),
    contentScale: 0.94 + 0.06 * expansion,
    contentShift: 4 * (1 - expansion),
    radius: 16 - 4 * expansion,
  };
}

/** Soft acceleration and deceleration with no abrupt velocity at either end. */
function smoothProgress(value: number) {
  const t = clamp(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Fallback boundaries until the rendered rail has been measured.
export const SHOWCASE_PANEL_ENDS = [0.16, 0.32, 0.5, 0.66, 0.84, 1] as const;

export const SHOWCASE_CAMERA_ENDS = [0.31, 0.36, 0.64, 0.68, 0.96, 1] as const;

type RailSample = { x: number; y: number; rail: number; distance: number };

/** Give descents more scroll room to compensate for the camera's travel. */
export function showcaseTravelDistance(dx: number, dy: number) {
  return Math.hypot(dx, dy * 3.6);
}

/** Sample the measured scroll distance without changing the rail geometry. */
export function sampleShowcaseRail(progress: number, samples: readonly RailSample[]) {
  const distance = clamp(progress) * samples[samples.length - 1].distance;
  let low = 0;
  let high = samples.length - 1;
  while (high - low > 1) {
    const middle = Math.floor((low + high) / 2);
    if (samples[middle].distance < distance) low = middle;
    else high = middle;
  }
  const a = samples[low];
  const b = samples[high];
  const t = b.distance === a.distance ? 0 : (distance - a.distance) / (b.distance - a.distance);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, rail: a.rail + (b.rail - a.rail) * t };
}

/** Preserve entry framing and drift throughout the rail, including horizontal runs. */
export function followShowcaseRail(markerY: number, scene: number, viewport: number, progress: number) {
  const start = 112 - scene * 0.07;
  const end = viewport / 2 - scene * 0.5975;
  const range = Math.max(0, start - end);
  const travel = Math.min(range, Math.max(0, markerY - scene * 0.1575));
  const cushion = Math.min(64, range / 2);
  if (!cushion) return start;
  const soften = (value: number) => {
    const t = value / cushion;
    return cushion * t * t * (2 - t);
  };
  const eased = travel < cushion ? soften(travel)
    : travel > range - cushion ? range - soften(range - travel) : travel;
  return start - (0.8 * eased + 0.2 * range * smoothProgress(progress));
}

/** Ease across the route itself, so turns are anticipated without a delayed camera tween. */
export function showcaseCameraFrame(progress: number, samples: readonly RailSample[], scene: number, viewport: number) {
  const at = (value: number) => followShowcaseRail(
    sampleShowcaseRail(value, samples).y / 1000 * scene, scene, viewport, value,
  );
  const smoothAt = (value: number) => {
    let position = 0;
    let weights = 0;
    // A symmetric window starts the camera before a descent and eases out
    // after it. Reversing visits exactly the same positions, with no catch-up.
    for (let i = -32; i <= 32; i++) {
      const weight = 33 - Math.abs(i);
      position += at(clamp(value + i * 0.0025)) * weight;
      weights += weight;
    }
    return position / weights;
  };
  const first = smoothAt(0);
  const last = smoothAt(1);
  if (Math.abs(last - first) < 0.001) return at(0);
  const fraction = (smoothAt(clamp(progress)) - first) / (last - first);
  return at(0) + fraction * (at(1) - at(0));
}

/** Ease toward the camera limits without snapping or hiding the cloud. */
export function fitShowcaseCamera(target: number, markerY: number, viewport: number, inset: number) {
  const lower = inset - markerY;
  const upper = viewport - inset - markerY;
  if (upper <= lower) return viewport / 2 - markerY;
  const cushion = Math.min(48, (upper - lower) / 4);
  if (target < lower + cushion) {
    return lower + cushion * Math.exp((target - lower - cushion) / cushion);
  }
  if (target > upper - cushion) {
    return upper - cushion * Math.exp((upper - cushion - target) / cushion);
  }
  return target;
}

/** A continuous camera pass, timed to the rail rather than vertical row jumps. */
export function showcaseCameraPosition(
  progress: number,
  cameraEnds: readonly number[] = SHOWCASE_CAMERA_ENDS,
) {
  const stops = [0, ...cameraEnds];
  // Drift through the horizontal stretches; give the vertical turns more
  // travel while keeping the cloud and focused row in the clear viewport.
  const positions = [0.1575, 0.18, 0.285, 0.39, 0.505, 0.59, 0.5975];
  const slopes = positions.slice(1).map((position, index) =>
    (position - positions[index]) / (stops[index + 1] - stops[index]),
  );
  const tangents = positions.map((_, index) => {
    if (index === 0) return slopes[0];
    if (index === positions.length - 1) return slopes[slopes.length - 1];
    // Harmonic tangents preserve direction and join every segment smoothly.
    return 2 / (1 / slopes[index - 1] + 1 / slopes[index]);
  });
  const value = clamp(progress);
  const segment = Math.max(0, Math.min(slopes.length - 1,
    stops.findIndex((stop, index) => index > 0 && value <= stop) - 1,
  ));
  const span = stops[segment + 1] - stops[segment];
  const t = (value - stops[segment]) / span;
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * positions[segment]
    + (t3 - 2 * t2 + t) * span * tangents[segment]
    + (-2 * t3 + 3 * t2) * positions[segment + 1]
    + (t3 - t2) * span * tangents[segment + 1];
}

export function showcasePanelMotion(
  progress: number,
  panelEnds: readonly number[] = SHOWCASE_PANEL_ENDS,
) {
  const value = clamp(progress);
  const index = panelEnds.findIndex((end) => value <= end + 0.001);
  const active = index < 0 ? panelEnds.length - 1 : index;
  // Smooth input once in time. Easing each panel's distance creates dead
  // zones followed by bursts, even when the user scrolls at a steady speed.
  return { active, progress: value };
}
