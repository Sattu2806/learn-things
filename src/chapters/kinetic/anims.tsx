import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Label, Line, Readout, Trail, Wall, clamp, ease, lerp, phase } from '../kit/Anim';

/**
 * Animations for the kinetic theory chapter. Every random-looking thing comes
 * from a seeded generator, so the pictures are the same on every loop.
 */

// ------------------------------------------------------------------ helpers

function rnd(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (r: () => number) => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());

/** A point bouncing between lo and hi: position and the sign of its direction. */
function fold(x0: number, v: number, t: number, lo: number, hi: number): [number, number] {
  const L = hi - lo;
  const m = 2 * L;
  const s = (((x0 - lo + v * t) % m) + m) % m;
  const fwd = s <= L;
  return [lo + (fwd ? s : m - s), (v >= 0 ? 1 : -1) * (fwd ? 1 : -1)];
}

function makeParts(n: number, seed: number) {
  const r = rnd(seed);
  return Array.from({ length: n }, () => ({ u: 0.04 + 0.92 * r(), w: 0.04 + 0.92 * r(), vx: gauss(r) * 60, vy: gauss(r) * 60 }));
}

const Tx = ({ x, y, children, anchor = 'middle', size = 13, dim }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number; dim?: boolean }) => (
  <text className="fig-val" x={x} y={y} textAnchor={anchor} style={{ fontSize: size, opacity: dim ? 0.45 : 1 }}>
    {children}
  </text>
);
const Sub = ({ m, s }: { m: string; s: string }) => (
  <>
    {m}
    <tspan dy={5} fontSize={13}>
      {s}
    </tspan>
  </>
);

// ------------------------------------------------------------------ a gas in a box

const N_ALL = 44;
const T0 = 300;
const L0 = 240;
const PARTS = makeParts(N_ALL, 11);

export interface GasState {
  L: number;
  T: number;
  n: number;
  nMol: number;
  V: number;
  p: number;
}
interface PlotSpec {
  xl: ReactNode;
  yl: ReactNode;
  x: (s: GasState) => number;
  y: (s: GasState) => number;
  xr: [number, number];
  yr: [number, number];
}
interface GasProps {
  title: string;
  loop?: number;
  height?: number;
  L?: (t: number) => number;
  T?: (t: number) => number;
  n?: (t: number) => number;
  n0?: number;
  plot?: PlotSpec;
  info?: (s: GasState) => string[];
  top?: number;
  H?: number;
  readout?: (t: number) => string;
}

