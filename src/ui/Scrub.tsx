import { useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

interface ScrubProps {
  /** The symbol, e.g. <i>v</i>. */
  symbol: ReactNode;
  /** Spoken name, e.g. "Launch speed". */
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  digits?: number;
  unit?: string;
  unitName?: string;
  onChange: (value: number) => void;
  /** Called when a drag or key press finishes. */
  onCommit?: () => void;
}

/**
 * A number you change by dragging it sideways (or with the arrow keys),
 * in the spirit of Bret Victor's reactive documents.
 */
export function Scrub({ symbol, name, value, min, max, step, digits = 0, unit, unitName, onChange, onCommit }: ScrubProps) {
  const drag = useRef<{ x: number; v: number } | null>(null);
  const snap = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step));

  const down = (e: PointerEvent<HTMLSpanElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, v: value };
    e.preventDefault();
  };
  const move = (e: PointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    if (!d) return;
    const next = snap(d.v + ((e.clientX - d.x) / 260) * (max - min));
    if (next !== value) onChange(next);
  };
  const up = () => {
    if (!drag.current) return;
    drag.current = null;
    onCommit?.();
  };
  const key = (e: KeyboardEvent<HTMLSpanElement>) => {
    const big = e.shiftKey ? 10 : 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = value + step * big;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = value - step * big;
    else if (e.key === 'Home') next = min;
    else if (e.key === 'End') next = max;
    if (next === null) return;
    e.preventDefault();
    onChange(snap(next));
    onCommit?.();
  };

  const shown = value.toFixed(digits);
  return (
    <span
      className="scrub"
      role="slider"
      tabIndex={0}
      aria-label={name}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${shown} ${unitName ?? unit ?? ''}`.trim()}
      title="Drag sideways to change"
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={key}
    >
      <span className="scrub-sym">{symbol}</span>
      <span className="scrub-eq">=</span>
      <span className="scrub-num">
        {shown}
        {unit === '°' && '°'}
      </span>
      {unit && unit !== '°' && <span className="scrub-unit">{unit}</span>}
    </span>
  );
}
