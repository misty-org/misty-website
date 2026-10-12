/**
 * A ribbon of fine lines along a route, drawn on a canvas. Each line is its own wave: one shared
 * frequency, but a phase that shifts line by line, plus a slower "twist" harmonic, so the lines
 * fan apart, cross and braid instead of running side by side. The twist rolls over time, and short
 * streaks of light travel along a few of the lines. Colors blend through the page's pastels.
 */

export type Point = { x: number; y: number };
/** A stop the centerline passes through, heading along (dx, dy). */
export type Heading = Point & { dx: number; dy: number };

export const RIBBON = {
  lines: 16,
  /** Pixels between neighboring lines before the waves move them apart. */
  spacing: 2.5,
  /** How far, in pixels, the waves swing the lines off the centerline. */
  amplitude: 74,
  /** Pixels of route per pass of the wave pattern. */
  wavelength: 1100,
  frequency: .75,
  /** Phase step from one line to the next; it is what fans them apart. */
  phase: .2,
  twist: .41,
  bulge: .66,
  morph: .5,
  /** Twist roll, radians per second. */
  spin: .7,
  /** Pixels between samples along the route. */
  step: 8,
  /** Seconds for the lines to draw in the first time the ribbon shows. */
  drawIn: 1.5,
  /** Streaks of light: share of lines that carry one, their length, and their speed. */
  streakShare: .35,
  streakLength: 64,
  streakSpeed: 380,
  /** Pixels at each end of the route where the lines fade out. */
  endFade: 140,
} as const;

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
    const ka = Math.abs((b.x - a.x) * a.dx + (b.y - a.y) * a.dy) / 2;
    const kb = Math.abs((b.x - a.x) * b.dx + (b.y - a.y) * b.dy) / 2;
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
  const samples = even.map((p, i) => {
    const a = even[Math.max(0, i - 1)], b = even[Math.min(even.length - 1, i + 1)];
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const tx = (b.x - a.x) / length, ty = (b.y - a.y) / length;
    return { ...p, tx, ty, nx: -ty, ny: tx, scale: 1 };
  });
  // Turn radius from the change in heading, averaged over a long stretch so it changes gently.
  // Where the radius is under the lines' usual reach, the swing eases in a little so the inner
  // lines don't fold over; it never gathers them tighter than `floor`.
  const reach = RIBBON.amplitude * .8 + RIBBON.lines * RIBBON.spacing / 2, floor = .6;
  const bend = samples.map((_, i) => {
    const a = samples[Math.max(0, i - 6)], b = samples[Math.min(samples.length - 1, i + 6)];
    return Math.abs(Math.atan2(a.tx * b.ty - a.ty * b.tx, a.tx * b.tx + a.ty * b.ty)) / (12 * RIBBON.step);
  });
  const smooth = (values: number[], radius: number) => values.map((_, i) => {
    let sum = 0, count = 0;
    for (let j = Math.max(0, i - radius); j <= Math.min(values.length - 1, i + radius); j++) { sum += values[j]; count++; }
    return sum / count;
  });
  const target = smooth(bend, 12).map(curve => curve > 0 ? Math.min(1, Math.max(floor, .9 / curve / reach)) : 1);
  smooth(target, 24).forEach((scale, i) => { samples[i].scale = scale; });
  return samples;
}

/** Deterministic 0–1 hash, so the same lines carry streaks on every load. */
function hash(a: number, b: number) {
  let r = (0x165667b1 * a + 0x27d4eb2f * b) | 0;
  r = Math.imul(r ^ (r >>> 13), 0x4bf19f61);
  return ((r ^ (r >>> 16)) >>> 0) % 1e5 / 1e5;
}

/** Offset of line `line` from the centerline at arc length `s`, at time `time` seconds. */
function offset(line: number, s: number, time: number) {
  const { lines, phase, twist, bulge, morph, frequency, wavelength, spacing, amplitude, spin } = RIBBON;
  const t = s / wavelength;
  const shift = phase * (line - (lines - 1) / 2);
  const w = frequency * Math.PI * 2;
  const swell = 1 + bulge * Math.sin(t * Math.PI) ** 2;
  const main = Math.sin(w * t + shift);
  const roll = Math.sin(.5 * w * t - 2 * shift + spin * time);
  const wobble = Math.sin(3.7 * t + .2 * line) * Math.cos(2.1 * t + .13 * line);
  return (line / (lines - 1) - .5) * lines * spacing + (main + twist * roll + morph * wobble) * .5 * swell * amplitude;
}

