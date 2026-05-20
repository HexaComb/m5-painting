---
name: "M5 Painting"
description: "A warm, grounded brand system for a family-owned Central Valley painting business."
colors:
  brand-black: "oklch(0.10 0.012 262)"
  brand-navy: "oklch(0.26 0.11 262)"
  brand-blue: "oklch(0.50 0.12 252)"
  brand-electric: "oklch(0.64 0.16 248)"
  brand-chrome: "oklch(0.72 0.01 262)"
  background: "oklch(0.985 0.004 262)"
  foreground: "oklch(0.14 0.02 262)"
  card: "oklch(1 0.002 262)"
  muted: "oklch(0.96 0.006 262)"
  muted-foreground: "oklch(0.42 0.025 262)"
  border: "oklch(0.90 0.008 262)"
  on-dark: "oklch(0.97 0.006 262)"
  on-dark-secondary: "oklch(0.88 0.012 262)"
  on-dark-muted: "oklch(0.76 0.012 262)"
  destructive: "oklch(0.577 0.245 27.325)"
typography:
  display:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 5vw + 1rem, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3vw + 0.5rem, 3rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2vw + 0.25rem, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Lato, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0"
  label:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.12em"
rounded:
  sm: "calc(0.5rem * 0.6)"
  md: "calc(0.5rem * 0.8)"
  lg: "0.5rem"
  xl: "calc(0.5rem * 1.4)"
  2xl: "calc(0.5rem * 1.8)"
spacing:
  section-y: "clamp(5rem, 8vw, 7rem)"
  container-x: "1.25rem"
  container-x-sm: "1.5rem"
  card: "1.75rem"
  form-gap: "1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.on-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0.875rem 1.75rem"
    height: "auto"
  button-outline-dark:
    backgroundColor: "oklch(1 0 0 / 5%)"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "0.875rem 1.5rem"
  card-standard:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 0.75rem"
    height: "2.75rem"
---

# Design System: M5 Painting

## 1. Overview

**Creative North Star: "The Well-Painted Shop Truck"**

M5 Painting should feel local, capable, and visibly cared for: the kind of business whose truck, ladder rack, and jobsite signage are clean because the crew takes pride in the details. The interface is a brand surface first. It should make visitors feel they are meeting real Central Valley people who do careful work, then move them toward a call or free estimate without friction.

The system uses a committed blue strategy. Blue is not a generic tech accent here; it is paint. Dark navy and black surfaces give the logo weight, electric blue carries action and craft marks, and cool silver neutrals keep the site from feeling dusty or template-like. Real project photos, the logo, the LBI badge, and paint-specific textures should do more trust-building than decorative UI.

**Key Characteristics:**
- Committed logo blues across hero, CTA, section marks, and dark service surfaces.
- Warm but confident typography: Montserrat for sturdy headings, Lato for readable body copy.
- Real imagery and proof points before abstract claims.
- Section rhythm varies between dark brand moments, light textured content, muted proof areas, and direct form surfaces.
- Components are practical and familiar, with paint-shop polish rather than software gloss.

## 2. Colors

The palette is cool, logo-derived, and intentionally blue-forward, balanced by tinted near-whites and chrome-like neutrals.

### Primary
- **Shop Black** (`oklch(0.10 0.012 262)`): The deepest brand field, used for the fixed header, hero base, service cards, and footer-like surfaces. Never replace it with pure black.
- **Deep Navy Paint** (`oklch(0.26 0.11 262)`): The structural dark blue in gradients and shadows. It should feel like the depth behind fresh blue paint, not corporate navy.
- **M5 Blue** (`oklch(0.50 0.12 252)`): The main brand action color for primary buttons, section rules, chart accents, and icon containers.
- **Electric Roller Blue** (`oklch(0.64 0.16 248)`): The high-energy highlight from the logo, reserved for glows, brush strokes, active marks, and small emphasis on dark surfaces.

