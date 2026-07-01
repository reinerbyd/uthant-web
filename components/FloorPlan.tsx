"use client";

import { useState } from "react";
import { FLOOR_ROOMS } from "@/lib/content";

/** Interactive schematic floor plan — selecting a room updates the spec panel. */
export default function FloorPlan({ builtUp }: { builtUp: string }) {
  const [active, setActive] = useState(FLOOR_ROOMS[0].id);
  const room = FLOOR_ROOMS.find((r) => r.id === active)!;
  const total = FLOOR_ROOMS.reduce((s, r) => s + r.area, 0);

  return (
    <div className="floorplan">
      <div className="fp-plan">
        <svg viewBox="-2 -2 124 84" role="img" aria-label="Residence floor plan">
          {FLOOR_ROOMS.map((r) => {
            const on = r.id === active;
            return (
              <g
                key={r.id}
                className={`fp-room ${on ? "active" : ""}`}
                onMouseEnter={() => setActive(r.id)}
                onClick={() => setActive(r.id)}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(r.id)}
                data-cursor="open"
              >
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="1.5" />
                <text x={r.x + r.w / 2} y={r.y + r.h / 2} className="fp-label">
                  {r.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="fp-panel">
        <div className="fp-total">
          <span className="fp-k">Total built-up</span>
          <span className="fp-total-v">{builtUp}</span>
        </div>
        <div className="fp-detail" key={room.id}>
          <span className="fp-room-name">{room.label}</span>
          <span className="fp-room-area">
            {room.area.toLocaleString()} <span className="sq">sq ft</span>
          </span>
          <p className="fp-room-note">{room.note}</p>
        </div>
        <div className="fp-bars">
          {FLOOR_ROOMS.map((r) => (
            <button
              key={r.id}
              className={`fp-bar ${r.id === active ? "active" : ""}`}
              onClick={() => setActive(r.id)}
              data-cursor="ignore"
            >
              <span className="fp-bar-label">{r.label}</span>
              <span className="fp-bar-track">
                <span className="fp-bar-fill" style={{ width: `${(r.area / total) * 100}%` }} />
              </span>
              <span className="fp-bar-area">{r.area.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
