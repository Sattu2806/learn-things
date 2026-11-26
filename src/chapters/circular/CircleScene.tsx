/**
 * Animated diagrams for circular motion, in the same black-and-white style as
 * the projectile scenes. A ball goes round a circle; arrows show its velocity
 * and acceleration as they really are at each moment.
 */
import { useId, useRef } from 'react';
import { useLoop, usePrefersStill } from '../../ui/useLoop';

export interface CircleSpec {
  /** What the picture shows, for screen readers. */
  title: string;
  /** Angular speed at the start, radians per (animation) second. */
  omega: number;
  /** Angular acceleration, radians per second squared (0 for uniform motion). */
  alpha?: number;
  /** Starting angle in degrees, from the right, anticlockwise. */
  start?: number;
  /** Length of one loop of the animation, seconds. Defaults to one turn. */
  loop?: number;
  /** Velocity arrow along the tangent. */
  velocity?: boolean;
  /** Acceleration arrow(s): centripetal, plus tangential and total when speeding up. */
  accel?: boolean;
  /** Show the tangential and centripetal parts separately as well as the total. */
  parts?: boolean;
  /** Radius line and swept angle θ. */
  angle?: boolean;
  /** Mark the arc length s swept since the start. */
  arc?: boolean;
  /** Beside the circle: the velocity vectors drawn from one point (why a points inward). */
  hodograph?: boolean;
  /** Beside the circle: the shadow on the vertical axis traced out against time. */
  wave?: boolean;
  /** Freeze two moments and draw Δv between them (a still diagram). */
  deltaV?: { from: number; to: number };
  /** A second ball on the same radius line, at this fraction of the radius (same ω, less speed). */
  inner?: number;
  /** Text labels in the corner, e.g. "r = 2 m". */
  notes?: string[];
  height?: number;
}

const W = 640;
const DEG = Math.PI / 180;

