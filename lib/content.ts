// Central content source for the U Thant cinematic showcase.
// Real figures sourced from uthant.com.my — swap imagery for production photography.

export const BLUR =
  "data:image/gif;base64,R0lGODlhAQABAPAAAOzn2v///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

export const HERO = {
  // Drop a file at /public/hero.mp4 to enable the ambient video hero.
  // Leave videoSrc empty to fall back to the still image.
  videoSrc: "",
  poster:
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=80",
  title: "U Thant",
  tagline: ["Kuala Lumpur's most considered address —", "freehold homes in the Embassy Quarter."],
};

export const NAV = [
  { label: "Collection", href: "#collection" },
  { label: "The Quarter", href: "#quarter" },
  { label: "Investment", href: "/investment" },
];

export const SITE = {
  // Set NEXT_PUBLIC_SITE_URL at deploy (drives canonical, OG, sitemap, robots).
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://uthant.example.com",
  name: "U Thant",
  tagline: "Kuala Lumpur's most considered address",
};

/** Generic interactive floor plan (viewBox 0 0 120 80). */
export type Room = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  area: number; // sq ft
  note: string;
};

export const FLOOR_ROOMS: Room[] = [
  { id: "living", label: "Living & Dining", x: 4, y: 4, w: 60, h: 44, area: 720, note: "Double-volume, garden-facing" },
  { id: "terrace", label: "Terrace", x: 4, y: 50, w: 60, h: 26, area: 320, note: "Covered outdoor lounge" },
  { id: "master", label: "Master Suite", x: 66, y: 4, w: 50, h: 28, area: 480, note: "Walk-in dressing + ensuite" },
  { id: "ensuite", label: "Ensuite", x: 66, y: 34, w: 23, h: 16, area: 120, note: "Stone, rain shower" },
  { id: "bed2", label: "Bedroom 2", x: 91, y: 34, w: 25, h: 16, area: 220, note: "Built-in wardrobe" },
  { id: "bed3", label: "Bedroom 3", x: 66, y: 52, w: 50, h: 24, area: 300, note: "Study / guest" },
];

/** Investment calculator defaults (illustrative). */
export const INVEST = {
  defaultPrice: 5_000_000,
  minPrice: 3_500_000,
  maxPrice: 20_000_000,
  downPct: 30,
  ratePct: 4.1,
  tenureYears: 30,
  monthlyRent: 14_000,
  appreciationPct: 4.5,
  costsPct: 22, // % of rent lost to vacancy/maintenance/fees
};

export type Amenity = {
  name: string;
  cat: string;
  mins: number;
  x: number; // % position on the stylised map
  y: number;
};

export const LOCATION = {
  center: "Jalan U Thant — the Embassy Quarter",
  blurb:
    "Everything that matters is minutes away — yet the streets stay quiet. A rare balance of seclusion and connection.",
  amenities: [
    { name: "KLCC & Petronas Towers", cat: "City", mins: 8, x: 70, y: 30 },
    { name: "Royal Selangor Golf Club", cat: "Leisure", mins: 4, x: 60, y: 64 },
    { name: "ISKL", cat: "Education", mins: 5, x: 30, y: 42 },
    { name: "Ampang Park MRT", cat: "Transit", mins: 6, x: 66, y: 20 },
    { name: "Embassy Row", cat: "Diplomatic", mins: 2, x: 45, y: 52 },
    { name: "Pavilion KL", cat: "Retail", mins: 10, x: 82, y: 50 },
    { name: "Gleneagles Hospital", cat: "Health", mins: 4, x: 38, y: 26 },
    { name: "KLIA", cat: "Airport", mins: 45, x: 86, y: 84 },
  ] as Amenity[],
};

export type Testimonial = { quote: string; name: string; role: string };
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "They know this neighbourhood better than anyone we have ever dealt with. The whole process was quiet, precise and entirely on our terms.",
    name: "Datin S.",
    role: "Acquired in the Embassy Quarter",
  },
  {
    quote:
      "We waited two years for the right home. When it came, the introduction was discreet and immediate. That is the difference here.",
    name: "Mr. & Mrs. L.",
    role: "Private collectors, Singapore",
  },
  {
    quote:
      "An address that holds its value through every cycle. For us it was as much an investment decision as a lifestyle one.",
    name: "Mr. R. Tan",
    role: "Family office principal",
  },
];

