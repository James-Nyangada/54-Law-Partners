import {
  Article,
  PracticeArea,
  Lawyer,
  Matter,
  Page,
  Setting,
  Job,
  Enquiry,
  Application,
  Subscriber,
} from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { readPaging, pagedResponse } from '../utils/paginate.js';
import { toAssetRecord, uploadBuffer, FOLDERS } from '../config/cloudinary.js';

/**
 * The public, read-only API the website reads from.
 *
 * Every query here is pinned to status: 'published'. Draft content must never
 * reach the public site, and relying on the caller to filter would be one
 * forgotten query parameter away from publishing something unfinished.
 */

const PUBLIC_FIELDS = '-createdBy -updatedBy -__v';

export const listPracticeAreas = asyncHandler(async (_req, res) => {
  const items = await PracticeArea.find({ status: 'published' })
    .select(PUBLIC_FIELDS)
    .sort({ pillar: 1, order: 1 })
    .populate('lawyers', 'slug portrait en.name en.role fr.name fr.role');
  res.json({ items });
});

export const getPracticeArea = asyncHandler(async (req, res) => {
  const item = await PracticeArea.findOne({ slug: req.params.slug, status: 'published' })
    .select(PUBLIC_FIELDS)
    .populate('lawyers', 'slug portrait en.name en.role fr.name fr.role');
  if (!item) throw ApiError.notFound('That practice area was not found');

  const [matters, articles] = await Promise.all([
    Matter.find({ status: 'published', practiceAreas: item._id }).sort({ order: 1 }).select(PUBLIC_FIELDS),
    Article.find({ status: 'published', practiceArea: item._id })
      .sort({ publishedAt: -1 })
      .limit(4)
      .select(PUBLIC_FIELDS)
      .populate('author', 'slug en.name fr.name'),
  ]);

  res.json({ area: item, matters, articles });
});

export const listLawyers = asyncHandler(async (_req, res) => {
  const items = await Lawyer.find({ status: 'published' })
    .select(`${PUBLIC_FIELDS} -cv`)
    .sort({ order: 1 })
    .populate('practiceAreas', 'slug en.title fr.title');
  res.json({ items });
});

export const getLawyer = asyncHandler(async (req, res) => {
  const item = await Lawyer.findOne({ slug: req.params.slug, status: 'published' })
    .select(`${PUBLIC_FIELDS} -cv`)
    .populate('practiceAreas', 'slug en.title fr.title');
  if (!item) throw ApiError.notFound('That profile was not found');

  const articles = await Article.find({ status: 'published', author: item._id })
    .sort({ publishedAt: -1 })
    .limit(6)
    .select(PUBLIC_FIELDS);

  res.json({ lawyer: item, articles });
});

