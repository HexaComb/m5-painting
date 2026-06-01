# Google Reviews integration

This site can pull real Google reviews into the admin CMS and let you choose which ones appear on the public homepage.

## How it works

1. **Google Places API (New)** fetches up to **5 reviews** for your business Place ID (Google’s limit for this API).
2. Reviews are stored in Convex with `source: "Google"` and a stable `googleReviewId`.
3. **New imports are hidden by default** (`enabled: false`). Use the toggle in **Admin → Reviews** to show them on the site.
4. The public site only loads reviews where `enabled` is not `false` (manual Yelp/Angi reviews stay visible unless you hide them).

For **all** reviews on a profile you own, Google’s **Business Profile API** supports pagination—but it requires OAuth, API access approval, and more setup. The Places API is the practical choice for “pick a few Google reviews to feature on the site.”

## Setup

### 1. Google Cloud

1. Create or open a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Places API (New)**.
3. Create an API key and restrict it to Places API (server-side use recommended).
4. Billing must be enabled on the project (Places API is usage-based).

### 2. Convex environment

In the [Convex dashboard](https://dashboard.convex.dev/) → your deployment → **Settings → Environment variables**, add:

| Variable | Description |
|----------|-------------|
| `GOOGLE_PLACES_API_KEY` | Your Google Places API key (never expose in `NEXT_PUBLIC_*`) |

### 3. Find your Place ID

1. Open your business on [Google Maps](https://maps.google.com).
2. Use **Share** or Google’s [Place ID finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder).
3. Copy the ID (e.g. `ChIJ...`).

### 4. Admin

1. Go to **Admin → Reviews**.
2. Paste the Place ID and click **Save Place ID**.
3. Click **Sync from Google**.
4. Toggle **On site** for each review you want visitors to see.

## Re-syncing

Running **Sync from Google** again updates text, author, date, and rating for existing Google reviews (matched by `googleReviewId`). It does **not** change whether a review is shown on the site—that stays under your control.

## Manual reviews

You can still add Yelp, Angi, or other testimonials with **Add Review**. Those default to **on site** immediately.