### Secondary
- **Chrome Silver** (`oklch(0.72 0.01 262)`): The cool metallic support color for dark-surface secondary text, logo-adjacent details, and quiet dividing marks.

### Neutral
- **Cool Worksite White** (`oklch(0.985 0.004 262)`): The page background. It is tinted, not pure white.
- **Ink Blue-Black** (`oklch(0.14 0.02 262)`): Primary light-surface text.
- **Soft Panel White** (`oklch(1 0.002 262)`): Card and form surface. Use sparingly so the page does not become a stack of white cards.
- **Blue-Tinted Mist** (`oklch(0.96 0.006 262)`): Muted bands, card footers, and low-contrast background changes.
- **Measured Gray Blue** (`oklch(0.42 0.025 262)`): Secondary text on light surfaces.
- **Cool Hairline** (`oklch(0.90 0.008 262)`): Borders, input strokes, and separators.

### Named Rules
**The Blue Is Paint Rule.** Use brand blue as a material, not decoration. It can cover whole buttons, rules, icon tiles, and dark gradients, but it should not become a scattered accent on every object.

**The Tinted Neutral Rule.** Never use `#000` or `#fff`. Every neutral should keep the cool brand hue, even when it reads as black or white.

## 3. Typography

**Display Font:** Montserrat, with system-ui fallback  
**Body Font:** Lato, with sans-serif fallback  
**Label/Mono Font:** Montserrat for labels. No mono is part of the public brand system.

**Character:** Montserrat gives headings the square-shouldered confidence of signage and work vehicles. Lato keeps body copy approachable and easy to scan on mobile, where most estimate shoppers will arrive.

### Hierarchy
- **Display** (800, `clamp(2.75rem, 5vw + 1rem, 4.5rem)`, 1.05): Hero headlines only. Use for the first-view promise, with one electric-blue phrase when useful.
- **Headline** (700, `clamp(2rem, 3vw + 0.5rem, 3rem)`, 1.12): Section titles and major trust-building statements.
- **Title** (700, `clamp(1.5rem, 2vw + 0.25rem, 2.25rem)`, 1.2): Service names, card titles, and compact feature headings.
- **Body Large** (400 or 700, `clamp(1.05rem, 1vw + 0.25rem, 1.2rem)`, 1.65): Intro paragraphs and section descriptions. Keep prose at or under 65ch.
- **Body** (400, `1rem`, 1.6): Forms, supporting paragraphs, card copy, and operational content.
- **Label** (700, `0.75rem`, `0.12em`, uppercase): Section kickers and small categorical marks. Use intentionally, not above every possible heading.

### Named Rules
**The Signage Rule.** Headings should feel like clean local signage: strong, legible, and direct. Avoid delicate editorial type, italic display affectation, or ultra-light weights.

## 4. Elevation

Depth is a hybrid of tonal layering, rings, and restrained brand glow. Large site sections should be separated by color, texture, imagery, or spacing before shadow. Shadows are for interactive confidence and foregrounded form surfaces, not for turning every section into a floating card.

### Shadow Vocabulary
- **Brand Glow** (`0 0 0 1px oklch(0.64 0.16 248 / 25%), 0 8px 32px oklch(0.50 0.12 252 / 35%), 0 2px 8px oklch(0 0 0 / 40%)`): Primary CTAs, hero actions, and icon marks on dark surfaces.
- **Header Lock** (`shadow-lg shadow-black/50`): Fixed header after scroll, paired with `bg-brand-black/95` and backdrop blur.
- **Form Lift** (`shadow-lg shadow-brand-navy/5`): Contact form container on light surfaces.
- **Service Weight** (`shadow-xl shadow-brand-navy/20`): Dark service cards where depth helps the panel feel substantial.
- **Thin Ring** (`ring-1 ring-foreground/10`): Default card boundary in the UI kit.

### Named Rules
**The Surface First Rule.** Use color fields and real layout changes before adding elevation. Shadows should confirm hierarchy, not create it from nothing.

