import Image from "next/image";
import { BLUR } from "@/lib/content";

export default function Quarter() {
  return (
    <section className="quarter" id="quarter">
      <div className="q-bg" data-par-bg>
        <Image
          src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=2400&q=80"
          alt="Kuala Lumpur skyline beyond the U Thant quarter"
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="q-float a" data-par="-60">
        <Image
          src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80"
          alt="Detail of a residence"
          fill
          sizes="300px"
          placeholder="blur"
          blurDataURL={BLUR}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="q-float b" data-par="80">
        <Image
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80"
          alt="Interior detail"
          fill
          sizes="250px"
          placeholder="blur"
          blurDataURL={BLUR}
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="q-inner">
        <div className="wrap q-text">
          <p className="eyebrow" data-i18n="quarter.eyebrow" style={{ color: "var(--gold-2)" }}>
            The Quarter
          </p>
          <h2 style={{ marginTop: 22 }}>
            <span className="line-mask">
              <span data-line data-i18n="quarter.h1">Quiet, green,</span>
            </span>
            <span className="line-mask">
              <span data-line data-i18n="quarter.h2">and minutes</span>
            </span>
            <span className="line-mask">
              <span data-line data-i18n="quarter.h3">from everything.</span>
            </span>
          </h2>
          <p className="reveal" data-rev data-i18n="quarter.p">
            Royal Selangor Golf Club at the gate. KLCC and the city&rsquo;s
            finest dining a short drive away. The calm of an embassy district,
            with the capital always within reach.
          </p>
        </div>
      </div>
    </section>
  );
}
