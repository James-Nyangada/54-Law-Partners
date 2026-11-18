import Link from 'next/link';

/**
 * The handful of primitives every screen is built from. Tailwind classes live
 * here once, so a button looks the same on every page and changing it is one
 * edit.
 */

export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

/* --- buttons ------------------------------------------------------- */

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-xs border font-medium no-underline cursor-pointer ' +
  'transition-colors duration-200 ease-brand ' +
  // Tailwind emits disabled: after hover: and active:, so these win.
  'disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-transparent disabled:bg-disabled disabled:text-disabled-text';

const BUTTON_VARIANTS = {
  primary:
    'border-transparent bg-mint font-semibold text-onyx hover:bg-mint-bright hover:text-onyx active:translate-y-px active:bg-mint-pressed',
  secondary: 'border-line-raised bg-transparent text-bone hover:border-mint hover:bg-forest hover:text-bone',
  danger: 'border-danger bg-transparent text-danger-text hover:bg-danger hover:text-bone',
};

const BUTTON_SIZES = {
  md: 'min-h-11 px-[22px] py-[11px] text-[14.5px]',
  sm: 'min-h-[34px] px-3.5 py-1.5 text-[13px]',
};

export function buttonClass({ variant = 'secondary', size = 'md', className } = {}) {
  return cx(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className);
}

export function Button({ variant, size, className, type = 'button', ...props }) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...props} />;
}

export function LinkButton({ href, variant, size, className, ...props }) {
  return <Link href={href} className={buttonClass({ variant, size, className })} {...props} />;
}

/* --- surfaces ------------------------------------------------------ */

export function Card({ as: Tag = 'div', className, ...props }) {
  return <Tag className={cx('rounded-xs border border-line bg-panel p-[22px]', className)} {...props} />;
}

/** A card that is a link, for the dashboard tiles and the pages index. */
export function LinkCard({ href, className, ...props }) {
  return (
    <Link
      href={href}
      className={cx(
        'block rounded-xs border border-line bg-panel p-[22px] text-inherit no-underline transition-colors duration-200 ease-brand hover:border-line-raised hover:text-inherit',
        className
      )}
      {...props}
    />
  );
}

export function PanelTitle({ children, className }) {
  return <p className={cx('mb-3 text-[10.5px] uppercase tracking-[0.18em] text-mint', className)}>{children}</p>;
}

export function Notice({ children, tone = 'info', className }) {
  return (
    <div
      className={cx(
        'mb-[22px] border-l-[3px] bg-forest-deep px-5 py-4 text-sm text-sage',
        tone === 'warning' ? 'border-warning' : 'border-mint',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Empty({ children }) {
  return (
    <div className="rounded-xs border border-dashed border-line-raised px-6 py-12 text-center text-muted">
      {children}
    </div>
  );
}

/** A horizontal cluster of controls that wraps on narrow screens. */
export function Row({ className, ...props }) {
  return <div className={cx('flex flex-wrap items-center gap-3', className)} {...props} />;
}

export function Spacer() {
  return <div className="flex-auto" />;
}

/* --- badges -------------------------------------------------------- */

const BADGE_TONES = {
  default: 'border-line-raised text-muted',
  published: 'border-mint/40 text-mint',
  draft: 'border-warning/40 text-warning',
  new: 'border-mint bg-mint font-semibold text-onyx',
  external: 'border-dashed border-line-raised text-muted',
};

export function Badge({ tone = 'default', children }) {
  return (
    <span
      className={cx(
        'inline-block whitespace-nowrap rounded-xs border px-[9px] py-[3px] text-[10.5px] uppercase leading-normal tracking-[0.12em]',
        BADGE_TONES[tone]
      )}
    >
      {children}
    </span>
  );
}

/* --- form controls ------------------------------------------------- */

export function inputClass({ error = false, className } = {}) {
  return cx(
    'w-full rounded-xs border bg-onyx px-[13px] py-[11px] text-bone placeholder:text-muted',
    'transition-colors duration-200 ease-brand focus:border-mint focus:outline-none',
    'disabled:cursor-not-allowed disabled:border-line disabled:text-muted',
    error ? 'border-danger' : 'border-line-raised',
    className
  );
}

export const labelClass = 'text-[11px] uppercase tracking-[0.16em] text-sage';
export const hintClass = 'text-[12.5px] text-muted';
export const errorClass = 'text-[12.5px] text-danger-text';
export const checkboxClass = 'size-[18px] accent-emerald';
