/* Timeline tab — AI feed grouped by child, milestone card, reel banner, grids. */
import { useApp } from '../state/store';
import { CHILDREN, G } from '../data/content';
import { Sparkle, SearchIcon, Play } from '../components/Icon';

const DEEP = '#1B4794';

export function Timeline() {
  const { state, open, setChild } = useApp();
  const notPremium = !state.premium;

  return (
    <div style={{ padding: '6px 18px 26px' }}>
      {/* Greeting + assistant */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, color: '#8A93A6', fontWeight: 600 }}>Good morning</div>
          <div style={{ fontSize: 25, fontWeight: 800, color: '#15233F', letterSpacing: '-.03em', lineHeight: 1.1 }}>Sofia’s family</div>
        </div>
        <button onClick={() => open('assistant')} style={{ width: 42, height: 42, borderRadius: '50%', border: 'none',
          cursor: 'pointer', background: 'linear-gradient(150deg,#4CA8E4,#1B4794)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 6px 16px rgba(27,71,148,.3)' }}>
          <Sparkle size={22} color="#fff" />
        </button>
      </div>

      {/* Search shortcut */}
      <button onClick={() => open('assistant')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        background: '#fff', border: '1px solid #E9ECF2', borderRadius: 14, padding: '12px 14px', marginBottom: 18,
        cursor: 'pointer', boxShadow: 'var(--shadow-xs)', textAlign: 'left' }}>
        <SearchIcon size={18} color="#9AA3AF" />
        <span style={{ fontSize: 14, color: '#9AA3AF' }}>Ask “Show Roan’s first birthday”…</span>
      </button>

      {/* AI status card */}
      <div style={{ position: 'relative', background: 'linear-gradient(155deg,#1B4794,#0E2A5C)', borderRadius: 20,
        padding: 18, color: '#fff', overflow: 'hidden', marginBottom: 16, boxShadow: '0 14px 30px -10px rgba(27,71,148,.5)' }}>
        <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', right: -50, top: -60,
          background: 'radial-gradient(circle,rgba(76,168,228,.55),transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, position: 'relative' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7CFFB2', animation: 'fmPulse 1.6s infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9FD0F2' }}>AI is organizing</span>
        </div>
        <div style={{ fontSize: 19, fontWeight: 800, marginTop: 10, letterSpacing: '-.02em', position: 'relative' }}>248 new photos sorted</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.78)', marginTop: 4, position: 'relative', lineHeight: 1.5 }}>Grouped by child, dated, and 3 milestones detected this week.</div>
      </div>

      {/* Child chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {CHILDREN.map((c) => {
          const active = state.child === c.id;
          return (
            <button key={c.id} onClick={() => setChild(c.id)} style={{ border: '1px solid ' + (active ? DEEP : '#E5E7EB'),
              background: active ? DEEP : '#fff', color: active ? '#fff' : '#4B5563', fontFamily: 'inherit', fontWeight: 700,
              fontSize: 13, padding: '7px 16px', borderRadius: 'var(--radius-pill)', cursor: 'pointer', transition: 'all .15s' }}>
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Milestone highlight */}
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#FF7A59', marginBottom: 10 }}>Milestone detected</div>
      <div style={{ display: 'flex', gap: 13, background: '#fff', border: '1px solid #F0E2DC', borderRadius: 18, padding: 13, marginBottom: 22, boxShadow: 'var(--shadow-sm)', alignItems: 'center' }}>
        <div style={{ width: 74, height: 74, borderRadius: 14, background: 'linear-gradient(135deg,#FFD3A5,#FD6585)', flex: 'none' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#15233F', letterSpacing: '-.01em' }}>Mila’s first steps</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>3 March 2026 · 8 clips</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button onClick={() => open('story')} style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, color: '#fff', background: '#FF7A59', padding: '7px 13px', borderRadius: 'var(--radius-pill)' }}>Make a story</button>
            <button style={{ border: '1px solid #E5E7EB', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, color: '#1B4794', background: '#fff', padding: '7px 13px', borderRadius: 'var(--radius-pill)' }}>Add to timeline</button>
          </div>
        </div>
      </div>

      {/* Reel banner */}
      <button onClick={() => open('reel')} style={{ width: '100%', position: 'relative', border: 'none', cursor: 'pointer',
        borderRadius: 18, overflow: 'hidden', padding: 0, marginBottom: 22, textAlign: 'left', display: 'block', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ height: 120, background: 'linear-gradient(135deg,#FFD3A5,#FD6585)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0) 30%,rgba(0,0,0,.55))' }} />
        <div style={{ position: 'absolute', left: 16, bottom: 14, color: '#fff' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', opacity: .9 }}>Your April reel is ready</div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.01em' }}>A month in 48 seconds</div>
        </div>
        <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 46, height: 46,
          borderRadius: '50%', background: 'rgba(255,255,255,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Play size={20} />
        </div>
      </button>

      {/* This week */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 11 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#15233F', letterSpacing: '-.01em' }}>This week</div>
        <div style={{ fontSize: 13, color: '#8A93A6' }}>Roan &amp; Mila</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 8 }}>
        <div style={{ gridColumn: 'span 2', gridRow: 'span 2', aspectRatio: '1', borderRadius: 14, background: G[1] }} />
        <div style={{ aspectRatio: '1', borderRadius: 11, background: G[0] }} />
        <div style={{ aspectRatio: '1', borderRadius: 11, background: G[3] }} />
        <div style={{ aspectRatio: '1', borderRadius: 11, background: G[7] }} />
        <div style={{ aspectRatio: '1', borderRadius: 11, background: G[5] }} />
        <div style={{ aspectRatio: '1', borderRadius: 11, background: G[6] }} />
      </div>

      {/* Free-tier ad slot */}
      {notPremium && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F1F4F8', border: '1px dashed #CBD5E1',
          borderRadius: 14, padding: '12px 14px', margin: '18px 0 8px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', border: '1px solid #CBD5E1', borderRadius: 5, padding: '2px 6px', letterSpacing: '.06em' }}>AD</div>
          <div style={{ flex: 1, fontSize: 12.5, color: '#64748B', lineHeight: 1.4 }}>Sponsored · Tidy nursery, tidy mind — 20% off storage boxes.</div>
          <button onClick={() => open('paywall')} style={{ border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, color: '#1B4794', whiteSpace: 'nowrap' }}>Remove ads</button>
        </div>
      )}

      {/* Earlier */}
      <div style={{ fontSize: 16, fontWeight: 800, color: '#15233F', letterSpacing: '-.01em', margin: '18px 0 11px' }}>March 2026</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
        {[10, 4, 8, 9, 2, 11].map((i, k) => (
          <div key={k} style={{ aspectRatio: '1', borderRadius: 11, background: G[i] }} />
        ))}
      </div>
    </div>
  );
}
