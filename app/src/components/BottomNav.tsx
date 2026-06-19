/* Bottom tab bar — 5 tabs, Android shows a tinted active pill. */
import { useApp, type Tab } from '../state/store';
import { NavTimeline, NavMoments, NavSearch, NavShop, NavFamily } from './Icon';

const DEEP = '#1B4794';
const SLATE = '#9AA3AF';

const TABS: { id: Tab; label: string; Icon: typeof NavTimeline }[] = [
  { id: 'timeline', label: 'Timeline', Icon: NavTimeline },
  { id: 'moments', label: 'Moments', Icon: NavMoments },
  { id: 'search', label: 'Search', Icon: NavSearch },
  { id: 'shop', label: 'Shop', Icon: NavShop },
  { id: 'family', label: 'Family', Icon: NavFamily },
];

export function BottomNav() {
  const { state, go } = useApp();
  const isA = state.platform === 'android';
  return (
    <div className="no-select" style={{ flex: 'none', background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(12px)',
      borderTop: '1px solid #ECEFF3', padding: '8px 8px 6px', display: 'flex', justifyContent: 'space-around', zIndex: 5 }}>
      {TABS.map(({ id, label, Icon }) => {
        const on = state.tab === id;
        const color = on ? DEEP : SLATE;
        const pill = isA && on ? 'rgba(76,168,228,0.20)' : 'transparent';
        return (
          <button key={id} onClick={() => go(id)} style={{ border: 'none', background: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, color }}>
            <span style={{ padding: '3px 16px', borderRadius: 'var(--radius-pill)', background: pill, display: 'flex' }}>
              <Icon size={23} color={color} />
            </span>
            <span style={{ fontSize: 10, fontWeight: 700 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
