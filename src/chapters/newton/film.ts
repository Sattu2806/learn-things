import { buildChapterFilm, ph, DEG } from '../film/engine';

/** Newton's laws: inertia, F = m·a, action and reaction, free-body diagrams. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'What does a force actually do?',
    subtitle: "Newton's three laws of motion.",
    shots: [
      {
        title: 'Inertia',
        say: ['Slide a puck on ice and it glides on and on.', 'Without a net force, a body keeps doing what it was doing: resting, or moving in a straight line at steady speed.', 'That is the first law. Forces do not keep things moving. They change the motion.'],
        draw: (g, t) => {
          g.line(100, 700, 1820, 700, { alpha: 0.5 });
          const x = 200 + ((t * 160) % 1600);
          g.block(x, 670, 100, 60);
          g.arrow(x + 70, 600, x + 200, 600, { label: 'v', alpha: 0.7 });
          g.text('no net force: same velocity', 960, 840, { size: 32, alpha: 0.6 });
        },
      },
      {
        title: 'F equals m a',
        say: ['Push a block with a steady force and it speeds up steadily.', 'Double the force, double the acceleration. Double the mass, half the acceleration.', 'The second law ties them together.'],
        eq: [{ at: 4, src: 'F = m · a' }],
        draw: (g, t) => {
          [[1, 1], [2, 1], [1, 2]].forEach(([F, m], i) => {
            const y = 420 + i * 180;
            const tt = t % 5;
            const x = 300 + 30 * (F / m) * tt * tt;
            g.line(200, y + 40, 1720, y + 40, { alpha: 0.4 });
            const w = 80 * Math.sqrt(m);
            g.block(x, y + 40 - w / 2, w, w, { label: m === 2 ? '2m' : 'm' });
            g.arrow(x - w / 2 - 120 * F, y + 40 - w / 2, x - w / 2, y + 40 - w / 2, { label: F === 2 ? '' : '', alpha: 0.9 });
            g.text(F === 2 ? '2F' : 'F', x - w / 2 - 70 * F, y - w / 2, { size: 34, font: 'italic' });
          });
        },
      },
      {
        title: 'Action and reaction',
        say: ['Forces always come in pairs. Push on a wall, and the wall pushes back just as hard.', 'The two forces act on different bodies, so they never cancel each other.', 'Two skaters push apart: equal forces, opposite directions.'],
        eq: [{ at: 4, src: 'F _AB = − F _BA' }],
        draw: (g, t) => {
          const p = Math.max(0, t - 6);
          const xa = 860 - 60 * p, xb = 1060 + 40 * p;
          g.line(200, 760, 1720, 760, { alpha: 0.4 });
          g.block(xa, 700, 90, 120, { label: 'A' });
          g.block(xb, 690, 70, 140, { label: 'B' });
          const s = t < 7 ? 1 : 1 - ph(t, 7, 8);
          g.arrow(xb - 35, 640, xb - 35 + 160, 640, { alpha: s });
          g.arrow(xa + 45, 640, xa + 45 - 160, 640, { alpha: s });
        },
      },
      {
        title: 'Free-body diagrams',
        say: ['To solve a problem, draw the body alone with every force on it.', 'A block on a slope: weight straight down, the normal push from the slope, and friction along it.', 'Then add the forces along each direction and apply F equals m a.'],
        eq: [{ at: 8, src: 'm · g · sin θ − f = m · a' }],
        draw: (g, t) => {
          const th = 30 * DEG;
          const x0 = 500, y0 = 820;
          g.path([[x0, y0], [x0 + 900, y0], [x0 + 900, y0 - 900 * Math.tan(th)]], { close: true, alpha: 0.6, fill: 0.04 });
          const bx = x0 + 560, by = y0 - 560 * Math.tan(th) - 45;
          g.block(bx, by, 100, 80, { a: -th });
          const s1 = ph(t, 3, 4), s2 = ph(t, 4.5, 5.5), s3 = ph(t, 6, 7);
          g.arrow(bx, by, bx, by + 220, { label: 'mg', alpha: s1 });
          g.arrow(bx, by, bx - 160 * Math.sin(th), by - 160 * Math.cos(th), { label: 'N', alpha: s2 });
          g.arrow(bx, by, bx + 130 * Math.cos(th), by - 130 * Math.sin(th), { label: 'f', alpha: s3 });
        },
      },
      {
        title: 'Lifts',
        say: ['Stand on scales in a lift. When it accelerates up, the floor must push harder than your weight.', 'You feel heavier. Accelerating down, you feel lighter, and in free fall, weightless.'],
        eq: [{ at: 4, src: 'N = m · ( g + a )' }],
        draw: (g, t) => {
          const a = Math.sin(t * 0.8);
          const y = 560 - 80 * a;
          g.rect(810, y - 230, 300, 420, { alpha: 0.6 });
          g.block(960, y + 100, 60, 140);
          g.arrow(960, y + 170, 960, y + 170 - 90 * (1 + 0.6 * a), { label: 'N' });
          g.arrow(980, y + 100, 980, y + 220, { alpha: 0.6 });
          g.text(a > 0.2 ? 'heavier' : a < -0.2 ? 'lighter' : '', 1300, 560, { size: 36, alpha: 0.8 });
        },
      },
    ],
  });
