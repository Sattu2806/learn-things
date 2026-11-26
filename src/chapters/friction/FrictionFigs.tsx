import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Block, Incline, Label, Line, Trail, W, clamp, DEG, ease, lerp, phase, slopePoint } from '../kit/Anim';

/** Animated diagrams for the friction chapter. Every position comes from the real physics. */

const G = 9.8;
const f0 = (x: number) => x.toFixed(0);
const f1 = (x: number) => x.toFixed(1);
const f2 = (x: number) => x.toFixed(2);
const f3 = (x: number) => x.toFixed(3);

/** μ with a small subscript, for use inside SVG text. */
export function Mu({ s, rest }: { s: string; rest?: string }) {
  return (
    <>
      μ<tspan dy={3} fontSize="0.7em">{s}</tspan>
      {rest ? <tspan dy={-3}>{rest}</tspan> : <tspan dy={-3}> </tspan>}
    </>
  );
}

/** Ground with hatching that scrolls to the left by `off` pixels: the camera rides along. */
function Scroll({ y, off, x1 = 0, x2 = W }: { y: number; off: number; x1?: number; x2?: number }) {
  const marks: ReactNode[] = [];
  const o = ((off % 14) + 14) % 14;
  for (let x = x1 + 6 - o; x < x2; x += 14) if (x > x1) marks.push(<line key={x} className="fig-guide fig-faint" x1={x} y1={y + 2} x2={x - 8} y2={y + 10} />);
  return (
    <g>
      <line className="fig-ground" x1={x1} x2={x2} y1={y} y2={y} />
      {marks}
    </g>
  );
}

const tri = (u: number) => Math.abs(2 * (u - Math.round(u)));

// ------------------------------------------------------------------ 1. surfaces under the microscope

const P = 34;
const H = 15;
const prof = (x: number) => H * (0.7 * tri(x / P) + 0.3 * tri((2 * x) / P + 0.25));

