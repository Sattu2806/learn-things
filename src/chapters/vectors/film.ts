import { buildChapterFilm, ph, lerp, DEG } from '../film/engine';

/** Vectors: arrows with size and direction, adding, components and the two products. */

export const buildFilm = () =>
  buildChapterFilm({
    title: 'What is an arrow worth?',
    subtitle: 'Vectors, in two and three dimensions.',
    shots: [
      {
        title: 'Size and direction',
        say: ['Some quantities need only a number: a mass, a temperature, a time.', 'Others need a direction too. Five metres north is not five metres east.', 'We draw these as arrows. The length is the size, the arrow points the way.'],
        draw: (g, t) => {
          const a = t * 0.5;
          const L = 260 + 80 * Math.sin(t);
          g.arrow(960, 600, 960 + L * Math.cos(a), 600 - L * Math.sin(a), { label: 'A', width: 4 });
          g.circle(960, 600, 6, { fill: 1, width: 0 });
          g.text('5 kg   20 °C   3 s', 960, 880, { size: 34, alpha: 0.5 * (1 - ph(t, 4, 5)) });
        },
      },
      {
        title: 'Adding arrows',
        say: ['To add two vectors, put the tail of the second on the head of the first.', 'The sum runs from the very first tail to the very last head.', 'Walk three steps east and four north, and you end up five steps away.'],
        eq: [{ at: 7, src: '| A + B | = √[ 3 ^2 + 4 ^2 ] = 5' }],
        draw: (g, t) => {
          const o: [number, number] = [700, 780];
          const u = 90;
          const p = ph(t, 1, 3);
          g.arrow(o[0], o[1], o[0] + 3 * u, o[1], { label: 'A' });
          const bx = lerp(1300, o[0] + 3 * u, p);
          const by = lerp(780, o[1], p);
          g.arrow(bx, by, bx, by - 4 * u, { label: 'B' });
          const s = ph(t, 4, 5.5);
          g.arrow(o[0], o[1], lerp(o[0], o[0] + 3 * u, s), lerp(o[1], o[1] - 4 * u, s), { label: s > 0.9 ? 'A + B' : '', width: 4, alpha: s });
        },
      },
      {
        title: 'Components',
        say: ['Any arrow can be split into a part along x and a part along y.', 'The shadows on the two axes are A cos theta and A sin theta.', 'Adding vectors then becomes adding numbers, part by part.'],
        eq: [{ at: 4, src: 'A _x = A · cos θ  ,  A _y = A · sin θ' }],
        draw: (g, t) => {
          const ox = 700, oy = 800;
          g.axes(ox, oy, 700, 500, { x: 'x', y: 'y', alpha: 0.5 });
          const th = (35 + 15 * Math.sin(t * 0.6)) * DEG;
          const L = 420;
          const x = ox + L * Math.cos(th), y = oy - L * Math.sin(th);
          g.arrow(ox, oy, x, y, { label: 'A', width: 4 });
          const s = ph(t, 2, 3.5);
          g.line(x, y, x, oy, { alpha: 0.4 * s, dash: [8, 8] });
          g.line(x, y, ox, y, { alpha: 0.4 * s, dash: [8, 8] });
          g.arrow(ox, oy, x, oy, { alpha: s, width: 3 });
          g.arrow(ox, oy, ox, y, { alpha: s, width: 3 });
          g.arc(ox, oy, 80, 0, -th, { alpha: 0.6 });
          g.text('θ', ox + 100, oy - 20, { size: 34, font: 'italic' });
        },
      },
      {
        title: 'Dot product',
        say: ['Multiplying two vectors can give a number: the dot product.', 'It is one length times the shadow of the other on it.', 'At right angles the shadow vanishes, and the dot product is zero.'],
        eq: [{ at: 2, src: 'A · B = A · B · cos θ' }],
        draw: (g, t) => {
          const ox = 600, oy = 700;
          const th = (20 + 70 * (0.5 - 0.5 * Math.cos(t * 0.5))) * DEG;
          g.arrow(ox, oy, ox + 600, oy, { label: 'A' });
          const bx = ox + 380 * Math.cos(th), by = oy - 380 * Math.sin(th);
          g.arrow(ox, oy, bx, by, { label: 'B' });
          g.line(bx, by, bx, oy, { alpha: 0.4, dash: [8, 8] });
          g.line(ox, oy + 30, bx, oy + 30, { width: 8, alpha: 0.8 });
          g.text('shadow', (ox + bx) / 2, oy + 80, { size: 28, alpha: 0.6 });
        },
      },
      {
        title: 'Cross product',
        say: ['Or multiplying can give a new vector: the cross product.', 'It stands at right angles to both, and its size is the area of the parallelogram they make.', 'Curl the fingers of your right hand from A to B, and your thumb points along A cross B.'],
        eq: [{ at: 4, src: '| A × B | = A · B · sin θ' }],
        draw: (g, t) => {
          const ox = 820, oy = 720;
          const A: [number, number] = [380, 60];
          const B: [number, number] = [160, -180];
          const s = ph(t, 2.5, 4);
          g.path([[ox, oy], [ox + A[0], oy + A[1]], [ox + A[0] + B[0], oy + A[1] + B[1]], [ox + B[0], oy + B[1]]], { close: true, fill: 0.12 * s, alpha: 0.3 * s });
          g.arrow(ox, oy, ox + A[0], oy + A[1], { label: 'A' });
          g.arrow(ox, oy, ox + B[0], oy + B[1], { label: 'B' });
          const c = ph(t, 5, 7);
          g.arrow(ox, oy, ox, oy - 380 * c, { label: c > 0.9 ? 'A × B' : '', width: 4, alpha: c });
        },
      },
    ],
  });
