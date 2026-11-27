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

const u = 931.5;

describe('nuclei chapter', () => {
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
    expect(n).toBeGreaterThan(5);
  });

  it('works out size and density', () => {
    expect(27 ** (1 / 3)).toBeCloseTo(3, 10);
    const R = 1.2 * 3;
    expect(R).toBeCloseTo(3.6, 5);
    const m = 27 * 1.66e-27;
    expect(m).toBeCloseTo(4.48e-26, 28);
    const V = (4 / 3) * Math.PI * (3.6e-15) ** 3;
    expect(V / 1e-43).toBeCloseTo(1.95, 2);
    expect(m / V / 1e17).toBeCloseTo(2.3, 1);
  });

  it('works out binding energies', () => {
    const dHe = 2 * 1.007825 + 2 * 1.008665 - 4.002603;
    expect(2 * 1.007825 + 2 * 1.008665).toBeCloseTo(4.03298, 5);
    expect(dHe).toBeCloseTo(0.030377, 6);
    expect(dHe * u).toBeCloseTo(28.3, 1);
    expect((dHe * u) / 4).toBeCloseTo(7.07, 2);
    const dFe = 26 * 1.007825 + 30 * 1.008665 - 55.934936;
    expect(26 * 1.007825 + 30 * 1.008665).toBeCloseTo(56.4634, 4);
    expect(dFe).toBeCloseTo(0.528464, 6);
    expect(dFe * u).toBeCloseTo(492.3, 1);
    expect((dFe * u) / 56).toBeCloseTo(8.79, 2);
    expect(235 * (8.5 - 7.6)).toBeCloseTo(211.5, 1);
  });

  it('works out the alpha decay', () => {
    const d = 238.050788 - (234.043601 + 4.002603);
    expect(d).toBeCloseTo(0.004584, 6);
    const Q = d * u;
    expect(Q).toBeCloseTo(4.27, 2);
    expect((Q * 234) / 238).toBeCloseTo(4.2, 2);
    expect(Q - (Q * 234) / 238).toBeCloseTo(0.07, 2);
  });

  it('works out half-life examples', () => {
    expect(80 * 0.5 ** (24 / 8)).toBe(10);
    const lam = Math.LN2 / 8;
    expect(lam).toBeCloseTo(0.0866, 4);
    expect(80 * Math.exp(-lam * 24)).toBeCloseTo(10, 5);
    expect(Math.log(80) / Math.LN2).toBeCloseTo(6.32, 2);
    expect((Math.log(80) / Math.LN2) * 8).toBeCloseTo(50.6, 1);
    expect(1 / Math.LN2).toBeCloseTo(1.44, 2);
  });

  it('works out the cobalt activity', () => {
    const N = (1 / 60) * 6.02e23;
    expect(N / 1e22).toBeCloseTo(1.0, 2);
    const T = 5.27 * 3.156e7;
    expect(T / 1e8).toBeCloseTo(1.66, 2);
    const lam = 0.693 / 1.66e8;
    expect(lam / 1e-9).toBeCloseTo(4.17, 2);
    const R = lam * N;
    expect(R / 1e13).toBeCloseTo(4.17, 1);
    expect(4.17e13 / 3.7e10).toBeCloseTo(1127, -1);
    expect(4.17e13 / 4 / 1e13).toBeCloseTo(1.04, 2);
  });

  it('works out the energy examples', () => {
    const N = (1000 / 235) * 6.02e23;
    expect(N / 1e24).toBeCloseTo(2.56, 2);
    const E1 = 200 * 1.6e-13;
    expect(E1).toBeCloseTo(3.2e-11, 13);
    expect((2.56e24 * E1) / 1e13).toBeCloseTo(8.2, 1);
    expect(8.2e13 / 3e7 / 1e6).toBeCloseTo(2.7, 1);
    const dDT = 2.014102 + 3.016049 - (4.002603 + 1.008665);
    expect(dDT).toBeCloseTo(0.018883, 6);
    expect(dDT * u).toBeCloseTo(17.6, 1);
    expect(17.6 * 0.8).toBeCloseTo(14.1, 1);
    expect(17.6 * 0.2).toBeCloseTo(3.5, 1);
    expect((17.6 * 1.6e-13) / (5 * 1.66e-27) / 1e14).toBeCloseTo(3.4, 1);
    expect(1.66e-27 * (2.998e8) ** 2 / 1.602e-13).toBeCloseTo(931.5, 0);
  });

  it('works out the carbon dating', () => {
    const n = Math.log(1 / 0.3) / Math.LN2;
    expect(n).toBeCloseTo(1.737, 3);
    expect(Math.log(1 / 0.3)).toBeCloseTo(1.204, 3);
    expect(n * 5730).toBeCloseTo(9950, -1);
  });
});
