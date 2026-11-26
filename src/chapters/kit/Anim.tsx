/**
 * A small kit for animated physics diagrams, in the app's black-and-white
 * style. <Anim> runs a looping clock while the picture is on screen and
 * hands the time to a render function; the primitives below draw bodies,
 * arrows, springs, slopes and labels in SVG pixels (the frame is 640 wide).
 *
 *   <Anim title="A block slides down a slope" loop={4}>
 *     {(t) => <Block x={100 + 40 * t * t} y={200} w={40} h={26} />}
 *   </Anim>
 *
 * Work out positions from the real physics inside the render function.
 */
import { createContext, useContext, useId, useRef, type ReactNode } from 'react';
import { useLoop, usePrefersStill } from '../../ui/useLoop';

export const W = 640;
const Ids = createContext({ head: '', glow: '' });

interface AnimProps {
  /** What the picture shows, for screen readers. */
  title: string;
  height?: number;
  /** Seconds before the animation starts again (include a pause at the end). */
  loop?: number;
  /** For readers who ask for less motion: the time to show as a still. Defaults to 60% of the loop. */
  stillAt?: number;
  children: (t: number) => ReactNode;
}

export function Anim({ title, height = 280, loop = 4, stillAt, children }: AnimProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ref = useRef<SVGSVGElement>(null);
  const still = usePrefersStill();
  const t = useLoop(ref, loop, still);
  const ids = { head: `kh${uid}`, glow: `kg${uid}` };
  return (
    <svg ref={ref} className="fig scene" viewBox={`0 0 ${W} ${height}`} role="img" aria-label={title}>
      <defs>
        <radialGradient id={ids.glow}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <marker id={ids.head} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path className="fig-head" d="M0 0L10 5L0 10z" fill="#fff" />
        </marker>
      </defs>
      <Ids.Provider value={ids}>{children(still ? (stillAt ?? loop * 0.6) : t)}</Ids.Provider>
    </svg>
  );
}

