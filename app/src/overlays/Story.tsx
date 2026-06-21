/* AI story bottom overlay — preview of the feature. TODO: wire to the user's
 * own selected photos + child via generateStory() once that flow exists. */
import { useApp } from '../state/store';

const STORY = {
  title: 'First steps',
  paragraphs: [
    'On a bright morning, a little one pulled up, wobbled, and let go — three whole steps across the living room before a triumphant tumble into the cushions.',
    'There were giggles, a little surprise, and a lot of clapping. A tiny moment that felt enormous — the first of so many to come.',
  ],
};

export function Story() {
  const { close, open } = useApp();
  const story = STORY;

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
        <div style={{ fontSize: 21, fontWeight: 800, color: '#15233F', letterSpacing: '-.02em' }}>{story.title}</div>
        <div style={{ fontSize: 12.5, color: '#8A93A6', margin: '4px 0 14px' }}>AI-written from your photos</div>
        {story.paragraphs.map((p, i) => (
          <p key={i} style={{ fontSize: 15, lineHeight: 1.7, color: '#374151', margin: i === 0 ? '0 0 12px' : 0 }}>{p}</p>
        ))}
        <button onClick={() => open('book')} style={{ width: '100%', marginTop: 20, border: 'none', cursor: 'pointer', background: '#1B4794', color: '#fff', fontFamily: 'inherit', fontWeight: 800, fontSize: 15, padding: 14, borderRadius: 14 }}>Add to memory book</button>
      </div>
    </div>
  );
}
