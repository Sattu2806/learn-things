import { buildChapterFilm, ph } from '../film/engine';

/** Centre of mass. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'The point that moves simply',
    subtitle: 'Centre of mass.',
    shots: [
      {
        title: 'Two masses',
        say: ['Two masses on a light rod. There is one point where the rod balances.', 'It sits closer to the heavier mass: the mass-weighted average position.'],
        eq: [{ at: 3, src: 'x _cm = [ m _1 · x _1 + m _2 · x _2 | m _1 + m _2 ]' }],
        draw: (g, t) => {
          const k = 1 + 2 * ph(t, 1, 4);
          const x1 = 560, x2 = 1360;
          const xc = (k * x1 + x2) / (k + 1);
          g.line(x1, 600, x2, 600, { width: 4 });
          g.ball(x1, 600, 30 * Math.sqrt(k));
          g.ball(x2, 600, 30);
          g.path([[xc, 600], [xc - 40, 680], [xc + 40, 680]], { close: true, fill: 0.2 });
          g.text('balance', xc, 730, { size: 28, alpha: 0.6 });
        },
      },
      {
        title: 'It moves like one particle',
        say: ['Throw a spinning hammer. Every part tumbles in a complicated way.', 'But the centre of mass follows a clean parabola, as if all the mass were there.'],
        draw: (g, t) => {
          const tt = t % 4;
          const x = 300 + 330 * tt, y = 820 - 360 * tt + 90 * tt * tt;
          const a = tt * 4;
          g.curve((xx) => { const s = (xx - 300) / 330; return 820 - 360 * s + 90 * s * s; }, 300, 300 + 330 * tt, { alpha: 0.4, dash: [8, 8] });
          g.line(x - 120 * Math.cos(a), y - 120 * Math.sin(a), x + 40 * Math.cos(a), y + 40 * Math.sin(a), { width: 6 });
          g.block(x - 140 * Math.cos(a), y - 140 * Math.sin(a), 60, 40, { a });
          g.circle(x, y, 8, { fill: 1, width: 0 });
        },
      },
      {
        title: 'Explosions',
        say: ['If a shell bursts in mid-air, the pieces fly apart.', 'Internal forces cannot move the centre of mass. It carries on along the same path.'],
        draw: (g, t) => {
          const tt = Math.min(t, 6);
          const cx = 300 + 220 * tt, cy = 820 - 300 * tt + 50 * tt * tt;
          g.curve((xx) => { const s = (xx - 300) / 220; return 820 - 300 * s + 50 * s * s; }, 300, 300 + 220 * tt, { alpha: 0.3, dash: [8, 8] });
          if (tt < 2.5) g.ball(cx, cy, 16);
          else {
            const d = tt - 2.5;
            g.ball(cx + 120 * d, cy - 80 * d, 12);
            g.ball(cx - 120 * d, cy + 80 * d, 12);
            g.circle(cx, cy, 8, { width: 2 });
          }
        },
      },
      {
        title: 'Balance',
        say: ['A body stands steady while its centre of mass lies above its base.', 'Tip it past the edge, and gravity tips it right over.'],
        draw: (g, t) => {
          const a = -0.6 * ph(t, 0.5, 4) - (t > 4 ? ph(t, 4, 5) * 0.97 : 0);
          g.ground(500, 820, 1400, 820, 0.6);
          g.with({ x: 1060, y: 820, a }, () => {
            g.rect(-200, -360, 200, 360, { fill: 0.1 });
            g.circle(-100, -180, 8, { fill: 1, width: 0 });
            g.line(-100, -180, -100, -180 + 400, { alpha: 0 });
          });
          const cx = 1060 + (-100 * Math.cos(a) + 180 * Math.sin(a));
          const cy = 820 + (-100 * Math.sin(a) - 180 * Math.cos(a));
          g.line(cx, cy, cx, 820, { alpha: 0.5, dash: [6, 8] });
        },
      },
    ],
  });
