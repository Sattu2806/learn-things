import { createContext, useContext, type ReactNode } from 'react';
import type { Film } from '../../film/timeline';
import { clock } from '../../ui/clock';
import { Icon } from '../../ui/Icons';
import { M } from '../../ui/Math';
import { MOMENTS, type Moment } from './moments';

/** Building blocks shared by every part of the theory page. */

/** Lets any link on the page jump to a moment of the film. */
export const Watch = createContext<{ film: Film; onWatch: (t: number) => void } | null>(null);

export function FilmLink({ m, children = 'Watch it in the film' }: { m: Moment; children?: ReactNode }) {
  const ctx = useContext(Watch);
  const b = ctx?.film.beats.find((x) => x.say.startsWith(MOMENTS[m]));
  if (!ctx || !b) return null;
  return (
    <button className="film-link" onClick={() => ctx.onWatch(b.start)}>
      <Icon name="play" size={11} />
      <span>{children}</span>
      <span className="film-link-t">{clock(b.start)}</span>
    </button>
  );
}

/** Text with maths between $ signs. */
export function Rich({ children }: { children: string }) {
  return (
    <>
      {children.split('$').map((part, i) => (i % 2 ? <M key={i}>{part}</M> : part))}
    </>
  );
}

export function SectionHead({ n, title, badge }: { n: number; title: string; badge?: string }) {
  return (
    <header className="t-head">
      <span className="t-n">{String(n).padStart(2, '0')}</span>
      <h2>{title}</h2>
      {badge && <span className="t-badge">{badge}</span>}
    </header>
  );
}

export function Note({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="t-note">
      <span className="t-note-label">{label}</span>
      <p>{children}</p>
    </aside>
  );
}

export function Example({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="example" aria-labelledby={`ex-${n}`}>
      <header className="example-head">
        <span className="example-n">Example {n}</span>
        <h3 id={`ex-${n}`}>{title}</h3>
      </header>
      {children}
    </section>
  );
}

export function Given({ items }: { items: string[] }) {
  return (
    <div className="given">
      <span className="given-label">Given</span>
      {items.map((src) => (
        <span key={src} className="given-item">
          <M>{src}</M>
        </span>
      ))}
    </div>
  );
}

export function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="step">
      <h4>{title}</h4>
      {children}
    </li>
  );
}

export function Answer({ children }: { children: ReactNode }) {
  return (
    <p className="answer">
      <span className="answer-label">Answer</span>
      <span>{children}</span>
    </p>
  );
}

