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
  });

  it('writes every equation so it parses completely', () => {
    for (const q of QUESTIONS) for (const src of maths(q)) expect(parsesFully(src), `${q.id}: ${src}`).toBe(true);
  });

  it('draws the slowest throw through its target', () => {
    const q = QUESTIONS.find((x) => x.id === 'slowest')!;
    const th = q.scene.throws[0];
    const t = 40 / (th.v * Math.cos(th.theta * DEG));
    expect(th.v * Math.sin(th.theta * DEG) * t - 5 * t * t).toBeCloseTo(30, 2);
  });
});
