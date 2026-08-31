import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/lib/content-types";
import {
  defaultSiteSettings,
  defaultCertifications,
} from "@/lib/default-content";
import { SEO_PAGES } from "@/lib/seo-pages";
import { SITE_URL } from "@/lib/site";

let buildContent: SiteContent | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  buildContent = require("@/lib/build-content.json") as SiteContent;
} catch {
  // build-content.json hasn't been generated yet (e.g. `next dev`)
}

const content = buildContent ?? {
  siteSettings: defaultSiteSettings,
  certifications: defaultCertifications,
};

const settings = content.siteSettings ?? defaultSiteSettings;

export const metadata: Metadata = {
  title: {
    absolute:
      "Painting Services in Sanger & Central Valley | M5 Painting",
  },
  description:
    "Explore M5 Painting services — residential, commercial, interior, and exterior painting in Sanger, Fresno, Clovis, and the Central Valley. Free estimates.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Painting Services in Sanger & Central Valley | M5 Painting",
    description:
      "Residential, commercial, interior, and exterior painting from a family-owned Sanger crew.",
    type: "website",
    url: "/services",
    siteName: "M5 Painting",
    locale: "en_US",
    images: [
      {
        url: "/images/hero-banner.webp",
        width: 1200,
        height: 630,
        alt: "M5 Painting services across the Central Valley",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Painting Services in Sanger & Central Valley | M5 Painting",
    description:
      "Residential, commercial, interior, and exterior painting from M5 Painting.",
    images: ["/images/hero-banner.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const servicesPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/services#services-page`,
  url: `${SITE_URL}/services`,
  name: "M5 Painting Services",
  description:
    "Residential, commercial, interior, and exterior painting services from M5 Painting in Sanger and the Central Valley.",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#business` },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: SEO_PAGES.map((page, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: page.serviceName,
      url: `${SITE_URL}/${page.slug}`,
    })),
  },
  inLanguage: "en-US",
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={servicesPageJsonLd} />
      <Header initialSettings={content.siteSettings} />
      <main>
        <section className="brand-surface-dark relative overflow-hidden pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            aria-hidden="true"
          >
            <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-blue/40 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand-electric/25 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
            <div className="max-w-3xl">
              <p className="text-label text-brand-electric">What we paint</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Painting services for homes &amp; businesses
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-dark-secondary sm:text-xl">
                From house painters in Sanger to commercial crews across the
                Central Valley — pick a service to learn more, or request a free
                estimate.{" "}
                <Link
                  href="/our-process"
                  className="font-semibold text-brand-electric underline-offset-2 transition-colors hover:text-white hover:underline"
                >
                  See how easy our process is
                </Link>
                .
              </p>
              <div className="mt-8">
                <Link href="/contact" data-track="services-page-estimate">
                  <Button
                    size="lg"
                    className="h-auto bg-brand-blue px-7 py-3.5 text-label tracking-widest text-on-dark hover:bg-brand-electric"
                  >
                    Get a Free Estimate
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-paint-shop relative py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <ul className="grid gap-4 sm:grid-cols-2">
              {SEO_PAGES.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="block rounded-xl border border-border bg-card p-6 transition-colors hover:border-brand-blue/40"
                    data-track={`services-index-${page.slug}`}
                  >
                    <span className="text-title font-bold text-foreground">
                      {page.serviceName}
                    </span>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {page.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm text-muted-foreground">
              Serving {settings.address}. Prefer to talk it through?{" "}
              <Link
                href="/contact"
                className="font-semibold text-brand-blue hover:underline"
              >
                Contact M5 Painting
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer
        initialSettings={content.siteSettings}
        initialCertifications={content.certifications}
      />
    </>
  );
}
