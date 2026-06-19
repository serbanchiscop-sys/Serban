/* Derived values shared across screens/overlays. */
import { eur } from '../data/content';
import type { CartItem } from './store';

export function cartTotals(cart: CartItem[]) {
  const subtotal = cart.reduce((a, x) => a + x.price * x.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shipping;
  const count = cart.reduce((a, x) => a + x.qty, 0);
  return {
    subtotal, shipping, total, count,
    subtotalLabel: eur(subtotal),
    shippingLabel: shipping === 0 ? 'Free' : eur(shipping),
    totalLabel: eur(total),
    items: cart.map((x) => ({ ...x, lineLabel: eur(x.price * x.qty), qtyLabel: String(x.qty) })),
  };
}
