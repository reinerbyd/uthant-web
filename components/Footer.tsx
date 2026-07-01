import { CONTACT } from "@/lib/content";

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot-grid">
        <div className="foot-col">
          <h3>U Thant</h3>
          <p data-i18n="footer.tagline" style={{ marginTop: 18, maxWidth: "34ch", fontWeight: 300 }}>
            Freehold luxury homes in Kuala Lumpur&rsquo;s diplomatic Embassy
            Quarter. Quietly, since the beginning.
          </p>
        </div>
        <div className="foot-col">
          <div className="k" data-i18n="footer.contact">Contact</div>
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>
        <div className="foot-col">
          <div className="k" data-i18n="footer.visit">Visit</div>
          {CONTACT.address.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
      <div className="wrap foot-bottom">
        <span>
          © <span className="mono">2026</span> {CONTACT.developer}
        </span>
        <span data-i18n="footer.concept">Cinematic showcase — concept</span>
      </div>
    </footer>
  );
}
