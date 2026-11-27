import { buildChapterFilm, ph } from '../film/engine';

/** Fluids: pressure with depth, buoyancy, continuity and Bernoulli. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'Why do ships float?',
    subtitle: 'Fluids at rest and in motion.',
    shots: [
      {
        title: 'Pressure grows with depth',
        say: ['Dive down, and the water above you presses harder.', 'Pressure grows steadily with depth, and pushes equally in every direction.', 'Holes lower in a tank spurt water farther.'],
        eq: [{ at: 4, src: 'P = P _0 + ρ · g · h' }],
        draw: (g, t) => {
          g.path([[600, 300], [600, 860], [1000, 860], [1000, 300]], { width: 4 });
          g.rect(604, 360, 392, 496, { fill: 0.1, width: 0 });
          [450, 600, 750].forEach((y, i) => {
            const v = Math.sqrt(y - 360) * 3.2;
            const s = ph(t, 6, 7);
            g.curve((x) => y + 0.5 * 980 * ((x - 1000) / (v * 30)) ** 2 * 0.06, 1000, 1000 + v * 7 * s, { alpha: 0.7 });
            g.arrow(800 - 30 - 15 * i, y, 800 - 30 - 15 * i - 40 - 30 * i, y, { alpha: 0.5, width: 2, head: 12 });
            g.arrow(800 + 30 + 15 * i, y, 800 + 30 + 15 * i + 40 + 30 * i, y, { alpha: 0.5, width: 2, head: 12 });
          });
        },
      },
      {
        title: 'Buoyancy',
        say: ['The water pushes harder on the bottom of a block than on its top.', 'The difference is an upward force, equal to the weight of the water pushed aside.', 'If that is enough to match the weight, the block floats. That is Archimedes\' principle.'],
        eq: [{ at: 5, src: 'F _B = ρ · V · g' }],
        draw: (g, t) => {
          g.rect(400, 520, 1120, 380, { fill: 0.1, width: 0 });
          g.line(400, 520, 1520, 520, { alpha: 0.6 });
          const y = 520 + 40 * Math.sin(t) * Math.exp(-t * 0.3);
          g.block(960, y, 260, 160, {});
          g.arrow(960, y + 80, 960, y + 260, { label: 'mg', alpha: 0.7 });
          g.arrow(1060, y + 80, 1060, y - 120, { label: 'F', alpha: 0.9 * ph(t, 3, 4) });
        },
      },
      {
        title: 'Flow and continuity',
        say: ['Water in a pipe cannot pile up. What flows in each second must flow out.', 'So where the pipe narrows, the water speeds up.'],
        eq: [{ at: 3, src: 'A _1 · v _1 = A _2 · v _2' }],
        draw: (g, t) => {
          const top = (x: number) => 600 - (x < 800 ? 160 : x > 1100 ? 70 : 160 - (90 * (x - 800)) / 300);
          g.curve(top, 300, 1620, { width: 4 });
          g.curve((x) => 1200 - top(x), 300, 1620, { width: 4 });
          for (let k = 0; k < 24; k++) {
            const lane = (k % 4) / 3 - 0.5;
            let x = 300 + ((k * 67 + t * 120) % 1320);
            const hw = 600 - top(x);
            x += x > 1100 ? ((x - 1100) * 1.3) % 500 : 0;
            if (x > 1620) continue;
            g.circle(x, 600 + lane * hw * 1.6, 6, { fill: 1, width: 0 });
          }
        },
      },
      {
        title: 'Bernoulli',
        say: ['Faster flow means lower pressure.', 'Energy per unit volume is shared between pressure, motion and height, and the total stays the same along the flow.', 'It helps explain lift on wings and the spray from a perfume bottle.'],
        eq: [{ at: 3, src: 'P + ½ · ρ · v ^2 + ρ · g · h = constant' }],
        draw: (g, t) => {
          g.path([[400, 640], [800, 640], [1000, 600], [1200, 640], [1520, 640]], { width: 4 });
          g.path([[400, 760], [800, 760], [1000, 700], [1200, 760], [1520, 760]], { width: 4 });
          [[600, 240], [1000, 120], [1400, 240]].forEach(([x, h]) => {
            g.rect(x - 20, 640 - h - 40 * (1 - ph(t, 0, 2)), 40, h, { alpha: 0.6 });
            g.rect(x - 18, 640 - h * ph(t, 1, 3), 36, h * ph(t, 1, 3), { fill: 0.3, width: 0 });
          });
        },
      },
    ],
  });
