import { Anim, Arrow, Ball, Block, Ground, Label, Line, clamp, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for units and measurement. Positions come from the real numbers, scaled to pixels. */

const TAU = 2 * Math.PI;

const SUPS: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
/** 10 to a whole power, written with Unicode superscripts: pw(-3) is "10⁻³". */
const pw = (n: number) => `10${[...String(n)].map((c) => SUPS[c]).join('')}`;

const rect = (x: number, y: number, w: number, h: number, key: string | number, o = 1, cls = 'fig-ball') => <rect key={key} className={cls} x={x} y={y} width={w} height={h} opacity={o} />;

// ------------------------------------------------------------------ number times unit

export function Measure() {
  const units = [
    { name: 'm', size: 400, n: 1.2, show: '1.2 m' },
    { name: 'dm', size: 40, n: 12, show: '12 dm' },
    { name: 'cm', size: 4, n: 120, show: '120 cm' },
  ];
  return (
    <Anim title="The same bar measured in metres, decimetres and centimetres: the smaller the unit, the bigger the number, but the length does not change" height={205} loop={10.5}>
      {(t) => {
        const k = Math.min(2, Math.floor(t / 3.5));
        const u = units[k];
        const t0 = t - k * 3.5;
        const p = ease(phase(t0, 0.3, 2.6));
        const x0 = 80, len = 480, y = 80;
        const reach = len * p;
        const marks: number[] = [];
        for (let x = 0; x <= len + 0.1; x += u.size) marks.push(x);
        const count = u.n * p;
        const whole = Math.floor(count + 1e-9);
        const shown = k === 0 ? count.toFixed(1) : String(whole);
        return (
          <g>
            <rect className="fig-ball" x={x0} y={y - 9} width={len} height={18} opacity={0.22} />
            <rect className="fig-ball" x={x0} y={y - 9} width={reach} height={18} opacity={0.75} />
            <Line x1={x0} y1={y - 22} x2={x0} y2={y + 22} tone="bright" />
            <Line x1={x0 + len} y1={y - 22} x2={x0 + len} y2={y + 22} tone="bright" />
            {marks.map((m) => (
              <Line key={`${k}-${m}`} x1={x0 + m} y1={y + 12} x2={x0 + m} y2={y + 12 + (u.size < 10 ? 7 : 14)} tone={m <= reach ? 'bright' : 'soft'} />
            ))}
            <Label x={x0 + len / 2} y={y - 32} kind="label">the length: it never changes</Label>
            <Label x={x0 + len / 2} y={150} kind="val">{`${shown} ${u.name}`}</Label>
            <Label x={x0 + len / 2} y={178} kind="label">{`one unit = 1 ${u.name}`}</Label>
            <Arrow x1={x0 + 40} y1={y + 52} x2={x0 + 40 + Math.min(u.size, 400) * 0.9} y2={y + 52} tone="soft" />
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the seven SI base units

export function SiBase() {
  const cells: { cx: number; cy: number; q: string; u: string }[] = [
    { cx: 80, cy: 48, q: 'length', u: 'metre  m' },
    { cx: 240, cy: 48, q: 'mass', u: 'kilogram  kg' },
    { cx: 400, cy: 48, q: 'time', u: 'second  s' },
    { cx: 560, cy: 48, q: 'electric current', u: 'ampere  A' },
    { cx: 130, cy: 170, q: 'temperature', u: 'kelvin  K' },
    { cx: 320, cy: 170, q: 'amount of substance', u: 'mole  mol' },
    { cx: 510, cy: 170, q: 'luminous intensity', u: 'candela  cd' },
  ];
  return (
    <Anim title="The seven SI base units, each with a small animation: a length growing, a balance tilting, a clock hand turning, charge flowing along a wire, a thermometer rising, particles being counted and a lamp glowing" height={262} loop={6}>
      {(t) => {
        const s = Math.sin((TAU * t) / 6);
        const ang = (TAU * t) / 6;
        const dots = 1 + Math.floor(phase(t % 6, 0, 5) * 8.99);
        return (
          <g>
            {cells.map((c) => (
              <g key={c.q}>
                <Label x={c.cx} y={c.cy + 52} kind="label">{c.q}</Label>
                <Label x={c.cx} y={c.cy + 72} kind="val">{c.u}</Label>
              </g>
            ))}
            {/* length: a bar that grows and shrinks between two end marks */}
            <g>
              <Line x1={cells[0].cx - 40} y1={cells[0].cy - 12} x2={cells[0].cx - 40} y2={cells[0].cy + 12} tone="bright" />
              <Line x1={cells[0].cx - 40 + 40 + 36 * s} y1={cells[0].cy - 12} x2={cells[0].cx - 40 + 40 + 36 * s} y2={cells[0].cy + 12} tone="bright" />
              <Arrow x1={cells[0].cx - 40} y1={cells[0].cy} x2={cells[0].cx - 40 + 40 + 36 * s} y2={cells[0].cy} tone="soft" />
            </g>
            {/* mass: a balance that tilts */}
            <g transform={`translate(${cells[1].cx} ${cells[1].cy - 2}) rotate(${(14 * s).toFixed(2)})`}>
              <Line x1={-40} y1={0} x2={40} y2={0} tone="bright" />
              <circle className="kit-block" cx={-40} cy={10} r={7} />
              <circle className="kit-block" cx={40} cy={10} r={7} />
            </g>
            <Line x1={cells[1].cx} y1={cells[1].cy - 2} x2={cells[1].cx - 9} y2={cells[1].cy + 22} tone="soft" />
            <Line x1={cells[1].cx} y1={cells[1].cy - 2} x2={cells[1].cx + 9} y2={cells[1].cy + 22} tone="soft" />
            {/* time: a clock hand */}
            <circle className="fig-guide" cx={cells[2].cx} cy={cells[2].cy} r={26} fill="none" />
            <Line x1={cells[2].cx} y1={cells[2].cy} x2={cells[2].cx + 22 * Math.sin(ang)} y2={cells[2].cy - 22 * Math.cos(ang)} tone="bright" />
            <Ball x={cells[2].cx} y={cells[2].cy} r={3} glow={false} />
            {/* current: charges drifting along a wire */}
            <Line x1={cells[3].cx - 44} y1={cells[3].cy} x2={cells[3].cx + 44} y2={cells[3].cy} tone="soft" />
            {[0, 1, 2, 3].map((i) => {
              const f = ((t / 3 + i / 4) % 1);
              return <Ball key={i} x={cells[3].cx - 44 + 88 * f} y={cells[3].cy} r={4} glow={false} />;
            })}
            {/* temperature: a thermometer whose column rises and falls */}
            <rect className="fig-guide" x={cells[4].cx - 6} y={cells[4].cy - 30} width={12} height={46} rx={6} fill="none" />
            {rect(cells[4].cx - 4, cells[4].cy + 14 - (16 + 14 * (0.5 + 0.5 * s)) - 0, 8, 16 + 14 * (0.5 + 0.5 * s), 'col', 0.85)}
            <circle className="fig-ball" cx={cells[4].cx} cy={cells[4].cy + 20} r={8} />
            {/* amount: particles being counted into a group */}
            {Array.from({ length: 9 }, (_, i) => (
              <circle key={i} className={i < dots ? 'fig-ball' : 'fig-ghost'} cx={cells[5].cx - 24 + (i % 3) * 24} cy={cells[5].cy - 22 + Math.floor(i / 3) * 22} r={i < dots ? 6 : 5} />
            ))}
            {/* luminous intensity: a lamp whose glow pulses */}
            <Ball x={cells[6].cx} y={cells[6].cy} r={7} />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const a = (i * TAU) / 8;
              const r1 = 16 + 4 * (0.5 + 0.5 * s), r2 = r1 + 8 + 8 * (0.5 + 0.5 * s);
              return <Line key={i} x1={cells[6].cx + r1 * Math.cos(a)} y1={cells[6].cy + r1 * Math.sin(a)} x2={cells[6].cx + r2 * Math.cos(a)} y2={cells[6].cy + r2 * Math.sin(a)} tone="soft" />;
            })}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ derived units

export function DerivedWeb() {
  const bases = [
    { name: 'm', y: 50 },
    { name: 'kg', y: 125 },
    { name: 's', y: 200 },
  ];
  const derived = [
    { y: 36, text: 'speed: m/s', from: [0, 2] },
    { y: 96, text: 'acceleration: m/s²', from: [0, 2] },
    { y: 156, text: 'force: N = kg·m/s²', from: [0, 1, 2] },
    { y: 216, text: 'energy: J = kg·m²/s²', from: [0, 1, 2] },
  ];
  return (
    <Anim title="Base units flow into derived units: metres and seconds make speed and acceleration, and with kilograms they make force and energy" height={246} loop={12}>
      {(t) => {
        const act = Math.min(3, Math.floor(t / 3));
        const f = (t % 3) / 3;
        return (
          <g>
            {derived.map((d, i) =>
              d.from.map((b) => {
                const x1 = 92, y1 = bases[b].y, x2 = 318, y2 = d.y;
                const on = i === act;
                return (
                  <g key={`${i}-${b}`}>
                    <Line x1={x1} y1={y1} x2={x2} y2={y2} tone={on ? 'bright' : 'soft'} dashed={!on} />
                    {on && <Ball x={lerp(x1, x2, (f * 1.4) % 1)} y={lerp(y1, y2, (f * 1.4) % 1)} r={4} glow={false} />}
                  </g>
                );
              }),
            )}
            {bases.map((b, i) => {
              const on = derived[act].from.includes(i);
              const pulse = on ? 1 + 0.12 * Math.sin(TAU * t * 1.5) : 1;
              return (
                <g key={b.name}>
                  <circle className={on ? 'kit-block is-filled' : 'kit-block'} cx={70} cy={b.y} r={22 * pulse} />
                  <text className="fig-sym" x={70} y={b.y + 7} textAnchor="middle" style={{ fill: on ? '#000' : undefined }}>{b.name}</text>
                </g>
              );
            })}
            {derived.map((d, i) => (
              <g key={d.text}>
                <rect className={i === act ? 'kit-block is-filled' : 'kit-block'} x={318} y={d.y - 19} width={300} height={38} rx={4} />
                <text className="fig-label" x={332} y={d.y + 6} style={{ fill: i === act ? '#000' : undefined }}>{d.text}</text>
              </g>
            ))}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ prefixes

const PREFIX = [
  { sym: 'n', e: -9, unit: 'nm' },
  { sym: 'µ', e: -6, unit: 'µm' },
  { sym: 'm', e: -3, unit: 'mm' },
  { sym: '', e: 0, unit: 'm' },
  { sym: 'k', e: 3, unit: 'km' },
  { sym: 'M', e: 6, unit: 'Mm' },
  { sym: 'G', e: 9, unit: 'Gm' },
];

export function Prefixes() {
  return (
    <Anim title="A ladder of metric prefixes: each step up multiplies the unit by one thousand, and a marker climbs from nano to giga" height={215} loop={12}>
      {(t) => {
        const x0 = 70, dx = 83, y = 98;
        const pos = Math.min(6, t / 1.6);
        const idx = clamp(Math.floor(pos + 0.5), 0, 6);
        const here = PREFIX[idx];
        const mx = x0 + dx * (Math.floor(pos) + ease(pos - Math.floor(pos)));
        return (
          <g>
            <Arrow x1={x0 - 30} y1={y} x2={x0 + dx * 6 + 36} y2={y} tone="soft" />
            {PREFIX.map((p, k) => (
              <g key={p.e}>
                <Line x1={x0 + dx * k} y1={y - 7} x2={x0 + dx * k} y2={y + 7} tone="bright" />
                <Label x={x0 + dx * k} y={y - 18} kind="sym">{p.sym === '' ? '1' : p.sym}</Label>
                <Label x={x0 + dx * k} y={y + 28} kind="val">{pw(p.e)}</Label>
              </g>
            ))}
            <Ball x={mx} y={y} r={7} />
            <Label x={W / 2} y={160} kind="val">{`1 ${here.unit} = ${pw(here.e)} m`}</Label>
            <Label x={W / 2} y={190} kind="label">each step along the ladder multiplies by 10³</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ converting with fractions equal to one

export function ConvertChain() {
  return (
    <Anim title="Converting 72 kilometres per hour: multiply by fractions equal to one, cross out the units that cancel, and 20 metres per second is left" height={200} loop={11}>
      {(t) => {
        const a = (t0: number) => ease(phase(t, t0, t0 + 0.8));
        const strike = (t0: number, x: number, y: number, w: number) => {
          const p = ease(phase(t, t0, t0 + 0.7));
          if (p < 0.02) return null;
          return <Line x1={x} y1={y + 5} x2={x + w * p} y2={y - 15 * p + 5 - 5} tone="bright" />;
        };
        const yt = 74, yb = 118, yBar = 90;
        const frac = (xc: number, topN: string, topU: string, botN: string, botU: string, o: number) => (
          <g opacity={o}>
            <text className="fig-label" x={xc - 6} y={yt} textAnchor="end">{topN}</text>
            <text className="fig-label" x={xc} y={yt}>{topU}</text>
            <Line x1={xc - 56} y1={yBar} x2={xc + 52} y2={yBar} tone="bright" />
            <text className="fig-label" x={xc - 6} y={yb} textAnchor="end">{botN}</text>
            <text className="fig-label" x={xc} y={yb}>{botU}</text>
          </g>
        );
        const out = a(7.2);
        return (
          <g>
            {frac(90, '72', 'km', '1', 'h', a(0.2))}
            <text className="fig-sym" x={166} y={yBar + 6} textAnchor="middle" opacity={a(1.2)}>×</text>
            {frac(260, '1000', 'm', '1', 'km', a(1.4))}
            <text className="fig-sym" x={348} y={yBar + 6} textAnchor="middle" opacity={a(2.6)}>×</text>
            {frac(430, '1', 'h', '3600', 's', a(2.8))}
            <text className="fig-sym" x={512} y={yBar + 6} textAnchor="middle" opacity={out}>=</text>
            <text className="fig-label" x={528} y={yBar + 6} opacity={out}>20 m/s</text>
            {strike(4.4, 87, yt, 34)}
            {strike(4.4, 257, yb, 34)}
            {strike(5.5, 427, yt, 18)}
            {strike(5.5, 87, yb, 18)}
            <Label x={W / 2} y={156} kind="label">each fraction equals 1, so the quantity does not change</Label>
            <Label x={W / 2} y={184} kind="val">{`72 × 1000 ÷ 3600 = ${(72 * 1000 / 3600).toFixed(0)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ significant figures

const sigFlags = (s: string) => {
  const first = s.search(/[1-9]/);
  const hasDot = s.includes('.');
  let last = s.length - 1;
  if (!hasDot) while (last >= 0 && s[last] === '0') last--;
  return [...s].map((c, i) => /\d/.test(c) && i >= first && i <= last);
};

export function SigDigits({ numbers = ['0.00450', '3.0070', '62.0'], height = 190, loop = 9, note }: { numbers?: string[]; height?: number; loop?: number; note?: string }) {
  return (
    <Anim title="Counting significant figures: leading zeros stay dim and only the digits that carry information light up, with a running count" height={height} loop={loop} stillAt={loop * 0.5}>
      {(t) => {
        const per = loop / numbers.length;
        const k = Math.min(numbers.length - 1, Math.floor(t / per));
        const s = numbers[k];
        const flags = sigFlags(s);
        const t0 = t - k * per;
        const reveal = phase(t0, 0.4, per * 0.65) * s.length;
        const cw = 38, cx = W / 2, y = height / 2 - 8;
        const x = (i: number) => cx + (i - (s.length - 1) / 2) * cw;
        let count = 0;
        return (
          <g>
            {[...s].map((c, i) => {
              const lit = flags[i] && i < reveal;
              if (lit) count++;
              const dim = /\d/.test(c) && !flags[i] ? 0.3 : 1;
              return (
                <g key={i}>
                  {lit && <rect className="fig-ball" x={x(i) - 15} y={y - 34} width={30} height={46} opacity={0.14} />}
                  <text className="fig-val" x={x(i)} y={y} textAnchor="middle" opacity={lit || c === '.' ? 1 : dim === 1 ? 0.55 : dim} style={{ fontSize: 34, fill: lit ? '#fff' : undefined }}>
                    {c}
                  </text>
                </g>
              );
            })}
            <Label x={cx} y={y + 44} kind="label">{`${count} significant figure${count === 1 ? '' : 's'}`}</Label>
            {note && <Label x={cx} y={height - 12} kind="val">{note}</Label>}
            <Line x1={cx - (s.length * cw) / 2} y1={y + 18} x2={cx - (s.length * cw) / 2 + clamp(reveal / s.length) * s.length * cw} y2={y + 18} tone="soft" />
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ rounding

export function Rounding() {
  return (
    <Anim title="Rounding 2.3 to 2 significant figures: a value slides along the number line and snaps to the nearer of 2.3 and 2.4, switching at the halfway mark 2.35" height={185} loop={9}>
      {(t) => {
        const x0 = 90, x1 = 550, y = 82;
        const v = lerp(2.3, 2.4, ease(phase(t, 0.5, 7.5)));
        const X = (a: number) => lerp(x0, x1, (a - 2.3) / 0.1);
        const down = v < 2.35;
        const near = down ? 2.3 : 2.4;
        return (
          <g>
            <rect className="fig-ball" x={down ? x0 : X(2.35)} y={y - 22} width={down ? X(2.35) - x0 : x1 - X(2.35)} height={44} opacity={0.12} />
            <Line x1={x0 - 20} y1={y} x2={x1 + 20} y2={y} tone="soft" />
            {[2.3, 2.35, 2.4].map((a) => (
              <g key={a}>
                <Line x1={X(a)} y1={y - 10} x2={X(a)} y2={y + 10} tone="bright" dashed={a === 2.35} />
                <Label x={X(a)} y={y + 36} kind="val">{a.toString()}</Label>
              </g>
            ))}
            <Line x1={X(v)} y1={y} x2={X(near)} y2={y} tone="bright" dashed />
            <Ball x={X(v)} y={y} r={6} />
            <Ball x={X(near)} y={y} r={11} ghost />
            <Label x={W / 2} y={140} kind="val">{`${v.toFixed(3)} → ${near.toFixed(1)}`}</Label>
            <Label x={W / 2} y={168} kind="label">the closer end wins; exactly halfway rounds up</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ adding with decimal places

function Num({ s, xDot, y, cw = 24, o = 1, fade }: { s: string; xDot: number; y: number; cw?: number; o?: number; fade?: number }) {
  const dot = s.indexOf('.');
  return (
    <g>
      {[...s].map((c, i) => {
        const rel = i - dot;
        const dimmed = fade !== undefined && rel > fade;
        return (
          <text key={i} className="fig-val" x={xDot + rel * cw} y={y} textAnchor="middle" opacity={o * (dimmed ? 0.25 : 1)} style={{ fontSize: 24 }}>
            {c}
          </text>
        );
      })}
    </g>
  );
}

export function AddAlign() {
  return (
    <Anim title="Adding 12.11, 18.0 and 1.013 with the decimal points lined up: the sum is 31.123 but only as precise as the tenths place of 18.0, so it is written 31.1" height={235} loop={11}>
      {(t) => {
        const xd = 250, cw = 24;
        const a = (t0: number) => ease(phase(t, t0, t0 + 0.7));
        const cut = xd + 1.5 * cw;
        const sweep = ease(phase(t, 4.2, 5.4));
        return (
          <g>
            <Num s="12.11" xDot={xd} y={44} o={a(0.2)} />
            <Num s="18.0" xDot={xd} y={78} o={a(0.9)} />
            <Num s="1.013" xDot={xd} y={112} o={a(1.6)} />
            <Label x={xd + 110} y={44} kind="label" anchor="start">hundredths</Label>
            <Label x={xd + 110} y={78} kind="label" anchor="start">tenths</Label>
            <Label x={xd + 110} y={112} kind="label" anchor="start">thousandths</Label>
            <Line x1={xd - 110} y1={126} x2={xd + 90} y2={126} tone="bright" />
            <Num s="31.123" xDot={xd} y={158} o={a(2.6)} fade={sweep > 0.5 ? 1 : 99} />
            <Line x1={cut} y1={22} x2={cut} y2={22 + 144 * sweep} tone="bright" dashed />
            <Label x={cut} y={13} kind="label">least precise: tenths</Label>
            <Label x={xd - 190} y={158} kind="label" anchor="start">{sweep > 0.5 ? 'rounded:' : 'sum:'}</Label>
            <g opacity={a(6.2)}>
              <Num s="31.1" xDot={xd} y={206} />
              <Label x={xd + 110} y={206} kind="label" anchor="start">1 decimal place</Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ dimensions balance

export function Balance() {
  return (
    <Anim title="A balance weighs the dimensions of both sides of a formula: for s = u t + ½ a t² both sides are a length and it stays level; for the wrong formula s = u + a t the right side is a speed and the beam tips" height={235} loop={10}>
      {(t) => {
        const wrong = t >= 5;
        const u = t % 5;
        const target = wrong ? 0.2 : 0;
        const th = target * (1 - Math.exp(-1.6 * u)) + (wrong ? -0.04 : 0) * Math.exp(-1.6 * u) + 0.05 * Math.exp(-1.2 * u) * Math.sin(7 * u) * (wrong ? 1 : -1) - (wrong ? 0 : 0);
        const px = 320, py = 92, L = 170;
        const ex = L * Math.cos(th), ey = L * Math.sin(th);
        const chips: { x: number; y: number; text: string }[] = [
          { x: px - ex, y: py - ey + 22, text: 'L' },
          { x: px + ex, y: py + ey + 22, text: wrong ? 'L T⁻¹' : 'L + L' },
        ];
        return (
          <g>
            <Label x={W / 2} y={22} kind="sym">{wrong ? 's = u + a t' : 's = u t + ½ a t²'}</Label>
            <path className="fig-cliff" d={`M${px} ${py}L${px - 22} ${py + 62}L${px + 22} ${py + 62}Z`} />
            <Line x1={px - ex} y1={py - ey} x2={px + ex} y2={py + ey} tone="bright" />
            <Ball x={px} y={py} r={4} glow={false} />
            {chips.map((c, i) => (
              <g key={i}>
                <Line x1={c.x} y1={c.y - 22} x2={c.x} y2={c.y - 14} tone="soft" />
                <rect className="kit-block" x={c.x - 52} y={c.y - 14} width={104} height={34} rx={4} />
                <text className="fig-label" x={c.x} y={c.y + 9} textAnchor="middle">{c.text}</text>
              </g>
            ))}
            <Line x1={px - 110} y1={py + 62} x2={px + 110} y2={py + 62} tone="soft" />
            <Label x={W / 2} y={212} kind="label">{wrong ? 'length on the left, speed on the right: wrong' : 'length on both sides: dimensions agree'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ solving for exponents

export function Solve({ mode = 'pendulum' }: { mode?: 'pendulum' | 'rope' }) {
  const pend = mode === 'pendulum';
  return (
    <Anim
      title={pend ? 'Finding the exponents in T equals k L to the a g to the c: as c slides to minus one half, the mass and length rows stay balanced and the time row climbs to match its target' : 'Finding the exponents in v equals k F to the a mu to the b: as a slides to one half and b to minus one half, the mass, length and time rows each reach their target'}
      height={235}
      loop={10}
    >
      {(t) => {
        const p = ease(phase(t, 0.8, 6.5));
        const x0 = 360, k = 130;
        // pendulum: c slides 0 -> -1/2 and a = -c;  rope: a slides 0 -> 1/2 and b = -a
        const e1 = 0.5 * p; // a
        const e2 = -0.5 * p; // c (pendulum) or b (rope)
        const rows = pend
          ? [
              { name: 'M', parts: [0], target: 0 },
              { name: 'L', parts: [e1, e2], target: 0 },
              { name: 'T', parts: [-2 * e2], target: 1 },
            ]
          : [
              { name: 'M', parts: [e1, e2], target: 0 },
              { name: 'L', parts: [e1, -e2], target: 1 },
              { name: 'T', parts: [-2 * e1], target: -1 },
            ];
        const ok = p > 0.99;
        return (
          <g>
            <Label x={W / 2} y={24} kind="val">{pend ? `a = ${e1.toFixed(2)}   b = 0   c = ${e2.toFixed(2)}` : `a = ${e1.toFixed(2)}   b = ${e2.toFixed(2)}`}</Label>
            {rows.map((r, ri) => {
              const y = 78 + ri * 50;
              let acc = 0;
              return (
                <g key={r.name}>
                  <Label x={206} y={y + 6} kind="sym" anchor="end">{r.name}</Label>
                  <Line x1={x0 - 140} y1={y} x2={x0 + 150} y2={y} tone="soft" />
                  <Line x1={x0 + k * r.target} y1={y - 20} x2={x0 + k * r.target} y2={y + 20} tone="bright" dashed />
                  {r.parts.map((v, i) => {
                    const from = x0 + k * acc;
                    acc += v;
                    const to = x0 + k * acc;
                    return rect(Math.min(from, to), y - 9, Math.abs(to - from), 18, i, i ? 0.4 : 0.8);
                  })}
                  <Ball x={x0 + k * acc} y={y} r={5} glow={false} />
                  <Label x={x0 + 160} y={y + 6} kind="val" anchor="start">{Math.abs(acc - r.target) < 0.015 ? 'balanced' : 'not yet'}</Label>
                </g>
              );
            })}
            <Label x={W / 2} y={228} kind="label">{ok ? (pend ? 'a = ½, c = −½: T ∝ √(L/g)' : 'a = ½, b = −½: v ∝ √(F/μ)') : 'sliding the exponents until every row balances'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ orders of magnitude

export function Scales() {
  const items: { e: number; name: string }[] = [
    { e: -15, name: 'proton' },
    { e: -10, name: 'atom' },
    { e: -5, name: 'cell' },
    { e: 0, name: 'person' },
    { e: 7, name: 'Earth' },
    { e: 11, name: 'orbit' },
    { e: 21, name: 'galaxy' },
  ];
  return (
    <Anim title="A scale from the proton to a galaxy where each tick is a factor of ten in size: a marker sweeps along and lights up the proton, atom, cell, person, Earth, Earth's orbit and a galaxy" height={205} loop={11}>
      {(t) => {
        const ax = 120, X = (e: number) => 40 + ((e + 15) / 36) * 560;
        const e = -15 + 36 * ease(phase(t, 0.4, 9.2));
        const mx = X(e);
        return (
          <g>
            <Line x1={30} y1={ax - 20} x2={610} y2={ax - 20} tone="soft" />
            {Array.from({ length: 37 }, (_, i) => (
              <Line key={i} x1={X(i - 15)} y1={ax - 20 - (i % 5 === 0 ? 7 : 4)} x2={X(i - 15)} y2={ax - 20 + (i % 5 === 0 ? 7 : 4)} tone="soft" />
            ))}
            {items.map((it, i) => {
              const above = i % 2 === 0;
              const on = e >= it.e - 0.2;
              const x = X(it.e);
              const o = on ? 1 : 0.35;
              return (
                <g key={it.name} opacity={o}>
                  <Line x1={x} y1={ax - 20} x2={x} y2={above ? ax - 46 : ax + 6} tone="bright" />
                  <Label x={x} y={above ? ax - 76 : ax + 30} kind="label">{it.name}</Label>
                  <Label x={x} y={above ? ax - 54 : ax + 52} kind="val">{`${pw(it.e)} m`}</Label>
                </g>
              );
            })}
            <Ball x={mx} y={ax - 20} r={6} />
            <Label x={W / 2} y={188} kind="val">{`size ≈ ${pw(Math.round(e))} m`}</Label>
            <Label x={W / 2} y={18} kind="label">every tick is a factor of ten</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ a Fermi estimate

export function Fermi() {
  const steps = ['70 per min', '× 60 min', '× 24 h', '× 365 d', '× 80 yr'];
  const totals = ['70', '4.2×10³', '1.0×10⁵', '3.7×10⁷', '2.9×10⁹'];
  return (
    <Anim title="Estimating the heartbeats in a lifetime: a pulsing heart, then factors multiplied one by one, with the running total, giving about three times ten to the nine" height={245} loop={12}>
      {(t) => {
        const beat = Math.max(0, Math.sin(TAU * t * 1.2)) ** 2;
        return (
          <g>
            <Ball x={60} y={46} r={10 + 6 * beat} />
            <Label x={90} y={52} kind="label" anchor="start">a heart beats about 70 times a minute</Label>
            {steps.map((s, i) => {
              const a = ease(phase(t, 1.2 + i * 1.5, 2 + i * 1.5));
              const x = 20 + i * 122;
              return (
                <g key={s} opacity={a}>
                  <rect className="kit-block" x={x} y={96} width={108} height={36} rx={4} />
                  <text className="fig-label" x={x + 54} y={120} textAnchor="middle">{s}</text>
                  <Label x={x + 54} y={160} kind="val">{totals[i]}</Label>
                  {i > 0 && <Arrow x1={x - 12} y1={114} x2={x - 2} y2={114} tone="soft" />}
                </g>
              );
            })}
            <g opacity={ease(phase(t, 9.4, 10.2))}>
              <Label x={W / 2} y={208} kind="sym">≈ 3 × 10⁹ beats</Label>
              <Label x={W / 2} y={234} kind="label">the order of magnitude is 10⁹</Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ for the mistakes

export function AreaScale() {
  return (
    <Anim title="A square one kilometre on a side is a thousand metres by a thousand metres, so its area is a million square metres; the grid of small squares fills in" height={185} loop={9}>
      {(t) => {
        const n = 1 + Math.floor(ease(phase(t, 0.3, 6)) * 11.99);
        const S = 120, x0 = 70, y0 = 36;
        const lines: ReturnType<typeof Line>[] = [];
        for (let i = 1; i < n; i++) {
          lines.push(<Line key={`v${i}`} x1={x0 + (S * i) / n} y1={y0} x2={x0 + (S * i) / n} y2={y0 + S} tone="soft" />);
          lines.push(<Line key={`h${i}`} x1={x0} y1={y0 + (S * i) / n} x2={x0 + S} y2={y0 + (S * i) / n} tone="soft" />);
        }
        return (
          <g>
            <rect className="kit-block" x={x0} y={y0} width={S} height={S} />
            {lines}
            <Label x={x0 + S / 2} y={y0 + S + 22} kind="val">{`${n} × ${n} = ${n * n} cells`}</Label>
            <Label x={250} y={62} kind="label" anchor="start">1 km = 10³ m</Label>
            <Label x={250} y={92} kind="label" anchor="start" >{t > 4 ? '1 km² = 10³ × 10³ m²' : '1 km² = (10³ m)²'}</Label>
            <g opacity={ease(phase(t, 5.5, 6.5))}>
              <Label x={250} y={122} kind="sym" anchor="start">= 10⁶ m²</Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

export function TwoNm() {
  return (
    <Anim title="A force turning a lever and a force lifting a weight both have the unit newton metre, yet one is a torque and the other is energy" height={205} loop={6}>
      {(t) => {
        const q = 0.5 - 0.5 * Math.cos((TAU * t) / 6);
        const a = 0.5 * q;
        const px = 110, py = 55, L = 100;
        const ex = px + L * Math.cos(a), ey = py + L * Math.sin(a);
        const h = 56 * q;
        const gx = 440, gy = 134;
        const by = gy - 16 - h;
        return (
          <g>
            <Ball x={px} y={py} r={5} />
            <Line x1={px} y1={py} x2={ex} y2={ey} tone="bright" />
            <Arrow x1={ex} y1={ey - 4} x2={ex} y2={ey + 40} label="F" />
            <Label x={px} y={176} kind="label">torque</Label>
            <Label x={px} y={196} kind="val">N·m</Label>
            <Ground y={gy} x1={gx - 70} x2={gx + 70} />
            <Block x={gx} y={by} w={44} h={32} />
            <Arrow x1={gx + 44} y1={by + 14} x2={gx + 44} y2={by - 26} tone="soft" label="F" />
            <Line x1={gx - 44} y1={gy} x2={gx - 44} y2={by + 16} tone="soft" dashed />
            <Label x={gx} y={176} kind="label">energy</Label>
            <Label x={gx} y={196} kind="val">N·m</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function DimsMiss() {
  return (
    <Anim title="Two formulas for kinetic energy have the same dimensions but differ by a factor of two: as the speed changes the bar for m v squared is always twice the true energy" height={195} loop={8}>
      {(t) => {
        const m = 2;
        const v = 4 * (0.5 - 0.5 * Math.cos((TAU * t) / 8));
        const wrongE = m * v * v, rightE = 0.5 * m * v * v;
        const base = 160, sc = 2.2;
        return (
          <g>
            <Label x={320} y={20} kind="val">{`m = 2 kg   v = ${v.toFixed(1)} m/s`}</Label>
            <Line x1={80} y1={base} x2={560} y2={base} tone="soft" />
            {rect(120, base - wrongE * sc, 70, Math.max(0.1, wrongE * sc), 'w', 0.4)}
            {rect(380, base - rightE * sc, 70, Math.max(0.1, rightE * sc), 'r', 0.9)}
            <Label x={155} y={base + 20} kind="val">m v²</Label>
            <Label x={415} y={base + 20} kind="val">½ m v²</Label>
            <Label x={155} y={base - wrongE * sc - 8} kind="val">{`${wrongE.toFixed(1)} J`}</Label>
            <Label x={415} y={base - rightE * sc - 8} kind="val">{`${rightE.toFixed(1)} J`}</Label>
            <Label x={320} y={46} kind="label">both have dimensions M L² T⁻²</Label>
          </g>
        );
      }}
    </Anim>
  );
}