export function CircleScene(spec: CircleSpec) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ref = useRef<SVGSVGElement>(null);
  const still = usePrefersStill();
  const H = spec.height ?? 300;
  const alpha = spec.alpha ?? 0;
  const side = spec.hodograph || spec.wave || spec.deltaV;
  const turn = (2 * Math.PI) / Math.max(1e-6, Math.abs(spec.omega));
  const loop = spec.loop ?? (alpha ? 4 : turn);
  const T = useLoop(ref, loop, still);
  const t = still ? loop * 0.3 : T;

  const R = Math.min(H * 0.36, side ? 112 : 120);
  const cx = side ? 170 : W / 2;
  const cy = H / 2;
  const th0 = (spec.start ?? 0) * DEG;
  const thetaAt = (tt: number) => th0 + spec.omega * tt + 0.5 * alpha * tt * tt;
  const omegaAt = (tt: number) => spec.omega + alpha * tt;
  const th = thetaAt(t);
  const w = omegaAt(t);
  // Screen positions: angles anticlockwise from the right, y pointing down.
  const P = (a: number, r = R) => [cx + r * Math.cos(a), cy - r * Math.sin(a)] as const;
  const [px, py] = P(th);

  // Arrows are scaled to the largest value the loop reaches.
  const wMax = Math.max(Math.abs(spec.omega), Math.abs(omegaAt(loop)));
  const vLen = (ww: number) => (78 * Math.abs(ww)) / wMax;
  const acMax = wMax * wMax;
  const aRef = Math.max(acMax, Math.abs(alpha));
  const acLen = (ww: number) => (70 * ww * ww) / aRef;
  const atLen = (70 * Math.abs(alpha)) / aRef;
  const dir = Math.sign(w || spec.omega) || 1;
  // Unit vectors on screen at angle a: outward, and along the motion.
  const out = (a: number) => [Math.cos(a), -Math.sin(a)] as const;
  const along = (a: number) => [-Math.sin(a) * dir, -Math.cos(a) * dir] as const;

  const arrow = (x: number, y: number, dx: number, dy: number, cls: string, key?: string) =>
    Math.hypot(dx, dy) < 3 ? null : <line key={key} className={cls} x1={x} y1={y} x2={x + dx} y2={y + dy} markerEnd={`url(#ch${uid})`} />;

  const swept = th - th0;
  const sweptPath = (r: number) => {
    const n = Math.max(2, Math.ceil((Math.abs(swept) / (2 * Math.PI)) * 64));
    const a = Math.max(-2 * Math.PI, Math.min(2 * Math.PI, swept));
    let d = '';
    for (let i = 0; i <= n; i++) {
      const [x, y] = P(th0 + (a * i) / n, r);
      d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  };

  const va = along(th);
  const ou = out(th);
  const ac = acLen(w);

  // Side panel origin.
  const sx = 470;
  const sy = cy;

  return (
    <svg ref={ref} className="fig scene" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.title}>
      <defs>
        <radialGradient id={`cg${uid}`}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <marker id={`ch${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path className="fig-head" d="M0 0L10 5L0 10z" fill="#fff" />
        </marker>
      </defs>

      <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={R} fill="none" />
      <circle className="fig-ball" cx={cx} cy={cy} r={3} />

      {spec.angle && (
        <g>
          <line className="fig-guide fig-dash fig-faint" x1={cx} y1={cy} x2={cx + R + 16} y2={cy} />
          <line className="fig-guide" x1={cx} y1={cy} x2={px} y2={py} />
          {Math.abs(swept) > 0.05 && Math.abs(swept) < 2 * Math.PI - 0.05 && th0 === 0 && <path className="fig-guide" d={sweptPath(34)} fill="none" />}
          {th0 === 0 && (
            <text className="fig-sym" x={cx + 50 * Math.cos(Math.min(swept, Math.PI) / 2)} y={cy - 50 * Math.sin(Math.min(swept, Math.PI) / 2) + 7} textAnchor="middle">
              θ
            </text>
          )}
          <text className="fig-sym" x={cx + (R / 2) * Math.cos(th) + 12 * Math.sin(th)} y={cy - (R / 2) * Math.sin(th) + 12 * Math.cos(th) + 6} textAnchor="middle">
            r
          </text>
        </g>
      )}
      {spec.arc && Math.abs(swept) > 0.05 && <path className="fig-path" d={sweptPath(R)} fill="none" />}

      {spec.deltaV &&
        (() => {
          const a1 = thetaAt(spec.deltaV.from);
          const a2 = thetaAt(spec.deltaV.to);
          const [x1, y1] = P(a1);
          const [x2, y2] = P(a2);
          const L = 70;
          const v1 = along(a1);
          const v2 = along(a2);
          return (
            <g>
              <circle className="fig-ghost" cx={x1} cy={y1} r={6} />
              <circle className="fig-ghost" cx={x2} cy={y2} r={6} />
              {arrow(x1, y1, v1[0] * L, v1[1] * L, 'fig-vec', 'v1')}
              {arrow(x2, y2, v2[0] * L, v2[1] * L, 'fig-vec', 'v2')}
              <text className="fig-sym" x={x1 + v1[0] * L + 8} y={y1 + v1[1] * L}>
                v₁
              </text>
              <text className="fig-sym" x={x2 + v2[0] * L + 8} y={y2 + v2[1] * L}>
                v₂
              </text>
              {/* Tail to tail on the right: Δv points toward the centre of the turn. */}
              {(() => {
                const k = L * 1.5;
                const ax = v1[0] * k;
                const ay = v1[1] * k;
                const dx = (v2[0] - v1[0]) * k;
                const dy = (v2[1] - v1[1]) * k;
                const n = Math.hypot(dx, dy) || 1;
                // The label sits on the far side of Δv from the two velocity arrows.
                const mx = ax + dx / 2;
                const my = ay + dy / 2;
                const side = Math.sign(mx * -dy + my * dx) || 1;
                return (
                  <g transform={`translate(${sx - 20} ${sy})`}>
                    {arrow(0, 0, ax, ay, 'fig-vec', 'h1')}
                    {arrow(0, 0, v2[0] * k, v2[1] * k, 'fig-vec', 'h2')}
                    {arrow(ax, ay, dx, dy, 'fig-bar fig-dash', 'dv')}
                    <text className="fig-sym" x={mx + (side * -dy * 22) / n} y={my + (side * dx * 22) / n + 6} textAnchor="middle">
                      Δv
                    </text>
                    <text className="fig-val" x={0} y={H / 2 - 18} textAnchor="middle">
                      the same two arrows, tail to tail
                    </text>
                  </g>
                );
              })()}
            </g>
          );
        })()}

      {spec.hodograph && (
        <g>
          <circle className="fig-guide fig-dash fig-faint" cx={sx} cy={sy} r={vLen(w)} fill="none" />
          <circle className="fig-ball" cx={sx} cy={sy} r={3} />
          {arrow(sx, sy, va[0] * vLen(w), va[1] * vLen(w), 'fig-vec', 'hv')}
          {/* The tip of v moves round its own circle; that motion is the acceleration. */}
          {arrow(sx + va[0] * vLen(w), sy + va[1] * vLen(w), -ou[0] * ac * 0.8, -ou[1] * ac * 0.8, 'fig-bar', 'ha')}
          <text className="fig-sym" x={sx + va[0] * vLen(w) * 0.5 + 10} y={sy + va[1] * vLen(w) * 0.5 - 6}>
            v
          </text>
          <text className="fig-val" x={sx} y={H - 18} textAnchor="middle">
            velocity, drawn from one point
          </text>
        </g>
      )}

      {spec.wave &&
        (() => {
          // The ball's height against time, scrolling to the right.
          const span = Math.min(loop, turn * 1.5);
          const x0 = cx + R + 40;
          const x1 = W - 24;
          const pts: string[] = [];
          const n = 120;
          for (let i = 0; i <= n; i++) {
            const tt = t - (span * i) / n;
            if (tt < 0) break;
            const [, y] = P(thetaAt(tt));
            pts.push(`${i ? 'L' : 'M'}${(x0 + ((x1 - x0) * i) / n).toFixed(1)} ${y.toFixed(1)}`);
          }
          return (
            <g>
              <line className="fig-guide fig-faint" x1={x0} x2={x1} y1={cy} y2={cy} />
              <line className="fig-guide fig-dash" x1={px} y1={py} x2={x0} y2={py} />
              <path className="fig-path" d={pts.join('')} fill="none" />
              <circle className="fig-ball" cx={x0} cy={py} r={5} />
              <text className="fig-val" x={x1} y={H - 18} textAnchor="end">
                height against time
              </text>
            </g>
          );
        })()}

      {/* the ball and its arrows */}
      {!spec.deltaV && (
        <g>
          {spec.velocity && (
            <g>
              {arrow(px, py, va[0] * vLen(w), va[1] * vLen(w), 'fig-vec', 'v')}
              <text className="fig-sym" x={px + va[0] * (vLen(w) + 14)} y={py + va[1] * (vLen(w) + 14) + 6} textAnchor="middle">
                v
              </text>
            </g>
          )}
          {spec.accel && (
            <g>
              {(spec.parts || !alpha) && arrow(px, py, -ou[0] * ac, -ou[1] * ac, alpha ? 'fig-guide fig-dash' : 'fig-bar', 'ac')}
              {alpha !== 0 && spec.parts && arrow(px, py, va[0] * atLen * Math.sign(alpha) * dir, va[1] * atLen * Math.sign(alpha) * dir, 'fig-guide fig-dash', 'at')}
              {alpha !== 0 && arrow(px, py, -ou[0] * ac + va[0] * atLen * Math.sign(alpha) * dir, -ou[1] * ac + va[1] * atLen * Math.sign(alpha) * dir, 'fig-bar', 'a')}
              <text className="fig-sym" x={px - ou[0] * (ac + 16)} y={py - ou[1] * (ac + 16) + 6} textAnchor="middle">
                a
              </text>
            </g>
          )}
          {spec.inner !== undefined &&
            (() => {
              const [ix, iy] = P(th, R * spec.inner);
              return (
                <g>
                  <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={R * spec.inner} fill="none" />
                  <line className="fig-guide" x1={cx} y1={cy} x2={px} y2={py} />
                  {spec.velocity && arrow(ix, iy, va[0] * vLen(w) * spec.inner, va[1] * vLen(w) * spec.inner, 'fig-vec', 'vi')}
                  <circle className="fig-ball" cx={ix} cy={iy} r={5} />
                </g>
              );
            })()}
          <circle className="fig-glow" cx={px} cy={py} r={18} fill={`url(#cg${uid})`} />
          <circle className="fig-ball" cx={px} cy={py} r={6.5} />
        </g>
      )}

      {spec.notes && (
        <text className="fig-val" x={16} y={22}>
          {spec.notes.map((n, i) => (
            <tspan key={i} x={16} dy={i ? 18 : 0}>
              {n}
            </tspan>
          ))}
        </text>
      )}
      {!spec.deltaV && (
        <text className="fig-val fig-clock" x={W - 12} y={20} textAnchor="end">
          θ = {Math.round((((swept / DEG) % 360) + 360) % 360)}°{alpha ? `   ω = ${w.toFixed(1)} rad/s` : ''}
        </text>
      )}
    </svg>
  );
}
