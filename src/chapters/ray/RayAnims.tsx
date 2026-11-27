import type { ReactNode } from 'react';
import { Anim, Arrow, Ball, Label, Line, Readout, Trail, W, ease, lerp, phase } from '../kit/Anim';

/** Animated diagrams for ray optics. Positions come from the real laws (mirror and lens equations, Snell's law). */

const TAU = 2 * Math.PI;
const DEG = Math.PI / 180;
type Pt = [number, number];
type V2 = [number, number];

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}
const unit = (v: V2): V2 => {
  const l = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / l, v[1] / l];
};

/** Position along a polyline, at fraction s of its length. */
function along(path: Pt[], s: number): Pt {
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    const l = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
    lens.push(l);
    total += l;
  }
  let d = s * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const p = lens[i] ? Math.min(1, d / lens[i]) : 0;
      return [lerp(path[i][0], path[i + 1][0], p), lerp(path[i][1], path[i + 1][1], p)];
    }
    d -= lens[i];
  }
  return path[path.length - 1];
}

/** A ray drawn as a line with a few pulses of light running along it. */
function Flow({ path, t, n = 3, speed = 0.25, tone = 'bright', dashed }: { path: Pt[]; t: number; n?: number; speed?: number; tone?: 'bright' | 'soft'; dashed?: boolean }) {
  return (
    <g>
      <Trail points={path} tone={tone} dashed={dashed} />
      {Array.from({ length: n }, (_, k) => {
        const p = along(path, (t * speed + k / n) % 1);
        return <Ball key={k} x={p[0]} y={p[1]} r={3} glow={false} />;
      })}
    </g>
  );
}

// ------------------------------------------------------------------ reflection

