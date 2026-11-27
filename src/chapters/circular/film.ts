import { buildChapterFilm, ph, DEG } from '../film/engine';

/** Circular motion: angles, angular velocity, and the acceleration that points inward. */

const CX = 960, CY = 600, R = 260;

export const buildFilm = () =>
  buildChapterFilm({
    title: 'Why is something going round always accelerating?',
    subtitle: 'Circular motion.',
    shots: [
      {
        title: 'Angles in radians',
        say: ['Measure an angle by the arc it cuts, in units of the radius.', 'An arc as long as the radius is one radian. A full turn is two pi.', 'So the distance round is just the radius times the angle.'],
        eq: [{ at: 6, src: 's = r · θ' }],
        draw: (g, t) => {
          const th = Math.min(1, ph(t, 0.5, 3)) + ph(t, 4, 7) * (2 * Math.PI - 1);
          g.circle(CX, CY, R, { alpha: 0.25, width: 2 });
          g.line(CX, CY, CX + R, CY, { alpha: 0.7 });
          g.line(CX, CY, CX + R * Math.cos(th), CY - R * Math.sin(th), { alpha: 0.7 });
          g.arc(CX, CY, R, 0, -th, { width: 6 });
          g.text(th < 1.05 ? '1 rad' : `${th.toFixed(2)} rad`, CX, CY + R + 80, { size: 34, font: 'mono', alpha: 0.7 });
        },
      },
      {
        title: 'Angular velocity',
        say: ['Angular velocity omega is how fast the angle grows, in radians per second.', 'Every point on a spinning disc has the same omega.', 'But the ones farther out move faster, because they cover more distance in each turn.'],
        eq: [
          { at: 1.5, src: 'ω = [ Δ θ | Δ t ]' },
          { at: 6, src: 'v = ω · r' },
        ],
        draw: (g, t) => {
          const a = t * 0.8;
          g.circle(CX, CY, R, { alpha: 0.4 });
          g.line(CX, CY, CX + R * Math.cos(a), CY - R * Math.sin(a), { alpha: 0.5 });
          [0.4, 1].forEach((k) => {
            const x = CX + R * k * Math.cos(a), y = CY - R * k * Math.sin(a);
            g.ball(x, y, 12);
            const v = 160 * k;
            g.arrow(x, y, x - v * Math.sin(a), y - v * Math.cos(a), { alpha: ph(t, 5, 6) });
          });
        },
      },
      {
        title: 'Turning is accelerating',
        say: ['Even at steady speed, the velocity keeps changing direction.', 'Line up the velocity arrows tail to tail. The change between them always points to the centre.', 'So anything going round accelerates inward.'],
        eq: [{ at: 7, src: 'a = [ v ^2 | r ] = ω ^2 · r' }],
        draw: (g, t) => {
          const a = t * 0.7;
          g.circle(CX - 250, CY, R, { alpha: 0.35 });
          const x = CX - 250 + R * Math.cos(a), y = CY - R * Math.sin(a);
          g.ball(x, y, 14);
          g.arrow(x, y, x - 180 * Math.sin(a), y - 180 * Math.cos(a), { label: 'v' });
          g.arrow(x, y, x - 140 * Math.cos(a), y + 140 * Math.sin(a), { label: 'a', alpha: ph(t, 3, 4) });
          // Velocity triangle on the right.
          const ox = 1400, oy = CY;
          const s = ph(t, 3, 4);
          const a2 = a + 0.5;
          g.arrow(ox, oy, ox - 180 * Math.sin(a), oy - 180 * Math.cos(a), { alpha: s * 0.6 });
          g.arrow(ox, oy, ox - 180 * Math.sin(a2), oy - 180 * Math.cos(a2), { alpha: s * 0.6 });
          g.arrow(ox - 180 * Math.sin(a), oy - 180 * Math.cos(a), ox - 180 * Math.sin(a2), oy - 180 * Math.cos(a2), { alpha: s, label: 'Δv' });
        },
      },
      {
        title: 'Speeding up on a circle',
        say: ['If the speed changes too, there is a second part of the acceleration, along the path.', 'The total is the sum of the two, at right angles.'],
        eq: [{ at: 3, src: 'a = √[ a _t ^2 + a _c ^2 ]' }],
        draw: (g, t) => {
          const a = 0.1 * t * t;
          const x = CX + R * Math.cos(a), y = CY - R * Math.sin(a);
          g.circle(CX, CY, R, { alpha: 0.35 });
          g.ball(x, y, 14);
          const tx = -Math.sin(a), ty = -Math.cos(a);
          const cx = -Math.cos(a), cy = Math.sin(a);
          const at = 110, ac = 40 + 12 * t;
          g.arrow(x, y, x + tx * at, y + ty * at, { alpha: 0.6, label: 'aₜ' });
          g.arrow(x, y, x + cx * ac, y + cy * ac, { alpha: 0.6 });
          g.arrow(x, y, x + tx * at + cx * ac, y + ty * at + cy * ac, { width: 4 });
        },
      },
      {
        title: 'The shadow',
        say: ['Look at the moving point from the side, and its shadow slides back and forth.', 'That shadow is simple harmonic motion, the subject of the oscillations chapter.'],
        draw: (g, t) => {
          const a = t * 1.1;
          g.circle(CX - 200, CY, R, { alpha: 0.35 });
          const x = CX - 200 + R * Math.cos(a), y = CY - R * Math.sin(a);
          g.ball(x, y, 14);
          g.line(CX - 200 - R, CY + R + 80, CX - 200 + R, CY + R + 80, { alpha: 0.5 });
          g.ball(x, CY + R + 80, 12);
          g.line(x, y, x, CY + R + 80, { alpha: 0.2, dash: [6, 8] });
          void DEG;
        },
      },
    ],
  });
