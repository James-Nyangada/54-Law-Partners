'use client';

import { ToastProvider } from '@/components/Toast';
import { AuthProvider } from '@/lib/auth';

export function Providers({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
