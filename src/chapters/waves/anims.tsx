import type { ReactNode } from 'react';
import { Arrow, Ball, Label, Line, Trail, Wall, W, clamp, lerp, phase, Readout } from '../kit/Anim';

/** Picture functions for the waves chapter: each takes the looping time t and returns SVG. */

export const TAU = Math.PI * 2;
export const X0 = 40;
export const X1 = 600;
type P = [number, number];

export const pts = (f: (x: number) => number, a = X0, b = X1, n = 160): P[] => Array.from({ length: n + 1 }, (_, i) => {
  const x = lerp(a, b, i / n);
  return [x, f(x)] as P;
});
const gauss = (x: number, c: number, w = 26) => Math.exp(-(((x - c) / w) ** 2));
const mod = (a: number, b: number) => ((a % b) + b) % b;
const Dot = ({ x, y, r = 2.6 }: { x: number; y: number; r?: number }) => <circle className="fig-ball" cx={x} cy={y} r={r} />;

// ------------------------------------------------------------------ a travelling sine wave

/** The rope wave: one marked particle only bobs up and down while the wave moves along. */
export function ropeWave(t: number, o: { cy?: number; A?: number; lam?: number; T?: number; mx?: number; note?: string; notes?: boolean } = {}) {
  const { cy = 115, A = 38, lam = 160, T = 2, mx = 360, note = 'this particle only moves up and down', notes = true } = o;
  const k = TAU / lam;
  const w = TAU / T;
  const y = (x: number) => cy - A * Math.sin(k * (x - X0) - w * t);
  const dots = [];
  for (let x = X0; x <= X1; x += 40) dots.push(<Dot key={x} x={x} y={y(x)} />);
  return (
    <>
      <Line x1={X0} x2={X1} y1={cy} y2={cy} dashed tone="faint" />
      <Trail points={pts(y)} />
      {dots}
      <Line x1={mx} y1={cy - A - 12} x2={mx} y2={cy + A + 12} dashed />
      <Ball x={mx} y={y(mx)} />
      {notes && <Arrow x1={60} y1={cy - A - 16} x2={150} y2={cy - A - 16} />}
      {notes && (
        <Label x={105} y={cy - A - 26} kind="label">
          the wave moves
        </Label>
      )}
      <Label x={mx} y={cy + A + 30} kind="label">
        {note}
      </Label>
    </>
  );
}

export function transverse(t: number) {
  const cy = 80;
  const A = 28;
  const k = TAU / 200;
  const w = TAU / 2;
  const items = [];
  for (let i = 0; i <= 56; i++) {
    const x = X0 + i * 10;
    const ph = k * (x - X0) - w * t;
    items.push(i === 28 ? null : <Dot key={i} x={x} y={cy - A * Math.sin(ph)} r={2.4} />);
  }
  const mx = X0 + 280;
  const ph = k * 280 - w * t;
  return (
    <>
      <Line x1={X0} x2={X1} y1={cy} y2={cy} dashed tone="faint" />
      {items}
      <Ball x={mx} y={cy - A * Math.sin(ph)} />
      <Arrow x1={mx + 18} y1={cy - A * Math.sin(ph)} x2={mx + 18} y2={cy - A * Math.sin(ph) + 22 * Math.cos(ph)} />
      <Arrow x1={60} y1={140} x2={150} y2={140} />
      <Label x={105} y={130} kind="label">
        wave direction
      </Label>
      <Label x={X1 - 10} y={140} kind="label" anchor="end">
        particles move across the wave
      </Label>
    </>
  );
}

