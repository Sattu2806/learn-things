import { buildChapterFilm, ph } from '../film/engine';

/** Momentum, impulse and collisions. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'What survives every crash?',
    subtitle: 'Momentum and collisions.',
    shots: [
      {
        title: 'Momentum',
        say: ['A truck and a bicycle at the same speed are not equally hard to stop.', 'Momentum measures that: mass times velocity, a vector.', 'A force changes momentum. The push times its duration is the impulse.'],
        eq: [{ at: 3, src: 'p = m · v' }, { at: 7, src: 'F · Δ t = Δ p' }],
        draw: (g, t) => {
          const x = 300 + ((t * 150) % 1300);
          g.line(200, 520, 1720, 520, { alpha: 0.4 });
          g.line(200, 760, 1720, 760, { alpha: 0.4 });
          g.block(x, 460, 260, 120, { label: 'truck' });
          g.block(x, 730, 70, 60, { label: '' });
          g.arrow(x + 140, 400, x + 140 + 300, 400, { label: 'p', width: 6 });
          g.arrow(x + 40, 680, x + 90, 680, { width: 3 });
        },
      },
      {
        title: 'Soft landings',
        say: ['To stop the same momentum with a smaller force, take longer.', 'That is why airbags, crash mats and bent knees work.'],
        draw: (g, t) => {
          const ox = 500, oy = 820;
          g.axes(ox, oy, 900, 480, { x: 't', y: 'F', alpha: 0.6 });
          g.curve((x) => oy - 420 * Math.exp(-(((x - ox - 200) / 40) ** 2)), ox, ox + 800, { alpha: 1 - ph(t, 3, 4) * 0.6 });
          g.curve((x) => oy - 140 * Math.exp(-(((x - ox - 350) / 130) ** 2)), ox, ox + 800, { alpha: ph(t, 2, 3) });
          g.text('same area, same impulse', 960, 280 + 600, { size: 30, alpha: ph(t, 3, 4) * 0.7 });
        },
      },
      {
        title: 'Conservation',
        say: ['When two bodies collide, they push on each other equally and oppositely, for the same time.', 'So whatever momentum one gains, the other loses.', 'The total momentum before equals the total after.'],
        eq: [{ at: 6, src: 'm _1 · u _1 + m _2 · u _2 = m _1 · v _1 + m _2 · v _2' }],
        draw: (g, t) => {
          const tc = 3;
          const xa = t < tc ? 400 + 160 * t : 400 + 160 * tc + 40 * (t - tc);
          const xb = t < tc ? 1100 - 0 * t : 1100 + 120 * (t - tc);
          g.line(200, 700, 1720, 700, { alpha: 0.4 });
          g.ball(xa - 210, 640, 60);
          g.ball(xb, 660, 40, 0.7);
          g.text('total p unchanged', 960, 860, { size: 32, alpha: 0.6 });
        },
      },
      {
        title: 'Elastic and inelastic',
        say: ['In an elastic collision, kinetic energy is kept too, and the balls bounce apart.', 'In a perfectly inelastic one they stick together. Momentum is still kept, but some energy turns to heat and sound.'],
        draw: (g, t) => {
          const tc = 2.5;
          [0, 1].forEach((k) => {
            const y = 460 + k * 260;
            g.line(200, y + 50, 1720, y + 50, { alpha: 0.4 });
            const xa = t < tc ? 500 + 160 * t : k ? 900 + 80 * (t - tc) : 900;
            const xb = t < tc ? 1000 : k ? 1000 + 80 * (t - tc) : 1000 + 160 * (t - tc);
            g.block(xa, y, 100, 100);
            g.block(xb, y, 100, 100);
            g.text(k ? 'stick: inelastic' : 'bounce: elastic', 300, y - 70, { size: 30, alpha: 0.7, align: 'left' });
          });
        },
      },
      {
        title: 'Recoil',
        say: ['A gun at rest fires a bullet. Total momentum was zero, so it must stay zero.', 'The bullet goes forward, the gun kicks back, slower because it is heavier.'],
        eq: [{ at: 4, src: 'm · v = M · V' }],
        draw: (g, t) => {
          const f = ph(t, 1.5, 1.6) > 0 ? Math.max(0, t - 1.5) : 0;
          g.block(960 - 40 * f, 600, 260, 70, { label: 'M' });
          g.ball(1100 + 900 * f, 600, 10);
        },
      },
    ],
  });
