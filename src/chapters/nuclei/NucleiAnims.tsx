import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Label, Line, Readout, Trail, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for nuclei: size, binding energy, decay, fission and fusion. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

/** Real subscripts and superscripts inside SVG text. */
const Sup = ({ children }: { children: ReactNode }) => (
  <tspan baselineShift="super" fontSize="72%">
    {children}
  </tspan>
);
/** Text with a background-coloured outline so lines behind it do not cut through the letters. */
const HALO = { paintOrder: 'stroke', stroke: '#000', strokeWidth: 6, strokeLinejoin: 'round' } as const;

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

/** A repeatable pseudo-random number in [0, 1) for index i. */
const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

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

/** A proton (solid) or neutron (hollow). */
function Nucleon({ x, y, r = 7, p }: { x: number; y: number; r?: number; p: boolean }) {
  return p ? <circle className="fig-ball" cx={x} cy={y} r={r} /> : <circle className="fig-ghost" cx={x} cy={y} r={r} />;
}

/** Rings that spread out from a point, like a flash of released energy. */
function Flash({ x, y, p, size = 90 }: { x: number; y: number; p: number; size?: number }) {
  if (p <= 0 || p >= 1) return null;
  return (
    <g opacity={1 - p}>
      <circle className="fig-guide" cx={x} cy={y} r={8 + size * ease(p)} fill="none" />
      <circle className="fig-guide" cx={x} cy={y} r={4 + size * 0.6 * ease(p)} fill="none" />
    </g>
  );
}

/** A little wavy line: a gamma photon or a wave of energy. */
function Photon({ x, y, len, ph, amp = 7 }: { x: number; y: number; len: number; ph: number; amp?: number }) {
  return <Trail points={curve(40, len, (s) => [x + s, y + amp * Math.sin(s / 5 - ph)] as Pt)} />;
}

// ------------------------------------------------------------------ composition

