import { describe, expect, it } from 'vitest';
import { parseMath, type MathNode } from '../../film/math';
import { anglesFor, curveRadius, inclineMax, onIncline, samplePath, slowestTo, solve } from './numbers';
import { QUESTIONS, type Question } from './questions';

const DEG = Math.PI / 180;

/** What each answer should be, worked out again from the physics. */
const EXPECTED: Record<string, number> = {
  table: solve({ v: 3, theta: 0, g: 9.8, h: 1.2 }).R,
  'height-60': solve({ v: 20, theta: 60, g: 9.8 }).H,
  wall: 18 * Math.sin(40 * DEG) * (20 / (18 * Math.cos(40 * DEG))) - 4.9 * (20 / (18 * Math.cos(40 * DEG))) ** 2 - 4,
  building: solve({ v: 15, theta: 30, g: 9.8, h: 10 }).T,
  'speed-at-height': Math.sqrt(400 - 2 * 9.8 * 10),
  'curvature-top': curveRadius({ v: 20, theta: 60, g: 10 }, solve({ v: 20, theta: 60, g: 10 }).tTop),
  perpendicular: 20 / (10 * Math.sin(60 * DEG)),
  'incline-up': onIncline(20, 60, 10, 30).along,
  'two-balls': 2 * 20 * Math.sin(15 * DEG),
  'same-height-twice': 0.5 * 10 * 1 * 3,
  slowest: slowestTo(40, 30, 10).v,
  'top-time': 0.5 * 9.8 * (3 / 2) ** 2,
  'velocity-change': 2 * solve({ v: 25, theta: Math.asin(0.8) / DEG, g: 10 }).vy,
  // Reflected at the wall: it falls from the height it had there, moving back at the same sideways speed.
  'wall-bounce': (() => {
    const vx = 25 * 0.6;
    const vy = 25 * 0.8;
    const tHit = 45 / vx;
    const y = vy * tHit - 5 * tHit * tHit;
    const vyHit = vy - 10 * tHit;
    const tFall = (vyHit + Math.sqrt(vyHit * vyHit + 2 * 10 * y)) / 10;
    return vx * tFall;
  })(),
  // B needs the same upward speed as A, and must cover 40 m sideways within A's flight.
  'aim-at-the-toy': Math.hypot(30, 40) / Math.sqrt((2 * 40) / 10),
  'downhill-throw': onIncline(15, 0, 10, -30).along,
  'trolley-throw': 6 * solve({ v: 8, theta: 90, g: 10 }).T,
};

function countTokens(nodes: MathNode[]): number {
  return nodes.reduce((n, x) => {
    if (x.t === 'tok') return n + 1 + (x.tok.sup ? 1 : 0) + (x.tok.sub ? 1 : 0);
    if (x.t === 'frac') return n + countTokens(x.num) + countTokens(x.den);
    return n + countTokens(x.body);
  }, 0);
}

/** Every token in the source must end up in the parsed equation (a stray "|" silently ends it). */
function parsesFully(src: string) {
  const joined = src.replace(/"[^"]*"/g, 'TEXT');
  const words = joined.split(/\s+/).filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
  return countTokens(parseMath(src)) === words.length;
}

function maths(q: Question): string[] {
  const inline = (s: string) => s.split('$').filter((_, i) => i % 2 === 1);
  const out = [...inline(q.prompt), ...inline(q.result)];
  if (q.kind === 'mcq') q.options.forEach((o) => out.push(...inline(o)));
  for (const s of q.steps) {
    if (s.say) out.push(...inline(s.say));
    if (s.eq) out.push(...(Array.isArray(s.eq) ? s.eq : [s.eq]));
  }
  return out;
}

