import { Anim, Arrow, Axes, Ball, Label, Line, Trail, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for measurement and experimental skills. Positions come from the real numbers, scaled to pixels. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

const bar = (x: number, y: number, w: number, h: number, key: string | number, o = 1) => <rect key={key} className="fig-ball" x={x} y={y} width={Math.max(0, w)} height={h} opacity={o} />;

// ------------------------------------------------------------------ repeated readings

const READINGS = [2.63, 2.56, 2.42, 2.71, 2.8];
const MEAN = 2.62;

export function Readings() {
  return (
    <Anim title="Five readings of a period drop onto a number line, their mean is marked, and then each reading's distance from the mean (its absolute error) is drawn" height={255} loop={13}>
      {(t) => {
        const X = (v: number) => 50 + ((v - 2.3) / 0.6) * 540;
        const y0 = 100;
        const showMean = ease(phase(t, 5, 5.8));
        const band = ease(phase(t, 10, 11));
        return (
          <g>
            <Line x1={40} y1={y0} x2={600} y2={y0} tone="soft" />
            {[2.4, 2.6, 2.8].map((v) => (
              <g key={v}>
                <Line x1={X(v)} y1={y0} x2={X(v)} y2={y0 + 6} tone="soft" />
                <Label x={X(v)} y={y0 + 22} kind="val">{v.toFixed(1)}</Label>
              </g>
            ))}
            <rect className="fig-ball" x={X(MEAN - 0.11)} y={y0 - 30} width={X(MEAN + 0.11) - X(MEAN - 0.11)} height={30} opacity={0.16 * band} />
            {READINGS.map((v, i) => {
              const p = ease(phase(t, 0.4 + i * 0.9, 1.3 + i * 0.9));
              return <Ball key={v} x={X(v)} y={lerp(20, y0 - 9, p)} r={7} />;
            })}
            <g opacity={showMean}>
              <Line x1={X(MEAN)} y1={y0 - 44} x2={X(MEAN)} y2={y0 + 6} tone="bright" dashed />
              <Label x={X(MEAN)} y={y0 - 50} kind="label">mean 2.62</Label>
            </g>
            {READINGS.map((v, i) => {
              const p = ease(phase(t, 6 + i * 0.7, 6.7 + i * 0.7));
              const y = 166 + i * 16;
              const xe = lerp(X(MEAN), X(v), p);
              const right = v > MEAN;
              return (
                <g key={v}>
                  <Arrow x1={X(MEAN)} y1={y} x2={xe} y2={y} tone="soft" width={2} />
                  <g opacity={p}>
                    <Label x={X(v) + (right ? 12 : -12)} y={y + 5} kind="val" anchor={right ? 'start' : 'end'}>{Math.abs(v - MEAN).toFixed(2)}</Label>
                  </g>
                </g>
              );
            })}
            <g opacity={band}>
              <Label x={X(MEAN + 0.11) + 10} y={y0 - 12} kind="label" anchor="start">± 0.11</Label>
            </g>
            <Label x={X(MEAN)} y={y0 + 46} kind="label">readings of the period, in seconds</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ accuracy and precision

const SHOTS: Pt[] = [
  [0.12, 0.05],
  [-0.1, 0.12],
  [0.06, -0.14],
  [-0.14, -0.06],
  [0.02, 0.15],
  [0.15, -0.02],
];

export function Targets() {
  const cases = [
    { name: ['accurate', 'precise'], cx: 0, cy: 0, k: 1 },
    { name: ['not accurate', 'precise'], cx: 0.5, cy: -0.35, k: 1 },
    { name: ['accurate', 'not precise'], cx: 0, cy: 0, k: 4 },
    { name: ['not accurate', 'not precise'], cx: -0.4, cy: 0.3, k: 4 },
  ];
  return (
    <Anim title="Four targets: shots that are tight and centred are accurate and precise, tight but off-centre are precise only, scattered around the centre are accurate only, and scattered off-centre are neither" height={225} loop={10}>
      {(t) => (
        <g>
          {cases.map((c, i) => {
            const cx = 80 + i * 160, cy = 85, R = 58;
            return (
              <g key={i}>
                {[1, 0.66, 0.33].map((f) => (
                  <circle key={f} className="fig-guide" cx={cx} cy={cy} r={R * f} fill="none" />
                ))}
                <Ball x={cx} y={cy} r={2.5} glow={false} />
                {SHOTS.map((s, j) => {
                  const p = ease(phase(t, 0.5 + j * 0.9, 1.1 + j * 0.9));
                  const x = cx + R * (c.cx + c.k * s[0]);
                  const y = cy + R * (c.cy + c.k * s[1]);
                  return <g key={j} opacity={p}><Ball x={x} y={lerp(y - 14, y, p)} r={4.5} glow={false} /></g>;
                })}
                <Label x={cx} y={178} kind="label">{c.name[0]}</Label>
                <Label x={cx} y={200} kind="label">{c.name[1]}</Label>
              </g>
            );
          })}
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ random and systematic errors

export function ErrorTypes() {
  const rnd = [-0.5, 0.35, -0.15, 0.55, 0.05, -0.38, 0.22];
  const tight = [0.03, -0.06, 0.07, -0.02, 0.05, -0.08, 0];
  return (
    <Anim title="Random errors scatter the readings on both sides of the true value, while a systematic error shifts every reading the same way" height={225} loop={10}>
      {(t) => {
        const xt = 320, sc = 140;
        const rows = [
          { y: 85, vals: rnd, off: 0, name: 'random errors: scattered, the mean is close' },
          { y: 165, vals: tight, off: 0.5, name: 'systematic error: tight, but all shifted' },
        ];
        return (
          <g>
            <Line x1={xt} y1={34} x2={xt} y2={190} tone="bright" dashed />
            <Label x={xt} y={22} kind="label">true value</Label>
            {rows.map((r) => {
              const m = r.vals.reduce((a, b) => a + b, 0) / r.vals.length + r.off;
              const pm = ease(phase(t, 7, 8));
              return (
                <g key={r.name}>
                  <Line x1={40} y1={r.y} x2={600} y2={r.y} tone="soft" />
                  {r.vals.map((v, j) => {
                    const p = ease(phase(t, 0.5 + j * 0.8, 1.2 + j * 0.8));
                    return <g key={j} opacity={p}><Ball x={xt + sc * (v + r.off)} y={lerp(r.y - 24, r.y - 6, p)} r={5.5} glow={false} /></g>;
                  })}
                  <g opacity={pm}>
                    <Line x1={xt + sc * m} y1={r.y - 14} x2={xt + sc * m} y2={r.y + 12} tone="bright" />
                    {r.off > 0 && <Arrow x1={xt} y1={r.y + 22} x2={xt + sc * m} y2={r.y + 22} tone="soft" width={2} />}
                  </g>
                  <Label x={xt} y={r.y + 44} kind="label">{r.name}</Label>
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ combining errors

export function SumErr({ diff }: { diff?: boolean }) {
  return (
    <Anim title={diff ? 'Two rods whose lengths wobble by their uncertainties: the gap between their ends, a difference, can swing by the sum of the two uncertainties' : 'Two rods laid end to end, each wobbling by its own uncertainty: the total length can swing by the sum of the two uncertainties'} height={225} loop={8}>
      {(t) => {
        const x0 = 70, a = diff ? 250 : 200, b = diff ? 140 : 150, ua = 16, ub = 11;
        const w = TAU / 4;
        const da = ua * Math.sin(w * t);
        const db = ub * Math.sin(1.6 * w * t + 1);
        if (diff) {
          const y1 = 50, y2 = 84, yd = 140;
          const ge = x0 + b, gaps = a - b;
          return (
            <g>
              <Line x1={x0} y1={y1} x2={x0 + a + da} y2={y1} tone="bright" />
              <Line x1={x0 + a + da} y1={y1 - 8} x2={x0 + a + da} y2={y1 + 8} tone="bright" />
              <Line x1={x0 + a - ua} y1={y1 + 8} x2={x0 + a + ua} y2={y1 + 8} tone="soft" />
              <Line x1={x0} y1={y2} x2={x0 + b + db} y2={y2} tone="bright" />
              <Line x1={x0 + b + db} y1={y2 - 8} x2={x0 + b + db} y2={y2 + 8} tone="bright" />
              <Line x1={x0 + b - ub} y1={y2 + 8} x2={x0 + b + ub} y2={y2 + 8} tone="soft" />
              <Line x1={x0} y1={y1 - 14} x2={x0} y2={y2 + 14} tone="soft" />
              <rect className="fig-ball" x={ge - ub + (a - b) * 0} y={yd - 9} width={gaps + ua + ub} height={18} opacity={0.14} />
              <Line x1={x0 + b + db} y1={yd} x2={x0 + a + da} y2={yd} tone="bright" />
              <Ball x={x0 + a + da} y={yd} r={4} glow={false} />
              <Ball x={x0 + b + db} y={yd} r={4} glow={false} />
              <Label x={x0 + a + 40} y={y1 + 6} kind="sym" anchor="start">a ± Δa</Label>
              <Label x={x0 + b + 40} y={y2 + 6} kind="sym" anchor="start">b ± Δb</Label>
              <Label x={x0 + b + db + 8} y={yd - 18} kind="sym" anchor="start">x = a − b</Label>
              <Label x={W / 2} y={190} kind="label">the gap can be off by Δa + Δb, never by less</Label>
              <Label x={W / 2} y={212} kind="val">{`gap = ${(gaps + da - db).toFixed(0)} px   (ranges ${(gaps - ua - ub).toFixed(0)} to ${(gaps + ua + ub).toFixed(0)})`}</Label>
            </g>
          );
        }
        const y1 = 55, yt = 130;
        const ea = x0 + a + da;
        const eb = ea + b + db;
        return (
          <g>
            <Line x1={x0} y1={y1} x2={ea} y2={y1} tone="bright" />
            <Line x1={ea} y1={y1} x2={eb} y2={y1} tone="soft" />
            <Line x1={x0} y1={y1 - 9} x2={x0} y2={y1 + 9} tone="bright" />
            <Line x1={ea} y1={y1 - 9} x2={ea} y2={y1 + 9} tone="bright" />
            <Line x1={eb} y1={y1 - 9} x2={eb} y2={y1 + 9} tone="bright" />
            <Line x1={x0 + a - ua} y1={y1 + 16} x2={x0 + a + ua} y2={y1 + 16} tone="soft" />
            <Label x={x0 + a / 2} y={y1 - 18} kind="sym">a ± Δa</Label>
            <Label x={x0 + a + b / 2} y={y1 - 18} kind="sym">b ± Δb</Label>
            <rect className="fig-ball" x={x0 + a + b - ua - ub} y={yt - 9} width={2 * (ua + ub)} height={18} opacity={0.14} />
            <Line x1={x0} y1={yt} x2={eb} y2={yt} tone="bright" />
            <Ball x={eb} y={yt} r={4} glow={false} />
            <Label x={x0 + (a + b) / 2 - 40} y={yt + 34} kind="sym">x = a + b</Label>
            <Label x={W / 2} y={190} kind="label">the total can be off by Δa + Δb: the errors add</Label>
            <Label x={W / 2} y={212} kind="val">{`end at ${(a + b + da + db).toFixed(0)} px   (ranges ${(a + b - ua - ub).toFixed(0)} to ${(a + b + ua + ub).toFixed(0)})`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function ProdErr() {
  return (
    <Anim title="A rectangle l by w whose sides each have a small uncertainty: the extra area is a strip along each side plus a tiny corner that can be ignored" height={235} loop={10}>
      {(t) => {
        const f = ease(phase(t, 0.6, 3.4));
        const c = ease(phase(t, 4, 5));
        const l = 280, w = 130, dl = 34 * f, dw = 26 * f;
        const x0 = 60, y1 = 205, yt = y1 - w;
        return (
          <g>
            <rect className="kit-block" x={x0} y={yt} width={l} height={w} />
            {bar(x0 + l, yt, dl, w, 'r', 0.35)}
            {bar(x0, yt - dw, l, dw, 't', 0.35)}
            {bar(x0 + l, yt - dw, dl, dw, 'c', 0.35 + 0.65 * c)}
            <Label x={x0 + l / 2} y={yt + w / 2 + 6} kind="sym">l w</Label>
            <Label x={x0 + l / 2} y={yt - 46} kind="sym">l Δw</Label>
            <Line x1={x0 + l / 2} y1={yt - 38} x2={x0 + l / 2} y2={yt - dw - 4} tone="soft" />
            <Line x1={x0 + l + dl + 6} y1={yt + w / 2} x2={x0 + l + 64} y2={yt + w / 2} tone="soft" />
            <Label x={x0 + l + 70} y={yt + w / 2 + 6} kind="sym" anchor="start">w Δl</Label>
            <Line x1={x0 + l + dl + 6} y1={yt - dw / 2} x2={x0 + l + 64} y2={yt - 26} tone="soft" />
            <Label x={x0 + l + 70} y={yt - 22} kind="sym" anchor="start">Δl Δw</Label>
            <Label x={x0 + l + 70} y={yt - 2} kind="label" anchor="start">tiny: ignore it</Label>
            <Label x={W - 14} y={22} kind="val" anchor="end">{`Δl/l = ${(dl / l * 100).toFixed(0)}%   Δw/w = ${(dw / w * 100).toFixed(0)}%`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ least count

export function LeastCount() {
  return (
    <Anim title="A pencil slides along a millimetre ruler and stops between the 23 and 24 millimetre marks; the reading can only be given to the nearest division, which is the least count" height={215} loop={9}>
      {(t) => {
        const x0 = 40, ppm = 18, X = (m: number) => x0 + m * ppm;
        const end = lerp(8, 23.4, ease(phase(t, 0.4, 3.4)));
        const stop = ease(phase(t, 4, 5));
        const yr = 110;
        return (
          <g>
            <rect className="kit-block" x={x0 - 10} y={yr} width={560} height={42} />
            {Array.from({ length: 31 }, (_, m) => (
              <g key={m}>
                <Line x1={X(m)} y1={yr} x2={X(m)} y2={yr + (m % 10 === 0 ? 20 : m % 5 === 0 ? 15 : 10)} tone={stop > 0.5 && (m === 23 || m === 24) ? 'bright' : 'soft'} />
                {m % 5 === 0 && <Label x={X(m)} y={yr + 38} kind="val">{String(m)}</Label>}
              </g>
            ))}
            <rect className="fig-ball" x={X(23)} y={yr} width={ppm} height={10} opacity={0.55 * stop} />
            <rect className="kit-block" x={x0 - 30} y={64} width={X(end) - x0 + 30} height={26} />
            <path className="kit-block" d={`M${X(end)} 64L${X(end) + 12} 77L${X(end)} 90Z`} />
            <Line x1={X(end) + 8} y1={78} x2={X(end) + 8} y2={yr} tone="soft" dashed />
            <g opacity={stop}>
              <Label x={X(23.5)} y={yr + 66} kind="label">between 23 and 24 mm</Label>
              <Label x={W / 2} y={198} kind="val">least count 1 mm: reading 23 mm, uncertain by about 1 mm</Label>
            </g>
            <Label x={W - 14} y={30} kind="label" anchor="end">smallest division = least count</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ vernier calipers

export function Vernier({ r = 4.3, closed, title, loop = 9 }: { r?: number; closed?: boolean; title: string; loop?: number }) {
  return (
    <Anim title={title} height={245} loop={loop}>
      {(t) => {
        const rv = r + (closed ? 1.4 : 1.6) * (1 - ease(phase(t, 0.5, 4)));
        const s0 = r < 11 ? Math.min(0, Math.floor(r) - 1) : Math.floor(r) - 2;
        const px = 36;
        const X = (m: number) => 30 + (m - s0) * px;
        const vx = (k: number) => X(rv) + k * 0.9 * px;
        const kk = Math.round((rv - Math.floor(rv)) * 10);
        const msr = Math.floor(rv) + (kk === 10 ? 1 : 0);
        const k = kk === 10 ? 0 : kk;
        const pulse = 3 + 1.5 * Math.sin(TAU * t * 1.6);
        const mainTicks: number[] = [];
        for (let m = Math.ceil(s0); m <= s0 + 15; m++) mainTicks.push(m);
        const settle = ease(phase(t, 4, 5));
        const withObject = !closed && r < 11;
        const z = r;
        return (
          <g>
            <rect className="kit-block" x={14} y={46} width={W - 28} height={38} />
            {mainTicks.map((m) => (
              <g key={m}>
                <Line x1={X(m)} y1={84} x2={X(m)} y2={m % 5 === 0 ? 72 : 76} tone="soft" />
                <Label x={X(m)} y={66} kind="val">{String(m)}</Label>
              </g>
            ))}
            <rect className="kit-block" x={X(rv) - 6} y={84} width={10 * 0.9 * px + 26} height={40} />
            {Array.from({ length: 11 }, (_, i) => (
              <g key={i}>
                <Line x1={vx(i)} y1={84} x2={vx(i)} y2={i % 5 === 0 ? 100 : 94} tone={i === k ? 'bright' : 'soft'} />
                <Label x={vx(i)} y={118} kind="val">{String(i)}</Label>
              </g>
            ))}
            <line className="fig-bar" x1={vx(k)} y1={68} x2={vx(k)} y2={104} style={{ strokeWidth: pulse }} />
            {withObject && (
              <g>
                <Line x1={X(0)} y1={46} x2={X(0)} y2={200} tone="bright" />
                <rect className="kit-block is-filled" x={X(0)} y={150} width={Math.max(0, X(r) - X(0))} height={50} opacity={0.5} />
                <Label x={(X(0) + X(r)) / 2} y={181} kind="label">object</Label>
              </g>
            )}
            <Line x1={X(rv)} y1={124} x2={X(rv)} y2={200} tone="bright" />
            {closed && <Line x1={X(0)} y1={46} x2={X(0)} y2={200} tone="soft" dashed />}
            <Label x={W - 16} y={140} kind="label" anchor="end">vernier scale</Label>
            <Label x={20} y={36} kind="label" anchor="start">main scale (mm)</Label>
            <Label x={W / 2} y={228} kind="val">
              {closed
                ? `division ${k} coincides: zero error ${z >= 0 ? '+' : '−'}${Math.abs(settle > 0.99 ? z : rv).toFixed(1)} mm`
                : `MSR ${msr} mm  +  VSR ${k} × 0.1 mm  =  ${(msr + k * 0.1).toFixed(1)} mm`}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ screw gauge

export function ScrewGauge({ obj = 2.86, z = 0, title, loop = 10 }: { obj?: number; z?: number; title: string; loop?: number }) {
  return (
    <Anim title={title} height={235} loop={loop}>
      {(t) => {
        const ppm = 44, xA = 70, ys = 85;
        const gap = obj > 0 ? obj + 1.3 * (1 - ease(phase(t, 0.5, 5))) : 1.3 * (1 - ease(phase(t, 0.5, 5)));
        const d = gap + z;
        const tip = xA + gap * ppm;
        const edge = tip + 160 + z * ppm;
        const psr = Math.floor(d / 0.5 + 1e-9) * 0.5;
        const cs = (d - psr) / 0.01;
        const csr = Math.round(cs) % 50;
        const reading = psr + Math.round(cs) * 0.01;
        const sx = (m: number) => xA + 160 + m * ppm;
        const ticks: number[] = [];
        for (let m = -0.5; m <= 6; m += 0.5) if (sx(m) < edge - 3 && sx(m) > xA + 138) ticks.push(Math.round(m * 10) / 10);
        return (
          <g>
            <rect className="kit-block" x={xA - 18} y={64} width={18} height={44} />
            <Line x1={xA - 18} y1={64} x2={xA + 135} y2={64} tone="soft" />
            {obj > 0 && <rect className="kit-block is-filled" x={xA} y={66} width={obj * ppm} height={38} opacity={0.5} />}
            {tip < xA + 135 && <rect className="kit-block" x={tip} y={ys - 8} width={xA + 135 - tip} height={16} />}
            <rect className="kit-block" x={xA + 135} y={ys - 15} width={Math.max(0, edge - xA - 135)} height={30} />
            <Line x1={xA + 135} y1={ys} x2={edge} y2={ys} tone="bright" />
            {ticks.map((m) => (
              <g key={m}>
                {Number.isInteger(m) ? (
                  <g>
                    <Line x1={sx(m)} y1={ys} x2={sx(m)} y2={ys - 15} tone="bright" />
                    <Label x={sx(m)} y={ys - 21} kind="val">{String(m)}</Label>
                  </g>
                ) : (
                  <Line x1={sx(m)} y1={ys} x2={sx(m)} y2={ys + 11} tone="soft" />
                )}
              </g>
            ))}
            <rect className="kit-block" x={edge} y={ys - 42} width={104} height={84} rx={3} />
            {Array.from({ length: 13 }, (_, i) => {
              const j = Math.floor(cs) + i - 6;
              const y = ys + (j - cs) * 7;
              const major = ((j % 50) + 50) % 5 === 0;
              if (Math.abs(y - ys) > 38) return null;
              return (
                <g key={j}>
                  <Line x1={edge + 2} y1={y} x2={edge + (major ? 20 : 12)} y2={y} tone={j === Math.round(cs) ? 'bright' : 'soft'} />
                  {major && <Label x={edge + 38} y={y + 5} kind="val">{String(((j % 50) + 50) % 50)}</Label>}
                </g>
              );
            })}
            <Line x1={edge} y1={ys} x2={edge + 26} y2={ys} tone="bright" />
            <rect className="kit-block" x={edge + 104} y={ys - 16} width={40} height={32} rx={3} />
            <Label x={W / 2} y={160} kind="val">{`PSR ${psr.toFixed(1)} mm   CSR ${csr}   LC 0.01 mm`}</Label>
            <Label x={W / 2} y={184} kind="val">{`reading = ${psr.toFixed(1)} + ${csr} × 0.01 = ${reading.toFixed(2)} mm`}</Label>
            <Label x={W / 2} y={210} kind="label">{z === 0 ? 'pitch 0.5 mm, 50 divisions' : obj > 0 ? `zero error ${z > 0 ? '+' : '−'}${Math.abs(z).toFixed(2)} mm: true diameter ${(reading - z).toFixed(2)} mm` : `jaws closed: zero error ${z > 0 ? '+' : '−'}${Math.abs(z).toFixed(2)} mm`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the pendulum

export function PendulumG() {
  return (
    <Anim title="A simple pendulum is timed over a number of oscillations while the stopwatch runs; the length is measured from the pivot to the centre of the bob" height={245} loop={12}>
      {(t) => {
        const px = 170, py = 26, L = 160, r = 13;
        const th = 0.15 * Math.sin((TAU * t) / 2);
        const bx = px + L * Math.sin(th), by = py + L * Math.cos(th);
        const n = Math.floor(t / 2);
        const cx = 450, cy = 90;
        return (
          <g>
            <Line x1={px - 40} y1={py} x2={px + 40} y2={py} tone="bright" />
            <Line x1={px} y1={py} x2={px} y2={py + L + 20} tone="soft" dashed />
            <Line x1={px} y1={py} x2={bx} y2={by} tone="bright" />
            <circle className="fig-ball" cx={bx} cy={by} r={r} />
            <Arrow x1={px - 46} y1={py} x2={px - 46} y2={py + L} tone="soft" width={2} />
            <Line x1={px - 56} y1={py + L} x2={px - 36} y2={py + L} tone="soft" />
            <Label x={px - 62} y={py + L / 2 + 6} kind="sym" anchor="end">L</Label>
            <Line x1={px + 40} y1={py} x2={px + 40} y2={py + L - r} tone="soft" />
            <Label x={px + 50} y={py + (L - r) / 2 + 6} kind="sym" anchor="start">l</Label>
            <Line x1={px + 34} y1={py + L - r} x2={px + 46} y2={py + L - r} tone="soft" />
            <Label x={px + 50} y={py + L + 18} kind="sym" anchor="start">r</Label>
            <Label x={px} y={py + L + 44} kind="label">L = l + r, to the centre of the bob</Label>
            <circle className="fig-guide" cx={cx} cy={cy} r={44} fill="none" />
            {Array.from({ length: 12 }, (_, i) => (
              <Line key={i} x1={cx + 38 * Math.sin((i * TAU) / 12)} y1={cy - 38 * Math.cos((i * TAU) / 12)} x2={cx + 44 * Math.sin((i * TAU) / 12)} y2={cy - 44 * Math.cos((i * TAU) / 12)} tone="soft" />
            ))}
            <Line x1={cx} y1={cy} x2={cx + 34 * Math.sin((TAU * t) / 12)} y2={cy - 34 * Math.cos((TAU * t) / 12)} tone="bright" />
            <Ball x={cx} y={cy} r={3} glow={false} />
            <Label x={cx} y={168} kind="val">{`stopwatch t = ${t.toFixed(1)} s`}</Label>
            <Label x={cx} y={192} kind="val">{`swings counted n = ${n}`}</Label>
            <Label x={cx} y={216} kind="val">{n > 0 ? `T = ${(2 * n).toFixed(1)} / ${n} = 2.00 s` : 'T = t / n'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function TimingError() {
  return (
    <Anim title="The percentage error in the period falls as more oscillations are timed: a reaction-time error of 0.2 seconds is 10 percent of one 2 second swing but only 0.5 percent of 20 swings" height={245} loop={11}>
      {(t) => {
        const x0 = 70, y0 = 200, X = (n: number) => x0 + (n / 40) * 480, Y = (e: number) => y0 - e * 15;
        const n = 1 + 39 * ease(phase(t, 0.6, 7));
        const e = 10 / n;
        const mk = (nn: number) => ({ x: X(nn), y: Y(10 / nn) });
        const a = mk(1), b = mk(20);
        const p1 = ease(phase(t, 7.5, 8.3));
        return (
          <g>
            <Axes x={x0} y={y0} w={500} h={190} xLabel="n" yLabel="%" />
            <Label x={x0 + 12} y={24} kind="label" anchor="start">percentage error in T</Label>
            <Trail points={curve(80, 39, (s) => [X(1 + s), Y(10 / (1 + s))] as Pt)} />
            <Line x1={X(n)} y1={y0} x2={X(n)} y2={Y(e)} tone="soft" dashed />
            <Ball x={X(n)} y={Y(e)} r={5.5} />
            <g opacity={p1}>
              <Ball x={a.x} y={a.y} r={4} ghost />
              <Label x={a.x + 12} y={a.y + 5} kind="label" anchor="start">1 swing: 10 %</Label>
              <Ball x={b.x} y={b.y} r={4} ghost />
              <Label x={b.x} y={b.y - 16} kind="label">20 swings: 0.5 %</Label>
            </g>
            <Label x={W - 16} y={40} kind="val" anchor="end">{`n = ${n.toFixed(0)}`}</Label>
            <Label x={W - 16} y={60} kind="val" anchor="end">{`error = ${e.toFixed(1)} %`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ graphs

export function LinearGraph() {
  return (
    <Anim title="A straight line y equals m x plus c: the slope Δy over Δx stays the same however large the triangle is drawn, and the line cuts the y axis at c" height={235} loop={10}>
      {(t) => {
        const ox = 60, oy = 205, sx = 56, sy = 19;
        const X = (x: number) => ox + x * sx, Y = (y: number) => oy - y * sy;
        const m = 1.5, c = 0.5;
        const x1 = 1, y1 = m * x1 + c;
        const dx = 0.8 + 3.2 * (0.5 - 0.5 * Math.cos((TAU * t) / 10));
        const x2 = x1 + dx, y2 = m * x2 + c;
        return (
          <g>
            <Axes x={ox} y={oy} w={380} h={190} xLabel="x" yLabel="y" />
            <Line x1={X(0)} y1={Y(c)} x2={X(6)} y2={Y(m * 6 + c)} tone="bright" />
            <Ball x={X(0)} y={Y(c)} r={5} />
            <Label x={X(0) - 12} y={Y(c) + 6} kind="sym" anchor="end">c</Label>
            <Line x1={X(x1)} y1={Y(y1)} x2={X(x2)} y2={Y(y1)} tone="soft" dashed />
            <Line x1={X(x2)} y1={Y(y1)} x2={X(x2)} y2={Y(y2)} tone="soft" dashed />
            <Ball x={X(x1)} y={Y(y1)} r={4} glow={false} />
            <Ball x={X(x2)} y={Y(y2)} r={4} glow={false} />
            <Label x={(X(x1) + X(x2)) / 2} y={Y(y1) + 20} kind="sym">Δx</Label>
            <Label x={X(x2) + 14} y={(Y(y1) + Y(y2)) / 2 + 6} kind="sym" anchor="start">Δy</Label>
            <Label x={470} y={90} kind="val" anchor="start">{`Δx = ${dx.toFixed(2)}`}</Label>
            <Label x={470} y={112} kind="val" anchor="start">{`Δy = ${(y2 - y1).toFixed(2)}`}</Label>
            <Label x={470} y={140} kind="val" anchor="start">{`Δy/Δx = ${((y2 - y1) / dx).toFixed(2)}`}</Label>
            <Label x={470} y={166} kind="val" anchor="start">{`c = ${c.toFixed(2)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

const PTS: Pt[] = [
  [0.4, 1.7],
  [0.6, 2.2],
  [0.8, 3.35],
  [1.0, 3.9],
  [1.2, 4.85],
];

export function BestFit() {
  return (
    <Anim title="Five data points of period squared against length with a straight line swinging about their centre and settling where the gaps above and below balance and the total of the squared gaps is smallest" height={235} loop={11}>
      {(t) => {
        const ox = 60, oy = 205, sx = 240, sy = 34;
        const X = (x: number) => ox + x * sx, Y = (y: number) => oy - y * sy;
        const u = Math.max(0, t - 1.2);
        const settle = ease(phase(t, 1.2, 7));
        const m = 4 + (t < 1.2 ? 0 : 1.3 * Math.exp(-1.1 * u) * Math.cos(3.2 * u));
        const mean: Pt = [0.8, 3.2];
        const c = mean[1] - m * mean[0];
        const S = PTS.reduce((a, p) => a + (p[1] - (c + m * p[0])) ** 2, 0);
        const lineA = ease(phase(t, 1, 1.8));
        return (
          <g>
            <Axes x={ox} y={oy} w={380} h={190} xLabel="L" yLabel="T²" />
            <g opacity={lineA}>
              <Line x1={X(0)} y1={Y(c)} x2={X(1.4)} y2={Y(c + m * 1.4)} tone="bright" />
              {PTS.map((p, i) => (
                <Line key={i} x1={X(p[0])} y1={Y(p[1])} x2={X(p[0])} y2={Y(c + m * p[0])} tone="soft" />
              ))}
            </g>
            {PTS.map((p, i) => {
              const a = ease(phase(t, 0.1 + i * 0.18, 0.5 + i * 0.18));
              return <g key={i} opacity={a}><Ball x={X(p[0])} y={Y(p[1])} r={5} glow={false} /></g>;
            })}
            <Ball x={X(mean[0])} y={Y(mean[1])} r={9} ghost />
            <Label x={X(mean[0]) + 14} y={Y(mean[1]) + 32} kind="label" anchor="start">centre of the points</Label>
            <Label x={470} y={90} kind="val" anchor="start">{`slope = ${m.toFixed(2)}`}</Label>
            <Label x={470} y={112} kind="val" anchor="start">{`Σ gaps² = ${S.toFixed(3)}`}</Label>
            <g opacity={settle > 0.98 ? 1 : 0}>
              <Label x={470} y={142} kind="label" anchor="start">best fit</Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

export function Linearise() {
  return (
    <Anim title="Period against length is a curve, but as the vertical quantity is changed from T to T squared the points straighten onto a line through the origin" height={235} loop={11}>
      {(t) => {
        const ox = 60, oy = 205, sx = 300, H = 170;
        const p = 1 + ease(phase(t, 1, 6.5));
        const g = (L: number) => (2 * Math.sqrt(L)) ** p / (2 * Math.sqrt(1.2)) ** p;
        const X = (L: number) => ox + L * sx, Y = (v: number) => oy - v * H;
        const Ls = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2];
        return (
          <g>
            <Axes x={ox} y={oy} w={400} h={H + 20} xLabel="L" yLabel="y" />
            <Line x1={X(0)} y1={Y(0)} x2={X(1.2)} y2={Y(1)} tone="soft" dashed />
            <Trail points={curve(60, 1.2, (L) => [X(L), Y(g(L))] as Pt)} tone="soft" />
            {Ls.map((L) => (
              <Ball key={L} x={X(L)} y={Y(g(L))} r={5} glow={false} />
            ))}
            <text className="fig-val" x={480} y={100}>
              y = T<tspan baselineShift="super" fontSize="70%">{p.toFixed(2)}</tspan>
            </text>
            <Label x={480} y={126} kind="label" anchor="start">{p > 1.97 ? 'a straight line' : p < 1.05 ? 'a curve' : 'straightening'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function SlopeSpan() {
  return (
    <Anim title="Reading a slope from two points on a graph: with the points close together the uncertainty in each reading makes the slope very uncertain, and as the points are moved far apart the two extreme lines draw together" height={235} loop={10}>
      {(t) => {
        const ox = 60, oy = 205, sx = 56, sy = 19;
        const X = (x: number) => ox + x * sx, Y = (y: number) => oy - y * sy;
        const m = 1.5, c = 0.5, e = 0.4;
        const x1 = 0.6;
        const dx = 0.5 + 4.6 * ease(phase(t, 0.6, 6));
        const x2 = x1 + dx;
        const y1 = m * x1 + c, y2 = m * x2 + c;
        const unc = (2 * e) / dx;
        return (
          <g>
            <Axes x={ox} y={oy} w={380} h={190} xLabel="x" yLabel="y" />
            <Line x1={X(0)} y1={Y(c)} x2={X(6)} y2={Y(m * 6 + c)} tone="soft" />
            <Line x1={X(x1)} y1={Y(y1 + e)} x2={X(x2)} y2={Y(y2 - e)} tone="bright" dashed />
            <Line x1={X(x1)} y1={Y(y1 - e)} x2={X(x2)} y2={Y(y2 + e)} tone="bright" dashed />
            <circle className="fig-ghost" cx={X(x1)} cy={Y(y1)} r={e * sy} />
            <circle className="fig-ghost" cx={X(x2)} cy={Y(y2)} r={e * sy} />
            <Ball x={X(x1)} y={Y(y1)} r={3} glow={false} />
            <Ball x={X(x2)} y={Y(y2)} r={3} glow={false} />
            <Label x={470} y={90} kind="val" anchor="start">{`Δx = ${dx.toFixed(1)}`}</Label>
            <Label x={470} y={116} kind="val" anchor="start">{`slope = ${m.toFixed(2)}`}</Label>
            <Label x={470} y={140} kind="val" anchor="start">{`± ${unc.toFixed(2)}`}</Label>
            <Label x={470} y={170} kind="label" anchor="start">{unc > 0.5 ? 'too close' : unc < 0.2 ? 'far apart' : ''}</Label>
          </g>
        );
      }}
    </Anim>
  );
}
