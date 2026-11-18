/**
 * Offset pagination. Page numbers rather than cursors: the admin lists are
 * small and people expect to click "page 3".
 */
export function readPaging(query, { defaultLimit = 25, maxLimit = 100 } = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const requested = Number.parseInt(query.limit, 10) || defaultLimit;
  const limit = Math.min(Math.max(1, requested), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
}

export function pagedResponse({ items, total, page, limit }) {
  return {
    items,
    page,
    limit,
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}

/**
 * Builds a Mongo sort object from a string such as "-publishedAt,title".
 * Only fields in `allowed` are honoured, so a caller cannot sort by an
 * unindexed field and make the database scan the whole collection.
 */
export function readSort(raw, allowed, fallback = { createdAt: -1 }) {
  if (!raw) return fallback;

  const sort = {};
  for (const part of String(raw).split(',')) {
    const field = part.trim();
    if (!field) continue;
    const descending = field.startsWith('-');
    const name = descending ? field.slice(1) : field;
    if (allowed.includes(name)) sort[name] = descending ? -1 : 1;
  }

  return Object.keys(sort).length ? sort : fallback;
}
