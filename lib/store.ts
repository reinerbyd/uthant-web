import fs from "node:fs";
import fsp from "node:fs/promises";
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
 * Content store. Uses **Neon Postgres** when DATABASE_URL is set (content +
 * uploads persist across redeploys — ideal for Render Free), otherwise falls
 * back to the local filesystem for dev. All functions are async.
 */
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

/* ---------------- Neon (lazy, cached) ---------------- */
const DB_URL = process.env.DATABASE_URL;
type Sql = (strings: TemplateStringsArray, ...vals: unknown[]) => Promise<Record<string, unknown>[]>;
let _sql: Sql | null = null;
let _ready: Promise<void> | null = null;

async function db(): Promise<Sql | null> {
  if (!DB_URL) return null;
  if (!_sql) {
    const { neon } = await import("@neondatabase/serverless");
    _sql = neon(DB_URL) as unknown as Sql;
  }
  if (!_ready) {
    const sql = _sql;
    _ready = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS site_content (id int PRIMARY KEY, doc jsonb NOT NULL)`;
      await sql`CREATE TABLE IF NOT EXISTS uploads (name text PRIMARY KEY, mime text NOT NULL, data text NOT NULL, created_at timestamptz DEFAULT now())`;
    })();
  }
  await _ready;
  return _sql;
}

/** Race a promise against a timeout so a slow/hung DB never blocks a request. */
function withTimeout<T>(p: Promise<T>, ms = 5000): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error("db timeout")), ms)),
  ]);
}

const merge = (saved: Partial<ContentDoc> | undefined): ContentDoc => {
  const d = defaults();
  if (!saved) return d;
  return { ...d, ...saved, i18n: { ...d.i18n, ...(saved.i18n || {}) } };
};

/* ---------------- content ---------------- */
export async function readContent(): Promise<ContentDoc> {
  // never throw or hang — a DB/fs hiccup must not 500/stall every page
  try {
    const doc = await withTimeout(
      (async () => {
        const sql = await db();
        if (!sql) return null;
        const rows = await sql`SELECT doc FROM site_content WHERE id = 1`;
        return merge(rows[0]?.doc as Partial<ContentDoc> | undefined);
      })()
    );
    if (doc) return doc;
  } catch (e) {
    console.error("[store] readContent DB error — falling back:", e);
  }
  try {
    return merge(JSON.parse(fs.readFileSync(FILE, "utf8")));
  } catch {
    return defaults();
  }
}

export async function writeContent(doc: ContentDoc): Promise<void> {
  const sql = await db();
  if (sql) {
    await sql`INSERT INTO site_content (id, doc) VALUES (1, ${JSON.stringify(doc)}::jsonb)
              ON CONFLICT (id) DO UPDATE SET doc = EXCLUDED.doc`;
    return;
  }
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(doc, null, 2), "utf8");
}

/* ---------------- uploads ---------------- */
export async function saveUpload(name: string, mime: string, bytes: Buffer): Promise<void> {
  const sql = await db();
  if (sql) {
    const data = bytes.toString("base64");
    await sql`INSERT INTO uploads (name, mime, data) VALUES (${name}, ${mime}, ${data})
              ON CONFLICT (name) DO UPDATE SET data = EXCLUDED.data, mime = EXCLUDED.mime`;
    return;
  }
  await fsp.mkdir(UPLOADS_DIR, { recursive: true });
  await fsp.writeFile(path.join(UPLOADS_DIR, name), bytes);
}

export async function readUpload(
  name: string
): Promise<{ mime: string; bytes: Buffer } | null> {
  try {
    const hit = await withTimeout(
      (async () => {
        const sql = await db();
        if (!sql) return undefined; // no DB → use fs fallback below
        const rows = await sql`SELECT mime, data FROM uploads WHERE name = ${name}`;
        return rows[0]
          ? { mime: String(rows[0].mime), bytes: Buffer.from(String(rows[0].data), "base64") }
          : null;
      })()
    );
    if (hit !== undefined) return hit; // null = not found in DB; object = found
  } catch (e) {
    console.error("[store] readUpload DB error:", e);
    return null;
  }
  try {
    const bytes = await fsp.readFile(path.join(UPLOADS_DIR, name));
    return { mime: mimeFromExt(path.extname(name)), bytes };
  } catch {
    return null;
  }
}

export function mimeFromExt(ext: string): string {
  const t: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".gif": "image/gif",
    ".pdf": "application/pdf",
  };
  return t[ext.toLowerCase()] || "application/octet-stream";
}
