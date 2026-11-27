import { buildChapterFilm, clamp, lerp, ph, TAU, type Gfx } from '../film/engine';

/** Atoms: scattering from a nucleus, the hydrogen spectrum, Bohr's orbits and energy levels. */

const DEG = Math.PI / 180;
type Pt = [number, number];

/** Path of a repelled alpha particle in units of r0 (closest approach of a head-on hit). */
const orbits = new Map<number, Pt[]>();
function orbit(b: number): Pt[] {
  const key = Math.round(b * 1000);
  const hit = orbits.get(key);
  if (hit) return hit;
  const R0 = 9;
  const pts: Pt[] = [];
  let vx = Math.sqrt(1 - 1 / R0), vy = 0;
  let x = -R0, y = b / vx;
  const dt = 0.02;
  const acc = (px: number, py: number): Pt => {
    const r = Math.hypot(px, py);
    return [(0.5 * px) / (r * r * r), (0.5 * py) / (r * r * r)];
  };
  let [ax, ay] = acc(x, y);
  for (let i = 0; i < 1400; i++) {
    pts.push([x, y]);
    x += vx * dt + 0.5 * ax * dt * dt;
    y += vy * dt + 0.5 * ay * dt * dt;
    const [nx, ny] = acc(x, y);
    vx += 0.5 * (ax + nx) * dt;
    vy += 0.5 * (ay + ny) * dt;
    ax = nx;
    ay = ny;
    if (Math.hypot(x, y) > R0 && i > 40 && x * vx + y * vy > 0) break;
  }
  orbits.set(key, pts);
  return pts;
}

const En = (n: number) => -13.6 / (n * n);

function packet(g: Gfx, cx: number, cy: number, lam: number, amp: number, len: number, shift: number, alpha = 1) {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 90; i++) {
    const x = (i / 90 - 0.5) * len;
    const env = Math.exp(-((x / (len * 0.3)) ** 2));
    pts.push([cx + x, cy + amp * env * Math.sin((TAU * x) / lam + shift)]);
  }
  g.path(pts, { alpha, width: 3 });
}

