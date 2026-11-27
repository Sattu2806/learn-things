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

describe('moving charges and magnetism chapter', () => {
  it('writes every equation so it parses completely', () => {
    for (const source of [chapterSource, filmSource]) {
      const all = maths(source);
      expect(all.length).toBeGreaterThan(source === chapterSource ? 100 : 6);
      for (const src of all) {
        const words = src
          .replace(/"[^"]*"/g, 'TEXT')
          .split(/\s+/)
          .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
        expect(count(parseMath(src)), src).toBe(words.length);
        const bars = (src.replace(/"[^"]*"/g, '').match(/\s\|\s/g) ?? []).length;
        const opens = (src.replace(/"[^"]*"/g, '').match(/(^|\s)\[\s/g) ?? []).length;
        expect(bars, src).toBe(opens);
      }
    }
  });

  it('works out the examples right', () => {
    const e = 1.6e-19, mp = 1.67e-27, me = 9.1e-31, mu0 = 4 * Math.PI * 1e-7;
    // 1 proton
    expect(e * 5e6 * 0.5).toBeCloseTo(4.0e-13, 15);
    expect((mp * 5e6) / (e * 0.5)).toBeCloseTo(0.104, 3);
    expect((2 * Math.PI * mp) / (e * 0.5)).toBeCloseTo(1.31e-7, 9);
    expect((e * 5e6 * 0.5) / mp).toBeCloseTo(2.4e14, -13);
    // 2 electron
    const v = Math.sqrt((2 * e * 2000) / me);
    expect(v).toBeCloseTo(2.65e7, -5);
    expect(v / 3e8).toBeCloseTo(0.09, 2);
    expect((me * v) / (e * 0.01)).toBeCloseTo(0.0151, 4);
    // 3 selector
    expect(2e4 / 0.1).toBe(2e5);
    // 4 cyclotron
    expect((e * 1.5) / (2 * Math.PI * mp)).toBeCloseTo(2.29e7, -5);
    const ke = (e * e * 1.5 ** 2 * 0.5 ** 2) / (2 * mp);
    expect(ke).toBeCloseTo(4.31e-12, 14);
    expect(ke / 1.6e-13).toBeCloseTo(26.9, 1);
    // 5 rod
    expect(4 * 0.5 * 0.3).toBeCloseTo(0.6, 10);
    expect(4 * 0.5 * 0.3 * Math.sin(Math.PI / 6)).toBeCloseTo(0.3, 10);
    // 6 fields
    expect((mu0 * 10) / (2 * Math.PI * 0.05)).toBeCloseTo(4.0e-5, 8);
    expect((mu0 * 20 * 2) / (2 * 0.05)).toBeCloseTo(5.03e-4, 6);
    // 7 solenoid
    expect(500 / 0.25).toBe(2000);
    expect(mu0 * 2000 * 3).toBeCloseTo(7.54e-3, 5);
    expect(mu0 * 2000 * 1.5).toBeCloseTo(3.77e-3, 5);
    // 8 wires
    expect((mu0 * 5 * 10) / (2 * Math.PI * 0.1)).toBeCloseTo(1.0e-4, 8);
    // 9 torque
    expect(0.04 * 0.05).toBeCloseTo(2e-3, 10);
    expect(100 * 0.5 * 2e-3).toBeCloseTo(0.1, 10);
    expect(0.1 * 0.2).toBeCloseTo(0.02, 10);
    // 10 meters
    expect((2e-3 * 50) / (1 - 2e-3)).toBeCloseTo(0.1, 3);
    expect(10 / 2e-3 - 50).toBe(4950);
  });
});
