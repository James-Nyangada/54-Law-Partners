'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { RESOURCES } from '@/lib/resources';
import { normalise, writePath, toPayload } from '@/lib/forms';
import { useToast } from './Toast';
import { BilingualTabs } from './BilingualTabs';
import { ConfirmButton } from './ConfirmButton';
import { StatusBadge } from './Badges';
import { Button, Card, Empty, LinkButton, Notice, PanelTitle, Row, Spacer } from './ui';

/**
 * One editor screen, configured per resource.
 *
 * `resource.shared(ctx)` renders the fields that are the same in both
 * languages; `resource.translated(ctx, locale)` renders the ones that are not.
 */
export function ResourceForm({ resourceKey }) {
  const resource = RESOURCES[resourceKey];
  const { id } = useParams();
  const isNew = id === 'new';
  const router = useRouter();
  const { notify, warn } = useToast();
  const { isAdmin } = useAuth();

  const [form, setForm] = useState(() => resource.blank());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [lookups, setLookups] = useState({});

  // Reference lists for the relation fields — practice areas, authors.
  useEffect(() => {
    if (!resource.lookups) return;
    let cancelled = false;

    Promise.all(
      Object.entries(resource.lookups).map(async ([key, path]) => {
        const result = await api.get(path);
        return [key, result.items ?? []];
      })
    )
      .then((entries) => {
        if (!cancelled) setLookups(Object.fromEntries(entries));
      })
      .catch(() => {
        if (!cancelled) warn('Could not load the reference lists');
      });

    return () => {
      cancelled = true;
    };
  }, [resource.lookups, warn]);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;

    setLoading(true);
    api
      .get(`${resource.endpoint}/${id}`)
      .then((item) => {
        if (!cancelled) setForm(normalise(item));
      })
      .catch((loadError) => {
        if (cancelled) return;
        warn(loadError.message);
        router.push(resource.path);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isNew, resource.endpoint, resource.path, router, warn]);

  const set = useCallback((path, value) => {
    setForm((current) => writePath(current, path, value));
  }, []);

  const save = async (nextStatus) => {
    setSaving(true);
    setErrors({});

    const payload = toPayload(form);
    if (nextStatus) payload.status = nextStatus;

    try {
      const saved = isNew
        ? await api.post(resource.endpoint, payload)
        : await api.patch(`${resource.endpoint}/${id}`, payload);

      notify(nextStatus === 'published' ? `${resource.singular} published` : `${resource.singular} saved`);

      if (isNew) router.replace(`${resource.path}/${saved.id}`);
      else setForm(normalise(saved));
    } catch (saveError) {
      setErrors(saveError.details || {});
      warn(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await api.del(`${resource.endpoint}/${id}`);
      notify(`${resource.singular} deleted`);
      router.push(resource.path);
    } catch (deleteError) {
      warn(deleteError.message);
    }
  };

  if (loading) return <Empty>Loading…</Empty>;

  const ctx = { form, set, errors, lookups, isNew };
  const published = form.status === 'published';

  return (
    <div>
      <Row className="mb-[22px]">
        <LinkButton size="sm" href={resource.path}>
          ← {resource.plural}
        </LinkButton>
        {!isNew && <StatusBadge status={form.status} />}
        {form.slug && <span className="text-[13px] text-muted">/{form.slug}</span>}
        <Spacer />
        {!isNew && isAdmin && (
          <ConfirmButton
            onConfirm={remove}
            label={`Delete ${resource.singular.toLowerCase()}`}
            question="This removes it permanently."
          />
        )}
      </Row>

      {resource.notice && <Notice>{resource.notice}</Notice>}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <div className="grid items-start gap-[18px] lg:grid-cols-2">
          <Card>
            <PanelTitle>Content</PanelTitle>
            <BilingualTabs frenchReady={Boolean(form.fr?.title || form.fr?.name || form.fr?.description)}>
              {(locale) => resource.translated(ctx, locale)}
            </BilingualTabs>
          </Card>

          <Card>
            <PanelTitle>Details</PanelTitle>
            {resource.shared(ctx)}
          </Card>
        </div>

        <div className="sticky bottom-0 mt-[26px] flex flex-wrap justify-end gap-3 bg-onyx py-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : published ? 'Save changes' : 'Save draft'}
          </Button>

          {published ? (
            <Button disabled={saving} onClick={() => save('draft')}>
              Unpublish
            </Button>
          ) : (
            <Button variant="primary" disabled={saving} onClick={() => save('published')}>
              Publish
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
