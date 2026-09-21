import type { ReactNode } from "react";
import { Arrow } from "./Arrow";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * A bare text link. On hover the arrow travels 8px right while a rule wipes in
 * beneath the words from the left.
 */
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-4 text-[13px] uppercase tracking-[0.16em] ${className}`}
    >
      <span className="relative py-1.5">
        {children}
        <span
          aria-hidden="true"
          className={`absolute bottom-0 left-0 block h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ${EASE_CLASS} group-hover:scale-x-100 group-focus-visible:scale-x-100`}
        />
      </span>
      <Arrow
        className={`transition-transform duration-500 ${EASE_CLASS} group-hover:translate-x-2 group-focus-visible:translate-x-2`}
      />
    </a>
  );
}
