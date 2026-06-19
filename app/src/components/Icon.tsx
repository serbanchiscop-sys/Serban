/* Inline SVG icon set — Lucide-style, 2px stroke, currentColor, matching the
 * glyphs the prototype hand-inlined. Size & color come from props/CSS. */
import type { CSSProperties } from 'react';

type Props = { size?: number; color?: string; style?: CSSProperties; strokeWidth?: number };

const stroke = (d: string) =>
  function IconCmp({ size = 24, color = 'currentColor', style, strokeWidth = 2 }: Props) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
        {d.split('|').map((p, i) => <path key={i} d={p} />)}
      </svg>
    );
  };

export const SearchIcon = ({ size = 24, color = 'currentColor', style }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={2} strokeLinecap="round" style={style}>
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
  </svg>
);

export const Sparkle = ({ size = 24, color = 'currentColor', style }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
    <path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
  </svg>
);

export const SparkleSingle = stroke('M12 3l1.7 4.6L18.5 9l-4.8 1.4L12 15l-1.7-4.6L5.5 9l4.8-1.4z');
export const Plus = stroke('M12 5v14M5 12h14');
export const Play = ({ size = 24, color = '#1B4794', style }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}><path d="M8 5v14l11-7z" /></svg>
);
export const Cart = stroke('M6 8h12l-1 12H7z|M9 8a3 3 0 0 1 6 0');
export const Check = stroke('M5 13l4 4L19 7');
export const ArrowRight = stroke('M5 12h14M13 6l6 6-6 6');
export const Send = stroke('M22 2 11 13M22 2l-7 20-4-9-9-4z');
export const Card = stroke('M2 5h20v14H2z|M2 10h20');
export const Heart = ({ size = 24, color = '#fff', style, strokeWidth = 2.1 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21Z" />
  </svg>
);

/* Bottom-nav glyphs — exact SVGs from the prototype */
const navProps = (size: number, color: string) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color,
  strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
});

export const NavTimeline = ({ size = 23, color = 'currentColor', style }: Props) => (
  <svg {...navProps(size, color)} style={style}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
export const NavMoments = ({ size = 23, color = 'currentColor', style }: Props) => (
  <svg {...navProps(size, color)} style={style}>
    <path d="M12 3l1.7 4.6L18.5 9l-4.8 1.4L12 15l-1.7-4.6L5.5 9l4.8-1.4z" />
    <path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
  </svg>
);
export const NavSearch = ({ size = 23, color = 'currentColor', style }: Props) => (
  <svg {...navProps(size, color)} style={style}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
);
export const NavShop = ({ size = 23, color = 'currentColor', style }: Props) => (
  <svg {...navProps(size, color)} style={style}><path d="M6 8h12l-1 12H7z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>
);
export const NavFamily = ({ size = 23, color = 'currentColor', style }: Props) => (
  <svg {...navProps(size, color)} style={style}>
    <circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 6a3 3 0 0 1 0 6" /><path d="M20.5 20a5.5 5.5 0 0 0-4-5.3" />
  </svg>
);
