import Link from "next/link";
import LocaleSwitcher from "./LocaleSwitcher";

/** Cross-page navigation (used on sub-pages). Links deep-link back to the home sections. */
export default function SiteNav() {
  return (
    <nav className="nav" id="nav">
      <Link href="/" className="brand">
        U <b>Thant</b>
      </Link>
      <div className="menu">
        <Link href="/#collection" data-i18n="nav.collection">Collection</Link>
        <Link href="/the-quarter" data-i18n="nav.quarter">The Quarter</Link>
        <Link href="/investment" data-i18n="nav.investment">Investment</Link>
        <Link href="/#contact" className="cta" data-i18n="nav.enquire">
          Enquire
        </Link>
        <LocaleSwitcher />
      </div>
    </nav>
  );
}
