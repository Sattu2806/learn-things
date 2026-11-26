/**
 * Animated diagrams for the theory and the questions. One clock moves every
 * ball at the same physical time, so two projectiles, a plane and its packet,
 * or a ball and its ghost stay in step. Everything is drawn from the physics.
 */
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { samplePath, sampleAt, type PathSpec, type Sample } from './numbers';

const DEG = Math.PI / 180;

export interface SceneThrow extends PathSpec {
  label?: string;
  muted?: boolean;
  marker?: 'ball' | 'plane' | 'ghost';
  /** A velocity arrow that rides on the ball. */
  arrow?: boolean;
  /** Also show the arrow's sideways and upward parts. */
  components?: boolean;
  /** Hide the trail (a plane leaves none). */
  noTrail?: boolean;
  /** Start this many seconds after the others (a rebound, a second shot). */
  delay?: number;
  /** Hide the ball once its path ends (another throw carries on from there). */
  handOff?: boolean;
}

export interface SceneSpec {
  title: string;
  throws: SceneThrow[];
  /** Draw the ground as a slope of this angle through the launch point. */
  incline?: number;
  wall?: { x: number; h: number; label?: string };
  target?: { x: number; y: number; label?: string };
  /** A dashed level line; the moments the first ball crosses it are marked. */
  level?: { y: number; label?: string };
  /** A dashed line joining the first two balls (relative motion). */
  link?: boolean;
  /** The circle that matches the path at the top of the first throw. */
  curvature?: boolean;
  /** Freeze an extra velocity arrow on the first throw at this time, next to the launch arrow. */
  freeze?: { t: number; label?: string };
  marks?: { height?: string; range?: string; angle?: boolean; launch?: string; slope?: string };
  height?: number;
  /** Show the running time. */
  clock?: boolean;
  /** Don't draw a cliff under a ball that starts high (a plane's packet). */
  noCliff?: boolean;
}

const W = 640;

