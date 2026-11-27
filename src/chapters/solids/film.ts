import { buildChapterFilm, ph, clamp } from '../film/engine';

/** Elasticity: stress, strain, Hooke's law and Young's modulus. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'Why do solids spring back?',
    subtitle: 'Stress, strain and elasticity.',
    shots: [
      {
        title: 'Springs between atoms',
        say: ['Inside a solid, atoms sit in a grid, held by forces like tiny springs.', 'Pull on the solid and every spring stretches a little. Let go, and they pull it back.'],
        draw: (g, t) => {
          const s = 1 + 0.12 * Math.max(0, Math.sin(t * 1.2));
          for (let i = 0; i < 7; i++)
            for (let j = 0; j < 4; j++) {
              const x = 960 + (i - 3) * 140 * s, y = 600 + (j - 1.5) * 140;
              if (i < 6) g.spring(x, y, x + 140 * s, y, { coils: 4, amp: 8, alpha: 0.5 });
              if (j < 3) g.spring(x, y, x, y + 140, { coils: 4, amp: 8, alpha: 0.5 });
              g.ball(x, y, 14);
            }
        },
      },
      {
        title: 'Stress and strain',
        say: ['Stress is the force per unit area of the cross-section.', 'Strain is the stretch as a fraction of the original length.', 'For small stretches they are proportional. Their ratio, Young\'s modulus, tells how stiff the material is.'],
        eq: [
          { at: 1, src: 'σ = [ F | A ]' },
          { at: 4, src: 'ε = [ Δ L | L ]' },
          { at: 8, src: 'Y = [ σ | ε ]' },
        ],
        draw: (g, t) => {
          const st = 0.5 + 0.5 * Math.sin(t);
          const L = 300 + 50 * st;
          g.line(760, 320, 1160, 320, { width: 5 });
          g.rect(940, 320, 40, L, { fill: 0.15 });
          g.block(960, 320 + L + 40, 140, 80, { label: 'F' });
          g.arrow(1080, 320 + L + 80, 1080, 320 + L + 200, { label: 'F', alpha: 0.6 });
          g.line(1200, 320 + 300, 1200, 320 + L, { width: 4 });
          g.text('ΔL', 1240, 320 + 320 + 25 * st, { size: 30, font: 'italic', align: 'left' });
        },
      },
      {
        title: 'The stress-strain curve',
        say: ['Pull harder and harder on a wire.', 'First a straight line: Hooke\'s law. Past the elastic limit, it no longer returns to its shape.', 'Beyond that, it stretches like toffee and finally snaps.'],
        draw: (g, t) => {
          const ox = 400, oy = 840;
          g.axes(ox, oy, 1100, 520, { x: 'strain', y: 'stress', alpha: 0.6 });
          const pts: [number, number][] = [];
          const h = clamp(t / 9);
          for (let k = 0; k <= 200 * h; k++) {
            const x = (k / 200) * 1000;
            const y = x < 200 ? 1.6 * x : x < 800 ? 320 + 120 * Math.sin(((x - 200) / 600) * Math.PI * 0.6) : 420 - (x - 800) * 0.6;
            pts.push([ox + x, oy - y]);
          }
          g.path(pts, { width: 4 });
          g.text('elastic', ox + 100, oy - 230, { size: 28, alpha: ph(t, 2, 3) * 0.7 });
          g.text('plastic', ox + 500, oy - 470, { size: 28, alpha: ph(t, 5, 6) * 0.7 });
          g.text('break', ox + 1000, oy - 330, { size: 28, alpha: ph(t, 8.5, 9) * 0.7 });
        },
      },
      {
        title: 'Stored energy',
        say: ['A stretched wire stores energy, like a spring.', 'It equals the area under the force-extension line: half the force times the extension.'],
        eq: [{ at: 3, src: 'U = ½ · F · Δ L' }],
        draw: (g, t) => {
          const ox = 600, oy = 820;
          g.axes(ox, oy, 800, 480, { x: 'ΔL', y: 'F', alpha: 0.6 });
          const p = ph(t, 1, 3);
          g.path([[ox, oy], [ox + 600 * p, oy - 400 * p], [ox + 600 * p, oy]], { close: true, fill: 0.15, width: 3 });
        },
      },
    ],
  });
