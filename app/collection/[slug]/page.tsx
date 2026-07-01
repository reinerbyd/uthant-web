import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BLUR, WHATSAPP, CONTACT } from "@/lib/content";
import { getResidence, getResidences } from "@/lib/cms";
import SiteNav from "@/components/SiteNav";
import PageFX from "@/components/PageFX";
import Footer from "@/components/Footer";
import ResidenceHero from "@/components/ResidenceHero";
import FloorPlan from "@/components/FloorPlan";
import Gallery from "@/components/Gallery";
import MagneticButton from "@/components/MagneticButton";
import { SITE } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = await getResidence(slug);
  if (!b) return { title: "U Thant" };
  return {
    title: `${b.name} — U Thant`,
    description: b.summary,
  };
}

export default async function ResidencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = await getResidence(slug);
  if (!b) notFound();

  const residences = await getResidences();
  const idx = residences.findIndex((x) => x.slug === b.slug);
  const next = residences[(idx + 1) % residences.length];

  const waHref = `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(
    `Hello U Thant — I'd like to enquire about ${b.name}.`
  )}`;

  const priceNum = (() => {
    const m = b.price.match(/([\d.]+)\s*M/i);
    return m ? Math.round(parseFloat(m[1]) * 1_000_000) : undefined;
  })();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: b.name,
    description: b.summary,
    url: `${SITE.url}/collection/${b.slug}`,
    image: b.hero,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.location,
      addressLocality: "Kuala Lumpur",
      addressRegion: "Wilayah Persekutuan",
      addressCountry: "MY",
    },
    ...(priceNum && {
      offers: {
        "@type": "Offer",
        price: priceNum,
        priceCurrency: "MYR",
        availability: "https://schema.org/InStock",
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteNav />

      <main id="top">
        <ResidenceHero b={b} />

        {/* OVERVIEW + SPECS */}
        <section className="res-overview">
          <div className="wrap res-grid">
            <div className="res-story">
              <p className="eyebrow reveal" data-rev data-i18n="res.theResidence">
                The residence
              </p>
              {b.story.map((p, i) => (
                <p className="res-para reveal" data-rev key={i}>
                  {p}
                </p>
              ))}
            </div>
            <aside className="res-specs">
              {b.specs.map((s) => (
                <div className="spec-row reveal" data-rev key={s.k}>
                  <span className="spec-k">{s.k}</span>
                  <span className="spec-v">{s.v}</span>
                </div>
              ))}
            </aside>
          </div>
        </section>

        {/* FLOOR PLAN */}
        <section className="res-floor">
          <div className="wrap">
            <p className="eyebrow reveal" data-rev data-i18n="res.theLayout">
              The layout
            </p>
            <h2 className="intro-head reveal" data-rev data-i18n="res.explore" style={{ marginTop: 18, maxWidth: "18ch" }}>
              Explore the residence.
            </h2>
            <div className="reveal" data-rev style={{ marginTop: "clamp(34px,5vh,56px)" }}>
              <FloorPlan
                builtUp={b.specs.find((s) => s.k === "Built-up")?.v ?? "—"}
              />
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="res-gallery">
          <div className="wrap">
            <p className="eyebrow reveal" data-rev>
              Inside {b.name}
            </p>
            <p className="reveal gallery-hint" data-rev data-i18n="res.galleryHint">
              Drag to explore — click any frame to enlarge.
            </p>
          </div>
          <div className="reveal" data-rev>
            <Gallery images={b.gallery} />
          </div>
        </section>

        {/* QUARTER CONTEXT */}
        <section className="res-context">
          <div className="rc-bg" data-hero-bg>
            <Image
              src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=2400&q=80"
              alt="The Embassy Quarter"
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={BLUR}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="wrap rc-inner">
            <h2 className="rc-h">
              <span className="line-mask">
                <span data-line data-i18n="res.homeH1">A home in the</span>
              </span>
              <span className="line-mask">
                <span data-line data-i18n="res.homeH2">Embassy Quarter.</span>
              </span>
            </h2>
            <p className="rc-p reveal" data-rev>
              {b.name} sits within Kuala Lumpur&rsquo;s diplomatic enclave — half
              a square mile of freehold estates between the embassies, Royal
              Selangor Golf Club and KLCC.
            </p>
            <Link href="/the-quarter" className="rc-link reveal" data-rev data-cursor="view">
              <span data-i18n="common.exploreQuarter">Explore the Quarter</span> <span className="arr">→</span>
            </Link>
          </div>
        </section>

        {/* NEXT RESIDENCE */}
        <Link href={`/collection/${next.slug}`} className="res-next" data-cursor="view">
          <div className="rn-bg" data-parallax="50">
            <Image
              src={next.hero}
              alt={next.alt}
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={BLUR}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="wrap rn-inner">
            <span className="rn-eye" data-i18n="res.next">Next residence</span>
            <span className="rn-name">{next.name}</span>
            <span className="rn-go">View {next.name} →</span>
          </div>
        </Link>

        {/* CTA */}
        <section className="res-cta">
          <div className="wrap">
            <p className="eyebrow reveal" data-rev data-i18n="res.enquire" style={{ color: "var(--gold-2)" }}>
              Enquire
            </p>
            <h2 className="res-cta-h reveal" data-rev>
              Arrange a private viewing of {b.name}.
            </h2>
            <div className="res-cta-actions reveal" data-rev>
              <MagneticButton href={waHref} external cursor="open" className="btn-solid">
                <span data-i18n="common.whatsapp">WhatsApp us</span> <span className="arr">→</span>
              </MagneticButton>
              <MagneticButton
                href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(b.name + " — enquiry")}`}
                cursor="open"
                className="btn-ghost"
              >
                <span>{CONTACT.email}</span>
              </MagneticButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <PageFX />
    </>
  );
}
