/**
 * Paint-themed decorative SVG components for section transitions,
 * heading accents, and background textures.
 */

/* ───────────────────────────────────────────
   Paint Drip — section divider that sits at
   the bottom of a section, dripping into the
   next one. Flip for top placement.
   ─────────────────────────────────────────── */
export function PaintDrip({
  color = "currentColor",
  flip = false,
  className = "",
}: {
  color?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`block w-full ${flip ? "rotate-180" : ""} ${className}`}
      style={{ height: "clamp(40px, 6vw, 80px)" }}
      aria-hidden="true"
    >
      <path
        d={`
          M0,0 L1440,0
          L1440,40
          C1380,42 1340,38 1300,40
          C1240,44 1200,55 1160,50
          C1120,44 1100,36 1060,40
          C1020,46 1000,60 960,55
          C920,48 900,40 860,42
          C800,48 780,70 740,80
          C720,85 710,90 700,95
          C692,100 688,105 684,95
          C678,80 670,60 640,50
          C600,36 560,42 520,40
          C480,36 440,50 400,55
          C360,62 340,70 300,65
          C280,62 270,80 260,90
          C252,98 248,105 244,100
          C236,85 220,55 180,48
          C140,38 100,42 60,40
          C30,38 10,40 0,40
          Z
        `}
        fill={color}
      />
    </svg>
  );
}

/* ───────────────────────────────────────────
   Paint Drip Alt — second variation with
   different drip positions for variety.
   ─────────────────────────────────────────── */
export function PaintDripAlt({
  color = "currentColor",
  flip = false,
  className = "",
}: {
  color?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`block w-full ${flip ? "rotate-180" : ""} ${className}`}
      style={{ height: "clamp(40px, 6vw, 80px)" }}
      aria-hidden="true"
    >
      <path
        d={`
          M0,0 L1440,0
          L1440,40
          C1400,42 1380,38 1340,40
          C1300,46 1280,65 1240,70
          C1220,74 1210,85 1200,95
          C1192,104 1188,108 1184,98
          C1176,80 1160,50 1120,42
          C1080,34 1040,40 1000,38
          C960,34 920,45 880,50
          C840,56 800,42 760,40
          C720,36 680,48 640,55
          C600,64 580,75 540,70
          C500,62 480,40 440,38
          C400,34 360,50 320,60
          C300,66 290,80 280,90
          C272,100 268,108 264,98
          C256,82 240,50 200,42
          C160,32 120,40 80,42
          C40,46 20,40 0,40
          Z
        `}
        fill={color}
      />
    </svg>
  );
}

/* ───────────────────────────────────────────
   Brush Stroke Underline — sits under a
   heading to give a hand-painted feel.
   ─────────────────────────────────────────── */
export function BrushStroke({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      className={`h-2 w-32 sm:w-40 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M2,8 C20,3 40,6 60,4 C80,2 100,7 120,5 C140,3 160,8 180,4 C190,3 196,6 198,5"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

/* ───────────────────────────────────────────
   Paint Splatter — decorative blob for
   background accents. Position with absolute.
   ─────────────────────────────────────────── */
export function PaintSplatter({
  className = "",
  color = "currentColor",
  size = 120,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <g fill={color}>
        {/* Main blob */}
        <ellipse cx="100" cy="100" rx="60" ry="55" opacity="0.12" />
        {/* Satellite drops */}
        <circle cx="45" cy="65" r="12" opacity="0.08" />
        <circle cx="155" cy="70" r="10" opacity="0.10" />
        <circle cx="60" cy="150" r="8" opacity="0.07" />
        <circle cx="148" cy="145" r="14" opacity="0.09" />
        <circle cx="30" cy="110" r="6" opacity="0.06" />
        <circle cx="170" cy="115" r="7" opacity="0.08" />
        {/* Tiny flecks */}
        <circle cx="80" cy="40" r="4" opacity="0.06" />
        <circle cx="130" cy="35" r="3" opacity="0.05" />
        <circle cx="75" cy="165" r="5" opacity="0.06" />
        <circle cx="135" cy="170" r="3" opacity="0.05" />
      </g>
    </svg>
  );
}

/* ───────────────────────────────────────────
   Paint Roller Stripe — a horizontal stripe
   with rough edges, like a roller pass.
   ─────────────────────────────────────────── */
export function RollerStripe({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 20"
      preserveAspectRatio="none"
      className={`h-3 w-full ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0,10 C10,6 20,12 40,8 C60,4 80,14 100,10 C120,6 140,13 160,9 C180,5 200,12 220,10 C240,7 260,14 280,9 C300,4 320,13 340,10 C360,7 380,11 400,10"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        opacity="0.15"
      />
    </svg>
  );
}
