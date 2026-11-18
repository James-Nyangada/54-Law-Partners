'use client';

import { useState } from 'react';
import { Notice, cx } from './ui';

/**
 * English and French side by side, as tabs.
 *
 * French is never required. The firm publishes weekly, and blocking an English
 * article because nobody has translated it yet is how a weekly cadence dies in
 * its third week. An untranslated page falls back to English on the site.
 */
export function BilingualTabs({ children, frenchReady }) {
  const [locale, setLocale] = useState('en');

  const tab = (value, label) => (
    <button
      type="button"
      role="tab"
      aria-selected={locale === value}
      className={cx(
        'cursor-pointer border-0 border-b-2 bg-transparent px-[18px] py-2.5 text-sm transition-colors',
        locale === value ? 'border-emerald text-bone' : 'border-transparent text-muted hover:text-sage'
      )}
      onClick={() => setLocale(value)}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-[22px] flex gap-0.5 border-b border-line" role="tablist">
        {tab('en', 'English')}
        {tab('fr', `Français${frenchReady ? '' : ' ·'}`)}
      </div>

      {locale === 'fr' && (
        <Notice>
          French is optional. Leave it empty and the site shows the English version at the French
          address — the page still works, and you can translate it later.
        </Notice>
      )}

      {children(locale)}
    </div>
  );
}
