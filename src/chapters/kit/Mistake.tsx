import type { ReactNode } from 'react';
import { M } from '../../ui/Math';

/** A common-mistake card: the wrong idea (struck through as it appears), a small animation, and why. */
export function Mistake({ title, wrong, fig, children }: { title: string; wrong: string; fig?: ReactNode; children: ReactNode }) {
  return (
    <div className="mistake">
      <h3>{title}</h3>
      <div className="mistake-wrong">
        <span className="mistake-tag">Not</span>
        <M>{wrong}</M>
      </div>
      {fig && <div className="mistake-fig">{fig}</div>}
      <p>{children}</p>
    </div>
  );
}

export function Mistakes({ children }: { children: ReactNode }) {
  return <div className="mistakes">{children}</div>;
}
