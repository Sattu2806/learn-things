import { buildChapterFilm, ph } from '../film/engine';

/** Kinetic theory: pressure and temperature from molecules. */

function box(g: import('../film/engine').Gfx, t: number, n: number, speed: number, x0: number, w: number, y0 = 360, h = 460) {
  g.rect(x0, y0, w, h, { width: 4 });
  for (let k = 0; k < n; k++) {
    const vx = Math.cos(k * 2.4) * speed, vy = Math.sin(k * 1.7 + 0.5) * speed;
    const tri = (v: number, L: number) => { const p = ((v % (2 * L)) + 2 * L) % (2 * L); return p < L ? p : 2 * L - p; };
    g.circle(x0 + 10 + tri(k * 71 + vx * t, w - 20), y0 + 10 + tri(k * 43 + vy * t, h - 20), 7, { fill: 1, width: 0 });
  }
}

export const buildFilm = () =>
  buildChapterFilm({
    title: 'What is a gas made of?',
    subtitle: 'The kinetic theory of gases.',
    shots: [
      {
        title: 'Molecules in motion',
        say: ['A gas is a crowd of tiny molecules, flying in straight lines and bouncing off each other and the walls.', 'They are far apart, so most of a gas is empty space.'],
        draw: (g, t) => box(g, t, 40, 260, 560, 800),
      },
      {
        title: 'Pressure from collisions',
        say: ['Every bounce off a wall gives it a tiny push.', 'Billions of pushes each second add up to a steady pressure.', 'More molecules, or faster ones, mean more pressure.'],
        eq: [{ at: 6, src: 'P = ⅓ · ρ · v _rms ^2' }],
        draw: (g, t) => {
          box(g, t, 30, 300, 560, 800);
          for (let k = 0; k < 6; k++) {
            const y = 400 + k * 75;
            const fl = Math.max(0, Math.sin(t * 5 + k * 1.9));
            g.arrow(1360, y, 1360 + 50 * fl, y, { alpha: fl, width: 2, head: 12 });
          }
        },
      },
      {
        title: 'Temperature is speed',
        say: ['Heat the gas, and the molecules move faster.', 'Temperature is a measure of their average kinetic energy.'],
        eq: [{ at: 3, src: '½ · m · v ^2 = [ 3 | 2 ] · k · T' }],
        draw: (g, t) => {
          const s = 120 + 400 * ph(t, 1, 5);
          box(g, t, 30, s, 560, 800);
          g.text(s > 400 ? 'hot' : 'cool', 960, 880, { size: 32, alpha: 0.7 });
        },
      },
      {
        title: 'The gas law',
        say: ['Put it together and pressure, volume and temperature are tied by one law.', 'Squeeze a gas into half the volume at the same temperature, and the pressure doubles.'],
        eq: [{ at: 2, src: 'P · V = n · R · T' }],
        draw: (g, t) => {
          const w = 800 - 400 * ph(t, 3, 6);
          box(g, t, 30, 300, 560, w);
          g.rect(560 + w, 360, 40, 460, { fill: 0.5 });
        },
      },
      {
        title: 'Sharing energy',
        say: ['Molecules can also spin and vibrate. Energy is shared equally, half k T for each way of moving.', 'That is why gases with more complex molecules need more heat to warm up.'],
        draw: (g, t) => {
          [[560, 0], [960, 1], [1360, 2]].forEach(([x, k]) => {
            const y = 600;
            g.with({ x: x + 40 * Math.sin(t * 2 + k), y, a: k ? t * 2 : 0 }, () => {
              if (k === 0) g.ball(0, 0, 20);
              else {
                const d = 50 + (k === 2 ? 15 * Math.sin(t * 9) : 0);
                g.line(-d, 0, d, 0, { width: 4 });
                g.ball(-d, 0, 18);
                g.ball(d, 0, 18);
              }
            });
            g.text(['moves', 'moves + spins', '+ vibrates'][k], x, 780, { size: 28, alpha: 0.6 });
          });
        },
      },
    ],
  });
