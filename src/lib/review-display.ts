import type { Review } from "@/lib/content-types";

/** Keep in sync with convex/reviewTypes.ts HOMEPAGE_REVIEW_CAP */
export const HOMEPAGE_REVIEW_CAP = 6;

export function isReviewPublished(enabled: boolean | undefined): boolean {
  return enabled !== false;
}

export type ReviewAdminStatus = "hidden" | "homepage" | "published_overflow";

/** Admin badge: hidden, on homepage (top 6 by order), or published but past the cap. */
export function getReviewAdminStatus(
  reviews: Review[],
  reviewId: string,
): ReviewAdminStatus {
  if (!reviews.some((r) => r._id === reviewId && isReviewPublished(r.enabled))) {
    return "hidden";
  }
  const published = reviews
    .filter((r) => isReviewPublished(r.enabled))
    .sort((a, b) => a.order - b.order);
  const index = published.findIndex((r) => r._id === reviewId);
  if (index < 0) return "hidden";
  if (index < HOMEPAGE_REVIEW_CAP) return "homepage";
  return "published_overflow";
}
