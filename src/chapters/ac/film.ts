import { buildChapterFilm, ph, type Gfx } from '../film/engine';

/** Alternating current: a turning coil, rms, coil and capacitor, the LCR circuit, resonance and the transformer. */


function trace(g: Gfx, x: number, y: number, w: number, A: number, t: number, om: number, f: (a: number) => number, o: { alpha?: number; dash?: number[]; width?: number } = {}) {
  const span = w / 150;
  const pts: [number, number][] = [];
  for (let k = 0; k <= 160; k++) {
    const u = (k / 160) * span;
    pts.push([x + u * 150, y - A * f(om * (t - u))]);
  }
  g.path(pts, { width: 3.5, ...o });
}

export const buildFilm = () =>
  buildChapterFilm({
    title: 'Why does the current keep reversing?',
    subtitle: 'Alternating current, from the coil to the transformer.',
    shots: [
      {
        title: 'A turning coil',
        say: [
          'Spin a coil in a magnetic field, and the flux through it rises and falls.',
          'The emf is the rate of change of that flux, so it swings smoothly back and forth: a sine wave.',
          'That is alternating current: it reverses fifty times a second in the mains.',
        ],
        eq: [
          { at: 4, src: 'ε = − [ dΦ | dt ]' },
          { at: 8, src: 'v = V _0 · sin ( ω · t )' },
        ],
        draw: (g, t) => {
          const th = 1.4 * t;
          const cx = 520;
          const cy = 600;
          const R = 220;
          for (let k = -2; k <= 2; k++) g.arrow(cx - 330, cy + k * 80, cx + 330, cy + k * 80, { alpha: 0.2, width: 2, head: 16 });
          const ux = Math.sin(th);
          const uy = Math.cos(th);
          g.line(cx + R * ux, cy + R * uy, cx - R * ux, cy - R * uy, { width: 7 });
          g.ball(cx + R * ux, cy + R * uy, 14);
          g.ball(cx - R * ux, cy - R * uy, 14);
          g.text('B', cx - 360, cy - 140, { size: 40, font: 'italic', alpha: 0.6 });
          const gx = 1000;
          g.axes(gx, cy, 780, 230, { x: 't', alpha: 0.5, down: 230 });
          const s = ph(t, 1.5, 3);
          trace(g, gx, cy, 740, 190, t, 1.4, Math.cos, { alpha: 0.45 * s, dash: [10, 10] });
          trace(g, gx, cy, 740, 190, t, 1.4, Math.sin);
          g.ball(gx, cy - 190 * Math.sin(th), 14);
          g.text('flux', gx + 300, cy + 270, { size: 28, alpha: 0.5 * s });
          g.text('emf', gx + 520, cy + 270, { size: 28, alpha: 0.9 });
        },
      },
      {
        title: 'The rms value',
        say: [
          'The average of an alternating current is zero, but its heating is not.',
          'Heat goes as the square of the current, and the square is never negative.',
          'Its average is half the peak squared, so the steady equivalent is the peak divided by root two.',
        ],
        eq: [
          { at: 3, src: 'p = i ^2 · R = I _0 ^2 · R · sin ^2 ( ω · t )' },
          { at: 8, src: 'I _rms = [ I _0 | √[ 2 ] ] ≈ 0.707 · I _0' },
        ],
        draw: (g, t) => {
          const x0 = 260;
          const y0 = 720;
          const A = 260;
          g.axes(x0, y0, 1400, 330, { x: 't', alpha: 0.5, down: 280 });
          const head = Math.min(1, t / 4);
          const w = 1400 * head;
          g.curve((x) => y0 - A * Math.sin((x - x0) / 90), x0, x0 + w, { alpha: 0.45, width: 3, n: 400 });
          const sq = ph(t, 3, 5);
          g.curve((x) => y0 - A * Math.sin((x - x0) / 90) ** 2, x0, x0 + w, { alpha: sq, width: 4.5, n: 400 });
          const m = ph(t, 6, 8);
          g.line(x0, y0 - A / 2, x0 + 1400 * m, y0 - A / 2, { alpha: 0.8, dash: [14, 10], width: 3 });
          g.text('average = half the peak squared', x0 + 1000, y0 - A / 2 - 20, { size: 30, alpha: m });
          g.text('i²', x0 + 60 + 1400 * 0.0, y0 - A - 30, { size: 36, font: 'italic', alpha: sq * 0.8 });
        },
      },
      {
        title: 'Coil and capacitor',
        say: [
          'A coil resists change, so its current lags the voltage by a quarter of a cycle.',
          'A capacitor passes the current when the voltage is changing fastest, so its current leads.',
          'Their reactances are opposite: the coil grows with frequency, the capacitor shrinks.',
        ],
        eq: [
          { at: 5, src: 'X _L = ω · L' },
          { at: 9, src: 'X _C = [ 1 | ω · C ]' },
        ],
        draw: (g, t) => {
          const om = 2.2;
          [
            ['coil: current lags', 1],
            ['capacitor: current leads', -1],
          ].forEach(([name, sgn], k) => {
            const y = 480 + k * 280;
            const x = 360;
            g.line(x, y - 110, x, y + 110, { alpha: 0.4, width: 2 });
            g.line(x, y, x + 1200, y, { alpha: 0.4, width: 2 });
            trace(g, x, y, 1200, 90, t, om, Math.sin);
            trace(g, x, y, 1200, 62, t, om, (a) => Math.sin(a - (sgn as number) * (Math.PI / 2)), { alpha: 0.6, dash: [10, 10], width: 3 });
            g.ball(x, y - 90 * Math.sin(om * t), 13);
            g.text(name as string, x + 1260, y + 8, { size: 30, alpha: 0.7, align: 'left' });
          });
          g.text('voltage', 250, 480 + 10, { size: 26, alpha: 0.6 });
        },
      },
      {
        title: 'The LCR circuit',
        say: [
          'In series, the resistor voltage lies along the current, the coil leads it, the capacitor trails it.',
          'The coil and capacitor oppose each other, and what is left joins the resistor at a right angle.',
          'Pythagoras gives the impedance, the total opposition to the current.',
        ],
        eq: [
          { at: 5, src: 'Z = √[ R ^2 + ( X _L − X _C ) ^2 ]' },
          { at: 9, src: 'tan φ = [ X _L − X _C | R ]' },
        ],
        draw: (g, t) => {
          const ox = 620;
          const oy = 620;
          const R = 420 * ph(t, 0.5, 1.8);
          const X = 280 * Math.sin(0.9 * Math.max(0, t - 2)) * ph(t, 2, 3);
          g.arrow(ox, oy, ox + R, oy, { alpha: 0.8, width: 4 });
          g.text('R', ox + R / 2, oy + 60, { size: 44, font: 'italic' });
          const a = ph(t, 3, 4.5);
          g.arrow(ox + R, oy, ox + R, oy - X * a, { alpha: 0.8, width: 4 });
          g.text('X_L − X_C', ox + R + 30, oy - (X * a) / 2, { size: 38, font: 'italic', align: 'left', alpha: a });
          g.arrow(ox, oy, ox + R, oy - X * a, { width: 5, alpha: ph(t, 4, 5) });
          const phi = Math.atan2(X * a, R);
          g.arc(ox, oy, 110, 0, -phi, { alpha: 0.7, width: 3 });
          g.text('φ', ox + 140, oy - 20 * Math.sign(X) - 5, { size: 42, font: 'italic', alpha: ph(t, 4, 5) });
          g.text('Z', ox + R / 2 - 30, oy - (X * a) / 2 - 40, { size: 44, font: 'italic', alpha: ph(t, 4, 5) });
        },
      },
      {
        title: 'Resonance',
        say: [
          'Sweep the frequency, and at one special value the coil and capacitor exactly cancel.',
          'The impedance drops to just the resistance, and the current peaks.',
          'The smaller the resistance, the sharper the peak. This is how a radio picks one station.',
        ],
        eq: [{ at: 4, src: 'ω _0 = [ 1 | √[ L · C ] ]' }],
        draw: (g, t) => {
          const ox = 360;
          const oy = 780;
          const w = 1200;
          const h = 440;
          g.axes(ox, oy, w + 30, h + 30, { x: 'ω', y: 'I', alpha: 0.5 });
          const res = (x: number, Q: number) => 1 / Math.sqrt(1 + Q * Q * (x - 1 / x) ** 2);
          const px = (x: number) => ox + ((x - 0.55) / 1.1) * w;
          const grow = ph(t, 0.5, 4);
          const draw = (Q: number, o: { alpha: number; dash?: number[] }) => g.curve((x) => oy - h * res(0.55 + ((x - ox) / w) * 1.1, Q) * grow, ox, ox + w, { ...o, width: 4, n: 300 });
          draw(8, { alpha: 1 });
          draw(3, { alpha: ph(t, 6, 8) * 0.6, dash: [12, 10] });
          g.line(px(1), oy, px(1), oy - h * grow, { alpha: 0.4, dash: [8, 10], width: 2 });
          g.text('ω₀', px(1), oy + 50, { size: 38, font: 'italic', alpha: 0.8 });
          const s = 0.55 + 1.1 * ph(t, 3, 11);
          const sw = ph(t, 3, 3.5);
          g.ball(px(s), oy - h * res(s, 8) * grow, 14, sw);
          g.text('large R: low and broad', ox + 980, oy - 150, { size: 28, alpha: ph(t, 6, 8) * 0.7 });
        },
      },
      {
        title: 'The transformer',
        say: [
          'Wind two coils on one iron core. The changing flux of the first passes through the second.',
          'Every turn gets the same emf, so the voltages are in the ratio of the turns.',
          'Voltage steps up and current steps down, and the power in equals the power out.',
        ],
        eq: [
          { at: 5, src: '[ V _s | V _p ] = [ N _s | N _p ]' },
          { at: 9, src: 'V _p · I _p = V _s · I _s' },
        ],
        draw: (g, t) => {
          const x = 640;
          const y = 330;
          const w = 640;
          const h = 480;
          g.rect(x, y, w, h, { alpha: 0.8, width: 3 });
          g.rect(x + 120, y + 120, w - 240, h - 240, { alpha: 0.8, width: 3 });
          const fl = Math.cos(1.8 * t);
          const off = fl * 90;
          g.ctx.save();
          g.ctx.beginPath();
          g.ctx.rect(x + 60, y + 60, w - 120, h - 120);
          g.ctx.strokeStyle = `rgba(255,255,255,${0.35 + 0.4 * Math.abs(fl)})`;
          g.ctx.lineWidth = 4;
          g.ctx.setLineDash([22, 26]);
          g.ctx.lineDashOffset = off;
          g.ctx.stroke();
          g.ctx.restore();
          g.spring(x + 60, y + 30, x + 60, y + h - 30, { coils: 10, amp: 50, alpha: ph(t, 1, 2) });
          g.spring(x + w - 60, y + 30, x + w - 60, y + h - 30, { coils: 5, amp: 50, alpha: ph(t, 3, 4) });
          g.text('primary', x + 60, y + h + 70, { size: 30, alpha: 0.7 });
          g.text('secondary', x + w - 60, y + h + 70, { size: 30, alpha: ph(t, 3, 4) * 0.7 });
          const gy = 600;
          const a = ph(t, 1, 2);
          g.line(220, gy - 130, 220, gy + 130, { alpha: 0.4 * a, width: 2 });
          trace(g, 220, gy, 360, 70, t, 1.8, Math.sin, { alpha: a });
          const b = ph(t, 3, 4);
          g.line(1340, gy - 130, 1340, gy + 130, { alpha: 0.4 * b, width: 2 });
          trace(g, 1340, gy, 360, 35, t, 1.8, (p) => -Math.sin(p), { alpha: b });
          g.text('V', 400, gy + 190, { size: 34, font: 'italic', alpha: a * 0.7 });
          g.text('V / 2', 1520, gy + 190, { size: 34, font: 'italic', alpha: b * 0.7 });
        },
      },
    ],
  });
