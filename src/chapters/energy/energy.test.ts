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

describe('work, energy and power chapter', () => {
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
    const g = 9.8;
    expect((50 * 20 * Math.cos(Math.PI / 6)).toFixed(0)).toBe('866');
    expect((50 * Math.cos(Math.PI / 6)).toFixed(1)).toBe('43.3');
    expect(Math.sqrt(2 * g * 5).toFixed(2)).toBe('9.90');
    const U = 0.5 * 200 * 0.1 ** 2;
    expect(U).toBeCloseTo(1, 10);
    expect(Math.sqrt((2 * U) / 0.5)).toBeCloseTo(2, 10);
    const f = 0.7 * 1000 * g;
    expect(f).toBeCloseTo(6860, 6);
    expect((200000 / f).toFixed(1)).toBe('29.2');
    expect((40 ** 2 / (2 * 0.7 * g)).toFixed(0)).toBe('117');
    expect(60 * g * 3).toBeCloseTo(1764, 6);
    expect((60 * g * 3) / 4).toBeCloseTo(441, 6);
    expect(Math.sqrt(g * 5).toFixed(2)).toBe('7.00');
    expect(Math.sqrt(2 * g * 12.5).toFixed(1)).toBe('15.7');
    expect(3 * 2 + 4 * 1).toBe(10);
    expect((500 * g * 20) / 25 / 0.8).toBeCloseTo(4900, 6);
  });
});
