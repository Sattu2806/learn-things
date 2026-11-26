import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Block, DEG, Ground, Incline, Label, Line, Pulley, Readout, Trail, W, clamp, ease, lerp, phase, slopePoint } from '../kit/Anim';

/** The animated diagrams of the Newton's laws chapter. Every position is worked out from the real physics. */

const G = 9.8;

/** Fades a group in as p goes 0 → 1. */
function Fade({ p, children }: { p: number; children: ReactNode }) {
  return <g opacity={clamp(p)}>{children}</g>;
}

/** Text with a little subscript. */
function Sub({ a, b }: { a: string; b: string }) {
  return (
    <>
      {a}
      <tspan className="fig-sup" dy={5}>
        {b}
      </tspan>
    </>
  );
}

/** An arrow growing out of its tail as p goes 0 → 1. */
function Grow({ x, y, dx, dy, p = 1, ...rest }: { x: number; y: number; dx: number; dy: number; p?: number; dashed?: boolean; tone?: 'bright' | 'soft' | 'faint'; label?: ReactNode; labelAt?: 'end' | 'mid' }) {
  const q = ease(p);
  return <Arrow x1={x} y1={y} x2={x + dx * q} y2={y + dy * q} {...rest} label={q > 0.9 ? rest.label : undefined} />;
}

/** Position, velocity and acceleration for a list of pieces of motion (a in m/s², d in s). */
export interface Seg {
  a: number;
  d: number;
}
export function kin(segs: Seg[], t: number) {
  let y = 0;
  let v = 0;
  let left = t;
  for (const s of segs) {
    const dt = Math.min(left, s.d);
    if (dt <= 0) break;
    y += v * dt + 0.5 * s.a * dt * dt;
    v += s.a * dt;
    left -= dt;
    if (left <= 0) return { y, v, a: s.a };
  }
  return { y, v, a: 0 };
}

// ------------------------------------------------------------------ 1. inertia

/** Galileo's slopes: the ball climbs back to the same height, however gentle the second slope, and on a flat floor it never stops. */
export function GalileoSlopes() {
  const H = 90;
  const base = 190;
  const bx = 240;
  const thL = 30;
  const topL = { x: bx - H / Math.tan(thL * DEG), y: base - H };
  return (
    <Anim title="A ball rolls down one slope and up another to the same height; on a flat floor it would roll forever" height={230} loop={13}>
      {(t) => {
        const ph = t < 4.3 ? 0 : t < 8.6 ? 1 : 2;
        const th = [30, 14, 0][ph];
        const lt = t - [0, 4.3, 8.6][ph];
        const r = 6.5;
        const tauDown = phase(lt, 0.3, 1.5);
        const tauUp = phase(lt, 1.5, 3.4);
        const downLen = H / Math.sin(thL * DEG);
        const pDown = downLen * tauDown * tauDown;
        // surface point and outward normal for each stretch of the track
        let surf = { x: topL.x, y: topL.y };
        let nrm = { x: Math.sin(thL * DEG), y: -Math.cos(thL * DEG) };
        if (tauUp > 0) {
          if (th > 0) {
            const upLen = H / Math.sin(th * DEG);
            const d = upLen * (1 - (1 - tauUp) * (1 - tauUp));
            surf = { x: bx + d * Math.cos(th * DEG), y: base - d * Math.sin(th * DEG) };
            nrm = { x: -Math.sin(th * DEG), y: -Math.cos(th * DEG) };
          } else {
            surf = { x: bx + 170 * (lt - 1.5), y: base };
            nrm = { x: 0, y: -1 };
          }
        } else if (lt >= 0.3) {
          surf = { x: topL.x + pDown * Math.cos(thL * DEG), y: topL.y + pDown * Math.sin(thL * DEG) };
        }
        const cx = surf.x + nrm.x * r;
        const cy = surf.y + nrm.y * r;
        const endX = th > 0 ? bx + H / Math.tan(th * DEG) : W;
        const note = ['Same slope: it climbs back to the same height', 'Gentler slope: it goes farther to reach that height', 'No slope at all: it never reaches it, so it never stops'][ph];
        return (
          <g>
            <Line x1={topL.x} y1={topL.y} x2={bx} y2={base} tone="bright" />
            <Line x1={bx} y1={base} x2={endX} y2={th > 0 ? base - H : base} tone="bright" />
            <Line x1={topL.x - 8} y1={topL.y - r - 6} x2={th > 0 ? endX + 8 : W - 10} y2={topL.y - r - 6} dashed tone="faint" />
            <Label x={W - 14} y={topL.y - r - 12} kind="label" anchor="end">
              starting height
            </Label>
            <Label x={16} y={28} kind="label" anchor="start">
              {note}
            </Label>
            <Ball x={cx} y={cy} r={r} />
            {ph === 2 && lt > 2 && <Arrow x1={bx + 60} y1={base - 26} x2={bx + 130} y2={base - 26} tone="soft" />}
          </g>
        );
      }}
    </Anim>
  );
}

