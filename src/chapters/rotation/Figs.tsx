import type { ReactNode } from 'react';
import { Anim, Arrow, Ball, Block, DEG, Label, Line, Readout, Trail, Axes, Ground, Incline, Wall, clamp, ease, lerp, phase, slopePoint } from '../kit/Anim';

/** Animated diagrams for the rotation chapter. Angles are in radians unless a name ends in Deg. */

const G = 9.8;
const f1 = (x: number) => x.toFixed(1);
const f2 = (x: number) => x.toFixed(2);

/** A wheel (disc or ring) with a spoke and a marker dot; ang is anticlockwise, in radians. */
function Wheel({ x, y, r, ang, ring, spokes = 2 }: { x: number; y: number; r: number; ang: number; ring?: boolean; spokes?: number }) {
  const pts = [];
  for (let i = 0; i < spokes; i++) {
    const a = ang + (i * 2 * Math.PI) / spokes;
    pts.push(<line key={i} className="fig-guide" x1={x} y1={y} x2={x + r * Math.cos(a)} y2={y - r * Math.sin(a)} />);
  }
  return (
    <g>
      <circle className={ring ? 'fig-path' : 'kit-block'} cx={x} cy={y} r={r} fill={ring ? 'none' : undefined} />
      {pts}
      <Ball x={x + r * 0.8 * Math.cos(ang)} y={y - r * 0.8 * Math.sin(ang)} r={3} glow={false} />
      <circle className="fig-ball" cx={x} cy={y} r={2.5} />
    </g>
  );
}

/** A tiny bar gauge: label, value and a bar scaled to max. */
function Bar({ x, y, w, v, max, label, soft }: { x: number; y: number; w: number; v: number; max: number; label: ReactNode; soft?: boolean }) {
  return (
    <g>
      <rect className="kit-block" x={x} y={y} width={w} height={12} rx={2} fill="none" />
      <rect x={x} y={y} width={Math.max(0, w * clamp(v / max))} height={12} rx={2} fill="#fff" fillOpacity={soft ? 0.4 : 0.9} />
      <Label x={x} y={y - 6} kind="label" anchor="start">
        {label}
      </Label>
    </g>
  );
}

// ------------------------------------------------------------------ 1. translation vs rotation

