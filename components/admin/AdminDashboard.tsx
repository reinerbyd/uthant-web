"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Building, Testimonial } from "@/lib/content";

type Lang = "cn" | "tw" | "id";
type Doc = {
  heroTagline: string[];
  contact: { phone: string; phoneHref: string; email: string; address: string[]; developer: string };
  whatsapp: { number: string; message: string };
  residences: Building[];
  testimonials: Testimonial[];
  brochureUrl: string | null;
  i18n: Record<Lang, Record<string, string>>;
};

type Tab = "general" | "residences" | "testimonials" | "translations" | "brochure";

const LANGS: { key: Lang; label: string }[] = [
  { key: "cn", label: "简体中文 (CN)" },
  { key: "tw", label: "繁體中文 (TW)" },
  { key: "id", label: "Bahasa (ID)" },
];

export default function AdminDashboard({ initial }: { initial: Doc }) {
  const [doc, setDoc] = useState<Doc>(initial);
  const [tab, setTab] = useState<Tab>("residences");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [openRes, setOpenRes] = useState<number | null>(0);
  const [tl, setTl] = useState<Lang>("cn");
  const router = useRouter();

  const i18nVal = (lang: Lang, key: string) => doc.i18n?.[lang]?.[key] ?? "";
  const setI18n = (lang: Lang, key: string, val: string) =>
    setDoc((d) => ({
      ...d,
      i18n: { ...d.i18n, [lang]: { ...(d.i18n?.[lang] || {}), [key]: val } },
    }));

  const patch = (p: Partial<Doc>) => setDoc((d) => ({ ...d, ...p }));
  const patchRes = (i: number, p: Partial<Building>) =>
    setDoc((d) => {
      const r = [...d.residences];
      r[i] = { ...r[i], ...p };
      return { ...d, residences: r };
    });

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 2600);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin">
      <header className="adm-bar">
        <div className="adm-bar-l">
          <span className="adm-brand">U Thant</span>
          <span className="adm-tag">Content admin</span>
        </div>
        <div className="adm-bar-r">
          <a href="/" target="_blank" rel="noreferrer" className="adm-ghost">
            View site ↗
          </a>
          <button className="adm-ghost" onClick={logout}>
            Sign out
          </button>
          <button className="adm-save" onClick={save} disabled={status === "saving"}>
            {status === "saving"
              ? "Saving…"
              : status === "saved"
              ? "Saved ✓"
              : status === "error"
              ? "Error — retry"
              : "Save changes"}
          </button>
        </div>
      </header>

      <nav className="adm-tabs">
        {(["residences", "general", "testimonials", "translations", "brochure"] as Tab[]).map((t) => (
          <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
            {t === "general" ? "General & contact" : t === "translations" ? "Translations" : t}
          </button>
        ))}
      </nav>

      <main className="adm-main">
        {tab === "general" && (
          <Section title="Hero & site text">
            <Grid>
              <Text label="Hero tagline — line 1" value={doc.heroTagline[0] || ""} onChange={(v) => patch({ heroTagline: [v, doc.heroTagline[1] || ""] })} />
              <Text label="Hero tagline — line 2" value={doc.heroTagline[1] || ""} onChange={(v) => patch({ heroTagline: [doc.heroTagline[0] || "", v] })} />
            </Grid>
            <H>Contact</H>
            <Grid>
              <Text label="Phone (display)" value={doc.contact.phone} onChange={(v) => patch({ contact: { ...doc.contact, phone: v } })} />
              <Text label="Phone link (tel:)" value={doc.contact.phoneHref} onChange={(v) => patch({ contact: { ...doc.contact, phoneHref: v } })} />
              <Text label="Email" value={doc.contact.email} onChange={(v) => patch({ contact: { ...doc.contact, email: v } })} />
              <Text label="Developer" value={doc.contact.developer} onChange={(v) => patch({ contact: { ...doc.contact, developer: v } })} />
            </Grid>
            <Area label="Address (one line per row)" value={doc.contact.address.join("\n")} onChange={(v) => patch({ contact: { ...doc.contact, address: v.split("\n") } })} />
            <H>WhatsApp</H>
            <Grid>
              <Text label="Number (digits only)" value={doc.whatsapp.number} onChange={(v) => patch({ whatsapp: { ...doc.whatsapp, number: v } })} />
              <Text label="Prefilled message" value={doc.whatsapp.message} onChange={(v) => patch({ whatsapp: { ...doc.whatsapp, message: v } })} />
            </Grid>
          </Section>
        )}

        {tab === "brochure" && (
          <Section title="Brochure">
            <p className="adm-help">Upload a PDF. The “Download brochure” button serves this file; if none is set, a generated placeholder is used.</p>
            {doc.brochureUrl ? (
              <p className="adm-current">
                Current: <a href={doc.brochureUrl} target="_blank" rel="noreferrer">{doc.brochureUrl}</a>{" "}
                <button className="adm-link-del" onClick={() => patch({ brochureUrl: null })}>remove</button>
              </p>
            ) : (
              <p className="adm-current muted">No brochure uploaded — using generated placeholder.</p>
            )}
            <FileUpload accept="application/pdf" label="Upload brochure PDF" onUploaded={(url) => patch({ brochureUrl: url })} />
          </Section>
        )}

        {tab === "testimonials" && (
          <Section title="Testimonials">
            {doc.testimonials.map((t, i) => (
              <div className="adm-card" key={i}>
                <Area label="Quote" value={t.quote} onChange={(v) => setDoc((d) => { const a = [...d.testimonials]; a[i] = { ...a[i], quote: v }; return { ...d, testimonials: a }; })} />
                <Grid>
                  <Text label="Name" value={t.name} onChange={(v) => setDoc((d) => { const a = [...d.testimonials]; a[i] = { ...a[i], name: v }; return { ...d, testimonials: a }; })} />
                  <Text label="Role" value={t.role} onChange={(v) => setDoc((d) => { const a = [...d.testimonials]; a[i] = { ...a[i], role: v }; return { ...d, testimonials: a }; })} />
                </Grid>
                <button className="adm-remove" onClick={() => setDoc((d) => ({ ...d, testimonials: d.testimonials.filter((_, k) => k !== i) }))}>Remove</button>
              </div>
            ))}
            <button className="adm-add" onClick={() => setDoc((d) => ({ ...d, testimonials: [...d.testimonials, { quote: "", name: "", role: "" }] }))}>+ Add testimonial</button>
          </Section>
        )}

        {tab === "translations" && (
          <Section title="Translations">
            <p className="adm-help">
              English is authored in the other tabs. Add the CN / TW / ID versions of your editable
              copy here — the site swaps them automatically when a visitor selects that country.
              Leave a field blank to fall back to English.
            </p>
            <div className="adm-lang-tabs">
              {LANGS.map((l) => (
                <button key={l.key} className={`adm-lang ${tl === l.key ? "on" : ""}`} onClick={() => setTl(l.key)}>
                  {l.label}
                </button>
              ))}
            </div>

            <H>Hero tagline</H>
            <label className="adm-label">
              <span>Line 1 — EN: “{doc.heroTagline[0]}”</span>
              <input className="adm-input" value={i18nVal(tl, "hero.tagline0")} placeholder={doc.heroTagline[0]} onChange={(e) => setI18n(tl, "hero.tagline0", e.target.value)} />
            </label>
            <label className="adm-label">
              <span>Line 2 — EN: “{doc.heroTagline[1]}”</span>
              <input className="adm-input" value={i18nVal(tl, "hero.tagline1")} placeholder={doc.heroTagline[1]} onChange={(e) => setI18n(tl, "hero.tagline1", e.target.value)} />
            </label>

            <H>Testimonials</H>
            {doc.testimonials.map((t, i) => (
              <div className="adm-card" key={i}>
                <label className="adm-label">
                  <span>Quote — EN: “{t.quote.slice(0, 64)}{t.quote.length > 64 ? "…" : ""}”</span>
                  <textarea className="adm-input" rows={3} value={i18nVal(tl, `testimonial.${i}.quote`)} placeholder={t.quote} onChange={(e) => setI18n(tl, `testimonial.${i}.quote`, e.target.value)} />
                </label>
                <Grid>
                  <label className="adm-label">
                    <span>Name — EN: {t.name}</span>
                    <input className="adm-input" value={i18nVal(tl, `testimonial.${i}.name`)} placeholder={t.name} onChange={(e) => setI18n(tl, `testimonial.${i}.name`, e.target.value)} />
                  </label>
                  <label className="adm-label">
                    <span>Role — EN: {t.role}</span>
                    <input className="adm-input" value={i18nVal(tl, `testimonial.${i}.role`)} placeholder={t.role} onChange={(e) => setI18n(tl, `testimonial.${i}.role`, e.target.value)} />
                  </label>
                </Grid>
              </div>
            ))}
          </Section>
        )}

        {tab === "residences" && (
          <Section title="Residences">
            {doc.residences.map((r, i) => (
              <div className="adm-res" key={r.slug}>
                <button className="adm-res-head" onClick={() => setOpenRes(openRes === i ? null : i)}>
                  {r.img ? <img src={r.img} alt="" /> : <span className="adm-res-ph" />}
                  <span className="adm-res-name">{r.name}</span>
                  <span className="adm-res-price">{r.price}</span>
                  <span className="adm-res-chev">{openRes === i ? "–" : "+"}</span>
                </button>
                {openRes === i && (
                  <div className="adm-res-body">
                    <Grid>
                      <Text label="Name" value={r.name} onChange={(v) => patchRes(i, { name: v })} />
                      <Text label="Price (e.g. RM 8M)" value={r.price} onChange={(v) => patchRes(i, { price: v })} />
                      <Text label="Status" value={r.status} onChange={(v) => patchRes(i, { status: v })} />
                      <Text label="Location" value={r.location} onChange={(v) => patchRes(i, { location: v })} />
                    </Grid>
                    <Area label="Summary" value={r.summary} onChange={(v) => patchRes(i, { summary: v })} />
                    <Area label="Story (separate paragraphs with a blank line)" rows={5} value={r.story.join("\n\n")} onChange={(v) => patchRes(i, { story: v.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean) })} />

                    <H>Specifications</H>
                    {r.specs.map((s, si) => (
                      <div className="adm-kv" key={si}>
                        <input className="adm-input" value={s.k} placeholder="Label" onChange={(e) => { const specs = [...r.specs]; specs[si] = { ...specs[si], k: e.target.value }; patchRes(i, { specs }); }} />
                        <input className="adm-input" value={s.v} placeholder="Value" onChange={(e) => { const specs = [...r.specs]; specs[si] = { ...specs[si], v: e.target.value }; patchRes(i, { specs }); }} />
                        <button className="adm-x" onClick={() => patchRes(i, { specs: r.specs.filter((_, k) => k !== si) })}>✕</button>
                      </div>
                    ))}
                    <button className="adm-add sm" onClick={() => patchRes(i, { specs: [...r.specs, { k: "", v: "" }] })}>+ Add spec</button>

                    <H>Hero image</H>
                    <ImageField value={r.hero} onChange={(url) => patchRes(i, { hero: url })} />
                    <H>Card image (collection)</H>
                    <ImageField value={r.img} onChange={(url) => patchRes(i, { img: url })} />

                    <H>Gallery</H>
                    <div className="adm-gallery">
                      {r.gallery.map((g, gi) => (
                        <div className="adm-g" key={gi}>
                          <ImageField value={g.src} onChange={(url) => { const gallery = [...r.gallery]; gallery[gi] = { ...gallery[gi], src: url }; patchRes(i, { gallery }); }} />
                          <input className="adm-input" value={g.alt} placeholder="Caption / alt" onChange={(e) => { const gallery = [...r.gallery]; gallery[gi] = { ...gallery[gi], alt: e.target.value }; patchRes(i, { gallery }); }} />
                          <button className="adm-remove sm" onClick={() => patchRes(i, { gallery: r.gallery.filter((_, k) => k !== gi) })}>Remove image</button>
                        </div>
                      ))}
                    </div>
                    <button className="adm-add sm" onClick={() => patchRes(i, { gallery: [...r.gallery, { src: "", alt: "" }] })}>+ Add gallery image</button>
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}
      </main>
    </div>
  );
}

/* ---------- field primitives ---------- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="adm-section">
      <h2 className="adm-h2">{title}</h2>
      {children}
    </section>
  );
}
function H({ children }: { children: React.ReactNode }) {
  return <h3 className="adm-h3">{children}</h3>;
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="adm-grid">{children}</div>;
}
function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="adm-label">
      <span>{label}</span>
      <input className="adm-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
function Area({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="adm-label">
      <span>{label}</span>
      <textarea className="adm-input" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function FileUpload({ accept, label, onUploaded }: { accept: string; label: string; onUploaded: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    setErr("");
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await res.json().catch(() => ({ ok: false }));
    if (j.ok) onUploaded(j.url);
    else setErr(j.error || "Upload failed");
    setBusy(false);
    e.target.value = "";
  }
  return (
    <div className="adm-upload-row">
      <label className="adm-upload">
        {busy ? "Uploading…" : label}
        <input type="file" accept={accept} onChange={pick} hidden />
      </label>
      {err && <span className="adm-err-inline">{err}</span>}
    </div>
  );
}

function ImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  return (
    <div className="adm-img">
      <div className="adm-img-preview">{value ? <img src={value} alt="" /> : <span className="adm-img-empty">No image</span>}</div>
      <div className="adm-img-ctrl">
        <FileUpload accept="image/*" label="Upload / replace" onUploaded={onChange} />
        <input className="adm-input" value={value} placeholder="…or paste an image URL" onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}
