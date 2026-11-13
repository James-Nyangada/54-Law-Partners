/** A thin arrow drawn to match the 1px rules. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 10" width="16" height="10" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <path d="M0 5h14.5M10.5 1l4 4-4 4" />
    </svg>
  );
}

/** The outward arrow, for pieces published elsewhere. */
export function ArrowOut({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <path d="M1 9 9 1M2.5 1H9v6.5" />
    </svg>
  );
}
