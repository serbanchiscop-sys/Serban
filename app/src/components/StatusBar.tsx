/* In-app status bar — iOS notch/Dynamic-Island vs Android pinhole.
 * Mirrors the prototype's two status-bar variants exactly. */
import type { Platform } from '../lib/platform';

const TIME = '9:41';

export function StatusBar({ platform }: { platform: Platform }) {
  if (platform === 'ios') {
    return (
      <div style={{ position: 'relative', height: 50, flex: 'none', display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', padding: '0 26px 9px', zIndex: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#15233F', letterSpacing: '-.01em' }}>{TIME}</div>
        <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 118, height: 32, background: '#0a0b0d', borderRadius: 18 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15233F' }}>
          <svg width="17" height="11" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="7" width="3" height="5" rx="1" /><rect x="5" y="4.5" width="3" height="7.5" rx="1" /><rect x="10" y="2" width="3" height="10" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.4c2.2 0 4.2.85 5.7 2.25l1.3-1.4C13.2 1.5 10.7.5 8 .5S2.8 1.5.99 3.25l1.3 1.4A8.2 8.2 0 0 1 8 2.4Z" /><path d="M8 6c1.2 0 2.3.46 3.1 1.2l1.3-1.4A6.2 6.2 0 0 0 8 4.1a6.2 6.2 0 0 0-4.4 1.7l1.3 1.4A4.5 4.5 0 0 1 8 6Z" /><circle cx="8" cy="9.6" r="1.7" /></svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <div style={{ width: 22, height: 11, border: '1.5px solid #15233F', borderRadius: 3, padding: 1.5 }}>
              <div style={{ width: '78%', height: '100%', background: '#15233F', borderRadius: 1 }} />
            </div>
            <div style={{ width: 1.5, height: 4, background: '#15233F', borderRadius: 1 }} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', height: 42, flex: 'none', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 20px', zIndex: 6 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#15233F' }}>{TIME}</div>
      <div style={{ position: 'absolute', top: 13, left: '50%', transform: 'translateX(-50%)', width: 9, height: 9, background: '#0a0b0d', borderRadius: '50%' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#15233F' }}>
        <svg width="15" height="11" viewBox="0 0 16 12" fill="currentColor"><path d="M8 1.5 14.5 9H1.5z" opacity=".25" /><path d="M8 1.5 14.5 9H8z" /></svg>
        <svg width="15" height="11" viewBox="0 0 16 12" fill="currentColor"><path d="M8 3c2.4 0 4.6.95 6.2 2.5l-6.2 6L1.8 5.5A8.7 8.7 0 0 1 8 3Z" /></svg>
        <svg width="20" height="11" viewBox="0 0 22 12" fill="none"><rect x="1" y="1" width="18" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.4" /><rect x="2.6" y="2.6" width="11" height="6.8" rx="1.2" fill="currentColor" /><rect x="20" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" /></svg>
      </div>
    </div>
  );
}

export function HomeIndicator({ platform }: { platform: Platform }) {
  if (platform === 'ios') {
    return (
      <div style={{ flex: 'none', height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.92)' }}>
        <div style={{ width: 134, height: 5, borderRadius: 3, background: '#15233F', opacity: .85 }} />
      </div>
    );
  }
  return (
    <div style={{ flex: 'none', height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.92)' }}>
      <div style={{ width: 108, height: 4, borderRadius: 3, background: '#15233F', opacity: .7 }} />
    </div>
  );
}
