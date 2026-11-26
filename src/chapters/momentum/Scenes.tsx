import { Anim, Arrow, Axes, Ball, Block, DEG, Ground, Label, Line, Readout, Trail, W, Wall, clamp, phase } from '../kit/Anim';

/** Animated diagrams for the momentum chapter. Positions come from the real physics. */

const f = (x: number, d = 2) => {
  const s = (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d);
  return s.replace('-', '−');
};
const sg = (x: number, d = 1) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(d);
const cartW = (m: number) => 34 + 14 * Math.sqrt(m);

function Cart({ x, y, m, label }: { x: number; y: number; m: number; label?: string }) {
  const w = cartW(m);
  return (
    <g>
      <Block x={x} y={y} w={w} h={34} label={label ?? `${m} kg`} />
      <circle className="fig-ball" cx={x - w / 3} cy={y + 20} r={4} />
      <circle className="fig-ball" cx={x + w / 3} cy={y + 20} r={4} />
    </g>
  );
}

/** A stacked bar of momenta from an origin, with a bracket showing the total. */
function PBar({ segs, x0, y, ps }: { segs: number[]; x0: number; y: number; ps: number }) {
  let acc = 0;
  const rects = segs.map((s, i) => {
    const a = acc;
    acc += s;
    const xa = x0 + Math.min(a, acc) * ps;
    return Math.abs(s * ps) < 0.5 ? null : <rect key={i} className={i % 2 ? 'kit-block' : 'kit-block is-filled'} x={xa} y={y} width={Math.abs(s * ps)} height={14} />;
  });
  const tx = x0 + acc * ps;
  return (
    <g>
      <line className="fig-guide fig-faint" x1={x0} y1={y - 6} x2={x0} y2={y + 28} />
      {rects}
      <Line x1={x0} y1={y + 24} x2={tx} y2={y + 24} tone="bright" />
      <Line x1={tx} y1={y + 18} x2={tx} y2={y + 30} tone="bright" />
    </g>
  );
}

// ------------------------------------------------------------------ 1. momentum of two carts

export function MomentumCarts() {
  const S = 50;
  const lanes = [
    { m: 1, v: 3, cy: 92 },
    { m: 3, v: 1, cy: 188 },
  ];
  return (
    <Anim title="A light fast cart and a heavy slow cart have the same momentum" height={230} loop={4}>
      {(t) => (
        <g>
          {lanes.map(({ m, v, cy }) => {
            const x = 80 + v * S * t * 0.95;
            return (
              <g key={m}>
                <Ground y={cy + 24} />
                <Cart x={x} y={cy} m={m} />
                <Arrow x1={x} y1={cy - 36} x2={x + m * v * 25} y2={cy - 36} />
                <Label x={16} y={cy - 54} kind="val" anchor="start">{`${m} kg at ${v} m/s:  p = ${m * v} kg·m/s`}</Label>
              </g>
            );
          })}
        </g>
      )}
    </Anim>
  );
}

// ------------------------------------------------------------------ 2. impulse and the force-time graph

const FM = 40;
const TP = 0.05;
const pulse = (tau: number) => (tau <= 0 || tau >= TP ? 0 : FM * Math.sin((Math.PI * tau) / TP) ** 2);
const impulse = (tau: number) => {
  const q = clamp(tau, 0, TP);
  return FM * (q / 2 - (TP / (4 * Math.PI)) * Math.sin((2 * Math.PI * q) / TP));
};

