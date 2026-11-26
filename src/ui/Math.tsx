import type { CSSProperties, ReactNode } from 'react';
import { mathKind, parseMath, type MathKind, type MathNode, type Script } from '../film/math';

/**
 * Maths in the page, written in the film's notation (see film/math.ts) and
 * set as HTML text in the same serif, so it stays sharp, selectable and
 * prints well.
 */

function cls(kind: MathKind, text: string) {
  if (kind === 'op') {
    if (text === '=' || text === '≈' || text === '→') return 'm-op m-rel';
    if (text === '·') return 'm-op m-dot';
    return 'm-op m-bin';
  }
  return `m-${kind}`;
}

/** Counts glyphs in writing order, so an equation can appear symbol by symbol. */
interface Pen {
  i: number;
}

function glyph(kind: MathKind, text: string, pen: Pen) {
  return (
    <span className={`${cls(kind, text)} m-g`} style={{ '--i': pen.i++ } as CSSProperties}>
      {text}
    </span>
  );
}

function script(s: Script, place: 'sup' | 'sub', pen: Pen) {
  return <span className={`m-${place}`}>{glyph(mathKind(s.text), s.text, pen)}</span>;
}

function render(nodes: MathNode[], pen: Pen = { i: 0 }): ReactNode[] {
  return nodes.map((n, i) => {
    if (n.t === 'frac') {
      return (
        <span key={i} className="m-frac">
          <span className="m-frac-top">{render(n.num, pen)}</span>
          <span className="m-frac-bottom">{render(n.den, pen)}</span>
        </span>
      );
    }
    if (n.t === 'sqrt') {
      return (
        <span key={i} className="m-sqrt">
          <svg className="m-radix" viewBox="0 0 10 24" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0.5 14.5L3 13L5.5 23L10 0.6" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="m-radicand">{render(n.body, pen)}</span>
        </span>
      );
    }
    const { text, sup, sub } = n.tok;
    const kind = n.tok.kind ?? mathKind(text);
    const base = glyph(kind, text, pen);
    if (!sup && !sub) return <span key={i}>{base}</span>;
    return (
      <span key={i} className={kind === 'fn' ? 'm-atom m-atom-fn' : 'm-atom'}>
        {base}
        {sup && sub ? (
          <span className="m-scripts">
            {script(sup, 'sup', pen)}
            {script(sub, 'sub', pen)}
          </span>
        ) : sup ? (
          script(sup, 'sup', pen)
        ) : (
          script(sub!, 'sub', pen)
        )}
      </span>
    );
  });
}

/** Maths inside a sentence: <M>v _x = v · cos θ</M>. */
export function M({ children }: { children: string }) {
  return <span className="m">{render(parseMath(children))}</span>;
}

export interface EqPart {
  src: string;
  /** A note under this part, joined to it by a bracket. */
  label?: string;
}

/**
 * A display equation on its own line. Several sources sit side by side; parts
 * with labels get a bracket and a note underneath, like the film's braces.
 */
export function Eq({ src, parts, children }: { src?: string | string[]; parts?: EqPart[]; children?: ReactNode }) {
  const list = parts ? null : Array.isArray(src) ? src : [src ?? ''];
  // One pen for the whole display, so the symbols appear in reading order.
  const pen: Pen = { i: 0 };
  return (
    <div className="eq">
      <div className="eq-row">
        {list
          ? list.map((s, i) => (
              <span key={i} className="m eq-one">
                {render(parseMath(s), pen)}
              </span>
            ))
          : (
              <span className="m eq-one">
                {parts!.map((p, i) =>
                  p.label ? (
                    <span key={i} className="eq-part">
                      <span className="eq-part-math">{render(parseMath(p.src), pen)}</span>
                      <span className="eq-label" style={{ '--i': pen.i } as CSSProperties}>
                        {p.label}
                      </span>
                    </span>
                  ) : (
                    <span key={i}>{render(parseMath(p.src), pen)}</span>
                  ),
                )}
              </span>
            )}
      </div>
      {children && <div className="eq-foot">{children}</div>}
    </div>
  );
}
