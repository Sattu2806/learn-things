import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Label, Line, Readout, Trail, ease, phase, W } from '../kit/Anim';

/** Animated diagrams for electromagnetic induction. Every mark moves, even the field symbols. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

const pulse = (t: number, k = 0, p = 2.4) => 0.5 + 0.3 * Math.sin((TAU * t) / p + k);

function Into({ x, y, s = 5, o = 1 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g style={{ opacity: o }}>
      <circle className="fig-guide" cx={x} cy={y} r={s * 1.7} fill="none" />
      <line className="fig-guide" x1={x - s} y1={y - s} x2={x + s} y2={y + s} />
      <line className="fig-guide" x1={x - s} y1={y + s} x2={x + s} y2={y - s} />
    </g>
  );
}

function IntoGrid({ x1, y1, x2, y2, gap = 36, t }: { x1: number; y1: number; x2: number; y2: number; gap?: number; t: number }) {
  const out: ReactNode[] = [];
  let i = 0;
  for (let y = y1; y <= y2; y += gap) for (let x = x1; x <= x2; x += gap) out.push(<Into key={`${x}-${y}`} x={x} y={y} s={4} o={0.25 + 0.5 * pulse(t, i++ * 0.7)} />);
  return <g>{out}</g>;
}

/** A small bar magnet, S on the left (open) and N on the right (filled). */
function Bar({ x, y, w = 90, h = 28 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect className="kit-block" x={x - w / 2} y={y - h / 2} width={w / 2} height={h} rx={3} />
      <rect className="kit-block is-filled" x={x} y={y - h / 2} width={w / 2} height={h} rx={3} />
      <text className="fig-sym" x={x - w / 4} y={y + 6} textAnchor="middle">S</text>
      <text className="fig-sym" x={x + w / 4} y={y + 6} textAnchor="middle" style={{ fill: '#000' }}>N</text>
    </g>
  );
}

/** A zero-centre meter: val in [-1, 1] swings the needle left or right. */
function Dial({ cx, cy, r = 52, val }: { cx: number; cy: number; r?: number; val: number }) {
  const a = (Math.max(-1, Math.min(1, val)) * 55 * Math.PI) / 180;
  return (
    <g>
      <path className="fig-guide" d={`M${cx - r * Math.sin(Math.PI / 3)} ${cy - r * Math.cos(Math.PI / 3)}A${r} ${r} 0 0 1 ${cx + r * Math.sin(Math.PI / 3)} ${cy - r * Math.cos(Math.PI / 3)}`} fill="none" />
      <line className="fig-guide" x1={cx} y1={cy - r} x2={cx} y2={cy - r + 8} />
      <line className="fig-path" x1={cx} y1={cy} x2={cx + r * 0.88 * Math.sin(a)} y2={cy - r * 0.88 * Math.cos(a)} />
      <circle className="fig-ball" cx={cx} cy={cy} r={4} />
      <text className="fig-sym" x={cx} y={cy + 22} textAnchor="middle">G</text>
    </g>
  );
}

/** A coil seen from the side: n loops drawn as ellipses with dots circulating when current is on. */
function Coil({ x, y, n = 6, gap = 13, rx = 9, ry = 38, cur = 0, t }: { x: number; y: number; n?: number; gap?: number; rx?: number; ry?: number; cur?: number; t: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const cx = x + i * gap;
        const a = TAU * ((t * 0.7 * Math.sign(cur)) + i * 0.13);
        return (
          <g key={i}>
            <ellipse className="fig-guide" cx={cx} cy={y} rx={rx} ry={ry} fill="none" />
            {Math.abs(cur) > 0.05 && <Ball x={cx + rx * Math.cos(a)} y={y - ry * Math.sin(a)} r={2.6} glow={false} />}
          </g>
        );
      })}
    </g>
  );
}

// ------------------------------------------------------------------ Faraday's experiment

