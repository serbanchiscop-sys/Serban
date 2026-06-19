/* Port of BHSGroupDesignSystem.Badge — pill status/category label. */
import type { ReactNode } from 'react';

type Tone = 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const TONES: Record<Tone, { fg: string; bg: string; solidBg: string }> = {
  brand: { fg: '#1B4794', bg: '#DCEEFB', solidBg: '#1B4794' },
  neutral: { fg: '#374151', bg: '#F3F4F6', solidBg: '#374151' },
  success: { fg: '#1F8A5B', bg: '#E3F3EC', solidBg: '#1F8A5B' },
  warning: { fg: '#B7791F', bg: '#FCF0DC', solidBg: '#B7791F' },
  danger: { fg: '#D92D20', bg: '#F8E4E1', solidBg: '#D92D20' },
  info: { fg: '#2196F3', bg: '#DCEEFB', solidBg: '#2196F3' },
};

export function Badge({
  children, tone = 'brand', solid = false, dot = false,
}: { children: ReactNode; tone?: Tone; solid?: boolean; dot?: boolean }) {
  const t = TONES[tone] || TONES.brand;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)',
      fontSize: 12, fontWeight: 600, lineHeight: 1, padding: '5px 11px',
      borderRadius: 'var(--radius-pill)', color: solid ? '#fff' : t.fg,
      background: solid ? t.solidBg : t.bg, whiteSpace: 'nowrap',
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: solid ? '#fff' : t.fg }} />}
      {children}
    </span>
  );
}