export function TransVsRot() {
  return (
    <Anim title="A bar that slides: every point moves the same way. A bar that spins: points farther out move faster" height={210} loop={6}>
      {(t) => {
        const x = 150 + 60 * Math.sin(t * 1.05);
        const vx = 60 * Math.cos(t * 1.05) * 0.8;
        const phi = t * 1.0;
        const cx = 470;
        const cy = 100;
        return (
          <g>
            <Label x={160} y={24} kind="label">
              Translation
            </Label>
            <Label x={470} y={24} kind="label">
              Rotation
            </Label>
            <Line x1={320} y1={30} x2={320} y2={190} tone="faint" dashed />
            <Block x={x} y={110} w={150} h={14} />
            {[-55, 0, 55].map((s) => (
              <Arrow key={s} x1={x + s} y1={110} x2={x + s + vx} y2={110} />
            ))}
            <Label x={160} y={178} kind="label">
              every point: the same velocity
            </Label>
            <Block x={cx} y={cy} w={160} h={14} angle={(phi * 180) / Math.PI} />
            {[-70, -35, 35, 70].map((s) => {
              const px = cx + s * Math.cos(phi);
              const py = cy - s * Math.sin(phi);
              return <Arrow key={s} x1={px} y1={py} x2={px - 0.55 * s * Math.sin(phi)} y2={py - 0.55 * s * Math.cos(phi)} />;
            })}
            <Ball x={cx} y={cy} r={4} glow={false} />
            <Label x={470} y={178} kind="label">
              v = ω · r: faster farther out
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 2. the door

interface DoorCase {
  d: number;
  deg: number;
}

/** A door seen from above, pushed with 20 N at distance d (m) from the hinge at angle deg to the door. */
export function DoorFig({ cases, height = 250, F = 20, loop, caption }: { cases: DoorCase[]; height?: number; F?: number; loop?: number; caption?: boolean }) {
  const per = 1.6;
  const hx = 80;
  const hy = height * 0.55;
  const pxm = 470;
  return (
    <Anim title="A door pushed at different points and angles, with the turning effect worked out" height={height} loop={loop ?? per * cases.length + 0.8}>
      {(t) => {
        const k = Math.min(cases.length - 1, Math.floor(t / per));
        const c = cases[k];
        const p = phase(t - k * per, 0.1, per - 0.1);
        const tau = F * c.d * Math.sin(c.deg * DEG);
        const swing = tau * 1.6 * ease(p);
        const u = { x: Math.cos(c.deg * DEG), y: -Math.sin(c.deg * DEG) };
        const P = { x: hx + c.d * pxm, y: hy };
        const len = 36 + 2.4 * F;
        const s = (hx - P.x) * u.x + (hy - P.y) * u.y;
        const foot = { x: P.x + u.x * s, y: P.y + u.y * s };
        const showF = phase(t - k * per, 0, 0.25);
        return (
          <g>
            <g transform={`rotate(${-swing} ${hx} ${hy})`}>
              <rect className="kit-block" x={hx} y={hy - 7} width={pxm} height={14} rx={2} />
              <Line x1={P.x - u.x * 120} y1={P.y - u.y * 120} x2={P.x + u.x * 90} y2={P.y + u.y * 90} tone="faint" dashed />
              {c.deg % 180 !== 0 && <Line x1={hx} y1={hy} x2={foot.x} y2={foot.y} dashed />}
              {showF > 0 && <Arrow x1={P.x - u.x * len * showF} y1={P.y - u.y * len * showF} x2={P.x} y2={P.y} />}
              <Ball x={P.x} y={P.y} r={4} />
            </g>
            <Ball x={hx} y={hy} r={5} glow={false} />
            <Label x={hx} y={hy + 28} kind="label">
              hinge
            </Label>
            <Label x={(hx + P.x) / 2} y={hy + 48} kind="label">
              r = {f1(c.d)} m
            </Label>
            <Line x1={hx} y1={hy + 18} x2={P.x} y2={hy + 18} tone="faint" />
            <Label x={14} y={24} kind="val" anchor="start">
              F = {F} N, θ = {c.deg}°
            </Label>
            <Label x={14} y={46} kind="val" anchor="start">
              τ = F · r · sin θ = {f1(tau)} N·m
            </Label>
            {caption && (
              <Label x={620} y={height - 12} kind="label" anchor="end">
                the force, the lever arm (dashed) and the turn
              </Label>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 3. cross product: sweep the angle

export function CrossFig() {
  return (
    <Anim title="A force of fixed size turned through a full circle: the torque is a sine wave, positive anticlockwise and negative clockwise" height={270} loop={8}>
      {(t) => {
        const th = 2 * Math.PI * phase(t, 0.4, 7.6);
        const ox = 130;
        const oy = 135;
        const rr = 110;
        const P = { x: ox + rr, y: oy };
        const L = 70;
        const ux = Math.cos(th);
        const uy = -Math.sin(th);
        const s = (ox - P.x) * ux + (oy - P.y) * uy;
        const foot = { x: P.x + ux * s, y: P.y + uy * s };
        const tau = 5 * Math.sin(th);
        return (
          <g>
            <Line x1={P.x - ux * 100} y1={P.y - uy * 100} x2={P.x + ux * 130} y2={P.y + uy * 130} tone="faint" dashed />
            <Line x1={ox} y1={oy} x2={foot.x} y2={foot.y} dashed />
            <Arrow x1={ox} y1={oy} x2={P.x - 4} y2={P.y} tone="soft" label="r" labelAt="mid" />
            <Arrow x1={P.x} y1={P.y} x2={P.x + ux * L} y2={P.y + uy * L} label="F" />
            <Ball x={ox} y={oy} r={4} glow={false} />
            <path className="fig-guide" d={`M${P.x + 28} ${P.y} A28 28 0 ${th > Math.PI ? 1 : 0} 0 ${P.x + 28 * ux} ${P.y + 28 * uy}`} fill="none" />
            <Label x={14} y={24} kind="val" anchor="start">
              θ = {Math.round((th / DEG) % 360)}°
            </Label>
            <Label x={14} y={46} kind="val" anchor="start">
              τ = r × F = {tau >= 0 ? '+' : '−'}
              {f2(Math.abs(tau))} N·m
            </Label>
            <Label x={ox} y={250} kind="label">
              {Math.abs(tau) < 0.05 ? 'no turning' : tau > 0 ? 'turns anticlockwise (τ out of the page)' : 'turns clockwise (τ into the page)'}
            </Label>
            <Axes x={400} y={150} w={210} h={70} below={70} xLabel="θ" yLabel="τ" />
            <Trail points={Array.from({ length: 61 }, (_, i) => [400 + (210 * i) / 60, 150 - 60 * Math.sin((2 * Math.PI * i) / 60)] as [number, number])} tone="soft" />
            <Ball x={400 + (210 * th) / (2 * Math.PI)} y={150 - 60 * Math.sin(th)} r={4} />
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 4. seesaw

export function Seesaw() {
  return (
    <Anim title="A seesaw: a lighter child slides outward along the plank until the two torques are equal and the plank levels" height={270} loop={6}>
      {(t) => {
        const m1 = 30;
        const d1 = 1.5;
        const m2 = 20;
        const d2 = lerp(1, 2.25, ease(phase(t, 0.8, 3.4)));
        const diff = m1 * d1 - m2 * d2;
        const a = clamp(diff * 0.35, -11, 11) * DEG;
        const px = 320;
        const py = 205;
        const sc = 100;
        const at = (s: number, lift: number) => ({ x: px + s * Math.cos(a) - lift * Math.sin(a), y: py - s * Math.sin(a) - lift * Math.cos(a) });
        const e1 = at(-2.4 * sc, 0);
        const e2 = at(2.4 * sc, 0);
        const b1 = at(-d1 * sc, 17);
        const b2 = at(d2 * sc, 14);
        const tl = m1 * G * d1;
        const tr = m2 * G * d2;
        return (
          <g>
            <Ground y={252} />
            <path className="fig-cliff" d={`M${px - 22} 252L${px} ${py + 4}L${px + 22} 252Z`} />
            <line className="fig-path" x1={e1.x} y1={e1.y} x2={e2.x} y2={e2.y} strokeWidth={5} />
            <Block x={b1.x} y={b1.y} w={44} h={30} angle={(a * 180) / Math.PI} label="30 kg" />
            <Block x={b2.x} y={b2.y} w={36} h={26} angle={(a * 180) / Math.PI} label="20 kg" />
            <Arrow x1={b1.x} y1={b1.y - 60} x2={b1.x} y2={b1.y - 24} dashed />
            <Arrow x1={b2.x} y1={b2.y - 60} x2={b2.x} y2={b2.y - 22} dashed />
            <Label x={14} y={24} kind="val" anchor="start">
              left: 30 · 9.8 · 1.5 = {Math.round(tl)} N·m
            </Label>
            <Label x={14} y={46} kind="val" anchor="start">
              right: 20 · 9.8 · {f2(d2)} = {Math.round(tr)} N·m
            </Label>
            <Label x={626} y={24} kind="label" anchor="end">
              {Math.abs(diff) < 0.5 ? 'balanced' : diff > 0 ? 'left side wins' : 'right side wins'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 5. moment of inertia

export function InertiaSlide() {
  return (
    <Anim title="Two equal masses on a rod spin at the same rate; as they slide outward their moment of inertia grows" height={240} loop={6}>
      {(t) => {
        const rm = t < 3.4 ? lerp(0.4, 1.3, ease(phase(t, 0.4, 2.8))) : lerp(1.3, 0.4, ease(phase(t, 3.4, 5.4)));
        const w = 1.5;
        const ph = w * t;
        const cx = 200;
        const cy = 120;
        const I = 2 * rm * rm;
        const pos = (s: number) => ({ x: cx + s * 100 * rm * Math.cos(ph), y: cy - s * 100 * rm * Math.sin(ph) });
        const A = pos(1);
        const B = pos(-1);
        return (
          <g>
            <line className="fig-path" x1={cx - 140 * Math.cos(ph)} y1={cy + 140 * Math.sin(ph)} x2={cx + 140 * Math.cos(ph)} y2={cy - 140 * Math.sin(ph)} />
            <Ball x={A.x} y={A.y} r={9} />
            <Ball x={B.x} y={B.y} r={9} />
            <Arrow x1={A.x} y1={A.y} x2={A.x - 0.3 * 100 * rm * Math.sin(ph) * w} y2={A.y - 0.3 * 100 * rm * Math.cos(ph) * w} />
            <Arrow x1={B.x} y1={B.y} x2={B.x + 0.3 * 100 * rm * Math.sin(ph) * w} y2={B.y + 0.3 * 100 * rm * Math.cos(ph) * w} />
            <circle className="fig-ball" cx={cx} cy={cy} r={3} />
            <Label x={420} y={60} kind="val" anchor="start">
              r = {f2(rm)} m
            </Label>
            <Label x={380} y={84} kind="val" anchor="start">
              I = 2·1·r^2 = {f2(I)} kg·m^2
            </Label>
            <Bar x={420} y={130} w={190} v={I} max={3.5} label="moment of inertia" />
            <Label x={420} y={190} kind="label" anchor="start">
              two masses of 1 kg, ω = 1.5 rad/s
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function ShapesFig() {
  const shapes = ['ring', 'disc', 'rod, centre', 'rod, end', 'sphere'];
  const forms = ['m r²', '½ m r²', 'm L² / 12', 'm L² / 3', '⅖ m r²'];
  return (
    <Anim title="Five shapes spinning at the same rate, each with its moment of inertia" height={220} loop={6}>
      {(t) => {
        const a = 2.4 * t;
        return (
          <g>
            {shapes.map((name, i) => {
              const x = 64 + i * 128;
              const y = 95;
              const c = Math.cos(a);
              const sn = Math.sin(a);
              return (
                <g key={name}>
                  {i === 0 && <Wheel x={x} y={y} r={36} ang={a} ring spokes={0} />}
                  {i === 1 && <Wheel x={x} y={y} r={36} ang={a} />}
                  {i === 2 && (
                    <g>
                      <line className="fig-path" x1={x - 42 * c} y1={y + 42 * sn} x2={x + 42 * c} y2={y - 42 * sn} strokeWidth={4} />
                      <circle className="fig-ball" cx={x} cy={y} r={3} />
                    </g>
                  )}
                  {i === 3 && (
                    <g>
                      <line className="fig-path" x1={x - 42} y1={y} x2={x - 42 + 84 * c} y2={y - 84 * sn} strokeWidth={4} />
                      <circle className="fig-ball" cx={x - 42} cy={y} r={3} />
                    </g>
                  )}
                  {i === 4 && (
                    <g>
                      <circle className="kit-block" cx={x} cy={y} r={36} />
                      <ellipse className="fig-guide" cx={x} cy={y} rx={Math.max(1, 36 * Math.abs(c))} ry={36} fill="none" />
                      <line className="fig-path" x1={x} y1={y - 46} x2={x} y2={y + 46} />
                      <Ball x={x + 36 * Math.cos(a + 1)} y={y - 12} r={3} glow={false} />
                    </g>
                  )}
                  <Label x={x} y={170} kind="label">
                    {name}
                  </Label>
                  <Label x={x} y={194} kind="sym">
                    {forms[i]}
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

// ------------------------------------------------------------------ 6. axis theorems

export function ParallelFig() {
  return (
    <Anim title="The same rod turned about an axis that slides from its centre to its end; its moment of inertia grows by m d squared" height={230} loop={6}>
      {(t) => {
        const d = 0.6 * ease(phase(t, 0.6, 3.4)) * (1 - ease(phase(t, 4.2, 5.6)));
        const I = 0.36 + 3 * d * d;
        const sc = 250;
        const cx = 250;
        const ax = cx + d * sc;
        const a = 2.4 * t;
        return (
          <g>
            <line className="fig-path" x1={cx - 0.6 * sc} y1={90} x2={cx + 0.6 * sc} y2={90} strokeWidth={6} />
            <Ball x={cx} y={90} r={3} glow={false} />
            <Label x={cx} y={70} kind="label">
              centre
            </Label>
            <Line x1={ax} y1={90} x2={cx} y2={90} tone="bright" />
            <circle className="kit-block" cx={ax} cy={90} r={9} fill="none" />
            <Ball x={ax + 9 * Math.cos(a)} y={90 - 9 * Math.sin(a)} r={2.5} glow={false} />
            <Label x={ax} y={122} kind="label">
              axis
            </Label>
            <Label x={14} y={166} kind="val" anchor="start">
              d = {f2(d)} m
            </Label>
            <Label x={14} y={190} kind="val" anchor="start">
              I = 0.36 + 3 · d^2 = {f2(I)} kg·m^2
            </Label>
            <Bar x={400} y={166} w={210} v={I} max={1.45} label="I (3 kg rod, 1.2 m)" />
          </g>
        );
      }}
    </Anim>
  );
}

export function PerpFig() {
  return (
    <Anim title="A flat disc turned about each of three axes: the two in its plane give a quarter each and the one through its face gives a half" height={240} loop={6}>
      {(t) => {
        const seg = 1.8;
        const k = Math.min(2, Math.floor(t / seg));
        const a = 3.2 * t;
        const cx = 190;
        const cy = 110;
        const R = 70;
        const c = Math.abs(Math.cos(a));
        const rx = k === 1 ? Math.max(2, R * c) : R;
        const ry = k === 0 ? Math.max(2, R * c) : R;
        const names = ['x axis (in the plane)', 'y axis (in the plane)', 'z axis (through the face)'];
        const vals = ['¼ m r²', '¼ m r²', '½ m r²'];
        return (
          <g>
            <ellipse className="kit-block" cx={cx} cy={cy} rx={k === 2 ? R : rx} ry={k === 2 ? R : ry} />
            {k === 2 && (
              <g>
                <line className="fig-guide" x1={cx} y1={cy} x2={cx + R * Math.cos(a)} y2={cy - R * Math.sin(a)} />
                <Ball x={cx + 0.8 * R * Math.cos(a)} y={cy - 0.8 * R * Math.sin(a)} r={3} glow={false} />
              </g>
            )}
            <Line x1={cx - 100} y1={cy} x2={cx + 100} y2={cy} tone={k === 0 ? 'bright' : 'faint'} dashed />
            <Line x1={cx} y1={cy - 100} x2={cx} y2={cy + 100} tone={k === 1 ? 'bright' : 'faint'} dashed />
            <Label x={cx + 108} y={cy + 5} kind="sym" anchor="start">
              x
            </Label>
            <Label x={cx} y={cy - 104} kind="sym">
              y
            </Label>
            <Ball x={cx} y={cy} r={3} glow={false} />
            <Label x={400} y={60} kind="label" anchor="start">
              spinning about the
            </Label>
            <Label x={400} y={82} kind="label" anchor="start">
              {names[k]}
            </Label>
            <Label x={400} y={118} kind="sym" anchor="start">
              {`I = ${vals[k]}`}
            </Label>
            <Label x={400} y={170} kind="sym" anchor="start">
              {`¼ + ¼ = ½   (I x + I y = I z)`}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 7. tau = I alpha

export function StringDisc() {
  return (
    <Anim title="A disc turned by a weight falling on a string wound round it: the weight speeds up at a steady rate and so does the disc" height={300} loop={5}>
      {(t) => {
        const ts = 0.9 * phase(t, 0.5, 3.3);
        const sc = 75;
        const R = 0.5;
        const a = (G * 0.25) / (0.25 + 0.25); // 4.9
        const al = a / R;
        const d = 0.5 * a * ts * ts;
        const th = 0.5 * al * ts * ts;
        const cx = 200;
        const cy = 55;
        const rx = cx + R * sc;
        const my = cy + 45 + d * sc;
        return (
          <g>
            <Line x1={cx - 70} y1={cy} x2={cx + 70} y2={cy} tone="faint" />
            <Wheel x={cx} y={cy} r={R * sc} ang={-th + 0.6} spokes={3} />
            <Line x1={rx} y1={cy} x2={rx} y2={my - 15} tone="bright" />
            <Block x={rx} y={my} w={30} h={30} label="m" />
            <Arrow x1={rx + 34} y1={my} x2={rx + 34} y2={my + 39} dashed label="mg" />
            <Arrow x1={rx + 34} y1={my} x2={rx + 34} y2={my - 20} dashed label="T" />
            <Label x={420} y={60} kind="val" anchor="start">
              disc 2 kg, r = 0.5 m, I = 0.25
            </Label>
            <Label x={380} y={84} kind="val" anchor="start">
              weight 1 kg
            </Label>
            <Label x={420} y={130} kind="val" anchor="start">
              t = {f2(ts)} s
            </Label>
            <Label x={420} y={154} kind="val" anchor="start">
              ω = {f1(al * ts)} rad/s
            </Label>
            <Label x={420} y={178} kind="val" anchor="start">
              v = {f2(a * ts)} m/s
            </Label>
            <Label x={420} y={214} kind="val" anchor="start">
              α = {f1(al)} rad/s^2, a = {f1(a)} m/s^2
            </Label>
            <Label x={420} y={238} kind="val" anchor="start">
              tension 4.9 N, weight 9.8 N
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 8. energy, work, power

export function WorkFig() {
  return (
    <Anim title="A flywheel pushed round by a steady torque: the work done by the torque equals the kinetic energy it gains" height={240} loop={5}>
      {(t) => {
        const ts = 2 * phase(t, 0.4, 3.6);
        const I = 0.25;
        const tau = 2;
        const al = tau / I;
        const w = al * ts;
        const th = 0.5 * al * ts * ts;
        const W = tau * th;
        const KE = 0.5 * I * w * w;
        const cx = 140;
        const cy = 115;
        return (
          <g>
            <Wheel x={cx} y={cy} r={70} ang={th} spokes={4} />
            <Arrow x1={cx - 50} y1={cy + 70} x2={cx} y2={cy + 70} label="F" />
            <Label x={300} y={52} kind="val" anchor="start">
              τ = 2 N·m, I = 0.25 kg·m^2
            </Label>
            <Bar x={300} y={100} w={300} v={W} max={34} label={`work done  τ · θ = ${f1(W)} J`} />
            <Bar x={300} y={150} w={300} v={KE} max={34} label={`kinetic energy  ½ · I · ω² = ${f1(KE)} J`} soft />
            <Label x={300} y={200} kind="val" anchor="start">
              power  τ · ω = {f1(tau * w)} W
            </Label>
            <Label x={300} y={222} kind="val" anchor="start">
              ω = {f1(w)} rad/s
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 9. angular momentum

export function MomentumFig() {
  return (
    <Anim title="A ring and a disc of the same mass and size turning at the same rate: the ring has twice the angular momentum" height={230} loop={5}>
      {(t) => {
        const w = 3;
        const a = w * t;
        return (
          <g>
            {[
              { x: 130, ring: true, I: 0.5, name: 'ring, I = m r² = 0.5' },
              { x: 400, ring: false, I: 0.25, name: 'disc, I = ½ m r² = 0.25' },
            ].map((s) => (
              <g key={s.name}>
                <Wheel x={s.x} y={90} r={50} ang={a} ring={s.ring} />
                <Label x={s.x} y={165} kind="label">
                  {s.name}
                </Label>
                <Bar x={s.x - 80} y={196} w={160} v={s.I * w} max={1.6} label={`L = I · ω = ${f2(s.I * w)} kg·m²/s`} />
              </g>
            ))}
            <Label x={270} y={30} kind="label">
              both: m = 2 kg, r = 0.5 m, ω = 3 rad/s
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 10. conservation

/** Integrate ω(t) = L / I(t) to get the turned angle at time t. */
function turned(t: number, omegaAt: (t: number) => number) {
  let th = 0;
  const n = Math.ceil(t / 0.02);
  for (let i = 0; i < n; i++) th += omegaAt((i + 0.5) * (t / n)) * (t / n);
  return th;
}

export function RodConserve() {
  const radius = (t: number) => (t < 3.4 ? lerp(1.2, 0.6, ease(phase(t, 0.8, 2.2))) : lerp(0.6, 1.2, ease(phase(t, 3.4, 4.8))));
  const L = 2 * 1.2 * 1.2 * 1.5;
  const omega = (t: number) => L / (2 * radius(t) ** 2);
  return (
    <Anim title="Two masses on a spinning rod slide inward: the angular velocity rises so that the angular momentum stays the same" height={250} loop={6}>
      {(t) => {
        const r = radius(t);
        const w = omega(t);
        const th = turned(t, omega);
        const cx = 200;
        const cy = 120;
        const A = { x: cx + 100 * r * Math.cos(th), y: cy - 100 * r * Math.sin(th) };
        const B = { x: cx - 100 * r * Math.cos(th), y: cy + 100 * r * Math.sin(th) };
        const I = 2 * r * r;
        return (
          <g>
            <line className="fig-path" x1={B.x - 30 * Math.cos(th)} y1={B.y + 30 * Math.sin(th)} x2={A.x + 30 * Math.cos(th)} y2={A.y - 30 * Math.sin(th)} />
            <Ball x={A.x} y={A.y} r={9} />
            <Ball x={B.x} y={B.y} r={9} />
            <circle className="fig-ball" cx={cx} cy={cy} r={3} />
            <Label x={420} y={50} kind="val" anchor="start">
              r = {f2(r)} m
            </Label>
            <Label x={420} y={74} kind="val" anchor="start">
              I = {f2(I)} kg·m^2
            </Label>
            <Label x={420} y={98} kind="val" anchor="start">
              ω = {f2(w)} rad/s
            </Label>
            <Bar x={420} y={140} w={190} v={I * w} max={5} label={`L = I · ω = ${f2(I * w)}`} />
            <Bar x={420} y={190} w={190} v={0.5 * I * w * w} max={14} label={`kinetic energy ${f1(0.5 * I * w * w)} J`} soft />
          </g>
        );
      }}
    </Anim>
  );
}

export function Skater({ height = 270 }: { height?: number }) {
  const pull = (t: number) => (t < 3.6 ? ease(phase(t, 0.8, 1.8)) : 1 - ease(phase(t, 3.6, 4.6)));
  const rr = (t: number) => lerp(70, 20, pull(t));
  const b = 1.6 / (70 * 70 - 20 * 20);
  const I0 = 3.2 - 70 * 70 * b;
  const Iof = (t: number) => I0 + b * rr(t) ** 2;
  const omega = (t: number) => 6.4 / Iof(t);
  return (
    <Anim title="A skater spins with arms out, then pulls them in and spins twice as fast" height={height} loop={6}>
      {(t) => {
        const r = rr(t);
        const th = turned(t, omega);
        const cx = 190;
        const gy = height - 40;
        const sy = gy - 100;
        const lift = (70 - r) * 0.7;
        return (
          <g>
            <ellipse className="fig-guide" cx={cx} cy={gy} rx={64} ry={14} fill="none" />
            <Ball x={cx + 64 * Math.cos(th)} y={gy + 14 * Math.sin(th)} r={3.5} glow={false} />
            <Ball x={cx - 64 * Math.cos(th)} y={gy - 14 * Math.sin(th)} r={3.5} glow={false} />
            <line className="fig-path" x1={cx} y1={sy - 20} x2={cx} y2={gy - 6} strokeWidth={5} />
            <circle className="kit-block" cx={cx} cy={sy - 34} r={12} />
            <Ball x={cx + 9 * Math.sin(th)} y={sy + 20} r={2.5} glow={false} />
            {[-1, 1].map((s) => (
              <g key={s}>
                <line className="fig-path" x1={cx} y1={sy} x2={cx + s * r} y2={sy - lift} />
                <Ball x={cx + s * r} y={sy - lift} r={7} />
              </g>
            ))}
            <Label x={420} y={60} kind="val" anchor="start">
              I = {f2(Iof(t))} kg·m^2
            </Label>
            <Label x={380} y={84} kind="val" anchor="start">
              ω = {f2(omega(t))} rad/s
            </Label>
            <Bar x={420} y={125} w={190} v={Iof(t) * omega(t)} max={7} label={`L = I · ω = ${f1(Iof(t) * omega(t))}`} />
            <Bar x={420} y={175} w={190} v={0.5 * Iof(t) * omega(t) ** 2} max={14} label={`kinetic energy ${f1(0.5 * Iof(t) * omega(t) ** 2)} J`} soft />
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 11. rolling

export function RollingWheel({ height = 260, R = 50, compact }: { height?: number; R?: number; compact?: boolean }) {
  return (
    <Anim title="A wheel rolling without slipping: the contact point is at rest, the centre moves at v and the top at twice v" height={height} loop={5.5}>
      {(t) => {
        const v = 110;
        const gy = height - 34;
        const x0 = 70;
        const tt = clamp(t - 0.2, 0, 4);
        const xc = x0 + v * tt;
        const yc = gy - R;
        const th = (v * tt) / R;
        const pts: [number, number][] = [];
        for (let i = 0; i <= 60; i++) {
          const s = (tt * i) / 60;
          const a = (v * s) / R;
          pts.push([x0 + v * s - R * Math.sin(a), yc + R * Math.cos(a)]);
        }
        return (
          <g>
            <Ground y={gy} />
            <Trail points={pts} tone="soft" />
            <g transform={`rotate(${(th * 180) / Math.PI} ${xc} ${yc})`}>
              <circle className="kit-block" cx={xc} cy={yc} r={R} fill="none" />
              <line className="fig-guide" x1={xc - R} y1={yc} x2={xc + R} y2={yc} />
              <line className="fig-guide" x1={xc} y1={yc - R} x2={xc} y2={yc + R} />
              <Ball x={xc} y={yc + R} r={4} />
            </g>
            <Ball x={xc} y={yc} r={3} glow={false} />
            <Arrow x1={xc} y1={yc} x2={xc + v * 0.45} y2={yc} />
            <Arrow x1={xc} y1={yc - R} x2={xc + v * 0.9} y2={yc - R} />
            {!compact && (
              <g>
                <Label x={xc + v * 0.45 + 14} y={yc - 8} kind="sym" anchor="start">
                  v
                </Label>
                <Label x={xc + v * 0.9 + 14} y={yc - R - 8} kind="sym" anchor="start">
                  2v
                </Label>
                <Label x={xc} y={gy + 22} kind="label">
                  contact point: at rest
                </Label>
              </g>
            )}
            {compact && (
              <Label x={xc} y={gy + 22} kind="label">
                contact point: v = 0
              </Label>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

export function KEShare() {
  const rows = [
    { name: 'ring', k: 1 },
    { name: 'disc', k: 0.5 },
    { name: 'sphere', k: 0.4 },
  ];
  return (
    <Anim title="The kinetic energy of a rolling body split into the part from moving along and the part from spinning" height={200} loop={5}>
      {(t) => {
        const p = ease(phase(t, 0.3, 1.6));
        return (
          <g>
            {rows.map((r, i) => {
              const y = 40 + i * 52;
              const trans = 1 / (1 + r.k);
              const W = 380 * p;
              return (
                <g key={r.name}>
                  <Label x={14} y={y + 10} kind="label" anchor="start">
                    {r.name}
                  </Label>
                  <rect className="kit-block" x={110} y={y} width={380} height={16} rx={2} fill="none" />
                  <rect x={110} y={y} width={W * trans} height={16} fill="#fff" fillOpacity={0.9} />
                  <rect x={110 + W * trans} y={y} width={W * (1 - trans)} height={16} fill="#fff" fillOpacity={0.35} />
                  <Label x={500} y={y + 12} kind="val" anchor="start">
                    {Math.round(100 * trans * p)} % + {Math.round(100 * (1 - trans) * p)} %
                  </Label>
                </g>
              );
            })}
            <Label x={110} y={20} kind="label" anchor="start">
              bright: moving along   faint: spinning
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 12. the race

export function RaceFig({ bodies, height = 290, labelTimes = true, distance = 3 }: { bodies: { name: string; k: number; r?: number }[]; height?: number; labelTimes?: boolean; distance?: number }) {
  const ang = 20;
  const base = 500;
  const x0 = 110;
  const y0 = height - 12;
  const sc = 150;
  return (
    <Anim title="Bodies released together on a slope roll down at different rates, depending on how their mass is spread" height={height} loop={4.2}>
      {(t) => {
        const ts = Math.max(0, t - 0.5);
        return (
          <g>
            <Incline x={x0} y={y0} base={base} angle={ang} mark={false} />
            {bodies.map((b, i) => {
              const lane = i * 30;
              const r = b.r ?? 12;
              const a = (G * Math.sin(ang * DEG)) / (1 + b.k);
              const tEnd = Math.sqrt((2 * distance) / a);
              const dd = 0.5 * a * Math.min(ts, tEnd) ** 2 * sc;
              const dStart = (distance * sc) + 30;
              const d = dStart - dd;
              const p0 = slopePoint(x0, y0, ang, 20, lane);
              const p1 = slopePoint(x0, y0, ang, base / Math.cos(ang * DEG) - 8, lane);
              const c = slopePoint(x0, y0, ang, d, lane + r);
              const th = dd / r;
              const done = ts >= tEnd;
              return (
                <g key={b.name}>
                  <Line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} tone="faint" />
                  <Wheel x={c.x} y={c.y} r={r} ang={th} ring={b.k === 1} spokes={b.k === 0.4 ? 4 : 2} />
                  <Label x={p0.x - 10} y={p0.y + 4} kind="label" anchor="end">
                    {b.name}
                  </Label>
                  {labelTimes && done && (
                    <Label x={c.x + 4} y={c.y + 30} kind="val" anchor="start">
                      {f2(tEnd)} s
                    </Label>
                  )}
                </g>
              );
            })}
            <Readout>t = {f2(ts)} s</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ ladder

export function LadderFig() {
  return (
    <Anim title="A ladder leaning on a smooth wall: weight, the wall's push, the floor's push and friction balance" height={280} loop={5}>
      {(t) => {
        const p = ease(phase(t, 0.3, 1.2));
        const q = ease(phase(t, 1.2, 2.2));
        const gx = 140;
        const gy = 240;
        const sc = 40;
        const bx = gx;
        const topY = gy - 4 * sc;
        const wallX = bx + 3 * sc;
        const cmx = bx + 1.5 * sc;
        const cmy = gy - 2 * sc;
        return (
          <g>
            <Ground y={gy} x1={60} x2={300} />
            <Wall x={wallX} y1={topY - 30} y2={gy} side={1} />
            <line className="fig-path" x1={bx} y1={gy} x2={wallX} y2={topY} strokeWidth={5} />
            <Ball x={cmx} y={cmy} r={4} />
            <Arrow x1={cmx} y1={cmy} x2={cmx} y2={cmy + 66 * p} label="mg" />
            <Arrow x1={wallX} y1={topY} x2={wallX - 25 * q} y2={topY} label="N" />
            <Arrow x1={bx} y1={gy} x2={bx} y2={gy - 66 * q} label="R" />
            <Arrow x1={bx} y1={gy} x2={bx + 25 * q} y2={gy} label="f" />
            <Line x1={bx} y1={gy + 22} x2={wallX} y2={gy + 22} tone="faint" />
            <Label x={(bx + wallX) / 2} y={gy + 38} kind="label">
              3 m
            </Label>
            <Label x={470} y={70} kind="label" anchor="start">
              turn about the base:
            </Label>
            <Label x={470} y={96} kind="val" anchor="start">
              N · 4 = m g · 1.5
            </Label>
            <Label x={470} y={130} kind="val" anchor="start">
              N = {f1(15 * G * 1.5 / 4 * q)} N
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ mistake animations

export function MistakeTorque() {
  return <DoorFig cases={[{ d: 0.9, deg: 0 }, { d: 0.9, deg: 45 }, { d: 0.9, deg: 90 }]} height={170} />;
}

export function MistakeInertiaShape() {
  return (
    <Anim title="A ring and a disc with the same mass and size, pushed by the same torque: the disc speeds up twice as fast" height={170} loop={4}>
      {(t) => {
        const ts = 2.2 * phase(t, 0.3, 3.4);
        return (
          <g>
            <Wheel x={150} y={80} r={42} ang={0.5 * 4 * ts * ts} ring />
            <Wheel x={450} y={80} r={42} ang={0.5 * 8 * ts * ts} />
            <Label x={150} y={152} kind="label">
              ring: α = 4 rad/s²
            </Label>
            <Label x={450} y={152} kind="label">
              disc: α = 8 rad/s²
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function MistakeAxis() {
  return (
    <Anim title="The same rod pushed by the same torque turns four times as fast about its centre as about its end" height={170} loop={4}>
      {(t) => {
        const ts = 1.6 * phase(t, 0.3, 3.4);
        const a1 = 0.5 * 8 * ts * ts * 0.4;
        const a2 = 0.5 * 2 * ts * ts * 0.4;
        return (
          <g>
            <line className="fig-path" x1={150 - 60 * Math.cos(a1)} y1={80 + 60 * Math.sin(a1)} x2={150 + 60 * Math.cos(a1)} y2={80 - 60 * Math.sin(a1)} strokeWidth={4} />
            <circle className="fig-ball" cx={150} cy={80} r={3} />
            <line className="fig-path" x1={420} y1={80} x2={420 + 120 * Math.cos(a2)} y2={80 - 120 * Math.sin(a2)} strokeWidth={4} />
            <circle className="fig-ball" cx={420} cy={80} r={3} />
            <Label x={150} y={152} kind="label">
              axis at centre: I = m L² / 12
            </Label>
            <Label x={420} y={152} kind="label">
              axis at end: I = m L² / 3
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function MistakeEnergy() {
  return (
    <Anim title="When the skater pulls in, the angular momentum stays put but the kinetic energy doubles" height={170} loop={4}>
      {(t) => {
        const p = ease(phase(t, 0.6, 2.2));
        const I = lerp(3.2, 1.6, p);
        const w = 6.4 / I;
        return (
          <g>
            <Bar x={40} y={50} w={320} v={I * w} max={7} label={`L = ${f1(I * w)} (unchanged)`} />
            <Bar x={40} y={110} w={320} v={0.5 * I * w * w} max={14} label={`kinetic energy = ${f1(0.5 * I * w * w)} J (doubled)`} soft />
            <Label x={400} y={80} kind="val" anchor="start">
              I: 3.2 → {f1(I)}
            </Label>
            <Label x={400} y={104} kind="val" anchor="start">
              ω: 2 → {f1(w)}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function MistakeEqualRace() {
  return (
    <RaceFig
      height={200}
      distance={2}
      labelTimes={false}
      bodies={[
        { name: 'small disc', k: 0.5, r: 8 },
        { name: 'big disc', k: 0.5, r: 16 },
      ]}
    />
  );
}

// ------------------------------------------------------------------ example animations

export function DiscForce() {
  return (
    <Anim title="A disc pushed round by a steady tangential force speeds up at a constant rate" height={230} loop={5}>
      {(t) => {
        const ts = 1.5 * phase(t, 0.3, 3.6);
        const al = 16;
        const th = 0.5 * al * ts * ts;
        const cx = 170;
        const cy = 110;
        return (
          <g>
            <Wheel x={cx} y={cy} r={70} ang={th} spokes={3} />
            <Arrow x1={cx - 60} y1={cy + 70} x2={cx} y2={cy + 70} label="F" />
            <Label x={380} y={70} kind="val" anchor="start">
              F = 8 N, r = 0.5 m, m = 2 kg
            </Label>
            <Label x={380} y={110} kind="val" anchor="start">
              α = 16 rad/s^2
            </Label>
            <Label x={380} y={140} kind="val" anchor="start">
              t = {f2(ts)} s
            </Label>
            <Label x={380} y={164} kind="val" anchor="start">
              ω = {f1(al * ts)} rad/s
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function EnergyRoll() {
  return (
    <Anim title="A solid sphere rolling down a slope two metres high: potential energy turns into moving and spinning energy" height={280} loop={5}>
      {(t) => {
        const ang = 20;
        const base = 470;
        const x0 = 40;
        const y0 = 262;
        const slopeLen = 2 / Math.sin(ang * DEG);
        const a = (G * Math.sin(ang * DEG)) / 1.4;
        const tEnd = Math.sqrt((2 * slopeLen) / a);
        const ts = clamp(t - 0.4, 0, tEnd);
        const s = 0.5 * a * ts * ts;
        const v = a * ts;
        const h = (slopeLen - s) * Math.sin(ang * DEG);
        const pxm = base / Math.cos(ang * DEG) / slopeLen;
        const c = slopePoint(x0, y0, ang, (slopeLen - s) * pxm - 8, 13);
        const KE = 0.5 * v * v * 1.4;
        return (
          <g>
            <Incline x={x0} y={y0} base={base} angle={ang} mark={false} />
            <Wheel x={c.x} y={c.y} r={13} ang={s * pxm / 13} spokes={4} />
            <Label x={500} y={60} kind="val" anchor="start">
              h = {f2(h)} m
            </Label>
            <Label x={500} y={84} kind="val" anchor="start">
              v = {f2(v)} m/s
            </Label>
            <Bar x={420} y={130} w={190} v={9.8 * h} max={19.6} label={`potential ${f1(9.8 * h)} J per kg`} />
            <Bar x={420} y={180} w={190} v={KE} max={19.6} label={`moving + spinning ${f1(KE)} J per kg`} soft />
          </g>
        );
      }}
    </Anim>
  );
}
