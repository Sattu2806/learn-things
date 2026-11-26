import { Suspense, lazy, useEffect, useState, type ComponentType, type LazyExoticComponent } from 'react';
import { chapterFromHash } from './chapters';
import LessonPage from './lessons/projectile/LessonPage';

// Each chapter loads only when it is opened. Projectile motion is the full lesson page.
const PAGES: Record<string, LazyExoticComponent<ComponentType>> = {
  straight: lazy(() => import('./chapters/straight/Chapter')),
  vectors: lazy(() => import('./chapters/vectors/Chapter')),
  circular: lazy(() => import('./chapters/circular/CircularChapter')),
  relative: lazy(() => import('./chapters/relative/Chapter')),
  newton: lazy(() => import('./chapters/newton/Chapter')),
  friction: lazy(() => import('./chapters/friction/Chapter')),
  circdyn: lazy(() => import('./chapters/circdyn/Chapter')),
  energy: lazy(() => import('./chapters/energy/Chapter')),
  momentum: lazy(() => import('./chapters/momentum/Chapter')),
  com: lazy(() => import('./chapters/com/Chapter')),
  rotation: lazy(() => import('./chapters/rotation/Chapter')),
  gravitation: lazy(() => import('./chapters/gravitation/Chapter')),
};

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
  const Page = PAGES[chapter];
  if (!Page) return <LessonPage />;
  return (
    <Suspense fallback={null}>
      <Page key={chapter} />
    </Suspense>
  );
}
