/* Shop tab — print shop with featured banner and product grid. */
import { useApp } from '../state/store';
import { PRODUCTS, FEATURED_PRODUCT, eur } from '../data/content';
import { cartTotals } from '../state/selectors';

export function Shop() {
  const { state, open, openProduct, addToCart } = useApp();
  const count = cartTotals(state.cart).count;

  return (
    <div style={{ padding: '6px 18px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ fontSize: 25, fontWeight: 800, color: '#15233F', letterSpacing: '-.03em' }}>Print Shop</div>
        <button onClick={() => open('cart')} style={{ position: 'relative', width: 42, height: 42, borderRadius: '50%', border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B4794" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12l-1 12H7z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>
          {count > 0 && <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 19, height: 19, padding: '0 5px', borderRadius: 999, background: '#FF7A59', color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{String(count)}</span>}
        </button>
      </div>
      <div style={{ fontSize: 13.5, color: '#6B7280', marginBottom: 18 }}>Turn your moments into keepsakes.</div>

      <button onClick={() => openProduct(FEATURED_PRODUCT)} style={{ width: '100%', position: 'relative', border: 'none', cursor: 'pointer', borderRadius: 18, overflow: 'hidden', padding: 0, marginBottom: 20, textAlign: 'left', display: 'block', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ height: 140, background: 'linear-gradient(135deg,#FFE29F,#FFA17F)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg,rgba(15,42,92,.72),rgba(15,42,92,.15))' }} />
        <div style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#fff' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', opacity: .9 }}>Featured</div>
          <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-.01em', marginTop: 3 }}>Your April reel → a photo book</div>
          <div style={{ fontSize: 13, opacity: .9, marginTop: 4 }}>AI-designed · from €29.99</div>
        </div>
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {PRODUCTS.map((p) => (
          <div key={p.id} style={{ background: '#fff', border: '1px solid #EDF0F4', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => openProduct(p)} style={{ border: 'none', padding: 0, cursor: 'pointer', background: p.bg, height: 108, width: '100%' }} />
            <div style={{ padding: '11px 12px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#15233F', lineHeight: 1.2 }}>{p.name}</div>
              <div style={{ fontSize: 11.5, color: '#8A93A6', marginTop: 3 }}>{p.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 11 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1B4794' }}>{eur(p.price) + (p.unit ? ' ' + p.unit : '')}</div>
                <button onClick={() => addToCart(p, 1)} style={{ width: 30, height: 30, borderRadius: 9, border: 'none', cursor: 'pointer', background: '#FF7A59', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
