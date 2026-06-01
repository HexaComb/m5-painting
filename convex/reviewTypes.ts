import { v } from "convex/values";

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
});

export function isReviewEnabled(enabled: boolean | undefined): boolean {
  return enabled !== false;
}
