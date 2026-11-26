/**
 * Typesetting and morphing equations on a canvas.
 *
 * Equations are written in a tiny plain-text format, one token per word:
 *
 *   "y = v · sin θ · t − ½ · g · t ^2"
 *
 *   ^x        superscript on the previous token
 *   _x        subscript on the previous token (v _x is v with a little x)
 *   [ a | b ] a fraction, a over b
 *   √[ a ]    a square root
 *   "m/s"     plain upright text, such as a unit
 *   tok#key   names a token, so a morph can move it to where the same key
 *             sits in the next equation (otherwise keys are text plus count)
 *
 * A morph glides every token whose key appears in both equations to its new
 * place, and fades the others out or in, like Manim's TransformMatchingTex.
 * The same notation is set as HTML on the theory page (ui/Math.tsx).
 */

export const SERIF = '"Instrument Serif", "Iowan Old Style", Georgia, serif';

export type MathKind = 'var' | 'num' | 'fn' | 'op' | 'word' | 'text' | 'punct';

export interface Glyph {
  key: string;
  text: string;
  kind: MathKind;
  /** Left edge and baseline, relative to the equation's left end and main baseline. */
  x: number;
  y: number;
  size: number;
  w: number;
}

export interface Bar {
  key: string;
  x1: number;
  x2: number;
  y: number;
  size: number;
}

export interface MathLayout {
  glyphs: Glyph[];
  bars: Bar[];
  width: number;
  top: number;
  bottom: number;
}

export interface Script {
  text: string;
  key?: string;
}

export interface MathTok {
  text: string;
  key?: string;
  kind?: MathKind;
  sup?: Script;
  sub?: Script;
}

export type MathNode =
  | { t: 'tok'; tok: MathTok }
  | { t: 'frac'; num: MathNode[]; den: MathNode[]; key: string }
  | { t: 'sqrt'; body: MathNode[]; key: string };

function splitKey(p: string): [string, string | undefined] {
  const h = p.lastIndexOf('#');
  return h > 0 ? [p.slice(0, h), p.slice(h + 1)] : [p, undefined];
}

export function parseMath(src: string): MathNode[] {
  // Quoted text may contain spaces ("at the top"), so join it back into one token.
  const parts: string[] = [];
  const raw = src.trim().split(/\s+/).filter(Boolean);
  for (let j = 0; j < raw.length; j++) {
    let p = raw[j];
    if (p.startsWith('"')) while ((p.length < 2 || !p.endsWith('"')) && j + 1 < raw.length) p += ` ${raw[++j]}`;
    parts.push(p);
  }
  let i = 0;
  let fracs = 0;
  let roots = 0;
  const row = (): MathNode[] => {
    const out: MathNode[] = [];
    while (i < parts.length) {
      const p = parts[i];
      if (p === '|' || p === ']') break;
      i++;
      if (p.startsWith('[')) {
        const key = splitKey(p)[1] ?? `frac${++fracs}`;
        const num = row();
        if (parts[i] === '|') i++;
        const den = row();
        if (parts[i] === ']') i++;
        out.push({ t: 'frac', num, den, key });
      } else if (p.startsWith('√[')) {
        const key = splitKey(p)[1] ?? `sqrt${++roots}`;
        const body = row();
        if (parts[i] === ']') i++;
        out.push({ t: 'sqrt', body, key });
      } else if ((p.startsWith('^') || p.startsWith('_')) && p.length > 1) {
        const prev = out[out.length - 1];
        const [text, key] = splitKey(p.slice(1));
        if (prev?.t === 'tok') prev.tok[p[0] === '^' ? 'sup' : 'sub'] = { text, key };
      } else if (p.length > 1 && p.startsWith('"') && p.endsWith('"')) {
        out.push({ t: 'tok', tok: { text: p.slice(1, -1), kind: 'text' } });
      } else {
        const [text, key] = splitKey(p);
        out.push({ t: 'tok', tok: { text, key } });
      }
    }
    return out;
  };
  return row();
}

