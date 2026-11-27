import { buildChapterFilm, ph, TAU, type Gfx } from '../film/engine';

/** Magnetism and matter: poles in pairs, a magnet as current loops, the Earth, three kinds of material and hysteresis. */

/** A bar magnet: open S half on the left, filled N half on the right. */
function bar(g: Gfx, x: number, y: number, w: number, h: number, a = 1, letters = true) {
  g.rect(x - w / 2, y - h / 2, w / 2, h, { alpha: a, fill: 0.04, width: 3 });
  g.rect(x, y - h / 2, w / 2, h, { alpha: a, fill: 0.55, width: 3 });
  if (letters) {
    g.text('S', x - w / 4, y + 14, { size: Math.min(48, h * 0.55), font: 'italic', alpha: a });
    g.text('N', x + w / 4, y + 14, { size: Math.min(48, h * 0.55), font: 'italic', alpha: a });
  }
}

/** A little arrow for one atomic magnet. */
function mini(g: Gfx, x: number, y: number, ang: number, len: number, a: number) {
  const dx = Math.cos(ang) * len, dy = -Math.sin(ang) * len;
  g.arrow(x - dx, y - dy, x + dx, y + dy, { alpha: a, width: 4, head: 16 });
}

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const rnd = (i: number, k = 0) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const buildFilm = () =>
  buildChapterFilm({
    title: 'What is a magnet, really?',
    subtitle: 'Magnetism and matter.',
    shots: [
      {
        title: 'Poles come in pairs',
        say: [
          'Take a bar magnet, with a north pole at one end and a south pole at the other.',
          'Cut it in half, hoping to find a lone north and a lone south.',
          'You get two magnets, each with both poles. Cut again, and you get four.',
          'Field lines never start or stop. Through any closed surface, as many go in as come out.',
        ],
        eq: [{ at: 11, src: '∮ B · d A = 0' }],
        draw: (g, t) => {
          const y = 640, full = 900;
          const c1 = ph(t, 3, 4.2), c2 = ph(t, 6.5, 7.7);
          const w1 = 1 - c1;
          bar(g, 960, y, full, 120, w1);
          for (const s of [-1, 1]) bar(g, 960 + s * (full / 4 + 70 * c1), y, full / 2 - 20, 120, c1 * (1 - c2));
          for (const s of [-1, 1])
            for (const h of [-1, 1]) bar(g, 960 + s * (full / 2 + 140) / 2 + h * (full / 8 + 30), y, full / 4 - 24, 120, c2);
          g.line(960, y - 130, 960, y - 130 + 260 * ph(t, 2.2, 3), { alpha: 0.5 * (1 - c1), dash: [10, 10] });
          g.text(c2 > 0.5 ? 'four magnets' : c1 > 0.5 ? 'two magnets' : 'one magnet', 960, 420, { size: 38, alpha: 0.75 });
          // A surface round the north pole at the end.
          const s = ph(t, 10, 12);
          g.arc(960, y, 400, 0, TAU, { alpha: 0.25 * s, dash: [12, 12], width: 2 });
          g.text('every line that goes in comes out', 960, 900, { size: 30, alpha: 0.6 * s });
        },
      },
      {
        title: 'A swarm of tiny loops',
        say: [
          'A coil of current makes exactly the field of a bar magnet.',
          'Its strength is the magnetic moment, N I A.',
          'Inside a real magnet there are no wires, but electrons going round atoms, and spinning, are the tiny loops.',
          'A magnet is a material in which most of those loops point the same way.',
        ],
        eq: [{ at: 5, src: 'm = N · I · A' }],
        draw: (g, t) => {
          const cx = 960, cy = 650, w = 760, n = 12;
          const f = 0.5 - 0.5 * Math.cos((TAU * t) / 10);
          bar(g, cx, cy, w, 220, 1 - 0.85 * f);
          for (let i = 0; i < n; i++) {
            const x = cx - w / 2 + 30 + (i * (w - 60)) / (n - 1);
            g.with({ alpha: f }, () => {
              g.arc(x, cy, 110, 0, TAU, { alpha: 0.7, width: 2 });
              const a = TAU * (t / 1.6 - i * 0.07);
              g.ball(x + 0, cy - 110 * Math.sin(a) * 1, 8);
            });
          }
          for (let k = 0; k < 4; k++) g.arrow(300 + 12 * Math.sin(3 * t - k), 560 + k * 60, 400 + 12 * Math.sin(3 * t - k), 560 + k * 60, { alpha: 0.35, width: 3 });
          g.text('S', 340, 850, { size: 42, font: 'italic', alpha: 0.7 });
          g.text('N', 1580, 850, { size: 42, font: 'italic', alpha: 0.7 });
          g.arrow(cx - 200, 880, cx + 200, 880, { alpha: 0.8 * ph(t, 6, 7), width: 4, label: 'm' });
        },
      },
      {
        title: 'A needle in a field',
        say: [
          'A small magnet in a field feels a torque that turns it to line up with the field. That is a compass.',
          'The torque is m B sine theta, and the energy is lowest when the magnet points along the field.',
          'Nudged a little, it swings back and forth in simple harmonic motion, quicker in a stronger field.',
        ],
        eq: [
          { at: 4, src: 'τ = m · B · sin θ' },
          { at: 8, src: 'U = − m · B · cos θ' },
        ],
        draw: (g, t) => {
          const cx = 560, cy = 640, L = 190;
          const th = 1.0 * Math.cos((TAU * t) / 4);
          for (let i = -2; i <= 2; i++) {
            const o = 12 * Math.sin(3 * t - i * 0.4);
            g.arrow(190 + o, cy + i * 120, 330 + o, cy + i * 120, { alpha: 0.35, width: 3 });
          }
          const nx = cx + L * Math.cos(th), ny = cy - L * Math.sin(th);
          const sx = cx - L * Math.cos(th), sy = cy + L * Math.sin(th);
          g.line(sx, sy, nx, ny, { width: 8 });
          g.ball(nx, ny, 22);
          g.circle(sx, sy, 22, { alpha: 0.9, width: 3 });
          g.text('N', nx + 44, ny - 10, { size: 38, font: 'italic' });
          const F = 90 * Math.min(1, Math.abs(Math.sin(th)) * 1.6) * Math.sign(th);
          g.arrow(nx, ny, nx, ny - F, { alpha: 0.7, width: 4 });
          g.arrow(sx, sy, sx, sy + F, { alpha: 0.7, width: 4 });
          // The energy bowl.
          const ox = 1250, oy = 760, gh = 220;
          g.axes(ox - 300, oy, 700, gh + 80, { x: 'θ', y: 'U', alpha: 0.5 });
          g.curve((x) => oy - 20 - gh * 0.5 * (1 - Math.cos((x - ox) / 100)), ox - 300, ox + 300, { alpha: 0.7, n: 200 });
          const px = ox + th * 100;
          g.ball(px, oy - 20 - gh * 0.5 * (1 - Math.cos(th)), 14, ph(t, 6, 7.5));
        },
      },
      {
        title: 'The Earth is a magnet',
        say: [
          'The Earth itself acts like a giant bar magnet.',
          'A dip needle lies flat at the equator, tilts down as you go north, and points straight down at the pole.',
          'The field splits into a horizontal part, which a compass feels, and a vertical part.',
        ],
        eq: [
          { at: 5, src: 'tan δ = 2 · tan λ' },
          { at: 10, src: 'B _H = B _E · cos δ' },
        ],
        draw: (g, t) => {
          const cx = 760, cy = 640, R = 280;
          g.circle(cx, cy, R, { alpha: 0.45, width: 3 });
          g.line(cx, cy - R - 80, cx, cy + R + 80, { alpha: 0.25, dash: [10, 10], width: 2 });
          g.rect(cx - 14, cy - 110, 28, 110, { alpha: 0.9, fill: 0.04, width: 3 });
          g.rect(cx - 14, cy, 28, 110, { alpha: 0.9, fill: 0.55, width: 3 });
          const sweep = ph(t, 1, 8) * 1.4;
          [0, 20, 40, 60, 80].forEach((d) => {
            const lat = (d * Math.PI) / 180;
            const a = ph(sweep, lat - 0.1, lat);
            const dip = Math.atan(2 * Math.tan(lat));
            const px = cx + R * Math.cos(lat), py = cy - R * Math.sin(lat);
            const tx = -Math.sin(lat), ty = -Math.cos(lat);
            const rx = Math.cos(lat), ry = -Math.sin(lat);
            const dx = Math.cos(dip) * tx - Math.sin(dip) * rx;
            const dy = Math.cos(dip) * ty - Math.sin(dip) * ry;
            g.arrow(px - dx * 60, py - dy * 60, px + dx * 60, py + dy * 60, { alpha: a, width: 5, head: 22 });
          });
          // Components triangle.
          const dipNow = Math.atan(2 * Math.tan(sweep));
          const ox = 1260, oy = 560, len = 420;
          const hx = ox + len * Math.cos(dipNow), hy = oy + len * Math.sin(dipNow);
          const a = ph(t, 5, 6.5);
          g.arrow(ox, oy, hx, oy, { alpha: 0.6 * a, width: 4 });
          g.arrow(hx, oy, hx, hy, { alpha: 0.6 * a, width: 4 });
          g.arrow(ox, oy, hx, hy, { alpha: a, width: 5 });
          g.text('B_H', (ox + hx) / 2, oy - 24, { size: 32, font: 'italic', alpha: a * 0.8 });
          g.text('B_V', hx + 50, (oy + hy) / 2, { size: 32, font: 'italic', alpha: a * 0.8 });
          g.text('δ', ox + 80, oy + 40, { size: 34, font: 'italic', alpha: a });
        },
      },
      {
        title: 'Three kinds of material',
        say: [
          'Put a material in a field. In a diamagnet, every atom gets a tiny opposing moment. The effect is very weak, and it pushes the material away.',
          'In a paramagnet, atoms with moments of their own lean slightly toward the field, and the material is weakly drawn in.',
          'In a ferromagnet, the moments are locked in domains, which swing round and stay swung. That is iron, and that is a permanent magnet.',
        ],
        eq: [{ at: 4, src: 'B = μ _0 · ( H + M )' }, { at: 12, src: 'M = χ · H' }],
        draw: (g, t) => {
          const panels = [
            { cx: 420, name: 'diamagnet  χ < 0' },
            { cx: 960, name: 'paramagnet  χ > 0, small' },
            { cx: 1500, name: 'ferromagnet  χ ≫ 1' },
          ];
          const on = ph(t, 1.5, 3.5) * (1 - ph(t, 17, 18));
          panels.forEach((p, pi) => {
            g.rect(p.cx - 220, 420, 440, 400, { alpha: 0.4, width: 2 });
            for (let i = 0; i < 12; i++) {
              const col = i % 3, row = Math.floor(i / 3);
              const x = p.cx - 120 + col * 120, y = 500 + row * 100;
              const jig = Math.sin(TAU * (t / 1.3) + i * 1.7);
              if (pi === 0) mini(g, x, y, Math.PI, 3 + 36 * on, 0.25 + 0.75 * on);
              else if (pi === 1) {
                const base = rnd(i, 1) * TAU + 0.5 * jig;
                mini(g, x, y, base + wrap(-base) * 0.6 * on, 36, 1);
              } else {
                const dom = (col >= 1 ? 1 : 0) + (row >= 2 ? 2 : 0);
                const base = [2.2, -1.1, 3.6, 0.9][dom] + 0.1 * jig;
                mini(g, x, y, base + wrap(-base) * 0.92 * ph(t, 2.5, 4.5), 36, 1);
              }
            }
            g.text(p.name, p.cx, 880, { size: 30, alpha: 0.7 });
          });
          g.arrow(220, 960, 220 + 200 * on, 960, { alpha: 0.7, width: 4, label: 'B' });
        },
      },
      {
        title: 'Hysteresis',
        say: [
          'Magnetise iron by raising the field, and it saturates.',
          'Switch the field back to zero and some magnetism stays: that is retentivity.',
          'To wipe it out, you must push the other way, by an amount called the coercivity.',
          'The loop never retraces itself. Its area is energy lost as heat each cycle, so soft iron, with a thin loop, makes transformers, and steel, with a fat loop, makes permanent magnets.',
        ],
        draw: (g, t) => {
          const ox = 760, oy = 640, sx = 360, sy = 230;
          g.axes(ox - 420, oy, 840, 330, { x: 'H', y: 'B', alpha: 0.6, down: 330 });
          const loop = (u: number): [number, number] => {
            if (u < 1) return [u, Math.tanh(u / 0.3)];
            if (u < 2) {
              const H = 1 - 2 * (u - 1);
              return [H, Math.tanh((H + 0.25) / 0.18)];
            }
            const H = -1 + 2 * (u - 2);
            return [H, Math.tanh((H - 0.25) / 0.18)];
          };
          const u = Math.min(3, Math.max(0, ((t - 0.5) / 14) * 3));
          const pts: [number, number][] = [];
          for (let k = 0; k <= 240; k++) {
            const [h, b] = loop((u * k) / 240);
            pts.push([ox + h * sx, oy - b * sy]);
          }
          g.path(pts, { width: 4 });
          const [h, b] = loop(u);
          g.ball(ox + h * sx, oy - b * sy, 16);
          const br = Math.tanh(0.25 / 0.18);
          const a1 = ph(t, 6, 7), a2 = ph(t, 9, 10);
          g.circle(ox, oy - br * sy, 16, { alpha: a1, width: 3 });
          g.text('retentivity', ox + 30, oy - br * sy - 16, { size: 30, alpha: a1, align: 'left' });
          g.circle(ox - 0.25 * sx, oy, 16, { alpha: a2, width: 3 });
          g.text('coercivity', ox - 0.25 * sx - 20, oy + 56, { size: 30, alpha: a2, align: 'right' });
          // Soft and hard loops, small, on the right.
          const s = ph(t, 12, 14);
          [['soft iron', 0.06, 0.12, 0], ['steel', 0.55, 0.3, 1]].forEach(([name, hc, wd, i]) => {
            const cx = 1500, cy = 440 + (i as number) * 320;
            g.axes(cx - 170, cy, 340, 120, { alpha: 0.4 * s, down: 120 });
            const q: [number, number][] = [];
            for (let k = 0; k <= 80; k++) {
              const uu = (k / 80) * 2;
              const H = uu < 1 ? 1 - 2 * uu : -1 + 2 * (uu - 1);
              const c = uu < 1 ? (hc as number) : -(hc as number);
              q.push([cx + 150 * H, cy - 90 * Math.tanh((H + c) / (wd as number))]);
            }
            g.path(q, { alpha: 0.9 * s, width: 3 });
            g.text(name as string, cx, cy + 160, { size: 28, alpha: 0.7 * s });
          });
        },
      },
    ],
  });
