import { Pen, type P, type Mark } from "./sketch";
import { blobPath, rng } from "./noise";

/*
 * An ink sketch of an open-air class under an old banyan, in the Santiniketan way:
 * pen strokes with pressure, scribbled foliage, hatching for shade, and watercolour laid in loosely afterwards.
 * Built once per server process from fixed seeds, so it is identical on every visit.
 */

const W = 900;
const H = 720;
const G = 612; // ground line

type Layer = { name: string; marks: Mark[] };

function build() {
  const layers: Layer[] = [];
  const layer = (name: string, seed: number, draw: (pen: Pen) => void) => {
    const pen = new Pen(seed);
    draw(pen);
    layers.push({ name, marks: pen.marks });
  };
  const r = rng(11);
  const rand = (a: number, b: number) => a + r() * (b - a);

  /* ── the banyan's crown: overlapping leaf clusters ── */
  const clusters: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    clusters.push({
      x: 240 + 620 * t + rand(-12, 12),
      y: 360 - 175 * Math.pow(Math.sin(Math.PI * t), 0.8) + rand(-16, 16),
      r: 50 + 34 * Math.sin(Math.PI * t) + rand(-8, 8),
    });
  }
  for (let i = 0; i < 7; i++) clusters.push({ x: rand(340, 760), y: rand(230, 330), r: rand(55, 75) });
  const inCrown = ([x, y]: P) => clusters.some((c) => (x - c.x) ** 2 + (y - c.y) ** 2 < (c.r * 0.97) ** 2);
  const crownShade = ([x, y]: P) => Math.min(0.95, Math.max(0.1, 0.12 + ((y - 120) / 300) * 0.8 + ((x - 560) / 360) * 0.18));

  /* ── trunk outline as a function of height ── */
  const trunkL = (y: number) => 512 - Math.pow(Math.max(0, (y - 540) / 72), 2.2) * 34 + Math.sin(y / 23) * 3;
  const trunkR = (y: number) => 568 + Math.pow(Math.max(0, (y - 540) / 72), 2.2) * 40 + Math.sin(y / 31) * 3;
  const inTrunk = ([x, y]: P) => y > 420 && y < G && x > trunkL(y) && x < trunkR(y);

  /* ── branches, from the top of the trunk out into the crown ── */
  const targets = [0, 2, 4, 6, 8, 10, 12].map((i) => clusters[i]);
  const branches: P[][] = targets.map((c, i) => {
    const sx = 520 + i * 7 + rand(-4, 4);
    const sy = 440 + rand(-10, 10);
    const tx = c.x;
    const ty = c.y + c.r * 0.35;
    return [
      [sx, sy],
      [sx + (tx - sx) * 0.35, Math.min(sy, ty) - 10 + rand(-15, 15)],
      [sx + (tx - sx) * 0.75, ty - rand(5, 25)],
      [tx, ty],
    ];
  });

  /* ── watercolour, laid under the ink ── */
  const washes: { d: string; fill: string; o: number; cls?: string }[] = [
    { d: blobPath(3, 330, 210, 280, 150, 0.16, 11), fill: "var(--wash-sky)", o: 0.17, cls: "wash-sky" },
    { d: blobPath(4, 560, G + 26, 400, 42, 0.12, 12), fill: "var(--laterite)", o: 0.11 },
    { d: blobPath(5, 545, 525, 46, 100, 0.12, 9), fill: "var(--ink-faint)", o: 0.18 },
    ...clusters.slice(0, 13).map((c, i) => ({ d: blobPath(20 + i, c.x + 10, c.y + 12, c.r * 0.92, c.r * 0.8, 0.14, 9), fill: "var(--sal)", o: 0.17 })),
    { d: blobPath(9, 575, G + 10, 250, 16, 0.1, 10), fill: "var(--ink)", o: 0.08 },
  ];

  /* ── people: a class sitting on the ground, the teacher on a stone ── */
  const people: { x: number; y: number; face: 1 | -1; pose: "sit" | "read" | "teach"; s: number }[] = [
    { x: 396, y: G + 22, face: 1, pose: "read", s: 1.12 },
    { x: 438, y: G + 6, face: 1, pose: "sit", s: 1 },
    { x: 486, y: G + 28, face: 1, pose: "sit", s: 1.16 },
    { x: 560, y: G + 34, face: 1, pose: "read", s: 1.2 },
    { x: 626, y: G + 20, face: 1, pose: "sit", s: 1.1 },
    { x: 716, y: G - 4, face: -1, pose: "teach", s: 1.05 },
  ];
  const nearPerson = (x: number, y: number) => people.some((q) => Math.abs(x - q.x) < 26 * q.s && y > q.y - 60 * q.s);

  /* ── ink, in the order a person would draw it ── */
  layer("ground", 101, (pen) => {
    pen.stroke([[150, G + 4], [380, G - 2], [560, G + 3], [760, G - 2], [900, G + 2]], 1.4);
    pen.stroke([[0, 596], [70, 594], [150, 598]], 0.9);
    pen.stroke([[218, 720], [262, 690], [330, 655], [430, G + 12]], 1.1);
    pen.stroke([[350, 720], [372, 690], [420, 656], [470, G + 14]], 1.1);
    for (let i = 0; i < 26; i++) {
      const x = pen.rand(160, 900);
      const y = G + pen.rand(-2, 30);
      for (let b = 0; b < 4; b++) {
        const lean = pen.rand(-4, 4);
        const h = pen.rand(5, 11);
        pen.stroke([[x + b * 2.4, y], [x + b * 2.4 + lean * 0.3, y - h * 0.6], [x + b * 2.4 + lean, y - h]], 0.8);
      }
    }
    for (let i = 0; i < 6; i++) pen.circle(pen.rand(280, 440), pen.rand(650, 700), pen.rand(2, 3.5), 0.7, 1);
    pen.hatch(
      ([x, y]) => ((x - 575) / 250) ** 2 + ((y - (G + 10)) / 16) ** 2 < 1,
      [300, G - 10, 850, G + 30],
      0.06,
      5,
      0.45,
      0.55,
      34,
    );
  });

  layer("trunk", 102, (pen) => {
    for (let k = 0; k <= 7; k++) {
      const f = k / 7;
      const pts: P[] = [];
      for (let y = G + 2; y >= 430; y -= 30) {
        const x = trunkL(y) + (trunkR(y) - trunkL(y)) * f + Math.sin(y / 18 + k) * 3;
        pts.push([x, y]);
      }
      const edge = k === 0 || k === 7;
      pen.stroke(pts, edge ? 2.2 : 0.75, { o: edge ? 1 : 0.75 });
    }
    pen.hatch(([x, y]) => inTrunk([x, y]) && x > (trunkL(y) + trunkR(y)) / 2 + 6, [500, 430, 640, G], 0.25, 4.2, 0.5);
    // root flare along the ground
    pen.stroke([[trunkL(G) - 8, G + 2], [trunkL(G) - 30, G + 6], [trunkL(G) - 54, G + 4]], 1.6);
    pen.stroke([[trunkR(G) + 6, G + 2], [trunkR(G) + 34, G + 6], [trunkR(G) + 62, G + 3]], 1.6);
  });

  layer("branches", 103, (pen) => {
    for (const b of branches) {
      // thick limbs drawn as two contour lines, like an illustrator would
      for (const side of [-1, 1]) {
        const pts = b.map(([x, y], i) => [x + side * (7 - i * 2), y + side * (2 - i * 0.4)] as P);
        pen.stroke(pts, 1.3, { profile: (t) => 1 - t * 0.6 });
      }
      // twigs off each limb
      for (let k = 0; k < 3; k++) {
        const t = pen.rand(0.4, 0.9);
        const i = Math.min(b.length - 2, Math.floor(t * (b.length - 1)));
        const [x, y] = b[i];
        pen.stroke([[x, y], [x + pen.rand(-30, 30), y - pen.rand(15, 35)], [x + pen.rand(-45, 45), y - pen.rand(30, 60)]], 0.9, {
          profile: (u) => 1 - u * 0.8,
        });
      }
    }
  });

  layer("roots", 104, (pen) => {
    // banyans grow roots down from their branches; some reach the ground and become pillars
    for (const b of branches) {
      for (let k = 0; k < 5; k++) {
        const t = pen.rand(0.3, 0.95);
        const i = Math.min(b.length - 2, Math.floor(t * (b.length - 1)));
        const f = t * (b.length - 1) - i;
        const x0 = b[i][0] + (b[i + 1][0] - b[i][0]) * f;
        const y0 = b[i][1] + (b[i + 1][1] - b[i][1]) * f;
        if (x0 > 470 && x0 < 640) continue; // keep the space around the trunk open
        if (nearPerson(x0, G)) continue;
        const pillar = pen.rand(0, 1) < 0.25;
        const end = pillar ? G + pen.rand(-2, 4) : y0 + pen.rand(40, 170);
        const pts: P[] = [];
        for (let y = y0; y <= end; y += 22) pts.push([x0 + Math.sin(y / 30 + k) * 2.5 + (y - y0) * 0.02, y]);
        pts.push([x0 + (end - y0) * 0.02, end]);
        if (pillar) {
          pen.stroke(pts, 1.5, { profile: (u) => 0.4 + u * 0.6 });
          pen.stroke(pts.map(([x, y]) => [x + 3.5, y] as P), 0.9, { profile: (u) => 0.4 + u * 0.6 });
        } else pen.line(pts, 0.6, 0.85);
      }
    }
  });

  layer("crown", 105, (pen) => {
    for (const c of clusters) {
      let seg: P[] = [];
      const flush = () => {
        if (seg.length > 3 && pen.rand(0, 1) > 0.15) pen.stroke(seg, 1.2, { taper: 0.7 });
        seg = [];
      };
      for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.07) {
        const rr = c.r * (1 + 0.07 * Math.abs(Math.sin(a * 7)));
        const q: P = [c.x + Math.cos(a) * rr, c.y + Math.sin(a) * rr];
        const covered = clusters.some((o) => o !== c && (q[0] - o.x) ** 2 + (q[1] - o.y) ** 2 < (o.r * 0.96) ** 2);
        if (!covered && q[1] < c.y + c.r * 0.55) seg.push(q);
        else flush();
      }
      flush();
    }
  });

  layer("leaves", 106, (pen) => {
    for (const c of clusters) {
      const inClump = ([x, y]: P) => (x - c.x) ** 2 + (y - c.y) ** 2 < (c.r * 0.9) ** 2;
      // light comes from the upper left: leave that side of each clump mostly bare paper
      const lit = ([x, y]: P) => {
        const lx = (x - c.x) / c.r;
        const ly = (y - c.y) / c.r;
        return lx + ly < -0.35 - crownShade([x, y]) * 0.5 && pen.rand(0, 1) < 0.85;
      };
      const clumps = 2 + Math.round(crownShade([c.x, c.y]) * 3);
      for (let k = 0; k < clumps; k++) {
        const a = pen.rand(0, Math.PI * 2);
        const d = pen.rand(0, c.r * 0.6);
        pen.scrawl(inClump, lit, [c.x + Math.cos(a) * d, c.y + Math.sin(a) * d], Math.round(c.r * (1.2 + crownShade([c.x, c.y]) * 1.7)), pen.rand(4, 7), 0.6);
      }
    }
  });

  layer("shade", 107, (pen) => {
    pen.hatch(([x, y]) => inCrown([x, y]) && y > 335, [180, 300, 900, 450], -0.85, 4.5, 0.5, 0.8);
  });

  layer("distance", 108, (pen) => {
    // a toddy palm
    pen.stroke([[212, 598], [216, 540], [224, 480], [232, 436]], 2, { profile: (t) => 1 - t * 0.5 });
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI + (k / 9) * Math.PI + pen.rand(-0.1, 0.1);
      const len = pen.rand(28, 40);
      pen.stroke([[232, 436], [232 + Math.cos(a) * len * 0.55, 436 + Math.sin(a) * len * 0.45 - 6], [232 + Math.cos(a) * len, 436 + Math.sin(a) * len * 0.5 + len * 0.3]], 0.9);
    }
    // two huts
    for (const [hx, s] of [[64, 0.8], [128, 0.62]] as const) {
      const base = 598;
      pen.rule([hx - 18 * s, base], [hx - 18 * s, base - 22 * s], 1);
      pen.rule([hx + 18 * s, base], [hx + 18 * s, base - 22 * s], 1);
      pen.stroke([[hx - 30 * s, base - 18 * s], [hx - 10 * s, base - 38 * s], [hx, base - 48 * s]], 1.2);
      pen.stroke([[hx, base - 48 * s], [hx + 14 * s, base - 36 * s], [hx + 32 * s, base - 18 * s]], 1.2);
      pen.hatch(([x, y]) => y > base - 46 * s + Math.abs(x - hx) * 1.1 && y < base - 20 * s && Math.abs(x - hx) < 30 * s, [hx - 32 * s, base - 50 * s, hx + 32 * s, base - 16 * s], 1.25, 2.6, 0.5);
      pen.hatch(([x, y]) => Math.abs(x - hx) < 4 * s && y > base - 13 * s && y < base, [hx - 5 * s, base - 14 * s, hx + 5 * s, base], 1.5, 1.6, 0.6);
    }
  });


  layer("people", 109, (pen) => {
    for (const { x, y, face: f, pose, s } of people) {
      const by = pose === "teach" ? y - 10 * s : y;
      if (pose === "teach") {
        pen.circle(x + 2, y - 2, 13 * s, 0.9, 1);
        pen.hatch(([px, py]) => ((px - x - 2) / 13) ** 2 + ((py - y + 2) / 6) ** 2 < 1 && py > y - 2, [x - 12, y - 4, x + 16, y + 4], 0.4, 2.4, 0.5);
      }
      // head, with hair as a dark scribbled cap, tilted a little toward the teacher
      const hx = x + f * 1.5 * s;
      const hy = by - 37 * s;
      pen.circle(hx, hy, 5.2 * s, 1, 1);
      pen.scribble(([px, py]) => (px - hx) ** 2 + (py - hy) ** 2 < (5 * s) ** 2 && py < hy - 0.5 * s + (px - hx) * f * -0.35, () => 1, [hx - 6 * s, hy - 6 * s, hx + 6 * s, hy + 2 * s], 1.6, 1.5, 0.7);
      // a slightly hunched back, the line that makes a sitting figure read
      pen.stroke([[hx - f * 3.5 * s, hy + 4.5 * s], [x - f * 6 * s, by - 21 * s], [x - f * 6.5 * s, by - 10 * s], [x - f * 4 * s, by - 2 * s]], 1.5, { taper: 0.7 });
      // chest and a shawl falling across it
      pen.stroke([[hx + f * 3 * s, hy + 6 * s], [x + f * 4 * s, by - 22 * s], [x + f * 5 * s, by - 13 * s]], 0.9);
      pen.stroke([[hx - f * 2 * s, hy + 7 * s], [x + f * 1 * s, by - 20 * s], [x + f * 5 * s, by - 15 * s]], 0.6, { o: 0.8 });
      // folded legs: hip, knee up, shin tucked back
      pen.stroke([[x - f * 4 * s, by - 3 * s], [x + f * 6 * s, by - 7 * s], [x + f * 14 * s, by - 6.5 * s], [x + f * 12 * s, by - 1 * s], [x + f * 2 * s, by]], 1.2, { taper: 0.6 });
      pen.stroke([[x + f * 6 * s, by - 0.5 * s], [x + f * 13 * s, by + 0.5 * s]], 0.8);
      // a few strokes of shadow on the far side only
      for (let h = 0; h < 4; h++) {
        const yy = by - (18 - h * 4) * s;
        pen.stroke([[x - f * (5.5 - h * 0.3) * s, yy], [x - f * (2.5 - h * 0.3) * s, yy + 2.5 * s]], 0.5, { o: 0.7 });
      }
      if (pose === "teach") {
        pen.stroke([[hx + f * 2.5 * s, hy + 7 * s], [x + f * 10 * s, by - 31 * s], [x + f * 15 * s, by - 39 * s]], 1);
        pen.stroke([[x + f * 15 * s, by - 39 * s], [x + f * 17 * s, by - 42 * s]], 0.8);
      } else {
        pen.stroke([[hx + f * 1.5 * s, hy + 8 * s], [x + f * 7 * s, by - 17 * s], [x + f * 12 * s, by - 9 * s]], 0.9);
      }
      if (pose === "read") {
        const bx = x + f * 12 * s;
        const byk = by - 13 * s;
        pen.stroke([[bx - 6 * s, byk + 2 * s], [bx, byk - 1 * s], [bx + 6 * s, byk + 2 * s]], 1);
        pen.stroke([[bx - 6 * s, byk + 2 * s], [bx - 5 * s, byk - 5 * s]], 0.8);
        pen.stroke([[bx + 6 * s, byk + 2 * s], [bx + 5 * s, byk - 5 * s]], 0.8);
        pen.stroke([[bx - 5 * s, byk - 5 * s], [bx, byk - 7 * s], [bx + 5 * s, byk - 5 * s]], 0.8);
      }
    }
  });

  layer("bicycle", 110, (pen) => {
    const g = G - 2;
    const a: P = [776, g - 15];
    const b: P = [830, g - 15];
    pen.circle(a[0], a[1], 15, 1, 2);
    pen.circle(b[0], b[1], 15, 1, 2);
    const seat: P = [790, g - 40];
    const crank: P = [800, g - 15];
    const head: P = [822, g - 40];
    pen.rule(a, seat, 1.1);
    pen.rule(seat, crank, 1.1);
    pen.rule(a, crank, 1.1);
    pen.rule(crank, head, 1.1);
    pen.rule(seat, [818, g - 36], 1.1);
    pen.rule(head, b, 1.1);
    pen.stroke([[784, g - 43], [791, g - 45], [797, g - 43]], 1.8);
    pen.stroke([[818, g - 46], [823, g - 42], [829, g - 47]], 1.2);
    pen.circle(crank[0], crank[1], 3, 0.8, 1);
  });

  layer("birds", 111, (pen) => {
    for (const [x, y, s] of [[96, 196, 1], [132, 176, 0.8], [160, 210, 0.7], [688, 96, 0.75]] as const) {
      pen.stroke([[x - 9 * s, y - 2 * s], [x - 4 * s, y - 5 * s], [x, y]], 1.1);
      pen.stroke([[x, y], [x + 4 * s, y - 6 * s], [x + 10 * s, y - 3 * s]], 1.1);
    }
  });

  const sun = new Pen(112);
  sun.circle(146, 118, 32, 1.2, 2);
  const moon = new Pen(113);
  moon.stroke([[150, 84], [124, 98], [116, 124], [128, 148], [156, 156]], 1.5, { taper: 0.6 });
  moon.stroke([[150, 84], [138, 102], [136, 124], [142, 142], [156, 156]], 1, { taper: 0.6 });
  moon.hatch(([x, y]) => ((x - 140) / 24) ** 2 + ((y - 120) / 36) ** 2 < 1 && x < 136 - Math.abs(y - 120) * 0.15, [114, 84, 140, 158], 0.9, 3, 0.5);

  return { layers, washes, sun: sun.marks, moon: moon.marks };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** The finished drawing as an SVG document. It is inlined by the page so it can follow the theme and draw itself in. */