/** Many particles in a box with a piston; the wall flashes where they strike it. */
export function GasBox({ title, loop = 6, height = 280, L = () => L0, T = () => T0, n = () => 20, n0 = 20, plot, info, top = 56, H = 160, readout }: GasProps) {
  const stateAt = (t: number): GasState => {
    const Lx = L(t);
    const Tx_ = T(t);
    const nx = n(t);
    const nMol = nx / n0;
    const V = (24.6 * Lx) / L0;
    return { L: Lx, T: Tx_, n: nx, nMol, V, p: (nMol * 0.08206 * Tx_) / V };
  };
  const x0 = 24;
  const lines = (s: GasState) => info?.(s) ?? [`n = ${s.nMol.toFixed(2)} mol`, `T = ${s.T.toFixed(0)} K`, `V = ${s.V.toFixed(1)} L`, `p = ${s.p.toFixed(2)} atm`];
  return (
    <Anim title={title} height={height} loop={loop}>
      {(t) => {
        const s = stateAt(t);
        // time warp so that speeds follow sqrt(T) and the box length follows the piston
        let G = 0;
        let F = 0;
        let Gp = 0;
        const tp = t - 0.2;
        for (let u = 0; u < t; u += 0.02) {
          const sp = Math.sqrt(Math.max(0, T(u)) / T0);
          G += (sp / (L(u) / L0)) * 0.02;
          F += (sp / H) * 0.02;
          if (u < tp) Gp = G;
        }
        const xp = x0 + s.L;
        const r = 3.4;
        const shown = Math.floor(s.n);
        const parts: ReactNode[] = [];
        const flashes: ReactNode[] = [];
        for (let i = 0; i < shown; i++) {
          const q = PARTS[i];
          const [u] = fold(q.u, (q.vx * G) / L0, 1, 0, 1);
          const [w] = fold(q.w, q.vy * F, 1, 0, 1);
          const px = x0 + r + u * (s.L - 2 * r);
          const py = top + r + w * (H - 2 * r);
          const z0 = q.u + (q.vx * Gp) / L0;
          const z1 = q.u + (q.vx * G) / L0;
          if (Math.floor((z1 + 1) / 2) !== Math.floor((z0 + 1) / 2)) flashes.push(<line key={i} className="fig-bar" x1={xp - 1} x2={xp - 1} y1={py - 9} y2={py + 9} style={{ strokeWidth: 3 }} />);
          parts.push(i === 0 ? <Ball key={i} x={px} y={py} r={4.6} /> : <circle key={i} className="fig-ball" cx={px} cy={py} r={r} style={{ opacity: 0.8 }} />);
        }
        const pad = 448;
        const gx = 466;
        const gy = 238;
        const pw = 150;
        const ph = 118;
        const map = (st: GasState): [number, number] =>
          plot ? [gx + ((plot.x(st) - plot.xr[0]) / (plot.xr[1] - plot.xr[0])) * pw, gy - ((plot.y(st) - plot.yr[0]) / (plot.yr[1] - plot.yr[0])) * ph] : [0, 0];
        const full: [number, number][] = [];
        const done: [number, number][] = [];
        if (plot) {
          for (let u = 0; u <= loop - 0.001; u += 0.1) {
            full.push(map(stateAt(u)));
            if (u <= t) done.push(map(stateAt(u)));
          }
          done.push(map(s));
        }
        const cur = plot ? map(s) : [0, 0];
        return (
          <g>
            <Wall x={x0} y1={top} y2={top + H} side={-1} />
            <Line x1={x0} y1={top} x2={xp} y2={top} tone="soft" />
            <Line x1={x0} y1={top + H} x2={xp} y2={top + H} tone="soft" />
            <rect className="kit-block is-filled" x={xp} y={top} width={7} height={H} />
            <Line x1={xp + 7} y1={top + H / 2} x2={xp + 52} y2={top + H / 2} tone="soft" />
            {parts}
            {flashes}
            {lines(s).map((tx, i) => (
              <Tx key={i} x={pad} y={top - 20 + i * 17} anchor="start">
                {tx}
              </Tx>
            ))}
            {readout && <Readout x={x0 + 4} y={top - 22}>{readout(t)}</Readout>}
            {plot && (
              <g>
                <Axes x={gx} y={gy} w={pw} h={ph + 10} xLabel={plot.xl} yLabel={plot.yl} />
                <Trail points={full} tone="faint" />
                <Trail points={done} />
                <Ball x={cur[0]} y={cur[1]} r={5} />
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ one molecule between two walls

export function OneMolecule() {
  const xl = 100;
  const xr = 450;
  const r = 9;
  const v = 175;
  const y = 120;
  return (
    <Anim title="One molecule bounces between two walls, handing 2 m vx of momentum to a wall at each hit" height={260} loop={8}>
      {(t) => {
        const [bx, dir] = fold(xl + r, v, t, xl + r, xr - r);
        const trRight = (((t - 2) % 4) + 4) % 4;
        const trLeft = ((t % 4) + 4) % 4;
        const side = trRight < 1.7 && t > 2 ? 1 : trLeft < 1.7 && t > 0.01 ? -1 : 0;
        const tr = side === 1 ? trRight : trLeft;
        const a = side ? 1 - phase(tr, 1.0, 1.7) : 0;
        const hits = Math.floor((t - 2) / 4) + 1;
        return (
          <g>
            <Wall x={xl} y1={50} y2={190} side={-1} />
            <Wall x={xr} y1={50} y2={190} side={1} />
            <Line x1={xl} y1={50} x2={xr} y2={50} tone="faint" />
            <Line x1={xl} y1={190} x2={xr} y2={190} tone="faint" />
            <Ball x={bx} y={y} r={r} />
            <Arrow x1={bx} y1={y - 26} x2={bx + dir * 54} y2={y - 26} label={<Sub m="m·v" s="x" />} />
            {side !== 0 && (
              <g style={{ opacity: a }}>
                <Arrow x1={side === 1 ? xr + 10 : xl - 10} y1={y} x2={side === 1 ? xr + 70 : xl - 70} y2={y} width={5} />
                <Label x={side === 1 ? xr + 60 : xl - 60} y={y + 30}>2 m vx</Label>
              </g>
            )}
            <Line x1={xl} y1={214} x2={xr} y2={214} tone="soft" />
            <Line x1={xl} y1={208} x2={xl} y2={220} tone="soft" />
            <Line x1={xr} y1={208} x2={xr} y2={220} tone="soft" />
            <Label x={(xl + xr) / 2} y={206} kind="sym">L</Label>
            <Tx x={(xl + xr) / 2} y={244} size={12}>
              {side !== 0 ? 'momentum before +m·vx, after −m·vx: the wall receives 2·m·vx' : 'time between hits on the same wall: 2·L / vx'}
            </Tx>
            <Readout>{`hits on the right wall: ${Math.max(0, hits - (t < 2 ? 1 : 0))}`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ force on a wall: spikes smooth out

const BIN = 0.1;
const NB = 80;
function spikes(count: number, seed: number) {
  const r = rnd(seed);
  const per: [number, number][] = Array.from({ length: count }, () => [0.8 + r() * 1.1, r() * 2]);
  const bins = new Array<number>(NB).fill(0);
  for (const [P, ph] of per) for (let b = 0; b < NB; b++) bins[b] += Math.floor((b * BIN + BIN - ph) / P) - Math.floor((b * BIN - ph) / P);
  const mean = bins.reduce((a, b) => a + b, 0) / NB;
  return { per, bins, mean };
}
const SP1 = spikes(1, 3);
const SP10 = spikes(10, 5);
const SP2000 = spikes(2000, 9);

export function ForceSpikes() {
  const rows = [
    { y: 74, sp: SP1, name: '1 molecule', one: true },
    { y: 160, sp: SP10, name: '10 molecules', one: false },
    { y: 246, sp: SP2000, name: '2000 molecules', one: false },
  ];
  const X = 150;
  const Wd = 470;
  return (
    <Anim title="The force on a wall is a series of spikes from single molecules; with very many molecules the spikes blur into a steady force" height={290} loop={9}>
      {(t) => {
        const upto = clamp(t - 0.3, 0, 8);
        return (
          <g>
            {rows.map((row) => {
              const pts: [number, number][] = [];
              if (row.one) {
                const [P, ph] = row.sp.per[0];
                const hits = [];
                for (let k = 0; ph + k * P < upto; k++) hits.push(ph + k * P);
                for (const h of hits) pts.push([X + (h / 8) * Wd, row.y - 46]);
                return (
                  <g key={row.name}>
                    <Line x1={X} y1={row.y} x2={X + Wd} y2={row.y} tone="faint" />
                    {pts.map(([x, y], i) => (
                      <Line key={i} x1={x} y1={row.y} x2={x} y2={y} tone="bright" />
                    ))}
                    <Line x1={X} y1={row.y - 22} x2={X + Wd} y2={row.y - 22} tone="soft" dashed />
                    <Label x={10} y={row.y - 18} kind="label" anchor="start">{row.name}</Label>
                  </g>
                );
              }
              const nb = Math.floor(upto / BIN);
              for (let b = 0; b < nb; b++) pts.push([X + ((b + 0.5) * BIN * Wd) / 8, row.y - (row.sp.bins[b] / row.sp.mean) * 22]);
              return (
                <g key={row.name}>
                  <Line x1={X} y1={row.y} x2={X + Wd} y2={row.y} tone="faint" />
                  <Trail points={pts} />
                  <Line x1={X} y1={row.y - 22} x2={X + Wd} y2={row.y - 22} tone="soft" dashed />
                  <Label x={10} y={row.y - 18} kind="label" anchor="start">{row.name}</Label>
                </g>
              );
            })}
            <Tx x={X + Wd} y={20} anchor="end" size={12}>
              force on the wall against time (dashed: the average)
            </Tx>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ hot and cold

const HC = makeParts(14, 21);
export function HotCold() {
  const boxes = [
    { x: 30, T: 150, name: 'T = 150 K', ke: '3.11 × 10⁻²¹ J' },
    { x: 350, T: 600, name: 'T = 600 K', ke: '1.24 × 10⁻²⁰ J' },
  ];
  const Wd = 260;
  const top = 44;
  const H = 130;
  return (
    <Anim title="Two boxes of gas: in the hotter one the molecules move faster and carry more kinetic energy" height={270} loop={6}>
      {(t) => (
        <g>
          {boxes.map((b) => {
            const sp = Math.sqrt(b.T / 150);
            return (
              <g key={b.x}>
                <rect className="kit-block" x={b.x} y={top} width={Wd} height={H} rx={2} />
                {HC.map((q, i) => {
                  const [u, du] = fold(q.u, (q.vx * sp * 0.9) / Wd, t, 0, 1);
                  const [w, dw] = fold(q.w, (q.vy * sp * 0.9) / H, t, 0, 1);
                  const px = b.x + 6 + u * (Wd - 12);
                  const py = top + 6 + w * (H - 12);
                  const vx = du * Math.abs(q.vx) * sp * 0.35;
                  const vy = dw * Math.abs(q.vy) * sp * 0.35;
                  return (
                    <g key={i}>
                      <circle className="fig-ball" cx={px} cy={py} r={3.6} />
                      <Arrow x1={px} y1={py} x2={px + vx} y2={py + vy} width={1.6} tone="soft" />
                    </g>
                  );
                })}
                <Label x={b.x + Wd / 2} y={top + H + 26} kind="val">{b.name}</Label>
                <rect className="kit-block is-filled" x={b.x} y={top + H + 44} width={(Wd * b.T) / 600} height={12} rx={2} />
                <Tx x={b.x} y={top + H + 78} anchor="start" size={12}>
                  {`average kinetic energy ${b.ke}`}
                </Tx>
              </g>
            );
          })}
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ speed distribution

const SIG = 298.4; // sqrt(k T / m) for nitrogen at 300 K, m/s
const maxwell = (v: number, sg: number) => Math.sqrt(2 / Math.PI) * ((v * v) / (sg * sg * sg)) * Math.exp(-(v * v) / (2 * sg * sg));
const SPEED_SAMPLES = (() => {
  const r = rnd(42);
  return Array.from({ length: 520 }, () => SIG * Math.hypot(gauss(r), gauss(r), gauss(r)));
})();
const FPEAK = maxwell(Math.SQRT2 * SIG, SIG);

export function SpeedHist() {
  const x0 = 60;
  const base = 226;
  const sc = 0.27;
  const K = 108 / FPEAK;
  const bars = (T: number, n: number) => {
    const f = Math.sqrt(T / 300);
    const cnt = new Array<number>(20).fill(0);
    for (let i = 0; i < n; i++) {
      const b = Math.floor((SPEED_SAMPLES[i] * f) / 100);
      if (b < 20) cnt[b]++;
    }
    return cnt.map((c) => (n ? (c / (n * 100)) * K : 0));
  };
  const curve = (T: number) => {
    const pts: [number, number][] = [];
    for (let v = 0; v <= 2000; v += 25) pts.push([x0 + v * sc, base - maxwell(v, SIG * Math.sqrt(T / 300)) * K]);
    return pts;
  };
  const marks = [
    { v: Math.SQRT2 * SIG, name: 'p', at: 52, side: -1, from: 0.5 },
    { v: Math.sqrt(8 / Math.PI) * SIG, name: 'mean', at: 74, side: 1, from: 1.1 },
    { v: Math.sqrt(3) * SIG, name: 'rms', at: 96, side: 1, from: 1.7 },
  ];
  return (
    <Anim title="Speeds of 520 molecules build up a histogram, the Maxwell curve fits it, and at 900 K the whole distribution shifts right and flattens" height={290} loop={14}>
      {(t) => {
        const hot = t > 7.4;
        const nCold = Math.floor(520 * ease(phase(t, 0.3, 4.6)));
        const nHot = Math.floor(520 * ease(phase(t, 7.6, 11.4)));
        const cold = bars(300, nCold);
        const hotBars = bars(900, nHot);
        const fadeCold = 1 - 0.65 * phase(t, 7.2, 7.6);
        return (
          <g>
            <Axes x={x0} y={base} w={565} h={196} xLabel="v" yLabel="f" />
            {[0, 500, 1000, 1500, 2000].map((v) => (
              <Tx key={v} x={x0 + v * sc} y={base + 20} size={11}>
                {v}
              </Tx>
            ))}
            <Tx x={x0 + 565} y={base + 38} size={11} anchor="end">
              speed in m/s
            </Tx>
            {hotBars.map((h, i) => (
              <rect key={`h${i}`} className="kit-block is-filled" x={x0 + i * 100 * sc + 1} y={base - h} width={100 * sc - 2} height={h} style={{ opacity: 0.5 }} />
            ))}
            {cold.map((h, i) => (
              <rect key={`c${i}`} className="kit-block" x={x0 + i * 100 * sc + 1} y={base - h} width={100 * sc - 2} height={h} style={{ opacity: fadeCold }} />
            ))}
            <g style={{ opacity: phase(t, 4.7, 5.3) * (hot ? 0.5 : 1) }}>
              <Trail points={curve(300)} />
            </g>
            {marks.map((m, i) => {
              const a = phase(t, 5.4 + i * 0.5, 5.9 + i * 0.5) * (1 - phase(t, 7.2, 7.6));
              const x = x0 + m.v * sc;
              return (
                <g key={m.name} style={{ opacity: a }}>
                  <Line x1={x} y1={base} x2={x} y2={m.at} tone="soft" dashed />
                  <text className="fig-sym" x={x + m.side * 4} y={m.at + 5} textAnchor={m.side < 0 ? 'end' : 'start'} style={{ fontSize: 17 }}>
                    {m.name === 'p' ? <Sub m="v" s="p" /> : m.name === 'mean' ? 'v̄' : <Sub m="v" s="rms" />}
                  </text>
                </g>
              );
            })}
            <g style={{ opacity: phase(t, 11.2, 11.8) }}>
              <Trail points={curve(900)} />
              <Arrow x1={x0 + Math.SQRT2 * SIG * sc} y1={44} x2={x0 + Math.SQRT2 * SIG * Math.sqrt(3) * sc} y2={44} dashed tone="soft" />
              <Tx x={x0 + Math.SQRT2 * SIG * 2 * sc + 10} y={48} anchor="start" size={12}>
                peak moves right, curve flattens
              </Tx>
            </g>
            <Readout>{hot ? 'T = 900 K' : 'T = 300 K'}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ degrees of freedom

function Dumbbell({ x, y, ang, len = 38 }: { x: number; y: number; ang: number; len?: number }) {
  const dx = (Math.cos(ang) * len) / 2;
  const dy = (Math.sin(ang) * len) / 2;
  return (
    <g>
      <Line x1={x - dx} y1={y - dy} x2={x + dx} y2={y + dy} tone="bright" />
      <Ball x={x - dx} y={y - dy} r={10} />
      <Ball x={x + dx} y={y + dy} r={10} />
    </g>
  );
}

export function Diatomic({ vib = true, gamma }: { vib?: boolean; gamma?: boolean }) {
  const loop = vib ? 12.5 : 10;
  return (
    <Anim title="A diatomic molecule moves, then rotates, then (only when hot) vibrates: each way of storing energy is a degree of freedom" height={250} loop={loop}>
      {(t) => {
        const aT = phase(t, 0.2, 3.4);
        const inA = t < 3.6;
        const inB = t >= 3.6 && t < 7;
        const inC = vib && t >= 7.4 && t < 10.8;
        let f = 3;
        let msg = 'translation: moving along x, y and z gives 3';
        let body: ReactNode;
        if (inA) {
          const x = lerp(130, 510, ease(aT));
          const y = 150 - 26 * Math.sin(Math.PI * aT);
          body = (
            <g>
              <Dumbbell x={x} y={y} ang={-0.35} />
              <Arrow x1={x} y1={y + 24} x2={x + 56} y2={y + 24} />
              <Arrow x1={x - 34} y1={y} x2={x - 34} y2={y - 34 * Math.cos(Math.PI * aT)} tone="soft" />
            </g>
          );
        } else if (inB || (!vib && t >= 7) || (vib && t >= 7 && t < 7.4)) {
          f = 5;
          msg = 'rotation: spinning about two axes at right angles to the bond adds 2';
          const a = (t - 3.6) * 3.2;
          body = (
            <g>
              <path className="fig-guide fig-dash" d="M 275 150 A 45 45 0 1 1 275 149.9" />
              <Dumbbell x={320} y={150} ang={a} />
            </g>
          );
          if (t >= 7 && !vib) {
            msg = 'at room temperature the vibration stays frozen: f = 5';
            body = (
              <g>
                <Dumbbell x={320} y={150} ang={(t - 3.6) * 3.2} />
              </g>
            );
          }
        } else if (inC) {
          f = 7;
          msg = 'vibration: stretching the bond adds 2 more (needs a hot gas)';
          const len = 38 + 14 * Math.sin((t - 7.4) * 7);
          body = <Dumbbell x={320} y={150} ang={-0.35} len={len} />;
        } else {
          f = vib ? 5 : 5;
          msg = vib ? 'at room temperature: f = 5 (translation + rotation)' : 'at room temperature: f = 5';
          body = <Dumbbell x={320} y={150} ang={-0.35} />;
        }
        if (vib && t >= 10.8) f = 5;
        const showG = gamma && t >= 7;
        return (
          <g>
            <Readout>{`f = ${f}`}</Readout>
            <Tx x={320} y={40} size={13}>
              {msg}
            </Tx>
            {body}
            {showG && (
              <g style={{ opacity: phase(t, 7, 7.8) }}>
                <Tx x={320} y={222} size={14}>
                  Cv = 5/2 R   Cp = 7/2 R   γ = 7/5 = 1.40
                </Tx>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

export function EnergyBars({ f }: { f: 3 | 5 }) {
  const names = ['x', 'y', 'z', 'turn 1', 'turn 2'].slice(0, f);
  const mult = [1, 2, 3, 2, 1];
  const ph = [0, 1.3, 2.4, 4, 5.2];
  const gap = 78;
  const x0 = 320 - ((f - 1) * gap) / 2;
  return (
    <Anim title={`Each of the ${f} ways of storing energy holds on average the same amount, one half of k T, though it wobbles from moment to moment`} height={250} loop={6}>
      {(t) => (
        <g>
          {names.map((nm, i) => {
            const h = 52 * (1 + 0.6 * Math.sin((2 * Math.PI * mult[i] * t) / 6 + ph[i]));
            const x = x0 + i * gap;
            return (
              <g key={nm}>
                <rect className={i < 3 ? 'kit-block' : 'kit-block is-filled'} x={x - 22} y={190 - h} width={44} height={h} rx={2} />
                <Tx x={x} y={212} size={12}>
                  {nm}
                </Tx>
              </g>
            );
          })}
          <Line x1={x0 - 50} y1={190 - 52} x2={x0 + (f - 1) * gap + 50} y2={190 - 52} tone="soft" dashed />
          <Line x1={x0 - 50} y1={190} x2={x0 + (f - 1) * gap + 50} y2={190} tone="faint" />
          <Tx x={x0 + (f - 1) * gap + 56} y={190 - 48} anchor="start" size={12}>
            ½ k T
          </Tx>
          <Readout>{`E = ${f} × ½ k T per molecule`}</Readout>
        </g>
      )}
    </Anim>
  );
}

export function CvStaircase() {
  const gx = 90;
  const gy = 228;
  const w = 500;
  const lo = Math.log(20);
  const hi = Math.log(6000);
  const sig = (x: number) => 1 / (1 + Math.exp(-x));
  const cv = (T: number) => 1.5 + sig((Math.log(T) - Math.log(160)) / 0.3) + sig((Math.log(T) - Math.log(2800)) / 0.35);
  const X = (T: number) => gx + ((Math.log(T) - lo) / (hi - lo)) * w;
  const Y = (c: number) => gy - ((c - 1) / 3) * 170;
  const pts: [number, number][] = [];
  for (let T = 20; T <= 6000; T *= 1.03) pts.push([X(T), Y(cv(T))]);
  return (
    <Anim title="Heat capacity of hydrogen against temperature: it steps from 3/2 R to 5/2 R to 7/2 R as rotation and vibration switch on" height={290} loop={9}>
      {(t) => {
        const T = Math.exp(lerp(lo, hi, ease(phase(t, 0.4, 7.6))));
        const c = cv(T);
        const reg = T < 100 ? 0 : T < 1500 ? 1 : 2;
        const done = pts.filter((p) => p[0] <= X(T));
        return (
          <g>
            <Axes x={gx} y={gy} w={w + 10} h={176} xLabel="T" yLabel="Cv" />
            {[1.5, 2.5, 3.5].map((v, i) => (
              <g key={v}>
                <Line x1={gx} y1={Y(v)} x2={gx + w} y2={Y(v)} tone="faint" dashed />
                <Tx x={gx - 8} y={Y(v) + 4} anchor="end" size={12}>
                  {['3/2 R', '5/2 R', '7/2 R'][i]}
                </Tx>
              </g>
            ))}
            {[30, 100, 300, 1000, 3000].map((v) => (
              <Tx key={v} x={X(v)} y={gy + 18} size={11}>
                {v}
              </Tx>
            ))}
            <Tx x={gx + w + 2} y={gy + 18} anchor="start" size={11}>
              K
            </Tx>
            <Trail points={pts} tone="faint" />
            <Trail points={done} />
            <Ball x={X(T)} y={Y(c)} r={5.5} />
            <Tx x={X(40)} y={44} dim={reg !== 0} size={12}>
              translation only
            </Tx>
            <Tx x={X(500)} y={44} dim={reg !== 1} size={12}>
              + rotation
            </Tx>
            <Tx x={X(4500)} y={44} dim={reg !== 2} size={12}>
              + vibration
            </Tx>
            <Readout y={70}>{`T = ${T < 1000 ? T.toFixed(0) : (Math.round(T / 10) * 10).toFixed(0)} K`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ Cp and Cv

export function CpCv() {
  return (
    <Anim title="The same temperature rise costs more heat at constant pressure, because the gas must also push the piston up and do work" height={300} loop={8}>
      {(t) => {
        const g = ease(phase(t, 1, 5.4));
        const rise = 22 * g;
        const cyl = (cx: number, pistonY: number, tag: string) => (
          <g>
            <rect className="kit-block" x={cx - 60} y={40} width={120} height={130} rx={2} />
            <rect className="kit-block is-filled" x={cx - 58} y={pistonY} width={116} height={7} />
            <Line x1={cx} y1={pistonY} x2={cx} y2={pistonY - 18} tone="soft" />
            <Arrow x1={cx} y1={206} x2={cx} y2={178} tone="soft" width={2.2} />
            <Tx x={cx} y={30} size={12}>
              {tag}
            </Tx>
          </g>
        );
        const U = 36;
        const bar = (cx: number, parts: [number, boolean][]) => {
          let x = cx - 100;
          return parts.map(([c, fill], i) => {
            const wd = c * U * g;
            const r = (
              <rect key={i} className={fill ? 'kit-block is-filled' : 'kit-block'} x={x} y={222} width={wd} height={20} rx={2} />
            );
            x += wd;
            return r;
          });
        };
        return (
          <g>
            {cyl(165, 96, 'volume fixed')}
            {cyl(475, 96 - rise, 'pressure fixed')}
            {bar(165, [[2.5, true]])}
            {bar(475, [
              [2.5, true],
              [1, false],
            ])}
            <Tx x={165} y={266} size={13}>
              Q = Cv·ΔT = 5/2 R·ΔT
            </Tx>
            <Tx x={475} y={266} size={13}>
              Q = Cp·ΔT = 7/2 R·ΔT
            </Tx>
            <Tx x={165} y={284} size={11} dim>
              all heat raises the internal energy
            </Tx>
            <Tx x={475} y={284} size={11} dim>
              solid: internal energy, outline: work R·ΔT
            </Tx>
            <Readout>1 mol, ΔT = 100 K</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ mean free path

const MFP = (() => {
  const r = rnd(77);
  const pts: [number, number][] = [[80, 140]];
  let guard = 0;
  while (pts.length < 40 && guard++ < 500) {
    const [x, y] = pts[pts.length - 1];
    const len = -Math.log(1 - r()) * 70 + 14;
    const a = r() * 2 * Math.PI;
    const nx = x + Math.cos(a) * len;
    const ny = y + Math.sin(a) * len;
    if (nx > 24 && nx < 616 && ny > 40 && ny < 232) pts.push([nx, ny]);
  }
  const others: [number, number][] = Array.from({ length: 46 }, () => [30 + r() * 580, 46 + r() * 180]);
  return { pts, others };
})();

export function MeanFreePath() {
  const { pts, others } = MFP;
  const speed = 150;
  return (
    <Anim title="One molecule among many others: it flies straight until it collides, then changes direction; the average length of those straight pieces is the mean free path" height={270} loop={14}>
      {(t) => {
        let d = speed * t;
        const done: [number, number][] = [pts[0]];
        let cur: [number, number] = pts[0];
        let seg = 0;
        for (let i = 1; i < pts.length; i++) {
          const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
          if (d >= L) {
            d -= L;
            done.push(pts[i]);
            cur = pts[i];
            seg = i;
          } else {
            const q = d / L;
            cur = [lerp(pts[i - 1][0], pts[i][0], q), lerp(pts[i - 1][1], pts[i][1], q)];
            break;
          }
        }
        const path = [...done, cur];
        const m = pts[Math.min(3, pts.length - 1)];
        const m0 = pts[2];
        const showL = seg >= 3;
        const nx = -(m[1] - m0[1]);
        const ny = m[0] - m0[0];
        const nl = Math.hypot(nx, ny) || 1;
        return (
          <g>
            <rect className="kit-block" x={14} y={30} width={612} height={214} rx={3} style={{ fill: 'none', opacity: 0.5 }} />
            {others.map(([x, y], i) => (
              <circle key={i} className="fig-dot" cx={x} cy={y} r={3.4} />
            ))}
            {pts.slice(1, seg + 1).map(([x, y], i) => (
              <circle key={i} className="fig-ghost" cx={x} cy={y} r={6} />
            ))}
            <Trail points={path} />
            <Ball x={cur[0]} y={cur[1]} r={5.5} />
            {showL && (
              <g>
                <Label x={(m[0] + m0[0]) / 2 + (nx / nl) * 18} y={(m[1] + m0[1]) / 2 + (ny / nl) * 18} kind="sym">λ</Label>
              </g>
            )}
            <Readout y={22}>{`collisions: ${seg}`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ Brownian motion

const BR_PATH = (() => {
  const r = rnd(5);
  const pts: [number, number][] = [[320, 150]];
  for (let i = 1; i <= 140; i++) {
    const [x, y] = pts[i - 1];
    let nx = x + gauss(r) * 9;
    let ny = y + gauss(r) * 9;
    if (nx < 70 || nx > 570) nx = x - (nx - x);
    if (ny < 74 || ny > 226) ny = y - (ny - y);
    pts.push([nx, ny]);
  }
  return pts;
})();
const BR_MOL = makeParts(70, 31);

export function Brownian() {
  return (
    <Anim title="A pollen grain is knocked about unevenly by invisible fast molecules, so it jiggles along a zigzag path" height={290} loop={14}>
      {(t) => {
        const k = t / 0.1;
        const i = Math.min(Math.floor(k), BR_PATH.length - 2);
        const q = k - i;
        const cur: [number, number] = [lerp(BR_PATH[i][0], BR_PATH[i + 1][0], q), lerp(BR_PATH[i][1], BR_PATH[i + 1][1], q)];
        const trail = [...BR_PATH.slice(0, i + 1), cur];
        return (
          <g>
            <rect className="kit-block" x={24} y={40} width={592} height={230} rx={3} style={{ fill: 'none', opacity: 0.5 }} />
            {BR_MOL.map((p, j) => {
              const [u] = fold(p.u, (p.vx * 3) / 592, t, 0, 1);
              const [w] = fold(p.w, (p.vy * 3) / 230, t, 0, 1);
              return <circle key={j} className="fig-dot" cx={24 + u * 592} cy={40 + w * 230} r={2.6} />;
            })}
            <Trail points={trail} tone="soft" />
            <circle className="kit-block is-filled" cx={cur[0]} cy={cur[1]} r={15} style={{ stroke: '#fff' }} />
            <Label x={cur[0] + 28} y={cur[1] - 20} kind="label" anchor="start">pollen grain</Label>
            <Readout>{`t = ${t.toFixed(1)} s`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

const WALKERS = (() => {
  const r = rnd(13);
  return Array.from({ length: 14 }, () => {
    const pts: [number, number][] = [[0, 0]];
    for (let i = 1; i <= 100; i++) pts.push([pts[i - 1][0] + gauss(r) * 4, pts[i - 1][1] + gauss(r) * 4]);
    return pts;
  });
})();

export function BrownianSpread() {
  const cx = 190;
  const cy = 150;
  const gx = 430;
  const gy = 250;
  return (
    <Anim title="Fourteen random walkers start together and spread out; the mean squared distance grows in proportion to time" height={290} loop={11}>
      {(t) => {
        const n = Math.min(100, Math.floor(t * 10));
        const msd = (k: number) => WALKERS.reduce((a, w) => a + w[k][0] ** 2 + w[k][1] ** 2, 0) / WALKERS.length;
        const rr = Math.sqrt(32 * n);
        const line: [number, number][] = [];
        for (let k = 0; k <= n; k++) line.push([gx + (k / 100) * 170, gy - (msd(k) / 3200) * 180]);
        return (
          <g>
            {WALKERS.map((w, i) => (
              <g key={i}>
                <Trail points={w.slice(0, n + 1).map(([x, y]): [number, number] => [cx + x, cy + y])} tone="soft" />
                <circle className="fig-ball" cx={cx + w[n][0]} cy={cy + w[n][1]} r={3.6} />
              </g>
            ))}
            <circle className="fig-guide fig-dash" cx={cx} cy={cy} r={Math.max(rr, 1)} />
            <Tx x={cx} y={282} size={12}>
              start together at the centre
            </Tx>
            <Axes x={gx} y={gy} w={180} h={190} xLabel="t" yLabel="r²" />
            <Line x1={gx} y1={gy} x2={gx + 170} y2={gy - 180 * (3200 / 3200)} tone="faint" dashed />
            <Trail points={line} />
            <Readout>{`t = ${(n / 10).toFixed(1)} s`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ diffusion: two gases mix

const DF = (() => {
  const r = rnd(17);
  return Array.from({ length: 44 }, (_, i) => ({ left: i < 22, u: r(), w: r(), vx: gauss(r) * 70 + (r() < 0.5 ? -35 : 35), vy: gauss(r) * 70 }));
})();

export function Diffusion() {
  const xl = 40;
  const xr = 600;
  const xm = 320;
  const yt = 50;
  const yb = 230;
  const t0 = 1.2;
  return (
    <Anim title="A partition between two gases is removed and the molecules slowly mix until each is spread evenly through the box" height={290} loop={13}>
      {(t) => {
        let rightA = 0;
        const dots = DF.map((p, i) => {
          const lo = p.left ? xl + 5 : xm + 5;
          const hi = p.left ? xm - 5 : xr - 5;
          let x: number;
          if (t < t0) x = fold(lo + p.u * (hi - lo), p.vx, t, lo, hi)[0];
          else {
            const [x1, d1] = fold(lo + p.u * (hi - lo), p.vx, t0, lo, hi);
            x = fold(x1, d1 * Math.abs(p.vx), t - t0, xl + 5, xr - 5)[0];
          }
          const y = fold(yt + 5 + p.w * (yb - yt - 10), p.vy, t, yt + 5, yb - 5)[0];
          if (p.left && x > xm) rightA++;
          return p.left ? <circle key={i} className="fig-ball" cx={x} cy={y} r={4.4} /> : <circle key={i} className="fig-ghost" cx={x} cy={y} r={4} style={{ strokeWidth: 1.6 }} />;
        });
        return (
          <g>
            <rect className="kit-block" x={xl} y={yt} width={xr - xl} height={yb - yt} rx={2} style={{ fill: 'none' }} />
            <g style={{ opacity: 1 - phase(t, t0, t0 + 0.5) }}>
              <Line x1={xm} y1={yt} x2={xm} y2={yb} tone="bright" />
            </g>
            {dots}
            <Tx x={xl} y={yb + 26} anchor="start" size={12}>
              gas A: filled    gas B: hollow
            </Tx>
            <Tx x={xr} y={yb + 26} anchor="end" size={12}>
              {`A found in the right half: ${Math.round((rightA / 22) * 100)} %`}
            </Tx>
            <Readout>{t < t0 ? 'partition in' : 'partition out'}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ real gas: condensing

const LATT: [number, number][] = Array.from({ length: 28 }, (_, i) => {
  const row = Math.floor(i / 7);
  const col = i % 7;
  return [96 + col * 17 + (row % 2) * 8, 226 - row * 15];
});
const RG = makeParts(28, 8);

export function Condense() {
  const xl = 50;
  const xr = 400;
  const top = 40;
  const bot = 240;
  return (
    <Anim title="Cooling a real gas: slower molecules can no longer escape each other's attraction and clump into a liquid" height={290} loop={11}>
      {(t) => {
        const T = lerp(340, 150, ease(phase(t, 2.5, 7)));
        const m = ease(phase(t, 3.5, 7));
        let F = 0;
        for (let u = 0; u < t; u += 0.02) F += Math.sqrt(lerp(340, 150, ease(phase(u, 2.5, 7))) / 300) * 0.02;
        return (
          <g>
            <rect className="kit-block" x={xl} y={top} width={xr - xl} height={bot - top} rx={2} style={{ fill: 'none' }} />
            {RG.map((q, i) => {
              const gx = fold(q.u, (q.vx * F) / (xr - xl), 1, 0, 1)[0] * (xr - xl - 12) + xl + 6;
              const gy = fold(q.w, (q.vy * F) / (bot - top), 1, 0, 1)[0] * (bot - top - 12) + top + 6;
              const [lx, ly] = LATT[i];
              const wob = (1 - 0.5 * m) * Math.sin(t * 9 + i) * 1.5 * m;
              return <circle key={i} className="fig-ball" cx={lerp(gx, lx, m) + wob} cy={lerp(gy, ly, m) + wob} r={4.6} />;
            })}
            <Tx x={430} y={80} anchor="start">{`T = ${T.toFixed(0)} K`}</Tx>
            <Tx x={430} y={110} anchor="start" size={12}>
              {m < 0.5 ? 'gas: molecules far apart,' : 'liquid: attraction keeps'}
            </Tx>
            <Tx x={430} y={128} anchor="start" size={12}>
              {m < 0.5 ? 'almost no attraction' : 'them together'}
            </Tx>
            <Tx x={430} y={170} anchor="start" size={12} dim>
              an ideal gas would never do this
            </Tx>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ small ones for examples and mistakes

/** A molecule against a ruler, slowed 1000 times: 517 m/s is 0.517 m in a millisecond. */
export function Track() {
  const x0 = 60;
  const sc = 880 / 1;
  return (
    <Anim title="A nitrogen molecule at its rms speed covers about half a metre in a thousandth of a second, faster than sound in air" height={190} loop={6}>
      {(t) => {
        const ms = clamp(t / 3.5, 0, 1);
        return (
          <g>
            <Line x1={x0} y1={150} x2={x0 + 0.6 * sc} y2={150} tone="soft" />
            {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((m) => (
              <g key={m}>
                <Line x1={x0 + m * sc} y1={144} x2={x0 + m * sc} y2={156} tone="soft" />
                <Tx x={x0 + m * sc} y={172} size={11}>
                  {m.toFixed(1)}
                </Tx>
              </g>
            ))}
            <Tx x={x0 + 0.6 * sc - 28} y={172} anchor="start" size={11}>
              m
            </Tx>
            <Ball x={x0 + 0.517 * ms * sc} y={70} r={7} />
            <Ball x={x0 + 0.347 * ms * sc} y={112} r={7} ghost />
            <Tx x={x0 + 0.517 * ms * sc + 14} y={56} anchor="start" size={12}>
              N₂ molecule 517 m/s
            </Tx>
            <Tx x={x0 + 0.347 * ms * sc + 14} y={98} anchor="start" size={12}>
              sound in air 347 m/s
            </Tx>
            <Readout>{`t = ${ms.toFixed(2)} ms (slowed 1000×)`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Temperature is raised by a factor `ratio`; the rms speed grows only by its square root. */
export function SpeedScale({ ratio, ghost }: { ratio: number; ghost?: boolean }) {
  const base = 517;
  const px = 200;
  return (
    <Anim title={`The temperature is multiplied by ${ratio} and the rms speed arrow grows only by the square root of that`} height={ghost ? 200 : 220} loop={7}>
      {(t) => {
        const g = ease(phase(t, 1, 4));
        const Tn = 300 * (1 + (ratio - 1) * g);
        const v = base * Math.sqrt(Tn / 300);
        const y1 = 70;
        const y2 = 140;
        return (
          <g>
            <Tx x={30} y={y1 - 22} anchor="start" size={12}>
              300 K
            </Tx>
            <Arrow x1={30} y1={y1} x2={30 + px} y2={y1} tone="soft" />
            <Tx x={30} y={y2 - 22} anchor="start" size={12}>
              {`${Tn.toFixed(0)} K`}
            </Tx>
            <Arrow x1={30} y1={y2} x2={30 + (px * v) / base} y2={y2} />
            {ghost && (
              <g style={{ opacity: phase(t, 4.2, 5) }}>
                <Line x1={30 + px * ratio} y1={y2 - 14} x2={30 + px * ratio} y2={y2 + 14} tone="soft" dashed />
                <Tx x={30 + px * ratio} y={y2 + 32} size={12}>
                  this is not what happens
                </Tx>
              </g>
            )}
            <Tx x={600} y={y2 - 22} anchor="end" size={13}>{`v rms = ${v.toFixed(0)} m/s  (×${(v / base).toFixed(2)})`}</Tx>
            <Readout>{`T × ${(Tn / 300).toFixed(1)}`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Heat needed for 1 mol: Cv against Cp. */
export function HeatBars() {
  return (
    <Anim title="At constant pressure the heat needed is larger than at constant volume, by R per kelvin" height={190} loop={6}>
      {(t) => {
        const g = ease(phase(t, 0.8, 4));
        const U = 80;
        return (
          <g>
            <Tx x={30} y={58} anchor="start" size={12}>
              Cv
            </Tx>
            <rect className="kit-block is-filled" x={80} y={42} width={2.5 * U * g} height={22} rx={2} />
            <Tx x={30} y={122} anchor="start" size={12}>
              Cp
            </Tx>
            <rect className="kit-block is-filled" x={80} y={106} width={2.5 * U * g} height={22} rx={2} />
            <rect className="kit-block" x={80 + 2.5 * U * g} y={106} width={U * g} height={22} rx={2} />
            <Tx x={80 + 2.5 * U * g + (U * g) / 2} y={150} size={12} dim={g < 0.9}>
              extra R: work on the piston
            </Tx>
            <Readout>{`Cp − Cv = R`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** A mole is a huge pile of molecules: R is k times that pile. */
export function Mole() {
  const pile: [number, number][] = Array.from({ length: 70 }, (_, i) => {
    const a = i * 2.39996;
    const rr = 5.2 * Math.sqrt(i);
    return [Math.cos(a) * rr, Math.sin(a) * rr];
  });
  return (
    <Anim title="One molecule has the constant k; a whole mole of them, N A molecules, has R = N A times k" height={190} loop={7}>
      {(t) => {
        const g = ease(phase(t, 1.2, 4));
        const n = Math.max(1, Math.round(70 * g));
        return (
          <g>
            <g>
              {pile.slice(0, n).map(([x, y], i) => (
                <circle key={i} className="fig-ball" cx={140 + x * (0.4 + 0.6 * g)} cy={96 + y * (0.4 + 0.6 * g)} r={3.4} />
              ))}
            </g>
            <Tx x={140} y={178} size={12}>
              {g < 0.1 ? 'one molecule: k = 1.38 × 10⁻²³ J/K' : 'one mole: NA = 6.02 × 10²³ of them'}
            </Tx>
            <Tx x={400} y={80} anchor="start" size={14}>
              p V = N k T
            </Tx>
            <Tx x={400} y={110} anchor="start" size={14}>
              p V = n R T
            </Tx>
            <Tx x={400} y={140} anchor="start" size={14} dim={g < 0.95}>
              R = NA · k
            </Tx>
          </g>
        );
      }}
    </Anim>
  );
}

/** Z = pV/nRT against pressure: real gases drift away from 1. */
export function ZCurve() {
  const gx = 90;
  const gy = 150;
  const pts: [number, number][] = [];
  const Z = (p: number) => 1 - 0.0009 * p + 0.9e-5 * p * p;
  for (let p = 0; p <= 300; p += 5) pts.push([gx + (p / 300) * 460, gy - ((Z(p) - 0.9) / 0.7) * 120]);
  return (
    <Anim title="The ratio p V over n R T stays at 1 for an ideal gas but a real gas drifts away from 1 at high pressure" height={190} loop={7}>
      {(t) => {
        const q = ease(phase(t, 0.5, 5));
        const k = Math.floor(q * (pts.length - 1));
        return (
          <g>
            <Axes x={gx} y={gy} w={480} h={130} xLabel="p" yLabel="Z" />
            <Line x1={gx} y1={gy - ((1 - 0.9) / 0.7) * 120} x2={gx + 470} y2={gy - ((1 - 0.9) / 0.7) * 120} tone="soft" dashed />
            <Tx x={gx - 8} y={gy - ((1 - 0.9) / 0.7) * 120 + 4} anchor="end" size={12}>
              1
            </Tx>
            <Trail points={pts.slice(0, k + 1)} />
            <Ball x={pts[k][0]} y={pts[k][1]} r={5} />
            <Tx x={gx + 470} y={gy - ((1 - 0.9) / 0.7) * 120 - 8} anchor="end" size={12}>
              ideal gas
            </Tx>
          </g>
        );
      }}
    </Anim>
  );
}

/** A curve of the speed distribution with a dot sweeping along it: molecules differ. */
export function SweepCurve() {
  const x0 = 40;
  const base = 150;
  const sc = 0.29;
  const K = 100 / FPEAK;
  const pts: [number, number][] = [];
  for (let v = 0; v <= 2000; v += 25) pts.push([x0 + v * sc, base - maxwell(v, SIG) * K]);
  const vr = Math.sqrt(3) * SIG;
  return (
    <Anim title="Molecules in a gas have many different speeds: the rms speed is only one point on the curve, and most molecules are slower or faster" height={190} loop={8}>
      {(t) => {
        const v = 900 - 900 * Math.cos((2 * Math.PI * t) / 8);
        return (
          <g>
            <Axes x={x0} y={base} w={590} h={120} xLabel="v" />
            <Trail points={pts} tone="soft" />
            <Line x1={x0 + vr * sc} y1={base} x2={x0 + vr * sc} y2={40} tone="soft" dashed />
            <Tx x={x0 + vr * sc + 6} y={40} anchor="start" size={12}>
              v rms
            </Tx>
            <Ball x={x0 + v * sc} y={base - maxwell(v, SIG) * K} r={5.5} />
            <Tx x={x0 + 560} y={80} anchor="end" size={13}>{`this molecule: ${v.toFixed(0)} m/s`}</Tx>
          </g>
        );
      }}
    </Anim>
  );
}

export { ease, lerp, phase };
