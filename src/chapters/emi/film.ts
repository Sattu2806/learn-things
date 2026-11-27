import { buildChapterFilm, TAU, type Gfx } from '../film/engine';

/** Electromagnetic induction: a moving magnet, flux, Lenz, the sliding rod, inductance and the generator. */

const smooth = (p: number) => {
  const q = Math.min(1, Math.max(0, p));
  return q * q * (3 - 2 * q);
};

function cross(g: Gfx, x: number, y: number, s: number, a: number) {
  g.circle(x, y, s * 1.7, { alpha: a, width: 2 });
  g.line(x - s, y - s, x + s, y + s, { alpha: a, width: 2 });
  g.line(x - s, y + s, x + s, y - s, { alpha: a, width: 2 });
}

const breathe = (t: number, k: number) => 0.28 + 0.2 * Math.sin(2.2 * t + k);

/** A bar magnet, S on the left (open), N on the right (filled). */
function magnet(g: Gfx, x: number, y: number, w: number, h: number) {
  g.rect(x - w / 2, y - h / 2, w / 2, h, { fill: 0.04, width: 3 });
  g.rect(x, y - h / 2, w / 2, h, { fill: 0.55, width: 3 });
  g.text('S', x - w / 4, y + 13, { size: 40, font: 'italic' });
  g.text('N', x + w / 4, y + 13, { size: 40, font: 'italic' });
}

/** A coil seen from the side, with dots circling it when there is a current. */
function coil(g: Gfx, x: number, y: number, n: number, gap: number, rx: number, ry: number, cur: number, t: number) {
  for (let i = 0; i < n; i++) {
    const cx = x + i * gap;
    g.with({ x: cx, y }, () => {
      g.ctx.beginPath();
      g.ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
      g.ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      g.ctx.lineWidth = 3;
      g.ctx.stroke();
    });
    if (Math.abs(cur) > 0.04) {
      const a = TAU * (t * 0.7 * Math.sign(cur) + i * 0.13);
      g.ball(cx + rx * Math.cos(a), y - ry * Math.sin(a), 8, Math.min(1, Math.abs(cur) * 2));
    }
  }
}

/** A zero-centre meter. */
function dial(g: Gfx, cx: number, cy: number, r: number, val: number, a = 1) {
  const ang = (Math.max(-1, Math.min(1, val)) * 55 * Math.PI) / 180;
  g.arc(cx, cy, r, -Math.PI / 2 - Math.PI / 3, -Math.PI / 2 + Math.PI / 3, { alpha: 0.6 * a, width: 3 });
  g.line(cx, cy, cx + r * 0.88 * Math.sin(ang), cy - r * 0.88 * Math.cos(ang), { alpha: a, width: 5 });
  g.ball(cx, cy, 10, a);
  g.text('G', cx, cy + 56, { size: 34, font: 'italic', alpha: a * 0.8 });
}

