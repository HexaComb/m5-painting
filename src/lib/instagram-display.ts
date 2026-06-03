import type { InstagramPost } from "@/lib/content-types";

/** Keep in sync with convex/instagramTypes.ts HOMEPAGE_INSTAGRAM_CAP */
export const HOMEPAGE_INSTAGRAM_CAP = 3;

export function isInstagramPostPublished(enabled: boolean | undefined): boolean {
  return enabled !== false;
}

export type InstagramPostAdminStatus = "hidden" | "homepage" | "published_overflow";

/** Admin badge: hidden, on homepage (top 3 by order), or published but past the cap. */
export function getInstagramPostAdminStatus(
  posts: InstagramPost[],
  postId: string,
): InstagramPostAdminStatus {
  if (!posts.some((p) => p._id === postId && isInstagramPostPublished(p.enabled))) {
    return "hidden";
  }
  const published = posts
    .filter((p) => isInstagramPostPublished(p.enabled))
    .sort((a, b) => a.order - b.order);
  const index = published.findIndex((p) => p._id === postId);
  if (index < 0) return "hidden";
  if (index < HOMEPAGE_INSTAGRAM_CAP) return "homepage";
  return "published_overflow";
}
