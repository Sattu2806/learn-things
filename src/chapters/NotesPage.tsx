import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { FilmTab } from './film/FilmTab';
import type { ChapterFilm } from './film/engine';
import { useMedia } from '../ui/useMedia';
import { Topbar } from './Topbar';

/**
 * The layout every chapter's notes share: contents on the left (lighting up
 * the section being read), the article on the right, and a row of chips on a
 * phone. Sections in the article need id="t-<id>" to be found.
 */
export interface NoteSection {
  id: string;
  title: string;
  group: string;
}

interface Props {
  sections: NoteSection[];
  sideTitle: string;
  sideLead: string;
  children: ReactNode;
}

export function NotesPage({ sections, sideTitle, sideLead, children }: Props) {
  const scrollRef = useRef<HTMLElement>(null);
  const chipsRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(sections[0]?.id);
  const narrow = useMedia('(max-width: 900px)');

  useEffect(() => {
    const root = narrow ? null : scrollRef.current;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id);
          else seen.delete(e.target.id);
        }
        const first = sections.find((s) => seen.has(`t-${s.id}`));
        if (first) setCurrent(first.id);
      },
      { root, rootMargin: '-12% 0px -62% 0px' },
    );
    for (const s of sections) {
      const el = document.getElementById(`t-${s.id}`);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [narrow, sections]);

  useEffect(() => {
    if (!narrow) {
      document.querySelector('.notes .toc .chapter.is-current')?.scrollIntoView({ block: 'nearest' });
      return;
    }
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (row && chip) row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' });
  }, [current, narrow]);

  const go = (id: string) => {
    setCurrent(id);
    document.getElementById(`t-${id}`)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  const groups = [...new Set(sections.map((s) => s.group))];

  return (
    <main className="layout notes">
      <aside className="panel" aria-label="Contents">
        <div className="panel-scroll">
          <h1 className="title">{sideTitle}</h1>
          <p className="lead">{sideLead}</p>
          {groups.map((g) => (
            <div key={g} className="toc-block">
              <div className="toc-group">{g}</div>
              <ol className="chapters toc">
                {sections
                  .filter((s) => s.group === g)
                  .map((s) => (
                    <li key={s.id}>
                      <button className={s.id === current ? 'chapter is-current' : 'chapter'} aria-current={s.id === current ? 'true' : undefined} onClick={() => go(s.id)}>
                        <span className="chapter-n">{String(sections.indexOf(s) + 1).padStart(2, '0')}</span>
                        <span className="chapter-name">{s.title}</span>
                      </button>
                    </li>
                  ))}
              </ol>
            </div>
          ))}
        </div>
        <div className="panel-foot">
          <button className="export-toggle print-toggle" onClick={() => window.print()}>
            <span>Print the notes</span>
            <span className="export-sub">or save them as a PDF to study offline</span>
          </button>
        </div>
      </aside>
      <section className="theory-main" ref={scrollRef} aria-label="Notes">
        <nav className="theory-chips" aria-label="Sections" ref={chipsRef}>
          {sections.map((s) => (
            <button key={s.id} className="preset" aria-pressed={s.id === current} onClick={() => go(s.id)}>
              {s.title}
            </button>
          ))}
        </nav>
        <article className="article">{children}</article>
      </section>
    </main>
  );
}

type View = 'film' | 'notes';

function viewFromHash(): View {
  return /^#\/[a-z0-9-]+\/notes/.test(window.location.hash) ? 'notes' : 'film';
}

/** A whole chapter page: the shared top bar, the chapter's film, and the notes. */
export function ChapterShell({ id, film: make, ...props }: Props & { id: string; film?: () => ChapterFilm }) {
  const cf = useMemo(() => make?.(), [make]);
  const [view, setView] = useState<View>(cf ? viewFromHash : () => 'notes');
  useEffect(() => {
    const on = () => setView(viewFromHash());
    window.addEventListener('popstate', on);
    window.addEventListener('hashchange', on);
    return () => {
      window.removeEventListener('popstate', on);
      window.removeEventListener('hashchange', on);
    };
  }, []);
  const go = (v: View) => {
    if (v === view) return;
    window.history.pushState(null, '', v === 'notes' ? `#/${id}/notes` : `#/${id}`);
    setView(v);
  };
  return (
    <div className="app">
      <Topbar chapter={id}>
        {cf && (
          <div className="mode views" role="tablist" aria-label="View">
            {(
              [
                ['film', 'Film'],
                ['notes', 'Notes'],
              ] as [View, string][]
            ).map(([v, label]) => (
              <button key={v} role="tab" aria-selected={view === v} className="mode-btn" onClick={() => go(v)}>
                {label}
              </button>
            ))}
          </div>
        )}
      </Topbar>
      {cf && <FilmTab cf={cf} id={id} active={view === 'film'} />}
      {(!cf || view === 'notes') && <NotesPage {...props} />}
    </div>
  );
}
