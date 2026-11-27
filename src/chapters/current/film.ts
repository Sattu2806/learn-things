import { buildChapterFilm, lerp, ph, TAU, type Gfx } from '../film/engine';

/** Current electricity: drift, Ohm's law, series and parallel, cells, Kirchhoff and the bridge. */

type Pt = [number, number];

/** Dots flowing along a polyline at a given phase (distance travelled), spaced by gap. */
function flow(g: Gfx, pts: Pt[], phase: number, gap = 46, a = 0.9, r = 6) {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = cum[cum.length - 1];
  for (let s = ((phase % gap) + gap) % gap; s < total; s += gap) {
    let i = 1;
    while (i < cum.length - 1 && cum[i] < s) i++;
    const u = (s - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1]);
    g.circle(lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u), r, { fill: 1, width: 0, alpha: a });
  }
}

function cell(g: Gfx, x: number, y: number, a = 1) {
  g.line(x - 10, y - 34, x - 10, y + 34, { width: 5, alpha: a });
  g.line(x + 10, y - 18, x + 10, y + 18, { width: 9, alpha: a });
}

function res(g: Gfx, x1: number, y1: number, x2: number, y2: number, name?: string, a = 1) {
  g.spring(x1, y1, x2, y2, { coils: 4, amp: 16, alpha: a });
  if (name) {
    const vertical = Math.abs(x2 - x1) < Math.abs(y2 - y1);
    g.text(name, vertical ? (x1 + x2) / 2 + 50 : (x1 + x2) / 2, vertical ? (y1 + y2) / 2 + 12 : y1 - 36, { size: 34, font: 'italic', alpha: 0.8 * a });
  }
}

