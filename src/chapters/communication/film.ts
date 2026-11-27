import { buildChapterFilm, ph, TAU, lerp, type Gfx } from '../film/engine';

/** Communication systems: the parts of a system, carriers, AM and FM, three kinds of radio wave, and bits. */

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** A scrolling wave drawn as a path between x0 and x1. */
function trace(g: Gfx, x0: number, x1: number, f: (x: number) => number, o: { alpha?: number; width?: number; dash?: number[] } = {}) {
  const pts: [number, number][] = [];
  for (let x = x0; x <= x1; x += 2) pts.push([x, f(x)]);
  g.path(pts, { alpha: 0.9, width: 3, ...o });
}

// Earth and ionosphere for the radio-wave shot.
const RF = 2200;
const CYF = 3000;
const gyf = (x: number) => CYF - Math.sqrt(RF * RF - (x - 960) ** 2);
const ionf = (x: number) => CYF - Math.sqrt((RF + 260) ** 2 - (x - 960) ** 2);

export const buildFilm = () =>
  buildChapterFilm({
    title: 'How does a voice cross the world?',
    subtitle: 'Communication systems, from carriers to bits.',
    shots: [
      {
        title: 'The parts of a system',
        say: [
          'Every communication system has the same parts: a source, a transmitter, a channel, a receiver and a user.',
          'Noise creeps in along the channel and spoils the signal a little.',
          'The range of frequencies a signal needs is its bandwidth: the highest frequency minus the lowest.',
        ],
        eq: [{ at: 8, src: 'BW = f _max − f _min' }],
        draw: (g, t) => {
          const names = ['source', 'transmitter', 'channel', 'receiver', 'user'];
          const xs = [220, 570, 960, 1350, 1700];
          const p = ph(t, 1, 8);
          const px = 120 + 1680 * p;
          names.forEach((n, i) => {
            const inside = Math.abs(px - xs[i]) < 140;
            g.rect(xs[i] - 140, 560, 280, 110, { alpha: inside ? 1 : 0.55, fill: inside ? 0.25 : 0.06 });
            g.text(n, xs[i], 628, { size: 36, alpha: inside ? 1 : 0.7 });
            if (i < 4) g.arrow(xs[i] + 150, 615, xs[i + 1] - 150, 615, { alpha: 0.4, width: 2.5, head: 16 });
          });
          // Noise over the channel.
          const f = Math.floor(t * 12);
          const pts: [number, number][] = [];
          for (let x = 840; x <= 1080; x += 6) pts.push([x, 450 + 16 * (hash(Math.floor(x / 6) + f * 97) - 0.5) * 2]);
          g.path(pts, { alpha: 0.6, width: 2.5 });
          g.text('noise', 960, 400, { size: 32, alpha: 0.7 });
          g.ball(px, 500 + (px > 1100 ? 6 * Math.sin(t * 20) : 0), 14);
          // Bandwidth bar.
          const a = ph(t, 8, 9);
          g.arrow(600, 860, 1320, 860, { alpha: a * 0.7, width: 2.5 });
          g.arrow(1320, 860, 600, 860, { alpha: a * 0.7, width: 2.5 });
          g.text('bandwidth', 960, 920, { size: 34, alpha: a * 0.8 });
        },
      },
      {
        title: 'Why a carrier?',
        say: [
          'Speech is at about 3 kilohertz. Its wavelength is a hundred kilometres, and a good antenna is a quarter of that.',
          'So we put the message on a carrier wave of much higher frequency.',
          'At 1 megahertz the antenna is 75 metres. At 100 megahertz it is less than a metre.',
        ],
        eq: [
          { at: 3, src: 'λ = [ c | f ]' },
          { at: 9, src: 'l = [ λ | 4 ]' },
        ],
        draw: (g, t) => {
          const items = [
            { name: '3 kHz', len: '25 km', h: 400 },
            { name: '1 MHz', len: '75 m', h: 210 },
            { name: '100 MHz', len: '0.75 m', h: 70 },
          ];
          items.forEach((it, i) => {
            const cx = 400 + i * 560;
            const gy = 820;
            const a = ph(t, 0.5 + i * 1.5, 1.5 + i * 1.5);
            g.ground(cx - 240, gy, cx + 240, gy, 0.7 * a);
            g.line(cx, gy, cx, gy - it.h * a, { width: 5 });
            const lam = 4 * it.h;
            const r0 = (90 * t) % lam;
            for (let k = 0; r0 + k * lam < 230; k++) {
              const r = r0 + k * lam;
              if (r > 8) g.arc(cx, gy - it.h, r, Math.PI, 0, { alpha: a * (1 - r / 240) * 0.7, width: 2 });
            }
            g.ball(cx, gy - it.h * a, 10, a);
            g.text(it.name, cx, gy + 60, { size: 34, font: 'mono', alpha: a * 0.8 });
            g.text(`antenna ${it.len}`, cx, gy + 106, { size: 32, alpha: a * 0.7 });
          });
        },
      },
      {
        title: 'Amplitude modulation',
        say: [
          'In amplitude modulation, the height of the carrier is made to follow the message.',
          'The shape traced by the tops of the waves, the envelope, is the message itself.',
          'The ratio of the message height to the carrier height is the modulation index. Keep it below one.',
        ],
        eq: [
          { at: 3, src: 'c _m ( t ) = ( A _c + A _m · sin ( ω _m · t ) ) · sin ( ω _c · t )' },
          { at: 10, src: 'μ = [ A _m | A _c ]' },
        ],
        draw: (g, t) => {
          const x0 = 280;
          const x1 = 1800;
          const u = (x: number) => (x - x0) / 260 + t * 0.9;
          const msg = (x: number) => Math.sin(TAU * 0.6 * u(x));
          const mu = 0.6;
          g.text('message', 150, 420, { size: 32, alpha: 0.7 });
          trace(g, x0, x1, (x) => 410 - 70 * msg(x));
          g.text('carrier', 150, 600, { size: 32, alpha: 0.7 * ph(t, 4, 5) });
          trace(g, x0, x1, (x) => 590 - 70 * Math.sin(TAU * 6 * u(x)), { alpha: 0.5 * ph(t, 4, 5), width: 2 });
          const a = ph(t, 6, 7);
          g.text('AM wave', 150, 830, { size: 32, alpha: 0.7 * a });
          const A = 70 / 1.6;
          trace(g, x0, x1, (x) => 820 - A * (1 + mu * msg(x)) * Math.sin(TAU * 6 * u(x)), { alpha: a });
          trace(g, x0, x1, (x) => 820 - A * (1 + mu * msg(x)), { alpha: 0.4 * a, width: 2, dash: [10, 8] });
          trace(g, x0, x1, (x) => 820 + A * (1 + mu * msg(x)), { alpha: 0.4 * a, width: 2, dash: [10, 8] });
        },
      },
      {
        title: 'Frequency modulation',
        say: [
          'In frequency modulation the height stays fixed, and the message changes how closely the waves are spaced.',
          'Most noise changes the height of a wave, so FM can clip it off and lose nothing.',
          'The price is a wider channel, about twice the sum of the frequency swing and the message frequency.',
        ],
        eq: [
          { at: 3, src: 'f = f _c + k · m ( t )' },
          { at: 10, src: 'BW ≈ 2 · ( Δf + f _m )' },
        ],
        draw: (g, t) => {
          const x0 = 280;
          const x1 = 1800;
          const u = (x: number) => (x - x0) / 260 + t * 0.9;
          g.text('message', 150, 420, { size: 32, alpha: 0.7 });
          trace(g, x0, x1, (x) => 410 - 70 * Math.sin(TAU * 0.6 * u(x)));
          const a = ph(t, 3, 4);
          g.text('FM wave', 150, 700, { size: 32, alpha: 0.7 * a });
          trace(g, x0, x1, (x) => 690 - 70 * Math.sin(TAU * 5 * u(x) - 4 * Math.cos(TAU * 0.6 * u(x))), { alpha: a });
          g.line(x0, 620, x1, 620, { alpha: 0.3 * a, dash: [10, 8], width: 2 });
          g.line(x0, 760, x1, 760, { alpha: 0.3 * a, dash: [10, 8], width: 2 });
          const n = ph(t, 7, 8);
          if (n > 0) {
            const spike = (x: number) => {
              const k = Math.floor(u(x) * 3);
              return hash(k) > 0.6 ? (hash(k + 50) - 0.5) * 2.4 : 0;
            };
            trace(g, x0, x1, (x) => 880 - 50 * Math.max(-1, Math.min(1, Math.sin(TAU * 5 * u(x) - 4 * Math.cos(TAU * 0.6 * u(x))) + spike(x))), { alpha: n * 0.8, width: 2.5 });
            g.text('noise spikes clipped off', 960, 960, { size: 30, alpha: n * 0.6 });
          }
        },
      },
      {
        title: 'Ground, sky and space',
        say: [
          'A ground wave follows the curve of the Earth, but it fades quickly. It carries medium wave stations.',
          'A sky wave goes up to the ionosphere and is bent back down, far beyond the horizon. Short waves travel this way.',
          'Very high frequencies pass straight through the ionosphere. They go in straight lines, so the range is only to the horizon, unless a satellite relays them.',
        ],
        eq: [
          { at: 3, src: 'd = √[ 2 · R · h ]' },
          { at: 12, src: 'f _c = 9 · √[ N _max ]' },
        ],
        draw: (g, t) => {
          g.curve(gyf, 0, 1920, { alpha: 0.9, width: 4, n: 300 });
          g.curve(ionf, 0, 1920, { alpha: 0.35, width: 2.5, n: 300 });
          g.text('ionosphere', 960, ionf(960) - 22, { size: 32, alpha: 0.6 });
          const ax = 300;
          const ay = gyf(ax) - 90;
          g.line(ax, gyf(ax), ax, ay, { width: 5 });
          g.line(ax - 14, ay, ax + 14, ay, { width: 5 });
          const rp = (t * 1.2) % 1;
          g.circle(ax, ay, 14 + 50 * rp, { alpha: 1 - rp, width: 2.5 });
          // Ground wave.
          const gp = ph(t, 1, 5);
          const gx = ax + 700 * gp;
          g.ball(gx, gyf(gx) - 12, 14, 1 - ph(t, 4, 6));
          g.text('ground wave: fades', 640, gyf(640) + 70, { size: 32, alpha: 0.7 * ph(t, 3, 4) });
          // Sky wave.
          const top: [number, number] = [830, ionf(830) + 4];
          const end: [number, number] = [1350, gyf(1350)];
          g.path([[ax, ay], top, end], { alpha: 0.35 * ph(t, 5, 6), width: 2.5, dash: [10, 10] });
          const s1 = Math.hypot(top[0] - ax, top[1] - ay);
          const s2 = Math.hypot(end[0] - top[0], end[1] - top[1]);
          const s = ph(t, 5, 10) * (s1 + s2);
          if (t > 5) {
            const b: [number, number] = s < s1 ? [lerp(ax, top[0], s / s1), lerp(ay, top[1], s / s1)] : [lerp(top[0], end[0], (s - s1) / s2), lerp(top[1], end[1], (s - s1) / s2)];
            g.ball(b[0], b[1], 14);
          }
          g.line(1350, gyf(1350), 1350, gyf(1350) - 60, { width: 4, alpha: ph(t, 5, 6) });
          g.text('sky wave', 1100, 780, { size: 32, alpha: 0.7 * ph(t, 8, 9) });
        },
      },
      {
        title: 'Bits',
        say: [
          'To send a wave as a digital signal, we measure it many times a second. This is sampling.',
          'Each measurement is rounded to one of a fixed number of levels, and the level number is sent as a string of bits.',
          'Three bits give eight levels, and so on. The bits are only ones and zeros, so noise on the way can be wiped away.',
        ],
        eq: [
          { at: 3, src: 'N = 2 ^n' },
          { at: 9, src: 'R = f _s · n' },
        ],
        draw: (g, t) => {
          const x0 = 260;
          const x1 = 1100;
          const top = 380;
          const bot = 860;
          const step = (bot - top) / 8;
          const wv = (x: number) => (top + bot) / 2 - ((bot - top) / 2) * 0.96 * Math.sin(TAU * ((x - x0) / 420));
          for (let k = 0; k <= 8; k++) g.line(x0, bot - k * step, x1, bot - k * step, { alpha: 0.18, width: 2 });
          trace(g, x0, x1, wv, { alpha: 0.5, width: 3 });
          const sx = x0 + (x1 - x0) * ph(t, 1, 12);
          const v = Math.sin(TAU * ((sx - x0) / 420));
          const level = Math.max(0, Math.min(7, Math.floor(((v + 1) / 2) * 8)));
          const bits = level.toString(2).padStart(3, '0');
          const yl = bot - (level + 0.5) * step;
          g.line(sx, wv(sx), sx, yl, { alpha: 0.6, width: 2.5 });
          g.ball(sx, wv(sx), 12);
          g.circle(sx, yl, 12, { alpha: 0.8 });
          // Samples so far.
          for (let x = x0; x <= sx; x += 60) g.circle(x, wv(x), 6, { fill: 1, width: 0 });
          g.line(sx, yl, 1280, yl, { alpha: 0.3, dash: [8, 8], width: 2 });
          g.text(`level ${level}`, 1560, 420, { size: 38, alpha: 0.8 });
          for (let i = 0; i < 3; i++) {
            const bx = 1400 + i * 110;
            const hi = bits[i] === '1';
            g.line(bx, hi ? 540 : 620, bx + 110, hi ? 540 : 620, { width: 5 });
            g.line(bx, 540, bx, 620, { alpha: 0.3, dash: [6, 6], width: 2 });
            g.text(bits[i], bx + 55, 510, { size: 34, font: 'mono', alpha: 0.8 });
          }
          g.text(bits, 1565, 760, { size: 60, font: 'mono', alpha: 0.9 });
          g.text('3 bits: 8 levels', 1565, 830, { size: 32, alpha: 0.6 });
        },
      },
    ],
  });
