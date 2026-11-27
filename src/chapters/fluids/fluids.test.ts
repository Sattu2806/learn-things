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
  for (const m of src.matchAll(/^\s*\['[^']+', '([^']+)'\],?$/gm)) out.push(m[1]);
  for (const m of src.matchAll(/items=\{\[((?:\s*'[^']*',?\s*)+)\]\}/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  return out;
}

describe('fluids chapter', () => {
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
    const g = 9.8;
    expect(1.013e5 + 1000 * g * 10).toBeCloseTo(1.993e5, -1);
    expect((1200 * g) / 36).toBeCloseTo(326.7, 1);
    expect(917 / 1030).toBeCloseTo(0.89, 2);
    expect(2 * (10 / 5) ** 2).toBe(8);
    expect(Math.PI * 0.05 ** 2 * 2).toBeCloseTo(0.0157, 4);
    expect(0.5 * 1000 * (64 - 4)).toBe(30000);
    const vt = (2 * 1e-6 * 6540 * g) / (9 * 0.83);
    expect(vt).toBeCloseTo(0.0172, 4);
    expect((1260 * vt * 0.002) / 0.83).toBeCloseTo(0.052, 3);
    expect((2 * 0.0728) / (1000 * g * 0.0005)).toBeCloseTo(0.0297, 4);
  });
});
