'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Filters and page numbers live in the URL, so a filtered list survives a
 * reload and can be linked to (the dashboard tiles link to ?status=new).
 */
export function useQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const get = useCallback((key, fallback = '') => searchParams.get(key) || fallback, [searchParams]);

  /** Sets one parameter. Changing any filter sends the list back to page one. */
  const set = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== 'page') next.delete('page');
      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [searchParams, router, pathname]
  );

  return { get, set };
}
