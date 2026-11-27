import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Label, Line, Readout, Trail, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for electric charges and fields. Pixel positions come from the real physics, scaled. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

/** A charge: a white disc with + or a hollow ring with −. Optional t makes a halo breathe. */
export function Chg({ x, y, q, r = 11, t }: { x: number; y: number; q: number; r?: number; t?: number }) {
  const pos = q > 0;
  return (
    <g>
      {t !== undefined && <circle className="fig-guide fig-faint" cx={x} cy={y} r={r + 5 + 4 * Math.sin(TAU * t * 0.5)} />}
      <circle className={pos ? 'fig-ball' : 'fig-ghost'} cx={x} cy={y} r={r} />
      <text x={x} y={y + r * 0.5} textAnchor="middle" style={{ fill: pos ? '#000' : '#fff', fontSize: r * 1.5, fontFamily: 'var(--mono)' }}>
        {pos ? '+' : '−'}
      </text>
    </g>
  );
}

/** A small free electron (hollow dot) or positive ion (solid dot). */
function Dot({ x, y, q, r = 3.2 }: { x: number; y: number; q: number; r?: number }) {
  return q > 0 ? <circle className="fig-ball" cx={x} cy={y} r={r} /> : <circle className="fig-ghost" cx={x} cy={y} r={r} style={{ strokeWidth: 1.4 }} />;
}

// ------------------------------------------------------------------ field of point charges (pixel units, k = 1)

interface Q {
  x: number;
  y: number;
  q: number;
}

function field(qs: Q[], x: number, y: number): Pt {
  let ex = 0;
  let ey = 0;
  for (const c of qs) {
    const dx = x - c.x;
    const dy = y - c.y;
    const r2 = dx * dx + dy * dy + 1e-6;
    const r3 = r2 * Math.sqrt(r2);
    ex += (c.q * dx) / r3;
    ey += (c.q * dy) / r3;
  }
  return [ex, ey];
}

interface Line2 {
  pts: Pt[];
  cum: number[];
}

const lineCache = new Map<string, Line2[]>();
function fieldLines(qs: Q[], n: number, w: number, h: number): Line2[] {
  const key = JSON.stringify([qs, n, w, h]);
  const hit = lineCache.get(key);
  if (hit) return hit;
  const dir = qs.some((c) => c.q > 0) ? 1 : -1;
  const out: Line2[] = [];
  for (const c of qs) {
    if (c.q * dir <= 0) continue;
    const m = Math.max(2, Math.round(n * Math.abs(c.q)));
    for (let i = 0; i < m; i++) {
      const a = (TAU * (i + 0.5)) / m;
      let x = c.x + 11 * Math.cos(a);
      let y = c.y + 11 * Math.sin(a);
      const pts: Pt[] = [[x, y]];
      for (let s = 0; s < 900; s++) {
        const [ex, ey] = field(qs, x, y);
        const mag = Math.hypot(ex, ey);
        if (mag < 1e-12) break;
        x += (dir * ex * 3) / mag;
        y += (dir * ey * 3) / mag;
        pts.push([x, y]);
        if (x < -10 || x > w + 10 || y < -10 || y > h + 10) break;
        if (qs.some((d) => d.q * dir < 0 && Math.hypot(x - d.x, y - d.y) < 11)) break;
      }
      if (dir < 0) pts.reverse();
      const cum = [0];
      for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
      out.push({ pts, cum });
    }
  }
  lineCache.set(key, out);
  return out;
}

function along(l: Line2, s: number): Pt | null {
  if (s < 0 || s > l.cum[l.cum.length - 1]) return null;
  let lo = 0;
  let hi = l.cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (l.cum[mid] <= s) lo = mid;
    else hi = mid;
  }
  const p = (s - l.cum[lo]) / Math.max(1e-9, l.cum[hi] - l.cum[lo]);
  return [lerp(l.pts[lo][0], l.pts[hi][0], p), lerp(l.pts[lo][1], l.pts[hi][1], p)];
}

// ------------------------------------------------------------------ 1. charging

