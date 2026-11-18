import Link from 'next/link';
import { StatusBadge } from './Badges';
import { Button, Empty } from './ui';

/** A list table driven by a column config. */
export function DataTable({ columns, rows, emptyMessage = 'Nothing here yet.', rowKey = (row) => row.id }) {
  if (!rows?.length) return <Empty>{emptyMessage}</Empty>;

  return (
    <div className="overflow-x-auto rounded-xs border border-line">
      <table className="w-full border-collapse text-[14.5px]">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
                className="whitespace-nowrap border-b border-line bg-onyx-raised px-4 py-[13px] text-left text-[10.5px] font-medium uppercase tracking-[0.14em] text-mint"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="group">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`border-b border-line px-4 py-3.5 align-middle group-last:border-b-0 group-hover:bg-panel ${
                    column.strong ? 'text-bone' : 'text-sage'
                  }`}
                >
                  {column.render ? column.render(row) : (readPath(row, column.key) ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function readPath(object, path) {
  return String(path)
    .split('.')
    .reduce((value, key) => (value == null ? value : value[key]), object);
}

export function TitleCell({ href, title, subtitle, status }) {
  return (
    <div className="flex flex-col gap-1">
      <Link href={href} className="font-medium text-bone hover:text-mint-bright">
        {title || <span className="text-muted">Untitled</span>}
      </Link>
      <span className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
        {status && <StatusBadge status={status} />}
        {subtitle}
      </span>
    </div>
  );
}

export function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 pt-[22px]" aria-label="Pages">
      <Button size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span className="text-[13px] text-muted">
        Page {page} of {pages}
      </span>
      <Button size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </nav>
  );
}
