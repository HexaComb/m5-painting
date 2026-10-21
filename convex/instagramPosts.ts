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

const SYNC_POST_LIMIT = 12;
const MAX_RUN_CHARGE_USD = 0.1;
const APIFY_URL =
  "https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items";

const upsertedPostValidator = v.object({
  instagramMediaId: v.string(),
  embedUrl: v.string(),
  postedAt: v.number(),
});

type ImportedPost = {
  instagramMediaId: string;
  embedUrl: string;
  postedAt: number;
};

function normalizeUsername(username: string): string {
  return username.trim().replace(/^@/, "").toLowerCase();
}

function getApifyToken(): string {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) {
    throw new Error("APIFY_API_TOKEN is not set in Convex environment variables.");
  }
  return token;
}

function parseApifyPost(value: unknown, username: string): ImportedPost | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  const post = value as Record<string, unknown>;
  if (
    typeof post.ownerUsername !== "string" ||
    post.ownerUsername.toLowerCase() !== username ||
    typeof post.url !== "string" ||
    typeof post.timestamp !== "string"
  ) {
    return null;
  }
  const match = post.url.match(
    /^https:\/\/(?:www\.)?instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)\/?/,
  );
  if (!match) return null;
  const postedAt = Date.parse(post.timestamp);
  if (!Number.isFinite(postedAt)) return null;
  return {
    instagramMediaId: match[2],
    embedUrl: `https://www.instagram.com/${match[1]}/${match[2]}/`,
    postedAt,
  };
}

async function fetchPublicPosts(username: string, token: string) {
  const url = new URL(APIFY_URL);
  url.searchParams.set("maxItems", String(SYNC_POST_LIMIT));
  url.searchParams.set("maxTotalChargeUsd", String(MAX_RUN_CHARGE_USD));
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      directUrls: [`https://www.instagram.com/${username}/`],
      resultsType: "posts",
      resultsLimit: SYNC_POST_LIMIT,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Apify returned ${response.status}: ${body.slice(0, 300)}`);
  }
  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Apify returned an unexpected response.");
  }
  const seen = new Set<string>();
  const posts = data
    .map((item) => parseApifyPost(item, username))
    .filter((post): post is ImportedPost => {
      if (!post || seen.has(post.instagramMediaId)) return false;
      seen.add(post.instagramMediaId);
      return true;
    })
    .sort((a, b) => b.postedAt - a.postedAt)
    .slice(0, SYNC_POST_LIMIT);
  if (posts.length === 0) {
    throw new Error("Apify returned no valid public posts for this account.");
  }
  return posts;
}

export const getInstagramUsername = internalQuery({
  args: {},
  returns: v.union(
    v.object({ instagramUsername: v.optional(v.string()) }),
    v.null(),
  ),
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").first();
    return settings ? { instagramUsername: settings.instagramUsername } : null;
  },
});

export const upsertInstagramPosts = internalMutation({
  args: { posts: v.array(upsertedPostValidator) },
  returns: v.object({
    imported: v.number(),
    updated: v.number(),
    pruned: v.number(),
  }),
  handler: async (ctx, { posts: incoming }) => {
    const existing = await ctx.db.query("instagramPosts").take(500);
    let nextOrder = existing.reduce((max, p) => Math.max(max, p.order), 0);
    let imported = 0;
    let updated = 0;
    const keepIds = new Set(incoming.map((p) => p.instagramMediaId));

    for (const post of incoming) {
      const match = existing.find(
        (row) =>
          row.instagramMediaId === post.instagramMediaId ||
          row.embedUrl.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/)?.[1] ===
            post.instagramMediaId,
      );
      if (match) {
        await ctx.db.patch(match._id, {
          embedUrl: post.embedUrl,
          instagramMediaId: post.instagramMediaId,
          postedAt: post.postedAt,
          enabled: match.hiddenByAdmin === true ? false : true,
        });
        updated += 1;
      } else {
        nextOrder += 1;
        await ctx.db.insert("instagramPosts", {
          order: nextOrder,
          embedUrl: post.embedUrl,
          instagramMediaId: post.instagramMediaId,
          postedAt: post.postedAt,
          enabled: true,
        });
        imported += 1;
      }
    }

    let pruned = 0;
    for (const row of existing) {
      if (!row.instagramMediaId || row.hiddenByAdmin) continue;
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
  const settings = await ctx.runQuery(internal.instagramPosts.getInstagramUsername);
  const username = normalizeUsername(settings?.instagramUsername ?? "");
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
  const posts = await fetchPublicPosts(username, getApifyToken());
  const result = await ctx.runMutation(
    internal.instagramPosts.upsertInstagramPosts,
    { posts },
  );
  return {
    ...result,
    fetched: posts.length,
    pagesFetched: 1,
    skipped: false,
  };
}

export const syncInstagramPosts = internalAction({
  args: {},
  returns: syncInstagramPostsReturns,
  handler: syncInstagramPostsHandler,
});

export const syncInstagramPostsNow = action({
  args: {},
  returns: syncInstagramPostsReturns,
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return syncInstagramPostsHandler(ctx);
  },
});
