import {
  Article,
  PracticeArea,
  Lawyer,
  Matter,
  Enquiry,
  Application,
  Job,
  Page,
  Setting,
  Subscriber,
  User,
  AuditLog,
  recordAudit,
} from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { readPaging, pagedResponse } from '../utils/paginate.js';
import { signedUrl, destroyAsset } from '../config/cloudinary.js';

/** The work queue on the dashboard home screen. */
export const summary = asyncHandler(async (_req, res) => {
  const [newEnquiries, newApplications, drafts, published, recent] = await Promise.all([
    Enquiry.countDocuments({ status: 'new' }),
    Application.countDocuments({ status: 'new' }),
    Article.countDocuments({ status: 'draft' }),
    Article.countDocuments({ status: 'published' }),
    AuditLog.find({ action: { $in: ['create', 'update', 'publish'] } })
      .sort({ at: -1 })
      .limit(6)
      .populate('user', 'name'),
  ]);

  const [areas, lawyers, matters, openJobs, subscribers] = await Promise.all([
    PracticeArea.countDocuments({ status: 'published' }),
    Lawyer.countDocuments({ status: 'published' }),
    Matter.countDocuments({ status: 'published' }),
    Job.countDocuments({
      status: 'published',
      $or: [{ closingDate: null }, { closingDate: { $gte: new Date() } }],
    }),
    Subscriber.countDocuments({ confirmed: true }),
  ]);

  res.json({
    queue: { newEnquiries, newApplications, drafts },
    counts: { published, areas, lawyers, matters, openJobs, subscribers },
    recent,
  });
});

/* ------------------------------------------------------------------ */
/* Enquiries — read, triage, delete. Never replied to from here.       */
/* ------------------------------------------------------------------ */

export const listEnquiries = asyncHandler(async (req, res) => {
  const { page, limit, skip } = readPaging(req.query, { defaultLimit: 25 });

  const query = {};
  if (req.query.status) query.status = req.query.status;

  const [items, total] = await Promise.all([
    Enquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('handledBy', 'name'),
    Enquiry.countDocuments(query),
  ]);

  res.json(pagedResponse({ items, total, page, limit }));
});

export const getEnquiry = asyncHandler(async (req, res) => {
  const item = await Enquiry.findById(req.params.id).populate('handledBy', 'name');
  if (!item) throw ApiError.notFound('That enquiry no longer exists');

  // Opening an unread enquiry marks it read, so the queue count means
  // something.
  if (item.status === 'new') {
    item.status = 'read';
    item.handledBy = req.user.id;
    await item.save();
  }

  res.json(item);
});

export const updateEnquiry = asyncHandler(async (req, res) => {
  const item = await Enquiry.findById(req.params.id);
  if (!item) throw ApiError.notFound('That enquiry no longer exists');

  if (req.body.status) item.status = req.body.status;
  if (req.body.internalNote !== undefined) item.internalNote = req.body.internalNote;
  item.handledBy = req.user.id;

  await item.save();
  res.json(item);
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  const item = await Enquiry.findByIdAndDelete(req.params.id);
  if (!item) throw ApiError.notFound('That enquiry no longer exists');

  recordAudit({
    req,
    action: 'delete',
    collectionName: 'Enquiry',
    documentId: item._id,
    summary: 'Deleted enquiry',
  });

  res.status(204).end();
});

/* ------------------------------------------------------------------ */
/* Applications                                                        */
/* ------------------------------------------------------------------ */

export const listApplications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = readPaging(req.query, { defaultLimit: 25 });

  const query = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.job) query.job = req.query.job;

  const [items, total] = await Promise.all([
    Application.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('job', 'slug en.title')
      .populate('handledBy', 'name'),
    Application.countDocuments(query),
  ]);

  res.json(pagedResponse({ items, total, page, limit }));
});

export const getApplication = asyncHandler(async (req, res) => {
  const item = await Application.findById(req.params.id)
    .populate('job', 'slug en.title')
    .populate('handledBy', 'name');
  if (!item) throw ApiError.notFound('That application no longer exists');

  if (item.status === 'new') {
    item.handledBy = req.user.id;
    await item.save();
  }

  res.json(item);
});

export const updateApplication = asyncHandler(async (req, res) => {
  const item = await Application.findById(req.params.id);
  if (!item) throw ApiError.notFound('That application no longer exists');

  if (req.body.status) item.status = req.body.status;
  if (req.body.internalNote !== undefined) item.internalNote = req.body.internalNote;
  item.handledBy = req.user.id;

  await item.save();
  res.json(item);
});

/** Short-lived signed link to a CV. The file is never on a public URL. */
export const getApplicationCv = asyncHandler(async (req, res) => {
  const item = await Application.findById(req.params.id);
  if (!item?.cv?.publicId) throw ApiError.notFound('No CV is attached to that application');

  const url = signedUrl(item.cv.publicId, { resourceType: 'raw', expiresInSeconds: 600 });

  recordAudit({
    req,
    action: 'update',
    collectionName: 'Application',
    documentId: item._id,
    summary: 'Opened a CV',
  });

  res.json({ url, expiresIn: 600 });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const item = await Application.findByIdAndDelete(req.params.id);
  if (!item) throw ApiError.notFound('That application no longer exists');

  // Deleting the record without the file would leave the CV — the personal
  // data the delete exists to remove — sitting in Cloudinary.
  if (item.cv?.publicId) {
    try {
      await destroyAsset(item.cv.publicId, { resourceType: 'raw', access: item.cv.access || 'authenticated' });
    } catch (error) {
      console.warn('[applications] could not delete CV from Cloudinary:', error.message);
    }
  }

  recordAudit({
    req,
    action: 'delete',
    collectionName: 'Application',
    documentId: item._id,
    summary: 'Deleted application',
  });

  res.status(204).end();
});

