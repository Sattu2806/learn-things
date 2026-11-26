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
];
