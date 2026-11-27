import { buildChapterFilm, ph } from '../film/engine';

/** Relative velocity: one subtraction of vectors, for trains, rivers, rain and aircraft. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'Who is really moving?',
    subtitle: 'Relative velocity.',
    shots: [
      {
        title: 'Two trains',
        say: ['Two trains run side by side, one at sixty, one at forty kilometres an hour.', 'From the slow train, the fast one creeps ahead at only twenty.', 'Velocity depends on who is watching.'],
        eq: [{ at: 6, src: 'v _AB = v _A − v _B' }],
        draw: (g, t) => {
          const cam = ph(t, 4, 5.5);
          const xa = 200 + 60 * t * 3 - cam * 40 * t * 3;
          const xb = 200 + 40 * t * 3 - cam * 40 * t * 3;
          g.line(100, 520, 1820, 520, { alpha: 0.4 });
          g.line(100, 720, 1820, 720, { alpha: 0.4 });
          g.block(((xa % 1700) + 1700) % 1700 + 100, 480, 260, 70, { label: 'A · 60' });
          g.block(((xb % 1700) + 1700) % 1700 + 100, 680, 260, 70, { label: 'B · 40' });
          g.text(cam > 0.5 ? 'seen from train B' : 'seen from the ground', 960, 860, { size: 32, alpha: 0.6 });
        },
      },
      {
        title: 'Crossing a river',
        say: ['A swimmer heads straight across a river while the current carries them downstream.', 'Their velocity over the ground is the sum of their own velocity and the river\'s.', 'To land straight opposite, they must aim upstream.'],
        eq: [{ at: 5, src: 'v _ground = v _swim + v _river' }],
        draw: (g, t) => {
          g.line(200, 360, 1720, 360, { alpha: 0.6 });
          g.line(200, 840, 1720, 840, { alpha: 0.6 });
          for (let k = 0; k < 6; k++) {
            const x = 200 + ((k * 280 + t * 80) % 1520);
            g.arrow(x, 600 + (k % 2) * 120 - 60, x + 70, 600 + (k % 2) * 120 - 60, { alpha: 0.2, width: 2, head: 12 });
          }
          const aim = ph(t, 8, 9);
          const p = (t % 4) / 4;
          const x = 700 + (1 - aim) * 300 * p;
          const y = 840 - 480 * p;
          g.ball(x, y, 14);
          g.arrow(x, y, x - 120 * aim, y - 140, { label: 'swim', alpha: 0.8 });
          g.arrow(x, y, x + 120, y, { alpha: 0.5 });
        },
      },
      {
        title: 'Rain on the move',
        say: ['Rain falls straight down. Run through it, and it seems to come at you slanted.', 'Relative to you, the rain also has your velocity, backwards.', 'That is why you tilt your umbrella forward.'],
        eq: [{ at: 4, src: 'v _rain,you = v _rain − v _you' }],
        draw: (g, t) => {
          const run = ph(t, 2, 3);
          for (let k = 0; k < 40; k++) {
            const x0 = (k * 97) % 1720 + 100;
            const y = ((k * 53 + t * 500) % 600) + 300;
            g.line(x0 - run * (y - 300) * 0.5, y, x0 - run * (y - 300) * 0.5 - run * 20, y + 40, { alpha: 0.4, width: 2 });
          }
          g.block(960, 820, 40, 100);
          g.arc(960 + 30 * run, 740, 90, Math.PI + 0.3 * run, 2 * Math.PI + 0.3 * run, { width: 4 });
        },
      },
      {
        title: 'Closest approach',
        say: ['For two ships, work in one ship\'s frame, and the other moves in a straight line.', 'The nearest they come is the shortest distance from that line to the first ship.'],
        draw: (g, t) => {
          const p = ph(t, 1, 6);
          g.ball(800, 700, 16);
          g.text('A (at rest in its frame)', 800, 770, { size: 28, alpha: 0.6 });
          g.line(400, 400, 1500, 640, { alpha: 0.4, dash: [10, 8] });
          g.ball(400 + 1100 * p, 400 + 240 * p, 14);
          const s = ph(t, 6, 7);
          g.line(800, 700, 853, 457, { alpha: s, width: 3 });
          g.text('closest', 880, 590, { size: 28, alpha: s, align: 'left' });
        },
      },
    ],
  });
