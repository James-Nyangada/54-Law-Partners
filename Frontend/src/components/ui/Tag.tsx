import type { ReactNode } from "react";
import { ArrowOut } from "./Arrow";

/**
 * Tags, per the UI kit: a solid outline is a practice area; a dashed outline
 * with an arrow marks a piece published elsewhere; a filled tag is selected.
 */
export function Tag({
  children,
  kind = "practice",
  className = "",
}: {
  children: ReactNode;
  kind?: "practice" | "external" | "selected";
  className?: string;
}) {
  const look =
    kind === "external"
      ? "border-dashed border-current/45 text-[var(--muted-text)]"
      : kind === "selected"
        ? "border-mint bg-mint text-onyx"
        : "border-current/30 text-[var(--accent)]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-[5px] text-[10.5px] font-semibold uppercase leading-none tracking-[0.14em] ${look} ${className}`}
    >
      {children}
      {kind === "external" ? <ArrowOut className="size-2" /> : null}
    </span>
  );
}

export function Eyebrow({ children, className = "", ...rest }: { children: ReactNode; className?: string } & Record<string, unknown>) {
  return (
    <p className={`eyebrow text-[var(--accent)] ${className}`} {...rest}>
      {children}
    </p>
  );
}
