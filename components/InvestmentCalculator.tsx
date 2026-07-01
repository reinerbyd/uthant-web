"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { INVEST } from "@/lib/content";
import { animateValue } from "@/lib/anim";
import { useI18n } from "@/lib/i18n";

function AnimatedNumber({
  value,
  format,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  /** custom formatter (e.g. currency); overrides suffix/decimals */
  format?: (v: number) => string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const fmt = (v: number) =>
    format
      ? format(v)
      : v.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }) + suffix;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = animateValue(prev.current, value, (v) => (el.textContent = fmt(v)), 0.7);
    prev.current = value;
    return () => {
      t.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, format, suffix, decimals]);
  return <span ref={ref}>{fmt(value)}</span>;
}

export default function InvestmentCalculator() {
  const { t, money } = useI18n();
  const RM = (n: number) => money(n);
  const [price, setPrice] = useState(INVEST.defaultPrice);
  const [downPct, setDownPct] = useState(INVEST.downPct);
  const [ratePct, setRatePct] = useState(INVEST.ratePct);
  const [tenure, setTenure] = useState(INVEST.tenureYears);
  const [rent, setRent] = useState(INVEST.monthlyRent);
  const [appr, setAppr] = useState(INVEST.appreciationPct);

  const r = useMemo(() => {
    const loan = price * (1 - downPct / 100);
    const mr = ratePct / 100 / 12;
    const n = tenure * 12;
    const monthly = mr === 0 ? loan / n : (loan * mr * (1 + mr) ** n) / ((1 + mr) ** n - 1);
    const annualRent = rent * 12;
    const grossYield = (annualRent / price) * 100;
    const netRent = annualRent * (1 - INVEST.costsPct / 100);
    const netYield = (netRent / price) * 100;
    const value5 = price * (1 + appr / 100) ** 5;
    const gain5 = value5 - price + netRent * 5;
    const roi5 = (gain5 / (price * (downPct / 100))) * 100; // return on equity over 5y
    return { loan, monthly, grossYield, netYield, value5, roi5, netRent };
  }, [price, downPct, ratePct, tenure, rent, appr]);

  return (
    <div className="inv">
      {/* INPUTS */}
      <div className="inv-controls">
        <Field label={t("inv.price")} value={RM(price)}>
          <input
            className="inv-range"
            type="range"
            min={INVEST.minPrice}
            max={INVEST.maxPrice}
            step={100_000}
            value={price}
            onChange={(e) => setPrice(+e.target.value)}
            aria-label="Purchase price"
          />
        </Field>
        <Field label={t("inv.down")} value={`${downPct}%  ·  ${RM((price * downPct) / 100)}`}>
          <input className="inv-range" type="range" min={10} max={60} step={1} value={downPct} onChange={(e) => setDownPct(+e.target.value)} aria-label="Down payment percentage" />
        </Field>
        <Field label={t("inv.rate")} value={`${ratePct.toFixed(1)}%`}>
          <input className="inv-range" type="range" min={2.5} max={6} step={0.1} value={ratePct} onChange={(e) => setRatePct(+e.target.value)} aria-label="Interest rate" />
        </Field>
        <Field label={t("inv.tenure")} value={`${tenure} ${t("inv.years")}`}>
          <input className="inv-range" type="range" min={10} max={35} step={1} value={tenure} onChange={(e) => setTenure(+e.target.value)} aria-label="Loan tenure" />
        </Field>
        <Field label={t("inv.rent")} value={RM(rent)}>
          <input className="inv-range" type="range" min={4_000} max={45_000} step={500} value={rent} onChange={(e) => setRent(+e.target.value)} aria-label="Expected monthly rent" />
        </Field>
        <Field label={t("inv.appr")} value={`${appr.toFixed(1)}%`}>
          <input className="inv-range" type="range" min={0} max={9} step={0.1} value={appr} onChange={(e) => setAppr(+e.target.value)} aria-label="Annual appreciation" />
        </Field>
      </div>

      {/* RESULTS */}
      <div className="inv-results">
        <Result big label={t("inv.monthly")}>
          <AnimatedNumber value={r.monthly} format={(v) => money(v)} />
        </Result>
        <div className="inv-result-grid">
          <Result label={t("inv.gross")}>
            <AnimatedNumber value={r.grossYield} suffix="%" decimals={1} />
          </Result>
          <Result label={t("inv.net")}>
            <AnimatedNumber value={r.netYield} suffix="%" decimals={1} />
          </Result>
          <Result label={t("inv.value5")}>
            <AnimatedNumber value={r.value5} format={(v) => money(v)} />
          </Result>
          <Result label={t("inv.roe")}>
            <AnimatedNumber value={r.roi5} suffix="%" decimals={0} />
          </Result>
        </div>
        <p className="inv-note">
          Illustrative only. Assumes {INVEST.costsPct}% of rent toward vacancy, maintenance
          and fees; figures are not financial advice.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <label className="inv-field">
      <span className="inv-field-head">
        <span className="inv-field-label">{label}</span>
        <span className="inv-field-value">{value}</span>
      </span>
      {children}
    </label>
  );
}

function Result({
  label,
  big,
  children,
}: {
  label: string;
  big?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`inv-result ${big ? "big" : ""}`}>
      <span className="inv-result-label">{label}</span>
      <span className="inv-result-value">{children}</span>
    </div>
  );
}
