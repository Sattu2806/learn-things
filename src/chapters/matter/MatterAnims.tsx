import { Anim, Arrow, Axes, Ball, Label, Line, Readout, Trail, ease, phase, W } from '../kit/Anim';

/** Animated diagrams for magnetism and matter. Positions come from the physics, scaled to pixels. */

const TAU = 2 * Math.PI;
type Pt = [number, number];

/** A real subscript inside SVG text. */
const Sub = ({ children }: { children: string }) => <tspan baselineShift="sub" fontSize="0.7em">{children}</tspan>;

function curve(n: number, span: number, f: (s: number) => Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) out.push(f((i / n) * span));
  return out;
}

/** A fixed pseudo-random number in [0, 1) for item i, so a layout does not flicker. */
const rnd = (i: number, k = 0) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** A small arrow standing for one atomic magnet, pointing at `angle` (radians, anticlockwise from right). */
function Mini({ x, y, angle, len = 15, o = 1 }: { x: number; y: number; angle: number; len?: number; o?: number }) {
  const dx = Math.cos(angle) * len, dy = -Math.sin(angle) * len;
  return (
    <g style={{ opacity: o }}>
      <Arrow x1={x - dx} y1={y - dy} x2={x + dx} y2={y + dy} width={2.5} />
    </g>
  );
}

/** A bar magnet with its S half open and N half filled, centred on (x, y). */
function Bar({ x, y, w = 140, h = 32, letters = true, o = 1 }: { x: number; y: number; w?: number; h?: number; letters?: boolean; o?: number }) {
  return (
    <g style={{ opacity: o }}>
      <rect className="kit-block" x={x - w / 2} y={y - h / 2} width={w / 2} height={h} rx={3} />
      <rect className="kit-block is-filled" x={x} y={y - h / 2} width={w / 2} height={h} rx={3} />
      {letters && (
        <g>
          <text className="fig-sym" x={x - w / 4} y={y + 6} textAnchor="middle">S</text>
          <text className="fig-sym" x={x + w / 4} y={y + 6} textAnchor="middle" style={{ fill: '#000' }}>N</text>
        </g>
      )}
    </g>
  );
}

// ------------------------------------------------------------------ the bar magnet

