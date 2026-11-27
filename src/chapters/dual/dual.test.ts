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

describe('dual nature chapter', () => {
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
    const h = 6.63e-34, c = 3e8, e = 1.6e-19, m = 9.11e-31;
    // 1: photon energy
    expect(c / 400e-9).toBeCloseTo(7.5e14, -10);
    expect(h * 7.5e14).toBeCloseTo(4.97e-19, 21);
    expect(4.97e-19 / e).toBeCloseTo(3.1, 1);
    expect(1240 / 400).toBeCloseTo(3.1, 5);
    expect((h * c) / e / 1e-9).toBeCloseTo(1240, -1);
    expect((h * c) / e / 1e-9).toBeCloseTo(1243, 0);
    // 2: potassium
    const K = 1240 / 400 - 2.3;
    expect(K).toBeCloseTo(0.8, 5);
    expect(K * e).toBeCloseTo(1.28e-19, 21);
    expect(Math.sqrt((2 * K * e) / m)).toBeCloseTo(5.3e5, -4);
    expect(1240 / 2.3).toBeCloseTo(539, 0);
    // 3: orange light
    expect(1240 / 600).toBeCloseTo(2.07, 2);
    expect(2.3 - 1240 / 600).toBeCloseTo(0.23, 2);
    // 4: counting photons
    const E = 3.1 * e;
    expect(E).toBeCloseTo(4.96e-19, 21);
    const N = 1e-3 / E;
    expect(N).toBeCloseTo(2.0e15, -14);
    expect((N / 1000) * e).toBeCloseTo(3.2e-7, 8);
    expect(N * e).toBeCloseTo(3.2e-4, 5);
    // 5: h from a graph
    const dnu = c / 300e-9 - c / 400e-9;
    expect(dnu).toBeCloseTo(2.5e14, -10);
    expect((e * (2.03 - 1.0)) / dnu).toBeCloseTo(6.6e-34, 35);
    expect(1240 / 400 - 1.0).toBeCloseTo(2.1, 5);
    expect(1240 / 300 - 2.03).toBeCloseTo(2.1, 1);
    // 6: electron at 100 V
    const v = Math.sqrt((2 * e * 100) / m);
    expect(v).toBeCloseTo(5.9e6, -5);
    expect(v / c).toBeCloseTo(0.02, 2);
    expect(h / (m * 5.93e6)).toBeCloseTo(1.23e-10, 12);
    expect(1.227 / Math.sqrt(100)).toBeCloseTo(0.123, 3);
    expect(h / Math.sqrt(2 * m * e * 100)).toBeCloseTo(1.227e-10, 12);
    // 7: cricket ball
    expect(0.15 * 30).toBeCloseTo(4.5, 5);
    expect(h / 4.5).toBeCloseTo(1.47e-34, 36);
    // 8: photon momentum and electron with the same wavelength
    const p = h / 500e-9;
    expect(p).toBeCloseTo(1.33e-27, 29);
    expect(p / m).toBeCloseTo(1.46e3, -1);
    expect((0.5 * m * (p / m) ** 2) / e).toBeCloseTo(6e-6, 7);
    // 9: Davisson and Germer
    expect(1.227 / Math.sqrt(54)).toBeCloseTo(0.167, 3);
    expect(Math.sqrt(54)).toBeCloseTo(7.35, 2);
    expect(0.215 * Math.sin((50 * Math.PI) / 180)).toBeCloseTo(0.165, 3);
    expect(Math.abs(0.167 - 0.165) / 0.167).toBeLessThan(0.015);
    // 10: same energy
    expect(1240 / 1).toBe(1240);
    expect(1.227 / Math.sqrt(1)).toBeCloseTo(1.23, 2);
    // the work function of a photon of the maximum frequency in the figures
    expect(1.99e-25 / 1.6e-19).toBeCloseTo(1.243e-6, 8);
  });
});
