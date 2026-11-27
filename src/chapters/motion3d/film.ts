import { buildChapterFilm, ph, DEG, TAU, clamp, type Gfx } from '../film/engine';

/** Motion in three dimensions: position, velocity, acceleration, a projectile in the wind, circles and helixes. */

type Pt = [number, number];
type V3 = [number, number, number];

/** Oblique view: x to the right, y into the page, z up. */
const view = (ox: number, oy: number, s: number) => (x: number, y: number, z: number): Pt => [ox + s * (x + 0.5 * y), oy - s * (z + 0.35 * y)];

const V0 = 20;
const TH = 40 * DEG;
const VX0 = V0 * Math.cos(TH);
const VZ0 = V0 * Math.sin(TH);
const G = 9.8;
const TT = (2 * VZ0) / G;

const pos = (u: number): V3 => [3 + 2.2 * Math.cos(u), 2.4 + 1.6 * Math.sin(u), 2.6 + 1.2 * Math.sin(2 * u)];

function flightScene(g: Gfx, t: number, wind: number, opts: { arrows?: boolean; ghost?: boolean }) {
  const s = 34;
  const P = view(140, 880, s);
  const tau = clamp((t - 1) * 0.9, 0, TT);
  const at = (q: number, w: number): V3 => [VX0 * q, 0.5 * w * q * q, VZ0 * q - 0.5 * G * q * q];
  const corner = [P(0, -1, 0), P(46, -1, 0), P(46, 9, 0), P(0, 9, 0)];
  g.path(corner, { close: true, alpha: 0.4, width: 2 });
  for (const gx of [10, 20, 30, 40]) {
    const a = P(gx, -1, 0);
    const b = P(gx, 9, 0);
    g.line(a[0], a[1], b[0], b[1], { alpha: 0.12, width: 2 });
  }
  const path = (w: number, zz: boolean) => {
    const out: Pt[] = [];
    for (let k = 0; k <= 60; k++) {
      const q = (tau * k) / 60;
      const p = at(q, w);
      out.push(P(p[0], p[1], zz ? 0 : p[2]));
    }
    return out;
  };
  if (opts.ghost) {
    const full: Pt[] = [];
    for (let k = 0; k <= 60; k++) {
      const p = at((TT * k) / 60, 0);
      full.push(P(p[0], p[1], p[2]));
    }
    g.path(full, { alpha: 0.3, width: 2.5, dash: [10, 10] });
  }
  g.path(path(wind, false), { alpha: 0.9, width: 4 });
  g.path(path(wind, true), { alpha: 0.4, width: 2.5, dash: [8, 8] });
  const r = at(tau, wind);
  const b = P(...r);
  const sh = P(r[0], r[1], 0);
  g.line(b[0], b[1], sh[0], sh[1], { alpha: 0.3, width: 2, dash: [6, 8] });
  if (opts.ghost) {
    const r0 = at(tau, 0);
    const b0 = P(...r0);
    g.circle(b0[0], b0[1], 14, { alpha: 0.5, width: 2.5 });
  }
  g.ball(b[0], b[1], 16);
  if (opts.arrows) {
    const vx = VX0;
    const vz = VZ0 - G * tau;
    const k = 11;
    g.arrow(b[0], b[1], b[0] + k * vx, b[1], { alpha: 0.8, width: 3, head: 20 });
    g.arrow(b[0], b[1], b[0], b[1] - k * vz, { alpha: 0.8, width: 3, head: 20 });
    g.text('vx', b[0] + k * vx + 40, b[1] + 12, { size: 38, font: 'italic', alpha: 0.9 });
    g.text('vz', b[0] + 30, b[1] - k * vz - 6, { size: 38, font: 'italic', alpha: 0.9, align: 'left' });
  }
  const done = ph(t, 1 + TT / 0.9, 1 + TT / 0.9 + 0.8);
  if (tau >= TT && done < 1) {
    const lp = P(VX0 * TT, 0.5 * wind * TT * TT, 0);
    g.circle(lp[0], lp[1], 10 + 40 * done, { alpha: 1 - done, width: 2.5 });
  }
  g.text(`t = ${tau.toFixed(2)} s`, 1800, 330, { size: 32, font: 'mono', alpha: 0.7, align: 'right' });
}

