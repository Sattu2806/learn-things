import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Label, Line, Readout, Trail, W, ease, phase } from '../kit/Anim';

/** Animated diagrams for electromagnetic waves. Everything is driven by the real formulas. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

function Key({ x, y, name, tone = 'bright', dashed }: { x: number; y: number; name: ReactNode; tone?: 'bright' | 'soft'; dashed?: boolean }) {
  return (
    <g>
      <Line x1={x} y1={y - 4} x2={x + 22} y2={y - 4} tone={tone} dashed={dashed} />
      <Label x={x + 28} y={y} kind="label" anchor="start">
        {name}
      </Label>
    </g>
  );
}

// ------------------------------------------------------------------ the charging capacitor

export function Charging({ height = 250, title = 'A capacitor charging: charge flows along the wires, and between the plates an electric field grows with a dashed displacement current carrying on where the wire stops' }: { height?: number; title?: string }) {
  return (
    <Anim title={title} height={height} loop={6}>
      {(t) => {
        const q = 1 - Math.exp(-Math.min(t, 5.2) / 1.1);
        const cur = Math.exp(-Math.min(t, 5.2) / 1.1);
        const y0 = height / 2 + 6;
        const lp = 266, rp = 354;
        const hh = 54;
        const dots = (xa: number, xb: number, k0: number) =>
          Array.from({ length: 9 }, (_, k) => {
            const s = (k / 9 + 0.9 * q + k0) % 1;
            return <Ball key={k} x={xa + s * (xb - xa)} y={y0} r={3} glow={false} />;
          });
        return (
          <g>
            <Line x1={30} y1={y0} x2={lp} y2={y0} tone="bright" />
            <Line x1={rp} y1={y0} x2={W - 30} y2={y0} tone="bright" />
            <Line x1={lp} y1={y0 - hh} x2={lp} y2={y0 + hh} tone="bright" />
            <Line x1={rp} y1={y0 - hh} x2={rp} y2={y0 + hh} tone="bright" />
            {dots(30, lp - 6, 0)}
            {dots(rp + 6, W - 30, 0.05)}
            <text className="fig-sym" x={lp - 22} y={y0 - hh + 14} opacity={q} fontSize={20}>+</text>
            <text className="fig-sym" x={rp + 12} y={y0 - hh + 14} opacity={q} fontSize={20}>−</text>
            {[-40, -20, 0, 20, 40].map((dy) => (
              <Arrow key={dy} x1={lp + 4} y1={y0 + dy} x2={lp + 4 + 78 * q + 3} y2={y0 + dy} tone="soft" />
            ))}
            <g opacity={0.25 + 0.75 * cur}>
              <line className="fig-vec" x1={lp + 4} x2={rp - 4} y1={y0} y2={y0} strokeDasharray="6 6" strokeDashoffset={-t * 26} />
            </g>
            <ellipse className="fig-guide" cx={150} cy={y0} rx={7} ry={32} fill="none" />
            <ellipse className="fig-guide" cx={310} cy={y0} rx={7} ry={32} fill="none" />
            <Label x={150} y={y0 - 44} kind="sym">I</Label>
            <Label x={310} y={y0 - 70} kind="sym">I_d</Label>
            <Label x={150} y={y0 + 56} kind="label">wire: moving charge</Label>
            <Label x={310} y={y0 + 74} kind="label">gap: changing E</Label>
            <Readout x={W - 12} y={20}>{`I = ${cur.toFixed(2)} I₀`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Two surfaces on one loop: only one of them is crossed by the current. */
