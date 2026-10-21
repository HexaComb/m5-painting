# Google Reviews (SerpApi)

Convex runs `googleReviews:syncGoogleReviews` daily, and admins can run it from Settings. SerpApi reads up to 20 recent raw Google reviews for the saved Place ID, newest first. Reviews without text are skipped. Imported reviews publish automatically; the homepage shows the six newest published Google reviews. Admins can hide any review, and sync preserves that choice. Manual reviews remain supported.

Set `SERP_API_KEY` on the Convex deployment and the Google Place ID in Admin → Settings. A sync generally uses one or two SerpApi searches. Monitor [SerpApi usage and pricing](https://serpapi.com/pricing) if the review volume grows. If a sync fails, existing published reviews remain visible.
