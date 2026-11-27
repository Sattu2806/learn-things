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
  for (const m of src.matchAll(/wrong="([^"]+)"/g)) out.push(m[1]);
  return out;
}

describe('waves chapter', () => {
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
    expect((343 / 256).toFixed(2)).toBe('1.34');
    expect(Math.sqrt(100 / 0.01)).toBe(100);
    expect(2 / 100).toBe(0.02);
    expect((286 / (2 * 0.65)).toFixed(0)).toBe('220');
    expect((0.65 / 3).toFixed(3)).toBe('0.217');
    expect(((2 * 0.65) / 3).toFixed(3)).toBe('0.433');
    expect(343 / (4 * 0.5)).toBe(171.5);
    expect(3 * 171.5).toBe(514.5);
    expect(343 / (2 * 0.5)).toBe(343);
    expect(Math.abs(440 - 444)).toBe(4);
    expect(((500 * 343) / (343 - 30)).toFixed(0)).toBe('548');
    expect(((500 * 343) / (343 + 30)).toFixed(0)).toBe('460');
    expect(((500 * (343 + 30)) / 343).toFixed(0)).toBe('544');
    expect(Math.sqrt(101300 / 1.29).toFixed(0)).toBe('280');
    expect(Math.sqrt((1.4 * 101300) / 1.29).toFixed(0)).toBe('332');
  });
});
