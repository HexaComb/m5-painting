import type { Metadata } from "next";
import { Header } from "@/components/sections/header";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { JsonLd } from "@/components/seo/JsonLd";
import type { SiteContent } from "@/lib/content-types";
import {
  defaultSiteSettings,
  defaultCertifications,
  defaultContactContent,
} from "@/lib/default-content";
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
  contactContent: defaultContactContent,
};

const settings = content.siteSettings ?? defaultSiteSettings;

export const metadata: Metadata = {
  title: {
    absolute: "Contact M5 Painting | Get a Free Painting Estimate",
  },
  description:
    "Contact M5 Painting for a free residential or commercial painting estimate in Sanger, Fresno, Clovis, and the Central Valley.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact M5 Painting | Get a Free Painting Estimate",
    description:
      "Tell M5 Painting about your project and request a free painting estimate for your home or business.",
    type: "website",
    url: "/contact",
    siteName: "M5 Painting",
    locale: "en_US",
    images: [
      {
        url: "/images/hero-banner.webp",
        width: 1200,
        height: 630,
        alt: "M5 Painting crew serving the Central Valley",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact M5 Painting | Get a Free Painting Estimate",
    description:
      "Tell M5 Painting about your project and request a free painting estimate.",
    images: ["/images/hero-banner.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contact#contact-page`,
  url: `${SITE_URL}/contact`,
  name: "Contact M5 Painting",
  description:
    "Request a free residential or commercial painting estimate from M5 Painting.",
  mainEntity: {
    "@id": `${SITE_URL}/#business`,
  },
  inLanguage: "en-US",
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageJsonLd} />
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
              <p className="text-label text-brand-electric">Start your project</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Let&apos;s talk about your painting project
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-dark-secondary sm:text-xl">
                Tell us what you need, where the project is located, and any
                details that will help us prepare your free estimate.
              </p>
              <p className="mt-5 text-sm font-semibold text-brand-electric">
                Serving {settings.address}
              </p>
            </div>
          </div>
        </section>

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
