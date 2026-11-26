import { describe, expect, it } from 'vitest';
import { parseMath, type MathNode } from '../../film/math';
import chapterSource from './CircularChapter.tsx?raw';

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

describe('circular motion chapter', () => {
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
    const fan = (2 * Math.PI * 120) / 60;
    expect(fan.toFixed(1)).toBe('12.6');
    expect((fan * 0.6).toFixed(2)).toBe('7.54');
    expect((fan * fan * 0.6).toFixed(1)).toBe('94.7');
    const earth = (2 * Math.PI) / 86400;
    expect((earth * earth * 6.4e6).toFixed(4)).toBe('0.0338');
    const moonT = 27.3 * 86400;
    const moon = ((2 * Math.PI) / moonT) ** 2 * 3.84e8;
    expect(moon.toExponential(2)).toBe('2.72e-3');
    expect((9.8 * (6.4e6 / 3.84e8) ** 2).toExponential(2)).toBe('2.72e-3');
    expect((12 / 11) * 60).toBeCloseTo(65.45, 2);
  });
});
