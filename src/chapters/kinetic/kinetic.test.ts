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

describe('kinetic theory chapter', () => {
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
    const R = 8.314;
    expect(((1 * R * 273.15) / 101325) * 1000).toBeCloseTo(22.4, 1);
    expect(Math.sqrt((3 * R * 300) / 0.028)).toBeCloseTo(517, 0);
    expect(Math.sqrt((8 * R * 300) / Math.PI / 0.028)).toBeCloseTo(476, 0);
    expect(Math.sqrt((2 * R * 300) / 0.028)).toBeCloseTo(422, 0);
    expect(4 * 300).toBe(1200);
    expect(1.5 * 1.38e-23 * 300).toBeCloseTo(6.21e-21, 23);
    expect(((5 / 2) * R).toFixed(1)).toBe('20.8');
    expect(((7 / 2) * R).toFixed(1)).toBe('29.1');
    expect(7 / 5).toBe(1.4);
    const lam = (1.380649e-23 * 300) / (Math.SQRT2 * Math.PI * (3.7e-10) ** 2 * 101325);
    expect(lam).toBeCloseTo(6.7e-8, 9);
  });
});
