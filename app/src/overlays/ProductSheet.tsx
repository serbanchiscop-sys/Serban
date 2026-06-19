/* Product sheet bottom overlay — ported 1:1 from the prototype (lines 398–417). */
import { useApp } from '../state/store';
import { FEATURED_PRODUCT, eur } from '../data/content';

export function ProductSheet() {
  const { state, setPqty, addToCart } = useApp();
  const p = state.product ?? FEATURED_PRODUCT;

  return (
    <div className="scr" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '90%', overflowY: 'auto', background: '#fff', borderRadius: '26px 26px 0 0', animation: 'fmSlide .3s cubic-bezier(.16,1,.3,1)' }}>
      <div style={{ position: 'sticky', top: 0, display: 'flex', justifyContent: 'center', padding: '10px 0 4px', background: '#fff' }}>
        <div style={{ width: 38, height: 4, borderRadius: 3, background: '#D7DCE5' }} />
      </div>
      <div style={{ height: 200, margin: '6px 18px 0', borderRadius: 18, background: p.bg }} />
      <div style={{ padding: 18 }}>
        <div style={{ fontSize: 21, fontWeight: 800, color: '#15233F', letterSpacing: '-.02em' }}>{p.name}</div>
        <div style={{ fontSize: 13.5, color: '#6B7280', marginTop: 4 }}>{p.desc}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1B4794', marginTop: 12 }}>{eur(p.price)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>Quantity</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid #E5E7EB', borderRadius: 999, padding: '6px 14px' }}>
            <button onClick={() => setPqty(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: '#1B4794', lineHeight: 1 }}>−</button>
            <span style={{ fontSize: 15, fontWeight: 800, minWidth: 18, textAlign: 'center' }}>{String(state.pqty)}</span>
            <button onClick={() => setPqty(1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: '#1B4794', lineHeight: 1 }}>+</button>
          </div>
        </div>
        <button onClick={() => addToCart(p, state.pqty)} style={{ width: '100%', marginTop: 20, border: 'none', cursor: 'pointer', background: '#FF7A59', color: '#fff', fontFamily: 'inherit', fontWeight: 800, fontSize: 15.5, padding: 15, borderRadius: 14 }}>Add to cart · {eur(p.price * state.pqty)}</button>
      </div>
    </div>
  );
}
