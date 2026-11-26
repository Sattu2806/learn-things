/**
 * The film: a narrated, 3Blue1Brown-style lesson on why a thrown ball draws
 * a parabola. Each beat is one line of narration with its animation. The
 * same script plays in the app (stopping at "your turn" moments) and renders
 * frame by frame to a video file.
 */
import { Film, ease, type BeatKit } from '../../film/timeline';
import { flight } from './model';

export const TITLE = 'Why does a thrown ball draw a parabola?';

/** A moment that works as the film's cover: the title card, fully faded in. */
export const POSTER = 2.4;

/** Equations in the film's maths notation (see film/math.ts). Keys let morphs move symbols. */
export const EQ = {
  y1: 'y#y =#eq v#v ·#d1 sin#sin θ#th ·#d2 t#tR',
  y: 'y#y =#eq v#v ·#d1 sin#sin θ#th ·#d2 t#tR −#minus ½#h ·#d3 g#g ·#d4 t#tD ^2#sq',
  yLinear: 'y#y =#eq v#v ·#d1 sin#sin θ#th ·#d2 t#tR −#minus ½#h ·#d3 g#g ·#d4 t#tD',
  land1: 'v#v ·#d1 sin#sin θ#th ·#d2 t#tR =#eq ½#h ·#d3 g#g ·#d4 t#tD ^2#sq',
  land2: 'v#v ·#d1 sin#sin θ#th =#eq ½#h ·#d3 g#g ·#d4 t#tD',
  land3: 't#tD =#eq [#fr 2#two ·#d5 v#v ·#d1 sin#sin θ#th | g#g ]',
  range1: 'R#R =#eq v#v ·#d1 cos#cos θ#thc ·#d2 t#tR',
  range2: 'R#R =#eq [#fr 2#two ·#d5 v#v ^2#vsq ·#d1 sin#sin θ#th ·#d6 cos#cos θ#thc | g#g ]',
  range3: 'R#R =#eq [#fr v#v ^2#vsq ·#d1 sin#sin 2#two θ#th | g#g ]',
};

export interface Brace {
  a: string;
  b: string;
  label: string;
}

export interface Copy {
  text: string;
  /** Which scene label the copy flies from. */
  from: 'comps' | 'drop';
  /** First and last token of the equation it lands on. */
  a: string;
  b: string;
}

export const DEFAULTS: Record<string, number> = {
  v: 20,
  theta: 55,
  g: 9.8,
  /** Time of the ball's flight being shown. */
  bt: 0,
  gravity: 1,
  /** 1 = the "t instead of t²" mistake. */
  linear: 0,
  tickStep: 0.5,
  /** Camera: 0 frames the parabola, 1 also frames the ghost's whole climb. */
  frame: 0,
  /** Share of the width the throw may use. */
  sceneW: 1,
  ground: 0,
  ball: 0,
  trail: 0,
  ghost: 0,
  line: 0,
  ticks: 0,
  equal: 0,
  vec: 0,
  comps: 0,
  drop: 0,
  rise: 0,
  run: 0,
  tickDrops: 0,
  ratio: 0,
  /** The dropped-ball column: 0 hidden, 1 shown. colMode 0 = beside the throw, 1 = on its own (Galileo). */
  column: 0,
  colMode: 0,
  colT: 0,
  gaps: 0,
  units: 0,
  squares: 0,
  sums: 0,
  family: 0,
  sinChart: 0,
  flash: 0,
  readout: 0,
  copy: 0,
  eq: 0,
  eqY: 168,
  eqSize: 64,
  braces: 0,
  title: 0,
  intro: 0,
  endCard: 0,
  ponder: 0,
};

export const STATE_DEFAULTS: Record<string, unknown> = {
  eq: EQ.y,
  titleCard: { num: 1, text: '' },
  prompt: '',
  dropLabel: 'drop',
  braces: [] as Brace[],
  readoutKind: 'T',
  copy: null as Copy | null,
};

