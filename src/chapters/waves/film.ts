import { buildChapterFilm, ph } from '../film/engine';

/** Waves: travelling disturbances, standing waves, sound, beats and Doppler. */

const pulse = (x: number, t: number) => {
  const m = (((x - 300 - 300 * t) % 1800) + 1800) % 1800;
  const d = Math.min(m, 1800 - m);
  return 600 - 160 * Math.exp(-((d / 80) ** 2));
};

export const buildFilm = () =>
  buildChapterFilm({
    title: 'What travels in a wave?',
    subtitle: 'Waves, sound and the Doppler effect.',
    shots: [
      {
        title: 'Shape moves, stuff stays',
        say: ['Flick a rope, and a bump runs along it.', 'Each bit of rope only moves up and down. Only the shape and the energy travel.'],
        draw: (g, t) => {
          g.curve((x) => pulse(x, t), 200, 1720, { width: 4 });
          const x = 960;
          g.ball(x, pulse(x, t), 14);
        },
      },
      {
        title: 'Wavelength and speed',
        say: ['A steady wave repeats in space every wavelength, lambda, and in time every period.', 'In one period the wave moves one wavelength, so its speed is frequency times wavelength.'],
        eq: [{ at: 4, src: 'v = f · λ' }],
        draw: (g, t) => {
          const k = (2 * Math.PI) / 400;
          g.curve((x) => 600 - 140 * Math.sin(k * x - 2 * t), 200, 1720, { width: 4 });
          const s = ph(t, 2, 3);
          g.line(560, 420, 960, 420, { alpha: s });
          g.text('λ', 760, 400, { size: 40, font: 'italic', alpha: s });
        },
      },
      {
        title: 'Standing waves',
        say: ['Two equal waves running opposite ways add up to a standing wave.', 'Some points never move: nodes. Between them, antinodes swing hardest.', 'A guitar string fixed at both ends can only hold whole numbers of half wavelengths.'],
        eq: [{ at: 8, src: 'L = n · [ λ | 2 ]' }],
        draw: (g, t) => {
          const n = t < 8 ? 2 : 1 + Math.floor((t - 8) / 2.5) % 3;
          const L = 1200;
          g.curve((x) => 600 - 160 * Math.sin((n * Math.PI * (x - 360)) / L) * Math.cos(3 * t), 360, 360 + L, { width: 4 });
          g.curve((x) => 600 + 160 * Math.sin((n * Math.PI * (x - 360)) / L), 360, 360 + L, { alpha: 0.2, dash: [8, 8] });
          g.curve((x) => 600 - 160 * Math.sin((n * Math.PI * (x - 360)) / L), 360, 360 + L, { alpha: 0.2, dash: [8, 8] });
          g.circle(360, 600, 10, { fill: 1, width: 0 });
          g.circle(360 + L, 600, 10, { fill: 1, width: 0 });
        },
      },
      {
        title: 'Sound and beats',
        say: ['Sound is a pressure wave: air squeezed and stretched along the direction it travels.', 'Play two notes of nearly equal pitch, and the loudness swells and fades. Those are beats.'],
        eq: [{ at: 6, src: 'f _beat = f _1 − f _2' }],
        draw: (g, t) => {
          if (t < 5) {
            for (let k = 0; k < 60; k++) {
              const x0 = 300 + k * 22;
              const x = x0 + 12 * Math.sin(x0 / 60 - 4 * t);
              g.line(x, 480, x, 720, { alpha: 0.6, width: 2 });
            }
          } else {
            g.curve((x) => 600 - 120 * Math.sin(x / 9 - 6 * t) * Math.cos(x / 180), 200, 1720, { width: 2, n: 1200 });
            g.curve((x) => 600 - 120 * Math.abs(Math.cos(x / 180)), 200, 1720, { alpha: 0.3, dash: [8, 8] });
          }
        },
      },
      {
        title: 'The Doppler effect',
        say: ['A siren moving toward you bunches its waves up, so you hear a higher pitch.', 'Moving away, the waves stretch out and the pitch drops.'],
        draw: (g, t) => {
          const v = 120;
          const sx = 500 + v * t;
          for (let k = 0; k < 14; k++) {
            const te = t - k * 0.5;
            if (te < 0) continue;
            g.circle(500 + v * te, 600, 300 * (t - te), { alpha: 0.5, width: 2 });
          }
          g.ball(sx, 600, 16);
          g.text('higher', 1650, 900, { size: 30, alpha: 0.6 });
          g.text('lower', 270, 900, { size: 30, alpha: 0.6 });
        },
      },
    ],
  });