export function longitudinal(t: number, o: { cy?: number; height?: number } = {}) {
  const { cy = 70 } = o;
  const lam = 200;
  const k = TAU / lam;
  const w = TAU / 2;
  const s0 = 12;
  const ticks = [];
  let mark = 0;
  for (let i = 0; i <= 56; i++) {
    const X = i * 10;
    const x = X0 + X + s0 * Math.sin(k * X - w * t);
    if (i === 28) mark = x;
    else ticks.push(<Line key={i} x1={x} y1={cy - 26} x2={x} y2={cy + 26} />);
  }
  const ph = k * 280 - w * t;
  const labels = [];
  for (let n = -1; n < 4; n++) {
    const xc = X0 + mod((Math.PI + w * t) / k, lam) + n * lam;
    const xr = X0 + mod(w * t / k, lam) + n * lam;
    if (xc > 60 && xc < 580)
      labels.push(
        <Label key={'c' + n} x={xc} y={cy + 52} kind="sym">
          C
        </Label>,
      );
    if (xr > 60 && xr < 580)
      labels.push(
        <Label key={'r' + n} x={xr} y={cy + 52} kind="sym">
          R
        </Label>,
      );
  }
  return (
    <>
      {ticks}
      <Line x1={mark} y1={cy - 34} x2={mark} y2={cy + 34} tone="bright" />
      <Ball x={mark} y={cy} />
      <Arrow x1={mark} y1={cy - 44} x2={mark - 24 * Math.cos(ph)} y2={cy - 44} />
      {labels}
      <Label x={X0} y={cy + 86} kind="label" anchor="start">
        C = compression (squeezed)   R = rarefaction (spread out)
      </Label>
      <Arrow x1={X1 - 90} y1={cy + 80} x2={X1} y2={cy + 80} />
      <Label x={X1 - 100} y={cy + 86} kind="label" anchor="end">
        wave moves
      </Label>
    </>
  );
}

/** y = A sin(kx − ωt) with wavelength and amplitude marked on it. */
export function travelFig(t: number, lamLabel = 'λ', ampLabel = 'A', extra?: string) {
  const cy = 135;
  const A = 40;
  const lam = 160;
  const T = 2;
  const k = TAU / lam;
  const w = TAU / T;
  const y = (x: number) => cy - A * Math.sin(k * (x - X0) - w * t);
  const c1 = X0 + lam + mod((Math.PI / 2 + w * t) / k, lam);
  const c2 = c1 + lam;
  const by = cy - A - 26;
  return (
    <>
      <Line x1={X0} x2={X1} y1={cy} y2={cy} dashed tone="faint" />
      <Trail points={pts(y)} />
      <Line x1={c1} y1={cy - A} x2={c1} y2={by - 6} dashed tone="faint" />
      <Line x1={c2} y1={cy - A} x2={c2} y2={by - 6} dashed tone="faint" />
      <Arrow x1={c1} y1={by} x2={c2} y2={by} />
      <Arrow x1={c2} y1={by} x2={c1} y2={by} />
      <Label x={(c1 + c2) / 2} y={by - 8} kind="sym">
        {lamLabel}
      </Label>
      <Arrow x1={c1 - 14} y1={cy} x2={c1 - 14} y2={cy - A} />
      <Label x={c1 - 28} y={cy - A / 2 + 6} kind="sym">
        {ampLabel}
      </Label>
      <Ball x={c1} y={cy - A} r={4} />
      {extra && (
        <Label x={X1} y={cy + A + 32} kind="val" anchor="end">
          {extra}
        </Label>
      )}
    </>
  );
}

/** One crest followed along: in one period it moves one wavelength. */
export function speedFig(t: number) {
  const cy = 120;
  const A = 32;
  const lam = 140;
  const T = 2;
  const v = lam / T;
  const k = TAU / lam;
  const w = TAU / T;
  const y = (x: number) => cy - A * Math.sin(k * (x - X0) - w * t);
  const gate = 140;
  const c = gate - X0 - Math.PI / 2 / k;
  const t0 = c / v;
  const n = t >= t0 ? Math.floor((t - t0) / T) + 1 : 0;
  const xc = X0 + Math.PI / 2 / k + v * t;
  return (
    <>
      <Line x1={X0} x2={X1} y1={cy} y2={cy} dashed tone="faint" />
      <Trail points={pts(y)} />
      <Line x1={gate} y1={cy - 62} x2={gate} y2={cy + 62} dashed />
      <Label x={gate} y={cy + 80} kind="label">
        a fixed point
      </Label>
      <Readout>
        waves passed: {n}
      </Readout>
      {xc < X1 && <Ball x={xc} y={cy - A} />}
      <Label x={X1} y={cy + 80} kind="label" anchor="end">
        1 wavelength per period: v = λ / T = f · λ
      </Label>
    </>
  );
}

