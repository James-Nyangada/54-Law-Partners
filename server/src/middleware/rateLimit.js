import rateLimit from 'express-rate-limit';

/**
 * The public endpoints that write something. Without these, the enquiry form
 * is an open door for anyone with a script.
 */
export const publicWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { message: 'Too many submissions. Try again shortly.' } },
});

/** Login attempts, to slow password guessing. */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { message: 'Too many attempts. Wait a few minutes.' } },
});

/** A generous ceiling on everything else. */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 240,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
