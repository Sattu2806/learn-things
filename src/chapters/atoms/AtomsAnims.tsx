import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Label, Line, Trail, clamp, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for atoms: Rutherford scattering, the Bohr model and the hydrogen spectrum. */

const TAU = 2 * Math.PI;
const DEG = Math.PI / 180;
type Pt = [number, number];

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

const frac = (x: number) => x - Math.floor(x);
/** Real subscripts and superscripts inside SVG text. */
const Sup = ({ children }: { children: ReactNode }) => (
  <tspan baselineShift="super" fontSize="72%">
    {children}
  </tspan>
);

const fmt = (x: number): ReactNode => {
  const e = Math.floor(Math.log10(x));
  return (
    <>
      {(x / 10 ** e).toFixed(1)} × 10<Sup>{String(e).replace('-', '−')}</Sup>
    </>
  );
};

/** Text with a background-coloured outline so lines and curves behind it do not cut through the letters. */
const HALO = { paintOrder: 'stroke', stroke: '#000', strokeWidth: 7, strokeLinejoin: 'round' } as const;

/** A short wave packet centred at (cx, cy), n cycles of wavelength lam, running along angle a. */
function packet(cx: number, cy: number, a: number, lam: number, amp: number, len: number, shift = 0): Pt[] {
  const ux = Math.cos(a), uy = Math.sin(a);
  return curve(60, len, (s) => {
    const x = s - len / 2;
    const env = Math.exp(-((x / (len * 0.3)) ** 2));
    const y = amp * env * Math.sin((TAU * x) / lam + shift);
    return [cx + ux * x - uy * y, cy + uy * x + ux * y];
  });
}

// ------------------------------------------------------------------ Coulomb orbits in units of r0

/**
 * Path of a repelled alpha particle in units of r0, the closest approach in a head-on hit.
 * It starts far to the left with impact parameter b and speed set so a head-on hit stops at r = 1.
 */
const orbits = new Map<number, Pt[]>();
function orbit(b: number): Pt[] {
  const key = Math.round(b * 1000);
  const hit = orbits.get(key);
  if (hit) return hit;
  const R0 = 9;
  const pts: Pt[] = [];
  let vx = Math.sqrt(1 - 1 / R0), vy = 0;
  let x = -R0, y = b / vx;
  const dt = 0.02;
  const acc = (px: number, py: number): Pt => {
    const r = Math.hypot(px, py);
    return [(0.5 * px) / (r * r * r), (0.5 * py) / (r * r * r)];
  };
  let [ax, ay] = acc(x, y);
  for (let i = 0; i < 1400; i++) {
    pts.push([x, y]);
    x += vx * dt + 0.5 * ax * dt * dt;
    y += vy * dt + 0.5 * ay * dt * dt;
    const [nx, ny] = acc(x, y);
    vx += 0.5 * (ax + nx) * dt;
    vy += 0.5 * (ay + ny) * dt;
    ax = nx;
    ay = ny;
    if (Math.hypot(x, y) > R0 && i > 40 && x * vx + y * vy > 0) break;
  }
  orbits.set(key, pts);
  return pts;
}

// ------------------------------------------------------------------ Thomson's model

