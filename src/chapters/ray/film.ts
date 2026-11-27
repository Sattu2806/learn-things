import { buildChapterFilm, lerp, ph, type Gfx } from '../film/engine';

/** Ray optics: reflection, a mirror, refraction, total reflection, a lens and a telescope. */

type P = [number, number];

/** A ray as a line with a few bright dots running along it. */
function ray(g: Gfx, pts: P[], t: number, alpha = 1, n = 3) {
  g.path(pts, { width: 3.5, alpha: 0.7 * alpha });
  let total = 0;
  const lens: number[] = [];
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    lens.push(l);
    total += l;
  }
  for (let k = 0; k < n; k++) {
    let d = ((t * 0.25 + k / n) % 1) * total;
    for (let i = 0; i < lens.length; i++) {
      if (d <= lens[i] || i === lens.length - 1) {
        const p = lens[i] ? Math.min(1, d / lens[i]) : 0;
        g.ball(lerp(pts[i][0], pts[i + 1][0], p), lerp(pts[i][1], pts[i + 1][1], p), 8, alpha);
        break;
      }
      d -= lens[i];
    }
  }
}

const unit = (a: P, b: P): P => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
};

export const buildFilm = () =>
  buildChapterFilm({
    title: 'How does a curved piece of glass make an image?',
    subtitle: 'Ray optics: mirrors, lenses and telescopes.',
    shots: [
      {
        title: 'Reflection',
        say: [
          'Light travels in straight lines, called rays.',
          'When a ray hits a mirror, it leaves at the same angle to the normal as it arrived.',
          'To the eye the reflected rays seem to come from a point behind the mirror, which is the image.',
        ],
        eq: [{ at: 5, src: 'i = r' }],
        draw: (g, t) => {
          const i = (0.3 + 0.8 * (0.5 - 0.5 * Math.cos(0.6 * t))) * 1;
          const cx = 960;
          const cy = 760;
          const L = 380;
          g.line(520, cy, 1400, cy, { width: 5 });
          for (let x = 540; x < 1400; x += 30) g.line(x, cy + 4, x - 18, cy + 26, { alpha: 0.25, width: 2 });
          g.line(cx, cy - L - 30, cx, cy, { alpha: 0.4, dash: [10, 12], width: 2 });
          const s = Math.sin(i);
          const c = Math.cos(i);
          ray(g, [[cx - L * s, cy - L * c], [cx, cy]], t);
          ray(g, [[cx, cy], [cx + L * s, cy - L * c]], t);
          g.line(cx, cy, cx - 260 * s, cy + 260 * c, { alpha: ph(t, 6, 8) * 0.5, dash: [10, 12], width: 2 });
          g.arc(cx, cy, 130, -Math.PI / 2, -Math.PI / 2 - i, { alpha: 0.8, width: 3 });
          g.arc(cx, cy, 160, -Math.PI / 2, -Math.PI / 2 + i, { alpha: 0.8, width: 3 });
          g.text('i', cx - 190 * Math.sin(i / 2), cy - 190 * Math.cos(i / 2), { size: 40, font: 'italic' });
          g.text('r', cx + 215 * Math.sin(i / 2), cy - 215 * Math.cos(i / 2), { size: 40, font: 'italic' });
          g.text('normal', cx + 20, cy - L - 36, { size: 28, alpha: 0.5, align: 'left' });
        },
      },
      {
        title: 'A concave mirror',
        say: [
          'Bend the mirror into a curve, and parallel rays are gathered to a focus, half way to the centre of curvature.',
          'An object beyond the focus gives a real, upside-down image.',
          'Bring the object closer, and the image slides away and grows.',
        ],
        eq: [
          { at: 3, src: 'f = [ R | 2 ]' },
          { at: 8, src: '[ 1 | v ] + [ 1 | u ] = [ 1 | f ]' },
        ],
        draw: (g, t) => {
          const F = 170;
          const xo = 1500;
          const y0 = 650;
          const h = 90;
          const s = 0.5 - 0.5 * Math.cos(0.5 * Math.max(0, t - 4));
          const u = lerp(720, 330, t < 4 ? 0 : s);
          const v = (u * F) / (u - F);
          g.line(260, y0, 1800, y0, { alpha: 0.3, width: 2 });
          const R = 2 * F;
          const pts: P[] = [];
          for (let k = 0; k <= 60; k++) {
            const y = (k / 60 - 0.5) * 2 * 270;
            pts.push([xo - R + Math.sqrt(R * R - y * y), y0 + y]);
          }
          g.path(pts, { width: 6 });
          [[-F, 'F'], [-R, 'C']].forEach(([x, name]) => {
            g.line(xo + (x as number), y0 - 14, xo + (x as number), y0 + 14, { width: 3 });
            g.text(name as string, xo + (x as number), y0 + 56, { size: 34, font: 'italic', alpha: 0.8 });
          });
          const tip: P = [xo - u, y0 - h];
          g.arrow(xo - u, y0, tip[0], tip[1], { width: 5 });
          const I: P = [xo - v, y0 + (h * v) / u];
          g.arrow(I[0], y0, I[0], I[1], { width: 5, alpha: 0.8 });
          [0, -h].forEach((hy) => {
            const hit: P = [xo, y0 + hy];
            ray(g, [tip, hit], t, 1, 2);
            const d = unit(hit, I);
            ray(g, [hit, [I[0] + d[0] * 60, I[1] + d[1] * 60]], t, 1, 2);
          });
          g.text('real, inverted', I[0], y0 + 210, { size: 30, alpha: 0.65 * ph(t, 3, 4) });
        },
      },
      {
        title: 'Refraction',
        say: [
          'Light is slower in glass than in air, so a ray crossing the surface at a slant is turned.',
          'Into glass, it bends toward the normal.',
          'The index n is the ratio of the speed in vacuum to the speed in the material, and Snell gave the law that links the angles.',
        ],
        eq: [
          { at: 2, src: 'n = [ c | v ]' },
          { at: 8, src: 'n _1 · sin i = n _2 · sin r' },
        ],
        draw: (g, t) => {
          const cx = 960;
          const cy = 660;
          const L = 340;
          g.rect(300, cy, 1320, 240, { fill: 0.08, width: 0 });
          g.line(300, cy, 1620, cy, { width: 4 });
          g.line(cx, cy - L, cx, cy + 240, { alpha: 0.35, dash: [10, 12], width: 2 });
          const i = (0.25 + 0.95 * (0.5 - 0.5 * Math.cos(0.5 * t)));
          const r = Math.asin(Math.sin(i) / 1.5);
          ray(g, [[cx - L * Math.sin(i), cy - L * Math.cos(i)], [cx, cy]], t);
          ray(g, [[cx, cy], [cx + 260 * Math.sin(r), cy + 260 * Math.cos(r)]], t);
          g.arc(cx, cy, 110, -Math.PI / 2, -Math.PI / 2 - i, { alpha: 0.8, width: 3 });
          g.arc(cx, cy, 110, Math.PI / 2, Math.PI / 2 - r, { alpha: 0.8, width: 3 });
          g.text('air  n = 1', 420, cy - 40, { size: 32, alpha: 0.6, align: 'left' });
          g.text('glass  n = 1.5', 420, cy + 60, { size: 32, alpha: 0.6, align: 'left' });
          g.text(`${((i * 180) / Math.PI).toFixed(0)}°`, cx - 260, cy - 120, { size: 34, font: 'mono', alpha: 0.7 });
          g.text(`${((r * 180) / Math.PI).toFixed(0)}°`, cx + 190, cy + 140, { size: 34, font: 'mono', alpha: 0.7 });
        },
      },
      {
        title: 'Total internal reflection',
        say: [
          'Going the other way, from glass into air, the ray bends away from the normal.',
          'Tilt it more and the refracted ray runs along the surface. That angle is the critical angle.',
          'Beyond it, nothing escapes: all the light is reflected. This is how optical fibres carry light round bends.',
        ],
        eq: [{ at: 7, src: 'sin θ _c = [ n _2 | n _1 ]' }],
        draw: (g, t) => {
          const cx = 960;
          const cy = 640;
          const L = 340;
          g.rect(300, cy - 260, 1320, 260, { fill: 0.08, width: 0 });
          g.line(300, cy, 1620, cy, { width: 4 });
          g.line(cx, cy - 260, cx, cy + L - 100, { alpha: 0.35, dash: [10, 12], width: 2 });
          const i = 0.15 + 1.1 * (0.5 - 0.5 * Math.cos(0.45 * t));
          const sr = 1.5 * Math.sin(i);
          const tir = sr > 1;
          ray(g, [[cx - L * Math.sin(i), cy - L * Math.cos(i) * 0.75], [cx, cy]], t);
          ray(g, [[cx, cy], [cx + L * Math.sin(i), cy - L * Math.cos(i) * 0.75]], t, tir ? 1 : 0.3);
          if (!tir) {
            const r = Math.asin(sr);
            ray(g, [[cx, cy], [cx + 300 * Math.sin(r), cy + 300 * Math.cos(r)]], t);
          }
          g.text('glass  n = 1.5', 420, cy - 40, { size: 32, alpha: 0.6, align: 'left' });
          g.text('air  n = 1', 420, cy + 60, { size: 32, alpha: 0.6, align: 'left' });
          g.text(`i = ${((i * 180) / Math.PI).toFixed(0)}°`, 1460, cy - 330, { size: 36, font: 'mono', alpha: 0.8 });
          g.text(tir ? 'total internal reflection' : 'critical angle 41.8°', 1460, cy - 280, { size: 28, alpha: 0.65 });
        },
      },
      {
        title: 'The lens',
        say: [
          'A lens is two curved surfaces, each bending the light a little.',
          'The thin lens formula ties the object distance to the image distance and the focal length.',
          'Its focal length depends on the glass and on how strongly the surfaces are curved.',
        ],
        eq: [
          { at: 3, src: '[ 1 | v ] − [ 1 | u ] = [ 1 | f ]' },
          { at: 9, src: '[ 1 | f ] = ( n − 1 ) · ( [ 1 | R _1 ] − [ 1 | R _2 ] )' },
        ],
        draw: (g, t) => {
          const F = 170;
          const xo = 1000;
          const y0 = 650;
          const h = 90;
          const s = 0.5 - 0.5 * Math.cos(0.5 * Math.max(0, t - 3));
          const u = lerp(700, 340, t < 3 ? 0 : s);
          const v = (u * F) / (u - F);
          g.line(260, y0, 1800, y0, { alpha: 0.3, width: 2 });
          g.line(xo, y0 - 280, xo, y0 + 280, { width: 5 });
          g.arrow(xo, y0 - 280, xo - 24, y0 - 250, { width: 4, head: 14 });
          g.arrow(xo, y0 + 280, xo - 24, y0 + 250, { width: 4, head: 14 });
          [-F, F, -2 * F, 2 * F].forEach((x, k) => {
            g.line(xo + x, y0 - 14, xo + x, y0 + 14, { width: 3 });
            g.text(k < 2 ? 'F' : '2F', xo + x, y0 + 56, { size: 32, font: 'italic', alpha: 0.7 });
          });
          const tip: P = [xo - u, y0 - h];
          g.arrow(xo - u, y0, tip[0], tip[1], { width: 5 });
          const I: P = [xo + v, y0 + (h * v) / u];
          g.arrow(I[0], y0, I[0], I[1], { width: 5, alpha: 0.8 });
          [0, -h].forEach((hy) => {
            const hit: P = [xo, y0 + hy];
            ray(g, [tip, hit], t, 1, 2);
            const d = unit(hit, I);
            ray(g, [hit, [I[0] + d[0] * 70, I[1] + d[1] * 70]], t, 1, 2);
          });
        },
      },
      {
        title: 'The telescope',
        say: [
          'A telescope puts two lenses together. The long-focus objective forms an image of a distant object at its focus.',
          'The short-focus eyepiece turns the rays parallel again, but at a much larger angle.',
          'The magnifying power is the ratio of the two focal lengths.',
        ],
        eq: [{ at: 6, src: 'm = [ f _o | f _e ]' }],
        draw: (g, t) => {
          const y0 = 640;
          const xo = 330;
          const fo = 900;
          const fe = 225;
          const xe = xo + fo + fe;
          const alpha = 0.09 * (1 + 0.3 * Math.sin(0.8 * t));
          const tipY = -fo * alpha;
          g.line(120, y0, 1800, y0, { alpha: 0.3, width: 2 });
          g.line(xo, y0 - 240, xo, y0 + 240, { width: 5 });
          g.line(xe, y0 - 130, xe, y0 + 130, { width: 5 });
          g.text('objective', xo, y0 - 270, { size: 30, alpha: 0.6 });
          g.text('eyepiece', xe, y0 - 160, { size: 30, alpha: 0.6 });
          g.line(xo + fo, y0 - 12, xo + fo, y0 + 12, { width: 3 });
          g.text('focus', xo + fo, y0 + 50, { size: 28, alpha: 0.6 });
          const slope = -tipY / fe;
          [-130, 0, 130].forEach((h) => {
            const yE = h + (tipY - h) * ((xe - xo) / fo);
            ray(g, [[150, y0 - h - alpha * (xo - 150)], [xo, y0 - h], [xo + fo, y0 - tipY], [xe, y0 - yE], [xe + 420, y0 - yE - slope * 420]], t, 1, 4);
          });
          g.text(`α = ${((Math.atan(alpha) * 180) / Math.PI).toFixed(1)}°`, 560, y0 + 220, { size: 34, font: 'mono', alpha: 0.7 });
          g.text(`β = ${((Math.atan(slope) * 180) / Math.PI).toFixed(1)}°`, 1560, y0 + 220, { size: 34, font: 'mono', alpha: 0.7 });
        },
      },
    ],
  });
