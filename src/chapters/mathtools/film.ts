import { buildChapterFilm, clamp, lerp, ph, TAU } from '../film/engine';

/** Mathematical tools: slope, derivative, area, integral and the two small-change approximations. */

const trip = (s: number) => {
  const segs = [
    { t0: 0, t1: 3, x0: 0, x1: 12 },
    { t0: 3, t1: 5, x0: 12, x1: 12 },
    { t0: 5, t1: 8, x0: 12, x1: 6 },
  ];
  const g = segs.find((q) => s <= q.t1) ?? segs[2];
  return lerp(g.x0, g.x1, clamp((s - g.t0) / (g.t1 - g.t0)));
};

export const buildFilm = () =>
  buildChapterFilm({
    title: 'What maths does physics need?',
    subtitle: 'Slopes, areas and small changes.',
    shots: [
      {
        title: 'Slope is a rate',
        say: [
          'Watch a car drive out, wait, and drive back, while we plot where it is against time.',
          'The slope of that graph is the velocity: steep and positive going out, flat while waiting, negative coming back.',
          'And the slope of a velocity graph is the acceleration.',
        ],
        eq: [
          { at: 3, src: 'v = [ Δ x | Δ t ]' },
          { at: 9, src: 'a = [ Δ v | Δ t ]' },
        ],
        draw: (g, t) => {
          const s = clamp((t - 1) / 11) * 8;
          const x = trip(s);
          const ox = 560, oy = 880, sx = 100, sy = 28;
          g.ground(520, 420, 1400, 420, 0.5);
          g.block(520 + x * 73, 380, 100, 56);
          g.axes(ox, oy, 880, 400, { x: 't', y: 'x', alpha: 0.6 });
          const pts: [number, number][] = [];
          for (let i = 0; i <= 80; i++) pts.push([ox + ((i / 80) * s) * sx, oy - trip((i / 80) * s) * sy]);
          g.path(pts, { width: 4 });
          g.ball(ox + s * sx, oy - x * sy, 14);
          const v = s <= 3 ? 4 : s <= 5 ? 0 : -2;
          g.text(`slope = ${v.toFixed(0)} m/s`, 1500, 640, { size: 40, font: 'mono', alpha: ph(t, 1.5, 2.5) * 0.8, align: 'left' });
        },
      },
      {
        title: 'From secant to derivative',
        say: [
          'For a curve the slope changes from point to point.',
          'Join two points with a line and slide the second one in toward the first.',
          'The line settles onto the tangent, and its slope is the derivative.',
        ],
        eq: [
          { at: 2.5, src: '[ Δ y | Δ x ] = 2 · x + Δ x' },
          { at: 9, src: '[ d y | d x ] = 2 · x' },
        ],
        draw: (g, t) => {
          const ox = 640, oy = 880, sx = 230, sy = 62;
          const f = (x: number) => x * x;
          g.axes(ox, oy, 760, 520, { x: 'x', y: 'y', alpha: 0.6 });
          g.curve((px) => oy - f((px - ox) / sx) * sy, ox, ox + sx * 3.4, { alpha: 0.7, width: 3 });
          const x1 = 1;
          const h = 1.7 * Math.exp(-3.6 * ph(t, 1.5, 9));
          const x2 = x1 + h;
          const sl = (f(x2) - f(x1)) / h;
          const L = (x: number) => f(x1) + sl * (x - x1);
          g.line(ox + sx * 0.7, oy - L(0.7) * sy, ox + sx * 2.7, oy - L(2.7) * sy, { width: 4 });
          g.line(ox + sx * 0.6, oy - (1 + 2 * (0.6 - 1)) * sy, ox + sx * 2.5, oy - (1 + 2 * 1.5) * sy, { alpha: 0.5, dash: [12, 10] });
          g.ball(ox + sx * x1, oy - f(x1) * sy, 12);
          g.ball(ox + sx * x2, oy - f(x2) * sy, 12);
          g.text(`slope = ${sl.toFixed(2)}`, 1560, 520, { size: 44, font: 'mono', alpha: 0.85, align: 'left' });
        },
      },
      {
        title: 'Calculus in motion',
        say: [
          'Throw a ball up. Its height is a parabola in time.',
          'The slope of the height graph is the velocity, falling steadily as the ball slows.',
          'The slope of the velocity graph is the acceleration: minus ten, all the way through, even at the top.',
        ],
        eq: [
          { at: 2, src: 'y = 20 · t − 5 · t ^2' },
          { at: 6.5, src: 'v = [ d y | d t ] = 20 − 10 · t' },
          { at: 11, src: 'a = [ d v | d t ] = − 10' },
        ],
        draw: (g, t) => {
          const s = 4 * ph(t, 1, 13);
          const yv = 20 * s - 5 * s * s, vv = 20 - 10 * s;
          g.ground(200, 880, 340, 880, 0.6);
          g.ball(270, 860 - yv * 22, 18);
          const g1x = 520, g1y = 880, g2x = 1180, g2y = 640;
          g.axes(g1x, g1y, 520, 420, { x: 't', y: 'y', alpha: 0.55 });
          g.curve((px) => g1y - (20 * ((px - g1x) / 125) - 5 * ((px - g1x) / 125) ** 2) * 18, g1x, g1x + 500, { alpha: 0.45, width: 3 });
          const ex = g1x + s * 125, ey = g1y - yv * 18;
          const slopePx = (-vv * 18) / 125;
          const len = 90 / Math.sqrt(1 + slopePx * slopePx);
          g.line(ex - len, ey - slopePx * len, ex + len, ey + slopePx * len, { width: 4 });
          g.ball(ex, ey, 11);
          g.axes(g2x, g2y, 520, 250, { x: 't', y: 'v', alpha: 0.55, down: 230 });
          g.line(g2x, g2y - 20 * 11, g2x + 500, g2y + 20 * 11 * 0 + (20 - 10 * 4) * -11, { alpha: 0.6, width: 3 });
          g.ball(g2x + s * 125, g2y - vv * 11, 11);
        },
      },
      {
        title: 'Area is an integral',
        say: [
          'Now the reverse: how much has accumulated?',
          'Cut the area under a curve into strips, and add up the rectangles.',
          'Thinner strips give a better answer, and in the limit the sum becomes an integral.',
        ],
        eq: [
          { at: 2, src: '"area" ≈ Σ f ( x _i ) · Δ x' },
          { at: 8, src: '"area" = ∫ _a ^b f ( x ) · d x' },
          { at: 13, src: '∫ _0 ^3 x ^2 · d x = 9' },
        ],
        draw: (g, t) => {
          const ns = [2, 4, 8, 16, 32];
          const k = clamp(Math.floor((t - 1.5) / 2.6), 0, 4);
          const n = ns[k];
          const ox = 620, oy = 880, sx = 270, sy = 62;
          g.axes(ox, oy, 900, 560, { x: 'x', y: 'y', alpha: 0.6 });
          const dx = 3 / n;
          let sum = 0;
          for (let i = 0; i < n; i++) {
            const xm = (i + 0.5) * dx;
            sum += xm * xm * dx;
            g.rect(ox + i * dx * sx, oy - xm * xm * sy, dx * sx, xm * xm * sy, { fill: 0.15, alpha: n > 8 ? 0.5 : 0.8, width: n > 8 ? 1.5 : 2.5 });
          }
          g.curve((px) => oy - ((px - ox) / sx) ** 2 * sy, ox, ox + 3 * sx, { width: 4 });
          g.text(`n = ${n}   area ≈ ${sum.toFixed(3)}`, 1500, 520, { size: 40, font: 'mono', alpha: 0.85, align: 'left' });
        },
      },
      {
        title: 'The small-angle approximation',
        say: [
          'Close to a point, a smooth curve looks like its tangent line.',
          'For an angle measured in radians, the arc, the sine and the tangent almost coincide.',
          'So sine of theta is about theta, and cosine is about one minus theta squared over two.',
        ],
        eq: [
          { at: 2, src: 'sin θ ≈ θ' },
          { at: 8, src: 'cos θ ≈ 1 − [ θ ^2 | 2 ]' },
        ],
        draw: (g, t) => {
          const th = (3 + 37 * (0.5 - 0.5 * Math.cos((TAU * (t - 1)) / 14))) * (Math.PI / 180);
          const cx = 600, cy = 800, R = 440;
          const px = cx + R * Math.cos(th), py = cy - R * Math.sin(th);
          g.arrow(cx - 30, cy, cx + R + 160, cy, { alpha: 0.5, width: 2 });
          g.arc(cx, cy, R, -th, 0, { width: 5 });
          g.line(cx, cy, px, py, { alpha: 0.5 });
          g.line(px, py, px, cy, { alpha: 0.9, dash: [10, 8] });
          g.line(cx + R, cy, cx + R, cy - R * Math.tan(th), { alpha: 0.5, dash: [10, 8] });
          g.ball(px, py, 12);
          g.text(`θ = ${((th * 180) / Math.PI).toFixed(0)}°`, 1420, 560, { size: 44, font: 'mono', alpha: 0.85, align: 'left' });
          g.text(`sin θ = ${Math.sin(th).toFixed(3)}`, 1420, 630, { size: 40, font: 'mono', alpha: 0.7, align: 'left' });
          g.text(`θ = ${th.toFixed(3)} rad`, 1420, 695, { size: 40, font: 'mono', alpha: 0.7, align: 'left' });
        },
      },
      {
        title: 'The binomial approximation',
        say: [
          'The same tangent-line idea works for a power of a number near one.',
          'One plus x to the n is about one plus n x, when x is small.',
          'Near zero the curve and the line are indistinguishable; far out they part company.',
        ],
        eq: [
          { at: 2, src: '( 1 + x ) ^n ≈ 1 + n · x' },
          { at: 9, src: '√[ 1 + x ] ≈ 1 + [ x | 2 ]' },
        ],
        draw: (g, t) => {
          const ox = 960, oy = 800, sx = 420, sy = 220;
          const xlo = -0.8, xhi = 1.2;
          g.line(ox + xlo * sx - 40, oy, ox + xhi * sx + 40, oy, { alpha: 0.5 });
          g.line(ox, oy + 20, ox, oy - 3 * sy + 40, { alpha: 0.5 });
          g.curve((px) => oy - Math.sqrt(1 + (px - ox) / sx) * sy, ox + xlo * sx + 8, ox + xhi * sx, { width: 4 });
          g.line(ox + xlo * sx, oy - (1 + 0.5 * xlo) * sy, ox + xhi * sx, oy - (1 + 0.5 * xhi) * sy, { alpha: 0.6, dash: [14, 10] });
          const xs = lerp(-0.7, 1.15, 0.5 - 0.5 * Math.cos(TAU * ph(t, 1, 14) * 0.75));
          const ex = Math.sqrt(1 + xs), ap = 1 + 0.5 * xs;
          g.line(ox + xs * sx, oy - ap * sy, ox + xs * sx, oy - ex * sy, { width: 4 });
          g.ball(ox + xs * sx, oy - ex * sy, 12);
          g.circle(ox + xs * sx, oy - ap * sy, 12, { width: 3 });
          g.text(`x = ${xs.toFixed(2)}   error ${((Math.abs(ap - ex) / ex) * 100).toFixed(1)} %`, 960, 900, { size: 38, font: 'mono', alpha: 0.8 });
        },
      },
    ],
  });
