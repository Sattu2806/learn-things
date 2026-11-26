import { describe, expect, it } from 'vitest';
import { parseMath, type MathNode } from '../../film/math';
import chapterSource from './Chapter.tsx?raw';

// Every maths string in the chapter must parse completely: a stray "|" or a
// bracket glued to a number silently drops the rest of the equation.
function count(nodes: MathNode[]): number {
  return nodes.reduce((n, x) => {
    if (x.t === 'tok') return n + 1 + (x.tok.sup ? 1 : 0) + (x.tok.sub ? 1 : 0);
    if (x.t === 'frac') return n + count(x.num) + count(x.den);
    return n + count(x.body);
  }, 0);
}

function maths(src: string): string[] {
  const out: string[] = [];
  for (const m of src.matchAll(/<M>\{?['`]([^'`]+)['`]\}?<\/M>|<M>([^<{]+)<\/M>/g)) out.push((m[1] ?? m[2]).trim());
  for (const m of src.matchAll(/src=\{?\[?((?:\s*'[^']*',?\s*)+)\]?\}?/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  for (const m of src.matchAll(/items=\{\[((?:\s*'[^']*',?\s*)+)\]\}/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  for (const m of src.matchAll(/\['[^']+', '([^']+)'\]/g)) out.push(m[1]);
  for (const m of src.matchAll(/wrong=(?:"([^"]+)"|\{'([^']+)'\})/g)) out.push((m[1] ?? m[2]).trim());
  return out;
}

describe('momentum chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(80);
    for (const src of all) {
      const words = src
        .replace(/"[^"]*"/g, 'TEXT')
        .split(/\s+/)
        .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
      expect(count(parseMath(src)), src).toBe(words.length);
    }
  });

  it('works out the examples right', () => {
    // 1 recoil
    expect((0.02 * 400) / 4).toBeCloseTo(2, 10);
    expect(0.5 * 0.02 * 400 ** 2).toBeCloseTo(1600, 6);
    expect(0.5 * 4 * 2 ** 2).toBeCloseTo(8, 10);
    // 2 elastic
    const v1 = ((2 - 1) / 3) * 3;
    const v2 = ((2 * 2) / 3) * 3;
    expect([v1, v2]).toEqual([1, 4]);
    expect(2 * v1 + 1 * v2).toBe(6);
    expect(0.5 * 2 * v1 ** 2 + 0.5 * v2 ** 2).toBeCloseTo(9, 10);
    // 3 sticking
    expect(6 / 3).toBe(2);
    expect(9 - 0.5 * 3 * 2 ** 2).toBeCloseTo(3, 10);
    const mu = (2 * 1) / 3;
    expect(0.5 * mu * 3 ** 2).toBeCloseTo(3, 10);
    // 4 bouncing ball
    const v = Math.sqrt(2 * 9.8 * 2);
    expect(v.toFixed(2)).toBe('6.26');
    expect((0.8 * v).toFixed(2)).toBe('5.01');
    expect(((0.8 * v) ** 2 / 19.6).toFixed(2)).toBe('1.28');
    expect((2 * 0.64 * 0.64).toFixed(3)).toBe('0.819');
    expect((2 * 0.8 ** 6).toFixed(3)).toBe('0.524');
    // 5 ballistic pendulum
    const V = Math.sqrt(2 * 9.8 * 0.05);
    expect(V.toFixed(3)).toBe('0.990');
    expect(((2.01 / 0.01) * V).toFixed(0)).toBe('199');
    expect((0.5 * 2.01 * V * V).toFixed(3)).toBe('0.985');
    expect((0.5 * 0.01 * 199 ** 2).toFixed(0)).toBe('198');
    // 6 two dimensions
    const vx = 6 / 3;
    const vy = 4 / 3;
    expect(Math.hypot(vx, vy).toFixed(2)).toBe('2.40');
    expect(((Math.atan2(vy, vx) * 180) / Math.PI).toFixed(1)).toBe('33.7');
    expect((0.5 * 2 * 9 + 0.5 * 16).toFixed(0)).toBe('17');
    expect((0.5 * 3 * (vx * vx + vy * vy)).toFixed(2)).toBe('8.67');
    // special cases and the picture of the billiard collision
    expect(((6 - 1) / 7) * 2).toBeCloseTo(1.4286, 3);
    expect((12 / 7)).toBeCloseTo(1.714, 3);
    expect((2 * 6 * 2) / 7).toBeCloseTo(3.4286, 3);
    expect(((1 - 5) / 6) * 3).toBe(-2);
    expect((2 / 6) * 3).toBe(1);
    expect((5 * Math.cos(Math.PI / 6)).toFixed(2)).toBe('4.33');
    expect(5 * Math.sin(Math.PI / 6)).toBeCloseTo(2.5, 10);
    // 3 kg at 4 m/s sticks to 1 kg at rest
    expect(12 / 4).toBe(3);
    expect(0.5 * 3 * 16 - 0.5 * 4 * 9).toBe(6);
  });
});
