# U Thant — Cinematic Showcase (Next.js)

A cinematic, scroll-driven single-page experience for the U Thant collection of
freehold homes in Kuala Lumpur's Embassy Quarter. Built as a production-shaped
Next.js app: component-per-section, Lenis smooth scroll, GSAP ScrollTrigger,
`next/image` with blur placeholders, a custom cursor, and a working contact form.

## Run

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000

Build for production:

```bash
npm run build && npm start
```

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** (design tokens) + hand-authored cinematic CSS in `app/globals.css`
- **GSAP + ScrollTrigger** for all scroll animation
- **Lenis** for smooth scroll, ticked by GSAP
- **next/font** — Fraunces (display serif) + Inter (UI)

## Structure

```
web/
├─ app/
│  ├─ layout.tsx          fonts + metadata
│  ├─ page.tsx            section assembly
│  ├─ globals.css         tokens + all section styling
│  └─ api/contact/route.ts contact endpoint (stub — wire your transport)
├─ components/
│  ├─ SmoothScroll.tsx    Lenis ↔ GSAP, anchor interception
│  ├─ Cursor.tsx          custom dual-ring "View" cursor
│  ├─ Preloader.tsx       counter + letter-rise, fires `intro-done`
│  ├─ ScrollFX.tsx        central GSAP engine (reveals, curtain, pin, parallax…)
│  ├─ Nav · Hero · Marquee · Story · CurtainImage · Stats
│  ├─ Collection.tsx      horizontal pinned gallery (+ mobile fallback)
│  ├─ Quarter · Schools · Quote · ContactCTA · Footer
└─ lib/
   ├─ content.ts          all copy, figures, imagery, contact details
   └─ gsap.ts             plugin registration + motion/touch helpers
```

## Motion features

- Preloader: animated `0→100` counter, masked letters, `expo.inOut` curtain wipe
- Hero: masked headline rise + parallax zoom-out on scroll
- Drifting building-name marquee (scrub-linked)
- Line-by-line heading reveals (`translateY 110%→0`)
- Curtain image reveals (`clip-path` + de-zoom)
- Animated stat counters
- **Pinned horizontal collection** with progress bar + intra-card parallax
- Layered parallax in "The Quarter"
- Custom cursor that expands to "View" over interactive cards
- Full `prefers-reduced-motion` fallback (animations off, collection → native scroll)

## Customising

- **Copy / figures / buildings / contact** → `lib/content.ts`
- **Imagery** → replace the Unsplash URLs in `lib/content.ts` and the section
  components with production photography. (Add any new image host to
  `next.config.mjs` → `images.remotePatterns`.)
- **Video hero** → drop a file at `public/hero.mp4` and set `HERO.videoSrc`
  to `"/hero.mp4"` in `lib/content.ts`. The still image is the poster/fallback.
- **Contact delivery** → implement the TODO in `app/api/contact/route.ts`
  (Resend, SendGrid, a CRM webhook, etc.).

## Notes

- Imagery is Unsplash placeholders — clearly stand-ins for licensed photography.
- The horizontal pin is disabled on touch / reduced-motion; the rail becomes a
  native snap-scroll instead.
- This is an independent recreation of a *premium feel* and interaction
  language — not a copy of any existing site's proprietary design.
