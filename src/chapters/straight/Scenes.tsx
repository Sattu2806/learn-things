import { Anim, Arrow, Ball, Block, Ground, Label, Line, Readout, Trail, Wall, clamp, ease, lerp, phase } from '../kit/Anim';
import type { ReactNode } from 'react';

/** Animated diagrams for the straight-line motion chapter. Positions are worked out from the real physics. */

const G = 9.8;
const sg = (n: number, d = 1) => (n < 0 ? '−' : '') + Math.abs(n).toFixed(d);
const sgp = (n: number, d = 1) => (n < 0 ? '−' : '+') + Math.abs(n).toFixed(d);

// ------------------------------------------------------------------ graph helpers

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  t1: number;
  lo: number;
  hi: number;
}
const px = (b: Box, t: number) => b.x + (b.w * t) / b.t1;
const py = (b: Box, v: number) => b.y + b.h * (1 - (v - b.lo) / (b.hi - b.lo));
const sample = (b: Box, f: (t: number) => number, t0: number, t1: number, n = 70): [number, number][] => {
  const out: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = lerp(t0, t1, i / n);
    out.push([px(b, t), py(b, f(t))]);
  }
  return out;
};

/** Axes with the time axis on the zero line, a title, and end-value ticks. */
function Plot({ b, name, xt, yt }: { b: Box; name: string; xt?: [number, string][]; yt?: [number, string][] }) {
  const y0 = py(b, Math.max(b.lo, 0));
  const bottom = b.y + b.h;
  return (
    <g>
      <Line x1={b.x} y1={bottom} x2={b.x} y2={b.y - 4} tone="soft" />
      <Line x1={b.x} y1={y0} x2={b.x + b.w} y2={y0} tone="soft" />
      <Label x={b.x} y={b.y - 12} kind="val" anchor="start">
        {name}
      </Label>
      {(xt ?? []).map(([t, s]) => (
        <g key={s}>
          <Line x1={px(b, t)} y1={y0 - 3} x2={px(b, t)} y2={y0 + 3} tone="soft" />
          <Label x={px(b, t)} y={bottom + 16} kind="val">
            {s}
          </Label>
        </g>
      ))}
      {(yt ?? []).map(([v, s]) => (
        <g key={s}>
          <Line x1={b.x - 3} y1={py(b, v)} x2={b.x + 3} y2={py(b, v)} tone="soft" />
          <Label x={b.x - 7} y={py(b, v) + 4} kind="val" anchor="end">
            {s}
          </Label>
        </g>
      ))}
    </g>
  );
}

function areaPath(b: Box, f: (t: number) => number, t0: number, t1: number) {
  if (t1 <= t0 + 1e-6) return '';
  const pts = sample(b, f, t0, t1, 60);
  const y0 = py(b, 0);
  return `M${px(b, t0).toFixed(1)} ${y0.toFixed(1)}` + pts.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join('') + `L${px(b, t1).toFixed(1)} ${y0.toFixed(1)}Z`;
}

// ------------------------------------------------------------------ motion profiles

export interface Prof {
  T: number;
  x: (t: number) => number;
  v: (t: number) => number;
  a: (t: number) => number;
  xMin: number;
  xMax: number;
  vMin: number;
  vMax: number;
  aMin: number;
  aMax: number;
}

/** Piecewise constant acceleration: a list of (duration, acceleration) stages. */
export function makeProf(segs: { d: number; a: number }[], v0 = 0, x0 = 0): Prof {
  const st: { t0: number; v: number; x: number; a: number; d: number }[] = [];
  let t = 0;
  let v = v0;
  let x = x0;
  for (const s of segs) {
    st.push({ t0: t, v, x, a: s.a, d: s.d });
    x += v * s.d + 0.5 * s.a * s.d * s.d;
    v += s.a * s.d;
    t += s.d;
  }
  const T = t;
  const at = (tt: number) => {
    const c = clamp(tt, 0, T);
    return st.find((s) => c < s.t0 + s.d) ?? st[st.length - 1];
  };
  const xf = (tt: number) => {
    const s = at(tt);
    const d = clamp(tt, 0, T) - s.t0;
    return s.x + s.v * d + 0.5 * s.a * d * d;
  };
  const vf = (tt: number) => {
    const s = at(tt);
    return s.v + s.a * (clamp(tt, 0, T) - s.t0);
  };
  const af = (tt: number) => (tt >= T ? 0 : at(tt).a);
  const ts = Array.from({ length: 121 }, (_, i) => (T * i) / 120);
  const xs = ts.map(xf);
  const vs = ts.map(vf);
  return {
    T,
    x: xf,
    v: vf,
    a: af,
    xMin: Math.min(...xs),
    xMax: Math.max(...xs),
    vMin: Math.min(...vs),
    vMax: Math.max(...vs),
    aMin: Math.min(...segs.map((s) => s.a)),
    aMax: Math.max(...segs.map((s) => s.a)),
  };
}

