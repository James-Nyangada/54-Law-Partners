import { Badge } from './ui';

export function StatusBadge({ status }) {
  if (!status) return null;
  return <Badge tone={status === 'published' ? 'published' : 'draft'}>{status}</Badge>;
}

export function TypeBadge({ type }) {
  if (type === 'external') return <Badge tone="external">External</Badge>;
  return <Badge>Firm</Badge>;
}

export function QueueBadge({ status }) {
  if (status === 'new') return <Badge tone="new">New</Badge>;
  return <Badge>{status}</Badge>;
}
