import { buildChapterFilm, lerp, ph, TAU, type Gfx } from '../film/engine';

/** Electric charges and fields: Coulomb's law, the field, field lines, a dipole and Gauss's law. */

type Pt = [number, number];
interface Q {
  x: number;
  y: number;
  q: number;
}

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

function fieldAt(qs: Q[], x: number, y: number): Pt {
  let ex = 0;
  let ey = 0;
  for (const c of qs) {
    const dx = x - c.x;
    const dy = y - c.y;
    const r2 = dx * dx + dy * dy + 1e-6;
    const r3 = r2 * Math.sqrt(r2);
    ex += (c.q * dx) / r3;
    ey += (c.q * dy) / r3;
  }
  return [ex, ey];
}

const cache = new Map<string, Pt[][]>();
function lines(qs: Q[], n: number): Pt[][] {
  const key = JSON.stringify([qs, n]);
  const hit = cache.get(key);
  if (hit) return hit;
  const out: Pt[][] = [];
  for (const c of qs) {
    if (c.q <= 0) continue;
    for (let i = 0; i < n; i++) {
      const a = (TAU * (i + 0.5)) / n;
      let x = c.x + 34 * Math.cos(a);
      let y = c.y + 34 * Math.sin(a);
      const pts: Pt[] = [[x, y]];
      for (let s = 0; s < 700; s++) {
        const [ex, ey] = fieldAt(qs, x, y);
        const m = Math.hypot(ex, ey);
        if (m < 1e-14) break;
        x += (ex * 8) / m;
        y += (ey * 8) / m;
        pts.push([x, y]);
        if (x < 40 || x > 1880 || y < 280 || y > 900) break;
        if (qs.some((d) => d.q < 0 && Math.hypot(x - d.x, y - d.y) < 34)) break;
      }
      out.push(pts);
    }
  }
  cache.set(key, out);
  return out;
}