/** A nucleus of Z protons and N neutrons, jiggling, for several example nuclei in turn. */
export function Composition() {
  const items: { name: string; Z: number; N: number }[] = [
    { name: 'hydrogen-1', Z: 1, N: 0 },
    { name: 'helium-4', Z: 2, N: 2 },
    { name: 'carbon-12', Z: 6, N: 6 },
    { name: 'oxygen-16', Z: 8, N: 8 },
  ];
  return (
    <Anim title="Four nuclei drawn as clusters of solid protons and hollow neutrons, each jiggling, with the numbers of protons, neutrons and nucleons below" height={236} loop={8}>
      {(t) => (
        <g>
          {items.map((it, i) => {
            const cx = 80 + i * 160;
            const cy = 95;
            const n = it.Z + it.N;
            const R = 11 * Math.sqrt(n) * 1.1 + 3;
            const pulse = 0.5 + 0.5 * Math.sin(TAU * (t / 4) - i);
            return (
              <g key={it.name}>
                <circle className="fig-guide fig-faint" cx={cx} cy={cy} r={R + 10 + 3 * pulse} fill="none" />
                {Array.from({ length: n }, (_, k) => {
                  const r = n === 1 ? 0 : (R - 7) * Math.sqrt((k + 0.5) / n);
                  const a = k * 2.39996 + i;
                  const jx = 1.8 * Math.sin(TAU * (t / 1.4) + k * 1.7);
                  const jy = 1.8 * Math.cos(TAU * (t / 1.1) + k * 2.3);
                  const p = k < 2 * it.Z && k % 2 === 0;
                  return <Nucleon key={k} x={cx + r * Math.cos(a) + jx} y={cy + r * Math.sin(a) + jy} r={6.5} p={p} />;
                })}
                <Label x={cx} y={178} kind="label">{it.name}</Label>
                <Label x={cx} y={198} kind="val">{`Z = ${it.Z}   N = ${it.N}`}</Label>
                <Label x={cx} y={216} kind="val">{`A = ${it.Z + it.N}`}</Label>
              </g>
            );
          })}
          <Key x={14} y={22} name="proton" />
          <Label x={140} y={22} kind="label" anchor="start">solid = proton, hollow = neutron</Label>
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ size

/** A slice through a nucleus that grows from A = 8 to A = 216: the radius goes as the cube root of A. */
export function NucleusSize({ title = 'A slice through nuclei of growing nucleon number: the radius grows as the cube root of A while the nucleons stay equally spaced' }: { title?: string }) {
  return (
    <Anim title={title} height={250} loop={10}>
      {(t) => {
        const c = lerp(2, 6, ease(Math.sin(Math.PI * (t / 10)) ** 1.0));
        const A = c ** 3;
        const R = 15 * c;
        const cx = 170, cy = 125;
        const N = Math.max(3, Math.round(1.55 * c * c));
        const R0 = 1.2 * c;
        return (
          <g>
            <circle className="fig-guide" cx={cx} cy={cy} r={R + 8} fill="none" />
            {Array.from({ length: N }, (_, k) => {
              const r = (R - 4) * Math.sqrt((k + 0.5) / N);
              const a = k * 2.39996;
              const jx = 1.5 * Math.sin(TAU * (t / 1.3) + k * 1.9);
              const jy = 1.5 * Math.cos(TAU * (t / 1.7) + k * 2.7);
              return <Nucleon key={k} x={cx + r * Math.cos(a) + jx} y={cy + r * Math.sin(a) + jy} r={5.5} p={k % 2 === 0} />;
            })}
            <Arrow x1={cx} y1={cy} x2={cx + R + 8} y2={cy} tone="soft" />
            <Label x={cx + R + 20} y={cy + 6} kind="sym" anchor="start">R</Label>
            <Axes x={360} y={205} w={250} h={165} xLabel="A" yLabel="R" />
            <Trail points={curve(60, 216, (A2) => [360 + (A2 / 216) * 235, 205 - (1.2 * A2 ** (1 / 3) / 7.2) * 145] as Pt)} tone="soft" />
            <Line x1={360 + (A / 216) * 235} y1={205} x2={360 + (A / 216) * 235} y2={205 - (R0 / 7.2) * 145} tone="soft" dashed />
            <Ball x={360 + (A / 216) * 235} y={205 - (R0 / 7.2) * 145} r={5} />
            <Label x={376} y={18} kind="val" anchor="start">{`A = ${Math.round(A)}`}</Label>
            <Label x={376} y={38} kind="val" anchor="start">
              R = 1.2 · A<Sup>1/3</Sup> = {R0.toFixed(1)} fm
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the nuclear force

export function NuclearForce() {
  return (
    <Anim title="Two nucleons oscillate in the well of the potential energy curve: strongly repelled when too close, attracted at about one femtometre, and barely felt beyond three" height={260} loop={6}>
      {(t) => {
        const r = 1 + 0.28 * Math.sin(TAU * (t / 3));
        const gx = 70, gy = 130, sx = 140, sy = 62;
        const V = (rr: number) => Math.max(-1.1, Math.min(1.5, (1 / rr) ** 8 - 2 * (1 / rr) ** 4));
        const P = (rr: number): Pt => [gx + rr * sx, gy - V(rr) * sy];
        const coul = (rr: number) => Math.min(1.5, 0.35 / rr);
        const d = r * 50;
        return (
          <g>
            <Axes x={gx} y={gy} w={440} h={100} below={90} xLabel="r" yLabel="V" />
            <Trail points={curve(120, 3.1, (s) => P(0.8 + (s / 3.1) * 2.3))} />
            <Trail points={curve(60, 3.1, (s) => [gx + (0.9 + (s / 3.1) * 2.2) * sx, gy - coul(0.9 + (s / 3.1) * 2.2) * sy] as Pt)} tone="soft" dashed />
            <Line x1={gx + sx} y1={gy - 4} x2={gx + sx} y2={gy + 8} tone="soft" />
            <Label x={gx + sx} y={gy + 22} kind="val">1 fm</Label>
            <Label x={gx + 3 * sx} y={gy + 22} kind="val">3 fm</Label>
            <Label x={gx + 3.25 * sx} y={gy - 30} kind="label" anchor="end">two protons add Coulomb push</Label>
            <Ball x={P(r)[0]} y={P(r)[1]} r={6} />
            <Line x1={gx + 0.8 * sx} y1={gy + 2} x2={gx + 0.8 * sx} y2={gy - 90} tone="soft" dashed />
            <Label x={gx + 0.8 * sx - 6} y={gy - 90} kind="label" anchor="end">repulsive core</Label>
            <Label x={gx + 2.1 * sx} y={gy + 60} kind="label">attraction: short range, very strong</Label>
            {/* the pair itself */}
            <Nucleon x={320 - d / 2} y={228} p r={9} />
            <Nucleon x={320 + d / 2} y={228} p={false} r={9} />
            <Arrow x1={320 - d / 2 - 12} y1={228} x2={320 - d / 2 - 12 + (r > 1 ? 22 : -22)} y2={228} tone="soft" />
            <Arrow x1={320 + d / 2 + 12} y1={228} x2={320 + d / 2 + 12 - (r > 1 ? 22 : -22)} y2={228} tone="soft" />
            <Label x={320} y={252} kind="val">{`r = ${r.toFixed(2)} fm`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ mass defect

/** Free nucleons fall together into helium-4, a flash of energy leaves, and the mass bars show the missing amount. */
export function MassDefect({ title = 'Two protons and two neutrons come together into helium-4 and release a flash of energy; the bars show the nucleus weighs a little less than its parts' }: { title?: string }) {
  return (
    <Anim title={title} height={250} loop={8}>
      {(t) => {
        const p = ease(phase(t, 0.8, 2.6));
        const cx = 160, cy = 110;
        const start: Pt[] = [[-110, -70], [110, -70], [-110, 70], [110, 70]];
        const kinds = [true, false, false, true];
        const fl = phase(t, 2.6, 4.6);
        const glow = Math.max(0, Math.sin(Math.PI * phase(t, 2.6, 4.2)));
        const gap = ease(phase(t, 2.8, 3.6));
        return (
          <g>
            {start.map(([sx, sy], i) => {
              const off = 14;
              const fx = ((i % 2) * 2 - 1) * off * 0.55;
              const fy = (i < 2 ? -1 : 1) * off * 0.55;
              const x = cx + lerp(sx, fx, p) + (p < 1 ? 3 * Math.sin(TAU * t + i) * (1 - p) : 1.2 * Math.sin(TAU * t * 1.3 + i));
              const y = cy + lerp(sy, fy, p);
              return <Nucleon key={i} x={x} y={y} p={kinds[i]} r={9} />;
            })}
            <Flash x={cx} y={cy} p={fl} size={95} />
            {glow > 0 && <Photon x={cx + 30} y={cy - 40} len={70} ph={TAU * t} />}
            {glow > 0 && <Label x={cx + 110} y={cy - 46} kind="val" anchor="start">28.3 MeV</Label>}
            <Label x={cx} y={228} kind="label">2 protons + 2 neutrons  →  helium-4</Label>
            {/* the bars */}
            <Line x1={380} y1={220} x2={620} y2={220} tone="soft" />
            <rect className="fig-ghost" x={400} y={220 - 150} width={70} height={150} fill="none" />
            <rect className="fig-ghost" x={520} y={220 - 150 * (1 - 0.0076 * gap)} width={70} height={150 * (1 - 0.0076 * gap)} fill="none" />
            <rect className="fig-ball" x={400} y={220 - 150} width={70} height={150} opacity={0.12} />
            <rect className="fig-ball" x={520} y={220 - 150 * (1 - 0.0076 * gap)} width={70} height={150 * (1 - 0.0076 * gap)} opacity={0.25} />
            <rect x={520} y={220 - 150} width={70} height={150 * 0.0076 * gap + 0.1} className="fig-glow" fill="#fff" opacity={0.7 * (0.5 + 0.5 * Math.sin(TAU * t * 1.5)) * gap} />
            <Label x={435} y={240} kind="label">free nucleons</Label>
            <Label x={555} y={240} kind="label">the nucleus</Label>
            <Label x={555} y={60} kind="sym" anchor="middle">{gap > 0.5 ? 'Δm' : ''}</Label>
            <Label x={435} y={64} kind="val">4.0330 u</Label>
            <Label x={555} y={96} kind="val" anchor="middle">4.0026 u</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ binding energy curve

const BE: Pt[] = [
  [1, 0], [2, 1.11], [3, 2.83], [4, 7.07], [7, 5.61], [12, 7.68], [16, 7.98], [24, 8.26], [40, 8.55], [56, 8.79], [70, 8.73], [90, 8.71], [120, 8.51], [150, 8.25], [180, 8.0], [208, 7.87], [238, 7.57],
];
/** Binding energy per nucleon in MeV at mass number A (interpolated through measured points). */
export function bePerNucleon(A: number): number {
  for (let i = 1; i < BE.length; i++) {
    if (A <= BE[i][0]) {
      const [a0, b0] = BE[i - 1];
      const [a1, b1] = BE[i];
      return lerp(b0, b1, ease((A - a0) / (a1 - a0)));
    }
  }
  return BE[BE.length - 1][1];
}

export function BECurve({ title = 'The binding energy per nucleon plotted against mass number: it rises steeply, peaks near iron at 8.8 MeV, then slowly falls; a dot slides along the curve', focus }: { title?: string; focus?: 'fission' | 'fusion' }) {
  return (
    <Anim title={title} height={270} loop={10}>
      {(t) => {
        const x0 = 60, y0 = 225, wx = 520, hy = 175;
        const X = (A: number) => x0 + (A / 240) * wx;
        const Y = (b: number) => y0 - (b / 10) * hy;
        const A = 1 + 237 * ease(phase(t, 0.4, 8));
        const pts = curve(200, 1, (s) => [X(1 + s * 237), Y(bePerNucleon(1 + s * 237))] as Pt);
        const pulse = 0.5 + 0.5 * Math.sin(TAU * t * 0.8);
        return (
          <g>
            <Axes x={x0} y={y0} w={wx + 16} h={hy + 20} xLabel="A" />
            <Label x={x0 + 14} y={24} kind="label" anchor="start">BE/A (MeV)</Label>
            <Line x1={x0} y1={Y(8)} x2={x0 + wx} y2={Y(8)} tone="soft" dashed />
            <Label x={x0 - 6} y={Y(8) + 5} kind="val" anchor="end">8</Label>
            <Trail points={pts} />
            {[[4, 'He-4'], [56, 'Fe-56'], [235, 'U-235']].map(([a, n]) => (
              <g key={n as string} opacity={A >= (a as number) - 1 ? 1 : 0.65}>
                <circle className="fig-ghost" cx={X(a as number)} cy={Y(bePerNucleon(a as number))} r={5} />
                {a === 4 && <Line x1={X(4)} y1={Y(bePerNucleon(4)) - 7} x2={X(4)} y2={Y(8) - 24} tone="soft" dashed />}
                <text className="fig-label" x={X(a as number) + (a === 4 ? 4 : 0)} y={a === 4 ? Y(8) - 28 : a === 235 ? Y(bePerNucleon(235)) + 26 : Y(bePerNucleon(a as number)) - 12} textAnchor={a === 4 ? 'start' : 'middle'} style={{ ...HALO, fill: 'var(--ink)' }}>
                  {n as string}
                </text>
              </g>
            ))}
            <Ball x={X(A)} y={Y(bePerNucleon(A))} r={6} />
            {focus !== 'fission' && (
              <g>
                <Arrow x1={X(10)} y1={Y(3)} x2={X(10) + 44 + 8 * pulse} y2={Y(3) - 26} tone="soft" />
                <Label x={X(10) + 12} y={Y(3) + 24} kind="label" anchor="start">fusion</Label>
              </g>
            )}
            {focus !== 'fusion' && (
              <g>
                <Arrow x1={X(228)} y1={Y(5.2)} x2={X(228) - 56 - 8 * pulse} y2={Y(5.2) - 20} tone="soft" />
                <Label x={X(228) - 30} y={Y(5.2) + 24} kind="label">fission</Label>
              </g>
            )}
            <Readout y={34}>{`A = ${Math.round(A)}\u2003BE/A = ${bePerNucleon(A).toFixed(2)} MeV`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ radioactive decay types

export function DecayTypes() {
  return (
    <Anim title="Three kinds of decay side by side: an alpha particle of two protons and two neutrons leaves, a neutron turns into a proton with an electron and antineutrino, and an excited nucleus emits a gamma ray" height={230} loop={8}>
      {(t) => {
        const cs = [110, 320, 530];
        const cy = 100;
        const e = phase(t, 2, 6);
        const rest = phase(t, 6.6, 7.4);
        return (
          <g>
            {cs.map((cx, i) => (
              <g key={i}>
                <circle className="fig-guide fig-faint" cx={cx} cy={cy} r={34 + 2 * Math.sin(TAU * t + i)} fill="none" />
                <Line x1={cx - 100} y1={206 - 8} x2={cx + 100} y2={206 - 8} tone="soft" dashed />
              </g>
            ))}
            {/* alpha */}
            <g>
              {[0, 1, 2, 3].map((k) => {
                const ox = (k % 2) * 12 - 6;
                const oy = (k < 2 ? -6 : 6);
                const sx = e > 0 ? 125 * ease(e) : 0;
                return <Nucleon key={k} x={cs[0] + ox + sx + 1.5 * Math.sin(TAU * t * 2 + k)} y={cy + oy} r={6} p={k % 2 === 0} />;
              })}
              <Label x={cs[0]} y={160} kind="label">alpha: helium nucleus leaves</Label>
              <Label x={cs[0]} y={182} kind="val">{e > 0.6 ? 'A − 4,  Z − 2' : 'parent: A,  Z'}</Label>
            </g>
            {/* beta */}
            <g>
              <Nucleon x={cs[1] - 10} y={cy - 8} p r={7} />
              <Nucleon x={cs[1] + 10} y={cy + 6} p r={7} />
              <Nucleon x={cs[1] - 8} y={cy + 12} p={false} r={7} />
              <Nucleon x={cs[1] + 9} y={cy - 12} p={false} r={7} />
              <Nucleon x={cs[1] + 2} y={cy + 1} p={e > 0.05} r={7} />
              {e > 0.05 && <Ball x={cs[1] + 14 + 100 * ease(e)} y={cy + 4 - 20 * ease(e)} r={3.5} glow={false} />}
              {e > 0.05 && <circle className="fig-ghost" cx={cs[1] + 14 + 75 * ease(e)} cy={cy + 24 + 28 * ease(e)} r={3} />}
              <Label x={cs[1]} y={160} kind="label">beta: n → p + e⁻ + ν̄</Label>
              <Label x={cs[1]} y={182} kind="val">{e > 0.1 ? 'A same,  Z + 1' : 'parent: A,  Z'}</Label>
            </g>
            {/* gamma */}
            <g>
              {[0, 1, 2, 3, 4].map((k) => (
                <Nucleon key={k} x={cs[2] + 9 * Math.cos(k * 1.26) + 1.4 * Math.sin(TAU * t * (e > 0 && e < 1 ? 1 : 3) + k)} y={cy + 9 * Math.sin(k * 1.26)} p={k % 2 === 0} r={6} />
              ))}
              <circle className="fig-guide" cx={cs[2]} cy={cy} r={26} fill="none" opacity={e < 0.05 ? 0.9 * (0.5 + 0.5 * Math.sin(TAU * t * 2)) : 0} />
              {e > 0.05 && <Photon x={cs[2] + 30 * 0} y={cy} len={110 * ease(e)} ph={TAU * t * 1.5} amp={9} />}
              <Label x={cs[2]} y={160} kind="label">gamma: excited → lower state</Label>
              <Label x={cs[2]} y={182} kind="val">A, Z unchanged</Label>
            </g>
            {rest > 0 && <rect x={0} y={0} width={W} height={230} fill="#000" opacity={rest} />}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the decay law

/** Sixty-four nuclei decay at random; the count follows the smooth exponential curve. */
export function DecayLaw({ title = 'Sixty-four nuclei in a grid turn hollow one by one as they decay, while a curve of the number remaining falls by half every half-life', half = 1.5, unit = 's', dots = true, linear }: { title?: string; half?: number; unit?: string; dots?: boolean; linear?: boolean }) {
  const lam = Math.LN2 / half;
  const n = 64;
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => rnd(a + 5) - rnd(b + 5));
  const tau = new Array<number>(n);
  order.forEach((idx, k) => {
    tau[idx] = -Math.log(1 - (k + 0.5) / n) / lam;
  });
  const span = 4.4 * half;
  return (
    <Anim title={title} height={250} loop={span + 2.6}>
      {(t) => {
        const tt = Math.min(t, span);
        const left = tau.filter((x) => x > tt).length;
        const gx = dots ? 300 : 70, gy = 215, gw = dots ? 300 : 520, gh = 170;
        const X = (s: number) => gx + (s / span) * gw;
        const Y = (f: number) => gy - f * gh;
        return (
          <g>
            {dots &&
              tau.map((x, i) => {
                const cx = 28 + (i % 8) * 31;
                const cy = 40 + Math.floor(i / 8) * 25;
                const age = tt - x;
                if (age < 0) return <Ball key={i} x={cx} y={cy} r={5} glow={false} />;
                return (
                  <g key={i}>
                    <circle className="fig-ghost" cx={cx} cy={cy} r={5} />
                    {age < 0.35 && <circle className="fig-guide" cx={cx} cy={cy} r={5 + 20 * age} fill="none" opacity={1 - age / 0.35} />}
                  </g>
                );
              })}
            <Axes x={gx} y={gy} w={gw + 20} h={gh + 18} xLabel="t" yLabel="N" />
            {[1, 0.5, 0.25, 0.125].map((f, k) => (
              <g key={f}>
                <Line x1={gx} y1={Y(f)} x2={X(k * half)} y2={Y(f)} tone="soft" dashed />
                <Line x1={X(k * half)} y1={Y(f)} x2={X(k * half)} y2={gy} tone="soft" dashed />
                <Label x={gx - 8} y={Y(f) + 5} kind="val" anchor="end">{['N₀', 'N₀/2', 'N₀/4', 'N₀/8'][k]}</Label>
                <Label x={X(k * half)} y={gy + 18} kind="val">{k === 0 ? '0' : `${k}T`}</Label>
              </g>
            ))}
            {linear && <Trail points={[[X(0), Y(1)], [X(2 * half), Y(0)]]} tone="soft" dashed />}
            <Trail points={curve(80, tt, (s) => [X(s), Y(Math.exp(-lam * s))] as Pt)} />
            <Ball x={X(tt)} y={Y(Math.exp(-lam * tt))} r={5} />
            {dots && <Readout x={W - 14} y={34}>{`remaining: ${left} of 64`}</Readout>}
            <Label x={dots ? 28 : W - 14} y={dots ? 20 : 20} kind="label" anchor={dots ? 'start' : 'end'}>{`one half-life = ${half} ${unit}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Bars that halve with each half-life. */
export function HalfLifeBars({ title = 'Bars showing what is left after one, two, three and four half-lives: a half, a quarter, an eighth and a sixteenth of the original', n = 5 }: { title?: string; n?: number }) {
  return (
    <Anim title={title} height={210} loop={9}>
      {(t) => (
        <g>
          <Line x1={40} y1={170} x2={W - 30} y2={170} tone="soft" />
          {Array.from({ length: n }, (_, k) => {
            const x = 60 + k * (500 / n);
            const full = 130 * 0.5 ** k;
            const grow = ease(phase(t, 0.5 + k * 1.1, 1.3 + k * 1.1));
            const hh = k === 0 ? 130 * ease(phase(t, 0.1, 0.8)) : full * grow;
            const lost = k === 0 ? 0 : (130 * 0.5 ** (k - 1) - full) * grow;
            return (
              <g key={k}>
                <rect className="fig-ball" x={x} y={170 - hh} width={50} height={hh} opacity={0.22} />
                <rect className="fig-ghost" x={x} y={170 - hh} width={50} height={hh} fill="none" />
                {k > 0 && lost > 0 && <rect className="fig-ghost" x={x} y={170 - hh - lost} width={50} height={lost} fill="none" opacity={0.35} strokeDasharray="4 4" />}
                <Label x={x + 25} y={190} kind="val">{k === 0 ? 'start' : `${k}T`}</Label>
                <Label x={x + 25} y={170 - hh - lost - 8} kind="val" >{['1', '1/2', '1/4', '1/8', '1/16', '1/32'][k]}</Label>
              </g>
            );
          })}
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ alpha decay energy

export function AlphaQ() {
  return (
    <Anim title="A uranium-238 nucleus splits into a fast light alpha particle and a slow heavy thorium-234 nucleus that recoils; the alpha carries nearly all of the released energy" height={200} loop={6}>
      {(t) => {
        const s = ease(phase(t, 1.2, 4.5));
        const cy = 90;
        return (
          <g>
            <Line x1={20} y1={cy + 52} x2={W - 20} y2={cy + 52} tone="soft" dashed />
            <circle className="fig-ghost" cx={W / 2} cy={cy} r={36} fill="none" opacity={s < 0.02 ? 1 : 0.25} />
            <Ball x={W / 2 - 3 - 14 * s} y={cy} r={32} glow={false} />
            <Ball x={W / 2 + 36 + 240 * s} y={cy} r={9} />
            <Arrow x1={W / 2 + 36 + 240 * s} y1={cy - 24} x2={W / 2 + 36 + 240 * s + 60 * s} y2={cy - 24} tone="soft" label="α" />
            <Arrow x1={W / 2 - 3 - 14 * s} y1={cy - 46} x2={W / 2 - 3 - 14 * s - 5 * s - 0.1} y2={cy - 46} tone="soft" />
            <Flash x={W / 2} y={cy} p={phase(t, 1.2, 2.4)} size={80} />
            <Label x={W / 2 - 60} y={cy + 76} kind="label">Th-234: heavy, slow</Label>
            <Label x={W / 2 + 190} y={cy + 76} kind="label">alpha: light, fast</Label>
            <Label x={W / 2} y={30} kind="val">{s < 0.05 ? 'U-238 at rest' : 'equal and opposite momentum'}</Label>
            <Label x={W / 2} y={190} kind="val">alpha 4.20 MeV   thorium 0.07 MeV</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ fission

export function FissionDrop({ title = 'A neutron strikes a uranium nucleus, which wobbles like a liquid drop, pinches into two fragments and releases three neutrons and a burst of energy' }: { title?: string }) {
  return (
    <Anim title={title} height={250} loop={8}>
      {(t) => {
        const cx = 360, cy = 120;
        const hit = phase(t, 0.2, 1.8);
        const wob = phase(t, 1.8, 3.8);
        const split = ease(phase(t, 3.6, 5.2));
        const nx = lerp(40, cx - 50, hit);
        const stretch = 16 * wob * Math.sin(TAU * 1.2 * (t - 1.8)) + 22 * ease(phase(t, 3, 3.7));
        const flashP = phase(t, 4.1, 5.8);
        const absorbed = hit >= 1;
        return (
          <g>
            {!absorbed && <Ball x={nx} y={cy} r={6} />}
            {!absorbed && <Arrow x1={nx - 36} y1={cy} x2={nx - 14} y2={cy} tone="soft" />}
            {split <= 0.01 && (
              <g>
                <ellipse className="fig-ghost" cx={cx} cy={cy} rx={46 + stretch} ry={46 - stretch * 0.4} fill="none" />
                {stretch > 14 && <circle className="fig-ghost" cx={cx} cy={cy} r={20} fill="none" opacity={0} />}
                {Array.from({ length: 14 }, (_, k) => {
                  const r = 36 * Math.sqrt((k + 0.5) / 14);
                  const a = k * 2.39996;
                  return <Nucleon key={k} x={cx + (r * Math.cos(a)) * (1 + stretch / 46) + 1.5 * Math.sin(TAU * t * 2 + k)} y={cy + r * Math.sin(a) * (1 - stretch / 120)} r={5} p={k % 2 === 0} />;
                })}
              </g>
            )}
            {split > 0.01 && (
              <g>
                {[-1, 1].map((sg) => (
                  <g key={sg}>
                    <circle className="fig-ghost" cx={cx + sg * (34 + 110 * split)} cy={cy} r={30} fill="none" />
                    {Array.from({ length: 7 }, (_, k) => {
                      const r = 22 * Math.sqrt((k + 0.5) / 7);
                      const a = k * 2.39996;
                      return <Nucleon key={k} x={cx + sg * (34 + 110 * split) + r * Math.cos(a)} y={cy + r * Math.sin(a)} r={5} p={k % 2 === 0} />;
                    })}
                    <Arrow x1={cx + sg * (34 + 110 * split) + sg * 36} y1={cy} x2={cx + sg * (34 + 110 * split) + sg * 36 + sg * 30 * split} y2={cy} tone="soft" />
                  </g>
                ))}
                {[[-0.6, -1], [0.2, -1.2], [0.8, 0.9]].map(([dx, dy], k) => {
                  const q = ease(phase(t, 4.0, 6.2));
                  return <Ball key={k} x={cx + dx * 200 * q} y={cy + dy * 90 * q} r={4.5} glow={false} />;
                })}
                <Flash x={cx} y={cy} p={flashP} size={130} />
                <Label x={cx} y={228} kind="label">fragments + 3 neutrons + about 200 MeV</Label>
              </g>
            )}
            <Label x={cx} y={32} kind="val">{t < 1.8 ? 'a slow neutron arrives' : t < 3.6 ? 'U-236 wobbles: surface tension vs Coulomb push' : 'the drop pinches in two'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ chain reaction

/** A branching tree of fission events (k = 2) and a steady chain (k = 1). */
export function ChainTree({ title = 'Each fission frees neutrons that cause more fissions: with two new fissions each time the number doubles every generation, and with one it stays steady' }: { title?: string }) {
  return (
    <Anim title={title} height={250} loop={10}>
      {(t) => {
        const gens = 5;
        const x = (g: number) => 70 + g * 110;
        const rows = (y0: number, y1: number, g: number, i: number) => y0 + ((i + 0.5) / 2 ** g) * (y1 - y0);
        const out: ReactNode[] = [];
        for (let g = 1; g <= gens; g++) {
          const q = ease(phase(t, 0.3 + (g - 1) * 0.9, 1.1 + (g - 1) * 0.9));
          for (let i = 0; i < 2 ** g; i++) {
            const py = rows(20, 120, g - 1, Math.floor(i / 2));
            const cy = rows(20, 120, g, i);
            out.push(<Line key={`l${g}${i}`} x1={x(g - 1)} y1={py} x2={lerp(x(g - 1), x(g), q)} y2={lerp(py, cy, q)} tone="soft" />);
            if (q >= 1) out.push(<Ball key={`b${g}${i}`} x={x(g)} y={cy} r={g > 3 ? 2.5 : 4} glow={false} />);
            else if (q > 0) out.push(<Ball key={`m${g}${i}`} x={lerp(x(g - 1), x(g), q)} y={lerp(py, cy, q)} r={2.5} glow={false} />);
          }
        }
        // steady chain
        const steady: ReactNode[] = [];
        for (let g = 1; g <= gens; g++) {
          const q = ease(phase(t, 0.3 + (g - 1) * 0.9, 1.1 + (g - 1) * 0.9));
          const yA = 200;
          steady.push(<Line key={`s${g}`} x1={x(g - 1)} y1={yA} x2={lerp(x(g - 1), x(g), q)} y2={yA} tone="soft" />);
          if (q >= 1) steady.push(<Ball key={`sb${g}`} x={x(g)} y={yA} r={4} glow={false} />);
          const ab = ease(phase(t, 0.6 + (g - 1) * 0.9, 1.3 + (g - 1) * 0.9));
          if (ab > 0) {
            steady.push(<Line key={`a${g}`} x1={x(g - 1)} y1={yA} x2={x(g - 1) + 40 * ab} y2={yA + 26 * ab} tone="soft" dashed />);
            if (ab >= 1) {
              steady.push(<Line key={`x1${g}`} x1={x(g - 1) + 34} y1={yA + 20} x2={x(g - 1) + 46} y2={yA + 32} tone="bright" />);
              steady.push(<Line key={`x2${g}`} x1={x(g - 1) + 46} y1={yA + 20} x2={x(g - 1) + 34} y2={yA + 32} tone="bright" />);
            }
          }
        }
        return (
          <g>
            <Ball x={x(0)} y={70} r={5} />
            {out}
            <Label x={14} y={14} kind="label" anchor="start">k = 2: doubles each generation</Label>
            {steady}
            <Ball x={x(0)} y={200} r={5} />
            <Label x={14} y={168} kind="label" anchor="start">k = 1: control rods absorb the extra neutron</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ reactor

export function Reactor() {
  return (
    <Anim title="A reactor core: fuel rods, control rods sliding in and out to set the power, a moderator that slows neutrons, and coolant carrying the heat away" height={284} loop={10}>
      {(t) => {
        const ins = 0.5 + 0.5 * Math.sin(TAU * (t / 10) - 1.2);
        const rodDrop = 140 * ins;
        const power = 1 - 0.85 * ins;
        return (
          <g>
            <rect className="fig-ghost" x={60} y={40} width={330} height={190} fill="none" />
            <Label x={225} y={254} kind="label">moderator + coolant</Label>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} className="fig-ball" x={95 + i * 78} y={70} width={14} height={150} opacity={0.25 + 0.45 * power} />
            ))}
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect className="fig-ghost" x={129 + i * 78} y={30 + rodDrop - 140} width={12} height={150} fill="none" />
                {Array.from({ length: 7 }, (_, k) => (
                  <Line key={k} x1={129 + i * 78} y1={30 + rodDrop - 140 + 12 + k * 20} x2={141 + i * 78} y2={30 + rodDrop - 140 + 22 + k * 20} tone="soft" />
                ))}
              </g>
            ))}
            {Array.from({ length: 10 }, (_, i) => {
              const bx = 80 + 290 * (0.5 + 0.5 * Math.sin(1.3 * i + t * (0.8 + 0.12 * i) * (0.4 + power)));
              const by = 62 + 156 * (0.5 + 0.5 * Math.cos(1.7 * i + t * (0.6 + 0.1 * i) * (0.4 + power)));
              return <Ball key={i} x={bx} y={by} r={2.6} glow={false} />;
            })}
            {/* coolant loop */}
            <Trail points={[[390, 90], [470, 90], [470, 190], [390, 190]]} tone="soft" />
            {[0, 1, 2, 3, 4].map((i) => {
              const u = ((t * 0.18 * (0.5 + power) + i / 5) % 1) * 3;
              const pt: Pt = u < 1 ? [390 + 80 * u, 90] : u < 2 ? [470, 90 + 100 * (u - 1)] : [470 - 80 * (u - 2), 190];
              return <Ball key={i} x={pt[0]} y={pt[1]} r={3.5} glow={false} />;
            })}
            <Label x={510} y={140} kind="label" anchor="start">to the turbine</Label>
            <Arrow x1={500} y1={90} x2={560} y2={90} tone="soft" />
            <Arrow x1={560} y1={190} x2={500} y2={190} tone="soft" />
            <Label x={515} y={236} kind="val">{`rods ${Math.round(ins * 100)}% in`}</Label>
            <Label x={515} y={256} kind="val">{`power ${Math.round(power * 100)}%`}</Label>
            <Label x={225} y={276} kind="label">fuel rods (solid), control rods (hatched)</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ fusion

export function FusionDT({ title = 'A deuterium and a tritium nucleus are driven together against their electric repulsion, fuse into helium-4 and fire out a neutron with 17.6 MeV of energy' }: { title?: string }) {
  return (
    <Anim title={title} height={260} loop={8}>
      {(t) => {
        const cx = 320, cy = 80;
        const a = ease(phase(t, 0.3, 3));
        const sep = lerp(240, 14, a);
        const fused = t > 3.1;
        const fl = phase(t, 3.1, 4.8);
        const nq = ease(phase(t, 3.2, 5.6));
        const Vx = 40, Vy = 235;
        const rr = (sep - 8) / 240;
        const V = (r: number) => (r < 0.03 ? 1 : Math.min(1, 0.04 / (r + 0.02)));
        return (
          <g>
            {!fused ? (
              <g>
                <Nucleon x={cx - sep / 2 - 8} y={cy} p r={9} />
                <Nucleon x={cx - sep / 2 + 12} y={cy} p={false} r={9} />
                <Nucleon x={cx + sep / 2 - 12} y={cy} p r={9} />
                <Nucleon x={cx + sep / 2 + 8} y={cy - 8} p={false} r={9} />
                <Nucleon x={cx + sep / 2 + 8} y={cy + 8} p={false} r={9} />
                <Arrow x1={cx - sep / 2 - 40} y1={cy} x2={cx - sep / 2 - 22} y2={cy} tone="soft" />
                <Arrow x1={cx + sep / 2 + 40} y1={cy} x2={cx + sep / 2 + 22} y2={cy} tone="soft" />
                <Label x={cx - sep / 2} y={cy - 28} kind="label">D</Label>
                <Label x={cx + sep / 2} y={cy - 28} kind="label">T</Label>
              </g>
            ) : (
              <g>
                {[0, 1, 2, 3].map((k) => (
                  <Nucleon key={k} x={cx - 14 + (k % 2) * 14 + 1.5 * Math.sin(TAU * t * 2 + k)} y={cy - 7 + (k < 2 ? 0 : 14)} p={k % 2 === 0} r={8} />
                ))}
                <Ball x={cx + 40 + 230 * nq} y={cy - 6 - 40 * nq} r={5} />
                <Flash x={cx} y={cy} p={fl} size={110} />
                <Label x={cx} y={cy + 40} kind="label">helium-4</Label>
                <Label x={cx + 40 + 230 * nq} y={cy - 22 - 40 * nq} kind="label">n</Label>
                <Label x={cx - 150} y={cy - 6} kind="val">17.6 MeV released</Label>
              </g>
            )}
            <Axes x={Vx} y={Vy} w={560} h={110} xLabel="r" yLabel="V" />
            <Trail points={curve(120, 1, (s) => [Vx + 12 + s * 520, Vy - 100 * V(1 - s)] as Pt)} tone="soft" />
            <Ball x={Vx + 12 + (1 - rr) * 520} y={Vy - 100 * V(rr)} r={5} />
            <Label x={Vx + 300} y={Vy - 112} kind="label">Coulomb barrier: needs high speed, i.e. very high temperature</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ star

/** Hot, fast particles in a star: only the fastest overcome the barrier and fuse. */
export function HotPlasma() {
  return (
    <Anim title="Fast-moving nuclei in a hot plasma collide constantly; now and then two are fast enough to fuse, and a flash of energy goes out" height={220} loop={8}>
      {(t) => {
        const n = 14;
        const fuse = Math.floor(t / 2);
        const fp = (t % 2) / 2;
        return (
          <g>
            <rect className="fig-ghost" x={20} y={20} width={600} height={180} fill="none" />
            {Array.from({ length: n }, (_, i) => {
              const sp = 0.7 + 1.4 * rnd(i);
              const ph1 = TAU * rnd(i + 20);
              const x = 40 + 560 * (0.5 + 0.5 * Math.sin(sp * t * 1.3 + ph1));
              const y = 40 + 140 * (0.5 + 0.5 * Math.cos(sp * t * 0.9 + ph1 * 2));
              return <Ball key={i} x={x} y={y} r={4.5} glow={false} />;
            })}
            {fp < 0.5 && <Flash x={80 + 90 * (fuse % 5) + 60} y={60 + 40 * (fuse % 3)} p={fp * 2} size={60} />}
            <Label x={320} y={14} kind="label">about 10 million kelvin and more</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ carbon dating

export function CarbonClock() {
  return (
    <Anim title="The fraction of carbon-14 left in a dead sample falls along a decay curve; a marker sweeps through the years and shows the age when a quarter remains" height={240} loop={9}>
      {(t) => {
        const x0 = 70, y0 = 200, wx = 500, hy = 160;
        const age = 20000 * ease(phase(t, 0.5, 7));
        const X = (a: number) => x0 + (a / 20000) * wx;
        const f = (a: number) => 0.5 ** (a / 5730);
        const Y = (v: number) => y0 - v * hy;
        return (
          <g>
            <Axes x={x0} y={y0} w={wx + 20} h={hy + 20} xLabel="years" yLabel="C-14 left" />
            <Trail points={curve(100, age, (a) => [X(a), Y(f(a))] as Pt)} />
            <Line x1={x0} y1={Y(0.25)} x2={X(11460)} y2={Y(0.25)} tone="soft" dashed />
            <Line x1={X(11460)} y1={Y(0.25)} x2={X(11460)} y2={y0} tone="soft" dashed />
            <Label x={X(11460)} y={y0 + 18} kind="val">11 460 y</Label>
            <Label x={x0 - 8} y={Y(0.25) + 5} kind="val" anchor="end">1/4</Label>
            <Label x={x0 - 8} y={Y(0.5) + 5} kind="val" anchor="end">1/2</Label>
            <Ball x={X(age)} y={Y(f(age))} r={5.5} />
            <Readout y={34}>{`age ${Math.round(age / 10) * 10} y   left ${(f(age) * 100).toFixed(1)}%`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ energy scale

export function EnergyScale() {
  const items: [string, number, string][] = [
    ['chemical: burning one carbon atom', 4, '4 eV'],
    ['fission of one U-235 nucleus', 200e6, '200 MeV'],
    ['fusion of D + T', 17.6e6, '17.6 MeV'],
  ];
  return (
    <Anim title="Bars on a logarithmic scale compare the energy released by a chemical reaction, by fission of one uranium nucleus and by one deuterium-tritium fusion; the nuclear bars are millions of times longer" height={200} loop={7}>
      {(t) => (
        <g>
          {items.map(([name, v, lab], i) => {
            const len = (Math.log10(v) / 8.5) * 400 * ease(phase(t, 0.4 + i * 0.7, 1.8 + i * 0.7));
            const y = 50 + i * 55;
            return (
              <g key={name}>
                <Label x={20} y={y - 10} kind="label" anchor="start">{name}</Label>
                <rect className="fig-ball" x={20} y={y} width={len} height={16} opacity={0.3 + 0.2 * Math.sin(TAU * t + i)} />
                <rect className="fig-ghost" x={20} y={y} width={len} height={16} fill="none" />
                <Label x={28 + len} y={y + 13} kind="val" anchor="start">{lab}</Label>
              </g>
            );
          })}
          <Label x={W - 14} y={192} kind="label" anchor="end">length goes as the logarithm of energy</Label>
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ stability

/** The neutron-proton plot: stable nuclei sit in a narrow band, and unstable ones decay toward it. */
export function Stability() {
  const band = (Z: number) => Z + 0.0065 * Z * Z;
  return (
    <Anim title="A plot of neutrons against protons: stable nuclei lie in a narrow band that bends above the line N equals Z, and unstable nuclei hop toward it by beta decay and alpha decay" height={270} loop={9}>
      {(t) => {
        const x0 = 70, y0 = 235, w = 300, h = 205;
        const X = (Z: number) => x0 + (Z / 90) * w;
        const Y = (N: number) => y0 - (N / 140) * h;
        const b = phase(t, 1.0, 2.2);
        const a1 = phase(t, 4.4, 5.6);
        // a neutron-rich nucleus steps down-right by beta decay; a heavy nucleus steps down-left by alpha decay
        const bp: Pt = [lerp(40, 41, ease(b)), lerp(58, 57, ease(b))];
        const ap: Pt = [lerp(84, 82, ease(a1)), lerp(130, 128, ease(a1))];
        return (
          <g>
            <Axes x={x0} y={y0} w={w + 20} h={h + 15} xLabel="Z" yLabel="N" />
            <Trail points={[[X(0), Y(0)], [X(90), Y(90)]]} tone="soft" dashed />
            <Label x={X(66)} y={Y(66) + 26} kind="label" anchor="start">N = Z</Label>
            <Trail points={curve(60, 84, (z) => [X(z), Y(band(z))] as Pt)} />
            {Array.from({ length: 60 }, (_, i) => {
              const z = 2 + (i / 60) * 82;
              return <circle key={i} className="fig-ball" cx={X(z)} cy={Y(band(z) + 2.4 * (rnd(i) - 0.5))} r={1.8} opacity={0.5} />;
            })}
            <Ball x={X(bp[0])} y={Y(bp[1])} r={5} />
            <Ball x={X(ap[0])} y={Y(ap[1])} r={5} />
            <Arrow x1={X(40) + 8} y1={Y(58)} x2={X(41) + 22} y2={Y(57) + 6} tone="soft" />
            <Label x={X(46)} y={Y(70)} kind="label" anchor="start">too many neutrons: beta decay</Label>
            <Label x={X(8)} y={Y(130)} kind="label" anchor="start">alpha decay steps down by (2, 2)</Label>
            <Label x={500} y={60} kind="label" anchor="middle">light nuclei: N ≈ Z</Label>
            <Label x={500} y={82} kind="label" anchor="middle">heavy nuclei: N well above Z</Label>
            <Label x={500} y={104} kind="label" anchor="middle">Z above 83: none stable</Label>
          </g>
        );
      }}
    </Anim>
  );
}
