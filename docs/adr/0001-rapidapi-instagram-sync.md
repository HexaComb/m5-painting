# RapidAPI for Instagram projects post sync

M5’s homepage “Projects” section shows up to three published Instagram reel embeds, curated in admin like Google reviews. We need a server-side way to list recent reels for the business account (`m5painting`) on a weekly schedule.

We use the [instagram120 RapidAPI](https://rapidapi.com/) (`instagram120.p.rapidapi.com`) from Convex internal actions, with the API key in the Convex deployment environment (`RAPIDAPI_KEY`). The official [Meta Instagram Graph API](https://developers.facebook.com/docs/instagram-api/) was not chosen for the initial ship: it requires a Facebook app, linking the business Instagram to Meta, and permission/review work that is disproportionate for “import permalinks and let admins publish three embeds.”

RapidAPI trades official support for speed and parity with our existing SerpApi review sync pattern. If the provider becomes unreliable, too expensive, or policy-risky, the intended migration path is Graph API (or manual permalink paste, which remains supported as **manual projects post**s). Imported rows are keyed by Instagram media id so a future provider swap can re-upsert without changing the admin publish model.
