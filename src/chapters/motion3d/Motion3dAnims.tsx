import type { ReactNode } from 'react';
import { Anim, Arrow, Ball, Label, Line, Readout, Trail, clamp, ease, phase } from '../kit/Anim';

/**
 * Animated diagrams for motion in three dimensions. Space is drawn with the
 * usual oblique view: x to the right, y going into the page (up and right on
 * the screen) and z up.
 */

const TAU = 2 * Math.PI;
const DEG = Math.PI / 180;
type Pt = [number, number];
type V3 = [number, number, number];

const Sub = ({ children }: { children: string }) => (
  <tspan baselineShift="sub" fontSize="0.7em">
    {children}
  </tspan>
);

const Fade = ({ t, a, b = a + 0.6, children }: { t: number; a: number; b?: number; children: ReactNode }) => <g opacity={ease(phase(t, a, b))}>{children}</g>;

/** Oblique projection of a point in space onto the page. */
const view = (ox: number, oy: number, s: number) => (x: number, y: number, z: number): Pt => [ox + s * (x + 0.5 * y), oy - s * (z + 0.35 * y)];

const f2 = (x: number) => x.toFixed(2).replace('-', '−');

// ------------------------------------------------------------------ position

export function Position3D() {
  return (
    <Anim title="A point moves through space. Dashed lines drop from it to the floor and across to the three axes, and an arrow from the origin is its position vector. The three numbers x, y and z change as it moves" height={270} loop={10}>
      {(t) => {
        const P = view(70, 235, 34);
        const pos = (u: number): V3 => [3 + 2.2 * Math.cos(u), 2.4 + 1.6 * Math.sin(u), 2.6 + 1.2 * Math.sin(2 * u)];
        const u = (TAU * t) / 10;
        const r = pos(u);
        const [x, y, z] = r;
        const o = P(0, 0, 0);
        const ball = P(x, y, z);
        const shadow = P(x, y, 0);
        const path: Pt[] = [];
        for (let k = 0; k <= 120; k++) {
          const q = pos((TAU * k) / 120);
          path.push(P(q[0], q[1], q[2]));
        }
        const ax = (a: V3, b: V3, dashed = false, tone: 'bright' | 'soft' = 'soft') => {
          const p = P(...a);
          const q = P(...b);
          return <Line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} tone={tone} dashed={dashed} />;
        };
        const xe = P(6.4, 0, 0);
        const ye = P(0, 5.6, 0);
        const ze = P(0, 0, 5.6);
        return (
          <g>
            <Arrow x1={o[0]} y1={o[1]} x2={xe[0]} y2={xe[1]} tone="soft" />
            <Arrow x1={o[0]} y1={o[1]} x2={ye[0]} y2={ye[1]} tone="soft" />
            <Arrow x1={o[0]} y1={o[1]} x2={ze[0]} y2={ze[1]} tone="soft" />
            <Label x={xe[0] + 4} y={xe[1] + 22} kind="sym">x</Label>
            <Label x={ye[0] + 14} y={ye[1] + 2} kind="sym">y</Label>
            <Label x={ze[0] - 14} y={ze[1] + 4} kind="sym">z</Label>
            <Trail points={path} tone="soft" dashed />
            {ax([x, y, 0], [x, 0, 0], true)}
            {ax([x, y, 0], [0, y, 0], true)}
            {ax([x, y, z], [x, y, 0], true)}
            <Ball x={shadow[0]} y={shadow[1]} r={3} glow={false} />
            <Arrow x1={o[0]} y1={o[1]} x2={ball[0]} y2={ball[1]} />
            <Ball x={ball[0]} y={ball[1]} r={6} />
            <Fade t={t} a={0.2}>
              <Label x={405} y={60} kind="label" anchor="start">position vector</Label>
              <Label x={405} y={86} kind="val" anchor="start">x = {f2(x)} m</Label>
              <Label x={405} y={110} kind="val" anchor="start">y = {f2(y)} m</Label>
              <Label x={405} y={134} kind="val" anchor="start">z = {f2(z)} m</Label>
              <Label x={405} y={176} kind="label" anchor="start">r = x i + y j + z k</Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ components and magnitude

export function BoxVector() {
  return (
    <Anim title="A vector with components 3, 4 and 12 is built up along the three axes. The diagonal across the floor is 5, and the long diagonal of the box is the vector itself, with magnitude 13" height={250} loop={9}>
      {(t) => {
        const s = 14;
        const P = view(70, 228, s);
        const vx = 3;
        const vy = 4;
        const vz = 12;
        const p1 = ease(phase(t, 0.5, 1.8));
        const p2 = ease(phase(t, 2.2, 3.5));
        const pd = ease(phase(t, 3.9, 4.9));
        const p3 = ease(phase(t, 5.3, 6.8));
        const A: V3 = [vx * p1, 0, 0];
        const B: V3 = [vx, vy * p2, 0];
        const C: V3 = [vx, vy, vz * p3];
        const o = P(0, 0, 0);
        const a = P(...A);
        const b = P(...B);
        const c = P(...C);
        const f = P(vx * pd, vy * pd, 0);
        const edge = (p: Pt, q: Pt, key: string) => <Arrow key={key} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} tone="soft" />;
        return (
          <g>
            {edge(o, a, 'a')}
            {p2 > 0.02 && edge(P(vx, 0, 0), b, 'b')}
            {p3 > 0.02 && edge(P(vx, vy, 0), c, 'c')}
            {pd > 0.02 && <Arrow x1={o[0]} y1={o[1]} x2={f[0]} y2={f[1]} tone="soft" dashed />}
            {p3 > 0.02 && <Arrow x1={o[0]} y1={o[1]} x2={c[0]} y2={c[1]} label="v" />}
            <Ball x={c[0]} y={c[1]} r={4} glow={false} />
            <Fade t={t} a={0.8}>
              <Label x={330} y={60} kind="val" anchor="start">v<Sub>x</Sub> = 3</Label>
            </Fade>
            <Fade t={t} a={2.5}>
              <Label x={330} y={84} kind="val" anchor="start">v<Sub>y</Sub> = 4</Label>
            </Fade>
            <Fade t={t} a={5.5}>
              <Label x={330} y={108} kind="val" anchor="start">v<Sub>z</Sub> = 12</Label>
            </Fade>
            <Fade t={t} a={4.2}>
              <Label x={330} y={156} kind="val" anchor="start">floor: √(3² + 4²) = 5</Label>
            </Fade>
            <Fade t={t} a={6.8}>
              <Label x={330} y={190} kind="val" anchor="start">v = √(5² + 12²) = 13</Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ velocity and acceleration along a path

export function Velocity3D({ showA = false, height = 270 }: { showA?: boolean; height?: number }) {
  return (
    <Anim title={showA ? 'A point moves along a curved path in space. The velocity arrow points along the path, and the acceleration arrow shows how the velocity is changing, and need not point along the path' : 'A point moves along a curved path in space. The velocity arrow always points along the path, tangent to it, and a short chord shows the displacement over a small time'} height={height} loop={10}>
      {(t) => {
        const P = view(60, height - 30, 40);
        const pos = (u: number): V3 => [3 + 2.2 * Math.cos(u), 2.4 + 1.6 * Math.sin(u), 2.6 + 1.2 * Math.sin(2 * u)];
        const w = TAU / 10;
        const u = w * t;
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
        const b = P(...r);
        const kv = 1.2;
        const vt = P(r[0] + kv * vel[0], r[1] + kv * vel[1], r[2] + kv * vel[2]);
        const ka = 1.0;
        const at = P(r[0] + ka * acc[0], r[1] + ka * acc[1], r[2] + ka * acc[2]);
        const back = pos(u - 0.7);
        const bb = P(...back);
        const sh = P(r[0], r[1], 0);
        return (
          <g>
            <Trail points={floor} tone="soft" dashed />
            <Trail points={path} tone="soft" />
            <Line x1={b[0]} y1={b[1]} x2={sh[0]} y2={sh[1]} tone="soft" dashed />
            <Ball x={sh[0]} y={sh[1]} r={3} glow={false} />
            {!showA && (
              <g>
                <Ball x={bb[0]} y={bb[1]} r={4} ghost />
                <Line x1={bb[0]} y1={bb[1]} x2={b[0]} y2={b[1]} tone="soft" dashed />
                <Label x={(bb[0] + b[0]) / 2 - 12} y={(bb[1] + b[1]) / 2 + 22} kind="sym">Δr</Label>
              </g>
            )}
            <Arrow x1={b[0]} y1={b[1]} x2={vt[0]} y2={vt[1]} label="v" />
            {showA && <Arrow x1={b[0]} y1={b[1]} x2={at[0]} y2={at[1]} tone="soft" label="a" />}
            <Ball x={b[0]} y={b[1]} r={6} />
            <Fade t={t} a={0.3}>
              <Label x={420} y={60} kind="val" anchor="start">v = ({f2(vel[0])}, {f2(vel[1])}, {f2(vel[2])})</Label>
              {showA && <Label x={420} y={90} kind="val" anchor="start">a = ({f2(acc[0])}, {f2(acc[1])}, {f2(acc[2])})</Label>}
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ a projectile with wind

const V0 = 20;
const TH = 40 * DEG;
const VX0 = V0 * Math.cos(TH);
const VZ0 = V0 * Math.sin(TH);
const G = 9.8;
const TT = (2 * VZ0) / G;

export function Projectile3D({ wind = 2, graphs = false, ghost = true, height = 260, title }: { wind?: number; graphs?: boolean; ghost?: boolean; height?: number; title?: string }) {
  return (
    <Anim title={title ?? `A ball is thrown at 20 metres per second, 40 degrees above the ground, and a steady sideways wind pushes it with an acceleration of ${wind} metres per second squared. Its dashed shadow on the ground bends sideways, but it is in the air for exactly the same time as a ball with no wind${graphs ? ', and graphs show that x, y and z each follow their own simple rule' : ''}`} height={height} loop={7}>
      {(t) => {
        const s = graphs ? 6.4 : 10.5;
        const P = view(graphs ? 26 : 40, graphs ? height - 52 : height - 28, s);
        const tau = clamp((t - 0.4) * 0.9, 0, TT);
        const at = (q: number, w: number): V3 => [VX0 * q, 0.5 * w * q * q, VZ0 * q - 0.5 * G * q * q];
        const r = at(tau, wind);
        const r0 = at(tau, 0);
        const path = (w: number, n: number, zz = false): Pt[] => {
          const out: Pt[] = [];
          for (let k = 0; k <= n; k++) {
            const q = (Math.min(tau, TT) * k) / n;
            const p = at(q, w);
            out.push(P(p[0], p[1], zz ? 0 : p[2]));
          }
          return out;
        };
        const full = (w: number): Pt[] => {
          const out: Pt[] = [];
          for (let k = 0; k <= 60; k++) {
            const p = at((TT * k) / 60, w);
            out.push(P(p[0], p[1], p[2]));
          }
          return out;
        };
        const corner = [P(0, -1, 0), P(46, -1, 0), P(46, 9, 0), P(0, 9, 0)];
        const gridX = [10, 20, 30, 40];
        const b = P(...r);
        const sh = P(r[0], r[1], 0);
        const b0 = P(...r0);
        const land = tau >= TT ? phase(t, 3.3, 4.1) : 0;
        const o = P(0, 0, 0);
        const zt = P(0, 0, 10);
        const lp = P(VX0 * TT, 0.5 * wind * TT * TT, 0);
        const wx = (xx: number) => {
          const p = P(xx, -1.5, 10.5);
          const q = P(xx, 3, 10.5);
          return <Arrow key={xx} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} tone="soft" />;
        };
        const gx0 = 382;
        const gw = 238;
        const rows = [
          { name: 'x: steady', base: 78, f: (q: number) => (VX0 * q) / (VX0 * TT), cur: r[0] / (VX0 * TT) },
          { name: 'y: wind pushes', base: 156, f: (q: number) => (0.5 * wind * q * q) / (0.5 * wind * TT * TT + 1e-9), cur: wind ? r[1] / (0.5 * wind * TT * TT) : 0 },
          { name: 'z: gravity', base: 234, f: (q: number) => (VZ0 * q - 0.5 * G * q * q) / 8.43, cur: r[2] / 8.43 },
        ];
        return (
          <g>
            <path className="fig-guide fig-faint" d={`M${corner.map((c) => c.join(' ')).join('L')}Z`} fill="none" />
            {gridX.map((gxv) => {
              const p = P(gxv, -1, 0);
              const q = P(gxv, 9, 0);
              return <Line key={gxv} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} tone="faint" />;
            })}
            <Arrow x1={o[0]} y1={o[1]} x2={zt[0]} y2={zt[1]} tone="soft" />
            <Label x={zt[0] - 14} y={zt[1] + 6} kind="sym">z</Label>
            <Label x={corner[1][0] - 8} y={corner[1][1] + 20} kind="sym">x</Label>
            <Label x={corner[3][0] - 16} y={corner[3][1] + 4} kind="sym">y</Label>
            {ghost && <Trail points={full(0)} tone="soft" dashed />}
            <Trail points={path(wind, 50)} />
            <Trail points={path(wind, 50, true)} tone="soft" dashed />
            <Line x1={b[0]} y1={b[1]} x2={sh[0]} y2={sh[1]} tone="soft" dashed />
            {ghost && <Ball x={b0[0]} y={b0[1]} r={graphs ? 3.5 : 5} ghost />}
            <Ball x={b[0]} y={b[1]} r={graphs ? 4.5 : 6} />
            {wind > 0 && !graphs && (
              <g>
                {wx(26)}
                {wx(32)}
                {wx(38)}
                <Label x={P(32, 3, 11.8)[0]} y={P(32, 3, 11.8)[1]} kind="label">sideways wind</Label>
              </g>
            )}
            {land > 0 && land < 1 && <circle className="fig-guide" cx={lp[0]} cy={lp[1]} r={4 + 14 * land} fill="none" opacity={1 - land} />}
            {!graphs && <Readout>t = {tau.toFixed(2)} s</Readout>}
            {graphs && (
              <g>
                <Label x={16} y={22} kind="val" anchor="start">t = {tau.toFixed(2)} s</Label>
                {rows.map((row) => {
                  const pts: Pt[] = [];
                  for (let k = 0; k <= 40; k++) {
                    const q = (Math.min(tau, TT) * k) / 40;
                    pts.push([gx0 + (gw * q) / TT, row.base - 44 * row.f(q)]);
                  }
                  const cx = gx0 + (gw * Math.min(tau, TT)) / TT;
                  return (
                    <g key={row.name}>
                      <Label x={gx0} y={row.base - 52} kind="label" anchor="start">{row.name}</Label>
                      <Line x1={gx0} y1={row.base} x2={gx0 + gw} y2={row.base} tone="soft" />
                      <Line x1={gx0} y1={row.base} x2={gx0} y2={row.base - 46} tone="soft" />
                      <Trail points={pts} />
                      <Ball x={cx} y={row.base - 44 * row.cur} r={3.5} glow={false} />
                    </g>
                  );
                })}
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ along and across the velocity

export function AccelSplit() {
  return (
    <Anim title="A point goes round a curved path, speeding up and slowing down. The acceleration arrow is split into a part along the velocity, which changes the speed, and a part across it, which turns the path" height={265} loop={10}>
      {(t) => {
        const cx = 320;
        const cy = 140;
        const A = 215;
        const B = 90;
        const w = TAU / 10;
        const th = (q: number) => w * q + 0.55 * Math.sin(w * q);
        const p = (q: number): Pt => [cx + A * Math.cos(th(q)), cy - B * Math.sin(th(q))];
        const h = 0.02;
        const p0 = p(t);
        const pm = p(t - h);
        const pp = p(t + h);
        const v: Pt = [(pp[0] - pm[0]) / (2 * h), (pp[1] - pm[1]) / (2 * h)];
        const a: Pt = [(pp[0] - 2 * p0[0] + pm[0]) / (h * h), (pp[1] - 2 * p0[1] + pm[1]) / (h * h)];
        const sp = Math.hypot(v[0], v[1]) || 1;
        const vh: Pt = [v[0] / sp, v[1] / sp];
        const dot = a[0] * vh[0] + a[1] * vh[1];
        const along: Pt = [dot * vh[0], dot * vh[1]];
        const across: Pt = [a[0] - along[0], a[1] - along[1]];
        const kv = 0.55;
        const ka = 0.6;
        const path: Pt[] = [];
        for (let k = 0; k <= 120; k++) path.push(p((10 * k) / 120));
        return (
          <g>
            <Trail points={path} tone="soft" dashed />
            <Arrow x1={p0[0]} y1={p0[1]} x2={p0[0] + kv * v[0]} y2={p0[1] + kv * v[1]} label="v" />
            <Arrow x1={p0[0]} y1={p0[1]} x2={p0[0] + ka * along[0]} y2={p0[1] + ka * along[1]} tone="soft" dashed label={<>a<Sub>∥</Sub></>} />
            <Arrow x1={p0[0]} y1={p0[1]} x2={p0[0] + ka * across[0]} y2={p0[1] + ka * across[1]} tone="soft" dashed label={<>a<Sub>⊥</Sub></>} />
            <Arrow x1={p0[0]} y1={p0[1]} x2={p0[0] + ka * a[0]} y2={p0[1] + ka * a[1]} tone="soft" label="a" />
            <Ball x={p0[0]} y={p0[1]} r={6} />
            <Label x={16} y={26} kind="label" anchor="start">{dot > 8 ? 'speeding up' : dot < -8 ? 'slowing down' : 'speed steady'}</Label>
            <Label x={624} y={26} kind="label" anchor="end">a∥ changes the speed, a⊥ turns the path</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ circular motion as vectors

export function CircleVectors({ height = 265 }: { height?: number }) {
  return (
    <Anim title="A point goes round a circle at a steady speed. The position vector points outward from the centre, the velocity vector is tangent to the circle and at right angles to it, and the acceleration vector points in toward the centre. Dots on the two axes show the components" height={height} loop={8}>
      {(t) => {
        const cx = 190;
        const cy = 138;
        const R = 92;
        const th = (TAU * t) / 8;
        const c = Math.cos(th);
        const s = Math.sin(th);
        const px = cx + R * c;
        const py = cy - R * s;
        const Rm = 0.5;
        const wm = 12.57;
        const nz = (x: number) => (Math.abs(x) < 0.005 ? '0.00' : f2(x));
        return (
          <g>
            <circle className="fig-guide" cx={cx} cy={cy} r={R} fill="none" />
            <Line x1={cx - R - 18} y1={cy} x2={cx + R + 18} y2={cy} tone="soft" />
            <Line x1={cx} y1={cy - R - 18} x2={cx} y2={cy + R + 18} tone="soft" />
            <Label x={cx + R + 30} y={cy + 6} kind="sym">x</Label>
            <Label x={cx + 14} y={cy - R - 18} kind="sym">y</Label>
            <Line x1={px} y1={py} x2={px} y2={cy} tone="soft" dashed />
            <Line x1={px} y1={py} x2={cx} y2={py} tone="soft" dashed />
            <Ball x={px} y={cy} r={3.5} glow={false} />
            <Ball x={cx} y={py} r={3.5} glow={false} />
            <Arrow x1={cx} y1={cy} x2={px} y2={py} tone="soft" />
            <Label x={cx + 0.2 * R * c + 16 * s} y={cy - 0.2 * R * s + 16 * c + 6} kind="sym">r</Label>
            <Arrow x1={px} y1={py} x2={px - 58 * s} y2={py - 58 * c} label="v" />
            <Arrow x1={px} y1={py} x2={px - 44 * c} y2={py + 44 * s} label="a" />
            <Ball x={px} y={py} r={6} />
            <Label x={392} y={46} kind="label" anchor="start">R = 0.5 m, ω = 12.57 rad/s</Label>
            <Label x={392} y={84} kind="val" anchor="start">θ = {Math.round(((th / DEG) % 360 + 360) % 360)}°</Label>
            <Label x={392} y={116} kind="val" anchor="start">r = ({nz(Rm * c)}, {nz(Rm * s)})</Label>
            <Label x={392} y={142} kind="val" anchor="start">v = ({nz(-Rm * wm * s)}, {nz(Rm * wm * c)})</Label>
            <Label x={392} y={168} kind="val" anchor="start">a = ({nz(-Rm * wm * wm * c)}, {nz(-Rm * wm * wm * s)})</Label>
            <Label x={392} y={206} kind="label" anchor="start">v at right angles to r</Label>
            <Label x={392} y={232} kind="label" anchor="start">a points to the centre</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the helix

export function Helix3D() {
  return (
    <Anim title="A particle spirals around a vertical axis as a helix. Its velocity is the sum of a part going round the circle and a steady part along the axis. Seen from above, it just goes round a circle" height={330} loop={12}>
      {(t) => {
        const s = 62;
        const P = view(150, 300, s);
        const R = 1;
        const pitch = 1.8;
        const total = 2 * TAU;
        const th = total * clamp((t - 0.3) / 10.5, 0, 1);
        const at = (a: number): V3 => [R * Math.cos(a), R * Math.sin(a), (pitch * a) / TAU];
        const path: Pt[] = [];
        for (let a = 0; a <= th; a += 0.1) path.push(P(...at(a)));
        path.push(P(...at(th)));
        const r = at(th);
        const b = P(...r);
        const tan: V3 = [-Math.sin(th), Math.cos(th), 0];
        const kz = (pitch / TAU) * 1.0;
        const vperp = P(r[0] + tan[0], r[1] + tan[1], r[2]);
        const vpar = P(r[0], r[1], r[2] + kz);
        const vtot = P(r[0] + tan[0], r[1] + tan[1], r[2] + kz);
        const turn = Math.floor(th / TAU);
        const z0 = turn * pitch;
        const m0 = P(R + 0.5, 0, z0);
        const m1 = P(R + 0.5, 0, z0 + pitch);
        const top = P(0, 0, 4.2);
        const base = P(0, 0, 0);
        const ic = { x: 510, y: 92, r: 40 };
        const ia = th;
        return (
          <g>
            <Arrow x1={base[0]} y1={base[1]} x2={top[0]} y2={top[1]} tone="soft" dashed />
            <Label x={top[0] + 14} y={top[1] + 8} kind="sym">B</Label>
            <Trail points={path} />
            <Arrow x1={b[0]} y1={b[1]} x2={vperp[0]} y2={vperp[1]} tone="soft" dashed />
            <Arrow x1={b[0]} y1={b[1]} x2={vpar[0]} y2={vpar[1]} tone="soft" dashed />
            <Arrow x1={b[0]} y1={b[1]} x2={vtot[0]} y2={vtot[1]} label="v" />
            <Ball x={b[0]} y={b[1]} r={6} />
            {turn < 2 && (
              <g>
                <Line x1={P(R, 0, z0)[0]} y1={P(R, 0, z0)[1]} x2={m0[0] + 6} y2={m0[1]} tone="soft" dashed />
                <Line x1={P(R, 0, z0 + pitch)[0]} y1={P(R, 0, z0 + pitch)[1]} x2={m1[0] + 6} y2={m1[1]} tone="soft" dashed />
                <Arrow x1={m0[0] + 6} y1={m0[1]} x2={m1[0] + 6} y2={m1[1]} tone="soft" />
                <Arrow x1={m1[0] + 6} y1={m1[1]} x2={m0[0] + 6} y2={m0[1]} tone="soft" />
                <Label x={m0[0] + 16} y={(m0[1] + m1[1]) / 2 + 6} kind="label" anchor="start">pitch</Label>
              </g>
            )}
            <circle className="fig-guide" cx={ic.x} cy={ic.y} r={ic.r} fill="none" />
            <Ball x={ic.x + ic.r * Math.cos(ia)} y={ic.y - ic.r * Math.sin(ia)} r={4.5} />
            <Arrow x1={ic.x + ic.r * Math.cos(ia)} y1={ic.y - ic.r * Math.sin(ia)} x2={ic.x + ic.r * Math.cos(ia) - 26 * Math.sin(ia)} y2={ic.y - ic.r * Math.sin(ia) - 26 * Math.cos(ia)} tone="soft" />
            <Label x={ic.x} y={ic.y + ic.r + 26} kind="label">seen from above</Label>
            <Label x={396} y={226} kind="label" anchor="start">round: v⊥ = ω R</Label>
            <Label x={396} y={252} kind="label" anchor="start">along the axis: v∥ steady</Label>
            <Label x={396} y={278} kind="label" anchor="start">a = ω² R, toward the axis</Label>
          </g>
        );
      }}
    </Anim>
  );
}

