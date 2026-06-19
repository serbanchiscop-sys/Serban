/* AI story bottom overlay — ported 1:1 from the prototype (lines 503–515). */
import { useApp } from '../state/store';

export function Story() {
  const { close, open } = useApp();

  return (
    <div className="scr" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '90%', overflowY: 'auto', background: '#fff', borderRadius: '26px 26px 0 0', animation: 'fmSlide .3s cubic-bezier(.16,1,.3,1)' }}>
      <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '16px 18px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#4CA8E4' }}>AI story</div>
          <button onClick={close} style={{ border: 'none', background: '#F1F3F7', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 17, color: '#6B7280' }}>×</button>
        </div>
      </div>
      <div style={{ padding: '4px 18px 22px' }}>
        <div style={{ height: 170, borderRadius: 16, background: 'linear-gradient(135deg,#FFD3A5,#FD6585)', marginBottom: 16 }} />
        <div style={{ fontSize: 21, fontWeight: 800, color: '#15233F', letterSpacing: '-.02em' }}>The day Mila walked</div>
        <div style={{ fontSize: 12.5, color: '#8A93A6', margin: '4px 0 14px' }}>Generated from 8 photos · 3 March 2026</div>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#374151', margin: '0 0 12px' }}>It was a grey Tuesday afternoon when Mila let go of the sofa. One wobbly step, then two — arms out like a tiny tightrope walker, eyes fixed on Roan’s outstretched hands.</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#374151', margin: 0 }}>By the third step the whole room was cheering. She sat down with a triumphant thud and looked up, as if to say: <em>did you all see that?</em> We did, Mila. We always will.</p>
        <button onClick={() => open('book')} style={{ width: '100%', marginTop: 20, border: 'none', cursor: 'pointer', background: '#1B4794', color: '#fff', fontFamily: 'inherit', fontWeight: 800, fontSize: 15, padding: 14, borderRadius: 14 }}>Add to memory book</button>
      </div>
    </div>
  );
}
