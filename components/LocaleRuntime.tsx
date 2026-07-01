"use client";

import { useEffect } from "react";
import {
  applyLocale,
  getLocale,
  setContentI18n,
  setLocale,
  hasSavedLocale,
  countryToLocale,
} from "@/lib/i18n";

/** Applies the saved locale (translations + currency + editable content),
 *  and auto-detects country/language from IP on the first visit. */
export default function LocaleRuntime() {
  useEffect(() => {
    applyLocale(getLocale());
    const t = setTimeout(() => applyLocale(getLocale()), 300);

    // load admin-authored per-language content overrides
    fetch("/api/i18n-content")
      .then((r) => r.json())
      .then((map) => setContentI18n(map))
      .catch(() => {});

    // first visit → detect country by IP and set language + currency
    if (!hasSavedLocale()) {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 3500);
      fetch("https://get.geojs.io/v1/ip/country.json", { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => {
          clearTimeout(to);
          const loc = countryToLocale(d?.country || d?.country_code || "");
          if (!hasSavedLocale()) setLocale(loc); // still unset → apply + persist
        })
        .catch(() => {});
    }

    const onChange = () => applyLocale(getLocale());
    window.addEventListener("localechange", onChange);
    return () => {
      clearTimeout(t);
      window.removeEventListener("localechange", onChange);
    };
  }, []);
  return null;
}
