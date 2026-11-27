import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Label, Line, Trail, clamp, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for wave optics. Positions come from the real physics, scaled to pixels. */

const TAU = 2 * Math.PI;
const DEG = Math.PI / 180;
type Pt = [number, number];

/** Sample f(s) for s in [0, span] into points. */
function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

const frac = (x: number) => x - Math.floor(x);
const sinc2 = (x: number) => (Math.abs(x) < 1e-6 ? 1 : (Math.sin(x) / x) ** 2);

/** A circle outline with a given opacity. */
function Ring({ x, y, r, tone = 'soft', op = 1 }: { x: number; y: number; r: number; tone?: 'bright' | 'soft'; op?: number }) {
  if (r <= 0.5 || op <= 0.01) return null;
  return <circle className={tone === 'bright' ? 'fig-path' : 'fig-guide'} cx={x} cy={y} r={r} fill="none" style={{ opacity: op }} />;
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

/** A label that fades in between two moments. */
function Fade({ t, a, b = a + 0.6, children }: { t: number; a: number; b?: number; children: ReactNode }) {
  return <g style={{ opacity: phase(t, a, b) }}>{children}</g>;
}

// ------------------------------------------------------------------ beams of wavefronts

/** Clip the segment P to Q so that its y stays within [lo, hi]. */
function clipY(P: Pt, Q: Pt, lo: number, hi: number): [Pt, Pt] | null {
  const dy = Q[1] - P[1];
  let qa = 0;
  let qb = 1;
  if (Math.abs(dy) < 1e-6) {
    if (P[1] < lo || P[1] > hi) return null;
  } else {
    const q1 = (lo - P[1]) / dy;
    const q2 = (hi - P[1]) / dy;
    qa = Math.max(0, Math.min(q1, q2));
    qb = Math.min(1, Math.max(q1, q2));
    if (qa >= qb) return null;
  }
  const at = (q: number): Pt => [P[0] + q * (Q[0] - P[0]), P[1] + q * (Q[1] - P[1])];
  return [at(qa), at(qb)];
}

/**
 * Wavefronts of a beam that meets a horizontal surface at height y0 between x = ax and x = bx.
 * d is the unit direction of travel; the fronts are lam apart and advance as f (in wavelengths) grows.
 */
function Beam({ ax, bx, y0, d, lam, f, lo, hi, tone = 'bright' }: { ax: number; bx: number; y0: number; d: Pt; lam: number; f: number; lo: number; hi: number; tone?: 'bright' | 'soft' }) {
  const out: ReactNode[] = [];
  for (let k = -60; k <= 60; k++) {
    const s = lam * (k + f);
    const ta = s - ax * d[0];
    const tb = s - bx * d[0];
    const P: Pt = [ax + d[0] * ta, y0 + d[1] * ta];
    const Q: Pt = [bx + d[0] * tb, y0 + d[1] * tb];
    const c = clipY(P, Q, lo, hi);
    if (c) out.push(<Line key={k} x1={c[0][0]} y1={c[0][1]} x2={c[1][0]} y2={c[1][1]} tone={tone} />);
  }
  return <g>{out}</g>;
}

// ------------------------------------------------------------------ what is a wavefront

export function Wavefronts() {
  return (
    <Anim title="A point source sends out circular wavefronts that spread; far from the source they look flat, and the rays are arrows at right angles to the wavefronts" height={230} loop={6}>
      {(t) => {
        const sx = 70, sy = 115, lam = 40;
        const f = (t / 6) * 3;
        const rings: ReactNode[] = [];
        for (let k = 0; k < 15; k++) {
          const r = lam * (k + frac(f));
          rings.push(<Ring key={k} x={sx} y={sy} r={r} tone={k % 3 === 0 ? 'bright' : 'soft'} op={clamp(1 - r / 600) * clamp(r / 8)} />);
        }
        const rays = [-30, -15, 0, 15, 30].map((a) => {
          const th = a * DEG;
          const run = 90 + 400 * frac(t / 3);
          return <Ball key={a} x={sx + run * Math.cos(th)} y={sy + run * Math.sin(th)} r={3.5} glow={false} />;
        });
        return (
          <g>
            {rings}
            {[-30, -15, 0, 15, 30].map((a) => (
              <Line key={a} x1={sx} y1={sy} x2={sx + 560 * Math.cos(a * DEG)} y2={sy + 560 * Math.sin(a * DEG)} tone="soft" dashed />
            ))}
            {rays}
            <Ball x={sx} y={sy} r={7 + 1.5 * Math.sin(TAU * t)} />
            <Label x={sx} y={sy + 26} kind="label">source</Label>
            <Fade t={t} a={1}>
              <Label x={170} y={34} kind="label">curved wavefronts</Label>
            </Fade>
            <Fade t={t} a={2}>
              <Label x={500} y={34} kind="label">far away: almost flat</Label>
            </Fade>
            <Label x={W - 14} y={218} kind="label" anchor="end">rays are at right angles to the wavefronts</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ Huygens

/** Huygens: every point on a wavefront is a source of little wavelets; their envelope is the next wavefront. */
export function Huygens({ mode = 'plane' }: { mode?: 'plane' | 'sphere' }) {
  return (
    <Anim title={mode === 'plane' ? 'Points on a flat wavefront each send out a little wavelet; the common tangent of the wavelets is the next flat wavefront' : 'Points on a curved wavefront each send out a little wavelet; the common envelope is the next curved wavefront, a larger circle'} height={240} loop={8}>
      {(t) => {
        const r = 70 * ease(phase(t, 0.8, 4.8));
        const pts: { p: Pt; a: number }[] = [];
        if (mode === 'plane') for (let y = 40; y <= 200; y += 20) pts.push({ p: [200, y], a: 0 });
        else for (let a = -50; a <= 50; a += 10) pts.push({ p: [60 + 150 * Math.cos(a * DEG), 120 + 150 * Math.sin(a * DEG)], a: a * DEG });
        const env: Pt[] = pts.map(({ p, a }) => [p[0] + r * Math.cos(a), p[1] + r * Math.sin(a)]);
        const old: Pt[] = pts.map(({ p }) => p);
        return (
          <g>
            <Trail points={old} tone="soft" dashed />
            {pts.map(({ p, a }, i) => (
              <g key={i}>
                <Trail points={curve(24, Math.PI, (u) => [p[0] + r * Math.cos(a - Math.PI / 2 + u), p[1] + r * Math.sin(a - Math.PI / 2 + u)])} tone="soft" />
                <Ball x={p[0]} y={p[1]} r={3 + 0.8 * Math.sin(TAU * t + i)} glow={false} />
              </g>
            ))}
            <Trail points={env} />
            {r > 5 && <Ball x={env[Math.floor(env.length / 2)][0]} y={env[Math.floor(env.length / 2)][1]} r={4} glow={false} />}
            <Fade t={t} a={0.3}>
              <Label x={mode === 'plane' ? 200 : 60 + 150} y={mode === 'plane' ? 24 : 36} kind="label">wavefront now</Label>
            </Fade>
            <Fade t={t} a={4.5}>
              <Label x={mode === 'plane' ? 200 + 70 : 60 + 150 + 70} y={mode === 'plane' ? 230 : 214} kind="label" anchor={mode === 'plane' ? 'start' : 'middle'}>wavefront a moment later</Label>
            </Fade>
            <Fade t={t} a={2}>
              <Label x={W - 14} y={24} kind="label" anchor="end">each wavelet has radius v · t</Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ reflection and refraction

export function Reflect({ i = 35, height = 250 }: { i?: number; height?: number }) {
  return (
    <Anim title="A beam of flat wavefronts hits a mirror and bounces off; the reflected fronts leave at the same angle to the normal as the incident ones arrived" height={height} loop={8}>
      {(t) => {
        const y0 = height - 40;
        const a = i * DEG;
        const lam = 30;
        const f = t / 0.5;
        const xa = 240, xb = 350, xc = (xa + xb) / 2;
        const din: Pt = [Math.sin(a), Math.cos(a)];
        const dre: Pt = [Math.sin(a), -Math.cos(a)];
        const L = 150;
        const dotT = (t % 4) / 4;
        const dotPos: Pt = dotT < 0.5 ? [xc - din[0] * L * (1 - dotT * 2), y0 - din[1] * L * (1 - dotT * 2)] : [xc + dre[0] * L * (dotT * 2 - 1), y0 + dre[1] * L * (dotT * 2 - 1)];
        return (
          <g>
            <Line x1={60} y1={y0} x2={580} y2={y0} tone="bright" />
            {Array.from({ length: 36 }, (_, k) => (
              <Line key={k} x1={66 + k * 14.5} y1={y0 + 2} x2={58 + k * 14.5} y2={y0 + 10} tone="soft" />
            ))}
            <Line x1={xc} y1={y0} x2={xc} y2={y0 - 170} tone="soft" dashed />
            <Label x={xc + 8} y={y0 - 175} kind="sym" anchor="start">normal</Label>
            <Beam ax={xa} bx={xb} y0={y0} d={din} lam={lam} f={f} lo={14} hi={y0} />
            <Beam ax={xa} bx={xb} y0={y0} d={dre} lam={lam} f={f} lo={14} hi={y0} tone="soft" />
            <Arrow x1={xc - din[0] * L} y1={y0 - din[1] * L} x2={xc - din[0] * 40} y2={y0 - din[1] * 40} tone="soft" dashed />
            <Arrow x1={xc + dre[0] * 40} y1={y0 + dre[1] * 40} x2={xc + dre[0] * L} y2={y0 + dre[1] * L} tone="soft" dashed />
            <path className="fig-guide" d={`M${xc - 50 * Math.sin(a)} ${y0 - 50 * Math.cos(a)}A50 50 0 0 1 ${xc} ${y0 - 50}`} fill="none" />
            <path className="fig-guide" d={`M${xc} ${y0 - 70}A70 70 0 0 1 ${xc + 70 * Math.sin(a)} ${y0 - 70 * Math.cos(a)}`} fill="none" />
            <Label x={xc - 32} y={y0 - 62} kind="sym">i</Label>
            <Label x={xc + 38} y={y0 - 86} kind="sym">r</Label>
            <Ball x={dotPos[0]} y={dotPos[1]} r={4.5} />
            <Label x={90} y={30} kind="label" anchor="start">incident fronts (bright)</Label>
            <Label x={90} y={48} kind="label" anchor="start">reflected fronts (faint)</Label>
            <Readout2 t={t}>i = r</Readout2>
          </g>
        );
      }}
    </Anim>
  );
}

/** A top-right readout that breathes gently. */
function Readout2({ t, children }: { t: number; children: ReactNode }) {
  return (
    <text className="fig-val fig-clock" x={W - 12} y={20} textAnchor="end" style={{ opacity: 0.7 + 0.3 * Math.sin(TAU * t / 2) }}>
      {children}
    </text>
  );
}

export function Refract({ n1 = 1, n2 = 1.5, i = 40, height = 270, label }: { n1?: number; n2?: number; i?: number; height?: number; label?: string }) {
  return (
    <Anim title="A beam of wavefronts crosses from one medium into another; the fronts bunch up and the beam bends because the wave travels at a different speed" height={height} loop={10}>
      {(t) => {
        const y0 = height * 0.5;
        const a = i * DEG;
        const s2 = (n1 * Math.sin(a)) / n2;
        const rr = Math.asin(Math.min(1, s2));
        const lam1 = 30;
        const lam2 = (lam1 * n1) / n2;
        const T0 = 0.4;
        const f = t / T0;
        const xa = 250, xb = 340, xc = (xa + xb) / 2;
        const d1: Pt = [Math.sin(a), Math.cos(a)];
        const d2: Pt = [Math.sin(rr), Math.cos(rr)];
        const v1 = lam1 / T0;
        const v2 = lam2 / T0;
        const run = 120;
        const u = t % 5;
        const tin = run / v1;
        const dot: Pt = u < tin ? [xc - d1[0] * (run - v1 * u), y0 - d1[1] * (run - v1 * u)] : [xc + d2[0] * v2 * (u - tin), y0 + d2[1] * v2 * (u - tin)];
        return (
          <g>
            <rect x={0} y={y0} width={W} height={height - y0} fill="#fff" opacity={0.07} />
            <Line x1={0} y1={y0} x2={W} y2={y0} tone="bright" />
            <Line x1={xc} y1={y0 - 120} x2={xc} y2={y0 + 120} tone="soft" dashed />
            <Beam ax={xa} bx={xb} y0={y0} d={d1} lam={lam1} f={f} lo={12} hi={y0} />
            <Beam ax={xa} bx={xb} y0={y0} d={d2} lam={lam2} f={f} lo={y0} hi={height - 10} />
            <Arrow x1={xc - d1[0] * 140} y1={y0 - d1[1] * 140} x2={xc - d1[0] * 45} y2={y0 - d1[1] * 45} tone="soft" dashed />
            <Arrow x1={xc + d2[0] * 45} y1={y0 + d2[1] * 45} x2={xc + d2[0] * 140} y2={y0 + d2[1] * 140} tone="soft" dashed />
            <Ball x={dot[0]} y={dot[1]} r={4.5} />
            <Label x={90} y={30} kind="val" anchor="start">{label ?? `n₁ = ${n1}`}</Label>
            <Label x={90} y={y0 + 28} kind="val" anchor="start">{`n₂ = ${n2}`}</Label>
            <Fade t={t} a={1.5}>
              <Label x={W - 14} y={30} kind="label" anchor="end">wide spacing: fast</Label>
              <Label x={W - 14} y={y0 + 28} kind="label" anchor="end">{n2 > n1 ? 'closer spacing: slower, bends toward the normal' : 'wider spacing: faster, bends away from the normal'}</Label>
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

/** Huygens' construction of Snell's law: a front sweeps across the interface while a wavelet grows from A. */
export function SnellGeometry() {
  return (
    <Anim title="A wavefront reaches the boundary at A; while its far end C travels to E in the first medium, a wavelet from A grows in the second medium; the common tangent from E is the refracted front" height={270} loop={9}>
      {(t) => {
        const y0 = 150;
        const ia = 40 * DEG;
        const n = 1.5;
        const ra = Math.asin(Math.sin(ia) / n);
        const A: Pt = [150, y0];
        const L = 130;
        const nh: Pt = [Math.cos(ia), -Math.sin(ia)];
        const d1: Pt = [Math.sin(ia), Math.cos(ia)];
        const d2: Pt = [Math.sin(ra), Math.cos(ra)];
        const C: Pt = [A[0] + L * nh[0], A[1] + L * nh[1]];
        const CE = L * Math.tan(ia);
        const tau = ease(phase(t, 0.8, 5.5));
        const v1t = CE * tau;
        const v2t = (CE / n) * tau;
        const Ct: Pt = [C[0] + d1[0] * v1t, C[1] + d1[1] * v1t];
        const X: Pt = [A[0] + v1t / Math.sin(ia), y0];
        const Wp: Pt = [A[0] + d2[0] * v2t, A[1] + d2[1] * v2t];
        const E: Pt = [A[0] + L / Math.cos(ia), y0];
        const show = phase(t, 5.6, 6.4);
        const F: Pt = [A[0] + d2[0] * (CE / n), A[1] + d2[1] * (CE / n)];
        return (
          <g>
            <rect x={0} y={y0} width={W} height={270 - y0} fill="#fff" opacity={0.07} />
            <Line x1={40} y1={y0} x2={600} y2={y0} tone="bright" />
            <Line x1={A[0]} y1={y0 - 110} x2={A[0]} y2={y0 + 100} tone="soft" dashed />
            <Line x1={C[0]} y1={C[1]} x2={A[0]} y2={A[1]} tone="soft" dashed />
            <Line x1={C[0]} y1={C[1]} x2={E[0]} y2={E[1]} tone="soft" dashed />
            <Trail points={curve(40, Math.PI, (u) => [A[0] + v2t * Math.cos(u), A[1] + v2t * Math.sin(u)])} tone="soft" />
            <Line x1={Ct[0]} y1={Ct[1]} x2={X[0]} y2={X[1]} />
            {v2t > 4 && <Line x1={X[0]} y1={X[1]} x2={Wp[0]} y2={Wp[1]} />}
            <Ball x={Ct[0]} y={Ct[1]} r={4} glow={false} />
            <Ball x={Wp[0]} y={Wp[1]} r={4} glow={false} />
            <Label x={A[0] - 12} y={y0 - 8} kind="sym" anchor="end">A</Label>
            <Label x={C[0] - 10} y={C[1] - 4} kind="sym" anchor="end">C</Label>
            <Label x={E[0] + 12} y={y0 - 8} kind="sym" anchor="start">E</Label>
            <g style={{ opacity: show }}>
              <Line x1={E[0]} y1={E[1]} x2={F[0]} y2={F[1]} tone="bright" />
              <Line x1={A[0]} y1={A[1]} x2={F[0]} y2={F[1]} tone="soft" dashed />
              <Label x={F[0] - 10} y={F[1] + 16} kind="sym" anchor="end">F</Label>
              <Label x={A[0] + 48} y={y0 - 14} kind="sym">i</Label>
              <Label x={E[0] - 40} y={y0 + 24} kind="sym">r</Label>
              <Label x={(C[0] + E[0]) / 2 + 22} y={(C[1] + E[1]) / 2 - 4} kind="sym" anchor="start">CE = v₁τ</Label>
              <Label x={A[0] + 40} y={y0 + 70} kind="sym" anchor="start">AF = v₂τ</Label>
            </g>
            <Label x={90} y={28} kind="label" anchor="start">medium 1: speed v₁</Label>
            <Label x={90} y={y0 + 30} kind="label" anchor="start">medium 2: speed v₂ (slower)</Label>
            <Label x={W - 14} y={28} kind="val" anchor="end">{`τ = ${(tau).toFixed(2)} of the trip`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ superposition and coherence

export function WaveSum() {
  return (
    <Anim title="Two waves of the same size are added point by point; when they are in step the total is twice as big, and when they are exactly out of step they cancel" height={250} loop={10}>
      {(t) => {
        const x0 = 40, wx = 440, y0 = 125, A = 36;
        const k = TAU / 150;
        const phi = TAU * ease(phase(t, 0.5, 9.5));
        const w1 = (x: number) => Math.sin(k * x - TAU * t * 0.6);
        const w2 = (x: number) => Math.sin(k * x - TAU * t * 0.6 + phi);
        const amp = Math.abs(2 * Math.cos(phi / 2));
        const bx = 560;
        return (
          <g>
            <Axes x={x0} y={y0} w={wx} h={A * 2 + 10} below={A * 2 + 10} xLabel="x" />
            <Trail points={curve(120, wx - 20, (s) => [x0 + s, y0 - A * w1(s)])} tone="soft" />
            <Trail points={curve(120, wx - 20, (s) => [x0 + s, y0 - A * w2(s)])} tone="soft" dashed />
            <Trail points={curve(120, wx - 20, (s) => [x0 + s, y0 - A * (w1(s) + w2(s))])} />
            <Key x={x0 + 4} y={238} name="wave 1" tone="soft" />
            <Key x={x0 + 100} y={238} name="wave 2" tone="soft" dashed />
            <Key x={x0 + 196} y={238} name="sum" />
            <Line x1={bx} y1={y0 + 2 * A} x2={bx} y2={y0 - 2 * A} tone="soft" dashed />
            <rect className="fig-bar" x={bx - 10} y={y0 - A * amp} width={20} height={A * amp * 2} fill="#fff" opacity={0.85} />
            <Label x={bx} y={y0 - 2 * A - 12} kind="label">amplitude</Label>
            <Label x={bx} y={y0 + 2 * A + 20} kind="val">{`${amp.toFixed(2)} A`}</Label>
            <Label x={W - 14} y={20} kind="val" anchor="end">{`phase difference = ${(phi / Math.PI).toFixed(2)} π`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Coherent sources keep a fixed phase difference; incoherent ones change it at random. */
export function Coherence() {
  const hash = (n: number) => frac(Math.sin(n * 91.7 + 3.1) * 43758.5453);
  return (
    <Anim title="Two waves that keep the same phase difference add to a steady total; two waves whose phase difference jumps at random give a total that flickers, so no steady pattern appears" height={250} loop={9}>
      {(t) => {
        const rows: [number, string, boolean][] = [
          [66, 'coherent: fixed phase difference', true],
          [186, 'incoherent: phase jumps at random', false],
        ];
        const x0 = 40, wx = 420, A = 22;
        return (
          <g>
            {rows.map(([y, name, coh]) => {
              const phiAt = (tt: number) => (coh ? 1.2 : TAU * hash(Math.floor(tt / 1.2)));
              const amp = (tt: number) => Math.abs(2 * Math.cos(phiAt(tt) / 2));
              const now = x0 + wx - 10;
              const pps = 50;
              const sumAt = (tt: number) => Math.sin(TAU * 1.1 * tt) + Math.sin(TAU * 1.1 * tt + phiAt(tt));
              return (
                <g key={name}>
                  <Line x1={x0} y1={y} x2={x0 + wx} y2={y} tone="soft" dashed />
                  <Trail points={curve(200, wx / pps, (u) => [now - u * pps, y - A * 0.9 * sumAt(t - u)])} />
                  <Ball x={now} y={y - A * 0.9 * sumAt(t)} r={4} glow={false} />
                  <Label x={x0} y={y - 40} kind="label" anchor="start">{name}</Label>
                  <rect className="fig-bar" x={530} y={y - A * amp(t)} width={22} height={A * amp(t) * 2} fill="#fff" opacity={0.85} />
                  <Label x={541} y={y + 42} kind="val">{`${amp(t).toFixed(2)} A`}</Label>
                </g>
              );
            })}
            <Label x={541} y={22} kind="label">amplitude</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ two-source interference

export function TwoSources() {
  return (
    <Anim title="Two point sources in step send out circular waves; the dots mark where two crests meet, and they slide along straight lines of constructive interference" height={250} loop={6}>
      {(t) => {
        const lam = 20;
        const x0 = 50, y1 = 85, y2 = 165, D = y2 - y1;
        const f = t / 1;
        const rings: ReactNode[] = [];
        const dots: ReactNode[] = [];
        for (let k = 0; k < 34; k++) {
          const ra = lam * (k + frac(f));
          if (ra > 20) {
            rings.push(<Ring key={`a${k}`} x={x0} y={y1} r={ra} op={0.22} />);
            rings.push(<Ring key={`b${k}`} x={x0} y={y2} r={ra} op={0.22} />);
          }
          for (let j = k - 4; j <= k + 4; j++) {
            if (j < 0) continue;
            const rb = lam * (j + frac(f));
            if (ra < 6 || rb < 6) continue;
            const a = (ra * ra - rb * rb + D * D) / (2 * D);
            const h2 = ra * ra - a * a;
            if (h2 <= 0) continue;
            const px = x0 + Math.sqrt(h2);
            if (px < 640) dots.push(<circle key={`${k}-${j}`} className="fig-ball" cx={px} cy={y1 + a} r={2.4} />);
          }
        }
        const my = (y1 + y2) / 2;
        return (
          <g>
            {rings}
            {[-2, -1, 0, 1, 2].map((n) => {
              const s = (n * lam) / D;
              const th = Math.asin(Math.max(-1, Math.min(1, s)));
              return (
                <g key={n}>
                  <Line x1={x0} y1={my} x2={x0 + 560 * Math.cos(th)} y2={my + 560 * Math.sin(th)} tone="soft" dashed />
                  <Label x={W - 20} y={my + (W - 20 - x0) * Math.tan(th) + 4} kind="val" anchor="end">{`n = ${n}`}</Label>
                </g>
              );
            })}
            {dots}
            <Ball x={x0} y={y1} r={6 + Math.sin(TAU * f)} />
            <Ball x={x0} y={y2} r={6 + Math.sin(TAU * f)} />
            <Label x={x0 - 14} y={y1 + 4} kind="sym" anchor="end">S₁</Label>
            <Label x={x0 - 14} y={y2 + 4} kind="sym" anchor="end">S₂</Label>
            <Label x={W - 14} y={16} kind="label" anchor="end">dots: crest meets crest</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ Young's experiment

const YOUNG = { x1: 100, d: 56, screen: 440, ym: 125, lam: 16 };

export function PathDifference() {
  return (
    <Anim title="A point P slides along the screen; the two distances from the slits differ by a path difference, and where it is a whole number of wavelengths the screen is bright" height={250} loop={10}>
      {(t) => {
        const { x1, d, screen, ym, lam } = YOUNG;
        const yS1 = ym - d / 2, yS2 = ym + d / 2;
        const yP = ym + 95 * Math.sin((TAU * t) / 10);
        const r1 = Math.hypot(screen - x1, yP - yS1);
        const r2 = Math.hypot(screen - x1, yP - yS2);
        const dl = r2 - r1;
        const n = dl / lam;
        const near = Math.abs(n - Math.round(n));
        const status = near < 0.1 ? 'bright' : Math.abs(near - 0.5) < 0.1 ? 'dark' : '';
        const u2: Pt = [(x1 - screen) / r2, (yS2 - yP) / r2];
        const Q: Pt = [screen + u2[0] * r1, yP + u2[1] * r1];
        const I = Math.cos((Math.PI * dl) / lam) ** 2;
        return (
          <g>
            <Line x1={x1} y1={20} x2={x1} y2={yS1 - 6} tone="bright" />
            <Line x1={x1} y1={yS1 + 6} x2={x1} y2={yS2 - 6} tone="bright" />
            <Line x1={x1} y1={yS2 + 6} x2={x1} y2={240} tone="bright" />
            <Line x1={screen} y1={20} x2={screen} y2={240} tone="soft" />
            <Line x1={x1} y1={yS1} x2={screen} y2={yP} />
            <Line x1={x1} y1={yS2} x2={screen} y2={yP} tone="soft" />
            <Line x1={Q[0]} y1={Q[1]} x2={x1} y2={yS2} tone="bright" />
            <Ball x={screen} y={yP} r={5.5} />
            <Ball x={x1} y={yS1} r={3.5} glow={false} />
            <Ball x={x1} y={yS2} r={3.5} glow={false} />
            <Label x={x1 - 10} y={yS1 + 4} kind="sym" anchor="end">S₁</Label>
            <Label x={x1 - 10} y={yS2 + 4} kind="sym" anchor="end">S₂</Label>
            <Label x={screen + 10} y={yP + 4} kind="sym" anchor="start">P</Label>
            <Label x={(x1 + Q[0]) / 2 - 4} y={(yS2 + Q[1]) / 2 + 18} kind="sym">Δ</Label>
            <Trail points={curve(60, 190, (s) => [screen + 24 + 80 * Math.cos((Math.PI * ((Math.hypot(screen - x1, ym - 95 + s - yS2) - Math.hypot(screen - x1, ym - 95 + s - yS1)) / lam)) ) ** 2, ym - 95 + s] as Pt)} />
            <Ball x={screen + 24 + 80 * I} y={yP} r={4} glow={false} />
            <Label x={screen + 64} y={236} kind="label">intensity</Label>
            <Label x={16} y={22} kind="val" anchor="start">{`Δ = ${n.toFixed(2)} λ`}</Label>
            <Label x={16} y={42} kind="val" anchor="start">{status}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Two bright-and-dark strips: one fixed, one that changes its fringe width. */
export function Fringes({ title, labels, betas }: { title: string; labels: [string, string]; betas: [number, number] }) {
  return (
    <Anim title={title} height={210} loop={9}>
      {(t) => {
        const morph = ease(phase(t, 1.2, 3.8)) - ease(phase(t, 5.4, 8));
        const bB = lerp(betas[0], betas[1], morph);
        const rows: [number, number, string][] = [
          [80, betas[0], labels[0]],
          [180, bB, labels[1]],
        ];
        return (
          <g>
            {rows.map(([base, beta, name], r) => (
              <g key={name}>
                <Line x1={30} y1={base} x2={610} y2={base} tone="soft" />
                <Trail points={curve(240, 580, (s) => [30 + s, base - 44 * Math.cos((Math.PI * (s - 290)) / beta) ** 2])} />
                <Line x1={320} y1={base + 6} x2={320 + beta} y2={base + 6} tone="bright" />
                <Line x1={320} y1={base + 2} x2={320} y2={base + 10} tone="bright" />
                <Line x1={320 + beta} y1={base + 2} x2={320 + beta} y2={base + 10} tone="bright" />
                <Label x={320 + beta / 2} y={base + 22} kind="sym">β</Label>
                <Label x={30} y={base - 52 + (r ? 0 : 0)} kind="label" anchor="start">{name}</Label>
              </g>
            ))}
            <Label x={W - 14} y={20} kind="val" anchor="end">{`β ratio = ${(bB / betas[0]).toFixed(2)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Phasor() {
  return (
    <Anim title="Two equal arrows are added end to end; as their phase difference grows the resultant shrinks from twice the length to nothing, and the intensity curve follows its square" height={250} loop={10}>
      {(t) => {
        const phi = TAU * ease(phase(t, 0.5, 9.5));
        const ox = 110, oy = 135, R = 52;
        const e1: Pt = [ox + R, oy];
        const e2: Pt = [e1[0] + R * Math.cos(phi), e1[1] - R * Math.sin(phi)];
        const gx = 300, gw = 300, gy = 210, gh = 160;
        const I = (p: number) => Math.cos(p / 2) ** 2;
        return (
          <g>
            <Arrow x1={ox} y1={oy} x2={e1[0]} y2={e1[1]} tone="soft" label="E₁" labelAt="mid" />
            <Arrow x1={e1[0]} y1={e1[1]} x2={e2[0]} y2={e2[1]} tone="soft" />
            <Arrow x1={ox} y1={oy} x2={e2[0]} y2={e2[1]} width={3.2} />
            <path className="fig-guide" d={`M${e1[0] + 22} ${e1[1]}A22 22 0 ${phi > Math.PI ? 1 : 0} 0 ${e1[0] + 22 * Math.cos(phi)} ${e1[1] - 22 * Math.sin(phi)}`} fill="none" />
            <Label x={e1[0] + 40} y={e1[1] - 24} kind="sym">φ</Label>
            <Label x={ox} y={oy + 90} kind="label">amplitudes add end to end</Label>
            <Axes x={gx} y={gy} w={gw} h={gh + 12} xLabel="φ" yLabel="I" />
            <Trail points={curve(100, gw - 20, (s) => [gx + s, gy - gh * I((s / (gw - 20)) * TAU)])} tone="soft" />
            <Line x1={gx} y1={gy - gh} x2={gx + gw - 20} y2={gy - gh} tone="soft" dashed />
            <Ball x={gx + (phi / TAU) * (gw - 20)} y={gy - gh * I(phi)} r={5} />
            <Label x={gx - 6} y={gy - gh + 4} kind="val" anchor="end">4 I₀</Label>
            {[0, 1, 2].map((m) => (
              <Label key={m} x={gx + (m / 2) * (gw - 20)} y={gy + 16} kind="val">{m === 0 ? '0' : m === 1 ? 'π' : '2π'}</Label>
            ))}
            <Label x={W - 14} y={20} kind="val" anchor="end">{`I = ${(4 * I(phi)).toFixed(2)} I₀`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ diffraction

export function SlitHalves() {
  return (
    <Anim title="A single slit is split into two halves; every point in the top half has a partner a distance a over 2 below it whose light arrives half a wavelength behind, so in the direction of the first dark fringe the pairs cancel in turn" height={250} loop={10}>
      {(t) => {
        const sx = 150, top = 60, a = 110;
        const th = Math.asin(0.4);
        const u: Pt = [Math.cos(th), Math.sin(th)];
        const pairs = 4;
        const idx = Math.floor(t / 2.2) % pairs;
        const w = TAU * 1.1 * t;
        const out: ReactNode[] = [];
        for (let j = 0; j < pairs; j++) {
          const yU = top + (a / 2) * ((j + 0.5) / pairs);
          const yL = yU + a / 2;
          const on = j === idx;
          const endX = 480;
          const run = (endX - sx) * Math.tan(th);
          out.push(
            <g key={j} style={{ opacity: on ? 1 : 0.3 }}>
              <Line x1={sx} y1={yU} x2={endX} y2={yU + run} tone={on ? 'bright' : 'soft'} />
              <Line x1={sx} y1={yL} x2={endX} y2={yL + run} tone={on ? 'bright' : 'soft'} />
              <Ball x={sx} y={yU} r={3.5} glow={false} />
              <Ball x={sx} y={yL} r={3.5} glow={false} />
              <Ball x={endX} y={yU + run + 7 * Math.sin(w)} r={4} glow={false} />
              <Ball x={endX} y={yL + run + 7 * Math.sin(w + Math.PI)} r={4} glow={false} />
            </g>,
          );
        }
        const yUi = top + (a / 2) * ((idx + 0.5) / pairs);
        const yLi = yUi + a / 2;
        const foot: Pt = [sx + u[0] * ((a / 2) * Math.sin(th)), yUi + u[1] * ((a / 2) * Math.sin(th))];
        return (
          <g>
            <Line x1={sx} y1={14} x2={sx} y2={top} tone="bright" />
            <Line x1={sx} y1={top + a} x2={sx} y2={236} tone="bright" />
            <Line x1={sx} y1={top} x2={sx} y2={top + a} tone="soft" dashed />
            {[0, 1, 2].map((k) => (
              <Arrow key={k} x1={30 + ((t * 40 + k * 40) % 120)} y1={top + 20 + k * 35} x2={30 + ((t * 40 + k * 40) % 120) + 34} y2={top + 20 + k * 35} tone="soft" />
            ))}
            {out}
            <Line x1={sx} y1={yLi} x2={foot[0]} y2={foot[1]} tone="soft" dashed />
            <line className="fig-path" style={{ strokeWidth: 4 }} x1={sx} y1={yUi} x2={foot[0]} y2={foot[1]} />
            <Label x={sx - 12} y={top + a / 2 + 4} kind="sym" anchor="end">a</Label>
            <Label x={sx + 40} y={yUi - 6} kind="sym" anchor="start">λ / 2</Label>
            <Label x={W - 14} y={20} kind="label" anchor="end">a sin θ = λ: every pair cancels</Label>
            <Label x={480} y={236} kind="label">dots oscillate in opposite step</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function SlitPattern() {
  return (
    <Anim title="Light through a single slit spreads into a bright central band with dark minima either side; a wider slit gives a narrower pattern and a narrower slit a wider one" height={250} loop={9}>
      {(t) => {
        const sw = ease(phase(t, 1, 3.5)) - ease(phase(t, 5, 7.5));
        const a = lerp(1, 2.2, sw);
        const Wd = 78 / a;
        const gx = 440, base = 200, H = 150;
        const slitH = 18 * a;
        return (
          <g>
            <Line x1={110} y1={20} x2={110} y2={125 - slitH} tone="bright" />
            <Line x1={110} y1={125 + slitH} x2={110} y2={235} tone="bright" />
            <Line x1={110} y1={125 - slitH} x2={110} y2={125 + slitH} tone="soft" dashed />
            <Arrow x1={110 - 56} y1={125} x2={110 - 12} y2={125} tone="soft" />
            <Label x={90} y={30} kind="sym">slit width a</Label>
            <Label x={90} y={46} kind="val">{`a = ${a.toFixed(1)} a₀`}</Label>
            <Arrow x1={gx - 150} y1={base + 12} x2={gx + 150} y2={base + 12} tone="soft" label="y" />
            <Trail points={curve(300, 300, (s) => [gx - 150 + s, base - H * sinc2((Math.PI * (s - 150)) / Wd)])} />
            {[-2, -1, 1, 2].map((m) => (
              <g key={m}>
                <Line x1={gx + m * Wd} y1={base + 6} x2={gx + m * Wd} y2={base + 18} tone="soft" />
                <Label x={gx + m * Wd} y={base + 34} kind="val">{`${m > 0 ? '+' : ''}${m}`}</Label>
              </g>
            ))}
            <Line x1={gx - Wd} y1={base - H - 8} x2={gx + Wd} y2={base - H - 8} tone="bright" />
            <Label x={gx} y={base - H - 14} kind="sym">2λD / a</Label>
            <Ball x={gx + 150 * Math.sin(TAU * t / 9) } y={base - H * sinc2((Math.PI * 150 * Math.sin(TAU * t / 9)) / Wd)} r={4.5} />
          </g>
        );
      }}
    </Anim>
  );
}

export function Envelope() {
  return (
    <Anim title="The two-slit fringes sit inside the single-slit diffraction envelope; fringes are fine and equally spaced while the envelope fades out the outer ones" height={250} loop={9}>
      {(t) => {
        const beta = 24, Wd = 5 * beta;
        const gx = 320, base = 190, H = 140;
        const I = (s: number) => Math.cos((Math.PI * s) / beta) ** 2 * sinc2((Math.PI * s) / Wd);
        const cur = clamp(phase(t, 0.5, 7)) * 290;
        const lim = (n: number) => Math.min(280, cur) >= n;
        return (
          <g>
            <Arrow x1={gx - 300} y1={base} x2={gx + 300} y2={base} tone="soft" label="y" />
            <Trail points={curve(160, 560, (s) => [gx - 280 + s, base - H * sinc2((Math.PI * (s - 280)) / Wd)])} tone="soft" dashed />
            <Trail points={curve(600, 2 * cur, (s) => [gx - cur + s, base - H * I(s - cur)])} />
            <Ball x={gx + cur} y={base - H * I(cur)} r={4.5} />
            {lim(0) && <Label x={gx} y={base + 22} kind="val">central</Label>}
            <Line x1={gx + beta} y1={base + 38} x2={gx + 2 * beta} y2={base + 38} tone="bright" />
            <Label x={gx + 1.5 * beta} y={base + 54} kind="sym">β</Label>
            <Line x1={gx - Wd} y1={base + 38} x2={gx + Wd} y2={base + 38} tone="soft" />
            <Label x={gx + Wd + 10} y={base + 42} kind="label" anchor="start">envelope width 2λD / a</Label>
            <Label x={W - 14} y={20} kind="label" anchor="end">fringes: cos²   envelope: sinc²</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ polarisation

export function PolarWave() {
  return (
    <Anim title="Unpolarised light has its oscillation direction changing among all directions across the beam; a polaroid lets through only one direction, leaving light that oscillates along a single line" height={230} loop={9}>
      {(t) => {
        const w = TAU * 0.9 * t;
        const lx = 105, rx = 535, cy = 112, R = 62;
        const angs = [0, 30, 60, 90, 120, 150];
        return (
          <g>
            <circle className="fig-guide" cx={lx} cy={cy} r={R} fill="none" />
            {angs.map((a, i) => {
              const th = (a + 14 * Math.sin(w * 0.25 + i * 2)) * DEG;
              const s = Math.cos(w + i * 1.7) * R * 0.9;
              return <Arrow key={a} x1={lx - s * Math.cos(th) * 0} y1={cy - s * Math.sin(th) * 0} x2={lx + s * Math.cos(th)} y2={cy - s * Math.sin(th)} tone="soft" />;
            })}
            <Label x={lx} y={cy + R + 26} kind="label">unpolarised (end-on view)</Label>
            <Arrow x1={lx + R + 14} y1={cy} x2={rx - R - 14} y2={cy} tone="soft" dashed />
            <Ball x={lx + R + 20 + ((t * 90) % 230)} y={cy} r={3.5} glow={false} />
            <rect x={300} y={cy - 70} width={16} height={140} fill="#fff" opacity={0.08} />
            {Array.from({ length: 11 }, (_, k) => (
              <Line key={k} x1={308} y1={cy - 62 + k * 12.4} x2={308} y2={cy - 62 + k * 12.4 + 8} tone="bright" />
            ))}
            <Label x={308} y={cy - 80} kind="label">polaroid</Label>
            <Label x={308} y={cy + 90} kind="val">pass axis ↕</Label>
            <circle className="fig-guide" cx={rx} cy={cy} r={R} fill="none" />
            <Arrow x1={rx} y1={cy + Math.cos(w) * R * 0.9} x2={rx} y2={cy - Math.cos(w) * R * 0.9} tone="bright" />
            <Label x={rx} y={cy + R + 26} kind="label">polarised: one direction</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Malus() {
  return (
    <Anim title="Polarised light reaches a second polaroid whose axis is turned by an angle; only the part of the oscillation along that axis gets through, so the intensity follows cosine squared of the angle" height={250} loop={12}>
      {(t) => {
        const th = TAU * 0.5 * ease(phase(t, 0.5, 11.5));
        const cx = 120, cy = 118, R = 80;
        const gx = 300, gw = 290, gy = 205, gh = 140;
        const proj = Math.cos(th);
        const pass: Pt = [Math.cos(th), -Math.sin(th)];
        const E0 = 0.9 * R;
        const osc = 0.65 + 0.35 * Math.cos(TAU * 2 * t);
        return (
          <g>
            <circle className="fig-guide" cx={cx} cy={cy} r={R} fill="none" />
            <Line x1={cx - R * pass[0]} y1={cy - R * pass[1]} x2={cx + R * pass[0]} y2={cy + R * pass[1]} tone="soft" dashed />
            <Arrow x1={cx} y1={cy} x2={cx} y2={cy - E0 * osc} tone="soft" label="E₀" />
            <Line x1={cx} y1={cy - E0 * osc} x2={cx + E0 * osc * proj * pass[0]} y2={cy + E0 * osc * proj * pass[1]} tone="soft" dashed />
            <Arrow x1={cx} y1={cy} x2={cx + E0 * osc * proj * pass[0]} y2={cy + E0 * osc * proj * pass[1]} width={3.2} />
            <Label x={cx} y={cy + R + 26} kind="label">analyser axis turned by θ</Label>
            <Axes x={gx} y={gy} w={gw} h={gh + 14} xLabel="θ" yLabel="I" />
            <Trail points={curve(100, gw - 20, (s) => [gx + s, gy - gh * Math.cos((s / (gw - 20)) * Math.PI) ** 2])} tone="soft" />
            <Ball x={gx + (th / Math.PI) * (gw - 20)} y={gy - gh * proj * proj} r={5} />
            {[0, 90, 180].map((a) => (
              <Label key={a} x={gx + (a / 180) * (gw - 20)} y={gy + 16} kind="val">{`${a}°`}</Label>
            ))}
            <Label x={W - 14} y={20} kind="val" anchor="end">{`θ = ${Math.round(th / DEG)}°   I = ${(proj * proj).toFixed(2)} I₀`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Brewster() {
  return (
    <Anim title="Light hits glass at a steadily growing angle; the reflected light in the plane of the page fades to nothing at the Brewster angle, where the reflected and refracted rays are at right angles" height={270} loop={11}>
      {(t) => {
        const n = 1.5;
        const iB = Math.atan(n);
        const lo = 20 * DEG, hi = 80 * DEG;
        const i = t < 3 ? lerp(lo, iB, ease(phase(t, 0, 3))) : t < 6 ? iB : lerp(iB, hi, ease(phase(t, 6, 9)));
        const r = Math.asin(Math.sin(i) / n);
        const rp = Math.abs(Math.tan(i - r) / Math.tan(i + r));
        const rs = Math.abs(Math.sin(i - r) / Math.sin(i + r));
        const cx = 190, y0 = 135, L = 105;
        const hx = (a: number, s: number): Pt => [cx + s * L * Math.sin(a), y0 - s * L * Math.cos(a)];
        const a0 = hx(i, -1);
        const a1 = hx(i, 1);
        const tr: Pt = [cx + L * Math.sin(r), y0 + L * Math.cos(r)];
        const bx = 440;
        const right = clamp(1 - Math.abs(i - iB) / (6 * DEG));
        const dotT = (t % 3) / 3;
        return (
          <g>
            <rect x={0} y={y0} width={W} height={270 - y0} fill="#fff" opacity={0.07} />
            <Line x1={20} y1={y0} x2={350} y2={y0} tone="bright" />
            <Line x1={cx} y1={y0 - 115} x2={cx} y2={y0 + 110} tone="soft" dashed />
            <Arrow x1={a0[0]} y1={a0[1]} x2={cx} y2={y0} width={2.6} />
            <Line x1={cx} y1={y0} x2={a1[0]} y2={a1[1]} tone="bright" />
            <Line x1={cx} y1={y0} x2={tr[0]} y2={tr[1]} tone="soft" />
            <Ball x={dotT < 0.5 ? a0[0] + (cx - a0[0]) * dotT * 2 : cx + (a1[0] - cx) * (dotT * 2 - 1)} y={dotT < 0.5 ? a0[1] + (y0 - a0[1]) * dotT * 2 : y0 + (a1[1] - y0) * (dotT * 2 - 1)} r={4} glow={false} />
            <g style={{ opacity: right }}>
              <path className="fig-guide" d={`M${cx + 34 * Math.sin(i)} ${y0 - 34 * Math.cos(i)}A34 34 0 0 1 ${cx + 34 * Math.sin(r)} ${y0 + 34 * Math.cos(r)}`} fill="none" />
              <Label x={cx + 52} y={y0 + 6} kind="sym">90°</Label>
            </g>
            <Label x={30} y={26} kind="val" anchor="start">{`i = ${(i / DEG).toFixed(1)}°`}</Label>
            <Label x={30} y={y0 + 30} kind="label" anchor="start">glass, n = 1.5</Label>
            <Label x={bx - 30} y={50} kind="label" anchor="start">reflected fraction</Label>
            {[
              [rp, 'in the plane', 80],
              [rs, 'across the plane', 140],
            ].map(([v, name, yy]) => (
              <g key={name as string}>
                <Line x1={bx} y1={(yy as number) + 40} x2={bx + 170} y2={(yy as number) + 40} tone="soft" />
                <rect className="fig-bar" x={bx} y={(yy as number) + 14} width={Math.max(1, 170 * (v as number) * 3)} height={22} fill="#fff" opacity={0.85} />
                <Label x={bx} y={(yy as number) + 8} kind="val" anchor="start">{`${name}: ${(100 * (v as number) ** 2).toFixed(1)}%`}</Label>
              </g>
            ))}
            <Label x={bx + 170} y={250} kind="label" anchor="end">bars scaled up three times</Label>
            {right > 0.8 && <Label x={cx} y={20} kind="sym">Brewster angle: tan i = n</Label>}
          </g>
        );
      }}
    </Anim>
  );
}
