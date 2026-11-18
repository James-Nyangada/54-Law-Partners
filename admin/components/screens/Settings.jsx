'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { normalise, writePath } from '@/lib/forms';
import { useToast } from '../Toast';
import { BilingualTabs } from '../BilingualTabs';
import { TextField, TextArea, ListField } from '../fields';
import { Button, Card, Empty, PanelTitle, Row } from '../ui';

export function Settings() {
  const { notify, warn } = useToast();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/admin/settings')
      .then((data) => setForm(normalise(data)))
      .catch((error) => warn(error.message));
  }, [warn]);

  const set = (path, value) => setForm((current) => writePath(current, path, value));

  const save = async () => {
    setSaving(true);
    setErrors({});
    try {
      const saved = await api.put('/admin/settings', {
        firmName: form.firmName,
        addressLines: form.addressLines,
        phone: form.phone,
        email: form.email,
        notifyEmail: form.notifyEmail,
        social: form.social,
        en: form.en,
        fr: form.fr,
      });
      setForm(normalise(saved));
      notify('Settings saved');
    } catch (error) {
      setErrors(error.details || {});
      warn(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <Empty>Loading…</Empty>;

  return (
    <div className="grid items-start gap-[18px] lg:grid-cols-2">
      <Card>
        <PanelTitle>The firm</PanelTitle>
        <TextField label="Firm name" value={form.firmName} onChange={(value) => set('firmName', value)} />
        <ListField
          label="Address"
          value={form.addressLines}
          onChange={(value) => set('addressLines', value)}
          placeholder="A line of the address"
        />
        <TextField label="Telephone" value={form.phone} onChange={(value) => set('phone', value)} />
        <TextField
          label="Public email"
          type="email"
          value={form.email}
          onChange={(value) => set('email', value)}
          error={errors.email}
        />
        <TextField
          label="Notifications to"
          type="email"
          value={form.notifyEmail}
          onChange={(value) => set('notifyEmail', value)}
          error={errors.notifyEmail}
          hint="Where the firm is told that a new enquiry has arrived. Never shown on the site."
        />
      </Card>

      <Card>
        <PanelTitle>Notices</PanelTitle>
        <BilingualTabs frenchReady={Boolean(form.fr?.enquiryNotice)}>
          {(locale) => (
            <>
              <TextArea
                label="Enquiry form notice"
                value={form[locale]?.enquiryNotice}
                onChange={(value) => set(`${locale}.enquiryNotice`, value)}
                hint="Shown above the send button on the contact form. The firm supplies this wording."
              />
              <TextArea
                label="Practising details"
                value={form[locale]?.practisingDetails}
                onChange={(value) => set(`${locale}.practisingDetails`, value)}
                hint="Regulatory information shown in the footer."
              />
              <TextField
                label="Office hours"
                value={form[locale]?.officeHours}
                onChange={(value) => set(`${locale}.officeHours`, value)}
              />
            </>
          )}
        </BilingualTabs>

        <Row className="mt-5 justify-end">
          <Button variant="primary" disabled={saving} onClick={save}>
            {saving ? 'Saving…' : 'Save settings'}
          </Button>
        </Row>
      </Card>
    </div>
  );
}
