import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Block, Label, Line, Readout, Trail, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for moving charges and magnetism. Every mark moves a little, even the field symbols. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

/** Sample f(s) for s in [0, span] into points. */
function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

/** The point a fraction s (0 to 1) of the way along a polyline. */
function along(pts: Pt[], s: number): Pt {
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    lens.push(d);
    total += d;
  }
  let want = (((s % 1) + 1) % 1) * total;
  for (let i = 0; i < lens.length; i++) {
    if (want <= lens[i]) {
      const p = want / (lens[i] || 1);
      return [lerp(pts[i][0], pts[i + 1][0], p), lerp(pts[i][1], pts[i + 1][1], p)];
    }
    want -= lens[i];
  }
  return pts[pts.length - 1];
}

/** First-order response of a pointer to a stepped target. steps: [time, target] pairs in order. */
function respond(t: number, steps: [number, number][], tau: number): number {
  let v = 0;
  for (let i = 0; i < steps.length; i++) {
    const [t0, target] = steps[i];
    if (t < t0) break;
    const t1 = i + 1 < steps.length ? Math.min(t, steps[i + 1][0]) : t;
    v = target + (v - target) * Math.exp(-(t1 - t0) / tau);
  }
  return v;
}

const pulse = (t: number, k = 0, p = 2.4) => 0.5 + 0.3 * Math.sin((TAU * t) / p + k);

/** A field line into the page, drawn as a cross in a circle. */
function Into({ x, y, s = 5, o = 1 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g style={{ opacity: o }}>
      <circle className="fig-guide" cx={x} cy={y} r={s * 1.7} fill="none" />
      <line className="fig-guide" x1={x - s} y1={y - s} x2={x + s} y2={y + s} />
      <line className="fig-guide" x1={x - s} y1={y + s} x2={x + s} y2={y - s} />
    </g>
  );
}

/** A field line out of the page, drawn as a dot in a circle. */
function Out({ x, y, s = 5, o = 1 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g style={{ opacity: o }}>
      <circle className="fig-guide" cx={x} cy={y} r={s * 1.7} fill="none" />
      <circle className="fig-ball" cx={x} cy={y} r={s * 0.5} />
    </g>
  );
}

/** A grid of into-the-page marks that breathe gently. */
function IntoGrid({ x1, y1, x2, y2, gap = 36, t }: { x1: number; y1: number; x2: number; y2: number; gap?: number; t: number }) {
  const out: ReactNode[] = [];
  let i = 0;
  for (let y = y1; y <= y2; y += gap) for (let x = x1; x <= x2; x += gap) out.push(<Into key={`${x}-${y}`} x={x} y={y} s={4} o={0.25 + 0.5 * pulse(t, i++ * 0.7)} />);
  return <g>{out}</g>;
}

// ------------------------------------------------------------------ a current turns compasses

