import { Anim, Arrow, Axes, Ball, Label, Line, Readout, Trail, ease, lerp, phase, W } from '../kit/Anim';

/** Animated diagrams for semiconductor electronics. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** An electron (solid dot). */
const E = ({ x, y, r = 4 }: { x: number; y: number; r?: number }) => <circle className="fig-ball" cx={x} cy={y} r={r} />;
/** A hole (hollow circle). */
const H = ({ x, y, r = 5.5 }: { x: number; y: number; r?: number }) => <circle className="fig-ghost" cx={x} cy={y} r={r} />;

/** Where a point a fraction u (0 to 1) of the way along a path of points is. */
function along(pts: Pt[], u: number): Pt {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let d = (((u % 1) + 1) % 1) * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) {
      const q = d / lens[i];
      return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)];
    }
    d -= lens[i];
  }
  return pts[pts.length - 1];
}

/** A diode symbol at (x, y) pointing in the direction of conventional current (angle in degrees, 0 = right). */
function Diode({ x, y, deg = 0, on = true, size = 11 }: { x: number; y: number; deg?: number; on?: boolean; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${deg})`} opacity={on ? 1 : 0.4}>
      <path className={on ? 'kit-block is-filled' : 'kit-block'} d={`M${-size} ${-size}L${size} 0L${-size} ${size}Z`} />
      <line className="fig-path" x1={size + 1} y1={-size} x2={size + 1} y2={size} />
    </g>
  );
}

// ------------------------------------------------------------------ resistivity

export function ResistivityScale() {
  const rows: [string, number, number][] = [
    ['conductors (metals)', -8, -2],
    ['semiconductors', -5, 6],
    ['insulators', 8, 18],
  ];
  const X = (e: number) => 30 + ((e + 9) / 28) * 580;
  return (
    <Anim title="Bars on a logarithmic scale of resistivity: conductors are lowest, insulators highest, and semiconductors sit in between over a very wide range" height={200} loop={7}>
      {(t) => (
        <g>
          <Line x1={30} y1={150} x2={W - 20} y2={150} tone="soft" />
          {[-8, -4, 0, 4, 8, 12, 16].map((e) => (
            <g key={e}>
              <Line x1={X(e)} y1={146} x2={X(e)} y2={154} tone="soft" />
              <Label x={X(e)} y={170} kind="val">{`10${e < 0 ? '⁻' : ''}${String(Math.abs(e)).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)])}`}</Label>
            </g>
          ))}
          {rows.map(([name, a, b], i) => {
            const p = ease(phase(t, 0.3 + i * 0.9, 1.5 + i * 0.9));
            const y = 30 + i * 36;
            return (
              <g key={name}>
                <rect className="fig-ball" x={X(a)} y={y} width={(X(b) - X(a)) * p} height={20} opacity={0.3} />
                <rect className="fig-ghost" x={X(a)} y={y} width={(X(b) - X(a)) * p} height={20} fill="none" />
                <Label x={X(a) + (X(b) - X(a)) * p + 6} y={y + 14} kind="label" anchor="start">{p > 0.9 ? name : ''}</Label>
              </g>
            );
          })}
          <Label x={W - 20} y={192} kind="label" anchor="end">resistivity ρ in Ω m</Label>
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ energy bands

/** Band pictures for a conductor, a semiconductor and an insulator, each with electrons doing what they do. */
export function Bands({ title = 'Energy band pictures of a conductor where the bands overlap, a semiconductor with a small gap that a few electrons jump, and an insulator with a wide gap that none can cross' }: { title?: string }) {
  const cols = [
    { name: 'conductor', gap: -14, cx: 110 },
    { name: 'semiconductor', gap: 34, cx: 320 },
    { name: 'insulator', gap: 90, cx: 530 },
  ];
  return (
    <Anim title={title} height={260} loop={6}>
      {(t) => (
        <g>
          {cols.map((c, i) => {
            const vbTop = 160;
            const cbBottom = vbTop - c.gap;
            const w = 140;
            const x0 = c.cx - w / 2;
            return (
              <g key={c.name}>
                <rect className="fig-ghost" x={x0} y={cbBottom - 60} width={w} height={60} fill="none" />
                <rect className="fig-ghost" x={x0} y={vbTop} width={w} height={46} fill="none" />
                <rect className="fig-ball" x={x0} y={vbTop} width={w} height={46} opacity={0.12} />
                {c.gap < 0 && <rect className="fig-ball" x={x0} y={cbBottom - 60} width={w} height={-c.gap + 0} opacity={0.12} />}
                <Label x={c.cx} y={236} kind="label">{c.name}</Label>
                {c.gap > 0 && (
                  <g>
                    <Line x1={x0 + w + 10} y1={cbBottom} x2={x0 + w + 10} y2={vbTop} tone="soft" />
                    <Label x={x0 + w + 16} y={(cbBottom + vbTop) / 2 + 5} kind="val" anchor="start">{c.name === 'insulator' ? '5.4 eV' : '1.1 eV'}</Label>
                  </g>
                )}
                {/* electrons in the valence band */}
                {Array.from({ length: 7 }, (_, k) => (
                  <E key={k} x={x0 + 14 + k * 19} y={vbTop + 24 + 6 * Math.sin(TAU * t * 0.5 + k)} r={3.5} />
                ))}
                {i === 0 &&
                  Array.from({ length: 6 }, (_, k) => (
                    <E key={`c${k}`} x={x0 + 10 + ((k * 24 + 40 * t) % 120)} y={cbBottom - 38 + 22 * Math.sin(k * 2 + t * 2)} r={3.5} />
                  ))}
                {i === 1 &&
                  Array.from({ length: 3 }, (_, k) => {
                    const q = phase((t + k * 2) % 6, 0, 1);
                    const up = ease(phase((t + k * 2) % 6, 0.4, 1.2));
                    const back = ease(phase((t + k * 2) % 6, 3.2, 4));
                    const lvl = up * (1 - back);
                    const x = x0 + 28 + k * 40;
                    return (
                      <g key={k} opacity={q > 0 ? 1 : 0}>
                        <E x={x} y={lerp(vbTop + 24, cbBottom - 24, lvl)} r={3.5} />
                        {lvl > 0.9 && <H x={x} y={vbTop + 10} r={4.5} />}
                      </g>
                    );
                  })}
                {i === 2 &&
                  Array.from({ length: 2 }, (_, k) => {
                    const lvl = 0.15 * Math.max(0, Math.sin(TAU * (t / 3) + k * 2));
                    return <circle key={k} className="fig-guide" cx={x0 + 40 + k * 60} cy={vbTop + 8 - 28 * lvl} r={3.5} fill="none" opacity={0.7} />;
                  })}
              </g>
            );
          })}
          <Label x={34} y={34} kind="label" anchor="start">conduction band</Label>
          <Label x={34} y={188} kind="label" anchor="start">valence band</Label>
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ temperature

export function TempResistivity() {
  return (
    <Anim title="A metal's resistivity rises with temperature while a semiconductor's falls steeply, because heat frees more charge carriers" height={230} loop={8}>
      {(t) => {
        const x0 = 70, y0 = 190, wx = 500, hy = 150;
        const T = 0.05 + 0.95 * ease(phase(t, 0.5, 6.5));
        const X = (v: number) => x0 + v * wx;
        const metal = (v: number) => y0 - hy * (0.15 + 0.5 * v);
        const semi = (v: number) => y0 - hy * (0.04 + 0.95 * Math.exp(-4.2 * v));
        const nc = Math.round(2 + 14 * T * T);
        return (
          <g>
            <Axes x={x0} y={y0} w={wx + 20} h={hy + 20} xLabel="T" yLabel="ρ" />
            <Trail points={curve(60, 1, (s) => [X(s), metal(s)] as Pt)} />
            <Trail points={curve(60, 1, (s) => [X(s), semi(s)] as Pt)} tone="soft" />
            <Ball x={X(T)} y={metal(T)} r={5} />
            <Ball x={X(T)} y={semi(T)} r={5} />
            <Label x={X(1) + 8} y={metal(1) - 6} kind="label" anchor="end">metal</Label>
            <Label x={X(0.35)} y={semi(0.35) - 12} kind="label" anchor="start">semiconductor</Label>
            <Label x={X(T)} y={y0 + 18} kind="val">T</Label>
            <rect className="fig-ghost" x={440} y={24} width={160} height={56} fill="none" />
            {Array.from({ length: nc }, (_, k) => (
              <E key={k} x={448 + ((k * 37 + 20 * t * (0.4 + T)) % 144)} y={34 + ((k * 13) % 36) + 4 * Math.sin(t * 3 + k)} r={2.8} />
            ))}
            <Label x={520} y={96} kind="label">{`free carriers in the semiconductor: ${nc}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ lattices

