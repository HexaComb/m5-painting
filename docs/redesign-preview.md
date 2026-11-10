# Client-inspired design preview

Feature branch: `feature/client-inspired-redesign`. Do not merge or promote to production without review.

## Direction and references

- AAC Painters (https://www.aacpaintersinc.com): image-led proof, oversized editorial hierarchy, clear estimate path, Schibsted Grotesk / Public Sans.
- Ruiz Family Hardscapes (https://ruizfamilyhardscapes.biz): generous spacing, dark slate and light section rhythm, real craft photography.
- Bug Dude (https://github.com/HexaComb/bug-dude): distinct local-service identity, direct phone/estimate actions, restrained square controls.

M5 retains its own blue identity, live CMS copy, family imagery, current phone/email, reviews, FAQs, service links, structured data, lead submission and analytics code. No decorative sequential section numbers. No invented testimonials, project locations, metrics, or warranties.

## Media

Existing `/images/project-*` assets are the site's original M5 project photography. The family images remain managed by the live CMS. Hero image/video overrides remain editable in the existing CMS. The hero now places video full-bleed behind the headline and calls to action, with a dark contrast overlay and a bottom-right pause/play button. Its default `/videos/m5-hero-background.mp4` is a caption-free jobsite excerpt from the existing `/videos/m5easyprocess-720p.mp4` already used by M5’s website (introduced in commit `0beb15f`). It uses seconds 10.0–17.7, cropped to the upper 720×800 of the portrait original to exclude baked-in process captions. No stock or generated footage was added, and the full original video is unchanged. The 7.7-second H.264 excerpt is 656 KB, 24 fps, fast-start, and has no audio track. The WebP poster is a direct frame from that excerpt, 36 KB.

The background covers the entire hero at all breakpoints, with responsive cropping. It is muted, inline, and looping, and does not autoplay for reduced-motion or data-saver visitors. `preload="none"` avoids downloading video before the playback preference is resolved. The poster remains visible if autoplay is unavailable. The decorative video is hidden from screen readers; the visible pause/play control has explicit accessible labels. CMS custom-media overrides remain supported.

Instagram embeds are progressively loaded only when visitors open “More from our jobsites.” The regular homepage doesn't eagerly load third-party embeds. A proper image gallery remains visible even if Instagram is unavailable.

## Verification

- `bun install --frozen-lockfile`
- `bun run build`: content fetch, Next compilation, integrated lint and TypeScript, 31 pages generated.
- `bun run lint`
- `bunx tsc --noEmit`
- `git diff --check`

Form UI is preserved, including the in-flight duplicate-submission lock, required fields, success/reset states and success-only analytics. No test leads are sent to the live business.

Fonts are local WOFF2 Latin subsets with SIL licenses, 64 KB combined. Large photos use Next image responsive sizing. Below-fold images are lazy. Reduced-motion disables the entry animation/reveals, and the family gallery rotates only on deliberate control input.

### Instagram source cards

Three real M5 Instagram reel covers have been saved locally and linked directly to their original reels. Public 360px covers are kept in small portrait cards, never stretched into the hero:
- Finished patio: https://www.instagram.com/m5painting/reel/DbeuApRBkL8/
- Tulare masking/prep, explicitly labeled before: https://www.instagram.com/m5painting/reel/Dcr__0mhvxS/
- Crew at a home: https://www.instagram.com/m5painting/reel/DWhiXKQEljE/

Original-source captions and the before-stage are not presented as finished transformations. Further Instagram sourcing was stopped at the user’s request. These existing public source cards remain unchanged.

## Navbar refinement

The navbar is a flat warm-white strip with evenly spaced dark links and one dark estimate action. The original `/images/logo.webp` is restored in the home link, unaltered and uncropped: 72px on desktop, 64px on mobile. The attempted typographic substitute has been removed. Desktop grid columns keep navigation centered between the authentic logo and estimate action. There are no gradients or floating pill containers in the navbar. The hero video and its overlay are unchanged.

Desktop navigation remains visible from 960px. Smaller screens use a 44px menu toggle and scrollable, clearly separated menu rows. The disclosure closes on link selection, Escape (returning focus), outside pointer interaction, focus leaving the header, route changes, and a switch to desktop width. Phone access remains in the mobile menu and existing site content. Current standalone nav pages expose `aria-current`.

Navbar validation: Bun production build (31 routes), standalone lint/TypeScript, and generated HTML checks passed for home/services/contact. An isolated React + Happy DOM harness passed initial closed state, repeated open/close, Escape and focus return, link selection, outside pointer, focus leaving, desktop breakpoint, route changes, active service link, estimate action, and telephone target. This is a DOM behavior test, not a real-browser rendering test. Live visual/overflow checks remain unavailable because the desktop attachment reported offline; preview protection was not changed.
