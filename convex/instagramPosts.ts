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
const RAPIDAPI_REELS_URL = `https://${RAPIDAPI_HOST}/api/instagram/reels`;

function logInstagramSync(message: string, data?: Record<string, unknown>) {
  if (data) {
    console.log(`[instagram-sync] ${message}`, JSON.stringify(data));
  } else {
    console.log(`[instagram-sync] ${message}`);
  }
}

function describeValueShape(value: unknown): Record<string, unknown> {
  if (Array.isArray(value)) {
    const first = value[0];
    return {
      type: "array",
      length: value.length,
      firstItemKeys:
        first && typeof first === "object" ? Object.keys(first as object) : [],
    };
  }
  if (value && typeof value === "object") {
    return { type: "object", keys: Object.keys(value as object) };
  }
  return { type: typeof value };
}

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
  const direct = readString(post, "shortcode", "code", "short_code", "identifier");
  if (direct) return direct;

  const permalink = readString(
    post,
    "permalink",
    "link",
    "url",
    "pictureUrl",
  );
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
    "display_uri",
    "thumbnail_src",
    "pictureUrl",
  );
  if (direct) return direct;

  const thumbnailResources = post.thumbnail_resources;
  if (Array.isArray(thumbnailResources) && thumbnailResources.length > 0) {
    const largest = thumbnailResources[thumbnailResources.length - 1];
    if (largest && typeof largest === "object") {
      return readString(largest as Record<string, unknown>, "src", "url");
    }
  }

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

function extractMediaFromEdge(edge: unknown): RapidApiPost | null {
  if (!edge || typeof edge !== "object") return null;
  const node = (edge as Record<string, unknown>).node;
  if (!node || typeof node !== "object") return null;

  const nodeObj = node as Record<string, unknown>;
  const media = nodeObj.media;
  if (media && typeof media === "object") {
    return media as RapidApiPost;
  }

  return nodeObj;
}

function extractFromEdgesContainer(container: unknown): RapidApiPost[] {
  if (!container || typeof container !== "object" || Array.isArray(container)) {
    return [];
  }

  const edges = (container as Record<string, unknown>).edges;
  if (!Array.isArray(edges)) return [];

  return edges
    .map(extractMediaFromEdge)
    .filter((item): item is RapidApiPost => item !== null);
}

function extractPostsFromResponse(data: unknown): RapidApiPost[] {
  if (Array.isArray(data)) {
    return data.filter(
      (item): item is RapidApiPost => !!item && typeof item === "object",
    );
  }

  if (!data || typeof data !== "object") return [];

  const record = data as Record<string, unknown>;
  const directArrays = [record.items, record.posts, record.reels];
  for (const candidate of directArrays) {
    if (Array.isArray(candidate)) {
      return candidate.filter(
        (item): item is RapidApiPost => !!item && typeof item === "object",
      );
    }
  }

  // instagram120 GraphQL shape: { result: { edges: [{ node: { media: {...} } }] } }
  for (const source of [record.result, record.data, record]) {
    const fromEdges = extractFromEdgesContainer(source);
    if (fromEdges.length > 0) return fromEdges;

    if (source && typeof source === "object" && !Array.isArray(source)) {
      const nested = source as Record<string, unknown>;
      for (const key of ["items", "posts", "reels"] as const) {
        if (Array.isArray(nested[key])) {
          return nested[key].filter(
            (item): item is RapidApiPost => !!item && typeof item === "object",
          );
        }
      }
    }
  }

  return [];
}

function mapRapidApiPost(
  post: RapidApiPost,
  options: { fromReelsEndpoint?: boolean } = {},
): ParsedReel | null {
  if (!options.fromReelsEndpoint && !isReelPost(post)) return null;

  const shortcode = extractShortcode(post);
  const instagramMediaId = extractMediaId(post) ?? shortcode;
  if (!instagramMediaId || !shortcode) return null;

  return {
    instagramMediaId,
    embedUrl: reelEmbedUrl(shortcode),
    thumbnailUrl: extractThumbnail(post),
  };
}

function describeUnmappedPost(post: RapidApiPost): Record<string, unknown> {
  return {
    keys: Object.keys(post),
    shortcode: extractShortcode(post),
    mediaId: extractMediaId(post),
    isReel: isReelPost(post),
  };
}

function extractNextMaxId(
  data: unknown,
  posts: RapidApiPost[],
): string | undefined {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    const last = posts[posts.length - 1];
    return last ? readString(last, "id", "pk") : undefined;
  }

  const record = data as Record<string, unknown>;
  const fromRoot = readString(
    record,
    "next_max_id",
    "nextMaxId",
    "maxId",
    "next_maxId",
    "end_cursor",
    "endCursor",
  );
  if (fromRoot) return fromRoot;

  for (const container of [record.result, record.data, record]) {
    if (!container || typeof container !== "object" || Array.isArray(container)) {
      continue;
    }
    const nested = container as Record<string, unknown>;

    const fromNested = readString(
      nested,
      "next_max_id",
      "nextMaxId",
      "maxId",
      "end_cursor",
      "endCursor",
    );
    if (fromNested) return fromNested;

    const pageInfo = nested.page_info;
    if (pageInfo && typeof pageInfo === "object") {
      const cursor = readString(
        pageInfo as Record<string, unknown>,
        "end_cursor",
        "endCursor",
      );
      if (cursor) return cursor;
    }
  }

  const last = posts[posts.length - 1];
  if (last) {
    return readString(last, "id", "pk");
  }

  return undefined;
}

