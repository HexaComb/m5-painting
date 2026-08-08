export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoPage = {
  slug: string;
  /** Primary keyword / search intent this page targets */
  keyword: string;
  title: string;
  description: string;
  headline: string;
  highlight: string;
  intro: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
  benefits: string[];
  faqs: SeoFaq[];
  relatedSlugs: string[];
  serviceName: string;
  ogImageAlt: string;
};

export const SEO_PAGES: SeoPage[] = [
  {
    slug: "residential-painting",
    keyword: "residential painting",
    title:
      "Residential Painting in Sanger & Central Valley | M5 Painting",
    description:
      "Family-owned residential painting in Sanger and the Central Valley. Interior and exterior home painting with careful prep, quality paint, and a free estimate.",
    headline: "Residential painting",
    highlight: "done right for your home.",
    intro:
      "M5 Painting is a Sanger-based painting company trusted for residential painting across the Central Valley. We treat every house like a neighbor’s — careful prep, clean lines, and finishes that hold up in Valley heat.",
    sections: [
      {
        heading: "Home painting that lasts",
        body: "From a single accent wall to a full interior and exterior refresh, our residential painting crew protects surfaces, matches colors carefully, and leaves your home ready to enjoy — not cleaned up after us for days.",
      },
      {
        heading: "Serving Central Valley homeowners",
        body: "We regularly paint homes in Sanger, Fresno, Clovis, and nearby Central Valley communities. Local knowledge matters: we choose coatings and schedules that stand up to sun, dust, and seasonal temperature swings.",
      },
    ],
    benefits: [
      "Interior & exterior residential painting",
      "Trim, doors, cabinets & ceilings",
      "Color advice tailored to your home",
      "Licensed, bonded & insured",
      "Clear written estimates",
      "Family-owned Sanger painting company",
    ],
    faqs: [
      {
        question: "How much does residential painting cost in the Central Valley?",
        answer:
          "Cost depends on square footage, surface condition, number of colors, and whether the job is interior, exterior, or both. We provide free on-site estimates so you get a clear quote before any work starts.",
      },
      {
        question: "Do you paint houses in Sanger and nearby cities?",
        answer:
          "Yes. M5 Painting is based in Sanger and serves homeowners throughout the Central Valley, including Fresno, Clovis, and surrounding communities.",
      },
      {
        question: "How long does a typical residential painting project take?",
        answer:
          "A single room can often be finished in a day. Whole-home interiors or exteriors take longer depending on prep and weather. We’ll give you a realistic timeline with your estimate.",
      },
    ],
    relatedSlugs: [
      "interior-painting",
      "exterior-painting",
      "sanger-painting-company",
    ],
    serviceName: "Residential Painting",
    ogImageAlt:
      "Residential painting crew finishing a Central Valley home exterior",
  },
  {
    slug: "commercial-painting",
    keyword: "commercial painting",
    title:
      "Commercial Painting in the Central Valley | M5 Painting",
    description:
      "Commercial painting for offices, retail, restaurants, multi-family, and more in Sanger and the Central Valley. Professional crews, flexible scheduling, free estimates.",
    headline: "Commercial painting",
    highlight: "that keeps your business looking sharp.",
    intro:
      "M5 Painting delivers commercial painting for Central Valley businesses that need clean results with minimal disruption. Offices, retail, restaurants, multi-family housing, and industrial spaces — same care we bring to every residential job.",
    sections: [
      {
        heading: "Built for business schedules",
        body: "We plan commercial painting around your hours, tenants, and customers. Night and weekend windows are available when a daytime crew would interrupt operations.",
      },
      {
        heading: "Property managers and owners",
        body: "Clear communication, written scopes, and reliable timelines matter as much as the finish. As a local painting company, we’re easy to reach and accountable from walkthrough to final walkthrough.",
      },
    ],
    benefits: [
      "Offices, retail & restaurants",
      "Multi-family & property management",
      "Warehouses & light industrial",
      "Flexible after-hours scheduling",
      "Durable commercial-grade coatings",
      "Central Valley commercial painting crews",
    ],
    faqs: [
      {
        question: "Can you paint commercial spaces after hours?",
        answer:
          "Yes. Many commercial painting projects are scheduled evenings or weekends so your staff and customers aren’t disrupted.",
      },
      {
        question: "What types of commercial painting do you handle?",
        answer:
          "We paint offices, retail storefronts, restaurants, hotels, healthcare spaces, warehouses, gyms, and multi-family properties across the Central Valley.",
      },
      {
        question: "Do you work with property managers?",
        answer:
          "Absolutely. We provide detailed quotes, consistent communication, and dependable scheduling for property managers and business owners.",
      },
    ],
    relatedSlugs: [
      "residential-painting",
      "central-valley-painting-company",
      "sanger-painting-company",
    ],
    serviceName: "Commercial Painting",
    ogImageAlt:
      "Commercial painting project completed by M5 Painting in the Central Valley",
  },
  {
    slug: "interior-painting",
    keyword: "interior painting",
    title:
      "Interior Painting in Sanger & Central Valley | M5 Painting",
    description:
      "Professional interior painting in Sanger and the Central Valley — rooms, whole homes, trim, cabinets, and ceilings. Careful prep and a free estimate from M5 Painting.",
    headline: "Interior painting",
    highlight: "that transforms every room.",
    intro:
      "Looking for interior painting near Sanger or anywhere in the Central Valley? M5 Painting refreshes living rooms, bedrooms, kitchens, hallways, and whole homes with clean edges, even coverage, and finishes you’ll be proud to show guests.",
    sections: [
      {
        heading: "Rooms that feel brand new",
        body: "We prepare walls properly — patching, sanding, priming when needed — then apply quality paint that looks even under Valley daylight. Trim, doors, ceilings, and cabinets get the same attention as the walls.",
      },
      {
        heading: "Color guidance included",
        body: "Not sure which shade works? We’ll help you choose colors that fit your light, flooring, and style so your interior painting project feels intentional, not experimental.",
      },
    ],
    benefits: [
      "Single room to whole-home interiors",
      "Trim, crown molding & ceilings",
      "Cabinet refinishing",
      "Wallpaper removal",
      "Low-mess, respectful crews",
      "Free interior painting estimates",
    ],
    faqs: [
      {
        question: "Do I need to move furniture for interior painting?",
        answer:
          "We can work around furniture and protect floors and belongings. For large pieces, we may ask you to clear a few items so we can paint efficiently and safely.",
      },
      {
        question: "What paint do you use for interior painting?",
        answer:
          "We use quality interior coatings suited to each room — durable finishes for high-traffic areas and washable options for kitchens and hallways. We’ll recommend products during your estimate.",
      },
      {
        question: "Can you paint cabinets and trim?",
        answer:
          "Yes. Interior painting projects often include doors, trim, crown molding, and cabinet refinishing for a complete refresh.",
      },
    ],
    relatedSlugs: [
      "residential-painting",
      "exterior-painting",
      "sanger-painting-company",
    ],
    serviceName: "Interior Painting",
    ogImageAlt:
      "Fresh interior painting with crisp trim by M5 Painting",
  },
  {
    slug: "exterior-painting",
    keyword: "exterior painting",
    title:
      "Exterior Painting in Sanger & Central Valley | M5 Painting",
    description:
      "Exterior painting for Central Valley homes and businesses. Stucco, siding, trim, and more — coatings built for Valley sun, with free estimates from M5 Painting.",
    headline: "Exterior painting",
    highlight: "built for Valley weather.",
    intro:
      "Exterior painting in the Central Valley has to survive intense sun and dry seasons. M5 Painting prep-washes, repairs, and coats homes and commercial buildings so your curb appeal lasts — not fades in a season.",
    sections: [
      {
        heading: "Prep that protects your investment",
        body: "Pressure washing, scraping, caulking, and priming are where lasting exterior painting starts. We don’t rush past the steps that keep paint bonded through heat and wind.",
      },
      {
        heading: "Stucco, siding, trim & more",
        body: "Whether your home is stucco, wood, vinyl, or a mix, we match products and techniques to the surface — including fences, decks, brick treatments, and concrete staining when needed.",
      },
    ],
    benefits: [
      "Stucco, wood & vinyl exteriors",
      "Trim, fence & deck painting",
      "Pressure washing & surface prep",
      "Sun-resistant coatings",
      "Homes & commercial exteriors",
      "Sanger & Central Valley service",
    ],
    faqs: [
      {
        question: "When is the best time for exterior painting in the Central Valley?",
        answer:
          "Mild, dry stretches are ideal. We’ll recommend a schedule based on forecast and product curing needs so your exterior painting finishes look their best.",
      },
      {
        question: "How long does exterior paint last here?",
        answer:
          "With proper prep and quality coatings, exterior painting can last many years — though Valley sun is tough. We’ll recommend products and maintenance tips for your surface.",
      },
      {
        question: "Do you paint fences and decks?",
        answer:
          "Yes. Exterior projects often include trim, fences, decks, and other outdoor surfaces that complete the look of your property.",
      },
    ],
    relatedSlugs: [
      "residential-painting",
      "commercial-painting",
      "central-valley-painting-company",
    ],
    serviceName: "Exterior Painting",
    ogImageAlt:
      "Exterior painting on a Central Valley home by M5 Painting",
  },
  {
    slug: "sanger-painting-company",
    keyword: "painters in Sanger CA",
    title: "Painters in Sanger, CA | Interior & Exterior Painting | M5 Painting",
    description:
      "Professional painters in Sanger, CA for interior, exterior, residential, and commercial painting. M5 Painting is licensed, bonded, and insured. Get a free estimate.",
    headline: "Professional painters",
    highlight: "in Sanger, CA.",
    intro:
      "M5 Painting is a family-owned Sanger painting crew serving local homeowners and businesses with interior, exterior, residential, and commercial painting. We focus on careful prep, clear communication, and a finished job you’ll be proud to see every day.",
    sections: [
      {
        heading: "Interior and exterior painters in Sanger",
        body: "Whether you need a room refreshed, a full interior repainted, or an exterior that can handle Central Valley sun, M5 Painting can help. We paint walls, ceilings, trim, cabinets, stucco, siding, fences, decks, and other common residential and commercial surfaces.",
      },
      {
        heading: "A local painting crew that keeps the process clear",
        body: "Your project starts with a walkthrough so we can understand the surfaces, colors, prep work, and schedule. From there, we provide a clear estimate and keep you informed through prep, painting, cleanup, and the final walkthrough.",
      },
      {
        heading: "Serving Sanger homes and businesses",
        body: "Because we’re based in Sanger, local projects are part of the reputation we build every day. We also serve Fresno, Clovis, and nearby Central Valley communities when your project extends beyond Sanger.",
      },
    ],
    benefits: [
      "Interior & exterior painting",
      "Residential & commercial projects",
      "Licensed, bonded & insured",
      "Careful surface preparation",
      "Clear written estimates",
      "Free local estimates",
    ],
    faqs: [
      {
        question: "Do you provide painting estimates in Sanger, CA?",
        answer:
          "Yes. M5 Painting offers free estimates for homes and businesses in Sanger and nearby Central Valley communities.",
      },
      {
        question: "What painting services do you offer in Sanger?",
        answer:
          "We provide interior painting, exterior painting, residential painting, commercial painting, cabinet refinishing, trim work, and related surface preparation.",
      },
      {
        question: "Are your Sanger painters licensed and insured?",
        answer:
          "Yes. M5 Painting is licensed, bonded, and insured so homeowners and businesses can hire with confidence.",
      },
    ],
    relatedSlugs: [
      "residential-painting",
      "interior-painting",
      "exterior-painting",
    ],
    serviceName: "Sanger Painting Services",
    ogImageAlt: "M5 Painting crew completing a painting project in Sanger, California",
  },
  {
    slug: "central-valley-painting-company",
    keyword: "Central Valley painting company",
    title: "Central Valley Painting Company | M5 Painting",
    description:
      "Looking for a Central Valley painting company? M5 Painting provides residential, commercial, and interior painting from Sanger across Fresno, Clovis, and nearby communities.",
    headline: "A Central Valley",
    highlight: "painting company you can trust.",
    intro:
      "M5 Painting is the Central Valley painting company homeowners and businesses call for careful craftsmanship without the runaround. Based in Sanger, we bring residential painting, commercial painting, and interior painting to communities throughout the Valley.",
    sections: [
      {
        heading: "One crew, many cities",
        body: "Whether you’re in Sanger, Fresno, Clovis, or a nearby Central Valley town, you get the same family-owned crew, the same prep standards, and the same clear communication from estimate to final coat.",
      },
      {
        heading: "Homes and businesses across the Valley",
        body: "We’re set up for residential work and commercial painting scopes alike, so property owners can work with one accountable painting company across the Central Valley.",
      },
    ],
    benefits: [
      "Sanger · Fresno · Clovis & nearby",
      "Residential painting specialists",
      "Commercial painting crews",
      "Interior & exterior expertise",
      "Licensed, bonded & insured",
      "Free Central Valley estimates",
    ],
    faqs: [
      {
        question: "Which Central Valley cities do you serve?",
        answer:
          "We’re based in Sanger and regularly serve Fresno, Clovis, and surrounding Central Valley communities. Ask us if your city is in range — we’re happy to confirm.",
      },
      {
        question: "What makes M5 different from other painting companies?",
        answer:
          "We’re family-owned, locally rooted, and focused on craftsmanship and communication. No call-center runaround — just a painting company that treats your property like a neighbor’s.",
      },
      {
        question: "Can one company handle both residential and commercial painting?",
        answer:
          "Yes. M5 Painting handles residential painting and commercial painting across the Central Valley with the same attention to detail.",
      },
    ],
    relatedSlugs: [
      "sanger-painting-company",
      "commercial-painting",
      "residential-painting",
    ],
    serviceName: "Central Valley Painting Services",
    ogImageAlt:
      "Central Valley painting company — M5 Painting at work",
  },
];

export const SEO_PAGE_BY_SLUG = Object.fromEntries(
  SEO_PAGES.map((page) => [page.slug, page]),
) as Record<string, SeoPage>;

export function getSeoPage(slug: string): SeoPage | undefined {
  return SEO_PAGE_BY_SLUG[slug];
}

export function getRelatedSeoPages(slugs: string[]): SeoPage[] {
  return slugs
    .map((slug) => getSeoPage(slug))
    .filter((page): page is SeoPage => Boolean(page));
}
