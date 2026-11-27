import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Block, Ground, Label, Line, Readout, Trail, Wall, clamp, ease, lerp, phase } from '../kit/Anim';

/** Animated diagrams for the heat chapter. Positions are worked out from the real physics. */

/** A small, repeatable wobble for a particle: bigger amplitude means hotter. */
const jig = (i: number, t: number, a: number): [number, number] => [a * Math.sin(t * 9 + i * 1.9), a * Math.cos(t * 11 + i * 2.7)];
/** 0 → 1 → 0 across a loop, with rests at both ends. */
const there = (t: number, loop: number) => phase(t, loop * 0.06, loop * 0.46) - phase(t, loop * 0.54, loop * 0.94);
const fade = (p: number): { opacity: number } => ({ opacity: clamp(p) });
const f1 = (x: number) => x.toFixed(1);

/** Wavy rising lines for flame or steam. */
function Wisps({ x, y, n, t, h = 26, spread = 26, level = 1 }: { x: number; y: number; n: number; t: number; h?: number; spread?: number; level?: number }) {
  return (
    <g style={fade(level)}>
      {Array.from({ length: n }, (_, i) => {
        const x0 = x + (n === 1 ? 0 : (i / (n - 1) - 0.5) * spread * 2);
        const pts: [number, number][] = [];
        for (let k = 0; k <= 10; k++) pts.push([x0 + 4 * Math.sin(k * 0.9 + t * 4 + i * 2), y - (k / 10) * h]);
        return <Trail key={i} points={pts} tone="soft" />;
      })}
    </g>
  );
}

/** A beaker outline from x1 to x2, base at y, open top at yTop, with liquid of height h. */
function Beaker({ x1, x2, y, yTop, h, tone = 0.12 }: { x1: number; x2: number; y: number; yTop: number; h: number; tone?: number }) {
  return (
    <g>
      {h > 0.5 && <rect x={x1 + 1} y={y - h} width={x2 - x1 - 2} height={h} style={{ fill: `rgba(255,255,255,${tone})` }} />}
      {h > 0.5 && <line className="fig-guide" x1={x1 + 1} x2={x2 - 1} y1={y - h} y2={y - h} />}
      <path className="fig-bar" d={`M${x1} ${yTop}L${x1} ${y}L${x2} ${y}L${x2} ${yTop}`} />
    </g>
  );
}

// ------------------------------------------------------------------ 1. heat versus temperature