/** Two rough surfaces, magnified, with the top one pushed across the bottom one. */
export function Surfaces({ title, oil = false, height = 240 }: { title: string; oil?: boolean; height?: number }) {
  const base = 178;
  const xa = 150;
  const xb = 450;
  return (
    <Anim title={title} height={height} loop={oil ? 10 : 7} stillAt={oil ? 8 : 3}>
      {(t) => {
        const speed = 22;
        const s = speed * t;
        // lift so the top surface just clears the bottom one at this slide distance
        let lift = 0;
        for (let x = 0; x < P; x += 1) lift = Math.max(lift, prof(x + s) - prof(x));
        const wet = oil ? ease(phase(t, 3.6, 5.2)) : 0;
        const flat = H + 3;
        const lf = lerp(lift, flat, wet);
        const lower: string[] = [];
        for (let x = 0; x <= W; x += 3) lower.push(`${x} ${(base - prof(x + s)).toFixed(1)}`);
        const upper: string[] = [];
        for (let x = xa; x <= xb; x += 3) upper.push(`${x} ${(base - prof(x) - lf).toFixed(1)}`);
        const film: string[] = [];
        for (let x = xa; x <= xb; x += 3) film.push(`${x} ${(base - prof(x) - lf).toFixed(1)}`);
        const filmBack: string[] = [];
        for (let x = xb; x >= xa; x -= 3) filmBack.push(`${x} ${(base - prof(x + s)).toFixed(1)}`);
        const fLen = lerp(70, 16, wet);
        return (
          <g>
            <path className="fig-cliff" d={`M${lower.join('L')}L${W} ${height}L0 ${height}Z`} />
            {oil && wet > 0 && <path d={`M${film.join('L')}L${filmBack.join('L')}Z`} fill="rgba(255,255,255,0.16)" opacity={wet} />}
            <path className="kit-block" d={`M${upper.join('L')}L${xb} 48L${xa} 48Z`} />
            <Label x={(xa + xb) / 2} y={90} kind="label">{oil ? 'a body sliding over a lubricated surface' : 'a body sliding over a surface'}</Label>
            <Arrow x1={xb} y1={110} x2={xb + 22 + fLen} y2={110} label="F" />
            <Arrow x1={xa} y1={base - 56} x2={xa - fLen} y2={base - 56} label="f" />
            <Label x={16} y={24} kind="label" anchor="start">{oil ? (wet > 0.5 ? 'with oil: the bumps no longer catch' : 'dry: the bumps catch and lock') : 'seen under a microscope, no surface is smooth'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 2 and 5. pulling harder and harder

/** A block on the floor, pulled by a force that grows: friction matches it, then the block breaks free. */
export function PullScene({ title, m = 20, mus = 0.5, muk = 0.4, top = 1.15, graph = false, height = 250, loop = 7.5 }: { title: string; m?: number; mus?: number; muk?: number; top?: number; graph?: boolean; height?: number; loop?: number }) {
  const N = m * G;
  const Fs = mus * N;
  const Fk = muk * N;
  const T0 = 0.5;
  const RAMP = 4.5;
  const Ft = (u: number) => top * Fs * phase(u, T0, T0 + RAMP);
  const slipAt = top >= 1 ? T0 + RAMP / top : 99;
  return (
    <Anim title={title} height={height} loop={loop} stillAt={Math.min(loop - 0.5, slipAt + 0.9)}>
      {(t) => {
        let v = 0;
        let s = 0;
        let slipped = false;
        for (let u = 0; u < t; u += 0.01) {
          const F = Ft(u);
          if (!slipped && F >= Fs) slipped = true;
          if (slipped) {
            v = Math.max(0, v + ((F - Fk) / m) * 0.01);
            s += v * 0.01;
          }
        }
        const F = Ft(t);
        const sl = slipped || F >= Fs;
        const f = sl ? Fk : F;
        const gy = height - 50;
        const bw = 100;
        const bh = 60;
        const x0 = graph ? 120 : 170;
        const ppm = 30;
        const k = (graph ? 0.5 : 1.0) * (98 / Math.max(Fs, 1));
        const cx = x0 + s * ppm;
        const cy = gy - bh / 2;
        // graph
        const ox = 452;
        const oy = height - 36;
        const gs = Math.min(135 / (top * Fs), 170 / Fs);
        const pts: [number, number][] = [];
        for (let u = 0; u <= t; u += 0.05) {
          const Fu = Ft(u);
          const fu = Fu >= Fs ? Fk : Fu;
          pts.push([ox + gs * Fu, oy - gs * fu]);
        }
        pts.push([ox + gs * F, oy - gs * f]);
        return (
          <g>
            <Scroll y={gy} off={0} />
            <Line x1={x0} y1={gy - bh - 8} x2={x0} y2={gy + 4} dashed tone="faint" />
            <Block x={cx} y={cy} w={bw} h={bh} label={`${m} kg`} />
            <Arrow x1={cx + bw / 2} y1={cy} x2={cx + bw / 2 + F * k} y2={cy} label="F" />
            <Arrow x1={cx - bw / 2} y1={gy - 10} x2={cx - bw / 2 - f * k} y2={gy - 10} label="f" />
            <Label x={16} y={26} kind="val" anchor="start">{`pull  F = ${f1(F)} N`}</Label>
            <Label x={16} y={46} kind="val" anchor="start">{`friction  f = ${f1(f)} N`}</Label>
            <Label x={16} y={68} kind="label" anchor="start">
              {sl ? (
                <>
                  slipping: f = <Mu s="k" rest="N" />
                </>
              ) : (
                'at rest, so f = F'
              )}
            </Label>
            {graph && (
              <g>
                <Axes x={ox} y={oy} w={165} h={oy - 22} xLabel="F" yLabel="f" />
                <Line x1={ox} y1={oy} x2={ox + gs * top * Fs} y2={oy - gs * top * Fs} dashed tone="faint" />
                <Line x1={ox} y1={oy - gs * Fs} x2={ox + gs * Fs} y2={oy - gs * Fs} dashed tone="faint" />
                <Line x1={ox} y1={oy - gs * Fk} x2={ox + gs * top * Fs} y2={oy - gs * Fk} dashed tone="faint" />
                <Label x={ox - 8} y={oy - gs * Fs + 1} anchor="end">
                  <Mu s="s" rest="N" />
                </Label>
                <Label x={ox - 8} y={oy - gs * Fk + 14} anchor="end">
                  <Mu s="k" rest="N" />
                </Label>
                <Trail points={pts} />
                <Ball x={ox + gs * F} y={oy - gs * f} r={5} />
              </g>
            )}
            {!graph && <Label x={W - 16} y={26} kind="val" anchor="end">{`limit ${f1(Fs)} N`}</Label>}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 3. the limit grows with N

export function LimitScene({ title, mus = 0.5 }: { title: string; mus?: number }) {
  return (
    <Anim title={title} height={240} loop={9} stillAt={6.5}>
      {(t) => {
        const gy = 200;
        const drop = ease(phase(t, 3, 4));
        const m = 20 + 20 * drop;
        const N = m * G;
        const lim = mus * N;
        const bx = 140;
        const y2 = lerp(gy - 60 - 70, gy - 60 - 30, drop);
        const gx = 330;
        const k = 1.0;
        return (
          <g>
            <Scroll y={gy} off={0} x1={0} x2={290} />
            <Block x={bx} y={gy - 30} w={110} h={60} label="20 kg" />
            {t > 2 && <Block x={bx} y={y2} w={96} h={60} label="20 kg" />}
            <Arrow x1={bx + 70} y1={gy} x2={bx + 70} y2={gy - N * 0.22} label="N" />
            <Label x={16} y={26} kind="val" anchor="start">{`N = ${f0(N)} N`}</Label>
            <Label x={gx} y={60} kind="label" anchor="start">
              most friction that can hold: <Mu s="s" rest="N" />
            </Label>
            <rect x={gx} y={78} width={lim * k} height={22} rx={3} fill="rgba(255,255,255,0.85)" />
            <Label x={gx} y={124} kind="val" anchor="start">{`${f0(lim)} N`}</Label>
            <Line x1={gx} y1={74} x2={gx} y2={106} tone="soft" />
            <Label x={gx} y={170} kind="label" anchor="start">
              double the load, double the limit
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 4. kinetic: speed and area do not matter

export function TwoBlocks({ title, kind, N = 196, muk = 0.4 }: { title: string; kind: 'speed' | 'area'; N?: number; muk?: number }) {
  const f = muk * N;
  return (
    <Anim title={title} height={250} loop={6} stillAt={3}>
      {(t) => {
        const k = 1.1;
        const lanes = [
          { gy: 100, v: kind === 'speed' ? 50 : 80, w: kind === 'speed' ? 96 : 120, h: kind === 'speed' ? 54 : 36, tag: kind === 'speed' ? 'slow' : 'wide face down' },
          { gy: 218, v: kind === 'speed' ? 150 : 80, w: kind === 'speed' ? 96 : 46, h: kind === 'speed' ? 54 : 88, tag: kind === 'speed' ? 'fast' : 'narrow face down' },
        ];
        return (
          <g>
            {lanes.map((l, i) => (
              <g key={i}>
                <Scroll y={l.gy} off={l.v * t} />
                <Block x={250} y={l.gy - l.h / 2} w={l.w} h={l.h} />
                <Arrow x1={250 + l.w / 2} y1={l.gy - l.h / 2} x2={250 + l.w / 2 + f * k} y2={l.gy - l.h / 2} label="F" />
                <Arrow x1={250 - l.w / 2} y1={l.gy - 8} x2={250 - l.w / 2 - f * k} y2={l.gy - 8} label="f" />
                <Label x={16} y={l.gy - 30} kind="label" anchor="start">{l.tag}</Label>
                <Label x={W - 16} y={l.gy - 30} kind="val" anchor="end">{`f = ${f1(f)} N`}</Label>
              </g>
            ))}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 6 and mistakes. tilting slope

/** A plank that tilts up. `slide` lets the block go when tan θ reaches μs; `show` picks which arrows to draw. */
export function TiltScene({ title, mus = 0.5, muk = 0.35, maxTheta = 40, slide = true, show = 'friction', rate = 7, height = 260, loop = 11 }: { title: string; mus?: number; muk?: number; maxTheta?: number; slide?: boolean; show?: 'friction' | 'normal'; rate?: number; height?: number; loop?: number }) {
  const thr = Math.atan(mus) / DEG;
  return (
    <Anim title={title} height={height} loop={loop} stillAt={slide ? Math.min(loop - 1, 0.5 + (thr + 5) / rate + 1) : 0.5 + maxTheta / rate + 0.5}>
      {(t) => {
        const x0 = 50;
        const y0 = height - 22;
        const Lh = 300;
        const th = (u: number) => Math.min(maxTheta, rate * Math.max(0, u - 0.5));
        // slide: integrate down the slope once tan θ ≥ μs
        let d = 170;
        let v = 0;
        let sliding = false;
        for (let u = 0; u < t; u += 0.01) {
          const a = th(u) * DEG;
          if (slide && !sliding && Math.tan(a) >= mus) sliding = true;
          if (sliding) {
            v = Math.max(0, v + G * (Math.sin(a) - muk * Math.cos(a)) * 0.01);
            d = Math.max(40, d - v * 0.01 * 40);
          }
        }
        const theta = th(t);
        const a = theta * DEG;
        const sl = sliding || (slide && Math.tan(a) >= mus);
        const bh = 32;
        const c = slopePoint(x0, y0, theta, d, bh / 2);
        const L = 105;
        const dirUp = { x: Math.cos(a), y: -Math.sin(a) };
        const fric = sl ? muk * Math.cos(a) : Math.sin(a);
        const limit = mus * Math.cos(a);
        const contact = slopePoint(x0, y0, theta, d, 6);
        return (
          <g>
            <line className="fig-ground" x1={0} x2={W} y1={y0} y2={y0} />
            <Incline x={x0} y={y0} base={Math.max(Lh * Math.cos(a), 70)} angle={theta} mark={theta > 6} />
            <Block x={c.x} y={c.y} w={50} h={bh} angle={theta} />
            {show === 'friction' ? (
              <g>
                {!sl && limit > fric + 0.04 && <Arrow x1={contact.x} y1={contact.y} x2={contact.x + dirUp.x * limit * L} y2={contact.y + dirUp.y * limit * L} dashed tone="soft" />}
                {fric * L > 3 && <Arrow x1={contact.x} y1={contact.y} x2={contact.x + dirUp.x * fric * L} y2={contact.y + dirUp.y * fric * L} label="f" />}
                <Arrow x1={c.x} y1={c.y} x2={c.x - dirUp.x * Math.sin(a) * L} y2={c.y - dirUp.y * Math.sin(a) * L} label="mg sin θ" />
              </g>
            ) : (
              <g>
                <Arrow x1={c.x} y1={c.y} x2={c.x} y2={c.y + 0.9 * L} label="mg" />
                <Arrow x1={c.x} y1={c.y} x2={c.x - Math.sin(a) * Math.cos(a) * 0.9 * L * 1.0} y2={c.y - Math.cos(a) * Math.cos(a) * 0.9 * L} label="N" />
              </g>
            )}
            <Label x={W - 16} y={26} kind="val" anchor="end">{`θ = ${f1(theta)}°`}</Label>
            {show === 'friction' ? (
              <g>
                <Label x={W - 16} y={48} kind="val" anchor="end">{`tan θ = ${f3(Math.tan(a))}`}</Label>
                <Label x={W - 16} y={70} kind="val" anchor="end">{`μs = ${f2(mus)}`}</Label>
                {slide && (
                  <Label x={W - 16} y={96} kind="label" anchor="end">
                    {sl ? 'it slides!' : 'it holds'}
                  </Label>
                )}
              </g>
            ) : (
              <Label x={W - 16} y={48} kind="val" anchor="end">{`N = ${f2(Math.cos(a))} mg`}</Label>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 7. sliding down, with its free-body diagram

export function SlideScene({ title, angle = 30, muk = 0.2, height = 270 }: { title: string; angle?: number; muk?: number; height?: number }) {
  const a = angle * DEG;
  const acc = G * (Math.sin(a) - muk * Math.cos(a));
  return (
    <Anim title={title} height={height} loop={9} stillAt={6}>
      {(t) => {
        const x0 = 20;
        const y0 = height - 24;
        const base = 300;
        const hyp = base / Math.cos(a);
        const t0 = 3.6;
        const tau = Math.max(0, t - t0);
        const dist = Math.min(0.5 * acc * tau * tau * 40, hyp - 90);
        const d = hyp - 40 - dist;
        const bh = 30;
        const c = slopePoint(x0, y0, angle, d, bh / 2);
        const vNow = tau > 0 && dist < hyp - 90 ? acc * tau : 0;
        // free-body diagram
        const fx = 500;
        const fy = 100;
        const L = 100;
        const up = { x: Math.cos(a), y: -Math.sin(a) };
        const nrm = { x: -Math.sin(a), y: -Math.cos(a) };
        const p1 = phase(t, 0.3, 1.1);
        const p2 = phase(t, 1.4, 2.4);
        const p3 = phase(t, 2.6, 3.4);
        const pa = phase(t, t0 + 0.2, t0 + 0.8);
        const sc = (p: number) => ease(p);
        return (
          <g>
            <line className="fig-ground" x1={0} x2={W} y1={y0} y2={y0} />
            <Incline x={x0} y={y0} base={base} angle={angle} mark={String(angle) + '°'} />
            <Block x={c.x} y={c.y} w={44} h={bh} angle={angle} />
            {pa > 0 && <Arrow x1={c.x} y1={c.y} x2={c.x - up.x * 8 * acc * sc(pa)} y2={c.y - up.y * 8 * acc * sc(pa)} dashed label="a" />}
            <Label x={x0 + 8} y={26} kind="val" anchor="start">{`v = ${f2(vNow)} m/s`}</Label>
            {tau > 0 && <Label x={x0 + 8} y={46} kind="val" anchor="start">{`a = ${f2(acc)} m/s²`}</Label>}
            {/* the diagram on the right */}
            <g transform={`translate(${fx} ${fy})`}>
              <Line x1={-nrm.x * -19 - 95 * up.x} y1={-nrm.y * -19 - 95 * up.y} x2={-nrm.x * -19 + 95 * up.x} y2={-nrm.y * -19 + 95 * up.y} tone="faint" />
              <Block x={0} y={0} w={60} h={38} angle={angle} />
              {p1 > 0 && <Arrow x1={0} y1={0} x2={0} y2={L * sc(p1)} label="mg" />}
              {p2 > 0 && (
                <g>
                  <Arrow x1={0} y1={0} x2={-up.x * Math.sin(a) * L * sc(p2)} y2={-up.y * Math.sin(a) * L * sc(p2)} dashed tone="soft" />
                  <Arrow x1={0} y1={0} x2={-nrm.x * Math.cos(a) * L * sc(p2)} y2={-nrm.y * Math.cos(a) * L * sc(p2)} dashed tone="soft" />
                </g>
              )}
              {p3 > 0 && (
                <g>
                  <Arrow x1={0} y1={0} x2={nrm.x * Math.cos(a) * L * sc(p3)} y2={nrm.y * Math.cos(a) * L * sc(p3)} label="N" />
                  <Arrow x1={0} y1={0} x2={up.x * muk * Math.cos(a) * L * sc(p3)} y2={up.y * muk * Math.cos(a) * L * sc(p3)} label="f" />
                </g>
              )}
            </g>
            <Label x={fx} y={height - 12} kind="label">forces on the block</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 7b. pushed up a slope

export function PushUpScene({ title, angle = 30, mu = 0.3 }: { title: string; angle?: number; mu?: number }) {
  const a = angle * DEG;
  return (
    <Anim title={title} height={260} loop={7} stillAt={3}>
      {(t) => {
        const x0 = 40;
        const y0 = 238;
        const base = 340;
        const hyp = base / Math.cos(a);
        const bh = 32;
        const bw = 60;
        const d = 60 + 55 * t;
        const c = slopePoint(x0, y0, angle, Math.min(d, hyp - 70), bh / 2);
        const up = { x: Math.cos(a), y: -Math.sin(a) };
        const L = 110;
        const pf = ease(phase(t, 0, 0.8));
        const front = { x: c.x + up.x * (bw / 2), y: c.y + up.y * (bw / 2) };
        const Fn = (Math.sin(a) + mu * Math.cos(a)) * L;
        const wn = Math.sin(a) * L;
        const fn = mu * Math.cos(a) * L;
        const rearLow = slopePoint(x0, y0, angle, Math.min(d, hyp - 70) - bw / 2, 5);
        const rearHigh = slopePoint(x0, y0, angle, Math.min(d, hyp - 70) - bw / 2, bh - 4);
        return (
          <g>
            <line className="fig-ground" x1={0} x2={W} y1={y0} y2={y0} />
            <Incline x={x0} y={y0} base={base} angle={angle} mark={String(angle) + '°'} />
            <Block x={c.x} y={c.y} w={bw} h={bh} angle={angle} />
            <Arrow x1={front.x} y1={front.y} x2={front.x + up.x * Fn * pf} y2={front.y + up.y * Fn * pf} label="F" />
            <Arrow x1={rearLow.x} y1={rearLow.y} x2={rearLow.x - up.x * fn * pf} y2={rearLow.y - up.y * fn * pf} label="f" />
            <Arrow x1={rearHigh.x} y1={rearHigh.y} x2={rearHigh.x - up.x * wn * pf} y2={rearHigh.y - up.y * wn * pf} label="mg sin θ" />
            <Label x={W - 16} y={26} kind="val" anchor="end">constant speed</Label>
            <Label x={W - 16} y={50} kind="label" anchor="end">
              F = mg sin θ + <Mu s="k" rest="mg cos θ" />
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 8. pulling or pushing at an angle

export function PullAngle({ title, m = 40, mu = 0.15, angle = 30, mode = 'compare' }: { title: string; m?: number; mu?: number; angle?: number; mode?: 'compare' | 'pull' }) {
  const a = angle * DEG;
  const W0 = m * G;
  const Fpull = (mu * W0) / (Math.cos(a) + mu * Math.sin(a));
  const Fpush = (mu * W0) / (Math.cos(a) - mu * Math.sin(a));
  const kF = 1.2;
  const kN = 0.17;
  const panels = mode === 'compare' ? [{ cx: 165, dir: 'pull' as const }, { cx: 485, dir: 'push' as const }] : [{ cx: 280, dir: 'pull' as const }];
  return (
    <Anim title={title} height={mode === 'compare' ? 265 : 275} loop={8} stillAt={5}>
      {(t) => {
        const gy = 178;
        const grow = ease(phase(t, 1, 2.6));
        const move = phase(t, 2.6, 8);
        const sp = 70 * move + 0;
        return (
          <g>
            {panels.map(({ cx, dir }) => {
              const F = (dir === 'pull' ? Fpull : Fpush) * grow;
              const N = dir === 'pull' ? W0 - F * Math.sin(a) : W0 + F * Math.sin(a);
              const f = mu * N;
              const cy = gy - 22;
              const x1 = cx + 35;
              const Fx = F * Math.cos(a) * kF;
              const Fy = F * Math.sin(a) * kF;
              return (
                <g key={dir}>
                  <Scroll y={gy} off={sp * 3 * t * 0.2} x1={cx - 150} x2={cx + 150} />
                  <Block x={cx} y={cy} w={70} h={44} label={`${m} kg`} />
                  {dir === 'pull' ? (
                    <Arrow x1={x1} y1={cy - 6} x2={x1 + Fx} y2={cy - 6 - Fy} label="F" />
                  ) : (
                    <Arrow x1={cx - 35 - Fx} y1={cy - 6 - Fy} x2={cx - 35} y2={cy - 6} label="F" />
                  )}
                  {mode === 'pull' && F > 4 && (
                    <g>
                      <Arrow x1={x1} y1={cy - 6} x2={x1 + Fx} y2={cy - 6} dashed tone="soft" />
                      <Arrow x1={x1 + Fx} y1={cy - 6} x2={x1 + Fx} y2={cy - 6 - Fy} dashed tone="soft" />
                    </g>
                  )}
                  <Arrow x1={cx + 18} y1={gy} x2={cx + 18} y2={gy - N * kN} label="N" />
                  <Arrow x1={cx - 18} y1={cy} x2={cx - 18} y2={cy + W0 * kN} label="mg" />
                  <Arrow x1={cx - 35} y1={gy - 6} x2={cx - 35 - f * kF} y2={gy - 6} label="f" />
                  <Label x={cx} y={mode === 'compare' ? 252 : 262} kind="val">{`N = ${f0(N)} N`}</Label>
                  <Label x={cx} y={mode === 'compare' ? 24 : 24} kind="label">{dir === 'pull' ? 'pulling at 30°' : 'pushing at 30°'}</Label>
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 9. walking, driving, rolling

const leg = (hx: number, hy: number, fx: number, fy: number, l = 46) => {
  const dx = fx - hx;
  const dy = fy - hy;
  const d = Math.min(Math.hypot(dx, dy), 2 * l - 0.5);
  const h = Math.sqrt(Math.max(0, l * l - (d / 2) * (d / 2)));
  const mx = hx + dx / 2 + (dy / Math.hypot(dx, dy)) * h;
  const my = hy + dy / 2 - (dx / Math.hypot(dx, dy)) * h;
  return { kx: mx, ky: my };
};

export function Walking({ title }: { title: string }) {
  const T = 1.4;
  const stride = 80;
  const stance = 0.6;
  const speed = stride / (stance * T);
  return (
    <Anim title={title} height={250} loop={T * 4} stillAt={1.1}>
      {(t) => {
        const gy = 200;
        const cx = 320;
        const hy = gy - 86;
        const feet = [0, 0.5].map((o) => {
          const u = (t / T + o) % 1;
          if (u < stance) return { dx: lerp(stride / 2, -stride / 2, u / stance), lift: 0, planted: true, u: u / stance };
          const w = (u - stance) / (1 - stance);
          return { dx: lerp(-stride / 2, stride / 2, ease(w)), lift: 18 * Math.sin(Math.PI * w), planted: false, u: 0 };
        });
        const swingA = Math.sin((t / T) * 2 * Math.PI);
        return (
          <g>
            <Scroll y={gy} off={speed * t} />
            <Ball x={cx + 4} y={hy - 92} r={11} glow={false} />
            <Line x1={cx} y1={hy} x2={cx + 5} y2={hy - 78} tone="bright" />
            <Line x1={cx + 5} y1={hy - 70} x2={cx + 5 + 26 * swingA} y2={hy - 28} tone="bright" />
            <Line x1={cx + 5} y1={hy - 70} x2={cx + 5 - 26 * swingA} y2={hy - 28} tone="soft" />
            {feet.map((f, i) => {
              const fxp = cx + f.dx;
              const fyp = gy - f.lift;
              const kn = leg(cx, hy, fxp, fyp);
              const fade = f.planted ? clamp(Math.min(f.u * 8, (1 - f.u) * 8)) : 0;
              return (
                <g key={i}>
                  <Line x1={cx} y1={hy} x2={kn.kx} y2={kn.ky} tone={i ? 'soft' : 'bright'} />
                  <Line x1={kn.kx} y1={kn.ky} x2={fxp} y2={fyp} tone={i ? 'soft' : 'bright'} />
                  <Line x1={fxp} y1={fyp} x2={fxp + 14} y2={fyp} tone={i ? 'soft' : 'bright'} />
                  {fade > 0.05 && (
                    <g opacity={fade}>
                      <Arrow x1={fxp - 14} y1={gy + 18} x2={fxp + 30} y2={gy + 18} label="f" />
                      <Arrow x1={fxp + 22} y1={gy + 44} x2={fxp - 18} y2={gy + 44} dashed tone="soft" />
                    </g>
                  )}
                </g>
              );
            })}
            <Label x={16} y={26} kind="label" anchor="start">solid: friction on your foot, forward</Label>
            <Label x={16} y={48} kind="label" anchor="start">dashed: your foot on the ground, back</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Tyre({ title }: { title: string }) {
  const r = 22;
  return (
    <Anim title={title} height={250} loop={8.5} stillAt={2.5}>
      {(t) => {
        const gy = 176;
        const speed = (u: number) => {
          const up = 40 + 110 * ease(phase(u, 0.3, 3.3));
          return u < 4.6 ? up : (40 + 110) * (1 - ease(phase(u, 4.6, 7.4)));
        };
        let off = 0;
        for (let u = 0; u < t; u += 0.02) off += speed(u) * 0.02;
        const ang = (off / r) * (180 / Math.PI);
        const accel = t > 0.3 && t < 3.3;
        const brake = t > 4.6 && t < 7.4;
        const wheels = [260, 380];
        const dirn = accel ? 1 : -1;
        const show = accel ? [wheels[0]] : brake ? wheels : [];
        return (
          <g>
            <Scroll y={gy} off={off} />
            <rect className="kit-block" x={210} y={gy - 2 * r - 30} width={220} height={34} rx={6} />
            <rect className="kit-block" x={262} y={gy - 2 * r - 56} width={110} height={28} rx={6} />
            {wheels.map((wx) => (
              <g key={wx}>
                <circle className="kit-block" cx={wx} cy={gy - r} r={r} />
                {[0, 60, 120].map((s) => (
                  <line key={s} className="fig-guide" x1={wx - r * Math.cos((ang + s) * DEG)} y1={gy - r - r * Math.sin((ang + s) * DEG)} x2={wx + r * Math.cos((ang + s) * DEG)} y2={gy - r + r * Math.sin((ang + s) * DEG)} />
                ))}
              </g>
            ))}
            {show.map((wx) => (
              <g key={wx}>
                <Arrow x1={wx - 24 * dirn} y1={gy + 18} x2={wx + 24 * dirn} y2={gy + 18} label="f" />
                <Arrow x1={wx + 22 * dirn} y1={gy + 44} x2={wx - 22 * dirn} y2={gy + 44} dashed tone="soft" />
              </g>
            ))}
            <Label x={16} y={26} kind="label" anchor="start">{accel ? 'driving: friction on the tyre points forward' : brake ? 'braking: friction on the tyres points backward' : 'rolling along: almost no friction needed'}</Label>
            <Label x={16} y={48} kind="label" anchor="start">dashed: the tyre on the road</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Rolling({ title }: { title: string }) {
  const r = 34;
  return (
    <Anim title={title} height={230} loop={8} stillAt={2}>
      {(t) => {
        const gy = 160;
        const cx = 320;
        const v = 120 * (1 - 0.6 * phase(t, 0.5, 7));
        let off = 0;
        for (let u = 0; u < t; u += 0.02) off += 120 * (1 - 0.6 * phase(u, 0.5, 7)) * 0.02;
        const ang = (off / r) * (180 / Math.PI);
        const dent = 6;
        const pts: string[] = [];
        for (let x = 0; x <= W; x += 4) pts.push(`${x} ${(gy + dent * Math.exp(-(((x - cx) / 34) ** 2))).toFixed(1)}`);
        const hatch: ReactNode[] = [];
        const o = ((off % 14) + 14) % 14;
        for (let x = 6 - o; x < W; x += 14) if (x > 0) hatch.push(<line key={x} className="fig-guide fig-faint" x1={x} y1={gy + 12} x2={x - 8} y2={gy + 20} />);
        const cy = gy + dent - r;
        void v;
        return (
          <g>
            <path className="fig-ground" d={`M${pts.join('L')}`} fill="none" />
            {hatch}
            <circle className="kit-block" cx={cx} cy={cy} r={r} />
            {[0, 60, 120].map((s) => (
              <line key={s} className="fig-guide" x1={cx - r * Math.cos((ang + s) * DEG)} y1={cy - r * Math.sin((ang + s) * DEG)} x2={cx + r * Math.cos((ang + s) * DEG)} y2={cy + r * Math.sin((ang + s) * DEG)} />
            ))}
            <Arrow x1={cx} y1={cy} x2={cx} y2={cy + 62} label="mg" />
            <Arrow x1={cx + 14} y1={gy + dent} x2={cx + 14} y2={gy + dent - 70} label="N" />
            <Arrow x1={cx + 14} y1={gy + dent - 12} x2={cx - 22} y2={gy + dent - 12} label="" />
            <Label x={16} y={26} kind="label" anchor="start">a soft surface dents ahead of the wheel</Label>
            <Label x={16} y={48} kind="label" anchor="start">so N acts slightly ahead of the centre and resists the roll</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 10. one block on another

export function StackScene({ title, m = 2, M = 4, mu = 0.3, top = 1.12, height = 255, loop = 7.5 }: { title: string; m?: number; M?: number; mu?: number; top?: number; height?: number; loop?: number }) {
  const Flim = mu * G * (m + M);
  const T0 = 0.5;
  const RAMP = 4.5;
  const Ft = (u: number) => top * Flim * phase(u, T0, T0 + RAMP);
  return (
    <Anim title={title} height={height} loop={loop} stillAt={top > 1 ? T0 + RAMP / top + 1.2 : 4}>
      {(t) => {
        let vb = 0;
        let vt = 0;
        let sb = 0;
        let rel = 0;
        let slip = false;
        for (let u = 0; u < t; u += 0.01) {
          const F = Ft(u);
          if (!slip && F >= Flim) slip = true;
          if (slip) {
            const at = mu * G;
            const ab = (F - mu * m * G) / M;
            vt += at * 0.01;
            vb += ab * 0.01;
            rel += (vt - vb) * 0.01;
          } else {
            const a = F / (m + M);
            vt += a * 0.01;
            vb += a * 0.01;
          }
          sb += vb * 0.01;
        }
        const F = Ft(t);
        const sl = slip || F >= Flim;
        const a = F / (m + M);
        const fTop = sl ? mu * m * G : m * a;
        const gy = height - 46;
        const bh = 40;
        const bx = 250;
        const bw = 250;
        const ty = gy - bh - 22;
        const tx = bx + clamp(rel * 50, -100, 0);
        const k = 5;
        const yI = gy - bh;
        return (
          <g>
            <Scroll y={gy} off={sb * 40} />
            <Block x={bx} y={gy - bh / 2} w={bw} h={bh} label={`${M} kg`} />
            <Block x={tx} y={ty} w={76} h={44} label={`${m} kg`} />
            <Arrow x1={bx + bw / 2} y1={gy - bh / 2} x2={bx + bw / 2 + F * k} y2={gy - bh / 2} label="F" />
            {fTop * k > 3 && (
              <g>
                <Arrow x1={tx} y1={yI - 12} x2={tx + fTop * k} y2={yI - 12} label="f" />
                <Arrow x1={tx} y1={yI + 12} x2={tx - fTop * k} y2={yI + 12} label="f" />
              </g>
            )}
            <Label x={16} y={26} kind="val" anchor="start">{`F = ${f1(F)} N`}</Label>
            <Label x={16} y={46} kind="val" anchor="start">{`friction between blocks = ${f2(fTop)} N`}</Label>
            <Label x={16} y={68} kind="label" anchor="start">{sl ? 'the top block slips' : 'they move together'}</Label>
            <Label x={W - 16} y={26} kind="val" anchor="end">{`limit F = ${f1(Flim)} N`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ example 6. stopping a car

export function CarStop({ title, v0 = 20, mus = [0.7, 0.3] }: { title: string; v0?: number; mus?: number[] }) {
  const ppm = 6.5;
  const lanes = [
    { gy: 100, mu: mus[0], tag: 'dry road' },
    { gy: 200, mu: mus[1], tag: 'wet road' },
  ];
  const xb = 140;
  const w = 56;
  return (
    <Anim title={title} height={236} loop={11} stillAt={8}>
      {(t) => (
        <g>
          {lanes.map(({ gy, mu, tag }, i) => {
            const a = mu * G;
            const tb = v0 / a;
            const pre = 0.5;
            const x = t < pre ? xb - v0 * ppm * (pre - t) : xb + (t - pre < tb ? v0 * (t - pre) - 0.5 * a * (t - pre) ** 2 : (v0 * v0) / (2 * a)) * ppm;
            const d = (v0 * v0) / (2 * a);
            const moving = t > pre && t - pre < tb;
            return (
              <g key={i}>
                <Scroll y={gy} off={0} />
                <Line x1={xb} y1={gy - 56} x2={xb} y2={gy + 6} dashed tone="soft" />
                {t > pre && <Line x1={xb - w + 2} y1={gy - 3} x2={x - w + 2} y2={gy - 3} tone="soft" />}
                <rect className="kit-block" x={x - w} y={gy - 30} width={w} height={22} rx={4} />
                <circle className="kit-block" cx={x - w + 14} cy={gy - 8} r={8} />
                <circle className="kit-block" cx={x - 14} cy={gy - 8} r={8} />
                {moving && <Arrow x1={x - 14} y1={gy - 40} x2={x - 14 - a * 6} y2={gy - 40} label="f" />}
                <Label x={16} y={gy - 62} kind="label" anchor="start">{tag}</Label>
                <Label x={W - 16} y={gy - 62} kind="val" anchor="end">{`${f1(d)} m   (μ = ${f1(mu)})`}</Label>
              </g>
            );
          })}
          <Label x={xb} y={22} kind="val">brakes on</Label>
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ mistake: mass does not matter on a slope

export function TwoSlopes({ title, angle = 30, muk = 0.2 }: { title: string; angle?: number; muk?: number }) {
  const a = angle * DEG;
  const acc = G * (Math.sin(a) - muk * Math.cos(a));
  const base = 230;
  const hyp = base / Math.cos(a);
  return (
    <Anim title={title} height={190} loop={5} stillAt={2.5}>
      {(t) => {
        const tau = Math.max(0, t - 0.8);
        const dist = Math.min(0.5 * acc * tau * tau * 40, hyp - 90);
        const d = hyp - 36 - dist;
        const y0 = 168;
        return (
          <g>
            <line className="fig-ground" x1={0} x2={W} y1={y0} y2={y0} />
            {[30, 350].map((x0, i) => {
              const bw = i ? 48 : 30;
              const bh = i ? 34 : 22;
              const c = slopePoint(x0, y0, angle, d, bh / 2);
              return (
                <g key={i}>
                  <Incline x={x0} y={y0} base={base} angle={angle} mark={false} />
                  <Block x={c.x} y={c.y} w={bw} h={bh} angle={angle} label={i ? '5 kg' : '1 kg'} />
                </g>
              );
            })}
            <Label x={W / 2} y={24} kind="val">{`a = ${f2(acc)} m/s² for both`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}
