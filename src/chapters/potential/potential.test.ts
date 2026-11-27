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

describe('potential and capacitance chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = [...maths(chapterSource), ...maths(filmSource)];
    expect(all.length).toBeGreaterThan(110);
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
    expect((k * 5e-9) / 0.3).toBeCloseTo(150, 8);
    expect((k * 5e-9) / 0.1).toBeCloseTo(450, 8);
    expect(2e-9 * (450 - 150)).toBeCloseTo(6e-7, 15);
    expect(2 * k * 2e-9 / 0.1 ** 2).toBeCloseTo(3600, 5);
    expect(18 * (1 / 0.1 - 1 / 0.3)).toBeCloseTo(120, 5);
    expect((k * 1e-12) / 0.3).toBeCloseTo(0.03, 10);
    expect(3 * 0.03).toBeCloseTo(0.09, 10);
    const KE = 200 * 1.6e-19;
    expect(KE).toBeCloseTo(3.2e-17, 25);
    expect(Math.sqrt((2 * KE) / 9.11e-31)).toBeCloseTo(8.38e6, -4);
    expect(100 / 0.02).toBe(5000);
    expect(20 / 5000).toBeCloseTo(0.004, 8);
    expect(1.6e-19 * 5000).toBeCloseTo(8e-16, 25);
    const pE = 4e-8 * 3e4;
    expect(pE).toBeCloseTo(1.2e-3, 10);
    expect(pE * (1 - Math.cos(Math.PI / 3))).toBeCloseTo(6e-4, 10);
    expect(2 * pE).toBeCloseTo(2.4e-3, 10);
    const C = (e0 * 0.02) / 1e-3;
    expect(C).toBeCloseTo(1.77e-10, 13);
    expect(C * 100).toBeCloseTo(1.77e-8, 11);
    expect(0.5 * C * 100 ** 2).toBeCloseTo(8.85e-7, 10);
    const C2 = 5 * C;
    expect(C2 * 100).toBeCloseTo(8.85e-8, 10);
    expect(0.5 * C2 * 100 ** 2).toBeCloseTo(4.43e-6, 8);
    const Q = C * 100;
    expect(Q / C2).toBeCloseTo(20, 5);
    expect(Q ** 2 / (2 * C2)).toBeCloseTo(1.77e-7, 9);
    expect(1 / (1 / 2 + 1 / 3)).toBeCloseTo(1.2, 10);
    expect(1.2 * 120).toBeCloseTo(144, 8);
    expect(144 / 2).toBe(72);
    expect(144 / 3).toBe(48);
    expect(2 * 120).toBe(240);
    expect(3 * 120).toBe(360);
    const Ui = 0.5 * 4e-6 * 100 ** 2;
    const Vf = 400 / 10;
    const Uf = 0.5 * 10e-6 * Vf ** 2;
    expect(Vf).toBe(40);
    expect(Ui).toBeCloseTo(0.02, 10);
    expect(Uf).toBeCloseTo(0.008, 10);
    expect(Ui - Uf).toBeCloseTo(0.5 * ((4e-6 * 6e-6) / 10e-6) * 100 ** 2, 10);
    // the far-field dipole potential is within 1% at r = 0.5 m on the axis (a = 0.02)
    const q = 1e-6, a = 0.02, r = 0.5;
    const exact = k * q * (1 / (r - a) - 1 / (r + a));
    expect(Math.abs(exact / ((k * 2 * a * q) / r ** 2) - 1)).toBeLessThan(0.01);
  });
});