// ------------------------------------------------------------------ speed in a medium

export function ropeRows(t: number, rows: { v: number; label: string; val: string }[]) {
  return (
    <>
      {rows.map((r, i) => {
        const cy = 62 + i * 112;
        const xc = X0 + 1.4 * r.v * t;
        return (
          <g key={i}>
            <Line x1={X0} x2={X1} y1={cy} y2={cy} dashed tone="faint" />
            <Trail points={pts((x) => cy - 36 * gauss(x, xc, 26), X0, X1, 200)} />
            <Wall x={X0} y1={cy - 20} y2={cy + 20} />
            <Label x={X0 + 12} y={cy + 40} kind="label" anchor="start">
              {r.label}
            </Label>
            <Label x={X1} y={cy + 40} kind="val" anchor="end">
              {r.val}
            </Label>
          </g>
        );
      })}
    </>
  );
}

export function soundRows(t: number) {
  const rows = [
    { v: 280, label: 'Newton: 280 m/s', cy: 50 },
    { v: 332, label: 'Laplace: 332 m/s (matches experiment)', cy: 120 },
  ];
  return (
    <>
      {rows.map((r) => {
        const xc = X0 + 0.7 * r.v * t;
        const ticks = [];
        for (let i = 0; i <= 56; i++) {
          const X = X0 + i * 10;
          ticks.push(<Line key={i} x1={X + 10 * gauss(X, xc, 30)} y1={r.cy - 16} x2={X + 10 * gauss(X, xc, 30)} y2={r.cy + 16} />);
        }
        return (
          <g key={r.label}>
            {ticks}
            <Label x={X0} y={r.cy + 38} kind="label" anchor="start">
              {r.label}
            </Label>
          </g>
        );
      })}
    </>
  );
}

// ------------------------------------------------------------------ superposition and reflection

export function pulsesFig(t: number, s2: 1 | -1, cy = 105) {
  const v = 65;
  const x1 = 60 + v * t;
  const x2 = 580 - v * t;
  const A = 34;
  const y1 = (x: number) => A * gauss(x, x1, 28);
  const y2 = (x: number) => s2 * A * gauss(x, x2, 28);
  const near = Math.abs(x1 - x2) < 70;
  return (
    <>
      <Line x1={X0} x2={X1} y1={cy} y2={cy} dashed tone="faint" />
      <Trail points={pts((x) => cy - y1(x))} dashed tone="soft" />
      <Trail points={pts((x) => cy - y2(x))} dashed tone="soft" />
      <Trail points={pts((x) => cy - y1(x) - y2(x), X0, X1, 220)} />
      <Label x={X0} y={cy + 70} kind="label" anchor="start">
        dashed: each pulse alone   solid: what the rope really does
      </Label>
      {near && (
        <Label x={(x1 + x2) / 2} y={s2 === 1 ? cy - 2 * A - 10 : cy + 28} kind="sym">
          y = y₁ + y₂
        </Label>
      )}
    </>
  );
}

