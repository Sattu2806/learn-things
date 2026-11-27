import { buildChapterFilm, lerp, ph, TAU, type Gfx } from '../film/engine';

/** Potential and capacitance: work per charge, the potential hill, equipotentials, the capacitor and its energy. */

function charge(g: Gfx, x: number, y: number, q: number, r = 30, a = 1) {
  const c = g.ctx;
  if (q > 0) g.ball(x, y, r, a);
  else g.circle(x, y, r, { alpha: a, width: 3 });
  c.save();
  c.globalAlpha *= a;
  c.font = `500 ${r * 1.5}px ui-monospace, monospace`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillStyle = q > 0 ? '#000' : '#fff';
  c.fillText(q > 0 ? '+' : '−', x, y + 1);
  c.restore();
}

function dot(g: Gfx, x: number, y: number, q: number, a = 1, r = 8) {
  if (q > 0) g.circle(x, y, r, { fill: 1, width: 0, alpha: a });
  else g.circle(x, y, r, { width: 3, alpha: a });
}

export const buildFilm = () =>
  buildChapterFilm({
    title: 'How much energy does a charge carry?',
    subtitle: 'Potential, equipotentials and the capacitor.',
    shots: [
      {
        title: 'Work per charge',
        say: [
          'Push a positive charge against an electric field and you do work. That work is stored as potential energy.',
          'The work does not depend on the route. Only the climb along the field counts.',
          'Divide by the charge and you get the potential difference, measured in volts: joules per coulomb.',
        ],
        eq: [{ at: 8, src: 'V _B − V _A = [ W | q _0 ]' }],
        draw: (g, t) => {
          const ax = 360, bx = 1500, ay = 800, by = 430;
          for (const y of [330, 480, 630, 780, 900]) for (let k = 0; k < 6; k++) {
            const x = 300 + k * 260 + ((t * 40) % 260);
            g.arrow(x + 140, y, x + 60, y, { alpha: 0.2, width: 2, head: 12 });
          }
          const p = ph(t, 1, 8);
          const straight = (s: number): [number, number] => [lerp(ax, bx, s), lerp(ay, by, s)];
          const winding = (s: number): [number, number] => [lerp(ax, bx, s), lerp(ay, by, s) + 120 * Math.sin(3.5 * Math.PI * s) * (1 - 0.3 * s)];
          g.curve((x) => straight((x - ax) / (bx - ax))[1], ax, bx, { alpha: 0.2, dash: [10, 10], n: 20 });
          const pts = (f: (s: number) => [number, number], n: number): [number, number][] => Array.from({ length: n + 1 }, (_, i) => f((i / n) * p));
          g.path(pts(straight, 40), { alpha: 0.8 });
          g.path(pts(winding, 160), { alpha: 0.8 });
          const [sx, sy] = straight(p);
          const [wx, wy] = winding(p);
          g.ball(sx, sy, 14);
          g.ball(wx, wy, 14);
          g.text('A', ax - 20, ay + 56, { size: 44, font: 'italic', alpha: 0.7 });
          g.text('B', bx + 20, by - 30, { size: 44, font: 'italic', alpha: 0.7 });
          g.text(`W = ${Math.round(p * 100)}%`, 1560, 940, { size: 36, font: 'mono', alpha: 0.7, align: 'left' });
        },
      },
      {
        title: 'The potential hill',
        say: [
          'Around a positive charge, the potential is a hill that gets steeper toward the centre.',
          'A positive test charge rolls down it, away from the source, gaining speed.',
          'The potential at distance r is k Q over r. It is a plain number, so potentials from several charges just add.',
        ],
        eq: [
          { at: 5, src: 'V = k · [ Q | r ]' },
          { at: 10, src: 'V = V _1 + V _2 + V _3' },
        ],
        draw: (g, t) => {
          const gx = 280, gy = 880, gw = 1360, gh = 480;
          g.axes(gx, gy, gw, gh + 40, { x: 'r', y: 'V', alpha: 0.6 });
          const f = (x: number) => gy - Math.min(gh, (gh * 0.55) / (0.4 + (x - gx) / 480));
          g.curve(f, gx + 30, gx + gw - 40, { alpha: 0.5, n: 300 });
          charge(g, gx + 60, gy - 40, 1, 26);
          const u = ph(t, 1.5, 9);
          const x = lerp(gx + 140, gx + gw - 100, u * u);
          g.ball(x, f(x) - 22, 16);
          g.arrow(x, f(x) - 70, x + 130 * (1 - u * 0.6), f(x) - 70, { width: 4, label: 'F' });
        },
      },
      {
        title: 'Equipotentials and the field',
        say: [
          'Join the points of equal potential and you get equipotential surfaces. Around a point charge they are spheres.',
          'The field is always perpendicular to them, and points toward lower potential.',
          'Where the surfaces are close together, the potential changes fast, and the field is strong. The field is minus the slope of the potential.',
        ],
        eq: [{ at: 9, src: 'E = − [ d V | d x ]' }],
        draw: (g, t) => {
          const cx = 760, cy = 620;
          const R0 = 260;
          [0.5, 1, 1.5, 2, 2.5, 3, 4].forEach((n, i) => {
            const a = ph(t, 0.4 + i * 0.35, 1.4 + i * 0.35);
            g.circle(cx, cy, (R0 / n) * a, { alpha: 0.6, width: 2.5 });
          });
          for (let k = 0; k < 12; k++) {
            const a = TAU * (k / 12);
            const e = ph(t, 4, 5.5);
            g.arrow(cx + 70 * Math.cos(a), cy + 70 * Math.sin(a), cx + (70 + 450 * e) * Math.cos(a), cy + (70 + 450 * e) * Math.sin(a), { alpha: 0.35 * e, width: 2, head: 14 });
          }
          charge(g, cx, cy, 1, 34);
          // A probe falling out along a field line.
          const r = lerp(120, 520, ph(t, 5, 12));
          g.ball(cx + r, cy, 12);
          g.text(`V = ${(R0 / r).toFixed(2)}`, cx + r, cy - 40, { size: 32, font: 'mono', alpha: 0.8 });
          // And a graph of V against r.
          const gx = 1250, gy = 820;
          g.axes(gx, gy, 520, 380, { x: 'x', y: 'V', alpha: 0.6 });
          const f = (x: number) => gy - Math.min(360, (R0 * 1.2) / ((x - gx) / 4 + 60) * 1.5);
          g.curve(f, gx + 20, gx + 500, { alpha: 0.5 });
          const px = gx + (r - 100) * 1;
          g.ball(Math.min(px, gx + 500), f(Math.min(px, gx + 500)), 11);
        },
      },
      {
        title: 'The capacitor',
        say: [
          'Two plates, a battery, and charge flows from one plate to the other.',
          'The plates end up with equal and opposite charge, and a field between them.',
          'The ratio of charge to voltage is the capacitance. For flat plates it depends only on the area and the gap.',
        ],
        eq: [
          { at: 3, src: 'C = [ Q | V ]' },
          { at: 9, src: 'C = [ ε _0 · A | d ]' },
        ],
        draw: (g, t) => {
          const prog = 1 - Math.exp(-ph(t, 0.8, 8) * 3.2);
          const px = 560, pw = 560;
          const d = lerp(300, 170, ph(t, 9, 12));
          const top = 620 - d / 2, bot = 620 + d / 2;
          g.rect(px, top - 12, pw, 12, { fill: 0.9 });
          g.rect(px, bot, pw, 12, { fill: 0.15 });
          const n = Math.round(prog * 9 * (300 / d));
          for (let i = 0; i < n && i < 16; i++) {
            const x = px + 30 + (i * (pw - 60)) / Math.max(7, n - 1);
            dot(g, x, top + 24, 1, 0.9);
            dot(g, x, bot - 14, -1, 0.9);
          }
          for (let i = 0; i < 7; i++) {
            const x = px + 50 + i * 76;
            g.arrow(x, top + 40, x, top + 40 + (d - 80) * (0.2 + 0.8 * prog), { alpha: 0.35 + 0.4 * prog, width: 2.5, head: 14 });
          }
          g.line(px + pw / 2, top - 12, px + pw / 2, top - 120, { alpha: 0.6 });
          g.line(px + pw / 2, bot + 12, px + pw / 2, bot + 120, { alpha: 0.6 });
          g.line(px - 120, top - 120, px + pw / 2, top - 120, { alpha: 0.6 });
          g.line(px - 120, bot + 120, px + pw / 2, bot + 120, { alpha: 0.6 });
          g.line(px - 120, top - 120, px - 120, (top + bot) / 2 - 40, { alpha: 0.6 });
          g.line(px - 120, bot + 120, px - 120, (top + bot) / 2 + 40, { alpha: 0.6 });
          g.line(px - 150, (top + bot) / 2 - 40, px - 90, (top + bot) / 2 - 40, { alpha: 0.9, width: 5 });
          g.line(px - 135, (top + bot) / 2 + 40, px - 105, (top + bot) / 2 + 40, { alpha: 0.9, width: 5 });
          if (t > 9) {
            g.line(px + pw + 60, top, px + pw + 60, bot, { alpha: 0.6 });
            g.text('d', px + pw + 100, 630, { size: 44, font: 'italic', alpha: 0.7 });
          }
        },
      },
      {
        title: 'Energy in the field',
        say: [
          'To charge the plates, each new bit of charge has to be pushed against the voltage already there.',
          'On a graph of charge against voltage, the work is the area of a triangle.',
          'That is half C V squared, stored in the electric field between the plates.',
        ],
        eq: [
          { at: 6, src: 'U = ∫ _0 ^Q [ q | C ] · d q' },
          { at: 10, src: 'U = [ 1 | 2 ] · C · V ^2' },
        ],
        draw: (g, t) => {
          const gx = 440, gy = 860, gw = 760, gh = 520;
          g.axes(gx, gy, gw, gh + 30, { x: 'V', y: 'Q', alpha: 0.6 });
          const p = ph(t, 1, 9);
          g.line(gx, gy, gx + gw * 0.9, gy - gh * 0.9, { alpha: 0.45, dash: [10, 10] });
          const n = 22;
          for (let i = 0; i < n; i++) {
            const s0 = (i / n) * p;
            const s1 = ((i + 1) / n) * p;
            g.rect(gx + gw * 0.9 * 0, gy - gh * 0.9 * s1, gw * 0.9 * s0, gh * 0.9 * (s1 - s0), { fill: 0.22, alpha: 1, width: 0 });
          }
          g.line(gx, gy, gx + gw * 0.9 * p, gy - gh * 0.9 * p, { width: 4 });
          g.ball(gx + gw * 0.9 * p, gy - gh * 0.9 * p, 13);
          g.text('area = energy', gx + 200, gy - 120, { size: 34, alpha: 0.7 * ph(t, 4, 6) });
          const f = ph(t, 11, 13);
          g.text('U = ½ C V²', 1450, 560, { size: 56, font: 'italic', alpha: f });
          g.text('stored in the field', 1450, 630, { size: 34, alpha: 0.7 * f });
        },
      },
      {
        title: 'A dielectric',
        say: [
          'Slide an insulator between the plates. Its molecules line up with the field.',
          'The charge on their faces cancels part of the field, so the same charge now needs less voltage.',
          'The capacitance goes up by the dielectric constant K.',
        ],
        eq: [{ at: 8, src: 'C = K · C _0' }],
        draw: (g, t) => {
          const K = 3;
          const s = ph(t, 1.5, 5);
          const px = 480, pw = 760, top = 460, bot = 820;
          g.rect(px, top - 12, pw, 12, { fill: 0.9 });
          g.rect(px, bot, pw, 12, { fill: 0.15 });
          const sx = lerp(px + pw + 140, px + 60, s);
          const sw = 380;
          g.rect(sx, top + 30, sw, bot - top - 60, { fill: 0.1, alpha: 0.8, width: 3 });
          for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
            const mx = sx + 36 + (c * (sw - 72)) / 5;
            const my = top + 80 + (r * (bot - top - 160)) / 3;
            if (mx < px || mx > px + pw) continue;
            const a = (1 - s) * Math.sin(t * 3 + r * 2 + c) * 1.1;
            const L = 18;
            g.line(mx - L * Math.sin(a), my + L * Math.cos(a), mx + L * Math.sin(a), my - L * Math.cos(a), { alpha: 0.6, width: 2 });
            dot(g, mx - L * Math.sin(a), my + L * Math.cos(a), -1, 1, 5);
            dot(g, mx + L * Math.sin(a), my - L * Math.cos(a), 1, 1, 5);
          }
          const keff = 1 + (K - 1) * s;
          for (let i = 0; i < 8; i++) {
            const x = px + 40 + i * 96;
            g.arrow(x, top + 10, x, top + 10 + 150 / keff + 20, { alpha: 0.35, width: 1 + 3 / keff, head: 13 });
          }
          g.text(`E = E₀ / ${keff.toFixed(1)}`, 1460, 560, { size: 40, font: 'mono', alpha: 0.8, align: 'left' });
          g.text(`C = ${keff.toFixed(1)} C₀`, 1460, 640, { size: 40, font: 'mono', alpha: 0.8, align: 'left' });
        },
      },
    ],
  });
