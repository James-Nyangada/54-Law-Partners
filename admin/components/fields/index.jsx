'use client';

import { useState, useRef, useId } from 'react';
import { api } from '@/lib/api';
import { Button, Badge, inputClass, labelClass, hintClass, errorClass, checkboxClass, cx } from '../ui';

/**
 * Label, control, hint and error. The label names only the control; the hint
 * and error are linked with aria-describedby, so a screen reader announces
 * "Body, edit text" and then the help, rather than reading the hint as part
 * of the field's name.
 *
 * `children` is a function receiving the props the control must carry.
 * Group fields (lists, relations, assets) pass `group` and get a labelled
 * role="group" instead of a <label for>.
 */
function Field({ label, hint, error, group = false, children }) {
  const id = useId();
  const noteId = `${id}-note`;
  const note = error || hint;

  const control = {
    id,
    'aria-describedby': note ? noteId : undefined,
    'aria-invalid': error ? true : undefined,
  };

  return (
    <div
      className="mb-5 flex flex-col gap-[7px]"
      role={group ? 'group' : undefined}
      aria-labelledby={group && label ? `${id}-label` : undefined}
      aria-describedby={group && note ? noteId : undefined}
    >
      {label &&
        (group ? (
          <span id={`${id}-label`} className={labelClass}>
            {label}
          </span>
        ) : (
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
        ))}
      {children(control)}
      {note && (
        <span id={noteId} className={error ? errorClass : hintClass}>
          {note}
        </span>
      )}
    </div>
  );
}


export function TextField({ label, value, onChange, hint, error, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(control) => (
        <input
          {...control}
          className={inputClass({ error: Boolean(error) })}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          {...rest}
        />
      )}
    </Field>
  );
}

export function TextArea({ label, value, onChange, hint, error, tall = false, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(control) => (
        <textarea
          {...control}
          className={inputClass({
            error: Boolean(error),
            className: cx('resize-y leading-[1.7]', tall ? 'min-h-80' : 'min-h-30'),
          })}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          {...rest}
        />
      )}
    </Field>
  );
}

export function SelectField({ label, value, onChange, options, hint, error, placeholder = '— none —' }) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(control) => (
        <select
          {...control}
          className={inputClass({ error: Boolean(error) })}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value || null)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

export function CheckboxField({ label, value, onChange, hint }) {
  return (
    <Field hint={hint}>
      {(control) => (
        <label className="flex items-center gap-2.5">
          <input
            {...control}
            type="checkbox"
            className={checkboxClass}
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
          />
          <span>{label}</span>
        </label>
      )}
    </Field>
  );
}

export function DateField({ label, value, onChange, hint, error }) {
  const asInput = value ? String(value).slice(0, 10) : '';
  return (
    <Field label={label} hint={hint} error={error}>
      {(control) => (
        <input
          {...control}
          type="date"
          className={inputClass({ error: Boolean(error) })}
          value={asInput}
          onChange={(event) => onChange(event.target.value || null)}
        />
      )}
    </Field>
  );
}

/** A list of short strings, added and removed one at a time. */
export function ListField({ label, value, onChange, hint, placeholder = 'Add an item' }) {
  const items = Array.isArray(value) ? value : [];
  const [draft, setDraft] = useState('');

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft('');
  };

  return (
    <Field group label={label} hint={hint}>
      {() => (
        <>
          {items.length > 0 && (
            <div className="mb-2 flex flex-col gap-1.5">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    className={inputClass()}
                    aria-label={`${label}, item ${index + 1}`}
                    value={item}
                    onChange={(event) => {
                      const next = [...items];
                      next[index] = event.target.value;
                      onChange(next);
                    }}
                  />
                  <Button
                    size="sm"
                    aria-label={`Remove ${label} item ${index + 1}`}
                    onClick={() => onChange(items.filter((_, i) => i !== index))}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              className={inputClass()}
              aria-label={`Add to ${label}`}
              value={draft}
              placeholder={placeholder}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  add();
                }
              }}
            />
            <Button size="sm" onClick={add}>
              Add
            </Button>
          </div>
        </>
      )}
    </Field>
  );
}

