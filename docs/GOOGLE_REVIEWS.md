# Google Reviews (SerpApi)

Google reviews sync automatically into the CMS. Admins choose which ones appear on the homepage.

## How it works

1. **SerpApi** fetches the **10 newest** reviews for your saved Google **Place ID** every **10 days** (Convex cron), or when you click **Sync Google reviews** in **Admin → Settings**.
2. Reviews are stored in the `reviews` table with `source: "Google"` and `googleReviewId`.
3. **New imports are hidden** until you publish them in **Admin → Reviews**.
4. The homepage shows at most **6** published reviews (lowest `order` first).

Unpublished Google imports that are no longer in the latest fetch are removed on sync. Published Google reviews are kept even if they drop out of the newest 10.

## Setup

### 1. SerpApi API key (Convex dashboard)

The key must live in your **Convex deployment** environment, not only in `.env.local`:

1. Open [dashboard.convex.dev](https://dashboard.convex.dev/) → your deployment → **Settings → Environment variables**.
2. Add:

| Variable | Description |
|----------|-------------|
| `SERP_API_KEY` | Your SerpApi private key (`SERPAPI_API_KEY` also works) |

### 2. Google Place ID (Admin → Settings)

1. Open your business on [Google Maps](https://maps.google.com).
2. Use Google’s [Place ID finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) or copy the ID from the Maps URL (`ChIJ…`).
3. In **Admin → Settings**, paste it under **Google Place ID** and save.

### 3. Sync and publish reviews

1. In **Admin → Settings**, save your Place ID, then click **Sync Google reviews** (or wait for the next scheduled sync).
2. Go to **Admin → Reviews** to publish imports.
3. Toggle **Published** for reviews you want on the site.
4. Up to **6** published reviews (by list order) appear on the homepage. Others show **Published (not on homepage)** until you unpublish or reorder.

## SerpApi usage

- Each sync uses about **1–2 SerpApi searches** (10 reviews, newest first).
- With a 10-day cron, expect ~3–6 searches per month.

See [SerpApi pricing](https://serpapi.com/pricing).

## Manual reviews

You can still add Yelp, Angi, or other testimonials with **Add Review**. Those default to published and are fully editable.
