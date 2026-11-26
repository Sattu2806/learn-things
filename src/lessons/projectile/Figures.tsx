/**
 * Diagrams for the theory page, drawn as SVG in the film's black-and-white
 * style. Every path is computed from the physics, at true proportions.
 */
import { useId } from 'react';
import { at, solve, type Launch } from './numbers';

const DEG = Math.PI / 180;

function useUid() {
  return useId().replace(/[^a-zA-Z0-9_-]/g, '');
}

export interface SketchThrow extends Launch {
  /** Written above the top of the arc, e.g. "45°" or "Moon". */
  label?: string;
  muted?: boolean;
}

interface SketchProps {
  throws: SketchThrow[];
  /** What the picture shows, for screen readers. */
  title: string;
  height?: number;
  /** Measurements to mark on the first strong throw; the strings are the values. */
  marks?: { height?: string; range?: string; angle?: boolean; launch?: string };
  /** Show the no-gravity straight line, the ghost and the drop at this time. */
  ghostAt?: number;
  ball?: 'end' | 'top' | 'animate' | 'none';
}

const W = 640;

export function TrajectorySketch({ throws, title, height = 270, marks = {}, ghostAt, ball = 'end' }: SketchProps) {
  const uid = useUid();
  const items = throws.map((t) => ({ t, s: solve(t) }));
  const main = items.find((i) => !i.t.muted) ?? items[0];
  const h0 = main.t.h ?? 0;
  const cliff = items.some((i) => (i.t.h ?? 0) > 0);
  const padL = cliff ? 104 : 40;
  const padR = 36;
  const padT = 44;
  const padB = marks.range ? 70 : 34;
  const straight = (t: number) => at({ ...main.t, g: 0 }, t);
  let maxX = Math.max(0.5, ...items.map((i) => i.s.R));
  let maxY = Math.max(0.5, ...items.map((i) => i.s.H));
  if (ghostAt !== undefined) {
    maxY = Math.max(maxY, straight(ghostAt).y * 1.06);
    maxX = Math.max(maxX, straight(ghostAt).x);
  }
  const k = Math.min((W - padL - padR) / maxX, (height - padT - padB) / maxY);
  const X = (x: number) => padL + x * k;
  const Y = (y: number) => height - padB - y * k;
  const ground = Y(0);

  const trace = (l: Launch, t0: number, t1: number, n = 80) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
      const p = at(l, t0 + ((t1 - t0) * i) / n);
      pts.push([X(p.x), Y(Math.max(0, p.y))]);
    }
    return pts;
  };
  const d = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');

  const s = main.s;
  const top = at(main.t, s.tTop);
  const land = X(s.R);
  const launchY = Y(h0);

  // Moving ball: equal steps in time, so it slows at the top like the real thing.
  let motion: { path: string; keyPoints: string; keyTimes: string; dur: number } | null = null;
  if (ball === 'animate' && s.T > 0) {
    const pts = trace(main.t, 0, s.T, 60);
    const lens = [0];
    for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = lens[lens.length - 1] || 1;
    const fly = 0.82;
    motion = {
      path: d(pts),
      keyPoints: [...lens.map((l) => (l / total).toFixed(4)), '1'].join(';'),
      keyTimes: [...lens.map((_, i) => ((i / (pts.length - 1)) * fly).toFixed(4)), '1'].join(';'),
      dur: Math.min(3.6, Math.max(1.4, s.T)) / fly,
    };
  }
  const rest = ball === 'top' ? [X(top.x), Y(top.y)] : [land, ground];

  return (
    <svg className="fig" viewBox={`0 0 ${W} ${height}`} role="img" aria-label={title}>
      <defs>
        <radialGradient id={`glow${uid}`}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <line className="fig-ground" x1={0} x2={W} y1={ground} y2={ground} />
      {cliff && (
        <g>
          <path className="fig-cliff" d={`M${X(0) - 64} ${ground}V${launchY}H${X(0)}V${ground}`} />
          {marks.launch && (
            <text className="fig-val" x={X(0) - 32} y={(launchY + ground) / 2 + 4} textAnchor="middle">
              {marks.launch}
            </text>
          )}
        </g>
      )}

      {ghostAt !== undefined &&
        (() => {
          const a = Math.atan2(main.s.vy, main.s.vx);
          const exit = Math.min((W - X(0)) / Math.max(1e-6, main.s.vx * k), (launchY - 6) / Math.max(1e-6, main.s.vy * k));
          const far = straight(exit);
          const gp = straight(ghostAt);
          const bp = at(main.t, ghostAt);
          const gx = X(gp.x);
          const gy = Y(gp.y);
          const by = Y(bp.y);
          const mid = straight(ghostAt * 0.42);
          return (
            <g>
              <line className="fig-guide fig-dash" x1={X(0)} y1={launchY} x2={X(far.x)} y2={Y(far.y)} />
              <text className="fig-label" transform={`translate(${X(mid.x)} ${Y(mid.y)}) rotate(${-a / DEG})`} y={-12} textAnchor="middle">
                no gravity
              </text>
              <path className="fig-path is-muted fig-dash" d={d(trace(main.t, ghostAt, s.T))} />
              <path className="fig-path" d={d(trace(main.t, 0, ghostAt))} />
              <line className="fig-bar" x1={gx} x2={gx} y1={gy + 10} y2={by - 9} />
              <line className="fig-bar" x1={gx - 6} x2={gx + 6} y1={gy + 10} y2={gy + 10} />
              <line className="fig-bar" x1={gx - 6} x2={gx + 6} y1={by - 9} y2={by - 9} />
              <text className="fig-sym" x={gx + 12} y={(gy + by) / 2 + 7}>
                ½gt²
              </text>
              <circle className="fig-ghost" cx={gx} cy={gy} r={7} />
              <circle className="fig-glow" cx={gx} cy={by} r={18} fill={`url(#glow${uid})`} />
              <circle className="fig-ball" cx={gx} cy={by} r={6.5} />
            </g>
          );
        })()}

      {ghostAt === undefined &&
        items.map(({ t, s: si }, i) => (
          <g key={i}>
            <path className={t.muted ? 'fig-path is-muted' : 'fig-path'} d={d(trace(t, 0, si.T))} />
            {t.label && (
              <text className="fig-label" x={X(at(t, si.tTop).x)} y={Y(si.H) - 12} textAnchor="middle">
                {t.label}
              </text>
            )}
          </g>
        ))}

      {marks.height && s.tTop > 0 && (
        <g>
          <line className="fig-guide fig-dash" x1={X(top.x)} x2={X(top.x)} y1={Y(top.y) + 9} y2={ground} />
          <text x={X(top.x) + 12} y={(Y(top.y) + ground) / 2 + 6}>
            <tspan className="fig-sym">H</tspan>
            <tspan className="fig-val" dx={6}>
              {marks.height}
            </tspan>
          </text>
        </g>
      )}
      {marks.range && s.R > 0 && (
        <g>
          <line className="fig-bar" x1={X(0)} x2={land} y1={ground + 22} y2={ground + 22} />
          <line className="fig-bar" x1={X(0)} x2={X(0)} y1={ground + 15} y2={ground + 29} />
          <line className="fig-bar" x1={land} x2={land} y1={ground + 15} y2={ground + 29} />
          <text x={(X(0) + land) / 2} y={ground + 52} textAnchor="middle">
            <tspan className="fig-sym">R</tspan>
            <tspan className="fig-val" dx={6}>
              {marks.range}
            </tspan>
          </text>
        </g>
      )}
      {marks.angle && main.t.theta > 0 && (
        <g>
          {h0 > 0 && <line className="fig-guide fig-dash" x1={X(0)} x2={X(0) + 70} y1={launchY} y2={launchY} />}
          <path
            className="fig-guide"
            d={`M${X(0) + 40} ${launchY}A40 40 0 0 0 ${X(0) + 40 * Math.cos(main.t.theta * DEG)} ${launchY - 40 * Math.sin(main.t.theta * DEG)}`}
          />
          <text className="fig-sym" x={X(0) + 58 * Math.cos((main.t.theta / 2) * DEG)} y={launchY - 58 * Math.sin((main.t.theta / 2) * DEG) + 7} textAnchor="middle">
            θ
          </text>
        </g>
      )}

      {ghostAt === undefined && ball !== 'none' && (
        <g>
          <g className={motion ? 'fig-still' : undefined}>
            <circle className="fig-glow" cx={rest[0]} cy={rest[1] - 6.5} r={18} fill={`url(#glow${uid})`} />
            <circle className="fig-ball" cx={rest[0]} cy={rest[1] - 6.5} r={6.5} />
          </g>
          {motion && (
            <g className="fig-moving" transform="translate(0 -6.5)">
              <circle className="fig-glow" r={18} fill={`url(#glow${uid})`}>
                <animateMotion dur={`${motion.dur}s`} repeatCount="indefinite" path={motion.path} keyPoints={motion.keyPoints} keyTimes={motion.keyTimes} calcMode="linear" />
              </circle>
              <circle className="fig-ball" r={6.5}>
                <animateMotion dur={`${motion.dur}s`} repeatCount="indefinite" path={motion.path} keyPoints={motion.keyPoints} keyTimes={motion.keyTimes} calcMode="linear" />
              </circle>
            </g>
          )}
        </g>
      )}
    </svg>
  );
}