export function PuddingScatter() {
  return (
    <Anim title="In Thomson's plum pudding model the positive charge is spread through the whole atom with electrons stuck in it, so a fast alpha particle goes almost straight through, deflected only a little" height={230} loop={7}>
      {(t) => {
        const cx = 320, cy = 115, R = 90;
        const els: Pt[] = [
          [-40, -30], [30, -45], [55, 10], [-10, 5], [-55, 28], [10, 48], [40, 38], [-25, -55],
        ];
        return (
          <g>
            <circle className="fig-guide" cx={cx} cy={cy} r={R} fill="#fff" fillOpacity={0.1} />
            {els.map(([dx, dy], i) => (
              <Ball key={i} x={cx + dx + 3 * Math.sin(TAU * (0.8 * t + i * 0.5))} y={cy + dy + 3 * Math.cos(TAU * (0.7 * t + i * 0.3))} r={4} glow={false} />
            ))}
            {[-40, 0, 40].map((yy, k) => {
              const u = frac(t / 5 + k * 0.17);
              const x = 20 + 600 * u;
              const bend = 0.08 * (yy / 40) * ease(clamp((x - cx + R) / (2 * R)));
              const y = cy + yy + bend * Math.max(0, x - (cx - R)) * 0.5;
              return (
                <g key={k}>
                  <Line x1={20} y1={cy + yy} x2={Math.min(x, cx - R)} y2={cy + yy} tone="soft" dashed />
                  <Ball x={x} y={y} r={5.5} />
                </g>
              );
            })}
            <Label x={cx} y={cy + R + 22} kind="label">positive charge spread out everywhere</Label>
            <Label x={W - 14} y={22} kind="label" anchor="end">tiny push at every point: only small bends</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ Geiger and Marsden

const GM_ANGLES = [0.4, -1, 2, -0.8, 1.5, 0.3, -2.5, 0.9, 8, -0.4, 0.2, 150, -3, 0.6, 14, -0.2];

export function GeigerMarsden() {
  return (
    <Anim title="Alpha particles from a source hit a thin gold foil; nearly all go straight through, a few are bent through large angles, and about one in eight thousand bounces back" height={270} loop={7.2}>
      {(t) => {
        const fx = 250, cy = 135, Rd = 120;
        const T = 3.6;
        return (
          <g>
            <rect className="fig-guide" x={26} y={cy - 16} width={34} height={32} fill="#fff" fillOpacity={0.12} />
            <Label x={43} y={cy + 34} kind="label">source</Label>
            <Line x1={60} y1={cy} x2={fx - 6} y2={cy} tone="soft" dashed />
            <Line x1={fx} y1={cy - 90} x2={fx} y2={cy + 90} tone="bright" />
            {Array.from({ length: 13 }, (_, k) => (
              <Ball key={k} x={fx + 3 * Math.sin(TAU * (0.6 * t + k * 0.5))} y={cy - 84 + k * 14} r={2.6} glow={false} />
            ))}
            <Label x={fx} y={cy - 98} kind="label">gold foil</Label>
            <path className="fig-guide fig-dash" d={`M${fx + Rd * Math.cos(-2.9)} ${cy + Rd * Math.sin(-2.9)}A${Rd} ${Rd} 0 1 1 ${fx + Rd * Math.cos(2.9)} ${cy + Rd * Math.sin(2.9)}`} fill="none" />
            <Label x={fx + Rd + 12} y={cy + 4} kind="label" anchor="start">detector screen</Label>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
              const q = (t + k * 0.45) / T;
              const c = Math.floor(q);
              const u = frac(q);
              const ang = GM_ANGLES[(c * 5 + k * 3) % GM_ANGLES.length] * DEG;
              const y0 = cy + (k - 3.5) * 9;
              const tin = 0.4;
              const big = Math.abs(ang) > 60 * DEG;
              if (u < tin) return <Ball key={k} x={lerp(64, fx, u / tin)} y={y0} r={3.8} glow={false} />;
              const w = (u - tin) / (1 - tin);
              const ex = fx + Rd * Math.cos(ang), ey = y0 + Rd * Math.sin(ang);
              const px = lerp(fx, ex, clamp(w * 1.4));
              const py = lerp(y0, ey, clamp(w * 1.4));
              return (
                <g key={k}>
                  {big && <Trail points={[[fx, y0], [px, py]]} tone="soft" dashed />}
                  <Ball x={px} y={py} r={big ? 5.2 : 3.8} glow={big} />
                  {w > 0.7 && <circle className="fig-guide" cx={ex} cy={ey} r={3 + 14 * (w - 0.7)} fill="none" style={{ opacity: 1 - (w - 0.7) / 0.3 }} />}
                </g>
              );
            })}
            <Label x={W - 14} y={24} kind="label" anchor="end">almost all go straight on</Label>
            <Label x={W - 14} y={42} kind="label" anchor="end">a few bend a lot</Label>
            <Label x={W - 14} y={60} kind="label" anchor="end">one in 8000 turns right back</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Distribution() {
  return (
    <Anim title="The number of alpha particles counted at each scattering angle on a logarithmic scale follows one over sine to the fourth of half the angle: very many at small angles, very few at large ones, as the nuclear model predicts" height={250} loop={9}>
      {(t) => {
        const ox = 70, oy = 210, gw = 500, gh = 160;
        const angles = [10, 20, 30, 45, 60, 75, 90, 105, 120, 135, 150];
        const logN = (a: number) => Math.log10(1 / Math.sin((a * DEG) / 2) ** 4);
        const top = logN(10);
        const xa = (a: number) => ox + (a / 160) * gw;
        return (
          <g>
            <Axes x={ox} y={oy} w={gw + 14} h={gh + 24} xLabel="θ" yLabel="log N" />
            <Trail points={curve(100, 1, (u) => [xa(8 + u * 150), oy - (logN(8 + u * 150) / top) * gh] as Pt)} tone="soft" dashed />
            {angles.map((a, i) => {
              const g = ease(phase(t, 0.4 + i * 0.32, 0.9 + i * 0.32));
              const h = (Math.max(logN(a), 0.04) / top) * gh * g;
              return (
                <g key={a}>
                  <rect className="fig-bar" x={xa(a) - 12} y={oy - h} width={24} height={h} fill="#fff" opacity={0.85} />
                  <Label x={xa(a)} y={oy + 16} kind="val">{`${a}°`}</Label>
                </g>
              );
            })}
            <Label x={W - 14} y={24} kind="val" anchor="end">N ∝ 1 / sin⁴(θ / 2)</Label>
            <Label x={W - 14} y={44} kind="label" anchor="end">dashed: Rutherford's prediction</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ paths of alpha particles

export function RutherfordPaths() {
  return (
    <Anim title="Alpha particles fly toward a tiny charged nucleus at different distances from the centre line; the closer the aim, the more they are repelled, and a head-on one stops and turns straight back" height={270} loop={10}>
      {(t) => {
        const k = 34;
        const cx = 330, cy = 190;
        const bs = [0, 0.25, 0.5, 1, 2, 3.2];
        const p = ease(phase(t, 0.3, 7.5));
        return (
          <g>
            {bs.map((b) => {
              const path = orbit(b);
              const n = Math.max(2, Math.floor(p * (path.length - 1)));
              const pts = path.slice(0, n + 1).map(([x, y]) => [cx + x * k, cy - y * k] as Pt);
              const last = pts[pts.length - 1];
              const th = (2 * Math.atan(1 / (2 * Math.max(b, 1e-6)))) / DEG;
              const endP = path[path.length - 1];
              return (
                <g key={b}>
                  <Trail points={pts} tone={b === 0 ? 'bright' : 'soft'} />
                  <Ball x={last[0]} y={last[1]} r={4.5} glow={false} />
                  {p > 0.95 && <Label x={cx + endP[0] * k * 0.55 + 20} y={cy - endP[1] * k * 0.55 - 6} kind="val" anchor="start">{b === 0 ? '180°' : `${th.toFixed(0)}°`}</Label>}
                </g>
              );
            })}
            <circle className="fig-guide fig-dash" cx={cx} cy={cy} r={k} fill="none" />
            <Ball x={cx} y={cy} r={7 + Math.sin(TAU * t / 2)} />
            <Label x={cx} y={cy + 24} kind="label">nucleus</Label>
            <Label x={W - 14} y={22} kind="label" anchor="end">dashed ring: closest approach r₀ of a head-on hit</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function ClosestApproach() {
  return (
    <Anim title="A head-on alpha particle slows as it climbs the electric potential of the nucleus, its kinetic energy turning into potential energy, until it stops at the distance of closest approach and is pushed straight back" height={250} loop={10}>
      {(t) => {
        const path = orbit(0);
        const p = phase(t, 0.4, 8.6);
        const idx = Math.min(path.length - 1, Math.floor(p * (path.length - 1)));
        const x = path[idx][0];
        const r = Math.max(1, Math.abs(x));
        const k = 34, cx = 300, cy = 85;
        const PE = 0.5 / r;
        const KE = 0.5 - PE;
        const by = 232, hb = 190, bar = 470;
        return (
          <g>
            <Line x1={20} y1={cy} x2={W - 20} y2={cy} tone="soft" dashed />
            <Ball x={cx} y={cy} r={7} />
            <Label x={cx} y={cy + 26} kind="label">nucleus</Label>
            <Line x1={cx - k} y1={cy - 24} x2={cx - k} y2={cy + 24} tone="bright" />
            <Label x={cx - k} y={cy - 32} kind="sym">r₀</Label>
            <Ball x={cx + x * k} y={cy} r={6} />
            <Line x1={bar - 20} y1={by} x2={bar + 150} y2={by} tone="soft" />
            <rect className="fig-bar" x={bar} y={by - PE * hb * 2} width={44} height={PE * hb * 2} fill="#fff" opacity={0.4} />
            <rect className="fig-bar" x={bar} y={by - (PE + KE) * hb * 2} width={44} height={KE * hb * 2} fill="#fff" opacity={0.9} />
            <Line x1={bar - 10} y1={by - hb} x2={bar + 110} y2={by - hb} tone="soft" dashed />
            <Label x={bar + 54} y={by - hb - 6} kind="label" anchor="start">total K</Label>
            <Label x={bar + 54} y={by - PE * hb} kind="sym" anchor="start">PE</Label>
            {KE > 0.06 && <Label x={bar + 54} y={by - PE * hb * 2 - KE * hb} kind="sym" anchor="start">KE</Label>}
            <Label x={30} y={196} kind="val" anchor="start">{`r = ${r.toFixed(2)} r₀`}</Label>
            <Label x={30} y={218} kind="val" anchor="start">{`KE = ${(KE / 0.5).toFixed(2)} of K`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function ImpactSweep() {
  return (
    <Anim title="One alpha particle is aimed with a smaller and smaller impact parameter; the readout shows the aim b and the angle through which it is scattered, which grows from almost nothing toward a full turn" height={260} loop={12}>
      {(t) => {
        const b = lerp(3.2, 0.1, ease(phase(t, 0.4, 10)));
        const path = orbit(b);
        const k = 34, cx = 340, cy = 175;
        const pts = path.map(([x, y]) => [cx + x * k, cy - y * k] as Pt);
        const th = (2 * Math.atan(1 / (2 * b))) / DEG;
        const bl = cy - b * k;
        const at = path[Math.min(path.length - 1, Math.floor((t * 90) % path.length))];
        return (
          <g>
            <Line x1={20} y1={cy} x2={W - 20} y2={cy} tone="soft" dashed />
            <Trail points={pts} />
            <Ball x={cx + at[0] * k} y={cy - at[1] * k} r={5} glow={false} />
            <Ball x={cx} y={cy} r={7} />
            <Arrow x1={50} y1={cy} x2={50} y2={bl} tone="soft" />
            <Label x={64} y={(cy + bl) / 2 + 4} kind="sym" anchor="start">b</Label>
            <Line x1={50} y1={bl} x2={130} y2={bl} tone="soft" dashed />
            <Label x={W - 14} y={24} kind="val" anchor="end">{`b = ${b.toFixed(2)} r₀`}</Label>
            <Label x={W - 14} y={46} kind="val" anchor="end">{`θ = ${th.toFixed(0)}°`}</Label>
            <Label x={W - 14} y={68} kind="label" anchor="end">b = (r₀ / 2) cot(θ / 2)</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the size of the nucleus

export function NucleusScale() {
  return (
    <Anim title="A zoom in on an atom: the electrons sit at a radius of about a tenth of a nanometre, and as the view narrows a hundred thousand times, the nucleus finally appears as a tiny dot in what is mostly empty space" height={240} loop={12}>
      {(t) => {
        const u = ease(phase(t, 1, 10));
        const logW = lerp(-9.4, -13.4, u);
        const Wv = 10 ** logW;
        const k = 600 / Wv;
        const cx = 320, cy = 120;
        const rA = 1e-10 * k;
        const rN = Math.max(1.6, 5e-15 * k);
        return (
          <g>
            {rA < 700 && <circle className="fig-guide fig-dash" cx={cx} cy={cy} r={rA} fill="none" />}
            {rA < 160 && [0, 1].map((i) => (
              <Ball key={i} x={cx + rA * Math.cos(TAU * (0.2 * t + i * 0.5))} y={cy + rA * Math.sin(TAU * (0.2 * t + i * 0.5))} r={4} glow={false} />
            ))}
            <Ball x={cx} y={cy} r={rN} glow={rN > 5} />
            <Label x={cx} y={cy + Math.min(rN + 22, 80)} kind="label">{rN > 8 ? 'nucleus' : ''}</Label>
            {rA < 160 && <Label x={cx} y={cy - rA - 10} kind="label">atom</Label>}
            <text className="fig-val" x={W - 14} y={24} textAnchor="end" style={HALO}>
              view width {fmt(Wv)} m
            </text>
            <Line x1={cx - 150} y1={226} x2={cx + 150} y2={226} tone="soft" />
            <text className="fig-label" x={cx} y={216} textAnchor="middle" style={HALO}>
              bar: {fmt(Wv * 0.5)} m
            </text>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the classical electron falls in

export function Spiral() {
  return (
    <Anim title="On the left, a classical electron circling a nucleus radiates energy and spirals inward in a fraction of a second; on the right, an electron in a Bohr orbit keeps going round without radiating" height={250} loop={8}>
      {(t) => {
        const cy = 125;
        const p = phase(t, 0.5, 5.5);
        const r = lerp(95, 5, p * p);
        const th = TAU * (0.5 * t + 6 * p * p);
        const x1 = 160, x2 = 480;
        const trail = curve(100, 1, (s) => {
          const pp = s * p;
          const rr = lerp(95, 5, pp * pp);
          const aa = TAU * (0.5 * (0.5 + pp * 5) + 6 * pp * pp);
          return [x1 + rr * Math.cos(aa), cy + rr * Math.sin(aa)] as Pt;
        });
        return (
          <g>
            <Ball x={x1} y={cy} r={6} />
            <Trail points={trail} tone="soft" />
            <Ball x={x1 + r * Math.cos(th)} y={cy + r * Math.sin(th)} r={4.5} glow={false} />
            {p > 0.05 && p < 1 && [0, 1, 2].map((i) => {
              const q = frac(t * 1.2 + i / 3);
              return <circle key={i} className="fig-guide" cx={x1} cy={cy} r={r + 10 + 40 * q} fill="none" style={{ opacity: (1 - q) * 0.5 }} />;
            })}
            <Label x={x1} y={228} kind="label">classical: radiates, collapses</Label>
            {p >= 1 && <circle className="fig-glow" cx={x1} cy={cy} r={20 * (1 + Math.sin(TAU * t * 2) * 0.2)} fill="#fff" opacity={0.2} />}
            <Ball x={x2} y={cy} r={6} />
            <circle className="fig-guide" cx={x2} cy={cy} r={60} fill="none" />
            <Ball x={x2 + 60 * Math.cos(TAU * 0.5 * t)} y={cy + 60 * Math.sin(TAU * 0.5 * t)} r={4.5} glow={false} />
            <Label x={x2} y={228} kind="label">Bohr: stable orbit, no radiation</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ spectra

const BALMER = [410.2, 434.1, 486.1, 656.3];

export function SpectraTypes() {
  return (
    <Anim title="Three spectra: a hot solid gives a continuous band, a hot gas gives bright lines at certain colours only, and the same gas in front of a hot source takes those same colours out, leaving dark lines" height={280} loop={9}>
      {(t) => {
        const x0 = 90, x1 = 600;
        const xl = (l: number) => x0 + ((l - 380) / (720 - 380)) * (x1 - x0);
        const rows: [number, string, number][] = [
          [34, 'hot solid: continuous', 0],
          [112, 'hot gas: emission lines', 1],
          [190, 'cool gas: absorption lines', 2],
        ];
        const cur = lerp(390, 710, phase(t, 0.5, 8.5));
        const near = BALMER.find((l) => Math.abs(cur - l) < 8);
        return (
          <g>
            {rows.map(([y, name, kind]) => (
              <g key={name}>
                <rect className="fig-guide" x={x0} y={y} width={x1 - x0} height={44} fill="none" />
                {kind === 0 && Array.from({ length: 85 }, (_, i) => <rect key={i} x={x0 + i * 6} y={y + 1} width={6} height={42} fill="#fff" opacity={0.3 + 0.25 * Math.sin(i / 14 + 1)} />)}
                {kind === 2 && <rect x={x0 + 1} y={y + 1} width={x1 - x0 - 2} height={42} fill="#fff" opacity={0.55} />}
                {BALMER.map((l, i) => (
                  <rect key={l} x={xl(l) - 2} y={y + 1} width={4} height={42} fill={kind === 1 ? '#fff' : '#000'} opacity={kind === 1 ? 0.75 + 0.25 * Math.sin(TAU * (t * 0.8 + i * 0.3)) : 1} />
                ))}
              </g>
            ))}
            <Line x1={xl(cur)} y1={22} x2={xl(cur)} y2={254} tone="bright" />
            {rows.map(([y, name]) => (
              <text key={name} className="fig-label" x={x0} y={y + 64} textAnchor="start" style={HALO}>
                {name}
              </text>
            ))}
            <Label x={xl(cur)} y={274} kind="val">{`${near ? near.toFixed(1) : cur.toFixed(0)} nm`}</Label>
            <Label x={W - 14} y={14} kind="label" anchor="end">wavelength, 380 to 720 nm</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ energy levels

const En = (n: number) => (n === Infinity ? 0 : -13.6 / (n * n));

export function Levels({ trans, nmax = 6, mode = 'emit', title, slot = 2.8 }: { trans: [number, number][]; nmax?: number; mode?: 'emit' | 'absorb'; title: string; slot?: number }) {
  const L = trans.length;
  return (
    <Anim title={title} height={270} loop={slot * L}>
      {(t) => {
        const yE = (E: number) => 36 + (-E / 13.6) * 196;
        const idx = Math.floor(t / slot) % L;
        const tau = t % slot;
        const ns = Array.from({ length: nmax }, (_, i) => i + 1);
        const [a, b] = trans[idx];
        const hi = mode === 'emit' ? a : b;
        const lo = mode === 'emit' ? b : a;
        // label rows: spread the crowded upper rungs at least 15 px apart
        const shown = ns.filter((n) => n <= 3 || n === hi || n === lo);
        const ly: Record<number, number> = {};
        let lastY = yE(0) + 4;
        [...shown].reverse().forEach((n) => {
          lastY = Math.max(yE(En(n)) + 4, lastY + 15);
          ly[n] = lastY;
        });
        const dE = En(hi) - En(lo);
        const lam = 1240 / dE;
        const xs = (i: number) => 80 + (L > 1 ? (i * 130) / (L - 1) : 65);
        const ex = xs(idx);
        const jump = ease(phase(tau, mode === 'emit' ? 0.5 : 1.2, mode === 'emit' ? 1.2 : 1.9));
        const from = mode === 'emit' ? hi : lo;
        const to = mode === 'emit' ? lo : hi;
        const by = lerp(yE(En(from)), yE(En(to)), jump);
        const lamPx = clamp(lam / 22, 5, 36);
        const ph0 = mode === 'emit' ? phase(tau, 1.2, 2.6) : phase(tau, 0, 1.2);
        const pxx = mode === 'emit' ? lerp(ex, 560, ph0) : lerp(600, ex + 10, ph0);
        const showP = mode === 'emit' ? tau > 1.2 && ph0 < 1 : tau < 1.2;
        const pyy = (yE(En(hi)) + yE(En(lo))) / 2;
        return (
          <g>
            {ns.map((n) => (
              <g key={n}>
                <Line x1={50} y1={yE(En(n))} x2={250} y2={yE(En(n))} tone="bright" />
                {ly[n] !== undefined && <Label x={42} y={ly[n]} kind="val" anchor="end">{`n = ${n}`}</Label>}
                {ly[n] !== undefined && <Label x={258} y={ly[n]} kind="val" anchor="start">{En(n).toFixed(2).replace('-', '−')}</Label>}
              </g>
            ))}
            <Line x1={50} y1={yE(0)} x2={250} y2={yE(0)} tone="soft" dashed />
            <Label x={42} y={yE(0) + 4} kind="val" anchor="end">n = ∞</Label>
            <Label x={258} y={yE(0) + 4} kind="val" anchor="start">0 eV</Label>
            {trans.map(([p, q], i) => {
              const h = Math.max(p, q), l = Math.min(p, q);
              return <Arrow key={i} x1={xs(i)} y1={yE(En(mode === 'emit' ? h : l))} x2={xs(i)} y2={yE(En(mode === 'emit' ? l : h))} tone={i === idx ? 'bright' : 'soft'} dashed={i !== idx} />;
            })}
            <Ball x={ex} y={by} r={5.5} />
            {showP && <Trail points={packet(pxx, pyy, 0, lamPx, 9, lamPx * 4, -TAU * t * 2)} />}
            <Label x={340} y={72} kind="val" anchor="start">{`n = ${hi === Infinity ? '∞' : hi} ${mode === 'emit' ? '→' : '←'} ${lo}`}</Label>
            <Label x={340} y={94} kind="val" anchor="start">{`ΔE = ${dE.toFixed(2)} eV`}</Label>
            <Label x={340} y={116} kind="val" anchor="start">{`λ = 1240 / ΔE = ${lam.toFixed(1)} nm`}</Label>
            <Label x={W - 14} y={262} kind="label" anchor="end">{mode === 'emit' ? 'jump down: a photon leaves' : 'photon of exactly ΔE: jump up'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the series

export function SeriesSpectrum() {
  return (
    <Anim title="Lines of the Lyman, Balmer and Paschen series drawn on a scale of one over the wavelength; each series crowds up toward its own limit, and the three occupy different regions: ultraviolet, visible and infrared" height={290} loop={12}>
      {(t) => {
        const x0 = 40, x1 = 570;
        const xv = (w: number) => x0 + w * (x1 - x0);
        const series: [string, number, number, string][] = [
          ['Lyman (to n = 1): ultraviolet', 1, 230, 'UV'],
          ['Balmer (to n = 2): visible', 2, 148, 'visible'],
          ['Paschen (to n = 3): infrared', 3, 66, 'IR'],
        ];
        return (
          <g>
            <Axes x={x0} y={268} w={x1 - x0 + 30} h={0} />
            <Label x={W - 6} y={288} kind="sym" anchor="end">1/λ</Label>
            {series.map(([name, nf, y], si) => {
              const lim = 1 / (nf * nf);
              const lines: ReactNode[] = [];
              for (let ni = nf + 1; ni <= 14; ni++) {
                const w = 1 / (nf * nf) - 1 / (ni * ni);
                const on = ease(phase(t, 0.5 + si * 2.2 + (ni - nf) * 0.2, 1 + si * 2.2 + (ni - nf) * 0.2));
                lines.push(<rect key={ni} className="fig-bar" x={xv(w) - 1.2} y={y - 26 * on} width={2.4} height={52 * on} fill="#fff" opacity={0.5 + 0.5 * Math.sin(TAU * (t * 0.6 + ni * 0.1)) ** 2} />);
              }
              const limOn = 0.6 + 0.4 * Math.sin(TAU * (t * 0.4 + si * 0.3)) ** 2;
              return (
                <g key={name}>
                  <Line x1={x0} y1={y} x2={x1} y2={y} tone="soft" dashed />
                  {lines}
                  <Line x1={xv(lim)} y1={y - 30} x2={xv(lim)} y2={y + 30} tone="bright" dashed />
                  <Label x={x0} y={y - 36} kind="label" anchor="start">{name}</Label>
                  <g opacity={limOn}>
                    {nf === 1 ? (
                      <Label x={xv(lim) - 8} y={y - 36} kind="val" anchor="end">series limit</Label>
                    ) : (
                      <Label x={xv(lim) + 8} y={y - 6} kind="val" anchor="start">series limit</Label>
                    )}
                  </g>
                </g>
              );
            })}
            {[0, 0.25, 0.5, 0.75, 1].map((w) => (
              <Label key={w} x={xv(w)} y={288} kind="val">{`${w} R`}</Label>
            ))}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ Bohr model

export function BohrOrbits() {
  return (
    <Anim title="Electrons in the first three Bohr orbits of hydrogen: the radii grow as n squared, while the electron in a larger orbit moves more slowly and takes much longer to go round" height={250} loop={12}>
      {(t) => {
        const cx = 250, cy = 125, a0 = 12;
        const ns = [1, 2, 3];
        return (
          <g>
            {ns.map((n) => {
              const r = a0 * n * n;
              const w = (TAU * 1.0) / (n * n * n);
              const c = Math.SQRT1_2;
              return (
                <g key={n}>
                  <circle className="fig-guide" cx={cx} cy={cy} r={r} fill="none" />
                  <Ball x={cx + r * Math.cos(w * t * 1.6)} y={cy - r * Math.sin(w * t * 1.6)} r={4.5} glow={false} />
                  <Label x={cx + r * c + 6} y={cy - r * c - 4} kind="val" anchor="start">{`n = ${n}`}</Label>
                </g>
              );
            })}
            <Ball x={cx} y={cy} r={4 + 0.8 * Math.sin(TAU * t)} />
            <Label x={440} y={70} kind="val" anchor="start">r = n² a₀</Label>
            <Label x={440} y={94} kind="val" anchor="start">a₀ = 0.529 Å</Label>
            <Label x={440} y={122} kind="val" anchor="start">radii 1 : 4 : 9</Label>
            <Label x={440} y={150} kind="val" anchor="start">speed v ∝ 1 / n</Label>
            <Label x={440} y={178} kind="label" anchor="start">bigger orbit, slower electron</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function ForceBalance() {
  return (
    <Anim title="An electron going round the nucleus: the pull of the nucleus points inward, the velocity is along the circle, and the inward pull alone is what keeps the electron on the circle" height={240} loop={8}>
      {(t) => {
        const cx = 200, cy = 120, R = 80;
        const a = TAU * 0.25 * t;
        const ex = cx + R * Math.cos(a), ey = cy - R * Math.sin(a);
        const tan: Pt = [-Math.sin(a), -Math.cos(a)];
        const inw: Pt = [-Math.cos(a), Math.sin(a)];
        return (
          <g>
            <circle className="fig-guide" cx={cx} cy={cy} r={R} fill="none" />
            <Ball x={cx} y={cy} r={7} />
            <Label x={cx} y={cy + 24} kind="label">+Ze</Label>
            <Line x1={cx} y1={cy} x2={ex} y2={ey} tone="soft" dashed />
            <Label x={(cx + ex) / 2 + 8} y={(cy + ey) / 2 - 8} kind="sym" anchor="start">r</Label>
            <Arrow x1={ex} y1={ey} x2={ex + tan[0] * 46} y2={ey + tan[1] * 46} label="v" />
            <Arrow x1={ex} y1={ey} x2={ex + inw[0] * 46} y2={ey + inw[1] * 46} width={3.4} label="F" />
            <Ball x={ex} y={ey} r={5.5} />
            <Label x={420} y={72} kind="val" anchor="start">pull of the nucleus</Label>
            <Label x={420} y={96} kind="sym" anchor="start">F = k Z e² / r²</Label>
            <Label x={420} y={134} kind="val" anchor="start">needed to bend the path</Label>
            <Label x={420} y={158} kind="sym" anchor="start">F = m v² / r</Label>
            <Label x={420} y={196} kind="label" anchor="start">they are the same force</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function EnergyBars() {
  return (
    <Anim title="For each Bohr orbit the kinetic energy is positive and half the size of the potential energy, which is negative, so the total is negative and equal to minus the kinetic energy; the energies shrink as one over n squared" height={250} loop={9}>
      {(t) => {
        const cur = Math.floor(t / 3) + 1;
        const zero = 100;
        const sc = 4.2;
        return (
          <g>
            <Line x1={50} y1={zero} x2={420} y2={zero} tone="soft" />
            <Label x={44} y={zero + 4} kind="val" anchor="end">0</Label>
            {[1, 2, 3].map((n, i) => {
              const x = 90 + i * 120;
              const g = n === cur ? ease(phase(t, (n - 1) * 3 + 0.2, (n - 1) * 3 + 1.2)) : 1;
              const ke = (13.6 / (n * n)) * sc * g;
              const pe = (27.2 / (n * n)) * sc * g;
              return (
                <g key={n} style={{ opacity: n === cur ? 1 : 0.45 }}>
                  <rect className="fig-bar" x={x} y={zero - ke} width={22} height={ke} fill="#fff" opacity={0.9} />
                  <rect className="fig-bar" x={x + 26} y={zero} width={22} height={pe} fill="#fff" opacity={0.4} />
                  <rect className="fig-bar" x={x + 52} y={zero} width={22} height={ke} fill="#fff" opacity={0.75} />
                  {n === cur && (
                    <g>
                      <Label x={x + 11} y={zero - ke - 6} kind="sym">KE</Label>
                      <Label x={x + 37} y={zero + pe + 16} kind="sym">PE</Label>
                      <Label x={x + 63} y={zero + ke + 16} kind="sym">E</Label>
                    </g>
                  )}
                  <Label x={x + 37} y={244} kind="val">{`n = ${n}`}</Label>
                </g>
              );
            })}
            <Label x={440} y={70} kind="val" anchor="start">{`n = ${cur}`}</Label>
            <Label x={440} y={96} kind="val" anchor="start">{`KE = +${(13.6 / (cur * cur)).toFixed(2)} eV`}</Label>
            <Label x={440} y={118} kind="val" anchor="start">{`PE = −${(27.2 / (cur * cur)).toFixed(2)} eV`}</Label>
            <Label x={440} y={140} kind="val" anchor="start">{`E = −${(13.6 / (cur * cur)).toFixed(2)} eV`}</Label>
            <Label x={440} y={176} kind="label" anchor="start">E = −KE,  PE = 2E</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function StandingWaveOrbit() {
  return (
    <Anim title="An electron wave wrapped round the nucleus: when a whole number of wavelengths fit the circumference the wave joins up with itself and survives, but for a fractional number the crests and troughs meet out of step and the wave destroys itself" height={250} loop={10}>
      {(t) => {
        const R = 70, A = 12;
        const wave = (nn: number, cx: number, cy: number, closed: boolean) => {
          const pts = curve(240, TAU, (th) => {
            const r = R + A * Math.cos(nn * th - TAU * 0.5 * t);
            return [cx + r * Math.cos(th), cy - r * Math.sin(th)];
          });
          return <Trail points={pts} tone={closed ? 'bright' : 'soft'} />;
        };
        const cy = 118;
        const gap = (cx: number) => {
          const r0 = R + A * Math.cos(-TAU * 0.5 * t);
          const r1 = R + A * Math.cos(3.5 * TAU - TAU * 0.5 * t);
          return (
            <g>
              <Ball x={cx + r0} y={cy} r={3.5} glow={false} />
              <Ball x={cx + r1} y={cy} r={3.5} glow={false} />
            </g>
          );
        };
        const lx = 160, rx = 480;
        return (
          <g>
            <circle className="fig-guide fig-dash" cx={lx} cy={cy} r={R} fill="none" />
            <circle className="fig-guide fig-dash" cx={rx} cy={cy} r={R} fill="none" />
            {wave(4, lx, cy, true)}
            {wave(3.5, rx, cy, false)}
            {gap(rx)}
            <Ball x={lx} y={cy} r={4} glow={false} />
            <Ball x={rx} y={cy} r={4} glow={false} />
            <Label x={lx} y={218} kind="val">2π r = 4 λ: fits</Label>
            <Label x={rx} y={218} kind="val">2π r = 3.5 λ: fails</Label>
            <Label x={lx} y={238} kind="label">allowed orbit, n = 4</Label>
            <Label x={rx} y={238} kind="label">crest meets trough at the join</Label>
          </g>
        );
      }}
    </Anim>
  );
}
