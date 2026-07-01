import Image from "next/image";
import Link from "next/link";
import { COLLECTION, BLUR, type Building } from "@/lib/content";

/**
 * Horizontal pinned gallery on desktop; ScrollFX adds `.is-static` for
 * touch / reduced-motion, which switches the rail to native horizontal scroll.
 */
const priceToMyr = (p: string) => {
  const m = p.match(/([\d.]+)\s*M/i);
  return m ? Math.round(parseFloat(m[1]) * 1_000_000) : 0;
};

export default function Collection({ items = COLLECTION }: { items?: Building[] }) {
  return (
    <section className="folio" id="collection">
      <div className="folio-head">
        <div>
          <p className="eyebrow reveal" data-rev data-i18n="collection.eyebrow">
            Buildings under mandate
          </p>
          <h2 className="reveal" data-rev data-i18n="collection.title" style={{ marginTop: 12 }}>
            The Collection
          </h2>
        </div>
        <p
          className="reveal"
          data-rev
          data-i18n="collection.desc"
          style={{
            maxWidth: "34ch",
            color: "var(--ink-soft)",
            fontWeight: 300,
            lineHeight: 1.55,
            fontSize: "clamp(.9rem,1vw,1rem)",
          }}
        >
          Seven established residences — drag or scroll to move through the
          quarter, building by building.
        </p>
      </div>

      <div className="hscroll" id="hscroll">
        <div className="htrack" id="htrack">
          {items.map((b) => (
            <Link
              className="card"
              key={b.idx}
              href={`/collection/${b.slug}`}
              data-cursor="view"
            >
              <div className="ph">
                <Image
                  src={b.img}
                  alt={b.alt}
                  fill
                  sizes="(max-width:880px) 80vw, 40vw"
                  placeholder="blur"
                  blurDataURL={BLUR}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="meta">
                <div className="idx mono">
                  {b.idx} — {b.status}
                </div>
                <div className="name">{b.name}</div>
                <div className="price">
                  View <b>·</b> From{" "}
                  <b data-myr={priceToMyr(b.price)} data-compact>
                    {b.price}
                  </b>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="folio-progress">
          <i id="folioBar" />
        </div>
      </div>
    </section>
  );
}
