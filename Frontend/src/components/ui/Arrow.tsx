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
