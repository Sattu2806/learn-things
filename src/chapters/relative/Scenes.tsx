import type { ReactNode } from 'react';
import { Anim, Arrow, Ball, Block, DEG, Label, Line, Readout, Trail, W, clamp, ease, lerp, phase } from '../kit/Anim';

/**
 * The animated diagrams of the relative-velocity chapter. Every picture runs
 * the real physics (positions are worked out from the velocities) and shows
 * what a given observer sees by sliding the picture along with them.
 */

const mod = (a: number, n: number) => ((a % n) + n) % n;
/** A symbol with a small subscript, for labels inside the SVG. */
const Sub = ({ v, s }: { v: string; s: string }) => (
  <>
    {v}
    <tspan dy={4} fontSize={13}>
      {s}
    </tspan>
  </>
);
/** Fades its children in over [a, b] seconds. */
const Show = ({ t, a, b = a + 0.5, children }: { t: number; a: number; b?: number; children: ReactNode }) => <g opacity={phase(t, a, b)}>{children}</g>;
/** A caption in the top-left corner that cross-fades between frames. */
const Caption = ({ items }: { items: [string, number][] }) => (
  <g>
    {items.map(([text, o]) => (
      <g key={text} opacity={o}>
        <Label x={14} y={24} kind="label" anchor="start">
          {text}
        </Label>
      </g>
    ))}
  </g>
);
/** Faint ground marks that slide past as the observer moves. */
function Ticks({ y, cam, step = 40, dir = 1 }: { y: number; cam: number; step?: number; dir?: 1 | -1 }) {
  const out: ReactNode[] = [];
  const off = mod(cam, step);
  for (let i = -1; i * step < W + step; i++) {
    const x = i * step - off;
    out.push(<Line key={i} x1={x} y1={y + 2} x2={x - 8 * dir} y2={y + 10} tone="faint" />);
  }
  return <g>{out}</g>;
}
const Wheel = ({ x, y }: { x: number; y: number }) => <circle className="kit-block" cx={x} cy={y} r={5} />;
const Car = ({ x, y, label }: { x: number; y: number; label: string }) =>
  x < -60 || x > W + 60 ? null : (
    <g>
      <Block x={x} y={y - 16} w={46} h={22} label={label} />
      <Wheel x={x - 13} y={y - 4} />
      <Wheel x={x + 13} y={y - 4} />
    </g>
  );
const grow = (x1: number, y1: number, x2: number, y2: number, p: number) => ({ x1, y1, x2: lerp(x1, x2, p), y2: lerp(y1, y2, p) });

// ------------------------------------------------------------------ 1. a ball dropped on a train