/** A puck on ice keeps going; a book on a table stops. */
export function PuckVsBook() {
  return (
    <Anim title="Both are shoved at the same speed. The puck on ice keeps going; the book on the table slows down and stops" height={210} loop={6.6} stillAt={3.2}>
      {(t) => {
        const v0 = 100;
        const stop = 3;
        const xp = Math.min(60 + v0 * t, 600);
        const tt = Math.min(t, stop);
        const xb = 60 + v0 * (tt - (tt * tt) / (2 * stop));
        const vb = v0 * (1 - tt / stop);
        const moving = t < stop;
        return (
          <g>
            <Label x={16} y={30} kind="label" anchor="start">
              puck on smooth ice
            </Label>
            <Ground y={86} />
            <Trail points={[[60, 82], [xp, 82]]} tone="faint" dashed />
            <Block x={xp} y={72} w={34} h={20} label="" />
            <Arrow x1={xp + 17} y1={72} x2={xp + 17 + Math.min(70, 0.7 * v0)} y2={72} />
            <Label x={W - 14} y={30} kind="val" anchor="end">
              no force along the motion: v stays
            </Label>
            <Label x={16} y={128} kind="label" anchor="start">
              book on a rough table
            </Label>
            <Ground y={186} />
            <Trail points={[[60, 182], [xb, 182]]} tone="faint" dashed />
            <Block x={xb} y={172} w={34} h={20} />
            {vb > 4 && <Arrow x1={xb + 17} y1={172} x2={xb + 17 + 0.7 * vb} y2={172} />}
            {moving && <Arrow x1={xb - 17} y1={172} x2={xb - 17 - 34} y2={172} tone="soft" label="f" labelAt="end" />}
            <Label x={W - 14} y={130} kind="val" anchor="end">
              {moving ? 'friction slows it down' : 'friction has stopped it'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 2. first law

/** Balanced forces: steady velocity. Unbalanced: velocity changes. */
export function FirstLawCart() {
  return (
    <Anim title="A cart under balanced forces moves at a steady speed; when the push grows the speed starts to change" height={190} loop={8.5} stillAt={2.5}>
      {(t) => {
        const v1 = 42;
        const a2 = 32;
        const t1 = 3.4;
        const t2 = 6.4;
        let x: number;
        let v: number;
        if (t < t1) {
          x = 60 + v1 * t;
          v = v1;
        } else if (t < t2) {
          const s = t - t1;
          x = 60 + v1 * t1 + v1 * s + 0.5 * a2 * s * s;
          v = v1 + a2 * s;
        } else {
          const s = t2 - t1;
          x = 60 + v1 * t1 + v1 * s + 0.5 * a2 * s * s;
          v = v1 + a2 * s;
        }
        const push = t < t1 ? 40 : lerp(40, 70, phase(t, t1, t1 + 0.4));
        const net = push - 40;
        return (
          <g>
            <Ground y={140} />
            <Block x={x} y={122} w={46} h={30} />
            <Arrow x1={x + 23} y1={122} x2={x + 23 + push} y2={122} label="F" />
            <Arrow x1={x - 23} y1={122} x2={x - 23 - 40} y2={122} tone="soft" label="f" />
            <Arrow x1={x} y1={78} x2={x + v * 0.9} y2={78} tone="soft" label="v" />
            <Label x={16} y={30} kind="label" anchor="start">
              {net < 1 ? 'forces balance: net force is zero, so v is steady' : 'push is bigger: net force is not zero, so v changes'}
            </Label>
            <Readout y={54}>net force = {net < 1 ? '0' : 'F − f'}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 3. second law

/** Three carts race: double the force, double the acceleration; double the mass, half the acceleration. */
export function CartRace() {
  const lanes = [
    { F: 1, m: 1, name: 'F = 1 N, m = 1 kg' },
    { F: 2, m: 1, name: 'F = 2 N, m = 1 kg' },
    { F: 1, m: 2, name: 'F = 1 N, m = 2 kg' },
  ];
  return (
    <Anim title="Three carts released together: doubling the force doubles the acceleration, doubling the mass halves it" height={290} loop={6} stillAt={3}>
      {(t) => {
        const k = 42; // pixels per metre, per this toy scale
        return (
          <g>
            {lanes.map((l, i) => {
              const top = 14 + i * 90;
              const gy = top + 80;
              const a = l.F / l.m;
              const x = 70 + 0.5 * a * k * Math.min(t, 3.2) ** 2;
              const w = 30 + 14 * l.m;
              const h = 24 + 6 * l.m;
              return (
                <g key={l.name}>
                  <Ground y={gy} />
                  <Label x={14} y={top + 18} kind="val" anchor="start">
                    {l.name}
                  </Label>
                  <Label x={W - 14} y={top + 18} kind="val" anchor="end">
                    a = {a} m/s²
                  </Label>
                  <Block x={x} y={gy - h / 2} w={w} h={h} />
                  <Arrow x1={x - w / 2 - 6 - 14 * l.F * 1.6} y1={gy - h / 2} x2={x - w / 2 - 2} y2={gy - h / 2} label="F" labelAt="mid" />
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 4. impulse

/** A ball hits a wall: momentum arrows before and after, and the change of momentum. */
export function WallBounce() {
  return (
    <Anim title="A ball hits a wall and bounces back slower; the momentum arrows before and after give the change in momentum, the impulse" height={250} loop={9} stillAt={7.5}>
      {(t) => {
        const wx = 540;
        const r = 11;
        const x0 = 90;
        const e = 0.7;
        const tIn = phase(t, 0.5, 2.4);
        const tHit = phase(t, 2.4, 2.9);
        const tOut = phase(t, 2.9, 4.6);
        let x = x0 + (wx - r - x0) * tIn;
        if (t > 2.9) x = wx - r - (wx - r - x0) * e * tOut;
        const pIn = 110;
        const pOut = pIn * e;
        const squash = Math.sin(Math.PI * tHit) * 5;
        // the push of the wall on the ball during contact
        const F = Math.sin(Math.PI * tHit) * 80;
        const o = { x: 330, y: 205 };
        const comp = phase(t, 5, 7);
        return (
          <g>
            <Wall x={wx} />
            <Ground y={150} x2={wx} />
            <Ball x={x + 0 - squash} y={138} r={r} />
            {t > 0.5 && t < 2.9 && <Arrow x1={x} y1={104} x2={x + pIn * Math.min(1, tIn * 5)} y2={104} label={undefined} />}
            {t > 0.5 && t < 2.9 && <Label x={x + 0} y={92} kind="sym" anchor="start">p before</Label>}
            {t >= 2.9 && t < 5 && <Arrow x1={x} y1={104} x2={x - pOut} y2={104} />}
            {t >= 2.9 && t < 5 && <Label x={x} y={92} kind="sym" anchor="start">p after</Label>}
            {F > 3 && <Arrow x1={wx - 4} y1={138} x2={wx - 4 - F} y2={138} tone="soft" />}
            {F > 3 && <Label x={wx - 50} y={178} kind="sym">F</Label>}
            <Label x={16} y={26} kind="label" anchor="start">
              the wall pushes for a very short time
            </Label>
            <Fade p={comp}>
              <Label x={16} y={196} kind="val" anchor="start">
                Δp = p after − p before
              </Label>
              <Label x={16} y={218} kind="val" anchor="start">
                = F · Δt
              </Label>
              <Arrow x1={o.x} y1={o.y} x2={o.x + pIn} y2={o.y} tone="soft" />
              <Arrow x1={o.x + pIn} y1={o.y + 12} x2={o.x - pOut} y2={o.y + 12} label={undefined} />
              <Line x1={o.x} y1={o.y} x2={o.x - pOut} y2={o.y} dashed tone="soft" />
              <Label x={o.x + pIn / 2} y={o.y - 8} kind="label">
                before
              </Label>
              <Label x={o.x + 20} y={o.y + 38} kind="label">
                Δp points back, away from the wall
              </Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

function Wall({ x }: { x: number }) {
  const marks = [];
  for (let y = 40; y < 150; y += 14) marks.push(<line key={y} className="fig-guide fig-faint" x1={x} y1={y} x2={x + 8} y2={y + 8} />);
  return (
    <g>
      <line className="fig-ground" x1={x} x2={x} y1={40} y2={150} />
      {marks}
    </g>
  );
}

/** Force against time: the same area (impulse) for a short hard catch and a long soft one. */
export function ImpulseAreas({ F1 = 40, T1 = 0.1, F2 = 8, T2 = 0.5, height = 240, loop = 8 }: { F1?: number; T1?: number; F2?: number; T2?: number; height?: number; loop?: number }) {
  return (
    <Anim title="Force against time for a short hard stop and a long soft stop: the areas under the graphs are equal" height={height} loop={loop} stillAt={loop - 1}>
      {(t) => {
        const x0 = 70;
        const y0 = 190;
        const kx = 600; // px per second
        const ky = 3.6; // px per newton
        const p1 = phase(t, 0.6, 2.4);
        const p2 = phase(t, 3.2, 6.2);
        const w1 = T1 * kx * p1;
        const w2 = T2 * kx * p2;
        return (
          <g>
            <Axes x={x0} y={y0} w={480} h={170} xLabel="t" yLabel="F" />
            <Label x={x0 + T1 * kx + 8} y={y0 - F1 * ky + 6} kind="val" anchor="start">
              {F1} N for {T1} s
            </Label>
            <rect className="kit-block" x={x0} y={y0 - F1 * ky} width={w1} height={F1 * ky} opacity={0.9} />
            <Label x={x0 + T2 * kx} y={y0 - F2 * ky - 8} kind="val" anchor="end">
              {F2} N for {T2} s
            </Label>
            <rect className="kit-block" x={x0} y={y0 - F2 * ky} width={w2} height={F2 * ky} opacity={p2 > 0 ? 0.9 : 0} />
            <Fade p={phase(t, 6.4, 7.2)}>
              <Label x={x0 + 300} y={y0 - 120} kind="label">
                same area, same impulse
              </Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 5. third law

/** Two skaters push off: equal and opposite forces, on different bodies; momentum balances. */
export function SkaterPush({ mA = 60, mB = 40, height = 220 }: { mA?: number; mB?: number; height?: number }) {
  return (
    <Anim title="Two skaters push each other apart: equal and opposite forces act on the two different skaters" height={height} loop={7} stillAt={4.5}>
      {(t) => {
        const T0 = 1;
        const T1 = 1.6;
        const vA = (-60 * 40) / mA; // px/s, momentum balanced
        const vB = (60 * 40) / mB;
        const disp = (v: number) => {
          if (t < T0) return 0;
          if (t < T1) return (0.5 * v * (t - T0) ** 2) / (T1 - T0);
          return 0.5 * v * (T1 - T0) + v * (t - T1);
        };
        const vNow = (v: number) => (t < T0 ? 0 : t < T1 ? (v * (t - T0)) / (T1 - T0) : v);
        const wA = 28 + mA * 0.2;
        const wB = 28 + mB * 0.2;
        const xA = 320 - wA / 2 + disp(vA);
        const xB = 320 + wB / 2 + disp(vB);
        const gy = 170;
        const push = t > T0 && t < T1;
        return (
          <g>
            <Ground y={gy} />
            <Block x={xA} y={gy - 28} w={wA} h={56} label="A" />
            <Block x={xB} y={gy - 28} w={wB} h={56} label="B" />
            <Label x={xA} y={gy + 28} kind="val">
              {mA} kg
            </Label>
            <Label x={xB} y={gy + 28} kind="val">
              {mB} kg
            </Label>
            <Fade p={push ? 1 : 0}>
              <Arrow x1={xA + wA / 2} y1={gy - 56 - 14} x2={xA + wA / 2 - 56} y2={gy - 56 - 14} label={<Sub a="F" b="B on A" />} />
              <Arrow x1={xB - wB / 2} y1={gy - 56 - 14} x2={xB - wB / 2 + 56} y2={gy - 56 - 14} label={<Sub a="F" b="A on B" />} />
            </Fade>
            {t >= T1 && <Arrow x1={xA} y1={gy - 80} x2={xA + vNow(vA) * 1.2} y2={gy - 80} tone="soft" label="v" />}
            {t >= T1 && <Arrow x1={xB} y1={gy - 80} x2={xB + vNow(vB) * 1.2} y2={gy - 80} tone="soft" label="v" />}
            <Label x={16} y={26} kind="label" anchor="start">
              {t < T0 ? 'two skaters at rest on ice' : push ? 'A pushes B, and B pushes A, at the same moment' : 'the lighter skater ends up faster'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 6. free-body diagram

/** Build the free-body diagram of a block on a rough slope, arrow by arrow. */
export function SlopeFBD() {
  const x = 60;
  const y = 275;
  const base = 420;
  const ang = 30;
  const d = 215;
  const bw = 54;
  const bh = 34;
  const c = slopePoint(x, y, ang, d, bh / 2);
  const mg = 78;
  const dn = { x: Math.sin(ang * DEG), y: Math.cos(ang * DEG) }; // into the slope
  const out = { x: -dn.x, y: -dn.y };
  const up = { x: Math.cos(ang * DEG), y: -Math.sin(ang * DEG) }; // up the slope
  const caps = ['1  Choose the body: the block', '2  Weight: gravity pulls straight down', '3  Normal force: the slope pushes out, at 90° to it', '4  Friction: along the slope, against the slipping', '5  Split the weight along and across the slope', '6  The block is at rest, so the forces cancel in each direction'];
  return (
    <Anim title="A free-body diagram built arrow by arrow for a block on a slope: weight, normal force, friction, then the components of the weight" height={300} loop={13} stillAt={11}>
      {(t) => {
        const pW = phase(t, 1.8, 2.8);
        const pN = phase(t, 3.6, 4.6);
        const pF = phase(t, 5.4, 6.4);
        const pC = phase(t, 7.2, 8.4);
        const step = t < 1.5 ? 0 : t < 3.3 ? 1 : t < 5.1 ? 2 : t < 6.9 ? 3 : t < 8.8 ? 4 : 5;
        return (
          <g>
            <Incline x={x} y={y} base={base} angle={ang} mark={false} />
            <Block x={c.x} y={c.y} w={bw} h={bh} angle={ang} />
            <circle className="fig-ball" cx={c.x} cy={c.y} r={3.5} />
            <Grow x={c.x} y={c.y} dx={0} dy={mg} p={pW} label="mg" />
            <Grow x={c.x} y={c.y} dx={out.x * mg * Math.cos(ang * DEG)} dy={out.y * mg * Math.cos(ang * DEG)} p={pN} label="N" />
            <Grow x={c.x} y={c.y} dx={up.x * mg * Math.sin(ang * DEG)} dy={up.y * mg * Math.sin(ang * DEG)} p={pF} label="f" />
            <Grow x={c.x} y={c.y} dx={-up.x * mg * Math.sin(ang * DEG)} dy={-up.y * mg * Math.sin(ang * DEG)} p={pC} dashed tone="soft" />
            <Grow x={c.x} y={c.y} dx={dn.x * mg * Math.cos(ang * DEG)} dy={dn.y * mg * Math.cos(ang * DEG)} p={pC} dashed tone="soft" />
            <Fade p={pC}>
              <Label x={c.x - 112} y={c.y + 40} kind="val" anchor="start">
                mg sin θ
              </Label>
              <Label x={c.x + 36} y={c.y + 66} kind="val" anchor="start">
                mg cos θ
              </Label>
            </Fade>
            <Label x={x + 54} y={y - 6} kind="sym">
              θ
            </Label>
            <Label x={16} y={28} kind="label" anchor="start">
              {caps[step]}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 7. weight, normal force, tension

/** A block on a table: the normal force adjusts to whatever else pushes or pulls. */
export function NormalForce() {
  return (
    <Anim title="The normal force from the table is not fixed: it grows when a hand presses down and shrinks when a hand pulls up" height={230} loop={11} stillAt={3}>
      {(t) => {
        const W0 = 56;
        const down = lerp(0, 40, ease(phase(t, 2.2, 3.6))) * (1 - ease(phase(t, 4.6, 5.6)));
        const upF = lerp(0, 34, ease(phase(t, 6.4, 7.8))) * (1 - ease(phase(t, 8.8, 9.8)));
        const N = W0 + down - upF;
        const label = upF > 1 ? 'pulled up: N = mg − F' : down > 1 ? 'pressed down: N = mg + F' : 'at rest on the table: N = mg';
        const cy = 128;
        return (
          <g>
            <Ground y={cy + 30} x1={160} x2={480} />
            <Block x={320} y={cy} w={80} h={60} label="m" />
            <Arrow x1={300} y1={cy} x2={300} y2={cy + W0} label="W" />
            <Arrow x1={300} y1={cy} x2={300} y2={cy - N} label="N" />
            {down > 1 && <Arrow x1={346} y1={cy - 30 - down} x2={346} y2={cy - 30} label="F" />}
            {upF > 1 && <Arrow x1={346} y1={cy - 30} x2={346} y2={cy - 30 - upF} label="F" />}
            <Label x={16} y={30} kind="label" anchor="start">
              {label}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** A light string pulls with the same tension at both ends. */
export function StringTension() {
  return (
    <Anim title="A light string pulls a block along a smooth table; the tension is the same at the block and at the hand" height={200} loop={6} stillAt={2.2}>
      {(t) => {
        const a = 36;
        const s = 0.5 * a * Math.min(t, 3.6) ** 2;
        const x = 90 + s;
        const hand = x + 250;
        const T = 52;
        return (
          <g>
            <Ground y={140} />
            <Line x1={x + 28} y1={118} x2={hand} y2={118} tone="bright" />
            <Block x={x} y={118} w={56} h={44} label="m" />
            <Arrow x1={x + 28} y1={100} x2={x + 28 + T} y2={100} label="T" />
            <circle className="fig-ball" cx={hand} cy={118} r={5} />
            <Arrow x1={hand} y1={100} x2={hand - T} y2={100} label="T" />
            <Label x={(x + 28 + hand) / 2} y={150} kind="label">
              light string: T all along
            </Label>
            <Label x={16} y={28} kind="val" anchor="start">
              T = m a
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 8. connected bodies

/** Two blocks pushed together: same acceleration, and the contact forces form an action-reaction pair. */
export function PushedBlocks({ mA = 2, mB = 3, F = 10, height = 210 }: { mA?: number; mB?: number; F?: number; height?: number }) {
  const a = F / (mA + mB);
  const contact = mB * a;
  return (
    <Anim title="Two blocks pushed together on a smooth floor share one acceleration; the first pushes the second with the contact force" height={height} loop={6} stillAt={2.4}>
      {(t) => {
        const k = 26;
        const x = 130 + 0.5 * a * k * Math.min(t, 3.4) ** 2;
        const wa = 36 + mA * 7;
        const wb = 36 + mB * 7;
        const gy = 160;
        const h = 44;
        const kF = 4.5;
        return (
          <g>
            <Ground y={gy} />
            <Block x={x + wa / 2} y={gy - h / 2} w={wa} h={h} label="A" />
            <Block x={x + wa + wb / 2} y={gy - h / 2} w={wb} h={h} label="B" />
            <Arrow x1={x - 6 - F * kF} y1={gy - h / 2} x2={x - 4} y2={gy - h / 2} label="F" labelAt="mid" />
            <Arrow x1={x + wa} y1={gy - h - 12} x2={x + wa - contact * kF} y2={gy - h - 12} tone="soft" label={<Sub a="N" b="BA" />} />
            <Arrow x1={x + wa} y1={gy - h - 12} x2={x + wa + contact * kF} y2={gy - h - 12} label={<Sub a="N" b="AB" />} />
            <Label x={16} y={26} kind="val" anchor="start">
              a = F / ( mA + mB ) = {a.toFixed(1)} m/s²
            </Label>
            <Label x={W - 14} y={26} kind="val" anchor="end">
              contact force = mB · a = {contact.toFixed(0)} N
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** A block on a table pulled by a hanging mass over a pulley. */
export function TableHang({ M = 3, m = 1 }: { M?: number; m?: number }) {
  const a = (m * G) / (M + m);
  const T = (M * m * G) / (M + m);
  return (
    <Anim title="A block on a smooth table is pulled along by a hanging mass; the string tension is less than the weight of the hanging mass" height={250} loop={6} stillAt={2.8}>
      {(t) => {
        const k = 16; // px per metre
        const s = Math.min(0.5 * a * k * Math.min(t, 2.6) ** 2, 95);
        const px = 450;
        const bx = 100 + s;
        const wy = 70;
        const hy = 120 + s;
        const kN = 1.6;
        return (
          <g>
            <Ground y={wy} x1={40} x2={px - 6} hatch />
            <Pulley x={px} y={wy} r={14} />
            <Line x1={bx + 28} y1={wy - 14} x2={px} y2={wy - 14} tone="bright" />
            <Line x1={px + 14} y1={wy} x2={px + 14} y2={hy - 17} tone="bright" />
            <Block x={bx} y={wy - 18} w={56} h={36} label="M" />
            <Block x={px + 14} y={hy} w={34} h={34} label="m" />
            <Arrow x1={bx + 28} y1={wy - 40} x2={bx + 28 + T * kN} y2={wy - 40} label="T" />
            <Arrow x1={px + 36} y1={hy} x2={px + 36} y2={hy - T * kN} label="T" />
            <Arrow x1={px + 36} y1={hy} x2={px + 36} y2={hy + m * G * kN} label="mg" />
            <Label x={16} y={200} kind="val" anchor="start">
              a = m g / ( M + m )
            </Label>
            <Label x={16} y={226} kind="val" anchor="start">
              T = M a, smaller than mg
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 9. Atwood machine

/** Atwood machine with accelerations and tensions. */
export function Atwood({ m1 = 3, m2 = 2, height = 310, loop = 7, showArrows = true }: { m1?: number; m2?: number; height?: number; loop?: number; showArrows?: boolean }) {
  const a = ((m1 - m2) * G) / (m1 + m2);
  const T = (2 * m1 * m2 * G) / (m1 + m2);
  return (
    <Anim title={`An Atwood machine with a ${m1} kilogram and a ${m2} kilogram mass: the heavier mass goes down, the lighter goes up, with the same acceleration`} height={height} loop={loop} stillAt={2.2}>
      {(t) => {
        const tMax = 2.4;
        const travel = 80;
        const tt = Math.min(t, tMax);
        const k = travel / (0.5 * a * tMax * tMax); // px per metre, so the run ends after `travel` pixels
        const s = 0.5 * a * tt * tt * k;
        const px = 430;
        const py = 52;
        const r = 36;
        const lx = px - r;
        const rx = px + r;
        const yl = 150 + s;
        const yr = 230 - s;
        const bw = 44;
        const kf = 1.4;
        const h1 = 38;
        return (
          <g>
            <Line x1={px - 60} y1={py - r - 6} x2={px + 60} y2={py - r - 6} tone="faint" />
            <Pulley x={px} y={py} r={r} />
            <Line x1={lx} y1={py} x2={lx} y2={yl - h1 / 2} tone="bright" />
            <Line x1={rx} y1={py} x2={rx} y2={yr - h1 / 2} tone="bright" />
            <Block x={lx} y={yl} w={bw} h={h1} label={`${m1} kg`} />
            <Block x={rx} y={yr} w={bw} h={h1} label={`${m2} kg`} />
            {showArrows && (
              <g>
                <Arrow x1={lx + 12} y1={yl} x2={lx + 12} y2={yl - T * kf} label="T" />
                <Arrow x1={lx - 12} y1={yl} x2={lx - 12} y2={yl + m1 * G * kf} label="W" />
                <Arrow x1={rx - 12} y1={yr} x2={rx - 12} y2={yr - T * kf} label="T" />
                <Arrow x1={rx + 12} y1={yr} x2={rx + 12} y2={yr + m2 * G * kf} label="W" />
                <Arrow x1={lx - 72} y1={yl - 14} x2={lx - 72} y2={yl + 14 + a * 6} tone="soft" label="a" />
                <Arrow x1={rx + 72} y1={yr + 14} x2={rx + 72} y2={yr - 14 - a * 6} tone="soft" label="a" />
              </g>
            )}
            <Label x={16} y={28} kind="val" anchor="start">
              a = (m₁ − m₂) g / (m₁ + m₂) = {a.toFixed(2)} m/s²
            </Label>
            <Label x={16} y={50} kind="val" anchor="start">
              T = 2 m₁ m₂ g / (m₁ + m₂) = {T.toFixed(1)} N
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 10. the lift

export const FULL_RIDE: Seg[] = [
  { a: 2, d: 1.5 },
  { a: 0, d: 1.5 },
  { a: -2, d: 1.5 },
  { a: -G, d: 1.2 },
];

/** A person on a scale in a lift: the reading follows the lift's acceleration. */
export function LiftScale({ segs = FULL_RIDE, mass = 60, loop = 8.2, height = 270, stillAt = 0.6, text = true }: { segs?: Seg[]; mass?: number; loop?: number; height?: number; stillAt?: number; text?: boolean }) {
  return (
    <Anim title="A person stands on a scale in a lift. The scale reading rises when the lift speeds up, and falls to zero in free fall" height={height} loop={loop} stillAt={stillAt}>
      {(t) => {
        const tt = t - 0.5;
        const { y, a } = kin(segs, Math.max(0, tt));
        const sc = 12; // px per metre
        const floor = 236 - y * sc;
        const N = mass * (G + a);
        const cabH = 118;
        const x = 215;
        const k = 56 / (mass * G);
        const reading = Math.max(0, Math.round(N));
        const word = a > 0.1 ? 'accelerating up' : a < -0.1 ? (a <= -G + 0.1 ? 'free fall' : 'accelerating down') : 'steady speed';
        return (
          <g>
            <Line x1={x - 95} y1={30} x2={x - 95} y2={height - 4} tone="faint" />
            <Line x1={x + 95} y1={30} x2={x + 95} y2={height - 4} tone="faint" />
            <rect className="kit-block" x={x - 82} y={floor - cabH} width={164} height={cabH} rx={4} />
            <rect className="kit-block is-filled" x={x - 24} y={floor - 7} width={48} height={7} rx={2} />
            {/* the person */}
            <circle className="fig-ball" cx={x} cy={floor - 76} r={8} />
            <Line x1={x} y1={floor - 68} x2={x} y2={floor - 36} tone="bright" />
            <Line x1={x} y1={floor - 36} x2={x - 8} y2={floor - 8} tone="bright" />
            <Line x1={x} y1={floor - 36} x2={x + 8} y2={floor - 8} tone="bright" />
            <Line x1={x} y1={floor - 60} x2={x - 11} y2={floor - 42} tone="bright" />
            <Line x1={x} y1={floor - 60} x2={x + 11} y2={floor - 42} tone="bright" />
            <Arrow x1={x - 36} y1={floor - 8} x2={x - 36} y2={floor - 8 - N * k} label="N" />
            <Arrow x1={x + 36} y1={floor - 66} x2={x + 36} y2={floor - 66 + mass * G * k} label="W" />
            {text && (
              <g>
                <Label x={365} y={70} kind="label" anchor="start">
                  scale reads
                </Label>
                <Label x={365} y={112} kind="val" anchor="start">
                  {reading} N
                </Label>
                <Label x={365} y={150} kind="label" anchor="start">
                  {word}
                </Label>
                <Label x={365} y={176} kind="val" anchor="start">
                  a = {a > 0 ? '+' : ''}
                  {a.toFixed(1)} m/s²
                </Label>
                <Label x={365} y={200} kind="val" anchor="start">
                  N = m ( g + a )
                </Label>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 11. equilibrium

/** A lamp on two strings: the three forces on the knot add to zero and close into a triangle. */
export function LampTriangle({ a1 = 30, a2 = 60, height = 285, loop = 12 }: { a1?: number; a2?: number; height?: number; loop?: number }) {
  const Wn = 78;
  const T1 = (Wn * Math.cos(a2 * DEG)) / Math.sin((a1 + a2) * DEG);
  const T2 = (Wn * Math.cos(a1 * DEG)) / Math.sin((a1 + a2) * DEG);
  const v1 = { x: -Math.cos(a1 * DEG), y: -Math.sin(a1 * DEG) };
  const v2 = { x: Math.cos(a2 * DEG), y: -Math.sin(a2 * DEG) };
  return (
    <Anim title="A lamp hangs from two strings. The three forces on the knot cancel, so placed head to tail they close into a triangle" height={height} loop={loop} stillAt={9}>
      {(t) => {
        const ceil = 40;
        const P = { x: 215, y: 175 };
        const run1 = (P.y - ceil) / Math.tan(a1 * DEG);
        const run2 = (P.y - ceil) / Math.tan(a2 * DEG);
        const pW = phase(t, 1, 2);
        const p1 = phase(t, 2.4, 3.4);
        const p2 = phase(t, 3.8, 4.8);
        const O = { x: 495, y: 105 };
        const q1 = phase(t, 6, 7);
        const q2 = phase(t, 7.2, 8.2);
        const q3 = phase(t, 8.4, 9.4);
        const wVec = { x: 0, y: Wn };
        const A = { x: O.x + wVec.x, y: O.y + wVec.y };
        const B = { x: A.x + v1.x * T1, y: A.y + v1.y * T1 };
        return (
          <g>
            <Line x1={P.x - run1 - 20} y1={ceil} x2={P.x + run2 + 20} y2={ceil} tone="bright" />
            <Line x1={P.x} y1={P.y} x2={P.x - run1} y2={ceil} tone="bright" />
            <Line x1={P.x} y1={P.y} x2={P.x + run2} y2={ceil} tone="bright" />
            <Line x1={P.x} y1={P.y} x2={P.x} y2={P.y + 34} tone="bright" />
            <Block x={P.x} y={P.y + 48} w={34} h={24} label="" filled />
            <Ball x={P.x} y={P.y} r={4} glow={false} />
            <Grow x={P.x} y={P.y} dx={0} dy={Wn} p={pW} label="W" />
            <Grow x={P.x} y={P.y} dx={v1.x * T1} dy={v1.y * T1} p={p1} label={<Sub a="T" b="1" />} />
            <Grow x={P.x} y={P.y} dx={v2.x * T2} dy={v2.y * T2} p={p2} label={<Sub a="T" b="2" />} />
            <Label x={P.x - run1 + 60} y={ceil + 22} kind="sym">
              {a1}°
            </Label>
            <Label x={P.x + run2 - 52} y={ceil + 26} kind="sym">
              {a2}°
            </Label>
            <Grow x={O.x} y={O.y} dx={wVec.x} dy={wVec.y} p={q1} tone="soft" />
            <Grow x={A.x} y={A.y} dx={v1.x * T1} dy={v1.y * T1} p={q2} tone="soft" />
            <Grow x={B.x} y={B.y} dx={v2.x * T2} dy={v2.y * T2} p={q3} tone="soft" />
            <Fade p={q3}>
              <Label x={O.x} y={height - 24} kind="label">
                head to tail: back to the start
              </Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 12. frames

/** A bus accelerating: the hanging bob leans back; in the bus frame a pseudo-force balances it. */
export function BusPendulum() {
  return (
    <Anim title="In a bus that speeds up, a hanging ball leans backward. In the bus frame an extra pseudo-force appears" height={290} loop={9} stillAt={6.5}>
      {(t) => {
        const a = 0.4;
        const th = Math.atan(a);
        const run = phase(t, 0.8, 1.3);
        const ang = th * ease(run);
        const off = t > 1 ? 0.5 * 48 * (t - 1) ** 2 : 0;
        const bx = 140;
        const by = 40;
        const bw = 360;
        const gy = 190;
        const L = 105;
        const px = 320;
        const pivot = { x: px, y: by };
        const bob = { x: px - L * Math.sin(ang), y: by + L * Math.cos(ang) };
        const pW = phase(t, 2.6, 3.4);
        const pT = phase(t, 3.6, 4.4);
        const pP = phase(t, 5, 5.8);
        const kW = 56;
        const ticks = [];
        for (let i = -1; i < 18; i++) {
          const tx = ((i * 48 - off) % 864 + 864) % 864 - 20;
          if (tx > 0 && tx < W - 10) ticks.push(<line key={i} className="fig-guide fig-faint" x1={tx} y1={gy + 28} x2={tx + 24} y2={gy + 28} />);
        }
        return (
          <g>
            {ticks}
            <rect className="kit-block" x={bx} y={by} width={bw} height={gy - by} rx={6} />
            <circle className="kit-block" cx={bx + 70} cy={gy + 10} r={14} />
            <circle className="kit-block" cx={bx + bw - 70} cy={gy + 10} r={14} />
            <Line x1={pivot.x} y1={pivot.y} x2={bob.x} y2={bob.y} tone="bright" />
            <Ball x={bob.x} y={bob.y} r={9} />
            <Grow x={bob.x} y={bob.y} dx={0} dy={kW} p={pW} label="W" />
            <Grow x={bob.x} y={bob.y} dx={(pivot.x - bob.x) * (kW / (L * Math.cos(th)))} dy={(pivot.y - bob.y) * (kW / (L * Math.cos(th)))} p={pT} label="T" />
            <Grow x={bob.x} y={bob.y} dx={-kW * a} dy={0} p={pP} dashed tone="soft" />
            <Fade p={pP}>
              <Label x={bob.x - kW * a - 14} y={bob.y + 6} kind="val" anchor="end">
                −m a
              </Label>
            </Fade>
            <Arrow x1={bx + bw - 40} y1={by + 26} x2={bx + bw - 40 + 40 * ease(run)} y2={by + 26} tone="soft" label={undefined} />
            <Label x={bx + 14} y={by + 28} kind="label" anchor="start">
              {t < 1 ? 'bus at rest' : 'bus speeds up'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ examples

/** A pushed box: net force and acceleration. */
export function PushedBox() {
  const m = 20;
  const Fp = 100;
  const f = 30;
  const a = (Fp - f) / m;
  return (
    <Anim title="A 20 kilogram box is pushed with 100 newtons against 30 newtons of friction, so it speeds up at 3.5 metres per second squared" height={210} loop={6} stillAt={3}>
      {(t) => {
        const k = 11;
        const tt = Math.min(t, 3.4);
        const x = 100 + 0.5 * a * k * tt * tt;
        const v = a * tt;
        const kF = 1.25;
        return (
          <g>
            <Ground y={160} />
            <Block x={x} y={138} w={64} h={44} label="20 kg" />
            <Arrow x1={x - 32 - Fp * kF} y1={138} x2={x - 34} y2={138} label="100 N" labelAt="mid" />
            <Arrow x1={x + 32} y1={150} x2={x + 32 + f * kF} y2={150} tone="soft" label="" />
            <Arrow x1={x + 32 + f * kF} y1={150} x2={x + 32} y2={150} tone="soft" />
            <Label x={x + 32 + f * kF + 4} y={156} kind="val" anchor="start">
              30 N
            </Label>
            <Arrow x1={x} y1={88} x2={x + v * 5} y2={88} tone="soft" />
            <Label x={16} y={28} kind="val" anchor="start">
              net force = 100 − 30 = 70 N
            </Label>
            <Label x={16} y={52} kind="val" anchor="start">
              a = 70 / 20 = 3.5 m/s²
            </Label>
            <Readout>v = {v.toFixed(1)} m/s</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ mistakes

/** A puck gliding with only weight and the normal force: no forward force is needed. */
export function GlideNoForce() {
  return (
    <Anim title="A puck glides at a steady speed on ice with only its weight and the normal force acting, so there is no forward force" height={170} loop={6} stillAt={2}>
      {(t) => {
        const x = 70 + 90 * t;
        return (
          <g>
            <Ground y={130} />
            <Block x={x} y={115} w={44} h={26} />
            <Arrow x1={x - 8} y1={115} x2={x - 8} y2={115 - 40} />
            <Arrow x1={x + 8} y1={115} x2={x + 8} y2={115 + 0} />
            <Arrow x1={x + 8} y1={115} x2={x + 8} y2={115 + 40} />
            <Arrow x1={x + 26} y1={115} x2={x + 26 + 52} y2={115} tone="soft" />
            <Label x={x + 26 + 52} y={106} kind="label" anchor="end">
              moving
            </Label>
            <Label x={16} y={28} kind="label" anchor="start">
              N up, W down: they cancel, nothing pushes it on
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** The action and the reaction sit on different bodies, so they do not cancel. */
export function PairNotCancel() {
  return (
    <Anim title="A hand pushes a block: the force on the block and the force on the hand act on different bodies, so the block still accelerates" height={170} loop={5} stillAt={2.2}>
      {(t) => {
        const k = 18;
        const x = 120 + 0.5 * 1.6 * k * Math.min(t, 3.2) ** 2;
        return (
          <g>
            <Ground y={130} />
            <Block x={x - 60} y={108} w={44} h={44} label="hand" />
            <Block x={x} y={108} w={52} h={44} label="B" />
            <Arrow x1={x - 26} y1={80} x2={x - 26 + 46} y2={80} label="on B" labelAt="mid" />
            <Arrow x1={x - 38} y1={136 + 0} x2={x - 38 - 46} y2={136} tone="soft" />
            <Label x={x - 60 - 36 - 12} y={162} kind="label" anchor="end">
              on the hand
            </Label>
            <Label x={16} y={26} kind="label" anchor="start">
              different bodies: they cannot cancel
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** The normal force on a slope is mg cos θ, not mg. */
export function NormalOnSlope() {
  return (
    <Anim title="As a slope tilts, the normal force on the block shrinks as mg cos theta while the weight stays the same" height={210} loop={8} stillAt={4}>
      {(t) => {
        const ang = 4 + 36 * (0.5 - 0.5 * Math.cos((Math.PI * 2 * t) / 8));
        const x = 90;
        const y = 190;
        const base = 170;
        const c = slopePoint(x, y, ang, 130, 17);
        const mg = 64;
        const out = { x: -Math.sin(ang * DEG), y: -Math.cos(ang * DEG) };
        return (
          <g>
            <Incline x={x} y={y} base={base} angle={ang} mark={false} />
            <Block x={c.x} y={c.y} w={44} h={34} angle={ang} />
            <Arrow x1={c.x} y1={c.y} x2={c.x} y2={c.y + mg} label="mg" />
            <Arrow x1={c.x} y1={c.y} x2={c.x + out.x * mg * Math.cos(ang * DEG)} y2={c.y + out.y * mg * Math.cos(ang * DEG)} label="N" />
            <Label x={W - 16} y={30} kind="val" anchor="end">
              N = mg cos {Math.round(ang)}° = {(Math.cos(ang * DEG)).toFixed(2)} mg
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** A block hanging on a rope: the tension is not always equal to its weight. */
export function RopeTension() {
  const segs: Seg[] = [
    { a: 2, d: 1.4 },
    { a: 0, d: 1.2 },
    { a: -2, d: 1.4 },
  ];
  const m = 3;
  return (
    <Anim title="A block hangs from a rope. When it speeds up the tension is more than the weight; at steady speed they are equal; when it slows, less" height={250} loop={6} stillAt={0.5}>
      {(t) => {
        const { y, a } = kin(segs, Math.max(0, t - 0.4));
        const by = 120 + y * -14 + 40;
        const kf = 1.6;
        const T = m * (G + a);
        const word = a > 0.1 ? 'T > mg' : a < -0.1 ? 'T < mg' : 'T = mg';
        return (
          <g>
            <Line x1={250} y1={14} x2={390} y2={14} tone="bright" />
            <Line x1={320} y1={14} x2={320} y2={by - 20} tone="bright" />
            <Block x={320} y={by} w={46} h={40} label="3 kg" />
            <Arrow x1={338} y1={by} x2={338} y2={by - T * kf} label="T" />
            <Arrow x1={302} y1={by} x2={302} y2={by + m * G * kf} label="mg" />
            <Label x={16} y={40} kind="val" anchor="start">
              {word}
            </Label>
            <Label x={16} y={64} kind="label" anchor="start">
              {a > 0.1 ? 'speeding up' : a < -0.1 ? 'slowing down' : 'steady'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Mass stays, weight changes: the same ball dropped on Earth and on the Moon. */
export function EarthMoon() {
  return (
    <Anim title="The same 60 kilogram mass on Earth and on the Moon: the mass is the same, the weight is not, so the fall is slower on the Moon" height={250} loop={7} stillAt={2}>
      {(t) => {
        const aE = 9.8;
        const aM = 1.62;
        const k = 120; // px per metre of fall (toy scale)
        const tt = Math.min(t, 3.6);
        const yE = Math.min(0.5 * aE * tt * tt * k * 0.18, 130);
        const yM = Math.min(0.5 * aM * tt * tt * k * 0.18, 130);
        const gy = 200;
        return (
          <g>
            <Line x1={320} y1={30} x2={320} y2={gy} tone="faint" />
            {[160, 480].map((cx, i) => {
              const y = 46 + (i ? yM : yE);
              const wpx = i ? 97.2 * 0.09 : 588 * 0.09;
              return (
                <g key={cx}>
                  <Ground y={gy} x1={cx - 130} x2={cx + 130} />
                  <Label x={cx} y={26} kind="label">
                    {i ? 'Moon' : 'Earth'}
                  </Label>
                  <Ball x={cx} y={y} r={11} />
                  <Arrow x1={cx + 24} y1={y} x2={cx + 24} y2={y + wpx} label="W" />
                  <Label x={cx} y={gy + 26} kind="val">
                    m = 60 kg, W = {i ? '97 N' : '588 N'}
                  </Label>
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}
