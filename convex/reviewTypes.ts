import { v } from "convex/values";

/** Max published reviews shown on the public homepage (see CONTEXT.md). */
export const HOMEPAGE_REVIEW_CAP = 6;

/** Shared review document shape for queries and mutations. */
export const reviewValidator = v.object({
  _id: v.id("reviews"),
  _creationTime: v.number(),
  order: v.number(),
  text: v.string(),
  author: v.string(),
  date: v.string(),
  source: v.string(),
  enabled: v.optional(v.boolean()),
  rating: v.optional(v.number()),
  googleReviewId: v.optional(v.string()),
  profilePhotoUrl: v.optional(v.string()),
  authorUri: v.optional(v.string()),
  hiddenByAdmin: v.optional(v.boolean()),
});

export function isReviewEnabled(enabled: boolean | undefined): boolean {
  return enabled !== false;
}

export function reviewRating(rating: number | undefined): number {
  if (rating === undefined) return 5;
  return Math.min(5, Math.max(1, Math.round(rating)));
}

type ReviewRow = {
  order: number;
  enabled?: boolean;
  date: string;
  googleReviewId?: string;
};

export function compareReviews(a: ReviewRow, b: ReviewRow): number {
  if (a.googleReviewId && b.googleReviewId) {
    const aDate = Date.parse(a.date) || 0;
    const bDate = Date.parse(b.date) || 0;
    return bDate - aDate || a.order - b.order;
  }
  if (a.googleReviewId) return -1;
  if (b.googleReviewId) return 1;
  return a.order - b.order;
}

/** Recent Google reviews first, then manually added reviews. */
export function selectHomepageReviews<T extends ReviewRow>(reviews: T[]): T[] {
  return reviews
    .filter((r) => isReviewEnabled(r.enabled))
    .sort(compareReviews)
    .slice(0, HOMEPAGE_REVIEW_CAP);
}
