import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  query,
  mutation,
  internalMutation,
  type QueryCtx,
} from "./_generated/server";

// ─── Auth helper ────────────────────────────────────────────────────────
async function requireAuth(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC: Log an event hit (called via HTTP endpoint, no auth)
// ═══════════════════════════════════════════════════════════════════════
export const logHit = internalMutation({
  args: {
    eventName: v.string(),
    category: v.string(),
    label: v.string(),
    targetElement: v.string(),
    timestamp: v.number(),
    url: v.string(),
    userAgent: v.string(),
    sessionId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("eventLogs", args);
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ADMIN: Query event logs (requires auth)
// ═══════════════════════════════════════════════════════════════════════

/** Get all event logs within a time range */
export const getByTimeRange = query({
  args: {
    startTime: v.number(), // epoch ms
    endTime: v.number(), // epoch ms
  },
  returns: v.array(
    v.object({
      _id: v.id("eventLogs"),
      _creationTime: v.number(),
      eventName: v.string(),
      category: v.string(),
      label: v.string(),
      targetElement: v.string(),
      timestamp: v.number(),
      url: v.string(),
      userAgent: v.string(),
      sessionId: v.string(),
    }),
  ),
  handler: async (ctx, { startTime, endTime }) => {
    await requireAuth(ctx);
    return await ctx.db
      .query("eventLogs")
      .withIndex("by_timestamp", (q) =>
        q.gte("timestamp", startTime).lte("timestamp", endTime),
      )
      .collect();
  },
});

/** Get summary stats for a time range */
export const getSummary = query({
  args: {
    startTime: v.number(),
    endTime: v.number(),
  },
  returns: v.object({
    totalHits: v.number(),
    uniqueSessions: v.number(),
    eventBreakdown: v.array(
      v.object({
        eventName: v.string(),
        label: v.string(),
        category: v.string(),
        count: v.number(),
      }),
    ),
    categoryBreakdown: v.array(
      v.object({
        category: v.string(),
        count: v.number(),
      }),
    ),
  }),
  handler: async (ctx, { startTime, endTime }) => {
    await requireAuth(ctx);

    const logs = await ctx.db
      .query("eventLogs")
      .withIndex("by_timestamp", (q) =>
        q.gte("timestamp", startTime).lte("timestamp", endTime),
      )
      .collect();

    // Total hits
    const totalHits = logs.length;

    // Unique sessions
    const sessionSet = new Set(logs.map((l) => l.sessionId));
    const uniqueSessions = sessionSet.size;

    // Event breakdown
    const eventMap = new Map<
      string,
      { label: string; category: string; count: number }
    >();
    for (const log of logs) {
      const existing = eventMap.get(log.eventName);
      if (existing) {
        existing.count++;
      } else {
        eventMap.set(log.eventName, {
          label: log.label,
          category: log.category,
          count: 1,
        });
      }
    }
    const eventBreakdown = Array.from(eventMap.entries())
      .map(([eventName, data]) => ({ eventName, ...data }))
      .sort((a, b) => b.count - a.count);

    // Category breakdown
    const catMap = new Map<string, number>();
    for (const log of logs) {
      catMap.set(log.category, (catMap.get(log.category) ?? 0) + 1);
    }
    const categoryBreakdown = Array.from(catMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return { totalHits, uniqueSessions, eventBreakdown, categoryBreakdown };
  },
});

/** Get time-series data for charts (bucketed by day or hour) */
export const getTimeSeries = query({
  args: {
    startTime: v.number(),
    endTime: v.number(),
    bucketSize: v.union(v.literal("hour"), v.literal("day")),
    eventName: v.optional(v.string()), // filter by specific event
  },
  returns: v.array(
    v.object({
      bucket: v.number(), // start of bucket (epoch ms)
      count: v.number(),
    }),
  ),
  handler: async (ctx, { startTime, endTime, bucketSize, eventName }) => {
    await requireAuth(ctx);

    let logs;
    if (eventName) {
      logs = await ctx.db
        .query("eventLogs")
        .withIndex("by_event_name", (q) =>
          q
            .eq("eventName", eventName)
            .gte("timestamp", startTime)
            .lte("timestamp", endTime),
        )
        .collect();
    } else {
      logs = await ctx.db
        .query("eventLogs")
        .withIndex("by_timestamp", (q) =>
          q.gte("timestamp", startTime).lte("timestamp", endTime),
        )
        .collect();
    }

    const bucketMs = bucketSize === "hour" ? 3_600_000 : 86_400_000;
    const bucketMap = new Map<number, number>();

    // Initialize all buckets in range
    const firstBucket = Math.floor(startTime / bucketMs) * bucketMs;
    for (let b = firstBucket; b <= endTime; b += bucketMs) {
      bucketMap.set(b, 0);
    }

    // Fill counts
    for (const log of logs) {
      const b = Math.floor(log.timestamp / bucketMs) * bucketMs;
      bucketMap.set(b, (bucketMap.get(b) ?? 0) + 1);
    }

    return Array.from(bucketMap.entries())
      .map(([bucket, count]) => ({ bucket, count }))
      .sort((a, b) => a.bucket - b.bucket);
  },
});

/** Delete old logs (cleanup utility) */
export const deleteOlderThan = mutation({
  args: { beforeTimestamp: v.number() },
  returns: v.number(),
  handler: async (ctx, { beforeTimestamp }) => {
    await requireAuth(ctx);
    const old = await ctx.db
      .query("eventLogs")
      .withIndex("by_timestamp", (q) => q.lte("timestamp", beforeTimestamp))
      .collect();

    for (const doc of old) {
      await ctx.db.delete(doc._id);
    }
    return old.length;
  },
});
