'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useQueryParams } from '@/lib/useQueryParams';
import { useToast } from '../Toast';
import { QueueBadge } from '../Badges';
import { ConfirmButton } from '../ConfirmButton';
import { Pagination } from '../DataTable';
import { Button, Card, Empty, Notice, Row, Spacer, inputClass } from '../ui';

const STATUSES = ['new', 'shortlisted', 'rejected', 'archived'];

export function Applications() {
  const params = useQueryParams();
  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const { notify, warn } = useToast();
  const { isAdmin } = useAuth();

  const page = params.get('page', '1');
  const status = params.get('status');

  const load = useCallback(async () => {
    const query = new URLSearchParams({ page });
    if (status) query.set('status', status);

    try {
      setData(await api.get(`/admin/applications?${query}`));
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

  /**
   * CVs are private assets. The backend mints a signed link valid for ten
   * minutes rather than exposing a permanent public URL. The tab is opened
   * before the request so pop-up blockers treat it as a direct click.
   */
  const openCv = async (id) => {
    const tab = window.open('', '_blank');
    try {
      const { url } = await api.get(`/admin/applications/${id}/cv`);
      if (tab) {
        tab.opener = null;
        tab.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch (error) {
      tab?.close();
      warn(error.message);
    }
  };

  const setStatus = async (id, next) => {
    try {
      await api.patch(`/admin/applications/${id}`, { status: next });
      notify(`Marked ${next}`);
      load();
    } catch (error) {
      warn(error.message);
    }
  };

  const remove = async (id) => {
    try {
      await api.del(`/admin/applications/${id}`);
      notify('Application deleted');
      load();
    } catch (error) {
      warn(error.message);
    }
  };

  return (
    <div>
      <Notice>
        CVs open through a link that expires after ten minutes. Download what you need rather than
        sharing the link.
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

      {loading && <Empty>Loading…</Empty>}
      {!loading && !data.items.length && <Empty>No applications yet.</Empty>}

      {!loading &&
        data.items.map((item) => (
          <Card key={item.id} className="mb-3">
            <Row className="mb-2">
              <strong className="text-bone">{item.name}</strong>
              <QueueBadge status={item.status} />
              <span className="text-[13px] text-muted">{item.job?.en?.title || 'Speculative'}</span>
              {item.dueForDeletion && <span className="text-[12px] text-warning">Past retention period</span>}
              <Spacer />
              <span className="text-[13px] text-muted">{new Date(item.createdAt).toLocaleDateString('en-GB')}</span>
            </Row>

            <div className="mb-3 text-[13px] text-muted">
              <a href={`mailto:${item.email}`}>{item.email}</a>
              {item.phone ? ` · ${item.phone}` : ''}
            </div>

            {item.coverNote && <p className="mb-3.5 whitespace-pre-wrap text-[14.5px]">{item.coverNote}</p>}

            <Row>
              {item.cv?.publicId && (
                <Button size="sm" onClick={() => openCv(item.id)}>
                  Open CV
                </Button>
              )}
              {STATUSES.filter((value) => value !== item.status).map((value) => (
                <Button key={value} size="sm" onClick={() => setStatus(item.id, value)}>
                  {value}
                </Button>
              ))}
              {isAdmin && (
                <>
                  <Spacer />
                  <ConfirmButton onConfirm={() => remove(item.id)} label="Delete" question="Remove this application and its record?" />
                </>
              )}
            </Row>
          </Card>
        ))}

      <Pagination page={data.page} pages={data.pages} onChange={(next) => params.set('page', String(next))} />
    </div>
  );
}
