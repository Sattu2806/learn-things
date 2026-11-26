import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Topbar } from '../../chapters/Topbar';
import { COURSES, loadCourse, saveCourse, type Course } from './courses';
import { buildFilm } from './film';
import FilmView, { type FilmApi } from './FilmView';

// The notes and questions load on first visit, so the film starts as fast as before.
const TheoryView = lazy(() => import('./TheoryView'));
const QuestionsView = lazy(() => import('./QuestionsView'));

type View = 'film' | 'theory' | 'questions';

const VIEWS: [View, string][] = [
  ['film', 'Film'],
  ['theory', 'Theory'],
  ['questions', 'Questions'],
];

function fromHash(): View {
  const h = window.location.hash.slice(1);
  return h === 'theory' || h === 'questions' ? h : 'film';
}

/** One lesson, two ways in: the film, and the theory written out. */
export default function LessonPage() {
  const film = useMemo(buildFilm, []);
  const [view, setView] = useState<View>(fromHash);
  const [opened, setOpened] = useState<Record<View, boolean>>({ film: true, theory: view === 'theory', questions: view === 'questions' });
  const [course, setCourseState] = useState<Course>(loadCourse);
  const setCourse = (c: Course) => {
    setCourseState(c);
    saveCourse(c);
  };
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
    setOpened((o) => (o[view] ? o : { ...o, [view]: true }));
  }, [view]);

  const go = (next: View) => {
    if (next === view) return;
    // A history entry per view, so Back returns to where you were.
    window.history.pushState(null, '', next === 'film' ? window.location.pathname + window.location.search : `#${next}`);
    setView(next);
  };

  const watch = (t: number) => {
    go('film');
    requestAnimationFrame(() => filmApi.current?.playFrom(t));
  };

  return (
    <div className="app">
      <Topbar chapter="projectile">
        <label className="course-pick">
          <span className="visually-hidden">Your course</span>
          <select className="select select-sm" value={course.id} onChange={(e) => setCourse(COURSES.find((c) => c.id === e.target.value)!)} title="Your course: sets the questions, the syllabus and g">
            {[...new Set(COURSES.map((c) => c.region))].map((r) => (
              <optgroup key={r} label={r}>
                {COURSES.filter((c) => c.region === r).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <div className="mode views" role="tablist" aria-label="View">
          {VIEWS.map(([v, label]) => (
            <button key={v} role="tab" id={`tab-${v}`} aria-selected={view === v} aria-controls={`view-${v}`} className="mode-btn" onClick={() => go(v)}>
              {label}
            </button>
          ))}
        </div>
      </Topbar>
      <FilmView film={film} active={view === 'film'} api={filmApi} />
      <Suspense fallback={null}>
        {opened.theory && <TheoryView film={film} active={view === 'theory'} course={course} onWatch={watch} />}
        {opened.questions && <QuestionsView active={view === 'questions'} course={course} onCourse={setCourse} />}
      </Suspense>
    </div>
  );
}
