import { buildChapterFilm, ph, clamp } from '../film/engine';

/** Thermal properties: temperature, expansion, specific heat, latent heat and heat transfer. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'What is heat, really?',
    subtitle: 'Thermal properties of matter.',
    shots: [
      {
        title: 'Temperature',
        say: ['The atoms of every object are always jiggling.', 'Temperature measures how vigorously. Heat is energy flowing from hot to cold because of a temperature difference.'],
        draw: (g, t) => {
          [[640, 0.4], [1280, 1.6]].forEach(([cx, k], i) => {
            g.rect(cx - 220, 380, 440, 440, { alpha: 0.6 });
            for (let n = 0; n < 16; n++) {
              const x = cx - 150 + (n % 4) * 100 + 18 * k * Math.sin(t * 7 * k + n * 2.1);
              const y = 450 + Math.floor(n / 4) * 100 + 18 * k * Math.cos(t * 6 * k + n * 1.3);
              g.ball(x, y, 12);
            }
            g.text(i ? 'hot' : 'cold', cx, 880, { size: 32, alpha: 0.7 });
          });
        },
      },
      {
        title: 'Expansion',
        say: ['Heat a rod and its atoms jiggle wider apart, so it grows a little longer.', 'The stretch is proportional to the original length and the temperature rise.', 'That is why bridges have gaps and railway tracks have joints.'],
        eq: [{ at: 4, src: 'Δ L = α · L · Δ T' }],
        draw: (g, t) => {
          const h = 0.5 + 0.5 * Math.sin(t * 0.7);
          g.rect(400, 560, 900 + 120 * h, 60, { fill: 0.2 + 0.4 * h });
          g.line(1300, 520, 1300, 660, { alpha: 0.5, dash: [6, 6] });
          g.text('ΔL', 1300 + 60 * h, 500, { size: 32, font: 'italic', alpha: h });
        },
      },
      {
        title: 'Specific heat',
        say: ['Some materials take far more heat to warm up than others.', 'Water needs about four thousand two hundred joules for each kilogram and each degree, more than almost anything.', 'That is why the sea warms slowly and keeps coasts mild.'],
        eq: [{ at: 3, src: 'Q = m · c · Δ T' }],
        draw: (g, t) => {
          const ox = 500, oy = 820;
          g.axes(ox, oy, 900, 480, { x: 'Q', y: 'T', alpha: 0.6 });
          const h = clamp(t / 6);
          g.line(ox, oy - 40, ox + 800 * h, oy - 40 - 400 * h, { width: 4 });
          g.line(ox, oy - 40, ox + 800 * h, oy - 40 - 90 * h, { width: 4, alpha: 0.6 });
          g.text('metal', ox + 820 * h, oy - 450 * h, { size: 28, alpha: 0.7, align: 'left' });
          g.text('water', ox + 820 * h, oy - 140 * h, { size: 28, alpha: 0.7, align: 'left' });
        },
      },
      {
        title: 'Melting and boiling',
        say: ['Heat ice steadily. Its temperature rises, then stops at zero while it melts.', 'The heat goes into breaking bonds, not into speeding atoms up. That is latent heat.', 'The same happens again at a hundred degrees while the water boils.'],
        eq: [{ at: 6, src: 'Q = m · L' }],
        draw: (g, t) => {
          const ox = 400, oy = 860;
          g.axes(ox, oy, 1100, 520, { x: 'heat', y: 'T', alpha: 0.6, down: 80 });
          const xs = [0, 120, 400, 560, 1000];
          const ys = [-60, 0, 0, 300, 300];
          const pts: [number, number][] = [];
          const h = clamp(t / 9) * 1000;
          for (let i = 0; i < xs.length; i++) {
            if (xs[i] > h) {
              const p = (h - xs[i - 1]) / (xs[i] - xs[i - 1]);
              pts.push([ox + h, oy - 40 - (ys[i - 1] + (ys[i] - ys[i - 1]) * p)]);
              break;
            }
            pts.push([ox + xs[i], oy - 40 - ys[i]]);
          }
          g.path(pts, { width: 4 });
          g.text('melting', ox + 260, oy - 80, { size: 28, alpha: ph(t, 2, 3) * 0.7 });
          g.text('boiling', ox + 780, oy - 380, { size: 28, alpha: ph(t, 7, 8) * 0.7 });
        },
      },
      {
        title: 'Three ways to travel',
        say: ['Heat travels by conduction, atom nudging atom along a solid.', 'By convection, as warm fluid rises and cool fluid sinks.', 'And by radiation, which needs no material at all. That is how sunlight warms the Earth.'],
        draw: (g, t) => {
          g.rect(260, 560, 420, 50, { fill: 0.2 });
          for (let k = 0; k < 8; k++) g.circle(290 + k * 52, 585, 10 + 4 * Math.sin(t * 8 - k * 0.8), { fill: 1, width: 0, alpha: 0.4 + k * -0.04 + 0.4 });
          g.text('conduction', 470, 700, { size: 30, alpha: 0.7 });
          g.rect(760, 420, 400, 380, { alpha: 0.5 });
          g.path([[860, 760], [860, 470], [1060, 470], [1060, 760]], { alpha: 0.4, dash: [10, 10] });
          const a = (t * 0.4) % 1;
          const loop = (p: number): [number, number] => (p < 0.25 ? [860, 760 - 1160 * p] : p < 0.5 ? [860 + 800 * (p - 0.25), 470] : p < 0.75 ? [1060, 470 + 1160 * (p - 0.5)] : [1060 - 800 * (p - 0.75), 760]);
          const [lx, ly] = loop(a);
          g.ball(lx, ly, 10);
          g.text('convection', 960, 860, { size: 30, alpha: 0.7 });
          g.ball(1400, 520, 40);
          for (let k = 0; k < 3; k++) {
            const x = 1460 + ((t * 120 + k * 80) % 240);
            g.curve((xx) => 520 + 14 * Math.sin((xx - t * 300) / 15), x, x + 50, { alpha: 0.7, width: 2 });
          }
          g.text('radiation', 1560, 700, { size: 30, alpha: 0.7 });
        },
      },
    ],
  });
