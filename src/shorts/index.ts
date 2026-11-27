import { DURATION as circleDuration, LINES as circleLines, drawCircleShort } from './circle';
import { DURATION as triangleDuration, LINES as triangleLines, drawTriangleShort } from './triangle';
import { DURATION as oddsDuration, LINES as oddsLines, drawOddsShort } from './odds';
import { DURATION as pythDuration, LINES as pythLines, drawPythagorasShort } from './pythagoras';

export interface Line {
  text: string;
  dur: number;
  start: number;
  end: number;
}

export interface Short {
  id: string;
  title: string;
  duration: number;
  lines: Line[];
  draw: (ctx: CanvasRenderingContext2D, t: number) => void;
  /** Download name, without extension. */
  file: string;
}

export const SHORTS: Short[] = [
  { id: 'circle', title: 'Area of a circle', duration: circleDuration, lines: circleLines, draw: drawCircleShort, file: 'circle-short' },
  { id: 'triangle', title: 'Angles of a triangle', duration: triangleDuration, lines: triangleLines, draw: drawTriangleShort, file: 'triangle-short' },
  { id: 'odds', title: 'Odd numbers make squares', duration: oddsDuration, lines: oddsLines, draw: drawOddsShort, file: 'odds-short' },
  { id: 'pythagoras', title: 'Pythagoras', duration: pythDuration, lines: pythLines, draw: drawPythagorasShort, file: 'pythagoras-short' },
];

export const SHORT_SIZE = { width: 1080, height: 1920 };

/** The short named in `#/shorts/<id>`, or the first. */
export function shortFromHash(hash = window.location.hash): Short {
  const m = /^#\/shorts\/([a-z0-9-]+)/.exec(hash);
  return SHORTS.find((s) => s.id === m?.[1]) ?? SHORTS[0];
}
