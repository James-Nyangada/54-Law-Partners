'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useQueryParams } from '@/lib/useQueryParams';
import { useToast } from '../Toast';
import { QueueBadge } from '../Badges';
import { ConfirmButton } from '../ConfirmButton';
import { Pagination } from '../DataTable';
import { Button, Card, Empty, Notice, PanelTitle, Row, Spacer, cx, inputClass, labelClass } from '../ui';

const STATUSES = ['new', 'read', 'replied', 'archived'];

/**
 * Enquiries are read and triaged here, never replied to.
 *
 * Replies go from the firm's own email so that correspondence with a
 * prospective client sits in the firm's records, not in a website database.
 */
export function Enquiries() {
  const params = useQueryParams();
  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0 });
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const { notify, warn } = useToast();
  const { isAdmin } = useAuth();

  const page = params.get('page', '1');
  const status = params.get('status');

  const load = useCallback(async () => {
    const query = new URLSearchParams({ page });
    if (status) query.set('status', status);

    try {
      setData(await api.get(`/admin/enquiries?${query}`));
    } catch (error) {
      warn(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, status, warn]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const openEnquiry = async (id) => {
    try {
      setOpen(await api.get(`/admin/enquiries/${id}`));
      load(); // opening marks it read
    } catch (error) {
      warn(error.message);
    }
  };

  const setStatus = async (id, next) => {
    try {
      setOpen(await api.patch(`/admin/enquiries/${id}`, { status: next }));
      notify(`Marked ${next}`);
      load();
    } catch (error) {
      warn(error.message);
    }
  };

  const remove = async (id) => {
    try {
      await api.del(`/admin/enquiries/${id}`);
      setOpen(null);
      notify('Enquiry deleted');
      load();
    } catch (error) {
      warn(error.message);
    }
  };

  return (
    <div>
      <Notice>
        Reply from the firm&apos;s own email, not from here, so correspondence stays in the firm&apos;s
        records. Nothing in this system is ever sent to the person who wrote in.
      </Notice>

      <Row className="mb-5">
        <select
          className={inputClass({ className: 'max-w-[180px]' })}
          value={status}
          onChange={(event) => params.set('status', event.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All</option>
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <Spacer />
        <span className="text-[13px] text-muted">{data.total} total</span>
      </Row>

      <div className="grid items-start gap-[18px] lg:grid-cols-2">
        <div>
          {loading && <Empty>Loading…</Empty>}
          {!loading && !data.items.length && <Empty>No enquiries yet.</Empty>}

          {!loading &&
            data.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cx(
                  'mb-2.5 block w-full cursor-pointer rounded-xs border bg-panel p-[22px] text-left text-bone transition-colors hover:border-line-raised',
                  open?.id === item.id ? 'border-mint' : 'border-line'
                )}
                onClick={() => openEnquiry(item.id)}
              >
                <Row className="mb-1.5">
                  <strong className="text-bone">{item.name}</strong>
                  <QueueBadge status={item.status} />
                  {item.dueForDeletion && <span className="text-[12px] text-warning">Past retention period</span>}
                  <Spacer />
                  <span className="text-[13px] text-muted">{new Date(item.createdAt).toLocaleDateString('en-GB')}</span>
                </Row>
                <div className="text-[13px] text-muted">
                  {item.organisation ? `${item.organisation} · ` : ''}
                  {item.areaOfLaw || 'No area given'}
                </div>
              </button>
            ))}

          <Pagination page={data.page} pages={data.pages} onChange={(next) => params.set('page', String(next))} />
        </div>

        <Card className="lg:sticky lg:top-[90px]">
          {!open && <p className="text-[13px] text-muted">Choose an enquiry to read it.</p>}

          {open && (
            <>
              <PanelTitle>Enquiry</PanelTitle>
              <h3 className="mb-1 text-[22px]">{open.name}</h3>
              <p className="mb-[18px] text-[13px] text-muted">
                {new Date(open.createdAt).toLocaleString('en-GB')} · {open.locale?.toUpperCase()}
              </p>

              <Detail label="Email" value={<a href={`mailto:${open.email}`}>{open.email}</a>} />
              <Detail label="Telephone" value={open.phone} />
              <Detail label="Organisation" value={open.organisation} />
              <Detail label="Area of law" value={open.areaOfLaw} />

              <div className="my-[18px]">
                <span className={labelClass}>Message</span>
                <p className="mt-2 whitespace-pre-wrap leading-[1.7]">{open.message}</p>
              </div>

              <Row className="mt-5">
                {STATUSES.filter((value) => value !== open.status).map((value) => (
                  <Button key={value} size="sm" onClick={() => setStatus(open.id, value)}>
                    Mark {value}
                  </Button>
                ))}
              </Row>

              {isAdmin && (
                <div className="mt-[18px] border-t border-line pt-[18px]">
                  <ConfirmButton onConfirm={() => remove(open.id)} label="Delete enquiry" question="This removes it permanently." />
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-4 border-b border-line py-2">
      <span className="w-[120px] flex-none text-[13px] text-muted">{label}</span>
      <span className="text-[13px]">{value}</span>
    </div>
  );
}