export const MARQUEE = [
  "Sastra U Thant",
  "9 Madge",
  "U Thant Residence",
  "Rimbun",
  "Katana II",
  "DeDaun",
  "AT 6",
];

export type Stat = {
  to?: number;
  static?: string;
  unit: string;
  label: string;
};

export const STATS: Stat[] = [
  { to: 500, unit: "+", label: "Transactions closed" },
  { to: 95, unit: "%", label: "Freehold share" },
  { to: 4, unit: "", label: "New developments" },
  { static: "RM3.5", unit: "–85M", label: "Price band" },
];

export type Spec = { k: string; v: string };

export type Building = {
  idx: string;
  slug: string;
  name: string;
  price: string;
  status: string;
  img: string; // vertical card image
  hero: string; // wide hero image
  alt: string;
  // detail page
  /** Optional local video (e.g. "/video/sastra.mp4"). Poster falls back to hero. */
  video?: string;
  summary: string;
  story: string[];
  specs: Spec[];
  gallery: { src: string; alt: string }[];
  location: string;
};

const U = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const COLLECTION: Building[] = [
  {
    idx: "01",
    slug: "sastra-u-thant",
    name: "Sastra U Thant",
    price: "RM 8M",
    status: "Established",
    img: U("1600585154340-be6161a56a0c"),
    hero: U("1600585154340-be6161a56a0c", 2400),
    alt: "Sastra U Thant residence",
    summary:
      "A low-density freehold address of full-floor residences, wrapped in greenery at the quiet heart of the Embassy Quarter.",
    story: [
      "Sastra U Thant is the kind of building the quarter keeps to itself. Full-floor homes, private lift lobbies and a canopy of mature rain trees frame a life lived without compromise — minutes from KLCC, worlds away from it.",
      "Interiors are unhurried: deep living spaces, natural stone, and walls of glass that fold the garden indoors. It is a residence designed to be lived in for a generation, not merely owned.",
    ],
    specs: [
      { k: "Tenure", v: "Freehold" },
      { k: "Type", v: "Full-floor residence" },
      { k: "Built-up", v: "From 4,200 sq ft" },
      { k: "Bedrooms", v: "4 + 1" },
      { k: "From", v: "RM 8M" },
    ],
    gallery: [
      { src: U("1600607687939-ce8a6c25118c", 1600), alt: "Living room" },
      { src: U("1600566753086-00f18fb6b3ea", 1200), alt: "Kitchen" },
      { src: U("1600210492493-0946911123ea", 1200), alt: "Bedroom" },
      { src: U("1502672260266-1c1ef2d93688", 1600), alt: "Detail" },
    ],
    location: "Jalan U Thant",
  },
  {
    idx: "02",
    slug: "9-madge",
    name: "9 Madge",
    price: "RM 4M",
    status: "Established",
    img: U("1512917774080-9991f1c4c750"),
    hero: U("1512917774080-9991f1c4c750", 2400),
    alt: "9 Madge residence",
    summary:
      "An intimate boutique address on Jalan Madge — a handful of residences for those who value privacy over scale.",
    story: [
      "On one of the quarter's most discreet streets, 9 Madge gathers only a few residences behind a quiet façade. The scarcity is the point.",
      "Light-filled and softly contemporary, each home balances generous proportion with the calm of a tree-lined cul-de-sac steps from the diplomatic missions.",
    ],
    specs: [
      { k: "Tenure", v: "Freehold" },
      { k: "Type", v: "Boutique residence" },
      { k: "Built-up", v: "From 2,600 sq ft" },
      { k: "Bedrooms", v: "3 + 1" },
      { k: "From", v: "RM 4M" },
    ],
    gallery: [
      { src: U("1505691938895-1758d7feb511", 1600), alt: "Interior" },
      { src: U("1600047509807-ba8f99d2cdde", 1200), alt: "Living" },
      { src: U("1600210492486-724fe5c67fb0", 1200), alt: "Dining" },
      { src: U("1600566753086-00f18fb6b3ea", 1600), alt: "Kitchen" },
    ],
    location: "Jalan Madge",
  },
  {
    idx: "03",
    slug: "u-thant-residence",
    name: "U Thant Residence",
    price: "RM 3.5M",
    status: "Established",
    img: U("1600566753086-00f18fb6b3ea"),
    hero: U("1600607687939-ce8a6c25118c", 2400),
    alt: "U Thant Residence",
    summary:
      "The address that gave the quarter its name — established, leafy and quietly sought after, generation after generation.",
    story: [
      "U Thant Residence is the quarter in microcosm: established, green, and rarely on the market. Homes here change hands between families who already know the street.",
      "Warm timber, honest stone and an effortless flow between inside and garden make for residences that feel less designed than simply right.",
    ],
    specs: [
      { k: "Tenure", v: "Freehold" },
      { k: "Type", v: "Garden residence" },
      { k: "Built-up", v: "From 2,300 sq ft" },
      { k: "Bedrooms", v: "3" },
      { k: "From", v: "RM 3.5M" },
    ],
    gallery: [
      { src: U("1600607687939-ce8a6c25118c", 1600), alt: "Living" },
      { src: U("1502672260266-1c1ef2d93688", 1200), alt: "Detail" },
      { src: U("1600210492493-0946911123ea", 1200), alt: "Bedroom" },
      { src: U("1600585154340-be6161a56a0c", 1600), alt: "Exterior" },
    ],
    location: "Jalan U Thant",
  },
  {
    idx: "04",
    slug: "rimbun",
    name: "Rimbun",
    price: "RM 5M",
    status: "Established",
    img: U("1613490493576-7fde63acd811"),
    hero: U("1613490493576-7fde63acd811", 2400),
    alt: "Rimbun residence",
    summary:
      "Named for the forest it sits within — a green, low-rise sanctuary where the city dissolves into canopy.",
    story: [
      "Rimbun trades skyline for treeline. Set against mature greenery, its residences open onto terraces that feel suspended in the canopy.",
      "It is a quieter idea of luxury — natural light, cross-ventilation, and the rare sound of birdsong a few minutes from the centre of the capital.",
    ],
    specs: [
      { k: "Tenure", v: "Freehold" },
      { k: "Type", v: "Low-rise residence" },
      { k: "Built-up", v: "From 3,100 sq ft" },
      { k: "Bedrooms", v: "4" },
      { k: "From", v: "RM 5M" },
    ],
    gallery: [
      { src: U("1600210492486-724fe5c67fb0", 1600), alt: "Living" },
      { src: U("1600047509807-ba8f99d2cdde", 1200), alt: "Interior" },
      { src: U("1505691938895-1758d7feb511", 1200), alt: "Detail" },
      { src: U("1600566753086-00f18fb6b3ea", 1600), alt: "Kitchen" },
    ],
    location: "Jalan Taman U Thant",
  },
  {
    idx: "05",
    slug: "katana-ii",
    name: "Katana II",
    price: "RM 5M",
    status: "Established",
    img: U("1600210492486-724fe5c67fb0"),
    hero: U("1600210492486-724fe5c67fb0", 2400),
    alt: "Katana II residence",
    summary:
      "Architecturally precise and quietly modern — clean lines and considered light for a contemporary sensibility.",
    story: [
      "Katana II is the quarter's modern voice: sharp geometry, restrained materials and a discipline of light that rewards the eye.",
      "Behind the precision is ease — open volumes, seamless thresholds and a sense of calm that only careful design can buy.",
    ],
    specs: [
      { k: "Tenure", v: "Freehold" },
      { k: "Type", v: "Modern residence" },
      { k: "Built-up", v: "From 3,400 sq ft" },
      { k: "Bedrooms", v: "4" },
      { k: "From", v: "RM 5M" },
    ],
    gallery: [
      { src: U("1502672260266-1c1ef2d93688", 1600), alt: "Detail" },
      { src: U("1600607687939-ce8a6c25118c", 1200), alt: "Living" },
      { src: U("1600210492493-0946911123ea", 1200), alt: "Bedroom" },
      { src: U("1613490493576-7fde63acd811", 1600), alt: "Exterior" },
    ],
    location: "Jalan U Thant",
  },
  {
    idx: "06",
    slug: "dedaun",
    name: "DeDaun",
    price: "RM 3.5M",
    status: "Established",
    img: U("1600047509807-ba8f99d2cdde"),
    hero: U("1600047509807-ba8f99d2cdde", 2400),
    alt: "DeDaun residence",
    summary:
      "Leaf-soft and light — a gentle, garden-led address for those who want the quarter without the grandeur.",
    story: [
      "DeDaun is the quarter at its most relaxed: soft daylight, planting at every turn and interiors that never raise their voice.",
      "An ideal first foothold in U Thant — freehold, green and close to everything that makes the enclave singular.",
    ],
    specs: [
      { k: "Tenure", v: "Freehold" },
      { k: "Type", v: "Garden residence" },
      { k: "Built-up", v: "From 2,200 sq ft" },
      { k: "Bedrooms", v: "3" },
      { k: "From", v: "RM 3.5M" },
    ],
    gallery: [
      { src: U("1600566753086-00f18fb6b3ea", 1600), alt: "Kitchen" },
      { src: U("1505691938895-1758d7feb511", 1200), alt: "Interior" },
      { src: U("1600210492486-724fe5c67fb0", 1200), alt: "Living" },
      { src: U("1502672260266-1c1ef2d93688", 1600), alt: "Detail" },
    ],
    location: "Off Jalan U Thant",
  },
  {
    idx: "07",
    slug: "at-6",
    name: "AT 6",
    price: "RM 4M",
    status: "Established",
    img: U("1505691938895-1758d7feb511"),
    hero: U("1505691938895-1758d7feb511", 2400),
    alt: "AT 6 residence",
    summary:
      "A tailored collection of residences where craftsmanship and warmth meet on a quiet quarter street.",
    story: [
      "AT 6 is small by design — a tailored set of residences finished with the kind of detail that only reveals itself in person.",
      "Timber, stone and soft light combine in homes that feel hand-made, set on one of the quarter's calmest addresses.",
    ],
    specs: [
      { k: "Tenure", v: "Freehold" },
      { k: "Type", v: "Boutique residence" },
      { k: "Built-up", v: "From 2,800 sq ft" },
      { k: "Bedrooms", v: "3 + 1" },
      { k: "From", v: "RM 4M" },
    ],
    gallery: [
      { src: U("1600210492493-0946911123ea", 1600), alt: "Bedroom" },
      { src: U("1600607687939-ce8a6c25118c", 1200), alt: "Living" },
      { src: U("1600047509807-ba8f99d2cdde", 1200), alt: "Interior" },
      { src: U("1600585154340-be6161a56a0c", 1600), alt: "Exterior" },
    ],
    location: "Jalan U Thant",
  },
];

export const getResidence = (slug: string) =>
  COLLECTION.find((b) => b.slug === slug);
export const residenceSlugs = COLLECTION.map((b) => b.slug);

export type School = { n: string; t: string; tag: string; img: string };

export const SCHOOLS: School[] = [
  {
    n: "01",
    t: "ISKL",
    tag: "International",
    img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80",
  },
  {
    n: "02",
    t: "The Children's House",
    tag: "Early years",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
  },
  {
    n: "03",
    t: "Sayfol",
    tag: "International",
    img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=900&q=80",
  },
  {
    n: "04",
    t: "The Surin",
    tag: "International",
    img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=900&q=80",
  },
  {
    n: "05",
    t: "Beaconhouse Newlands",
    tag: "International",
    img: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=900&q=80",
  },
];

export const WHATSAPP = {
  number: "60133391393",
  message: "Hello U Thant — I'd like to enquire about the collection.",
};

export const CONTACT = {
  phone: "+60 13 339 1393",
  phoneHref: "tel:+60133391393",
  email: "hello@uthant.com.my",
  address: ["Jalan Langgak Tunku", "Taman Tunku, 50480", "Kuala Lumpur, Malaysia"],
  developer: "Zeon Properties International",
};
