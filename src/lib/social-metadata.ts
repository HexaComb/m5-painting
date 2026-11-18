import { SITE_URL } from "./site";

export const SOCIAL_IMAGE_PATH = "/images/m5-social-card-v2.jpg";
const isPreview = process.env.VERCEL_ENV === "preview";
const commit = process.env.VERCEL_GIT_COMMIT_SHA;

// Preview deployments require Vercel authentication. Social crawlers can fetch
// this public repository asset without cookies or a protection-bypass token.
// Pinning to the deployed commit also prevents stale image-cache collisions.
const previewImageUrl =
  isPreview && commit && /^[a-f0-9]{40}$/i.test(commit)
    ? `https://raw.githubusercontent.com/HexaComb/m5-painting/${commit}/public${SOCIAL_IMAGE_PATH}`
    : undefined;

export const SOCIAL_IMAGE = {
  url: previewImageUrl ?? `${SITE_URL}${SOCIAL_IMAGE_PATH}`,
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "M5 Painting: Painting done right. Family-owned in the Central Valley, with a finished black front door and white trim.",
};