export const listArticles = asyncHandler(async (req, res) => {
  const { page, limit, skip } = readPaging(req.query, { defaultLimit: 12, maxLimit: 48 });

  const query = { status: 'published' };

  if (req.query.area) {
    const area = await PracticeArea.findOne({ slug: req.query.area }).select('_id');
    if (!area) return res.json(pagedResponse({ items: [], total: 0, page, limit }));
    query.practiceArea = area._id;
  }

  if (req.query.author) {
    const author = await Lawyer.findOne({ slug: req.query.author }).select('_id');
    if (!author) return res.json(pagedResponse({ items: [], total: 0, page, limit }));
    query.author = author._id;
  }

  if (req.query.type) query.type = req.query.type;

  const [items, total] = await Promise.all([
    Article.find(query)
      .sort({ featured: -1, publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(PUBLIC_FIELDS)
      .populate('practiceArea', 'slug en.title fr.title')
      .populate('author', 'slug portrait en.name fr.name'),
    Article.countDocuments(query),
  ]);

  res.json(pagedResponse({ items, total, page, limit }));
});

export const getArticle = asyncHandler(async (req, res) => {
  const item = await Article.findOne({ slug: req.params.slug, status: 'published', type: 'firm' })
    .select(PUBLIC_FIELDS)
    .populate('practiceArea', 'slug en.title fr.title')
    .populate('author', 'slug portrait email en.name en.role en.bio fr.name fr.role fr.bio');
  if (!item) throw ApiError.notFound('That article was not found');

  const related = await Article.find({
    status: 'published',
    practiceArea: item.practiceArea,
    _id: { $ne: item._id },
  })
    .sort({ publishedAt: -1 })
    .limit(3)
    .select(PUBLIC_FIELDS);

  res.json({ article: item, related });
});

export const listMatters = asyncHandler(async (_req, res) => {
  const items = await Matter.find({ status: 'published' })
    .sort({ order: 1 })
    .select(PUBLIC_FIELDS)
    .populate('practiceAreas', 'slug en.title fr.title');
  res.json({ items });
});

export const getPage = asyncHandler(async (req, res) => {
  const item = await Page.findOne({ key: req.params.key, status: 'published' }).select(PUBLIC_FIELDS);
  if (!item) throw ApiError.notFound('That page was not found');
  res.json(item);
});

export const getSettings = asyncHandler(async (_req, res) => {
  const settings = (await Setting.load()).toJSON();
  // Internal: where notifications go, and who last edited. Not for the site.
  delete settings.notifyEmail;
  delete settings.updatedBy;
  res.json(settings);
});

export const listJobs = asyncHandler(async (_req, res) => {
  const items = await Job.find({
    status: 'published',
    $or: [{ closingDate: null }, { closingDate: { $gte: new Date() } }],
  })
    .sort({ closingDate: 1, createdAt: -1 })
    .select(PUBLIC_FIELDS);
  res.json({ items });
});

export const getJob = asyncHandler(async (req, res) => {
  const item = await Job.findOne({ slug: req.params.slug, status: 'published' }).select(PUBLIC_FIELDS);
  if (!item) throw ApiError.notFound('That role was not found');
  res.json(item);
});

/** Contact form. Rate limited at the route. */
export const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create({
    name: req.body.name,
    organisation: req.body.organisation,
    email: req.body.email,
    phone: req.body.phone,
    areaOfLaw: req.body.areaOfLaw,
    message: req.body.message,
    locale: req.body.locale === 'fr' ? 'fr' : 'en',
  });

  // Deliberately returns only an acknowledgement. Nothing about the stored
  // record goes back to an unauthenticated caller.
  res.status(201).json({ ok: true, id: enquiry._id });
});

/** Career application, with the CV attached as a private asset. */
export const createApplication = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Attach a CV to apply');

  const job = await Job.findOne({ slug: req.body.jobSlug, status: 'published' });
  if (!job) throw ApiError.notFound('That role is no longer open');

  const result = await uploadBuffer(req.file.buffer, {
    folder: FOLDERS.documents,
    resourceType: 'raw',
    access: 'authenticated',
    filename: req.file.originalname,
  });

  const application = await Application.create({
    job: job._id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    coverNote: req.body.coverNote,
    cv: toAssetRecord(result),
  });

  res.status(201).json({ ok: true, id: application._id });
});

/** Newsletter sign-up. Double opt-in: nothing is sent until confirmed. */
export const subscribe = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  if (!email) throw ApiError.badRequest('Enter an email address');

  const existing = await Subscriber.findOne({ email });

  if (existing) {
    // Same response either way, so the endpoint cannot be used to test which
    // addresses are already on the list.
    return res.status(201).json({ ok: true });
  }

  await Subscriber.create({ email, locale: req.body.locale === 'fr' ? 'fr' : 'en' });
  res.status(201).json({ ok: true });
});

export const confirmSubscription = asyncHandler(async (req, res) => {
  const subscriber = await Subscriber.findOne({ confirmToken: req.params.token });
  if (!subscriber) throw ApiError.notFound('That confirmation link is not valid');

  subscriber.confirmed = true;
  subscriber.confirmedAt = new Date();
  await subscriber.save();

  res.json({ ok: true });
});

export const unsubscribe = asyncHandler(async (req, res) => {
  const subscriber = await Subscriber.findOne({ unsubscribeToken: req.params.token });
  if (!subscriber) throw ApiError.notFound('That link is not valid');

  subscriber.confirmed = false;
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();

  res.json({ ok: true });
});
