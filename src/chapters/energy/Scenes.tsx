import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Block, Ground, Incline, Label, Line, Readout, Spring, Trail, Wall, DEG, clamp, ease, lerp, phase, slopePoint } from '../kit/Anim';

/** Animated diagrams for the work, energy and power chapter. Positions come from the real physics. */

const G = 9.8;

/** A horizontal bar that fills from the left (p from 0 to 1), with a name on its left and an optional value on its right. */
function Bar({ x, y, w, p, label, op = 0.9, val, h = 14 }: { x: number; y: number; w: number; p: number; label: ReactNode; op?: number; val?: ReactNode; h?: number }) {
  return (
    <g>
      <rect className="fig-cell" x={x} y={y} width={w} height={h} rx={2} />
      <rect x={x} y={y} width={Math.max(0, w * clamp(p))} height={h} rx={2} fill="#fff" fillOpacity={op} />
      <Label x={x - 8} y={y + h - 3} anchor="end" kind="label">
        {label}
      </Label>
      {val !== undefined && (
        <Label x={x + w + 8} y={y + h - 3} anchor="start" kind="val">
          {val}
        </Label>
      )}
    </g>
  );
}

/** A bar that fills to the right (positive) or the left (negative) of its middle. */
function SignedBar({ x, y, w, p, h = 16 }: { x: number; y: number; w: number; p: number; h?: number }) {
  const mid = x + w / 2;
  const q = clamp(p, -1, 1);
  return (
    <g>
      <rect className="fig-cell" x={x} y={y} width={w} height={h} rx={2} />
      <rect x={q >= 0 ? mid : mid + (w / 2) * q} y={y} width={(w / 2) * Math.abs(q)} height={h} rx={2} fill="#fff" fillOpacity={q >= 0 ? 0.9 : 0.5} />
      <line className="fig-guide" x1={mid} x2={mid} y1={y - 4} y2={y + h + 4} />
    </g>
  );
}

const f0 = (x: number) => x.toFixed(0);
const f1 = (x: number) => x.toFixed(1);
const f2 = (x: number) => x.toFixed(2);

// ------------------------------------------------------------------ 1. work

