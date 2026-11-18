'use client';

import { useState } from 'react';
import { Button } from './ui';

/**
 * A confirmation step built into the page.
 *
 * window.confirm() is blocked in some embedded contexts and returns false
 * without showing anything, which would silently cancel every delete.
 */
export function ConfirmButton({
  onConfirm,
  label = 'Delete',
  confirmLabel = 'Confirm',
  question = 'This cannot be undone.',
}) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!asking) {
    return (
      <Button variant="danger" size="sm" onClick={() => setAsking(true)}>
        {label}
      </Button>
    );
  }

  return (
    <span className="flex flex-wrap items-center gap-3">
      <span className="text-[13px] text-muted">{question}</span>
      <Button
        variant="danger"
        size="sm"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onConfirm();
          } finally {
            setBusy(false);
            setAsking(false);
          }
        }}
      >
        {busy ? 'Working…' : confirmLabel}
      </Button>
      <Button size="sm" onClick={() => setAsking(false)}>
        Cancel
      </Button>
    </span>
  );
}
