import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Ground, Label, Line, Readout, Trail, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for communication systems. Waves scroll to the left so the signal appears to travel. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

const Sub = ({ children }: { children: string }) => (
  <tspan baselineShift="sub" fontSize="0.7em">
    {children}
  </tspan>
);

const Fade = ({ t, a, b = a + 0.6, children }: { t: number; a: number; b?: number; children: ReactNode }) => <g opacity={ease(phase(t, a, b))}>{children}</g>;

/** A repeatable pseudo-random number in [0, 1) from an integer. */
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Sample f(x) for x from x0 to x1, one point per `step` pixels. */
function wave(x0: number, x1: number, f: (x: number) => number, step = 1): Pt[] {
  const out: Pt[] = [];
  for (let x = x0; x <= x1; x += step) out.push([x, f(x)]);
  return out;
}

const BITS = [1, 0, 1, 1, 0, 0, 1, 0];

// ------------------------------------------------------------------ the block diagram

export function SystemBlocks() {
  const names = ['source', 'transmitter', 'channel', 'receiver', 'user'];
  const notes = ['voice', 'modulates', 'air or wire', 'detects', 'speaker'];
  return (
    <Anim title="A message travels from a source through a transmitter, a channel where noise creeps in, and a receiver to the user" height={200} loop={8}>
      {(t) => {
        const p = ease(phase(t, 0.5, 6.5));
        const px = 20 + (W - 40) * p;
        const xs = [66, 193, 320, 447, 574];
        const inChannel = px > 266 && px < 374;
        const wob = px > 374 ? 3 * Math.sin(t * 20) : 0;
        return (
          <g>
            {names.map((n, i) => {
              const inside = Math.abs(px - xs[i]) < 54;
              return (
                <g key={n}>
                  <rect className="kit-block" x={xs[i] - 54} y={76} width={108} height={48} rx={4} />
                  {inside && <rect className="fig-guide" x={xs[i] - 60} y={70} width={120} height={60} rx={6} fill="none" />}
                  <Label x={xs[i]} y={106} kind="label">{n}</Label>
                  <Label x={xs[i]} y={152} kind="label">{notes[i]}</Label>
                  {i < 4 && <Arrow x1={xs[i] + 54} y1={100} x2={xs[i + 1] - 54} y2={100} tone="soft" />}
                </g>
              );
            })}
            <Trail points={wave(272, 368, (x) => 46 + (inChannel ? 9 : 4) * (hash(Math.floor(x / 3) + Math.floor(t * 12) * 97) - 0.5) * 2)} tone="soft" />
            <Label x={320} y={26} kind="label">noise</Label>
            <Ball x={px} y={60 + wob} r={5.5} />
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ analog and digital

export function AnalogDigital() {
  return (
    <Anim title="An analog signal can take any value from moment to moment. A digital signal takes only two values, high and low, that stand for 1 and 0" height={215} loop={6}>
      {(t) => {
        const x0 = 70;
        const x1 = 620;
        const sh = 50 * t;
        const analog = wave(x0, x1, (x) => 78 - 22 * Math.sin(((x + sh) / 110) * TAU) * (0.65 + 0.35 * Math.sin(((x + sh) / 260) * TAU)));
        const bw = 50;
        const hi = 138;
        const lo = 172;
        const level = (x: number) => (BITS[((Math.floor((x - x0 + sh) / bw) % 8) + 8) % 8] ? hi : lo);
        const pts: Pt[] = [];
        let prev = level(x0);
        pts.push([x0, prev]);
        for (let x = x0 + 1; x <= x1; x++) {
          const l = level(x);
          if (l !== prev) pts.push([x, prev]);
          pts.push([x, l]);
          prev = l;
        }
        const first = Math.floor(sh / bw);
        const labels = [];
        for (let k = first; k <= first + 11; k++) {
          const cx = x0 + (k + 0.5) * bw - sh;
          if (cx > x0 + 10 && cx < x1 - 10) labels.push(<Label key={k} x={cx} y={lo + 34} kind="val">{BITS[((k % 8) + 8) % 8]}</Label>);
        }
        return (
          <g>
            <Label x={x0} y={22} kind="label" anchor="start">analog: any value at all</Label>
            <Line x1={x0} y1={78} x2={x1} y2={78} tone="soft" dashed />
            <Trail points={analog} />
            <Label x={x0} y={114} kind="label" anchor="start">digital: only 1 or 0</Label>
            {labels}
            <Trail points={pts} />
            <Line x1={x0} y1={lo + 14} x2={x1} y2={lo + 14} tone="soft" dashed />
            <Label x={x0 - 10} y={hi + 5} kind="val" anchor="end">1</Label>
            <Label x={x0 - 10} y={lo + 5} kind="val" anchor="end">0</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ bandwidth

export function Bandwidths() {
  const rows: [string, number, string][] = [
    ['speech', 2.8e3, '2.8 kHz'],
    ['AM station', 1e4, '10 kHz'],
    ['hi-fi music', 2e4, '20 kHz'],
    ['FM station', 2e5, '200 kHz'],
    ['TV channel', 6e6, '6 MHz'],
  ];
  return (
    <Anim title="Bars on a logarithmic scale compare the bandwidths of speech, an AM station, high fidelity music, an FM station and a television channel, from 2.8 kilohertz to 6 megahertz" height={235} loop={7}>
      {(t) => {
        const ox = 130;
        const wx = 400;
        const X = (f: number) => ox + (wx * (Math.log10(f) - 3)) / 4;
        return (
          <g>
            <Axes x={ox} y={196} w={wx + 40} h={170} xLabel="" />
            {[1e3, 1e4, 1e5, 1e6, 1e7].map((f) => (
              <g key={f}>
                <Line x1={X(f)} y1={196} x2={X(f)} y2={201} tone="soft" />
                <Label x={X(f)} y={217} kind="val">{f >= 1e6 ? `${f / 1e6} MHz` : `${f / 1e3} kHz`}</Label>
              </g>
            ))}
            {rows.map(([name, bw, text], i) => {
              const y = 38 + i * 33;
              const p = ease(phase(t, 0.3 + i * 0.5, 1.3 + i * 0.5));
              const x2 = lerp(ox, X(bw), p);
              return (
                <g key={name}>
                  <Label x={ox - 12} y={y + 5} kind="label" anchor="end">{name}</Label>
                  <rect className="kit-block is-filled" x={ox} y={y - 9} width={Math.max(0, x2 - ox)} height={18} rx={2} />
                  <Fade t={t} a={1.1 + i * 0.5}>
                    <Label x={X(bw) + 8} y={y + 5} kind="val" anchor="start">{text}</Label>
                  </Fade>
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ antenna size

export function AntennaSize() {
  const items = [
    { name: '3 kHz', len: '25 km', h: 78 },
    { name: '1 MHz', len: '75 m', h: 42 },
    { name: '100 MHz', len: '0.75 m', h: 13 },
  ];
  return (
    <Anim title="Quarter-wave antennas for a 3 kilohertz speech signal, a 1 megahertz radio carrier and a 100 megahertz FM carrier: the higher the frequency, the shorter the antenna. The drawing is not to scale" height={250} loop={5}>
      {(t) => (
        <g>
          {items.map((it, i) => {
            const cx = 110 + i * 210;
            const gy = 172;
            const lam = 4 * it.h;
            const r0 = (24 * t) % lam;
            const rings = [];
            for (let k = 0; r0 + k * lam < 60; k++) {
              const r = r0 + k * lam;
              if (r > 3) rings.push(<path key={k} className="fig-guide" d={`M${cx - r} ${gy - it.h}A${r} ${r} 0 0 1 ${cx + r} ${gy - it.h}`} fill="none" opacity={1 - r / 62} />);
            }
            return (
              <g key={it.name}>
                <Ground y={gy} x1={cx - 100} x2={cx + 100} />
                {rings}
                <Line x1={cx} y1={gy} x2={cx} y2={gy - it.h} tone="bright" />
                <Ball x={cx} y={gy - it.h} r={3.5} glow={false} />
                <Label x={cx} y={gy + 36} kind="val">{it.name}</Label>
                <Label x={cx} y={gy + 58} kind="label">antenna {it.len}</Label>
              </g>
            );
          })}
          <Label x={W / 2} y={22} kind="label">length of antenna = a quarter of the wavelength (not to scale)</Label>
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ AM

export function AMWave({ mu = 0.6, height = 270, title }: { mu?: number; height?: number; title?: string }) {
  return (
    <Anim title={title ?? `A message wave, a carrier wave, and the amplitude modulated wave whose envelope follows the message (modulation index ${mu})`} height={height} loop={8}>
      {(t) => {
        const x0 = 84;
        const x1 = 622;
        const pps = 100;
        const fm = 0.6;
        const fc = 6;
        const u = (x: number) => (x - x0) / pps + t * 0.9;
        const msg = (x: number) => Math.sin(TAU * fm * u(x));
        const env = (x: number) => 1 + mu * msg(x);
        const r1 = 44;
        const r2 = 128;
        const r3 = 214;
        const A = 30;
        const over = mu > 1;
        return (
          <g>
            <Label x={8} y={r1 + 6} kind="label" anchor="start">message</Label>
            <Trail points={wave(x0, x1, (x) => r1 - A * msg(x))} />
            <Label x={8} y={r2 + 6} kind="label" anchor="start">carrier</Label>
            <Trail points={wave(x0, x1, (x) => r2 - A * Math.sin(TAU * fc * u(x)))} tone="soft" />
            <Label x={8} y={r3 + 6} kind="label" anchor="start">{over ? 'over-modulated' : 'AM wave'}</Label>
            <Trail points={wave(x0, x1, (x) => r3 - (A / (1 + Math.min(mu, 1))) * 1.0 * env(x) * Math.sin(TAU * fc * u(x)), 0.5)} />
            <Trail points={wave(x0, x1, (x) => r3 - (A / (1 + Math.min(mu, 1))) * Math.abs(env(x)), 2)} tone="soft" dashed />
            <Trail points={wave(x0, x1, (x) => r3 + (A / (1 + Math.min(mu, 1))) * Math.abs(env(x)), 2)} tone="soft" dashed />
            <Readout y={height - 6}>μ = {mu}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function AMSpectrum({ height = 272 }: { height?: number }) {
  return (
    <Anim title="The spectrum of an AM wave: a tall line at the carrier frequency and two shorter sideband lines, one above and one below, set apart by the message frequency. The sidebands grow as the modulation index grows, and the total width is twice the message frequency" height={height} loop={8}>
      {(t) => {
        const cx = 320;
        const base = 190;
        const d = 95 + 28 * Math.sin((TAU * t) / 8);
        const mu = 0.55 + 0.45 * Math.sin((TAU * t) / 4);
        const H = 130;
        const line = (x: number, h: number) => (
          <g>
            <Line x1={x} y1={base} x2={x} y2={base - h} tone="bright" />
            <Ball x={x} y={base - h} r={3.5} glow={false} />
          </g>
        );
        return (
          <g>
            <Axes x={60} y={base} w={540} h={150} />
            {line(cx, H)}
            {line(cx - d, (H * mu) / 2)}
            {line(cx + d, (H * mu) / 2)}
            <Label x={cx} y={base + 24} kind="sym">f<Sub>c</Sub></Label>
            <Label x={cx - d} y={base + 24} kind="sym">f<Sub>c</Sub> − f<Sub>m</Sub></Label>
            <Label x={cx + d} y={base + 24} kind="sym">f<Sub>c</Sub> + f<Sub>m</Sub></Label>
            <Arrow x1={cx} y1={base + 40} x2={cx + d} y2={base + 40} tone="soft" />
            <Arrow x1={cx} y1={base + 40} x2={cx - d} y2={base + 40} tone="soft" />
            <Label x={cx} y={base + 66} kind="label">bandwidth = 2 f<Sub>m</Sub></Label>
            <Label x={16} y={26} kind="val" anchor="start">μ = {mu.toFixed(2)}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ FM

export function FMWave({ height = 215 }: { height?: number }) {
  return (
    <Anim title="A message wave and the frequency modulated wave: where the message is high the wave bunches up into a higher frequency, where it is low the wave spreads out, and the height of the wave stays the same" height={height} loop={8}>
      {(t) => {
        const x0 = 84;
        const x1 = 622;
        const pps = 100;
        const fm = 0.6;
        const fc = 5;
        const bf = 4;
        const u = (x: number) => (x - x0) / pps + t * 0.9;
        const A = 30;
        return (
          <g>
            <Label x={8} y={50} kind="label" anchor="start">message</Label>
            <Trail points={wave(x0, x1, (x) => 44 - A * Math.sin(TAU * fm * u(x)))} />
            <Label x={8} y={156} kind="label" anchor="start">FM wave</Label>
            <Trail points={wave(x0, x1, (x) => 150 - A * Math.sin(TAU * fc * u(x) - bf * Math.cos(TAU * fm * u(x))), 0.5)} />
            <Line x1={x0} y1={150 - A} x2={x1} y2={150 - A} tone="soft" dashed />
            <Line x1={x0} y1={150 + A} x2={x1} y2={150 + A} tone="soft" dashed />
            <Label x={W - 14} y={height - 10} kind="label" anchor="end">constant height, changing spacing</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function NoiseCompare() {
  return (
    <Anim title="Noise adds sharp spikes to a signal. In an AM wave the spikes change the height of the wave, which carries the message, so they are heard as crackle. In an FM wave the message is in the spacing of the wave, so the spikes can be clipped off without harm" height={256} loop={8}>
      {(t) => {
        const x0 = 20;
        const x1 = 620;
        const pps = 100;
        const u = (x: number) => (x - x0) / pps + t * 0.9;
        const spike = (x: number) => {
          const k = Math.floor(u(x) * 6);
          return hash(k) > 0.8 ? (hash(k + 50) - 0.5) * 2 : 0;
        };
        const A = 26;
        const yA = 62;
        const yF = 206;
        const amp = (x: number) => (1 + 0.5 * Math.sin(TAU * 0.6 * u(x))) * 0.7;
        return (
          <g>
            <Label x={x0} y={22} kind="label" anchor="start">AM with noise: the spikes spoil the message</Label>
            <Trail points={wave(x0, x1, (x) => yA - A * (amp(x) * Math.sin(TAU * 6 * u(x)) + spike(x)), 0.5)} />
            <Label x={x0} y={150} kind="label" anchor="start">FM with noise: spikes clipped off</Label>
            <Trail points={wave(x0, x1, (x) => yF - A * Math.max(-1, Math.min(1, Math.sin(TAU * 5 * u(x) - 4 * Math.cos(TAU * 0.6 * u(x))) + spike(x))), 0.5)} />
            <Line x1={x0} y1={yF - A} x2={x1} y2={yF - A} tone="soft" dashed />
            <Line x1={x0} y1={yF + A} x2={x1} y2={yF + A} tone="soft" dashed />
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ propagation

const R = 700;
const CX = 320;
const CY = 950;
const gy = (x: number) => CY - Math.sqrt(R * R - (x - CX) ** 2);
const ion = (x: number) => CY - Math.sqrt((R + 105) ** 2 - (x - CX) ** 2);
const arcPts = (f: (x: number) => number): Pt[] => wave(0, W, (x) => f(x), 4);

function Tower({ x, h = 30, y = gy(x), pulse }: { x: number; h?: number; y?: number; pulse?: number }) {
  return (
    <g>
      <Line x1={x} y1={y} x2={x} y2={y - h} tone="bright" />
      <Line x1={x - 5} y1={y - h} x2={x + 5} y2={y - h} tone="bright" />
      {pulse !== undefined && pulse > 0 && pulse < 1 && <circle className="fig-guide" cx={x} cy={y - h} r={5 + 18 * pulse} fill="none" opacity={1 - pulse} />}
    </g>
  );
}

export function Propagation() {
  return (
    <Anim title="A ground wave follows the curve of the Earth but fades; a sky wave goes up to the ionosphere and is reflected back down far beyond the horizon" height={330} loop={7}>
      {(t) => {
        const ax = 60;
        const ay = gy(ax) - 30;
        const pts: Pt[] = [[ax, ay], [250, ion(250) + 2], [440, gy(440)]];
        const seg1 = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]);
        const seg2 = Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]);
        const s = phase(t, 0.5, 4.5) * (seg1 + seg2);
        const sky: Pt = s < seg1 ? [lerp(pts[0][0], pts[1][0], s / seg1), lerp(pts[0][1], pts[1][1], s / seg1)] : [lerp(pts[1][0], pts[2][0], (s - seg1) / seg2), lerp(pts[1][1], pts[2][1], (s - seg1) / seg2)];
        const gp = phase(t, 0.5, 4.5);
        const gx = ax + (300 - ax) * gp;
        return (
          <g>
            <Trail points={arcPts(gy)} />
            <Trail points={arcPts(ion)} tone="soft" dashed />
            <Label x={320} y={ion(320) - 10} kind="label">ionosphere</Label>
            <Tower x={ax} pulse={((t * 1.4) % 1)} />
            <Tower x={440} h={20} />
            <Trail points={pts} tone="soft" dashed />
            <Ball x={sky[0]} y={sky[1]} r={5} />
            <Fade t={t} a={2.8}>
              <Label x={330} y={236} kind="label">sky wave</Label>
            </Fade>
            <g opacity={1 - phase(t, 3, 4.6)}>
              <Ball x={gx} y={gy(gx) - 4} r={5} />
            </g>
            <Label x={210} y={gy(210) + 34} kind="label">ground wave: fades</Label>
            <Label x={560} y={gy(560) + 34} kind="label">no signal</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** The point on the Earth's surface where a straight line from (px, py) just touches it. */
function tangent(px: number, py: number): Pt {
  let lo = px + 1;
  let hi = CX;
  const f = (x: number) => {
    const y = gy(x);
    return (px - x) * (x - CX) + (py - y) * (y - CY);
  };
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (f(lo) * f(mid) <= 0) hi = mid;
    else lo = mid;
  }
  const x = (lo + hi) / 2;
  return [x, gy(x)];
}

export function SpaceWave() {
  return (
    <Anim title="A space wave travels in a straight line, so it reaches only as far as the horizon from the transmitting tower. A receiver beyond the horizon gets nothing directly, but a satellite high above can relay the signal to it" height={320} loop={8}>
      {(t) => {
        const ax = 60;
        const ah = 52;
        const ay = gy(ax) - ah;
        const [tx, ty] = tangent(ax, ay);
        const bx = 530;
        const by = gy(bx) - 18;
        const sat: Pt = [330, 40];
        const p1 = phase(t, 0.5, 2.5);
        const q = phase(t, 3.5, 5.5);
        const q2 = phase(t, 5.5, 7.5);
        return (
          <g>
            <Trail points={arcPts(gy)} />
            <Tower x={ax} h={ah} pulse={(t * 1.2) % 1} />
            <Tower x={bx} h={18} />
            <Line x1={ax} y1={ay} x2={tx} y2={ty} tone="soft" dashed />
            <Ball x={lerp(ax, tx, p1)} y={lerp(ay, ty, p1)} r={5} />
            <Fade t={t} a={2.5}>
              <Label x={tx - 40} y={ty + 40} kind="label">horizon</Label>
              <Line x1={tx} y1={ty + 4} x2={tx} y2={ty + 12} tone="soft" />
            </Fade>
            <Line x1={tx} y1={ty} x2={tx + (150 * (tx - ax)) / Math.hypot(tx - ax, ty - ay)} y2={ty + (150 * (ty - ay)) / Math.hypot(tx - ax, ty - ay)} tone="soft" dashed />
            <Ball x={sat[0]} y={sat[1]} r={7 + 1.2 * Math.sin(t * 5)} />
            <Label x={sat[0]} y={sat[1] - 16} kind="label">satellite</Label>
            <Line x1={ax} y1={ay} x2={sat[0]} y2={sat[1]} tone="soft" dashed />
            <Line x1={sat[0]} y1={sat[1]} x2={bx} y2={by} tone="soft" dashed />
            {q > 0 && q < 1 && <Ball x={lerp(ax, sat[0], q)} y={lerp(ay, sat[1], q)} r={5} />}
            {q2 > 0 && q2 < 1 && <Ball x={lerp(sat[0], bx, q2)} y={lerp(sat[1], by, q2)} r={5} />}
            <Label x={bx - 24} y={gy(bx) + 34} kind="label">beyond the horizon</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ sampling and bits

export function Sampling({ fs = 8, height = 205, caption }: { fs?: number; height?: number; caption?: string }) {
  return (
    <Anim title={`A one hertz sine wave sampled ${fs} times a second: the dots joined by lines ${fs >= 2 ? 'follow the wave' : 'make a different, slower wave'}`} height={height} loop={8}>
      {(t) => {
        const x0 = 40;
        const x1 = 610;
        const y0 = height / 2 - 6;
        const A = 56;
        const pps = 100;
        const f = (x: number) => y0 - A * Math.sin(TAU * ((x - x0) / pps) * 1);
        const sweep = x0 + (x1 - x0) * ease(phase(t, 0.5, 6.5));
        const pts: Pt[] = [];
        for (let k = 0; x0 + (k * pps) / fs <= sweep; k++) {
          const x = x0 + (k * pps) / fs;
          pts.push([x, f(x)]);
        }
        return (
          <g>
            <Line x1={x0} y1={y0} x2={x1} y2={y0} tone="soft" />
            <Trail points={wave(x0, x1, f)} tone="soft" dashed />
            {pts.map(([x, y], i) => (
              <g key={i}>
                <Line x1={x} y1={y0} x2={x} y2={y} tone="soft" />
                <Ball x={x} y={y} r={3.5} glow={false} />
              </g>
            ))}
            <Trail points={pts} />
            <Line x1={sweep} y1={y0 - A - 10} x2={sweep} y2={y0 + A + 10} tone="soft" dashed />
            <Label x={x1} y={height - 8} kind="label" anchor="end">{caption ?? `${fs} samples per second for a 1 Hz wave`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Quantise() {
  return (
    <Anim title="Analog to digital conversion: a sine wave is sampled, each sample is rounded to the nearest of eight levels, and the level number is written as three bits" height={250} loop={8}>
      {(t) => {
        const x0 = 50;
        const x1 = 400;
        const top = 30;
        const bot = 190;
        const step = (bot - top) / 8;
        const wv = (x: number) => (top + bot) / 2 - ((bot - top) / 2) * 0.96 * Math.sin(TAU * ((x - x0) / 175));
        const sx = x0 + (x1 - x0) * phase(t, 0.3, 7.3);
        const val = (bot + top) / 2 - wv(sx);
        const v = val / ((bot - top) / 2 * 0.96);
        const level = Math.max(0, Math.min(7, Math.floor(((v + 1) / 2) * 8)));
        const bits = level.toString(2).padStart(3, '0');
        const yLevel = bot - (level + 0.5) * step;
        const grid = [];
        for (let k = 0; k <= 8; k++) grid.push(<Line key={k} x1={x0} y1={bot - k * step} x2={x1} y2={bot - k * step} tone="soft" dashed />);
        const lab = [];
        for (let k = 0; k < 8; k++) lab.push(<Label key={k} x={x0 - 8} y={bot - (k + 0.5) * step + 5} kind="val" anchor="end">{k}</Label>);
        const bx = 470;
        return (
          <g>
            {grid}
            {lab}
            <Trail points={wave(x0, x1, wv)} tone="soft" />
            <Line x1={sx} y1={wv(sx)} x2={sx} y2={yLevel} tone="soft" />
            <Ball x={sx} y={wv(sx)} r={4.5} />
            <Line x1={sx} y1={yLevel} x2={bx - 20} y2={yLevel} tone="soft" dashed />
            <Ball x={sx} y={yLevel} r={4.5} ghost />
            <Label x={bx + 60} y={42} kind="label">level {level}</Label>
            {[0, 1, 2].map((i) => {
              const bit = Number(bits[i]);
              const x = bx + i * 50;
              return (
                <g key={i}>
                  <Line x1={x} y1={bit ? 90 : 124} x2={x + 50} y2={bit ? 90 : 124} tone="bright" />
                  <Line x1={x} y1={90} x2={x} y2={124} tone="soft" dashed />
                  <Label x={x + 25} y={82} kind="val">{bit}</Label>
                </g>
              );
            })}
            <Label x={bx + 75} y={160} kind="val">{bits}</Label>
            <Label x={bx + 75} y={190} kind="label">3 bits: 8 levels</Label>
            <Label x={x0} y={226} kind="label" anchor="start">sample the wave, round to a level, send the number</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ noise and repeaters

export function Regeneration() {
  return (
    <Anim title="An analog signal and a digital signal each travel along a long cable, where noise is added, and then pass through a repeater. The analog repeater can only amplify the noisy signal, but the digital repeater recovers the original ones and zeros exactly" height={260} loop={8}>
      {(t) => {
        const pw = 170;
        const gap = 30;
        const xs = [16, 16 + pw + gap, 16 + 2 * (pw + gap)];
        const sh = 30 * t;
        const frame = Math.floor(t * 10);
        const noise = (x: number, amt: number) => amt * (hash(Math.floor(x / 3) + frame * 131) - 0.5) * 2;
        const analog = (x: number) => Math.sin(((x + sh) / 90) * TAU);
        const digital = (x: number) => (BITS[((Math.floor((x + sh) / 28) % 8) + 8) % 8] ? 1 : -1);
        const rows = [64, 192];
        const A = 24;
        const panel = (row: number, k: number, kind: 'a' | 'd') => {
          const base = kind === 'a' ? analog : digital;
          const noisy = k === 0 ? 0 : 0.5;
          const f = (x: number) => {
            const raw = base(x) + noise(x, noisy);
            if (k === 2) return kind === 'd' ? (raw > 0 ? 1 : -1) : raw * 1.6;
            return raw;
          };
          const pts = wave(xs[k], xs[k] + pw, (x) => rows[row] - A * Math.max(-1.45, Math.min(1.45, f(x - xs[k]))), kind === 'd' ? 2 : 1.5);
          return <Trail key={`${row}${k}`} points={pts} />;
        };
        const heads = ['sent', 'after the cable', 'after the repeater'];
        return (
          <g>
            {heads.map((h, k) => (
              <Label key={h} x={xs[k] + pw / 2} y={22} kind="label">{h}</Label>
            ))}
            {[0, 1, 2].map((k) => (
              <g key={k}>
                {panel(0, k, 'a')}
                {panel(1, k, 'd')}
              </g>
            ))}
            {[0, 1].map((r) => (
              <g key={r}>
                <Arrow x1={xs[0] + pw + 4} y1={rows[r]} x2={xs[1] - 4} y2={rows[r]} tone="soft" />
                <Arrow x1={xs[1] + pw + 4} y1={rows[r]} x2={xs[2] - 4} y2={rows[r]} tone="soft" />
              </g>
            ))}
            <Label x={xs[2] + pw / 2} y={rows[0] + 58} kind="label">noise stays, and grows</Label>
            <Label x={xs[2] + pw / 2} y={rows[1] + 58} kind="label">clean again</Label>
            <Label x={xs[0]} y={rows[0] + 58} kind="label" anchor="start">analog</Label>
            <Label x={xs[0]} y={rows[1] + 58} kind="label" anchor="start">digital</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the receiver

export function Detector() {
  return (
    <Anim title="An AM detector: the received wave is passed through a diode, which keeps only the upper half of each cycle, and then a capacitor smooths away the carrier, leaving the envelope, which is the message" height={265} loop={8}>
      {(t) => {
        const x0 = 100;
        const x1 = 622;
        const pps = 100;
        const mu = 0.6;
        const u = (x: number) => (x - x0) / pps + t * 0.9;
        const env = (x: number) => 1 + mu * Math.sin(TAU * 0.6 * u(x));
        const car = (x: number) => Math.sin(TAU * 7 * u(x));
        const A = 20;
        const r = [44, 130, 218];
        return (
          <g>
            <Label x={8} y={r[0] - 6} kind="label" anchor="start">received</Label>
            <Label x={8} y={r[0] + 14} kind="label" anchor="start">AM wave</Label>
            <Trail points={wave(x0, x1, (x) => r[0] - A * env(x) * car(x), 0.5)} />
            <Label x={8} y={r[1] - 6} kind="label" anchor="start">after the</Label>
            <Label x={8} y={r[1] + 14} kind="label" anchor="start">diode</Label>
            <Trail points={wave(x0, x1, (x) => r[1] + A * 0.9 - A * 1.2 * Math.max(0, env(x) * car(x)), 0.5)} />
            <Label x={8} y={r[2] - 6} kind="label" anchor="start">after the</Label>
            <Label x={8} y={r[2] + 14} kind="label" anchor="start">capacitor</Label>
            <Trail points={wave(x0, x1, (x) => r[2] + A * 0.9 - A * 1.2 * 0.64 * env(x))} />
            <Line x1={x0} y1={r[2] + A * 0.9} x2={x1} y2={r[2] + A * 0.9} tone="soft" dashed />
            <Fade t={t} a={1}>
              <Arrow x1={x0 - 40} y1={r[0] + 24} x2={x0 - 40} y2={r[1] - 26} tone="soft" />
              <Arrow x1={x0 - 40} y1={r[1] + 24} x2={x0 - 40} y2={r[2] - 26} tone="soft" />
            </Fade>
          </g>
        );
      }}
    </Anim>
  );
}

export function Tuning() {
  return (
    <Anim title="A tuned circuit responds strongly only near its resonant frequency. Turning the capacitor moves the peak along the frequency axis, and a station is heard when the peak sits on its frequency" height={250} loop={10}>
      {(t) => {
        const ox = 50;
        const oy = 190;
        const wx = 540;
        const fmin = 500;
        const fmax = 1600;
        const X = (f: number) => ox + (wx * (f - fmin)) / (fmax - fmin);
        const f0 = 1050 + 450 * Math.sin((TAU * t) / 10) * 1;
        const clamped = Math.max(600, Math.min(1500, f0));
        const stations: [string, number][] = [['A', 700], ['B', 1000], ['C', 1300]];
        const resp = (f: number) => 1 / (1 + ((f - clamped) / 60) ** 2);
        const H = 130;
        return (
          <g>
            <Axes x={ox} y={oy} w={wx + 20} h={150} />
            <Label x={ox + wx + 28} y={oy + 6} kind="sym" anchor="start">f</Label>
            <Trail points={wave(ox, ox + wx, (x) => oy - H * resp(fmin + ((x - ox) / wx) * (fmax - fmin)), 2)} />
            {stations.map(([n, f]) => {
              const r = resp(f);
              return (
                <g key={n}>
                  <Line x1={X(f)} y1={oy} x2={X(f)} y2={oy - 50} tone="soft" dashed />
                  <Line x1={X(f)} y1={oy} x2={X(f)} y2={oy - 50 * r} tone="bright" />
                  <Ball x={X(f)} y={oy - 50} r={3} glow={false} />
                  <Label x={X(f)} y={oy + 24} kind="val">{n}</Label>
                  <Label x={X(f)} y={oy + 42} kind="val">{f} kHz</Label>
                </g>
              );
            })}
            <Ball x={X(clamped)} y={oy - H} r={4.5} />
            <Label x={16} y={26} kind="val" anchor="start">tuned to {clamped.toFixed(0)} kHz</Label>
          </g>
        );
      }}
    </Anim>
  );
}
