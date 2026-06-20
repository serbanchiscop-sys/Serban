/* Timeline tab — AI feed grouped by child, milestone card, reel banner, grids. */
import { useEffect, useState } from 'react';
import { useApp } from '../state/store';
import type { ChildId, Overlay } from '../state/store';
import { useAuth } from '../state/auth';
import { CHILDREN, G } from '../data/content';
import { Sparkle, SearchIcon, Play, Plus } from '../components/Icon';
import { runUpload } from '../services/photos';
import { pendingCount, processQueue, startAutoFlush } from '../services/uploadQueue';
import { listChildren } from '../services/family';
import { listMedia, type MediaRow } from '../services/storage';

const DEEP = '#1B4794';

export function Timeline() {
  const { state, open, setChild, openPhoto } = useApp();
  const { account, enabled } = useAuth();
  const household = account?.household ?? 'Sofia’s family';
  const notPremium = !state.premium;

  // Photo import — only surfaced when a backend is configured, so the offline
  // demo stays pixel-identical. Opens the multi-source Import sheet.
  const [pending, setPending] = useState(0);
  const canUpload = enabled && !!account?.familyId;

  // Real family data (children + library) for signed-in accounts.
  const [children, setChildren] = useState<{ id: string; name: string }[]>([]);
  const [media, setMedia] = useState<MediaRow[]>([]);

  // On mount (and when connectivity returns), drain any queued uploads.
  useEffect(() => {
    if (!canUpload) return;
    void (async () => { await processQueue(runUpload); setPending(await pendingCount()); })();
    return startAutoFlush(runUpload);
  }, [canUpload]);

  // Load this family's real children + media count.
  useEffect(() => {
    const fid = account?.familyId;
    if (!canUpload || !fid) return;
    void listChildren(fid).then(setChildren);
    void listMedia(fid).then(setMedia);
  }, [canUpload, account?.familyId, pending, state.mediaVersion]);

  // Signed-in accounts get a real-data Timeline; the offline demo keeps the
  // prototype content below, byte-for-byte.
  if (canUpload) {
    return (
      <RealTimeline household={household} childList={children} media={media}
        pending={pending} notPremium={notPremium} activeChild={state.child}
        onChild={setChild} onOpen={open}
        onPhoto={(m) => openPhoto({ id: m.id, url: m.url, childId: m.childId })} />
    );
  }

  return (
    <div style={{ padding: '6px 18px 26px' }}>
      {/* Greeting + assistant */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, color: '#8A93A6', fontWeight: 600 }}>Good morning</div>
          <div style={{ fontSize: 25, fontWeight: 800, color: '#15233F', letterSpacing: '-.03em', lineHeight: 1.1 }}>{household}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {canUpload && (
            <button onClick={() => open('import')} aria-label="Import photos"
              style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid #E5E7EB', cursor: 'pointer',
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)' }}>
              <Plus size={22} color="#1B4794" />
            </button>
          )}
          <button onClick={() => open('assistant')} style={{ width: 42, height: 42, borderRadius: '50%', border: 'none',
            cursor: 'pointer', background: 'linear-gradient(150deg,#4CA8E4,#1B4794)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 6px 16px rgba(27,71,148,.3)' }}>
            <Sparkle size={22} color="#fff" />
          </button>
        </div>
      </div>

      {/* Search shortcut */}
      <button onClick={() => open('assistant')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        background: '#fff', border: '1px solid #E9ECF2', borderRadius: 14, padding: '12px 14px', marginBottom: 18,
        cursor: 'pointer', boxShadow: 'var(--shadow-xs)', textAlign: 'left' }}>
        <SearchIcon size={18} color="#9AA3AF" />
        <span style={{ fontSize: 14, color: '#9AA3AF' }}>Ask “Show Roan’s first birthday”…</span>
      </button>

      {canUpload && pending > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#EEF6FF', borderRadius: 12,
          padding: '10px 13px', marginBottom: 16 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4CA8E4', animation: 'fmPulse 1.6s infinite' }} />
          <span style={{ fontSize: 12.5, color: '#1B4794', fontWeight: 600 }}>
            Uploading {pending} photo{pending > 1 ? 's' : ''}…
          </span>
        </div>
      )}

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

