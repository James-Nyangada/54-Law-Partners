"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ensureGsap, DURATION, EASE, prefersReducedMotion } from "@/lib/motion";

/**
 * Signature move 5 — cursor pull.
 *
 * The child eases toward the cursor with a lag rather than snapping to it, and
 * eases back to rest on leave. Disabled for coarse pointers and for visitors
 * who have asked for reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: ReactNode;
  /** Fraction of the cursor's offset from centre that the element travels. */
  strength?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const gsap = ensureGsap();
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const options = { duration: DURATION.cursor, ease: EASE };
    const xTo = gsap.quickTo(inner, "x", options);
    const yTo = gsap.quickTo(inner, "y", options);

    const onMove = (event: PointerEvent) => {
      const box = wrap.getBoundingClientRect();
      xTo((event.clientX - (box.left + box.width / 2)) * strength);
      yTo((event.clientY - (box.top + box.height / 2)) * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(inner);
    };
  }, [strength]);

  return (
    <span ref={wrapRef} className={className} style={{ display: "inline-block" }}>
      <span ref={innerRef} style={{ display: "inline-block", willChange: "transform" }}>
        {children}
      </span>
    </span>
  );
}
