import LocaleSwitcher from "./LocaleSwitcher";

export default function Nav() {
  return (
    <nav className="nav" id="nav">
      <a href="#top" className="brand">
        U <b>Thant</b>
      </a>
      <div className="menu">
        <a href="#collection" data-i18n="nav.collection">Collection</a>
        <a href="#quarter" data-i18n="nav.quarter">The Quarter</a>
        <a href="/investment" data-i18n="nav.investment">Investment</a>
        <a href="#contact" className="cta" data-i18n="nav.enquire">Enquire</a>
        <LocaleSwitcher />
      </div>
    </nav>
  );
}
