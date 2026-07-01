"use client";

import { useEffect, useRef } from "react";
import { SCHOOLS } from "@/lib/content";
import { isTouch } from "@/lib/gsap";

export default function Schools() {
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch()) return;
    const list = listRef.current!;
    const preview = previewRef.current!;
    const imgs = Array.from(preview.querySelectorAll<HTMLElement>(".sp-img"));
    const rows = Array.from(list.querySelectorAll<HTMLElement>(".school-row"));

    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const show = (i: number) => {
      preview.classList.add("on");
      imgs.forEach((im, k) => im.classList.toggle("active", k === i));
    };
    const hide = () => preview.classList.remove("on");

    rows.forEach((r, i) => r.addEventListener("mouseenter", () => show(i)));
    list.addEventListener("mousemove", onMove);
    list.addEventListener("mouseleave", hide);

    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      // offset up-right of the cursor, kept on screen
      preview.style.transform = `translate(${cx}px, ${cy}px) translate(-110%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      list.removeEventListener("mousemove", onMove);
      list.removeEventListener("mouseleave", hide);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="pad-y" id="schools">
      <div className="wrap">
        <p className="eyebrow reveal" data-rev data-i18n="schools.eyebrow">
          Within reach
        </p>
        <h2
          className="intro-head reveal"
          data-rev
          data-i18n="schools.h"
          style={{ marginTop: 22, maxWidth: "24ch" }}
        >
          Five international schools, all on the doorstep.
        </h2>
        <div className="schools-grid" ref={listRef}>
          {SCHOOLS.map((s) => (
            <a className="school-row" key={s.n} data-cursor="view">
              <span className="n mono">{s.n}</span>
              <span className="t">{s.t}</span>
              <span
                className="tag"
                data-i18n={s.tag === "Early years" ? "schools.tagEarly" : "schools.tagInternational"}
              >
                {s.tag}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* cursor-following cinematic image preview (desktop) */}
      <div className="school-preview" ref={previewRef} aria-hidden>
        {SCHOOLS.map((s, i) => (
          <div
            key={s.n}
            className={`sp-img${i === 0 ? " active" : ""}`}
            style={{ backgroundImage: `url(${s.img})` }}
          />
        ))}
      </div>
    </section>
  );
}
