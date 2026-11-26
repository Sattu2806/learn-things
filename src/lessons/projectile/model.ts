/**
 * The equations of a throw, term by term, plus the mistakes people commonly
 * make with them. Pure functions, no DOM.
 *
 *   x = v·cos θ·t
 *   y = v·sin θ·t − ½·g·t²
 */

export const DEG = Math.PI / 180;

export type TermId = 'run' | 'rise' | 'drop';

export interface Bugs {
  /** g·t² instead of ½·g·t² */
  noHalf: boolean;
  /** ½·g·t instead of ½·g·t² */
  linear: boolean;
  /** + instead of − in front of the gravity term */
  plus: boolean;
  /** sin and cos swapped */
  swap: boolean;
}

export interface Model {
  /** Launch speed, m/s */
  v: number;
  /** Launch angle, degrees */
  theta: number;
  /** Gravity, m/s² */
  g: number;
  /** Which terms are switched on. */
  run: boolean;
  rise: boolean;
  drop: boolean;
  bugs: Bugs;
}

export const NO_BUGS: Bugs = { noHalf: false, linear: false, plus: false, swap: false };

export function makeModel(v: number, theta: number, g: number, o: Partial<Pick<Model, 'run' | 'rise' | 'drop' | 'bugs'>> = {}): Model {
  return { v, theta, g, run: true, rise: true, drop: true, bugs: NO_BUGS, ...o };
}

/** The same throw with every term on and no mistakes. */
export function correct(m: Model): Model {
  return { ...m, run: true, rise: true, drop: true, bugs: NO_BUGS };
}

export function isCorrect(m: Model): boolean {
  const b = m.bugs;
  return m.run && m.rise && m.drop && !b.noHalf && !b.linear && !b.plus && !b.swap;
}

export interface Terms {
  /** v·cos θ·t */
  run: number;
  /** v·sin θ·t */
  rise: number;
  /** ½·g·t² (always reported as a positive size) */
  drop: number;
  x: number;
  y: number;
}

export function termsAt(m: Model, t: number): Terms {
  const th = m.theta * DEG;
  const cos = m.bugs.swap ? Math.sin(th) : Math.cos(th);
  const sin = m.bugs.swap ? Math.cos(th) : Math.sin(th);
  const run = m.run ? m.v * cos * t : 0;
  const rise = m.rise ? m.v * sin * t : 0;
  const drop = m.drop ? (m.bugs.noHalf ? 1 : 0.5) * m.g * (m.bugs.linear ? t : t * t) : 0;
  return { run, rise, drop, x: run, y: m.bugs.plus ? rise + drop : rise - drop };
}

/**
 * When the ball is back on the ground. 0 means it never leaves the ground,
 * null means it never comes down.
 */
export function landingTime(m: Model): number | null {
  const th = m.theta * DEG;
  const a = m.rise ? m.v * (m.bugs.swap ? Math.cos(th) : Math.sin(th)) : 0;
  const b = m.drop ? (m.bugs.noHalf ? 1 : 0.5) * m.g * (m.bugs.plus ? -1 : 1) : 0;
  // y = a·t − b·tⁿ, with n = 1 for the "t instead of t²" mistake.
  if (m.bugs.linear) {
    const k = a - b;
    return k < -1e-9 ? 0 : k > 1e-9 ? null : null;
  }
  if (b > 0) return a > 1e-9 ? a / b : 0;
  return a > 1e-9 || Math.abs(b) < 1e-12 ? null : 0;
}

/** Textbook results for the correct equations. */
export function flight(v: number, theta: number, g: number) {
  const s = Math.sin(theta * DEG);
  const T = (2 * v * s) / g;
  return {
    /** Time in the air */
    T,
    /** Range */
    R: (v * v * Math.sin(2 * theta * DEG)) / g,
    /** Highest point */
    H: (v * s) ** 2 / (2 * g),
    /** Height of the no-gravity ghost when the ball lands (4H) */
    ghostTop: v * s * T,
  };
}

/** The smallest of 1, 2, 5, 10, 20, 50… that is at least `min`. */
export function niceStep(min: number): number {
  const p = Math.pow(10, Math.floor(Math.log10(Math.max(min, 1e-9))));
  for (const k of [1, 2, 5]) if (k * p >= min) return k * p;
  return 10 * p;
}

export function fmt(n: number, digits = 1): string {
  return Math.abs(n) >= 1000 ? Math.round(n).toLocaleString('en-US') : n.toFixed(digits);
}

export function metres(n: number): string {
  return `${Math.abs(n) >= 100 ? Math.round(n) : n.toFixed(1)} m`;
}

export function seconds(n: number): string {
  return `${n.toFixed(2)} s`;
}