export function mathKind(text: string): MathKind {
  if (text === 'sin' || text === 'cos' || text === 'tan') return 'fn';
  if (/^[=+−·×≈<>/±→-]$/.test(text)) return 'op';
  if (/^[(),]$/.test(text)) return 'punct';
  if (/^[0-9.]+°?$|^½$/.test(text)) return 'num';
  if (/^[a-zA-Zα-ωθ]$/.test(text)) return 'var';
  return 'word';
}

export function mathFont(kind: MathKind, size: number) {
  return `${kind === 'var' || kind === 'word' ? 'italic ' : ''}400 ${size}px ${SERIF}`;
}

function space(text: string, kind: MathKind): [number, number] {
  if (kind === 'op') {
    if (text === '·') return [0.07, 0.07];
    if (text === '=' || text === '≈') return [0.3, 0.3];
    return [0.24, 0.24];
  }
  if (kind === 'fn') return [0.02, 0.14];
  if (kind === 'word') return [0.12, 0.12];
  if (kind === 'text') return [0.2, 0.06];
  return [0.015, 0.015];
}

const cache = new Map<string, MathLayout>();

/** Forget cached layouts (call when web fonts finish loading). */
export function resetMathCache() {
  cache.clear();
}

export function layoutMath(ctx: CanvasRenderingContext2D, src: string, size: number): MathLayout {
  const id = `${size}|${src}`;
  const hit = cache.get(id);
  if (hit) return hit;
  const counts = new Map<string, number>();
  const autoKey = (text: string, explicit?: string) => {
    if (explicit) return explicit;
    const n = (counts.get(text) ?? 0) + 1;
    counts.set(text, n);
    return `${text}${n}`;
  };
  const glyphs: Glyph[] = [];
  const bars: Bar[] = [];
  type Out = { glyphs: Glyph[]; bars: Bar[] };
  const shift = (from: Out, to: Out, dx: number, dy: number) => {
    for (const g of from.glyphs) to.glyphs.push({ ...g, x: g.x + dx, y: g.y + dy });
    for (const b of from.bars) to.bars.push({ ...b, x1: b.x1 + dx, x2: b.x2 + dx, y: b.y + dy });
  };

  const rowLayout = (nodes: MathNode[], s: number, out: Out) => {
    let x = 0;
    let top = -s * 0.72;
    let bottom = s * 0.22;
    for (const n of nodes) {
      if (n.t === 'tok') {
        const kind = n.tok.kind ?? mathKind(n.tok.text);
        const [pre, post] = space(n.tok.text, kind);
        x += pre * s;
        ctx.font = mathFont(kind, s);
        const w = ctx.measureText(n.tok.text).width;
        out.glyphs.push({ key: autoKey(n.tok.text, n.tok.key), text: n.tok.text, kind, x, y: 0, size: s, w });
        x += w;
        if (n.tok.sup || n.tok.sub) {
          // Scripts sit side by side over and under the same spot, like v with x below and 2 above.
          const ss = s * 0.6;
          x += s * 0.03;
          let sw = 0;
          for (const [script, mark, y] of [
            [n.tok.sup, '^', -s * 0.4],
            [n.tok.sub, '_', s * 0.2],
          ] as const) {
            if (!script) continue;
            const sk = mathKind(script.text);
            ctx.font = mathFont(sk, ss);
            const w2 = ctx.measureText(script.text).width;
            out.glyphs.push({ key: autoKey(`${mark}${script.text}`, script.key), text: script.text, kind: sk, x, y, size: ss, w: w2 });
            sw = Math.max(sw, w2);
            if (mark === '^') top = Math.min(top, y - ss * 0.72);
            else bottom = Math.max(bottom, y + ss * 0.22);
          }
          x += sw + s * 0.02;
        }
        x += post * s;
      } else if (n.t === 'frac') {
        const fs = s * 0.86;
        const pad = s * 0.14;
        const num: Out = { glyphs: [], bars: [] };
        const den: Out = { glyphs: [], bars: [] };
        const nm = rowLayout(n.num, fs, num);
        const dm = rowLayout(n.den, fs, den);
        const w = Math.max(nm.width, dm.width) + pad * 2;
        const axis = -s * 0.27;
        const numBase = axis - s * 0.16 - nm.bottom;
        const denBase = axis + s * 0.14 - dm.top;
        shift(num, out, x + (w - nm.width) / 2, numBase);
        shift(den, out, x + (w - dm.width) / 2, denBase);
        out.bars.push({ key: n.key, x1: x + s * 0.04, x2: x + w - s * 0.04, y: axis, size: s });
        x += w + s * 0.06;
        top = Math.min(top, numBase + nm.top);
        bottom = Math.max(bottom, denBase + dm.bottom);
      } else {
        // A radical sign, then the body under a bar that starts at the sign's top.
        x += s * 0.04;
        ctx.font = mathFont('op', s);
        const rw = ctx.measureText('√').width;
        out.glyphs.push({ key: autoKey('√', `${n.key}-sign`), text: '√', kind: 'op', x, y: 0, size: s, w: rw });
        const body: Out = { glyphs: [], bars: [] };
        const bm = rowLayout(n.body, s, body);
        shift(body, out, x + rw + s * 0.04, 0);
        const barY = bm.top - s * 0.08;
        out.bars.push({ key: n.key, x1: x + rw * 0.82, x2: x + rw + s * 0.08 + bm.width, y: barY, size: s });
        x += rw + s * 0.12 + bm.width;
        top = Math.min(top, barY - s * 0.05);
        bottom = Math.max(bottom, bm.bottom);
      }
    }
    return { width: x, top, bottom };
  };

  const m = rowLayout(parseMath(src), size, { glyphs, bars });
  const layout = { glyphs, bars, width: m.width, top: m.top, bottom: m.bottom };
  cache.set(id, layout);
  return layout;
}