async function fetchRapidApiReelsPage(
  apiKey: string,
  username: string,
  maxId: string,
  pageNumber: number,
): Promise<{ posts: RapidApiPost[]; nextMaxId?: string; raw: unknown }> {
  const normalizedUsername = normalizeUsername(username);
  logInstagramSync("fetching page", {
    endpoint: RAPIDAPI_REELS_URL,
    username: normalizedUsername,
    maxId: maxId || "(empty)",
    pageNumber,
  });

  const response = await fetch(RAPIDAPI_REELS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key": apiKey,
    },
    body: JSON.stringify({
      username: normalizedUsername,
      maxId,
    }),
  });

  const bodyText = await response.text();

  if (!response.ok) {
    logInstagramSync("RapidAPI error response", {
      status: response.status,
      bodyPreview: bodyText.slice(0, 500),
    });
    throw new Error(
      `RapidAPI returned ${response.status}: ${bodyText.slice(0, 300)}`,
    );
  }

  let raw: unknown;
  try {
    raw = JSON.parse(bodyText) as unknown;
  } catch {
    logInstagramSync("RapidAPI returned non-JSON body", {
      bodyPreview: bodyText.slice(0, 500),
    });
    throw new Error("RapidAPI returned a non-JSON response.");
  }

  const posts = extractPostsFromResponse(raw);
  const nextMaxId = extractNextMaxId(raw, posts);

  logInstagramSync("page parsed", {
    pageNumber,
    responseShape: describeValueShape(raw),
    itemCount: posts.length,
    nextMaxId: nextMaxId ?? null,
    firstItem: posts[0] ? describeUnmappedPost(posts[0]) : null,
  });

  if (posts.length === 0) {
    logInstagramSync("no items in response — check response shape", {
      bodyPreview: bodyText.slice(0, 800),
    });
  }

  return { posts, nextMaxId, raw };
}

async function fetchReelsFromRapidApi(username: string, apiKey: string) {
  const reels: ParsedReel[] = [];
  const seen = new Set<string>();
  let maxId = "";
  let pagesFetched = 0;
  let totalRawItems = 0;
  let totalSkippedUnmapped = 0;
  const maxPages = 5;

  logInstagramSync("starting fetch", {
    username: normalizeUsername(username),
    reelLimit: SYNC_REEL_LIMIT,
    hasApiKey: Boolean(apiKey),
  });

  while (reels.length < SYNC_REEL_LIMIT && pagesFetched < maxPages) {
    const page = await fetchRapidApiReelsPage(
      apiKey,
      username,
      maxId,
      pagesFetched + 1,
    );
    pagesFetched += 1;
    totalRawItems += page.posts.length;

    for (const post of page.posts) {
      const mapped = mapRapidApiPost(post, { fromReelsEndpoint: true });
      if (!mapped) {
        totalSkippedUnmapped += 1;
        if (totalSkippedUnmapped <= 3) {
          logInstagramSync("skipped unmapped item", describeUnmappedPost(post));
        }
        continue;
      }
      if (seen.has(mapped.instagramMediaId)) continue;
      seen.add(mapped.instagramMediaId);
      reels.push(mapped);
      if (reels.length >= SYNC_REEL_LIMIT) break;
    }

    if (reels.length >= SYNC_REEL_LIMIT || !page.nextMaxId || page.posts.length === 0) {
      break;
    }
    maxId = page.nextMaxId;
  }

  logInstagramSync("fetch complete", {
    pagesFetched,
    totalRawItems,
    totalSkippedUnmapped,
    reelsMapped: reels.length,
    sampleEmbedUrls: reels.slice(0, 3).map((r) => r.embedUrl),
  });

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
  logInstagramSync("sync started");

  let apiKey: string;
  try {
    apiKey = getRapidApiKey();
  } catch (error) {
    logInstagramSync("missing API key", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  const settings = await ctx.runQuery(internal.instagramPosts.getInstagramUsername);
  const username = settings?.instagramUsername?.trim();
  if (!username) {
    logInstagramSync("skipped — no username in site settings");
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

  logInstagramSync("syncing for username", { username });

  const { reels, pagesFetched } = await fetchReelsFromRapidApi(username, apiKey);

  const result = await ctx.runMutation(
    internal.instagramPosts.upsertInstagramPosts,
    { posts: reels },
  );

  logInstagramSync("sync finished", {
    username,
    fetched: reels.length,
    pagesFetched,
    imported: result.imported,
    updated: result.updated,
    pruned: result.pruned,
  });

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
