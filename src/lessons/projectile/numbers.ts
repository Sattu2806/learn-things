/**
 * Everything about one throw, worked out from its launch: the numbers the
 * theory page quotes and its calculator shows. Unlike the film's model, the
 * ball may start above the ground (a cliff, a table).
 */
import { DEG } from './model';

export interface Launch {
  /** Launch speed, m/s. */
  v: number;
  /** Launch angle above the ground, degrees. */
  theta: number;
  /** Gravity, m/s². */
  g: number;
  /** Launch height above the ground, m. */
  h?: number;
}

export interface Solved {
  /** Sideways and upward parts of the launch speed. */
  vx: number;
  vy: number;
  /** Time in the air until it hits the ground. */
  T: number;
  /** When it is highest (0 if it never rises). */
  tTop: number;
  /** Greatest height above the ground. */
  H: number;
  /** How far away it lands. */
  R: number;
  /** Speed when it hits the ground. */
  impact: number;
}

export function solve({ v, theta, g, h = 0 }: Launch): Solved {
  const vx = v * Math.cos(theta * DEG);
  const vy = v * Math.sin(theta * DEG);
  const T = (vy + Math.sqrt(vy * vy + 2 * g * h)) / g;
  const tTop = Math.max(0, vy / g);
  const H = h + (vy > 0 ? (vy * vy) / (2 * g) : 0);
  return { vx, vy, T, tTop, H, R: vx * T, impact: Math.hypot(vx, vy - g * T) };
}

/** Where the ball is at time t. */
export function at({ v, theta, g, h = 0 }: Launch, t: number) {
  return {
    x: v * Math.cos(theta * DEG) * t,
    y: h + v * Math.sin(theta * DEG) * t - 0.5 * g * t * t,
  };
}

/** A number for reading: fixed decimals, no trailing zeros lost in tables. */
export function num(x: number, digits = 2) {
  return x.toFixed(digits);
}

// ------------------------------------------------------------------ beyond flat ground

/**
 * Thrown at angle theta (from the horizontal) up a slope of angle alpha.
 * Use a negative alpha for a slope going down. Distance is measured along the slope.
 */
export function onIncline(v: number, theta: number, g: number, alpha: number) {
  const a = alpha * DEG;
  const rel = (theta - alpha) * DEG;
  const T = (2 * v * Math.sin(rel)) / (g * Math.cos(a));
  const along = (2 * v * v * Math.cos(theta * DEG) * Math.sin(rel)) / (g * Math.cos(a) ** 2);
  return { T, along };
}

/** The longest throw along a slope of angle alpha, and the angle (from horizontal) that gives it. */
export function inclineMax(v: number, g: number, alpha: number) {
  const s = Math.sin(alpha * DEG);
  return { along: (v * v) / (g * (1 + s)), theta: 45 + alpha / 2 };
}

/** The two launch angles that land at range R on flat ground (null if R is out of reach). */
export function anglesFor(v: number, g: number, R: number): [number, number] | null {
  const s = (R * g) / (v * v);
  if (s > 1) return null;
  const low = Math.asin(s) / DEG / 2;
  return [low, 90 - low];
}

/** The slowest launch that reaches the point (x, y), and the angle it needs. */
export function slowestTo(x: number, y: number, g: number) {
  const r = Math.hypot(x, y);
  const v = Math.sqrt(g * (y + r));
  return { v, theta: Math.atan((y + r) / x) / DEG };
}

/** Radius of the path's curve at time t: speed cubed over g times the sideways speed. */
export function curveRadius(l: Launch, t: number) {
  const vx = l.v * Math.cos(l.theta * DEG);
  const vy = l.v * Math.sin(l.theta * DEG) - l.g * t;
  return Math.hypot(vx, vy) ** 3 / (l.g * Math.abs(vx));
}

export interface Sample {
  t: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface PathSpec extends Launch {
  /** Start this far along the ground. */
  x0?: number;
  /** Air drag: deceleration = drag × speed², in 1/m. */
  drag?: number;
  /** Stop when the ball meets a slope of this angle through the origin (degrees). */
  incline?: number;
  /** Stop at this time even if still flying. */
  tEnd?: number;
}

/**
 * The path as samples in time, until it lands (on the ground or a slope) or tEnd.
 * Without drag it is exact; with drag it is stepped forward in small steps.
 */
export function samplePath(p: PathSpec, n = 160): Sample[] {
  const g = p.g;
  const x0 = p.x0 ?? 0;
  const h = p.h ?? 0;
  const ux = p.v * Math.cos(p.theta * DEG);
  const uy = p.v * Math.sin(p.theta * DEG);
  const slope = p.incline !== undefined ? Math.tan(p.incline * DEG) : null;
  const below = (x: number, y: number) => (slope !== null ? y < (x - x0) * slope - 1e-9 : y < -1e-9);

  if (!p.drag) {
    let T: number;
    if (p.tEnd !== undefined) T = p.tEnd;
    else if (slope !== null) T = Math.max(0, onIncline(p.v, p.theta, g, p.incline!).T);
    else T = g > 0 ? (uy + Math.sqrt(uy * uy + 2 * g * h)) / g : 1;
    return Array.from({ length: n + 1 }, (_, i) => {
      const t = (T * i) / n;
      return { t, x: x0 + ux * t, y: h + uy * t - 0.5 * g * t * t, vx: ux, vy: uy - g * t };
    });
  }

  // With drag: step forward, then land exactly by interpolating the last step.
  const dt = 0.002;
  const out: Sample[] = [];
  let s: Sample = { t: 0, x: x0, y: h, vx: ux, vy: uy };
  const all: Sample[] = [s];
  const limit = p.tEnd ?? 60;
  while (s.t < limit) {
    const sp = Math.hypot(s.vx, s.vy);
    const ax = -p.drag * sp * s.vx;
    const ay = -g - p.drag * sp * s.vy;
    const next: Sample = { t: s.t + dt, x: s.x + s.vx * dt, y: s.y + s.vy * dt, vx: s.vx + ax * dt, vy: s.vy + ay * dt };
    if (below(next.x, next.y) && next.t > dt * 2) {
      const f = s.y / (s.y - next.y || 1);
      all.push({ t: s.t + f * dt, x: s.x + f * (next.x - s.x), y: 0, vx: next.vx, vy: next.vy });
      break;
    }
    all.push(next);
    s = next;
  }
  const T = all[all.length - 1].t;
  for (let i = 0, j = 0; i <= n; i++) {
    const t = (T * i) / n;
    while (j < all.length - 2 && all[j + 1].t < t) j++;
    const a = all[j];
    const b = all[Math.min(j + 1, all.length - 1)];
    const f = b.t > a.t ? (t - a.t) / (b.t - a.t) : 0;
    out.push({ t, x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, vx: a.vx + (b.vx - a.vx) * f, vy: a.vy + (b.vy - a.vy) * f });
  }
  return out;
}

/** Where a sampled path is at time t (holding its last point after it lands). */
export function sampleAt(path: Sample[], t: number): Sample {
  const last = path[path.length - 1];
  if (t >= last.t) return last;
  if (t <= 0) return path[0];
  const k = (t / last.t) * (path.length - 1);
  const i = Math.floor(k);
  const f = k - i;
  const a = path[i];
  const b = path[i + 1];
  return { t, x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, vx: a.vx + (b.vx - a.vx) * f, vy: a.vy + (b.vy - a.vy) * f };
}
