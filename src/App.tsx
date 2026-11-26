import { Suspense, lazy, useEffect, useState } from 'react';
import { chapterFromHash } from './chapters';
import LessonPage from './lessons/projectile/LessonPage';

// Each further chapter loads only when it is opened.
const CircularChapter = lazy(() => import('./chapters/circular/CircularChapter'));

export default function App() {
  const [chapter, setChapter] = useState(chapterFromHash);
  useEffect(() => {
    const on = () => setChapter(chapterFromHash());
    window.addEventListener('hashchange', on);
    window.addEventListener('popstate', on);
    return () => {
      window.removeEventListener('hashchange', on);
      window.removeEventListener('popstate', on);
    };
  }, []);
  if (chapter === 'circular')
    return (
      <Suspense fallback={null}>
        <CircularChapter />
      </Suspense>
    );
  return <LessonPage />;
}
