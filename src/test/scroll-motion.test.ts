import { expect, it } from "vitest";
import { SHOWCASE_CAMERA_ENDS, SHOWCASE_PANEL_ENDS, fitShowcaseCamera, showcaseCameraPosition, showcasePanelMotion } from "@/pages/Home/scrollMotion";

it("keeps small scrolls responsive on both sides of every panel boundary", () => {
  for (const end of SHOWCASE_PANEL_ENDS.slice(0, -1)) {
    const positions = [end - 0.002, end - 0.001, end, end + 0.001, end + 0.002];
    const values = positions.map(value => showcasePanelMotion(value).progress);
    for (let i = 1; i < values.length; i++) {
      expect(values[i] - values[i - 1]).toBeCloseTo(0.001, 8);
    }
  }
});

it("selects one panel from the measured rail without changing its travel", () => {
  const ends = [0.21, 0.36, 0.55, 0.69, 0.88, 1];
  let previous = 0;
  ends.forEach((end, index) => {
    const middle = (previous + end) / 2;
    expect(showcasePanelMotion(middle, ends)).toEqual({ active: index, progress: middle });
    expect(showcasePanelMotion(end, ends)).toEqual({ active: index, progress: end });
    previous = end;
  });
});


it("keeps the camera moving without pauses, reversals, or velocity jumps", () => {
  for (const ends of [SHOWCASE_CAMERA_ENDS, [0.29, 0.37, 0.61, 0.69, 0.94, 1]]) {
    let previous = showcaseCameraPosition(0, ends);
    for (let step = 1; step <= 1000; step++) {
      const value = showcaseCameraPosition(step / 1000, ends);
      expect(value).toBeGreaterThan(previous);
      expect(value - previous).toBeLessThan(0.006);
      previous = value;
    }
    for (const boundary of ends.slice(0, -1)) {
      const delta = 0.00001;
      const left = (showcaseCameraPosition(boundary, ends) - showcaseCameraPosition(boundary - delta, ends)) / delta;
      const right = (showcaseCameraPosition(boundary + delta, ends) - showcaseCameraPosition(boundary, ends)) / delta;
      expect(Math.abs(left - right)).toBeLessThan(0.01);
    }
    expect(showcaseCameraPosition(-1, ends)).toBeCloseTo(0.1575);
    expect(showcaseCameraPosition(2, ends)).toBeCloseTo(0.5975);
  }
});


it("keeps the cloud inside its clear area while easing through camera limits", () => {
  let previous = -Infinity;
  for (let target = -1200; target <= 400; target += 1) {
    const camera = fitShowcaseCamera(target, 600, 820, 190);
    expect(camera + 600).toBeGreaterThanOrEqual(190);
    expect(camera + 600).toBeLessThanOrEqual(630);
    expect(camera).toBeGreaterThanOrEqual(previous);
    if (Number.isFinite(previous)) expect(camera - previous).toBeLessThanOrEqual(1.00001);
    previous = camera;
  }
});



it("preserves entry framing and drifts continuously through horizontal and vertical travel", async () => {
  const { followShowcaseRail } = await import("@/pages/Home/scrollMotion");
  const start = followShowcaseRail(315, 2000, 828, 0);
  expect(start).toBe(112 - 2000 * 0.07);
  let previous = start;
  for (let step = 1; step <= 200; step++) {
    const value = followShowcaseRail(110, 2000, 828, step / 1000);
    expect(value).toBeLessThan(previous);
    expect(previous - value).toBeLessThan(0.2);
    previous = value;
  }
  for (let y = 316; y <= 1370; y++) {
    const progress = 0.2 + 0.8 * (y - 315) / 1055;
    const value = followShowcaseRail(y, 2000, 828, progress);
    expect(value).toBeLessThan(previous);
    expect(previous - value).toBeLessThan(1.5);
    previous = value;
  }
  expect(previous).toBeCloseTo(828 / 2 - 2000 * 0.5975);

});

it("gives vertical travel more scroll room even when the scene stretches the SVG", async () => {
  const { sampleShowcaseRail, showcaseTravelDistance } = await import("@/pages/Home/scrollMotion");
  const samples = [
    { x: 0, y: 0, rail: 0, distance: 0 },
    { x: 100, y: 0, rail: 0.5, distance: showcaseTravelDistance(100, 0) },
    { x: 100, y: 100, rail: 1, distance: showcaseTravelDistance(100, 0) + showcaseTravelDistance(0, 200) },
  ];
  const horizontal = sampleShowcaseRail(0.1, samples).x - sampleShowcaseRail(0.05, samples).x;
  const vertical = (sampleShowcaseRail(0.7, samples).y - sampleShowcaseRail(0.65, samples).y) * 2;
  expect(vertical / horizontal).toBeCloseTo(1 / 3.6);
});

it("preserves spring momentum during input and settles without overshooting", async () => {
  const { stepScrollSpring } = await import("@/hooks/scrollSpring");
  let state = { position: 0, velocity: 0 };
  for (let frame = 1; frame <= 30; frame++) state = stepScrollSpring(state.position, state.velocity, frame / 100, 1 / 60);
  expect(state.position).toBeGreaterThan(0.15);
  const released = state.position;
  expect(0.3 - released).toBeLessThan(0.03);
  for (let frame = 0; frame < 120; frame++) {
    const next = stepScrollSpring(state.position, state.velocity, 0.3, 1 / 60);
    expect(next.position).toBeGreaterThanOrEqual(state.position);
    expect(next.position).toBeLessThanOrEqual(0.300001);
    state = next;
  }
  expect(state.position).toBeGreaterThan(released);
  expect(state.position).toBeCloseTo(0.3, 6);
  expect(state.velocity).toBeCloseTo(0, 6);
});

it("anticipates camera turns without lag, jumps, or different framing on reversal", async () => {
  const { showcaseCameraFrame } = await import("@/pages/Home/scrollMotion");
  const samples = [
    { x: 42, y: 157.5, rail: 0, distance: 0 },
    { x: 20, y: 55, rail: 0.1, distance: 400 },
    { x: 1180, y: 55, rail: 0.3, distance: 1600 },
    { x: 1180, y: 267.5, rail: 0.4, distance: 2800 },
    { x: 20, y: 267.5, rail: 0.6, distance: 4000 },
    { x: 20, y: 487.5, rail: 0.7, distance: 5200 },
    { x: 1180, y: 487.5, rail: 0.9, distance: 6400 },
    { x: 1180, y: 670, rail: 1, distance: 7500 },
  ];
  const camera = (progress: number) => showcaseCameraFrame(progress, samples, 2000, 828);
  expect(camera(0)).toBeCloseTo(-28);
  expect(camera(1)).toBeCloseTo(828 / 2 - 2000 * 0.5975);
  const positions = Array.from({ length: 1001 }, (_, i) => camera(i / 1000));
  for (let i = 1; i < positions.length; i++) {
    expect(positions[i]).toBeLessThan(positions[i - 1]);
    expect(positions[i - 1] - positions[i]).toBeLessThan(3);
    if (i > 1) expect(Math.abs(positions[i] - 2 * positions[i - 1] + positions[i - 2])).toBeLessThan(0.1);
  }
  for (let i = 1000; i >= 0; i--) expect(camera(i / 1000)).toBe(positions[i]);
});
