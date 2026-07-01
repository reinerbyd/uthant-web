import Image from "next/image";
import { HERO, BLUR } from "@/lib/content";

export default function Hero({ tagline }: { tagline?: string[] }) {
  const line = tagline?.length ? tagline : HERO.tagline;
  return (
    <header className="hero" id="hero">
      <div className="hero-media" id="heroMedia">
        {HERO.videoSrc ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={HERO.poster}
            aria-hidden
          >
            <source src={HERO.videoSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={HERO.poster}
            alt="Architectural facade of a residence in the U Thant quarter"
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR}
            style={{ objectFit: "cover" }}
          />
        )}
      </div>

      <svg className="hero-grain" aria-hidden>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.32" />
      </svg>

      <div className="hero-inner wrap">
        <h1>
          <span className="row">
            <span>U&nbsp;Thant</span>
          </span>
        </h1>
        <div className="hero-sub">
          <p className="hero-tag" id="heroTag">
            <span data-i18n-content="hero.tagline0">{line[0]}</span>
            <br />
            <span className="serif" data-i18n-content="hero.tagline1">{line[1]}</span>
          </p>
          <div className="scrollcue">
            <span className="bar" /> Scroll
          </div>
        </div>
      </div>
    </header>
  );
}