export function CutMagnet() {
  return (
    <Anim title="A bar magnet is cut in half, and each half is a complete magnet with its own north and south pole; cutting again gives four magnets, never a lone pole" height={230} loop={9}>
      {(t) => {
        const cut1 = ease(phase(t, 1.2, 2.2));
        const cut2 = ease(phase(t, 4.2, 5.2));
        const sweep = phase(t, 0.8, 1.2) * (1 - phase(t, 1.2, 1.4));
        const sweep2 = phase(t, 3.8, 4.2) * (1 - phase(t, 4.2, 4.4));
        const full = 400;
        const y = 115;
        const name = cut2 > 0.5 ? 'four magnets' : cut1 > 0.5 ? 'two magnets' : 'one magnet';
        return (
          <g>
            <Line x1={320} y1={50} x2={320} y2={50 + 130 * sweep} tone="soft" dashed />
            <Line x1={220} y1={50} x2={220} y2={50 + 130 * sweep2} tone="soft" dashed />
            <Line x1={420} y1={50} x2={420} y2={50 + 130 * sweep2} tone="soft" dashed />
            <Bar x={320} y={y} w={full} h={36} o={1 - cut1} />
            {[-1, 1].map((g) => (
              <Bar key={g} x={320 + g * (full / 4 + 28 * cut1) + 0 * cut2} y={y} w={full / 2 - 8} h={36} o={cut1 * (1 - cut2)} />
            ))}
            {[-1, 1].flatMap((g) =>
              [-1, 1].map((h) => (
                <Bar key={`${g}${h}`} x={320 + g * (full / 2 + 56) / 2 + h * (full / 8 + 10)} y={y} w={full / 4 - 10} h={36} o={cut2} />
              )),
            )}
            <Label x={320} y={30} kind="label">{name}</Label>
            <Label x={320} y={200} kind="label">poles always come in pairs</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Field lines of a dipole as r = L sin^2(theta), with dots flowing from N round to S. */
const dipoleLine = (L: number, th: number, cx: number, cy: number, up: number): Pt => [cx + L * Math.sin(th) ** 2 * Math.cos(th), cy - up * L * Math.sin(th) ** 3 * 0.9];

export function DipoleField() {
  return (
    <Anim title="Field lines leave the north pole of a bar magnet, curve round and enter the south pole; inside the magnet they continue from south to north, so every line is a closed loop. A dashed surface round the north pole has as many lines going in as coming out" height={290} loop={9}>
      {(t) => {
        const cx = 320, cy = 145;
        const Ls = [95, 150, 215];
        const show = phase(t, 5, 6);
        return (
          <g>
            {Ls.flatMap((L, i) =>
              [1, -1].map((up) => (
                <g key={`${i}${up}`}>
                  <Trail points={curve(60, Math.PI, (u) => dipoleLine(L, u, cx, cy, up))} tone="soft" />
                  {[0, 1, 2].map((j) => {
                    const u = (((t / 5.5 + j / 3 + i * 0.11) % 1) * 0.84 + 0.08) * Math.PI;
                    const [px, py] = dipoleLine(L, u, cx, cy, up);
                    return <Ball key={j} x={px} y={py} r={3.2} glow={false} />;
                  })}
                </g>
              )),
            )}
            {[-0.35, -0.12, 0.12, 0.35].map((o, i) => (
              <Arrow key={i} x1={cx - 38 + 8 * Math.sin(TAU * (t / 2 - i * 0.12))} y1={cy + o * 50} x2={cx + 18 + 8 * Math.sin(TAU * (t / 2 - i * 0.12))} y2={cy + o * 50} tone="soft" />
            ))}
            <Bar x={cx} y={cy} w={160} h={26} letters={false} />
            <Label x={cx - 40} y={cy + 5} kind="sym">S</Label>
            <Label x={cx + 40} y={cy + 5} kind="sym">N</Label>
            <ellipse className="fig-guide fig-dash" cx={cx + 66} cy={cy} rx={62} ry={50} fill="none" style={{ opacity: show }} />
            <g style={{ opacity: show }}>
              <Label x={cx + 66} y={cy - 62} kind="label">closed surface: lines in = lines out</Label>
            </g>
            <Label x={cx - 150} y={280} kind="label" anchor="start">∮ B · dA = 0 for any closed surface</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function EquivalentSolenoid() {
  return (
    <Anim title="A bar magnet and a short solenoid make the same pattern of field; the solenoid fades in over the magnet, with circulating currents standing for the magnet's atoms" height={240} loop={8}>
      {(t) => {
        const f = 0.5 - 0.5 * Math.cos((TAU * t) / 8);
        const cx = 320, cy = 120, n = 9, w = 220;
        return (
          <g>
            <Bar x={cx} y={cy} w={w} h={64} o={1 - f * 0.85} />
            <g style={{ opacity: f }}>
              {Array.from({ length: n }, (_, i) => {
                const x = cx - w / 2 + 12 + (i * (w - 24)) / (n - 1);
                const a = TAU * (t / 1.6 - i * 0.07);
                return (
                  <g key={i}>
                    <ellipse className="fig-guide" cx={x} cy={cy} rx={7} ry={32} fill="none" />
                    <Ball x={x + 7 * Math.cos(a)} y={cy - 32 * Math.sin(a)} r={2.8} glow={false} />
                  </g>
                );
              })}
            </g>
            {[0, 1, 2].map((i) => (
              <Arrow key={i} x1={cx - w / 2 - 70 + i * 6} y1={cy - 20 + 20 * i} x2={cx - w / 2 - 20 + i * 6} y2={cy - 20 + 20 * i} tone="soft" />
            ))}
            <Label x={cx - w / 2 - 20} y={cy + 70} kind="sym">S</Label>
            <Label x={cx + w / 2 + 22} y={cy + 70} kind="sym">N</Label>
            <Label x={cx} y={206} kind="sym">m = N I A</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function AxialEquatorial() {
  return (
    <Anim title="A small magnet seen from two points at the same distance, one on its axis and one on its equator; the field on the axis is twice as strong, and both drop off as one over distance cubed as the points move away" height={270} loop={8}>
      {(t) => {
        const cx = 190, cy = 140;
        const r = 70 + 30 * (0.5 - 0.5 * Math.cos((TAU * t) / 8));
        const Bi = 100 / (r / 70) ** 3;
        return (
          <g>
            <Bar x={cx} y={cy} w={90} h={22} />
            <Line x1={cx} y1={cy - 118} x2={cx} y2={cy + 118} tone="soft" dashed />
            <Line x1={cx - 20} y1={cy} x2={cx + 180} y2={cy} tone="soft" dashed />
            <Ball x={cx + r + 45} y={cy} r={5} />
            <Arrow x1={cx + r + 45} y1={cy - 18} x2={cx + r + 45 + Math.min(150, 2 * Bi)} y2={cy - 18} label="" />
            <Label x={cx + r + 45} y={cy + 28} kind="label">axis</Label>
            <Ball x={cx} y={cy - r - 11} r={5} />
            <Arrow x1={cx + 14} y1={cy - r - 11} x2={cx + 14 + Math.min(150, Bi)} y2={cy - r - 11} label="" />
            <Label x={cx - 18} y={cy - r - 8} kind="label" anchor="end">equator</Label>
            <Label x={626} y={190} kind="sym" anchor="end">B axial = μ₀ 2 m / 4 π r³</Label>
            <Label x={626} y={220} kind="sym" anchor="end">B equatorial = μ₀ m / 4 π r³</Label>
            <Label x={626} y={250} kind="label" anchor="end">axial is exactly twice equatorial</Label>
            <Readout x={W - 14} y={20}>{`r = ${(r / 70).toFixed(2)} r₀: field ${(100 * Bi / 100).toFixed(0)}%`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ a magnet in a field

export function CompassTorque() {
  return (
    <Anim title="A small magnet in a uniform field is turned by a couple of forces and swings back and forth about the field direction; its potential energy follows a cosine bowl on the graph" height={260} loop={8}>
      {(t) => {
        const th = 1.05 * Math.cos((TAU * t) / 4);
        const cx = 140, cy = 130, L = 52;
        const nx = cx + L * Math.cos(th), ny = cy - L * Math.sin(th);
        const sx = cx - L * Math.cos(th), sy = cy + L * Math.sin(th);
        const gx = 360, gy = 130, gw = 250, gh = 70;
        const U = (a: number) => -Math.cos(a);
        const px = gx + gw / 2 + (th / Math.PI) * (gw - 40);
        return (
          <g>
            {[-70, -35, 35, 70].map((o, i) => (
              <Arrow key={i} x1={32 + 10 * Math.sin(TAU * (t / 2 - i * 0.1))} y1={cy + o} x2={76 + 10 * Math.sin(TAU * (t / 2 - i * 0.1))} y2={cy + o} tone="soft" />
            ))}
            <Label x={30} y={cy - 84} kind="sym">B</Label>
            <Line x1={sx} y1={sy} x2={nx} y2={ny} tone="bright" />
            <Ball x={nx} y={ny} r={7} />
            <Ball x={sx} y={sy} r={7} ghost />
            <Label x={nx + 16} y={ny - 6} kind="sym">N</Label>
            <Label x={sx - 16} y={sy + 16} kind="sym">S</Label>
            <Arrow x1={nx} y1={ny} x2={nx} y2={ny - 38 * Math.sign(th) * Math.min(1, Math.abs(Math.sin(th)) * 1.6)} tone="soft" label="" />
            <Arrow x1={sx} y1={sy} x2={sx} y2={sy + 38 * Math.sign(th) * Math.min(1, Math.abs(Math.sin(th)) * 1.6)} tone="soft" />
            <Axes x={gx} y={gy + gh / 2 - 10} w={gw} h={gh + 24} below={10} xLabel="θ" yLabel="U" />
            <Trail points={curve(80, 2 * Math.PI * 0.45, (u) => [gx + gw / 2 + ((u - Math.PI * 0.45) / Math.PI) * (gw - 40), gy + gh / 2 - 10 - gh * 0.5 * U(u - Math.PI * 0.45)] as Pt)} tone="soft" />
            <Ball x={px} y={gy + gh / 2 - 10 - gh * 0.5 * U(th)} r={5} />
            <Label x={gx + gw / 2} y={gy + gh + 30} kind="sym">U = −m B cos θ</Label>
            <Label x={gx + gw / 2} y={gy - 70} kind="sym">τ = m B sin θ</Label>
            <Readout x={W - 14} y={20}>{`θ = ${((th * 180) / Math.PI).toFixed(0)}°`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ the Earth

/** Dip angle in radians at geomagnetic latitude lat (radians): tan(dip) = 2 tan(lat). */
const dipAt = (lat: number) => Math.atan(2 * Math.tan(lat));

export function EarthDip() {
  return (
    <Anim title="The Earth acts like a huge bar magnet. A dip needle lies flat at the equator, tilts down more and more on the way north, and stands straight down at the magnetic pole" height={290} loop={9}>
      {(t) => {
        const cx = 220, cy = 150, R = 105;
        const sweep = ease(phase(t, 0.5, 7));
        const lats = [0, 20, 40, 60, 80].map((d) => (d * Math.PI) / 180);
        const needle = (lat: number, a: number) => {
          const dip = dipAt(lat);
          const px = cx + R * Math.cos(lat), py = cy - R * Math.sin(lat);
          const tx = -Math.sin(lat), ty = -Math.cos(lat);
          const rx = Math.cos(lat), ry = -Math.sin(lat);
          const dx = Math.cos(dip) * tx - Math.sin(dip) * rx;
          const dy = Math.cos(dip) * ty - Math.sin(dip) * ry;
          return <Arrow key={lat} x1={px - dx * 22} y1={py - dy * 22} x2={px + dx * 22} y2={py + dy * 22} width={3} tone={a > 0.5 ? 'bright' : 'soft'} />;
        };
        const latNow = sweep * 1.4;
        const dipNow = dipAt(latNow);
        const [bx, by] = [cx + R * Math.cos(latNow), cy - R * Math.sin(latNow)];
        return (
          <g>
            <circle className="fig-guide" cx={cx} cy={cy} r={R} fill="none" />
            <Line x1={cx} y1={cy - R - 30} x2={cx} y2={cy + R + 30} tone="soft" dashed />
            <Line x1={cx - R - 20} y1={cy} x2={cx + R + 20} y2={cy} tone="soft" dashed />
            <rect className="kit-block" x={cx - 5} y={cy - 38} width={10} height={38} />
            <rect className="kit-block is-filled" x={cx - 5} y={cy} width={10} height={38} />
            <Label x={cx - 14} y={cy - 28} kind="label" anchor="end">S pole</Label>
            <Label x={cx - 14} y={cy - 8} kind="label" anchor="end">of magnet</Label>
            {lats.map((l) => needle(l, phase(sweep * 1.4, l - 0.1, l)))}
            <Ball x={bx} y={by} r={4} ghost />
            <Label x={cx + R + 50} y={70} kind="label" anchor="start">latitude</Label>
            <Label x={cx + R + 50} y={96} kind="val" anchor="start">{`${((latNow * 180) / Math.PI).toFixed(0)}°`}</Label>
            <Label x={cx + R + 50} y={140} kind="label" anchor="start">dip angle</Label>
            <Label x={cx + R + 50} y={166} kind="val" anchor="start">{`${((dipNow * 180) / Math.PI).toFixed(0)}°`}</Label>
            <Label x={cx + R + 50} y={220} kind="sym" anchor="start">tan δ = 2 tan λ</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function DipTriangle() {
  return (
    <Anim title="The Earth's field at a place is split into a horizontal part and a vertical part; the angle of dip is the angle of the total field below the horizontal, and the triangle changes shape as the dip changes" height={250} loop={8}>
      {(t) => {
        const dip = 0.15 + 1.2 * (0.5 - 0.5 * Math.cos((TAU * t) / 8));
        const ox = 120, oy = 56, len = 170;
        const hx = ox + len * Math.cos(dip), hy = oy + len * Math.sin(dip);
        return (
          <g>
            <Arrow x1={ox} y1={oy} x2={ox + len * Math.cos(dip)} y2={oy} tone="soft" label="" labelAt="mid" />
            <Arrow x1={hx} y1={oy} x2={hx} y2={hy} tone="soft" label={<>B<Sub>V</Sub></>} />
            <Arrow x1={ox} y1={oy} x2={hx} y2={hy} label={<>B<Sub>E</Sub></>} labelAt="mid" />
            <path className="fig-guide" d={`M${ox + 44} ${oy}A44 44 0 0 1 ${ox + 44 * Math.cos(dip)} ${oy + 44 * Math.sin(dip)}`} fill="none" />
            <Label x={ox + (len * Math.cos(dip)) / 2} y={oy - 12} kind="sym">B<Sub>H</Sub></Label>
            <Label x={ox + 66 * Math.cos(dip / 2) + 6} y={oy + 66 * Math.sin(dip / 2) + 8} kind="sym">δ</Label>
            <Label x={450} y={70} kind="sym">B<Sub>H</Sub> = B<Sub>E</Sub> cos δ</Label>
            <Label x={450} y={104} kind="sym">B<Sub>V</Sub> = B<Sub>E</Sub> sin δ</Label>
            <Label x={450} y={138} kind="sym">tan δ = B<Sub>V</Sub> / B<Sub>H</Sub></Label>
            <Readout x={W - 14} y={20}>{`δ = ${((dip * 180) / Math.PI).toFixed(0)}°`}</Readout>
            <Label x={450} y={190} kind="label">horizontal at the equator, vertical at the pole</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ magnetisation

/** Three kinds of material with a grid of atomic magnets, with a field switched on and then off. */
export function ThreeKinds() {
  return (
    <Anim title="Three materials with a field switched on and then off: in a diamagnet each atom gets a tiny opposing magnet that vanishes with the field; in a paramagnet the randomly pointing atoms lean along the field and relax back; in a ferromagnet whole domains swing round and stay swung after the field is removed" height={290} loop={10}>
      {(t) => {
        const on = ease(phase(t, 1.5, 3)) * (1 - ease(phase(t, 6, 7.2)));
        const fer = ease(phase(t, 1.5, 3)) * (1 - ease(phase(t, 9.2, 9.9)));
        const keep = 1 - 0.1 * ease(phase(t, 6, 7.2));
        const panels = [
          { cx: 110, name: 'diamagnet' },
          { cx: 320, name: 'paramagnet' },
          { cx: 530, name: 'ferromagnet' },
        ];
        const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
        return (
          <g>
            {panels.map((p, pi) => (
              <g key={p.name}>
                <rect className="fig-guide" x={p.cx - 84} y={50} width={168} height={170} fill="none" />
                {Array.from({ length: 12 }, (_, i) => {
                  const col = i % 3, row = Math.floor(i / 3);
                  const x = p.cx - 52 + col * 52, y = 82 + row * 42;
                  const jig = Math.sin(TAU * (t / 1.3) + i * 1.7);
                  let ang = 0, len = 15, o = 1;
                  if (pi === 0) {
                    ang = Math.PI;
                    len = 2 + 13 * on;
                    o = 0.2 + 0.8 * on;
                  } else if (pi === 1) {
                    const base = rnd(i, 1) * TAU + 0.5 * jig;
                    ang = base + wrap(-base) * 0.6 * on;
                  } else {
                    const dom = (col >= 1 ? 1 : 0) + (row >= 2 ? 2 : 0);
                    const base = [2.2, -1.1, 3.6, 0.9][dom] + 0.1 * jig;
                    ang = base + wrap(-base) * 0.92 * fer * keep;
                  }
                  return <Mini key={i} x={x} y={y} angle={ang} len={len} o={o} />;
                })}
                <Label x={p.cx} y={244} kind="label">{p.name}</Label>
              </g>
            ))}
            <Arrow x1={20} y1={272} x2={20 + 70 * Math.max(on, 0.001)} y2={272} tone="soft" label="B" />
            <Readout x={W - 14} y={20}>{on > 0.5 ? 'field on' : t > 7 ? 'field removed' : 'no field'}</Readout>
            <Label x={420} y={274} kind="label">{t > 7.5 && t < 9.2 ? 'only the ferromagnet remembers' : ''}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function NonUniform() {
  return (
    <Anim title="A bar magnet's pole attracts three samples differently: a diamagnetic sample is pushed away, a paramagnetic sample is drawn weakly toward the stronger field, and a ferromagnetic sample is drawn in strongly" height={270} loop={8}>
      {(t) => {
        const s = 0.5 - 0.5 * Math.cos((TAU * t) / 8);
        const rows: [string, number][] = [
          ['diamagnetic: pushed away', 40],
          ['paramagnetic: weakly pulled in', -40],
          ['ferromagnetic: strongly pulled in', -130],
        ];
        return (
          <g>
            {rows.map(([name, dx], i) => {
              const y = 55 + i * 82;
              const x = 330 + dx * s;
              const dir = Math.sign(dx);
              return (
                <g key={name}>
                  <Bar x={80} y={y} w={110} h={34} />
                  <Line x1={135} y1={y} x2={W - 20} y2={y} tone="soft" dashed />
                  <rect className="kit-block" x={x - 16} y={y - 16} width={32} height={32} rx={3} />
                  <Arrow x1={x} y1={y - 28} x2={x + dir * Math.max(26, Math.abs(dx) * 0.5)} y2={y - 28} tone="soft" />
                  <Label x={W - 20} y={y + 30} kind="label" anchor="end">{name}</Label>
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

export function LinesInMaterial() {
  return (
    <Anim title="Field lines passing through three samples: a diamagnet pushes the lines apart so fewer pass through, a paramagnet gathers them slightly, and a ferromagnet draws many lines into itself" height={250} loop={8}>
      {(t) => {
        const panels: [number, number, string][] = [
          [110, 0.3, 'diamagnetic'],
          [320, -0.22, 'paramagnetic'],
          [530, -0.65, 'ferromagnetic'],
        ];
        return (
          <g>
            {panels.map(([cx, a, name]) => (
              <g key={name}>
                <rect className="kit-block" x={cx - 20} y={100} width={40} height={50} rx={3} />
                {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => {
                  const y0 = 125 + i * 17;
                  const f = (x: number) => 125 + (y0 - 125) * (1 + a * Math.exp(-(((x - cx) / 45) ** 2)));
                  const pts = curve(30, 180, (s) => [cx - 90 + s, f(cx - 90 + s)] as Pt);
                  return (
                    <g key={i}>
                      <Trail points={pts} tone="soft" />
                      {[0, 1].map((j) => {
                        const x = cx - 90 + ((((t / 3 + j / 2 + i * 0.05) % 1) + 1) % 1) * 180;
                        return <Ball key={j} x={x} y={f(x)} r={2.4} glow={false} />;
                      })}
                    </g>
                  );
                })}
                <Label x={cx} y={228} kind="label">{name}</Label>
              </g>
            ))}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ ferromagnets

export function Domains() {
  return (
    <Anim title="A ferromagnet is made of domains, each with all its atoms pointing the same way but each pointing differently; a growing field makes the domains lined up with it expand and then the rest swing round until the whole piece is saturated" height={250} loop={9}>
      {(t) => {
        const f = ease(phase(t, 1, 6));
        return (
          <g>
            <rect className="fig-guide" x={120} y={22} width={320} height={196} fill="none" />
            {Array.from({ length: 5 * 4 }, (_, i) => {
              const c = i % 5, r = Math.floor(i / 5);
              const x = 160 + c * 60, y = 56 + r * 46;
              const dom = (c < 2 ? 0 : c < 4 ? 1 : 2) + (r < 2 ? 0 : 3);
              const base = [2.4, -0.9, 3.7, -2.2, 1.6, 4.4][dom];
              const target = 0.05;
              const d = Math.atan2(Math.sin(target - base), Math.cos(target - base));
              const wob = 0.1 * Math.sin(TAU * t / 1.5 + dom);
              return <Mini key={i} x={x} y={y} angle={base + d * f + wob * (1 - f)} len={17} />;
            })}
            <Arrow x1={470} y1={125} x2={470 + 100 * f} y2={125} label="B" />
            <Label x={535} y={70} kind="label">domains swing round</Label>
            <Label x={535} y={190} kind="label">{f > 0.95 ? 'saturated' : 'growing field'}</Label>
            <Label x={280} y={244} kind="label">each domain: about 10¹⁵ atoms pointing together</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function CurieTemp() {
  return (
    <Anim title="As a ferromagnet is heated the aligned atomic magnets get more and more disordered, and at the Curie temperature the order is lost completely and the metal becomes a paramagnet; a graph of its magnetisation against temperature falls to zero there" height={260} loop={10}>
      {(t) => {
        const u = ease(phase(t, 0.6, 8.6));
        const T = 0.05 + 1.5 * u;
        const m = T < 1 ? Math.sqrt(1 - T) : 0;
        const gx = 340, gy = 210, gw = 260, gh = 140;
        return (
          <g>
            <rect className="fig-guide" x={30} y={40} width={250} height={180} fill="none" />
            {Array.from({ length: 20 }, (_, i) => {
              const c = i % 5, r = Math.floor(i / 5);
              const x = 60 + c * 48, y = 70 + r * 40;
              const ang = 0.2 + (1 - m) * (rnd(i, 2) * TAU - Math.PI) + 0.15 * (1 - m) * Math.sin(TAU * t * 1.5 + i);
              return <Mini key={i} x={x} y={y} angle={ang} len={15} />;
            })}
            <Axes x={gx} y={gy} w={gw} h={gh + 10} xLabel="T" yLabel="M" />
            <Trail points={curve(80, 1, (s) => [gx + s * (gw / 1.6) , gy - gh * Math.sqrt(Math.max(0, 1 - s))] as Pt)} tone="soft" />
            <Trail points={curve(60, Math.min(1.5, T), (s) => [gx + s * (gw / 1.6), gy - gh * (s < 1 ? Math.sqrt(1 - s) : 0)] as Pt)} />
            <Ball x={gx + T * (gw / 1.6)} y={gy - gh * m} r={5} />
            <Line x1={gx + gw / 1.6} y1={gy + 6} x2={gx + gw / 1.6} y2={gy - gh} tone="soft" dashed />
            <Label x={gx + gw / 1.6} y={gy + 24} kind="sym">T<Sub>c</Sub></Label>
            <Readout x={W - 14} y={20}>{T < 1 ? 'ferromagnetic' : 'paramagnetic'}</Readout>
            <Label x={155} y={244} kind="label">{`T = ${T.toFixed(2)} T`}<Sub>c</Sub></Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** One B-H loop point at progress u in [0, 3): initial curve, down-branch, up-branch. */
const BS = 1;
const HC = 0.25;
const WID = 0.18;
const loopPoint = (u: number): Pt => {
  if (u < 1) {
    const H = u * 1.0;
    return [H, BS * Math.tanh(H / 0.3)];
  }
  if (u < 2) {
    const H = 1 - 2 * (u - 1);
    return [H, BS * Math.tanh((H + HC) / WID)];
  }
  const H = -1 + 2 * (u - 2);
  return [H, BS * Math.tanh((H - HC) / WID)];
};

export function Hysteresis() {
  return (
    <Anim title="The field B in an iron bar plotted against the magnetising field H: the bar is first magnetised from zero to saturation, then H is reversed and reversed again, and B never retraces its path, leaving a loop with a leftover field at zero H and a reverse H needed to bring B back to zero" height={300} loop={10}>
      {(t) => {
        const ox = 330, oy = 150, sx = 200, sy = 100;
        const P = (h: number, b: number): Pt => [ox + h * sx, oy - b * sy];
        const u = Math.min(3, Math.max(0, ((t - 0.5) / 8) * 3));
        const trail = curve(200, u, (s) => P(...loopPoint(s)));
        const [h, b] = loopPoint(u);
        const br = BS * Math.tanh(HC / WID);
        const a1 = phase(t, 3, 3.8), a2 = phase(t, 4.4, 5.2);
        return (
          <g>
            <Axes x={ox} y={oy} w={sx + 80} h={sy + 40} below={sy + 40} xLabel="H" yLabel="B" />
            <Line x1={ox - sx - 60} y1={oy} x2={ox} y2={oy} tone="soft" />
            <Trail points={trail} />
            <Ball x={P(h, b)[0]} y={P(h, b)[1]} r={5.5} />
            <g style={{ opacity: a1 }}>
              <Ball x={P(0, br)[0]} y={P(0, br)[1]} r={4} ghost />
              <Label x={P(0, br)[0] + 10} y={P(0, br)[1] - 8} kind="sym" anchor="start">retentivity B<Sub>r</Sub></Label>
            </g>
            <g style={{ opacity: a2 }}>
              <Ball x={P(-HC, 0)[0]} y={P(-HC, 0)[1]} r={4} ghost />
              <Label x={P(-HC, 0)[0] - 4} y={P(-HC, 0)[1] + 22} kind="sym" anchor="end">coercivity H<Sub>c</Sub></Label>
            </g>
            <Label x={P(1, 1)[0] + 30} y={P(1, 1)[1] + 4} kind="label" anchor="start">saturation</Label>
            <Label x={30} y={50} kind="label" anchor="start">{u < 1 ? 'first magnetisation' : u < 2 ? 'H reduced, then reversed' : 'H reversed again'}</Label>
            <Label x={30} y={74} kind="label" anchor="start">area = heat lost per cycle</Label>
          </g>
        );
      }}
    </Anim>
  );
}

export function SoftHard() {
  return (
    <Anim title="Two hysteresis loops traced side by side: a narrow loop for soft iron, which magnetises and demagnetises easily and loses little energy, and a wide loop for hard steel, which is hard to demagnetise and so makes a good permanent magnet" height={260} loop={10}>
      {(t) => {
        const loops: [number, number, number, string][] = [
          [170, 0.06, 0.12, 'soft iron: narrow loop'],
          [470, 0.55, 0.3, 'steel: wide loop'],
        ];
        const u = ((t % 8) / 8) * 2;
        return (
          <g>
            {loops.map(([cx, hc, wd, name]) => {
              const pt = (s: number): Pt => {
                const H = s < 1 ? 1 - 2 * s : -1 + 2 * (s - 1);
                const c = s < 1 ? hc : -hc;
                return [cx + 110 * H, 110 - 80 * Math.tanh((H + c) / wd)];
              };
              const whole = curve(120, 2, pt);
              const [px, py] = pt(u);
              return (
                <g key={name}>
                  <Axes x={cx} y={110} w={130} h={100} below={100} xLabel="H" yLabel="B" />
                  <Line x1={cx - 130} y1={110} x2={cx} y2={110} tone="soft" />
                  <Trail points={whole} tone="soft" />
                  <Trail points={curve(60, Math.min(u, 2) * 0.5, (s) => pt(s + u - Math.min(u, 2) * 0.5))} />
                  <Ball x={px} y={py} r={5} />
                  <Label x={cx} y={242} kind="label">{name}</Label>
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

export function Atom() {
  return (
    <Anim title="An electron circling a nucleus is a tiny loop of current; the loop has a magnetic moment along its axis, which the arrow shows, and the current is the charge divided by the time of one orbit" height={240} loop={8}>
      {(t) => {
        const cx = 170, cy = 120, r = 70, T = 2;
        const a = (TAU * t) / T;
        const ex = cx + r * Math.cos(a), ey = cy - r * Math.sin(a);
        return (
          <g>
            <circle className="fig-guide" cx={cx} cy={cy} r={r} fill="none" />
            <Trail points={curve(30, 1.2, (u) => [cx + r * Math.cos(a - u * 1.2), cy - r * Math.sin(a - u * 1.2)] as Pt)} />
            <Ball x={cx} y={cy} r={8} />
            <Ball x={ex} y={ey} r={4.5} />
            <Label x={ex + 14} y={ey - 8} kind="sym">e</Label>
            <Arrow x1={ex} y1={ey} x2={ex + 22 * Math.sin(a)} y2={ey + 22 * Math.cos(a)} tone="soft" />
            <Label x={cx} y={cy + r + 34} kind="label">electron orbit</Label>
            <Arrow x1={310} y1={190} x2={310} y2={190 - 90 * (0.7 + 0.3 * Math.sin(TAU * t / 4))} label="m" />
            <Label x={360} y={90} kind="sym" anchor="start">I = e / T</Label>
            <Label x={360} y={124} kind="sym" anchor="start">m = I A = e v r / 2</Label>
            <Label x={360} y={158} kind="sym" anchor="start">μ<Sub>B</Sub> = 9.27 × 10⁻²⁴ A m²</Label>
          </g>
        );
      }}
    </Anim>
  );
}
