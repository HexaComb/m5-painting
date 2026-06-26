import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  // Site-wide settings (single document)
  siteSettings: defineTable({
    businessName: v.string(),
    tagline: v.string(),
    phone: v.string(),
    email: v.string(),
    address: v.string(),
    metaDescription: v.string(),
    googlePlaceId: v.optional(v.string()),
    instagramUsername: v.optional(v.string()),
  }),

  // Hero section (single document)
  heroContent: defineTable({
    headline: v.string(),
    highlightText: v.string(),
    bodyText: v.string(),
    ctaText: v.string(),
    ctaPhone: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
    imageAlt: v.optional(v.string()),
    /** Legacy field; stripped via content.stripHeroBadgeText after deploy. */
    badgeText: v.optional(v.string()),
  }),

  // Services (multiple items)
  services: defineTable({
    order: v.number(),
    iconName: v.string(),
    title: v.string(),
    description: v.string(),
    items: v.array(v.string()),
  }).index("by_order", ["order"]),

  // About section (single document)
  aboutContent: defineTable({
    subtitle: v.string(),
    title: v.string(),
    paragraphs: v.array(v.string()),
    /** @deprecated Use aboutImages table instead */
    imageStorageId: v.optional(v.id("_storage")),
    /** @deprecated Use aboutImages table instead */
    imageAlt: v.optional(v.string()),
  }),

  // About section carousel images (multiple items)
  aboutImages: defineTable({
    order: v.number(),
    storageId: v.id("_storage"),
    alt: v.string(),
  }).index("by_order", ["order"]),

  // About values (multiple items)
  aboutValues: defineTable({
    order: v.number(),
    iconName: v.string(),
    title: v.string(),
    description: v.string(),
  }).index("by_order", ["order"]),

  // Instagram posts for Projects section (multiple items)
  instagramPosts: defineTable({
    order: v.number(),
    embedUrl: v.string(),
    enabled: v.optional(v.boolean()),
    instagramMediaId: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
  })
    .index("by_order", ["order"])
    .index("by_instagram_media_id", ["instagramMediaId"]),

  // Customer reviews (multiple items)
  reviews: defineTable({
    order: v.number(),
    text: v.string(),
    author: v.string(),
    date: v.string(),
    source: v.string(),
    enabled: v.optional(v.boolean()),
    rating: v.optional(v.number()),
    googleReviewId: v.optional(v.string()),
    profilePhotoUrl: v.optional(v.string()),
    authorUri: v.optional(v.string()),
  })
    .index("by_order", ["order"])
    .index("by_google_review_id", ["googleReviewId"]),

  // Trust credentials / certifications (multiple items)
  certifications: defineTable({
    order: v.number(),
    label: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    /** Static asset path, e.g. /images/lbi-badge.webp */
    imagePath: v.optional(v.string()),
    showInHero: v.boolean(),
    showInFooter: v.boolean(),
    enabled: v.optional(v.boolean()),
  }).index("by_order", ["order"]),

  // Contact section (single document)
  contactContent: defineTable({
    subtitle: v.string(),
    title: v.string(),
    description: v.string(),
    phone: v.string(),
    email: v.string(),
    location: v.string(),
  }),

  // Contact form submissions / leads
  leads: defineTable({
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.string(),
    interest: v.string(),
    message: v.string(),
    createdAt: v.number(),
    read: v.boolean(),
  }).index("by_createdAt", ["createdAt"]),

  // Event tracking configurations
  trackingEvents: defineTable({
    name: v.string(), // e.g. "hero_estimate_click"
    category: v.string(), // e.g. "engagement", "conversion", "navigation"
    label: v.string(), // human-readable label shown in CMS
    targetElement: v.string(), // data-track ID, e.g. "hero-estimate"
    trigger: v.union(
      v.literal("click"),
      v.literal("form_submit"),
    ),
    enabled: v.boolean(),
  }).index("by_enabled", ["enabled"]),

  // Event hit logs — one row per fired event
  eventLogs: defineTable({
    eventName: v.string(), // matches trackingEvents.name
    category: v.string(),
    label: v.string(),
    targetElement: v.string(),
    timestamp: v.number(), // epoch ms
    url: v.string(), // page URL where the event fired
    userAgent: v.string(), // browser user-agent
    sessionId: v.string(), // random ID to group hits per visit
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_event_name", ["eventName", "timestamp"])
    .index("by_category", ["category", "timestamp"]),
});

export default schema;
