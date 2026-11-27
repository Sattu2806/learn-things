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
  for (const m of src.matchAll(/<M>\{?['`]([^'`]+)['`]\}?<\/M>|<M>([^<{]+)<\/M>/g)) out.push((m[1] ?? m[2]).trim().replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
  for (const m of src.matchAll(/(?:src|items|wrong)=\{?\[?((?:\s*'[^']*',?\s*)+)\]?\}?/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  for (const m of src.matchAll(/wrong="([^"]*)"/g)) out.push(m[1]);
  for (const m of src.matchAll(/\['[^']+', '([^']+)'\]/g)) out.push(m[1]);
  return out;
}

describe('elasticity chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(60);
    for (const src of all) {
      const words = src
        .replace(/"[^"]*"/g, 'TEXT')
        .split(/\s+/)
        .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
      expect(count(parseMath(src)), src).toBe(words.length);
    }
  });

  it('works out the examples right', () => {
    const Y = 2e11;
    const stress = 100 / 1e-6;
    expect(stress).toBe(1e8);
    expect(stress / Y).toBeCloseTo(5e-4, 12);
    expect((stress / Y) * 2).toBeCloseTo(1e-3, 12);
    const phi = 1e6 / 8e10;
    expect(phi).toBeCloseTo(1.25e-5, 12);
    expect(phi * 0.1).toBeCloseTo(1.25e-6, 12);
    expect(1e8 / 1.6e11).toBeCloseTo(6.25e-4, 12);
    expect((1e8 / 1.6e11) * 1e-3 * 1e6).toBeCloseTo(0.625, 9);
    expect(0.5 * 100 * 1e-3).toBeCloseTo(0.05, 12);
    expect(0.5 * 1e8 * 5e-4 * 2e-6).toBeCloseTo(0.05, 12);
    const A = (2000 * 9.8) / (5e8 / 5);
    expect(A).toBeCloseTo(1.96e-4, 10);
    expect(Math.sqrt((4 * A) / Math.PI) * 1e3).toBeCloseTo(15.8, 1);
    expect((1 / 4 / 2) * 1).toBeCloseTo(1 / 8, 12);
    expect((40 * 60 ** 3 - 34 * 48 ** 3) / 12 / ((24 * 32 ** 3) / 12)).toBeCloseTo(6.2, 1);
  });
});
