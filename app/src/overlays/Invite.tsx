/* Invite overlay — invite a parent or grandparent by email; returns a share code. */
import { useState } from 'react';
import { useApp } from '../state/store';
import { useAuth } from '../state/auth';
import { createInvite, type InviteRole } from '../services/family';
import { Input } from '../components/Input';

export function Invite() {
  const { close } = useApp();
  const { account } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<InviteRole>('grandparent');
  const [code, setCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!email.trim() || busy || !account?.familyId) return;
    setBusy(true); setError(null);
    const res = await createInvite(account.familyId, email.trim(), role);
    setBusy(false);
    if (res.ok && res.code) setCode(res.code); else setError(res.error ?? 'Could not create invite');
  };

  const roleBtn = (r: InviteRole, label: string) => (
    <button onClick={() => setRole(r)} style={{ flex: 1, border: '2px solid ' + (role === r ? '#FF7A59' : '#E5E7EB'),
      background: role === r ? '#FFF1EC' : '#fff', borderRadius: 12, padding: '10px 12px', cursor: 'pointer',
      fontFamily: 'inherit', fontWeight: 700, fontSize: 13.5, color: '#15233F' }}>{label}</button>
  );

  return (
    <div className="scr" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '90%', overflowY: 'auto',
      background: '#fff', borderRadius: '26px 26px 0 0', animation: 'fmSlide .3s cubic-bezier(.16,1,.3,1)' }}>
      <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '16px 18px 12px', borderBottom: '1px solid #F1F3F7' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: '#15233F' }}>Invite family</div>
          <button onClick={close} style={{ border: 'none', background: '#F1F3F7', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 17, color: '#6B7280' }}>×</button>
        </div>
      </div>
      <div style={{ padding: '16px 18px 22px' }}>
        {!code ? (
          <>
            <Input label="Their email" type="email" placeholder="oma@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} error={error ?? undefined} />
            <div style={{ fontSize: 13, fontWeight: 600, color: '#15233F', margin: '16px 0 6px' }}>Role</div>
            <div style={{ display: 'flex', gap: 10 }}>{roleBtn('parent', 'Parent')}{roleBtn('grandparent', 'Grandparent')}</div>
            <button onClick={submit} disabled={busy} style={{ width: '100%', marginTop: 18, border: 'none',
              cursor: busy ? 'default' : 'pointer', background: '#1B4794', color: '#fff', fontFamily: 'inherit',
              fontWeight: 800, fontSize: 15.5, padding: 15, borderRadius: 14, opacity: busy ? .7 : 1 }}>
              {busy ? 'Creating…' : 'Create invite'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#15233F' }}>Invite ready</div>
            <div style={{ fontSize: 13.5, color: '#6B7280', marginTop: 6, lineHeight: 1.5 }}>
              Share this code with <strong>{email}</strong>. They enter it after signing in to join your family.
            </div>
            <div style={{ margin: '18px 0', background: '#F4F6FA', border: '1px dashed #B9CCE8', borderRadius: 12, padding: 16,
              fontSize: 22, fontWeight: 800, letterSpacing: '.12em', color: '#1B4794' }}>{code}</div>
            <button onClick={close} style={{ width: '100%', border: 'none', cursor: 'pointer', background: '#FF7A59', color: '#fff',
              fontFamily: 'inherit', fontWeight: 800, fontSize: 15, padding: 14, borderRadius: 14 }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