export function HeatFlow() {
  return (
    <Anim title="Two blocks touch: heat flows from the hot block to the cold one until their temperatures match" height={230} loop={10}>
      {(t) => {
        const e = ease(phase(t, 1, 7));
        const th = lerp(80, 50, e);
        const tc = lerp(20, 50, e);
        const box = (x0: number, T: number, tag: string, seed: number) => (
          <g>
            <rect className="kit-block" x={x0} y={60} width={200} height={110} rx={4} />
            {Array.from({ length: 20 }, (_, i) => {
              const [dx, dy] = jig(i + seed, t, 0.6 + (T / 80) * 6);
              return <circle key={i} className="fig-ball" cx={x0 + 28 + (i % 5) * 36 + dx} cy={82 + Math.floor(i / 5) * 26 + dy} r={3.2} />;
            })}
            <Label x={x0 + 100} y={46} kind="label">{tag}</Label>
            <Label x={x0 + 100} y={198} kind="val">{`${T.toFixed(0)} °C`}</Label>
          </g>
        );
        return (
          <g>
            {box(60, th, 'hot', 0)}
            {box(380, tc, 'cold', 7)}
            <g style={fade((th - tc) / 25)}>
              <Arrow x1={276} y1={115} x2={364} y2={115} />
              <Label x={320} y={100} kind="label">heat</Label>
            </g>
            {t > 7.2 && <Label x={320} y={152} kind="label">same temperature</Label>}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 2. temperature scales

export function Thermometer() {
  return (
    <Anim title="One thermometer, the same temperature read in Celsius, Fahrenheit and kelvin" height={260} loop={10}>
      {(t) => {
        const T = 100 * ease(there(t, 10));
        const y = 205 - T * 1.45;
        const row = (name: string, v: string, x: number) => <Label x={x} y={y + 5} kind="val" anchor="start">{`${v} ${name}`}</Label>;
        return (
          <g>
            <rect className="fig-bar" x={312} y={40} width={16} height={176} rx={8} />
            <line className="fig-path" x1={320} x2={320} y1={222} y2={y} style={{ strokeWidth: 6 }} />
            <circle className="fig-ball" cx={320} cy={226} r={15} />
            <Line x1={300} x2={312} y1={205} y2={205} tone="bright" />
            <Line x1={300} x2={312} y1={60} y2={60} tone="bright" />
            <Label x={30} y={44} kind="label" anchor="start">water boils</Label>
            <Label x={30} y={189} kind="label" anchor="start">ice melts</Label>
            <Line x1={332} x2={346} y1={y} y2={y} tone="bright" />
            {row('°C', f1(T), 352)}
            {row('°F', f1(T * 1.8 + 32), 440)}
            {row('K', (T + 273.15).toFixed(1), 530)}
            <Label x={30} y={64} kind="val" anchor="start">100 °C · 212 °F · 373 K</Label>
            <Label x={30} y={209} kind="val" anchor="start">0 °C · 32 °F · 273 K</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 3. expansion

export function RodExpands({ ghost = true }: { ghost?: boolean }) {
  return (
    <Anim title="A metal rod is heated and lengthens; the stretch is exaggerated" height={210} loop={9}>
      {(t) => {
        const p = ease(phase(t, 0.8, 6));
        const dl = 56 * p;
        return (
          <g>
            <Wall x={80} y1={78} y2={134} side={-1} />
            <rect className="kit-block" x={80} y={88} width={300 + dl} height={34} style={{ fill: `rgba(255,255,255,${0.07 + 0.4 * p})` }} />
            {ghost && <Line x1={380} x2={380} y1={70} y2={140} dashed />}
            <Label x={230} y={78} kind="sym">L₀</Label>
            <Label x={380 + dl / 2} y={58} kind="sym">ΔL</Label>
            <Arrow x1={380} y1={66} x2={380 + dl} y2={66} />
            <Wisps x={230} y={170} n={5} t={t} h={30} spread={60} level={phase(t, 0.3, 1) - phase(t, 6, 6.8)} />
            <Label x={320} y={200} kind="label">ΔL = α · L₀ · ΔT   (stretch exaggerated)</Label>
            <Readout>{`T = ${(20 + 200 * p).toFixed(0)} °C`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function PlateExpands() {
  return (
    <Anim title="A plate with a hole is heated: the plate and the hole both grow" height={220} loop={9}>
      {(t) => {
        const p = ease(phase(t, 0.8, 6));
        const k = 1 + 0.2 * p;
        const s = 120 * k;
        const r = 24 * k;
        const cx = 320;
        const cy = 112;
        const d = `M${cx - s / 2} ${cy - s / 2}h${s}v${s}h${-s}zM${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
        return (
          <g>
            <path className="fig-cliff" d={d} style={{ fillRule: 'evenodd' }} />
            <rect className="fig-guide fig-dash" x={cx - 60} y={cy - 60} width={120} height={120} />
            <Label x={160} y={96} kind="label">plate grows:</Label>
            <Label x={160} y={122} kind="sym">ΔA = 2 · α · A₀ · ΔT</Label>
            <Label x={480} y={96} kind="label">the hole grows</Label>
            <Label x={480} y={122} kind="label">just as much</Label>
            <Label x={320} y={206} kind="val">{`hotter by ${(200 * p).toFixed(0)} K`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 4. expansion at work

export function Bimetal() {
  return (
    <Anim title="A strip of brass and steel bends as it is heated, because brass expands more" height={250} loop={9}>
      {(t) => {
        const p = ease(phase(t, 0.8, 6.5));
        const kap = 0.0034 * p;
        const top: [number, number][] = [];
        const bot: [number, number][] = [];
        let x = 150;
        let y = 90;
        for (let s = 0; s <= 260; s += 10) {
          const a = kap * s;
          top.push([x + 5 * Math.sin(a), y - 5 * Math.cos(a)]);
          bot.push([x - 5 * Math.sin(a), y + 5 * Math.cos(a)]);
          x += 10 * Math.cos(kap * (s + 5));
          y += 10 * Math.sin(kap * (s + 5));
        }
        const poly = [...top, ...bot.slice().reverse()].map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join('L');
        return (
          <g>
            <Block x={134} y={90} w={30} h={60} filled />
            <path className="fig-cliff" d={`M${poly}Z`} />
            <Trail points={top} />
            <Trail points={bot} tone="soft" />
            <Label x={330} y={36} kind="label" anchor="start">top: brass, expands more</Label>
            <Label x={330} y={62} kind="label" anchor="start">bottom: steel, expands less</Label>
            <Readout>{`T = ${(20 + 100 * p).toFixed(0)} °C`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

const rho = (T: number) => 999.973 - 0.0073 * (T - 3.98) ** 2;

export function WaterDensity() {
  const X = (T: number) => 90 + T * 46;
  const Y = (r: number) => 200 - (r - 999.7) * 480;
  const all: [number, number][] = Array.from({ length: 51 }, (_, i) => [X(i / 5), Y(rho(i / 5))]);
  return (
    <Anim title="Water's density against temperature: it is greatest at 4 degrees Celsius" height={250} loop={10}>
      {(t) => {
        const T = 10 * ease(there(t, 10));
        const part: [number, number][] = all.filter((_, i) => i / 5 <= T).concat([[X(T), Y(rho(T))]]);
        return (
          <g>
            <Axes x={90} y={200} w={480} h={150} xLabel="T" yLabel="ρ" />
            <Trail points={all} tone="faint" />
            <Trail points={part} />
            <Line x1={X(4)} x2={X(4)} y1={Y(rho(4))} y2={200} dashed tone="faint" />
            <Label x={X(4)} y={44} kind="label">densest at 4 °C</Label>
            {[0, 4, 10].map((v) => (
              <Label key={v} x={X(v)} y={222} kind="val">{`${v} °C`}</Label>
            ))}
            <Ball x={X(T)} y={Y(rho(T))} />
            <Label x={X(T) + 14} y={Y(rho(T)) - 12} kind="val" anchor="start">{T < 3.9 ? 'cooler: lighter' : T > 4.1 ? 'warmer: lighter' : ''}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 5. specific heat

export function SpecificHeat() {
  return (
    <Anim title="The same heat warms 1 kg of copper far more than 1 kg of water" height={270} loop={10}>
      {(t) => {
        const Q = 20000 * phase(t, 0.6, 7);
        const bar = (cx: number, dT: number, name: string, c: string) => (
          <g>
            <rect className="fig-cliff" x={cx - 32} y={216 - dT * 3} width={64} height={dT * 3} />
            <Label x={cx} y={216 - dT * 3 - 8} kind="val">{`ΔT = ${dT.toFixed(1)} K`}</Label>
            <Label x={cx} y={240} kind="label">{name}</Label>
            <Label x={cx} y={260} kind="val">{c}</Label>
          </g>
        );
        return (
          <g>
            <Ground y={216} x1={100} x2={540} hatch={false} />
            {bar(210, Q / 4186, '1 kg of water', 'c = 4186 J/(kg·K)')}
            {bar(430, Q / 385, '1 kg of copper', 'c = 385 J/(kg·K)')}
            <Label x={320} y={26} kind="val">{`same heat Q = ${(Q / 1000).toFixed(1)} kJ into each`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 6. calorimetry

export function MixBeakers() {
  return (
    <Anim title="Hot and cold water are poured together and settle at a temperature in between" height={250} loop={9}>
      {(t) => {
        const p = ease(phase(t, 2.5, 5));
        const settled = phase(t, 5, 6);
        return (
          <g>
            <Beaker x1={40} x2={160} y={210} yTop={50} h={64 * (1 - p)} />
            <Beaker x1={200} x2={320} y={210} yTop={50} h={96 * (1 - p)} />
            <Beaker x1={440} x2={600} y={210} yTop={50} h={160 * p} tone={0.2} />
            <Label x={100} y={34} kind="val">200 g · 80 °C</Label>
            <Label x={260} y={34} kind="val">300 g · 20 °C</Label>
            <g style={fade(settled)}>
              <Label x={520} y={34} kind="val">500 g · 44 °C</Label>
            </g>
            <g style={fade(phase(t, 2.2, 2.8))}>
              <Arrow x1={340} y1={110} x2={425} y2={110} />
              <Label x={382} y={96} kind="label">mix</Label>
            </g>
            <Label x={100} y={232} kind="label">hot</Label>
            <Label x={260} y={232} kind="label">cold</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 7. latent heat

const SEG = [
  { q: 42, T0: -20, T1: 0, w: 0.12, name: 'ice warms up' },
  { q: 334, T0: 0, T1: 0, w: 0.2, name: 'ice melts: L_f' },
  { q: 418.6, T0: 0, T1: 100, w: 0.22, name: 'water warms up' },
  { q: 2260, T0: 100, T1: 100, w: 0.34, name: 'water boils: L_v' },
  { q: 40.2, T0: 100, T1: 120, w: 0.12, name: 'steam warms up' },
];
const QTOT = SEG.reduce((a, s) => a + s.q, 0);

export function HeatingCurve() {
  const X = (q: number) => 70 + (q / QTOT) * 480;
  const Y = (T: number) => 225 - (T + 20) * 1.15;
  return (
    <Anim title="The heating curve of ice to steam: temperature against heat added, with flat steps at melting and boiling" height={275} loop={14}>
      {(t) => {
        const u = phase(t, 0.6, 11.5);
        let acc = 0;
        let qacc = 0;
        const pts: [number, number][] = [[X(0), Y(-20)]];
        let seg = 0;
        let sp = 0;
        let T = -20;
        let Q = 0;
        for (let i = 0; i < SEG.length; i++) {
          const s = SEG[i];
          const local = clamp((u - acc) / s.w);
          if (u >= acc) {
            seg = i;
            sp = local;
            Q = qacc + s.q * local;
            T = lerp(s.T0, s.T1, local);
            pts.push([X(Q), Y(T)]);
          }
          acc += s.w;
          qacc += s.q;
        }
        const cx = 130;
        const cy = 112;
        const icon =
          seg === 0 ? (
            <Block x={cx} y={cy} w={40} h={40} />
          ) : seg === 1 ? (
            <g>
              <Block x={cx} y={cy + 20 - 20 * (1 - sp)} w={40 * (1 - sp * 0.9)} h={40 * (1 - sp * 0.9)} />
              <rect className="fig-cliff" x={cx - 36} y={cy + 20 - 14 * sp} width={72} height={14 * sp} />
            </g>
          ) : seg === 2 ? (
            <rect className="fig-cliff" x={cx - 36} y={cy + 6} width={72} height={14} />
          ) : seg === 3 ? (
            <g>
              <rect className="fig-cliff" x={cx - 36} y={cy + 20 - 14 * (1 - sp * 0.6)} width={72} height={14 * (1 - sp * 0.6)} />
              {[0, 1, 2].map((i) => {
                const b = (t * 0.9 + i / 3) % 1;
                return <circle key={i} className="fig-guide" cx={cx - 18 + i * 18} cy={cy + 10 - 40 * b} r={4 + 2 * b} />;
              })}
            </g>
          ) : (
            <Wisps x={cx} y={cy + 20} n={3} t={t} h={46} spread={20} />
          );
        return (
          <g>
            <Axes x={70} y={235} w={500} h={190} xLabel="Q" yLabel="T" />
            <Line x1={70} x2={560} y1={Y(0)} y2={Y(0)} dashed tone="faint" />
            <Line x1={70} x2={560} y1={Y(100)} y2={Y(100)} dashed tone="faint" />
            <Label x={62} y={Y(0) + 5} kind="val" anchor="end">0</Label>
            <Label x={62} y={Y(100) + 5} kind="val" anchor="end">100</Label>
            <Trail points={pts} />
            <Ball x={X(Q)} y={Y(T)} />
            {icon}
            <Label x={cx} y={162} kind="label">{SEG[seg].name.replace('L_f', 'Lf').replace('L_v', 'Lv')}</Label>
            <Label x={102} y={Y(0) - 9} kind="label">melts</Label>
            <Label x={368} y={Y(100) - 10} kind="label">boils</Label>
            <Readout>{`T = ${T.toFixed(0)} °C   Q = ${Q.toFixed(0)} kJ`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 8. conduction

export function ConductionRod() {
  return (
    <Anim title="Heat flows along a rod from the hot end to the cold end as the particles jiggle harder and pass it on" height={220} loop={11}>
      {(t) => {
        const p = ease(phase(t, 0.6, 7));
        const cells: ReactNode[] = [];
        for (let i = 0; i < 28; i++) {
          const col = i % 14;
          const u = col / 13;
          const f = (1 - 0.85 * u) * clamp((p * 1.25 - u) / 0.25);
          const [dx, dy] = jig(i, t, 0.8 + 7 * f);
          cells.push(<circle key={i} className="fig-ball" cx={130 + col * 30 + dx} cy={100 + Math.floor(i / 14) * 24 + dy} r={3.2} style={{ opacity: 0.3 + 0.7 * f }} />);
        }
        return (
          <g>
            <Block x={62} y={110} w={44} h={56} filled />
            <Block x={578} y={110} w={44} h={56} />
            <rect className="fig-bar" x={100} y={78} width={440} height={64} rx={4} />
            {cells}
            <Wisps x={62} y={72} n={3} t={t} h={26} spread={12} level={1} />
            <Label x={62} y={190} kind="val">hot</Label>
            <Label x={578} y={190} kind="val">cold</Label>
            <g style={fade(p * 3)}>
              <Arrow x1={140} y1={166} x2={140 + 300 * p} y2={166} />
            </g>
            <Label x={320} y={206} kind="sym">P = k · A · ΔT / L</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function SeriesRods() {
  const X = (m: number) => 100 + m * 440;
  const prof = (m: number) => (m <= 0.5 ? 100 - 23 * m : 88.5 - 177 * (m - 0.5));
  const Y = (T: number) => 225 - T * 0.95;
  const all: [number, number][] = Array.from({ length: 41 }, (_, i) => [X(i / 40), Y(prof(i / 40))]);
  return (
    <Anim title="Two rods in series carry the same heat flow; the temperature drops faster across the poor conductor" height={255} loop={10}>
      {(t) => {
        const p = phase(t, 0.5, 6);
        const pts = all.filter((_, i) => i / 40 <= p);
        return (
          <g>
            <rect className="kit-block" x={100} y={36} width={220} height={30} />
            <rect className="kit-block" x={320} y={36} width={220} height={30} style={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Label x={210} y={88} kind="label">copper, k = 385</Label>
            <Label x={430} y={88} kind="label">steel, k = 50</Label>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const m = (t * 0.1 + i / 6) % 1;
              return <Ball key={i} x={X(m)} y={51} r={3.4} glow={false} />;
            })}
            <Line x1={100} x2={540} y1={225} y2={225} />
            <Trail points={all} tone="faint" />
            <Trail points={pts} />
            <Line x1={320} x2={320} y1={Y(88.5)} y2={225} dashed tone="faint" />
            <Label x={92} y={Y(100) + 5} kind="val" anchor="end">100 °C</Label>
            <Label x={92} y={229} kind="val" anchor="end">0 °C</Label>
            <Label x={310} y={Y(88.5) - 12} kind="val" anchor="end">88.5 °C</Label>
            <Label x={210} y={Y(94) + 40} kind="label">gentle slope</Label>
            <Label x={430} y={Y(40) - 14} kind="label">steep slope</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 9. convection

const loopPos = (s: number): [number, number] => {
  const f = ((s % 1) + 1) % 1;
  const per = 820;
  const d = f * per;
  if (d < 300) return [170 + d, 180];
  if (d < 410) return [470, 180 - (d - 300)];
  if (d < 710) return [470 - (d - 410), 70];
  return [170, 70 + (d - 710)];
};

export function SeaBreeze() {
  const wave: [number, number][] = Array.from({ length: 31 }, (_, i) => [i * 10, 200]);
  return (
    <Anim title="A sea breeze: warm air rises over the land and cool air flows in from the sea to replace it" height={250} loop={10}>
      {(t) => (
        <g>
          <Ground y={200} x1={300} x2={640} />
          <Trail points={wave.map(([x], i) => [x, 200 + 3 * Math.sin(x * 0.12 + t * 3 + i * 0.1)] as [number, number])} tone="soft" />
          <Label x={150} y={232} kind="label">sea: cooler</Label>
          <Label x={470} y={232} kind="label">land: warmer</Label>
          <Ball x={590} y={44} r={11} />
          <Wisps x={470} y={196} n={3} t={t} h={14} spread={50} />
          {Array.from({ length: 10 }, (_, i) => {
            const [x, y] = loopPos(t / 10 + i / 10);
            return <Ball key={i} x={x} y={y} r={4} glow={false} />;
          })}
          <Arrow x1={230} y1={160} x2={300} y2={160} />
          <Arrow x1={420} y1={88} x2={350} y2={88} />
          <Label x={265} y={146} kind="label">sea breeze</Label>
          <Label x={150} y={120} kind="label" anchor="middle">cool air sinks</Label>
          <Label x={500} y={120} kind="label" anchor="start">warm air rises</Label>
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ 10. radiation

export function Stefan() {
  const X = (T: number) => 360 + ((T - 300) / 300) * 230;
  const Y = (r: number) => 200 - r * 9.5;
  const curve: [number, number][] = Array.from({ length: 31 }, (_, i) => [X(300 + i * 10), Y(((300 + i * 10) / 300) ** 4)]);
  return (
    <Anim title="A hotter object radiates much more: doubling the kelvin temperature multiplies the power by sixteen" height={240} loop={11}>
      {(t) => {
        const p = ease(there(t, 11));
        const T = 300 + 300 * p;
        const r = (T / 300) ** 4;
        const part = curve.filter(([x]) => x <= X(T)).concat([[X(T), Y(r)]]);
        return (
          <g>
            <Ball x={130} y={105} r={28} />
            {Array.from({ length: 14 }, (_, i) => {
              const a = (i / 14) * 2 * Math.PI;
              return <line key={i} className="fig-vec" x1={130 + 40 * Math.cos(a)} y1={105 + 40 * Math.sin(a)} x2={130 + 62 * Math.cos(a)} y2={105 + 62 * Math.sin(a)} style={{ opacity: 0.12 + 0.88 * (r / 16), strokeWidth: 0.8 + 3 * (r / 16) }} />;
            })}
            <Label x={130} y={206} kind="val">{`T = ${T.toFixed(0)} K`}</Label>
            <Axes x={360} y={200} w={240} h={170} xLabel="T" yLabel="P" />
            <Trail points={curve} tone="faint" />
            <Trail points={part} />
            <Ball x={X(T)} y={Y(r)} />
            <Readout>{`P = ${r.toFixed(1)} × P₀`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function Wien() {
  const X = (l: number) => 60 + (l / 3) * 520;
  const plank = (l: number, T: number) => l ** -5 / (Math.exp(14388 / (l * T)) - 1);
  return (
    <Anim title="As an object gets hotter its radiation peaks at a shorter wavelength" height={255} loop={11}>
      {(t) => {
        const T = 3000 + 3000 * ease(there(t, 11));
        const lm = 2898 / T;
        const pk = plank(lm, T);
        const pts: [number, number][] = Array.from({ length: 96 }, (_, i) => {
          const l = 0.15 + (i / 95) * 2.85;
          return [X(l), 210 - 160 * (plank(l, T) / pk)];
        });
        return (
          <g>
            <rect className="fig-cliff" x={X(0.4)} y={50} width={X(0.7) - X(0.4)} height={160} />
            <Label x={X(0.55)} y={44} kind="val">visible</Label>
            <Axes x={60} y={210} w={540} h={170} xLabel="λ" yLabel="I" />
            <Trail points={pts} />
            <Line x1={X(lm)} x2={X(lm)} y1={50} y2={210} dashed tone="faint" />
            <Label x={X(lm) + 8} y={80} kind="val" anchor="start">{`λmax = ${(lm * 1000).toFixed(0)} nm`}</Label>
            {[1, 2, 3].map((v) => (
              <Label key={v} x={X(v)} y={230} kind="val">{`${v} µm`}</Label>
            ))}
            <Readout>{`T = ${T.toFixed(0)} K`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 11. Newton's cooling

const K_COOL = Math.log(70 / 50) / 10;
const Tcool = (m: number) => 20 + 70 * Math.exp(-K_COOL * m);

export function CoolingCup({ example }: { example?: boolean }) {
  const X = (m: number) => 250 + m * 5.6;
  const Y = (T: number) => 215 - T * 1.6;
  const all: [number, number][] = Array.from({ length: 61 }, (_, i) => [X(i), Y(Tcool(i))]);
  return (
    <Anim title="A cup of coffee cools quickly at first and then more slowly, levelling off at room temperature" height={255} loop={12}>
      {(t) => {
        const m = 60 * ease(phase(t, 0.6, 8.5));
        const T = Tcool(m);
        const part: [number, number][] = all.filter((_, i) => i <= m).concat([[X(m), Y(T)]]);
        const slope = (1.6 * K_COOL * (T - 20)) / 5.6;
        return (
          <g>
            <path className="fig-bar" d="M60 90L70 190L140 190L150 90Z" />
            <path className="fig-bar" d="M150 108q34 0 34 28t-32 28" />
            <path d="M63 108L71 190L139 190L147 108Z" style={{ fill: `rgba(255,255,255,${0.1 + 0.12 * ((T - 20) / 70)})` }} />
            <Wisps x={105} y={80} n={3} t={t} h={36} spread={22} level={(T - 20) / 60} />
            <Label x={105} y={216} kind="val">{`${T.toFixed(0)} °C`}</Label>
            <Axes x={250} y={215} w={360} h={170} xLabel="t" yLabel="T" />
            <Line x1={250} x2={600} y1={Y(20)} y2={Y(20)} dashed tone="faint" />
            <Label x={606} y={Y(20) - 6} kind="val" anchor="end">room 20 °C</Label>
            <Trail points={all} tone="faint" />
            <Trail points={part} />
            <Ball x={X(m)} y={Y(T)} />
            {!example && <Line x1={X(m) - 36} x2={X(m) + 36} y1={Y(T) - 36 * slope} y2={Y(T) + 36 * slope} tone="bright" />}
            {example && (
              <g style={fade(phase(t, 8.6, 9.6))}>
                <Line x1={250} x2={X(37.2)} y1={Y(40)} y2={Y(40)} dashed tone="soft" />
                <Line x1={X(37.2)} x2={X(37.2)} y1={Y(40)} y2={215} dashed tone="soft" />
                <Label x={X(37.2)} y={236} kind="val">37.2 min</Label>
                <Label x={242} y={Y(40) + 5} kind="val" anchor="end">40</Label>
              </g>
            )}
            <Readout>{`t = ${m.toFixed(0)} min`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ worked examples

export function ConvertChain() {
  const boxes = [
    { x: 75, v: '98.6 °F', op: '' },
    { x: 240, v: '66.6', op: '− 32' },
    { x: 405, v: '37.0 °C', op: '× 5/9' },
    { x: 570, v: '310.15 K', op: '+ 273.15' },
  ];
  return (
    <Anim title="Converting 98.6 degrees Fahrenheit: subtract 32, multiply by five ninths, then add 273.15" height={170} loop={10}>
      {(t) => (
        <g>
          {boxes.map((b, i) => {
            const p = phase(t, 0.4 + i * 1.5, 1.2 + i * 1.5);
            return (
              <g key={i} style={fade(p)}>
                <rect className="kit-block" x={b.x - 56} y={64} width={112} height={44} rx={4} />
                <Label x={b.x} y={92} kind="val">{b.v}</Label>
                {i > 0 && <Arrow x1={b.x - 108} y1={86} x2={b.x - 62} y2={86} />}
                {i > 0 && <Label x={b.x - 85} y={60} kind="val">{b.op}</Label>}
              </g>
            );
          })}
          <g style={fade(phase(t, 6.4, 7.2))}>
            <Label x={320} y={150} kind="label">body temperature on three scales</Label>
          </g>
        </g>
      )}
    </Anim>
  );
}

export function RailGap() {
  return (
    <Anim title="Two rails heated by 40 kelvin grow toward each other and almost close the gap between them" height={200} loop={10}>
      {(t) => {
        const p = ease(phase(t, 0.8, 6));
        const L = 290 + 28.8 * p;
        const R = 350 - 28.8 * p;
        return (
          <g>
            {Array.from({ length: 15 }, (_, i) => (
              <rect key={i} className="fig-cliff" x={26 + i * 40} y={116} width={10} height={14} />
            ))}
            <rect className="kit-block is-filled" x={20} y={104} width={L - 20} height={12} />
            <rect className="kit-block is-filled" x={R} y={104} width={620 - R} height={12} />
            <Line x1={290} x2={290} y1={84} y2={136} dashed tone="faint" />
            <Line x1={350} x2={350} y1={84} y2={136} dashed tone="faint" />
            <Label x={320} y={74} kind="val">{`gap ${(30 - 28.8 * p).toFixed(1)} mm`}</Label>
            <Ball x={560} y={40} r={10} />
            <Label x={320} y={172} kind="label">each 30 m rail grows 14.4 mm (drawn 2 px per mm)</Label>
            <Readout>{`T = ${(20 + 40 * p).toFixed(0)} °C`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function MixCurves() {
  const X = (s: number) => 80 + s * 460;
  const Y = (T: number) => 210 - T * 1.6;
  const hot: [number, number][] = [];
  const cold: [number, number][] = [];
  for (let i = 0; i <= 40; i++) {
    const s = i / 40;
    hot.push([X(s), Y(44 + 36 * Math.exp(-4 * s))]);
    cold.push([X(s), Y(44 - 24 * Math.exp(-4 * s))]);
  }
  return (
    <Anim title="The hot water cools and the cold water warms until both reach 44 degrees Celsius" height={250} loop={10}>
      {(t) => {
        const p = phase(t, 0.6, 6);
        const f = (a: [number, number][]) => a.filter((_, i) => i / 40 <= p);
        return (
          <g>
            <Axes x={80} y={210} w={500} h={175} xLabel="t" yLabel="T" />
            <Line x1={80} x2={560} y1={Y(44)} y2={Y(44)} dashed tone="faint" />
            <Trail points={f(hot)} />
            <Trail points={f(cold)} />
            <Label x={X(0.03)} y={Y(80) - 12} kind="val" anchor="start">200 g, 80 °C</Label>
            <Label x={X(0.03)} y={Y(20) + 22} kind="val" anchor="start">300 g, 20 °C</Label>
            <Label x={560} y={Y(44) - 8} kind="val" anchor="end">44 °C</Label>
            <g style={fade(phase(t, 6, 7))}>
              <Label x={430} y={70} kind="label">heat lost = heat gained</Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

export function IceToWater() {
  return (
    <Anim title="Ice at zero degrees melts first, then the water warms to 50 degrees; the heat needed is counted in a bar" height={240} loop={12}>
      {(t) => {
        const Q = 54.33 * phase(t, 0.6, 9);
        const f = clamp(Q / 33.4);
        const T = Q < 33.4 ? 0 : (50 * (Q - 33.4)) / 20.93;
        const bx = 300;
        const bw = 280;
        const k = bw / 54.33;
        return (
          <g>
            <Beaker x1={60} x2={200} y={200} yTop={70} h={8 + 28 * f} />
            {f < 1 && <Block x={130} y={200 - 8 - 20 * (1 - f)} w={44 * (1 - f) + 2} h={40 * (1 - f) + 2} />}
            <Label x={130} y={226} kind="val">{`T = ${T.toFixed(0)} °C`}</Label>
            <rect className="fig-bar" x={bx} y={110} width={bw} height={26} />
            <rect className="fig-cliff" x={bx} y={110} width={Math.min(Q, 33.4) * k} height={26} />
            <rect className="kit-block is-filled" x={bx + 33.4 * k} y={110} width={Math.max(0, Q - 33.4) * k} height={26} />
            <Line x1={bx + 33.4 * k} x2={bx + 33.4 * k} y1={104} y2={142} tone="bright" />
            <Label x={bx + (33.4 * k) / 2} y={162} kind="val">melt 33.4 kJ</Label>
            <Label x={bx + 33.4 * k + (20.93 * k) / 2} y={162} kind="val">warm 20.9 kJ</Label>
            <Label x={bx} y={96} kind="val" anchor="start">{`Q = ${Q.toFixed(1)} kJ`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Pane() {
  return (
    <Anim title="Heat flows through a window pane from the warm room to the cold outside, a steady stream of energy" height={230} loop={8}>
      {(t) => (
        <g>
          <rect className="fig-cliff" x={270} y={44} width={100} height={140} />
          {Array.from({ length: 24 }, (_, i) => {
            const col = i % 4;
            const f = 1 - col * 0.22;
            const [dx, dy] = jig(i, t, 0.8 + 4 * f);
            return <circle key={i} className="fig-dot" cx={288 + col * 22 + dx} cy={64 + Math.floor(i / 4) * 22 + dy} r={2.8} />;
          })}
          {Array.from({ length: 7 }, (_, i) => {
            const s = (t / 4 + i / 7) % 1;
            return <Ball key={i} x={90 + s * 460} y={70 + ((i * 37) % 100)} r={3.6} glow={false} />;
          })}
          <Label x={160} y={216} kind="val">room 20 °C</Label>
          <Label x={480} y={216} kind="val">outside 5 °C</Label>
          <Label x={320} y={28} kind="val">d = 4 mm, A = 1.5 m²</Label>
          <Label x={320} y={206} kind="label">P = 4500 W</Label>
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ common mistakes

export function MistakeHeat() {
  const cup = { x: 130, w: 70, n: 6, T: 80, e: 16.7 };
  const tub = { x: 410, w: 190, n: 18, T: 40, e: 167 };
  return (
    <Anim title="A small cup of hot water has a higher temperature than a big tub but holds far less heat" height={190} loop={8}>
      {(t) => {
        const p = ease(phase(t, 2, 4));
        return (
          <g>
            {[cup, tub].map((v, j) => (
              <g key={j}>
                <rect className="fig-cliff" x={v.x - v.w / 2} y={50} width={v.w} height={70} />
                {Array.from({ length: v.n }, (_, i) => {
                  const [dx, dy] = jig(i + j * 5, t, 0.6 + (v.T / 80) * 5);
                  return <circle key={i} className="fig-ball" cx={v.x - v.w / 2 + 14 + ((i * 29) % (v.w - 26)) + dx} cy={64 + ((i * 17 + j * 9) % 44) + dy} r={2.6} />;
                })}
                <Label x={v.x} y={38} kind="val">{`${v.T} °C`}</Label>
                <rect className="kit-block is-filled" x={v.x - v.w / 2} y={140} width={Math.max(2, v.e * p)} height={12} />
              </g>
            ))}
            <Label x={320} y={178} kind="label">heat content (bars) is not temperature</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function MistakeKelvin() {
  return (
    <Anim title="Using Celsius in the T to the fourth law predicts 16 times; with kelvin it is only 1.41 times" height={170} loop={8}>
      {(t) => {
        const p = ease(phase(t, 0.8, 4));
        return (
          <g>
            <Label x={30} y={62} kind="label" anchor="start">°C: 27 → 54</Label>
            <rect className="fig-cliff" x={170} y={44} width={14 * 16 * p} height={26} />
            <Label x={180 + 14 * 16 * p} y={62} kind="val" anchor="start">{`${(16 * p).toFixed(1)} ×`}</Label>
            <Label x={30} y={122} kind="label" anchor="start">K: 300 → 327</Label>
            <rect className="kit-block is-filled" x={170} y={104} width={14 * 1.41 * p} height={26} />
            <Label x={180 + 14 * 1.41 * p} y={122} kind="val" anchor="start">{`${(1 + 0.41 * p).toFixed(2)} ×`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function MistakeArea() {
  return (
    <Anim title="A plate grows in length by a fraction alpha delta T, but in area by twice that fraction" height={170} loop={8}>
      {(t) => {
        const p = ease(phase(t, 0.8, 4));
        const s = 70 * (1 + 0.2 * p);
        return (
          <g>
            <rect className="fig-cliff" x={110 - s / 2} y={85 - s / 2} width={s} height={s} />
            <rect className="fig-guide fig-dash" x={75} y={50} width={70} height={70} />
            <Label x={250} y={56} kind="label" anchor="start">length</Label>
            <rect className="kit-block is-filled" x={250} y={64} width={110 * p} height={12} />
            <Label x={256 + 110 * p} y={74} kind="val" anchor="start">α · ΔT</Label>
            <Label x={250} y={108} kind="label" anchor="start">area</Label>
            <rect className="kit-block is-filled" x={250} y={116} width={220 * p} height={12} />
            <Label x={256 + 220 * p} y={126} kind="val" anchor="start">2 · α · ΔT</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function MistakeFlat() {
  const X = (q: number) => 60 + q * 520;
  const Y = (T: number) => 140 - T;
  const path: [number, number][] = [[X(0), Y(-20)], [X(0.2), Y(0)], [X(0.7), Y(0)], [X(1), Y(40)]];
  return (
    <Anim title="While ice melts, heat keeps going in but the temperature stays at zero degrees" height={170} loop={9}>
      {(t) => {
        const u = phase(t, 0.5, 7);
        const q = u;
        let T = -20;
        if (q < 0.2) T = lerp(-20, 0, q / 0.2);
        else if (q < 0.7) T = 0;
        else T = lerp(0, 40, (q - 0.7) / 0.3);
        const pts = path.filter(([x]) => x <= X(q)).concat([[X(q), Y(T)]]);
        return (
          <g>
            <Axes x={60} y={160} w={540} h={125} xLabel="Q" yLabel="T" />
            <Line x1={60} x2={580} y1={Y(0)} y2={Y(0)} dashed tone="faint" />
            <Trail points={path} tone="faint" />
            <Trail points={pts} />
            <Ball x={X(q)} y={Y(T)} />
            <Label x={X(0.45)} y={Y(0) - 12} kind="label">ice + water: stays at 0 °C</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function MistakeLinear() {
  const X = (m: number) => 70 + m * 8;
  const Y = (T: number) => 150 - T;
  const real: [number, number][] = Array.from({ length: 61 }, (_, i) => [X(i), Y(Tcool(i))]);
  const mEnd = 90 / (70 * K_COOL);
  const line: [number, number][] = [[X(0), Y(90)], [X(mEnd), Y(0)]];
  return (
    <Anim title="A cooling object follows a curve that levels off, not a straight line that would fall below room temperature" height={170} loop={9}>
      {(t) => {
        const m = 60 * ease(phase(t, 0.6, 6));
        const part = real.filter((_, i) => i <= m).concat([[X(m), Y(Tcool(m))]]);
        return (
          <g>
            <Axes x={70} y={150} w={520} h={130} xLabel="t" yLabel="T" />
            <Line x1={70} x2={590} y1={Y(20)} y2={Y(20)} dashed tone="faint" />
            <Trail points={line} dashed tone="soft" />
            <Trail points={part} />
            <Ball x={X(m)} y={Y(Tcool(m))} />
            <Label x={X(40)} y={Y(62)} kind="label" anchor="start">real: levels off</Label>
            <Label x={X(38.5)} y={Y(0) - 16} kind="label" anchor="start">straight: too far</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function MistakeVacuum() {
  return (
    <Anim title="Sunlight carries heat across empty space, so radiation needs no medium" height={160} loop={6}>
      {(t) => {
        const pts: [number, number][] = [];
        for (let x = 100; x <= 550; x += 5) pts.push([x, 80 + 12 * Math.sin((x - t * 140) * 0.09)]);
        return (
          <g>
            <Ball x={60} y={80} r={20} />
            <circle className="fig-ghost" cx={590} cy={80} r={16} />
            <Trail points={pts} tone="soft" />
            <Label x={320} y={36} kind="label">empty space, no air at all</Label>
            <Label x={320} y={136} kind="label">the heat still arrives</Label>
          </g>
        );
      }}
    </Anim>
  );
}
