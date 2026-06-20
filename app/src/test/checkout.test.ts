/* Print-shop checkout — offline/mock path (no Stripe or backend in tests). */
import { describe, it, expect } from 'vitest';
import { runCheckout, checkoutEnabled } from '../services/checkout';
import type { CartItem } from '../state/store';

const cart: CartItem[] = [{ id: 'canvas', name: 'Canvas Print', price: 39.99, bg: '', qty: 1 }];
const shipping = { name: 'Sofia', address: 'Prinsengracht 263', postcode: '1016 GV', city: 'Amsterdam' };

describe('checkout (offline fallback)', () => {
  it('is not enabled without Stripe/backend config', () => {
    expect(checkoutEnabled()).toBe(false);
  });

  it('returns a realistic order number via the mock path', async () => {
    const res = await runCheckout('demo-family', cart, 3999, shipping);
    expect(res.ok).toBe(true);
    expect(res.orderNo).toMatch(/^FM-\d{6}$/);
  });
});
