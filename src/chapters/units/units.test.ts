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
  for (const m of src.matchAll(/\['[^']+', '([^']+)', '[^']+', '([^']+)'\]/g)) out.push(m[1], m[2]);
  for (const m of src.matchAll(/wrong=(?:"([^"]+)"|\{'([^']+)'\})/g)) out.push(m[1] ?? m[2]);
  return out;
}

/** The slips that parse "successfully" but lose symbols: glued brackets, stray bars, unbalanced brackets. */
function wellFormed(src: string) {
  const toks = src.replace(/"[^"]*"/g, 'TEXT').split(/\s+/).filter(Boolean);
  for (const t of toks) {
    if (t !== '[' && t.startsWith('[')) throw new Error(`bracket glued to "${t}" in: ${src}`);
    if (t !== ']' && t.endsWith(']')) throw new Error(`bracket glued to "${t}" in: ${src}`);
    if (t !== '√[' && t.startsWith('√[')) throw new Error(`root bracket glued to "${t}" in: ${src}`);
    if (t !== '|' && t.includes('|')) throw new Error(`bar glued to "${t}" in: ${src}`);
  }
  const opens = toks.filter((t) => t === '[' || t === '√[').length;
  expect(toks.filter((t) => t === ']').length, `brackets in: ${src}`).toBe(opens);
  expect(toks.filter((t) => t === '|').length, `bars in: ${src}`).toBe(toks.filter((t) => t === '[').length);
  expect(src.includes('"') ? (src.match(/"/g) ?? []).length % 2 : 0, `quotes in: ${src}`).toBe(0);
  for (const m of src.matchAll(/"[,.;:)]/g)) throw new Error(`punctuation after a closing quote in: ${src} (${m[0]})`);
}

function parsesFully(src: string) {
  wellFormed(src);
  const words = src
    .replace(/"[^"]*"/g, 'TEXT')
    .split(/\s+/)
    .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
  expect(count(parseMath(src)), src).toBe(words.length);
}

describe('units chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(80);
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
    expect(shots.length).toBe(6);
  });

  it('converts units', () => {
    expect(72 * (1000 / 3600)).toBeCloseTo(20, 10);
    expect(72 / 3.6).toBeCloseTo(20, 10);
    expect(7.8 * (1e-3 / 1e-6)).toBeCloseTo(7800, 6);
    expect((1e-2) ** 2).toBeCloseTo(1e-4, 12);
    expect((1e3) ** 2).toBeCloseTo(1e6, 3);
  });

  it('solves the dimensional equations', () => {
    // pendulum T = k L^a m^b g^c: b = 0, a + c = 0, -2c = 1
    const c = -1 / 2;
    expect(-2 * c).toBe(1);
    expect(-c + c).toBe(0);
    // wave on a rope v = k F^a mu^b: M: a+b=0, L: a-b=1, T: -2a=-1
    const a = 1 / 2;
    const b = -a;
    expect(a + b).toBe(0);
    expect(a - b).toBe(1);
    expect(-2 * a).toBe(-1);
    expect(Math.sqrt(100 / 0.25)).toBe(20);
  });

  it('rounds the significant-figure examples', () => {
    expect(4.56 * 1.4).toBeCloseTo(6.384, 10);
    expect(Number((4.56 * 1.4).toPrecision(2))).toBe(6.4);
    expect(12.11 + 18.0 + 1.013).toBeCloseTo(31.123, 10);
    expect(Number((12.11 + 18.0 + 1.013).toFixed(1))).toBe(31.1);
  });

  it('estimates the heartbeats', () => {
    expect(80 * 365 * 24 * 60).toBe(42048000);
    expect(70 * 80 * 365 * 24 * 60).toBe(2943360000);
    expect(70 * 60 * 24 * 365 * 80).toBe(2943360000);
    expect(2.9433).toBeLessThan(Math.sqrt(10));
    // running totals shown in the figure
    expect(70 * 60).toBe(4200);
    expect(70 * 60 * 24).toBe(100800);
    expect(70 * 60 * 24 * 365).toBe(36792000);
  });
});
