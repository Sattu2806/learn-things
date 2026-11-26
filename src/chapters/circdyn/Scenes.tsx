/**
 * Animated diagrams for "Forces in circular motion". Every picture is worked
 * out from the real physics (v²/r, tan θ = v²/(r g) and so on) and drawn with
 * the animation kit. Lengths are in SVG pixels; time constants are chosen so
 * the motion is slow enough to follow.
 */
import { Anim, Arrow, Ball, Block, Label, Line, Readout, Trail, Axes, W, DEG, clamp, ease, lerp, phase } from '../kit/Anim';

const TAU = 2 * Math.PI;

/** A few lines of mono text, top left. */
function Notes({ lines, x = 20, y = 24 }: { lines: string[]; x?: number; y?: number }) {
  return (
    <g>
      {lines.map((s, i) => (
        <Label key={i} x={x} y={y + 18 * i} kind="val" anchor="start">
          {s}
        </Label>
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------------
// 1. Four things that can be the centripetal force

export function Providers() {
  return (
    <Anim title="Four things going round a circle: a ball on a string, a coin on a turntable, a planet, a ball against a wall. Each has one real force pointing to the centre." height={240} loop={8}>
      {(t) => {
        const names = ['string tension', 'friction', 'gravity', 'wall pushing in'];
        const syms = ['T', 'f', 'W', 'N'];
        const R = 46;
        const cy = 100;
        const grow = ease(phase(t, 0.3, 1.2));
        return (
          <g>
            {names.map((nm, i) => {
              const cx = 80 + 160 * i;
              const a = 1.4 * t + i * 1.3;
              const bx = cx + R * Math.cos(a);
              const by = cy - R * Math.sin(a);
              const ux = (cx - bx) / R;
              const uy = (cy - by) / R;
              const L = 32 * grow;
              return (
                <g key={nm}>
                  {i === 0 && (
                    <g>
                      <Line x1={cx} y1={cy} x2={bx} y2={by} />
                      <circle className="fig-ball" cx={cx} cy={cy} r={3} />
                    </g>
                  )}
                  {i === 1 && <circle className="kit-block" cx={cx} cy={cy} r={R + 16} />}
                  {i === 2 && <Ball x={cx} y={cy} r={10} />}
                  {i === 3 && <circle className="fig-path" cx={cx} cy={cy} r={R + 9} fill="none" />}
                  {i !== 2 && <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={R} fill="none" />}
                  <Ball x={bx} y={by} r={i === 2 ? 5 : 6.5} />
                  <Arrow x1={bx} y1={by} x2={bx + ux * L} y2={by + uy * L} label={syms[i]} labelAt="mid" />
                  <Label x={cx} y={cy + R + 48} kind="label">
                    {nm}
                  </Label>
                </g>
              );
            })}
            <Label x={W / 2} y={20} kind="label">
              In each case one real force points to the centre
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------------------
// 2. A ball on a string: cut it and it goes straight

export function CutString({ compact }: { compact?: boolean }) {
  const H = compact ? 170 : 260;
  const R = compact ? 50 : 80;
  const cx = compact ? 200 : 190;
  const cy = H / 2 + (compact ? 4 : 0);
  const w = 2.2;
  const tc = (1.5 * Math.PI + TAU) / w;
  const speed = w * R;
  const tauMax = compact ? 2.2 : 2.4;
  return (
    <Anim title="A ball whirled on a string. When the string is cut the ball flies off along the tangent, in a straight line." height={H} loop={compact ? 8 : 9}>
      {(t) => {
        const cut = t >= tc;
        const th = w * Math.min(t, tc);
        const px = cx + R * Math.cos(th);
        const py = cy - R * Math.sin(th);
        const dx = -Math.sin(th);
        const dy = -Math.cos(th);
        const tau = clamp(t - tc, 0, tauMax);
        const bx = cut ? px + dx * speed * tau : px;
        const by = cut ? py + dy * speed * tau : py;
        const ux = (cx - px) / R;
        const uy = (cy - py) / R;
        const pts: [number, number][] = [];
        if (cut) for (let i = 0; i <= 16; i++) pts.push([px + dx * speed * tau * (i / 16), py + dy * speed * tau * (i / 16)]);
        return (
          <g>
            <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={R} fill="none" />
            <circle className="fig-ball" cx={cx} cy={cy} r={3} />
            {!cut && <Line x1={cx} y1={cy} x2={px} y2={py} />}
            {cut && <Line x1={cx} y1={cy} x2={cx + (px - cx) * 0.55} y2={cy + (py - cy) * 0.55} dashed tone="faint" />}
            {cut && <Trail points={pts} />}
            {cut && <Ball x={px} y={py} ghost r={6.5} />}
            {cut && compact && (
              <g>
                <Line x1={px} y1={py} x2={px + (px - cx) * 1.3} y2={py + (py - cy) * 1.3} dashed tone="faint" />
                <Label x={px + (px - cx) * 1.3} y={py + (py - cy) * 1.3 + 16} kind="val">
                  ✕ not outward
                </Label>
              </g>
            )}
            <Ball x={bx} y={by} />
            {!cut && <Arrow x1={px} y1={py} x2={px + ux * 44} y2={py + uy * 44} label="T" />}
            <Arrow x1={bx} y1={by} x2={bx + dx * 46} y2={by + dy * 46} dashed tone="soft" label="v" />
            {!compact && (
              <Notes
                lines={cut ? ['string cut: T = 0', 'no force, so no turning:', 'straight line at constant v'] : ['T = m · v² / r', 'T points to the centre']}
              />
            )}
            {compact && <Label x={W - 20} y={24} kind="val" anchor="end">{cut ? 'T = 0: straight on' : 'T pulls inward'}</Label>}
          </g>
        );
      }}
    </Anim>
  );
}

/** Two balls on strings of equal length: twice the speed needs four times the pull. */
export function TwoSpeeds() {
  return (
    <Anim title="Two balls on equal strings, one at twice the speed. The arrow for the string pull is four times longer for the faster one." height={230} loop={TAU / 1.2}>
      {(t) => {
        const R = 62;
        const cy = 108;
        const grow = ease(phase(t, 0.2, 0.9));
        const panels = [
          { cx: 170, w: 1.2, name: 'speed v', pull: 'T' },
          { cx: 470, w: 2.4, name: 'speed 2v', pull: '4T' },
        ];
        return (
          <g>
            {panels.map((p) => {
              const a = p.w * t;
              const bx = p.cx + R * Math.cos(a);
              const by = cy - R * Math.sin(a);
              const L = ((18 * (p.w / 1.2) ** 2) * grow);
              return (
                <g key={p.name}>
                  <circle className="fig-guide fig-dash fig-faint" cx={p.cx} cy={cy} r={R} fill="none" />
                  <circle className="fig-ball" cx={p.cx} cy={cy} r={3} />
                  <Line x1={p.cx} y1={cy} x2={bx} y2={by} />
                  <Ball x={bx} y={by} />
                  <Arrow x1={bx} y1={by} x2={bx + ((p.cx - bx) / R) * L} y2={by + ((cy - by) / R) * L} label={p.pull} />
                  <Arrow x1={bx} y1={by} x2={bx - Math.sin(a) * 14 * (p.w / 1.2)} y2={by - Math.cos(a) * 14 * (p.w / 1.2)} dashed tone="soft" />
                  <Label x={p.cx} y={cy + R + 44} kind="label">
                    {p.name}
                  </Label>
                </g>
              );
            })}
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------------------
// 3. A car on a flat bend

export function FlatCar() {
  const r = 50;
  const mu = 0.6;
  const g = 9.8;
  const vmax = Math.sqrt(mu * g * r);
  const Rpx = 90;
  const k = 4;
  const pxPerM = Rpx / r;
  const ts = (vmax - 8) / 2;
  const thAt = (t: number) => (k / r) * (8 * t + t * t);
  return (
    <Anim title="A car goes round a flat bend, speeding up. Friction points to the centre and grows with the speed squared. When it reaches its limit the car slides off along the tangent." height={290} loop={10}>
      {(t) => {
        const cx = 200;
        const cy = 145;
        const slipped = t >= ts;
        const tt = Math.min(t, ts);
        const th = thAt(tt);
        const v = slipped ? vmax : 8 + 2 * tt;
        const px = cx + Rpx * Math.cos(th);
        const py = cy - Rpx * Math.sin(th);
        const dx = -Math.sin(th);
        const dy = -Math.cos(th);
        const tau = clamp(t - ts, 0, 3.2);
        const sp = pxPerM * k * vmax;
        const bx = slipped ? px + dx * sp * tau : px;
        const by = slipped ? py + dy * sp * tau : py;
        const ux = (cx - px) / Rpx;
        const uy = (cy - py) / Rpx;
        const fLen = 62 * (v / vmax) ** 2;
        const pts: [number, number][] = [];
        if (slipped) for (let i = 0; i <= 14; i++) pts.push([px + dx * sp * tau * (i / 14), py + dy * sp * tau * (i / 14)]);
        const ang = th / DEG + 90;
        return (
          <g>
            <circle className="fig-path" cx={cx} cy={cy} r={Rpx + 20} fill="none" opacity={0.35} />
            <circle className="fig-path" cx={cx} cy={cy} r={Rpx - 20} fill="none" opacity={0.35} />
            <circle className="fig-ball" cx={cx} cy={cy} r={3} />
            {slipped && <Trail points={pts} />}
            {slipped && <Block x={px} y={py} w={34} h={18} angle={ang} />}
            <Block x={bx} y={by} w={34} h={18} angle={ang} filled />
            {!slipped && (
              <g>
                <Arrow x1={px} y1={py} x2={px + ux * 62} y2={py + uy * 62} dashed tone="faint" />
                <Arrow x1={px} y1={py} x2={px + ux * fLen} y2={py + uy * fLen} label="f" />
              </g>
            )}
            <Label x={W - 20} y={26} kind="val" anchor="end">
              v = {v.toFixed(1)} m/s
            </Label>
            <Notes
              x={420}
              y={70}
              lines={slipped ? ['friction cannot supply', 'm v² / r any more:', 'the car goes straight on'] : ['f = m v² / r', 'dashed: the most friction', 'the tyres can give, μ m g']}
            />
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------------------
// 4 and 5. Banked roads, seen from behind the car (the centre of the turn is on the left)

type BankMode = 'ideal' | 'speed' | 'tune';

export function Bank({ mode, small }: { mode: BankMode; small?: boolean }) {
  const r = 100;
  const g = 9.8;
  const H = small ? 190 : 290;
  const sc = small ? 0.62 : 1;
  return (
    <Anim
      title={
        mode === 'ideal'
          ? 'A car on a banked road. The normal force leans toward the centre; its horizontal part is the centripetal force and its vertical part balances the weight.'
          : mode === 'speed'
            ? 'A car on a banked road at rising speed: friction acts up the slope when slow, is zero at the design speed, and acts down the slope when fast.'
            : 'A car at 20 metres per second as the banking angle increases. The friction needed is zero at 22 degrees.'
      }
      height={H}
      loop={mode === 'ideal' ? 8 : 10}
    >
      {(t) => {
        let thDeg = 22.2;
        let v = 20;
        if (mode === 'speed') v = lerp(6, 28, ease(phase(t, 0.5, 8)));
        if (mode === 'tune') thDeg = lerp(6, 36, ease(phase(t, 0.5, 8)));
        const th = thDeg * DEG;
        const a = (v * v) / r; // m/s²
        const ag = a / g;
        const cx0 = 330;
        const cy0 = (small ? 112 : 150);
        const ux = Math.cos(th);
        const uy = -Math.sin(th);
        const nx = -Math.sin(th);
        const ny = -Math.cos(th);
        const tn = Math.tan(th);
        const x1 = Math.max(cx0 - 300, cx0 - (H - 4 - cy0) / tn);
        const x2 = cx0 + 300;
        const ya = cy0 + (cx0 - x1) * tn;
        const yb = cy0 - (x2 - cx0) * tn;
        const lift = 17 * sc;
        const gx = cx0 + nx * lift;
        const gy = cy0 + ny * lift;
        const mg = 50 * sc;
        const Nlen = mg * (Math.cos(th) + ag * Math.sin(th));
        const fUp = mg * (Math.sin(th) - ag * Math.cos(th));
        const s1 = ease(phase(t, 0.6, 1.4));
        const s2 = ease(phase(t, 1.8, 2.6));
        const s3 = ease(phase(t, 3.2, 4.0));
        const full = mode !== 'ideal';
        const A1 = full ? 1 : s1;
        const A2 = full ? 1 : s2;
        const A3 = full ? 0 : s3;
        return (
          <g>
            <path className="fig-cliff" d={`M${x1} ${ya}L${x2} ${yb}L${x2} ${H - 4}L${x1} ${H - 4}Z`} />
            <Block x={gx} y={gy} w={58 * sc} h={34 * sc} angle={thDeg} filled />
            <Arrow x1={gx} y1={gy} x2={gx} y2={gy + mg * A1} label="mg" />
            <Arrow x1={gx} y1={gy} x2={gx + nx * Nlen * A2} y2={gy + ny * Nlen * A2} label="N" />
            {A3 > 0.01 && (
              <g>
                <Arrow x1={gx} y1={gy} x2={gx} y2={gy - Nlen * Math.cos(th) * A3} dashed tone="soft" />
                <Arrow x1={gx} y1={gy} x2={gx - Nlen * Math.sin(th) * A3} y2={gy} dashed tone="soft" />
                <Label x={gx + 8} y={gy - Nlen * Math.cos(th) * A3 - 8} kind="sym" anchor="start">
                  N cos θ
                </Label>
                <Label x={gx - Nlen * Math.sin(th) * A3 - 6} y={gy + 22} kind="sym" anchor="end">
                  N sin θ
                </Label>
              </g>
            )}
            {full && Math.abs(fUp) > 0.025 * mg && (
              <Arrow x1={cx0} y1={cy0} x2={cx0 + ux * fUp * 1} y2={cy0 + uy * fUp * 1} label="f" />
            )}
            <Arrow x1={cx0 - 70 * sc} y1={cy0 - 50 * sc} x2={cx0 - 160 * sc} y2={cy0 - 50 * sc} dashed tone="faint" />
            <Label x={cx0 - 166 * sc} y={cy0 - 46 * sc} kind="label" anchor="end">
              centre of the turn
            </Label>
            {!small && mode === 'ideal' && (
              <Notes lines={['N cos θ = m g', 'N sin θ = m v² / r']} x={20} y={24} />
            )}
            {!small && mode === 'speed' && (
              <g>
                <Notes lines={[`v = ${v.toFixed(1)} m/s`, `design speed 20 m/s`]} x={20} y={24} />
                <Label x={W - 20} y={24} kind="val" anchor="end">
                  {Math.abs(fUp) < 0.025 * mg ? 'f = 0' : fUp > 0 ? 'f points up the slope' : 'f points down the slope'}
                </Label>
              </g>
            )}
            {!small && mode === 'tune' && (
              <g>
                <Notes lines={[`θ = ${thDeg.toFixed(1)}°`, 'v = 20 m/s, r = 100 m']} x={20} y={24} />
                <Label x={W - 20} y={24} kind="val" anchor="end">
                  {Math.abs(fUp) < 0.025 * mg ? 'f = 0: ideal banking' : fUp > 0 ? 'too steep: f up the slope' : 'too flat: f down the slope'}
                </Label>
              </g>
            )}
            {small && (
              <Readout x={W - 20} y={22}>
                θ = {thDeg.toFixed(0)}°
              </Readout>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------------------
// 6. The conical pendulum

export function Conical({ theta = 30 }: { theta?: number }) {
  const th = theta * DEG;
  const spin = 2.2;
  return (
    <Anim title="A conical pendulum: a bob on a string goes round in a horizontal circle. The vertical part of the tension holds it up; the horizontal part pulls it to the centre." height={280} loop={(3 * TAU) / spin}>
      {(t) => {
        const x0 = 320;
        const y0 = 30;
        const L = 190;
        const h = L * Math.cos(th);
        const R = L * Math.sin(th);
        const ry = R * 0.24;
        const yc = y0 + h;
        const phi = spin * t;
        const bx = x0 + R * Math.cos(phi);
        const by = yc + ry * Math.sin(phi);
        const mg = 46;
        const Tl = mg / Math.cos(th);
        const Fc = mg * Math.tan(th);
        const a1 = ease(phase(t, 0.6, 1.4));
        const a2 = ease(phase(t, 1.8, 2.6));
        const a3 = ease(phase(t, 3.0, 4.0));
        const sx = x0 - bx;
        const sy = y0 - by;
        const sl = Math.hypot(sx, sy);
        const hx = -Math.cos(phi);
        const hy = -0.24 * Math.sin(phi);
        return (
          <g>
            <Line x1={x0 - 50} y1={y0} x2={x0 + 50} y2={y0} tone="bright" />
            {[-40, -24, -8, 8, 24, 40].map((d) => (
              <line key={d} className="fig-guide fig-faint" x1={x0 + d} y1={y0} x2={x0 + d - 8} y2={y0 - 8} />
            ))}
            <ellipse className="fig-guide fig-dash fig-faint" cx={x0} cy={yc} rx={R} ry={ry} fill="none" />
            <Line x1={x0} y1={y0} x2={x0} y2={yc} dashed tone="faint" />
            <circle className="fig-ball" cx={x0} cy={yc} r={2.5} />
            <path className="fig-guide" d={`M${x0} ${y0 + 44}A44 44 0 0 0 ${x0 + 44 * Math.sin(th)} ${y0 + 44 * Math.cos(th)}`} fill="none" />
            <Label x={x0 + 22} y={y0 + 62} kind="sym">
              θ
            </Label>
            <Line x1={x0} y1={y0} x2={bx} y2={by} tone="bright" />
            <Ball x={bx} y={by} r={7 + 1.5 * Math.sin(phi)} />
            <Arrow x1={bx} y1={by} x2={bx} y2={by + mg * a1} label="mg" />
            <Arrow x1={bx} y1={by} x2={bx + (sx / sl) * Tl * a2} y2={by + (sy / sl) * Tl * a2} label="T" />
            {a3 > 0.02 && (
              <g>
                <Arrow x1={bx} y1={by} x2={bx} y2={by - mg * a3} dashed tone="soft" />
                <Arrow x1={bx} y1={by} x2={bx + hx * Fc * a3} y2={by + hy * Fc * a3} dashed tone="soft" />
              </g>
            )}
            <Notes lines={['T cos θ = m g', 'T sin θ = m v² / r']} x={20} y={24} />
            <Label x={x0} y={yc + ry + 30} kind="val">
              r = L sin θ
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------------------
// 7 and 8. Vertical circles

const GP = 160; // gravity in animation pixels per second squared

const periodCache = new Map<string, number>();
/** Time to go once round, for a ball that has speed² = c·g·r at the bottom. */
function circlePeriod(c: number, R: number): number {
  const key = `${c}/${R}`;
  const hit = periodCache.get(key);
  if (hit) return hit;
  let phi = 0;
  let t = 0;
  const vb2 = c * GP * R;
  while (phi < TAU && t < 60) {
    const v2 = Math.max(vb2 - 2 * GP * R * (1 - Math.cos(phi)), 0.02 * GP * R);
    phi += (Math.sqrt(v2) / R) * 0.005;
    t += 0.005;
  }
  periodCache.set(key, t);
  return t;
}
function circleAngle(c: number, R: number, t: number): number {
  const vb2 = c * GP * R;
  let phi = 0;
  const n = Math.floor(t / 0.01);
  for (let i = 0; i < n; i++) {
    const v2 = Math.max(vb2 - 2 * GP * R * (1 - Math.cos(phi)), 0.02 * GP * R);
    phi += (Math.sqrt(v2) / R) * 0.01;
  }
  return phi;
}

type LoopMode = 'string' | 'coaster' | 'bucket';

export function VerticalCircle({ c = 5, mode = 'string' }: { c?: number; mode?: LoopMode }) {
  const R = 95;
  const loop = circlePeriod(c, R);
  const title =
    mode === 'string'
      ? 'A ball on a string goes round a vertical circle. The tension is largest at the bottom and smallest at the top, while the weight stays the same.'
      : mode === 'coaster'
        ? 'A roller-coaster car goes round a loop. The track pushes on it with a force that is large at the bottom and small at the top.'
        : 'A bucket of water swung in a vertical circle. At the top the bucket pushes down on the water as well as gravity.';
  return (
    <Anim title={title} height={280} loop={loop}>
      {(t) => {
        const cx = 320;
        const cy = 138;
        const phi = circleAngle(c, R, t);
        const cph = Math.cos(phi);
        const nMg = c - 2 + 3 * cph; // tension or normal force, in units of m g
        const sph = Math.sin(phi);
        const rr = mode === 'coaster' ? R - 10 : R;
        const bx = cx + rr * sph;
        const by = cy + rr * cph;
        const mgPx = Math.min(16, 90 / (c + 1));
        const lab = mode === 'string' ? 'T' : 'N';
        return (
          <g>
            {mode === 'coaster' ? <circle className="fig-path" cx={cx} cy={cy} r={R} fill="none" /> : <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={R} fill="none" />}
            <circle className="fig-ball" cx={cx} cy={cy} r={3} />
            {mode === 'string' && <Line x1={cx} y1={cy} x2={bx} y2={by} />}
            {mode === 'bucket' && <Line x1={cx} y1={cy} x2={cx + (R - 12) * sph} y2={cy + (R - 12) * cph} />}
            {mode === 'string' && <Ball x={bx} y={by} />}
            {mode === 'coaster' && <Block x={bx} y={by} w={30} h={16} angle={phi / DEG} filled />}
            {mode === 'bucket' && (
              <g transform={`translate(${cx + R * sph} ${cy + R * cph}) rotate(${-phi / DEG})`}>
                <path className="fig-path" d="M-15 12L15 12M-15 12L-11 -12M15 12L11 -12" fill="none" />
                <circle className="fig-ball" cx={0} cy={5} r={5} />
              </g>
            )}
            <Arrow x1={bx} y1={by} x2={bx - sph * nMg * mgPx} y2={by - cph * nMg * mgPx} label={lab} />
            <Arrow x1={bx} y1={by} x2={bx} y2={by + mgPx} dashed tone="soft" label="mg" />
            <Readout x={W - 20} y={24}>
              {lab} = {Math.max(nMg, 0).toFixed(1)} mg
            </Readout>
            <Label x={cx} y={cy - R - 14} kind="label">
              top
            </Label>
            <Label x={cx} y={cy + R + 26} kind="label">
              bottom
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Too slow at the top: the string goes slack where T reaches zero, and the ball falls as a projectile. */
function slackPlan(c: number, R: number) {
  const cos0 = (2 - c) / 3;
  const phi0 = Math.acos(cos0);
  const vb2 = c * GP * R;
  let phi = 0;
  let t0 = 0;
  while (phi < phi0) {
    const v2 = Math.max(vb2 - 2 * GP * R * (1 - Math.cos(phi)), 1);
    phi += (Math.sqrt(v2) / R) * 0.005;
    t0 += 0.005;
  }
  const v0 = Math.sqrt(Math.max(vb2 - 2 * GP * R * (1 - cos0), 0));
  const p0 = [R * Math.sin(phi0), R * cos0];
  const vv = [v0 * Math.cos(phi0), -v0 * Math.sin(phi0)];
  let tau = 0.05;
  for (; tau < 6; tau += 0.005) {
    const x = p0[0] + vv[0] * tau;
    const y = p0[1] + vv[1] * tau + 0.5 * GP * tau * tau;
    if (Math.hypot(x, y) >= R) break;
  }
  return { t0, phi0, p0, vv, tau };
}

export function SlackString({ c = 3.5 }: { c?: number }) {
  const R = 95;
  const plan = slackPlan(c, R);
  return (
    <Anim title="A ball on a string that is not fast enough at the bottom. Before it reaches the top the tension drops to zero, the string goes slack and the ball falls as a projectile." height={280} loop={plan.t0 + plan.tau + 3}>
      {(t) => {
        const cx = 320;
        const cy = 150;
        const slack = t >= plan.t0;
        const phi = slack ? plan.phi0 : circleAngle(c, R, t);
        const tau = clamp(t - plan.t0, 0, plan.tau);
        let bx = cx + R * Math.sin(phi);
        let by = cy + R * Math.cos(phi);
        if (slack) {
          bx = cx + plan.p0[0] + plan.vv[0] * tau;
          by = cy + plan.p0[1] + plan.vv[1] * tau + 0.5 * GP * tau * tau;
        }
        const nMg = Math.max(c - 2 + 3 * Math.cos(phi), 0);
        const mgPx = 16;
        const pts: [number, number][] = [];
        if (slack) for (let i = 0; i <= 24; i++) {
          const s = (tau * i) / 24;
          pts.push([cx + plan.p0[0] + plan.vv[0] * s, cy + plan.p0[1] + plan.vv[1] * s + 0.5 * GP * s * s]);
        }
        return (
          <g>
            <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={R} fill="none" />
            <circle className="fig-ball" cx={cx} cy={cy} r={3} />
            {slack ? <Line x1={cx} y1={cy} x2={bx} y2={by} dashed tone="faint" /> : <Line x1={cx} y1={cy} x2={bx} y2={by} />}
            {slack && <Trail points={pts} />}
            {slack && <Ball x={cx + plan.p0[0]} y={cy + plan.p0[1]} ghost />}
            <Ball x={bx} y={by} />
            {!slack && nMg * mgPx > 3 && <Arrow x1={bx} y1={by} x2={bx - Math.sin(phi) * nMg * mgPx} y2={by - Math.cos(phi) * nMg * mgPx} label="T" />}
            <Arrow x1={bx} y1={by} x2={bx} y2={by + mgPx * 1.6} label="mg" />
            <Readout x={W - 20} y={24}>
              {slack ? 'T = 0: slack' : `T = ${nMg.toFixed(1)} mg`}
            </Readout>
            {slack && (
              <Label x={cx + plan.p0[0] + 14} y={cy + plan.p0[1] + 4} kind="label" anchor="start">
                string goes slack
              </Label>
            )}
            <Notes lines={['v at the bottom is below √(5 g r)', 'so the ball cannot reach the top']} />
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------------------
// 9. Hump-back bridge

interface BridgeProps {
  /** Which passes to show: a slow one, a fast one, or both. */
  pass?: 'both' | 'fast';
  compact?: boolean;
  /** Cars as [length, height] in pixels at full size, for the "mass does not matter" picture. */
  cars?: [number, number][];
}

export function HumpBridge({ pass = 'both', compact, cars = [[30, 16]] }: BridgeProps) {
  const sc = compact ? 0.58 : 1;
  const H = compact ? 190 : 300;
  const R = 150 * sc;
  const L0 = 100 * sc;
  const g = 200 * sc;
  const a = 30 * DEG;
  const cx = 320;
  const cy = (compact ? 56 : 96) + R;
  const mgPx = 36 * sc;
  const hOff = 8 * sc;
  const S = 2 * L0 + 2 * a * R;
  const vA = Math.sqrt(0.3 * g * R);
  const vB = Math.sqrt(1.1 * g * R);
  const arcS = [cx - R * Math.sin(a), cy - R * Math.cos(a)];
  const arcE = [cx + R * Math.sin(a), cy - R * Math.cos(a)];
  const A0 = [arcS[0] - L0 * Math.cos(a), arcS[1] + L0 * Math.sin(a)];
  const roadY = (x: number) => {
    if (x < arcS[0]) return A0[1] - (x - A0[0]) * Math.tan(a);
    if (x > arcE[0]) return arcE[1] + (x - arcE[0]) * Math.tan(a);
    return cy - Math.sqrt(Math.max(R * R - (x - cx) ** 2, 0));
  };
  const surf = (s: number) => {
    if (s <= L0) return { x: A0[0] + s * Math.cos(a), y: A0[1] - s * Math.sin(a), al: -a };
    if (s >= L0 + 2 * a * R) return { x: arcE[0] + (s - L0 - 2 * a * R) * Math.cos(a), y: arcE[1] + (s - L0 - 2 * a * R) * Math.sin(a), al: a };
    const al = (s - L0) / R - a;
    return { x: cx + R * Math.sin(al), y: cy - R * Math.cos(al), al };
  };
  // Flight of the fast car after it leaves the road where the hump begins.
  const p0 = { x: arcS[0] - hOff * Math.sin(a), y: arcS[1] - hOff * Math.cos(a) };
  const vx = vB * Math.cos(a);
  const vy = -vB * Math.sin(a);
  let tauL = 0.2;
  for (; tauL < 4; tauL += 0.01) {
    const x = p0.x + vx * tauL;
    const y = p0.y + vy * tauL + 0.5 * g * tauL * tauL;
    if (y + hOff >= roadY(x) || x > W - 10 || y > H) break;
  }
  const tA = S / vA;
  const startB = pass === 'both' ? 0.3 + tA + 1.4 : 0.3;
  const lag = (cars.length > 1 ? 70 * sc : 0);
  const total = startB + L0 / vB + tauL + 1.4 + lag / vB;
  const roadPath = (() => {
    let d = `M${A0[0] - 40 * Math.cos(a)} ${A0[1] + 40 * Math.sin(a)}L${A0[0]} ${A0[1]}L${arcS[0]} ${arcS[1]}`;
    for (let i = 1; i <= 30; i++) {
      const al = -a + (2 * a * i) / 30;
      d += `L${cx + R * Math.sin(al)} ${cy - R * Math.cos(al)}`;
    }
    const e2 = [arcE[0] + (L0 + 40) * Math.cos(a), arcE[1] + (L0 + 40) * Math.sin(a)];
    d += `L${arcE[0] + L0 * Math.cos(a)} ${arcE[1] + L0 * Math.sin(a)}L${e2[0]} ${e2[1]}L${e2[0]} ${H - 4}L${A0[0] - 40 * Math.cos(a)} ${H - 4}Z`;
    return d;
  })();
  const ge = (v: number, fast: boolean, u: number, size: [number, number], idx: number) => {
    const sz = [size[0] * sc, size[1] * sc];
    if (u < 0) return null;
    const tLeave = L0 / v;
    if (fast && u > tLeave) {
      const tau = Math.min(u - tLeave, tauL);
      const x = p0.x + vx * tau;
      const y = p0.y + vy * tau + 0.5 * g * tau * tau;
      const trail: [number, number][] = [];
      for (let i = 0; i <= 20; i++) {
        const s = (tau * i) / 20;
        trail.push([p0.x + vx * s, p0.y + vy * s + 0.5 * g * s * s]);
      }
      const done = u - tLeave > tauL + 1;
      if (done) return null;
      return (
        <g key={idx}>
          {idx === 0 && <Trail points={trail} dashed tone="soft" />}
          <Block x={x} y={y} w={sz[0]} h={sz[1]} angle={lerp(a / DEG, -20, ease(tau / tauL))} filled={idx === 0} />
          {idx === 0 && <Arrow x1={x} y1={y} x2={x} y2={y + mgPx} label="mg" />}
        </g>
      );
    }
    const s = Math.min(v * u, S);
    if (!fast && v * u > S + v * 0.4) return null;
    const p = surf(s);
    const nx = Math.sin(p.al);
    const ny = -Math.cos(p.al);
    const onArc = s > L0 && s < L0 + 2 * a * R;
    const nMg = onArc ? Math.cos(p.al) - (v * v) / (g * R) : Math.cos(p.al);
    return (
      <g key={idx}>
        <Block x={p.x + nx * hOff} y={p.y + ny * hOff} w={sz[0]} h={sz[1]} angle={-p.al / DEG} filled={idx === 0} />
        {idx === 0 && (
          <g>
            <Arrow x1={p.x + nx * hOff} y1={p.y + ny * hOff} x2={p.x + nx * hOff} y2={p.y + ny * hOff + mgPx} label="mg" />
            {nMg > 0.03 && <Arrow x1={p.x + nx * hOff} y1={p.y + ny * hOff} x2={p.x + nx * (hOff + mgPx * nMg)} y2={p.y + ny * (hOff + mgPx * nMg)} label="N" />}
          </g>
        )}
      </g>
    );
  };
  return (
    <Anim title="A car goes over a hump-backed bridge. Going slowly it follows the curve with the road still pushing up on it. Going faster than the square root of g times r it cannot follow the curve and leaves the road." height={H} loop={total}>
      {(t) => {
        const slowU = t - 0.3;
        const fastU = t - startB;
        const showSlow = pass === 'both';
        const slowActive = showSlow && slowU >= 0 && slowU < tA + 0.5;
        return (
          <g>
            <path className="fig-cliff" d={roadPath} />
            {showSlow && ge(vA, false, slowU, cars[0], 0)}
            {cars.map((cz, i) => ge(vB, true, fastU - (i * lag) / vB, cz, i))}
            {!compact && (
              <Label x={24} y={26} kind="val" anchor="start">
                {slowActive ? 'slow: v² = 0.3 g r, the road still pushes up' : fastU >= 0 ? 'fast: v² = 1.1 g r, contact lost' : ''}
              </Label>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

/** At the crest the speed is raised until the road's push reaches zero. */
export function Crest() {
  const vlim = Math.sqrt(9.8 * 10);
  const vTop = 14;
  return (
    <Anim title="A car at the top of a hump-backed bridge with radius 10 metres, speeding up. The upward push of the road shrinks as the speed rises and is zero at 9.9 metres per second; faster than that the car lifts off." height={270} loop={9}>
      {(t) => {
        const cx = 320;
        const R = 170;
        const top = 128;
        const cyArc = top + R;
        const v = vTop * phase(t, 0.5, 6.5);
        const nMg = Math.max(1 - (v * v) / (vlim * vlim), 0);
        const lift = v > vlim ? clamp((v - vlim) * 4, 0, 26) : 0;
        const pts: string[] = [];
        for (let i = 0; i <= 30; i++) {
          const al = -0.62 + (1.24 * i) / 30;
          pts.push(`L${cx + R * Math.sin(al)} ${cyArc - R * Math.cos(al)}`);
        }
        const d = `M${cx + R * Math.sin(-0.62)} ${cyArc - R * Math.cos(-0.62)}${pts.join('')}L${cx + R * Math.sin(0.62)} 262L${cx + R * Math.sin(-0.62)} 262Z`;
        const carY = top - 12 - lift;
        const barX0 = 120;
        const barX1 = 520;
        const barY = 252;
        return (
          <g>
            <path className="fig-cliff" d={d} />
            <Block x={cx} y={carY} w={46} h={24} filled />
            <Arrow x1={cx} y1={carY} x2={cx} y2={carY + 52} label="mg" />
            <Arrow x1={cx} y1={carY} x2={cx} y2={carY - 52 * nMg} label="N" />
            <Notes lines={[`v = ${v.toFixed(1)} m/s`, `N = ${nMg.toFixed(2)} mg`]} />
            <Label x={W - 20} y={24} kind="val" anchor="end">
              {v > vlim ? 'N = 0: contact lost' : 'still in contact'}
            </Label>
            <Line x1={barX0} y1={barY} x2={barX1} y2={barY} tone="faint" />
            <Line x1={barX0} y1={barY} x2={lerp(barX0, barX1, v / vTop)} y2={barY} tone="bright" />
            <Line x1={lerp(barX0, barX1, vlim / vTop)} y1={barY - 7} x2={lerp(barX0, barX1, vlim / vTop)} y2={barY + 7} tone="bright" />
            <Label x={lerp(barX0, barX1, vlim / vTop)} y={barY - 12} kind="val">
              √(g r) = 9.9
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------------------
// 10. Centrifugal force: the same event in two frames

export function RotatingFrames() {
  return (
    <Anim title="Left: seen from the ground, a ball held on a turning disc is released and moves in a straight line. Right: the same event seen from the disc, where the ball appears to be flung outward in a curve." height={290} loop={7}>
      {(t) => {
        const w = 1.6;
        const r0 = 55;
        const Rd = 100;
        const cy = 150;
        const t0 = 1.8;
        const rel = t >= t0;
        const th0 = w * t0;
        const tau = clamp(t - t0, 0, 1.5);
        const vt = w * r0;
        // Ground frame position (maths axes).
        const gp = (tt: number) => {
          if (tt < t0) return [r0 * Math.cos(w * tt), r0 * Math.sin(w * tt)] as const;
          const s = tt - t0;
          return [r0 * Math.cos(th0) - Math.sin(th0) * vt * s, r0 * Math.sin(th0) + Math.cos(th0) * vt * s] as const;
        };
        const rotp = (tt: number) => {
          const [x, y] = gp(tt);
          const c = Math.cos(-w * tt);
          const s = Math.sin(-w * tt);
          return [x * c - y * s, x * s + y * c] as const;
        };
        const panel = (cx: number, frame: 'ground' | 'disc') => {
          const pos = frame === 'ground' ? gp : rotp;
          const [x, y] = pos(t);
          const trail: [number, number][] = [];
          if (rel) for (let i = 0; i <= 24; i++) {
            const [qx, qy] = pos(t0 + (tau * i) / 24);
            trail.push([cx + qx, cy - qy]);
          }
          const spin = frame === 'ground' ? w * t : 0;
          const ux = -x / Math.hypot(x, y);
          const uy = -y / Math.hypot(x, y);
          return (
            <g>
              <circle className="kit-block" cx={cx} cy={cy} r={Rd} />
              {[0, 1, 2].map((k) => (
                <line key={k} className="fig-guide fig-faint" x1={cx - Rd * Math.cos(spin + (k * Math.PI) / 3)} y1={cy + Rd * Math.sin(spin + (k * Math.PI) / 3)} x2={cx + Rd * Math.cos(spin + (k * Math.PI) / 3)} y2={cy - Rd * Math.sin(spin + (k * Math.PI) / 3)} />
              ))}
              <circle className="fig-ball" cx={cx} cy={cy} r={3} />
              {rel && <Trail points={trail} />}
              {!rel && <Line x1={cx} y1={cy} x2={cx + x} y2={cy - y} />}
              <Ball x={cx + x} y={cy - y} />
              {!rel && <Arrow x1={cx + x} y1={cy - y} x2={cx + x + ux * 40} y2={cy - y - uy * 40} label="T" />}
              {frame === 'disc' && (
                <Arrow x1={cx + x} y1={cy - y} x2={cx + x - ux * 40} y2={cy - y + uy * 40} dashed tone="soft" />
              )}
            </g>
          );
        };
        return (
          <g>
            {panel(160, 'ground')}
            {panel(480, 'disc')}
            <Label x={160} y={24} kind="label">
              seen from the ground
            </Label>
            <Label x={480} y={24} kind="label">
              seen from the disc
            </Label>
            <Label x={160} y={278} kind="val">
              string cut: straight line
            </Label>
            <Label x={480} y={278} kind="val">
              pseudo-force m ω² r outward
            </Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------------------
// 11. The rotor

export function Rotor() {
  return (
    <Anim title="A rotor ride. Left: from above, the drum spins up and the wall pushes the rider toward the axis. Right: from the side, once the floor drops away, friction up balances the weight and the rider stays on the wall." height={280} loop={10}>
      {(t) => {
        const wMax = 3.4;
        const tt = Math.max(0, t - 0.4);
        const w = wMax * phase(t, 0.4, 3.2);
        const th = tt < 2.8 ? (wMax * tt * tt) / 5.6 : wMax * (tt - 1.4);
        const cx = 150;
        const cy = 140;
        const R = 88;
        const bx = cx + (R - 9) * Math.cos(th);
        const by = cy - (R - 9) * Math.sin(th);
        const Nk = (w / wMax) ** 2;
        const drop = 80 * ease(phase(t, 3.8, 4.7));
        const open = phase(t, 3.8, 4.7);
        const wx = 480;
        const py = 192;
        return (
          <g>
            <circle className="fig-path" cx={cx} cy={cy} r={R} fill="none" />
            <circle className="fig-guide fig-faint" cx={cx} cy={cy} r={3} />
            <Ball x={bx} y={by} r={6} />
            <Arrow x1={bx} y1={by} x2={bx + ((cx - bx) / (R - 9)) * 56 * Nk} y2={by + ((cy - by) / (R - 9)) * 56 * Nk} label="N" />
            <Label x={cx} y={cy + R + 30} kind="label">
              from above
            </Label>
            <Label x={wx - 40} y={cy + R + 30} kind="label">
              from the side
            </Label>
            <Wall x={wx} y1={40} y2={240} />
            <Line x1={wx - 150} y1={40} x2={wx - 150} y2={244} dashed tone="faint" />
            <Label x={wx - 150} y={34} kind="label">
              axis
            </Label>
            {open < 1 && <Line x1={wx - 110} y1={py + 25 + drop} x2={wx} y2={py + 25 + drop} tone="bright" />}
            <Block x={wx - 14} y={py} w={22} h={50} filled />
            <Arrow x1={wx - 25} y1={py - 6} x2={wx - 25 - 80 * Nk} y2={py - 6} label="N" />
            {open > 0.6 && (
              <g>
                <Arrow x1={wx - 14} y1={py} x2={wx - 14} y2={py - 46 * ease((open - 0.6) / 0.4)} label="f" />
                <Arrow x1={wx - 14} y1={py} x2={wx - 14} y2={py + 46 * ease((open - 0.6) / 0.4)} label="mg" />
              </g>
            )}
            <Readout x={W - 20} y={24}>
              ω = {w.toFixed(1)} rad/s
            </Readout>
          </g>
        );
      }}
    </Anim>
  );
}
function Wall({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  const marks = [];
  for (let y = y1 + 6; y < y2; y += 14) marks.push(<line key={y} className="fig-guide fig-faint" x1={x} y1={y} x2={x + 8} y2={y + 8} />);
  return (
    <g>
      <line className="fig-ground" x1={x} x2={x} y1={y1} y2={y2} />
      {marks}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Worked-example figures

/** Example 1: a ball on a string on a smooth table, seen from above. */
export function TopString() {
  const w = 1.5;
  return (
    <Anim title="A 0.2 kilogram ball goes round on a 0.5 metre string at 4 metres per second. The string tension of 6.4 newtons points to the centre." height={250} loop={TAU / w}>
      {(t) => {
        const cx = 410;
        const cy = 125;
        const R = 90;
        const a = w * t;
        const bx = cx + R * Math.cos(a);
        const by = cy - R * Math.sin(a);
        return (
          <g>
            <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={R} fill="none" />
            <circle className="fig-ball" cx={cx} cy={cy} r={3} />
            <Line x1={cx} y1={cy} x2={bx} y2={by} />
            <Ball x={bx} y={by} r={8} />
            <Arrow x1={bx} y1={by} x2={bx + ((cx - bx) / R) * 62} y2={by + ((cy - by) / R) * 62} label="T" />
            <Arrow x1={bx} y1={by} x2={bx - Math.sin(a) * 44} y2={by - Math.cos(a) * 44} dashed tone="soft" label="v" />
            <Notes lines={['m = 0.2 kg', 'r = 0.5 m', 'v = 4 m/s', 'T = m v² / r = 6.4 N']} x={24} y={60} />
          </g>
        );
      }}
    </Anim>
  );
}

/** Example 2: maximum speed against radius, with the 50 m bend marked. */
export function VmaxGraph() {
  return (
    <Anim title="Graph of the maximum safe speed against the radius of the bend for a dry road and a wet road. At 50 metres on a dry road it is 17.1 metres per second." height={270} loop={8}>
      {(t) => {
        const x0 = 90;
        const y0 = 232;
        const gw = 480;
        const gh = 180;
        const px = (r: number) => x0 + (r / 100) * gw;
        const py = (v: number) => y0 - (v / 25) * gh;
        const curve = (mu: number, p: number) => {
          const pts: [number, number][] = [];
          const n = 40;
          for (let i = 0; i <= Math.floor(n * p); i++) {
            const r = (100 * i) / n;
            pts.push([px(r), py(Math.sqrt(mu * 9.8 * r))]);
          }
          return pts;
        };
        const p = phase(t, 0.3, 3);
        const mark = ease(phase(t, 3.2, 4.2));
        return (
          <g>
            <Axes x={x0} y={y0} w={gw + 10} h={gh + 20} xLabel="r (m)" yLabel="v max (m/s)" />
            <Trail points={curve(0.6, p)} />
            <Trail points={curve(0.3, p)} tone="soft" />
            {p > 0.95 && (
              <g>
                <Label x={px(100) - 4} y={py(24.2) - 10} kind="val" anchor="end">
                  dry, μ = 0.6
                </Label>
                <Label x={px(100) - 4} y={py(17.1) - 10} kind="val" anchor="end">
                  wet, μ = 0.3
                </Label>
              </g>
            )}
            <Line x1={px(50)} y1={y0} x2={px(50)} y2={lerp(y0, py(17.146), mark)} dashed tone="soft" />
            <Line x1={x0} y1={py(17.146)} x2={lerp(x0, px(50), mark)} y2={py(17.146)} dashed tone="soft" />
            {mark > 0.95 && (
              <g>
                <Ball x={px(50)} y={py(17.146)} r={5} />
                <Label x={px(50) + 12} y={py(17.146) + 22} kind="val" anchor="start">
                  17.1 m/s
                </Label>
                <Label x={px(50)} y={y0 + 18} kind="val">
                  50
                </Label>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ---------------------------------------------------------------------------
// Common-mistake figures

/** The same pull drawn twice. */
export function DoubleCount() {
  return (
    <Anim title="A ball on a string with the string tension drawn once; a second, dashed arrow for a centripetal force would count the same pull twice." height={170} loop={TAU / 1.4}>
      {(t) => {
        const cx = 320;
        const cy = 85;
        const R = 52;
        const a = 1.4 * t;
        const bx = cx + R * Math.cos(a);
        const by = cy - R * Math.sin(a);
        const ux = (cx - bx) / R;
        const uy = (cy - by) / R;
        const show = ease(phase(t, 1.4, 2.2));
        return (
          <g>
            <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={R} fill="none" />
            <Line x1={cx} y1={cy} x2={bx} y2={by} />
            <circle className="fig-ball" cx={cx} cy={cy} r={3} />
            <Ball x={bx} y={by} />
            <Arrow x1={bx} y1={by} x2={bx + ux * 40} y2={by + uy * 40} label="T" />
            <g opacity={show}>
              <Arrow x1={bx - uy * 10} y1={by + ux * 10} x2={bx - uy * 10 + ux * 40} y2={by + ux * 10 + uy * 40} dashed tone="soft" />
              <Label x={500} y={cy - 6} kind="val" anchor="start">
                + F  ?
              </Label>
              <Label x={500} y={cy + 14} kind="val" anchor="start">
                same pull twice
              </Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

/** Friction on a turning car points to the centre, not backwards. */
export function FrictionInward() {
  return (
    <Anim title="A car going round a bend at a steady speed. Friction from the road points to the centre, not backwards against the motion." height={170} loop={TAU / 1.3}>
      {(t) => {
        const cx = 320;
        const cy = 88;
        const R = 54;
        const a = 1.3 * t;
        const bx = cx + R * Math.cos(a);
        const by = cy - R * Math.sin(a);
        const ux = (cx - bx) / R;
        const uy = (cy - by) / R;
        const dx = -Math.sin(a);
        const dy = -Math.cos(a);
        const show = ease(phase(t, 1.2, 2));
        return (
          <g>
            <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={R} fill="none" />
            <circle className="fig-ball" cx={cx} cy={cy} r={3} />
            <Block x={bx} y={by} w={30} h={16} angle={a / DEG + 90} filled />
            <Arrow x1={bx} y1={by} x2={bx + ux * 40} y2={by + uy * 40} label="f" />
            <g opacity={show}>
              <Arrow x1={bx} y1={by} x2={bx - dx * 36} y2={by - dy * 36} dashed tone="soft" />
              <Label x={460} y={cy} kind="val" anchor="start">
                ✕ not backwards
              </Label>
            </g>
          </g>
        );
      }}
    </Anim>
  );
}

/** On a banked road the normal force is bigger than the weight. */
export function NormalBigger() {
  return <Bank mode="tune" small />;
}

/** At the top of a vertical circle T and mg both point down and add up to m v² / r. */
export function TopStack() {
  return (
    <Anim title="A ball at the top of a vertical circle. The tension and the weight both point toward the centre and together make up m v squared over r." height={190} loop={6}>
      {(t) => {
        const cx = 320;
        const cy = 112;
        const R = 62;
        const s1 = ease(phase(t, 0.5, 1.3));
        const s2 = ease(phase(t, 1.8, 2.6));
        const s3 = ease(phase(t, 3.2, 4));
        const bx = cx;
        const by = cy - R;
        return (
          <g>
            <circle className="fig-guide fig-dash fig-faint" cx={cx} cy={cy} r={R} fill="none" />
            <circle className="fig-ball" cx={cx} cy={cy} r={3} />
            <Line x1={cx} y1={cy} x2={bx} y2={by} />
            <Ball x={bx} y={by} />
            <Arrow x1={bx - 12} y1={by} x2={bx - 12} y2={by + 20 * s1} />
            <Label x={bx - 24} y={by + 14} kind="sym" anchor="end">
              mg
            </Label>
            <Arrow x1={bx - 12} y1={by + 20 * s1} x2={bx - 12} y2={by + 20 * s1 + 30 * s2} />
            <Label x={bx - 24} y={by + 20 + 22} kind="sym" anchor="end">
              T
            </Label>
            {s3 > 0.02 && <Arrow x1={bx + 14} y1={by} x2={bx + 14} y2={by + 50 * s3} dashed tone="soft" />}
            {s3 > 0.5 && (
              <Label x={bx + 26} y={by + 30} kind="sym" anchor="start">
                m v² / r
              </Label>
            )}
          </g>
        );
      }}
    </Anim>
  );
}
