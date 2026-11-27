import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Block, Ground, Label, Line, Readout, Spring, Trail, Wall, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for oscillations. Positions come from the real physics, scaled to pixels. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

/** Sample f(s) for s in [0, span] into points. */
function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

/** Exact pendulum swing from rest at theta0 (rad), with w2 = g / L, by RK4. Symmetric in time. */
const swings = new Map<string, Float32Array>();
function swing(theta0: number, w2: number): (t: number) => number {
  const key = `${theta0}|${w2}`;
  let a = swings.get(key);
  const dt = 0.005;
  if (!a) {
    const n = Math.ceil(40 / dt);
    a = new Float32Array(n + 2);
    let th = theta0;
    let om = 0;
    a[0] = th;
    const f = (x: number) => -w2 * Math.sin(x);
    for (let i = 1; i <= n + 1; i++) {
      const k1t = om, k1o = f(th);
      const k2t = om + 0.5 * dt * k1o, k2o = f(th + 0.5 * dt * k1t);
      const k3t = om + 0.5 * dt * k2o, k3o = f(th + 0.5 * dt * k2t);
      const k4t = om + dt * k3o, k4o = f(th + dt * k3t);
      th += (dt / 6) * (k1t + 2 * k2t + 2 * k3t + k4t);
      om += (dt / 6) * (k1o + 2 * k2o + 2 * k3o + k4o);
      a[i] = th;
    }
    swings.set(key, a);
  }
  const arr = a;
  return (t) => {
    const s = Math.min(Math.abs(t) / dt, arr.length - 2);
    const i = Math.floor(s);
    return lerp(arr[i], arr[i + 1], s - i);
  };
}

/** A block on a spring from a wall, centred at (bx, y). */
function Row({ wallX = 24, y, bx, bw = 40, bh = 34, label, eq, coils = 9, hatch = false, track = true }: { wallX?: number; y: number; bx: number; bw?: number; bh?: number; label?: ReactNode; eq?: number; coils?: number; hatch?: boolean; track?: boolean }) {
  return (
    <g>
      <Wall x={wallX} y1={y - bh / 2 - 10} y2={y + bh / 2 + 10} side={-1} />
      {track && <Ground y={y + bh / 2} x1={wallX} x2={W - 16} hatch={hatch} />}
      <Spring x1={wallX} y1={y} x2={bx - bw / 2} y2={y} coils={coils} />
      <Block x={bx} y={y} w={bw} h={bh} label={label} />
      {eq !== undefined && <Line x1={eq} y1={y + bh / 2 + 3} x2={eq} y2={y + bh / 2 + 15} tone="soft" />}
    </g>
  );
}

/** A little key: short line sample and a name. */
function Key({ x, y, name, tone = 'bright', dashed }: { x: number; y: number; name: ReactNode; tone?: 'bright' | 'soft'; dashed?: boolean }) {
  return (
    <g>
      <Line x1={x} y1={y - 4} x2={x + 22} y2={y - 4} tone={tone} dashed={dashed} />
      <Label x={x + 28} y={y} kind="label" anchor="start">
        {name}
      </Label>
    </g>
  );
}

// ------------------------------------------------------------------ periodic motion

