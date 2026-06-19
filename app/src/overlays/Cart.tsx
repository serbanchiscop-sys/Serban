/* Cart bottom overlay — ported 1:1 from the prototype (lines 420–448). */
import { useApp } from '../state/store';
import { cartTotals } from '../state/selectors';

export function Cart() {
  const { state, close, cartInc, open } = useApp();
  const t = cartTotals(state.cart);

  return (
    <div className="scr" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '90%', overflowY: 'auto', background: '#fff', borderRadius: '26px 26px 0 0', animation: 'fmSlide .3s cubic-bezier(.16,1,.3,1)' }}>
      <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '16px 18px 12px', borderBottom: '1px solid #F1F3F7' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: '#15233F' }}>Your cart</div>
          <button onClick={close} style={{ border: 'none', background: '#F1F3F7', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 17, color: '#6B7280' }}>×</button>
        </div>
      </div>
      <div style={{ padding: '8px 18px 18px' }}>
        {state.cart.length > 0 ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, margin: '10px 0 4px' }}>
              {t.items.map((ci) => (
                <div key={ci.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 58, height: 58, borderRadius: 12, flex: 'none', background: ci.bg }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#15233F' }}>{ci.name}</div>
                    <div style={{ fontSize: 13, color: '#1B4794', fontWeight: 700, marginTop: 2 }}>{ci.lineLabel}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, border: '1px solid #E5E7EB', borderRadius: 999, padding: '5px 11px' }}>
                    <button onClick={() => cartInc(ci.id, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 17, color: '#1B4794', lineHeight: 1 }}>−</button>
                    <span style={{ fontSize: 14, fontWeight: 800, minWidth: 14, textAlign: 'center' }}>{ci.qtyLabel}</span>
                    <button onClick={() => cartInc(ci.id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 17, color: '#1B4794', lineHeight: 1 }}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #F1F3F7', marginTop: 16, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6B7280' }}><span>Subtotal</span><span style={{ fontWeight: 700, color: '#374151' }}>{t.subtotalLabel}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6B7280' }}><span>Shipping</span><span style={{ fontWeight: 700, color: '#374151' }}>{t.shippingLabel}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800, color: '#15233F', marginTop: 2 }}><span>Total</span><span>{t.totalLabel}</span></div>
            </div>
            <button onClick={() => open('checkout')} style={{ width: '100%', marginTop: 18, border: 'none', cursor: 'pointer', background: '#1B4794', color: '#fff', fontFamily: 'inherit', fontWeight: 800, fontSize: 15.5, padding: 15, borderRadius: 14 }}>Checkout</button>
          </>
        ) : (
          <div style={{ textAlign: 'center', fontSize: 14, color: '#8A93A6', padding: '40px 0' }}>Your cart is empty</div>
        )}
      </div>
    </div>
  );
}
