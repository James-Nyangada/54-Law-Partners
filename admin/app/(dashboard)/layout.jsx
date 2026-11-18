'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Shell } from '@/components/Shell';
import { Empty } from '@/components/ui';

/**
 * Everything behind sign-in. The access token only ever exists in memory, so
 * the check happens in the browser: on load the AuthProvider trades the
 * httpOnly refresh cookie for a token, and until that settles nothing renders.
 * The API enforces every permission on its own regardless.
 */
export default function DashboardLayout({ children }) {
  const { user, checking, exitTo } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (checking || user) return;

    // A deliberate sign-out goes where it asked to, never back to this page —
    // the next person to sign in should not land on the last person's screen.
    if (exitTo) {
      router.replace(exitTo);
      return;
    }

    // The session ended on its own: offer to come back here after signing in.
    const next = pathname && pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : '';
    router.replace(`/login${next}`);
  }, [checking, user, exitTo, pathname, router]);

  if (checking || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-[13px] text-muted">Checking your session…</p>
      </div>
    );
  }

  return (
    <Shell>
      <Suspense fallback={<Empty>Loading…</Empty>}>{children}</Suspense>
    </Shell>
  );
}
