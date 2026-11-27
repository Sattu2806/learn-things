import { buildChapterFilm, ph, clamp } from '../film/engine';

/** Thermodynamics: the first law, PV diagrams, engines and the second law. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'Can heat be turned into work?',
    subtitle: 'Thermodynamics.',
    shots: [
      {
        title: 'Gas in a cylinder',
        say: ['Trap a gas under a piston and heat it.', 'Some of the heat warms the gas, raising its internal energy.', 'The rest pushes the piston up: the gas does work.'],
        eq: [{ at: 6, src: 'Q = Δ U + W' }],
        draw: (g, t) => {
          const h = 260 + 120 * ph(t, 1, 6);
          g.path([[760, 300], [760, 820], [1160, 820], [1160, 300]], { width: 4 });
          g.rect(764, 820 - h, 392, 40, { fill: 0.5 });
          for (let n = 0; n < 20; n++) {
            const x = 790 + ((n * 83 + t * 300 * (1 + (n % 3))) % 340);
            const y = 820 - 20 - ((n * 47 + t * 260) % (h - 60));
            g.circle(x, y, 6, { fill: 1, width: 0 });
          }
          for (let k = 0; k < 5; k++) g.curve((x) => 880 + 10 * Math.sin(x / 12 + t * 8), 800 + k * 70, 840 + k * 70, { alpha: 0.6 });
          g.text('heat in', 960, 940 - 20, { size: 28, alpha: 0.6 });
        },
      },
      {
        title: 'Work is an area',
        say: ['Plot pressure against volume.', 'The work done by the gas is the area under its path.', 'Go round a closed loop, and the enclosed area is the net work per cycle.'],
        eq: [{ at: 3, src: 'W = ∫ P · d V' }],
        draw: (g, t) => {
          const ox = 500, oy = 820;
          g.axes(ox, oy, 950, 500, { x: 'V', y: 'P', alpha: 0.6 });
          const p = ph(t, 1, 4);
          const f = (x: number) => oy - 80000 / (x - ox + 120);
          g.path([[ox + 100, oy], ...Array.from({ length: 41 }, (_, i): [number, number] => { const x = ox + 100 + 600 * p * (i / 40); return [x, f(x)]; }), [ox + 100 + 600 * p, oy]], { close: true, fill: 0.12 * (1 - ph(t, 6, 7)), width: 0 });
          g.curve(f, ox + 100, ox + 100 + 600 * p, { width: 4 });
          const c = ph(t, 6, 8);
          if (c > 0) g.path([[ox + 100, f(ox + 100)], [ox + 700, f(ox + 100) + 120], [ox + 700, f(ox + 700)], [ox + 100, f(ox + 700) - 160]], { close: true, fill: 0.15 * c, alpha: c });
        },
      },
      {
        title: 'Four processes',
        say: ['At constant temperature, isothermal. With no heat exchanged, adiabatic.', 'At constant volume, isochoric, where no work is done. At constant pressure, isobaric.'],
        draw: (g, t) => {
          const ox = 500, oy = 820;
          g.axes(ox, oy, 950, 500, { x: 'V', y: 'P', alpha: 0.6 });
          const s = (a: number) => ph(t, a, a + 1);
          g.curve((x) => oy - 60000 / (x - ox + 60), ox + 80, ox + 80 + 700 * s(0.5), { width: 3 });
          g.curve((x) => oy - 60000 * Math.pow(140 / (x - ox + 60), 1.4) / 140, ox + 80, ox + 80 + 700 * s(2), { width: 3, alpha: 0.6, dash: [10, 6] });
          g.line(ox + 600, oy - 80, ox + 600, oy - 80 - 300 * s(4), { width: 3 });
          g.line(ox + 150, oy - 420, ox + 150 + 600 * s(5.5), oy - 420, { width: 3 });
          g.text('isothermal', ox + 800, oy - 120, { size: 26, alpha: s(0.5) * 0.7 });
          g.text('adiabatic', ox + 800, oy - 40, { size: 26, alpha: s(2) * 0.7 });
          g.text('isochoric', ox + 640, oy - 300, { size: 26, alpha: s(4) * 0.7, align: 'left' });
          g.text('isobaric', ox + 450, oy - 450, { size: 26, alpha: s(5.5) * 0.7 });
        },
      },
      {
        title: 'Engines',
        say: ['An engine takes heat from a hot source, turns some into work, and dumps the rest into a cold sink.', 'It can never turn all of it into work. That is the second law.', 'The best possible efficiency depends only on the two temperatures.'],
        eq: [{ at: 7, src: 'η = 1 − [ T _C | T _H ]' }],
        draw: (g, t) => {
          g.rect(760, 300, 400, 100, { fill: 0.25 });
          g.text('hot  T_H', 960, 365, { size: 32 });
          g.rect(760, 780, 400, 100, { fill: 0.08 });
          g.text('cold  T_C', 960, 845, { size: 32 });
          g.circle(960, 590, 90, { width: 4 });
          g.line(960, 590, 960 + 70 * Math.cos(t * 2), 590 + 70 * Math.sin(t * 2), { width: 3 });
          const s = clamp(t / 2);
          g.arrow(960, 400, 960, 400 + 95 * s, { width: 10 * 1, label: '' });
          g.arrow(960, 680, 960, 680 + 95 * s, { width: 5 });
          g.arrow(1050, 590, 1050 + 280 * s, 590, { width: 6, label: 'W' });
          g.text('Q_H', 900, 460, { size: 30, font: 'italic', align: 'right' });
          g.text('Q_C', 900, 740, { size: 30, font: 'italic', align: 'right' });
        },
      },
      {
        title: 'Downhill only',
        say: ['Heat flows by itself from hot to cold, never the other way.', 'A fridge can move heat uphill, but only by doing work, and it warms the kitchen as it does.'],
        draw: (g, t) => {
          g.rect(500, 450, 360, 300, { fill: 0.3 });
          g.rect(1060, 450, 360, 300, { fill: 0.06 });
          const x = 860 + ((t * 120) % 200);
          g.arrow(x - 40, 600, x + 20, 600, { width: 5 });
          g.text('hot', 680, 820, { size: 30 });
          g.text('cold', 1240, 820, { size: 30 });
        },
      },
    ],
  });
