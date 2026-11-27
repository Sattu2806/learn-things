import { buildChapterFilm, ph, DEG } from '../film/engine';

/** Forces in circular motion: strings, friction, banking, loops. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'What pulls things round a circle?',
    subtitle: 'Forces in circular motion.',
    shots: [
      {
        title: 'Something must pull in',
        say: ['Going round needs an acceleration toward the centre, so it needs a force toward the centre.', 'For a stone on a string, that force is the tension.', 'Cut the string, and the stone flies off in a straight line, along the tangent.'],
        eq: [{ at: 3, src: 'T = [ m · v ^2 | r ]' }],
        draw: (g, t) => {
          const cx = 900, cy = 600, R = 260;
          const cut = 8;
          if (t < cut) {
            const a = t * 1.3;
            const x = cx + R * Math.cos(a), y = cy - R * Math.sin(a);
            g.line(cx, cy, x, y, { width: 2 });
            g.ball(x, y, 18);
            g.arrow(x, y, x + (cx - x) * 0.4, y + (cy - y) * 0.4, { label: 'T', alpha: 0.9 });
          } else {
            const a = cut * 1.3;
            const x0 = cx + R * Math.cos(a), y0 = cy - R * Math.sin(a);
            const s = (t - cut) * 1.3 * R;
            g.ball(x0 - s * Math.sin(a), y0 - s * Math.cos(a), 18);
            g.line(x0, y0, x0 - 2000 * Math.sin(a), y0 - 2000 * Math.cos(a), { alpha: 0.3, dash: [8, 10] });
          }
          g.circle(cx, cy, 8, { fill: 1, width: 0 });
          g.circle(cx, cy, R, { alpha: 0.2, width: 2 });
        },
      },
      {
        title: 'Cars on curves',
        say: ['A car on a flat curve is held in by friction between tyres and road.', 'Too fast, and the friction needed is more than the road can give. The car skids outward.'],
        eq: [{ at: 4, src: 'v _max = √[ μ · r · g ]' }],
        draw: (g, t) => {
          const cx = 960, cy = 1000, R = 600;
          g.arc(cx, cy, R - 60, Math.PI * 1.1, Math.PI * 1.9, { alpha: 0.5 });
          g.arc(cx, cy, R + 60, Math.PI * 1.1, Math.PI * 1.9, { alpha: 0.5 });
          const a = Math.PI * 1.15 + ((t * 0.25) % 0.7);
          const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
          g.block(x, y, 80, 44, { a: a + Math.PI / 2 });
          g.arrow(x, y, x + (cx - x) * 0.25, y + (cy - y) * 0.25, { label: 'f' });
        },
      },
      {
        title: 'Banked roads',
        say: ['Tilt the road, and the normal force leans inward.', 'Its sideways part can supply the centripetal force on its own, with no friction at all.', 'Racing tracks and railway curves are banked for this reason.'],
        eq: [{ at: 6, src: 'tan θ = [ v ^2 | r · g ]' }],
        draw: (g, t) => {
          const th = 25 * DEG * ph(t, 0.5, 2.5);
          const cx = 960, cy = 720;
          g.line(cx - 500 * Math.cos(th), cy + 500 * Math.sin(th), cx + 500 * Math.cos(th), cy - 500 * Math.sin(th), { width: 4 });
          g.block(cx - 60 * Math.sin(th), cy - 60 * Math.cos(th), 200, 110, { a: -th });
          const bx = cx - 60 * Math.sin(th), by = cy - 60 * Math.cos(th);
          g.arrow(bx, by, bx - 300 * Math.sin(th), by - 300 * Math.cos(th), { label: 'N' });
          g.arrow(bx, by, bx, by + 260, { label: 'mg' });
          g.arrow(bx, by, bx - 300 * Math.sin(th), by, { alpha: 0.6 * ph(t, 4, 5), dash: [8, 6] });
          g.text('to the centre', bx - 300 * Math.sin(th) - 30, by - 30, { size: 26, alpha: ph(t, 4, 5), align: 'right' });
        },
      },
      {
        title: 'The loop',
        say: ['On a vertical loop, at the very top, both gravity and the track push down.', 'Go too slowly and gravity alone is more than needed. You fall off the track.', 'The slowest safe speed at the top is root g r.'],
        eq: [{ at: 7, src: 'v _top ≥ √[ g · r ]' }],
        draw: (g, t) => {
          const cx = 960, cy = 560, R = 260;
          g.circle(cx, cy, R, { alpha: 0.6 });
          const a = -Math.PI / 2 + t * 1.2;
          const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
          g.ball(x, y, 18);
          g.arrow(x, y, x, y + 140, { label: 'mg', alpha: 0.7 });
          g.arrow(x, y, x + (cx - x) * 0.45, y + (cy - y) * 0.45, { label: 'N', alpha: 0.7 });
        },
      },
    ],
  });
