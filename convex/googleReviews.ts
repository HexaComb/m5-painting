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
import { isReviewEnabled } from "./reviewTypes";

type SerpApiReview = {
  review_id?: string;
  rating?: number;
  snippet?: string;
  extracted_snippet?: { original?: string };
  iso_date?: string;
  date?: string;
  link?: string;
  user?: {
    name?: string;
    link?: string;
    thumbnail?: string;
  };
};

type SerpApiReviewsResponse = {
  search_metadata?: { status?: string };
  error?: string;
  reviews?: SerpApiReview[];
  serpapi_pagination?: {
    next_page_token?: string;
  };
};

const upsertedReviewValidator = v.object({
  googleReviewId: v.string(),
  text: v.string(),
  author: v.string(),
  date: v.string(),
  rating: v.number(),
  profilePhotoUrl: v.optional(v.string()),
  authorUri: v.optional(v.string()),
});

/** How many recent Google reviews to import per sync. */
const SYNC_REVIEW_LIMIT = 10;

function getSerpApiKey(): string {
  const key = process.env.SERP_API_KEY ?? process.env.SERPAPI_API_KEY;
  if (!key) {
    throw new Error(
      "SERP_API_KEY is not set in the Convex dashboard environment variables.",
    );
  }
  return key;
}

export const getPlaceId = internalQuery({
  args: {},
  returns: v.union(
    v.object({
      googlePlaceId: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").first();
    if (!settings) return null;
    return { googlePlaceId: settings.googlePlaceId };
  },
});

export const upsertGoogleReviews = internalMutation({
  args: {
    reviews: v.array(upsertedReviewValidator),
  },
  returns: v.object({
    imported: v.number(),
    updated: v.number(),
    pruned: v.number(),
  }),
  handler: async (ctx, { reviews: incoming }) => {
    let imported = 0;
    let updated = 0;

    const existing = await ctx.db.query("reviews").collect();
    const maxOrder = existing.reduce((max, r) => Math.max(max, r.order), 0);
    let nextOrder = maxOrder;

    const keepIds = new Set(incoming.map((r) => r.googleReviewId));

    for (const review of incoming) {
      const match = await ctx.db
        .query("reviews")
        .withIndex("by_google_review_id", (q) =>
          q.eq("googleReviewId", review.googleReviewId),
        )
        .first();

      if (match) {
        await ctx.db.patch(match._id, {
          text: review.text,
          author: review.author,
          date: review.date,
          rating: review.rating,
          source: "Google",
          profilePhotoUrl: review.profilePhotoUrl,
          authorUri: review.authorUri,
        });
        updated += 1;
      } else {
        nextOrder += 1;
        await ctx.db.insert("reviews", {
          order: nextOrder,
          text: review.text,
          author: review.author,
          date: review.date,
          source: "Google",
          rating: review.rating,
          googleReviewId: review.googleReviewId,
          profilePhotoUrl: review.profilePhotoUrl,
          authorUri: review.authorUri,
          enabled: false,
        });
        imported += 1;
      }
    }

    let pruned = 0;
    for (const row of existing) {
      if (!row.googleReviewId) continue;
      if (isReviewEnabled(row.enabled)) continue;
      if (keepIds.has(row.googleReviewId)) continue;
      await ctx.db.delete(row._id);
      pruned += 1;
    }

    return { imported, updated, pruned };
  },
});

function normalizePlaceId(placeId: string): string {
  return placeId.trim().replace(/^places\//, "");
}

function mapSerpApiReview(review: SerpApiReview) {
  const googleReviewId = review.review_id?.trim();
  if (!googleReviewId) return null;

  const text =
    review.extracted_snippet?.original?.trim() ||
    review.snippet?.trim() ||
    "";
  const author = review.user?.name?.trim() || "Google user";
  const date = review.iso_date?.trim() || review.date?.trim() || "";
  const rating =
    typeof review.rating === "number"
      ? Math.min(5, Math.max(1, Math.round(review.rating)))
      : 5;

  if (!text) return null;

  return {
    googleReviewId,
    text,
    author,
    date,
    rating,
    profilePhotoUrl: review.user?.thumbnail,
    authorUri: review.user?.link ?? review.link,
  };
}

async function fetchSerpApiReviewsPage(
  apiKey: string,
  placeId: string,
  options: { nextPageToken?: string; num?: number },
): Promise<SerpApiReviewsResponse> {
  const params = new URLSearchParams({
    engine: "google_maps_reviews",
    place_id: normalizePlaceId(placeId),
    api_key: apiKey,
    hl: "en",
    sort_by: "newestFirst",
  });

  if (options.nextPageToken) {
    params.set("next_page_token", options.nextPageToken);
    params.set("num", String(Math.min(20, Math.max(1, options.num ?? 20))));
  }

  const url = `https://serpapi.com/search.json?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `SerpApi returned ${response.status}: ${body.slice(0, 300)}`,
    );
  }

  const data = (await response.json()) as SerpApiReviewsResponse;

  if (data.error) {
    throw new Error(`SerpApi error: ${data.error}`);
  }

  if (data.search_metadata?.status === "Error") {
    throw new Error("SerpApi search failed. Check your API key and Place ID.");
  }

  return data;
}

async function fetchNewestSerpApiReviews(placeId: string, apiKey: string) {
  const allReviews: SerpApiReview[] = [];
  let nextPageToken: string | undefined;
  let pagesFetched = 0;

  while (allReviews.length < SYNC_REVIEW_LIMIT) {
    const remaining = SYNC_REVIEW_LIMIT - allReviews.length;
    const page = await fetchSerpApiReviewsPage(apiKey, placeId, {
      nextPageToken,
      num: nextPageToken ? remaining : undefined,
    });
    allReviews.push(...(page.reviews ?? []));
    pagesFetched += 1;
    nextPageToken = page.serpapi_pagination?.next_page_token;
    if (!nextPageToken || allReviews.length >= SYNC_REVIEW_LIMIT) {
      break;
    }
  }

  return {
    reviews: allReviews.slice(0, SYNC_REVIEW_LIMIT),
    pagesFetched,
  };
}

const syncGoogleReviewsReturns = v.object({
  imported: v.number(),
  updated: v.number(),
  pruned: v.number(),
  fetched: v.number(),
  pagesFetched: v.number(),
  skipped: v.boolean(),
  skipReason: v.optional(v.string()),
});

type SyncGoogleReviewsResult = {
  imported: number;
  updated: number;
  pruned: number;
  fetched: number;
  pagesFetched: number;
  skipped: boolean;
  skipReason?: string;
};

async function syncGoogleReviewsHandler(
  ctx: ActionCtx,
): Promise<SyncGoogleReviewsResult> {
  const apiKey = getSerpApiKey();

  const settings = await ctx.runQuery(internal.googleReviews.getPlaceId);
  if (!settings?.googlePlaceId?.trim()) {
    return {
      imported: 0,
      updated: 0,
      pruned: 0,
      fetched: 0,
      pagesFetched: 0,
      skipped: true,
      skipReason: "Google Place ID is not set in site settings.",
    };
  }

  const { reviews, pagesFetched } = await fetchNewestSerpApiReviews(
    settings.googlePlaceId,
    apiKey,
  );

  const seen = new Set<string>();
  const mapped = reviews
    .map(mapSerpApiReview)
    .filter((r): r is NonNullable<typeof r> => {
      if (r === null || seen.has(r.googleReviewId)) return false;
      seen.add(r.googleReviewId);
      return true;
    });

  const result = await ctx.runMutation(
    internal.googleReviews.upsertGoogleReviews,
    { reviews: mapped },
  );

  return {
    ...result,
    fetched: mapped.length,
    pagesFetched,
    skipped: false,
  };
}

/** Scheduled SerpApi pull (every 10 days via crons.ts). */
export const syncGoogleReviews = internalAction({
  args: {},
  returns: syncGoogleReviewsReturns,
  handler: syncGoogleReviewsHandler,
});

/** Admin-triggered SerpApi pull (Admin → Settings). */
export const syncGoogleReviewsNow = action({
  args: {},
  returns: syncGoogleReviewsReturns,
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return syncGoogleReviewsHandler(ctx);
  },
});
