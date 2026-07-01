import fs from "node:fs";
import path from "node:path";
import {
  COLLECTION,
  TESTIMONIALS,
  CONTACT,
  WHATSAPP,
  HERO,
  type Building,
  type Testimonial,
} from "./content";

/**
 * Editable content store. Reads/writes a JSON document on disk, merged over the
 * code defaults in content.ts. This is the persistence layer the admin panel
 * mutates; `lib/cms.ts` reads from here. (For serverless/production, swap the
 * fs calls for a DB or object store — the shape stays the same.)
 */
/** Per-language overrides for admin-editable content, keyed by content id. */
export type ContentI18n = {
  cn: Record<string, string>;
  tw: Record<string, string>;
  id: Record<string, string>;
};

export type ContentDoc = {
  heroTagline: string[];
  contact: typeof CONTACT;
  whatsapp: typeof WHATSAPP;
  residences: Building[];
  testimonials: Testimonial[];
  brochureUrl: string | null;
  i18n: ContentI18n;
};

/** Writable data directory. In production set DATA_DIR to a persistent disk
 *  (e.g. /data on Render/Railway). Defaults to ./data for local dev. */
export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const FILE = path.join(DATA_DIR, "content.json");

function defaults(): ContentDoc {
  return {
    heroTagline: [...HERO.tagline],
    contact: { ...CONTACT, address: [...CONTACT.address] },
    whatsapp: { ...WHATSAPP },
    residences: COLLECTION,
    testimonials: TESTIMONIALS,
    brochureUrl: null,
    i18n: { cn: {}, tw: {}, id: {} },
  };
}

export function readContent(): ContentDoc {
  try {
    const saved = JSON.parse(fs.readFileSync(FILE, "utf8"));
    const d = defaults();
    return { ...d, ...saved, i18n: { ...d.i18n, ...(saved.i18n || {}) } };
  } catch {
    return defaults();
  }
}

export function writeContent(doc: ContentDoc): void {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(doc, null, 2), "utf8");
}
