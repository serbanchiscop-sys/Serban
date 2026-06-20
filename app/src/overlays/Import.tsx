/* Import overlay — bring photos in from the device (iCloud), Google Drive, or
 * files exported from other apps (e.g. FamilyAlbum). Imported photos are queued
 * for upload to the family library. */
import { useState } from 'react';
import { useApp } from '../state/store';
import { useAuth } from '../state/auth';
import { listSources, importFrom, type SourceId } from '../services/importers';
import { queueImported, runUpload } from '../services/photos';
import { processQueue } from '../services/uploadQueue';

export function Import() {
  const { state, close } = useApp();
  const { account } = useAuth();
  const sources = listSources();
  const [busy, setBusy] = useState<SourceId | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const pick = async (id: SourceId) => {
    if (busy) return;
    setBusy(id); setDone(null);
    const photos = await importFrom(id);
    const familyId = account?.familyId ?? null;
    const childId = state.child === 'all' ? null : state.child;
    const queued = familyId ? await queueImported(familyId, childId, photos) : 0;
    if (queued > 0) void processQueue(runUpload);
    setBusy(null);
    setDone(photos.length === 0 ? 'Nothing selected.' : queued > 0 ? `Importing ${queued} photo${queued > 1 ? 's' : ''}…` : 'Connect this source to import for real.');
  };

  return (
    <div className="scr" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '90%', overflowY: 'auto', background: '#fff', borderRadius: '26px 26px 0 0', animation: 'fmSlide .3s cubic-bezier(.16,1,.3,1)' }}>
      <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '16px 18px 12px', borderBottom: '1px solid #F1F3F7' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: '#15233F' }}>Import photos</div>
          <button onClick={close} style={{ border: 'none', background: '#F1F3F7', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 17, color: '#6B7280' }}>×</button>
        </div>
        <div style={{ fontSize: 13, color: '#8A93A6', marginTop: 4 }}>Add to your family timeline from anywhere.</div>
      </div>
      <div style={{ padding: '12px 18px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sources.map((s) => (
          <button key={s.id} onClick={() => pick(s.id)} disabled={busy !== null} style={{ display: 'flex', alignItems: 'center', gap: 13,
            background: '#fff', border: '1px solid #E9ECF2', borderRadius: 14, padding: '13px 14px', cursor: busy ? 'default' : 'pointer',
            textAlign: 'left', boxShadow: 'var(--shadow-xs)', opacity: busy && busy !== s.id ? .5 : 1 }}>
            <span style={{ width: 40, height: 40, borderRadius: 11, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: SOURCE_BG[s.id] }}>{SOURCE_ICON[s.id]}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 14.5, fontWeight: 700, color: '#15233F' }}>{s.label}</span>
              <span style={{ display: 'block', fontSize: 12.5, color: '#8A93A6' }}>{s.hint}</span>
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1B4794' }}>{busy === s.id ? '…' : 'Choose'}</span>
          </button>
        ))}
        {done && <div style={{ fontSize: 13, color: '#1B4794', fontWeight: 600, textAlign: 'center', marginTop: 4 }}>{done}</div>}
        <div style={{ fontSize: 11.5, color: '#9AA3AF', lineHeight: 1.5, marginTop: 4 }}>
          FamilyAlbum has no direct connection — export your photos from FamilyAlbum to your device, then use <strong>Files</strong>.
        </div>
      </div>
    </div>
  );
}

const SOURCE_BG: Record<SourceId, string> = {
  device: 'linear-gradient(135deg,#A1C4FD,#C2E9FB)',
  gdrive: 'linear-gradient(135deg,#FFE29F,#FFA17F)',
  files: 'linear-gradient(135deg,#84FAB0,#8FD3F4)',
};

const ico = (d: string) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15233F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d.split('|').map((p, i) => <path key={i} d={p} />)}</svg>
);
const SOURCE_ICON: Record<SourceId, ReturnType<typeof ico>> = {
  device: ico('M3 6h18v12H3z|M3 15l5-5 4 4 3-3 6 6'),
  gdrive: ico('M8 3h8l4 7-4 7H8l-4-7z'),
  files: ico('M4 5h6l2 2h8v11H4z'),
};
