import { buildChapterFilm, ph, type Gfx } from '../film/engine';

/** Electromagnetic waves: the missing current, fields that make each other, the wave, its speed and the spectrum. */

const TAU = Math.PI * 2;
const Y = 620;

/** The wave drawn as in the notes: E up and down, B on a slant. */
function wave(g: Gfx, t: number, x0: number, x1: number, y0: number, lam: number, a = 1, withB = true) {
  const k = TAU / lam;
  const om = 2.2;
  const E = 130 * a;
  const bx = -0.62;
  const by = 0.46;
  const ph0 = (x: number) => k * (x - x0) - om * t;
  for (let x = x0; x <= x1; x += lam / 10) {
    const s = Math.sin(ph0(x));
    g.arrow(x, y0, x, y0 - E * s, { alpha: 0.35 * a, width: 2, head: 14 });
    if (withB) g.arrow(x, y0, x + bx * E * 0.9 * s, y0 + by * E * 0.9 * s, { alpha: 0.35 * a, width: 2, head: 14 });
  }
  g.curve((x) => y0 - E * Math.sin(ph0(x)), x0, x1, { width: 4, n: 400, alpha: a });
  if (withB) {
    const pts: [number, number][] = [];
    for (let x = x0; x <= x1; x += 4) {
      const s = Math.sin(ph0(x));
      pts.push([x + bx * E * 0.9 * s, y0 + by * E * 0.9 * s]);
    }
    g.path(pts, { width: 3, alpha: 0.6 * a, dash: [12, 10] });
  }
}

