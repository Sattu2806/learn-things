import { describe, expect, it } from 'vitest';
import { parseMath, type MathNode } from '../../film/math';
import chapterSource from './Chapter.tsx?raw';

// Every maths string in the chapter must parse completely: a stray "|" or a
// bracket glued to a number silently drops the rest of the equation.
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
  for (const m of src.matchAll(/items=\{\[((?:\s*'[^']*',?\s*)+)\]\}/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  for (const m of src.matchAll(/\['[^']+', '([^']+)'\]/g)) out.push(m[1]);
  for (const m of src.matchAll(/wrong=["']([^"']+)["']/g)) out.push(m[1]);
  return out;
}

describe('straight-line motion chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(100);
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
    // 1. car from rest
    expect(2.5 * 8).toBe(20);
    expect(0.5 * 2.5 * 8 ** 2).toBe(80);
    expect(Math.sqrt(2 * 2.5 * 80)).toBe(20);
    // 2. train
    expect(72 / 3.6).toBe(20);
    expect(-(20 ** 2) / (2 * 400)).toBe(-0.5);
    expect(20 / 0.5).toBe(40);
    // 3. cliff
    expect((15 * 15) / (2 * g)).toBeCloseTo(11.48, 2);
    expect(15 / g).toBeCloseTo(1.53, 2);
    const t = (15 + Math.sqrt(15 ** 2 + 4 * 4.9 * 40)) / (2 * 4.9);
    expect(t).toBeCloseTo(4.77, 2);
    expect(Math.sqrt(15 ** 2 + 2 * g * 40)).toBeCloseTo(31.8, 1);
    expect(15 - g * t).toBeCloseTo(-31.8, 1);
    // 4. v-t graph
    const zero = 5 + 10 / 7;
    expect(zero).toBeCloseTo(6.43, 2);
    const areas = [10, 30, 0.5 * (zero - 5) * 10, -0.5 * (7 - zero) * 4];
    expect(areas[2]).toBeCloseTo(7.14, 2);
    expect(areas[3]).toBeCloseTo(-1.14, 2);
    expect(areas.reduce((a, b) => a + b, 0)).toBeCloseTo(46.0, 1);
    expect(areas.reduce((a, b) => a + Math.abs(b), 0)).toBeCloseTo(48.3, 1);
    // 5. stopping distance
    for (const [kmh, dr, db, d] of [
      [50, 11.1, 16.1, 27.2],
      [100, 22.2, 64.3, 86.5],
    ]) {
      const u = kmh / 3.6;
      expect(u * 0.8).toBeCloseTo(dr, 1);
      expect(u ** 2 / 12).toBeCloseTo(db, 1);
      expect(u * 0.8 + u ** 2 / 12).toBeCloseTo(d, 1);
    }
    expect((100 / 3.6 * 0.8 + (100 / 3.6) ** 2 / 12) / (50 / 3.6 * 0.8 + (50 / 3.6) ** 2 / 12)).toBeCloseTo(3.18, 2);
    // 6. runners
    expect(100 / (6 + 4)).toBe(10);
    expect(6 * 10).toBe(60);
    // theory numbers
    expect(((3.5 ** 2 - 1) / 2.5)).toBeCloseTo(4.5, 2);
    expect(13 / 5.2).toBeCloseTo(2.5, 2);
    expect(3 / 5.2).toBeCloseTo(0.577, 3);
    expect(20 ** 2 / (2 * 7)).toBeCloseTo(28.6, 1);
    expect(20 * 0.75 + 20 ** 2 / 14).toBeCloseTo(43.6, 1);
    expect(14.7 ** 2 / (2 * g)).toBeCloseTo(11.0, 1);
    expect(14.7 / g).toBeCloseTo(1.5, 2);
    expect(40 / (20 - 15) * 5 / 5).toBe(8);
  });
});