## 5. Components

### Buttons
- **Shape:** Rounded practical rectangles (`rounded-lg`, base radius `0.5rem`), not pill buttons.
- **Primary:** Brand blue gradient or `bg-primary`, white text, bold weight, and generous action padding (`0.875rem 1.75rem` on marketing CTAs).
- **Hover / Focus:** Hover can reduce opacity or deepen background. Focus uses `focus-visible:ring-3 focus-visible:ring-ring/50` with electric blue.
- **Secondary / Ghost / Tertiary:** Outline buttons on dark surfaces use white at low opacity with chrome borders. Ghost buttons are for header phone and navigation utility actions only.

### Chips
- **Style:** The public brand has small proof marks rather than generic chips: star ratings, the LBI badge, and tiny electric-blue bullets.
- **State:** Use compact icon-plus-text marks for proof and trust. Avoid pill-chip grids unless the content is a real filter or selection control.

### Cards / Containers
- **Corner Style:** `rounded-xl` for marketing panels and default cards.
- **Background:** Use `bg-card` for form surfaces, `bg-brand-black` for service panels, and `bg-muted/40` for broad section bands.
- **Shadow Strategy:** Pair dark cards with service weight; pair forms with form lift; use thin rings for internal admin/UI kit cards.
- **Border:** Use cool hairline borders or subtle navy/electric-blue opacity borders. Do not use thick side stripes.
- **Internal Padding:** Marketing cards use `p-7` to `p-8`; UI kit cards use `py-4` with `px-4` internals.

### Inputs / Fields
- **Style:** `rounded-lg`, cool border, background surface, 44px height for public contact fields.
- **Focus:** Electric-blue focus ring and border shift. Keep it visible on mobile.
- **Error / Disabled:** Destructive red is available for invalid states; disabled fields lower opacity and use an input tint.

### Navigation
- **Style:** Fixed transparent header over the hero, switching to `bg-brand-black/95`, subtle border, backdrop blur, and shadow after scroll.
- **Typography:** Small, semibold nav labels in white or on-dark secondary. Logo remains the strongest header signal.
- **Default / Hover / Active:** Hover shifts text toward full on-dark color and may add a low-opacity white background. The estimate button stays primary.
- **Mobile:** Menu opens as a dark panel below the header with large tap targets and the phone number separated as a direct action.

### Paint Marks
Brush underlines, roller edges, paint drips, subtle speckle texture, and electric glows are signature components. They should feel like paint behavior translated into interface marks. Use them to separate sections, underline a real phrase, or add surface character, not as filler.

## 6. Do's and Don'ts

### Do:
- **Do** lead with real work, real badges, real reviews, and clear contact actions. The brand earns trust through evidence.
- **Do** use the committed blue system: Shop Black, Deep Navy Paint, M5 Blue, and Electric Roller Blue.
- **Do** keep CTA text direct: "Free Estimate", "Send It Over", "Let's Start Your Project".
- **Do** vary section composition so the page does not become a repeated card grid.
- **Do** preserve WCAG AA contrast, especially on white-on-blue and white-on-navy surfaces.
- **Do** respect reduced motion; reveal animations must become static when users request less motion.

### Don't:
- **Don't** make this look like generic contractor website templates with stock photos, cookie-cutter layouts, or "Your Trusted Partner" headings.
- **Don't** use cold corporate SaaS aesthetics: Inter font, purple gradients, metric dashboards, glassy panels, or tech startup pacing.
- **Don't** make the site overly minimalist in a way that feels empty or hides the family business.
- **Don't** create a busy small-business layout with too many fonts, colors, badges, or competing calls to action.
- **Don't** make M5 Painting look like a Silicon Valley startup.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent on cards, list items, callouts, or alerts.
- **Don't** use gradient text. Blue should be a surface, a stroke, a glow, or a button, not clipped typography.
- **Don't** put UI cards inside other cards or turn every section into a floating card.
