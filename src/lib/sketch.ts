import { noise1D, rng } from "./noise";

export type P = [number, number];

/** A drawn mark. Tapered strokes are filled outlines; thin lines are stroked so they can draw themselves in. */
export type Mark =
  | { kind: "fill"; d: string; o?: number }
  | { kind: "line"; d: string; w: number; o?: number };

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Compact path data: absolute start, then relative steps rounded to 0.1. */
function encode(pts: P[], closed: boolean) {
  let [px, py] = [r1(pts[0][0]), r1(pts[0][1])];
  let d = `M${px} ${py}l`;
  for (let i = 1; i < pts.length; i++) {
    const x = r1(pts[i][0]);
    const y = r1(pts[i][1]);
    const dx = r1(x - px);
    const dy = r1(y - py);
    d += `${dx}${dy < 0 ? "" : " "}${dy} `;
    px = x;
    py = y;
  }
  return d.trimEnd() + (closed ? "z" : "");
}

/** Catmull-Rom through control points, sampled densely. */
export function spline(pts: P[], samples = 10): P[] {
  if (pts.length < 3) return pts;
  const out: P[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    for (let s = 0; s < samples; s++) {
      const t = s / samples;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function resample(pts: P[], step: number): P[] {
  const out: P[] = [pts[0]];
  let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const len = Math.hypot(bx - ax, by - ay);
    let d = step - carry;
    while (d <= len) {
      out.push([ax + ((bx - ax) * d) / len, ay + ((by - ay) * d) / len]);
      d += step;
    }
    carry = len - (d - step);
  }
  if (out.length < 2) out.push(pts[pts.length - 1]);
  return out;
}

/** A hand with a pen: every mark wobbles a little and no two are alike. */
export class Pen {
  private r: () => number;
  private n: (x: number) => number;
  marks: Mark[] = [];

  constructor(seed: number) {
    this.r = rng(seed);
    this.n = noise1D(seed + 7);
  }

  rand(a = 0, b = 1) {
    return a + this.r() * (b - a);
  }

  /** Ink line with pressure: thin at both ends, swelling in the middle. */
  stroke(ctrl: P[], width = 1.3, opts: { jitter?: number; taper?: number; o?: number; profile?: (t: number) => number } = {}) {
    const { jitter = 0.7, taper = 1, o, profile } = opts;
    const c = resample(spline(ctrl), Math.max(2.4, Math.min(5, width * 1.6)));
    if (c.length < 3) return;
    const off = this.r() * 500;
    const left: P[] = [];
    const right: P[] = [];
    for (let i = 0; i < c.length; i++) {
      const a = c[Math.max(0, i - 1)];
      const b = c[Math.min(c.length - 1, i + 1)];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const nx = -(b[1] - a[1]) / len;
      const ny = (b[0] - a[0]) / len;
      const t = i / (c.length - 1);
      const press = profile ? profile(t) : Math.pow(Math.sin(Math.PI * (0.04 + t * 0.92)), 0.55 * taper);
      const w = width * (0.3 + 0.7 * press) * (0.8 + 0.35 * (this.n(off + i * 0.09) + 1) / 2);
      const j = this.n(off + 40 + i * 0.12) * jitter;
      const cx = c[i][0] + nx * j;
      const cy = c[i][1] + ny * j;
      left.push([cx + (nx * w) / 2, cy + (ny * w) / 2]);
      right.push([cx - (nx * w) / 2, cy - (ny * w) / 2]);
    }
    const d = encode([...left, ...right.reverse()], true);
    this.marks.push({ kind: "fill", d, o });
  }

  /** A fine constant line, used for scribbles and hatching; it can be drawn in with a dash animation. */
  line(ctrl: P[], width = 0.7, o?: number, step = 2.5) {
    const c = resample(spline(ctrl, 6), step);
    if (c.length < 2) return;
    const off = this.r() * 500;
    const d = encode(
      c.map(([x, y], i) => {
        const j = this.n(off + i * 0.2) * 0.5;
        return [x + j, y - j] as P;
      }),
      false,
    );
    this.marks.push({ kind: "line", d, w: width, o });
  }

  /** A straight-ish line between two points, slightly bowed, sometimes overshooting. */
  rule(a: P, b: P, width = 1.1, o?: number) {
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const bow = this.rand(-0.025, 0.025) * len;
    const nx = -(b[1] - a[1]) / (len || 1);
    const ny = (b[0] - a[0]) / (len || 1);
    this.stroke([a, [mx + nx * bow, my + ny * bow], b], width, { o });
  }

  /** A circle the way people draw them: not quite closed, a bit egg-shaped, often gone over twice. */
  circle(cx: number, cy: number, r: number, width = 1.1, passes = 2, o?: number) {
    for (let p = 0; p < passes; p++) {
      const start = this.rand(0, Math.PI * 2);
      const sweep = Math.PI * 2 * this.rand(1.02, 1.12);
      const sq = this.rand(0.9, 1.08);
      const pts: P[] = [];
      for (let i = 0; i <= 14; i++) {
        const a = start + (sweep * i) / 14;
        const rr = r * (1 + this.rand(-0.04, 0.04));
        pts.push([cx + Math.cos(a) * rr * sq, cy + Math.sin(a) * rr]);
      }
      this.stroke(pts, width * (p ? 0.7 : 1), { taper: 0.6, o });
    }
  }

  /** Parallel hatching clipped to a region. */
  hatch(inside: (p: P) => boolean, box: [number, number, number, number], angle: number, gap: number, width = 0.55, o?: number, maxLen = Infinity) {
    const [x0, y0, x1, y1] = box;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const diag = Math.hypot(x1 - x0, y1 - y0);
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    for (let k = -diag / 2; k <= diag / 2; k += gap * this.rand(0.75, 1.25)) {
      let run: P[] = [];
      const flush = () => {
        if (run.length > 1) this.line([run[0], run[run.length - 1]], width, o);
        run = [];
      };
      const cap = maxLen === Infinity ? Infinity : Math.max(3, Math.round((maxLen * this.rand(0.5, 1.2)) / 2));
      for (let s = -diag / 2; s <= diag / 2; s += 2) {
        const p: P = [cx + cos * s - sin * k, cy + sin * s + cos * k];
        if (inside(p)) {
          run.push(p);
          if (run.length >= cap) {
            flush();
            s += this.rand(4, 12);
          }
        } else flush();
      }
      flush();
    }
  }

  /** Looping cursive scribble that fills a region, the usual way to draw foliage. Denser where shade is higher. */
  scribble(inside: (p: P) => boolean, shade: (p: P) => number, box: [number, number, number, number], loop = 5, rowGap = 7, width = 0.6) {
    const [x0, y0, x1, y1] = box;
    let row = 0;
    for (let y = y0; y <= y1; y += rowGap * this.rand(0.8, 1.2), row++) {
      const dir = row % 2 ? -1 : 1;
      let theta = this.rand(0, 6);
      let seg: P[] = [];
      const flush = () => {
        if (seg.length > 6) {
          const mid = seg[Math.floor(seg.length / 2)];
          if (this.r() < shade(mid)) this.line(seg, width, undefined, 3.5);
        }
        seg = [];
      };
      for (let k = 0; k <= (x1 - x0) / (loop * 0.16); k++) {
        const x = dir > 0 ? x0 + k * loop * 0.16 : x1 - k * loop * 0.16;
        theta += 0.78 + this.r() * 0.25;
        const cy = y + this.n(row * 3 + k * 0.03) * rowGap * 0.6;
        const p: P = [x + Math.cos(theta) * loop, cy + Math.sin(theta) * loop * 0.75];
        if (inside(p)) {
          seg.push(p);
          if (seg.length > 48) {
            flush();
            seg.push(p);
          }
        } else flush();
      }
      flush();
    }
  }

  /**
   * Foliage the way an artist scrawls it: the pen wanders inside a clump, curling as it goes,
   * loops uneven in size, lifting off where light falls.
   */
  scrawl(inside: (p: P) => boolean, lit: (p: P) => boolean, start: P, steps: number, loop = 5, width = 0.6) {
    let [x, y] = start;
    let heading = this.rand(0, Math.PI * 2);
    let curl = this.rand(0, Math.PI * 2);
    const off = this.r() * 900;
    let seg: P[] = [];
    const flush = () => {
      if (seg.length > 5) this.line(seg, width, undefined, 3);
      seg = [];
    };
    for (let k = 0; k < steps; k++) {
      heading += this.n(off + k * 0.04) * 0.5 + (this.r() - 0.5) * 0.5;
      curl += 0.55 + this.r() * 0.9;
      const size = loop * (0.55 + 0.9 * ((this.n(off + 300 + k * 0.07) + 1) / 2));
      const nx = x + Math.cos(heading) * loop * 0.32;
      const ny = y + Math.sin(heading) * loop * 0.32;
      if (!inside([nx, ny])) {
        heading += Math.PI * (0.5 + this.r() * 0.5);
        continue;
      }
      x = nx;
      y = ny;
      const p: P = [x + Math.cos(curl) * size, y + Math.sin(curl) * size * 0.7];
      if (lit(p)) {
        flush();
        continue;
      }
      seg.push(p);
      if (seg.length > 60) {
        flush();
        seg.push(p);
      }
    }
    flush();
  }
}
