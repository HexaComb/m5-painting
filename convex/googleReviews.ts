import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";

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

export const requireAdmin = internalQuery({
  args: {},
  returns: v.id("users"),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return userId;
  },
});

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
  }),
  handler: async (ctx, { reviews: incoming }) => {
    let imported = 0;
    let updated = 0;

    const existing = await ctx.db.query("reviews").collect();
    const maxOrder = existing.reduce((max, r) => Math.max(max, r.order), 0);
    let nextOrder = maxOrder;

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

    return { imported, updated };
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

/** Pull the 10 newest Google reviews via SerpApi into the CMS for admin curation. */
export const syncFromGoogle = action({
  args: {},
  returns: v.object({
    imported: v.number(),
    updated: v.number(),
    fetched: v.number(),
    pagesFetched: v.number(),
  }),
  handler: async (ctx) => {
    await ctx.runQuery(internal.googleReviews.requireAdmin);

    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "SERPAPI_API_KEY is not set in the Convex dashboard environment.",
      );
    }

    const settings = await ctx.runQuery(internal.googleReviews.getPlaceId);
    if (!settings?.googlePlaceId?.trim()) {
      throw new Error(
        "Add your Google Place ID in Admin → Reviews before syncing.",
      );
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
    };
  },
});