/** Pairs of year and detail, for qualifications. */
export function PairListField({ label, value, onChange, hint }) {
  const items = Array.isArray(value) ? value : [];

  const update = (index, patch) => {
    const next = [...items];
    next[index] = { ...items[index], ...patch };
    onChange(next);
  };

  return (
    <Field group label={label} hint={hint}>
      {() => (
        <>
          <div className="flex flex-col gap-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  className={inputClass({ className: 'max-w-[110px]' })}
                  placeholder="Year"
                  aria-label={`Year, row ${index + 1}`}
                  value={item.year ?? ''}
                  onChange={(event) => update(index, { year: event.target.value })}
                />
                <input
                  className={inputClass()}
                  placeholder="Qualification, institution"
                  aria-label={`Qualification, row ${index + 1}`}
                  value={item.detail ?? ''}
                  onChange={(event) => update(index, { detail: event.target.value })}
                />
                <Button
                  size="sm"
                  aria-label={`Remove row ${index + 1}`}
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Button size="sm" className="mt-2 self-start" onClick={() => onChange([...items, { year: '', detail: '' }])}>
            Add row
          </Button>
        </>
      )}
    </Field>
  );
}

/** Multi-select over a reference list, as checkboxes. */
export function RelationField({ label, value, onChange, options, hint }) {
  const selected = new Set((Array.isArray(value) ? value : []).map((item) => item?.id ?? item));

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange([...next]);
  };

  return (
    <Field group label={label} hint={hint}>
      {() => (
        <div className="flex flex-col gap-2">
          {options.length === 0 && <span className={hintClass}>Nothing to choose from yet.</span>}
          {options.map((option) => (
            <label key={option.value} className="flex items-center gap-2.5">
              <input
                type="checkbox"
                className={checkboxClass}
                checked={selected.has(option.value)}
                onChange={() => toggle(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </Field>
  );
}

/**
 * Uploads through the backend, which holds the Cloudinary credentials. The
 * browser never sees the API secret.
 */
export function AssetField({ label, value, onChange, hint, folder = 'articles', kind = 'image' }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setBusy(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('file', file);
      if (kind === 'image') form.append('folder', folder);
      if (kind === 'document') form.append('private', 'false');

      const endpoint = kind === 'image' ? '/admin/media/image' : '/admin/media/document';
      const media = await api.upload(endpoint, form);

      onChange({
        publicId: media.publicId,
        url: media.url,
        resourceType: media.resourceType,
        format: media.format,
        width: media.width,
        height: media.height,
        bytes: media.bytes,
        access: media.access,
      });
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <Field label={label} hint={busy ? 'Uploading…' : hint} error={error}>
      {(control) => (
        <>
          {value?.url && (
            <div className="mb-2.5 flex flex-wrap items-center gap-3">
              {kind === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element -- Cloudinary already optimises delivery
                <img
                  src={value.url}
                  alt=""
                  className="block h-[68px] w-[92px] rounded-xs border border-line-raised bg-forest-deep object-cover"
                />
              ) : (
                <Badge>{value.format?.toUpperCase() || 'FILE'}</Badge>
              )}
              <span className="break-all text-[13px] text-muted">{value.publicId}</span>
              <Button size="sm" aria-label={`Remove ${label}`} onClick={() => onChange(null)}>
                Remove
              </Button>
            </div>
          )}

          <input
            {...control}
            ref={inputRef}
            type="file"
            className={inputClass({
              className: 'file:mr-3 file:cursor-pointer file:border-0 file:bg-forest file:px-3 file:py-1 file:text-bone',
            })}
            accept={kind === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
            disabled={busy}
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </>
      )}
    </Field>
  );
}
