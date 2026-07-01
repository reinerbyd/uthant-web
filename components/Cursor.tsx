"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isTouch } from "@/lib/gsap";

/** Custom dual-ring cursor that expands to "View" over [data-cursor="view"] elements. */
export default function Cursor() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isTouch() || isAdmin) return;

    const dot = document.createElement("div");
    dot.className = "cursor";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.innerHTML = '<span class="label">View</span>';
    document.body.append(dot, ring);

    let mx = innerWidth / 2,
      my = innerHeight / 2,
      rx = mx,
      ry = my,
      raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("mousemove", onMove);
    loop();

    // Delegated so it survives client-side route changes (cursor lives in layout).
    // Reads the data-cursor value as the label state: VIEW / OPEN / PLAY / DRAG / SCROLL.
    const label = ring.querySelector<HTMLElement>(".label")!;
    const apply = (el: HTMLElement | null) => {
      const val = el?.dataset.cursor;
      if (val && val !== "ignore") {
        label.textContent = val.toUpperCase();
        document.body.classList.add("cur-on");
      } else {
        document.body.classList.remove("cur-on");
      }
    };
    const over = (e: MouseEvent) =>
      apply((e.target as HTMLElement).closest<HTMLElement>("[data-cursor]"));
    const out = (e: MouseEvent) => {
      const to = e.relatedTarget as HTMLElement | null;
      if (!to?.closest?.("[data-cursor]")) document.body.classList.remove("cur-on");
    };
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);

    return () => {
      removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      dot.remove();
      ring.remove();
    };
  }, [isAdmin]);

  return null;
}