export function TwoSurfaces({ height = 250 }: { height?: number }) {
  return (
    <Anim title="One loop around the wire can be closed by a flat disc, which the current crosses, or by a bag that passes between the capacitor plates, which no current crosses" height={height} loop={8}>
      {(t) => {
        const y0 = height / 2;
        const lp = 270, rp = 360;
        const on1 = (t % 8) < 4;
        const pulse = 0.5 + 0.5 * Math.sin(TAU * t / 2);
        const lx = 150;
        return (
          <g>
            <Line x1={30} y1={y0} x2={lp} y2={y0} tone="bright" />
            <Line x1={rp} y1={y0} x2={W - 30} y2={y0} tone="bright" />
            <Line x1={lp} y1={y0 - 50} x2={lp} y2={y0 + 50} tone="bright" />
            <Line x1={rp} y1={y0 - 50} x2={rp} y2={y0 + 50} tone="bright" />
            <ellipse className="fig-vec" cx={lx} cy={y0} rx={14} ry={46} fill="none" />
            {on1 ? (
              <ellipse cx={lx} cy={y0} rx={14} ry={46} fill="#fff" opacity={0.12 + 0.2 * pulse} />
            ) : (
              <path d={`M${lx} ${y0 - 46}C372 ${y0 - 60} 372 ${y0 + 60} ${lx} ${y0 + 46}`} fill="#fff" opacity={0.08 + 0.14 * pulse} stroke="#fff" strokeOpacity={0.8} />
            )}
            {Array.from({ length: 5 }, (_, k) => {
              const s = (k / 5 + t / 3) % 1;
              return <Ball key={k} x={30 + s * (lp - 36)} y={y0} r={3} glow={false} />;
            })}
            {!on1 &&
              [-24, 0, 24].map((dy) => (
                <Arrow key={dy} x1={lp + 4} y1={y0 + dy} x2={rp - 4} y2={y0 + dy} tone="soft" />
              ))}
            <Label x={W / 2} y={height - 36} kind="label">{on1 ? 'flat surface: the current I passes through it' : 'bulging surface: the field passes through it, no current does'}</Label>
            <Label x={W / 2} y={height - 14} kind="sym">{on1 ? 'B · 2πr = μ₀ I' : 'B · 2πr = 0 ?'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** The magnetic field in the gap grows in proportion to r, then falls as 1 / r outside the plates. */
export function GapB({ height = 250 }: { height?: number }) {
  return (
    <Anim title="Seen along the axis of the capacitor, the magnetic field circles the axis; it grows in step with the distance from the axis inside the plate radius and falls away outside it" height={height} loop={10}>
      {(t) => {
        const cx = 120, cy = height / 2, R = 50;
        const rmax = 2.4 * R;
        const r = rmax * (0.06 + 0.94 * (0.5 - 0.5 * Math.cos((TAU * t) / 10)));
        const B = (rr: number) => (rr <= R ? rr / R : R / rr);
        const th = (TAU * t) / 3;
        const gx = 280, gw = 320, gh = 100;
        const gy = height - 46;
        const px = (rr: number) => gx + (rr / rmax) * gw;
        return (
          <g>
            <circle className="fig-guide fig-dash" cx={cx} cy={cy} r={R} fill="none" />
            <Label x={cx} y={cy + R + 22} kind="label">plate edge</Label>
            <circle className="fig-guide" cx={cx} cy={cy} r={r} fill="none" />
            <Ball x={cx + r * Math.cos(th)} y={cy - r * Math.sin(th)} r={5} />
            <Arrow x1={cx + r * Math.cos(th)} y1={cy - r * Math.sin(th)} x2={cx + r * Math.cos(th) + 34 * B(r) * Math.sin(th)} y2={cy - r * Math.sin(th) + 34 * B(r) * Math.cos(th)} label="B" />
            <Axes x={gx} y={gy} w={gw + 12} h={gh + 12} xLabel="r" yLabel="B" />
            <Trail points={curve(80, rmax, (s) => [px(s), gy - gh * B(s)] as Pt)} />
            <Line x1={px(R)} y1={gy} x2={px(R)} y2={gy - gh} tone="soft" dashed />
            <Label x={px(R)} y={gy + 18} kind="sym">R</Label>
            <Line x1={px(r)} y1={gy} x2={px(r)} y2={gy - gh * B(r)} tone="soft" dashed />
            <Ball x={px(r)} y={gy - gh * B(r)} r={5} />
            <Label x={gx + 12} y={gy - gh - 6} kind="label" anchor="start">B ∝ r inside, B ∝ 1 / r outside</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ one changing field makes the other

export function Leapfrog({ height = 240 }: { height?: number }) {
  return (
    <Anim title="At one point the electric and magnetic fields alternate: while one is changing fastest it is making the other, and the glow passes back and forth" height={height} loop={8}>
      {(t) => {
        const om = TAU / 4;
        const th = om * t;
        const gx = 30, gw = 330, y1 = 70, y2 = 175, A = 40;
        const pps = gw / 4;
        const eRate = Math.abs(Math.cos(th));
        const bRate = Math.abs(Math.sin(th));
        return (
          <g>
            <Line x1={gx} y1={y1 - A - 8} x2={gx} y2={y1 + A + 8} tone="soft" />
            <Line x1={gx} y1={y1} x2={gx + gw} y2={y1} tone="soft" />
            <Trail points={curve(90, 4, (u) => [gx + u * pps, y1 - A * Math.sin(om * (t - u))] as Pt)} />
            <Ball x={gx} y={y1 - A * Math.sin(th)} r={5} />
            <Label x={gx + 8} y={y1 - A - 6} kind="sym" anchor="start">E</Label>
            <Line x1={gx} y1={y2 - A - 8} x2={gx} y2={y2 + A + 8} tone="soft" />
            <Line x1={gx} y1={y2} x2={gx + gw} y2={y2} tone="soft" />
            <Trail points={curve(90, 4, (u) => [gx + u * pps, y2 - A * Math.sin(om * (t - u))] as Pt)} tone="soft" dashed />
            <Ball x={gx} y={y2 - A * Math.sin(th)} r={5} />
            <Label x={gx + 8} y={y2 - A - 6} kind="sym" anchor="start">B</Label>
            <g opacity={0.15 + 0.85 * eRate}>
              <Arrow x1={400} y1={70} x2={400} y2={105} />
              <Label x={626} y={92} kind="label" anchor="end">changing E makes B</Label>
            </g>
            <g opacity={0.15 + 0.85 * bRate}>
              <Arrow x1={400} y1={175} x2={400} y2={140} />
              <Label x={626} y={162} kind="label" anchor="end">changing B makes E</Label>
            </g>
            <Label x={W - 14} y={height - 10} kind="label" anchor="end">each field keeps the other going</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the wave itself

export function EmWave({ title, height = 260, lambda = 190, speed = 1, phaseOffset = 0 }: { title: string; height?: number; lambda?: number; speed?: number; phaseOffset?: number }) {
  return (
    <Anim title={title} height={height} loop={6}>
      {(t) => {
        const x0 = 36, x1 = 610, y0 = height * 0.5;
        const k = TAU / lambda;
        const om = (TAU / 3) * speed;
        const E = 60, Bm = 56;
        const bx = -0.62, by = 0.46;
        const ph = (x: number) => k * (x - x0) - om * t + phaseOffset;
        const xs: number[] = [];
        for (let x = x0; x <= x1; x += lambda / 9) xs.push(x);
        return (
          <g>
            <Arrow x1={x0 - 10} y1={y0} x2={x1 + 10} y2={y0} tone="soft" />
            <Label x={x1 - 4} y={y0 + 24} kind="label" anchor="end">direction of travel</Label>
            {xs.map((x) => {
              const s = Math.sin(ph(x));
              return (
                <g key={x}>
                  <Arrow x1={x} y1={y0} x2={x} y2={y0 - E * s} tone="soft" />
                  <Arrow x1={x} y1={y0} x2={x + bx * Bm * s} y2={y0 + by * Bm * s} tone="soft" />
                </g>
              );
            })}
            <Trail points={curve(200, x1 - x0, (u) => [x0 + u, y0 - E * Math.sin(ph(x0 + u))] as Pt)} />
            <Trail points={curve(200, x1 - x0, (u) => [x0 + u + bx * Bm * Math.sin(ph(x0 + u)), y0 + by * Bm * Math.sin(ph(x0 + u))] as Pt)} tone="soft" dashed />
            <Key x={20} y={height - 12} name="E (up and down)" />
            <Key x={170} y={height - 12} name="B (in and out of the page)" tone="soft" dashed />
          </g>
        );
      }}
    </Anim>
  );
}

/** Same speed, three wavelengths: the number of crests passing a point per second goes as 1 / λ. */
export function WaveLambda({ height = 260 }: { height?: number }) {
  const rows = [
    { lam: 200, name: 'λ', f: 'f' },
    { lam: 100, name: 'λ / 2', f: '2f' },
    { lam: 50, name: 'λ / 4', f: '4f' },
  ];
  return (
    <Anim title="Three waves travel at the same speed; the shorter the wavelength, the more crests pass a fixed point each second, so the frequency is higher" height={height} loop={8}>
      {(t) => {
        const c = 70; // px per second, the same for all
        const x0 = 30, x1 = 480, xd = 430;
        return (
          <g>
            <Line x1={xd} y1={14} x2={xd} y2={height - 14} tone="soft" dashed />
            {rows.map((r, k) => {
              const y = 50 + k * 80;
              const f = (x: number) => Math.sin((TAU / r.lam) * (x - x0 - c * t));
              return (
                <g key={r.name}>
                  <Line x1={x0} y1={y} x2={x1} y2={y} tone="soft" />
                  <Trail points={curve(200, x1 - x0, (u) => [x0 + u, y - 24 * f(x0 + u)] as Pt)} />
                  <Ball x={xd} y={y - 24 * f(xd)} r={5} />
                  <Label x={x1 + 14} y={y - 6} kind="sym" anchor="start">{r.name}</Label>
                  <Label x={x1 + 14} y={y + 16} kind="label" anchor="start">{`frequency ${r.f}`}</Label>
                </g>
              );
            })}
            <Label x={xd} y={height - 2} kind="label">detector</Label>
            <Arrow x1={560} y1={height - 24} x2={620} y2={height - 24} tone="soft" label="c" />
          </g>
        );
      }}
    </Anim>
  );
}

export function LightTravel({ height = 220 }: { height?: number }) {
  return (
    <Anim title="A pulse of light leaves the Earth and reaches the Moon in about one and a quarter seconds, a distance a jet would take weeks to fly" height={height} loop={5}>
      {(t) => {
        const ex = 70, mx = 560, y = height / 2;
        const p = Math.min(1, t / 1.28);
        const back = ease(phase(t, 2.6, 3.9));
        const x = ex + (mx - ex) * (t < 2.6 ? p : 1 - back);
        const lit = t >= 1.28 && t < 2.6;
        return (
          <g>
            <circle className="kit-block" cx={ex} cy={y} r={34} />
            <circle className="kit-block" cx={mx} cy={y} r={11} />
            <circle cx={mx} cy={y} r={11} fill="#fff" opacity={lit ? 0.7 : 0.1} />
            <Label x={ex} y={y + 58} kind="label">Earth</Label>
            <Label x={mx} y={y + 58} kind="label">Moon</Label>
            <Line x1={ex + 40} y1={y} x2={mx - 18} y2={y} tone="soft" dashed />
            {[0.2, 0.4, 0.6, 0.8].map((q) => (
              <Line key={q} x1={ex + 40 + q * 440} y1={y - 5} x2={ex + 40 + q * 440} y2={y + 5} tone="soft" />
            ))}
            <Ball x={x} y={y} r={7} />
            <Label x={W / 2} y={34} kind="val">{`t = ${Math.min(t, 1.28).toFixed(2)} s`}</Label>
            <Label x={W / 2} y={58} kind="label">3.84 × 10⁸ m at 3 × 10⁸ m/s</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ energy

export function Poynting({ height = 260 }: { height?: number }) {
  return (
    <Anim title="The electric and magnetic fields carry equal energy densities; the energy flows along the direction of travel, in pulses that are biggest where the fields are biggest" height={height} loop={6}>
      {(t) => {
        const x0 = 36, x1 = 600, y0 = 80;
        const k = TAU / 190, om = TAU / 3;
        const s = (x: number) => Math.sin(k * (x - x0) - om * t);
        const base = height - 34;
        const xs: number[] = [];
        for (let x = x0 + 8; x <= x1; x += 21) xs.push(x);
        return (
          <g>
            <Line x1={x0} y1={y0} x2={x1} y2={y0} tone="soft" />
            <Trail points={curve(200, x1 - x0, (u) => [x0 + u, y0 - 44 * s(x0 + u)] as Pt)} />
            {xs.map((x) => (
              <Arrow key={x} x1={x} y1={base} x2={x + 46 * s(x) ** 2 + 3} y2={base} tone="soft" />
            ))}
            <Label x={x0} y={y0 - 54} kind="label" anchor="start">E and B (in step)</Label>
            <Label x={x0} y={base - 20} kind="label" anchor="start">energy flow, proportional to E · B</Label>
            <Key x={x1 - 190} y={height - 10} name="u_E = u_B" tone="soft" dashed />
            <Trail points={curve(200, x1 - x0, (u) => [x0 + u, y0 + 48 - 30 * s(x0 + u) ** 2] as Pt)} tone="soft" dashed />
          </g>
        );
      }}
    </Anim>
  );
}

export function RadPressure({ height = 240 }: { height?: number }) {
  return (
    <Anim title="Light pushes: a plate that absorbs the light is nudged by the momentum it carries, and a mirror that reflects it is nudged twice as hard" height={height} loop={8}>
      {(t) => {
        const rows = [
          { y: 70, name: 'absorbs: momentum U / c', kick: 1 },
          { y: 170, name: 'reflects: momentum 2U / c', kick: 2 },
        ];
        const push = ease(phase(t, 0, 7));
        return (
          <g>
            {rows.map((r) => {
              const px = 400 + r.kick * 18 * push;
              return (
                <g key={r.name}>
                  {Array.from({ length: 4 }, (_, k) => {
                    const u = (t / 1.2 + k * 0.25) % 1;
                    if (u < 0.5) return <Ball key={k} x={40 + (u / 0.5) * (px - 50)} y={r.y + (k - 1.5) * 9} r={3.5} />;
                    return r.kick === 2 ? <Ball key={k} x={px - ((u - 0.5) / 0.5) * (px - 50)} y={r.y + (k - 1.5) * 9} r={3.5} ghost /> : null;
                  })}
                  <rect className={r.kick === 1 ? 'kit-block is-filled' : 'kit-block'} x={px} y={r.y - 34} width={14} height={68} rx={2} />
                  <Label x={40} y={r.y - 44} kind="label" anchor="start">{r.name}</Label>
                  <Arrow x1={px + 24} y1={r.y} x2={px + 24 + 22 * r.kick} y2={r.y} tone="soft" />
                </g>
              );
            })}
            <Readout x={W - 12} y={height - 8}>pressure = I / c  or  2I / c</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ making waves

export function Antenna({ height = 250, title = 'A charge shaken up and down on an antenna sends out rings of changing field that spread at the speed of light' }: { height?: number; title?: string }) {
  return (
    <Anim title={title} height={height} loop={6}>
      {(t) => {
        const cx = 190, cy = height / 2;
        const per = 1.5;
        const y = cy + 34 * Math.sin((TAU * t) / per);
        const rings: ReactNode[] = [];
        for (let k = 0; k < 6; k++) {
          const age = ((t / per) % 1) + k;
          const r = age * 52;
          if (r < 140) rings.push(<circle key={k} cx={cx} cy={cy} r={Math.max(1, r * 1.0)} fill="none" stroke="#fff" strokeOpacity={0.55 * (1 - r / 280)} strokeWidth={2} />);
        }
        const wx = 400;
        return (
          <g>
            {rings}
            <Line x1={cx} y1={cy - 70} x2={cx} y2={cy + 70} tone="bright" />
            <Ball x={cx} y={y} r={7} />
            <Arrow x1={cx + 24} y1={y} x2={cx + 24} y2={y - 30 * Math.cos((TAU * t) / per)} tone="soft" label="a" />
            <Label x={cx} y={cy + 100} kind="label">oscillating charge</Label>
            <Line x1={wx} y1={cy} x2={W - 14} y2={cy} tone="soft" />
            <Trail points={curve(120, W - 14 - wx, (u) => [wx + u, cy - 40 * Math.sin((TAU * (t - u / 110)) / per)] as Pt)} />
            <Label x={(wx + W) / 2} y={cy + 70} kind="label">far away: a plane wave</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ in a medium

export function Medium({ n = 1.5, height = 220 }: { n?: number; height?: number }) {
  return (
    <Anim title="A wave entering glass keeps its frequency but slows down, so its wavelength shortens by the refractive index" height={height} loop={6}>
      {(t) => {
        const x0 = 20, xb = 320, x1 = 620, y = height / 2;
        const lam = 120;
        const om = TAU / 3;
        const phaseAt = (x: number) => (x <= xb ? (TAU / lam) * (x - x0) : (TAU / lam) * (xb - x0) + ((TAU * n) / lam) * (x - xb));
        const f = (x: number) => Math.sin(phaseAt(x) - om * t);
        return (
          <g>
            <rect x={xb} y={14} width={x1 - xb} height={height - 28} fill="#fff" opacity={0.07} />
            <Line x1={xb} y1={14} x2={xb} y2={height - 14} tone="soft" />
            <Line x1={x0} y1={y} x2={x1} y2={y} tone="soft" />
            <Trail points={curve(300, x1 - x0, (u) => [x0 + u, y - 42 * f(x0 + u)] as Pt)} />
            <Ball x={150} y={y - 42 * f(150)} r={4.5} />
            <Ball x={470} y={y - 42 * f(470)} r={4.5} />
            <Label x={170} y={height - 18} kind="label">vacuum: speed c, wavelength λ</Label>
            <Label x={470} y={height - 18} kind="label">{`glass: speed c / ${n}, wavelength λ / ${n}`}</Label>
            <Label x={W / 2} y={24} kind="label">same frequency on both sides</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the spectrum

const BANDS: { name: string; a: number; b: number }[] = [
  { name: 'γ', a: -12, b: -11 },
  { name: 'X-rays', a: -11, b: -8 },
  { name: 'UV', a: -8, b: -6.4 },
  { name: 'vis', a: -6.4, b: -6.15 },
  { name: 'infrared', a: -6.15, b: -3 },
  { name: 'micro', a: -3, b: -1 },
  { name: 'radio', a: -1, b: 3 },
];

export function Spectrum({ height = 250, markers = true }: { height?: number; markers?: boolean }) {
  return (
    <Anim title="The electromagnetic spectrum on a scale of wavelength from gamma rays to radio waves; a cursor sweeps along it and the wave drawn above it stretches out as the wavelength grows" height={height} loop={12}>
      {(t) => {
        const x0 = 24, x1 = 616, y = height * 0.62;
        const lo = -12, hi = 3;
        const px = (l: number) => x0 + ((l - lo) / (hi - lo)) * (x1 - x0);
        const sweep = lo + 0.3 + (hi - lo - 0.6) * (0.5 - 0.5 * Math.cos((TAU * t) / 12));
        const frac = (sweep - lo) / (hi - lo);
        const cyc = 9 - 8 * frac;
        const wx = px(sweep);
        const ampl = 22;
        const f = Math.log10(3e8) - sweep;
        return (
          <g>
            <Line x1={x0} y1={y} x2={x1} y2={y} tone="bright" />
            {BANDS.map((b) => (
              <g key={b.name}>
                <Line x1={px(b.a)} y1={y - 14} x2={px(b.a)} y2={y + 14} tone="soft" />
                {b.name === 'vis' ? (
                  <Label x={px((b.a + b.b) / 2)} y={y + 34} kind="label">light</Label>
                ) : (
                  <Label x={px((b.a + b.b) / 2)} y={y + 34} kind="label">{b.name}</Label>
                )}
              </g>
            ))}
            <Line x1={x1} y1={y - 14} x2={x1} y2={y + 14} tone="soft" />
            <rect x={px(-6.4)} y={y - 8} width={px(-6.15) - px(-6.4)} height={16} fill="#fff" opacity={0.85} />
            {markers &&
              [
                [-9, '0.1 nm'],
                [-6.3, '500 nm'],
                [-2, '1 cm'],
                [2, '100 m'],
              ].map(([l, name]) => (
                <Label key={String(name)} x={px(l as number)} y={y + 58} kind="val">
                  {name as string}
                </Label>
              ))}
            <Trail points={curve(120, 100, (u) => [wx - 50 + u, y - 50 - ampl * Math.sin(TAU * cyc * (u / 100))] as Pt)} />
            <Line x1={wx} y1={y - 28} x2={wx} y2={y} tone="soft" dashed />
            <Ball x={wx} y={y} r={5} />
            <Label x={x0} y={22} kind="val" anchor="start">{`λ = ${(10 ** sweep).toExponential(1).replace('e', ' × 10^')} m`}</Label>
            <Label x={x1} y={22} kind="val" anchor="end">{`f = ${(10 ** f).toExponential(1).replace('e', ' × 10^')} Hz`}</Label>
            <Label x={x0} y={height - 10} kind="label" anchor="start">short wavelength, high frequency</Label>
            <Label x={x1} y={height - 10} kind="label" anchor="end">long wavelength, low frequency</Label>
          </g>
        );
      }}
    </Anim>
  );
}
