import { v } from "convex/values";

/** Max published Instagram posts shown on the public homepage (see CONTEXT.md). */
export const HOMEPAGE_INSTAGRAM_CAP = 3;

/** Shared Instagram post document shape for queries and mutations. */
export const instagramPostValidator = v.object({
  _id: v.id("instagramPosts"),
  _creationTime: v.number(),
  order: v.number(),
  embedUrl: v.string(),
  enabled: v.optional(v.boolean()),
  instagramMediaId: v.optional(v.string()),
  thumbnailUrl: v.optional(v.string()),
});

export function isInstagramPostEnabled(enabled: boolean | undefined): boolean {
  return enabled !== false;
}

type InstagramPostRow = {
  order: number;
  enabled?: boolean;
};

/** Published posts that appear on the homepage (enabled, lowest order first, capped). */
export function selectHomepageInstagramPosts<T extends InstagramPostRow>(
  posts: T[],
): T[] {
  return posts
    .filter((p) => isInstagramPostEnabled(p.enabled))
    .sort((a, b) => a.order - b.order)
    .slice(0, HOMEPAGE_INSTAGRAM_CAP);
}
