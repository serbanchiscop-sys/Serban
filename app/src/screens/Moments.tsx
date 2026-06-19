/* Moments tab — milestones list, memory reels scroller, memory books. */
import { useApp } from '../state/store';
import { MILESTONES, REELS, BOOKS } from '../data/content';
import { Badge } from '../components/Badge';

export function Moments() {
  const { open } = useApp();

  return (
    <div style={{ padding: '6px 18px 26px' }}>
      <div style={{ fontSize: 25, fontWeight: 800, color: '#15233F', letterSpacing: '-.03em', marginBottom: 4 }}>Moments</div>
      <div style={{ fontSize: 13.5, color: '#6B7280', marginBottom: 20 }}>Milestones, reels &amp; books — made for you.</div>

      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#4CA8E4', marginBottom: 12 }}>Milestones</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 26 }}>
        {MILESTONES.map((m) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 13, background: '#fff', border: '1px solid #EDF0F4', borderRadius: 15, padding: 12, boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: m.bg }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={m.path} /></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#15233F' }}>{m.title}</div>
              <div style={{ fontSize: 12.5, color: '#8A93A6', marginTop: 2 }}>{m.who} · {m.date}</div>
            </div>
            <Badge tone={m.toneTone} dot={m.isNew}>{m.toneLabel}</Badge>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#4CA8E4' }}>Memory reels</div>
        <span style={{ fontSize: 12.5, color: '#8A93A6' }}>Monthly · auto</span>
      </div>
      <div className="scr" style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '0 -18px 26px', padding: '0 18px 4px' }}>
        {REELS.map((r) => (
          <button key={r.id} onClick={() => open('reel')} style={{ flex: 'none', width: 140, border: 'none', cursor: 'pointer', background: 'none', padding: 0, textAlign: 'left' }}>
            <div style={{ position: 'relative', height: 184, borderRadius: 16, overflow: 'hidden', background: r.bg, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 45%,rgba(0,0,0,.5))' }} />
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#1B4794"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <div style={{ position: 'absolute', left: 10, bottom: 9, color: '#fff' }}>
                <div style={{ fontSize: 12.5, fontWeight: 800 }}>{r.month}</div>
                <div style={{ fontSize: 11, opacity: .85 }}>{r.dur}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#4CA8E4', marginBottom: 12 }}>Memory books</div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        {BOOKS.map((b) => (
          <div key={b.id} style={{ flex: 1, background: '#fff', border: '1px solid #EDF0F4', borderRadius: 15, padding: 11, boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ height: 96, borderRadius: 10, background: b.bg, marginBottom: 10, boxShadow: 'inset -8px 0 14px -8px rgba(0,0,0,.25)' }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: '#15233F' }}>{b.title}</div>
            <div style={{ fontSize: 12, color: '#8A93A6', marginTop: 2 }}>{b.sub}</div>
          </div>
        ))}
      </div>
      <button onClick={() => open('book')} style={{ width: '100%', border: '1.5px dashed #B9CCE8', background: '#F4F8FD', color: '#1B4794', fontFamily: 'inherit', fontWeight: 700, fontSize: 14.5, padding: 15, borderRadius: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1B4794" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        Create a new memory book
      </button>
    </div>
  );
}