export const buildFilm = () =>
  buildChapterFilm({
    title: 'How does a charge push from afar?',
    subtitle: 'Coulomb, fields and Gauss.',
    shots: [
      {
        title: "Coulomb's law",
        say: [
          'Two charges push or pull on each other without touching.',
          'The force depends on the product of the charges, and falls with the square of the distance between them.',
          'Double the distance and the force drops to a quarter.',
        ],
        eq: [{ at: 4, src: 'F = k · [ q _1 · q _2 | r ^2 ]' }],
        draw: (g, t) => {
          const u = 0.5 - 0.5 * Math.cos(t * 0.9);
          const r = lerp(260, 560, u);
          const cy = 560;
          const x1 = 700 - r / 2 + 100;
          const x2 = x1 + r;
          const F = (260 / r) ** 2;
          const len = 40 + 170 * F;
          g.line(x1, cy + 120, x2, cy + 120, { alpha: 0.5, width: 2 });
          g.text('r', (x1 + x2) / 2, cy + 175, { size: 40, font: 'italic', alpha: 0.7 });
          g.arrow(x1, cy - 70, x1 - len, cy - 70, { label: 'F', alpha: 0.9 });
          g.arrow(x2, cy - 70, x2 + len, cy - 70, { label: 'F', alpha: 0.9 });
          charge(g, x1, cy, 1, 34);
          charge(g, x2, cy, 1, 34);
          // The inverse square graph, with a dot riding on it.
          const gx = 1240, gy = 800, gw = 520, gh = 330;
          g.axes(gx, gy, gw, gh, { x: 'r', y: 'F', alpha: 0.6 });
          const f = (x: number) => gy - Math.min(gh * 0.95, (gh * 0.95 * (260 / (260 + (x - gx) * 0.9)) ** 2));
          g.curve(f, gx + 8, gx + gw - 20, { alpha: 0.5, n: 120 });
          const dx = gx + ((r - 260) / 0.9) * 1;
          g.ball(dx, f(dx), 11);
        },
      },
      {
        title: 'The field',
        say: [
          'We can describe the push without a second charge, by asking what a tiny test charge would feel at each point.',
          'That force per unit charge is the electric field.',
          'For a single point charge it points straight out and falls as one over r squared.',
        ],
        eq: [
          { at: 3, src: 'E = [ F | q _0 ]' },
          { at: 9, src: 'E = k · [ Q | r ^2 ]' },
        ],
        draw: (g, t) => {
          const cx = 760, cy = 590;
          for (let ring = 0; ring < 3; ring++) {
            const R = 150 + ring * 110;
            const n = 12 + 6 * ring;
            const L = 150 * (150 / R) ** 2 + 18;
            for (let k = 0; k < n; k++) {
              const a = TAU * (k / n) + ring * 0.2;
              const s = 0.85 + 0.15 * Math.sin(t * 2 - R / 60);
              const p = ph(t, 0.5 + ring * 0.4, 1.5 + ring * 0.4);
              g.arrow(cx + R * Math.cos(a), cy + R * Math.sin(a), cx + (R + L * s * p) * Math.cos(a), cy + (R + L * s * p) * Math.sin(a), { alpha: 0.6 * p, width: 2.5, head: 14 });
            }
          }
          charge(g, cx, cy, 1, 46);
          // A test charge moving out along a ray, with its own force arrow.
          const r = lerp(150, 380, 0.5 - 0.5 * Math.cos(t * 0.8));
          const E = (150 / r) ** 2;
          g.arrow(cx + r, cy, cx + r + 220 * E, cy, { width: 5, label: 'F' });
          charge(g, cx + r, cy, 1, 14);
          const gx = 1300, gy = 780;
          g.axes(gx, gy, 470, 300, { x: 'r', y: 'E', alpha: 0.6 });
          const f = (x: number) => gy - Math.min(285, 285 * (150 / (150 + (x - gx) * 0.6)) ** 2);
          g.curve(f, gx + 5, gx + 450, { alpha: 0.5 });
          const px = gx + (r - 150) / 0.6;
          g.ball(px, f(px), 11);
        },
      },
      {
        title: 'Field lines',
        say: [
          'Field lines draw the field. They start on positive charges and end on negative ones.',
          'The closer the lines, the stronger the field, and two lines never cross.',
          'A pair of equal and opposite charges is a dipole. Put it in a uniform field and the field twists it into line.',
        ],
        eq: [
          { at: 8, src: 'p = q · 2 · a' },
          { at: 12, src: 'τ = p · E · sin θ' },
        ],
        draw: (g, t) => {
          if (t < 7.5) {
            const qs: Q[] = [{ x: 620, y: 590, q: 1 }, { x: 1020, y: 590, q: -1 }];
            const ls = lines(qs, 14);
            ls.forEach((pts, i) => {
              const grow = ph(t, 0.4 + i * 0.05, 2.6 + i * 0.05);
              const m = Math.max(2, Math.floor(pts.length * grow));
              g.path(pts.slice(0, m), { alpha: 0.7, width: 2.5 });
              const L = pts.length;
              for (let k = 0; k < 3; k++) {
                const j = Math.floor(((t * 14 + i * 5 + (k * L) / 3) % L));
                if (j < m) g.circle(pts[j][0], pts[j][1], 6, { fill: 1, width: 0, alpha: 0.9 });
              }
            });
            charge(g, qs[0].x, qs[0].y, 1, 34);
            charge(g, qs[1].x, qs[1].y, -1, 34);
          } else {
            const f = ph(t, 7.5, 8.5);
            const th = 1.1 * Math.exp(-0.25 * (t - 8)) * Math.cos(2.2 * (t - 8));
            const cx = 960, cy = 620, L = 150;
            for (const y of [430, 620, 810]) for (let k = 0; k < 6; k++) g.arrow(300 + k * 270 + ((t * 60) % 270), y, 380 + k * 270 + ((t * 60) % 270), y, { alpha: 0.18 * f, width: 2, head: 12 });
            const dx = L * Math.cos(th);
            const dy = -L * Math.sin(th);
            g.line(cx - dx, cy - dy, cx + dx, cy + dy, { alpha: f, width: 4 });
            g.arrow(cx + dx, cy + dy, cx + dx + 110, cy + dy, { alpha: f, width: 4 });
            g.arrow(cx - dx, cy - dy, cx - dx - 110, cy - dy, { alpha: f, width: 4 });
            charge(g, cx + dx, cy + dy, 1, 28, f);
            charge(g, cx - dx, cy - dy, -1, 28, f);
            g.text('E', cx + 330, cy + 90, { size: 44, font: 'italic', alpha: 0.6 * f });
          }
        },
      },
      {
        title: "Gauss's law",
        say: [
          'Count the field lines leaving a closed surface. That is the flux.',
          'Around a point charge the lines spread out as the area grows, so the flux is the same for any surface that encloses it.',
          'A charge outside sends in as many lines as go out. Only the charge inside counts.',
        ],
        eq: [
          { at: 3, src: 'Φ = E · 4 · π · r ^2' },
          { at: 8, src: 'Φ = [ q _in | ε _0 ]' },
        ],
        draw: (g, t) => {
          const cx = 760, cy = 600, R = 190;
          const move = ph(t, 9, 12);
          const px = lerp(cx - 30, cx + 560, move);
          const py = lerp(cy + 20, cy - 80, move);
          const N = 20;
          let out = 0;
          let inn = 0;
          for (let i = 0; i < N; i++) {
            const a = TAU * (i / N) + 0.1;
            const dx = Math.cos(a);
            const dy = Math.sin(a);
            const fx = px - cx;
            const fy = py - cy;
            const b = fx * dx + fy * dy;
            const c = fx * fx + fy * fy - R * R;
            const disc = b * b - c;
            const s1 = disc > 0 ? -b - Math.sqrt(disc) : -1;
            const s2 = disc > 0 ? -b + Math.sqrt(disc) : -1;
            g.line(px, py, px + dx * 700, py + dy * 700, { alpha: 0.28, width: 2 });
            for (let s = (t * 120 + i * 17) % 120; s < 600; s += 120) g.circle(px + dx * s, py + dy * s, 5, { fill: 1, width: 0, alpha: 0.7 });
            if (s2 > 0) {
              out++;
              g.circle(px + dx * s2, py + dy * s2, 9, { fill: 1, width: 0 });
            }
            if (s1 > 0) {
              inn++;
              g.circle(px + dx * s1, py + dy * s1, 9, { width: 3 });
            }
          }
          g.circle(cx, cy, R, { alpha: 0.9, width: 4 });
          charge(g, px, py, 1, 24);
          g.text(`lines out: ${out}`, 1400, 520, { size: 40, font: 'mono', alpha: 0.8, align: 'left' });
          g.text(`lines in: ${inn}`, 1400, 580, { size: 40, font: 'mono', alpha: 0.8, align: 'left' });
          g.text(`net: ${out - inn}`, 1400, 660, { size: 54, font: 'italic', alpha: 1, align: 'left' });
        },
      },
      {
        title: 'Using symmetry',
        say: [
          'When the charge is spread symmetrically, Gauss gives the field in a line.',
          'Outside a charged shell the field is that of a point charge at the centre.',
          'Inside the shell there is no enclosed charge, so there is no field at all.',
        ],
        eq: [
          { at: 4, src: 'E = [ Q | 4 · π · ε _0 · r ^2 ]' },
          { at: 10, src: 'E = 0' },
        ],
        draw: (g, t) => {
          const cx = 560, cy = 620, R = 200;
          g.circle(cx, cy, R, { alpha: 0.9, width: 4 });
          for (let i = 0; i < 24; i++) charge(g, cx + R * Math.cos((TAU * i) / 24), cy + R * Math.sin((TAU * i) / 24), 1, 12);
          const a = ph(t, 1, 3);
          for (let i = 0; i < 16; i++) {
            const an = TAU * (i / 16);
            g.arrow(cx + (R + 40) * Math.cos(an), cy + (R + 40) * Math.sin(an), cx + (R + 40 + 90 * a) * Math.cos(an), cy + (R + 40 + 90 * a) * Math.sin(an), { alpha: 0.6 * a, width: 2.5, head: 14 });
          }
          const e = ph(t, 8, 10);
          g.text('E = 0', cx, cy + 14, { size: 54, font: 'italic', alpha: 0.9 * e });
          const gx = 1180, gy = 840, gw = 600, gh = 400;
          g.axes(gx, gy, gw, gh, { x: 'r', y: 'E', alpha: 0.6 });
          const rx = gx + 200;
          const prog = ph(t, 1.5, 9);
          const xEnd = gx + 30 + prog * (gw - 60);
          const f = (x: number) => (x < rx ? gy : gy - Math.min(gh - 20, (gh - 20) * ((rx - gx) / (x - gx)) ** 2));
          g.line(rx, gy, rx, gy + 12, { alpha: 0.6, width: 2 });
          g.text('R', rx, gy + 48, { size: 34, font: 'italic', alpha: 0.7 });
          g.curve(f, gx + 30, Math.max(gx + 31, xEnd), { n: 240 });
          if (xEnd > rx) g.line(rx, gy, rx, f(rx + 0.5), { alpha: 0.5, width: 2 });
          g.ball(xEnd, f(xEnd), 12);
        },
      },
    ],
  });
