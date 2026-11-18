'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Button, cx } from './ui';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || '54 Law Partners';

const SECTIONS = [
  {
    label: 'Publish',
    links: [
      { href: '/', label: 'Dashboard', exact: true },
      { href: '/insights', label: 'Insights' },
      { href: '/practice-areas', label: 'Practice areas' },
      { href: '/people', label: 'Our people' },
      { href: '/matters', label: 'Representative matters' },
      { href: '/pages', label: 'Pages' },
    ],
  },
  {
    label: 'Inbox',
    links: [
      { href: '/enquiries', label: 'Enquiries', countKey: 'newEnquiries' },
      { href: '/careers', label: 'Careers' },
      { href: '/applications', label: 'Applications', countKey: 'newApplications' },
    ],
  },
  {
    label: 'Manage',
    links: [
      { href: '/media', label: 'Media' },
      { href: '/settings', label: 'Settings', adminOnly: true },
      { href: '/users', label: 'Users', adminOnly: true },
      { href: '/account', label: 'Your account' },
    ],
  },
];

const TITLES = Object.fromEntries(SECTIONS.flatMap((section) => section.links.map((link) => [link.href, link.label])));

function isActive(pathname, link) {
  if (link.exact) return pathname === link.href;
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

export function Shell({ children }) {
  const { user, signOut, isAdmin } = useAuth();
  const pathname = usePathname();
  const [queue, setQueue] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  // Refresh the inbox counts on navigation, so the sidebar badge is not stale
  // after someone reads an enquiry. Closing the mobile menu rides along.
  useEffect(() => {
    setMenuOpen(false);
    api
      .get('/admin/summary')
      .then((data) => setQueue(data.queue ?? {}))
      .catch(() => setQueue({}));
  }, [pathname]);

  const title = TITLES[`/${pathname.split('/')[1] || ''}`] || 'Dashboard';

  return (
    <div className="flex min-h-full">
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-40 w-[236px] flex-none flex-col gap-1 overflow-y-auto border-r border-line bg-onyx-raised px-4 py-6',
          'md:sticky md:top-0 md:flex md:h-screen',
          menuOpen ? 'flex' : 'hidden'
        )}
      >
        <div className="mb-3.5 border-b border-line px-2.5 pb-5 font-display text-[19px] font-semibold text-bone">
          {APP_NAME}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="px-2.5 pb-[7px] pt-[18px] text-[10.5px] uppercase tracking-[0.18em] text-muted">
              {section.label}
            </div>
            {section.links
              .filter((link) => !link.adminOnly || isAdmin)
              .map((link) => {
                const active = isActive(pathname, link);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cx(
                      'flex items-center justify-between gap-2.5 rounded-xs px-2.5 py-[9px] text-[14.5px] transition-colors duration-200 ease-brand',
                      active ? 'bg-forest text-bone hover:text-bone' : 'text-sage hover:bg-panel hover:text-bone'
                    )}
                  >
                    <span>{link.label}</span>
                    {link.countKey && queue[link.countKey] > 0 && (
                      <span className="rounded-full bg-mint px-2 py-px text-[11.5px] font-semibold text-onyx">
                        {queue[link.countKey]}
                      </span>
                    )}
                  </Link>
                );
              })}
          </div>
        ))}
      </aside>

      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-auto flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-line bg-onyx px-4 py-[18px] md:gap-[18px] md:px-8">
          <Button size="sm" className="md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            Menu
          </Button>
          <h1 className="text-[21px]">{title}</h1>
          <div className="flex-auto" />
          <span className="hidden text-[13px] text-muted sm:inline">
            {user?.name} · {user?.role}
          </span>
          <Button size="sm" onClick={() => signOut()}>
            Sign out
          </Button>
        </header>

        <main className="flex-auto px-4 pb-[72px] pt-7 md:px-8">{children}</main>
      </div>
    </div>
  );
}