/** Rubbing a glass rod with silk: electrons move from the rod to the silk. */
export function Rubbing() {
  return (
    <Anim title="A glass rod is rubbed on silk; electrons hop from the rod to the silk, so the rod ends positive and the silk negative" height={230} loop={9}>
      {(t) => {
        const prog = phase(t, 0.5, 6.5);
        const rub = prog < 1 ? 28 * Math.sin(TAU * t * 0.75) * Math.min(1, t) : 0;
        const rodX = 200 + rub;
        const moved = Math.round(prog * 6);
        const fade = ease(phase(t, 6.5, 7.5));
        const items: ReactNode[] = [];
        for (let i = 0; i < 6; i++) {
          const q = (t * 0.9 + i * 0.37) % 1;
          const live = i < moved || (i === moved && prog < 1);
          if (!live) continue;
          const x0 = rodX + (i - 2.5) * 24;
          const sx = x0 + 6;
          const y = lerp(88, 128, q) - 18 * Math.sin(Math.PI * q);
          items.push(<Dot key={i} x={lerp(x0, sx, q)} y={y} q={-1} />);
        }
        return (
          <g>
            <rect className="kit-block" x={rodX - 90} y={68} width={180} height={22} rx={11} />
            <rect className="kit-block is-filled" x={150} y={132} width={190} height={14} rx={3} style={{ opacity: 0.35 }} />
            <Label x={125} y={146} kind="label" anchor="end">silk</Label>
            <Label x={rodX} y={58} kind="label">glass rod</Label>
            {items}
            {[0, 1, 2, 3, 4, 5].map((i) => (i >= moved ? <Dot key={`r${i}`} x={rodX + (i - 2.5) * 24} y={79} q={-1} /> : <Dot key={`p${i}`} x={rodX + (i - 2.5) * 24} y={79} q={1} r={3.6} />))}
            <g style={{ opacity: fade }}>
              <Label x={470} y={104} kind="label">after rubbing</Label>
            </g>
            <Label x={470} y={140} kind="val">{`rod: +${moved} e`}</Label>
            <Label x={470} y={160} kind="val">{`silk: −${moved} e`}</Label>
            <Label x={470} y={188} kind="label">total charge: always zero</Label>
            <Readout>{`${moved} electron${moved === 1 ? '' : 's'} moved`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Two identical conductors share their charge when they touch. */
export function Sharing() {
  return (
    <Anim title="A charged metal sphere touches an identical uncharged one; the charge flows until it is shared equally and the total stays the same" height={200} loop={9}>
      {(t) => {
        const near = ease(phase(t, 0.8, 2.2)) * (1 - ease(phase(t, 5.5, 6.8)));
        const touch = phase(t, 2.2, 5);
        const share = ease(phase(t, 2.4, 4.4));
        const xa = lerp(190, 285, near);
        const xb = lerp(450, 355, near);
        const na = Math.round(lerp(8, 4, share));
        const nb = 8 - na;
        const dots = (cx: number, n: number, seed: number) =>
          Array.from({ length: n }, (_, i) => {
            const a = TAU * (i / Math.max(n, 1)) + seed + 0.5 * Math.sin(t + i);
            return <Dot key={i} x={cx + 26 * Math.cos(a)} y={100 + 26 * Math.sin(a)} q={1} />;
          });
        return (
          <g>
            <circle className="kit-block" cx={xa} cy={100} r={44} />
            <circle className="kit-block" cx={xb} cy={100} r={44} />
            {dots(xa, na, 0)}
            {dots(xb, nb, 1)}
            {touch > 0 && touch < 1 && [0, 1, 2].map((k) => <Dot key={k} x={lerp(xa + 40, xb - 40, (t * 1.2 + k / 3) % 1)} y={100} q={1} r={2.6} />)}
            <Label x={xa} y={180} kind="val">{`Q = +${na}q`}</Label>
            <Label x={xb} y={180} kind="val">{`Q = +${nb}q`}</Label>
            <Readout>{`total = +8q`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Charging by induction: a charged rod separates the free charges in a neutral conductor. */
export function Induction() {
  return (
    <Anim title="A charged rod comes near an uncharged metal sphere; free electrons shift toward it, leaving the far side positive, and drift back when the rod leaves" height={220} loop={8}>
      {(t) => {
        const near = 0.5 - 0.5 * Math.cos(TAU * (t / 8));
        const rodX = lerp(112, 215, near);
        const sx = 360;
        const dots: ReactNode[] = [];
        for (let i = 0; i < 10; i++) {
          const a = TAU * (i / 10) + 0.3;
          const ex = Math.cos(a);
          const ey = Math.sin(a);
          dots.push(<Dot key={`p${i}`} x={sx + 34 * ex} y={110 + 34 * ey} q={1} />);
        }
        for (let i = 0; i < 10; i++) {
          const a = TAU * (i / 10) + 0.3 + 0.01 * i;
          const bx = 20 * Math.cos(a) + 0.5 * Math.sin(t * 2 + i);
          const by = 20 * Math.sin(a);
          // Electrons crowd toward the rod (left) by an amount that follows how close it is.
          dots.push(<Dot key={`e${i}`} x={sx + bx - 22 * near * (1 - 0.4 * Math.cos(a)) } y={110 + by} q={-1} />);
        }
        return (
          <g>
            <circle className="kit-block" cx={sx} cy={110} r={52} />
            <rect className="kit-block" x={rodX - 90} y={98} width={90} height={24} rx={12} />
            {[0, 1, 2].map((i) => <text key={i} x={rodX - 70 + i * 26} y={116} textAnchor="middle" style={{ fill: '#fff', fontSize: 18, fontFamily: 'var(--mono)' }}>+</text>)}
            {dots}
            <Label x={rodX - 45} y={86} kind="label">charged rod</Label>
            <Label x={sx} y={190} kind="label">neutral conductor</Label>
            <Readout>{`separation ${(near * 100).toFixed(0)}%`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 2. Coulomb's law

/** Two point charges whose gap swells and shrinks. Arrows follow 1 / r², and a graph tracks the point. */
export function CoulombPair({ title = "Two point charges move closer and farther apart while the force arrows and a force against distance graph follow the inverse square rule", q1 = 1, q2 = -1, height = 230, graph = true }: { title?: string; q1?: number; q2?: number; height?: number; graph?: boolean }) {
  return (
    <Anim title={title} height={height} loop={8}>
      {(t) => {
        const u = 0.5 - 0.5 * Math.cos(TAU * (t / 8));
        const r = lerp(1.0, 3.0, u);
        const F = 1 / (r * r);
        const cy = height * (graph ? 0.4 : 0.5);
        const mid = graph ? 160 : 320;
        const s = graph ? 55 : 90;
        const x1 = mid - (r * s) / 2;
        const x2 = mid + (r * s) / 2;
        const len = 62 * F;
        const attract = q1 * q2 < 0;
        const gx = 360, gy = height - 44, gw = 250, gh = height - 80;
        const gp = (rr: number): Pt => [gx + ((rr - 0.8) / 2.4) * gw, gy - Math.min(1, 1 / (rr * rr) / 1.6) * gh];
        return (
          <g>
            <Line x1={x1} y1={cy + 34} x2={x2} y2={cy + 34} tone="soft" />
            <Label x={mid} y={cy + 54} kind="val">{`r = ${r.toFixed(2)}`}</Label>
            <Arrow x1={x1} y1={cy - 24} x2={x1 + (attract ? 1 : -1) * len} y2={cy - 24} label="F" />
            <Arrow x1={x2} y1={cy - 24} x2={x2 + (attract ? -1 : 1) * len} y2={cy - 24} label="F" />
            <Chg x={x1} y={cy} q={q1} />
            <Chg x={x2} y={cy} q={q2} />
            <Label x={mid} y={height - 12} kind="val">{`F = ${F.toFixed(2)} × F₁`}</Label>
            {graph && (
              <g>
                <Axes x={gx} y={gy} w={gw} h={gh} xLabel="r" yLabel="F" />
                <Trail points={curve(60, 2.4, (k) => gp(0.8 + k))} tone="soft" />
                <Trail points={curve(60, r - 0.8, (k) => gp(0.8 + k))} />
                <Ball x={gp(r)[0]} y={gp(r)[1]} r={5} />
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

/** The force on one charge from two others is the vector sum. */
export function Superpose() {
  return (
    <Anim title="A small positive charge wanders between a positive and a negative charge; the push from one and pull from the other add as vectors into a net force arrow" height={260} loop={8}>
      {(t) => {
        const a = { x: 130, y: 70, q: 1 };
        const b = { x: 130, y: 200, q: -1 };
        const px = 330 + 70 * Math.cos(TAU * (t / 8));
        const py = 135 + 45 * Math.sin(TAU * (t / 8));
        const f = (c: Q): Pt => {
          const dx = px - c.x, dy = py - c.y;
          const r2 = dx * dx + dy * dy;
          const k = (c.q * 9000) / (r2 * Math.sqrt(r2));
          return [dx * k, dy * k];
        };
        const [f1x, f1y] = f(a);
        const [f2x, f2y] = f(b);
        const fx = f1x + f2x, fy = f1y + f2y;
        return (
          <g>
            <Chg x={a.x} y={a.y} q={1} t={t} />
            <Chg x={b.x} y={b.y} q={-1} t={t} />
            <Line x1={a.x} y1={a.y} x2={px} y2={py} tone="soft" dashed />
            <Line x1={b.x} y1={b.y} x2={px} y2={py} tone="soft" dashed />
            <Arrow x1={px} y1={py} x2={px + f1x} y2={py + f1y} tone="soft" label={<tspan>F₁</tspan>} />
            <Arrow x1={px} y1={py} x2={px + f2x} y2={py + f2y} tone="soft" label={<tspan>F₂</tspan>} />
            <Line x1={px + f1x} y1={py + f1y} x2={px + fx} y2={py + fy} tone="soft" dashed />
            <Line x1={px + f2x} y1={py + f2y} x2={px + fx} y2={py + fy} tone="soft" dashed />
            <Arrow x1={px} y1={py} x2={px + fx} y2={py + fy} width={4} label="F" />
            <Chg x={px} y={py} q={1} r={8} />
            <Label x={a.x} y={a.y - 24} kind="label">q₁ (+)</Label>
            <Label x={b.x} y={b.y + 36} kind="label">q₂ (−)</Label>
            <Readout>{`|F| = ${Math.hypot(fx, fy).toFixed(1)}`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 3. the electric field

/** The field of a point charge: arrows that shrink as 1 / r², with a test charge sampling it. */
export function PointField({ title = 'Arrows around a positive charge point away from it and get shorter with distance; a small test charge moves outward and feels a weaker force', q = 1, height = 250 }: { title?: string; q?: number; height?: number }) {
  return (
    <Anim title={title} height={height} loop={8}>
      {(t) => {
        const cx = 190, cy = height / 2;
        const arrows: ReactNode[] = [];
        for (let ring = 0; ring < 3; ring++) {
          const R = 52 + ring * 38;
          const L = Math.max(7, 46 * (52 / R) ** 2);
          for (let k = 0; k < 8 + 4 * ring; k++) {
            const a = TAU * (k / (8 + 4 * ring)) + 0.2 * ring;
            const pulse = 0.5 + 0.5 * Math.sin(TAU * (t / 4) - R / 30);
            const x1 = cx + R * Math.cos(a), y1 = cy + R * Math.sin(a);
            const sg = q > 0 ? 1 : -1;
            const e = L * (0.85 + 0.15 * pulse);
            arrows.push(<Arrow key={`${ring}-${k}`} x1={x1} y1={y1} x2={x1 + sg * e * Math.cos(a)} y2={y1 + sg * e * Math.sin(a)} tone="soft" width={1.6} />);
          }
        }
        const r = lerp(48, 140, 0.5 - 0.5 * Math.cos(TAU * (t / 8)));
        const E = (52 / r) ** 2;
        const tx = cx + r, ty = cy;
        const gx = 380, gy = height - 40, gw = 230, gh = height - 90;
        const gp = (rr: number): Pt => [gx + ((rr - 48) / 100) * gw, gy - Math.min(1, (48 / rr) ** 2) * gh];
        return (
          <g>
            {arrows}
            <Chg x={cx} y={cy} q={q} r={13} t={t} />
            <Arrow x1={tx} y1={ty} x2={tx + (q > 0 ? 1 : -1) * 70 * E} y2={ty} width={4} label="F" />
            <Chg x={tx} y={ty} q={1} r={6} />
            <Axes x={gx} y={gy} w={gw} h={gh + 10} xLabel="r" yLabel="E" />
            <Trail points={curve(60, 100, (k) => gp(48 + k))} tone="soft" />
            <Ball x={gp(r)[0]} y={gp(r)[1]} r={5} />
            <Label x={gx + gw / 2} y={height - 10} kind="val">{`r = ${(r / 48).toFixed(2)} r₀,  E = ${(48 ** 2 / r ** 2).toFixed(2)} E₀`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 4. field lines

type LineKind = 'plus' | 'minus' | 'pair' | 'like' | 'two';

/** Field lines for a few classic arrangements, with dots drifting along them in the field direction. */
export function FieldLines({ title, kind, height = 260, n = 12 }: { title: string; kind: LineKind; height?: number; n?: number }) {
  const cy = height / 2;
  const qs: Q[] =
    kind === 'plus' ? [{ x: 320, y: cy, q: 1 }] : kind === 'minus' ? [{ x: 320, y: cy, q: -1 }] : kind === 'pair' ? [{ x: 230, y: cy, q: 1 }, { x: 410, y: cy, q: -1 }] : kind === 'like' ? [{ x: 240, y: cy, q: 1 }, { x: 400, y: cy, q: 1 }] : [{ x: 240, y: cy, q: 2 }, { x: 420, y: cy, q: -1 }];
  const lines = fieldLines(qs, n, W, height);
  return (
    <Anim title={title} height={height} loop={6}>
      {(t) => (
        <g>
          {lines.map((l, i) => (
            <Trail key={i} points={l.pts.filter((_, k) => k % 3 === 0)} tone="soft" />
          ))}
          {lines.map((l, i) => {
            const total = l.cum[l.cum.length - 1];
            const dots: ReactNode[] = [];
            for (let s = (t * 40 + i * 13) % 64; s < total; s += 64) {
              const p = along(l, s);
              if (p) dots.push(<circle key={s} className="fig-ball" cx={p[0]} cy={p[1]} r={2.6} />);
            }
            return <g key={`d${i}`}>{dots}</g>;
          })}
          {qs.map((c, i) => (
            <Chg key={i} x={c.x} y={c.y} q={c.q} r={c.q === 2 ? 15 : 12} t={t} />
          ))}
        </g>
      )}
    </Anim>
  );
}

/** A charge released in a curved field does not follow the line it starts on. */
export function NotPath() {
  const qs: Q[] = [{ x: 230, y: 130, q: 1 }, { x: 410, y: 130, q: -1 }];
  const lines = fieldLines(qs, 10, W, 260);
  // Integrate a unit-mass test charge released from rest on one curved line (offline, once).
  const path = ((): Pt[] => {
    const out: Pt[] = [];
    let x = 268, y = 82, vx = 0, vy = 0;
    for (let i = 0; i < 4000; i++) {
      const [ex, ey] = field(qs, x, y);
      vx += ex * 9000 * 0.003;
      vy += ey * 9000 * 0.003;
      x += vx * 0.003 * 60;
      y += vy * 0.003 * 60;
      if (i % 4 === 0) out.push([x, y]);
      if (Math.hypot(x - 410, y - 130) < 12 || x < 0 || x > W || y < 0 || y > 260) break;
    }
    return out;
  })();
  return (
    <Anim title="A charge released from rest on a curved field line gathers speed and swings off the line instead of following it" height={260} loop={8}>
      {(t) => {
        const k = Math.min(path.length - 1, Math.floor(phase(t, 0.5, 6) * (path.length - 1)));
        return (
          <g>
            {lines.map((l, i) => (
              <Trail key={i} points={l.pts.filter((_, j) => j % 3 === 0)} tone="soft" dashed />
            ))}
            <Trail points={path.slice(0, k + 1)} />
            <Ball x={path[k][0]} y={path[k][1]} r={5.5} />
            <Chg x={230} y={130} q={1} t={t} />
            <Chg x={410} y={130} q={-1} t={t} />
            <Label x={320} y={238} kind="label">the line shows the force direction, not the path</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 5. dipole

/** A dipole with exact fields at points along the axis and along the middle line. */
export function DipoleField() {
  return (
    <Anim title="A positive and a negative charge close together; a test point moves out along the axis and along the perpendicular, and the field arrow there is the vector sum of the two charge fields. On the axis it is twice as big and points the other way" height={280} loop={8}>
      {(t) => {
        const cx = 320, cy = 140, a = 22;
        const qs: Q[] = [{ x: cx + a, y: cy, q: 1 }, { x: cx - a, y: cy, q: -1 }];
        const r = lerp(70, 220, 0.5 - 0.5 * Math.cos(TAU * (t / 8)));
        const pAxis: Pt = [cx + r, cy];
        const pEq: Pt = [cx, cy - r * 0.55];
        const sc = 2.6e4;
        const ea = field(qs, pAxis[0], pAxis[1]);
        const ee = field(qs, pEq[0], pEq[1]);
        const parts = (p: Pt) => qs.map((c) => field([c], p[0], p[1]));
        return (
          <g>
            <Line x1={cx - 250} y1={cy} x2={cx + 250} y2={cy} tone="soft" dashed />
            <Line x1={cx} y1={20} x2={cx} y2={260} tone="soft" dashed />
            <Chg x={qs[0].x} y={qs[0].y} q={1} t={t} />
            <Chg x={qs[1].x} y={qs[1].y} q={-1} t={t} />
            {parts(pAxis).map((e, i) => (
              <Arrow key={`a${i}`} x1={pAxis[0]} y1={pAxis[1]} x2={pAxis[0] + e[0] * sc} y2={pAxis[1] + e[1] * sc} tone="soft" width={1.8} />
            ))}
            <Arrow x1={pAxis[0]} y1={pAxis[1] + 22} x2={pAxis[0] + ea[0] * sc} y2={pAxis[1] + 22} width={3.5} label="E" />
            {parts(pEq).map((e, i) => (
              <Arrow key={`e${i}`} x1={pEq[0]} y1={pEq[1]} x2={pEq[0] + e[0] * sc} y2={pEq[1] + e[1] * sc} tone="soft" width={1.8} />
            ))}
            <Arrow x1={pEq[0] + 8} y1={pEq[1]} x2={pEq[0] + 8 + ee[0] * sc} y2={pEq[1] + ee[1] * sc} width={3.5} label="E" />
            <Ball x={pAxis[0]} y={pAxis[1]} r={4.5} />
            <Ball x={pEq[0]} y={pEq[1]} r={4.5} />
            <Label x={pAxis[0]} y={cy - 24} kind="label">on the axis</Label>
            <Label x={cx + 90} y={pEq[1] - 14} kind="label">on the middle line</Label>
            <Readout>{`E axis : E middle = ${(Math.abs(ea[0]) / Math.abs(ee[0])).toFixed(2)}`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** A dipole in a uniform field turns toward it: torque, then swings and settles. */
export function DipoleTorque() {
  return (
    <Anim title="A dipole in a uniform field feels equal and opposite forces that twist it; it swings about the field direction, with the torque arrow shrinking as it lines up" height={250} loop={9}>
      {(t) => {
        const th = 1.15 * Math.exp(-0.22 * t) * Math.cos(2.4 * t);
        const cx = 260, cy = 125, L = 70;
        const dx = L * Math.cos(th), dy = -L * Math.sin(th);
        const tau = Math.sin(th);
        const arrows = [60, 125, 190].map((y) => <Arrow key={y} x1={30 + ((t * 40 + y) % 40)} y1={y} x2={90 + ((t * 40 + y) % 40)} y2={y} tone="soft" width={1.4} />);
        return (
          <g>
            {arrows}
            <Line x1={cx - dx} y1={cy + dy} x2={cx + dx} y2={cy - dy} tone="bright" />
            <Arrow x1={cx + dx} y1={cy - dy} x2={cx + dx + 46} y2={cy - dy} width={2.4} label="qE" />
            <Arrow x1={cx - dx} y1={cy + dy} x2={cx - dx - 46} y2={cy + dy} width={2.4} label="qE" />
            <Chg x={cx + dx} y={cy - dy} q={1} r={10} />
            <Chg x={cx - dx} y={cy + dy} q={-1} r={10} />
            <Arrow x1={cx} y1={cy} x2={cx + 56 * Math.cos(th / 2 + 0.0)} y2={cy - 56 * Math.sin(th / 2)} tone="soft" dashed />
            <Line x1={cx} y1={cy} x2={cx + 86} y2={cy} tone="soft" dashed />
            <Label x={cx + 104} y={cy + 6} kind="sym">E</Label>
            <Label x={cx + 62} y={cy - 8} kind="sym">θ</Label>
            <Arrow x1={470} y1={190} x2={470} y2={190 - 90 * Math.abs(tau)} width={4} label="τ" />
            <Label x={470} y={218} kind="label">torque</Label>
            <Readout>{`τ = pE sin θ = ${tau.toFixed(2)} pE`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 6. flux

/** Flux through a flat surface: the number of field lines that pass depends on the tilt. */
export function Flux({ height = 270 }: { height?: number }) {
  return (
    <Anim title="Parallel field lines pass through a flat surface that slowly tilts; the lines that pass are highlighted and counted, and the count follows cosine of the angle between the surface normal and the field" height={height} loop={10}>
      {(t) => {
        const th = (Math.PI / 2) * (0.5 - 0.5 * Math.cos(TAU * (t / 10)));
        const cx = 330, cy = height / 2, L = 100;
        const sx = Math.sin(th) * L, sy = Math.cos(th) * L;
        const top = cy - sy, bot = cy + sy;
        const lines: ReactNode[] = [];
        let count = 0;
        for (let y = 34; y < height - 10; y += 15) {
          const hit = y >= top && y <= bot;
          if (hit) count++;
          lines.push(<Line key={y} x1={20} y1={y} x2={W - 20} y2={y} tone="soft" dashed={!hit} />);
          const o = (t * 50 + y * 3) % 70;
          for (let x = 20 + o; x < W - 20; x += 70) lines.push(<circle key={`${y}-${x}`} className="fig-ball" cx={x} cy={y} r={hit ? 2.6 : 1.6} style={{ opacity: hit ? 1 : 0.4 }} />);
        }
        return (
          <g>
            {lines}
            <Line x1={cx - sx} y1={top} x2={cx + sx} y2={bot} tone="bright" />
            <Arrow x1={cx} y1={cy} x2={cx + 46 * Math.cos(th)} y2={cy - 46 * Math.sin(th)} width={3} label="n" />
            <Line x1={cx + 120} y1={top} x2={cx + 120} y2={bot} tone="soft" />
            <Label x={cx + 130} y={cy + 6} kind="label" anchor="start">shadow</Label>
            <Readout>{`θ = ${((th * 180) / Math.PI).toFixed(0)}°,  lines through: ${count},  cos θ = ${Math.cos(th).toFixed(2)}`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 7. Gauss's law

/** Lines from a charge cross a closed surface: out minus in is the same wherever the charge is inside, and zero when it is outside. */
export function GaussCount({ height = 270, outside }: { height?: number; outside?: boolean }) {
  return (
    <Anim title="Rays from a moving charge cross a closed circle. With the charge inside every ray leaves once, so the net count is constant however the charge moves; with it outside, every ray that enters also leaves, so the net is zero" height={height} loop={12}>
      {(t) => {
        const cx = 210, cy = height / 2, R = 74;
        const pos = (): Pt => {
          if (outside) return [cx + 190 + 24 * Math.cos(TAU * t / 6), cy + 70 * Math.sin(TAU * t / 6) * 0.9];
          if (t < 4) return [cx + 40 * Math.cos(1.6 * t), cy + 28 * Math.sin(1.6 * t)];
          if (t < 6) {
            const p = ease(phase(t, 4, 6));
            const x0 = cx + 40 * Math.cos(6.4), y0 = cy + 28 * Math.sin(6.4);
            return [lerp(x0, cx + 215, p), lerp(y0, cy - 70, p)];
          }
          if (t < 10) return [cx + 215 + 18 * Math.cos(1.6 * (t - 6)), cy - 70 + 18 * Math.sin(1.6 * (t - 6))];
          const p = ease(phase(t, 10, 12));
          const x1 = cx + 215 + 18 * Math.cos(1.6 * 4), y1 = cy - 70 + 18 * Math.sin(1.6 * 4);
          const xs = cx + 40, ys = cy;
          return [lerp(x1, xs, p), lerp(y1, ys, p)];
        };
        const [px, py] = pos();
        const N = 16;
        let out = 0, inn = 0;
        const rays: ReactNode[] = [];
        for (let i = 0; i < N; i++) {
          const a = TAU * (i / N) + 0.2;
          const dx = Math.cos(a), dy = Math.sin(a);
          const fx = px - cx, fy = py - cy;
          const b = fx * dx + fy * dy;
          const c = fx * fx + fy * fy - R * R;
          const disc = b * b - c;
          let s1 = -1, s2 = -1;
          if (disc > 0) {
            s1 = -b - Math.sqrt(disc);
            s2 = -b + Math.sqrt(disc);
          }
          const crossesOut = s2 > 0;
          const crossesIn = s1 > 0;
          if (crossesOut) out++;
          if (crossesIn) inn++;
          rays.push(<Line key={`r${i}`} x1={px} y1={py} x2={px + dx * 420} y2={py + dy * 420} tone="soft" />);
          for (let s = (t * 50 + i * 9) % 55; s < 360; s += 55) rays.push(<circle key={`d${i}-${s}`} className="fig-ball" cx={px + dx * s} cy={py + dy * s} r={2} />);
          if (crossesOut) rays.push(<circle key={`o${i}`} className="fig-ball" cx={px + dx * s2} cy={py + dy * s2} r={4.2} />);
          if (crossesIn) rays.push(<circle key={`i${i}`} className="fig-ghost" cx={px + dx * s1} cy={py + dy * s1} r={4.2} />);
        }
        return (
          <g>
            {rays}
            <circle className="fig-bar" cx={cx} cy={cy} r={R} fill="rgba(0,0,0,0.0)" style={{ strokeWidth: 2.6 }} />
            <Chg x={px} y={py} q={1} r={9} />
            <Label x={cx} y={cy + R + 22} kind="label">closed surface</Label>
            <rect className="fig-guide" x={452} y={cy - 62} width={176} height={128} rx={8} style={{ fill: 'var(--page)' }} />
            <Label x={466} y={cy - 36} kind="val" anchor="start">{`leaving (●): ${out}`}</Label>
            <Label x={466} y={cy - 14} kind="val" anchor="start">{`entering (○): ${inn}`}</Label>
            <Label x={466} y={cy + 18} kind="sym" anchor="start">{`net = ${out - inn}`}</Label>
            <Label x={466} y={cy + 46} kind="label" anchor="start">{out - inn > 0 ? 'charge inside' : 'no charge inside'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 8. applications

/** A charged spherical shell: field zero inside, kQ / r² outside, with a probe sweeping across. */
export function ShellField({ height = 260 }: { height?: number }) {
  return (
    <Anim title="A charged spherical shell with a probe charge moving out from the centre; a graph shows the field staying zero inside, jumping at the surface and falling as one over r squared outside" height={height} loop={9}>
      {(t) => {
        const u = ease(phase(t, 0.4, 8));
        const cx = 140, cy = height / 2 - 4, R = 62;
        const r = u * 130;
        const Rr = R;
        const E = r < Rr ? 0 : (Rr / r) ** 2;
        const gx = 340, gy = height - 50, gw = 270, gh = height - 100;
        const gp = (x: number): Pt => [gx + (x / 130) * gw, gy - (x < Rr ? 0 : (Rr / x) ** 2) * gh];
        const pts: Pt[] = [[gx, gy], [gx + (Rr / 130) * gw, gy], [gx + (Rr / 130) * gw, gy - gh], ...curve(60, 130 - Rr, (k) => gp(Rr + k) as Pt)];
        const shown = pts.filter((p) => p[0] <= gx + (r / 130) * gw + 0.01);
        return (
          <g>
            <circle className="kit-block" cx={cx} cy={cy} r={R} />
            {Array.from({ length: 16 }, (_, i) => <Dot key={i} x={cx + R * Math.cos(TAU * i / 16)} y={cy + R * Math.sin(TAU * i / 16)} q={1} r={3.6} />)}
            {r < Rr && <Label x={cx} y={cy - 22} kind="label">E = 0 inside</Label>}
            <circle className="fig-guide fig-dash" cx={cx} cy={cy} r={Math.max(r, 2)} />
            <Arrow x1={cx + r} y1={cy} x2={cx + r + 54 * E} y2={cy} width={3.4} label="E" />
            <Chg x={cx + r} y={cy} q={1} r={6} />
            <Axes x={gx} y={gy} w={gw} h={gh + 14} xLabel="r" yLabel="E" />
            <Line x1={gx + (Rr / 130) * gw} y1={gy} x2={gx + (Rr / 130) * gw} y2={gy + 8} tone="soft" />
            <Label x={gx + (Rr / 130) * gw} y={gy + 24} kind="sym">R</Label>
            <Trail points={shown} />
            <Ball x={gp(r)[0]} y={gp(r)[1]} r={5} />
            <Readout>{r < Rr ? 'inside: E = 0' : `outside: E = ${E.toFixed(2)} E(R)`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** A long line of charge: field points straight out and falls as 1 / r. */
export function LineField() {
  return (
    <Anim title="A long straight line of charge seen end on, with radial field arrows and a probe moving away; the field falls in proportion to one over the distance, shown on a graph" height={260} loop={9}>
      {(t) => {
        const cx = 150, cy = 130;
        const r = lerp(30, 130, 0.5 - 0.5 * Math.cos(TAU * (t / 9)));
        const arrows: ReactNode[] = [];
        for (let k = 0; k < 12; k++) {
          const a = TAU * (k / 12);
          for (const R of [38, 78, 118]) {
            const L = 36 * (38 / R);
            const w = 0.85 + 0.15 * Math.sin(TAU * (t / 3) - R / 28);
            arrows.push(<Arrow key={`${k}-${R}`} x1={cx + R * Math.cos(a)} y1={cy + R * Math.sin(a)} x2={cx + (R + L * w) * Math.cos(a)} y2={cy + (R + L * w) * Math.sin(a)} tone="soft" width={1.4} />);
          }
        }
        const gx = 360, gy = 220, gw = 250, gh = 150;
        const gp = (x: number): Pt => [gx + ((x - 30) / 100) * gw, gy - (30 / x) * gh * 0.95];
        return (
          <g>
            {arrows}
            <Chg x={cx} y={cy} q={1} r={9} t={t} />
            <circle className="fig-guide fig-dash" cx={cx} cy={cy} r={r} />
            <Chg x={cx + r * Math.cos(0.4)} y={cy + r * Math.sin(0.4)} q={1} r={5} />
            <Axes x={gx} y={gy} w={gw} h={gh} xLabel="r" yLabel="E" />
            <Trail points={curve(60, 100, (k) => gp(30 + k))} tone="soft" />
            <Ball x={gp(r)[0]} y={gp(r)[1]} r={5} />
            <Label x={gx + gw / 2} y={248} kind="val">{`r = ${(r / 30).toFixed(1)} r₀,  E = ${(30 / r).toFixed(2)} E₀`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** An infinite plane of charge: the field is uniform and does not weaken with distance. */
export function SheetField({ height = 250 }: { height?: number }) {
  return (
    <Anim title="A large flat sheet of positive charge with straight field arrows of equal length on both sides; a probe moves away and its field reading does not change" height={height} loop={8}>
      {(t) => {
        const cx = 320, cy = height / 2;
        const r = lerp(30, 260, 0.5 - 0.5 * Math.cos(TAU * (t / 8)));
        const items: ReactNode[] = [];
        for (let y = 46; y < height - 10; y += 28) {
          for (const sg of [-1, 1]) {
            for (const d of [40, 130, 220]) {
              const a = 0.8 + 0.2 * Math.sin(TAU * (t / 3) - d / 40);
              items.push(<Arrow key={`${y}${sg}${d}`} x1={cx + sg * d} y1={y} x2={cx + sg * (d + 44 * a)} y2={y} tone="soft" width={1.4} />);
            }
          }
        }
        return (
          <g>
            {items}
            <rect className="kit-block is-filled" x={cx - 4} y={4} width={8} height={height - 8} />
            {Array.from({ length: 7 }, (_, i) => <text key={i} x={cx + 14} y={22 + i * ((height - 30) / 6)} style={{ fill: '#fff', fontSize: 14, fontFamily: 'var(--mono)' }}>+</text>)}
            <Chg x={cx + r} y={cy} q={1} r={7} />
            <Arrow x1={cx + r} y1={cy + 24} x2={cx + r + 60} y2={cy + 24} width={3.4} label="E" />
            <Line x1={cx} y1={cy + 48} x2={cx + r} y2={cy + 48} tone="soft" />
            <Label x={cx + r / 2} y={cy + 66} kind="val">{`distance ${(r / 30).toFixed(1)}`}</Label>
            <Readout>{'E = σ/2ε₀ everywhere'}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Where the field of 4q and q cancels: arrows from each charge along the line between them. */
export function NullPoint() {
  return (
    <Anim title="A big charge and a small charge on a line; a test point slides between them and the two field arrows are drawn. They are equal and opposite only at one point, closer to the small charge" height={230} loop={9}>
      {(t) => {
        const x1 = 90, x2 = 550, cy = 120;
        const D = x2 - x1;
        const d1 = 0.1 + 0.17 * (0.5 - 0.5 * Math.cos(TAU * (t / 9)));
        const px = x1 + (d1 / 0.3) * D;
        const e1 = 4 / (d1 * d1);
        const e2 = 1 / ((0.3 - d1) * (0.3 - d1));
        const bal = Math.abs(e1 - e2) < 0.04 * e1;
        return (
          <g>
            <Line x1={x1} y1={cy + 46} x2={x2} y2={cy + 46} tone="soft" />
            <Line x1={x1 + (0.2 / 0.3) * D} y1={cy + 38} x2={x1 + (0.2 / 0.3) * D} y2={cy + 54} tone="soft" />
            <Label x={x1 + (0.2 / 0.3) * D} y={cy + 72} kind="label">0.2 m from the 4 μC charge</Label>
            <Chg x={x1} y={cy} q={1} r={16} t={t} />
            <Chg x={x2} y={cy} q={1} r={9} t={t} />
            <Arrow x1={px} y1={cy - 22} x2={px + Math.min(170, e1 * 0.9)} y2={cy - 22} label={<tspan>E₁</tspan>} />
            <Arrow x1={px} y1={cy - 50} x2={px - Math.min(170, e2 * 0.9)} y2={cy - 50} label={<tspan>E₂</tspan>} />
            <Ball x={px} y={cy} r={5} />
            <Label x={x1} y={cy + 36} kind="val" anchor="middle">4 μC</Label>
            <Label x={x2} y={cy + 28} kind="val">1 μC</Label>
            <Readout>{bal ? 'E₁ = E₂ : net field zero' : `E₁ / E₂ = ${(e1 / e2).toFixed(2)}`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** An electron in a uniform field accelerates against the field. */
export function UniformAccel() {
  return (
    <Anim title="An electron released in a uniform field moves against the field direction with steadily growing speed, leaving a widening trail of positions" height={200} loop={7}>
      {(t) => {
        const s = Math.min(1, t / 5);
        const x = 580 - 520 * s * s;
        const trail: ReactNode[] = [];
        for (let i = 0; i <= 10; i++) {
          const si = (i / 10) * s;
          trail.push(<circle key={i} className="fig-ghost" cx={580 - 520 * si * si} cy={100} r={5} style={{ opacity: 0.3 }} />);
        }
        const v = 2 * s;
        return (
          <g>
            {[40, 160].map((y) => <Arrow key={y} x1={60 + ((t * 30 + y) % 40)} y1={y} x2={110 + ((t * 30 + y) % 40)} y2={y} tone="soft" width={1.4} />)}
            {trail}
            <Chg x={x} y={100} q={-1} r={9} />
            <Arrow x1={x} y1={72} x2={x - 18 - 45 * v} y2={72} width={3} label="v" />
            <Label x={90} y={190} kind="val">E →</Label>
            <Readout>{`a = eE / m (constant),  v ∝ t`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}
