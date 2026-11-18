import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']);
const DOCUMENT_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

/**
 * Files are held in memory and streamed straight to Cloudinary, so nothing
 * untrusted is ever written to the server's disk.
 */
const storage = multer.memoryStorage();

function fileFilter(allowed, label) {
  return (_req, file, cb) => {
    if (allowed.has(file.mimetype)) return cb(null, true);
    cb(ApiError.badRequest(`That file type is not accepted for ${label}`));
  };
}

export const uploadImage = multer({
  storage,
  limits: { fileSize: env.maxImageBytes, files: 1 },
  fileFilter: fileFilter(IMAGE_TYPES, 'images'),
});

export const uploadDocument = multer({
  storage,
  limits: { fileSize: env.maxDocumentBytes, files: 1 },
  fileFilter: fileFilter(DOCUMENT_TYPES, 'documents'),
});

export { IMAGE_TYPES, DOCUMENT_TYPES };
