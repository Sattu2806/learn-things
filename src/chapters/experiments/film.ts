import { buildChapterFilm, clamp, lerp, ph, TAU } from '../film/engine';

/** Measurement and experimental skills: errors, vernier, screw gauge, the pendulum and a straight-line graph. */

const READINGS = [2.63, 2.56, 2.42, 2.71, 2.8];

export const buildFilm = () =>
  buildChapterFilm({
    title: 'How sure are we?',
    subtitle: 'Errors, instruments and straight-line graphs.',
    shots: [
      {
        title: 'Every measurement has an error',
        say: [
          'Time a pendulum five times and you get five different answers.',
          'The best value is the mean, and the spread of the readings is the uncertainty.',
          'Write the result with its error, and compare the error with the size of the quantity.',
        ],
        eq: [
          { at: 3, src: 'a = a _mean ± Δ a _mean' },
          { at: 9, src: '"percentage error" = [ Δ a _mean | a _mean ] × 100 "%"' },
        ],
        draw: (g, t) => {
          const X = (v: number) => 360 + ((v - 2.3) / 0.6) * 1200;
          const y = 620;
          g.line(300, y, 1620, y, { alpha: 0.5 });
          [2.4, 2.6, 2.8].forEach((v) => {
            g.line(X(v), y, X(v), y + 14, { alpha: 0.5, width: 2 });
            g.text(v.toFixed(1), X(v), y + 52, { size: 30, font: 'mono', alpha: 0.6 });
          });
          READINGS.forEach((v, i) => {
            const p = ph(t, 0.5 + i * 0.8, 1.3 + i * 0.8);
            g.ball(X(v), lerp(400, y - 24, p), 14, p);
          });
          const m = ph(t, 5, 6);
          g.line(X(2.62), y - 150, X(2.62), y + 20, { alpha: m, dash: [10, 8], width: 3 });
          g.text('mean 2.62', X(2.62), y - 170, { size: 36, font: 'italic', alpha: m });
          const band = ph(t, 7.5, 8.5);
          g.rect(X(2.51), y - 70, X(2.73) - X(2.51), 70, { fill: 0.16, alpha: band, width: 0 });
          g.text('± 0.11', X(2.73) + 20, y - 30, { size: 36, font: 'italic', alpha: band, align: 'left' });
        },
      },
      {
        title: 'The vernier scale',
        say: [
          'A vernier slides beside the main scale, with divisions a little shorter.',
          'Ten vernier divisions fit into nine main ones, so each is a tenth of a millimetre shorter.',
          'Find the vernier mark that lines up, and its number gives the tenths.',
        ],
        eq: [
          { at: 3, src: '"LC" = 1 "MSD" − 1 "VSD" = 0.1 "mm"' },
          { at: 9, src: '"reading" = "MSR" + "VSR" × "LC"' },
        ],
        draw: (g, t) => {
          const px = 120, x0 = 330;
          const r = 4.3 + 1.6 * (1 - ph(t, 1, 7));
          const kk = Math.round((r - Math.floor(r)) * 10);
          const msr = Math.floor(r) + (kk === 10 ? 1 : 0);
          const k = kk === 10 ? 0 : kk;
          const X = (m: number) => x0 + m * px;
          const yM = 560;
          g.rect(260, yM - 60, 1400, 60, { alpha: 0.7, fill: 0.08 });
          for (let m = 0; m <= 11; m++) {
            g.line(X(m), yM, X(m), yM - (m % 5 === 0 ? 30 : 20), { alpha: 0.7, width: 2 });
            g.text(String(m), X(m), yM - 38, { size: 24, font: 'mono', alpha: 0.7 });
          }
          g.rect(X(r) - 20, yM, 10 * 0.9 * px + 40, 80, { alpha: 0.7, fill: 0.08 });
          for (let i = 0; i <= 10; i++) {
            const x = X(r) + i * 0.9 * px;
            g.line(x, yM, x, yM + (i === k ? 40 : 24), { alpha: i === k ? 1 : 0.6, width: i === k ? 4 : 2 });
            g.text(String(i), x, yM + 70, { size: 24, font: 'mono', alpha: 0.7 });
          }
          const a = ph(t, 7, 8);
          g.line(X(r) + k * 0.9 * px, yM - 60, X(r) + k * 0.9 * px, yM + 90, { alpha: a, width: 4 });
          g.text(`${msr} + ${k} × 0.1 = ${(msr + k * 0.1).toFixed(1)} mm`, 960, 820, { size: 50, font: 'serif', alpha: a });
        },
      },
      {
        title: 'The screw gauge',
        say: [
          'A screw gauge turns a fine screw: one full turn moves the spindle by the pitch.',
          'Fifty divisions on the thimble share that step, so each is one hundredth of a millimetre.',
          'Add the pitch scale reading and the thimble reading times the least count.',
        ],
        eq: [
          { at: 3, src: '"LC" = [ 0.5 "mm" | 50 ] = 0.01 "mm"' },
          { at: 9, src: '"reading" = "PSR" + "CSR" × "LC"' },
        ],
        draw: (g, t) => {
          const obj = 2.86;
          const gap = obj + 1.3 * (1 - ph(t, 1, 7));
          const ppm = 150, xA = 420, ys = 600;
          const tip = xA + gap * ppm;
          const edge = tip + 500;
          const psr = Math.floor(gap / 0.5 + 1e-9) * 0.5;
          const cs = (gap - psr) / 0.01;
          g.rect(xA - 50, ys - 100, 50, 200, { fill: 0.12 });
          g.rect(xA, ys - 70, obj * ppm, 140, { fill: 0.35 });
          g.rect(xA + 440, ys - 50, edge - xA - 440, 100, { fill: 0.08 });
          g.line(xA + 440, ys, edge, ys, { alpha: 0.9, width: 3 });
          for (let m = 0; m <= 6; m += 0.5) {
            const x = xA + 500 + m * ppm;
            if (x > edge - 6 || x < xA + 450) continue;
            const whole = Number.isInteger(m);
            g.line(x, ys, x, ys + (whole ? -45 : 30), { alpha: 0.9, width: 3 });
            if (whole) g.text(String(m), x, ys - 62, { size: 28, font: 'mono', alpha: 0.7 });
          }
          g.rect(edge, ys - 130, 330, 260, { fill: 0.1 });
          for (let i = -8; i <= 8; i++) {
            const j = Math.floor(cs) + i;
            const y = ys + (j - cs) * 22;
            if (Math.abs(y - ys) > 120) continue;
            const major = ((j % 50) + 50) % 5 === 0;
            g.line(edge + 8, y, edge + (major ? 70 : 40), y, { alpha: 0.8, width: 2 });
            if (major) g.text(String(((j % 50) + 50) % 50), edge + 130, y + 10, { size: 28, font: 'mono', alpha: 0.7 });
          }
          g.line(edge, ys, edge + 330, ys, { alpha: 1, width: 3, dash: [12, 8] });
          const a = ph(t, 7, 8);
          g.text(`2.5 + ${Math.round(cs)} × 0.01 = ${(psr + Math.round(cs) * 0.01).toFixed(2)} mm`, 960, 860, { size: 50, font: 'serif', alpha: 0.4 + 0.6 * a });
        },
      },
      {
        title: 'Errors add',
        say: [
          'When we combine measurements, the errors combine too.',
          'For sums and differences, the absolute errors add.',
          'For products and quotients, the relative errors add, and a power multiplies the relative error.',
        ],
        eq: [
          { at: 3, src: 'Δ x = Δ a + Δ b' },
          { at: 7, src: '[ Δ x | x ] = [ Δ a | a ] + [ Δ b | b ]' },
          { at: 12, src: '[ Δ x | x ] = n · [ Δ a | a ]' },
        ],
        draw: (g, t) => {
          const f = ph(t, 6, 10);
          const x0 = 660, y1 = 800, l = 560, w = 300, dl = 70 * f, dw = 50 * f;
          g.rect(x0, y1 - w, l, w, { fill: 0.12 });
          g.rect(x0 + l, y1 - w, dl, w, { fill: 0.3, alpha: f, width: 0 });
          g.rect(x0, y1 - w - dw, l, dw, { fill: 0.3, alpha: f, width: 0 });
          g.rect(x0 + l, y1 - w - dw, dl, dw, { fill: 0.9, alpha: ph(t, 10, 11), width: 0 });
          g.text('a · b', x0 + l / 2, y1 - w / 2 + 14, { size: 60, font: 'italic', alpha: 0.9 });
          const s = 1 - ph(t, 5, 6);
          const da = 40 * Math.sin(1.5 * t), db = 30 * Math.sin(2.4 * t + 1);
          const ya = 440;
          g.line(660, ya, 960 + da, ya, { alpha: s, width: 6 });
          g.line(960 + da, ya, 1260 + da + db, ya, { alpha: 0.5 * s, width: 6 });
          [660, 960 + da, 1260 + da + db].forEach((x) => g.line(x, ya - 18, x, ya + 18, { alpha: s, width: 3 }));
          g.rect(1260 - 70, ya + 40, 140, 30, { fill: 0.2, alpha: s, width: 0 });
          g.text('a + b', 960, ya - 50, { size: 46, font: 'italic', alpha: s });
        },
      },
      {
        title: 'Timing a pendulum',
        say: [
          'To find g, measure the length to the centre of the bob and time the swings.',
          'Timing many oscillations divides your reaction error by the number you count.',
          'And since the period is squared, its error counts double in g.',
        ],
        eq: [
          { at: 2, src: 'g = [ 4 · π ^2 · L | T ^2 ]' },
          { at: 7, src: 'T = [ t | n ]' },
          { at: 11, src: '[ Δ g | g ] = [ Δ L | L ] + 2 · [ Δ T | T ]' },
        ],
        draw: (g, t) => {
          const px = 640, py = 360, L = 420;
          const th = 0.2 * Math.sin((TAU * t) / 2.4);
          const bx = px + L * Math.sin(th), by = py + L * Math.cos(th);
          g.line(px - 80, py, px + 80, py, { alpha: 0.9 });
          g.line(px, py, bx, by, { width: 2.5 });
          g.ball(bx, by, 28);
          g.arrow(px - 120, py, px - 120, py + L, { alpha: 0.6, width: 2.5 });
          g.text('L', px - 160, py + L / 2 + 14, { size: 48, font: 'italic', alpha: 0.8 });
          const cx = 1340, cy = 620;
          g.circle(cx, cy, 130, { alpha: 0.6, width: 3 });
          g.line(cx, cy, cx + 100 * Math.sin((TAU * t) / 12), cy - 100 * Math.cos((TAU * t) / 12), { width: 4 });
          g.text(`${t.toFixed(1)} s`, cx, cy + 215, { size: 44, font: 'mono', alpha: 0.8 });
          g.text(`n = ${Math.floor(t / 2.4)}`, cx, cy + 275, { size: 44, font: 'mono', alpha: 0.8 });
        },
      },
      {
        title: 'The straight line',
        say: [
          'Plot the square of the period against the length and the points fall on a straight line.',
          'Draw the best line through the middle, and take its slope from two points far apart.',
          'The slope is four pi squared over g, so g comes out of the slope.',
        ],
        eq: [
          { at: 2, src: 'T ^2 = [ 4 · π ^2 | g ] · L' },
          { at: 10, src: 'g = [ 4 · π ^2 | m ]' },
        ],
        draw: (g, t) => {
          const ox = 560, oy = 860, sx = 600, sy = 90;
          g.axes(ox, oy, 900, 480, { x: 'L', y: 'T²', alpha: 0.7 });
          const pts: [number, number][] = [[0.4, 1.7], [0.6, 2.2], [0.8, 3.35], [1.0, 3.9], [1.2, 4.85]];
          const X = (x: number) => ox + x * sx, Y = (y: number) => oy - y * sy;
          pts.forEach((p, i) => g.ball(X(p[0]), Y(p[1]), 10, ph(t, 0.4 + i * 0.4, 1 + i * 0.4)));
          const a = ph(t, 3.5, 5);
          g.line(X(0), Y(0), X(0 + 1.4 * a), Y(4 * 1.4 * a), { alpha: 0.9, width: 4 });
          const b = ph(t, 6, 8);
          if (b > 0) {
            const x1 = 0.2, y1 = 0.8, x2 = 1.2, y2 = 4.8;
            g.line(X(x1), Y(y1), lerp(X(x1), X(x2), b), Y(y1), { alpha: 0.7, dash: [10, 8] });
            g.line(X(x2), Y(y1), X(x2), lerp(Y(y1), Y(y2), clamp(b)), { alpha: 0.7, dash: [10, 8] });
            g.text('Δx', (X(x1) + X(x2)) / 2, Y(y1) + 50, { size: 38, font: 'italic', alpha: b });
            g.text('Δy', X(x2) + 50, (Y(y1) + Y(y2)) / 2, { size: 38, font: 'italic', alpha: b });
            g.text('m = 4.00 s²/m', X(0.5), Y(4.6), { size: 40, font: 'serif', alpha: b, align: 'left' });
          }
        },
      },
    ],
  });
