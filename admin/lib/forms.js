/** Helpers shared by every editor screen. */

/** Guarantees the en / fr blocks exist so fields can read form.fr.title. */
export function normalise(item) {
  return { ...item, en: item?.en ?? {}, fr: item?.fr ?? {} };
}

/** Immutably writes a dotted path, e.g. "en.title". */
export function writePath(object, path, value) {
  const keys = String(path).split('.');
  const next = { ...object };
  let cursor = next;

  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index];
    cursor[key] = { ...(cursor[key] ?? {}) };
    cursor = cursor[key];
  }

  cursor[keys[keys.length - 1]] = value;
  return next;
}

/**
 * Drops server-managed fields so a PATCH never tries to set them, and turns
 * populated relations back into ids. The API validates with Zod and discards
 * anything it does not declare, but sending a clean payload keeps the audit
 * trail honest and the error messages relevant.
 */
export function toPayload(form) {
  const {
    id,
    _id,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    publishedAt,
    hasFrench,
    isOpen,
    ...rest
  } = form;

  for (const [key, value] of Object.entries(rest)) {
    if (Array.isArray(value) && value.length && typeof value[0] === 'object' && value[0]?.id) {
      rest[key] = value.map((item) => item.id);
    } else if (value && typeof value === 'object' && value.id && !value.publicId) {
      rest[key] = value.id;
    }
  }

  return rest;
}
