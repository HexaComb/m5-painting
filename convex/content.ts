import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  query,
  mutation,
  internalMutation,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import {
  isReviewEnabled,
  reviewRating,
  reviewValidator,
  selectHomepageReviews,
} from "./reviewTypes";

// ─── Auth helper ────────────────────────────────────────────────────────
async function requireAuth(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

/** Keep hero CTA phone and contact section in sync with site settings. */
async function syncContactFieldsFromSiteSettings(
  ctx: MutationCtx,
  fields: { phone: string; email: string; address: string },
) {
  const hero = await ctx.db.query("heroContent").first();
  if (hero) {
    await ctx.db.patch(hero._id, { ctaPhone: fields.phone });
  }
  const contact = await ctx.db.query("contactContent").first();
  if (contact) {
    await ctx.db.patch(contact._id, {
      phone: fields.phone,
      email: fields.email,
      location: fields.address,
    });
  }
}

function normalizeInstagramEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/i,
  );
  if (!match) return null;
  const [, type, shortcode] = match;
  return `https://www.instagram.com/${type}/${shortcode}/`;
}

const instagramPostValidator = v.object({
  _id: v.id("instagramPosts"),
  _creationTime: v.number(),
  order: v.number(),
  embedUrl: v.string(),
});

// ═══════════════════════════════════════════════════════════════════════
// SITE SETTINGS
// ═══════════════════════════════════════════════════════════════════════

export const getSiteSettings = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("siteSettings"),
      _creationTime: v.number(),
      businessName: v.string(),
      tagline: v.string(),
      phone: v.string(),
      email: v.string(),
      address: v.string(),
      metaDescription: v.string(),
      googlePlaceId: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("siteSettings").first();
  },
});

export const updateSiteSettings = mutation({
  args: {
    businessName: v.string(),
    tagline: v.string(),
    phone: v.string(),
    email: v.string(),
    address: v.string(),
    metaDescription: v.string(),
    googlePlaceId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const { googlePlaceId, ...rest } = args;
    const placeIdPatch =
      googlePlaceId === undefined
        ? {}
        : {
            googlePlaceId:
              googlePlaceId.trim().length > 0 ? googlePlaceId.trim() : undefined,
          };
    const existing = await ctx.db.query("siteSettings").first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...rest, ...placeIdPatch });
    } else {
      await ctx.db.insert("siteSettings", { ...rest, ...placeIdPatch });
    }
    await syncContactFieldsFromSiteSettings(ctx, {
      phone: args.phone,
      email: args.email,
      address: args.address,
    });
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════
// HERO CONTENT
// ═══════════════════════════════════════════════════════════════════════

export const getHeroContent = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("heroContent"),
      _creationTime: v.number(),
      headline: v.string(),
      highlightText: v.string(),
      bodyText: v.string(),
      ctaText: v.string(),
      ctaPhone: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const hero = await ctx.db.query("heroContent").first();
    if (!hero) return null;
    return {
      _id: hero._id,
      _creationTime: hero._creationTime,
      headline: hero.headline,
      highlightText: hero.highlightText,
      bodyText: hero.bodyText,
      ctaText: hero.ctaText,
      ctaPhone: hero.ctaPhone,
    };
  },
});

export const updateHeroContent = mutation({
  args: {
    headline: v.string(),
    highlightText: v.string(),
    bodyText: v.string(),
    ctaText: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const settings = await ctx.db.query("siteSettings").first();
    const data = { ...args, ctaPhone: settings?.phone ?? "" };
    const existing = await ctx.db.query("heroContent").first();
    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("heroContent", data);
    }
    return null;
  },
});

/** One-time: remove legacy badgeText from heroContent (dev + prod). */
export const stripHeroBadgeText = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const rows = await ctx.db.query("heroContent").collect();
    let updated = 0;
    for (const hero of rows) {
      if (!("badgeText" in hero)) continue;
      await ctx.db.replace(hero._id, {
        headline: hero.headline,
        highlightText: hero.highlightText,
        bodyText: hero.bodyText,
        ctaText: hero.ctaText,
        ctaPhone: hero.ctaPhone,
      });
      updated += 1;
    }
    return updated;
  },
});

// ═══════════════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════════════

export const getServices = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("services"),
      _creationTime: v.number(),
      order: v.number(),
      iconName: v.string(),
      title: v.string(),
      description: v.string(),
      items: v.array(v.string()),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("services").withIndex("by_order").collect();
  },
});

