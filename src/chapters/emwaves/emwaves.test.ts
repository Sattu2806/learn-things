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
  for (const m of src.matchAll(/src=\{?\[?((?:\s*'[^']*',?\s*)+)\]?\}?/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  for (const m of src.matchAll(/\['[^']+', '([^']+)'\]/g)) out.push(m[1]);
  for (const m of src.matchAll(/wrong=(?:"([^"]+)"|\{'([^']+)'\})/g)) out.push(m[1] ?? m[2]);
  return out;
}

function check(all: string[]) {
  for (const src of all) {
    const words = src
      .replace(/"[^"]*"/g, 'TEXT')
      .split(/\s+/)
      .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
    expect(count(parseMath(src)), src).toBe(words.length);
  }
}

describe('electromagnetic waves chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(80);
    check(all);
  });

  it('writes the film equations so they parse completely', () => {
    const all = [...filmSource.matchAll(/src: '([^']+)'/g)].map((m) => m[1]);
    expect(all.length).toBeGreaterThan(5);
    check(all);
  });

  it('works out the examples right', () => {
    const mu0 = 4 * Math.PI * 1e-7;
    const eps0 = 8.85e-12;
    const c = 3e8;
    // 1: displacement current
    const A = Math.PI * 0.1 ** 2;
    expect(A).toBeCloseTo(0.0314, 4);
    expect(3 / (eps0 * A)).toBeCloseTo(1.08e13, -11);
    expect((mu0 * 3) / (2 * Math.PI * 0.1)).toBeCloseTo(6.0e-6, 9);
    expect((mu0 * 3 * 0.05) / (2 * Math.PI * 0.1 ** 2)).toBeCloseTo(3.0e-6, 9);
    // 2: speed of light
    expect(mu0 * eps0).toBeCloseTo(1.112e-17, 20);
    expect(Math.sqrt(mu0 * eps0)).toBeCloseTo(3.335e-9, 12);
    expect(1 / Math.sqrt(mu0 * eps0)).toBeCloseTo(3.0e8, -7);
    // 3: radio
    expect(c / 1e8).toBeCloseTo(3.0, 8);
    expect((2 * Math.PI) / 3).toBeCloseTo(2.09, 2);
    expect(2 * Math.PI * 1e8).toBeCloseTo(6.28e8, -6);
    expect(c / 1e6).toBe(300);
    // 4: wave equation
    expect(5.4e8 / 1.8).toBeCloseTo(3e8, 0);
    expect((2 * Math.PI) / 1.8).toBeCloseTo(3.49, 2);
    expect(5.4e8 / (2 * Math.PI)).toBeCloseTo(8.59e7, -5);
    expect(30 / c).toBeCloseTo(1e-7, 12);
    // 5: intensity
    expect(60 / c).toBeCloseTo(2e-7, 12);
    const u = 0.5 * eps0 * 60 ** 2;
    expect(u).toBeCloseTo(1.59e-8, 10);
    expect(u * c).toBeCloseTo(4.78, 2);
    // 6: sunlight
    const E0 = Math.sqrt((2 * 1400) / (eps0 * c));
    expect(E0).toBeCloseTo(1028, -1);
    expect(1030 / c).toBeCloseTo(3.4e-6, 7);
    expect(1400 / c).toBeCloseTo(4.67e-6, 8);
    expect((2 * 1400) / c).toBeCloseTo(9.3e-6, 7);
    // 7: glass
    expect(c / 600e-9).toBeCloseTo(5e14, -12);
    expect(c / 1.5).toBe(2e8);
    expect(2e8 / 5e14).toBeCloseTo(400e-9, 12);
    // 8: spectrum
    expect(3e8 / 0.03).toBeCloseTo(1e10, -3);
    expect(3e8 / 5e-7).toBeCloseTo(6e14, -8);
    expect(3e8 / 1e-10).toBeCloseTo(3e18, -10);
  });
});