export const buildFilm = () =>
  buildChapterFilm({
    title: 'What does an atom look like inside?',
    subtitle: 'Scattering, spectra and the Bohr model.',
    shots: [
      {
        title: 'Aiming at a nucleus',
        say: [
          'Rutherford fired alpha particles at a thin gold foil.',
          'Almost all went straight through. But a few bounced back, as if they had hit something small, heavy and positive.',
          'Each particle is repelled by the nucleus. The closer the aim, the bigger the bend.',
        ],
        eq: [{ at: 9, src: 'b = [ r _0 | 2 ] · cot ( [ θ | 2 ] )' }],
        draw: (g, t) => {
          const k = 52, cx = 960, cy = 760;
          const p = ph(t, 1, 8.5);
          [0, 0.25, 0.5, 1, 2, 3.2].forEach((b) => {
            const path = orbit(b);
            const n = Math.max(2, Math.floor(p * (path.length - 1)));
            const pts: [number, number][] = path.slice(0, n + 1).map(([x, y]) => [cx + x * k, cy - y * k]);
            g.path(pts, { alpha: b === 0 ? 1 : 0.7, width: b === 0 ? 4 : 2.5 });
            const last = pts[pts.length - 1];
            g.ball(last[0], last[1], 9);
            if (p > 0.97) {
              const th = b === 0 ? 180 : (2 * Math.atan(1 / (2 * b))) / DEG;
              const e = path[path.length - 1];
              g.text(`${th.toFixed(0)}°`, cx + e[0] * k * 0.6 + 36, cy - e[1] * k * 0.6 - 10, { size: 28, font: 'mono', alpha: 0.8 * ph(t, 8.5, 9.5), align: 'left' });
            }
          });
          g.circle(cx, cy, k, { alpha: 0.4, width: 2, dash: [8, 8] });
          g.ball(cx, cy, 14 + 2 * Math.sin(TAU * t / 2));
          g.text('nucleus', cx, cy + 56, { size: 30, alpha: 0.7 });
        },
      },
      {
        title: 'Closest approach',
        say: [
          'Fire one straight at the nucleus and watch its energy.',
          'The repulsion slows it down. Its kinetic energy turns into electric potential energy.',
          'At the closest distance it stops, with all of its energy stored, and then it is pushed straight back.',
        ],
        eq: [{ at: 6, src: 'K = [ 1 | 4 · π · ε _0 ] · [ 2 · Z · e ^2 | r _0 ]' }],
        draw: (g, t) => {
          const path = orbit(0);
          const p = ph(t, 1, 11);
          const idx = Math.min(path.length - 1, Math.floor(p * (path.length - 1)));
          const x = path[idx][0];
          const r = Math.max(1, Math.abs(x));
          const k = 70, cx = 920, cy = 600;
          const PE = 0.5 / r, KE = 0.5 - PE;
          g.line(260, cy, 1560, cy, { alpha: 0.3, dash: [10, 10] });
          g.ball(cx, cy, 16);
          g.text('nucleus', cx, cy + 60, { size: 30, alpha: 0.7 });
          g.line(cx - k, cy - 50, cx - k, cy + 50, { alpha: 0.8, width: 3 });
          g.text('r₀', cx - k, cy - 70, { size: 38, font: 'italic', alpha: 0.9 });
          g.ball(cx + x * k, cy, 13);
          const bx = 1640, by = 900, hb = 380;
          g.line(bx - 40, by, bx + 160, by, { alpha: 0.5 });
          g.rect(bx, by - PE * hb * 2, 90, PE * hb * 2, { fill: 0.4, width: 0 });
          g.rect(bx, by - (PE + KE) * hb * 2, 90, KE * hb * 2, { fill: 0.9, width: 0 });
          g.line(bx - 20, by - hb, bx + 130, by - hb, { alpha: 0.4, dash: [8, 8] });
          g.text('total energy', bx + 45, by - hb - 20, { size: 26, alpha: 0.6 });
          g.text('kinetic', bx + 45, by + 44, { size: 26, alpha: 0.7 * (KE > 0.04 ? 1 : 0.2) });
          g.text('potential', bx + 45, by + 80, { size: 26, alpha: 0.7 });
          g.text(`r = ${r.toFixed(2)} r₀`, 400, 880, { size: 34, font: 'mono', alpha: 0.8 });
        },
      },
      {
        title: 'The colours of hydrogen',
        say: [
          'Hot hydrogen glows, but only at certain colours.',
          'Instead of a smooth rainbow, there are sharp lines. Cool hydrogen takes out exactly the same colours.',
          'The lines obey one simple formula with whole numbers in it.',
        ],
        eq: [{ at: 8, src: '[ 1 | λ ] = R · ( [ 1 | n _f ^2 ] − [ 1 | n _i ^2 ] )' }],
        draw: (g, t) => {
          const x0 = 300, x1 = 1620;
          const xl = (l: number) => x0 + ((l - 380) / 340) * (x1 - x0);
          const lines = [410.2, 434.1, 486.1, 656.3];
          const rows: [number, string, boolean][] = [
            [440, 'continuous', false],
            [600, 'hydrogen emits', true],
            [760, 'hydrogen absorbs', false],
          ];
          rows.forEach(([y, name, emit], r) => {
            const a = ph(t, 0.5 + r * 0.8, 1.5 + r * 0.8);
            g.rect(x0, y, x1 - x0, 90, { alpha: 0.5 * a, width: 2 });
            if (r === 0) for (let i = 0; i < 132; i++) g.rect(x0 + i * 10, y + 1, 10, 88, { fill: (0.3 + 0.2 * Math.sin(i / 20 + 1)) * a, width: 0 });
            if (r === 2) g.rect(x0 + 1, y + 1, x1 - x0 - 2, 88, { fill: 0.5 * a, width: 0 });
            if (r > 0) {
              lines.forEach((l, i) => {
                const on = ph(t, 3 + i * 0.6, 3.6 + i * 0.6);
                if (emit) g.rect(xl(l) - 3, y + 2, 6, 86, { fill: on * (0.8 + 0.2 * Math.sin(TAU * (t * 0.8 + i * 0.3))), width: 0 });
                else {
                  ctxBlack(g, xl(l) - 3, y + 1, 6, 88, on);
                }
              });
            }
            g.text(name, x0, y - 16, { size: 30, alpha: 0.8 * a, align: 'left' });
          });
          const cur = lerp(390, 710, ph(t, 4, 11));
          g.line(xl(cur), 400, xl(cur), 880, { alpha: 0.7, width: 3 });
          g.text(`${cur.toFixed(0)} nm`, xl(cur), 930, { size: 30, font: 'mono', alpha: 0.8 });
          lines.forEach((l) => {
            if (Math.abs(cur - l) < 14) g.text(`${l} nm`, xl(l), 400, { size: 28, font: 'mono', alpha: 0.9 });
          });
        },
      },
      {
        title: "Bohr's orbits",
        say: [
          'Bohr kept the electron in orbit but allowed only certain orbits.',
          'The angular momentum must be a whole number of units of h over two pi.',
          'The result is that the radii grow as n squared, and in these orbits the electron does not radiate.',
        ],
        eq: [
          { at: 4, src: 'm · v · r = n · [ h | 2 · π ]' },
          { at: 10, src: 'r _n = n ^2 · a _0' },
        ],
        draw: (g, t) => {
          const cx = 700, cy = 640, a0 = 28;
          g.ball(cx, cy, 12 + 1.5 * Math.sin(TAU * t));
          [1, 2, 3].forEach((n) => {
            const r = a0 * n * n;
            const a = ph(t, 0.5 + n * 0.7, 1.5 + n * 0.7);
            g.circle(cx, cy, r, { alpha: 0.5 * a, width: 2 });
            const w = TAU / (n * n * n);
            g.ball(cx + r * Math.cos(w * t * 1.6), cy - r * Math.sin(w * t * 1.6), 9, a);
            g.text(`n = ${n}`, cx + r * Math.SQRT1_2 + 14, cy - r * Math.SQRT1_2 - 8, { size: 28, font: 'mono', alpha: 0.8 * a, align: 'left' });
          });
          g.text('r = n² a₀', 1300, 480, { size: 44, font: 'italic', alpha: 0.9 * ph(t, 9, 10.5) });
          g.text('1 : 4 : 9', 1300, 560, { size: 38, font: 'mono', alpha: 0.8 * ph(t, 10, 11.5) });
          g.text('bigger orbit: slower electron', 1300, 650, { size: 32, alpha: 0.7 * ph(t, 11, 12.5) });
        },
      },
      {
        title: 'Energy levels and photons',
        say: [
          'The energy of each orbit is minus 13.6 electron volts over n squared.',
          'These are the rungs of a ladder. The electron can only stand on a rung.',
          'When it jumps down, the lost energy leaves as a single photon. Each jump is one line in the spectrum.',
        ],
        eq: [
          { at: 3, src: 'E _n = − [ 13.6 "eV" | n ^2 ]' },
          { at: 9, src: 'h · ν = E _i − E _f' },
        ],
        draw: (g, t) => {
          const yE = (E: number) => 290 + (-E / 13.6) * 480;
          // label rows: keep the crowded top rungs readable by spreading their labels at least 34 px apart
          const ly: Record<number, number> = {};
          let last = yE(0) + 10;
          [4, 3, 2, 1].forEach((n) => {
            last = Math.max(yE(En(n)) + 10, last + 34);
            ly[n] = last;
          });
          const trans: [number, number][] = [[3, 2], [2, 1], [4, 2], [3, 1]];
          [1, 2, 3, 4, 5, 6].forEach((n) => {
            const a = ph(t, 0.3 + n * 0.25, 1 + n * 0.25);
            g.line(560, yE(En(n)), 1060, yE(En(n)), { alpha: a });
            if (n <= 4) {
              g.text(`n = ${n}`, 530, ly[n], { size: 28, font: 'mono', alpha: 0.8 * a, align: 'right' });
              g.text(`${En(n).toFixed(2).replace('-', '−')} eV`, 1090, ly[n], { size: 28, font: 'mono', alpha: 0.7 * a, align: 'left' });
            }
          });
          g.line(560, yE(0), 1060, yE(0), { alpha: 0.4, dash: [8, 8] });
          g.text('free electron: 0 eV', 1090, yE(0) + 10, { size: 28, font: 'mono', alpha: 0.6, align: 'left' });
          if (t > 7) {
            const slot = 3;
            const u = t - 7;
            const i = Math.floor(u / slot) % trans.length;
            const tau = u % slot;
            const [hi, lo] = trans[i];
            const dE = En(hi) - En(lo);
            const lam = 1240 / dE;
            const ex = 700 + i * 60;
            const jump = ph(tau, 0.4, 1.2);
            const by = lerp(yE(En(hi)), yE(En(lo)), jump);
            g.arrow(ex, yE(En(hi)), ex, yE(En(lo)), { alpha: 0.6, width: 3 });
            g.ball(ex, by, 12);
            if (tau > 1.2) {
              const pp = ph(tau, 1.2, 2.8);
              packet(g, lerp(ex, 1750, pp), (yE(En(hi)) + yE(En(lo))) / 2, clamp(lam / 7, 14, 90), 24, clamp(lam / 7, 14, 90) * 4, -TAU * t * 2, 1 - 0.5 * pp);
            }
            g.text(`${hi} → ${lo}`, 1450, 440, { size: 34, font: 'mono', alpha: 0.85 });
            g.text(`ΔE = ${dE.toFixed(2)} eV`, 1450, 490, { size: 34, font: 'mono', alpha: 0.85 });
            g.text(`λ = ${lam.toFixed(1)} nm`, 1450, 540, { size: 34, font: 'mono', alpha: 0.85 });
          }
        },
      },
      {
        title: 'Waves that fit',
        say: [
          'Why only certain orbits? De Broglie had the answer: the electron is a wave.',
          'A wave going round the nucleus must join up with itself after each lap.',
          'So the circumference holds a whole number of wavelengths. That is exactly Bohr’s rule.',
        ],
        eq: [{ at: 6, src: '2 · π · r = n · λ' }],
        draw: (g, t) => {
          const R = 170, A = 24;
          const draw = (cx: number, cy: number, n: number) => {
            const pts: [number, number][] = [];
            for (let i = 0; i <= 360; i++) {
              const th = (i / 360) * TAU;
              const r = R + A * Math.cos(n * th - TAU * 0.5 * t);
              pts.push([cx + r * Math.cos(th), cy - r * Math.sin(th)]);
            }
            g.path(pts, { width: n === 4 ? 4 : 3, alpha: n === 4 ? 1 : 0.7 });
          };
          const cy = 640;
          g.circle(600, cy, R, { alpha: 0.3, width: 2 });
          g.circle(1320, cy, R, { alpha: 0.3, width: 2 });
          draw(600, cy, 4);
          const on = ph(t, 4, 6);
          if (on > 0) {
            draw(1320, cy, 3.5);
            const r0 = R + A * Math.cos(-TAU * 0.5 * t);
            const r1 = R + A * Math.cos(3.5 * TAU - TAU * 0.5 * t);
            g.ball(1320 + r0, cy, 8, on);
            g.ball(1320 + r1, cy, 8, on);
          }
          g.ball(600, cy, 10);
          g.ball(1320, cy, 10, on);
          g.text('2πr = 4λ: fits', 600, 900, { size: 32, alpha: 0.85 });
          g.text('2πr = 3.5λ: cancels itself', 1320, 900, { size: 32, alpha: 0.85 * on });
        },
      },
    ],
  });

/** Blacks out a rectangle (to cut dark absorption lines out of a bright strip). */
function ctxBlack(g: Gfx, x: number, y: number, w: number, h: number, a: number) {
  g.ctx.save();
  g.ctx.fillStyle = `rgba(0,0,0,${a})`;
  g.ctx.fillRect(x, y, w, h);
  g.ctx.restore();
}
