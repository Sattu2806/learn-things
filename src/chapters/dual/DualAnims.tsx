import type { ReactNode } from 'react';
import { Anim, Arrow, Axes, Ball, Label, Line, Trail, clamp, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for the dual nature of radiation and matter. */

const TAU = 2 * Math.PI;
const DEG = Math.PI / 180;
type Pt = [number, number];

/** Real subscripts and superscripts inside SVG text. */
const Sub = ({ children }: { children: ReactNode }) => (
  <tspan baselineShift="-18%" fontSize="75%">
    {children}
  </tspan>
);
const Sup = ({ children }: { children: ReactNode }) => (
  <tspan baselineShift="super" fontSize="72%">
    {children}
  </tspan>
);

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

const frac = (x: number) => x - Math.floor(x);

/** A short wave packet centred at (cx, cy) travelling along direction angle a: n cycles of wavelength lam. */
function packet(cx: number, cy: number, a: number, lam: number, amp: number, len: number, shift = 0): Pt[] {
  const ux = Math.cos(a), uy = Math.sin(a);
  return curve(60, len, (s) => {
    const x = s - len / 2;
    const env = Math.exp(-((x / (len * 0.3)) ** 2));
    const y = amp * env * Math.sin((TAU * x) / lam + shift);
    return [cx + ux * x - uy * y, cy + uy * x + ux * y];
  });
}

// ------------------------------------------------------------------ electrons in a metal

export function MetalWell() {
  return (
    <Anim title="Electrons roam inside a metal held in by an energy barrier; a photon hits one and lifts it up the energy diagram, and if it climbs above the top of the barrier it escapes with whatever is left over as kinetic energy" height={260} loop={8}>
      {(t) => {
        const hit = 2.2;
        const rise = ease(phase(t, hit, hit + 1.6));
        const exit = ease(phase(t, hit + 1.6, hit + 3.6));
        const px = 30 + 90 * phase(t, 0.3, hit);
        const ex = 150 + 120 * exit;
        const ey = 150 - 16 * rise - 10 * exit;
        const ox = 360, base = 200, top = 40;
        const fermi = 150;
        const yE = fermi - (fermi - top + 40) * rise;
        return (
          <g>
            <rect className="fig-guide" x={30} y={110} width={150} height={110} rx={4} fill="#fff" fillOpacity={0.07} />
            <Label x={105} y={236} kind="label">metal</Label>
            {[0, 1, 2, 3, 4].map((k) => (
              <Ball key={k} x={50 + k * 28 + 8 * Math.sin(TAU * (0.5 * t + k * 0.3))} y={170 + 22 * Math.cos(TAU * (0.4 * t + k * 0.21)) + (k === 2 ? 0 : 0)} r={4} glow={false} />
            ))}
            {t < hit + 1.6 && <Ball x={150} y={160 - 16 * rise} r={5} glow={false} />}
            {t >= hit + 1.6 && <Ball x={ex} y={ey} r={5} />}
            <Trail points={packet(px, 92 + 0.45 * (px - 30), 0.55, 18, 8, 60, -TAU * t * 2)} />
            <Label x={50} y={64} kind="sym" anchor="start">photon hν</Label>
            <Line x1={ox} y1={top} x2={ox + 230} y2={top} tone="soft" dashed />
            <Label x={ox + 236} y={top + 4} kind="label" anchor="start">E = 0</Label>
            <Line x1={ox} y1={fermi} x2={ox + 230} y2={fermi} tone="bright" />
            <Label x={ox + 236} y={fermi + 4} kind="label" anchor="start">−φ₀</Label>
            <Arrow x1={ox + 40} y1={fermi} x2={ox + 40} y2={top + 6} tone="soft" label="φ₀" labelAt="mid" />
            <Arrow x1={ox + 110} y1={fermi} x2={ox + 110} y2={Math.min(fermi - 2, yE)} width={3.4} label="hν" labelAt="mid" />
            <Ball x={ox + 110} y={yE} r={5} glow={false} />
            {yE < top - 2 && (
              <g>
                <Line x1={ox + 150} y1={top} x2={ox + 150} y2={yE} tone="bright" />
                <Label x={ox + 164} y={(top + yE) / 2 + 4} kind="sym" anchor="start">K</Label>
              </g>
            )}
            <Line x1={ox} y1={top - 18} x2={ox} y2={base} tone="soft" />
            <Label x={ox - 8} y={top - 6} kind="sym" anchor="end">E</Label>
            <Label x={W - 14} y={252} kind="label" anchor="end">the most loosely held electron needs φ₀</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the photoelectric tube

export function PhotoTube({ title, above = true, photons = 3, height = 270 }: { title: string; above?: boolean; photons?: number; height?: number }) {
  return (
    <Anim title={title} height={height} loop={6}>
      {(t) => {
        const cx = 100, ax = 400, top = 36, bot = 146;
        const wireY = 215;
        const K = above ? 1 : 0;
        const els: ReactNode[] = [];
        const lights: ReactNode[] = [];
        const T = 1.5;
        for (let k = 0; k < photons; k++) {
          const y = top + 18 + ((bot - top - 36) * (k + 0.5)) / photons;
          const ph0 = frac(t / T + k / photons);
          // photon travels in from the left, reaches the cathode at ph0 = 0.35
          const pp = clamp(ph0 / 0.35);
          if (ph0 < 0.35) {
            const x = lerp(-30, cx - 6, pp);
            lights.push(<Trail key={`p${k}`} points={packet(x - 10, y - 18 * (1 - pp) + 0, 0.35 * (1 - pp) + 0.0, 16, 6, 44, -TAU * t * 2)} />);
          }
          if (K && ph0 >= 0.35) {
            const u = (ph0 - 0.35) / 0.65;
            els.push(<Ball key={`e${k}`} x={lerp(cx + 8, ax - 8, u)} y={y} r={3.8} glow={false} />);
          }
          if (!K && ph0 >= 0.35 && ph0 < 0.55) {
            els.push(<circle key={`h${k}`} className="fig-guide" cx={cx - 2} cy={y} r={4 + 22 * ((ph0 - 0.35) / 0.2)} fill="none" style={{ opacity: 1 - (ph0 - 0.35) / 0.2 }} />);
          }
        }
        const I = K * photons;
        const needle = (-55 + 34 * I) * DEG;
        const wire: Pt[] = [
          [ax, bot + 4],
          [ax, wireY],
          [cx, wireY],
          [cx, bot + 4],
        ];
        const wireDots: ReactNode[] = [];
        if (K) {
          const total = Math.abs(ax - cx) + 2 * (wireY - bot - 4);
          for (let k = 0; k < 8; k++) {
            const s = frac(t * 0.25 * photons + k / 8) * total;
            let p: Pt;
            const l1 = wireY - bot - 4;
            const l2 = ax - cx;
            if (s < l1) p = [ax, bot + 4 + s];
            else if (s < l1 + l2) p = [ax - (s - l1), wireY];
            else p = [cx, wireY - (s - l1 - l2)];
            wireDots.push(<circle key={k} className="fig-ball" cx={p[0]} cy={p[1]} r={2.6} />);
          }
        }
        return (
          <g>
            <rect className="fig-guide" x={40} y={top} width={400} height={bot - top + 14} rx={20} fill="none" />
            <Line x1={cx} y1={top + 8} x2={cx} y2={bot} tone="bright" />
            <Line x1={ax} y1={top + 8} x2={ax} y2={bot} tone="bright" />
            <Label x={cx - 14} y={top + 4} kind="sym" anchor="end">C</Label>
            <Label x={ax + 14} y={top + 4} kind="sym" anchor="start">A</Label>
            <Label x={240} y={top + 18} kind="label">vacuum</Label>
            <Trail points={wire} tone="soft" />
            <Trail points={[[cx, wireY], [cx + 100, wireY]]} tone="soft" />
            <circle className="fig-guide" cx={240} cy={wireY} r={24} fill="#000" />
            <Line x1={240} y1={wireY + 12} x2={240 + 18 * Math.cos(needle - Math.PI / 2)} y2={wireY + 12 + 18 * Math.sin(needle - Math.PI / 2)} tone="bright" />
            <Label x={240} y={wireY + 42} kind="sym">µA</Label>
            {lights}
            {els}
            {wireDots}
            <Label x={W - 14} y={80} kind="val" anchor="end">{above ? 'frequency above threshold' : 'frequency below threshold'}</Label>
            <Label x={W - 14} y={102} kind="val" anchor="end">{above ? `${photons} photons per beat: ${photons} electrons` : `${photons} photons per beat: no electrons`}</Label>
            <Label x={W - 14} y={wireY + 6} kind="val" anchor="end">{above ? 'current flows' : 'no current'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ threshold: bright red versus dim blue

export function ThresholdCompare() {
  return (
    <Anim title="A bright beam of low frequency light, whose photons each carry too little energy, ejects nothing; a dim beam of high frequency light, whose photons each carry enough, ejects electrons" height={250} loop={6}>
      {(t) => {
        const rows: [number, number, number, string, string][] = [
          [70, 28, 3, 'low frequency, bright', 'hν = 2.07 eV < φ₀: no electrons'],
          [175, 16, 1, 'high frequency, dim', 'hν = 3.10 eV > φ₀: electrons out'],
        ];
        const px = 340;
        return (
          <g>
            {rows.map(([y, lam, n, name, res], r) => (
              <g key={name}>
                <Line x1={px} y1={y - 38} x2={px} y2={y + 38} tone="bright" />
                <Label x={20} y={y - 44} kind="label" anchor="start">{name}</Label>
                {Array.from({ length: n * 3 }, (_, k) => {
                  const sp = 300 / (n * 3);
                  const x = 20 + frac((t * 90 + k * sp) / 300) * 300;
                  const yy = y + ((k % n) - (n - 1) / 2) * 22;
                  return <Trail key={k} points={packet(x, yy, 0, lam, 5, 34, -TAU * t * 2)} />;
                })}
                {r === 1 && [0, 1].map((k) => {
                  const u = frac(t / 1.6 + k * 0.5);
                  return <Ball key={k} x={px + 12 + 220 * u} y={y - 6 * u + (k ? 16 : -14)} r={4.5} glow={false} />;
                })}
                {r === 0 && [0, 1, 2].map((k) => {
                  const u = frac(t / 1.2 + k / 3);
                  return <circle key={k} className="fig-guide" cx={px} cy={y + (k - 1) * 22} r={3 + 14 * u} fill="none" style={{ opacity: 1 - u }} />;
                })}
                <Label x={W - 14} y={y + 4} kind="val" anchor="end">{res}</Label>
              </g>
            ))}
            <Label x={W - 14} y={238} kind="label" anchor="end">plate of potassium, φ₀ = 2.3 eV</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ wave theory versus photons: how soon?

export function Accumulate() {
  return (
    <Anim title="In the wave picture the metal would have to soak up energy slowly, taking a long time before an electron could escape; with photons an electron is knocked out at the very instant light arrives" height={230} loop={9}>
      {(t) => {
        const rows: [number, string][] = [
          [70, 'wave picture: energy spreads over all electrons'],
          [165, 'photon picture: one photon, one electron'],
        ];
        const bx = 40, bw = 330;
        const wave = clamp((t - 1) / 6);
        const waveOut = t > 7;
        const phot = t > 1.6;
        return (
          <g>
            {rows.map(([y, name]) => (
              <Label key={name} x={bx} y={y - 24} kind="label" anchor="start">{name}</Label>
            ))}
            <rect className="fig-guide" x={bx} y={62} width={bw} height={18} fill="none" />
            <rect className="fig-bar" x={bx} y={62} width={bw * wave} height={18} fill="#fff" opacity={0.7} />
            <Line x1={bx + bw} y1={54} x2={bx + bw} y2={88} tone="soft" dashed />
            <Label x={bx + bw} y={102} kind="val">enough: φ₀</Label>
            <rect className="fig-guide" x={bx} y={157} width={bw} height={18} fill="none" />
            <rect className="fig-bar" x={bx} y={157} width={phot ? bw : 0} height={18} fill="#fff" opacity={0.7} />
            <Line x1={bx + bw} y1={149} x2={bx + bw} y2={183} tone="soft" dashed />
            <Label x={bx + bw} y={197} kind="val">enough at once</Label>
            {waveOut && <Ball x={bx + bw + 40 + 90 * ease(phase(t, 7, 8.5))} y={71} r={5} />}
            {phot && <Ball x={bx + bw + 40 + 90 * ease(phase(t, 1.6, 3))} y={166} r={5} />}
            <Label x={W - 14} y={30} kind="val" anchor="end">{`t = ${t.toFixed(1)} units`}</Label>
            <Label x={W - 14} y={71 + 4} kind="val" anchor="end">{waveOut ? 'delay!' : 'waiting…'}</Label>
            <Label x={W - 14} y={166 + 4} kind="val" anchor="end">{phot ? 'no delay' : ''}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ Einstein's equation as a budget

export function EnergyBudget() {
  return (
    <Anim title="The energy of one photon is split in two: a fixed part, the work function, spent getting out, and whatever is left over is the kinetic energy of the electron; as the frequency rises, only the kinetic part grows" height={260} loop={10}>
      {(t) => {
        const nu = lerp(0.7, 2.3, 0.5 - 0.5 * Math.cos((TAU * t) / 10));
        const E = nu;
        const phi = 1;
        const K = Math.max(0, E - phi);
        const base = 232, sc = 80;
        const gx = 330;
        return (
          <g>
            <Line x1={80} y1={base} x2={250} y2={base} tone="soft" />
            <rect className="fig-bar" x={110} y={base - Math.min(E, phi) * sc} width={110} height={Math.min(E, phi) * sc} fill="#fff" opacity={0.45} />
            {K > 0 && <rect className="fig-bar" x={110} y={base - E * sc} width={110} height={K * sc} fill="#fff" opacity={0.9} />}
            <Line x1={100} y1={base - phi * sc} x2={230} y2={base - phi * sc} tone="soft" dashed />
            <Label x={95} y={base - (phi * sc) / 2 + 4} kind="sym" anchor="end">φ₀</Label>
            {K > 0 && (
              <Label x={95} y={base - phi * sc - (K * sc) / 2 + 4} kind="sym" anchor="end">K</Label>
            )}
            <Label x={165} y={base - E * sc - 10} kind="sym">hν</Label>
            <Trail points={curve(80, 260, (s) => [gx + s, 40 + 18 * Math.sin((TAU * s) / (150 / nu) - TAU * t * 1.5)])} />
            <Label x={gx + 130} y={80} kind="label">the incoming photon: higher ν, shorter λ</Label>
            <Label x={gx} y={130} kind="val" anchor="start">{`hν = ${E.toFixed(2)} φ₀`}</Label>
            <Label x={gx} y={152} kind="val" anchor="start">{`K = hν − φ₀ = ${K.toFixed(2)} φ₀`}</Label>
            <Label x={gx} y={186} kind="val" anchor="start">{K > 0 ? 'electrons come out' : 'photon too weak: none out'}</Label>
            <Label x={gx} y={220} kind="label" anchor="start">threshold: hν = φ₀</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ retarding potential

export function Retarding() {
  return (
    <Anim title="A negative voltage on the anode slows the electrons; as the voltage grows, slower electrons turn back first, and at the stopping potential even the fastest just fails to arrive" height={260} loop={13.5}>
      {(t) => {
        const ep = Math.floor(t / 4.5);
        const s = (t % 4.5) * 0.6;
        const V = [0.4, 1, 1.4][ep];
        const Ks = [1, 0.75, 0.5, 0.25];
        const L = 360, x0 = 120;
        return (
          <g>
            <Line x1={x0} y1={30} x2={x0} y2={200} tone="bright" />
            <Line x1={x0 + L} y1={30} x2={x0 + L} y2={200} tone="bright" />
            <Label x={x0} y={22} kind="sym">C</Label>
            <Label x={x0 + L} y={22} kind="sym">A (negative)</Label>
            {Ks.map((K, k) => {
              const v0 = Math.sqrt(2 * K);
              const x = v0 * s - 0.5 * V * s * s;
              const y = 56 + k * 38;
              const verdict = Math.abs(K - V) < 1e-9 ? 'just stops' : K > V ? 'arrives' : 'turned back';
              return (
                <g key={k}>
                  <Line x1={x0} y1={y} x2={x0 + L} y2={y} tone="soft" dashed />
                  {x >= 0 && x <= 1.0001 && <Ball x={x0 + L * x} y={y} r={5} glow={false} />}
                  <Label x={x0 - 12} y={y + 4} kind="val" anchor="end">{`K = ${K.toFixed(2)}`}</Label>
                  <Label x={x0 + L + 16} y={y + 4} kind="val" anchor="start">{verdict}</Label>
                </g>
              );
            })}
            <Label x={x0 + L / 2} y={236} kind="val"><>eV = {V.toFixed(2)} K<Sub>max</Sub>{V === 1 ? '  (stopping potential)' : ''}</></Label>
            <Label x={x0 - 22} y={22} kind="label" anchor="end">K / K<Sub>max</Sub></Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ current against voltage

export function IVCurves({ mode = 'intensity' }: { mode?: 'intensity' | 'frequency' }) {
  return (
    <Anim title={mode === 'intensity' ? 'Photocurrent against anode voltage for two intensities of the same colour: the bright one saturates higher, but both stop at the same negative voltage' : 'Photocurrent against anode voltage for two frequencies at equal intensity: the saturation current is the same, but the higher frequency needs a more negative voltage to stop'} height={250} loop={9}>
      {(t) => {
        const ox = 300, oy = 190, gw = 290, gh = 150;
        const draw = clamp((t - 0.5) / 4);
        const vstop = (v0: number) => ox - v0 * 70;
        const I = (x: number, v0: number, sat: number) => {
          const lo = vstop(v0);
          return sat * ease(clamp((x - lo) / (ox + 80 - lo)));
        };
        const curves: [number, number, boolean, string][] =
          mode === 'intensity'
            ? [
                [1.4, 0.55, false, 'dim: intensity I'],
                [1.4, 1, true, 'bright: 2 I'],
              ]
            : [
                [1.1, 0.8, false, 'ν₁'],
                [2.2, 0.8, true, 'ν₂ > ν₁'],
              ];
        const px = (ox - 250) + 520 * (0.5 - 0.5 * Math.cos(TAU * t / 9));
        return (
          <g>
            <Axes x={ox} y={oy} w={gw} h={gh + 14} xLabel="V" yLabel="I" />
            <Line x1={ox - 260} y1={oy} x2={ox} y2={oy} tone="soft" />
            {curves.map(([v0, sat, bright, name], i) => {
              const pts = curve(100, 340, (s) => {
                const x = ox - 260 + s;
                return [x, oy - gh * I(x, v0, sat)] as Pt;
              }).filter((p) => p[0] <= ox - 260 + 340 * draw + 1);
              return (
                <g key={name}>
                  <Trail points={pts} tone={bright ? 'bright' : 'soft'} />
                  <Line x1={vstop(v0)} y1={oy - 8} x2={vstop(v0)} y2={oy + 12} tone={bright ? 'bright' : 'soft'} />
                  <Label x={vstop(v0)} y={oy + 28 + i * 0} kind="val">{`−V₀`}</Label>
                  <Label x={ox + 82} y={oy - gh * sat - 6 - (mode === 'frequency' ? 16 * i : 0)} kind="label" anchor="start">{name}</Label>
                  <Line x1={ox - 40} y1={oy - gh * sat} x2={ox + 80} y2={oy - gh * sat} tone="soft" dashed />
                </g>
              );
            })}
            {draw > 0.95 && <Ball x={clamp(px, ox - 260, ox + 80)} y={oy - gh * I(clamp(px, ox - 260, ox + 80), curves[1][0], curves[1][1])} r={4.5} />}
            <Label x={ox - 150} y={16} kind="label">retarding</Label>
            <Label x={ox + 140} y={16} kind="label">accelerating</Label>
            <Line x1={ox} y1={36} x2={ox} y2={oy} tone="soft" dashed />
            <Label x={W - 14} y={238} kind="label" anchor="end">{mode === 'intensity' ? 'same V₀, different saturation' : 'same saturation, different V₀'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ stopping potential against frequency

export function StoppingGraph() {
  return (
    <Anim title="The stopping potential against frequency is a straight line starting at the threshold frequency; metals with different work functions give parallel lines, and the slope is h over e" height={260} loop={10}>
      {(t) => {
        const ox = 120, oy = 190, gw = 400, gh = 160;
        const s = 0.6;
        const nu1 = 70, nu2 = 130;
        const dr = clamp((t - 0.3) / 2.5);
        const x = ox + nu1 + (gw - nu1 - 30) * (0.5 - 0.5 * Math.cos(TAU * t / 10));
        return (
          <g>
            <Axes x={ox} y={oy} w={gw} h={gh + 12} below={50} xLabel="ν" yLabel="V₀" />
            {[
              [nu1, false, 'metal 1'],
              [nu2, true, 'metal 2'],
            ].map(([nu, solid, name]) => {
              const n0 = nu as number;
              const len = (gw - n0 - 10) * dr;
              return (
                <g key={name as string}>
                  <Line x1={ox + n0} y1={oy} x2={ox + n0 + len} y2={oy - len * s} tone={solid ? 'bright' : 'soft'} />
                  <Line x1={ox + n0} y1={oy} x2={ox} y2={oy + n0 * s} tone="soft" dashed />
                  <Label x={ox + n0} y={oy + 20} kind="val">{solid ? 'ν₀₂' : 'ν₀₁'}</Label>
                  <Label x={ox + n0 + len + 8} y={oy - len * s} kind="label" anchor="start">{name as string}</Label>
                </g>
              );
            })}
            <Label x={ox - 10} y={oy + nu1 * s + 4} kind="val" anchor="end">−φ₀₁/e</Label>
            <Line x1={ox + 200} y1={oy - (200 - nu1) * s} x2={ox + 300} y2={oy - (200 - nu1) * s} tone="bright" />
            <Line x1={ox + 300} y1={oy - (200 - nu1) * s} x2={ox + 300} y2={oy - (300 - nu1) * s} tone="bright" />
            <Label x={ox + 250} y={oy - (200 - nu1) * s + 18} kind="sym">Δν</Label>
            <Label x={ox + 322} y={oy - (250 - nu1) * s} kind="sym" anchor="start">ΔV₀</Label>
            <Label x={ox + 100} y={oy - 120} kind="sym">slope = h / e</Label>
            {dr > 0.9 && (
              <g>
                <Line x1={x} y1={oy} x2={x} y2={oy - (x - ox - nu1) * s} tone="soft" dashed />
                <Ball x={x} y={oy - (x - ox - nu1) * s} r={4.5} />
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ intensity is photon count

export function PhotonStream() {
  return (
    <Anim title="Three beams: dim red, bright red and dim blue; a brighter beam sends more photons each second, while a bluer beam sends photons that each carry more energy" height={250} loop={8}>
      {(t) => {
        const rows: [number, number, number, string, string][] = [
          [60, 30, 2, 'dim red', '1.8 eV each'],
          [135, 30, 5, 'bright red', '1.8 eV each'],
          [210, 17, 2, 'dim blue', '3.1 eV each'],
        ];
        const det = 420;
        return (
          <g>
            <Line x1={det} y1={26} x2={det} y2={236} tone="bright" />
            <Label x={det} y={16} kind="label">detector</Label>
            {rows.map(([y, lam, n, name, e]) => {
              const sp = 380 / n;
              const v = 80;
              const count = Math.floor((v * t) / sp);
              return (
                <g key={name}>
                  {Array.from({ length: n }, (_, k) => {
                    const x = 24 + frac(((v * t) % 380 + k * sp) / 380) * 380;
                    return <Trail key={k} points={packet(x, y, 0, lam, 6, 40, -TAU * t * 2)} />;
                  })}
                  <Label x={24} y={y - 20} kind="label" anchor="start">{name}</Label>
                  <Label x={det + 16} y={y - 2} kind="val" anchor="start">{`N = ${count}`}</Label>
                  <Label x={det + 16} y={y + 16} kind="label" anchor="start">{e}</Label>
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ photon energy and wavelength

export function PhotonEnergy() {
  return (
    <Anim title="As the wavelength of a photon shrinks, its energy and momentum rise; the readouts follow E equals 1240 over lambda in electron volts and nanometres" height={230} loop={10}>
      {(t) => {
        const lam = lerp(700, 250, 0.5 - 0.5 * Math.cos((TAU * t) / 10));
        const E = 1240 / lam;
        const px = lam * 0.22;
        const bx = 520, base = 200, sc = 30;
        return (
          <g>
            <Trail points={curve(240, 440, (s) => [30 + s, 132 + 34 * Math.sin((TAU * s) / px - TAU * t * 1.2)])} />
            <Line x1={30} y1={132} x2={470} y2={132} tone="soft" dashed />
            <Label x={30} y={22} kind="val" anchor="start">{`λ = ${lam.toFixed(0)} nm`}</Label>
            <Label x={30} y={42} kind="val" anchor="start">{`E = 1240 / λ = ${E.toFixed(2)} eV`}</Label>
            <Label x={30} y={62} kind="val" anchor="start"><>p = E / c = {(E * 5.34).toFixed(1)} × 10<Sup>−28</Sup> kg m/s</></Label>
            <Line x1={bx - 20} y1={base} x2={bx + 60} y2={base} tone="soft" />
            <rect className="fig-bar" x={bx} y={base - E * sc} width={36} height={E * sc} fill="#fff" opacity={0.85} />
            <Label x={bx + 18} y={base + 20} kind="label">energy</Label>
            <Arrow x1={30} y1={196} x2={30 + px} y2={196} tone="soft" />
            <Label x={30 + px + 16} y={200} kind="sym" anchor="start">λ</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ matter waves

export function DeBroglie() {
  return (
    <Anim title="Three identical particles, one moving at speed v, one at twice that and one at four times; each carries a wave whose wavelength h over p shrinks as the momentum grows" height={250} loop={8}>
      {(t) => {
        const rows: [number, number, string, string][] = [
          [55, 1, 'v', 'λ'],
          [130, 2, '2v', 'λ / 2'],
          [205, 4, '4v', 'λ / 4'],
        ];
        return (
          <g>
            {rows.map(([y, m, name, lam]) => {
              const cx = 70 + ((30 * m * t) % 400);
              const lamPx = 64 / m;
              return (
                <g key={name}>
                  <Line x1={30} y1={y} x2={600} y2={y} tone="soft" dashed />
                  <Trail
                    points={curve(160, 160, (s) => {
                      const dx = s - 80;
                      const env = Math.exp(-((dx / 44) ** 2));
                      return [cx + dx, y - 22 * env * Math.cos((TAU * dx) / lamPx)] as Pt;
                    })}
                  />
                  <Ball x={cx} y={y} r={5} />
                  <Label x={W - 14} y={y - 20} kind="val" anchor="end">{`speed ${name}`}</Label>
                  <Label x={W - 14} y={y + 2} kind="val" anchor="end">{`wavelength ${lam}`}</Label>
                  <Arrow x1={cx + 14} y1={y - 38} x2={cx + 14 + 10 * m} y2={y - 38} tone="soft" />
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

export function VoltageWavelength() {
  return (
    <Anim title="An electron accelerated through a larger voltage has more momentum and a shorter de Broglie wavelength; the curve is lambda equals 1.227 over the square root of V in nanometres, and the wave drawn below shortens in step" height={260} loop={12}>
      {(t) => {
        const V = lerp(20, 400, 0.5 - 0.5 * Math.cos((TAU * t) / 12));
        const lam = 1.227 / Math.sqrt(V);
        const ox = 70, oy = 150, gw = 300, gh = 110;
        const vx = (v: number) => ox + (v / 400) * gw;
        const ly = (l: number) => oy - (l / 0.36) * gh;
        const wl = lam * 260;
        return (
          <g>
            <Axes x={ox} y={oy} w={gw + 20} h={gh + 14} xLabel="V" yLabel="λ" />
            <Trail points={curve(80, 1, (u) => {
              const v = 12 + u * 388;
              return [vx(v), ly(1.227 / Math.sqrt(v))] as Pt;
            })} tone="soft" />
            <Line x1={vx(V)} y1={oy} x2={vx(V)} y2={ly(lam)} tone="soft" dashed />
            <Ball x={vx(V)} y={ly(lam)} r={5} />
            <Label x={420} y={60} kind="val" anchor="start">{`V = ${V.toFixed(0)} volts`}</Label>
            <Label x={420} y={82} kind="val" anchor="start">{`λ = 1.227 / √V`}</Label>
            <Label x={420} y={104} kind="val" anchor="start">{`   = ${lam.toFixed(3)} nm`}</Label>
            <Trail points={curve(200, 540, (s) => [50 + s, 218 + 18 * Math.sin((TAU * s) / wl - TAU * t * 1.5)])} />
            <Line x1={50} y1={218} x2={590} y2={218} tone="soft" dashed />
            <Arrow x1={50} y1={246} x2={50 + wl} y2={246} tone="soft" />
            <Label x={50 + wl + 14} y={250} kind="sym" anchor="start">λ</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ Davisson and Germer

export function CrystalDiffraction() {
  return (
    <Anim title="An electron beam strikes the rows of atoms on a nickel crystal; the waves scattered by neighbouring atoms add up only in directions where the path difference d sin phi is a whole number of wavelengths, which gives a strong beam at one angle" height={260} loop={12}>
      {(t) => {
        const d = 56;
        const y0 = 170;
        const lamOverD = 0.777;
        const phi = lerp(22, 72, 0.5 - 0.5 * Math.cos((TAU * t) / 12)) * DEG;
        const n = Math.sin(phi) / lamOverD;
        const hit = Math.abs(n - Math.round(n)) < 0.04 && Math.round(n) === 1;
        const cx = 190;
        const atoms = [-3, -2, -1, 0, 1, 2, 3];
        const gx = 440;
        return (
          <g>
            {atoms.map((k) => (
              <Ball key={k} x={cx + k * d * 0.8} y={y0 + 3 * Math.sin(TAU * (0.9 * t + k * 0.4))} r={7} glow={false} />
            ))}
            <Label x={cx - 150} y={y0 + 40} kind="label" anchor="start">surface of the crystal</Label>
            {[0, 1].map((k) => {
              const ax = cx + k * d * 0.8;
              const u: Pt = [Math.sin(phi), -Math.cos(phi)];
              return (
                <g key={k}>
                  <Arrow x1={ax} y1={26} x2={ax} y2={y0 - 12} tone={k ? 'soft' : 'bright'} />
                  <Line x1={ax} y1={y0} x2={ax + 120 * u[0]} y2={y0 + 120 * u[1]} tone={k ? 'soft' : 'bright'} />
                </g>
              );
            })}
            <Line x1={cx} y1={y0} x2={cx + d * 0.8 * Math.cos(0)} y2={y0} tone="soft" dashed />
            <Label x={cx + d * 0.4} y={y0 + 22} kind="sym">d</Label>
            <path className="fig-guide" d={`M${cx} ${y0 - 44}A44 44 0 0 1 ${cx + 44 * Math.sin(phi)} ${y0 - 44 * Math.cos(phi)}`} fill="none" />
            <Label x={cx + 22} y={y0 - 56} kind="sym">φ</Label>
            <Axes x={gx} y={218} w={160} h={150} xLabel="φ" yLabel="I" />
            <Trail points={curve(100, 150, (s) => {
              const f = 22 + (s / 150) * 55;
              return [gx + s, 218 - 120 * Math.exp(-(((f - 51) / 4.2) ** 2)) - 10] as Pt;
            })} tone="soft" />
            <Ball x={gx + ((phi / DEG - 22) / 55) * 150} y={218 - 120 * Math.exp(-((((phi / DEG) - 51) / 4.2) ** 2)) - 10} r={5} />
            <Label x={gx + 6} y={246} kind="val" anchor="start">{`d sin φ = ${n.toFixed(2)} λ`}</Label>
            {hit && <Label x={gx + 80} y={56} kind="label">strong beam!</Label>}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ single electrons build up fringes

/** Positions of electrons on the screen from the interference pattern, made once. */
const HITS: number[] = (() => {
  const out: number[] = [];
  let s = 12345;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  while (out.length < 700) {
    const y = rnd() * 2 - 1;
    if (rnd() < Math.cos(5 * Math.PI * y) ** 2 * Math.exp(-2.2 * y * y)) out.push(y);
  }
  return out;
})();

export function ElectronFringes() {
  return (
    <Anim title="Electrons are sent through a double slit one at a time; each lands as a single dot at a seemingly random place, but as the dots pile up they form bright and dark fringes" height={260} loop={12}>
      {(t) => {
        const n = Math.floor(HITS.length * clamp((t - 0.5) / 9.5));
        const sx = 170, scr = 470, ym = 130;
        const k = Math.max(0, n - 1);
        const lastY = ym + HITS[k] * 105;
        const fly = frac(t * 14);
        const hist: number[] = Array.from({ length: 36 }, () => 0);
        for (let i = 0; i < n; i++) hist[Math.min(35, Math.floor(((HITS[i] + 1) / 2) * 36))]++;
        return (
          <g>
            <Line x1={sx} y1={20} x2={sx} y2={ym - 22} tone="bright" />
            <Line x1={sx} y1={ym - 12} x2={sx} y2={ym + 12} tone="bright" />
            <Line x1={sx} y1={ym + 22} x2={sx} y2={240} tone="bright" />
            <Arrow x1={30} y1={ym} x2={sx - 18} y2={ym} tone="soft" />
            <Ball x={30 + fly * (sx - 60)} y={ym} r={4} glow={false} />
            {n > 0 && <Ball x={sx + fly * (scr - sx)} y={ym + fly * (lastY - ym)} r={3.5} glow={false} />}
            <Line x1={scr} y1={14} x2={scr} y2={246} tone="soft" />
            {HITS.slice(0, n).map((y, i) => (
              <circle key={i} className="fig-ball" cx={scr + 14 + 2 * (i % 3)} cy={ym + y * 105} r={1.8} style={{ opacity: 0.9 }} />
            ))}
            <Line x1={scr + 80} y1={20} x2={scr + 80} y2={240} tone="soft" />
            <Trail points={hist.map((h, i) => [scr + 80 + (86 * h) / Math.max(8, ...hist), ym + (((i + 0.5) / 36) * 2 - 1) * 105] as Pt)} tone="soft" />
            <Label x={scr + 120} y={254} kind="label">count</Label>
            <Label x={30} y={246} kind="val" anchor="start">{`${n} electrons arrived`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the scale of wavelengths

export function Scale() {
  const items: [number, string][] = [
    [-33.8, 'cricket ball'],
    [-14.3, 'nucleus size'],
    [-10, 'atom size, electron at 100 V'],
    [-6.3, 'visible light'],
  ];
  return (
    <Anim title="A scale of wavelengths from one trillion trillionth of a metre upward: an electron's de Broglie wavelength is close to the size of an atom, while a cricket ball's is unimaginably smaller than a nucleus" height={250} loop={10}>
      {(t) => {
        const lo = -36, hi = -5;
        const x0 = 30, x1 = 610;
        const xm = (e: number) => x0 + ((e - lo) / (hi - lo)) * (x1 - x0);
        const sweep = lerp(lo, hi, phase(t, 0.5, 9));
        return (
          <g>
            <Line x1={x0} y1={140} x2={x1} y2={140} tone="bright" />
            {[-35, -30, -25, -20, -15, -10, -5].map((e) => (
              <g key={e}>
                <Line x1={xm(e)} y1={134} x2={xm(e)} y2={146} tone="soft" />
                <text className="fig-val" x={xm(e)} y={166} textAnchor="middle" style={{ fill: 'var(--ink)' }}>
                  10<Sup>{String(e).replace('-', '−')}</Sup>
                </text>
              </g>
            ))}
            {items.map(([e, name], i) => {
              const up = i % 2 === 0;
              const on = e <= sweep;
              return (
                <g key={name} style={{ opacity: on ? 1 : 0.55 }}>
                  <Line x1={xm(e)} y1={140} x2={xm(e)} y2={up ? 96 : 190} tone="soft" dashed />
                  <Ball x={xm(e)} y={140} r={on ? 5 : 3.5} glow={false} />
                  <Label x={xm(e)} y={up ? 88 : 208} kind="label">{name}</Label>
                </g>
              );
            })}
            <Line x1={xm(sweep)} y1={118} x2={xm(sweep)} y2={162} tone="bright" />
            <Label x={W - 14} y={24} kind="label" anchor="end">wavelength in metres, each step is 10<Sup>5</Sup> times bigger</Label>
            <Label x={20} y={232} kind="label" anchor="start">only matter near the right-hand end shows wave behaviour</Label>
          </g>
        );
      }}
    </Anim>
  );
}