export const buildFilm = () =>
  buildChapterFilm({
    title: 'How do we describe motion in space?',
    subtitle: 'Position, velocity and acceleration in three dimensions.',
    shots: [
      {
        title: 'Three numbers for a place',
        say: [
          'To say where something is in space we need three numbers: how far along x, along y and along z.',
          'Together they make the position vector, an arrow from the origin to the point.',
          'Its length comes from Pythagoras, used twice: once across the floor, and once up the height.',
        ],
        eq: [
          { at: 3, src: 'r = x · i + y · j + z · k' },
          { at: 10, src: 'r = √[ x ^2 + y ^2 + z ^2 ]' },
        ],
        draw: (g, t) => {
          const P = view(380, 880, 125);
          const u = (TAU * (t % 12)) / 12;
          const [x, y, z] = pos(u);
          const o = P(0, 0, 0);
          const xe = P(6, 0, 0);
          const ye = P(0, 4.6, 0);
          const ze = P(0, 0, 4.6);
          g.arrow(o[0], o[1], xe[0], xe[1], { alpha: 0.5, width: 2.5, label: 'x' });
          g.arrow(o[0], o[1], ye[0], ye[1], { alpha: 0.5, width: 2.5, label: 'y' });
          g.arrow(o[0], o[1], ze[0], ze[1], { alpha: 0.5, width: 2.5, label: 'z' });
          const b = P(x, y, z);
          const f = P(x, y, 0);
          const fx = P(x, 0, 0);
          const fy = P(0, y, 0);
          g.line(b[0], b[1], f[0], f[1], { alpha: 0.4, width: 2, dash: [8, 8] });
          g.line(f[0], f[1], fx[0], fx[1], { alpha: 0.4, width: 2, dash: [8, 8] });
          g.line(f[0], f[1], fy[0], fy[1], { alpha: 0.4, width: 2, dash: [8, 8] });
          g.arrow(o[0], o[1], b[0], b[1], { width: 4 });
          g.ball(b[0], b[1], 16);
          g.text(`x = ${x.toFixed(2)} m`, 1400, 520, { size: 36, font: 'mono', alpha: 0.8, align: 'left' });
          g.text(`y = ${y.toFixed(2)} m`, 1400, 580, { size: 36, font: 'mono', alpha: 0.8, align: 'left' });
          g.text(`z = ${z.toFixed(2)} m`, 1400, 640, { size: 36, font: 'mono', alpha: 0.8, align: 'left' });
        },
      },
      {
        title: 'Velocity and acceleration',
        say: [
          'Velocity is the rate of change of the position vector. It always points along the path.',
          'Acceleration is the rate of change of the velocity vector. It changes the speed, the direction, or both.',
          'In components, each one just uses the ordinary one dimensional rules, one axis at a time.',
        ],
        eq: [
          { at: 3, src: 'v = [ dr | dt ]' },
          { at: 9, src: 'a = [ dv | dt ]' },
        ],
        draw: (g, t) => {
          const P = view(380, 880, 125);
          const w = TAU / 12;
          const u = w * (t % 12);
          const r = pos(u);
          const vel: V3 = [-2.2 * Math.sin(u) * w, 1.6 * Math.cos(u) * w, 2.4 * Math.cos(2 * u) * w];
          const acc: V3 = [-2.2 * Math.cos(u) * w * w, -1.6 * Math.sin(u) * w * w, -4.8 * Math.sin(2 * u) * w * w];
          const path: Pt[] = [];
          const floor: Pt[] = [];
          for (let k = 0; k <= 120; k++) {
            const q = pos((TAU * k) / 120);
            path.push(P(...q));
            floor.push(P(q[0], q[1], 0));
          }
          g.path(floor, { alpha: 0.2, width: 2, dash: [8, 10] });
          g.path(path, { alpha: 0.5, width: 3 });
          const b = P(...r);
          const sh = P(r[0], r[1], 0);
          g.line(b[0], b[1], sh[0], sh[1], { alpha: 0.3, width: 2, dash: [6, 8] });
          const vt = P(r[0] + 1.0 * vel[0], r[1] + 1.0 * vel[1], r[2] + 1.0 * vel[2]);
          g.arrow(b[0], b[1], vt[0], vt[1], { width: 4, label: 'v' });
          const a = ph(t, 8, 9);
          const at = P(r[0] + 1.6 * acc[0], r[1] + 1.6 * acc[1], r[2] + 1.6 * acc[2]);
          g.arrow(b[0], b[1], b[0] + (at[0] - b[0]) * a, b[1] + (at[1] - b[1]) * a, { alpha: 0.7 * a, width: 3, label: a > 0.9 ? 'a' : undefined });
          g.ball(b[0], b[1], 16);
        },
      },
      {
        title: 'Components are independent',
        say: [
          'Throw a ball. Along x, nothing pushes it, so the speed stays the same.',
          'Along z, gravity pulls it, so that component of velocity steadily falls, then reverses.',
          'Each axis follows its own simple rule. Put them together and the ball flies in an arc.',
        ],
        eq: [
          { at: 3, src: 'x = v _x0 · t' },
          { at: 9, src: 'z = v _z0 · t − [ 1 | 2 ] · g · t ^2' },
        ],
        draw: (g, t) => flightScene(g, t, 0, { arrows: true, ghost: false }),
      },
      {
        title: 'A sideways wind',
        say: [
          'Now add a steady sideways wind. It pushes along y only, and it makes no difference to x or to z.',
          'The ball drifts sideways, and the path on the ground is bent.',
          'It stays in the air for exactly the same time, since the time is decided by the vertical motion alone.',
        ],
        eq: [
          { at: 4, src: 'y = [ 1 | 2 ] · a _w · t ^2' },
          { at: 10, src: 'T = [ 2 · v _z0 | g ]' },
        ],
        draw: (g, t) => flightScene(g, t, 2, { arrows: false, ghost: true }),
      },
      {
        title: 'A circle in vectors',
        say: [
          'Take a point going round a circle at a steady speed. The position vector points outward from the centre.',
          'The velocity is tangent to the circle, at right angles to the position vector. Its size is omega R.',
          'The acceleration points back to the centre, and its size is omega squared R. The speed is steady, but the velocity is always changing.',
        ],
        eq: [
          { at: 3, src: 'r = R · ( cos θ , sin θ )' },
          { at: 10, src: 'a = − ω ^2 · r' },
        ],
        draw: (g, t) => {
          const cx = 760;
          const cy = 640;
          const R = 260;
          const th = (TAU * (t % 12)) / 12;
          const c = Math.cos(th);
          const s = Math.sin(th);
          const px = cx + R * c;
          const py = cy - R * s;
          g.circle(cx, cy, R, { alpha: 0.4, width: 2.5 });
          g.line(cx - R - 40, cy, cx + R + 40, cy, { alpha: 0.25, width: 2 });
          g.line(cx, cy - R - 40, cx, cy + R + 40, { alpha: 0.25, width: 2 });
          g.line(px, py, px, cy, { alpha: 0.3, width: 2, dash: [8, 8] });
          g.line(px, py, cx, py, { alpha: 0.3, width: 2, dash: [8, 8] });
          g.arrow(cx, cy, px, py, { alpha: 0.5, width: 3 });
          const a1 = ph(t, 5, 6);
          g.arrow(px, py, px - 150 * s * a1, py - 150 * c * a1, { alpha: a1, width: 4, label: a1 > 0.9 ? 'v' : undefined });
          const a2 = ph(t, 9, 10);
          g.arrow(px, py, px - 120 * c * a2, py + 120 * s * a2, { alpha: a2, width: 4, label: a2 > 0.9 ? 'a' : undefined });
          g.ball(px, py, 16);
          g.text('v = ω R', 1400, 560, { size: 38, font: 'italic', alpha: 0.8 * a1, align: 'left' });
          g.text('a = ω² R', 1400, 640, { size: 38, font: 'italic', alpha: 0.8 * a2, align: 'left' });
        },
      },
      {
        title: 'The helix',
        say: [
          'Now let the circle drift along an axis at a steady speed. The path is a helix.',
          'The velocity is the sum of a part going round and a steady part along the axis.',
          'The distance climbed in one turn is the pitch. The acceleration still points straight at the axis.',
        ],
        eq: [
          { at: 4, src: 'p = [ 2 · π · v _z | ω ]' },
          { at: 10, src: 'v = √[ ( ω · R ) ^2 + v _z ^2 ]' },
        ],
        draw: (g, t) => {
          const s = 105;
          const P = view(700, 930, s);
          const R = 1;
          const pitch = 1.8;
          const total = 3 * TAU;
          const th = total * clamp((t - 1) / 12, 0, 1);
          const at = (a: number): V3 => [R * Math.cos(a), R * Math.sin(a), (pitch * a) / TAU];
          const top = P(0, 0, 5.4);
          const base = P(0, 0, 0);
          g.arrow(base[0], base[1], top[0], top[1], { alpha: 0.3, width: 2.5, head: 16 });
          const path: Pt[] = [];
          for (let a = 0; a <= th; a += 0.08) path.push(P(...at(a)));
          path.push(P(...at(th)));
          g.path(path, { alpha: 0.9, width: 4 });
          const r = at(th);
          const b = P(...r);
          const tan: V3 = [-Math.sin(th), Math.cos(th), 0];
          const vperp = P(r[0] + tan[0], r[1] + tan[1], r[2]);
          const vpar = P(r[0], r[1], r[2] + pitch / TAU);
          const vtot = P(r[0] + tan[0], r[1] + tan[1], r[2] + pitch / TAU);
          const a1 = ph(t, 5, 6);
          g.arrow(b[0], b[1], vperp[0], vperp[1], { alpha: 0.5 * a1, width: 2.5, head: 16 });
          g.arrow(b[0], b[1], vpar[0], vpar[1], { alpha: 0.5 * a1, width: 2.5, head: 16 });
          g.arrow(b[0], b[1], vtot[0], vtot[1], { alpha: a1, width: 4 });
          g.ball(b[0], b[1], 16);
          // Seen from above.
          const ix = 1500;
          const iy = 560;
          g.circle(ix, iy, 150, { alpha: 0.4, width: 2.5 });
          const bx = ix + 150 * Math.cos(th);
          const by = iy - 150 * Math.sin(th);
          g.arrow(bx, by, bx - 90 * Math.sin(th), by - 90 * Math.cos(th), { alpha: 0.7, width: 3, head: 18 });
          g.ball(bx, by, 14);
          g.text('seen from above', ix, iy + 230, { size: 34, alpha: 0.7 });
        },
      },
    ],
  });
