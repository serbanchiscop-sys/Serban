/* Overlay container — renders the active overlay above a tappable backdrop.
 * Ported 1:1 from the prototype's `ov.any` wrapper (lines 393–611). */
import { useApp } from '../state/store';
import { ProductSheet } from './ProductSheet';
import { Cart } from './Cart';
import { Checkout } from './Checkout';
import { Confirm } from './Confirm';
import { MemoryBook } from './MemoryBook';
import { Story } from './Story';
import { Reel } from './Reel';
import { Paywall } from './Paywall';
import { Assistant } from './Assistant';
import { Invite } from './Invite';

export function Overlays() {
  const { state, close } = useApp();
  const overlay = state.overlay;
  if (!overlay) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
      <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'rgba(13,22,42,.5)', animation: 'fmFade .2s ease' }} />
      {overlay === 'product' && <ProductSheet />}
      {overlay === 'cart' && <Cart />}
      {overlay === 'checkout' && <Checkout />}
      {overlay === 'confirm' && <Confirm />}
      {overlay === 'book' && <MemoryBook />}
      {overlay === 'story' && <Story />}
      {overlay === 'reel' && <Reel />}
      {overlay === 'paywall' && <Paywall />}
      {overlay === 'assistant' && <Assistant />}
      {overlay === 'invite' && <Invite />}
    </div>
  );
}
