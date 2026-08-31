import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { SITE_URL } from "@/lib/site";
import type { SiteContent } from "@/lib/content-types";
import {
  defaultSiteSettings,
  defaultCertifications,
} from "@/lib/default-content";

let buildContent: SiteContent | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  buildContent = require("@/lib/build-content.json") as SiteContent;
} catch {
  // build-content.json not yet generated
}

const pageUrl = `${SITE_URL}/our-process`;
const videoUrl = `${SITE_URL}/videos/m5easyprocess-720p.mp4`;
const thumbnailUrl = `${SITE_URL}/images/process-video-thumbnail.webp`;

const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "The M5 Painting Process — Easy, Reliable, Professional",
  description:
    "See how M5 Painting makes your project easy from estimate to final walkthrough. Our family-owned Sanger crew delivers residential and commercial painting with careful prep, clear communication, and finishes built for the Central Valley, California.",
  thumbnailUrl,
  contentUrl: videoUrl,
  uploadDate: "2026-06-03T07:56:07Z",
};

export const metadata: Metadata = {
  title: "Our Process — Easy Painting From Start to Finish | M5 Painting",
  description:
    "Watch how M5 Painting makes residential and commercial painting easy for homeowners and businesses in Sanger and the Central Valley. Clear estimates, careful prep, and professional results.",
  keywords: [
    "painting process",
    "how painting works",
    "M5 Painting",
    "Sanger painters",
    "painting company process",
    "residential painting",
    "commercial painting",
  ],
  alternates: {
    canonical: "/our-process",
  },
  openGraph: {
    title: "Our Process — Easy Painting From Start to Finish | M5 Painting",
    description:
      "Watch how M5 Painting makes residential and commercial painting easy for homeowners and businesses in Sanger and the Central Valley.",
    type: "video.other",
    url: pageUrl,
    siteName: "M5 Painting",
    locale: "en_US",
    images: [
      {
        url: thumbnailUrl,
        width: 720,
        height: 1280,
        alt: "M5 Painting process — easy, reliable, professional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Process — Easy Painting From Start to Finish | M5 Painting",
    description:
      "Watch how M5 Painting makes residential and commercial painting easy for homeowners and businesses in Sanger and the Central Valley.",
    images: [thumbnailUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OurProcessPage() {
  const settings =
    buildContent?.siteSettings ?? defaultSiteSettings;
  const certifications =
    buildContent?.certifications ?? defaultCertifications;

  return (
    <>
      <JsonLd data={videoJsonLd} />
      <Header initialSettings={settings} />
      <main>
        <section className="brand-surface-dark relative overflow-hidden pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
          >
            <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-blue/40 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand-electric/25 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-5 sm:px-6">
            <div className="aspect-video overflow-hidden rounded-xl shadow-xl ring-1 ring-white/10">
              <video
                controls
                preload="metadata"
                poster={thumbnailUrl}
                className="h-full w-full bg-black"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="mt-8 sm:mt-12">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Our Process — Easy From Start to Finish
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-dark-secondary">
                At M5 Painting, we know that hiring painters shouldn&apos;t feel
                complicated. From the first estimate to the final walkthrough,
                our family-owned Sanger crew makes the process straightforward,
                respectful, and reliable.
              </p>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Clear estimates
                </h3>
                <p className="mt-2 text-sm text-on-dark-secondary">
                  You&apos;ll get a written scope covering surfaces, prep, coats,
                  and timeline before work starts. No hidden fees, no
                  pressure sales.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Careful prep
                </h3>
                <p className="mt-2 text-sm text-on-dark-secondary">
                  We patch, sand, caulk, and prime where it matters so color
                  goes on even and stays put through Valley heat and dust.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Respectful crews
                </h3>
                <p className="mt-2 text-sm text-on-dark-secondary">
                  We protect your floors and belongings, keep work areas
                  clean, and communicate throughout the project.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Built for the Central Valley
                </h3>
                <p className="mt-2 text-sm text-on-dark-secondary">
                  Our finishes are chosen to handle Sanger, Fresno, and
                  Clovis weather — sun, dust, and temperature swings included.
                </p>
              </div>
            </div>

            <div className="mt-12 rounded-lg border border-brand-electric/20 bg-brand-electric/10 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white">
                Ready to get started?
              </h3>
              <p className="mt-2 text-sm text-on-dark-secondary">
                Get a free estimate for your residential or commercial
                painting project in the Central Valley.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-block rounded-lg bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-electric"
              >
                Request Free Estimate
              </Link>
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