export function Oersted() {
  return (
    <Anim title="Compass needles all point the same way until a current flows in the wire; then they swing round to circle the wire, and swing the other way when the current is reversed" height={240} loop={8}>
      {(t) => {
        const on = ease(phase(t, 1.4, 2.4)) * (1 - ease(phase(t, 6, 7)));
        const panels: [number, boolean][] = [
          [170, true],
          [470, false],
        ];
        return (
          <g>
            {panels.map(([cx, into]) => {
              const cy = 118;
              return (
                <g key={cx}>
                  {into ? <Into x={cx} y={cy} s={9} o={0.5 + 0.5 * on} /> : <Out x={cx} y={cy} s={9} o={0.5 + 0.5 * on} />}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                    const phi = (i * TAU) / 8 + 0.4;
                    const R = 78;
                    const px = cx + R * Math.cos(phi);
                    const py = cy + R * Math.sin(phi);
                    // Earth's weak field points up the screen; the wire's field circles the wire.
                    const sg = into ? 1 : -1;
                    const ux = 0 + sg * on * 3 * -Math.sin(phi);
                    const uy = -1 + sg * on * 3 * Math.cos(phi);
                    const n = Math.hypot(ux, uy);
                    const dx = ux / n, dy = uy / n;
                    return <Arrow key={i} x1={px - dx * 13} y1={py - dy * 13} x2={px + dx * 13} y2={py + dy * 13} width={3} />;
                  })}
                  <Label x={cx} y={228} kind="label">{into ? 'current into the page' : 'current out of the page'}</Label>
                </g>
              );
            })}
            <Readout x={W - 14} y={20}>{on < 0.05 ? 'no current' : 'current on'}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the force on a moving charge

export function ForceAngle() {
  return (
    <Anim title="A velocity arrow swings round against a fixed field line; the force on the charge is largest when they are at right angles and zero when they are along each other, tracing a sine curve" height={240} loop={8}>
      {(t) => {
        const th = Math.PI * (0.5 - 0.5 * Math.cos((TAU * t) / 8));
        const ox = 120, oy = 125, L = 90;
        const vx = ox + L * Math.cos(th), vy = oy - L * Math.sin(th);
        const gx = 340, gw = 260, gh = 80, gy = 190;
        const k = th / Math.PI;
        return (
          <g>
            <Arrow x1={ox - 40} y1={oy} x2={ox + 110} y2={oy} tone="soft" label="B" />
            <Arrow x1={ox} y1={oy} x2={vx} y2={vy} label="v" />
            <path className="fig-guide" d={`M${ox + 34} ${oy}A34 34 0 0 0 ${ox + 34 * Math.cos(th)} ${oy - 34 * Math.sin(th)}`} fill="none" />
            <Label x={ox + 52} y={oy - 10} kind="sym">θ</Label>
            <Line x1={vx} y1={vy} x2={vx} y2={oy} tone="soft" dashed />
            <Line x1={ox} y1={oy + 12} x2={vx} y2={oy + 12} tone="soft" />
            <Label x={ox + (vx - ox) / 2} y={oy + 30} kind="label">v cos θ (along B)</Label>
            <Label x={vx + 8} y={oy - (oy - vy) / 2} kind="label" anchor="start">v sin θ</Label>
            <Axes x={gx} y={gy} w={gw} h={gh + 18} xLabel="θ" yLabel="F" />
            <Trail points={curve(60, th, (u) => [gx + (u / Math.PI) * (gw - 20), gy - gh * Math.sin(u)])} />
            <Line x1={gx + k * (gw - 20)} y1={gy} x2={gx + k * (gw - 20)} y2={gy - gh * Math.sin(th)} tone="soft" dashed />
            <Ball x={gx + k * (gw - 20)} y={gy - gh * Math.sin(th)} r={5} />
            <Label x={gx + gw - 24} y={gy + 16} kind="label">π</Label>
            <Label x={gx + (gw - 20) / 2} y={gy - gh - 10} kind="sym">F = q v B sin θ</Label>
            <Readout x={W - 14} y={20}>{`θ = ${((th * 180) / Math.PI).toFixed(0)}°`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** A positive and a negative charge enter a field into the page and curve opposite ways. */
export function Lorentz() {
  return (
    <Anim title="A positive and a negative charge move in from the left into a magnetic field pointing into the page; the force is always sideways to the velocity, so the paths curve in opposite directions" height={250} loop={6}>
      {(t) => {
        const y0 = 125, R = 55, v = 116, xe = 200;
        const tin = (xe - 50) / v;
        const tau = Math.max(0, t - 0.4);
        const pos = (sg: number, tt: number): Pt => {
          if (tt <= tin) return [50 + v * tt, y0];
          const psi = Math.min(Math.PI, (v / R) * (tt - tin));
          const ex = tt - tin - (Math.PI * R) / v;
          return [xe + R * Math.sin(psi) - (ex > 0 ? v * ex : 0), y0 - sg * R * (1 - Math.cos(psi))];
        };
        const tmax = tin + (Math.PI * R) / v + 0.35;
        const one = (sg: number) => {
          const tt = Math.min(tau, tmax);
          const [bx, by] = pos(sg, tt);
          const inside = tt > tin && tt < tin + (Math.PI * R) / v;
          const psi = (v / R) * (tt - tin);
          const dvx = inside ? Math.cos(psi) : tt <= tin ? 1 : -1;
          const dvy = inside ? sg * -Math.sin(psi) : 0;
          const trail: Pt[] = [];
          for (let i = 0; i <= 60; i++) trail.push(pos(sg, (tt * i) / 60));
          return (
            <g key={sg}>
              <Trail points={trail} tone={sg > 0 ? 'bright' : 'soft'} />
              <Ball x={bx} y={by} r={7} />
              <Label x={bx - 12} y={by - 12} kind="sym">{sg > 0 ? '+' : '−'}</Label>
              <Arrow x1={bx} y1={by} x2={bx + 36 * dvx} y2={by + 36 * dvy} tone="soft" label="v" />
              {inside && <Arrow x1={bx} y1={by} x2={bx - 34 * Math.sin(psi)} y2={by - sg * 34 * Math.cos(psi)} label="F" />}
            </g>
          );
        };
        return (
          <g>
            <rect className="fig-guide" x={xe} y={14} width={W - xe - 16} height={222} fill="none" strokeDasharray="5 5" />
            <IntoGrid x1={xe + 40} y1={36} x2={W - 36} y2={228} gap={42} t={t} />
            <Label x={W - 24} y={30} kind="sym" anchor="end">B</Label>
            {one(1)}
            {one(-1)}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ circles and spirals

export function CircleOrbits() {
  return (
    <Anim title="Three charges of the same kind with different speeds travel round circles of different sizes, but they all come back to the starting line at exactly the same moment" height={250} loop={6}>
      {(t) => {
        const cx = 190, cy = 125, T = 3;
        const rs = [34, 68, 102];
        const flash = Math.abs(((t % T) / T) - 0.5) > 0.47 ? 1 : 0;
        return (
          <g>
            <IntoGrid x1={cx - 126} y1={cy - 126} x2={cx + 126} y2={cy + 126} gap={42} t={t} />
            <Line x1={cx} y1={cy} x2={cx + 120} y2={cy} tone="soft" dashed />
            {rs.map((r, i) => {
              const a = (TAU * t) / T;
              const bx = cx + r * Math.cos(a), by = cy - r * Math.sin(a);
              return (
                <g key={r}>
                  <circle className="fig-guide" cx={cx} cy={cy} r={r} fill="none" />
                  <Trail points={curve(30, 1.1, (u) => [cx + r * Math.cos(a - u), cy - r * Math.sin(a - u)])} />
                  <Ball x={bx} y={by} r={6} />
                  <Label x={cx + r + 6} y={cy - 6} kind="label" anchor="start">{`${i + 1}v`}</Label>
                </g>
              );
            })}
            <circle className="fig-glow" cx={cx + 102} cy={cy} r={12} fill="none" stroke="#fff" strokeOpacity={flash} />
            <Label x={470} y={90} kind="sym">r = m v / q B</Label>
            <Label x={470} y={122} kind="sym">T = 2 π m / q B</Label>
            <Label x={470} y={160} kind="label">faster means a wider circle,</Label>
            <Label x={470} y={180} kind="label">but the same time round</Label>
            <Readout x={W - 14} y={20}>{`t = ${(t % T).toFixed(1)} s of T = 3 s`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function Helix() {
  return (
    <Anim title="A charge moving at an angle to the field spirals along the field lines like a spring; the pitch is the distance it moves along the field in one turn" height={240} loop={8}>
      {(t) => {
        const x0 = 50, yc = 120, r = 52, p = 110, Tt = 1.6;
        const pt = (u: number): Pt => {
          const a = (TAU * u) / Tt;
          return [x0 + (p * u) / Tt + 16 * Math.cos(a), yc - r * Math.sin(a)];
        };
        const tt = Math.min(t, 4.6 * Tt - 0.1) * 0.9 + 0.2;
        const [bx, by] = pt(tt);
        const a1 = Math.floor(tt / Tt) * Tt;
        const [p1x] = pt(a1 + Tt * 0.25);
        const [p2x] = pt(a1 + Tt * 1.25);
        return (
          <g>
            <Arrow x1={20} y1={218} x2={170} y2={218} tone="soft" label="B" />
            <Trail points={curve(240, tt, pt)} />
            <Ball x={bx} y={by} r={7} />
            <Arrow x1={bx} y1={by} x2={bx + 40} y2={by} tone="soft" label="v∥" />
            <Line x1={p1x} y1={30} x2={p1x} y2={44} tone="soft" />
            <Line x1={p2x} y1={30} x2={p2x} y2={44} tone="soft" />
            <Line x1={p1x} y1={37} x2={p2x} y2={37} tone="soft" />
            <Label x={(p1x + p2x) / 2} y={24} kind="label">pitch</Label>
            <Label x={470} y={218} kind="label">v∥ is untouched; v⊥ goes round a circle</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ crossed fields

export function Selector() {
  return (
    <Anim title="Three charges enter a region of crossed electric and magnetic fields at three speeds; the slow one is pushed along the electric force, the fast one along the magnetic force, and only the one with speed E over B goes straight" height={250} loop={6}>
      {(t) => {
        const xs = 110, xe = 520, y0 = 125, v0 = 160, k = 0.225;
        const ps: [number, string][] = [
          [120, 'too slow'],
          [v0, 'v = E / B'],
          [250, 'too fast'],
        ];
        const path = (v: number, tau: number): Pt => {
          const T = (xe - xs) / v;
          const a = k * (v - v0);
          const te = Math.min(tau, T);
          const y = y0 - 0.5 * a * te * te + (tau > T ? -a * T * (tau - T) * 0.3 : 0);
          return [xs + v * tau, y];
        };
        const tau = Math.max(0, t - 0.5);
        return (
          <g>
            <Line x1={xs} y1={36} x2={xe} y2={36} tone="bright" />
            <Line x1={xs} y1={214} x2={xe} y2={214} tone="bright" />
            <Label x={xs - 8} y={40} kind="sym" anchor="end">+</Label>
            <Label x={xs - 8} y={218} kind="sym" anchor="end">−</Label>
            {[0, 1, 2, 3, 4].map((i) => (
              <Arrow key={i} x1={160 + i * 80} y1={46 + 4 * Math.sin(TAU * (t / 1.6 - i * 0.2))} x2={160 + i * 80} y2={74 + 4 * Math.sin(TAU * (t / 1.6 - i * 0.2))} tone="soft" />
            ))}
            <Label x={xe + 14} y={60} kind="sym" anchor="start">E</Label>
            <IntoGrid x1={150} y1={96} x2={500} y2={200} gap={52} t={t} />
            <Label x={xe + 14} y={200} kind="sym" anchor="start">B</Label>
            {ps.map(([v, name], i) => {
              const pts = curve(50, Math.min(tau, (xe - xs) / v + 0.4), (u) => path(v, u));
              const [bx, by] = path(v, tau);
              return (
                <g key={name}>
                  <Trail points={pts} tone={i === 1 ? 'bright' : 'soft'} dashed={i !== 1} />
                  <Ball x={bx} y={by} r={5.5} />
                </g>
              );
            })}
            <Label x={xs - 6} y={y0 - 6} kind="label" anchor="end">in</Label>
            <Readout x={W - 14} y={20}>net force zero when q E = q v B</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function Cyclotron() {
  return (
    <Anim title="A charge spirals outward inside two hollow D-shaped halves; each time it crosses the gap the electric field points the way it is going and gives it a kick, so it speeds up and the circles grow" height={260} loop={9}>
      {(t) => {
        const cx = 320, cy = 130, R = 112, g = 11, r0 = 34;
        const th = Math.min(8 * Math.PI, (TAU * Math.max(0, t - 0.3)) / 1.1);
        const rr = (a: number) => r0 * Math.sqrt(1 + a / Math.PI);
        const P = (a: number): Pt => [cx + rr(a) * Math.cos(a + Math.PI / 2), cy - rr(a) * Math.sin(a + Math.PI / 2)];
        const [bx, by] = P(th);
        const dir = Math.sin(th + Math.PI / 2) > 0 ? -1 : 1;
        const near = Math.abs(Math.cos(th + Math.PI / 2)) < 0.25 ? 1 : 0.35;
        return (
          <g>
            <path className="fig-guide" d={`M${cx - g} ${cy - R}A${R} ${R} 0 0 0 ${cx - g} ${cy + R}Z`} fill="none" />
            <path className="fig-guide" d={`M${cx + g} ${cy - R}A${R} ${R} 0 0 1 ${cx + g} ${cy + R}Z`} fill="none" />
            <IntoGrid x1={cx - 84} y1={cy - 84} x2={cx + 84} y2={cy + 84} gap={56} t={t} />
            <Arrow x1={cx - dir * 7} y1={cy - 6} x2={cx + dir * 7} y2={cy - 6} width={3} />
            <Arrow x1={cx - dir * 7} y1={cy + 12} x2={cx + dir * 7} y2={cy + 12} width={3} />
            <Label x={cx} y={cy - R - 10} kind="label">gap field flips every half turn</Label>
            <Trail points={curve(260, th, P)} />
            <Ball x={bx} y={by} r={6.5} />
            <circle className="fig-glow" cx={cx} cy={cy} r={20 * near} fill="none" stroke="#fff" strokeOpacity={near - 0.3} />
            <Label x={110} y={92} kind="label">ions in</Label>
            <Label x={530} y={92} kind="label">beam out</Label>
            <Readout x={W - 14} y={20}>{`${Math.max(0, Math.floor((th + Math.PI / 2) / Math.PI))} kicks`}</Readout>
            <Label x={cx} y={250} kind="sym">f = q B / 2 π m, the same every turn</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ force on a wire

export function RodForce() {
  return (
    <Anim title="A straight rod lying across two rails carries a current in a field pointing into the page; it is pushed sideways, and when the current is reversed it is pushed back the other way" height={230} loop={7}>
      {(t) => {
        const yA = 60, yB = 170, a = 97;
        let x = 480, up = true;
        if (t > 0.5 && t < 3.1) x = 480 - 0.5 * a * (t - 0.5) ** 2;
        else if (t >= 3.1 && t < 3.6) x = 480 - 0.5 * a * 2.6 ** 2;
        else if (t >= 3.6 && t < 6.2) {
          up = false;
          x = 480 - 0.5 * a * 2.6 ** 2 + 0.5 * a * (t - 3.6) ** 2;
        } else if (t >= 6.2) {
          up = false;
          x = 480;
        }
        const moving = (t > 0.5 && t < 3.1) || (t > 3.6 && t < 6.2);
        const sgn = up ? -1 : 1;
        return (
          <g>
            <Line x1={60} y1={yA} x2={560} y2={yA} tone="bright" />
            <Line x1={60} y1={yB} x2={560} y2={yB} tone="bright" />
            <IntoGrid x1={110} y1={95} x2={520} y2={135} gap={48} t={t} />
            <Block x={x} y={(yA + yB) / 2} w={9} h={yB - yA + 8} filled />
            <Arrow x1={x + 16} y1={up ? yB - 12 : yA + 12} x2={x + 16} y2={up ? yA + 14 : yB - 14} label="I" />
            {moving && <Arrow x1={x} y1={(yA + yB) / 2 + 34} x2={x + sgn * 58} y2={(yA + yB) / 2 + 34} label="F" />}
            <Label x={36} y={(yA + yB) / 2 + 5} kind="sym">B ⊗</Label>
            <Readout x={W - 14} y={20}>{up ? 'current up: pushed left' : 'current down: pushed right'}</Readout>
            <Label x={310} y={218} kind="sym">F = I L B sin θ, along L × B</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ Biot-Savart

export function BiotSavart() {
  return (
    <Anim title="A small piece of current slides along a long straight wire; the field it makes at a fixed point P is biggest when the piece is right opposite P and dies away as it moves off, and the graph below adds the pieces up" height={300} loop={8}>
      {(t) => {
        const px = 320, py = 62, wy = 150, d = wy - py;
        const u = ease(phase(t, 0.5, 6.5));
        const xe = 50 + u * 540;
        const r = Math.hypot(xe - px, d);
        const f = (x: number) => d ** 3 / Math.hypot(x - px, d) ** 3;
        const gy = 285, gh = 78;
        const pts = (to: number) => curve(80, to - 50, (s) => [50 + s, gy - gh * f(50 + s)]);
        return (
          <g>
            <Line x1={40} y1={wy} x2={600} y2={wy} tone="bright" />
            <Block x={xe} y={wy} w={20} h={8} filled />
            <Arrow x1={xe + 14} y1={wy - 12} x2={xe + 44} y2={wy - 12} tone="soft" label="I dl" />
            <Line x1={xe} y1={wy - 4} x2={px} y2={py + 8} tone="soft" dashed />
            <Label x={(xe + px) / 2 + 12} y={(wy + py) / 2 - 4} kind="sym">r</Label>
            <Out x={px} y={py} s={3 + 9 * f(xe)} />
            <Label x={px + 28} y={py + 4} kind="label" anchor="start">P: dB out of the page</Label>
            <Axes x={50} y={gy} w={560} h={gh + 18} xLabel="position of the piece" yLabel="dB" />
            <Trail points={pts(50 + 540)} tone="soft" />
            <Trail points={pts(xe)} />
            <Ball x={xe} y={gy - gh * f(xe)} r={5} />
            <Line x1={xe} y1={gy} x2={xe} y2={gy - gh * f(xe)} tone="soft" dashed />
            <Readout x={W - 14} y={20}>{`dB = ${(f(xe) * 100).toFixed(0)}% of the biggest`}</Readout>
            <Label x={px - 6} y={112} kind="label" anchor="end">{`sin θ = ${(d / r).toFixed(2)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function WireField() {
  return (
    <Anim title="Rings of field circle a long straight wire carrying a current out of the page; the arrows move faster on the inner rings, so the field falls off in proportion to one over the distance" height={250} loop={8}>
      {(t) => {
        const cx = 200, cy = 125;
        const radii = [30, 60, 90, 118];
        return (
          <g>
            {radii.map((r, i) => (
              <g key={r}>
                <circle className="fig-guide" cx={cx} cy={cy} r={r} fill="none" />
                {[0, 1, 2].map((j) => {
                  const a = (j * TAU) / 3 + (t * 90) / (r * r) * 30 * 0.1 * 2.2 + i * 0.4;
                  const px = cx + r * Math.cos(a), py = cy - r * Math.sin(a);
                  const tx = -Math.sin(a), ty = -Math.cos(a);
                  return <Arrow key={j} x1={px - tx * 7} y1={py - ty * 7} x2={px + tx * 7} y2={py + ty * 7} width={3} />;
                })}
              </g>
            ))}
            <Out x={cx} y={cy} s={7} o={0.6 + 0.4 * Math.sin(TAU * t / 2)} />
            <Line x1={cx} y1={cy} x2={cx + 60} y2={cy} tone="bright" />
            <Line x1={cx} y1={cy + 10} x2={cx + 120} y2={cy + 10} tone="bright" />
            <Label x={cx + 30} y={cy - 6} kind="sym">d</Label>
            <Label x={cx + 90} y={cy + 28} kind="sym">2d</Label>
            <Label x={450} y={90} kind="sym">B = μ₀ I / 2 π d</Label>
            <Label x={450} y={130} kind="label">at d: B</Label>
            <Label x={450} y={152} kind="label">at 2d: B / 2</Label>
            <Label x={450} y={174} kind="label">at 4d: B / 4</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function LoopField() {
  return (
    <Anim title="A circular loop of current seen edge-on; a point slides along the axis, and the graph below shows the field is biggest at the centre of the loop and falls away on both sides" height={270} loop={8}>
      {(t) => {
        const cx = 320, cy = 66, R = 50;
        const u = ease(phase(t, 0.4, 7));
        const x = 50 + u * 540;
        const B = (xx: number) => 1 / (1 + ((xx - cx) / R) ** 2) ** 1.5;
        const gy = 255, gh = 82;
        return (
          <g>
            <Line x1={40} y1={cy} x2={600} y2={cy} tone="soft" dashed />
            <ellipse className="fig-guide" cx={cx} cy={cy} rx={11} ry={R} fill="none" />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = (TAU * (i / 6 + t / 3));
              return <Ball key={i} x={cx + 11 * Math.cos(a)} y={cy - R * Math.sin(a)} r={3} glow={false} />;
            })}
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => {
              const ax = cx + i * 56;
              return <Arrow key={i} x1={ax - 12 * B(ax) - 4} y1={cy + 18} x2={ax + 12 * B(ax) + 4} y2={cy + 18} tone="soft" />;
            })}
            <Ball x={x} y={cy} r={5} />
            <Label x={cx + 24} y={cy - R - 10} kind="label">current loop, radius R</Label>
            <Axes x={50} y={gy} w={560} h={gh + 16} xLabel="x" yLabel="B" />
            <Trail points={curve(100, 540, (s) => [50 + s, gy - gh * B(50 + s)])} tone="soft" />
            <Trail points={curve(100, x - 50, (s) => [50 + s, gy - gh * B(50 + s)])} />
            <Ball x={x} y={gy - gh * B(x)} r={5} />
            <Line x1={x} y1={gy} x2={x} y2={gy - gh * B(x)} tone="soft" dashed />
            <Readout x={W - 14} y={20}>{`B = ${(B(x) * 100).toFixed(0)}% of the centre value`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ Ampere's law

export function Ampere() {
  return (
    <Anim title="A probe goes once round three closed paths: one around a single wire, one around two wires, and one around no wire at all; only the current inside each path counts" height={250} loop={9}>
      {(t) => {
        const a = ((TAU * (t % 3)) / 3) % TAU;
        const panels: { cx: number; wires: Pt[]; name: string }[] = [
          { cx: 110, wires: [[0, 0]], name: 'μ₀ I' },
          { cx: 320, wires: [[-18, 0], [18, 0]], name: 'μ₀ (I₁ + I₂)' },
          { cx: 530, wires: [[78, 0]], name: '0' },
        ];
        const cy = 110, R = 55;
        return (
          <g>
            {panels.map((p, i) => {
              const bx = p.cx + R * Math.cos(a), by = cy - R * Math.sin(a);
              return (
                <g key={i}>
                  <circle className="fig-guide fig-dash" cx={p.cx} cy={cy} r={R} fill="none" />
                  <Trail points={curve(30, a, (u) => [p.cx + R * Math.cos(u), cy - R * Math.sin(u)])} />
                  {p.wires.map(([dx], j) => (
                    <Out key={j} x={p.cx + dx} y={cy} s={5} o={0.6 + 0.35 * Math.sin(TAU * t / 2 + j)} />
                  ))}
                  <Arrow x1={bx} y1={by} x2={bx - 18 * Math.sin(a)} y2={by - 18 * Math.cos(a)} tone="soft" />
                  <Ball x={bx} y={by} r={4.5} />
                  <Label x={p.cx} y={196} kind="label">{i === 0 ? 'one wire inside' : i === 1 ? 'two wires inside' : 'wire outside'}</Label>
                  <Label x={p.cx} y={222} kind="sym">{`∮ B · dl = ${p.name}`}</Label>
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

export function Solenoid() {
  return (
    <Anim title="A long solenoid cut in half: current comes out of the page along the top turns and goes into it along the bottom turns; inside, the field is strong and straight, and outside it is almost nothing" height={250} loop={8}>
      {(t) => {
        const x1 = 120, x2 = 520, yt = 70, yb = 170, ym = 120;
        const n = 11;
        const rect = [
          [x1 + 100, ym - 40],
          [x2 - 100, ym - 40],
          [x2 - 100, yt - 38],
          [x1 + 100, yt - 38],
          [x1 + 100, ym - 40],
        ] as Pt[];
        const [rx, ry] = along([[x1 + 130, yt + 22], [x2 - 130, yt + 22], [x2 - 130, yt - 24], [x1 + 130, yt - 24], [x1 + 130, yt + 22]], (t / 6) % 1);
        return (
          <g>
            {Array.from({ length: n }, (_, i) => {
              const x = x1 + 20 + (i * (x2 - x1 - 40)) / (n - 1);
              return (
                <g key={i}>
                  <Out x={x} y={yt} s={4.5} o={0.35 + 0.5 * pulse(t, -i * 0.5, 1.8)} />
                  <Into x={x} y={yb} s={4.5} o={0.35 + 0.5 * pulse(t, -i * 0.5, 1.8)} />
                </g>
              );
            })}
            {[0, 1, 2, 3, 4].map((lane) =>
              [0, 1, 2, 3].map((j) => {
                const y = yt + 14 + lane * 18;
                const px = x1 + 20 + (((t * 90 + j * 100 + lane * 20) % 400) / 400) * (x2 - x1 - 40);
                return <Arrow key={`${lane}-${j}`} x1={px - 9} y1={y} x2={px + 9} y2={y} width={3} />;
              }),
            )}
            {[-1, 1].map((sg) => (
              <path key={sg} className="fig-guide fig-faint" d={`M${x2 + 4} ${ym}C${x2 + 60} ${ym + sg * 70} ${x2 - 10} ${ym + sg * 110} ${ym + 160} ${ym + sg * 112}L${x1 + 40} ${ym + sg * 112}C${x1 - 70} ${ym + sg * 110} ${x1 - 60} ${ym + sg * 60} ${x1 - 4} ${ym}`} fill="none" strokeDasharray="4 6" strokeDashoffset={-t * 14} />
            ))}
            <Trail points={rect.map(([a, b]) => [a + 30, b + 0] as Pt)} tone="soft" dashed />
            <Ball x={rx} y={ry} r={4.5} />
            <Label x={x1 + 150} y={yt - 28} kind="label">Ampère loop</Label>
            <Label x={x2 + 20} y={ym + 4} kind="sym" anchor="start">B</Label>
            <Label x={320} y={236} kind="sym">B = μ₀ n I inside, about 0 outside</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Toroid() {
  return (
    <Anim title="A toroid is a solenoid bent into a ring; the field runs round inside the ring, and is zero in the hole and outside the ring" height={260} loop={8}>
      {(t) => {
        const cx = 210, cy = 130, r1 = 58, r2 = 108, rm = 83;
        return (
          <g>
            <circle className="fig-guide" cx={cx} cy={cy} r={r1} fill="none" />
            <circle className="fig-guide" cx={cx} cy={cy} r={r2} fill="none" />
            {Array.from({ length: 28 }, (_, i) => {
              const a = (i * TAU) / 28;
              const o = 0.25 + 0.5 * pulse(t, -i * 0.6, 2);
              return <line key={i} className="fig-guide" style={{ opacity: o }} x1={cx + r1 * Math.cos(a)} y1={cy - r1 * Math.sin(a)} x2={cx + r2 * Math.cos(a)} y2={cy - r2 * Math.sin(a)} />;
            })}
            <circle className="fig-guide fig-dash" cx={cx} cy={cy} r={rm} fill="none" />
            {[0, 1, 2, 3, 4, 5].map((j) => {
              const a = (j * TAU) / 6 + (TAU * t) / 4;
              const px = cx + rm * Math.cos(a), py = cy - rm * Math.sin(a);
              return <Arrow key={j} x1={px + 9 * Math.sin(a)} y1={py + 9 * Math.cos(a)} x2={px - 9 * Math.sin(a)} y2={py - 9 * Math.cos(a)} width={3.5} />;
            })}
            <Label x={cx} y={cy + 6} kind="label">B = 0</Label>
            <Label x={cx + r2 + 6} y={cy - r2 + 24} kind="label" anchor="start">B = 0</Label>
            <Label x={470} y={80} kind="sym">B = μ₀ N I / 2 π r</Label>
            <Label x={470} y={116} kind="label">r = mean radius of the ring</Label>
            <Label x={470} y={146} kind="label">N = total turns</Label>
            <Label x={470} y={176} kind="label">the field is trapped in the ring</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ wires pulling on each other

export function ParallelWires() {
  return (
    <Anim title="Two long wires with currents in the same direction drift toward each other; with the currents in opposite directions they drift apart" height={250} loop={8}>
      {(t) => {
        const s = ease(Math.abs(((t % 8) / 8) * 2 - 1));
        const sw = 1 - s;
        const cy = 110;
        const panels: [number, boolean, string][] = [
          [160, true, 'same direction: attract'],
          [480, false, 'opposite directions: repel'],
        ];
        return (
          <g>
            {panels.map(([cx, same, name]) => {
              const d = same ? 100 - 55 * sw : 55 + 45 * sw;
              const F = 6000 / d;
              const xa = cx - d / 2, xb = cx + d / 2;
              return (
                <g key={name}>
                  <Out x={xa} y={cy} s={8} />
                  {same ? <Out x={xb} y={cy} s={8} /> : <Into x={xb} y={cy} s={8} />}
                  <Arrow x1={xa + (same ? 14 : -14)} y1={cy + 40} x2={xa + (same ? 14 + F * 0.3 : -14 - F * 0.3)} y2={cy + 40} label="F" />
                  <Arrow x1={xb + (same ? -14 : 14)} y1={cy + 40} x2={xb + (same ? -14 - F * 0.3 : 14 + F * 0.3)} y2={cy + 40} label="F" />
                  <Line x1={xa} y1={cy - 36} x2={xb} y2={cy - 36} tone="soft" />
                  <Label x={cx} y={cy - 44} kind="sym">d</Label>
                  <Label x={cx} y={206} kind="label">{name}</Label>
                </g>
              );
            })}
            <Label x={320} y={236} kind="sym">F / L = μ₀ I₁ I₂ / 2 π d</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ torque on a coil

export function LoopTorque() {
  return (
    <Anim title="A coil carrying a current hangs in a field; the forces on its two sides form a couple that turns the coil until its face is square to the field, and the turning effect shrinks as it gets there" height={250} loop={8}>
      {(t) => {
        const cx = 210, cy = 120, w = 110;
        const beta = 1.35 * Math.cos((TAU * t) / 8) * Math.exp(-0.0);
        const dx = (w / 2) * Math.sin(beta), dy = (w / 2) * Math.cos(beta);
        const ex1: Pt = [cx + dx, cy - dy], ex2: Pt = [cx - dx, cy + dy];
        const F = 46 * Math.abs(1);
        return (
          <g>
            {[-70, -35, 0, 35, 70].map((o, i) => (
              <Arrow key={i} x1={40 + 12 * Math.sin(TAU * (t / 2 - i * 0.1))} y1={cy + o * 1.3} x2={96 + 12 * Math.sin(TAU * (t / 2 - i * 0.1))} y2={cy + o * 1.3} tone="soft" />
            ))}
            <Label x={50} y={30} kind="sym">B</Label>
            <Line x1={ex1[0]} y1={ex1[1]} x2={ex2[0]} y2={ex2[1]} tone="bright" />
            <Out x={ex1[0]} y={ex1[1]} s={4} />
            <Into x={ex2[0]} y={ex2[1]} s={4} />
            <Arrow x1={ex1[0] + 18} y1={ex1[1]} x2={ex1[0] + 18} y2={ex1[1] - F} label="F" />
            <Arrow x1={ex2[0] - 18} y1={ex2[1]} x2={ex2[0] - 18} y2={ex2[1] + F} label="F" />
            <Ball x={cx} y={cy} r={4} />
            <Arrow x1={cx} y1={cy} x2={cx + 60 * Math.cos(beta)} y2={cy - 60 * Math.sin(beta) * -1} tone="soft" label="n" />
            <Label x={470} y={80} kind="sym">τ = N I A B sin θ</Label>
            <Label x={470} y={112} kind="label">θ: angle between B and the normal n</Label>
            <Label x={470} y={142} kind="label">{`torque now: ${(Math.abs(Math.sin(beta)) * 100).toFixed(0)}% of the biggest`}</Label>
            <Label x={470} y={172} kind="sym">m = N I A</Label>
            <Readout x={W - 14} y={20}>{`θ = ${((Math.abs(beta) * 180) / Math.PI).toFixed(0)}°`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function Galvanometer() {
  return (
    <Anim title="A pointer on a dial swings further as the current in the coil rises; the pointer stops where the magnetic turning effect equals the opposing turning effect of the spring" height={260} loop={9}>
      {(t) => {
        const cx = 220, cy = 205, R = 130;
        const steps: [number, number][] = [[0.5, 0.4], [2.7, 0.9], [5, 0.2], [7, 0]];
        const I = (() => {
          const tg = steps.reduce((acc, [t0, v]) => (t >= t0 ? v : acc), 0);
          return tg;
        })();
        const phi = respond(t, steps, 0.35);
        const ang = (-60 + 120 * phi) * (Math.PI / 180);
        const tip: Pt = [cx + R * 0.9 * Math.sin(ang), cy - R * 0.9 * Math.cos(ang)];
        return (
          <g>
            <path className="fig-guide" d={`M${cx - R * Math.sin(Math.PI / 3)} ${cy - R * Math.cos(Math.PI / 3)}A${R} ${R} 0 0 1 ${cx + R * Math.sin(Math.PI / 3)} ${cy - R * Math.cos(Math.PI / 3)}`} fill="none" />
            {Array.from({ length: 11 }, (_, i) => {
              const a = ((-60 + 12 * i) * Math.PI) / 180;
              return <line key={i} className="fig-guide" x1={cx + R * Math.sin(a)} y1={cy - R * Math.cos(a)} x2={cx + (R - 10) * Math.sin(a)} y2={cy - (R - 10) * Math.cos(a)} />;
            })}
            <Line x1={cx} y1={cy} x2={tip[0]} y2={tip[1]} tone="bright" />
            <Ball x={cx} y={cy} r={6} />
            <Label x={cx - 100} y={cy - 64} kind="label">0</Label>
            <Label x={cx + 100} y={cy - 64} kind="label">full scale</Label>
            <Arrow x1={470} y1={100} x2={470 + 120 * I} y2={100} label="" />
            <Label x={470} y={84} kind="label" anchor="start">magnetic torque N I A B</Label>
            <Arrow x1={470} y1={170} x2={470 + 120 * phi} y2={170} tone="soft" />
            <Label x={470} y={154} kind="label" anchor="start">spring torque k φ</Label>
            <Label x={470} y={220} kind="label" anchor="start">{Math.abs(I - phi) < 0.03 ? 'equal: the pointer rests' : 'unequal: the pointer is moving'}</Label>
            <Readout x={W - 14} y={20}>{`I = ${(I * 2).toFixed(1)} mA`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function Meters() {
  return (
    <Anim title="Top: in an ammeter, almost all the current runs through the small shunt resistance in parallel with the galvanometer. Bottom: in a voltmeter, a large resistance in series takes almost all of the voltage" height={310} loop={7}>
      {(t) => {
        const wire = (pts: Pt[], n: number, sp: number, off = 0) =>
          Array.from({ length: n }, (_, i) => {
            const [x, y] = along(pts, (i / n + t * sp + off) % 1);
            return <Ball key={i} x={x} y={y} r={3.2} glow={false} />;
          });
        const sBranch: Pt[] = [[190, 70], [190, 100], [450, 100], [450, 70]];
        const main1: Pt[] = [[40, 70], [190, 70]];
        const main2: Pt[] = [[450, 70], [600, 70]];
        const vWire: Pt[] = [[40, 240], [600, 240]];
        const gy = 240;
        return (
          <g>
            <Line x1={40} y1={70} x2={190} y2={70} />
            <Line x1={450} y1={70} x2={600} y2={70} />
            <Line x1={190} y1={70} x2={190} y2={40} />
            <Line x1={190} y1={40} x2={450} y2={40} />
            <Line x1={450} y1={40} x2={450} y2={70} />
            <Line x1={190} y1={70} x2={190} y2={100} />
            <Line x1={190} y1={100} x2={450} y2={100} />
            <Line x1={450} y1={100} x2={450} y2={70} />
            <Block x={320} y={40} w={60} h={22} label="G" filled />
            <Block x={320} y={100} w={60} h={22} label="S" />
            <Label x={320} y={20} kind="label">galvanometer takes a trickle</Label>
            <Label x={320} y={136} kind="label">shunt takes the rest</Label>
            {wire(main1, 6, 0.28)}
            {wire(main2, 6, 0.28)}
            {wire([[190, 70], [190, 40], [450, 40], [450, 70]], 1, 0.12)}
            {wire(sBranch, 7, 0.28)}
            <Line x1={40} y1={gy} x2={600} y2={gy} />
            <Block x={190} y={gy} w={70} h={24} label="G" filled />
            <Block x={420} y={gy} w={150} h={24} label="R large" />
            {wire(vWire, 6, 0.2)}
            <Label x={190} y={gy - 24} kind="label">0.1 V</Label>
            <Label x={420} y={gy - 24} kind="label">9.9 V</Label>
            <Label x={320} y={290} kind="label">voltmeter: nearly all the voltage drops across R</Label>
            <Label x={320} y={168} kind="label">ammeter: G with a small S in parallel</Label>
            <line className="fig-guide fig-faint" x1={40} y1={185} x2={600} y2={185} />
            
          </g>
        );
      }}
    </Anim>
  );
}

/** Three small orientation cases for the right-hand rule: v, B and F always at right angles to each other. */
export function RightHand() {
  return (
    <Anim title="The force arrow, the velocity arrow and the field are drawn one after another so that each is at right angles to the other two" height={220} loop={7}>
      {(t) => {
        const cx = 320, cy = 120;
        const a = phase(t, 0.4, 1.6), b = phase(t, 2, 3), c = phase(t, 3.6, 5);
        return (
          <g>
            <Arrow x1={cx - 140} y1={cy} x2={cx - 140 + 130 * a} y2={cy} label="v" />
            <Label x={cx - 140} y={cy + 26} kind="label" anchor="start">1  velocity of the + charge</Label>
            <g style={{ opacity: b }}>
              <Into x={cx} y={cy} s={9} />
              <Label x={cx} y={cy + 44} kind="label">2  field B, into the page</Label>
            </g>
            <Arrow x1={cx + 140} y1={cy + 50} x2={cx + 140} y2={cy + 50 - 90 * c} label="F" />
            <Label x={cx + 140} y={cy + 74} kind="label">3  force: up</Label>
            <Label x={cx} y={30} kind="sym">F = q v × B</Label>
          </g>
        );
      }}
    </Anim>
  );
}
