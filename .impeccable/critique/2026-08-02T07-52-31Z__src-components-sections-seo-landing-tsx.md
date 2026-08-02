---
target: 7 SEO landing pages (seo-landing.tsx)
total_score: 18
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
timestamp: 2026-08-02T07-52-31Z
slug: src-components-sections-seo-landing-tsx
---
Method: dual-agent (A: d39d4a81-b2be-4cd7-aa06-d7734f6ac540 · B: ad44e3bd-883b-4534-9c9f-715393b45e20)

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Breadcrumb OK; estimate flow leaves page with no service continuity |
| 2 | Match System / Real World | 2 | Valley craft language fights keyword stuffing; checklist UI is stock contractor |
| 3 | User Control and Freedom | 3 | Easy exit/home/call; estimate path forces context switch to homepage form |
| 4 | Consistency and Standards | 2 | CTA label triad; duplicate “Painting Services” cards; thinner than homepage proof |
| 5 | Error Prevention | 2 | No on-page form; doesn’t prevent the trust error of calling without proof |
| 6 | Recognition Rather Than Recall | 2 | No jobs/reviews in-flow; related titles collide on geo pages |
| 7 | Flexibility and Efficiency | n/a | Persuade landing — no power-user efficiency surface |
| 8 | Aesthetic and Minimalist Design | 2 | Clean but hollow; template rhythm; craft principle violated by emptiness |
| 9 | Error Recovery | 2 | No form recovery here; dead-end is emotional (thin proof), not technical |
| 10 | Help and Documentation | n/a | Persuade; FAQ is marketing content, not product help |
| **Total** | | **18/32** | **Acceptable (~56%)** |

#### Design Specificity Verdict

**LLM assessment**: Category-interchangeable contractor SEO template wearing M5 clothes. Brand tokens are present (Shop Black hero, electric highlight, Montserrat, blue paint rules, swoosh), but composition is programmatic: dark text hero → prose + checklist → FAQ → related cards → dark CTA. Homepage carries “Well-Painted Shop Truck” (media, certs, stars, craft imagery); these seven pages abandon that system. One recycled portrait `hero-banner.webp` jammed into a short landscape crop with rotating alts does not show the craft.

**Deterministic scan**: CLI `detect.mjs` on `seo-landing.tsx` returned `[]` (exit 0). Live browser overlay on `/commercial-painting` found 23 labels: 13× low contrast text, 4× decorative radial glow, 3× line length too long, 2× glowing shadow accents, plus banner notes for overused Lato, kickers (“What you get”, “Ready when you are”), and a skipped heading level. Many overlays sit on shared chrome (header, footer, cookie bar) outside the SEO component — explains CLI clean vs browser hits.

**Visual overlays**: Injection succeeded on `/commercial-painting` via live-server port 8400; overlays were visible during Assessment B. Live server was stopped after evidence capture. No reliable console log stream (MCP has no console reader).

#### Overall Impression

Usable brochure pages that will index, but weak persuaders for M5’s brief. Biggest opportunity: put craft proof (real jobs, reviews, badges) in the first two scrolls and close the estimate on the same page — so ranked URLs also sell.

#### What's Working

1. **Hero CTA pair is decisive** — Free Estimate + visible phone matches the success metric.
2. **Brand material language in the hero** — Shop Black, electric phrase highlight, swoosh, Montserrat display feel like M5 signage.
3. **Closing CTA copy is the most human block** — “walk the job,” “clear written quote,” local place names.

#### Priority Issues

**[P1] First viewport and body withhold craft proof**
- **What**: No job photography, reviews, or cert badges in `<main>` beyond one mangled crop.
- **Why it matters**: Cold SEO visitors never get “these are real people who do great work” in seconds.
- **Fix**: Dominant real project image near hero; 2–3 reviews + cert marks in template; stop using one portrait asset as landscape thumbnail.
- **Suggested command**: `/impeccable bolder` or `/impeccable layout`

**[P1] Estimate path is a two-hop leave-the-page funnel**
- **What**: Hero → `#contact-cta` → Request Estimate → `/#contact`. Header already goes to `/#contact`. Labels disagree (Free Estimate / Get a Free Estimate / Request Estimate).
- **Why it matters**: Friction and context loss at conversion.
- **Fix**: One primary CTA to on-page estimate module (or deep-link with service prefill); unify label to “Free Estimate.”
- **Suggested command**: `/impeccable clarify` or `/impeccable distill`

**[P1] Template sameness across seven intents**
- **What**: Residential, commercial, interior, exterior, and three geo pages share identical choreography.
- **Why it matters**: Violates “vary the rhythm”; geo doesn’t feel more local; commercial doesn’t feel more operational.
- **Fix**: Intent-specific modules (commercial scheduling, geo area proof, interior room gallery).
- **Suggested command**: `/impeccable shape` or `/impeccable layout`

**[P2] Related services IA broken for geo pages**
- **What**: Two cards both titled “Painting Services” (`serviceName` collision).
- **Why it matters**: Users can’t tell destinations apart; smells programmatic.
- **Fix**: Distinct display titles per slug.
- **Suggested command**: `/impeccable clarify`

**[P2] Benefits chunk is a 6-item black checklist**
- **What**: Classic contractor widget; claims reviews without showing any.
- **Why it matters**: Exceeds working-memory chunking; trust claim without evidence.
- **Fix**: ≤4 concrete outcomes; replace reviews bullet with a quoted review.
- **Suggested command**: `/impeccable distill`

#### Persona Red Flags

**Jordan (First-Timer)**: Strong H1 then walls of similar paragraphs; estimate requires a second hop off-page. Abandonment risk at hop two.

**Casey (Distracted Mobile)**: On small screens, two long sections before the only image; sticky header offers six destinations; related cards before final CTA invite mis-taps.

**Riley (Stress Tester)**: Opens three geo/company URLs — same layout, same image, overlapping copy, duplicate related titles, “trusted reviews” claim with no reviews. Trust broken.

**Matt’s Neighbor (Central Valley homeowner)**: Needs proof of local craft in seconds; gets keyword essays and a cropped banner. Calls the painter who showed a porch, a named review, and a badge.

#### Minor Observations

- Aside image `h-48`/`sm:h-56` too short; severe crop of a tall asset.
- Identical H2 + blue rule pattern kills rhythm.
- FAQ always expanded: good for SEO, long on mobile.
- `ogImageAlt` promises scene-specific imagery; asset is always `hero-banner.webp`.
- Commercial page never shows a commercial project.
- Detector: line length and contrast flags on body/secondary text; glow accents on dark surfaces.
- Cognitive load: 4/8 checklist failures (high).

#### Questions to Consider

1. If the homepage is the shop truck, why are SEO landings the brochure left in the glove box?
2. Would Matt’s Neighbor trust you faster from one honest job photo than from 600 words that say “painting company” nine times?
3. What if `#contact-cta` *was* the form — service-tagged — so the page that ranked also closed?
4. Can a “local Sanger” page look different from a “commercial” page without seven unique codebases?
5. You’re already claiming reviews in the benefits list — why is the review still a click away on the homepage?
