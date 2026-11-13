"use client";

import { createContext, createElement, useContext, type ReactNode } from "react";
import type { Locale } from "./types";
import { getDictionary } from "./dictionaries";

const LocaleContext = createContext<Locale>("en");

/** Set by each root layout: English at the root, French under /fr. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return createElement(LocaleContext.Provider, { value: locale }, children);
}

/** The page's language and its dictionary. */
export function useLocale() {
  const locale = useContext(LocaleContext);
  return { locale, t: getDictionary(locale) };
}
