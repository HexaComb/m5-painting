import Image from "next/image";
import Link from "next/link";

type CustomerProject = {
  title: string;
  detail: string;
  source: string;
  sourceUrl?: string;
};

type ServiceProof = {
  heading: string;
  introduction: string;
  imageSrc: string;
  imageAlt: string;
  examples: CustomerProject[];
  closing: string;
};

const angiReviewsUrl =
  "https://www.angi.com/companylist/us/ca/sanger/m5-painting-reviews-1.htm";

/**
 * Customer-described work, not fabricated case studies.
 *
 * Review summaries deliberately omit a city, price, schedule and project owner
 * unless the customer actually provided those details. Portfolio photographs
 * are not claimed to depict the exact jobs discussed in the reviews.
 */
const proofBySlug: Record<string, ServiceProof> = {
  "residential-painting": {
    heading: "Real homes. Real customer feedback.",
    introduction:
      "A closer look at the kinds of painting work customers have described after hiring M5. We keep the details grounded in their accounts.",
    imageSrc: "/images/project-aerial.webp",
    imageAlt: "Exterior painting work from the M5 Painting portfolio",
    examples: [
      {
        title: "Stucco, trim and a front door",
        detail:
          "An Angi customer described an exterior home repaint that included stucco and trim, color advice, and a return visit to paint the front door.",
        source: "Customer review on Angi · June 2025",
        sourceUrl: angiReviewsUrl,
      },
      {
        title: "A rental-home interior",
        detail:
          "A customer review featured on M5’s website describes an interior rental-home project completed in one day, with an on-time crew.",
        source: "Customer review featured by M5 · Yelp, June 2025",
      },
    ],
    closing:
      "Your home will have its own scope. Tell us about the rooms, surfaces and prep you need, and we’ll arrange a free estimate.",
  },
  "commercial-painting": {
    heading: "Shop painting, described by a customer.",
    introduction:
      "Commercial painting calls for a practical scope. Here is one completed shop project documented by a public customer review.",
    imageSrc: "/images/project-shop.webp",
    imageAlt: "Shop and garage painting imagery from the M5 Painting portfolio",
    examples: [
      {
        title: "A shop that looked new again",
        detail:
          "An Angi customer reported that M5 completed a paint job on their shop and was pleased with the finished appearance and crew’s professionalism.",
        source: "Verified customer review on Angi · June 2025",
        sourceUrl: angiReviewsUrl,
      },
    ],
    closing:
      "Need a quote for an office, shop, storefront, warehouse or occupied property? Share your surface conditions and preferred work hours so we can scope it accurately.",
  },
};

export function ServiceProjectProof({ slug }: { slug: string }) {
  const proof = proofBySlug[slug];
  if (!proof) return null;

  return (
    <section
      className="border-y border-brand-blue/15 bg-background py-16 sm:py-20"
      aria-labelledby={`project-proof-${slug}`}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p className="text-label-light">Work you can ask about</p>
          <h2
            id={`project-proof-${slug}`}
            className="mt-2 text-headline font-bold text-foreground"
          >
            {proof.heading}
          </h2>
          <div className="mt-3 h-0.5 w-14 brand-gradient-blue" />
          <p className="mt-5 text-body-lg text-muted-foreground">
            {proof.introduction}
          </p>
          <figure className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
            <Image
              src={proof.imageSrc}
              alt={proof.imageAlt}
              width={1200}
              height={800}
              sizes="(min-width: 1024px) 440px, 100vw"
              className="h-auto max-h-80 w-full object-cover"
            />
            <figcaption className="px-4 py-3 text-xs text-muted-foreground">
              Portfolio photo from M5 Painting. This image is not presented as
              a photograph of the reviewed job.
            </figcaption>
          </figure>
        </div>

        <div className="lg:col-span-7">
          <div className="divide-y divide-border border-y border-border">
            {proof.examples.map((example) => (
              <article key={example.title} className="py-7 first:pt-0 sm:py-8">
                <p className="text-label-light">Customer-described project</p>
                <h3 className="mt-2 text-title font-bold text-foreground">
                  {example.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {example.detail}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  {example.sourceUrl ? (
                    <a
                      href={example.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-blue underline underline-offset-4 hover:text-brand-navy"
                    >
                      {example.source}
                    </a>
                  ) : (
                    example.source
                  )}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-7 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {proof.closing}
          </p>
          <Link
            href="/contact"
            data-track={`seo-${slug}-proof-estimate`}
            className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            Request a Free Estimate
          </Link>
        </div>
      </div>
    </section>
  );
}
