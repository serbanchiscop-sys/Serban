/* App state — the React replacement for the prototype's DCLogic class.
 * Reducer + context, with premium/cart/platform persisted across launches. */
import {
  createContext, useContext, useEffect, useReducer, useMemo, type ReactNode,
} from 'react';
import type { Product } from '../data/content';
import { detectPlatform, isNative, type Platform } from '../lib/platform';
import { loadJSON, saveJSON } from '../services/persistence';
import { askAssistant } from '../services/ai';
import { purchaseSubscription, restorePurchases, initBilling, type Plan } from '../services/purchases';

export type Tab = 'timeline' | 'moments' | 'search' | 'shop' | 'family';
export type Overlay =
  | null | 'product' | 'cart' | 'checkout' | 'confirm'
  | 'book' | 'story' | 'reel' | 'paywall' | 'assistant' | 'invite' | 'import';
/** 'all', a demo id ('roan'/'mila'), or a real child UUID. */
export type ChildId = string;

export type CartItem = { id: string; name: string; price: number; bg: string; qty: number };
export type ChatMsg = {
  role: 'ai' | 'user';
  text: string;
  photoIdx?: number[];
  actionKey?: 'book' | 'reel' | 'shop' | 'search' | null;
};

export type State = {
  platform: Platform;
  tab: Tab;
  child: ChildId;
  overlay: Overlay;
  plan: Plan;
  product: Product | null;
  pqty: number;
  cart: CartItem[];
  query: string;
  searched: boolean;
  orderNo: string;
  premium: boolean;
  chat: ChatMsg[];
  chatInput: string;
};

const GREETING: ChatMsg = {
  role: 'ai',
  text: "Hi Sofia. I'm your family memory assistant. Ask me anything — a moment, a child, a date — and I'll find it.",
};

const initialState: State = {
  platform: detectPlatform(),
  tab: 'timeline',
  child: 'all',
  overlay: null,
  plan: 'year',
  product: null,
  pqty: 1,
  cart: [],
  query: '',
  searched: false,
  orderNo: '',
  premium: false,
  chat: [GREETING],
  chatInput: '',
};

type Action =
  | { type: 'setPlatform'; platform: Platform }
  | { type: 'go'; tab: Tab }
  | { type: 'setChild'; child: ChildId }
  | { type: 'openOverlay'; overlay: Overlay }
  | { type: 'closeOverlay' }
  | { type: 'setPlan'; plan: Plan }
  | { type: 'setPremium'; premium: boolean }
  | { type: 'openProduct'; product: Product }
  | { type: 'setPqty'; delta: number }
  | { type: 'addToCart'; product: Product; qty: number }
  | { type: 'cartInc'; id: string; delta: number }
  | { type: 'placeOrder'; orderNo: string }
  | { type: 'setQuery'; query: string }
  | { type: 'runSearch'; query: string }
  | { type: 'clearSearch' }
  | { type: 'setChatInput'; value: string }
  | { type: 'pushChat'; messages: ChatMsg[] }
  | { type: 'hydrate'; patch: Partial<State> };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'setPlatform': return { ...s, platform: a.platform };
    case 'go': return { ...s, tab: a.tab, overlay: null };
    case 'setChild': return { ...s, child: a.child };
    case 'openOverlay': return { ...s, overlay: a.overlay };
    case 'closeOverlay': return { ...s, overlay: null };
    case 'setPlan': return { ...s, plan: a.plan };
    case 'setPremium': return { ...s, premium: a.premium, overlay: a.premium ? null : s.overlay };
    case 'openProduct': return { ...s, product: a.product, pqty: 1, overlay: 'product' };
    case 'setPqty': return { ...s, pqty: Math.max(1, s.pqty + a.delta) };
    case 'addToCart': {
      const cart = s.cart.map((x) => ({ ...x }));
      const i = cart.findIndex((x) => x.id === a.product.id);
      if (i >= 0) cart[i].qty += a.qty;
      else cart.push({ id: a.product.id, name: a.product.name, price: a.product.price, bg: a.product.bg, qty: a.qty });
      return { ...s, cart, overlay: 'cart' };
    }
    case 'cartInc': {
      let cart = s.cart.map((x) => ({ ...x }));
      const i = cart.findIndex((x) => x.id === a.id);
      if (i < 0) return s;
      cart[i].qty += a.delta;
      if (cart[i].qty <= 0) cart = cart.filter((x) => x.id !== a.id);
      return { ...s, cart };
    }
    case 'placeOrder': return { ...s, orderNo: a.orderNo, cart: [], overlay: 'confirm' };
    case 'setQuery': return { ...s, query: a.query };
    case 'runSearch': return { ...s, query: a.query, searched: true, tab: 'search', overlay: null };
    case 'clearSearch': return { ...s, query: '', searched: false };
    case 'setChatInput': return { ...s, chatInput: a.value };
    case 'pushChat': return { ...s, chat: [...s.chat, ...a.messages], chatInput: '' };
    case 'hydrate': return { ...s, ...a.patch };
    default: return s;
  }
}

