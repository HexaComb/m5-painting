import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  type ActionCtx,
} from "./_generated/server";
import { isInstagramPostEnabled } from "./instagramTypes";

/** How many reels to import per sync. */
const SYNC_REEL_LIMIT = 12;

const RAPIDAPI_HOST = "instagram120.p.rapidapi.com";
const RAPIDAPI_POSTS_URL = `https://${RAPIDAPI_HOST}/api/instagram/posts`;

const upsertedPostValidator = v.object({
  instagramMediaId: v.string(),
  embedUrl: v.string(),
  thumbnailUrl: v.optional(v.string()),
});

function getRapidApiKey(): string {
  const key = process.env.RAPIDAPI_KEY ?? process.env.RAPID_API_KEY;
  if (!key) {
    throw new Error(
      "RAPIDAPI_KEY is not set in the Convex dashboard environment variables.",
    );
  }
  return key;
}

function normalizeUsername(username: string): string {
  return username.trim().replace(/^@/, "");
}

function reelEmbedUrl(shortcode: string): string {
  return `https://www.instagram.com/reel/${shortcode}/`;
}

type RapidApiPost = Record<string, unknown>;

type ParsedReel = {
  instagramMediaId: string;
  embedUrl: string;
  thumbnailUrl?: string;
};

function readString(obj: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return undefined;
}

function readNestedString(
  obj: Record<string, unknown>,
  path: string[],
): string | undefined {
  let current: unknown = obj;
  for (const key of path) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  if (typeof current === "string" && current.trim()) return current.trim();
  if (typeof current === "number" && Number.isFinite(current)) return String(current);
  return undefined;
}

function extractShortcode(post: RapidApiPost): string | undefined {
  const direct = readString(post, "shortcode", "code", "short_code");
  if (direct) return direct;

  const permalink = readString(post, "permalink", "link", "url");
  if (permalink) {
    const match = permalink.match(/instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/i);
    if (match?.[1]) return match[1];
  }

  return undefined;
}

function extractMediaId(post: RapidApiPost): string | undefined {
  return readString(post, "id", "pk", "media_id", "mediaId");
}

function extractThumbnail(post: RapidApiPost): string | undefined {
  const direct = readString(
    post,
    "thumbnail_url",
    "thumbnailUrl",
    "display_url",
    "displayUrl",
    "thumbnail_src",
  );
  if (direct) return direct;

  const candidates = post.image_versions2;
  if (candidates && typeof candidates === "object") {
    const items = (candidates as Record<string, unknown>).candidates;
    if (Array.isArray(items) && items.length > 0) {
      const first = items[0];
      if (first && typeof first === "object") {
        return readString(first as Record<string, unknown>, "url");
      }
    }
  }

  return readNestedString(post, ["thumbnail", "url"]);
}

function isReelPost(post: RapidApiPost): boolean {
  const productType = readString(post, "product_type", "productType")?.toLowerCase();
  if (productType === "clips" || productType === "reels") return true;

  const permalink = readString(post, "permalink", "link", "url") ?? "";
  if (permalink.includes("/reel/")) return true;

  const mediaType = readString(post, "media_type", "mediaType", "type")?.toLowerCase();
  if (mediaType === "reel" || mediaType === "clips") return true;
  if (mediaType === "1" || mediaType === "photo" || mediaType === "image") return false;
  if (mediaType === "8" || mediaType === "carousel" || mediaType === "carousel_album") {
    return false;
  }

  return false;
}

function extractPostsFromResponse(data: Record<string, unknown>): RapidApiPost[] {
  const directArrays = [data.items, data.posts];
  for (const candidate of directArrays) {
    if (Array.isArray(candidate)) {
      return candidate.filter(
        (item): item is RapidApiPost => !!item && typeof item === "object",
      );
    }
  }

  const nestedSources = [data.data, data.result];
  for (const source of nestedSources) {
    if (source && typeof source === "object" && !Array.isArray(source)) {
      const nested = source as Record<string, unknown>;
      if (Array.isArray(nested.items)) {
        return nested.items.filter(
          (item): item is RapidApiPost => !!item && typeof item === "object",
        );
      }
      if (Array.isArray(nested.posts)) {
        return nested.posts.filter(
          (item): item is RapidApiPost => !!item && typeof item === "object",
        );
      }
    }
  }

  return [];
}

function mapRapidApiPost(post: RapidApiPost): ParsedReel | null {
  if (!isReelPost(post)) return null;

  const shortcode = extractShortcode(post);
  const instagramMediaId = extractMediaId(post) ?? shortcode;
  if (!instagramMediaId || !shortcode) return null;

  return {
    instagramMediaId,
    embedUrl: reelEmbedUrl(shortcode),
    thumbnailUrl: extractThumbnail(post),
  };
}

function extractNextMaxId(
  data: Record<string, unknown>,
  posts: RapidApiPost[],
): string | undefined {
  const fromRoot = readString(
    data,
    "next_max_id",
    "nextMaxId",
    "maxId",
    "next_maxId",
  );
  if (fromRoot) return fromRoot;

  const nested = readNestedString(data, ["data", "next_max_id"]);
  if (nested) return nested;

  const last = posts[posts.length - 1];
  if (last) {
    return readString(last, "id", "pk");
  }

  return undefined;
}

