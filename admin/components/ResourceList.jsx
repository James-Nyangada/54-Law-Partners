'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { RESOURCES } from '@/lib/resources';
import { useQueryParams } from '@/lib/useQueryParams';
import { DataTable, Pagination } from './DataTable';
import { useToast } from './Toast';
import { Empty, LinkButton, Notice, Row, Spacer, inputClass } from './ui';

/**
 * One list screen, configured per resource.
 *
 * Articles, practice areas, lawyers, matters and jobs all behave the same way
 * here: search, filter, paginate, link into an editor. Writing five of these
 * would be five places for the same bug.
 *
 * Takes the resource's key rather than the config itself, because the route
 * files are server components and cannot pass the config's render functions.
 */
export function ResourceList({ resourceKey }) {
  const resource = RESOURCES[resourceKey];
  const params = useQueryParams();
  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { warn } = useToast();

  const page = params.get('page', '1');
  const q = params.get('q');
  const status = params.get('status');
  const extra = resource.filterParam ? params.get(resource.filterParam) : '';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const query = new URLSearchParams({ page, limit: '25' });
    if (q) query.set('q', q);
    if (status) query.set('status', status);
    if (extra) query.set(resource.filterParam, extra);

    api
      .get(`${resource.endpoint}?${query}`)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(loadError.message);
        warn(loadError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, q, status, extra, resource.endpoint, resource.filterParam, warn]);

  return (
    <div>
      {resource.notice && <Notice>{resource.notice}</Notice>}

      <Row className="mb-5">
        <input
          key={q}
          className={inputClass({ className: 'max-w-[280px]' })}
          placeholder={`Search ${resource.plural.toLowerCase()}`}
          defaultValue={q}
          onKeyDown={(event) => {
            if (event.key === 'Enter') params.set('q', event.currentTarget.value.trim());
          }}
          aria-label={`Search ${resource.plural}`}
        />

        <select
          className={inputClass({ className: 'max-w-[170px]' })}
          value={status}
          onChange={(event) => params.set('status', event.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        {resource.filterOptions && (
          <select
            className={inputClass({ className: 'max-w-[200px]' })}
            value={extra}
            onChange={(event) => params.set(resource.filterParam, event.target.value)}
            aria-label={resource.filterLabel || 'Filter'}
          >
            <option value="">{resource.filterLabel || 'All'}</option>
            {resource.filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        <Spacer />

        <span className="text-[13px] text-muted">{data.total} total</span>

        <LinkButton variant="primary" href={`${resource.path}/new`}>
          New {resource.singular.toLowerCase()}
        </LinkButton>
      </Row>

      {loading && <Empty>Loading…</Empty>}
      {!loading && error && <Empty>{error}</Empty>}

      {!loading && !error && (
        <>
          <DataTable
            columns={resource.columns}
            rows={data.items}
            emptyMessage={`No ${resource.plural.toLowerCase()} yet. Create the first one.`}
          />
          <Pagination page={data.page} pages={data.pages} onChange={(next) => params.set('page', String(next))} />
        </>
      )}
    </div>
  );
}
