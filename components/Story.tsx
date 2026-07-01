export default function Story() {
  return (
    <section className="pad-y" id="story">
      <div className="wrap intro-grid">
        <div>
          <p className="eyebrow reveal" data-rev data-i18n="story.address">
            The Address
          </p>
          <h2 className="intro-head" style={{ marginTop: 26 }}>
            <span className="line-mask">
              <span data-line data-i18n="story.h1">Half a square mile</span>
            </span>
            <span className="line-mask">
              <span data-line data-i18n="story.h2">between the embassies,</span>
            </span>
            <span className="line-mask">
              <span data-line data-i18n="story.h3">the Royal Selangor</span>
            </span>
            <span className="line-mask">
              <span data-line data-i18n="story.h4">and KLCC.</span>
            </span>
          </h2>
        </div>
        <div className="intro-cols">
          <p className="reveal" data-rev data-i18n="story.p1">
            <strong>U Thant is not a neighbourhood you stumble into.</strong> It
            is Kuala Lumpur&rsquo;s diplomatic enclave — a quiet, tree-lined
            quarter of freehold estates that rarely change hands, held by
            families and missions for generations.
          </p>
          <p className="reveal" data-rev data-i18n="story.p2">
            We work this half-square-mile and nothing else. Every residence in
            the collection is mandated, measured and understood — so the right
            home reaches the right hands, with the discretion the address
            deserves.
          </p>
        </div>
      </div>
    </section>
  );
}
