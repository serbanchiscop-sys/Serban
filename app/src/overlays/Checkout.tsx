/* Checkout bottom overlay — ported 1:1 from the prototype (lines 451–470),
 * with a real Stripe + print-on-demand flow when a backend is configured. */
import { useState } from 'react';
import { useApp } from '../state/store';
import { useAuth } from '../state/auth';
import { cartTotals } from '../state/selectors';
import { Input } from '../components/Input';
import { runCheckout, checkoutEnabled } from '../services/checkout';

export function Checkout() {
  const { state, close, placeOrder, completeOrder } = useApp();
  const { account } = useAuth();
  const t = cartTotals(state.cart);
  const live = checkoutEnabled();

  const [ship, setShip] = useState({ name: '', address: '', postcode: '', city: '' });
  const set = (k: keyof typeof ship) => (e: { target: { value: string } }) => setShip((s) => ({ ...s, [k]: e.target.value }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPlaceOrder = async () => {
    if (busy) return;
    if (!live) { placeOrder(); return; } // offline/demo: mock order
    setBusy(true); setError(null);
    const res = await runCheckout(account?.familyId ?? null, state.cart, Math.round(t.total * 100), ship);
    setBusy(false);
    if (res.ok && res.orderNo) completeOrder(res.orderNo);
    else if (res.error) setError(res.error);
  };

  return (
    <div className="scr" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '92%', overflowY: 'auto', background: '#fff', borderRadius: '26px 26px 0 0', animation: 'fmSlide .3s cubic-bezier(.16,1,.3,1)' }}>
      <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '16px 18px 12px', borderBottom: '1px solid #F1F3F7' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: '#15233F' }}>Checkout</div>
          <button onClick={close} style={{ border: 'none', background: '#F1F3F7', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 17, color: '#6B7280' }}>×</button>
        </div>
      </div>
      <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input label="Full name" placeholder="Sofia de Vries" value={ship.name} onChange={set('name')} />
        <Input label="Address" placeholder="Prinsengracht 263" value={ship.address} onChange={set('address')} />
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}><Input label="Postcode" placeholder="1016 GV" value={ship.postcode} onChange={set('postcode')} /></div>
          <div style={{ flex: 1.4 }}><Input label="City" placeholder="Amsterdam" value={ship.city} onChange={set('city')} /></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #E5E7EB', borderRadius: 12, padding: '13px 14px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B4794" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
          {live ? (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#15233F' }}>Secure card payment</div>
              <div style={{ fontSize: 12, color: '#8A93A6' }}>Entered safely at payment · powered by Stripe</div>
            </div>
          ) : (
            <>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#15233F' }}>Visa ···· 4242</div>
                <div style={{ fontSize: 12, color: '#8A93A6' }}>Expires 09/28</div>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1B4794' }}>Change</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800, color: '#15233F', borderTop: '1px solid #F1F3F7', paddingTop: 14 }}><span>Total</span><span>{t.totalLabel}</span></div>
        {error && <div style={{ fontSize: 12.5, color: '#D92D20', fontWeight: 600 }}>{error}</div>}
        <button onClick={onPlaceOrder} disabled={busy} style={{ width: '100%', border: 'none', cursor: busy ? 'default' : 'pointer', background: '#FF7A59', color: '#fff', fontFamily: 'inherit', fontWeight: 800, fontSize: 15.5, padding: 15, borderRadius: 14, opacity: busy ? .7 : 1 }}>
          {busy ? 'Processing…' : `Place order · ${t.totalLabel}`}
        </button>
      </div>
    </div>
  );
}
