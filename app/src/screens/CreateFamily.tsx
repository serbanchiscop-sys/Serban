/* Onboarding — create your family. Shown once after first sign-in, before the
 * tab UI, when the signed-in user has no family yet. */
import { useState } from 'react';
import { useAuth } from '../state/auth';
import { createFamily, addChild } from '../services/family';
import { Input } from '../components/Input';
import { Heart, ArrowRight, Plus } from '../components/Icon';

export function CreateFamily() {
  const { refresh } = useAuth();
  const [name, setName] = useState('');
  const [kids, setKids] = useState<string[]>(['']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setKid = (i: number, v: string) => setKids((k) => k.map((x, j) => (j === i ? v : x)));
  const addKidField = () => setKids((k) => [...k, '']);

  const submit = async () => {
    if (!name.trim() || busy) return;
    setBusy(true); setError(null);
    const res = await createFamily(name.trim());
    if (!res.ok || !res.familyId) { setBusy(false); setError(res.error ?? 'Could not create family'); return; }
    for (const kid of kids.map((k) => k.trim()).filter(Boolean)) {
      await addChild(res.familyId, kid);
    }
    await refresh(); // moves the gate past onboarding into the app
  };

  return (
    <div className="scr" style={{ width: '100%', height: '100%', overflowY: 'auto', background: '#F4F6FA', padding: '24px 22px 28px' }}>
      <div style={{ width: 50, height: 50, borderRadius: 15, background: 'linear-gradient(150deg,#4CA8E4,#1B4794)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(27,71,148,.28)', marginBottom: 20 }}>
        <Heart size={27} color="#fff" />
      </div>
      <div style={{ fontSize: 25, fontWeight: 800, color: '#15233F', letterSpacing: '-.03em', lineHeight: 1.1 }}>Create your family</div>
      <div style={{ fontSize: 13.5, color: '#6B7280', marginTop: 8, lineHeight: 1.5 }}>
        This is your private space. You can invite parents and grandparents later.
      </div>

      <div style={{ marginTop: 22, background: '#fff', border: '1px solid #EDF0F4', borderRadius: 16, padding: 16, boxShadow: 'var(--shadow-sm)' }}>
        <Input label="Family name" placeholder="The de Vries family" value={name}
          onChange={(e) => setName(e.target.value)} error={error ?? undefined} />
        <div style={{ fontSize: 13, fontWeight: 600, color: '#15233F', margin: '16px 0 6px' }}>Children (optional)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {kids.map((k, i) => (
            <Input key={i} placeholder={`Child ${i + 1} name`} value={k} onChange={(e) => setKid(i, e.target.value)} />
          ))}
        </div>
        <button onClick={addKidField} style={{ marginTop: 10, border: 'none', background: 'none', cursor: 'pointer',
          color: '#1B4794', fontFamily: 'inherit', fontWeight: 700, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} color="#1B4794" /> Add another child
        </button>
      </div>

      <button onClick={submit} disabled={busy} style={{ width: '100%', marginTop: 18, border: 'none',
        cursor: busy ? 'default' : 'pointer', background: '#FF7A59', color: '#fff', fontFamily: 'inherit',
        fontWeight: 800, fontSize: 15.5, padding: 15, borderRadius: 14, opacity: busy ? .7 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {busy ? 'Creating…' : 'Create family'} <ArrowRight size={17} color="#fff" />
      </button>
    </div>
  );
}
