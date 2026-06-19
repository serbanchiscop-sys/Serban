/* Search tab — natural-language search with chips or results grid. */
import { useApp } from '../state/store';
import { SEARCH_CHIPS, SEARCH_RESULT_IDX, G } from '../data/content';

export function Search() {
  const { state, setQuery, runSearch, clearSearch, open } = useApp();
  const results = SEARCH_RESULT_IDX.map((i, k) => ({ id: 'sr' + k, bg: G[i % G.length] }));

  return (
    <div style={{ padding: '6px 18px 26px' }}>
      <div style={{ fontSize: 25, fontWeight: 800, color: '#15233F', letterSpacing: '-.03em', marginBottom: 14 }}>Search</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #E9ECF2', borderRadius: 14, padding: '12px 14px', boxShadow: 'var(--shadow-xs)', marginBottom: 16 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AA3AF" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
        <input value={state.query} onChange={(e) => setQuery(e.target.value)} placeholder="Try a name, place or moment…" style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 14.5, color: '#15233F', background: 'transparent' }} />
        {state.searched && <button onClick={() => clearSearch()} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9AA3AF', fontSize: 18, lineHeight: 1 }}>×</button>}
      </div>

      {!state.searched && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8A93A6', marginBottom: 11 }}>Try asking</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SEARCH_CHIPS.map((label) => (
              <button key={label} onClick={() => runSearch(label)} style={{ border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontFamily: 'inherit', fontWeight: 600, fontSize: 13, padding: '8px 14px', borderRadius: 999, cursor: 'pointer', boxShadow: 'var(--shadow-xs)' }}>{label}</button>
            ))}
          </div>
          <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(150deg,#1B4794,#0E2A5C)', borderRadius: 16, padding: 15, color: '#fff' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9FD0F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9z" /></svg>
            <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5, color: 'rgba(255,255,255,.85)' }}>Search understands natural language — faces, places, dates and feelings.</div>
          </div>
        </>
      )}

      {state.searched && (
        <>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#15233F', letterSpacing: '-.01em' }}>{`Found 23 moments for “${state.query}”`}</div>
          <div style={{ fontSize: 12.5, color: '#8A93A6', margin: '3px 0 14px' }}>Roan · Oct 2025 — newest first</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 18 }}>
            {results.map((sr) => (
              <div key={sr.id} style={{ aspectRatio: '1', borderRadius: 11, background: sr.bg }} />
            ))}
          </div>
          <button onClick={() => open('assistant')} style={{ width: '100%', border: '1px solid #E5E7EB', background: '#fff', color: '#1B4794', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, padding: 13, borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: 'var(--shadow-xs)' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1B4794" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9z" /></svg>
            Ask the assistant about these
          </button>
        </>
      )}
    </div>
  );
}
