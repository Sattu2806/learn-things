import { buildChapterFilm, ph } from '../film/engine';

/** Rotational motion: torque, moment of inertia, angular momentum, rolling. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'How do things spin?',
    subtitle: 'Torque, moment of inertia and angular momentum.',
    shots: [
      {
        title: 'Torque',
        say: ['Push a door near its hinge and it barely moves. Push at the handle and it swings easily.', 'The turning effect of a force is its torque: force times the lever arm.'],
        eq: [{ at: 4, src: 'τ = r · F · sin θ' }],
        draw: (g, t) => {
          const near = t < 4;
          const a = near ? 0.05 * ph(t, 1, 3) : 0.05 + 1.0 * ph(t, 4, 8);
          const hx = 600, hy = 600;
          g.circle(hx, hy, 10, { fill: 1, width: 0 });
          const L = 700;
          g.line(hx, hy, hx + L * Math.cos(a), hy + L * Math.sin(a), { width: 10 });
          const r = near ? 120 : 660;
          const px = hx + r * Math.cos(a), py = hy + r * Math.sin(a);
          g.arrow(px + 200 * Math.sin(a), py - 200 * Math.cos(a), px, py, { label: 'F' });
        },
      },
      {
        title: 'Moment of inertia',
        say: ['Mass resists changes in motion. For turning, what matters is how far the mass is from the axis.', 'Two wheels of the same mass: the one with mass at the rim is harder to spin up.'],
        eq: [{ at: 4, src: 'I = Σ m · r ^2' }, { at: 8, src: 'τ = I · α' }],
        draw: (g, t) => {
          [[640, 1], [1280, 0]].forEach(([cx, rim]) => {
            const a = (rim ? 0.15 : 0.4) * t * t;
            g.circle(cx, 600, 220, { alpha: 0.5 });
            for (let k = 0; k < 6; k++) {
              const b = a + (k * Math.PI) / 3;
              const r = rim ? 200 : 70;
              g.ball(cx + r * Math.cos(b), 600 + r * Math.sin(b), 16);
            }
            g.text(rim ? 'mass at rim: slow' : 'mass near axis: fast', cx, 900, { size: 30, alpha: 0.6 });
          });
        },
      },
      {
        title: 'Angular momentum',
        say: ['A spinning skater pulls in her arms. Her moment of inertia drops.', 'With no outside torque, angular momentum is kept, so she spins faster.'],
        eq: [{ at: 4, src: 'L = I · ω = constant' }],
        draw: (g, t) => {
          const pull = ph(t, 2, 4);
          const r = 300 - 200 * pull;
          const w = 1 + 6 * pull * pull;
          const a = t < 2 ? t : 2 + ((t - 2) * (1 + w)) / 2;
          g.circle(960, 600, 30, { fill: 0.3 });
          [0, Math.PI].forEach((o) => {
            const x = 960 + r * Math.cos(a * 1.5 + o), y = 600 + r * 0.35 * Math.sin(a * 1.5 + o);
            g.line(960, 600, x, y, { width: 6 });
            g.ball(x, y, 18);
          });
        },
      },
      {
        title: 'Rolling',
        say: ['A rolling wheel turns and moves at once. Without slipping, its speed equals omega r.', 'The bottom point is momentarily at rest, the top moves at twice the speed.'],
        eq: [{ at: 3, src: 'v = ω · R' }],
        draw: (g, t) => {
          const R = 160;
          const x = 400 + 140 * (t % 8);
          const a = (140 * (t % 8)) / R;
          g.ground(200, 760, 1720, 760, 0.5);
          g.circle(x, 760 - R, R, { width: 4 });
          g.line(x, 760 - R, x + R * Math.sin(a), 760 - R - R * Math.cos(a), { alpha: 0.6 });
          g.arrow(x, 760 - 2 * R, x + 240, 760 - 2 * R, { label: '2v', alpha: ph(t, 3, 4) });
          g.arrow(x, 760 - R, x + 120, 760 - R, { label: 'v', alpha: ph(t, 3, 4) });
          g.circle(x, 760, 8, { fill: 1, width: 0, alpha: ph(t, 3, 4) });
        },
      },
    ],
  });
