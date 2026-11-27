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

describe('current electricity chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = [...maths(chapterSource), ...maths(filmSource)];
    expect(all.length).toBeGreaterThan(150);
    for (const src of all) {
      const words = src
        .replace(/"[^"]*"/g, 'TEXT')
        .split(/\s+/)
        .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
      expect(count(parseMath(src)), src).toBe(words.length);
    }
  });

  it('works out the examples right', () => {
    const e = 1.6e-19;
    expect(0.8 * 120).toBeCloseTo(96, 8);
    expect(96 / e).toBeCloseTo(6e20, -17);
    const vd = 2 / (8.5e28 * e * 1e-6);
    expect(vd).toBeCloseTo(1.47e-4, 6);
    expect(1 / vd / 3600).toBeCloseTo(1.9, 1);
    const A = Math.PI * (0.2e-3) ** 2;
    expect(A).toBeCloseTo(1.257e-7, 10);
    const R = (1.1e-6 * 2) / A;
    expect(R).toBeCloseTo(17.5, 1);
    expect((1.1e-6 * 4) / (A / 2) / 2 / 2).toBeCloseTo(R, 5);
    expect(50 * (1 + 0.004 * 80)).toBeCloseTo(66, 8);
    const Rp = (6 * 3) / 9;
    expect(Rp).toBe(2);
    expect(12 / (Rp + 4)).toBe(2);
    expect(2 * Rp).toBe(4);
    expect(4 / 6).toBeCloseTo(0.67, 2);
    expect(4 / 3).toBeCloseTo(1.33, 2);
    expect(4 / 6 + 4 / 3).toBeCloseTo(2, 10);
    expect(12 * 2).toBe(24);
    expect(2 ** 2 * 4).toBe(16);
    expect(220 ** 2 / 100).toBe(484);
    expect(100 / 220).toBeCloseTo(0.455, 3);
    expect(0.1 * 10).toBe(1);
    expect(1.5 / (2.5 + 0.5)).toBeCloseTo(0.5, 10);
    expect(1.5 - 0.5 * 0.5).toBeCloseTo(1.25, 10);
    expect(0.25 * 2.5).toBeCloseTo(0.625, 10);
    expect(0.25 * 0.5).toBeCloseTo(0.125, 10);
    expect(1.5 / 0.5).toBe(3);
    // Kirchhoff: 10 - 2 I1 - 4 I3 = 0, 4 - I2 - 4 I3 = 0, I3 = I1 + I2
    const I1 = 17 / 7, I2 = -8 / 7, I3 = 9 / 7;
    expect(I3).toBeCloseTo(I1 + I2, 10);
    expect(10 - 2 * I1 - 4 * I3).toBeCloseTo(0, 10);
    expect(4 - 1 * I2 - 4 * I3).toBeCloseTo(0, 10);
    expect(I1).toBeCloseTo(2.43, 2);
    expect(I2).toBeCloseTo(-1.14, 2);
    expect(I3).toBeCloseTo(1.29, 2);
    expect(6 * I1 + 4 * I2).toBeCloseTo(10, 10);
    expect(4 * I1 + 5 * I2).toBeCloseTo(4, 10);
    // Wheatstone and meter bridge
    expect((30 * 20) / 10).toBe(60);
    expect(6 * (20 / 30)).toBeCloseTo(4, 10);
    expect(6 * (60 / 90)).toBeCloseTo(4, 10);
    expect(12 * (60 / 40)).toBe(18);
    expect(18 / 12).toBeCloseTo(60 / 40, 10);
    // potentiometer
    const I = 3 / 30;
    expect(I * 20).toBeCloseTo(2, 10);
    const k = 2 / 10;
    expect(k * 5).toBeCloseTo(1.0, 10);
    expect(k * 4).toBeCloseTo(0.8, 10);
    expect(8 * (5 / 4 - 1)).toBeCloseTo(2, 10);
    expect(0.8 / 8).toBeCloseTo(0.1, 10);
    expect(1.0 - 0.1 * 2).toBeCloseTo(0.8, 10);
    // range from copper to glass
    expect(Math.log10(1e10 / 1.7e-8)).toBeGreaterThan(17);
  });
});
