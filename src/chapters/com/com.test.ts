import { describe, expect, it } from 'vitest';
import { parseMath, type MathNode } from '../../film/math';
import chapterSource from './Chapter.tsx?raw';

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
  return out;
}

describe('centre of mass chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(40);
    for (const src of all) {
      const words = src
        .replace(/"[^"]*"/g, 'TEXT')
        .split(/\s+/)
        .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
      expect(count(parseMath(src)), src).toBe(words.length);
    }
  });

  it('works out the examples right', () => {
    expect((2 * 0 + 3 * 5) / 5).toBe(3);
    expect((2 * 0 + 3 * 6 + 1 * 0) / 6).toBe(3);
    expect((2 * 0 + 3 * 0 + 1 * 6) / 6).toBe(1);
    const hole = (0 - (1 / 4) * 0.5) / (1 - 1 / 4);
    expect(hole).toBeCloseTo(-1 / 6, 10);
    expect((60 * 4) / 180).toBeCloseTo(1.333, 3);
    expect(4 - (60 * 4) / 180).toBeCloseTo(2.667, 3);
    const th = (60 * Math.PI) / 180;
    const range = (50 * 50 * Math.sin(2 * th)) / 9.8;
    const H = (50 * Math.sin(th)) ** 2 / (2 * 9.8);
    const t = Math.sqrt((2 * H) / 9.8);
    expect(range).toBeCloseTo(220.9, 1);
    expect(H).toBeCloseTo(95.7, 1);
    expect(t).toBeCloseTo(4.42, 2);
    const top = range / 2;
    expect(top + 50 * t).toBeCloseTo(331.4, 1);
    expect((top + (top + 50 * t)) / 2).toBeCloseTo(range, 6);
    expect((Math.atan(0.2 / 0.3) * 180) / Math.PI).toBeCloseTo(33.7, 1);
    expect((2 / 3) * 1).toBeCloseTo(0.667, 3);
    expect((2 / Math.PI)).toBeCloseTo(0.637, 3);
    expect(4 / (3 * Math.PI)).toBeCloseTo(0.424, 3);
  });
});