const T = (k: BeatKit, at = 0) => flight(k.get('v', at), k.get('theta', at), k.get('g', at)).T;

/** Let the ball fly from the pad; returns when it lands (beat time). */
function throwBall(k: BeatKit, at: number, dur = T(k, at)) {
  k.tween('bt', dur, { at, dur, ease: ease.linear });
  return at + dur;
}

/** Fade out the last throw and put a fresh ball on the pad. */
function reset(k: BeatKit, at: number) {
  k.tween('trail', 0, { at, dur: 0.3 });
  k.tween('ball', 0, { at, dur: 0.3 });
  k.jump('bt', 0, at + 0.35);
  k.jump('trail', 1, at + 0.4);
  k.tween('ball', 1, { at: at + 0.4, dur: 0.35 });
  return at + 0.8;
}

function titleCard(k: BeatKit, num: number, text: string) {
  k.set('titleCard', { num, text });
  k.tween('title', 1, { dur: 0.6 });
  k.tween('title', 0, { at: 1.7, dur: 0.7 });
}

function sweepHighlight(k: BeatKit, keys: string[], at: number) {
  keys.forEach((key, i) => {
    k.tween(`hl:${key}`, 1, { at: at + i * 0.2, dur: 0.25 });
    k.tween(`hl:${key}`, 0, { at: at + i * 0.2 + 0.3, dur: 0.4 });
  });
}

