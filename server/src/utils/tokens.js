import jwt from 'jsonwebtoken';
import { env, isProduction } from '../config/env.js';

export const REFRESH_COOKIE = 'lp_refresh';

export function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user._id), email: user.email, role: user.role },
    env.accessSecret,
    { expiresIn: env.accessExpires }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    { sub: String(user._id), v: user.tokenVersion },
    env.refreshSecret,
    { expiresIn: env.refreshExpires }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.accessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.refreshSecret);
}

/**
 * The refresh token goes in an httpOnly cookie, so no script in the admin app
 * can read it. The short-lived access token is held in memory by the admin and
 * never written to localStorage, where an injected script could take it.
 */
export function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    domain: env.cookieDomain || undefined,
    path: '/api/admin/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    domain: env.cookieDomain || undefined,
    path: '/api/admin/auth',
  });
}
