/* Checkout bottom overlay — ported 1:1 from the prototype (lines 451–470). */
import { useApp } from '../state/store';
import { cartTotals } from '../state/selectors';
import { Input } from '../components/Input';

export function Checkout() {
  const { state, close, placeOrder } = useApp();
  const totalLabel = cartTotals(state.cart).totalLabel;

  return (
    <div className="scr" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '92%', overflowY: 'auto', background: '#fff', borderRadius: '26px 26px 0 0', animation: 'fmSlide .3s cubic-bezier(.16,1,.3,1)' }}>
      <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '16px 18px 12px', borderBottom: '1px solid #F1F3F7' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: '#15233F' }}>Checkout</div>
          <button onClick={close} style={{ border: 'none', background: '#F1F3F7', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 17, color: '#6B7280' }}>×</button>
        </div>
      </div>
      <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input label="Full name" placeholder="Sofia de Vries" />
        <Input label="Address" placeholder="Prinsengracht 263" />
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}><Input label="Postcode" placeholder="1016 GV" /></div>
          <div style={{ flex: 1.4 }}><Input label="City" placeholder="Amsterdam" /></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #E5E7EB', borderRadius: 12, padding: '13px 14px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B4794" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#15233F' }}>Visa ···· 4242</div>
            <div style={{ fontSize: 12, color: '#8A93A6' }}>Expires 09/28</div>
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1B4794' }}>Change</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800, color: '#15233F', borderTop: '1px solid #F1F3F7', paddingTop: 14 }}><span>Total</span><span>{totalLabel}</span></div>
        <button onClick={placeOrder} style={{ width: '100%', border: 'none', cursor: 'pointer', background: '#FF7A59', color: '#fff', fontFamily: 'inherit', fontWeight: 800, fontSize: 15.5, padding: 15, borderRadius: 14 }}>Place order · {totalLabel}</button>
      </div>
    </div>
  );
}