function usePrefersStill() {
  const [still, setStill] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setStill(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return still;
}

/** A looping clock that only runs while the diagram is on screen. */
function useLoop(ref: React.RefObject<Element | null>, period: number, still: boolean) {
  const [t, setT] = useState(still ? period : 0);
  useEffect(() => {
    if (still) {
      setT(period);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let start = 0;
    let visible = false;
    const tick = (now: number) => {
      if (!start) start = now - t * 1000;
      setT(((now - start) / 1000) % period);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) {
        visible = true;
        start = 0;
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // The loop restarts only when the diagram itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, period, still]);
  return t;
}

export function Scene(spec: SceneSpec) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const svgRef = useRef<SVGSVGElement>(null);
  const still = usePrefersStill();
  const H = spec.height ?? 280;

  const paths = useMemo(() => spec.throws.map((th) => samplePath({ ...th, incline: th.incline ?? spec.incline })), [spec.throws, spec.incline]);
  const delayOf = (i: number) => spec.throws[i].delay ?? 0;
  const tMax = Math.max(...paths.map((p, i) => p[p.length - 1].t + delayOf(i)), 0.1);
  // Real flights of 1 to 15 s all play in 2 to 4 s, then hold for a moment.
  const play = Math.min(4, Math.max(2, tMax * 0.9));
  const hold = 1.1;
  const clock = useLoop(svgRef, play + hold, still);
  const T = Math.min(tMax, (Math.min(clock, play) / play) * tMax);

  // ------------------------------------------------------------ the frame
  const pts: { x: number; y: number }[] = paths.flat();
  pts.push({ x: 0, y: 0 });
  if (spec.wall) pts.push({ x: spec.wall.x, y: spec.wall.h });
  if (spec.target) pts.push({ x: spec.target.x, y: spec.target.y });
  if (spec.level) pts.push({ x: 0, y: spec.level.y });
  const xMin = Math.min(...pts.map((p) => p.x));
  const xMax = Math.max(...pts.map((p) => p.x), xMin + 1);
  const yMin = Math.min(...pts.map((p) => p.y), 0);
  const yMax = Math.max(...pts.map((p) => p.y), yMin + 1);
  const cliffH = spec.noCliff ? 0 : Math.max(0, ...spec.throws.filter((th) => !th.x0 && th.marker !== 'plane').map((th) => th.h ?? 0));
  const padL = cliffH > 0 ? 100 : 44;
  const padR = 44;
  const padT = 46;
  const padB = spec.marks?.range ? 72 : 36;
  const k = Math.min((W - padL - padR) / (xMax - xMin), (H - padT - padB) / (yMax - yMin));
  const X = (x: number) => padL + (x - xMin) * k;
  const Y = (y: number) => H - padB - (y - yMin) * k;
  const d = (ss: Sample[]) => ss.map((s, i) => `${i ? 'L' : 'M'}${X(s.x).toFixed(1)} ${Y(s.y).toFixed(1)}`).join('');
  const upTo = (p: Sample[], t: number) => {
    const n = p.filter((s) => s.t <= t);
    return [...n, sampleAt(p, t)];
  };
  // Velocity arrows: the fastest moment of any throw is drawn 78 px long.
  const vScale = 78 / Math.max(...paths.flat().map((p) => Math.hypot(p.vx, p.vy)), 1);

  const arrow = (x: number, y: number, vx: number, vy: number, cls: string, key?: string) => {
    const x2 = x + vx * vScale;
    const y2 = y - vy * vScale;
    if (Math.hypot(x2 - x, y2 - y) < 4) return null;
    return <line key={key} className={cls} x1={x} y1={y} x2={x2} y2={y2} markerEnd={`url(#head${uid})`} />;
  };

  const first = paths[0];
  const th0 = spec.throws[0];
  const top = first.reduce((a, b) => (b.y > a.y ? b : a), first[0]);
  const land = first[first.length - 1];
  const slopeAngle = spec.incline;

  // Level crossings of the first ball.
  const crossings: Sample[] = [];
  if (spec.level) {
    for (let i = 1; i < first.length; i++) {
      const a = first[i - 1].y - spec.level.y;
      const b = first[i].y - spec.level.y;
      if (a === 0 || a * b < 0) {
        const f = a / (a - b || 1);
        crossings.push(sampleAt(first, first[i - 1].t + f * (first[i].t - first[i - 1].t)));
      }
    }
  }

  return (
    <svg ref={svgRef} className="fig scene" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.title}>
      <defs>
        <radialGradient id={`glow${uid}`}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <marker id={`head${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path className="fig-head" d="M0 0L10 5L0 10z" fill="#fff" />
        </marker>
      </defs>

      {/* ground, slope, cliff */}
      {slopeAngle === undefined ? (
        <line className="fig-ground" x1={0} x2={W} y1={Y(0)} y2={Y(0)} />
      ) : (
        <g>
          <line className="fig-guide fig-dash fig-faint" x1={X(0)} x2={W} y1={Y(0)} y2={Y(0)} />
          <line className="fig-ground" x1={X(0) - 30} y1={Y(-30 / k * Math.tan(slopeAngle * DEG))} x2={W} y2={Y(((W - X(0)) / k) * Math.tan(slopeAngle * DEG))} />
          <path className="fig-guide" d={`M${X(0) + 52} ${Y(0)}A52 52 0 0 ${slopeAngle > 0 ? 0 : 1} ${X(0) + 52 * Math.cos(slopeAngle * DEG)} ${Y(0) - 52 * Math.sin(slopeAngle * DEG)}`} />
          <text className="fig-sym" x={X(0) + 66} y={Y(0) - (slopeAngle > 0 ? 6 : -20)}>
            α
          </text>
          {spec.marks?.slope && (
            <text className="fig-val" transform={`translate(${X(land.x * 0.62)} ${Y(land.y * 0.62)}) rotate(${-slopeAngle})`} y={22} textAnchor="middle">
              {spec.marks.slope}
            </text>
          )}
        </g>
      )}
      {cliffH > 0 && (
        <g>
          <path className="fig-cliff" d={`M${X(0) - 64} ${Y(0)}V${Y(cliffH)}H${X(0)}V${Y(0)}`} />
          {spec.marks?.launch && (
            <text className="fig-val" x={X(0) - 32} y={(Y(cliffH) + Y(0)) / 2 + 4} textAnchor="middle">
              {spec.marks.launch}
            </text>
          )}
        </g>
      )}
      {spec.wall && (
        <g>
          <rect className="fig-cliff" x={X(spec.wall.x) - 4} y={Y(spec.wall.h)} width={8} height={Y(0) - Y(spec.wall.h)} />
          {spec.wall.label && (
            <text className="fig-val" x={X(spec.wall.x) + 12} y={Y(spec.wall.h) + 14}>
              {spec.wall.label}
            </text>
          )}
        </g>
      )}
      {spec.target && (
        <g>
          <circle className="fig-guide" cx={X(spec.target.x)} cy={Y(spec.target.y)} r={9} />
          <circle className="fig-ball" cx={X(spec.target.x)} cy={Y(spec.target.y)} r={2.5} />
          {spec.target.label && (
            <text className="fig-val" x={X(spec.target.x) + 14} y={Y(spec.target.y) - 10}>
              {spec.target.label}
            </text>
          )}
        </g>
      )}
      {spec.level && (
        <g>
          <line className="fig-guide fig-dash" x1={X(xMin) - 20} x2={W - 10} y1={Y(spec.level.y)} y2={Y(spec.level.y)} />
          {spec.level.label && (
            <text className="fig-val" x={W - 12} y={Y(spec.level.y) - 8} textAnchor="end">
              {spec.level.label}
            </text>
          )}
          {crossings.map((c, i) => (
            <g key={i} opacity={T >= c.t ? 1 : 0.25}>
              <circle className="fig-ghost" cx={X(c.x)} cy={Y(c.y)} r={8} />
              <text className="fig-val" x={X(c.x)} y={Y(c.y) - 14} textAnchor="middle">
                t{i + 1}
              </text>
            </g>
          ))}
        </g>
      )}

      {/* paths: the whole path faintly, the trail so far brightly */}
      {paths.map((p, i) => {
        const th = spec.throws[i];
        if (th.noTrail) return null;
        return (
          <g key={i}>
            <path className="fig-path is-muted fig-dash" d={d(p)} />
            {T >= delayOf(i) && <path className={th.muted ? 'fig-path is-muted' : 'fig-path'} d={d(upTo(p, T - delayOf(i)))} />}
            {th.label && (
              <text className="fig-label" x={X(p.reduce((a, b) => (b.y > a.y ? b : a), p[0]).x)} y={Y(Math.max(...p.map((s) => s.y))) - 12} textAnchor="middle">
                {th.label}
              </text>
            )}
          </g>
        );
      })}

      {/* measurements */}
      {spec.marks?.height && top.y > 0.01 && (
        <g>
          <line className="fig-guide fig-dash" x1={X(top.x)} x2={X(top.x)} y1={Y(top.y) + 9} y2={Y(0)} />
          <text x={X(top.x) + 12} y={(Y(top.y) + Y(0)) / 2 + 6}>
            <tspan className="fig-sym">H</tspan>
            <tspan className="fig-val" dx={6}>
              {spec.marks.height}
            </tspan>
          </text>
        </g>
      )}
      {spec.marks?.range && (
        <g>
          <line className="fig-bar" x1={X(th0.x0 ?? 0)} x2={X(land.x)} y1={Y(0) + 22} y2={Y(0) + 22} />
          <line className="fig-bar" x1={X(th0.x0 ?? 0)} x2={X(th0.x0 ?? 0)} y1={Y(0) + 15} y2={Y(0) + 29} />
          <line className="fig-bar" x1={X(land.x)} x2={X(land.x)} y1={Y(0) + 15} y2={Y(0) + 29} />
          <text x={(X(th0.x0 ?? 0) + X(land.x)) / 2} y={Y(0) + 52} textAnchor="middle">
            <tspan className="fig-sym">R</tspan>
            <tspan className="fig-val" dx={6}>
              {spec.marks.range}
            </tspan>
          </text>
        </g>
      )}
      {spec.marks?.angle && th0.theta !== 0 && (
        <g>
          <line className="fig-guide fig-dash fig-faint" x1={X(th0.x0 ?? 0)} x2={X(th0.x0 ?? 0) + 70} y1={Y(th0.h ?? 0)} y2={Y(th0.h ?? 0)} />
          <path
            className="fig-guide"
            d={`M${X(th0.x0 ?? 0) + 38} ${Y(th0.h ?? 0)}A38 38 0 0 ${th0.theta > 0 ? 0 : 1} ${X(th0.x0 ?? 0) + 38 * Math.cos(th0.theta * DEG)} ${Y(th0.h ?? 0) - 38 * Math.sin(th0.theta * DEG)}`}
          />
          <text className="fig-sym" x={X(th0.x0 ?? 0) + 56 * Math.cos((th0.theta / 2) * DEG)} y={Y(th0.h ?? 0) - 56 * Math.sin((th0.theta / 2) * DEG) + 7} textAnchor="middle">
            θ
          </text>
        </g>
      )}
      {spec.curvature && (
        <g>
          {(() => {
            const r = (top.vx * top.vx) / th0.g;
            return (
              <g>
                <circle className="fig-guide fig-dash" cx={X(top.x)} cy={Y(top.y - r)} r={r * k} />
                <line className="fig-guide" x1={X(top.x)} x2={X(top.x)} y1={Y(top.y)} y2={Y(top.y - r)} />
                <text className="fig-sym" x={X(top.x) + 8} y={(Y(top.y) + Y(top.y - r)) / 2 + 6}>
                  r
                </text>
              </g>
            );
          })()}
        </g>
      )}
      {spec.freeze &&
        (() => {
          const s = sampleAt(first, spec.freeze.t);
          return (
            <g>
              {arrow(X(first[0].x), Y(first[0].y), first[0].vx, first[0].vy, 'fig-vec is-muted')}
              <circle className="fig-ghost" cx={X(s.x)} cy={Y(s.y)} r={6} />
              {arrow(X(s.x), Y(s.y), s.vx, s.vy, 'fig-vec')}
              {spec.freeze.label && (
                <text className="fig-val" x={X(s.x) + 12} y={Y(s.y) + 24}>
                  {spec.freeze.label}
                </text>
              )}
            </g>
          );
        })()}

      {/* the moving things */}
      {spec.link && paths.length > 1 && (
        <line className="fig-guide fig-dash" x1={X(sampleAt(paths[0], T).x)} y1={Y(sampleAt(paths[0], T).y)} x2={X(sampleAt(paths[1], T).x)} y2={Y(sampleAt(paths[1], T).y)} />
      )}
      {paths.map((p, i) => {
        const th = spec.throws[i];
        if (T < delayOf(i)) return null;
        if (th.handOff && T > delayOf(i) + p[p.length - 1].t) return null;
        const s = sampleAt(p, T - delayOf(i));
        const cx = X(s.x);
        const cy = Y(s.y);
        return (
          <g key={i}>
            {th.components && (
              <g>
                {arrow(cx, cy, s.vx, 0, 'fig-guide fig-dash', 'cx')}
                {arrow(cx, cy, 0, s.vy, 'fig-guide fig-dash', 'cy')}
              </g>
            )}
            {th.arrow && arrow(cx, cy, s.vx, s.vy, 'fig-vec')}
            {th.marker === 'plane' ? (
              <path className="fig-ball" d={`M${cx + 16} ${cy}L${cx - 14} ${cy - 5}L${cx - 18} ${cy - 13}L${cx - 22} ${cy - 13}L${cx - 20} ${cy}L${cx - 22} ${cy + 3}L${cx - 14} ${cy + 3}Z`} />
            ) : th.marker === 'ghost' ? (
              <circle className="fig-ghost" cx={cx} cy={cy} r={6.5} />
            ) : (
              <g>
                <circle className="fig-glow" cx={cx} cy={cy} r={18} fill={`url(#glow${uid})`} />
                <circle className="fig-ball" cx={cx} cy={cy} r={6.5} />
              </g>
            )}
          </g>
        );
      })}
      {spec.clock !== false && (
        <text className="fig-val fig-clock" x={W - 12} y={20} textAnchor="end">
          t = {T.toFixed(2)} s
        </text>
      )}
    </svg>
  );
}