export function reflRow(t: number, cy: number, fixed: boolean, caption: string) {
  const L = 580;
  const v = 130;
  const xc = 70 + v * t;
  const A = 34;
  const s = fixed ? -1 : 1;
  const y = (x: number) => A * gauss(x, xc, 24) + s * A * gauss(x, 2 * L - xc, 24);
  const end = y(L);
  return (
    <>
      <Line x1={X0} x2={L} y1={cy} y2={cy} dashed tone="faint" />
      <Trail points={pts((x) => cy - y(x), X0, L, 220)} />
      {fixed ? <Wall x={L} y1={cy - 46} y2={cy + 46} side={1} /> : <Line x1={L} y1={cy - 60} x2={L} y2={cy + 60} tone="bright" />}
      {!fixed && <Ball x={L} y={cy - end} r={5} />}
      <Label x={X0} y={cy + 54} kind="label" anchor="start">
        {caption}
      </Label>
    </>
  );
}

// ------------------------------------------------------------------ standing waves and pipes

export function stand(t: number, cy: number, n: number, label: string, A = 30) {
  const a = 60;
  const L = 520;
  const c = Math.cos(n * Math.PI * t);
  const sh = (x: number) => Math.sin((n * Math.PI * (x - a)) / L);
  const nodes = [];
  for (let m = 0; m <= n; m++) nodes.push(<Ball key={m} x={a + (m * L) / n} y={cy} r={4.5} ghost />);
  return (
    <>
      <Trail points={pts((x) => cy - A * sh(x), a, a + L)} dashed tone="faint" />
      <Trail points={pts((x) => cy + A * sh(x), a, a + L)} dashed tone="faint" />
      <Trail points={pts((x) => cy - A * sh(x) * c, a, a + L)} />
      {nodes}
      <Label x={X1 - 10} y={cy - 36} kind="label" anchor="end">
        {label}
      </Label>
    </>
  );
}

export function pipeRow(t: number, cy: number, kind: 'open' | 'closed', m: number, label: string) {
  const px = 100;
  const L = 440;
  const disp = (u: number) => (kind === 'open' ? Math.cos((m * Math.PI * u) / L) : Math.sin((m * Math.PI * u) / (2 * L)));
  const c = Math.cos(TAU * 0.5 * m * t);
  const dots = [];
  for (let i = 0; i < 44; i++) {
    const u = ((i + 0.5) * L) / 44;
    for (const r of [-1, 0, 1]) dots.push(<Dot key={i * 3 + r} x={px + u + 9 * disp(u) * c} y={cy + r * 13} r={2.2} />);
  }
  const yb = cy - 46;
  const marks: ReactNode[] = [];
  const nodesU: number[] = [];
  const antiU: number[] = [];
  if (kind === 'open') {
    for (let j = 0; j <= m; j++) antiU.push((j * L) / m);
    for (let j = 0; j < m; j++) nodesU.push(((j + 0.5) * L) / m);
  } else {
    for (let j = 0; j <= (m - 1) / 2; j++) nodesU.push((2 * L * j) / m);
    for (let j = 0; j <= (m - 1) / 2; j++) antiU.push((L * (2 * j + 1)) / m);
  }
  nodesU.forEach((u, i) => marks.push(<Label key={'n' + i} x={px + u} y={cy + 42} kind="sym">N</Label>));
  antiU.forEach((u, i) => marks.push(<Label key={'a' + i} x={px + u} y={cy + 42} kind="sym">A</Label>));
  return (
    <>
      <Line x1={px} y1={cy - 24} x2={px + L} y2={cy - 24} tone="bright" />
      <Line x1={px} y1={cy + 24} x2={px + L} y2={cy + 24} tone="bright" />
      {kind === 'closed' && <Wall x={px} y1={cy - 24} y2={cy + 24} />}
      <Trail points={pts((x) => yb - 12 * disp(x - px), px, px + L, 120)} dashed tone="soft" />
      <Trail points={pts((x) => yb + 12 * disp(x - px), px, px + L, 120)} dashed tone="soft" />
      {dots}
      {marks}
      <Label x={px + L / 2} y={cy + 62} kind="label">
        {label}
      </Label>
    </>
  );
}

// ------------------------------------------------------------------ beats