export function buildFilm(): Film {
  const f = new Film(DEFAULTS, STATE_DEFAULTS);

  // ------------------------------------------------------------ 1. The question
  f.chapter('The question');
  f.beat(
    '',
    (k) => {
      k.tween('intro', 1, { at: 0.3, dur: 1.1 });
      k.tween('intro', 0, { at: 3.2, dur: 0.8 });
    },
    { min: 4 },
  );
  f.beat('Throw a ball, and it traces a curve.', (k) => {
    k.tween('ground', 1, { dur: 1 });
    k.tween('ball', 1, { dur: 0.5 });
    k.jump('trail', 1);
    throwBall(k, 0.5);
  });
  f.beat('Throw it faster, or at another angle, and the curve changes. But it is always the same kind of curve: a parabola.', (k) => {
    k.tween('family', 1, { at: 0.4, dur: 1.8 });
  });
  f.beat('Why that shape? Here is the equation that describes it.', (k) => {
    k.set('eq', EQ.y);
    k.tween('eq', 1, { at: 0.8, dur: 1.4 });
  });
  f.beat('It can look like a jumble of symbols. But every piece of it is a picture, and by the end you will see each one.', (k) => {
    sweepHighlight(k, ['v', 'sin', 'th', 'tR', 'h', 'g', 'tD', 'sq'], 1.2);
    k.tween('family', 0, { at: 3.4, dur: 1 });
    k.tween('eq', 0, { at: 4.4, dur: 0.8 });
    k.tween('trail', 0, { at: 4.4, dur: 0.8 });
    k.tween('ball', 0, { at: 4.4, dur: 0.8 });
  });

  // ------------------------------------------------------------ 2. Gravity off
  f.chapter('Switch off gravity');
  f.beat(
    '',
    (k) => {
      titleCard(k, 2, 'Switch off gravity');
      k.jump('gravity', 0);
      k.jump('bt', 0);
      k.tween('theta', 35, { at: 0.2, dur: 0.01 });
      k.jump('frame', 1, 0.2);
      k.set('eq', EQ.y1);
    },
    { min: 2.4 },
  );
  f.beat('Let us start somewhere simpler. Imagine switching gravity off.', (k) => {
    k.tween('ball', 1, { dur: 0.6 });
    k.jump('trail', 1);
    k.tween('vec', 1, { at: 1.4, dur: 0.9 });
  });
  f.beat('Thrown at speed v and angle theta, the ball sets off in a straight line.', (k) => {
    k.tween('vec', 0, { at: 2.6, dur: 0.6 });
    throwBall(k, 1.2, 3.4);
  });
  f.beat('Nothing pulls on it, so it never slows down, and it never turns.', (k) => {
    reset(k, 0);
    k.tween('ticks', 1, { at: 0.6, dur: 0.6 });
    throwBall(k, 0.8, 3.4);
  });
  f.beat('In every half second, it covers exactly the same distance.', (k) => {
    k.tween('equal', 1, { dur: 1.1 });
    k.wait(3.6);
  });
  f.beat(
    'So its height simply grows with time: the upward part of its speed, v sine theta, multiplied by t.',
    (k) => {
      k.tween('equal', 0, { dur: 0.6 });
      k.tween('ticks', 0, { dur: 0.6 });
      reset(k, 0);
      k.tween('comps', 1, { at: 0.8, dur: 1 });
      k.set('copy', { text: 'v sin θ', from: 'comps', a: 'v', b: 'tR' }, { at: 2.6 });
      k.tween('copy', 1, { at: 2.6, dur: 1.5 });
      k.tween('eq', 1, { at: 3.7, dur: 0.6 });
    },
    { pause: { prompt: 'Change the speed and the angle.', controls: ['v', 'theta'], hold: 2.5 } },
  );

  // ------------------------------------------------------------ 3. Gravity on
  f.chapter('Switch it back on');
  f.beat(
    '',
    (k) => {
      titleCard(k, 3, 'Switch it back on');
      k.tween('comps', 0, { dur: 0.5 });
      k.jump('gravity', 1, 0.3);
      k.jump('copy', 0, 0.3);
    },
    { min: 2.4 },
  );
  f.beat('Now switch gravity back on, but keep a ghost of the old ball, still sailing along its straight line.', (k) => {
    k.tween('ghost', 1, { dur: 0.8 });
    k.tween('line', 1, { dur: 0.8 });
    throwBall(k, 2.2);
  });
  f.beat('Watch closely. The real ball always stays directly below its ghost.', (k) => {
    reset(k, 0);
    k.tween('drop', 1, { at: 0.6, dur: 0.8 });
    throwBall(k, 1.2);
  });
  f.beat('How far below? Exactly as far as a ball you simply let go of would fall in the same time.', (k) => {
    reset(k, 0);
    k.jump('colT', 0, 0.35);
    k.tween('column', 1, { at: 0.4, dur: 0.8 });
    const land = throwBall(k, 1.6);
    k.tween('colT', land - 1.6, { at: 1.6, dur: land - 1.6, ease: ease.linear });
  });
  f.beat('A dropped ball falls one half g t squared. So that is the gap between the ball and its ghost.', (k) => {
    k.set('dropLabel', '½gt²', { at: 0.2, dur: 0.8 });
    k.set('eq', EQ.y, { at: 2.8, dur: 1.2 });
    k.set('copy', { text: '½gt²', from: 'drop', a: 'h', b: 'sq' }, { at: 2.2 });
    k.tween('copy', 1, { at: 2.2, dur: 1.6 });
    k.tween('column', 0, { at: 4.4, dur: 0.8 });
  });
  f.beat(
    'So the height is the straight line height, minus the drop.',
    (k) => {
      k.set('braces', [
        { a: 'v', b: 'tR', label: 'straight line' },
        { a: 'h', b: 'sq', label: 'drop' },
      ]);
      k.tween('braces', 1, { at: 0.3, dur: 0.8 });
      reset(k, 0);
      throwBall(k, 0.8);
      k.tween('braces', 0, { at: 3.4, dur: 0.6 });
    },
    { pause: { prompt: 'Try the Moon or Mars by changing g.', controls: ['g', 'v'], hold: 2.5 } },
  );

  // ------------------------------------------------------------ 4. Why t squared
  f.chapter('Why t squared?');
  f.beat(
    '',
    (k) => {
      titleCard(k, 4, 'Why t squared?');
      for (const p of ['drop', 'ghost', 'line', 'trail', 'ball']) k.tween(p, 0, { dur: 0.6 });
      k.jump('colMode', 1, 0.7);
      k.jump('colT', 0, 0.7);
      k.jump('bt', 0, 0.7);
    },
    { min: 2.4 },
  );
  f.beat('Here is the drop on its own: a ball let go from rest, with a flash every second.', (k) => {
    k.tween('column', 1, { dur: 0.8 });
    k.tween('colT', 4, { at: 1.6, dur: 4, ease: ease.linear });
  });
  f.beat('After one second it has fallen one unit. After two seconds, four units. After three, nine. After four, sixteen.', (k) => {
    k.tween('units', 1, { at: 0.6, dur: 3.6, ease: ease.linear });
  });
  f.beat('So in each second it falls one, then three, then five, then seven units. It keeps speeding up, so every second it falls a little further than the last.', (k) => {
    k.tween('gaps', 1, { at: 0.4, dur: 2.6, ease: ease.linear });
  });
  f.beat('And odd numbers always stack up into perfect squares.', (k) => {
    k.tween('squares', 1, { at: 0.2, dur: 0.6 });
    k.tween('squares', 2, { at: 1.0, dur: 0.7 });
    k.tween('squares', 3, { at: 1.9, dur: 0.7 });
    k.tween('squares', 4, { at: 2.8, dur: 0.7 });
    k.tween('sums', 1, { at: 1.0, dur: 2.6, ease: ease.linear });
  });
  f.beat('That square is the t squared in the formula.', (k) => {
    k.tween('eq', 1, { dur: 0.6 });
    k.tween('hl:sq', 1, { at: 1.0, dur: 0.5 });
    k.tween('hl:sq', 0, { at: 2.6, dur: 0.6 });
  });
  f.beat(
    'Pause and ponder. What if the formula had a plain t here, instead of t squared?',
    (k) => {
      k.tween('hl:sq', 1, { at: 2.4, dur: 0.4 });
      k.tween('hl:sq', 0, { at: 3.8, dur: 0.5 });
    },
    { pause: { prompt: 'What changes with t instead of t squared?', controls: ['square'], hold: 3 } },
  );
  f.beat('Then the drop would grow by the same amount every second. Nothing would bend the path, and the ball would never come back down.', (k) => {
    for (const p of ['column', 'squares', 'sums', 'units', 'gaps']) k.tween(p, 0, { dur: 0.8 });
    k.set('eq', EQ.yLinear, { at: 0.4, dur: 1 });
    k.jump('linear', 1, 0.9);
    k.jump('bt', 0, 0.9);
    k.tween('ghost', 1, { at: 1, dur: 0.6 });
    k.tween('line', 1, { at: 1, dur: 0.6 });
    k.tween('ball', 1, { at: 1, dur: 0.4 });
    k.jump('trail', 1, 1);
    throwBall(k, 1.6, 4.4);
  });

  // ------------------------------------------------------------ 5. Where it lands
  f.chapter('Where it lands');
  f.beat(
    '',
    (k) => {
      titleCard(k, 5, 'Where it lands');
      k.set('eq', EQ.y, { at: 0.2, dur: 0.9 });
      reset(k, 0.1);
      k.jump('linear', 0, 0.45);
      k.tween('theta', 40, { at: 0.5, dur: 1.2 });
    },
    { min: 2.4 },
  );
  f.beat('So when does the ball land? At the moment the drop has grown as big as the rise.', (k) => {
    k.tween('rise', 1, { dur: 0.8 });
    k.tween('drop', 1, { dur: 0.8 });
    const land = throwBall(k, 1.6);
    k.tween('flash', 1, { at: land, dur: 0.5 });
  });
  f.beat('In symbols: the rise equals the drop.', (k) => {
    k.set('eq', EQ.land1, { at: 0.3, dur: 1.4 });
  });
  f.beat('Cancel one t from each side,', (k) => {
    k.set('eq', EQ.land2, { at: 0.2, dur: 1.4 });
    k.wait(2.2);
  });
  f.beat('and out drops the time in the air.', (k) => {
    k.set('eq', EQ.land3, { at: 0.2, dur: 1.4 });
    k.set('readoutKind', 'T');
    k.tween('readout', 1, { at: 1.5, dur: 0.6 });
    k.wait(3.2);
  });
  f.beat('The distance is the sideways speed, v cosine theta, times that time.', (k) => {
    for (const p of ['readout', 'flash', 'rise', 'drop', 'ghost', 'line']) k.tween(p, 0, { dur: 0.6 });
    k.tween('frame', 0, { at: 0.4, dur: 1.4 });
    k.set('eq', EQ.range1, { at: 0.5, dur: 1.4 });
    k.tween('run', 1, { at: 1.8, dur: 0.8 });
  });
  f.beat('Put in that time, and two sine theta cosine theta folds neatly into sine two theta.', (k) => {
    k.set('eq', EQ.range2, { at: 0.2, dur: 1.4 });
    k.set('eq', EQ.range3, { at: 3.2, dur: 1.4 });
    k.set('readoutKind', 'R');
    k.tween('readout', 1, { at: 4.6, dur: 0.6 });
  });
  f.beat(
    'Sine two theta is largest at forty five degrees, so that is the angle that throws farthest. And thirty and sixty land in exactly the same spot.',
    (k) => {
      k.tween('readout', 0, { dur: 0.4 });
      k.tween('run', 0, { dur: 0.4 });
      k.jump('bt', 99, 0.3);
      k.tween('family', 1, { at: 0.4, dur: 1 });
      k.tween('sinChart', 1, { at: 0.4, dur: 1 });
      k.tween('theta', 15, { at: 1.2, dur: 1.4 });
      k.tween('theta', 75, { at: 2.8, dur: 3.2 });
      k.tween('theta', 45, { at: 6.2, dur: 1.4 });
    },
    { pause: { prompt: 'Find the angle that lands farthest.', controls: ['theta'], hold: 2.5 } },
  );

  // ------------------------------------------------------------ 6. The whole picture
  f.chapter('The whole picture');
  f.beat(
    '',
    (k) => {
      titleCard(k, 6, 'The whole picture');
      k.tween('family', 0, { dur: 0.6 });
      k.tween('sinChart', 0, { dur: 0.6 });
      k.set('eq', EQ.y, { at: 0.2, dur: 1.2 });
      reset(k, 0.3);
      k.tween('theta', 35, { at: 0.6, dur: 1.2 });
      k.tween('frame', 1, { at: 0.6, dur: 1.2 });
    },
    { min: 2.4 },
  );
  f.beat('So a thrown ball is really two simple things at once.', (k) => {
    k.tween('ghost', 1, { dur: 0.8 });
    k.tween('line', 1, { dur: 0.8 });
    k.tween('drop', 1, { at: 0.4, dur: 0.8 });
    throwBall(k, 0.8);
  });
  f.beat('A straight line, where it would go if nothing pulled on it. And a drop below that line that grows like t squared.', (k) => {
    k.set('braces', [
      { a: 'v', b: 'tR', label: 'straight line' },
      { a: 'h', b: 'sq', label: 'drop' },
    ]);
    k.tween('braces', 1, { at: 0.6, dur: 0.9 });
    reset(k, 0.1);
    throwBall(k, 1.0);
  });
  f.beat('Every parabola you have ever seen is exactly that, and nothing more.', (k) => {
    for (const p of ['braces', 'ground', 'ball', 'trail', 'ghost', 'line', 'drop', 'eq']) k.tween(p, 0, { at: 2.6, dur: 1.2 });
    k.tween('endCard', 1, { at: 3.2, dur: 1.4 });
    k.wait(6.5);
  });
  return f;
}
