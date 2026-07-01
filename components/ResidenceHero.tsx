import Image from "next/image";
import type { Building } from "@/lib/content";
import { BLUR } from "@/lib/content";

const priceToMyr = (p: string) => {
  const m = p.match(/([\d.]+)\s*M/i);
  return m ? Math.round(parseFloat(m[1]) * 1_000_000) : 0;
};

/** Cinematic residence hero — local video when provided, else a Ken Burns still. */
export default function ResidenceHero({ b }: { b: Building }) {
  return (
    <header className="rhero" id="hero">
      <div className="rhero-media" data-hero-bg>
        {b.video ? (
          <video autoPlay muted loop playsInline poster={b.hero} aria-hidden>
            <source src={b.video} type="video/mp4" />
          </video>
        ) : (
          <div className="kb">
            <Image
              src={b.hero}
              alt={b.alt}
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={BLUR}
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      <div className="rhero-inner wrap">
        <p className="eyebrow rhero-eye">
          {b.idx} — {b.location}
        </p>
        <h1 className="rhero-title">
          {b.name.split(" ").map((w, i) => (
            <span className="line-mask" key={i}>
              <span data-line>{w}&nbsp;</span>
            </span>
          ))}
        </h1>
        <div className="rhero-foot">
          <p className="rhero-sum">{b.summary}</p>
          <div className="rhero-price">
            <span className="k">From</span>
            <span className="v" data-myr={priceToMyr(b.price)} data-compact>
              {b.price}
            </span>
          </div>
        </div>
      </div>
      <div className="scrollcue rhero-cue">
        <span className="bar" /> Scroll
      </div>
    </header>
  );
}
