import { describe, expect, it } from 'vitest';
import { parseMath, type MathNode } from '../../film/math';
import chapterSource from './Chapter.tsx?raw';
import filmSource from './film.ts?raw';

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
  for (const m of src.matchAll(/(?:src|items)=\{?\[?((?:\s*'[^']*',?\s*)+)\]?\}?/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  for (const m of src.matchAll(/\['[^']+', '([^']+)'\]/g)) out.push(m[1]);
  for (const m of src.matchAll(/wrong=(?:"([^"]+)"|\{'([^']+)'\})/g)) out.push(m[1] ?? m[2]);
  for (const m of src.matchAll(/src: '([^']+)'/g)) out.push(m[1]);
  return out;
}

describe('electric charges and fields chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = [...maths(chapterSource), ...maths(filmSource)];
    expect(all.length).toBeGreaterThan(90);
    for (const src of all) {
      const words = src
        .replace(/"[^"]*"/g, 'TEXT')
        .split(/\s+/)
        .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
      expect(count(parseMath(src)), src).toBe(words.length);
    }
  });

  it('works out the examples right', () => {
    const k = 9e9;
    const e0 = 8.85e-12;
    expect((k * 2e-6 * 3e-6) / 0.03 ** 2).toBeCloseTo(60, 5);
    // zero-field point between 4 uC and 1 uC, 0.3 m apart
    const x = 0.2;
    expect((k * 4e-6) / x ** 2).toBeCloseTo((k * 1e-6) / (0.3 - x) ** 2, 3);
    expect((k * 4e-6) / x ** 2).toBeCloseTo(9e5, 0);
    expect((k * 5e-9) / 0.3 ** 2).toBeCloseTo(500, 5);
    expect(1.6e-19 * 500).toBeCloseTo(8e-17, 25);
    expect(8e-17 / 9.11e-31 / 1e13).toBeCloseTo(8.78, 2);
    const p = 1e-6 * 0.04;
    expect(p).toBeCloseTo(4e-8, 15);
    expect((2 * k * p) / 0.5 ** 3).toBeCloseTo(5760, 3);
    expect((k * p) / 0.5 ** 3).toBeCloseTo(2880, 3);
    expect(p * 3e4 * Math.sin(Math.PI / 6)).toBeCloseTo(6e-4, 8);
    // exact axial field is within 1% of the far-field formula
    const q = 1e-6, a = 0.02, r = 0.5;
    const exact = k * q * (1 / (r - a) ** 2 - 1 / (r + a) ** 2);
    expect(Math.abs(exact / ((2 * k * p) / r ** 3) - 1)).toBeLessThan(0.01);
    expect(200 * 0.5 * Math.cos(Math.PI / 3)).toBeCloseTo(50, 8);
    expect(17.7e-9 / e0).toBeCloseTo(2000, 0);
    expect(2000 / 6).toBeCloseTo(333.3, 1);
    expect((k * 2e-9) / 0.1 ** 2).toBeCloseTo(1800, 5);
    expect((k * 2e-9) / 0.3 ** 2).toBeCloseTo(200, 5);
    const sigma = 2e-9 / (4 * Math.PI * 0.01);
    expect(sigma).toBeCloseTo(1.59e-8, 10);
    expect(sigma / e0).toBeCloseTo(1798, -1);
    expect((2 * k * 2e-9) / 0.1).toBeCloseTo(360, 5);
    expect(8.85e-9 / (2 * e0)).toBeCloseTo(500, 5);
    // electric versus gravity for an electron and a proton
    const ratio = (k * 1.6e-19 ** 2) / (6.67e-11 * 9.11e-31 * 1.67e-27);
    expect(Math.log10(ratio)).toBeCloseTo(39.4, 0);
  });
});
