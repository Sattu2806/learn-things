/**
 * Courses around the world that teach projectile motion. Choosing one picks
 * the questions to show first, the value of g its exams use, and marks which
 * parts of the theory are in its syllabus and which are extra.
 */
import type { Level } from './questions';

/** How far a part of the theory goes: every course, some courses, or JEE and university. */
export type Scope = 'core' | 'extended' | 'advanced';

export interface Course {
  id: string;
  region: string;
  name: string;
  /** Where projectile motion sits in this course. */
  where: string;
  levels: Level[];
  /** The value of g its exam questions usually take. */
  g: number;
  scopes: Scope[];
  /** What the course's books call the launch speed. */
  launch: 'u' | 'v₀';
}

export const COURSES: Course[] = [
  { id: 'jee', region: 'India', name: 'JEE Main & Advanced', where: 'Kinematics: motion in a plane', levels: ['jee-main', 'jee-adv', 'school'], g: 10, scopes: ['core', 'extended', 'advanced'], launch: 'u' },
  { id: 'neet', region: 'India', name: 'NEET', where: 'Kinematics: motion in a plane', levels: ['neet', 'school'], g: 10, scopes: ['core'], launch: 'u' },
  { id: 'cbse', region: 'India', name: 'CBSE, ICSE & state boards', where: 'Class 11 Physics, Motion in a Plane', levels: ['school', 'neet'], g: 9.8, scopes: ['core'], launch: 'u' },
  { id: 'ap1', region: 'United States', name: 'AP Physics 1', where: 'Unit 1, Kinematics', levels: ['school'], g: 9.8, scopes: ['core'], launch: 'v₀' },
  { id: 'apc', region: 'United States', name: 'AP Physics C: Mechanics', where: 'Kinematics, with calculus', levels: ['school', 'jee-main'], g: 9.8, scopes: ['core', 'extended'], launch: 'v₀' },
  { id: 'alevel', region: 'United Kingdom', name: 'A-level Physics', where: 'Mechanics: projectile motion', levels: ['school', 'jee-main'], g: 9.81, scopes: ['core', 'extended'], launch: 'u' },
  { id: 'ib', region: 'International', name: 'IB Diploma Physics', where: 'Theme A.1, Kinematics', levels: ['school', 'jee-main'], g: 9.8, scopes: ['core', 'extended'], launch: 'u' },
  { id: 'hsc', region: 'Australia', name: 'HSC Physics', where: 'Module 5, Advanced Mechanics', levels: ['school'], g: 9.8, scopes: ['core'], launch: 'u' },
  { id: 'uni', region: 'University', name: 'First-year mechanics', where: 'Particle kinematics', levels: ['school', 'jee-main', 'jee-adv'], g: 9.81, scopes: ['core', 'extended', 'advanced'], launch: 'v₀' },
];

const KEY = 'learn-things.course';

/** A first guess from the browser's language and region, until the student picks. */
export function guessCourse(langs: readonly string[] = navigator.languages ?? [navigator.language]): Course {
  const byId = (id: string) => COURSES.find((c) => c.id === id)!;
  for (const l of langs) {
    const lang = l.toLowerCase();
    if (lang.endsWith('-in') || /^(hi|bn|ta|te|mr|gu|kn|ml|pa)\b/.test(lang)) return byId('jee');
    if (lang === 'en-us') return byId('ap1');
    if (lang === 'en-gb') return byId('alevel');
    if (lang === 'en-au') return byId('hsc');
  }
  return byId('ib');
}

export function loadCourse(): Course {
  try {
    const id = localStorage.getItem(KEY);
    const found = COURSES.find((c) => c.id === id);
    if (found) return found;
  } catch {
    // Storage can be blocked (private windows, embedded previews).
  }
  return guessCourse();
}

export function saveCourse(c: Course) {
  try {
    localStorage.setItem(KEY, c.id);
  } catch {
    // Not saved; the choice still applies for this visit.
  }
}

export function inSyllabus(c: Course, scope: Scope) {
  return c.scopes.includes(scope);
}