/** A ball dropped inside a moving train: a parabola from the ground, a straight line from the train. */
export function FrameDrop() {
  const H = 250;
  const gy = 215;
  const u = 34;
  const g = 110;
  const X0 = 110;
  const cycle = 2;
  const top = 122;
  const floor = 182;
  return (
    <Anim title="A ball dropped in a moving train. From the ground its path is a curve; from the train it falls straight down." height={H} loop={11.5}>
      {(t) => {
        const p = ease(phase(t, 4, 5.5)) - ease(phase(t, 9.5, 11));
        const train = (s: number) => X0 + u * s;
        const sx = (x: number, s: number) => x - p * (train(s) - X0);
        const c0 = Math.floor(t / cycle) * cycle;
        const tau = clamp(t - c0 - 0.5, 0, 2);
        const fallT = Math.sqrt((2 * (floor - top)) / g);
        const tf = Math.min(tau, fallT);
        const t0 = c0 + 0.5;
        const pts: [number, number][] = [];
        for (let i = 0; i <= 24; i++) {
          const q = (tf * i) / 24;
          pts.push([sx(train(t0 + q) - 34, t0 + q), top + 0.5 * g * q * q]);
        }
        const cx = sx(train(t), t);
        const ballY = top + 0.5 * g * tf * tf;
        const cam = p * (train(t) - X0);
        return (
          <g>
            <Line x1={0} y1={gy} x2={W} y2={gy} />
            <Ticks y={gy} cam={cam} />
            <rect className="kit-block" x={cx - 92} y={96} width={184} height={92} rx={4} />
            <Line x1={cx - 92} y1={floor + 6} x2={cx + 92} y2={floor + 6} tone="faint" />
            <Wheel x={cx - 56} y={gy - 8} />
            <Wheel x={cx + 56} y={gy - 8} />
            <circle className="fig-dot" cx={cx - 34} cy={top - 14} r={2.5} />
            {tf > 0.02 && <Trail points={pts} dashed tone="soft" />}
            <Ball x={sx(train(t) - 34, t)} y={ballY} />
            <Arrow x1={cx} y1={80} x2={cx + 2.2 * u * (1 - p)} y2={80} label={<Sub v="v" s="train" />} />
            <Caption
              items={[
                ['Seen from the ground', 1 - p],
                ['Seen from the train', p],
              ]}
            />
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 2. two cars, frame switch

type Frame = 'ground' | 'A' | 'B';
const FRAME_NAME: Record<Frame, string> = { ground: 'Seen from the ground', A: 'Seen from car A', B: 'Seen from car B' };

/** Two cars on a straight road; the picture slides from one frame to another. */
export function TwoCars({ vA, vB, gap, k = 3, frames = ['ground', 'A'], loop = 11, height = 230, title }: { vA: number; vB: number; gap: number; k?: number; frames?: [Frame, Frame]; loop?: number; height?: number; title: string }) {
  const road = height - 50;
  const x0A = 70;
  const x0B = x0A + gap;
  const vf = (f: Frame) => (f === 'ground' ? 0 : f === 'A' ? vA : vB);
  return (
    <Anim title={title} height={height} loop={loop}>
      {(t) => {
        const p = ease(phase(t, 3.6, 5));
        const camV = (1 - p) * vf(frames[0]) + p * vf(frames[1]);
        const camX = k * ((1 - p) * vf(frames[0]) + p * vf(frames[1])) * t; // frame position (approximate while sliding)
        const xA = x0A + k * vA * t - camX;
        const xB = x0B + k * vB * t - camX;
        const arrow = (x: number, v: number, label: string) => {
          const rel = v - camV;
          return (
            <g>
              <Arrow x1={x} y1={road - 46} x2={x + rel * k * 2.6} y2={road - 46} />
              {Math.abs(rel) > 0.4 && (
                <Label x={x + (rel > 0 ? 1 : -1) * 4} y={road - 56} kind="val" anchor="middle">
                  {label} {Math.abs(rel).toFixed(0)} m/s
                </Label>
              )}
            </g>
          );
        };
        return (
          <g>
            <Line x1={0} y1={road} x2={W} y2={road} />
            <Ticks y={road} cam={camX} />
            <Car x={xA} y={road} label="A" />
            <Car x={xB} y={road} label="B" />
            {arrow(xA, vA, '')}
            {arrow(xB, vB, '')}
            <Caption
              items={[
                [FRAME_NAME[frames[0]], 1 - p],
                [FRAME_NAME[frames[1]], p],
              ]}
            />
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 3. overtaking / meeting, in the slower car's frame

/** The faster car A closing a gap on B, in B's frame, with the ground distances counted alongside. */
export function Overtake({ vA, vB, gap0, after, height = 250, title }: { vA: number; vB: number; gap0: number; after: number; height?: number; title: string }) {
  const road = height - 56;
  const D = gap0 + after;
  const vr = vA - vB;
  const T = D / vr;
  const sc = Math.min(6, 300 / D);
  const bx = 120 + gap0 * sc;
  return (
    <Anim title={title} height={height} loop={T + 5} stillAt={T + 1}>
      {(t) => {
        const tau = clamp(t - 0.6, 0, T);
        const gap = gap0 - vr * tau;
        const ax = bx - gap * sc;
        const goal = bx + after * sc;
        return (
          <g>
            <Line x1={0} y1={road} x2={W} y2={road} />
            <Ticks y={road} cam={vB * tau * sc} />
            <Line x1={goal} y1={road - 62} x2={goal} y2={road + 2} dashed tone="soft" />
            <Label x={goal} y={road - 68} kind="label">
              {after > 0 ? `${after} m clear` : 'level'}
            </Label>
            <Car x={bx} y={road} label="B" />
            <Car x={ax} y={road} label="A" />
            <Line x1={ax} y1={road - 40} x2={bx} y2={road - 40} tone="soft" />
            <Line x1={ax} y1={road - 46} x2={ax} y2={road - 34} tone="soft" />
            <Line x1={bx} y1={road - 46} x2={bx} y2={road - 34} tone="soft" />
            <Label x={(ax + bx) / 2} y={road - 48} kind="val">
              {gap >= 0 ? `${gap.toFixed(0)} m behind` : `${(-gap).toFixed(0)} m ahead`}
            </Label>
            <Label x={14} y={24} kind="val" anchor="start">
              A has driven {(vA * tau).toFixed(0)} m
            </Label>
            <Label x={14} y={44} kind="val" anchor="start">
              B has driven {(vB * tau).toFixed(0)} m
            </Label>
            <Readout>t = {tau.toFixed(1)} s</Readout>
            <Label x={W - 12} y={44} kind="val" anchor="end">
              closing at {vr} m/s
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 4. vector subtraction

/** Two bodies moving on a plane, and the vector triangle that gives v_AB = v_A − v_B. */
export function VecSub({ vA = [3, 0], vB = [0, 4], sc = 20, title, height = 290 }: { vA?: [number, number]; vB?: [number, number]; sc?: number; title: string; height?: number }) {
  const rel: [number, number] = [vA[0] - vB[0], vA[1] - vB[1]];
  const speed = Math.hypot(rel[0], rel[1]);
  const ang = Math.atan2(rel[1], rel[0]) / DEG;
  const mx = Math.max(Math.abs(vA[0]), Math.abs(vB[0]), 1);
  return (
    <Anim title={title} height={height} loop={11}>
      {(t) => {
        const tau = Math.min(t, 6) * 0.75;
        const lp = 9;
        const a0 = [40, height - 150];
        const b0 = [150, height - 40];
        const A = [a0[0] + lp * vA[0] * tau, a0[1] - lp * vA[1] * tau];
        const B = [b0[0] + lp * vB[0] * tau, b0[1] - lp * vB[1] * tau];
        const O = [468, height / 2 - 20];
        const S = [O[0] + sc * vA[0], O[1] - sc * vA[1]];
        const R = [O[0] + sc * rel[0], O[1] - sc * rel[1]];
        const Bt = [O[0] + sc * vB[0], O[1] - sc * vB[1]];
        const mid = (a: number[], b: number[], off = 16) => {
          const dx = b[0] - a[0];
          const dy = b[1] - a[1];
          const L = Math.hypot(dx, dy) || 1;
          return [(a[0] + b[0]) / 2 - (dy / L) * off, (a[1] + b[1]) / 2 + (dx / L) * off + 6];
        };
        return (
          <g>
            <Line x1={310} y1={34} x2={310} y2={height - 20} tone="faint" />
            <Label x={14} y={24} kind="label" anchor="start">
              On the ground
            </Label>
            <Label x={330} y={24} kind="label" anchor="start">
              The vectors
            </Label>
            <Trail points={[a0 as [number, number], A as [number, number]]} tone="faint" dashed />
            <Trail points={[b0 as [number, number], B as [number, number]]} tone="faint" dashed />
            <Arrow x1={B[0]} y1={B[1]} x2={A[0]} y2={A[1]} dashed tone="soft" />
            <Ball x={A[0]} y={A[1]} />
            <Ball x={B[0]} y={B[1]} glow={false} />
            <Label x={A[0] - 4} y={A[1] - 14} kind="sym">
              A
            </Label>
            <Label x={B[0] + 14} y={B[1] + 6} kind="sym">
              B
            </Label>
            <Show t={t} a={0.3}>
              <Arrow x1={O[0]} y1={O[1]} x2={S[0]} y2={S[1]} label={<Sub v="v" s="A" />} />
            </Show>
            <Show t={t} a={1.4}>
              <Arrow x1={O[0]} y1={O[1]} x2={Bt[0]} y2={Bt[1]} label={<Sub v="v" s="B" />} tone="soft" />
            </Show>
            <Show t={t} a={2.6}>
              <Arrow {...grow(S[0], S[1], S[0] - sc * vB[0], S[1] + sc * vB[1], phase(t, 2.6, 3.4))} dashed tone="soft" />
              <Label x={S[0] + (vB[0] >= 0 ? -22 : 22) + (vB[0] === 0 ? mx * 0 + 28 : 0)} y={(S[1] + (S[1] + sc * vB[1])) / 2 + 6} kind="sym" anchor={vB[0] === 0 ? 'start' : 'middle'}>
                −<Sub v="v" s="B" />
              </Label>
            </Show>
            <Show t={t} a={3.9}>
              <Arrow {...grow(O[0], O[1], R[0], R[1], phase(t, 3.9, 4.8))} />
              <Label x={mid(O, R, -24)[0]} y={mid(O, R, -24)[1]} kind="sym">
                <Sub v="v" s="AB" />
              </Label>
            </Show>
            <Show t={t} a={5}>
              <Label x={O[0]} y={height - 22} kind="val">
                v_AB = {speed.toFixed(speed % 1 ? 1 : 0)} m/s, {Math.abs(ang).toFixed(1)}° {ang > 0 ? 'below' : 'above'} the x axis
              </Label>
            </Show>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 5. river and boat

/** A boat crossing a river, seen from the bank. mode: shortest time, shortest path, or both side by side. */
export function River({ mode, vb = 5, vw = 3, width = 100, height = 290, title }: { mode: 'time' | 'path' | 'both'; vb?: number; vw?: number; width?: number; height?: number; title: string }) {
  const far = 64;
  const near = height - 50;
  const pxm = (near - far) / width;
  const theta = Math.asin(vw / vb);
  const cross = Math.sqrt(vb * vb - vw * vw);
  const boats = [
    ...(mode !== 'path' ? [{ x0: mode === 'both' ? 130 : 240, up: 0, name: 'Straight across' }] : []),
    ...(mode !== 'time' ? [{ x0: mode === 'both' ? 400 : 300, up: theta, name: 'Aim upstream' }] : []),
  ];
  const Tmax = Math.max(...boats.map((b) => width / (b.up ? cross : vb)));
  const rate = 2;
  return (
    <Anim title={title} height={height} loop={Tmax / rate + 4.5} stillAt={Tmax / rate + 1}>
      {(t) => {
        const real = Math.min(t * rate, Tmax);
        const streaks: ReactNode[] = [];
        for (let r = 0; r < 6; r++)
          for (let c = 0; c < 6; c++) {
            const y = far + 24 + r * ((near - far - 40) / 5);
            const x = mod(c * 120 + (r % 2) * 60 + vw * pxm * real - 40, 760) - 60;
            streaks.push(<Line key={`${r}-${c}`} x1={x} y1={y} x2={x + 16} y2={y} tone="faint" />);
          }
        return (
          <g>
            <Line x1={0} y1={far} x2={W} y2={far} />
            <Line x1={0} y1={near} x2={W} y2={near} />
            {Array.from({ length: 46 }, (_, i) => (
              <g key={i}>
                <Line x1={i * 14 + 6} y1={far - 2} x2={i * 14 - 2} y2={far - 10} tone="faint" />
                <Line x1={i * 14 + 6} y1={near + 2} x2={i * 14 - 2} y2={near + 10} tone="faint" />
              </g>
            ))}
            {streaks}
            <Arrow x1={W - 120} y1={(far + near) / 2} x2={W - 120 + vw * 9} y2={(far + near) / 2} tone="soft" label={<Sub v="v" s="river" />} labelAt="mid" />
            {boats.map((b) => {
              const vc = b.up ? cross : vb;
              const T = width / vc;
              const tau = Math.min(real, T);
              const drift = b.up ? 0 : vw;
              const bx = b.x0 + pxm * drift * tau;
              const by = near - pxm * vc * tau;
              const hx = -Math.sin(b.up);
              const hy = -Math.cos(b.up);
              const ha = 9;
              const tip = [bx + ha * vb * hx, by + ha * vb * hy];
              const sum = [tip[0] + ha * vw, tip[1]];
              const arrived = real >= T;
              const land = b.x0 + pxm * drift * T;
              return (
                <g key={b.name}>
                  <Line x1={b.x0} y1={near} x2={b.x0} y2={far} tone="faint" dashed />
                  <Trail points={[[b.x0, near], [bx, by]]} />
                  <g opacity={1 - phase(real, T, T + 1)}>
                    <Arrow x1={bx} y1={by} x2={tip[0]} y2={tip[1]} tone="soft" label={<Sub v="v" s="BW" />} />
                    <Arrow x1={tip[0]} y1={tip[1]} x2={sum[0]} y2={sum[1]} dashed tone="soft" />
                    <Arrow x1={bx} y1={by} x2={sum[0]} y2={sum[1]} label={<Sub v="v" s="BG" />} />
                  </g>
                  <Block x={bx} y={by} w={26} h={11} angle={90 + b.up / DEG} />
                  <Label x={b.x0} y={near + 28} kind="label">
                    {b.name}
                  </Label>
                  {arrived && drift > 0 && (
                    <g opacity={phase(real, T, T + 0.8)}>
                      <Line x1={b.x0} y1={far - 18} x2={land} y2={far - 18} tone="soft" />
                      <Line x1={b.x0} y1={far - 24} x2={b.x0} y2={far - 12} tone="soft" />
                      <Line x1={land} y1={far - 24} x2={land} y2={far - 12} tone="soft" />
                      <Label x={(b.x0 + land) / 2} y={far - 26} kind="val">
                        drift {(drift * T).toFixed(0)} m
                      </Label>
                    </g>
                  )}
                  {arrived && (
                    <Label x={land + (drift > 0 ? 38 : 0)} y={far + 24} kind="val" anchor="middle">
                      {T.toFixed(0)} s
                    </Label>
                  )}
                </g>
              );
            })}
            <Readout>t = {real.toFixed(0)} s</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 7. rain and umbrella

/** Rain falling straight down; a walker starts moving and sees it slant, and tilts the umbrella. */
export function Rain({ vr = 6, w = 8, height = 270, title }: { vr?: number; w?: number; height?: number; title: string }) {
  const gy = height - 34;
  const k = 14;
  const px = 280;
  return (
    <Anim title={title} height={height} loop={11} stillAt={8}>
      {(t) => {
        const s = (u: number) => w * ease(phase(u, 2.6, 4.2));
        let cam = 0;
        for (let i = 0; i < 60; i++) cam += (s((t * (i + 0.5)) / 60) * k * t) / 60;
        const sp = s(t);
        const vx = -sp * k;
        const vy = vr * k;
        const L = Math.hypot(vx, vy);
        const ux = vx / L;
        const uy = vy / L;
        const drops: ReactNode[] = [];
        for (let i = 0; i < 46; i++) {
          const x = mod(mod(i * 157.3, 760) - cam, 760) - 60;
          const y = mod((i * 89.7 + ((i * i) % 13) * 9) + vy * t, gy + 24);
          if (y < gy - 2) drops.push(<Line key={i} x1={x} y1={y} x2={x - ux * 15} y2={y - uy * 15} tone="soft" />);
        }
        const theta = Math.atan2(sp, vr) / DEG;
        const swing = sp > 0.05 ? Math.sin(cam / 9) * 9 : 0;
        const hand = [px + 7, gy - 52];
        const RP = [560, 62];
        return (
          <g>
            <Line x1={0} y1={gy} x2={W} y2={gy} />
            <Ticks y={gy} cam={cam} dir={-1} />
            {drops}
            <Line x1={px} y1={gy - 36} x2={px - swing} y2={gy} tone="bright" />
            <Line x1={px} y1={gy - 36} x2={px + swing} y2={gy} tone="bright" />
            <Line x1={px} y1={gy - 36} x2={px} y2={gy - 68} tone="bright" />
            <Line x1={px} y1={gy - 64} x2={hand[0]} y2={hand[1]} tone="bright" />
            <Ball x={px} y={gy - 79} r={7} glow={false} />
            <g transform={`translate(${hand[0]} ${hand[1]}) rotate(${theta})`}>
              <Line x1={0} y1={0} x2={0} y2={-46} tone="bright" />
              <path className="kit-block" d="M-38 -46A38 34 0 0 1 38 -46Z" />
            </g>
            <Label x={14} y={24} kind="label" anchor="start">
              {sp < 0.05 ? 'Standing still' : sp < w - 0.05 ? 'Starting to walk' : 'Walking'}
            </Label>
            <Line x1={RP[0]} y1={RP[1]} x2={RP[0]} y2={RP[1] + 64} dashed tone="soft" />
            <Arrow x1={RP[0]} y1={RP[1]} x2={RP[0] + ux * 64} y2={RP[1] + uy * 64} />
            <Label x={RP[0]} y={RP[1] + 94} kind="val">
              θ = {theta.toFixed(1)}°
            </Label>
            <Label x={RP[0] - 6} y={RP[1] - 12} kind="label">
              rain seen by the walker
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 8. aeroplane in a crosswind

/** A plane in a crosswind (map view, north up): heading straight at the target, or corrected. */
export function Plane({ mode, va = 200, vw = 50, dist = 500, height = 290, title }: { mode: 'drift' | 'correct'; va?: number; vw?: number; dist?: number; height?: number; title: string }) {
  const k = 0.2;
  const start = [120, height - 25];
  const dest = [120, 50];
  const alpha = Math.asin(vw / va);
  const gs = Math.sqrt(va * va - vw * vw);
  const vgx = mode === 'drift' ? vw : 0;
  const vgy = mode === 'drift' ? va : gs;
  const T = (start[1] - dest[1]) / (k * vgy);
  const O = [520, height - 40];
  const sc = 0.6;
  const heading = mode === 'drift' ? 0 : -alpha / DEG;
  const hv = [Math.sin(mode === 'drift' ? 0 : -alpha), -Math.cos(mode === 'drift' ? 0 : -alpha)];
  return (
    <Anim title={title} height={height} loop={T + 5} stillAt={T + 1.5}>
      {(t) => {
        const tau = clamp(t - 2.6, 0, T);
        const pos = [start[0] + k * vgx * tau, start[1] - k * vgy * tau];
        const streaks: ReactNode[] = [];
        for (let r = 0; r < 8; r++)
          for (let c = 0; c < 4; c++) {
            const y = 40 + r * 32;
            const x = mod(c * 110 + (r % 2) * 55 + k * vw * t - 30, 440) - 30;
            if (x < 390) streaks.push(<Line key={`${r}-${c}`} x1={x} y1={y} x2={x + 14} y2={y} tone="faint" />);
          }
        const tipA = [O[0] + sc * va * hv[0], O[1] + sc * va * hv[1]];
        const tipW = [tipA[0] + sc * vw, tipA[1]];
        const tipG = [O[0] + sc * vgx, O[1] - sc * vgy];
        return (
          <g>
            <Line x1={410} y1={30} x2={410} y2={height - 20} tone="faint" />
            {streaks}
            <Label x={14} y={24} kind="val" anchor="start">
              N ↑
            </Label>
            <Line x1={start[0]} y1={start[1]} x2={dest[0]} y2={dest[1]} dashed tone="soft" />
            <circle className="fig-ghost" cx={dest[0]} cy={dest[1]} r={9} />
            <Label x={dest[0] + 16} y={dest[1] + 5} kind="label" anchor="start">
              target
            </Label>
            <Trail points={[start as [number, number], pos as [number, number]]} />
            <g transform={`translate(${pos[0]} ${pos[1]}) rotate(${heading})`}>
              <path className="kit-block is-filled" d="M0 -15L9 11L0 6L-9 11Z" />
            </g>
            <Show t={t} a={0.2}>
              <Arrow x1={O[0]} y1={O[1]} x2={tipA[0]} y2={tipA[1]} tone="soft" />
              <Label x={tipA[0] - 30} y={(O[1] + tipA[1]) / 2 + 6} kind="sym">
                <Sub v="v" s="PA" />
              </Label>
            </Show>
            <Show t={t} a={1.1}>
              <Arrow {...grow(tipA[0], tipA[1], tipW[0], tipW[1], phase(t, 1.1, 1.7))} dashed tone="soft" />
              <Label x={(tipA[0] + tipW[0]) / 2 + 4} y={tipA[1] - 12} kind="sym">
                <Sub v="v" s="W" />
              </Label>
            </Show>
            <Show t={t} a={1.8}>
              <Arrow {...grow(O[0], O[1], tipG[0], tipG[1], phase(t, 1.8, 2.5))} />
              <Label x={tipG[0] + 26} y={(O[1] + tipG[1]) / 2 + 30} kind="sym">
                <Sub v="v" s="PG" />
              </Label>
            </Show>
            <Label x={O[0]} y={height - 10} kind="val">
              ground speed {Math.hypot(vgx, vgy).toFixed(0)} km/h
            </Label>
            {mode === 'drift' && tau >= T && (
              <Label x={start[0] + k * vgx * T + 34} y={dest[1] + 34} kind="val" anchor="start">
                {((vw * dist) / va).toFixed(0)} km off
              </Label>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 9. two ships and the closest approach

/** Two ships seen from the sea, then from ship A: the closest approach is the foot of a perpendicular. */
export function Ships({ rel, height = 290, title }: { rel?: boolean; height?: number; title: string }) {
  const sc = 4;
  const ox = 120;
  const oy = height / 2 + 10;
  const vA = [15, 0];
  const vB = [0, -20];
  const r0 = [40, 30];
  const A = (s: number) => [vA[0] * s, vA[1] * s];
  const B = (s: number) => [r0[0] + vB[0] * s, r0[1] + vB[1] * s];
  const vr = [vB[0] - vA[0], vB[1] - vA[1]];
  const sStar = -(r0[0] * vr[0] + r0[1] * vr[1]) / (vr[0] ** 2 + vr[1] ** 2);
  const F = [r0[0] + vr[0] * sStar, r0[1] + vr[1] * sStar];
  const dmin = Math.hypot(F[0], F[1]);
  const scr = (x: number, y: number, cam: number[]): [number, number] => [ox + sc * (x - cam[0]), oy - sc * (y - cam[1])];
  return (
    <Anim title={title} height={height} loop={12.5} stillAt={8}>
      {(t) => {
        const p = rel ? 1 : ease(phase(t, 2.5, 4.2));
        const s = Math.min(t * 0.36, 3);
        const cam = (q: number) => [p * A(q)[0], p * A(q)[1]];
        const posA = scr(A(s)[0], A(s)[1], cam(s));
        const posB = scr(B(s)[0], B(s)[1], cam(s));
        const trail = (f: (q: number) => number[]) => {
          const pts: [number, number][] = [];
          for (let i = 0; i <= 30; i++) {
            const q = (s * i) / 30;
            pts.push(scr(f(q)[0], f(q)[1], cam(q)));
          }
          return pts;
        };
        const d = Math.hypot(B(s)[0] - A(s)[0], B(s)[1] - A(s)[1]);
        const past = s >= sStar;
        const home = scr(0, 0, [0, 0]);
        const foot = scr(F[0], F[1], [0, 0]);
        const lineEnd = [scr(r0[0], r0[1], [0, 0]), scr(r0[0] + vr[0] * 3, r0[1] + vr[1] * 3, [0, 0])];
        const aw = 1.6;
        return (
          <g>
            <Caption
              items={[
                ['Seen from the sea', 1 - p],
                ['Seen from ship A', p],
              ]}
            />
            <Trail points={trail(A)} tone="faint" dashed />
            <Trail points={trail(B)} />
            {p > 0.99 && (
              <g>
                <Trail points={[lineEnd[0], lineEnd[1]]} tone="faint" dashed />
                <circle className="fig-ghost" cx={home[0]} cy={home[1]} r={3} />
              </g>
            )}
            <Arrow x1={posB[0]} y1={posB[1]} x2={posA[0]} y2={posA[1]} dashed tone="soft" />
            <Label x={(posA[0] + posB[0]) / 2 + 16} y={(posA[1] + posB[1]) / 2} kind="val" anchor="start">
              {d.toFixed(1)} km
            </Label>
            <Ball x={posA[0]} y={posA[1]} />
            <Label x={posA[0] - 14} y={posA[1] - 12} kind="sym">
              A
            </Label>
            <Ball x={posB[0]} y={posB[1]} glow={false} />
            <Label x={posB[0] + 16} y={posB[1] - 6} kind="sym">
              B
            </Label>
            <Arrow x1={posA[0]} y1={posA[1]} x2={posA[0] + aw * (vA[0] - p * vA[0]) * 2} y2={posA[1]} tone="soft" />
            <Arrow x1={posB[0]} y1={posB[1]} x2={posB[0] + aw * 2 * (vB[0] - p * vA[0])} y2={posB[1] - aw * 2 * (vB[1] - p * vA[1])} tone={p > 0.5 ? 'bright' : 'soft'} />
            {past && p > 0.99 && (
              <g opacity={phase(s, sStar, sStar + 0.1)}>
                <Line x1={home[0]} y1={home[1]} x2={foot[0]} y2={foot[1]} tone="bright" />
                <circle className="fig-ghost" cx={foot[0]} cy={foot[1]} r={9} />
                <Label x={(home[0] + foot[0]) / 2 - 8} y={(home[1] + foot[1]) / 2 + 22} kind="val" anchor="end">
                  d_min = {dmin.toFixed(0)} km
                </Label>
              </g>
            )}
            <Readout>t = {s.toFixed(2)} h</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 10. two projectiles

/** Two projectiles from one point; seen from B, A moves in a straight line at constant velocity. */
export function Projectiles({ uA = [12, 0], uB = [-5, 9], scale = 7, tEnd = 2, height = 290, title }: { uA?: [number, number]; uB?: [number, number]; scale?: number; tEnd?: number; height?: number; title: string }) {
  const g = 9.8;
  const ox = 190;
  const oy = 70;
  const pos = (u: number[], s: number) => [u[0] * s, u[1] * s - 0.5 * g * s * s];
  const rel = [uA[0] - uB[0], uA[1] - uB[1]];
  return (
    <Anim title={title} height={height} loop={tEnd / 0.4 + 4} stillAt={tEnd / 0.4}>
      {(t) => {
        const s = Math.min(t * 0.4, tEnd);
        const p = ease(phase(t, 1.2, 2.6));
        const cam = (q: number) => [p * pos(uB, q)[0], p * pos(uB, q)[1]];
        const at = (u: number[], q: number): [number, number] => [ox + scale * (pos(u, q)[0] - cam(q)[0]), oy - scale * (pos(u, q)[1] - cam(q)[1])];
        const trail = (u: number[]) => {
          const pts: [number, number][] = [];
          for (let i = 0; i <= 30; i++) pts.push(at(u, (s * i) / 30));
          return pts;
        };
        const a = at(uA, s);
        const b = at(uB, s);
        const velOf = (u: number[]) => [u[0] - p * uB[0], u[1] - g * s - p * (uB[1] - g * s)];
        const va = velOf(uA);
        const vb = velOf(uB);
        const ka = 3.4;
        const dist = Math.hypot(rel[0] * s, rel[1] * s);
        return (
          <g>
            <Caption
              items={[
                ['Seen from the ground', 1 - p],
                ['Seen from ball B', p],
              ]}
            />
            <Trail points={trail(uA)} dashed tone="soft" />
            <Trail points={trail(uB)} dashed tone="soft" />
            <Line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} tone="faint" />
            <Arrow x1={a[0]} y1={a[1]} x2={a[0] + ka * va[0]} y2={a[1] - ka * va[1]} label={<Sub v="v" s="A" />} />
            <Arrow x1={b[0]} y1={b[1]} x2={b[0] + ka * vb[0]} y2={b[1] - ka * vb[1]} tone="soft" label={<Sub v="v" s="B" />} />
            <Ball x={a[0]} y={a[1]} />
            <Ball x={b[0]} y={b[1]} glow={false} />
            <Label x={a[0] - 12} y={a[1] - 12} kind="sym">
              A
            </Label>
            <Label x={b[0] - 12} y={b[1] - 12} kind="sym">
              B
            </Label>
            <Readout>t = {s.toFixed(1)} s</Readout>
            <Label x={W - 12} y={42} kind="val" anchor="end">
              apart {dist.toFixed(1)} m
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}
