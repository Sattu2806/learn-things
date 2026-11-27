import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Block, Label, Line, Readout, Spring, Trail, clamp, ease, lerp, phase } from '../kit/Anim';

/** Animated diagrams for the elasticity chapter. Positions come from the real physics, drawn at a readable scale. */

const f0 = (x: number) => x.toFixed(0);
const f1 = (x: number) => x.toFixed(1);
const f2 = (x: number) => x.toFixed(2);

/** The support a wire hangs from, hatched above. */
function Ceil({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const marks = [];
  for (let x = x1 + 6; x < x2; x += 12) marks.push(<line key={x} className="fig-guide fig-faint" x1={x} y1={y - 2} x2={x - 7} y2={y - 9} />);
  return (
    <g>
      <line className="fig-ground" x1={x1} x2={x2} y1={y} y2={y} />
      {marks}
    </g>
  );
}

/** A straight wire or bar segment of a given thickness. */
function Wire({ x, y1, y2, w = 3, op = 1 }: { x: number; y1: number; y2: number; w?: number; op?: number }) {
  return <line className="fig-path" style={{ strokeWidth: w, opacity: op }} x1={x} x2={x} y1={y1} y2={y2} />;
}

/** A row in a readout block: name on the left, value on the right. */
function Row({ x1, x2, y, name, value }: { x1: number; x2: number; y: number; name: ReactNode; value: ReactNode }) {
  return (
    <g>
      <Label x={x1} y={y} anchor="start" kind="label">
        {name}
      </Label>
      <Label x={x2} y={y} anchor="end" kind="val">
        {value}
      </Label>
    </g>
  );
}

/** A dashed outline with no fill, for "where it was". */
function Ghost({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect className="fig-guide fig-dash" fill="none" x={x} y={y} width={w} height={h} />;
}

/** A horizontal bar that fills from the left. */
function Bar({ x, y, w, p, h = 14, op = 0.85 }: { x: number; y: number; w: number; p: number; h?: number; op?: number }) {
  return (
    <g>
      <rect className="fig-cell" x={x} y={y} width={w} height={h} rx={2} />
      <rect x={x} y={y} width={Math.max(0, Math.min(w, w * p))} height={h} rx={2} fill="#fff" fillOpacity={op} />
    </g>
  );
}

// ---------------------------------------------------------------- the stress-strain curve of a ductile metal

/** Stress (0 to 1) against strain (0 to 0.92) for a ductile metal: straight, yield, hardening, necking, fracture. */
function ductile(e: number): number {
  if (e < 0.2) return 3 * e;
  if (e < 0.28) return 0.6 + 0.12 * (1 - (1 - (e - 0.2) / 0.08) ** 2);
  if (e < 0.4) return 0.72 - (0.02 * (e - 0.28)) / 0.12;
  if (e < 0.75) return 0.7 + 0.3 * (1 - (1 - (e - 0.4) / 0.35) ** 2);
  return 1 - 0.18 * ((e - 0.75) / 0.17) ** 2;
}
const E_FRACTURE = 0.92;

// ---------------------------------------------------------------- 1. elastic and plastic

/** A spring, a rubber band and a steel wire loaded and unloaded: the load–extension graph of each. */
export function ThreeMaterials() {
  const rubL = (x: number) => 0.2 * x + 0.8 * x ** 3;
  const rubU = (x: number) => rubL(x) * (0.7 + 0.3 * x * x);
  const inv = (F: number, f: (x: number) => number) => {
    let a = 0;
    let b = 1;
    for (let i = 0; i < 30; i++) {
      const m = (a + b) / 2;
      if (f(m) < F) a = m;
      else b = m;
    }
    return a;
  };
  return (
    <Anim title="A spring, a rubber band and a steel wire are loaded and unloaded; their load against extension graphs differ" height={250} loop={10}>
      {(t) => {
        const F = ease(phase(t, 0.5, 4)) - ease(phase(t, 5.2, 8.7));
        const unloading = t > 4.6;
        const xs = F;
        const xr = 0.8 * inv(F, unloading ? rubU : rubL);
        const xw = 0.04 * F;
        const ox = 380;
        const oy = 205;
        const gw = 230;
        const gh = 150;
        const pt = (x: number, f: number): [number, number] => [ox + x * gw, oy - f * gh];
        const curve = (fn: (x: number) => number, k: number) => Array.from({ length: 41 }, (_, i) => pt((k * i) / 40, fn((i) / 40)));
        const cols = [
          { x: 60, ext: 80 * xs, name: 'spring' },
          { x: 150, ext: 80 * xr, name: 'rubber band' },
          { x: 240, ext: 80 * xw, name: 'steel wire' },
        ];
        return (
          <g>
            <Ceil x1={25} x2={285} y={22} />
            {cols.map((c, i) => {
              const bottom = 22 + 50 + c.ext;
              return (
                <g key={c.name}>
                  {i === 0 && <Spring x1={c.x} y1={22} x2={c.x} y2={bottom} coils={7} width={8} />}
                  {i === 1 && (
                    <g>
                      <Wire x={c.x - 5} y1={22} y2={bottom} w={2.5} />
                      <Wire x={c.x + 5} y1={22} y2={bottom} w={2.5} />
                      <path className="fig-path" fill="none" d={`M${c.x - 5} ${bottom}A5 5 0 0 0 ${c.x + 5} ${bottom}`} />
                    </g>
                  )}
                  {i === 2 && <Wire x={c.x} y1={22} y2={bottom} w={1.8} />}
                  <Block x={c.x} y={bottom + 14} w={26} h={18} />
                  <Label x={c.x} y={196} kind="label">
                    {c.name}
                  </Label>
                </g>
              );
            })}
            <Axes x={ox} y={oy} w={gw + 10} h={gh + 14} xLabel="extension" yLabel="load" />
            <Trail points={curve((x) => x, 1)} tone="soft" />
            <Trail points={curve(rubL, 0.8)} tone="soft" />
            <Trail points={curve(rubU, 0.8)} tone="soft" dashed />
            <Trail points={[pt(0, 0), pt(0.04, 1)]} tone="soft" />
            <Ball {...{ x: pt(xs, F)[0], y: pt(xs, F)[1] }} r={4.5} />
            <Ball {...{ x: pt(xr, F)[0], y: pt(xr, F)[1] }} r={4.5} />
            <Ball {...{ x: pt(xw, F)[0], y: pt(xw, F)[1] }} r={4.5} />
            <Label x={pt(1, 1)[0]} y={pt(1, 1)[1] - 10} kind="label">
              spring
            </Label>
            <Label x={pt(0.8, 1)[0] - 6} y={pt(0.8, 1)[1] - 10} anchor="end" kind="label">
              rubber
            </Label>
            <Label x={pt(0.04, 1)[0] + 6} y={pt(0.04, 1)[1] - 10} anchor="start" kind="label">
              steel
            </Label>
            <Readout>{t < 4.6 ? 'loading' : 'unloading'}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** One load–unload cycle for a small load (returns) and a big one (stays stretched). */
export function LoadRelease() {
  return (
    <Anim title="A wire loaded lightly returns to its length; loaded past the elastic limit it stays stretched" height={250} loop={10}>
      {(t) => {
        const up = (a: number, b: number) => ease(phase(t, 0.6, 3.6)) * a - ease(phase(t, 4.6, 7.6)) * b;
        const wSmall = up(0.45, 0.45);
        const wBig = up(1, 1);
        const extSmall = 30 * wSmall;
        const unloading = t > 4.1;
        const extBig = unloading ? 55 - 30 * (1 - wBig) : wBig < 0.5 ? 30 * wBig : 15 + 80 * (wBig - 0.5);
        const wires = [
          { x: 170, ext: extSmall, w: wSmall, name: 'small load' },
          { x: 470, ext: extBig, w: wBig, name: 'large load' },
        ];
        return (
          <g>
            {wires.map((c) => (
              <g key={c.name}>
                <Ceil x1={c.x - 70} x2={c.x + 70} y={24} />
                <Wire x={c.x} y1={24} y2={24 + 100 + c.ext} />
                <line className="fig-guide fig-dash" x1={c.x - 50} x2={c.x + 50} y1={124} y2={124} />
                <Label x={c.x + 54} y={128} anchor="start" kind="label">
                  original length
                </Label>
                <Block x={c.x} y={24 + 100 + c.ext + 16} w={30 + 14 * c.w} h={22} />
                <Label x={c.x} y={236} kind="label">
                  {c.name}
                </Label>
              </g>
            ))}
            <Readout>{t < 4.1 ? 'loading' : t < 8 ? 'load removed' : 'at rest'}</Readout>
            {t > 8 && (
              <g>
                <Label x={170} y={214} kind="val">
                  back to the start
                </Label>
                <Label x={470} y={214} kind="val">
                  permanently longer
                </Label>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------- 2. stress and strain

/** A wire hangs with a growing load; stress and strain readouts for the chosen wire. */
export function StretchWire() {
  return (
    <Anim title="A wire stretches as the load grows: force, stress, strain and extension are read out" height={270} loop={9}>
      {(t) => {
        const p = ease(phase(t, 0.6, 6));
        const top = 34;
        const L = 100;
        const ext = 40 * p;
        const bottom = top + L + ext;
        return (
          <g>
            <Ceil x1={90} x2={210} y={top} />
            <Wire x={150} y1={top} y2={bottom} />
            <line className="fig-guide fig-dash" x1={120} x2={180} y1={top + L} y2={top + L} />
            <Line x1={108} y1={top} x2={108} y2={top + L} />
            <Label x={100} y={top + L / 2 + 6} anchor="end" kind="sym">
              L
            </Label>
            <Line x1={192} y1={top + L} x2={192} y2={bottom} tone="bright" />
            <Label x={200} y={top + L + ext / 2 + 6} anchor="start" kind="sym">
              ΔL
            </Label>
            <Block x={150} y={bottom + 14} w={34} h={22} />
            <Arrow x1={150} y1={bottom + 25} x2={150} y2={bottom + 28 + 36 * p} label="F" />
            <Row x1={330} x2={620} y={70} name="force F" value={`${f0(100 * p)} N`} />
            <Row x1={330} x2={620} y={100} name="stress σ = F / A" value={`${f0(100 * p)} MPa`} />
            <Row x1={330} x2={620} y={130} name="strain ε = ΔL / L" value={`${f2(5 * p)} × 10⁻⁴`} />
            <Row x1={330} x2={620} y={160} name="extension ΔL" value={`${f2(p)} mm`} />
            <Label x={330} y={215} anchor="start" kind="label">
              L = 2 m, A = 1 mm², steel
            </Label>
            <Label x={330} y={235} anchor="start" kind="label">
              the extension is drawn far larger than real
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** A bar pulled apart and a bar squeezed together, with the length change shown against a dashed outline. */
export function TensionCompression() {
  return (
    <Anim title="A bar pulled from both ends gets longer; a bar pushed from both ends gets shorter" height={250} loop={6}>
      {(t) => {
        const p = ease(phase(t, 0.4, 2.6)) - ease(phase(t, 3.4, 5.6));
        const L = 120;
        const d = 20 * p;
        const bars = [
          { x: 170, s: 1, name: 'tension: longer' },
          { x: 470, s: -1, name: 'compression: shorter' },
        ];
        return (
          <g>
            {bars.map((b) => {
              const len = L + b.s * d;
              const y1 = 125 - len / 2;
              const y2 = 125 + len / 2;
              const len0 = L;
              return (
                <g key={b.name}>
                  <Ghost x={b.x - 13} y={125 - len0 / 2} w={26} h={len0} />
                  <rect className="kit-block" x={b.x - 13} y={y1} width={26} height={len} rx={2} />
                  {b.s > 0 ? (
                    <g>
                      <Arrow x1={b.x} y1={y1 - 2} x2={b.x} y2={y1 - 6 - 30 * Math.max(p, 0.1)} label="F" />
                      <Arrow x1={b.x} y1={y2 + 2} x2={b.x} y2={y2 + 6 + 30 * Math.max(p, 0.1)} label="F" />
                    </g>
                  ) : (
                    <g>
                      <Arrow x1={b.x} y1={y1 - 36 - 10 * 0} x2={b.x} y2={y1 - 4} label="F" />
                      <Arrow x1={b.x} y1={y2 + 36} x2={b.x} y2={y2 + 4} label="F" />
                    </g>
                  )}
                  <Label x={b.x} y={238} kind="label">
                    {b.name}
                  </Label>
                  <Label x={b.x + 46} y={129} anchor="start" kind="val">
                    {`ΔL = ${b.s > 0 ? '+' : '−'}${f1(d * 0.5)}`}
                  </Label>
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------- 3. Hooke's law and Young's modulus

/** Stress against strain is a straight line for each metal; steel is steepest, so it stretches least. */
export function HookeMaterials() {
  const mats = [
    { name: 'steel', Y: 2.0, x: 430 },
    { name: 'copper', Y: 1.1, x: 500 },
    { name: 'aluminium', Y: 0.7, x: 570 },
  ];
  return (
    <Anim title="Three metals under the same stress: the stiffer the metal, the less it strains" height={270} loop={9}>
      {(t) => {
        const p = ease(phase(t, 0.6, 5.5));
        const ox = 60;
        const oy = 225;
        const sx = 230 / 2.86;
        const sy = 160;
        return (
          <g>
            <Axes x={ox} y={oy} w={250} h={175} xLabel="strain" yLabel="stress" />
            {mats.map((m) => {
              const e = 2 / m.Y;
              const px = ox + e * p * sx;
              const py = oy - p * sy;
              return (
                <g key={m.name}>
                  <Trail points={[[ox, oy], [ox + e * sx, oy - sy]]} tone="soft" />
                  <Trail points={[[ox, oy], [px, py]]} />
                  <Ball x={px} y={py} r={4.5} />
                  <Label x={ox + e * sx + 6} y={oy - sy - (m.name === 'steel' ? 10 : 0)} anchor={m.name === 'steel' ? 'start' : 'start'} kind="label">
                    {m.name}
                  </Label>
                  <Ceil x1={m.x - 28} x2={m.x + 28} y={24} />
                  <Wire x={m.x} y1={24} y2={24 + 90 + 38 * e * p} w={2.5} />
                  <Block x={m.x} y={24 + 90 + 38 * e * p + 12} w={26} h={18} />
                  <Label x={m.x} y={236} kind="label">
                    {m.name}
                  </Label>
                </g>
              );
            })}
            <Label x={430} y={256} anchor="start" kind="label">
              same wire size, same load
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------- 4. the curve

/** A wire is pulled until it breaks while its stress–strain curve draws itself. */
export function StressStrainCurve() {
  const marks: [string, number][] = [
    ['P', 0.2],
    ['E', 0.24],
    ['Y', 0.28],
    ['U', 0.75],
    ['F', E_FRACTURE],
  ];
  return (
    <Anim title="A wire is stretched until it breaks while its stress against strain curve is drawn" height={300} loop={13}>
      {(t) => {
        const p = phase(t, 0.6, 9);
        const e = Math.min(p, 1) * E_FRACTURE;
        const broken = p >= 1;
        const ox = 300;
        const oy = 262;
        const sx = 300;
        const sy = 190;
        const pts: [number, number][] = [];
        for (let i = 0; i <= 120; i++) {
          const ee = (e * i) / 120;
          pts.push([ox + ee * sx, oy - ductile(ee) * sy]);
        }
        const top = 30;
        const L = 90;
        const ext = 90 * e;
        const neck = clamp((e - 0.75) / 0.17);
        const mid = top + (L + ext) / 2;
        const fall = broken ? Math.max(0, t - 9) : 0;
        const dropY = 220 * fall * fall;
        const stage = broken ? 'fracture' : e < 0.2 ? 'proportional: Hooke' : e < 0.24 ? 'elastic' : e < 0.4 ? 'yielding' : e < 0.75 ? 'hardening' : 'necking';
        const tip = top + L + ext;
        return (
          <g>
            <Ceil x1={50} x2={170} y={top} />
            {!broken ? (
              <g>
                <Wire x={110} y1={top} y2={mid - 14} w={3} />
                <Wire x={110} y1={mid - 14} y2={mid + 14} w={3 - 1.8 * neck} />
                <Wire x={110} y1={mid + 14} y2={tip} w={3} />
                <Block x={110} y={tip + 16} w={34} h={22} />
              </g>
            ) : (
              <g>
                <Wire x={110} y1={top} y2={mid - 5} w={3} op={1} />
                <g style={{ opacity: 1 - clamp(fall - 0.4) }} transform={`translate(0 ${dropY})`}>
                  <Wire x={110} y1={mid + 5} y2={tip} w={3} />
                  <Block x={110} y={tip + 16} w={34} h={22} />
                </g>
              </g>
            )}
            <Label x={110} y={288} kind="val">
              {stage}
            </Label>
            <Axes x={ox} y={oy} w={320} h={225} xLabel="strain" yLabel="stress" />
            <Trail points={pts} />
            <Ball x={pts[pts.length - 1][0]} y={pts[pts.length - 1][1]} r={4.5} glow={!broken} />
            {marks.map(([name, at]) =>
              e >= at - 1e-9 ? (
                <g key={name}>
                  <circle className="fig-ball" cx={ox + at * sx} cy={oy - ductile(at) * sy} r={3} />
                  <Label x={ox + at * sx + (name === 'F' ? 12 : name === 'U' ? 0 : -12)} y={oy - ductile(at) * sy - (name === 'U' ? 12 : name === 'F' ? -4 : 4 + (name === 'Y' ? 8 : 0))} kind="sym">
                    {name}
                  </Label>
                </g>
              ) : null,
            )}
            <Label x={ox + 70} y={oy + 20} kind="label">
              elastic
            </Label>
            <Label x={ox + 200} y={oy + 20} kind="label">
              plastic
            </Label>
            <line className="fig-guide fig-dash" x1={ox + 0.24 * sx} x2={ox + 0.24 * sx} y1={oy - 6} y2={oy + 4} />
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------- 5. ductile and brittle

export function DuctileBrittle() {
  return (
    <Anim title="A ductile metal stretches and necks before breaking; a brittle material snaps almost straight away" height={300} loop={11}>
      {(t) => {
        const p = phase(t, 0.6, 7);
        const eD = Math.min(p, 1) * E_FRACTURE;
        const eB = Math.min(p * E_FRACTURE, 0.1);
        const brokenB = p * E_FRACTURE >= 0.1;
        const brokenD = p >= 1;
        const sx = 230;
        const sy = 150;
        const oy = 255;
        const panels = [
          { ox: 50, name: 'ductile: copper, mild steel' },
          { ox: 360, name: 'brittle: glass, cast iron' },
        ];
        const specimen = (cx: number, e: number, broken: boolean, kind: 'ductile' | 'brittle') => {
          const half = 50 + 40 * e;
          const neck = kind === 'ductile' ? clamp((e - 0.75) / 0.17) : 0;
          const gap = broken ? (kind === 'ductile' ? 16 : 7) : 0;
          const wd = 9;
          return (
            <g>
              <rect className="kit-block" x={cx - half - 14} y={52} width={14} height={20} rx={2} />
              <rect className="kit-block" x={cx + half} y={52} width={14} height={20} rx={2} />
              {broken ? (
                <g>
                  <line className="fig-path" style={{ strokeWidth: wd }} x1={cx - half} x2={cx - gap / 2} y1={62} y2={62} />
                  <line className="fig-path" style={{ strokeWidth: wd }} x1={cx + gap / 2} x2={cx + half} y1={62} y2={62} />
                </g>
              ) : (
                <g>
                  <line className="fig-path" style={{ strokeWidth: wd }} x1={cx - half} x2={cx - 16} y1={62} y2={62} />
                  <line className="fig-path" style={{ strokeWidth: wd - 5 * neck }} x1={cx - 16} x2={cx + 16} y1={62} y2={62} />
                  <line className="fig-path" style={{ strokeWidth: wd }} x1={cx + 16} x2={cx + half} y1={62} y2={62} />
                </g>
              )}
              {broken && kind === 'brittle' && (
                <path className="fig-path" fill="none" d={`M${cx - 4} 56L${cx + 2} 60L${cx - 3} 64L${cx + 3} 68`} style={{ opacity: clamp(1 - (p * E_FRACTURE - 0.1) * 12) }} />
              )}
            </g>
          );
        };
        return (
          <g>
            {panels.map((pn, i) => {
              const e = i === 0 ? eD : eB;
              const broken = i === 0 ? brokenD : brokenB;
              const pts: [number, number][] = [];
              for (let k = 0; k <= 100; k++) {
                const ee = (e * k) / 100;
                const s = i === 0 ? ductile(ee) : 7.5 * ee;
                pts.push([pn.ox + ee * sx, oy - s * sy]);
              }
              return (
                <g key={pn.name}>
                  {specimen(pn.ox + 130, i === 0 ? eD : eB * 2.2, broken, i === 0 ? 'ductile' : 'brittle')}
                  <Axes x={pn.ox} y={oy} w={250} h={150} xLabel="strain" yLabel="stress" />
                  <Trail points={pts} />
                  <Ball x={pts[pts.length - 1][0]} y={pts[pts.length - 1][1]} r={4} glow={!broken} />
                  {broken && (
                    <Label x={pts[pts.length - 1][0] + 8} y={pts[pts.length - 1][1] - 8} anchor="start" kind="val">
                      breaks
                    </Label>
                  )}
                  <Label x={pn.ox + 130} y={26} kind="label">
                    {pn.name}
                  </Label>
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------- 6. shear

/** A block with the top face pushed sideways: it becomes a parallelogram. `numbers` shows the worked-example values. */
export function ShearBlock({ numbers }: { numbers?: boolean }) {
  return (
    <Anim title="A block fixed at its base is pushed sideways along its top face and leans over by the shear angle" height={260} loop={8}>
      {(t) => {
        const p = ease(phase(t, 0.6, 5));
        const x0 = 110;
        const y0 = 220;
        const w = 130;
        const h = 110;
        const phi = 0.34 * p;
        const dx = h * Math.tan(phi);
        const poly = `${x0},${y0} ${x0 + w},${y0} ${x0 + w + dx},${y0 - h} ${x0 + dx},${y0 - h}`;
        return (
          <g>
            <line className="fig-ground" x1={50} x2={330} y1={y0} y2={y0} />
            {Array.from({ length: 20 }, (_, i) => (
              <line key={i} className="fig-guide fig-faint" x1={56 + i * 14} y1={y0 + 2} x2={48 + i * 14} y2={y0 + 10} />
            ))}
            <Ghost x={x0} y={y0 - h} w={w} h={h} />
            <polygon className="kit-block" points={poly} />
            <Arrow x1={x0 + dx - 40 + (p > 0 ? 0 : 0)} y1={y0 - h - 12} x2={x0 + dx + 30 + 40 * p} y2={y0 - h - 12} label="F" />
            <Line x1={x0} y1={y0 - h - 26} x2={x0 + dx} y2={y0 - h - 26} tone="bright" />
            <Label x={x0 + dx / 2} y={y0 - h - 34} kind="sym">
              Δx
            </Label>
            <Line x1={x0 - 22} y1={y0} x2={x0 - 22} y2={y0 - h} />
            <Label x={x0 - 30} y={y0 - h / 2 + 6} anchor="end" kind="sym">
              h
            </Label>
            <path className="fig-guide" fill="none" d={`M${x0} ${y0 - 34}A34 34 0 0 1 ${x0 + 34 * Math.sin(phi)} ${y0 - 34 * Math.cos(phi)}`} />
            <Label x={x0 + 16} y={y0 - 42} kind="sym">
              φ
            </Label>
            {numbers ? (
              <g>
                <Row x1={370} x2={620} y={80} name="force F" value={`${f0(1e4 * p)} N`} />
                <Row x1={370} x2={620} y={110} name="shear stress F / A" value={`${f2(p)} MPa`} />
                <Row x1={370} x2={620} y={140} name="shear angle φ" value={`${f2(12.5 * p)} × 10⁻⁶ rad`} />
                <Row x1={370} x2={620} y={170} name="top slides Δx" value={`${f2(1.25 * p)} µm`} />
                <Label x={370} y={215} anchor="start" kind="label">
                  steel block 10 cm × 10 cm × 10 cm
                </Label>
                <Label x={370} y={235} anchor="start" kind="label">
                  the lean is drawn far larger than real
                </Label>
              </g>
            ) : (
              <g>
                <Row x1={370} x2={620} y={80} name="shear stress F / A" value={`${f2(p)} F`} />
                <Row x1={370} x2={620} y={110} name="shear strain Δx / h" value={`${f2(Math.tan(phi))}`} />
                <Row x1={370} x2={620} y={140} name="angle φ (rad)" value={`${f2(phi)}`} />
                <Label x={370} y={185} anchor="start" kind="label">
                  volume and height stay the same
                </Label>
                <Label x={370} y={205} anchor="start" kind="label">
                  only the shape changes
                </Label>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------- 7. volume

/** A cube squeezed from every side by a fluid; it keeps its shape but loses volume. */
export function BulkCube() {
  return (
    <Anim title="A cube is squeezed equally from all sides; it keeps its shape but its volume falls" height={260} loop={8}>
      {(t) => {
        const p = ease(phase(t, 0.6, 4.5));
        const k = 1 - 0.22 * p;
        const s0 = 100;
        const s = s0 * k;
        const cx = 190;
        const cy = 140;
        const face = (c: number, sz: number) => ({ x: c - sz / 2, y: cy - sz / 2 + sz * 0.18 });
        const f = face(cx, s);
        const d = s * 0.36;
        const f0p = face(cx, s0);
        const d0 = s0 * 0.36;
        const front = (x: number, y: number, sz: number, dd: number) => ({
          front: `${x},${y} ${x + sz},${y} ${x + sz},${y + sz} ${x},${y + sz}`,
          top: `${x},${y} ${x + dd},${y - dd} ${x + sz + dd},${y - dd} ${x + sz},${y}`,
          right: `${x + sz},${y} ${x + sz + dd},${y - dd} ${x + sz + dd},${y + sz - dd} ${x + sz},${y + sz}`,
        });
        const g = front(f0p.x, f0p.y, s0, d0);
        const c = front(f.x, f.y, s, d);
        const mid = (x: number, y: number) => [x, y] as const;
        void mid;
        const len = 18 + 28 * p;
        return (
          <g>
            <polygon className="fig-guide fig-dash" fill="none" points={g.front} />
            <polygon className="fig-guide fig-dash" fill="none" points={g.top} />
            <polygon className="fig-guide fig-dash" fill="none" points={g.right} />
            <polygon className="kit-block" points={c.front} />
            <polygon className="kit-block" points={c.top} style={{ fillOpacity: 0.3 }} />
            <polygon className="kit-block" points={c.right} style={{ fillOpacity: 0.15 }} />
            <Arrow x1={f.x - 4 - len} y1={f.y + s / 2} x2={f.x - 4} y2={f.y + s / 2} label="p" />
            <Arrow x1={f.x + s + d + 4 + len} y1={f.y + s / 2 - d / 2} x2={f.x + s + d + 4} y2={f.y + s / 2 - d / 2} />
            <Arrow x1={f.x + s / 2} y1={f.y + s + 4 + len} x2={f.x + s / 2} y2={f.y + s + 4} />
            <Arrow x1={f.x + s / 2 + d / 2} y1={f.y - d - 4 - len} x2={f.x + s / 2 + d / 2} y2={f.y - d - 4} />
            <Row x1={390} x2={620} y={80} name="pressure p" value={`${f0(100 * p)} MPa`} />
            <Row x1={390} x2={620} y={110} name="volume strain ΔV / V" value={`−${f2(0.0625 * p)} %`} />
            <Label x={390} y={155} anchor="start" kind="label">
              B = p / ( −ΔV / V )
            </Label>
            <Label x={390} y={180} anchor="start" kind="label">
              the squeeze is drawn far larger than real
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Example: a steel cube sinking in the sea; the pressure rises and the volume shrinks a little. */
export function DeepCube() {
  return (
    <Anim title="A steel cube sinks to ten kilometres under the sea; the pressure grows and the cube loses a little volume" height={270} loop={9}>
      {(t) => {
        const p = ease(phase(t, 0.6, 6));
        const y = 62 + 170 * p;
        const s = 30 * (1 - 0.0625 * p * 0.4);
        return (
          <g>
            <path className="fig-path" fill="none" d="M20 40Q45 32 70 40T120 40T170 40T220 40T270 40T320 40" />
            <rect x={20} y={40} width={300} height={220} fill="#fff" fillOpacity={0.05} />
            <Block x={170} y={y} w={s} h={s} filled />
            <Arrow x1={170 - s / 2 - 34} y1={y} x2={170 - s / 2 - 4} y2={y} />
            <Arrow x1={170 + s / 2 + 34} y1={y} x2={170 + s / 2 + 4} y2={y} />
            <Line x1={290} y1={40} x2={290} y2={y} tone="bright" />
            <Label x={284} y={(40 + y) / 2 + 5} anchor="end" kind="sym">
              h
            </Label>
            <Row x1={370} x2={620} y={80} name="depth h" value={`${f1(10 * p)} km`} />
            <Row x1={370} x2={620} y={110} name="pressure p = ρ · g · h" value={`${f0(100 * p)} MPa`} />
            <Row x1={370} x2={620} y={140} name="ΔV / V" value={`−${f2(0.0625 * p)} %`} />
            <Row x1={370} x2={620} y={170} name="volume lost" value={`${f2(0.625 * p)} cm³`} />
            <Label x={370} y={215} anchor="start" kind="label">
              1000 cm³ steel cube, B = 1.6 × 10¹¹ Pa
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------- 8. Poisson

export function Poisson() {
  return (
    <Anim title="A bar pulled lengthways gets longer and thinner; the sideways strain is a fraction of the lengthways strain" height={220} loop={8}>
      {(t) => {
        const p = ease(phase(t, 0.6, 4.5));
        const x0 = 90;
        const L0 = 300;
        const h0 = 44;
        const e = 0.3 * p;
        const nu = 0.3;
        const L = L0 * (1 + e * 0.6);
        const h = h0 * (1 - nu * e * 0.6 * 1.6);
        return (
          <g>
            <line className="fig-ground" x1={x0 - 12} x2={x0 - 12} y1={50} y2={170} />
            <Ghost x={x0} y={110 - h0 / 2} w={L0} h={h0} />
            <rect className="kit-block" x={x0} y={110 - h / 2} width={L} height={h} rx={2} />
            <Arrow x1={x0 + L + 4} y1={110} x2={x0 + L + 34 + 30 * p} y2={110} label="F" />
            <Label x={x0 + L / 2} y={200} kind="label">
              longer by ε
            </Label>
            <Label x={x0 + L + 50} y={110 - h0 / 2 - 6} kind="label" anchor="start">
              thinner by ν · ε
            </Label>
            <Readout>{`ν = 0.3`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------- 9. energy

/** A load–extension graph filling with area as the wire stretches: the area is the stored energy. */
export function EnergyStretch() {
  return (
    <Anim title="The area under the load against extension graph grows as the wire is stretched; it is the stored energy" height={260} loop={9}>
      {(t) => {
        const p = ease(phase(t, 0.6, 6));
        const ox = 240;
        const oy = 225;
        const gw = 340;
        const gh = 170;
        const px = ox + gw * p;
        const py = oy - gh * p;
        const top = 34;
        return (
          <g>
            <Ceil x1={40} x2={140} y={top} />
            <Wire x={90} y1={top} y2={top + 100 + 34 * p} />
            <Block x={90} y={top + 114 + 34 * p} w={30} h={20} />
            <Axes x={ox} y={oy} w={gw + 30} h={gh + 24} xLabel="extension x" yLabel="load F" />
            <Trail points={[[ox, oy], [ox + gw, oy - gh]]} tone="soft" />
            <polygon points={`${ox},${oy} ${px},${oy} ${px},${py}`} fill="#fff" fillOpacity={0.3} />
            <Trail points={[[ox, oy], [px, py]]} />
            <line className="fig-guide fig-dash" x1={px} x2={px} y1={py} y2={oy} />
            <line className="fig-guide fig-dash" x1={ox} x2={px} y1={py} y2={py} />
            <Ball x={px} y={py} r={4.5} />
            <Row x1={262} x2={440} y={70} name="F" value={`${f0(100 * p)} N`} />
            <Row x1={262} x2={440} y={96} name="x" value={`${f2(p)} mm`} />
            <Row x1={262} x2={440} y={122} name="U = ½ F x" value={`${f1(50 * p * p)} mJ`} />
          </g>
        );
      }}
    </Anim>
  );
}

/** Example: the two ways of counting the energy agree. */
export function EnergyBars() {
  return (
    <Anim title="The energy found from half force times extension equals the energy found from half stress times strain times volume" height={230} loop={8}>
      {(t) => {
        const p = ease(phase(t, 0.6, 4.5));
        const u = 0.05 * p;
        return (
          <g>
            <Label x={30} y={50} anchor="start" kind="label">
              ½ · F · x
            </Label>
            <Bar x={30} y={60} w={420} p={p} />
            <Label x={30} y={125} anchor="start" kind="label">
              ½ · σ · ε · V
            </Label>
            <Bar x={30} y={135} w={420} p={p} />
            <Label x={470} y={72} anchor="start" kind="val">
              {`${f2(u)} J`}
            </Label>
            <Label x={470} y={147} anchor="start" kind="val">
              {`${f2(u)} J`}
            </Label>
            <Label x={30} y={200} anchor="start" kind="label">
              the same wire: 100 N, 1 mm, 100 MPa, 5 × 10⁻⁴, 2 × 10⁻⁶ m³
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------- 10. cables

/** A crane lifts a load; the stress in the cable is a little higher while the load speeds up. */
export function CraneCable() {
  return (
    <Anim title="A crane lifts a load: the cable stress is slightly higher while the load speeds up and lower while it slows down" height={280} loop={9}>
      {(t) => {
        const q = phase(t, 1, 6);
        const v = 1 / 0.75;
        const sq = q < 0.25 ? 0.5 * (v / 0.25) * q * q : q < 0.75 ? 0.5 * v * 0.25 + v * (q - 0.25) : 1 - 0.5 * (v / 0.25) * (1 - q) ** 2;
        const a = q <= 0 || q >= 1 ? 0 : q < 0.25 ? 1 : q < 0.75 ? 0 : -1;
        const y = lerp(235, 120, sq);
        const stress = (2000 * (9.8 + a)) / 1.96e-4 / 1e6;
        const tx = 330;
        return (
          <g>
            <rect className="kit-block" x={80} y={50} width={14} height={200} />
            <line className="fig-bar" x1={60} x2={410} y1={56} y2={56} />
            <line className="fig-guide" x1={94} y1={56} x2={64} y2={78} />
            <Ball x={tx} y={56} r={3.5} glow={false} />
            <Wire x={tx} y1={56} y2={y - 14} w={2.5} />
            <Block x={tx} y={y} w={44} h={28} label="2000 kg" />
            <line className="fig-ground" x1={40} x2={420} y1={252} y2={252} />
            <Label x={460} y={80} anchor="start" kind="label">
              cable stress
            </Label>
            <Bar x={460} y={92} w={160} p={stress / 500} />
            <line className="fig-guide" x1={460 + 160 * (100 / 500)} x2={460 + 160 * (100 / 500)} y1={86} y2={112} />
            <Label x={460 + 160 * 0.2} y={126} kind="label">
              100
            </Label>
            <Label x={620} y={126} anchor="end" kind="label">
              500 MPa breaks
            </Label>
            <Row x1={460} x2={620} y={160} name="stress" value={`${f1(stress)} MPa`} />
            <Label x={460} y={190} anchor="start" kind="label">
              {a > 0 ? 'speeding up: a little more' : a < 0 ? 'slowing down: a little less' : 'steady: just the weight'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Example: making the cable thicker lowers the stress until it reaches the safe value. */
export function CableThickness() {
  return (
    <Anim title="The cable is made thicker; the stress falls until it reaches one fifth of the breaking stress" height={250} loop={9}>
      {(t) => {
        const p = ease(phase(t, 0.6, 6));
        const d = 6 + 9.8 * p;
        const area = (Math.PI * d * d) / 4;
        const stress = 19600 / area;
        const ok = stress <= 100.5;
        const bx = 330;
        return (
          <g>
            <circle className={ok ? 'fig-ball' : 'kit-block'} cx={120} cy={118} r={4 * d} style={ok ? { fillOpacity: 0.25 } : undefined} />
            <Line x1={120 - 4 * d} y1={118 + 4 * d + 14} x2={120 + 4 * d} y2={118 + 4 * d + 14} tone="bright" />
            <Label x={120} y={118 + 4 * d + 32} kind="val">
              {`d = ${f1(d)} mm`}
            </Label>
            <Label x={bx} y={60} anchor="start" kind="label">
              stress in the cable (MPa)
            </Label>
            <Bar x={bx} y={72} w={290} p={stress / 800} h={16} />
            <line className="fig-guide" x1={bx + 290 * (100 / 800)} x2={bx + 290 * (100 / 800)} y1={66} y2={96} />
            <line className="fig-guide fig-dash" x1={bx + 290 * (500 / 800)} x2={bx + 290 * (500 / 800)} y1={66} y2={96} />
            <Label x={bx + 290 * (100 / 800)} y={112} kind="label">
              safe 100
            </Label>
            <Label x={bx + 290 * (500 / 800)} y={112} kind="label">
              breaks 500
            </Label>
            <Row x1={bx} x2={620} y={160} name="stress σ = F / A" value={`${f0(stress)} MPa`} />
            <Label x={bx} y={190} anchor="start" kind="val">
              {ok ? 'safe: one fifth of breaking' : 'too thin'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------- 11. beams

/** A solid bar and an I-beam with the same amount of steel carry the same load; the I-beam sags far less. */
export function IBeam() {
  const ratio = 406656 / 65536;
  return (
    <Anim title="A solid bar and an I-beam with the same cross-section area carry the same load; the I-beam sags about six times less" height={290} loop={9}>
      {(t) => {
        const p = ease(phase(t, 0.6, 4.5));
        const rows = [
          { y: 78, sag: 38 * p, name: 'solid bar', sec: 'rect' },
          { y: 208, sag: (38 * p) / ratio, name: 'I-beam, same steel', sec: 'I' },
        ];
        const x1 = 150;
        const x2 = 490;
        const mid = (x1 + x2) / 2;
        return (
          <g>
            {rows.map((r) => {
              const pts: [number, number][] = [];
              for (let i = 0; i <= 40; i++) {
                const u = i / 40;
                const uu = u <= 0.5 ? u : 1 - u;
                pts.push([x1 + u * (x2 - x1), r.y + r.sag * (3 * uu - 4 * uu ** 3)]);
              }
              return (
                <g key={r.name}>
                  <path className="fig-cliff" d={`M${x1 - 8} ${r.y + 22}L${x1} ${r.y + 6}L${x1 + 8} ${r.y + 22}Z`} />
                  <path className="fig-cliff" d={`M${x2 - 8} ${r.y + 22}L${x2} ${r.y + 6}L${x2 + 8} ${r.y + 22}Z`} />
                  <Trail points={pts} />
                  <Arrow x1={mid} y1={r.y - 44 + r.sag} x2={mid} y2={r.y - 6 + r.sag} label="W" />
                  {r.sec === 'rect' ? <rect className="kit-block" x={42} y={r.y - 16} width={24} height={32} /> : <path className="kit-block" d={`M30 ${r.y - 30}h40v6h-17v48h17v6h-40v-6h17v-48h-17z`} />}
                  <Label x={r.sec === 'rect' ? 54 : 50} y={r.y + 56} kind="label">
                    {r.name}
                  </Label>
                  <Label x={x2 + 30} y={r.y + 4} anchor="start" kind="val">
                    {`sag ${f2(r.sag / 38)}`}
                  </Label>
                  {p > 0.6 && (
                    <g>
                      <Label x={mid} y={r.y + r.sag + 38} kind="label">
                        top squeezed, bottom stretched
                      </Label>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------- examples

/** Example 1: a ruler zooms in on the end of the wire to read its 1 mm extension. */
export function WireZoom() {
  return (
    <Anim title="A steel wire two metres long carries 100 newtons; zoomed in, its end moves down by one millimetre" height={260} loop={9}>
      {(t) => {
        const p = ease(phase(t, 0.6, 5));
        const top = 30;
        const L = 150;
        const ext = 4 * p;
        const my = 100 + 100 * p;
        void my;
        const zx = 330;
        const zy0 = 70;
        const pxPerMm = 120;
        return (
          <g>
            <Ceil x1={50} x2={140} y={top} />
            <Wire x={95} y1={top} y2={top + L + ext} w={2} />
            <Block x={95} y={top + L + ext + 14} w={30} h={20} />
            <rect className="fig-guide" fill="none" x={85} y={top + L - 8} width={20} height={16} />
            <line className="fig-guide fig-dash" x1={105} y1={top + L - 8} x2={zx} y2={zy0 - 20} />
            <line className="fig-guide fig-dash" x1={105} y1={top + L + 8} x2={zx} y2={zy0 + 150} />
            <rect className="fig-cell" x={zx} y={zy0 - 20} width={150} height={170} />
            {[0, 0.25, 0.5, 0.75, 1, 1.25].map((mm) => (
              <g key={mm}>
                <line className="fig-guide" x1={zx + 70} x2={zx + (mm % 1 === 0 ? 100 : 88)} y1={zy0 + mm * pxPerMm * 0.9 - 0} y2={zy0 + mm * pxPerMm * 0.9} />
                {mm % 1 === 0 && (
                  <Label x={zx + 108} y={zy0 + mm * pxPerMm * 0.9 + 5} anchor="start" kind="val">
                    {`${mm} mm`}
                  </Label>
                )}
              </g>
            ))}
            <line className="fig-path" style={{ strokeWidth: 4 }} x1={zx + 36} x2={zx + 36} y1={zy0 - 20} y2={zy0 + p * pxPerMm * 0.9} />
            <Arrow x1={zx + 12} y1={zy0 + p * pxPerMm * 0.9} x2={zx + 30} y2={zy0 + p * pxPerMm * 0.9} />
            <Row x1={500} x2={625} y={50} name="" value={`${f2(p)} mm`} />
            <Label x={50} y={246} anchor="start" kind="label">
              σ = 100 MPa, ε = 5 × 10⁻⁴
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Example 6: two wires, the same load, different length and thickness. */
export function TwoWires() {
  return (
    <Anim title="Two wires of the same metal carry the same load; the long thin one stretches eight times as much" height={270} loop={9}>
      {(t) => {
        const p = ease(phase(t, 0.6, 5));
        const items = [
          { x: 190, L: 70, w: 9, ext: 30 / 8, name: 'wire 1: length L, radius 2 r' },
          { x: 420, L: 140, w: 4.5, ext: 30, name: 'wire 2: length 2 L, radius r' },
        ];
        return (
          <g>
            {items.map((it) => (
              <g key={it.name}>
                <Ceil x1={it.x - 50} x2={it.x + 50} y={30} />
                <Wire x={it.x} y1={30} y2={30 + it.L + it.ext * p} w={it.w} />
                <line className="fig-guide fig-dash" x1={it.x - 30} x2={it.x + 30} y1={30 + it.L} y2={30 + it.L} />
                <Block x={it.x} y={30 + it.L + it.ext * p + 14} w={34} h={22} />
                <Label x={it.x} y={262} kind="label">
                  {it.name}
                </Label>
                <Label x={it.x + 46} y={30 + it.L + 4} anchor="start" kind="val">
                  {`ΔL = ${f1((it.ext / 3.75) * p)}`}
                </Label>
              </g>
            ))}
            <Readout>{`ΔL₁ : ΔL₂ = 1 : 8`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------- common mistakes

export function StressNotForce() {
  return (
    <Anim title="The same load on a thick and a thin wire: the thin one has a larger stress and breaks" height={170} loop={6}>
      {(t) => {
        const p = ease(phase(t, 0.4, 3));
        const broke = t > 3.6;
        return (
          <g>
            {[
              { x: 190, w: 10, name: 'thick: low stress' },
              { x: 450, w: 3, name: 'thin: high stress' },
            ].map((c, i) => (
              <g key={c.name}>
                <Ceil x1={c.x - 40} x2={c.x + 40} y={20} />
                {i === 1 && broke ? (
                  <g>
                    <Wire x={c.x} y1={20} y2={64} w={c.w} />
                    <Block x={c.x} y={120 + 30 * (t - 3.6) ** 2 * 6} w={26} h={18} />
                  </g>
                ) : (
                  <g>
                    <Wire x={c.x} y1={20} y2={80 + (i ? 28 : 5) * p} w={c.w} />
                    <Block x={c.x} y={94 + (i ? 28 : 5) * p} w={26} h={18} />
                  </g>
                )}
                <Label x={c.x} y={160} kind="label">
                  {c.name}
                </Label>
              </g>
            ))}
            <Label x={320} y={70} kind="label">
              same F
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function YNotSize() {
  return (
    <Anim title="A wire twice as long stretches twice as much under the same stress, but the ratio of stress to strain, Y, is unchanged" height={170} loop={6}>
      {(t) => {
        const p = ease(phase(t, 0.4, 3));
        return (
          <g>
            {[
              { x: 150, L: 50, name: 'L' },
              { x: 330, L: 100, name: '2 L' },
            ].map((c) => (
              <g key={c.name}>
                <Ceil x1={c.x - 30} x2={c.x + 30} y={16} />
                <Wire x={c.x} y1={16} y2={16 + c.L + c.L * 0.1 * p} w={3} />
                <Block x={c.x} y={16 + c.L + c.L * 0.1 * p + 12} w={22} h={16} />
                <Label x={c.x} y={158} kind="label">
                  {`length ${c.name}`}
                </Label>
                <Label x={c.x + 18} y={20 + c.L} anchor="start" kind="val">
                  {`ΔL = ${f1(c.L * 0.1 * p * 0.2)}`}
                </Label>
              </g>
            ))}
            <Row x1={440} x2={625} y={70} name="strain" value="same" />
            <Row x1={440} x2={625} y={100} name="stress" value="same" />
            <Row x1={440} x2={625} y={130} name="Y" value="same" />
          </g>
        );
      }}
    </Anim>
  );
}

export function StiffNotElastic() {
  return (
    <Anim title="Under the same stress rubber strains hugely and steel hardly at all; steel is stiffer, not less elastic" height={170} loop={6}>
      {(t) => {
        const p = ease(phase(t, 0.4, 2.6)) - ease(phase(t, 3.4, 5.4));
        return (
          <g>
            <Label x={30} y={54} anchor="start" kind="label">
              steel
            </Label>
            <Bar x={110} y={42} w={90 + 0.5 * p} p={1} h={16} />
            <rect x={110 + 90} y={42} width={1 + 0.5 * p} height={16} fill="#fff" />
            <Label x={30} y={104} anchor="start" kind="label">
              rubber
            </Label>
            <Bar x={110} y={92} w={90 + 190 * p} p={1} h={16} />
            <Label x={110} y={142} anchor="start" kind="label">
              same stress: both return to their length when it is removed
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function BulkSign() {
  return (
    <Anim title="Squeezing a cube makes the volume change negative, so the minus sign in the bulk modulus keeps B positive" height={170} loop={6}>
      {(t) => {
        const p = ease(phase(t, 0.4, 2.8));
        const s = 70 * (1 - 0.25 * p);
        return (
          <g>
            <Ghost x={150 - 35} y={90 - 35} w={70} h={70} />
            <Block x={150} y={90} w={s} h={s} />
            <Arrow x1={60} y1={90} x2={150 - s / 2 - 6} y2={90} />
            <Arrow x1={240} y1={90} x2={150 + s / 2 + 6} y2={90} />
            <Row x1={340} x2={620} y={60} name="ΔV" value={`−${f2(0.25 * p * 100)} %`} />
            <Row x1={340} x2={620} y={95} name="p" value="positive" />
            <Row x1={340} x2={620} y={130} name="B = − p · V / ΔV" value="positive" />
          </g>
        );
      }}
    </Anim>
  );
}

export function HookeLimit() {
  return (
    <Anim title="The stress against strain line is straight only up to the proportional limit; after that it bends away" height={170} loop={7}>
      {(t) => {
        const p = phase(t, 0.5, 5);
        const e = p * 0.6;
        const ox = 60;
        const oy = 145;
        const pts: [number, number][] = [];
        for (let i = 0; i <= 60; i++) {
          const ee = (e * i) / 60;
          pts.push([ox + ee * 420, oy - ductile(ee) * 110]);
        }
        const last = pts[pts.length - 1];
        return (
          <g>
            <Axes x={ox} y={oy} w={290} h={125} xLabel="strain" yLabel="stress" />
            <Trail points={[[ox, oy], [ox + 0.4 * 420, oy - 1.2 * 110]]} tone="soft" dashed />
            <Trail points={pts} />
            <Ball x={last[0]} y={last[1]} r={4} />
            <line className="fig-guide fig-dash" x1={ox + 0.2 * 420} x2={ox + 0.2 * 420} y1={oy - 66} y2={oy} />
            <Label x={ox + 0.2 * 420} y={oy + 16} kind="sym">
              P
            </Label>
            <Label x={420} y={60} anchor="start" kind="label">
              Hooke's law holds only up to P
            </Label>
            <Label x={420} y={84} anchor="start" kind="val">
              {e < 0.2 ? 'straight line' : 'no longer straight'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function HalfFactor() {
  return (
    <Anim title="The area under the load graph is a triangle, half of the rectangle F times x" height={170} loop={6}>
      {(t) => {
        const p = ease(phase(t, 0.4, 3));
        const ox = 80;
        const oy = 145;
        const w = 200 * p;
        const h = 110 * p;
        return (
          <g>
            <Axes x={ox} y={oy} w={260} h={125} xLabel="x" yLabel="F" />
            <rect className="fig-guide fig-dash" fill="none" x={ox} y={oy - h} width={w} height={h} />
            <polygon points={`${ox},${oy} ${ox + w},${oy} ${ox + w},${oy - h}`} fill="#fff" fillOpacity={0.4} />
            <Label x={ox + 8 + w / 2 + 130} y={70} anchor="start" kind="label">
              dashed box: F · x
            </Label>
            <Label x={ox + 8 + w / 2 + 130} y={96} anchor="start" kind="val">
              shaded: ½ · F · x
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}
