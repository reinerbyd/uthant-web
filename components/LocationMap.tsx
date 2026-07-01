"use client";

import { useState } from "react";
import { LOCATION } from "@/lib/content";

/** Stylised, dependency-free location map: amenity pins + travel-time list, linked on hover. */
export default function LocationMap() {
  const [active, setActive] = useState<number | null>(null);
  const a = LOCATION.amenities;

  return (
    <div className="locmap">
      <div className="locmap-map" aria-hidden>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="lm-grid">
          {[18, 32, 46].map((r) => (
            <circle key={r} cx="50" cy="50" r={r} />
          ))}
          <line x1="50" y1="0" x2="50" y2="100" />
          <line x1="0" y1="50" x2="100" y2="50" />
          <line x1="14" y1="86" x2="86" y2="14" />
        </svg>

        <div className="lm-center">
          <span className="lm-center-dot" />
          <span className="lm-center-label">U Thant</span>
        </div>

        {a.map((m, i) => (
          <button
            key={m.name}
            className={`lm-pin ${active === i ? "on" : ""}`}
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            data-cursor="ignore"
            aria-label={`${m.name}, ${m.mins} minutes`}
          >
            <span className="lm-pin-dot" />
            <span className="lm-pin-tip">
              {m.name} · {m.mins} min
            </span>
          </button>
        ))}
      </div>

      <div className="locmap-list">
        {a.map((m, i) => (
          <button
            key={m.name}
            className={`lm-row ${active === i ? "on" : ""}`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            data-cursor="ignore"
          >
            <span className="lm-cat">{m.cat}</span>
            <span className="lm-name">{m.name}</span>
            <span className="lm-mins">
              {m.mins}
              <i>min</i>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
