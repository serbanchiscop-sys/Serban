/* Premium paywall. Storage is free & unlimited (the anchor); Premium unlocks
 * original-quality photos, longer videos, and 4K reels. After the user first
 * declines, a 7-day limited offer drops the first year to €14.99. */
import { useEffect, useState } from 'react';
import { useApp } from '../state/store';
import { INTRO_YEAR_PRICE } from '../services/purchases';
import { loadJSON, saveJSON } from '../services/persistence';

const SEEN_KEY = 'fm.paywallSeenAt';
const WEEK_MS = 7 * 24 * 3600 * 1000;

const FEATURES = [
  'Original-quality photos — no compression',
  'Longer videos — 2 minutes and beyond',
  '4K memory reels',
  'No ads, no watermarks',
  '15% off all prints & gifts',
];

export function Paywall() {
  const { state, close, setPlan, startTrial, restore } = useApp();
  const year = state.plan === 'year';

  // 7-day limited offer: active for the week after the user first sees (and
  // closes) the paywall.
  const [intro, setIntro] = useState<{ active: boolean; daysLeft: number }>({ active: false, daysLeft: 0 });
  useEffect(() => {
    void loadJSON<number | null>(SEEN_KEY, null).then((seen) => {
      if (seen == null) { void saveJSON(SEEN_KEY, Date.now()); return; } // first view → full price
      const left = WEEK_MS - (Date.now() - seen);
      if (left > 0) setIntro({ active: true, daysLeft: Math.max(1, Math.ceil(left / (24 * 3600 * 1000))) });
    });
  }, []);

  const yearPrice = intro.active ? INTRO_YEAR_PRICE : '€29.99';
  const yearSub = intro.active ? `Limited · ${intro.daysLeft}d left` : '€2.50 / mo';
  const planNote = year
    ? (intro.active ? `First year ${INTRO_YEAR_PRICE}, then €29.99/yr` : 'Billed yearly · €29.99')
    : 'Billed monthly · €3.99';

  return (
    <div className="scr" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '94%', overflowY: 'auto', background: '#fff', borderRadius: '26px 26px 0 0', animation: 'fmSlide .3s cubic-bezier(.16,1,.3,1)' }}>
      <div style={{ position: 'relative', padding: '26px 22px 18px', background: 'linear-gradient(150deg,#1B4794,#0E2A5C)', borderRadius: '26px 26px 0 0', color: '#fff', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', right: -60, top: -80, background: 'radial-gradient(circle,rgba(76,168,228,.5),transparent 70%)' }} />
        <button onClick={close} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'rgba(255,255,255,.18)', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', color: '#fff', fontSize: 17, zIndex: 2 }}>×</button>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(124,255,178,.18)', color: '#7CFFB2', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>
          ✓ Unlimited storage — always free
        </div>
        <div style={{ position: 'relative', fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', marginTop: 12, lineHeight: 1.15 }}>Your memories are safe.<br />Premium makes them shine.</div>
      </div>

      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 18 }}>
          {FEATURES.map((feat) => (
            <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#EAF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B4794" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
              </span>
              <span style={{ fontSize: 14, color: '#374151' }}>{feat}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 11, marginBottom: 16 }}>
          <button onClick={() => setPlan('year')} style={{ flex: 1, border: '2px solid ' + (year ? '#FF7A59' : '#E5E7EB'), background: year ? '#FFF1EC' : '#fff', borderRadius: 15, padding: '14px 12px', cursor: 'pointer', textAlign: 'left', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -9, left: 12, background: intro.active ? '#1F8A5B' : '#FF7A59', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, letterSpacing: '.04em' }}>{intro.active ? 'LIMITED OFFER' : 'SAVE 37%'}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Yearly</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#15233F', marginTop: 3 }}>{yearPrice}</div>
            <div style={{ fontSize: 11.5, color: intro.active ? '#1F8A5B' : '#8A93A6', fontWeight: intro.active ? 700 : 400 }}>{yearSub}</div>
          </button>
          <button onClick={() => setPlan('month')} style={{ flex: 1, border: '2px solid ' + (year ? '#E5E7EB' : '#FF7A59'), background: year ? '#fff' : '#FFF1EC', borderRadius: 15, padding: '14px 12px', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Monthly</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#15233F', marginTop: 3 }}>€3.99</div>
            <div style={{ fontSize: 11.5, color: '#8A93A6' }}>billed monthly</div>
          </button>
        </div>

        <button onClick={startTrial} style={{ width: '100%', border: 'none', cursor: 'pointer', background: '#FF7A59', color: '#fff', fontFamily: 'inherit', fontWeight: 800, fontSize: 15.5, padding: 16, borderRadius: 14 }}>Start 7-day free trial</button>
        <div style={{ textAlign: 'center', fontSize: 11.5, color: '#9AA3AF', marginTop: 10 }}>{planNote} · cancel anytime</div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button onClick={restore} style={{ border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, color: '#6B7280' }}>Restore purchases</button>
        </div>
      </div>
    </div>
  );
}