/* ---- Context & action helpers ---- */

type Store = {
  state: State;
  go: (tab: Tab) => void;
  setChild: (child: ChildId) => void;
  setPlatform: (p: Platform) => void;
  open: (o: Overlay) => void;
  close: () => void;
  setPlan: (p: Plan) => void;
  openProduct: (p: Product) => void;
  setPqty: (delta: number) => void;
  addToCart: (p: Product, qty: number) => void;
  cartInc: (id: string, delta: number) => void;
  placeOrder: () => void;
  completeOrder: (orderNo: string) => void;
  setQuery: (q: string) => void;
  runSearch: (q: string) => void;
  clearSearch: () => void;
  setChatInput: (v: string) => void;
  sendChat: () => void;
  startTrial: () => void;
  restore: () => void;
};

const Ctx = createContext<Store | null>(null);

const PERSIST_KEYS = { premium: 'fm.premium', cart: 'fm.cart' };

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate persisted state on first mount.
  useEffect(() => {
    let alive = true;
    (async () => {
      const [premium, cart] = await Promise.all([
        loadJSON<boolean>(PERSIST_KEYS.premium, false),
        loadJSON<CartItem[]>(PERSIST_KEYS.cart, []),
      ]);
      if (alive) dispatch({ type: 'hydrate', patch: { premium, cart } });
      // On a configured native build, the store's entitlement is the source of
      // truth for Premium — reconcile it over the persisted value.
      const { premium: entitled } = await initBilling();
      if (alive && entitled) dispatch({ type: 'setPremium', premium: true });
    })();
    return () => { alive = false; };
  }, []);

  // Persist the bits worth remembering.
  useEffect(() => { void saveJSON(PERSIST_KEYS.premium, state.premium); }, [state.premium]);
  useEffect(() => { void saveJSON(PERSIST_KEYS.cart, state.cart); }, [state.cart]);

  const store = useMemo<Store>(() => ({
    state,
    go: (tab) => dispatch({ type: 'go', tab }),
    setChild: (child) => dispatch({ type: 'setChild', child }),
    setPlatform: (p) => dispatch({ type: 'setPlatform', platform: p }),
    open: (o) => dispatch({ type: 'openOverlay', overlay: o }),
    close: () => dispatch({ type: 'closeOverlay' }),
    setPlan: (p) => dispatch({ type: 'setPlan', plan: p }),
    openProduct: (p) => dispatch({ type: 'openProduct', product: p }),
    setPqty: (delta) => dispatch({ type: 'setPqty', delta }),
    addToCart: (p, qty) => dispatch({ type: 'addToCart', product: p, qty }),
    cartInc: (id, delta) => dispatch({ type: 'cartInc', id, delta }),
    placeOrder: () => dispatch({ type: 'placeOrder', orderNo: 'FM-' + Math.floor(100000 + Math.random() * 899999) }),
    completeOrder: (orderNo) => dispatch({ type: 'placeOrder', orderNo }),
    setQuery: (q) => dispatch({ type: 'setQuery', query: q }),
    runSearch: (q) => dispatch({ type: 'runSearch', query: q }),
    clearSearch: () => dispatch({ type: 'clearSearch' }),
    setChatInput: (v) => dispatch({ type: 'setChatInput', value: v }),
    sendChat: () => {
      const text = state.chatInput;
      if (!text || !text.trim()) return;
      dispatch({ type: 'pushChat', messages: [{ role: 'user', text }] });
      void askAssistant(text).then((r) =>
        dispatch({ type: 'pushChat', messages: [{ role: 'ai', text: r.text, photoIdx: r.photoIdx, actionKey: r.actionKey }] }),
      );
    },
    startTrial: () => {
      void purchaseSubscription(state.plan).then((res) => {
        if (res.success) dispatch({ type: 'setPremium', premium: true });
      });
    },
    restore: () => {
      void restorePurchases().then((res) => {
        if (res.premium) dispatch({ type: 'setPremium', premium: true });
      });
    },
  }), [state]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useApp(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used within AppProvider');
  return v;
}

export { isNative };
