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

describe('electromagnetic induction chapter', () => {
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
        // A bare bar outside a fraction would break the layout.
        const bars = (src.replace(/"[^"]*"/g, '').match(/\s\|\s/g) ?? []).length;
        const opens = (src.replace(/"[^"]*"/g, '').match(/(^|\s)\[\s/g) ?? []).length;
        expect(bars, src).toBe(opens);
      }
    }
  });

  it('works out the examples right', () => {
    const mu0 = 4 * Math.PI * 1e-7;
    // 1 coil in a changing field
    const dPhi = 0.01 * (0.8 - 0.2);
    expect(dPhi).toBeCloseTo(0.006, 10);
    expect(200 * (dPhi / 0.5)).toBeCloseTo(2.4, 10);
    expect(2.4 / 12).toBeCloseTo(0.2, 10);
    expect(0.2 * 0.5).toBeCloseTo(0.1, 10);
    expect((200 * dPhi) / 12).toBeCloseTo(0.1, 10);
    // 2 turning loop
    expect(0.4 * 0.05).toBeCloseTo(0.02, 10);
    expect(10 * (0.02 / 0.1)).toBeCloseTo(2, 10);
    // 3 rod on rails
    expect(0.25 * 0.4 * 5).toBeCloseTo(0.5, 10);
    expect(0.5 / 2).toBeCloseTo(0.25, 10);
    expect(0.25 * 0.4 * 0.25).toBeCloseTo(0.025, 10);
    expect(0.025 * 5).toBeCloseTo(0.125, 10);
    expect(0.25 ** 2 * 2).toBeCloseTo(0.125, 10);
    // 4 terminal speed
    const vt = (0.05 * 9.8 * 1) / (0.4 ** 2 * 0.5 ** 2);
    expect(vt).toBeCloseTo(12.25, 10);
    expect((0.4 * 0.5 * vt) / 1).toBeCloseTo(2.45, 10);
    expect(0.4 * 2.45 * 0.5).toBeCloseTo(0.49, 10);
    // 5 spinning rod
    const w = 2 * Math.PI * 10;
    expect(w).toBeCloseTo(62.8, 1);
    expect(0.5 * 0.2 * w * 0.25).toBeCloseTo(1.57, 2);
    expect(w * 0.5).toBeCloseTo(31.4, 1);
    // 6 solenoid inductance
    const L = (mu0 * 500 ** 2 * 1e-3) / 0.5;
    expect(L).toBeCloseTo(6.28e-4, 6);
    expect(L * (4 / 0.01)).toBeCloseTo(0.251, 3);
    expect(0.5 * L * 16).toBeCloseTo(5.03e-3, 5);
    expect(L * (4 / 0.001)).toBeCloseTo(2.51, 2);
    // 7 energy in the field
    const B = mu0 * 1000 * 4;
    expect(B).toBeCloseTo(5.03e-3, 5);
    const u = B ** 2 / (2 * mu0);
    expect(u).toBeCloseTo(10.1, 1);
    expect(u * 5e-4).toBeCloseTo(0.5 * L * 16, 6);
    // 8 mutual inductance
    const Mi = (mu0 * 500 * 100 * 1e-3) / 0.5;
    expect(Mi).toBeCloseTo(1.26e-4, 6);
    expect(Mi * (3 / 0.02)).toBeCloseTo(0.0189, 3);
    // 9 generator
    const om = 2 * Math.PI * 50;
    expect(om).toBeCloseTo(314.2, 1);
    expect(100 * 0.4 * 0.05 * om).toBeCloseTo(628, 0);
    expect(om / 300).toBeCloseTo(Math.PI / 3, 3);
    expect(100 * 0.4 * 0.05 * om * Math.sin(om / 300)).toBeCloseTo(544, 0);
    expect(1 / 300 / (1 / 50)).toBeCloseTo(1 / 6, 10);
  });
});
