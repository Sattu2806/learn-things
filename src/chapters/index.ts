/**
 * The chapters, in teaching order. A chapter without `ready` is shown as
 * coming next, so students can see where the course is going.
 */
export interface ChapterInfo {
  id: string;
  unit: string;
  title: string;
  ready: boolean;
}

export const CHAPTERS: ChapterInfo[] = [
  { id: 'projectile', unit: 'Motion in a plane', title: 'Projectile motion', ready: true },
  { id: 'circular', unit: 'Motion in a plane', title: 'Circular motion', ready: true },
  { id: 'relative', unit: 'Motion in a plane', title: 'Relative velocity', ready: false },
  { id: 'motion3d', unit: 'Motion in 3D', title: 'Vectors and motion in 3D', ready: false },
  { id: 'newton', unit: 'Forces', title: "Newton's laws of motion", ready: false },
  { id: 'friction', unit: 'Forces', title: 'Friction', ready: false },
];

/** Projectile motion keeps the plain URL (and #theory, #questions); others are #/<id>. */
export function chapterFromHash(hash = window.location.hash): string {
  const m = /^#\/([a-z0-9-]+)/.exec(hash);
  const id = m?.[1];
  return CHAPTERS.some((c) => c.id === id && c.ready) ? id! : 'projectile';
}

export function hashFor(id: string) {
  return id === 'projectile' ? '' : `#/${id}`;
}
