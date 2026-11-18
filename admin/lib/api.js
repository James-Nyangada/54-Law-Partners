const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * The access token is held in this module, in memory only.
 *
 * It is deliberately NOT in localStorage: anything stored there can be read by
 * any script that gets injected into the page. The refresh token lives in an
 * httpOnly cookie the browser sends automatically, so a reload re-authenticates
 * without the token ever being readable from JavaScript.
 */
let accessToken = null;
let onUnauthorized = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function parse(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

let refreshing = null;

/** Trades the refresh cookie for a new access token, once at a time. */
async function refreshAccessToken() {
  if (!refreshing) {
    refreshing = fetch(`${BASE}/admin/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) throw new ApiError('Session expired', 401);
        const data = await parse(response);
        accessToken = data.accessToken;
        return data;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

async function send(path, { method = 'GET', body, isForm = false, retry = true } = {}) {
  const config = {
    method,
    credentials: 'include',
    headers: {},
  };

  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

  if (body !== undefined) {
    if (isForm) {
      config.body = body; // let the browser set the multipart boundary
    } else {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    }
  }

  let response;
  try {
    response = await fetch(`${BASE}${path}`, config);
  } catch {
    throw new ApiError('Could not reach the server. Check that the API is running.', 0);
  }

  // One silent refresh-and-retry, so a fifteen-minute token never interrupts
  // someone mid-sentence in the article editor.
  if (response.status === 401 && retry && !path.includes('/auth/')) {
    try {
      await refreshAccessToken();
    } catch {
      onUnauthorized?.();
      throw new ApiError('Your session has expired. Sign in again.', 401);
    }
    return send(path, { method, body, isForm, retry: false });
  }

  const data = await parse(response);

  if (!response.ok) {
    throw new ApiError(
      data?.error?.message || 'Something went wrong',
      response.status,
      data?.error?.details
    );
  }

  return data;
}

export const api = {
  get: (path) => send(path),
  post: (path, body) => send(path, { method: 'POST', body }),
  patch: (path, body) => send(path, { method: 'PATCH', body }),
  put: (path, body) => send(path, { method: 'PUT', body }),
  del: (path) => send(path, { method: 'DELETE' }),
  upload: (path, formData) => send(path, { method: 'POST', body: formData, isForm: true }),
  refresh: refreshAccessToken,
};
