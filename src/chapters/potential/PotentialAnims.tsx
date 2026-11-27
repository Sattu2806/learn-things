import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Label, Line, Readout, Trail, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for electrostatic potential and capacitance. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

function Chg({ x, y, q, r = 11, t }: { x: number; y: number; q: number; r?: number; t?: number }) {
  const pos = q > 0;
  return (
    <g>
      {t !== undefined && <circle className="fig-guide fig-faint" cx={x} cy={y} r={r + 5 + 4 * Math.sin(TAU * t * 0.5)} />}
      <circle className={pos ? 'fig-ball' : 'fig-ghost'} cx={x} cy={y} r={r} />
      <text x={x} y={y + r * 0.5} textAnchor="middle" style={{ fill: pos ? '#000' : '#fff', fontSize: r * 1.5, fontFamily: 'var(--mono)' }}>
        {pos ? '+' : '−'}
      </text>
    </g>
  );
}

function Dot({ x, y, q, r = 3 }: { x: number; y: number; q: number; r?: number }) {
  return q > 0 ? <circle className="fig-ball" cx={x} cy={y} r={r} /> : <circle className="fig-ghost" cx={x} cy={y} r={r} style={{ strokeWidth: 1.4 }} />;
}

// ------------------------------------------------------------------ 1. work and potential energy

