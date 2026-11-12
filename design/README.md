# M5 social card

`node scripts/generate-social-card.mjs` creates `public/images/m5-social-card-v2.jpg` at exactly 1200 × 630 pixels. The share card uses a flat black/blue layout, the original M5 logo and the original finished-door photo from this repository. Neither source image is redrawn. No new project imagery or claims are invented. The generated JPEG is approximately 93 KB.

The two TTF files here are static instances of the same Latin-subset Schibsted Grotesk and Public Sans fonts already bundled by the site. They are used only by the image generator, not added to client font loading. SIL Open Font License notices are in `public/fonts/OFL-SchibstedGrotesk.txt` and `public/fonts/OFL-PublicSans.txt`; original source details are in `public/fonts/SOURCE.txt`.

Social metadata is centralized in `src/lib/social-metadata.ts`. Vercel preview builds use the public GitHub raw asset pinned to the exact deployment commit so an image crawler needs no Vercel account, cookie or share token. Production metadata uses the site's own image URL. OpenGraph page URLs and SEO canonical URLs remain unchanged. Existing social-platform caches may need a new share or re-scrape to refresh.
