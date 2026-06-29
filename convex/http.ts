import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

const http = httpRouter();

// ─── Auth routes (required) ────────────────────────────────────────────
auth.addHttpRoutes(http);

// ─── Public API: All site content in one call ──────────────────────────
http.route({
  path: "/api/content",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const [
      siteSettings,
      heroContent,
      services,
      aboutContent,
      aboutImages,
      aboutValues,
      instagramPosts,
      reviews,
      contactContent,
      certifications,
    ] = await Promise.all([
      ctx.runQuery(api.content.getSiteSettings),
      ctx.runQuery(api.content.getHeroContent),
      ctx.runQuery(api.content.getServices),
      ctx.runQuery(api.content.getAboutContent),
      ctx.runQuery(api.content.getAboutImages),
      ctx.runQuery(api.content.getAboutValues),
      ctx.runQuery(api.content.getInstagramPosts),
      ctx.runQuery(api.content.getReviews),
      ctx.runQuery(api.content.getContactContent),
      ctx.runQuery(api.content.getCertifications),
    ]);

    return new Response(
      JSON.stringify({
        siteSettings,
        heroContent,
        services,
        aboutContent,
        aboutImages,
        aboutValues,
        instagramPosts,
        reviews,
        contactContent,
        certifications,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  }),
});

http.route({
  path: "/api/content",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

// ─── Public API: Active tracking events ────────────────────────────────
http.route({
  path: "/api/events",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const events = await ctx.runQuery(api.trackingEvents.getActive);

    return new Response(
      JSON.stringify({
        events: events.map((e: { name: string; category: string; label: string; targetElement: string; trigger: string }) => ({
          name: e.name,
          category: e.category,
          label: e.label,
          targetElement: e.targetElement,
          trigger: e.trigger,
        })),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  }),
});

http.route({
  path: "/api/events",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

// ─── Public API: Log an event hit ──────────────────────────────────────
http.route({
  path: "/api/events/log",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = (await request.json()) as {
        eventName?: string;
        category?: string;
        label?: string;
        targetElement?: string;
        url?: string;
        sessionId?: string;
      };

      if (!body.eventName || !body.targetElement) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      await ctx.runMutation(internal.eventLogs.logHit, {
        eventName: body.eventName,
        category: body.category ?? "",
        label: body.label ?? "",
        targetElement: body.targetElement,
        timestamp: Date.now(),
        url: body.url ?? "",
        userAgent: request.headers.get("user-agent") ?? "",
        sessionId: body.sessionId ?? "",
      });

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch {
      return new Response(JSON.stringify({ error: "Internal error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

http.route({
  path: "/api/events/log",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

export default http;
