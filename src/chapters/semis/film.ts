import { buildChapterFilm, ph, type Gfx } from '../film/engine';

/** Semiconductors: bands, doping, the junction and the devices built on it. */

const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const hole = (g: Gfx, x: number, y: number, a = 1) => g.circle(x, y, 13, { alpha: a, width: 2.5 });
const elec = (g: Gfx, x: number, y: number, a = 1) => g.circle(x, y, 9, { fill: 1, alpha: a, width: 0 });

export const buildFilm = () =>
  buildChapterFilm({
    title: 'How does a crystal learn to switch current?',
    subtitle: 'Semiconductors, doping and the p-n junction.',
    shots: [
      {
        title: 'Bands and gaps',
        say: [
          'In a crystal the electron energies spread into bands, with forbidden gaps between them.',
          'Electrons in the full valence band cannot carry current. Those in the conduction band can.',
          'In a metal the bands overlap. In an insulator the gap is huge. A semiconductor has a small gap that heat can just cross.',
        ],
        eq: [
          { at: 3, src: 'E _g = E _C − E _V' },
          { at: 9, src: 'E _g ( "Si" ) = 1.1 "eV"' },
        ],
        draw: (g, t) => {
          const cols = [
            { x: 420, gap: -40, name: 'conductor' },
            { x: 960, gap: 100, name: 'semiconductor' },
            { x: 1500, gap: 260, name: 'insulator' },
          ];
          cols.forEach((c, i) => {
            const vb = 800;
            const cb = vb - c.gap;
            g.rect(c.x - 150, cb - 140, 300, 140, { alpha: 0.7 * ph(t, 0.5 + i * 0.4, 1.5 + i * 0.4) });
            g.rect(c.x - 150, vb, 300, 110, { alpha: 0.7, fill: 0.1 });
            for (let k = 0; k < 8; k++) elec(g, c.x - 126 + k * 36, vb + 60 + 8 * Math.sin(2 * t + k));
            g.text(c.name, c.x, 980, { size: 34, alpha: 0.7 });
            if (i === 0) for (let k = 0; k < 6; k++) elec(g, c.x - 130 + ((k * 52 + 90 * t) % 260), cb - 70 + 30 * Math.sin(k * 2 + 2 * t));
            if (i === 1)
              for (let k = 0; k < 3; k++) {
                const T = (t + k * 2.2) % 7;
                const up = ph(T, 1, 2.2) * (1 - ph(T, 4.8, 5.8));
                if (T > 0.5) {
                  elec(g, c.x - 70 + k * 70, vb + 55 + (cb - 60 - vb - 55) * up);
                  if (up > 0.9) hole(g, c.x - 70 + k * 70, vb + 35);
                }
              }
          });
          g.text('conduction band', 960, 560, { size: 28, alpha: 0.5 * ph(t, 5, 6) });
        },
      },
      {
        title: 'Doping',
        say: [
          'Pure silicon has few free carriers. Add one atom in a million of something else and everything changes.',
          'A phosphorus atom brings a spare electron, giving an n-type crystal. A boron atom leaves a hole, giving a p-type crystal.',
          'The crystal stays neutral, but now there are many free carriers of one sign.',
        ],
        eq: [
          { at: 3, src: 'n _e = n _h = n _i' },
          { at: 8, src: 'n _e · n _h = n _i ^2' },
        ],
        draw: (g, t) => {
          // Two rows of atoms: n-type above, p-type below.
          const rows = [{ y: 520, kind: 'n' }, { y: 800, kind: 'p' }];
          rows.forEach((r, ri) => {
            const a = ph(t, 0.5 + ri * 0.5, 1.5 + ri * 0.5);
            for (let i = 0; i < 9; i++) {
              const x = 360 + i * 150;
              const dop = i === 4;
              g.circle(x, r.y, 36, { alpha: (dop ? 0.95 : 0.4) * a, width: dop ? 4 : 2.5 });
              g.text(dop ? (r.kind === 'n' ? 'P' : 'B') : 'Si', x, r.y + 10, { size: 30, alpha: a });
              if (i < 8) {
                g.line(x + 36, r.y, x + 114, r.y, { alpha: 0.3 * a });
                elec(g, x + 66, r.y - 8, a);
                elec(g, x + 84, r.y - 8, a);
              }
            }
            if (r.kind === 'n') {
              const e = ph(t, 4, 9);
              const x = 960 - 600 * e + (e === 0 ? 50 * Math.cos(3 * t) : 0);
              const y = e === 0 ? r.y + 50 * Math.sin(3 * t) : r.y - 90;
              elec(g, x, y, a);
              g.text('+', 960, r.y - 60, { size: 44, alpha: ph(t, 4, 5) });
            } else {
              const hx = 960 + 120 + 450 * ph(t, 4, 9);
              hole(g, hx, r.y - 8, a);
              g.text('−', 960, r.y - 60, { size: 44, alpha: ph(t, 4, 5) });
            }
          });
          g.text('n-type: spare electron', 1600, 500, { size: 30, alpha: 0.6 * ph(t, 3, 4), align: 'right' });
          g.text('p-type: a hole', 1600, 780, { size: 30, alpha: 0.6 * ph(t, 3, 4), align: 'right' });
        },
      },
      {
        title: 'The p-n junction',
        say: [
          'Put p-type beside n-type. Electrons and holes diffuse across and cancel each other near the boundary.',
          'That leaves behind fixed ions, positive on the n side and negative on the p side, a depletion region with no free carriers.',
          'Their field points back and stops the diffusion. The barrier is about 0.7 volts for silicon.',
        ],
        eq: [{ at: 7, src: 'V _0 ≈ 0.7 "V"' }],
        draw: (g, t) => {
          const cx = 960;
          const y0 = 460;
          const y1 = 820;
          const grow = ph(t, 1.5, 7);
          const w = 110 * grow;
          g.rect(300, y0, cx - 300, y1 - y0, { alpha: 0.6 });
          g.rect(cx, y0, 1620 - cx, y1 - y0, { alpha: 0.6 });
          g.rect(cx - w, y0 + 2, 2 * w, y1 - y0 - 4, { alpha: 0.07 * grow, fill: 1, width: 0 });
          for (let i = 0; i < 24; i++) {
            const gx = 340 + (i % 8) * 70;
            const gy = y0 + 50 + Math.floor(i / 8) * 110 + (i % 2) * 22;
            if (gx < cx - w - 20) hole(g, gx + 8 * Math.sin(1.3 * t + i), gy + 8 * Math.cos(1.1 * t + i * 2), 0.9);
            const ex = cx + 60 + (i % 8) * 70;
            if (ex > cx + w + 20) elec(g, ex + 8 * Math.sin(1.2 * t + i * 3), gy + 8 * Math.cos(1.4 * t + i), 0.9);
          }
          if (t < 7)
            for (let k = 0; k < 3; k++) {
              const s = (t * 0.4 + k / 3) % 1;
              elec(g, cx + 100 - 220 * s, y0 + 100 + k * 100, 0.9 * (1 - grow * 0.7));
              hole(g, cx - 100 + 220 * s, y0 + 150 + k * 90, 0.9 * (1 - grow * 0.7));
            }
          for (let k = 0; k < 3; k++) {
            g.text('−', cx - w * 0.6, y0 + 100 + k * 110, { size: 44, alpha: ph(t, 3, 5) });
            g.text('+', cx + w * 0.6, y0 + 100 + k * 110, { size: 44, alpha: ph(t, 3, 5) });
          }
          const f = ph(t, 6, 8);
          g.arrow(cx + 90, y1 + 50, cx - 90, y1 + 50, { alpha: f, label: 'E' });
          g.text('p', 470, y0 - 20, { size: 42, font: 'italic' });
          g.text('n', 1450, y0 - 20, { size: 42, font: 'italic' });
        },
      },
      {
        title: 'The diode',
        say: [
          'Connect a battery with the positive side to p. That lowers the barrier, the depletion region shrinks, and current pours through.',
          'Turn the battery round and the barrier grows. Almost nothing flows.',
          'So a diode lets current pass one way only, with a threshold near point seven volts.',
        ],
        eq: [{ at: 3, src: 'I ≈ 0 "for" V < 0.7 "V"' }],
        draw: (g, t) => {
          const ox = 560;
          const oy = 700;
          g.axes(ox, oy, 760, 380, { x: 'V', y: 'I', alpha: 0.6, down: 150 });
          const f = (v: number) => (v >= 0 ? Math.min(1, 0.9 * Math.exp((v - 0.95) / 0.07)) : -0.04 * (1 - Math.exp(v * 3)));
          const sx = (v: number) => (v >= 0 ? v * 600 : v * 80);
          const head = ph(t, 0.5, 9);
          const v = -3 + 4 * head;
          g.curve((x) => {
            const vv = x >= ox ? (x - ox) / 600 : (x - ox) / 80;
            return oy - f(vv) * 330;
          }, ox + sx(-3), ox + sx(v), { alpha: 0.9, n: 300 });
          g.ball(ox + sx(v), oy - f(v) * 330, 12);
          g.line(ox + 420, oy - 12, ox + 420, oy + 12, { alpha: 0.6 });
          g.text('0.7 V', ox + 420, oy + 54, { size: 28, alpha: 0.7 });
          g.text('forward', ox + 540, oy - 360, { size: 30, alpha: 0.6 });
          g.text('reverse: tiny leakage', ox - 130, oy + 60, { size: 28, alpha: 0.6 });
        },
      },
      {
        title: 'Rectifier',
        say: [
          'Feed an alternating voltage into a diode and only the positive half cycles get through.',
          'Four diodes in a bridge flip the negative halves too, so every hump points the same way.',
          'A capacitor then fills in the gaps, leaving almost steady d.c.',
        ],
        eq: [
          { at: 3, src: 'V _dc = [ V _m | π ]' },
          { at: 8, src: 'V _dc = [ 2 · V _m | π ]' },
        ],
        draw: (g, t) => {
          const ox = 300;
          const span = 1320;
          const rows = [{ y: 520, mode: 0 }, { y: 760, mode: 1 }, { y: 1000, mode: 2 }];
          rows.forEach((r, i) => {
            const a = ph(t, 0.5 + i * 3, 1.5 + i * 3);
            const lim = Math.min(3, Math.max(0, (t - (0.5 + i * 3)) * 0.55));
            g.line(ox, r.y, ox + span + 40, r.y, { alpha: 0.35 * a });
            g.curve((x) => r.y - 80 * Math.sin(((x - ox) / span) * 6 * Math.PI), ox, ox + span, { alpha: 0.2 * a, n: 300 });
            const out = (c: number) => {
              const v = Math.sin(2 * Math.PI * c);
              if (r.mode === 0) return Math.max(0, v);
              if (r.mode === 1) return Math.abs(v);
              return 1 - 0.18 * (1 - Math.abs(Math.sin(2 * Math.PI * c))) ;
            };
            g.curve((x) => r.y - 80 * out(((x - ox) / span) * 3), ox, ox + (lim / 3) * span, { alpha: 0.95 * a, n: 400 });
            g.text(['half-wave', 'full-wave', 'with capacitor'][i], 200, r.y + 8, { size: 28, alpha: 0.7 * a, align: 'right' });
          });
        },
      },
      {
        title: 'Zener, LED and solar cell',
        say: [
          'A Zener diode is built to break down in reverse at a set voltage, and then it holds that voltage steady, which makes a voltage regulator.',
          'In a light-emitting diode, electrons and holes meet at the junction and each pair gives a photon.',
          'A solar cell runs the same trick backwards. Light makes the pairs and the junction field sorts them into a current.',
        ],
        eq: [
          { at: 3, src: 'R _s = [ V _in − V _z | I _z + I _L ]' },
          { at: 8, src: 'h · f ≈ E _g' },
        ],
        draw: (g, t) => {
          // Zener: input wanders, output flat.
          const ox = 240;
          const oy = 560;
          if (t < 7) {
            const a = ph(t, 0.5, 1.5) * (1 - ph(t, 6.2, 7));
            g.axes(ox, oy, 1400, 340, { x: 't', y: 'V', alpha: 0.5 * a, down: 100 });
            const vin = (x: number) => oy - 150 - 90 * Math.sin((x - ox) / 110) - 40 * Math.sin((x - ox) / 41);
            const head = ph(t, 1, 6);
            g.curve(vin, ox, ox + 1400 * head, { alpha: 0.4 * a, n: 400, dash: [10, 8] });
            g.curve(() => oy - 150, ox, ox + 1400 * head, { alpha: 0.95 * a, n: 20 });
            g.text('V in', ox + 1440, oy - 230, { size: 28, alpha: 0.5 * a });
            g.text('V out (held by the Zener)', ox + 1440, oy - 120, { size: 28, alpha: 0.9 * a, align: 'right' });
          } else if (t < 11) {
            // LED
            const a = ph(t, 7, 8) * (1 - ph(t, 10.4, 11));
            const cx = 960;
            g.rect(480, 560, cx - 480, 240, { alpha: 0.6 * a });
            g.rect(cx, 560, 480, 240, { alpha: 0.6 * a });
            for (let k = 0; k < 5; k++) {
              const s = (t * 0.35 + k / 5) % 1;
              const yy = 600 + k * 46;
              hole(g, 540 + (cx - 560) * s, yy, a * (s > 0.9 ? 0 : 1));
              elec(g, cx + 430 - (cx - 520 + 0) * 0.9 * s, yy + 16, a * (s > 0.9 ? 0 : 1));
              if (s > 0.88) {
                const p = (s - 0.88) / 0.12;
                g.path(Array.from({ length: 20 }, (_, z) => [cx + z * 8, yy - 20 - z * 9 + 7 * Math.sin(z - 8 * t)] as [number, number]), { alpha: a * p * 0.8, width: 2.5 });
              }
            }
            g.text('electrons and holes recombine: light out', cx, 880, { size: 30, alpha: 0.6 * a });
          } else {
            // Solar cell.
            const a = ph(t, 11, 12);
            const cx = 960;
            g.rect(500, 600, cx - 500, 160, { alpha: 0.6 * a });
            g.rect(cx, 600, 460, 160, { alpha: 0.6 * a });
            for (let k = 0; k < 4; k++) {
              const s = (t * 0.45 + k / 4) % 1;
              const x = 640 + k * 190;
              g.path(Array.from({ length: 20 }, (_, z) => [x + 8 * Math.sin(z * 0.6 - 7 * t), 330 + s * 260 + z * 4] as [number, number]), { alpha: a * (s < 0.9 ? 0.8 : 0), width: 2.5 });
            }
            for (let k = 0; k < 4; k++) {
              const s = (t * 0.4 + k / 4 + rnd(k)) % 1;
              elec(g, cx + 10 + 150 * s, 640 + k * 28, a);
              hole(g, cx - 10 - 150 * s, 650 + k * 28, a);
            }
            g.text('light makes pairs, the field sorts them', cx, 860, { size: 30, alpha: 0.6 * a });
          }
        },
      },
    ],
  });
