/**
 * The question bank: original questions in the style of school exams, NEET,
 * JEE Main and JEE Advanced. Each has its own animated diagram and a worked
 * solution. Text may contain maths between $ signs, in the film's notation.
 * questions.test.ts recomputes every answer from the physics.
 */
import type { SceneSpec } from './Scene';

export type Level = 'school' | 'neet' | 'jee-main' | 'jee-adv';

export const LEVELS: { id: Level; name: string; note: string }[] = [
  { id: 'school', name: 'High school', note: 'Boards, AP, A-level, IB' },
  { id: 'neet', name: 'NEET', note: 'Quick concept MCQs' },
  { id: 'jee-main', name: 'JEE Main', note: 'One idea, some algebra' },
  { id: 'jee-adv', name: 'JEE Advanced', note: 'Several ideas together' },
];

export type Topic = 'basics' | 'velocity' | 'height' | 'angle' | 'target' | 'energy' | 'trajectory' | 'incline' | 'relative' | 'curvature' | 'air';

export const TOPICS: Record<Topic, string> = {
  basics: 'Time, height, range',
  velocity: 'Velocity at any moment',
  height: 'From a height',
  angle: 'Finding the angle',
  target: 'Hitting a target',
  energy: 'Speed and energy',
  trajectory: 'Equation of the path',
  incline: 'Inclined plane',
  relative: 'Relative motion',
  curvature: 'Radius of curvature',
  air: 'Air resistance',
};

export interface Step {
  say?: string;
  eq?: string | string[];
}

interface Base {
  id: string;
  level: Level;
  topic: Topic;
  title: string;
  prompt: string;
  g: number;
  scene: Omit<SceneSpec, 'title'>;
  steps: Step[];
  /** The answer in a sentence. */
  result: string;
}

export interface Mcq extends Base {
  kind: 'mcq';
  options: string[];
  /** Index of the right option. */
  answer: number;
}

export interface Numeric extends Base {
  kind: 'numeric';
  answer: number;
  unit: string;
  /** Accepted error either side. */
  tol: number;
}

export type Question = Mcq | Numeric;

