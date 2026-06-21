/* Family assistant full-screen chat overlay — ported 1:1 (lines 574–608). */
import { useApp, greetingText } from '../state/store';
import { useAuth } from '../state/auth';
import { G, SEARCH_CHIPS } from '../data/content';

const ACTION_LABELS = {
  book: 'Create memory book',
  reel: 'Play reel',
  shop: 'Open Print Shop',
  search: 'Open Search',
} as const;

export function Assistant() {
  const { state, close, open, go, runSearch, setChatInput, sendChat } = useApp();
  const { account } = useAuth();
  const firstName = account?.name ? account.name.charAt(0).toUpperCase() + account.name.slice(1) : undefined;

  const actionHandler = (key: 'book' | 'reel' | 'shop' | 'search') => {
    switch (key) {
      case 'book': return () => open('book');
      case 'reel': return () => open('reel');
      case 'shop': return () => go('shop');
      case 'search': return () => go('search');
    }
  };

  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, background: '#F4F6FA', animation: 'fmSlide .3s cubic-bezier(.16,1,.3,1)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 'none', background: '#fff', borderBottom: '1px solid #ECEFF3', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(150deg,#4CA8E4,#1B4794)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9z" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#15233F' }}>Family assistant</div>
          <div style={{ fontSize: 11.5, color: '#1F8A5B', fontWeight: 600 }}>Online</div>
        </div>
        <button onClick={close} style={{ border: 'none', background: '#F1F3F7', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 17, color: '#6B7280' }}>×</button>
      </div>

      <div className="scr" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {state.chat.map((m, k) => {
          const isUser = m.role === 'user';
          // The opening greeting is personalised with the signed-in name.
          const text = k === 0 && m.role === 'ai' ? greetingText(firstName) : m.text;
          return (
            <div key={k} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', background: isUser ? '#1B4794' : '#fff', color: isUser ? '#fff' : '#1F2937', border: '1px solid ' + (isUser ? '#1B4794' : '#E9ECF2'), borderRadius: 18, padding: '11px 14px', fontSize: 14, lineHeight: 1.5, boxShadow: 'var(--shadow-xs)' }}>
                <div>{text}</div>
                {!!m.photoIdx?.length && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 9 }}>
                    {m.photoIdx.map((i, j) => (
                      <div key={j} style={{ width: 52, height: 52, borderRadius: 9, background: G[i % G.length], flex: 'none' }} />
                    ))}
                  </div>
                )}
                {m.actionKey && (
                  <button onClick={actionHandler(m.actionKey)} style={{ marginTop: 10, border: 'none', cursor: 'pointer', background: '#FF7A59', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: 12.5, padding: '8px 13px', borderRadius: 999 }}>{ACTION_LABELS[m.actionKey]}</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ flex: 'none', padding: '10px 14px 8px', background: '#F4F6FA' }}>
        <div className="scr" style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 9, paddingBottom: 2 }}>
          {SEARCH_CHIPS.map((label) => (
            <button key={label} onClick={() => runSearch(label)} style={{ flex: 'none', border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontFamily: 'inherit', fontWeight: 600, fontSize: 12.5, padding: '7px 13px', borderRadius: 999, cursor: 'pointer', whiteSpace: 'nowrap' }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 'none', background: '#fff', borderTop: '1px solid #ECEFF3', padding: '11px 14px 14px', display: 'flex', alignItems: 'center', gap: 9 }}>
        <input value={state.chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask about a moment…" style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 999, padding: '11px 16px', fontFamily: 'inherit', fontSize: 14, outline: 'none', color: '#15233F' }} />
        <button onClick={sendChat} style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', cursor: 'pointer', background: '#1B4794', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /></svg>
        </button>
      </div>
    </div>
  );
}
