/* Memory reel full-screen overlay — ported 1:1 from the prototype (lines 518–536). */
import { useApp } from '../state/store';
import { FEATURED_PRODUCT } from '../data/content';

export function Reel() {
  const { state, close, openProduct } = useApp();

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#08080A', animation: 'fmFade .25s ease', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#FFD3A5,#FD6585)', opacity: .92 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.35),transparent 30%,transparent 60%,rgba(0,0,0,.6))' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 18 }}>
        <div style={{ color: '#fff' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .9 }}>Memory reel</div>
          <div style={{ fontSize: 17, fontWeight: 800 }}>April 2026</div>
        </div>
        <button onClick={close} style={{ border: 'none', background: 'rgba(255,255,255,.22)', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', color: '#fff', fontSize: 19 }}>×</button>
      </div>
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 66, height: 66, borderRadius: '50%', background: 'rgba(255,255,255,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,.3)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#1B4794"><path d="M8 5v14l11-7z" /></svg>
        </div>
        {!state.premium && (
          <div style={{ position: 'absolute', top: 14, right: 18, background: 'rgba(0,0,0,.4)', color: 'rgba(255,255,255,.85)', fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 8 }}>Family Moments</div>
        )}
      </div>
      <div style={{ position: 'relative', padding: '0 18px 26px' }}>
        <div style={{ height: 4, borderRadius: 3, background: 'rgba(255,255,255,.3)', marginBottom: 8 }}>
          <div style={{ width: '36%', height: '100%', borderRadius: 3, background: '#fff' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,.85)', fontSize: 12, fontWeight: 600, marginBottom: 16 }}><span>0:17</span><span>0:48</span></div>
        <button onClick={() => openProduct(FEATURED_PRODUCT)} style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,.95)', color: '#15233F', fontFamily: 'inherit', fontWeight: 800, fontSize: 14.5, padding: 14, borderRadius: 14 }}>Turn this reel into a photo book</button>
      </div>
    </div>
  );
}