export function ReflectionLaw({ height = 230 }: { height?: number }) {
  return (
    <Anim title="A ray strikes a flat mirror and leaves at the same angle to the normal as it arrived, whatever the angle of incidence" height={height} loop={8}>
      {(t) => {
        const i = (15 + 60 * (0.5 - 0.5 * Math.cos(TAU * t / 8))) * DEG;
        const cx = 320, cy = height - 54, L = 150;
        const s = Math.sin(i), c = Math.cos(i);
        const a: Pt = [cx - L * s, cy - L * c];
        const b: Pt = [cx + L * s, cy - L * c];
        return (
          <g>
            <Line x1={110} y1={cy} x2={530} y2={cy} tone="bright" />
            {Array.from({ length: 28 }, (_, k) => (
              <Line key={k} x1={116 + k * 15} y1={cy + 2} x2={108 + k * 15} y2={cy + 10} tone="soft" />
            ))}
            <Line x1={cx} y1={cy - L - 12} x2={cx} y2={cy} tone="soft" dashed />
            <Flow path={[a, [cx, cy]]} t={t} n={3} />
            <Flow path={[[cx, cy], b]} t={t} n={3} />
            <path className="fig-guide" d={`M${cx} ${cy - 50}A50 50 0 0 0 ${cx - 50 * s} ${cy - 50 * c}`} fill="none" />
            <path className="fig-guide" d={`M${cx} ${cy - 62}A62 62 0 0 1 ${cx + 62 * s} ${cy - 62 * c}`} fill="none" />
            <Label x={cx - 70 * s * 0.6 - 14} y={cy - 78 * c * 0.7} kind="sym">i</Label>
            <Label x={cx + 78 * s * 0.6 + 14} y={cy - 88 * c * 0.7} kind="sym">r</Label>
            <Label x={cx + 12} y={cy - L - 14} kind="label" anchor="start">normal</Label>
            <Readout x={W - 12} y={22}>{`i = ${((i / DEG)).toFixed(0)}°  =  r`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function PlaneMirror({ height = 250 }: { height?: number }) {
  return (
    <Anim title="An object in front of a plane mirror and its image behind it, the same distance away; the reflected rays only appear to come from the image" height={height} loop={8}>
      {(t) => {
        const mx = 340, y0 = height - 40;
        const d = 60 + 110 * (0.5 - 0.5 * Math.cos(TAU * t / 8));
        const h = 56;
        const ox = mx - d, ix = mx + d;
        const tipO: Pt = [ox, y0 - h], tipI: Pt = [ix, y0 - h];
        const ys = [y0 - 14, y0 - 100];
        return (
          <g>
            <Line x1={mx} y1={20} x2={mx} y2={y0 + 10} tone="bright" />
            {Array.from({ length: 14 }, (_, k) => (
              <Line key={k} x1={mx + 2} y1={26 + k * 15} x2={mx + 10} y2={34 + k * 15} tone="soft" />
            ))}
            <Line x1={20} y1={y0} x2={W - 20} y2={y0} tone="soft" dashed />
            <Arrow x1={ox} y1={y0} x2={ox} y2={y0 - h} />
            <Arrow x1={ix} y1={y0} x2={ix} y2={y0 - h} tone="soft" dashed />
            {ys.map((y) => {
              const m: Pt = [mx, y];
              const dir = unit([m[0] - tipI[0], m[1] - tipI[1]]);
              const end: Pt = [m[0] + dir[0] * 250, m[1] + dir[1] * 250];
              return (
                <g key={y}>
                  <Flow path={[tipO, m]} t={t} n={2} />
                  <Flow path={[m, end]} t={t} n={3} />
                  <Line x1={m[0]} y1={m[1]} x2={tipI[0]} y2={tipI[1]} tone="soft" dashed />
                </g>
              );
            })}
            <Label x={ox} y={y0 + 18} kind="label">object</Label>
            <Label x={ix} y={y0 + 18} kind="label">image (virtual)</Label>
            <Readout x={W - 12} y={22}>{`image distance = object distance = ${(d / 40).toFixed(1)} units`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** A concave mirror: parallel rays at different heights all cross the axis near R / 2. */
export function MirrorFocus({ height = 270 }: { height?: number }) {
  return (
    <Anim title="Rays parallel to the axis of a concave mirror, at different heights, cross the axis at a point close to half the radius of curvature when they are near the axis" height={height} loop={10}>
      {(t) => {
        const R = 150, xo = 500, y0 = height / 2;
        const s = 0.5 - 0.5 * Math.cos((TAU * t) / 10);
        const hh = R * (0.1 + 0.5 * s);
        const ray = (h: number) => {
          const M: V2 = [-R + Math.sqrt(R * R - h * h), h];
          const n = unit([M[0] + R, M[1]]);
          const d: V2 = [1 - 2 * n[0] * n[0], -2 * n[0] * n[1]];
          const sx = -M[1] / d[1];
          const X: V2 = [M[0] + sx * d[0], 0];
          return { M, X, d };
        };
        const P = (x: number, y: number): Pt => [xo + x, y0 - y];
        const r1 = ray(hh), r2 = ray(-hh);
        const arc = curve(60, 1, (u) => {
          const y = (u - 0.5) * 2 * 78;
          return P(-R + Math.sqrt(R * R - y * y), y);
        });
        return (
          <g>
            <Line x1={20} y1={y0} x2={W - 20} y2={y0} tone="soft" />
            <Trail points={arc} />
            {[r1, r2].map((r, k) => (
              <g key={k}>
                <Flow path={[P(-xo + 20, r.M[1]), P(r.M[0], r.M[1])]} t={t} n={3} />
                <Flow path={[P(r.M[0], r.M[1]), P(r.X[0] - 30 * r.d[0], -30 * r.d[1])]} t={t} n={2} />
              </g>
            ))}
            <Line x1={xo - R} y1={y0 - 8} x2={xo - R} y2={y0 + 8} tone="soft" />
            <Label x={xo - R} y={y0 + 24} kind="sym">C</Label>
            <Line x1={xo - R / 2} y1={y0 - 8} x2={xo - R / 2} y2={y0 + 8} tone="soft" />
            <Label x={xo - R / 2} y={y0 + 24} kind="sym">F</Label>
            <Ball x={xo + r1.X[0]} y={y0} r={4.5} />
            <Readout x={W - 12} y={22}>{`crossing at ${(-r1.X[0] / R).toFixed(2)} R from the pole`}</Readout>
            <Label x={W - 12} y={44} kind="label" anchor="end">near the axis: R / 2</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the ray diagrams for mirrors and lenses

type Kind = 'concave-mirror' | 'convex-mirror' | 'convex-lens' | 'concave-lens';

export function RayDiagram({ kind, u0, u1, title, height = 290, loop = 8, F = 60 }: { kind: Kind; u0: number; u1: number; title: string; height?: number; loop?: number; F?: number }) {
  const mirror = kind.endsWith('mirror');
  const f = kind.startsWith('concave') ? -F : F;
  return (
    <Anim title={title} height={height} loop={loop}>
      {(t) => {
        const xo = mirror ? 450 : 330;
        const y0 = height * 0.5;
        const h = 28;
        const s = 0.5 - 0.5 * Math.cos((TAU * t) / loop);
        const u = lerp(u0, u1, s);
        const uc = -u;
        const v = mirror ? 1 / (1 / f - 1 / uc) : 1 / (1 / f + 1 / uc);
        const m = mirror ? -v / uc : v / uc;
        const P = (x: number, y: number): Pt => [xo + x, y0 - y];
        const real = mirror ? v < 0 : v > 0;
        const tip = P(uc, h);
        const I: V2 = [v, m * h];
        const rays = [0, h].map((hy) => {
          const hit: V2 = [0, hy];
          const dir = real ? unit([I[0] - hit[0], I[1] - hit[1]]) : unit([hit[0] - I[0], hit[1] - I[1]]);
          return { hit, dir };
        });
        const out: ReactNode[] = [];
        rays.forEach((r, k) => {
          out.push(<Flow key={`i${k}`} path={[tip, P(r.hit[0], r.hit[1])]} t={t} n={2} />);
          if (real) {
            const end: V2 = [I[0] + r.dir[0] * 40, I[1] + r.dir[1] * 40];
            out.push(<Flow key={`o${k}`} path={[P(r.hit[0], r.hit[1]), P(end[0], end[1])]} t={t} n={2} />);
          } else {
            const end: V2 = [r.hit[0] + r.dir[0] * 150, r.hit[1] + r.dir[1] * 150];
            out.push(<Flow key={`o${k}`} path={[P(r.hit[0], r.hit[1]), P(end[0], end[1])]} t={t} n={2} />);
            out.push(<Trail key={`d${k}`} points={[P(r.hit[0], r.hit[1]), P(I[0], I[1])]} tone="soft" dashed />);
          }
        });
        const Ro = 2 * F;
        const elem: ReactNode = mirror ? (
          <Trail
            points={curve(60, 1, (q) => {
              const y = (q - 0.5) * 2 * 84;
              const x = f < 0 ? -Ro + Math.sqrt(Ro * Ro - y * y) : Ro - Math.sqrt(Ro * Ro - y * y);
              return P(x, y);
            })}
          />
        ) : (
          <g>
            <Line x1={xo} y1={y0 - 90} x2={xo} y2={y0 + 90} tone="bright" />
            {[-1, 1].map((sg) => (
              <g key={sg}>
                <Line x1={xo} y1={y0 + sg * 90} x2={xo + (f > 0 ? -8 : 8)} y2={y0 + sg * (90 - 12)} tone="bright" />
                <Line x1={xo} y1={y0 + sg * 90} x2={xo + (f > 0 ? 8 : -8)} y2={y0 + sg * (90 - 12)} tone="bright" />
              </g>
            ))}
          </g>
        );
        const marks: [number, string][] = mirror ? (f < 0 ? [[-F, 'F'], [-2 * F, 'C']] : [[F, 'F'], [2 * F, 'C']]) : [[-F, 'F'], [F, 'F'], [-2 * F, '2F'], [2 * F, '2F']];
        const nature = `${real ? 'real' : 'virtual'}, ${m < 0 ? 'inverted' : 'upright'}, ${Math.abs(m) > 1 ? 'magnified' : 'smaller'}`;
        return (
          <g>
            <Line x1={20} y1={y0} x2={W - 20} y2={y0} tone="soft" />
            {elem}
            {marks.map(([x, name]) => (
              <g key={name + x}>
                <Line x1={xo + x} y1={y0 - 6} x2={xo + x} y2={y0 + 6} tone="soft" />
                <Label x={xo + x} y={y0 + 22} kind="sym">{name}</Label>
              </g>
            ))}
            <Arrow x1={xo + uc} y1={y0} x2={xo + uc} y2={y0 - h} />
            {Math.abs(I[1]) > 1 && <Arrow x1={xo + I[0]} y1={y0} x2={xo + I[0]} y2={y0 - I[1]} tone={real ? 'bright' : 'soft'} dashed={!real} />}
            {out}
            <Readout x={W - 12} y={22}>{`m = ${m.toFixed(2)}`}</Readout>
            <Label x={W - 12} y={44} kind="label" anchor="end">{nature}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ refraction and total reflection

export function Refraction({ n1, n2, iMax = 80, title, height = 270, names }: { n1: number; n2: number; iMax?: number; title: string; height?: number; names?: [string, string] }) {
  return (
    <Anim title={title} height={height} loop={10}>
      {(t) => {
        const i = (4 + (iMax - 4) * (0.5 - 0.5 * Math.cos((TAU * t) / 10))) * DEG;
        const cx = 330, cy = height / 2 + 4, L = 130;
        const sr = (n1 / n2) * Math.sin(i);
        const tir = sr > 1;
        const r = tir ? 0 : Math.asin(sr);
        const a: Pt = [cx - L * Math.sin(i), cy - L * Math.cos(i)];
        const refl: Pt = [cx + L * Math.sin(i), cy - L * Math.cos(i)];
        const refr: Pt = [cx + L * Math.sin(r), cy + L * Math.cos(r)];
        return (
          <g>
            <rect x={20} y={cy} width={W - 40} height={height - cy - 8} fill="#fff" opacity={n2 > n1 ? 0.07 : 0.0} />
            <rect x={20} y={14} width={W - 40} height={cy - 14} fill="#fff" opacity={n1 > n2 ? 0.07 : 0.0} />
            <Line x1={20} y1={cy} x2={W - 20} y2={cy} tone="bright" />
            <Line x1={cx} y1={cy - L - 8} x2={cx} y2={cy + L - 20} tone="soft" dashed />
            <Flow path={[a, [cx, cy]]} t={t} n={3} />
            <g opacity={tir ? 1 : 0.28}>
              <Flow path={[[cx, cy], refl]} t={t} n={3} />
            </g>
            {!tir && <Flow path={[[cx, cy], refr]} t={t} n={3} />}
            <path className="fig-guide" d={`M${cx} ${cy - 44}A44 44 0 0 0 ${cx - 44 * Math.sin(i)} ${cy - 44 * Math.cos(i)}`} fill="none" />
            {!tir && <path className="fig-guide" d={`M${cx} ${cy + 44}A44 44 0 0 0 ${cx + 44 * Math.sin(r)} ${cy + 44 * Math.cos(r)}`} fill="none" />}
            <Label x={cx - 56 * Math.sin(i / 2) - 12} y={cy - 56 * Math.cos(i / 2)} kind="sym">i</Label>
            {!tir && <Label x={cx + 60 * Math.sin(r / 2) + 12} y={cy + 66 * Math.cos(r / 2)} kind="sym">r</Label>}
            <Label x={30} y={34} kind="label" anchor="start">{names ? names[0] : `n₁ = ${n1}`}</Label>
            <Label x={30} y={height - 18} kind="label" anchor="start">{names ? names[1] : `n₂ = ${n2}`}</Label>
            <Readout x={W - 12} y={22}>{`i = ${(i / DEG).toFixed(0)}°`}</Readout>
            <Label x={W - 12} y={44} kind="val" anchor="end">{tir ? 'total internal reflection' : `r = ${(r / DEG).toFixed(0)}°`}</Label>
            {n1 > n2 && <Label x={W - 12} y={66} kind="label" anchor="end">{`critical angle ${(Math.asin(n2 / n1) / DEG).toFixed(1)}°`}</Label>}
          </g>
        );
      }}
    </Anim>
  );
}

export function ApparentDepth({ n = 4 / 3, height = 270 }: { n?: number; height?: number }) {
  return (
    <Anim title="A coin at the bottom of water seems raised: rays leaving the water bend away from the normal, and traced back they meet above the true position" height={height} loop={8}>
      {(t) => {
        const sy = 100, cx = 250, d = 130;
        const thw = (7 + 12 * (0.5 - 0.5 * Math.cos((TAU * t) / 8))) * DEG;
        const tha = Math.asin(n * Math.sin(thw));
        const coin: Pt = [cx, sy + d];
        const x2 = cx + d * Math.tan(thw);
        const s2: Pt = [x2, sy];
        const end: Pt = [x2 + 150 * Math.sin(tha), sy - 150 * Math.cos(tha)];
        const app = (x2 - cx) / Math.tan(tha);
        const img: Pt = [cx, sy + app];
        return (
          <g>
            <rect x={20} y={sy} width={W - 40} height={height - sy - 10} fill="#fff" opacity={0.07} />
            <Line x1={20} y1={sy} x2={W - 20} y2={sy} tone="bright" />
            <Flow path={[coin, [cx, sy], [cx, sy - 70]]} t={t} n={3} />
            <Flow path={[coin, s2, end]} t={t} n={4} />
            <Trail points={[s2, img]} tone="soft" dashed />
            <Ball x={coin[0]} y={coin[1]} r={8} />
            <Ball x={img[0]} y={img[1]} r={6} ghost />
            <Label x={cx - 22} y={coin[1] + 5} kind="label" anchor="end">coin</Label>
            <Label x={cx - 22} y={img[1] + 5} kind="label" anchor="end">image</Label>
            <Label x={30} y={height - 18} kind="label" anchor="start">{`water n = ${n.toFixed(2)}`}</Label>
            <Label x={30} y={34} kind="label" anchor="start">air</Label>
            <Readout x={W - 12} y={22}>{`apparent depth = ${(app / d).toFixed(2)} × real depth`}</Readout>
            <Label x={W - 12} y={44} kind="label" anchor="end">{`near the normal: 1 / n = ${(1 / n).toFixed(2)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Fibre({ height = 270 }: { height?: number }) {
  const nc = 1.5, ncl = 1.4;
  return (
    <Anim title="In an optical fibre a ray that meets the wall at more than the critical angle is reflected completely and travels on; a steeper ray leaks out into the cladding" height={height} loop={8}>
      {(t) => {
        const rows: { y: number; a: number; name: string }[] = [
          { y: 80, a: 50 * DEG, name: 'meets the wall at 40°: below the critical angle, it leaks out' },
          { y: 200, a: 15 * DEG, name: 'meets the wall at 75°: above the critical angle, trapped' },
        ];
        return (
          <g>
            {rows.map((r) => {
              const hw = 24;
              const path: Pt[] = [[40, r.y]];
              if (r.a > 30 * DEG) {
                const x1 = 40 + hw / Math.tan(r.a);
                path.push([x1, r.y + hw]);
                const sr = (nc / ncl) * Math.sin(Math.PI / 2 - r.a);
                const rr = Math.asin(Math.min(1, sr));
                path.push([x1 + 150 * Math.sin(rr), r.y + hw + 150 * Math.cos(rr)]);
              } else {
                let x = 40, y = r.y, dir = 1;
                const step = (2 * hw) / Math.tan(r.a);
                x += (hw / Math.tan(r.a));
                y += hw;
                path.push([x, y]);
                dir = -1;
                while (x + step < 600) {
                  x += step;
                  y += dir * 2 * hw;
                  path.push([x, y]);
                  dir *= -1;
                }
                path.push([600, y + dir * ((600 - x) * Math.tan(r.a))]);
              }
              return (
                <g key={r.name}>
                  <Line x1={40} y1={r.y - hw} x2={600} y2={r.y - hw} tone="bright" />
                  <Line x1={40} y1={r.y + hw} x2={600} y2={r.y + hw} tone="bright" />
                  <Label x={612} y={r.y + 4} kind="label" anchor="end">core</Label>
                  <Flow path={path} t={t} n={4} speed={0.2} />
                  <Label x={40} y={r.y - hw - 12} kind="label" anchor="start">{r.name}</Label>
                </g>
              );
            })}
            <Readout x={W - 12} y={height - 8}>{`critical angle at the wall: ${(Math.asin(ncl / nc) / DEG).toFixed(0)}°`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ spherical surface and lens maker

export function SphericalSurface({ height = 260 }: { height?: number }) {
  return (
    <Anim title="Light from a point object refracts at a curved glass surface and meets again at an image point whose distance follows from the surface equation" height={height} loop={8}>
      {(t) => {
        const n1 = 1, n2 = 1.5, R = 45, px = 250, y0 = height / 2;
        const u = lerp(230, 150, 0.5 - 0.5 * Math.cos((TAU * t) / 8));
        const v = n2 / ((n2 - n1) / R - n1 / u);
        const O: Pt = [px - u, y0];
        const I: Pt = [px + v, y0];
        const surf = (y: number) => px + R - Math.sqrt(R * R - y * y);
        const hits = [26, -26];
        return (
          <g>
            <rect x={px} y={y0 - 80} width={W - px - 20} height={160} fill="#fff" opacity={0.06} />
            <Trail points={curve(50, 1, (q) => [surf((q - 0.5) * 2 * 80), y0 + (q - 0.5) * 2 * 80] as Pt)} />
            <Line x1={20} y1={y0} x2={W - 20} y2={y0} tone="soft" />
            {hits.map((y) => {
              const H: Pt = [surf(y), y0 + y];
              return (
                <g key={y}>
                  <Flow path={[O, H]} t={t} n={3} />
                  <Flow path={[H, I]} t={t} n={4} />
                </g>
              );
            })}
            <Ball x={O[0]} y={O[1]} r={6} />
            <Ball x={I[0]} y={I[1]} r={6} />
            <Line x1={px + R} y1={y0 - 6} x2={px + R} y2={y0 + 6} tone="soft" />
            <Label x={px + R} y={y0 + 24} kind="sym">C</Label>
            <Label x={px} y={y0 + 24} kind="sym">P</Label>
            <Label x={O[0]} y={y0 + 24} kind="sym">O</Label>
            <Label x={I[0]} y={y0 + 24} kind="sym">I</Label>
            <Label x={40} y={34} kind="label" anchor="start">air, n₁ = 1</Label>
            <Label x={W - 30} y={34} kind="label" anchor="end">glass, n₂ = 1.5</Label>
            <Readout x={W - 12} y={height - 10}>n₂ / v − n₁ / u = (n₂ − n₁) / R</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

/** Radius of curvature changes and the focus follows: 1/f = (n - 1)(1/R1 - 1/R2). */
export function LensMaker({ n = 1.5, height = 270, medium = 1, title = 'As the surfaces of a lens are made more strongly curved, parallel rays are bent more and meet closer to the lens, in line with the lens maker formula' }: { n?: number; height?: number; medium?: number; title?: string }) {
  return (
    <Anim title={title} height={height} loop={10}>
      {(t) => {
        const R = lerp(150, 85, 0.5 - 0.5 * Math.cos((TAU * t) / 10));
        const nr = n / medium;
        const f = R / (2 * (nr - 1));
        const xl = 150, y0 = height / 2, hh = 62;
        const sag = R - Math.sqrt(R * R - hh * hh);
        const c = (y: number) => R - Math.sqrt(R * R - y * y);
        const left = curve(40, 1, (q) => {
          const y = (q - 0.5) * 2 * hh;
          return [xl - sag + c(y), y0 + y] as Pt;
        });
        const right = curve(40, 1, (q) => {
          const y = (q - 0.5) * 2 * hh;
          return [xl + sag - c(y), y0 + y] as Pt;
        });
        const F: Pt = [xl + f, y0];
        return (
          <g>
            <Line x1={20} y1={y0} x2={W - 20} y2={y0} tone="soft" />
            <Trail points={left} />
            <Trail points={right} />
            {[-48, -24, 24, 48].map((y) => (
              <g key={y}>
                <Flow path={[[30, y0 + y], [xl, y0 + y]]} t={t} n={2} />
                <Flow path={[[xl, y0 + y], [F[0] + 40, y0 + y - ((y * 40) / f)]]} t={t} n={3} />
              </g>
            ))}
            <Ball x={F[0]} y={F[1]} r={5} />
            <Label x={F[0]} y={y0 + 24} kind="sym">F</Label>
            <Readout x={W - 12} y={22}>{`R = ${(R / 10).toFixed(1)}  →  f = ${(f / 10).toFixed(1)}`}</Readout>
            <Label x={W - 12} y={44} kind="label" anchor="end">{`f = R / 2(n − 1),  n = ${nr.toFixed(2)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Two thin lenses in contact: the powers add. */
export function LensContact({ height = 250 }: { height?: number }) {
  return (
    <Anim title="A second thin lens in contact with a converging lens changes where parallel rays meet; the powers of the two lenses simply add" height={height} loop={10}>
      {(t) => {
        const p1 = 0.01;
        const p2 = lerp(-0.004, 0.012, 0.5 - 0.5 * Math.cos((TAU * t) / 10));
        const p = p1 + p2;
        const f = 1 / p;
        const xl = 140, y0 = height / 2;
        return (
          <g>
            <Line x1={20} y1={y0} x2={W - 20} y2={y0} tone="soft" />
            <Line x1={xl - 3} y1={y0 - 70} x2={xl - 3} y2={y0 + 70} tone="bright" />
            <Line x1={xl + 3} y1={y0 - 70} x2={xl + 3} y2={y0 + 70} tone="soft" dashed />
            {[-50, -25, 25, 50].map((y) => (
              <g key={y}>
                <Flow path={[[30, y0 + y], [xl, y0 + y]]} t={t} n={2} />
                <Flow path={[[xl, y0 + y], [xl + Math.min(f, 460), y0]]} t={t} n={3} />
              </g>
            ))}
            <Ball x={xl + Math.min(f, 460)} y={y0} r={5} />
            <Label x={xl - 50} y={y0 - 80} kind="label" anchor="start">lens 1: P₁ = +1</Label>
            <Label x={xl + 50} y={y0 + 90} kind="label" anchor="start">{`lens 2: P₂ = ${(p2 * 100).toFixed(1)}`}</Label>
            <Readout x={W - 12} y={22}>{`P = P₁ + P₂ = ${(p * 100).toFixed(1)}`}</Readout>
            <Label x={W - 12} y={44} kind="label" anchor="end">{`focal length ${(f / 100).toFixed(2)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the prism

function refractVec(d: V2, N: V2, n1: number, n2: number): V2 | null {
  const eta = n1 / n2;
  const ci = -(N[0] * d[0] + N[1] * d[1]);
  const k = 1 - eta * eta * (1 - ci * ci);
  if (k < 0) return null;
  const a = eta * ci - Math.sqrt(k);
  return [eta * d[0] + a * N[0], eta * d[1] + a * N[1]];
}

/** Ray through an equilateral-like prism (apex angle A), in maths coordinates (y up). Returns path points and the deviation. */
function prismRay(iDeg: number, n: number, A: number, S: number): { pts: V2[]; dev: number; e: number } | null {
  const half = A / 2;
  // Apex at (0, h), base corners at (-S sin half, 0) and (S sin half, 0), faces of length S.
  const apex: V2 = [0, S * Math.cos(half)];
  const bl: V2 = [-S * Math.sin(half), 0];
  const br: V2 = [S * Math.sin(half), 0];
  const fl = unit([apex[0] - bl[0], apex[1] - bl[1]]);
  const outL: V2 = [-fl[1], fl[0]]; // pointing up-left
  const inL: V2 = [-outL[0], -outL[1]];
  const ang = Math.atan2(inL[1], inL[0]) + iDeg * DEG;
  const d0: V2 = [Math.cos(ang), Math.sin(ang)];
  const hit: V2 = [bl[0] + (apex[0] - bl[0]) * 0.5, bl[1] + (apex[1] - bl[1]) * 0.5];
  const d1 = refractVec(d0, outL, 1, n);
  if (!d1) return null;
  // right face: from apex to br
  const fr = unit([br[0] - apex[0], br[1] - apex[1]]);
  const outR: V2 = [-fr[1], fr[0]];
  const nrm: V2 = outR;
  // Intersect hit + s d1 with the right face line.
  const denom = d1[0] * nrm[0] + d1[1] * nrm[1];
  const s = ((apex[0] - hit[0]) * nrm[0] + (apex[1] - hit[1]) * nrm[1]) / denom;
  const p2: V2 = [hit[0] + s * d1[0], hit[1] + s * d1[1]];
  const d2 = refractVec(d1, [-nrm[0], -nrm[1]], n, 1);
  if (!d2) return null;
  const dev = Math.acos(Math.max(-1, Math.min(1, d0[0] * d2[0] + d0[1] * d2[1])));
  const e = Math.asin(Math.min(1, n * Math.sin(Math.acos(Math.max(-1, Math.min(1, -(d1[0] * nrm[0] + d1[1] * nrm[1])))))));
  return { pts: [[hit[0] - 170 * d0[0], hit[1] - 170 * d0[1]], hit, p2, [p2[0] + 190 * d2[0], p2[1] + 190 * d2[1]]], dev, e };
}

export function Prism({ n = 1.5, A = 60, height = 270 }: { n?: number; A?: number; height?: number }) {
  const lo = 36, hi = 78;
  const graph = (n_: number) => {
    const out: Pt[] = [];
    for (let i = lo; i <= hi; i += 1) {
      const r = prismRay(i, n_, A * DEG, 150);
      if (r) out.push([i, r.dev / DEG]);
    }
    return out;
  };
  const g = graph(n);
  const dmin = Math.min(...g.map((p) => p[1]));
  return (
    <Anim title="A ray bent by a prism; as the angle of incidence is turned, the deviation first falls to a minimum and then rises again, as shown on the graph" height={height} loop={12}>
      {(t) => {
        const i = lo + (hi - lo) * (0.5 - 0.5 * Math.cos((TAU * t) / 12));
        const r = prismRay(i, n, A * DEG, 150);
        const cx = 140, by = height - 50;
        const P = (p: V2): Pt => [cx + p[0], by - p[1]];
        const half = (A * DEG) / 2;
        const apex: V2 = [0, 150 * Math.cos(half)];
        const bl: V2 = [-150 * Math.sin(half), 0];
        const br: V2 = [150 * Math.sin(half), 0];
        const gx = 380, gy = 215, gw = 230, gh = 120;
        const dmax = Math.max(...g.map((p) => p[1]));
        const gp = (ii: number, dd: number): Pt => [gx + ((ii - lo) / (hi - lo)) * gw, gy - ((dd - (dmin - 4)) / (dmax - dmin + 8)) * gh];
        const dev = r ? r.dev / DEG : NaN;
        return (
          <g>
            <Trail points={[P(bl), P(apex), P(br), P(bl)]} />
            {r && (
              <g>
                <Flow path={[P(r.pts[0]), P(r.pts[1])]} t={t} n={2} />
                <Flow path={[P(r.pts[1]), P(r.pts[2])]} t={t} n={2} />
                <Flow path={[P(r.pts[2]), P(r.pts[3])]} t={t} n={2} />
              </g>
            )}
            <Label x={cx} y={by + 26} kind="label">{`apex angle A = ${A}°`}</Label>
            <Line x1={gx} y1={gy} x2={gx + gw} y2={gy} tone="soft" />
            <Line x1={gx} y1={gy} x2={gx} y2={gy - gh - 10} tone="soft" />
            <Trail points={g.map(([ii, dd]) => gp(ii, dd))} />
            <Label x={gx + gw} y={gy + 20} kind="sym" anchor="end">i</Label>
            <Label x={gx + 6} y={gy - gh - 14} kind="sym" anchor="start">δ</Label>
            <Line x1={gx} y1={gp(lo, dmin)[1]} x2={gx + gw} y2={gp(lo, dmin)[1]} tone="soft" dashed />
            {r && <Ball x={gp(i, dev)[0]} y={gp(i, dev)[1]} r={5} />}
            <Readout x={W - 12} y={22}>{r ? `i = ${i.toFixed(0)}°  δ = ${dev.toFixed(1)}°` : ''}</Readout>
            <Label x={gx + gw} y={gp(lo, dmin)[1] - 8} kind="label" anchor="end">{`minimum ${dmin.toFixed(1)}°`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Dispersion({ height = 260 }: { height?: number }) {
  const nr = 1.6, nv = 1.66;
  return (
    <Anim title="White light entering a prism is spread into its colours because the glass bends violet light more than red; the beam is shown as one ray for each of the two ends of the spectrum" height={height} loop={8}>
      {(t) => {
        const cx = 140, by = height - 50;
        const P = (p: V2): Pt => [cx + p[0], by - p[1]];
        const half = 30 * DEG;
        const apex: V2 = [0, 150 * Math.cos(half)];
        const bl: V2 = [-150 * Math.sin(half), 0];
        const br: V2 = [150 * Math.sin(half), 0];
        const iDeg = 52;
        const red = prismRay(iDeg, nr, 60 * DEG, 150);
        const vio = prismRay(iDeg, nv, 60 * DEG, 150);
        const spread = phase(t, 0.5, 2);
        const ext = (r: ReturnType<typeof prismRay>): V2[] => {
          if (!r) return [];
          const [a, b, c, d] = r.pts;
          const dd = unit([d[0] - c[0], d[1] - c[1]]);
          return [a, b, c, [c[0] + dd[0] * (190 + 150), c[1] + dd[1] * (190 + 150)]];
        };
        const rp = ext(red), vp = ext(vio);
        return (
          <g>
            <Trail points={[P(bl), P(apex), P(br), P(bl)]} />
            {vp.length > 0 && rp.length > 0 && (
              <g>
                <Flow path={[P(vp[0]), P(vp[1])]} t={t} n={3} />
                <Flow path={[P(vp[1]), P(vp[2])]} t={t} n={2} />
                <Flow path={[P(vp[2]), [lerp(P(vp[2])[0], P(vp[3])[0], spread), lerp(P(vp[2])[1], P(vp[3])[1], spread)]]} t={t} n={3} />
                <Flow path={[P(rp[1]), P(rp[2])]} t={t} n={2} tone="soft" />
                <Flow path={[P(rp[2]), [lerp(P(rp[2])[0], P(rp[3])[0], spread), lerp(P(rp[2])[1], P(rp[3])[1], spread)]]} t={t} n={3} tone="soft" />
                <g opacity={spread}>
                  <Label x={P(vp[3])[0] - 6} y={P(vp[3])[1] + 20} kind="label" anchor="end">violet: bent most</Label>
                  <Label x={P(rp[3])[0] - 6} y={P(rp[3])[1] - 10} kind="label" anchor="end">red: bent least</Label>
                </g>
              </g>
            )}
            <Label x={cx - 100} y={by - 10} kind="label">white light</Label>
            <Readout x={W - 12} y={22}>{`n(violet) = ${nv}, n(red) = ${nr}`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ instruments

export function Magnifier({ height = 250 }: { height?: number }) {
  return (
    <Anim title="Seen at the near point the object subtends a small angle at the eye; with a magnifying glass the virtual image subtends a larger one, and the ratio of the angles is the magnifying power" height={height} loop={8}>
      {(t) => {
        const ex = 70, y0 = height / 2 + 10;
        const sw = ease(phase(t % 8, 0.5, 3)) * (1 - ease(phase(t % 8, 5, 7.5)));
        const D = 260;
        const h = 28;
        const H = lerp(h, 74, sw);
        const px = ex + D;
        return (
          <g>
            <circle className="kit-block" cx={ex} cy={y0} r={12} />
            <Ball x={ex + 6} y={y0} r={3.5} glow={false} />
            <Label x={ex} y={y0 + 34} kind="label">eye</Label>
            <Line x1={ex} y1={y0} x2={px} y2={y0 - h} tone="soft" dashed />
            <Line x1={ex} y1={y0} x2={px} y2={y0 + h} tone="soft" dashed />
            <Arrow x1={px} y1={y0 + h} x2={px} y2={y0 - h} label="" />
            <Label x={px} y={y0 + h + 24} kind="label">object at the near point D</Label>
            <g opacity={sw}>
              <Line x1={ex} y1={y0} x2={px + 60} y2={y0 - H} tone="bright" />
              <Line x1={ex} y1={y0} x2={px + 60} y2={y0 + H} tone="bright" />
              <Arrow x1={px + 60} y1={y0 + H} x2={px + 60} y2={y0 - H} tone="soft" dashed />
              <Line x1={ex + 100} y1={y0 - 46} x2={ex + 100} y2={y0 + 46} tone="bright" />
              <Label x={ex + 100} y={y0 - 54} kind="label">lens</Label>
              <Label x={px + 60} y={y0 - H - 10} kind="label">virtual image</Label>
            </g>
            <Readout x={W - 12} y={22}>{`angle ratio = ${(H / h).toFixed(1)}`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function Microscope({ height = 300 }: { height?: number }) {
  return (
    <Anim title="A compound microscope: the objective makes a magnified real image, and the eyepiece acts as a magnifying glass on that image to make a final, much larger virtual image" height={height} loop={8}>
      {(t) => {
        const y0 = height / 2 - 10;
        const xo = 130, xe = 330;
        const fo = 30, uo = 40, fe = 90;
        const vo = 1 / (1 / fo - 1 / uo);
        const mo = -vo / uo;
        const h = 12;
        const P = (x: number, y: number): Pt => [x, y0 - y];
        const I1: V2 = [xo + vo, mo * h];
        const ue = xe - (xo + vo);
        const ve = 1 / (1 / fe - 1 / ue);
        const me = ve / -ue;
        const I2: V2 = [xe + ve, me * I1[1]];
        const pulse = 0.5 + 0.5 * Math.sin(TAU * t / 4);
        const rayA: V2[] = [[xo - uo, h], [xo, h], I1];
        const yA = h + ((I1[1] - h) * (xe - xo)) / (I1[0] - xo);
        const dirA = unit([xe - I2[0], yA - I2[1]]);
        const rayB: V2[] = [[xo - uo, h], [xo, 0], I1];
        const yB = 0 + ((I1[1] - 0) * (xe - xo)) / (I1[0] - xo);
        const dirB = unit([xe - I2[0], yB - I2[1]]);
        return (
          <g>
            <Line x1={20} y1={y0} x2={W - 20} y2={y0} tone="soft" />
            <Line x1={xo} y1={y0 - 40} x2={xo} y2={y0 + 40} tone="bright" />
            <Label x={xo} y={y0 - 48} kind="label">objective</Label>
            <Line x1={xe} y1={y0 - 80} x2={xe} y2={y0 + 80} tone="bright" />
            <Label x={xe} y={y0 - 88} kind="label">eyepiece</Label>
            <Arrow x1={xo - uo} y1={y0} x2={xo - uo} y2={y0 - h} />
            <Arrow x1={I1[0]} y1={y0} x2={I1[0]} y2={y0 - I1[1]} tone="bright" />
            <Arrow x1={I2[0]} y1={y0} x2={I2[0]} y2={y0 - I2[1]} tone="soft" dashed />
            <Flow path={rayA.map((p) => P(p[0], p[1]))} t={t} n={3} />
            <Flow path={rayB.map((p) => P(p[0], p[1]))} t={t} n={3} />
            <Flow path={[P(I1[0], I1[1]), P(xe, yA), P(xe + dirA[0] * 160, yA + dirA[1] * 160)]} t={t} n={3} />
            <Flow path={[P(I1[0], I1[1]), P(xe, yB), P(xe + dirB[0] * 160, yB + dirB[1] * 160)]} t={t} n={3} />
            <Trail points={[P(xe, yA), P(I2[0], I2[1])]} tone="soft" dashed />
            <Trail points={[P(xe, yB), P(I2[0], I2[1])]} tone="soft" dashed />
            <Label x={xo - uo} y={y0 + 22} kind="label">object</Label>
            <Label x={I1[0]} y={y0 - I1[1] - 8} kind="label">first image</Label>
            <Label x={I2[0] - 10} y={y0 - I2[1] - 8} kind="label">final image</Label>
            <circle cx={xe + 150} cy={y0} r={7 + 2 * pulse} fill="none" stroke="#fff" strokeOpacity={0.6} />
            <Label x={xe + 150} y={y0 + 30} kind="label">eye</Label>
            <Readout x={W - 12} y={22}>m = m₀ × mₑ</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function Telescope({ height = 270 }: { height?: number }) {
  return (
    <Anim title="An astronomical telescope in normal adjustment: parallel rays from a distant object meet at the focus of the objective and leave the eyepiece parallel again but at a larger angle" height={height} loop={8}>
      {(t) => {
        const y0 = height / 2 - 4;
        const xo = 90, fo = 240, fe = 60, xe = xo + fo + fe;
        const alpha = 0.1 * (1 + 0.35 * Math.sin((TAU * t) / 8));
        const tipY = -fo * alpha;
        const P = (x: number, y: number): Pt => [x, y0 - y];
        const slopeOut = -tipY / fe;
        const hs = [-44, 0, 44];
        return (
          <g>
            <Line x1={20} y1={y0} x2={W - 20} y2={y0} tone="soft" />
            <Line x1={xo} y1={y0 - 70} x2={xo} y2={y0 + 70} tone="bright" />
            <Line x1={xe} y1={y0 - 40} x2={xe} y2={y0 + 40} tone="bright" />
            <Label x={xo} y={y0 - 78} kind="label">objective</Label>
            <Label x={xe} y={y0 - 48} kind="label">eyepiece</Label>
            <Line x1={xo + fo} y1={y0 - 5} x2={xo + fo} y2={y0 + 5} tone="soft" />
            <Label x={xo + fo} y={y0 + 24} kind="label">focus</Label>
            {hs.map((h) => {
              const yE = h + (tipY - h) * ((xe - xo) / fo);
              return (
                <g key={h}>
                  <Flow path={[P(20, h + alpha * (xo - 20)), P(xo, h), P(xo + fo, tipY), P(xe, yE), P(xe + 150, yE + slopeOut * 150)]} t={t} n={3} />
                </g>
              );
            })}
            <Ball x={xo + fo} y={y0 - tipY} r={4} />
            <Readout x={W - 12} y={22}>{`α = ${(Math.atan(alpha) / DEG).toFixed(1)}°   β = ${(Math.atan(slopeOut) / DEG).toFixed(1)}°`}</Readout>
            <Label x={W - 12} y={44} kind="label" anchor="end">{`tan β / tan α = ${(slopeOut / alpha).toFixed(1)} = fo / fe`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Cassegrain({ height = 260 }: { height?: number }) {
  return (
    <Anim title="A reflecting telescope: a large concave mirror gathers parallel light and sends it to a small convex mirror, which reflects it back through a hole in the large mirror to a focus behind it" height={height} loop={8}>
      {(t) => {
        const y0 = height / 2;
        const xp = 480, fx = 330, xs = 380, fin = 560;
        const arcP = curve(40, 1, (q) => {
          const y = (q - 0.5) * 2 * 90;
          return [xp - (y * y) / 340, y0 + y] as Pt;
        });
        const hs = [-70, -45, 45, 70];
        return (
          <g>
            <Line x1={20} y1={y0} x2={W - 20} y2={y0} tone="soft" dashed />
            <Trail points={arcP} />
            <Line x1={xp - 3} y1={y0 - 16} x2={xp - 3} y2={y0 + 16} tone="bright" />
            <Line x1={xs} y1={y0 - 18} x2={xs} y2={y0 + 18} tone="bright" />
            {hs.map((h) => {
              const hitX = xp - (h * h) / 340;
              const yS = h * ((xs - fx) / (hitX - fx));
              return (
                <Flow key={h} path={[[30, y0 + h], [hitX, y0 + h], [xs, y0 + yS], [fin, y0]]} t={t} n={4} />
              );
            })}
            <Ball x={fin} y={y0} r={5} />
            <Label x={xp} y={y0 + 118} kind="label">large concave mirror</Label>
            <Label x={xs} y={y0 - 28} kind="label">small convex mirror</Label>
            <Label x={fin} y={y0 + 24} kind="label">image</Label>
          </g>
        );
      }}
    </Anim>
  );
}
