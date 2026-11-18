import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Reviews } from "@/components/sections/reviews";
import { Faqs } from "@/components/sections/faqs";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
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
  defaultFaqs,
} from "@/lib/default-content";
import { buildFaqPageJsonLd, resolveFaqs } from "@/lib/faq-jsonld";
import { buildLocalBusinessJsonLd } from "@/lib/local-business-jsonld";
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
  heroContent: defaultHeroContent,
  services: defaultServices,
  aboutContent: defaultAboutContent,
  aboutImages: defaultAboutImages,
  aboutValues: defaultAboutValues,
  instagramPosts: defaultInstagramPosts,
  reviews: defaultReviews,
  certifications: defaultCertifications,
  contactContent: defaultContactContent,
  faqs: defaultFaqs,
};

const settings = content.siteSettings ?? defaultSiteSettings;
const faqs = resolveFaqs(content.faqs, defaultFaqs);
const localBusinessJsonLd = buildLocalBusinessJsonLd(
  settings,
  content.reviews ?? defaultReviews,
);
const faqPageJsonLd = buildFaqPageJsonLd(faqs);

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: settings.businessName,
  url: SITE_URL,
  description:
    settings.metaDescription ||
    "Sanger painters from M5 Painting — residential and commercial painting across the Central Valley, California.",
  publisher: { "@id": `${SITE_URL}/#business` },
  inLanguage: "en-US",
};

export default function Home() {
  return (
    <>
      <JsonLd data={[localBusinessJsonLd, websiteJsonLd, faqPageJsonLd]} />
      <a href="#main-content" className="m5-skip-link">
        Skip to content
      </a>
      <Header initialSettings={content.siteSettings} />
      <main id="main-content">
        <Hero
          initialHero={content.heroContent}
          initialSettings={content.siteSettings}
          initialCertifications={content.certifications}
        />

        <Services initialServices={content.services} />
        <Projects initialPosts={content.instagramPosts} />

        <About
          initialAbout={content.aboutContent}
          initialImages={content.aboutImages}
          initialValues={content.aboutValues}
        />

        <Reviews initialReviews={content.reviews} />

        <Faqs faqs={faqs} />

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
