import { buildChapterFilm, clamp, lerp, ph, TAU, type Gfx } from '../film/engine';

/** Wave optics: Huygens, refraction, interference, diffraction and polarisation. */

const DEG = Math.PI / 180;
type Pt = [number, number];

const frac = (x: number) => x - Math.floor(x);
const sinc2 = (x: number) => (Math.abs(x) < 1e-6 ? 1 : (Math.sin(x) / x) ** 2);

/** Wavefronts of a beam hitting a horizontal surface at y0 between ax and bx, clipped to y in [lo, hi]. */
function beam(g: Gfx, ax: number, bx: number, y0: number, d: Pt, lam: number, f: number, lo: number, hi: number, alpha = 1) {
  for (let k = -50; k <= 50; k++) {
    const s = lam * (k + f);
    const ta = s - ax * d[0];
    const tb = s - bx * d[0];
    const P: Pt = [ax + d[0] * ta, y0 + d[1] * ta];
    const Q: Pt = [bx + d[0] * tb, y0 + d[1] * tb];
    const dy = Q[1] - P[1];
    let qa = 0;
    let qb = 1;
    if (Math.abs(dy) < 1e-6) {
      if (P[1] < lo || P[1] > hi) continue;
    } else {
      const q1 = (lo - P[1]) / dy;
      const q2 = (hi - P[1]) / dy;
      qa = Math.max(0, Math.min(q1, q2));
      qb = Math.min(1, Math.max(q1, q2));
      if (qa >= qb) continue;
    }
    g.line(P[0] + qa * (Q[0] - P[0]), P[1] + qa * dy, P[0] + qb * (Q[0] - P[0]), P[1] + qb * dy, { alpha, width: 3 });
  }
}