/** The car's journey used in several diagrams: speed up, cruise, brake. */
export const JOURNEY = makeProf([
  { d: 4, a: 2 },
  { d: 4, a: 0 },
  { d: 2, a: -4 },
]);

type Key = 'x' | 'v' | 'a';
const NAME: Record<Key, string> = { x: 'x (m)', v: 'v (m/s)', a: 'a (m/s²)' };

interface MotionProps {
  title: string;
  prof: Prof;
  graphs: Key[];
  /** Scene seconds per real second. */
  rate?: number;
  height?: number;
  fillV?: boolean;
  tangents?: boolean;
  note?: (s: number) => string;
  /** Ruler range and tick spacing, in metres. */
  range?: [number, number];
  step?: number;
  vScale?: number;
  aScale?: number;
  /** Extra axis ticks, per graph. */
  ticks?: Partial<Record<Key, { x?: [number, string][]; y?: [number, string][] }>>;
}

/** A car on a ruler with velocity and acceleration arrows, and graphs that draw themselves beside it. */
export function MotionScene({ title, prof, graphs, rate = 1, height, fillV, tangents, note, range, step = 10, vScale = 4, aScale = 14, ticks }: MotionProps) {
  const H = height ?? (graphs.length ? 320 : 150);
  const [r0, r1] = range ?? [prof.xMin, prof.xMax];
  const mx = (x: number) => 44 + (552 * (x - r0)) / (r1 - r0);
  const loop = prof.T / rate + 2.2;
  const n = graphs.length;
  const gap = 46;
  const gw = n ? (556 - gap * (n - 1)) / n : 0;
  const ext: Record<Key, [number, number]> = {
    x: [Math.min(0, prof.xMin), prof.xMax * 1.08 || 1],
    v: [Math.min(0, prof.vMin * 1.15), Math.max(prof.vMax * 1.15, 0.5)],
    a: [Math.min(0, prof.aMin * 1.3), Math.max(prof.aMax * 1.3, 0.5)],
  };
  const fn: Record<Key, (t: number) => number> = { x: prof.x, v: prof.v, a: prof.a };
  return (
    <Anim title={title} height={H} loop={loop} stillAt={prof.T / rate}>
      {(t) => {
        const s = Math.min(t * rate, prof.T);
        const x = prof.x(s);
        const v = prof.v(s);
        const a = prof.a(s);
        const cx = mx(x);
        const ticksRow: ReactNode[] = [];
        for (let m = Math.ceil(r0 / step) * step; m <= r1 + 1e-6; m += step) {
          ticksRow.push(
            <g key={m}>
              <Line x1={mx(m)} y1={82} x2={mx(m)} y2={89} tone="soft" />
              <Label x={mx(m)} y={104} kind="val">
                {m}
              </Label>
            </g>,
          );
        }
        return (
          <g>
            <Ground y={82} x1={30} x2={610} hatch={false} />
            {ticksRow}
            <Block x={cx} y={70} w={34} h={20} filled />
            <Arrow x1={cx} y1={44} x2={cx + vScale * v} y2={44} label="v" />
            <Arrow x1={cx} y1={124} x2={cx + aScale * a} y2={124} tone="soft" label="a" />
            {note && (
              <Label x={12} y={18} kind="val" anchor="start">
                {note(s)}
              </Label>
            )}
            <Readout>{`t = ${s.toFixed(1)} s`}</Readout>
            {graphs.map((k, i) => {
              const b: Box = { x: 44 + i * (gw + gap), y: 176, w: gw, h: 106, t1: prof.T, lo: ext[k][0], hi: ext[k][1] };
              const f = fn[k];
              const tk = ticks?.[k];
              const slopeOf = k === 'x' ? prof.v : k === 'v' ? prof.a : null;
              const px0 = px(b, s);
              const py0 = py(b, f(s));
              const m = slopeOf ? slopeOf(s) : 0;
              // tangent segment, in data space, drawn in pixels
              const dt = prof.T * 0.12;
              const tan: [number, number][] = [
                [px(b, s - dt), py(b, f(s) - m * dt)],
                [px(b, s + dt), py(b, f(s) + m * dt)],
              ];
              return (
                <g key={k}>
                  <Plot b={b} name={NAME[k]} xt={tk?.x ?? [[prof.T, String(Math.round(prof.T)) + ' s']]} yt={tk?.y} />
                  <Trail points={sample(b, f, 0, prof.T, 90)} tone="faint" />
                  {fillV && k === 'v' && <path className="fig-cell is-lit" d={areaPath(b, f, 0, s)} />}
                  <Trail points={sample(b, f, 0, s, 90)} />
                  {tangents && slopeOf && <Trail points={tan} dashed tone="soft" />}
                  <Ball x={px0} y={py0} r={4.5} glow={false} />
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ position, distance and displacement

export function PathScene({ title, out = 8, end = 3, height = 190 }: { title: string; out?: number; end?: number; height?: number }) {
  const x0 = 50;
  const k = 45;
  const mx = (x: number) => x0 + (x + 2) * k;
  const t1 = out / 2.5;
  const t2 = t1 + 0.5;
  const t3 = t2 + Math.abs(out - end) / 2.5;
  return (
    <Anim title={title} height={height} loop={t3 + 2.4} stillAt={t3}>
      {(t) => {
        let p: number;
        let dist: number;
        if (t < t1) {
          p = t * 2.5;
          dist = p;
        } else if (t < t2) {
          p = out;
          dist = out;
        } else {
          const d = Math.min((t - t2) * 2.5, Math.abs(out - end));
          p = out + Math.sign(end - out) * d;
          dist = out + d;
        }
        const goingBack = t >= t2;
        const ticks: ReactNode[] = [];
        for (let m = -2; m <= 10; m += 2)
          ticks.push(
            <g key={m}>
              <Line x1={mx(m)} y1={110} x2={mx(m)} y2={117} tone="soft" />
              <Label x={mx(m)} y={133} kind="val">
                {m}
              </Label>
            </g>,
          );
        const outEnd = Math.min(p, out);
        return (
          <g>
            <Ground y={110} x1={30} x2={610} hatch={false} />
            {ticks}
            <Ball x={mx(0)} y={98} ghost />
            <Label x={mx(0)} y={80} kind="val">
              start
            </Label>
            <Arrow x1={mx(0)} y1={64} x2={mx(p)} y2={64} label="Δx" labelAt="mid" />
            <Ball x={mx(p)} y={98} />
            <Line x1={mx(0)} y1={152} x2={mx(outEnd)} y2={152} tone="bright" />
            {goingBack && <Line x1={mx(out)} y1={166} x2={mx(p)} y2={166} tone="bright" />}
            <Label x={12} y={20} kind="val" anchor="start">
              {`distance = ${dist.toFixed(1)} m`}
            </Label>
            <Label x={12} y={40} kind="val" anchor="start">
              {`displacement = ${sgp(p, 1)} m`}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ slope of x–t

/** x = t² on a graph: a chord for the average velocity, shrinking toward the tangent for the instantaneous one. */
export function SecantScene({ title, mode }: { title: string; mode: 'avg' | 'shrink' }) {
  const b: Box = { x: 70, y: 28, w: 330, h: 214, t1: 5, lo: 0, hi: 25 };
  const f = (t: number) => t * t;
  const loop = mode === 'avg' ? 7 : 9;
  return (
    <Anim title={title} height={278} loop={loop} stillAt={loop - 1}>
      {(t) => {
        const t0 = mode === 'avg' ? 1 : 2.5;
        const h = mode === 'avg' ? 2.5 : lerp(2.4, 0.02, ease(phase(t, 0.6, 6)));
        const t2 = t0 + h;
        const m = (f(t2) - f(t0)) / h;
        const ta = Math.max(0, t0 - f(t0) / m);
        const tb = Math.min(5, t0 + (25 - f(t0)) / m);
        const show = mode === 'avg' ? ease(phase(t, 0.4, 1.4)) : 1;
        const rise = mode === 'avg' ? phase(t, 1.6, 2.6) : 0;
        const settled = mode === 'shrink' && h < 0.05;
        return (
          <g>
            <Plot b={b} name="x (m)" xt={[[5, '5 s']]} yt={[[25, '25']]} />
            <Trail points={sample(b, f, 0, 5, 80)} />
            {show > 0 && <Trail points={[[px(b, ta), py(b, f(t0) + m * (ta - t0))], [px(b, tb), py(b, f(t0) + m * (tb - t0))]]} tone={settled ? 'bright' : 'soft'} dashed={!settled} />}
            {mode === 'avg' && (
              <g opacity={rise > 0 ? 1 : 0}>
                <Line x1={px(b, t0)} y1={py(b, f(t0))} x2={lerp(px(b, t0), px(b, t2), rise)} y2={py(b, f(t0))} tone="bright" />
                <Line x1={px(b, t2)} y1={py(b, f(t0))} x2={px(b, t2)} y2={lerp(py(b, f(t0)), py(b, f(t2)), phase(t, 2.4, 3.4))} tone="bright" />
                <Label x={(px(b, t0) + px(b, t2)) / 2} y={py(b, f(t0)) + 18} kind="val">
                  Δt
                </Label>
                <Label x={px(b, t2) + 8} y={(py(b, f(t0)) + py(b, f(t2))) / 2 + 4} kind="val" anchor="start">
                  Δx
                </Label>
              </g>
            )}
            <Ball x={px(b, t0)} y={py(b, f(t0))} r={4.5} glow={false} />
            <Ball x={px(b, t2)} y={py(b, f(t2))} r={4.5} glow={false} />
            <Label x={430} y={90} kind="val" anchor="start">
              {`Δt = ${h.toFixed(2)} s`}
            </Label>
            <Label x={430} y={114} kind="val" anchor="start">
              {`Δx = ${(f(t2) - f(t0)).toFixed(2)} m`}
            </Label>
            <Label x={430} y={146} kind="val" anchor="start">
              {`Δx/Δt = ${m.toFixed(2)} m/s`}
            </Label>
            {settled && (
              <Label x={430} y={178} kind="label" anchor="start">
                the tangent: v = 5 m/s
              </Label>
            )}
            {mode === 'avg' && phase(t, 3.6, 4.4) > 0 && (
              <Label x={430} y={178} kind="label" anchor="start">
                average velocity
              </Label>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ v–t trapezoid

export function TrapScene({ title }: { title: string }) {
  const u = 2;
  const A = 1.5;
  const T = 4;
  const v1 = u + A * T;
  const b: Box = { x: 62, y: 30, w: 360, h: 216, t1: 5, lo: 0, hi: 10 };
  const f = (t: number) => u + A * t;
  return (
    <Anim title={title} height={284} loop={10.5} stillAt={9}>
      {(t) => {
        const line = phase(t, 0.2, 1.8);
        const rect = phase(t, 2.2, 3.4);
        const tri = phase(t, 4, 5.4);
        const x0 = px(b, 0);
        const yb = py(b, 0);
        const xe = px(b, T);
        return (
          <g>
            <Plot b={b} name="v (m/s)" xt={[[T, 't']]} yt={[[u, 'u'], [v1, 'v']]} />
            <Line x1={px(b, T)} y1={py(b, v1)} x2={px(b, T)} y2={yb} tone="soft" dashed />
            <Line x1={b.x} y1={py(b, v1)} x2={px(b, T)} y2={py(b, v1)} tone="soft" dashed />
            {rect > 0 && <rect className="fig-cell is-lit" x={x0} y={py(b, u)} width={(xe - x0) * rect} height={yb - py(b, u)} />}
            {tri > 0 && <path className="fig-cell" d={`M${x0} ${py(b, u)}L${lerp(x0, xe, tri)} ${py(b, u)}L${lerp(x0, xe, tri)} ${py(b, f(lerp(0, T, tri)))}Z`} />}
            <Trail points={sample(b, f, 0, T * line, 30)} />
            {phase(t, 3, 3.6) > 0 && (
              <Label x={(x0 + xe) / 2} y={(py(b, u) + yb) / 2 + 5} kind="val">
                u · t
              </Label>
            )}
            {phase(t, 4.8, 5.4) > 0 && (
              <Label x={(x0 + xe) / 2 + 40} y={(py(b, u) + py(b, v1)) / 2 + 24} kind="val">
                ½ · a · t²
              </Label>
            )}
            {phase(t, 4, 4.8) > 0 && (
              <g>
                <Arrow x1={xe + 12} y1={py(b, u)} x2={xe + 12} y2={py(b, v1)} tone="soft" />
                <Label x={xe + 22} y={(py(b, u) + py(b, v1)) / 2 + 4} kind="val" anchor="start">
                  a · t
                </Label>
              </g>
            )}
            {phase(t, 1.6, 2.2) > 0 && (
              <Label x={448} y={70} kind="val" anchor="start">
                v = u + a · t
              </Label>
            )}
            {phase(t, 5.6, 6.4) > 0 && (
              <Label x={448} y={106} kind="val" anchor="start">
                area = displacement
              </Label>
            )}
            {phase(t, 6.4, 7.2) > 0 && (
              <Label x={448} y={142} kind="val" anchor="start">
                s = u·t + ½·a·t²
              </Label>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ free fall

export function ThrowScene({ title, graph = true, height = 300 }: { title: string; graph?: boolean; height?: number }) {
  const u = 14.7;
  const T = (2 * u) / G;
  const Hm = (u * u) / (2 * G);
  const gy = height - 28;
  const sc = (gy - 66) / Hm;
  const bx = graph ? 170 : 320;
  const b: Box = { x: 400, y: 56, w: 200, h: height - 120, t1: T, lo: -15, hi: 15 };
  return (
    <Anim title={title} height={height} loop={T + 2.6} stillAt={T * 0.5}>
      {(t) => {
        const s = Math.min(t, T);
        const v = u - G * s;
        const h = u * s - 0.5 * G * s * s;
        const by = gy - h * sc;
        const ticks: ReactNode[] = [];
        for (const m of [0, 5, 10]) {
          ticks.push(
            <g key={m}>
              <Line x1={bx - 94} y1={gy - m * sc} x2={bx - 86} y2={gy - m * sc} tone="soft" />
              <Label x={bx - 100} y={gy - m * sc + 4} kind="val" anchor="end">
                {m} m
              </Label>
            </g>,
          );
        }
        return (
          <g>
            <Ground y={gy} x1={bx - 120} x2={graph ? 330 : 520} />
            <Line x1={bx - 90} y1={gy} x2={bx - 90} y2={gy - 11.5 * sc} tone="soft" />
            {ticks}
            <Line x1={bx - 60} y1={gy - Hm * sc} x2={bx + 60} y2={gy - Hm * sc} tone="faint" dashed />
            <Ball x={bx} y={by} />
            <Arrow x1={bx + 26} y1={by} x2={bx + 26} y2={by - 3.4 * v} label="v" />
            <Arrow x1={bx - 26} y1={by} x2={bx - 26} y2={by + 3} tone="soft" label="g" />
            {graph ? (
              <g>
                <Label x={12} y={20} kind="val" anchor="start">
                  {`t = ${s.toFixed(1)} s`}
                </Label>
                <Label x={12} y={38} kind="val" anchor="start">
                  {`v = ${sg(v, 1)} m/s`}
                </Label>
                <Label x={12} y={56} kind="val" anchor="start">
                  {`h = ${h.toFixed(1)} m`}
                </Label>
                <Plot b={b} name="v (m/s)" xt={[[T / 2, '1.5 s'], [T, '3 s']]} yt={[[u, '14.7'], [-u, '−14.7']]} />
                <Line x1={px(b, T / 2)} y1={py(b, 0)} x2={px(b, T / 2)} y2={py(b, u)} tone="faint" dashed />
                <Trail points={sample(b, (q) => u - G * q, 0, T, 30)} tone="faint" />
                <Trail points={sample(b, (q) => u - G * q, 0, s, 30)} />
                <Ball x={px(b, s)} y={py(b, v)} r={4.5} glow={false} />
              </g>
            ) : (
              <g>
                <Readout>{`t = ${s.toFixed(1)} s`}</Readout>
                {Math.abs(v) < 1.1 && (
                  <Label x={bx + 42} y={by + 5} kind="val" anchor="start">
                    v = 0, but a = 9.8 m/s² down
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

// ------------------------------------------------------------------ stopping distance

export function StopScene({ title, v = 20, rt = 0.75, a = 7, height = 230 }: { title: string; v?: number; rt?: number; a?: number; height?: number }) {
  const dr = v * rt;
  const db = (v * v) / (2 * a);
  const total = dr + db;
  const Tt = rt + v / a;
  const xMax = Math.ceil((total + 6) / 10) * 10;
  const mx = (x: number) => 40 + (560 * x) / xMax;
  return (
    <Anim title={title} height={height} loop={Tt + 2.6} stillAt={Tt}>
      {(t) => {
        const s = Math.min(t, Tt);
        let p: number;
        let sp: number;
        if (s < rt) {
          p = v * s;
          sp = v;
        } else {
          const d = s - rt;
          p = dr + v * d - 0.5 * a * d * d;
          sp = v - a * d;
        }
        const ticks: ReactNode[] = [];
        for (let m = 0; m <= xMax; m += 10)
          ticks.push(
            <g key={m}>
              <Line x1={mx(m)} y1={104} x2={mx(m)} y2={111} tone="soft" />
              <Label x={mx(m)} y={126} kind="val">
                {m}
              </Label>
            </g>,
          );
        const rEnd = Math.min(p, dr);
        const done = s >= Tt;
        return (
          <g>
            <Ground y={104} x1={30} x2={610} hatch={false} />
            {ticks}
            <Wall x={mx(total + 4.5)} y1={46} y2={104} side={1} />
            <Block x={mx(p) - 18} y={91} w={36} h={20} filled />
            <Arrow x1={mx(p) - 18} y1={64} x2={mx(p) - 18 + 3 * sp} y2={64} label="v" />
            <Label x={12} y={18} kind="val" anchor="start">
              {s < rt ? `reaction time: still at ${v.toFixed(1)} m/s` : sp > 0.01 ? `braking: a = −${a} m/s²` : 'stopped'}
            </Label>
            <Readout>{`t = ${s.toFixed(1)} s`}</Readout>
            <rect className="fig-cell is-lit" x={mx(0)} y={146} width={Math.max(0, mx(rEnd) - mx(0))} height={12} />
            {p > dr && <rect className="fig-cell" x={mx(dr)} y={146} width={mx(p) - mx(dr)} height={12} />}
            {s >= rt && (
              <Label x={(mx(0) + mx(dr)) / 2} y={184} kind="val">
                {`reaction ${dr.toFixed(1)} m`}
              </Label>
            )}
            {done && (
              <g>
                <Label x={(mx(dr) + mx(total)) / 2} y={204} kind="val">
                  {`braking ${db.toFixed(1)} m`}
                </Label>
                <Label x={mx(total)} y={224} kind="val" anchor="end">
                  {`stopping distance ${total.toFixed(1)} m`}
                </Label>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

/** Several cars braking side by side, to compare their stopping distances. */
export function StopLanes({ title, speeds, rt, a, height = 222 }: { title: string; speeds: number[]; rt: number; a: number; height?: number }) {
  const rows = speeds.map((v) => ({ v, dr: v * rt, db: (v * v) / (2 * a), T: rt + v / a }));
  const maxTotal = Math.max(...rows.map((r) => r.dr + r.db));
  const Tmax = Math.max(...rows.map((r) => r.T));
  const xMax = Math.ceil((maxTotal + 5) / 10) * 10;
  const mx = (x: number) => 40 + (560 * x) / xMax;
  return (
    <Anim title={title} height={height} loop={Tmax + 2.6} stillAt={Tmax}>
      {(t) => {
        const ticks: ReactNode[] = [];
        for (let m = 0; m <= xMax; m += 10)
          ticks.push(
            <g key={m}>
              <Line x1={mx(m)} y1={height - 30} x2={mx(m)} y2={height - 24} tone="soft" />
              <Label x={mx(m)} y={height - 8} kind="val">
                {m}
              </Label>
            </g>,
          );
        return (
          <g>
            <Line x1={30} y1={height - 30} x2={610} y2={height - 30} tone="soft" />
            {ticks}
            {rows.map((r, i) => {
              const s = Math.min(t, r.T);
              const top = 8 + i * 82;
              let p: number;
              if (s < rt) p = r.v * s;
              else {
                const d = s - rt;
                p = r.dr + r.v * d - 0.5 * a * d * d;
              }
              const done = s >= r.T;
              return (
                <g key={i}>
                  <Label x={12} y={top + 14} kind="val" anchor="start">
                    {`${r.v.toFixed(1)} m/s`}
                  </Label>
                  <Ground y={top + 52} x1={30} x2={610} hatch={false} />
                  <Block x={mx(p) - 16} y={top + 40} w={32} h={18} filled />
                  <rect className="fig-cell is-lit" x={mx(0)} y={top + 60} width={Math.max(0, mx(Math.min(p, r.dr)) - mx(0))} height={9} />
                  {p > r.dr && <rect className="fig-cell" x={mx(r.dr)} y={top + 60} width={mx(p) - mx(r.dr)} height={9} />}
                  {done && (
                    <Label x={mx(r.dr + r.db) + 8} y={top + 69} kind="val" anchor="start">
                      {`${(r.dr + r.db).toFixed(1)} m`}
                    </Label>
                  )}
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ relative motion

export function RelScene({ title }: { title: string }) {
  const vA = 20;
  const vB = 15;
  const gap0 = 40;
  const T = 8;
  const k = 2.9;
  const mx = (x: number) => 40 + k * x;
  const L = 30;
  return (
    <Anim title={title} height={262} loop={T + 2.6} stillAt={T}>
      {(t) => {
        const s = Math.min(t, T);
        const xa = vA * s;
        const xb = gap0 + vB * s;
        const gap = gap0 - (vA - vB) * s;
        return (
          <g>
            <Label x={12} y={20} kind="val" anchor="start">
              seen from the road
            </Label>
            <Ground y={100} x1={30} x2={610} hatch={false} />
            <Block x={mx(xa) - L / 2} y={88} w={L} h={18} filled />
            <Block x={mx(xb) + L / 2} y={88} w={L} h={18} />
            <Arrow x1={mx(xa) - L / 2} y1={60} x2={mx(xa) - L / 2 + 2 * vA} y2={60} label="A" />
            <Arrow x1={mx(xb) + L / 2} y1={38} x2={mx(xb) + L / 2 + 2 * vB} y2={38} tone="soft" label="B" />
            <Label x={12} y={150} kind="val" anchor="start">
              seen from car B (B at rest)
            </Label>
            <Ground y={232} x1={30} x2={610} hatch={false} />
            <Block x={420 + L / 2} y={220} w={L} h={18} />
            <Block x={420 - k * gap - L / 2} y={220} w={L} h={18} filled />
            <Arrow x1={420 - k * gap - L / 2} y1={190} x2={420 - k * gap - L / 2 + 4 * (vA - vB)} y2={190} label="A" />
            <Label x={420 - (k * gap) / 2} y={250} kind="val">
              {`gap ${gap.toFixed(0)} m`}
            </Label>
            <Readout>{`t = ${s.toFixed(1)} s`}</Readout>
            <Label x={606} y={150} kind="val" anchor="end">
              A closes in at 5 m/s
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ cliff example

export function CliffScene({ title }: { title: string }) {
  const u = 15;
  const y0 = 40;
  const T = (u + Math.sqrt(u * u + 2 * G * y0)) / G;
  const sc = 5;
  const top = 108;
  const gy = top + y0 * sc;
  const bx = 204;
  const b: Box = { x: 372, y: 40, w: 230, h: 240, t1: 5, lo: -40, hi: 15 };
  const f = (q: number) => u * q - 0.5 * G * q * q;
  return (
    <Anim title={title} height={322} loop={T + 3} stillAt={T}>
      {(t) => {
        const s = Math.min(t, T);
        const h = f(s);
        const v = u - G * s;
        const by = top - h * sc;
        return (
          <g>
            <Ground y={gy} x1={0} x2={330} />
            <path className="fig-cliff" d={`M0 ${top}L${bx - 18} ${top}L${bx - 18} ${gy}L0 ${gy}Z`} />
            <Line x1={bx} y1={top} x2={bx} y2={gy} tone="faint" dashed />
            <Label x={bx - 100} y={(top + gy) / 2} kind="val">
              40 m
            </Label>
            <Arrow x1={bx - 70} y1={top + 14} x2={bx - 70} y2={gy - 6} tone="soft" />
            <Ball x={bx} y={by} />
            <Arrow x1={bx + 22} y1={by} x2={bx + 22} y2={by - 2.2 * v} label="v" />
            <Readout x={332} y={20}>{`t = ${s.toFixed(1)} s`}</Readout>
            <Plot b={b} name="y (m), up from the cliff top" xt={[[T, '4.77 s']]} yt={[[-40, '−40'], [11.5, '11.5']]} />
            <Trail points={sample(b, f, 0, T, 70)} tone="faint" />
            <Trail points={sample(b, f, 0, s, 70)} />
            <Ball x={px(b, s)} y={py(b, h)} r={4.5} glow={false} />
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ reading a v–t graph

const VT: [number, number][] = [
  [0, 0],
  [2, 10],
  [5, 10],
  [7, -4],
];
const vtf = (t: number) => {
  for (let i = 0; i < VT.length - 1; i++) {
    const [ta, va] = VT[i];
    const [tb, vb] = VT[i + 1];
    if (t <= tb) return va + ((vb - va) * (t - ta)) / (tb - ta);
  }
  return VT[VT.length - 1][1];
};
export const VT_ZERO = 5 + 10 / 7;

export function VtAreaScene({ title }: { title: string }) {
  const b: Box = { x: 60, y: 30, w: 380, h: 226, t1: 7.5, lo: -6, hi: 12 };
  const regions: { a: number; c: number; start: number; label: string; pos: boolean }[] = [
    { a: 0, c: 2, start: 0.6, label: '+10 m', pos: true },
    { a: 2, c: 5, start: 2, label: '+30 m', pos: true },
    { a: 5, c: VT_ZERO, start: 3.8, label: '+7.14 m', pos: true },
    { a: VT_ZERO, c: 7, start: 5.2, label: '−1.14 m', pos: false },
  ];
  return (
    <Anim title={title} height={290} loop={11} stillAt={9.5}>
      {(t) => (
        <g>
          <Plot b={b} name="v (m/s)" xt={[[2, '2 s'], [5, '5 s'], [7, '7 s']]} yt={[[10, '10'], [-4, '−4']]} />
          {regions.map((r, i) => {
            const cut = lerp(r.a, r.c, phase(t, r.start, r.start + 1.2));
            return <path key={i} className={r.pos ? 'fig-cell is-lit' : 'fig-cell'} d={areaPath(b, vtf, r.a, cut)} />;
          })}
          <Trail points={VT.map(([a, c]) => [px(b, a), py(b, c)] as [number, number])} />
          {regions.map((r, i) =>
            phase(t, r.start + 1, r.start + 1.6) > 0 ? (
              <Label key={i} x={462} y={70 + i * 26} kind="val" anchor="start">
                {r.label}
              </Label>
            ) : null,
          )}
          {phase(t, 6.8, 7.4) > 0 && (
            <Label x={462} y={188} kind="val" anchor="start">
              displ. +46.0 m
            </Label>
          )}
          {phase(t, 7.8, 8.4) > 0 && (
            <Label x={462} y={214} kind="val" anchor="start">
              distance 48.3 m
            </Label>
          )}
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ two runners meeting

export function MeetScene({ title }: { title: string }) {
  const b: Box = { x: 60, y: 160, w: 340, h: 124, t1: 12, lo: 0, hi: 100 };
  const xa = (s: number) => 6 * s;
  const xb = (s: number) => 100 - 4 * s;
  const mx = (x: number) => 44 + 5.52 * x;
  return (
    <Anim title={title} height={326} loop={14.5} stillAt={11}>
      {(t) => {
        const s = Math.min(t, 12);
        const ticks: ReactNode[] = [];
        for (let m = 0; m <= 100; m += 20)
          ticks.push(
            <g key={m}>
              <Line x1={mx(m)} y1={86} x2={mx(m)} y2={93} tone="soft" />
              <Label x={mx(m)} y={110} kind="val">
                {m}
              </Label>
            </g>,
          );
        const met = s >= 10;
        return (
          <g>
            <Ground y={86} x1={30} x2={610} hatch={false} />
            {ticks}
            <Ball x={mx(xa(s))} y={70} />
            <Arrow x1={mx(xa(s))} y1={46} x2={mx(xa(s)) + 6 * 6} y2={46} label="A" />
            <Ball x={mx(xb(s))} y={70} ghost />
            <Arrow x1={mx(xb(s))} y1={22} x2={mx(xb(s)) - 4 * 6} y2={22} tone="soft" label="B" />
            <Readout>{`t = ${s.toFixed(1)} s`}</Readout>
            <Plot b={b} name="x (m)" xt={[[10, '10 s'], [12, '12 s']]} yt={[[60, '60'], [100, '100']]} />
            <Trail points={sample(b, xa, 0, 12, 2)} tone="faint" />
            <Trail points={sample(b, xb, 0, 12, 2)} tone="faint" dashed />
            <Trail points={sample(b, xa, 0, s, 2)} />
            <Trail points={sample(b, xb, 0, s, 2)} dashed />
            <Ball x={px(b, s)} y={py(b, xa(s))} r={4.5} glow={false} />
            <Ball x={px(b, s)} y={py(b, xb(s))} r={4.5} ghost />
            {met && (
              <g>
                <circle className="fig-ghost" cx={px(b, 10)} cy={py(b, 60)} r={10} />
                <Label x={px(b, 10) - 16} y={py(b, 60) - 14} kind="val" anchor="end">
                  meet
                </Label>
              </g>
            )}
            <Label x={430} y={200} kind="val" anchor="start">
              the lines cross
            </Label>
            <Label x={430} y={224} kind="val" anchor="start">
              at t = 10 s, x = 60 m
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ tiny mistake scenes

/** Two x–t lines: one high up but flat, one low but steep. */
export function SlopeHeightScene({ title }: { title: string }) {
  const b: Box = { x: 60, y: 28, w: 300, h: 124, t1: 5, lo: 0, hi: 10 };
  return (
    <Anim title={title} height={190} loop={6} stillAt={4}>
      {(t) => {
        const s = Math.min(t, 5);
        return (
          <g>
            <Plot b={b} name="x (m)" xt={[[5, '5 s']]} />
            <Trail points={[[px(b, 0), py(b, 8)], [px(b, s), py(b, 8)]]} dashed />
            <Trail points={[[px(b, 0), py(b, 0)], [px(b, s), py(b, 1.2 * s)]]} />
            <Ball x={px(b, s)} y={py(b, 8)} r={4.5} ghost />
            <Ball x={px(b, s)} y={py(b, 1.2 * s)} r={4.5} glow={false} />
            <Label x={b.x + 8} y={py(b, 8) - 9} kind="val" anchor="start">
              high, but flat: v = 0
            </Label>
            <Label x={px(b, 5) - 4} y={py(b, 1.2 * 5) + 40} kind="val" anchor="end">
              low, but steep: v = 1.2 m/s
            </Label>
            <Label x={392} y={90} kind="label" anchor="start">
              the slope is the
            </Label>
            <Label x={392} y={114} kind="label" anchor="start">
              velocity, not the height
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Up is positive, so g acts as −9.8: the right and wrong v–t lines for a ball thrown up at 10 m/s. */
export function SignScene({ title }: { title: string }) {
  const u = 10;
  const T = 2.1;
  const b: Box = { x: 60, y: 24, w: 300, h: 130, t1: T, lo: -12, hi: 32 };
  return (
    <Anim title={title} height={190} loop={5.5} stillAt={1.6}>
      {(t) => {
        const s = Math.min(t, T);
        const right = (q: number) => u - G * q;
        const wrong = (q: number) => u + G * q;
        return (
          <g>
            <Plot b={b} name="v (m/s)" xt={[[1.02, '1.02 s']]} yt={[[10, '10']]} />
            <Trail points={sample(b, wrong, 0, s, 20)} dashed tone="soft" />
            <Trail points={sample(b, right, 0, s, 20)} />
            <Ball x={px(b, s)} y={py(b, wrong(s))} r={4.5} ghost />
            <Ball x={px(b, s)} y={py(b, right(s))} r={4.5} glow={false} />
            <Label x={392} y={52} kind="val" anchor="start">
              v = u + g·t
            </Label>
            <Label x={392} y={72} kind="label" anchor="start">
              speeds up going up?
            </Label>
            <Label x={392} y={112} kind="val" anchor="start">
              v = u − g·t
            </Label>
            <Label x={392} y={132} kind="label" anchor="start">
              up is +, so a = −g
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** A turn-and-return trip: forward speeding up, forward braking, backward speeding up, backward braking. */
export const SIGNS = makeProf([
  { d: 3, a: 2 },
  { d: 3, a: -2 },
  { d: 3, a: -2 },
  { d: 3, a: 2 },
]);

/** A motion where the acceleration itself grows: x = t³/6, v = t²/2, a = t. */
export const CUBIC: Prof = {
  T: 6,
  x: (t) => (t * t * t) / 6,
  v: (t) => (t * t) / 2,
  a: (t) => t,
  xMin: 0,
  xMax: 36,
  vMin: 0,
  vMax: 18,
  aMin: 0,
  aMax: 6,
};