export interface MathStyle {
  alpha: number;
  /** Highlight strength per token key, 0 to 1. */
  highlight?: (key: string) => number;
}

const smooth = (t: number) => t * t * t * (t * (6 * t - 15) + 10);

function drawGlyph(ctx: CanvasRenderingContext2D, g: Glyph, x: number, y: number, size: number, alpha: number, hl: number) {
  if (alpha <= 0.002) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, alpha);
  ctx.font = mathFont(g.kind, size);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  if (hl > 0.01) {
    const cx = x + (g.w * size) / g.size / 2;
    const cy = y - size * 0.3;
    const k = 1 + 0.22 * hl;
    ctx.translate(cx, cy);
    ctx.scale(k, k);
    ctx.translate(-cx, -cy);
    ctx.shadowColor = `rgba(255,255,255,${0.9 * hl})`;
    ctx.shadowBlur = 22 * hl;
  }
  ctx.fillStyle = '#ffffff';
  ctx.fillText(g.text, x, y);
  ctx.restore();
}

/**
 * Draws `to`, morphing from `from` with progress p (0 to 1). The equation is
 * centred on cx, with its main baseline at y.
 */
export function drawMath(ctx: CanvasRenderingContext2D, from: MathLayout | null, to: MathLayout, p: number, cx: number, y: number, style: MathStyle) {
  const e = smooth(Math.min(1, Math.max(0, p)));
  const hl = style.highlight ?? (() => 0);
  const bx = cx - to.width / 2;
  const ax = from ? cx - from.width / 2 : bx;
  const old = new Map((from?.glyphs ?? []).map((g) => [g.key, g]));
  const fresh = new Set(to.glyphs.map((g) => g.key));
  // Most tokens drift together; one that moves against the flow (an "=" crossing
  // to the other side, a 2 moving in) takes an arc over or under the rest,
  // like Manim's path_arc, instead of sliding through them.
  const shifts: number[] = [];
  if (from && e < 1) {
    for (const g of to.glyphs) {
      const a = old.get(g.key);
      if (a) shifts.push(bx + g.x - ax - a.x);
    }
    shifts.sort((p, q) => p - q);
  }
  const flow = shifts.length ? shifts[Math.floor(shifts.length / 2)] : 0;
  if (from && e < 1) {
    for (const g of from.glyphs) {
      if (!fresh.has(g.key)) drawGlyph(ctx, g, ax + g.x, y + g.y - e * g.size * 0.15, g.size, style.alpha * (1 - e) ** 1.5, 0);
    }
  }
  for (const g of to.glyphs) {
    const a = from && e < 1 ? old.get(g.key) : undefined;
    if (a) {
      const dx = bx + g.x - ax - a.x;
      const rel = dx - flow;
      const arc = Math.abs(rel) > g.size * 1.2 ? Math.sign(rel) * Math.min(g.size * 0.85, Math.abs(rel) * 0.2) * Math.sin(Math.PI * e) : 0;
      drawGlyph(ctx, g, ax + a.x + dx * e, y + a.y + (g.y - a.y) * e - arc, a.size + (g.size - a.size) * e, style.alpha, hl(g.key));
    } else {
      const k = from ? e : 1;
      drawGlyph(ctx, g, bx + g.x, y + g.y + (1 - k) * g.size * 0.18, g.size, style.alpha * k, hl(g.key));
    }
  }
  const oldBars = new Map((from?.bars ?? []).map((b) => [b.key, b]));
  const newBars = new Set(to.bars.map((b) => b.key));
  ctx.save();
  ctx.fillStyle = '#ffffff';
  for (const b of to.bars) {
    const a = from && e < 1 ? oldBars.get(b.key) : undefined;
    const x1 = a ? ax + a.x1 + (bx + b.x1 - ax - a.x1) * e : bx + b.x1;
    const x2 = a ? ax + a.x2 + (bx + b.x2 - ax - a.x2) * e : bx + b.x2;
    const yy = a ? y + a.y + (b.y - a.y) * e : y + b.y;
    ctx.globalAlpha = style.alpha * (a || !from ? 1 : e);
    ctx.fillRect(x1, yy - b.size * 0.022, x2 - x1, b.size * 0.044);
  }
  if (from && e < 1) {
    for (const b of from.bars) {
      if (newBars.has(b.key)) continue;
      ctx.globalAlpha = style.alpha * (1 - e);
      ctx.fillRect(ax + b.x1, y + b.y - b.size * 0.022, b.x2 - b.x1, b.size * 0.044);
    }
  }
  ctx.restore();
}

