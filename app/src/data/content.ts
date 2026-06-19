/* Content & sample data — mirrors the prototype's datasets exactly.
 * In production these come from services/ (ai, storage). Today they are the
 * same placeholder gradients/records the design shipped, so the UI is identical. */

/** The prototype's `G` gradient palette — index-stable; many screens key off it. */
export const G = [
  'linear-gradient(135deg,#FBC2A4,#F7797D)',
  'linear-gradient(135deg,#A1C4FD,#C2E9FB)',
  'linear-gradient(135deg,#FAD0C4,#FFD1FF)',
  'linear-gradient(135deg,#FFE29F,#FFA17F)',
  'linear-gradient(135deg,#B5C6E0,#86A8E7)',
  'linear-gradient(135deg,#F6D365,#FDA085)',
  'linear-gradient(135deg,#84FAB0,#8FD3F4)',
  'linear-gradient(135deg,#E0C3FC,#8EC5FC)',
  'linear-gradient(135deg,#FFD3A5,#FD6585)',
  'linear-gradient(135deg,#C2FFD8,#465EFB)',
  'linear-gradient(135deg,#FCCB90,#D57EEB)',
  'linear-gradient(135deg,#F5F7B2,#4ABDAC)',
] as const;

export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  desc: string;
  bg: string;
  featured?: boolean;
};

export const PRODUCTS: Product[] = [
  { id: 'prints', name: 'Photo Prints', price: 0.19, unit: '/ photo', desc: 'Glossy or matte · 10×15 cm', bg: G[0] },
  { id: 'book', name: 'Hardcover Photo Book', price: 29.99, unit: '', desc: 'AI-designed · 24 pages', bg: G[3], featured: true },
  { id: 'canvas', name: 'Canvas Print', price: 39.99, unit: '', desc: 'Gallery wrap · 40×40 cm', bg: G[7] },
  { id: 'calendar', name: 'Wall Calendar', price: 19.99, unit: '', desc: '12 months · A3', bg: G[5] },
  { id: 'mug', name: 'Photo Mug', price: 14.99, unit: '', desc: 'Dishwasher safe · 325 ml', bg: G[1] },
  { id: 'cards', name: 'Greeting Cards', price: 12.99, unit: '/ 10', desc: 'Folded · with envelopes', bg: G[10] },
];

/** The featured "book" product, used by reel/book overlays. */
export const FEATURED_PRODUCT = PRODUCTS[1];

/* Milestone glyph paths (single-path Lucide-style icons from the prototype) */
export const ICON = {
  FLAG: 'M5 3v18M5 4h11l-2 4 2 4H5',
  CAKE: 'M4 21h16M5 21v-7h14v7M7 14v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M12 8V5',
  TOOTH: 'M12 4c-3 0-5 2-5 5 0 4 1.6 11 3 11 1.1 0 1-4 2-4s.9 4 2 4c1.4 0 3-7 3-11 0-3-2-5-5-5Z',
  SCHOOL: 'M3 9l9-5 9 5-9 5-9-5Zm4 3v4c0 1.2 3 2.5 5 2.5s5-1.3 5-2.5v-4',
  SUN: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6 7 7M17 17l1.4 1.4',
} as const;

export type Milestone = {
  id: string;
  path: string;
  title: string;
  who: string;
  date: string;
  tone: 'new' | 'done';
  bg: string;
  isNew: boolean;
  toneLabel: string;
  toneTone: 'success' | 'neutral';
};

const RAW_MILESTONES = [
  { id: 'm1', path: ICON.FLAG, title: 'First steps', who: 'Mila', date: 'Mar 2026', tone: 'new' as const },
  { id: 'm2', path: ICON.TOOTH, title: 'Lost first tooth', who: 'Roan', date: 'Feb 2026', tone: 'new' as const },
  { id: 'm3', path: ICON.CAKE, title: 'First birthday', who: 'Mila', date: 'Oct 2025', tone: 'done' as const },
  { id: 'm4', path: ICON.SCHOOL, title: 'First day of school', who: 'Roan', date: 'Sep 2025', tone: 'done' as const },
  { id: 'm5', path: ICON.SUN, title: 'Summer in Portugal', who: 'Family', date: 'Aug 2025', tone: 'done' as const },
];

export const MILESTONES: Milestone[] = RAW_MILESTONES.map((m, i) => ({
  ...m,
  bg: G[(i * 2) % G.length],
  isNew: m.tone === 'new',
  toneLabel: m.tone === 'new' ? 'Detected' : 'In timeline',
  toneTone: m.tone === 'new' ? 'success' : 'neutral',
}));

export type Reel = { id: string; month: string; dur: string; bg: string; ready: boolean };
export const REELS: Reel[] = [
  { id: 'r1', month: 'April 2026', dur: '0:48', bg: G[8], ready: true },
  { id: 'r2', month: 'March 2026', dur: '1:02', bg: G[4], ready: false },
  { id: 'r3', month: 'February 2026', dur: '0:54', bg: G[11], ready: false },
];

export type Book = { id: string; title: string; sub: string; bg: string };
export const BOOKS: Book[] = [
  { id: 'b1', title: 'Roan — Year One', sub: '32 pages · Printed', bg: G[3] },
  { id: 'b2', title: 'Our 2025', sub: '48 pages · Digital', bg: G[7] },
];

export type Member = { id: string; name: string; role: string; initials: string; bg: string; you: boolean };
export const MEMBERS: Member[] = [
  { id: 'u1', name: 'Sofia', role: 'You · Admin', initials: 'S', bg: G[0], you: true },
  { id: 'u2', name: 'Daan', role: 'Parent', initials: 'D', bg: G[4], you: false },
  { id: 'u3', name: 'Oma Riet', role: 'Grandparent', initials: 'R', bg: G[2], you: false },
  { id: 'u4', name: 'Opa Joop', role: 'Grandparent', initials: 'J', bg: G[5], you: false },
];

export const CHILDREN = [
  { id: 'all', label: 'All' },
  { id: 'roan', label: 'Roan' },
  { id: 'mila', label: 'Mila' },
] as const;

export const SEARCH_CHIPS = [
  'Roan’s first birthday',
  'Beach days',
  'Just Mila',
  'Christmas 2025',
  'Everyone smiling',
];

export const SEARCH_RESULT_IDX = [0, 3, 8, 5, 1, 6, 9, 2, 10];

export const eur = (n: number) => '€' + n.toFixed(2);
