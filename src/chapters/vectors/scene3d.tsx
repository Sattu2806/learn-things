import { Arrow, Label, Line, Trail } from '../kit/Anim';

/**
 * A tiny 3D-to-screen helper for the vector diagrams. World axes: x toward the
 * viewer and right, y away to the right, z up. The view turns about the
 * vertical axis by `yaw` and is tilted down by `pitch`; `s` is pixels per unit.
 */
export type Vec3 = [number, number, number];
export type Pt = [number, number];
export type Proj = (x: number, y: number, z: number) => Pt;

export function makeProj(cx: number, cy: number, s: number, yaw: number, pitch = 0.45): Proj {
  const c = Math.cos(yaw);
  const sn = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return (x, y, z) => {
    const a = x * c - y * sn; // across the screen
    const b = x * sn + y * c; // away from the viewer
    return [cx + s * a, cy - s * (z * cp + b * sp)];
  };
}

/** A gently swinging view angle that comes back to where it started after `loop` seconds. */
export const swing = (t: number, loop: number, mid = -0.5, amp = 0.35) => mid + amp * Math.sin((2 * Math.PI * t) / loop);

export const f1 = (n: number, d = 1) => n.toFixed(d).replace('-', '−');

/** Axes with a faint floor grid, for a 3D picture. `L` is how far each axis runs, in units. */
export function Axes3({ P, L = [4, 4, 4], lo = [0, 0, 0], step = 1 }: { P: Proj; L?: Vec3; lo?: Vec3; step?: number }) {
  const grid = [];
  for (let i = lo[0]; i <= L[0]; i += step) {
    const a = P(i, lo[1], 0);
    const b = P(i, L[1], 0);
    grid.push(<Line key={`x${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} tone="faint" />);
  }
  for (let j = lo[1]; j <= L[1]; j += step) {
    const a = P(lo[0], j, 0);
    const b = P(L[0], j, 0);
    grid.push(<Line key={`y${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} tone="faint" />);
  }
  const o = P(0, 0, 0);
  const ends: [Pt, string][] = [
    [P(L[0] + 0.25, 0, 0), 'x'],
    [P(0, L[1] + 0.25, 0), 'y'],
    [P(0, 0, L[2] + 0.2), 'z'],
  ];
  return (
    <g>
      {grid}
      {ends.map(([e, name]) => (
        <g key={name}>
          <Arrow x1={o[0]} y1={o[1]} x2={e[0]} y2={e[1]} tone="soft" />
          <Label x={e[0] + (name === 'z' ? 0 : 10)} y={e[1] + (name === 'z' ? -8 : 8)}>
            {name}
          </Label>
        </g>
      ))}
    </g>
  );
}

/** An arrow between two 3D points. */
export function Arrow3({ P, from = [0, 0, 0], to, tone, label, dashed, width }: { P: Proj; from?: Vec3; to: Vec3; tone?: 'bright' | 'soft' | 'faint'; label?: string; dashed?: boolean; width?: number }) {
  const a = P(...from);
  const b = P(...to);
  return <Arrow x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} tone={tone} label={label} dashed={dashed} width={width} />;
}

/** A path through 3D points. */
export function Path3({ P, pts, dashed, tone }: { P: Proj; pts: Vec3[]; dashed?: boolean; tone?: 'bright' | 'soft' | 'faint' }) {
  return <Trail points={pts.map((p) => P(...p))} dashed={dashed} tone={tone} />;
}

/** The staircase of component legs: along x, then y, then z, each drawn by its own progress 0 to 1. */
export function Stairs({ P, v, px = 1, py = 1, pz = 1 }: { P: Proj; v: Vec3; px?: number; py?: number; pz?: number }) {
  const pts: Vec3[] = [[0, 0, 0], [v[0] * px, 0, 0]];
  if (py > 0) pts.push([v[0], v[1] * py, 0]);
  if (pz > 0) pts.push([v[0], v[1], v[2] * pz]);
  return <Path3 P={P} pts={pts} dashed tone="soft" />;
}
