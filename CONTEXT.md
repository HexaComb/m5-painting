# M5 Painting Website

Marketing site and admin CMS for a family-owned painting business. Content (hero, services, reviews, etc.) is edited in admin and shown on the public homepage.

## Language

### Reviews

**Review**:
A customer testimonial shown on the public site or held in the CMS. Manual entries (Yelp, word of mouth) and Google imports share the same store. New manual reviews are **published** by default; new **Google review (imported)**s are not until an admin toggles them on.
_Avoid_: Testimonial (fine in copy, not as the data model name)

**Manual review**:
A **Review** added by an admin (not from SerpApi). Text, author, date, and source are editable. Used for Yelp, Angi, or other non-Google sources.
_Avoid_: Custom review, hand-entered testimonial

**Rating**:
The star count (1–5) shown with a **published review** on the homepage. Comes from Google on sync for imports; set by the admin when adding a **manual review** (default 5).
_Avoid_: Score, stars field

**Google review (imported)**:
A **Review** whose text came from Google via SerpApi, identified by a stable `googleReviewId`. Sync updates its text, author, date, and rating; admins cannot edit those fields. Sync does not change whether the review is **published** by itself.
_Avoid_: Cached review, SerpApi row

**Published review**:
A **Review** the admin has chosen to show on the homepage (`enabled` is true). In admin, Google imports and manual reviews appear in one list; each row can be toggled on or off for the site. Toggling on does not guarantee homepage placement if the display cap is already full.
_Avoid_: Active review, visible review, featured review

**Homepage review cap**:
The maximum number of **published review**s shown on the public site at once: **6**. Among published reviews, the six lowest `order` values appear on the homepage; additional published reviews remain in the CMS but are hidden on the homepage until others are unpublished or reordered.
_Avoid_: Limit, max reviews

**Review sync**:
A pull of the newest Google reviews from SerpApi into the CMS—either on a fixed schedule (every 10 days) or when an admin runs sync from **Admin → Settings**. Same rules either way: imports land unpublished until the admin selects them; after sync, unpublished Google imports that were not in this fetch are removed; **published review**s are kept even if they are no longer in the newest batch.
_Avoid_: Fetch, scrape, crawl

**Google Place ID**:
The Maps identifier for M5 Painting’s listing, stored in site settings and used by **review sync**. Configured in Admin → Settings, not on the reviews page.
_Avoid_: Place key, business ID
