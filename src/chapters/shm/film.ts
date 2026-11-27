import { buildChapterFilm, ph, type Gfx } from '../film/engine';

/** Oscillations: one restoring rule, a circle's shadow, energy and resonance. */

const Y = 600;

function springBlock(g: Gfx, x: number, a = 1) {
  g.ground(360, 700, 1560, 700, 0.7 * a);
  g.line(360, 480, 360, 700, { alpha: 0.7 * a });
  g.spring(360, 620, x - 70, 620, { alpha: a, coils: 12 });
  g.block(x, 620, 140, 140, { label: 'm', alpha: a });
}

export const buildFilm = () =>
  buildChapterFilm({
    title: 'Why do springs keep perfect time?',
    subtitle: 'Simple harmonic motion from one rule.',
    shots: [
      {
        title: 'The rule',
        say: [
          'Pull a block on a spring to the side and let go.',
          'The spring pulls it back, and the farther you pull, the harder it pulls.',
          'That one rule, force proportional to displacement and pointing back, is simple harmonic motion.',
        ],
        eq: [
          { at: 4, src: 'F = − k · x' },
          { at: 9, src: 'a = − ω ^2 · x' },
        ],
        draw: (g, t) => {
          const x0 = 1000;
          const A = 240 * ph(t, 0.5, 2.5);
          const x = t < 3 ? x0 + A : x0 + 240 * Math.cos(2.2 * (t - 3));
          springBlock(g, x);
          g.line(x0, 520, x0, 720, { alpha: 0.35, dash: [8, 8] });
          g.text('x = 0', x0, 500, { size: 28, alpha: 0.5 });
          const d = x - x0;
          g.arrow(x, 440, x - d * 0.9, 440, { label: 'F', alpha: 0.9 });
          g.arrow(x0, 780, x, 780, { alpha: 0.6, width: 2 });
          g.text('x', (x0 + x) / 2, 830, { size: 38, font: 'italic', alpha: 0.7 });
        },
      },
      {
        title: 'The shadow of a circle',
        say: [
          'Here is a point going steadily round a circle.',
          'Shine a light from the side and watch its shadow on the wall.',
          'The shadow moves exactly like the block: fast through the middle, slow at the ends.',
          'So the position is a cosine of time, and omega is how fast the point goes round.',
        ],
        eq: [{ at: 10, src: 'x = A · cos ( ω · t + φ )' }],
        draw: (g, t) => {
          const cx = 700;
          const R = 200;
          const w = 1.2;
          const a = w * t;
          const px = cx + R * Math.cos(a);
          const py = Y - R * Math.sin(a);
          g.circle(cx, Y, R, { alpha: 0.4, width: 2 });
          g.line(cx, Y, px, py, { alpha: 0.6, width: 2 });
          g.ball(px, py, 14);
          const s = ph(t, 3, 4.5);
          const wallX = 1300;
          g.line(wallX, Y - 260, wallX, Y + 260, { alpha: 0.6 * s });
          g.line(px, py, wallX, py, { alpha: 0.25 * s, dash: [6, 10] });
          g.ball(wallX, py, 14, s);
          // The shadow's trace against time.
          const tr = ph(t, 7, 8);
          if (tr > 0) {
            const pts: [number, number][] = [];
            for (let k = 0; k <= 120; k++) {
              const tt = t - k * 0.04;
              if (tt < 0) break;
              pts.push([wallX + 20 + k * 3.6, Y - R * Math.sin(w * tt)]);
            }
            g.path(pts, { alpha: tr * 0.8, width: 2.5 });
          }
        },
      },
      {
        title: 'Period',
        say: [
          'One full swing takes a time T, the period.',
          'A heavier block swings slower, a stiffer spring faster.',
          'And the size of the swing does not matter at all. Big or small, the timing is the same.',
        ],
        eq: [
          { at: 2, src: 'T = [ 2 π | ω ]' },
          { at: 5, src: 'T = 2 π √[ [ m | k ] ]' },
        ],
        draw: (g, t) => {
          const amps = [70, 150, 230];
          amps.forEach((A, i) => {
            const y = 380 + i * 170;
            const x0 = 1000;
            const x = x0 + A * Math.cos(2 * t);
            g.line(420, y + 50, 1500, y + 50, { alpha: 0.4 });
            g.line(420, y - 40, 420, y + 50, { alpha: 0.6 });
            g.spring(420, y, x - 45, y, { coils: 10, amp: 14 });
            g.block(x, y, 90, 90, { alpha: 1 });
            g.text(`A = ${(A / 100).toFixed(1)}`, 1640, y + 10, { size: 30, alpha: 0.6 * ph(t, 8, 9) });
          });
        },
      },
      {
        title: 'Energy',
        say: [
          'As it swings, energy flows back and forth between the spring and the block.',
          'At the ends it is all stored in the spring. In the middle it is all motion.',
          'The total never changes: half k A squared.',
        ],
        eq: [{ at: 7, src: '½ · k · x ^2 + ½ · m · v ^2 = ½ · k · A ^2' }],
        draw: (g, t) => {
          const ox = 960;
          const oy = 800;
          const s = 300;
          g.axes(ox - 420, oy, 840, 420, { x: 'x', y: 'E', alpha: 0.6 });
          g.line(ox - 420, oy, ox - 420, oy, {});
          g.curve((x) => oy - ((x - ox) / s) ** 2 * 340, ox - s, ox + s, { alpha: 0.8 });
          g.line(ox - s, oy - 340, ox + s, oy - 340, { alpha: 0.5, dash: [10, 8] });
          const x = ox + s * Math.cos(1.6 * t);
          const u = oy - ((x - ox) / s) ** 2 * 340;
          g.line(x, oy, x, u, { alpha: 0.9, width: 8 });
          g.line(x, u, x, oy - 340, { alpha: 0.4, width: 8 });
          g.ball(x, u, 12);
          g.text('stored', x + 60, (oy + u) / 2, { size: 28, alpha: 0.7, align: 'left' });
          g.text('motion', x + 60, (u + oy - 340) / 2, { size: 28, alpha: 0.5, align: 'left' });
        },
      },
      {
        title: 'The pendulum',
        say: [
          'A pendulum swinging through small angles obeys the same rule.',
          'Gravity pulls it back toward the bottom, in proportion to how far it has swung.',
          'Its period depends only on its length and on g, not on the mass.',
        ],
        eq: [{ at: 7, src: 'T = 2 π √[ [ L | g ] ]' }],
        draw: (g, t) => {
          const px = 960;
          const py = 300;
          [380, 520].forEach((L, i) => {
            const w = Math.sqrt(980 / L) * 1.1;
            const th = 0.35 * Math.cos(w * t);
            const x = px + (i ? 260 : -260) + L * Math.sin(th);
            const y = py + L * Math.cos(th);
            const ax = px + (i ? 260 : -260);
            g.line(ax - 60, py, ax + 60, py, { alpha: 0.7 });
            g.line(ax, py, x, y, { width: 2 });
            g.ball(x, y, 22);
            g.text(i ? 'longer: slower' : 'short: faster', ax, py + L + 90, { size: 28, alpha: 0.6 });
          });
        },
      },
      {
        title: 'Damping and resonance',
        say: [
          'Real swings lose energy to friction, so the swing dies away. That is damping.',
          'Push in time with the natural rhythm, and every push adds energy.',
          'The swing grows and grows. That is resonance, the reason soldiers break step on bridges.',
        ],
        draw: (g, t) => {
          const ox = 260;
          const oy = 560;
          g.axes(ox, oy, 1400, 260, { x: 't', y: 'x', alpha: 0.5, down: 260 });
          const damped = 1 - ph(t, 6, 7);
          const res = ph(t, 6, 7);
          const head = Math.min(1, t / 6);
          g.curve((x) => oy - 230 * Math.exp(-(x - ox) / 500) * Math.cos((x - ox) / 30), ox, ox + 1400 * head, { alpha: damped * 0.9, n: 600 });
          const head2 = Math.min(1, Math.max(0, (t - 6) / 7));
          g.curve((x) => oy - 230 * Math.min(1, (x - ox) / 1400) * Math.sin((x - ox) / 30), ox, ox + 1400 * head2, { alpha: res * 0.9, n: 600 });
          g.text(res > 0.5 ? 'driven at the natural frequency' : 'damped', 960, 900, { size: 30, alpha: 0.6 });
        },
      },
    ],
  });
