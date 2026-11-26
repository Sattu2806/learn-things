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
  for (const m of src.matchAll(/\['[^']+', '([^']+)'\]/g)) out.push(m[1]);
  return out;
}

describe('rotation chapter', () => {
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
    const g = 9.8;
    expect((20 * 0.3 * Math.sin(Math.PI / 3)).toFixed(2)).toBe('5.20');
    expect(((1 / 12) * 3 * 1.2 ** 2).toFixed(2)).toBe('0.36');
    expect(((1 / 12) * 3 * 1.2 ** 2 + 3 * 0.6 ** 2).toFixed(2)).toBe('1.44');
    expect(((1 / 3) * 3 * 1.2 ** 2).toFixed(2)).toBe('1.44');
    const I = 0.5 * 2 * 0.5 ** 2;
    expect(I).toBe(0.25);
    expect((8 * 0.5) / I).toBe(16);
    expect(16 * 1.5).toBe(24);
    expect((3.2 * 2) / 1.6).toBe(4);
    expect(0.5 * 3.2 * 4).toBeCloseTo(6.4);
    expect(0.5 * 1.6 * 16).toBeCloseTo(12.8);
    expect(Math.sqrt((2 * g * 2) / 1.4).toFixed(2)).toBe('5.29');
    expect(Math.sqrt(2 * g * 2).toFixed(2)).toBe('6.26');
    expect(Math.sqrt((2 * g * 2) / 1.5).toFixed(2)).toBe('5.11');
    expect(Math.sqrt((2 * g * 2) / 2).toFixed(2)).toBe('4.43');
    const N = (15 * g * 1.5) / 4;
    expect(N.toFixed(1)).toBe('55.1');
    expect((N / (15 * g)).toFixed(3)).toBe('0.375');
    const t = (k: number) => Math.sqrt((2 * 3) / ((g * Math.sin(Math.PI / 9)) / (1 + k)));
    expect(t(0.4).toFixed(2)).toBe('1.58');
    expect(t(0.5).toFixed(2)).toBe('1.64');
    expect(t(1).toFixed(2)).toBe('1.89');
    // string and disc: a = m g / (m + I / R^2) = 4.9
    expect((g * 1) / (1 + 0.25 / 0.25)).toBeCloseTo(4.9);
  });
});
