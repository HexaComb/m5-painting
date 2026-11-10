# Client-inspired design preview

Feature branch: `feature/client-inspired-redesign`. Do not merge or promote to production without review.

## Direction and references

- AAC Painters (https://www.aacpaintersinc.com): image-led proof, oversized editorial hierarchy, clear estimate path, Schibsted Grotesk / Public Sans.
- Ruiz Family Hardscapes (https://ruizfamilyhardscapes.biz): generous spacing, dark slate and light section rhythm, real craft photography.
- Bug Dude (https://github.com/HexaComb/bug-dude): distinct local-service identity, direct phone/estimate actions, restrained square controls.

M5 retains its own blue identity, live CMS copy, family imagery, current phone/email, reviews, FAQs, service links, structured data, lead submission and analytics code. No decorative sequential section numbers. No invented testimonials, project locations, metrics, or warranties.

## Media

Existing `/images/project-*` assets are the site's original M5 project photography. The family images remain managed by the live CMS. Hero image/video overrides remain editable in the existing CMS; when no override is set, the preview uses the real entry-door photograph rather than stretching a captioned portrait process reel across a large hero.

Instagram embeds are progressively loaded only when visitors open “More from our jobsites.” The regular homepage doesn't eagerly load third-party embeds. A proper image gallery remains visible even if Instagram is unavailable.

## Verification

- `bun install --frozen-lockfile`
- `bun run build`: content fetch, Next compilation, integrated lint and TypeScript, 31 pages generated.
- `bun run lint`
- `bunx tsc --noEmit`
- `git diff --check`

Form UI is preserved, including the in-flight duplicate-submission lock, required fields, success/reset states and success-only analytics. No test leads are sent to the live business.

Fonts are local WOFF2 Latin subsets with SIL licenses, 64 KB combined. Large photos use Next image responsive sizing. Hero image is prioritized; below-fold images are lazy. Reduced-motion disables the entry animation/reveals, and the family gallery rotates only on deliberate control input.

### Instagram source cards

Three real M5 Instagram reel covers have been saved locally and linked directly to their original reels. Public 360px covers are kept in small portrait cards, never stretched into the hero:
- Finished patio: https://www.instagram.com/m5painting/reel/DbeuApRBkL8/
- Tulare masking/prep, explicitly labeled before: https://www.instagram.com/m5painting/reel/Dcr__0mhvxS/
- Crew at a home: https://www.instagram.com/m5painting/reel/DWhiXKQEljE/

Original-source captions and the before-stage are not presented as finished transformations. Complete post/reel access requires Instagram login; these public covers remain a safe fallback.
