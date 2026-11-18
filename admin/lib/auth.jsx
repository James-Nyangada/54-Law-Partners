'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api, setAccessToken, setUnauthorizedHandler } from './api';
import { Notice } from '@/components/ui';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  // Where to go after a deliberate sign-out. Null means the session simply
  // ended, in which case the login page offers to return to where you were.
  const [exitTo, setExitTo] = useState(null);

  const signOut = useCallback(async (destination = '/login') => {
    try {
      await api.post('/admin/auth/logout');
    } catch {
      // Signing out locally matters more than the request succeeding.
    }
    setAccessToken(null);
    setExitTo(typeof destination === 'string' ? destination : '/login');
    setUser(null);
  }, []);

  // On load, try the refresh cookie. If it works the person stays signed in
  // across a reload without anything sensitive sitting in storage.
  useEffect(() => {
    let cancelled = false;

    setUnauthorizedHandler(() => {
      setAccessToken(null);
      setUser(null);
    });

    api
      .refresh()
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const data = await api.post('/admin/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setExitTo(null);
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      checking,
      exitTo,
      signIn,
      signOut,
      isAdmin: user?.role === 'admin',
    }),
    [user, checking, exitTo, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

/** Wraps a screen limited to administrators. The API enforces it as well. */
export function RequireAdmin({ children }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <Notice tone="warning">
        That area is limited to administrators. Ask one of them if you need access.
      </Notice>
    );
  }

  return children;
}

/** Only same-site paths are honoured, so ?next= cannot send someone elsewhere. */
export function safeNext(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/';
  return value;
}
