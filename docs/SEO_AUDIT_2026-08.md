# M5 Painting SEO Audit — August 2026

Tracking issue: #24

## Goal

Improve M5 Painting's local organic visibility by concentrating overlapping search intent, especially the Google Search Console query **"painters sanger"**, and by making the pages that rank more useful and convincing to prospective customers.

## Baseline signal

The August 2026 Search Console review showed that Google is already discovering the site and its service/location pages. The strongest query signal reviewed was **"painters sanger"** with 123 impressions, while impressions were spread across the homepage, `/sanger-painting-company`, `/painting-company`, and `/central-valley-painting-company`.

This means the primary problem is not discovery. It is **intent concentration, relevance, and proof**.

## Findings

### P0/P1 — Canonical host consistency

The code previously defaulted canonical, sitemap, Open Graph, and structured-data URLs to `https://m5painting.com`, while Search Console was reporting `https://www.m5painting.com` URLs.

**Decision:** use `https://www.m5painting.com` as the canonical host.

**Implementation:**

- Default `NEXT_PUBLIC_SITE_URL` to the www host.
- Normalize either M5 apex/www environment value to the www canonical URL in `src/lib/site.ts`.
- Configure `www.m5painting.com` as the primary domain in Netlify. Netlify automatically redirects the apex/www alternate to the configured primary domain.

### P1 — Keyword cannibalization

The homepage, `/painting-company`, and `/sanger-painting-company` were all targeting variations of "painting company in Sanger."

**Decision:**

- Homepage = M5 Painting brand/entity + broad residential/commercial services.
- `/sanger-painting-company` = **painters in Sanger, CA**.
- `/painting-company` = permanently redirect to `/sanger-painting-company`.

### P1 — Sanger page does not match strongest observed query

The Sanger page targeted `Sanger painting company`, while Search Console's strongest reviewed query was `painters sanger`.

**Implementation:** retarget title, H1, description, body copy, FAQ language, and metadata around natural variations of **painters in Sanger, CA** without keyword stuffing.

### P1 — Ranking pages lack trust proof

The SEO landing-page template showed useful copy but very little customer proof near the decision path.

**Implementation:**

- Surface enabled credentials in the landing-page hero.
- Surface up to three enabled customer reviews on SEO landing pages.
- Keep review text sourced from existing CMS/build content; do not invent testimonials.

### P1 — Estimate funnel has unnecessary hop

The landing-page hero previously scrolled to a second CTA, which then sent the visitor to the homepage contact form.

**Implementation:** point the hero CTA directly to the contact form and use consistent **Get a Free Estimate** wording.

### P2 — Generic internal-link labels

Geo pages both used the generic `Painting Services` display name, producing ambiguous related-page cards.

**Implementation:** use distinct names such as `Sanger Painting Services` and `Central Valley Painting Services`.

### P2 — Hidden homepage SEO text

The homepage contained an `sr-only` sentence carrying location/service keywords.

**Decision:** search relevance should be visible to customers too.

**Implementation:** replace the hidden sentence with a visible `Sanger, CA · Residential & Commercial Painting` hero label.

### P2 — Approximate structured-data coordinates

The homepage supplied hard-coded generalized Sanger coordinates in LocalBusiness JSON-LD.

**Implementation:** remove the coordinates until a verified business location is available. Keep truthful service-area data.

### P2 — Sitemap modification dates

Every sitemap URL used build time as `lastModified`, even when the page itself had not changed.

**Implementation:** omit `lastModified` until meaningful per-page modification dates are available.

## Work completed in `seo/sanger-intent-consolidation`

- [x] Standardize canonical URL fallback on `https://www.m5painting.com`.
- [x] Document www as the production URL in `.env.example`.
- [x] Separate homepage title intent from the Sanger location landing page.
- [x] Retarget `/sanger-painting-company` to `painters in Sanger, CA`.
- [x] Expand Sanger content with service, process, and local-area detail.
- [x] Remove `/painting-company` from generated SEO pages.
- [x] Add permanent `/painting-company` → `/sanger-painting-company` redirect.
- [x] Fix ambiguous geo-page internal-link labels.
- [x] Remove hidden homepage keyword copy and make local relevance visible.
- [x] Remove approximate LocalBusiness geo coordinates.
- [x] Stop setting sitemap `lastModified` to build time while preserving `/contact`.
- [x] Add credentials to SEO landing-page heroes.
- [x] Add existing customer reviews to SEO landing pages.
- [x] Remove the two-hop estimate CTA path.

## Follow-up work

### Page-specific project imagery

The SEO landing pages still share `/images/hero-banner.webp`. Each high-value page should use a real, relevant project image where a verified asset is available:

- Sanger page → a real Sanger/local project if one is identified.
- Interior page → interior project.
- Exterior page → exterior project.
- Commercial page → commercial project.

Do not label a generic image as a specific project that it does not depict.

### Verified external profiles

The LocalBusiness `sameAs` array currently derives from verified Google Place/Instagram CMS settings. Add BBB, Angi, Yelp, or other profiles only after the exact M5 profile URLs are verified.

### Contact page integration

The dedicated `/contact` page has now landed on `main`. This SEO branch was refreshed on top of that work and preserves `/contact` in the sitemap. A future cleanup can point SEO-page estimate buttons directly to `/contact` if that experience is preferred over the existing homepage form.

### Netlify primary-domain setting

Code now consistently emits the www canonical host, but the Netlify project should also have **`www.m5painting.com` configured as the primary domain**. This is an environment/deployment setting rather than repository code.

## Post-deploy validation

1. Confirm `https://m5painting.com/*` redirects to `https://www.m5painting.com/*`.
2. Confirm rendered canonical URLs use the www host.
3. Confirm `/painting-company` returns a permanent redirect to `/sanger-painting-company`.
4. Confirm `/painting-company` is absent from `sitemap.xml`.
5. Confirm `/contact` remains present in `sitemap.xml`.
6. Confirm the Sanger page title/H1 target "painters in Sanger, CA" naturally.
7. Validate LocalBusiness, Service, FAQ, and Breadcrumb JSON-LD with Google's rich-results/schema tools where applicable.
8. Request re-indexing for the homepage and Sanger page in Search Console.
9. Record Search Console query/page performance after 28 and 56 days before making another major intent change.
