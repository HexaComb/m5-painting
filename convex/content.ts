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
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("siteSettings").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("siteSettings", args);
    }
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
      badgeText: v.string(),
      headline: v.string(),
      highlightText: v.string(),
      bodyText: v.string(),
      ctaText: v.string(),
      ctaPhone: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("heroContent").first();
  },
});

export const updateHeroContent = mutation({
  args: {
    badgeText: v.string(),
    headline: v.string(),
    highlightText: v.string(),
    bodyText: v.string(),
    ctaText: v.string(),
    ctaPhone: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("heroContent").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("heroContent", args);
    }
    return null;
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
// PROJECTS
// ═══════════════════════════════════════════════════════════════════════

export const getProjects = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("projects"),
      _creationTime: v.number(),
      order: v.number(),
      imageUrl: v.string(),
      altText: v.string(),
      label: v.string(),
      span: v.union(v.literal("large"), v.literal("small")),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("projects").withIndex("by_order").collect();
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    imageUrl: v.string(),
    altText: v.string(),
    label: v.string(),
    span: v.union(v.literal("large"), v.literal("small")),
  },
  returns: v.null(),
  handler: async (ctx, { id, ...data }) => {
    await requireAuth(ctx);
    await ctx.db.patch(id, data);
    return null;
  },
});

export const addProject = mutation({
  args: {
    imageUrl: v.string(),
    altText: v.string(),
    label: v.string(),
    span: v.union(v.literal("large"), v.literal("small")),
  },
  returns: v.id("projects"),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("projects").collect();
    const maxOrder = existing.reduce((max, p) => Math.max(max, p.order), 0);
    return await ctx.db.insert("projects", { ...args, order: maxOrder + 1 });
  },
});

export const deleteProject = mutation({
  args: { id: v.id("projects") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAuth(ctx);
    await ctx.db.delete(id);
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
// REVIEWS
// ═══════════════════════════════════════════════════════════════════════

export const getReviews = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("reviews"),
      _creationTime: v.number(),
      order: v.number(),
      text: v.string(),
      author: v.string(),
      date: v.string(),
      source: v.string(),
    }),
  ),
  handler: async (ctx) => {
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
  },
  returns: v.null(),
  handler: async (ctx, { id, ...data }) => {
    await requireAuth(ctx);
    await ctx.db.patch(id, data);
    return null;
  },
});

export const addReview = mutation({
  args: {
    text: v.string(),
    author: v.string(),
    date: v.string(),
    source: v.string(),
  },
  returns: v.id("reviews"),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("reviews").collect();
    const maxOrder = existing.reduce((max, r) => Math.max(max, r.order), 0);
    return await ctx.db.insert("reviews", { ...args, order: maxOrder + 1 });
  },
});

export const deleteReview = mutation({
  args: { id: v.id("reviews") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireAuth(ctx);
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
    phone: v.string(),
    email: v.string(),
    location: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("contactContent").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("contactContent", args);
    }
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
      badgeText: "Family-Owned in the Central Valley",
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

    // Projects
    const projectsData = [
      {
        order: 1,
        imageUrl: "/images/project-shop.webp",
        altText:
          "White wood siding barn with large sliding door after exterior paint",
        label: "Exterior",
        span: "large" as const,
      },
      {
        order: 2,
        imageUrl: "/images/project-spray.webp",
        altText: "M5 Painting crew member spray painting on a job site",
        label: "In Progress",
        span: "small" as const,
      },
      {
        order: 3,
        imageUrl: "/images/project-door.webp",
        altText:
          "Black front door with oval glass window, precision detail work",
        label: "Interior",
        span: "small" as const,
      },
      {
        order: 4,
        imageUrl: "/images/project-aerial.webp",
        altText:
          "Aerial view of a residential property after a full exterior repaint",
        label: "Residential",
        span: "large" as const,
      },
      {
        order: 5,
        imageUrl: "/images/project-logo-shop.webp",
        altText: "Building with M5 Painting branding on the garage door",
        label: "Commercial",
        span: "small" as const,
      },
      {
        order: 6,
        imageUrl: "/images/paint-can.webp",
        altText: "Premium paint can with M5 Painting branding",
        label: "Materials",
        span: "small" as const,
      },
    ];
    for (const p of projectsData) {
      await ctx.db.insert("projects", p);
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
      },
      {
        order: 2,
        text: "Matt and his M5 painting team were amazing. Signed, Sealed and Delivered. Finished the inside of my rental home in one day! On time and very professional. I would recommend M5 to anyone.",
        author: "Nick C.",
        date: "June 2025",
        source: "Yelp",
      },
      {
        order: 3,
        text: "I highly recommend M5 Painting for any exterior paint work! They did an outstanding job on my home. From the stucco to the trim, everything looks fresh, clean, and professionally done. They helped me choose the perfect color for the stucco, and their attention to detail on the trimming made a huge difference.",
        author: "Krystle P.",
        date: "June 2025",
        source: "Angi",
      },
      {
        order: 4,
        text: "Matt and his crew did an amazing job of meeting all our needs and expectations! The time and quality of work was outstanding. Would highly recommend!",
        author: "Victoria F.",
        date: "June 2025",
        source: "Angi",
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