/* ------------------------------------------------------------------ */
/* Pages, settings, subscribers, audit                                 */
/* ------------------------------------------------------------------ */

export const listPages = asyncHandler(async (_req, res) => {
  const items = await Page.find().sort({ key: 1 });
  res.json({ items });
});

export const getPageByKey = asyncHandler(async (req, res) => {
  let page = await Page.findOne({ key: req.params.key });
  if (!page) {
    // Create on first open, so a new legal notice is never a 404 in the admin.
    page = await Page.create({ key: req.params.key, createdBy: req.user.id });
  }
  res.json(page);
});

export const updatePage = asyncHandler(async (req, res) => {
  const page = await Page.findOneAndUpdate(
    { key: req.params.key },
    { ...req.body, updatedBy: req.user.id },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  recordAudit({
    req,
    action: 'update',
    collectionName: 'Page',
    documentId: page._id,
    summary: `Updated the ${req.params.key} page`,
  });

  res.json(page);
});

export const getSettings = asyncHandler(async (_req, res) => {
  res.json(await Setting.load());
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.load();
  Object.assign(settings, req.body, { updatedBy: req.user.id });
  await settings.save();

  recordAudit({
    req,
    action: 'update',
    collectionName: 'Setting',
    documentId: settings._id,
    summary: 'Updated firm settings',
  });

  res.json(settings);
});

export const listSubscribers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = readPaging(req.query, { defaultLimit: 50 });

  const query = {};
  if (req.query.confirmed === 'true') query.confirmed = true;
  if (req.query.confirmed === 'false') query.confirmed = false;

  const [items, total] = await Promise.all([
    Subscriber.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Subscriber.countDocuments(query),
  ]);

  res.json(pagedResponse({ items, total, page, limit }));
});

export const deleteSubscriber = asyncHandler(async (req, res) => {
  const item = await Subscriber.findByIdAndDelete(req.params.id);
  if (!item) throw ApiError.notFound('That subscriber no longer exists');
  res.status(204).end();
});

export const listAudit = asyncHandler(async (req, res) => {
  const { page, limit, skip } = readPaging(req.query, { defaultLimit: 50 });

  const query = {};
  if (req.query.action) query.action = req.query.action;
  if (req.query.collectionName) query.collectionName = req.query.collectionName;

  const [items, total] = await Promise.all([
    AuditLog.find(query).sort({ at: -1 }).skip(skip).limit(limit).populate('user', 'name email'),
    AuditLog.countDocuments(query),
  ]);

  res.json(pagedResponse({ items, total, page, limit }));
});

/* ------------------------------------------------------------------ */
/* Users — admin only                                                  */
/* ------------------------------------------------------------------ */

export const listUsers = asyncHandler(async (_req, res) => {
  const items = await User.find().sort({ createdAt: -1 });
  res.json({ items });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.exists({ email: String(email).toLowerCase() });
  if (exists) throw ApiError.conflict('Someone already uses that email address');

  const user = new User({
    name,
    email: String(email).toLowerCase(),
    role,
    invitedBy: req.user.id,
  });
  await user.setPassword(password);
  await user.save();

  recordAudit({
    req,
    action: 'create',
    collectionName: 'User',
    documentId: user._id,
    summary: `Created the ${role} account for ${email}`,
  });

  res.status(201).json(user.toJSON());
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('+passwordHash');
  if (!user) throw ApiError.notFound('That account no longer exists');

  // An admin cannot strip their own admin role or deactivate themselves, which
  // is how a system ends up with nobody able to administer it.
  const isSelf = String(user._id) === req.user.id;
  if (isSelf && (req.body.role === 'editor' || req.body.isActive === false)) {
    throw ApiError.badRequest('You cannot remove your own access');
  }

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.role !== undefined) user.role = req.body.role;
  if (req.body.isActive !== undefined) user.isActive = req.body.isActive;
  if (req.body.password) await user.setPassword(req.body.password);

  await user.save();

  recordAudit({
    req,
    action: 'update',
    collectionName: 'User',
    documentId: user._id,
    summary: `Updated the account for ${user.email}`,
  });

  res.json(user.toJSON());
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.params.id) === req.user.id) {
    throw ApiError.badRequest('You cannot delete your own account');
  }

  const remainingAdmins = await User.countDocuments({
    role: 'admin',
    isActive: true,
    _id: { $ne: req.params.id },
  });
  if (remainingAdmins === 0) {
    throw ApiError.badRequest('That is the last administrator. Promote someone else first.');
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw ApiError.notFound('That account no longer exists');

  recordAudit({
    req,
    action: 'delete',
    collectionName: 'User',
    documentId: user._id,
    summary: `Deleted the account for ${user.email}`,
  });

  res.status(204).end();
});
