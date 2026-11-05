/**
 * A rope along a route, drawn on a canvas: three strands braided together, each passing over and under the
 * others as it winds. The rope follows the route's curves, and its twists slowly travel along it, so it
 * keeps turning, and short streaks of light run along it from its start to its end. Colors are the page's pastels,
 * one per strand.
 */

type Point = { x: number; y: number };
/** A stop the centerline passes through, heading along (dx, dy). */
type Heading = Point & { dx: number; dy: number };

export const RIBBON = {
  /** Strands braided into the rope. */
  lines: 3,
  /** Unused by the rope; the centerline code reads it. */
  spacing: 0,
  /** How far, in pixels, a strand swings to either side of the rope's axis. */
  amplitude: 62,
  /** Pixels of rope per full twist of the braid. */
  wavelength: 780,
  bulge: 0,
  /** Radians the braid turns per pixel the page scrolls: scrolling winds the rope one way, scrolling back unwinds it. */
  windPerPixel: .011,
  /** Pixels between samples along the route. */
  step: 6,
  /** Seconds for the rope to draw in the first time it shows. */
  drawIn: 1.8,
  /** Width of a strand, and of the dark edge around it that makes the strands read as over and under. */
  strand: 7,
  edge: 14.5,
  /** Streaks of light that run the whole rope, start to end: how many, how long (px), how fast (px/s), and the rest between runs (px of travel). */
  streaks: 7,
  streakLength: 170,
  streakSpeed: 820,
  streakRest: 250,
} as const;

/** How far a turn's handles reach, as a share of the way to the next stop: longer handles round the turns off. */
const TURN = .85;

type Sample = Point & { nx: number; ny: number; tx: number; ty: number; scale: number };

/**
 * Samples the route's centerline evenly by arc length. Between stops it curves like a cubic that
 * leaves and enters each stop along its heading. Each sample also carries how far the lines may
 * swing there without folding over a tight turn.
 */
export function sampleCenterline(stops: readonly Heading[]): Sample[] {
  const raw: Point[] = [stops[0]];
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1], b = stops[i];
    const ka = Math.abs((b.x - a.x) * a.dx + (b.y - a.y) * a.dy) * TURN;
    const kb = Math.abs((b.x - a.x) * b.dx + (b.y - a.y) * b.dy) * TURN;
    const c1 = { x: a.x + a.dx * ka, y: a.y + a.dy * ka }, c2 = { x: b.x - b.dx * kb, y: b.y - b.dy * kb };
    for (let j = 1; j <= 64; j++) {
      const u = j / 64, v = 1 - u;
      raw.push({
        x: v * v * v * a.x + 3 * v * v * u * c1.x + 3 * v * u * u * c2.x + u * u * u * b.x,
        y: v * v * v * a.y + 3 * v * v * u * c1.y + 3 * v * u * u * c2.y + u * u * u * b.y,
      });
    }
  }
  // Resample every RIBBON.step pixels of arc length.
  const even: Point[] = [raw[0]];
  let carry = 0;
  for (let i = 1; i < raw.length; i++) {
    const a = raw[i - 1], b = raw[i];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    let at = RIBBON.step - carry;
    while (at <= length) {
      even.push({ x: a.x + (b.x - a.x) * at / length, y: a.y + (b.y - a.y) * at / length });
      at += RIBBON.step;
    }
    carry = length - (at - RIBBON.step);
  }
  // Round every corner of the route off, so the rope never has to turn tighter than its own width: where it does,
  // the strands squash together into a flat stripe. Each point becomes the average of its neighbors on both sides
  // (the window shrinks toward the ends, so the route still starts and ends where it was told to).
  const round = (points: Point[], reach: number) => points.map((_, i) => {
    const k = Math.min(reach, i, points.length - 1 - i);
    let x = 0, y = 0;
    for (let j = i - k; j <= i + k; j++) { x += points[j].x; y += points[j].y; }
    return { x: x / (2 * k + 1), y: y / (2 * k + 1) };
  });
  const rounded = round(round(even, 24), 24);
  const samples = rounded.map((p, i) => {
    const a = rounded[Math.max(0, i - 1)], b = rounded[Math.min(rounded.length - 1, i + 1)];
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const tx = (b.x - a.x) / length, ty = (b.y - a.y) / length;
    return { ...p, tx, ty, nx: -ty, ny: tx, scale: 1 };
  });
  // Turn radius from the change in heading over a short stretch. A line offset from the centerline by
  // more than the radius folds over itself on the inside of a turn and shows as a kink, so wherever
  // the turn is tight the swing is eased until the widest line stays inside it. The easing spreads to
  // the neighbors (a minimum over a window, then a blur narrower than that window, so the bundle never narrows faster than it can bend), so it never has a
  // corner of its own.
  const reach = RIBBON.amplitude * (1 + RIBBON.bulge * .35) + RIBBON.lines * RIBBON.spacing / 2 + 5;
  const bend = samples.map((_, i) => {
    const a = samples[Math.max(0, i - 4)], b = samples[Math.min(samples.length - 1, i + 4)];
    return Math.abs(Math.atan2(a.tx * b.ty - a.ty * b.tx, a.tx * b.tx + a.ty * b.ty)) / (8 * RIBBON.step);
  });
  const smooth = (values: number[], radius: number) => values.map((_, i) => {
    let sum = 0, count = 0;
    for (let j = Math.max(0, i - radius); j <= Math.min(values.length - 1, i + radius); j++) { sum += values[j]; count++; }
    return sum / count;
  });
  // Never squeeze the strands below half their swing: past that they flatten into a stripe, and the rounded route above
  // already keeps the turns wide enough for this not to fold.
  const ideal = bend.map(curve => curve > 0 ? Math.max(.5, Math.min(1, .8 / (curve * reach))) : 1);
  const tightest = ideal.map((_, i) => {
    let least = 1;
    for (let j = Math.max(0, i - 85); j <= Math.min(ideal.length - 1, i + 85); j++) least = Math.min(least, ideal[j]);
    return least;
  });
  // Blurred twice, about 640px each way: the lines drift in and out of their narrower spread over a long
  // stretch, since a quick change in the swing shows as a jog in the inner lines.
  smooth(smooth(tightest, 40), 40).forEach((scale, i) => { samples[i].scale = scale; });
  return samples;
}

