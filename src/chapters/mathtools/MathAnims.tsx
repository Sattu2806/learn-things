import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Block, Ground, Label, Line, Trail, clamp, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for the mathematical tools. Positions come from the real functions, scaled to pixels. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

/** A little key: short line sample and a name. */
function Key({ x, y, name, tone = 'bright', dashed }: { x: number; y: number; name: string; tone?: 'bright' | 'soft'; dashed?: boolean }) {
  return (
    <g>
      <Line x1={x} y1={y - 4} x2={x + 22} y2={y - 4} tone={tone} dashed={dashed} />
      <Label x={x + 28} y={y} kind="label" anchor="start">
        {name}
      </Label>
    </g>
  );
}

// ------------------------------------------------------------------ a gallery of graphs

interface PanelSpec {
  name: ReactNode;
  f: (x: number) => number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

const PANELS: PanelSpec[] = [
  { name: 'y = x²', f: (x) => x * x, x0: -2, x1: 2, y0: 0, y1: 4 },
  { name: 'y = 1/x', f: (x) => 1 / x, x0: 0.25, x1: 4, y0: 0, y1: 4 },
  { name: 'y = sin x', f: (x) => Math.sin(x), x0: 0, x1: TAU, y0: -1, y1: 1 },
  { name: <>y = e<tspan baselineShift="super" fontSize="70%">−x</tspan></>, f: (x) => Math.exp(-x), x0: 0, x1: 3, y0: 0, y1: 1 },
];

export function Gallery() {
  return (
    <Anim title="Four common graphs, each traced out by a moving point: a parabola, a hyperbola, a sine wave and an exponential decay" height={262} loop={9}>
      {(t) => {
        const s = ease(phase(t, 0.3, 6.5));
        return (
          <g>
            {PANELS.map((p, i) => {
              const bx = 36 + (i % 2) * 310, by = 40 + Math.floor(i / 2) * 118, w = 260, h = 66;
              const X = (x: number) => bx + ((x - p.x0) / (p.x1 - p.x0)) * w;
              const Y = (y: number) => by + h - ((y - p.y0) / (p.y1 - p.y0)) * h;
              const xs = lerp(p.x0, p.x1, s);
              const pts = curve(80, 1, (u) => {
                const x = lerp(p.x0, xs, u);
                return [X(x), Y(p.f(x))];
              });
              const axY = Y(Math.max(0, p.y0)), axX = p.x0 < 0 ? X(0) : bx;
              return (
                <g key={i}>
                  <Line x1={bx} y1={axY} x2={bx + w + 6} y2={axY} tone="soft" />
                  <Line x1={axX} y1={by - 4} x2={axX} y2={by + h + 4} tone="soft" />
                  <Trail points={pts} />
                  <Ball x={X(xs)} y={Y(p.f(xs))} r={4.5} />
                  <Label x={bx + w / 2} y={by - 14} kind="label">{p.name}</Label>
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

export function LineParams() {
  return (
    <Anim title="A straight line y equals m x plus c: first the slope m grows while the intercept c stays fixed, then the intercept c rises while the slope stays fixed" height={235} loop={12}>
      {(t) => {
        const ox = 60, oy = 200, sx = 56, sy = 19;
        const X = (x: number) => ox + x * sx, Y = (y: number) => oy - y * sy;
        const a = ease(phase(t, 0.5, 4.5)), b = ease(phase(t, 6.5, 10.5));
        const m = 0.5 + 1.5 * a;
        const c = 0.5 + 2.5 * b;
        return (
          <g>
            <Axes x={ox} y={oy} w={380} h={180} xLabel="x" yLabel="y" />
            <Line x1={X(0)} y1={Y(0.5)} x2={X(5.5)} y2={Y(0.5 + 0.5 * 5.5)} tone="soft" dashed />
            <Line x1={X(0)} y1={Y(c)} x2={X(Math.min(5.5, (9 - c) / m))} y2={Y(c + m * Math.min(5.5, (9 - c) / m))} tone="bright" />
            <Ball x={X(0)} y={Y(c)} r={5} />
            <Label x={X(0) - 12} y={Y(c) + 6} kind="sym" anchor="end">c</Label>
            <Label x={470} y={90} kind="val" anchor="start">{`m = ${m.toFixed(2)}`}</Label>
            <Label x={470} y={114} kind="val" anchor="start">{`c = ${c.toFixed(2)}`}</Label>
            <Label x={470} y={146} kind="label" anchor="start">{t < 6 ? 'steeper: bigger m' : 'higher: bigger c'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ slope is a rate

const TRIP = [
  { t0: 0, t1: 3, x0: 0, x1: 12 },
  { t0: 3, t1: 5, x0: 12, x1: 12 },
  { t0: 5, t1: 8, x0: 12, x1: 6 },
];

const tripX = (s: number) => {
  const seg = TRIP.find((g) => s <= g.t1) ?? TRIP[2];
  return lerp(seg.x0, seg.x1, clamp((s - seg.t0) / (seg.t1 - seg.t0)));
};

export function SlopeMeaning() {
  return (
    <Anim title="A car drives out, waits and drives back while a graph of position against time is drawn: the slope is the velocity, steep and positive going out, flat when it waits, and negative coming back" height={262} loop={12}>
      {(t) => {
        const s = clamp(t - 0.6, 0, 8);
        const x = tripX(s);
        const gx = 70, gy = 238, sx = 45, sy = 10;
        const X = (tt: number) => gx + tt * sx, Y = (m: number) => gy - m * sy;
        const cur = TRIP.find((g) => s <= g.t1) ?? TRIP[2];
        const v = (cur.x1 - cur.x0) / (cur.t1 - cur.t0);
        const trail = curve(60, 1, (u) => [X(u * s), Y(tripX(u * s))]);
        return (
          <g>
            <Ground y={44} x1={60} x2={440} hatch={false} />
            <Block x={70 + x * 28} y={30} w={34} h={20} />
            <Label x={450} y={40} kind="label" anchor="start">car</Label>
            <Axes x={gx} y={gy} w={380} h={130} xLabel="t" yLabel="x" />
            <Trail points={trail} />
            <Ball x={X(s)} y={Y(x)} r={5} />
            {TRIP.map((g, i) => {
              if (s <= g.t0 + 0.05) return null;
              const e = Math.min(s, g.t1);
              const rise = lerp(g.x0, g.x1, clamp((e - g.t0) / (g.t1 - g.t0)));
              return (
                <g key={i}>
                  <Line x1={X(g.t0)} y1={Y(g.x0)} x2={X(e)} y2={Y(g.x0)} tone="soft" dashed />
                  {rise !== g.x0 && <Line x1={X(e)} y1={Y(g.x0)} x2={X(e)} y2={Y(rise)} tone="soft" dashed />}
                </g>
              );
            })}
            <Label x={490} y={96} kind="val" anchor="start">{`t = ${s.toFixed(1)} s`}</Label>
            <Label x={490} y={120} kind="val" anchor="start">{`x = ${x.toFixed(1)} m`}</Label>
            <Label x={490} y={146} kind="val" anchor="start">{`slope = ${v.toFixed(1)}`}</Label>
            <Label x={490} y={170} kind="label" anchor="start">{v > 0 ? 'going out' : v < 0 ? 'coming back' : 'waiting'}</Label>
            <Label x={490} y={194} kind="label" anchor="start">{`v = ${v.toFixed(1)} m/s`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the secant becomes the tangent

export function Secant() {
  return (
    <Anim title="A second point slides along the curve y equals x squared toward a fixed point: the line through the two points, the secant, tips over until it touches the curve at one point, the tangent, whose slope is the derivative" height={250} loop={11}>
      {(t) => {
        const ox = 60, oy = 222, sx = 58, sy = 22;
        const X = (x: number) => ox + x * sx, Y = (y: number) => oy - y * sy;
        const f = (x: number) => x * x;
        const x1 = 1;
        const h = 1.6 * Math.exp(-3.8 * ease(phase(t, 0.8, 7.5))) ;
        const x2 = x1 + h;
        const sl = (f(x2) - f(x1)) / h;
        const L = (x: number) => f(x1) + sl * (x - x1);
        const T = (x: number) => f(x1) + 2 * (x - x1);
        return (
          <g>
            <Axes x={ox} y={oy} w={400} h={200} xLabel="x" yLabel="y" />
            <Trail points={curve(60, 3, (x) => [X(x), Y(f(x))] as Pt).filter((p) => p[1] > 20)} tone="soft" />
            <Line x1={X(0.6)} y1={Y(T(0.6))} x2={X(2.6)} y2={Y(T(2.6))} tone="soft" dashed />
            <Line x1={X(0.7)} y1={Y(L(0.7))} x2={X(2.7)} y2={Y(L(2.7))} tone="bright" />
            <Line x1={X(x1)} y1={Y(f(x1))} x2={X(x2)} y2={Y(f(x1))} tone="soft" dashed />
            <Line x1={X(x2)} y1={Y(f(x1))} x2={X(x2)} y2={Y(f(x2))} tone="soft" dashed />
            <Ball x={X(x1)} y={Y(f(x1))} r={5} />
            <Ball x={X(x2)} y={Y(f(x2))} r={5} />
            <Label x={490} y={80} kind="val" anchor="start">{`Δx = ${h.toFixed(3)}`}</Label>
            <Label x={490} y={104} kind="val" anchor="start">{`Δy/Δx = ${sl.toFixed(3)}`}</Label>
            <Label x={490} y={134} kind="label" anchor="start">tangent: slope 2</Label>
            <Key x={486} y={166} name="secant" />
            <Key x={486} y={190} name="tangent" tone="soft" dashed />
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ f and its derivative

export function DerivTrace({ kind = 'sin' }: { kind?: 'sin' | 'square' }) {
  const sq = kind === 'square';
  return (
    <Anim title={sq ? 'A point moves along the parabola y equals x squared with its tangent, while below it the slope is plotted: a straight line y equals 2 x, twice the x' : 'A point moves along a sine wave with its tangent, while below it the slope is plotted: it traces a cosine wave'} height={262} loop={10}>
      {(t) => {
        const x0 = 70, w = 420;
        const xm = sq ? 2 : TAU;
        const f = sq ? (v: number) => v * v : Math.sin;
        const df = sq ? (v: number) => 2 * v : Math.cos;
        const x = xm * ease(phase(t, 0.5, 8));
        const X = (v: number) => x0 + (v / xm) * w;
        const ay = sq ? 122 : 72, as = sq ? 24 : 38;
        const by = sq ? 246 : 200, bs = sq ? 24 : 38;
        const F = (v: number) => ay - f(v) * as;
        const D = (v: number) => by - df(v) * bs;
        const slopePx = (-df(x) * as) / (w / xm);
        const len = 46 / Math.sqrt(1 + slopePx * slopePx);
        return (
          <g>
            <Line x1={x0} y1={ay} x2={x0 + w + 8} y2={ay} tone="soft" />
            <Line x1={x0} y1={sq ? ay - 100 : ay - 48} x2={x0} y2={sq ? ay + 6 : ay + 48} tone="soft" />
            <Line x1={x0} y1={by} x2={x0 + w + 8} y2={by} tone="soft" />
            <Line x1={x0} y1={sq ? by - 100 : by - 48} x2={x0} y2={sq ? by + 6 : by + 48} tone="soft" />
            <Trail points={curve(80, xm, (v) => [X(v), F(v)] as Pt)} tone="soft" />
            <Line x1={X(x) - len} y1={F(x) - slopePx * len} x2={X(x) + len} y2={F(x) + slopePx * len} tone="bright" />
            <Line x1={X(x)} y1={F(x)} x2={X(x)} y2={D(x)} tone="soft" dashed />
            <Trail points={curve(80, 1, (u) => [X(u * x), D(u * x)] as Pt)} />
            <Ball x={X(x)} y={F(x)} r={5} />
            <Ball x={X(x)} y={D(x)} r={5} />
            <Label x={x0 + w + 14} y={ay + 6} kind="sym" anchor="start">{sq ? 'x²' : 'sin x'}</Label>
            <Label x={x0 + w + 14} y={by + 6} kind="sym" anchor="start">{sq ? '2x' : 'cos x'}</Label>
            <Label x={W - 14} y={22} kind="val" anchor="end">{`slope = ${df(x).toFixed(2)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ area as a sum of strips

export function RectSum() {
  const ns = [2, 4, 8, 16, 32];
  return (
    <Anim title="The area under the curve y equals x squared from 0 to 3 is approximated by thin rectangles; as the number of rectangles grows from 2 to 32 the total approaches the exact area of 9" height={255} loop={12.5}>
      {(t) => {
        const k = Math.min(4, Math.floor(t / 2.4));
        const n = ns[k];
        const ox = 60, oy = 222, sx = 100, sy = 20;
        const X = (x: number) => ox + x * sx, Y = (y: number) => oy - y * sy;
        const dx = 3 / n;
        let sum = 0;
        const rects = [];
        for (let i = 0; i < n; i++) {
          const xm = (i + 0.5) * dx;
          const h = xm * xm;
          sum += h * dx;
          rects.push(<rect key={`${n}-${i}`} className="kit-block" x={X(i * dx)} y={Y(h)} width={X(dx) - ox} height={h * sy} style={{ strokeWidth: n > 8 ? 0.8 : 1.6 }} />);
        }
        return (
          <g>
            <Axes x={ox} y={oy} w={370} h={200} xLabel="x" yLabel="y" />
            {rects}
            <Trail points={curve(60, 3, (x) => [X(x), Y(x * x)] as Pt)} />
            <Label x={490} y={80} kind="val" anchor="start">{`n = ${n}`}</Label>
            <Label x={490} y={104} kind="val" anchor="start">{`Δx = ${dx.toFixed(3)}`}</Label>
            <Label x={490} y={134} kind="val" anchor="start">{`area ≈ ${sum.toFixed(3)}`}</Label>
            <Label x={490} y={160} kind="label" anchor="start">exact: 9</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ area under a velocity-time graph

export function AreaVT({ pts = [[0, 2], [6, 8]], xmax = 30, title, loop = 11 }: { pts?: Pt[]; xmax?: number; title: string; loop?: number }) {
  const T = pts[pts.length - 1][0];
  const V = Math.max(...pts.map((p) => p[1]));
  const vAt = (s: number) => {
    for (let i = 1; i < pts.length; i++) {
      if (s <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], (s - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]));
    }
    return pts[pts.length - 1][1];
  };
  const area = (s: number) => {
    let a = 0;
    for (let i = 1; i < pts.length; i++) {
      const a0 = pts[i - 1][0], a1 = Math.min(s, pts[i][0]);
      if (a1 <= a0) break;
      a += ((vAt(a0) + vAt(a1)) / 2) * (a1 - a0);
    }
    return a;
  };
  return (
    <Anim title={title} height={265} loop={loop}>
      {(t) => {
        const s = T * ease(phase(t, 0.5, loop - 3));
        const gx = 70, gy = 238, sx = 330 / T, sy = 130 / V;
        const X = (tt: number) => gx + tt * sx, Y = (v: number) => gy - v * sy;
        const poly: Pt[] = [[X(0), Y(0)]];
        const steps = 60;
        for (let i = 0; i <= steps; i++) poly.push([X((i / steps) * s), Y(vAt((i / steps) * s))]);
        poly.push([X(s), Y(0)]);
        const d = poly.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('') + 'Z';
        const xx = area(s);
        return (
          <g>
            <Ground y={44} x1={40} x2={W - 30} hatch={false} />
            <Block x={50 + (xx / xmax) * 520} y={30} w={34} h={20} />
            <path className="fig-ball" d={d} opacity={0.32} />
            <Axes x={gx} y={gy} w={350} h={150} xLabel="t" yLabel="v" />
            <Trail points={curve(pts.length > 2 ? 90 : 2, 1, (u) => [X(u * T), Y(vAt(u * T))] as Pt)} />
            <Line x1={X(s)} y1={gy} x2={X(s)} y2={Y(vAt(s))} tone="soft" dashed />
            <Ball x={X(s)} y={Y(vAt(s))} r={5} />
            <Label x={470} y={96} kind="val" anchor="start">{`t = ${s.toFixed(1)} s`}</Label>
            <Label x={470} y={120} kind="val" anchor="start">{`v = ${vAt(s).toFixed(1)} m/s`}</Label>
            <Label x={470} y={150} kind="val" anchor="start">{`area = ${xx.toFixed(1)}`}</Label>
            <Label x={470} y={176} kind="label" anchor="start">= distance x</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ a ball thrown up

export function MotionGraphs() {
  return (
    <Anim title="A ball thrown straight up with its height against time, whose slope is the velocity, and its velocity against time, whose slope is the acceleration and whose area from the start is the height; at the top the velocity is zero but the acceleration is still minus ten" height={265} loop={9}>
      {(t) => {
        const s = 4 * ease(phase(t, 0.4, 6.5));
        const yv = 20 * s - 5 * s * s, vv = 20 - 10 * s;
        const g1x = 110, g1y = 235, g2x = 380, g2y = 135;
        const X1 = (tt: number) => g1x + tt * 52, Y1 = (h: number) => g1y - h * 7;
        const X2 = (tt: number) => g2x + tt * 52, Y2 = (v: number) => g2y - v * 4.6;
        const poly: Pt[] = [[X2(0), Y2(0)]];
        for (let i = 0; i <= 40; i++) poly.push([X2((i / 40) * s), Y2(20 - 10 * ((i / 40) * s))]);
        poly.push([X2(s), Y2(0)]);
        const d = poly.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('') + 'Z';
        const dx = 0.45;
        return (
          <g>
            <Ground y={235} x1={20} x2={80} />
            <Ball x={50} y={235 - 7 - yv * 7} r={7} />
            <Axes x={g1x} y={g1y} w={220} h={170} xLabel="t" yLabel="y" />
            <Trail points={curve(80, 4, (tt) => [X1(tt), Y1(20 * tt - 5 * tt * tt)] as Pt)} tone="soft" />
            <Line x1={X1(s - dx)} y1={Y1(yv - vv * dx)} x2={X1(s + dx)} y2={Y1(yv + vv * dx)} tone="bright" />
            <Ball x={X1(s)} y={Y1(yv)} r={4.5} />
            <Axes x={g2x} y={g2y} w={220} h={120} below={105} xLabel="t" yLabel="v" />
            <path className="fig-ball" d={d} opacity={0.3} />
            <Line x1={X2(0)} y1={Y2(20)} x2={X2(4)} y2={Y2(-20)} tone="bright" />
            <Ball x={X2(s)} y={Y2(vv)} r={4.5} />
            <Label x={g1x + 12} y={34} kind="val" anchor="start">{`slope = v = ${vv.toFixed(1)}`}</Label>
            <Label x={g2x + 40} y={22} kind="val" anchor="start">{`slope = a = −10`}</Label>
            <Label x={g2x + 90} y={g2y + 112} kind="val">{`area = y = ${yv.toFixed(1)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the constant of integration

export function ConstantC() {
  return (
    <Anim title="Three curves with the same slope at every moment but different starting positions: integrating a velocity gives a whole family of curves, and the constant of integration picks one" height={245} loop={10}>
      {(t) => {
        const ox = 60, oy = 215, sx = 62, sy = 6.2;
        const X = (tt: number) => ox + tt * sx, Y = (x: number) => oy - x * sy;
        const x0s = [0, 8, 16];
        const s = 3.4 * ease(phase(t, 0.6, 7));
        const xf = (x0: number, tt: number) => x0 + 2 * tt + 0.5 * tt * tt;
        const sl = 2 + s;
        return (
          <g>
            <Axes x={ox} y={oy} w={400} h={200} xLabel="t" yLabel="x" />
            {x0s.map((x0) => (
              <g key={x0}>
                <Trail points={curve(60, 4, (tt) => [X(tt), Y(xf(x0, tt))] as Pt)} tone={x0 === 0 ? 'bright' : 'soft'} />
                <Line x1={X(s - 0.5)} y1={Y(xf(x0, s) - sl * 0.5)} x2={X(s + 0.5)} y2={Y(xf(x0, s) + sl * 0.5)} tone="bright" />
                <Ball x={X(s)} y={Y(xf(x0, s))} r={4.5} />
                <Label x={X(0) - 10} y={Y(x0) + 5} kind="sym" anchor="end">{String(x0)}</Label>
              </g>
            ))}
            <Label x={490} y={90} kind="val" anchor="start">{`t = ${s.toFixed(1)} s`}</Label>
            <Label x={490} y={114} kind="val" anchor="start">{`slope = ${sl.toFixed(1)}`}</Label>
            <Label x={490} y={144} kind="label" anchor="start">same slope on</Label>
            <Label x={490} y={166} kind="label" anchor="start">every curve</Label>
            <Label x={490} y={196} kind="label" anchor="start">starts x₀ = 0, 8, 16</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ small angles

export function SmallAngle() {
  return (
    <Anim title="A unit circle with an angle opening from 2 degrees to 40 degrees: the arc length, the sine and the tangent are almost equal for small angles, and the gaps between them grow as the angle opens" height={255} loop={12}>
      {(t) => {
        const th = (2 + 38 * (0.5 - 0.5 * Math.cos((TAU * t) / 12))) * (Math.PI / 180);
        const cx = 70, cy = 214, R = 150;
        const px = cx + R * Math.cos(th), py = cy - R * Math.sin(th);
        const deg = (th * 180) / Math.PI;
        const err = (a: number, b: number) => (Math.abs(a - b) / b) * 100;
        return (
          <g>
            <Arrow x1={cx - 10} y1={cy} x2={cx + R + 50} y2={cy} tone="soft" />
            <path className="fig-path" d={`M${cx + R} ${cy}A${R} ${R} 0 0 0 ${px} ${py}`} fill="none" />
            <Line x1={cx} y1={cy} x2={px} y2={py} tone="soft" />
            <Line x1={px} y1={py} x2={px} y2={cy} tone="bright" dashed />
            <Line x1={cx + R} y1={cy} x2={cx + R} y2={cy - R * Math.tan(th)} tone="soft" dashed />
            <Ball x={px} y={py} r={4.5} />
            <Label x={cx + 40} y={cy + 24} kind="sym">θ</Label>
            <Label x={420} y={64} kind="val" anchor="start">{`θ = ${deg.toFixed(0)}°  =  ${th.toFixed(3)} rad`}</Label>
            <Label x={420} y={96} kind="val" anchor="start">{`sin θ = ${Math.sin(th).toFixed(3)}`}</Label>
            <Label x={420} y={120} kind="val" anchor="start">{`tan θ = ${Math.tan(th).toFixed(3)}`}</Label>
            <Label x={420} y={152} kind="label" anchor="start">{`θ above sin θ: ${err(th, Math.sin(th)).toFixed(1)} %`}</Label>
            <Label x={420} y={176} kind="label" anchor="start">{`tan θ above θ: ${err(Math.tan(th), th).toFixed(1)} %`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ binomial and tangent line

const powerName = (n: number) => (n === 0.5 ? '√(1 + x)' : n === -1 ? '1/(1 + x)' : n === 2 ? '(1 + x)²' : n === 3 ? '(1 + x)³' : `(1 + x)^${n}`);

export function TangentApprox({ ns = [0.5, -1, 2], xlo = -0.6, xhi = 0.6, title, loop = 12 }: { ns?: number[]; xlo?: number; xhi?: number; title: string; loop?: number }) {
  return (
    <Anim title={title} height={250} loop={loop}>
      {(t) => {
        const per = loop / ns.length;
        const k = Math.min(ns.length - 1, Math.floor(t / per));
        const n = ns[k];
        const t0 = t - k * per;
        const px0 = 50, pw = 350, oy = 222, sy = 60;
        const X = (x: number) => px0 + ((x - xlo) / (xhi - xlo)) * pw;
        const Y = (y: number) => Math.max(34, Math.min(oy + 4, oy - y * sy));
        const f = (x: number) => (1 + x) ** n;
        const xs = lerp(xlo + 0.03, xhi, 0.5 - 0.5 * Math.cos(TAU * ease(phase(t0, 0.3, per - 0.3)) * 0.75));
        const ex = f(xs), ap = 1 + n * xs;
        const err = (Math.abs(ap - ex) / Math.abs(ex)) * 100;
        return (
          <g>
            <Line x1={px0 - 6} y1={oy} x2={px0 + pw + 8} y2={oy} tone="soft" />
            <Line x1={X(0)} y1={oy + 4} x2={X(0)} y2={30} tone="soft" />
            <Trail points={curve(80, 1, (u) => [X(lerp(xlo + 0.02, xhi, u)), Y(f(lerp(xlo + 0.02, xhi, u)))] as Pt)} />
            <Line x1={X(xlo)} y1={Y(1 + n * xlo)} x2={X(xhi)} y2={Y(1 + n * xhi)} tone="soft" dashed />
            <Line x1={X(xs)} y1={Y(ap)} x2={X(xs)} y2={Y(ex)} tone="bright" />
            <Ball x={X(xs)} y={Y(ex)} r={5} />
            <Ball x={X(xs)} y={Y(ap)} r={5} ghost />
            <Label x={px0} y={22} kind="sym" anchor="start">{powerName(n)}</Label>
            <Label x={450} y={70} kind="val" anchor="start">{`x = ${xs.toFixed(2)}`}</Label>
            <Label x={450} y={96} kind="val" anchor="start">{`exact   ${ex.toFixed(3)}`}</Label>
            <Label x={450} y={120} kind="val" anchor="start">{`1 + n x ${ap.toFixed(3)}`}</Label>
            <Label x={450} y={150} kind="label" anchor="start">{`error ${err.toFixed(1)} %`}</Label>
            <Key x={446} y={186} name="exact" />
            <Key x={446} y={210} name="1 + n x" tone="soft" dashed />
          </g>
        );
      }}
    </Anim>
  );
}
