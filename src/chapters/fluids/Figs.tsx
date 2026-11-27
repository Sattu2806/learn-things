import type { ReactNode } from 'react';
import { Anim, Arrow, Ball, Block, Label, Line, Readout, Trail, Axes, Spring, clamp, lerp, ease, phase, DEG } from '../kit/Anim';

/** Animated diagrams for the fluids chapter. Every position is worked out from the real physics. */

const WATER = 'rgba(255,255,255,0.08)';
const WATER2 = 'rgba(255,255,255,0.16)';
const P0 = 101300;
const RHO = 1000;
const G = 9.8;

function Water({ x, y, w, h, deep }: { x: number; y: number; w: number; h: number; deep?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={deep ? WATER2 : WATER} />
      <line className="fig-guide" x1={x} x2={x + w} y1={y} y2={y} />
    </g>
  );
}

function Dial({ x, y, v, r = 18, label }: { x: number; y: number; v: number; r?: number; label?: ReactNode }) {
  const a = (-130 + 260 * clamp(v)) * DEG;
  return (
    <g>
      <circle className="kit-block" cx={x} cy={y} r={r} />
      <line className="fig-bar" x1={x} y1={y} x2={x + (r - 4) * Math.sin(a)} y2={y - (r - 4) * Math.cos(a)} />
      <circle className="fig-ball" cx={x} cy={y} r={2} />
      {label && (
        <Label x={x} y={y + r + 15} kind="val">
          {label}
        </Label>
      )}
    </g>
  );
}

// ------------------------------------------------------------------ steady flow helper

/** Particles that move with a speed that depends on x. Equal time gaps between particles. */
function makeFlow(speed: (x: number) => number, x0: number, x1: number) {
  const M = 320;
  const xs: number[] = [];
  const ts: number[] = [];
  let acc = 0;
  for (let i = 0; i <= M; i++) {
    const x = x0 + ((x1 - x0) * i) / M;
    xs.push(x);
    ts.push(acc);
    if (i < M) acc += (x1 - x0) / M / speed(x + (x1 - x0) / M / 2);
  }
  const T = acc;
  const at = (tau: number) => {
    const s = ((tau % T) + T) % T;
    let lo = 0;
    let hi = M;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (ts[mid] <= s) lo = mid;
      else hi = mid;
    }
    return lerp(xs[lo], xs[hi], (s - ts[lo]) / (ts[hi] - ts[lo] || 1));
  };
  return { T, at };
}
const loopFor = (T: number, n: number, min = 5) => Math.ceil(min / (T / n)) * (T / n);

// ------------------------------------------------------------------ 1. pressure = force over area

