import slugify from 'slugify';

/** Turns a title into a URL segment. */
export function toSlug(value) {
  return slugify(String(value || ''), {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Produces a slug that is not already taken in `Model`, appending -2, -3 and
 * so on. `ignoreId` lets a document keep its own slug when being updated.
 */
export async function uniqueSlug(Model, base, ignoreId) {
  const root = toSlug(base) || 'item';
  let candidate = root;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug: candidate };
    if (ignoreId) query._id = { $ne: ignoreId };
    const clash = await Model.exists(query);
    if (!clash) return candidate;
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
}
