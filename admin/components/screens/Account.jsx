'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button, Card, Notice, PanelTitle, inputClass, labelClass, hintClass, errorClass } from '../ui';

/**
 * Change your own password. The API retires every session when the password
 * changes — this one included — so the person signs in again afterwards.
 */
export function Account() {
  const { user, signOut } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirm) {
      setError('The two new passwords do not match.');
      return;
    }

    setBusy(true);
    try {
      await api.post('/admin/auth/password', { currentPassword, newPassword });
      await signOut('/login?changed=1');
    } catch (changeError) {
      setError(changeError.details?.newPassword || changeError.message);
      setBusy(false);
    }
  };

  const field = (id, label, value, onChange, autoComplete, hint) => (
    <div className="mb-5 flex flex-col gap-[7px]">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        className={inputClass()}
        type="password"
        required
        autoComplete={autoComplete}
        aria-describedby={hint ? `${id}-hint` : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && (
        <span id={`${id}-hint`} className={hintClass}>
          {hint}
        </span>
      )}
    </div>
  );

  return (
    <div className="max-w-[520px]">
      <Notice>
        Signed in as <strong className="text-bone">{user?.email}</strong> ({user?.role}).
      </Notice>

      <Card as="form" onSubmit={submit}>
        <PanelTitle>Change your password</PanelTitle>
        {field('current-password', 'Current password', currentPassword, setCurrentPassword, 'current-password')}
        {field('new-password', 'New password', newPassword, setNewPassword, 'new-password', 'At least 12 characters.')}
        {field('confirm-password', 'New password, again', confirm, setConfirm, 'new-password')}

        {error && <p className={`${errorClass} mb-4`}>{error}</p>}

        <Button type="submit" variant="primary" disabled={busy}>
          {busy ? 'Changing…' : 'Change password'}
        </Button>
        <p className={`${hintClass} mt-3`}>You will be signed out everywhere and asked to sign in again.</p>
      </Card>
    </div>
  );
}
