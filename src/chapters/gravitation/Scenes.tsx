/**
 * Animated diagrams for the gravitation chapter. Every picture is driven by the
 * real physics: Kepler's equation for ellipses, the inverse-square law, and
 * small numerical integrations for the cannon and the escaping rockets.
 */
import { Anim, Arrow, Axes, Ball, Block, Ground, Label, Line, Readout, Trail, clamp, ease, lerp, phase } from '../kit/Anim';

const TAU = Math.PI * 2;
/** 0 → 1 → 0 smoothly over one loop. */
const tri = (t: number, loop: number) => (1 - Math.cos((TAU * t) / loop)) / 2;
type P = [number, number];

// ------------------------------------------------------------------ Kepler

const A = 200;
const EC = 0.75;
const B = A * Math.sqrt(1 - EC * EC);
const CX = 300;
const CY = 150;
const SUN: P = [CX + A * EC, CY];
const EMPTY: P = [CX - A * EC, CY];
/** Position on the ellipse a fraction f of a period after perihelion (Kepler's equation). */
export const keplerPos = (f: number): P => {
  const M = TAU * f;
  let u = M;
  for (let i = 0; i < 30; i++) u -= (u - EC * Math.sin(u) - M) / (1 - EC * Math.cos(u));
  return [CX + A * Math.cos(u), CY - B * Math.sin(u)];
};

export function EllipseScene() {
  return (
    <Anim title="A planet goes round an ellipse with the Sun at one focus; the two distances to the foci always add up to the same length" height={300} loop={10}>
      {(t) => {
        const p = keplerPos(t / 10);
        return (
          <>
            <ellipse className="fig-guide fig-dash" cx={CX} cy={CY} rx={A} ry={B} />
            <Line x1={EMPTY[0]} y1={EMPTY[1]} x2={p[0]} y2={p[1]} tone="soft" dashed />
            <Line x1={SUN[0]} y1={SUN[1]} x2={p[0]} y2={p[1]} tone="bright" />
            <Ball x={SUN[0]} y={SUN[1]} r={9} />
            <circle className="fig-ghost" cx={EMPTY[0]} cy={EMPTY[1]} r={4} />
            <Label x={SUN[0]} y={SUN[1] + 30} kind="label">Sun</Label>
            <Label x={EMPTY[0]} y={EMPTY[1] + 28} kind="label">empty focus</Label>
            <Ball x={p[0]} y={p[1]} r={6} />
            <Label x={(p[0] + SUN[0]) / 2 + 12} y={(p[1] + SUN[1]) / 2 - 8} kind="sym">r₁</Label>
            <Label x={(p[0] + EMPTY[0]) / 2 - 12} y={(p[1] + EMPTY[1]) / 2 - 8} kind="sym">r₂</Label>
            <Label x={CX + A + 36} y={CY + 5} kind="label">closest</Label>
            <Label x={CX - A - 38} y={CY + 5} kind="label">farthest</Label>
            <Readout>r₁ + r₂ = 2a, always</Readout>
          </>
        );
      }}
    </Anim>
  );
}

