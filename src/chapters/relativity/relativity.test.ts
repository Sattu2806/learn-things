import { describe, expect, it } from 'vitest';
import { parseMath, type MathNode } from '../../film/math';
import chapterSource from './Chapter.tsx?raw';
import { buildFilm } from './film';

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

const g = (b: number) => 1 / Math.sqrt(1 - b * b);
const c = 3e8;

describe('relativity chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(100);
    all.forEach(parsesFully);
  });

  it('writes every equation in the film so it parses completely', () => {
    const shots = buildFilm().spec.shots;
    let n = 0;
    for (const s of shots) {
      const steps = typeof s.eq === 'string' ? [s.eq] : (s.eq ?? []).map((e) => e.src);
      for (const src of steps) {
        parsesFully(src);
        n++;
      }
    }
    expect(n).toBeGreaterThan(8);
  });

  it('works out the gamma table', () => {
    expect(g(0.1)).toBeCloseTo(1.005, 3);
    expect(g(0.5)).toBeCloseTo(1.155, 3);
    expect(g(0.6)).toBeCloseTo(1.25, 5);
    expect(g(0.8)).toBeCloseTo(1.667, 3);
    expect(g(0.9)).toBeCloseTo(2.294, 3);
    expect(g(0.99)).toBeCloseTo(7.089, 3);
    expect(g(0.999)).toBeCloseTo(22.37, 2);
    expect((1 - 1 / g(0.5)) * 100).toBeCloseTo(13.4, 0);
    expect(300 / c).toBeCloseTo(1e-6, 12);
    expect((1e-6) ** 2 / 2).toBeCloseTo(5e-13, 15);
  });

  it('works out the trip at 0.8 c', () => {
    expect(Math.sqrt(1 - 0.64)).toBeCloseTo(0.6, 10);
    expect(10 / g(0.8)).toBeCloseTo(6, 10);
    expect(8 / g(0.8)).toBeCloseTo(4.8, 10);
    expect(4.8 / 0.8).toBeCloseTo(6, 10);
    expect(8 / 0.8).toBe(10);
  });

  it('works out the muon', () => {
    expect(0.98 * c * 2.2e-6).toBeCloseTo(647, 0);
    expect(Math.sqrt(1 - 0.98 ** 2)).toBeCloseTo(0.199, 3);
    expect(g(0.98)).toBeCloseTo(5.03, 2);
    expect(0.98 * c * 2.2e-6 * g(0.98)).toBeCloseTo(3250, -1);
    expect(3250 / 5.03).toBeCloseTo(646, 0);
    expect(g(0.98) * 2.2).toBeCloseTo(11.06, 2);
  });

  it('works out the train', () => {
    const v = 0.5 * c;
    const back = 100 / (2 * (c + v));
    const front = 100 / (2 * (c - v));
    expect(back / 1e-7).toBeCloseTo(1.11, 2);
    expect(front / 1e-7).toBeCloseTo(3.33, 2);
    expect((front - back) / 1e-7).toBeCloseTo(2.22, 2);
    expect((100 * v) / (c * c - v * v) / 1e-7).toBeCloseTo(2.22, 2);
    // The figure uses c = 100, v = 40 and half-length 100.
    expect(100 / 140).toBeCloseTo(0.714, 3);
    expect(100 / 60).toBeCloseTo(1.667, 3);
  });

  it('works out the velocity addition', () => {
    expect((0.6 + 0.6) / (1 + 0.36)).toBeCloseTo(0.882, 3);
    expect((0.8 + 0.8) / (1 + 0.64)).toBeCloseTo(0.976, 3);
    expect((1 + 0.7) / (1 + 0.7)).toBe(1);
  });

  it('works out the energies', () => {
    const me = 9.11e-31 * 2.998e8 ** 2;
    expect(me / 1e-14).toBeCloseTo(8.19, 2);
    expect(me / 1.602e-13).toBeCloseTo(0.511, 3);
    expect(3.8e26 / 9e16 / 1e9).toBeCloseTo(4.2, 1);
    const gm = 1.511 / 0.511;
    expect(gm).toBeCloseTo(2.957, 3);
    expect(gm * gm).toBeCloseTo(8.74, 2);
    expect(Math.sqrt(1 - 1 / (gm * gm))).toBeCloseTo(0.941, 3);
    expect(1.511 ** 2).toBeCloseTo(2.283, 3);
    expect(0.511 ** 2).toBeCloseTo(0.261, 3);
    expect(Math.sqrt(1.511 ** 2 - 0.511 ** 2)).toBeCloseTo(1.42, 2);
    expect(Math.sqrt((2 * 1) / 0.511)).toBeCloseTo(1.98, 2);
    expect(0.5 * 0.81).toBeCloseTo(0.405, 3);
    expect(g(0.9) - 1).toBeCloseTo(1.29, 2);
  });
});
