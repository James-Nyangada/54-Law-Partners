import dotenv from 'dotenv';

dotenv.config();

/**
 * Reads an environment variable, failing loudly at boot when a required one
 * is missing. A server that starts without its database URI and only breaks
 * on the first request is far harder to diagnose than one that refuses to
 * start at all.
 */
function required(key) {
  const value = process.env[key];
  if (!value || !String(value).trim()) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `Copy server/.env.example to server/.env and fill it in.`
    );
  }
  return String(value).trim();
}

function optional(key, fallback = '') {
  const value = process.env[key];
  return value === undefined || value === '' ? fallback : String(value).trim();
}

function number(key, fallback) {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function list(key, fallback = []) {
  const raw = optional(key);
  if (!raw) return fallback;
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  port: number('PORT', 5000),
  corsOrigins: list('CORS_ORIGINS', ['http://localhost:3001', 'http://localhost:3000']),

  mongoUri: required('MONGODB_URI'),

  accessSecret: required('JWT_ACCESS_SECRET'),
  refreshSecret: required('JWT_REFRESH_SECRET'),
  accessExpires: optional('JWT_ACCESS_EXPIRES', '15m'),
  refreshExpires: optional('JWT_REFRESH_EXPIRES', '7d'),
  cookieDomain: optional('COOKIE_DOMAIN'),

  cloudinary: {
    cloudName: required('CLOUDINARY_CLOUD_NAME'),
    apiKey: required('CLOUDINARY_API_KEY'),
    apiSecret: required('CLOUDINARY_API_SECRET'),
    rootFolder: optional('CLOUDINARY_ROOT_FOLDER', '54lp'),
  },

  seedAdmin: {
    name: optional('SEED_ADMIN_NAME'),
    email: optional('SEED_ADMIN_EMAIL'),
    password: optional('SEED_ADMIN_PASSWORD'),
  },

  maxImageBytes: number('MAX_IMAGE_MB', 8) * 1024 * 1024,
  maxDocumentBytes: number('MAX_DOCUMENT_MB', 20) * 1024 * 1024,

  enquiryRetentionDays: number('ENQUIRY_RETENTION_DAYS', 0),
  applicationRetentionDays: number('APPLICATION_RETENTION_DAYS', 0),
};

export const isProduction = env.nodeEnv === 'production';
