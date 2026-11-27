import { describe, expect, it } from 'vitest';
import { parseMath, type MathNode } from '../../film/math';
import chapterSource from './Chapter.tsx?raw';
import filmSource from './film.ts?raw';

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
  for (const m of src.matchAll(/wrong=(?:"([^"]+)"|\{'([^']+)'\})/g)) out.push(m[1] ?? m[2]);
  return out;
}

function parsesFully(src: string) {
  const words = src
    .replace(/"[^"]*"/g, 'TEXT')
    .split(/\s+/)
    .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
  expect(count(parseMath(src)), src).toBe(words.length);
}

describe('wave optics chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(60);
    all.forEach(parsesFully);
  });

  it('writes every equation of the film so it parses completely', () => {
    const all = [...filmSource.matchAll(/src: '([^']+)'/g)].map((m) => m[1]);
    expect(all.length).toBeGreaterThanOrEqual(8);
    all.forEach(parsesFully);
  });

  it('works out the examples right', () => {
    const c = 3e8;
    // 1: light entering glass
    expect(c / 600e-9).toBeCloseTo(5.0e14, -12);
    expect(c / 1.5).toBeCloseTo(2.0e8, -5);
    expect((2.0e8 / 5.0e14) * 1e9).toBeCloseTo(400, 5);
    // 2: Snell
    const r = Math.asin(Math.sin(30 * (Math.PI / 180)) / 1.5);
    expect(Math.sin(30 * (Math.PI / 180)) / 1.5).toBeCloseTo(0.333, 3);
    expect((r * 180) / Math.PI).toBeCloseTo(19.5, 1);
    // 3: Young
    const beta = (600e-9 * 1.2) / 0.5e-3;
    expect(beta * 1e3).toBeCloseTo(1.44, 5);
    expect(3 * beta * 1e3).toBeCloseTo(4.32, 5);
    expect(1.5 * beta * 1e3).toBeCloseTo(2.16, 5);
    // 4: wavelength from the fifth fringe
    expect(7.5 / 5).toBeCloseTo(1.5, 5);
    expect(((1.5e-3 * 0.4e-3) / 1.0) * 1e9).toBeCloseTo(600, 5);
    // 5: in water
    expect(600 / (4 / 3)).toBeCloseTo(450, 5);
    expect(((450e-9 * 1.2) / 0.5e-3) * 1e3).toBeCloseTo(1.08, 5);
    expect(beta / (4 / 3)).toBeCloseTo(1.08e-3, 8);
    // 6: single slit
    const y1 = (500e-9 * 2.0) / 0.2e-3;
    expect(y1 * 1e3).toBeCloseTo(5.0, 5);
    expect(2 * y1 * 1e3).toBeCloseTo(10, 5);
    expect(500e-9 / 0.2e-3).toBeCloseTo(2.5e-3, 6);
    // 7: intensity a quarter of a wavelength out
    const phi = (2 * Math.PI) / 4;
    expect(phi).toBeCloseTo(Math.PI / 2, 8);
    expect(4 * Math.cos(phi / 2) ** 2).toBeCloseTo(2, 8);
    expect(Math.cos(Math.PI / 4) ** 2).toBeCloseTo(0.5, 8);
    // 8: polaroids
    expect(0.5 * Math.cos(60 * (Math.PI / 180)) ** 2).toBeCloseTo(0.125, 8);
    expect(0.5 * Math.cos(Math.PI / 4) ** 4).toBeCloseTo(1 / 8, 8);
    // 9: Brewster
    const iB = (Math.atan(1.5) * 180) / Math.PI;
    expect(iB).toBeCloseTo(56.3, 1);
    expect(90 - iB).toBeCloseTo(33.7, 1);
    expect(Math.sin((56.3 * Math.PI) / 180)).toBeCloseTo(0.832, 3);
    expect(Math.sin((56.3 * Math.PI) / 180) / 1.5).toBeCloseTo(0.555, 3);
    expect((Math.atan(1.33) * 180) / Math.PI).toBeCloseTo(53, 0);
    // the 15% in the Brewster mistake
    expect(Math.sin(((iB - (90 - iB)) * Math.PI) / 180) ** 2).toBeCloseTo(0.148, 3);
    expect(Math.sin((22.6 * Math.PI) / 180) ** 2).toBeCloseTo(0.148, 3);
  });
});