const wedge = (f0: number, f1: number) => {
  let d = `M${SUN[0]} ${SUN[1]}`;
  const n = 28;
  for (let i = 0; i <= n; i++) {
    const [x, y] = keplerPos(f0 + ((f1 - f0) * i) / n);
    d += `L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + 'Z';
};

export function AreasScene() {
  const W3 = [
    [0.0, 0.1],
    [0.25, 0.35],
    [0.45, 0.55],
  ];
  return (
    <Anim title="The line from the Sun to the planet sweeps out the same area in equal times: fat short wedge near the Sun, thin long wedge far away" height={300} loop={12}>
      {(t) => {
        const f = phase(t, 0.5, 11) ;
        const p = keplerPos(f);
        return (
          <>
            <ellipse className="fig-guide fig-dash fig-faint" cx={CX} cy={CY} rx={A} ry={B} />
            {W3.map(([a, b], i) => {
              const upto = clamp(f, a, b);
              if (upto <= a) return null;
              const done = f >= b;
              const mid = keplerPos((a + b) / 2);
              return (
                <g key={i}>
                  <path className="fig-guide" style={{ fill: `rgba(255,255,255,${done ? 0.2 : 0.14})`, stroke: done ? undefined : 'rgba(255,255,255,0.3)' }} d={wedge(a, upto)} />
                  {done && (
                    <Label x={SUN[0] + (mid[0] - SUN[0]) * 0.55} y={SUN[1] + (mid[1] - SUN[1]) * 0.55 + 6} kind="label">
                      {['A₁', 'A₂', 'A₃'][i]}
                    </Label>
                  )}
                </g>
              );
            })}
            <Line x1={SUN[0]} y1={SUN[1]} x2={p[0]} y2={p[1]} tone="soft" />
            <Ball x={SUN[0]} y={SUN[1]} r={9} />
            <Ball x={p[0]} y={p[1]} r={6} />
            <Label x={CX} y={CY + B + 40} kind="label">three equal time intervals, three equal areas: A₁ = A₂ = A₃</Label>
          </>
        );
      }}
    </Anim>
  );
}

export function PeriodsScene() {
  const rows = [
    { a: 1, T: 1, r: 50 },
    { a: 1.587, T: 2, r: 79.4 },
    { a: 2.52, T: 4, r: 126 },
  ];
  return (
    <Anim title="Three planets: the farther out, the longer the year. For each, T squared divided by a cubed is the same number" height={300} loop={8}>
      {(t) => (
        <>
          <Ball x={170} y={150} r={7} />
          {rows.map((w, i) => {
            const th = (TAU * t) / (w.T * 2) + i * 2;
            const x = 170 + w.r * Math.cos(th);
            const y = 150 - w.r * Math.sin(th);
            const show = ease(phase(t, 0.2 + i * 0.8, 1 + i * 0.8));
            return (
              <g key={i} opacity={show}>
                <circle className="fig-guide fig-dash fig-faint" cx={170} cy={150} r={w.r} />
                <Ball x={x} y={y} r={5} />
                <Label x={350} y={96 + i * 54} kind="val" anchor="start">{`a = ${w.a.toFixed(2)}    T = ${w.T}`}</Label>
                <Label x={350} y={116 + i * 54} kind="val" anchor="start">{`T²/a³ = ${(w.T ** 2 / w.a ** 3).toFixed(2)}`}</Label>
              </g>
            );
          })}
          <Label x={350} y={52} kind="label" anchor="start">a in units of the first orbit, T in its years</Label>
        </>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ Newton's law

/** Two masses whose force arrows grow as they come together (inverse square). */
export function ForcePair({ fixed, masses = ['m₁', 'm₂'], note }: { fixed?: boolean; masses?: [string, string]; note?: string }) {
  return (
    <Anim title={fixed ? 'Two masses pull on each other with equal and opposite forces' : 'Two masses pull on each other; the force arrows grow quickly as they come closer'} height={200} loop={8}>
      {(t) => {
        const d = fixed ? 200 : 300 - 190 * tri(t, 8);
        const ax = 320 - d / 2;
        const bx = 320 + d / 2;
        const y = 100;
        const len = fixed ? 36 * ease(phase(t, 0.6, 1.6)) : 60 * (100 / d) ** 2;
        return (
          <>
            <Line x1={ax} y1={y - 34} x2={bx} y2={y - 34} tone="soft" />
            <Line x1={ax} y1={y - 40} x2={ax} y2={y - 28} tone="soft" />
            <Line x1={bx} y1={y - 40} x2={bx} y2={y - 28} tone="soft" />
            <Label x={320} y={y - 42} kind="sym">r</Label>
            <Arrow x1={ax} y1={y} x2={ax + len} y2={y} />
            <Arrow x1={bx} y1={y} x2={bx - len} y2={y} />
            <Ball x={ax} y={y} r={12} />
            <Ball x={bx} y={y} r={12} />
            <Label x={ax} y={y + 38} kind="label">{masses[0]}</Label>
            <Label x={bx} y={y + 38} kind="label">{masses[1]}</Label>
            {fixed ? <Readout>{note ?? 'arrows magnified'}</Readout> : <Readout>{`r = ${(d / 100).toFixed(2)} r₀   F = ${(10000 / (d * d)).toFixed(2)} F₀`}</Readout>}
          </>
        );
      }}
    </Anim>
  );
}

export function InverseSquareScene() {
  const gx = 70;
  const gy = 240;
  const X = (r: number) => gx + r * 130;
  const Y = (f: number) => gy - f * 85;
  const pts = (a: number, b: number): P[] => {
    const out: P[] = [];
    for (let r = a; r <= b + 1e-9; r += 0.05) out.push([X(r), Y(1 / (r * r))]);
    return out;
  };
  return (
    <Anim title="The force falls as one over r squared: at twice the distance a quarter, at three times a ninth" height={280} loop={8}>
      {(t) => {
        const rEnd = lerp(0.7, 4, ease(phase(t, 0.3, 3)));
        const marks = [
          { r: 1, txt: '1', lab: 'r', at: 3.2 },
          { r: 2, txt: '¼', lab: '2r', at: 3.8 },
          { r: 3, txt: '⅑', lab: '3r', at: 4.4 },
        ];
        return (
          <>
            <Axes x={gx} y={gy} w={500} h={200} xLabel="distance" yLabel="F" />
            <Trail points={pts(0.7, rEnd)} />
            {marks.map((m) => {
              const k = ease(phase(t, m.at, m.at + 0.5));
              return (
                <g key={m.r} opacity={k}>
                  <Line x1={X(m.r)} y1={gy} x2={X(m.r)} y2={Y(1 / (m.r * m.r))} tone="faint" dashed />
                  <Ball x={X(m.r)} y={Y(1 / (m.r * m.r))} r={5} glow={false} />
                  <Label x={X(m.r) + 22} y={Y(1 / (m.r * m.r)) - 10} kind="label">{`F × ${m.txt}`}</Label>
                  <Label x={X(m.r)} y={gy + 20} kind="val">{m.lab}</Label>
                </g>
              );
            })}
          </>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ g at the surface and away from it

export function FallScene() {
  const k = 10; // pixels per metre
  return (
    <Anim title="A heavy ball and a light ball fall together: the heavy one has four times the weight but the same acceleration" height={290} loop={5}>
      {(t) => {
        const tau = Math.max(0, t - 0.5);
        const y0 = 40;
        const ground = 250;
        const fall = (r: number) => Math.min(ground - r, y0 + 0.5 * 9.81 * tau * tau * k);
        const ys = [fall(15), fall(8)];
        const done = y0 + 0.5 * 9.81 * tau * tau * k >= ground - 15;
        return (
          <>
            <Ground y={ground} />
            {[
              { x: 220, r: 15, m: 4, y: ys[0] },
              { x: 420, r: 8, m: 1, y: ys[1] },
            ].map((b) => (
              <g key={b.m}>
                <Ball x={b.x} y={b.y} r={b.r} />
                <Arrow x1={b.x + 34} y1={b.y} x2={b.x + 34} y2={b.y + b.m * 12} label={`${b.m} kg`} />
              </g>
            ))}
            {done ? <Label x={320} y={282} kind="val">both: a = g = 9.81 m/s²</Label> : <Label x={320} y={282} kind="val">arrow = weight W = m · g</Label>}
          </>
        );
      }}
    </Anim>
  );
}

/** A probe moves along a line through the Earth while the graph of g against distance draws itself. */
export function GProbe({ from = 0, to = 3, mark, g0 = 9.81, loop = 9, title }: { from?: number; to?: number; mark?: number; g0?: number; loop?: number; title: string }) {
  const gx = 330;
  const gy = 240;
  const X = (r: number) => gx + r * 93;
  const Y = (g: number) => gy - g * 150;
  const gr = (r: number) => (r < 1 ? r : 1 / (r * r));
  const ex = 110;
  const ey = 210;
  const RE = 40;
  const curve = (a: number, b: number): P[] => {
    const out: P[] = [];
    const n = 60;
    for (let i = 0; i <= n; i++) {
      const r = lerp(a, b, i / n);
      out.push([X(r), Y(gr(r))]);
    }
    return out;
  };
  return (
    <Anim title={title} height={280} loop={loop}>
      {(t) => {
        const p = ease(phase(t, 0.5, loop - 3));
        const r = lerp(from, to, p);
        const g = gr(r);
        const m = mark !== undefined && p >= 1 ? ease(phase(t, loop - 3, loop - 2.3)) : 0;
        return (
          <>
            <circle className="fig-cliff" cx={ex} cy={ey} r={RE} />
            <Line x1={ex} y1={ey} x2={ex} y2={ey - 3 * RE - 8} tone="faint" dashed />
            <Line x1={ex} y1={ey} x2={ex - RE * 0.707} y2={ey + RE * 0.707} tone="soft" />
            <Label x={ex - 38} y={ey + 44} kind="sym">R</Label>
            <Ball x={ex} y={ey - r * RE} r={6} />
            <Axes x={gx} y={gy} w={290} h={190} xLabel="r" yLabel="g" />
            <Line x1={gx} y1={Y(1)} x2={X(3)} y2={Y(1)} tone="faint" dashed />
            <Label x={gx - 10} y={Y(1) + 5} kind="val" anchor="end">g₀</Label>
            <Line x1={X(1)} y1={gy} x2={X(1)} y2={Y(1)} tone="faint" dashed />
            <Label x={X(1)} y={gy + 18} kind="val">R</Label>
            <Label x={X(2)} y={gy + 18} kind="val">2R</Label>
            <Label x={X(3)} y={gy + 18} kind="val">3R</Label>
            <Trail points={curve(0, 3)} tone="faint" />
            <Trail points={curve(from, r)} />
            <Ball x={X(r)} y={Y(g)} r={5} glow={false} />
            {mark !== undefined && (
              <g opacity={m}>
                <Line x1={X(mark)} y1={gy} x2={X(mark)} y2={Y(gr(mark))} tone="soft" dashed />
                <Line x1={gx} y1={Y(gr(mark))} x2={X(mark)} y2={Y(gr(mark))} tone="soft" dashed />
              </g>
            )}
            <Readout>{`g = ${(g * g0).toFixed(2)} m/s²`}</Readout>
          </>
        );
      }}
    </Anim>
  );
}

/** g against height above the surface, with the small-h approximation dashed. */
export function GHeightScene() {
  const gx = 70;
  const gy = 250;
  const X = (h: number) => gx + h * 0.5;
  const Y = (g: number) => gy - g * 19;
  const R = 6370;
  const real = (h: number) => 9.81 * (R / (R + h)) ** 2;
  const approx = (h: number) => 9.81 * (1 - (2 * h) / R);
  const curve = (f: (h: number) => number, b: number): P[] => {
    const out: P[] = [];
    for (let h = 0; h <= b + 1e-9; h += 20) out.push([X(h), Y(f(h))]);
    return out;
  };
  return (
    <Anim title="Gravity weakens with height: at 400 kilometres it is 8.69 metres per second squared; the straight-line formula is a little too low" height={290} loop={9}>
      {(t) => {
        const h = 1000 * ease(phase(t, 0.5, 5.5));
        const at = h >= 400;
        return (
          <>
            <Axes x={gx} y={gy} w={520} h={200} xLabel="height h" yLabel="g" />
            {[0, 400, 800].map((v) => (
              <Label key={v} x={X(v)} y={gy + 18} kind="val">{`${v}`}</Label>
            ))}
            <Label x={X(1000) + 12} y={gy + 18} kind="val">km</Label>
            <Trail points={curve(approx, h)} dashed tone="soft" />
            <Trail points={curve(real, h)} />
            <Ball x={X(h)} y={Y(real(h))} r={5} glow={false} />
            <g opacity={at ? 1 : 0}>
              <Line x1={X(400)} y1={gy} x2={X(400)} y2={Y(real(400))} tone="soft" dashed />
              <Line x1={gx} y1={Y(real(400))} x2={X(400)} y2={Y(real(400))} tone="soft" dashed />
              <Label x={X(400) + 14} y={Y(real(400)) - 14} kind="val" anchor="start">ISS: 8.69</Label>
            </g>
            <Label x={X(1000) - 4} y={Y(approx(1000)) + 22} kind="val" anchor="end">g(1 − 2h/R)</Label>
            <Readout>{`h = ${h.toFixed(0)} km   g = ${real(h).toFixed(2)} m/s²`}</Readout>
          </>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ field and potential

export function FieldScene() {
  const cx = 230;
  const cy = 150;
  const rings = [70, 100, 130];
  return (
    <Anim title="Field arrows point toward the Earth and shrink with distance; a test mass feels exactly the arrow where it is" height={300} loop={9}>
      {(t) => {
        const rT = lerp(250, 80, tri(t, 9));
        const L = (r: number) => 40 * (70 / r) ** 2;
        return (
          <>
            {rings.map((r, i) => {
              const k = ease(phase(t, 0.2 + i * 0.5, 0.9 + i * 0.5));
              return (
                <g key={r} opacity={k}>
                  <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={r} />
                  {Array.from({ length: 8 }, (_, j) => {
                    const phi = (j * Math.PI) / 4 + Math.PI / 8;
                    const ux = Math.cos(phi);
                    const uy = -Math.sin(phi);
                    const x = cx + r * ux;
                    const y = cy + r * uy;
                    return <Arrow key={j} x1={x} y1={y} x2={x - ux * L(r)} y2={y - uy * L(r)} tone="soft" />;
                  })}
                </g>
              );
            })}
            <Ball x={cx} y={cy} r={12} />
            <Label x={cx} y={cy + 32} kind="label">M</Label>
            <Ball x={cx + rT} y={cy} r={6} />
            <Arrow x1={cx + rT} y1={cy} x2={cx + rT - Math.min(L(rT) * 1.3, 100)} y2={cy} label="g" />
            <Label x={cx + rT} y={cy + 28} kind="label">m</Label>
            <Readout>{`g = GM/r²   ×${(L(rT) / 40).toFixed(2)}`}</Readout>
          </>
        );
      }}
    </Anim>
  );
}

/** The potential-energy well: U = -GMm/r. KE is the gap between the total-energy line and U. */
export function PotWell({ fromFar }: { fromFar?: boolean }) {
  const gx = 60;
  const z = 70; // the U = 0 line
  const X = (r: number) => gx + (r - 1) * 88;
  const Y = (u: number) => z - u * 150;
  const E = fromFar ? 0 : -1 / 6;
  const curve = (b: number): P[] => {
    const out: P[] = [];
    for (let r = 1; r <= b + 1e-9; r += 0.05) out.push([X(r), Y(-1 / r)]);
    return out;
  };
  return (
    <Anim title="A mass falls into the potential-energy well: U gets more negative, and the kinetic energy is the gap up to the total-energy line" height={290} loop={9}>
      {(t) => {
        const r = fromFar ? lerp(6.2, 1.15, ease(phase(t, 0.4, 6))) : lerp(5, 1.15, tri(t, 9));
        const u = -1 / r;
        const reveal = ease(phase(t, 0, 1.2));
        return (
          <>
            <Line x1={gx} y1={z} x2={gx + 540} y2={z} tone="soft" />
            <Label x={gx + 540} y={z - 8} kind="val" anchor="end">U = 0 (at infinity)</Label>
            <Line x1={gx} y1={z - 20} x2={gx} y2={Y(-1) + 20} tone="soft" />
            <Label x={gx + 8} y={Y(-1) + 38} kind="val" anchor="start">surface</Label>
            <Label x={gx + 540} y={z + 148} kind="label" anchor="end">U = −GMm / r</Label>
            <Trail points={curve(1 + 5.4 * reveal)} />
            {!fromFar && <Line x1={gx} y1={Y(E)} x2={gx + 540} y2={Y(E)} tone="faint" dashed />}
            {!fromFar && <Label x={gx + 540} y={Y(E) - 8} kind="val" anchor="end">total E</Label>}
            <Line x1={X(r)} y1={Y(u)} x2={X(r)} y2={Y(E)} tone="bright" />
            <Label x={X(r) + 14} y={(Y(u) + Y(E)) / 2 + 5} kind="label" anchor="start">K</Label>
            <Ball x={X(r)} y={Y(u)} r={6} />
            <Readout>{`U = ${(u).toFixed(2)} GMm/R`}</Readout>
          </>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ escape

function radialPath(f: number, T = 12, dt = 0.01): number[] {
  let r = 1;
  let v = f * Math.SQRT2;
  const out = [1];
  for (let i = 0; i < T / dt; i++) {
    v += (-1 / (r * r)) * dt;
    r += v * dt;
    out.push(r);
    if (r <= 1) {
      out[out.length - 1] = 1;
      break;
    }
  }
  return out;
}
const FS = [0.7, 0.8, 1.0];
const PATHS = FS.map((f) => radialPath(f));

export function EscapeScene() {
  const ground = 250;
  const yOf = (r: number) => ground - (r - 1) * 50;
  const xs = [140, 320, 500];
  const km = ['7.8 km/s', '8.9 km/s', '11.2 km/s'];
  return (
    <Anim title="Three rockets launched upward: the two slower ones stop and fall back, the one at escape speed keeps going forever" height={300} loop={9}>
      {(t) => {
        const s = Math.max(0, t - 0.4) * 2;
        return (
          <>
            <Ground y={ground} />
            {PATHS.map((path, i) => {
              const idx = Math.min(path.length - 1, Math.floor(s / 0.01));
              const r = path[idx];
              const landed = i < 2 && s >= (path.length - 1) * 0.01;
              const pts: P[] = [];
              for (let k = 0; k <= idx; k += 6) pts.push([xs[i], Math.max(24, yOf(path[k]))]);
              const out = yOf(r) < 24;
              return (
                <g key={i}>
                  <Trail points={pts} tone="soft" dashed />
                  {!out && <Ball x={xs[i]} y={yOf(r)} r={6} />}
                  <Label x={xs[i]} y={ground + 26} kind="val">{FS[i] === 1 ? 'v_esc' : `${FS[i]} v_esc`}</Label>
                  <Label x={xs[i]} y={ground + 44} kind="val">{km[i]}</Label>
                  {landed && <Label x={xs[i]} y={40} kind="label">falls back</Label>}
                  {i === 2 && (out || r > 4.5) && <Label x={xs[i]} y={40} kind="label">escapes</Label>}
                </g>
              );
            })}
          </>
        );
      }}
    </Anim>
  );
}

/** Escape speeds drawn as growing bars, with the size of each world beside it. */
export function EscapeBars() {
  return (
    <Anim title="The escape speed from the Moon is about 2.37 kilometres per second, much smaller than the Earth's 11.2" height={230} loop={7}>
      {(t) => {
        const rows = [
          { name: 'Earth', v: 11.2, r: 32, y: 70 },
          { name: 'Moon', v: 2.37, r: 9, y: 160 },
        ];
        return (
          <>
            {rows.map((row, i) => {
              const p = ease(phase(t, 0.4 + i * 0.5, 2.6 + i * 0.5));
              const x2 = 120 + row.v * 40 * p;
              return (
                <g key={row.name}>
                  <circle className="fig-cliff" cx={60} cy={row.y} r={row.r} />
                  <Label x={60} y={row.y + row.r + 20} kind="label">{row.name}</Label>
                  <Line x1={120} y1={row.y} x2={120 + row.v * 40} y2={row.y} tone="faint" dashed />
                  <Arrow x1={120} y1={row.y} x2={x2} y2={row.y} />
                  <Ball x={x2} y={row.y} r={6} />
                  <Label x={x2 + 14} y={row.y - 12} kind="val" anchor="start">{`${(row.v * p).toFixed(2)} km/s`}</Label>
                </g>
              );
            })}
          </>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ orbits

const RP = 85;
const CC: P = [320, 160];
function shoot(k: number, tmax: number, dt = 0.01): P[] {
  const r0 = 1.05;
  let x = 0;
  let y = r0;
  let vx = k * Math.sqrt(1 / r0);
  let vy = 0;
  const out: P[] = [[x, y]];
  for (let i = 0; i < tmax / dt; i++) {
    const r = Math.hypot(x, y);
    vx += (-x / r ** 3) * dt;
    vy += (-y / r ** 3) * dt;
    x += vx * dt;
    y += vy * dt;
    out.push([x, y]);
    if (Math.hypot(x, y) < 1) break;
  }
  return out;
}
const SHOTS = [shoot(0.55, 6.8), shoot(0.8, 6.8), shoot(1.0, 6.8)];
const toScreen = ([x, y]: P): P => [CC[0] + x * RP, CC[1] - y * RP];

export function CannonScene() {
  const starts = [0, 3.2, 7];
  const factor = [1.4, 1.4, 1];
  const speeds = ['4.3 km/s: lands near', '6.3 km/s: lands far', '7.9 km/s: never lands'];
  return (
    <Anim title="Newton's cannon: fired faster and faster, the cannonball lands farther away until the ground curves away as fast as it falls and it orbits" height={310} loop={15}>
      {(t) => {
        let cur = 0;
        starts.forEach((s, i) => {
          if (t >= s) cur = i;
        });
        return (
          <>
            <circle className="fig-cliff" cx={CC[0]} cy={CC[1]} r={RP} />
            <Block x={CC[0]} y={CC[1] - RP - 8} w={22} h={8} filled />
            <Label x={CC[0] + 30} y={CC[1] - RP - 18} kind="label" anchor="start">cannon</Label>
            {SHOTS.map((path, i) => {
              if (t < starts[i]) return null;
              const idx = Math.min(path.length - 1, Math.floor(((t - starts[i]) * factor[i]) / 0.01));
              const pts: P[] = [];
              for (let k = 0; k <= idx; k += 4) pts.push(toScreen(path[k]));
              pts.push(toScreen(path[idx]));
              const [bx, by] = toScreen(path[idx]);
              const live = i === cur && idx < path.length - 1;
              return (
                <g key={i}>
                  <Trail points={pts} tone={i === cur ? 'bright' : 'soft'} />
                  {(live || (i === 2 && cur === 2)) && <Ball x={bx} y={by} r={5} />}
                </g>
              );
            })}
            <Readout>{speeds[cur]}</Readout>
          </>
        );
      }}
    </Anim>
  );
}

/** A satellite on a circle with its velocity (tangent) and acceleration (toward the centre). */
export function OrbitScene({ title, v = true, a = true, gText, minutes, speedText, loop = 8 }: { title: string; v?: boolean; a?: boolean; gText?: string; minutes?: number; speedText?: string; loop?: number }) {
  return (
    <Anim title={title} height={300} loop={loop}>
      {(t) => {
        const th = Math.PI / 2 + (TAU * t) / loop;
        const R = 105;
        const x = 320 + R * Math.cos(th);
        const y = 150 - R * Math.sin(th);
        return (
          <>
            <circle className="fig-guide fig-dash fig-faint" cx={320} cy={150} r={R} />
            <circle className="fig-cliff" cx={320} cy={150} r={38} />
            <Label x={320} y={156} kind="label">Earth</Label>
            {v && <Arrow x1={x} y1={y} x2={x - 62 * Math.sin(th)} y2={y - 62 * Math.cos(th)} label="v" />}
            {a && <Arrow x1={x} y1={y} x2={x - 48 * Math.cos(th)} y2={y + 48 * Math.sin(th)} tone="bright" dashed label={gText ? 'g' : 'a'} />}
            <Ball x={x} y={y} r={6} />
            {minutes !== undefined && <Readout>{`t = ${(minutes * (t / loop)).toFixed(1)} min`}</Readout>}
            {speedText && <Label x={34} y={26} kind="val" anchor="start">{speedText}</Label>}
            {gText && <Label x={34} y={46} kind="val" anchor="start">{gText}</Label>}
          </>
        );
      }}
    </Anim>
  );
}

/** Two satellites, one at four times the radius: the outer one is slower and its year longer. */
export function TwoOrbits() {
  return (
    <Anim title="A satellite four times as far out moves at half the speed and takes eight times as long for one lap" height={300} loop={16}>
      {(t) => {
        const sats = [
          { R: 34, w: TAU / 2, L: 60 },
          { R: 136, w: TAU / 16, L: 30 },
        ];
        return (
          <>
            <Ball x={320} y={150} r={8} />
            {sats.map((s, i) => {
              const th = Math.PI / 2 + s.w * t;
              const x = 320 + s.R * Math.cos(th);
              const y = 150 - s.R * Math.sin(th);
              return (
                <g key={i}>
                  <circle className="fig-guide fig-dash fig-faint" cx={320} cy={150} r={s.R} />
                  <Arrow x1={x} y1={y} x2={x - s.L * Math.sin(th)} y2={y - s.L * Math.cos(th)} />
                  <Ball x={x} y={y} r={5} />
                </g>
              );
            })}
            <Label x={30} y={26} kind="val" anchor="start">inner: v, T</Label>
            <Label x={30} y={46} kind="val" anchor="start">outer: 4r, v/2, 8T</Label>
          </>
        );
      }}
    </Anim>
  );
}

export function GeoScene() {
  const cx = 230;
  const cy = 150;
  return (
    <Anim title="Seen from above the pole: a geostationary satellite turns once a day with the Earth, so it stays over the same spot; a lower satellite races past" height={300} loop={8}>
      {(t) => {
        const w = (TAU * t) / 8;
        const th0 = 0.5;
        const rg = 126;
        const rl = 50;
        const city: P = [cx + 19 * Math.cos(th0 + w), cy - 19 * Math.sin(th0 + w)];
        const geo: P = [cx + rg * Math.cos(th0 + w), cy - rg * Math.sin(th0 + w)];
        const low: P = [cx + rl * Math.cos(3.4 + 4 * w), cy - rl * Math.sin(3.4 + 4 * w)];
        return (
          <>
            <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={rg} />
            <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={rl} />
            <circle className="fig-cliff" cx={cx} cy={cy} r={19} />
            <Line x1={cx} y1={cy} x2={cx + 19 * Math.cos(th0 + w + 2.2)} y2={cy - 19 * Math.sin(th0 + w + 2.2)} tone="faint" />
            <Line x1={city[0]} y1={city[1]} x2={geo[0]} y2={geo[1]} tone="soft" dashed />
            <circle className="fig-ghost" cx={city[0]} cy={city[1]} r={3.5} />
            <Ball x={geo[0]} y={geo[1]} r={6} />
            <Ball x={low[0]} y={low[1]} r={4} glow={false} />
            <Label x={cx} y={cy + 4} kind="label">Earth</Label>
            <Label x={420} y={96} kind="label" anchor="start">geostationary</Label>
            <Label x={420} y={122} kind="val" anchor="start">T = 24 h, over the equator</Label>
            <Label x={420} y={144} kind="val" anchor="start">r = 42 200 km</Label>
            <Label x={420} y={166} kind="val" anchor="start">h = 35 900 km</Label>
            <Label x={420} y={206} kind="label" anchor="start">lower satellite: shorter T</Label>
          </>
        );
      }}
    </Anim>
  );
}

/** Raise the orbit and watch the energy bars change: K = -E, U = 2E. */
export function SatEnergy() {
  return (
    <Anim title="As a satellite is lifted to a higher orbit its kinetic energy falls, its potential energy rises and the total energy rises toward zero" height={300} loop={10}>
      {(t) => {
        const rho = (tt: number) => 1.5 + 2.5 * (ease(phase(tt, 0.5, 4.5)) - ease(phase(tt, 5.5, 9.5)));
        let th = Math.PI / 2;
        for (let s = 0; s < t; s += 0.05) th += 0.05 * 3 * rho(s) ** -1.5;
        const r = rho(t);
        const cx = 170;
        const cy = 150;
        const x = cx + 28 * r * Math.cos(th);
        const y = cy - 28 * r * Math.sin(th);
        const z = 150;
        const sc = 150;
        const bars = [
          { x: 420, v: 1 / (2 * r), lab: 'K' },
          { x: 500, v: -1 / r, lab: 'U' },
          { x: 580, v: -1 / (2 * r), lab: 'E' },
        ];
        return (
          <>
            <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={28 * r} />
            <circle className="fig-cliff" cx={cx} cy={cy} r={28} />
            <Ball x={x} y={y} r={5} />
            <Line x1={370} y1={z} x2={620} y2={z} tone="soft" />
            {bars.map((b) => (
              <g key={b.lab}>
                <rect className="fig-cell" x={b.x - 18} y={b.v > 0 ? z - b.v * sc : z} width={36} height={Math.abs(b.v) * sc} />
                <Label x={b.x} y={b.v > 0 ? z - b.v * sc - 8 : z + Math.abs(b.v) * sc + 22} kind="sym">{b.lab}</Label>
              </g>
            ))}
            <Readout>{`r = ${r.toFixed(1)} R`}</Readout>
          </>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ weightlessness

export function FreeFallScene() {
  const k = 10.3;
  return (
    <Anim title="Standing on the floor the ball presses on it; when the box falls freely the ball falls with it and floats, with no push from the floor" height={290} loop={5}>
      {(t) => {
        const tau = Math.max(0, t - 0.5);
        const dy = Math.min(120, 0.5 * 9.81 * tau * tau * k);
        const ground = 250;
        const na = ease(phase(t, 0, 0.5));
        return (
          <>
            <Ground y={ground} />
            <Block x={170} y={ground - 50} w={120} h={100} />
            <Ball x={170} y={ground - 100 + 16} r={12} />
            <g opacity={na}>
              <Arrow x1={170} y1={ground - 84} x2={170} y2={ground - 84 + 42} label="W" />
              <Arrow x1={170} y1={ground - 84} x2={170} y2={ground - 84 - 42} label="N" />
            </g>
            <Label x={170} y={ground + 28} kind="val">on the floor: N = W</Label>
            <Block x={470} y={80 + dy} w={120} h={100} />
            <Ball x={470} y={80 + dy} r={12} />
            <Arrow x1={470} y1={80 + dy + 12} x2={470} y2={80 + dy + 54} label="W" />
            <Label x={470} y={ground + 28} kind="val">falling: N = 0, weightless</Label>
          </>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ mistakes

export function HalfOrQuarter() {
  return (
    <Anim title="When the distance doubles the force becomes a quarter, not a half" height={190} loop={7}>
      {(t) => {
        const d = lerp(100, 200, ease(phase(t, 1, 3.5)));
        const ax = 170;
        const bx = ax + d;
        const real = 44 * (100 / d) ** 2;
        const wrong = 44 * (100 / d);
        return (
          <>
            <Arrow x1={ax} y1={80} x2={ax + wrong} y2={80} tone="soft" dashed />
            <Arrow x1={ax} y1={96} x2={ax + real} y2={96} />
            <Ball x={ax} y={88} r={11} />
            <Ball x={bx} y={88} r={11} />
            <Label x={ax + 130} y={150} kind="val">{d > 190 ? 'true: ¼ of F   (dashed: wrong ½)' : `r = ${(d / 100).toFixed(1)} r₀`}</Label>
          </>
        );
      }}
    </Anim>
  );
}

export function RVsH() {
  return (
    <Anim title="The distance in the formula runs from the centre of the Earth, so it is R plus h, not just h" height={240} loop={6}>
      {(t) => {
        const h = 110 * ease(phase(t, 0.5, 3.5));
        const ey = 290;
        const top = ey - 100;
        const py = top - h;
        return (
          <>
            <circle className="fig-cliff" cx={320} cy={ey} r={100} />
            <Line x1={320} y1={ey} x2={320} y2={py} tone="soft" dashed />
            <Line x1={372} y1={ey} x2={372} y2={py} tone="bright" />
            <Label x={392} y={(ey + py) / 2 + 6} kind="label" anchor="start">r = R + h</Label>
            <Line x1={268} y1={top} x2={268} y2={py} tone="bright" />
            <Label x={250} y={(top + py) / 2 + 6} kind="label" anchor="end">h</Label>
            <Ball x={320} y={py} r={6} />
          </>
        );
      }}
    </Anim>
  );
}

export function SameEscape() {
  const path = PATHS[2];
  return (
    <Anim title="A light rocket and a heavy rocket launched at the same escape speed follow exactly the same path" height={250} loop={9}>
      {(t) => {
        const s = Math.max(0, t - 0.4) * 2;
        const idx = Math.min(path.length - 1, Math.floor(s / 0.01));
        const y = Math.max(20, 215 - (path[idx] - 1) * 50);
        return (
          <>
            <Ground y={215} />
            {[
              { x: 220, r: 5, n: '1 kg' },
              { x: 420, r: 12, n: '1000 kg' },
            ].map((b) => (
              <g key={b.n}>
                <Ball x={b.x} y={y} r={b.r} />
                <Label x={b.x} y={240} kind="val">{`${b.n}, 11.2 km/s`}</Label>
              </g>
            ))}
          </>
        );
      }}
    </Anim>
  );
}
