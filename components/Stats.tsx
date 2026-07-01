import { STATS } from "@/lib/content";

const LBL: Record<string, string> = {
  "Transactions closed": "stats.transactions",
  "Freehold share": "stats.freehold",
  "New developments": "stats.developments",
  "Price band": "stats.priceBand",
};

export default function Stats() {
  return (
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
              <div className="lbl" data-i18n={LBL[s.label]}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
