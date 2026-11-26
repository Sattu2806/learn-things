/** Small stroke icons, drawn on a 24px grid. */
type Name = 'sound' | 'mute' | 'clear' | 'star' | 'check' | 'restart' | 'expand' | 'shrink' | 'back' | 'next' | 'dot' | 'play' | 'pause';

const paths: Record<Name, string> = {
  sound: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4z M15.5 9a4 4 0 0 1 0 6 M18 6.5a7.5 7.5 0 0 1 0 11',
  mute: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4z M16 9.5l5 5 M21 9.5l-5 5',
  clear: 'M5 7h14 M10 7V5h4v2 M7 7l1 12h8l1-12 M10.5 10.5v5.5 M13.5 10.5v5.5',
  star: 'M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  restart: 'M5 12a7 7 0 1 0 2.2-5.1 M5 4.5v4h4',
  expand: 'M14 4h6v6 M20 4l-7 7 M10 20H4v-6 M4 20l7-7',
  shrink: 'M19 5l-6 6 M13 6v5h5 M5 19l6-6 M11 18v-5H6',
  back: 'M15 6l-6 6 6 6',
  next: 'M9 6l6 6-6 6',
  dot: 'M12 12h.01',
  play: 'M8 5.5v13l10.5-6.5z',
  pause: 'M8.5 5.5v13 M15.5 5.5v13',
};

export function Icon({ name, size = 20, filled = false }: { name: Name; size?: number; filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled || name === 'play' ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={name === 'dot' ? 6 : name === 'pause' ? 2.6 : filled ? 1.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="#ffffff" />
      <path d="M6 25 Q16 1 26 25" fill="none" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.4 3.6" />
      <circle cx="20.5" cy="12" r="3.6" fill="#000000" />
      <rect x="4" y="25" width="24" height="1.6" rx="0.8" fill="#000000" />
    </svg>
  );
}
