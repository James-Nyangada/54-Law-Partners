import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { readPaging, pagedResponse, readSort } from '../utils/paginate.js';
import { recordAudit } from '../models/AuditLog.js';
import { uniqueSlug } from '../utils/slug.js';

/**
 * Builds the five standard handlers for a content collection.
 *
 * Most of the collections here differ only in which model they touch, which
 * fields they search, and what they populate. Writing five near-identical
 * controllers for each would be ten files of copy-paste and ten places for a
 * bug to hide, so the shared behaviour lives here once.
 *
 * Anything with genuinely different behaviour — auth, enquiries, uploads —
 * gets its own controller instead of a flag on this one.
 */
export function createCrudController({
  Model,
  name,
  searchFields = [],
  sortable = ['createdAt', 'updatedAt'],
  defaultSort = { createdAt: -1 },
  populate = [],
  slugFrom,
  filters = () => ({}),
}) {
  const list = asyncHandler(async (req, res) => {
    const { page, limit, skip } = readPaging(req.query);
    const sort = readSort(req.query.sort, sortable, defaultSort);

    const query = { ...filters(req) };

    if (req.query.status) query.status = req.query.status;

    if (req.query.q && searchFields.length) {
      const term = String(req.query.q).trim();
      if (term) {
        const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        query.$or = searchFields.map((field) => ({ [field]: pattern }));
      }
    }

    const [items, total] = await Promise.all([
      Model.find(query).sort(sort).skip(skip).limit(limit).populate(populate),
      Model.countDocuments(query),
    ]);

    res.json(pagedResponse({ items, total, page, limit }));
  });

  const get = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id).populate(populate);
    if (!item) throw ApiError.notFound(`That ${name} no longer exists`);
    res.json(item);
  });

  const create = asyncHandler(async (req, res) => {
    const payload = { ...req.body, createdBy: req.user.id, updatedBy: req.user.id };

    if (slugFrom) {
      payload.slug = await uniqueSlug(Model, payload.slug || slugFrom(payload));
    }

    const item = await Model.create(payload);

    recordAudit({
      req,
      action: 'create',
      collectionName: Model.modelName,
      documentId: item._id,
      summary: `Created ${name}`,
    });

    res.status(201).json(await item.populate(populate));
  });

  const update = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) throw ApiError.notFound(`That ${name} no longer exists`);

    const wasPublished = item.status === 'published';

    // A slug is only regenerated when it is explicitly sent. Once something is
    // published, its URL is referenced in search results and emails, so it
    // must never change as a side effect of editing the title.
    if (slugFrom && req.body.slug) {
      req.body.slug = await uniqueSlug(Model, req.body.slug, item._id);
    } else {
      delete req.body.slug;
    }

    Object.assign(item, req.body, { updatedBy: req.user.id });
    await item.save();

    const nowPublished = item.status === 'published';
    let action = 'update';
    if (!wasPublished && nowPublished) action = 'publish';
    if (wasPublished && !nowPublished) action = 'unpublish';

    recordAudit({
      req,
      action,
      collectionName: Model.modelName,
      documentId: item._id,
      summary: `${action === 'update' ? 'Updated' : action === 'publish' ? 'Published' : 'Unpublished'} ${name}`,
    });

    res.json(await item.populate(populate));
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw ApiError.notFound(`That ${name} no longer exists`);

    recordAudit({
      req,
      action: 'delete',
      collectionName: Model.modelName,
      documentId: item._id,
      summary: `Deleted ${name}`,
    });

    res.status(204).end();
  });

  /** Drag-to-reorder. Takes [{ id, order }, ...] in one request. */
  const reorder = asyncHandler(async (req, res) => {
    const entries = Array.isArray(req.body?.items) ? req.body.items : [];
    if (!entries.length) throw ApiError.badRequest('Nothing to reorder');

    await Model.bulkWrite(
      entries.map(({ id, order }) => ({
        updateOne: { filter: { _id: id }, update: { $set: { order } } },
      }))
    );

    res.json({ ok: true, count: entries.length });
  });

  return { list, get, create, update, remove, reorder };
}
