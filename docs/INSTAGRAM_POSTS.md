# Instagram Projects Posts (Apify)

The public `@m5painting` profile is read through [Apify's Instagram Scraper](https://apify.com/apify/instagram-scraper). The client does not need to sign in or authorize a Meta app.

Convex runs `instagramPosts:syncInstagramPosts` daily, and admins can run it from Settings. Each run requests up to 12 public posts and reels with a $0.10 maximum charge. New items publish automatically. The homepage shows the three newest published imports as Instagram embeds. Admins can hide an item; sync preserves that choice. Manual posts remain supported.

Set `APIFY_API_TOKEN` on the Convex deployment. Use a limited Apify token with Actor Run access and default run storage access. Set the public Instagram username in Admin → Settings. Signed image URLs from the scraper are intentionally not stored because they expire.

The integration is unofficial and depends on Instagram's public pages and Apify's scraper. If a run fails, existing published posts remain visible. Check Convex action logs and the Apify Runs page for the failure.
