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
  { id: 'units', unit: 'Foundations', title: 'Units and measurement', ready: true },
  { id: 'experiments', unit: 'Foundations', title: 'Measurement and experimental skills', ready: true },
  { id: 'mathtools', unit: 'Foundations', title: 'Mathematical tools for physics', ready: true },
  { id: 'straight', unit: 'Kinematics', title: 'Motion in a straight line', ready: true },
  { id: 'vectors', unit: 'Kinematics', title: 'Vectors, in 2D and 3D', ready: true },
  { id: 'projectile', unit: 'Kinematics', title: 'Projectile motion', ready: true },
  { id: 'circular', unit: 'Kinematics', title: 'Circular motion', ready: true },
  { id: 'motion3d', unit: 'Kinematics', title: 'Motion in three dimensions', ready: true },
  { id: 'relative', unit: 'Kinematics', title: 'Relative velocity', ready: true },
  { id: 'newton', unit: 'Laws of motion', title: "Newton's laws of motion", ready: true },
  { id: 'friction', unit: 'Laws of motion', title: 'Friction', ready: true },
  { id: 'circdyn', unit: 'Laws of motion', title: 'Forces in circular motion', ready: true },
  { id: 'energy', unit: 'Work, energy and power', title: 'Work, energy and power', ready: true },
  { id: 'momentum', unit: 'Systems of particles', title: 'Momentum and collisions', ready: true },
  { id: 'com', unit: 'Systems of particles', title: 'Centre of mass', ready: true },
  { id: 'rotation', unit: 'Systems of particles', title: 'Rotational motion', ready: true },
  { id: 'gravitation', unit: 'Gravitation', title: 'Gravitation', ready: true },
  { id: 'solids', unit: 'Properties of matter', title: 'Elasticity', ready: true },
  { id: 'fluids', unit: 'Properties of matter', title: 'Fluids', ready: true },
  { id: 'heat', unit: 'Heat', title: 'Thermal properties of matter', ready: true },
  { id: 'thermo', unit: 'Heat', title: 'Thermodynamics', ready: true },
  { id: 'kinetic', unit: 'Heat', title: 'Kinetic theory of gases', ready: true },
  { id: 'shm', unit: 'Oscillations and waves', title: 'Oscillations', ready: true },
  { id: 'waves', unit: 'Oscillations and waves', title: 'Waves', ready: true },
  { id: 'charges', unit: 'Electricity', title: 'Electric charges and fields', ready: true },
  { id: 'potential', unit: 'Electricity', title: 'Electrostatic potential and capacitance', ready: true },
  { id: 'current', unit: 'Electricity', title: 'Current electricity', ready: true },
  { id: 'magnetism', unit: 'Magnetism', title: 'Moving charges and magnetism', ready: true },
  { id: 'matter', unit: 'Magnetism', title: 'Magnetism and matter', ready: true },
  { id: 'emi', unit: 'Magnetism', title: 'Electromagnetic induction', ready: true },
  { id: 'ac', unit: 'Magnetism', title: 'Alternating current', ready: true },
  { id: 'emwaves', unit: 'Optics', title: 'Electromagnetic waves', ready: true },
  { id: 'ray', unit: 'Optics', title: 'Ray optics and optical instruments', ready: true },
  { id: 'waveoptics', unit: 'Optics', title: 'Wave optics', ready: true },
  { id: 'dual', unit: 'Modern physics', title: 'Dual nature of radiation and matter', ready: true },
  { id: 'atoms', unit: 'Modern physics', title: 'Atoms', ready: true },
  { id: 'nuclei', unit: 'Modern physics', title: 'Nuclei', ready: true },
  { id: 'semis', unit: 'Electronics', title: 'Semiconductor electronics', ready: true },
  { id: 'relativity', unit: 'Beyond the syllabus', title: 'Special relativity', ready: true },
  { id: 'communication', unit: 'Beyond the syllabus', title: 'Communication systems', ready: true },
  { id: 'shorts', unit: 'Shorts', title: 'Shorts: visual proofs', ready: true },
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