type Rgb = readonly [number, number, number];
/** Pastel tones, in order across the bundle; they come from the page's CSS, so they follow the theme. */
export type Palette = readonly Rgb[];

/** The palette's blend at `u` (0–1), evenly spaced stops. */
function blend(palette: Palette, u: number): Rgb {
  const at = u * (palette.length - 1), i = Math.min(palette.length - 2, Math.floor(at)), f = at - i;
  const [a, b] = [palette[i], palette[i + 1]];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

/**
 * Draws one frame. `reveal` (0–1) draws the lines in, staggered; `time` rolls the twist and moves
 * the streaks.
 */
export function drawRibbon(ctx: CanvasRenderingContext2D, samples: readonly Sample[], palette: Palette, time: number, reveal: number) {
  const { lines, step, streakShare, streakLength, streakSpeed, endFade } = RIBBON;
  const rgba = ([r, g, b]: Rgb, a: number) => `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = 1;
  const routeLength = samples.length * step;
  const paths: Point[][] = [];
  for (let line = 0; line < lines; line++) {
    const points = samples.map((c, i) => {
      const o = offset(line, i * step, time) * c.scale;
      return { x: c.x + c.nx * o, y: c.y + c.ny * o };
    });
    paths.push(points);
    const shown = Math.min(1, Math.max(0, reveal / (.6 + .4 * hash(line, 53))));
    if (shown <= 0) continue;
    const eased = shown * shown * (3 - 2 * shown);
    ctx.setLineDash(eased < 1 ? [routeLength * 1.3 * eased, routeLength * 2] : []);
    // The pastels blend across the bundle, line by line; the middle lines are a touch stronger.
    ctx.strokeStyle = rgba(blend(palette, line / (lines - 1)), .95 - .35 * Math.abs(line / (lines - 1) - .5) * 2);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const p = points[i], q = points[i + 1];
      ctx.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2);
    }
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Fade both ends of the route out, so the lines start and stop softly at the tile edges.
  ctx.globalCompositeOperation = "destination-out";
  for (const [at, toward] of [[samples[0], 1], [samples[samples.length - 1], -1]] as const) {
    const end = { x: at.x + at.tx * endFade * toward, y: at.y + at.ty * endFade * toward };
    const fade = ctx.createLinearGradient(at.x, at.y, end.x, end.y);
    fade.addColorStop(0, "rgba(0,0,0,1)");
    fade.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = fade;
    ctx.beginPath();
    ctx.arc(at.x, at.y, endFade * 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";

  // Streaks: a short bright dash in one of the pastels on a sparse set of lines, travelling the
  // route, then resting.
  if (reveal < 1) return;
  ctx.lineWidth = 2.5;
  const travel = routeLength / streakSpeed, rest = 1.6;
  for (let line = 0; line < lines; line++) {
    if (hash(line, 7) > streakShare) continue;
    const cycle = (time + hash(line, 3) * (travel + rest)) % (travel + rest);
    if (cycle > travel) continue;
    const u = cycle / travel;
    const fade = u < .1 ? u / .1 : u > .9 ? (1 - u) / .1 : 1;
    const points = paths[line];
    const i = Math.min(points.length - 2, Math.floor(u * (points.length - 1)));
    const p = points[i], q = points[i + 1];
    const length = Math.hypot(q.x - p.x, q.y - p.y) || 1;
    const dx = (q.x - p.x) / length * streakLength / 2, dy = (q.y - p.y) / length * streakLength / 2;
    const streak = ctx.createLinearGradient(p.x - dx, p.y - dy, p.x + dx, p.y + dy);
    const tone = palette[Math.floor(hash(line, 11) * palette.length) % palette.length];
    streak.addColorStop(0, rgba(tone, 0));
    streak.addColorStop(1, rgba(tone, fade));
    ctx.strokeStyle = streak;
    ctx.beginPath();
    ctx.moveTo(p.x - dx, p.y - dy);
    ctx.lineTo(p.x + dx, p.y + dy);
    ctx.stroke();
  }
}
