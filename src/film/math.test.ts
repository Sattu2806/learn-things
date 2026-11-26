import { describe, expect, it } from 'vitest';
import { drawMath, layoutMath, mathKind, parseMath, span } from './math';

// A stand-in canvas: every character is half the font size wide.
const ctx = {
  font: '16px serif',
  measureText(this: { font: string }, text: string) {
    const size = Number(/(\d+(\.\d+)?)px/.exec(this.font)?.[1] ?? 16);
    return { width: text.length * size * 0.5 } as TextMetrics;
  },
} as unknown as CanvasRenderingContext2D;

describe('maths layout', () => {
  it('keys tokens by name or by text and count', () => {
    const l = layoutMath(ctx, 'y = v · t#a + t', 40);
    expect(l.glyphs.map((g) => g.key)).toEqual(['y1', '=1', 'v1', '·1', 'a', '+1', 't1']);
  });

  it('raises superscripts and stacks fractions', () => {
    const l = layoutMath(ctx, 't ^2#sq = [#fr 2 · v | g ]', 40);
    const sq = l.glyphs.find((g) => g.key === 'sq')!;
    expect(sq.y).toBeLessThan(0);
    expect(sq.size).toBeLessThan(40);
    expect(l.bars).toHaveLength(1);
    const two = l.glyphs.find((g) => g.text === '2' && g.key !== 'sq')!;
    const g = l.glyphs.find((x) => x.text === 'g')!;
    expect(two.y).toBeLessThan(l.bars[0].y);
    expect(g.y).toBeGreaterThan(l.bars[0].y);
  });

  it('measures the screen box of a run of tokens', () => {
    const l = layoutMath(ctx, 'a#a b#b c#c', 40);
    const s = span(l, 'a', 'b', 500, 100)!;
    expect(s.x1).toBeCloseTo(500 - l.width / 2 + l.glyphs[0].x, 9);
    expect(s.x2).toBeGreaterThan(s.x1);
    expect(span(l, 'a', 'missing', 0, 0)).toBeNull();
  });

  it('arcs a token that crosses the others in a morph', () => {
    const drawn: { text: string; y: number }[] = [];
    const rec = {
      font: '16px serif',
      globalAlpha: 1,
      measureText: ctx.measureText,
      fillText: (text: string, _x: number, y: number) => drawn.push({ text, y }),
      fillRect() {},
      save() {},
      restore() {},
      translate() {},
      scale() {},
    } as unknown as CanvasRenderingContext2D;
    const from = layoutMath(rec, 'y#y =#eq a#a + b#b', 40);
    const to = layoutMath(rec, 'a#a + b#b =#eq y#y', 40);
    drawMath(rec, from, to, 0.5, 500, 100, { alpha: 1 });
    const at = (text: string) => drawn.find((d) => d.text === text)!.y;
    expect(at('=')).toBeLessThan(100 - 10);
    expect(at('a')).toBeCloseTo(100, 6);
    drawn.length = 0;
    drawMath(rec, from, to, 1, 500, 100, { alpha: 1 });
    expect(at('=')).toBeCloseTo(100, 6);
  });

  it('reads subscripts, roots and plain text', () => {
    const [v] = parseMath('v _x ^2');
    expect(v).toEqual({ t: 'tok', tok: { text: 'v', key: undefined, sub: { text: 'x', key: undefined }, sup: { text: '2', key: undefined } } });
    const [root] = parseMath('√[ [ 2 · h | g ] ]');
    expect(root.t).toBe('sqrt');
    if (root.t === 'sqrt') expect(root.body[0].t).toBe('frac');
    const [, , unit] = parseMath('t = "s"');
    expect(unit).toEqual({ t: 'tok', tok: { text: 's', kind: 'text' } });
    expect(mathKind('40°')).toBe('num');
    expect(mathKind('/')).toBe('op');
  });

  it('lays a root under a bar that spans its body', () => {
    const l = layoutMath(ctx, 'x = √[ 2 · h ]', 40);
    const sign = l.glyphs.find((g) => g.text === '√')!;
    const h = l.glyphs.find((g) => g.text === 'h')!;
    expect(l.bars).toHaveLength(1);
    expect(h.x).toBeGreaterThan(sign.x);
    expect(l.bars[0].x2).toBeGreaterThanOrEqual(h.x + h.w);
    expect(l.bars[0].y).toBeLessThan(0);
  });
});
