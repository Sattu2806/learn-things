import { buildChapterFilm, clamp, lerp, ph, TAU, type Gfx } from '../film/engine';

/** Dual nature: photons, the photoelectric equation and matter waves. */

const frac = (x: number) => x - Math.floor(x);

/** A wave packet: a short stretch of wave of wavelength lam centred at (cx, cy). */
function packet(g: Gfx, cx: number, cy: number, lam: number, amp: number, len: number, shift: number, alpha = 1) {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 80; i++) {
    const x = (i / 80 - 0.5) * len;
    const env = Math.exp(-((x / (len * 0.3)) ** 2));
    pts.push([cx + x, cy + amp * env * Math.sin((TAU * x) / lam + shift)]);
  }
  g.path(pts, { alpha, width: 3 });
}

/** Positions across a screen from an interference pattern, made once. */
const HITS: number[] = (() => {
  const out: number[] = [];
  let s = 4242;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  while (out.length < 900) {
    const y = rnd() * 2 - 1;
    if (rnd() < Math.cos(5 * Math.PI * y) ** 2 * Math.exp(-2.2 * y * y)) out.push(y);
  }
  return out;
})();

export const buildFilm = () =>
  buildChapterFilm({
    title: 'Is light a wave or a stream of particles?',
    subtitle: 'The photoelectric effect and matter waves.',
    shots: [
      {
        title: 'A puzzle',
        say: [
          'Shine light on a metal plate, and electrons can be knocked out of it.',
          'Bright red light does nothing at all, however long you wait.',
          'But a faint beam of blue light frees electrons at once.',
          'Brightness is not what matters. The colour is.',
        ],
        eq: [{ at: 10, src: 'ν > ν _0' }],
        draw: (g, t) => {
          const rows: [number, number, number, string][] = [
            [480, 60, 4, 'bright red'],
            [740, 34, 1, 'faint blue'],
          ];
          const px = 1050;
          rows.forEach(([y, lam, n, name], r) => {
            g.line(px, y - 110, px, y + 110, { width: 5 });
            g.text(name, 300, y - 120, { size: 32, alpha: 0.8 });
            const total = n * 3;
            for (let k = 0; k < total; k++) {
              const sp = 640 / total;
              const x = 240 + frac(((t * 160 + k * sp) % 640) / 640) * 640;
              const yy = y + ((k % n) - (n - 1) / 2) * 48;
              packet(g, x, yy, lam, 12, lam * 2.2, -TAU * t * 2, 0.9);
            }
            if (r === 1) {
              for (let k = 0; k < 2; k++) {
                const u = frac(t / 1.8 + k * 0.5);
                g.ball(px + 30 + 520 * u, y - 30 + 60 * k - 40 * u, 11, 1 - u * 0.2);
              }
              g.text('electrons out', 1500, y - 110, { size: 32, alpha: 0.8 * ph(t, 6, 8) });
            } else {
              for (let k = 0; k < 3; k++) {
                const u = frac(t / 1.3 + k / 3);
                g.circle(px, y + (k - 1) * 48, 8 + 36 * u, { alpha: 0.5 * (1 - u), width: 2 });
              }
              g.text('nothing', 1400, y + 10, { size: 36, alpha: 0.8 * ph(t, 3.5, 5) });
            }
          });
        },
      },
      {
        title: 'Light comes in packets',
        say: [
          'Einstein said light arrives in packets of energy called photons.',
          'The energy of each packet depends only on the frequency.',
          'A bluer photon carries more energy than a redder one. More light just means more photons.',
        ],
        eq: [{ at: 5, src: 'E = h · ν' }],
        draw: (g, t) => {
          const lam = lerp(110, 40, 0.5 - 0.5 * Math.cos((TAU * t) / 14));
          const E = 1240 / (lam * 5.5);
          const cx = 700, cy = 600;
          const pts: [number, number][] = [];
          for (let i = 0; i <= 300; i++) {
            const x = (i / 300) * 900;
            pts.push([cx - 450 + x, cy + 70 * Math.sin((TAU * x) / lam - TAU * t * 1.4)]);
          }
          g.path(pts, { width: 3.5 });
          g.line(cx - 450, cy, cx + 450, cy, { alpha: 0.3, dash: [10, 10] });
          const bx = 1500, by = 880, sc = 140;
          g.line(bx - 60, by, bx + 160, by, { alpha: 0.5 });
          g.rect(bx, by - E * sc, 100, E * sc, { fill: 0.85, width: 0 });
          g.text('energy of one photon', bx + 50, by + 50, { size: 28, alpha: 0.7 });
          g.text(`λ = ${(lam * 5.5).toFixed(0)} nm`, 1500, 400, { size: 36, font: 'mono', alpha: 0.8 });
          g.text(`E = ${E.toFixed(2)} eV`, 1500, 460, { size: 36, font: 'mono', alpha: 0.8 });
          g.arrow(cx - 450, 820, cx - 450 + lam, 820, { alpha: 0.7 });
          g.text('λ', cx - 450 + lam + 40, 832, { size: 38, font: 'italic', alpha: 0.8 });
        },
      },
      {
        title: "Einstein's bargain",
        say: [
          'One photon gives all its energy to one electron.',
          'Some of that energy pays to leave the metal. That is the work function.',
          'Whatever is left over is the electron’s kinetic energy.',
          'If the photon has less than the work function, nothing comes out.',
        ],
        eq: [
          { at: 4, src: 'h · ν = φ _0 + K _max' },
          { at: 10, src: 'K _max = h · ν − φ _0' },
        ],
        draw: (g, t) => {
          const nu = lerp(0.7, 2.3, 0.5 - 0.5 * Math.cos((TAU * t) / 16));
          const phi = 1;
          const K = Math.max(0, nu - phi);
          const base = 880, sc = 260;
          const x0 = 520;
          g.line(x0 - 60, base, x0 + 300, base, { alpha: 0.5 });
          g.rect(x0, base - Math.min(nu, phi) * sc, 220, Math.min(nu, phi) * sc, { fill: 0.4, width: 0 });
          if (K > 0) g.rect(x0, base - nu * sc, 220, K * sc, { fill: 0.9, width: 0 });
          g.line(x0 - 20, base - phi * sc, x0 + 240, base - phi * sc, { alpha: 0.6, dash: [10, 8] });
          g.text('φ₀', x0 - 50, base - (phi * sc) / 2 + 12, { size: 38, font: 'italic', align: 'right' });
          if (K > 0) g.text('K', x0 - 50, base - phi * sc - (K * sc) / 2 + 12, { size: 38, font: 'italic', align: 'right' });
          g.text('hν', x0 + 110, base - nu * sc - 20, { size: 38, font: 'italic', alpha: 0.9 });
          const mx = 1100, my = 640;
          g.rect(mx, my, 300, 240, { fill: 0.1, alpha: 0.9 });
          for (let k = 0; k < 6; k++) g.ball(mx + 50 + k * 44 + 10 * Math.sin(TAU * (0.5 * t + k * 0.3)), my + 120 + 50 * Math.cos(TAU * (0.4 * t + k * 0.2)), 8);
          const u = frac(t / 2.4);
          const pk = ph(u, 0, 0.4);
          packet(g, mx + 150 - 240 * (1 - pk), my - 150 * (1 - pk) - 60 * pk, 36, 12, 100, -TAU * t * 2, 1 - ph(u, 0.4, 0.5));
          if (K > 0 && u > 0.4) {
            const e = (u - 0.4) / 0.6;
            g.ball(mx + 300 + 380 * e, my + 40 - 150 * e, 14, 1 - 0.3 * e);
            g.arrow(mx + 300 + 380 * e + 24, my + 40 - 150 * e - 6, mx + 300 + 380 * e + 24 + 40 + 120 * K, my + 40 - 150 * e - 6 - 18 * K, { alpha: 0.7 });
          } else if (K === 0 && u > 0.4) {
            g.circle(mx + 150, my, 20 + 60 * (u - 0.4), { alpha: 0.5 * (1 - (u - 0.4) / 0.6), width: 2 });
          }
          g.text(K > 0 ? 'electron escapes' : 'photon too weak: nothing', 1300, 960, { size: 32, alpha: 0.75 });
        },
      },
      {
        title: 'The stopping potential',
        say: [
          'To measure the leftover energy, push the electrons back with a voltage.',
          'The voltage that just stops the fastest one is the stopping potential.',
          'Plot it against frequency and you get a straight line. Its slope is h over e, the same for every metal.',
        ],
        eq: [
          { at: 3, src: 'e · V _0 = K _max' },
          { at: 8, src: 'V _0 = [ h | e ] · ν − [ φ _0 | e ]' },
        ],
        draw: (g, t) => {
          const ox = 600, oy = 800, gw = 880, gh = 420;
          g.axes(ox, oy, gw, gh, { x: 'ν', y: 'V₀', alpha: 0.6, down: 90 });
          const dr = ph(t, 1.5, 6);
          const s = 0.6;
          const nu1 = 160, nu2 = 300;
          ([[nu1, 1], [nu2, 0.45]] as const).forEach(([n0, a], i) => {
            const len = (gw - n0 - 40) * dr;
            g.line(ox + n0, oy, ox + n0 + len, oy - len * s, { alpha: a, width: 4 });
            g.line(ox + n0, oy, ox, oy + n0 * s, { alpha: 0.3 * a, dash: [10, 10], width: 2 });
            g.text(i ? 'ν₀ (metal 2)' : 'ν₀ (metal 1)', ox + n0, oy + 44, { size: 26, alpha: 0.7 * dr });
          });
          const tr = ph(t, 8, 10);
          const xa = ox + 480, xb = ox + 700;
          g.line(xa, oy - (480 - nu1) * s, xb, oy - (480 - nu1) * s, { alpha: tr, width: 3 });
          g.line(xb, oy - (480 - nu1) * s, xb, oy - (700 - nu1) * s, { alpha: tr, width: 3 });
          g.text('Δν', (xa + xb) / 2, oy - (480 - nu1) * s + 40, { size: 34, font: 'italic', alpha: tr });
          g.text('ΔV₀', xb + 26, oy - (590 - nu1) * s + 10, { size: 34, font: 'italic', alpha: tr, align: 'left' });
          g.text('slope = h / e', ox + 400, oy - 320, { size: 38, font: 'italic', alpha: tr });
          const x = ox + nu1 + (gw - nu1 - 80) * (0.5 - 0.5 * Math.cos(TAU * t / 10));
          g.ball(x, oy - (x - ox - nu1) * s, 11, dr);
        },
      },
      {
        title: 'Matter waves',
        say: [
          'If light waves can act like particles, can particles act like waves?',
          'De Broglie said yes: every particle has a wavelength, Planck’s constant divided by its momentum.',
          'A faster particle has more momentum and a shorter wave.',
        ],
        eq: [{ at: 6, src: 'λ = [ h | p ]' }],
        draw: (g, t) => {
          const rows: [number, number, string][] = [
            [440, 1, 'speed v'],
            [620, 2, 'speed 2v'],
            [800, 4, 'speed 4v'],
          ];
          rows.forEach(([y, m, name]) => {
            const cx = 360 + ((90 * m * t) % 1000);
            g.line(240, y, 1700, y, { alpha: 0.25, dash: [10, 10] });
            const pts: [number, number][] = [];
            for (let i = 0; i <= 200; i++) {
              const dx = (i / 200 - 0.5) * 420;
              const env = Math.exp(-((dx / 120) ** 2));
              pts.push([cx + dx, y - 56 * env * Math.cos((TAU * dx) / (170 / m))]);
            }
            g.path(pts, { width: 3 });
            g.ball(cx, y, 12);
            g.text(name, 1760, y + 10, { size: 30, alpha: 0.7, align: 'left' });
            g.text(m === 1 ? 'λ' : `λ / ${m}`, 160, y + 10, { size: 36, font: 'italic', alpha: 0.8 * ph(t, 4, 6) });
          });
        },
      },
      {
        title: 'Seeing electron waves',
        say: [
          'Fire electrons through two slits one at a time.',
          'Each one lands as a single dot, in what looks like a random place.',
          'But slowly the dots build up bright and dark fringes, just like light waves.',
          'The wave tells us where each electron is likely to land.',
        ],
        eq: [{ at: 5, src: 'λ = [ 1.227 | √[ V ] ] "nm"' }],
        draw: (g, t) => {
          const n = Math.floor(HITS.length * clamp((t - 2) / 14));
          const sx = 560, scr = 1160, ym = 640;
          g.line(sx, 360, sx, ym - 44, { width: 4 });
          g.line(sx, ym - 24, sx, ym + 24, { width: 4 });
          g.line(sx, ym + 44, sx, 900, { width: 4 });
          g.arrow(240, ym, sx - 30, ym, { alpha: 0.5 });
          const f = frac(t * 3);
          g.ball(240 + f * (sx - 280), ym, 8);
          g.line(scr, 340, scr, 920, { alpha: 0.5 });
          for (let i = 0; i < n; i++) g.circle(scr + 30 + 5 * (i % 3), ym + HITS[i] * 250, 3.2, { fill: 1, alpha: 0.9, width: 0 });
          if (n > 0) {
            const last = ym + HITS[n - 1] * 250;
            g.ball(sx + f * (scr - sx), ym + f * (last - ym), 8, 1 - f * 0.3);
          }
          g.text(`${n} electrons`, 1500, 400, { size: 34, font: 'mono', alpha: 0.8 });
        },
      },
    ],
  });
