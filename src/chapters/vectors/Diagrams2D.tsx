import type { ReactNode } from 'react';
import { Anim, Arrow, Ball, Block, DEG, ease, Ground, Label, Line, lerp, phase, Readout, Trail } from '../kit/Anim';
import { f1, type Pt } from './scene3d';

/** Flat (2D) vector animations. Maths coordinates (x right, y up) are turned into screen pixels inside each one. */

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => `${(cx + r * Math.cos(a * DEG)).toFixed(1)} ${(cy - r * Math.sin(a * DEG)).toFixed(1)}`;
  return `M${p(a0)}A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 0 : 1} ${p(a1)}`;
};

export const Poly = ({ pts, opacity = 1 }: { pts: Pt[]; opacity?: number }) => <path className="fig-cliff" style={{ opacity }} d={`M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}Z`} />;

const Fade = ({ p, children }: { p: number; children: ReactNode }) => <g opacity={p}>{children}</g>;

// ------------------------------------------------------------------ 1. scalar and vector

export function ScalarVsVector() {
  const s = 40;
  const ox = 90;
  const oy = 190;
  return (
    <Anim title="A walker goes 4 metres east then 3 metres north: the distance is 7 metres, the displacement an arrow of 5 metres" height={230} loop={7.5} stillAt={4.5}>
      {(t) => {
        const p1 = phase(t, 0.4, 2.0);
        const p2 = phase(t, 2.0, 3.2);
        const dx = 4 * p1;
        const dy = 3 * p2;
        const x = ox + s * dx;
        const y = oy - s * dy;
        const dist = dx + dy;
        const mag = Math.hypot(dx, dy);
        const ang = dx > 0 ? Math.atan2(dy, dx) / DEG : 0;
        return (
          <g>
            <Line x1={ox} y1={oy} x2={ox + 4 * s} y2={oy} tone="faint" dashed />
            <Line x1={ox + 4 * s} y1={oy} x2={ox + 4 * s} y2={oy - 3 * s} tone="faint" dashed />
            <Trail points={[[ox, oy], [ox + s * Math.min(dx, 4), oy], [x, y]]} tone="soft" />
            <Arrow x1={ox} y1={oy} x2={x} y2={y} width={3} />
            <Ball x={x} y={y} />
            <Label x={ox - 16} y={oy + 6}>
              start
            </Label>
            <Label x={(ox + x) / 2 - 18} y={(oy + y) / 2 - 8}>
              Δr
            </Label>
            <Label x={330} y={64} kind="label" anchor="start">
              distance (a scalar)
            </Label>
            <Label x={330} y={90} kind="val" anchor="start">
              {`d = ${f1(dist)} m   size only`}
            </Label>
            <Fade p={ease(phase(t, 0.5, 1))}>
              <Label x={330} y={140} kind="label" anchor="start">
                displacement (a vector)
              </Label>
              <Label x={330} y={166} kind="val" anchor="start">
                {`|Δr| = ${f1(mag)} m`}
              </Label>
              <Label x={330} y={188} kind="val" anchor="start">
                {`${f1(ang)}° north of east`}
              </Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 2. drawing a vector

export function NamingVector() {
  const len = 150;
  const th = 30;
  const dx = len * Math.cos(th * DEG);
  const dy = len * Math.sin(th * DEG);
  const o: Pt = [90, 175];
  const copies: Pt[] = [
    [330, 135],
    [470, 195],
  ];
  return (
    <Anim title="A vector is an arrow: its length is the size, its direction the way it points, and it can be slid anywhere without changing" height={230} loop={7} stillAt={5}>
      {(t) => {
        const pa = ease(phase(t, 0.3, 1.2));
        return (
          <g>
            <Line x1={o[0]} y1={o[1]} x2={o[0] + 200} y2={o[1]} tone="faint" dashed />
            <Arrow x1={o[0]} y1={o[1]} x2={o[0] + dx * pa} y2={o[1] - dy * pa} />
            <Fade p={ease(phase(t, 1, 1.6))}>
              <Label x={o[0] + dx / 2 - 6} y={o[1] - dy / 2 + 2 - 22}>
                A
              </Label>
              <Label x={o[0] - 4} y={o[1] + 24} kind="label">
                tail
              </Label>
              <Label x={o[0] + dx + 10} y={o[1] - dy - 12} kind="label" anchor="start">
                tip
              </Label>
              <path className="fig-guide" fill="none" d={arc(o[0], o[1], 46, 0, th)} />
              <Label x={o[0] + 60} y={o[1] - 8}>
                θ
              </Label>
              <Label x={o[0] + dx / 2 + 14} y={o[1] - dy / 2 + 30} kind="val" anchor="start">
                length = size
              </Label>
            </Fade>
            {copies.map((c, i) => {
              const p = ease(phase(t, 1.8 + i * 0.9, 2.9 + i * 0.9));
              const x = lerp(o[0], c[0], p);
              const y = lerp(o[1], c[1], p);
              return (
                <g key={i}>
                  <Arrow x1={x} y1={y} x2={x + dx} y2={y - dy} tone={p < 1 ? 'soft' : 'bright'} dashed={p < 1} />
                  {p >= 1 && (
                    <Label x={x + dx / 2 - 6} y={y - dy / 2 - 16}>
                      A
                    </Label>
                  )}
                </g>
              );
            })}
            <Fade p={ease(phase(t, 4.2, 5))}>
              <Label x={470} y={42} kind="label">
                the same vector A, moved
              </Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 3. adding

interface AddSpec {
  A: Pt;
  B: Pt;
  s?: number;
  ox?: number;
  oy?: number;
  height?: number;
  names?: [string, string, string];
  note?: string;
}

export function TriangleAdd({ A, B, s = 44, ox = 90, oy = 220, height = 260, names = ['A', 'B', 'R'], note }: AddSpec) {
  const R: Pt = [A[0] + B[0], A[1] + B[1]];
  const P = (v: Pt): Pt => [ox + s * v[0], oy - s * v[1]];
  const o = P([0, 0]);
  const a = P(A);
  const r = P(R);
  return (
    <Anim title="The second vector slides to the tip of the first; the resultant runs from the start to the end" height={height} loop={7} stillAt={5.5}>
      {(t) => {
        const pA = ease(phase(t, 0.3, 1.2));
        const pB = ease(phase(t, 1.9, 3.1));
        const pR = ease(phase(t, 3.5, 4.5));
        const tail: Pt = [lerp(o[0], a[0], pB), lerp(o[1], a[1], pB)];
        const bEnd: Pt = [tail[0] + s * B[0], tail[1] - s * B[1]];
        return (
          <g>
            <Arrow x1={o[0]} y1={o[1]} x2={lerp(o[0], a[0], pA)} y2={lerp(o[1], a[1], pA)} />
            <Label x={(o[0] + a[0]) / 2} y={(o[1] + a[1]) / 2 + 26}>
              {names[0]}
            </Label>
            {t > 1.3 && (
              <g>
                <Arrow x1={tail[0]} y1={tail[1]} x2={bEnd[0]} y2={bEnd[1]} tone={pB < 1 ? 'soft' : 'bright'} dashed={pB < 1} />
                <Label x={(tail[0] + bEnd[0]) / 2 + 20} y={(tail[1] + bEnd[1]) / 2 + 6}>
                  {names[1]}
                </Label>
              </g>
            )}
            {pR > 0 && (
              <g>
                <Arrow x1={o[0]} y1={o[1]} x2={lerp(o[0], r[0], pR)} y2={lerp(o[1], r[1], pR)} width={4} />
                <Label x={(o[0] + r[0]) / 2 - 22} y={(o[1] + r[1]) / 2 - 8}>
                  {names[2]}
                </Label>
              </g>
            )}
            <Fade p={ease(phase(t, 4.3, 5))}>
              <Readout y={28}>{note ?? `${names[2]} = ${names[0]} + ${names[1]}`}</Readout>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

export function Parallelogram({ A, B, s = 44, ox = 90, oy = 220, height = 260, names = ['A', 'B', 'R'], note }: AddSpec) {
  const R: Pt = [A[0] + B[0], A[1] + B[1]];
  const P = (v: Pt): Pt => [ox + s * v[0], oy - s * v[1]];
  const o = P([0, 0]);
  const a = P(A);
  const b = P(B);
  const r = P(R);
  return (
    <Anim title="Two vectors from one point: slide copies to close a parallelogram, and the diagonal is the sum in either order" height={height} loop={7.5} stillAt={6}>
      {(t) => {
        const pA = ease(phase(t, 0.3, 1.1));
        const pB = ease(phase(t, 0.7, 1.5));
        const p1 = ease(phase(t, 2.0, 3.0));
        const p2 = ease(phase(t, 3.0, 4.0));
        const pR = ease(phase(t, 4.4, 5.4));
        const c1: Pt = [lerp(o[0], a[0], p1), lerp(o[1], a[1], p1)];
        const c2: Pt = [lerp(o[0], b[0], p2), lerp(o[1], b[1], p2)];
        return (
          <g>
            {p1 + p2 === 2 && <Poly pts={[o, a, r, b]} opacity={ease(phase(t, 4, 4.6))} />}
            <Arrow x1={o[0]} y1={o[1]} x2={lerp(o[0], a[0], pA)} y2={lerp(o[1], a[1], pA)} />
            <Arrow x1={o[0]} y1={o[1]} x2={lerp(o[0], b[0], pB)} y2={lerp(o[1], b[1], pB)} />
            <Label x={(o[0] + a[0]) / 2 + 4} y={(o[1] + a[1]) / 2 + 28}>
              {names[0]}
            </Label>
            <Label x={(o[0] + b[0]) / 2 - 18} y={(o[1] + b[1]) / 2 + 4}>
              {names[1]}
            </Label>
            {t > 2 && <Arrow x1={c1[0]} y1={c1[1]} x2={c1[0] + b[0] - o[0]} y2={c1[1] + b[1] - o[1]} tone="soft" dashed />}
            {t > 3 && <Arrow x1={c2[0]} y1={c2[1]} x2={c2[0] + a[0] - o[0]} y2={c2[1] + a[1] - o[1]} tone="soft" dashed />}
            {pR > 0 && (
              <g>
                <Arrow x1={o[0]} y1={o[1]} x2={lerp(o[0], r[0], pR)} y2={lerp(o[1], r[1], pR)} width={4} />
                <Label x={r[0] + 18} y={r[1] - 4}>
                  {names[2]}
                </Label>
              </g>
            )}
            <Fade p={ease(phase(t, 5, 5.8))}>
              <Readout y={28}>{note ?? `${names[2]} = ${names[0]} + ${names[1]} = ${names[1]} + ${names[0]}`}</Readout>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 4. subtracting and scaling

export function Subtract() {
  const s = 44;
  const o: Pt = [140, 195];
  const A: Pt = [3.4, 1.0];
  const B: Pt = [1.2, 2.2];
  const P = (v: Pt): Pt => [o[0] + s * v[0], o[1] - s * v[1]];
  const bl = Math.hypot(B[0], B[1]);
  const b0 = Math.atan2(B[1], B[0]) / DEG;
  return (
    <Anim title="To subtract B, turn it round to point the opposite way and add it: A minus B" height={265} loop={8} stillAt={6.4}>
      {(t) => {
        const pRot = ease(phase(t, 1.6, 2.8));
        const pMove = ease(phase(t, 3.2, 4.2));
        const pRes = ease(phase(t, 4.6, 5.6));
        const ang = (b0 + 180 * pRot) * DEG;
        const bx = bl * Math.cos(ang);
        const by = bl * Math.sin(ang);
        const a = P(A);
        const tail: Pt = [lerp(o[0], a[0], pMove), lerp(o[1], a[1], pMove)];
        const res = P([A[0] - B[0], A[1] - B[1]]);
        const bt = P(B);
        return (
          <g>
            <Arrow x1={o[0]} y1={o[1]} x2={a[0]} y2={a[1]} />
            <Label x={a[0] + 18} y={a[1] - 2}>
              A
            </Label>
            {pRot < 1 && (
              <g>
                <Arrow x1={o[0]} y1={o[1]} x2={o[0] + s * bx} y2={o[1] - s * by} tone={pRot === 0 ? 'bright' : 'soft'} />
                {pRot === 0 && (
                  <Label x={o[0] + s * bx - 18} y={o[1] - s * by - 6}>
                    B
                  </Label>
                )}
              </g>
            )}
            {pRot >= 1 && (
              <g>
                <Arrow x1={tail[0]} y1={tail[1]} x2={tail[0] + s * bx} y2={tail[1] - s * by} tone={pMove < 1 ? 'soft' : 'bright'} />
                <Label x={tail[0] + s * bx / 2 + 26} y={tail[1] - s * by / 2 + 6}>
                  −B
                </Label>
              </g>
            )}
            {pRes > 0 && (
              <g>
                <Arrow x1={o[0]} y1={o[1]} x2={lerp(o[0], res[0], pRes)} y2={lerp(o[1], res[1], pRes)} width={4} />
                <Label x={res[0] / 2 + o[0] / 2 - 26} y={(res[1] + o[1]) / 2 + 12}>
                  A − B
                </Label>
              </g>
            )}
            {t > 1 && t < 1.6 && (
              <Label x={o[0] + 120} y={36} kind="label">
                turn B half a turn
              </Label>
            )}
            <Fade p={ease(phase(t, 5.6, 6.2))}>
              <Arrow x1={bt[0]} y1={bt[1]} x2={a[0]} y2={a[1]} tone="soft" dashed />
              <Readout y={28}>A − B = A + ( −B )</Readout>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

export function Scale() {
  const s = 36;
  const o: Pt = [250, 130];
  const A: Pt = [3, 1.2];
  const ks = [
    [0.6, 1.6, 1, 2],
    [2.4, 3.4, 2, 0.5],
    [4.2, 5.4, 0.5, -1],
    [6.2, 7, -1, 1],
  ];
  return (
    <Anim title="Multiplying a vector by a number k stretches it by k; a negative k also turns it round" height={210} loop={8.4} stillAt={4.2}>
      {(t) => {
        let k = 1;
        for (const [a, b, from, to] of ks) if (t >= a) k = lerp(from, to, ease(phase(t, a, b)));
        const tip: Pt = [o[0] + s * A[0] * k, o[1] - s * A[1] * k];
        return (
          <g>
            <Arrow x1={o[0]} y1={o[1]} x2={o[0] + s * A[0]} y2={o[1] - s * A[1]} tone="soft" dashed />
            <Label x={o[0] + s * A[0] + 6} y={o[1] - s * A[1] + 28} kind="label" anchor="start">
              A
            </Label>
            <Arrow x1={o[0]} y1={o[1]} x2={tip[0]} y2={tip[1]} width={4} />
            <Label x={tip[0] + (k > 0 ? 8 : -8)} y={tip[1] - 14}>
              k A
            </Label>
            <Label x={36} y={100} kind="val" anchor="start">
              {`k = ${f1(k)}`}
            </Label>
            <Label x={36} y={124} kind="val" anchor="start">
              {`size × ${f1(Math.abs(k))}`}
            </Label>
            <Label x={36} y={148} kind="val" anchor="start">
              {k < -0.02 ? 'reversed' : 'same way'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 5. unit vectors

export function UnitVectors() {
  const s = 56;
  const o: Pt = [110, 205];
  const P = (x: number, y: number): [number, number] => [o[0] + s * x, o[1] - s * y];
  return (
    <Anim title="The vector 3 i plus 2 j is built from three steps of i and two steps of j" height={250} loop={7.5} stillAt={6}>
      {(t) => {
        const steps: [number, number, number, number][] = [
          [0, 0, 1, 0],
          [1, 0, 2, 0],
          [2, 0, 3, 0],
          [3, 0, 3, 1],
          [3, 1, 3, 2],
        ];
        return (
          <g>
            <Line x1={o[0] - 20} y1={o[1]} x2={o[0] + 4.2 * s} y2={o[1]} tone="faint" />
            <Line x1={o[0]} y1={o[1] + 20} x2={o[0]} y2={o[1] - 2.6 * s} tone="faint" />
            {steps.map(([x1, y1, x2, y2], i) => {
              const p = ease(phase(t, 0.4 + i * 0.55, 0.9 + i * 0.55));
              if (p <= 0) return null;
              const a = P(x1, y1);
              const b = P(lerp(x1, x2, p), lerp(y1, y2, p));
              return <Arrow key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} tone="soft" width={2.6} />;
            })}
            <Fade p={ease(phase(t, 0.7, 1.2))}>
              <Label x={P(0.5, 0)[0]} y={o[1] + 26}>
                î
              </Label>
            </Fade>
            <Fade p={ease(phase(t, 2.3, 2.8))}>
              <Label x={P(3, 0.5)[0] + 18} y={P(3, 0.5)[1] + 6}>
                ĵ
              </Label>
            </Fade>
            {(() => {
              const p = ease(phase(t, 3.8, 4.8));
              const b = P(3 * p, 2 * p);
              return p > 0 ? <Arrow x1={o[0]} y1={o[1]} x2={b[0]} y2={b[1]} width={4} /> : null;
            })()}
            <Fade p={ease(phase(t, 4.5, 5.2))}>
              <Label x={P(1.5, 1)[0] - 26} y={P(1.5, 1)[1] - 8}>
                A
              </Label>
              <Readout y={28}>A = 3 î + 2 ĵ</Readout>
            </Fade>
            <Label x={450} y={170} kind="val" anchor="start">
              î : one step right
            </Label>
            <Label x={450} y={194} kind="val" anchor="start">
              ĵ : one step up
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 6. components

interface ResolveSpec {
  mag?: number;
  unit?: string;
  /** Turn to this angle (degrees) and hold; leave out to sweep 0 → 90° and back. */
  target?: number;
  height?: number;
}

export function Resolve({ mag = 5, unit = '', target, height = 260 }: ResolveSpec) {
  const len = 190;
  const o: Pt = [120, height - 40];
  const sfx = unit ? ` ${unit}` : '';
  return (
    <Anim title="A vector turns, and its x and y components grow and shrink: A cosine theta along x, A sine theta along y" height={height} loop={target ? 7 : 8} stillAt={target ? 5 : 2}>
      {(t) => {
        const th = target !== undefined ? target * ease(phase(t, 0.6, 3.4)) : 90 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 8));
        const c = Math.cos(th * DEG);
        const sn = Math.sin(th * DEG);
        const tip: Pt = [o[0] + len * c, o[1] - len * sn];
        const foot: Pt = [tip[0], o[1]];
        return (
          <g>
            <Line x1={o[0] - 14} y1={o[1]} x2={o[0] + len + 30} y2={o[1]} tone="faint" />
            <Line x1={o[0]} y1={o[1] + 14} x2={o[0]} y2={o[1] - len - 14} tone="faint" />
            <Line x1={o[0]} y1={tip[1]} x2={tip[0]} y2={tip[1]} tone="faint" dashed />
            <Arrow x1={o[0]} y1={o[1] + 12} x2={foot[0]} y2={foot[1] + 12} tone="soft" width={3} />
            <Arrow x1={o[0] - 12} y1={o[1]} x2={o[0] - 12} y2={tip[1]} tone="soft" width={3} />
            <Line x1={tip[0]} y1={tip[1]} x2={foot[0]} y2={foot[1]} tone="soft" dashed />
            <Arrow x1={o[0]} y1={o[1]} x2={tip[0]} y2={tip[1]} width={4} />
            <path className="fig-guide" fill="none" d={arc(o[0], o[1], 40, 0, Math.max(th, 0.01))} />
            <Label x={o[0] + 58} y={o[1] - 8}>
              θ
            </Label>
            <Label x={tip[0] + 14} y={tip[1] - 10}>
              A
            </Label>
            <Label x={420} y={o[1] - 150} kind="val" anchor="start">
              {`θ = ${f1(th, 0)}°`}
            </Label>
            <Label x={420} y={o[1] - 120} kind="val" anchor="start">
              {`Ax = A cos θ = ${f1(mag * c)}${sfx}`}
            </Label>
            <Label x={420} y={o[1] - 94} kind="val" anchor="start">
              {`Ay = A sin θ = ${f1(mag * sn)}${sfx}`}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Polar({ s = 40, o = [190, 140], height = 280, rx = 400, naive = false }: { s?: number; o?: Pt; height?: number; rx?: number; naive?: boolean }) {
  return (
    <Anim title="The tip of a vector moves round; its size comes from Pythagoras and its direction from the arctangent, checked against the quadrant" height={height} loop={9} stillAt={3}>
      {(t) => {
        const phi = (2 * Math.PI * t) / 9 + 0.35;
        const x = 4 * Math.cos(phi);
        const y = 3 * Math.sin(phi);
        const mag = Math.hypot(x, y);
        let th = Math.atan2(y, x) / DEG;
        if (th < 0) th += 360;
        const tip: Pt = [o[0] + s * x, o[1] - s * y];
        const naiveAng = Math.atan(y / x) / DEG;
        return (
          <g>
            <Line x1={o[0] - 4.4 * s} y1={o[1]} x2={o[0] + 4.6 * s} y2={o[1]} tone="faint" />
            <Line x1={o[0]} y1={o[1] + 3.4 * s} x2={o[0]} y2={o[1] - 3.4 * s} tone="faint" />
            <Line x1={tip[0]} y1={tip[1]} x2={tip[0]} y2={o[1]} tone="soft" dashed />
            <Line x1={tip[0]} y1={tip[1]} x2={o[0]} y2={tip[1]} tone="soft" dashed />
            <Arrow x1={o[0]} y1={o[1]} x2={tip[0]} y2={tip[1]} width={4} />
            <path className="fig-guide" fill="none" d={arc(o[0], o[1], 26, 0, Math.max(th, 0.01))} />
            {!naive && (
              <g>
                <Label x={rx} y={o[1] - 0.9 * s} kind="val" anchor="start">{`x = ${f1(x)}`}</Label>
                <Label x={rx} y={o[1] - 0.9 * s + 26} kind="val" anchor="start">{`y = ${f1(y)}`}</Label>
                <Label x={rx} y={o[1] - 0.9 * s + 56} kind="val" anchor="start">{`A = √(x² + y²) = ${f1(mag)}`}</Label>
                <Label x={rx} y={o[1] - 0.9 * s + 82} kind="val" anchor="start">{`θ = ${f1(th, 0)}° from +x`}</Label>
              </g>
            )}
            {naive && (
              <g>
                <Label x={rx} y={o[1] - 0.8 * s} kind="val" anchor="start">{`x = ${f1(x)},  y = ${f1(y)}`}</Label>
                <Label x={rx} y={o[1] - 0.8 * s + 28} kind="val" anchor="start">{`tan⁻¹(y/x) = ${f1(naiveAng, 0)}°`}</Label>
                <Label x={rx} y={o[1] - 0.8 * s + 56} kind="val" anchor="start">{`true angle = ${f1(th, 0)}°`}</Label>
                {Math.abs(naiveAng - th) > 1 && Math.abs(naiveAng + 360 - th) > 1 && (
                  <Label x={rx} y={o[1] - 0.8 * s + 84} kind="val" anchor="start">
                    calculator is off!
                  </Label>
                )}
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 10. dot product

export function DotProjection({ height = 260 }: { height?: number }) {
  const s = 40;
  const o: Pt = [120, height - 100];
  const a0 = 20;
  const LA = 4;
  const LB = 3;
  return (
    <Anim title="The dot product is the shadow of B on A, times the length of A; it shrinks to zero at 90 degrees and goes negative beyond" height={height} loop={9} stillAt={1.5}>
      {(t) => {
        const th = 180 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 9));
        const ab = (a0 + th) * DEG;
        const ua: Pt = [Math.cos(a0 * DEG), -Math.sin(a0 * DEG)];
        const bx = o[0] + s * LB * Math.cos(ab);
        const by = o[1] - s * LB * Math.sin(ab);
        const sh = LB * Math.cos(th * DEG);
        const foot: Pt = [o[0] + s * sh * ua[0], o[1] + s * sh * ua[1]];
        const dot = LA * LB * Math.cos(th * DEG);
        return (
          <g>
            <Line x1={o[0] - 3.2 * s * ua[0]} y1={o[1] - 3.2 * s * ua[1]} x2={o[0] + 5.2 * s * ua[0]} y2={o[1] + 5.2 * s * ua[1]} tone="faint" />
            <Line x1={bx} y1={by} x2={foot[0]} y2={foot[1]} tone="soft" dashed />
            <Arrow x1={o[0]} y1={o[1]} x2={o[0] + s * LA * ua[0]} y2={o[1] + s * LA * ua[1]} />
            <Arrow x1={o[0]} y1={o[1]} x2={bx} y2={by} />
            <Line x1={o[0] + 3} y1={o[1] + 7} x2={foot[0] + 3} y2={foot[1] + 7} tone="bright" />
            <Label x={o[0] + s * LA * ua[0] + 16} y={o[1] + s * LA * ua[1] + 4}>
              A
            </Label>
            <Label x={bx + (Math.cos(ab) >= 0 ? 14 : -14)} y={by - 8}>
              B
            </Label>
            <path className="fig-guide" fill="none" d={arc(o[0], o[1], 30, a0, a0 + Math.max(th, 0.01))} />
            <Label x={420} y={o[1] - 100} kind="val" anchor="start">
              {`θ = ${f1(th, 0)}°`}
            </Label>
            <Label x={420} y={o[1] - 72} kind="val" anchor="start">
              {`shadow of B = B cos θ = ${f1(sh)}`}
            </Label>
            <Label x={420} y={o[1] - 44} kind="val" anchor="start">
              {`A · B = A B cos θ = ${f1(dot)}`}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function WorkPreview() {
  const gy = 150;
  const bx = 150;
  return (
    <Anim title="A pull at an angle: only the part of the force along the motion does work, F d cos phi" height={205} loop={8} stillAt={1.8}>
      {(t) => {
        const phi = 80 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 8));
        const c = Math.cos(phi * DEG);
        const L = 120;
        const p: Pt = [bx + 30, gy - 18];
        const tip: Pt = [p[0] + L * c, p[1] - L * Math.sin(phi * DEG)];
        return (
          <g>
            <Ground y={gy} />
            <Block x={bx} y={gy - 18} w={60} h={36} label="m" />
            <Line x1={tip[0]} y1={tip[1]} x2={tip[0]} y2={p[1]} tone="soft" dashed />
            <Arrow x1={p[0]} y1={p[1]} x2={tip[0]} y2={tip[1]} />
            <Arrow x1={p[0]} y1={p[1] + 9} x2={tip[0]} y2={p[1] + 9} tone="soft" width={3} />
            <Label x={tip[0] + 14} y={tip[1] - 8}>
              F
            </Label>
            <Arrow x1={bx} y1={gy + 30} x2={bx + 250} y2={gy + 30} tone="soft" />
            <Label x={bx + 125} y={gy + 52} kind="val">
              displacement d = 5 m
            </Label>
            <Label x={470} y={50} kind="val" anchor="start">{`φ = ${f1(phi, 0)}°`}</Label>
            <Label x={470} y={76} kind="val" anchor="start">{`F = 10 N`}</Label>
            <Label x={470} y={104} kind="val" anchor="start">{`W = F d cos φ = ${f1(50 * c)} J`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function DotGauge() {
  const s = 30;
  const o: Pt = [120, 130];
  return (
    <Anim title="The dot product of two vectors is a single number, positive, zero or negative, sliding along a number line as B turns" height={200} loop={9} stillAt={1.5}>
      {(t) => {
        const th = 180 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 9));
        const dot = 12 * Math.cos(th * DEG);
        const nx = 480 + dot * 10;
        return (
          <g>
            <Arrow x1={o[0]} y1={o[1]} x2={o[0] + 4 * s} y2={o[1]} />
            <Arrow x1={o[0]} y1={o[1]} x2={o[0] + 3 * s * Math.cos(th * DEG)} y2={o[1] - 3 * s * Math.sin(th * DEG)} />
            <Line x1={360} y1={130} x2={600} y2={130} tone="soft" />
            {[-12, 0, 12].map((v) => (
              <g key={v}>
                <Line x1={480 + 10 * v} y1={124} x2={480 + 10 * v} y2={136} tone="soft" />
                <Label x={480 + 10 * v} y={156} kind="val">
                  {f1(v, 0)}
                </Label>
              </g>
            ))}
            <Ball x={nx} y={130} r={7} />
            <Label x={480} y={80} kind="val">{`A · B = ${f1(dot)}`}</Label>
            <Label x={480} y={52} kind="label">
              just a number
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 11. cross product extras

export function AreaParallelogram({ height = 250, a = 4, b = 3 }: { height?: number; a?: number; b?: number }) {
  const s = 38;
  const o: Pt = [110, height - 60];
  return (
    <Anim title="The area of the parallelogram on A and B is the base A times the height B sine theta, which is the size of A cross B" height={height} loop={9} stillAt={1.5}>
      {(t) => {
        const th = 20 + 140 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 9));
        const tb = th * DEG;
        const A: Pt = [o[0] + s * a, o[1]];
        const B: Pt = [o[0] + s * b * Math.cos(tb), o[1] - s * b * Math.sin(tb)];
        const R: Pt = [A[0] + B[0] - o[0], B[1]];
        const h = b * Math.sin(tb);
        return (
          <g>
            <Poly pts={[o, A, R, B]} />
            <Line x1={B[0]} y1={B[1]} x2={B[0]} y2={o[1]} tone="soft" dashed />
            <Line x1={o[0] - 40} y1={o[1]} x2={Math.max(A[0], B[0]) + 20} y2={o[1]} tone="faint" />
            <Arrow x1={o[0]} y1={o[1]} x2={A[0]} y2={A[1]} />
            <Arrow x1={o[0]} y1={o[1]} x2={B[0]} y2={B[1]} />
            <Label x={(o[0] + A[0]) / 2} y={o[1] + 26}>
              A
            </Label>
            <Label x={(o[0] + B[0]) / 2 - 16} y={(o[1] + B[1]) / 2}>
              B
            </Label>
            <Label x={B[0] + 22} y={(B[1] + o[1]) / 2 + 4}>
              h
            </Label>
            <Label x={430} y={o[1] - 130} kind="val" anchor="start">{`θ = ${f1(th, 0)}°`}</Label>
            <Label x={430} y={o[1] - 102} kind="val" anchor="start">{`h = B sin θ = ${f1(h)}`}</Label>
            <Label x={430} y={o[1] - 74} kind="val" anchor="start">{`area = A h = ${f1(a * h)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function TorquePreview() {
  const o: Pt = [150, 110];
  const L = 150;
  return (
    <Anim title="A spanner of length r pulled by a force F: the turning effect r F sine of the angle is biggest when the force is at right angles to the spanner" height={220} loop={8} stillAt={2}>
      {(t) => {
        const al = 65 * Math.sin((2 * Math.PI * t) / 8);
        const tip: Pt = [o[0] + L * Math.cos(al * DEG), o[1] - L * Math.sin(al * DEG)];
        const phi = 90 + al;
        const tau = 20 * 1.5 * Math.sin(phi * DEG);
        return (
          <g>
            <Line x1={o[0]} y1={o[1]} x2={tip[0]} y2={tip[1]} tone="bright" />
            <Ball x={o[0]} y={o[1]} r={5} glow={false} />
            <Arrow x1={tip[0]} y1={tip[1]} x2={tip[0]} y2={tip[1] + 70} width={4} />
            <Label x={tip[0] + 18} y={tip[1] + 62}>
              F
            </Label>
            <Label x={(o[0] + tip[0]) / 2 - 6} y={(o[1] + tip[1]) / 2 - 18}>
              r
            </Label>
            <Label x={400} y={70} kind="val" anchor="start">{`angle between r and F = ${f1(phi, 0)}°`}</Label>
            <Label x={400} y={98} kind="val" anchor="start">{`τ = r F sin φ = ${f1(tau)} N m`}</Label>
            <Label x={400} y={126} kind="label" anchor="start">
              r = 1.5 m, F = 20 N
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ mistakes (flat)

export function MistakeAddMagnitudes() {
  const s = 30;
  const o: Pt = [150, 140];
  return (
    <Anim title="A 3 newton and a 4 newton force only add to 7 newtons when they point the same way; at right angles they make 5" height={215} loop={9} stillAt={3}>
      {(t) => {
        const phi = 180 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 9));
        const a: Pt = [o[0] + 3 * s, o[1]];
        const b: Pt = [a[0] + 4 * s * Math.cos(phi * DEG), a[1] - 4 * s * Math.sin(phi * DEG)];
        const R = Math.sqrt(9 + 16 + 24 * Math.cos(phi * DEG));
        return (
          <g>
            <Arrow x1={o[0]} y1={o[1]} x2={a[0]} y2={a[1]} tone="soft" />
            <Arrow x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} tone="soft" />
            <Arrow x1={o[0]} y1={o[1] + 8} x2={b[0]} y2={b[1] + 8} width={4} />
            <Label x={o[0] + 1.5 * s} y={o[1] + 40}>
              3 N
            </Label>
            <Label x={420} y={60} kind="val" anchor="start">{`angle between = ${f1(phi, 0)}°`}</Label>
            <Label x={420} y={92} kind="val" anchor="start">{`resultant = ${f1(R)} N`}</Label>
            <Label x={420} y={120} kind="val" anchor="start">
              3 + 4 = 7 N only at 0°
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function MistakeSubtractOrder() {
  const s = 40;
  const o: Pt = [150, 170];
  const A: Pt = [o[0] + 3 * s, o[1] - 0.8 * s];
  const B: Pt = [o[0] + 1 * s, o[1] - 2.2 * s];
  return (
    <Anim title="A minus B points from the tip of B to the tip of A; B minus A points the opposite way" height={210} loop={8} stillAt={2}>
      {(t) => {
        const pFlip = ease(phase(t, 3.4, 4.4));
        const second = pFlip > 0.5;
        const [x1, y1, x2, y2] = second ? [A[0], A[1], B[0], B[1]] : [B[0], B[1], A[0], A[1]];
        const fade = second ? ease((pFlip - 0.5) * 2) : 1 - ease(pFlip * 2);
        return (
          <g>
            <Arrow x1={o[0]} y1={o[1]} x2={A[0]} y2={A[1]} tone="soft" />
            <Arrow x1={o[0]} y1={o[1]} x2={B[0]} y2={B[1]} tone="soft" />
            <Label x={A[0] + 16} y={A[1] + 4}>
              A
            </Label>
            <Label x={B[0] - 12} y={B[1] - 12}>
              B
            </Label>
            <g opacity={fade}>
              <Arrow x1={x1} y1={y1} x2={x2} y2={y2} width={4} />
            </g>
            <Label x={430} y={90} kind="val" anchor="start">
              {second && pFlip > 0.6 ? 'B − A' : 'A − B'}
            </Label>
            <Label x={430} y={116} kind="label" anchor="start">
              {second && pFlip > 0.6 ? 'points back to A' : 'points toward A'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function MistakeCosAlways() {
  const len = 130;
  const o: Pt = [140, 175];
  return (
    <Anim title="When the angle is measured from the vertical, the x component is A sine theta, not A cosine theta" height={205} loop={8} stillAt={2}>
      {(t) => {
        const th = 80 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 8));
        const tip: Pt = [o[0] + len * Math.sin(th * DEG), o[1] - len * Math.cos(th * DEG)];
        const A = 10;
        return (
          <g>
            <Line x1={o[0] - 10} y1={o[1]} x2={o[0] + len + 20} y2={o[1]} tone="faint" />
            <Line x1={o[0]} y1={o[1] + 10} x2={o[0]} y2={o[1] - len - 10} tone="faint" dashed />
            <Line x1={tip[0]} y1={tip[1]} x2={tip[0]} y2={o[1]} tone="soft" dashed />
            <Arrow x1={o[0]} y1={o[1] + 8} x2={tip[0]} y2={o[1] + 8} tone="soft" width={3} />
            <Arrow x1={o[0]} y1={o[1]} x2={tip[0]} y2={tip[1]} width={4} />
            <path className="fig-guide" fill="none" d={arc(o[0], o[1], 44, 90 - th, 90)} />
            <Label x={o[0] + 14} y={o[1] - 54}>
              θ
            </Label>
            <Label x={380} y={70} kind="val" anchor="start">{`θ = ${f1(th, 0)}° from the vertical`}</Label>
            <Label x={380} y={100} kind="val" anchor="start">{`x = A sin θ = ${f1(A * Math.sin(th * DEG))}`}</Label>
            <Label x={380} y={128} kind="val" anchor="start">{`A cos θ = ${f1(A * Math.cos(th * DEG))}  (that is y)`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}
