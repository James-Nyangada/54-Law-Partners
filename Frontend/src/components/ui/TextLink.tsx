import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow } from "./Arrow";

/**
 * A text link with an arrow. On hover the rule beneath draws from the left and
 * the arrow moves on. Colour follows the surface accent (mint on dark, forest
 * on bone).
 */
export function TextLink({
  href,
  children,
  className = "",
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group/link inline-flex items-center gap-2.5 text-[14.5px] font-medium text-[var(--accent)] ${className}`}
    >
      <span className="relative pb-1">
        {children}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 block h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100"
        />
      </span>
      {arrow ? (
        <Arrow className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-1.5" />
      ) : null}
    </Link>
  );
}
