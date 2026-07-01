"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALE_LIST, getLocale, setLocale, type LocaleKey } from "@/lib/i18n";

export default function LocaleSwitcher() {
  const [open, setOpen] = useState(false);
  const [loc, setLoc] = useState<LocaleKey>("en");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoc(getLocale());
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const current = LOCALE_LIST.find((l) => l.key === loc) ?? LOCALE_LIST[0];

  const choose = (k: LocaleKey) => {
    setLoc(k);
    setLocale(k);
    setOpen(false);
  };

  return (
    <div className="locale" ref={ref} data-cursor="ignore">
      <button
        className="locale-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select country and language"
      >
        <span className="locale-flag">{current.flag}</span>
        <span className="locale-code">{current.code}</span>
        <svg className={`locale-chev ${open ? "up" : ""}`} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="locale-menu" role="listbox">
          {LOCALE_LIST.map((l) => (
            <li key={l.key}>
              <button
                role="option"
                aria-selected={l.key === loc}
                className={`locale-item ${l.key === loc ? "on" : ""}`}
                onClick={() => choose(l.key)}
              >
                <span className="locale-flag">{l.flag}</span>
                <span className="locale-label">{l.label}</span>
                {l.key === loc && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