export function MagnetCoil() {
  return (
    <Anim title="A magnet is pushed toward a coil joined to a meter; the needle kicks while the magnet moves, kicks the other way when it is pulled back faster, and sits at zero whenever the magnet is still" height={230} loop={8}>
      {(t) => {
        const pos = (tt: number) => 90 + 140 * ease(phase(tt, 0.5, 2.0)) - 140 * ease(phase(tt, 3.6, 4.6));
        const vel = (pos(t + 0.02) - pos(t - 0.02)) / 0.04;
        const val = vel / 210;
        return (
          <g>
            <Bar x={pos(t)} y={110} />
            <Arrow x1={pos(t) - 24} y1={150} x2={pos(t) - 24 + vel * 0.25} y2={150} tone="soft" label="v" />
            <Coil x={300} y={110} cur={val} t={t} />
            <Line x1={300} y1={72} x2={300} y2={34} />
            <Line x1={300} y1={34} x2={520} y2={34} />
            <Line x1={520} y1={34} x2={520} y2={82} />
            <Line x1={365} y1={148} x2={365} y2={196} />
            <Line x1={365} y1={196} x2={520} y2={196} />
            <Line x1={520} y1={196} x2={520} y2={138} />
            <Dial cx={520} cy={120} val={val} />
            <Label x={520} y={216} kind="label">{Math.abs(val) < 0.03 ? 'no motion, no current' : val > 0 ? 'magnet in: current one way' : 'magnet out: the other way'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ flux

export function Flux() {
  return (
    <Anim title="A flat loop seen edge-on turns in a uniform field; the field lines passing through it are the flux, and they are most when the loop faces the field, and none when it is edge-on to it" height={250} loop={8}>
      {(t) => {
        const th = (TAU * t) / 8;
        const cx = 190, cy = 125, w = 150;
        const ext = (w / 2) * Math.abs(Math.cos(th));
        const dx = (w / 2) * Math.sin(th), dy = (w / 2) * Math.cos(th);
        const lines = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
        return (
          <g>
            {lines.map((i) => {
              const y = cy + i * 12;
              const inside = Math.abs(i * 12) <= ext + 0.1;
              const o = 8 * Math.sin(TAU * (t / 1.6 - i * 0.05));
              return <Arrow key={i} x1={40 + o} y1={y} x2={110 + o} y2={y} tone={inside ? 'bright' : 'soft'} />;
            })}
            {lines.map((i) => {
              const y = cy + i * 12;
              const inside = Math.abs(i * 12) <= ext + 0.1;
              const o = 8 * Math.sin(TAU * (t / 1.6 - i * 0.05));
              return <Arrow key={`b${i}`} x1={270 + o} y1={y} x2={340 + o} y2={y} tone={inside ? 'bright' : 'soft'} />;
            })}
            <Line x1={cx - dx} y1={cy + dy} x2={cx + dx} y2={cy - dy} tone="bright" />
            <Arrow x1={cx} y1={cy} x2={cx + 36 * Math.cos(th)} y2={cy - 36 * Math.sin(th)} tone="soft" label="n" />
            <Line x1={cx + 172} y1={cy - ext} x2={cx + 172} y2={cy + ext} tone="soft" />
            <Label x={cx + 184} y={cy + 6} kind="label" anchor="start">A cos θ</Label>
            <Label x={500} y={62} kind="sym">Φ = B A cos θ</Label>
            <Label x={500} y={216} kind="label">lines through the loop</Label>
            <Readout x={W - 14} y={20}>{`θ = ${(((th * 180) / Math.PI) % 360).toFixed(0)}°, Φ = ${(Math.cos(th) * 100).toFixed(0)}%`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

export function FaradayGraphs() {
  return (
    <Anim title="Top: the flux through a coil rises steadily, holds, then falls twice as fast. Bottom: the emf is a steady negative value while it rises, zero while it holds, and a bigger positive value while it falls, so the emf follows the slope of the flux graph" height={300} loop={8}>
      {(t) => {
        const Phi = (u: number) => (u < 1 ? 0 : u < 3 ? 0.4 * (u - 1) : u < 4.5 ? 0.8 : u < 5.5 ? 0.8 * (1 - (u - 4.5)) : 0);
        const eps = (u: number) => (u < 1 ? 0 : u < 3 ? -0.4 : u < 4.5 ? 0 : u < 5.5 ? 0.8 : 0);
        const x0 = 80, wx = 400, k = wx / 7;
        const y1 = 125, y2 = 250, sc = 80;
        const tt = Math.min(t, 7);
        return (
          <g>
            <Axes x={x0} y={y1} w={wx + 20} h={100} xLabel="t" yLabel="Φ" />
            <Axes x={x0} y={y2} w={wx + 20} h={42} below={44} xLabel="t" yLabel="ε" />
            <Trail points={curve(140, 7, (s) => [x0 + s * k, y1 - sc * Phi(s)])} tone="soft" />
            <Trail points={curve(140, 7, (s) => [x0 + s * k, y2 - sc * 0.5 * eps(s)])} tone="soft" />
            <Trail points={curve(140, tt, (s) => [x0 + s * k, y1 - sc * Phi(s)])} />
            <Trail points={curve(140, tt, (s) => [x0 + s * k, y2 - sc * 0.5 * eps(s)])} />
            <Line x1={x0 + tt * k} y1={y1 + 4} x2={x0 + tt * k} y2={y2 + 44} tone="soft" dashed />
            <Ball x={x0 + tt * k} y={y1 - sc * Phi(tt)} r={5} />
            <Ball x={x0 + tt * k} y={y2 - sc * 0.5 * eps(tt)} r={5} />
            <Label x={x0 + wx + 24} y={y1 - 70} kind="sym" anchor="start">ε = −dΦ/dt</Label>
            <Label x={x0 + wx + 24} y={y1 - 40} kind="label" anchor="start">−(slope of Φ)</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ Lenz

export function Lenz() {
  return (
    <Anim title="A bar magnet moves toward a closed ring and then away; the induced current always makes a field that fights the change, pushing the magnet back as it comes in and pulling it back as it leaves" height={250} loop={8}>
      {(t) => {
        const pos = (tt: number) => 90 + 130 * ease(phase(tt, 0.6, 2.4)) - 130 * ease(phase(tt, 4.4, 6.2));
        const vel = (pos(t + 0.02) - pos(t - 0.02)) / 0.04;
        const s = Math.sign(vel) * Math.min(1, Math.abs(vel) / 120);
        const rx = 14, ry = 60, cx = 400, cy = 120;
        return (
          <g>
            <Bar x={pos(t)} y={cy} w={100} h={32} />
            <ellipse className="fig-guide" cx={cx} cy={cy} rx={rx} ry={ry} fill="none" />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = TAU * (i / 6 + t * 0.5 * s);
              return <Ball key={i} x={cx + rx * Math.cos(a)} y={cy - ry * Math.sin(a)} r={3} glow={false} />;
            })}
            <Arrow x1={cx + 40 * 0.6} y1={cy} x2={cx + 40 * 0.6 - 56 * s} y2={cy} label="" />
            <Label x={W - 14} y={cy + 54} kind="label" anchor="end">induced field</Label>
            <Label x={W - 14} y={cy + 76} kind="label" anchor="end">{Math.abs(s) < 0.05 ? 'none: nothing changing' : s > 0 ? 'points back at the magnet' : 'points along the magnet'}</Label>
            <Label x={cx - 14} y={cy - ry - 14} kind="sym">{Math.abs(s) < 0.05 ? '' : s > 0 ? 'N (repels)' : 'S (attracts)'}</Label>
            <Arrow x1={pos(t) + 54} y1={200} x2={pos(t) + 54 + vel * 0.3} y2={200} tone="soft" label="v" />
            <Arrow x1={pos(t)} y1={176} x2={pos(t) - s * 40} y2={176} label="" />
            <Label x={20} y={234} kind="label" anchor="start">force on magnet opposes motion</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ motional emf

export function RodCharges() {
  return (
    <Anim title="A rod moves sideways through a field pointing into the page; the magnetic force pushes the free positive charges toward the top end, until the pile-up makes an electric field that balances the push, leaving a voltage between the ends" height={250} loop={7}>
      {(t) => {
        const x = 200 + 40 * phase(t, 0, 7);
        const top = 50, bot = 200;
        const build = ease(phase(t, 0.5, 3.5));
        return (
          <g>
            <IntoGrid x1={60} y1={40} x2={560} y2={210} gap={50} t={t} />
            <rect className="kit-block" x={x - 6} y={top} width={12} height={bot - top} rx={5} />
            {[0, 1, 2, 3, 4].map((i) => {
              const y0 = bot - 24 - (i * (bot - top - 48)) / 4;
              const y1 = top + 16 + i * 15;
              return <Label key={i} x={x} y={y0 + (y1 - y0) * build + 5} kind="sym">+</Label>;
            })}
            <Label x={x} y={top - 8} kind="sym">{build > 0.8 ? '+ + +' : ''}</Label>
            <Label x={x} y={bot + 18} kind="sym">{build > 0.8 ? '− − −' : ''}</Label>
            <Arrow x1={x + 20} y1={125} x2={x + 80} y2={125} label="v" />
            <Arrow x1={x - 20} y1={150} x2={x - 20} y2={150 - 60 * (1 - build * 0.9)} tone="soft" label="F" />
            <Arrow x1={x - 40} y1={70} x2={x - 40} y2={70 + 60 * build} tone="soft" label="E" />
            <Label x={560} y={100} kind="sym" anchor="end">ε = B l v</Label>
            <Label x={560} y={130} kind="label" anchor="end">q v B  =  q E at balance</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function MotionalRod() {
  return (
    <Anim title="A rod is pulled to the right along two rails in a field pointing into the page; the loop's area grows, an emf drives a current around the loop, and the field pulls back on the rod, so the puller must keep working to move it" height={260} loop={9}>
      {(t) => {
        const xl = 120, xr0 = 280, yA = 60, yB = 190;
        const moving = t > 0.6 && t < 6;
        const x = t < 0.6 ? xr0 : t < 6 ? xr0 + 55 * (t - 0.6) : xr0 + 55 * 5.4;
        const vv = moving ? 1 : 0;
        const dots = Array.from({ length: 10 }, (_, i) => {
          const s = (i / 10 + (t * 0.35 * vv) / 1) % 1;
          // counterclockwise: along the bottom rail to the right, up the rod, left along the top, down the left side.
          const per = [(x - xl) * 1, yB - yA, x - xl, yB - yA];
          const total = per.reduce((a, b) => a + b, 0);
          let d = s * total;
          let p: Pt = [xl, yB];
          if (d < per[0]) p = [xl + d, yB];
          else if ((d -= per[0]) < per[1]) p = [x, yB - d];
          else if ((d -= per[1]) < per[2]) p = [x - d, yA];
          else p = [xl, yA + (d - per[2])];
          return <Ball key={i} x={p[0]} y={p[1]} r={3} glow={false} />;
        });
        return (
          <g>
            <Line x1={xl} y1={yA} x2={560} y2={yA} />
            <Line x1={xl} y1={yB} x2={560} y2={yB} />
            <Line x1={xl} y1={yA} x2={xl} y2={yB} />
            <IntoGrid x1={150} y1={90} x2={540} y2={160} gap={46} t={t} />
            <rect className="kit-block is-filled" x={x - 5} y={yA - 4} width={10} height={yB - yA + 8} rx={3} />
            {vv > 0 && dots}
            {vv > 0 && <Arrow x1={x + 12} y1={125} x2={x + 62} y2={125} label="v" />}
            {vv > 0 && <Arrow x1={x - 12} y1={155} x2={x - 62} y2={155} tone="soft" label="F" />}
            <Label x={(xl + x) / 2} y={yB + 28} kind="label">area grows as the rod moves</Label>
            <Label x={xl + 6} y={yA - 12} kind="sym" anchor="start">{vv > 0 ? 'ε = B l v, I = B l v / R' : 'rod stopped: no emf'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function RotatingRod() {
  return (
    <Anim title="A rod turns about one end in a field pointing into the page; it sweeps out a fan of area at a steady rate, and the emf between its ends is half B omega l squared" height={250} loop={8}>
      {(t) => {
        const cx = 200, cy = 130, L = 100;
        const a = (TAU * t) / 4;
        const ghosts = Array.from({ length: 9 }, (_, k) => a - k * 0.14);
        return (
          <g>
            <IntoGrid x1={60} y1={30} x2={560} y2={230} gap={50} t={t} />
            {ghosts.slice(1).map((g, k) => (
              <Line key={k} x1={cx} y1={cy} x2={cx + L * Math.cos(g)} y2={cy - L * Math.sin(g)} tone="soft" />
            ))}
            <Trail points={curve(30, 1.12, (u) => [cx + L * Math.cos(a - u), cy - L * Math.sin(a - u)] as Pt)} tone="soft" dashed />
            <Line x1={cx} y1={cy} x2={cx + L * Math.cos(a)} y2={cy - L * Math.sin(a)} tone="bright" />
            <Ball x={cx} y={cy} r={4} />
            <Ball x={cx + L * Math.cos(a)} y={cy - L * Math.sin(a)} r={5} />
            <Arrow x1={cx + L * Math.cos(a)} y1={cy - L * Math.sin(a)} x2={cx + L * Math.cos(a) + 36 * -Math.sin(a)} y2={cy - L * Math.sin(a) - 36 * Math.cos(a)} tone="soft" label="v" />
            <Label x={cx + 24} y={cy + 28} kind="sym">l</Label>
            <Label x={470} y={90} kind="sym">area swept = ½ l² θ</Label>
            <Label x={470} y={130} kind="sym">ε = ½ B ω l²</Label>
            <Label x={470} y={170} kind="label">speed grows from 0 to ω l along the rod</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ eddy currents

export function Eddy() {
  return (
    <Anim title="Two metal plates swing through a magnetic field: the solid plate fills with swirling eddy currents that drag on it and stop it quickly, while the plate with slits cuts those currents up and swings on much longer" height={290} loop={10}>
      {(t) => {
        const pend = (cx: number, g: number, slits: boolean) => {
          const L = 150, py = 20;
          const th = 0.6 * Math.exp(-g * t) * Math.cos((TAU * t) / 2.6);
          const w = 0.6 * Math.exp(-g * t) * (-g * Math.cos((TAU * t) / 2.6) - (TAU / 2.6) * Math.sin((TAU * t) / 2.6));
          const bx = cx + L * Math.sin(th), by = py + L * Math.cos(th);
          const inField = Math.abs(bx - cx) < 60;
          const o = Math.min(1, Math.abs(w) * 4) * (slits ? 0.25 : 1) * (inField ? 1 : 0.35);
          return (
            <g key={cx}>
              <IntoGrid x1={cx - 54} y1={py + 100} x2={cx + 54} y2={py + 190} gap={36} t={t} />
              <Line x1={cx - 30} y1={py} x2={cx + 30} y2={py} />
              <Line x1={cx} y1={py} x2={bx} y2={by - 28} />
              <rect className="kit-block" x={bx - 34} y={by - 28} width={68} height={56} rx={3} />
              {slits && [-18, -4, 10].map((o2) => <line key={o2} className="fig-guide" x1={bx + o2 + 4} y1={by - 28} x2={bx + o2 + 4} y2={by + 10} />)}
              {slits ? (
                [-26, -12, 2, 20].map((o2, i) => {
                  const a = TAU * (t * 0.9 * Math.sign(w) + i * 0.2);
                  return <Ball key={i} x={bx + o2 + 4 + 4 * Math.cos(a)} y={by - 8 - 14 * Math.sin(a)} r={2.2} glow={false} />;
                })
              ) : (
                [0, 1, 2, 3, 4].map((i) => {
                  const a = TAU * (t * 0.9 * Math.sign(w) + i * 0.2);
                  return <Ball key={i} x={bx + 22 * Math.cos(a)} y={by - 20 * Math.sin(a)} r={3} glow={false} />;
                })
              )}
              <ellipse className="fig-guide" cx={bx} cy={by} rx={22} ry={20} fill="none" style={{ opacity: slits ? 0 : o }} />
              <Arrow x1={bx} y1={by + 42} x2={bx - Math.sign(w) * 40 * o} y2={by + 42} tone="soft" />
              <Label x={cx} y={282} kind="label">{slits ? 'slotted plate: swings on' : 'solid plate: braked hard'}</Label>
            </g>
          );
        };
        return (
          <g>
            {pend(170, 0.55, false)}
            {pend(470, 0.07, true)}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ inductance

const currentRamp = (u: number) => (u < 0.6 ? 0 : u < 2.6 ? 0.5 * (u - 0.6) : u < 4 ? 1 : u < 5 ? 1 - (u - 4) : 0);
const rampSlope = (u: number) => (u < 0.6 ? 0 : u < 2.6 ? 0.5 : u < 4 ? 0 : u < 5 ? -1 : 0);

export function SelfInduct() {
  return (
    <Anim title="The current in a coil is ramped up, held, and cut quickly; the coil's own induced emf opposes the change, so it is negative and small while the current rises, zero while it holds, and large and positive while the current falls. The bar shows the energy stored in the field" height={300} loop={8}>
      {(t) => {
        const x0 = 270, wx = 330, k = wx / 6.5, y1 = 105, y2 = 235, sc = 70;
        const I = currentRamp(t);
        const e = -rampSlope(t);
        return (
          <g>
            <Coil x={50} y={90} n={7} gap={14} rx={10} ry={42} cur={I} t={t} />
            <Line x1={50} y1={48} x2={30} y2={48} />
            <Line x1={50} y1={132} x2={30} y2={132} />
            <Arrow x1={60} y1={26} x2={60 + 30 * I} y2={26} label="I" />
            <Arrow x1={160} y1={150} x2={160 + e * -40} y2={150} tone="soft" />
            <Label x={110} y={172} kind="label">{Math.abs(e) < 0.05 ? 'steady: no emf' : e < 0 ? 'emf opposes the rise' : 'emf props up the fall'}</Label>
            <Label x={140} y={200} kind="label">energy ½ L I²</Label>
            <rect className="kit-block" x={40} y={212} width={200} height={14} />
            <rect className="kit-block is-filled" x={40} y={212} width={200 * I * I} height={14} />
            <Axes x={x0} y={y1} w={wx + 20} h={80} xLabel="t" yLabel="I" />
            <Axes x={x0} y={y2} w={wx + 20} h={60} below={50} xLabel="t" yLabel="ε" />
            <Trail points={curve(130, 6.5, (s) => [x0 + s * k, y1 - sc * currentRamp(s)])} tone="soft" />
            <Trail points={curve(130, 6.5, (s) => [x0 + s * k, y2 + sc * 0.4 * rampSlope(s)])} tone="soft" />
            <Trail points={curve(130, t, (s) => [x0 + s * k, y1 - sc * currentRamp(s)])} />
            <Trail points={curve(130, t, (s) => [x0 + s * k, y2 + sc * 0.4 * rampSlope(s)])} />
            <Ball x={x0 + t * k} y={y1 - sc * I} r={5} />
            <Ball x={x0 + t * k} y={y2 + sc * 0.4 * rampSlope(t)} r={5} />
            <Label x={x0 + 10} y={y2 + 56} kind="sym" anchor="start">ε = −L dI/dt</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function Mutual() {
  return (
    <Anim title="Two coils side by side: when the current in the first coil is ramped, the field through the second coil changes and the second coil's meter kicks, even though the two are not connected" height={260} loop={8}>
      {(t) => {
        const I = currentRamp(t);
        const slope = rampSlope(t);
        const arcs = [0.4, 0.7, 1];
        return (
          <g>
            <Coil x={110} y={110} n={6} gap={13} rx={9} ry={44} cur={I} t={t} />
            <Coil x={430} y={110} n={6} gap={13} rx={9} ry={44} cur={-slope} t={t} />
            {arcs.map((a, i) => (
              <path key={i} className="fig-guide" style={{ opacity: 0.15 + 0.7 * I * (1 - i * 0.2) }} d={`M190 110C250 ${110 - 70 * a} 360 ${110 - 70 * a} 428 110`} fill="none" strokeDasharray="5 6" strokeDashoffset={-t * 18} />
            ))}
            <Label x={146} y={190} kind="label">primary: current I₁</Label>
            <Label x={466} y={190} kind="label">secondary: no battery</Label>
            <Dial cx={466} cy={236} r={34} val={-slope * 0.9} />
            <Label x={300} y={236} kind="sym">ε₂ = −M dI₁/dt</Label>
            <Label x={300} y={30} kind="label">{Math.abs(slope) < 0.05 ? 'I₁ steady: no emf in the secondary' : slope > 0 ? 'I₁ rising: emf in the secondary' : 'I₁ falling: emf the other way'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the generator

export function Generator() {
  return (
    <Anim title="A coil turns steadily in a uniform field; the flux through it is a cosine of the angle and the emf is a sine, a quarter of a turn out of step, so the emf is biggest when the coil is edge-on to the field and the flux is zero" height={260} loop={8}>
      {(t) => {
        const T = 4;
        const th = (TAU * t) / T;
        const cx = 120, cy = 130, w = 130;
        const dx = (w / 2) * Math.sin(th), dy = (w / 2) * Math.cos(th);
        const gx = 280, gw = 330, gy = 130, A = 70;
        const k = gw / 8;
        const f = (u: number) => Math.cos((TAU * u) / T);
        const e = (u: number) => Math.sin((TAU * u) / T);
        return (
          <g>
            {[-70, -35, 0, 35, 70].map((o, i) => (
              <Arrow key={i} x1={20 + 6 * Math.sin(TAU * (t / 1.6 - i * 0.1))} y1={cy + o} x2={52 + 6 * Math.sin(TAU * (t / 1.6 - i * 0.1))} y2={cy + o} tone="soft" />
            ))}
            <Line x1={cx - dx} y1={cy + dy} x2={cx + dx} y2={cy - dy} tone="bright" />
            <Ball x={cx} y={cy} r={3.5} />
            <Ball x={cx + dx} y={cy - dy} r={5} />
            <Ball x={cx - dx} y={cy + dy} r={5} />
            <Arrow x1={cx + dx} y1={cy - dy} x2={cx + dx + 34 * Math.cos(th)} y2={cy - dy - 34 * Math.sin(th)} tone="soft" />
            <Arrow x1={cx - dx} y1={cy + dy} x2={cx - dx - 34 * Math.cos(th)} y2={cy + dy + 34 * Math.sin(th)} tone="soft" />
            <Axes x={gx} y={gy} w={gw + 20} h={A + 18} below={A + 18} xLabel="t" />
            <Trail points={curve(120, 8, (u) => [gx + u * k, gy - A * f(u)])} tone="soft" dashed />
            <Trail points={curve(120, 8, (u) => [gx + u * k, gy - A * e(u)])} tone="soft" />
            <Trail points={curve(120, t, (u) => [gx + u * k, gy - A * e(u)])} />
            <Ball x={gx + t * k} y={gy - A * e(t)} r={5} />
            <Ball x={gx + t * k} y={gy - A * f(t)} r={4} ghost />
            <Label x={gx + 6} y={gy + A + 38} kind="label" anchor="start">solid: emf ε    dashed: flux Φ</Label>
            <Label x={cx} y={gy + A + 38} kind="sym">ε = N B A ω sin ω t</Label>
            <Readout x={W - 14} y={20}>{`ε = ${(e(t) * 100).toFixed(0)}% of peak`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}
