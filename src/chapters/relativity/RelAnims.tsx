import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Block, Ground, Label, Line, Readout, Trail, ease, phase, W } from '../kit/Anim';

/** Animated diagrams for special relativity. Speeds are drawn in pixels per second, with c as a round number. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

const Sub = ({ children }: { children: string }) => (
  <tspan baselineShift="sub" fontSize="0.7em">
    {children}
  </tspan>
);

/** A group that fades in between times a and b. */
const Fade = ({ t, a, b = a + 0.6, children }: { t: number; a: number; b?: number; children: ReactNode }) => <g opacity={ease(phase(t, a, b))}>{children}</g>;

const gamma = (b: number) => 1 / Math.sqrt(1 - b * b);

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

/** A triangle wave between 0 and 1 with the given period. */
const tri = (t: number, period: number) => {
  const p = (((t % period) + period) % period) / period;
  return p < 0.5 ? 2 * p : 2 - 2 * p;
};

// ------------------------------------------------------------------ a ball and a light flash

export function LightVsBall({ height = 230 }: { height?: number }) {
  return (
    <Anim title="A train moves along. A ball thrown forward from the train is seen from the ground to move at the sum of the speeds, but a flash of light from the train still moves at the speed of light, never faster" height={height} loop={6.5}>
      {(t) => {
        const y1 = 78;
        const y2 = 175;
        const cx = 70 + 30 * t;
        const front = cx + 50;
        const e = 0.6;
        const k = Math.max(0, t - e);
        const front0 = 70 + 30 * e + 50;
        const ball = front0 + 90 * k;
        const lightX = front0 + 240 * k;
        const ghost = front0 + 270 * k;
        return (
          <g>
            <Label x={16} y={28} kind="label" anchor="start">ball thrown forward: the speeds add</Label>
            <Ground y={y1 + 22} x1={16} x2={W - 16} hatch={false} />
            <Block x={cx} y={y1} w={100} h={36} />
            {t >= e && <Ball x={ball} y={y1 - 4} r={6} />}
            <Arrow x1={front + 8} y1={y1 - 38} x2={front + 8 + 28} y2={y1 - 38} tone="soft" label="u" />
            <Label x={16} y={125} kind="label" anchor="start">flash of light: still c, not c + u</Label>
            <Ground y={y2 + 22} x1={16} x2={W - 16} hatch={false} />
            <Block x={cx} y={y2} w={100} h={36} />
            {t >= e && lightX < W - 12 && <Ball x={lightX} y={y2 - 4} r={5} />}
            {t >= e && ghost < W - 12 && <Ball x={ghost} y={y2 - 4} r={5} ghost />}
            <Fade t={t} a={3.2}>
              <Label x={W - 16} y={y2 + 52} kind="label" anchor="end">the hollow dot never happens</Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the light clock

export function LightClock() {
  return (
    <Anim title="A light clock is a flash bouncing between two mirrors. When the clock moves sideways, the flash must travel a longer slanting path between the mirrors, so each tick takes longer" height={250} loop={8}>
      {(t) => {
        const L = 70;
        const top = 64;
        const bot = top + L;
        const v = 42;
        const restPhase = tri(t, 2);
        const ry = bot - L * restPhase;
        const x0 = 215;
        const mx = x0 + v * t;
        const my = bot - L * tri(t, 2.5);
        const ticksRest = Math.floor(t / 2);
        const ticksMov = Math.floor(t / 2.5);
        // The zigzag path so far.
        const pts: Pt[] = [];
        const step = 0.05;
        for (let s = 0; s <= t; s += step) pts.push([x0 + v * s, bot - L * tri(s, 2.5)]);
        pts.push([mx, my]);
        return (
          <g>
            <Label x={62} y={28} kind="label">clock at rest</Label>
            <Line x1={36} y1={top} x2={88} y2={top} tone="bright" />
            <Line x1={36} y1={bot} x2={88} y2={bot} tone="bright" />
            <Ball x={62} y={ry} r={5} />
            <Arrow x1={104} y1={bot} x2={104} y2={top} tone="soft" dashed />
            <Label x={62} y={bot + 50} kind="val">ticks {ticksRest}</Label>
            <Line x1={140} y1={20} x2={140} y2={235} tone="soft" dashed />
            <Label x={mx} y={28} kind="label">same clock, moving</Label>
            <Line x1={mx - 26} y1={top} x2={mx + 26} y2={top} tone="bright" />
            <Line x1={mx - 26} y1={bot} x2={mx + 26} y2={bot} tone="bright" />
            <Trail points={pts} tone="soft" />
            <Ball x={mx} y={my} r={5} />
            <Label x={mx} y={bot + 50} kind="val">ticks {ticksMov}</Label>
            <Fade t={t} a={0.3}>
              <Line x1={x0 - 44} y1={bot} x2={x0 - 44} y2={top} tone="soft" dashed />
              <Label x={x0 - 58} y={(top + bot) / 2 + 7} kind="sym" anchor="end">L</Label>
              <Label x={x0 + 26} y={bot + 20} kind="sym" anchor="start">v t</Label>
              <Label x={x0 + 4} y={top - 10} kind="sym" anchor="end">c t</Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ two clocks

function Dial({ x, y, r = 30, turns }: { x: number; y: number; r?: number; turns: number }) {
  const a = TAU * turns;
  const marks = [];
  for (let i = 0; i < 12; i++) {
    const q = (TAU * i) / 12;
    marks.push(<Line key={i} x1={x + (r - 5) * Math.sin(q)} y1={y - (r - 5) * Math.cos(q)} x2={x + r * Math.sin(q)} y2={y - r * Math.cos(q)} tone="soft" />);
  }
  return (
    <g>
      <circle className="fig-guide" cx={x} cy={y} r={r} fill="none" />
      {marks}
      <Line x1={x} y1={y} x2={x + (r - 8) * Math.sin(a)} y2={y - (r - 8) * Math.cos(a)} tone="bright" />
      <Ball x={x} y={y} r={2.5} glow={false} />
    </g>
  );
}

export function ClockCompare({ beta = 0.8, height = 240 }: { beta?: number; height?: number }) {
  const g = gamma(beta);
  return (
    <Anim title={`A clock at rest on a station and an identical clock on a ship moving at ${beta} of the speed of light; the moving clock's hand goes round more slowly`} height={height} loop={10}>
      {(t) => {
        const sx = 60 + 480 * (t / 10);
        const rate = 1 / g;
        return (
          <g>
            <Readout>station clock: {t.toFixed(1)} s</Readout>
            <rect className="kit-block" x={30} y={30} width={60} height={60} rx={4} />
            <Dial x={60} y={60} turns={t / 5} />
            <Label x={110} y={66} kind="label" anchor="start">at rest on the station</Label>
            {[0, 1, 2].map((i) => (
              <Line key={i} x1={sx - 70 - i * 18} y1={168 + i * 8 - 8} x2={sx - 52 - i * 18 + beta * 10} y2={168 + i * 8 - 8} tone="soft" />
            ))}
            <rect className="kit-block" x={sx - 30} y={138} width={60} height={60} rx={4} />
            <Dial x={sx} y={168} turns={(t * rate) / 5} />
            <Label x={Math.min(Math.max(sx, 90), W - 90)} y={128} kind="label">ship at {beta} c</Label>
            <Label x={W - 16} y={height - 10} kind="val" anchor="end">ship clock: {(t * rate).toFixed(1)} s</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the Lorentz factor

export function GammaGraph() {
  return (
    <Anim title="A graph of the Lorentz factor against speed as a fraction of the speed of light: it is close to 1 for everyday speeds, then climbs steeply as the speed approaches c" height={250} loop={9}>
      {(t) => {
        const ox = 70;
        const oy = 215;
        const wx = 480;
        const hy = 170;
        const X = (b: number) => ox + wx * b;
        const Y = (gm: number) => oy - ((gm - 1) / 6) * hy;
        const b = 0.985 * ease(phase(t, 0.5, 7));
        const pts = curve(120, 0.99, (s) => [X(s), Y(gamma(s))]);
        return (
          <g>
            <Axes x={ox} y={oy} w={wx + 20} h={hy + 10} yLabel="γ" />
            <Label x={ox + wx + 28} y={oy + 6} kind="sym" anchor="start">v / c</Label>
            {[0, 0.5, 1].map((q) => (
              <g key={q}>
                <Line x1={X(q)} y1={oy} x2={X(q)} y2={oy + 5} tone="soft" />
                <Label x={X(q)} y={oy + 20} kind="val">{q}</Label>
              </g>
            ))}
            <Line x1={X(1)} y1={oy} x2={X(1)} y2={oy - hy - 4} tone="soft" dashed />
            <Trail points={pts} />
            {[0.6, 0.8, 0.9].map((q) => (
              <Fade key={q} t={b} a={q - 0.02} b={q}>
                <Line x1={X(q)} y1={oy} x2={X(q)} y2={Y(gamma(q))} tone="soft" dashed />
                <Ball x={X(q)} y={Y(gamma(q))} r={3} glow={false} />
                <Label x={X(q) - 8} y={Y(gamma(q)) - 8} kind="val" anchor="end">{gamma(q).toFixed(2)}</Label>
              </Fade>
            ))}
            <Ball x={X(b)} y={Y(gamma(b))} r={5.5} />
            <Label x={110} y={22} kind="val" anchor="start">v = {b.toFixed(2)} c</Label>
            <Label x={110} y={42} kind="val" anchor="start">γ = {gamma(b).toFixed(2)}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ length contraction

export function LengthContraction({ beta = 0.8, height = 240 }: { beta?: number; height?: number }) {
  return (
    <Anim title="A ship at rest has its full length; the same ship moving fast past you is measured shorter along the direction of motion, while its height does not change" height={height} loop={8}>
      {(t) => {
        const L0 = 300;
        const b = beta * (0.5 - 0.5 * Math.cos((TAU * t) / 8));
        const L = L0 / gamma(b);
        const cx = 300;
        const yTop = 72;
        const yMov = 165;
        const ticks = (len: number, y: number) =>
          Array.from({ length: 11 }, (_, i) => <Line key={i} x1={cx - len / 2 + (len * i) / 10} y1={y - 20} x2={cx - len / 2 + (len * i) / 10} y2={y - 12} tone="soft" />);
        const sweep = tri(t, 4);
        return (
          <g>
            <Label x={16} y={26} kind="label" anchor="start">at rest: full length <tspan>L</tspan><Sub>0</Sub></Label>
            <rect className="kit-block" x={cx - L0 / 2} y={yTop - 20} width={L0} height={40} rx={4} />
            {ticks(L0, yTop)}
            <Ball x={cx - L0 / 2 + 6 + (L0 - 12) * sweep} y={yTop + 6} r={4} />
            <Label x={16} y={122} kind="label" anchor="start">moving: shorter</Label>
            {[0, 1, 2].map((i) => {
              const off = (((t * 90 + i * 40) % 120) + 120) % 120;
              return <Line key={i} x1={cx - L / 2 - 20 - off * b * 1.1} y1={yMov - 10 + i * 10} x2={cx - L / 2 - 34 - off * b * 1.1 - 40 * b} y2={yMov - 10 + i * 10} tone="soft" />;
            })}
            <rect className="kit-block" x={cx - L / 2} y={yMov - 20} width={L} height={40} rx={4} />
            {ticks(L, yMov)}
            <Label x={W - 16} y={26} kind="val" anchor="end">v = {b.toFixed(2)} c</Label>
            <Label x={cx + L0 / 2 + 12} y={yMov + 5} kind="label" anchor="start">same height</Label>
            <Label x={cx} y={height - 14} kind="val">L = {(L / L0).toFixed(2)} L₀</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ simultaneity

export function Simultaneity() {
  return (
    <Anim title="A lamp in the middle of a train flashes. On the train, light reaches both end walls at the same moment. Seen from the ground, the back wall moves toward the light and the front wall runs away from it, so the back wall is hit first" height={300} loop={6.5}>
      {(t) => {
        const c = 100;
        const v = 40;
        const half = 100;
        const e = 1;
        const k = Math.max(0, t - e);
        const y1 = 78;
        const y2 = 218;
        const ring = (x: number, y: number, t0: number, key: string) => {
          const p = phase(t, t0, t0 + 0.7);
          return p > 0 && p < 1 ? <circle key={key} className="fig-guide" cx={x} cy={y} r={6 + 22 * p} fill="none" opacity={1 - p} /> : null;
        };
        // Train frame.
        const tc = 320;
        const tHit1 = e + half / c;
        // Ground frame.
        const X0 = 250;
        const xc = X0 + v * (t - e);
        const tBack = e + half / (c + v);
        const tFront = e + half / (c - v);
        const lx = X0 - c * k;
        const rx = X0 + c * k;
        return (
          <g>
            <Label x={16} y={26} kind="label" anchor="start">in the train's frame</Label>
            <Ground y={y1 + 26} x1={16} x2={W - 16} hatch={false} />
            <Line x1={tc - half} y1={y1 - 22} x2={tc - half} y2={y1 + 22} tone="bright" />
            <Line x1={tc + half} y1={y1 - 22} x2={tc + half} y2={y1 + 22} tone="bright" />
            <Line x1={tc - half} y1={y1 - 22} x2={tc + half} y2={y1 - 22} tone="soft" />
            <Line x1={tc - half} y1={y1 + 22} x2={tc + half} y2={y1 + 22} tone="soft" />
            <Ball x={tc} y={y1} r={4} glow={false} />
            {ring(tc, y1, e, 'a0')}
            {t >= e && t < tHit1 && <Ball x={tc - c * k} y={y1} r={4} />}
            {t >= e && t < tHit1 && <Ball x={tc + c * k} y={y1} r={4} />}
            {ring(tc - half, y1, tHit1, 'a1')}
            {ring(tc + half, y1, tHit1, 'a2')}
            <Fade t={t} a={tHit1 + 0.2}>
              <Label x={W - 16} y={26} kind="label" anchor="end">both walls at the same moment</Label>
            </Fade>
            <Label x={16} y={166} kind="label" anchor="start">in the ground's frame</Label>
            <Ground y={y2 + 26} x1={16} x2={W - 16} hatch={false} />
            <Line x1={xc - half} y1={y2 - 22} x2={xc - half} y2={y2 + 22} tone="bright" />
            <Line x1={xc + half} y1={y2 - 22} x2={xc + half} y2={y2 + 22} tone="bright" />
            <Line x1={xc - half} y1={y2 - 22} x2={xc + half} y2={y2 - 22} tone="soft" />
            <Line x1={xc - half} y1={y2 + 22} x2={xc + half} y2={y2 + 22} tone="soft" />
            <Ball x={xc} y={y2} r={4} glow={false} />
            {ring(X0, y2, e, 'b0')}
            {t >= e && t < tBack && <Ball x={lx} y={y2} r={4} />}
            {t >= e && t < tFront && <Ball x={rx} y={y2} r={4} />}
            {ring(xc - half, y2, tBack, 'b1')}
            {ring(xc + half, y2, tFront, 'b2')}
            <Fade t={t} a={tFront + 0.2}>
              <Label x={W - 16} y={166} kind="label" anchor="end">back wall first, front wall later</Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ muons

export function Muons() {
  return (
    <Anim title="A fast muon falls toward the ground. In the Earth's frame its clock runs slow, so it lasts long enough to arrive. In the muon's own frame its clock is normal, but the distance to the ground is contracted to a short one" height={270} loop={9}>
      {(t) => {
        const p = ease(phase(t, 0.8, 7));
        const pxkm = 55;
        const top = 34;
        const gy = top + 3.25 * pxkm;
        const my = top + 3.25 * pxkm * p;
        const mx = 80;
        // Muon frame.
        const bx = 470;
        const by = 100;
        const g0 = by + 0.647 * pxkm;
        const gyr = g0 - 0.647 * pxkm * p;
        return (
          <g>
            <Label x={170} y={20} kind="label">Earth's frame</Label>
            <Label x={470} y={20} kind="label">the muon's frame</Label>
            <Line x1={320} y1={10} x2={320} y2={260} tone="soft" dashed />
            <Ground y={gy} x1={20} x2={310} />
            <Line x1={mx} y1={top + 0.647 * pxkm} x2={310} y2={top + 0.647 * pxkm} tone="soft" dashed />
            <Fade t={t} a={0.4}>
              <Label x={306} y={top + 0.647 * pxkm - 6} kind="label" anchor="end">647 m: no time dilation</Label>
            </Fade>
            <Arrow x1={mx + 26} y1={my + 8} x2={mx + 26} y2={gy - 2} tone="soft" />
            <Label x={mx + 38} y={(my + gy) / 2 + 5} kind="val" anchor="start">{(3250 * (1 - p)).toFixed(0)} m</Label>
            <Ball x={mx} y={my} r={7} />
            <Label x={170} y={gy + 40} kind="val">Earth clock: {(11.06 * p).toFixed(1)} μs</Label>
            <Ground y={gyr} x1={330} x2={W - 10} />
            <Arrow x1={bx + 26} y1={by + 8} x2={bx + 26} y2={gyr - 2} tone="soft" />
            <Label x={bx + 38} y={(by + gyr) / 2 + 5} kind="val" anchor="start">{(647 * (1 - p)).toFixed(0)} m</Label>
            <circle className="fig-guide" cx={bx} cy={by} r={12 + 3 * Math.sin(TAU * t * 1.5)} fill="none" />
            <Ball x={bx} y={by} r={7} />
            <Label x={470} y={gy + 40} kind="val">muon clock: {(2.2 * p).toFixed(1)} μs</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ adding speeds

export function Addition({ height = 200 }: { height?: number }) {
  return (
    <Anim title="A ship moves at 0.6 c and fires a missile forward at 0.6 c relative to itself. Adding the speeds would give 1.2 c, faster than a light flash. In fact the missile moves at 0.88 c and a flash of light still stays ahead" height={height} loop={6.5}>
      {(t) => {
        const e = 0.8;
        const k = Math.max(0, t - e);
        const sx = 50 + 60 * t;
        const front0 = 50 + 60 * e + 35;
        const yShip = 138;
        const photon = front0 + 100 * k;
        const missile = front0 + 88.2 * k;
        const ghost = front0 + 120 * k;
        const ok = (x: number) => t >= e && x < W - 10;
        return (
          <g>
            <Fade t={t} a={0.2}>
              <Ball x={24} y={20} r={4} glow={false} />
              <Label x={36} y={25} kind="label" anchor="start">light flash: c</Label>
              <Ball x={24} y={42} r={4} glow={false} />
              <Label x={36} y={47} kind="label" anchor="start">missile: 0.88 c</Label>
              <Ball x={24} y={64} r={4} ghost />
              <Label x={36} y={69} kind="label" anchor="start">adding speeds: 1.2 c, impossible</Label>
            </Fade>
            <Ground y={yShip + 22} x1={16} x2={W - 16} hatch={false} />
            <Block x={sx} y={yShip} w={70} h={28} />
            <Label x={sx} y={yShip + 46} kind="label">ship 0.6 c</Label>
            {ok(photon) && <Ball x={photon} y={yShip - 42} r={4} />}
            {ok(missile) && <Ball x={missile} y={yShip - 20} r={5} />}
            {ok(ghost) && <Ball x={ghost} y={yShip - 1} r={4} ghost />}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ matter into light

export function Annihilation() {
  return (
    <Anim title="An electron and a positron meet and vanish. Their rest energy, mass times c squared, leaves as two photons, each carrying 0.511 megaelectronvolts" height={210} loop={7.5}>
      {(t) => {
        const y = 100;
        const q = ease(phase(t, 0.3, 2.2));
        const xe = 60 + 260 * q;
        const xp = 580 - 260 * q;
        const out = ease(phase(t, 2.3, 5.2));
        const flash = phase(t, 2.2, 3.0);
        const wave = (dir: number) => curve(60, 250 * out, (s) => [320 + dir * s, y + 8 * Math.sin(s / 7 - 12 * t) * Math.min(1, s / 20)]);
        return (
          <g>
            {t < 2.3 && (
              <g>
                <Ball x={xe} y={y} r={9} />
                <Label x={xe} y={y - 22} kind="sym">e⁻</Label>
                <Ball x={xp} y={y} r={9} ghost />
                <Label x={xp} y={y - 22} kind="sym">e⁺</Label>
              </g>
            )}
            {flash > 0 && flash < 1 && <circle className="fig-guide" cx={320} cy={y} r={10 + 60 * flash} fill="none" opacity={1 - flash} />}
            {t >= 2.2 && t < 3 && <Ball x={320} y={y} r={14 * (1 - flash)} />}
            {out > 0 && (
              <g>
                <Trail points={wave(-1)} />
                <Trail points={wave(1)} />
                <Ball x={320 - 250 * out} y={y} r={4} />
                <Ball x={320 + 250 * out} y={y} r={4} />
              </g>
            )}
            <Fade t={t} a={4}>
              <Label x={170} y={y + 44} kind="val">0.511 MeV</Label>
              <Label x={470} y={y + 44} kind="val">0.511 MeV</Label>
              <Label x={170} y={y - 26} kind="sym">γ</Label>
              <Label x={470} y={y - 26} kind="sym">γ</Label>
            </Fade>
            <Fade t={t} a={4.6}>
              <Label x={320} y={190} kind="sym">e⁻ + e⁺ → γ + γ</Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ kinetic energy against speed

export function EnergySpeed({ height = 250 }: { height?: number }) {
  return (
    <Anim title="A graph of kinetic energy against speed. The old formula half m v squared rises gently, but the true kinetic energy climbs without limit as the speed approaches the speed of light" height={height} loop={8}>
      {(t) => {
        const ox = 70;
        const oy = 215;
        const wx = 480;
        const unit = 56.7;
        const X = (b: number) => ox + wx * b;
        const Yc = (b: number) => oy - 0.5 * b * b * unit;
        const Yr = (b: number) => oy - (gamma(b) - 1) * unit;
        const b = 0.965 * ease(phase(t, 0.5, 6.5));
        return (
          <g>
            <Axes x={ox} y={oy} w={wx + 20} h={hFor(unit)} yLabel="K" />
            <Label x={ox + wx + 28} y={oy + 6} kind="sym" anchor="start">v / c</Label>
            <Line x1={X(1)} y1={oy} x2={X(1)} y2={30} tone="soft" dashed />
            <Label x={X(1)} y={22} kind="val">v = c</Label>
            <Trail points={curve(60, 1, (s) => [X(s), Yc(s)])} tone="soft" dashed />
            <Trail points={curve(140, 0.968, (s) => [X(s), Yr(s)])} />
            <Label x={300} y={Yc(0.55) - 14} kind="label" anchor="start">classical ½mv²</Label>
            <Label x={240} y={92} kind="label" anchor="start">true: (γ − 1) m c²</Label>
            <Line x1={X(b)} y1={oy} x2={X(b)} y2={Yr(b)} tone="soft" dashed />
            <Ball x={X(b)} y={Yc(b)} r={4} glow={false} />
            <Ball x={X(b)} y={Yr(b)} r={5.5} />
            <Label x={110} y={22} kind="val" anchor="start">v = {b.toFixed(2)} c</Label>
            <Label x={110} y={42} kind="val" anchor="start">K = {(gamma(b) - 1).toFixed(2)} mc²</Label>
          </g>
        );
      }}
    </Anim>
  );
}
const hFor = (unit: number) => 3 * unit + 8;

// ------------------------------------------------------------------ E squared = (pc) squared + (mc squared) squared

export function EnergyTriangle({ height = 230 }: { height?: number }) {
  return (
    <Anim title="A right triangle with the rest energy m c squared as one side and the momentum term p c as the other; the total energy E is the long side, and it grows as the momentum grows" height={height} loop={8}>
      {(t) => {
        const unit = 62;
        const ax = 70;
        const ay = height - 40;
        const pc = 2 * (0.5 - 0.5 * Math.cos((TAU * t) / 8));
        const rx = ax + unit;
        const ty = ay - pc * unit;
        const E = Math.sqrt(1 + pc * pc);
        const len = Math.hypot(rx - ax, ty - ay);
        const dx = (rx - ax) / len;
        const dy = (ty - ay) / len;
        const mx = (ax + rx) / 2;
        const my = (ay + ty) / 2;
        return (
          <g>
            <Line x1={ax} y1={ay} x2={rx} y2={ay} tone="bright" />
            <Line x1={rx} y1={ay} x2={rx} y2={ty} tone="soft" />
            <Line x1={ax} y1={ay} x2={rx} y2={ty} tone="bright" />
            <Ball x={rx} y={ty} r={4.5} />
            <Label x={mx} y={ay + 24} kind="sym">m c²</Label>
            <Label x={rx + 12} y={(ay + ty) / 2 + 7} kind="sym" anchor="start">p c</Label>
            <Label x={mx + 24 * dy} y={my - 24 * dx + 6} kind="sym">E</Label>
            <Label x={250} y={60} kind="val" anchor="start">p c = {pc.toFixed(2)} mc²</Label>
            <Label x={250} y={84} kind="val" anchor="start">E = {E.toFixed(2)} mc²</Label>
            <Label x={250} y={108} kind="val" anchor="start">K = E − mc² = {(E - 1).toFixed(2)} mc²</Label>
            <Label x={250} y={140} kind="label" anchor="start">E² = (p c)² + (m c²)²</Label>
          </g>
        );
      }}
    </Anim>
  );
}
