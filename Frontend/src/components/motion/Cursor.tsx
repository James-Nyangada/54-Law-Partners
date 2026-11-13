"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ensureGsap, EASE, finePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * A quiet companion to the system cursor, for mouse and trackpad only.
 *
 * A small ring trails the pointer. Over links and buttons it closes into a
 * dot; over anything marked data-cursor="View" it opens into a mint disc
 * carrying that word. The native cursor is never hidden.
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion() || !finePointer()) return;
    const gsap = ensureGsap();
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!ring || !label) return;

    gsap.set(ring, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const xTo = gsap.quickTo(ring, "x", { duration: 0.45, ease: EASE });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.45, ease: EASE });

    let state = "";
    const setState = (next: string, text = "") => {
      if (next === state) return;
      state = next;
      label.textContent = text;
      if (next === "label") {
        gsap.to(ring, { width: 88, height: 88, backgroundColor: "#6fcfa0", borderColor: "rgba(111,207,160,0)", duration: 0.45, ease: EASE });
        gsap.to(label, { autoAlpha: 1, scale: 1, duration: 0.35, ease: EASE, delay: 0.05 });
      } else if (next === "link") {
        gsap.to(ring, { width: 10, height: 10, backgroundColor: "#6fcfa0", borderColor: "rgba(111,207,160,0)", duration: 0.35, ease: EASE });
        gsap.to(label, { autoAlpha: 0, scale: 0.6, duration: 0.2 });
      } else if (next === "hidden") {
        gsap.to(ring, { autoAlpha: 0, duration: 0.2 });
      } else {
        gsap.to(ring, { width: 30, height: 30, backgroundColor: "rgba(111,207,160,0)", borderColor: "rgba(111,207,160,0.7)", autoAlpha: 1, duration: 0.45, ease: EASE });
        gsap.to(label, { autoAlpha: 0, scale: 0.6, duration: 0.2 });
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      xTo(event.clientX);
      yTo(event.clientY);
      const target = event.target as Element | null;
      const labelled = target?.closest?.("[data-cursor]") as HTMLElement | null;
      if (target?.closest?.("input, textarea, select, iframe")) setState("hidden");
      else if (labelled) setState("label", labelled.dataset.cursor ?? "");
      else if (target?.closest?.("a, button, [role='button'], label")) setState("link");
      else setState("rest");
      if (state !== "hidden") gsap.to(ring, { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
    };
    const onLeave = () => gsap.to(ring, { autoAlpha: 0, duration: 0.3 });
    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.4, ease: EASE });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  // A new page: back to rest, whatever the pointer was over.
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || !finePointer()) return;
    ensureGsap().set(labelRef.current, { autoAlpha: 0 });
  }, [pathname]);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden size-[30px] items-center justify-center rounded-full border border-mint/70 roomy:flex"
      style={{ visibility: "hidden" }}
    >
      <span ref={labelRef} className="eyebrow text-[10.5px] text-onyx opacity-0" />
    </div>
  );
}
