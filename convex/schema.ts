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
  }),

  // Hero section (single document)
  heroContent: defineTable({
    badgeText: v.string(),
    headline: v.string(),
    highlightText: v.string(),
    bodyText: v.string(),
    ctaText: v.string(),
    ctaPhone: v.string(),
  }),

  // Services (multiple items)
  services: defineTable({
    order: v.number(),
    iconName: v.string(),
    title: v.string(),
    description: v.string(),
    items: v.array(v.string()),
  }).index("by_order", ["order"]),

  // Project gallery (multiple items)
  projects: defineTable({
    order: v.number(),
    imageUrl: v.string(),
    altText: v.string(),
    label: v.string(),
    span: v.union(v.literal("large"), v.literal("small")),
  }).index("by_order", ["order"]),

  // About section (single document)
  aboutContent: defineTable({
    subtitle: v.string(),
    title: v.string(),
    paragraphs: v.array(v.string()),
  }),

  // About values (multiple items)
  aboutValues: defineTable({
    order: v.number(),
    iconName: v.string(),
    title: v.string(),
    description: v.string(),
  }).index("by_order", ["order"]),

  // Customer reviews (multiple items)
  reviews: defineTable({
    order: v.number(),
    text: v.string(),
    author: v.string(),
    date: v.string(),
    source: v.string(),
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
});

export default schema;