export function beatsFig(t: number, f1: number, f2: number, note: string) {
  const a = 16;
  const p = phase(t, 0.4, 5.2);
  const xr = X0 + 560 * p;
  const row = (cy: number, f: number, name: string) => (
    <g>
      <Trail points={pts((x) => cy - a * Math.sin(TAU * f * ((x - X0) / 560)), X0, X1, 400)} tone="soft" />
      <Label x={X0 - 6} y={cy + 5} kind="sym" anchor="end">
        {name}
      </Label>
    </g>
  );
  const cy3 = 190;
  const env = (x: number) => 2 * a * Math.abs(Math.cos(Math.PI * (f2 - f1) * ((x - X0) / 560)));
  return (
    <>
      {row(40, f1, 'f₁')}
      {row(100, f2, 'f₂')}
      <Line x1={X0} x2={X1} y1={cy3} y2={cy3} dashed tone="faint" />
      <g opacity={phase(t, 5.2, 6)}>
        <Trail points={pts((x) => cy3 - env(x), X0, X1, 400)} dashed tone="soft" />
        <Trail points={pts((x) => cy3 + env(x), X0, X1, 400)} dashed tone="soft" />
      </g>
      <Trail points={pts((x) => cy3 - a * (Math.sin(TAU * f1 * ((x - X0) / 560)) + Math.sin(TAU * f2 * ((x - X0) / 560))), X0, xr, 500)} />
      <Line x1={xr} y1={20} x2={xr} y2={235} dashed tone="faint" />
      <Label x={X0 - 6} y={cy3 + 5} kind="sym" anchor="end">
        sum
      </Label>
      <Label x={X1} y={246} kind="label" anchor="end">
        {note}
      </Label>
    </>
  );
}

// ------------------------------------------------------------------ Doppler

export function dopplerSource(t: number, M: number, front: string, back: string) {
  const v = 70;
  const T0 = 0.4;
  const vs = M * v;
  const tau = t + 2;
  const cy = 140;
  const rings = [];
  for (let k = 0; k * T0 <= tau; k++) {
    const age = tau - k * T0;
    if (age > 1.7) continue;
    const op = clamp(1 - age / 1.7);
    rings.push(<circle key={k} className="fig-guide" fill="none" cx={100 + vs * k * T0} cy={cy} r={v * age} opacity={0.25 + 0.75 * op} />);
  }
  const xs = 100 + vs * tau;
  return (
    <>
      {rings}
      <Ball x={xs} y={cy} />
      <Arrow x1={xs + 14} y1={cy} x2={xs + 14 + 8 + 60 * M} y2={cy} />
      <Label x={X1 - 20} y={286} kind="label" anchor="end">
        {front}
      </Label>
      <Label x={X0 + 20} y={286} kind="label" anchor="start">
        {back}
      </Label>
    </>
  );
}

export function dopplerObserver(t: number) {
  const v = 140;
  const T0 = 0.4;
  const u = 50;
  const xa = 200;
  const xb = 200 + u * t;
  let na = 0;
  let nb = 0;
  const fronts = [];
  for (let k = 0; k * T0 <= t; k++) {
    const x = 600 - v * (t - k * T0);
    if (x >= X0) fronts.push(<Line key={k} x1={x} y1={22} x2={x} y2={218} tone="soft" />);
    if (x <= xa) na++;
    if (x <= xb) nb++;
  }
  return (
    <>
      {fronts}
      <Line x1={X0} x2={X1} y1={85} y2={85} dashed tone="faint" />
      <Line x1={X0} x2={X1} y1={170} y2={170} dashed tone="faint" />
      <Ball x={xa} y={85} />
      <Ball x={xb} y={170} />
      <Arrow x1={xb + 12} y1={170} x2={xb + 42} y2={170} />
      <Label x={X0} y={64} kind="label" anchor="start">
        observer at rest: {na} crests, 2.5 per second
      </Label>
      <Label x={X0} y={149} kind="label" anchor="start">
        observer moving toward the source: {nb} crests, 3.4 per second
      </Label>
      <Ball x={W - 25} y={128} r={6.5} />
    </>
  );
}