export function heroSketchSVG() {
  const { layers, washes, sun, moon } = build();
  const total = layers.reduce((n, l) => n + l.marks.length, 0) + sun.length + moon.length;
  let i = 0;
  const delay = () => (0.15 + (i++ / total) * 3.2).toFixed(2);

  const mark = (m: Mark) => {
    const t = delay();
    if (m.kind === "fill") {
      const o = ` fill-opacity="${m.o ?? 0.92}"`;
      return `<path class="ink-fade" d="${m.d}"${o} style="animation-delay:${t}s"/>`;
    }
    const o = ` stroke-opacity="${m.o ?? 0.8}"`;
    return `<path class="ink-draw" pathLength="1" d="${m.d}" stroke-width="${m.w}"${o} style="animation-delay:${t}s"/>`;
  };

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc("Illustration of students learning outdoors")}">`,
    `<defs>`,
    `<filter id="ink-edge" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="1.6"/></filter>`,
    `<filter id="wash-edge" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="9"/><feDisplacementMap in="SourceGraphic" scale="22"/></filter>`,
    `</defs>`,
    `<g filter="url(#wash-edge)" class="washes">`,
    ...washes.map(
      (w) =>
        `<path d="${w.d}"${w.cls ? ` class="${w.cls}"` : ""} style="fill:${w.fill};stroke:${w.fill}" fill-opacity="${w.o}" stroke-opacity="${(w.o * 0.6).toFixed(3)}" stroke-width="2.5"/>`,
    ),
    `<path class="sky-sun" d="${blobPath(14, 146, 118, 30, 30, 0.05, 10)}" style="fill:var(--turmeric)" fill-opacity="0.5"/>`,
    `</g>`,
    `<g filter="url(#ink-edge)" class="ink">`,
    `<g class="sky-sun">${sun.map(mark).join("")}</g>`,
    `<g class="sky-moon">${moon.map(mark).join("")}</g>`,
    ...layers.map((l) => `<g>${l.marks.map(mark).join("")}</g>`),
    `</g>`,
    `</svg>`,
  ].join("");
}
