import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Arrow } from "./Arrow";

type Variant = "primary" | "secondary" | "secondary-light" | "dark";

/*
 * Buttons, per the UI kit: 2px radius, 0.3s on the settle curve, 44px minimum
 * target, and every state drawn (default, hover, pressed, disabled).
 */
const BASE =
  "group/button relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-[2px] px-6 text-[14.5px] font-medium leading-none transition-[background-color,border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-px disabled:pointer-events-none";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-mint text-onyx hover:bg-mint-light active:bg-mint-dark disabled:bg-line-dark disabled:text-sage/50",
  secondary:
    "border border-line-raised text-bone hover:border-emerald hover:bg-forest active:bg-forest-deep disabled:text-sage/40",
  "secondary-light":
    "border border-onyx/25 text-onyx hover:border-onyx hover:bg-onyx hover:text-bone active:bg-forest disabled:text-muted/60",
  dark: "bg-forest text-bone hover:bg-onyx active:bg-forest-deep disabled:opacity-50",
};

export function buttonClass(variant: Variant = "primary", className = "") {
  return `${BASE} ${VARIANTS[variant]} ${className}`;
}

/** The label slides up and out while a copy rises from below. */
function Label({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span className="relative block overflow-hidden py-[2px]">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/button:-translate-y-[110%]">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-[2px] block translate-y-[110%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/button:translate-y-0"
        >
          {children}
        </span>
      </span>
      {arrow ? (
        <Arrow className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/button:translate-x-1" />
      ) : null}
    </>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  arrow,
  className,
  children,
  ...rest
}: { variant?: Variant; arrow?: boolean } & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      <Label arrow={arrow}>{children as ReactNode}</Label>
    </Link>
  );
}

export function Button({
  variant = "primary",
  arrow,
  className,
  children,
  ...rest
}: { variant?: Variant; arrow?: boolean } & ComponentProps<"button">) {
  return (
    <button className={buttonClass(variant, className)} {...rest}>
      <Label arrow={arrow}>{children}</Label>
    </button>
  );
}
