'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Card, Empty, LinkButton, LinkCard, PanelTitle, Row, Spacer } from '../ui';

/** The work queue, not analytics. What needs doing, and one button to publish. */
export function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/admin/summary').then(setData).catch((loadError) => setError(loadError.message));
  }, []);

  if (error) return <Empty>{error}</Empty>;
  if (!data) return <Empty>Loading…</Empty>;

  const { queue, counts, recent } = data;

  return (
    <div>
      <Row className="mb-[26px]">
        <div>
          <h2 className="text-[26px]">Good day, {user?.name?.split(' ')[0]}</h2>
          <p className="text-[13px] text-muted">Here is what is waiting.</p>
        </div>
        <Spacer />
        <LinkButton variant="primary" href="/insights/new">
          New article
        </LinkButton>
      </Row>

      <div className="mb-[26px] grid gap-[18px] sm:grid-cols-2 xl:grid-cols-3">
        <QueueTile href="/enquiries?status=new" value={queue.newEnquiries} label="New enquiries" />
        <QueueTile href="/applications?status=new" value={queue.newApplications} label="New applications" />
        <QueueTile href="/insights?status=draft" value={queue.drafts} label="Articles in draft" />
      </div>

      <div className="grid items-start gap-[18px] lg:grid-cols-2">
        <Card>
          <PanelTitle>Published</PanelTitle>
          <div className="grid grid-cols-2 gap-3.5">
            <Stat label="Articles" value={counts.published} />
            <Stat label="Practice areas" value={counts.areas} />
            <Stat label="Lawyers" value={counts.lawyers} />
            <Stat label="Matters" value={counts.matters} />
            <Stat label="Open roles" value={counts.openJobs} />
            <Stat label="Subscribers" value={counts.subscribers} />
          </div>
        </Card>

        <Card>
          <PanelTitle>Recent activity</PanelTitle>
          {recent?.length ? (
            <div className="flex flex-col">
              {recent.map((entry) => (
                <div key={entry.id} className="border-b border-line py-[11px] last:border-b-0">
                  <div className="text-[14.5px]">{entry.summary}</div>
                  <div className="text-[13px] text-muted">
                    {entry.user?.name || entry.userEmail || 'Someone'} · {new Date(entry.at).toLocaleString('en-GB')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-muted">Nothing yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

function QueueTile({ href, value, label }) {
  return (
    <LinkCard href={href}>
      <div className="font-display text-[40px] leading-none text-mint">{value}</div>
      <div className="mt-2.5 text-[11px] uppercase tracking-[0.14em] text-muted">{label}</div>
    </LinkCard>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="font-display text-[27px] text-bone">{value}</div>
      <div className="text-[13px] text-muted">{label}</div>
    </div>
  );
}
