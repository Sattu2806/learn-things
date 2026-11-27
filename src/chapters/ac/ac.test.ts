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

describe('alternating current chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(80);
    check(all);
  });

  it('writes the film equations so they parse completely', () => {
    const all = [...filmSource.matchAll(/src: '([^']+)'/g)].map((m) => m[1]);
    expect(all.length).toBeGreaterThan(6);
    check(all);
  });

  it('works out the examples right', () => {
    expect(220 * Math.SQRT2).toBeCloseTo(311.1, 1);
    expect(2 * Math.PI * 50).toBeCloseTo(314.2, 1);
    expect(311.13 * Math.sin(100 * Math.PI * 0.0025)).toBeCloseTo(220, 0);
    expect(220 / 48.4).toBeCloseTo(4.545, 3);
    expect((220 / 48.4) * Math.SQRT2).toBeCloseTo(6.43, 2);
    expect(220 ** 2 / 48.4).toBeCloseTo(1000, 5);
    expect(220 * Math.SQRT2 * (220 / 48.4) * Math.SQRT2).toBeCloseTo(2000, 5);
    const xl = 2 * Math.PI * 50 * 0.1;
    const xc = 1 / (2 * Math.PI * 50 * 50e-6);
    expect(xl).toBeCloseTo(31.4, 1);
    expect(xc).toBeCloseTo(63.7, 1);
    expect(220 / xl).toBeCloseTo(7.0, 1);
    expect(220 / xc).toBeCloseTo(3.46, 2);
    expect(2 * Math.PI * 100 * 0.1).toBeCloseTo(62.8, 1);
    expect(1 / (2 * Math.PI * 100 * 50e-6)).toBeCloseTo(31.8, 1);
    // series LCR
    const XL = 1000 * 0.09;
    const XC = 1 / (1000 * 20e-6);
    const Z = Math.hypot(30, XL - XC);
    expect(XL).toBeCloseTo(90, 8);
    expect(XC).toBeCloseTo(50, 8);
    expect(Z).toBeCloseTo(50, 8);
    expect(100 / Z).toBeCloseTo(2, 8);
    expect(Math.hypot(60, 180 - 100)).toBeCloseTo(100, 8);
    expect((Math.atan2(40, 30) * 180) / Math.PI).toBeCloseTo(53.13, 2);
    expect(100 * 2 * (30 / Z)).toBeCloseTo(120, 8);
    expect(2 * 2 * 30).toBe(120);
    // resonance
    const w0 = 1 / Math.sqrt(0.1 * 10e-6);
    expect(w0).toBeCloseTo(1000, 6);
    expect(w0 / (2 * Math.PI)).toBeCloseTo(159.15, 2);
    expect((w0 * 0.1) / 10).toBeCloseTo(10, 6);
    expect(10 / 0.1).toBeCloseTo(100, 8);
    expect((20 / 10) * w0 * 0.1).toBeCloseTo(200, 5);
    expect((20 / 10) / (w0 * 10e-6)).toBeCloseTo(200, 5);
    // LC
    const w = 1 / Math.sqrt(0.01 * 10e-6);
    expect(w).toBeCloseTo(3162.3, 1);
    expect(w / (2 * Math.PI)).toBeCloseTo(503.3, 1);
    const U = 0.5 * 10e-6 * 100;
    expect(U).toBeCloseTo(5e-4, 10);
    expect(Math.sqrt((2 * U) / 0.01)).toBeCloseTo(0.316, 3);
    // transformer and grid
    expect((2000 * 220) / 4400).toBe(100);
    expect(2200 / 220).toBe(10);
    expect(2200 / 4400).toBe(0.5);
    expect((10 * 100) / 2000).toBe(0.5);
    expect((100000 / 2000) ** 2 * 2).toBe(5000);
    expect((100000 / 20000) ** 2 * 2).toBe(50);
  });
});
