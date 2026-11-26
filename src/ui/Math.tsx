import type { ReactNode } from 'react';
import { mathKind, parseMath, type MathKind, type MathNode, type Script } from '../film/math';

/**
 * Maths in the page, written in the film's notation (see film/math.ts) and
 * set as HTML text in the same serif, so it stays sharp, selectable and
 * prints well.
 */

function cls(kind: MathKind, text: string) {
  if (kind === 'op') {
    if (text === '=' || text === '≈') return 'm-op m-rel';
    if (text === '·') return 'm-op m-dot';
    return 'm-op m-bin';
  }
  return `m-${kind}`;
}

function script(s: Script, place: 'sup' | 'sub') {
  return (
    <span className={`m-${place}`}>
      <span className={cls(mathKind(s.text), s.text)}>{s.text}</span>
    </span>
  );
}

function render(nodes: MathNode[]): ReactNode[] {
  return nodes.map((n, i) => {
    if (n.t === 'frac') {
      return (
        <span key={i} className="m-frac">
          <span className="m-frac-top">{render(n.num)}</span>
          <span className="m-frac-bottom">{render(n.den)}</span>
        </span>
      );
    }
    if (n.t === 'sqrt') {
      return (
        <span key={i} className="m-sqrt">
          <svg className="m-radix" viewBox="0 0 10 24" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0.5 14.5L3 13L5.5 23L10 0.6" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="m-radicand">{render(n.body)}</span>
        </span>
      );
    }
    const { text, sup, sub } = n.tok;
    const kind = n.tok.kind ?? mathKind(text);
    const base = <span className={cls(kind, text)}>{text}</span>;
    if (!sup && !sub) return <span key={i}>{base}</span>;
    return (
      <span key={i} className={kind === 'fn' ? 'm-atom m-atom-fn' : 'm-atom'}>
        {base}
        {sup && sub ? (
          <span className="m-scripts">
            {script(sup, 'sup')}
            {script(sub, 'sub')}
          </span>
        ) : sup ? (
          script(sup, 'sup')
        ) : (
          script(sub!, 'sub')
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
  return (
    <div className="eq">
      <div className="eq-row">
        {list
          ? list.map((s, i) => (
              <span key={i} className="m eq-one">
                {render(parseMath(s))}
              </span>
            ))
          : (
              <span className="m eq-one">
                {parts!.map((p, i) =>
                  p.label ? (
                    <span key={i} className="eq-part">
                      <span className="eq-part-math">{render(parseMath(p.src))}</span>
                      <span className="eq-label">{p.label}</span>
                    </span>
                  ) : (
                    <span key={i}>{render(parseMath(p.src))}</span>
                  ),
                )}
              </span>
            )}
      </div>
      {children && <div className="eq-foot">{children}</div>}
    </div>
  );
}
