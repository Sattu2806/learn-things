import { Suspense, lazy, useEffect, useState, type ComponentType, type LazyExoticComponent } from 'react';
import { chapterFromHash } from './chapters';
import LessonPage from './lessons/projectile/LessonPage';

// Each chapter loads only when it is opened. Projectile motion is the full lesson page.
const PAGES: Record<string, LazyExoticComponent<ComponentType>> = {
  units: lazy(() => import('./chapters/units/Chapter')),
  experiments: lazy(() => import('./chapters/experiments/Chapter')),
  mathtools: lazy(() => import('./chapters/mathtools/Chapter')),
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
  waves: lazy(() => import('./chapters/waves/Chapter')),
  shm: lazy(() => import('./chapters/shm/Chapter')),
  kinetic: lazy(() => import('./chapters/kinetic/Chapter')),
  thermo: lazy(() => import('./chapters/thermo/Chapter')),
  heat: lazy(() => import('./chapters/heat/Chapter')),
  fluids: lazy(() => import('./chapters/fluids/Chapter')),
  ac: lazy(() => import('./chapters/ac/Chapter')),
  emwaves: lazy(() => import('./chapters/emwaves/Chapter')),
  ray: lazy(() => import('./chapters/ray/Chapter')),
  waveoptics: lazy(() => import('./chapters/waveoptics/Chapter')),
  dual: lazy(() => import('./chapters/dual/Chapter')),
  atoms: lazy(() => import('./chapters/atoms/Chapter')),
  nuclei: lazy(() => import('./chapters/nuclei/Chapter')),
  semis: lazy(() => import('./chapters/semis/Chapter')),
  charges: lazy(() => import('./chapters/charges/Chapter')),
  potential: lazy(() => import('./chapters/potential/Chapter')),
  current: lazy(() => import('./chapters/current/Chapter')),
  magnetism: lazy(() => import('./chapters/magnetism/Chapter')),
  matter: lazy(() => import('./chapters/matter/Chapter')),
  emi: lazy(() => import('./chapters/emi/Chapter')),
  motion3d: lazy(() => import('./chapters/motion3d/Chapter')),
  relativity: lazy(() => import('./chapters/relativity/Chapter')),
  communication: lazy(() => import('./chapters/communication/Chapter')),
  shorts: lazy(() => import('./shorts/ShortPage')),
  solids: lazy(() => import('./chapters/solids/Chapter')),
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