type LatticeMode = 'intrinsic' | 'n' | 'p';

/** A row of silicon atoms with their shared bond electrons; shows carriers moving in a field. */
export function Lattice({ mode, title, height = 210 }: { mode: LatticeMode; title: string; height?: number }) {
  const y = 118;
  const ax = (i: number) => 60 + i * 87;
  const bx = (b: number) => ax(b) + 43.5;
  const dop = 3;
  return (
    <Anim title={title} height={height} loop={11}>
      {(t) => {
        // The hole's journey along the bonds (intrinsic and p-type).
        const start = mode === 'p' ? 3 : 1;
        const u = Math.max(0, Math.min(3, (t - 2) / 1.5));
        const k = Math.min(2, Math.floor(u));
        const q = u >= 3 ? 1 : u - k;
        const hop = phase(q, 0.35, 1);
        const hb = u >= 3 ? start + 3 : start + k;
        const hq = u >= 3 ? 0 : hop;
        const holeX = lerp(bx(hb), bx(hb + 1), ease(hq));
        const hasHole = mode === 'intrinsic' ? t > 1.2 : mode === 'p';
        const gen = ease(phase(t, 0.5, 1.4));
        const fadeOut = 1 - phase(t, 9.6, 10.6);
        const dots = (b: number) => {
          if (!hasHole) return 2;
          if (mode === 'intrinsic' && b === 1 && t < 1.3 && gen > 0.3) return 1;
          if (b === hb) return 1;
          if (b === hb + 1 && hq > 0 && hq < 1) return 1;
          return 2;
        };
        const hopBall = hasHole && hq > 0 && hq < 1;
        return (
          <g opacity={fadeOut}>
            {Array.from({ length: 7 }, (_, i) => (
              <g key={i}>
                <circle className={i === dop && mode !== 'intrinsic' ? 'fig-path' : 'fig-guide'} cx={ax(i)} cy={y} r={17} fill="none" />
                <Label x={ax(i)} y={y + 5} kind="label">{i === dop && mode === 'n' ? 'P' : i === dop && mode === 'p' ? 'B' : 'Si'}</Label>
              </g>
            ))}
            {Array.from({ length: 6 }, (_, b) => {
              const n = dots(b);
              return (
                <g key={b}>
                  <Line x1={ax(b) + 17} y1={y} x2={ax(b + 1) - 17} y2={y} tone="soft" />
                  {n >= 1 && <E x={bx(b) - 6} y={y - 7} />}
                  {n >= 2 && <E x={bx(b) + 6} y={y - 7} />}
                </g>
              );
            })}
            {/* the electron that hops in to fill the hole */}
            {hopBall && <E x={lerp(bx(hb + 1), bx(hb), ease(hq))} y={y - 7 - 12 * Math.sin(Math.PI * hq)} />}
            {hasHole && <H x={holeX} y={y - 7} />}
            {/* generation in intrinsic silicon */}
            {mode === 'intrinsic' && t >= 0.5 && (
              <g>
                <E x={lerp(bx(1) - 6, 40, ease(phase(t, 1.4, 8)))} y={lerp(y - 7, 48, gen)} />
                <Label x={bx(1)} y={y - 62 + 0} kind="label">{t < 1.4 ? 'heat breaks a bond' : ''}</Label>
              </g>
            )}
            {/* the donor's fifth electron */}
            {mode === 'n' && (
              <g>
                {t < 2.4 ? (
                  <E x={ax(dop) + 26 * Math.cos(3 * t)} y={y + 26 * Math.sin(3 * t) * 0.8 - 2} r={4.5} />
                ) : (
                  <E x={lerp(ax(dop), 30, ease(phase(t, 2.4, 9)))} y={lerp(y - 28, 52, ease(phase(t, 2.4, 3.4)))} r={4.5} />
                )}
                <Label x={ax(dop)} y={y - 30} kind="sym">{t > 2.4 ? '+' : ''}</Label>
              </g>
            )}
            {mode === 'p' && <Label x={ax(dop)} y={y - 30} kind="sym">−</Label>}
            <Arrow x1={W - 160} y1={26} x2={W - 40} y2={26} tone="soft" label="E" />
            <Label x={40} y={height - 12} kind="label" anchor="start">
              {mode === 'intrinsic' ? 'a bond breaks: free electron and a hole; the hole walks the other way' : mode === 'n' ? 'phosphorus: five outer electrons, one is spare and nearly free' : 'boron: three outer electrons, one bond is short: a hole'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ impurity levels

export function BandLevels({ kind, title }: { kind: 'n' | 'p'; title: string }) {
  return (
    <Anim title={title} height={240} loop={7}>
      {(t) => {
        const x0 = 150, w = 340;
        const cbBot = 80, vbTop = 190;
        return (
          <g>
            <rect className="fig-ghost" x={x0} y={cbBot - 50} width={w} height={50} fill="none" />
            <rect className="fig-ghost" x={x0} y={vbTop} width={w} height={40} fill="none" />
            <rect className="fig-ball" x={x0} y={vbTop} width={w} height={40} opacity={0.12} />
            <Label x={x0 - 12} y={cbBot - 22} kind="label" anchor="end">conduction band</Label>
            <Label x={x0 - 12} y={vbTop + 24} kind="label" anchor="end">valence band</Label>
            {kind === 'n' ? (
              <g>
                <Line x1={x0 + 30} y1={cbBot + 14} x2={x0 + w - 30} y2={cbBot + 14} tone="soft" dashed />
                <Label x={x0 + w / 2} y={cbBot + 34} kind="label">donor level, just below the band</Label>
                {[0, 1, 2, 3].map((k) => {
                  const T = (t + k * 1.7) % 7;
                  const up = ease(phase(T, 0.5, 1.5));
                  const x = x0 + 70 + k * 65 + 36 * ease(phase(T, 1.5, 5.5));
                  const y = lerp(cbBot + 14, cbBot - 28, up);
                  const gone = phase(T, 5.8, 6.6);
                  return (
                    <g key={k} opacity={1 - gone}>
                      {up < 1 && <E x={x0 + 70 + k * 65} y={cbBot + 14} r={4} />}
                      {up >= 1 && <E x={x} y={y} r={4} />}
                      <Label x={x0 + 70 + k * 65} y={cbBot + 10 + 0} kind="sym">{up > 0.5 ? '+' : ''}</Label>
                    </g>
                  );
                })}
                <Label x={x0 + w + 8} y={(cbBot + vbTop) / 2 + 4} kind="val" anchor="start">≈ 0.05 eV</Label>
              </g>
            ) : (
              <g>
                <Line x1={x0 + 30} y1={vbTop - 14} x2={x0 + w - 30} y2={vbTop - 14} tone="soft" dashed />
                <Label x={x0 + w / 2} y={vbTop - 28} kind="label">acceptor level, just above the band</Label>
                {[0, 1, 2, 3].map((k) => {
                  const T = (t + k * 1.7) % 7;
                  const up = ease(phase(T, 0.5, 1.5));
                  const x = x0 + 70 + k * 65;
                  const hy = lerp(vbTop + 22, vbTop + 6, up) - 0;
                  const hx = x + 30 * ease(phase(T, 1.5, 5.5));
                  const gone = phase(T, 5.8, 6.6);
                  return (
                    <g key={k} opacity={1 - gone}>
                      <E x={x} y={lerp(vbTop + 22, vbTop - 14, up)} r={4} />
                      <H x={up > 0.5 ? hx : x} y={up > 0.5 ? hy + 8 : vbTop + 22} r={5} />
                    </g>
                  );
                })}
                <Label x={x0 + w + 8} y={(cbBot + vbTop) / 2 + 4} kind="val" anchor="start">≈ 0.05 eV</Label>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ carriers vs doping

export function CarrierBalance() {
  const ni = 1.5e16;
  return (
    <Anim title="As the doping of silicon with donors is turned up, the number of electrons rises and the number of holes falls, so that their product stays fixed at n sub i squared" height={250} loop={9}>
      {(t) => {
        const ND = 10 ** (14 + 8.7 * ease(phase(t, 0.5, 7)));
        const n = ND / 2 + Math.sqrt((ND / 2) ** 2 + ni * ni);
        const p = (ni * ni) / n;
        const H = (v: number) => ((Math.log10(v) - 8) / 16) * 170;
        const y0 = 200;
        return (
          <g>
            <Line x1={30} y1={y0} x2={430} y2={y0} tone="soft" />
            <rect className="fig-ball" x={80} y={y0 - H(n)} width={90} height={H(n)} opacity={0.25} />
            <rect className="fig-ghost" x={80} y={y0 - H(n)} width={90} height={H(n)} fill="none" />
            <rect className="fig-ghost" x={260} y={y0 - H(p)} width={90} height={H(p)} fill="none" />
            <Label x={125} y={y0 + 20} kind="label">electrons n</Label>
            <Label x={305} y={y0 + 20} kind="label">holes p</Label>
            <Label x={125} y={y0 - H(n) - 8} kind="val">{`10^${Math.log10(n).toFixed(1)}`}</Label>
            <Label x={305} y={y0 - H(p) - 8} kind="val">{`10^${Math.log10(p).toFixed(1)}`}</Label>
            <Label x={235} y={28} kind="label">carrier density per m³ (log scale)</Label>
            <Line x1={80} y1={y0 - H(ni)} x2={350} y2={y0 - H(ni)} tone="soft" dashed />
            <Label x={355} y={y0 - H(ni) + 4} kind="val" anchor="start">n_i</Label>
            <rect className="fig-ghost" x={450} y={70} width={170} height={110} fill="none" />
            <Label x={535} y={96} kind="label">donors added</Label>
            <Label x={535} y={118} kind="val">{`N_D = 10^${Math.log10(ND).toFixed(1)}`}</Label>
            <Label x={535} y={146} kind="label">product n · p</Label>
            <Label x={535} y={168} kind="val">{`= 10^${Math.log10(n * p).toFixed(1)}`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ junction formation

/** p and n pieces meet: carriers diffuse across, leaving fixed ions that build a depletion region and a field. */
export function JunctionForm({ title = 'A p-type and an n-type piece meet: holes and electrons diffuse across and cancel, leaving fixed charged ions that build up a depletion region and an electric field that stops the flow' }: { title?: string }) {
  const cx = 320, y0 = 50, y1 = 190;
  const final = 42;
  const N = 18;
  return (
    <Anim title={title} height={250} loop={11}>
      {(t) => {
        const grow = ease(phase(t, 1, 6));
        const w = final * grow;
        const field = ease(phase(t, 5, 7));
        const wander = (i: number, a: number) => a * Math.sin(t * (1 + rnd(i) * 1.4) + i * 3);
        return (
          <g>
            <rect className="fig-ghost" x={30} y={y0} width={cx - 30} height={y1 - y0} fill="none" />
            <rect className="fig-ghost" x={cx} y={y0} width={W - 30 - cx} height={y1 - y0} fill="none" />
            <rect className="fig-ball" x={cx - w} y={y0 + 1} width={2 * w} height={y1 - y0 - 2} opacity={0.09} />
            <Label x={90} y={y0 - 10} kind="label">p-type</Label>
            <Label x={W - 90} y={y0 - 10} kind="label">n-type</Label>
            {Array.from({ length: N }, (_, i) => {
              const gx = 45 + ((i % 6) * (cx - 70)) / 5;
              const gy = y0 + 22 + Math.floor(i / 6) * 48 + (i % 2) * 14;
              if (gx > cx - w - 6) return null;
              return <H key={`h${i}`} x={gx + wander(i, 4)} y={gy + wander(i + 50, 4)} />;
            })}
            {Array.from({ length: N }, (_, i) => {
              const gx = cx + 20 + ((i % 6) * (W - 70 - cx)) / 5;
              const gy = y0 + 22 + Math.floor(i / 6) * 48 + (i % 2) * 14;
              if (gx < cx + w + 6) return null;
              return <E key={`e${i}`} x={gx + wander(i, 4)} y={gy + wander(i + 50, 4)} r={4.5} />;
            })}
            {/* diffusing carriers crossing over */}
            {[0, 1, 2].map((k) => {
              const s = (t * 0.45 + k / 3) % 1;
              const on = t < 6 ? 1 : 0.0;
              return (
                <g key={k} opacity={on * (1 - field)}>
                  <E x={cx + 36 - 90 * s} y={y0 + 40 + k * 40} r={4.5} />
                  <H x={cx - 36 + 90 * s} y={y0 + 60 + k * 36} />
                </g>
              );
            })}
            {/* fixed ions */}
            {Array.from({ length: 6 }, (_, k) => {
              const ix = (k + 0.5) / 6;
              const px = cx - ix * w * 0.95 - 2;
              const nx = cx + ix * w * 0.95 + 2;
              return (
                <g key={k} opacity={ease(phase(w, ix * final * 0.9, ix * final * 0.9 + 5))}>
                  {[0, 1, 2].map((r) => (
                    <g key={r}>
                      <Label x={px} y={y0 + 40 + r * 44} kind="sym">−</Label>
                      <Label x={nx} y={y0 + 40 + r * 44} kind="sym">+</Label>
                    </g>
                  ))}
                </g>
              );
            })}
            {field > 0 && (
              <g opacity={field}>
                <Arrow x1={cx + 30} y1={y1 + 24} x2={cx - 30} y2={y1 + 24} label="E" />
                <Label x={cx} y={y1 + 48} kind="label">depletion region, about 1 µm: no free carriers</Label>
              </g>
            )}
            {field === 0 && <Label x={cx} y={y1 + 30} kind="label">{t < 1 ? 'before contact' : 'diffusion: holes go right, electrons go left'}</Label>}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ biasing

/** A biased junction: forward pushes carriers across and shrinks the depletion region, reverse pulls them away and widens it. */
export function Biased({ mode, title }: { mode: 'forward' | 'reverse'; title: string }) {
  const fwd = mode === 'forward';
  const cx = 320, y0 = 36, y1 = 140;
  const w = fwd ? 10 : 58;
  return (
    <Anim title={title} height={250} loop={8}>
      {(t) => {
        const barrier = fwd ? 0.28 : 1.3;
        return (
          <g>
            <rect className="fig-ghost" x={70} y={y0} width={cx - 70} height={y1 - y0} fill="none" />
            <rect className="fig-ghost" x={cx} y={y0} width={W - 70 - cx} height={y1 - y0} fill="none" />
            <rect className="fig-ball" x={cx - w} y={y0 + 1} width={2 * w} height={y1 - y0 - 2} opacity={0.12} />
            <Label x={110} y={y0 + 18} kind="label">p</Label>
            <Label x={W - 110} y={y0 + 18} kind="label">n</Label>
            {/* carriers */}
            {Array.from({ length: 6 }, (_, k) => {
              const s = (t * (fwd ? 0.3 : 0.18) + k / 6) % 1;
              const yh = y0 + 24 + (k % 3) * 28;
              const hx = fwd ? lerp(95, cx + 12, s) : lerp(cx - w - 16, 90, s * 0.6);
              const ex = fwd ? lerp(W - 95, cx - 12, s) : lerp(cx + w + 16, W - 90, s * 0.6);
              const vanish = fwd && s > 0.88 ? 1 - (s - 0.88) / 0.12 : 1;
              return (
                <g key={k} opacity={vanish}>
                  <H x={hx} y={yh} />
                  <E x={ex} y={yh + 14} r={4.5} />
                </g>
              );
            })}
            {/* the battery and wires */}
            <Line x1={70} y1={(y0 + y1) / 2} x2={36} y2={(y0 + y1) / 2} tone="bright" />
            <Line x1={W - 70} y1={(y0 + y1) / 2} x2={W - 36} y2={(y0 + y1) / 2} tone="bright" />
            <Line x1={36} y1={(y0 + y1) / 2} x2={36} y2={y1 + 34} tone="bright" />
            <Line x1={W - 36} y1={(y0 + y1) / 2} x2={W - 36} y2={y1 + 34} tone="bright" />
            <Line x1={36} y1={y1 + 34} x2={cx - 14} y2={y1 + 34} tone="bright" />
            <Line x1={W - 36} y1={y1 + 34} x2={cx + 14} y2={y1 + 34} tone="bright" />
            {/* long plate is positive */}
            <Line x1={cx - 14} y1={y1 + 20} x2={cx - 14} y2={y1 + 48} tone="bright" />
            <Line x1={cx + 14} y1={y1 + 26} x2={cx + 14} y2={y1 + 42} tone="bright" />
            <Label x={cx - 24} y={y1 + 18} kind="sym" anchor="end">{fwd ? '+' : '−'}</Label>
            <Label x={cx + 24} y={y1 + 18} kind="sym" anchor="start">{fwd ? '−' : '+'}</Label>
            {/* the barrier graph */}
            <Axes x={cx - 150} y={236} w={300} h={42} xLabel="x" yLabel="" />
            <Trail points={curve(60, 1, (s) => [cx - 140 + s * 280, 236 - 9 - 24 * barrier * ease(phase(s, 0.5 - w / 280 * 1.4, 0.5 + w / 280 * 1.4))] as Pt)} />
            <Label x={cx - 156} y={206} kind="label" anchor="start">{fwd ? 'barrier lowered: carriers climb it' : 'barrier raised: carriers cannot'}</Label>
            <Readout y={20}>{fwd ? 'depletion region narrow: current flows' : 'depletion region wide: almost no current'}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the I-V curve

const IV = (v: number, zener: boolean, vz = 5.1) => {
  if (v >= 0) return Math.min(0.95, 0.9 * Math.exp((v - 0.95) / 0.07));
  if (zener && v < -vz) return -0.02 + (v + vz) * 0.5;
  return -0.02 * (1 - Math.exp(v * 3));
};

export function IVCurve({ zener = false, title }: { zener?: boolean; title: string }) {
  return (
    <Anim title={title} height={260} loop={10}>
      {(t) => {
        const x0 = 300, y0 = 150;
        const sx = (v: number) => (v >= 0 ? v * 280 : v * 42);
        const sy = (i: number) => -i * 120;
        const lim = zener ? -6.2 : -6.2;
        const sweep = 0.5 - 0.5 * Math.cos(TAU * (t / 10));
        const v = lerp(lim, 1.05, sweep);
        const iv = IV(v, zener);
        const pts = curve(200, 1, (s) => {
          const vv = lerp(lim, 1.05, s);
          return [x0 + sx(vv), y0 + sy(IV(vv, zener))] as Pt;
        });
        return (
          <g>
            <Axes x={x0} y={y0} w={W - x0 - 12} h={130} below={80} xLabel="V" yLabel="I" />
            <Line x1={x0 + lim * 42 - 10} y1={y0} x2={x0} y2={y0} tone="soft" />
            <Trail points={pts} />
            <Line x1={x0 + 0.7 * 280} y1={y0 - 8} x2={x0 + 0.7 * 280} y2={y0 + 8} tone="soft" />
            <Label x={x0 + 0.7 * 280} y={y0 + 24} kind="val">0.7 V</Label>
            <Label x={x0 + 160} y={y0 - 100} kind="label">forward: current rises steeply</Label>
            <Label x={x0 - 110} y={y0 + 42} kind="label">reverse: tiny leakage</Label>
            {zener && (
              <g>
                <Line x1={x0 - 5.1 * 42} y1={y0 + 14} x2={x0 - 5.1 * 42} y2={y0 - 6} tone="soft" />
                <Label x={x0 - 5.1 * 42} y={y0 - 14} kind="val">−V_z</Label>
                <Label x={x0 - 5.1 * 42 - 8} y={y0 + 84} kind="label" anchor="end">breakdown: V stays near −V_z</Label>
              </g>
            )}
            <Ball x={x0 + sx(v)} y={y0 + sy(iv)} r={5.5} />
            <Readout>{`V = ${v.toFixed(2)} V`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ rectifiers

type RectMode = 'half' | 'full' | 'filtered';

const filtered = (() => {
  const out: number[] = [];
  const n = 3 * 200;
  let v = 0;
  for (let i = 0; i <= n; i++) {
    const tau = i / 200;
    const s = Math.abs(Math.sin(TAU * tau));
    v = Math.max(s, v * Math.exp(-1 / 200 / 1.2));
    out.push(v);
  }
  return out;
})();

export function Rectifier({ mode, title }: { mode: RectMode; title: string }) {
  return (
    <Anim title={title} height={250} loop={9}>
      {(t) => {
        const cyc = (t % 9) / 3; // three cycles across the loop
        const s = Math.sin(TAU * cyc);
        const gx = 280, gy = 140, gw = 330, A = 56;
        const X = (c: number) => gx + (c / 3) * gw;
        const out = (c: number) => {
          const v = Math.sin(TAU * c);
          if (mode === 'half') return Math.max(0, v);
          if (mode === 'full') return Math.abs(v);
          return filtered[Math.min(filtered.length - 1, Math.round(c * 200))];
        };
        const pos = s >= 0;
        // Circuit paths.
        let path: Pt[] = [];
        if (mode === 'half') path = [[30, 84], [30, 40], [95, 40], [215, 40], [215, 160], [30, 160], [30, 116]];
        else path = pos ? [[80, 100], [115, 65], [115, 40], [215, 40], [215, 160], [115, 160], [115, 135], [150, 100]] : [[150, 100], [115, 65], [115, 40], [215, 40], [215, 160], [115, 160], [115, 135], [80, 100]];
        const flow = mode === 'half' ? pos : true;
        return (
          <g>
            {mode === 'half' ? (
              <g>
                <circle className="kit-block" cx={30} cy={100} r={16} />
                <Label x={30} y={106} kind="sym">~</Label>
                <Line x1={30} y1={84} x2={30} y2={40} tone="bright" />
                <Line x1={30} y1={40} x2={84} y2={40} tone="bright" />
                <Diode x={100} y={40} on={pos} />
                <Line x1={116} y1={40} x2={215} y2={40} tone="bright" />
                <Line x1={215} y1={40} x2={215} y2={160} tone="bright" />
                <Line x1={30} y1={116} x2={30} y2={160} tone="bright" />
                <Line x1={30} y1={160} x2={215} y2={160} tone="bright" />
              </g>
            ) : (
              <g>
                {/* the bridge */}
                <Line x1={80} y1={100} x2={115} y2={65} tone="soft" />
                <Line x1={115} y1={65} x2={150} y2={100} tone="soft" />
                <Line x1={150} y1={100} x2={115} y2={135} tone="soft" />
                <Line x1={115} y1={135} x2={80} y2={100} tone="soft" />
                <Diode x={97.5} y={82.5} deg={-45} on={pos} size={8} />
                <Diode x={132.5} y={82.5} deg={45} on={!pos} size={8} />
                <Diode x={132.5} y={117.5} deg={135} on={pos} size={8} />
                <Diode x={97.5} y={117.5} deg={-135} on={!pos} size={8} />
                <Arrow x1={30} y1={100} x2={78} y2={100} tone="soft" label="" />
                <Arrow x1={200} y1={100} x2={152} y2={100} tone="soft" label="" />
                <Label x={24} y={96} kind="label" anchor="end">AC</Label>
                <Line x1={115} y1={65} x2={115} y2={40} tone="bright" />
                <Line x1={115} y1={40} x2={215} y2={40} tone="bright" />
                <Line x1={115} y1={135} x2={115} y2={160} tone="bright" />
                <Line x1={115} y1={160} x2={215} y2={160} tone="bright" />
                <Line x1={215} y1={40} x2={215} y2={160} tone="bright" />
                {mode === 'filtered' && (
                  <g>
                    <Line x1={170} y1={40} x2={170} y2={94} tone="bright" />
                    <Line x1={158} y1={94} x2={182} y2={94} tone="bright" />
                    <Line x1={158} y1={106} x2={182} y2={106} tone="bright" />
                    <Line x1={170} y1={106} x2={170} y2={160} tone="bright" />
                    <Label x={188} y={104} kind="label" anchor="start">C</Label>
                  </g>
                )}
              </g>
            )}
            <rect className="kit-block" x={207} y={78} width={16} height={44} rx={2} />
            <Label x={238} y={104} kind="sym" anchor="start">R</Label>
            {flow && Array.from({ length: 5 }, (_, k) => {
              const p = along(path, t * 0.3 + k / 5);
              return <Ball key={k} x={p[0]} y={p[1]} r={3.2} glow={false} />;
            })}
            <Axes x={gx} y={gy} w={gw + 20} h={70} below={70} xLabel="t" />
            <Trail points={curve(150, 3, (c) => [X(c), gy - A * Math.sin(TAU * c)] as Pt)} tone="soft" dashed />
            <Trail points={curve(300, cyc, (c) => [X(c), gy - A * out(c)] as Pt)} />
            <Line x1={X(cyc)} y1={gy - 66} x2={X(cyc)} y2={gy + 66} tone="soft" dashed />
            <Ball x={X(cyc)} y={gy - A * out(cyc)} r={5} />
            <Label x={gx + 8} y={gy - 70} kind="label" anchor="start">input (dashed) and output</Label>
            <Label x={gx + gw / 2} y={226} kind="label">
              {mode === 'half' ? 'half-wave: one diode, one half of each cycle' : mode === 'full' ? 'full-wave bridge: both halves, twice the ripple frequency' : 'a capacitor holds the voltage between the peaks'}
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ zener regulation

export function ZenerReg() {
  return (
    <Anim title="The input voltage wanders up and down but the output across the Zener diode stays almost flat; the extra current is simply taken by the Zener" height={250} loop={10}>
      {(t) => {
        const vin = (tt: number) => 10 + 2 * Math.sin(TAU * tt * 0.2) + 0.6 * Math.sin(TAU * tt * 0.55);
        const gx = 330, gy = 120, gw = 280;
        const X = (s: number) => gx + (s / 10) * gw;
        const v = vin(t);
        const Is = (v - 5) / 250;
        const IL = 10;
        const Iz = Is * 1000 - IL;
        return (
          <g>
            {/* circuit: Vin, Rs, Zener across the load */}
            <Line x1={30} y1={40} x2={60} y2={40} tone="bright" />
            <rect className="kit-block" x={60} y={32} width={48} height={16} rx={2} />
            <Label x={84} y={26} kind="label">Rs 250 Ω</Label>
            <Line x1={108} y1={40} x2={220} y2={40} tone="bright" />
            <Line x1={160} y1={40} x2={160} y2={76} tone="bright" />
            <Diode x={160} y={92} deg={-90} on size={10} />
            <Line x1={160} y1={108} x2={160} y2={160} tone="bright" />
            <Line x1={220} y1={40} x2={220} y2={78} tone="bright" />
            <rect className="kit-block" x={212} y={78} width={16} height={44} rx={2} />
            <Line x1={220} y1={122} x2={220} y2={160} tone="bright" />
            <Line x1={30} y1={160} x2={220} y2={160} tone="bright" />
            <Line x1={30} y1={40} x2={30} y2={160} tone="bright" />
            <Label x={24} y={104} kind="val" anchor="end">{`${v.toFixed(1)} V`}</Label>
            <Label x={174} y={72} kind="label" anchor="start">Zener</Label>
            <Label x={238} y={104} kind="label" anchor="start">RL</Label>
            {Array.from({ length: 4 }, (_, k) => {
              const p = along([[30, 40], [160, 40], [160, 160]], t * 0.4 * (0.5 + Iz / 20) + k / 4);
              return <Ball key={k} x={p[0]} y={p[1]} r={Math.max(1.5, 2 + Iz / 8)} glow={false} />;
            })}
            {/* traces */}
            <Axes x={gx} y={gy + 80} w={gw + 20} h={150} xLabel="t" yLabel="V" />
            <Trail points={curve(120, Math.min(10, t), (s) => [X(s), gy + 80 - ((vin(s) - 4) / 10) * 140] as Pt)} tone="soft" />
            <Trail points={curve(120, Math.min(10, t), (s) => [X(s), gy + 80 - ((5 + 0.03 * Math.sin(s) - 4) / 10) * 140] as Pt)} />
            <Label x={gx + gw - 10} y={gy + 80 - ((vin(9.5) - 4) / 10) * 140 - 10} kind="label" anchor="end">V in</Label>
            <Label x={gx + gw - 10} y={gy + 80 - ((5 - 4) / 10) * 140 + 18} kind="label" anchor="end">V out ≈ 5.0 V</Label>
            {/* current split */}
            <rect className="fig-ghost" x={40} y={196} width={160} height={14} fill="none" />
            <rect className="fig-ball" x={40} y={196} width={160 * (IL / (Is * 1000))} height={14} opacity={0.35} />
            <rect className="fig-ball" x={40 + 160 * (IL / (Is * 1000))} y={196} width={160 * (Iz / (Is * 1000))} height={14} opacity={0.6} />
            <Label x={40} y={228} kind="val" anchor="start">{`I_L = 10 mA   I_z = ${Iz.toFixed(1)} mA`}</Label>
            <Label x={40} y={190} kind="label" anchor="start">source current split</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ LED

export function LedAnim() {
  return (
    <Anim title="In a forward-biased LED, electrons and holes are pushed together at the junction and recombine, each pair giving out a photon of light, while a band picture shows the electron dropping across the gap" height={250} loop={8}>
      {(t) => {
        const cx = 190, y0 = 60, y1 = 160;
        return (
          <g>
            <rect className="fig-ghost" x={30} y={y0} width={cx - 30} height={y1 - y0} fill="none" />
            <rect className="fig-ghost" x={cx} y={y0} width={160} height={y1 - y0} fill="none" />
            <Label x={80} y={y0 - 10} kind="label">p</Label>
            <Label x={cx + 130} y={y0 - 10} kind="label">n</Label>
            {Array.from({ length: 5 }, (_, k) => {
              const s = (t * 0.35 + k / 5) % 1;
              const yy = y0 + 18 + k * 17;
              const hx = lerp(50, cx - 2, s);
              const ex = lerp(cx + 150, cx + 2, s);
              const a = s > 0.9 ? 1 - (s - 0.9) / 0.1 : 1;
              const flash = s > 0.88;
              return (
                <g key={k}>
                  <g opacity={a}>
                    <H x={hx} y={yy} />
                    <E x={ex} y={yy + 6} r={4.5} />
                  </g>
                  {flash && (
                    <g opacity={(s - 0.88) / 0.12}>
                      <Trail points={curve(24, 40, (z) => [cx + 4 + z * 1.0 - 20, yy - 10 - z * 1.1 + 4 * Math.sin(z / 2 - t * 8)] as Pt)} />
                    </g>
                  )}
                </g>
              );
            })}
            <Label x={cx} y={y1 + 24} kind="label">recombination at the junction</Label>
            {/* band picture */}
            <rect className="fig-ghost" x={400} y={40} width={200} height={34} fill="none" />
            <rect className="fig-ghost" x={400} y={150} width={200} height={34} fill="none" />
            <Label x={500} y={32} kind="label">conduction band</Label>
            <Label x={500} y={204} kind="label">valence band</Label>
            {Array.from({ length: 3 }, (_, k) => {
              const T = (t + k * 2.6) % 8;
              const drop = ease(phase(T, 1, 2.6));
              const x = 440 + k * 55;
              const y = lerp(60, 166, drop);
              const ph = phase(T, 2.6, 4.2);
              return (
                <g key={k} opacity={T < 4.2 ? 1 : 0}>
                  <E x={x} y={y} r={4.5} />
                  {ph > 0 && (
                    <g opacity={1 - ph}>
                      <Trail points={curve(24, 40, (z) => [x + 8 + z, 120 - z * 1.0 + 4 * Math.sin(z / 2 - t * 8)] as Pt)} />
                    </g>
                  )}
                </g>
              );
            })}
            <Line x1={612} y1={74} x2={612} y2={150} tone="soft" />
            <Label x={606} y={118} kind="val" anchor="end">E_g</Label>
            <Label x={500} y={232} kind="val">photon energy h f ≈ E_g</Label>
            {/* battery */}
            <Line x1={30} y1={110} x2={14} y2={110} tone="bright" />
            <Line x1={cx + 160} y1={110} x2={cx + 176} y2={110} tone="bright" />
          </g>
        );
      }}
    </Anim>
  );
}

/** Photon wavelength set by the band gap. */
export function GapColour() {
  const items: [string, number][] = [
    ['red LED, E_g 1.9 eV', 1.9],
    ['green LED, E_g 2.3 eV', 2.3],
    ['blue LED, E_g 2.8 eV', 2.8],
  ];
  return (
    <Anim title="Three photon waves with the wavelengths set by a large, medium and small band gap: the wider the gap, the shorter the wavelength and the bluer the light" height={220} loop={6}>
      {(t) => (
        <g>
          {items.map(([name, eg], i) => {
            const lam = 1240 / eg;
            const px = lam / 8;
            const y = 50 + i * 60;
            return (
              <g key={name}>
                <Trail points={curve(240, 400, (s) => [150 + s, y + 14 * Math.sin((TAU * (s - 60 * t)) / px)] as Pt)} />
                <Label x={14} y={y + 5} kind="label" anchor="start">{name}</Label>
                <Label x={W - 14} y={y + 5} kind="val" anchor="end">{`${Math.round(lam)} nm`}</Label>
              </g>
            );
          })}
          <Label x={320} y={208} kind="label">λ = 1240 / E_g (eV) nm</Label>
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ solar cell

export function SolarCell() {
  return (
    <Anim title="Sunlight makes electron and hole pairs in a p-n junction; the junction's field sweeps electrons toward the n side and holes toward the p side, and a current runs round the loop through a lamp" height={260} loop={8}>
      {(t) => {
        const cx = 320, top = 90, bot = 150;
        const x0 = 150, x1 = 490;
        const glow = 0.5 + 0.5 * Math.sin(TAU * t / 2);
        return (
          <g>
            {/* sunlight */}
            {[0, 1, 2, 3].map((k) => {
              const s = (t * 0.5 + k / 4) % 1;
              const sx = 200 + k * 80;
              const yy = lerp(10, top, s);
              return (
                <g key={k} opacity={s < 0.95 ? 1 : 0}>
                  <Trail points={curve(14, 36, (z) => [sx + 6 * Math.sin(z / 3 - t * 8), yy - 36 + z] as Pt)} />
                </g>
              );
            })}
            <rect className="fig-ghost" x={x0} y={top} width={cx - x0} height={bot - top} fill="none" />
            <rect className="fig-ghost" x={cx} y={top} width={x1 - cx} height={bot - top} fill="none" />
            <rect className="fig-ball" x={cx - 24} y={top + 1} width={48} height={bot - top - 2} opacity={0.1} />
            <Label x={x0 + 20} y={bot + 18} kind="label" anchor="start">p</Label>
            <Label x={x1 - 20} y={bot + 18} kind="label" anchor="end">n</Label>
            <Arrow x1={cx + 18} y1={bot + 30} x2={cx - 18} y2={bot + 30} tone="soft" label="E" />
            {/* pairs made in the depletion region and swept apart */}
            {[0, 1, 2].map((k) => {
              const s = (t * 0.35 + k / 3) % 1;
              const yy = top + 14 + k * 16;
              const born = phase(s, 0, 0.15);
              const sweep = ease(phase(s, 0.15, 0.7));
              return (
                <g key={k} opacity={born > 0 && s < 0.92 ? 1 : 0}>
                  <E x={cx + 4 + 80 * sweep} y={yy} r={4.5} />
                  <H x={cx - 4 - 80 * sweep} y={yy} />
                </g>
              );
            })}
            {/* the loop and the lamp */}
            <Line x1={x0} y1={(top + bot) / 2} x2={x0 - 20} y2={(top + bot) / 2} tone="bright" />
            <Line x1={x1} y1={(top + bot) / 2} x2={x1 + 20} y2={(top + bot) / 2} tone="bright" />
            <Line x1={x0 - 20} y1={(top + bot) / 2} x2={x0 - 20} y2={225} tone="bright" />
            <Line x1={x1 + 20} y1={(top + bot) / 2} x2={x1 + 20} y2={225} tone="bright" />
            <Line x1={x0 - 20} y1={225} x2={cx - 24} y2={225} tone="bright" />
            <Line x1={x1 + 20} y1={225} x2={cx + 24} y2={225} tone="bright" />
            <circle className="kit-block" cx={cx} cy={225} r={20} />
            <Line x1={cx - 12} y1={213} x2={cx + 12} y2={237} tone="soft" />
            <Line x1={cx + 12} y1={213} x2={cx - 12} y2={237} tone="soft" />
            <circle className="fig-glow" cx={cx} cy={225} r={34} fill="#fff" opacity={0.12 + 0.2 * glow} />
            {Array.from({ length: 6 }, (_, k) => {
              const p = along([[x1, 120], [x1 + 20, 120], [x1 + 20, 225], [x0 - 20, 225], [x0 - 20, 120], [x0, 120]], t * 0.22 + k / 6);
              return <Ball key={k} x={p[0]} y={p[1]} r={3.2} glow={false} />;
            })}
            <Label x={W - 14} y={20} kind="label" anchor="end">no battery: the light is the source</Label>
          </g>
        );
      }}
    </Anim>
  );
}
