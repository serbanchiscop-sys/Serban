/* AI memory book bottom overlay — ported 1:1 from the prototype (lines 484–500). */
import { useApp } from '../state/store';
import { FEATURED_PRODUCT } from '../data/content';

export function MemoryBook() {
  const { state, close, openProduct } = useApp();

  return (
    <div className="scr" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '90%', overflowY: 'auto', background: '#fff', borderRadius: '26px 26px 0 0', animation: 'fmSlide .3s cubic-bezier(.16,1,.3,1)' }}>
      <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '16px 18px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#4CA8E4' }}>AI memory book</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: '#15233F', marginTop: 3 }}>Roan — Year One</div>
          </div>
          <button onClick={close} style={{ border: 'none', background: '#F1F3F7', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 17, color: '#6B7280' }}>×</button>
        </div>
      </div>
      <div style={{ padding: '4px 18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#EEF6FF', borderRadius: 12, padding: '11px 13px', marginBottom: 16 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4CA8E4', animation: 'fmPulse 1.6s infinite' }} />
          <span style={{ fontSize: 12.5, color: '#1B4794', fontWeight: 600 }}>AI selected 96 best photos & wrote the captions.</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
          <div style={{ aspectRatio: '.74', borderRadius: 12, background: 'linear-gradient(135deg,#FFD3A5,#FD6585)', boxShadow: 'inset -8px 0 14px -8px rgba(0,0,0,.25)' }} />
          <div style={{ aspectRatio: '.74', borderRadius: 12, background: 'linear-gradient(135deg,#A1C4FD,#C2E9FB)', boxShadow: 'inset -8px 0 14px -8px rgba(0,0,0,.25)' }} />
          <div style={{ aspectRatio: '.74', borderRadius: 12, background: 'linear-gradient(135deg,#FAD0C4,#FFD1FF)', boxShadow: 'inset -8px 0 14px -8px rgba(0,0,0,.25)' }} />
          <div style={{ aspectRatio: '.74', borderRadius: 12, background: 'linear-gradient(135deg,#F6D365,#FDA085)', boxShadow: 'inset -8px 0 14px -8px rgba(0,0,0,.25)' }} />
        </div>
        {!state.premium && (
          <div style={{ fontSize: 12, color: '#8A93A6', marginTop: 12, textAlign: 'center' }}>Free export includes a small watermark. Premium removes it.</div>
        )}
        <button onClick={() => openProduct(FEATURED_PRODUCT)} style={{ width: '100%', marginTop: 16, border: 'none', cursor: 'pointer', background: '#FF7A59', color: '#fff', fontFamily: 'inherit', fontWeight: 800, fontSize: 15, padding: 15, borderRadius: 14 }}>Order printed book · €29.99</button>
        <button onClick={close} style={{ width: '100%', marginTop: 10, border: '1px solid #E5E7EB', cursor: 'pointer', background: '#fff', color: '#1B4794', fontFamily: 'inherit', fontWeight: 700, fontSize: 14.5, padding: 13, borderRadius: 14 }}>Save digital version</button>
      </div>
    </div>
  );
}
