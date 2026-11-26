import { describe, expect, it } from 'vitest';
import { parseMath, type MathNode } from '../../film/math';
import chapterSource from './Chapter.tsx?raw';

// Every maths string in the chapter must parse completely.
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
  for (const m of src.matchAll(/wrong="([^"]+)"/g)) out.push(m[1]);
  return out;
}

describe('gravitation chapter', () => {
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
    const G = 6.67e-11;
    const M = 5.97e24;
    const R = 6.37e6;
    expect(G * 100 * 100).toBeCloseTo(6.67e-7, 9);
    expect(9.81 * (R / (R + 4e5)) ** 2).toBeCloseTo(8.69, 2);
    expect(9.8 * (1 - 0.5)).toBeCloseTo(4.9, 6);
    const gm = (G * 7.35e22) / 1.74e6 ** 2;
    expect(gm).toBeCloseTo(1.62, 2);
    expect(Math.sqrt(2 * gm * 1.74e6) / 1000).toBeCloseTo(2.37, 2);
    const r = R + 4e5;
    const v = Math.sqrt((G * M) / r);
    expect(v / 1000).toBeCloseTo(7.67, 2);
    expect((2 * Math.PI * r) / v / 60).toBeCloseTo(92.4, 1);
    expect(1440 / ((2 * Math.PI * r) / v / 60)).toBeCloseTo(15.6, 1);
    const rg = Math.cbrt((G * M * 86400 ** 2) / (4 * Math.PI ** 2));
    expect(rg / 1e7).toBeCloseTo(4.22, 2);
    expect((rg - R) / 1e7).toBeCloseTo(3.59, 2);
    expect((2 * Math.PI * rg) / 86400 / 1000).toBeCloseTo(3.07, 2);
    expect(Math.sqrt(2 * 9.81 * R) / 1000).toBeCloseTo(11.2, 1);
    expect(Math.sqrt(9.81 * R) / 1000).toBeCloseTo(7.9, 1);
    expect(1.52 ** 1.5).toBeCloseTo(1.87, 2);
  });
});
