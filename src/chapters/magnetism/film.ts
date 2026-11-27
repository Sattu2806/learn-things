import { buildChapterFilm, ph, TAU, type Gfx } from '../film/engine';

/** Moving charges and magnetism: the sideways force, circles, the field of a current and the motor. */

/** A field line into the page: a cross in a circle. */
function cross(g: Gfx, x: number, y: number, s: number, a: number) {
  g.circle(x, y, s * 1.7, { alpha: a, width: 2 });
  g.line(x - s, y - s, x + s, y + s, { alpha: a, width: 2 });
  g.line(x - s, y + s, x + s, y - s, { alpha: a, width: 2 });
}

/** A field line out of the page: a dot in a circle. */
function dot(g: Gfx, x: number, y: number, s: number, a: number) {
  g.circle(x, y, s * 1.7, { alpha: a, width: 2 });
  g.circle(x, y, s * 0.5, { fill: 1, alpha: a, width: 0 });
}

const breathe = (t: number, k: number) => 0.28 + 0.2 * Math.sin(2.2 * t + k);

export const buildFilm = () =>
  buildChapterFilm({
    title: 'The sideways force',
    subtitle: 'Moving charges and magnetism.',
    shots: [
      {
        title: 'A push that is always sideways',
        say: [
          'Send a charge through a magnetic field, here pointing into the page.',
          'It feels a force at right angles to both its motion and the field, so its path bends.',
          'A positive charge curves one way, a negative charge the other.',
          'The force depends on the speed across the field, F equals q v B sine theta.',
        ],
        eq: [
          { at: 4, src: 'F = q · v · B · sin θ' },
          { at: 11, src: 'F = q · ( v × B )' },
        ],
        draw: (g, t) => {
          const x0 = 480, y0 = 690, R = 170, sp = 210;
          for (let r = 0; r < 4; r++)
            for (let c = 0; c < 9; c++) cross(g, x0 + 90 + c * 125, 400 + r * 170, 9, breathe(t, r * 2 + c));
          g.rect(x0, 330, 1260, 640, { alpha: 0.35, width: 2, dash: [10, 10] });
          const u = t % 10;
          const tin = (x0 - 220) / sp;
          [1, -1].forEach((sg) => {
            const pts: [number, number][] = [];
            const pos = (tt: number): [number, number] => {
              if (tt <= tin) return [220 + sp * tt, y0];
              const psi = Math.min(Math.PI, (sp / R) * (tt - tin));
              const ex = Math.max(0, tt - tin - (Math.PI * R) / sp);
              return [x0 + R * Math.sin(psi) - sp * ex, y0 - sg * R * (1 - Math.cos(psi))];
            };
            const tt = Math.max(0, u - 0.6);
            for (let k = 0; k <= 80; k++) pts.push(pos((tt * k) / 80));
            g.path(pts, { alpha: sg > 0 ? 0.9 : 0.5, width: 3 });
            const [bx, by] = pos(tt);
            g.ball(bx, by, 16);
            g.text(sg > 0 ? '+' : '−', bx - 30, by - 22, { size: 40, font: 'italic' });
            const psi = (sp / R) * (tt - tin);
            if (tt > tin && psi < Math.PI) {
              const a = ph(tt, tin, tin + 0.5);
              g.arrow(bx, by, bx + 90 * Math.cos(psi), by - 90 * sg * Math.sin(psi), { alpha: 0.6 * a, width: 3, label: 'v' });
              g.arrow(bx, by, bx - 110 * Math.sin(psi), by - sg * 110 * Math.cos(psi), { alpha: a, width: 4, label: 'F' });
            }
          });
          g.text('B into the page', 1600, 380, { size: 30, alpha: 0.6 });
        },
      },
      {
        title: 'Circles',
        say: [
          'Because the force is always sideways, it never changes the speed. It only turns the charge, round and round in a circle.',
          'The magnetic force is the centripetal force, so the radius is m v over q B.',
          'A faster charge takes a wider circle, but travels faster round it.',
          'The two cancel, and the time for one lap, two pi m over q B, does not depend on speed at all.',
        ],
        eq: [
          { at: 4, src: 'r = [ m · v | q · B ]' },
          { at: 12, src: 'T = [ 2 · π · m | q · B ]' },
        ],
        draw: (g, t) => {
          const cx = 960, cy = 650;
          for (let r = 0; r < 4; r++) for (let c = 0; c < 11; c++) cross(g, 360 + c * 120, 420 + r * 150, 8, breathe(t, r * 3 + c) * 0.6);
          const T = 4;
          [100, 200, 290].forEach((R, i) => {
            g.circle(cx, cy, R, { alpha: 0.35, width: 2 });
            const a = (TAU * t) / T;
            const trail: [number, number][] = [];
            for (let k = 0; k <= 30; k++) trail.push([cx + R * Math.cos(a - k * 0.04), cy - R * Math.sin(a - k * 0.04)]);
            g.path(trail, { alpha: 0.9, width: 3 });
            g.ball(cx + R * Math.cos(a), cy - R * Math.sin(a), 15);
            g.text(`${i + 1}v`, cx + R + 38, cy - 12 - i * 0, { size: 30, font: 'italic', alpha: 0.7 });
          });
          g.line(cx, cy, cx + 330, cy, { alpha: 0.4, dash: [8, 8], width: 2 });
          const flash = Math.max(0, 1 - ((t % T) / 0.4));
          g.circle(cx + 290, cy, 34, { alpha: flash * 0.8, width: 3 });
          g.text('all three return together', cx, 990, { size: 30, alpha: 0.6 * ph(t, 9, 11) });
        },
      },
      {
        title: 'A current makes a field',
        say: [
          'The reverse is also true: a moving charge makes a magnetic field.',
          'Around a long straight wire the field runs in circles, in the direction of your right-hand fingers when the thumb points along the current.',
          'It is strongest near the wire and falls off as one over the distance.',
        ],
        eq: [{ at: 8, src: 'B = [ μ _0 · I | 2 · π · d ]' }],
        draw: (g, t) => {
          const cx = 960, cy = 640;
          dot(g, cx, cy, 14, 0.5 + 0.4 * Math.sin(3 * t));
          g.text('I', cx + 40, cy - 30, { size: 36, font: 'italic', alpha: 0.7 });
          [95, 190, 285].forEach((R, i) => {
            g.circle(cx, cy, R, { alpha: 0.35, width: 2 });
            const w = 2.4 / (R / 95);
            for (let j = 0; j < 4; j++) {
              const a = (j * TAU) / 4 + w * t + i;
              const px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
              g.arrow(px + 22 * Math.sin(a), py + 22 * Math.cos(a), px - 22 * Math.sin(a), py - 22 * Math.cos(a), { alpha: ph(t, 1.5 + i * 0.6, 2.5 + i * 0.6), width: 4, head: 18 });
            }
          });
          const s = ph(t, 12, 14);
          g.line(cx, cy + 12, cx + 95, cy + 12, { alpha: 0.7 * s, width: 3 });
          g.line(cx, cy + 40, cx + 190, cy + 40, { alpha: 0.7 * s, width: 3 });
          g.text('d', cx + 48, cy + 72, { size: 32, font: 'italic', alpha: s });
          g.text('2d', cx + 98, cy + 100, { size: 32, font: 'italic', alpha: s });
        },
      },
      {
        title: 'The solenoid',
        say: [
          'Wind the wire into a long coil, a solenoid.',
          'Inside, the fields of all the turns add up to a strong, straight, uniform field. Outside, they nearly cancel.',
          'Ampère\'s law gives the strength: B equals mu naught times the turns per metre times the current.',
          'That is a bar magnet you can switch on and off.',
        ],
        eq: [{ at: 7, src: 'B = μ _0 · n · I' }],
        draw: (g, t) => {
          const x1 = 420, x2 = 1500, yt = 560, yb = 800, ym = 680;
          const n = 13;
          for (let i = 0; i < n; i++) {
            const x = x1 + 30 + (i * (x2 - x1 - 60)) / (n - 1);
            const a = ph(t, 0.3 + i * 0.1, 0.9 + i * 0.1) * (0.5 + 0.4 * Math.sin(2.5 * t - i * 0.5));
            dot(g, x, yt, 10, a);
            cross(g, x, yb, 10, a);
          }
          const f = ph(t, 4, 6);
          for (let lane = 0; lane < 5; lane++)
            for (let j = 0; j < 4; j++) {
              const y = yt + 40 + lane * 40;
              const px = x1 + 40 + ((t * 170 + j * 270 + lane * 50) % 1080) * 0.98;
              g.arrow(px - 24, y, px + 24, y, { alpha: 0.85 * f, width: 3.5, head: 16 });
            }
          const out = ph(t, 6, 8) * 0.28;
          [-1, 1].forEach((sg) => {
            g.curve((x) => ym + sg * (110 + 190 * Math.sqrt(Math.max(0, 1 - ((x - 960) / 640) ** 2))), x1 - 60, x2 + 60, { alpha: out, dash: [10, 12], n: 120 });
          });
          g.text('inside: strong and uniform', 960, ym + 20, { size: 30, alpha: 0.6 * f });
          g.text('outside: almost nothing', 960, 970, { size: 30, alpha: 0.5 * ph(t, 7, 9) });
        },
      },
      {
        title: 'Wires pull on wires',
        say: [
          'Each wire sits in the field of the other, so each feels a force.',
          'Currents in the same direction attract. Currents in opposite directions repel.',
          'The force on each metre is mu naught I one I two over two pi d, and it defines the ampere.',
        ],
        eq: [{ at: 7, src: '[ F | L ] = [ μ _0 · I _1 · I _2 | 2 · π · d ]' }],
        draw: (g, t) => {
          const panels: [number, boolean, string][] = [
            [520, true, 'same direction: attract'],
            [1400, false, 'opposite: repel'],
          ];
          panels.forEach(([cx, same, name]) => {
            const s = 0.5 - 0.5 * Math.cos((TAU * t) / 8);
            const d = same ? 300 - 150 * s : 150 + 150 * s;
            const xa = cx - d / 2, xb = cx + d / 2, y = 600;
            [xa, xb].forEach((x, i) => {
              g.circle(x, y, 70, { alpha: 0.18, width: 2 });
              if (same || i === 0) dot(g, x, y, 18, 0.9);
              else cross(g, x, y, 18, 0.9);
            });
            const F = 18000 / d;
            const dir = same ? 1 : -1;
            g.arrow(xa + 30 * dir, y + 150, xa + 30 * dir + dir * F * 0.5, y + 150, { alpha: ph(t, 2, 3), width: 5, label: 'F' });
            g.arrow(xb - 30 * dir, y + 150, xb - 30 * dir - dir * F * 0.5, y + 150, { alpha: ph(t, 2, 3), width: 5, label: 'F' });
            g.line(xa, y - 130, xb, y - 130, { alpha: 0.5, width: 2 });
            g.text('d', cx, y - 150, { size: 32, font: 'italic', alpha: 0.7 });
            g.text(name, cx, 900, { size: 30, alpha: 0.65 });
          });
        },
      },
      {
        title: 'The turning coil',
        say: [
          'Put a loop of current in a field. The forces on its two sides are equal and opposite, but not in line, so they make a torque.',
          'The torque is N I A B sine theta. It is largest when the coil is parallel to the field.',
          'Reverse the current every half turn and the coil keeps spinning: that is an electric motor.',
          'Let the coil twist against a spring instead, and the twist measures the current: a galvanometer.',
        ],
        eq: [{ at: 8, src: 'τ = N · I · A · B · sin θ' }],
        draw: (g, t) => {
          const cx = 640, cy = 640, w = 330;
          for (let i = -2; i <= 2; i++) {
            const o = 12 * Math.sin(3 * t - i * 0.4);
            g.arrow(250 + o, cy + i * 110, 380 + o, cy + i * 110, { alpha: 0.4, width: 3 });
          }
          g.text('B', 270, 340, { size: 40, font: 'italic', alpha: 0.7 });
          const beta = (TAU * t) / 6;
          const dx = (w / 2) * Math.sin(beta), dy = (w / 2) * Math.cos(beta);
          const e1: [number, number] = [cx + dx, cy - dy];
          const e2: [number, number] = [cx - dx, cy + dy];
          g.line(e1[0], e1[1], e2[0], e2[1], { width: 6 });
          dot(g, e1[0], e1[1], 12, 1);
          cross(g, e2[0], e2[1], 12, 1);
          const F = 130;
          g.arrow(e1[0] + 44, e1[1], e1[0] + 44, e1[1] - F, { alpha: 0.9, width: 5, label: 'F' });
          g.arrow(e2[0] - 44, e2[1], e2[0] - 44, e2[1] + F, { alpha: 0.9, width: 5, label: 'F' });
          g.ball(cx, cy, 12);
          // The torque, shown as a sine pulse over time (a commutator flips the sign every half turn).
          const ox = 1060, oy = 760, gw = 640, gh = 200;
          g.axes(ox, oy, gw, gh + 40, { x: 't', y: 'τ', alpha: 0.6 });
          const a = ph(t, 3, 5);
          g.curve((x) => oy - gh * Math.abs(Math.sin((TAU * (x - ox)) / gw)), ox, ox + gw * Math.min(1, (t % 6) / 6 + 0.001), { alpha: 0.9 * a, n: 300 });
          const tx = ox + gw * ((t % 6) / 6);
          g.ball(tx, oy - gh * Math.abs(Math.sin(beta)), 12, a);
          g.text('commutator: torque never changes sign', 1380, 880, { size: 28, alpha: 0.6 * ph(t, 7, 9) });
        },
      },
    ],
  });
