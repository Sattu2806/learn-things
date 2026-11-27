import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Label, Line, Readout, Spring, Trail, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for current electricity. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

/** Integral of f from 0 to t, so flowing dots keep their place when the speed changes. */
function integ(f: (s: number) => number, t: number): number {
  const n = 48;
  let sum = 0;
  const h = t / n;
  for (let i = 0; i < n; i++) sum += (f(i * h) + f((i + 1) * h)) * 0.5 * h;
  return sum;
}

function Dot({ x, y, q, r = 3 }: { x: number; y: number; q: number; r?: number }) {
  return q > 0 ? <circle className="fig-ball" cx={x} cy={y} r={r} /> : <circle className="fig-ghost" cx={x} cy={y} r={r} style={{ strokeWidth: 1.4 }} />;
}

/** A resistor on a wire: a zigzag with a name. */
function Res({ x1, y1, x2, y2, name, width = 7, coils = 3 }: { x1: number; y1: number; x2: number; y2: number; name?: ReactNode; width?: number; coils?: number }) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const vertical = Math.abs(x2 - x1) < Math.abs(y2 - y1);
  return (
    <g>
      <Spring x1={x1} y1={y1} x2={x2} y2={y2} coils={coils} width={width} />
      {name && <Label x={vertical ? mx + 22 : mx} y={vertical ? my + 5 : my - 14} kind="sym" anchor={vertical ? 'start' : 'middle'}>{name}</Label>}
    </g>
  );
}

/** A cell: long thin plate (+) and short thick plate (−) between (x, y) horizontal leads. */
function Cell({ x, y, vertical }: { x: number; y: number; vertical?: boolean }) {
  return vertical ? (
    <g>
      <Line x1={x - 14} y1={y - 5} x2={x + 14} y2={y - 5} tone="bright" />
      <Line x1={x - 8} y1={y + 5} x2={x + 8} y2={y + 5} tone="bright" />
      <rect x={x - 8} y={y + 3.5} width={16} height={3} fill="#fff" />
      <Label x={x + 20} y={y - 6} kind="val" anchor="start">+</Label>
    </g>
  ) : (
    <g>
      <Line x1={x - 5} y1={y - 14} x2={x - 5} y2={y + 14} tone="bright" />
      <Line x1={x + 5} y1={y - 8} x2={x + 5} y2={y + 8} tone="bright" />
      <rect x={x + 3.5} y={y - 8} width={3} height={16} fill="#fff" />
    </g>
  );
}

/** Dots drifting along a straight wire from a to b; the phase is the integrated current. */
function Flow({ a, b, ph, gap = 16, q = 1 }: { a: Pt; b: Pt; ph: number; gap?: number; q?: number }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 4) return null;
  const out: ReactNode[] = [];
  const dir = q < 0 ? -1 : 1;
  for (let s = ((ph * 1 * dir) % gap + gap) % gap; s < L; s += gap) {
    const u = s / L;
    out.push(<circle key={s} className="fig-ball" cx={lerp(a[0], b[0], u)} cy={lerp(a[1], b[1], u)} r={2.6} />);
  }
  return <g>{out}</g>;
}

// ------------------------------------------------------------------ 1. what current is

