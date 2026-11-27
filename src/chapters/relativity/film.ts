import { buildChapterFilm, ph, TAU, type Gfx } from '../film/engine';

/** Special relativity: two rules, the light clock, shrinking rulers, simultaneity, muons and E = mc². */

const gam = (b: number) => 1 / Math.sqrt(1 - b * b);
const tri = (t: number, period: number) => {
  const p = (((t % period) + period) % period) / period;
  return p < 0.5 ? 2 * p : 2 - 2 * p;
};

function lightClock(g: Gfx, x: number, top: number, bot: number, photonY: number, a = 1) {
  g.line(x - 70, top, x + 70, top, { alpha: a, width: 4 });
  g.line(x - 70, bot, x + 70, bot, { alpha: a, width: 4 });
  g.ball(x, photonY, 13, a);
}

export const buildFilm = () =>
  buildChapterFilm({
    title: 'Why do clocks and rulers change with speed?',
    subtitle: 'Special relativity from two simple rules.',
    shots: [
      {
        title: 'Two rules',
        say: [
          'Rule one: the laws of physics are the same for everyone moving at a steady speed.',
          'Rule two: everyone measures the same speed for light, whatever their own motion.',
          'Throw a ball forward from a moving train and the speeds add. A flash of light does not obey that. Its speed stays c.',
        ],
        eq: [{ at: 8, src: 'c = 3.00 × 10 ^8 "m/s"' }],
        draw: (g, t) => {
          const e = 2;
          const k = Math.max(0, t - e);
          const cx = 420 + 50 * t;
          const front0 = 420 + 50 * e + 130;
          [520, 760].forEach((y, i) => {
            g.line(200, y + 60, 1720, y + 60, { alpha: 0.5 });
            g.block(cx, y, 260, 90);
            if (i === 0 && k > 0) {
              const x = front0 + 150 * k;
              if (x < 1700) g.ball(x, y - 10, 16);
            }
            if (i === 1 && k > 0) {
              const x = front0 + 420 * k;
              const gx = front0 + 470 * k;
              if (x < 1700) g.ball(x, y - 10, 16);
              if (gx < 1700) g.circle(gx, y - 10, 14, { alpha: 0.4, dash: [6, 6] });
            }
          });
          g.text('ball: the speeds add', 200, 410, { size: 34, alpha: ph(t, 1, 2), align: 'left' });
          g.text('light: still c, not c + u', 200, 650, { size: 34, alpha: ph(t, 1, 2), align: 'left' });
          g.text('the dashed circle never happens', 1720, 900, { size: 30, alpha: 0.6 * ph(t, 7, 8), align: 'right' });
        },
      },
      {
        title: 'The light clock',
        say: [
          'A light clock ticks each time a flash goes up to a mirror and back down.',
          'When the clock is moving sideways, the flash has to follow a slanting path. A longer path at the same speed c takes longer.',
          'So the moving clock ticks more slowly than the one at rest.',
          'The factor is gamma, and it is always more than one.',
        ],
        eq: [
          { at: 3, src: 'Δt _0 = [ 2 · L | c ]' },
          { at: 8, src: 'Δt = [ 2 · L | √[ c ^2 − v ^2 ] ]' },
          { at: 14, src: 'Δt = γ · Δt _0' },
        ],
        draw: (g, t) => {
          const L = 260;
          const top = 480;
          const bot = top + L;
          const rx = 480;
          lightClock(g, rx, top, bot, bot - L * tri(t, 2));
          g.text('at rest', rx, bot + 90, { size: 32, alpha: 0.7 });
          g.text(`ticks ${Math.floor(t / 2)}`, rx, bot + 140, { size: 30, font: 'mono', alpha: 0.6 });
          g.line(780, top - 40, 780, bot + 160, { alpha: 0.25, dash: [8, 10] });
          const s = t % 5;
          const x0 = 900;
          const v = 156;
          const mx = x0 + v * s;
          lightClock(g, mx, top, bot, bot - L * tri(s, 2.5));
          const pts: [number, number][] = [];
          for (let q = 0; q <= s; q += 0.05) pts.push([x0 + v * q, bot - L * tri(q, 2.5)]);
          g.path(pts, { alpha: 0.5, width: 2.5 });
          g.text('moving', mx, bot + 90, { size: 32, alpha: 0.7 });
          g.text(`ticks ${Math.floor(s / 2.5)}`, mx, bot + 140, { size: 30, font: 'mono', alpha: 0.6 });
        },
      },
      {
        title: 'Slower clocks, shorter rulers',
        say: [
          'The factor gamma depends only on the speed as a fraction of c. For walking, driving and flying it is one, to many decimal places.',
          'Near the speed of light it climbs without limit.',
          'The same factor shortens lengths. A ship moving past you is measured shorter along its motion, by the factor gamma.',
        ],
        eq: [
          { at: 2, src: 'γ = [ 1 | √[ 1 − [ v ^2 | c ^2 ] ] ]' },
          { at: 11, src: 'L = [ L _0 | γ ]' },
        ],
        draw: (g, t) => {
          const ox = 200;
          const oy = 860;
          g.axes(ox, oy, 760, 480, { x: 'v / c', y: 'γ', alpha: 0.6 });
          const X = (b: number) => ox + 700 * b;
          const Y = (b: number) => oy - ((gam(b) - 1) / 6) * 440;
          const b = 0.97 * ph(t, 1, 9);
          const pts: [number, number][] = [];
          for (let q = 0; q <= b; q += 0.005) pts.push([X(q), Y(q)]);
          g.path(pts, { alpha: 0.9, width: 4 });
          g.ball(X(b), Y(b), 14);
          g.line(X(1), oy, X(1), oy - 470, { alpha: 0.3, dash: [8, 10] });
          g.text(`γ = ${gam(b).toFixed(2)}`, 260, 400, { size: 36, font: 'mono', alpha: 0.8, align: 'left' });
          g.text(`v = ${b.toFixed(2)} c`, 260, 450, { size: 36, font: 'mono', alpha: 0.8, align: 'left' });
          const L0 = 560;
          const bb = 0.9 * ph(t, 7, 12);
          const L = L0 / gam(bb);
          const cx = 1380;
          const a = ph(t, 6, 7);
          g.rect(cx - L0 / 2, 560, L0, 4, { alpha: 0.3 * a, width: 0, fill: 1 });
          g.rect(cx - L / 2, 600, L, 110, { alpha: a, fill: 0.12 });
          g.text('at rest: L₀', cx, 520, { size: 34, alpha: 0.7 * a });
          g.text(`moving: L = ${(L / L0).toFixed(2)} L₀`, cx, 780, { size: 34, alpha: 0.8 * a });
        },
      },
      {
        title: 'Who flashed first?',
        say: [
          'A lamp flashes in the middle of a train. On the train, the light reaches both ends at the same moment.',
          'On the ground, the back wall is rushing toward the light and the front wall is running away from it.',
          'So the back wall is hit first. Two events that are simultaneous for one observer are not for another.',
        ],
        eq: [{ at: 8, src: 'Δt = [ L · v | c ^2 − v ^2 ]' }],
        draw: (g, t) => {
          const c = 300;
          const v = 120;
          const half = 280;
          const e = 1.5;
          const k = Math.max(0, t - e);
          const ring = (x: number, y: number, t0: number) => {
            const p = ph(t, t0, t0 + 0.8);
            if (p > 0 && p < 1) g.circle(x, y, 14 + 50 * p, { alpha: 1 - p, width: 2.5 });
          };
          const walls = (xc: number, y: number) => {
            g.line(xc - half, y - 70, xc - half, y + 70, { width: 4 });
            g.line(xc + half, y - 70, xc + half, y + 70, { width: 4 });
            g.line(xc - half, y - 70, xc + half, y - 70, { alpha: 0.5 });
            g.line(xc - half, y + 70, xc + half, y + 70, { alpha: 0.5 });
            g.ball(xc, y, 9);
          };
          // The train's frame.
          const y1 = 480;
          const tc = 960;
          const th = e + half / c;
          g.text("in the train's frame", 200, y1 - 120, { size: 32, alpha: 0.7, align: 'left' });
          walls(tc, y1);
          ring(tc, y1, e);
          if (t >= e && t < th) {
            g.ball(tc - c * k, y1, 12);
            g.ball(tc + c * k, y1, 12);
          }
          ring(tc - half, y1, th);
          ring(tc + half, y1, th);
          g.text('both at once', 1720, y1 - 120, { size: 32, alpha: 0.7 * ph(t, th + 0.3, th + 1), align: 'right' });
          // The ground's frame.
          const y2 = 800;
          const X0 = 760;
          const xc = X0 + v * (t - e);
          const tb = e + half / (c + v);
          const tf = e + half / (c - v);
          g.text("in the ground's frame", 200, y2 - 120, { size: 32, alpha: 0.7, align: 'left' });
          walls(xc, y2);
          ring(X0, y2, e);
          if (t >= e && t < tb) g.ball(X0 - c * k, y2, 12);
          if (t >= e && t < tf) g.ball(X0 + c * k, y2, 12);
          ring(xc - half, y2, tb);
          ring(xc + half, y2, tf);
          g.text('back first, then front', 1720, y2 - 120, { size: 32, alpha: 0.7 * ph(t, tf + 0.3, tf + 1), align: 'right' });
        },
      },
      {
        title: 'Muons',
        say: [
          'Muons made high in the atmosphere live only 2.2 microseconds. At nearly the speed of light, that is only 650 metres.',
          'Yet they reach the ground, over 3 kilometres down. For us, their clocks run slow, by a factor of about five.',
          'For the muon, its clock is normal, but the distance to the ground is contracted to 650 metres. Both stories agree.',
        ],
        eq: [
          { at: 3, src: 'd = v · τ _0' },
          { at: 8, src: 'd = v · γ · τ _0' },
        ],
        draw: (g, t) => {
          const p = ph(t, 2, 12);
          const px = 0.15;
          const top = 330;
          const gy = top + 3250 * px;
          g.text("Earth's frame", 480, 320, { size: 32, alpha: 0.7 });
          g.text("the muon's frame", 1440, 320, { size: 32, alpha: 0.7 });
          g.line(960, 300, 960, 900, { alpha: 0.2, dash: [8, 10] });
          g.ground(260, gy + 4, 760, gy + 4, 0.7);
          g.line(300, top + 647 * px, 700, top + 647 * px, { alpha: 0.4, dash: [10, 10] });
          g.text('647 m: without time dilation', 700, top + 647 * px - 14, { size: 28, alpha: 0.6 * ph(t, 1, 2), align: 'right' });
          const my = top + 3250 * px * p;
          g.ball(300, my, 16);
          g.arrow(360, my + 20, 360, gy - 4, { alpha: 0.5, width: 2.5 });
          g.text(`${(3250 * (1 - p)).toFixed(0)} m`, 390, (my + gy) / 2 + 10, { size: 30, font: 'mono', alpha: 0.7, align: 'left' });
          g.text(`Earth clock ${(11.06 * p).toFixed(1)} μs`, 480, gy + 55, { size: 28, font: 'mono', alpha: 0.6 });
          const by = top + 40;
          const gyr = by + 647 * px - 647 * px * p;
          g.circle(1200, by, 24 + 8 * Math.sin(TAU * t * 1.5), { alpha: 0.4, width: 2 });
          g.ball(1200, by, 16);
          g.ground(1000, gyr + 4, 1880, gyr + 4, 0.7);
          g.arrow(1260, by + 20, 1260, gyr - 4, { alpha: 0.5, width: 2.5 });
          g.text(`${(647 * (1 - p)).toFixed(0)} m`, 1290, (by + gyr) / 2 + 10, { size: 30, font: 'mono', alpha: 0.7, align: 'left' });
          g.text(`muon clock ${(2.2 * p).toFixed(1)} μs`, 1440, gy + 55, { size: 28, font: 'mono', alpha: 0.6 });
        },
      },
      {
        title: 'Mass is energy',
        say: [
          'The same thinking changes energy. A body at rest already holds energy, equal to its mass times c squared.',
          'An electron and a positron that meet vanish, and all of that energy leaves as light.',
          'A moving body has more: the rest energy times gamma. Energy, momentum and mass are tied by one right triangle.',
        ],
        eq: [
          { at: 3, src: 'E _0 = m · c ^2' },
          { at: 9, src: 'E = γ · m · c ^2' },
          { at: 14, src: 'E ^2 = ( p · c ) ^2 + ( m · c ^2 ) ^2' },
        ],
        draw: (g, t) => {
          const a1 = 1 - ph(t, 10, 11);
          if (a1 > 0.01) {
            const y = 600;
            const q = ph(t, 3, 5.5);
            const out = ph(t, 5.8, 9.5);
            const flash = ph(t, 5.6, 6.6);
            g.with({ alpha: a1 }, () => {
              if (t < 5.8) {
                g.ball(380 + 580 * q, y, 20);
                g.circle(1540 - 580 * q, y, 20, { width: 3 });
                g.text('e⁻', 380 + 580 * q, y - 50, { size: 38, font: 'italic' });
                g.text('e⁺', 1540 - 580 * q, y - 50, { size: 38, font: 'italic' });
              }
              if (flash > 0 && flash < 1) g.circle(960, y, 20 + 140 * flash, { alpha: 1 - flash, width: 3 });
              if (out > 0) {
                [-1, 1].forEach((dir) => {
                  const pts: [number, number][] = [];
                  for (let s = 0; s <= 560 * out; s += 8) pts.push([960 + dir * s, y + 16 * Math.sin(s / 14 - 10 * t) * Math.min(1, s / 40)]);
                  g.path(pts, { width: 3 });
                  g.ball(960 + dir * 560 * out, y, 9);
                });
              }
              g.text('0.511 MeV', 560, y + 100, { size: 32, font: 'mono', alpha: 0.7 * ph(t, 8.5, 9.5) });
              g.text('0.511 MeV', 1360, y + 100, { size: 32, font: 'mono', alpha: 0.7 * ph(t, 8.5, 9.5) });
            });
          }
          const a2 = ph(t, 11, 12);
          if (a2 > 0.01) {
            const unit = 200;
            const ax = 700;
            const ay = 860;
            const pc = 2 * (0.5 - 0.5 * Math.cos(TAU * Math.max(0, t - 11) / 8));
            const rx = ax + unit;
            const ty = ay - pc * unit;
            g.with({ alpha: a2 }, () => {
              g.line(ax, ay, rx, ay, { width: 4 });
              g.line(rx, ay, rx, ty, { alpha: 0.6 });
              g.line(ax, ay, rx, ty, { width: 4 });
              g.ball(rx, ty, 14);
              g.text('m c²', (ax + rx) / 2, ay + 60, { size: 38, font: 'italic' });
              g.text('p c', rx + 30, (ay + ty) / 2 + 12, { size: 38, font: 'italic', align: 'left' });
              g.text('E', (ax + rx) / 2 - 36, (ay + ty) / 2 - 10, { size: 38, font: 'italic' });
              g.text(`E = ${Math.sqrt(1 + pc * pc).toFixed(2)} mc²`, 1240, 560, { size: 34, font: 'mono', alpha: 0.8, align: 'left' });
              g.text(`p c = ${pc.toFixed(2)} mc²`, 1240, 620, { size: 34, font: 'mono', alpha: 0.8, align: 'left' });
            });
          }
        },
      },
    ],
  });
