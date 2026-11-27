import { buildChapterFilm, ph, type Gfx } from '../film/engine';

/** Nuclei: a small dense core, a missing mass, and the energy that comes from it. */

function nucleus(g: Gfx, cx: number, cy: number, n: number, R: number, t: number, a = 1) {
  g.circle(cx, cy, R + 14, { alpha: 0.25 * a, width: 2 });
  for (let k = 0; k < n; k++) {
    const r = (R - 12) * Math.sqrt((k + 0.5) / n);
    const ang = k * 2.39996;
    const x = cx + r * Math.cos(ang) + 2.5 * Math.sin(3 * t + k * 1.7);
    const y = cy + r * Math.sin(ang) + 2.5 * Math.cos(2.6 * t + k * 2.3);
    if (k % 2 === 0) g.circle(x, y, 11, { fill: 1, alpha: a, width: 0 });
    else g.circle(x, y, 11, { alpha: a, width: 2.5 });
  }
}

export const buildFilm = () =>
  buildChapterFilm({
    title: 'Where does nuclear energy come from?',
    subtitle: 'A nucleus weighs less than its parts.',
    shots: [
      {
        title: 'The missing mass',
        say: [
          'Weigh a helium nucleus, then weigh its two protons and two neutrons one by one.',
          'The parts add up to more. The nucleus is lighter than the sum of its pieces.',
          'The missing mass left as energy when the nucleus formed. That energy is the binding energy.',
        ],
        eq: [
          { at: 3, src: 'Δm = Z · m _p + ( A − Z ) · m _n − M' },
          { at: 8, src: 'BE = Δm · c ^2' },
        ],
        draw: (g, t) => {
          const p = ph(t, 1, 5);
          const cx = 760;
          const cy = 640;
          const pos: [number, number][] = [[-300, -150], [300, -150], [-300, 150], [300, 150]];
          pos.forEach(([sx, sy], i) => {
            const x = cx + sx * (1 - p) + (i % 2 ? 14 : -14) * p;
            const y = cy + sy * (1 - p) + (i < 2 ? -14 : 14) * p;
            if (i === 0 || i === 3) g.circle(x, y, 28, { fill: 1, width: 0 });
            else g.circle(x, y, 28, { width: 3 });
          });
          const w = ph(t, 5, 7);
          if (w > 0 && w < 1) {
            g.circle(cx, cy, 60 + 320 * w, { alpha: 0.5 * (1 - w), width: 3 });
            g.circle(cx, cy, 30 + 200 * w, { alpha: 0.4 * (1 - w), width: 2 });
          }
          // Two mass bars.
          g.line(1160, 860, 1700, 860, { alpha: 0.6 });
          const gap = ph(t, 5, 7);
          g.rect(1200, 500, 160, 360, { alpha: 0.9, fill: 0.12 });
          g.rect(1500, 500 + 12 * gap, 160, 360 - 12 * gap, { alpha: 0.9, fill: 0.12 });
          g.rect(1500, 500, 160, 12 * gap, { alpha: 0.5 * (0.6 + 0.4 * Math.sin(5 * t)) * gap, fill: 0.5, width: 0, dash: [6, 6] });
          g.text('separate', 1280, 910, { size: 30, alpha: 0.7 });
          g.text('together', 1580, 910, { size: 30, alpha: 0.7 });
          g.text('Δm', 1580, 470, { size: 40, font: 'italic', alpha: gap });
        },
      },
      {
        title: 'Energy per nucleon',
        say: [
          'Plot the binding energy per nucleon against mass number, and a curve appears.',
          'It rises quickly, peaks near iron, then drifts slowly down to uranium.',
          'Nature moves uphill on this curve, and the difference comes out as energy.',
        ],
        eq: [{ at: 3, src: '[ BE | A ] = [ Δm · c ^2 | A ]' }],
        draw: (g, t) => {
          const ox = 360;
          const oy = 880;
          const wx = 1200;
          const hy = 520;
          g.axes(ox, oy, wx, hy, { x: 'A', y: 'BE / A', alpha: 0.6 });
          const f = (A: number) => {
            const x = Math.max(A, 1);
            return 8.8 * (1 - Math.exp(-x / 7)) * (1 - 0.000747 * Math.max(0, x - 56));
          };
          const head = ph(t, 0.8, 5);
          const A1 = 240 * head;
          g.curve((x) => oy - (f(((x - ox) / wx) * 260) / 10) * hy, ox, ox + (A1 / 260) * wx, { alpha: 0.9, n: 300 });
          const px = ox + (A1 / 260) * wx;
          g.ball(px, oy - (f(A1) / 10) * hy, 12);
          const a = ph(t, 6, 8);
          g.text('iron', ox + (56 / 260) * wx, oy - (f(56) / 10) * hy - 40, { size: 32, alpha: a });
          g.arrow(ox + 90, oy - 240, ox + 270, oy - 380, { alpha: a * (0.6 + 0.4 * Math.sin(4 * t)), label: 'fusion' });
          g.arrow(ox + 1180, oy - 330, ox + 980, oy - 380, { alpha: a * (0.6 + 0.4 * Math.sin(4 * t)), label: 'fission' });
        },
      },
      {
        title: 'Radioactive decay',
        say: [
          'Some nuclei are unstable and fall apart on their own.',
          'Watch a crowd of them. Each one decays at a random moment, and no one can say which goes next.',
          'Yet the crowd is perfectly predictable: half of them go in every half-life.',
        ],
        eq: [
          { at: 3, src: '[ dN | dt ] = − λ · N' },
          { at: 7, src: 'N = N _0 · e ^−λ·t' },
          { at: 11, src: 'T _½ = [ ln 2 | λ ]' },
        ],
        draw: (g, t) => {
          const n = 64;
          const half = 2.4;
          const lam = Math.LN2 / half;
          const rnd = (i: number) => {
            const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
            return s - Math.floor(s);
          };
          const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => rnd(a + 5) - rnd(b + 5));
          const tau = new Array<number>(n);
          order.forEach((idx, k) => (tau[idx] = -Math.log(1 - (k + 0.5) / n) / lam));
          const tt = Math.max(0, t - 2);
          tau.forEach((x, i) => {
            const cx = 280 + (i % 8) * 64;
            const cy = 390 + Math.floor(i / 8) * 64;
            const age = tt - x;
            if (age < 0) g.ball(cx, cy, 14, ph(t, 0.5, 1.5));
            else {
              g.circle(cx, cy, 14, { alpha: 0.6 * ph(t, 0.5, 1.5), width: 2 });
              if (age < 0.5) g.circle(cx, cy, 14 + 50 * age, { alpha: 0.5 * (1 - age / 0.5), width: 2 });
            }
          });
          const ox = 1050;
          const oy = 900;
          g.axes(ox, oy, 660, 480, { x: 't', y: 'N', alpha: 0.6 });
          const span = 11;
          const X = (s: number) => ox + (s / span) * 620;
          const Y = (f: number) => oy - f * 420;
          const upto = Math.min(span, tt);
          g.curve((x) => Y(Math.exp(-lam * ((x - ox) / 620) * span)), ox, X(upto), { alpha: 0.9, n: 200 });
          [1, 0.5, 0.25, 0.125].forEach((f, k) => {
            const a = ph(tt, k * half, k * half + 0.6);
            g.line(ox, Y(f), X(k * half), Y(f), { alpha: 0.35 * a, dash: [6, 8] });
            g.line(X(k * half), Y(f), X(k * half), oy, { alpha: 0.35 * a, dash: [6, 8] });
          });
        },
      },
      {
        title: 'Fission',
        say: [
          'A slow neutron strikes a uranium nucleus. It wobbles like a drop, then pinches in two.',
          'Two fragments fly apart, and two or three fresh neutrons come out. About two hundred million electron-volts are freed.',
          'If each fission starts one more, the reaction sustains itself. That is a chain reaction.',
        ],
        eq: [
          { at: 3, src: 'U ^235 _92 + n → Ba ^141 _56 + Kr ^92 _36 + 3 · n' },
          { at: 9, src: 'Q ≈ 200 "MeV"' },
        ],
        draw: (g, t) => {
          const cx = 960;
          const cy = 640;
          const hit = ph(t, 0.5, 2.2);
          const wob = ph(t, 2.2, 4.5);
          const split = ph(t, 4.4, 6);
          if (hit < 1) g.ball(lerp(300, cx - 150, hit), cy, 18);
          if (split < 0.02) {
            const st = 50 * wob * Math.sin(5 * (t - 2.2)) + 60 * ph(t, 3.6, 4.4);
            g.with({ x: cx, y: cy }, () => {
              g.ctx.scale(1 + st / 150, 1 - st / 450);
              nucleus(g, 0, 0, 24, 130, t);
            });
          } else {
            [-1, 1].forEach((s) => nucleus(g, cx + s * (100 + 260 * split), cy, 11, 78, t));
            const q = ph(t, 4.8, 7);
            [[-0.9, -1.2], [0.1, -1.5], [0.9, 1.2]].forEach(([dx, dy]) => g.ball(cx + dx * 380 * q, cy + dy * 220 * q, 12));
            const w = ph(t, 4.6, 6.6);
            if (w < 1) g.circle(cx, cy, 40 + 380 * w, { alpha: 0.5 * (1 - w), width: 3 });
          }
        },
      },
      {
        title: 'Fusion',
        say: [
          'The opposite route works for the lightest nuclei: join them.',
          'But two nuclei repel each other, so they must hit very hard, which means a temperature of millions of degrees.',
          'Deuterium and tritium fuse into helium and a neutron, and seventeen point six million electron-volts come out. This is how the Sun shines.',
        ],
        eq: [{ at: 4, src: 'H ^2 _1 + H ^3 _1 → He ^4 _2 + n + 17.6 "MeV"' }],
        draw: (g, t) => {
          const cx = 960;
          const cy = 600;
          const a = ph(t, 1, 5);
          const sep = 700 * (1 - a) + 30 * a;
          const fused = t > 5.2;
          if (!fused) {
            g.circle(cx - sep / 2 - 18, cy, 26, { fill: 1, width: 0 });
            g.circle(cx - sep / 2 + 26, cy, 26, { width: 3 });
            g.circle(cx + sep / 2 - 26, cy, 26, { fill: 1, width: 0 });
            g.circle(cx + sep / 2 + 24, cy - 24, 26, { width: 3 });
            g.circle(cx + sep / 2 + 24, cy + 24, 26, { width: 3 });
            g.arrow(cx - sep / 2 - 100, cy, cx - sep / 2 - 60, cy, { alpha: 0.6 });
            g.arrow(cx + sep / 2 + 100, cy, cx + sep / 2 + 60, cy, { alpha: 0.6 });
            // Coulomb hill.
            g.text('the electric push grows as they approach', cx, 860, { size: 30, alpha: 0.6 });
          } else {
            nucleus(g, cx - 20, cy, 4, 60, t);
            const q = ph(t, 5.3, 8);
            g.ball(cx + 120 + 600 * q, cy - 20 - 160 * q, 14);
            const w = ph(t, 5.3, 7.5);
            if (w < 1) g.circle(cx, cy, 40 + 400 * w, { alpha: 0.5 * (1 - w), width: 3 });
            g.text('17.6 MeV', cx - 380, cy - 20, { size: 44, alpha: ph(t, 5.5, 6.5) });
          }
        },
      },
    ],
  });

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
