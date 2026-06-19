/* Premium paywall bottom overlay — ported 1:1 from the prototype (lines 539–571). */
import { useApp } from '../state/store';

export function Paywall() {
  const { state, close, setPlan, startTrial } = useApp();
  const year = state.plan === 'year';
  // Prototype had a doubled "· cancel anytime" for the monthly note; trimmed here.
  const planNote = year ? 'Billed yearly · just €3.33 / month' : 'Billed monthly';

  return (
    <div className="scr" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '94%', overflowY: 'auto', background: '#fff', borderRadius: '26px 26px 0 0', animation: 'fmSlide .3s cubic-bezier(.16,1,.3,1)' }}>
      <div style={{ position: 'relative', padding: '26px 22px 18px', background: 'linear-gradient(150deg,#1B4794,#0E2A5C)', borderRadius: '26px 26px 0 0', color: '#fff', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', right: -60, top: -80, background: 'radial-gradient(circle,rgba(76,168,228,.5),transparent 70%)' }} />
        <button onClick={close} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'rgba(255,255,255,.18)', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', color: '#fff', fontSize: 17, zIndex: 2 }}>×</button>
        <div style={{ position: 'relative', fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9FD0F2' }}>Family Moments Premium</div>
        <div style={{ position: 'relative', fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', marginTop: 8, lineHeight: 1.15 }}>Every memory, kept forever.</div>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 18 }}>
          {[
            'Unlimited photo & video storage',
            'No ads, no watermarks · 4K reels',
            'Unlimited memory books & stories',
            '15% off all prints & gifts',
          ].map((feat) => (
            <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#EAF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B4794" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
              </span>
              <span style={{ fontSize: 14, color: '#374151' }}>{feat}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 11, marginBottom: 16 }}>
          <button onClick={() => setPlan('year')} style={{ flex: 1, border: '2px solid ' + (year ? '#FF7A59' : '#E5E7EB'), background: year ? '#FFF1EC' : '#fff', borderRadius: 15, padding: '14px 12px', cursor: 'pointer', textAlign: 'left', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -9, left: 12, background: '#FF7A59', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, letterSpacing: '.04em' }}>SAVE 33%</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Yearly</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#15233F', marginTop: 3 }}>€39.99</div>
            <div style={{ fontSize: 11.5, color: '#8A93A6' }}>€3.33 / mo</div>
          </button>
          <button onClick={() => setPlan('month')} style={{ flex: 1, border: '2px solid ' + (year ? '#E5E7EB' : '#FF7A59'), background: year ? '#fff' : '#FFF1EC', borderRadius: 15, padding: '14px 12px', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Monthly</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#15233F', marginTop: 3 }}>€4.99</div>
            <div style={{ fontSize: 11.5, color: '#8A93A6' }}>billed monthly</div>
          </button>
        </div>
        <button onClick={startTrial} style={{ width: '100%', border: 'none', cursor: 'pointer', background: '#FF7A59', color: '#fff', fontFamily: 'inherit', fontWeight: 800, fontSize: 15.5, padding: 16, borderRadius: 14 }}>Start 7-day free trial</button>
        <div style={{ textAlign: 'center', fontSize: 11.5, color: '#9AA3AF', marginTop: 10 }}>{planNote} · cancel anytime</div>
      </div>
    </div>
  );
}
