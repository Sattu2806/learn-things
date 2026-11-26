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

const decode = (s: string) => s.replace(/&gt;/g, '>').replace(/&lt;/g, '<');

function maths(src: string): string[] {
  const out: string[] = [];
  for (const m of src.matchAll(/<M>\{?['`]([^'`]+)['`]\}?<\/M>|<M>([^<{]+)<\/M>/g)) out.push(decode((m[1] ?? m[2]).trim()));
  for (const m of src.matchAll(/src=\{?\[?((?:\s*'[^']*',?\s*)+)\]?\}?/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  for (const m of src.matchAll(/\['[^']+', '([^']+)'\]/g)) out.push(m[1]);
  for (const m of src.matchAll(/items=\{\[([^\]]*)\]\}/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  for (const m of src.matchAll(/wrong=(?:'([^']*)'|\{'([^']*)'\})/g)) out.push(m[1] ?? m[2]);
  return out;
}

describe("Newton's laws chapter", () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(80);
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
    // 1 pushed box
    expect(100 - 30).toBe(70);
    expect(70 / 20).toBeCloseTo(3.5, 10);
    expect((70 / 20) * 4).toBeCloseTo(14, 10);
    // 2 cricket ball
    const dp = 0.16 * 25;
    expect(dp).toBeCloseTo(4.0, 10);
    expect(dp / 0.1).toBeCloseTo(40, 10);
    expect(dp / 0.5).toBeCloseTo(8, 10);
    // 3 two blocks
    const a3 = 20 / (4 + 6);
    expect(a3).toBeCloseTo(2, 10);
    expect(6 * a3).toBeCloseTo(12, 10);
    expect(20 - 6 * a3).toBeCloseTo(4 * a3, 10);
    // 4 Atwood machine
    const a4 = ((3 - 2) * g) / 5;
    expect(a4).toBeCloseTo(1.96, 10);
    const T4 = 2 * (g + a4);
    expect(T4.toFixed(1)).toBe('23.5');
    expect(3 * (g - a4)).toBeCloseTo(T4, 10);
    expect((2 * 3 * 2 * g) / 5).toBeCloseTo(T4, 10);
    // 5 lift
    expect(60 * (g + 2)).toBeCloseTo(708, 10);
    expect(60 * (g - 2)).toBeCloseTo(468, 10);
    expect(60 * g).toBeCloseTo(588, 10);
    // 6 lamp
    const W = 2 * g;
    const rad = Math.PI / 180;
    const T1 = W * Math.sin(150 * rad) / Math.sin(90 * rad);
    const T2 = W * Math.sin(120 * rad) / Math.sin(90 * rad);
    expect(T1.toFixed(1)).toBe('9.8');
    expect(T2.toFixed(1)).toBe('17.0');
    expect(T1 * Math.cos(30 * rad)).toBeCloseTo(T2 * Math.cos(60 * rad), 8);
    expect(T1 * Math.sin(30 * rad) + T2 * Math.sin(60 * rad)).toBeCloseTo(W, 8);
    expect((T1 * Math.cos(30 * rad)).toFixed(2)).toBe('8.49');
    // theory figures and mistakes
    expect(((5 - 3) * g) / 8).toBeCloseTo(2.45, 10);
    expect(((2 * 5 * 3 * g) / 8).toFixed(1)).toBe('36.8');
    expect(5 * g).toBeCloseTo(49, 10);
    expect(3 * g).toBeCloseTo(29.4, 10);
    expect(60 * 1.62).toBeCloseTo(97.2, 10);
    expect(10 / 5).toBe(2);
    expect(3 * 2).toBe(6);
  });
});
