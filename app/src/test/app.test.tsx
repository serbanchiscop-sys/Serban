/* Smoke + flow tests — verify the ported app renders and the key journeys work
 * (navigation, print-shop add-to-cart → checkout, premium unlock removing ads). */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '../state/store';
import { AuthProvider } from '../state/auth';
import App from '../App';

function renderApp() {
  return render(
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('Family Moments AI', () => {
  it('renders the Timeline by default', () => {
    renderApp();
    expect(screen.getByText('Sofia’s family')).toBeInTheDocument();
    expect(screen.getByText('248 new photos sorted')).toBeInTheDocument();
    // Free tier shows the ad slot.
    expect(screen.getByText('AD')).toBeInTheDocument();
  });

  it('navigates between tabs', () => {
    renderApp();
    fireEvent.click(screen.getByText('Search'));
    expect(screen.getByPlaceholderText('Try a name, place or moment…')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Family'));
    expect(screen.getByText('Your family circle')).toBeInTheDocument();
  });

  it('runs the print-shop purchase flow to order confirmation', () => {
    renderApp();
    fireEvent.click(screen.getByText('Shop'));
    expect(screen.getByText('Print Shop')).toBeInTheDocument();

    // Open the featured product sheet and add it to the cart.
    fireEvent.click(screen.getByText('Your April reel → a photo book'));
    fireEvent.click(screen.getByText(/Add to cart/));

    // Cart shows, proceed to checkout then place the order.
    fireEvent.click(screen.getByText('Checkout'));
    fireEvent.click(screen.getByText(/Place order/));
    expect(screen.getByText('Order confirmed')).toBeInTheDocument();
    expect(screen.getByText(/^FM-\d{6}$/)).toBeInTheDocument();
  });

  it('in demo mode shows no sign-in gate or upload affordance', () => {
    renderApp();
    // No auth backend configured → app is usable directly, no "Add photos".
    expect(screen.getByText('248 new photos sorted')).toBeInTheDocument();
    expect(screen.queryByLabelText('Add photos')).not.toBeInTheDocument();
    // Storage meter renders the (demo) quota.
    fireEvent.click(screen.getByText('Family'));
    expect(screen.getByText('4.8 GB · Unlimited')).toBeInTheDocument();
  });

  it('unlocking premium removes the ad slot', async () => {
    renderApp();
    fireEvent.click(screen.getByText('Family'));
    fireEvent.click(screen.getByText('Go Premium'));
    // Apple requires a restore-purchases affordance on the paywall.
    expect(screen.getByText('Restore purchases')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Start 7-day free trial'));
    // Purchase is async (mock IAP); wait for the unlocked state.
    expect(await screen.findByText('Premium active')).toBeInTheDocument();
    // Back on the Timeline, the ad is gone.
    fireEvent.click(screen.getByText('Timeline'));
    expect(screen.queryByText('AD')).not.toBeInTheDocument();
  });
});
