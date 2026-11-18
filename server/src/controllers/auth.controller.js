import { User } from '../models/User.js';
import { recordAudit } from '../models/AuditLog.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
  REFRESH_COOKIE,
} from '../utils/tokens.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+passwordHash');

  // One message for both a wrong address and a wrong password, so the response
  // cannot be used to discover which addresses have accounts.
  const invalid = ApiError.unauthorized('Those details are not right');
  if (!user || !user.isActive) throw invalid;

  const ok = await user.verifyPassword(password);
  if (!ok) throw invalid;

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = signAccessToken(user);
  setRefreshCookie(res, signRefreshToken(user));

  recordAudit({
    req: { user: { id: String(user._id), email: user.email } },
    action: 'login',
    collectionName: 'User',
    documentId: user._id,
    summary: 'Signed in',
  });

  res.json({ accessToken, user: user.toJSON() });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw ApiError.unauthorized('Your session has expired');

  const payload = verifyRefreshToken(token);
  const user = await User.findById(payload.sub);

  if (!user || !user.isActive) throw ApiError.unauthorized('That account is no longer active');

  // tokenVersion is bumped on every password change, which retires every
  // refresh token issued before it.
  if (payload.v !== user.tokenVersion) {
    clearRefreshCookie(res);
    throw ApiError.unauthorized('Your session has ended. Sign in again.');
  }

  setRefreshCookie(res, signRefreshToken(user));
  res.json({ accessToken: signAccessToken(user), user: user.toJSON() });
});

export const logout = asyncHandler(async (_req, res) => {
  clearRefreshCookie(res);
  res.status(204).end();
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw ApiError.unauthorized();
  res.json(user.toJSON());
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+passwordHash');
  if (!user) throw ApiError.unauthorized();

  const ok = await user.verifyPassword(currentPassword);
  if (!ok) throw ApiError.badRequest('Your current password is not right');

  await user.setPassword(newPassword);
  await user.save();

  // Changing the password retires every session, this one included.
  clearRefreshCookie(res);

  recordAudit({
    req,
    action: 'update',
    collectionName: 'User',
    documentId: user._id,
    summary: 'Changed own password',
  });

  res.json({ ok: true, message: 'Password changed. Sign in again.' });
});