export const updateService = mutation({
  args: {
    id: v.id("services"),
    iconName: v.string(),
    title: v.string(),
    description: v.string(),
    items: v.array(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { id, ...data }) => {
    await requireAuth(ctx);
    await ctx.db.patch(id, data);
    return null;
  },
});

export const addService = mutation({
  args: {
    iconName: v.string(),
    title: v.string(),
    description: v.string(),
    items: v.array(v.string()),
  },
  returns: v.id("services"),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("services").collect();
    const maxOrder = existing.reduce((max, s) => Math.max(max, s.order), 0);
    return await ctx.db.insert("services", { ...args, order: maxOrder + 1 });
  },
});

export const deleteService = mutation({
  args: { id: v.id("services") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAuth(ctx);
    await ctx.db.delete(id);
    return null;
  },
});

export const reorderServices = mutation({
  args: {
    orderedIds: v.array(v.id("services")),
  },
  returns: v.null(),
  handler: async (ctx, { orderedIds }) => {
    await requireAuth(ctx);
    for (let i = 0; i < orderedIds.length; i++) {
      await ctx.db.patch(orderedIds[i], { order: i + 1 });
    }
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ABOUT CONTENT
// ═══════════════════════════════════════════════════════════════════════

export const getAboutContent = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("aboutContent"),
      _creationTime: v.number(),
      subtitle: v.string(),
      title: v.string(),
      paragraphs: v.array(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("aboutContent").first();
  },
});

export const updateAboutContent = mutation({
  args: {
    subtitle: v.string(),
    title: v.string(),
    paragraphs: v.array(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("aboutContent").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("aboutContent", args);
    }
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ABOUT VALUES
// ═══════════════════════════════════════════════════════════════════════

export const getAboutValues = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("aboutValues"),
      _creationTime: v.number(),
      order: v.number(),
      iconName: v.string(),
      title: v.string(),
      description: v.string(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("aboutValues").withIndex("by_order").collect();
  },
});

export const updateAboutValue = mutation({
  args: {
    id: v.id("aboutValues"),
    iconName: v.string(),
    title: v.string(),
    description: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { id, ...data }) => {
    await requireAuth(ctx);
    await ctx.db.patch(id, data);
    return null;
  },
});

export const addAboutValue = mutation({
  args: {
    iconName: v.string(),
    title: v.string(),
    description: v.string(),
  },
  returns: v.id("aboutValues"),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("aboutValues").collect();
    const maxOrder = existing.reduce((max, v) => Math.max(max, v.order), 0);
    return await ctx.db.insert("aboutValues", {
      ...args,
      order: maxOrder + 1,
    });
  },
});

export const deleteAboutValue = mutation({
  args: { id: v.id("aboutValues") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAuth(ctx);
    await ctx.db.delete(id);
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════
// INSTAGRAM POSTS (Projects section)
// ═══════════════════════════════════════════════════════════════════════

export const getInstagramPosts = query({
  args: {},
  returns: v.array(instagramPostValidator),
  handler: async (ctx) => {
    return await ctx.db.query("instagramPosts").withIndex("by_order").collect();
  },
});

export const addInstagramPost = mutation({
  args: { embedUrl: v.string() },
  returns: v.id("instagramPosts"),
  handler: async (ctx, { embedUrl }) => {
    await requireAuth(ctx);
    const normalized = normalizeInstagramEmbedUrl(embedUrl);
    if (!normalized) {
      throw new Error(
        "Invalid Instagram URL. Use a post or reel link like https://www.instagram.com/reel/…",
      );
    }
    const existing = await ctx.db.query("instagramPosts").collect();
    const maxOrder = existing.reduce((max, p) => Math.max(max, p.order), 0);
    return await ctx.db.insert("instagramPosts", {
      embedUrl: normalized,
      order: maxOrder + 1,
    });
  },
});

export const updateInstagramPost = mutation({
  args: {
    id: v.id("instagramPosts"),
    embedUrl: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { id, embedUrl }) => {
    await requireAuth(ctx);
    const normalized = normalizeInstagramEmbedUrl(embedUrl);
    if (!normalized) {
      throw new Error(
        "Invalid Instagram URL. Use a post or reel link like https://www.instagram.com/reel/…",
      );
    }
    await ctx.db.patch(id, { embedUrl: normalized });
    return null;
  },
});

export const deleteInstagramPost = mutation({
  args: { id: v.id("instagramPosts") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAuth(ctx);
    await ctx.db.delete(id);
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════════════════════════════════

export const getReviews = query({
  args: {},
  returns: v.array(reviewValidator),
  handler: async (ctx) => {
    const all = await ctx.db.query("reviews").withIndex("by_order").collect();
    return selectHomepageReviews(all).map((r) => ({
      ...r,
      rating: reviewRating(r.rating),
    }));
  },
});

export const getReviewsAdmin = query({
  args: {},
  returns: v.array(reviewValidator),
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.db.query("reviews").withIndex("by_order").collect();
  },
});

export const updateReview = mutation({
  args: {
    id: v.id("reviews"),
    text: v.string(),
    author: v.string(),
    date: v.string(),
    source: v.string(),
    rating: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, { id, ...data }) => {
    await requireAuth(ctx);
    const review = await ctx.db.get(id);
    if (!review) throw new Error("Review not found");
    if (review.googleReviewId) {
      throw new Error("Google reviews cannot be edited. They update on the next sync.");
    }
    await ctx.db.patch(id, {
      ...data,
      rating: data.rating === undefined ? undefined : reviewRating(data.rating),
    });
    return null;
  },
});

export const addReview = mutation({
  args: {
    text: v.string(),
    author: v.string(),
    date: v.string(),
    source: v.string(),
    rating: v.optional(v.number()),
  },
  returns: v.id("reviews"),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("reviews").collect();
    const maxOrder = existing.reduce((max, r) => Math.max(max, r.order), 0);
    return await ctx.db.insert("reviews", {
      ...args,
      order: maxOrder + 1,
      enabled: true,
      rating: reviewRating(args.rating),
    });
  },
});

export const toggleReviewEnabled = mutation({
  args: { id: v.id("reviews") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAuth(ctx);
    const review = await ctx.db.get(id);
    if (!review) throw new Error("Review not found");
    await ctx.db.patch(id, { enabled: !isReviewEnabled(review.enabled) });
    return null;
  },
});

export const deleteReview = mutation({
  args: { id: v.id("reviews") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAuth(ctx);
    const review = await ctx.db.get(id);
    if (!review) throw new Error("Review not found");
    if (review.googleReviewId) {
      throw new Error("Google reviews are removed automatically when unpublished and stale.");
    }
    await ctx.db.delete(id);
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════
// CONTACT CONTENT
// ═══════════════════════════════════════════════════════════════════════

export const getContactContent = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("contactContent"),
      _creationTime: v.number(),
      subtitle: v.string(),
      title: v.string(),
      description: v.string(),
      phone: v.string(),
      email: v.string(),
      location: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("contactContent").first();
  },
});

export const updateContactContent = mutation({
  args: {
    subtitle: v.string(),
    title: v.string(),
    description: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const settings = await ctx.db.query("siteSettings").first();
    const data = {
      ...args,
      phone: settings?.phone ?? "",
      email: settings?.email ?? "",
      location: settings?.address ?? "",
    };
    const existing = await ctx.db.query("contactContent").first();
    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("contactContent", data);
    }
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════
// LEADS
// ═══════════════════════════════════════════════════════════════════════

export const submitLead = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.string(),
    interest: v.string(),
    message: v.string(),
  },
  returns: v.id("leads"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("leads", {
      ...args,
      createdAt: Date.now(),
      read: false,
    });
  },
});

export const getLeads = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("leads"),
      _creationTime: v.number(),
      name: v.string(),
      phone: v.optional(v.string()),
      email: v.string(),
      interest: v.string(),
      message: v.string(),
      createdAt: v.number(),
      read: v.boolean(),
    }),
  ),
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.db
      .query("leads")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

export const markLeadAsRead = mutation({
  args: { id: v.id("leads") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAuth(ctx);
    await ctx.db.patch(id, { read: true });
    return null;
  },
});

export const deleteLead = mutation({
  args: { id: v.id("leads") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAuth(ctx);
    await ctx.db.delete(id);
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════
// SEED — populate DB with current website content
// ═══════════════════════════════════════════════════════════════════════

export const seed = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Only seed if empty
    const existingSettings = await ctx.db.query("siteSettings").first();
    if (existingSettings) return null;

    // Site Settings
    await ctx.db.insert("siteSettings", {
      businessName: "M5 Painting",
      tagline: "Family-Owned Since Day One",
      phone: "559-451-1022",
      email: "m5paintingco@gmail.com",
      address: "Sanger, CA · Central Valley",
      metaDescription:
        "M5 Painting — family-owned painting contractor in the Central Valley, California. Interior, exterior, and commercial painting services.",
    });

    // Hero
    await ctx.db.insert("heroContent", {
      headline: "Painting done right,",
      highlightText: "by people who care.",
      bodyText:
        "We're a family-run crew right here in the Valley. From the first walkthrough to the final coat, we treat your home like it's our own.",
      ctaText: "Get a Free Estimate",
      ctaPhone: "559-451-1022",
    });

    // Services
    const servicesData = [
      {
        order: 1,
        iconName: "Home",
        title: "Interior Painting",
        description:
          "Whether it's a single room or your whole house, we'll help you pick the perfect colors and make sure every wall, trim, and ceiling looks beautiful.",
        items: [
          "Single Room to Entire Home",
          "Textured & Faux Painting",
          "Wallpaper Removal",
          "Cabinet Refinishing",
          "Crown Molding & Trim",
          "Garage Floor Coating",
        ],
      },
      {
        order: 2,
        iconName: "Paintbrush",
        title: "Exterior Painting",
        description:
          "Your home's first impression matters. We use top-quality paints and proven techniques so your exterior holds up against the Valley heat for years.",
        items: [
          "Stucco & Plaster",
          "Wood & Vinyl Siding",
          "Trim, Fence & Deck",
          "Brick Treatments",
          "Concrete Staining",
          "Pressure Washing",
        ],
      },
      {
        order: 3,
        iconName: "Building2",
        title: "Commercial Painting",
        description:
          "We work with local businesses, offices, and property managers to keep their spaces looking sharp. Big job or small, same attention to detail.",
        items: [
          "Office & Retail",
          "Restaurants & Hotels",
          "Healthcare Facilities",
          "Warehouses & Industrial",
          "Multi-Family Housing",
          "Gyms & Fitness",
        ],
      },
      {
        order: 4,
        iconName: "MessageSquare",
        title: "Free Consultation",
        description:
          "Not sure where to start? Give us a call. We'll walk the job with you, talk through your ideas, and give you an honest quote.",
        items: [
          "On-Site Walkthrough",
          "Detailed Written Quote",
          "Color Advice",
          "No Obligation",
        ],
      },
    ];
    for (const s of servicesData) {
      await ctx.db.insert("services", s);
    }

    // About
    await ctx.db.insert("aboutContent", {
      subtitle: "The Family Behind Every Coat",
      title: "Built on Hard Work & Handshakes",
      paragraphs: [
        "M5 Painting started the way most good things do: a family that knows how to work hard. We grew up right here in the Central Valley, and when we started this business, we made a simple promise: treat every customer like a neighbor, because around here, they usually are.",
        "Matt and the crew bring that same small-town work ethic to every project. We show up on time, do quality work, and don't leave until you love it. That's not a sales pitch; it's just how we were raised.",
      ],
    });

    // About Values
    const valuesData = [
      {
        order: 1,
        iconName: "Heart",
        title: "We Care Like Family",
        description:
          "Your home is where your family makes memories. We show up with the same care we'd bring to our own parents' house.",
      },
      {
        order: 2,
        iconName: "Handshake",
        title: "Honest From Day One",
        description:
          "No hidden fees, no surprises, no cutting corners. A fair quote, on time, and happy before we pack up.",
      },
      {
        order: 3,
        iconName: "Shield",
        title: "Licensed, Bonded & Insured",
        description:
          "Fully licensed, bonded, and insured. You can relax knowing your property is protected.",
      },
      {
        order: 4,
        iconName: "Palette",
        title: "Your Vision, Our Hands",
        description:
          "We listen to what you want and bring it to life, whether that's a bold accent wall or a complete refresh.",
      },
    ];
    for (const val of valuesData) {
      await ctx.db.insert("aboutValues", val);
    }

    // Reviews
    const reviewsData = [
      {
        order: 1,
        text: "Great to work with. Very happy with the job Matt and his crew did on the exterior of our home. It was a big project. I would recommend them to have a job done right.",
        author: "Kara B.",
        date: "June 2025",
        source: "Yelp",
        enabled: true,
        rating: 5,
      },
      {
        order: 2,
        text: "Matt and his M5 painting team were amazing. Signed, Sealed and Delivered. Finished the inside of my rental home in one day! On time and very professional. I would recommend M5 to anyone.",
        author: "Nick C.",
        date: "June 2025",
        source: "Yelp",
        enabled: true,
        rating: 5,
      },
      {
        order: 3,
        text: "I highly recommend M5 Painting for any exterior paint work! They did an outstanding job on my home. From the stucco to the trim, everything looks fresh, clean, and professionally done. They helped me choose the perfect color for the stucco, and their attention to detail on the trimming made a huge difference.",
        author: "Krystle P.",
        date: "June 2025",
        source: "Angi",
        enabled: true,
        rating: 5,
      },
      {
        order: 4,
        text: "Matt and his crew did an amazing job of meeting all our needs and expectations! The time and quality of work was outstanding. Would highly recommend!",
        author: "Victoria F.",
        date: "June 2025",
        source: "Angi",
        enabled: true,
        rating: 5,
      },
    ];
    for (const r of reviewsData) {
      await ctx.db.insert("reviews", r);
    }

    // Contact
    await ctx.db.insert("contactContent", {
      subtitle: "We'd Love to Hear From You",
      title: "Ready to Get Started?",
      description:
        "Drop us a message or give us a call. We'll come out, take a look, and give you an honest, no-pressure quote.",
      phone: "559-451-1022",
      email: "m5paintingco@gmail.com",
      location: "Sanger, CA · Central Valley",
    });

    return null;
  },
});
