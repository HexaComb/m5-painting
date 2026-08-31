import type { Review, SiteSettings } from "@/lib/content-types";
import {
  HOMEPAGE_REVIEW_CAP,
  isReviewPublished,
} from "@/lib/review-display";
import { SITE_URL } from "@/lib/site";

/** City-center coordinates for Sanger, CA (used when no street address is set). */
const SANGER_GEO = {
  "@type": "GeoCoordinates" as const,
  latitude: 36.748,
  longitude: -119.556,
};

export type PostalAddressJsonLd = {
  "@type": "PostalAddress";
  addressLocality: string;
  addressRegion: string;
  addressCountry: "US";
  streetAddress?: string;
  postalCode?: string;
};

function clampRating(rating: number | undefined): number {
  if (rating === undefined) return 5;
  return Math.min(5, Math.max(1, Math.round(rating)));
}

/** Parse CMS address strings like "Sanger, CA · Central Valley" or "123 Main St, Sanger, CA 93657". */
export function parseBusinessAddress(address: string): PostalAddressJsonLd {
  const primary = (address.split("·")[0] ?? address).trim();
  const zipMatch = primary.match(/\b(\d{5})(?:-\d{4})?\b/);
  const postalCode = zipMatch?.[1];
  const withoutZip = primary
    .replace(/\b\d{5}(?:-\d{4})?\b/, "")
    .replace(/,\s*$/, "")
    .trim();
  const parts = withoutZip
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 3) {
    const regionRaw = parts[parts.length - 1] ?? "CA";
    const region = regionRaw.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "CA";
    return {
      "@type": "PostalAddress",
      streetAddress: parts.slice(0, -2).join(", "),
      addressLocality: parts[parts.length - 2] ?? "Sanger",
      addressRegion: region,
      ...(postalCode ? { postalCode } : {}),
      addressCountry: "US",
    };
  }

  if (parts.length === 2) {
    const region = parts[1]!.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "CA";
    return {
      "@type": "PostalAddress",
      addressLocality: parts[0] ?? "Sanger",
      addressRegion: region,
      ...(postalCode ? { postalCode } : {}),
      addressCountry: "US",
    };
  }

  return {
    "@type": "PostalAddress",
    addressLocality: parts[0] || "Sanger",
    addressRegion: "CA",
    ...(postalCode ? { postalCode } : {}),
    addressCountry: "US",
  };
}

function reviewDatePublished(date: string): string | undefined {
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) return date.slice(0, 10);
  const parsed = Date.parse(date);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString().slice(0, 10);
}

export function selectReviewsForJsonLd(
  reviews: Review[] | null | undefined,
  limit = HOMEPAGE_REVIEW_CAP,
): Review[] {
  return (reviews ?? [])
    .filter((review) => isReviewPublished(review.enabled))
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);
}

export function buildAggregateRatingJsonLd(reviews: Review[]) {
  if (reviews.length === 0) return undefined;
  const ratings = reviews.map((review) => clampRating(review.rating));
  const average =
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return {
    "@type": "AggregateRating" as const,
    ratingValue: Number(average.toFixed(1)),
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  };
}

export function buildReviewJsonLdNodes(reviews: Review[]) {
  return reviews.map((review) => {
    const datePublished = reviewDatePublished(review.date);
    return {
      "@type": "Review" as const,
      author: {
        "@type": "Person" as const,
        name: review.author,
      },
      reviewBody: review.text,
      reviewRating: {
        "@type": "Rating" as const,
        ratingValue: clampRating(review.rating),
        bestRating: 5,
        worstRating: 1,
      },
      ...(datePublished ? { datePublished } : {}),
      ...(review.source
        ? {
            publisher: {
              "@type": "Organization" as const,
              name: review.source,
            },
          }
        : {}),
    };
  });
}

export function buildLocalBusinessJsonLd(
  settings: SiteSettings,
  reviews: Review[] | null | undefined,
) {
  const googleMapsUrl = settings.googlePlaceId
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.businessName)}&query_place_id=${settings.googlePlaceId}`
    : undefined;
  const instagramUrl = settings.instagramUsername
    ? `https://www.instagram.com/${settings.instagramUsername}/`
    : undefined;

  // Verified external business profiles
  const bbbUrl = "https://www.bbb.org/us/ca/sanger/profile/painting-contractors/m5-painting-1126-1000160005";
  const angiUrl = "https://www.angi.com/companylist/us/ca/sanger/m5-painting-reviews-1.htm";

  const sameAsLinks = [googleMapsUrl, instagramUrl, bbbUrl, angiUrl].filter(
    (url): url is string => Boolean(url),
  );
  const schemaReviews = selectReviewsForJsonLd(reviews);
  const aggregateRating = buildAggregateRatingJsonLd(schemaReviews);
  const reviewNodes = buildReviewJsonLdNodes(schemaReviews);
  const address = parseBusinessAddress(settings.address);

  return {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: settings.businessName,
    alternateName: ["M5 Painting Company", "M5 Painting Central Valley, California"],
    description:
      settings.metaDescription ||
      "Sanger painters for homes and businesses across the Central Valley, California. Family-owned M5 Painting — residential, commercial, interior, and exterior painting.",
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    image: `${SITE_URL}/images/hero-banner.webp`,
    logo: `${SITE_URL}/images/logo.webp`,
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Check, Credit Card",
    sameAs: sameAsLinks.length > 0 ? sameAsLinks : undefined,
    hasMap: googleMapsUrl,
    identifier: settings.googlePlaceId
      ? {
          "@type": "PropertyValue",
          propertyID: "Google Place ID",
          value: settings.googlePlaceId,
        }
      : undefined,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone,
      email: settings.email,
      contactType: "customer service",
      areaServed: ["Sanger", "Fresno", "Clovis", "Central Valley, California"],
      availableLanguage: "English",
    },
    address,
    geo: SANGER_GEO,
    areaServed: [
      { "@type": "City", name: "Sanger" },
      { "@type": "City", name: "Fresno" },
      { "@type": "City", name: "Clovis" },
      { "@type": "AdministrativeArea", name: "Central Valley, California" },
    ],
    knowsAbout: [
      "residential painting",
      "commercial painting",
      "interior painting",
      "exterior painting",
      "cabinet refinishing",
      "Sanger painters",
    ],
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(reviewNodes.length > 0 ? { review: reviewNodes } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Painting Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Residential Painting",
            url: `${SITE_URL}/residential-painting`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Commercial Painting",
            url: `${SITE_URL}/commercial-painting`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Interior Painting",
            url: `${SITE_URL}/interior-painting`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Exterior Painting",
            url: `${SITE_URL}/exterior-painting`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Cabinet Refinishing",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Free Consultation",
          },
        },
      ],
    },
  };
}