/** A figure with a caption, ready to drop into a section. */
export function Fig({ caption, children }: { caption?: ReactNode; children: ReactNode }) {
  return (
    <figure className="t-figure">
      {children}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

// ------------------------------------------------------------------ timing helpers

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
/** Smooth start and stop, for camera-like moves and fades. */
export const ease = (p: number) => {
  const q = clamp(p);
  return q * q * (3 - 2 * q);
};
/** Progress 0 → 1 while t goes from a to b (0 before, 1 after). Use it to stage steps. */
export const phase = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const DEG = Math.PI / 180;

// ------------------------------------------------------------------ primitives

type Tone = 'bright' | 'soft' | 'faint';
const stroke = (tone: Tone = 'bright') => (tone === 'bright' ? 'fig-bar' : tone === 'soft' ? 'fig-guide' : 'fig-guide fig-faint');

/** An arrow from (x1, y1) to (x2, y2): a vector, force or velocity. */
export function Arrow({ x1, y1, x2, y2, dashed, tone = 'bright', width, label, labelAt = 'end' }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean; tone?: Tone; width?: number; label?: ReactNode; labelAt?: 'end' | 'mid' }) {
  const { head } = useContext(Ids);
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 3) return null;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const lx = labelAt === 'end' ? x2 + ux * 14 : (x1 + x2) / 2 - uy * 14;
  const ly = labelAt === 'end' ? y2 + uy * 14 : (y1 + y2) / 2 + ux * 14;
  return (
    <g>
      <line className={`${tone === 'bright' ? 'fig-vec' : stroke(tone)}${dashed ? ' fig-dash' : ''}`} style={width ? { strokeWidth: width } : undefined} x1={x1} y1={y1} x2={x2} y2={y2} markerEnd={`url(#${head})`} />
      {label && (
        <text className="fig-sym" x={lx} y={ly + 6} textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
}

/** A ball with a soft glow (or a hollow ghost). */
export function Ball({ x, y, r = 6.5, ghost, glow = true }: { x: number; y: number; r?: number; ghost?: boolean; glow?: boolean }) {
  const { glow: g } = useContext(Ids);
  if (ghost) return <circle className="fig-ghost" cx={x} cy={y} r={r} />;
  return (
    <g>
      {glow && <circle className="fig-glow" cx={x} cy={y} r={r * 2.8} fill={`url(#${g})`} />}
      <circle className="fig-ball" cx={x} cy={y} r={r} />
    </g>
  );
}

/** A block centred on (x, y), turned by `angle` degrees (anticlockwise), with an optional label. */
export function Block({ x, y, w = 44, h = 30, angle = 0, label, filled }: { x: number; y: number; w?: number; h?: number; angle?: number; label?: ReactNode; filled?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${-angle})`}>
      <rect className={filled ? 'kit-block is-filled' : 'kit-block'} x={-w / 2} y={-h / 2} width={w} height={h} rx={3} />
      {label && (
        <text className="fig-sym" x={0} y={7} textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
}

/** The ground (or any surface) at height y, with hatching underneath. */
export function Ground({ y, x1 = 0, x2 = W, hatch = true }: { y: number; x1?: number; x2?: number; hatch?: boolean }) {
  const marks = [];
  if (hatch) for (let x = x1 + 6; x < x2; x += 14) marks.push(<line key={x} className="fig-guide fig-faint" x1={x} y1={y + 2} x2={x - 8} y2={y + 10} />);
  return (
    <g>
      <line className="fig-ground" x1={x1} x2={x2} y1={y} y2={y} />
      {marks}
    </g>
  );
}

/** A wall at x from y1 to y2, hatched on the side away from the action (side = -1 left, 1 right). */
export function Wall({ x, y1, y2, side = -1 }: { x: number; y1: number; y2: number; side?: -1 | 1 }) {
  const marks = [];
  for (let y = y1 + 6; y < y2; y += 14) marks.push(<line key={y} className="fig-guide fig-faint" x1={x} y1={y} x2={x + side * 8} y2={y + 8} />);
  return (
    <g>
      <line className="fig-ground" x1={x} x2={x} y1={y1} y2={y2} />
      {marks}
    </g>
  );
}

/**
 * A slope rising to the right from (x, y) at `angle` degrees over a horizontal `base`.
 * pointAt(d) gives the screen point a distance d (px) up the slope surface.
 */
export function Incline({ x, y, base, angle, mark = true }: { x: number; y: number; base: number; angle: number; mark?: boolean | string }) {
  const h = base * Math.tan(angle * DEG);
  return (
    <g>
      <path className="fig-cliff" d={`M${x} ${y}L${x + base} ${y}L${x + base} ${y - h}Z`} />
      {mark && (
        <g>
          <path className="fig-guide" d={`M${x + 46} ${y}A46 46 0 0 0 ${x + 46 * Math.cos(angle * DEG)} ${y - 46 * Math.sin(angle * DEG)}`} fill="none" />
          <text className="fig-sym" x={x + 62} y={y - 8}>
            {typeof mark === 'boolean' ? 'θ' : mark}
          </text>
        </g>
      )}
    </g>
  );
}
export const slopePoint = (x: number, y: number, angle: number, d: number, lift = 0) => ({
  x: x + d * Math.cos(angle * DEG) - lift * Math.sin(angle * DEG),
  y: y - d * Math.sin(angle * DEG) - lift * Math.cos(angle * DEG),
});

/** A zigzag spring from (x1, y1) to (x2, y2). */
export function Spring({ x1, y1, x2, y2, coils = 9, width = 10 }: { x1: number; y1: number; x2: number; y2: number; coils?: number; width?: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const end = Math.min(10, len * 0.15);
  let d = `M${x1} ${y1}L${x1 + ux * end} ${y1 + uy * end}`;
  const n = coils * 2;
  for (let i = 1; i <= n; i++) {
    const s = end + ((len - 2 * end) * (i - 0.5)) / n;
    const side = i % 2 ? 1 : -1;
    d += `L${x1 + ux * s - uy * width * side} ${y1 + uy * s + ux * width * side}`;
  }
  d += `L${x2 - ux * end} ${y2 - uy * end}L${x2} ${y2}`;
  return <path className="fig-path kit-spring" d={d} fill="none" />;
}

/** A pulley wheel centred on (x, y). */
export function Pulley({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle className="kit-block" cx={x} cy={y} r={r} />
      <circle className="fig-ball" cx={x} cy={y} r={2.5} />
    </g>
  );
}

/** A straight line: a rope, a rod, a guide. */
export function Line({ x1, y1, x2, y2, dashed, tone = 'soft' }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean; tone?: Tone }) {
  return <line className={`${tone === 'bright' ? 'fig-path' : stroke(tone)}${dashed ? ' fig-dash' : ''}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
}

/** A path through points (a trail, a graph, a trajectory). */
export function Trail({ points, dashed, tone = 'bright' }: { points: [number, number][]; dashed?: boolean; tone?: Tone }) {
  if (points.length < 2) return null;
  const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
  return <path className={`${tone === 'bright' ? 'fig-path' : stroke(tone)}${dashed ? ' fig-dash' : ''}`} d={d} fill="none" />;
}

/** Text in the diagram: 'sym' is italic maths, 'val' is a mono number, 'label' a plain caption. */
export function Label({ x, y, children, kind = 'sym', anchor = 'middle' }: { x: number; y: number; children: ReactNode; kind?: 'sym' | 'val' | 'label'; anchor?: 'start' | 'middle' | 'end' }) {
  const cls = kind === 'sym' ? 'fig-sym' : kind === 'val' ? 'fig-val' : 'fig-label';
  return (
    <text className={cls} x={x} y={y} textAnchor={anchor}>
      {children}
    </text>
  );
}

/** The running time or any readout, top right. */
export function Readout({ children, x = W - 12, y = 20 }: { children: ReactNode; x?: number; y?: number }) {
  return (
    <text className="fig-val fig-clock" x={x} y={y} textAnchor="end">
      {children}
    </text>
  );
}

/** Axes for a graph: origin (x, y), width w, height h, with axis names. */
export function Axes({ x, y, w, h, xLabel, yLabel, below = 0 }: { x: number; y: number; w: number; h: number; xLabel?: ReactNode; yLabel?: ReactNode; below?: number }) {
  const { head } = useContext(Ids);
  return (
    <g>
      <line className="fig-guide" x1={x} y1={y + below} x2={x} y2={y - h} markerEnd={`url(#${head})`} />
      <line className="fig-guide" x1={x} y1={y} x2={x + w} y2={y} markerEnd={`url(#${head})`} />
      {xLabel && (
        <text className="fig-sym" x={x + w + 4} y={y + 22} textAnchor="end">
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text className="fig-sym" x={x - 10} y={y - h + 6} textAnchor="end">
          {yLabel}
        </text>
      )}
    </g>
  );
}
