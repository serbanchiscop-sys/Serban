/* Photo viewer + child tagging. Tap a photo → assign it to a child. These
 * labels are the reference faces that seed automatic recognition. */
import { useEffect, useState } from 'react';
import { useApp } from '../state/store';
import { useAuth } from '../state/auth';
import { listChildren } from '../services/family';
import { assignMediaChild } from '../services/storage';

export function Photo() {
  const { state, close, bumpMedia } = useApp();
  const { account } = useAuth();
  const photo = state.photo;
  const [kids, setKids] = useState<{ id: string; name: string }[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (account?.familyId) void listChildren(account.familyId).then(setKids);
  }, [account?.familyId]);

  if (!photo) return null;

  const assign = async (childId: string | null) => {
    if (busy) return;
    setBusy(childId ?? 'none');
    await assignMediaChild(photo.id, childId);
    bumpMedia();   // tells the Timeline to refetch
    close();
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#0B1424' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 14px' }}>
        <button onClick={close} style={{ border: 'none', background: 'rgba(255,255,255,.15)', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', color: '#fff', fontSize: 18 }}>×</button>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0 14px' }}>
        {photo.url && <img src={photo.url} alt="" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 14, objectFit: 'contain' }} />}
      </div>
      <div style={{ background: '#fff', borderRadius: '22px 22px 0 0', padding: '18px 18px 24px' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#15233F' }}>Who’s in this photo?</div>
        <div style={{ fontSize: 12.5, color: '#8A93A6', marginTop: 3 }}>Tagging helps the AI learn each child’s face and auto-sort new photos.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {kids.length === 0 && <div style={{ fontSize: 13, color: '#8A93A6' }}>Add children in onboarding to tag photos.</div>}
          {kids.map((c) => {
            const on = photo.childId === c.id;
            return (
              <button key={c.id} onClick={() => assign(c.id)} disabled={busy !== null} style={{
                border: '1.5px solid ' + (on ? '#1B4794' : '#E5E7EB'), background: on ? '#1B4794' : '#fff',
                color: on ? '#fff' : '#15233F', fontFamily: 'inherit', fontWeight: 700, fontSize: 14,
                padding: '9px 18px', borderRadius: 'var(--radius-pill)', cursor: 'pointer' }}>
                {busy === c.id ? '…' : c.name}
              </button>
            );
          })}
          {photo.childId && (
            <button onClick={() => assign(null)} disabled={busy !== null} style={{
              border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontFamily: 'inherit',
              fontWeight: 700, fontSize: 14, padding: '9px 18px', borderRadius: 'var(--radius-pill)', cursor: 'pointer' }}>
              Unassign
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
