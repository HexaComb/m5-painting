import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { Separator } from "@/components/ui/separator";
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
const thumbnailUrl = `${SITE_URL}/images/hero-banner.webp`;

const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "The M5 Painting Process — Easy, Reliable, Professional",
  description:
    "See how M5 Painting makes your project easy from estimate to final walkthrough. Our family-owned Sanger crew delivers residential and commercial painting with careful prep, clear communication, and finishes built for the Central Valley.",
  thumbnailUrl,
  contentUrl: videoUrl,
  uploadDate: "2024-01-01T00:00:00Z",
  duration: "PT1M30S",
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
        width: 1200,
        height: 630,
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
        <section className="brand-surface-dark relative overflow-hidden pt-[4.25rem] lg:pt-[4.75rem]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 top-1/4 h-72 w-[min(90vw,520px)] brand-swoosh"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 bottom-0 h-48 w-80 rounded-full bg-brand-electric/20 blur-3xl"
          />

          <div
            className="absolute inset-0 z-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='18' r='1.2' fill='white'/%3E%3Ccircle cx='48' cy='8' r='0.8' fill='white'/%3E%3Ccircle cx='78' cy='42' r='1' fill='white'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-[2] mx-auto max-w-4xl px-5 py-14 sm:px-6 sm:py-20 md:py-24">
            <p className="mb-3 text-label text-brand-electric">
              Sanger, CA · Family-Owned
            </p>
            <h1 className="text-display font-extrabold text-white">
              Our Process
              <br />
              <span className="relative inline-block text-brand-electric">
                Easy from start to finish.
                <svg
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-2 w-full"
                  aria-hidden="true"
                >
                  <path
                    d="M3,8 C30,3 60,7 90,5 C120,3 150,8 180,5 C210,3 240,8 270,5 C285,4 294,7 297,6"
                    stroke="url(#process-underline)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.85"
                  />
                  <defs>
                    <linearGradient
                      id="process-underline"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="oklch(0.64 0.16 248)" />
                      <stop offset="100%" stopColor="oklch(0.92 0.01 262)" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
          </div>
        </section>

        <section className="bg-background py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-5 sm:px-6">
            <div className="aspect-video overflow-hidden rounded-xl shadow-xl ring-1 ring-border">
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

            <div className="mt-12 space-y-6">
              <div>
                <h2 className="text-headline font-bold text-foreground">
                  Why M5 Painting makes it easy
                </h2>
                <div className="mt-3 h-0.5 w-14 brand-gradient-blue" />
              </div>

              <p className="text-body text-muted-foreground">
                At M5 Painting, we know that hiring painters shouldn&apos;t feel
                complicated. From the first estimate to the final walkthrough,
                our family-owned Sanger crew makes the process straightforward,
                respectful, and reliable.
              </p>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-body-lg font-semibold text-foreground">
                    Clear estimates
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You&apos;ll get a written scope covering surfaces, prep, coats,
                    and timeline before work starts. No hidden fees, no
                    pressure sales.
                  </p>
                </div>

                <div>
                  <h3 className="text-body-lg font-semibold text-foreground">
                    Careful prep
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We patch, sand, caulk, and prime where it matters so color
                    goes on even and stays put through Valley heat and dust.
                  </p>
                </div>

                <div>
                  <h3 className="text-body-lg font-semibold text-foreground">
                    Respectful crews
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We protect your floors and belongings, keep work areas
                    clean, and communicate throughout the project.
                  </p>
                </div>

                <div>
                  <h3 className="text-body-lg font-semibold text-foreground">
                    Built for the Central Valley
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Our finishes are chosen to handle Sanger, Fresno, and
                    Clovis weather — sun, dust, and temperature swings included.
                  </p>
                </div>
              </div>

              <div className="mt-12 rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-6 sm:p-8">
                <h3 className="text-body-lg font-semibold text-foreground">
                  Ready to get started?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get a free estimate for your residential or commercial
                  painting project in the Central Valley.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-block rounded-lg bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90"
                >
                  Request Free Estimate
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Separator className="h-px bg-brand-blue/25" />

        <section className="bg-surface py-14 sm:py-16">
          <div className="mx-auto max-w-4xl px-5 sm:px-6">
            <h2 className="text-headline font-bold text-foreground">
              Our painting services
            </h2>
            <div className="mt-3 h-0.5 w-14 brand-gradient-blue" />
            <p className="mt-4 text-muted-foreground">
              M5 Painting serves homes and businesses across Sanger, Fresno,
              Clovis, and the Central Valley.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              <li>
                <Link
                  href="/residential-painting"
                  className="block rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-blue/40 hover:text-brand-blue"
                >
                  Residential Painting
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    House painters for homes
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/commercial-painting"
                  className="block rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-blue/40 hover:text-brand-blue"
                >
                  Commercial Painting
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    Businesses & multi-family
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/interior-painting"
                  className="block rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-blue/40 hover:text-brand-blue"
                >
                  Interior Painting
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    Walls, trim, ceilings & cabinets
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/exterior-painting"
                  className="block rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-blue/40 hover:text-brand-blue"
                >
                  Exterior Painting
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    Stucco, siding & fences
                  </span>
                </Link>
              </li>
            </ul>
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
