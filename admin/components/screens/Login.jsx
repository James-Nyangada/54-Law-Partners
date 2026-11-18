'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, safeNext } from '@/lib/auth';
import { Button, Card, Notice, inputClass, labelClass, errorClass } from '../ui';

export function Login() {
  const { user, checking, signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get('next'));
  const passwordChanged = searchParams.get('changed') === '1';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  // Already signed in (a reload with a live refresh cookie): go straight on.
  useEffect(() => {
    if (!checking && user) router.replace(next);
  }, [checking, user, next, router]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await signIn(email, password);
      router.replace(next);
    } catch (signInError) {
      setError(signInError.message);
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card as="form" className="w-full max-w-[400px]" onSubmit={submit}>
        <h1 className="mb-1.5 text-[26px]">54 Law Partners</h1>
        <p className="mb-[26px] text-[13px] text-muted">Publishing dashboard</p>

        {passwordChanged && <Notice>Your password has been changed. Sign in with the new one.</Notice>}

        <label className="mb-5 flex flex-col gap-[7px]">
          <span className={labelClass}>Email</span>
          <input
            className={inputClass()}
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="mb-5 flex flex-col gap-[7px]">
          <span className={labelClass}>Password</span>
          <input
            className={inputClass()}
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error && <p className={`${errorClass} mb-4`}>{error}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </Card>
    </div>
  );
}