export const buildFilm = () =>
  buildChapterFilm({
    title: 'What is really moving in a wire?',
    subtitle: 'Current, resistance and the rules of circuits.',
    shots: [
      {
        title: 'Drift',
        say: [
          'Inside a metal the free electrons zigzag at huge speed, colliding with the ions again and again.',
          'Switch on a field and each electron picks up a tiny extra drift, a fraction of a millimetre per second.',
          'Yet with so many electrons, the current is large: n e A times the drift speed.',
        ],
        eq: [{ at: 8, src: 'I = n · e · A · v _d' }],
        draw: (g, t) => {
          const cx = 960, cy = 620;
          for (let i = 0; i < 12; i++) for (let j = 0; j < 5; j++) g.circle(260 + i * 130 + 5 * Math.sin(t * 9 + i * j), 380 + j * 120 + 5 * Math.cos(t * 8 + i + j), 26, { alpha: 0.25, width: 2 });
          let seed = 11;
          const rnd = () => {
            seed = (seed * 16807) % 2147483647;
            return seed / 2147483647;
          };
          const N = 60;
          const walk: Pt[] = [[0, 0]];
          for (let i = 0; i < N; i++) {
            const a = rnd() * TAU;
            walk.push([walk[i][0] + 38 * Math.cos(a), walk[i][1] + 38 * Math.sin(a)]);
          }
          const on = 7;
          const pos = (tt: number): Pt => {
            const u = Math.min(tt / 0.3, N - 0.001);
            const i = Math.floor(u);
            const f = u - i;
            return [lerp(walk[i][0], walk[i + 1][0], f) - Math.max(0, tt - on) * 38, lerp(walk[i][1], walk[i + 1][1], f)];
          };
          const trail: Pt[] = [];
          const n = Math.max(2, Math.floor(t / 0.05));
          for (let i = 0; i <= n; i++) {
            const p = pos((t * i) / n);
            trail.push([cx + p[0], cy + p[1]]);
          }
          g.path(trail, { alpha: 0.8, width: 3 });
          const last = trail[trail.length - 1];
          g.ball(last[0], last[1], 13);
          if (t > on) for (let i = 0; i < 4; i++) g.arrow(1500 - ((t * 60 + i * 20) % 20), 440 + i * 100, 1680 - ((t * 60 + i * 20) % 20), 440 + i * 100, { alpha: 0.3, width: 2, head: 14 });
          g.text(t > on ? 'field on: slow drift to the left' : 'no field: random motion only', 960, 940, { size: 34, alpha: 0.6 });
        },
      },
      {
        title: "Ohm's law",
        say: [
          'For a metal at steady temperature, current is proportional to voltage. The constant is the resistance.',
          'A longer wire resists more. A thicker wire resists less. The material enters as the resistivity rho.',
          'Stretch a wire to twice its length and it gets thinner too, so its resistance goes up four times.',
        ],
        eq: [
          { at: 4, src: 'V = I · R' },
          { at: 8, src: 'R = [ ρ · L | A ]' },
        ],
        draw: (g, t) => {
          // Graph on the right.
          const gx = 1180, gy = 840, gw = 560, gh = 420;
          g.axes(gx, gy, gw, gh + 20, { x: 'V', y: 'I', alpha: 0.6 });
          const u = 0.5 - 0.5 * Math.cos(t * 0.6);
          g.line(gx, gy, gx + gw * 0.92, gy - gh * 0.92, { alpha: 0.5, width: 3 });
          g.ball(gx + gw * 0.92 * u, gy - gh * 0.92 * u, 13);
          g.line(gx + gw * 0.92 * u, gy - gh * 0.92 * u, gx + gw * 0.92 * u, gy, { alpha: 0.35, dash: [8, 8], width: 2 });
          // The wire on the left, changing shape after 8 s.
          let L = 1;
          let A = 1;
          if (t > 8) {
            const s = ph(t, 8, 12);
            L = 1 + s;
            A = 1 / L;
          }
          const w = 330 * L, h = 120 * A;
          const x0 = 200, cy = 620;
          g.rect(x0, cy - h / 2, w, h, { fill: 0.1, alpha: 0.9 });
          for (let i = 0; i < 9; i++) {
            const x = x0 + 24 + ((i * 60 + t * 90) % (w - 48));
            for (let j = 0; j < Math.max(1, Math.round(h / 40)); j++) g.circle(x, cy - h / 2 + (h * (j + 0.5)) / Math.max(1, Math.round(h / 40)), 7, { width: 2.5, alpha: 0.9 });
          }
          g.text(`R = ${(L / A).toFixed(2)} R₀`, x0 + 200, cy + 150, { size: 38, font: 'mono', alpha: 0.8 });
        },
      },
      {
        title: 'Series and parallel',
        say: [
          'Resistors in a row carry the same current, and their voltages add. Their resistances simply add.',
          'Resistors side by side share the same voltage, and their currents add. More branches mean less total resistance.',
        ],
        eq: [
          { at: 3, src: 'R _eq = R _1 + R _2' },
          { at: 9, src: '[ 1 | R _eq ] = [ 1 | R _1 ] + [ 1 | R _2 ]' },
        ],
        draw: (g, t) => {
          const ph1 = t * 60;
          // Series, left.
          const x0 = 200, x1 = 780, yT = 420, yB = 800;
          g.path([[x0, yB], [x0, yT], [320, yT]], { alpha: 0.5, width: 3 });
          res(g, 320, yT, 480, yT, 'R₁');
          g.path([[480, yT], [x1, yT], [x1, 560]], { alpha: 0.5, width: 3 });
          res(g, x1, 560, x1, 700, 'R₂');
          g.path([[x1, 700], [x1, yB], [x0, yB]], { alpha: 0.5, width: 3 });
          cell(g, x0, 610);
          g.line(x0 - 40, 610, x0 + 40, 610, { alpha: 0 });
          const loop: Pt[] = [[x0, yB], [x0, yT], [x1, yT], [x1, yB], [x0, yB]];
          flow(g, loop, ph1, 52, 0.85 * ph(t, 0.5, 1.5));
          g.text('same current', 490, 880, { size: 30, alpha: 0.6 * ph(t, 2, 3) });
          // Parallel, right, from 6 s.
          const a = ph(t, 6, 7);
          if (a > 0) {
            const px0 = 1100, px1 = 1700;
            g.path([[px0, yB], [px0, yT], [1400, yT]], { alpha: 0.5 * a, width: 3 });
            g.line(1400, yT, px1, yT, { alpha: 0.5 * a, width: 3 });
            g.line(px0, yB, px1, yB, { alpha: 0.5 * a, width: 3 });
            res(g, 1400, yT, 1400, yB, 'R₁', a);
            res(g, px1, yT, px1, yB, 'R₂', a);
            cell(g, px0, 610, a);
            const speedA = 90, speedB = 45;
            flow(g, [[px0, yB], [px0, yT], [1400, yT], [1400, yB], [px0, yB]], t * speedA, 52, 0.85 * a);
            flow(g, [[px0, yB], [px0, yT], [px1, yT], [px1, yB], [px0, yB]], t * speedB, 52, 0.85 * a);
            g.text('same voltage', 1400, 880, { size: 30, alpha: 0.6 * ph(t, 8, 9) });
          }
        },
      },
      {
        title: 'A real cell',
        say: [
          'A cell does work on every charge it lifts, the electromotive force. But the cell itself resists the current.',
          'Draw more current and part of the EMF is lost inside the cell, so the voltage at the terminals sags.',
          'The terminal voltage is the EMF minus I times the internal resistance.',
        ],
        eq: [{ at: 8, src: 'V = ε − I · r' }],
        draw: (g, t) => {
          const E = 1.5, r = 0.5;
          const Rl = lerp(5.5, 0.25, 0.5 - 0.5 * Math.cos(t * 0.5));
          const I = E / (Rl + r);
          const V = E - I * r;
          const cx = 480, cy = 600;
          g.rect(cx - 150, cy - 70, 190, 140, { fill: 0.05, alpha: 0.9 });
          cell(g, cx - 100, cy);
          g.spring(cx - 70, cy, cx + 30, cy, { coils: 3, amp: 14 });
          g.text('r', cx - 25, cy - 40, { size: 34, font: 'italic', alpha: 0.7 });
          const loop: Pt[] = [[cx + 40, cy], [cx + 40, cy - 190], [cx + 360, cy - 190], [cx + 360, cy - 80]];
          g.path([[cx - 150, cy], [cx - 190, cy], [cx - 190, cy + 190], [cx + 360, cy + 190], [cx + 360, cy + 80]], { alpha: 0.5, width: 3 });
          g.path(loop, { alpha: 0.5, width: 3 });
          g.spring(cx + 360, cy - 80, cx + 360, cy + 80, { coils: 5, amp: 18 });
          g.text('R', cx + 430, cy + 12, { size: 38, font: 'italic', alpha: 0.7 });
          flow(g, [[cx + 40, cy], [cx + 40, cy - 190], [cx + 360, cy - 190], [cx + 360, cy - 80]], t * I * 50, 50, 0.85);
          flow(g, [[cx + 360, cy + 80], [cx + 360, cy + 190], [cx - 190, cy + 190], [cx - 190, cy], [cx - 150, cy]], t * I * 50, 50, 0.85);
          const gx = 1180, gy = 840, gw = 520, gh = 430;
          g.axes(gx, gy, gw, gh + 20, { x: 'I', y: 'V', alpha: 0.6 });
          const p = (i: number): Pt => [gx + (i / 3.2) * gw, gy - ((E - i * r) / 1.6) * gh];
          g.line(p(0)[0], p(0)[1], p(3)[0], p(3)[1], { alpha: 0.5, width: 3 });
          g.ball(p(I)[0], p(I)[1], 13);
          g.text(`V = ${V.toFixed(2)} V`, p(I)[0] + 30, p(I)[1] - 24, { size: 30, font: 'mono', alpha: 0.8, align: 'left' });
          g.text('ε', gx - 36, p(0)[1] + 12, { size: 40, font: 'italic', alpha: 0.8 });
        },
      },
      {
        title: "Kirchhoff's rules",
        say: [
          'For any circuit there are two rules. At a junction, what flows in flows out, because charge does not pile up.',
          'Round any loop, the potential rises and falls add up to zero, because you return to where you started.',
          'Write these down for each junction and each loop, and every current can be solved for.',
        ],
        eq: [
          { at: 3, src: 'Σ I _in = Σ I _out' },
          { at: 11, src: 'Σ ε = Σ I · R' },
        ],
        draw: (g, t) => {
          if (t < 10) {
            const c: Pt = [960, 620];
            const ends: Pt[] = [[340, 620], [1580, 420], [1580, 820]];
            for (const e of ends) g.line(e[0], e[1], c[0], c[1], { alpha: 0.5, width: 3 });
            flow(g, [ends[0], c], t * 160, 60, 0.9);
            flow(g, [c, ends[1]], t * 96, 60, 0.9);
            flow(g, [c, ends[2]], t * 64, 60, 0.9);
            g.ball(c[0], c[1], 14);
            g.text('5 A', 580, 570, { size: 40, font: 'mono', alpha: 0.8 });
            g.text('3 A', 1400, 450, { size: 40, font: 'mono', alpha: 0.8 });
            g.text('2 A', 1400, 850, { size: 40, font: 'mono', alpha: 0.8 });
          } else {
            const x0 = 360, x1 = 960, yT = 420, yB = 800;
            const f = ph(t, 10.5, 18);
            g.path([[x0, yB], [x0, yT], [x1, yT], [x1, yB], [x0, yB]], { alpha: 0.5, width: 3 });
            const pos = (q: number): Pt => {
              const len = [yB - yT, x1 - x0, yB - yT, x1 - x0];
              const total = len.reduce((a, b) => a + b, 0);
              let d = (q % 1) * total;
              if (d < len[0]) return [x0, yB - d];
              d -= len[0];
              if (d < len[1]) return [x0 + d, yT];
              d -= len[1];
              if (d < len[2]) return [x1, yT + d];
              d -= len[2];
              return [x1 - d, yB];
            };
            const V = (q: number) => (q < 0.026 ? 0 : q < 0.068 ? (12 * (q - 0.026)) / 0.042 : q < 0.306 ? 12 : q < 0.387 ? 12 - (4 * (q - 0.306)) / 0.081 : q < 0.577 ? 8 : q < 0.658 ? 8 - (8 * (q - 0.577)) / 0.081 : 0);
            cell(g, x0, 640);
            res(g, 560, yT, 700, yT, 'R₁');
            res(g, x1, 520, x1, 660, 'R₂');
            const [bx, by] = pos(f);
            g.ball(bx, by, 14);
            const gx = 1260, gy = 840, gw = 520, gh = 380;
            g.axes(gx, gy, gw, gh + 20, { x: 'path', y: 'V', alpha: 0.6 });
            const pts: Pt[] = [];
            for (let i = 0; i <= 160; i++) {
              const q = (i / 160) * f;
              pts.push([gx + q * gw, gy - (V(q) / 12) * gh]);
            }
            g.path(pts, { width: 3 });
            g.ball(gx + f * gw, gy - (V(f) / 12) * gh, 12);
          }
        },
      },
      {
        title: 'The Wheatstone bridge',
        say: [
          'Four resistors in a diamond, with a galvanometer across the middle.',
          'Change one resistance and the needle swings one way, then the other. At one setting it reads exactly zero.',
          'Then no current crosses the middle, and the ratios of the resistances match. Three known values give the fourth.',
        ],
        eq: [{ at: 8, src: '[ P | Q ] = [ R | S ]' }],
        draw: (g, t) => {
          const P = 10, Q = 20, R = 30;
          const S = lerp(25, 110, 0.5 - 0.5 * Math.cos(t * 0.45));
          const VB = (6 * Q) / (P + Q);
          const VD = (6 * S) / (R + S);
          const dV = VB - VD;
          const A: Pt = [520, 600], C: Pt = [1400, 600], B: Pt = [960, 380], D: Pt = [960, 830];
          res(g, A[0], A[1], B[0], B[1], 'P');
          res(g, B[0], B[1], C[0], C[1], 'Q');
          res(g, A[0], A[1], D[0], D[1], 'R');
          res(g, D[0], D[1], C[0], C[1], 'S');
          g.line(B[0], B[1], 960, 520, { alpha: 0.5, width: 3 });
          g.line(960, 680, D[0], D[1], { alpha: 0.5, width: 3 });
          g.circle(960, 600, 80, { alpha: 0.9, width: 3, fill: 0.08 });
          const ang = Math.max(-1, Math.min(1, dV * 1.4)) * 1.2;
          g.line(960, 600, 960 + 62 * Math.sin(ang), 600 - 62 * Math.cos(ang), { width: 5 });
          g.text('G', 960, 660, { size: 34, font: 'italic', alpha: 0.7 });
          g.text(`S = ${S.toFixed(0)} Ω`, 1500, 840, { size: 36, font: 'mono', alpha: 0.8, align: 'left' });
          g.text(Math.abs(dV) < 0.04 ? 'balanced: P/Q = R/S' : `R/S = ${(R / S).toFixed(2)}`, 1500, 900, { size: 32, font: 'mono', alpha: 0.7, align: 'left' });
          g.text('P/Q = 0.50', 1500, 790, { size: 32, font: 'mono', alpha: 0.7, align: 'left' });
        },
      },
    ],
  });