/** Moving a charge in a uniform field from A to B by two routes does the same work. */
export function WorkPaths() {
  return (
    <Anim title="Two copies of a positive charge are pushed against a uniform field from the same start to the same end, one straight and one by a winding route; their running totals of work finish equal" height={250} loop={9}>
      {(t) => {
        const ax = 110, bx = 530, ay = 190, by = 70;
        const p = ease(phase(t, 0.6, 6.4));
        const straight = (s: number): Pt => [lerp(ax, bx, s), lerp(ay, by, s)];
        const winding = (s: number): Pt => [lerp(ax, bx, s) + 0 * s, lerp(ay, by, s) + 60 * Math.sin(3.5 * Math.PI * s) * (1 - 0.3 * s)];
        const [sx, sy] = straight(p);
        const [wx, wy] = winding(p);
        // Field points left, so the work against it grows with progress to the right: W ∝ x - ax.
        const W1 = ((sx - ax) / (bx - ax)) * 100;
        const W2 = ((wx - ax) / (bx - ax)) * 100;
        return (
          <g>
            {[40, 100, 160, 220].map((y) => <Arrow key={y} x1={330 + ((t * 25 + y) % 20)} y1={y} x2={290 + ((t * 25 + y) % 20)} y2={y} tone="soft" width={1.2} />)}
            <Trail points={curve(60, 1, (s) => straight(s))} tone="soft" dashed />
            <Trail points={curve(120, 1, (s) => winding(s))} tone="soft" dashed />
            <Trail points={curve(60, p, (s) => straight(s))} />
            <Trail points={curve(120, p, (s) => winding(s))} />
            <Chg x={ax} y={ay} q={1} r={5} />
            <Label x={ax} y={ay + 26} kind="sym">A</Label>
            <Label x={bx} y={by - 16} kind="sym">B</Label>
            <Ball x={sx} y={sy} r={6} />
            <Ball x={wx} y={wy} r={6} />
            <Label x={W - 14} y={202} kind="val" anchor="end">{`straight: W = ${W1.toFixed(0)}%`}</Label>
            <Label x={W - 14} y={222} kind="val" anchor="end">{`winding:  W = ${W2.toFixed(0)}%`}</Label>
            <Label x={W - 14} y={244} kind="label" anchor="end">only the move along the field counts</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 2/3. potential of a point charge

/** The potential kQ / r as a hill (for +Q) or a well (for −Q), with a probe charge. */
export function PotentialHill({ q = 1, height = 250 }: { q?: number; height?: number }) {
  return (
    <Anim title="A graph of the potential of a point charge against distance, with a small positive test charge sliding on it; it rolls down a hill away from a positive charge and falls into a well toward a negative one" height={height} loop={8}>
      {(t) => {
        const gx = 70, gy = q > 0 ? height - 36 : 40, gw = 520, gh = height - 90;
        const f = (r: number) => (q > 0 ? gy - Math.min(1, 0.55 / r) * gh : gy + Math.min(1, 0.55 / r) * gh);
        const rmin = 0.55;
        const u = ease(phase(t, 0.4, 6.4));
        const r = q > 0 ? lerp(rmin, 3.2, u) : lerp(3.2, rmin, u);
        const px = gx + ((r - 0.4) / 3) * gw;
        const py = f(r);
        const trail = curve(80, 3, (s) => [gx + (s / 3) * gw, f(0.4 + s)]);
        const Vv = 1 / r;
        return (
          <g>
            <Line x1={gx} y1={q > 0 ? gy : gy} x2={gx + gw} y2={gy} tone="soft" />
            <Line x1={gx} y1={gy - (q > 0 ? gh + 10 : -gh - 10)} x2={gx} y2={gy} tone="soft" />
            <Label x={gx + gw - 4} y={q > 0 ? gy + 22 : gy - 10} kind="sym" anchor="end">r</Label>
            <Label x={gx + 8} y={q > 0 ? gy - gh - 14 : gy + gh + 28} kind="sym" anchor="start">V</Label>
            <Trail points={trail.filter(([x]) => x < gx + gw)} />
            <Chg x={gx + 10} y={q > 0 ? gy - 16 : gy + 16} q={q} r={10} t={t} />
            <Ball x={px} y={py - (q > 0 ? 9 : -9)} r={6} />
            <Arrow x1={px} y1={py - (q > 0 ? 24 : -24)} x2={px + (q > 0 ? 1 : -1) * 54} y2={py - (q > 0 ? 24 : -24)} width={3} label="F" />
            <Readout>{`V = ${q > 0 ? '' : '−'}${Vv.toFixed(2)}  (kQ = 1)`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 4. equipotentials

interface QQ {
  x: number;
  y: number;
  q: number;
}

const contourCache = new Map<string, string>();
/** Marching squares for the level set of f on a grid. */
function contourPath(f: (x: number, y: number) => number, level: number, x0: number, y0: number, x1: number, y1: number, step: number, key: string): string {
  const k = `${key}|${level}`;
  const hit = contourCache.get(k);
  if (hit !== undefined) return hit;
  let d = '';
  const cross = (xa: number, ya: number, va: number, xb: number, yb: number, vb: number): Pt | null => {
    if ((va - level) * (vb - level) >= 0) return null;
    const s = (level - va) / (vb - va);
    return [xa + (xb - xa) * s, ya + (yb - ya) * s];
  };
  for (let x = x0; x < x1; x += step) {
    for (let y = y0; y < y1; y += step) {
      const a = f(x, y), b = f(x + step, y), c = f(x + step, y + step), e = f(x, y + step);
      const pts = [cross(x, y, a, x + step, y, b), cross(x + step, y, b, x + step, y + step, c), cross(x + step, y + step, c, x, y + step, e), cross(x, y + step, e, x, y, a)].filter((p): p is Pt => p !== null);
      for (let i = 0; i + 1 < pts.length; i += 2) d += `M${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}L${pts[i + 1][0].toFixed(1)} ${pts[i + 1][1].toFixed(1)}`;
    }
  }
  contourCache.set(k, d);
  return d;
}

type EqKind = 'point' | 'dipole' | 'plates';

/** Equipotential surfaces with a charge sliding along a field line (changing V) and one moving along a surface (no change). */
export function Equipotentials({ title, kind, height = 270 }: { title: string; kind: EqKind; height?: number }) {
  const cy = height / 2;
  return (
    <Anim title={title} height={height} loop={9}>
      {(t) => {
        if (kind === 'point') {
          const cx = 320;
          const R0 = 140;
          const levels = [0.5, 1, 1.5, 2, 2.5, 3];
          const r = lerp(48, 250, ease(phase(t, 0.4, 7)));
          const a = 0.7 + t * 1.4;
          return (
            <g>
              {levels.map((n) => (
                <circle key={n} className="fig-guide" cx={cx} cy={cy} r={R0 / n} style={{ opacity: Math.abs(R0 / n - r) < 9 ? 1 : 0.4 }} />
              ))}
              <Line x1={cx} y1={cy} x2={cx + 290} y2={cy} tone="soft" dashed />
              <Chg x={cx} y={cy} q={1} r={11} t={t} />
              <Ball x={cx + r} y={cy} r={5} />
              <Arrow x1={cx + r} y1={cy - 16} x2={cx + r + 42 * (48 / r) ** 1.2} y2={cy - 16} width={2.5} label="E" />
              <Ball x={cx + 140 * Math.cos(a)} y={cy + 140 * Math.sin(a) * -1} r={4.5} ghost />
              <Label x={W - 12} y={40} kind="val" anchor="end">no work on a surface</Label>
              <Readout>{`V = ${(R0 / r).toFixed(2)} on the line`}</Readout>
            </g>
          );
        }
        if (kind === 'plates') {
          const y1 = 36, y2 = height - 36;
          const p = ease(phase(t, 0.4, 7));
          const y = lerp(y1 + 8, y2 - 8, p);
          const V = ((y2 - y) / (y2 - y1)) * 100;
          const n = 5;
          return (
            <g>
              <rect className="kit-block is-filled" x={120} y={y1 - 6} width={400} height={6} />
              <rect className="kit-block" x={120} y={y2} width={400} height={6} />
              <Label x={110} y={y1 + 2} kind="val" anchor="end">100 V</Label>
              <Label x={110} y={y2 + 8} kind="val" anchor="end">0 V</Label>
              {Array.from({ length: n }, (_, i) => {
                const yy = lerp(y1, y2, (i + 1) / (n + 1));
                return <Line key={i} x1={120} y1={yy} x2={520} y2={yy} tone="soft" dashed />;
              })}
              {[200, 320, 440].map((x) => <Arrow key={x} x1={x} y1={y1 + 14} x2={x} y2={y2 - 14} tone="soft" width={1.4} />)}
              <Ball x={320} y={y} r={6} />
              <Readout>{`V = ${V.toFixed(0)} volts`}</Readout>
            </g>
          );
        }
        // dipole
        const x1 = 250, x2 = 390;
        const qs: QQ[] = [{ x: x1, y: cy, q: 1 }, { x: x2, y: cy, q: -1 }];
        const V = (x: number, y: number) => qs.reduce((s, c) => s + (c.q * 60) / Math.max(5, Math.hypot(x - c.x, y - c.y)), 0);
        const levels = [-3, -1.5, -0.8, -0.35, 0, 0.35, 0.8, 1.5, 3];
        const path = levels.map((L) => ({ L, d: contourPath(V, L, 0, 0, W, height, 6, `dip${height}`) }));
        // A probe moves along the vertical bisector: V stays zero while the field is not zero.
        const pr = lerp(cy - 105, cy + 105, 0.5 - 0.5 * Math.cos(TAU * (t / 9)));
        const ex = qs.reduce((s, c) => s + (c.q * (320 - c.x)) / Math.hypot(320 - c.x, pr - c.y) ** 3, 0);
        const ey = qs.reduce((s, c) => s + (c.q * (pr - c.y)) / Math.hypot(320 - c.x, pr - c.y) ** 3, 0);
        const m = Math.hypot(ex, ey);
        return (
          <g>
            {path.map(({ L, d }) => (
              <path key={L} className={L === 0 ? 'fig-bar' : 'fig-guide'} d={d} fill="none" style={{ opacity: L === 0 ? 0.9 : 0.5, strokeWidth: L === 0 ? 2.2 : 1.3 }} />
            ))}
            <Chg x={x1} y={cy} q={1} r={10} t={t} />
            <Chg x={x2} y={cy} q={-1} r={10} t={t} />
            <Arrow x1={320} y1={pr} x2={320 + (ex / m) * 46} y2={pr + (ey / m) * 46} width={3} label="E" />
            <Ball x={320} y={pr} r={5} />
            <Label x={W - 14} y={height - 10} kind="label" anchor="end">V = 0 line (thick)</Label>
            <Readout>V = 0, but E is not</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 5. E from V

/** The slope of the V against x graph is minus the field. */
export function FieldFromV({ height = 270 }: { height?: number }) {
  return (
    <Anim title="A potential against position graph with a dot sliding along it; below the dot an arrow shows the field, which points downhill and is longest where the graph is steepest" height={height} loop={10}>
      {(t) => {
        const gx = 40, gw = 560, gy = height * 0.55, gh = height * 0.3;
        const V = (u: number) => Math.cos(u * 2.2) * 0.9 + 0.1 * u;
        const dV = (u: number) => -2.2 * 0.9 * Math.sin(u * 2.2) + 0.1;
        const u = 0.4 + 2.5 * (0.5 - 0.5 * Math.cos(TAU * (t / 10)));
        const px = (s: number) => gx + (s / 3.4) * gw;
        const py = (v: number) => gy - v * gh;
        const E = -dV(u);
        return (
          <g>
            <Line x1={gx} y1={gy + gh + 10} x2={gx + gw} y2={gy + gh + 10} tone="soft" />
            <Label x={gx + gw} y={gy + gh + 32} kind="sym" anchor="end">x</Label>
            <Label x={gx + 4} y={26} kind="sym" anchor="start">V</Label>
            <Trail points={curve(100, 3.4, (s) => [px(s), py(V(s))])} tone="soft" />
            <Trail points={curve(100, u, (s) => [px(s), py(V(s))])} />
            <Line x1={px(u) - 50} y1={py(V(u)) + 50 * ((dV(u) * gh) / (gw / 3.4))} x2={px(u) + 50} y2={py(V(u)) - 50 * ((dV(u) * gh) / (gw / 3.4))} tone="soft" dashed />
            <Ball x={px(u)} y={py(V(u))} r={6} />
            <Line x1={px(u)} y1={py(V(u))} x2={px(u)} y2={gy + gh + 10} tone="soft" dashed />
            <Arrow x1={px(u)} y1={gy + gh + 28} x2={px(u) + E * 48} y2={gy + gh + 28} width={3.4} label="E" />
            <Readout>{`slope ${dV(u).toFixed(1)},  E = ${E.toFixed(1)}`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 6. dipole potential and energy

/** V of a dipole goes as cos θ / r²: positive on the + side, zero on the middle line, negative on the − side. */
export function DipolePotential() {
  return (
    <Anim title="A point circles a dipole at fixed distance while a graph beside it plots the potential at that point; it is positive on the positive side, zero on the middle line and negative on the other side, following cosine of the angle" height={250} loop={10}>
      {(t) => {
        const th = TAU * (t / 10);
        const cx = 150, cy = 125, R = 88;
        const px = cx + R * Math.cos(th), py = cy - R * Math.sin(th);
        const gx = 340, gw = 270, gy = 125, gh = 80;
        const gp = (a: number): Pt => [gx + (a / TAU) * gw, gy - Math.cos(a) * gh];
        return (
          <g>
            <circle className="fig-guide fig-dash" cx={cx} cy={cy} r={R} />
            <Line x1={cx - R - 20} y1={cy} x2={cx + R + 20} y2={cy} tone="soft" dashed />
            <Line x1={cx} y1={cy - R - 14} x2={cx} y2={cy + R + 14} tone="soft" dashed />
            <Chg x={cx + 18} y={cy} q={1} r={9} />
            <Chg x={cx - 18} y={cy} q={-1} r={9} />
            <Line x1={cx} y1={cy} x2={px} y2={py} tone="soft" />
            <Ball x={px} y={py} r={5.5} />
            <Label x={cx + 34} y={cy - 12} kind="sym">θ</Label>
            <Axes x={gx} y={gy} w={gw} h={gh + 14} below={gh + 14} xLabel="θ" yLabel="V" />
            <Trail points={curve(80, TAU, gp)} tone="soft" />
            <Trail points={curve(80, th, gp)} />
            <Ball x={gp(th)[0]} y={gp(th)[1]} r={5} />
            <Label x={gx + gw / 2} y={244} kind="val">{`V ∝ cos θ = ${Math.cos(th).toFixed(2)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** The energy U = −p E cos θ of a dipole as it swings about the field. */
export function DipoleEnergy() {
  return (
    <Anim title="A dipole swings about a uniform field while a graph of its potential energy against angle shows a dot sliding in the valley at zero degrees; the energy is lowest when the dipole points along the field and highest when it points against it" height={250} loop={10}>
      {(t) => {
        const th = 1.5 * Math.cos(1.4 * t);
        const cx = 120, cy = 125, L = 52;
        const dx = L * Math.cos(th), dy = -L * Math.sin(th);
        const gx = 330, gw = 280, gy = 125, gh = 70;
        const Uf = (a: number) => -Math.cos(a);
        const pt = (a: number): Pt => [gx + gw / 2 + (a / Math.PI) * (gw / 2), gy - Uf(a) * gh];
        return (
          <g>
            {[70, 125, 180].map((y) => <Arrow key={y} x1={20 + ((t * 30 + y) % 30)} y1={y} x2={64 + ((t * 30 + y) % 30)} y2={y} tone="soft" width={1.2} />)}
            <Line x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} tone="bright" />
            <Chg x={cx + dx} y={cy + dy} q={1} r={9} />
            <Chg x={cx - dx} y={cy - dy} q={-1} r={9} />
            <Axes x={gx} y={gy} w={gw} h={gh + 14} below={gh + 14} xLabel="θ" yLabel="U" />
            <Line x1={gx + gw / 2} y1={gy - 4} x2={gx + gw / 2} y2={gy + 4} tone="soft" />
            <Label x={gx + gw / 2} y={gy - 8} kind="sym">0</Label>
            <Trail points={curve(80, 2 * Math.PI, (s) => pt(-Math.PI + s))} tone="soft" />
            <Ball x={pt(th)[0]} y={pt(th)[1]} r={5.5} />
            <Readout>{`U = −pE cos θ = ${(-Math.cos(th)).toFixed(2)} pE`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 7. potential energy of a system

/** Bringing charges in one at a time; the work adds up to the energy of the arrangement. */
export function SystemEnergy() {
  return (
    <Anim title="Three equal charges are brought in one at a time to the corners of a triangle; the first costs nothing, the second costs one unit of work and the third two, and the total is the stored energy" height={260} loop={11}>
      {(t) => {
        const C: Pt[] = [[250, 170], [390, 170], [320, 50]];
        const far: Pt[] = [[40, 230], [600, 230], [320, -20]];
        const p = [ease(phase(t, 0.3, 1.5)), ease(phase(t, 3, 4.5)), ease(phase(t, 6, 7.5))];
        const pos = C.map((c, i): Pt => [lerp(far[i][0], c[0], p[i]), lerp(far[i][1], c[1], p[i])]);
        const w = [0, p[1], 2 * p[2]];
        return (
          <g>
            {p[1] > 0 && <Line x1={pos[0][0]} y1={pos[0][1]} x2={pos[1][0]} y2={pos[1][1]} tone="soft" dashed />}
            {p[2] > 0 && <Line x1={pos[0][0]} y1={pos[0][1]} x2={pos[2][0]} y2={pos[2][1]} tone="soft" dashed />}
            {p[2] > 0 && <Line x1={pos[1][0]} y1={pos[1][1]} x2={pos[2][0]} y2={pos[2][1]} tone="soft" dashed />}
            {pos.map((c, i) => (
              <Chg key={i} x={c[0]} y={c[1]} q={1} r={10} />
            ))}
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect className="fig-cell" x={72} y={26 + i * 24} width={Math.max(1, w[i] * 40)} height={14} />
                <Label x={64} y={38 + i * 24} kind="val" anchor="end">{`W${i + 1}`}</Label>
              </g>
            ))}
            <Label x={20} y={112} kind="val" anchor="start">{`total = ${(w[0] + w[1] + w[2]).toFixed(1)} (kq²/a)`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 8. conductors

/** Free charges in a conductor rearrange until the field inside is zero. */
export function ConductorShield() {
  return (
    <Anim title="A metal block in a uniform field: free charges drift to the faces until their own field cancels the outside field inside the block, so the arrows inside shrink to nothing while the arrows outside stay" height={250} loop={9}>
      {(t) => {
        const s = ease(phase(t, 0.8, 4.5)) * (1 - ease(phase(t, 7.2, 8.6)));
        const bx = 230, bw = 180, by = 55, bh = 140;
        const items: ReactNode[] = [];
        for (const y of [30, 80, 125, 170, 220]) {
          for (let k = 0; k < 6; k++) {
            const x0 = 20 + k * 110 + ((t * 28) % 110);
            const inside = x0 + 40 > bx && x0 < bx + bw;
            const a = inside ? 1 - s : 1;
            if (a < 0.05) continue;
            const x1 = Math.max(x0, 0);
            if (inside && (y < by || y > by + bh)) continue;
            if (x1 > W - 30) continue;
            items.push(<Arrow key={`${y}-${k}`} x1={x1} y1={y} x2={x1 + 40} y2={y} tone="soft" width={1.3 * a + 0.2} />);
          }
        }
        const dots: ReactNode[] = [];
        for (let i = 0; i < 6; i++) {
          const y = by + 18 + i * 21;
          dots.push(<Dot key={`n${i}`} x={bx + 56 - 44 * s} y={y} q={-1} />);
          dots.push(<Dot key={`m${i}`} x={bx + bw - 56 + 44 * s} y={y} q={1} />);
          dots.push(<Dot key={`a${i}`} x={bx + 56 + ((i * 17) % 60) + 4 * Math.sin(t * 2 + i)} y={y + 10} q={-1} />);
        }
        return (
          <g>
            {items}
            <rect className="kit-block" x={bx} y={by} width={bw} height={bh} rx={4} />
            {dots}
            <Label x={bx + bw / 2} y={by - 10} kind="label">conductor</Label>
            <Readout>{`field inside: ${(1 - s).toFixed(2)} of outside`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 9. capacitors

/** A battery charges a pair of plates: charges pile up and the field and stored energy grow. */
export function ChargingCap({ height = 250 }: { height?: number }) {
  return (
    <Anim title="A battery moves charge onto two metal plates; positive charges gather on one plate and negative on the other, the field between them grows, and a graph of charge against voltage fills with area that is the stored energy" height={height} loop={9}>
      {(t) => {
        const prog = 1 - Math.exp(-phase(t, 0.5, 8) * 3.2);
        const px = 150, pw = 130, top = height * 0.22, bot = height * 0.62;
        const n = Math.round(prog * 7);
        const dots: ReactNode[] = [];
        for (let i = 0; i < n; i++) {
          const x = px + 14 + (i * (pw - 28)) / 6;
          dots.push(<Dot key={`p${i}`} x={x} y={top + 14} q={1} />);
          dots.push(<Dot key={`m${i}`} x={x} y={bot - 14} q={-1} />);
        }
        const gx = 380, gy = height - 50, gw = 220, gh = height - 110;
        const E = prog;
        return (
          <g>
            <rect className="kit-block is-filled" x={px} y={top - 8} width={pw} height={8} />
            <rect className="kit-block" x={px} y={bot} width={pw} height={8} />
            {dots}
            {Array.from({ length: 5 }, (_, i) => <Arrow key={i} x1={px + 18 + i * 24} y1={top + 8} x2={px + 18 + i * 24} y2={top + 8 + (bot - top - 16) * (0.15 + 0.85 * E)} tone="soft" width={1.2 + E} />)}
            <Line x1={px + pw / 2} y1={top - 8} x2={px + pw / 2} y2={top - 36} tone="soft" />
            <Line x1={px + pw / 2} y1={bot + 8} x2={px + pw / 2} y2={bot + 36} tone="soft" />
            <Line x1={px - 40} y1={top - 36} x2={px + pw / 2} y2={top - 36} tone="soft" />
            <Line x1={px - 40} y1={bot + 36} x2={px + pw / 2} y2={bot + 36} tone="soft" />
            <Line x1={px - 40} y1={top - 36} x2={px - 40} y2={top + 2} tone="soft" />
            <Line x1={px - 40} y1={bot + 36} x2={px - 40} y2={bot - 30} tone="soft" />
            <Label x={px - 40} y={(top + bot) / 2 + 6} kind="label" anchor="middle">battery V</Label>
            <Axes x={gx} y={gy} w={gw} h={gh} xLabel="V" yLabel="Q" />
            <Line x1={gx} y1={gy} x2={gx + gw * 0.9} y2={gy - gh * 0.9} tone="soft" dashed />
            <path className="fig-cell" d={`M${gx} ${gy}L${gx + gw * 0.9 * prog} ${gy - gh * 0.9 * prog}L${gx + gw * 0.9 * prog} ${gy}Z`} />
            <Ball x={gx + gw * 0.9 * prog} y={gy - gh * 0.9 * prog} r={5} />
            <Readout>{`Q = ${(prog * 100).toFixed(0)}% of CV,  U = ${(prog * prog * 100).toFixed(0)}% of ½CV²`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Plate separation d changes: the capacitance C = ε₀A/d follows, and so does the charge held at fixed voltage. */
export function ParallelPlate() {
  return (
    <Anim title="Two parallel plates connected to a battery as the gap between them shrinks and grows; with a smaller gap the same voltage holds more charge, so the capacitance goes up" height={250} loop={9}>
      {(t) => {
        const d = lerp(30, 100, 0.5 - 0.5 * Math.cos(TAU * (t / 9)));
        const cy = 115, px = 90, pw = 190;
        const top = cy - d / 2, bot = cy + d / 2;
        const C = 60 / d;
        const n = Math.max(2, Math.round(C * 5));
        const dots: ReactNode[] = [];
        for (let i = 0; i < n; i++) {
          const x = px + 8 + (i * (pw - 16)) / (n - 1);
          dots.push(<Dot key={`p${i}`} x={x} y={top - 12} q={1} r={2.6} />);
          dots.push(<Dot key={`m${i}`} x={x} y={bot + 12} q={-1} r={2.6} />);
        }
        const gx = 380, gy = 200, gw = 220, gh = 150;
        const gp = (dd: number): Pt => [gx + ((dd - 25) / 80) * gw, gy - Math.min(1, 30 / dd / 2.1) * gh];
        return (
          <g>
            <rect className="kit-block is-filled" x={px} y={top - 6} width={pw} height={6} />
            <rect className="kit-block" x={px} y={bot} width={pw} height={6} />
            {dots}
            <Line x1={px + pw + 14} y1={top} x2={px + pw + 14} y2={bot} tone="soft" />
            <Label x={px + pw + 22} y={cy + 5} kind="sym" anchor="start">d</Label>
            <Label x={px + pw / 2} y={226} kind="val">{`C = ε₀ A / d = ${C.toFixed(2)} C₀`}</Label>
            <Axes x={gx} y={gy} w={gw} h={gh} xLabel="d" yLabel="C" />
            <Trail points={curve(60, 1, (s) => gp(28 + s * 75))} tone="soft" />
            <Ball x={gp(d)[0]} y={gp(d)[1]} r={5} />
          </g>
        );
      }}
    </Anim>
  );
}

/** A dielectric slab slides in: molecules line up, the field inside weakens and C goes up. */
export function Dielectric({ height = 260, battery = false }: { height?: number; battery?: boolean }) {
  return (
    <Anim title="A slab of dielectric slides between charged plates; its molecules turn to line up with the field, leaving bound charge on its faces that partly cancels the field, so the field weakens and the capacitance rises" height={height} loop={10}>
      {(t) => {
        const K = 3;
        const s = ease(phase(t, 1, 4)) * (1 - ease(phase(t, 7.2, 9)));
        const px = 110, pw = 330, top = height * 0.22, bot = height * 0.7;
        const sx = lerp(px + pw + 70, px + 40, s);
        const sw = 190;
        const keff = 1 + (K - 1) * s;
        const dots: ReactNode[] = [];
        for (let i = 0; i < 8; i++) {
          const x = px + 14 + (i * (pw - 28)) / 7;
          dots.push(<Dot key={`p${i}`} x={x} y={top + 12} q={1} />);
          dots.push(<Dot key={`m${i}`} x={x} y={bot - 12} q={-1} />);
        }
        const mol: ReactNode[] = [];
        const rows = 4, cols = 5;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const mx = sx + 18 + (c * (sw - 36)) / (cols - 1);
            const my = top + 36 + (r * (bot - top - 72)) / (rows - 1);
            if (mx < px || mx > px + pw) continue;
            const a = (1 - ease(phase(s, 0, 1))) * (Math.sin(t * 3 + r * 2 + c) * 1.1);
            const L = 9;
            mol.push(
              <g key={`${r}-${c}`}>
                <Line x1={mx - L * Math.sin(a)} y1={my + L * Math.cos(a)} x2={mx + L * Math.sin(a)} y2={my - L * Math.cos(a)} tone="soft" />
                <circle className="fig-ghost" cx={mx - L * Math.sin(a)} cy={my + L * Math.cos(a)} r={2.4} style={{ strokeWidth: 1.2 }} />
                <circle className="fig-ball" cx={mx + L * Math.sin(a)} cy={my - L * Math.cos(a)} r={2.4} />
              </g>,
            );
          }
        }
        const E = 1 / keff;
        return (
          <g>
            <rect className="kit-block is-filled" x={px} y={top - 8} width={pw} height={8} />
            <rect className="kit-block" x={px} y={bot} width={pw} height={8} />
            {dots}
            <rect className="kit-block" x={sx} y={top + 14} width={sw} height={bot - top - 28} style={{ fillOpacity: 0.12 }} />
            {mol}
            {[px + 40, px + 120, px + 200, px + 280].map((x) => <Arrow key={x} x1={x} y1={top + 20} x2={x} y2={top + 20 + 34 * E + 6} tone="soft" width={1 + 1.6 * E} />)}
            <Label x={px + pw / 2} y={height - 40} kind="val">{`E = E₀ / ${keff.toFixed(1)}`}</Label>
            <Label x={px + pw / 2} y={height - 16} kind="val">{`C = ${keff.toFixed(1)} C₀`}</Label>
            <Label x={W - 14} y={46} kind="val" anchor="end">{battery ? 'battery connected: V fixed' : 'isolated: Q fixed'}</Label>
            <Label x={W - 14} y={68} kind="val" anchor="end">{battery ? `Q = ${keff.toFixed(1)} Q₀` : `V = V₀ / ${keff.toFixed(1)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Two capacitors in series (same charge, voltages add) or in parallel (same voltage, charges add). */
export function CapCombo({ kind, height = 250 }: { kind: 'series' | 'parallel'; height?: number }) {
  const series = kind === 'series';
  return (
    <Anim title={series ? 'Two capacitors in a row on one battery hold the same charge on each plate while the battery voltage splits unevenly between them, more on the smaller capacitor' : 'Two capacitors side by side on one battery both have the full battery voltage, and the bigger one holds more charge'} height={height} loop={9}>
      {(t) => {
        const prog = 1 - Math.exp(-phase(t, 0.4, 7) * 3.2);
        // C1 = 2, C2 = 3 (arbitrary units); battery 5 units.
        const C1 = 2, C2 = 3, Vb = 5;
        const Q1 = series ? (C1 * C2 * Vb) / (C1 + C2) : C1 * Vb;
        const Q2 = series ? Q1 : C2 * Vb;
        const V1 = series ? Q1 / C1 : Vb;
        const V2 = series ? Q2 / C2 : Vb;
        const cap = (x: number, y: number, vert: boolean, Q: number, label: string) => {
          const n = Math.round((Q / 6) * 6 * prog);
          const dots: ReactNode[] = [];
          for (let i = 0; i < n; i++) {
            const o = 8 + i * 6;
            if (vert) {
              dots.push(<Dot key={`a${i}`} x={x - 18 + o * 0.9} y={y - 11} q={1} r={2.2} />);
              dots.push(<Dot key={`b${i}`} x={x - 18 + o * 0.9} y={y + 11} q={-1} r={2.2} />);
            } else {
              dots.push(<Dot key={`a${i}`} x={x - 11} y={y - 18 + o * 0.9} q={1} r={2.2} />);
              dots.push(<Dot key={`b${i}`} x={x + 11} y={y - 18 + o * 0.9} q={-1} r={2.2} />);
            }
          }
          return (
            <g>
              {vert ? (
                <g>
                  <rect className="kit-block is-filled" x={x - 20} y={y - 5} width={40} height={3} />
                  <rect className="kit-block" x={x - 20} y={y + 2} width={40} height={3} />
                </g>
              ) : (
                <g>
                  <rect className="kit-block is-filled" x={x - 5} y={y - 20} width={3} height={40} />
                  <rect className="kit-block" x={x + 2} y={y - 20} width={3} height={40} />
                </g>
              )}
              {dots}
              <Label x={x} y={vert ? y + 38 : y + 40} kind="val">{label}</Label>
            </g>
          );
        };
        const bar = (x: number, v: number, name: string, yb: number) => (
          <g>
            <rect className="fig-cell" x={x} y={yb - (v / 5) * 70 * prog} width={26} height={(v / 5) * 70 * prog} />
            <Label x={x + 13} y={yb + 18} kind="sym">{name}</Label>
          </g>
        );
        return (
          <g>
            {series ? (
              <g>
                <Line x1={90} y1={60} x2={250} y2={60} tone="soft" />
                <Line x1={90} y1={190} x2={250} y2={190} tone="soft" />
                <Line x1={90} y1={60} x2={90} y2={110} tone="soft" />
                <Line x1={90} y1={190} x2={90} y2={150} tone="soft" />
                <Label x={64} y={134} kind="label" anchor="end">5 V</Label>
                {cap(250, 60, true, Q1, `C₁: Q = ${(Q1 * prog).toFixed(1)}`)}
                <Line x1={250} y1={65} x2={250} y2={128} tone="soft" />
                {cap(250, 190, true, Q2, `C₂: Q = ${(Q2 * prog).toFixed(1)}`)}
              </g>
            ) : (
              <g>
                <Line x1={90} y1={50} x2={310} y2={50} tone="soft" />
                <Line x1={90} y1={200} x2={310} y2={200} tone="soft" />
                <Line x1={90} y1={50} x2={90} y2={110} tone="soft" />
                <Line x1={90} y1={200} x2={90} y2={150} tone="soft" />
                <Label x={64} y={134} kind="label" anchor="end">5 V</Label>
                <Line x1={170} y1={50} x2={170} y2={92} tone="soft" />
                <Line x1={170} y1={200} x2={170} y2={156} tone="soft" />
                <Line x1={290} y1={50} x2={290} y2={92} tone="soft" />
                <Line x1={290} y1={200} x2={290} y2={156} tone="soft" />
                {cap(170, 124, false, Q1, `C₁: Q = ${(Q1 * prog).toFixed(1)}`)}
                {cap(290, 124, false, Q2, `C₂: Q = ${(Q2 * prog).toFixed(1)}`)}
              </g>
            )}
            {bar(430, V1 * prog, 'V₁', 190)}
            {bar(480, V2 * prog, 'V₂', 190)}
            <Label x={555} y={130} kind="val">{series ? 'V₁ + V₂ = 5' : 'V₁ = V₂ = 5'}</Label>
            <Readout>{series ? 'same Q, voltages add' : 'same V, charges add'}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** A charged capacitor shares its charge with an empty one: the voltage falls and energy is lost. */
export function ChargeSharing() {
  return (
    <Anim title="A charged capacitor is connected to an empty one; charge flows across until both are at the same voltage, lower than before, and part of the original energy is lost as heat and light in the spark" height={250} loop={10}>
      {(t) => {
        const sw = phase(t, 2, 2.4);
        const flow = ease(phase(t, 2.2, 5));
        const V1 = lerp(100, 40, flow);
        const V2 = lerp(0, 40, flow);
        const U = (0.5 * 4 * V1 * V1 + 0.5 * 6 * V2 * V2) * 1e-6; // joules, C in μF
        const ba = (x: number, v: number, c: number, name: string) => (
          <g>
            <rect className="kit-block" x={x} y={50} width={60} height={110} />
            <rect className="fig-cell is-lit" x={x} y={160 - (v / 100) * 110} width={60} height={(v / 100) * 110} />
            <Label x={x + 30} y={182} kind="val">{`${name} ${v.toFixed(0)} V`}</Label>
            <Label x={x + 30} y={202} kind="label">{`${c} μF`}</Label>
          </g>
        );
        const flowDots: ReactNode[] = [];
        if (flow > 0 && flow < 1) for (let k = 0; k < 5; k++) flowDots.push(<Dot key={k} x={lerp(240, 350, (t * 0.9 + k / 5) % 1)} y={105} q={1} r={2.8} />);
        return (
          <g>
            {ba(180, V1, 4, 'C₁')}
            {ba(360, V2, 6, 'C₂')}
            <Line x1={240} y1={105} x2={sw > 0 ? 360 : 296} y2={105} tone="soft" />
            {sw === 0 && <Line x1={296} y1={105} x2={310} y2={86} tone="soft" />}
            {flowDots}
            <Label x={470} y={90} kind="val" anchor="start">{`stored: ${(U * 1000).toFixed(1)} mJ`}</Label>
            <Label x={470} y={112} kind="val" anchor="start">{`was 20 mJ`}</Label>
            <Label x={470} y={140} kind="label" anchor="start">{flow >= 1 ? 'lost: 12 mJ (heat)' : 'charge conserved'}</Label>
            <Readout>{`Q total = 400 μC`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Energy per volume ½ε₀E²: the plates' field fills the gap with energy. */
export function EnergyDensity() {
  return (
    <Anim title="The field between charged plates fills the gap, and the brighter the field the more energy is stored in each cubic metre; the energy is a property of the field, not of the plates" height={200} loop={8}>
      {(t) => {
        const E = 0.55 + 0.45 * Math.sin(TAU * (t / 8));
        const px = 150, pw = 340, top = 40, bot = 150;
        const cells: ReactNode[] = [];
        for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) cells.push(<rect key={`${i}-${j}`} x={px + 4 + i * 28} y={top + 8 + j * 26} width={24} height={22} fill="#fff" style={{ opacity: 0.05 + 0.38 * E * E }} />);
        return (
          <g>
            <rect className="kit-block is-filled" x={px} y={top - 6} width={pw} height={6} />
            <rect className="kit-block" x={px} y={bot} width={pw} height={6} />
            {cells}
            {[0, 1, 2, 3, 4].map((i) => <Arrow key={i} x1={px + 40 + i * 64} y1={top + 8} x2={px + 40 + i * 64} y2={top + 8 + 20 + 62 * E} tone="soft" width={1 + 1.4 * E} />)}
            <Label x={px + pw / 2} y={186} kind="val">{`u = ½ ε₀ E² = ${(E * E).toFixed(2)} u₀`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

