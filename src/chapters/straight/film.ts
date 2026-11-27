import { buildChapterFilm, ph, clamp } from '../film/engine';

/** Motion in a straight line: position, velocity, acceleration and the three equations. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'How far does a speeding car go?',
    subtitle: 'Motion along a straight line.',
    shots: [
      {
        title: 'Position',
        say: ['Put a car on a straight road, and a number line under it.', 'Its position x is just where it is on that line, measured from a chosen zero.', 'Moving right, x grows. Moving left, x shrinks.'],
        draw: (g, t) => {
          g.line(200, 640, 1720, 640, { alpha: 0.6 });
          for (let i = 0; i <= 10; i++) {
            const x = 260 + i * 140;
            g.line(x, 630, x, 650, { alpha: 0.6 });
            g.text(String(i * 10), x, 690, { size: 24, font: 'mono', alpha: 0.5 });
          }
          const x = 260 + 1400 * (0.5 - 0.4 * Math.cos(t * 0.6));
          g.block(x, 590, 120, 60, { label: 'car' });
          g.arrow(260, 760, x, 760, { alpha: 0.7, width: 2 });
          g.text('x', (260 + x) / 2, 810, { size: 40, font: 'italic' });
        },
      },
      {
        title: 'Velocity',
        say: ['Velocity is how fast the position changes, with a sign for direction.', 'On a graph of position against time, it is the slope.', 'A steeper line means a faster car. A flat line means standing still.'],
        eq: [{ at: 1.5, src: 'v = [ Δ x | Δ t ]' }],
        draw: (g, t) => {
          const ox = 400, oy = 820;
          g.axes(ox, oy, 1100, 520, { x: 't', y: 'x', alpha: 0.6 });
          const f = (x: number) => oy - 0.00035 * (x - ox) ** 2;
          const head = clamp(t / 4);
          g.curve(f, ox, ox + 1000 * head, { alpha: 0.9 });
          const px = ox + 200 + 700 * ph(t, 5, 11);
          if (t > 4.5) {
            const s = -0.0007 * (px - ox);
            g.line(px - 220, f(px) - s * 220, px + 220, f(px) + s * 220, { alpha: 0.6, dash: [10, 8] });
            g.ball(px, f(px), 12);
            g.text('slope = v', px + 40, f(px) + 60, { size: 30, alpha: 0.7, align: 'left' });
          }
        },
      },
      {
        title: 'Acceleration',
        say: ['Acceleration is how fast the velocity changes.', 'Press the pedal and the velocity arrow grows a little every second.', 'With steady acceleration, the velocity graph is a straight line, and the area under it is the distance.'],
        eq: [
          { at: 1.5, src: 'a = [ Δ v | Δ t ]' },
          { at: 9, src: 'v = u + a · t' },
        ],
        draw: (g, t) => {
          if (t < 8) {
            const tt = t % 4;
            const x = 300 + 40 * tt * tt * 2.5;
            g.ground(200, 560, 1720, 560, 0.5);
            g.block(x, 520, 120, 60, { label: 'car' });
            g.arrow(x, 440, x + 30 + 90 * tt, 440, { label: 'v' });
          } else {
            const ox = 500, oy = 820;
            g.axes(ox, oy, 900, 460, { x: 't', y: 'v', alpha: 0.6 });
            const h = ph(t, 8, 10);
            const x2 = ox + 800 * h;
            const v = (x: number) => oy - 100 - 0.35 * (x - ox);
            g.path([[ox, oy], [ox, v(ox)], [x2, v(x2)], [x2, oy]], { close: true, fill: 0.12, alpha: 0.9 });
            g.text('area = distance', ox + 400, oy - 80, { size: 32, alpha: 0.8 * ph(t, 10, 11) });
          }
        },
      },
      {
        title: 'The three equations',
        say: ['The area of that trapezium gives the distance travelled.', 'Remove time between the two, and you get the third equation.', 'These three solve almost every problem with steady acceleration.'],
        eq: [
          { at: 0.5, src: 's = u · t + ½ · a · t ^2' },
          { at: 4, src: 'v ^2 = u ^2 + 2 · a · s' },
        ],
        draw: (g, t) => {
          g.math('v = u + a · t', 960, 460, 54, ph(t, 6, 7));
          g.math('s = u · t + ½ · a · t ^2', 960, 580, 54, ph(t, 6.5, 7.5));
          g.math('v ^2 = u ^2 + 2 · a · s', 960, 700, 54, ph(t, 7, 8));
        },
      },
      {
        title: 'Free fall and stopping',
        say: ['Drop a ball and it falls with a steady acceleration g, about ten metres per second every second.', 'A braking car is the same story backwards.', 'Double the speed, and the stopping distance is four times as long. That is why speed limits matter.'],
        eq: [{ at: 8, src: 's = [ u ^2 | 2 · a ] ' }],
        draw: (g, t) => {
          if (t < 6) {
            const tt = t % 3;
            for (let k = 0; k <= Math.floor(tt / 0.3); k++) g.circle(700, 320 + 50 * (k * 0.3) ** 2, 14, { alpha: 0.25, width: 2 });
            g.ball(700, 320 + 50 * tt * tt, 16);
            g.text('falls 5, 20, 45 m...', 1100, 520, { size: 32, alpha: 0.6 });
          } else {
            [1, 2].forEach((k, i) => {
              const y = 470 + i * 220;
              const L = 260 * k * k;
              const p = ph(t, 7, 11);
              const x = 300 + L * (1 - (1 - p) ** 2);
              g.ground(200, y + 40, 1700, y + 40, 0.4);
              g.block(x, y, 110, 60);
              g.text(k === 1 ? 'u' : '2u', 230, y - 50, { size: 36, font: 'italic', alpha: 0.8 });
              g.line(300, y + 80, 300 + L, y + 80, { alpha: 0.5 * p, width: 2 });
              g.text(k === 1 ? 's' : '4s', 300 + L / 2, y + 120, { size: 32, font: 'italic', alpha: p });
            });
          }
        },
      },
    ],
  });
