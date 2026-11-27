import { Anim, Arrow, Axes, Ball, Label, Line, Readout, Trail, clamp, ease, lerp, phase } from '../kit/Anim';

/** Animated diagrams for the thermodynamics chapter. Positions come from the real physics. */

const GAM = 1.4;

// ------------------------------------------------------------------ helpers

const tri = (x: number) => {
  const m = ((x % 2) + 2) % 2;
  return m <= 1 ? m : 2 - m;
};
/** Integral of f from 0 to t, so dots speed up smoothly when the gas warms. */
const integ = (f: (s: number) => number, t: number, step = 0.1) => {
  let s = 0;
  for (let u = 0; u < t; u += step) {
    const d = Math.min(step, t - u);
    s += f(u + d / 2) * d;
  }
  return s;
};
const DOTS = Array.from({ length: 18 }, (_, i) => ({
  sx: (i * 0.618) % 2,
  sy: (i * 0.382 + 0.3) % 2,
  vx: 0.7 + (((i * 7) % 11) / 11) * 0.9,
  vy: 0.6 + (((i * 5) % 9) / 9) * 0.9,
}));

/** Subscripted symbol inside SVG text: Q with a small h, and so on. */
const Sub = ({ b, s }: { b: string; s: string }) => (
  <>
    {b}
    <tspan dy={3} fontSize={11}>
      {s}
    </tspan>
    <tspan dy={-3}>{'​'}</tspan>
  </>
);

/**
 * A cylinder with a piston and gas. cx, yb are the middle of the base and its y; h is the gas height in px.
 * ph is the dots' clock (grows faster when the gas is hotter); hot (0 to 1) brightens the gas.
 */
function Cyl({ cx, yb, w = 110, H = 150, h, ph, hot = 0, n = 16, fixed }: { cx: number; yb: number; w?: number; H?: number; h: number; ph: number; hot?: number; n?: number; fixed?: boolean }) {
  const l = cx - w / 2;
  const r = cx + w / 2;
  const top = yb - h;
  return (
    <g>
      <rect x={l} y={top} width={w} height={h} fill="#fff" fillOpacity={0.03 + 0.13 * clamp(hot)} />
      <Trail
        points={[
          [l, yb - H - 12],
          [l, yb],
          [r, yb],
          [r, yb - H - 12],
        ]}
      />
      {DOTS.slice(0, n).map((d, i) => (
        <circle key={i} cx={l + 5 + tri(d.sx + d.vx * ph) * (w - 10)} cy={yb - 5 - tri(d.sy + d.vy * ph) * Math.max(0, h - 10)} r={2.7} fill="#fff" fillOpacity={0.92} />
      ))}
      <rect className="kit-block is-filled" x={l + 2} y={top - 10} width={w - 4} height={10} rx={2} />
      <line className="fig-path" x1={cx} y1={top - 10} x2={cx} y2={yb - H - 34} />
      <line className="fig-path" x1={cx - 16} y1={yb - H - 34} x2={cx + 16} y2={yb - H - 34} />
      {fixed && (
        <g>
          <line className="fig-path" x1={l} y1={top - 10} x2={l - 8} y2={top - 10} />
          <line className="fig-path" x1={r} y1={top - 10} x2={r + 8} y2={top - 10} />
        </g>
      )}
    </g>
  );
}

/** Pixel mapping for a small p-V diagram. */
function pv(x: number, y: number, w: number, h: number, vmax: number, pmax: number) {
  return { X: (v: number) => x + (v / vmax) * w, Y: (p: number) => y - (p / pmax) * h };
}
type Map = ReturnType<typeof pv>;
const sample = (f: (u: number) => { V: number; p: number }, m: Map, u1 = 1, n = 40): [number, number][] => Array.from({ length: n + 1 }, (_, i) => f((i / n) * u1)).map((s) => [m.X(s.V), m.Y(s.p)]);
/** Shade the area under a path down to the baseline y0. */
function Under({ pts, y0, op = 0.17 }: { pts: [number, number][]; y0: number; op?: number }) {
  if (pts.length < 2) return null;
  const d = `M${pts[0][0]} ${y0}` + pts.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join('') + `L${pts[pts.length - 1][0]} ${y0}Z`;
  return <path d={d} fill="#fff" fillOpacity={op} />;
}

/** A thick arrow for energy flows; width w px; p (0 to 1) grows it from its tail. */
function Fat({ x1, y1, x2, y2, w, p = 1, op = 0.88 }: { x1: number; y1: number; x2: number; y2: number; w: number; p?: number; op?: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1) * clamp(p);
  if (len < 2) return null;
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const hl = Math.min(len, w * 0.9 + 8);
  const hw = w * 0.5 + 7;
  return (
    <g transform={`translate(${x1} ${y1}) rotate(${ang})`} fill="#fff" fillOpacity={op}>
      <rect x={0} y={-w / 2} width={Math.max(0, len - hl)} height={w} />
      <path d={`M${len - hl} ${-hw}L${len} 0L${len - hl} ${hw}Z`} />
    </g>
  );
}

/** A tank of material at temperature T (brightness shows it). */
function Tank({ x, y, w, h, T, lo = 290, hi = 350, jig = 0 }: { x: number; y: number; w: number; h: number; T: number; lo?: number; hi?: number; jig?: number }) {
  const op = 0.06 + 0.5 * clamp((T - lo) / (hi - lo));
  return (
    <g>
      <rect className="kit-block" x={x - w / 2} y={y - h / 2} width={w} height={h} rx={3} />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={3} fill="#fff" fillOpacity={op} />
      {jig > 0 &&
        DOTS.slice(0, 8).map((d, i) => (
          <circle key={i} cx={x - w / 2 + 12 + ((i % 4) * (w - 24)) / 3 + Math.sin(jig * d.vx * 5 + d.sx * 3) * 4} cy={y - h / 2 + 18 + Math.floor(i / 4) * (h - 36) + Math.cos(jig * d.vy * 5 + d.sy * 3) * 4} r={2.2} fill="#fff" fillOpacity={0.9} />
        ))}
    </g>
  );
}

const fillRect = (x: number, y: number, w: number, h: number, op = 0.9) => <rect x={x} y={y} width={Math.max(0, w)} height={Math.max(0, h)} fill="#fff" fillOpacity={op} />;

// ------------------------------------------------------------------ 1. system, surroundings, state

