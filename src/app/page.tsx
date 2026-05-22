import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Reviews } from "@/components/sections/reviews";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Separator } from "@/components/ui/separator";
import type { SiteContent } from "@/lib/content-types";
import {
  defaultSiteSettings,
  defaultHeroContent,
  defaultServices,
  defaultAboutContent,
  defaultAboutValues,
  defaultInstagramPosts,
  defaultReviews,
  defaultContactContent,
} from "@/lib/default-content";

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
  aboutValues: defaultAboutValues,
  instagramPosts: defaultInstagramPosts,
  reviews: defaultReviews,
  contactContent: defaultContactContent,
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://m5painting.com";

const settings = content.siteSettings ?? defaultSiteSettings;

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#business`,
  name: settings.businessName,
  description:
    settings.metaDescription ||
    "Family-owned painting contractor serving the Central Valley, California.",
  url: siteUrl,
  telephone: settings.phone,
  email: settings.email,
  image: `${siteUrl}/images/hero-banner.webp`,
  logo: `${siteUrl}/images/logo.webp`,
  priceRange: "$$",
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
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Painting Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Interior Painting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Exterior Painting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Commercial Painting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cabinet Refinishing" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Free Consultation" } },
    ],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Header initialSettings={content.siteSettings} />
      <main>
        <Hero
          initialHero={content.heroContent}
          initialSettings={content.siteSettings}
        />

        <Separator className="h-px bg-brand-blue/25" />

        <Services initialServices={content.services} />
        <Projects initialPosts={content.instagramPosts} />

        <About
          initialAbout={content.aboutContent}
          initialValues={content.aboutValues}
        />

        <Separator className="h-px bg-brand-blue/35" />

        <Reviews initialReviews={content.reviews} />

        <Separator className="h-px bg-brand-electric/30" />

        <Contact
          initialContact={content.contactContent}
          initialSettings={content.siteSettings}
        />
      </main>
      <Footer initialSettings={content.siteSettings} />
    </>
  );
}
