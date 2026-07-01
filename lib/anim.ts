"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Reusable premium animation engine.
 * Understated, smooth motion — every helper returns the GSAP instance so it
 * can be composed, paused or reverted by the caller.
 */

const EASE = "power3.out";
const EASE_EXPO = "expo.out";

type Target = gsap.TweenTarget;
type Vars = gsap.TweenVars;

const st = (el: Element, vars: Vars, start = "top 86%"): Vars => ({
  ...vars,
  scrollTrigger: { trigger: el, start },
});

export const fadeUp = (t: Target, o: Vars = {}) =>
  gsap.fromTo(t, { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 1.1, ease: EASE, ...o });

export const fadeScale = (t: Target, o: Vars = {}) =>
  gsap.fromTo(t, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1, ease: EASE, ...o });

export const fadeLeft = (t: Target, o: Vars = {}) =>
  gsap.fromTo(t, { opacity: 0, x: -54 }, { opacity: 1, x: 0, duration: 1, ease: EASE, ...o });

export const fadeRight = (t: Target, o: Vars = {}) =>
  gsap.fromTo(t, { opacity: 0, x: 54 }, { opacity: 1, x: 0, duration: 1, ease: EASE, ...o });

/** Line-mask reveal — element should sit inside an overflow:hidden wrapper. */
export const maskReveal = (t: Target, o: Vars = {}) =>
  gsap.fromTo(t, { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: EASE_EXPO, ...o });

/** Curtain image reveal: clip-path open + de-zoom of the inner <img>. */
export const imageReveal = (container: HTMLElement) => {
  const img = container.querySelector("img");
  return gsap
    .timeline({ scrollTrigger: { trigger: container, start: "top 84%" } })
    .fromTo(
      container,
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "expo.inOut" }
    )
    .fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.6, ease: EASE_EXPO }, 0);
};

/** Split a heading into word spans wrapped in masks (returns the spans). */
export const splitTextReveal = (el: HTMLElement, o: Vars = {}) => {
  if (el.dataset.split === "1") return [];
  el.dataset.split = "1";
  const words = (el.textContent || "").split(/(\s+)/);
  el.textContent = "";
  const inner: HTMLElement[] = [];
  words.forEach((w) => {
    if (w.trim() === "") {
      el.appendChild(document.createTextNode(w));
      return;
    }
    const mask = document.createElement("span");
    mask.style.display = "inline-block";
    mask.style.overflow = "hidden";
    mask.style.verticalAlign = "top";
    const word = document.createElement("span");
    word.style.display = "inline-block";
    word.textContent = w;
    mask.appendChild(word);
    el.appendChild(mask);
    inner.push(word);
  });
  gsap.set(inner, { yPercent: 110 });
  gsap.to(inner, {
    yPercent: 0,
    duration: 1,
    ease: EASE_EXPO,
    stagger: 0.05,
    ...st(el, {}, "top 88%"),
    ...o,
  });
  return inner;
};

export const staggerText = (els: Target, o: Vars = {}) =>
  gsap.fromTo(
    els,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.08, ...o }
  );

export const heroParallax = (el: HTMLElement, amount = 18) =>
  gsap.to(el, {
    yPercent: amount,
    scale: 1.08,
    ease: "none",
    scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
  });

export const parallax = (el: HTMLElement, amount = 60) =>
  gsap.fromTo(
    el,
    { y: -amount },
    {
      y: amount,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    }
  );

/** Magnetic hover — element eases toward the cursor. Returns a cleanup fn. */
export const magnetic = (el: HTMLElement, strength = 0.3) => {
  const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
  const move = (e: MouseEvent) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * strength);
    yTo((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener("mousemove", move);
  el.addEventListener("mouseleave", reset);
  return () => {
    el.removeEventListener("mousemove", move);
    el.removeEventListener("mouseleave", reset);
  };
};

/** Tween a numeric value (for counters / calculators). Returns the tween. */
export const animateValue = (
  from: number,
  to: number,
  onUpdate: (v: number) => void,
  duration = 0.9
) => {
  const obj = { v: from };
  return gsap.to(obj, {
    v: to,
    duration,
    ease: "power2.out",
    onUpdate: () => onUpdate(obj.v),
  });
};

export { ScrollTrigger };
