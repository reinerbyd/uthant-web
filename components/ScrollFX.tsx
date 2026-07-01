"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion, isTouch } from "@/lib/gsap";

/**
 * Central scroll-animation engine. Queries the DOM once everything is mounted
 * and wires every ScrollTrigger effect — mirroring a hand-authored GSAP setup
 * but kept in one place so section components stay declarative.
 */
export default function ScrollFX() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const touch = isTouch();
    const folio = document.querySelector<HTMLElement>(".folio");

    // ---- NAV solid state (works regardless of motion pref) ----
    const navST = ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onUpdate: (s) =>
        document.getElementById("nav")?.classList.toggle("solid", s.scroll() > 80),
    });

    // ---- STAT counters (cheap; keep even in reduced motion) ----
    const counters: ScrollTrigger[] = [];
    document.querySelectorAll<HTMLElement>(".count").forEach((el) => {
      const to = +(el.dataset.to || "0");
      counters.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter() {
            if (reduced) {
              el.textContent = String(to);
              return;
            }
            gsap.to(
              { v: 0 },
              {
                v: to,
                duration: 1.8,
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
      // Native horizontal scroll for the collection; everything else is static via CSS.
      folio?.classList.add("is-static");
      return () => {
        navST.kill();
        counters.forEach((c) => c.kill());
      };
    }

    // ---- HERO intro (after preloader) ----
    // Kept OUTSIDE gsap.context so a Strict-Mode/HMR revert can never strand
    // the headline in its hidden state.
    let heroPlayed = false;
    const playHero = () => {
      if (heroPlayed) return;
      const spans = document.querySelectorAll("#hero h1 .row span");
      const tag = document.querySelector("#heroTag");
      if (!spans.length || !tag) return; // not in DOM yet — wait for next call
      heroPlayed = true;
      gsap
        .timeline()
        .to(spans, { y: 0, duration: 1.3, ease: "expo.out", stagger: 0.08 })
        .to(tag, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=.8");
    };
    if (typeof window !== "undefined" && window.__introDone) playHero();
    window.addEventListener("intro-done", playHero);
    const heroFallback = gsap.delayedCall(4.5, playHero);

    const ctx = gsap.context(() => {
      // ---- HERO parallax zoom ----
      gsap.to("#heroMedia", {
        yPercent: 18,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // ---- MARQUEE drift ----
      gsap.to("#marquee", {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".marquee",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // ---- REVEAL (fade up) ----
      gsap.utils.toArray<HTMLElement>("[data-rev]").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        });
      });

      // ---- LINE MASK reveal ----
      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((el) => {
        gsap.to(el, {
          y: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      // ---- CURTAIN image reveal ----
      gsap.utils.toArray<HTMLElement>("[data-curtain]").forEach((c) => {
        const img = c.querySelector("img");
        gsap
          .timeline({ scrollTrigger: { trigger: c, start: "top 82%" } })
          .to(c, { clipPath: "inset(0 0 0% 0)", duration: 1.5, ease: "expo.inOut" })
          .to(img, { scale: 1, duration: 1.7, ease: "expo.out" }, 0);
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

      // ---- HORIZONTAL collection ----
      const track = document.getElementById("htrack");
      if (track && !touch && window.innerWidth > 880) {
        const bar = document.getElementById("folioBar");
        const pad =
          parseFloat(
            getComputedStyle(document.body).getPropertyValue("--pad")
          ) || 40;
        const dist = () => track.scrollWidth - window.innerWidth + pad;
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: ".folio",
            start: "top top",
            end: () => "+=" + dist(),
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              if (bar) bar.style.width = s.progress * 100 + "%";
            },
          },
        });
        gsap.utils.toArray<HTMLElement>(".card .ph img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -4 },
            {
              xPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: ".folio",
                start: "top top",
                end: () => "+=" + dist(),
                scrub: 1,
              },
            }
          );
        });
      } else {
        folio?.classList.add("is-static");
      }

      // ---- QUARTER parallax ----
      gsap.to("[data-par-bg] img", {
        yPercent: 16,
        ease: "none",
        scrollTrigger: {
          trigger: "#quarter",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.utils.toArray<HTMLElement>("[data-par]").forEach((el) => {
        const amt = +(el.dataset.par || "0");
        gsap.fromTo(
          el,
          { y: -amt },
          {
            y: amt,
            ease: "none",
            scrollTrigger: {
              trigger: "#quarter",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const refreshT = setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      ctx.revert();
      navST.kill();
      counters.forEach((c) => c.kill());
      window.removeEventListener("intro-done", playHero);
      heroFallback.kill();
      window.removeEventListener("load", onLoad);
      clearTimeout(refreshT);
    };
  }, []);

  return null;
}