async function fetchRapidApiPostsPage(
  apiKey: string,
  username: string,
  maxId: string,
): Promise<{ posts: RapidApiPost[]; nextMaxId?: string }> {
  const response = await fetch(RAPIDAPI_POSTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key": apiKey,
    },
    body: JSON.stringify({
      username: normalizeUsername(username),
      maxId,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `RapidAPI returned ${response.status}: ${body.slice(0, 300)}`,
    );
  }

  const data = (await response.json()) as Record<string, unknown>;
  const posts = extractPostsFromResponse(data);
  const nextMaxId = extractNextMaxId(data, posts);

  return { posts, nextMaxId };
}

async function fetchReelsFromRapidApi(username: string, apiKey: string) {
  const reels: ParsedReel[] = [];
  const seen = new Set<string>();
  let maxId = "";
  let pagesFetched = 0;
  const maxPages = 5;

  while (reels.length < SYNC_REEL_LIMIT && pagesFetched < maxPages) {
    const page = await fetchRapidApiPostsPage(apiKey, username, maxId);
    pagesFetched += 1;

    for (const post of page.posts) {
      const mapped = mapRapidApiPost(post);
      if (!mapped || seen.has(mapped.instagramMediaId)) continue;
      seen.add(mapped.instagramMediaId);
      reels.push(mapped);
      if (reels.length >= SYNC_REEL_LIMIT) break;
    }

    if (reels.length >= SYNC_REEL_LIMIT || !page.nextMaxId || page.posts.length === 0) {
      break;
    }
    maxId = page.nextMaxId;
  }

  return {
    reels: reels.slice(0, SYNC_REEL_LIMIT),
    pagesFetched,
  };
}

export const getInstagramUsername = internalQuery({
  args: {},
  returns: v.union(
    v.object({
      instagramUsername: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").first();
    if (!settings) return null;
    return { instagramUsername: settings.instagramUsername };
  },
});

export const upsertInstagramPosts = internalMutation({
  args: {
    posts: v.array(upsertedPostValidator),
  },
  returns: v.object({
    imported: v.number(),
    updated: v.number(),
    pruned: v.number(),
  }),
  handler: async (ctx, { posts: incoming }) => {
    let imported = 0;
    let updated = 0;

    const existing = await ctx.db.query("instagramPosts").collect();
    const maxOrder = existing.reduce((max, p) => Math.max(max, p.order), 0);
    let nextOrder = maxOrder;

    const keepIds = new Set(incoming.map((p) => p.instagramMediaId));

    for (const post of incoming) {
      const match = await ctx.db
        .query("instagramPosts")
        .withIndex("by_instagram_media_id", (q) =>
          q.eq("instagramMediaId", post.instagramMediaId),
        )
        .first();

      if (match) {
        await ctx.db.patch(match._id, {
          embedUrl: post.embedUrl,
          thumbnailUrl: post.thumbnailUrl,
        });
        updated += 1;
      } else {
        nextOrder += 1;
        await ctx.db.insert("instagramPosts", {
          order: nextOrder,
          embedUrl: post.embedUrl,
          instagramMediaId: post.instagramMediaId,
          thumbnailUrl: post.thumbnailUrl,
          enabled: false,
        });
        imported += 1;
      }
    }

    let pruned = 0;
    for (const row of existing) {
      if (!row.instagramMediaId) continue;
      if (isInstagramPostEnabled(row.enabled)) continue;
      if (keepIds.has(row.instagramMediaId)) continue;
      await ctx.db.delete(row._id);
      pruned += 1;
    }

    return { imported, updated, pruned };
  },
});

const syncInstagramPostsReturns = v.object({
  imported: v.number(),
  updated: v.number(),
  pruned: v.number(),
  fetched: v.number(),
  pagesFetched: v.number(),
  skipped: v.boolean(),
  skipReason: v.optional(v.string()),
});

type SyncInstagramPostsResult = {
  imported: number;
  updated: number;
  pruned: number;
  fetched: number;
  pagesFetched: number;
  skipped: boolean;
  skipReason?: string;
};

async function syncInstagramPostsHandler(
  ctx: ActionCtx,
): Promise<SyncInstagramPostsResult> {
  const apiKey = getRapidApiKey();

  const settings = await ctx.runQuery(internal.instagramPosts.getInstagramUsername);
  const username = settings?.instagramUsername?.trim();
  if (!username) {
    return {
      imported: 0,
      updated: 0,
      pruned: 0,
      fetched: 0,
      pagesFetched: 0,
      skipped: true,
      skipReason: "Instagram username is not set in site settings.",
    };
  }

  const { reels, pagesFetched } = await fetchReelsFromRapidApi(username, apiKey);

  const result = await ctx.runMutation(
    internal.instagramPosts.upsertInstagramPosts,
    { posts: reels },
  );

  return {
    ...result,
    fetched: reels.length,
    pagesFetched,
    skipped: false,
  };
}

/** Scheduled RapidAPI pull (weekly via crons.ts). */
export const syncInstagramPosts = internalAction({
  args: {},
  returns: syncInstagramPostsReturns,
  handler: syncInstagramPostsHandler,
});

/** Admin-triggered RapidAPI pull (Admin → Settings). */
export const syncInstagramPostsNow = action({
  args: {},
  returns: syncInstagramPostsReturns,
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return syncInstagramPostsHandler(ctx);
  },
});
