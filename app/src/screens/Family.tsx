/* Family tab — family circle, storage usage, premium upsell or active card. */
import { useEffect, useState } from 'react';
import { useApp } from '../state/store';
import { MEMBERS } from '../data/content';
import { getQuota, type Quota } from '../services/storage';

export function Family() {
  const { state, open } = useApp();

  // Live storage usage (demo fallback returns the design's 4.8 / 5 GB).
  const [quota, setQuota] = useState<Quota>({ usedGb: 4.8, totalGb: 5 });
  useEffect(() => { void getQuota(state.premium).then(setQuota); }, [state.premium]);
  const unlimited = quota.totalGb === 'unlimited';
  const totalGb = typeof quota.totalGb === 'number' ? quota.totalGb : 0;
  const pct = unlimited ? 14 : Math.min(100, Math.round((quota.usedGb / (totalGb || 1)) * 100));
  const nearFull = !unlimited && pct >= 90;
  const storageLabel = unlimited ? `${quota.usedGb} GB · Unlimited` : `${quota.usedGb} / ${quota.totalGb} GB`;

  return (
    <div style={{ padding: '6px 18px 26px' }}>
      <div style={{ fontSize: 25, fontWeight: 800, color: '#15233F', letterSpacing: '-.03em', marginBottom: 18 }}>Family</div>

      <div style={{ background: '#fff', border: '1px solid #EDF0F4', borderRadius: 18, padding: 16, boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#15233F' }}>Your family circle</div>
          <span style={{ fontSize: 12.5, color: '#8A93A6' }}>4 members</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {MEMBERS.map((u) => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 15, background: u.bg }}>{u.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#15233F' }}>{u.name}</div>
                <div style={{ fontSize: 12, color: '#8A93A6' }}>{u.role}</div>
              </div>
            </div>
          ))}
        </div>
        <button style={{ width: '100%', marginTop: 15, border: '1px solid #1B4794', background: '#fff', color: '#1B4794', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, padding: 12, borderRadius: 12, cursor: 'pointer' }}>Invite family member</button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #EDF0F4', borderRadius: 18, padding: 16, boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: '#15233F' }}>Storage</div>
          <div style={{ fontSize: 12.5, color: '#8A93A6' }}>{storageLabel}</div>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: '#EEF1F6', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: nearFull ? 'linear-gradient(90deg,#FF7A59,#F2613F)' : 'linear-gradient(90deg,#4CA8E4,#1B4794)' }} />
        </div>
        {nearFull && <div style={{ fontSize: 12.5, color: '#F2613F', marginTop: 9, fontWeight: 600 }}>Almost full — upgrade for unlimited storage.</div>}
      </div>

      {!state.premium && (
        <button onClick={() => open('paywall')} style={{ width: '100%', position: 'relative', border: 'none', cursor: 'pointer', borderRadius: 18, overflow: 'hidden', textAlign: 'left', padding: 18, background: 'linear-gradient(140deg,#FF9A6B,#F2613F)', color: '#fff', boxShadow: '0 14px 30px -12px rgba(242,97,63,.6)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .92 }}>Premium</div>
          <div style={{ fontSize: 19, fontWeight: 800, marginTop: 6, letterSpacing: '-.01em' }}>Unlimited memories, no ads</div>
          <div style={{ fontSize: 13, opacity: .92, marginTop: 4 }}>From €3.33 / month · 7-day free trial</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 13, background: 'rgba(255,255,255,.96)', color: '#F2613F', fontWeight: 800, fontSize: 13.5, padding: '9px 16px', borderRadius: 999 }}>Go Premium <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F2613F" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div>
        </button>
      )}
      {state.premium && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 18, padding: 16, background: 'linear-gradient(140deg,#1B4794,#0E2A5C)', color: '#fff' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>Premium active</div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.78)' }}>Unlimited storage · no ads · 4K reels</div>
          </div>
        </div>
      )}
    </div>
  );
}
