import { buildChapterFilm, clamp, lerp, ph, TAU } from '../film/engine';

/** Units and measurement: number and unit, base units, digits, dimensions and orders of magnitude. */

const SUPS: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const pw = (n: number) => `10${[...String(n)].map((c) => SUPS[c]).join('')}`;

export const buildFilm = () =>
  buildChapterFilm({
    title: 'How do we say how much?',
    subtitle: 'Units, digits and dimensions.',
    shots: [
      {
        title: 'A number and a unit',
        say: [
          'To measure something is to compare it with a standard, which we call a unit.',
          'The answer is a number of those units. A number on its own means nothing.',
          'Change the unit and the number changes, but the length of the bar does not.',
        ],
        eq: [
          { at: 2, src: 'Q = n · u' },
          { at: 8, src: '1.2 "m" = 120 "cm" = 1200 "mm"' },
        ],
        draw: (g, t) => {
          const x0 = 420, len = 1080, y = 600;
          g.rect(x0, y - 24, len, 48, { alpha: 0.7, fill: 0.15 });
          g.line(x0, y - 60, x0, y + 60, { alpha: 0.9 });
          g.line(x0 + len, y - 60, x0 + len, y + 60, { alpha: 0.9 });
          const units = [
            { name: 'm', size: 900, n: 1.2 },
            { name: 'dm', size: 90, n: 12 },
            { name: 'cm', size: 9, n: 120 },
          ];
          const k = Math.min(2, Math.max(0, Math.floor((t - 1.5) / 3.5)));
          const u = units[k];
          const p = ph(t - 3.5 * k, 1.8, 4.2);
          const reach = len * (t < 1.5 ? 0 : p);
          g.rect(x0, y - 24, reach, 48, { alpha: 0.9, fill: 0.7 });
          for (let x = 0; x <= len + 0.1; x += u.size) g.line(x0 + x, y + 36, x0 + x, y + 36 + (u.size < 20 ? 18 : 40), { alpha: x <= reach ? 0.9 : 0.3, width: 2 });
          const shown = k === 0 ? (u.n * p).toFixed(1) : String(Math.floor(u.n * p + 1e-9));
          g.text(`${t < 1.5 ? '' : shown} ${t < 1.5 ? '' : u.name}`, 960, 790, { size: 90, font: 'serif', alpha: 0.95 });
          g.text('the bar itself never changes', 960, 470, { size: 34, alpha: 0.6 });
        },
      },
      {
        title: 'Base and derived units',
        say: [
          'Seven base units are enough to build everything else: the metre, kilogram, second, ampere, kelvin, mole and candela.',
          'Multiply and divide them and you get derived units.',
          'A newton is a kilogram metre per second squared, and a joule is a newton times a metre.',
        ],
        eq: [
          { at: 4, src: '"N" = "kg" · "m" · "s" ^−2' },
          { at: 9, src: '"J" = "N" · "m"' },
        ],
        draw: (g, t) => {
          const base = ['m', 'kg', 's', 'A', 'K', 'mol', 'cd'];
          const bx = (i: number) => 330 + i * 210;
          const by = 470;
          base.forEach((b, i) => {
            const a = ph(t, 0.5 + i * 0.35, 1.2 + i * 0.35);
            const pulse = i < 3 ? 1 + 0.08 * Math.sin(TAU * t * 1.2 + i) * ph(t, 4, 5) : 1;
            g.circle(bx(i), by, 48 * pulse, { alpha: a, width: 3, fill: i < 3 ? 0.14 : 0.06 });
            g.text(b, bx(i), by + 14, { size: 44, font: 'italic', alpha: a });
          });
          const der = [
            { name: 'm/s', x: 430, from: [0, 2] },
            { name: 'N', x: 960, from: [0, 1, 2] },
            { name: 'J', x: 1490, from: [0, 1, 2] },
          ];
          der.forEach((d, k) => {
            const a = ph(t, 3 + k * 2.5, 4 + k * 2.5);
            const y = 770;
            d.from.forEach((s) => {
              const f = (t * 0.5 + s * 0.2) % 1;
              g.line(bx(s), by + 50, d.x, y - 50, { alpha: 0.35 * a, dash: [10, 10] });
              g.ball(lerp(bx(s), d.x, f), lerp(by + 50, y - 50, f), 7, a);
            });
            g.circle(d.x, y, 54, { alpha: a, width: 3, fill: 0.1 });
            g.text(d.name, d.x, y + 14, { size: d.name.length > 2 ? 40 : 52, font: 'italic', alpha: a });
          });
        },
      },
      {
        title: 'Significant figures',
        say: [
          'A measurement is never exact, so the digits you write are a promise about how well you know it.',
          'Count the digits that carry information. These are the significant figures.',
          'When multiplying, the answer keeps only as many as the least precise number.',
        ],
        eq: [{ at: 3, src: '4.56 × 1.4 = 6.384 ≈ 6.4' }],
        draw: (g, t) => {
          const row = (s: string, n: number, y: number, t0: number) => {
            const a = ph(t, t0, t0 + 0.7);
            const cw = 70;
            const x = (i: number) => 540 + i * cw;
            const lit = Math.floor(ph(t, t0 + 0.8, t0 + 2.2) * n + 1e-6);
            let d = 0;
            [...s].forEach((c, i) => {
              g.text(c, x(i), y, { size: 110, font: 'serif', alpha: a });
              if (/\d/.test(c)) {
                d++;
                if (d <= lit) g.line(x(i) - 26, y + 30, x(i) + 26, y + 30, { alpha: a, width: 5 });
              }
            });
            g.text(`${n} significant figures`, 1330, y - 10, { size: 36, alpha: a * 0.75, align: 'left' });
          };
          row('4.56', 3, 520, 0.3);
          row('1.4', 2, 720, 2.5);
          const out = ph(t, 6, 7);
          g.text('answer: 6.4  (two figures)', 960, 880, { size: 44, font: 'serif', alpha: out });
        },
      },
      {
        title: 'Dimensions',
        say: [
          'The dimension of a quantity says what it is built from: mass, length and time.',
          'Both sides of a true equation have the same dimensions.',
          'Check each term of the distance formula and every one is a length.',
        ],
        eq: [
          { at: 2, src: '"[v]" = [ "L" | "T" ] = "L T⁻¹"' },
          { at: 6.5, src: 's = u · t + [ 1 | 2 ] · a · t ^2' },
          { at: 10.5, src: '"L" = "L" + "L"' },
        ],
        draw: (g, t) => {
          const wrong = t > 13;
          const u = wrong ? t - 13 : Math.max(0, t - 7);
          const th = (wrong ? 0.2 : 0) * (1 - Math.exp(-1.6 * u)) + 0.05 * Math.exp(-1.2 * u) * Math.sin(7 * u);
          const px = 960, py = 540, L = 420;
          const ex = L * Math.cos(th), ey = L * Math.sin(th);
          const a = ph(t, 6, 7.5);
          g.line(px - ex, py - ey, px + ex, py + ey, { alpha: a, width: 4 });
          g.line(px, py, px - 60, py + 170, { alpha: a * 0.7 });
          g.line(px, py, px + 60, py + 170, { alpha: a * 0.7 });
          g.ball(px, py, 9, a);
          const chip = (x: number, y: number, s: string) => {
            g.rect(x - 110, y, 220, 70, { alpha: a, fill: 0.1 });
            g.text(s, x, y + 48, { size: 42, font: 'italic', alpha: a });
          };
          chip(px - ex, py - ey + 60, 'L');
          chip(px + ex, py + ey + 60, wrong ? 'L T⁻¹' : 'L + L');
          g.text(wrong ? 'a speed set equal to a length: wrong' : 'a length on both sides: it checks out', 960, 860, { size: 38, alpha: a * 0.8 });
          const m = 1 - ph(t, 5.5, 6.3);
          [['M', 'mass'], ['L', 'length'], ['T', 'time']].forEach(([s, n], i) => {
            g.text(s, 560 + i * 400, 560, { size: 120, font: 'italic', alpha: m });
            g.text(n, 560 + i * 400, 630, { size: 34, alpha: m * 0.7 });
          });
        },
      },
      {
        title: 'Finding a formula',
        say: [
          'Dimensions can even find a formula. Guess that a pendulum period depends on length and gravity.',
          'Match the powers of length and time on both sides.',
          'Out comes the square root of length over g, up to a pure number.',
        ],
        eq: [
          { at: 1.5, src: 'T = k · L ^a · g ^c' },
          { at: 6, src: 'a + c = 0 ,  − 2 · c = 1' },
          { at: 11, src: 'T = k · √[ [ L | g ] ]' },
        ],
        draw: (g, t) => {
          const p = ph(t, 5, 11);
          const c = -0.5 * p, a = -c;
          const x0 = 1020, k = 300;
          const rows = [
            { name: 'L', parts: [a, c], target: 0, y: 460 },
            { name: 'T', parts: [-2 * c], target: 1, y: 640 },
          ];
          const al = ph(t, 4, 5);
          rows.forEach((r) => {
            g.text(r.name, 560, r.y + 16, { size: 56, font: 'italic', alpha: al });
            g.line(x0 - 350, r.y, x0 + 450, r.y, { alpha: 0.4 * al });
            g.line(x0 + k * r.target, r.y - 50, x0 + k * r.target, r.y + 50, { alpha: 0.9 * al, dash: [10, 8] });
            let acc = 0;
            r.parts.forEach((v, i) => {
              const from = x0 + k * acc;
              acc += v;
              const to = x0 + k * acc;
              g.rect(Math.min(from, to), r.y - 22, Math.abs(to - from), 44, { fill: i ? 0.35 : 0.8, alpha: al, width: 0 });
            });
            g.ball(x0 + k * acc, r.y, 11, al);
          });
          g.text(`a = ${a.toFixed(2)}     c = ${c.toFixed(2)}`, 960, 820, { size: 38, font: 'mono', alpha: al * 0.8 });
        },
      },
      {
        title: 'Order of magnitude',
        say: [
          'Sometimes only the power of ten matters.',
          'Sizes in nature run from a proton to a galaxy, some thirty-six powers of ten.',
          'Estimate by multiplying rough guesses: a lifetime of heartbeats is about three billion.',
        ],
        eq: [{ at: 8, src: 'N = 70 · 60 · 24 · 365 · 80 ≈ 3 × 10 ^9' }],
        draw: (g, t) => {
          const X = (e: number) => 240 + ((e + 15) / 36) * 1440;
          const y = 620;
          const e = lerp(-15, 21, ph(t, 0.5, 7.5));
          g.line(X(-15) - 40, y, X(21) + 40, y, { alpha: 0.6 });
          for (let i = -15; i <= 21; i++) g.line(X(i), y - (i % 5 === 0 ? 14 : 7), X(i), y + (i % 5 === 0 ? 14 : 7), { alpha: 0.5, width: 2 });
          const items: [number, string][] = [[-15, 'proton'], [-10, 'atom'], [-5, 'cell'], [0, 'person'], [7, 'Earth'], [11, 'orbit'], [21, 'galaxy']];
          items.forEach(([ex, name], i) => {
            const on = clamp((e - ex + 0.4) / 0.8);
            const up = i % 2 === 0;
            const x = X(ex);
            g.line(x, y, x, y + (up ? -80 : 80), { alpha: 0.3 + 0.6 * on, width: 2 });
            g.text(name, x, y + (up ? -160 : 150), { size: 38, font: 'italic', alpha: 0.3 + 0.7 * on });
            g.text(`${pw(ex)} m`, x, y + (up ? -110 : 110), { size: 28, font: 'mono', alpha: 0.3 + 0.6 * on });
          });
          g.ball(X(e), y, 14);
          g.text(`size ≈ ${pw(Math.round(e))} m`, 960, 840, { size: 44, font: 'serif', alpha: 0.85 });
        },
      },
    ],
  });
