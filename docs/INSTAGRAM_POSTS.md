# Instagram Projects Posts (RapidAPI)

Instagram reels sync automatically into the CMS. Admins choose which ones appear on the homepage Projects section.

## How it works

1. **RapidAPI** fetches the **12 newest reels** for your saved Instagram **username** every **week** (Convex cron), or when you click **Sync Instagram posts** in **Admin → Settings**.
2. Reels are stored in the `instagramPosts` table with `instagramMediaId`.
3. **New imports are hidden** until you publish them in **Admin → Projects**.
4. The homepage shows at most **3** published reels (lowest `order` first) as official Instagram embeds.

Unpublished imported reels that are no longer in the latest fetch are removed on sync. Published reels are kept even if they drop out of the newest 12.

Manual permalink paste remains supported for one-off posts.

## Setup

### 1. RapidAPI key (Convex dashboard)

The key must live in your **Convex deployment** environment, not only in `.env.local`:

1. Open [dashboard.convex.dev](https://dashboard.convex.dev/) → your deployment → **Settings → Environment variables**.
2. Add:

| Variable | Description |
|----------|-------------|
| `RAPIDAPI_KEY` | Your RapidAPI key for [instagram120](https://rapidapi.com/) (`RAPID_API_KEY` also works) |

### 2. Instagram username (Admin → Settings)

1. Default username is `m5painting` (seeded on first deploy).
2. In **Admin → Settings**, confirm or change it under **Instagram username** and save.

### 3. Sync and publish reels

1. In **Admin → Settings**, save your username, then click **Sync Instagram posts** (or wait for the weekly cron).
2. Go to **Admin → Projects** to publish imports.
3. Toggle **Published** for reels you want on the site.
4. Up to **3** published reels (by list order) appear on the homepage. Others show **Published (not on homepage)** until you unpublish or reorder.

## RapidAPI usage

- Each sync uses about **1–5 RapidAPI requests** (pagination until 12 reels are collected or the API is exhausted).
- With a weekly cron, expect ~4–20 requests per month depending on how many pages are needed to find reels.

See your RapidAPI plan for pricing.

## Manual posts

You can still add individual Instagram post or reel URLs with **Add Post**. Those default to published and are fully editable.
