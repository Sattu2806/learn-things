import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Label, Line, Readout, Spring, Trail, W, ease, lerp, phase } from '../kit/Anim';

/** Animated diagrams for alternating current. Everything is driven by the real formulas. */

const TAU = 2 * Math.PI;
const DEG = Math.PI / 180;
type Pt = [number, number];

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
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

/**
 * A scrolling trace: the value now is at x, and the past flows to the right.
 * f takes the phase angle (radians); om is the angle gained per second of animation.
 */
const SPAN = 4.8;
function Trace({ t, x, y, w, A, om = Math.PI, f, tone = 'bright', dashed, ball = true }: { t: number; x: number; y: number; w: number; A: number; om?: number; f: (th: number) => number; tone?: 'bright' | 'soft'; dashed?: boolean; ball?: boolean }) {
  const pps = w / SPAN;
  return (
    <g>
      <Trail points={curve(110, SPAN, (u) => [x + u * pps, y - A * f(om * (t - u))] as Pt)} tone={tone} dashed={dashed} />
      {ball && <Ball x={x} y={y - A * f(om * t)} r={4.5} />}
    </g>
  );
}

// ------------------------------------------------------------------ the generator

export function Generator() {
  return (
    <Anim title="A coil turns in a magnetic field; the flux through it follows a cosine and the emf it produces follows a sine" height={230} loop={8}>
      {(t) => {
        const om = Math.PI;
        const th = om * t;
        const cx = 105, cy = 115, R = 62;
        const ux = Math.sin(th), uy = Math.cos(th);
        const e1x = cx + R * ux, e1y = cy + R * uy;
        const e2x = cx - R * ux, e2y = cy - R * uy;
        const gx = 290, gw = 330;
        return (
          <g>
            {[-60, -20, 20, 60].map((dy) => (
              <Arrow key={dy} x1={20} y1={cy + dy * 1.1} x2={190} y2={cy + dy * 1.1} tone="soft" dashed />
            ))}
            <Label x={14} y={30} kind="sym" anchor="start">B</Label>
            <Line x1={e1x} y1={e1y} x2={e2x} y2={e2y} tone="bright" />
            <Arrow x1={e1x} y1={e1y} x2={e1x + 38 * Math.cos(th)} y2={e1y - 38 * Math.sin(th)} tone="soft" />
            <Ball x={e1x} y={e1y} r={5} />
            <Ball x={e2x} y={e2y} r={5} />
            <Label x={cx} y={214} kind="label">coil seen end-on</Label>
            <Axes x={gx} y={cy} w={gw} h={72} below={72} xLabel="t" />
            <Trace t={t} x={gx} y={cy} w={gw - 20} A={58} om={om} f={Math.cos} tone="soft" dashed ball={false} />
            <Trace t={t} x={gx} y={cy} w={gw - 20} A={58} om={om} f={Math.sin} />
            <Key x={gx + 10} y={218} name="flux" tone="soft" dashed />
            <Key x={gx + 90} y={218} name="emf" />
            <Readout x={W - 12} y={20}>{`e = ${(Math.sin(th)).toFixed(2)} NBAω`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ rms

export function Rms({ height = 250, title = 'The current squared is always positive and its average is half the peak; a lamp on steady current of the rms size glows as brightly as the alternating one' }: { height?: number; title?: string }) {
  return (
    <Anim title={title} height={height} loop={8}>
      {(t) => {
        const om = Math.PI;
        const th = om * t;
        const y0 = height * 0.55, A = height * 0.32, gx = 40, gw = 380;
        const lamp = Math.sin(th) ** 2;
        return (
          <g>
            <Axes x={gx} y={y0} w={gw} h={A + 14} below={A + 6} xLabel="t" />
            <Trace t={t} x={gx + 6} y={y0} w={gw - 20} A={A} om={om} f={Math.sin} tone="soft" dashed ball={false} />
            <Trace t={t} x={gx + 6} y={y0} w={gw - 20} A={A} om={om} f={(p) => Math.sin(p) ** 2} />
            <Line x1={gx} y1={y0 - A / 2} x2={gx + gw} y2={y0 - A / 2} tone="soft" dashed />
            <Label x={gx + gw - 4} y={y0 - A / 2 - 8} kind="label" anchor="end">average of i² = I₀² / 2</Label>
            <Key x={gx + 6} y={height - 10} name="i" tone="soft" dashed />
            <Key x={gx + 60} y={height - 10} name="i²" />
            <circle className="fig-guide" cx={500} cy={height * 0.3} r={26} fill="none" />
            <circle cx={500} cy={height * 0.3} r={22} fill="#fff" opacity={0.08 + 0.85 * lamp} />
            <Label x={500} y={height * 0.3 + 46} kind="label">alternating</Label>
            <circle className="fig-guide" cx={575} cy={height * 0.3} r={26} fill="none" />
            <circle cx={575} cy={height * 0.3} r={22} fill="#fff" opacity={0.08 + 0.85 * 0.5} />
            <Label x={575} y={height * 0.3 + 46} kind="label">steady, I(rms)</Label>
            <Readout x={W - 12} y={height - 10}>{`i² = ${lamp.toFixed(2)} I₀²`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** A symmetric wave, its zero average and the rms bands. */
export function MeanZero({ height = 200 }: { height?: number }) {
  return (
    <Anim title="The average of an alternating current over a cycle is zero, but its rms value is not" height={height} loop={8}>
      {(t) => {
        const om = Math.PI;
        const y0 = height / 2, A = height * 0.32, gx = 30, gw = 580;
        const sw = Math.sin(om * t);
        return (
          <g>
            <Axes x={gx} y={y0} w={gw} h={A + 12} below={A + 12} xLabel="t" />
            <Line x1={gx} y1={y0 - A * 0.707} x2={gx + gw} y2={y0 - A * 0.707} tone="soft" dashed />
            <Line x1={gx} y1={y0 + A * 0.707} x2={gx + gw} y2={y0 + A * 0.707} tone="soft" dashed />
            <Label x={gx + gw - 4} y={y0 - A * 0.707 - 6} kind="label" anchor="end">+I(rms)</Label>
            <Label x={gx + gw - 4} y={y0 + A * 0.707 + 16} kind="label" anchor="end">−I(rms)</Label>
            <Trace t={t} x={gx + 6} y={y0} w={gw - 30} A={A} om={om} f={Math.sin} />
            <Label x={gx + 14} y={y0 - 8} kind="label" anchor="start">average = 0</Label>
            <Readout x={W - 12} y={height - 8}>{`i = ${sw.toFixed(2)} I₀`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ phasors

/** One rotating arrow and its projection drawn out against time. */
export function PhasorBasic({ height = 240 }: { height?: number }) {
  return (
    <Anim title="A phasor turns at the angular frequency omega; its vertical shadow is the sine wave of the alternating quantity" height={height} loop={8}>
      {(t) => {
        const th = Math.PI * t;
        const cx = 105, cy = height / 2, R = 72, ax = 240;
        const px = cx + R * Math.cos(th), py = cy - R * Math.sin(th);
        return (
          <g>
            <circle className="fig-guide" cx={cx} cy={cy} r={R} fill="none" />
            <Line x1={cx - R - 10} y1={cy} x2={cx + R + 10} y2={cy} tone="soft" />
            <Arrow x1={cx} y1={cy} x2={px} y2={py} label="V₀" />
            <path className="fig-guide" d={`M${cx + 26} ${cy}A26 26 0 ${th % TAU > Math.PI ? 1 : 0} 0 ${cx + 26 * Math.cos(th)} ${cy - 26 * Math.sin(th)}`} fill="none" />
            <Label x={cx + 40} y={cy - 8} kind="sym" anchor="start">ωt</Label>
            <Line x1={px} y1={py} x2={ax} y2={py} tone="soft" dashed />
            <Line x1={ax} y1={cy - R - 10} x2={ax} y2={cy + R + 10} tone="soft" />
            <Trace t={t} x={ax} y={cy} w={W - ax - 20} A={R} f={Math.sin} />
            <Label x={cx} y={height - 12} kind="label">phasor</Label>
            <Label x={ax + 150} y={height - 12} kind="label">v = V₀ sin ωt</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Voltage and current phasors for a single element, and the two waves. phi = how far the voltage leads the current (rad). */
export function PhasorPair({ title, phi, height = 235, name }: { title: string; phi: number; height?: number; name: string }) {
  return (
    <Anim title={title} height={height} loop={8}>
      {(t) => {
        const om = Math.PI;
        const th = om * t;
        const cx = 105, cy = height * 0.48, R = 70, ax = 250;
        const v = (a: number) => Math.sin(a);
        const i = (a: number) => Math.sin(a - phi);
        const vx = cx + R * Math.cos(th), vy = cy - R * Math.sin(th);
        const ix = cx + R * 0.7 * Math.cos(th - phi), iy = cy - R * 0.7 * Math.sin(th - phi);
        return (
          <g>
            <circle className="fig-guide" cx={cx} cy={cy} r={R} fill="none" />
            <Line x1={cx - R - 8} y1={cy} x2={cx + R + 8} y2={cy} tone="soft" />
            <Arrow x1={cx} y1={cy} x2={vx} y2={vy} label="v" />
            <Arrow x1={cx} y1={cy} x2={ix} y2={iy} tone="soft" label="i" />
            <Line x1={vx} y1={vy} x2={ax} y2={vy} tone="soft" dashed />
            <Line x1={ix} y1={iy} x2={ax} y2={iy} tone="soft" dashed />
            <Line x1={ax} y1={cy - R - 10} x2={ax} y2={cy + R + 10} tone="soft" />
            <Trace t={t} x={ax} y={cy} w={W - ax - 20} A={R} om={om} f={v} />
            <Trace t={t} x={ax} y={cy} w={W - ax - 20} A={R * 0.7} om={om} f={i} tone="soft" dashed />
            <Label x={cx} y={height - 12} kind="label">{name}</Label>
            <Key x={ax + 10} y={height - 12} name="v" />
            <Key x={ax + 60} y={height - 12} name="i" tone="soft" dashed />
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the slope behind L and C

export function Slope({ title, top, bottom, height = 260 }: { title: string; top: string; bottom: string; height?: number }) {
  return (
    <Anim title={title} height={height} loop={8}>
      {(t) => {
        const om = Math.PI;
        const th = om * t;
        const gx = 50, gw = 540, A = 44;
        const y1 = 75, y2 = 195;
        const pps = (gw - 20) / SPAN;
        const sl = A * om * Math.cos(th);
        const len = Math.hypot(pps, sl);
        const dx = (pps / len) * 46, dy = (sl / len) * 46;
        const by = y1 - A * Math.sin(th);
        return (
          <g>
            <Line x1={gx} y1={y1 - A - 12} x2={gx} y2={y1 + A + 12} tone="soft" />
            <Line x1={gx} y1={y1} x2={gx + gw} y2={y1} tone="soft" />
            <Line x1={gx} y1={y2 - A - 12} x2={gx} y2={y2 + A + 12} tone="soft" />
            <Line x1={gx} y1={y2} x2={gx + gw} y2={y2} tone="soft" />
            <Trace t={t} x={gx} y={y1} w={gw - 20} A={A} f={Math.sin} />
            <Line x1={gx - dx} y1={by - dy} x2={gx + dx} y2={by + dy} tone="bright" dashed />
            <Trace t={t} x={gx} y={y2} w={gw - 20} A={A} f={Math.cos} />
            <Line x1={gx} y1={by} x2={gx} y2={y2 - A * Math.cos(th)} tone="soft" dashed />
            <Label x={gx + 8} y={y1 - A - 6} kind="sym" anchor="start">{top}</Label>
            <Label x={gx + 8} y={y2 - A - 6} kind="sym" anchor="start">{bottom}</Label>
            <Label x={W - 14} y={height - 10} kind="label" anchor="end">the steeper the top curve, the larger the bottom one</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ reactance against frequency

export function ReactanceF({ height = 250 }: { height?: number }) {
  return (
    <Anim title="The reactance of an inductor rises in proportion to the frequency, and that of a capacitor falls as one over the frequency" height={height} loop={10}>
      {(t) => {
        const ox = 60, oy = height - 40, w = 520, h = height - 80;
        const fmin = 0.4, fmax = 2.2;
        const fx = (f: number) => ox + ((f - fmin) / (fmax - fmin)) * w;
        const fy = (x: number) => oy - (x / 2.4) * h;
        const f = lerp(fmin + 0.05, fmax - 0.05, ease(phase(t, 0, 4.5)) * (1 - ease(phase(t, 5, 9.5))));
        const xl = f, xc = 1 / f;
        return (
          <g>
            <Axes x={ox} y={oy} w={w + 20} h={h + 10} xLabel="f" yLabel="X" />
            <Trail points={curve(60, fmax - fmin, (s) => [fx(fmin + s), fy(fmin + s)] as Pt)} />
            <Trail points={curve(80, fmax - fmin, (s) => [fx(fmin + s), fy(1 / (fmin + s))] as Pt)} tone="soft" dashed />
            <Line x1={fx(1)} y1={oy} x2={fx(1)} y2={fy(1)} tone="soft" dashed />
            <Label x={fx(1)} y={oy + 18} kind="sym">f₀</Label>
            <Line x1={fx(f)} y1={oy} x2={fx(f)} y2={Math.min(fy(xl), fy(xc))} tone="soft" dashed />
            <Ball x={fx(f)} y={fy(xl)} r={5} />
            <Ball x={fx(f)} y={fy(xc)} r={5} />
            <Key x={ox + 20} y={22} name="X_L = ωL" />
            <Key x={ox + 150} y={22} name="X_C = 1 / ωC" tone="soft" dashed />
            <Readout x={W - 12} y={22}>{xl > xc ? 'inductive' : 'capacitive'}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ series LCR

/** The rotating phasor diagram of the series circuit, with v and i drawn out. Values: V_R = 60, V_L = 180, V_C = 100. */
export function LcrPhasor({ height = 270 }: { height?: number }) {
  return (
    <Anim title="In the series circuit the resistor voltage is along the current, the inductor voltage is a quarter turn ahead and the capacitor voltage a quarter turn behind; the whole picture turns and the total voltage leads the current" height={height} loop={8}>
      {(t) => {
        const th = Math.PI * t;
        const cx = 125, cy = height / 2 + 6, s = 0.5;
        const rot = (a: number, b: number): Pt => [cx + a * s * Math.cos(th) - b * s * Math.sin(th), cy - (a * s * Math.sin(th) + b * s * Math.cos(th))];
        const VR = 60, VL = 180, VC = 100;
        const o = rot(0, 0);
        const r = rot(VR, 0), l = rot(0, VL), c = rot(0, -VC), vv = rot(VR, VL - VC), mid = rot(VR, VL);
        const phi = Math.atan2(VL - VC, VR);
        const ax = 330;
        const A = 50;
        return (
          <g>
            <Arrow x1={o[0]} y1={o[1]} x2={r[0]} y2={r[1]} tone="soft" label="V_R" />
            <Arrow x1={o[0]} y1={o[1]} x2={l[0]} y2={l[1]} tone="soft" label="V_L" />
            <Arrow x1={o[0]} y1={o[1]} x2={c[0]} y2={c[1]} tone="soft" label="V_C" />
            <Line x1={r[0]} y1={r[1]} x2={mid[0]} y2={mid[1]} tone="soft" dashed />
            <Line x1={mid[0]} y1={mid[1]} x2={vv[0]} y2={vv[1]} tone="soft" dashed />
            <Arrow x1={o[0]} y1={o[1]} x2={vv[0]} y2={vv[1]} label="V" />
            <Ball x={o[0]} y={o[1]} r={3.5} />
            <Line x1={ax} y1={cy - A - 18} x2={ax} y2={cy + A + 18} tone="soft" />
            <Line x1={ax} y1={cy} x2={W - 14} y2={cy} tone="soft" />
            <Trace t={t} x={ax} y={cy} w={W - ax - 24} A={A} f={(p) => Math.sin(p + phi)} />
            <Trace t={t} x={ax} y={cy} w={W - ax - 24} A={A * 0.6} f={Math.sin} tone="soft" dashed />
            <Key x={ax + 10} y={height - 10} name="v" />
            <Key x={ax + 60} y={height - 10} name="i" tone="soft" dashed />
            <Label x={W - 14} y={height - 10} kind="label" anchor="end">v leads i by 53°</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Reactance swings from capacitive to inductive and the impedance triangle follows. */
export function ImpedanceTriangle({ height = 250 }: { height?: number }) {
  return (
    <Anim title="The impedance triangle: resistance along, net reactance up or down, and the impedance as the hypotenuse; the phase angle opens and closes as the reactance changes" height={height} loop={10}>
      {(t) => {
        const R = 130;
        const X = 90 * Math.sin((TAU * t) / 10);
        const ox = 120, oy = height / 2;
        const Z = Math.hypot(R, X);
        const phi = Math.atan2(X, R);
        return (
          <g>
            <Arrow x1={ox} y1={oy} x2={ox + R} y2={oy} tone="soft" />
            <Arrow x1={ox + R} y1={oy} x2={ox + R} y2={oy - X} tone="soft" />
            <Arrow x1={ox} y1={oy} x2={ox + R} y2={oy - X} />
            <Label x={ox + R / 2} y={oy + 22} kind="sym">R</Label>
            <Label x={ox + R + 14} y={oy - X / 2 + 6} kind="sym" anchor="start">X = X_L − X_C</Label>
            <Label x={ox + R / 2 - 10} y={oy - X / 2 - 8} kind="sym">Z</Label>
            <path className="fig-guide" d={`M${ox + 44} ${oy}A44 44 0 0 ${X > 0 ? 0 : 1} ${ox + 44 * Math.cos(phi)} ${oy - 44 * Math.sin(phi)}`} fill="none" />
            <Label x={ox + 60} y={oy - (X > 0 ? 6 : -16)} kind="sym" anchor="start">φ</Label>
            <Label x={W - 14} y={60} kind="val" anchor="end">{`Z = ${(Z / 2.6).toFixed(0)} Ω`}</Label>
            <Label x={W - 14} y={84} kind="val" anchor="end">{`φ = ${(phi / DEG).toFixed(0)}°`}</Label>
            <Label x={W - 14} y={108} kind="label" anchor="end">{X > 8 ? 'inductive: v leads i' : X < -8 ? 'capacitive: i leads v' : 'resistive'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ resonance

const resp = (w: number, Q: number) => 1 / Math.sqrt(1 + Q * Q * (w - 1 / w) ** 2);

export function ResonanceCurve({ height = 260, bandwidth = true }: { height?: number; bandwidth?: boolean }) {
  return (
    <Anim title="The current in the series circuit as the driving frequency sweeps past the natural frequency; a small resistance gives a tall sharp peak, a larger one a low broad peak" height={height} loop={10}>
      {(t) => {
        const ox = 50, oy = height - 42, w = 540, h = height - 90;
        const wmin = 0.55, wmax = 1.6;
        const px = (x: number) => ox + ((x - wmin) / (wmax - wmin)) * w;
        const py = (v: number) => oy - v * h;
        const sweep = lerp(wmin + 0.02, wmax - 0.02, ease(phase(t, 0, 4.6)) * (1 - ease(phase(t, 5, 9.6))));
        const Q1 = 8, Q2 = 3;
        const half = 1 / Math.SQRT2;
        const d = 1 / (2 * Q1);
        return (
          <g>
            <Axes x={ox} y={oy} w={w + 10} h={h + 16} xLabel="ω" yLabel="I" />
            <Trail points={curve(240, wmax - wmin, (s) => [px(wmin + s), py(resp(wmin + s, Q1))] as Pt)} />
            <Trail points={curve(160, wmax - wmin, (s) => [px(wmin + s), py(resp(wmin + s, Q2))] as Pt)} tone="soft" dashed />
            <Line x1={px(1)} y1={oy} x2={px(1)} y2={py(1)} tone="soft" dashed />
            <Label x={px(1)} y={oy + 18} kind="sym">ω₀</Label>
            {bandwidth && (
              <g>
                <Line x1={px(1 - d)} y1={py(half)} x2={px(1 + d)} y2={py(half)} tone="soft" />
                <Label x={px(1 + d) + 8} y={py(half) + 4} kind="label" anchor="start">half power: Δω = R / L</Label>
              </g>
            )}
            <Line x1={px(sweep)} y1={oy} x2={px(sweep)} y2={py(resp(sweep, Q1))} tone="soft" dashed />
            <Ball x={px(sweep)} y={py(resp(sweep, Q1))} r={5} />
            <Ball x={px(sweep)} y={py(resp(sweep, Q2))} r={4.5} ghost />
            <Key x={ox + 20} y={20} name="small R (sharp)" />
            <Key x={ox + 170} y={20} name="larger R (broad)" tone="soft" dashed />
            <Readout x={W - 12} y={20}>{`ω = ${sweep.toFixed(2)} ω₀`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function ResonancePhases({ height = 190 }: { height?: number }) {
  const cols: { name: string; phi: number }[] = [
    { name: 'below ω₀: i leads', phi: -60 * DEG },
    { name: 'at ω₀: in step', phi: 0 },
    { name: 'above ω₀: i lags', phi: 60 * DEG },
  ];
  return (
    <Anim title="Below the natural frequency the current leads the voltage, at it they are in step, above it the current lags" height={height} loop={8}>
      {(t) => (
        <g>
          {cols.map((c, k) => {
            const x = 18 + k * 208;
            const y = height * 0.45;
            return (
              <g key={c.name}>
                <Line x1={x} y1={y - 56} x2={x} y2={y + 56} tone="soft" />
                <Line x1={x} y1={y} x2={x + 186} y2={y} tone="soft" />
                <Trace t={t} x={x} y={y} w={186} A={44} f={Math.sin} />
                <Trace t={t} x={x} y={y} w={186} A={32} f={(p) => Math.sin(p - c.phi)} tone="soft" dashed />
                <Label x={x + 90} y={height - 14} kind="label">{c.name}</Label>
              </g>
            );
          })}
          <Key x={20} y={16} name="v" />
          <Key x={70} y={16} name="i" tone="soft" dashed />
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ power

/** Rows of v, i and the instantaneous power v·i for several phase angles (degrees). */
export function PowerWave({ title, phis, height }: { title: string; phis: number[]; height?: number }) {
  const rowH = 96;
  const H = height ?? 36 + rowH * phis.length;
  return (
    <Anim title={title} height={H} loop={8}>
      {(t) => (
        <g>
          {phis.map((deg, k) => {
            const phi = deg * DEG;
            const y = 62 + k * rowH;
            const A = 34;
            const avg = Math.cos(phi) / 2;
            const x = 40, w = 400;
            return (
              <g key={deg}>
                <Line x1={x} y1={y - A - 6} x2={x} y2={y + A + 6} tone="soft" />
                <Line x1={x} y1={y} x2={x + w} y2={y} tone="soft" />
                <Trace t={t} x={x} y={y} w={w} A={A * 0.8} f={Math.sin} tone="soft" dashed ball={false} />
                <Trace t={t} x={x} y={y} w={w} A={A * 0.8} f={(p) => Math.sin(p - phi)} tone="soft" ball={false} />
                <Trace t={t} x={x} y={y} w={w} A={A} f={(p) => Math.sin(p) * Math.sin(p - phi)} />
                <Line x1={x} y1={y - A * avg} x2={x + w} y2={y - A * avg} tone="soft" dashed />
                <Label x={x + w + 14} y={y - 6} kind="val" anchor="start">{`φ = ${deg}°`}</Label>
                <Label x={x + w + 14} y={y + 16} kind="label" anchor="start">{`average ${(avg * 2).toFixed(2)} × ½V₀I₀`}</Label>
              </g>
            );
          })}
          <Key x={40} y={18} name="power p = v i" />
          <Key x={170} y={18} name="v, i" tone="soft" dashed />
          <Key x={240} y={18} name="average" tone="soft" dashed />
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ LC oscillations

/** A point on a rectangle perimeter, s from 0 to 1, going clockwise from the top left. */
function around(x1: number, y1: number, x2: number, y2: number, s: number): Pt {
  const w = x2 - x1, h = y2 - y1, p = 2 * (w + h);
  let d = (((s % 1) + 1) % 1) * p;
  if (d < w) return [x1 + d, y1];
  d -= w;
  if (d < h) return [x2, y1 + d];
  d -= h;
  if (d < w) return [x2 - d, y2];
  d -= w;
  return [x1, y2 - d];
}

export function LcOscillator({ height = 250 }: { height?: number }) {
  return (
    <Anim title="A charged capacitor discharges through a coil and charges up the other way; energy swings between the capacitor and the coil while the total stays fixed" height={height} loop={8}>
      {(t) => {
        const th = (TAU * t) / 4;
        const q = Math.cos(th);
        const x1 = 50, y1 = 50, x2 = 290, y2 = 170;
        const midY = (y1 + y2) / 2;
        const ec = q * q, el = 1 - ec;
        const dots: Pt[] = [];
        for (let k = 0; k < 16; k++) {
          const s = k / 16 + 0.05 * (1 - Math.cos(th));
          const p = around(x1, y1, x2, y2, s);
          const onLeft = Math.abs(p[0] - x1) < 1 && p[1] > midY - 22 && p[1] < midY + 22;
          const onRight = Math.abs(p[0] - x2) < 1 && p[1] > midY - 36 && p[1] < midY + 36;
          if (!onLeft && !onRight) dots.push(p);
        }
        const bx = 400, base = 200, H = 130;
        return (
          <g>
            <Line x1={x1} y1={y1} x2={x2} y2={y1} tone="bright" />
            <Line x1={x1} y1={y2} x2={x2} y2={y2} tone="bright" />
            <Line x1={x1} y1={y1} x2={x1} y2={midY - 8} tone="bright" />
            <Line x1={x1} y1={midY + 8} x2={x1} y2={y2} tone="bright" />
            <Line x1={x1 - 22} y1={midY - 8} x2={x1 + 22} y2={midY - 8} tone="bright" />
            <Line x1={x1 - 22} y1={midY + 8} x2={x1 + 22} y2={midY + 8} tone="bright" />
            <text className="fig-sym" x={x1 + 36} y={midY - 14} opacity={Math.abs(q)} fontSize={20}>{q > 0 ? '+' : '−'}</text>
            <text className="fig-sym" x={x1 + 36} y={midY + 28} opacity={Math.abs(q)} fontSize={20}>{q > 0 ? '−' : '+'}</text>
            <Line x1={x2} y1={y1} x2={x2} y2={midY - 36} tone="bright" />
            <Spring x1={x2} y1={midY - 36} x2={x2} y2={midY + 36} coils={5} width={12} />
            <Line x1={x2} y1={midY + 36} x2={x2} y2={y2} tone="bright" />
            <circle cx={x2} cy={midY} r={22 + 26 * el} fill="none" stroke="#fff" strokeOpacity={0.15 + 0.6 * el} strokeWidth={2} />
            {dots.map((p, k) => (
              <Ball key={k} x={p[0]} y={p[1]} r={3} glow={false} />
            ))}
            <Label x={x1} y={y2 + 28} kind="label">C</Label>
            <Label x={x2} y={y2 + 28} kind="label">L</Label>
            <Line x1={bx - 30} y1={base} x2={bx + 190} y2={base} tone="soft" />
            {(
              [
                [bx, ec, 'C: ½ q² / C'],
                [bx + 70, el, 'L: ½ L i²'],
                [bx + 140, 1, 'total'],
              ] as [number, number, string][]
            ).map(([x, v, name], i) => (
              <g key={name}>
                {i < 2 ? <rect className="fig-ball" x={x - 16} y={base - H * v} width={32} height={Math.max(0.1, H * v)} opacity={i === 0 ? 1 : 0.55} /> : <rect className="fig-guide" x={x - 16} y={base - H} width={32} height={H} fill="none" />}
                <Label x={x} y={base + 18} kind="label">{name}</Label>
              </g>
            ))}
          </g>
        );
      }}
    </Anim>
  );
}

/** The LC circuit and the spring: charge is displacement, current is velocity. */
export function LcSpring({ height = 230 }: { height?: number }) {
  return (
    <Anim title="The block on a spring and the LC circuit swing in exactly the same way: displacement matches charge and velocity matches current" height={height} loop={8}>
      {(t) => {
        const th = (TAU * t) / 4;
        const s = Math.cos(th), c = -Math.sin(th);
        const eq = 160, y = 70;
        const bx = eq + 80 * s;
        const qy = 160;
        return (
          <g>
            <Line x1={24} y1={y - 28} x2={24} y2={y + 28} tone="bright" />
            <Spring x1={24} y1={y} x2={bx - 20} y2={y} coils={9} />
            <rect className="kit-block" x={bx - 20} y={y - 17} width={40} height={34} rx={3} />
            <Line x1={eq} y1={y - 30} x2={eq} y2={y + 30} tone="soft" dashed />
            <Arrow x1={bx} y1={y - 28} x2={bx + 44 * c} y2={y - 28} tone="soft" label="v" />
            <Label x={eq} y={y + 50} kind="sym">x</Label>
            <Line x1={24} y1={qy} x2={296} y2={qy} tone="soft" />
            <Line x1={eq} y1={qy - 14} x2={eq} y2={qy + 14} tone="soft" dashed />
            <Ball x={eq + 80 * s} y={qy} r={7} />
            <Arrow x1={eq + 80 * s} y1={qy - 20} x2={eq + 80 * s + 44 * c} y2={qy - 20} tone="soft" label="i" />
            <Label x={eq} y={qy + 34} kind="sym">q</Label>
            {(
              [
                ['x  ↔  q', 400, 50],
                ['v  ↔  i', 400, 85],
                ['m  ↔  L', 400, 120],
                ['k  ↔  1 / C', 400, 155],
              ] as [string, number, number][]
            ).map(([txt, x, yy]) => (
              <Label key={txt} x={x} y={yy} kind="sym" anchor="start">
                {txt}
              </Label>
            ))}
            <Readout x={W - 12} y={height - 10}>ω = 1 / √(LC)</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the transformer

function Core({ x, y, w, h, flux, np, ns }: { x: number; y: number; w: number; h: number; flux: number; np: number; ns: number }) {
  const lw = 40;
  return (
    <g>
      <rect className="fig-path" x={x} y={y} width={w} height={h} fill="none" />
      <rect className="fig-path" x={x + lw} y={y + lw} width={w - 2 * lw} height={h - 2 * lw} fill="none" />
      <rect className="fig-guide" x={x + lw / 2} y={y + lw / 2} width={w - lw} height={h - lw} fill="none" strokeDasharray="8 10" strokeDashoffset={flux * 36} opacity={0.4 + 0.5 * Math.abs(Math.sin(flux * 2))} />
      <Spring x1={x + lw / 2} y1={y + 8} x2={x + lw / 2} y2={y + h - 8} coils={np} width={lw / 2 + 8} />
      <Spring x1={x + w - lw / 2} y1={y + 8} x2={x + w - lw / 2} y2={y + h - 8} coils={ns} width={lw / 2 + 8} />
    </g>
  );
}

export function Transformer({ np, ns, height = 270, title, labels }: { np: number; ns: number; height?: number; title: string; labels?: [string, string] }) {
  return (
    <Anim title={title} height={height} loop={8}>
      {(t) => {
        const th = Math.PI * t;
        const y0 = 214;
        const A = 34;
        const k = ns / np;
        const A2 = Math.min(46, A * k);
        return (
          <g>
            <Core x={190} y={20} w={260} h={140} flux={Math.cos(th)} np={np} ns={ns} />
            <Line x1={20} y1={y0 - 50} x2={20} y2={y0 + 50} tone="soft" />
            <Line x1={20} y1={y0} x2={180} y2={y0} tone="soft" />
            <Trace t={t} x={20} y={y0} w={160} A={A} f={Math.sin} />
            <Label x={100} y={y0 + 70} kind="label">{labels ? labels[0] : `primary: ${np} turns`}</Label>
            <Line x1={460} y1={y0 - 50} x2={460} y2={y0 + 50} tone="soft" />
            <Line x1={460} y1={y0} x2={620} y2={y0} tone="soft" />
            <Trace t={t} x={460} y={y0} w={160} A={A2} f={(p) => -Math.sin(p)} />
            <Label x={540} y={y0 + 70} kind="label">{labels ? labels[1] : `secondary: ${ns} turns`}</Label>
            <Label x={320} y={190} kind="label">alternating flux in the iron core</Label>
            <Readout x={W - 12} y={20}>{labels ? 'V₂ / V₁ = N₂ / N₁' : `V₂ / V₁ = ${ns} / ${np}`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function TransformerDC({ height = 240 }: { height?: number }) {
  return (
    <Anim title="With a steady current in the primary the flux is steady and nothing is induced in the secondary; only the moment of switching on gives a brief spike" height={height} loop={9}>
      {(t) => {
        const on = ease(phase(t, 1.5, 2.1));
        const gx = 270, gw = 340;
        const tx = (tt: number) => gx + (tt / 9) * gw;
        const ip = (tt: number) => ease(phase(tt, 1.5, 2.1));
        const vs = (tt: number) => (tt > 1.4 && tt < 2.3 ? Math.sin(((tt - 1.5) / 0.6) * Math.PI) : 0) * (tt > 1.5 && tt < 2.1 ? 1 : 0);
        const upto = Math.min(9, t);
        const n = Math.max(2, Math.floor(upto * 20));
        const pts = (f: (tt: number) => number, y: number, A: number): Pt[] => curve(n, upto, (s) => [tx(s), y - A * f(s)] as Pt);
        return (
          <g>
            <Core x={30} y={40} w={190} h={130} flux={on * 0.6 + (t > 1.5 && t < 2.1 ? 0.5 : 0)} np={5} ns={5} />
            <Line x1={gx} y1={95} x2={gx + gw} y2={95} tone="soft" />
            <Line x1={gx} y1={50} x2={gx} y2={100} tone="soft" />
            <Trail points={pts(ip, 95, 40)} />
            <Ball x={tx(upto)} y={95 - 40 * ip(upto)} r={4.5} />
            <Label x={gx + 8} y={48} kind="sym" anchor="start">primary current</Label>
            <Line x1={gx} y1={190} x2={gx + gw} y2={190} tone="soft" />
            <Line x1={gx} y1={140} x2={gx} y2={206} tone="soft" />
            <Trail points={pts(vs, 190, 40)} />
            <Ball x={tx(upto)} y={190 - 40 * vs(upto)} r={4.5} />
            <Label x={gx + 8} y={148} kind="sym" anchor="start">secondary emf</Label>
            <Label x={125} y={200} kind="label">switch on at t = 1.5 s</Label>
            <Readout x={W - 12} y={height - 10}>{vs(upto) > 0.05 ? 'flux changing: emf' : 'flux steady: no emf'}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ why we transmit at high voltage

export function GridLoss({ height = 250 }: { height?: number }) {
  return (
    <Anim title="The same power sent at low voltage needs a large current and wastes much of it as heat in the wire; sent at high voltage the current is small and the loss tiny" height={height} loop={6}>
      {(t) => {
        const rows: { y: number; n: number; r: number; name: string; heat: number }[] = [
          { y: 70, n: 14, r: 4.5, name: 'low voltage: big current I, loss I²R', heat: 1 },
          { y: 180, n: 5, r: 2.6, name: 'high voltage: small current, tiny loss', heat: 0.04 },
        ];
        const x1 = 70, x2 = 570;
        return (
          <g>
            {rows.map((row) => (
              <g key={row.name}>
                <rect className="kit-block" x={20} y={row.y - 20} width={40} height={40} rx={3} />
                <Label x={40} y={row.y + 6} kind="sym">G</Label>
                <rect className="kit-block" x={580} y={row.y - 20} width={40} height={40} rx={3} />
                <Label x={600} y={row.y + 6} kind="sym">home</Label>
                <Line x1={60} y1={row.y} x2={x1} y2={row.y} tone="bright" />
                <Line x1={x1} y1={row.y} x2={x2} y2={row.y} tone="bright" />
                <Line x1={x2} y1={row.y} x2={580} y2={row.y} tone="bright" />
                {Array.from({ length: row.n }, (_, k) => {
                  const s = (k / row.n + t / (row.heat > 0.5 ? 1.5 : 3)) % 1;
                  return <Ball key={k} x={x1 + s * (x2 - x1)} y={row.y} r={row.r} glow={false} />;
                })}
                {Array.from({ length: 8 }, (_, k) => {
                  const hx = x1 + 30 + k * 62;
                  const ph = (t * 0.9 + k * 0.37) % 1;
                  return <circle key={k} cx={hx} cy={row.y - 14 - 22 * ph} r={1.5 + 6 * row.heat * (1 - ph)} fill="#fff" opacity={row.heat * 0.75 * (1 - ph)} />;
                })}
                <Label x={320} y={row.y + 44} kind="label">{row.name}</Label>
              </g>
            ))}
          </g>
        );
      }}
    </Anim>
  );
}
