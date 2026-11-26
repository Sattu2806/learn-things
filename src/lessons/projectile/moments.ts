/**
 * Moments in the film that the theory page links to, named by how their
 * narration starts. A test checks that each one is still in the film.
 */
export const MOMENTS = {
  straight: 'Thrown at speed v and angle theta',
  upward: 'So its height simply grows with time',
  minusDrop: 'So the height is the straight line height',
  squares: 'After one second it has fallen one unit',
  linear: 'Then the drop would grow by the same amount',
  land: 'So when does the ball land?',
  time: 'and out drops the time in the air',
  range: 'The distance is the sideways speed',
  best: 'Sine two theta is largest',
  whole: 'A straight line, where it would go',
} as const;

export type Moment = keyof typeof MOMENTS;
