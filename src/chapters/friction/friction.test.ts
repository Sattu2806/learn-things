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
  for (const m of src.matchAll(/items=\{\[((?:\s*'[^']*',?\s*)+)\]\}/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  for (const m of src.matchAll(/wrong='([^']*)'/g)) out.push(m[1]);
  for (const m of src.matchAll(/\['[^']+', '([^']+)'\]/g)) out.push(m[1]);
  return out;
}

describe('friction chapter', () => {
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
    expect(0.5 * 20 * g).toBeCloseTo(98);
    expect(0.4 * 20 * g).toBeCloseTo(78.4);
    expect((98 - 78.4) / 20).toBeCloseTo(0.98);
    expect((Math.atan(0.6) * 180) / Math.PI).toBeCloseTo(31.0, 1);
    const th = (30 * Math.PI) / 180;
    expect(g * (Math.sin(th) - 0.2 * Math.cos(th))).toBeCloseTo(3.20, 2);
    const F = (0.15 * 40 * g) / (Math.cos(th) + 0.15 * Math.sin(th));
    expect(F).toBeCloseTo(62.5, 1);
    expect(40 * g - F * Math.sin(th)).toBeCloseTo(361, 0);
    expect((0.15 * 40 * g) / (Math.cos(th) - 0.15 * Math.sin(th))).toBeCloseTo(74.3, 1);
    expect(6 * 0.3 * g).toBeCloseTo(17.6, 1);
    expect(400 / (2 * 0.7 * g)).toBeCloseTo(29.2, 1);
    expect(400 / (2 * 0.3 * g)).toBeCloseTo(68.0, 1);
    const t35 = (35 * Math.PI) / 180;
    expect(g * (Math.sin(t35) - 0.25 * Math.cos(t35))).toBeCloseTo(3.61, 2);
  });
});