/* ---- Real-data Timeline (signed-in accounts) ---- */
function RealTimeline({
  household, childList, media, pending, notPremium, activeChild, onChild, onOpen, onPhoto,
}: {
  household: string;
  childList: { id: string; name: string }[];
  media: MediaRow[];
  pending: number;
  notPremium: boolean;
  activeChild: ChildId;
  onChild: (c: ChildId) => void;
  onOpen: (o: Overlay) => void;
  onPhoto: (m: MediaRow) => void;
}) {
  const chips = [{ id: 'all', label: 'All' }, ...childList.map((c) => ({ id: c.id, label: c.name }))];
  const empty = media.length === 0;
  const shown = activeChild === 'all' ? media : media.filter((m) => m.childId === activeChild);

  return (
    <div style={{ padding: '6px 18px 26px' }}>
      {/* Greeting + actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, color: '#8A93A6', fontWeight: 600 }}>Welcome back</div>
          <div style={{ fontSize: 25, fontWeight: 800, color: '#15233F', letterSpacing: '-.03em', lineHeight: 1.1 }}>{household}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => onOpen('import')} aria-label="Import photos"
            style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid #E5E7EB', cursor: 'pointer',
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)' }}>
            <Plus size={22} color="#1B4794" />
          </button>
          <button onClick={() => onOpen('assistant')} style={{ width: 42, height: 42, borderRadius: '50%', border: 'none',
            cursor: 'pointer', background: 'linear-gradient(150deg,#4CA8E4,#1B4794)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 6px 16px rgba(27,71,148,.3)' }}>
            <Sparkle size={22} color="#fff" />
          </button>
        </div>
      </div>

      {/* Ask the assistant */}
      <button onClick={() => onOpen('assistant')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        background: '#fff', border: '1px solid #E9ECF2', borderRadius: 14, padding: '12px 14px', marginBottom: 18,
        cursor: 'pointer', boxShadow: 'var(--shadow-xs)', textAlign: 'left' }}>
        <SearchIcon size={18} color="#9AA3AF" />
        <span style={{ fontSize: 14, color: '#9AA3AF' }}>Ask anything about your photos…</span>
      </button>

      {pending > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#EEF6FF', borderRadius: 12, padding: '10px 13px', marginBottom: 16 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4CA8E4', animation: 'fmPulse 1.6s infinite' }} />
          <span style={{ fontSize: 12.5, color: '#1B4794', fontWeight: 600 }}>Uploading {pending} photo{pending > 1 ? 's' : ''}…</span>
        </div>
      )}

      {/* Child chips (real children) */}
      {chips.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {chips.map((c) => {
            const on = activeChild === c.id;
            return (
              <button key={c.id} onClick={() => onChild(c.id)} style={{ border: '1px solid ' + (on ? DEEP : '#E5E7EB'),
                background: on ? DEEP : '#fff', color: on ? '#fff' : '#4B5563', fontFamily: 'inherit', fontWeight: 700,
                fontSize: 13, padding: '7px 16px', borderRadius: 'var(--radius-pill)', cursor: 'pointer' }}>
                {c.label}
              </button>
            );
          })}
        </div>
      )}

      {empty ? (
        /* Empty state — no photos yet */
        <div style={{ background: '#fff', border: '1px solid #EDF0F4', borderRadius: 20, padding: '30px 22px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, margin: '0 auto 16px', background: 'linear-gradient(150deg,#4CA8E4,#1B4794)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={30} color="#fff" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#15233F' }}>Start your family timeline</div>
          <div style={{ fontSize: 13.5, color: '#6B7280', marginTop: 8, lineHeight: 1.55 }}>
            Import photos from your phone, Google Drive, or a FamilyAlbum export. Our AI will organize them by child and find the milestones.
          </div>
          <button onClick={() => onOpen('import')} style={{ marginTop: 18, border: 'none', cursor: 'pointer', background: '#FF7A59', color: '#fff', fontFamily: 'inherit', fontWeight: 800, fontSize: 15, padding: '13px 22px', borderRadius: 14 }}>Import photos</button>
          {childList.length === 0 && (
            <div style={{ fontSize: 12, color: '#9AA3AF', marginTop: 14 }}>Tip: add your children in onboarding so photos can be grouped per child.</div>
          )}
        </div>
      ) : (
        /* Real photo library */
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 11 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#15233F', letterSpacing: '-.01em' }}>Your photos</div>
            <div style={{ fontSize: 13, color: '#8A93A6' }}>{media.length} in library</div>
          </div>
          {shown.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #EDF0F4', borderRadius: 16, padding: '22px', textAlign: 'center', color: '#8A93A6', fontSize: 13.5 }}>
              No photos for this child yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
              {shown.map((m) => (
                <button key={m.id} onClick={() => onPhoto(m)} style={{ aspectRatio: '1', borderRadius: 11, overflow: 'hidden', background: '#EEF1F6', border: 'none', padding: 0, cursor: 'pointer' }}>
                  {m.url && <img src={m.url} alt={m.caption ?? 'photo'} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Free-tier upsell (real premium gating) */}
      {notPremium && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F1F4F8', border: '1px dashed #CBD5E1', borderRadius: 14, padding: '12px 14px', marginTop: 18 }}>
          <div style={{ flex: 1, fontSize: 12.5, color: '#64748B', lineHeight: 1.4 }}>Free plan · 5 GB. Go Premium for unlimited storage, no ads, and 4K reels.</div>
          <button onClick={() => onOpen('paywall')} style={{ border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, color: '#1B4794', whiteSpace: 'nowrap' }}>Go Premium</button>
        </div>
      )}
    </div>
  );
}
