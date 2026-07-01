import { CONTACT } from "@/lib/content";

export default function Quote() {
  return (
    <section className="quote pad-y">
      <div className="wrap">
        <blockquote>
          <span className="line-mask">
            <span data-line data-i18n="quote.l1">&ldquo;We specialise in</span>
          </span>
          <span className="line-mask">
            <span data-line data-i18n="quote.l2">one neighbourhood —</span>
          </span>
          <span className="line-mask">
            <span data-line data-i18n="quote.l3">and know it better</span>
          </span>
          <span className="line-mask">
            <span data-line data-i18n="quote.l4">than anyone.&rdquo;</span>
          </span>
        </blockquote>
        <p className="by reveal" data-rev>
          {CONTACT.developer}
        </p>
      </div>
    </section>
  );
}
