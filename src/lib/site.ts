const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.m5painting.com";

export const SITE_URL = configuredSiteUrl
  .replace(
    /^https?:\/\/(?:www\.)?m5painting\.com\/?$/i,
    "https://www.m5painting.com",
  )
  .replace(/\/$/, "");

export const BUSINESS_NAME = "M5 Painting";

export const DEFAULT_META_DESCRIPTION =
  "Sanger painters for homes and businesses across the Central Valley, California. Family-owned M5 Painting — residential, commercial, interior, and exterior painting. Free estimates.";

export const PRIMARY_KEYWORDS = [
  "painters in Sanger CA",
  "Sanger painters",
  "Sanger painting company",
  "painting company",
  "residential painting",
  "commercial painting",
  "interior painting",
  "exterior painting",
  "Central Valley California painting company",
  "painting contractor",
  "house painter",
  "Sanger",
  "Fresno",
  "Clovis",
  "Central Valley California",
  "California",
  "M5 Painting",
  "free estimate",
] as const;