export const buildFilm = () =>
  buildChapterFilm({
    title: 'How can light plus light make darkness?',
    subtitle: 'Wave optics in six pictures.',
    shots: [
      {
        title: "Huygens' wavelets",
        say: [
          'Light is a wave, and a wave moves forward in a simple way.',
          'Every point on a wavefront sends out its own little wavelets.',
          'The new wavefront is the line that touches all of them.',
        ],
        eq: [{ at: 8, src: 'v = ν · λ' }],
        draw: (g, t) => {
          const x0 = 700;
          const r = 230 * ph(t, 3, 9);
          const ys: number[] = [];
          for (let y = 380; y <= 840; y += 40) ys.push(y);
          g.line(x0, 360, x0, 860, { alpha: 0.5, dash: [10, 10] });
          ys.forEach((y, i) => {
            const pts: [number, number][] = [];
            for (let k = 0; k <= 30; k++) {
              const u = -Math.PI / 2 + (k / 30) * Math.PI;
              pts.push([x0 + r * Math.cos(u), y + r * Math.sin(u)]);
            }
            g.path(pts, { alpha: 0.35, width: 2 });
            g.ball(x0, y, 8 + 2 * Math.sin(TAU * t + i), clamp(ph(t, 1, 2)));
          });
          g.line(x0 + r, 380, x0 + r, 840, { alpha: ph(t, 3.2, 4.5), width: 4 });
          g.text('wavefront now', x0, 340, { size: 30, alpha: 0.7 * ph(t, 1, 2) });
          g.text('wavefront later', x0 + r, 900, { size: 30, alpha: 0.7 * ph(t, 7, 8.5) });
          const rays = ph(t, 9, 11);
          for (let k = 0; k < 3; k++) {
            const y = 480 + k * 140;
            g.arrow(x0 + r + 40, y, x0 + r + 40 + 200 * rays, y, { alpha: rays * 0.8 });
          }
          g.text('rays', 1480, 560, { size: 32, font: 'italic', alpha: rays * 0.8 });
        },
      },
      {
        title: 'Why light bends',
        say: [
          'When the wave enters glass, it slows down.',
          'The wavefronts bunch closer together, and the beam turns toward the normal.',
          'The refractive index is how many times slower the light travels.',
          'Snell’s law ties the angles to the indices.',
        ],
        eq: [
          { at: 7, src: 'n = [ c | v ]' },
          { at: 11, src: 'n _1 · sin i = n _2 · sin r' },
        ],
        draw: (g, t) => {
          const y0 = 620;
          const a = 40 * DEG;
          const n2 = 1.5;
          const rr = Math.asin(Math.sin(a) / n2);
          const lam1 = 80;
          const lam2 = lam1 / n2;
          const f = t * 0.45;
          const xa = 800, xb = 1040, xc = 920;
          const d1: Pt = [Math.sin(a), Math.cos(a)];
          const d2: Pt = [Math.sin(rr), Math.cos(rr)];
          g.rect(0, y0, 1920, 1080 - y0, { fill: 0.07, alpha: 1, width: 0 });
          g.line(300, y0, 1620, y0, { width: 4 });
          g.line(xc, y0 - 300, xc, y0 + 260, { alpha: 0.4, dash: [10, 10] });
          beam(g, xa, xb, y0, d1, lam1, f, 320, y0);
          beam(g, xa, xb, y0, d2, lam2, f, y0, 900);
          const w = ph(t, 3, 5);
          g.text('air', 400, 420, { size: 36, alpha: 0.8 });
          g.text('glass', 400, 760, { size: 36, alpha: 0.8 });
          g.text('fronts far apart: fast', 1350, 420, { size: 32, alpha: 0.7 * w });
          g.text('fronts close: slow', 1350, 760, { size: 32, alpha: 0.7 * w });
          const run = 260;
          const v1 = lam1 * 0.45;
          const tin = run / v1;
          const u = t % 8;
          const dot: Pt = u < tin ? [xc - d1[0] * (run - v1 * u), y0 - d1[1] * (run - v1 * u)] : [xc + d2[0] * (v1 / n2) * (u - tin), y0 + d2[1] * (v1 / n2) * (u - tin)];
          g.ball(dot[0], dot[1], 12);
          g.text('i', xc - 70, y0 - 150, { size: 40, font: 'italic', alpha: 0.7 * ph(t, 9, 10) });
          g.text('r', xc + 40, y0 + 130, { size: 40, font: 'italic', alpha: 0.7 * ph(t, 9, 10) });
        },
      },
      {
        title: 'Two sources',
        say: [
          'Now take two sources that stay in step.',
          'Where a crest from one meets a crest from the other, the wave doubles. Where crest meets trough, it cancels.',
          'The meeting points lie along straight lines. The path difference is a whole number of wavelengths on each bright line.',
        ],
        eq: [{ at: 9, src: 'Δ = n · λ' }],
        draw: (g, t) => {
          const lam = 46;
          const x0 = 380, y1 = 470, y2 = 710, D = y2 - y1;
          const f = t * 0.7;
          const a = ph(t, 0.5, 2);
          for (let k = 0; k < 28; k++) {
            const ra = lam * (k + frac(f));
            if (ra < 20) continue;
            g.circle(x0, y1, ra, { alpha: 0.2 * a, width: 2 });
            g.circle(x0, y2, ra, { alpha: 0.2 * a, width: 2 });
          }
          if (t > 3) {
            const sh = ph(t, 3, 4.5);
            for (let k = 0; k < 28; k++) {
              const ra = lam * (k + frac(f));
              for (let j = Math.max(0, k - 4); j <= k + 4; j++) {
                const rb = lam * (j + frac(f));
                if (ra < 10 || rb < 10) continue;
                const aa = (ra * ra - rb * rb + D * D) / (2 * D);
                const h2 = ra * ra - aa * aa;
                if (h2 <= 0) continue;
                const px = x0 + Math.sqrt(h2);
                if (px < 1850) g.circle(px, y1 + aa, 4.5, { fill: 1, alpha: sh, width: 0 });
              }
            }
          }
          const my = (y1 + y2) / 2;
          if (t > 6.5) {
            const sh = ph(t, 6.5, 8);
            for (const n of [-2, -1, 0, 1, 2]) {
              const th = Math.asin((n * lam) / D);
              g.line(x0, my, x0 + 1500 * Math.cos(th), my + 1500 * Math.sin(th), { alpha: 0.35 * sh, dash: [10, 12] });
              g.text(`n = ${n}`, 1850, my + 1470 * Math.tan(th) + 8, { size: 28, font: 'mono', alpha: 0.7 * sh, align: 'right' });
            }
          }
          g.ball(x0, y1, 12 + 2 * Math.sin(TAU * f), a);
          g.ball(x0, y2, 12 + 2 * Math.sin(TAU * f), a);
          g.text('S₁', x0 - 40, y1 + 10, { size: 34, font: 'italic', alpha: 0.8 });
          g.text('S₂', x0 - 40, y2 + 10, { size: 34, font: 'italic', alpha: 0.8 });
        },
      },
      {
        title: "Young's fringes",
        say: [
          'Send light through two close slits onto a distant screen.',
          'At a point P, one path is longer than the other by a small amount delta.',
          'That path difference is the slit separation times y over D.',
          'Whole wavelengths of path difference make bright fringes, which are spaced by lambda D over d.',
        ],
        eq: [
          { at: 5, src: 'Δ ≈ [ y · d | D ]' },
          { at: 9, src: 'Δ = n · λ' },
          { at: 12, src: 'β = [ λ · D | d ]' },
        ],
        draw: (g, t) => {
          const x1 = 450, d = 110, screen = 1250, ym = 600, lam = 32;
          const yS1 = ym - d / 2, yS2 = ym + d / 2;
          const yP = ym + 220 * Math.sin((TAU * t) / 14);
          const r1 = Math.hypot(screen - x1, yP - yS1);
          const r2 = Math.hypot(screen - x1, yP - yS2);
          const dl = r2 - r1;
          g.line(x1, 330, x1, yS1 - 10, { width: 4 });
          g.line(x1, yS1 + 10, x1, yS2 - 10, { width: 4 });
          g.line(x1, yS2 + 10, x1, 880, { width: 4 });
          g.line(screen, 330, screen, 880, { alpha: 0.5 });
          g.line(x1, yS1, screen, yP, { alpha: 0.9 });
          g.line(x1, yS2, screen, yP, { alpha: 0.6 });
          const u: Pt = [(x1 - screen) / r2, (yS2 - yP) / r2];
          g.line(x1, yS2, screen + u[0] * r1, yP + u[1] * r1, { width: 6 });
          g.text('Δ', x1 + 60, yS2 + 42, { size: 40, font: 'italic', alpha: 0.9 * ph(t, 3, 4) });
          g.ball(screen, yP, 12);
          g.ball(x1, yS1, 7);
          g.ball(x1, yS2, 7);
          g.text('d', x1 - 40, ym + 10, { size: 34, font: 'italic', alpha: 0.8 });
          g.text('D', (x1 + screen) / 2, 910, { size: 34, font: 'italic', alpha: 0.7 });
          const pts: [number, number][] = [];
          for (let y = 330; y <= 880; y += 4) {
            const l1 = Math.hypot(screen - x1, y - yS1);
            const l2 = Math.hypot(screen - x1, y - yS2);
            pts.push([screen + 60 + 300 * Math.cos((Math.PI * (l2 - l1)) / lam) ** 2, y]);
          }
          g.path(pts, { alpha: ph(t, 6, 8), width: 3 });
          const I = Math.cos((Math.PI * dl) / lam) ** 2;
          g.ball(screen + 60 + 300 * I, yP, 9, ph(t, 6, 8));
          g.text(`Δ = ${(dl / lam).toFixed(2)} λ`, 1560, 380, { size: 34, font: 'mono', alpha: 0.8 * ph(t, 3, 4) });
          g.text('screen intensity', screen + 210, 330, { size: 28, alpha: 0.6 * ph(t, 6, 8) });
        },
      },
      {
        title: 'One slit spreads light',
        say: [
          'Even a single slit makes a pattern, because every point of the slit is a source.',
          'Split the slit in two halves: in the first dark direction, each pair of points cancels.',
          'The narrower the slit, the wider the spread.',
        ],
        eq: [{ at: 5, src: 'a · sin θ = λ' }],
        draw: (g, t) => {
          const sw = ph(t, 7, 10) - ph(t, 12, 15);
          const a = lerp(90, 200, sw);
          const Wd = (90 * 330) / a / 1;
          const cy = 600;
          g.line(520, 340, 520, cy - a / 2, { width: 4 });
          g.line(520, cy + a / 2, 520, 860, { width: 4 });
          for (let k = 0; k < 3; k++) {
            const x = 340 + ((t * 80 + k * 70) % 200);
            g.arrow(x, cy - 40 + k * 40, x + 60, cy - 40 + k * 40, { alpha: 0.6 });
          }
          g.text('slit width a', 520, 300, { size: 32, alpha: 0.8 });
          const gx = 1350;
          g.arrow(gx - 380, 880, gx + 380, 880, { alpha: 0.5, width: 2 });
          const pts: [number, number][] = [];
          for (let k = 0; k <= 300; k++) {
            const x = gx - 360 + k * 2.4;
            pts.push([x, 860 - 380 * sinc2((Math.PI * (x - gx)) / Wd)]);
          }
          g.path(pts, { alpha: ph(t, 2, 4), width: 3.5 });
          g.line(gx - Wd, 800, gx + Wd, 800, { alpha: ph(t, 3, 5), width: 4 });
          g.text('2λD / a', gx, 770, { size: 34, font: 'italic', alpha: 0.9 * ph(t, 3, 5) });
          g.text('wider slit', 520, 920, { size: 30, alpha: 0.6 * sw });
          g.text('narrower pattern', gx, 940, { size: 30, alpha: 0.6 * sw });
          g.ball(gx + 330 * Math.sin(TAU * t / 8), 860 - 380 * sinc2((Math.PI * 330 * Math.sin(TAU * t / 8)) / Wd), 9);
        },
      },
      {
        title: 'Polarisation',
        say: [
          'Light wobbles across its direction of travel, and a polaroid keeps only one direction of wobble.',
          'A second polaroid, turned by an angle, lets through only the part of the wobble along its own axis.',
          'So the intensity falls as cosine squared of the angle, and crossed polaroids block everything.',
        ],
        eq: [{ at: 8, src: 'I = I _0 · cos ^2 θ' }],
        draw: (g, t) => {
          const cx = 560, cy = 620, R = 230;
          const th = Math.PI * ph(t, 4, 14);
          const pass: Pt = [Math.cos(th), -Math.sin(th)];
          const osc = 0.65 + 0.35 * Math.cos(TAU * 1.5 * t);
          g.circle(cx, cy, R, { alpha: 0.4, width: 2 });
          g.line(cx - R * pass[0], cy - R * pass[1], cx + R * pass[0], cy + R * pass[1], { alpha: 0.5, dash: [12, 10] });
          g.arrow(cx, cy, cx, cy - 0.9 * R * osc, { alpha: 0.6 });
          const proj = Math.cos(th) * 0.9 * R * osc;
          g.line(cx, cy - 0.9 * R * osc, cx + proj * pass[0], cy + proj * pass[1], { alpha: 0.35, dash: [8, 8] });
          g.arrow(cx, cy, cx + proj * pass[0], cy + proj * pass[1], { width: 5 });
          g.text('E₀ (after the first polaroid)', cx, cy + R + 60, { size: 30, alpha: 0.7 });
          g.text('second polaroid axis', cx + R * pass[0] + 20, cy - R * pass[1] - 24, { size: 26, alpha: 0.6, align: 'left' });
          const gx = 1080, gw = 620, gy = 800, gh = 360;
          g.axes(gx, gy, gw, gh + 20, { x: 'θ', y: 'I', alpha: 0.6 });
          const pts: [number, number][] = [];
          for (let k = 0; k <= 100; k++) pts.push([gx + (k / 100) * (gw - 40), gy - gh * Math.cos((k / 100) * Math.PI) ** 2]);
          g.path(pts, { alpha: 0.7 * ph(t, 2, 4), width: 3 });
          g.ball(gx + (th / Math.PI) * (gw - 40), gy - gh * Math.cos(th) ** 2, 12, ph(t, 2, 4));
          g.text(`θ = ${Math.round(th / DEG)}°`, gx + gw - 40, 460, { size: 34, font: 'mono', alpha: 0.8, align: 'right' });
          g.text(`I = ${(Math.cos(th) ** 2).toFixed(2)} I₀`, gx + gw - 40, 510, { size: 34, font: 'mono', alpha: 0.8, align: 'right' });
        },
      },
    ],
  });
