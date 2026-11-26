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
  for (const m of src.matchAll(/wrong=(?:"([^"]*)"|\{'([^']*)'\})/g)) out.push((m[1] ?? m[2]).trim());
  return out;
}

describe('forces in circular motion chapter', () => {
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
    expect((0.2 * 16 / 0.5).toFixed(1)).toBe('6.4');
    expect(Math.sqrt(0.6 * g * 50).toFixed(1)).toBe('17.1');
    expect(Math.sqrt(0.3 * g * 50).toFixed(1)).toBe('12.1');
    expect(((Math.atan(400 / (100 * g)) * 180) / Math.PI).toFixed(1)).toBe('22.2');
    const th = Math.PI / 6;
    expect(((0.5 * g) / Math.cos(th)).toFixed(2)).toBe('5.66');
    const r = Math.sin(th);
    const v = Math.sqrt(r * g * Math.tan(th));
    expect(v.toFixed(2)).toBe('1.68');
    expect(((2 * Math.PI * r) / v).toFixed(2)).toBe('1.87');
    expect((2 * Math.PI * Math.sqrt(Math.cos(th) / g)).toFixed(2)).toBe('1.87');
    expect((0.2 * (25 / 0.5 + g)).toFixed(1)).toBe('12.0');
    const vt2 = 25 - 4 * g * 0.5;
    expect((0.2 * (vt2 / 0.5 - g)).toFixed(2)).toBe('0.20');
    expect(Math.sqrt(g * 0.5).toFixed(2)).toBe('2.21');
    expect(Math.sqrt(5 * g * 0.5).toFixed(2)).toBe('4.95');
    expect(Math.sqrt(g * 10).toFixed(2)).toBe('9.90');
    const a = Math.tan((22.2 * Math.PI) / 180);
    expect(Math.sqrt(100 * g * ((a + 0.3) / (1 - 0.3 * a))).toFixed(1)).toBe('28.1');
    expect(Math.sqrt(100 * g * ((a - 0.3) / (1 + 0.3 * a))).toFixed(2)).toBe('9.71');
    expect(Math.sqrt(g / (0.4 * 2.5)).toFixed(2)).toBe('3.13');
  });
});
