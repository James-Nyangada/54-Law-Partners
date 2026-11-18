'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '../Toast';
import { ConfirmButton } from '../ConfirmButton';
import { DataTable } from '../DataTable';
import { Badge, Button, Card, PanelTitle, Row, Spacer, inputClass, labelClass, hintClass } from '../ui';

const BLANK = { name: '', email: '', password: '', role: 'editor' };

export function Users() {
  const { user: current } = useAuth();
  const { notify, warn } = useToast();
  const [items, setItems] = useState([]);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(BLANK);

  const load = useCallback(() => {
    api
      .get('/admin/users')
      .then((data) => setItems(data.items ?? []))
      .catch((error) => warn(error.message));
  }, [warn]);

  useEffect(load, [load]);

  const create = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/users', draft);
      notify('Account created');
      setDraft(BLANK);
      setCreating(false);
      load();
    } catch (error) {
      warn(error.message);
    }
  };

  const update = async (id, patch, message) => {
    try {
      await api.patch(`/admin/users/${id}`, patch);
      notify(message);
      load();
      return true;
    } catch (error) {
      warn(error.message);
      return false;
    }
  };

  const remove = async (id) => {
    try {
      await api.del(`/admin/users/${id}`);
      notify('Account deleted');
      load();
    } catch (error) {
      warn(error.message);
    }
  };

  const columns = [
    { key: 'name', header: 'Name', strong: true },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', width: 110, render: (row) => <Badge>{row.role}</Badge> },
    {
      key: 'isActive',
      header: 'Status',
      width: 110,
      render: (row) => (row.isActive ? <Badge tone="published">Active</Badge> : <Badge tone="draft">Disabled</Badge>),
    },
    {
      key: 'lastLoginAt',
      header: 'Last signed in',
      width: 170,
      render: (row) =>
        row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString('en-GB') : <span className="text-muted">Never</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (row) =>
        row.id === current?.id ? (
          <span className="text-[13px] text-muted">You</span>
        ) : (
          <Row>
            <Button
              size="sm"
              onClick={() => update(row.id, { isActive: !row.isActive }, row.isActive ? 'Account disabled' : 'Account enabled')}
            >
              {row.isActive ? 'Disable' : 'Enable'}
            </Button>
            <ResetPassword onSave={(password) => update(row.id, { password }, 'Password reset')} />
            <ConfirmButton onConfirm={() => remove(row.id)} label="Delete" question="Remove this account?" />
          </Row>
        ),
    },
  ];

  return (
    <div>
      <Row className="mb-5">
        <Spacer />
        <Button variant="primary" onClick={() => setCreating((value) => !value)}>
          {creating ? 'Cancel' : 'New account'}
        </Button>
      </Row>

      {creating && (
        <Card as="form" className="mb-5 max-w-[520px]" onSubmit={create}>
          <PanelTitle>New account</PanelTitle>

          <label className="mb-5 flex flex-col gap-[7px]">
            <span className={labelClass}>Name</span>
            <input
              className={inputClass()}
              required
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            />
          </label>

          <label className="mb-5 flex flex-col gap-[7px]">
            <span className={labelClass}>Email</span>
            <input
              className={inputClass()}
              type="email"
              required
              value={draft.email}
              onChange={(event) => setDraft({ ...draft, email: event.target.value })}
            />
          </label>

          <div className="mb-5 flex flex-col gap-[7px]">
            <label htmlFor="new-user-password" className={labelClass}>
              Temporary password
            </label>
            <input
              id="new-user-password"
              className={inputClass()}
              type="text"
              required
              minLength={12}
              autoComplete="off"
              aria-describedby="new-user-password-hint"
              value={draft.password}
              onChange={(event) => setDraft({ ...draft, password: event.target.value })}
            />
            <span id="new-user-password-hint" className={hintClass}>
              At least 12 characters. Send it to them another way, and ask them to change it under
              “Your account” after their first sign-in.
            </span>
          </div>

          <label className="mb-5 flex flex-col gap-[7px]">
            <span className={labelClass}>Role</span>
            <select
              className={inputClass()}
              value={draft.role}
              onChange={(event) => setDraft({ ...draft, role: event.target.value })}
            >
              <option value="editor">Editor — publishes content</option>
              <option value="admin">Administrator — everything, including settings</option>
            </select>
          </label>

          <Button type="submit" variant="primary">
            Create account
          </Button>
        </Card>
      )}

      <DataTable columns={columns} rows={items} emptyMessage="No accounts yet." />
    </div>
  );
}

/** Sets a new temporary password. Signs that person out everywhere. */
function ResetPassword({ onSave }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        Reset password
      </Button>
    );
  }

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        const ok = await onSave(password);
        setBusy(false);
        if (ok) {
          setPassword('');
          setOpen(false);
        }
      }}
    >
      <input
        className={inputClass({ className: 'max-w-[200px] px-2.5 py-1.5 text-[13px]' })}
        type="text"
        autoComplete="off"
        placeholder="New temporary password"
        minLength={12}
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        aria-label="New temporary password"
      />
      <Button type="submit" size="sm" variant="primary" disabled={busy}>
        Save
      </Button>
      <Button size="sm" onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </form>
  );
}
