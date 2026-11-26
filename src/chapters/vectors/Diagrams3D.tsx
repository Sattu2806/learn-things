import type { ReactNode } from 'react';
import { Anim, Arrow, Ball, DEG, ease, Label, lerp, phase, Trail } from '../kit/Anim';
import { Poly } from './Diagrams2D';
import { Arrow3, Axes3, f1, makeProj, Path3, Stairs, swing, type Vec3 } from './scene3d';

/** 3D vector animations, drawn through the small projection helper in scene3d.tsx. */

const mag = (v: Vec3) => Math.hypot(v[0], v[1], v[2]);
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

const Fade = ({ p, children }: { p: number; children: ReactNode }) => <g opacity={p}>{children}</g>;

// ------------------------------------------------------------------ 3D vector and its components

export function Box3({ v = [2, 3, 6], lo = [0, 0, 0], L = [3, 4, 6], height = 290, cx = 210, cy = 245, s = 26, loop = 9 }: { v?: Vec3; lo?: Vec3; L?: Vec3; height?: number; cx?: number; cy?: number; s?: number; loop?: number }) {
  const m = mag(v);
  return (
    <Anim title="A vector in 3D is built from steps along x, y and z; the length follows from Pythagoras applied twice" height={height} loop={loop} stillAt={6.5}>
      {(t) => {
        const P = makeProj(cx, cy, s, swing(t, loop));
        const px = ease(phase(t, 0.5, 1.4));
        const py = ease(phase(t, 1.5, 2.4));
        const pz = ease(phase(t, 2.5, 3.4));
        const pR = ease(phase(t, 3.9, 4.9));
        const d: Vec3 = [v[0], v[1], 0];
        const base = Math.hypot(v[0], v[1]);
        return (
          <g>
            <Axes3 P={P} L={L} lo={lo} />
            <Stairs P={P} v={v} px={px} py={py} pz={pz} />
            {py >= 1 && <Path3 P={P} pts={[[0, 0, 0], d]} dashed tone="soft" />}
            {pR > 0 && <Arrow3 P={P} to={mul(v, pR)} />}
            <Fade p={ease(phase(t, 4.6, 5.2))}>
              <Label x={470} y={70} kind="val" anchor="start">
                {`x = ${f1(v[0], 0)},  y = ${f1(v[1], 0)},  z = ${f1(v[2], 0)}`}
              </Label>
              <Label x={470} y={98} kind="val" anchor="start">
                {`floor: √(x² + y²) = ${f1(base, 2)}`}
              </Label>
              <Label x={470} y={126} kind="val" anchor="start">
                {`A = √(x² + y² + z²) = ${f1(m, 1)}`}
              </Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

export function Cosines() {
  const loop = 10;
  const len = 5;
  const s = 30;
  return (
    <Anim title="A vector of fixed length turns in space; the squares of its three direction cosines always add up to one" height={290} loop={loop} stillAt={2}>
      {(t) => {
        const w = (2 * Math.PI * t) / loop;
        const psi = (55 + 22 * Math.sin(w)) * DEG;
        const chi = (45 + 40 * Math.cos(w)) * DEG;
        const u: Vec3 = [Math.sin(psi) * Math.cos(chi), Math.sin(psi) * Math.sin(chi), Math.cos(psi)];
        const P = makeProj(190, 245, s, swing(t, loop, -0.5, 0.15));
        const v = mul(u, len);
        const sq = u.map((c) => c * c);
        const bx = 400;
        const bw = 200;
        let acc = 0;
        return (
          <g>
            <Axes3 P={P} L={[4, 4, 5]} />
            <Stairs P={P} v={v} />
            <Arrow3 P={P} to={v} width={4} />
            <Label x={bx} y={60} kind="val" anchor="start">{`cos α = ${f1(u[0], 2)}`}</Label>
            <Label x={bx} y={86} kind="val" anchor="start">{`cos β = ${f1(u[1], 2)}`}</Label>
            <Label x={bx} y={112} kind="val" anchor="start">{`cos γ = ${f1(u[2], 2)}`}</Label>
            <rect className="fig-cell" x={bx} y={150} width={bw} height={20} />
            {sq.map((q, i) => {
              const x = bx + bw * acc;
              acc += q;
              return <rect key={i} className={i === 1 ? 'fig-cell' : 'fig-cell is-lit'} style={i === 2 ? { fill: 'rgba(255,255,255,0.5)' } : undefined} x={x} y={150} width={bw * q} height={20} />;
            })}
            <Label x={bx} y={196} kind="val" anchor="start">
              cos² α + cos² β + cos² γ
            </Label>
            <Label x={bx} y={220} kind="val" anchor="start">{`= ${f1(sq[0] + sq[1] + sq[2], 2)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ position and displacement

export function Displacement3D() {
  const r1: Vec3 = [1, 2, 1];
  const r2: Vec3 = [4, 1, 3];
  const dr = sub(r2, r1);
  const loop = 9;
  return (
    <Anim title="Two position vectors from the origin; the displacement is the arrow from the first point to the second, r2 minus r1" height={280} loop={loop} stillAt={6.5}>
      {(t) => {
        const P = makeProj(200, 240, 40, swing(t, loop, -0.5, 0.25));
        const p1 = ease(phase(t, 0.4, 1.4));
        const p2 = ease(phase(t, 1.8, 2.8));
        const p3 = ease(phase(t, 3.4, 4.6));
        const a = P(...r1);
        const b = P(...r2);
        const ball = P(...add(r1, mul(dr, p3)));
        return (
          <g>
            <Axes3 P={P} L={[5, 3, 4]} />
            <Arrow3 P={P} to={mul(r1, p1)} tone="soft" />
            <Arrow3 P={P} to={mul(r2, p2)} tone="soft" />
            <Fade p={p1}>
              <Label x={a[0] - 18} y={a[1] - 8}>
                r₁
              </Label>
            </Fade>
            <Fade p={p2}>
              <Label x={b[0] + 20} y={b[1] - 4}>
                r₂
              </Label>
            </Fade>
            {p3 > 0 && <Arrow3 P={P} from={r1} to={add(r1, mul(dr, p3))} width={4} />}
            {p3 > 0 && <Ball x={ball[0]} y={ball[1]} />}
            <Fade p={ease(phase(t, 4.4, 5))}>
              <Label x={(a[0] + b[0]) / 2 + 8} y={(a[1] + b[1]) / 2 + 30}>
                Δr
              </Label>
              <Label x={470} y={80} kind="val" anchor="start">
                Δr = r₂ − r₁
              </Label>
              <Label x={470} y={108} kind="val" anchor="start">
                {`= (${dr[0]}, ${dr[1]}, ${dr[2]})`.replace('-', '−')}
              </Label>
              <Label x={470} y={136} kind="val" anchor="start">
                {`|Δr| = ${f1(mag(dr), 2)}`}
              </Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ angle between two 3D vectors

export function AngleBetween() {
  const A: Vec3 = [2, 2, 1];
  const B: Vec3 = [3, 0, 4];
  const th = Math.acos(dot(A, B) / (mag(A) * mag(B)));
  const loop = 9;
  const ua = mul(A, 1 / mag(A));
  const ub = mul(B, 1 / mag(B));
  // points of an arc from A to B, through the plane they share
  const arcPts = (p: number): Vec3[] => {
    const out: Vec3[] = [];
    const n = 16;
    const w = cross(cross(ua, ub), ua);
    const wl = mag(w);
    const e2: Vec3 = mul(w, 1 / wl);
    for (let i = 0; i <= n; i++) {
      const a = (th * p * i) / n;
      out.push(mul(add(mul(ua, Math.cos(a)), mul(e2, Math.sin(a))), 1.5));
    }
    return out;
  };
  return (
    <Anim title="Two vectors in 3D and the angle between them, found from their dot product" height={290} loop={loop} stillAt={6.5}>
      {(t) => {
        const P = makeProj(190, 250, 34, swing(t, loop, -0.5, 0.25));
        const p1 = ease(phase(t, 0.4, 1.3));
        const p2 = ease(phase(t, 1.5, 2.4));
        const p3 = ease(phase(t, 3.0, 4.2));
        const arcP = arcPts(Math.max(p3, 0.001)).map((p) => P(...p));
        const lab = P(...mul(add(ua, ub), 1.05));
        return (
          <g>
            <Axes3 P={P} L={[4, 3, 5]} />
            <Arrow3 P={P} to={mul(A, p1)} />
            <Arrow3 P={P} to={mul(B, p2)} />
            <Fade p={p1}>
              <Label x={P(...A)[0] + 16} y={P(...A)[1] + 10}>
                A
              </Label>
            </Fade>
            <Fade p={p2}>
              <Label x={P(...B)[0] + 16} y={P(...B)[1] - 4}>
                B
              </Label>
            </Fade>
            {p3 > 0 && <Trail points={arcP} />}
            <Fade p={p3}>
              <Label x={lab[0] + 6} y={lab[1] - 10}>
                θ
              </Label>
            </Fade>
            <Fade p={ease(phase(t, 4.2, 5))}>
              <Label x={430} y={80} kind="val" anchor="start">{`A · B = ${dot(A, B)}`}</Label>
              <Label x={430} y={108} kind="val" anchor="start">{`A B = 3 × 5 = ${mag(A) * mag(B)}`}</Label>
              <Label x={430} y={136} kind="val" anchor="start">{`cos θ = ${f1(dot(A, B) / (mag(A) * mag(B)), 3)}`}</Label>
              <Label x={430} y={164} kind="val" anchor="start">{`θ = ${f1(th / DEG)}°`}</Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ cross product

interface CrossSpec {
  A?: Vec3;
  B?: Vec3;
  /** Drawn length of the cross product arrow, per unit of its size. */
  k?: number;
  /** Swap the order partway through, so the arrow flips. */
  flip?: boolean;
  lo?: Vec3;
  L?: Vec3;
  height?: number;
  cx?: number;
  cy?: number;
  s?: number;
  loop?: number;
  readout?: boolean;
}

export function CrossScene({ A = [3, 0, 0], B = [1, 2.5, 0], k = 0.42, flip = true, lo = [0, 0, 0], L = [4, 4, 4], height = 290, cx = 200, cy = 240, s = 36, loop = 9, readout = true }: CrossSpec) {
  const C = cross(A, B);
  const R = add(A, B);
  const flat = A[2] === 0 && B[2] === 0;
  return (
    <Anim title="The cross product of A and B stands at right angles to both; swap the order and it points the other way" height={height} loop={loop} stillAt={flip ? 2.6 : 4.8}>
      {(t) => {
        const P = makeProj(cx, cy, s, swing(t, loop, -0.55, 0.2));
        const p1 = ease(phase(t, 0.3, 1.1));
        const p2 = ease(phase(t, 1.2, 2.0));
        const pc = ease(phase(t, 2.2, 3.2));
        const pf = flip ? ease(phase(t, 4.8, 6.0)) : 0;
        const c = Math.cos(Math.PI * pf);
        const swapped = pf > 0.5;
        const tipC = mul(C, k * pc * c);
        // the curl from the first vector toward the second gives the direction by the right-hand rule
        const pts: Vec3[] = [];
        if (flat) {
          const a0 = Math.atan2(A[1], A[0]);
          const a1 = Math.atan2(B[1], B[0]);
          const [f, e] = swapped ? [a1, a0] : [a0, a1];
          for (let i = 0; i <= 14; i++) {
            const a = lerp(f, e, i / 14);
            pts.push([0.8 * Math.cos(a), 0.8 * Math.sin(a), 0]);
          }
        }
        const q = pts.map((p) => P(...p));
        return (
          <g>
            <Axes3 P={P} L={L} lo={lo} />
            <Fade p={ease(phase(t, 1.6, 2.4))}>
              <Poly pts={[P(0, 0, 0), P(...A), P(...R), P(...B)]} />
            </Fade>
            <Arrow3 P={P} to={mul(A, p1)} tone="soft" />
            <Arrow3 P={P} to={mul(B, p2)} tone="soft" />
            <Fade p={p1}>
              <Label x={P(...A)[0] + 18} y={P(...A)[1] + 14}>
                {swapped && flat ? 'B' : 'A'}
              </Label>
            </Fade>
            <Fade p={p2}>
              <Label x={P(...B)[0] + 8} y={P(...B)[1] - 14}>
                {swapped && flat ? 'A' : 'B'}
              </Label>
            </Fade>
            {flat && pc > 0 && <Trail points={q} tone="soft" />}
            {flat && pc > 0 && q.length > 4 && <Arrow x1={q[q.length - 4][0]} y1={q[q.length - 4][1]} x2={q[q.length - 1][0]} y2={q[q.length - 1][1]} tone="soft" />}
            {pc > 0 && Math.abs(c * pc) > 0.04 && <Arrow3 P={P} to={tipC} width={4} />}
            {readout && flip && (
              <Fade p={pc}>
                <Label x={470} y={90} kind="val" anchor="start">
                  {swapped ? 'B × A' : 'A × B'}
                </Label>
                <Label x={470} y={118} kind="val" anchor="start">
                  {swapped ? 'points down' : 'points up'}
                </Label>
                <Label x={470} y={146} kind="val" anchor="start">
                  {swapped ? 'B × A = −( A × B )' : 'right hand: curl A to B'}
                </Label>
              </Fade>
            )}
            {readout && !flip && (
              <Fade p={ease(phase(t, 3.4, 4.2))}>
                <Label x={440} y={80} kind="val" anchor="start">{`A × B = (${C.map((n) => f1(n, 0)).join(', ')})`}</Label>
                <Label x={440} y={108} kind="val" anchor="start">{`|A × B| = √${dot(C, C)} = ${f1(mag(C), 2)}`}</Label>
                <Label x={440} y={136} kind="val" anchor="start">{`= area ${f1(mag(C), 2)}`}</Label>
              </Fade>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the helix

export function Helix({ height = 320 }: { height?: number }) {
  const R = 2;
  const w = 2;
  const u = 0.8;
  const loop = 7;
  const tEnd = 6;
  return (
    <Anim title="A particle spirals up a helix: its position, its velocity along the path and its acceleration toward the axis" height={height} loop={loop} stillAt={4}>
      {(t) => {
        const P = makeProj(200, height - 50, 40, swing(t, loop, -0.5, 0.2));
        const tt = Math.min(t, tEnd);
        const pos = (q: number): Vec3 => [R * Math.cos(w * q), R * Math.sin(w * q), u * q];
        const r = pos(tt);
        const vel: Vec3 = [-R * w * Math.sin(w * tt), R * w * Math.cos(w * tt), u];
        const acc: Vec3 = [-R * w * w * Math.cos(w * tt), -R * w * w * Math.sin(w * tt), 0];
        const pts: Vec3[] = [];
        for (let q = 0; q <= tt; q += 0.06) pts.push(pos(q));
        pts.push(r);
        const shadow: Vec3 = [r[0], r[1], 0];
        const b = P(...r);
        return (
          <g>
            <Axes3 P={P} L={[3, 3, 5]} lo={[-3, -3, 0]} />
            <Path3 P={P} pts={pts} />
            <Path3 P={P} pts={[r, shadow]} dashed tone="soft" />
            <Ball x={P(...shadow)[0]} y={P(...shadow)[1]} r={3.5} ghost />
            <Arrow3 P={P} to={add(r, mul(vel, 0.32))} from={r} width={3} />
            <Arrow3 P={P} to={add(r, mul(acc, 0.11))} from={r} tone="soft" width={3} />
            <Ball x={b[0]} y={b[1]} />
            <Label x={450} y={70} kind="val" anchor="start">
              r = ( R cos ωt, R sin ωt, u t )
            </Label>
            <Label x={450} y={100} kind="val" anchor="start">
              bright arrow: v = dr/dt
            </Label>
            <Label x={450} y={128} kind="val" anchor="start">
              grey arrow: a = dv/dt
            </Label>
            <Label x={450} y={156} kind="val" anchor="start">{`height z = ${f1(r[2])} m`}</Label>
            <Label x={450} y={184} kind="val" anchor="start">{`speed = ${f1(mag(vel), 2)} m/s`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the drone

export function DroneFlight() {
  const l1: Vec3 = [40, 30, 20];
  const l2: Vec3 = [-10, 20, -15];
  const loop = 10;
  return (
    <Anim title="A drone flies two straight legs through 3D space; the displacement is the single arrow from take-off to landing" height={300} loop={loop} stillAt={7.5}>
      {(t) => {
        const P = makeProj(150, 245, 3.1, swing(t, loop, -0.5, 0.18));
        const p1 = ease(phase(t, 0.5, 2.7));
        const p2 = ease(phase(t, 2.9, 4.3));
        const pd = ease(phase(t, 5.2, 6.2));
        const mid = l1;
        const end = add(l1, l2);
        const pos = p2 > 0 ? add(mid, mul(l2, p2)) : mul(l1, p1);
        const b = P(...pos);
        const g = P(pos[0], pos[1], 0);
        return (
          <g>
            <Axes3 P={P} L={[50, 55, 30]} step={10} />
            <Path3 P={P} pts={[pos, [pos[0], pos[1], 0]]} dashed tone="faint" />
            <Ball x={g[0]} y={g[1]} r={3} ghost />
            <Arrow3 P={P} to={mul(l1, p1)} tone="soft" />
            {p2 > 0 && <Arrow3 P={P} from={mid} to={add(mid, mul(l2, p2))} tone="soft" />}
            {pd > 0 && <Arrow3 P={P} to={mul(end, pd)} width={4} />}
            <Ball x={b[0]} y={b[1]} />
            <Fade p={ease(phase(t, 2.5, 3))}>
              <Label x={430} y={70} kind="val" anchor="start">{`leg 1 = ${f1(mag(l1))} m`}</Label>
            </Fade>
            <Fade p={ease(phase(t, 4.2, 4.8))}>
              <Label x={430} y={98} kind="val" anchor="start">{`leg 2 = ${f1(mag(l2))} m`}</Label>
              <Label x={430} y={126} kind="val" anchor="start">{`path = ${f1(mag(l1) + mag(l2))} m`}</Label>
            </Fade>
            <Fade p={ease(phase(t, 6, 6.6))}>
              <Label x={430} y={166} kind="val" anchor="start">{`Δr = (${end[0]}, ${end[1]}, ${end[2]}) m`}</Label>
              <Label x={430} y={194} kind="val" anchor="start">{`|Δr| = ${f1(mag(end))} m`}</Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}
