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

const DEFAULT_TRACKING_EVENTS = [
  {
    name: "hero_estimate_click",
    category: "conversion",
    label: "Hero → Get a Free Estimate",
    targetElement: "hero-estimate",
    trigger: "click" as const,
    enabled: true,
  },
  {
    name: "hero_phone_click",
    category: "outbound",
    label: "Hero → Phone Button",
    targetElement: "hero-phone",
    trigger: "click" as const,
    enabled: true,
  },
  {
    name: "header_estimate_click",
    category: "conversion",
    label: "Header → Free Estimate",
    targetElement: "header-estimate",
    trigger: "click" as const,
    enabled: true,
  },
  {
    name: "header_phone_click",
    category: "outbound",
    label: "Header → Phone Button",
    targetElement: "header-phone",
    trigger: "click" as const,
    enabled: true,
  },
  {
    name: "projects_estimate_click",
    category: "conversion",
    label: "Projects → Get Your Free Estimate",
    targetElement: "projects-estimate",
    trigger: "click" as const,
    enabled: true,
  },
  {
    name: "contact_form_submit",
    category: "lead_generation",
    label: "Contact → Submit Form",
    targetElement: "contact-submit",
    trigger: "form_submit" as const,
    enabled: true,
  },
  {
    name: "nav_services_click",
    category: "navigation",
    label: "Nav → Services",
    targetElement: "nav-services",
    trigger: "click" as const,
    enabled: true,
  },
  {
    name: "nav_work_click",
    category: "navigation",
    label: "Nav → Our Work",
    targetElement: "nav-work",
    trigger: "click" as const,
    enabled: true,
  },
  {
    name: "nav_about_click",
    category: "navigation",
    label: "Nav → About",
    targetElement: "nav-about",
    trigger: "click" as const,
    enabled: true,
  },
  {
    name: "nav_reviews_click",
    category: "navigation",
    label: "Nav → Reviews",
    targetElement: "nav-reviews",
    trigger: "click" as const,
    enabled: true,
  },
];

/** Seed default tracking events when the table is empty. */
export const seedDefaults = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const existing = await ctx.db.query("trackingEvents").first();
    if (existing) return 0;

    for (const event of DEFAULT_TRACKING_EVENTS) {
      await ctx.db.insert("trackingEvents", event);
    }

    return DEFAULT_TRACKING_EVENTS.length;
  },
});

// ═══════════════════════════════════════════════════════════════════════
// TRACKING EVENTS
// ═══════════════════════════════════════════════════════════════════════

/** All tracking events (admin — requires auth) */
export const getAll = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("trackingEvents"),
      _creationTime: v.number(),
      name: v.string(),
      category: v.string(),
      label: v.string(),
      targetElement: v.string(),
      trigger: v.union(v.literal("click"), v.literal("form_submit")),
      enabled: v.boolean(),
    }),
  ),
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.db.query("trackingEvents").collect();
  },
});

/** Active events only (public — used by tracker script) */
export const getActive = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("trackingEvents"),
      _creationTime: v.number(),
      name: v.string(),
      category: v.string(),
      label: v.string(),
      targetElement: v.string(),
      trigger: v.union(v.literal("click"), v.literal("form_submit")),
      enabled: v.boolean(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db
      .query("trackingEvents")
      .withIndex("by_enabled", (q) => q.eq("enabled", true))
      .collect();
  },
});

/** Create a new tracking event */
export const add = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    label: v.string(),
    targetElement: v.string(),
    trigger: v.union(v.literal("click"), v.literal("form_submit")),
    enabled: v.boolean(),
  },
  returns: v.id("trackingEvents"),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.insert("trackingEvents", args);
  },
});

/** Update an existing tracking event */
export const update = mutation({
  args: {
    id: v.id("trackingEvents"),
    name: v.string(),
    category: v.string(),
    label: v.string(),
    targetElement: v.string(),
    trigger: v.union(v.literal("click"), v.literal("form_submit")),
    enabled: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return null;
  },
});

/** Delete a tracking event */
export const remove = mutation({
  args: { id: v.id("trackingEvents") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.db.delete(args.id);
    return null;
  },
});

/** Toggle an event's enabled state */
export const toggleEnabled = mutation({
  args: { id: v.id("trackingEvents") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const event = await ctx.db.get(args.id);
    if (!event) throw new Error("Event not found");
    await ctx.db.patch(args.id, { enabled: !event.enabled });
    return null;
  },
});
