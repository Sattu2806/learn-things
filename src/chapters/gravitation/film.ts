import { buildChapterFilm, ph, clamp } from '../film/engine';

/** Gravitation: the inverse-square law, g, orbits and escape. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'Why does the Moon not fall down?',
    subtitle: 'Gravitation.',
    shots: [
      {
        title: 'One law',
        say: ['Every mass pulls on every other mass.', 'The pull grows with both masses, and falls off with the square of the distance.', 'Twice as far, one quarter the force.'],
        eq: [{ at: 3, src: 'F = [ G · M · m | r ^2 ]' }],
        draw: (g, t) => {
          const d = 300 + 300 * ph(t, 6, 9);
          const F = 220 * (300 / d) ** 2;
          g.ball(960 - d / 2, 600, 50);
          g.ball(960 + d / 2, 600, 30);
          g.arrow(960 - d / 2 + 50, 600, 960 - d / 2 + 50 + F, 600, { alpha: 0.8 });
          g.arrow(960 + d / 2 - 30, 600, 960 + d / 2 - 30 - F, 600, { alpha: 0.8 });
          g.text(d > 550 ? '2r: F/4' : 'r: F', 960, 780, { size: 32, alpha: 0.6 });
        },
      },
      {
        title: 'Newton\'s cannon',
        say: ['Fire a cannon from a mountain. Faster shots land farther away.', 'Fire fast enough, and the ground curves away as fast as the ball falls.', 'It never lands. That is an orbit, and that is the Moon: always falling, always missing.'],
        eq: [{ at: 8, src: 'v = √[ [ G · M | r ] ]' }],
        draw: (g, t) => {
          const cx = 960, cy = 620, R = 230;
          g.circle(cx, cy, R, { fill: 0.08 });
          const top = cy - R - 30;
          // Launched sideways from the mountain top: r(φ) = r0·k² / (1 − (1 − k²)·cos φ), k = v / v_orbit.
          const r0 = R + 30;
          [0.55, 0.8, 1].forEach((k, i) => {
            const s = clamp((t - i * 3) / 3);
            if (s <= 0) return;
            const pts: [number, number][] = [];
            for (let n = 0; n <= 300 * s; n++) {
              const phi = (n / 300) * 2 * Math.PI;
              const r = (r0 * k * k) / (1 - (1 - k * k) * Math.cos(phi));
              if (r < R) break;
              pts.push([cx + r * Math.sin(phi), cy - r * Math.cos(phi)]);
            }
            g.path(pts, { alpha: 0.8 });
            const last = pts[pts.length - 1];
            if (last) g.ball(last[0], last[1], 10);
          });
          g.line(cx, cy - R, cx, top, { width: 4 });
        },
      },
      {
        title: 'Weaker with height',
        say: ['At the surface, the pull per kilogram is g, about nine point eight newtons.', 'Climb away from the Earth and g shrinks with the square of your distance from its centre.'],
        eq: [{ at: 2, src: 'g = [ G · M | R ^2 ]' }],
        draw: (g, t) => {
          const ox = 500, oy = 820;
          g.axes(ox, oy, 1000, 480, { x: 'r', y: 'g', alpha: 0.6 });
          const R0 = 120;
          const h = clamp(t / 4);
          g.line(ox, oy - 400 / R0 * R0, ox + R0, oy - 400, { width: 4 });
          g.curve((x) => oy - 400 * (R0 / (x - ox)) ** 2, ox + R0, ox + R0 + 860 * h, { width: 4 });
          g.text('R', ox + R0, oy + 44, { size: 32, font: 'italic' });
        },
      },
      {
        title: 'Escaping',
        say: ['Throw hard enough and you escape for good. Your kinetic energy beats the energy holding you down.', 'From the Earth that takes about eleven kilometres per second.'],
        eq: [{ at: 3, src: 'v _esc = √[ [ 2 · G · M | R ] ]' }],
        draw: (g, t) => {
          g.circle(960, 1100, 400, { fill: 0.08 });
          const y = 700 - 120 * t;
          g.ball(960, y, 14);
          g.arrow(960, y - 30, 960, y - 140, { label: 'v', alpha: 0.7 });
        },
      },
    ],
  });
