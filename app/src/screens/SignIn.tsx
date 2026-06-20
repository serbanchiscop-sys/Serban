/* Sign-in gate — passwordless email magic link, in the brand style.
 * Shown only when an auth backend is configured and no one is signed in. */
import { useState } from 'react';
import { useAuth } from '../state/auth';
import { Input } from '../components/Input';
import { Heart, ArrowRight } from '../components/Icon';

export function SignIn() {
  const { signIn, verifyCode } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || busy) return;
    setBusy(true); setError(null);
    const res = await signIn(email.trim());
    setBusy(false);
    if (res.ok) setSent(true); else setError(res.error ?? 'Something went wrong');
  };

  const verify = async () => {
    if (!code.trim() || busy) return;
    setBusy(true); setError(null);
    const res = await verifyCode(email.trim(), code);
    setBusy(false);
    // On success the auth listener swaps to the app; on failure show the error.
    if (!res.ok) setError(res.error ?? 'That code didn’t work — try again');
  };

  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#1B4794,#0E2A5C)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 26px', color: '#fff' }}>
      <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', right: -70, top: -40,
        background: 'radial-gradient(circle,rgba(76,168,228,.5),transparent 70%)' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(150deg,#4CA8E4,#1B4794)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,.3)', marginBottom: 22 }}>
          <Heart size={30} color="#fff" />
        </div>
        <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1 }}>Welcome to<br />Family Moments AI</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,.8)', marginTop: 10, lineHeight: 1.5 }}>
          The AI memory book for families. Sign in to keep your moments safe and synced.
        </div>

        {!sent ? (
          <div style={{ marginTop: 28 }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: 14 }}>
              <Input label="Email" type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} error={error ?? undefined} />
            </div>
            <button onClick={submit} disabled={busy} style={{ width: '100%', marginTop: 14, border: 'none',
              cursor: busy ? 'default' : 'pointer', background: '#FF7A59', color: '#fff', fontFamily: 'inherit',
              fontWeight: 800, fontSize: 15.5, padding: 15, borderRadius: 14, opacity: busy ? .7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {busy ? 'Sending…' : 'Send sign-in code'} <ArrowRight size={17} color="#fff" />
            </button>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.6)', marginTop: 12, textAlign: 'center' }}>
              No password needed — we’ll email you a 6-digit code.
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 28 }}>
            <div style={{ background: 'rgba(255,255,255,.1)', borderRadius: 16, padding: 18, marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>Enter your code</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.82)', marginTop: 6, lineHeight: 1.5 }}>
                We emailed a 6-digit code to <strong>{email}</strong>. Enter it below to sign in.
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: 14 }}>
              <Input label="6-digit code" type="text" placeholder="123456" value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} error={error ?? undefined} />
            </div>
            <button onClick={verify} disabled={busy} style={{ width: '100%', marginTop: 14, border: 'none',
              cursor: busy ? 'default' : 'pointer', background: '#FF7A59', color: '#fff', fontFamily: 'inherit',
              fontWeight: 800, fontSize: 15.5, padding: 15, borderRadius: 14, opacity: busy ? .7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {busy ? 'Verifying…' : 'Verify & sign in'} <ArrowRight size={17} color="#fff" />
            </button>
            <button onClick={() => { setSent(false); setCode(''); setError(null); }} style={{ marginTop: 16, border: 'none',
              background: 'none', cursor: 'pointer', color: '#9FD0F2', fontFamily: 'inherit', fontWeight: 700, fontSize: 13.5,
              width: '100%', textAlign: 'center' }}>
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