/** Charge streaming past a plane: electrons go one way, the conventional current the other. */
export function ChargeFlow() {
  return (
    <Anim title="Electrons drift left along a wire while the conventional current arrow points right; a counter ticks up as each electron crosses the marked plane, so the charge passed grows steadily with time" height={210} loop={9}>
      {(t) => {
        const x0 = 40, x1 = 600, cy = 105, h = 56, plane = 320;
        const gap = 34, v = 22;
        const items: ReactNode[] = [];
        for (let k = -2; k < 20; k++) {
          const x = x0 + k * gap - ((t * v) % gap) + gap * 2;
          if (x < x0 + 4 || x > x1 - 4) continue;
          const y = cy + ((k * 37) % 5 - 2) * 9;
          items.push(<Dot key={k} x={x} y={y} q={-1} r={4} />);
        }
        const crossed = Math.floor((t * v) / gap + 0.0001);
        return (
          <g>
            <rect className="kit-block" x={x0} y={cy - h / 2} width={x1 - x0} height={h} rx={6} />
            <Line x1={plane} y1={cy - h / 2 - 14} x2={plane} y2={cy + h / 2 + 14} tone="bright" dashed />
            <Label x={plane} y={cy - h / 2 - 22} kind="label">cross-section</Label>
            {items}
            <Arrow x1={70} y1={cy + h / 2 + 30} x2={220} y2={cy + h / 2 + 30} width={3.4} label="I" />
            <Arrow x1={560} y1={32} x2={470} y2={32} tone="soft" width={2} />
            <Label x={450} y={37} kind="label" anchor="end">electrons</Label>
            <Label x={320} y={cy + h / 2 + 52} kind="val">{`${crossed} electrons so far  →  Q = ${crossed} e`}</Label>
            <Readout>I = Q / t</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** A random walk of collisions, plus a slow drift once the field is on. */
export function Drift({ height = 240 }: { height?: number }) {
  return (
    <Anim title="One free electron in a metal bounces randomly off vibrating ions. With no field it wanders and ends up nowhere in particular; when a field is switched on it still zigzags but slowly creeps in one direction" height={height} loop={14}>
      {(t) => {
        const cx = 330, cy = height / 2;
        // A fixed pseudo-random walk: a new direction after every collision.
        const step = 0.28;
        const N = 50;
        const pts: Pt[] = [[0, 0]];
        let seed = 7;
        const rnd = () => {
          seed = (seed * 16807) % 2147483647;
          return seed / 2147483647;
        };
        for (let i = 0; i < N; i++) {
          const a = rnd() * TAU;
          pts.push([pts[i][0] + 15 * Math.cos(a), pts[i][1] + 15 * Math.sin(a)]);
        }
        const on = 6;
        const pos = (tt: number): Pt => {
          const u = Math.min(tt / step, N - 0.001);
          const i = Math.floor(u);
          const f = u - i;
          const base: Pt = [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)];
          const d = -Math.max(0, tt - on) * 17;
          return [base[0] + d, base[1]];
        };
        const tEnd = Math.min(t, 13);
        const trail: Pt[] = [];
        const nS = Math.max(2, Math.floor(tEnd / 0.07));
        for (let i = 0; i <= nS; i++) {
          const p = pos((tEnd * i) / nS);
          trail.push([cx + p[0], cy + p[1]]);
        }
        const last = trail[trail.length - 1];
        const ions: ReactNode[] = [];
        for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) ions.push(<circle key={`${i}-${j}`} className="fig-guide" cx={50 + i * 66 + 2.5 * Math.sin(t * 9 + i * j)} cy={30 + j * ((height - 60) / 3) + 2.5 * Math.cos(t * 8 + i + j)} r={9} style={{ opacity: 0.35 }} />);
        const field = t > on;
        return (
          <g>
            {ions}
            <Trail points={trail} />
            <Ball x={last[0]} y={last[1]} r={5} />
            {field && [0, 1, 2].map((i) => <Arrow key={i} x1={470 + ((t * 20 + i * 14) % 14)} y1={30 + i * 24} x2={560 + ((t * 20 + i * 14) % 14)} y2={30 + i * 24} tone="soft" width={1.2} />)}
            <Label x={W - 14} y={height - 8} kind="val" anchor="end">{field ? 'E on: net drift to the left' : 'E off: random motion only'}</Label>
            <Readout>speed of each hop ~ 10⁶ m/s, drift ~ 10⁻⁴ m/s</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** The tube picture of I = n e A vd: every electron in the shaded slab crosses the plane in time Δt. */
export function DriftTube() {
  return (
    <Anim title="A wire seen from the side with a marked cross-section; the shaded slab of length drift speed times time grows, and every electron in it will cross the plane, which gives the current as n e A and the drift speed" height={220} loop={9}>
      {(t) => {
        const x0 = 40, x1 = 600, cy = 105, h = 64, plane = 230;
        const vd = 30; // px per second for the picture
        const dt = 1 + 4 * ease(phase(t, 0.6, 6.5));
        const slab = vd * dt;
        const items: ReactNode[] = [];
        let inside = 0;
        const span = x1 - x0 - 12;
        for (let k = 0; k < 26; k++) {
          for (let r = 0; r < 3; r++) {
            const y = cy - h / 3 + (r * h) / 3 + (k % 2 ? 5 : -5);
            const xw = x0 + 6 + ((((k * 22 + r * 7 - vd * t) % span) + span) % span);
            if (xw > plane && xw < plane + slab) inside++;
            items.push(<Dot key={`${k}-${r}`} x={xw} y={y} q={-1} r={3.4} />);
          }
        }
        return (
          <g>
            <rect className="fig-cell is-lit" x={plane} y={cy - h / 2} width={slab} height={h} style={{ opacity: 0.55 }} />
            <rect className="kit-block" x={x0} y={cy - h / 2} width={x1 - x0} height={h} rx={5} />
            <Line x1={plane} y1={cy - h / 2 - 12} x2={plane} y2={cy + h / 2 + 12} tone="bright" dashed />
            {items}
            <Line x1={plane} y1={cy + h / 2 + 26} x2={plane + slab} y2={cy + h / 2 + 26} tone="soft" />
            <Label x={plane + slab / 2} y={cy + h / 2 + 46} kind="val">{`length = vd × Δt`}</Label>
            <Arrow x1={plane + slab + 30} y1={cy - h / 2 - 28} x2={plane + slab - 20} y2={cy - h / 2 - 28} tone="soft" width={2} />
            <Label x={W - 14} y={30} kind="val" anchor="end">{`Δt = ${dt.toFixed(1)}`}</Label>
            <Label x={W - 14} y={52} kind="val" anchor="end">{`electrons in slab: ${Math.round(inside)}`}</Label>
            <Readout>{'charge in slab = n · A · vd · Δt · e'}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** A signal travels at nearly light speed while the electrons creep: the lamp lights at once. */
export function Signal() {
  return (
    <Anim title="When a switch closes, the field travels down the wire almost instantly and a lamp at the far end lights, while the electrons themselves have hardly moved from where they were" height={200} loop={8}>
      {(t) => {
        const on = phase(t, 1, 1.4);
        const front = ease(phase(t, 1, 1.5)) * 470;
        const x0 = 70, y = 100;
        const items: ReactNode[] = [];
        for (let k = 0; k < 22; k++) items.push(<Dot key={k} x={x0 + 26 + k * 22 - Math.max(0, t - 1) * 2.2} y={y} q={-1} r={3.4} />);
        return (
          <g>
            <Line x1={x0} y1={y} x2={x0 + 40} y2={y} tone="bright" />
            <Line x1={x0 + 40} y1={y} x2={x0 + 70} y2={on > 0 ? y : y - 18} tone="bright" />
            <Line x1={x0 + 70} y1={y} x2={540} y2={y} tone="bright" />
            <Label x={x0 + 54} y={y - 28} kind="label">switch</Label>
            <circle className={front >= 455 ? 'fig-ball' : 'fig-ghost'} cx={560} cy={y} r={20} />
            <circle className="fig-guide fig-faint" cx={560} cy={y} r={32 + 6 * Math.sin(t * 6)} style={{ opacity: front >= 455 ? 1 : 0 }} />
            <Label x={560} y={y + 52} kind="label">lamp</Label>
            {items}
            {front > 2 && <Line x1={x0 + 70 + front * 0.95} y1={y - 26} x2={x0 + 70 + front * 0.95} y2={y + 26} tone="bright" />}
            {front > 2 && <Label x={x0 + 70 + front * 0.95} y={y - 34} kind="label">field front</Label>}
            <Readout>signal ~ 10⁸ m/s,  electrons ~ 10⁻⁴ m/s</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 2. Ohm's law

type OhmKind = 'ohmic' | 'bulb' | 'diode';

/** V against I: a straight line (ohmic), a curve that flattens (lamp), or a one-way switch (diode). */
export function OhmGraph({ kind, height = 250 }: { kind: OhmKind; height?: number }) {
  return (
    <Anim title={kind === 'ohmic' ? 'A graph of current against voltage for an ohmic conductor is a straight line through the origin; the slope is fixed so the resistance is the same at every point' : kind === 'bulb' ? 'For a lamp filament the graph bends over because the wire heats up and its resistance grows' : 'For a diode almost no current flows until a threshold voltage, then it rises steeply; negative voltage gives none'} height={height} loop={9}>
      {(t) => {
        const gx = 300, gy = height * 0.78, gw = 290, gh = height * 0.62;
        const u = 0.5 - 0.5 * Math.cos(TAU * (t / 9));
        const diode = kind === 'diode';
        const vmin = diode ? -0.5 : 0, vmax = diode ? 1.3 : 1.2;
        const Vs = lerp(vmin, vmax, u);
        const f = (v: number) => (kind === 'ohmic' ? v : kind === 'bulb' ? Math.pow(Math.max(v, 0), 0.6) : v < 0.5 ? 0 : (v - 0.5) * (v - 0.5) * 3.2);
        const ox = diode ? gx + 50 : gx;
        const sx = (gw - (diode ? 50 : 0)) / (vmax + 0.1);
        const vx = (v: number) => ox + v * sx;
        const iy = (i: number) => gy - (i / 2.1) * gh;
        const I = f(Vs);
        const R = I > 0.02 ? Vs / I : NaN;
        const lamp = kind === 'bulb' ? Math.min(1, I / 1.1) : 0;
        const py = height * 0.45;
        return (
          <g>
            <Axes x={ox} y={gy} w={gw - (diode ? 50 : 0) + 10} h={gh + 14} xLabel="V" yLabel="I" />
            {diode && <Line x1={gx} y1={gy} x2={ox} y2={gy} tone="bright" />}
            <Trail points={curve(90, vmax - vmin, (s) => [vx(vmin + s), iy(f(vmin + s))])} tone="soft" />
            <Trail points={curve(90, Vs - vmin, (s) => [vx(vmin + s), iy(f(vmin + s))])} />
            <Ball x={vx(Vs)} y={iy(I)} r={5} />
            <Line x1={vx(Vs)} y1={iy(I)} x2={vx(Vs)} y2={gy} tone="soft" dashed />
            <Line x1={vx(Vs)} y1={iy(I)} x2={ox} y2={iy(I)} tone="soft" dashed />
            {kind === 'bulb' && (
              <g>
                <circle className="fig-guide" cx={110} cy={py} r={36} />
                <circle cx={110} cy={py} r={34 + 34 * lamp} fill="#fff" style={{ opacity: 0.05 + 0.22 * lamp }} />
                <path className="fig-path" d={`M90 ${py + 22}L92 ${py - 6}L100 ${py + 4}L110 ${py - 6}L120 ${py + 4}L128 ${py - 6}L130 ${py + 22}`} style={{ opacity: 0.4 + 0.6 * lamp }} />
              </g>
            )}
            {kind === 'ohmic' && <Res x1={40} y1={py} x2={180} y2={py} width={9} coils={5} />}
            {diode && (
              <g>
                <Line x1={50} y1={py} x2={95} y2={py} tone="bright" />
                <path className="fig-path" d={`M95 ${py - 16}L95 ${py + 16}L125 ${py}Z`} fill="rgba(255,255,255,0.15)" />
                <Line x1={125} y1={py - 16} x2={125} y2={py + 16} tone="bright" />
                <Line x1={125} y1={py} x2={170} y2={py} tone="bright" />
              </g>
            )}
            <Label x={110} y={height - 24} kind="val">{Number.isNaN(R) ? 'no current: R is huge' : `V / I = ${R.toFixed(2)}`}</Label>
            <Readout>{kind === 'ohmic' ? 'V / I is the same everywhere' : kind === 'bulb' ? 'V / I grows as it heats' : 'one-way, with a threshold'}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 3. resistivity

/** R = ρ L / A: a block that is lengthened, then stretched at constant volume. */
export function ResistorShape() {
  return (
    <Anim title="A wire is made twice as long and R doubles; then a wire is stretched to twice the length so it also gets thinner by half, and R rises four times; a readout of R follows the length divided by the area" height={250} loop={12}>
      {(t) => {
        let L = 1, A = 1;
        if (t >= 0.8 && t < 3) L = 1 + ease(phase(t, 0.8, 2.6));
        else if (t >= 3 && t < 4.5) L = 2 - ease(phase(t, 3, 4.2));
        else if (t >= 5.2 && t < 8) {
          const s = ease(phase(t, 5.2, 7));
          L = 1 + s;
          A = 1 / L;
        } else if (t >= 8 && t < 9.5) {
          const s = 1 - ease(phase(t, 8, 9.2));
          L = 1 + s;
          A = 1 / L;
        }
        const w = 110 * L, h = 70 * A;
        const x0 = 60, cy = 100;
        const R = L / A;
        const items: ReactNode[] = [];
        const nx = Math.round(w / 30);
        const ny = Math.max(1, Math.round(h / 18));
        for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
          const x = x0 + 12 + ((i * 30 + t * 36) % (w - 24));
          items.push(<Dot key={`${i}-${j}`} x={x} y={cy - h / 2 + (h * (j + 0.5)) / ny} q={-1} r={3} />);
        }
        const stage = t < 4.7 ? 'longer, same thickness' : t < 9.7 ? 'stretched: longer and thinner' : '';
        return (
          <g>
            <rect className="kit-block" x={x0} y={cy - h / 2} width={w} height={h} rx={4} />
            {items}
            <Line x1={x0} y1={cy + 56} x2={x0 + w} y2={cy + 56} tone="soft" />
            <Label x={x0 + w / 2} y={cy + 76} kind="val">{`L = ${L.toFixed(2)} L₀`}</Label>
            <Line x1={x0 - 22} y1={cy - h / 2} x2={x0 - 22} y2={cy + h / 2} tone="soft" />
            <Label x={x0 - 28} y={cy + 4} kind="val" anchor="end">{`A = ${A.toFixed(2)}`}</Label>
            <rect className="fig-cell is-lit" x={440} y={190 - 28 * R} width={60} height={28 * R} />
            <Label x={470} y={218} kind="sym">R</Label>
            <Label x={560} y={150} kind="val" anchor="middle">{`R = ${R.toFixed(2)} R₀`}</Label>
            <Label x={560} y={172} kind="label" anchor="middle">{stage}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Heating a metal: the ions shake harder, the electron collides more, and R rises. */
export function TempResistance() {
  return (
    <Anim title="As a metal warms its ions vibrate more widely, so an electron passing through collides more often and the graph of resistance against temperature climbs steadily" height={250} loop={10}>
      {(t) => {
        const T = 0.5 - 0.5 * Math.cos(TAU * (t / 10));
        const amp = 1.5 + 8 * T;
        const ions: ReactNode[] = [];
        for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) ions.push(<circle key={`${i}-${j}`} className="fig-guide" cx={50 + i * 48 + amp * Math.sin(t * 8 + i * 1.7 + j)} cy={50 + j * 48 + amp * Math.cos(t * 9 + j * 1.3 + i)} r={10} style={{ opacity: 0.5 }} />);
        // The electron crosses left to right, deflected more when hot.
        const s = (t * 0.45) % 1;
        const ex = 36 + s * 280;
        const ey = 98 + (6 + 40 * T) * Math.sin(s * TAU * (3 + 5 * T)) * (1 - 0.3 * s);
        const gx = 390, gy = 210, gw = 200, gh = 150;
        const gp = (u: number): Pt => [gx + u * gw, gy - (0.25 + 0.7 * u) * gh];
        return (
          <g>
            {ions}
            <Ball x={ex} y={ey} r={4.5} />
            <Axes x={gx} y={gy} w={gw + 20} h={gh + 14} xLabel="T" yLabel="ρ" />
            <Trail points={curve(2, 1, gp)} tone="soft" />
            <Ball x={gp(T)[0]} y={gp(T)[1]} r={5} />
            <Label x={170} y={238} kind="val">{`T = ${(20 + 180 * T).toFixed(0)} °C`}</Label>
            <Readout>{`ρ = ρ₀ (1 + α ΔT) = ${(1 + 0.4 * T).toFixed(2)} ρ₀`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 4. circuits

/** Resistors in series (same current) or parallel (same voltage), with charges flowing. */
export function Circuit({ kind, height = 250 }: { kind: 'series' | 'parallel'; height?: number }) {
  const series = kind === 'series';
  const R1 = series ? 3 : 3, R2 = 6, V = 12;
  return (
    <Anim title={series ? 'A battery drives charge round a loop through two resistors one after the other; the dots keep the same spacing and speed everywhere, showing the same current in each, while the voltage drops across the larger resistor are bigger' : 'A battery drives charge to two resistors side by side; the dots flow faster through the smaller resistor, and the currents add back together in the main wire'} height={height} loop={10}>
      {(t) => {
        const x0 = 90, x1 = 540, yT = 50, yB = 205;
        if (series) {
          const I = V / (R1 + R2);
          const ph = integ(() => I * 22, t);
          const loop: Pt[] = [[x0, yB], [x0, yT], [x1, yT], [x1, yB], [x0, yB]];
          const segs: [Pt, Pt][] = [[loop[0], loop[1]], [loop[1], loop[2]], [loop[2], loop[3]], [loop[3], loop[4]]];
          return (
            <g>
              {segs.map((s, i) => (
                <Line key={i} x1={s[0][0]} y1={s[0][1]} x2={s[1][0]} y2={s[1][1]} tone="soft" />
              ))}
              <rect x={x0 - 24} y={118} width={48} height={22} fill="#000" />
              <Cell x={x0} y={129} vertical />
              <rect x={235} y={yT - 12} width={90} height={24} fill="#000" />
              <Res x1={235} y1={yT} x2={325} y2={yT} name={`R₁ = ${R1} Ω`} />
              <rect x={x1 - 12} y={110} width={24} height={64} fill="#000" />
              <Res x1={x1} y1={110} x2={x1} y2={174} name={`R₂ = ${R2} Ω`} width={8} />
              <Flow a={[x0, yB]} b={[x0, 140]} ph={ph} />
              <Flow a={[x0, 118]} b={[x0, yT]} ph={ph} />
              <Flow a={[x0, yT]} b={[235, yT]} ph={ph} />
              <Flow a={[325, yT]} b={[x1, yT]} ph={ph} />
              <Flow a={[x1, yT]} b={[x1, 110]} ph={ph} />
              <Flow a={[x1, 174]} b={[x1, yB]} ph={ph} />
              <Flow a={[x1, yB]} b={[x0, yB]} ph={ph} />
              <Label x={x0 + 36} y={134} kind="val" anchor="start">12 V</Label>
              <Label x={300} y={yB - 14} kind="val">{`I = V / (R₁ + R₂) = ${I.toFixed(2)} A`}</Label>
              <Label x={W - 14} y={30} kind="val" anchor="end">{`V₁ = ${(I * R1).toFixed(0)} V,  V₂ = ${(I * R2).toFixed(0)} V`}</Label>
              <Readout>same current in both</Readout>
            </g>
          );
        }
        const I1 = V / R1, I2 = V / R2;
        const xa = 330, xb = 470;
        const p1 = integ(() => I1 * 7, t), p2 = integ(() => I2 * 7, t), pT = integ(() => (I1 + I2) * 7, t);
        return (
          <g>
            <Line x1={x0} y1={yT} x2={xb} y2={yT} tone="soft" />
            <Line x1={x0} y1={yB} x2={xb} y2={yB} tone="soft" />
            <Line x1={x0} y1={yT} x2={x0} y2={118} tone="soft" />
            <Line x1={x0} y1={yB} x2={x0} y2={140} tone="soft" />
            <rect x={x0 - 24} y={118} width={48} height={22} fill="#000" />
            <Cell x={x0} y={129} vertical />
            <rect x={xa - 12} y={100} width={24} height={70} fill="#000" />
            <Res x1={xa} y1={yT} x2={xa} y2={yB} name={`R₁ = ${R1} Ω`} width={8} coils={4} />
            <rect x={xb - 12} y={100} width={24} height={70} fill="#000" />
            <Res x1={xb} y1={yT} x2={xb} y2={yB} name={`R₂ = ${R2} Ω`} width={8} coils={4} />
            <Flow a={[x0, yB]} b={[x0, 140]} ph={pT} gap={14} />
            <Flow a={[x0, 118]} b={[x0, yT]} ph={pT} gap={14} />
            <Flow a={[x0, yT]} b={[xa, yT]} ph={pT} gap={14} />
            <Flow a={[xa, yT]} b={[xb, yT]} ph={p2} gap={14} />
            <Flow a={[xa, yB]} b={[x0, yB]} ph={pT} gap={14} />
            <Flow a={[xb, yB]} b={[xa, yB]} ph={p2} gap={14} />
            <Flow a={[xa, yT]} b={[xa, yB]} ph={p1} gap={14} />
            <Flow a={[xb, yT]} b={[xb, yB]} ph={p2} gap={14} />
            <Label x={x0 + 36} y={134} kind="val" anchor="start">12 V</Label>
            <Label x={W - 14} y={30} kind="val" anchor="end">{`I₁ = ${I1.toFixed(0)} A,  I₂ = ${I2.toFixed(0)} A`}</Label>
            <Label x={300} y={yB + 28} kind="val">{`I = I₁ + I₂ = ${(I1 + I2).toFixed(0)} A`}</Label>
            <Readout>same voltage on both</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Heating in a resistor: more current, more energy handed to the lattice. */
export function PowerHeat() {
  return (
    <Anim title="A resistor carries a changing current; the electrons crash into the lattice and it glows brighter, with the power following the square of the current on the graph beside it" height={230} loop={10}>
      {(t) => {
        const u = 0.5 - 0.5 * Math.cos(TAU * (t / 10));
        const I = 0.4 + 1.6 * u;
        const P = I * I * 5;
        const rx = 70, rw = 210, cy = 105, rh = 62;
        const gx = 380, gy = 195, gw = 200, gh = 140;
        const ph = integ((s) => 12 * (0.4 + 1.6 * (0.5 - 0.5 * Math.cos(TAU * (s / 10)))), t);
        const items: ReactNode[] = [];
        for (let k = 0; k < 7; k++) items.push(<Dot key={k} x={rx + 10 + (((k * 30 + ph) % (rw - 20)) + (rw - 20)) % (rw - 20)} y={cy + ((k * 13) % 5 - 2) * 11} q={-1} r={3.3} />);
        const flash: ReactNode[] = [];
        for (let k = 0; k < 6; k++) {
          const a = TAU * (k / 6) + t * 3;
          const R = 6 + 14 * u * (0.5 + 0.5 * Math.sin(t * 6 + k));
          flash.push(<Line key={k} x1={rx + rw / 2 + (rh / 2 + 6) * Math.cos(a)} y1={cy + (rh / 2 + 6) * Math.sin(a)} x2={rx + rw / 2 + (rh / 2 + 6 + R) * Math.cos(a)} y2={cy + (rh / 2 + 6 + R) * Math.sin(a)} tone="soft" />);
        }
        return (
          <g>
            <rect className="kit-block" x={rx} y={cy - rh / 2} width={rw} height={rh} rx={6} style={{ fill: `rgba(255,255,255,${0.05 + 0.45 * u})` }} />
            {items}
            <Line x1={20} y1={cy} x2={rx} y2={cy} tone="soft" />
            <Line x1={rx + rw} y1={cy} x2={rx + rw + 20} y2={cy} tone="soft" />
            <Arrow x1={rx + 20} y1={cy + 56} x2={rx + 20 + 40 * I} y2={cy + 56} width={3} label="I" />
            {flash}
            <Axes x={gx} y={gy} w={gw} h={gh + 12} xLabel="I" yLabel="P" />
            <Trail points={curve(50, 2, (s) => [gx + (s / 2.1) * gw, gy - ((s * s) / 4.4) * gh])} tone="soft" />
            <Ball x={gx + (I / 2.1) * gw} y={gy - ((I * I) / 4.4) * gh} r={5} />
            <Label x={170} y={214} kind="val">{`P = I² R = ${P.toFixed(1)} W   (R = 5 Ω)`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 5. cells

/** A real cell has internal resistance: the terminal voltage sags as more current is drawn. */
export function CellInternal({ height = 260 }: { height?: number }) {
  return (
    <Anim title="A cell with internal resistance drives a load whose resistance changes; the voltage at the terminals falls below the EMF as the current rises, tracing a straight falling line on the graph" height={height} loop={10}>
      {(t) => {
        const E = 1.5, r = 0.5;
        const Rl = lerp(5.5, 0.25, 0.5 - 0.5 * Math.cos(TAU * (t / 10)));
        const I = E / (Rl + r);
        const Vt = E - I * r;
        const gx = 360, gy = height - 50, gw = 230, gh = height - 110;
        const gp = (i: number): Pt => [gx + (i / 3.2) * gw, gy - ((E - i * r) / 1.6) * gh];
        const ph = integ((s) => {
          const R = lerp(5.5, 0.25, 0.5 - 0.5 * Math.cos(TAU * (s / 10)));
          return (E / (R + r)) * 24;
        }, t);
        const cx = 140, cy = height / 2 - 10;
        return (
          <g>
            <rect className="kit-block" x={cx - 80} y={cy - 30} width={92} height={60} rx={6} />
            <Label x={cx - 34} y={cy - 38} kind="label">cell</Label>
            <Cell x={cx - 58} y={cy} />
            <Res x1={cx - 44} y1={cy} x2={cx + 6} y2={cy} name="r" width={5} coils={2} />
            <Line x1={cx - 80} y1={cy} x2={cx - 94} y2={cy} tone="soft" />
            <Line x1={cx - 94} y1={cy} x2={cx - 94} y2={cy + 72} tone="soft" />
            <Line x1={cx - 94} y1={cy + 72} x2={cx + 150} y2={cy + 72} tone="soft" />
            <Line x1={cx + 150} y1={cy + 72} x2={cx + 150} y2={cy + 30} tone="soft" />
            <Res x1={cx + 150} y1={cy + 30} x2={cx + 150} y2={cy - 40} name="R" width={7} coils={3} />
            <Line x1={cx + 150} y1={cy - 40} x2={cx + 150} y2={cy - 66} tone="soft" />
            <Line x1={cx + 150} y1={cy - 66} x2={cx + 12} y2={cy - 66} tone="soft" />
            <Line x1={cx + 12} y1={cy - 66} x2={cx + 12} y2={cy} tone="soft" />
            <Flow a={[cx + 12, cy - 66]} b={[cx + 150, cy - 66]} ph={ph} gap={14} />
            <Flow a={[cx + 150, cy + 72]} b={[cx - 94, cy + 72]} ph={ph} gap={14} />
            <Flow a={[cx + 150, cy - 66]} b={[cx + 150, cy - 40]} ph={ph} gap={14} />
            <Axes x={gx} y={gy} w={gw} h={gh + 14} xLabel="I" yLabel="V" />
            <Trail points={curve(2, 3.2, (s) => gp(s))} tone="soft" />
            <Line x1={gx - 4} y1={gp(0)[1]} x2={gx + 10} y2={gp(0)[1]} tone="bright" />
            <Label x={gx - 10} y={gp(0)[1] + 5} kind="val" anchor="end">ε</Label>
            <Ball x={gp(I)[0]} y={gp(I)[1]} r={5} />
            <Line x1={gp(I)[0]} y1={gp(I)[1]} x2={gp(I)[0]} y2={gy} tone="soft" dashed />
            <Label x={gx + gw / 2} y={height - 14} kind="val">{`I = ${I.toFixed(2)} A,  V = ${Vt.toFixed(2)} V,  lost = ${(I * r).toFixed(2)} V`}</Label>
            <Readout>{`V = ε − I r   (ε = 1.5 V, r = 0.5 Ω)`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Cells in series add their EMF and resistance; in parallel the EMF stays and r shrinks. */
export function CellsCombo({ kind }: { kind: 'series' | 'parallel' }) {
  const series = kind === 'series';
  const E = series ? 3 : 1.5, r = series ? 1 : 0.25;
  return (
    <Anim title={series ? 'Two identical cells joined end to end: the EMFs add and so do the internal resistances, drawn as growing bars' : 'Two identical cells side by side: the EMF stays the same as one cell while the internal resistance halves, drawn as bars'} height={220} loop={8}>
      {(t) => {
        const p = ease(phase(t, 0.5, 3));
        const pulse = 0.5 + 0.5 * Math.sin(TAU * (t / 2));
        const cells = series ? [{ x: 120, y: 80 }, { x: 220, y: 80 }] : [{ x: 150, y: 60 }, { x: 150, y: 130 }];
        return (
          <g>
            {series ? (
              <g>
                <Line x1={60} y1={80} x2={110} y2={80} tone="soft" />
                <Line x1={130} y1={80} x2={210} y2={80} tone="soft" />
                <Line x1={230} y1={80} x2={290} y2={80} tone="soft" />
              </g>
            ) : (
              <g>
                <Line x1={60} y1={60} x2={290} y2={60} tone="soft" />
                <Line x1={60} y1={130} x2={290} y2={130} tone="soft" />
                <Line x1={60} y1={60} x2={60} y2={130} tone="soft" />
                <Line x1={290} y1={60} x2={290} y2={130} tone="soft" />
              </g>
            )}
            {cells.map((c, i) => (
              <g key={i}>
                <rect x={c.x - 12} y={c.y - 16} width={24} height={32} fill="#000" />
                <Cell x={c.x} y={c.y} />
                <circle className="fig-guide fig-faint" cx={c.x} cy={c.y} r={22 + 4 * pulse} />
              </g>
            ))}
            <Label x={175} y={190} kind="label">{series ? 'in series' : 'in parallel'}</Label>
            <rect className="fig-cell is-lit" x={400} y={170 - 28 * E * p} width={44} height={28 * E * p} />
            <rect className="fig-cell" x={480} y={170 - 80 * r * p} width={44} height={80 * r * p} />
            <Label x={422} y={190} kind="sym">ε</Label>
            <Label x={502} y={190} kind="sym">r</Label>
            <Label x={422} y={34} kind="val">{`${(E * p).toFixed(2)} V`}</Label>
            <Label x={502} y={34} kind="val">{`${(r * p).toFixed(2)} Ω`}</Label>
            <Readout>{series ? 'ε = ε₁ + ε₂,  r = r₁ + r₂' : 'ε = ε₁,  1/r = 1/r₁ + 1/r₂'}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 6. Kirchhoff

/** Round a loop the potential rises across the cell and falls across each resistor; the net change is zero. */
export function LoopRule() {
  return (
    <Anim title="A ball travels once round a circuit while a graph beside it plots the electric potential at the ball; the potential jumps up across the cell and steps down across each resistor, ending exactly where it began" height={260} loop={11}>
      {(t) => {
        // 12 V cell, R1 = 2 ohm, R2 = 4 ohm, I = 2 A: drops of 4 V and 8 V.
        const f = phase(t, 0.5, 10);
        const x0 = 70, x1 = 250, yT = 60, yB = 190;
        const V = (q: number) => {
          if (q < 0.026) return 0;
          if (q < 0.068) return (12 * (q - 0.026)) / 0.042;
          if (q < 0.306) return 12;
          if (q < 0.387) return 12 - (4 * (q - 0.306)) / 0.081;
          if (q < 0.577) return 8;
          if (q < 0.658) return 8 - (8 * (q - 0.577)) / 0.081;
          return 0;
        };
        const pos = (q: number): Pt => {
          const len = [yB - yT, x1 - x0, yB - yT, x1 - x0];
          const total = len.reduce((a2, b2) => a2 + b2, 0);
          let d = (q % 1) * total;
          if (d < len[0]) return [x0, yB - d];
          d -= len[0];
          if (d < len[1]) return [x0 + d, yT];
          d -= len[1];
          if (d < len[2]) return [x1, yT + d];
          d -= len[2];
          return [x1 - d, yB];
        };
        const gx = 340, gy = 215, gw = 260, gh = 150;
        const gp = (q: number): Pt => [gx + q * gw, gy - (V(q) / 12) * gh];
        const [bx, by] = pos(f);
        return (
          <g>
            <Line x1={x0} y1={yB} x2={x0} y2={yT} tone="soft" />
            <Line x1={x0} y1={yT} x2={x1} y2={yT} tone="soft" />
            <Line x1={x1} y1={yT} x2={x1} y2={yB} tone="soft" />
            <Line x1={x1} y1={yB} x2={x0} y2={yB} tone="soft" />
            <rect x={x0 - 14} y={150} width={28} height={22} fill="#000" />
            <Cell x={x0} y={161} vertical />
            <rect x={130} y={yT - 12} width={50} height={24} fill="#000" />
            <Res x1={130} y1={yT} x2={180} y2={yT} name="R₁" coils={2} />
            <rect x={x1 - 12} y={108} width={24} height={50} fill="#000" />
            <Res x1={x1} y1={108} x2={x1} y2={158} name="R₂" coils={2} width={7} />
            <Label x={x0 + 22} y={166} kind="val" anchor="start">12 V</Label>
            <Ball x={bx} y={by} r={6} />
            <Axes x={gx} y={gy} w={gw + 10} h={gh + 16} xLabel="path" yLabel="V" />
            <Trail points={curve(160, f, (q) => gp(q))} />
            <Ball x={gp(f)[0]} y={gp(f)[1]} r={5} />
            <Label x={gx + gw / 2} y={248} kind="val">{`V = ${V(f).toFixed(1)} V   (rise 12, drops 4 + 8)`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** The junction rule: what flows in flows out. */
export function Junction() {
  return (
    <Anim title="Three wires meet at a point; charges stream in along one wire and out along the other two at the same total rate, so nothing piles up at the junction" height={230} loop={8}>
      {(t) => {
        const c: Pt = [320, 115];
        const I = [5, 3, 2];
        const ph = [integ(() => I[0] * 8, t), integ(() => I[1] * 8, t), integ(() => I[2] * 8, t)];
        const ends: Pt[] = [[60, 115], [580, 50], [580, 180]];
        return (
          <g>
            {ends.map((e, i) => (
              <Line key={i} x1={e[0]} y1={e[1]} x2={c[0]} y2={c[1]} tone="soft" />
            ))}
            <Flow a={ends[0]} b={c} ph={ph[0]} gap={12} />
            <Flow a={c} b={ends[1]} ph={ph[1]} gap={20} />
            <Flow a={c} b={ends[2]} ph={ph[2]} gap={30} />
            <Ball x={c[0]} y={c[1]} r={6} />
            <Arrow x1={110} y1={85} x2={170} y2={85} width={3} label={<tspan>I₁</tspan>} />
            <Arrow x1={470} y1={70} x2={520} y2={55} width={3} label={<tspan>I₂</tspan>} />
            <Arrow x1={470} y1={160} x2={520} y2={175} width={3} label={<tspan>I₃</tspan>} />
            <Label x={110} y={190} kind="val" anchor="start">I₁ = 5 A in</Label>
            <Label x={470} y={22} kind="val" anchor="start">I₂ = 3 A out</Label>
            <Label x={470} y={214} kind="val" anchor="start">I₃ = 2 A out</Label>
            <Readout>5 = 3 + 2</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 7. Wheatstone bridge

/** A Wheatstone bridge: adjust S and the galvanometer reading falls to zero when P/Q = R/S. */
export function Wheatstone() {
  return (
    <Anim title="A diamond of four resistors with a galvanometer across the middle; the variable resistor S is swept and the needle swings from one side, to zero where the ratios match, and then to the other side, while dots show the current through the galvanometer reversing" height={280} loop={12}>
      {(t) => {
        const P = 10, Q = 20, R = 30;
        const S = lerp(25, 110, 0.5 - 0.5 * Math.cos(TAU * (t / 12)));
        const Vb = 6;
        const VB = (Vb * Q) / (P + Q);
        const VD = (Vb * S) / (R + S);
        const dV = VB - VD;
        const A: Pt = [110, 125], C: Pt = [510, 125], B: Pt = [310, 40], D: Pt = [310, 205];
        const gI = integ((s) => {
          const Sx = lerp(25, 110, 0.5 - 0.5 * Math.cos(TAU * (s / 12)));
          return (VB - (Vb * Sx) / (R + Sx)) * 40;
        }, t);
        const phs = integ(() => 12, t);
        const bal = Math.abs(dV) < 0.04;
        const needle = Math.max(-1, Math.min(1, dV * 1.4)) * 0.9;
        return (
          <g>
            <Line x1={A[0]} y1={A[1]} x2={A[0]} y2={255} tone="soft" />
            <Line x1={A[0]} y1={255} x2={290} y2={255} tone="soft" />
            <Line x1={330} y1={255} x2={C[0]} y2={255} tone="soft" />
            <Line x1={C[0]} y1={255} x2={C[0]} y2={C[1]} tone="soft" />
            <rect x={290} y={243} width={40} height={24} fill="#000" />
            <Cell x={310} y={255} />
            <Res x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} name="P" width={7} />
            <Res x1={B[0]} y1={B[1]} x2={C[0]} y2={C[1]} name="Q" width={7} />
            <Res x1={A[0]} y1={A[1]} x2={D[0]} y2={D[1]} name="R" width={7} />
            <Res x1={D[0]} y1={D[1]} x2={C[0]} y2={C[1]} name="S" width={7} />
            <Line x1={B[0]} y1={B[1]} x2={B[0]} y2={95} tone="soft" />
            <Line x1={D[0]} y1={D[1]} x2={D[0]} y2={155} tone="soft" />
            <circle className="kit-block" cx={310} cy={125} r={30} />
            <Line x1={310} y1={125} x2={310 + 24 * Math.sin(needle * 1.5)} y2={125 - 24 * Math.cos(needle * 1.5)} tone="bright" />
            <Label x={310} y={148} kind="sym">G</Label>
            <Flow a={B} b={[310, 95]} ph={gI} gap={13} />
            <Flow a={[310, 155]} b={D} ph={gI} gap={13} />
            <Flow a={A} b={B} ph={phs} gap={22} />
            <Flow a={B} b={C} ph={phs} gap={22} />
            <Flow a={A} b={D} ph={phs} gap={22} />
            <Flow a={D} b={C} ph={phs} gap={22} />
            <Label x={A[0] - 14} y={A[1] + 6} kind="sym" anchor="end">A</Label>
            <Label x={C[0] + 14} y={C[1] + 6} kind="sym" anchor="start">C</Label>
            <Label x={B[0]} y={B[1] - 12} kind="sym">B</Label>
            <Label x={D[0]} y={D[1] + 26} kind="sym">D</Label>
            <Label x={W - 14} y={26} kind="val" anchor="end">{`P = 10, Q = 20, R = 30, S = ${S.toFixed(0)} Ω`}</Label>
            <Label x={W - 14} y={48} kind="val" anchor="end">{bal ? 'balanced: P/Q = R/S' : `P/Q = 0.50,  R/S = ${(R / S).toFixed(2)}`}</Label>
            <Readout>{`V_B − V_D = ${dV.toFixed(2)} V`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** The meter bridge: slide the jockey along a one-metre wire until the galvanometer reads zero. */
export function MeterBridge() {
  return (
    <Anim title="A one-metre wire with a sliding contact below two resistors in the gaps above; as the jockey slides, the galvanometer needle swings and settles at zero at the balance point, 40 centimetres from the left end" height={270} loop={11}>
      {(t) => {
        // R = 12 in the left gap, X = 18 in the right gap: balance at l = 40.
        const l = t < 1 ? 12 : t < 6 ? lerp(12, 40, ease(phase(t, 1, 6))) : t < 8 ? 40 : lerp(40, 12, ease(phase(t, 8, 10.5)));
        const x0 = 60, x1 = 580, yW = 205;
        const px = (cm: number) => x0 + (cm / 100) * (x1 - x0);
        const mid = px(40);
        const dev = l / 100 - 0.4;
        const needle = Math.max(-1, Math.min(1, dev * 4)) * 0.9;
        const bal = Math.abs(dev) < 0.01;
        return (
          <g>
            <Line x1={x0} y1={yW} x2={x1} y2={yW} tone="bright" />
            {[0, 20, 40, 60, 80, 100].map((cm) => (
              <g key={cm}>
                <Line x1={px(cm)} y1={yW} x2={px(cm)} y2={yW + 8} tone="soft" />
                <Label x={px(cm)} y={yW + 24} kind="val">{`${cm}`}</Label>
              </g>
            ))}
            <Line x1={x0} y1={yW} x2={x0} y2={85} tone="soft" />
            <Line x1={x1} y1={yW} x2={x1} y2={85} tone="soft" />
            <Line x1={x0} y1={85} x2={mid - 34} y2={85} tone="soft" />
            <Res x1={mid - 34} y1={85} x2={mid - 4} y2={85} name={'R'} width={6} coils={2} />
            <Res x1={mid + 4} y1={85} x2={mid + 74} y2={85} name={'X'} width={6} coils={3} />
            <Line x1={mid - 4} y1={85} x2={mid + 4} y2={85} tone="soft" />
            <Line x1={mid + 74} y1={85} x2={x1} y2={85} tone="soft" />
            <Line x1={x0 + 100} y1={85} x2={x0 + 100} y2={60} tone="soft" />
            <Cell x={x0 + 140} y={60} />
            <Label x={x0 + 160} y={42} kind="label" anchor="start">battery</Label>
            {/* galvanometer from the mid junction to the jockey */}
            <Line x1={mid} y1={85} x2={mid} y2={110} tone="soft" />
            <circle className="kit-block" cx={mid} cy={135} r={22} />
            <Line x1={mid} y1={135} x2={mid + 17 * Math.sin(needle * 1.4)} y2={135 - 17 * Math.cos(needle * 1.4)} tone="bright" />
            <Line x1={mid} y1={157} x2={mid} y2={170} tone="soft" />
            <Line x1={mid} y1={170} x2={px(l)} y2={170} tone="soft" />
            <Line x1={px(l)} y1={170} x2={px(l)} y2={yW - 4} tone="bright" />
            <Ball x={px(l)} y={yW - 4} r={5} />
            <Label x={px(l) + 8} y={162} kind="label" anchor="start">jockey</Label>
            <Label x={W - 14} y={22} kind="val" anchor="end">{`l = ${l.toFixed(0)} cm`}</Label>
            <Label x={W - 14} y={44} kind="val" anchor="end">{bal ? 'null point: R / X = l / (100 − l)' : `G reads ${(dev * 4).toFixed(2)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 8. potentiometer

/** The potentiometer: a steady current gives a uniform potential gradient along the wire; find the null point. */
export function Potentiometer({ height = 280 }: { height?: number }) {
  return (
    <Anim title="A long wire carries a steady current from a driver cell so its potential rises evenly along it; a test cell is connected through a galvanometer to a sliding jockey, and the jockey is moved to the null point, first with the test cell open circuit and then with a resistor across it, where the null point moves closer" height={height} loop={13}>
      {(t) => {
        // 10 m wire, gradient 0.2 V/m. Cell E = 1.0 V (null 5.0 m); with 8 Ω across: terminal 0.8 V (null 4.0 m).
        const ph1 = t < 6.5;
        const lt = ph1 ? lerp(2.2, 5.0, ease(phase(t, 0.6, 4.8))) : lerp(6.2, 4.0, ease(phase(t, 7.1, 11)));
        const Vcell = ph1 ? 1.0 : 0.8;
        const dev = 0.2 * lt - Vcell;
        const needle = Math.max(-1, Math.min(1, dev * 1.8)) * 0.9;
        const x0 = 50, x1 = 590, yW = 130;
        const px = (m: number) => x0 + (m / 10) * (x1 - x0);
        const gx = 50, gy = height - 20, gh = 56;
        return (
          <g>
            <Line x1={x0} y1={yW} x2={x1} y2={yW} tone="bright" />
            <Line x1={x0} y1={yW} x2={x0} y2={56} tone="soft" />
            <Line x1={x1} y1={yW} x2={x1} y2={56} tone="soft" />
            <Line x1={x0} y1={56} x2={290} y2={56} tone="soft" />
            <Line x1={320} y1={56} x2={x1} y2={56} tone="soft" />
            <rect x={290} y={44} width={30} height={24} fill="#000" />
            <Cell x={305} y={56} />
            <Label x={305} y={38} kind="label">driver cell</Label>
            {/* test cell and galvanometer under the wire */}
            <Line x1={x0} y1={yW} x2={x0} y2={188} tone="soft" />
            <Line x1={x0} y1={188} x2={110} y2={188} tone="soft" />
            <rect x={110} y={176} width={30} height={24} fill="#000" />
            <Cell x={125} y={188} />
            <Label x={125} y={212} kind="label">test cell E</Label>
            <Line x1={140} y1={188} x2={180} y2={188} tone="soft" />
            <circle className="kit-block" cx={206} cy={188} r={22} />
            <Line x1={206} y1={188} x2={206 + 17 * Math.sin(needle * 1.4)} y2={188 - 17 * Math.cos(needle * 1.4)} tone="bright" />
            <Line x1={228} y1={188} x2={px(lt)} y2={188} tone="soft" />
            <Line x1={px(lt)} y1={188} x2={px(lt)} y2={yW + 4} tone="bright" />
            <Ball x={px(lt)} y={yW + 4} r={5} />
            {!ph1 && <Res x1={140} y1={228} x2={230} y2={228} name="R = 8 Ω" width={5} coils={3} />}
            {[0, 2, 4, 6, 8, 10].map((m) => (
              <g key={m}>
                <Line x1={px(m)} y1={yW - 8} x2={px(m)} y2={yW} tone="soft" />
                <Label x={px(m)} y={yW - 14} kind="val">{`${m}`}</Label>
              </g>
            ))}
            {/* potential along the wire */}
            <Line x1={gx} y1={gy} x2={x1} y2={gy} tone="soft" />
            <Trail points={[[px(0), gy], [px(10), gy - gh]]} tone="soft" />
            <Line x1={px(0)} y1={gy - (Vcell / 2) * gh} x2={x1} y2={gy - (Vcell / 2) * gh} tone="soft" dashed />
            <Ball x={px(lt)} y={gy - (0.2 * lt / 2) * gh} r={4.5} />
            <Label x={W - 14} y={22} kind="val" anchor="end">{ph1 ? 'test cell on open circuit' : 'test cell with 8 Ω across it'}</Label>
            <Label x={W - 14} y={44} kind="val" anchor="end">{`jockey ${lt.toFixed(1)} m,  ${Math.abs(dev) < 0.03 ? 'null' : 'not null'}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}
