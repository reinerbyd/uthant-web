"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { COLLECTION, CONTACT, WHATSAPP, type Building } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  date: z.string().optional(),
  interest: z.string().optional(),
  message: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

type Props = {
  residences?: Building[];
  contact?: typeof CONTACT;
  whatsapp?: typeof WHATSAPP;
};

export default function ContactCTA({
  residences = COLLECTION,
  contact = CONTACT,
  whatsapp = WHATSAPP,
}: Props) {
  const { t } = useI18n();
  const waHref = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.message)}`;
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      reset();
    } catch {
      setDone(false);
      alert("Something went wrong. Please email hello@uthant.com.my.");
    }
  }

  return (
    <section className="cta-sec pad-y" id="contact">
      <div className="wrap">
        <p className="eyebrow reveal" data-rev data-i18n="contact.eyebrow" style={{ color: "var(--gold-2)" }}>
          Begin a conversation
        </p>
        <div className="contact-grid">
          {/* LEFT */}
          <div className="contact-left">
            <h2 className="contact-h">
              <span className="line-mask">
                <span data-line data-i18n="contact.h1">Arrange a private</span>
              </span>
              <span className="line-mask">
                <span data-line data-i18n="contact.h2">viewing of U&nbsp;Thant.</span>
              </span>
            </h2>
            <div className="contact-actions reveal" data-rev>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="ca-link" data-cursor="open">
                <span className="ca-k">WhatsApp</span>
                <span className="ca-v">{contact.phone}</span>
              </a>
              <a href={`mailto:${contact.email}`} className="ca-link" data-cursor="open">
                <span className="ca-k" data-i18n="contact.kEmail">Email</span>
                <span className="ca-v">{contact.email}</span>
              </a>
              <a href="/api/brochure" className="ca-link ca-brochure" data-cursor="open" download>
                <span className="ca-k" data-i18n="contact.kBrochure">Brochure</span>
                <span className="ca-v">
                  <span data-i18n="contact.download">Download the collection</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* GLASS BOOKING FORM */}
          <div className="contact-glass reveal" data-rev>
            {done ? (
              <div className="cf-done">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3>{t("contact.thanks")}</h3>
                <p>{t("contact.thanksMsg")}</p>
                <button className="cf-again" onClick={() => setDone(false)} data-cursor="ignore">
                  {t("contact.again")}
                </button>
              </div>
            ) : (
              <form className="cf" onSubmit={handleSubmit(onSubmit)} noValidate>
                <h3 className="cf-title">{t("contact.scheduleTitle")}</h3>
                <div className="cf-row">
                  <Field label={t("contact.fName")} error={errors.name?.message}>
                    <input {...register("name")} autoComplete="name" />
                  </Field>
                  <Field label={t("contact.kEmail")} error={errors.email?.message}>
                    <input type="email" {...register("email")} autoComplete="email" />
                  </Field>
                </div>
                <div className="cf-row">
                  <Field label={t("contact.fPhone")}>
                    <input type="tel" {...register("phone")} autoComplete="tel" />
                  </Field>
                  <Field label={t("contact.fDate")}>
                    <input type="date" {...register("date")} />
                  </Field>
                </div>
                <Field label={t("contact.fInterest")}>
                  <select {...register("interest")} defaultValue="">
                    <option value="">{t("contact.notSure")}</option>
                    {residences.map((b) => (
                      <option key={b.slug} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("contact.fMessage")}>
                  <textarea rows={2} {...register("message")} placeholder="Anything we should know" />
                </Field>
                <button className="cf-submit" type="submit" disabled={isSubmitting} data-cursor="ignore">
                  <span>{isSubmitting ? t("contact.sending") : t("contact.submit")}</span>
                  <span className="arr">→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`cf-field ${error ? "has-error" : ""}`}>
      <span className="cf-label">
        {label}
        {error && <span className="cf-error">{error}</span>}
      </span>
      {children}
    </label>
  );
}
