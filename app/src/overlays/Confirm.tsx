/* Order confirmation bottom overlay — ported 1:1 from the prototype (lines 473–481). */
import { useApp } from '../state/store';

export function Confirm() {
  const { state, go } = useApp();

  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: '26px 26px 0 0', animation: 'fmSlide .3s cubic-bezier(.16,1,.3,1)', padding: '34px 22px 26px', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 18px', background: 'linear-gradient(140deg,#7CFFB2,#1F8A5B)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 26px -8px rgba(31,138,91,.5)' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#15233F', letterSpacing: '-.02em' }}>Order confirmed</div>
      <div style={{ fontSize: 14, color: '#6B7280', marginTop: 6, lineHeight: 1.55 }}>Your prints are off to the lab. They’ll arrive in 3–5 days.</div>
      <div style={{ background: '#F4F6FA', borderRadius: 12, padding: 12, marginTop: 18, fontSize: 13, color: '#374151' }}>Order <strong style={{ color: '#1B4794' }}>{state.orderNo}</strong></div>
      <button onClick={() => go('shop')} style={{ width: '100%', marginTop: 18, border: 'none', cursor: 'pointer', background: '#1B4794', color: '#fff', fontFamily: 'inherit', fontWeight: 800, fontSize: 15, padding: 14, borderRadius: 14 }}>Back to shop</button>
    </div>
  );
}
