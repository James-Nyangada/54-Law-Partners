"use client";

import { useSyncExternalStore } from "react";
import { LOCALES, type Locale } from "./types";
import { en } from "./en";
import { fr } from "./fr";

const DICTIONARIES = { en, fr };
const STORAGE_KEY = "54lp-locale";

let current: Locale | null = null;
const listeners = new Set<() => void>();

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** A shared link (?lang=fr) wins, then the visitor's last choice, then English. */
function initial(): Locale {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (isLocale(fromUrl)) return fromUrl;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Storage can be unavailable (private windows, blocked site data).
  }
  return "en";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Locale {
  if (current === null) current = initial();
  return current;
}

/** The server always renders English; the client catches up after hydration. */
function getServerSnapshot(): Locale {
  return "en";
}

export function setLocale(locale: Locale) {
  if (locale === current) return;
  current = locale;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Not remembered; the switch still applies to this visit.
  }
  listeners.forEach((listener) => listener());
}

/** The active locale and its dictionary. */
export function useLocale() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { locale, t: DICTIONARIES[locale], setLocale };
}
