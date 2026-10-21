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
  postedAt: v.optional(v.number()),
  hiddenByAdmin: v.optional(v.boolean()),
});

export function isInstagramPostEnabled(enabled: boolean | undefined): boolean {
  return enabled !== false;
}

type InstagramPostRow = {
  order: number;
  enabled?: boolean;
  postedAt?: number;
  instagramMediaId?: string;
};

export function compareInstagramPosts(a: InstagramPostRow, b: InstagramPostRow): number {
  if (a.instagramMediaId && b.instagramMediaId) {
    return (b.postedAt ?? 0) - (a.postedAt ?? 0) || a.order - b.order;
  }
  if (a.instagramMediaId) return -1;
  if (b.instagramMediaId) return 1;
  return a.order - b.order;
}

/** Recent imported posts first, then manually added posts. */
export function selectHomepageInstagramPosts<T extends InstagramPostRow>(
  posts: T[],
): T[] {
  return posts
    .filter((p) => isInstagramPostEnabled(p.enabled))
    .sort(compareInstagramPosts)
    .slice(0, HOMEPAGE_INSTAGRAM_CAP);
}
