"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Generic cinematic scroll engine for sub-pages: nav-solid, fade-up reveals,
 * line-mask headings, curtain image reveals, parallax and stat counters.
 * (The home page uses ScrollFX, which adds hero-intro + horizontal pinning.)
 */
export default function PageFX() {
  useEffect(() => {
    const reduced = prefersReducedMotion();

    const navST = ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onUpdate: (s) =>
        document
          .getElementById("nav")
          ?.classList.toggle("solid", s.scroll() > 80),
    });

    // stat counters
    const counters: ScrollTrigger[] = [];
    document.querySelectorAll<HTMLElement>(".count").forEach((el) => {
      const to = +(el.dataset.to || "0");
      counters.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter() {
            if (reduced) return void (el.textContent = String(to));
            gsap.to(
              { v: 0 },
              {
                v: to,
                duration: 1.6,
                ease: "power2.out",
                onUpdate() {
                  el.textContent = String(
                    Math.round((this.targets()[0] as { v: number }).v)
                  );
                },
              }
            );
          },
        })
      );
    });

    if (reduced) {
      return () => {
        navST.kill();
        counters.forEach((c) => c.kill());
      };
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-rev]").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((el) => {
        gsap.to(el, {
          y: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-curtain]").forEach((c) => {
        const img = c.querySelector("img");
        gsap
          .timeline({ scrollTrigger: { trigger: c, start: "top 84%" } })
          .to(c, { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "expo.inOut" })
          .to(img, { scale: 1, duration: 1.6, ease: "expo.out" }, 0);
        gsap.to(img, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: c,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // generic parallax: [data-parallax="<px>"]
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amt = +(el.dataset.parallax || "60");
        gsap.fromTo(
          el,
          { y: -amt },
          {
            y: amt,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // hero background drift: [data-hero-bg]
      gsap.utils.toArray<HTMLElement>("[data-hero-bg]").forEach((el) => {
        gsap.to(el, {
          yPercent: 14,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      ctx.revert();
      navST.kill();
      counters.forEach((c) => c.kill());
      window.removeEventListener("load", onLoad);
      clearTimeout(t);
    };
  }, []);

  return null;
}
