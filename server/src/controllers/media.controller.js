import { Media } from '../models/Media.js';
import { recordAudit } from '../models/AuditLog.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { readPaging, pagedResponse } from '../utils/paginate.js';
import { uploadBuffer, destroyAsset, toAssetRecord, signedUrl, FOLDERS } from '../config/cloudinary.js';

const IMAGE_FOLDERS = new Set(['articles', 'people', 'practice']);

/**
 * Uploads an image. The admin app sends the file here; the Cloudinary secret
 * never leaves the server. An unsigned browser preset would let anyone who
 * found the preset name upload into the firm's account.
 */
export const uploadImageHandler = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file was received');

  const folderKey = String(req.body.folder || 'articles');
  if (!IMAGE_FOLDERS.has(folderKey)) throw ApiError.badRequest('That folder is not valid');

  const result = await uploadBuffer(req.file.buffer, {
    folder: FOLDERS[folderKey],
    resourceType: 'image',
    access: 'public',
    filename: req.file.originalname,
  });

  const asset = toAssetRecord(result);

  const media = await Media.create({
    ...asset,
    folder: folderKey,
    originalFilename: req.file.originalname,
    altEn: req.body.altEn,
    altFr: req.body.altFr,
    uploadedBy: req.user.id,
  });

  recordAudit({
    req,
    action: 'upload',
    collectionName: 'Media',
    documentId: media._id,
    summary: `Uploaded image to ${folderKey}`,
  });

  res.status(201).json(media);
});

/**
 * Uploads a document. CVs and anything else carrying personal data go up as
 * an authenticated asset, so the delivery URL is unguessable and expiring.
 * A CV sitting on a public URL is a data protection problem.
 */
export const uploadDocumentHandler = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file was received');

  const isPrivate = req.body.private === 'true' || req.body.private === true;

  const result = await uploadBuffer(req.file.buffer, {
    folder: FOLDERS.documents,
    resourceType: 'raw',
    access: isPrivate ? 'authenticated' : 'public',
    filename: req.file.originalname,
  });

  const asset = toAssetRecord(result);

  const media = await Media.create({
    ...asset,
    folder: 'documents',
    originalFilename: req.file.originalname,
    uploadedBy: req.user.id,
  });

  recordAudit({
    req,
    action: 'upload',
    collectionName: 'Media',
    documentId: media._id,
    summary: `Uploaded document${isPrivate ? ' (private)' : ''}`,
  });

  res.status(201).json(media);
});

/** Issues a short-lived signed URL for a private asset. */
export const getSignedUrl = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw ApiError.notFound('That file no longer exists');

  if (media.access !== 'authenticated') {
    return res.json({ url: media.url, expiresIn: null });
  }

  const url = signedUrl(media.publicId, {
    resourceType: media.resourceType || 'raw',
    expiresInSeconds: 3600,
  });

  res.json({ url, expiresIn: 3600 });
});

export const listMedia = asyncHandler(async (req, res) => {
  const { page, limit, skip } = readPaging(req.query, { defaultLimit: 40 });

  const query = {};
  if (req.query.folder) query.folder = req.query.folder;
  if (req.query.resourceType) query.resourceType = req.query.resourceType;

  const [items, total] = await Promise.all([
    Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('uploadedBy', 'name email'),
    Media.countDocuments(query),
  ]);

  res.json(pagedResponse({ items, total, page, limit }));
});

export const updateMedia = asyncHandler(async (req, res) => {
  const media = await Media.findByIdAndUpdate(
    req.params.id,
    { altEn: req.body.altEn, altFr: req.body.altFr },
    { new: true }
  );
  if (!media) throw ApiError.notFound('That file no longer exists');
  res.json(media);
});

/** Removes the asset from Cloudinary as well as the registry. */
export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw ApiError.notFound('That file no longer exists');

  try {
    await destroyAsset(media.publicId, {
      resourceType: media.resourceType || 'image',
      access: media.access,
    });
  } catch (error) {
    // If Cloudinary no longer has it, the registry row should still go.
    console.warn('[media] cloudinary destroy failed:', error.message);
  }

  await media.deleteOne();

  recordAudit({
    req,
    action: 'delete',
    collectionName: 'Media',
    documentId: media._id,
    summary: 'Deleted file',
  });

  res.status(204).end();
});