/** The launch speed split into its sideways and upward parts. */
export function VectorFigure() {
  const uid = useUid();
  const x0 = 70;
  const y0 = 206;
  const L = 250;
  const a = 40 * DEG;
  const tx = x0 + L * Math.cos(a);
  const ty = y0 - L * Math.sin(a);
  return (
    <svg className="fig fig-narrow" viewBox="0 0 440 250" role="img" aria-label="The speed v at angle theta, split into v cos theta sideways and v sin theta upward">
      <defs>
        <marker id={`head${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
          <path className="fig-head" d="M0 0L10 5L0 10z" fill="#fff" />
        </marker>
      </defs>
      <line className="fig-ground" x1={20} x2={420} y1={y0} y2={y0} />
      <line className="fig-guide fig-dash" x1={x0} y1={y0} x2={tx - 4} y2={y0} markerEnd={`url(#head${uid})`} />
      <line className="fig-guide fig-dash" x1={tx} y1={y0} x2={tx} y2={ty + 5} markerEnd={`url(#head${uid})`} />
      <path className="fig-guide" d={`M${tx - 12} ${y0}V${y0 - 12}H${tx}`} />
      <line className="fig-vec" x1={x0} y1={y0} x2={tx - 4 * Math.cos(a)} y2={ty + 4 * Math.sin(a)} markerEnd={`url(#head${uid})`} />
      <path className="fig-guide" d={`M${x0 + 48} ${y0}A48 48 0 0 0 ${x0 + 48 * Math.cos(a)} ${y0 - 48 * Math.sin(a)}`} />
      <text className="fig-sym" x={x0 + 70 * Math.cos(a / 2)} y={y0 - 70 * Math.sin(a / 2) + 7} textAnchor="middle">
        θ
      </text>
      <text className="fig-sym fig-big" x={(x0 + tx) / 2 - 20 * Math.sin(a)} y={(y0 + ty) / 2 - 20 * Math.cos(a)} textAnchor="middle">
        v
      </text>
      <text className="fig-sym" x={(x0 + tx) / 2} y={y0 + 32} textAnchor="middle">
        v cos θ
      </text>
      <text className="fig-sym" x={tx + 14} y={(y0 + ty) / 2 + 7}>
        v sin θ
      </text>
    </svg>
  );
}

/** A dropped ball, flashed every second, beside odd numbers stacking into squares. */
export function FallFigure() {
  const x = 170;
  const y0 = 34;
  const u = 15;
  const yAt = (k: number) => y0 + k * k * u;
  const cell = 40;
  const gx = 330;
  const gy = 40;
  return (
    <svg className="fig" viewBox="0 0 680 310" role="img" aria-label="A dropped ball falls 1, 4, 9 and 16 units after 1, 2, 3 and 4 seconds; each second it falls 1, 3, 5 then 7 units, and odd numbers add up to squares">
      <line className="fig-guide" x1={x - 30} x2={x + 30} y1={y0} y2={y0} />
      <line className="fig-guide fig-dash fig-faint" x1={x} x2={x} y1={y0} y2={yAt(4) + 12} />
      {[1, 2, 3, 4].map((k) => (
        <g key={k}>
          <text className="fig-val" x={x - 150} y={yAt(k) + 5} textAnchor="end">
            {k} s
          </text>
          <line className="fig-guide fig-dash fig-faint" x1={x - 92} x2={x - 14} y1={yAt(k)} y2={yAt(k)} />
          <text className="fig-sym" x={x - 100} y={yAt(k) + 8} textAnchor="end">
            {k * k}
          </text>
          <circle className={k === 4 ? 'fig-ball' : 'fig-dot'} cx={x} cy={yAt(k)} r={k === 4 ? 7 : 5.5} />
          <path className="fig-bar" d={`M${x + 22} ${yAt(k - 1) + 4}H${x + 30}V${yAt(k) - 4}H${x + 22}`} />
          <text className="fig-sym" x={x + 42} y={(yAt(k - 1) + yAt(k)) / 2 + 7}>
            {2 * k - 1}
          </text>
        </g>
      ))}
      {[1, 2, 3, 4].map((k) =>
        Array.from({ length: 2 * k - 1 }, (_, j) => {
          const [cx, cy] = j < k ? [k - 1, j] : [j - k, k - 1];
          return <rect key={`${k}-${j}`} className={k % 2 ? 'fig-cell is-lit' : 'fig-cell'} x={gx + cx * cell} y={gy + cy * cell} width={cell - 5} height={cell - 5} rx={5} />;
        }),
      )}
      {[1, 2, 3, 4].map((k) => (
        <text key={k} className="fig-sym" x={gx + (k - 1) * cell + (cell - 5) / 2} y={gy + (k - 1) * cell + (cell - 5) / 2 + 7} textAnchor="middle">
          {2 * k - 1}
        </text>
      ))}
      {['1', '1 + 3', '1 + 3 + 5', '1 + 3 + 5 + 7'].map((sum, i) => (
        <text key={sum} className="fig-sum" x={gx + 4 * cell + 22} y={gy + i * cell + 25}>
          {sum} = {i + 1}
          <tspan className="fig-sup" dy={-9}>
            2
          </tspan>
        </text>
      ))}
    </svg>
  );
}
