/**
 * CMS access layer. Reads editable content from the on-disk store (managed by
 * the admin panel), and static config from content.ts. Swap the store for a DB
 * or headless CMS without touching pages — see CMS.md.
 */
import * as store from "./store";
import * as data from "./content";

export type {
  Building,
  Spec,
  School,
  Stat,
  Testimonial,
  Room,
  Amenity,
} from "./content";

// ---- editable (admin-managed) ----
export async function getResidences() {
  return (await store.readContent()).residences;
}
export async function getResidence(slug: string) {
  return (await store.readContent()).residences.find((r) => r.slug === slug) ?? null;
}
export async function getResidenceSlugs() {
  return (await store.readContent()).residences.map((r) => r.slug);
}
export async function getTestimonials() {
  return (await store.readContent()).testimonials;
}
export async function getContact() {
  return (await store.readContent()).contact;
}
export async function getWhatsApp() {
  return (await store.readContent()).whatsapp;
}
export async function getHeroTagline() {
  return (await store.readContent()).heroTagline;
}
export async function getBrochureUrl() {
  return (await store.readContent()).brochureUrl;
}

// ---- static config ----
export async function getSiteConfig() {
  return data.SITE;
}
export async function getStats() {
  return data.STATS;
}
export async function getSchools() {
  return data.SCHOOLS;
}
export async function getLocation() {
  return data.LOCATION;
}
export async function getFloorRooms() {
  return data.FLOOR_ROOMS;
}
export async function getInvestDefaults() {
  return data.INVEST;
}
