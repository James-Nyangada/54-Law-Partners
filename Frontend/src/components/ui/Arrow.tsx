/** A thin arrow drawn to match the 1px rules used across the page. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 22 10"
      className={className}
      width="22"
      height="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M0 5h20.5M16.5 1l4 4-4 4" />
    </svg>
  );
}

/** The outward arrow, for links that leave the site. */
export function ArrowOut({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={className}
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M1 11 11 1M3.5 1H11v7.5" />
    </svg>
  );
}
