import { noise1D, smoothPath, rng } from "@/lib/noise";

export type Orientation = "across" | "down";

/**
 * The river is modelled along a flow axis `t` (time, downstream) and a cross axis `c`.
 * "across" maps t→x for wide screens; "down" maps t→y for phones.
 */
export interface RiverModel {
  orientation: Orientation;
  days: number;
  dayLen: number;
  margin: number;
  length: number;
  cross: number;
  width: number;
  height: number;
  center: (t: number) => number;
  half: (t: number) => number;
  pt: (t: number, c: number) => [number, number];
  dayStart: (i: number) => number;
  water: string[];
  banks: { d: string; w: number; o: number }[];
  ripples: { d: string; dash: string; w: number; o: number }[];
  reeds: string[];
}

const PRESETS = {
  across: { dayLen: 420, margin: 170, cross: 680, centerBase: 300, amp: 44, halfBase: 74, halfAmp: 16 },
  down: { dayLen: 210, margin: 90, cross: 390, centerBase: 136, amp: 16, halfBase: 42, halfAmp: 8 },
};

export function buildRiver(orientation: Orientation, days: number, seed = 7): RiverModel {
  const p = PRESETS[orientation];
  const length = p.margin * 2 + days * p.dayLen;
  const nCenter = noise1D(seed);
  const nHalf = noise1D(seed + 11);
  const nGrain = noise1D(seed + 23);

  const center = (t: number) => p.centerBase + nCenter(t / 900) * p.amp;
  const half = (t: number) => p.halfBase + nHalf(t / 500) * p.halfAmp;
  const pt = (t: number, c: number): [number, number] => (orientation === "across" ? [t, c] : [c, t]);
  const dayStart = (i: number) => p.margin + i * p.dayLen;

  const step = 24;
  const ts: number[] = [];
  for (let t = -40; t <= length + 40; t += step) ts.push(t);

  // A slightly different bank each pass, like a brush going over the same line twice.
  const bank = (side: -1 | 1, jitter: number, k: number) =>
    ts.map((t) => pt(t, center(t) + side * (half(t) + nGrain(t / 60 + k * 7) * jitter)));

  const wash = (scale: number, k: number) => {
    const edge = (side: -1 | 1, kk: number) =>
      ts.map((t) => pt(t, center(t) + side * half(t) * scale + nGrain(t / 160 + kk) * half(t) * 0.22 * (1 - scale * 0.6)));
    const far = edge(-1, k);
    const near = edge(1, k + 3).reverse();
    return `${smoothPath(far)} L${near[0][0].toFixed(1)} ${near[0][1].toFixed(1)} ${smoothPath(near).replace(/^M[^C]*/, "")} Z`;
  };

  const water = [wash(1, 1), wash(0.72, 5), wash(0.35, 9)];

  const banks = [
    { d: smoothPath(bank(-1, 2.5, 1)), w: 1.6, o: 0.75 },
    { d: smoothPath(bank(-1, 4, 2)), w: 0.8, o: 0.35 },
    { d: smoothPath(bank(1, 2.5, 3)), w: 1.6, o: 0.75 },
    { d: smoothPath(bank(1, 4, 4)), w: 0.8, o: 0.35 },
  ];

  const r = rng(seed + 99);
  const ripples = [-0.55, -0.3, -0.05, 0.2, 0.45, 0.65].map((f, i) => ({
    d: smoothPath(ts.map((t) => pt(t, center(t) + f * half(t) + nGrain(t / 90 + i) * 4))),
    dash: `${8 + Math.round(r() * 16)} ${50 + Math.round(r() * 70)} ${3 + Math.round(r() * 6)} ${70 + Math.round(r() * 60)}`,
    w: 0.9 + r() * 0.8,
    o: 0.35 + r() * 0.3,
  }));

  // Reed tufts on the near bank mark where one day becomes the next. They always grow upward on screen.
  const reeds: string[] = [];
  for (let i = 0; i <= days; i++) {
    const t = dayStart(i);
    const [bx, by] = pt(t, center(t) + half(t) + 4);
    const blades = [-8, -4, 0, 4, 7].map((dx, j) => {
      const h = 15 + ((j * 7 + i * 3) % 10);
      const lean = (j - 2) * 2.6;
      const x0 = bx + dx;
      return `M${x0.toFixed(1)} ${by.toFixed(1)} Q${(x0 + lean * 0.3).toFixed(1)} ${(by - h * 0.6).toFixed(1)} ${(x0 + lean * 1.6).toFixed(1)} ${(by - h).toFixed(1)}`;
    });
    reeds.push(blades.join(" "));
  }

  const [width, height] = orientation === "across" ? [length, p.cross] : [p.cross, length];

  return {
    orientation,
    days,
    dayLen: p.dayLen,
    margin: p.margin,
    length,
    cross: p.cross,
    width,
    height,
    center,
    half,
    pt,
    dayStart,
    water,
    banks,
    ripples,
    reeds,
  };
}
