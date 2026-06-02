# Google Reviews integration (SerpApi)

This site pulls Google reviews through [SerpApi](https://serpapi.com/google-maps-reviews-api) and lets you choose which ones appear on the public homepage.

## How it works

1. **SerpApi** fetches the **10 newest** reviews for your Google **Place ID**.
2. Reviews are stored in Convex with `source: "Google"` and a stable `googleReviewId` (SerpApi `review_id`).
3. **New imports are hidden by default** (`enabled: false`). Use the toggle in **Admin → Reviews** to show them on the site.
4. The public site only loads reviews where `enabled` is not `false`.

Each sync uses **1–2 SerpApi searches** (first page returns 8 reviews; a second page is only fetched if needed to reach 10).

## Setup

### 1. SerpApi account

1. Sign up at [serpapi.com](https://serpapi.com/).
2. Copy your API key from the dashboard.

### 2. Convex environment

In the [Convex dashboard](https://dashboard.convex.dev/) → your deployment → **Settings → Environment variables**, add:

| Variable | Description |
|----------|-------------|
| `SERPAPI_API_KEY` | Your SerpApi private key (never use `NEXT_PUBLIC_*`) |

### 3. Google Place ID

1. Open your business on [Google Maps](https://maps.google.com).
2. Use Google’s [Place ID finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) or copy the Place ID from the Maps URL.
3. The ID looks like `ChIJ...`.

### 4. Admin

1. Go to **Admin → Reviews**.
2. Paste the Place ID and click **Save Place ID**.
3. Click **Sync from Google**.
4. Toggle **On site** for each review you want visitors to see.

## Re-syncing

Running **Sync from Google** again updates text, author, date, and rating for existing Google reviews (matched by `googleReviewId`). It does **not** change whether a review is shown on the site.

## SerpApi usage

- Each sync imports at most **10 reviews**, sorted **newest first**.
- Typically costs **1–2 searches** per sync on your SerpApi plan.

Check your plan at [SerpApi pricing](https://serpapi.com/pricing).

## Manual reviews

You can still add Yelp, Angi, or other testimonials with **Add Review**. Those default to **on site** immediately.