type Rgb = readonly [number, number, number];
/** One pastel per strand; they come from the page's CSS, so they follow the theme. */
type Palette = readonly Rgb[];

/**
 * Draws one frame. `extent` (0–1) is how much of the rope has been paid out from its start; `extent` (0–1) is how much of the rope is out, `turn` (radians) winds the braid, and `time` moves the streaks.
 * `edge` is the page's background color, which outlines each strand where it crosses another.
 */
export function drawRibbon(ctx: CanvasRenderingContext2D, samples: readonly Sample[], palette: Palette, time: number, extent: number, edge: Rgb = [10, 10, 11], turn = 0) {
  const { lines, step, amplitude, wavelength, strand, edge: edgeWidth, streaks, streakLength, streakSpeed, streakRest } = RIBBON;
  const rgba = ([r, g, b]: Rgb, a: number) => `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const shown = Math.min(samples.length - 1, Math.floor(extent * (samples.length - 1)));
  // The rope breathes: its swing swells and eases back, slowly.
  const breath = 1 + .12 * Math.sin(time * .9);
  const point = (index: number, strandIndex: number) => {
    const c = samples[index];
    const angle = (index * step / wavelength) * Math.PI * 2 - turn + (strandIndex * Math.PI * 2) / lines;
    const swing = Math.sin(angle) * amplitude * breath * c.scale;
    return { x: c.x + c.nx * swing, y: c.y + c.ny * swing, front: Math.cos(angle) };
  };
  // Where each streak's head is, measured along the rope. They run once the rope has drawn in, one behind the
  // other, each on its own strand, and rest off the far end before they start again.
  const routeLength = samples.length * step, cycle = routeLength + streakLength * 2 + streakRest;
  const heads = Array.from({ length: streaks }, (_, p) => ({
    at: ((time * streakSpeed + (p * cycle) / streaks) % cycle) - streakLength, strand: p % lines,
  }));
  // How lit a strand is at a sample: brightest at a streak's head, fading to nothing along its tail.
  const glow = (index: number, strandIndex: number) => heads.reduce((most, head) => {
    if (head.strand !== strandIndex) return most;
    const behind = (head.at - index * step) / streakLength;
    return behind < 0 || behind > 1 ? most : Math.max(most, (1 - behind) ** 1.5);
  }, 0);
  let previous = Array.from({ length: lines }, (_, k) => point(0, k));
  for (let i = 1; i <= shown; i++) {
    const current = Array.from({ length: lines }, (_, k) => point(i, k));
    // Back strands first, so the front one crosses over.
    const order = [...current.keys()].sort((a, b) => current[a].front + previous[a].front - current[b].front - previous[b].front);
    for (const k of order) {
      const a = previous[k], b = current[k];
      const front = (a.front + b.front) / 2;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineWidth = edgeWidth;
      ctx.strokeStyle = rgba(edge, .9);
      ctx.stroke();
      ctx.lineWidth = strand;
      ctx.strokeStyle = rgba(palette[k % palette.length], .55 + .45 * (front + 1) / 2);
      ctx.stroke();
      const light = glow(i, k);
      if (light > .02) {
        // A streak: the strand brightens toward white, with a soft wider halo around it.
        ctx.lineWidth = strand * 2.6;
        ctx.strokeStyle = rgba(palette[k % palette.length], .2 * light);
        ctx.stroke();
        ctx.lineWidth = strand * .8;
        ctx.strokeStyle = rgba([255, 250, 232], Math.min(1, light) * (.55 + .45 * (front + 1) / 2));
        ctx.stroke();
      }
    }
    previous = current;
  }
}