export const buildFilm = () =>
  buildChapterFilm({
    title: 'How does a moving magnet make a current?',
    subtitle: 'Electromagnetic induction.',
    shots: [
      {
        title: 'Move a magnet, make a current',
        say: [
          'Connect a coil to a meter, with no battery anywhere.',
          'Push a magnet toward the coil, and the needle kicks. Hold the magnet still, and it falls back to zero.',
          'Pull the magnet away, and the needle kicks the other way. The faster you move, the bigger the kick.',
          'A current appears only while the magnetic field through the coil is changing.',
        ],
        draw: (g, t) => {
          const u = t % 12;
          const pos = (tt: number) => 360 + 420 * smooth((tt - 1) / 2.5) - 420 * smooth((tt - 7.5) / 1.6);
          const vel = (pos(u + 0.03) - pos(u - 0.03)) / 0.06;
          const val = vel / 330;
          magnet(g, pos(u), 640, 300, 100);
          coil(g, 1000, 640, 7, 40, 30, 130, val, t);
          g.line(1000, 510, 1000, 400, { alpha: 0.8 });
          g.line(1000, 400, 1560, 400, { alpha: 0.8 });
          g.line(1560, 400, 1560, 560, { alpha: 0.8 });
          g.line(1240, 770, 1240, 870, { alpha: 0.8 });
          g.line(1240, 870, 1560, 870, { alpha: 0.8 });
          g.line(1560, 870, 1560, 700, { alpha: 0.8 });
          dial(g, 1560, 640, 130, val);
          g.text(Math.abs(val) < 0.04 ? 'still: no current' : val > 0 ? 'moving in' : 'moving out', 1560, 960, { size: 30, alpha: 0.65 });
        },
      },
      {
        title: 'Flux',
        say: [
          'What changes is the flux: the number of field lines passing through the loop.',
          'A loop facing the field catches the most. Turn it, and fewer lines pass through it.',
          'Edge-on, it catches none. Flux is B A cosine theta.',
        ],
        eq: [{ at: 7, src: 'Φ = B · A · cos θ' }],
        draw: (g, t) => {
          const th = (TAU * t) / 10;
          const cx = 760, cy = 640, w = 400;
          const ext = (w / 2) * Math.abs(Math.cos(th));
          for (let i = -6; i <= 6; i++) {
            const y = cy + i * 34;
            const inside = Math.abs(i * 34) <= ext + 0.5;
            const o = 14 * Math.sin(2.5 * t - i * 0.3);
            g.arrow(330 + o, y, 560 + o, y, { alpha: inside ? 0.95 : 0.25, width: 3 });
            g.arrow(960 + o, y, 1190 + o, y, { alpha: inside ? 0.95 : 0.25, width: 3 });
          }
          const dx = (w / 2) * Math.sin(th), dy = (w / 2) * Math.cos(th);
          g.line(cx - dx, cy + dy, cx + dx, cy - dy, { width: 8 });
          g.arrow(cx, cy, cx + 90 * Math.cos(th), cy - 90 * Math.sin(th), { alpha: 0.6, width: 3, label: 'n' });
          g.line(cx + 250, cy - ext, cx + 250, cy + ext, { alpha: 0.7, width: 3 });
          g.text('A cos θ', cx + 280, cy + 8, { size: 30, align: 'left', alpha: 0.7 });
          // Graph of flux against time.
          const ox = 1380, oy = 640, gw = 420, gh = 150;
          g.axes(ox, oy, gw, gh + 60, { x: 't', y: 'Φ', alpha: 0.5, down: 160 });
          const k = (t % 10) / 10;
          g.curve((x) => oy - gh * Math.cos((TAU * (x - ox)) / gw), ox, ox + gw, { alpha: 0.3, n: 200 });
          g.curve((x) => oy - gh * Math.cos((TAU * (x - ox)) / gw), ox, ox + gw * k, { alpha: 0.95, n: 200 });
          g.ball(ox + gw * k, oy - gh * Math.cos(th), 12);
        },
      },
      {
        title: "Lenz's law",
        say: [
          'Which way does the current go? Lenz found the rule: it flows so as to oppose the change that made it.',
          'Push a north pole toward a ring, and the ring turns its near face into a north pole, to push the magnet back.',
          'Pull the magnet away, and the ring makes a south pole, to pull it back.',
          'Otherwise the magnet would speed up, and energy would be created from nothing.',
        ],
        eq: [{ at: 8, src: 'ε = − N · [ d Φ | d t ]' }],
        draw: (g, t) => {
          const u = t % 12;
          const pos = (tt: number) => 360 + 360 * smooth((tt - 1) / 2.5) - 360 * smooth((tt - 7) / 2.5);
          const vel = (pos(u + 0.03) - pos(u - 0.03)) / 0.06;
          const s = Math.sign(vel) * Math.min(1, Math.abs(vel) / 160);
          magnet(g, pos(u), 640, 320, 110);
          const cx = 1100, cy = 640, rx = 34, ry = 170;
          g.with({ x: cx, y: cy }, () => {
            g.ctx.beginPath();
            g.ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
            g.ctx.strokeStyle = 'rgba(255,255,255,0.85)';
            g.ctx.lineWidth = 4;
            g.ctx.stroke();
          });
          for (let i = 0; i < 8; i++) {
            const a = TAU * (i / 8 + t * 0.5 * s);
            g.ball(cx + rx * Math.cos(a), cy - ry * Math.sin(a), 8, Math.min(1, Math.abs(s) * 2));
          }
          g.arrow(cx + 110, cy, cx + 110 - 200 * s, cy, { alpha: Math.abs(s), width: 5, label: 'B' });
          g.text(Math.abs(s) < 0.05 ? '' : s > 0 ? 'near face: N, pushes back' : 'near face: S, pulls back', cx + 130, cy - ry - 40, { size: 32, align: 'left', alpha: 0.75 });
          g.text('induced field', cx + 110, cy + 80, { size: 28, alpha: 0.5 * Math.abs(s) });
        },
      },
      {
        title: 'A sliding rod',
        say: [
          'The simplest way to change the flux is to slide a rod along rails in a field.',
          'The magnetic force pushes the charges along the rod, and the rod becomes a battery, with emf B l v.',
          'The current in the rod feels a magnetic force that pulls back on it.',
          'So you must push to keep it moving, and the work you do becomes heat in the circuit.',
        ],
        eq: [
          { at: 5, src: 'ε = B · l · v' },
          { at: 11, src: 'F = [ B ^2 · l ^2 · v | R ]' },
        ],
        draw: (g, t) => {
          const xl = 420, yA = 480, yB = 840;
          const u = t % 14;
          const x = u < 1.5 ? 840 : u < 10 ? 840 + 70 * (u - 1.5) : 840 + 70 * 8.5;
          const moving = u > 1.5 && u < 10;
          for (let r = 0; r < 4; r++) for (let c = 0; c < 11; c++) cross(g, 520 + c * 110, 560 + r * 90, 8, breathe(t, r * 3 + c));
          g.line(xl, yA, 1700, yA, { alpha: 0.9, width: 4 });
          g.line(xl, yB, 1700, yB, { alpha: 0.9, width: 4 });
          g.line(xl, yA, xl, yB, { alpha: 0.9, width: 4 });
          g.rect(x - 10, yA - 10, 20, yB - yA + 20, { fill: 0.6, width: 3 });
          if (moving) {
            const per = [x - xl, yB - yA, x - xl, yB - yA];
            const total = per.reduce((a, b) => a + b, 0);
            for (let i = 0; i < 12; i++) {
              let d = ((i / 12 + t * 0.12) % 1) * total;
              let px = xl, py = yB;
              if (d < per[0]) { px = xl + d; py = yB; }
              else if ((d -= per[0]) < per[1]) { px = x; py = yB - d; }
              else if ((d -= per[1]) < per[2]) { px = x - d; py = yA; }
              else { px = xl; py = yA + (d - per[2]); }
              g.ball(px, py, 7);
            }
            g.arrow(x + 40, 660, x + 150, 660, { alpha: 0.9, width: 5, label: 'v' });
            g.arrow(x - 40, 740, x - 150, 740, { alpha: 0.7, width: 5, label: 'F' });
          }
          g.text('B into the page', 520, 450, { size: 28, alpha: 0.5, align: 'left' });
        },
      },
      {
        title: 'Inductance',
        say: [
          'A coil makes a field, and the field passes through the coil itself.',
          'So when the current changes, the coil induces an emf in itself, and by Lenz it fights the change.',
          'The strength of this effect is the inductance L, measured in henries.',
          'To build up a current you must do work against that emf, and the energy is stored in the field.',
        ],
        eq: [
          { at: 5, src: 'ε = − L · [ d I | d t ]' },
          { at: 12, src: 'U = [ 1 | 2 ] · L · I ^2' },
        ],
        draw: (g, t) => {
          const u = t % 14;
          const I = u < 1 ? 0 : u < 5 ? 0.25 * (u - 1) : u < 8 ? 1 : u < 9.5 ? 1 - (u - 8) / 1.5 : 0;
          const slope = u < 1 ? 0 : u < 5 ? 0.25 : u < 8 ? 0 : u < 9.5 ? -1 / 1.5 : 0;
          coil(g, 330, 640, 8, 46, 34, 150, I, t);
          g.text('I', 330, 430, { size: 36, font: 'italic', alpha: 0.7 });
          g.arrow(360, 460, 360 + 120 * I, 460, { alpha: 0.9, width: 5 });
          const eps = -slope;
          g.arrow(480, 860, 480 + eps * -160, 860, { alpha: Math.min(1, Math.abs(eps) * 3), width: 5 });
          g.text(Math.abs(eps) < 0.02 ? 'steady: no emf' : eps < 0 ? 'emf opposes the rise' : 'emf props up the fall', 480, 920, { size: 30, alpha: 0.65 });
          // I and emf graphs.
          const ox = 980, wx = 760;
          g.axes(ox, 560, wx, 220, { x: 't', y: 'I', alpha: 0.5 });
          g.axes(ox, 900, wx, 100, { x: 't', y: 'ε', alpha: 0.5, down: 90 });
          const Ifn = (v: number) => (v < 1 ? 0 : v < 5 ? 0.25 * (v - 1) : v < 8 ? 1 : v < 9.5 ? 1 - (v - 8) / 1.5 : 0);
          const Sfn = (v: number) => (v < 1 ? 0 : v < 5 ? 0.25 : v < 8 ? 0 : v < 9.5 ? -1 / 1.5 : 0);
          const kx = wx / 12;
          const a: [number, number][] = [];
          const b: [number, number][] = [];
          for (let k = 0; k <= 240; k++) {
            const v = Math.min(u, (12 * k) / 240);
            if ((12 * k) / 240 > u) break;
            a.push([ox + v * kx, 560 - 200 * Ifn(v)]);
            b.push([ox + v * kx, 900 + 70 * Sfn(v)]);
          }
          g.path(a, { width: 4 });
          g.path(b, { width: 4 });
          g.ball(ox + u * kx, 560 - 200 * I, 12);
          g.ball(ox + u * kx, 900 + 70 * slope, 12);
          g.rect(330, 960, 300, 24, { alpha: 0.5, width: 2 });
          g.rect(330, 960, 300 * I * I, 24, { fill: 0.7, width: 0 });
        },
      },
      {
        title: 'The generator',
        say: [
          'Spin a coil in a magnetic field, and the flux through it keeps changing.',
          'The flux is a cosine of the angle, so the emf, its rate of change, is a sine, a quarter of a turn out of step.',
          'The emf is largest when the coil is edge-on to the field, and the sides are cutting across it fastest.',
          'That is alternating current, and every power station on Earth makes it this way.',
        ],
        eq: [{ at: 9, src: 'ε = N · B · A · ω · sin ( ω · t )' }],
        draw: (g, t) => {
          const T = 6;
          const th = (TAU * t) / T;
          const cx = 560, cy = 640, w = 380;
          for (let i = -2; i <= 2; i++) {
            const o = 12 * Math.sin(3 * t - i * 0.4);
            g.arrow(170 + o, cy + i * 110, 300 + o, cy + i * 110, { alpha: 0.35, width: 3 });
          }
          const dx = (w / 2) * Math.sin(th), dy = (w / 2) * Math.cos(th);
          g.line(cx - dx, cy + dy, cx + dx, cy - dy, { width: 8 });
          g.ball(cx, cy, 10);
          g.ball(cx + dx, cy - dy, 14);
          g.ball(cx - dx, cy + dy, 14);
          g.arrow(cx + dx, cy - dy, cx + dx + 110 * Math.cos(th), cy - dy - 110 * Math.sin(th), { alpha: 0.7, width: 4 });
          g.arrow(cx - dx, cy + dy, cx - dx - 110 * Math.cos(th), cy + dy + 110 * Math.sin(th), { alpha: 0.7, width: 4 });
          const ox = 1020, oy = 640, gw = 760, A = 210, k = gw / 12;
          g.axes(ox, oy, gw + 20, A + 60, { x: 't', alpha: 0.5, down: A + 60 });
          const f = (u: number) => Math.cos((TAU * u) / T);
          const e = (u: number) => Math.sin((TAU * u) / T);
          g.curve((x) => oy - A * f((x - ox) / k), ox, ox + gw, { alpha: 0.35, dash: [10, 10], n: 300 });
          g.curve((x) => oy - A * e((x - ox) / k), ox, ox + gw, { alpha: 0.25, n: 300 });
          const tt = t % 12;
          g.curve((x) => oy - A * e((x - ox) / k), ox, ox + tt * k, { alpha: 0.95, n: 300 });
          g.ball(ox + tt * k, oy - A * e(tt), 13);
          g.circle(ox + tt * k, oy - A * f(tt), 12, { alpha: 0.6, width: 3 });
          g.text('emf', ox + gw - 20, oy - A - 20, { size: 30, alpha: 0.7, font: 'italic' });
          g.text('flux', ox + gw - 20, oy - A + 20, { size: 30, alpha: 0.45, font: 'italic' });
        },
      },
    ],
  });