describe('question bank', () => {
  it('has unique ids and questions at every level', () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
    for (const level of ['school', 'neet', 'jee-main', 'jee-adv']) expect(QUESTIONS.filter((q) => q.level === level).length).toBeGreaterThanOrEqual(4);
  });

  it('gives the right numeric answers', () => {
    for (const q of QUESTIONS.filter((x) => x.kind === 'numeric')) {
      const want = EXPECTED[q.id];
      expect(want, q.id).toBeDefined();
      expect(Math.abs(q.answer - want), q.id).toBeLessThanOrEqual(q.tol / 2);
    }
  });

  it('marks the right options', () => {
    const pick = (id: string) => {
      const q = QUESTIONS.find((x) => x.id === id)!;
      return q.kind === 'mcq' ? q.options[q.answer] : '';
    };
    const [lo, hi] = anglesFor(20, 9.8, 30)!;
    expect(pick('two-angles')).toBe(`${lo.toFixed(1)}° and ${hi.toFixed(1)}°`);
    const v = solve({ v: 20, theta: 30, g: 9.8 });
    const vy = v.vy - 9.8 * 2;
    expect(pick('velocity-2s')).toBe(`${Math.hypot(v.vx, vy).toFixed(1)} m/s, ${(Math.atan(-vy / v.vx) / DEG).toFixed(0)}° below the horizontal`);
    const h = (a: number) => solve({ v: 20, theta: a, g: 10 }).H;
    expect(h(60) / h(30)).toBeCloseTo(3, 9);
    expect(pick('ratio-heights')).toBe('1 : 3');
    const s45 = solve({ v: 20, theta: 45, g: 10 });
    expect(s45.R / s45.H).toBeCloseTo(4, 9);
    expect(pick('range-4h')).toBe('45°');
    expect(pick('ke-top')).toBe('K / 2');
    expect(pick('tower')).toBe('tan⁻¹ 2');
    expect(Math.cos(60 * DEG)).toBeCloseTo(0.5, 9);
    expect(pick('half-speed')).toBe('60°');
    const path = samplePath({ v: Math.sqrt(200), theta: 45, g: 10 });
    expect(path[path.length - 1].x).toBeCloseTo(20, 9);
    expect(pick('path-equation')).toBe('20 m');
    expect(pick('r-from-heights')).toBe('4 √(H₁ H₂)');
    expect(inclineMax(20, 10, 30).along / inclineMax(20, 10, -30).along).toBeCloseTo(1 / 3, 9);
    expect(pick('incline-max')).toBe('1 : 3');
    expect(solve({ v: 100, theta: 0, g: 10, h: 500 }).R).toBeCloseTo(1000, 9);
    expect(pick('plane')).toMatch(/^Directly below the plane, 1000 m/);
    const free = samplePath({ v: 30, theta: 45, g: 9.8 });
    const air = samplePath({ v: 30, theta: 45, g: 9.8, drag: 0.012 });
    expect(air[air.length - 1].x).toBeLessThan(free[free.length - 1].x);
    expect(pick('air')).toMatch(/lands shorter/);

    // Average velocity over a level flight is the range over the time: the sideways speed.
    const av = solve({ v: 15, theta: 40, g: 9.8 });
    expect(av.R / av.T).toBeCloseTo(av.vx, 9);
    expect(pick('average-velocity')).toBe(`${(av.R / av.T).toFixed(1)} m/s, horizontal`);
    // Dropped and thrown together land together.
    const dropped = solve({ v: 0, theta: 0, g: 10, h: 45 });
    const thrown = solve({ v: 12, theta: 0, g: 10, h: 45 });
    expect(thrown.T).toBeCloseTo(dropped.T, 9);
    expect(pick('drop-or-throw')).toBe(`They land together, after ${dropped.T.toFixed(0)} s`);
    // Same upward speed means the same flight time; the range is vx times it.
    const p = solve({ v: 20, theta: 90, g: 10 });
    const q = solve({ v: 25, theta: Math.asin(0.8) / DEG, g: 10 });
    expect(q.T).toBeCloseTo(p.T, 9);
    expect(pick('same-upward-speed')).toBe(`Together, after ${p.T.toFixed(0)} s; ${q.R.toFixed(0)} m apart`);
    // Range equal to height at tan θ = 4.
    const rh = solve({ v: 20, theta: Math.atan(4) / DEG, g: 10 });
    expect(rh.R).toBeCloseTo(rh.H, 9);
    expect(pick('range-equals-height')).toBe('tan⁻¹ 4');
    // Two complementary angles: heights add to u²/2g.
    const hs = (a: number) => solve({ v: 20, theta: a, g: 10 });
    expect(hs(30).R).toBeCloseTo(hs(60).R, 9);
    expect(hs(30).H).toBeCloseTo(5, 9);
    expect(hs(60).H).toBeCloseTo(15, 9);
    expect(Math.sqrt(2 * 10 * (5 + 15))).toBeCloseTo(20, 9);
    expect(pick('heights-sum')).toBe('20 m/s');
    // B must match A's upward speed, then cover 40 m sideways in A's 4 s.
    const a = solve({ v: 20, theta: 90, g: 10 });
    expect(Math.hypot(20, 40 / a.T)).toBeCloseTo(Math.sqrt(500), 9);
    expect(pick('meet-vertical')).toBe(`${Math.hypot(20, 40 / a.T).toFixed(1)} m/s`);
  });

  it('writes every equation so it parses completely', () => {
    for (const q of QUESTIONS) for (const src of maths(q)) expect(parsesFully(src), `${q.id}: ${src}`).toBe(true);
  });

  it('draws the bounce and the dart so they meet', () => {
    const w = QUESTIONS.find((x) => x.id === 'wall-bounce')!;
    const [before, after] = w.scene.throws;
    const hit = samplePath(before)[160];
    const start = samplePath(after)[0];
    expect(start.x).toBeCloseTo(hit.x, 6);
    expect(start.y).toBeCloseTo(hit.y, 6);
    expect(start.vx).toBeCloseTo(-hit.vx, 6);
    expect(start.vy).toBeCloseTo(hit.vy, 6);
    const end = samplePath(after);
    expect(end[end.length - 1].x).toBeCloseTo(30, 6);

    const d = QUESTIONS.find((x) => x.id === 'aim-at-the-toy')!;
    const [dart, toy] = d.scene.throws;
    const a = samplePath(dart);
    const b = samplePath(toy);
    expect(a[160].x).toBeCloseTo(b[160].x, 6);
    expect(a[160].y).toBeCloseTo(b[160].y, 6);
  });

  it('draws the slowest throw through its target', () => {
    const q = QUESTIONS.find((x) => x.id === 'slowest')!;
    const th = q.scene.throws[0];
    const t = 40 / (th.v * Math.cos(th.theta * DEG));
    expect(th.v * Math.sin(th.theta * DEG) * t - 5 * t * t).toBeCloseTo(30, 2);
  });
});
