import Image from "next/image";
import Link from "next/link";
import { Phone, Check, Star } from "lucide-react";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { HeroCertifications } from "@/components/sections/certifications";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getRelatedSeoPages,
  type SeoPage,
} from "@/lib/seo-pages";
import { SITE_URL } from "@/lib/site";
import type { SiteSettings, Certification, Review } from "@/lib/content-types";
import {
  defaultSiteSettings,
  defaultCertifications,
  defaultReviews,
} from "@/lib/default-content";

type SeoLandingProps = {
  page: SeoPage;
  settings?: SiteSettings | null;
  certifications?: Certification[] | null;
  reviews?: Review[] | null;
};

export function SeoLanding({
  page,
  settings: settingsProp,
  certifications: certificationsProp,
  reviews: reviewsProp,
}: SeoLandingProps) {
  const settings = settingsProp ?? defaultSiteSettings;
  const certifications = certificationsProp ?? defaultCertifications;
  const reviews = (reviewsProp ?? defaultReviews)
    .filter((review) => review.enabled !== false)
    .slice(0, 3);
  const related = getRelatedSeoPages(page.relatedSlugs);
  const phoneHref = settings.phone.replace(/\D/g, "");
  const pageUrl = `${SITE_URL}/${page.slug}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.serviceName,
    serviceType: page.keyword,
    description: page.description,
    url: pageUrl,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      "@id": `${SITE_URL}/#business`,
      name: settings.businessName,
      telephone: settings.phone,
      email: settings.email,
      url: SITE_URL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Sanger",
        addressRegion: "CA",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "City", name: "Sanger" },
        { "@type": "City", name: "Fresno" },
        { "@type": "City", name: "Clovis" },
        { "@type": "AdministrativeArea", name: "Central Valley, California" },
      ],
    },
    areaServed: [
      { "@type": "City", name: "Sanger" },
      { "@type": "City", name: "Fresno" },
      { "@type": "City", name: "Clovis" },
      { "@type": "AdministrativeArea", name: "Central Valley, California" },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.serviceName,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={[serviceJsonLd, faqJsonLd, breadcrumbJsonLd]} />
      <Header initialSettings={settings} />
      <main>
        <section className="brand-surface-dark relative overflow-hidden pt-[4.25rem] lg:pt-[4.75rem]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 top-1/4 h-72 w-[min(90vw,520px)] brand-swoosh"
          />
          <div className="relative z-[2] mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 md:py-24">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-on-dark-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="transition-colors hover:text-on-dark">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-on-dark-secondary">{page.serviceName}</li>
              </ol>
            </nav>
            <h1 className="max-w-3xl text-display font-extrabold text-white">
              {page.headline}{" "}
              <span className="text-brand-electric">{page.highlight}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-on-dark-secondary">
              {page.intro}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/#contact" data-track={`seo-${page.slug}-estimate`}>
                <Button
                  size="lg"
                  className="h-auto bg-brand-blue px-7 py-3.5 text-label tracking-widest text-on-dark hover:bg-brand-electric"
                >
                  Get a Free Estimate
                </Button>
              </Link>
              <a href={`tel:${phoneHref}`} data-track={`seo-${page.slug}-phone`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto border-white/20 bg-white/5 px-6 py-3.5 text-on-dark hover:bg-white/10 hover:text-on-dark"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {settings.phone}
                </Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6">
              <HeroCertifications certifications={certifications} />
            </div>
          </div>
        </section>

        <section className="surface-paint-shop relative py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-10 lg:col-span-7">
              {page.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-headline font-bold text-foreground">
                    {section.heading}
                  </h2>
                  <div className="mt-3 h-0.5 w-14 brand-gradient-blue" />
                  <p className="mt-5 text-body-lg text-muted-foreground">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-xl border border-brand-navy/20 bg-brand-black p-7 text-white shadow-xl shadow-brand-navy/20 sm:p-8">
                <p className="text-label text-brand-electric">What you get</p>
                <h2 className="mt-2 text-title font-bold">
                  {page.serviceName} with M5
                </h2>
                <ul className="mt-6 space-y-3">
                  {page.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-3 text-sm text-on-dark-secondary"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-electric" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative mt-6 overflow-hidden rounded-xl">
                <Image
                  src="/images/hero-banner.webp"
                  alt={page.ogImageAlt}
                  width={1200}
                  height={630}
                  className="h-48 w-full object-cover sm:h-56"
                />
              </div>
            </aside>
          </div>
        </section>

        {reviews.length > 0 ? (
          <section className="border-y border-brand-blue/20 bg-background py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-5 sm:px-6">
              <p className="text-label-light">Real customer feedback</p>
              <h2 className="mt-2 text-headline font-bold text-foreground">
                What customers say about M5 Painting
              </h2>
              <div className="mt-3 h-0.5 w-14 brand-gradient-blue" />
              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {reviews.map((review) => (
                  <article
                    key={review._id}
                    className="rounded-xl border border-border bg-card p-6 shadow-sm"
                  >
                    <div className="flex gap-1" aria-label={`${review.rating ?? 5} out of 5 stars`}>
                      {Array.from({ length: review.rating ?? 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className="h-4 w-4 fill-current text-brand-blue"
                          aria-hidden
                        />
                      ))}
                    </div>
                    <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      “{review.text}”
                    </blockquote>
                    <p className="mt-5 text-sm font-bold text-foreground">
                      {review.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.source} · {review.date}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-background py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <h2 className="text-headline font-bold text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-3 h-0.5 w-14 brand-gradient-blue" />
            <div className="mt-10 space-y-6">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="max-w-3xl">
                  <h3 className="text-lg font-bold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="border-t border-brand-blue/15 py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-5 sm:px-6">
              <h2 className="text-headline font-bold text-foreground">
                Related painting services
              </h2>
              <div className="mt-3 h-0.5 w-14 brand-gradient-blue" />
              <ul className="mt-10 grid gap-4 sm:grid-cols-3">
                {related.map((relatedPage) => (
                  <li key={relatedPage.slug}>
                    <Link
                      href={`/${relatedPage.slug}`}
                      className="block rounded-xl border border-border bg-card p-6 transition-colors hover:border-brand-blue/40"
                    >
                      <span className="text-title font-bold text-foreground">
                        {relatedPage.serviceName}
                      </span>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {relatedPage.keyword}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section
          id="contact-cta"
          className="brand-surface-dark border-t border-white/10 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-5 text-center sm:px-6">
            <p className="text-label text-brand-electric">Ready when you are</p>
            <h2 className="mt-3 text-headline font-bold text-white">
              Get your free {page.keyword} estimate
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-on-dark-secondary">
              Tell us about your project in Sanger or anywhere in the Central
              Valley. We’ll walk the job and send a clear written quote.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/#contact" data-track={`seo-${page.slug}-contact`}>
                <Button
                  size="lg"
                  className="h-auto bg-brand-blue px-7 py-3.5 text-label tracking-widest text-on-dark hover:bg-brand-electric"
                >
                  Get a Free Estimate
                </Button>
              </Link>
              <a href={`tel:${phoneHref}`} data-track={`seo-${page.slug}-call`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto border-white/20 bg-white/5 px-6 py-3.5 text-on-dark hover:bg-white/10 hover:text-on-dark"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call {settings.phone}
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer
        initialSettings={settings}
        initialCertifications={certifications}
      />
    </>
  );
}