export function Periodic() {
  return (
    <Anim title="A pendulum, a mass on a spring and a bouncing ball all repeat; the first two swing about a middle point" height={210} loop={7.2}>
      {(t) => {
        const th = 0.5 * Math.cos((TAU * t) / 2.4);
        const px = 105, py = 30, L = 110;
        const bx = px + L * Math.sin(th), by = py + L * Math.cos(th);
        const sx = 330 + 45 * Math.sin((TAU * t) / 2.4);
        const p = (t / 1.2) % 1;
        const h = 4 * p * (1 - p) * 120;
        return (
          <g>
            <Line x1={px - 30} y1={py} x2={px + 30} y2={py} tone="bright" />
            <Line x1={px} y1={py} x2={bx} y2={by} />
            <Line x1={px} y1={py} x2={px} y2={py + L} tone="soft" dashed />
            <Ball x={bx} y={by} r={9} />
            <Label x={px} y={190} kind="label">pendulum</Label>
            <Row wallX={235} y={95} bx={sx} eq={330} bh={30} bw={36} />
            <Label x={330} y={190} kind="label">mass on a spring</Label>
            <Ground y={170} x1={470} x2={620} />
            <Ball x={545} y={170 - 7 - h} r={7} />
            <Label x={545} y={190} kind="label">bouncing ball</Label>
            <Label x={545} y={30} kind="label">repeats, but no middle point</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ spring and block

type GraphKind = 'none' | 'x' | 'xva' | 'vx';

/** A mass on a spring with optional x, v, a arrows, and a graph beside it. */
export function SpringMass({ title, graph = 'none', arrows = true, height = 230, loop = 7.2, omega = TAU / 2.4, real, notes = [] }: { title: string; graph?: GraphKind; arrows?: boolean; height?: number; loop?: number; omega?: number; real?: { A: number; w: number }; notes?: string[] }) {
  return (
    <Anim title={title} height={height} loop={loop}>
      {(t) => {
        const compact = graph !== 'none';
        const eq = compact ? 160 : 320;
        const Apx = compact ? 80 : 130;
        const ym = height * 0.48;
        const s = Math.sin(omega * t), c = Math.cos(omega * t);
        const bx = eq + Apx * s;
        const gx = 345, gw = 270, gh = 62;
        const now = gx + gw - 18;
        const pps = (gw - 18) / 4.8;
        const g = (f: (tau: number) => number) => curve(90, 4.8, (u) => [now - u * pps, ym - gh * f(t - u)]);
        return (
          <g>
            <Line x1={eq} y1={ym - 56} x2={eq} y2={ym + 66} tone="soft" dashed />
            <Label x={eq} y={ym + 82} kind="label">equilibrium</Label>
            <Row y={ym} bx={bx} eq={undefined} hatch={false} />
            {arrows && (
              <g>
                <Arrow x1={bx} y1={ym - 34} x2={bx + 50 * c} y2={ym - 34} label="v" />
                <Arrow x1={bx} y1={ym + 34} x2={bx - 50 * s} y2={ym + 34} label="a" />
                <Arrow x1={eq} y1={ym + 52} x2={bx} y2={ym + 52} tone="soft" label="x" />
              </g>
            )}
            {graph === 'x' && (
              <g>
                <Axes x={gx} y={ym} w={gw} h={gh + 12} below={gh + 12} xLabel="t" yLabel="x" />
                <Trail points={g((tau) => Math.sin(omega * tau))} />
                <Ball x={now} y={ym - gh * s} r={5} />
              </g>
            )}
            {graph === 'xva' && (
              <g>
                <Axes x={gx} y={ym} w={gw} h={gh + 12} below={gh + 12} xLabel="t" />
                <Trail points={g((tau) => Math.sin(omega * tau))} />
                <Trail points={g((tau) => Math.cos(omega * tau))} tone="soft" />
                <Trail points={g((tau) => -Math.sin(omega * tau))} tone="soft" dashed />
                <Key x={gx + 6} y={height - 10} name="x" />
                <Key x={gx + 80} y={height - 10} name="v" tone="soft" />
                <Key x={gx + 154} y={height - 10} name="a" tone="soft" dashed />
              </g>
            )}
            {graph === 'vx' && (
              <g>
                <Arrow x1={480 - 110} y1={ym} x2={480 + 110} y2={ym} tone="soft" label="x" />
                <Arrow x1={480} y1={ym + 76} x2={480} y2={ym - 80} tone="soft" label="v" />
                <Trail points={curve(60, TAU, (u) => [480 + 90 * Math.sin(u), ym - 62 * Math.cos(u)])} tone="soft" dashed />
                <Line x1={480 + 90 * s} y1={ym} x2={480 + 90 * s} y2={ym - 62 * c} tone="soft" dashed />
                <Ball x={480 + 90 * s} y={ym - 62 * c} r={5} />
              </g>
            )}
            {real && (
              <g>
                <Label x={16} y={22} kind="val" anchor="start">{`x = ${(real.A * s).toFixed(3)} m`}</Label>
                <Label x={16} y={42} kind="val" anchor="start">{`v = ${(real.A * real.w * c).toFixed(2)} m/s`}</Label>
                <Label x={16} y={62} kind="val" anchor="start">{`a = ${(-real.A * real.w * real.w * s).toFixed(1)} m/s²`}</Label>
              </g>
            )}
            {notes.map((n, i) => (
              <Label key={n} x={16} y={22 + 18 * i} kind="val" anchor="start">
                {n}
              </Label>
            ))}
          </g>
        );
      }}
    </Anim>
  );
}

/** The restoring force always points back, and grows in step with the displacement. */
export function Restoring() {
  return (
    <Anim title="The force on the block always points back toward the middle, and is bigger the farther it is displaced; a graph of force against displacement is a straight line" height={210} loop={7.2}>
      {(t) => {
        const w = TAU / 2.4;
        const s = Math.sin(w * t);
        const eq = 160, ym = 105;
        const bx = eq + 80 * s;
        const cx = 485;
        return (
          <g>
            <Line x1={eq} y1={ym - 56} x2={eq} y2={ym + 40} tone="soft" dashed />
            <Row y={ym} bx={bx} />
            <Arrow x1={bx} y1={ym - 34} x2={bx - 70 * s} y2={ym - 34} label="F" />
            <Arrow x1={eq} y1={ym + 52} x2={bx} y2={ym + 52} tone="soft" label="x" />
            <Arrow x1={cx - 110} y1={ym} x2={cx + 110} y2={ym} tone="soft" label="x" />
            <Arrow x1={cx} y1={ym + 80} x2={cx} y2={ym - 82} tone="soft" label="F" />
            <Line x1={cx - 90} y1={ym - 64} x2={cx + 90} y2={ym + 64} />
            <Line x1={cx + 90 * s} y1={ym} x2={cx + 90 * s} y2={ym + 64 * s} tone="soft" dashed />
            <Ball x={cx + 90 * s} y={ym + 64 * s} r={5} />
            <Label x={cx - 92} y={ym - 72} kind="sym" anchor="start">F = −k x</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the shadow of a circle

export function Shadow({ title, height = 260, omega = 2, label }: { title: string; height?: number; omega?: number; label?: string }) {
  return (
    <Anim title={title} height={height} loop={(4 * Math.PI) / omega}>
      {(t) => {
        const cy = height / 2;
        const R = Math.min(80, height * 0.34);
        const cx = 110;
        const ax = 250;
        const th = omega * t;
        const dx = cx + R * Math.cos(th), dy = cy - R * Math.sin(th);
        const pps = 55;
        return (
          <g>
            <circle className="fig-guide" cx={cx} cy={cy} r={R} fill="none" />
            <Line x1={cx} y1={cy} x2={dx} y2={dy} tone="bright" />
            <Line x1={dx} y1={dy} x2={ax} y2={dy} tone="soft" dashed />
            <Line x1={ax} y1={cy - R - 12} x2={ax} y2={cy + R + 12} tone="soft" />
            <Arrow x1={ax} y1={cy} x2={W - 14} y2={cy} tone="soft" label="t" />
            <Trail points={curve(110, (W - 30 - ax) / pps, (u) => [ax + u * pps, cy - R * Math.sin(omega * (t - u))])} />
            <Ball x={dx} y={dy} r={6} />
            <Ball x={ax} y={dy} r={6} />
            <Label x={cx} y={cy + R + 22} kind="label">{label ?? 'point on a circle'}</Label>
            <Label x={ax - 8} y={cy - R - 18} kind="label" anchor="end">shadow</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ phase

export function PhaseShift() {
  return (
    <Anim title="Two sine waves of the same size and frequency, one shifted along in time by the phase constant" height={220} loop={8}>
      {(t) => {
        const x0 = 50, y0 = 110, wx = 560, A = 70;
        const phi = Math.PI / 3;
        const per = 280;
        const u = ((t / 8) * 2 * per) % (2 * per);
        const cur = x0 + u;
        const f = (p: number) => (k: number) => y0 - A * Math.sin((k / per) * TAU + p);
        const pts = (p: number) => curve(140, wx - 20, (k) => [x0 + k, f(p)(k)] as Pt);
        const k = u;
        return (
          <g>
            <Axes x={x0} y={y0} w={wx} h={A + 20} below={A + 20} xLabel="t" yLabel="x" />
            <Trail points={pts(0)} tone="soft" dashed />
            <Trail points={pts(phi)} />
            <Line x1={cur} y1={y0 - A - 10} x2={cur} y2={y0 + A + 10} tone="soft" dashed />
            <Ball x={cur} y={f(0)(k)} r={4.5} ghost />
            <Ball x={cur} y={f(phi)(k)} r={5} />
            <Key x={60} y={206} name="φ = 0" tone="soft" dashed />
            <Key x={170} y={206} name="φ = π / 3" />
            <Label x={W - 14} y={206} kind="label" anchor="end">the φ curve is ahead in time</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ amplitude does not change the period

export function AmpIndep({ height = 190 }: { height?: number }) {
  return (
    <Anim title="Two blocks on identical springs, one pulled far and one pulled a little, swing back and forth in time together" height={height} loop={7.2}>
      {(t) => {
        const w = TAU / 2.4;
        const eq = 330;
        const rows: [number, number, string][] = [
          [height * 0.3, 45, 'small amplitude'],
          [height * 0.7, 130, 'large amplitude'],
        ];
        return (
          <g>
            <Line x1={eq} y1={14} x2={eq} y2={height - 14} tone="soft" dashed />
            {rows.map(([y, A, name]) => (
              <g key={name}>
                <Line x1={eq - A} y1={y - 22} x2={eq - A} y2={y + 22} tone="soft" dashed />
                <Line x1={eq + A} y1={y - 22} x2={eq + A} y2={y + 22} tone="soft" dashed />
                <Row y={y} bx={eq + A * Math.sin(w * t)} bh={28} bw={34} track={false} />
                <Label x={W - 14} y={y - 24} kind="label" anchor="end">{name}</Label>
              </g>
            ))}
            <Readout x={W - 14} y={height - 6}>same period T</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ energy

export function EnergyParabola({ title, mark, real, height = 260 }: { title: string; mark?: number; real?: { E: number }; height?: number }) {
  return (
    <Anim title={title} height={height} loop={6}>
      {(t) => {
        const w = TAU / 3;
        const s = Math.sin(w * t);
        const eq = 135, ym = 120;
        const cx = 465, by = 215, Eh = 150, hw = 130;
        const dx = cx + hw * s, dy = by - Eh * s * s;
        return (
          <g>
            <Line x1={eq} y1={ym - 56} x2={eq} y2={ym + 40} tone="soft" dashed />
            <Row y={ym} bx={eq + 75 * s} bw={36} bh={32} />
            <Arrow x1={cx - 150} y1={by} x2={cx + 150} y2={by} tone="soft" label="x" />
            <Arrow x1={cx} y1={by + 4} x2={cx} y2={by - Eh - 30} tone="soft" label="E" />
            <Trail points={curve(80, 2, (u) => [cx + (u - 1) * hw, by - Eh * (u - 1) ** 2] as Pt)} tone="soft" />
            <Line x1={cx - hw} y1={by - Eh} x2={cx + hw} y2={by - Eh} tone="soft" dashed />
            <Label x={cx + hw + 4} y={by - Eh - 8} kind="sym" anchor="end">E = ½ k A²</Label>
            {mark !== undefined &&
              [-1, 1].map((sg) => (
                <g key={sg}>
                  <Line x1={cx + sg * hw * mark} y1={by} x2={cx + sg * hw * mark} y2={by - Eh * mark * mark} tone="soft" dashed />
                  <Label x={cx + sg * hw * mark} y={by + 18} kind="sym">{sg < 0 ? '−A/2' : 'A/2'}</Label>
                </g>
              ))}
            <Line x1={dx} y1={by} x2={dx} y2={dy} tone="bright" />
            <Line x1={dx} y1={dy} x2={dx} y2={by - Eh} tone="soft" dashed />
            <Ball x={dx} y={dy} r={5} />
            <Key x={20} y={height - 12} name="PE" />
            <Key x={92} y={height - 12} name="KE" tone="soft" dashed />
            {real && (
              <g>
                <Label x={16} y={22} kind="val" anchor="start">{`PE = ${(real.E * s * s).toFixed(2)} J`}</Label>
                <Label x={16} y={42} kind="val" anchor="start">{`KE = ${(real.E * (1 - s * s)).toFixed(2)} J`}</Label>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

export function PendulumEnergy() {
  return (
    <Anim title="As the pendulum swings, the energy bars trade potential for kinetic energy while the total stays the same" height={260} loop={12}>
      {(t) => {
        const w2 = (TAU / 3) ** 2;
        const th0 = 0.6;
        const th = swing(th0, w2)(t);
        const px = 170, py = 28, L = 170;
        const bx = px + L * Math.sin(th), by = py + L * Math.cos(th);
        const low = py + L;
        const Emax = 1 - Math.cos(th0);
        const pe = (1 - Math.cos(th)) / Emax;
        const ke = 1 - pe;
        const base = 220, H = 150;
        const bars: [number, number, string][] = [
          [400, pe, 'PE'],
          [470, ke, 'KE'],
          [540, 1, 'total'],
        ];
        return (
          <g>
            <Line x1={px - 30} y1={py} x2={px + 30} y2={py} tone="bright" />
            <Line x1={px} y1={py} x2={bx} y2={by} />
            <Line x1={px - 120} y1={low} x2={px + 120} y2={low} tone="soft" dashed />
            <Line x1={bx} y1={by} x2={bx} y2={low} tone="soft" />
            <Ball x={bx} y={by} r={10} />
            <Label x={px - 124} y={low + 4} kind="sym" anchor="end">h</Label>
            <Line x1={370} y1={base} x2={580} y2={base} tone="soft" />
            {bars.map(([x, v, name], i) => (
              <g key={name}>
                {i < 2 ? <rect className="fig-ball" x={x - 18} y={base - H * v} width={36} height={Math.max(0.1, H * v)} opacity={i === 0 ? 1 : 0.55} /> : <rect className="fig-guide" x={x - 18} y={base - H} width={36} height={H} fill="none" />}
                <Label x={x} y={base + 18} kind="label">{name}</Label>
              </g>
            ))}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ mass and stiffness, combinations

export function MassCompare() {
  return (
    <Anim title="A heavier block swings more slowly on the same spring, and a stiffer spring makes the same block swing faster" height={235} loop={8}>
      {(t) => {
        const rows: { y: number; w: number; bw: number; bh: number; coils: number; label: string }[] = [
          { y: 50, w: TAU, bw: 34, bh: 28, coils: 9, label: 'm, k: period T' },
          { y: 118, w: Math.PI, bw: 56, bh: 40, coils: 9, label: '4m, k: period 2T' },
          { y: 186, w: 2 * TAU, bw: 34, bh: 28, coils: 15, label: 'm, 4k: period T/2' },
        ];
        const eq = 330;
        return (
          <g>
            <Line x1={eq} y1={14} x2={eq} y2={225} tone="soft" dashed />
            {rows.map((r) => (
              <g key={r.label}>
                <Row y={r.y} bx={eq + 70 * Math.sin(r.w * t)} bw={r.bw} bh={r.bh} coils={r.coils} />
                <Label x={W - 14} y={r.y - 24} kind="label" anchor="end">{r.label}</Label>
              </g>
            ))}
          </g>
        );
      }}
    </Anim>
  );
}

export function SpringCombos() {
  return (
    <Anim title="Two identical springs joined end to end make a softer spring that swings slowly; side by side they make a stiffer one that swings fast" height={235} loop={9.5}>
      {(t) => {
        const ws = 2.2, wp = 4.4;
        const eq = 380, wall = 30;
        const ys = 62, yp = 170;
        const bs = eq + 45 * Math.sin(ws * t);
        const bp = eq + 45 * Math.sin(wp * t);
        const j = (wall + bs - 20) / 2;
        return (
          <g>
            <Label x={W - 14} y={ys - 36} kind="label" anchor="end">in series: k_eff = k / 2, slower</Label>
            <Wall x={wall} y1={ys - 28} y2={ys + 28} />
            <Spring x1={wall} y1={ys} x2={j - 4} y2={ys} coils={6} />
            <circle className="kit-block" cx={j} cy={ys} r={4} />
            <Spring x1={j + 4} y1={ys} x2={bs - 20} y2={ys} coils={6} />
            <Block x={bs} y={ys} w={40} h={34} label="m" />
            <Ground y={ys + 17} x1={wall} x2={W - 16} hatch={false} />
            <Label x={W - 14} y={yp - 50} kind="label" anchor="end">in parallel: k_eff = 2 k, faster</Label>
            <Wall x={wall} y1={yp - 46} y2={yp + 46} />
            <Spring x1={wall} y1={yp - 18} x2={bp - 20} y2={yp - 18} coils={9} />
            <Spring x1={wall} y1={yp + 18} x2={bp - 20} y2={yp + 18} coils={9} />
            <Block x={bp} y={yp} w={40} h={64} label="m" />
            <Ground y={yp + 32} x1={wall} x2={W - 16} hatch={false} />
            <Line x1={eq} y1={14} x2={eq} y2={226} tone="soft" dashed />
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ pendulums

export function PendulumForces() {
  return (
    <Anim title="Weight of the pendulum bob split into a part along the string and a part along the path; the part along the path always pulls back to the middle" height={250} loop={7.2}>
      {(t) => {
        const th = 0.7 * Math.cos((TAU * t) / 3.6);
        const px = 230, py = 26, L = 170;
        const s = Math.sin(th), c = Math.cos(th);
        const bx = px + L * s, by = py + L * c;
        const F = 62;
        const stage = phase(t, 0.2, 1.2);
        return (
          <g>
            <Line x1={px - 30} y1={py} x2={px + 30} y2={py} tone="bright" />
            <Line x1={px} y1={py} x2={px} y2={py + L} tone="soft" dashed />
            <Line x1={px} y1={py} x2={bx} y2={by} />
            <Ball x={bx} y={by} r={9} />
            <Arrow x1={bx} y1={by} x2={bx} y2={by + F} label="mg" />
            <Arrow x1={bx} y1={by} x2={bx + F * c * (-s) * stage} y2={by + F * s * s * stage} tone="bright" dashed={false} />
            <Arrow x1={bx} y1={by} x2={bx + F * c * s * stage} y2={by + F * c * c * stage} tone="soft" dashed />
            <Label x={420} y={90} kind="sym" anchor="start">F = −m g sin θ</Label>
            <Label x={420} y={116} kind="label" anchor="start">bright arrow: restoring part</Label>
            <Label x={420} y={140} kind="label" anchor="start">dashed arrow: along string</Label>
            <Label x={420} y={164} kind="val" anchor="start">{`θ = ${((th * 180) / Math.PI).toFixed(0)}°`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function SinApprox() {
  return (
    <Anim title="For small angles the sine of the angle is almost equal to the angle itself; the gap grows as the angle gets larger" height={240} loop={8}>
      {(t) => {
        const x0 = 70, y0 = 215, sx = 330, sy = 120;
        const th = 1.45 * (0.5 - 0.5 * Math.cos((TAU * t) / 8));
        const X = (a: number) => x0 + a * sx;
        const err = th > 0.001 ? ((th - Math.sin(th)) / Math.sin(th)) * 100 : 0;
        return (
          <g>
            <Axes x={x0} y={y0} w={530} h={190} xLabel="θ (rad)" />
            <Trail points={curve(60, 1.5, (a) => [X(a), y0 - sy * Math.sin(a)] as Pt)} />
            <Trail points={curve(2, 1.5, (a) => [X(a), y0 - sy * a] as Pt)} tone="soft" dashed />
            <Line x1={X(th)} y1={y0 - sy * th} x2={X(th)} y2={y0 - sy * Math.sin(th)} tone="bright" />
            <Ball x={X(th)} y={y0 - sy * Math.sin(th)} r={5} />
            <Ball x={X(th)} y={y0 - sy * th} r={4} ghost />
            <Key x={X(1.2) + 30} y={y0 - 20} name="sin θ" />
            <Key x={X(1.2) + 30} y={y0 - 40} name="θ" tone="soft" dashed />
            <Label x={90} y={50} kind="val" anchor="start">{`θ = ${th.toFixed(2)} rad  (${((th * 180) / Math.PI).toFixed(0)}°)`}</Label>
            <Label x={90} y={72} kind="val" anchor="start">{`θ is ${err.toFixed(1)}% above sin θ`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export interface PendulumSpec {
  L: number;
  theta0: number;
  r?: number;
  label?: string;
  g?: number;
}

/** Several pendulums swinging side by side by the exact equation, with an optional x–t strip below. */
export function Pendulums({ title, items, graph, height, loop = 12, readout, pxPerM = 150, ghosts }: { title: string; items: PendulumSpec[]; graph?: boolean; height?: number; loop?: number; readout?: boolean; pxPerM?: number; ghosts?: boolean }) {
  const H = height ?? (graph ? 300 : 225);
  const n = items.length;
  return (
    <Anim title={title} height={H} loop={loop}>
      {(t) => {
        const gy = H - 48;
        return (
          <g>
            {items.map((it, i) => {
              const px = n === 1 ? 320 : 120 + ((W - 240) * i) / (n - 1);
              const py = 26;
              const L = it.L * pxPerM;
              const w2 = (it.g ?? 9.8) / it.L;
              const th = swing(it.theta0, w2)(t);
              const bx = px + L * Math.sin(th), by = py + L * Math.cos(th);
              const r = it.r ?? 10;
              return (
                <g key={i}>
                  <Line x1={px - 24} y1={py} x2={px + 24} y2={py} tone="bright" />
                  <Line x1={px} y1={py} x2={px} y2={py + L} tone="soft" dashed />
                  {ghosts && (
                    <g>
                      <Ball x={px + L * Math.sin(it.theta0)} y={py + L * Math.cos(it.theta0)} r={r} ghost />
                      <Ball x={px - L * Math.sin(it.theta0)} y={py + L * Math.cos(it.theta0)} r={r} ghost />
                    </g>
                  )}
                  <Line x1={px} y1={py} x2={bx} y2={by} />
                  <Ball x={bx} y={by} r={r} />
                  {it.label && <Label x={px} y={py + L + 36} kind="label">{it.label}</Label>}
                </g>
              );
            })}
            {graph && (
              <g>
                <Axes x={40} y={gy} w={W - 70} h={32} below={32} xLabel="t" />
                {items.map((it, i) => {
                  const f = swing(it.theta0, (it.g ?? 9.8) / it.L);
                  const pts = curve(120, 8, (u) => [W - 40 - u * ((W - 90) / 8), gy - 28 * (f(t - u) / it.theta0)] as Pt);
                  return <Trail key={i} points={pts} tone={i === 0 ? 'bright' : 'soft'} dashed={i > 0} />;
                })}
              </g>
            )}
            {readout && <Readout>{`t = ${t.toFixed(1)} s`}</Readout>}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ damping

export function Damped() {
  return (
    <Anim title="A block on a spring swings with smaller and smaller amplitude, and its graph stays inside a decaying envelope" height={240} loop={9}>
      {(t) => {
        const w = TAU, gam = 0.5;
        const eq = 130, ym = 120;
        const gx = 270, pps = 55, A = 80;
        const tt = Math.min(t, 6);
        const bx = eq + 75 * Math.exp(-gam * t) * Math.cos(w * t);
        return (
          <g>
            <Line x1={eq} y1={ym - 56} x2={eq} y2={ym + 40} tone="soft" dashed />
            <Row y={ym} bx={bx} />
            <Axes x={gx} y={ym} w={350} h={A + 14} below={A + 14} xLabel="t" yLabel="x" />
            <Trail points={curve(60, 6, (u) => [gx + u * pps, ym - A * Math.exp(-gam * u)] as Pt)} tone="soft" dashed />
            <Trail points={curve(60, 6, (u) => [gx + u * pps, ym + A * Math.exp(-gam * u)] as Pt)} tone="soft" dashed />
            {tt > 0.02 && <Trail points={curve(140, tt, (u) => [gx + u * pps, ym - A * Math.exp(-gam * u) * Math.cos(w * u)] as Pt)} />}
            <Ball x={gx + tt * pps} y={ym - A * Math.exp(-gam * tt) * Math.cos(w * tt)} r={5} />
            <Label x={gx + 120} y={36} kind="label" anchor="start">envelope: A e^(−γ t)</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function DampTypes() {
  return (
    <Anim title="Light damping gives a decaying wave, critical damping returns to zero fastest without overshooting, and heavy damping creeps back slowly" height={240} loop={9}>
      {(t) => {
        const w = 5, x0 = 50, y0 = 130, A = 75, pps = 80;
        const tt = Math.min(t, 6.5);
        const under = (u: number) => {
          const z = 0.1;
          const wd = w * Math.sqrt(1 - z * z);
          return Math.exp(-z * w * u) * (Math.cos(wd * u) + (z / Math.sqrt(1 - z * z)) * Math.sin(wd * u));
        };
        const crit = (u: number) => (1 + w * u) * Math.exp(-w * u);
        const over = (u: number) => {
          const z = 2, d = Math.sqrt(z * z - 1);
          const l1 = w * (z - d), l2 = w * (z + d);
          return (l2 * Math.exp(-l1 * u) - l1 * Math.exp(-l2 * u)) / (l2 - l1);
        };
        const fs: [(u: number) => number, 'bright' | 'soft', boolean | undefined, string][] = [
          [under, 'bright', undefined, 'light damping'],
          [crit, 'soft', undefined, 'critical damping'],
          [over, 'soft', true, 'heavy damping'],
        ];
        return (
          <g>
            <Axes x={x0} y={y0} w={W - 70} h={A + 15} below={A + 20} xLabel="t" yLabel="x" />
            {fs.map(([f, tone, dashed, name], i) => (
              <g key={name}>
                {tt > 0.02 && <Trail points={curve(130, tt, (u) => [x0 + u * pps, y0 - A * f(u)] as Pt)} tone={tone} dashed={dashed} />}
                <Ball x={x0 + tt * pps} y={y0 - A * f(tt)} r={4.5} ghost={i > 0} />
                <Key x={W - 190} y={34 + 20 * i} name={name} tone={tone} dashed={dashed} />
              </g>
            ))}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ forced oscillations and resonance

const gain = (r: number, z: number) => 1 / Math.sqrt((1 - r * r) ** 2 + (2 * z * r) ** 2);

export function ResonanceCurve() {
  return (
    <Anim title="Amplitude of a driven oscillator against driving frequency: a tall peak where the driving frequency equals the natural frequency, lower and wider when damping is heavier" height={262} loop={10}>
      {(t) => {
        const x0 = 60, y0 = 225, sx = 270, sy = 34;
        const r = 0.1 + 1.8 * ease(phase(t, 0.6, 8.5));
        const X = (q: number) => x0 + q * sx;
        const light = (q: number) => y0 - sy * gain(q, 0.1);
        const pts = (z: number) => curve(180, 2, (q) => [X(q), y0 - sy * gain(q, z)] as Pt);
        return (
          <g>
            <Axes x={x0} y={y0} w={550} h={200} xLabel="driving frequency" yLabel="A" />
            <Line x1={X(1)} y1={y0} x2={X(1)} y2={36} tone="soft" dashed />
            <Label x={X(1)} y={y0 + 18} kind="sym">f₀</Label>
            <Trail points={pts(0.1)} />
            <Trail points={pts(0.3)} tone="soft" />
            <Line x1={X(r)} y1={y0} x2={X(r)} y2={light(r)} tone="soft" dashed />
            <Ball x={X(r)} y={light(r)} r={6} />
            <Key x={W - 190} y={60} name="light damping" />
            <Key x={W - 190} y={80} name="heavy damping" tone="soft" />
            <Readout x={W - 14} y={40}>{`f = ${r.toFixed(2)} f₀`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Blocks pushed by a moving support at different driving frequencies (ratio to natural frequency). */
export function Driven({ title, ratios, height, zeta = 0.1 }: { title: string; ratios: number[]; height?: number; zeta?: number }) {
  const H = height ?? ratios.length * 85 + 10;
  return (
    <Anim title={title} height={H} loop={9}>
      {(t) => {
        const w0 = TAU, d = 7;
        const eq = 340;
        return (
          <g>
            {ratios.map((r, i) => {
              const y = 48 + i * 85 - (ratios.length === 1 ? 6 : 0);
              const Om = r * w0;
              const Hh = gain(r, zeta);
              const delta = Math.atan2(2 * zeta * r, 1 - r * r);
              const grow = 1 - Math.exp(-zeta * w0 * t);
              const wall = 50 + d * Math.sin(Om * t);
              const bx = eq + d * Hh * grow * Math.sin(Om * t - delta);
              return (
                <g key={r}>
                  <Line x1={eq - d * Hh} y1={y - 24} x2={eq - d * Hh} y2={y + 24} tone="soft" dashed />
                  <Line x1={eq + d * Hh} y1={y - 24} x2={eq + d * Hh} y2={y + 24} tone="soft" dashed />
                  <Wall x={wall} y1={y - 24} y2={y + 24} />
                  <Spring x1={wall} y1={y} x2={bx - 18} y2={y} coils={10} />
                  <Block x={bx} y={y} w={36} h={30} />
                  <Ground y={y + 15} x1={wall} x2={W - 16} hatch={false} />
                  <Label x={W - 14} y={y - 26} kind="label" anchor="end">{`driver at ${r} f₀: amplitude up to ${Hh.toFixed(1)} d`}</Label>
                </g>
              );
            })}
            <Readout x={W - 14} y={H - 6}>{`t = ${t.toFixed(1)} s`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

