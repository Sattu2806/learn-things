import { describe, expect, it } from 'vitest';
import { parseMath, type MathNode } from '../../film/math';
import chapterSource from './Chapter.tsx?raw';

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
  for (const m of src.matchAll(/\['[^']+', '([^']+)'\]/g)) out.push(m[1]);
  for (const m of src.matchAll(/wrong=(?:"([^"]+)"|\{'([^']+)'\})/g)) out.push(m[1] ?? m[2]);
  return out;
}

describe('oscillations chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(60);
    for (const src of all) {
      const words = src
        .replace(/"[^"]*"/g, 'TEXT')
        .split(/\s+/)
        .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
      expect(count(parseMath(src)), src).toBe(words.length);
    }
  });

  it('works out the examples right', () => {
    const w = Math.sqrt(200 / 0.5);
    expect(w).toBe(20);
    expect((2 * Math.PI) / w).toBeCloseTo(0.314, 3);
    expect(w / (2 * Math.PI)).toBeCloseTo(3.18, 2);
    expect(0.1 * w).toBeCloseTo(2, 5);
    expect(0.1 * w * w).toBeCloseTo(40, 5);
    expect((9.8 * 4) / (4 * Math.PI ** 2)).toBeCloseTo(0.993, 3);
    expect(2 * Math.PI * Math.sqrt(1 / 9.8)).toBeCloseTo(2.01, 2);
    expect(2 * Math.PI * Math.sqrt(1 / 1.6)).toBeCloseTo(4.97, 2);
    expect(Math.sqrt(9.8 / 1.6)).toBeCloseTo(2.47, 2);
    expect(0.5 * 200 * 0.01).toBeCloseTo(1, 5);
    expect(0.5 * 200 * 0.05 ** 2).toBeCloseTo(0.25, 5);
    expect(Math.sqrt((2 * 0.75) / 0.5)).toBeCloseTo(1.73, 2);
    expect(w * Math.sqrt(0.01 - 0.0025)).toBeCloseTo(1.73, 2);
    expect(w * w * 0.05).toBeCloseTo(20, 5);
    expect(2 * Math.PI * Math.sqrt(0.5 / 100)).toBeCloseTo(0.444, 3);
    expect(2 * Math.PI * Math.sqrt(0.5 / 400)).toBeCloseTo(0.222, 3);
  });
});
