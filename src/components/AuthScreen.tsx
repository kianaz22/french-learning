import { useState } from 'react';
import { useAuth } from '../contexts/AuthProvider';

type Mode = 'signin' | 'signup';

export function AuthScreen() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, continueAsGuest, authConfigured } =
    useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);

    if (mode === 'signin') {
      const result = await signInWithEmail(email, password);
      if (result.error) setError(result.error);
    } else {
      const result = await signUpWithEmail(email, password);
      if (result.error) setError(result.error);
      else if (result.needsConfirmation) {
        setInfo('Check your email to confirm your account, then sign in.');
        setMode('signin');
      }
    }
    setBusy(false);
  };

  const google = async () => {
    setError(null);
    setBusy(true);
    const result = await signInWithGoogle();
    if (result.error) setError(result.error);
    setBusy(false);
  };

  if (!authConfigured) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <p className="auth-eyebrow">L&apos;Atelier Companion</p>
          <h1 className="auth-title">Cloud sync not configured</h1>
          <p className="auth-sub">
            Add your Supabase keys to <code>.env</code> to enable sign-in and sync. You can still
            use the app locally.
          </p>
          <button type="button" className="btn btn--primary btn--full" onClick={continueAsGuest}>
            Continue without account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <p className="auth-eyebrow">L&apos;Atelier Companion</p>
        <h1 className="auth-title">{mode === 'signin' ? 'Bon retour !' : 'Créer un compte'}</h1>
        <p className="auth-sub">
          Sign in to sync your progress across devices. Free with Supabase.
        </p>

        <form className="auth-form" onSubmit={submit}>
          <label className="auth-label">
            Email
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="vous@exemple.com"
            />
          </label>

          <label className="auth-label">
            Password
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {info && <p className="auth-info">{info}</p>}

          <button type="submit" className="btn btn--primary btn--full" disabled={busy}>
            {busy ? '…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button type="button" className="btn btn--secondary btn--full auth-google" onClick={google} disabled={busy}>
          Continue with Google
        </button>

        <p className="auth-switch">
          {mode === 'signin' ? (
            <>
              No account?{' '}
              <button type="button" className="auth-link" onClick={() => { setMode('signup'); setError(null); }}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="auth-link" onClick={() => { setMode('signin'); setError(null); }}>
                Sign in
              </button>
            </>
          )}
        </p>

        <button type="button" className="auth-guest" onClick={continueAsGuest}>
          Continue without account →
        </button>
      </div>
    </div>
  );
}
