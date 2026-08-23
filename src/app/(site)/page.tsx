import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Reviews } from "@/components/sections/reviews";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Separator } from "@/components/ui/separator";
import { JsonLd } from "@/components/seo/JsonLd";
import type { SiteContent } from "@/lib/content-types";
import {
  defaultSiteSettings,
  defaultHeroContent,
  defaultServices,
  defaultAboutContent,
  defaultAboutImages,
  defaultAboutValues,
  defaultInstagramPosts,
  defaultReviews,
  defaultCertifications,
  defaultContactContent,
} from "@/lib/default-content";
import { buildLocalBusinessJsonLd } from "@/lib/local-business-jsonld";
import { SITE_URL } from "@/lib/site";
import { SEO_PAGES } from "@/lib/seo-pages";

let buildContent: SiteContent | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  buildContent = require("@/lib/build-content.json") as SiteContent;
} catch {
  // build-content.json hasn't been generated yet (e.g. `next dev`)
}

const content = buildContent ?? {
  siteSettings: defaultSiteSettings,
  heroContent: defaultHeroContent,
  services: defaultServices,
  aboutContent: defaultAboutContent,
  aboutImages: defaultAboutImages,
  aboutValues: defaultAboutValues,
  instagramPosts: defaultInstagramPosts,
  reviews: defaultReviews,
  certifications: defaultCertifications,
  contactContent: defaultContactContent,
};

const settings = content.siteSettings ?? defaultSiteSettings;
const localBusinessJsonLd = buildLocalBusinessJsonLd(
  settings,
  content.reviews ?? defaultReviews,
);

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: settings.businessName,
  url: SITE_URL,
  description:
    settings.metaDescription ||
    "Sanger painters from M5 Painting — residential and commercial painting across the Central Valley.",
  publisher: { "@id": `${SITE_URL}/#business` },
  inLanguage: "en-US",
};

const serviceLinks = SEO_PAGES.filter((page) =>
  [
    "residential-painting",
    "commercial-painting",
    "interior-painting",
    "exterior-painting",
    "sanger-painting-company",
    "central-valley-painting-company",
  ].includes(page.slug),
);

export default function Home() {
  return (
    <>
      <JsonLd data={[localBusinessJsonLd, websiteJsonLd]} />
      <Header initialSettings={content.siteSettings} />
      <main>
        <Hero
          initialHero={content.heroContent}
          initialSettings={content.siteSettings}
          initialCertifications={content.certifications}
        />

        <Separator className="h-px bg-brand-blue/25" />

        <Services initialServices={content.services} />
        <Projects initialPosts={content.instagramPosts} />

        <About
          initialAbout={content.aboutContent}
          initialImages={content.aboutImages}
          initialValues={content.aboutValues}
        />

        <Separator className="h-px bg-brand-blue/35" />

        <Reviews initialReviews={content.reviews} />

        <section className="border-y border-brand-blue/15 bg-background py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <p className="text-label-light">Explore our services</p>
            <h2 className="mt-2 text-headline font-bold text-foreground">
              Painting services across the Central Valley
            </h2>
            <div className="mt-3 h-0.5 w-14 brand-gradient-blue" />
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Learn more about residential painting, commercial painting,
              interior painting, and our Sanger-based crew serving the Central
              Valley.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {serviceLinks.map((page) => (
                <li key={page.slug}>
                  <a
                    href={`/${page.slug}`}
                    className="block rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-blue/40 hover:text-brand-blue"
                  >
                    {page.serviceName}
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      {page.keyword}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Separator className="h-px bg-brand-electric/30" />

        <Contact
          initialContact={content.contactContent}
          initialSettings={content.siteSettings}
        />
      </main>
      <Footer
        initialSettings={content.siteSettings}
        initialCertifications={content.certifications}
      />
    </>
  );
}
