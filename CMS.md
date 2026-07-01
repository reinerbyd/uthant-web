# Content / CMS architecture

All editorial content lives behind a single access layer, [`lib/cms.ts`](lib/cms.ts).
Pages and components never hard-code copy or imagery — they call `cms` getters.
Today those getters read from a typed local store ([`lib/content.ts`](lib/content.ts));
swapping to a headless CMS is a one-file change.

## Access layer (the contract)

```ts
getSiteConfig()      → { url, name, tagline }
getResidences()      → Building[]
getResidence(slug)   → Building | null
getResidenceSlugs()  → string[]
getStats()           → Stat[]
getSchools()         → School[]
getTestimonials()    → Testimonial[]
getContact()         → { phone, email, address[], developer }
getLocation()        → { center, blurb, amenities[] }
getFloorRooms()      → Room[]
getInvestDefaults()  → calculator defaults
```

All getters are `async`, so the call sites already `await` — moving to a network
source requires **no change to any page or component**.

## Content models

| Model | Fields |
|-------|--------|
| **Building** (residence) | `slug, name, idx, status, price, img, hero, video?, alt, summary, story[], specs[{k,v}], gallery[{src,alt}], location` |
| **Stat** | `to? / static, unit, label` |
| **School** | `n, t, tag, img` |
| **Testimonial** | `quote, name, role` |
| **Amenity** (location) | `name, cat, mins, x, y` |
| **Room** (floor plan) | `id, label, x, y, w, h, area, note` |
| **SEO** | `metadataBase` + per-page `title/description` + JSON-LD (derived from Building) |

## Swapping to a headless CMS (e.g. Sanity)

1. `npm i @sanity/client` and add `SANITY_PROJECT_ID` / `SANITY_DATASET` to `.env`.
2. Model the documents above in your CMS (one `residence` document type, plus
   singletons for `siteConfig`, `location`, `investDefaults`, and collections for
   `testimonial`, `school`).
3. Reimplement the bodies in `lib/cms.ts`, e.g.:

   ```ts
   import { createClient } from "@sanity/client";
   const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: true });

   export async function getResidence(slug: string) {
     return client.fetch(`*[_type=="residence" && slug.current==$slug][0]{...}`, { slug });
   }
   ```

4. Keep the return shapes identical. Done — every page, the floor plan, the
   gallery, the calculator and the SEO/JSON-LD continue to work unchanged.

Because residence pages use `generateStaticParams` + `generateMetadata`, content
is statically generated at build; add a webhook to trigger ISR/rebuild on publish.