export const buildFilm = () =>
  buildChapterFilm({
    title: 'How can light cross empty space?',
    subtitle: 'Maxwell and the electromagnetic wave.',
    shots: [
      {
        title: 'The missing current',
        say: [
          'Charge a capacitor, and a current runs in the wire up to the plate.',
          'But in the gap between the plates there are no charges to carry it.',
          'Yet the electric field there is growing, and Maxwell saw that a changing electric field acts like a current.',
        ],
        eq: [
          { at: 5, src: 'Φ _E = [ q | ε _0 ]' },
          { at: 9, src: 'I _d = ε _0 · [ dΦ _E | dt ]' },
        ],
        draw: (g, t) => {
          const q = 1 - Math.exp(-Math.min(t, 10) / 3);
          const lp = 800;
          const rp = 1000;
          g.line(280, Y, lp, Y, { width: 4 });
          g.line(rp, Y, 1620, Y, { width: 4 });
          g.line(lp, Y - 150, lp, Y + 150, { width: 5 });
          g.line(rp, Y - 150, rp, Y + 150, { width: 5 });
          for (let k = 0; k < 9; k++) {
            const s = (k / 9 + 0.8 * q) % 1;
            g.ball(280 + s * 500, Y, 7);
            g.ball(1020 + s * 580, Y, 7);
          }
          for (let dy = -100; dy <= 100; dy += 50) g.arrow(lp + 12, Y + dy, lp + 12 + 160 * q + 10, Y + dy, { alpha: 0.5, width: 3 });
          const d = ph(t, 4, 6);
          g.line(lp + 12, Y, rp - 12, Y, { alpha: d, width: 4, dash: [12, 12] });
          g.text('I', 540, Y - 50, { size: 42, font: 'italic' });
          g.text('I_d', 900, Y + 210, { size: 42, font: 'italic', alpha: d });
          g.text('no charge crosses here', 900, Y - 210, { size: 30, alpha: 0.6 });
        },
      },
      {
        title: 'Fields that make each other',
        say: [
          'A changing magnetic field makes an electric field. That is Faraday.',
          'A changing electric field makes a magnetic field. That is Maxwell.',
          'So each field keeps making the other, and the pattern carries itself along.',
        ],
        eq: [{ at: 6, src: 'ε = − [ dΦ _B | dt ]' }],
        draw: (g, t) => {
          const om = 1.6;
          const gx = 380;
          [['E', 560], ['B', 800]].forEach(([name, y], k) => {
            const yy = y as number;
            g.line(gx, yy - 100, gx, yy + 100, { alpha: 0.4, width: 2 });
            g.line(gx, yy, gx + 1100, yy, { alpha: 0.4, width: 2 });
            const pts: [number, number][] = [];
            for (let u = 0; u <= 4.6; u += 0.04) pts.push([gx + u * 230, yy - 80 * Math.sin(om * (t - u))]);
            g.path(pts, { width: 4, alpha: k ? 0.6 : 1, dash: k ? [12, 10] : undefined });
            g.ball(gx, yy - 80 * Math.sin(om * t), 13);
            g.text(name as string, gx - 50, yy + 12, { size: 44, font: 'italic' });
          });
          g.arrow(1650, 600, 1650, 760, { alpha: 0.2 + 0.8 * Math.abs(Math.cos(om * t)), width: 4 });
          g.arrow(1730, 760, 1730, 600, { alpha: 0.2 + 0.8 * Math.abs(Math.sin(om * t)), width: 4 });
        },
      },
      {
        title: 'The wave',
        say: [
          'The result is a transverse wave. The electric and magnetic fields are perpendicular to each other and to the direction of travel.',
          'They rise and fall together, and nothing material is shaking, so no medium is needed.',
        ],
        eq: [{ at: 4, src: 'E _y = E _0 · sin ( k · x − ω · t )' }],
        draw: (g, t) => {
          const a = ph(t, 0.3, 2);
          g.arrow(240, Y + 20, 1700, Y + 20, { alpha: 0.4 * a, width: 2 });
          wave(g, t, 260, 1680, Y + 20, 320, a);
          g.text('E', 300, Y - 160, { size: 44, font: 'italic', alpha: ph(t, 3, 4) });
          g.text('B', 250, Y + 140, { size: 44, font: 'italic', alpha: ph(t, 3, 4) * 0.7 });
        },
      },
      {
        title: 'The speed',
        say: [
          'Put the wave into the two laws, and its speed is fixed by two constants of electricity and magnetism.',
          'Out comes three hundred million metres per second. That is the speed of light.',
          'Maxwell concluded that light is an electromagnetic wave.',
        ],
        eq: [
          { at: 3, src: 'k · E _0 = ω · B _0' },
          { at: 6, src: 'k · B _0 = μ _0 · ε _0 · ω · E _0' },
          { at: 9, src: 'c = [ 1 | √[ μ _0 · ε _0 ] ] = 3 × 10 ^8 "m/s"' },
        ],
        draw: (g, t) => {
          const ex = 360;
          const mx = 1560;
          g.circle(ex, Y, 80, { fill: 0.12 });
          g.circle(mx, Y, 26, { fill: 0.12 });
          g.text('Earth', ex, Y + 150, { size: 30, alpha: 0.6 });
          g.text('Moon', mx, Y + 100, { size: 30, alpha: 0.6 });
          const p = (t % 4) / 2.6;
          const x = ex + 90 + Math.min(1, p) * (mx - ex - 130);
          g.line(ex + 90, Y, mx - 40, Y, { alpha: 0.25, dash: [10, 12], width: 2 });
          g.ball(x, Y, 14);
          g.text(`${(Math.min(1, p) * 1.28).toFixed(2)} s`, 960, Y - 120, { size: 48, font: 'mono', alpha: 0.8 });
          g.text('light reaches the Moon in about 1.3 seconds', 960, Y - 60, { size: 30, alpha: 0.6 });
        },
      },
      {
        title: 'Wavelength and frequency',
        say: [
          'Every electromagnetic wave travels at the same speed in vacuum.',
          'So the shorter the wavelength, the higher the frequency.',
        ],
        eq: [{ at: 3, src: 'c = f · λ' }],
        draw: (g, t) => {
          const c = 200;
          [320, 160, 80].forEach((lam, k) => {
            const y = 480 + k * 170;
            const x0 = 300;
            const x1 = 1560;
            g.line(x0, y, x1, y, { alpha: 0.25, width: 2 });
            g.curve((x) => y - 55 * Math.sin((TAU / lam) * (x - x0 - c * t)), x0, x1, { width: 4, n: 500 });
            g.ball(1400, y - 55 * Math.sin((TAU / lam) * (1400 - x0 - c * t)), 12);
            g.text(['λ', 'λ / 2', 'λ / 4'][k], 200, y + 10, { size: 40, font: 'italic', alpha: 0.8 });
            g.text(['f', '2f', '4f'][k], 1700, y + 10, { size: 40, font: 'italic', alpha: 0.8 * ph(t, 2 + k * 0.5, 3 + k * 0.5) });
          });
          g.line(1400, 400, 1400, 900, { alpha: 0.3, dash: [8, 10], width: 2 });
        },
      },
      {
        title: 'The spectrum',
        say: [
          'Radio, microwaves, infrared, light, ultraviolet, X-rays and gamma rays are all the same wave.',
          'They differ only in wavelength, and in how we make and detect them.',
          'Visible light is a thin slice in the middle of a spectrum that spans twenty orders of magnitude.',
        ],
        draw: (g, t) => {
          const x0 = 160;
          const x1 = 1760;
          const y = 640;
          const names = ['gamma', 'X-ray', 'UV', 'light', 'infrared', 'microwave', 'radio'];
          const edges = [-12, -11, -8, -6.4, -6.15, -3, -1, 3];
          const px = (l: number) => x0 + ((l + 12) / 15) * (x1 - x0);
          const a = ph(t, 0.3, 2);
          g.line(x0, y, x0 + (x1 - x0) * a, y, { width: 4 });
          names.forEach((n, i) => {
            const b = ph(t, 1 + i * 0.5, 1.6 + i * 0.5);
            g.line(px(edges[i]), y - 24, px(edges[i]), y + 24, { alpha: 0.6 * b, width: 3 });
            const mid = i === 3 ? px(-6.275) : (px(edges[i]) + px(edges[i + 1])) / 2;
            g.text(n, mid, y + 70 + (i === 3 ? 40 : 0), { size: 30, alpha: b * 0.85 });
          });
          g.rect(px(-6.4), y - 12, px(-6.15) - px(-6.4), 24, { fill: 1, width: 0, alpha: ph(t, 5, 6) });
          const sw = ph(t, 6, 14);
          const s = -11.5 + 14 * sw;
          const cyc = 9 - 8 * ((s + 12) / 15);
          const wx = px(s);
          const pts: [number, number][] = [];
          for (let u = 0; u <= 200; u += 2) pts.push([wx - 100 + u, y - 170 - 55 * Math.sin(TAU * cyc * (u / 200))]);
          g.path(pts, { width: 4, alpha: ph(t, 6, 7) });
          g.ball(wx, y, 11, ph(t, 6, 7));
        },
      },
    ],
  });
