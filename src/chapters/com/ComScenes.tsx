import { Anim, Arrow, Axes, Ball, Block, Ground, Label, Line, Readout, Trail, clamp, ease, lerp, phase } from '../kit/Anim';

/** Animated diagrams for the centre-of-mass chapter. Positions come from the real physics; pixels are only the scale. */

const f2 = (x: number) => x.toFixed(2);

/** The centre-of-mass marker: a bright dot inside a ring. */
export function CM({ x, y, r = 4.5 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle className="fig-ghost" cx={x} cy={y} r={r + 5} />
      <Ball x={x} y={y} r={r} />
    </g>
  );
}

const rad = (m: number) => 6 + 5 * Math.sqrt(m);

// ------------------------------------------------------------------ a dumbbell tumbling in free space
export function Tumble() {
  return (
    <Anim title="A heavy and a light ball joined by a rod tumble through space; the centre of mass moves in a straight line" height={250} loop={6}>
      {(t) => {
        const m1 = 1;
        const m2 = 3;
        const M = m1 + m2;
        const L = 130;
        const X = (tt: number) => 90 + 75 * tt;
        const Y = (_tt?: number) => 115;
        const th = (tt: number) => 2.4 * tt + 0.6;
        const p = (tt: number) => {
          const c = Math.cos(th(tt));
          const s = Math.sin(th(tt));
          return { a: [X(tt) - (m1 / M) * L * c, Y(tt) - (m1 / M) * L * s] as [number, number], b: [X(tt) + (m2 / M) * L * c, Y(tt) + (m2 / M) * L * s] as [number, number] };
        };
        const now = Math.min(t, 5.2);
        const trailB: [number, number][] = [];
        for (let tt = 0; tt <= now; tt += 0.06) trailB.push(p(tt).b);
        const q = p(now);
        return (
          <g>
            <Line x1={90} y1={Y(0)} x2={X(now)} y2={Y(0)} dashed tone="soft" />
            <Trail points={trailB} tone="faint" />
            <Line x1={q.a[0]} y1={q.a[1]} x2={q.b[0]} y2={q.b[1]} tone="bright" />
            <Ball x={q.a[0]} y={q.a[1]} r={rad(m2)} />
            <Ball x={q.b[0]} y={q.b[1]} r={rad(m1)} />
            <CM x={X(now)} y={Y(0)} />
            <Label x={X(now)} y={Y(0) - 22} kind="label">
              CM
            </Label>
            <Label x={16} y={242} kind="label" anchor="start">
              light ball swings wildly, but the CM glides in a straight line
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the seesaw
export function Seesaw({ title, m1 = 2, m2 = 3, d = 5, vary = false }: { title: string; m1?: number; m2?: number; d?: number; vary?: boolean }) {
  return (
    <Anim title={title} height={250} loop={7}>
      {(t) => {
        const sc = 400 / d;
        const x0 = 120;
        const yP = 140;
        const mm2 = vary ? 1 + 3 * (ease(phase(t, 0.6, 2.8)) - ease(phase(t, 4, 6.2))) : m2;
        const mm1 = m1;
        const M = mm1 + mm2;
        const xcm = (mm2 * d) / M;
        const f = vary ? xcm : lerp(d / 2, xcm, ease(phase(t, 2, 4)));
        const net = (mm2 * (d - f) - mm1 * f) / (M * d);
        const phi = clamp(net * 120, -16, 16) * (Math.PI / 180);
        const fx = x0 + f * sc;
        const C = Math.cos(phi);
        const S = Math.sin(phi);
        const at = (x: number, lift: number) => {
          const s = x0 + x * sc - fx;
          return { x: fx + s * C + lift * S, y: yP + s * S - lift * C };
        };
        const e1 = at(-0.5 * (50 / sc), 0);
        const e2 = at(d + 0.5 * (50 / sc), 0);
        const a = at(0, rad(mm1) + 2);
        const b = at(d, rad(mm2) + 2);
        const fade = vary ? 1 : phase(t, 0.2, 1);
        return (
          <g>
            <Ground y={yP + 36} />
            <polygon className="kit-block" points={`${fx - 18},${yP + 36} ${fx + 18},${yP + 36} ${fx},${yP + 3}`} />
            <Line x1={e1.x} y1={e1.y} x2={e2.x} y2={e2.y} tone="bright" />
            <g opacity={fade}>
              <Ball x={a.x} y={a.y} r={rad(mm1)} />
              <Ball x={b.x} y={b.y} r={rad(mm2)} />
              <Label x={a.x} y={a.y - rad(mm1) - 10} kind="val">
                {mm1.toFixed(1)} kg
              </Label>
              <Label x={b.x} y={b.y - rad(mm2) - 10} kind="val">
                {mm2.toFixed(1)} kg
              </Label>
            </g>
            <Label x={x0} y={yP + 62} kind="val">
              x = 0
            </Label>
            <Label x={x0 + d * sc} y={yP + 62} kind="val">
              x = {d} m
            </Label>
            <CM x={x0 + xcm * sc} y={yP + 58} />
            <Label x={x0 + xcm * sc} y={yP + 90} kind="label">
              CM
            </Label>
            <Readout>x_cm = {f2(xcm)} m</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ many particles in a plane
export interface Pt {
  m: number;
  x: number;
  y: number;
}
export function Particles({ title, pts, move = false, sc = 36 }: { title: string; pts: Pt[]; move?: boolean; sc?: number }) {
  return (
    <Anim title={title} height={270} loop={move ? 8 : 7}>
      {(t) => {
        const ox = 200;
        const oy = 240;
        const cur = pts.map((p, i) => (move ? { ...p, x: p.x + 0.7 * Math.cos(1.1 * t + i * 2.1), y: p.y + 0.6 * Math.sin(1.3 * t + i * 1.3) } : p));
        const M = cur.reduce((s, p) => s + p.m, 0);
        const cx = cur.reduce((s, p) => s + p.m * p.x, 0) / M;
        const cy = cur.reduce((s, p) => s + p.m * p.y, 0) / M;
        const showCm = move ? 1 : phase(t, 2.2, 3);
        const proj = move ? 1 : phase(t, 3, 4);
        const px = ox + cx * sc;
        const py = oy - cy * sc;
        return (
          <g>
            <Axes x={ox} y={oy} w={330} h={215} xLabel="x" yLabel="y" />
            {cur.map((p, i) => {
              const a = move ? 1 : phase(t, i * 0.5, i * 0.5 + 0.5);
              const X = ox + p.x * sc;
              const Y = oy - p.y * sc;
              return (
                <g key={i} opacity={a}>
                  <g opacity={showCm}>
                    <Line x1={X} y1={Y} x2={px} y2={py} dashed tone="faint" />
                  </g>
                  <Ball x={X} y={Y} r={rad(p.m)} />
                  <Label x={X + rad(p.m) + 6} y={Y + 5} kind="val" anchor="start">
                    {p.m} kg
                  </Label>
                </g>
              );
            })}
            <g opacity={proj}>
              <Line x1={px} y1={py} x2={px} y2={oy} dashed tone="soft" />
              <Line x1={px} y1={py} x2={ox} y2={py} dashed tone="soft" />
              <line className="fig-bar" x1={px} y1={oy - 6} x2={px} y2={oy + 6} />
              <line className="fig-bar" x1={ox - 6} y1={py} x2={ox + 6} y2={py} />
              <Label x={px} y={oy + 24} kind="val">
                {f2(cx)}
              </Label>
              <Label x={ox - 12} y={py + 4} kind="val" anchor="end">
                {f2(cy)}
              </Label>
            </g>
            <g opacity={showCm}>
              <CM x={px} y={py} />
            </g>
            <Readout>
              x_cm = {f2(cx)} m, y_cm = {f2(cy)} m
            </Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ symmetry
export function Symmetry() {
  return (
    <Anim title="Mirror lines are drawn across a rectangle, a disc and a ring; they cross at the centre of mass" height={240} loop={6.5}>
      {(t) => {
        const cy = 105;
        const xs = [110, 320, 530];
        const v = ease(phase(t, 0.8, 1.9));
        const h = ease(phase(t, 1.9, 3));
        const mark = ease(phase(t, 3, 3.6));
        const ring = `M${xs[2] - 56} ${cy}a56 56 0 1 0 112 0a56 56 0 1 0 -112 0Z M${xs[2] - 34} ${cy}a34 34 0 1 0 68 0a34 34 0 1 0 -68 0Z`;
        return (
          <g>
            <rect className="kit-block" x={xs[0] - 75} y={cy - 50} width={150} height={100} rx={2} />
            <circle className="kit-block" cx={xs[1]} cy={cy} r={56} />
            <path className="kit-block" d={ring} fillRule="evenodd" />
            {xs.map((x, i) => (
              <g key={i}>
                <Line x1={x} y1={cy - 72} x2={x} y2={lerp(cy - 72, cy + 72, v)} dashed tone="bright" />
                <Line x1={x - 90} y1={cy} x2={lerp(x - 90, x + 90, h)} y2={cy} dashed tone="bright" />
                <g opacity={mark}>
                  <CM x={x} y={cy} />
                </g>
              </g>
            ))}
            <Label x={xs[0]} y={205} kind="label">
              rectangle
            </Label>
            <Label x={xs[1]} y={205} kind="label">
              disc
            </Label>
            <Label x={xs[2]} y={205} kind="label">
              ring: the CM is in the hole
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ a rod cut into slices
export function Strips({ linear = false }: { linear?: boolean }) {
  return (
    <Anim title={linear ? 'A rod that gets denser to the right is cut into slices; the centre of mass settles two thirds of the way along' : 'A rod is cut into thin slices; the running average of x settles at the middle'} height={200} loop={7}>
      {(t) => {
        const x0 = 120;
        const L = 400;
        const N = 40;
        const p = ease(phase(t, 0.6, 4.6));
        const xs = x0 + L * p;
        const val = linear ? (2 / 3) * p ** 3 : p * p * 0.5;
        const end = linear ? 2 / 3 : 0.5;
        const mark = ease(phase(t, 4.6, 5.4));
        return (
          <g>
            {Array.from({ length: N }, (_, i) => {
              const u = (i + 0.5) / N;
              return <rect key={i} className="kit-block" style={{ fillOpacity: linear ? 0.08 + 0.92 * u : 0.5 }} x={x0 + (L / N) * i} y={72} width={L / N - 0.5} height={22} />;
            })}
            <rect className="fig-bar" fill="none" x={xs - 5} y={62} width={10} height={42} />
            <Label x={xs} y={52} kind="sym">
              dm
            </Label>
            <Arrow x1={x0} y1={128} x2={xs} y2={128} tone="soft" />
            <Label x={x0 + 4} y={150} kind="sym" anchor="start">
              x
            </Label>
            <g opacity={mark}>
              <CM x={x0 + end * L} y={83} />
              <Line x1={x0 + end * L} y1={96} x2={x0 + end * L} y2={118} dashed tone="soft" />
              <Label x={x0 + end * L} y={136} kind="val">
                {linear ? '2L/3' : 'L/2'}
              </Label>
            </g>
            <Label x={x0} y={30} kind="val" anchor="start">
              0
            </Label>
            <Label x={x0 + L} y={30} kind="val" anchor="end">
              L
            </Label>
            <Readout y={186}>
              (1/M) ∫ x dm so far = {f2(val)} L
            </Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ ring, disc, triangle: the running average of height
export function Shapes() {
  return (
    <Anim title="A semicircular ring, a semicircular disc and a triangle are built up from the base; the average height settles at 2r over pi, 4r over 3 pi and h over 3" height={260} loop={8}>
      {(t) => {
        const base = 180;
        const r = 78;
        const hT = 112;
        const bT = 160;
        const xs = [110, 320, 530];
        const p = ease(phase(t, 0.5, 5));
        const end = ease(phase(t, 5, 5.8));
        // ring: samples along the arc
        const N = 28;
        const k = Math.floor(p * N);
        const th = p * Math.PI;
        const ringMean = th > 0.001 ? (r * (1 - Math.cos(th))) / th : 0;
        // disc and triangle: strips up from the base
        const mean = (w: (y: number, h: number) => number, h: number) => {
          let a = 0;
          let b = 0;
          const steps = 80;
          const top = h * p;
          for (let i = 0; i < steps; i++) {
            const y = ((i + 0.5) / steps) * top;
            a += y * w(y, h);
            b += w(y, h);
          }
          return b ? a / b : 0;
        };
        const discW = (y: number) => 2 * Math.sqrt(Math.max(0, r * r - y * y));
        const triW = (y: number, h: number) => bT * (1 - y / h);
        const discMean = mean(discW, r);
        const triMean = mean(triW, hT);
        const strips = (w: (y: number) => number, cx: number, h: number, n: number) =>
          Array.from({ length: n }, (_, i) => {
            const y = ((i + 0.5) / n) * h;
            return y <= h * p ? <line key={i} className="fig-guide" x1={cx - w(y) / 2} x2={cx + w(y) / 2} y1={base - y} y2={base - y} /> : null;
          });
        const meanLine = (cx: number, w: number, y: number) => <Line x1={cx - w} y1={base - y} x2={cx + w} y2={base - y} dashed tone="bright" />;
        return (
          <g>
            <Ground y={base} hatch={false} />
            <path className="fig-guide" fill="none" d={`M${xs[0] - r} ${base}A${r} ${r} 0 0 1 ${xs[0] + r} ${base}`} />
            {Array.from({ length: N }, (_, i) =>
              i < k ? <Ball key={i} x={xs[0] + r * Math.cos(((i + 0.5) / N) * Math.PI)} y={base - r * Math.sin(((i + 0.5) / N) * Math.PI)} r={3} glow={false} /> : null,
            )}
            {meanLine(xs[0], r + 8, ringMean)}
            <path className="fig-guide" fill="none" d={`M${xs[1] - r} ${base}A${r} ${r} 0 0 1 ${xs[1] + r} ${base}Z`} />
            {strips(discW, xs[1], r, 48)}
            {meanLine(xs[1], r + 8, discMean)}
            <path className="fig-guide" fill="none" d={`M${xs[2] - bT / 2} ${base}L${xs[2] + bT / 2} ${base}L${xs[2]} ${base - hT}Z`} />
            {strips((y) => triW(y, hT), xs[2], hT, 48)}
            {meanLine(xs[2], bT / 2 + 8, triMean)}
            <g opacity={end}>
              <CM x={xs[0]} y={base - (2 * r) / Math.PI} />
              <CM x={xs[1]} y={base - (4 * r) / (3 * Math.PI)} />
              <CM x={xs[2]} y={base - hT / 3} />
            </g>
            <Label x={xs[0]} y={base + 26} kind="val">
              ȳ = {f2(ringMean / r)} r
            </Label>
            <Label x={xs[1]} y={base + 26} kind="val">
              ȳ = {f2(discMean / r)} r
            </Label>
            <Label x={xs[2]} y={base + 26} kind="val">
              ȳ = {f2(triMean / hT)} h
            </Label>
            <Label x={xs[0]} y={base + 48} kind="label">
              ring
            </Label>
            <Label x={xs[1]} y={base + 48} kind="label">
              disc
            </Label>
            <Label x={xs[2]} y={base + 48} kind="label">
              triangle
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ a disc with a hole
export function HoleDisc({ title, R = 92, height = 260, finalHole = 0.5 }: { title: string; R?: number; height?: number; finalHole?: number }) {
  return (
    <Anim title={title} height={height} loop={7}>
      {(t) => {
        const cx = 320;
        const cy = height * 0.46;
        const a = R * finalHole * ease(phase(t, 0.8, 3.2));
        const hx = cx + R / 2;
        const dx = (a * a * (R / 2)) / (R * R - a * a);
        const xcm = cx - dx;
        const path = `M${cx - R} ${cy}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0Z` + (a > 0.5 ? `M${hx - a} ${cy}a${a} ${a} 0 1 0 ${2 * a} 0a${a} ${a} 0 1 0 ${-2 * a} 0Z` : '');
        const lab = ease(phase(t, 3.2, 4));
        return (
          <g>
            <path className="kit-block" d={path} fillRule="evenodd" />
            <circle className="fig-ghost" cx={cx} cy={cy} r={2.5} />
            <Label x={cx + 4} y={cy - 8} kind="sym" anchor="start">
              O
            </Label>
            <CM x={xcm} y={cy} />
            <g opacity={lab}>
              <Line x1={xcm} y1={cy + R + 16} x2={cx} y2={cy + R + 16} tone="bright" />
              <Line x1={xcm} y1={cy + R + 10} x2={xcm} y2={cy + R + 22} tone="bright" />
              <Line x1={cx} y1={cy + R + 10} x2={cx} y2={cy + R + 22} tone="bright" />
              <Label x={(xcm + cx) / 2} y={cy + R + 36} kind="val">
                R/6
              </Label>
              <Label x={hx} y={cy - R - 10} kind="label">
                hole
              </Label>
            </g>
            <Readout>x_cm = {f2(-dx / R)} R</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ two blocks on a spring, no friction
export function SpringPair({ push = false }: { push?: boolean }) {
  return (
    <Anim title={push ? 'Two blocks joined by a spring are pushed along a smooth floor; the blocks wobble but the centre of mass speeds up steadily' : 'Two blocks joined by a spring oscillate on a smooth floor while the centre of mass drifts at a constant velocity'} height={230} loop={7}>
      {(t) => {
        const m1 = 1;
        const m2 = 2;
        const M = m1 + m2;
        const g = 170;
        const a = 22;
        const X = push ? 110 + 0.5 * a * t * t : 120 + 62 * t;
        const d = 150 + 38 * Math.sin((2 * Math.PI * t) / 1.5);
        const x1 = X - (m2 / M) * d;
        const x2 = X + (m1 / M) * d;
        const w1 = 26 + 12 * m1;
        const w2 = 26 + 12 * m2;
        const vcm = push ? a * t : 62;
        return (
          <g>
            <Ground y={g} />
            <Line x1={x1 + w1 / 2} y1={g - 15} x2={x2 - w2 / 2} y2={g - 15} tone="soft" />
            <Block x={x1} y={g - 15} w={w1} h={30} label="1 kg" />
            <Block x={x2} y={g - 15} w={w2} h={30} label="2 kg" />
            {push && <Arrow x1={x1 - w1 / 2 - 52} y1={g - 15} x2={x1 - w1 / 2 - 4} y2={g - 15} label="F" labelAt="mid" />}
            <Line x1={X} y1={g - 36} x2={X} y2={g + 18} dashed tone="soft" />
            <CM x={X} y={g + 34} />
            <Label x={X} y={g + 62} kind="label">
              CM
            </Label>
            <Readout>v_cm = {Math.round(vcm)} (px/s)</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ a person walking on a boat
export function Boat({ mMan = 60, mBoat = 120, walk = 4, title, height = 220 }: { mMan?: number; mBoat?: number; walk?: number; title: string; height?: number }) {
  return (
    <Anim title={title} height={height} loop={7}>
      {(t) => {
        const sc = 40;
        const M = mMan + mBoat;
        const x0 = 300;
        const water = height - 70;
        const s = walk * sc * ease(phase(t, 0.6, 3.6));
        const xb = x0 - (mMan / M) * s;
        const xm = xb - 100 + s;
        const cm = (mMan * xm + mBoat * xb) / M;
        const hull = (c: number) => `M${c - 120} ${water - 10}L${c + 120} ${water - 10}L${c + 95} ${water + 16}L${c - 95} ${water + 16}Z`;
        const done = ease(phase(t, 3.6, 4.4));
        return (
          <g>
            <Line x1={0} y1={water} x2={W_} y2={water} tone="faint" />
            <path className="fig-guide fig-dash" fill="none" d={hull(x0)} />
            <path className="kit-block" d={hull(xb)} />
            <Block x={xm} y={water - 28} w={14} h={36} filled />
            <Label x={xm} y={water - 54} kind="val">
              {mMan} kg
            </Label>
            <Label x={xb + 40} y={water + 8} kind="val">
              {mBoat} kg
            </Label>
            <Line x1={cm} y1={30} x2={cm} y2={water - 56} dashed tone="soft" />
            <CM x={cm} y={26} />
            <Label x={cm + 16} y={30} kind="label" anchor="start">
              CM stays put
            </Label>
            <Line x1={582} y1={water - 52} x2={582} y2={water + 40} tone="bright" />
            <Label x={582} y={water - 62} kind="label">
              pier
            </Label>
            <g opacity={done}>
              <Line x1={xb} y1={water + 36} x2={x0} y2={water + 36} tone="bright" />
              <Label x={(xb + x0) / 2} y={water + 56} kind="val">
                boat moved {f2(((mMan * walk) / M))} m
              </Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}
const W_ = 640;

// ------------------------------------------------------------------ a thrown spanner
export function Spanner() {
  return (
    <Anim title="A spanner is thrown and spins; the dot at its centre of mass traces a smooth parabola while the ends trace wobbly paths" height={260} loop={5.5}>
      {(t) => {
        const g = 95;
        const vx = 140;
        const vy = 175;
        const T = (2 * vy) / g;
        const gy = 235;
        const x0 = 50;
        const cmAt = (tt: number): [number, number] => [x0 + vx * tt, gy - (vy * tt - 0.5 * g * tt * tt)];
        const w = 7;
        const L = 86;
        const tt = Math.min(t, T);
        const headOff = -0.28 * L;
        const endOff = 0.72 * L;
        const tip = (q: number): [number, number] => {
          const c = cmAt(q);
          return [c[0] + endOff * Math.cos(w * q), c[1] + endOff * Math.sin(w * q)];
        };
        const cmTrail: [number, number][] = [];
        const tipTrail: [number, number][] = [];
        for (let q = 0; q <= tt; q += 0.05) {
          cmTrail.push(cmAt(q));
          tipTrail.push(tip(q));
        }
        const c = cmAt(tt);
        const ang = w * tt;
        const head: [number, number] = [c[0] + headOff * Math.cos(ang), c[1] + headOff * Math.sin(ang)];
        const end = tip(tt);
        return (
          <g>
            <Ground y={gy} />
            <Trail points={tipTrail} tone="faint" />
            <Trail points={cmTrail} dashed tone="bright" />
            <Line x1={head[0]} y1={head[1]} x2={end[0]} y2={end[1]} tone="bright" />
            <circle className="kit-block" cx={head[0]} cy={head[1]} r={13} />
            <CM x={c[0]} y={c[1]} r={3.5} />
            <Label x={16} y={24} kind="label" anchor="start">
              dashed: path of the CM
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ a shell exploding in flight
export function Shell({ frags, tags, zoom = 1, height = 260, title }: { frags: { m: number; vx: number; vy: number }[]; tags?: string[]; zoom?: number; height?: number; title: string }) {
  return (
    <Anim title={title} height={height} loop={7}>
      {(t) => {
        const g = 90;
        const vx = 70;
        const vy = 190;
        const gy = 235;
        const x0 = 50;
        const te = vy / g;
        const H = (vy * vy) / (2 * g);
        const xa = x0 + vx * te;
        const M = frags.reduce((s, f) => s + f.m, 0);
        const land = Math.min(...frags.map((f) => (f.vy + Math.sqrt(f.vy * f.vy + 2 * g * H)) / g));
        const tt = Math.min(t, te + land);
        const par = (q: number): [number, number] => [x0 + vx * q, gy - (vy * q - 0.5 * g * q * q)];
        const trail: [number, number][] = [];
        for (let q = 0; q <= 2 * te; q += 0.06) trail.push(par(q));
        const flash = phase(tt, te, te + 0.4);
        const pos = frags.map((f) => {
          const tau = Math.max(0, tt - te);
          return [xa + (vx + f.vx) * tau, gy - H - (f.vy * tau - 0.5 * g * tau * tau)] as [number, number];
        });
        const cm: [number, number] = tt < te ? par(tt) : [pos.reduce((s, p, i) => s + frags[i].m * p[0], 0) / M, pos.reduce((s, p, i) => s + frags[i].m * p[1], 0) / M];
        const fragTrails = frags.map((f) => {
          const pts: [number, number][] = [];
          for (let tau = 0; tau <= Math.max(0, tt - te); tau += 0.05) pts.push([xa + (vx + f.vx) * tau, gy - H - (f.vy * tau - 0.5 * g * tau * tau)]);
          return pts;
        });
        return (
          <g transform={`translate(${(640 - 640 * zoom) / 2} 0) scale(${zoom})`}>
            <Ground y={gy} />
            <Trail points={trail} dashed tone="soft" />
            {tt < te && <Ball x={par(tt)[0]} y={par(tt)[1]} r={8} />}
            {tt >= te && (
              <g>
                {flash < 1 && <circle className="fig-ghost" cx={xa} cy={gy - H} r={8 + 40 * flash} opacity={1 - flash} />}
                {fragTrails.map((pts, i) => (
                  <Trail key={i} points={pts} tone="faint" />
                ))}
                {pos.map((p, i) => (
                  <Ball key={i} x={p[0]} y={p[1]} r={rad(frags[i].m)} />
                ))}
                {tags &&
                  pos.map((p, i) => (
                    <Label key={i} x={p[0]} y={p[1] - rad(frags[i].m) - 8} kind="label">
                      {tags[i]}
                    </Label>
                  ))}
              </g>
            )}
            <CM x={cm[0]} y={cm[1]} r={3.5} />
            <Label x={16} y={24} kind="label" anchor="start">
              dashed: the path of the CM
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ hanging a flat body from two points
export function Hang() {
  return (
    <Anim title="A flat body hangs from one point and swings until its centre of mass is directly below; hung from a second point the two plumb lines cross at the centre of mass" height={270} loop={9}>
      {(t) => {
        const poly = '-70,-50 10,-72 72,-30 60,42 -10,72 -66,30';
        const pa: [number, number] = [-52, -34];
        const pb: [number, number] = [54, -22];
        const second = t > 4.6;
        const tl = second ? t - 4.6 : t;
        const pv = second ? pb : pa;
        const P: [number, number] = [320, 34];
        const eq = Math.atan2(1, 0) - Math.atan2(-pv[1], -pv[0]);
        const th0 = second ? -0.9 : 0.9;
        const th = eq + (th0 - 0) * Math.exp(-1.1 * tl) * Math.cos(6 * tl);
        const deg = (th * 180) / Math.PI;
        const dim = second ? 1 - phase(t, 4.6, 4.9) * 0 : 1;
        const op = t > 4.2 && t < 4.6 ? 0.15 : 1;
        const lineA = ease(phase(t, 2.6, 3.4));
        const R = (v: [number, number]) => [P[0] + (v[0] - pv[0]) * Math.cos(th) - (v[1] - pv[1]) * Math.sin(th), P[1] + (v[0] - pv[0]) * Math.sin(th) + (v[1] - pv[1]) * Math.cos(th)];
        const cmW = R([0, 0]);
        const lineB = second ? ease(phase(t, 6.4, 7.2)) : 0;
        void dim;
        return (
          <g opacity={op}>
            <Line x1={P[0] - 30} y1={P[1] - 14} x2={P[0] + 30} y2={P[1] - 14} tone="bright" />
            <g transform={`translate(${P[0]} ${P[1]}) rotate(${deg}) translate(${-pv[0]} ${-pv[1]})`}>
              <polygon className="kit-block" points={poly} />
              {/* plumb line through the first hole, drawn on the body */}
              <g opacity={second ? 1 : lineA}>
                <Line x1={pa[0]} y1={pa[1]} x2={pa[0] * -1.7} y2={pa[1] * -1.7} dashed tone="bright" />
              </g>
              <circle className="fig-ghost" cx={pa[0]} cy={pa[1]} r={3} />
              <circle className="fig-ghost" cx={pb[0]} cy={pb[1]} r={3} />
            </g>
            <g opacity={second ? lineB : lineA}>
              <Line x1={P[0]} y1={P[1]} x2={P[0]} y2={248} dashed tone="soft" />
            </g>
            <g opacity={second ? lineB : lineA}>
              <CM x={cmW[0]} y={cmW[1]} r={3.5} />
            </g>
            <Label x={16} y={258} kind="label" anchor="start">
              {second ? 'hung from a second hole: the lines cross at the CM' : 'hung from one hole: the CM settles directly below it'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ tilting and toppling
export function Topple({ title, mode, w = 80, h = 120 }: { title: string; mode: 'topple' | 'wobble' | 'incline'; w?: number; h?: number }) {
  const crit = Math.atan2(w, h); // radians
  const critDeg = (crit * 180) / Math.PI;
  const plank = mode === 'incline';
  const ht = plank ? 300 : 250;
  return (
    <Anim title={title} height={ht} loop={9.5}>
      {(t) => {
        const P: [number, number] = plank ? [400, 195] : [380, 205];
        let theta = 0; // block angle, degrees (clockwise)
        let phi = 0; // plank angle
        let fallen = false;
        const ramp = (q: number) => 1.12 * critDeg * ease(phase(q, 3.4, 6.4));
        if (mode === 'wobble') {
          theta = 0.85 * critDeg * (ease(phase(t, 0.6, 2.2)) - ease(phase(t, 2.8, 4.4))) + 0.85 * critDeg * (ease(phase(t, 5.4, 6.4)) - ease(phase(t, 6.8, 8)));
        } else if (mode === 'topple') {
          theta = 0.8 * critDeg * (ease(phase(t, 0.6, 2)) - ease(phase(t, 2.4, 3.4))) + ramp(t);
          if (t > 3.4 && ramp(t) >= critDeg) {
            let tc = 3.4;
            while (ramp(tc) < critDeg) tc += 0.02;
            if (t > tc) {
              theta = critDeg + 0.5 * 120 * (t - tc) ** 2;
              fallen = true;
            }
          }
          theta = Math.min(theta, 90);
        } else {
          const planR = (q: number) => 38 * ease(phase(q, 1, 6));
          phi = planR(t);
          theta = phi;
          if (phi > critDeg) {
            let tc = 1;
            while (planR(tc) < critDeg) tc += 0.02;
            theta = phi + Math.min(90, 0.5 * 110 * Math.max(0, t - tc) ** 2);
            fallen = true;
          }
        }
        const th = (theta * Math.PI) / 180;
        const cmX = P[0] + (-w / 2) * Math.cos(th) - (-h / 2) * Math.sin(th);
        const cmY = P[1] + (-w / 2) * Math.sin(th) + (-h / 2) * Math.cos(th);
        const over = cmX > P[0] + 0.5;
        const ph = (phi * Math.PI) / 180;
        return (
          <g>
            {plank ? (
              <g>
                <Line x1={P[0] - 250 * Math.cos(ph)} y1={P[1] - 250 * Math.sin(ph)} x2={P[0] + 150 * Math.cos(ph)} y2={P[1] + 150 * Math.sin(ph)} tone="bright" />
              </g>
            ) : (
              <Ground y={P[1]} />
            )}
            <g transform={`translate(${P[0]} ${P[1]}) rotate(${theta})`}>
              <rect className="kit-block" x={-w} y={-h} width={w} height={h} rx={2} />
            </g>
            <circle className="fig-ghost" cx={P[0]} cy={P[1]} r={3} />
            <Line x1={cmX} y1={cmY} x2={cmX} y2={P[1] + 36} dashed tone="bright" />
            <Line x1={P[0]} y1={P[1] - 6} x2={P[0]} y2={P[1] + 36} dashed tone="faint" />
            <CM x={cmX} y={cmY} r={3.5} />
            <Label x={16} y={24} kind="val" anchor="start">
              tilt = {Math.round(Math.max(0, theta))}°
            </Label>
            <Label x={16} y={46} kind="label" anchor="start">
              {fallen || over ? 'CM beyond the edge: it falls over' : 'CM above the base: it settles back'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ small mistake animations
export function RingCM() {
  return (
    <Anim title="A ring rolls along; its centre of mass is the dot at the middle, where there is no material" height={170} loop={5}>
      {(t) => {
        const r = 42;
        const x = 100 + 90 * t;
        const a = (x / r) * (180 / Math.PI);
        return (
          <g>
            <Ground y={140} />
            <circle className="fig-path" cx={x} cy={140 - r} r={r} fill="none" />
            <g transform={`rotate(${a} ${x} ${140 - r})`}>
              <circle className="fig-ghost" cx={x} cy={140 - r + r} r={0} />
              <Ball x={x} y={140 - r + r} r={3} glow={false} />
            </g>
            <CM x={x} y={140 - r} r={3.5} />
            <Label x={x} y={30} kind="label">
              the CM is in the empty middle
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Midpoint() {
  return (
    <Anim title="A 1 kilogram and a 4 kilogram ball: the halfway point is not the centre of mass, which is much closer to the heavy one" height={170} loop={6}>
      {(t) => {
        const xa = 120;
        const xb = 520;
        const mid = (xa + xb) / 2;
        const cm = xa + (4 * (xb - xa)) / 5;
        const p = ease(phase(t, 1, 3));
        const x = lerp(mid, cm, p);
        return (
          <g>
            <Line x1={xa} y1={80} x2={xb} y2={80} tone="soft" />
            <Ball x={xa} y={80} r={rad(1)} />
            <Ball x={xb} y={80} r={rad(4)} />
            <Label x={xa} y={50} kind="val">
              1 kg
            </Label>
            <Label x={xb} y={46} kind="val">
              4 kg
            </Label>
            <circle className="fig-ghost" cx={mid} cy={80} r={5} />
            <Label x={mid} y={118} kind="label">
              halfway
            </Label>
            <CM x={x} y={80} r={3.5} />
            <Label x={cm} y={140} kind="label">
              <tspan opacity={p}>real CM: 4/5 of the way</tspan>
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function PushApart() {
  return (
    <Anim title="Two skaters push apart from rest; each moves away but the centre of mass stays exactly where it was" height={170} loop={5}>
      {(t) => {
        const m1 = 1;
        const m2 = 2;
        const M = m1 + m2;
        const c = 320;
        const s = 160 * ease(phase(t, 0.8, 3.2));
        const x1 = c - (m2 / M) * s - 20;
        const x2 = c + (m1 / M) * s + 20;
        return (
          <g>
            <Ground y={118} />
            <Block x={x1} y={103} w={32} h={30} label="1" />
            <Block x={x2} y={103} w={44} h={30} label="2" />
            <Line x1={c} y1={60} x2={c} y2={118} dashed tone="soft" />
            <CM x={c} y={46} r={3.5} />
            <Label x={c} y={150} kind="label">
              the push is internal: the CM does not move
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}
