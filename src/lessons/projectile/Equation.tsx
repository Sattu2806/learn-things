import { Fragment, useSyncExternalStore, type ReactNode } from 'react';
import type { Target } from './lesson';
import { termsAt, type Bugs, type Model, type TermId } from './model';
import type { TimeStore } from './time';

/** What the equation shows (which can differ from the physics driving the ball). */
export interface Written {
  xLine: boolean;
  run: boolean;
  rise: boolean;
  drop: 'on' | 'off' | 'hidden';
  bugs: Bugs;
}

export interface Hunt {
  onGuess: (target: Target) => void;
  wrong: Target | null;
  /** Bumped on every wrong guess so the shake replays. */
  wrongKey: number;
  found: Target[] | null;
}

interface EquationProps {
  model: Model;
  written: Written;
  store: TimeStore;
  focus: TermId | null;
  onHover: (t: TermId | null) => void;
  onPick: (t: TermId) => void;
  hunt?: Hunt;
  values: boolean;
}

export function useTime(store: TimeStore) {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

function signed(n: number) {
  const s = `${Math.abs(n) >= 100 ? Math.round(Math.abs(n)) : Math.abs(n).toFixed(1)} m`;
  return n < -0.05 ? `−${s}` : s;
}

function Value({ store, model, kind }: { store: TimeStore; model: Model; kind: 'x' | 'y' | TermId }) {
  const { t } = useTime(store);
  const k = termsAt(model, t);
  const v = kind === 'x' ? k.x : kind === 'y' ? k.y : k[kind];
  return <>{signed(v)}</>;
}

const V = ({ c }: { c: string }) => <i className="m-var">{c}</i>;
const Fn = ({ c, changed }: { c: string; changed?: boolean }) => <span className={changed ? 'm-fn is-changed' : 'm-fn'}>{c}</span>;
const Dot = () => <span className="m-dot">·</span>;

const LABELS: Record<Target, string> = {
  'x.v': 'v in the x equation',
  'x.cos': 'cos in the x equation',
  'x.theta': 'theta in the x equation',
  'x.t': 't in the x equation',
  'y.v': 'v in the launch term',
  'y.sin': 'sin in the launch term',
  'y.theta': 'theta in the launch term',
  'y.t': 't in the launch term',
  sign: 'the minus sign',
  half: 'the one half',
  g: 'g',
  'drop.t': 't in the gravity term',
  square: 'the square on t',
};

function Tok({ target, hunt, children }: { target: Target; hunt?: Hunt; children: ReactNode }) {
  if (!hunt) return <>{children}</>;
  const found = hunt.found?.includes(target);
  const wrong = hunt.wrong === target;
  return (
    <button
      key={wrong ? `${target}-${hunt.wrongKey}` : target}
      type="button"
      className={found ? 'tok is-found' : wrong ? 'tok is-wrong' : 'tok'}
      aria-label={`Is it ${LABELS[target]}?`}
      disabled={!!hunt.found}
      onClick={() => hunt.onGuess(target)}
    >
      {children}
    </button>
  );
}

/** One column of the equation: a symbol with its live value underneath. */
function Col({ children, value, op }: { children: ReactNode; value?: ReactNode; op?: boolean }) {
  return (
    <span className={op ? 'eq-col is-op' : 'eq-col'}>
      <span className="eq-sym">{children}</span>
      <span className="eq-val">{value ?? ' '}</span>
    </span>
  );
}

function Term(props: {
  id: TermId;
  focus: TermId | null;
  off?: boolean;
  hunt?: Hunt;
  value: ReactNode;
  label: string;
  onHover: (t: TermId | null) => void;
  onPick: (t: TermId) => void;
  children: ReactNode;
}) {
  const { id, focus, off, hunt, value, label, onHover, onPick, children } = props;
  const cls = `eq-col term${focus === id ? ' is-focus' : ''}${off ? ' is-off' : ''}`;
  const body = (
    <>
      <span className="eq-sym">{children}</span>
      <span className="eq-val">{off ? 'off' : value}</span>
    </>
  );
  if (hunt) return <span className={cls}>{body}</span>;
  return (
    <button
      type="button"
      className={cls}
      aria-pressed={focus === id}
      aria-label={`${label}. Show what it draws.`}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
      onClick={() => onPick(id)}
    >
      {body}
    </button>
  );
}

export function Equation({ model, written, store, focus, onHover, onPick, hunt, values }: EquationProps) {
  const b = written.bugs;
  const val = (kind: 'x' | 'y' | TermId) => (values ? <Value store={store} model={model} kind={kind} /> : undefined);
  const term = { focus, hunt, onHover, onPick };
  return (
    <div className="eq" role="group" aria-label="The equations of the throw">
      {written.xLine && (
        <div className="eq-line">
          <Col value={val('x')}>
            <V c="x" />
          </Col>
          <Col op>=</Col>
          <Term id="run" {...term} off={!written.run} value={val('run')} label="Sideways term, v times cos theta times t">
            <Tok target="x.v" hunt={hunt}>
              <V c="v" />
            </Tok>
            <Dot />
            <Tok target="x.cos" hunt={hunt}>
              <Fn c={b.swap ? 'sin' : 'cos'} changed={b.swap} />
            </Tok>
            <Tok target="x.theta" hunt={hunt}>
              <V c="θ" />
            </Tok>
            <Dot />
            <Tok target="x.t" hunt={hunt}>
              <V c="t" />
            </Tok>
          </Term>
        </div>
      )}
      <div className="eq-line">
        <Col value={val('y')}>
          <V c="y" />
        </Col>
        <Col op>=</Col>
        <Term id="rise" {...term} off={!written.rise} value={val('rise')} label="Launch term, v times sin theta times t">
          <Tok target="y.v" hunt={hunt}>
            <V c="v" />
          </Tok>
          <Dot />
          <Tok target="y.sin" hunt={hunt}>
            <Fn c={b.swap ? 'cos' : 'sin'} changed={b.swap} />
          </Tok>
          <Tok target="y.theta" hunt={hunt}>
            <V c="θ" />
          </Tok>
          <Dot />
          <Tok target="y.t" hunt={hunt}>
            <V c="t" />
          </Tok>
        </Term>
        {written.drop !== 'hidden' && (
          <>
            <Col op>
              <Tok target="sign" hunt={hunt}>
                <span className={b.plus ? 'm-op is-changed' : 'm-op'}>{b.plus ? '+' : '−'}</span>
              </Tok>
            </Col>
            <Term id="drop" {...term} off={written.drop === 'off'} value={val('drop')} label="Gravity term, one half g t squared">
              {b.noHalf ? (
                <s className="m-cut">½</s>
              ) : (
                <Tok target="half" hunt={hunt}>
                  <span className="m-num">½</span>
                </Tok>
              )}
              <Dot />
              <Tok target="g" hunt={hunt}>
                <V c="g" />
              </Tok>
              <Dot />
              <Tok target="drop.t" hunt={hunt}>
                <V c="t" />
              </Tok>
              {b.linear ? (
                <s className="m-cut m-sup">2</s>
              ) : (
                <Tok target="square" hunt={hunt}>
                  <sup className="m-sup">2</sup>
                </Tok>
              )}
            </Term>
          </>
        )}
      </div>
    </div>
  );
}

function tokens(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    const key = out.length;
    if (s.startsWith('sin', i) || s.startsWith('cos', i)) {
      out.push(<span key={key} className="m-fn">{s.slice(i, i + 3)}</span>);
      i += 3;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      out.push(<span key={key} className="m-num">{s.slice(i, j)}</span>);
      i = j;
      continue;
    }
    if (/[a-zA-Zθ]/.test(c)) out.push(<i key={key} className="m-var">{c}</i>);
    else if (c === '½') out.push(<span key={key} className="m-num">½</span>);
    else if (c === '²') out.push(<sup key={key} className="m-sup">2</sup>);
    else if (c === '·') out.push(<span key={key} className="m-dot">·</span>);
    else if (c === '−' || c === '+' || c === '=') out.push(<span key={key} className="m-op">{c}</span>);
    else if (c !== ' ') out.push(<span key={key}>{c}</span>);
    i++;
  }
  return out;
}

/** Typesets plain-text maths: italic variables, upright functions, " / " as a stacked fraction. */
export function MathText({ eq }: { eq: string }) {
  const parts = eq.split(' = ');
  if (parts.length === 2 && parts[1].includes(' / ')) {
    const [num, den] = parts[1].split(' / ');
    return (
      <span className="m">
        {tokens(parts[0])}
        <span className="m-op">=</span>
        <span className="m-frac">
          <span className="m-frac-num">{tokens(num)}</span>
          <span className="m-frac-den">{tokens(den)}</span>
        </span>
      </span>
    );
  }
  return (
    <span className="m">
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="m-op">=</span>}
          {tokens(p)}
        </Fragment>
      ))}
    </span>
  );
}
