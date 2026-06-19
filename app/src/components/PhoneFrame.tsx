/* Web-preview device frame: header, iOS/Android toggle, and the phone bezel.
 * On a real device this is NOT rendered — the app fills the screen. */
import type { ReactNode } from 'react';
import { useApp } from '../state/store';
import { Heart } from './Icon';

const DEEP = '#1B4794';

export function PhoneFrame({ children }: { children: ReactNode }) {
  const { state, setPlatform } = useApp();
  const isA = state.platform === 'android';

  return (
    <div style={{ minHeight: '100vh', width: '100%', fontFamily: 'var(--font-sans)', display: 'flex',
      flexDirection: 'column', alignItems: 'center', padding: '36px 16px 48px',
      background: 'radial-gradient(900px 620px at 78% -8%, #FFE7DC 0%, transparent 60%), radial-gradient(760px 520px at 8% 4%, #E5F0FB 0%, transparent 55%), #F3F5F9' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 26, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(150deg,#4CA8E4,#1B4794)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(27,71,148,.28)' }}>
            <Heart size={21} color="#fff" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#15233F', letterSpacing: '-.02em', lineHeight: 1 }}>Family Moments AI</div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>The AI memory book for families</div>
          </div>
        </div>
        {/* Platform toggle */}
        <div style={{ display: 'inline-flex', padding: 4, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-sm)' }}>
          <button onClick={() => setPlatform('ios')} style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, padding: '7px 18px', borderRadius: 'var(--radius-pill)', background: !isA ? DEEP : 'transparent', color: !isA ? '#fff' : '#6B7280' }}>iOS</button>
          <button onClick={() => setPlatform('android')} style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, padding: '7px 18px', borderRadius: 'var(--radius-pill)', background: isA ? DEEP : 'transparent', color: isA ? '#fff' : '#6B7280' }}>Android</button>
        </div>
      </div>

      {/* Phone bezel */}
      <div style={{ width: 390, height: 842, background: '#0a0b0d', borderRadius: 48, padding: 11, flex: 'none',
        boxShadow: '0 40px 90px -24px rgba(16,42,92,.55), 0 0 0 2px rgba(255,255,255,.04) inset' }}>
        {children}
      </div>

      <div style={{ marginTop: 22, fontSize: 12.5, color: '#9AA3AF', textAlign: 'center', maxWidth: 340, lineHeight: 1.5 }}>
        Interactive prototype · tap around. Switch iOS / Android above — the same app, native chrome.
      </div>
    </div>
  );
}
