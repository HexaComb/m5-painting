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
  /** Optional page image; defaults to hero banner when omitted */
  imageSrc?: string;
};

export const SEO_PAGES: SeoPage[] = [
  {
    slug: "residential-painting",
    keyword: "residential painting",
    title:
      "House Painters in Sanger & Central Valley | Residential Painting | M5",
    description:
      "House painters and home painters in Sanger and the Central Valley. Residential painting for interiors and exteriors — careful prep, Valley-ready finishes, free estimate.",
    headline: "House painters",
    highlight: "for Central Valley homes.",
    intro:
      "Looking for house painters near Sanger? M5 Painting is a family-owned residential painting crew. We treat every home like a neighbor’s — careful prep, clean lines, and finishes that hold up in Valley heat.",
    sections: [
      {
        heading: "Home painters who prep before they paint",
        body: "Residential painting fails when prep is rushed. We patch, sand, caulk, and prime where it matters so color goes on even and stays put. From a single accent wall to a full interior and exterior refresh, our house painters leave rooms ready to live in — not left for you to clean for days.",
      },
      {
        heading: "Rooms, trim, cabinets, and whole-home scopes",
        body: "Home painting projects often mix living rooms, bedrooms, kitchens, hallways, ceilings, doors, and cabinets. We help you sequence the work, protect floors and furniture, and match sheens to how each room is used — washable finishes in high-traffic areas, softer looks where you want calm.",
      },
      {
        heading: "Built for Central Valley weather and dust",
        body: "Sanger, Fresno, and Clovis homes take sun, dust, and temperature swings. For exteriors we plan around forecast and surface temperature; for interiors we choose coatings that look even in bright Valley daylight. Local house painters know which products hold up here — we use that knowledge on every estimate.",
      },
      {
        heading: "Clear estimates for homeowners",
        body: "You’ll get a written scope covering surfaces, prep, coats, and timeline before work starts. No pressure sales — just home painters who show up, communicate, and stand behind the finish.",
      },
    ],
    benefits: [
      "House painters for interiors & exteriors",
      "Trim, doors, cabinets & ceilings",
      "Color advice for your lighting & flooring",
      "Licensed, bonded & insured",
      "Clear written estimates",
      "Family-owned crew based in Sanger",
    ],
    faqs: [
      {
        question: "Do you offer house painters for residential painting near Sanger?",
        answer:
          "Yes. M5 Painting provides residential painting and house painting for homeowners in Sanger, Fresno, Clovis, and nearby Central Valley communities.",
      },
      {
        question: "How much does residential painting cost in the Central Valley?",
        answer:
          "Cost depends on square footage, surface condition, number of colors, and whether the job is interior, exterior, or both. We provide free on-site estimates so you get a clear quote before any work starts.",
      },
      {
        question: "How long does a typical home painting project take?",
        answer:
          "A single room can often be finished in a day. Whole-home interiors or exteriors take longer depending on prep and weather. We’ll give you a realistic timeline with your estimate.",
      },
      {
        question: "Can your home painters help with color selection?",
        answer:
          "Absolutely. We’ll walk through light, flooring, trim, and how you use each room so the color plan feels intentional — not experimental.",
      },
    ],
    relatedSlugs: [
      "interior-painting",
      "exterior-painting",
      "sanger-painting-company",
    ],
    serviceName: "Residential Painting",
    ogImageAlt:
      "Residential painting and trim work completed by M5 Painting",
    imageSrc: "/images/project-door.webp",
  },
  {
    slug: "commercial-painting",
    keyword: "commercial painting",
    title:
      "Commercial Painting in the Central Valley | M5 Painting",
    description:
      "Commercial painting for offices, retail, restaurants, multi-family, and more in Sanger and the Central Valley. Flexible scheduling, durable coatings, free estimates.",
    headline: "Commercial painting",
    highlight: "around your business hours.",
    intro:
      "M5 Painting delivers commercial painting for Central Valley businesses that need clean results with minimal disruption. Offices, retail, restaurants, multi-family housing, and light industrial spaces — planned around your customers and tenants.",
    sections: [
      {
        heading: "Scheduled so your doors stay open",
        body: "Daytime crews don’t work for every business. We plan commercial painting around your hours, deliveries, and tenants. Evening and weekend windows are available when a daytime crew would interrupt operations or hurt walk-in traffic.",
      },
      {
        heading: "Offices, retail, restaurants, and multi-family",
        body: "Storefronts need crisp curb appeal. Offices need quiet, low-odor work. Restaurants and multi-family properties need durable coatings and tight coordination with managers. We write scopes that match the building type — not a one-size residential template renamed “commercial.”",
      },
      {
        heading: "Property managers get one accountable crew",
        body: "Clear communication, written scopes, and reliable timelines matter as much as the finish. As a local Central Valley painting company, we’re easy to reach from walkthrough to punch list — helpful when you manage more than one site.",
      },
      {
        heading: "Coatings built for traffic and turnover",
        body: "Commercial spaces take more abuse than living rooms. We recommend commercial-grade products for hallways, restrooms, kitchens, and high-touch trim so touch-ups aren’t a monthly chore.",
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
      {
        question: "Can you handle multi-unit or phased commercial painting?",
        answer:
          "Yes. We can phase work by floor, unit, or storefront so occupied spaces stay usable while vacant or closed areas get painted.",
      },
    ],
    relatedSlugs: [
      "residential-painting",
      "central-valley-painting-company",
      "sanger-painting-company",
    ],
    serviceName: "Commercial Painting",
    ogImageAlt:
      "Commercial painting project completed by M5 Painting",
    imageSrc: "/images/project-shop.webp",
  },
  {
    slug: "interior-painting",
    keyword: "interior painting",
    title:
      "Interior Painting in Sanger & Central Valley | M5 Painting",
    description:
      "Interior painting in Sanger and the Central Valley — rooms, whole homes, trim, cabinets, and ceilings. Low-mess crews, careful prep, free estimates from M5 Painting.",
    headline: "Interior painting",
    highlight: "with clean edges and even color.",
    intro:
      "Interior painting near Sanger should feel like a refresh, not a renovation disaster. M5 Painting updates living rooms, bedrooms, kitchens, hallways, and whole homes with protected floors, crisp trim lines, and finishes that look even under Central Valley daylight.",
    sections: [
      {
        heading: "Prep that makes walls look new",
        body: "We patch nail holes and cracks, sand uneven spots, and prime stained or repaired areas before color goes on. Skipping those steps is how you get flashing and blotchy walls — we don’t skip them.",
      },
      {
        heading: "Trim, ceilings, cabinets, and wallpaper removal",
        body: "Interior painting is rarely just the walls. Doors, baseboards, crown molding, ceilings, and cabinet refinishing often finish the look. We can also remove wallpaper and smooth surfaces so the new paint has a clean canvas.",
      },
      {
        heading: "Low-mess work inside lived-in homes",
        body: "We cover floors and belongings, keep pathways clear when we can, and clean as we go. For larger pieces we may ask you to clear a few items so the crew can work safely and finish faster.",
      },
      {
        heading: "Sheens and products matched to each room",
        body: "Kitchens and hallways want washable durability. Bedrooms often want softer sheens. We’ll recommend interior coatings suited to traffic, moisture, and light so your paint still looks sharp after real life happens.",
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
      {
        question: "How long does interior painting take for one room vs a whole home?",
        answer:
          "Many single rooms finish in a day once prep is done. Whole-home interiors depend on room count, repairs, and drying time between coats — we’ll map a schedule on the estimate visit.",
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
    imageSrc: "/images/project-door.webp",
  },
  {
    slug: "exterior-painting",
    keyword: "exterior painting",
    title:
      "Exterior Painting in Sanger & Central Valley | M5 Painting",
    description:
      "Exterior painting for Central Valley homes and businesses. Stucco, siding, trim, fences, and decks — prep and coatings built for Valley sun. Free estimates.",
    headline: "Exterior painting",
    highlight: "that survives Valley sun.",
    intro:
      "Exterior painting in the Central Valley has to survive intense sun, dry seasons, and dusty air. M5 Painting washes, repairs, and coats homes and commercial buildings so curb appeal lasts — not fades after one harsh summer.",
    sections: [
      {
        heading: "Pressure washing, repairs, and priming first",
        body: "Lasting exterior painting starts before the color coat. We pressure wash when appropriate, scrape failing paint, caulk gaps, and prime bare or chalky surfaces so the new coating bonds through heat and wind.",
      },
      {
        heading: "Stucco, wood, vinyl, and mixed exteriors",
        body: "Central Valley homes are often stucco with wood trim, or a mix of siding types. We match products and techniques to each surface — including fences, decks, brick treatments, and concrete staining when those finishes belong in the scope.",
      },
      {
        heading: "Timing the job for heat and curing",
        body: "Paint applied in the wrong temperature window peels early. We schedule exterior painting around mild, dry stretches and product curing needs so the finish levels properly and holds color longer in Sanger, Fresno, and Clovis sun.",
      },
      {
        heading: "Homes and commercial exteriors",
        body: "The same prep standards apply whether we’re refreshing a house on a quiet street or a storefront that needs to look sharp for customers. You’ll get a written exterior scope covering surfaces, prep, and coats before we start.",
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
      {
        question: "Do you paint stucco homes in Sanger and Fresno?",
        answer:
          "Yes. Stucco is common across the Central Valley. We prep and coat stucco carefully so the finish breathes properly and doesn’t trap moisture or chalk early.",
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
    imageSrc: "/images/project-aerial.webp",
  },
  {
    slug: "sanger-painting-company",
    keyword: "Sanger painters",
    title: "Sanger Painters | Painters in Sanger, CA | M5 Painting",
    description:
      "Looking for painters in Sanger? M5 Painting is a family-owned crew of Sanger painters for homes and businesses — interior, exterior, residential, and commercial. Free estimate.",
    headline: "Sanger painters",
    highlight: "for homes & businesses.",
    intro:
      "Searching for painters in Sanger? M5 Painting is a family-owned team serving local homeowners and businesses with careful prep, clean finishes, and clear communication from estimate to final walkthrough.",
    sections: [
      {
        heading: "Painters in Sanger who show up and finish the job",
        body: "M5 Painting is based in Sanger, so your project is handled by a local crew — not a call center. We paint interiors and exteriors for houses, offices, retail, and multi-family properties, with the same standards we use on our neighbors’ jobs across town.",
      },
      {
        heading: "Interior and exterior painting across Sanger",
        body: "Need a single room refreshed, a full-home interior, or an exterior that holds up in Central Valley sun? Our Sanger painters handle walls, ceilings, trim, cabinets, stucco, siding, fences, and decks. Prep, priming, and cleanup are part of every job — not add-ons.",
      },
      {
        heading: "Local neighborhoods and nearby cities",
        body: "We regularly work with homeowners and businesses in Sanger and nearby communities including Fresno, Clovis, Reedley, Selma, and Fowler. If you’re comparing painters in Sanger, ask for a free on-site estimate — we’ll walk the job and send a clear written quote.",
      },
    ],
    benefits: [
      "Local Sanger painters — family-owned",
      "Interior & exterior painting",
      "Residential & commercial projects",
      "Licensed, bonded & insured",
      "Careful surface preparation",
      "Free estimates in Sanger & nearby",
    ],
    faqs: [
      {
        question: "Are you painters in Sanger, CA?",
        answer:
          "Yes. M5 Painting is a family-owned crew of Sanger painters serving homes and businesses in Sanger and nearby Central Valley communities.",
      },
      {
        question: "How do I get a quote from Sanger painters?",
        answer:
          "Call or message us for a free on-site estimate. We’ll walk through the project, discuss colors and prep, and give you a clear written quote before any work starts.",
      },
      {
        question: "What painting services do your Sanger painters offer?",
        answer:
          "We provide interior painting, exterior painting, residential painting, commercial painting, cabinet refinishing, trim work, and full surface preparation.",
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
    serviceName: "Sanger Painters",
    ogImageAlt: "Sanger painters from M5 Painting finishing a local home painting project",
    imageSrc: "/images/team-collage.webp",
  },
  {
    slug: "central-valley-painting-company",
    keyword: "Central Valley California painting company",
    title: "Central Valley, California Painting Company | Fresno, Clovis & Sanger | M5",
    description:
      "Central Valley, California painting company based in Sanger — residential and commercial painting in Fresno, Clovis, Selma, Reedley, and nearby cities. Free estimates from M5 Painting.",
    headline: "Central Valley, California painters",
    highlight: "from a Sanger crew.",
    intro:
      "M5 Painting is a Central Valley painting company homeowners and businesses call when they want careful craftsmanship without the runaround. Based in Sanger, we bring residential and commercial painting to Fresno, Clovis, Selma, Reedley, Fowler, and nearby communities.",
    sections: [
      {
        heading: "One local crew across Fresno, Clovis, and Sanger",
        body: "You don’t need a different contractor for every city. Whether the job is in Sanger, Fresno, Clovis, or a nearby Central Valley town, you get the same family-owned crew, the same prep standards, and the same clear communication from estimate to final coat.",
      },
      {
        heading: "Residential and commercial under one roof",
        body: "House painters’ residential scopes and commercial painting for storefronts or multi-family properties can live in the same portfolio. Property owners who work across the Valley get one accountable painting company instead of juggling two vendors.",
      },
      {
        heading: "Cities we regularly serve",
        body: "We’re based in Sanger and regularly paint in Fresno, Clovis, Reedley, Selma, and Fowler. If your project is elsewhere in the Central Valley, ask — we’re happy to confirm whether your city is in range before you schedule a walkthrough.",
      },
      {
        heading: "Why Central Valley weather changes the paint job",
        body: "Sun, dust, and hot summers are hard on coatings. A Central Valley painting company should plan prep and product choice around that — not copy a coastal checklist. We estimate with local conditions in mind so interiors look even in bright light and exteriors hold color longer.",
      },
    ],
    benefits: [
      "Sanger · Fresno · Clovis · Selma & nearby",
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
          "We’re based in Sanger and regularly serve Fresno, Clovis, Reedley, Selma, Fowler, and surrounding Central Valley communities. Ask us if your city is in range — we’re happy to confirm.",
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
      {
        question: "Do you provide free estimates outside Sanger?",
        answer:
          "Yes. Free on-site estimates are available for homes and businesses throughout our Central Valley service area, including Fresno and Clovis.",
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
    imageSrc: "/images/project-spray.webp",
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