/** A box pushed along the floor; the work bar fills as it moves. */
export function PushBox() {
  return (
    <Anim title="A box is pushed along the floor by a steady force, and the work done grows with the distance moved" loop={6.5} height={260}>
      {(t) => {
        const F = 20, ppm = 40, x0 = 110;
        const s = ease(phase(t, 1, 4.6)) * 7;
        const x = x0 + s * ppm;
        const a = phase(t, 0.1, 0.8);
        return (
          <g>
            <Ground y={170} />
            <Line x1={x0 - 30} y1={120} x2={x0 - 30} y2={196} dashed />
            <Block x={x} y={150} w={60} h={40} label="m" />
            <Arrow x1={x - 34 - 66 * a} y1={150} x2={x - 34} y2={150} labelAt="mid" label="F" />
            <Line x1={x0 - 30} y1={200} x2={x - 30} y2={200} tone="bright" />
            <Label x={(x0 - 30 + x - 30) / 2} y={218}>s</Label>
            <Bar x={150} y={232} w={400} p={s / 7} label="work W" op={0.9} />
            <Readout y={20}>F = 20 N</Readout>
            <Readout y={40}>s = {f1(s)} m</Readout>
            <Readout y={60}>W = F · s = {f0(F * s)} J</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 2. angle

/** A sledge pulled by a rope at an angle: only the part of the pull along the motion does work. */
export function PullAngle({ F = 40, theta = 45, s = 10, numbers = false }: { F?: number; theta?: number; s?: number; numbers?: boolean }) {
  return (
    <Anim title="A sledge is pulled by a rope at an angle; only the part of the force along the ground does work" loop={7} height={270}>
      {(t) => {
        const ppm = 300 / s, x0 = 100, k = 2.2;
        const d = ease(phase(t, 2, 5.4)) * s;
        const x = x0 + d * ppm;
        const tail = { x: x + 28, y: 140 };
        const len = F * k;
        const a = phase(t, 0.2, 1.0);
        const c = Math.cos(theta * DEG), sn = Math.sin(theta * DEG);
        const comp = phase(t, 1.1, 1.9);
        const W = F * c * d;
        return (
          <g>
            <Ground y={170} />
            <Block x={x} y={150} w={56} h={36} label="m" />
            <Arrow x1={tail.x} y1={tail.y} x2={tail.x + len * c * a} y2={tail.y - len * sn * a} label="F" />
            {comp > 0.05 && (
              <g opacity={comp}>
                <Arrow x1={tail.x} y1={tail.y} x2={tail.x + len * c} y2={tail.y} dashed tone="soft" />
                <Arrow x1={tail.x + len * c} y1={tail.y} x2={tail.x + len * c} y2={tail.y - len * sn} dashed tone="faint" />
                <Label x={tail.x + len * c / 2 + 14} y={tail.y + 30}>{numbers ? 'F cos θ' : 'F · cos θ'}</Label>
                <Label x={tail.x + len * c + 30} y={tail.y - len * sn / 2 + 6}>F sin θ</Label>
                <path className="fig-guide" d={`M${tail.x + 34} ${tail.y}A34 34 0 0 0 ${tail.x + 34 * c} ${tail.y - 34 * sn}`} fill="none" />
                <Label x={tail.x + 50} y={tail.y - 8}>θ</Label>
              </g>
            )}
            <Bar x={150} y={216} w={350} p={clamp(W / (F * c * s))} label="work W" val={`${f0(W)} J`} />
            <Readout y={20}>{numbers ? `F = ${F} N, θ = ${theta}°` : 'W = F · s · cos θ'}</Readout>
            <Readout y={40}>s = {f1(d)} m</Readout>
            <Label x={320} y={254} kind="label">the vertical part F sin θ does no work: no motion that way</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 3. sign

/** The force direction sweeps round: the work goes positive, zero, then negative. */
export function SignSweep() {
  return (
    <Anim title="As the force turns from along the motion to against it, the work goes from positive through zero to negative" loop={12} height={250}>
      {(t) => {
        const th = (180 * (1 - Math.cos((2 * Math.PI * t) / 12))) / 2;
        const c = Math.cos(th * DEG), sn = Math.sin(th * DEG);
        const O = { x: 200, y: 110 }, L = 90;
        const state = c > 0.04 ? 'positive work' : c < -0.04 ? 'negative work' : 'zero work';
        return (
          <g>
            <Ball x={O.x} y={O.y} r={7} />
            <Arrow x1={O.x} y1={O.y} x2={O.x + L * c} y2={O.y - L * sn} label="F" />
            <Line x1={O.x} y1={O.y} x2={O.x + L * c} y2={O.y} tone="bright" />
            <Line x1={O.x + L * c} y1={O.y - L * sn} x2={O.x + L * c} y2={O.y} dashed />
            {th > 2 && <path className="fig-guide" d={`M${O.x + 28} ${O.y}A28 28 0 0 0 ${O.x + 28 * c} ${O.y - 28 * sn}`} fill="none" />}
            <Arrow x1={O.x - 80} y1={O.y + 70} x2={O.x + 80} y2={O.y + 70} label="s" />
            <Label x={O.x} y={O.y + 108} kind="label">displacement</Label>
            <SignedBar x={360} y={100} w={220} p={c} />
            <Label x={360} y={142} kind="val" anchor="start">−</Label>
            <Label x={580} y={142} kind="val" anchor="end">+</Label>
            <Label x={470} y={142} kind="label">W</Label>
            <Label x={470} y={76} kind="label">{state}</Label>
            <Readout y={20}>θ = {f0(th)}°</Readout>
            <Readout y={40}>cos θ = {f2(c)}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 4. variable force

/** A spring squeezed: the area under the F–x graph is the work. */
export function SpringArea() {
  return (
    <Anim title="A spring is squeezed; the force grows with the compression and the area under the force against compression graph fills up as the work" loop={7} height={320}>
      {(t) => {
        const k = 200, xmax = 0.2;
        const x = ease(phase(t, 0.8, 4.6)) * xmax;
        const F = k * x;
        const face = 200 - x * 500;
        const ox = 240, oy = 292, gw = 320, gh = 110;
        const px = ox + (x / xmax) * gw, py = oy - (F / (k * xmax)) * gh;
        return (
          <g>
            <Wall x={30} y1={36} y2={100} side={-1} />
            <Spring x1={30} y1={68} x2={face} y2={68} coils={9} width={11} />
            <Block x={face + 22} y={68} w={44} h={44} label="m" />
            <Arrow x1={face + 44 + 14 + 70 * (F / 40)} y1={68} x2={face + 48} y2={68} label="F" labelAt="mid" />
            <Axes x={ox} y={oy} w={gw + 30} h={gh + 30} xLabel="x" yLabel="F" />
            <Line x1={ox} y1={oy} x2={ox + gw} y2={oy - gh} dashed tone="faint" />
            <path className="fig-cell is-lit" d={`M${ox} ${oy}L${px} ${oy}L${px} ${py}Z`} />
            <Line x1={ox} y1={oy} x2={px} y2={py} tone="bright" />
            <Ball x={px} y={py} r={4.5} glow={false} />
            <Label x={ox + 200} y={oy - 14} anchor="start" kind="label">area = work</Label>
            <Readout y={20}>x = {f2(x)} m</Readout>
            <Readout y={40}>F = k · x = {f0(F)} N</Readout>
            <Readout y={60}>W = ½ k x² = {f1(0.5 * k * x * x)} J</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 5. kinetic energy

/** A steady force accelerates a block from rest; work done and kinetic energy stay equal. */
export function KineticWork() {
  return (
    <Anim title="A steady force speeds up a block from rest; the work done by the force always equals the kinetic energy gained" loop={6} height={270}>
      {(t) => {
        const F = 10, m = 2, ppm = 26;
        const tau = phase(t, 0.6, 3.6) * 2;
        const s = 0.5 * (F / m) * tau * tau;
        const v = (F / m) * tau;
        const x = 100 + s * ppm;
        const W = F * s, K = 0.5 * m * v * v;
        return (
          <g>
            <Ground y={150} />
            <Block x={x} y={130} w={56} h={40} label="m" />
            <Arrow x1={x - 100} y1={130} x2={x - 32} y2={130} labelAt="mid" label="F" />
            {v > 0.3 && <Arrow x1={x} y1={96} x2={x + v * 8} y2={96} label="v" />}
            <Bar x={170} y={196} w={330} p={W / 100} label="work W" val={`${f0(W)} J`} />
            <Bar x={170} y={224} w={330} p={K / 100} label="K = ½mv²" val={`${f0(K)} J`} op={0.6} />
            <Readout y={20}>v = {f1(v)} m/s</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 6. potential energy

/** A ball lifted at steady speed: the energy stored grows with the height. */
export function LiftBall() {
  return (
    <Anim title="A ball is lifted slowly; the gravitational potential energy stored grows in proportion to the height" loop={6} height={290}>
      {(t) => {
        const ppm = 90, hm = 2;
        const h = ease(phase(t, 0.8, 3.6)) * hm;
        const y = 248 - h * ppm;
        return (
          <g>
            <Ground y={262} />
            <Line x1={95} y1={262} x2={95} y2={y + 14} tone="soft" />
            <Line x1={88} y1={y + 14} x2={102} y2={y + 14} tone="soft" />
            <Label x={78} y={(262 + y + 14) / 2 + 5} anchor="end">h</Label>
            <Ball x={200} y={y} r={14} />
            <Arrow x1={200} y1={y - 18} x2={200} y2={y - 18 - 46} label="F = m g" />
            <Bar x={400} y={130} w={190} p={h / hm} label="U" op={0.9} />
            <Label x={495} y={168} kind="label">U = m · g · h</Label>
            <Readout y={20}>h = {f2(h)} m</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** A spring squeezed by hand, then released: stored energy turns into motion. */
export function SpringRelease({ numbers = false }: { numbers?: boolean }) {
  return (
    <Anim title="A spring is squeezed, which stores energy, then released: the stored energy turns into the block's kinetic energy" loop={5.4} height={230}>
      {(t) => {
        const A = 50;
        const wd = 3, tr = 2.5, t0 = Math.PI / (2 * wd);
        const sq = ease(phase(t, 0.4, 1.8));
        let comp = A * sq;
        let move = 0;
        let U = sq * sq, K = 0;
        if (t > tr) {
          const u = t - tr;
          if (u < t0) {
            comp = A * Math.cos(wd * u);
            U = Math.cos(wd * u) ** 2;
            K = Math.sin(wd * u) ** 2;
          } else {
            comp = 0;
            move = A * wd * (u - t0);
            U = 0;
            K = 1;
          }
        }
        const face = 200 - comp + move;
        const push = t < tr ? phase(t, 0.2, 0.5) * (1 - phase(t, 1.8, 2.2)) : 0;
        return (
          <g>
            <Wall x={30} y1={108} y2={176} side={-1} />
            <Ground y={176} x1={30} />
            <Spring x1={30} y1={154} x2={Math.min(face, 200 + 0)} y2={154} coils={9} width={11} />
            <Block x={face + 22} y={154} w={44} h={44} label="m" />
            {push > 0.1 && <Arrow x1={face + 44 + 14 + 60 * push} y1={154} x2={face + 48} y2={154} labelAt="mid" label="hand" />}
            <Bar x={350} y={20} w={230} p={U} label="spring U" val={numbers ? `${f1(U)} J` : undefined} />
            <Bar x={350} y={44} w={230} p={K} label="kinetic K" op={0.6} val={numbers ? `${f1(K)} J` : undefined} />
            {numbers && <Readout y={86}>v = {f1(2 * Math.sqrt(K))} m/s</Readout>}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 7. conservative forces

/** Two routes up to the same height: gravity's work is the same, friction's is not. */
export function Routes() {
  const A = { x: 60, y: 230 };
  const route1 = [A, { x: 320, y: 80 }];
  const route2 = [A, { x: 180, y: 230 }, { x: 180, y: 150 }, { x: 320, y: 150 }, { x: 320, y: 80 }];
  const len = (r: { x: number; y: number }[]) => r.slice(1).reduce((a, p, i) => a + Math.hypot(p.x - r[i].x, p.y - r[i].y), 0);
  const at = (r: { x: number; y: number }[], d: number) => {
    let left = d;
    for (let i = 1; i < r.length; i++) {
      const l = Math.hypot(r[i].x - r[i - 1].x, r[i].y - r[i - 1].y);
      if (left <= l) return { x: lerp(r[i - 1].x, r[i].x, left / l), y: lerp(r[i - 1].y, r[i].y, left / l) };
      left -= l;
    }
    return r[r.length - 1];
  };
  const L1 = len(route1), L2 = len(route2);
  return (
    <Anim title="Two balls take different routes to the same height; gravity does the same work on both, but friction does more work on the longer route" loop={8} height={270}>
      {(t) => {
        const d = Math.max(0, t - 0.6) * 80;
        const p1 = at(route1, Math.min(d, L1)), p2 = at(route2, Math.min(d, L2));
        const done = d > L2 + 4;
        return (
          <g>
            <Ground y={230} x1={30} x2={340} hatch={false} />
            <Trail points={route1.map((p) => [p.x, p.y])} tone="faint" dashed />
            <Trail points={route2.map((p) => [p.x, p.y])} tone="faint" dashed />
            <Line x1={320} y1={80} x2={350} y2={80} dashed />
            <Label x={68} y={252} anchor="start" kind="label">start</Label>
            <Label x={330} y={68} kind="label">finish</Label>
            <Ball x={p1.x} y={p1.y} r={6.5} />
            <Ball x={p2.x} y={p2.y} r={6.5} />
            <Label x={206} y={112} kind="label">route 1</Label>
            <Label x={250} y={178} kind="label">route 2</Label>
            <Bar x={480} y={70} w={120} p={(230 - p1.y) / 150} label="gravity, route 1" />
            <Bar x={480} y={94} w={120} p={(230 - p2.y) / 150} label="gravity, route 2" />
            <Bar x={480} y={140} w={120} p={Math.min(d, L1) / L2} label="friction, route 1" op={0.55} />
            <Bar x={480} y={164} w={120} p={Math.min(d, L2) / L2} label="friction, route 2" op={0.55} />
            {done && (
              <g>
                <Label x={540} y={122} kind="label">gravity: the same</Label>
                <Label x={540} y={206} kind="label">friction: depends on the path</Label>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 8. conservation

/** A pendulum: kinetic and potential energy trade places, the total stays put. */
export function PendulumEnergy() {
  return (
    <Anim title="A swinging pendulum: kinetic and potential energy trade places while the total stays the same" loop={8} height={250}>
      {(t) => {
        const L = 150, th0 = 55 * DEG, w = 2.3;
        const th = th0 * Math.cos(w * t);
        const P = { x: 190, y: 26 };
        const bx = P.x + L * Math.sin(th), by = P.y + L * Math.cos(th);
        const low = P.y + L;
        const pe = (1 - Math.cos(th)) / (1 - Math.cos(th0));
        const pts: [number, number][] = [];
        for (let i = -20; i <= 20; i++) pts.push([P.x + L * Math.sin((th0 * i) / 20), P.y + L * Math.cos((th0 * i) / 20)]);
        return (
          <g>
            <Line x1={P.x - 40} y1={P.y} x2={P.x + 40} y2={P.y} tone="bright" />
            <Trail points={pts} tone="faint" dashed />
            <Line x1={P.x} y1={P.y} x2={bx} y2={by} tone="soft" />
            <Line x1={P.x - 150} y1={low + 12} x2={P.x + 150} y2={low + 12} dashed />
            <Line x1={bx} y1={by + 8} x2={bx} y2={low + 12} tone="soft" />
            <Ball x={bx} y={by} r={9} />
            <Bar x={470} y={60} w={130} p={1 - pe} label="K" op={0.6} />
            <Bar x={470} y={86} w={130} p={pe} label="U" />
            <Bar x={470} y={126} w={130} p={1} label="K + U" op={0.3} />
          </g>
        );
      }}
    </Anim>
  );
}

const COASTER_H = (x: number) => {
  const u = (x - 50) / 500;
  return 85 + 75 * (1 - 0.4 * u) * Math.cos(2 * Math.PI * 1.25 * u);
};
const COASTER = (() => {
  const xs: number[] = [];
  let x = 50;
  const H = COASTER_H(50) + 2;
  for (let i = 0; i < 1500; i++) {
    xs.push(x);
    const h = COASTER_H(x);
    const slope = (COASTER_H(x + 1) - COASTER_H(x - 1)) / 2;
    const v = Math.max(Math.sqrt(Math.max(2 * 300 * (H - h), 0)), 20);
    x = Math.min(550, x + ((v / Math.sqrt(1 + slope * slope)) * 0.005));
  }
  return xs;
})();

/** A roller coaster track: height and speed trade, the total energy is steady. */
export function CoasterEnergy() {
  return (
    <Anim title="A car rolls along a frictionless track: it speeds up in the dips and slows on the rises, and kinetic plus potential energy stays constant" loop={7} height={290}>
      {(t) => {
        const i = Math.min(COASTER.length - 1, Math.floor(Math.max(0, t - 0.4) / 0.005));
        const x = COASTER[i];
        const Ht = COASTER_H(50) + 2;
        const pts: [number, number][] = [];
        for (let px = 50; px <= 550; px += 5) pts.push([px, 270 - 0.8 * COASTER_H(px)]);
        const h = COASTER_H(x);
        const pe = h / Ht;
        return (
          <g>
            <Trail points={pts} tone="soft" />
            <Ball x={x} y={270 - 0.8 * h - 9} r={8} />
            <Bar x={90} y={16} w={220} p={1 - pe} label="K" op={0.6} />
            <Bar x={90} y={40} w={220} p={pe} label="U" />
            <Bar x={90} y={72} w={220} p={1} label="K + U" op={0.3} />
          </g>
        );
      }}
    </Anim>
  );
}

/** A ball thrown straight up: kinetic energy becomes potential and back again. */
export function BallUp() {
  return (
    <Anim title="A ball thrown straight up: its kinetic energy turns into potential energy on the way up and back again on the way down" loop={3.4} height={290}>
      {(t) => {
        const v0 = 8, ppm = 70;
        const tau = clamp((t - 0.3) * 0.8, 0, (2 * v0) / G);
        const h = v0 * tau - 0.5 * G * tau * tau;
        const v = v0 - G * tau;
        const y = 258 - h * ppm;
        const Hm = (v0 * v0) / (2 * G);
        return (
          <g>
            <Ground y={270} x1={60} x2={260} />
            <Line x1={60} y1={258 - Hm * ppm} x2={260} y2={258 - Hm * ppm} dashed />
            <Label x={250} y={258 - Hm * ppm - 8} anchor="end" kind="label">highest point</Label>
            <Ball x={160} y={y} r={9} />
            <Arrow x1={160} y1={y} x2={160} y2={y - v * 7} label="v" />
            <Bar x={420} y={90} w={170} p={1 - h / Hm} label="K" op={0.6} />
            <Bar x={420} y={116} w={170} p={h / Hm} label="U" />
            <Bar x={420} y={156} w={170} p={1} label="K + U" op={0.3} />
            <Readout y={20}>h = {f1(h)} m</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 9. friction

/** A block slides to a stop: its kinetic energy becomes heat, the total never changes. */
export function FrictionDrain({ compact = false }: { compact?: boolean }) {
  return (
    <Anim title="A block slides to a stop on a rough floor: its kinetic energy drains away into heat, and the total energy stays the same" loop={5} height={compact ? 190 : 290}>
      {(t) => {
        const v0 = 6, mu = 0.3, ppm = 50;
        const tau = clamp((t - 0.5) * 0.8, 0, v0 / (mu * G));
        const v = v0 - mu * G * tau;
        const s = v0 * tau - 0.5 * mu * G * tau * tau;
        const x = 100 + s * ppm;
        const gy = compact ? 70 : 150;
        const by = compact ? 100 : 198;
        const K = (v * v) / (v0 * v0);
        return (
          <g>
            <Ground y={gy} />
            <Line x1={70} y1={gy} x2={x} y2={gy} tone="bright" />
            <Block x={x} y={gy - 20} w={56} h={40} label="m" />
            {v > 0.2 && <Arrow x1={x - 30} y1={gy - 6} x2={x - 76} y2={gy - 6} label="f" labelAt="mid" />}
            <Bar x={170} y={by} w={330} p={K} label="kinetic K" op={0.6} />
            <Bar x={170} y={by + 24} w={330} p={1 - K} label="heat" op={0.9} />
            <Bar x={170} y={by + 48} w={330} p={1} label="total" op={0.3} />
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 10. power

/** A motor lifts a load at steady speed: power is force times speed. */
export function LiftMotor() {
  return (
    <Anim title="A motor lifts a load at a steady speed: the power is the force times the speed, and the work done adds up with time" loop={6} height={290}>
      {(t) => {
        const m = 100, v = 0.5, ppm = 80;
        const tau = phase(t, 0.6, 3.6) * 3;
        const y = 228 - v * tau * ppm;
        const W = m * G * v * tau;
        return (
          <g>
            <Ground y={250} x1={30} x2={230} />
            <Block x={130} y={44} w={86} h={36} label="motor" filled />
            <Line x1={130} y1={62} x2={130} y2={y - 19} tone="bright" />
            <Block x={130} y={y} w={56} h={38} label="m" />
            <Arrow x1={190} y1={y} x2={190} y2={y - 34} label="v" />
            <Label x={300} y={96} anchor="start" kind="val">F = m g = 980 N</Label>
            <Label x={300} y={124} anchor="start" kind="val">v = 0.50 m/s</Label>
            <Label x={300} y={152} anchor="start" kind="val">P = F · v = 490 W</Label>
            <Bar x={340} y={196} w={250} p={W / 1470} label="work W" val={`${f0(W)} J`} />
            <Readout y={20}>t = {f1(tau)} s</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Efficiency: the input is split into useful output and waste. */
export function Efficiency() {
  return (
    <Anim title="Efficiency: of the power a motor takes in, 80 percent comes out as useful lifting power and 20 percent is lost as heat" loop={5} height={170}>
      {(t) => {
        const a = ease(phase(t, 0.4, 1.4));
        const b = ease(phase(t, 1.2, 2.4));
        const c = ease(phase(t, 1.8, 2.8));
        return (
          <g>
            <Bar x={150} y={28} w={380} p={a} label="power in" val={a > 0.99 ? '4900 W' : undefined} />
            <Bar x={150} y={64} w={380} p={0.8 * b} label="useful out" op={0.9} val={b > 0.99 ? '3920 W' : undefined} />
            <Bar x={150} y={100} w={380} p={0.2 * c} label="lost as heat" op={0.45} val={c > 0.99 ? '980 W' : undefined} />
            <Label x={340} y={146} kind="label">efficiency η = 3920 ÷ 4900 = 0.80</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 11. landscapes

const U = (x: number) => x ** 4 / 4 - x * x / 2;
const LAND = (() => {
  const xs: number[] = [];
  let x = 0.25, v = 0;
  for (let i = 0; i < 1900; i++) {
    xs.push(x);
    const a = -(x ** 3 - x) - 0.35 * v;
    v += a * 0.005;
    x += v * 0.005;
  }
  return xs;
})();

/** A ball in a double-well landscape settles in a valley; the force is minus the slope. */
export function Landscape() {
  const X = (x: number) => 320 + x * 170;
  const Y = (u: number) => 180 - u * 250;
  return (
    <Anim title="A ball rolls in a landscape of potential energy: the force is always downhill, and with friction it settles at the bottom of a valley" loop={9} height={290}>
      {(t) => {
        const x = LAND[Math.min(LAND.length - 1, Math.floor(Math.max(0, t - 0.4) / 0.005))];
        const F = x - x ** 3;
        const pts: [number, number][] = [];
        for (let i = -80; i <= 80; i++) pts.push([X(i / 50), Y(U(i / 50))]);
        const bx = X(x), by = Y(U(x)) - 9;
        return (
          <g>
            <Axes x={40} y={268} w={560} h={190} xLabel="x" yLabel="U" />
            <Trail points={pts} tone="bright" />
            <Ball x={bx} y={by} r={8} />
            <Arrow x1={bx} y1={by - 26} x2={bx + F * 110} y2={by - 26} />
            <Label x={X(-1)} y={Y(-0.25) + 30} kind="label">stable</Label>
            <Label x={X(1)} y={Y(-0.25) + 30} kind="label">stable</Label>
            <Label x={X(0)} y={Y(0) - 18} kind="label">unstable</Label>
            <Readout y={20}>F = −dU/dx = {f2(F)}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Three kinds of equilibrium: nudge a ball and watch. */
export function Equilibria() {
  const cx = [110, 320, 530];
  const prof = [(d: number) => 190 - 60 * (d / 80) ** 2, (d: number) => 130 + 60 * (d / 80) ** 2, () => 160];
  return (
    <Anim title="Nudge a ball in a valley, on a hilltop and on a flat table: it comes back, rolls away, or stays where it is" loop={9} height={250}>
      {(t) => {
        const nudge = ease(phase(t, 0.4, 1.2));
        const tau = Math.max(0, t - 1.6);
        const d = [
          40 * nudge * Math.cos(2.4 * tau) * Math.exp(-0.3 * tau),
          Math.min(80, 40 * nudge * Math.cosh(1.1 * tau)),
          40 * nudge,
        ];
        const slope = [-120 * (d[0] / 6400), 120 * (d[1] / 6400), 0];
        const names = ['stable', 'unstable', 'neutral'];
        return (
          <g>
            {cx.map((c, i) => {
              const pts: [number, number][] = [];
              for (let k = -80; k <= 80; k += 4) pts.push([c + k, prof[i](k)]);
              const by = prof[i](d[i]) - 9;
              return (
                <g key={i}>
                  <Trail points={pts} tone="bright" />
                  <Ball x={c + d[i]} y={by} r={8} />
                  {Math.abs(slope[i]) > 0.02 && <Arrow x1={c + d[i]} y1={by - 24} x2={c + d[i] + slope[i] * 70} y2={by - 24} />}
                  <Label x={c} y={226} kind="label">{names[i]}</Label>
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ worked examples

/** A block slides down a smooth slope from 5 m up, then runs on along the floor. */
export function SlideBottom() {
  return (
    <Anim title="A block slides down a frictionless slope from a height of 5 metres, trading potential energy for kinetic energy, and reaches the bottom at 9.90 metres per second" loop={4.2} height={280}>
      {(t) => {
        const ppm = 26, ang = 40, gy = 236, ix = 330;
        const base = (5 / Math.tan(ang * DEG)) * ppm;
        const Lpx = (5 / Math.sin(ang * DEG)) * ppm;
        const a = G * Math.sin(ang * DEG);
        const tau = Math.max(0, t - 0.5) * 0.7;
        const tEnd = Math.sqrt((2 * (5 / Math.sin(ang * DEG))) / a);
        const onSlope = tau < tEnd;
        let h = 5, v = 0, bx: number, by: number, bang = 0;
        if (onSlope) {
          const sM = 0.5 * a * tau * tau;
          const p = slopePoint(ix, gy, ang, Lpx - sM * ppm, 16);
          bx = p.x; by = p.y; bang = ang;
          h = 5 - sM * Math.sin(ang * DEG);
          v = a * tau;
        } else {
          v = Math.sqrt(2 * G * 5);
          bx = Math.max(60, ix - (tau - tEnd) * v * ppm);
          by = gy - 16; h = 0;
        }
        return (
          <g>
            <Ground y={gy} />
            <Incline x={ix} y={gy} base={base} angle={ang} mark={false} />
            <Line x1={ix + base + 20} y1={gy} x2={ix + base + 20} y2={gy - 130} tone="soft" />
            <Label x={ix + base + 28} y={gy - 60} anchor="start">h = 5 m</Label>
            <Block x={bx} y={by} w={34} h={26} angle={bang} />
            <Bar x={120} y={16} w={220} p={h / 5} label="U" />
            <Bar x={120} y={40} w={220} p={1 - h / 5} label="K" op={0.6} />
            <Readout y={20}>v = {f2(v)} m/s</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Two cars brake with the same friction; doubling the speed quadruples the distance. */
export function BrakingCars() {
  return (
    <Anim title="Two cars brake with the same friction force: one starts at 20 metres per second and stops in 29.2 metres; the other starts at 40 and needs four times as far" loop={8.4} height={230}>
      {(t) => {
        const mug = 0.7 * G, ppm = 4.6, x0 = 50;
        const tau = Math.max(0, t - 0.6);
        const car = (v0: number, y: number, name: string) => {
          const ts = v0 / mug;
          const q = Math.min(tau, ts);
          const s = v0 * q - 0.5 * mug * q * q;
          const total = (v0 * v0) / (2 * mug);
          return (
            <g>
              <Ground y={y + 20} hatch={false} />
              <Label x={x0 - 10} y={y - 24} anchor="start" kind="label">{name}</Label>
              <Line x1={x0} y1={y - 12} x2={x0} y2={y + 20} dashed />
              <Block x={x0 + 26 + s * ppm} y={y} w={52} h={26} />
              {tau >= ts && (
                <g>
                  <Line x1={x0 + 52 + total * ppm} y1={y - 14} x2={x0 + 52 + total * ppm} y2={y + 20} tone="bright" />
                  <Label x={x0 + 46 + total * ppm} y={y - 24} anchor="end" kind="val">d = {total.toFixed(total < 50 ? 1 : 0)} m</Label>
                </g>
              )}
            </g>
          );
        };
        return (
          <g>
            {car(20, 80, '20 m/s')}
            {car(40, 170, '40 m/s')}
          </g>
        );
      }}
    </Anim>
  );
}

/** Climbing the stairs: the power is the work divided by the time. */
export function StairsPower() {
  return (
    <Anim title="A person climbs 3 metres of stairs in 4 seconds: the work against gravity is 1764 joules, so the average power is 441 watts" loop={6.5} height={260}>
      {(t) => {
        const p = phase(t, 0.6, 4.6);
        const tau = p * 4;
        const i = Math.min(9, Math.floor(p * 10));
        const x = 70 + p * 300;
        const stepTop = 230 - 15 * (i + 1);
        const W = 60 * G * 3 * p;
        const pts: [number, number][] = [[70, 230]];
        for (let k = 0; k < 10; k++) {
          pts.push([70 + 30 * k, 230 - 15 * (k + 1)]);
          pts.push([70 + 30 * (k + 1), 230 - 15 * (k + 1)]);
        }
        return (
          <g>
            <Ground y={230} x1={30} x2={400} hatch={false} />
            <Trail points={pts} tone="bright" />
            <Line x1={376} y1={230} x2={376} y2={80} tone="soft" />
            <Label x={384} y={160} anchor="start">3 m</Label>
            <Ball x={x} y={stepTop - 10} r={9} />
            <Label x={470} y={74} anchor="start" kind="val">t = {f1(tau)} s</Label>
            <Label x={470} y={102} anchor="start" kind="val">W = m g h = {f0(W)} J</Label>
            <Label x={470} y={130} anchor="start" kind="val">P = W / t = {tau > 0.2 ? f0(W / tau) : '…'} W</Label>
            <Bar x={470} y={160} w={130} p={p} label="" />
          </g>
        );
      }}
    </Anim>
  );
}

/** A loop-the-loop: the car must start at least 2.5 radii up to stay on the track. */
const LR = 44, LH = 110, GY = 262, RX0 = 50, RX1 = 215, CX = 300;
const L1 = Math.hypot(RX1 - RX0, LH), L2 = CX - RX1, L3 = 2 * Math.PI * LR, L4 = 150;
function loopPos(s: number) {
  if (s < L1) {
    const f = s / L1;
    return { x: lerp(RX0, RX1, f), y: GY - LH * (1 - f), h: LH * (1 - f), phi: -1 };
  }
  s -= L1;
  if (s < L2) return { x: RX1 + s, y: GY, h: 0, phi: -1 };
  s -= L2;
  if (s < L3) {
    const p = s / LR;
    return { x: CX + LR * Math.sin(p), y: GY - LR * (1 - Math.cos(p)), h: LR * (1 - Math.cos(p)), phi: p };
  }
  s -= L3;
  return { x: CX + Math.min(s, L4), y: GY, h: 0, phi: -1 };
}
const LOOP_S = (() => {
  const a: number[] = [];
  let s = 0;
  for (let i = 0; i < 1400; i++) {
    a.push(s);
    const v = Math.sqrt(Math.max(2 * 300 * (LH - loopPos(s).h), 0));
    s += Math.max(v, 14) * 0.005;
  }
  return a;
})();

export function LoopTheLoop() {
  const loopPts: [number, number][] = [];
  for (let k = 0; k <= 60; k++) loopPts.push([CX + LR * Math.sin((2 * Math.PI * k) / 60), GY - LR * (1 - Math.cos((2 * Math.PI * k) / 60))]);
  return (
    <Anim title="A car released from 2.5 radii up just makes it round the top of a loop, where the track pushes on it with no force at all" loop={6.5} height={290}>
      {(t) => {
        const s = LOOP_S[Math.min(LOOP_S.length - 1, Math.floor(Math.max(0, t - 0.5) / 0.005))];
        const p = loopPos(s);
        const top = p.phi > Math.PI - 0.6 && p.phi < Math.PI + 0.6;
        return (
          <g>
            <Ground y={GY} x1={30} x2={W_} hatch={false} />
            <Trail points={[[RX0, GY - LH], [RX1, GY]]} tone="bright" />
            <Trail points={loopPts} tone="bright" />
            <Line x1={24} y1={GY - LH} x2={24} y2={GY} tone="soft" />
            <Label x={32} y={214} anchor="start">2.5 r</Label>
            <Line x1={24} y1={GY - LH} x2={RX0} y2={GY - LH} dashed />
            <Ball x={p.x} y={p.y - 9} r={8} />
            {top && <Label x={CX} y={GY - 2 * LR - 22} kind="label">top: v² = g r, track force N = 0</Label>}
            <Bar x={480} y={16} w={120} p={(LH - p.h) / LH} label="K" op={0.6} />
            <Bar x={480} y={40} w={120} p={p.h / LH} label="U" />
          </g>
        );
      }}
    </Anim>
  );
}
const W_ = 630;

// ------------------------------------------------------------------ common mistakes

/** Carrying a bag along level ground: the lifting force is at right angles to the motion. */
export function CarryBag() {
  return (
    <Anim title="A bag carried along level ground: the force holding it up is at right angles to the motion, so it does no work" loop={5} height={170}>
      {(t) => {
        const x = 90 + ease(phase(t, 0.5, 4)) * 380;
        return (
          <g>
            <Ground y={140} />
            <Block x={x} y={110} w={50} h={36} label="bag" />
            <Arrow x1={x} y1={90} x2={x} y2={40} label="F" />
            <Arrow x1={x + 36} y1={110} x2={x + 90} y2={110} label="s" labelAt="mid" />
            <Label x={x} y={162} kind="label">W = 0</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Kinetic energy goes as the square of the speed. */
export function SpeedSquared() {
  return (
    <Anim title="Twice the speed gives four times the kinetic energy" loop={5} height={170}>
      {(t) => {
        const q = Math.max(0, t - 0.4);
        const e = ease(phase(t, 1.5, 3));
        return (
          <g>
            <Block x={70 + Math.min(q, 3.2) * 50} y={24} w={40} h={26} label="v" />
            <Block x={70 + Math.min(q, 3.2) * 100} y={66} w={40} h={26} label="2v" />
            <Bar x={110} y={110} w={440} p={0.25 * e} label="K at v" op={0.6} />
            <Bar x={110} y={136} w={440} p={1 * e} label="K at 2v" op={0.9} />
          </g>
        );
      }}
    </Anim>
  );
}

/** Rising ball: gravity does negative work, then positive on the way down. */
export function GravitySign() {
  return (
    <Anim title="A ball thrown up: gravity does negative work on the way up and the same amount of positive work coming down" loop={4} height={170}>
      {(t) => {
        const H = 100;
        const q = clamp((t - 0.4) / 3.2);
        const h = H * 4 * q * (1 - q) * (q < 1 ? 1 : 0);
        const wg = -h / H;
        const rising = q < 0.5;
        return (
          <g>
            <Ground y={150} x1={40} x2={200} />
            <Ball x={120} y={140 - h} r={8} />
            <SignedBar x={320} y={40} w={240} p={wg} />
            <Label x={320} y={82} anchor="start" kind="val">−</Label>
            <Label x={560} y={82} anchor="end" kind="val">+</Label>
            <Label x={440} y={82} kind="label">work by gravity</Label>
            <Label x={440} y={122} kind="label">{q <= 0 || q >= 1 ? 'total 0' : rising ? 'up: negative' : 'down: positive'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Same work, different time: power differs. */
export function PowerNotEnergy() {
  return (
    <Anim title="Two loads are lifted to the same height, one quickly and one slowly: the work done is the same but the power is different" loop={6} height={170}>
      {(t) => {
        const pa = phase(t, 0.5, 2), pb = phase(t, 0.5, 4);
        const run = (p: number) => ease(p);
        return (
          <g>
            <Ground y={150} x1={40} x2={240} />
            <Block x={90} y={130 - 100 * run(pa)} w={40} h={36} label="A" />
            <Block x={190} y={130 - 100 * run(pb)} w={40} h={36} label="B" />
            <Bar x={420} y={22} w={170} p={run(pa)} label="work A" op={0.9} />
            <Bar x={420} y={44} w={170} p={run(pb)} label="work B" op={0.9} />
            <Bar x={420} y={86} w={170} p={pa > 0 && pa < 1 ? 1 : 0} label="power A" op={0.5} />
            <Bar x={420} y={108} w={170} p={pb > 0 && pb < 1 ? 0.5 : 0} label="power B" op={0.5} />
          </g>
        );
      }}
    </Anim>
  );
}

/** Using the wrong trig function for the angle between force and motion. */
export function CosNotSin() {
  return (
    <Anim title="A rope pulls a sledge at 30 degrees above the ground: the part along the ground is F cos 30, the larger part, not F sin 30" loop={5} height={170}>
      {(t) => {
        const x = 90 + ease(phase(t, 0.8, 3.8)) * 220;
        const c = Math.cos(30 * DEG), sn = Math.sin(30 * DEG), L = 120;
        const tx = x + 26, ty = 112;
        const a = phase(t, 0, 0.6);
        return (
          <g>
            <Ground y={140} />
            <Block x={x} y={122} w={52} h={32} />
            <Arrow x1={tx} y1={ty} x2={tx + L * c * a} y2={ty - L * sn * a} label="F" />
            <Arrow x1={tx} y1={ty} x2={tx + L * c} y2={ty} dashed tone="soft" />
            <Line x1={tx + L * c} y1={ty} x2={tx + L * c} y2={ty - L * sn} dashed tone="faint" />
            <path className="fig-guide" d={`M${tx + 36} ${ty}A36 36 0 0 0 ${tx + 36 * c} ${ty - 36 * sn}`} fill="none" />
            <Label x={tx + 52} y={ty - 6}>30°</Label>
            <Label x={tx + L * c / 2} y={ty + 18} kind="label">F cos 30°</Label>
          </g>
        );
      }}
    </Anim>
  );
}
