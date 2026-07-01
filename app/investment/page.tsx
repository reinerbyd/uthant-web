import Image from "next/image";
import type { Metadata } from "next";
import { BLUR, STATS } from "@/lib/content";
import { getTestimonials, getContact, getWhatsApp } from "@/lib/cms";
import SiteNav from "@/components/SiteNav";
import PageFX from "@/components/PageFX";
import Footer from "@/components/Footer";
import MagneticButton from "@/components/MagneticButton";
import InvestmentCalculator from "@/components/InvestmentCalculator";

const STAT_KEY: Record<string, string> = {
  "Transactions closed": "stats.transactions",
  "Freehold share": "stats.freehold",
  "New developments": "stats.developments",
  "Price band": "stats.priceBand",
};

export const metadata: Metadata = {
  title: "Investment — U Thant",
  description:
    "Model the numbers behind a freehold home in Kuala Lumpur's Embassy Quarter — mortgage, rental yield and five-year return.",
};

export default async function InvestmentPage() {
  const [TESTIMONIALS, CONTACT, whatsapp] = await Promise.all([
    getTestimonials(),
    getContact(),
    getWhatsApp(),
  ]);
  const waHref = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(
    "Hello U Thant — I'd like to discuss investment in the quarter."
  )}`;
  return (
    <>
      <SiteNav />

      <main id="top">
        {/* HERO */}
        <header className="rhero" id="hero">
          <div className="rhero-media" data-hero-bg>
            <div className="kb">
              <Image
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2400&q=80"
                alt="A residence in the U Thant quarter"
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
            <p className="eyebrow rhero-eye" data-i18n="iv.theInvestment">The Investment</p>
            <h1 className="rhero-title">
              <span className="line-mask">
                <span data-line data-i18n="iv.heroH1">An&nbsp;address&nbsp;</span>
              </span>
              <span className="line-mask">
                <span data-line data-i18n="iv.heroH2">that&nbsp;holds.</span>
              </span>
            </h1>
            <div className="rhero-foot">
              <p className="rhero-sum" data-i18n="iv.heroSum">
                95% freehold, scarce by nature and rarely on the market — the
                Embassy Quarter has held its value through every cycle. Model the
                numbers below.
              </p>
            </div>
          </div>
          <div className="scrollcue rhero-cue">
            <span className="bar" /> Scroll
          </div>
        </header>

        {/* INTRO */}
        <section className="pad-y">
          <div className="wrap intro-grid">
            <div>
              <p className="eyebrow reveal" data-rev data-i18n="iv.theCase">
                The case
              </p>
              <h2 className="intro-head" style={{ marginTop: 26 }}>
                <span className="line-mask">
                  <span data-line data-i18n="iv.scarcity1">Scarcity is the</span>
                </span>
                <span className="line-mask">
                  <span data-line data-i18n="iv.scarcity2">strategy.</span>
                </span>
              </h2>
            </div>
            <div className="intro-cols">
              <p className="reveal" data-rev data-i18n="iv.caseP1">
                <strong>Half a square mile, freehold, and finite.</strong> New
                supply in the quarter is measured in single digits, while demand
                from families, diplomats and funds is structural and enduring.
              </p>
              <p className="reveal" data-rev data-i18n="iv.caseP2">
                The result is an address that behaves less like a property market
                and more like a collector&rsquo;s asset — illiquid by design, and
                resilient because of it.
              </p>
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section className="pad-y inv-section">
          <div className="wrap">
            <p className="eyebrow reveal" data-rev data-i18n="inv.theNumbers">
              The numbers
            </p>
            <h2 className="intro-head reveal" data-rev data-i18n="inv.model" style={{ marginTop: 18, maxWidth: "20ch" }}>
              Model your position.
            </h2>
            <div className="reveal" data-rev style={{ marginTop: "clamp(36px,5vh,60px)" }}>
              <InvestmentCalculator />
            </div>
          </div>
        </section>

        {/* MARKET STATS */}
        <section className="stats pad-y">
          <div className="wrap">
            <p className="eyebrow reveal" data-rev data-i18n="iv.trackRecord">
              Track record
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
            <p className="reveal q-report" data-rev data-i18n="iv.report">
              Our quarterly market report — read by 2,000+ subscribers — tracks
              every transaction in the quarter, so your decisions are grounded in
              real evidence, not asking prices.
            </p>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="pad-y">
          <div className="wrap">
            <p className="eyebrow reveal" data-rev data-i18n="iv.inWords">
              In their words
            </p>
            <div className="tst-grid">
              {TESTIMONIALS.map((t, i) => (
                <figure className="tst reveal" data-rev key={i}>
                  <blockquote>
                    “<span data-i18n-content={`testimonial.${i}.quote`}>{t.quote}</span>”
                  </blockquote>
                  <figcaption>
                    <span className="tst-name" data-i18n-content={`testimonial.${i}.name`}>{t.name}</span>
                    <span className="tst-role" data-i18n-content={`testimonial.${i}.role`}>{t.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="res-cta">
          <div className="wrap">
            <p className="eyebrow reveal" data-rev data-i18n="iv.speak" style={{ color: "var(--gold-2)" }}>
              Speak with us
            </p>
            <h2 className="res-cta-h reveal" data-rev data-i18n="iv.privateConv">
              A private conversation, on your terms.
            </h2>
            <div className="res-cta-actions reveal" data-rev>
              <MagneticButton href={waHref} external cursor="open" className="btn-solid">
                <span data-i18n="common.whatsapp">WhatsApp us</span> <span className="arr">→</span>
              </MagneticButton>
              <MagneticButton href={`mailto:${CONTACT.email}`} cursor="open" className="btn-ghost">
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