export function ImpulseScene() {
  const m = 2;
  const jmax = (FM * TP) / 2;
  const gx = 120;
  const gw = 300;
  const gy = 248;
  const gh = 100;
  const tauOf = (t: number) => clamp((t - 0.5) / 1.6) * TP;
  return (
    <Anim title="A force acts for a short time; the area under the force-time graph is the impulse, and the cart's momentum grows by that much" height={290} loop={4.6}>
      {(t) => {
        const tau = tauOf(t);
        let x = 100;
        for (let s = 0; s < t; s += 1 / 30) x += (130 * impulse(tauOf(s))) / jmax / 30;
        const J = impulse(tau);
        const px = (q: number) => gx + (q / TP) * gw;
        const py = (F: number) => gy - (F / FM) * gh;
        const pts: [number, number][] = [];
        for (let i = 0; i <= 40; i++) pts.push([px((i / 40) * TP), py(pulse((i / 40) * TP))]);
        const area: [number, number][] = [];
        for (let i = 0; i <= 40; i++) if ((i / 40) * TP <= tau) area.push([px((i / 40) * TP), py(pulse((i / 40) * TP))]);
        const fl = (pulse(tau) / FM) * 60;
        return (
          <g>
            <Ground y={112} />
            <Cart x={x} y={88} m={m} />
            {fl > 3 && <Arrow x1={x - cartW(m) / 2 - fl} y1={88} x2={x - cartW(m) / 2} y2={88} />}
            <Axes x={gx - 20} y={gy} w={gw + 60} h={gh + 14} xLabel="t" yLabel="F" />
            {area.length > 1 && <path className="fig-cliff" d={`M${area[0][0]} ${gy}` + area.map(([a, b]) => `L${a} ${b}`).join('') + `L${area[area.length - 1][0]} ${gy}Z`} />}
            <Trail points={pts} tone="soft" />
            <Ball x={px(tau)} y={py(pulse(tau))} r={4} glow={false} />
            <Readout y={152}>{`J = area = ${f(J)} N·s`}</Readout>
            <Readout y={172}>{`p = m·v = ${f(J)} kg·m/s`}</Readout>
            <Label x={16} y={26} kind="val" anchor="start">{`cart 2 kg, force up to 40 N for 0.05 s`}</Label>
            <Label x={16} y={42} kind="val" anchor="start">{`v = ${f(J / m)} m/s`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

/** Two pulses with the same area: a hard stop and a soft one. */
export function EqualAreas({ height = 240 }: { height?: number }) {
  const gy = height - 40;
  return (
    <Anim title="A short sharp force and a long gentle force can have the same area, so the same impulse" height={height} loop={4}>
      {(t) => {
        const p = phase(t, 0.3, 2.3);
        const draw = (cx: number, w: number, h: number, name: string) => {
          const pts: [number, number][] = [];
          const fill: [number, number][] = [];
          for (let i = 0; i <= 40; i++) {
            const q = i / 40;
            const pt: [number, number] = [cx - w / 2 + q * w, gy - h * Math.sin(Math.PI * q) ** 2];
            pts.push(pt);
            if (q <= p) fill.push(pt);
          }
          return (
            <g>
              {fill.length > 1 && <path className="fig-cliff" d={`M${fill[0][0]} ${gy}` + fill.map(([a, b]) => `L${a} ${b}`).join('') + `L${fill[fill.length - 1][0]} ${gy}Z`} />}
              <Trail points={pts} tone="soft" />
              <Label x={cx} y={gy + 24} kind="label">{name}</Label>
            </g>
          );
        };
        return (
          <g>
            <Axes x={40} y={gy} w={560} h={gy - 40} xLabel="t" yLabel="F" />
            {draw(180, 90, gy - 50, 'hard floor: big F, short time')}
            {draw(440, 260, (gy - 50) * 0.35, 'cushion: small F, long time')}
            <Readout y={gy - 150 > 20 ? 22 : 22}>same area = same impulse</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 3-4. two carts colliding

export function Collide({ title, m1, u1, m2, u2, e, showKE, height }: { title: string; m1: number; u1: number; m2: number; u2: number; e: number; showKE?: boolean; height?: number }) {
  const M = m1 + m2;
  const P = m1 * u1 + m2 * u2;
  const r = u1 - u2;
  const v1 = (P - m2 * e * r) / M;
  const v2 = (P + m1 * e * r) / M;
  const w1 = cartW(m1);
  const w2 = cartW(m2);
  const tc = 1.4;
  const tp = 1.8;
  const X = 320;
  const vmax = Math.max(Math.abs(u1), Math.abs(u2), Math.abs(v1), Math.abs(v2));
  const S = Math.min(45, 200 / (vmax * tp));
  const pmax = Math.max(Math.abs(m1 * u1), Math.abs(m2 * u2), Math.abs(m1 * v1), Math.abs(m2 * v2), Math.abs(P));
  const ps = 100 / pmax;
  const ke0 = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
  const ke1 = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  const cy = 126;
  return (
    <Anim title={title} height={height ?? (showKE ? 290 : 240)} loop={4.4}>
      {(t) => {
        const after = t >= tc;
        const dt = after ? clamp(t - tc, 0, tp) : t - tc;
        const a1 = after ? v1 : u1;
        const a2 = after ? v2 : u2;
        const x1 = X - w1 / 2 + a1 * S * dt;
        const x2 = X + w2 / 2 + a2 * S * dt;
        const p1 = m1 * a1;
        const p2 = m2 * a2;
        const flash = phase(t, tc, tc + 0.35);
        const ke = after ? ke1 : ke0;
        const ks = 250 / ke0;
        return (
          <g>
            <Ground y={cy + 24} />
            <Cart x={x1} y={cy} m={m1} />
            <Cart x={x2} y={cy} m={m2} />
            <Arrow x1={x1} y1={72} x2={x1 + p1 * ps} y2={72} />
            <Arrow x1={x2} y1={72} x2={x2 + p2 * ps} y2={72} />
            <Label x={16} y={26} kind="label" anchor="start">arrow = momentum m · v of each cart</Label>
            {flash > 0 && flash < 1 && <circle className="fig-guide" cx={X} cy={cy} r={8 + 26 * flash} opacity={1 - flash} />}
            <Label x={320} y={172} kind="val">{`p₁ = ${f(p1)}     p₂ = ${f(p2)}`}</Label>
            <Label x={16} y={202} kind="label" anchor="start">total p</Label>
            <PBar segs={[p1, p2]} x0={230} y={188} ps={ps} />
            <Label x={624} y={202} kind="val" anchor="end">{`Σp = ${f(P)} kg·m/s`}</Label>
            {showKE && (
              <g>
                <Label x={16} y={258} kind="label" anchor="start">KE</Label>
                <rect className="fig-guide fig-dash" x={80} y={244} width={ke0 * ks} height={14} />
                <rect className="kit-block is-filled" x={80} y={244} width={Math.max(0.5, ke * ks)} height={14} />
                <Label x={624} y={258} kind="val" anchor="end">{`KE = ${f(ke)} J${after && ke0 - ke1 > 0.005 ? `   (lost ${f(ke0 - ke1)} J)` : ''}`}</Label>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 5. recoil

export function Recoil({ title, kind, mL, mR, vR, slow = 1, labelL, labelR, height = 250 }: { title: string; kind: 'skaters' | 'gun' | 'blast'; mL: number; mR: number; vR: number; slow?: number; labelL: string; labelR: string; height?: number }) {
  const vL = (mR * vR) / mL;
  const dL = vL;
  const dR = vR / slow;
  const t0 = 0.9;
  const d = 0.3;
  const S = Math.min(40, 200 / (Math.max(dL, dR) * 2.2));
  const wL = kind === 'gun' ? 96 : cartW(mL) + (kind === 'skaters' ? 4 : 0);
  const wR = kind === 'gun' ? 12 : cartW(mR) + (kind === 'skaters' ? 4 : 0);
  const cy = 120;
  const pm = mR * vR;
  const ps = 100 / pm;
  const sh = (tau: number, v: number) => (tau < d ? (v * tau * tau) / (2 * d) : (v * d) / 2 + v * (tau - d));
  return (
    <Anim title={title} height={height} loop={4.6}>
      {(t) => {
        const tau = clamp(t - t0, 0, 2.2);
        const ramp = clamp((t - t0) / d);
        const xL = 320 - wL / 2 - S * sh(tau, dL);
        const xR = 320 + wR / 2 + S * sh(tau, dR);
        const pL = mL * vL * ramp;
        const pR = mR * vR * ramp;
        const push = t >= t0 && t < t0 + d + 0.35;
        return (
          <g>
            <Ground y={cy + 24} />
            {kind === 'gun' ? (
              <g>
                <Block x={xL} y={cy} w={wL} h={34} label={labelL} />
                <rect className="kit-block is-filled" x={xL + wL / 2} y={cy - 14} width={34} height={6} />
                <circle className="fig-ball" cx={xL - wL / 4} cy={cy + 20} r={4} />
                <circle className="fig-ball" cx={xL + wL / 4} cy={cy + 20} r={4} />
                <Ball x={xR + (xR > 320 + wR / 2 + 1 ? 0 : 0) + 17} y={cy - 11} r={5} />
              </g>
            ) : (
              <g>
                <Cart x={xL} y={cy} m={mL} label={labelL} />
                <Cart x={xR} y={cy} m={mR} label={labelR} />
              </g>
            )}
            {push && t < t0 + d + 0.35 && kind !== 'gun' && <circle className="fig-guide" cx={320} cy={cy} r={6 + 22 * phase(t, t0, t0 + d + 0.35)} opacity={1 - phase(t, t0, t0 + d + 0.35)} />}
            {t >= t0 && t < t0 + d + 0.25 && (
              <g>
                <Arrow x1={xL} y1={cy - 34 + 0} x2={xL - 46} y2={cy - 34} label="−F" />
                <Arrow x1={kind === 'gun' ? xR + 17 : xR} y1={cy - 34} x2={(kind === 'gun' ? xR + 17 : xR) + 46} y2={cy - 34} label="F" />
              </g>
            )}
            {t >= t0 + d + 0.25 && (
              <g>
                <Arrow x1={xL} y1={cy - 50} x2={xL - pL * ps} y2={cy - 50} />
                <Arrow x1={kind === 'gun' ? xR + 17 : xR} y1={cy - 50} x2={(kind === 'gun' ? xR + 17 : xR) + pR * ps} y2={cy - 50} />
              </g>
            )}
            <Label x={16} y={26} kind="val" anchor="start">{`${labelL}: ${f(mL, mL < 1 ? 2 : 0)} kg   ${kind === 'gun' ? 'bullet' : labelR}: ${f(mR, mR < 1 ? 2 : 0)} kg`}</Label>
            <Label x={320} y={cy + 56} kind="val">{`p₁ = ${sg(-pL, 0 + (pm < 20 ? 1 : 0))}   p₂ = ${sg(pR, 0 + (pm < 20 ? 1 : 0))}   kg·m/s`}</Label>
            <Label x={16} y={cy + 96} kind="label" anchor="start">total p</Label>
            <PBar segs={[-pL, pR]} x0={320} y={cy + 82} ps={ps * 0.9} />
            <Label x={624} y={cy + 96} kind="val" anchor="end">Σp = 0 always</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 5b. rocket

export function Rocket() {
  const a = 36;
  const U = 150;
  const xr = (t: number) => (a * t * t) / 2;
  return (
    <Anim title="A rocket throws exhaust backwards and gains forward momentum" height={230} loop={4.5} stillAt={3}>
      {(t) => {
        const vr = a * t;
        const ticks = [];
        for (let k = -2; k < 14; k++) {
          const x = ((k * 60 - xr(t)) % 840 + 840) % 840 - 100;
          ticks.push(<line key={k} className="fig-guide fig-faint" x1={x} y1={190} x2={x} y2={202} />);
        }
        const bits = [];
        for (let k = 0; k * 0.09 < t; k++) {
          const te = k * 0.09;
          const age = t - te;
          if (age > 1.8) continue;
          const xw = xr(te) - 38 + (a * te - U) * age;
          bits.push(<circle key={k} className="fig-ball" cx={360 + xw - xr(t)} cy={118 + ((k * 7) % 5) - 2} r={2.6} opacity={1 - age / 1.8} />);
        }
        return (
          <g>
            <line className="fig-ground" x1={0} x2={W} y1={190} y2={190} />
            {ticks}
            <Block x={360} y={118} w={76} h={26} label="rocket" />
            <path className="kit-block" d="M398 105L420 118L398 131Z" />
            {bits}
            <Arrow x1={360} y1={64} x2={360 + vr * 0.55} y2={64} />
            <Arrow x1={300} y1={160} x2={300 - vr * 0.55} y2={160} />
            <Label x={16} y={26} kind="label" anchor="start">momentum of the rocket (above) and of its exhaust (below)</Label>
            <Label x={16} y={222} kind="val" anchor="start">equal and opposite, so the total stays zero</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 6. explosion

export function Shell() {
  const S = 30;
  const tc = 1.3;
  const v = 2;
  const ma = 1;
  const mb = 2;
  const va = -1;
  const vb = 3.5;
  const x0 = 80;
  const cy = 118;
  const ps = 11;
  return (
    <Anim title="A shell flying at 2 metres per second bursts into two pieces, and their centre of mass carries on as if nothing happened" height={250} loop={4.6}>
      {(t) => {
        const tau = clamp(t - tc, 0, 2.2);
        const com = x0 + v * S * Math.min(t, tc + 2.2);
        const after = t >= tc;
        const xs = x0 + v * S * t;
        const xa = com - 8 + va * S * tau;
        const xb = com + 10 + vb * S * tau;
        const fl = phase(t, tc, tc + 0.4);
        return (
          <g>
            <Ground y={cy + 22} />
            {!after ? <Block x={xs} y={cy} w={46} h={30} label="3 kg" filled={false} /> : (
              <g>
                <Block x={xa} y={cy} w={32} h={26} label="1 kg" />
                <Block x={xb} y={cy} w={42} h={30} label="2 kg" />
              </g>
            )}
            {fl > 0 && fl < 1 && <circle className="fig-guide" cx={x0 + v * S * tc} cy={cy} r={10 + 40 * fl} opacity={1 - fl} />}
            <circle className="fig-guide" cx={com} cy={cy + 38} r={5} />
            <Label x={com} y={cy + 62} kind="label">centre of mass</Label>
            {!after ? (
              <Arrow x1={xs} y1={64} x2={xs + 3 * v * ps} y2={64} />
            ) : (
              <g>
                <Arrow x1={xa} y1={64} x2={xa + ma * va * ps} y2={64} />
                <Arrow x1={xb} y1={64} x2={xb + mb * vb * ps} y2={64} />
              </g>
            )}
            <Label x={16} y={26} kind="label" anchor="start">arrow = momentum</Label>
            <Label x={16} y={226} kind="label" anchor="start">total p</Label>
            <PBar segs={after ? [ma * va, mb * vb] : [3 * v]} x0={200} y={212} ps={ps * 0.8} />
            <Label x={624} y={226} kind="val" anchor="end">{after ? 'Σp = −1 + 7 = 6 kg·m/s' : 'Σp = 3 · 2 = 6 kg·m/s'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 7. Newton's cradle

export function Cradle({ n }: { n: number }) {
  const A = 36;
  const L = 150;
  const r = 15;
  return (
    <Anim title={`Newton's cradle: ${n} ball${n > 1 ? 's' : ''} swing in, ${n} swing${n > 1 ? '' : 's'} out`} height={230} loop={4}>
      {(t) => {
        const q = t % 4;
        let left = 0;
        let right = 0;
        if (q < 1) left = -A * Math.cos((Math.PI / 2) * q);
        else if (q < 2) right = A * Math.sin((Math.PI / 2) * (q - 1));
        else if (q < 3) right = A * Math.cos((Math.PI / 2) * (q - 2));
        else left = -A * Math.sin((Math.PI / 2) * (q - 3));
        return (
          <g>
            <line className="fig-ground" x1={190} x2={450} y1={34} y2={34} />
            {[0, 1, 2, 3, 4].map((i) => {
              const th = (i < n ? left : i >= 5 - n ? right : 0) * DEG;
              const px = 320 + (i - 2) * 2 * r;
              const bx = px + L * Math.sin(th);
              const by = 34 + L * Math.cos(th);
              return (
                <g key={i}>
                  <Line x1={px} y1={34} x2={bx} y2={by} />
                  <Ball x={bx} y={by} r={r} glow={false} />
                </g>
              );
            })}
            <Label x={16} y={26} kind="label" anchor="start">{`${n} in, ${n} out`}</Label>
            <Label x={624} y={218} kind="val" anchor="end">{`${q < 1 || (q >= 3) ? 'left' : 'right'} balls moving`}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 9. a bouncing ball

export function Bounce({ e, h = 2, showWrong, height = 270, title }: { e: number; h?: number; showWrong?: boolean; height?: number; title: string }) {
  const H0 = height - 110;
  const gy = height - 26;
  const tf = 1;
  const g = (2 * H0) / (tf * tf);
  const impact = (k: number) => tf * (1 + (2 * (e - e ** (k + 1))) / (1 - e));
  const loopT = e > 0.7 ? 8 : 5;
  return (
    <Anim title={title} height={height} loop={loopT}>
      {(t) => {
        let y = H0;
        let k = -1;
        let tt = t;
        if (t >= tf) {
          k = 0;
          while (k < 30 && t >= impact(k + 1)) k++;
          tt = t - impact(k);
          const v0 = g * tf * e ** (k + 1);
          y = Math.max(0, v0 * tt - 0.5 * g * tt * tt);
        } else y = H0 - 0.5 * g * t * t;
        const x = 60 + 70 * Math.min(t, loopT * 0.9);
        const pts: [number, number][] = [];
        for (let s = 0; s < t; s += 0.04) {
          let yy = H0;
          if (s < tf) yy = H0 - 0.5 * g * s * s;
          else {
            let kk = 0;
            while (kk < 30 && s >= impact(kk + 1)) kk++;
            const q = s - impact(kk);
            yy = Math.max(0, g * tf * e ** (kk + 1) * q - 0.5 * g * q * q);
          }
          pts.push([60 + 70 * Math.min(s, loopT * 0.9), gy - 8 - yy]);
        }
        const marks = [];
        for (let j = 0; j < 3; j++) {
          const peakT = impact(j) + tf * e ** (j + 1);
          if (t < peakT) continue;
          const hj = H0 * e ** (2 * (j + 1));
          const px = 60 + 70 * Math.min(peakT, loopT * 0.9);
          marks.push(
            <g key={j}>
              <Line x1={px - 22} y1={gy - 8 - hj} x2={px + 22} y2={gy - 8 - hj} dashed tone="soft" />
              <Label x={px + 28} y={gy - 4 - hj} kind="val" anchor="start">{`${f(h * e ** (2 * (j + 1)), 2)} m`}</Label>
            </g>,
          );
        }
        return (
          <g>
            <Ground y={gy} />
            <Line x1={30} y1={gy - 8} x2={30} y2={gy - 8 - H0} dashed tone="soft" />
            <Label x={40} y={gy - 8 - H0 + 6} kind="val" anchor="start">{`h = ${h} m`}</Label>
            {showWrong && (
              <g>
                <Line x1={30} y1={gy - 8 - H0 * e} x2={620} y2={gy - 8 - H0 * e} dashed tone="faint" />
                <Label x={620} y={gy - 12 - H0 * e} kind="val" anchor="end">wrong: h · e</Label>
              </g>
            )}
            <Trail points={pts} tone="soft" />
            {marks}
            <Ball x={x} y={gy - 8 - y} r={8} />
            <Readout>{`e = ${e}`}</Readout>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 10. 2D billiards

export function Billiard() {
  const r = 16;
  const S = 32;
  const v = 5;
  const B = { x: 300, y: 172 };
  const dB = { x: Math.cos(60 * DEG), y: Math.sin(60 * DEG) };
  const contact = { x: B.x - 2 * r * dB.x, y: B.y - 2 * r * dB.y };
  const tc = 1.2;
  const vA = v * Math.cos(30 * DEG);
  const vBs = v * Math.cos(60 * DEG);
  const O = { x: 440, y: 262 };
  const pp = 18;
  return (
    <Anim title="One billiard ball hits an identical one at rest: afterwards they leave at exactly 90 degrees to each other" height={300} loop={4.6}>
      {(t) => {
        const tau = clamp(t - tc, 0, 1.5);
        const after = t >= tc;
        const A = after ? { x: contact.x + vA * S * Math.cos(30 * DEG) * tau, y: contact.y - vA * S * Math.sin(30 * DEG) * tau } : { x: contact.x + v * S * (t - tc), y: contact.y };
        const Bp = after ? { x: B.x + vBs * S * dB.x * tau, y: B.y + vBs * S * dB.y * tau } : B;
        const show = phase(t, tc + 0.25, tc + 0.9);
        const tipA = { x: O.x + vA * pp * Math.cos(30 * DEG), y: O.y - vA * pp * Math.sin(30 * DEG) };
        const endP = { x: O.x + v * pp, y: O.y };
        const sq = 9;
        return (
          <g>
            {after && <Ball x={contact.x} y={contact.y} r={r} ghost />}
            {!after && <Line x1={30} y1={contact.y} x2={contact.x} y2={contact.y} dashed tone="faint" />}
            <Ball x={Bp.x} y={Bp.y} r={r} glow={false} />
            <Ball x={A.x} y={A.y} r={r} />
            {!after ? (
              <Arrow x1={A.x + r + 4} y1={A.y} x2={A.x + r + 4 + v * 14} y2={A.y} />
            ) : (
              <g>
                <Arrow x1={A.x + (r + 4) * Math.cos(30 * DEG)} y1={A.y - (r + 4) * Math.sin(30 * DEG)} x2={A.x + (r + 4) * Math.cos(30 * DEG) + vA * 14 * Math.cos(30 * DEG)} y2={A.y - (r + 4) * Math.sin(30 * DEG) - vA * 14 * Math.sin(30 * DEG)} />
                <Arrow x1={Bp.x + (r + 4) * dB.x} y1={Bp.y + (r + 4) * dB.y} x2={Bp.x + (r + 4 + vBs * 14) * dB.x} y2={Bp.y + (r + 4 + vBs * 14) * dB.y} />
              </g>
            )}
            <Label x={16} y={26} kind="label" anchor="start">equal masses, elastic, one at rest</Label>
            {show > 0 && (
              <g opacity={show}>
                <Arrow x1={O.x} y1={O.y} x2={endP.x} y2={endP.y} dashed tone="soft" />
                <Arrow x1={O.x} y1={O.y} x2={tipA.x} y2={tipA.y} />
                <Arrow x1={tipA.x} y1={tipA.y} x2={endP.x} y2={endP.y} />
                <path className="fig-guide" fill="none" d={`M${tipA.x - sq * Math.cos(30 * DEG)} ${tipA.y + sq * Math.sin(30 * DEG)}L${tipA.x - sq * Math.cos(30 * DEG) + sq * Math.cos(60 * DEG)} ${tipA.y + sq * Math.sin(30 * DEG) + sq * Math.sin(60 * DEG)}L${tipA.x + sq * Math.cos(60 * DEG)} ${tipA.y + sq * Math.sin(60 * DEG)}`} />
                <Label x={O.x + 48} y={O.y + 22} kind="sym">p</Label>
                <Label x={O.x + 22} y={O.y - 32} kind="sym">p₁</Label>
                <Label x={endP.x + 8} y={O.y - 26} kind="sym" anchor="start">p₂</Label>
                <Label x={tipA.x + 18} y={tipA.y - 10} kind="val" anchor="start">90°</Label>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ 11. the ballistic pendulum

export function Pendulum({ height = 270, title }: { height?: number; title: string }) {
  const L = 170;
  const hm = 0.05;
  const thMax = Math.acos(1 - hm / 1) ;
  const w = Math.sqrt(9.8 / 1);
  const px = 320;
  const py = 30;
  const tc = 1;
  return (
    <Anim title={title} height={height} loop={5}>
      {(t) => {
        const tau = Math.max(0, t - tc);
        const th = thMax * Math.sin(w * tau);
        const bx = px + L * Math.sin(th);
        const by = py + L * Math.cos(th);
        const tx = px + (L - 15) * Math.sin(th);
        const ty = py + (L - 15) * Math.cos(th);
        const hpx = L * (1 - Math.cos(thMax));
        const swing = t >= tc + 0.5;
        const top = phase(tau, 0.45, 0.55);
        return (
          <g>
            <Line x1={px - 40} y1={py} x2={px + 40} y2={py} tone="bright" />
            <Line x1={px} y1={py} x2={tx} y2={ty} />
            <Block x={bx} y={by} w={64} h={30} angle={-th / DEG} label={t >= tc ? 'M + m' : 'M'} />
            {t < tc && <Ball x={40 + (px - 22 - 40 - 5) * Math.min(1, t / tc)} y={py + L} r={4.5} glow={false} />}
            {t < tc && <Arrow x1={60 + (px - 22 - 60) * Math.min(1, t / tc)} y1={py + L - 24} x2={110 + (px - 22 - 110) * Math.min(1, t / tc)} y2={py + L - 24} label="v" />}
            {t >= tc && t < tc + 0.5 && <Arrow x1={bx} y1={by - 28} x2={bx + 36} y2={by - 28} label="V" />}
            {tau > 0.4 && tau < 1.6 && (
              <g opacity={top}>
                <Line x1={px + 60} y1={py + L} x2={px + 110} y2={py + L} dashed tone="soft" />
                <Line x1={px + 60} y1={py + L - hpx - 0} x2={px + 110} y2={py + L - hpx} dashed tone="soft" />
                <Label x={px + 118} y={py + L - hpx / 2 + 2} kind="val" anchor="start">h = 5 cm</Label>
              </g>
            )}
            <Label x={16} y={height - 14} kind="label" anchor="start">{swing ? '2   swing up: kinetic energy becomes potential energy' : '1   bullet embeds: momentum is conserved (energy is not)'}</Label>
          </g>
        );
      }}
    </Anim>
  );
}

// ------------------------------------------------------------------ mistake 3: bounce off a wall

export function WallBounce() {
  const S = 60;
  const cy = 90;
  const X = 540;
  const tc = 1.4;
  return (
    <Anim title="A ball bounces off a wall: its momentum reverses, so it changes by twice m times v" height={190} loop={4}>
      {(t) => {
        const dt = t - tc;
        const out = dt >= 0;
        const x = X - 10 - (out ? -1 : 1) * 0 + (out ? -S * Math.min(dt, 1.6) : S * dt);
        const ps = 18;
        const p = out ? -4 : 4;
        const dp = phase(t, tc + 0.2, tc + 0.7);
        return (
          <g>
            <Wall x={X} y1={30} y2={140} side={1} />
            <Ground y={cy + 20} x2={X} hatch={false} />
            <Ball x={x} y={cy} r={9} />
            <Arrow x1={x} y1={cy - 28} x2={x + p * ps} y2={cy - 28} />
            <Label x={16} y={26} kind="val" anchor="start">{`ball 1 kg:  p = ${out ? '−4' : '+4'} kg·m/s`}</Label>
            {dp > 0 && (
              <g opacity={dp}>
                <Arrow x1={380} y1={cy + 44} x2={380 - 8 * ps * dp} y2={cy + 44} />
                <Label x={16} y={cy + 49} kind="val" anchor="start">{`Δp = −4 − (+4) = −8`}</Label>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}


// ------------------------------------------------------------------ example 6: sticking in two dimensions

export function Stick2D() {
  const S = 24;
  const tc = 1.4;
  const O = { x: 300, y: 150 };
  const pk = 12;
  const v = { x: 2, y: 4 / 3 };
  return (
    <Anim title="A 2 kilogram ball going east and a 1 kilogram ball going north collide and stick; they leave north of east" height={300} loop={4.6}>
      {(t) => {
        const after = t >= tc;
        const tau = clamp(t - tc, 0, 1.8);
        const A = after ? { x: O.x + v.x * S * tau, y: O.y - v.y * S * tau } : { x: O.x + 3 * S * (t - tc), y: O.y };
        const B = { x: O.x, y: O.y - 4 * S * (t - tc) };
        const show = phase(t, tc + 0.2, tc + 0.8);
        return (
          <g>
            {!after && <Line x1={30} y1={O.y} x2={O.x} y2={O.y} dashed tone="faint" />}
            {!after && <Line x1={O.x} y1={O.y} x2={O.x} y2={290} dashed tone="faint" />}
            {!after ? (
              <g>
                <Ball x={A.x} y={A.y} r={13} />
                <Ball x={B.x} y={B.y} r={10} glow={false} />
                <Arrow x1={A.x + 18} y1={A.y} x2={A.x + 18 + 6 * pk * 0.6} y2={A.y} />
                <Arrow x1={B.x} y1={B.y - 15} x2={B.x} y2={B.y - 15 - 4 * pk * 0.6} />
              </g>
            ) : (
              <g>
                <Ball x={A.x} y={A.y} r={15} />
                <Arrow x1={A.x + 12} y1={A.y - 8} x2={A.x + 12 + v.x * 3 * pk * 0.6} y2={A.y - 8 - v.y * 3 * pk * 0.6} />
              </g>
            )}
            <Label x={16} y={26} kind="val" anchor="start">2 kg east at 3 m/s, 1 kg north at 4 m/s</Label>
            {show > 0 && (
              <g opacity={show}>
                <Line x1={430} y1={250} x2={430 + 6 * 14} y2={250} tone="soft" dashed />
                <Arrow x1={430} y1={250} x2={430 + 6 * 14} y2={250} tone="soft" />
                <Arrow x1={430 + 6 * 14} y1={250} x2={430 + 6 * 14} y2={250 - 4 * 14} tone="soft" />
                <Arrow x1={430} y1={250} x2={430 + 6 * 14} y2={250 - 4 * 14} />
                <Label x={430 + 42} y={272} kind="val">px = 6</Label>
                <Label x={430 + 6 * 14 + 8} y={250 - 28} kind="val" anchor="start">py = 4</Label>
                <Label x={430 + 8} y={250 - 52} kind="val" anchor="start">p = 7.21</Label>
                <Label x={430 + 58} y={244} kind="val" anchor="start">33.7°</Label>
              </g>
            )}
          </g>
        );
      }}
    </Anim>
  );
}