export const QUESTIONS: Question[] = [
  // ------------------------------------------------------------------ high school
  {
    id: 'table',
    level: 'school',
    topic: 'height',
    title: 'Off the edge of a table',
    prompt: 'A ball rolls off a table 1.2 m high at 3.0 m/s. How far from the foot of the table does it land?',
    g: 9.8,
    kind: 'numeric',
    answer: 1.48,
    unit: 'm',
    tol: 0.03,
    scene: { throws: [{ v: 3, theta: 0, g: 9.8, h: 1.2, arrow: true, components: true }], marks: { launch: '1.2 m', range: '= 1.48 m' }, height: 260 },
    steps: [
      { say: 'It leaves sideways, so up and down it simply falls 1.2 m from rest.', eq: 't = √[ [ 2 · h | g ] ] = √[ [ 2 · 1.2 | 9.8 ] ] = 0.495 "s"' },
      { say: 'Sideways, the speed stays 3.0 m/s the whole time.', eq: 'x = 3.0 · 0.495 = 1.48 "m"' },
    ],
    result: 'It lands 1.48 m from the foot of the table, after 0.495 s.',
  },
  {
    id: 'velocity-2s',
    level: 'school',
    topic: 'velocity',
    title: 'Which way is it moving?',
    prompt: 'A ball is thrown at 20 m/s, 30° above the horizontal. What is its velocity 2.0 s later?',
    g: 9.8,
    kind: 'mcq',
    options: ['19.8 m/s, 29° above the horizontal', '17.3 m/s, horizontally', '19.8 m/s, 29° below the horizontal', '9.6 m/s, straight down'],
    answer: 2,
    scene: { throws: [{ v: 20, theta: 30, g: 9.8, arrow: true, components: true }], freeze: { t: 2, label: 't = 2 s' }, height: 270 },
    steps: [
      { say: 'The sideways part never changes; the upward part falls by g every second.', eq: ['v _x = 20 · cos 30° = 17.3 "m/s"', 'v _y = 20 · sin 30° − 9.8 · 2 = −9.6 "m/s"'] },
      { say: 'Put the parts back together. A negative upward part means it is now moving downward.', eq: ['v = √[ 17.3 ^2 + 9.6 ^2 ] = 19.8 "m/s"', 'tan φ = [ 9.6 | 17.3 ] , φ = 29°'] },
    ],
    result: '19.8 m/s, pointing 29° below the horizontal: it has passed the top and is on its way down.',
  },
  {
    id: 'height-60',
    level: 'school',
    topic: 'basics',
    title: 'How high does it go?',
    prompt: 'A stone is thrown at 20 m/s, 60° above the horizontal. Find its greatest height.',
    g: 9.8,
    kind: 'numeric',
    answer: 15.3,
    unit: 'm',
    tol: 0.15,
    scene: { throws: [{ v: 20, theta: 60, g: 9.8, arrow: true }], marks: { height: '= 15.3 m', angle: true }, height: 280 },
    steps: [
      { say: 'At the top the upward speed is zero, so only the upward part of the launch matters.', eq: 'H = [ v ^2 · sin ^2 θ | 2 · g ] = [ 20 ^2 · sin ^2 60° | 2 · 9.8 ]' },
      { eq: 'H = [ 400 · 0.75 | 19.6 ] = 15.3 "m"' },
    ],
    result: 'It rises 15.3 m.',
  },
  {
    id: 'two-angles',
    level: 'school',
    topic: 'angle',
    title: 'Two ways to land in the same place',
    prompt: 'A fielder throws at 20 m/s. At which angles will the ball land 30 m away?',
    g: 9.8,
    kind: 'mcq',
    options: ['30° and 60°', '23.7° and 66.3°', '15° and 75°', '45° only'],
    answer: 1,
    scene: {
      throws: [
        { v: 20, theta: 23.65, g: 9.8, label: '23.7°' },
        { v: 20, theta: 66.35, g: 9.8, label: '66.3°' },
      ],
      height: 270,
    },
    steps: [
      { say: 'Rearrange the range formula for the angle.', eq: 'sin 2 θ = [ R · g | v ^2 ] = [ 30 · 9.8 | 400 ] = 0.735' },
      { say: 'Two angles between 0° and 180° have that sine, so there are two answers.', eq: ['2 θ = 47.3° → θ = 23.7°', '2 θ = 132.7° → θ = 66.3°'] },
    ],
    result: '23.7° (a flat, quick throw) or 66.3° (a high lob). They add up to 90°.',
  },
  {
    id: 'wall',
    level: 'school',
    topic: 'target',
    title: 'Over the wall',
    prompt: 'A ball is kicked at 18 m/s, 40° above the ground, towards a wall 4.0 m high and 20 m away. By how much does it clear the wall?',
    g: 9.8,
    kind: 'numeric',
    answer: 2.47,
    unit: 'm',
    tol: 0.06,
    scene: { throws: [{ v: 18, theta: 40, g: 9.8 }], wall: { x: 20, h: 4, label: '4 m' }, height: 270 },
    steps: [
      { say: 'First find when it reaches the wall, using the steady sideways speed.', eq: 't = [ 20 | 18 · cos 40° ] = 1.450 "s"' },
      { say: 'Then its height at that moment.', eq: 'y = 18 · sin 40° · 1.450 − ½ · 9.8 · 1.450 ^2 = 16.78 − 10.31 = 6.47 "m"' },
    ],
    result: 'It is 6.47 m up as it passes the wall, so it clears it by 2.47 m.',
  },
  {
    id: 'building',
    level: 'school',
    topic: 'height',
    title: 'Thrown up from a rooftop',
    prompt: 'From the top of a building 10 m high, a ball is thrown at 15 m/s, 30° above the horizontal. How long is it in the air?',
    g: 9.8,
    kind: 'numeric',
    answer: 2.39,
    unit: 's',
    tol: 0.03,
    scene: { throws: [{ v: 15, theta: 30, g: 9.8, h: 10 }], marks: { launch: '10 m', angle: true, range: '= 31.0 m' }, height: 280 },
    steps: [
      { say: 'It lands 10 m below where it started, so set the height to −10 m.', eq: '−10 = 15 · sin 30° · t − ½ · 9.8 · t ^2' },
      { say: 'That is a quadratic in t. Keep the positive root.', eq: ['4.9 · t ^2 − 7.5 · t − 10 = 0', 't = [ 7.5 + √[ 7.5 ^2 + 4 · 4.9 · 10 ] | 9.8 ] = 2.39 "s"'] },
    ],
    result: 'It is in the air for 2.39 s, and lands 31.0 m from the building.',
  },
  {
    id: 'speed-at-height',
    level: 'school',
    topic: 'energy',
    title: 'Speed at a given height',
    prompt: 'A ball is thrown at 20 m/s, 60° above the horizontal. How fast is it moving when it is 10 m above the ground?',
    g: 9.8,
    kind: 'numeric',
    answer: 14.3,
    unit: 'm/s',
    tol: 0.15,
    scene: { throws: [{ v: 20, theta: 60, g: 9.8, arrow: true }], level: { y: 10, label: '10 m' }, height: 280 },
    steps: [
      { say: 'The sideways part never changes, and the upward part follows $v ^2 = u ^2 − 2 · g · y$. Add the two:', eq: 'v ^2 = u ^2 − 2 · g · y' },
      { eq: 'v = √[ 20 ^2 − 2 · 9.8 · 10 ] = √[ 204 ] = 14.3 "m/s"' },
    ],
    result: '14.3 m/s, on the way up and again on the way down: the angle does not matter, only the height.',
  },
  {
    id: 'air',
    level: 'school',
    topic: 'air',
    title: 'What air does to the path',
    prompt: 'With air resistance, how does the path of a fast ball compare with the ideal parabola?',
    g: 9.8,
    kind: 'mcq',
    options: ['It is the same shape, just smaller', 'It goes higher and farther', 'It lands at the same place, but lower', 'It lands shorter, and comes down more steeply than it went up'],
    answer: 3,
    scene: {
      throws: [
        { v: 30, theta: 45, g: 9.8, label: 'no air', muted: true },
        { v: 30, theta: 45, g: 9.8, drag: 0.012, label: 'with air' },
      ],
      height: 270,
    },
    steps: [
      { say: 'Drag always pushes against the motion, so it slows the sideways speed too: the ball covers less ground.' },
      { say: 'By the time it comes down it is moving more slowly sideways than when it went up, so the way down is steeper. The path is no longer symmetric.' },
    ],
    result: 'It lands shorter, with a steeper fall than rise: a lopsided curve, not a parabola.',
  },
  {
    id: 'average-velocity',
    level: 'school',
    topic: 'velocity',
    title: 'Average velocity over the whole flight',
    prompt: 'A ball is thrown at 15 m/s, 40° above the horizontal, and lands at the same level. What is its average velocity over the whole flight?',
    g: 9.8,
    kind: 'mcq',
    options: ['15.0 m/s, along the launch direction', '9.6 m/s, horizontal', '11.5 m/s, horizontal', 'Zero'],
    answer: 2,
    scene: {
      throws: [
        { v: 15, theta: 40, g: 9.8, arrow: true },
        { v: 15 * Math.cos((40 * Math.PI) / 180), theta: 0, g: 0, tEnd: (2 * 15 * Math.sin((40 * Math.PI) / 180)) / 9.8, marker: 'ghost', noTrail: true },
      ],
      height: 270,
    },
    steps: [
      { say: 'Average velocity is displacement over time. The ball lands level with where it started, so its displacement is the range, along the ground.', eq: 'v _avg = [ R | T ] = [ u · cos θ · T | T ] = u · cos θ' },
      { say: 'It is the steady sideways speed. The ghost ball slides along the ground at exactly this velocity and arrives with the real one.', eq: 'v _avg = 15 · cos 40° = 11.5 "m/s"' },
    ],
    result: '11.5 m/s, horizontally. (The average speed is larger, because the curved path is longer than the range.)',
  },
  {
    id: 'top-time',
    level: 'school',
    topic: 'basics',
    title: 'How high from the time in the air?',
    prompt: 'A ball kicked from level ground stays in the air for 3.0 s before it lands on level ground. Ignoring air, how high does it rise?',
    g: 9.8,
    kind: 'numeric',
    answer: 11.0,
    unit: 'm',
    tol: 0.15,
    scene: { throws: [{ v: 21, theta: (Math.asin(0.7) * 180) / Math.PI, g: 9.8 }], marks: { height: '= 11.0 m' }, height: 270 },
    steps: [
      { say: 'A flight from the ground back to the ground is symmetric, so the ball takes half the time to reach the top.', eq: 't _top = [ T | 2 ] = 1.5 "s"' },
      { say: 'From the top it falls freely from rest, so the angle and the speed are not needed at all.', eq: 'H = ½ · g · t _top ^2 = ½ · 9.8 · 1.5 ^2 = 11.0 "m"' },
    ],
    result: 'It rises 11.0 m.',
  },

  // ------------------------------------------------------------------ NEET
  {
    id: 'ratio-heights',
    level: 'neet',
    topic: 'basics',
    title: 'Same speed, different angles',
    prompt: 'Two balls are thrown at the same speed, at 30° and at 60° to the horizontal. What is the ratio of their greatest heights, $H _30 : H _60$?',
    g: 10,
    kind: 'mcq',
    options: ['1 : √3', '1 : 3', '3 : 1', '1 : 2'],
    answer: 1,
    scene: {
      throws: [
        { v: 20, theta: 30, g: 10, label: '30°' },
        { v: 20, theta: 60, g: 10, label: '60°' },
      ],
      height: 260,
    },
    steps: [{ say: 'Height grows with $sin ^2 θ$, so', eq: '[ H _30 | H _60 ] = [ sin ^2 30° | sin ^2 60° ] = [ 0.25 | 0.75 ] = [ 1 | 3 ]' }],
    result: '1 : 3. Their ranges are equal, because 30° + 60° = 90°.',
  },
  {
    id: 'range-4h',
    level: 'neet',
    topic: 'basics',
    title: 'Range four times the height',
    prompt: 'The range of a projectile is four times its greatest height. At what angle was it thrown?',
    g: 10,
    kind: 'mcq',
    options: ['30°', '60°', '45°', '76°'],
    answer: 2,
    scene: { throws: [{ v: 20, theta: 45, g: 10 }], marks: { height: '= 10 m', range: '= 40 m', angle: true }, height: 270 },
    steps: [
      { say: 'Divide the two formulas; most of it cancels.', eq: '[ H | R ] = [ v ^2 · sin ^2 θ | 2 · g ] · [ g | 2 · v ^2 · sin θ · cos θ ] = [ tan θ | 4 ]' },
      { say: 'If $R = 4 · H$, then', eq: 'tan θ = 1 , θ = 45°' },
    ],
    result: '45°.',
  },
  {
    id: 'ke-top',
    level: 'neet',
    topic: 'energy',
    title: 'Energy at the top',
    prompt: 'A ball is thrown at 45° with kinetic energy K. What is its kinetic energy at the highest point?',
    g: 10,
    kind: 'mcq',
    options: ['K / 2', 'Zero', 'K', 'K / √2'],
    answer: 0,
    scene: { throws: [{ v: 20, theta: 45, g: 10, arrow: true, components: true }], height: 270 },
    steps: [
      { say: 'At the top only the sideways part of the speed is left.', eq: 'v _top = v · cos 45° = [ v | √[ 2 ] ]' },
      { say: 'Kinetic energy goes with speed squared.', eq: 'K _top = K · cos ^2 45° = [ K | 2 ]' },
    ],
    result: 'K / 2. It is never zero: the ball is still moving sideways at the top.',
  },
  {
    id: 'tower',
    level: 'neet',
    topic: 'height',
    title: 'Thrown sideways from a tower',
    prompt: 'A ball is thrown horizontally at 20 m/s from the top of a tower 80 m high. At what angle to the horizontal does it hit the ground?',
    g: 10,
    kind: 'mcq',
    options: ['45°', 'tan⁻¹ (1/2)', '60°', 'tan⁻¹ 2'],
    answer: 3,
    scene: { throws: [{ v: 20, theta: 0, g: 10, h: 80, arrow: true, components: true }], marks: { launch: '80 m' }, height: 300 },
    steps: [
      { say: 'Time to fall 80 m:', eq: 't = √[ [ 2 · 80 | 10 ] ] = 4 "s"' },
      { say: 'Its downward speed by then, against the steady 20 m/s sideways:', eq: ['v _y = 10 · 4 = 40 "m/s"', 'tan φ = [ 40 | 20 ] = 2'] },
    ],
    result: 'tan⁻¹ 2 (about 63°) below the horizontal, at 20√5 ≈ 44.7 m/s.',
  },
  {
    id: 'half-speed',
    level: 'neet',
    topic: 'velocity',
    title: 'Half speed at the top',
    prompt: 'At the top of its path a projectile moves at half its launch speed. At what angle was it thrown?',
    g: 10,
    kind: 'mcq',
    options: ['30°', '45°', '60°', '75°'],
    answer: 2,
    scene: { throws: [{ v: 20, theta: 60, g: 10, arrow: true }], marks: { angle: true }, height: 270 },
    steps: [{ say: 'At the top the speed is the sideways part only.', eq: ['v · cos θ = [ v | 2 ]', 'cos θ = [ 1 | 2 ] , θ = 60°'] }],
    result: '60°.',
  },
  {
    id: 'drop-or-throw',
    level: 'neet',
    topic: 'height',
    title: 'Dropped and thrown together',
    prompt: 'Ball A is dropped from rest from the top of a 45 m tower. At the same instant ball B is thrown horizontally from the same point at 12 m/s. Which statement is correct?',
    g: 10,
    kind: 'mcq',
    options: ['A lands first, because it has no sideways motion to carry', 'B lands first, because it is moving faster', 'They land together, after 3 s', 'They land together, and with the same speed'],
    answer: 2,
    scene: {
      throws: [
        { v: 12, theta: 0, g: 10, h: 45 },
        { v: 0, theta: 0, g: 10, h: 45 },
      ],
      link: true,
      marks: { launch: '45 m' },
      height: 300,
    },
    steps: [
      { say: 'Up and down, both balls start with no downward speed and feel the same gravity. The sideways speed does not enter the vertical motion.', eq: 't = √[ [ 2 · h | g ] ] = √[ [ 2 · 45 | 10 ] ] = 3 "s"' },
      { say: 'Watch the dashed line: it stays horizontal all the way down. But B also has its sideways speed, so it hits harder:', eq: ['v _A = 10 · 3 = 30 "m/s"', 'v _B = √[ 12 ^2 + 30 ^2 ] = 32.3 "m/s"'] },
    ],
    result: 'They land together after 3 s, but B hits the ground faster (32.3 m/s against 30 m/s).',
  },
  {
    id: 'same-upward-speed',
    level: 'neet',
    topic: 'basics',
    title: 'Straight up, and slanted',
    prompt: 'Ball P is thrown straight up at 20 m/s. At the same instant ball Q is thrown from the same spot at 25 m/s, at an angle θ with sin θ = 0.8. When do they land, and how far apart are they?',
    g: 10,
    kind: 'mcq',
    options: ['Q later, after 5 s; 75 m apart', 'Together, after 4 s; 100 m apart', 'Together, after 4 s; 60 m apart', 'Q later, after 5 s; 60 m apart'],
    answer: 2,
    scene: {
      throws: [
        { v: 25, theta: (Math.asin(0.8) * 180) / Math.PI, g: 10, label: 'Q' },
        { v: 20, theta: 90, g: 10, label: 'P' },
      ],
      link: true,
      height: 280,
    },
    steps: [
      { say: 'The time in the air depends only on the upward part of the launch speed. Q has $u _y = 25 · 0.8 = 20 "m/s"$, the same as P, so they are always at the same height.', eq: 'T = [ 2 · u _y | g ] = [ 2 · 20 | 10 ] = 4 "s"' },
      { say: 'P comes straight back down. Q has also drifted sideways at its steady sideways speed:', eq: ['u _x = 25 · 0.6 = 15 "m/s"', 'R = 15 · 4 = 60 "m"'] },
    ],
    result: 'They land together after 4 s, with Q 60 m from P.',
  },
  {
    id: 'velocity-change',
    level: 'neet',
    topic: 'velocity',
    title: 'How much does the velocity change?',
    prompt: 'A ball is thrown from level ground at 25 m/s, at an angle θ with sin θ = 0.8. What is the size of the change in its velocity between launch and landing?',
    g: 10,
    kind: 'numeric',
    answer: 40,
    unit: 'm/s',
    tol: 0.4,
    scene: { throws: [{ v: 25, theta: (Math.asin(0.8) * 180) / Math.PI, g: 10, arrow: true, components: true }], freeze: { t: 4, label: 'landing' }, height: 280 },
    steps: [
      { say: 'The sideways velocity never changes, so the whole change is vertical. It is what gravity adds over the whole flight:', eq: ['T = [ 2 · 25 · 0.8 | 10 ] = 4 "s"', 'Δv = g · T = 10 · 4 = 40 "m/s"'] },
      { say: 'Check: the upward part goes from +20 to −20 m/s.', eq: 'Δv _y = ( −20 ) − 20 = −40 "m/s"' },
    ],
    result: '40 m/s, pointing straight down. The speed is back to 25 m/s, but the direction has changed.',
  },
  {
    id: 'range-equals-height',
    level: 'neet',
    topic: 'angle',
    title: 'Range equal to height',
    prompt: 'A projectile has a range equal to its greatest height. Which launch angle does this?',
    g: 10,
    kind: 'mcq',
    options: ['45°', 'tan⁻¹ 2', '60°', 'tan⁻¹ 4'],
    answer: 3,
    scene: { throws: [{ v: 20, theta: (Math.atan(4) * 180) / Math.PI, g: 10 }], marks: { height: '= 18.8 m', range: '= 18.8 m', angle: true }, height: 280 },
    steps: [
      { say: 'Divide the two formulas, as for any projectile:', eq: '[ H | R ] = [ tan θ | 4 ]' },
      { say: 'If H = R the ratio is 1, so', eq: 'tan θ = 4 , θ = 76°' },
    ],
    result: 'tan⁻¹ 4, about 76°: a steep throw.',
  },

  // ------------------------------------------------------------------ JEE Main
  {
    id: 'path-equation',
    level: 'jee-main',
    topic: 'trajectory',
    title: 'Read the equation of the path',
    prompt: 'A projectile follows $y = x − [ x ^2 | 20 ]$, with x and y in metres. What is its range?',
    g: 10,
    kind: 'mcq',
    options: ['10 m', '20 m', '40 m', '5 m'],
    answer: 1,
    scene: { throws: [{ v: Math.sqrt(200), theta: 45, g: 10 }], marks: { range: '= 20 m', angle: true }, height: 260 },
    steps: [
      { say: 'Match it against the general path:', eq: 'y = x · tan θ − [ g · x ^2 | 2 · u ^2 · cos ^2 θ ]' },
      { say: 'So $tan θ = 1$, giving 45°, and', eq: ['[ 10 | 2 · u ^2 · ½ ] = [ 1 | 20 ] → u ^2 = 200', 'R = [ u ^2 · sin 90° | g ] = 20 "m"'] },
      { say: 'Quicker: the range is where $y = 0$ again, $x − x ^2 / 20 = 0$, so $x = 20$.' },
    ],
    result: '20 m, thrown at 45° and 10√2 m/s.',
  },
  {
    id: 'r-from-heights',
    level: 'jee-main',
    topic: 'angle',
    title: 'Range from two heights',
    prompt: 'Two projectiles thrown at the same speed have the same range R, with greatest heights $H _1$ and $H _2$. Then R equals',
    g: 10,
    kind: 'mcq',
    options: ['2 √(H₁ H₂)', '√(H₁ H₂)', '4 √(H₁ H₂)', 'H₁ + H₂'],
    answer: 2,
    scene: {
      throws: [
        { v: 20, theta: 30, g: 10, label: 'H₁' },
        { v: 20, theta: 60, g: 10, label: 'H₂' },
      ],
      height: 260,
    },
    steps: [
      { say: 'Same range means the angles are θ and 90° − θ, so one height uses sin² and the other cos².', eq: 'H _1 · H _2 = [ u ^2 · sin ^2 θ | 2 · g ] · [ u ^2 · cos ^2 θ | 2 · g ]' },
      { eq: 'H _1 · H _2 = [ ( u ^2 · sin 2 θ ) ^2 | 16 · g ^2 ] = [ R ^2 | 16 ]' },
    ],
    result: 'R = 4 √(H₁ H₂).',
  },
  {
    id: 'curvature-top',
    level: 'jee-main',
    topic: 'curvature',
    title: 'How sharply it turns at the top',
    prompt: 'A ball is thrown at 20 m/s, 60° above the horizontal. What is the radius of curvature of its path at the highest point?',
    g: 10,
    kind: 'numeric',
    answer: 10,
    unit: 'm',
    tol: 0.1,
    scene: { throws: [{ v: 20, theta: 60, g: 10, arrow: true }], curvature: true, height: 300 },
    steps: [
      { say: 'At the top the velocity is sideways and gravity points straight down, at right angles to it. So all of g bends the path:', eq: 'g = [ v _top ^2 | r ]' },
      { eq: 'r = [ ( u · cos θ ) ^2 | g ] = [ 10 ^2 | 10 ] = 10 "m"' },
    ],
    result: '10 m.',
  },
  {
    id: 'perpendicular',
    level: 'jee-main',
    topic: 'velocity',
    title: 'At right angles to the launch',
    prompt: 'A ball is thrown at 20 m/s, 60° above the horizontal. After how long is its velocity perpendicular to its launch velocity?',
    g: 10,
    kind: 'numeric',
    answer: 2.31,
    unit: 's',
    tol: 0.03,
    scene: { throws: [{ v: 20, theta: 60, g: 10, arrow: true }], freeze: { t: 2.309, label: 'at right angles' }, height: 290 },
    steps: [
      { say: 'Perpendicular means the dot product is zero.', eq: 'u _x · u _x + u _y · ( u _y − g · t ) = 0' },
      { eq: ['u ^2 = g · t · u · sin θ', 't = [ u | g · sin θ ] = [ 20 | 10 · 0.866 ] = 2.31 "s"'] },
      { say: 'That is before it lands at 3.46 s, so it really happens.' },
    ],
    result: 'After 2.31 s.',
  },
  {
    id: 'incline-up',
    level: 'jee-main',
    topic: 'incline',
    title: 'Up a slope',
    prompt: 'A ball is thrown from the bottom of a 30° slope at 20 m/s, 60° above the horizontal. How far up the slope does it land?',
    g: 10,
    kind: 'numeric',
    answer: 26.7,
    unit: 'm',
    tol: 0.2,
    scene: { throws: [{ v: 20, theta: 60, g: 10 }], incline: 30, marks: { slope: '26.7 m along the slope' }, height: 280 },
    steps: [
      { say: 'Tilt the axes to lie along the slope. Gravity then has a part down the slope, $g · sin α$, and a part into it, $g · cos α$. The ball leaves at 30° to the slope.', eq: 'T = [ 2 · u · sin ( θ − α ) | g · cos α ] = [ 2 · 20 · sin 30° | 10 · cos 30° ] = 2.31 "s"' },
      { say: 'Along the slope it slows down steadily:', eq: 's = u · cos 30° · T − ½ · g · sin 30° · T ^2 = 40.0 − 13.3 = 26.7 "m"' },
    ],
    result: '26.7 m up the slope.',
  },
  {
    id: 'two-balls',
    level: 'jee-main',
    topic: 'relative',
    title: 'Two balls, one moment',
    prompt: 'Two balls are thrown at the same time from the same point at 20 m/s, one at 30° and one at 60°. How far apart are they 1 s later?',
    g: 10,
    kind: 'numeric',
    answer: 10.35,
    unit: 'm',
    tol: 0.1,
    scene: {
      throws: [
        { v: 20, theta: 30, g: 10 },
        { v: 20, theta: 60, g: 10 },
      ],
      link: true,
      height: 270,
    },
    steps: [
      { say: 'Both fall by the same $½ · g · t ^2$, so gravity cancels when you compare them. Seen from one ball, the other moves in a straight line at a steady speed:', eq: 'Δu = 2 · u · sin 15° = 10.35 "m/s"' },
      { eq: 'd = 10.35 · 1 = 10.35 "m"' },
    ],
    result: '10.35 m. Watch the dashed line: it keeps the same direction and grows steadily.',
  },
  {
    id: 'wall-bounce',
    level: 'jee-main',
    topic: 'target',
    title: 'Bouncing back off a wall',
    prompt: 'A ball is thrown from level ground at 25 m/s, at an angle θ with sin θ = 0.8. A tall smooth vertical wall stands 45 m from the launch point. The ball bounces elastically off it: its sideways velocity reverses and its vertical velocity is unchanged. How far from the wall does it land?',
    g: 10,
    kind: 'numeric',
    answer: 15,
    unit: 'm',
    tol: 0.2,
    scene: {
      throws: [
        { v: 25, theta: (Math.asin(0.8) * 180) / Math.PI, g: 10, tEnd: 3, handOff: true },
        { v: Math.hypot(15, 10), theta: (Math.atan2(-10, -15) * 180) / Math.PI, g: 10, x0: 45, h: 15, delay: 3 },
      ],
      wall: { x: 45, h: 25, label: 'wall' },
      height: 280,
    },
    steps: [
      { say: 'The wall only reverses the sideways velocity, so the up and down motion carries on as if it were not there. The flight still lasts $T = 4 "s"$, and the ball covers the same 60 m of ground, but folded back at the wall.', eq: ['u _x = 25 · 0.6 = 15 "m/s"', 't _hit = [ 45 | 15 ] = 3 "s"'] },
      { say: 'Without the wall it would land 60 m out, 15 m beyond the wall. The bounce reflects that 15 m back:', eq: 'd = 60 − 45 = 15 "m"' },
      { say: 'Check: at the wall it is 15 m up and falling at 10 m/s, so it needs 1 s more, and moves 15 m back.' },
    ],
    result: 'It lands 15 m in front of the wall, 30 m from where it was thrown.',
  },
  {
    id: 'heights-sum',
    level: 'jee-main',
    topic: 'angle',
    title: 'Two heights, one speed',
    prompt: 'Two balls are thrown at the same speed from level ground and land at the same spot. Their greatest heights are 5 m and 15 m. What was the launch speed?',
    g: 10,
    kind: 'mcq',
    options: ['10√2 m/s', '15 m/s', '20 m/s', '25 m/s'],
    answer: 2,
    scene: {
      throws: [
        { v: 20, theta: 30, g: 10, label: '5 m' },
        { v: 20, theta: 60, g: 10, label: '15 m' },
      ],
      height: 270,
    },
    steps: [
      { say: 'The same range means launch angles θ and 90° − θ. One height has $sin ^2 θ$ in it and the other $cos ^2 θ$, so they add up neatly:', eq: 'H _1 + H _2 = [ u ^2 · ( sin ^2 θ + cos ^2 θ ) | 2 · g ] = [ u ^2 | 2 · g ]' },
      { eq: 'u = √[ 2 · g · ( H _1 + H _2 ) ] = √[ 2 · 10 · 20 ] = 20 "m/s"' },
    ],
    result: '20 m/s (the angles were 30° and 60°).',
  },

  // ------------------------------------------------------------------ JEE Advanced
  {
    id: 'incline-max',
    level: 'jee-adv',
    topic: 'incline',
    title: 'Longest throw up and down a slope',
    prompt: 'On a 30° slope, with launch speed 20 m/s, what is the ratio of the longest possible throw up the slope to the longest possible throw down it?',
    g: 10,
    kind: 'mcq',
    options: ['1 : 2', '1 : √3', '2 : 3', '1 : 3'],
    answer: 3,
    scene: { throws: [{ v: 20, theta: 60, g: 10, label: 'best throw up: 60°' }], incline: 30, marks: { slope: '26.7 m' }, height: 280 },
    steps: [
      { say: 'The longest throw along a slope bisects the angle between the slope and the vertical, and goes', eq: 'R _max = [ u ^2 | g · ( 1 ± sin α ) ]' },
      { say: 'Plus for up the slope, minus for down it:', eq: '[ R _up | R _down ] = [ 1 − sin 30° | 1 + sin 30° ] = [ 0.5 | 1.5 ] = [ 1 | 3 ]' },
    ],
    result: '1 : 3 (26.7 m up, 80 m down).',
  },
  {
    id: 'same-height-twice',
    level: 'jee-adv',
    topic: 'basics',
    title: 'The same height, twice',
    prompt: 'A ball passes a certain height h at t₁ = 1 s on the way up and at t₂ = 3 s on the way down. Find h.',
    g: 10,
    kind: 'numeric',
    answer: 15,
    unit: 'm',
    tol: 0.1,
    scene: { throws: [{ v: 20 / Math.sin(Math.PI / 3), theta: 60, g: 10 }], level: { y: 15, label: 'h' }, height: 280 },
    steps: [
      { say: 't₁ and t₂ are the two roots of', eq: '½ · g · t ^2 − u _y · t + h = 0' },
      { say: 'The product of the roots of a quadratic is c / a:', eq: ['t _1 · t _2 = [ 2 · h | g ]', 'h = ½ · g · t _1 · t _2 = ½ · 10 · 1 · 3 = 15 "m"'] },
      { say: 'Bonus: the sum of the roots gives the upward launch speed, $u _y = g · ( t _1 + t _2 ) / 2 = 20 "m/s"$.' },
    ],
    result: 'h = 15 m.',
  },
  {
    id: 'slowest',
    level: 'jee-adv',
    topic: 'target',
    title: 'The slowest throw that reaches a point',
    prompt: 'What is the smallest launch speed that can reach a point 40 m away horizontally and 30 m up?',
    g: 10,
    kind: 'numeric',
    answer: 28.3,
    unit: 'm/s',
    tol: 0.2,
    scene: { throws: [{ v: Math.sqrt(800), theta: 63.435, g: 10 }], target: { x: 40, y: 30, label: '(40 m, 30 m)' }, marks: { angle: true }, height: 290 },
    steps: [
      { say: 'Write the path equation as a quadratic in tan θ:', eq: '[ g · x ^2 | 2 · u ^2 ] · tan ^2 θ − x · tan θ + ( y + [ g · x ^2 | 2 · u ^2 ] ) = 0' },
      { say: 'Some angle works only if this has a real root. The slowest speed makes the discriminant exactly zero:', eq: 'u ^2 = g · ( y + √[ x ^2 + y ^2 ] ) = 10 · ( 30 + 50 ) = 800' },
      { eq: ['u = 28.3 "m/s"', 'tan θ = [ u ^2 | g · x ] = 2'] },
    ],
    result: '28.3 m/s, aimed at tan⁻¹ 2 ≈ 63.4°.',
  },
  {
    id: 'plane',
    level: 'jee-adv',
    topic: 'relative',
    title: 'The packet and the plane',
    prompt: 'A plane flying level at 100 m/s, 500 m up, drops a packet. Where is the packet, compared with the plane, when it hits the ground?',
    g: 10,
    kind: 'mcq',
    options: ['Directly below the point where it was dropped', 'Directly below the plane, 1000 m ahead of the drop point', '500 m behind the plane', '1000 m behind the plane'],
    answer: 1,
    scene: {
      throws: [
        { v: 100, theta: 0, g: 10, h: 500 },
        { v: 100, theta: 0, g: 0, h: 500, tEnd: 10, marker: 'plane', noTrail: true },
      ],
      noCliff: true,
      link: true,
      height: 270,
    },
    steps: [
      { say: 'The packet leaves with the plane’s 100 m/s and keeps it, so it stays directly under the plane all the way down.' },
      { eq: ['t = √[ [ 2 · 500 | 10 ] ] = 10 "s"', 'x = 100 · 10 = 1000 "m"'] },
    ],
    result: 'Directly below the plane, 1000 m ahead of where it was dropped (ignoring air).',
  },
  {
    id: 'meet-vertical',
    level: 'jee-adv',
    topic: 'relative',
    title: 'Catching a ball thrown straight up',
    prompt: 'Ball A is thrown straight up at 20 m/s from a spot on level ground. At the same instant a launcher on the ground 40 m away fires ball B at an angle, so that B hits A before A comes back down (or just as it lands). What is the smallest launch speed B can have?',
    g: 10,
    kind: 'mcq',
    options: ['20 m/s', '25 m/s', '28.3 m/s', '22.4 m/s'],
    answer: 3,
    scene: {
      throws: [
        { v: Math.sqrt(500), theta: (Math.atan2(20, 10) * 180) / Math.PI, g: 10 },
        { v: 20, theta: 90, g: 10, x0: 40 },
      ],
      link: true,
      height: 280,
    },
    steps: [
      { say: 'To meet A at all, B must always be at A’s height, so B needs the same upward speed:', eq: 'u _y = 20 "m/s"' },
      { say: 'Then the dashed line between them stays horizontal and shrinks at B’s sideways speed. A is in the air for 4 s, so B must cover the 40 m within that time. The slowest case is to meet exactly as they land:', eq: ['u _x = [ 40 | 4 ] = 10 "m/s"', 'u = √[ 20 ^2 + 10 ^2 ] = √[ 500 ] = 22.4 "m/s"'] },
    ],
    result: '22.4 m/s (√500), fired at tan⁻¹ 2 above the horizontal. A faster sideways speed meets A earlier in the air.',
  },
  {
    id: 'aim-at-the-toy',
    level: 'jee-adv',
    topic: 'target',
    title: 'Shooting at a falling toy',
    prompt: 'A toy hangs 40 m up on a magnet, 30 m horizontally from a dart launcher at ground level. At the instant the dart is fired straight at the toy, the toy is released. What is the smallest dart speed that still hits the toy before it reaches the ground?',
    g: 10,
    kind: 'numeric',
    answer: 17.7,
    unit: 'm/s',
    tol: 0.2,
    scene: {
      throws: [
        { v: 50 / Math.sqrt(8), theta: (Math.atan2(40, 30) * 180) / Math.PI, g: 10 },
        { v: 0, theta: 0, g: 10, x0: 30, h: 40 },
      ],
      target: { x: 30, y: 40, label: 'toy' },
      link: true,
      height: 290,
    },
    steps: [
      { say: 'Without gravity the dart would run along the line of sight to the toy. Gravity pulls both down by the same $½ · g · t ^2$ at every moment, so the dart stays on that line relative to the toy, and hits it whenever it gets there in time. The line of sight is', eq: 'r = √[ 30 ^2 + 40 ^2 ] = 50 "m"' },
      { say: 'The toy reaches the ground after', eq: 't = √[ [ 2 · 40 | 10 ] ] = 2.83 "s"' },
      { say: 'The dart must cover the 50 m in that time, so the slowest case is the one where they meet at the ground:', eq: 'u = [ 50 | 2.83 ] = 17.7 "m/s"' },
    ],
    result: '17.7 m/s. At that speed the dart meets the toy just as it lands, 30 m from the launcher.',
  },
  {
    id: 'downhill-throw',
    level: 'jee-adv',
    topic: 'incline',
    title: 'Thrown sideways down a slope',
    prompt: 'From the top of a long slope that falls away at 30°, a ball is thrown horizontally at 15 m/s. How far down the slope, measured along it, does it land?',
    g: 10,
    kind: 'numeric',
    answer: 30,
    unit: 'm',
    tol: 0.3,
    scene: { throws: [{ v: 15, theta: 0, g: 10 }], incline: -30, marks: { slope: '30 m along the slope' }, height: 290 },
    steps: [
      { say: 'It lands when it has fallen exactly as far as the slope has dropped under it, which is $x · tan 30°$ at sideways distance x = 15 · t.', eq: '½ · 10 · t ^2 = 15 · t · tan 30°' },
      { eq: 't = [ 2 · 15 · tan 30° | 10 ] = 1.73 "s"' },
      { say: 'Sideways it went 15 · 1.73 = 26.0 m. Along the slope that is longer:', eq: 's = [ 26.0 | cos 30° ] = 30 "m"' },
    ],
    result: '30 m down the slope, after 1.73 s.',
  },
  {
    id: 'trolley-throw',
    level: 'jee-adv',
    topic: 'relative',
    title: 'Thrown backwards off a trolley',
    prompt: 'A trolley rolls at 6 m/s along level ground. A girl on it throws a ball at 10 m/s, 53° above the horizontal (sin 53° = 0.8), towards the back of the trolley. Treat the throw as made from ground level. How far behind her is the ball when it lands?',
    g: 10,
    kind: 'numeric',
    answer: 9.6,
    unit: 'm',
    tol: 0.1,
    scene: {
      throws: [
        { v: 8, theta: 90, g: 10 },
        { v: 6, theta: 0, g: 0, tEnd: 1.6, marker: 'ghost', label: 'trolley' },
      ],
      link: true,
      height: 260,
    },
    steps: [
      { say: 'Relative to the trolley the ball moves backwards at $10 · 0.6 = 6 "m/s"$ and upwards at 8 m/s. Add the trolley’s 6 m/s forward to see it from the ground:', eq: ['u _x = 6 − 6 = 0', 'u _y = 10 · 0.8 = 8 "m/s"'] },
      { say: 'From the ground the ball goes straight up and straight down. It is in the air for', eq: 'T = [ 2 · 8 | 10 ] = 1.6 "s"' },
      { say: 'It lands where it was thrown, while the trolley has rolled on:', eq: 'd = 6 · 1.6 = 9.6 "m"' },
    ],
    result: '9.6 m behind her.',
  },
];