export function SystemScene() {
  return (
    <Anim title="A gas in a cylinder is the system; heat crosses the dashed boundary in and work leaves through the piston" height={250} loop={9}>
      {(t) => {
        const sp = (s: number) => 1 + 0.9 * ease(phase(s, 1.5, 3.5));
        const ph = integ(sp, t) * 0.9;
        const h = 70 + 32 * ease(phase(t, 4.5, 7));
        const qin = ease(phase(t, 1, 2));
        const wout = ease(phase(t, 4.5, 5.5));
        return (
          <g>
            <rect className="fig-guide fig-dash" x={80} y={26} width={180} height={194} fill="none" rx={6} />
            <Label x={20} y={24} kind="label" anchor="start">
              surroundings
            </Label>
            <Label x={170} y={238}>
              system
            </Label>
            <Cyl cx={170} yb={205} w={120} H={140} h={h} ph={ph} hot={(sp(t) - 1) / 0.9} />
            <g opacity={qin}>
              <Arrow x1={20} y1={160} x2={96} y2={160} label="Q" labelAt="mid" />
            </g>
            <g opacity={wout}>
              <Arrow x1={244} y1={205 - h - 6} x2={316} y2={205 - h - 6} label="W" labelAt="mid" />
            </g>
            <Label x={400} y={50} kind="label" anchor="start">
              state variables
            </Label>
            {(
              [
                ['p', 'pressure'],
                ['V', 'volume'],
                ['T', 'temperature'],
                ['n', 'amount of gas'],
              ] as const
            ).map(([s, d], i) => (
              <g key={s}>
                <Label x={408} y={88 + i * 30} anchor="end">
                  {s}
                </Label>
                <Label x={424} y={88 + i * 30} kind="label" anchor="start">
                  {d}
                </Label>
              </g>
            ))}
            <g opacity={ease(phase(t, 2.8, 3.6))}>
              <Label x={600} y={148} kind="val">
                ↑
              </Label>
            </g>
            <g opacity={ease(phase(t, 5.5, 6.3))}>
              <Label x={600} y={118} kind="val">
                ↑
              </Label>
            </g>
            <Label x={400} y={206} kind="label" anchor="start">
              p · V = n · R · T ties them
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function ZerothScene() {
  return (
    <Anim title="A thermometer touches A and settles, then touches B and shows the same reading, so A and B are in equilibrium" height={230} loop={11}>
      {(t) => {
        const TA = 320;
        const Tc = 300 + 20 * ease(phase(t, 2, 3.6));
        const x = t < 3.8 ? lerp(320, 176, ease(phase(t, 0.5, 1.6))) : lerp(176, 464, ease(phase(t, 4.6, 6)));
        return (
          <g>
            <Tank x={110} y={120} w={90} h={80} T={TA} />
            <Tank x={530} y={120} w={90} h={80} T={TA} />
            <Label x={110} y={176}>
              A
            </Label>
            <Label x={530} y={176}>
              B
            </Label>
            <Label x={110} y={60} kind="val">
              320 K
            </Label>
            <Label x={530} y={60} kind="val">
              320 K
            </Label>
            <rect className="kit-block" x={x - 22} y={92} width={44} height={56} rx={3} />
            <rect x={x - 22} y={92} width={44} height={56} rx={3} fill="#fff" fillOpacity={0.06 + 0.5 * clamp((Tc - 290) / 60)} />
            <Label x={x} y={170}>
              C
            </Label>
            <Label x={x} y={78} kind="val">
              {Tc.toFixed(0)} K
            </Label>
            <g opacity={ease(phase(t, 3.6, 4.2)) * (1 - ease(phase(t, 4.4, 4.8)))}>
              <Label x={320} y={212} kind="label">
                C reads the same as A: A and C are in equilibrium
              </Label>
            </g>
            <g opacity={ease(phase(t, 6.4, 7))}>
              <Label x={320} y={212} kind="label">
                C still reads 320 K at B, so A and B are in equilibrium too
              </Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 2. heat and work both raise U

export function HeatWorkScene() {
  return (
    <Anim title="Adding heat and squeezing the piston both make the gas molecules move faster, raising the internal energy" height={250} loop={8}>
      {(t) => {
        const a = ease(phase(t, 0.5, 2.5));
        const b = ease(phase(t, 3.5, 5.5));
        const sp = (s: number) => 1 + ease(phase(s, 0.5, 2.5)) + ease(phase(s, 3.5, 5.5));
        const ph = integ(sp, t) * 0.9;
        const h = 96 - 40 * b;
        const U = 0.25 + 0.3 * a + 0.3 * b;
        const by = 210;
        return (
          <g>
            <Cyl cx={150} yb={205} w={120} H={140} h={h} ph={ph} hot={(sp(t) - 1) / 2} />
            <g opacity={phase(t, 0.3, 0.8) * (1 - phase(t, 2.6, 3.1))}>
              <Arrow x1={150} y1={246} x2={150} y2={214} label="Q" labelAt="mid" />
            </g>
            <g opacity={phase(t, 3.3, 3.8) * (1 - phase(t, 5.6, 6.1))}>
              <Arrow x1={104} y1={205 - h - 64} x2={104} y2={205 - h - 14} label="W" labelAt="mid" />
            </g>
            <Label x={410} y={34} kind="label">
              internal energy U
            </Label>
            <rect className="fig-cell" x={390} y={50} width={40} height={by - 50} rx={2} />
            {fillRect(390, by - 0.25 * 160, 40, 0.25 * 160, 0.45)}
            {fillRect(390, by - U * 160, 40, (U - 0.25) * 160 * 0 + Math.max(0, U - 0.25) * 160, 0.95)}
            <g opacity={ease(phase(t, 2, 2.8))}>
              <Label x={446} y={by - (0.25 + 0.15) * 160 + 4} kind="label" anchor="start">
                from heat
              </Label>
            </g>
            <g opacity={ease(phase(t, 5, 5.8))}>
              <Label x={446} y={by - (0.55 + 0.15) * 160 + 4} kind="label" anchor="start">
                from work
              </Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 3. work by a gas

/** A gas pushes the piston out at constant pressure p (Pa) from v1 to v2 litres; the shaded area is the work. */
export function ExpandWork({ p, v1, v2, title }: { p: number; v1: number; v2: number; title: string }) {
  return (
    <Anim title={title} height={250} loop={7}>
      {(t) => {
        const u = ease(phase(t, 0.8, 4));
        const V = lerp(v1, v2, u);
        const vmax = v2 * 1.2;
        const pmax = (p / 1000) * 1.4;
        const m = pv(340, 210, 260, 150, vmax, pmax);
        const pk = p / 1000;
        const sp = (s: number) => Math.sqrt(lerp(v1, v2, ease(phase(s, 0.8, 4))) / v1);
        const ph = integ(sp, t) * 0.9;
        const W = (p * (V - v1)) / 1000;
        return (
          <g>
            <Cyl cx={130} yb={210} w={110} H={150} h={(150 * V) / vmax} ph={ph} hot={(sp(t) - 1) * 1.2} />
            <g opacity={ease(phase(t, 0.6, 1.2)) * (1 - ease(phase(t, 4.2, 4.8)))}>
              <Arrow x1={130} y1={246} x2={130} y2={218} label="Q" labelAt="mid" />
            </g>
            <Axes x={340} y={210} w={260} h={150} xLabel="V" yLabel="p" />
            <Under pts={[[m.X(v1), m.Y(pk)], [m.X(V), m.Y(pk)]]} y0={210} op={0.3} />
            <Line x1={m.X(v1)} y1={m.Y(pk)} x2={m.X(v1)} y2={210} dashed />
            <Line x1={m.X(v1)} y1={m.Y(pk)} x2={m.X(V)} y2={m.Y(pk)} tone="bright" />
            <Line x1={340} y1={m.Y(pk)} x2={m.X(v1)} y2={m.Y(pk)} dashed />
            <Line x1={m.X(v2)} y1={m.Y(pk)} x2={m.X(v2)} y2={210} dashed tone="faint" />
            <Ball x={m.X(V)} y={m.Y(pk)} r={5} />
            <Label x={m.X(v1)} y={228} kind="val">
              {v1} L
            </Label>
            <Label x={m.X(v2)} y={228} kind="val">
              {v2} L
            </Label>
            <Label x={334} y={m.Y(pk) + 4} kind="val" anchor="end">
              {pk} kPa
            </Label>
            <Readout>W = {W.toFixed(0)} J</Readout>
            <Label x={m.X((v1 + v2) / 2)} y={m.Y(pk / 2) + 4} kind="label">
              area = W
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 4. first law

export function FirstLawScene({ Q, W, title }: { Q: number; W: number; title: string }) {
  const U = Q - W;
  return (
    <Anim title={title} height={260} loop={8}>
      {(t) => {
        const sc = 400 / Q;
        const x0 = 150;
        return (
          <g>
            <Label x={x0 - 12} y={72} anchor="end">
              Q
            </Label>
            <rect className="fig-cell" x={x0} y={54} width={Q * sc} height={26} rx={2} />
            {fillRect(x0, 54, Q * sc * ease(phase(t, 0.3, 1.6)), 26, 0.95)}
            <g opacity={ease(phase(t, 1.4, 2))}>
              <Label x={x0 + Q * sc + 10} y={72} kind="val" anchor="start">
                {Q} J in
              </Label>
              <Arrow x1={x0 + (W * sc) / 2} y1={92} x2={x0 + (W * sc) / 2} y2={136} />
              <Arrow x1={x0 + W * sc + (U * sc) / 2} y1={92} x2={x0 + W * sc + (U * sc) / 2} y2={136} />
            </g>
            <rect className="fig-cell" x={x0} y={150} width={Q * sc} height={26} rx={2} />
            {fillRect(x0, 150, W * sc * ease(phase(t, 2, 3.2)), 26, 0.4)}
            {fillRect(x0 + W * sc, 150, U * sc * ease(phase(t, 3.2, 4.4)), 26, 0.95)}
            <g opacity={ease(phase(t, 3, 3.8))}>
              <Label x={x0 + (W * sc) / 2} y={198} kind="val">
                W = {W} J
              </Label>
              <Label x={x0 + (W * sc) / 2} y={216} kind="label">
                work out
              </Label>
            </g>
            <g opacity={ease(phase(t, 4.2, 5))}>
              <Label x={x0 + W * sc + (U * sc) / 2} y={198} kind="val">
                ΔU = {U} J
              </Label>
              <Label x={x0 + W * sc + (U * sc) / 2} y={216} kind="label">
                stays in the gas
              </Label>
            </g>
            <Label x={x0 - 12} y={168} anchor="end">
              Q
            </Label>
            <g opacity={ease(phase(t, 5.2, 6))}>
              <Label x={320} y={246} kind="val">
                ΔU = Q − W = {Q} − {W} = {U} J
              </Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 5. four processes

const KINDS = [
  { name: 'isobaric', note: 'pressure constant', signs: 'Q > 0   W > 0   ΔU > 0', f: (u: number) => ({ V: 1 + 1.2 * u, p: 2 }) },
  { name: 'isochoric', note: 'volume constant', signs: 'Q < 0   W = 0   ΔU < 0', f: (u: number) => ({ V: 1, p: 2 - u }) },
  { name: 'isothermal', note: 'temperature constant', signs: 'Q > 0   W > 0   ΔU = 0', f: (u: number) => ({ V: 1 + 1.2 * u, p: 2 / (1 + 1.2 * u) }) },
  { name: 'adiabatic', note: 'no heat flows', signs: 'Q = 0   W > 0   ΔU < 0', f: (u: number) => ({ V: 1 + 1.2 * u, p: 2 / Math.pow(1 + 1.2 * u, GAM) }) },
];

export function ProcessesScene() {
  return (
    <Anim title="The four basic processes in turn: the piston moves and the point travels along a different path on the p-V diagram" height={280} loop={16}>
      {(t) => {
        const st = (s: number) => {
          const k = Math.min(3, Math.floor(s / 4));
          const u = ease(phase(s - 4 * k, 0.4, 3.2));
          return { k, u, ...KINDS[k].f(u) };
        };
        const cur = st(t);
        const T = (cur.V * cur.p) / 2;
        const ph = integ((s) => {
          const q = st(s);
          return Math.sqrt((q.V * q.p) / 2);
        }, t) * 0.9;
        const m = pv(320, 232, 290, 175, 3.1, 3.3);
        const k = KINDS[cur.k];
        const trace = sample(k.f, m, cur.u, 30);
        return (
          <g>
            <Cyl cx={110} yb={232} w={100} H={150} h={(150 * cur.V) / 2.6} ph={ph} hot={(T - 0.4) / 1.1} n={14} />
            <Axes x={320} y={232} w={290} h={175} xLabel="V" yLabel="p" />
            {KINDS.map((q) => (
              <Trail key={q.name} points={sample(q.f, m)} tone="faint" />
            ))}
            <Under pts={trace} y0={232} />
            <Trail points={trace} />
            <Ball x={m.X(cur.V)} y={m.Y(cur.p)} r={5} />
            <Label x={m.X(1)} y={m.Y(2) - 12}>
              A
            </Label>
            <Label x={m.X(2.2) + 6} y={m.Y(2) + 4} kind="label" anchor="start">
              isobaric
            </Label>
            <Label x={m.X(1) - 8} y={m.Y(1) + 4} kind="label" anchor="end">
              isochoric
            </Label>
            <Label x={m.X(2.2) + 6} y={m.Y(0.909) - 6} kind="label" anchor="start">
              isothermal
            </Label>
            <Label x={m.X(2.2) + 6} y={m.Y(0.66) + 14} kind="label" anchor="start">
              adiabatic
            </Label>
            <Label x={320} y={20} kind="label" anchor="start">
              {k.name}: {k.note}
            </Label>
            <Label x={320} y={42} kind="val" anchor="start">
              {k.signs}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 6. isothermal vs adiabatic

export function IsoAdiaScene() {
  return (
    <Anim title="Starting from the same point, the adiabatic curve falls faster than the isothermal one, and the gas cools along it" height={270} loop={9}>
      {(t) => {
        const m = pv(70, 232, 330, 190, 3, 3.3);
        const iso = (u: number) => ({ V: 1 + 1.6 * u, p: 2 / (1 + 1.6 * u) });
        const ad = (u: number) => ({ V: 1 + 1.6 * u, p: 2 / Math.pow(1 + 1.6 * u, GAM) });
        const u = ease(phase(t, 1.2, 5));
        const a = iso(u);
        const b = ad(u);
        const tan = (s: number) => [m.X(0.7), m.Y(2 - s * -0.3), m.X(1.3), m.Y(2 - s * 0.3)] as const;
        const t1 = tan(2);
        const t2 = tan(2.8);
        return (
          <g>
            <Axes x={70} y={232} w={330} h={190} xLabel="V" yLabel="p" />
            <Trail points={sample(iso, m)} tone="faint" />
            <Trail points={sample(ad, m)} tone="faint" />
            <Under pts={sample(iso, m, u)} y0={232} op={0.14} />
            <Under pts={sample(ad, m, u)} y0={232} op={0.2} />
            <Trail points={sample(iso, m, u)} />
            <Trail points={sample(ad, m, u)} dashed />
            <g opacity={ease(phase(t, 0, 0.8)) * (1 - ease(phase(t, 1.2, 2)))}>
              <Line x1={t1[0]} y1={t1[1]} x2={t1[2]} y2={t1[3]} tone="bright" />
              <Line x1={t2[0]} y1={t2[1]} x2={t2[2]} y2={t2[3]} tone="bright" dashed />
              <Label x={m.X(1.38)} y={m.Y(2 - 0.6) - 4} kind="label" anchor="start">
                steeper slope
              </Label>
            </g>
            <Ball x={m.X(a.V)} y={m.Y(a.p)} r={5} />
            <Ball x={m.X(b.V)} y={m.Y(b.p)} r={5} />
            <Label x={m.X(1)} y={m.Y(2) - 12}>
              A
            </Label>
            <Label x={440} y={70} kind="label" anchor="start">
              isothermal  p · V = constant
            </Label>
            <Label x={440} y={94} kind="val" anchor="start">
              T = {((a.V * a.p) / 2).toFixed(2)} × T₁
            </Label>
            <Label x={440} y={140} kind="label" anchor="start">
              adiabatic  p · V ^γ = constant
            </Label>
            <Label x={440} y={164} kind="val" anchor="start">
              T = {((b.V * b.p) / 2).toFixed(2)} × T₁
            </Label>
            <Label x={440} y={214} kind="label" anchor="start">
              same expansion, less work
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 7. Cp and Cv

export function CpCvScene() {
  const R = 8.314;
  const Q = 100;
  const dv = Q / (1.5 * R);
  const dp = Q / (2.5 * R);
  return (
    <Anim title="The same heat warms a gas held at constant volume more than a gas that is free to expand" height={260} loop={9}>
      {(t) => {
        const p = ease(phase(t, 0.6, 4));
        const ph1 = integ((s) => 1 + 0.9 * ease(phase(s, 0.6, 4)), t) * 0.9;
        const ph2 = integ((s) => 1 + 0.54 * ease(phase(s, 0.6, 4)), t) * 0.9;
        const hh = 100;
        return (
          <g>
            <Label x={105} y={22} kind="label">
              volume fixed
            </Label>
            <Label x={295} y={22} kind="label">
              pressure fixed
            </Label>
            <Cyl cx={105} yb={205} w={100} H={130} h={hh} ph={ph1} hot={0.9 * p} fixed />
            <Cyl cx={295} yb={205} w={100} H={130} h={hh + 32 * p} ph={ph2} hot={0.54 * p} />
            {[105, 295].map((x) => (
              <g key={x} opacity={phase(t, 0.4, 0.9) * (1 - phase(t, 4.2, 4.7))}>
                <Arrow x1={x} y1={246} x2={x} y2={214} label="Q" labelAt="mid" />
              </g>
            ))}
            <g opacity={ease(phase(t, 1.5, 2.3))}>
              <Arrow x1={365} y1={205 - hh - 40} x2={365} y2={205 - hh - 70} />
              <Label x={385} y={205 - hh - 50} kind="label" anchor="start">
                W
              </Label>
            </g>
            <Label x={470} y={34} kind="label">
              warming, same Q
            </Label>
            <rect className="fig-cell" x={440} y={52} width={26} height={150} rx={2} />
            <rect className="fig-cell" x={510} y={52} width={26} height={150} rx={2} />
            {fillRect(440, 202 - 150 * (dv / 9) * p, 26, 150 * (dv / 9) * p)}
            {fillRect(510, 202 - 150 * (dp / 9) * p, 26, 150 * (dp / 9) * p)}
            <Label x={453} y={222} kind="val">
              {(dv * p).toFixed(1)} K
            </Label>
            <Label x={523} y={222} kind="val">
              {(dp * p).toFixed(1)} K
            </Label>
            <Label x={453} y={242} kind="sym">
              Cv
            </Label>
            <Label x={523} y={242} kind="sym">
              Cp
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 8. cycles

/** A rectangular cycle on the p-V diagram, clockwise; the enclosed area is the net work. */
export function CycleScene({ compact, title }: { compact?: boolean; title: string }) {
  const pts = [
    { V: 1, p: 3 },
    { V: 2.4, p: 3 },
    { V: 2.4, p: 1.2 },
    { V: 1, p: 1.2 },
  ];
  const at = (s: number) => {
    const k = Math.min(3, Math.floor(s));
    const a = pts[k];
    const b = pts[(k + 1) % 4];
    const u = s - k;
    return { V: lerp(a.V, b.V, u), p: lerp(a.p, b.p, u) };
  };
  const H = compact ? 190 : 270;
  return (
    <Anim title={title} height={H} loop={13}>
      {(t) => {
        const s = 4 * ease(phase(t, 0.5, 9));
        const cur = at(s);
        const x0 = compact ? 150 : 340;
        const y0 = compact ? 160 : 220;
        const m = pv(x0, y0, compact ? 300 : 260, compact ? 125 : 160, 3, 3.6);
        const path: [number, number][] = [[m.X(1), m.Y(3)]];
        for (let k = 0; k < 4; k++) if (s >= k + 1) path.push([m.X(pts[(k + 1) % 4].V), m.Y(pts[(k + 1) % 4].p)]);
        path.push([m.X(cur.V), m.Y(cur.p)]);
        const fill = ease(phase(t, 9.2, 10.2));
        const ph = integ((q) => Math.sqrt((at(4 * ease(phase(q, 0.5, 9))).V * at(4 * ease(phase(q, 0.5, 9))).p) / 3), t) * 0.9;
        return (
          <g>
            {!compact && <Cyl cx={120} yb={220} w={110} H={150} h={(150 * cur.V) / 3} ph={ph} hot={(cur.V * cur.p) / 7} />}
            <Axes x={x0} y={y0} w={compact ? 300 : 260} h={compact ? 125 : 160} xLabel="V" yLabel="p" />
            <Trail points={path} />
            <g opacity={fill}>
              <path d={`M${m.X(1)} ${m.Y(3)}L${m.X(2.4)} ${m.Y(3)}L${m.X(2.4)} ${m.Y(1.2)}L${m.X(1)} ${m.Y(1.2)}Z`} fill="#fff" fillOpacity={0.24} />
              <Label x={m.X(1.7)} y={m.Y(2.1) + 4} kind="label">
                net work = area
              </Label>
            </g>
            <Ball x={m.X(cur.V)} y={m.Y(cur.p)} r={5} />
            <Label x={m.X(1) - 12} y={m.Y(3) + 4}>
              A
            </Label>
            <Label x={m.X(2.4) + 12} y={m.Y(3) + 4}>
              B
            </Label>
            <Label x={m.X(2.4) + 12} y={m.Y(1.2) + 4}>
              C
            </Label>
            <Label x={m.X(1) - 12} y={m.Y(1.2) + 4}>
              D
            </Label>
            <g opacity={ease(phase(t, 10, 11))}>
              <Readout>after one cycle ΔU = 0</Readout>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ energy flow diagrams (engine, fridge)

interface FlowProps {
  kind: 'engine' | 'fridge';
  Qh: number;
  Qc: number;
  W: number;
  Th: string;
  Tc: string;
  result?: string;
  /** Qc = 0 engine that would break the second law. */
  impossible?: boolean;
  title: string;
}

export function FlowScene({ kind, Qh, Qc, W, Th, Tc, result, impossible, title }: FlowProps) {
  const sc = 26 / Math.max(Qh, 1);
  const engine = kind === 'engine';
  const wH = Qh * sc;
  const wC = Qc * sc;
  const wW = W * sc;
  const cx = 320;
  return (
    <Anim title={title} height={272} loop={9}>
      {(t) => {
        const a = ease(phase(t, 0.3, 1.4));
        const b = ease(phase(t, 1.6, 2.7));
        const c = ease(phase(t, 2.9, 4));
        const lab = (x: number, y: number, sym: string, sub: string, val: string, anchor: 'start' | 'middle' | 'end' = 'start') => (
          <text className="fig-sym" x={x} y={y} textAnchor={anchor}>
            <Sub b={sym} s={sub} />
            <tspan className="fig-val">{' = ' + val}</tspan>
          </text>
        );
        const cross = impossible ? ease(phase(t, 4.2, 5)) : 0;
        return (
          <g>
            {/* reservoirs */}
            <rect className="kit-block" x={170} y={12} width={300} height={24} rx={3} />
            <rect x={170} y={12} width={300} height={24} rx={3} fill="#fff" fillOpacity={engine ? 0.3 : 0.12} />
            <Label x={cx} y={29} kind="label">
              {engine ? 'hot reservoir' : 'hot room'}, T<tspan dy={3} fontSize={10}>h</tspan>
              <tspan dy={-3}> = {Th}</tspan>
            </Label>
            <rect className="kit-block" x={170} y={236} width={300} height={24} rx={3} />
            <rect x={170} y={236} width={300} height={24} rx={3} fill="#fff" fillOpacity={engine ? 0.06 : 0.04} />
            <Label x={cx} y={253} kind="label">
              {engine ? 'cold reservoir' : 'inside the fridge'}, T<tspan dy={3} fontSize={10}>c</tspan>
              <tspan dy={-3}> = {Tc}</tspan>
            </Label>
            {/* machine */}
            <rect className="kit-block" x={cx - 70} y={104} width={140} height={60} rx={4} />
            <Label x={cx} y={140} kind="label">
              {engine ? 'engine' : 'fridge pump'}
            </Label>
            {engine ? (
              <g>
                <Fat x1={cx} y1={36} x2={cx} y2={104} w={wH} p={a} />
                <Fat x1={cx + 70} y1={134} x2={590} y2={134} w={wW} p={b} />
                {!impossible && <Fat x1={cx} y1={164} x2={cx} y2={236} w={wC} p={c} />}
                <g opacity={a}>{lab(cx + wH / 2 + 12, 76, 'Q', 'h', `${Qh} J`)}</g>
                <g opacity={b}>{lab(cx + 150, 134 - wW / 2 - 10, 'W', '', `${W} J`, 'middle')}</g>
                {!impossible && <g opacity={c}>{lab(cx + wC / 2 + 12, 208, 'Q', 'c', `${Qc} J`)}</g>}
              </g>
            ) : (
              <g>
                <Fat x1={cx} y1={236} x2={cx} y2={164} w={wC} p={a} />
                <Fat x1={50} y1={134} x2={cx - 70} y2={134} w={wW} p={b} />
                <Fat x1={cx} y1={104} x2={cx} y2={36} w={wH} p={c} />
                <g opacity={a}>{lab(cx + wC / 2 + 12, 208, 'Q', 'c', `${Qc} J`)}</g>
                <g opacity={b}>{lab(150, 134 - wW / 2 - 10, 'W', '', `${W} J`, 'middle')}</g>
                <g opacity={c}>{lab(cx + wH / 2 + 12, 76, 'Q', 'h', `${Qh} J`)}</g>
                <g opacity={ease(phase(t, 1, 1.8))}>
                  <Label x={560} y={200} kind="label">
                    uphill
                  </Label>
                  <Arrow x1={560} y1={190} x2={560} y2={150} />
                </g>
              </g>
            )}
            {result && (
              <g opacity={ease(phase(t, 4.4, 5.2))}>
                <text className="fig-val" x={engine ? 20 : 600} y={198} textAnchor={engine ? 'start' : 'end'}>
                  {result}
                </text>
              </g>
            )}
            {impossible && (
              <g opacity={cross}>
                <Line x1={cx - 70} y1={104} x2={cx + 70} y2={164} tone="bright" />
                <Line x1={cx - 70} y1={164} x2={cx + 70} y2={104} tone="bright" />
                <Label x={cx} y={200} kind="label">
                  all heat turned into work: never happens
                </Label>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 9. Carnot

export function CarnotScene() {
  const Th = 3;
  const Tc = 2.25;
  const V1 = 1;
  const V2 = 1.6;
  const r = Math.pow(Th / Tc, 1 / (GAM - 1));
  const V3 = V2 * r;
  const V4 = V1 * r;
  const K1 = Th * Math.pow(V1, GAM - 1);
  const K2 = Th * Math.pow(V2, GAM - 1);
  const strokes = [
    { f: (u: number) => { const V = lerp(V1, V2, u); return { V, p: Th / V }; }, text: 'isothermal expansion at T_h: heat Q_h flows in', base: 'hot' },
    { f: (u: number) => { const V = lerp(V2, V3, u); return { V, p: K2 / Math.pow(V, GAM) }; }, text: 'adiabatic expansion: insulated, the gas cools to T_c', base: 'insulated' },
    { f: (u: number) => { const V = lerp(V3, V4, u); return { V, p: Tc / V }; }, text: 'isothermal compression at T_c: heat Q_c flows out', base: 'cold' },
    { f: (u: number) => { const V = lerp(V4, V1, u); return { V, p: K1 / Math.pow(V, GAM) }; }, text: 'adiabatic compression: insulated, the gas warms to T_h', base: 'insulated' },
  ];
  const vmax = 3.6;
  return (
    <Anim title="A Carnot cycle: two isothermal strokes and two adiabatic strokes, looping round on the p-V diagram while the piston moves" height={300} loop={15}>
      {(t) => {
        const st = (s: number) => {
          const k = Math.min(3, Math.floor(s / 3));
          const u = ease(phase(s - 3 * k, 0.2, 2.8));
          return { k, u, ...strokes[k].f(u) };
        };
        const cur = st(t % 15 < 12 ? t : 11.99);
        const m = pv(300, 225, 310, 170, vmax, 3.4);
        const ph = integ((s) => Math.sqrt((st(Math.min(s, 11.99)).V * st(Math.min(s, 11.99)).p) / 3), t) * 0.9;
        const T = (cur.V * cur.p) / Th;
        const path: [number, number][] = [];
        for (let k = 0; k < cur.k; k++) path.push(...sample(strokes[k].f, m, 1, 24));
        path.push(...sample(strokes[cur.k].f, m, cur.u, 24));
        const s = strokes[cur.k];
        const nodes: [string, { V: number; p: number }, number, number][] = [
          ['1', { V: V1, p: Th / V1 }, -12, -6],
          ['2', { V: V2, p: Th / V2 }, 12, -8],
          ['3', { V: V3, p: Tc / V3 }, 12, -6],
          ['4', { V: V4, p: Tc / V4 }, 10, 16],
        ];
        return (
          <g>
            <Cyl cx={105} yb={225} w={100} H={150} h={(150 * cur.V) / vmax} ph={ph} hot={(T - 0.6) * 2.5} n={14} />
            <rect className="kit-block" x={50} y={250} width={110} height={22} rx={3} />
            <rect x={50} y={250} width={110} height={22} rx={3} fill="#fff" fillOpacity={s.base === 'hot' ? 0.5 : s.base === 'cold' ? 0.08 : 0} />
            <Label x={105} y={266} kind="label">
              {s.base}
            </Label>
            <g opacity={s.base === 'hot' ? 1 : 0}>
              <Arrow x1={105} y1={248} x2={105} y2={230} />
              <Label x={130} y={242} kind="sym">
                Q
              </Label>
            </g>
            <g opacity={s.base === 'cold' ? 1 : 0}>
              <Arrow x1={105} y1={230} x2={105} y2={248} />
              <Label x={130} y={242} kind="sym">
                Q
              </Label>
            </g>
            <Axes x={300} y={225} w={310} h={170} xLabel="V" yLabel="p" />
            {strokes.map((q, i) => (
              <Trail key={i} points={sample(q.f, m)} tone="faint" />
            ))}
            <Under pts={[...path, ...path.slice(0, 1)]} y0={225} op={0} />
            <Trail points={path} />
            <Ball x={m.X(cur.V)} y={m.Y(cur.p)} r={5} />
            {nodes.map(([n, q, dx, dy]) => (
              <Label key={n} x={m.X(q.V) + dx} y={m.Y(q.p) + dy + 6} kind="val">
                {n}
              </Label>
            ))}
            <Label x={m.X(V3) + 14} y={m.Y(Th / V1) - 6} kind="label" anchor="end">
              {cur.k + 1}→{(cur.k + 1) % 4 + 1}
            </Label>
            <Label x={14} y={22} kind="label" anchor="start">
              {s.text.replace('T_h', 'Th').replace('T_c', 'Tc').replace('Q_h', 'Qh').replace('Q_c', 'Qc')}
            </Label>
            <Readout y={44}>T = {(T * 400).toFixed(0)} K</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 11. second law

export function ClausiusScene() {
  return (
    <Anim title="Heat flows from the hot block to the cold block by itself until their temperatures match, never the other way" height={230} loop={9}>
      {(t) => {
        const e = ease(phase(t, 1, 5));
        const Th = lerp(340, 320, e);
        const Tc = lerp(300, 320, e);
        const jig = integ((s) => 1 + 0.5 * (lerp(340, 320, ease(phase(s, 1, 5))) - 300) / 20, t);
        const jig2 = integ((s) => 1 + 0.5 * (lerp(300, 320, ease(phase(s, 1, 5))) - 300) / 20, t);
        return (
          <g>
            <Tank x={250} y={120} w={120} h={90} T={Th} lo={290} hi={350} jig={jig} />
            <Tank x={370} y={120} w={120} h={90} T={Tc} lo={290} hi={350} jig={jig2} />
            <Label x={250} y={186} kind="val">
              {Th.toFixed(0)} K
            </Label>
            <Label x={370} y={186} kind="val">
              {Tc.toFixed(0)} K
            </Label>
            <g opacity={ease(phase(t, 0.4, 1))}>
              <Arrow x1={250} y1={58} x2={250 + 120 * (1 - e) + 2} y2={58} label="Q" labelAt="mid" />
            </g>
            <g opacity={ease(phase(t, 6, 7))}>
              <Arrow x1={370} y1={206} x2={250} y2={206} dashed tone="soft" />
              <Label x={430} y={210} kind="label" anchor="start">
                never by itself
              </Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

export function FreeExpansionScene() {
  return (
    <Anim title="A gas let into an empty half of a box spreads out and never gathers back into one half by itself, so its entropy rises" height={230} loop={9}>
      {(t) => {
        const lift = ease(phase(t, 1.5, 2.3));
        const R = 320 + 170 * ease(phase(t, 2, 3.4));
        const S = 0.35 + 0.65 * ease(phase(t, 2, 3.6));
        const ph = t * 1.4;
        return (
          <g>
            <rect className="fig-cell" x={150} y={40} width={340} height={140} rx={3} />
            {DOTS.map((d, i) => (
              <circle key={i} cx={155 + tri(d.sx + d.vx * ph) * (R - 160)} cy={46 + tri(d.sy + d.vy * ph) * 128} r={2.8} fill="#fff" fillOpacity={0.92} />
            ))}
            <line className="fig-bar" x1={320} y1={40} x2={320} y2={40 + 140 * (1 - lift)} />
            <Label x={235} y={204} kind="label">
              gas
            </Label>
            <Label x={405} y={204} kind="label">
              vacuum
            </Label>
            <Label x={570} y={30} kind="label">
              entropy S
            </Label>
            <rect className="fig-cell" x={558} y={42} width={24} height={138} rx={2} />
            {fillRect(558, 180 - 138 * S, 24, 138 * S)}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ worked examples

/** One mole expands isothermally to twice its volume; the area under the hyperbola is nRT ln 2. */
export function IsoWorkScene() {
  return (
    <Anim title="One mole of gas at 300 kelvin doubles its volume: the p-V curve is a hyperbola and the shaded area is the work" height={250} loop={8}>
      {(t) => {
        const u = ease(phase(t, 0.8, 4.4));
        const V = 1 + u;
        const m = pv(340, 210, 260, 150, 2.4, 1.25);
        const curve = (q: number) => ({ V: 1 + q, p: 1 / (1 + q) });
        const pts = sample(curve, m, u, 40);
        const ph = t * 1.1;
        return (
          <g>
            <Cyl cx={130} yb={210} w={110} H={150} h={(150 * V) / 2.4} ph={ph} hot={0.5} />
            <g opacity={ease(phase(t, 0.6, 1.2)) * (1 - ease(phase(t, 4.6, 5.2)))}>
              <Arrow x1={130} y1={246} x2={130} y2={218} label="Q" labelAt="mid" />
            </g>
            <Axes x={340} y={210} w={260} h={150} xLabel="V" yLabel="p" />
            <Trail points={sample(curve, m)} tone="faint" />
            <Under pts={pts} y0={210} op={0.3} />
            <Trail points={pts} />
            <Ball x={m.X(V)} y={m.Y(1 / V)} r={5} />
            <Line x1={m.X(1)} y1={m.Y(1)} x2={m.X(1)} y2={210} dashed />
            <Line x1={m.X(2)} y1={m.Y(0.5)} x2={m.X(2)} y2={210} dashed tone="faint" />
            <Label x={m.X(1)} y={228} kind="val">
              V₁
            </Label>
            <Label x={m.X(2)} y={228} kind="val">
              2V₁
            </Label>
            <Label x={334} y={m.Y(1) + 4} kind="val" anchor="end">
              p₁
            </Label>
            <Readout>W = {(2494.2 * Math.log(V)).toFixed(0)} J</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Air compressed 16 to 1 adiabatically: the temperature climbs along p V^gamma = constant. */
export function AdiaCompressScene() {
  return (
    <Anim title="Air squeezed to one sixteenth of its volume with no heat flow: the dots speed up and the temperature climbs steeply" height={250} loop={8}>
      {(t) => {
        const u = ease(phase(t, 0.8, 4.4));
        const V = 16 - 15 * u;
        const T = 300 * Math.pow(16 / V, GAM - 1);
        const m = pv(340, 210, 260, 150, 17, 53);
        const curve = (q: number) => {
          const v = 16 - 15 * q;
          return { V: v, p: Math.pow(16 / v, GAM) };
        };
        const ph = integ((s) => Math.sqrt(Math.pow(16 / (16 - 15 * ease(phase(s, 0.8, 4.4))), GAM - 1)), t) * 0.9;
        const pts = sample(curve, m, u, 50);
        return (
          <g>
            <Cyl cx={130} yb={210} w={110} H={150} h={Math.max(12, (150 * V) / 16)} ph={ph} hot={(T - 300) / 609} />
            <g opacity={ease(phase(t, 0.6, 1.2)) * (1 - ease(phase(t, 4.6, 5.2)))}>
              <Arrow x1={104} y1={20} x2={104} y2={60} label="W" labelAt="mid" />
            </g>
            <Axes x={340} y={210} w={260} h={150} xLabel="V" yLabel="p" />
            <Trail points={sample(curve, m)} tone="faint" />
            <Under pts={pts} y0={210} op={0.25} />
            <Trail points={pts} />
            <Ball x={m.X(V)} y={m.Y(Math.pow(16 / V, GAM))} r={5} />
            <Label x={m.X(16)} y={228} kind="val">
              16 V₂
            </Label>
            <Label x={m.X(1)} y={228} kind="val">
              V₂
            </Label>
            <Readout>T = {T.toFixed(0)} K</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ mistakes

/** A small piston: the gas expands or is squeezed; speeds show the temperature; optional heat arrow and notes. */
export function MiniCyl({ title, from, to, s0, s1, heat, work, lines }: { title: string; from: number; to: number; s0: number; s1: number; heat?: 'in' | 'out'; work: 'out' | 'in'; lines: string[] }) {
  return (
    <Anim title={title} height={170} loop={6}>
      {(t) => {
        const u = ease(phase(t, 0.6, 3.4));
        const hgt = lerp(from, to, u);
        const sp = (s: number) => lerp(s0, s1, ease(phase(s, 0.6, 3.4)));
        const ph = integ(sp, t) * 0.9;
        const yb = 140;
        return (
          <g>
            <Cyl cx={150} yb={yb} w={100} H={92} h={hgt} ph={ph} hot={(sp(t) - 0.8) / 1.5} n={12} />
            {heat && (
              <g opacity={ease(phase(t, 0.4, 1))}>
                {heat === 'in' ? <Arrow x1={150} y1={168} x2={150} y2={146} /> : <Arrow x1={150} y1={146} x2={150} y2={168} />}
              </g>
            )}
            <g opacity={ease(phase(t, 0.5, 1.1))}>
              {work === 'out' ? <Arrow x1={226} y1={yb - hgt - 4} x2={226} y2={yb - hgt - 34} label="W" labelAt="mid" /> : <Arrow x1={226} y1={yb - hgt - 34} x2={226} y2={yb - hgt - 4} label="W" labelAt="mid" />}
            </g>
            {lines.map((l, i) => (
              <Label key={i} x={300} y={50 + i * 28} kind="val" anchor="start">
                {l}
              </Label>
            ))}
          </g>
        );
      }}
    </Anim>
  );
}

/** Two routes between the same two states do different amounts of work. */
export function TwoPathsScene() {
  return (
    <Anim title="Two paths between the same two states enclose different areas, so the work and heat differ while the change in internal energy is the same" height={190} loop={9}>
      {(t) => {
        const m = pv(120, 160, 240, 125, 2.4, 2.4);
        const P1: [number, number][] = [[m.X(1), m.Y(1)], [m.X(1), m.Y(2)], [m.X(2), m.Y(2)]];
        const P2: [number, number][] = [[m.X(1), m.Y(1)], [m.X(2), m.Y(1)], [m.X(2), m.Y(2)]];
        const along = (P: [number, number][], u: number): [number, number][] => {
          const s = 2 * u;
          const k = Math.min(1, Math.floor(s));
          const f = s - k;
          const e: [number, number] = [lerp(P[k][0], P[k + 1][0], f), lerp(P[k][1], P[k + 1][1], f)];
          return k === 0 ? [P[0], e] : [P[0], P[1], e];
        };
        const u1 = ease(phase(t, 0.4, 2.2));
        const u2 = ease(phase(t, 4, 5.8));
        const a = along(P1, u1);
        const b = along(P2, u2);
        const pos = t < 3.5 ? a[a.length - 1] : b[b.length - 1];
        return (
          <g>
            <Axes x={120} y={160} w={240} h={125} xLabel="V" yLabel="p" />
            <g opacity={t < 3.5 ? 1 : 0.3}>
              <Under pts={[[m.X(1), m.Y(2)], [m.X(2), m.Y(2)]]} y0={160} op={0.3 * u1} />
              <Trail points={a} />
            </g>
            <g opacity={t < 3.5 ? 0 : 1}>
              <Under pts={[[m.X(1), m.Y(1)], [m.X(2), m.Y(1)]]} y0={160} op={0.3 * u2} />
              <Trail points={b} />
            </g>
            <Ball x={pos[0]} y={pos[1]} r={5} />
            <Label x={m.X(1) - 12} y={m.Y(1) + 4}>
              A
            </Label>
            <Label x={m.X(2) + 12} y={m.Y(2) + 4}>
              B
            </Label>
            <g opacity={ease(phase(t, 2.3, 3))}>
              <Label x={420} y={60} kind="val" anchor="start">
                path 1: W = 2 units
              </Label>
            </g>
            <g opacity={ease(phase(t, 5.9, 6.5))}>
              <Label x={420} y={90} kind="val" anchor="start">
                path 2: W = 1 unit
              </Label>
            </g>
            <g opacity={ease(phase(t, 6.3, 7))}>
              <Label x={420} y={130} kind="label" anchor="start">
                same ΔU, so Q differs too
              </Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

/** Two efficiency bars: the wrong one built from Celsius numbers, the right one from kelvin. */
export function CelsiusBars() {
  return (
    <Anim title="Using Celsius temperatures in the Carnot formula gives 88 percent; the correct kelvin values give 40 percent" height={170} loop={6}>
      {(t) => {
        const a = ease(phase(t, 0.4, 1.8));
        const b = ease(phase(t, 2, 3.4));
        return (
          <g>
            <Label x={150} y={50} anchor="end" kind="label">
              1 − 27/227
            </Label>
            <rect className="fig-cell" x={170} y={34} width={380} height={22} rx={2} />
            {fillRect(170, 34, 380 * 0.881 * a, 22, 0.35)}
            <g opacity={a}>
              <Label x={170 + 380 * 0.881 * a + 8} y={50} kind="val" anchor="start">
                88 %
              </Label>
            </g>
            <Label x={150} y={110} anchor="end" kind="label">
              1 − 300/500
            </Label>
            <rect className="fig-cell" x={170} y={94} width={380} height={22} rx={2} />
            {fillRect(170, 94, 380 * 0.4 * b, 22, 0.95)}
            <g opacity={b}>
              <Label x={170 + 380 * 0.4 * b + 8} y={110} kind="val" anchor="start">
                40 %
              </Label>
            </g>
            <g opacity={ease(phase(t, 3.5, 4.2))}>
              <Label x={360} y={150} kind="label">
                use kelvin: add 273 first
              </Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

