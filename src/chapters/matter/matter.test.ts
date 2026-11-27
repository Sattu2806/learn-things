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
  for (const m of src.matchAll(/\[(?:'[^']+'|"[^"]+"), '([^']+)'\]/g)) out.push(m[1]);
  for (const m of src.matchAll(/wrong=(?:"([^"]+)"|\{'([^']+)'\})/g)) out.push(m[1] ?? m[2]);
  for (const m of src.matchAll(/src: '([^']+)'/g)) out.push(m[1]);
  return out;
}

describe('magnetism and matter chapter', () => {
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
    const mu0 = 4 * Math.PI * 1e-7;
    // 1 dipole field
    expect(1e-7 * (2 * 1.5) / 0.3 ** 3).toBeCloseTo(1.11e-5, 7);
    expect(1e-7 * 1.5 / 0.3 ** 3).toBeCloseTo(5.56e-6, 8);
    // 2 coil moment
    expect(200 * 2 * 4e-4).toBeCloseTo(0.16, 10);
    // 3 torque, energy, work
    expect(0.4 * 0.25 * Math.sin(Math.PI / 6)).toBeCloseTo(0.05, 10);
    expect(-0.4 * 0.25 * Math.cos(Math.PI / 6)).toBeCloseTo(-0.0866, 4);
    expect(0.4 * 0.25 * Math.cos(Math.PI / 6)).toBeCloseTo(0.0866, 4);
    // 4 compass period
    const T = 2 * Math.PI * Math.sqrt(3e-7 / (0.05 * 3e-5));
    expect(T).toBeCloseTo(2.81, 2);
    expect(T / Math.sqrt(2)).toBeCloseTo(1.99, 2);
    // 5 earth
    expect(3e-5 * Math.tan(Math.PI / 3)).toBeCloseTo(5.2e-5, 7);
    expect(3e-5 / Math.cos(Math.PI / 3)).toBeCloseTo(6.0e-5, 10);
    expect(Math.hypot(3e-5, 3e-5 * Math.tan(Math.PI / 3))).toBeCloseTo(6.0e-5, 10);
    // 6 dip
    expect((Math.atan(2) * 180) / Math.PI).toBeCloseTo(63.4, 1);
    // 7 iron in a solenoid
    const H = 1000 * 0.5;
    expect(H).toBe(500);
    expect(999 * H).toBe(499500);
    expect(mu0 * (H + 999 * H)).toBeCloseTo(0.628, 3);
    expect(mu0 * H).toBeCloseTo(6.28e-4, 6);
    // 8 Curie
    expect(2.4e-5 * (300 / 200)).toBeCloseTo(3.6e-5, 10);
    expect((1200 - 1043) / (1100 - 1043)).toBeCloseTo(2.75, 2);
    // 9 wiping
    expect(4e3 / 2000).toBe(2);
    // 10 atom
    const e = 1.6e-19, v = 2.19e6, r = 5.3e-11;
    expect((e * v) / (2 * Math.PI * r)).toBeCloseTo(1.05e-3, 5);
    expect((e * v * r) / 2).toBeCloseTo(9.29e-24, 26);
    const muB = (e * 6.63e-34) / (4 * Math.PI * 9.1e-31);
    expect(muB).toBeCloseTo(9.27e-24, 25);
  });
});
