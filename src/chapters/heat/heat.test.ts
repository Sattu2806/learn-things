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
  for (const m of src.matchAll(/items=\{\[([^\]]*)\]\}/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  for (const m of src.matchAll(/\['[^']+', '([^']+)'\]/g)) out.push(m[1]);
  for (const m of src.matchAll(/wrong=\{?['"]([^'"]+)['"]\}?/g)) out.push(m[1]);
  return out;
}

describe('heat chapter', () => {
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
    const c = ((98.6 - 32) * 5) / 9;
    expect(c.toFixed(1)).toBe('37.0');
    expect((c + 273.15).toFixed(2)).toBe('310.15');
    expect(1.2e-5 * 30 * 40).toBeCloseTo(0.0144, 6);
    expect(30 - 2 * 14.4).toBeCloseTo(1.2, 6);
    expect((200 * 80 + 300 * 20) / 500).toBe(44);
    expect(0.1 * 3.34e5 + 0.1 * 4186 * 50).toBeCloseTo(54330, 6);
    expect((0.8 * 1.5 * 15) / 0.004).toBeCloseTo(4500, 6);
    const k = Math.log(70 / 50) / 10;
    expect(k.toFixed(4)).toBe('0.0336');
    expect((Math.log(3.5) / k).toFixed(1)).toBe('37.2');
    const r1 = 0.5 / 385;
    const r2 = 0.5 / 50;
    expect((100 - (100 * r1) / (r1 + r2)).toFixed(1)).toBe('88.5');
    expect((327 / 300) ** 4).toBeCloseTo(1.41, 2);
  });
});
