"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { BLUR } from "@/lib/content";

type Img = { src: string; alt: string };

/** Draggable Embla carousel (DRAG cursor) with a click-to-zoom lightbox. */
export default function Gallery({ images }: { images: Img[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "center", dragFree: false });
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    return () => void embla.off("select", onSelect);
  }, [embla, onSelect]);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  // lightbox keyboard nav
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i! + 1) % images.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i! - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, images.length]);

  return (
    <div className="gallery">
      <div className="embla" ref={emblaRef} data-cursor="drag">
        <div className="embla-track">
          {images.map((g, i) => (
            <div className="embla-slide" key={i}>
              <button
                className="embla-fig"
                onClick={() => setLightbox(i)}
                data-cursor="open"
                aria-label={`Open ${g.alt}`}
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(max-width:900px) 92vw, 70vw"
                  placeholder="blur"
                  blurDataURL={BLUR}
                  style={{ objectFit: "cover" }}
                  draggable={false}
                />
                <span className="embla-cap">{g.alt}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="embla-ctrl">
        <button className="embla-btn" onClick={scrollPrev} aria-label="Previous" data-cursor="ignore">
          ←
        </button>
        <div className="embla-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`embla-dot ${i === selected ? "on" : ""}`}
              onClick={() => embla?.scrollTo(i)}
              aria-label={`Go to image ${i + 1}`}
              data-cursor="ignore"
            />
          ))}
        </div>
        <button className="embla-btn" onClick={scrollNext} aria-label="Next" data-cursor="ignore">
          →
        </button>
      </div>

      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
          <button className="lb-close" aria-label="Close" data-cursor="ignore">
            ✕
          </button>
          <button
            className="lb-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i! - 1 + images.length) % images.length);
            }}
            aria-label="Previous"
            data-cursor="ignore"
          >
            ←
          </button>
          <figure className="lb-fig" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              fill
              sizes="92vw"
              placeholder="blur"
              blurDataURL={BLUR}
              style={{ objectFit: "contain" }}
            />
            <figcaption>{images[lightbox].alt}</figcaption>
          </figure>
          <button
            className="lb-nav next"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i! + 1) % images.length);
            }}
            aria-label="Next"
            data-cursor="ignore"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
