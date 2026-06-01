import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";

type GooglePlacesReview = {
  name?: string;
  rating?: number;
  text?: { text?: string };
  publishTime?: string;
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

type GooglePlacesResponse = {
  reviews?: GooglePlacesReview[];
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

function mapGoogleReview(review: GooglePlacesReview) {
  const googleReviewId = review.name?.trim();
  if (!googleReviewId) return null;

  const text = review.text?.text?.trim() ?? "";
  const author =
    review.authorAttribution?.displayName?.trim() || "Google user";
  const date =
    review.publishTime?.trim() ||
    review.relativePublishTimeDescription?.trim() ||
    "";
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
    profilePhotoUrl: review.authorAttribution?.photoUri,
    authorUri: review.authorAttribution?.uri,
  };
}

async function fetchPlaceReviews(placeId: string, apiKey: string) {
  const normalizedId = normalizePlaceId(placeId);
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(normalizedId)}`;
  const response = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "reviews",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Google Places API returned ${response.status}: ${body.slice(0, 300)}`,
    );
  }

  return (await response.json()) as GooglePlacesResponse;
}

/** Pull the latest Google reviews into the CMS (max 5 per Places API). */
export const syncFromGoogle = action({
  args: {},
  returns: v.object({
    imported: v.number(),
    updated: v.number(),
    fetched: v.number(),
  }),
  handler: async (ctx) => {
    await ctx.runQuery(internal.googleReviews.requireAdmin);

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GOOGLE_PLACES_API_KEY is not set in the Convex dashboard environment.",
      );
    }

    const settings = await ctx.runQuery(internal.googleReviews.getPlaceId);
    if (!settings?.googlePlaceId?.trim()) {
      throw new Error(
        "Add your Google Place ID in Admin → Reviews before syncing.",
      );
    }

    const payload = await fetchPlaceReviews(settings.googlePlaceId, apiKey);
    const mapped = (payload.reviews ?? [])
      .map(mapGoogleReview)
      .filter((r): r is NonNullable<typeof r> => r !== null);

    const result = await ctx.runMutation(
      internal.googleReviews.upsertGoogleReviews,
      { reviews: mapped },
    );

    return {
      ...result,
      fetched: mapped.length,
    };
  },
});
