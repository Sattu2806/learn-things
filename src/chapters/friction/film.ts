import { buildChapterFilm, ph, DEG, clamp } from '../film/engine';

/** Friction: static grip, kinetic drag, slopes and the angle of repose. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'Why does a heavy box refuse to move?',
    subtitle: 'Static and kinetic friction.',
    shots: [
      {
        title: 'Rough surfaces',
        say: ['Look closely at any two surfaces and they are full of tiny bumps.', 'Where the bumps touch, they stick together. Sliding means tearing those contacts apart.', 'That resistance is friction, and it always opposes sliding.'],
        draw: (g, t) => {
          const z = ph(t, 1, 3);
          const pts1: [number, number][] = [];
          const pts2: [number, number][] = [];
          for (let x = 300; x <= 1620; x += 20) {
            pts1.push([x, 600 + z * 22 * Math.sin(x * 0.11) + z * 10 * Math.sin(x * 0.37)]);
            const xs = x - 40 * Math.sin(t);
            pts2.push([x, 580 - z * 22 * Math.sin(xs * 0.13) - z * 10 * Math.cos(xs * 0.29)]);
          }
          g.path(pts1, { width: 3 });
          g.path(pts2, { width: 3, alpha: 0.7 });
          g.text('floor', 300, 680, { size: 28, alpha: 0.5, align: 'left' });
          g.text('box', 300, 520, { size: 28, alpha: 0.5, align: 'left' });
        },
      },
      {
        title: 'Static friction',
        say: ['Push gently on a heavy box. It does not move, so friction must match your push exactly.', 'Push harder, and friction grows too, up to a limit.', 'Beyond that limit, the box breaks free.'],
        eq: [{ at: 6, src: 'f _s ≤ μ _s · N' }],
        draw: (g, t) => {
          const P = clamp(t / 8) * 1.2;
          const moving = P > 1;
          const x = 900 + (moving ? Math.min(600, 60 * (t - 8 / 1.2) ** 2) : 0);
          g.ground(200, 760, 1720, 760, 0.6);
          g.block(x, 680, 200, 160, { label: 'M' });
          g.arrow(x - 100 - 250 * P, 680, x - 100, 680, { label: '' });
          g.text('push', x - 100 - 250 * P, 650, { size: 30 });
          const f = moving ? 0.8 : P;
          g.arrow(x - 60, 770, x - 60 - 250 * f, 770, { alpha: 0.8 });
          g.text('friction', x - 60 - 250 * f, 820, { size: 30, alpha: 0.8 });
        },
      },
      {
        title: 'Kinetic friction',
        say: ['Once sliding, friction drops a little and stays roughly constant.', 'That is why it is easier to keep a box moving than to start it.'],
        eq: [{ at: 2, src: 'f _k = μ _k · N' }],
        draw: (g, t) => {
          const ox = 400, oy = 820;
          g.axes(ox, oy, 1100, 480, { x: 'push', y: 'f', alpha: 0.6 });
          const h = clamp(t / 5);
          const xs = ox + 600;
          const pts: [number, number][] = [];
          for (let k = 0; k <= 100; k++) {
            const x = ox + 1000 * (k / 100);
            if (x > ox + 1000 * h) break;
            pts.push([x, x < xs ? oy - 0.62 * (x - ox) : oy - 300]);
          }
          g.path(pts, { width: 4 });
          g.text('static', ox + 300, oy - 260, { size: 30, alpha: 0.6 });
          g.text('kinetic', ox + 820, oy - 340, { size: 30, alpha: 0.6 * h });
        },
      },
      {
        title: 'The slope',
        say: ['Tilt a board slowly with a block on it.', 'Friction holds until the slope reaches an angle where the block just starts to slide.', 'At that angle, tan theta equals the coefficient of friction. Mass does not matter.'],
        eq: [{ at: 7, src: 'tan θ = μ _s' }],
        draw: (g, t) => {
          const th = Math.min(31, 4 * t) * DEG;
          const x0 = 500, y0 = 820;
          const L = 1000;
          g.line(x0, y0, x0 + L * Math.cos(th), y0 - L * Math.sin(th), { width: 4 });
          g.line(x0, y0, x0 + L, y0, { alpha: 0.4 });
          const slide = Math.max(0, t - 31 / 4);
          const s = 700 - 80 * slide * slide;
          g.block(x0 + s * Math.cos(th) - 40 * Math.sin(th), y0 - s * Math.sin(th) - 40 * Math.cos(th), 100, 80, { a: -th });
          g.arc(x0, y0, 140, 0, -th, { alpha: 0.6 });
          g.text(`${Math.round(th / DEG)}°`, x0 + 190, y0 - 20, { size: 32, font: 'mono' });
        },
      },
    ],
  });
