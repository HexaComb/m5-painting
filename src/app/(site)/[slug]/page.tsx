import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoLanding } from "@/components/sections/seo-landing";
import { SEO_PAGES, getSeoPage } from "@/lib/seo-pages";
import type { SiteContent } from "@/lib/content-types";
import {
  defaultSiteSettings,
  defaultCertifications,
  defaultReviews,
} from "@/lib/default-content";

let buildContent: SiteContent | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  buildContent = require("@/lib/build-content.json") as SiteContent;
} catch {
  // build-content.json not yet generated
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SEO_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};

  const url = `/${page.slug}`;

  return {
    title: {
      absolute: page.title,
    },
    description: page.description,
    keywords: [
      page.keyword,
      "painters in Sanger CA",
      "Sanger painters",
      "Sanger painting company",
      "Central Valley painting company",
      "residential painting",
      "commercial painting",
      "interior painting",
      "M5 Painting",
      "Sanger",
      "Fresno",
      "Clovis",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      url,
      siteName: "M5 Painting",
      locale: "en_US",
      images: [
        {
          url: "/images/hero-banner.webp",
          width: 1200,
          height: 630,
          alt: page.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/images/hero-banner.webp"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SeoPageRoute({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) notFound();

  return (
    <SeoLanding
      page={page}
      settings={buildContent?.siteSettings ?? defaultSiteSettings}
      certifications={buildContent?.certifications ?? defaultCertifications}
      reviews={buildContent?.reviews ?? defaultReviews}
    />
  );
}
