'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '../Toast';
import { ConfirmButton } from '../ConfirmButton';
import { Pagination } from '../DataTable';
import { Badge, Button, Empty, Notice, Row, Spacer, inputClass } from '../ui';

const FOLDERS = ['articles', 'people', 'practice', 'documents'];

export function Media() {
  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0 });
  const [folder, setFolder] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const { notify, warn } = useToast();
  const { isAdmin } = useAuth();

  const load = useCallback(async () => {
    const query = new URLSearchParams({ page: String(page), limit: '40' });
    if (folder) query.set('folder', folder);

    try {
      setData(await api.get(`/admin/media?${query}`));
    } catch (error) {
      warn(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, folder, warn]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const upload = async (file) => {
    if (!file) return;
    setBusy(true);

    try {
      const form = new FormData();
      form.append('file', file);
      const isImage = file.type.startsWith('image/');
      if (isImage) form.append('folder', folder && folder !== 'documents' ? folder : 'articles');

      await api.upload(isImage ? '/admin/media/image' : '/admin/media/document', form);
      notify('Uploaded');
      load();
    } catch (error) {
      warn(error.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const saveAlt = async (id, altEn, altFr) => {
    try {
      await api.patch(`/admin/media/${id}`, { altEn, altFr });
      notify('Alt text saved');
    } catch (error) {
      warn(error.message);
    }
  };

  const remove = async (id) => {
    try {
      await api.del(`/admin/media/${id}`);
      notify('File deleted');
      load();
    } catch (error) {
      warn(error.message);
    }
  };

  return (
    <div>
      <Notice>
        Alt text describes an image for someone using a screen reader, and it is required for
        anything that appears on the public site.
      </Notice>

      <Row className="mb-5">
        <select
          className={inputClass({ className: 'max-w-[180px]' })}
          value={folder}
          onChange={(event) => {
            setFolder(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by folder"
        >
          <option value="">All folders</option>
          {FOLDERS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <Spacer />

        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          className={inputClass({
            className: 'max-w-[300px] file:mr-3 file:cursor-pointer file:border-0 file:bg-forest file:px-3 file:py-1 file:text-bone',
          })}
          disabled={busy}
          onChange={(event) => upload(event.target.files?.[0])}
          aria-label="Upload a file"
        />
        {busy && <span className="text-[13px] text-muted">Uploading…</span>}
      </Row>

      {loading && <Empty>Loading…</Empty>}
      {!loading && !data.items.length && <Empty>Nothing uploaded yet.</Empty>}

      {!loading && data.items.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-4">
          {data.items.map((item) => (
            <MediaTile key={item.id} item={item} onSaveAlt={saveAlt} onDelete={remove} canDelete={isAdmin} />
          ))}
        </div>
      )}

      <Pagination page={data.page} pages={data.pages} onChange={setPage} />
    </div>
  );
}

function MediaTile({ item, onSaveAlt, onDelete, canDelete }) {
  const [altEn, setAltEn] = useState(item.altEn ?? '');
  const [altFr, setAltFr] = useState(item.altFr ?? '');
  const isImage = item.resourceType === 'image';
  const small = inputClass({ className: 'mb-1.5 px-[9px] py-[7px] text-[12px]' });

  return (
    <div className="overflow-hidden rounded-xs border border-line bg-panel">
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- Cloudinary already optimises delivery
        <img src={item.url} alt={item.altEn || ''} loading="lazy" className="block h-[120px] w-full object-cover" />
      ) : (
        <div className="flex h-[120px] items-center justify-center bg-forest-deep text-[13px] tracking-[0.1em] text-mint">
          {item.format?.toUpperCase() || 'FILE'}
        </div>
      )}

      <div className="break-words p-[11px] text-[12px] text-muted">
        <div className="mb-1 break-all text-sage">{item.originalFilename}</div>
        <div className="mb-2">
          {item.folder} · {Math.round((item.bytes || 0) / 1024)} KB
          {item.access === 'authenticated' && (
            <span className="ml-1.5">
              <Badge>Private</Badge>
            </span>
          )}
        </div>

        {isImage && (
          <>
            <input
              className={small}
              placeholder="Alt text (EN)"
              value={altEn}
              onChange={(event) => setAltEn(event.target.value)}
              aria-label="Alt text in English"
            />
            <input
              className={small}
              placeholder="Alt text (FR)"
              value={altFr}
              onChange={(event) => setAltFr(event.target.value)}
              aria-label="Alt text in French"
            />
            <Button size="sm" className="mb-2" onClick={() => onSaveAlt(item.id, altEn, altFr)}>
              Save alt text
            </Button>
          </>
        )}

        {canDelete && <ConfirmButton onConfirm={() => onDelete(item.id)} label="Delete" question="Remove this file?" />}
      </div>
    </div>
  );
}
