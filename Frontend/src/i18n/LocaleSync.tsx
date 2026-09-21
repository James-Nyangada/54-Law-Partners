"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/motion";
import { useLocale } from "./useLocale";

/**
 * Keeps <html lang> in step with the chosen language, and re-measures the
 * scroll animations: French copy runs longer, so section heights change.
 */
export function LocaleSync() {
  const { locale } = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [locale]);

  return null;
}
