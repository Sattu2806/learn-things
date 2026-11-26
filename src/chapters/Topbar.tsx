import type { ReactNode } from 'react';
import { Logo } from '../ui/Icons';
import { ChapterPick } from './ChapterPick';

/** The top bar every chapter shares: brand, chapter menu, then the chapter's own controls. */
export function Topbar({ chapter, children }: { chapter: string; children?: ReactNode }) {
  return (
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
      </nav>
      <ChapterPick current={chapter} />
      {children}
    </header>
  );
}
