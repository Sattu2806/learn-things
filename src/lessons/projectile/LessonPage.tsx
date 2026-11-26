import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Logo } from '../../ui/Icons';
import { buildFilm } from './film';
import FilmView, { type FilmApi } from './FilmView';

// The notes load on first visit, so the film starts as fast as before.
const TheoryView = lazy(() => import('./TheoryView'));

type View = 'film' | 'theory';

const VIEWS: [View, string][] = [
  ['film', 'Film'],
  ['theory', 'Theory'],
];

function fromHash(): View {
  return window.location.hash === '#theory' ? 'theory' : 'film';
}

/** One lesson, two ways in: the film, and the theory written out. */
export default function LessonPage() {
  const film = useMemo(buildFilm, []);
  const [view, setView] = useState<View>(fromHash);
  const [theoryOpened, setTheoryOpened] = useState(view === 'theory');
  const filmApi = useRef<FilmApi | null>(null);

  useEffect(() => {
    const on = () => setView(fromHash());
    window.addEventListener('hashchange', on);
    window.addEventListener('popstate', on);
    return () => {
      window.removeEventListener('hashchange', on);
      window.removeEventListener('popstate', on);
    };
  }, []);
  useEffect(() => {
    if (view === 'theory') setTheoryOpened(true);
  }, [view]);

  const go = (next: View) => {
    if (next === view) return;
    // A history entry per view, so Back returns to where you were.
    window.history.pushState(null, '', next === 'theory' ? '#theory' : window.location.pathname + window.location.search);
    setView(next);
  };

  const watch = (t: number) => {
    go('film');
    requestAnimationFrame(() => filmApi.current?.playFrom(t));
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Logo />
          <span className="brand-name">Learn Things</span>
        </div>
        <nav className="crumbs" aria-label="Breadcrumb">
          <span className="crumb hide-sm">Physics</span>
          <span className="crumb-sep hide-sm" aria-hidden="true">
            /
          </span>
          <span className="crumb is-current" aria-current="page">
            Projectile motion
          </span>
        </nav>
        <div className="mode views" role="tablist" aria-label="View">
          {VIEWS.map(([v, label]) => (
            <button key={v} role="tab" id={`tab-${v}`} aria-selected={view === v} aria-controls={`view-${v}`} className="mode-btn" onClick={() => go(v)}>
              {label}
            </button>
          ))}
        </div>
      </header>
      <FilmView film={film} active={view === 'film'} api={filmApi} />
      {theoryOpened && (
        <Suspense fallback={null}>
          <TheoryView film={film} active={view === 'theory'} onWatch={watch} />
        </Suspense>
      )}
    </div>
  );
}
