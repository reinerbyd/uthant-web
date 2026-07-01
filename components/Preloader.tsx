"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

declare global {
  interface Window {
    __introDone?: boolean;
  }
}

function fireIntroDone() {
  if (typeof window === "undefined") return;
  window.__introDone = true;
  window.dispatchEvent(new Event("intro-done"));
}

/** Counter + letter-rise preloader. Marks the intro done so Hero can play. */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Guard against Strict-Mode / HMR double-invocation of the effect.
    if (started.current) return;
    started.current = true;

    if (prefersReducedMotion()) {
      fireIntroDone();
      setGone(true);
      return;
    }

    const el = root.current!;
    const finish = () => {
      setGone(true);
      ScrollTrigger.refresh();
    };

    // Hard safety net: never let the curtain trap the page.
    const failSafe = window.setTimeout(() => {
      fireIntroDone();
      finish();
    }, 4200);

    const letters = el.querySelectorAll(".lbig span");
    const count = el.querySelector<HTMLElement>(".lcount")!;
    const bar = el.querySelector<HTMLElement>(".lbar")!;

    letters.forEach((l, i) =>
      gsap.to(l, { y: 0, duration: 1, ease: "expo.out", delay: 0.1 + i * 0.07 })
    );

    const p = { v: 0 };
    gsap.to(p, {
      v: 100,
      duration: 1.9,
      ease: "power2.inOut",
      delay: 0.2,
      onUpdate() {
        const v = Math.round(p.v);
        count.textContent = String(v);
        bar.style.width = v + "%";
      },
      onComplete() {
        gsap.to(el, {
          yPercent: -100,
          duration: 1.1,
          ease: "expo.inOut",
          delay: 0.15,
          onStart: fireIntroDone,
          onComplete() {
            window.clearTimeout(failSafe);
            finish();
          },
        });
      },
    });

    // NOTE: intentionally no gsap cleanup/revert here — reverting mid-lift
    // would strand the curtain on screen during Strict-Mode/HMR remounts.
  }, []);

  if (gone) return null;

  return (
    <div className="loader" ref={root} aria-hidden>
      <div className="lbig">
        {"UTHANT".split("").map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <div className="lcount mono">0</div>
      <div className="lbar" />
    </div>
  );
}
