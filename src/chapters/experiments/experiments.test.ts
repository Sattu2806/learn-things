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

describe('experiments chapter', () => {
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
    expect(shots.length).toBe(6);
  });

  it('works out the mean and errors of the readings', () => {
    const a = [2.63, 2.56, 2.42, 2.71, 2.8];
    const sum = a.reduce((x, y) => x + y, 0);
    expect(sum).toBeCloseTo(13.12, 10);
    const mean = Number((sum / 5).toFixed(2));
    expect(mean).toBe(2.62);
    const d = a.map((v) => Math.abs(v - mean));
    [0.01, 0.06, 0.2, 0.09, 0.18].forEach((v, i) => expect(d[i]).toBeCloseTo(v, 10));
    const tot = d.reduce((x, y) => x + y, 0);
    expect(tot).toBeCloseTo(0.54, 10);
    expect(tot / 5).toBeCloseTo(0.108, 10);
    expect(0.11 / 2.62).toBeCloseTo(0.042, 3);
  });

  it('combines errors', () => {
    expect(10.5 + 15.2).toBeCloseTo(25.7, 10);
    expect(0.1 + 0.2).toBeCloseTo(0.3, 10);
    expect(52.5 - 31.0).toBeCloseTo(21.5, 10);
    expect(0.4 + 0.5).toBeCloseTo(0.9, 10);
    expect(54.0 / 3.0 ** 3).toBeCloseTo(2.0, 10);
    const rel = 0.5 / 54 + (3 * 0.02) / 3;
    expect(0.5 / 54).toBeCloseTo(0.0093, 4);
    expect(rel).toBeCloseTo(0.0293, 4);
    expect(rel * 2).toBeCloseTo(0.0585, 3);
    // (a + da)(b + db) = ab + a db + b da + da db
    const a = 5, b = 2, da = 0.1, db = 0.05;
    expect((a + da) * (b + db)).toBeCloseTo(a * b + a * db + b * da + da * db, 12);
    expect((a * db + b * da) / (a * b)).toBeCloseTo(da / a + db / b, 12);
  });

  it('works out the vernier and screw gauge', () => {
    expect(1 - (9 / 10) * 1).toBeCloseTo(0.1, 10);
    expect(23 + 7 * 0.1).toBeCloseTo(23.7, 10);
    expect(23.7 - 3 * 0.1).toBeCloseTo(23.4, 10);
    expect(-(10 - 9) * 0.1).toBeCloseTo(-0.1, 10);
    expect(5.4 - -0.1).toBeCloseTo(5.5, 10);
    expect(0.5 / 50).toBeCloseTo(0.01, 10);
    expect(2.5 + 36 * 0.01).toBeCloseTo(2.86, 10);
    expect(2.86 - 0.02).toBeCloseTo(2.84, 10);
    expect(-(50 - 46) * 0.01).toBeCloseTo(-0.04, 10);
    expect(2.86 + 0.04).toBeCloseTo(2.9, 10);
  });

  it('works out g from the pendulum', () => {
    const T = 40.2 / 20;
    expect(T).toBeCloseTo(2.01, 10);
    expect(0.2 / 20).toBeCloseTo(0.01, 10);
    const g = (4 * Math.PI ** 2 * 1.0) / T ** 2;
    expect(4 * Math.PI ** 2).toBeCloseTo(39.48, 2);
    expect(T ** 2).toBeCloseTo(4.04, 2);
    expect(g).toBeCloseTo(9.77, 2);
    const rel = 0.002 / 1.0 + (2 * 0.01) / 2.01;
    expect(rel).toBeCloseTo(0.012, 3);
    expect(rel * 9.77).toBeCloseTo(0.12, 2);
    // reaction error is 10 % of one 2 s swing and 0.5 % of 20
    expect((0.2 / 2) * 100).toBeCloseTo(10, 10);
    expect((0.2 / 40) * 100).toBeCloseTo(0.5, 10);
  });

  it('finds the slope and g from the graph data', () => {
    const L = [0.4, 0.6, 0.8, 1.0, 1.2];
    const y = [1.7, 2.2, 3.35, 3.9, 4.85];
    const mx = L.reduce((a, b) => a + b, 0) / 5;
    const my = y.reduce((a, b) => a + b, 0) / 5;
    const sxy = L.reduce((a, v, i) => a + (v - mx) * (y[i] - my), 0);
    const sxx = L.reduce((a, v) => a + (v - mx) ** 2, 0);
    expect(sxy / sxx).toBeCloseTo(4.0, 10);
    expect(my - (sxy / sxx) * mx).toBeCloseTo(0, 10);
    expect((4.8 - 0.8) / (1.2 - 0.2)).toBeCloseTo(4, 10);
    expect((4 * Math.PI ** 2) / 4).toBeCloseTo(9.87, 2);
  });
});
