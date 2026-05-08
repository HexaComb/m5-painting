import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

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
      projects,
      aboutContent,
      aboutValues,
      reviews,
      contactContent,
    ] = await Promise.all([
      ctx.runQuery(api.content.getSiteSettings),
      ctx.runQuery(api.content.getHeroContent),
      ctx.runQuery(api.content.getServices),
      ctx.runQuery(api.content.getProjects),
      ctx.runQuery(api.content.getAboutContent),
      ctx.runQuery(api.content.getAboutValues),
      ctx.runQuery(api.content.getReviews),
      ctx.runQuery(api.content.getContactContent),
    ]);

    return new Response(
      JSON.stringify({
        siteSettings,
        heroContent,
        services,
        projects,
        aboutContent,
        aboutValues,
        reviews,
        contactContent,
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

export default http;
