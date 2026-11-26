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
