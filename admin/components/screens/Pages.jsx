'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { normalise, writePath } from '@/lib/forms';
import { useToast } from '../Toast';
import { BilingualTabs } from '../BilingualTabs';
import { TextField, TextArea } from '../fields';
import { StatusBadge } from '../Badges';
import { Button, Card, Empty, LinkButton, LinkCard, Notice, PanelTitle, Row, Spacer } from '../ui';

const PAGES = [
  { key: 'about', label: 'About us' },
  { key: 'careers', label: 'Careers introduction' },
  { key: 'privacy', label: 'Privacy policy' },
  { key: 'disclaimer', label: 'Disclaimer' },
  { key: 'terms', label: 'Terms of use' },
  { key: 'cookies', label: 'Cookie notice' },
];

export function PagesList() {
  const [items, setItems] = useState([]);
  const { warn } = useToast();

  useEffect(() => {
    api
      .get('/admin/pages')
      .then((data) => setItems(data.items ?? []))
      .catch((error) => warn(error.message));
  }, [warn]);

  const byKey = Object.fromEntries(items.map((item) => [item.key, item]));

  return (
    <div>
      <Notice>
        The legal notices are the firm&apos;s text. Afringe does not write them, and they should be
        reviewed by the firm before anything is published.
      </Notice>

      <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-3">
        {PAGES.map((page) => {
          const record = byKey[page.key];
          return (
            <LinkCard key={page.key} href={`/pages/${page.key}`}>
              <Row className="mb-2">
                <strong className="text-bone">{page.label}</strong>
                <Spacer />
                <StatusBadge status={record?.status} />
              </Row>
              <p className="text-[13px] text-muted">
                {record?.updatedAt
                  ? `Updated ${new Date(record.updatedAt).toLocaleDateString('en-GB')}`
                  : 'Not written yet'}
              </p>
            </LinkCard>
          );
        })}
      </div>
    </div>
  );
}

export function PageEditor() {
  const { key } = useParams();
  const { notify, warn } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const label = PAGES.find((page) => page.key === key)?.label;

  useEffect(() => {
    if (!label) return;
    api
      .get(`/admin/pages/${key}`)
      .then((data) => setForm(normalise(data)))
      .catch((error) => warn(error.message));
  }, [key, label, warn]);

  const set = (path, value) => setForm((current) => writePath(current, path, value));

  const save = async (status) => {
    setSaving(true);
    try {
      const saved = await api.put(`/admin/pages/${key}`, {
        status: status || form.status,
        en: form.en,
        fr: form.fr,
      });
      setForm(normalise(saved));
      notify(status === 'published' ? 'Page published' : 'Page saved');
    } catch (error) {
      warn(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!label) return <Empty>There is no page called “{key}”.</Empty>;
  if (!form) return <Empty>Loading…</Empty>;

  const published = form.status === 'published';

  return (
    <div>
      <Row className="mb-[22px]">
        <LinkButton size="sm" href="/pages">
          ← Pages
        </LinkButton>
        <StatusBadge status={form.status} />
      </Row>

      <Card className="max-w-[820px]">
        <PanelTitle>{label}</PanelTitle>
        <BilingualTabs frenchReady={Boolean(form.fr?.title)}>
          {(locale) => (
            <>
              <TextField label="Title" value={form[locale]?.title} onChange={(value) => set(`${locale}.title`, value)} />
              <TextArea
                label="Body"
                tall
                value={form[locale]?.body}
                onChange={(value) => set(`${locale}.body`, value)}
                hint="HTML is accepted."
              />
              <TextField label="SEO title" value={form[locale]?.seoTitle} onChange={(value) => set(`${locale}.seoTitle`, value)} />
              <TextArea
                label="SEO description"
                value={form[locale]?.seoDescription}
                onChange={(value) => set(`${locale}.seoDescription`, value)}
              />
            </>
          )}
        </BilingualTabs>

        <Row className="mt-5 justify-end">
          <Button disabled={saving} onClick={() => save()}>
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
        </Row>
      </Card>
    </div>
  );
}
