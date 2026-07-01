import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BLUR, STATS, SCHOOLS } from "@/lib/content";
import { getContact } from "@/lib/cms";
import SiteNav from "@/components/SiteNav";
import PageFX from "@/components/PageFX";
import Footer from "@/components/Footer";
import LocationMap from "@/components/LocationMap";
import { LOCATION } from "@/lib/content";

const STAT_KEY: Record<string, string> = {
  "Transactions closed": "stats.transactions",
  "Freehold share": "stats.freehold",
  "New developments": "stats.developments",
  "Price band": "stats.priceBand",
};

export const metadata: Metadata = {
  title: "The Embassy Quarter — U Thant",
  description:
    "Half a square mile between the embassies, Royal Selangor Golf Club and KLCC — Kuala Lumpur's diplomatic enclave.",
};

export default async function TheQuarterPage() {
  const CONTACT = await getContact();
  return (
    <>
      <SiteNav />

      <main id="top">
        {/* HERO */}
        <header className="rhero" id="hero">
          <div className="rhero-media" data-hero-bg>
            <div className="kb">
              <Image
                src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=2400&q=80"
                alt="Kuala Lumpur's Embassy Quarter"
                fill
                priority
                sizes="100vw"
                placeholder="blur"
                blurDataURL={BLUR}
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="rhero-inner wrap">
            <p className="eyebrow rhero-eye" data-i18n="story.address">The Address</p>
            <h1 className="rhero-title">
              <span className="line-mask">
                <span data-line data-i18n="tq.heroH1">The&nbsp;Embassy&nbsp;</span>
              </span>
              <span className="line-mask">
                <span data-line data-i18n="tq.heroH2">Quarter.</span>
              </span>
            </h1>
            <div className="rhero-foot">
              <p className="rhero-sum" data-i18n="tq.heroSum">
                Half a square mile between the embassies, Royal Selangor Golf
                Club and KLCC — and nothing else like it in Kuala Lumpur.
              </p>
            </div>
          </div>
          <div className="scrollcue rhero-cue">
            <span className="bar" /> Scroll
          </div>
        </header>

        {/* STORY */}
        <section className="pad-y">
          <div className="wrap intro-grid">
            <div>
              <p className="eyebrow reveal" data-rev data-i18n="tq.oneNeighbourhood">
                One neighbourhood
              </p>
              <h2 className="intro-head" style={{ marginTop: 26 }}>
                <span className="line-mask">
                  <span data-line data-i18n="tq.sh1">A quiet, tree-lined</span>
                </span>
                <span className="line-mask">
                  <span data-line data-i18n="tq.sh2">quarter of freehold</span>
                </span>
                <span className="line-mask">
                  <span data-line data-i18n="tq.sh3">estates that rarely</span>
                </span>
                <span className="line-mask">
                  <span data-line data-i18n="tq.sh4">change hands.</span>
                </span>
              </h2>
            </div>
            <div className="intro-cols">
              <p className="reveal" data-rev data-i18n="tq.sp1">
                <strong>U Thant is Kuala Lumpur&rsquo;s diplomatic enclave</strong>{" "}
                — held by families and missions for generations, and specialised
                in by people who work this half-square-mile and nothing else.
              </p>
              <p className="reveal" data-rev data-i18n="tq.sp2">
                Every residence under mandate is measured and understood, so the
                right home reaches the right hands with the discretion the
                address deserves.
              </p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats pad-y">
          <div className="wrap">
            <p className="eyebrow reveal" data-rev data-i18n="stats.eyebrow">
              By the numbers
            </p>
            <div className="stats-grid">
              {STATS.map((s, i) => (
                <div className="stat" key={i}>
                  <div className="num">
                    {s.to !== undefined ? (
                      <>
                        <span className="count" data-to={s.to}>
                          0
                        </span>
                        {s.unit && <span className="u">{s.unit}</span>}
                      </>
                    ) : (
                      <span data-myr-range="3500000,85000000">
                        {s.static}
                        <span className="u">{s.unit}</span>
                      </span>
                    )}
                  </div>
                  <div className="lbl" data-i18n={STAT_KEY[s.label]}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="reveal q-report" data-rev data-i18n="tq.report">
              Read by 2,000+ subscribers — our quarterly U Thant market report
              tracks every transaction in the quarter.
            </p>
          </div>
        </section>

        {/* SCHOOLS / SURROUNDS */}
        <section className="pad-y">
          <div className="wrap">
            <p className="eyebrow reveal" data-rev data-i18n="schools.eyebrow">
              Within reach
            </p>
            <h2 className="intro-head reveal" data-rev data-i18n="schools.h" style={{ marginTop: 22, maxWidth: "24ch" }}>
              Five international schools, all on the doorstep.
            </h2>
            <div className="schools-grid">
              {SCHOOLS.map((s) => (
                <div className="school-row" key={s.n}>
                  <span className="n mono">{s.n}</span>
                  <span className="t">{s.t}</span>
                  <span className="tag" data-i18n={s.tag === "Early years" ? "schools.tagEarly" : "schools.tagInternational"}>
                    {s.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LOCATION */}
        <section className="pad-y loc-section">
          <div className="wrap">
            <p className="eyebrow reveal" data-rev data-i18n="tq.location">
              The location
            </p>
            <h2 className="intro-head reveal" data-rev data-i18n="tq.minutes" style={{ marginTop: 18, maxWidth: "20ch" }}>
              Minutes from everything.
            </h2>
            <p className="reveal loc-blurb" data-rev>
              {LOCATION.blurb}
            </p>
            <div className="reveal" data-rev style={{ marginTop: "clamp(34px,5vh,56px)" }}>
              <LocationMap />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="res-cta">
          <div className="wrap">
            <p className="eyebrow reveal" data-rev data-i18n="tq.theCollection" style={{ color: "var(--gold-2)" }}>
              The collection
            </p>
            <h2 className="res-cta-h reveal" data-rev data-i18n="tq.findPlace">
              Find your place in U&nbsp;Thant.
            </h2>
            <div className="res-cta-actions reveal" data-rev>
              <Link href="/#collection" className="btn-solid" data-cursor="ignore">
                <span data-i18n="common.viewCollection">View the collection</span> <span className="arr">→</span>
              </Link>
              <a href={`mailto:${CONTACT.email}`} className="btn-ghost" data-cursor="ignore">
                <span>{CONTACT.email}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <PageFX />
    </>
  );
}
