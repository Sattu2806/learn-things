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
  for (const m of src.matchAll(/\['[^']+', '[^']*', '([^']+)'(?:, '([^']+)')?\]/g)) out.push(m[1]);
  return out;
}

describe('thermodynamics chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(40);
    for (const src of all) {
      const words = src.replace(/"[^"]*"/g, 'TEXT').split(/\s+/).filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
      expect(count(parseMath(src)), src).toBe(words.length);
    }
  });
  it('works out the examples right', () => {
    const R = 8.314;
    expect(1e5 * 3e-3).toBeCloseTo(300);
    expect(500 - 200).toBe(300);
    expect(R * 300 * Math.log(2)).toBeCloseTo(1729, 0);
    expect(1 - 300 / 500).toBeCloseTo(0.4);
    expect(600 / 200).toBe(3);
    expect(275 / 25).toBe(11);
    expect(300 * 16 ** 0.4).toBeCloseTo(909.4, 1);
    expect(16 ** 1.4).toBeCloseTo(48.5, 1);
  });
});