/** Screen box of the tokens from key `a` to key `b`, for an equation drawn at (cx, y). */
export function span(layout: MathLayout, a: string, b: string, cx: number, y: number) {
  const i = layout.glyphs.findIndex((g) => g.key === a);
  const j = layout.glyphs.findIndex((g) => g.key === b);
  if (i < 0 || j < 0) return null;
  const left = cx - layout.width / 2;
  const gs = layout.glyphs.slice(Math.min(i, j), Math.max(i, j) + 1);
  const x1 = Math.min(...gs.map((g) => g.x)) + left;
  const x2 = Math.max(...gs.map((g) => g.x + g.w)) + left;
  const top = Math.min(...gs.map((g) => g.y - g.size * 0.75)) + y;
  const bottom = Math.max(...gs.map((g) => g.y + g.size * 0.22)) + y;
  return { x1, x2, top, bottom, cx: (x1 + x2) / 2 };
}

/** A curly underbrace from x1 to x2, hanging below y, with a label. */
export function drawBrace(ctx: CanvasRenderingContext2D, x1: number, x2: number, y: number, label: string, alpha: number, size = 36) {
  if (alpha <= 0.01 || x2 - x1 < 10) return;
  const d = Math.min(12, (x2 - x1) / 4);
  const m = (x1 + x2) / 2;
  const drawn = Math.min(1, alpha * 1.4);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const l = m - (m - x1) * drawn;
  const r = m + (x2 - m) * drawn;
  ctx.moveTo(l, y);
  ctx.quadraticCurveTo(l, y + d, l + d, y + d);
  ctx.lineTo(m - d, y + d);
  ctx.quadraticCurveTo(m, y + d, m, y + d * 2);
  ctx.quadraticCurveTo(m, y + d, m + d, y + d);
  ctx.lineTo(r - d, y + d);
  ctx.quadraticCurveTo(r, y + d, r, y);
  ctx.stroke();
  ctx.font = `italic 400 ${size}px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(label, m, y + d * 2 + 8);
  ctx.restore();
}
