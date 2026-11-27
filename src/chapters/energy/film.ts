import { buildChapterFilm, ph, clamp } from '../film/engine';

/** Work, energy and power. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'Where does the energy go?',
    subtitle: 'Work, energy and power.',
    shots: [
      {
        title: 'Work',
        say: ['A force does work when it moves something along its own direction.', 'Only the part of the force along the motion counts.', 'Carry a bag level across a room, and gravity does no work at all.'],
        eq: [{ at: 2, src: 'W = F · s · cos θ' }],
        draw: (g, t) => {
          const x = 400 + ((120 * t) % 1100);
          g.ground(200, 760, 1720, 760, 0.5);
          g.block(x, 700, 120, 120);
          const ang = 0.6;
          g.arrow(x + 60, 640, x + 60 + 260 * Math.cos(ang), 640 - 260 * Math.sin(ang), { label: 'F' });
          const s = ph(t, 3, 4);
          g.arrow(x + 60, 640, x + 60 + 260 * Math.cos(ang), 640, { alpha: s * 0.7, dash: [8, 6] });
          g.arrow(400, 840, x, 840, { alpha: 0.6, width: 2 });
          g.text('s', (400 + x) / 2, 890, { size: 36, font: 'italic' });
        },
      },
      {
        title: 'Kinetic energy',
        say: ['Push a block from rest, and the work you do turns into energy of motion.', 'It grows with the square of the speed. Twice as fast means four times the energy.', 'This is the work-energy theorem: net work equals the change in kinetic energy.'],
        eq: [
          { at: 2, src: 'K = ½ · m · v ^2' },
          { at: 8, src: 'W _net = Δ K' },
        ],
        draw: (g, t) => {
          const ox = 500, oy = 820;
          g.axes(ox, oy, 900, 500, { x: 'v', y: 'K', alpha: 0.6 });
          const h = clamp(t / 4);
          g.curve((x) => oy - 0.0012 * (x - ox) ** 2, ox, ox + 640 * h, { width: 4 });
          if (t > 4) {
            const s = ph(t, 4, 5);
            g.line(ox + 320, oy, ox + 320, oy - 123, { alpha: s * 0.5, dash: [6, 6] });
            g.line(ox + 640, oy, ox + 640, oy - 491, { alpha: s * 0.5, dash: [6, 6] });
            g.text('v', ox + 320, oy + 50, { size: 32, font: 'italic', alpha: s });
            g.text('2v', ox + 640, oy + 50, { size: 32, font: 'italic', alpha: s });
            g.text('4×', ox + 700, oy - 480, { size: 36, alpha: s });
          }
        },
      },
      {
        title: 'Stored energy',
        say: ['Lift a ball, and the work you do is stored as potential energy.', 'Let it fall, and that store empties into kinetic energy.', 'Without friction, the total stays exactly the same the whole way down.'],
        eq: [{ at: 2, src: 'U = m · g · h' }, { at: 8, src: 'K + U = constant' }],
        draw: (g, t) => {
          const tt = t % 5;
          const h = 1 - Math.min(1, (tt / 2.2) ** 2);
          const y = 820 - 460 * h;
          g.ground(400, 840, 1000, 840, 0.6);
          g.ball(700, y - 20, 22);
          const bx = 1200, by = 820, H = 460;
          g.rect(bx, by - H * h, 100, H * h, { fill: 0.6, width: 0 });
          g.rect(bx + 160, by - H * (1 - h), 100, H * (1 - h), { fill: 0.25, width: 0 });
          g.rect(bx + 360, by - H, 100, H, { alpha: 0.6 });
          g.text('U', bx + 50, by + 50, { size: 34, font: 'italic' });
          g.text('K', bx + 210, by + 50, { size: 34, font: 'italic' });
          g.text('total', bx + 410, by + 50, { size: 28 });
        },
      },
      {
        title: 'Springs',
        say: ['A stretched spring stores energy too, half k x squared.', 'Release it and a block shoots off, carrying that energy as motion.'],
        eq: [{ at: 1.5, src: 'U = ½ · k · x ^2' }],
        draw: (g, t) => {
          const c = clamp(t / 3);
          const rel = t > 4;
          const tip = rel ? Math.min(800, 600 + (t - 4) * 500) : 800 - 200 * c;
          const bx = rel ? 860 + (t - 4) * 500 : tip + 60;
          g.ground(300, 760, 1720, 760, 0.6);
          g.line(400, 600, 400, 760, { alpha: 0.6 });
          g.spring(400, 700, tip, 700, { coils: 10 });
          g.block(bx, 700, 120, 110);
        },
      },
      {
        title: 'Power',
        say: ['Power is how fast work is done, in joules per second, or watts.', 'Two people climb the same stairs. Same work, but the one who runs uses more power.'],
        eq: [{ at: 1.5, src: 'P = [ W | t ] = F · v' }],
        draw: (g, t) => {
          for (let k = 0; k < 8; k++) g.path([[400 + k * 140, 860 - k * 70], [540 + k * 140, 860 - k * 70], [540 + k * 140, 790 - k * 70]], { alpha: 0.5 });
          const a = Math.min(7.99, (t * 2.2) % 10);
          const b = Math.min(7.99, (t * 0.9) % 10);
          g.ball(470 + Math.floor(a) * 140, 830 - Math.floor(a) * 70, 18);
          g.ball(470 + Math.floor(b) * 140, 830 - Math.floor(b) * 70, 18, 0.5);
        },
      },
    ],
  });
