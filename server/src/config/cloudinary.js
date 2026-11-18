import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
});

/**
 * Folders. Keeping assets separated by kind means a careless bulk delete in
 * the Cloudinary console can only take out one category, and transformations
 * can be applied per folder.
 */
export const FOLDERS = {
  articles: `${env.cloudinary.rootFolder}/articles`,
  people: `${env.cloudinary.rootFolder}/people`,
  practice: `${env.cloudinary.rootFolder}/practice`,
  documents: `${env.cloudinary.rootFolder}/documents`,
};

/**
 * Uploads a buffer to Cloudinary.
 *
 * `access` is 'public' or 'authenticated'. CVs and anything else carrying
 * personal data go up as 'authenticated', which makes the delivery URL
 * unguessable and expiring — see signedUrl() below.
 */
export function uploadBuffer(buffer, { folder, resourceType = 'image', access = 'public', filename }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        type: access === 'authenticated' ? 'authenticated' : 'upload',
        use_filename: Boolean(filename),
        filename_override: filename,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

/**
 * Builds a signed, expiring URL for a private asset. Default one hour, which
 * is long enough to download a CV and short enough that a leaked link stops
 * working.
 */
export function signedUrl(publicId, { resourceType = 'raw', expiresInSeconds = 3600 } = {}) {
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: 'authenticated',
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });
}

export async function destroyAsset(publicId, { resourceType = 'image', access = 'public' } = {}) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    type: access === 'authenticated' ? 'authenticated' : 'upload',
    invalidate: true,
  });
}

/**
 * Narrows a Cloudinary response down to the fields we store. Keeping the whole
 * response would bloat every document with data we never read.
 */
export function toAssetRecord(result) {
  if (!result) return undefined;
  return {
    publicId: result.public_id,
    url: result.secure_url,
    resourceType: result.resource_type,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    access: result.type === 'authenticated' ? 'authenticated' : 'public',
  };
}

export default cloudinary;