export function PressureArea({ height = 220 }: { height?: number }) {
  return (
    <Anim title="The same push over a smaller and smaller area presses much harder into the ground" height={height} loop={6.5}>
      {(t) => {
        const s = ease(phase(t, 0.8, 3)) - ease(phase(t, 4, 5.8));
        const w = 110 - 96 * s;
        const area = 100 * (w / 110) ** 2;
        const p = 100 / (area / 1e4) / 1e3;
        const dent = 4 + 24 * s;
        const cx = 260;
        const gy = 150;
        const by = gy + dent;
        const pts: [number, number][] = [[0, gy], [cx - w / 2 - 14, gy], [cx - w / 2, by], [cx + w / 2, by], [cx + w / 2 + 14, gy], [640, gy]];
        return (
          <g>
            <rect x={0} y={gy} width={640} height={height - gy} fill={WATER} />
            <Trail points={pts} />
            <path className="kit-block is-filled" d={`M${cx - 60} ${by - 90}L${cx + 60} ${by - 90}L${cx + w / 2} ${by}L${cx - w / 2} ${by}Z`} />
            <Arrow x1={cx} y1={by - 140} x2={cx} y2={by - 96} label="F" />
            <Label x={470} y={70} kind="val" anchor="start">
              F = 100 N
            </Label>
            <Label x={470} y={96} kind="val" anchor="start">
              A = {area.toFixed(1)} cm²
            </Label>
            <Label x={470} y={122} kind="val" anchor="start">
              p = {p.toFixed(0)} kPa
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 2. pressure with depth

export function Diver({ maxDepth = 30, height = 290 }: { maxDepth?: number; height?: number }) {
  const pmax = P0 + RHO * G * maxDepth;
  return (
    <Anim title="A diver goes deeper and the pressure gauge reading rises in a straight line" height={height} loop={7}>
      {(t) => {
        const h = maxDepth * ease(phase(t, 0.5, 4.8));
        const p = P0 + RHO * G * h;
        const top = 44;
        const span = height - 84;
        const y = top + 12 + (span - 24) * (h / maxDepth);
        const len = 6 + 14 * (p / pmax);
        const gx = 400;
        const gy = height - 40;
        const gw = 190;
        const gh = height - 110;
        return (
          <g>
            <Water x={30} y={top} w={270} h={span} />
            <Label x={36} y={top - 8} kind="label" anchor="start">
              surface: p₀
            </Label>
            <Arrow x1={170} y1={top - 30} x2={170} y2={top - 3} tone="soft" />
            <Ball x={170} y={y} r={8} />
            <Arrow x1={170} y1={y - 12 - len} x2={170} y2={y - 12} />
            <Arrow x1={170} y1={y + 12 + len} x2={170} y2={y + 12} />
            <Arrow x1={170 - 12 - len} y1={y} x2={170 - 12} y2={y} />
            <Arrow x1={170 + 12 + len} y1={y} x2={170 + 12} y2={y} />
            <Axes x={gx + 20} y={gy} w={gw} h={gh} xLabel="h" yLabel="p" />
            <Trail points={[[gx + 20, gy - (gh * P0) / pmax], [gx + 20 + (gw - 20) * (h / maxDepth), gy - (gh * p) / pmax]]} />
            <Trail points={[[gx + 20, gy - (gh * P0) / pmax], [gx + 20 + gw - 20, gy - (gh * pmax) / pmax]]} tone="faint" dashed />
            <Ball x={gx + 20 + (gw - 20) * (h / maxDepth)} y={gy - (gh * p) / pmax} r={5} />
            <Label x={gx + 14} y={gy - (gh * P0) / pmax + 4} kind="sym" anchor="end">
              p₀
            </Label>
            <Dial x={gx - 30} y={50} v={p / pmax} r={20} />
            <Label x={gx + 4} y={44} kind="val" anchor="start">
              h = {h.toFixed(1)} m
            </Label>
            <Label x={gx + 4} y={64} kind="val" anchor="start">
              p = {(p / 1e5).toFixed(2)} × 10⁵ Pa
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 3. barometer, manometer

export function Barometer() {
  return (
    <Anim title="A mercury barometer: the air pressure holds the mercury up to about 760 millimetres" height={290} loop={7}>
      {(t) => {
        const col = 200 * ease(phase(t, 1.2, 3.6));
        const cx = 220;
        const surf = 225;
        return (
          <g>
            <rect x={110} y={surf} width={220} height={40} fill={WATER2} />
            <line className="fig-guide" x1={110} x2={330} y1={surf} y2={surf} />
            <rect x={cx - 12} y={surf - col} width={24} height={col + 22} fill={WATER2} />
            <path className="fig-path" d={`M${cx - 12} 22V${surf + 22}M${cx + 12} 22V${surf + 22}M${cx - 12} 22H${cx + 12}`} fill="none" />
            {[0, 1].map((i) => {
              const k = phase(t, 0.2 + i * 0.1, 1);
              return [140, 300].map((x) => <Arrow key={`${i}${x}`} x1={x - 6 + i * 22} y1={surf - 50 * k} x2={x - 6 + i * 22} y2={surf - 6} tone="bright" />);
            })}
            <Label x={160} y={surf - 62} kind="sym">
              p₀
            </Label>
            {phase(t, 3.6, 4.2) > 0 && (
              <Label x={cx + 20} y={42} kind="label" anchor="start">
                vacuum
              </Label>
            )}
            <Line x1={268} y1={surf - 200} x2={268} y2={surf} tone="soft" />
            <Line x1={cx + 12} y1={surf - 200} x2={274} y2={surf - 200} tone="faint" dashed />
            <Label x={284} y={surf - 96} kind="sym" anchor="start">
              h = 0.76 m
            </Label>
            <Label x={400} y={90} kind="label" anchor="start">
              mercury: 13 600 kg/m³
            </Label>
            <Label x={400} y={124} kind="sym" anchor="start">
              p₀ = ρ · g · h
            </Label>
            <Label x={400} y={156} kind="val" anchor="start">
              13 600 × 9.8 × 0.76
            </Label>
            <Label x={400} y={184} kind="val" anchor="start">
              = {phase(t, 3.6, 4.4) > 0.5 ? '1.01 × 10⁵ Pa' : '…'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Manometer() {
  return (
    <Anim title="A U-tube manometer: the difference in the liquid levels measures the gas pressure above the air pressure" height={250} loop={8}>
      {(t) => {
        const d = 46 * Math.sin((2 * Math.PI * t) / 8);
        const yl = 120 - d / 2;
        const yr = 120 + d / 2;
        const sign = d > 6 ? 'gas pressure above p₀' : d < -6 ? 'gas pressure below p₀' : 'gas pressure = p₀';
        return (
          <g>
            <path d={`M218 ${yl}H242V182H318V${yr}H342V204H218Z`} fill={WATER2} />
            <path className="fig-path" d="M218 60V204H342V60M242 60V182H318V60" fill="none" />
            <line className="fig-guide" x1={218} x2={242} y1={yl} y2={yl} />
            <line className="fig-guide" x1={318} x2={342} y1={yr} y2={yr} />
            <path className="fig-path" d="M330 60V40H430" fill="none" />
            <rect className="kit-block" x={430} y={14} width={110} height={52} rx={6} />
            <Label x={485} y={46} kind="label">
              gas, p
            </Label>
            <Label x={230} y={48} kind="label">
              open: p₀
            </Label>
            <Line x1={190} y1={yl} x2={190} y2={yr} tone="bright" />
            <Line x1={180} y1={yl} x2={202} y2={yl} tone="soft" />
            <Line x1={180} y1={yr} x2={202} y2={yr} tone="soft" />
            <Label x={176} y={124} kind="sym" anchor="end">
              h
            </Label>
            <Label x={400} y={130} kind="sym" anchor="start">
              p − p₀ = ρ · g · h
            </Label>
            <Label x={400} y={162} kind="label" anchor="start">
              {sign}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 4. hydraulic lift

export function Lift({ wS = 28, wB = 112, push = 64, caption = 'car' }: { wS?: number; wB?: number; push?: number; caption?: string }) {
  const ratio = (wB / wS) ** 2;
  return (
    <Anim title="A hydraulic lift: a small piston pushed a long way lifts a big piston a short way" height={270} loop={6}>
      {(t) => {
        const k = ease(phase(t, 0.8, 3.6)) - ease(phase(t, 4.4, 5.6));
        const d1 = push * k;
        const d2 = d1 / ratio;
        const c1 = 130;
        const c2 = 390;
        const y1 = 140 + d1;
        const y2 = 140 - d2;
        const fa = phase(t, 0.2, 0.8);
        return (
          <g>
            <rect x={c1 - wS / 2} y={y1} width={wS} height={204 - y1} fill={WATER2} />
            <rect x={c1 + wS / 2} y={184} width={c2 - wB / 2 - c1 - wS / 2} height={20} fill={WATER2} />
            <rect x={c2 - wB / 2} y={y2} width={wB} height={204 - y2} fill={WATER2} />
            <path className="fig-path" d={`M${c1 - wS / 2} 70V204H${c2 + wB / 2}V70M${c1 + wS / 2} 70V184H${c2 - wB / 2}V70`} fill="none" />
            <rect className="kit-block is-filled" x={c1 - wS / 2 + 1} y={y1 - 8} width={wS - 2} height={8} />
            <Line x1={c1} y1={y1 - 8} x2={c1} y2={y1 - 62} tone="bright" />
            <rect className="kit-block is-filled" x={c2 - wB / 2 + 1} y={y2 - 8} width={wB - 2} height={8} />
            <Block x={c2} y={y2 - 24} w={wB * 0.62} h={26} label={caption} />
            {fa > 0 && <Arrow x1={c1} y1={y1 - 62 - 22 * fa} x2={c1} y2={y1 - 64} label="F₁" />}
            {fa > 0 && <Arrow x1={c2 + wB / 2 + 24} y1={y2 - 8 - 60 * fa} x2={c2 + wB / 2 + 24} y2={y2 - 8} label="F₂" tone="bright" />}
            <Label x={c1} y={228} kind="sym">
              A₁
            </Label>
            <Label x={c2} y={228} kind="sym">
              A₂
            </Label>
            <Label x={500} y={92} kind="val" anchor="start">
              d₁ = {(d1 / 4).toFixed(0)} cm
            </Label>
            <Label x={500} y={116} kind="val" anchor="start">
              d₂ = {(d2 / 4).toFixed(1)} cm
            </Label>
            <Label x={500} y={150} kind="sym" anchor="start">
              F₂ / F₁ = {ratio.toFixed(0)}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 5. buoyancy and floating

export function SpringBalance({ height = 290 }: { height?: number }) {
  return (
    <Anim title="A block hangs from a spring balance and is lowered into water: the reading drops by the buoyant force" height={height} loop={7}>
      {(t) => {
        const ys = lerp(24, 112, ease(phase(t, 0.6, 4.2)));
        const L0 = 36 + 46;
        const wl = 176;
        const bh = 60;
        // iterate: spring length depends on the reading, the reading on the submerged depth
        let R = 10;
        let top = ys + L0;
        for (let i = 0; i < 6; i++) {
          top = ys + 36 + 46 * (R / 10);
          const sub = clamp((top + bh - wl) / bh);
          R = 10 - 4 * sub;
        }
        const B = 10 - R;
        const cy = top + bh / 2;
        return (
          <g>
            <Water x={100} y={wl} w={280} h={height - wl - 14} />
            <path className="fig-path" d={`M100 ${wl - 36}V${height - 14}H380V${wl - 36}`} fill="none" />
            <Line x1={240} y1={0} x2={240} y2={ys} tone="bright" />
            <rect className="kit-block" x={224} y={ys} width={32} height={22} rx={3} />
            <Label x={240} y={ys + 16} kind="val">
              {R.toFixed(1)}
            </Label>
            <Spring x1={240} y1={ys + 22} x2={240} y2={top} coils={5} width={7} />
            <Block x={240} y={cy} w={60} h={bh} label="block" />
            <Arrow x1={290} y1={cy} x2={290} y2={cy + 4 * 10} label="W" />
            {B > 0.1 && <Arrow x1={314} y1={cy} x2={314} y2={cy - 4 * B} label="B" />}
            <Label x={430} y={90} kind="val" anchor="start">
              W = 10.0 N
            </Label>
            <Label x={430} y={118} kind="val" anchor="start">
              B = {B.toFixed(1)} N
            </Label>
            <Label x={430} y={146} kind="val" anchor="start">
              reading = {R.toFixed(1)} N
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Floating({ fixed, label = 'block', height = 250 }: { fixed?: number; label?: string; height?: number }) {
  return (
    <Anim title="A block floats with the fraction of it under water equal to the density of the block divided by the density of the liquid" height={height} loop={8}>
      {(t) => {
        const tri = ease(phase(t, 0.5, 3.5)) - ease(phase(t, 4.5, 7.5));
        const f = fixed ?? lerp(0.25, 0.9, tri);
        const bob = fixed ? 3 * Math.sin((2 * Math.PI * t * 2) / 8) * Math.exp(-t / 3) : 0;
        const wl = 120;
        const bh = 70;
        const top = wl - (1 - f) * bh + bob;
        const cx = 200;
        return (
          <g>
            <Water x={60} y={wl} w={290} h={height - wl - 14} />
            <path className="fig-path" d={`M60 ${wl - 30}V${height - 14}H350V${wl - 30}`} fill="none" />
            <rect className="kit-block" x={cx - 55} y={top} width={110} height={bh} rx={3} />
            <rect x={cx - 54} y={wl} width={108} height={Math.max(0, top + bh - wl)} fill="rgba(255,255,255,0.22)" />
            <Label x={cx} y={top + 22} kind="sym">
              {label}
            </Label>
            <Arrow x1={cx - 78} y1={top + bh / 2} x2={cx - 78} y2={top + bh / 2 + 18 + 40 * f} label="W" />
            <Arrow x1={cx + 78} y1={top + bh / 2 + 18 + 40 * f} x2={cx + 78} y2={top + bh / 2} label="B" />
            <Label x={420} y={86} kind="sym" anchor="start">
              ρ_body / ρ_fluid = {f.toFixed(2)}
            </Label>
            <Label x={420} y={116} kind="val" anchor="start">
              under water: {(f * 100).toFixed(0)}%
            </Label>
            <Label x={420} y={146} kind="label" anchor="start">
              W = B  (weight balances)
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 6, 7. flow in a narrowing pipe

export function PipeFlow({ tubes, arrows, height = 280, cy: cyIn, h1 = 100, h2 = 50 }: { tubes?: boolean; arrows?: boolean; height?: number; cy?: number; h1?: number; h2?: number }) {
  const cy = cyIn ?? (tubes ? height - 100 : height / 2);
  const hAt = (x: number) => lerp(h1, h2, ease((x - 200) / 100));
  const speed = (x: number) => 40 * (h1 / hAt(x)) ** 2;
  const flow = makeFlow(speed, 20, 620);
  const N = 6;
  const loop = loopFor(flow.T, N, 7);
  const lanes = [-0.75, -0.25, 0.25, 0.75];
  const top: [number, number][] = [];
  const bot: [number, number][] = [];
  for (let x = 20; x <= 620; x += 10) {
    top.push([x, cy - hAt(x) / 2]);
    bot.push([x, cy + hAt(x) / 2]);
  }
  const v1 = speed(0);
  const v2 = speed(620);
  const colH = (x: number) => 80 - 48 * ((speed(x) ** 2 - v1 ** 2) / (v2 ** 2 - v1 ** 2));
  const xa = 110;
  const xb = 480;
  return (
    <Anim title="Water flows through a pipe that narrows: the particles speed up in the narrow part and the pressure falls" height={height} loop={loop}>
      {(t) => {
        const on = ease(phase(t, 0, 1.2));
        const fall = ease(phase(t, 0.3, 2));
        return (
          <g>
            <Trail points={top} />
            <Trail points={bot} />
            {lanes.map((f) => (
              <Trail
                key={f}
                tone="faint"
                points={top.map(([x, y], i) => [x, cy + (f * (bot[i][1] - y)) / 1] as [number, number])}
              />
            ))}
            <g opacity={on}>
              {lanes.flatMap((f, li) =>
                Array.from({ length: N }, (_, k) => {
                  const x = flow.at(t + (k + li * 0.37) * (flow.T / N));
                  return <Ball key={`${li}-${k}`} x={x} y={cy + f * hAt(x)} r={3.6} glow={false} />;
                }),
              )}
            </g>
            {tubes &&
              [xa, xb].map((x, i) => {
                const hc = lerp(80, colH(x), fall);
                const yt = cy - hAt(x) / 2;
                return (
                  <g key={x}>
                    <rect x={x - 8} y={yt - hc} width={16} height={hc} fill={WATER2} />
                    <path className="fig-path" d={`M${x - 8} ${yt - 96}V${yt}M${x + 8} ${yt - 96}V${yt}`} fill="none" />
                    <line className="fig-guide" x1={x - 8} x2={x + 8} y1={yt - hc} y2={yt - hc} />
                    <Label x={x + 20} y={yt - hc + 4} kind="sym" anchor="start">
                      p{i === 0 ? '₁' : '₂'}
                    </Label>
                  </g>
                );
              })}
            {(arrows ?? !tubes) && (
              <g>
                {[xa, xb].map((x) => (
                  <line key={x} className="fig-guide fig-dash" x1={x} x2={x} y1={cy - hAt(x) / 2 - 8} y2={cy + hAt(x) / 2 + 8} />
                ))}
                <Arrow x1={xa - 30} y1={cy + h1 / 2 + 30} x2={xa - 30 + v1} y2={cy + h1 / 2 + 30} label="v₁" />
                <Arrow x1={xb - 60} y1={cy + h1 / 2 + 30} x2={xb - 60 + v2} y2={cy + h1 / 2 + 30} label={`v₂ = ${(v2 / v1).toFixed(0)} v₁`} />
                <Label x={xa} y={cy - h1 / 2 - 14} kind="sym">
                  A₁
                </Label>
                <Label x={xb} y={cy - h1 / 2 + (h1 - h2) / 2 - 14} kind="sym">
                  A₂
                </Label>
              </g>
            )}
            {tubes && (
              <Label x={620} y={22} kind="label" anchor="end">
                fast water: lower pressure
              </Label>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 8. wing and spinning ball

export function Wing() {
  const cy = 130;
  const g = (x: number) => Math.exp(-(((x - 320) / 95) ** 2));
  const lanesTop = [-42, -70, -98];
  const lanesBot = [40, 68, 98];
  const yOf = (y0: number, x: number) => cy + y0 + (y0 < 0 ? -34 * Math.exp(-Math.abs(y0) / 70) * g(x) : 10 * Math.exp(-y0 / 80) * g(x));
  const mult = (y0: number, x: number) => (y0 < 0 ? 1 + 0.9 * Math.exp(-Math.abs(y0) / 80) * g(x) : 1 - 0.22 * g(x));
  const flows = new Map<number, ReturnType<typeof makeFlow>>();
  [...lanesTop, ...lanesBot].forEach((y0) => flows.set(y0, makeFlow((x) => 110 * mult(y0, x), 0, 640)));
  const N = 7;
  const T0 = flows.get(-42)!.T;
  const loop = loopFor(T0, N, 6);
  const foil = (u: number) => [220 + 200 * u, cy - 70 * Math.sqrt(u) * (1 - u) * 0.9] as [number, number];
  const foilB = (u: number) => [220 + 200 * u, cy + 70 * Math.sqrt(u) * (1 - u) * 0.25] as [number, number];
  const us = Array.from({ length: 41 }, (_, i) => i / 40);
  const outline = [...us.map(foil), ...us.map(foilB).reverse()];
  return (
    <Anim title="Air flows over a wing: it speeds up on the curved top, the pressure there is lower, and the wing is pushed up" height={270} loop={loop}>
      {(t) => {
        const lift = ease(phase(t, 1, 2.6));
        return (
          <g>
            {[...lanesTop, ...lanesBot].map((y0) => (
              <Trail key={y0} tone="faint" points={Array.from({ length: 65 }, (_, i) => [i * 10, yOf(y0, i * 10)] as [number, number])} />
            ))}
            {[...lanesTop, ...lanesBot].flatMap((y0) => {
              const fl = flows.get(y0)!;
              return Array.from({ length: N }, (_, k) => {
                const x = fl.at(t * 1 + (k + (y0 % 5) * 0.11) * (fl.T / N));
                return <Ball key={`${y0}-${k}`} x={x} y={yOf(y0, x)} r={3.4} glow={false} />;
              });
            })}
            <g transform={`rotate(-8 320 ${cy})`}>
              <path className="kit-block is-filled" d={`M${outline.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`} />
            </g>
            {lift > 0 && <Arrow x1={330} y1={cy - 8} x2={330} y2={cy - 8 - 80 * lift} label="lift" />}
            <Label x={110} y={44} kind="label" anchor="start">
              fast air: low pressure
            </Label>
            <Label x={110} y={254} kind="label" anchor="start">
              slower air: higher pressure
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function SpinBall() {
  return (
    <Anim title="A spinning ball drags air round with it, so it curves: a topspin ball dips sooner than a plain one" height={190} loop={5}>
      {(t) => {
        const u = ease(phase(t, 0.3, 4));
        const x = 70 + 500 * u;
        const y = 50 + 90 * u * u;
        const spin = -10 * t;
        const trail: [number, number][] = Array.from({ length: 31 }, (_, i) => {
          const q = (i / 30) * u;
          return [70 + 500 * q, 50 + 90 * q * q] as [number, number];
        });
        return (
          <g>
            <Trail points={Array.from({ length: 31 }, (_, i) => [70 + (500 * i) / 30, 50 + (45 * i * i) / 900] as [number, number])} tone="faint" dashed />
            <Trail points={trail} />
            <Ball x={x} y={y} r={14} />
            <line className="fig-bar" x1={x} y1={y} x2={x + 14 * Math.cos(spin)} y2={y + 14 * Math.sin(spin)} />
            <circle className="fig-ghost" cx={x + 14 * Math.cos(spin)} cy={y + 14 * Math.sin(spin)} r={3} />
            <Label x={620} y={24} kind="label" anchor="end">
              plain: dashed
            </Label>
            <Label x={620} y={44} kind="label" anchor="end">
              topspin: dips sooner
            </Label>
            {u > 0.15 && <Arrow x1={x} y1={y + 20} x2={x} y2={y + 52} label="" tone="soft" />}
            <Label x={30} y={24} kind="label" anchor="start">
              ball moves →
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 9. viscosity

export function Couette() {
  return (
    <Anim title="A plate drags a layer of fluid; each layer drags the next, so the speed falls steadily to zero at the fixed bottom plate" height={230} loop={4}>
      {(t) => {
        const ys = [180, 150, 120, 90, 60].map((y) => y);
        return (
          <g>
            <Block x={320} y={44} w={440} h={10} filled />
            <line className="fig-ground" x1={100} x2={540} y1={190} y2={190} />
            {ys.map((y, i) =>
              Array.from({ length: 12 }, (_, k) => {
                const off = (40 * i * t) / 4;
                const x = 100 + ((k * 40 + off) % 480);
                if (x > 540) return null;
                return <line key={`${i}-${k}`} className="fig-guide" x1={x} x2={Math.min(540, x + 14)} y1={y} y2={y} />;
              }),
            )}
            {[1, 2, 3, 4].map((i) => (
              <Arrow key={i} x1={60} y1={190 - i * 32.5} x2={60 + 12 * i + 6} y2={190 - i * 32.5} tone="soft" />
            ))}
            <Arrow x1={560} y1={44} x2={616} y2={44} label="F" />
            <Label x={60} y={210} kind="label" anchor="start">
              fixed
            </Label>
            <Label x={22} y={30} kind="sym">
              v
            </Label>
            <Line x1={570} y1={54} x2={570} y2={190} tone="soft" />
            <Label x={590} y={126} kind="sym">
              d
            </Label>
            <Label x={320} y={24} kind="sym">
              plate, area A
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 10. terminal velocity, Reynolds

export function Terminal({ note }: { note?: string }) {
  return (
    <Anim title="A ball sinks through oil: the drag grows with speed until it balances the weight, then the speed stays steady" height={290} loop={8}>
      {(t) => {
        const tt = Math.min(t, 5.2);
        const y = 52 + 48 * (tt - (1 - Math.exp(-tt)));
        const v = 1 - Math.exp(-tt);
        const gx = 300;
        const gy = 250;
        const pts: [number, number][] = Array.from({ length: 41 }, (_, i) => {
          const s = (i / 40) * tt;
          return [gx + (s / 6) * 280, gy - 170 * (1 - Math.exp(-s))] as [number, number];
        });
        return (
          <g>
            <Water x={40} y={36} w={150} h={236} />
            <path className="fig-path" d="M40 20V272H190V20" fill="none" />
            <Arrow x1={140} y1={y} x2={140} y2={y + 44} label="W" />
            <Arrow x1={90} y1={y} x2={90} y2={y - 6 - 38 * v} label="B+D" />
            <Ball x={115} y={y} r={9} />
            <Axes x={gx} y={gy} w={300} h={190} xLabel="t" yLabel="v" />
            <Trail points={[[gx, gy - 170], [gx + 280, gy - 170]]} tone="faint" dashed />
            <Label x={gx - 6} y={gy - 166} kind="sym" anchor="end">
              v_t
            </Label>
            <Trail points={pts} />
            <Ball x={gx + (tt / 6) * 280} y={gy - 170 * v} r={5} />
            <Label x={620} y={100} kind="label" anchor="end">
              {note ?? (v > 0.95 ? 'terminal speed: W = B + D' : 'speeding up: W > B + D')}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Reynolds() {
  return (
    <Anim title="As the Reynolds number grows, smooth parallel streamlines break up into turbulent eddies" height={210} loop={8}>
      {(t) => {
        const re = 4200 * ease(phase(t, 0.5, 6.5));
        const amp = 15 * clamp((re - 2000) / 1500);
        const lines = [-60, -40, -20, 0, 20, 40, 60];
        return (
          <g>
            <Line x1={30} y1={30} x2={610} y2={30} tone="bright" />
            <Line x1={30} y1={170} x2={610} y2={170} tone="bright" />
            {lines.map((y0, i) => (
              <Trail
                key={y0}
                tone={i === 3 ? 'bright' : 'soft'}
                points={Array.from({ length: 59 }, (_, j) => {
                  const x = 30 + j * 10;
                  const k = x / 40;
                  const dy = amp * (Math.sin(k * 1.3 - 3 * t + i) + 0.6 * Math.sin(k * 2.9 + 4 * t + i * 2.1)) * (j / 58);
                  return [x, 100 + y0 + dy * (1 - Math.abs(y0) / 90)] as [number, number];
                })}
              />
            ))}
            <Readout x={610} y={198}>
              Re = {re.toFixed(0)} · {re < 2000 ? 'laminar' : re < 3000 ? 'unsteady' : 'turbulent'}
            </Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 11. surface tension

export function Molecules() {
  return (
    <Anim title="A molecule inside a liquid is pulled equally all round; one at the surface is pulled inward" height={230} loop={6}>
      {(t) => {
        const cols = 20;
        const rows = 4;
        const dots: ReactNode[] = [];
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++) {
            const x = 50 + c * 28 + (r % 2) * 14 + 2 * Math.sin((2 * Math.PI * (3 * t)) / 6 + c * 1.7 + r);
            const y = 124 + r * 26 + 2 * Math.sin((2 * Math.PI * (4 * t)) / 6 + c * 2.3 + r * 1.1);
            dots.push(<circle key={`${r}-${c}`} className="fig-ghost" cx={x} cy={y} r={6} />);
          }
        const a = phase(t, 0.5, 1.5);
        const b = phase(t, 2, 3);
        const net = phase(t, 3.4, 4.2);
        const arrow = (cx: number, cy: number, deg: number, i: number) => (
          <Arrow key={`${cx}${i}`} x1={cx} y1={cy} x2={cx + 24 * Math.cos(deg * DEG)} y2={cy + 24 * Math.sin(deg * DEG)} tone="soft" />
        );
        return (
          <g>
            {dots}
            <line className="fig-guide" x1={30} x2={610} y1={110} y2={110} />
            <Label x={40} y={98} kind="label" anchor="start">
              air
            </Label>
            <Ball x={176} y={176} r={6.5} />
            {a > 0.1 && [0, 60, 120, 180, 240, 300].map((d, i) => arrow(176, 176, d, i))}
            <Label x={176} y={222} kind="label">
              inside: forces cancel
            </Label>
            <Ball x={446} y={124} r={6.5} />
            {b > 0.1 && [0, 180, 45, 135].map((d, i) => arrow(446, 124, d, i))}
            {net > 0 && <Arrow x1={446} y1={124} x2={446} y2={124 + 40 * net} label="net" />}
            <Label x={446} y={222} kind="label">
              surface: pulled inward
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Film() {
  return (
    <Anim title="A soap film on a wire frame pulls a sliding bar up with a steady force, so stretching it stores energy" height={250} loop={6}>
      {(t) => {
        const y = lerp(100, 190, ease(phase(t, 0.6, 5)));
        const dA = (y - 100) / 90;
        return (
          <g>
            <rect x={200} y={40} width={240} height={y - 40} fill={WATER2} />
            <path className="fig-path" d="M440 40H200V222M440 40V222" fill="none" />
            <Block x={320} y={y} w={254} h={8} filled />
            <Arrow x1={470} y1={y} x2={470} y2={y + 44} label="F" />
            <Arrow x1={170} y1={y + 44} x2={170} y2={y} label="2Tl" labelAt="end" />
            <Line x1={200} y1={y + 22} x2={440} y2={y + 22} tone="faint" dashed />
            <Label x={320} y={32} kind="sym">
              l
            </Label>
            <Label x={500} y={60} kind="label" anchor="start">
              two surfaces: front and back
            </Label>
            <Label x={500} y={110} kind="val" anchor="start">
              extra area ΔA = {(dA * 2 * 0.24).toFixed(2)} m²
            </Label>
            <Label x={500} y={138} kind="sym" anchor="start">
              work = T · ΔA
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 12. capillary rise, 13. bubbles

export function CapTubes({ widths = [22], K = 2200, labels, height = 280, hLabel = 'h', tag }: { widths?: number[]; K?: number; labels?: string[]; height?: number; hLabel?: string; tag?: string }) {
  const n = widths.length;
  const xs = widths.map((_, i) => (n === 1 ? 220 : 120 + (i * 240) / (n - 1) + 40));
  return (
    <Anim title="Water climbs a thin tube: the narrower the tube, the higher it rises" height={height} loop={7}>
      {(t) => {
        const wl = height - 70;
        const k = ease(phase(t, 0.6, 4));
        const pull = phase(t, 0.3, 0.9);
        return (
          <g>
            <Water x={40} y={wl} w={560} h={56} />
            <path className="fig-path" d={`M40 ${wl - 20}V${wl + 56}H600V${wl - 20}`} fill="none" />
            {widths.map((w, i) => {
              const x = xs[i];
              const hh = Math.min(K / w, wl - 40) * k;
              const yt = wl - hh;
              const m = Math.min(7, w * 0.3);
              return (
                <g key={i}>
                  <rect x={x - w / 2} y={yt} width={w} height={hh + 20} fill={WATER2} />
                  <path className="fig-path" d={`M${x - w / 2} 30V${wl + 20}M${x + w / 2} 30V${wl + 20}`} fill="none" />
                  <path className="fig-bar" d={`M${x - w / 2} ${yt - m}Q${x} ${yt + m} ${x + w / 2} ${yt - m}`} fill="none" />
                  <Arrow x1={x - w / 2 - 2} y1={yt - m + 20 * pull} x2={x - w / 2 - 2} y2={yt - m - 2} tone="soft" />
                  <Arrow x1={x + w / 2 + 2} y1={yt - m + 20 * pull} x2={x + w / 2 + 2} y2={yt - m - 2} tone="soft" />
                  <Line x1={x + w / 2 + 14} y1={yt} x2={x + w / 2 + 14} y2={wl} tone="soft" />
                  <Label x={x + w / 2 + 24} y={(yt + wl) / 2 + 4} kind="sym" anchor="start">
                    {n === 1 ? hLabel : `h${i + 1}`}
                  </Label>
                  {labels && (
                    <Label x={x} y={wl + 40} kind="val">
                      {labels[i]}
                    </Label>
                  )}
                </g>
              );
            })}
            {n === 1 && (
              <Label x={430} y={90} kind="sym" anchor="start">
                {tag ?? 'T pulls the edge up'}
              </Label>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

export function Bubbles() {
  return (
    <Anim title="Two soap bubbles joined by a tube: the smaller bubble has the higher pressure, so air flows into the bigger one" height={240} loop={8}>
      {(t) => {
        const s = ease(phase(t, 0.8, 6));
        const V = 46 ** 3 + 62 ** 3;
        const r1 = lerp(46, 14, s);
        const r2 = Math.cbrt(V - r1 ** 3);
        const c1 = 150;
        const c2 = 470;
        const cy = 120;
        const dp = (r: number) => (4 * 0.025) / (r / 4000);
        return (
          <g>
            <circle className="kit-block" cx={c1} cy={cy} r={r1} />
            <circle className="kit-block" cx={c2} cy={cy} r={r2} />
            <Line x1={c1 + r1} y1={cy} x2={c2 - r2} y2={cy} tone="bright" />
            {s > 0 && s < 1 &&
              [0, 1, 2].map((k) => {
                const p = (t * 0.6 + k / 3) % 1;
                const xa = c1 + r1;
                const xb = c2 - r2;
                return <Ball key={k} x={lerp(xa, xb, p)} y={cy} r={3} glow={false} />;
              })}
            <Label x={c1} y={cy + 4} kind="sym">
              r₁
            </Label>
            <Label x={c2} y={cy + 4} kind="sym">
              r₂
            </Label>
            <Label x={c1} y={214} kind="val">
              Δp = {dp(r1).toFixed(1)} Pa
            </Label>
            <Label x={c2} y={214} kind="val">
              Δp = {dp(r2).toFixed(1)} Pa
            </Label>
            <Label x={320} y={30} kind="label">
              Δp = 4T / r
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ mistakes

const VESSELS: ((y: number) => number)[] = [
  (y) => 90 - 30 * y, // wide at the bottom, narrower at top (y: 0 bottom .. 1 top)
  () => 56,
  (y) => 36 + 56 * y,
];

export function Vessels() {
  return (
    <Anim title="Three vessels of different shapes filled to the same depth: the gauges at the bottom read the same" height={200} loop={6}>
      {(t) => {
        const lvl = ease(phase(t, 0.3, 3.5));
        const H = 100;
        const bot = 130;
        return (
          <g>
            {VESSELS.map((wf, i) => {
              const cx = 110 + i * 210;
              const steps = 20;
              const pts = (upTo: number, side: number) =>
                Array.from({ length: steps + 1 }, (_, j) => {
                  const q = (j / steps) * upTo;
                  return `${(cx + side * wf(q) / 2).toFixed(1)} ${(bot - q * H).toFixed(1)}`;
                });
              const left = pts(1, -1);
              const right = pts(1, 1);
              const wl = pts(lvl, -1);
              const wr = pts(lvl, 1);
              return (
                <g key={i}>
                  <path d={`M${wl.join('L')}L${wr.reverse().join('L')}Z`} fill={WATER2} />
                  <path className="fig-path" d={`M${left.join('L')}M${right.join('L')}M${left[0]}L${right[0]}`} fill="none" />
                  <Dial x={cx} y={bot + 38} v={lvl} r={16} label="same p" />
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

export function BuoyancyDepth() {
  return (
    <Anim title="Lowering a block: the buoyant force grows while it goes under, then stays the same however deep it goes" height={210} loop={6}>
      {(t) => {
        const y = lerp(70, 176, ease(phase(t, 0.5, 4.5)));
        const sub = clamp((y - 110) / 50);
        const gx = 340;
        const gy = 180;
        const dpt = (y - 70) / 106;
        const pts: [number, number][] = Array.from({ length: 31 }, (_, i) => {
          const q = (i / 30) * dpt;
          const yy = 70 + q * 106;
          return [gx + q * 240, gy - 110 * clamp((yy - 110) / 50)] as [number, number];
        });
        return (
          <g>
            <Water x={40} y={110} w={200} h={90} />
            <Block x={140} y={y - 25} w={56} h={50} />
            {sub > 0.02 && <Arrow x1={190} y1={y - 25} x2={190} y2={y - 25 - 44 * sub} label="B" />}
            <Axes x={gx} y={gy} w={260} h={130} xLabel="depth" yLabel="B" />
            <Trail points={pts} />
            <Ball x={pts[pts.length - 1][0]} y={pts[pts.length - 1][1]} r={5} />
          </g>
        );
      }}
    </Anim>
  );
}

export function PressureStack() {
  return (
    <Anim title="At 10 metres the total pressure is the air pressure plus the water pressure" height={210} loop={6}>
      {(t) => {
        const a = ease(phase(t, 0.4, 1.8));
        const b = ease(phase(t, 2.2, 3.6));
        const base = 185;
        const k = 0.8;
        return (
          <g>
            <line className="fig-ground" x1={180} x2={420} y1={base} y2={base} />
            <rect className="kit-block" x={240} y={base - 101.3 * k * a} width={70} height={101.3 * k * a} />
            <rect className="kit-block is-filled" x={240} y={base - 101.3 * k * a - 98 * k * b} width={70} height={98 * k * b} />
            {a > 0.9 && (
              <Label x={330} y={base - 50 * k} kind="val" anchor="start">
                p₀ = 101 kPa
              </Label>
            )}
            {b > 0.9 && (
              <Label x={330} y={base - 101.3 * k - 49 * k} kind="val" anchor="start">
                ρgh = 98 kPa
              </Label>
            )}
            {b > 0.9 && (
              <Label x={140} y={base - 199 * k * 0.5} kind="val" anchor="end">
                199 kPa
              </Label>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

export function SinkOrFloat() {
  return (
    <Anim title="A big log floats while a small stone sinks: it is density, not weight, that decides" height={220} loop={6}>
      {(t) => {
        const wl = 100;
        const k = ease(phase(t, 0.4, 2));
        const logTop = lerp(20, wl - 0.4 * 34 + 0, k) + 0;
        const bob = 3 * Math.sin(t * 5) * Math.exp(-(t - 1.4) * 1.2) * (t > 1.4 ? 1 : 0);
        const stoneY = lerp(30, 192, ease(phase(t, 0.4, 2.8)));
        return (
          <g>
            <Water x={30} y={wl} w={580} h={110} />
            <Block x={190} y={logTop + 17 + bob} w={150} h={34} label="log" />
            <Block x={450} y={stoneY} w={22} h={22} filled />
            <Label x={190} y={26} kind="val">
              600 kg/m³
            </Label>
            <Label x={450} y={26} kind="val">
              2600 kg/m³
            </Label>
            <Label x={320} y={206} kind="label">
              water: 1000 kg/m³
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}
